class FindOccasions:
    def __init__(self, llm_interface):
        """
        llm_interface: an instance of whatever LLM client you're using,
        similar to how you used it in the translator class.
        """
        self.llm_interface = llm_interface

    def find_occasions(self, question: str, occasions: list[Occasions]) -> list[Occasions]:
        """
        Example approach:
          1. Call your LLM with the 'question' to get some classification data.
          2. Map the results to the appropriate Occasions.
          3. Return the matching Occasions as a list.

        Below is placeholder logic; swap it with your real LLM calls.
        """
        # For now, pretend the LLM always returns first date & road trip
        return [Occasions.FIRST_DATE, Occasions.ROAD_TRIP]