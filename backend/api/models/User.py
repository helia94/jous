from backend.api.core import Mixin
from .base import db


class User(Mixin, db.Model):
    uid = db.Column(db.Integer,
                    db.ForeignKey("userauthentication.id"),
                    primary_key=True)
    username = db.Column(db.String(24))
    groups = db.Column(db.ARRAY(db.Integer))
    followings = db.Column(db.ARRAY(db.Integer))
    followers = db.Column(db.ARRAY(db.Integer))
    questions = db.Column(db.ARRAY(db.Integer))
    answers = db.Column(db.ARRAY(db.Integer))


    def __init__(self, username):
        self.username = username
        self.groups = []
        self.followings = []
        self.followers = []
        self.questions = []
        self.answers = []


    def __repr__(self):
        return f"<User {self.username}>"
