from datetime import datetime
from backend.api.core.utils import Mixin
from .base import db

class UserAuth(Mixin, db.Model):
    __tablename__ = 'userauth'
    id = db.Column(db.Integer, unique=True, primary_key=True)
    username = db.Column(db.String(24), unique=True)
    email = db.Column(db.String(256))
    pwd = db.Column(db.String(256))
    time = db.Column(db.TIMESTAMP)

    def __init__(self, username, email, pwd):
        self.username = username
        self.email = email
        self.pwd = pwd
        self.time = datetime.utcnow()

    def __repr__(self):
        return f"<UserAuth {self.username}>"
