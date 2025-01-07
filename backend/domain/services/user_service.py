import re
from outbound.repositories.user_repository import UserRepository
from outbound.security import check_password, encrypt_password
from api.core.logger import logger

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
            if not re.match(r"[\w._]{5,}@\w{3,}\.\w{2,4}", email):
                return {"error": "Invalid email"}, 400
        encrypted_pwd = encrypt_password(plain_pwd)
        new_id = self.user_repository.create_user_auth(username, email, encrypted_pwd)
        if not new_id:
            return {"error": "Database error"}, 500
        return {"success": True}, 200

    def login_user(self, email_or_username, plain_pwd):
        if not (email_or_username and plain_pwd):
            return {"error": "Invalid form"}, 400
        user_auths = self.user_repository.get_all_user_auths()
        matching = [
            ua for ua in user_auths
            if (ua.email == email_or_username or ua.username == email_or_username)
               and check_password(plain_pwd, ua.pwd)
        ]
        if len(matching) == 1:
            user_id = matching[0].id
            logger.info(f"User {user_id} logged in successfully.")
            return {"id": user_id}, 200
        else:
            return {"error": "Invalid credentials"}, 401

    def remove_user(self, uid):
        return self.user_repository.delete_user_auth(uid)

    def change_password(self, uid, old_password, new_password):
        user_auth = self.user_repository.find_user_auth_by_id(uid)
        if not user_auth:
            return {"error": "User not found"}, 404
        if not (old_password and new_password):
            return {"error": "Invalid form"}, 400
        if not check_password(old_password, user_auth.pwd):
            return {"error": "Wrong password"}, 400
        user_auth.pwd = encrypt_password(new_password)
        if not self.user_repository.commit_user_auth(user_auth):
            return {"error": "Could not update password"}, 500
        return {"success": True}, 200

    def delete_account(self, uid):
        success = self.remove_user(uid)
        if success:
            return {"success": True}, 200
        else:
            return {"error": "Could not delete user"}, 500

    # ------------------ Newly added functions ------------------
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