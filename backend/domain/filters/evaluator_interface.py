from abc import ABC, abstractmethod
from typing import Dict, List


class EvaluatorInterface(ABC):

    @abstractmethod
    def evaluate_single_option(self, question: str, options: List[str]) -> int:
        pass

    @abstractmethod
    def evaluate_many_option(self, question: str, options: List[str]) -> List[int]:
        pass