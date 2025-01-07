# =========================================
# tests/test_question_scenarios.py
# =========================================
import pytest
import json
from conftest import *

class TestQuestionScenarios:
    def test_add_and_get_question(self, client):
        # register + login
        rv = register_user(client, "quser", "quser@email.com", "qpass")
        rv = login_user(client, "quser", "qpass")
        token = rv.get_json()["token"]

        # add question
        rv = add_question(client, token, "What is life?", anon=False)
        assert rv.status_code == 200, f"add_question failed: {rv.get_data(as_text=True)}"
        assert rv.get_json().get("success") is True

        # get offset=0 (just to check something)
        rv = client.get("/api/questions/0")
        assert rv.status_code == 200, f"get_questions failed: {rv.get_data(as_text=True)}"
        data = rv.get_json()
        assert len(data) > 0

        # let's get the first question's ID for further check
        # The data is reversed, so first item is the last inserted
        question_id = data[-1]["id"]
        # get question by ID
        rv = get_question_by_id(client, question_id)
        assert rv.status_code == 200
        assert "question" in rv.get_json()
        assert rv.get_json()["question"]["content"] == "What is life?"

    def test_delete_question(self, client):
        # register + login
        rv = register_user(client, "dquser", "dquser@email.com", "dqpass")
        rv = login_user(client, "dquser", "dqpass")
        token = rv.get_json()["token"]

        # add question
        rv = add_question(client, token, "Temp question", anon=False)
        assert rv.status_code == 200
        # fetch question ID
        rv2 = client.get("/api/questions/0")
        question_id = rv2.get_json()[-1]["id"]

        # delete
        rv = delete_question(client, token, question_id)
        assert rv.status_code == 200
        assert rv.get_json()["success"] is True

        # confirm it's gone
        rv = get_question_by_id(client, question_id)
        assert rv.status_code == 404
        assert "error" in rv.get_json()

    def test_like_question(self, client):
        # create question
        rv = register_user(client, "likeq", "likeq@email.com", "likepass")
        rv = login_user(client, "likeq", "likepass")
        token = rv.get_json()["token"]
        rv = add_question(client, token, "To be liked", anon=False)
        # get question ID
        rv = client.get("/api/questions/0")
        question_id = rv.get_json()[-1]["id"]
        # like
        rv = like_question(client, question_id)
        assert rv.status_code == 200
        assert rv.get_json()["success"] == 'true'

    def test_random_question(self, client):
        rv = get_random_question(client)
        # Might 404 if no questions exist
        if rv.status_code == 200:
            assert "question" in rv.get_json()
        else:
            assert "error" in rv.get_json()


class TestAnswerScenarios:
    def test_add_and_get_answer(self, client):
        # register + login
        rv = register_user(client, "auser", "auser@email.com", "apass")
        rv = login_user(client, "auser", "apass")
        token = rv.get_json()["token"]

        # add a question
        rv = add_question(client, token, "Answer me this, please?", anon=False)
        # fetch question ID
        rv = client.get("/api/questions/0")
        question_id = rv.get_json()[-1]["id"]

        # add answer
        rv = add_answer(client, token, "My nice answer", question_id, anon=False)
        assert rv.status_code == 200
        data = rv.get_json()
        assert data["success"] is True
        answer_id = data["answer_id"]

        # get question by ID and see if the answer is present
        rv = get_question_by_id(client, question_id)
        assert rv.status_code == 200
        answers = rv.get_json()["answers"]
        # verify the ID is found
        assert any(a["id"] == answer_id for a in answers)
