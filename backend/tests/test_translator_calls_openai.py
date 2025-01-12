from backend.domain.supported_languages import supported_languages
from backend.domain.translator import Translator
from backend.outbound.llm.gpt import GPT
translator = Translator(GPT())

questions = [
    "When was the last time you noticed someone has given up on you, in some context?",
    "What, off the top of your head, do you take pleasure in hating?", 
    "has your attachment behavior been the same concerning all of your previous partners?",
    "Who do your parents let, to tell them what to do?",
    "If you could access any data to satisfy your curiosity, what would it be?",
    "What money you spend out of guilt? ",
   "Do you remember having acted possessive which you realised in hindsight?",
   "In which environments does the fear of taking up too much space hinder your expression and satisfaction?",
   "For which attribution do you have to use signaling the most?",
   "In which context(s) can you keep a better discipline, e.g. diet, exercise, work-related, family-related?",
]

for lang in supported_languages:
    for question in questions:
        translated_text = translator.translate(
            text=question,
            language=lang.name,
            extra_comments=lang.comment
        )
        #print(f"Language: {lang.name}, Question: {question}")
        print(f"{translated_text}\n")