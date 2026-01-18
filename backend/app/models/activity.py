from app import db
from datetime import datetime
import uuid

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
    config = db.Column(db.JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'department_id': self.department_id,
            'name': self.name,
            'type': self.type,
            'description': self.description,
            'status': self.status,
            'required_role': self.required_role,
            'tier_required': self.tier_required,
            'owner_id': self.owner_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
    
    def __repr__(self):
        return f'<Activity {self.name}>'