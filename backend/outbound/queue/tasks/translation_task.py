# backend/tasks.py
import os

from backend.domain.supported_languages import supported_languages
from backend.domain.translator import Translator
from backend.outbound.repositories.question_repository import QuestionRepository
from backend.outbound.llm.gpt import GPT
from backend.tests.test_llm import TestLMM
from backend.api.core.logger import logger

from celery import Celery


celery = Celery(__name__, )
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")

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
