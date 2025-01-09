from .base import db

class QuestionOccasions(db.Model):
    """
    Each row holds:
    - question_id (as the primary key),
    - a list of occasion_ids (an array) so a single question can have many occasions.
    """
    __tablename__ = 'question_occasions'

    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), primary_key=True)
    occasion_ids = db.Column(db.ARRAY(db.Integer), nullable=False)

    def __init__(self, question_id, occasion_ids):
        self.question_id = question_id
        self.occasion_ids = occasion_ids