from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from domain.services.user_service import UserService

user_api = Blueprint("user_api", __name__)
user_service = UserService()

@user_api.route("/userquestions", methods=["POST"])
@user_api.route("/userquestions/<int:offset>", methods=["POST"])
def get_user_questions(offset=0):
    data = request.get_json() or {}
    username = data.get("username")
    questions = user_service.get_user_questions(username, offset=offset)
    if "error" in questions:
        return jsonify(questions), 400
    return jsonify(questions), 200

@user_api.route("/useranswers", methods=["POST"])
def get_user_answers():
    data = request.get_json() or {}
    username = data.get("username")
    answers = user_service.get_user_answers(username)
    if "error" in answers:
        return jsonify(answers), 400
    return jsonify(answers), 200

@user_api.route("/useranswerstoquestions", methods=["GET"])
@jwt_required()
def get_answers_to_user_question():
    uid = get_jwt_identity()
    answers = user_service.get_answers_to_user_questions(uid)
    if "error" in answers:
        return jsonify(answers), 400
    return jsonify(answers), 200
