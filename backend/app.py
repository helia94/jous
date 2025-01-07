import os
import sys
import logging
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from sqlalchemy_utils import create_database, database_exists

from api.config import config
from api.core.utils import all_exception_handler


def create_app(test_config=None):
    """
    Creates and configures the Flask application.
    """
    app = Flask(__name__)

    # Enable CORS
    CORS(app)

    # Determine environment, load corresponding config
    env = os.environ.get("FLASK_ENV", "dev")
    if test_config:
        app.config.from_mapping(**test_config)
    else:
        app.config.from_object(config[env])

    # Setup database (optionally auto-create only in dev/test)
    if env != "prod":
        db_url = app.config["SQLALCHEMY_DATABASE_URI"]
        if db_url and not database_exists(db_url):
            create_database(db_url)

    # Initialize SQLAlchemy and Migrations
    from api.models import db  
    db.init_app(app)
    Migrate(app, db)

    from api.models import UserAuth, Question, PublicAnswer, Group, GroupAnswer, Activity, User

    with app.app_context():
        db.create_all()

    from inbound.auth_controller import auth_api
    from inbound.user_controller import user_api
    from inbound.question_controller import question_api
    from inbound.activity_controller import activity_api
    
    # Register Blueprints
    app.register_blueprint(auth_api, url_prefix="/api")
    app.register_blueprint(user_api, url_prefix="/api")
    app.register_blueprint(question_api, url_prefix="/api")
    app.register_blueprint(activity_api, url_prefix="/api")
    

    # Setup logging (simplified)
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setLevel(logging.DEBUG)
    app.logger.addHandler(stream_handler)
    app.logger.setLevel(logging.DEBUG)

    # Setup error handler (optional)
    app.register_error_handler(Exception, all_exception_handler)

    # Setup JWT
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "myawesomesecret")
    jwt = JWTManager(app)



    return app, jwt


# Optional: a direct run hook if you want to run via "python app.py"
if __name__ == "__main__":
    flask_app, _ = create_app()
    flask_app.run(debug=True, host="0.0.0.0", port=5000)
    from api.models import db 
    with flask_app.app_context():
        db.create_all()