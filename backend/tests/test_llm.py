from backend.outbound.llm.llm_interface import LLMInterface
import json
import time

class TestLMM(LLMInterface):


    fixed_translation = "dabi doobi doo"

    def get_response(self, prompt: str) -> str:
        if "Translate" in prompt:
            return json.dumps({"translation": TestLMM.fixed_translation})
        else:
            raise NotImplementedError("Expand TestLMM")