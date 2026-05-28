from openai import OpenAI, OpenAIError
import os

from backend.outbound.alerts import send_openai_model_alert
from backend.outbound.llm.llm_interface import LLMInterface

model_list = [
    "gpt-4o",
    "gpt-4-turbo",
    "gpt-4",
    "gpt-3.5-turbo",
    "o3-mini",
    "o1"
]

class GPT(LLMInterface):
    def __init__(self, model_name: str | None = None):
        self.client = client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY"),
        )
        self.model_name = model_name or os.environ.get("OPENAI_CHAT_MODEL", "gpt-4o")

    def get_response(self, prompt: str) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                timeout=300
            )
        except OpenAIError as e:
            if "model_not_found" in str(e) or "does not exist or you do not have access" in str(e):
                send_openai_model_alert(self.model_name, str(e))
            raise
        return response.choices[0].message.content
