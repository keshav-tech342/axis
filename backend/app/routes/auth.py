from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

@bp.route('/register', methods=['POST'])
def register():
    """Register new user"""
    data = request.get_json()
    
    # Validate input
    required_fields = ['email', 'password', 'full_name', 'organization_name']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': f'Missing required field: {field}'
                }
            }), 400
    
    # Register user
    user, error = AuthService.register(
        email=data['email'],
        password=data['password'],
        full_name=data['full_name'],
        organization_name=data['organization_name']
    )
    
    if error:
        return jsonify({
            'success': False,
            'error': {
                'code': 'REGISTRATION_ERROR',
                'message': error
            }
        }), 400
    
    # Generate tokens
    access_token, refresh_token, _ = AuthService.login(data['email'], data['password'])
    
    return jsonify({
        'success': True,
        'data': {
            'user': user.to_dict(),
            'tokens': {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'expires_in': 3600
            }
        },
        'message': 'Registration successful'
    }), 201

@bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    # Validate input
    if not data.get('email') or not data.get('password'):
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Email and password are required'
            }
        }), 400
    
    # Authenticate
    access_token, refresh_token, error = AuthService.login(
        email=data['email'],
        password=data['password']
    )
    
    if error:
        return jsonify({
            'success': False,
            'error': {
                'code': 'AUTHENTICATION_ERROR',
                'message': error
            }
        }), 401
    
    # Get user data
    user = User.query.filter_by(email=data['email']).first()
    
    return jsonify({
        'success': True,
        'data': {
            'user': user.to_dict(),
            'tokens': {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'expires_in': 3600
            }
        }
    }), 200

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user info"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({
            'success': False,
            'error': {
                'code': 'USER_NOT_FOUND',
                'message': 'User not found'
            }
        }), 404
    
    return jsonify({
        'success': True,
        'data': user.to_dict()
    }), 200