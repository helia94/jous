# =========================================
# tests/test_question_scenarios.py
# =========================================
from conftest import *

class TestQuestionScenarios:
    def test_add_and_get_question(self, client):
        # Register and login
        rv = register_user(client, "quser", "quser@email.com", "qpass")
        assert rv.status_code == 200, f"Registration failed: Expected status code 200, got {rv.status_code}."
        rv = login_user(client, "quser", "qpass")
        assert rv.status_code == 200, f"Login failed: Expected status code 200, got {rv.status_code}."
        token = rv.get_json().get("token")
        assert token, "Login failed: 'token' not found in response."

        # Add question
        rv = add_question(client, token, "What is life?", anon=False)
        assert rv.status_code == 200, f"Adding question failed: {rv.get_data(as_text=True)}"
        assert rv.get_json().get("success") is True, "Adding question failed: 'success' flag is not True."

        # Get questions with offset=0
        data = get_all_questions(client)
        assert len(data) > 0, "No questions found after adding a question."

        # Get the first question's ID for further checks
        question_id = data[-1].get("id")
        assert isinstance(question_id, int), f"Expected question_id to be int, got {type(question_id)}."

        # Get question by ID
        rv = get_question_by_id(client, question_id)
        assert rv.status_code == 200, f"Retrieving question by ID failed: {rv.get_data(as_text=True)}"
        question_data = rv.get_json()
        assert "question" in question_data, "Question data does not contain 'question' key."
        assert question_data["question"]["content"] == "What is life?", (
            f"Question content mismatch: Expected 'What is life?', got '{question_data['question']['content']}'."
        )

    def test_add_three_questions_and_get_all(self, client):
        """
        Test adding three questions and verifying that all three are retrieved.
        """
        # Register and login
        rv = register_user(client, "threeq_user", "threeq_user@email.com", "threepass")
        assert rv.status_code == 200, f"Registration failed: Expected status code 200, got {rv.status_code}."
        rv = login_user(client, "threeq_user", "threepass")
        assert rv.status_code == 200, f"Login failed: Expected status code 200, got {rv.status_code}."
        token = rv.get_json().get("token")
        assert token, "Login failed: 'token' not found in response."

        # Add three questions
        questions = ["First question?", "Second question?", "Third question?"]
        for idx, question in enumerate(questions, start=1):
            rv = add_question(client, token, question, anon=False)
            assert rv.status_code == 200, f"Adding question {idx} failed: {rv.get_data(as_text=True)}"
            assert rv.get_json().get("success") is True, f"Adding question {idx} failed: 'success' flag is not True."

        # Retrieve all three questions
        data = get_all_questions(client)
        assert len(data) >= 3, f"Expected at least 3 questions, found {len(data)}."

        # Verify that all three questions are present
        added_question_contents = set(questions)
        retrieved_question_contents = set(q["content"] for q in data[-3:])  # Assuming last three are the added ones
        assert added_question_contents.issubset(retrieved_question_contents), (
            "Not all added questions are present in the retrieved questions."
        )

    def test_add_question_without_login_username_hannah(self, client):
        """
        Test adding a question without logging in and verify that the username defaults to 'Hannah'.
        """
        # Add question without logging in
        rv = add_question(client, token=None, content="Anonymous question?", anon=True)
        assert rv.status_code == 200, f"Adding question without login failed: {rv.get_data(as_text=True)}"
        assert rv.get_json().get("success") is True, "Adding question without login failed: 'success' flag is not True."

        # Retrieve the latest question
        data = get_all_questions(client)
        assert len(data) > 0, "No questions found after adding an anonymous question."

        # Get the latest question's author
        latest_question = data[-1]
        author = latest_question.get("username")
        assert author == "Hannah", (
            f"Expected author to be 'Hannah' for anonymous question, got '{author}'."
        )

    def test_delete_question_not_author_fail(self, client):
        """
        Test attempting to delete a question as a user who is not the author and expect failure.
        """
        # Register and login as author
        rv = register_user(client, "author_user", "author_user@email.com", "authorpass")
        assert rv.status_code == 200, f"Author registration failed: Expected status code 200, got {rv.status_code}."
        rv = login_user(client, "author_user", "authorpass")
        assert rv.status_code == 200, f"Author login failed: Expected status code 200, got {rv.status_code}."
        author_token = rv.get_json().get("token")
        assert author_token, "Author login failed: 'token' not found in response."

        # Add a question as author
        rv = add_question(client, author_token, "Author's question?", anon=False)
        assert rv.status_code == 200, f"Author adding question failed: {rv.get_data(as_text=True)}"
        assert rv.get_json().get("success") is True, "Author adding question failed: 'success' flag is not True."

        # Fetch question ID
        data = get_all_questions(client)
        question_id = data[-1].get("id")
        assert isinstance(question_id, int), f"Expected question_id to be int, got {type(question_id)}."

        # Register and login as another user
        rv = register_user(client, "other_user", "other_user@email.com", "otherpass")
        assert rv.status_code == 200, f"Other user registration failed: Expected status code 200, got {rv.status_code}."
        rv = login_user(client, "other_user", "otherpass")
        assert rv.status_code == 200, f"Other user login failed: Expected status code 200, got {rv.status_code}."
        other_token = rv.get_json().get("token")
        assert other_token, "Other user login failed: 'token' not found in response."

        # Attempt to delete the question as other_user
        rv = delete_question(client, other_token, question_id)
        assert rv.status_code == 403, (
            f"Deleting question as non-author should fail with 403, got {rv.status_code}."
        )
        assert "error" in rv.get_json(), "Expected 'error' key in response when deleting as non-author."

    def test_like_question_like_number_increased(self, client):
        """
        Test liking a question and verify that the like_number is incremented.
        """
        # Register and login
        rv = register_user(client, "like_incr_user", "like_incr_user@email.com", "likepass")
        assert rv.status_code == 200, f"Registration failed: Expected status code 200, got {rv.status_code}."
        rv = login_user(client, "like_incr_user", "likepass")
        assert rv.status_code == 200, f"Login failed: Expected status code 200, got {rv.status_code}."
        token = rv.get_json().get("token")
        assert token, "Login failed: 'token' not found in response."

        # Add a question
        rv = add_question(client, token, "Question to be liked?", anon=False)
        assert rv.status_code == 200, f"Adding question failed: {rv.get_data(as_text=True)}"
        assert rv.get_json().get("success") is True, "Adding question failed: 'success' flag is not True."

        # Retrieve the question ID
        data = get_all_questions(client)
        question = data[-1]
        question_id = question.get("id")
        initial_likes = question.get("like_number", 0)
        assert isinstance(question_id, int), f"Expected question_id to be int, got {type(question_id)}."
        assert isinstance(initial_likes, int), f"Expected like_number to be int, got {type(initial_likes)}."

        # Like the question
        rv = like_question(client, question_id)
        assert rv.status_code == 200, f"Liking question failed: {rv.get_data(as_text=True)}"
        assert rv.get_json().get("success") == 'true', "Liking question failed: 'success' flag is not 'true'."

        # Retrieve the question again to verify like_number increment
        rv = get_question_by_id(client, question_id)
        assert rv.status_code == 200, f"Retrieving question by ID failed: {rv.get_data(as_text=True)}"
        updated_question = rv.get_json().get("question")
        updated_likes = updated_question.get("like_number")
        assert updated_likes == initial_likes + 1, (
            f"Like number did not increment: Expected {initial_likes + 1}, got {updated_likes}."
        )

    def test_random_question_with_two_added_should_appear_in_random_calls(self, client):
        """
        Test that after adding two questions, both appear in multiple random selections.
        """
        # Register and login
        rv = register_user(client, "random_user", "random_user@email.com", "randompass")
        assert rv.status_code == 200, f"Registration failed: Expected status code 200, got {rv.status_code}."
        rv = login_user(client, "random_user", "randompass")
        assert rv.status_code == 200, f"Login failed: Expected status code 200, got {rv.status_code}."
        token = rv.get_json().get("token")
        assert token, "Login failed: 'token' not found in response."

        # Add two questions
        questions = ["Random Question One?", "Random Question Two?"]
        question_ids = []
        for idx, question in enumerate(questions, start=1):
            rv = add_question(client, token, question, anon=False)
            assert rv.status_code == 200, f"Adding question {idx} failed: {rv.get_data(as_text=True)}"
            assert rv.get_json().get("success") is True, f"Adding question {idx} failed: 'success' flag is not True."
            # Retrieve question ID
            data = get_all_questions(client)
            question_id = data[-1].get("id")
            question_ids.append(question_id)
            assert isinstance(question_id, int), f"Expected question_id to be int, got {type(question_id)}."

        # Make 10 random question calls and ensure both questions appear
        found_questions = set()
        for i in range(10):
            rv = get_random_question(client)
            if rv.status_code == 200:
                question = rv.get_json().get("question")
                if question:
                    found_questions.add(question.get("id"))
            else:
                # If no questions exist, skip
                continue

        # Verify that both question IDs are found in random selections
        assert all(qid in found_questions for qid in question_ids), (
            f"Not all added questions appeared in random selections. Found questions: {found_questions}"
        )

    def test_delete_question(self, client):
        # Register and login
        rv = register_user(client, "dquser", "dquser@email.com", "dqpass")
        assert rv.status_code == 200, f"Registration failed: Expected status code 200, got {rv.status_code}."
        rv = login_user(client, "dquser", "dqpass")
        assert rv.status_code == 200, f"Login failed: Expected status code 200, got {rv.status_code}."
        token = rv.get_json().get("token")
        assert token, "Login failed: 'token' not found in response."

        # Add question
        rv = add_question(client, token, "Temp question", anon=False)
        assert rv.status_code == 200, f"Adding question failed: {rv.get_data(as_text=True)}"
        assert rv.get_json().get("success") is True, "Adding question failed: 'success' flag is not True."

        # Fetch question ID
        data = get_all_questions(client)
        assert len(data) > 0, "No questions found after adding a question."
        question_id = data[-1].get("id")
        assert isinstance(question_id, int), f"Expected question_id to be int, got {type(question_id)}."

        # Delete the question
        rv = delete_question(client, token, question_id)
        assert rv.status_code == 200, f"Deleting question failed: Expected status code 200, got {rv.status_code}."
        assert rv.get_json().get("success") is True, "Deleting question failed: 'success' flag is not True."

        # Confirm it's gone
        rv = get_question_by_id(client, question_id)
        assert rv.status_code == 404, (
            f"Expected status code 404 when retrieving deleted question, got {rv.status_code}."
        )
        assert "error" in rv.get_json(), "Expected 'error' key in response when retrieving deleted question."

    def test_random_question(self, client):
        """
        Test retrieving a random question. If no questions exist, expect an error.
        """
        rv = get_random_question(client)
        if rv.status_code == 200:
            assert "question" in rv.get_json(), "Random question retrieval failed: 'question' key not found."
        else:
            assert "error" in rv.get_json(), "Expected 'error' key when no questions exist."
            



class TestAnswerScenarios:
    def test_add_and_get_answer(self, client):
        # Register and login
        rv = register_user(client, "auser", "auser@email.com", "apass")
        assert rv.status_code == 200, f"Registration failed: Expected status code 200, got {rv.status_code}."
        rv = login_user(client, "auser", "apass")
        assert rv.status_code == 200, f"Login failed: Expected status code 200, got {rv.status_code}."
        token = rv.get_json().get("token")
        assert token, "Login failed: 'token' not found in response."

        # Add a question
        rv = add_question(client, token, "Answer me this, please?", anon=False)
        assert rv.status_code == 200, f"Adding question failed: {rv.get_data(as_text=True)}"
        assert rv.get_json().get("success") is True, "Adding question failed: 'success' flag is not True."

        # Fetch question ID
        data = get_all_questions(client)
        assert len(data) > 0, "No questions found after adding a question."
        question_id = data[-1].get("id")
        assert isinstance(question_id, int), f"Expected question_id to be int, got {type(question_id)}."

        # Add answer
        rv = add_answer(client, token, "My nice answer", question_id, anon=False)
        assert rv.status_code == 200, f"Adding answer failed: Expected status code 200, got {rv.status_code}."
        data = rv.get_json()
        assert data.get("success") is True, "Adding answer failed: 'success' flag is not True."
        answer_id = data.get("answer_id")
        assert isinstance(answer_id, int), f"Expected answer_id to be int, got {type(answer_id)}."

        # Get question by ID and see if the answer is present
        rv = get_question_by_id(client, question_id)
        assert rv.status_code == 200, f"Retrieving question by ID failed: {rv.get_data(as_text=True)}"
        answers = rv.get_json().get("answers", [])
        assert isinstance(answers, list), f"Expected answers to be a list, got {type(answers)}."
        # Verify the answer ID is found
        assert any(a.get("id") == answer_id for a in answers), (
            f"Answer with ID {answer_id} not found in the question's answers."
        )
