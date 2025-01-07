from api.models.base import db
from api.models.PublicAnswer import PublicAnswer
from api.core.logger import logger

class AnswerRepository:
    def create_public_answer(self, uid, question_id, content):
        ans = PublicAnswer(uid=uid, question=question_id, content=content)
        db.session.add(ans)
        db.session.flush()
        return ans.id

    def delete_public_answer(self, answer_id):
        ans = PublicAnswer.query.get(answer_id)
        if ans:
            db.session.delete(ans)
        return True

    def find_public_answer_by_id(self, answer_id):
        return PublicAnswer.query.get(answer_id)