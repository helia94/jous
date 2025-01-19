import json
from typing import Dict, List

from backend.outbound.llm.llm_interface import LLMInterface
from backend.domain.filters.evaluator_interface import EvaluatorInterface


KEY = "occasion"

class OccasionEvaluator(EvaluatorInterface):
    def __init__(self, llm: LLMInterface):
        self.llm = llm


    def evaluate_many_option(self, question: str, options: List[str]) -> int:
        options_dic = {idx : v for idx, v in enumerate(options)}

        prompt = f"""
        You are a judge for a card deck of personal questions used in various settings. 
        Your task is to determine which occasions from the following list: 
        {options_dic}, a given question is most suitable for. 
        Multiple occasions may apply, so provide your response as a list of indices.

        Consider the following factors when deciding an appropriate occasion:
        1. **Tone**: Does the question align with the mood of the occasion (e.g., lighthearted for casual socializing, deeper for self-reflection)?
        2. **Audience**: Is the question appropriate for the group dynamic (e.g., strangers vs. close friends, colleagues vs. family)?
        3. **Context**: Does the question suit the purpose of the occasion (e.g., team-building questions focus on collaboration, while first-date questions foster connection)?
        4. **Depth**: Does the question match the level of intimacy typical for the occasion (e.g., philosophical questions may fit cultural exchanges or long conversations)?
        5. **Relevance**: Is the question situationally relevant (e.g., travel-related questions for trips or kid-friendly questions for gatherings with children)?


        Provide your result as a JSON object with the key "{KEY}" and 
        the value as a list of indices representing the chosen occasions.
        choose at least one category.

        Question:
        {question}
"""



        response = self.llm.get_response(prompt)
        try:
            response_json = json.loads(response)
            return response_json[KEY]
        except Exception:
            return "Error: Invalid JSON response from the LLM."