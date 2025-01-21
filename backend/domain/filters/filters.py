from dataclasses import dataclass
from typing import Dict, List
import os

from backend.domain.filters.evaluator_interface import EvaluatorInterface
from backend.domain.filters.level import levels, level_names
from backend.domain.filters.occasion import occasions, occasion_names
from backend.domain.filters.level_evaluator import LevelEvaluator
from backend.domain.filters.occasion_evaluator import OccasionEvaluator
from backend.outbound.llm.gpt import GPT
from backend.tests.test_llm import TestLMM



env = os.environ.get("FLASK_ENV", "dev")
if env == "test":
    llm = TestLMM()
else:
    llm = GPT()

@dataclass
class Filter:
    id: int
    name: str
    names: Dict[str, str]
    options: dict
    mutually_exclusive: bool
    evaluator: EvaluatorInterface

filters = [
    Filter(
        id = 0,
        name = "level",
        names = level_names,
        options=levels,
        mutually_exclusive=True,
        evaluator=LevelEvaluator(llm)
    ),
    Filter(
        id = 1,
        name = "occasion",
        names = occasion_names,
        options=occasions,
        mutually_exclusive=False,
        evaluator=OccasionEvaluator(llm)    
    )
]




def get_filter_by_language(language: str) -> List[Dict[str, str]]:
    result = []
    for f in filters:
        filter_data = {
            "query_name": f.name,
            "display_name": f.names.get(language, f.names["original"]),
            "options": {},
            "mutually_exclusive": str(f.mutually_exclusive)
        }
        for idx, option in enumerate(f.options):
            option_name = option.names.get(language, option.name)
            filter_data["options"][idx] = option_name
        result.append(filter_data)
    return result


def get_filter_values(question):
    values = {}
    for f in filters:
        options_names = [option.name for option in f.options]
        if f.mutually_exclusive:
            values[f.name] = f.evaluator.evaluate_single_option(question, options_names)
        else:
            values[f.name] = f.evaluator.evaluate_many_option(question, options_names)
    print(values)
    return values



if __name__ == "__main__":
    print(get_filter_by_language("en"))