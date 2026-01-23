from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.analytics_service import AnalyticsService
from app.models.user import User

bp = Blueprint('analytics', __name__, url_prefix='/api/v1/analytics')

@bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Get executive dashboard summary"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    dashboard_data = AnalyticsService.get_dashboard_summary(user.organization_id)
    
    return jsonify({
        'success': True,
        'data': dashboard_data
    }), 200

@bp.route('/trends/activities', methods=['GET'])
@jwt_required()
def get_activity_trends():
    """Get activity completion trends"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    days = request.args.get('days', 30, type=int)
    
    trend_data = AnalyticsService.get_activity_trends(user.organization_id, days)
    
    return jsonify({
        'success': True,
        'data': {
            'trends': trend_data,
            'period_days': days
        }
    }), 200

@bp.route('/outcomes/progress', methods=['GET'])
@jwt_required()
def get_outcome_progress():
    """Get outcome progress data"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    progress_data = AnalyticsService.get_outcome_progress(user.organization_id)
    
    return jsonify({
        'success': True,
        'data': {
            'outcomes': progress_data,
            'total': len(progress_data)
        }
    }), 200