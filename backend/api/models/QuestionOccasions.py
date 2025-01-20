
from backend.api.core.utils import Mixin
from .base import db

class QuestionOccasions(Mixin, db.Model):
    __tablename__ = 'question_occasions' 
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id", ondelete="CASCADE"), nullable=False, unique = True)
    occasion_ids = db.Column(db.ARRAY(db.Integer), nullable=False)

    def __init__(self, question_id, occasion_ids):
        self.question_id = question_id
        self.occasion_ids = occasion_ids

