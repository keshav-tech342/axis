from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.activity_service import ActivityService
from app.models.user import User

bp = Blueprint('activities', __name__, url_prefix='/api/v1/activities')

@bp.route('', methods=['GET'])
@jwt_required()
def get_activities():
    """Get all activities with filters"""
    filters = {
        'department_id': request.args.get('department_id'),
        'status': request.args.get('status'),
        'assigned_to': request.args.get('assigned_to'),
        'priority': request.args.get('priority')
    }
    filters = {k: v for k, v in filters.items() if v is not None}
    
    include_relations = request.args.get('include_relations', 'false').lower() == 'true'
    
    activities = ActivityService.get_all(filters)
    
    return jsonify({
        'success': True,
        'data': {
            'activities': [a.to_dict(include_relations=include_relations) for a in activities],
            'total': len(activities)
        }
    }), 200

@bp.route('/<activity_id>', methods=['GET'])
@jwt_required()
def get_activity(activity_id):
    """Get activity by ID"""
    activity = ActivityService.get_by_id(activity_id)
    
    if not activity:
        return jsonify({
            'success': False,
            'error': {'code': 'NOT_FOUND', 'message': 'Activity not found'}
        }), 404
    
    return jsonify({
        'success': True,
        'data': activity.to_dict(include_relations=True)
    }), 200

@bp.route('', methods=['POST'])
@jwt_required()
def create_activity():
    """Create a new activity"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not data.get('department_id') or not data.get('name'):
        return jsonify({
            'success': False,
            'error': {'code': 'VALIDATION_ERROR', 'message': 'Department ID and name are required'}
        }), 400
    
    activity, error = ActivityService.create(data, user_id)
    
    if error:
        return jsonify({
            'success': False,
            'error': {'code': 'CREATION_ERROR', 'message': error}
        }), 400
    
    return jsonify({
        'success': True,
        'data': activity.to_dict(),
        'message': 'Activity created successfully'
    }), 201

@bp.route('/<activity_id>', methods=['PUT'])
@jwt_required()
def update_activity(activity_id):
    """Update an activity"""
    data = request.get_json()
    
    activity, error = ActivityService.update(activity_id, data)
    
    if error:
        return jsonify({
            'success': False,
            'error': {'code': 'UPDATE_ERROR', 'message': error}
        }), 400
    
    return jsonify({
        'success': True,
        'data': activity.to_dict(),
        'message': 'Activity updated successfully'
    }), 200

@bp.route('/<activity_id>/execute', methods=['POST'])
@jwt_required()
def execute_activity(activity_id):
    """Execute an activity"""
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    execution_data = data.get('execution_data', {})
    
    activity, error = ActivityService.execute(activity_id, user_id, execution_data)
    
    if error:
        status_code = 403 if 'cannot execute' in error.lower() else 400
        return jsonify({
            'success': False,
            'error': {'code': 'EXECUTION_ERROR', 'message': error}
        }), status_code
    
    return jsonify({
        'success': True,
        'data': activity.to_dict(),
        'message': 'Activity executed successfully'
    }), 200

@bp.route('/<activity_id>', methods=['DELETE'])
@jwt_required()
def delete_activity(activity_id):
    """Delete an activity"""
    success, error = ActivityService.delete(activity_id)
    
    if not success:
        return jsonify({
            'success': False,
            'error': {'code': 'DELETE_ERROR', 'message': error}
        }), 400
    
    return jsonify({
        'success': True,
        'message': 'Activity deleted successfully'
    }), 200