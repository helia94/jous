from backend.api.models import Question
from backend.api.repo.BaseRepo import BaseRepo
from sqlalchemy import and_, or_, func


# Create the repository class
class QuestionRepo(BaseRepo):

    def get_questions(self, tags, offset, pageSize):
        query = Question.query

        # Apply AND between outer lists and OR within each inner list
        for tag_group in tags:
            query = query.filter(or_(Question.tags.any(tag) for tag in tag_group))

        # Apply pagination and execute the query
        questions = query.order_by(Question.id.desc()).offset(pageSize * int(offset)).limit(pageSize).all()
        return questions



        

