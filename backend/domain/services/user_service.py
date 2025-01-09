import re
from backend.outbound.repositories.user_repository import UserRepository
from backend.outbound.security import checkpwd, encpwd

class UserService:
    def __init__(self, user_repository=None):
        self.user_repository = user_repository or UserRepository()

    def register_user(self, username, email, plain_pwd):
        if not username or not plain_pwd:
            return {"error": "Invalid form"}, 400
        existing = self.user_repository.find_user_auth_by_username(username)
        if existing:
            return {"error": "Username is used."}, 400
        if email:
            if not re.match(r"[\w._]{1,}@\w{1,}\.\w{1,}", email):
                return {"error": "Invalid email"}, 400
        encrypted_pwd = encpwd(plain_pwd)
        new_id = self.user_repository.create_user_auth(username, email, encrypted_pwd)
        if not new_id:
            return {"error": "Database error"}, 500
        return {"success": True}, 200

    def login_user(self, email_or_username, plain_pwd):
        if not (email_or_username and plain_pwd):
            return {"error": "Invalid form"}, 400

        user_auths = self.user_repository.get_all_user_auths()
        
        matching = list(filter(lambda x: (x.email == email_or_username or x.username == email_or_username) and checkpwd(plain_pwd, x.pwd), user_auths))
        
        if len(matching) == 1:
            user_id = matching[0].id
            return {"id": user_id}, 200
        else:
            return {"error": "Invalid credentials"}, 401
    
 

    def get_user_questions(self, username, offset=0):
        questions = self.user_repository.get_user_questions(username, offset)
        return [self._serialize_question(q) for q in questions]

    def get_user_answers(self, username):
        answers = self.user_repository.get_user_answers(username)
        return [self._serialize_answer(a) for a in answers]

    def get_answers_to_user_questions(self, uid):
        answers = self.user_repository.get_answers_to_user_questions(uid)
        return [self._serialize_answer(a) for a in answers]

    def _serialize_question(self, q):
        return {
            "id": q.id,
            "content": q.content,
            "uid": q.uid,
            "time": q.time,
            "reask_number": q.reask_number,
            "like_number": q.like_number,
            "answer_number": len(q.public_answer)
        }

    def _serialize_answer(self, a):
        return {
            "id": a.id,
            "uid": a.uid,
            "question": a.question,
            "content": a.content,
            "time": a.time
        }