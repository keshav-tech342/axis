from app import db
from datetime import datetime
import uuid

class UserRole(db.Model):
    __tablename__ = 'user_roles'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    role_id = db.Column(db.String(36), db.ForeignKey('roles.id'), nullable=False)
    department_id = db.Column(db.String(36), db.ForeignKey('departments.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='user_roles')
    role = db.relationship('Role', backref='user_roles')
    department = db.relationship('Department', backref='user_roles')
    
    def to_dict(self, include_relations=False):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'role_id': self.role_id,
            'department_id': self.department_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_relations:
            if self.user:
                data['user'] = {
                    'id': self.user.id,
                    'full_name': self.user.full_name,
                    'email': self.user.email
                }
            if self.role:
                data['role'] = self.role.to_dict()
            if self.department:
                data['department'] = {
                    'id': self.department.id,
                    'name': self.department.name,
                    'type': self.department.type
                }
        
        return data
    
    def __repr__(self):
        return f'<UserRole user:{self.user_id} role:{self.role_id}>'