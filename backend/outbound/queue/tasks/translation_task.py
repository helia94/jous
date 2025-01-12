# backend/tasks.py
import os

from backend.domain.supported_languages import supported_languages
from backend.domain.translator import Translator
from backend.outbound.repositories.question_repository import QuestionRepository
from backend.outbound.llm.gpt import GPT
from backend.tests.test_llm import TestLMM
from backend.api.core.logger import logger
from backend.api.config import configs

from celery import Celery
env = os.environ.get("FLASK_ENV", "dev")
config = configs[env]
celery = Celery(__name__, )
celery.conf.broker_url = config.CELERY_BROKER_URL
celery.conf.result_backend = config.CELERY_RESULT_BACKEND

@celery.task(name = "backend.outbound.queue.tasks.translation_task.process_question_translation")
def process_question_translation(question_id, question_content):
    logger.info("start of process_question_translation")
    env = os.environ.get("FLASK_ENV", "dev")
    if env == "test":
        translator = Translator(TestLMM())
        logger.info("using test llm")
    else:
        translator = Translator(GPT())
        logger.info("using real llm")
    question_repository = QuestionRepository()
    logger.info(f"process_question_translation: got the translator")
    for lang in supported_languages:
        translated_text = translator.translate(question_content, lang.name, lang.comment)
        logger.info(f"process_question_translation: got the translation")
        question_repository.add_question_translation(question_id, lang.iso2, translated_text)
