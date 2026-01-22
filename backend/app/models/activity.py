from datetime import datetime
import uuid
from app.extensions import db


class Activity(db.Model):
    __tablename__ = 'activities'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    department_id = db.Column(db.String(36), db.ForeignKey('departments.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='pending')
    required_role = db.Column(db.String(100), nullable=True)
    tier_required = db.Column(db.String(50), default='free')
    owner_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    assigned_to = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    priority = db.Column(db.String(20), default='medium')
    due_date = db.Column(db.DateTime, nullable=True)
    execution_data = db.Column(db.JSON, default=dict)
    config = db.Column(db.JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = db.relationship('User', foreign_keys=[owner_id], backref=db.backref('owned_activities', lazy=True))
    assignee = db.relationship('User', foreign_keys=[assigned_to], backref=db.backref('assigned_activities', lazy=True))
    department = db.relationship('Department', backref=db.backref('activities', lazy=True), lazy=True)

    def execute(self, user, execution_data=None):
        """Execute the activity"""
        # Check if user can execute
        if not self._can_execute(user):
            raise PermissionError(f"User {user.email} cannot execute this activity")
        
        # Check if already completed
        if self.status == 'completed':
            raise ValueError("Activity is already completed")
        
        # Update status and execution data
        self.status = 'completed'
        self.completed_at = datetime.utcnow()
        
        if execution_data:
            self.execution_data = execution_data
        
        # TODO: Trigger automations and update related outcomes (Day 10)
        
        return self
    
    def _can_execute(self, user):
        """Check if user has permission to execute this activity"""
        # Owner and assignee can always execute
        if self.owner_id == user.id or self.assigned_to == user.id:
            return True
        
        # Check user roles (simplified for now)
        # TODO: Implement proper RBAC check (Day 12)
        return True

    def to_dict(self, include_relations=False):
        data = {
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
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

        if include_relations:
            if self.department:
                data['department'] = {
                    'id': self.department.id,
                    'name': self.department.name,
                    'type': self.department.type,
                }
            if self.owner:
                data['owner'] = {
                    'id': self.owner.id,
                    'full_name': self.owner.full_name,
                    'email': self.owner.email,
                }
            if self.assignee:
                data['assignee'] = {
                    'id': self.assignee.id,
                    'full_name': self.assignee.full_name,
                    'email': self.assignee.email,
                }

        return data

    def __repr__(self):
        return f'<Activity {self.name}>'