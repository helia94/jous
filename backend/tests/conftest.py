# =========================================
# tests/conftest.py
# =========================================
import pytest
from sqlalchemy import event
from sqlalchemy.orm import scoped_session, sessionmaker
import sys
import os
from unittest.mock import patch, call

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.app import create_app 
from backend.api.models.base import db 
from backend.service_registry import registry
from backend.tests.test_llm import TestLMM
from backend.outbound.queue.tasks.translation_task import process_question_translation


# Apply mock globally
patcher = patch("backend.outbound.queue.tasks.translation_task.process_question_translation")
mock_run = patcher.start()

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
        "TESTING": True,
        # Celery settings for tests: tasks run immediately in the same process.
        "CELERY_BROKER_URL": "memory://",
        "CELERY_RESULT_BACKEND": "cache",
        "CELERY_CACHE_BACKEND": "memory",
        "CELERY_TASK_ALWAYS_EAGER": True
    }

    registry.register_llm(TestLMM())
    app, jwt = create_app(test_config=test_config)

    app.config.update(test_config)


    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture(autouse=True)
def reset_database(test_app):
    """
    Automatically reset the database before each test by rolling back any changes.
    This ensures each test runs with a clean state without the overhead of dropping and recreating tables.
    """
    with test_app.app_context():
        # Establish a new connection and begin a transaction
        connection = db.engine.connect()
        transaction = connection.begin()

        # Create a new scoped session bound to this connection
        session_factory = sessionmaker(bind=connection)
        Session = scoped_session(session_factory)
        db.session = Session

        # Start a nested transaction (savepoint)
        nested = connection.begin_nested()

        # Listen for the end of the nested transaction to start a new one if needed
        @event.listens_for(Session, "after_transaction_end")
        def restart_savepoint(session, trans):
            if trans.nested and not trans._parent.nested:
                connection.begin_nested()

        yield  # This is where the test runs

        # Rollback the transactions after the test completes
        transaction.rollback()
        connection.close()
        Session.remove()


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


def check_token_expire(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("/api/checkiftokenexpire", headers=headers)


def refresh_token(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("/api/refreshtoken", headers=headers)


def access_logout(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("/api/logout/access", headers=headers)


def refresh_logout(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("/api/logout/refresh", headers=headers)

def get_all_questions(client):
    rv = client.get("/api/questions", query_string={"offset": "0"})
    assert rv.status_code == 200, f"Retrieving questions failed: {rv.get_data(as_text=True)}"
    data = rv.get_json()
    assert isinstance(data, list), f"Expected questions data to be a list, got {type(data)}."
    return data
