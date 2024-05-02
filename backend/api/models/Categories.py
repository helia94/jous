from backend.api.core import Mixin
from .base import db


class Categories(Mixin, db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer,
                   primary_key=True)
    version = db.Column(db.String(24), unique=True)
    categories = db.Column(db.ARRAY(db.String(200)))
    exclusive = db.Column(db.Boolean, default=False) 


    def __init__(self, version, categories, exclusive):
        print("Categories __init__")
        self.version = version
        self.categories = categories
        self.exclusive = exclusive

    def __repr__(self):
        return f"<Categories {self.version}>"
