from backend.api.core.utils import Mixin
from .base import db
from pgvector.sqlalchemy import Vector

class QuestionEmbedding(Mixin, db.Model):
    __tablename__ = 'question_embedding'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id', ondelete='CASCADE'), nullable=False, unique=True)
    embedding = db.Column(Vector(1536))

