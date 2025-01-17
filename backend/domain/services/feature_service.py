from backend.api.core.logger import logger
from backend.domain.supported_languages import supported_languages

class FeatureService:

    def get_languages(self):
        return {"languages": [{
            "name": l.name,
            "language_id": l.iso2
        } for l in supported_languages]}
