import json
from typing import Dict, List

from backend.outbound.llm.llm_interface import LLMInterface
from backend.domain.filters.evaluator_interface import EvaluatorInterface


KEY = "level"

class LevelEvaluator(EvaluatorInterface):
    def __init__(self, llm: LLMInterface):
        self.llm = llm


    def evaluate_single_option(self, question, options):
        options_dic = {idx : v for idx, v in enumerate(options)}

        prompt = f"""
        You are a judge for a card deck of personal questions used in gatherings. Your task is to categorize each question into one of these levels: {options_dic}, based on how challenging it is to answer.

        Consider the following factors:
        1. **Memory**: How much recall of past experiences is required?
        2. **Vulnerability**: Does it involve sharing personal or sensitive information?
        3. **Honesty**: Does it demand introspection or facing uncomfortable truths?
        4. **Thought Complexity**: How much effort is needed to understand the question or think about hypothetical scenarios, future plans, or abstract preferences?

        Examples to guide your judgment:
        - **Easy questions**: 
        - Do you need to be always the most emotional one in the relationship?
        - Would you ever value feedback of AI(s) more than that of fellow humans?

        - **Moderate questions**:
        - What can you rest on except your identity and your job?
        - Among people close to you, whose picture of you is most different/similar to the picture you have of yourself?

        - **Hard questions**:
        - What are some things you intuitively believed in, but did not have enough confidence to act upon until a person of authority validated them for you?
        - In which contexts does trying to satisfy other people's needs undermine your own, and where does it not?

        If you think there are additional elements influencing the difficulty, weigh them as well.

        Provide your result as a JSON object with the key "{KEY}" and the value as the index of the chosen level.

        Question:
        {question}
        """ 

        response = self.llm.get_response(prompt)
        try:
            response_json = json.loads(response)
            return response_json[KEY]
        except Exception:
            return "Error: Invalid JSON response from the LLM."
        
    def evaluate_many_option(self, question: str, options: List[str]) -> List[int]:
        pass