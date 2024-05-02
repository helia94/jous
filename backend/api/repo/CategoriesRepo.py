from backend.api.models.Categories import Categories
from backend.api.repo.BaseRepo import BaseRepo




# Create the repository class
class CategoriesRepo(BaseRepo):

    def get_categories_by_version(self, category_version):
        categories = Categories.query.filter_by(version=category_version).first()
        return categories
    
    def add_categories(self, category_version, categories, exclusive):
        new_categories = Categories(version=category_version, categories=categories, exclusive=exclusive)
        self.commit_db(new_categories)
        return new_categories

