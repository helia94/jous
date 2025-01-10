from dataclasses import dataclass

@dataclass
class SupportedLanguage:
    id: int
    name: str
    iso2: str
    comment: str

# Instantiate supported languages
supported_languages = [
    SupportedLanguage(id=1, name='english', iso2='en', 
                      comment="""
                        Rewrite the following text to make it error-free, 
                        highly readable, and simple for non-native English speakers. 
                        Ensure the language is clear, concise, and free of complex phrases or idioms that might be hard to understand. 
                        Focus on improving grammar, spelling, and sentence structure while maintaining an authentic and conversational tone.
                        """),
    SupportedLanguage(id=2, name='german', iso2='de', comment='Use Du where applicable.'),
    SupportedLanguage(id=3, name='spanish', iso2='es', comment=''),
    SupportedLanguage(id=4, name='persian', iso2='fa', comment=''),
]

def is_supported_language(languege_id):
    return languege_id  in [l.iso2 for l in supported_languages]