from datetime import datetime

from api.core import Mixin
from .base import db


class PublicAnswer(Mixin, db.Model):
    __tablename__ = 'publicanswer'
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey("user.uid"))
    user = db.relationship('User', foreign_keys=uid)
    question = db.Column(db.Integer, db.ForeignKey("question.id"))
    content = db.Column(db.String(2048))
    time = db.Column(db.TIMESTAMP)
    likes = db.relationship('User', uselist=True)


    def __init__(self, uid, question, content):
        self.uid = uid
        self.question = question
        self.content = content
        self.time = datetime.utcnow()
        self.likes = []


    def __repr__(self):
        return f"<PublicAnswer {self.id}>"
