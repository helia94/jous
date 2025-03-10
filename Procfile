web: gunicorn wsgi:app -k custom_worker.RouteSpecificSyncWorker
telegram_bot: python telegram/bot.py
worker: celery --app backend.outbound.queue.tasks.translation_task.celery worker --loglevel=info