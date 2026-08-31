from flask import redirect, request

from client_app import client
from backend.app import create_app

# sets up the app

app, jwt = create_app()
app.register_blueprint(client, url_prefix="/")


@app.before_request
def redirect_www_to_apex():
    """301 www.jous.app -> jous.app so search engines see one canonical host."""
    host = request.host.split(":")[0]
    if host.startswith("www."):
        return redirect(f"https://{host[4:]}{request.full_path.rstrip('?')}", code=301)

if __name__ == "__main__":
    app.run(debug=True)