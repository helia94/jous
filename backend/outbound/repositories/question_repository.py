from backend.api.models.base import db
from backend.api.models.Question import Question
from backend.api.models.QuestionTranslation import QuestionTranslation
from backend.api.models.PublicAnswer import PublicAnswer
from backend.api.core.logger import logger
import random

class QuestionRepository:
    def get_all_questions(self, offset, limit=20):
        pageSize = 20
        questions = Question.query.order_by(Question.id.desc()) \
            .offset(pageSize * int(offset)).limit(limit).all()
        return list(reversed(questions))
    
    def get_translations(self, question_ids, language_id):
        translations = QuestionTranslation.query.filter(
        QuestionTranslation.question_id.in_(question_ids),
        QuestionTranslation.language_id == language_id).all()
        return {t.question_id: t.translated_content for t in translations}

    def get_question_by_id(self, question_id):
        return Question.query.get(question_id)

    def create_question(self, uid, content):
        q = Question(uid, content, [])
        db.session.add(q)
        db.session.flush()
        return q.id
    
    def add_question_translation(self, question_id, languse_iso2 , translated_text):
        try:
            t = QuestionTranslation(
                        question_id=question_id,
                        language_id=languse_iso2,
                        translated_content=translated_text
                    )
            db.session.add(t)
            db.session.commit()
            logger.info(f"add_question_translation: added translation to db")

        except Exception as e:
            logger.error("adding translation failed", e)
            db.session.rollback()

    def delete_question(self, question_id):
        PublicAnswer.query.filter_by(question=question_id).delete()
        question = Question.query.get(question_id)
        if question:
            db.session.delete(question)

    def get_public_answers_for_question(self, question_id):
        answers = PublicAnswer.query \
            .filter_by(question=question_id) \
            .order_by(PublicAnswer.id.desc()) \
            .limit(20).all()
        answers = list(reversed(answers))
        return answers
    
    def get_random_question(self):
        try:
            question_count = Question.query.count()
            if question_count == 0:
                return None
            rand_offset = random.randint(0, question_count - 1)
            return Question.query.offset(rand_offset).first()
        except Exception as e:
            logger.error(e)
            return None
        
    def get_random_question_in_language(self, language_id):
        try:
            question_count = QuestionTranslation.query\
                .filter_by(language_id=language_id)\
                .count()
            if question_count == 0:
                return None
            rand_offset = random.randint(0, question_count - 1)
            return QuestionTranslation.query\
                .filter_by(language_id=language_id)\
                .offset(rand_offset).first()
        except Exception as e:
            logger.error(e)
            return None

    def like_question(self, question_id):
        question = Question.query.get(question_id)
        if not question:
            return False
        question.like_number += 1
        db.session.flush()
        return True
        
    def add_answer_to_question(self, question_id, answer_id):
        question = Question.query.get(question_id)
        if not question:
            return False

        # Modify the field in place and reassign to trigger change tracking
        if question.public_answer is None:
            question.public_answer = [answer_id]
        else:
            question.public_answer = question.public_answer + [answer_id]
        db.session.flush()
        return True

