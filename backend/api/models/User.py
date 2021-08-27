from api.core import Mixin
from .base import db

class User(Mixin, db.Model):
    __tablename__ = 'user'
    uid = db.Column(db.Integer,
                    db.ForeignKey("userauth.id"),
                    primary_key=True)
    username = db.Column(db.String(24), unique=True)
    groups = db.Column(db.ARRAY(db.Integer))
    followings = db.Column(db.ARRAY(db.Integer))
    followers = db.Column(db.ARRAY(db.Integer))
    questions = db.Column(db.ARRAY(db.Integer))
    answers = db.Column(db.ARRAY(db.Integer))


    def __init__(self, uid, username):
        self.uid = uid
        self.username = username
        self.groups = []
        self.followings = []
        self.followers = []
        self.questions = []
        self.answers = []


    def __repr__(self):
        return f"<User {self.username}>"
