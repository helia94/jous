import logging
import os
import json
import requests
import threading
from uuid import uuid4
from datetime import time, datetime
from telegram import Update, InlineQueryResultArticle, InputTextMessageContent, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler,
    InlineQueryHandler, ContextTypes, JobQueue
)

# Configuration
TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', 'your_bot_token_here')
LANG_API_URL = 'https://jous.app/api/languages'
QUESTION_API_URL = 'https://jous.app/api/question/random'
USER_DATA_FILE = 'user_data.json'

# Default settings
DEFAULT_LANGUAGE = 'en'
DEFAULT_TIMEZONE = 0  # UTC
DEFAULT_DAILY_TIME = 19  # 7 PM

# Logging setup
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)


class UserDataManager:
    """Thread-safe user data manager with proper error handling."""
    
    def __init__(self, filename=USER_DATA_FILE):
        self.filename = filename
        self.data = self.load_data()
        self._lock = threading.Lock()
    
    def load_data(self):
        """Load user data from file with error handling."""
        try:
            if os.path.exists(self.filename):
                with open(self.filename, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    logger.info(f"Loaded user data for {len(data)} users")
                    return data
        except (json.JSONDecodeError, IOError) as e:
            logger.error(f"Error loading user data: {e}")
        except Exception as e:
            logger.error(f"Unexpected error loading user data: {e}")
        
        logger.info("Starting with empty user data")
        return {}
    
    def save_data(self):
        """Save user data to file with error handling."""
        try:
            with self._lock:
                with open(self.filename, 'w', encoding='utf-8') as f:
                    json.dump(self.data, f, indent=2, ensure_ascii=False)
                logger.debug(f"Saved user data for {len(self.data)} users")
        except IOError as e:
            logger.error(f"Error saving user data: {e}")
        except Exception as e:
            logger.error(f"Unexpected error saving user data: {e}")
    
    def get_user_data(self, user_id):
        """Get user data by ID with defaults."""
        with self._lock:
            user_data = self.data.get(str(user_id), {})
            # Apply defaults if not set
            if 'lang' not in user_data:
                user_data['lang'] = DEFAULT_LANGUAGE
            if 'timezone' not in user_data:
                user_data['timezone'] = DEFAULT_TIMEZONE
            return user_data
    
    def set_user_data(self, user_id, key, value):
        """Set user data with automatic saving."""
        user_id_str = str(user_id)
        with self._lock:
            if user_id_str not in self.data:
                self.data[user_id_str] = {}
            self.data[user_id_str][key] = value
        
        # Save data after modification
        self.save_data()
        logger.debug(f"Set {key}={value} for user {user_id}")
    
    def get_all_users_with_timezone(self):
        """Get all users that have timezone data (for job restoration)."""
        with self._lock:
            users_with_tz = {}
            for user_id, user_data in self.data.items():
                # Include all users since we have defaults
                users_with_tz[user_id] = user_data.copy()
            
            logger.info(f"Found {len(users_with_tz)} users for job restoration")
            return users_with_tz


# Global user data manager instance
user_manager = UserDataManager()


def validate_timezone_offset(offset):
    """Validate timezone offset is within acceptable range."""
    try:
        offset_int = int(offset)
        return -12 <= offset_int <= 14
    except (ValueError, TypeError):
        return False


def parse_timezone_input(timezone_str):
    """Parse timezone input string and return integer offset."""
    if not timezone_str:
        return None
    
    # Remove whitespace
    timezone_str = timezone_str.strip()
    
    # Handle +/- prefix
    if timezone_str.startswith(('+', '-')):
        try:
            offset = int(timezone_str)
            return offset if validate_timezone_offset(offset) else None
        except ValueError:
            return None
    
    # Handle plain number
    try:
        offset = int(timezone_str)
        return offset if validate_timezone_offset(offset) else None
    except ValueError:
        return None


async def fetch_languages():
    """Fetch available languages from API with error handling."""
    try:
        response = requests.get(LANG_API_URL, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        languages = data.get('languages', [])
        
        if not languages:
            logger.warning("No languages received from API")
            return get_fallback_languages()
        
        logger.info(f"Fetched {len(languages)} languages from API")
        return languages
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching languages: {e}")
        return get_fallback_languages()
    except Exception as e:
        logger.error(f"Unexpected error fetching languages: {e}")
        return get_fallback_languages()


def get_fallback_languages():
    """Return fallback languages if API fails."""
    return [
        {'language_id': 'en', 'name': 'English'},
        {'language_id': 'es', 'name': 'Español'},
        {'language_id': 'fr', 'name': 'Français'},
        {'language_id': 'de', 'name': 'Deutsch'},
        {'language_id': 'it', 'name': 'Italiano'},
        {'language_id': 'pt', 'name': 'Português'},
    ]


async def fetch_question_in_language(language_id):
    """Fetch a question in the specified language with error handling."""
    try:
        params = {'language_id': language_id}
        response = requests.get(QUESTION_API_URL, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        questions = data.get('questions', [])
        
        if questions and len(questions) > 0:
            question_content = questions[0].get('question', {}).get('content', '')
            if question_content:
                logger.debug(f"Fetched question in {language_id}: {question_content[:50]}...")
                return question_content
        
        logger.warning(f"No question content found for language {language_id}")
        return get_fallback_question(language_id)
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching question for {language_id}: {e}")
        return get_fallback_question(language_id)
    except Exception as e:
        logger.error(f"Unexpected error fetching question for {language_id}: {e}")
        return get_fallback_question(language_id)


def get_fallback_question(language_id):
    """Return fallback question if API fails."""
    fallback_questions = {
        'en': 'What brings you joy today?',
        'es': '¿Qué te trae alegría hoy?',
        'fr': 'Qu\'est-ce qui vous apporte de la joie aujourd\'hui?',
        'de': 'Was bringt dir heute Freude?',
        'it': 'Cosa ti porta gioia oggi?',
        'pt': 'O que te traz alegria hoje?',
    }
    return fallback_questions.get(language_id, fallback_questions['en'])


def fetch_random_questions(chosen_lang):
    """Fetch multiple random questions for on-demand use."""
    try:
        response = requests.get(f"{QUESTION_API_URL}?language_id={chosen_lang}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            questions = data.get('questions', [])
            logger.debug(f"Fetched {len(questions)} random questions in {chosen_lang}")
            return questions
        logger.error("Failed to fetch questions. Status code: %s", response.status_code)
    except Exception as e:
        logger.error("Exception fetching questions: %s", e)
    return []


def get_next_question(context, chosen_lang):
    """Get next question from user's question queue."""
    questions = context.user_data.get('questions', [])
    if len(questions) < 2:
        # Refill question queue
        new_questions = fetch_random_questions(chosen_lang)
        questions.extend(new_questions)
    
    if not questions:
        # Fallback if no questions available
        return {
            'question': {
                'content': get_fallback_question(chosen_lang)
            }
        }
    
    next_question = questions.pop(0)
    context.user_data['questions'] = questions
    return next_question


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command with automatic setup."""
    user_id = update.effective_user.id
    user_data = user_manager.get_user_data(user_id)
    
    try:
        # Set up user with defaults if first time
        if str(user_id) not in user_manager.data:
            user_manager.set_user_data(user_id, 'lang', DEFAULT_LANGUAGE)
            user_manager.set_user_data(user_id, 'timezone', DEFAULT_TIMEZONE)
            
            # Automatically set up daily questions with defaults
            await setup_daily_questions_for_user(context, user_id, DEFAULT_TIMEZONE)
            
            welcome_msg = (
                f"🎉 Welcome to the Daily Question Bot!\n\n"
                f"I've automatically set you up with:\n"
                f"🌍 Language: English\n"
                f"🕐 Timezone: UTC (daily questions at 7 PM UTC)\n\n"
                f"✨ You'll now receive daily questions automatically!\n\n"
                f"**Commands to customize:**\n"
                f"• `/language` - Change your language\n"
                f"• `/settimezone +3` - Set your timezone\n"
                f"• `/question` - Get a question right now\n\n"
                f"Click below to get your first question!"
            )
            
            keyboard = [
                [InlineKeyboardButton("🎲 Get Question Now", callback_data="next")],
                [InlineKeyboardButton("🌍 Change Language", callback_data="change_lang")],
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await update.message.reply_text(welcome_msg, reply_markup=reply_markup)
            
        else:
            # Returning user
            lang = user_data['lang'].upper()
            timezone = user_data['timezone']
            tz_str = f"UTC{timezone:+d}" if timezone != 0 else "UTC"
            
            welcome_msg = (
                f"🎉 Welcome back!\n\n"
                f"Your current settings:\n"
                f"🌍 Language: {lang}\n"
                f"🕐 Timezone: {tz_str}\n\n"
                f"You're receiving daily questions at 7 PM your local time!\n\n"
                f"Use `/question` for a question now, or `/settimezone` to change your timezone."
            )
            
            keyboard = [
                [InlineKeyboardButton("🎲 Get Question Now", callback_data="next")],
                [InlineKeyboardButton("⚙️ Settings", callback_data="settings")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await update.message.reply_text(welcome_msg, reply_markup=reply_markup)
            
    except Exception as e:
        logger.error(f"Error in start command: {e}")
        await update.message.reply_text(
            "Sorry, something went wrong. Please try again later."
        )


async def language_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /language command to change language."""
    try:
        languages = await fetch_languages()
        keyboard = []
        
        # Create language selection buttons (2 per row)
        for i in range(0, len(languages), 2):
            row = []
            for j in range(2):
                if i + j < len(languages):
                    lang = languages[i + j]
                    row.append(InlineKeyboardButton(
                        f"{lang['name']}", 
                        callback_data=f"lang_{lang['language_id']}"
                    ))
            keyboard.append(row)
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text(
            "🌍 Select your preferred language:",
            reply_markup=reply_markup
        )
        
    except Exception as e:
        logger.error(f"Error in language command: {e}")
        await update.message.reply_text(
            "Sorry, couldn't load languages. Please try again later."
        )


async def question_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /question command for on-demand questions."""
    user_id = update.effective_user.id
    
    try:
        user_data = user_manager.get_user_data(user_id)
        chosen_lang = user_data.get('lang', DEFAULT_LANGUAGE)
        
        # Initialize question queue if needed
        if 'questions' not in context.user_data:
            context.user_data['questions'] = []
        
        question_obj = get_next_question(context, chosen_lang)
        question_content = question_obj['question']['content']
        
        formatted_message = (
            f"🤔 **Question for You**\n\n"
            f"{question_content}\n\n"
            f"💭 Take your time to reflect!"
        )
        
        keyboard = [
            [InlineKeyboardButton("🎲 Another Question", callback_data="next")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            formatted_message, 
            reply_markup=reply_markup, 
            parse_mode='Markdown'
        )
        
        logger.info(f"Served on-demand question to user {user_id} in {chosen_lang}")
        
    except Exception as e:
        logger.error(f"Error getting question for user {user_id}: {e}")
        await update.message.reply_text(
            "Sorry, I couldn't get a question right now. Please try again later."
        )


async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle callback queries with improved error handling."""
    query = update.callback_query
    user_id = query.from_user.id
    data = query.data
    
    try:
        await query.answer()
        
        if data.startswith("lang_"):
            # Language selection
            language_id = data.split("_", 1)[1]
            user_manager.set_user_data(user_id, 'lang', language_id)
            
            # Get language name for display
            languages = await fetch_languages()
            lang_name = next((lang['name'] for lang in languages if lang['language_id'] == language_id), language_id.upper())
            
            success_msg = (
                f"✅ Language set to {lang_name}!\n\n"
                f"Your daily questions will now be in {lang_name}.\n\n"
                f"Use `/settimezone +3` to set your timezone for daily delivery."
            )
            
            keyboard = [
                [InlineKeyboardButton("🎲 Get Question Now", callback_data="next")],
                [InlineKeyboardButton("🕐 Set Timezone", callback_data="set_tz")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(success_msg, reply_markup=reply_markup)
            
        elif data == "next":
            # Get next question
            user_data = user_manager.get_user_data(user_id)
            chosen_lang = user_data.get('lang', DEFAULT_LANGUAGE)
            
            # Initialize question queue if needed
            if 'questions' not in context.user_data:
                context.user_data['questions'] = []
            
            question_obj = get_next_question(context, chosen_lang)
            question_text = question_obj['question']['content']
            
            formatted_message = (
                f"🤔 **Question for You**\n\n"
                f"{question_text}\n\n"
                f"💭 Take your time to think about it!"
            )
            
            keyboard = [
                [InlineKeyboardButton("🎲 Another Question", callback_data="next")],
                [InlineKeyboardButton("⚙️ Settings", callback_data="settings")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(formatted_message, reply_markup=reply_markup, parse_mode='Markdown')
            
            logger.info(f"Served callback question to user {user_id} in {chosen_lang}")
            
        elif data == "change_lang":
            # Show language selection
            languages = await fetch_languages()
            keyboard = []
            
            for i in range(0, len(languages), 2):
                row = []
                for j in range(2):
                    if i + j < len(languages):
                        lang = languages[i + j]
                        row.append(InlineKeyboardButton(
                            f"{lang['name']}", 
                            callback_data=f"lang_{lang['language_id']}"
                        ))
                keyboard.append(row)
            
            reply_markup = InlineKeyboardMarkup(keyboard)
            await query.edit_message_text(
                "🌍 Select your preferred language:",
                reply_markup=reply_markup
            )
            
        elif data == "settings":
            # Show settings menu
            user_data = user_manager.get_user_data(user_id)
            lang = user_data.get('lang', DEFAULT_LANGUAGE)
            timezone = user_data.get('timezone', DEFAULT_TIMEZONE)
            
            tz_str = f"UTC{timezone:+d}" if timezone != 0 else "UTC"
            
            settings_msg = (
                f"⚙️ **Your Settings**\n\n"
                f"🌍 Language: {lang.upper()}\n"
                f"🕐 Timezone: {tz_str}\n"
                f"📅 Daily questions at 7 PM your local time\n\n"
                f"Use `/language` or `/settimezone` to change settings."
            )
            
            keyboard = [
                [InlineKeyboardButton("🎲 Get Question", callback_data="next")],
                [InlineKeyboardButton("🌍 Change Language", callback_data="change_lang")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(settings_msg, reply_markup=reply_markup, parse_mode='Markdown')
            
        elif data == "set_tz":
            # Timezone setting instructions
            tz_msg = (
                f"🕐 **Set Your Timezone**\n\n"
                f"Use the command: `/settimezone <offset>`\n\n"
                f"Examples:\n"
                f"• `/settimezone +3` for UTC+3\n"
                f"• `/settimezone -5` for UTC-5\n"
                f"• `/settimezone 0` for UTC\n\n"
                f"This ensures you get daily questions at 7 PM your local time."
            )
            
            await query.edit_message_text(tz_msg, parse_mode='Markdown')
            
    except Exception as e:
        logger.error(f"Error handling callback {data}: {e}")
        try:
            await query.edit_message_text("Sorry, something went wrong. Please try /start again.")
        except:
            pass


async def set_timezone(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /settimezone command with improved validation."""
    user_id = update.effective_user.id
    
    try:
        if not context.args:
            help_msg = (
                "🕐 **Set Your Timezone**\n\n"
                "Usage: `/settimezone <offset>`\n\n"
                "Examples:\n"
                "• `/settimezone +3` for UTC+3\n"
                "• `/settimezone -5` for UTC-5\n"
                "• `/settimezone 0` for UTC\n\n"
                "Valid range: -12 to +14"
            )
            await update.message.reply_text(help_msg, parse_mode='Markdown')
            return
        
        timezone_input = context.args[0]
        timezone_offset = parse_timezone_input(timezone_input)
        
        if timezone_offset is None:
            error_msg = (
                "❌ Invalid timezone format.\n\n"
                "Please use: `/settimezone +3` or `/settimezone -5`\n"
                "Valid range: -12 to +14"
            )
            await update.message.reply_text(error_msg, parse_mode='Markdown')
            return
        
        # Save timezone
        user_manager.set_user_data(user_id, 'timezone', timezone_offset)
        
        # Set up daily questions
        await setup_daily_questions_for_user(context, user_id, timezone_offset)
        
        # Confirmation message
        tz_str = f"UTC{timezone_offset:+d}" if timezone_offset != 0 else "UTC"
        success_msg = (
            f"✅ Timezone set to {tz_str}!\n\n"
            f"🎯 You'll receive daily questions at 7 PM your local time.\n\n"
            f"Use `/question` to get a question right now!"
        )
        
        await update.message.reply_text(success_msg)
        
    except Exception as e:
        logger.error(f"Error setting timezone: {e}")
        await update.message.reply_text(
            "Sorry, something went wrong while setting your timezone. Please try again."
        )


async def setup_daily_questions_for_user(context: ContextTypes.DEFAULT_TYPE, user_id: int, timezone_offset: int):
    """Set up daily question delivery for a user with error handling."""
    try:
        job_name = f"daily_question_{user_id}"
        
        # Remove existing jobs for this user
        current_jobs = context.job_queue.get_jobs_by_name(job_name)
        for job in current_jobs:
            job.schedule_removal()
        
        # Calculate UTC time for 7 PM local time
        local_hour = DEFAULT_DAILY_TIME  # 7 PM
        utc_hour = (local_hour - timezone_offset) % 24
        
        # Schedule daily job
        context.job_queue.run_daily(
            broadcast_question,
            time=time(hour=utc_hour, minute=0),
            context={'user_id': user_id},
            name=job_name
        )
        
        logger.info(f"Scheduled daily questions for user {user_id} at {utc_hour:02d}:00 UTC (7 PM local)")
        
    except Exception as e:
        logger.error(f"Error setting up daily questions for user {user_id}: {e}")


async def broadcast_question(context: ContextTypes.DEFAULT_TYPE):
    """Broadcast daily question to a user with error handling."""
    try:
        user_id = context.job.context['user_id']
        user_data = user_manager.get_user_data(user_id)
        
        if not user_data:
            logger.warning(f"No user data found for user {user_id}, skipping broadcast")
            return
        
        language_id = user_data.get('lang', DEFAULT_LANGUAGE)
        question_content = await fetch_question_in_language(language_id)
        
        # Format the daily question message
        current_time = datetime.now()
        formatted_message = (
            f"🌅 **Good Evening! Your Daily Question**\n\n"
            f"🤔 {question_content}\n\n"
            f"💭 Take a moment to reflect on this...\n\n"
            f"📅 {current_time.strftime('%B %d, %Y')}"
        )
        
        keyboard = [
            [InlineKeyboardButton("🎲 Another Question", callback_data="next")],
            [InlineKeyboardButton("⚙️ Settings", callback_data="settings")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await context.bot.send_message(
            chat_id=user_id,
            text=formatted_message,
            reply_markup=reply_markup,
            parse_mode='Markdown'
        )
        
        logger.info(f"Successfully sent daily question to user {user_id}")
        
    except Exception as e:
        logger.error(f"Error broadcasting question: {e}")
        # Don't re-raise to avoid job failure


async def inline_query(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle inline queries for questions."""
    try:
        user_id = update.inline_query.from_user.id
        user_data = user_manager.get_user_data(user_id)
        chosen_lang = user_data.get('lang', DEFAULT_LANGUAGE)
        
        # Initialize question queue if needed
        if 'questions' not in context.user_data:
            context.user_data['questions'] = []
        
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
            logger.info(f"Served inline query question in {chosen_lang} to user {user_id}")
        else:
            logger.error(f"Failed to fetch inline query question for user {user_id}")
            await update.inline_query.answer([])
            
    except Exception as e:
        logger.error(f"Error handling inline query: {e}")
        await update.inline_query.answer([])


async def restore_user_jobs(application):
    """Restore daily question jobs for all users on bot startup."""
    try:
        users_with_data = user_manager.get_all_users_with_timezone()
        
        if not users_with_data:
            logger.info("No users found for job restoration")
            return
        
        logger.info(f"Restoring jobs for {len(users_with_data)} users")
        
        for user_id_str, user_data in users_with_data.items():
            try:
                user_id = int(user_id_str)
                timezone_offset = user_data.get('timezone', DEFAULT_TIMEZONE)
                
                # Create a mock context for job setup
                mock_context = type('MockContext', (), {
                    'job_queue': application.job_queue
                })()
                
                await setup_daily_questions_for_user(mock_context, user_id, timezone_offset)
                
            except Exception as e:
                logger.error(f"Error restoring job for user {user_id_str}: {e}")
        
        logger.info("Job restoration completed")
        
    except Exception as e:
        logger.error(f"Error during job restoration: {e}")


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /help command."""
    help_text = (
        "🤖 **Daily Question Bot Help**\n\n"
        "**Commands:**\n"
        "• `/start` - Start the bot (automatic setup with defaults)\n"
        "• `/question` - Get a question right now\n"
        "• `/language` - Change your language preference\n"
        "• `/settimezone +3` - Set your timezone (e.g., +3 for UTC+3)\n"
        "• `/help` - Show this help message\n\n"
        "**Features:**\n"
        "• 🎯 **Automatic daily questions** at 7 PM your local time\n"
        "• 🎲 **On-demand questions** anytime you want\n"
        "• 🌍 **Multiple language support**\n"
        "• ⚙️ **Easy customization** of language and timezone\n"
        "• 💬 **Inline queries** - type @botname in any chat\n\n"
        "**Default Settings:**\n"
        "• Language: English\n"
        "• Timezone: UTC (7 PM UTC)\n\n"
        "You're automatically set up to receive daily questions!\n"
        "Customize your settings anytime with the commands above."
    )
    
    await update.message.reply_text(help_text, parse_mode='Markdown')


def main():
    """Main function to run the bot."""
    if not TOKEN or TOKEN == 'your_bot_token_here':
        logger.error("Please set TELEGRAM_BOT_TOKEN environment variable")
        return
    
    try:
        # Create application
        application = Application.builder().token(TOKEN).build()
        
        # Add handlers
        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("question", question_command))
        application.add_handler(CommandHandler("language", language_command))
        application.add_handler(CommandHandler("settimezone", set_timezone))
        application.add_handler(CommandHandler("help", help_command))
        application.add_handler(CallbackQueryHandler(handle_callback))
        application.add_handler(InlineQueryHandler(inline_query))
        
        # Restore user jobs on startup
        async def post_init(application):
            await restore_user_jobs(application)
        
        application.post_init = post_init
        
        logger.info("Starting Daily Question Bot with automatic setup...")
        
        # Run the bot
        application.run_polling(allowed_updates=Update.ALL_TYPES)
        
    except Exception as e:
        logger.error(f"Error starting bot: {e}")


if __name__ == '__main__':
    main()

