from app import db
from app.models.department import Department
from app.models.organization import Organization
from app.services.activity_service import ActivityService
from app.services.outcome_service import OutcomeService
from sqlalchemy.exc import IntegrityError
from flask import abort


class DepartmentService:
    
    DEFAULT_DEPARTMENTS = [
        {
            'name': 'Leadership/CEO',
            'type': 'leadership',
            'icon': 'target',
            'description': 'Executive leadership and strategic direction'
        },
        {
            'name': 'Finance',
            'type': 'finance',
            'icon': 'dollar-sign',
            'description': 'Financial planning and management'
        },
        {
            'name': 'People/HR',
            'type': 'people',
            'icon': 'users',
            'description': 'Human resources and team management'
        },
        {
            'name': 'Sales',
            'type': 'sales',
            'icon': 'trending-up',
            'description': 'Sales operations and revenue generation'
        },
        {
            'name': 'Operations',
            'type': 'operations',
            'icon': 'settings',
            'description': 'Operational efficiency and delivery'
        },
        {
            'name': 'Customer/Support',
            'type': 'customer',
            'icon': 'headphones',
            'description': 'Customer success and support'
        },
    ]
    
    @staticmethod
    def create_default_departments(organization_id, owner_id=None):
        """Create default departments for a new organization"""
        departments = []
        
        for dept_data in DepartmentService.DEFAULT_DEPARTMENTS:
            dept = Department(
                organization_id=organization_id,
                name=dept_data['name'],
                type=dept_data['type'],
                icon=dept_data['icon'],
                description=dept_data['description'],
                is_default=True,
                is_custom=False,
                owner_id=owner_id
            )
            db.session.add(dept)
            departments.append(dept)
        
        db.session.commit()
        
        # Create default activities and outcomes for each department
        for dept in departments:
            ActivityService.create_default_activities(dept.id, owner_id)
            OutcomeService.create_default_outcomes(dept.id, owner_id)
        
        return departments
    
    @staticmethod
    def get_all(organization_id, filters=None):
        """Get all departments for an organization with optional filters"""
        query = Department.query.filter_by(organization_id=organization_id)
        
        if filters:
            if 'type' in filters:
                query = query.filter_by(type=filters['type'])
            if 'owner_id' in filters:
                query = query.filter_by(owner_id=filters['owner_id'])
            if 'include_custom' in filters and not filters['include_custom']:
                query = query.filter_by(is_custom=False)
        
        return query.all()
    
    @staticmethod
    def get_by_id(department_id, organization_id=None):
        """Get department by ID with organization verification"""
        if organization_id:
            dept = Department.query.filter_by(
                id=department_id,
                organization_id=organization_id
            ).first()
        else:
            dept = Department.query.get(department_id)
        
        if not dept:
            abort(404, description="Department not found")
        
        return dept
    
    @staticmethod
    def create(organization_id, data, owner_id):
        """Create a new custom department with default activities and outcomes"""
        # Check tier permissions
        org = Organization.query.get(organization_id)
        if not org:
            abort(404, description="Organization not found")
            
        if org.subscription_tier != 'premium':
            abort(403, description="Premium subscription required for custom departments")
        
        # Check custom department limit
        custom_count = Department.query.filter_by(
            organization_id=organization_id,
            is_custom=True
        ).count()
        
        if custom_count >= 20:
            abort(422, description="Maximum custom departments limit reached (20)")
        
        try:
            department = Department(
                organization_id=organization_id,
                name=data['name'],
                type='custom',
                is_custom=True,
                owner_id=data.get('owner_id', owner_id),
                icon=data.get('icon', 'folder'),
                description=data.get('description', '')
            )
            
            db.session.add(department)
            db.session.commit()
            
            # Create default activities for this department
            ActivityService.create_default_activities(department.id, owner_id)
            
            # Create default outcomes for this department
            OutcomeService.create_default_outcomes(department.id, owner_id)
            
            return department, None
            
        except IntegrityError:
            db.session.rollback()
            return None, "Department name already exists"
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def update(department_id, organization_id, data):
        """Update department configuration"""
        dept = DepartmentService.get_by_id(department_id, organization_id)
        
        # Only allow updating certain fields for default departments
        if dept.is_default:
            allowed_fields = ['icon', 'description', 'owner_id']
            for key in data:
                if key not in allowed_fields:
                    abort(422, description=f"Cannot modify {key} for default departments")
        
        try:
            for key, value in data.items():
                if hasattr(dept, key) and key not in ['id', 'created_at', 'organization_id', 'type']:
                    setattr(dept, key, value)
            
            db.session.commit()
            return dept, None
            
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def delete(department_id, organization_id):
        """Delete a custom department"""
        dept = DepartmentService.get_by_id(department_id, organization_id)
        
        if dept.is_default:
            abort(422, description="Cannot delete default departments")
        
        try:
            db.session.delete(dept)
            db.session.commit()
            return True, None
            
        except Exception as e:
            db.session.rollback()
            return False, str(e)
    
    @staticmethod
    def get_with_metrics(department_id, organization_id=None):
        """Get department with aggregated metrics"""
        dept = DepartmentService.get_by_id(department_id, organization_id)
        dept_dict = dept.to_dict(include_relations=True)
        
        # Add metrics
        dept_dict['outcome_count'] = len(dept.outcomes)
        dept_dict['activity_count'] = len([a for a in dept.activities if a.status != 'cancelled'])
        
        # Count critical signals
        critical_signals = 0
        for outcome in dept.outcomes:
            for signal in outcome.signals:
                if signal.status == 'critical':
                    critical_signals += 1
        
        dept_dict['critical_signals'] = critical_signals
        
        return dept_dict