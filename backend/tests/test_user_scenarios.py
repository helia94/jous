# =========================================
# tests/test_user_scenarios.py
# =========================================
import pytest
import json
from conftest import *


class TestUserEndpoints:
    def test_get_user_questions(self, client):
        # Register and login
        rv = register_user(client, "uinfo", "uinfo@email.com", "pass")
        assert rv.status_code == 200, f"Registration failed: Expected status code 200, got {rv.status_code}."
        rv = login_user(client, "uinfo", "pass")
        assert rv.status_code == 200, f"Login failed: Expected status code 200, got {rv.status_code}."
        token = rv.get_json().get("token")
        assert token, "Login failed: 'token' not found in response."

        # Add question
        rv = add_question(client, token, "Just checking user questions", anon=False)
        assert rv.status_code == 200, f"Adding question failed: Expected status code 200, got {rv.status_code}."
        assert rv.get_json().get("success") is True, "Adding question failed: 'success' flag is not True."

        # Fetch user questions
        rv = get_user_questions(client, "uinfo", 0)
        assert rv.status_code == 200, f"Fetching user questions failed: Expected status code 200, got {rv.status_code}."
        data = rv.get_json()
        assert isinstance(data, list), f"Expected data type 'list' for user questions, got {type(data)}."
        assert len(data) > 0, "Fetching user questions failed: No questions found for user 'uinfo'."
        assert data[0]["content"] == "Just checking user questions", (
            f"Question content mismatch: Expected 'Just checking user questions', got '{data[0]['content']}'."
        )

    def test_get_user_answers(self, client):
        # Register and login
        rv = register_user(client, "uinfo2", "uinfo2@email.com", "pass")
        assert rv.status_code == 200, f"Registration failed: Expected status code 200, got {rv.status_code}."
        rv = login_user(client, "uinfo2", "pass")
        assert rv.status_code == 200, f"Login failed: Expected status code 200, got {rv.status_code}."
        token = rv.get_json().get("token")
        assert token, "Login failed: 'token' not found in response."

        # Add question
        rv = add_question(client, token, "Q for user answers", anon=False)
        assert rv.status_code == 200, f"Adding question failed: Expected status code 200, got {rv.status_code}."
        assert rv.get_json().get("success") is True, "Adding question failed: 'success' flag is not True."

        # Fetch question ID
        questions = get_all_questions(client)
        assert len(questions) > 0, "No questions found after adding a question."
        question_id = questions[-1].get("id")
        assert isinstance(question_id, int), f"Expected 'id' to be int, got {type(question_id)}."

        # Add answer
        rv = add_answer(client, token, "User answer content", question_id, anon=False)
        assert rv.status_code == 200, f"Adding answer failed: Expected status code 200, got {rv.status_code}."
        assert rv.get_json().get("success") is True, "Adding answer failed: 'success' flag is not True."

        # Fetch user answers
        rv = get_user_answers(client, "uinfo2")
        assert rv.status_code == 200, f"Fetching user answers failed: Expected status code 200, got {rv.status_code}."
        data = rv.get_json()
        assert isinstance(data, list), f"Expected data type 'list' for user answers, got {type(data)}."
        assert len(data) > 0, "Fetching user answers failed: No answers found for user 'uinfo2'."
        assert data[0]["content"] == "User answer content", (
            f"Answer content mismatch: Expected 'User answer content', got '{data[0]['content']}'."
        )

    def test_get_current_user(self, client):
        # Register and login
        rv = register_user(client, "curru", "curru@email.com", "pass")
        assert rv.status_code == 200, f"Registration failed: Expected status code 200, got {rv.status_code}."
        rv = login_user(client, "curru", "pass")
        assert rv.status_code == 200, f"Login failed: Expected status code 200, got {rv.status_code}."
        token = rv.get_json().get("token")
        assert token, "Login failed: 'token' not found in response."

        # Get current user
        rv = get_current_user(client, token)
        assert rv.status_code == 200, f"Fetching current user failed: Expected status code 200, got {rv.status_code}."
        data = rv.get_json()
        assert "username" in data, "Fetching current user failed: 'username' key not found in response."
        assert data["username"] == "curru", (
            f"Username mismatch: Expected 'curru', got '{data['username']}'."
        )
