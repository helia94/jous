from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from domain.services.user_service import UserService
from api.models.InvalidToken import InvalidToken
from inbound.transaction_utils import transactional

auth_api = Blueprint("auth_api", __name__)
user_service = UserService()


@auth_api.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email_or_username = data.get("email")
    password = data.get("pwd")

    response, status_code = user_service.login_user(email_or_username, password)
    if status_code == 200 and "id" in response:
        user_id = response["id"]
        token = create_access_token(identity=str(user_id))
        refresh_token = create_refresh_token(identity=str(user_id))
        return jsonify({"token": token, "refreshToken": refresh_token}), 200
    return jsonify(response), status_code

@auth_api.route("/register", methods=["POST"])
@transactional
def register():
    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email", "").lower()
    password = data.get("pwd")

    response, status_code = user_service.register_user(username, email, password)
    return jsonify(response), status_code

@auth_api.route("/checkiftokenexpire", methods=["POST"])
@jwt_required()
def check_if_token_expire():
    return jsonify({"success": True}), 200

@auth_api.route("/refreshtoken", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    token = create_access_token(identity=identity)
    return jsonify({"token": token}), 200

@auth_api.route("/logout/access", methods=["POST"])
@jwt_required()
def access_logout():
    jti = get_jwt()["jti"]
    invalid_token = InvalidToken(jti=jti)
    invalid_token.save()
    return jsonify({"success": True}), 200

@auth_api.route("/logout/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_logout():
    jti = get_jwt()["jti"]
    invalid_token = InvalidToken(jti=jti)
    invalid_token.save()
    return jsonify({"success": True}), 200

@auth_api.route("/changepassword", methods=["POST"])
@transactional
@jwt_required()
def change_password():
    data = request.get_json() or {}
    old_password = data.get("password")
    new_password = data.get("npassword")
    uid = get_jwt_identity()
    response, status_code = user_service.change_password(uid, old_password, new_password)
    return jsonify(response), status_code

@auth_api.route("/deleteaccount", methods=["DELETE"])
@transactional
@jwt_required()
def delete_account():
    uid = get_jwt_identity()
    response, status_code = user_service.delete_account(uid)
    return jsonify(response), status_code

@auth_api.route("/getcurrentuser", methods=["GET"])
@jwt_required()
def get_current_user():
    uid = get_jwt_identity()
    user_auth = user_service.user_repository.find_user_auth_by_id(uid)
    if not user_auth:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "id": user_auth.id,
        "username": user_auth.username,
        "email": user_auth.email
    }), 200
