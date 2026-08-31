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
    _redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    if _redis_url.startswith("rediss://"):
        _redis_url += "?ssl_cert_reqs=CERT_NONE"
    CELERY_BROKER_URL = _redis_url
    CELERY_RESULT_BACKEND = _redis_url
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
