from datetime import datetime
import enum
from api.core.utils import Mixin
from .base import db

class ActivityType(enum.Enum):
    answer = "answer"
    newGroup = "newGroup"
    questionInGroup = "questionInGroup"
    answerInGroup = "answerInGroup"

class Activity(Mixin, db.Model):
    __tablename__ = 'activity'
    id = db.Column(db.Integer, primary_key=True)
    toUid = db.Column(db.Integer, db.ForeignKey("user.uid"))
    fromUid = db.Column(db.Integer, db.ForeignKey("user.uid"))
    fromUser = db.relationship('User', foreign_keys=fromUid)
    time = db.Column(db.TIMESTAMP)
    type = db.Column(db.Enum(ActivityType))
    read = db.Column(db.Boolean)
    what = db.Column(db.Integer)

    def __init__(self, toUid, fromUid, type, what):
        self.toUid = toUid
        self.fromUid = fromUid
        self.time = datetime.utcnow()
        self.type = type
        self.read = False
        self.what = what

    def __repr__(self):
        return f"<Activity {self.what} from {self.fromUid} to {self.toUid}>"
