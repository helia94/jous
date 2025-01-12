from celery import Celery, Task

# Configure Celery without importing your full app
celery = Celery('queue_app')
celery.config_from_object('backend.celery_config')  # or set necessary config keys

class MinimalFlaskTask(Task):
    """
    This task creates a minimal Flask app instance—one that does not
    load controllers and other components that might cause a circular import.
    """
    def __call__(self, *args, **kwargs):
        from backend.app_factory import create_minimal_app  # A factory that avoids controllers
        app = create_minimal_app()  # e.g., a stripped-down version just for background tasks.
        with app.app_context():
            return super().__call__(*args, **kwargs)

celery.Task = MinimalFlaskTask