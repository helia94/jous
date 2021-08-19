from backend.api.core import Mixin
from .base import db


class UserAuth(Mixin, db.Model):
    id = db.Column(db.Integer,
                   unique=True,
                   primary_key=True)
    username = db.Column(db.String(24))
    email = db.Column(db.String(256))
    pwd = db.Column(db.String(256))


    def __init__(self, username, email, pwd):
        self.username = username
        self.email = email
        self.pwd = pwd


    def __repr__(self):
        return f"<UserAuth {self.username}>"
