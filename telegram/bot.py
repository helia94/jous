import logging
import os, json
from google.oauth2 import service_account
import requests
from uuid import uuid4
from datetime import time, datetime
from telegram import Update, InlineQueryResultArticle, InputTextMessageContent, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler,
    InlineQueryHandler, ContextTypes, JobQueue
)
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest, Dimension, Metric

TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
LANG_API_URL = 'https://jous.app/api/languages'
QUESTION_API_URL = 'https://jous.app/api/question/random'
GA_PROPERTY_ID = 'G-21G3CNF1CB'  # Replace with your GA4 property ID

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GoogleAnalytics:
    def __init__(self, property_id: str):
        self.property_id = property_id
        try:
            creds_json = os.environ.get("GOOGLE_CREDENTIALS_JSON")
            if not creds_json:
                raise Exception("Missing GOOGLE_CREDENTIALS_JSON config variable")
            creds_info = json.loads(creds_json)
            credentials = service_account.Credentials.from_service_account_info(creds_info)
            self.client = BetaAnalyticsDataClient(credentials=credentials)
            logger.info("Google Analytics client initialized.")
        except Exception as e:
            logger.error("Failed to initialize GA client: %s", e)
            self.client = None

    async def send_event(self, user_id: int, event_name: str, event_params: dict):
        if not self.client:
            logger.error("GA client not initialized. Skipping event: %s", event_name)
            return
        try:
            request = RunReportRequest(
                property=f"properties/{self.property_id}",
                dimensions=[Dimension(name="user_id"), Dimension(name="event_name")],
                metrics=[Metric(name="event_count")],
                date_ranges=[{"start_date": "today", "end_date": "today"}],
                dimension_filter={
                    "and_group": {
                        "expressions": [
                            {"filter": {"field_name": "user_id", "string_filter": {"value": str(user_id)}}},
                            {"filter": {"field_name": "event_name", "string_filter": {"value": event_name}}},
                        ]
                    }
                },
                metric_aggregations=["TOTAL"],
            )
            self.client.run_report(request)
            logger.info("GA Event Sent: %s for user %s", event_name, user_id)
        except Exception as e:
            logger.error("Failed to send GA event: %s", e)

ga = GoogleAnalytics(GA_PROPERTY_ID)

async def fetch_question_of_the_day() -> str:
    try:
        resp = requests.get(QUESTION_API_URL)
        if resp.status_code == 200:
            data = resp.json()
            questions = data.get('questions', [])
            if questions:
                return questions[0]['question']['content']
    except Exception as e:
        logger.error("Error fetching question of the day: %s", e)
    return "No question found"

async def broadcast_question(context: ContextTypes.DEFAULT_TYPE):
    user_id = context.job.context['user_id']
    question = context.application_data.get('question_of_the_day', "No question of the day yet")
    await context.bot.send_message(chat_id=user_id, text=f"Question of the day:\n{question}")

async def set_timezone(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        offset = int(context.args[0])
        context.user_data['timezone'] = offset
        old_jobs = context.job_queue.get_jobs_by_name(str(update.effective_user.id))
        for job in old_jobs:
            job.schedule_removal()
        local_time = (19 - offset) % 24
        context.job_queue.run_daily(
            broadcast_question,
            time=time(hour=local_time, minute=0),
            days=(0, 1, 2, 3, 4, 5, 6),
            context={"user_id": update.effective_user.id},
            name=str(update.effective_user.id)
        )
        await update.message.reply_text("Time zone set. You'll get the question at 7 PM your time.")
    except Exception as e:
        logger.error("Error setting timezone: %s", e)
        await update.message.reply_text("Invalid offset. Use /settimezone +3 or /settimezone -2.")

async def daily_update_question(context: ContextTypes.DEFAULT_TYPE):
    question = await fetch_question_of_the_day()
    context.application_data['question_of_the_day'] = question
    logger.info("Updated Question of the Day: %s", question)

def fetch_random_questions(chosen_lang):
    try:
        response = requests.get(f"{QUESTION_API_URL}?language_id={chosen_lang}")
        if response.status_code == 200:
            data = response.json()
            return data.get('questions', [])
        logger.error("Failed to fetch questions. Status code: %s", response.status_code)
    except Exception as e:
        logger.error("Exception fetching questions: %s", e)
    return []

def get_next_question(context, chosen_lang):
    questions = context.user_data.get('questions', [])
    if len(questions) < 2:
        questions.extend(fetch_random_questions(chosen_lang))
    if not questions:
        return None
    next_question = questions.pop(0)
    context.user_data['questions'] = questions
    return next_question

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.message.from_user.id
    logger.info("User %s started the bot.", user_id)
    await ga.send_event(user_id, "bot_start", {"category": "telegram", "action": "start_tel", "label": "start_bot"})
    lang_response = requests.get(LANG_API_URL)
    if lang_response.status_code == 200:
        langs = lang_response.json().get('languages', [])
        keyboard = [
            [InlineKeyboardButton(lang["name"].capitalize(), callback_data=f"lang_{lang['language_id']}")]
            for lang in langs
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text("Hello curious stranger, select your language:", reply_markup=reply_markup)
    else:
        await update.message.reply_text("Failed to fetch languages. Try again.")
    logger.info("Language selection offered to user %s.", user_id)

async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    user_id = query.from_user.id
    data = query.data
    await query.answer()
    if data.startswith("lang_"):
        chosen_lang = data.split("_")[1]
        context.user_data['lang'] = chosen_lang
        context.user_data['questions'] = []
        logger.info("User %s selected language %s", user_id, chosen_lang)
        await query.edit_message_text(text=f"Language set to {chosen_lang.upper()}. Click 'Next' for a question.")
        keyboard = [[InlineKeyboardButton("Next", callback_data='next')]]
        await query.message.reply_text("Ready for your question?", reply_markup=InlineKeyboardMarkup(keyboard))
    elif data == "next":
        chosen_lang = context.user_data.get('lang', 'en')
        question_obj = get_next_question(context, chosen_lang)
        if question_obj:
            question_content = question_obj['question']['content']
            keyboard = [[InlineKeyboardButton("Next question", callback_data='next')]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await query.edit_message_text(text=question_content, reply_markup=reply_markup)
            logger.info("Asked a new question in language %s to user %s.", chosen_lang, user_id)
            await ga.send_event(user_id, "next_question", {"category": "telegram", "action": "next_random", "label": "next_random_telegram"})
        else:
            await query.edit_message_text(text="Failed to fetch question. Try again.")
            logger.error("No question available for user %s in language %s.", user_id, chosen_lang)

async def inline_query(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.inline_query.from_user.id
    chosen_lang = context.user_data.get('lang', 'en')
    question_obj = get_next_question(context, chosen_lang)
    if question_obj:
        question_content = question_obj['question']['content']
        results = [
            InlineQueryResultArticle(
                id=str(uuid4()),
                title="Random Question",
                input_message_content=InputTextMessageContent(question_content)
            )
        ]
        await update.inline_query.answer(results)
        logger.info("Fetched inline query question in language %s by user %s.", chosen_lang, user_id)
    else:
        logger.error("Failed to fetch inline query question for user %s.", user_id)
        await update.inline_query.answer([])

def main() -> None:
    application = Application.builder().token(TOKEN).build()
    application.job_queue.run_daily(daily_update_question, time=time(hour=0, minute=0))
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("settimezone", set_timezone))
    application.add_handler(CallbackQueryHandler(handle_callback))
    application.add_handler(InlineQueryHandler(inline_query))
    application.application_data['question_of_the_day'] = "Not yet fetched"
    application.run_polling()

if __name__ == '__main__':
    main()
