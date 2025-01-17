from flask import Blueprint, jsonify
from backend.inbound.service_factory import feature_service

feature_api = Blueprint("feature_api", __name__)

@feature_api.route("/languages", methods=["GET"])
def get_user_feature():
    languages = feature_service.get_languages()
    return jsonify(languages), 200


