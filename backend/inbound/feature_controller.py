from flask import Blueprint, jsonify, request
from backend.inbound.service_factory import feature_service
from backend.inbound.utils import to_lower

feature_api = Blueprint("feature_api", __name__)

@feature_api.route("/languages", methods=["GET"])
def get_languages():
    languages = feature_service.get_languages()
    return jsonify(languages), 200

@feature_api.route("/filters", methods=["GET"])
def get_filters():
    language_id = request.args.get('language_id', type=str, default=None)
    filters = feature_service.get_filters(to_lower(language_id))
    return jsonify(filters), 200



