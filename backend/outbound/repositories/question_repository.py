from backend.api.models.base import db
from backend.api.models.Question import Question
from backend.api.models.QuestionTranslation import QuestionTranslation
from backend.api.models.QuestionLevel import QuestionLevel
from backend.api.models.QuestionOccasions import QuestionOccasions
from backend.api.models.PublicAnswer import PublicAnswer
from backend.api.core.logger import logger
from sqlalchemy.sql.expression import func


class QuestionRepository:

    def create_question(self, uid, content):
        q = Question(uid, content, [])
        db.session.add(q)
        db.session.flush()
        return q.id

    def get_all_questions(self, offset, occasion, level):
        pageSize = 20
        limit = 20
        query = db.session.query(Question)

        if occasion:
            query = query.join(QuestionOccasions, Question.id == QuestionOccasions.question_id)
            query = query.filter(occasion == QuestionOccasions.occasion_ids.any_())
        if level is not None:
            query = query.join(QuestionLevel, Question.id == QuestionLevel.question_id)
            query = query.filter(QuestionLevel.level_id == level)

        questions = (query
                     .order_by(Question.id.desc())
                     .offset(pageSize * int(offset))
                     .limit(limit)
                     .all())
        return list(reversed(questions))

    def get_random_questions(self, occasion, level, limit=20):
        try:
            query = db.session.query(Question)
            if occasion:
                query = query.join(QuestionOccasions, Question.id == QuestionOccasions.question_id)
                query = query.filter(occasion == QuestionOccasions.occasion_ids.any_())
            if level is not None:
                query = query.join(QuestionLevel, Question.id == QuestionLevel.question_id)
                query = query.filter(QuestionLevel.level_id == level)
            return query.order_by(func.random()).limit(limit).all()
        except Exception as e:
            logger.error(e)
            return []

    def get_random_questions_in_language(self, language_id, occasion, level, limit=20):
        try:
            query = db.session.query(QuestionTranslation).join(
                Question,
                QuestionTranslation.question_id == Question.id
            )
            if occasion:
                query = query.join(QuestionOccasions, Question.id == QuestionOccasions.question_id)
                query = query.filter(QuestionOccasions.occasion_ids.any_() == occasion)
            if level is not None:
                query = query.join(QuestionLevel, Question.id == QuestionLevel.question_id)
                query = query.filter(QuestionLevel.level_id == level)
            query = query.filter(QuestionTranslation.language_id == language_id)
            return query.order_by(func.random()).limit(limit).all()
        except Exception as e:
            logger.error(e)
            return []

    def delete_question(self, question_id):
        PublicAnswer.query.filter_by(question=question_id).delete()

        question = Question.query.get(question_id)
        if question:
            db.session.delete(question)
        db.session.commit()



    def get_question_by_id(self, question_id):
        return Question.query.get(question_id)

    def get_questions_by_ids(self, ids):
        if not ids:
            return []
        return Question.query.filter(Question.id.in_(ids)).all()
    

    def get_public_answers_for_question(self, question_id):
        answers = PublicAnswer.query \
            .filter_by(question=question_id) \
            .order_by(PublicAnswer.id.desc()) \
            .limit(20).all()
        answers = list(reversed(answers))
        return answers

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
    
    def add_question_translation(self, question_id, languse_iso2, translated_text):
        try:
            t = QuestionTranslation(
                        question_id=question_id,
                        language_id=languse_iso2,
                        translated_content=translated_text
                    )
            db.session.add(t)
            db.session.commit()
            logger.info("add_question_translation: translation upserted into db")
        except Exception as e:
            logger.error("adding translation failed", e)
            db.session.rollback()
    
    def get_translations(self, question_ids, language_id):
        translations = QuestionTranslation.query.filter(
        QuestionTranslation.question_id.in_(question_ids),
        QuestionTranslation.language_id == language_id).all()
        return {t.question_id: t.translated_content for t in translations}
    
    def get_translation(self, question_id, language_id):
        translation = QuestionTranslation.query.filter(
        QuestionTranslation.question_id == question_id,
        QuestionTranslation.language_id == language_id).all()
        if translation:
            return translation[0].translated_content
        return None
    
    def has_translation(self, question_id, language_id):
        translations = QuestionTranslation.query.filter(
        QuestionTranslation.question_id == question_id,
        QuestionTranslation.language_id == language_id).all()
        return len(translations) != 0
