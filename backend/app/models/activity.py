from app import db
from datetime import datetime
import uuid

class Activity(db.Model):
    __tablename__ = 'activities'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    department_id = db.Column(db.String(36), db.ForeignKey('departments.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(100), nullable=False)  # track, approve, review, update, execute
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='pending')  # pending, in_progress, completed, cancelled
    required_role = db.Column(db.String(100), nullable=True)
    tier_required = db.Column(db.String(50), default='free')
    owner_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    assigned_to = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, critical
    due_date = db.Column(db.DateTime, nullable=True)
    execution_data = db.Column(db.JSON, default=dict)
    config = db.Column(db.JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = db.relationship('User', foreign_keys=[owner_id], backref='owned_activities')
    assignee = db.relationship('User', foreign_keys=[assigned_to], backref='assigned_activities')
    
    def to_dict(self, include_relations=False):
        result = {
            'id': self.id,
            'department_id': self.department_id,
            'name': self.name,
            'type': self.type,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'required_role': self.required_role,
            'tier_required': self.tier_required,
            'owner_id': self.owner_id,
            'assigned_to': self.assigned_to,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'execution_data': self.execution_data,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_relations:
            if self.owner:
                result['owner'] = {
                    'id': self.owner.id,
                    'full_name': self.owner.full_name,
                    'email': self.owner.email
                }
            if self.assignee:
                result['assignee'] = {
                    'id': self.assignee.id,
                    'full_name': self.assignee.full_name,
                    'email': self.assignee.email
                }
            if self.department:
                result['department'] = {
                    'id': self.department.id,
                    'name': self.department.name,
                    'type': self.department.type
                }
        
        return result
    
    def can_execute(self, user):
        """Check if user can execute this activity"""
        # Free tier: read-only
        org = db.session.query(db.select(db.User).where(db.User.id == user.id)).scalar()
        if org and org.organization.subscription_tier == 'free':
            return False
        
        # Check if assigned to user or user is owner
        if self.assigned_to == user.id or self.owner_id == user.id:
            return True
        
        return False
    
    def execute(self, user, execution_data=None):
        """Execute the activity"""
        if not self.can_execute(user):
            raise PermissionError("User cannot execute this activity")
        
        if self.status == 'completed':
            raise ValueError("Activity is already completed")
        
        self.status = 'completed'
        self.completed_at = datetime.utcnow()
        if execution_data:
            self.execution_data = execution_data
        
        return self
    
    def __repr__(self):
        return f'<Activity {self.name}>'