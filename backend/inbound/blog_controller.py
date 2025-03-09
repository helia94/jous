from flask import Blueprint, request, jsonify
from backend.inbound.service_factory import blog_service

blog_api = Blueprint("blog_api", __name__)

@blog_api.route("/blog/<string:url>", methods=["GET"])
def get_blog(url):
    blog = blog_service.get_blog_by_url(url)
    if "error" in blog:
        return jsonify(blog), 400
    return jsonify(blog), 200

@blog_api.route("/blog", methods=["POST"])
def create_blog():
    data = request.get_json() or {}
    url = data.get("url")
    title = data.get("title")
    storyline = data.get("storyline", "")

    if not url or not title:
        return jsonify({"error": "URL and title are required"}), 400

    result = blog_service.create_blog(url, title, storyline)
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result), 201