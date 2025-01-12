# backend/celery_config.py
from celery import Celery

def make_celery(app):
    print("In make_celery, CELERY_BROKER_URL:", app.config.get("CELERY_BROKER_URL"))
    celery = Celery(
        app.import_name,
        broker=app.config["CELERY_BROKER_URL"],
        backend=app.config["CELERY_RESULT_BACKEND"],
        include=['backend.outbound.queue'],
        
    )
    #celery.conf.update(app.config)
    
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
    
    celery.Task = ContextTask
    return celery
