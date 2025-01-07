from outbound.repositories.answer_repository import AnswerRepository
from outbound.repositories.user_repository import UserRepository
from outbound.repositories.question_repository import QuestionRepository
from outbound.repositories.activity_repository import ActivityRepository



class AnswerService:
    def __init__(self, answer_repository=None, user_repository=None, question_repository=None, activity_repository=None):
        self.answer_repository = answer_repository or AnswerRepository()
        self.user_repository = user_repository or UserRepository()
        self.question_repository = question_repository or QuestionRepository()
        self.activity_repository = activity_repository or ActivityRepository()


    def add_answer(self, content, anon, question_id, current_uid):
        if not content:
            return {"error": "Content required"}, 400
        if not question_id:
            return {"error": "Question ID required"}, 400

        if anon:
            fallback_uid = self.user_repository.get_or_create_hannah_id()
            uid = fallback_uid
        else:
            uid = current_uid

        question = self.question_repository.get_question_by_id(question_id)
        if not question:
            return {"error": "Question not found"}, 404
        

        answer_id = self.answer_repository.create_public_answer(uid, question_id, content)
        if not answer_id:
            return {"error": "DB error"}, 500

        self.user_repository.add_answer_to_user(uid, answer_id)
        self.question_repository.add_answer_to_question(question_id, answer_id)

        if question.uid != uid:
            self.activity_repository.log_activity(
                recipient_id=question.uid,
                activity_type="answer",
                actor_id=uid,
                question_id=question_id
            )

        return {"success": True, "answer_id": answer_id}, 200


    def delete_answer(self, answer_id, current_uid):
        answer = self.answer_repository.find_public_answer_by_id(answer_id)
        if not answer:
            return {"error": "Answer not found"}, 404
        if answer.uid != current_uid:
            return {"error": "Not authorized"}, 403

        success = self.answer_repository.delete_public_answer(answer_id)
        if not success:
            return {"error": "DB error"}, 500

        return {"success": True}, 200