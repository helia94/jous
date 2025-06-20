from backend.service_registry import registry
from backend.domain.services.activity_service import ActivityService
from backend.domain.services.user_service import UserService
from backend.domain.services.question_service import QuestionService
from backend.domain.services.user_service import UserService
from backend.domain.services.answer_service import AnswerService
from backend.domain.services.feature_service import FeatureService
from backend.domain.services.blog_service import BlogService
from backend.domain.services.search_service import SearchService
from backend.outbound.llm.gpt import GPT

answer_service = AnswerService()
question_service = QuestionService(llm = registry.get_llm())
user_service = UserService()
activity_service = ActivityService()
user_service = UserService()
feature_service = FeatureService()
blog_service = BlogService(llm = GPT(model_name = 'o3-mini'))
search_service = SearchService()
