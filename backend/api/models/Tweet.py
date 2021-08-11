from api.core import Mixin
from .base import db


class Tweet(Mixin, db.Model):
    id = db.Column(db.Integer,
                   unique=True,
                   primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship('User', foreign_keys=uid)
    title = db.Column(db.String(256))
    content = db.Column(db.String(2048))

    def __repr__(self):
        return f"<Tweet {self.title}>"