from openai import OpenAI
import os

from backend.outbound.llm_interface import LLMInterface

class GPT(LLMInterface):
    def __init__(self):
        self.client = client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY"), 
        )
        self.model_name = "gpt-4o"

    def get_response(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content