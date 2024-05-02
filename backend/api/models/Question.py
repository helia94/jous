from datetime import datetime

from backend.api.core import Mixin
from .base import db



class Question(Mixin, db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey("user.uid"))
    user = db.relationship('User', foreign_keys=uid)
    content = db.Column(db.String(2048))
    time = db.Column(db.TIMESTAMP)
    tags = db.Column(db.ARRAY(db.Integer))
    likes = db.Column(db.ARRAY(db.Integer))
    reasks = db.Column(db.ARRAY(db.Integer))
    public_answer = db.Column(db.ARRAY(db.Integer))
    reask_number = db.Column(db.Integer)
    like_number = db.Column(db.Integer)



    def __init__(self, uid, content, tags):
        self.uid = uid
        self.content = content
        self.time = datetime.utcnow()
        self.tags = tags
        self.likes = []
        self.reasks = []
        self.public_answer = []
        self.reask_number = 0
        self.like_number = 0


    def __repr__(self):
        return f"<Question {self.content}>"
