from backend.api.core.utils import Mixin
from .base import db

class Blog(Mixin, db.Model):
    __tablename__ = 'blog'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), unique=True, nullable=False)
    html_content = db.Column(db.Text, nullable=False)

    def __init__(self, url, html_content):
        self.url = url
        self.html_content = html_content

    def to_dict(self):
        return {
            "id": self.id,
            "url": self.url,
            "html_content": self.html_content
        }

    def __repr__(self):
        return f"<Blog {self.url}>"