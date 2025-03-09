# this file structure follows http://flask.pocoo.org/docs/1.0/patterns/appfactories/
# initializing db in api.models.base instead of in api.__init__.py
# to prevent circular dependencies
from .Question import Question
from .UserAuth import UserAuth
from .User import User
from .Group import Group
from .GroupAnswer import GroupAnswer
from .PublicAnswer import PublicAnswer
from .InvalidToken import InvalidToken
from .base import db
from .Activity import Activity
from .QuestionTranslation import QuestionTranslation
from .Blog import Blog

__all__ = ["UserAuth", "Question", "InvalidToken", "User", "Group", "GroupAnswer", "PublicAnswer", "Activity", "db", "QuestionTranslation", "Blog"]

# You must import all of the new Models you create to this page
