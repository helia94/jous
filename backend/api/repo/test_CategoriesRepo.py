import unittest
from unittest.mock import patch
from backend.api.repo.CategoriesRepo import CategoriesRepo
from backend.api import create_app
from backend.api.models import db

class TestCategoriesRepo(unittest.TestCase):
    def setUp(self):
        # Set up the application and test client
        self.app, _ = create_app()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        # Import the repository class
        self.repo = CategoriesRepo()

    def tearDown(self):
        # Tear down the database after each test case
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    @patch('backend.api.models.db.session.add')
    @patch('backend.api.models.db.session.commit')
    def test_add_categories_success(self, mock_commit, mock_add):
        # Test adding categories successfully
        category_version = '1.0'
        categories = ['Books', 'Electronics']
        exclusive = True

        result = self.repo.add_categories(category_version, categories, exclusive)
        #result = self.repo.get_categories_by_version(category_version)
        self.assertIsNotNone(result)
        self.assertEqual(result.version, category_version)
        self.assertEqual(result.categories, categories)
        self.assertEqual(result.exclusive, exclusive)
        mock_add.assert_called_once()
        mock_commit.assert_called_once()


if __name__ == '__main__':
    unittest.main()
