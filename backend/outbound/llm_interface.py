from abc import ABC, abstractmethod


class LLMInterface(ABC):
    @abstractmethod
    def get_response(self, prompt: str) -> str:
        pass