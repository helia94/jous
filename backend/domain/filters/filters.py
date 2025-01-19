from dataclasses import dataclass
from typing import Dict, List

from backend.domain.filters.evaluator_interface import EvaluatorInterface
from backend.domain.filters.level import levels, level_names
from backend.domain.filters.occasion import occasions, occasion_names
from backend.domain.filters.level_evaluator import LevelEvaluator
from backend.domain.filters.occasion_evaluator import OccasionEvaluator

@dataclass
class Filter:
    id: int
    names: Dict[str, str]
    options: dict
    mutually_exclusive: bool
    evaluator: EvaluatorInterface

filters = [
    Filter(
        id = 0,
        name = "Intensity",
        names = level_names,
        options=levels,
        mutually_exclusive=True,
        evaluator=LevelEvaluator
    ),
    Filter(
        id = 1,
        name = "Occasion",
        names = occasion_names,
        options=occasions,
        mutually_exclusive=False,
        evaluator=OccasionEvaluator       
    )
]




def get_filter_by_language(language: str) -> List[Dict[str, str]]:
    result = []
    for f in filters:
        filter_data = {
            "name": f.names.get(language, f.names["original"]),
            "options": [],
            "mutually_exclusive": str(f.mutually_exclusive)
        }
        for option in f.options:
            option_name = option.translations.get(language, option.name)
            filter_data["options"].append(option_name)
        result.append(filter_data)
    return result


def get_filter_values(question):
    values = {}
    for f in filters:
        if f.mutually_exclusive:
            values[f.name] = f.evaluator.evaluate_single_option(question)
        else:
            values[f.name] = f.evaluator.evaluate_many_option(question)
        return values



if __name__ == "__main__":
    print(get_filter_by_language("en"))