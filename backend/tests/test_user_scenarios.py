# =========================================
# tests/test_user_scenarios.py
# =========================================
import pytest
import json
from conftest import *

class TestUserEndpoints:
    def test_get_user_questions(self, client):
        # register + login
        rv = register_user(client, "uinfo", "uinfo@email.com", "pass")
        rv = login_user(client, "uinfo", "pass")
        token = rv.get_json()["token"]

        # add question
        rv = add_question(client, token, "Just checking user questions", anon=False)
        # fetch user questions
        rv = get_user_questions(client, "uinfo", 0)
        assert rv.status_code == 200
        data = rv.get_json()
        assert len(data) > 0
        assert data[0]["content"] == "Just checking user questions"

    def test_get_user_answers(self, client):
        # register + login
        rv = register_user(client, "uinfo2", "uinfo2@email.com", "pass")
        rv = login_user(client, "uinfo2", "pass")
        token = rv.get_json()["token"]

        # add question
        rv = add_question(client, token, "Q for user answers", anon=False)
        # fetch question ID
        rv = client.get("/api/questions/0")
        question_id = rv.get_json()[-1]["id"]
        # add answer
        rv = add_answer(client, token, "User answer content", question_id, anon=False)
        # fetch user answers
        rv = get_user_answers(client, "uinfo2")
        assert rv.status_code == 200
        data = rv.get_json()
        assert len(data) > 0
        assert data[0]["content"] == "User answer content"

    def test_get_current_user(self, client):
        rv = register_user(client, "curru", "curru@email.com", "pass")
        rv = login_user(client, "curru", "pass")
        token = rv.get_json()["token"]
        rv = get_current_user(client, token)
        assert rv.status_code == 200
        data = rv.get_json()
        assert data["username"] == "curru"