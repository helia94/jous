from backend.api.models.base import db
from backend.api.models.QuestionLevel import QuestionLevel
from backend.api.models.QuestionOccasions import QuestionOccasions
from backend.api.core.logger import logger


filter_to_model = {
    "Intensity":QuestionLevel,
    "Occasion": QuestionOccasions
}

class FilterRepository:
    def add_filter_values(self, question_id, filter_values):
        for key, value in filter_values:
            try:
                filter_model = (filter_to_model[key](question_id, value))
                db.session.add(filter_model)
                db.session.commit()
            except Exception as e:
                logger.error("adding {key} to db failed", e)
                db.session.rollback()
                return False
        return True
    
    

