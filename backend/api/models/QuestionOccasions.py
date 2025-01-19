
from backend.api.core.utils import Mixin
from .base import db

class QuestionOccasions(Mixin, db.Model):
    __tablename__ = 'question_occasions' 
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, nullable=False)
    occasion_ids = db.Column(db.Array(db.Integer), nullable=False)
