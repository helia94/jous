from flask import Blueprint
from backend.outbound.queue.tasks.translation_task import translate_all_questions

migration_api = Blueprint("migration_api", __name__)

@migration_api.route("/migration/question/translate/all", methods=["GET"])
def translate():
    translate_all_questions.delay()
    return {"success": "true"}, 200