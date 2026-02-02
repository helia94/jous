import json
import logging
import os
import threading
from datetime import datetime

import requests
from apscheduler.schedulers.background import BackgroundScheduler
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler


TOKEN = os.environ.get("SLACK_BOT_TOKEN")
APP_TOKEN = os.environ.get("SLACK_APP_TOKEN")
SIGNING_SECRET = os.environ.get("SLACK_SIGNING_SECRET")
LANG_API_URL = "https://jous.app/api/languages"
QUESTION_API_URL = "https://jous.app/api/question/random"
USER_DATA_FILE = "slack_user_data.json"

DEFAULT_LANGUAGE = "en"
DEFAULT_TIMEZONE = 0
DEFAULT_DAILY_TIME = 19

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)


class UserDataManager:
    """Thread-safe user data manager with error handling."""

    def __init__(self, filename=USER_DATA_FILE):
        self.filename = filename
        self.data = self.load_data()
        self._lock = threading.Lock()

    def load_data(self):
        try:
            if os.path.exists(self.filename):
                with open(self.filename, "r", encoding="utf-8") as handle:
                    data = json.load(handle)
                    logger.info("Loaded user data for %s users", len(data))
                    return data
        except (json.JSONDecodeError, IOError) as exc:
            logger.error("Error loading user data: %s", exc)
        except Exception as exc:
            logger.error("Unexpected error loading user data: %s", exc)

        logger.info("Starting with empty user data")
        return {}

    def save_data(self):
        try:
            with self._lock:
                with open(self.filename, "w", encoding="utf-8") as handle:
                    json.dump(self.data, handle, indent=2, ensure_ascii=False)
                logger.debug("Saved user data for %s users", len(self.data))
        except IOError as exc:
            logger.error("Error saving user data: %s", exc)
        except Exception as exc:
            logger.error("Unexpected error saving user data: %s", exc)

    def get_user_data(self, user_id):
        with self._lock:
            user_data = self.data.get(str(user_id), {})
            if "lang" not in user_data:
                user_data["lang"] = DEFAULT_LANGUAGE
            if "timezone" not in user_data:
                user_data["timezone"] = DEFAULT_TIMEZONE
            return user_data

    def set_user_data(self, user_id, key, value):
        user_id_str = str(user_id)
        with self._lock:
            if user_id_str not in self.data:
                self.data[user_id_str] = {}
            self.data[user_id_str][key] = value

        self.save_data()
        logger.debug("Set %s=%s for user %s", key, value, user_id)

    def get_all_users_with_timezone(self):
        with self._lock:
            users_with_tz = {}
            for user_id, user_data in self.data.items():
                users_with_tz[user_id] = user_data.copy()

            logger.info("Found %s users for job restoration", len(users_with_tz))
            return users_with_tz


def validate_timezone_offset(offset):
    try:
        offset_int = int(offset)
        return -12 <= offset_int <= 14
    except (ValueError, TypeError):
        return False


def parse_timezone_input(timezone_str):
    if not timezone_str:
        return None

    timezone_str = timezone_str.strip()

    if timezone_str.startswith(("+", "-")):
        try:
            offset = int(timezone_str)
            return offset if validate_timezone_offset(offset) else None
        except ValueError:
            return None

    try:
        offset = int(timezone_str)
        return offset if validate_timezone_offset(offset) else None
    except ValueError:
        return None


def fetch_languages():
    try:
        response = requests.get(LANG_API_URL, timeout=10)
        response.raise_for_status()

        data = response.json()
        languages = data.get("languages", [])

        if not languages:
            logger.warning("No languages received from API")
            return get_fallback_languages()

        logger.info("Fetched %s languages from API", len(languages))
        return languages

    except requests.exceptions.RequestException as exc:
        logger.error("Error fetching languages: %s", exc)
        return get_fallback_languages()
    except Exception as exc:
        logger.error("Unexpected error fetching languages: %s", exc)
        return get_fallback_languages()


def get_fallback_languages():
    return [
        {"language_id": "en", "name": "English"},
        {"language_id": "es", "name": "Español"},
        {"language_id": "fr", "name": "Français"},
        {"language_id": "de", "name": "Deutsch"},
        {"language_id": "it", "name": "Italiano"},
        {"language_id": "pt", "name": "Português"},
    ]


def fetch_question_in_language(language_id):
    try:
        params = {"language_id": language_id}
        response = requests.get(QUESTION_API_URL, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()
        questions = data.get("questions", [])

        if questions and len(questions) > 0:
            question_content = questions[0].get("question", {}).get("content", "")
            if question_content:
                logger.debug("Fetched question in %s: %s...", language_id, question_content[:50])
                return question_content

        logger.warning("No question content found for language %s", language_id)
        return get_fallback_question(language_id)

    except requests.exceptions.RequestException as exc:
        logger.error("Error fetching question for %s: %s", language_id, exc)
        return get_fallback_question(language_id)
    except Exception as exc:
        logger.error("Unexpected error fetching question for %s: %s", language_id, exc)
        return get_fallback_question(language_id)


def get_fallback_question(language_id):
    fallback_questions = {
        "en": "What brings you joy today?",
        "es": "¿Qué te trae alegría hoy?",
        "fr": "Qu'est-ce qui vous apporte de la joie aujourd'hui?",
        "de": "Was bringt dir heute Freude?",
        "it": "Cosa ti porta gioia oggi?",
        "pt": "O que te traz alegria hoje?",
    }
    return fallback_questions.get(language_id, fallback_questions["en"])


def fetch_random_questions(chosen_lang):
    try:
        response = requests.get(f"{QUESTION_API_URL}?language_id={chosen_lang}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            questions = data.get("questions", [])
            logger.debug("Fetched %s random questions in %s", len(questions), chosen_lang)
            return questions
        logger.error("Failed to fetch questions. Status code: %s", response.status_code)
    except Exception as exc:
        logger.error("Exception fetching questions: %s", exc)
    return []


def get_next_question(user_id, chosen_lang):
    questions = user_question_queues.get(user_id, [])
    if len(questions) < 2:
        new_questions = fetch_random_questions(chosen_lang)
        questions.extend(new_questions)

    if not questions:
        return {"question": {"content": get_fallback_question(chosen_lang)}}

    next_question = questions.pop(0)
    user_question_queues[user_id] = questions
    return next_question


def build_question_blocks(question_text):
    return [
        {
            "type": "section",
            "text": {"type": "mrkdwn", "text": f"🤔 *Question for You*\n\n{question_text}\n\n💭 Take your time to reflect!"},
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "🎲 Another Question"},
                    "action_id": "next_question",
                },
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "⚙️ Settings"},
                    "action_id": "settings",
                },
            ],
        },
    ]


def build_welcome_blocks(is_new_user):
    if is_new_user:
        text = (
            "🎉 *Welcome to the Daily Question Bot!*\n\n"
            "I've automatically set you up with:\n"
            "🌍 Language: English\n"
            "🕐 Timezone: UTC (daily questions at 7 PM UTC)\n\n"
            "✨ You'll now receive daily questions automatically!\n\n"
            "*Commands to customize:*\n"
            "• `/language` - Change your language\n"
            "• `/settimezone +3` - Set your timezone\n"
            "• `/question` - Get a question right now"
        )
    else:
        text = (
            "🎉 *Welcome back!*\n\n"
            "You're receiving daily questions at 7 PM your local time.\n\n"
            "Use `/question` for a question now, or `/settimezone` to change your timezone."
        )

    return [
        {"type": "section", "text": {"type": "mrkdwn", "text": text}},
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "🎲 Get Question Now"},
                    "action_id": "next_question",
                },
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "🌍 Change Language"},
                    "action_id": "change_language",
                },
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "🕐 Set Timezone"},
                    "action_id": "set_timezone",
                },
            ],
        },
    ]


def build_settings_blocks(user_data):
    lang = user_data.get("lang", DEFAULT_LANGUAGE)
    timezone = user_data.get("timezone", DEFAULT_TIMEZONE)
    tz_str = f"UTC{timezone:+d}" if timezone != 0 else "UTC"

    text = (
        "⚙️ *Your Settings*\n\n"
        f"🌍 Language: {lang.upper()}\n"
        f"🕐 Timezone: {tz_str}\n"
        "📅 Daily questions at 7 PM your local time\n\n"
        "Use `/language` or `/settimezone` to change settings."
    )

    return [
        {"type": "section", "text": {"type": "mrkdwn", "text": text}},
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "🎲 Get Question"},
                    "action_id": "next_question",
                },
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "🌍 Change Language"},
                    "action_id": "change_language",
                },
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "🕐 Set Timezone"},
                    "action_id": "set_timezone",
                },
            ],
        },
    ]


def build_language_blocks(languages):
    blocks = [{"type": "section", "text": {"type": "mrkdwn", "text": "🌍 Select your preferred language:"}}]
    for i in range(0, len(languages), 5):
        buttons = []
        for lang in languages[i : i + 5]:
            buttons.append(
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": lang["name"]},
                    "action_id": "select_language",
                    "value": lang["language_id"],
                }
            )
        blocks.append({"type": "actions", "elements": buttons})
    return blocks


def send_message_to_user(client, user_id, text, blocks=None):
    try:
        response = client.conversations_open(users=user_id)
        channel_id = response["channel"]["id"]
        client.chat_postMessage(channel=channel_id, text=text, blocks=blocks)
    except Exception as exc:
        logger.error("Failed to send message to user %s: %s", user_id, exc)


def schedule_daily_questions_for_user(user_id, timezone_offset):
    job_id = f"daily_question_{user_id}"
    local_hour = DEFAULT_DAILY_TIME
    utc_hour = (local_hour - timezone_offset) % 24

    scheduler.add_job(
        send_daily_question,
        trigger="cron",
        hour=utc_hour,
        minute=0,
        id=job_id,
        replace_existing=True,
        kwargs={"user_id": user_id},
    )
    logger.info(
        "Scheduled daily questions for user %s at %02d:00 UTC (7 PM local)",
        user_id,
        utc_hour,
    )


def send_daily_question(user_id):
    user_data = user_manager.get_user_data(user_id)
    if not user_data:
        logger.warning("No user data found for user %s, skipping broadcast", user_id)
        return

    language_id = user_data.get("lang", DEFAULT_LANGUAGE)
    question_content = fetch_question_in_language(language_id)

    current_time = datetime.now()
    text = (
        "🌅 *Good Evening! Your Daily Question*\n\n"
        f"🤔 {question_content}\n\n"
        "💭 Take a moment to reflect on this...\n\n"
        f"📅 {current_time.strftime('%B %d, %Y')}"
    )

    send_message_to_user(app.client, user_id, text, blocks=[{"type": "section", "text": {"type": "mrkdwn", "text": text}}])
    logger.info("Successfully sent daily question to user %s", user_id)


def restore_user_jobs():
    try:
        users_with_data = user_manager.get_all_users_with_timezone()
        if not users_with_data:
            logger.info("No users found for job restoration")
            return

        logger.info("Restoring jobs for %s users", len(users_with_data))
        for user_id_str, user_data in users_with_data.items():
            try:
                user_id = str(user_id_str)
                timezone_offset = user_data.get("timezone", DEFAULT_TIMEZONE)
                schedule_daily_questions_for_user(user_id, timezone_offset)
            except Exception as exc:
                logger.error("Error restoring job for user %s: %s", user_id_str, exc)

        logger.info("Job restoration completed")
    except Exception as exc:
        logger.error("Error during job restoration: %s", exc)


user_manager = UserDataManager()
user_question_queues = {}

app = App(token=TOKEN, signing_secret=SIGNING_SECRET)

scheduler = BackgroundScheduler()


@app.command("/start")
def start_command(ack, respond, command):
    ack()
    user_id = command["user_id"]
    is_new_user = str(user_id) not in user_manager.data

    if is_new_user:
        user_manager.set_user_data(user_id, "lang", DEFAULT_LANGUAGE)
        user_manager.set_user_data(user_id, "timezone", DEFAULT_TIMEZONE)
        schedule_daily_questions_for_user(user_id, DEFAULT_TIMEZONE)

    blocks = build_welcome_blocks(is_new_user)
    respond(blocks=blocks, response_type="ephemeral")


@app.command("/question")
def question_command(ack, respond, command):
    ack()
    user_id = command["user_id"]
    user_data = user_manager.get_user_data(user_id)
    chosen_lang = user_data.get("lang", DEFAULT_LANGUAGE)

    question_obj = get_next_question(user_id, chosen_lang)
    question_content = question_obj["question"]["content"]
    respond(blocks=build_question_blocks(question_content), response_type="ephemeral")
    logger.info("Served on-demand question to user %s in %s", user_id, chosen_lang)


@app.command("/language")
def language_command(ack, respond, command):
    ack()
    languages = fetch_languages()
    respond(blocks=build_language_blocks(languages), response_type="ephemeral")


@app.command("/settimezone")
def set_timezone_command(ack, respond, command):
    ack()
    user_id = command["user_id"]
    timezone_input = command.get("text", "").strip()

    if not timezone_input:
        respond(
            text=(
                "🕐 *Set Your Timezone*\n\n"
                "Usage: `/settimezone <offset>`\n\n"
                "Examples:\n"
                "• `/settimezone +3` for UTC+3\n"
                "• `/settimezone -5` for UTC-5\n"
                "• `/settimezone 0` for UTC\n\n"
                "Valid range: -12 to +14"
            ),
            response_type="ephemeral",
        )
        return

    timezone_offset = parse_timezone_input(timezone_input)
    if timezone_offset is None:
        respond(
            text=(
                "❌ Invalid timezone format.\n\n"
                "Please use: `/settimezone +3` or `/settimezone -5`\n"
                "Valid range: -12 to +14"
            ),
            response_type="ephemeral",
        )
        return

    user_manager.set_user_data(user_id, "timezone", timezone_offset)
    schedule_daily_questions_for_user(user_id, timezone_offset)

    tz_str = f"UTC{timezone_offset:+d}" if timezone_offset != 0 else "UTC"
    respond(
        text=(
            f"✅ Timezone set to {tz_str}!\n\n"
            "🎯 You'll receive daily questions at 7 PM your local time.\n\n"
            "Use `/question` to get a question right now!"
        ),
        response_type="ephemeral",
    )


@app.command("/help")
def help_command(ack, respond, command):
    ack()
    respond(
        text=(
            "🤖 *Daily Question Bot Help*\n\n"
            "*Commands:*\n"
            "• `/start` - Start the bot (automatic setup with defaults)\n"
            "• `/question` - Get a question right now\n"
            "• `/language` - Change your language preference\n"
            "• `/settimezone +3` - Set your timezone (e.g., +3 for UTC+3)\n"
            "• `/help` - Show this help message\n\n"
            "*Features:*\n"
            "• 🎯 *Automatic daily questions* at 7 PM your local time\n"
            "• 🎲 *On-demand questions* anytime you want\n"
            "• 🌍 *Multiple language support*\n"
            "• ⚙️ *Easy customization* of language and timezone\n\n"
            "*Default Settings:*\n"
            "• Language: English\n"
            "• Timezone: UTC (7 PM UTC)"
        ),
        response_type="ephemeral",
    )


@app.action("next_question")
def next_question_action(ack, body, say):
    ack()
    user_id = body["user"]["id"]
    user_data = user_manager.get_user_data(user_id)
    chosen_lang = user_data.get("lang", DEFAULT_LANGUAGE)

    question_obj = get_next_question(user_id, chosen_lang)
    question_text = question_obj["question"]["content"]
    say(blocks=build_question_blocks(question_text))
    logger.info("Served callback question to user %s in %s", user_id, chosen_lang)


@app.action("settings")
def settings_action(ack, body, say):
    ack()
    user_id = body["user"]["id"]
    user_data = user_manager.get_user_data(user_id)
    say(blocks=build_settings_blocks(user_data))


@app.action("change_language")
def change_language_action(ack, body, say):
    ack()
    languages = fetch_languages()
    say(blocks=build_language_blocks(languages))


@app.action("select_language")
def select_language_action(ack, body, say):
    ack()
    user_id = body["user"]["id"]
    language_id = body["actions"][0]["value"]

    user_manager.set_user_data(user_id, "lang", language_id)
    languages = fetch_languages()
    lang_name = next(
        (lang["name"] for lang in languages if lang["language_id"] == language_id),
        language_id.upper(),
    )

    say(
        text=(
            f"✅ Language set to {lang_name}!\n\n"
            f"Your daily questions will now be in {lang_name}.\n\n"
            "Use `/settimezone +3` to set your timezone for daily delivery."
        )
    )


@app.action("set_timezone")
def set_timezone_action(ack, body, say):
    ack()
    say(
        text=(
            "🕐 *Set Your Timezone*\n\n"
            "Use the command: `/settimezone <offset>`\n\n"
            "Examples:\n"
            "• `/settimezone +3` for UTC+3\n"
            "• `/settimezone -5` for UTC-5\n"
            "• `/settimezone 0` for UTC\n\n"
            "This ensures you get daily questions at 7 PM your local time."
        )
    )


def main():
    if not TOKEN or not APP_TOKEN:
        logger.error("Please set SLACK_BOT_TOKEN and SLACK_APP_TOKEN environment variables")
        return

    scheduler.start()
    restore_user_jobs()

    logger.info("Starting Daily Question Slack Bot with automatic setup...")
    handler = SocketModeHandler(app, APP_TOKEN)
    handler.start()


if __name__ == "__main__":
    main()
