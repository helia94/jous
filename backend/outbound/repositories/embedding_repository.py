from backend.api.models.base import db
from backend.api.models.QuestionEmbedding import QuestionEmbedding
from backend.api.models.Question import Question
import numpy as np

class EmbeddingRepository:
    def add_or_update_embedding(self, question_id, embedding):
        record = QuestionEmbedding.query.filter_by(question_id=question_id).first()
        if record:
            record.embedding = embedding
        else:
            record = QuestionEmbedding(question_id=question_id, embedding=embedding)
            db.session.add(record)
        db.session.commit()

    def search(self, embedding, limit=20):
        records = QuestionEmbedding.query.all()
        if not records:
            return []
        scored = []
        for r in records:
            if r.embedding is None:
                continue
            vec = np.array(r.embedding, dtype=float)
            query_vec = np.array(embedding, dtype=float)
            if np.linalg.norm(vec) == 0 or np.linalg.norm(query_vec) == 0:
                score = -1
            else:
                score = float(np.dot(vec, query_vec) / (np.linalg.norm(vec) * np.linalg.norm(query_vec)))
            scored.append((score, r))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [s[1] for s in scored[:limit]]

    def get_questions_by_embeddings(self, embeddings):
        ids = [e.question_id for e in embeddings]
        return Question.query.filter(Question.id.in_(ids)).all()
