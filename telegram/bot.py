from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
import requests
import os

# Define the Telegram bot token from environment variable
TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')

# Define the API endpoint URL
API_URL = 'https://jous.app/api/question/random'


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    keyboard = [[InlineKeyboardButton("Next", callback_data='next')]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Hello curious stranger, let's dig some juice, shall we?", reply_markup=reply_markup)

async def button(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()
    response = requests.get(API_URL)
    question_content = response.json()['question']['content']
    keyboard = [[InlineKeyboardButton("Next question", callback_data='next')]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.edit_message_text(text=f"{question_content}", reply_markup=reply_markup)

def main() -> None:
    application = Application.builder().token(TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(button))

    application.run_polling()

if __name__ == '__main__':
    main()
