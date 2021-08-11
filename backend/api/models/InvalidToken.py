from api.core import Mixin
from .base import db


class InvalidToken(Mixin, db.Model):
    __tablename__ = "invalid_tokens"
    id = db.Column(db.Integer,
                   unique=True,
                   primary_key=True)
    jti = db.Column(db.String)

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_invalid(cls, jti):
        q = cls.query.filter_by(jti=jti).first()
        return bool(q)