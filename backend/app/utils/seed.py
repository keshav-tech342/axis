from app import create_app, db
from app.models.organization import Organization
from app.models.department import Department
from app.services.department_service import DEFAULT_DEPARTMENTS

app = create_app()

def seed_default_departments():
    organizations = Organization.query.all()

    for org in organizations:
        print(f"Checking departments for {org.name}")

        for name in DEFAULT_DEPARTMENTS:
            exists = Department.query.filter_by(
                organization_id=org.id,
                name=name
            ).first()

            if not exists:
                dept = Department(
                    name=name,
                    type="default",
                    organization_id=org.id
                )
                db.session.add(dept)
                print(f"  + Created {name}")

        db.session.commit()

        print("✓ Done")

if __name__ == "__main__":
    with app.app_context():
        seed_default_departments()
