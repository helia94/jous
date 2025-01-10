from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.domain.services.question_service import QuestionService
from backend.domain.services.answer_service import AnswerService
from backend.inbound.transaction_utils import transactional
from .utils import to_lower, to_lower_list, filter_none

question_api = Blueprint("question_api", __name__)
question_service = QuestionService()
answer_service = AnswerService()

@question_api.route("/questions", methods=["GET"])
def get_questions():
    query_params = {
        'offset': request.args.get('offset', type=int, default=None),
        'language_id': request.args.get('language_id', type=str, default=None),
        'occasion': request.args.get('occasion', type=str, default=None),
        'level': request.args.get('level', type=int, default=None)
    }
    
    # Remove keys with None values
    query_params = to_lower_list(filter_none(query_params))
    questions = question_service.get_questions(**query_params)
    
    return jsonify(questions), 200
    
    # Use these parameters to fetch questions
    questions = question_service.get_questions(
        offset=offset,
        language_id=language_id,
        occasion=occasion,
        level=level
    )
    
    return jsonify(questions), 200


@question_api.route("/question/<int:question_id>", methods=["GET"])
def get_question(question_id):
    data = question_service.get_question_by_id(question_id)
    if "error" in data:
        return jsonify(data), 404
    return jsonify(data), 200

@question_api.route("/question/random", methods=["GET"])
def get_random_question():
    random_question = question_service.get_random_question()
    if "error" in random_question:
        return jsonify(random_question), 404
    return jsonify(random_question), 200

@question_api.route("/addquestion", methods=["POST"])
@jwt_required(optional=True)
@transactional
def add_question():
    data = request.get_json() or {}
    content = data.get("content")
    anon_str = data.get("anon", "False")
    anon = (anon_str == "True")
    uid = get_jwt_identity()  # None if optional and user not logged in

    response, status_code = question_service.create_question(content, anon, uid)
    return jsonify(response), status_code

@question_api.route("/deletequestion/<int:question_id>", methods=["DELETE"])
@jwt_required()
@transactional
def delete_question(question_id):
    uid = get_jwt_identity()
    response, status_code = question_service.delete_question(question_id, uid)
    return jsonify(response), status_code

@question_api.route("/likequestion/<int:tid>", methods=["POST"])
@transactional
def like_question(tid):
    success = question_service.like_question(tid)
    if success:
        return jsonify({"success": "true"}), 200
    else:
        return jsonify({"error": "Like operation failed"}), 400

@question_api.route("/addanswer", methods=["POST"])
@jwt_required(optional=True)
@transactional
def add_answer():
    data = request.get_json() or {}
    content = data.get("content")
    anon_str = data.get("anon", "False")
    anon = (anon_str == "True")
    question_id = data.get("question")
    uid = get_jwt_identity()
    response, status_code = answer_service.add_answer(content, anon, question_id, uid)
    return jsonify(response), status_code

@question_api.route("/deleteanswer/<int:tid>", methods=["DELETE"])
@jwt_required()
@transactional
def delete_answer(tid):
    uid = get_jwt_identity()
    response, status_code = answer_service.delete_answer(tid, uid)
    return jsonify(response), status_code
