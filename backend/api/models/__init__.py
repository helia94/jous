# this file structure follows http://flask.pocoo.org/docs/1.0/patterns/appfactories/
# initializing db in api.models.base instead of in api.__init__.py
# to prevent circular dependencies
from .Question import Question
from .UserAuth import UserAuth
from .InvalidToken import InvalidToken
from .base import db

__all__ = ["UserAuth", "Question", "InvalidToken", "db"]

# You must import all of the new Models you create to this page
