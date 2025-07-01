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
        """Get user data by ID."""
        with self._lock:
            return self.data.get(str(user_id), {})
    
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
        """Get all users that have both language and timezone data."""
        with self._lock:
            users_with_tz = {}
            for user_id, user_data in self.data.items():
                if 'lang' in user_data and 'timezone' in user_data:
                    users_with_tz[user_id] = user_data.copy()
            
            logger.info(f"Found {len(users_with_tz)} users with timezone data")
            return users_with_tz
    
    def remove_user_data(self, user_id):
        """Remove user data."""
        user_id_str = str(user_id)
        with self._lock:
            if user_id_str in self.data:
                del self.data[user_id_str]
                self.save_data()
                logger.info(f"Removed data for user {user_id}")


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
        params = {'lang': language_id}
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


async def get_next_question(language_id='en'):
    """Get next question for the specified language."""
    try:
        question_content = await fetch_question_in_language(language_id)
        return {
            'question': {
                'content': question_content
            }
        }
    except Exception as e:
        logger.error(f"Error getting next question: {e}")
        return {
            'question': {
                'content': get_fallback_question(language_id)
            }
        }


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command with improved user experience."""
    user_id = update.effective_user.id
    user_data = user_manager.get_user_data(user_id)
    
    try:
        if user_data.get('lang') and user_data.get('timezone') is not None:
            # Returning user with complete setup
            lang = user_data['lang'].upper()
            timezone = user_data['timezone']
            tz_str = f"UTC{timezone:+d}" if timezone != 0 else "UTC"
            
            welcome_msg = (
                f"🎉 Welcome back!\n\n"
                f"Your settings:\n"
                f"🌍 Language: {lang}\n"
                f"🕐 Timezone: {tz_str}\n\n"
                f"You're all set to receive daily questions at 7 PM your local time!\n\n"
                f"Use /newquestion for a question now, or /settimezone to change your timezone."
            )
            
            keyboard = [
                [InlineKeyboardButton("🎲 Get Question Now", callback_data="next")],
                [InlineKeyboardButton("⚙️ Change Settings", callback_data="settings")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await update.message.reply_text(welcome_msg, reply_markup=reply_markup)
            
        else:
            # New user or incomplete setup
            welcome_msg = (
                "🎉 Welcome to the Daily Question Bot!\n\n"
                "I'll send you a thought-provoking question every day at 7 PM your local time.\n\n"
                "Let's get started by selecting your language:"
            )
            
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
            await update.message.reply_text(welcome_msg, reply_markup=reply_markup)
            
    except Exception as e:
        logger.error(f"Error in start command: {e}")
        await update.message.reply_text(
            "Sorry, something went wrong. Please try again later."
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
            
            timezone_msg = (
                f"✅ Language set to {lang_name}!\n\n"
                f"Now, please set your timezone using the command:\n"
                f"`/settimezone +3` (for UTC+3)\n"
                f"`/settimezone -5` (for UTC-5)\n"
                f"`/settimezone 0` (for UTC)\n\n"
                f"This ensures you get your daily question at 7 PM your local time."
            )
            
            await query.edit_message_text(timezone_msg, parse_mode='Markdown')
            
        elif data == "next":
            # Get next question
            user_data = user_manager.get_user_data(user_id)
            language_id = user_data.get('lang', 'en')
            
            question_data = await get_next_question(language_id)
            question_text = question_data['question']['content']
            
            formatted_message = (
                f"🤔 **Question of the Day**\n\n"
                f"{question_text}\n\n"
                f"Take your time to think about it! 💭"
            )
            
            keyboard = [
                [InlineKeyboardButton("🎲 Another Question", callback_data="next")],
                [InlineKeyboardButton("⚙️ Settings", callback_data="settings")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(formatted_message, reply_markup=reply_markup, parse_mode='Markdown')
            
        elif data == "settings":
            # Show settings menu
            user_data = user_manager.get_user_data(user_id)
            lang = user_data.get('lang', 'Not set')
            timezone = user_data.get('timezone', 'Not set')
            
            if timezone != 'Not set':
                tz_str = f"UTC{timezone:+d}" if timezone != 0 else "UTC"
            else:
                tz_str = timezone
            
            settings_msg = (
                f"⚙️ **Your Settings**\n\n"
                f"🌍 Language: {lang.upper() if lang != 'Not set' else lang}\n"
                f"🕐 Timezone: {tz_str}\n\n"
                f"Use /settimezone to change your timezone."
            )
            
            keyboard = [
                [InlineKeyboardButton("🎲 Get Question", callback_data="next")],
                [InlineKeyboardButton("🏠 Main Menu", callback_data="main_menu")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(settings_msg, reply_markup=reply_markup, parse_mode='Markdown')
            
        elif data == "main_menu":
            # Return to main menu
            await start(update, context)
            
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
            f"Use /newquestion to get a question right now!"
        )
        
        await update.message.reply_text(success_msg)
        
    except Exception as e:
        logger.error(f"Error setting timezone: {e}")
        await update.message.reply_text(
            "Sorry, something went wrong while setting your timezone. Please try again."
        )


async def new_question(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /newquestion command."""
    user_id = update.effective_user.id
    
    try:
        user_data = user_manager.get_user_data(user_id)
        language_id = user_data.get('lang', 'en')
        
        question_data = await get_next_question(language_id)
        question_text = question_data['question']['content']
        
        formatted_message = (
            f"🤔 **Question for You**\n\n"
            f"{question_text}\n\n"
            f"Take your time to reflect! 💭"
        )
        
        keyboard = [
            [InlineKeyboardButton("🎲 Another Question", callback_data="next")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(formatted_message, reply_markup=reply_markup, parse_mode='Markdown')
        
    except Exception as e:
        logger.error(f"Error getting new question: {e}")
        await update.message.reply_text(
            "Sorry, I couldn't get a question right now. Please try again later."
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
        local_hour = 19  # 7 PM
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
        
        language_id = user_data.get('lang', 'en')
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


async def restore_user_jobs(application):
    """Restore daily question jobs for all users on bot startup."""
    try:
        users_with_timezone = user_manager.get_all_users_with_timezone()
        
        if not users_with_timezone:
            logger.info("No users with timezone data found")
            return
        
        logger.info(f"Restoring jobs for {len(users_with_timezone)} users")
        
        for user_id_str, user_data in users_with_timezone.items():
            try:
                user_id = int(user_id_str)
                timezone_offset = user_data['timezone']
                
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
        "• `/start` - Start the bot and set up your preferences\n"
        "• `/newquestion` - Get a question right now\n"
        "• `/settimezone +3` - Set your timezone (e.g., +3 for UTC+3)\n"
        "• `/help` - Show this help message\n\n"
        "**Features:**\n"
        "• Daily questions delivered at 7 PM your local time\n"
        "• Multiple language support\n"
        "• Personalized experience\n\n"
        "**Need help?** Just use /start to begin!"
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
        application.add_handler(CommandHandler("settimezone", set_timezone))
        application.add_handler(CommandHandler("newquestion", new_question))
        application.add_handler(CommandHandler("help", help_command))
        application.add_handler(CallbackQueryHandler(handle_callback))
        
        # Restore user jobs on startup
        async def post_init(application):
            await restore_user_jobs(application)
        
        application.post_init = post_init
        
        logger.info("Starting Daily Question Bot...")
        
        # Run the bot
        application.run_polling(allowed_updates=Update.ALL_TYPES)
        
    except Exception as e:
        logger.error(f"Error starting bot: {e}")


if __name__ == '__main__':
    main()

