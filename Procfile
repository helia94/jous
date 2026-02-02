web: gunicorn wsgi:app -k custom_worker.RouteSpecificSyncWorker
bots: python bots/runner.py
worker: celery --app backend.outbound.queue.tasks.translation_task.celery worker --loglevel=info
