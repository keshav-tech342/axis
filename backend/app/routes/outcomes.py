from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.outcome_service import OutcomeService

bp = Blueprint('outcomes', __name__, url_prefix='/api/v1/outcomes')

@bp.route('', methods=['GET'])
@jwt_required()
def get_outcomes():
    """Get all outcomes with filters"""
    filters = {
        'department_id': request.args.get('department_id'),
        'status': request.args.get('status'),
    }
    filters = {k: v for k, v in filters.items() if v is not None}
    
    outcomes = OutcomeService.get_all(filters)
    
    include_signals = request.args.get('include_signals', 'false').lower() == 'true'
    
    return jsonify({
        'success': True,
        'data': {
            'outcomes': [o.to_dict(include_signals=include_signals) for o in outcomes],
            'total': len(outcomes)
        }
    }), 200

@bp.route('/<outcome_id>', methods=['GET'])
@jwt_required()
def get_outcome(outcome_id):
    """Get outcome by ID with signals"""
    outcome = OutcomeService.get_with_signals(outcome_id)
    
    if not outcome:
        return jsonify({
            'success': False,
            'error': {'code': 'NOT_FOUND', 'message': 'Outcome not found'}
        }), 404
    
    return jsonify({
        'success': True,
        'data': outcome
    }), 200

@bp.route('', methods=['POST'])
@jwt_required()
def create_outcome():
    """Create a new outcome"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data.get('department_id') or not data.get('name'):
        return jsonify({
            'success': False,
            'error': {'code': 'VALIDATION_ERROR', 'message': 'Department ID and name are required'}
        }), 400
    
    outcome, error = OutcomeService.create(data, user_id)
    
    if error:
        return jsonify({
            'success': False,
            'error': {'code': 'CREATION_ERROR', 'message': error}
        }), 400
    
    return jsonify({
        'success': True,
        'data': outcome.to_dict(include_signals=True),
        'message': 'Outcome created successfully'
    }), 201

@bp.route('/<outcome_id>', methods=['PUT'])
@jwt_required()
def update_outcome(outcome_id):
    """Update an outcome"""
    data = request.get_json()
    
    outcome, error = OutcomeService.update(outcome_id, data)
    
    if error:
        return jsonify({
            'success': False,
            'error': {'code': 'UPDATE_ERROR', 'message': error}
        }), 400
    
    return jsonify({
        'success': True,
        'data': outcome.to_dict(include_signals=True),
        'message': 'Outcome updated successfully'
    }), 200

@bp.route('/<outcome_id>', methods=['DELETE'])
@jwt_required()
def delete_outcome(outcome_id):
    """Delete an outcome"""
    success, error = OutcomeService.delete(outcome_id)
    
    if not success:
        return jsonify({
            'success': False,
            'error': {'code': 'DELETE_ERROR', 'message': error}
        }), 400
    
    return jsonify({
        'success': True,
        'message': 'Outcome deleted successfully'
    }), 200