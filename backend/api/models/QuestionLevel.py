from backend.api.core.utils import Mixin
from .base import db

class QuestionLevel(Mixin, db.Model):
    __tablename__ = 'question_level' 
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id", ondelete="CASCADE"), nullable=False, unique = True)
    level_id = db.Column(db.Integer, nullable=False)

    def __init__(self, question_id, level_id):
        self.question_id = question_id
        self.level_id = level_id
