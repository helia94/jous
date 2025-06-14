import os
from flask import Flask
from celery import Celery, Task, shared_task
from openai import OpenAI
from backend.api.config import configs
from backend.outbound.repositories.embedding_repository import EmbeddingRepository
from backend.api.models import db


def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app


def create_app() -> Flask:
    app = Flask(__name__)
    env = os.environ.get("FLASK_ENV", "dev")
    app.config.from_mapping(
        CELERY=dict(
            broker_url=configs[env].CELERY_BROKER_URL,
            result_backend=configs[env].CELERY_RESULT_BACKEND,
            task_ignore_result=True,
        ),
    )
    app.config.from_object(configs[env])
    db.init_app(app)
    celery_init_app(app)
    return app


app = create_app()
celery = app.extensions["celery"]
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


@shared_task(name="backend.outbound.queue.tasks.embedding_task.process_question_embedding")
def process_question_embedding(question_id, content):
    with app.app_context():
        try:
            result = client.embeddings.create(model="text-embedding-3-small", input=[content])
            embedding = result.data[0].embedding
            repo = EmbeddingRepository()
            repo.add_or_update_embedding(question_id, embedding)
        except Exception as e:
            # log error silently
            pass
