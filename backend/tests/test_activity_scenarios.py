# =========================================
# tests/test_activity_scenarios.py
# =========================================
import pytest
from conftest import *

class TestActivityScenarios:
    @pytest.fixture
    def setup_users_and_question(self, client):
        """
        Setup fixture that registers two users, logs them in, and posts a question.
        
        Steps:
        1. Register and log in userA.
        2. Register and log in userB.
        3. userA posts a question.
        
        Returns:
            tuple: Contains tokenA, tokenB, and the posted question_id.
        """
        # Register and login userA
        register_user(client, "actA", "actA@email.com", "passA")
        rv = login_user(client, "actA", "passA")
        tokenA = rv.get_json()["token"]
        assert tokenA, "Failed to retrieve token for userA after login."

        # Register and login userB
        register_user(client, "actB", "actB@email.com", "passB")
        rv = login_user(client, "actB", "passB")
        tokenB = rv.get_json()["token"]
        assert tokenB, "Failed to retrieve token for userB after login."

        # userA posts a question
        add_question(client, tokenA, "Activity check question?", anon=False)
        rv = client.get("/api/questions/0")
        assert rv.status_code == 200, "Failed to retrieve questions after posting."
        questions = rv.get_json()
        assert questions, "No questions found after posting."
        question_id = questions[-1]["id"]
        assert isinstance(question_id, int), f"Expected question_id to be int, got {type(question_id)}."

        return tokenA, tokenB, question_id

    def assert_activity_fields(self, activity):
        """
        Validates that the activity item contains all required fields with correct data types.
        
        Args:
            activity (dict): The activity item to validate.
        
        Raises:
            AssertionError: If any required field is missing or has an incorrect type.
        """
        assert isinstance(activity, dict), f"Activity should be a dict, got {type(activity)}."
        required_fields = {
            "fromUid": str,
            "type": str,
            "what": int,
            "id": int,
            "read": bool,
            "time": str
        }
        for field, field_type in required_fields.items():
            assert field in activity, f"Missing required field '{field}' in activity."
            assert isinstance(activity[field], field_type), (
                f"Field '{field}' should be of type {field_type.__name__}, "
                f"got {type(activity[field]).__name__} instead."
            )

    def assert_specific_activity(self, activity, expected):
        """
        Validates that specific fields in the activity item match expected values.
        
        Args:
            activity (dict): The activity item to validate.
            expected (dict): A dictionary of expected field values.
        
        Raises:
            AssertionError: If any expected field is missing or does not match the expected value.
        """
        for key, value in expected.items():
            assert key in activity, f"Expected field '{key}' not found in activity."
            assert activity[key] == value, (
                f"Field '{key}' mismatch: expected '{value}', got '{activity[key]}'."
            )

    def test_activity_flow(self, client, setup_users_and_question):
        """
        Test the complete activity flow:
        1. userB posts an answer to userA's question.
        2. Verify that userA receives an activity notification.
        3. Mark the activity as read.
        4. Verify that the activity is marked as read.
        """
        tokenA, tokenB, question_id = setup_users_and_question

        # userB posts an answer, triggering an activity for userA
        rv = add_answer(client, tokenB, "Answer from userB", question_id, anon=False)
        assert rv.status_code == 200, "Expected status code 200 when userB adds an answer."
        assert rv.get_json()["success"] is True, "Adding answer by userB should return success=True."

        # userA checks activity
        rv = get_activity(client, tokenA)
        assert rv.status_code == 200, "Expected status code 200 when userA retrieves activities."
        activities = rv.get_json()
        assert isinstance(activities, list), f"Expected activities to be a list, got {type(activities)}."
        assert len(activities) > 0, "Expected at least one activity for userA after userB's answer."

        # Verify the latest activity
        latest_activity = activities[0]
        self.assert_activity_fields(latest_activity)

        expected_activity = {
            "fromUid": "actB",
            "type": "answer",
            "what": question_id,
            "read": False
        }
        self.assert_specific_activity(latest_activity, expected_activity)

        last_activity_id = latest_activity["id"]

        # Mark the latest activity as read
        rv = read_activity(client, tokenA, last_activity_id)
        assert rv.status_code == 200, "Expected status code 200 when marking activity as read."
        assert rv.get_json().get("success") == "true", "Marking activity as read should return success='true'."

        # userA checks activity again
        rv = get_activity(client, tokenA)
        assert rv.status_code == 200, "Expected status code 200 when userA retrieves activities after marking as read."
        updated_activities = rv.get_json()
        assert isinstance(updated_activities, list), f"Expected activities to be a list, got {type(updated_activities)}."
        assert len(updated_activities) > 0, "Expected at least one activity for userA after marking as read."

        # Verify that the latest activity is marked as read
        updated_latest_activity = updated_activities[0]
        self.assert_specific_activity(updated_latest_activity, {"id": last_activity_id, "read": True})

    def test_activity_content(self, client, setup_users_and_question):
        """
        Test that activity content is correctly recorded and retrievable.
        
        Steps:
        1. userB posts another answer to userA's question.
        2. Verify that the activity for userA contains the correct content.
        """
        tokenA, tokenB, question_id = setup_users_and_question

        # userB posts an answer, triggering an activity for userA
        answer_content = "Another answer from userB"
        rv = add_answer(client, tokenB, answer_content, question_id, anon=False)
        assert rv.status_code == 200, "Expected status code 200 when userB adds another answer."
        assert rv.get_json()["success"] is True, "Adding another answer by userB should return success=True."

        # userA checks activity
        rv = get_activity(client, tokenA)
        assert rv.status_code == 200, "Expected status code 200 when userA retrieves activities."
        activities = rv.get_json()
        assert isinstance(activities, list), f"Expected activities to be a list, got {type(activities)}."
        assert len(activities) > 0, "Expected at least one activity for userA after userB's second answer."

        # Iterate through activities and assert their content
        for activity in activities:
            self.assert_activity_fields(activity)

            if activity["type"] == "answer":
                expected = {
                    "fromUid": "actB",
                    "what": question_id
                }
                self.assert_specific_activity(activity, expected)

    def test_no_activity_on_author_answer(self, client, setup_users_and_question):
        """
        Test that no activity is logged when the author of a question writes an answer to their own question.
        
        Steps:
        1. userA adds an answer to their own question.
        2. Verify that no activity is logged for userA.
        """
        tokenA, tokenB, question_id = setup_users_and_question

        # userA adds an answer to their own question
        rv = add_answer(client, tokenA, "Answer from author", question_id, anon=False)
        assert rv.status_code == 200, "Expected status code 200 when userA adds an answer."
        assert rv.get_json()["success"] is True, "Adding answer by userA should return success=True."

        # userA checks activity
        rv = get_activity(client, tokenA)
        assert rv.status_code == 200, "Expected status code 200 when userA retrieves activities."
        activities = rv.get_json()
        assert isinstance(activities, list), f"Expected activities to be a list, got {type(activities)}."
        assert len(activities) == 0, "Expected no activities when author answers their own question."
