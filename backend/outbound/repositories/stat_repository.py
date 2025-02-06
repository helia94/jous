from backend.api.models.base import db
from backend.api.models.Question import Question
from backend.api.models.PublicAnswer import PublicAnswer
from backend.api.models.User import User
from dataclasses import dataclass
import datetime


@dataclass
class ObjectCounts: 
    question: int
    answer: int
    user: int
    oldestQuestionAgeInDays: int



class StatRepository:

      def get_stat(self):
        number_of_questions = db.session.query(Question).count()
        number_of_answers = db.session.query(PublicAnswer).count()
        number_of_users = db.session.query(User).count()
        oldest_question = db.session.query(db.func.min(Question.time)).scalar()
        oldest_question_age = (datetime.datetime.utcnow() - oldest_question).days if oldest_question else 0

        return ObjectCounts(
            question=number_of_questions,
            answer=number_of_answers,
            user=number_of_users,
            oldestQuestionAgeInDays=oldest_question_age
        )
    
