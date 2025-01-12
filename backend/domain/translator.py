import json

from backend.outbound.llm.llm_interface import LLMInterface

class Translator:
    def __init__(self, llm: LLMInterface):
        self.llm = llm

    def translate(self, text: str, language: str, extra_comments: str = "") -> str:

        prompt = f"""
        You are a translator. Translate the following Quesion to {language} with these guidelines:
        - Prioritize readability, familiarity, and engagement in the target language.
        - Ensure the question's meaning is correctly conveyed, not its exact phrasing.
        - Use informal pronouns if applicable. Keep friendly.
        - Consider these additional comments: {extra_comments}.

        Return a JSON object with the key "translation" containing the translated text.

        Original Quesion:
        {text}
        """


        response = self.llm.get_response(prompt)
        try:
            translation_json = json.loads(response)
            return translation_json["translation"]
        except Exception:
            return "Error: Invalid JSON response from the LLM."