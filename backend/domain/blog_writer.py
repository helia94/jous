import json
import random
from backend.outbound.llm.llm_interface import LLMInterface

KEYWORDS = [
    "Conversation starters", 
    "Deep questions to ask", 	
    "Relationship questions", 
    "Card games for couples", 	
    "Conversation cards", 
    "first date questions", 
    "great conversation starters", 
    "fun date night ideas", 
    "best friend questions", 
    "deep questions for friends", 
    "date night cards", 
]

PERSONAS = [
    "Esther Perel",
    "John Gottman",
    "Brené Brown",
    "Emily Nagoski",
    "Elizabeth Gilbert",
    "David Brooks",
    "Stephen Fry",
    "Tyler Cowen",
    "Russ Roberts",
    "Roger Ballen",
    "L.A. Paul",
    "Agnes Callard",
    "Michael Munger",
    "Matt Ridley",
    "David McRaney",
    "Nassim Nicholas Taleb",
    "Chris Arnade",
    "Jonathan Haidt",  # Psychology & moral philosophy
    "Daniel Kahneman",  # Behavioral economics
    "Steven Pinker",  # Cognitive psychology & linguistics
    "Malcolm Gladwell",  # Pop psychology & social science
    "Robert Sapolsky",  # Neuroscience & human behavior
    "Alain de Botton",  # Philosophy & personal growth
    "Jordan Peterson",  # Psychology & culture
    "Yuval Noah Harari",  # History & philosophy
    "Dan Ariely",  # Behavioral economics
    "Cal Newport",  # Productivity & focus
    "Michael Lewis",  # Economics & finance storytelling
    "Maria Konnikova",  # Psychology & poker strategy
    "Douglas Murray",  # Culture & politics
    "Richard Thaler",  # Behavioral economics
    "Edward Slingerland"  # Philosophy & science of effortlessness
]

class BlogWriter:
    def __init__(self, llm: LLMInterface):
        self.llm = llm

    def generate_article(
        self,
        title: str,
        storyline: str,
        url: str,
    ) -> dict:

        prompt = f"""
        You are a professional blog writer with a knack for creating engaging, SEO-optimized articles that resonate with readers on a personal level. Generate a 1000-word article with the following inputs:

Title: {title}
Storyline: {storyline}
URL: {url}
Keywords: {', '.join(KEYWORDS)}
Your writer persona: {random.choice(PERSONAS)}

Requirements:
- Persona is only to inspire you, do not mention their name in the article.
- Generate an international-sounding author name.
- Style the article beautifully as HTML (no CSS).
- Include meta tags for title, description, and keywords within the HTML content.
- Make sure the page would be indexable by search engines.
- Wrap the article in a <div> with class "articles-block".
- Each article should have class "blog-article" and a unique ID.
- Use <h1> with class "mag-title" for the main title.
- Use <p> with class "mag-paragraph" for paragraphs.
- Use <em> and <i> for italics, <strong> for bold.
- Use <h2> or <h3> with class "mag-subtitle" for subtitles.
- Use <ul> with class "mag-list" for unordered lists.
- Add a tips section with class "mag-tips".
- Ensure links are standard blue with underline and hover effect.
- Make it ready to post with no placeholders in the text.
- Maximum 3 links to the app in the main content (outside the final call to action).
- Include the following fixed call-to-action links in a creative way:
  1. Sign up: https://jous.app/register
  2. Start a conversation: https://jous.app/random?lang=original
  3. Learn about deep talk: https://jous.app/

Return a JSON object with the following keys:
- "Content": The full HTML content of the article, including meta tags, ready to post with no placeholders.

Additional Guidance:
To make the article more engaging and less generic, use one or more of the following techniques (but not all at once):
1. **Make it personal**: Share a relatable story or anecdote that connects with the reader emotionally.
2. **Avoid direct advice**: Instead of telling people what to do, encourage them to reflect on their own experiences.
3. **Invoke empathy**: Write in a way that makes readers feel sympathy or connection with the subject.
4. **Be specific**: Avoid abstract generalizations. Use concrete examples, details, or scenarios.
5. **Focus on a community**: Highlight a specific group or community, either positively or negatively, to create a unique perspective.
6. **Historical context**: Add a historical angle to give depth and context to the topic.
7. **Cross-cultural connections**: Write about how different countries or cultures approach the topic.
8. **Diverse perspectives**: Write from the point of view of someone with a unique personality or background (e.g., neurodivergent, introvert, extrovert, young, old, etc.).
9. **Target a niche audience**: Make the story specific to a particular type of person, not everyone.
10. **Be curious and authentic**: Write as if you’re exploring the topic yourself, not as an all-knowing expert.
11. **Use quotes**: Incorporate quotes from books, articles, or famous figures to add credibility and depth.
12. **Limit promotion**: Only 10% of the article should be promotional. Avoid making every line about the app.
13. **Add humor**: Use wit or light-hearted jokes to make the article more enjoyable.
14. **Self-deprecating humor**: Laugh at yourself or your own experiences to make the article more relatable.
15. **Add a twist**: Include an unexpected turn in the story to keep readers hooked.

Example Approach:
If the topic is "How to Build Meaningful Connections," you could:
- Write from the perspective of an introvert who struggled to make friends but found a unique way to connect.
- Share a personal story about a time when you felt deeply connected to someone from a different culture.
- Use humor to describe the awkwardness of small talk and how it contrasts with deep conversations.
- Add a historical twist by referencing how people formed connections in the past versus today.

Remember, the goal is to create an article that feels authentic, relatable, and thought-provoking, while still being SEO-friendly and aligned with the call-to-action links.
"""

        response = self.llm.get_response(prompt)
        try:
            article_json = json.loads(response)
            return article_json["Content"].replace("—", ", ")
        except Exception:
            return {"error": "Invalid JSON response from the LLM."}