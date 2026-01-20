from app import db
from app.models.activity import Activity
from app.models.department import Department
from app.models.user import User
from datetime import datetime, timedelta
from sqlalchemy.exc import IntegrityError

class ActivityService:
    
    # Default activities for each department type
    DEFAULT_ACTIVITIES = {
        'leadership': [
            {'name': 'Review Company KPIs', 'type': 'review', 'priority': 'high'},
            {'name': 'Approve Strategic Initiative', 'type': 'approve', 'priority': 'high'},
            {'name': 'Weekly Team Sync', 'type': 'track', 'priority': 'medium'},
        ],
        'finance': [
            {'name': 'Review Monthly Budget', 'type': 'review', 'priority': 'high'},
            {'name': 'Approve Expense Request', 'type': 'approve', 'priority': 'medium'},
            {'name': 'Update Cash Flow Forecast', 'type': 'update', 'priority': 'high'},
            {'name': 'Track Revenue Metrics', 'type': 'track', 'priority': 'medium'},
        ],
        'people': [
            {'name': 'Review Hiring Pipeline', 'type': 'review', 'priority': 'high'},
            {'name': 'Approve New Hire', 'type': 'approve', 'priority': 'high'},
            {'name': 'Track Attrition Rate', 'type': 'track', 'priority': 'medium'},
            {'name': 'Conduct Performance Review', 'type': 'execute', 'priority': 'medium'},
        ],
        'sales': [
            {'name': 'Review Sales Pipeline', 'type': 'review', 'priority': 'high'},
            {'name': 'Approve Deal Discount', 'type': 'approve', 'priority': 'high'},
            {'name': 'Update Revenue Forecast', 'type': 'update', 'priority': 'high'},
            {'name': 'Track Win Rate', 'type': 'track', 'priority': 'medium'},
        ],
        'operations': [
            {'name': 'Review Project Status', 'type': 'review', 'priority': 'medium'},
            {'name': 'Approve Workflow Change', 'type': 'approve', 'priority': 'medium'},
            {'name': 'Track Delivery Metrics', 'type': 'track', 'priority': 'high'},
        ],
        'customer': [
            {'name': 'Review Customer Feedback', 'type': 'review', 'priority': 'high'},
            {'name': 'Escalate Critical Issue', 'type': 'execute', 'priority': 'critical'},
            {'name': 'Track CSAT Score', 'type': 'track', 'priority': 'high'},
        ],
    }
    
    @staticmethod
    def create_default_activities(department_id, owner_id=None):
        """Create default activities for a department"""
        department = Department.query.get(department_id)
        if not department:
            return []
        
        activities_config = ActivityService.DEFAULT_ACTIVITIES.get(department.type, [])
        activities = []
        
        for config in activities_config:
            activity = Activity(
                department_id=department_id,
                name=config['name'],
                type=config['type'],
                description=f"Default {config['type']} activity for {department.name}",
                priority=config['priority'],
                status='pending',
                owner_id=owner_id,
                tier_required='free'  # Default activities available to all
            )
            db.session.add(activity)
            activities.append(activity)
        
        db.session.commit()
        return activities
    
    @staticmethod
    def get_all(filters=None):
        """Get all activities with filters"""
        query = Activity.query
        
        if filters:
            if 'department_id' in filters:
                query = query.filter_by(department_id=filters['department_id'])
            if 'status' in filters:
                query = query.filter_by(status=filters['status'])
            if 'assigned_to' in filters:
                query = query.filter_by(assigned_to=filters['assigned_to'])
            if 'priority' in filters:
                query = query.filter_by(priority=filters['priority'])
        
        return query.order_by(Activity.created_at.desc()).all()
    
    @staticmethod
    def get_by_id(activity_id):
        """Get activity by ID"""
        return Activity.query.get(activity_id)
    
    @staticmethod
    def create(data, user_id):
        """Create a new activity"""
        try:
            activity = Activity(
                department_id=data['department_id'],
                name=data['name'],
                type=data.get('type', 'execute'),
                description=data.get('description'),
                priority=data.get('priority', 'medium'),
                owner_id=user_id,
                assigned_to=data.get('assigned_to'),
                due_date=data.get('due_date'),
                tier_required=data.get('tier_required', 'free')
            )
            
            db.session.add(activity)
            db.session.commit()
            
            return activity, None
            
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def update(activity_id, data):
        """Update an activity"""
        activity = Activity.query.get(activity_id)
        
        if not activity:
            return None, "Activity not found"
        
        try:
            for key, value in data.items():
                if hasattr(activity, key) and key not in ['id', 'created_at']:
                    setattr(activity, key, value)
            
            activity.updated_at = datetime.utcnow()
            db.session.commit()
            
            return activity, None
            
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def execute(activity_id, user_id, execution_data=None):
        """Execute an activity"""
        activity = Activity.query.get(activity_id)
        
        if not activity:
            return None, "Activity not found"
        
        user = User.query.get(user_id)
        
        try:
            activity.execute(user, execution_data)
            db.session.commit()
            
            return activity, None
            
        except PermissionError as e:
            return None, str(e)
        except ValueError as e:
            return None, str(e)
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def delete(activity_id):
        """Delete an activity"""
        activity = Activity.query.get(activity_id)
        
        if not activity:
            return False, "Activity not found"
        
        try:
            db.session.delete(activity)
            db.session.commit()
            return True, None
            
        except Exception as e:
            db.session.rollback()
            return False, str(e)