from backend.api.core.logger import logger
from backend.domain.supported_languages import supported_languages, is_supported_language
from backend.domain.filters.filters import get_filter_by_language

class FeatureService:

    def get_languages(self):
        return {
            "languages": [
                {
                "name": l.name,
                "language_id": l.iso2
                } 
        for l in supported_languages]}
    

    def get_filters(self, language_id):
        if not is_supported_language(language_id):
            return {"error": "Invalid language"}, 400
        
        return get_filter_by_language(language_id)
