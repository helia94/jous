import os
import logging
from flask import Flask, request
from flask_cors import CORS
from flask_migrate import Migrate
from sqlalchemy_utils import create_database, database_exists
from flask_jwt_extended import JWTManager
from backend.api.config import config
from backend.api.core import all_exception_handler
import sys

class RequestFormatter(logging.Formatter):
    def format(self, record):
        record.url = request.url
        record.remote_addr = request.remote_addr
        return super().format(record)

def create_app(test_config=None):
    """
    Creates and configures the Flask application.
    """
    app = Flask(__name__)

    # Setup CORS
    CORS(app)

    # Determine the environment and load the appropriate configuration
    env = os.environ.get("FLASK_ENV", "dev")
    if test_config:
        app.config.from_mapping(**test_config)
    else:
        app.config.from_object(config[env])


    # Setup logging
    formatter = RequestFormatter(
        "%(asctime)s %(remote_addr)s: requested %(url)s: %(levelname)s in [%(module)s: %(lineno)d]: %(message)s"
    )

    # Configure logging to output to stdout explicitly
    stream_handler = logging.StreamHandler(sys.stdout)  # Change to sys.stdout
    stream_handler.setLevel(logging.DEBUG)
    #stream_handler.setFormatter(formatter)
    app.logger.addHandler(stream_handler)
    app.logger.setLevel(logging.DEBUG)

    root = logging.getLogger()
    root.addHandler(stream_handler)
    root.setLevel(logging.DEBUG)


    # Setup database (if not in production and database does not exist)
    if env != "prod":
        db_url = app.config["SQLALCHEMY_DATABASE_URI"]
        if not database_exists(db_url):
            create_database(db_url)

    # Initialize SQLAlchemy
    from backend.api.models import db
    db.init_app(app)
    Migrate(app, db)

    # Register blueprints
    from backend.api.views import main

    app.register_blueprint(main.api, url_prefix="/api")


    # Register error handler
    app.register_error_handler(Exception, all_exception_handler)

    # Setup JWT
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "myawesomesecretisnevergonnagiveyouup")
    jwt = JWTManager(app)

    return app, jwt
