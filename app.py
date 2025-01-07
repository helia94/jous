from client_app import client
from backend.app import create_app

# sets up the app

app, jwt = create_app()
app.register_blueprint(client, url_prefix="/")

if __name__ == "__main__":
    app.run(debug=True)
