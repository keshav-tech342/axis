from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.services.department_service import DepartmentService

bp = Blueprint("departments", __name__, url_prefix="/api/v1/departments")

@bp.route("", methods=["GET"])
@jwt_required()
def get_departments():
    user = User.query.get(get_jwt_identity())
    include_stats = request.args.get("include_stats") == "true"

    departments = DepartmentService.get_all(user.organization_id)

    return jsonify({
        "success": True,
        "data": {
            "departments": [
                d.to_dict(include_stats=include_stats)
                for d in departments
            ]
        }
    }), 200
