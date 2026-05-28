from backend.api.models.base import db
from backend.api.models.QuestionLevel import QuestionLevel
from backend.api.models.QuestionOccasions import QuestionOccasions
from backend.api.core.logger import logger


filter_to_model = {
    "level":QuestionLevel,
    "occasion": QuestionOccasions
}

class FilterRepository:
    def add_filter_values(self, question_id, filter_values):
        for key, value in filter_values.items():
            try:
                model = filter_to_model[key]
                filter_model = model.query.filter_by(question_id=question_id).first()
                if filter_model:
                    if key == "level":
                        filter_model.level_id = value
                    elif key == "occasion":
                        filter_model.occasion_ids = value
                else:
                    filter_model = model(question_id, value)
                    db.session.add(filter_model)
                db.session.commit()
            except Exception as e:
                logger.error(f"adding {key} to db failed", e)
                db.session.rollback()
                return False
        return True
    
    

