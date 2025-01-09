import json

from backend.outbound.llm_interface import LLMInterface

class Translator:
    def __init__(self, llm: LLMInterface):
        self.llm = llm

    def translate(self, text: str, language: str, extra_comments: str = "") -> str:

        prompt = f"""You are a translator. 
        Translate the following text to {language}.
        Apply these style or tone guidelines: {extra_comments}.
        Return only a JSON object with one key "translation" containing the translated text.

        Original text:
        {text}
        """

        response = self.llm.get_response(prompt)
        try:
            translation_json = json.loads(response)
            return translation_json["translation"]
        except Exception:
            return "Error: Invalid JSON response from the LLM."