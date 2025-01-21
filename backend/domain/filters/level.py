from dataclasses import dataclass

@dataclass
class Level:
    id: int
    name: str
    names: dict

level_names = {
    "original": "Intensity", 
    "en": "Intensity", 
    "de": "Tiefe", 
    "fa": "چقدر سخت باشه؟", 
    "es": "Intensidad"
}

levels = [
    Level(
        id=0, 
        name='light', 
        names={
            "original": "Start Lightly", 
            "en": "Start Lightly", 
            "de": "Leicht anfangen", 
            "fa": "سبک و راحت", 
            "es": "Empieza suave"
        }
    ),
    Level(
        id=1, 
        name='moderate', 
        names={
            "original": "Think It Over",
            "en": "Think It Over", 
            "de": "Nachdenken", 
            "fa":  "بذار فکر کنم", 
            "es": "Reflexiona"
        }
    ),
    Level(
        id=2, 
        name='challenging', 
        names={
            "original": "Dig Deeper",
            "en": "Dig Deeper", 
            "de": "Tiefer gehen", 
            "fa": "عمیق و جدی", 
            "es": "Profundiza"
        }
    ),
]