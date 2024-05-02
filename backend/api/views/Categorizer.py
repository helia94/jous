import logging
import openai
import random
from backend.api.repo.CategoriesRepo import CategoriesRepo
import re
from openai import OpenAI

LATEST_CATEGORY_VERSIONS = ["topic_0", "usecase_0", "intensity_0"]

class Categorizer:
    def __init__(self):
        self.client = OpenAI()
        self.logger = logging.getLogger(__name__)
        self.categories_repo = CategoriesRepo()

    def get_tags(self, question, category_versions = LATEST_CATEGORY_VERSIONS):
        self.logger.info("get_tags method called")
        tags = []
        for category_version in category_versions:
            tags += self.get_tag(question, category_version)
        return tags

    def get_tag(self, question, categrory_version):
        self.logger.info("get_tag method called")
        categories = self.query_categories(categrory_version)
        if categories.exclusive:
            prompt = self.create_prompt_ony_category_allowed(question, categories.categories)
        else:
            prompt = self.create_prompt_for_multiple_categories_allowed(question, categories.categories)
        response = self.generate_response(prompt)
        tags = self.parse_response(response, categories.exclusive)
        return [f"{categrory_version}_{tag}" for tag in tags]

    def query_categories(self, category_version):
        self.logger.info("query_categories method called")
        categories = self.categories_repo.get_categories_by_version(category_version)
        return categories

    def create_prompt_ony_category_allowed(self, text, categories):
        self.logger.info("create_prompt_ony_category_allowed method called")
        categories_string = ', '.join( [f"{index}- {cat}" for index, cat in enumerate(categories)])
        prompt = f"From the following categories: [{categories_string}] which one does the following text belong to? \n{text}. only enter the number of the category"
        return prompt
    
    def create_prompt_for_multiple_categories_allowed(self, text, categories):
        self.logger.info("create_prompt_for_multiple_categories_allowed method called")
        categories_string =', '.join( f"{index}- {cat}" for index, cat in enumerate(categories))
        prompt = f"From the following categories: [{categories_string}] which ones does the following text belong to? \n{text}. only respond with a comma separated number of the categorries that apply"
        return prompt

    def generate_response(self, prompt):
        self.logger.info("generate_response method called")
        completion = self.client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[
            {"role": "system", "content": prompt},
        ],
        seed=0,
        #temperature = 0.2,

        )
        self.logger.info("got response from openai")
        return completion.choices[0].message.content

    def parse_response(self, response, exclusive_categories = False):
        self.logger.info("parse_response method called")
        if exclusive_categories:
            try:
                return [int(response)]
            except:
                # try to parse a number from the response using regex
                match = re.search(r'\d+', response)
                if match:
                    return [int(match.group())]
                else:
                    # Handle the case when no number is found
                    return []
        try:
            return [int(tag) for tag in response.split(',')]
        except:
            matches = re.findall(r'\d+', response)
            if matches:
                return [int(match) for match in matches]
            else:
                # Handle the case when no number is found
                return []
