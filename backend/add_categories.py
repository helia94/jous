from backend.api.repo.CategoriesRepo import CategoriesRepo


def add_categories_1():
    CategoriesRepo().add_categories(
        category_version="topic_0",
        categories=[
            "Interpersonal Relationships",
            "Career and Vocation",
            "Emotional Experiences and Memory",
            "Decision Making and Life Choices",
            "Friendships",
            "Family",
            "Moral Values and Ethics",
            "Creative Expression",
            "Future Aspirations and Regrets",
            "Coping and Resilience",
            "Identity, Self-Perception",
            "Happiness, Joy, and Satisfaction",
            "Aging, and Time",
            "Mental Health",
            "Sexuality, Attraction, and Relationships",
            "Existential Musings"
        ],
        exclusive=False
    )

    CategoriesRepo().add_categories(
        category_version="usecase_0",
        categories=[
            "Intimate Gatherings",
            "Dinner Parties",
            "Self-Reflection",
            "Team Building",
            "Social Icebreakers",
            "Getting to know strangers",
            "First Dates"
        ],
        exclusive=False
    )

    CategoriesRepo().add_categories(
        category_version="intensity_0",
        categories=[
            "Easy",
            "Not easy",
            "Hard"
        ],
        exclusive=True
    )
