from conftest import *

class TestAuthScenarios:
    def test_register_and_login(self, client):
        # Register
        rv = register_user(client, "testuser", "test@email.com", "testpass")
        print(rv.get_json())
        assert rv.status_code == 200
        assert rv.get_json().get("success") is True

        # Login
        rv = login_user(client, "testuser", "testpass")
        assert rv.status_code == 200
        assert "token" in rv.get_json()

    def test_invalid_registration(self, client):
        # Missing password
        rv = register_user(client, "testuser2", "test2@email.com", "")
        assert rv.status_code == 400
        assert "error" in rv.get_json()

    def test_invalid_login(self, client):
        # Not registered user
        rv = login_user(client, "ghostuser", "whatever")
        assert rv.status_code == 401
        assert "error" in rv.get_json()

    def test_check_token_expire(self, client):
        # First register
        rv = register_user(client, "checkuser", "checkuser@email.com", "checkpass")
        assert rv.status_code == 200
        # Then login
        rv = login_user(client, "checkuser", "checkpass")
        token = rv.get_json()["token"]
        # Check token
        rv = check_token_expire(client, token)
        assert rv.status_code == 200
        assert rv.get_json()["success"] is True

    def test_refresh_token(self, client):
        rv = register_user(client, "refreshuser", "refreshuser@email.com", "refreshpass")
        rv = login_user(client, "refreshuser", "refreshpass")
        refresh = rv.get_json()["refreshToken"]
        rv = refresh_token(client, refresh)
        assert rv.status_code == 200
        assert "token" in rv.get_json()

    def test_change_password_and_login_again(self, client):
        # Register + login
        rv = register_user(client, "changepwuser", "changepwuser@email.com", "oldpass")
        rv = login_user(client, "changepwuser", "oldpass")
        token = rv.get_json()["token"]
        # Change password
        rv = change_password(client, token, "oldpass", "newpass")
        assert rv.status_code == 200
        # Login with new password
        rv = login_user(client, "changepwuser", "newpass")
        assert rv.status_code == 200
        assert "token" in rv.get_json()

    def test_delete_account(self, client):
        # Register + login
        rv = register_user(client, "deluser", "deluser@email.com", "delpass")
        rv = login_user(client, "deluser", "delpass")
        token = rv.get_json()["token"]
        # Delete account
        rv = delete_account(client, token)
        assert rv.status_code == 200
        # Attempt to login
        rv = login_user(client, "deluser", "delpass")
        assert rv.status_code == 401
        assert "error" in rv.get_json()