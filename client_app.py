from os import path

from flask import Blueprint, send_from_directory

client = Blueprint("client", __name__, static_folder=path.join("frontend", "build"))


@client.route("/", defaults={"file_name": "", "id": ""})
@client.route("/<string:file_name>", defaults={"id": ""})
@client.route("/<string:file_name>/<string:id>")
def serve(file_name, id):
    if file_name != "" and path.exists(path.join(client.static_folder, file_name)):
        return send_from_directory(client.static_folder, file_name)
    else:
        return send_from_directory(client.static_folder, "index.html")


@client.route("/static/<path:path_to_file>/<string:file_name>")
def serve_static(path_to_file, file_name):
    print(path_to_file, file_name)

    return send_from_directory(
        path.join(client.static_folder, "static", path_to_file), file_name
    )
