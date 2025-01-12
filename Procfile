web: gunicorn backend/wsgi:app
telegram_bot: python telegram/bot.py
worker: celery -A celery_app.celery worker --loglevel=info