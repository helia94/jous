import unittest
from backend.api.views.Categorizer import Categorizer  


class CategorizerTestCase(unittest.TestCase):
    def setUp(self):
        self.categorizer = Categorizer()  # Replace with the actual class name

    def test_get_tags_single_category_version(self):
        question = "How to use Python decorators?"
        category_version = "v1.0"
        expected_tags = ["python", "decorators"]
        actual_tags = self.categorizer.get_tags(question, category_version)
        self.assertEqual(actual_tags, expected_tags)

    def test_get_tags_multiple_category_versions(self):
        question = "What are the best practices for exception handling in Python?"
        category_versions = ["v1.0", "v2.0", "v3.0"]
        expected_tags = ["python", "exception handling", "best practices"]
        actual_tags = self.categorizer.get_tags(question, category_versions)
        self.assertEqual(actual_tags, expected_tags)

if __name__ == '__main__':
    unittest.main()