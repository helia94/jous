from os import path

from flask import Blueprint, send_from_directory

client = Blueprint("client", __name__, static_folder=path.join("frontend", "build"))

def _prerendered(*parts):
    """Return the relative path of a pre-rendered page (build/<parts>/index.html) if it exists."""
    rel = path.join(*parts, "index.html")
    if path.isfile(path.join(client.static_folder, rel)):
        return rel
    return None


@client.route("/", defaults={"file_name": "", "id": ""})
@client.route("/<string:file_name>", defaults={"id": ""}, strict_slashes=False)
@client.route("/<string:file_name>/<string:id>", strict_slashes=False)
def serve(file_name, id):
    if file_name != "":
        prerendered = _prerendered(file_name, id) if id else _prerendered(file_name)
        if prerendered:
            return send_from_directory(client.static_folder, prerendered)

        target = path.join(client.static_folder, file_name)
        if path.isfile(target):
            return send_from_directory(client.static_folder, file_name)

    return send_from_directory(client.static_folder, "index.html")


@client.route("/static/<path:path_to_file>/<string:file_name>")
def serve_static(path_to_file, file_name):
    return send_from_directory(
        path.join(client.static_folder, "static", path_to_file), file_name
    )
