import logging
from os import path

from flask import Blueprint, Response, request, send_from_directory

import seo_pages

client = Blueprint("client", __name__, static_folder=path.join("frontend", "build"))
log = logging.getLogger(__name__)


def _db_rendered(file_name, id):
    """Server-render question and blog pages from the database (best effort)."""
    try:
        if file_name == "question" and id.isdigit():
            from backend.inbound.service_factory import question_service

            return seo_pages.question_page(client.static_folder, question_service, int(id), request.args.get("lang"))
        if file_name == "blog" and id:
            from backend.inbound.service_factory import blog_service

            return seo_pages.blog_page(client.static_folder, blog_service, id)
    except Exception:  # never let SEO rendering break the app; fall back to the SPA shell
        log.exception("seo render failed for /%s/%s", file_name, id)
    return None

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

        rendered = _db_rendered(file_name, id)
        if rendered:
            return Response(rendered, mimetype="text/html")

    return send_from_directory(client.static_folder, "index.html")


@client.route("/sitemap-questions.xml")
def sitemap_questions():
    from backend.api.models import Question

    return Response(seo_pages.questions_sitemap(Question), mimetype="application/xml")


@client.route("/static/<path:path_to_file>/<string:file_name>")
def serve_static(path_to_file, file_name):
    return send_from_directory(
        path.join(client.static_folder, "static", path_to_file), file_name
    )
