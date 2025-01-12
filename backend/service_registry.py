class ServiceRegistry:
    def __init__(self):
        self.llm = None

    def register_llm(self, llm_instance):
        self.llm = llm_instance

    def get_llm(self):
        return self.llm

# Initialize a global registry instance
registry = ServiceRegistry()
