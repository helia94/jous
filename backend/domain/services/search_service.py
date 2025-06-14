import os
from openai import OpenAI
from backend.outbound.repositories.embedding_repository import EmbeddingRepository
from backend.outbound.repositories.question_repository import QuestionRepository
from backend.outbound.llm.gpt import GPT


class SearchService:
    def __init__(self, embedding_repository=None, question_repository=None, llm=None):
        self.embedding_repository = embedding_repository or EmbeddingRepository()
        self.question_repository = question_repository or QuestionRepository()
        self.llm = llm or GPT()
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    def _get_embedding(self, text: str):
        res = self.client.embeddings.create(model="text-embedding-3-small", input=[text])
        return res.data[0].embedding

    def _rewrite_query(self, query: str) -> str:
        prompt = (
            f"Rewrite the following search query to better match stored questions: {query}\n"
            "Return only the improved query."
        )
        return self.llm.get_response(prompt).strip()

    def search(self, query: str, limit: int = 20):
        limit = min(limit, 20)
        embedding = self._get_embedding(query)
        results = self.embedding_repository.search(embedding, limit)
        tries = 0
        while not results and tries < 5:
            query = self._rewrite_query(query)
            embedding = self._get_embedding(query)
            results = self.embedding_repository.search(embedding, limit)
            tries += 1

        questions = self.embedding_repository.get_questions_by_embeddings(results)
        q_map = {q.id: q for q in questions}
        ordered = [q_map[r.question_id] for r in results if r.question_id in q_map]
        return [
            {
                "id": q.id,
                "content": q.content,
                "uid": q.uid,
                "username": q.user.username if q.user else "Unknown",
                "time": q.time,
                "like_number": q.like_number,
                "answer_number": len(q.public_answer or []),
            }
            for q in ordered
        ]
