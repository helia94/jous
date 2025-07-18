import os
import requests

from celery.schedules import crontab

from .translation_task import celery


def fetch_question() -> str:
    """Fetch a random question from the production API within 280 chars."""
    while True:
        resp = requests.get("https://jous.app/api/question/random", timeout=10)
        resp.raise_for_status()
        content = resp.json().get("question", {}).get("content", "")
        if content and len(content) <= 240:
            return f"{content}\nby https://jous.app"


def tweet(text: str) -> None:
    """Post to X using OAuth 2.0 bearer token."""
    token = os.getenv("TWITTER_ACCESS_TOKEN")
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.post(
        "https://api.twitter.com/2/tweets", json={"text": text}, headers=headers
    )
    if resp.status_code not in (200, 201):
        raise Exception(f"Tweet failed: {resp.status_code} {resp.text}")


@celery.task(name="backend.outbound.queue.tasks.twitter_tasks.tweet_random_question")
def tweet_random_question() -> None:
    """Celery task to fetch a random question and tweet it."""
    question = fetch_question()
    tweet(question)


# Run three times a day (every 8 hours)
celery.conf.beat_schedule.setdefault(
    "tweet-random-question",
    {
        "task": "backend.outbound.queue.tasks.twitter_tasks.tweet_random_question",
        "schedule": crontab(minute=0, hour="*/8"),
    },
)

