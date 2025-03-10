from backend.outbound.repositories.blog_repository import BlogRepository
from backend.outbound.queue.tasks.translation_task import create_blog_task

class BlogService:
    def __init__(self, blog_repository=None, llm = None):
        self.blog_repository = blog_repository or BlogRepository()

    def get_blog_by_url(self, url):
        blog = self.blog_repository.find_blog_by_url(url)
        if not blog:
            return {"error": "Blog not found"}, 404
        return blog.to_dict()

    def create_blog(self, url, title, storyline):
        create_blog_task.delay(url, title, storyline)
        return {"success": True}, 200
