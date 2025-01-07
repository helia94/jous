from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from domain.services.group_service import GroupService

group_api = Blueprint("group_api", __name__)
group_service = GroupService()

@group_api.route("/addgroup", methods=["POST"])
@jwt_required()
def add_group():
    data = request.get_json() or {}
    name = data.get("name")
    users = data.get("users", "")
    user_list = [u.strip() for u in users.split(",") if u.strip()]
    # Convert to user IDs, do any needed logic...
    # For now assume they're already integers or you have a method to convert
    user_ids = [int(uid) for uid in user_list]

    response, status_code = group_service.create_group(name, user_ids)
    return jsonify(response), status_code

@group_api.route("/adduserstogroup", methods=["POST"])
@jwt_required()
def add_user_to_group():
    data = request.get_json() or {}
    name = data.get("name")
    users = data.get("users", [])
    # Convert usernames to IDs if needed
    new_user_ids = [int(u) for u in users]

    response, status_code = group_service.add_users_to_group(name, new_user_ids)
    return jsonify(response), status_code
