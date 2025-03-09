from backend.outbound.repositories.blog_repository import BlogRepository
from backend.domain.blog_writer import BlogWriter

class BlogService:
    def __init__(self, blog_repository=None, llm = None):
        self.blog_repository = blog_repository or BlogRepository()
        self.blog_writer = BlogWriter(llm)

    def get_blog_by_url(self, url):
        blog = self.blog_repository.find_blog_by_url(url)
        if not blog:
            return {"error": "Blog not found"}, 404
        return blog.to_dict()

    def create_blog(self, url, title, storyline):
        if self.blog_repository.find_blog_by_url(url):
            return {"error": "Blog with this URL already exists"}, 400

        html_content = self.blog_writer.generate_article(title, storyline, url)

        blog = self.blog_repository.create_blog(url, html_content)
        return blog.to_dict()
