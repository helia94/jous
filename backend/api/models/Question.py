from api.core import Mixin
from .base import db


class Question(Mixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship('User', foreign_keys=uid)
    content = db.Column(db.String(2048))
    time = db.Column(db.TIMESTAMP)
    tags = db.Column(db.ARRAY(db.Integer))
    likes = db.relationship('User', uselist=True)
    reasks = db.Column(db.ARRAY(db.Integer))
    public_answer = db.Column(db.ARRAY(db.Integer))
    reask_number = db.Column(db.Integer)
    like_number = db.Column(db.Integer)

    def __repr__(self):
        return f"<Question {self.title}>"