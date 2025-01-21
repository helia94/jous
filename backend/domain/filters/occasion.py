from dataclasses import dataclass
from typing import Dict

@dataclass
class Occasion:
    id: int
    name: str
    names: Dict[str, str]

occasion_names = {
    "original": "What's the occasion?",
    "en": "What's the occasion?",
    "de": "Anlass",
    "fa": "برای چه موقعیتی؟",
    "es": "Ocasión"
}

occasions = [
    Occasion(
        id=0,
        name='friends',
        names={
            "original": "Friends",
            "en": "Friends",
            "de": "Freunde",
            "fa": "جمع دوستانه",
            "es": "Amigos",
            "nl": "Vrienden"
        }
    ),
    Occasion(
        id=1,
        name='casual',
        names={
            "original": "Casual Socializing",
            "en": "Casual Socializing",
            "de": "Lockerer Umgang",
            "fa": "دورهمی",
            "es": "Socialización casual",
            "nl": "Informeel samenzijn"
        }
    ),
    Occasion(
        id=2,
        name='first_date',
        names={
            "original": "First Dates",
            "en": "First Dates",
            "de": "Erstes Date",
            "fa": "قرار اول",
            "es": "Primera cita",
            "nl": "Eerste dates"
        }
    ),
    Occasion(
        id=3,
        name='couples',
        names={
            "original": "Couples",
            "en": "Couples",
            "de": "Paare",
            "fa": "دو نفره",
            "es": "Parejas",
            "nl": "Stellen"
        }
    ),
    Occasion(
        id=4,
        name='roommates',
        names={
            "original": "Roommates",
            "en": "Roommates",
            "de": "Mitbewohner",
            "fa": "هم‌خونه‌ای‌ها",
            "es": "compañeros de piso",
            "nl": "kamergenoten"
        }
    ),
    Occasion(
        id=5,
        name='meeting_new_people',
        names={
            "original": "Meeting New People",
            "en": "Meeting New People",
            "de": "Neue Leute treffen",
            "fa": "آدمای جدید",
            "es": "Conociendo Gente Nueva",
            "nl": "Nieuwe Mensen Ontmoeten"
        }
    ),
    Occasion(
        id=6,
        name='parents',
        names={
            "original": "With Parents",
            "en": "With Parents",
            "de": "Mit Eltern",
            "fa": "با مامان و بابا",
            "es": "Con los padres",
            "nl": "Met ouders"
        }
    ),
    Occasion(
        id=7,
        name="kids",
        names={
            "original": "With the Kids",
            "en": "With the Kids",
            "de": "Mit den Kindern",
            "fa": "با بچه‌ها",
            "es": "Con los Niños",
            "nl": "Met de Kinderen"
        }
    ),
    Occasion(
        id=8,
        name='reunions',
        names={
            "original": "Reunions",
            "en": "Reunions",
            "de": "Wiedersehen",
            "fa": "بعد از مدت‌ها",
            "es": "Reuniones",
            "nl": "Reünies"
        }
    ),
    Occasion(
        id=9,
        name="traveling",
        names={
            "original": "On the Road",
            "en": "On the Road",
            "de": "Unterwegs",
            "fa": "در سفر",
            "es": "En el Camino",
            "nl": "Onderweg"
        }
    ),
    Occasion(
        id=10,
        name='colleagues',
        names={
            "original": "Colleagues",
            "en": "Colleagues",
            "de": "Kollegen",
            "fa": "سر کار",
            "es": "Colegas",
            "nl": "Collega's"
        }
    ),
    Occasion(
        id=11,
        name='team_building',
        names={
            "original": "Team Building",
            "en": "Team Building",
            "de": "Teambildung",
            "fa": "تیم سازی",
            "es": "Trabajo en equipo",
            "nl": "Teambuilding"
        }
    ),
    Occasion(
        id=12,
        name='cultural_exchange',
        names={
            "original": "Cultural Exchange",
            "en": "Cultural Exchange",
            "de": "Kulturaustausch",
            "fa": "آشنایی با فرهنگ‌ها",
            "es": "Intercambio cultural",
            "nl": "Culturele uitwisseling"
        }
    ),
    Occasion(
        id=13,
        name='philosophical',
        names={
            "original": "Philosophical",
            "en": "Philosophical",
            "de": "Philosophisches",
            "fa": "گپ فلسفی",
            "es": "Conversación filosófica",
            "nl": "Filosofisch gesprek"
        }
    ),
]
