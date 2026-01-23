from datetime import datetime
import uuid
from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    last_login = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'organization_id': self.organization_id,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    # Add this method to User model class

    def get_roles(self, department_id=None):
        """Get user's roles, optionally filtered by department"""
        from app.models.user_role import UserRole
        
        query = UserRole.query.filter_by(user_id=self.id)
        
        if department_id:
            query = query.filter_by(department_id=department_id)
        
        return query.all()

    def has_role(self, role_type, department_id=None):
        """Check if user has a specific role type"""
        from app.models.user_role import UserRole
        from app.models.role import Role
        
        query = UserRole.query.join(Role).filter(
            UserRole.user_id == self.id,
            Role.type == role_type
        )
        
        if department_id:
            query = query.filter(UserRole.department_id == department_id)
        
        return query.first() is not None

    def has_permission(self, permission, department_id=None):
        """Check if user has a specific permission"""
        roles = self.get_roles(department_id)
        
        for user_role in roles:
            role = user_role.role
            if permission in role.permissions.get('permissions', []):
                return True
        
        return False