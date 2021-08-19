from api.core import Mixin
from .base import db


class GroupAnswer(Mixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship('User', foreign_keys=uid)
    group = db.Column(db.Integer, db.ForeignKey("group.id"))
    question = db.Column(db.Integer, db.ForeignKey("question.id"))
    content = db.Column(db.String(2048))
    time = db.Column(db.TIMESTAMP)
    likes = db.relationship('User', uselist=True)


    def __init__(self, uid, group, question, content, time):
        self.uid = uid
        self.group = group
        self.question = question
        self.content = content
        self.time = time
        self.likes = []

    def __repr__(self):
        return f"<GroupAnswer {self.id}>"
