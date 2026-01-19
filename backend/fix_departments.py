from app import create_app, db
from app.models.user import User
from app.models.department import Department
from app.services.department_service import DepartmentService

app = create_app()

with app.app_context():
    print("🔍 Finding your user...")
    
    # Find your user
    user = User.query.filter_by(email='test@example.com').first()
    
    if not user:
        print("❌ User 'test@example.com' not found!")
        print("Available users:")
        all_users = User.query.all()
        for u in all_users:
            print(f"  - {u.email}")
        exit()
    
    print(f"✅ Found user: {user.email}")
    print(f"   Organization ID: {user.organization_id}")
    
    # Check existing departments
    existing_depts = Department.query.filter_by(organization_id=user.organization_id).all()
    print(f"\n📋 Existing departments: {len(existing_depts)}")
    for d in existing_depts:
        print(f"  - {d.name} ({d.type})")
    
    # Delete old departments
    print("\n🗑️  Deleting old departments...")
    for dept in existing_depts:
        db.session.delete(dept)
    db.session.commit()
    print("   ✅ Deleted!")
    
    # Create new default 6 departments
    print("\n🎨 Creating new default departments...")
    new_depts = DepartmentService.create_default_departments(user.organization_id)
    
    print(f"\n🎉 Successfully created {len(new_depts)} departments:")
    for d in new_depts:
        print(f"  ✓ {d.name} ({d.type}) - {d.icon}")
    
    print("\n✨ Done! Your departments are ready!")