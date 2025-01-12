# backend/tasks.py
import os

from celery import shared_task
from backend.domain.supported_languages import supported_languages
from backend.domain.translator import Translator
from backend.outbound.repositories.question_repository import QuestionRepository
from backend.outbound.llm.gpt import GPT
from backend.tests.test_llm import TestLMM

@shared_task(name = "process_question_translation")
def process_question_translation(question_id, question_content):
    print("start of process_question_translation")
    env = os.environ.get("FLASK_ENV", "dev")
    if env == "test":
        translator = Translator(TestLMM())
        print("using test llm")
    else:
        translator = Translator(GPT())
        print("using real llm")
    question_repository = QuestionRepository()
    print(f"process_question_translation: got the translator")
    for lang in supported_languages:
        translated_text = translator.translate(question_content, lang.name, lang.comment)
        print(f"process_question_translation: got the translation")
        question_repository.add_question_translation(question_id, lang.iso2, translated_text)
