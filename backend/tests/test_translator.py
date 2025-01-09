from backend.domain.supported_languages import supported_languages
from backend.domain.translator import Translator
from backend.outbound.gpt import GPT
translator = Translator(GPT())

questions = [
    "When was the last time you noticed someone has given up on you, in some context?",
    "What, off the top of your head, do you take pleasure in hating?", 
    "What is the best (not necessarily positive) feedback you've recently received?",
    "Whose approval do you regret seeking?",
    "If you could access any data to satisfy your curiosity, what would it be?",
    "What is something you used to be ashamed of but aren't anymore?",
    "What challenges do you often seek out?",
   "Who in your life has (in your view) the perfect combination of being nice and being honest?",
   "In which environments does the fear of taking up too much space hinder your expression and satisfaction?"
]

for lang in supported_languages:
    for question in questions:
        translated_text = translator.translate(
            text=question,
            language=lang.name,
            extra_comments=lang.comment
        )
        print(f"Language: {lang.name}, Question: {question}")
        print(f"Translation: {translated_text}\n")