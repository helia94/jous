from backend.api.models.base import db
from backend.api.models.Blog import Blog

class BlogRepository:
    def find_blog_by_url(self, url):
        return Blog.query.filter_by(url=url).first()

    def create_blog(self, url, html_content):
        blog = Blog(url, html_content)
        db.session.add(blog)
        db.session.commit()
        return blog