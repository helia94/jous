# =========================================
# tests/conftest.py
# =========================================
import pytest
from unittest.mock import patch, MagicMock
from flask import Flask
from flask_jwt_extended import JWTManager
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app 
from api.models.base import db 

@pytest.fixture(scope="session")
def test_app():
    """
    Creates and configures a Flask app for testing.
    """
    test_config = {
        "SECRET_KEY": "testkey",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "SQLALCHEMY_DATABASE_URI": "postgresql://testusr:password@localhost/testdb",
        "JWT_SECRET_KEY": "test_jwt_secret_key",
        "TESTING": True
    }

    app, jwt = create_app(test_config=test_config)

    with app.app_context():
        db.create_all()
        yield app




@pytest.fixture
def client(test_app):
    """
    Create a test client using the Flask application.
    """
    return test_app.test_client()


def register_user(client, username, email, password):
    return client.post("/api/register", json={
        "username": username,
        "email": email,
        "pwd": password
    })


def login_user(client, email_or_username, password):
    return client.post("/api/login", json={
        "email": email_or_username,
        "pwd": password
    })


def add_question(client, token, content, anon=False):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return client.post("/api/addquestion", json={
        "content": content,
        "anon": str(anon)
    }, headers=headers)


def get_question_by_id(client, question_id):
    return client.get(f"/api/question/{question_id}")


def get_random_question(client):
    return client.get("/api/question/random")


def delete_question(client, token, question_id):
    headers = {"Authorization": f"Bearer {token}"}
    return client.delete(f"/api/deletequestion/{question_id}", headers=headers)


def like_question(client, question_id):
    return client.post(f"/api/likequestion/{question_id}")


def add_answer(client, token, content, question_id, anon=False):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return client.post("/api/addanswer", json={
        "content": content,
        "question": question_id,
        "anon": str(anon)
    }, headers=headers)


def delete_answer(client, token, answer_id):
    headers = {"Authorization": f"Bearer {token}"}
    return client.delete(f"/api/deleteanswer/{answer_id}", headers=headers)


def get_current_user(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.get("/api/getcurrentuser", headers=headers)


def get_user_questions(client, username, offset=0):
    # Not protected
    return client.post(f"/api/userquestions/{offset}", json={"username": username})


def get_user_answers(client, username):
    return client.post("/api/useranswers", json={"username": username})


def get_activity(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.get("/api/useractivities", headers=headers)


def read_activity(client, token, last_activity_id):
    headers = {"Authorization": f"Bearer {token}"}
    return client.get(f"/api/readuseractivity/{last_activity_id}", headers=headers)


def change_password(client, token, old_password, new_password):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("/api/changepassword", json={
        "password": old_password,
        "npassword": new_password
    }, headers=headers)


def delete_account(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.delete("/deleteaccount", headers=headers)


def check_token_expire(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("/checkiftokenexpire", headers=headers)


def refresh_token(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("/refreshtoken", headers=headers)


def access_logout(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("/logout/access", headers=headers)


def refresh_logout(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("/logout/refresh", headers=headers)
