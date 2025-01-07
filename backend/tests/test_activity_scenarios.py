# =========================================
# tests/test_activity_scenarios.py
# =========================================
import pytest
from conftest import *

class TestActivityScenarios:
    def test_activity_flow(self, client):
        # register + login userA
        rv = register_user(client, "actA", "actA@email.com", "passA")
        print(rv.get_json())
        rv = login_user(client, "actA", "passA")
        print(rv.get_json())
        tokenA = rv.get_json()["token"]

        # register + login userB
        rv = register_user(client, "actB", "actB@email.com", "passB")
        rv = login_user(client, "actB", "passB")
        tokenB = rv.get_json()["token"]

        # userA posts question
        rv = add_question(client, tokenA, "Activity check question?", anon=False)
        rv = client.get("/api/questions/0")
        question_id = rv.get_json()[-1]["id"]

        # userB posts answer => triggers activity for userA
        rv = add_answer(client, tokenB, "Answer from userB", question_id, anon=False)
        assert rv.status_code == 200
        assert rv.get_json()["success"] is True

        # userA checks activity
        rv = get_activity(client, tokenA)
        assert rv.status_code == 200
        data = rv.get_json()
        assert len(data) > 0
        # we want the last inserted activity
        last_activity_id = data[0]["id"]

        # mark as read
        rv = read_activity(client, tokenA, last_activity_id)
        assert rv.status_code == 200
        assert rv.get_json()["success"] == "true"

        # get activity again
        rv = get_activity(client, tokenA)
        data = rv.get_json()
        # Should be read by now, but we only check the call is successful
        assert rv.status_code == 200
