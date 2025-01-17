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

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.message.from_user.id
    logger.info("User %s started the bot.", user_id)
    # Fetch languages
    lang_response = requests.get(LANG_API_URL)
    if lang_response.status_code == 200:
        langs = lang_response.json().get('languages', [])
        # Build language buttons
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
        # Store chosen language
        chosen_lang = data.split("_")[1]
        context.user_data['lang'] = chosen_lang
        logger.info("User %s selected language %s", user_id, chosen_lang)
        await query.edit_message_text(text=f"Language set to {chosen_lang.upper()}. Click 'Next' for a question.")
        # Show next question button
        keyboard = [[InlineKeyboardButton("Next", callback_data='next')]]
        await query.message.reply_text("Ready for your question?", reply_markup=InlineKeyboardMarkup(keyboard))

    elif data == "next":
        # Use stored language
        chosen_lang = context.user_data.get('lang', 'en')
        response = requests.get(f"{QUESTION_API_URL}?language_id={chosen_lang}")
        if response.status_code == 200:
            question_content = response.json()['question']['content']
            keyboard = [[InlineKeyboardButton("Next question", callback_data='next')]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await query.edit_message_text(text=question_content, reply_markup=reply_markup)
            logger.info("Asked a new question in language %s to user %s.", chosen_lang, user_id)
        else:
            logger.error("Failed to fetch question. Status code: %s", response.status_code)
            await query.edit_message_text(text="Failed to fetch question. Try again.")

async def inline_query(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.inline_query.query
    user_id = update.inline_query.from_user.id
    chosen_lang = context.user_data.get('lang', 'en')
    response = requests.get(f"{QUESTION_API_URL}?language_id={chosen_lang}")
    if response.status_code == 200:
        question_content = response.json()['question']['content']
        results = [
            InlineQueryResultArticle(
                id=str(uuid4()),
                title="Random Question",
                input_message_content=InputTextMessageContent(question_content)
            )
        ]
        await update.inline_query.answer(results)
        logger.info("Fetched a question for inline query in language %s by user %s.", chosen_lang, user_id)
    else:
        logger.error("Failed to fetch question for inline query. Status code: %s", response.status_code)

def main() -> None:
    logger.info("Starting the bot.")
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(handle_callback))
    application.add_handler(InlineQueryHandler(inline_query))
    application.run_polling()

if __name__ == '__main__':
    main()
