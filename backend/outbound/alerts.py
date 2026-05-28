import os
import time

import requests

from backend.api.core.logger import logger


DEFAULT_OPENAI_ALERT_RECIPIENT = "helia.jm@gmail.com"
DEFAULT_RESEND_FROM_EMAIL = "Jous Alerts <notifications@heliajamshidi.me>"
_last_model_alert_sent_at = 0


def send_openai_model_alert(model_name: str, error_message: str) -> bool:
    global _last_model_alert_sent_at

    cooldown_seconds = int(os.environ.get("OPENAI_MODEL_ALERT_COOLDOWN_SECONDS", "3600"))
    now = time.time()
    if now - _last_model_alert_sent_at < cooldown_seconds:
        logger.warning("OpenAI model alert suppressed by cooldown for model %s", model_name)
        return False
    _last_model_alert_sent_at = now

    api_key = os.environ.get("RESEND_API_KEY")
    recipient = os.environ.get(
        "OPENAI_MODEL_ALERT_EMAIL",
        os.environ.get("NOTIFICATION_EMAIL", DEFAULT_OPENAI_ALERT_RECIPIENT),
    )
    sender = os.environ.get("RESEND_FROM_EMAIL", DEFAULT_RESEND_FROM_EMAIL)

    if not api_key:
        logger.warning("OpenAI model alert email not sent because RESEND_API_KEY is not set.")
        return False

    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": sender,
                "to": [recipient],
                "subject": f"Jous OpenAI model failed: {model_name}",
                "html": (
                    "<p>An OpenAI request failed because the configured model is unavailable.</p>"
                    f"<p><strong>Model:</strong> {model_name}</p>"
                    f"<p><strong>Error:</strong> {error_message}</p>"
                    "<p>Update <code>OPENAI_CHAT_MODEL</code> to a valid API model and "
                    "redeploy/restart workers.</p>"
                ),
            },
            timeout=10,
        )
        if response.status_code >= 400:
            logger.error(
                "OpenAI model alert email failed: %s - %s",
                response.status_code,
                response.text,
            )
            return False
        logger.info("OpenAI model alert email sent to %s", recipient)
        return True
    except requests.RequestException:
        logger.exception("OpenAI model alert email failed")
        return False
