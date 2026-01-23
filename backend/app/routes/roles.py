from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.role_service import RoleService
from app.models.user import User

bp = Blueprint('roles', __name__, url_prefix='/api/v1/roles')

@bp.route('', methods=['GET'])
@jwt_required()
def get_roles():
    """Get all roles for user's organization"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    roles = RoleService.get_all(user.organization_id)
    
    return jsonify({
        'success': True,
        'data': {
            'roles': [r.to_dict() for r in roles],
            'total': len(roles)
        }
    }), 200

@bp.route('/<role_id>', methods=['GET'])
@jwt_required()
def get_role(role_id):
    """Get role by ID"""
    role = RoleService.get_by_id(role_id)
    
    if not role:
        return jsonify({
            'success': False,
            'error': {'code': 'NOT_FOUND', 'message': 'Role not found'}
        }), 404
    
    return jsonify({
        'success': True,
        'data': role.to_dict()
    }), 200

@bp.route('/assign', methods=['POST'])
@jwt_required()
def assign_role():
    """Assign a role to a user"""
    data = request.get_json()
    
    if not data.get('user_id') or not data.get('role_id'):
        return jsonify({
            'success': False,
            'error': {'code': 'VALIDATION_ERROR', 'message': 'User ID and Role ID are required'}
        }), 400
    
    user_role, error = RoleService.assign_role(
        data['user_id'],
        data['role_id'],
        data.get('department_id')
    )
    
    if error:
        status_code = 409 if 'already assigned' in error else 400
        return jsonify({
            'success': False,
            'error': {'code': 'ASSIGNMENT_ERROR', 'message': error}
        }), status_code
    
    return jsonify({
        'success': True,
        'data': user_role.to_dict(include_relations=True),
        'message': 'Role assigned successfully'
    }), 201

@bp.route('/remove/<user_role_id>', methods=['DELETE'])
@jwt_required()
def remove_role(user_role_id):
    """Remove a role assignment"""
    success, error = RoleService.remove_role(user_role_id)
    
    if not success:
        return jsonify({
            'success': False,
            'error': {'code': 'REMOVAL_ERROR', 'message': error}
        }), 400
    
    return jsonify({
        'success': True,
        'message': 'Role removed successfully'
    }), 200

@bp.route('/user/<user_id>', methods=['GET'])
@jwt_required()
def get_user_roles(user_id):
    """Get all roles for a specific user"""
    department_id = request.args.get('department_id')
    
    user_roles = RoleService.get_user_roles(user_id, department_id)
    
    return jsonify({
        'success': True,
        'data': {
            'user_roles': [ur.to_dict(include_relations=True) for ur in user_roles],
            'total': len(user_roles)
        }
    }), 200

@bp.route('/department/<department_id>/users', methods=['GET'])
@jwt_required()
def get_department_users(department_id):
    """Get all users with roles in a department"""
    user_roles = RoleService.get_department_users(department_id)
    
    return jsonify({
        'success': True,
        'data': {
            'user_roles': [ur.to_dict(include_relations=True) for ur in user_roles],
            'total': len(user_roles)
        }
    }), 200