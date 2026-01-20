from app.extensions import db
from app.models.department import Department
from app.services.activity_service import ActivityService

with app.app_context():
    print("🌱 Seeding activities for all departments...")
    
    departments = Department.query.all()
    
    total_created = 0
    for dept in departments:
        # Check if activities already exist
        existing = db.session.query(db.Activity).filter_by(department_id=dept.id).count()
        
        if existing > 0:
            print(f"  ⏭️  {dept.name} already has {existing} activities")
            continue
        
        activities = ActivityService.create_default_activities(dept.id)
        print(f"  ✓ Created {len(activities)} activities for {dept.name}")
        total_created += len(activities)
    
    print(f"\n🎉 Total activities created: {total_created}")