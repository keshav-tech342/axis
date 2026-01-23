from app import db, create_app
from app.models.department import Department
from app.services.outcome_service import OutcomeService

def seed_outcomes():
    """Seed default outcomes for all existing departments"""
    app = create_app()
    
    with app.app_context():
        departments = Department.query.filter_by(is_default=True).all()
        
        print(f"Found {len(departments)} default departments")
        
        for dept in departments:
            print(f"Creating outcomes for {dept.name}...")
            outcomes = OutcomeService.create_default_outcomes(dept.id, dept.owner_id)
            print(f"  Created {len(outcomes)} outcomes")
        
        print("✅ Outcome seeding complete!")

if __name__ == '__main__':
    seed_outcomes()