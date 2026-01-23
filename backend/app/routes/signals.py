from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.signal_service import SignalService

bp = Blueprint('signals', __name__, url_prefix='/api/v1/signals')

@bp.route('', methods=['GET'])
@jwt_required()
def get_signals():
    """Get all signals with filters"""
    filters = {
        'outcome_id': request.args.get('outcome_id'),
        'status': request.args.get('status'),
    }
    filters = {k: v for k, v in filters.items() if v is not None}
    
    signals = SignalService.get_all(filters)
    
    return jsonify({
        'success': True,
        'data': {
            'signals': [s.to_dict() for s in signals],
            'total': len(signals)
        }
    }), 200

@bp.route('/<signal_id>', methods=['GET'])
@jwt_required()
def get_signal(signal_id):
    """Get signal by ID"""
    signal = SignalService.get_by_id(signal_id)
    
    if not signal:
        return jsonify({
            'success': False,
            'error': {'code': 'NOT_FOUND', 'message': 'Signal not found'}
        }), 404
    
    return jsonify({
        'success': True,
        'data': signal.to_dict()
    }), 200

@bp.route('', methods=['POST'])
@jwt_required()
def create_signal():
    """Create a new signal"""
    data = request.get_json()
    
    if not data.get('outcome_id') or not data.get('name'):
        return jsonify({
            'success': False,
            'error': {'code': 'VALIDATION_ERROR', 'message': 'Outcome ID and name are required'}
        }), 400
    
    signal, error = SignalService.create(data)
    
    if error:
        return jsonify({
            'success': False,
            'error': {'code': 'CREATION_ERROR', 'message': error}
        }), 400
    
    return jsonify({
        'success': True,
        'data': signal.to_dict(),
        'message': 'Signal created successfully'
    }), 201

@bp.route('/<signal_id>/update-value', methods=['PUT'])
@jwt_required()
def update_signal_value(signal_id):
    """Update signal value"""
    data = request.get_json()
    
    if 'value' not in data:
        return jsonify({
            'success': False,
            'error': {'code': 'VALIDATION_ERROR', 'message': 'Value is required'}
        }), 400
    
    signal, error = SignalService.update_value(signal_id, data['value'])
    
    if error:
        return jsonify({
            'success': False,
            'error': {'code': 'UPDATE_ERROR', 'message': error}
        }), 400
    
    return jsonify({
        'success': True,
        'data': signal.to_dict(),
        'message': 'Signal value updated successfully'
    }), 200

@bp.route('/<signal_id>', methods=['PUT'])
@jwt_required()
def update_signal(signal_id):
    """Update signal properties"""
    data = request.get_json()
    
    signal, error = SignalService.update(signal_id, data)
    
    if error:
        return jsonify({
            'success': False,
            'error': {'code': 'UPDATE_ERROR', 'message': error}
        }), 400
    
    return jsonify({
        'success': True,
        'data': signal.to_dict(),
        'message': 'Signal updated successfully'
    }), 200

@bp.route('/<signal_id>', methods=['DELETE'])
@jwt_required()
def delete_signal(signal_id):
    """Delete a signal"""
    success, error = SignalService.delete(signal_id)
    
    if not success:
        return jsonify({
            'success': False,
            'error': {'code': 'DELETE_ERROR', 'message': error}
        }), 400
    
    return jsonify({
        'success': True,
        'message': 'Signal deleted successfully'
    }), 200

@bp.route('/critical', methods=['GET'])
@jwt_required()
def get_critical_signals():
    """Get all critical signals"""
    limit = request.args.get('limit', 10, type=int)
    signals = SignalService.get_critical_signals(limit)
    
    return jsonify({
        'success': True,
        'data': {
            'signals': [s.to_dict() for s in signals],
            'total': len(signals)
        }
    }), 200