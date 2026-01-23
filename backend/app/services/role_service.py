from app import db
from app.models.role import Role
from app.models.user_role import UserRole
from app.models.organization import Organization
from sqlalchemy.exc import IntegrityError

class RoleService:
    
    # Default roles for each organization
    DEFAULT_ROLES = [
        {
            'name': 'Observer',
            'type': 'observer',
            'tier_required': 'free',
            'permissions': {
                'permissions': ['read:departments', 'read:activities', 'read:outcomes']
            }
        },
        {
            'name': 'Contributor',
            'type': 'contributor',
            'tier_required': 'free',
            'permissions': {
                'permissions': [
                    'read:departments', 'read:activities', 'read:outcomes',
                    'execute:activities', 'update:signals'
                ]
            }
        },
        {
            'name': 'Owner',
            'type': 'owner',
            'tier_required': 'basic_premium',
            'permissions': {
                'permissions': [
                    'read:departments', 'read:activities', 'read:outcomes',
                    'execute:activities', 'update:signals',
                    'approve:activities', 'manage:department'
                ]
            }
        },
        {
            'name': 'Decision Maker',
            'type': 'decision_maker',
            'tier_required': 'basic_premium',
            'permissions': {
                'permissions': [
                    'read:departments', 'read:activities', 'read:outcomes',
                    'execute:activities', 'update:signals',
                    'approve:activities', 'manage:department',
                    'create:decisions', 'access:simulations'
                ]
            }
        },
        {
            'name': 'Admin',
            'type': 'admin',
            'tier_required': 'free',
            'permissions': {
                'permissions': [
                    'read:*', 'write:*', 'delete:*',
                    'manage:users', 'manage:organization', 'manage:roles'
                ]
            }
        }
    ]
    
    @staticmethod
    def create_default_roles(organization_id):
        """Create default roles for a new organization"""
        roles = []
        
        for role_data in RoleService.DEFAULT_ROLES:
            role = Role(
                organization_id=organization_id,
                name=role_data['name'],
                type=role_data['type'],
                tier_required=role_data['tier_required'],
                permissions=role_data['permissions']
            )
            db.session.add(role)
            roles.append(role)
        
        db.session.commit()
        return roles
    
    @staticmethod
    def get_all(organization_id):
        """Get all roles for an organization"""
        return Role.query.filter_by(organization_id=organization_id).all()
    
    @staticmethod
    def get_by_id(role_id):
        """Get role by ID"""
        return Role.query.get(role_id)
    
    @staticmethod
    def get_by_type(organization_id, role_type):
        """Get role by type"""
        return Role.query.filter_by(
            organization_id=organization_id,
            type=role_type
        ).first()
    
    @staticmethod
    def assign_role(user_id, role_id, department_id=None):
        """Assign a role to a user"""
        # Check if already assigned
        existing = UserRole.query.filter_by(
            user_id=user_id,
            role_id=role_id,
            department_id=department_id
        ).first()
        
        if existing:
            return existing, "Role already assigned"
        
        try:
            user_role = UserRole(
                user_id=user_id,
                role_id=role_id,
                department_id=department_id
            )
            
            db.session.add(user_role)
            db.session.commit()
            
            return user_role, None
            
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def remove_role(user_role_id):
        """Remove a role assignment"""
        user_role = UserRole.query.get(user_role_id)
        
        if not user_role:
            return False, "Role assignment not found"
        
        try:
            db.session.delete(user_role)
            db.session.commit()
            return True, None
            
        except Exception as e:
            db.session.rollback()
            return False, str(e)
    
    @staticmethod
    def get_user_roles(user_id, department_id=None):
        """Get all roles assigned to a user"""
        query = UserRole.query.filter_by(user_id=user_id)
        
        if department_id:
            query = query.filter_by(department_id=department_id)
        
        return query.all()
    
    @staticmethod
    def get_department_users(department_id):
        """Get all users with roles in a department"""
        return UserRole.query.filter_by(department_id=department_id).all()