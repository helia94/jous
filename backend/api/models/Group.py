from backend.api.core import Mixin
from .base import db


class Group(Mixin, db.Model):
    id = db.Column(db.Integer,
                   primary_key=True)
    group_name = db.Column(db.String(24))
    users = db.Column(db.ARRAY(db.Integer), db.ForeignKey("user.id"))
    questions = db.Column(db.ARRAY(db.Integer), db.ForeignKey("question.id"))


    def __init__(self, group_name, users):
        self.group_name = group_name
        self.users = users


    def __repr__(self):
        return f"<Group {self.group_name}>"
