from flask import Blueprint
from backend.outbound.queue.tasks.translation_task import (
    add_all_filters,
    retry_missing_question_ai_outputs,
    translate_all_questions,
)

migration_api = Blueprint("migration_api", __name__)

@migration_api.route("/migration/question/translate/all", methods=["GET"])
def translate():
    translate_all_questions.delay()
    return {"success": "true"}, 200


@migration_api.route("/migration/question/filter/all", methods=["GET"])
def add_filter():
    add_all_filters.delay()
    return {"success": "true"}, 200


@migration_api.route("/migration/question/openai/retry-missing", methods=["GET"])
def retry_missing_openai_outputs():
    retry_missing_question_ai_outputs.delay()
    return {"success": "true"}, 200
