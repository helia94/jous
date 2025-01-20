from flask import Blueprint
from backend.outbound.queue.tasks.translation_task import translate_all_questions, add_all_filters

migration_api = Blueprint("migration_api", __name__)

@migration_api.route("/migration/question/translate/all", methods=["GET"])
def translate():
    translate_all_questions.delay()
    return {"success": "true"}, 200


@migration_api.route("/migration/question/filter/all", methods=["GET"])
def add_filter():
    add_all_filters.delay()
    return {"success": "true"}, 200