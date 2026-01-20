from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.services.department_service import DepartmentService

bp = Blueprint("departments", __name__, url_prefix="/api/v1/departments")


# OPTIONS for a single department
@bp.route('/<department_id>', methods=['OPTIONS'])
def department_options(department_id):
    return '', 204


# GET all departments
@bp.route("", methods=["GET"])
@jwt_required()
def get_departments():
    user_id = get_jwt_identity()   # UUID string
    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "error": {"message": "User not found"}
        }), 404

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


# ✅ NEW: GET a single department
@bp.route("/<department_id>", methods=["GET"])
@jwt_required()
def get_department(department_id):
    user_id = get_jwt_identity()  # UUID string
    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "error": {"message": "User not found"}
        }), 404

    department = DepartmentService.get_by_id(department_id, user.organization_id)
    if not department:
        return jsonify({
            "success": False,
            "error": {"message": "Department not found"}
        }), 404

    include_stats = request.args.get("include_stats") == "true"
    return jsonify({
        "success": True,
        "data": department.to_dict(include_stats=include_stats)
    }), 200
