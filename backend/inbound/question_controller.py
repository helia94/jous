from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.inbound.transaction_utils import transactional
from backend.inbound.utils import to_lower, to_lower_list, filter_none
from backend.inbound.service_factory import question_service, answer_service, search_service
from backend.outbound.queue.tasks.translation_task import translate_all_questions

question_api = Blueprint("question_api", __name__)

@question_api.route("/questions", methods=["GET"])
def get_questions():
    query_params = {
        'offset': request.args.get('offset', type=int, default=None),
        'language_id': request.args.get('language_id', type=str, default=None),
        'occasion': request.args.get('occasion', type=int, default=None),
        'level': request.args.get('level', type=int, default=None)
    }
    
    query_params = to_lower_list(filter_none(query_params))
    questions = question_service.get_questions(**query_params)
    
    return jsonify(questions), 200

@question_api.route("/question/<int:question_id>", methods=["GET"])
def get_question(question_id):
    query_params = {
        'language_id': request.args.get('language_id', type=str, default=None),
    }

    query_params = to_lower_list(filter_none(query_params))
    data = question_service.get_question_by_id(question_id, **query_params)
    if "error" in data:
        return jsonify(data), 404
    return jsonify(data), 200

@question_api.route("/question/random", methods=["GET"])
def get_random_questions():
    query_params = {
        'language_id': request.args.get('language_id', type=str, default=None),
        'occasion': request.args.get('occasion', type=int, default=None),
        'level': request.args.get('level', type=int, default=None)
    }
    
    query_params = to_lower_list(filter_none(query_params))
    random_questions = question_service.get_random_questions(**query_params)
    if "error" in random_questions:
        return jsonify(random_questions), 404
    return jsonify(random_questions), 200

@question_api.route("/search", methods=["GET"])
def search_questions():
    query = request.args.get("q", type=str, default="")
    limit = request.args.get("limit", type=int, default=20)
    results = search_service.search(query, limit)
    return jsonify(results), 200

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


@question_api.route("/question/translate/all", methods=["GET"])
def translate():
    translate_all_questions.delay()
    return {"success": "true"}, 200