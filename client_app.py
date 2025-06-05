from os import path

from flask import Blueprint, send_from_directory

client = Blueprint(
    "client",
    __name__,
    static_folder=path.join("frontend", "build"),
    static_url_path="",
)


@client.route("/", defaults={"requested_path": ""})
@client.route("/<path:requested_path>")
def serve(requested_path: str):
    """Serve the React application."""
    full_path = path.join(client.static_folder, requested_path)

    if requested_path and path.exists(full_path):
        return send_from_directory(client.static_folder, requested_path)

    return send_from_directory(client.static_folder, "index.html")


@client.route("/static/<path:path_to_file>/<string:file_name>")
def serve_static(path_to_file: str, file_name: str):
    """Serve static assets from the React build folder."""
    return send_from_directory(
        path.join(client.static_folder, "static", path_to_file),
        file_name,
    )
