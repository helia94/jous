from backend.api.core.logger import logger
from backend.outbound.repositories.stat_repository import StatRepository
from backend.domain.supported_languages import supported_languages, is_supported_language, DEFAULT_LANGUSGE_ID
from backend.domain.filters.filters import get_filter_by_language

class FeatureService:
    def __init__(self, stat_repository=None):
        self.stat_repository = stat_repository or StatRepository()

    def get_languages(self):
        return {
            "languages": [
                {
                "name": l.name,
                "language_id": l.iso2
                } 
        for l in supported_languages]}
    

    def get_filters(self, language_id):
        if not is_supported_language(language_id) and language_id != DEFAULT_LANGUSGE_ID:
           return {"error": "Invalid language"}, 400
        
        return get_filter_by_language(language_id)
    

    def get_stats(self):
        stat = self.stat_repository.get_stat()
        return {
            "number_of_questions": stat.question,
            "number_of_answers": stat.answer,
            "number_of_users": stat.user,
            "age_of_oldest_question_days": stat.oldestQuestionAgeInDays,
        }
