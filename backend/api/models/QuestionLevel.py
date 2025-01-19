from datetime import datetime
import enum
from backend.api.core.utils import Mixin
from .base import db

class QuestionLevel(Mixin, db.Model):
    __tablename__ = 'question_level' 
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, nullable=False)
    level_id = db.Column(db.Integer, nullable=False)
