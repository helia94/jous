import logging
from telegram import Update, InlineQueryResultArticle, InputTextMessageContent, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, InlineQueryHandler, ContextTypes
import requests
import os
from uuid import uuid4

TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
LANG_API_URL = 'https://jous.app/api/languages'
QUESTION_API_URL = 'https://jous.app/api/question/random'
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper: fetch 20 questions from the API
def fetch_random_questions(chosen_lang):
    try:
        response = requests.get(f"{QUESTION_API_URL}?language_id={chosen_lang}")
        if response.status_code == 200:
            data = response.json()
            # Expecting {"questions": [...]} now
            return data.get('questions', [])
        logger.error("Failed to fetch questions. Status code: %s", response.status_code)
    except Exception as e:
        logger.error("Exception fetching questions: %s", e)
    return []

# Helper: get next question from the user buffer; refill if buffer is almost empty
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
    # Fetch languages
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
        context.user_data['questions'] = []  # init question buffer
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
    logger.info("Starting the bot.")
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(handle_callback))
    application.add_handler(InlineQueryHandler(inline_query))
    application.run_polling()

if __name__ == '__main__':
    main()
