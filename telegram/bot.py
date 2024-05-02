import logging
from telegram import Update, InlineQueryResultArticle, InputTextMessageContent
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, InlineQueryHandler, ContextTypes
import requests
import os

# Define the Telegram bot token from environment variable
TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')

# Define the API endpoint URL
API_URL = 'https://jous.app/api/question/random'

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    logger.info("User %s started the bot.", update.message.from_user.id)
    keyboard = [[InlineKeyboardButton("Next", callback_data='next')]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Hello curious stranger, let's dig some juice, shall we?", reply_markup=reply_markup)
    logger.info("Responded to your start bot.", update.message.from_user.id)

async def button(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    logger.info("User %s clicked the button.", update.callback_query.from_user.id)
    query = update.callback_query
    await query.answer()
    response = requests.get(API_URL)
    if response.status_code == 200:
        question_content = response.json()['question']['content']
        keyboard = [[InlineKeyboardButton("Next question", callback_data='next')]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text(text=f"{question_content}", reply_markup=reply_markup)
        logger.info("Fetched and displayed a new question.")
    else:
        logger.error("Failed to fetch question. Status code: %s", response.status_code)

async def inline_query(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.inline_query.query
    if not query:
        return
    response = requests.get(API_URL)
    if response.status_code == 200:
        question_content = response.json()['question']['content']
        results = [
            InlineQueryResultArticle(
                id=str(response.json()['question']['id']),
                title="Random Question",
                input_message_content=InputTextMessageContent(question_content)
            )
        ]
        await update.inline_query.answer(results)
    else:
        logger.error("Failed to fetch question for inline query. Status code: %s", response.status_code)

def main() -> None:
    logger.info("Starting the bot.")
    application = Application.builder().token(TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(button))
    application.add_handler(InlineQueryHandler(inline_query))

    application.run_polling()

if __name__ == '__main__':
    main()
