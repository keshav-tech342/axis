from app import create_app, db
from app.models.organization import Organization
from app.models.department import Department
from app.services.department_service import DepartmentService

app = create_app()

def seed_default_departments():
    organizations = Organization.query.all()

    for org in organizations:
        exists = Department.query.filter_by(
            organization_id=org.id
        ).first()

        if not exists:
            print(f"Creating departments for {org.name}")
            DepartmentService.create_default_departments(org.id)
            print("✓ Done")
        else:
            print(f"Departments already exist for {org.name}")

if __name__ == "__main__":
    with app.app_context():
        seed_default_departments()
