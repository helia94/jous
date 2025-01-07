from conftest import *

class TestAuthScenarios:
    def test_register_and_login(self, client):
        # Register
        rv = register_user(client, "testuser", "test@email.com", "testpass")
        print(rv.get_json())
        assert rv.status_code == 200, f"Registration failed: Expected status code 200, got {rv.status_code}."
        assert rv.get_json().get("success") is True, "Registration failed: 'success' flag is not True."

        # Login
        rv = login_user(client, "testuser", "testpass")
        assert rv.status_code == 200, f"Login failed: Expected status code 200, got {rv.status_code}."
        assert "token" in rv.get_json(), "Login failed: 'token' not found in response."

    def test_invalid_registration(self, client):
        # Missing password
        rv = register_user(client, "testuser2", "test2@email.com", "")
        assert rv.status_code == 400, f"Invalid registration: Expected status code 400, got {rv.status_code}."
        assert "error" in rv.get_json(), "Invalid registration: 'error' not found in response."

    def test_invalid_login(self, client):
        # Not registered user
        rv = login_user(client, "ghostuser", "whatever")
        assert rv.status_code == 401, f"Invalid login: Expected status code 401, got {rv.status_code}."
        assert "error" in rv.get_json(), "Invalid login: 'error' not found in response."

    def test_check_token_expire(self, client):
        # First register
        rv = register_user(client, "checkuser", "checkuser@email.com", "checkpass")
        assert rv.status_code == 200, f"Registration failed: Expected status code 200, got {rv.status_code}."

        # Then login
        rv = login_user(client, "checkuser", "checkpass")
        token = rv.get_json().get("token")
        assert token, "Token retrieval failed: 'token' not found after login."

        # Check token
        rv = check_token_expire(client, token)
        assert rv.status_code == 200, f"Token check failed: Expected status code 200, got {rv.status_code}."
        assert rv.get_json().get("success") is True, "Token check failed: 'success' flag is not True."

    def test_refresh_token(self, client):
        # Register user
        rv = register_user(client, "refreshuser", "refreshuser@email.com", "refreshpass")
        assert rv.status_code == 200, f"Registration failed: Expected status code 200, got {rv.status_code}."

        # Login user
        rv = login_user(client, "refreshuser", "refreshpass")
        assert rv.status_code == 200, f"Login failed: Expected status code 200, got {rv.status_code}."
        refresh = rv.get_json().get("refreshToken")
        assert refresh, "Refresh token retrieval failed: 'refreshToken' not found after login."

        # Refresh token
        rv = refresh_token(client, refresh)
        assert rv.status_code == 200, f"Token refresh failed: Expected status code 200, got {rv.status_code}."
        assert "token" in rv.get_json(), "Token refresh failed: 'token' not found in response."
