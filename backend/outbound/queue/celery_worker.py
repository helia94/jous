# backend/celery_worker.py
import os
from backend.app_factory import create_minimal_app
from backend.outbound.queue.celery_config import make_celery
from backend.api.config import configs


env = os.getenv('FLASK_ENV', 'prod')

if env == "dev":
    from backend.app import app
elif env == "prod":
    from backend.wsgi import app
elif env == "docker":
    from backend.manage import app
else:
    raise ValueError(f"Unknown ENV_TYPE: {env}")

celery = make_celery(app)
