from outbound.repositories.question_repository import QuestionRepository
from outbound.repositories.user_repository import UserRepository
from api.core.logger import logger
import random

class QuestionService:
    def __init__(self, question_repository=None, user_repository=None):
        self.question_repository = question_repository or QuestionRepository()
        self.user_repository = user_repository or UserRepository()

    def get_questions(self, offset=0, limit=20):
        questions = self.question_repository.get_all_questions(offset, limit)
        return [self._serialize_question(q) for q in questions]

    def get_question_by_id(self, question_id):
        question = self.question_repository.get_question_by_id(question_id)
        if not question:
            return {"error": "Question not found"}
        answers = self.question_repository.get_public_answers_for_question(question_id)
        return {
            "question": self._serialize_question(question),
            "answers": answers
        }

    def create_question(self, content, anon, current_uid):
        if not content:
            return {"error": "Invalid form"}, 400
        if anon:
            fallback_uid = self.user_repository.get_or_create_hannah_id()
            uid = fallback_uid
        else:
            uid = current_uid
        question_id = self.question_repository.create_question(uid, content)
        if not question_id:
            return {"error": "DB error"}, 500
        if uid:
            self.user_repository.add_question_to_user(uid, question_id)
        return {"success": True}, 200

    def delete_question(self, question_id, current_uid):
        current_uid = int(current_uid)
        question = self.question_repository.get_question_by_id(question_id)
        if not question:
            return {"error": "Question not found"}, 404
        # Simple authority check: user must own the question
        if question.uid != current_uid:
            return {"error": "Not authorized"}, 403
        success = self.question_repository.delete_question(question_id)
        if success:
            return {"success": True}, 200
        return {"error": "Could not delete question"}, 500

    def get_random_question(self):
        question = self.question_repository.get_random_question()
        if not question:
            return {"error": "No questions available"}
        answers = self.question_repository.get_public_answers_for_question(question.id)
        return {
            "question": self._serialize_question(question),
            "answers": answers
        }

    def like_question(self, question_id):
        updated = self.question_repository.like_question(question_id)
        if not updated:
            return {"error": "Question not found or could not be liked"}, 404
        return {"success": True}

    def _serialize_question(self, q):
        return {
            "id": q.id,
            "content": q.content,
            "uid": q.uid,
            "username": (q.user.username if q.user else "Unknown"),
            "time": q.time,
            #"reask_number": q.reask_number,
            "like_number": q.like_number,
            "answer_number": len(q.public_answer)
        }
