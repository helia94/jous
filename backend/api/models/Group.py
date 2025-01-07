from datetime import datetime
from backend.api.core.utils import Mixin
from .base import db

class Group(Mixin, db.Model):
    __tablename__ = 'group'
    id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(24), unique=True)
    users = db.Column(db.ARRAY(db.Integer))
    time = db.Column(db.TIMESTAMP)
    questions = db.Column(db.ARRAY(db.Integer))

    def __init__(self, group_name, users):
        self.group_name = group_name
        self.users = users
        self.time = datetime.utcnow()
        self.questions = []

    def __repr__(self):
        return f"<Group {self.group_name}>"
