from app import db, create_app
from app.models.organization import Organization
from app.services.role_service import RoleService

def seed_roles():
    """Seed default roles for all existing organizations"""
    app = create_app()
    
    with app.app_context():
        organizations = Organization.query.all()
        
        print(f"Found {len(organizations)} organizations")
        
        for org in organizations:
            print(f"Creating roles for {org.name}...")
            roles = RoleService.create_default_roles(org.id)
            print(f"  Created {len(roles)} roles")
        
        print("✅ Role seeding complete!")

if __name__ == '__main__':
    seed_roles()