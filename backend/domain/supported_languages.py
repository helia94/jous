from dataclasses import dataclass

@dataclass
class SupportedLanguage:
    id: int
    name: str
    iso2: str
    comment: str

# Instantiate supported languages
supported_languages = [
    SupportedLanguage(id=1, name='english', iso2='en', comment='Rewrite the following text to be error-free, more readable, and really simple for non-native English speakers. Keep it authentic.'),
    SupportedLanguage(id=2, name='german', iso2='de', comment='Use Du where applicable. Keep friendly.'),
#    SupportedLanguage(id=3, name='spanish', iso2='es', comment=''),
    SupportedLanguage(id=4, name='persian', iso2='fa', comment='Keep friendly and rather informal. you are allowed to deviate from the original to make it more readable or engaging.'),
]