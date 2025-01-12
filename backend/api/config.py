import os

class Config:
    """
    Base Configuration
    """
    SECRET_KEY = "testkey"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    LOG_FILE = "api.log"  # Where logs can be outputted to, if desired
    CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379")
    CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379")


class DevelopmentConfig(Config):
    """Development Configuration (default)."""
    SQLALCHEMY_DATABASE_URI = "postgresql://testusr:password@127.0.0.1:5432/jousdb"
    DEBUG = True


class ProductionConfig(Config):
    """Production Configuration."""
    uri = os.getenv("DATABASE_URL")  # Heroku-style
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = uri
    CELERY_BROKER_URL = os.getenv("REDIS_URL")
    CELERY_RESULT_BACKEND = os.getenv("REDIS_URL")
    DEBUG = False


class DockerDevConfig(Config):
    """Docker-based Development Configuration."""
    SQLALCHEMY_DATABASE_URI = "postgresql://testusr:password@postgres/jousdb"
    DEBUG = True


configs = {
    "dev": DevelopmentConfig,
    "prod": ProductionConfig,
    "docker": DockerDevConfig
}
