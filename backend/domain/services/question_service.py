from typing import List, Dict


from backend.outbound.repositories.question_repository import QuestionRepository
from backend.outbound.repositories.user_repository import UserRepository
from backend.domain.services.utils import check_uid_equal
from backend.domain.supported_languages import is_supported_language, DEFAULT_LANGUSGE_ID
from backend.outbound.llm.gpt import GPT
from backend.outbound.queue.tasks.translation_task import process_question_translation, process_question_filters
from backend.api.core.logger import logger




class QuestionService:
    def __init__(self, question_repository=None, user_repository=None, llm = None):
        self.question_repository = question_repository or QuestionRepository()
        self.user_repository = user_repository or UserRepository()
        self.llm = llm or GPT()

    def create_question(self, content, anon, current_uid):
        if not content:
            return {"error": "Invalid form"}, 400
        if anon:
            fallback_uid = self.user_repository.get_or_create_hannah_id()
            uid = fallback_uid
        else:
            uid = current_uid
        question_id = self.question_repository.create_question(uid, content)
        logger.info(f"added question {question_id}")
        if not question_id:
            return {"error": "DB error"}, 500
        if uid:
            self.user_repository.add_question_to_user(uid, question_id)

        logger.info(f"going to add translation {question_id}")
        process_question_translation.delay(question_id, content)
        process_question_filters.delay(question_id, content)

        return {"success": True}, 200

    def get_questions(self, offset=0, language_id = DEFAULT_LANGUSGE_ID, occasion = None, level= None):
        questions = self.question_repository.get_all_questions(offset, occasion, level)
        json_questions =[self._serialize_question(q) for q in questions] 
        if language_id == DEFAULT_LANGUSGE_ID:
            return json_questions
        
        if not is_supported_language(language_id):
            return {"error": "Invalid language"}, 400
        
        return self._apply_translations(json_questions, language_id)


    def get_random_question(self, language_id = DEFAULT_LANGUSGE_ID, occasion = None, level= None):
        if language_id == DEFAULT_LANGUSGE_ID:
            question = self.question_repository.get_random_question(occasion, level)
            if not question:
                return {"error": "No questions available"}
            answers = self.question_repository.get_public_answers_for_question(question.id)
            json_question = {
                "question": self._serialize_question(question),
                "answers": self._apply_to_list(answers, self._serialize_answer)
            }
            return json_question
        
        if not is_supported_language(language_id):
            return {"error": "Invalid language"}, 400
        
        translated_question = self.question_repository.get_random_question_in_language(language_id , occasion, level)
        if not translated_question:
            return {"error": "No questions available"}
        
        question = self.question_repository.get_question_by_id(translated_question.question_id)
        answers = self.question_repository.get_public_answers_for_question(question.id)
        json_question = {
                "question": self._serialize_question(question),
                "answers": self._apply_to_list(answers, self._serialize_answer)
            }
        json_question["question"]["content"] = translated_question.translated_content
        return json_question

    def get_question_by_id(self, question_id, language_id = DEFAULT_LANGUSGE_ID):
        question = self.question_repository.get_question_by_id(question_id)
        if not question:
            return {"error": "Question not found"}
        answers = self.question_repository.get_public_answers_for_question(question_id)
        json_question = {
            "question": self._serialize_question(question),
            "answers": self._apply_to_list(answers, self._serialize_answer)
        }

        if language_id == DEFAULT_LANGUSGE_ID:
            return json_question
        
        if not is_supported_language(language_id):
            return {"error": "Invalid language"}, 400
        
        translated_content = self.question_repository.get_translation(question_id, language_id)
        json_question["question"]["content"] =  translated_content or "Not avilable in the selected language"
        return json_question

    def delete_question(self, question_id, current_uid):
        current_uid = int(current_uid)
        question = self.question_repository.get_question_by_id(question_id)
        if not question:
            return {"error": "Question not found"}, 404
        
        if not check_uid_equal(question.uid , current_uid):
            return {"error": "Not authorized"}, 403
        
        self.question_repository.delete_question(question_id)
        return {"success": True}, 200


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
    
    def _serialize_answer(self, ans):
        return  {
                "id": ans.id,
                "content": ans.content,
                "username": ans.user.username if ans.user else "Unknown",
                "time": ans.time
            }
    
    def _apply_to_list(self, l, function):
        return [function(item) for item in l]
    

    def _apply_translations(
        self, 
        questions: List[Dict], 
        language_id: str
        ) -> List[Dict]:
        translated_questions = []
        question_ids = [q["id"] for q in questions]
 
        translations = self.question_repository.get_translations(question_ids, language_id)

        for question in questions:
            translation = translations.get(question["id"])
            if translation:
                question["content"] = translation
                translated_questions.append(question)
                
        return translated_questions

