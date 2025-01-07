from backend.api.models.base import db
from backend.api.models.UserAuth import UserAuth
from backend.api.models.User import User
from backend.api.models.Question import Question
from backend.api.models.PublicAnswer import PublicAnswer


class UserRepository:
    def get_all_user_auths(self):
        return UserAuth.query.all()

    def find_user_auth_by_id(self, uid):
        return UserAuth.query.get(uid)

    def find_user_auth_by_username(self, username):
        return UserAuth.query.filter_by(username=username).first()

    def create_user_auth(self, username, email, pwd):
        user_auth = UserAuth(username, email, pwd)
        db.session.add(user_auth)
        db.session.flush()
        user = User(user_auth.id, username)
        db.session.add(user)
        db.session.flush()
        return user_auth.id


    def delete_user_auth(self, uid):
        user_auth = UserAuth.query.get(uid)
        user = User.query.get(uid)
        if user_auth:
            db.session.delete(user_auth)
        if user:
            db.session.delete(user)
        return True


    def commit_user_auth(self, user_auth):
        db.session.add(user_auth)
        return True


    def get_or_create_hannah_id(self):
        existing = UserAuth.query.filter_by(username="Hannah").first()
        if existing:
            return existing.id
        
        new_hannah = UserAuth("Hannah", "hannah@hannah.com", "Hannah")
        db.session.add(new_hannah)
        db.session.flush()
        new_user = User(new_hannah.id, "Hannah")
        db.session.add(new_user)
        return new_hannah.id


    def add_question_to_user(self, uid, question_id):
        user = User.query.get(uid)
        if not user:
            return False
        qs = user.questions or []
        qs.append(question_id)
        user.questions = qs
        db.session.add(user)
        return True

        
    def add_answer_to_user(self, uid, answer_id):
        user = User.query.get(uid)
        if not user:
            return False
        qs = user.answers or []
        qs.append(answer_id)
        user.questions = qs
        db.session.add(user)
        return True
     
    def get_user_questions(self, username, offset=0, limit=20):
        user_auth = self.find_user_auth_by_username(username)
        if not user_auth:
            return []
        return (Question.query.filter_by(uid=user_auth.id)
                .order_by(Question.id.desc())
                .offset(offset)
                .limit(limit)
                .all())

    def get_user_answers(self, username):
        user_auth = self.find_user_auth_by_username(username)
        if not user_auth:
            return []
        return (PublicAnswer.query.filter_by(uid=user_auth.id)
                .order_by(PublicAnswer.id.desc())
                .all())

    def get_answers_to_user_questions(self, uid):
        questions = Question.query.filter_by(uid=uid).all()
        question_ids = [q.id for q in questions]
        if not question_ids:
            return []
        return (PublicAnswer.query
                .filter(PublicAnswer.question.in_(question_ids))
                .order_by(PublicAnswer.id.desc())
                .all())
