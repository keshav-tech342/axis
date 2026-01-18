from app.extensions import db
from app.models.department import Department

DEFAULT_DEPARTMENTS = [
    "Engineering",
    "HR",
    "Sales",
    "Marketing",
    "Finance",
    "Operations"
]

class DepartmentService:

    @staticmethod
    def create_default_departments(organization_id):
        departments = []

        for name in DEFAULT_DEPARTMENTS:
            dept = Department(
                name=name,
                type="default",
                organization_id=organization_id
            )
            departments.append(dept)

        db.session.bulk_save_objects(departments)
        db.session.commit()

        return departments

    @staticmethod
    def get_all(organization_id, filters=None):
        query = Department.query.filter_by(
            organization_id=organization_id
        )

        if filters:
            if filters.get("type"):
                query = query.filter_by(type=filters["type"])

        return query.order_by(Department.created_at.asc()).all()

    @staticmethod
    def get_by_id(department_id, organization_id):
        return Department.query.filter_by(
            id=department_id,
            organization_id=organization_id
        ).first()

    @staticmethod
    def create(organization_id, data, owner_id):
        dept = Department(
            name=data["name"],
            type="custom",
            organization_id=organization_id,
            owner_id=owner_id
        )

        db.session.add(dept)
        db.session.commit()

        return dept, None

    @staticmethod
    def update(department_id, organization_id, data):
        dept = DepartmentService.get_by_id(department_id, organization_id)

        if not dept:
            return None, "Department not found"

        dept.name = data.get("name", dept.name)
        db.session.commit()

        return dept, None

    @staticmethod
    def delete(department_id, organization_id):
        dept = DepartmentService.get_by_id(department_id, organization_id)

        if not dept:
            return False, "Department not found"

        if dept.type == "default":
            return False, "Default departments cannot be deleted"

        db.session.delete(dept)
        db.session.commit()

        return True, None
