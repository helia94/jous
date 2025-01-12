# backend/app_factory.py
from flask import Flask
from backend.api.config import config
from backend.api.models import db  # Adjust the import based on your project structure

def create_minimal_app(config_name='prod'):
    """Create a minimal Flask app for Celery tasks."""
    app = Flask(__name__)
    print(config_name)
    print(config[config_name].CELERY_BROKER_URL)

    print(config[config_name])
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    
    # Initialize other extensions if needed (e.g., logging)
    
    return app
