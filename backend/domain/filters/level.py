from dataclasses import dataclass

@dataclass
class Level:
    id: int
    name: str
    translations: dict

level_names = {
    "original": "Intensity", 
    "en": "Intensity", 
    "de": "Tiefe", 
    "fa": "سختی", 
    "es": "Intensidad"
}

levels = [
    Level(
        id=0, 
        name='Start Light', 
        translations={
            "en": "Start Light", 
            "de": "Leicht anfangen", 
            "fa": "دست گرمی", 
            "es": "Empieza suave"
        }
    ),
    Level(
        id=1, 
        name='Think It Over', 
        translations={
            "en": "Think It Over", 
            "de": "Nachdenken", 
            "fa": "فکر کردن", 
            "es": "Reflexiona"
        }
    ),
    Level(
        id=2, 
        name='Dig Deeper', 
        translations={
            "en": "Dig Deeper", 
            "de": "Tiefer gehen", 
            "fa": "کشف کردن", 
            "es": "Profundiza"
        }
    ),
]