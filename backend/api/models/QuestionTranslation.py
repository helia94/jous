from backend.api.core.utils import Mixin
from .base import db

class QuestionTranslation(Mixin, db.Model):
    __tablename__ = 'question_translations' 
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id", ondelete="CASCADE"), nullable=False)
    language_id = db.Column(db.String(50), nullable=False)
    translated_content = db.Column(db.Text, nullable=False)