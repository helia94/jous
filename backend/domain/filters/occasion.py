from dataclasses import dataclass
from typing import Dict

@dataclass
class Occasion:
    id: int
    name: str
    translations: Dict[str, str]

occasion_names = {
    "original": "Occasion", 
    "en": "Occasion", 
    "de": "Anlass", 
    "fa": "مناسبت", 
    "es": "Ocasión"
}

occasions = [
    Occasion(
        id=0,
        name='Friends',
        translations={
            "en": "Friends",
            "de": "Freunde",
            "fa": "دوستان",
            "es": "Amigos",
            "nl": "Vrienden"
        }
    ),
    Occasion(
        id=1,
        name='Team Building',
        translations={
            "en": "Team Building",
            "de": "Teambildung",
            "fa": "تقویت تیم",
            "es": "Trabajo en equipo",
            "nl": "Teambuilding"
        }
    ),
    Occasion(
        id=2,
        name='Casual Socializing',
        translations={
            "en": "Casual Socializing",
            "de": "Lockerer Umgang",
            "fa": "معاشرت غیررسمی",
            "es": "Socialización casual",
            "nl": "Informeel samenzijn"
        }
    ),
    Occasion(
        id=3,
        name='Strangers',
        translations={
            "en": "Strangers",
            "de": "Fremde",
            "fa": "غریبه‌ها",
            "es": "Desconocidos",
            "nl": "Vreemden"
        }
    ),
    Occasion(
        id=4,
        name='First Dates',
        translations={
            "en": "First Dates",
            "de": "Erstes Date",
            "fa": "اولین قرار",
            "es": "Primera cita",
            "nl": "Eerste dates"
        }
    ),
    Occasion(
        id=5,
        name='Couples',
        translations={
            "en": "Couples",
            "de": "Paare",
            "fa": "زوج‌ها",
            "es": "Parejas",
            "nl": "Stellen"
        }
    ),
    Occasion(
        id=6,
        name='With Parents',
        translations={
            "en": "With Parents",
            "de": "Mit Eltern",
            "fa": "با والدین",
            "es": "Con los padres",
            "nl": "Met ouders"
        }
    ),
    Occasion(
        id=7,
        name='Kids',
        translations={
            "en": "Kids",
            "de": "Kinder",
            "fa": "بچه‌ها",
            "es": "Niños",
            "nl": "Kinderen"
        }
    ),
    Occasion(
        id=8,
        name='Colleagues',
        translations={
            "en": "Colleagues",
            "de": "Kollegen",
            "fa": "همکاران",
            "es": "Colegas",
            "nl": "Collega's"
        }
    ),
    Occasion(
        id=9,
        name='Reunions',
        translations={
            "en": "Reunions",
            "de": "Wiedersehen",
            "fa": "دیدارهای مجدد",
            "es": "Reuniones",
            "nl": "Reünies"
        }
    ),
    Occasion(
        id=10,
        name='Traveling',
        translations={
            "en": "Traveling",
            "de": "Reisen",
            "fa": "مسافرت",
            "es": "Viajando",
            "nl": "Reizen"
        }
    ),
    Occasion(
        id=11,
        name='Cultural Exchange',
        translations={
            "en": "Cultural Exchange",
            "de": "Kulturaustausch",
            "fa": "تبادل فرهنگی",
            "es": "Intercambio cultural",
            "nl": "Culturele uitwisseling"
        }
    ),
    Occasion(
        id=12,
        name='Roommates',
        translations={
            "en": "Roommates",
            "de": "Mitbewohner",
            "fa": "همخانه‌ها",
            "es": "compañeros de piso",
            "nl": "kamergenoten"
        }
    ),
    Occasion(
        id=13,
        name='Philosophical',
        translations={
            "en": "Philosophical",
            "de": "Philosophisches",
            "fa": "گفتگوی فلسفی",
            "es": "Conversación filosófica",
            "nl": "Filosofisch gesprek"
        }
    ),
]
