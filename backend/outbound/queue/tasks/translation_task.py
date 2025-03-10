# backend/tasks.py
import os

from backend.domain.supported_languages import supported_languages
from backend.domain.translator import Translator
from backend.outbound.repositories.question_repository import QuestionRepository
from backend.outbound.repositories.filter_repository import FilterRepository
from backend.outbound.repositories.blog_repository import BlogRepository
from backend.domain.blog_writer import BlogWriter
from backend.outbound.llm.gpt import GPT
from backend.tests.test_llm import TestLMM
from backend.api.core.logger import logger
from backend.api.config import configs
from backend.domain.filters.filters import get_filter_values

env = os.environ.get("FLASK_ENV", "dev")
config = configs[env]

from flask import Flask
from celery import Celery, Task
from celery import shared_task


def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app

def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_mapping(
        CELERY=dict(
            broker_url=config.CELERY_BROKER_URL,
            result_backend=config.CELERY_RESULT_BACKEND,
            task_ignore_result=True,
        ),
    )
    app.config.from_object(config)
    from backend.api.models import db  
    db.init_app(app)
    celery_init_app(app)
    return app

app = create_app()
celery = app.extensions["celery"]

env = os.environ.get("FLASK_ENV", "dev")
if env == "test":
    translator = Translator(TestLMM())
else:
    translator = Translator(GPT())

question_repository = QuestionRepository()
filter_repository = FilterRepository()
blog_repository = BlogRepository()
blog_writer = BlogWriter()


@shared_task(name = "backend.outbound.queue.tasks.translation_task.translate_all_questions")
def translate_all_questions():
    with app.app_context():
        offset = 0
        limit=20
        questions = question_repository.get_all_questions(offset, limit=limit)
        while questions:
            for question in questions:
                for lang in supported_languages:
                    if not question_repository.has_translation(question.id, lang.iso2):
                        try:
                            translated_text = translator.translate(question.content, lang.name, lang.comment)
                            question_repository.add_question_translation(question.id, lang.iso2, translated_text)
                        except Exception as e:
                            logger.warning("adding translation for question {question.id} in languge {lang.iso2} to db failed", e)
            offset += 1
            questions = question_repository.get_all_questions(offset, limit=limit)

@shared_task(name = "backend.outbound.queue.tasks.translation_task.process_question_translation")
def process_question_translation(question_id, question_content):
    logger.info("Start process_question_translation")
    with app.app_context():
        for lang in supported_languages:
            translated_text = translator.translate(question_content, lang.name, lang.comment)
            question_repository.add_question_translation(question_id, lang.iso2, translated_text)
            logger.info(f"Added translation for question: {question_id} language: {lang.iso2}.")


@shared_task(name = "backend.outbound.queue.tasks.translation_task.process_question_filters")
def process_question_filters(question_id, question_content):
    logger.info("Start process_question_filters")
    filter_values = get_filter_values(question_content)
    print(filter_values)
    with app.app_context():
        filter_repository.add_filter_values(question_id, filter_values)
        logger.info(f"added filter values")


@shared_task(name="backend.outbound.queue.tasks.translation_task.add_all_filters")
def add_all_filters():
    with app.app_context():
        offset = 0
        questions = question_repository.get_all_questions(offset, None, None)
        while questions:
            for question in questions:
                filter_values = get_filter_values(question.content)
                try:
                    filter_repository.add_filter_values(question.id, filter_values)
                except Exception as e:
                    logger.warning("adding fitlers to db failed", e)
            offset += 1
            questions = question_repository.get_all_questions(offset, None, None)


@shared_task(name="backend.outbound.queue.tasks.translation_task.create_blog_task")
def create_blog_task(url, title, storyline):
    if blog_repository.find_blog_by_url(url):
        return {"error": "Blog with this URL already exists"}
    html_content = blog_writer.generate_article(title, storyline, url)
    blog_repository.create_blog(url, html_content)
    logger.info(f"Blog created for title: {title}")

# Check that both tasks are indeed imported when starting the worker.
# For example, add these lines at the end of the file:
if __name__ == "__main__":
    add_all_filters()
