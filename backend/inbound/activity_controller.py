from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.inbound.transaction_utils import transactional
from backend.inbound.service_factory import activity_service

activity_api = Blueprint("activity_api", __name__)

@activity_api.route("/useractivities", methods=["GET"])
@jwt_required()
def get_user_activity():
    uid = get_jwt_identity()
    activities = activity_service.get_user_activities(uid)
    return jsonify(activities), 200

@activity_api.route("/readuseractivity/<int:lastactivityid>", methods=["GET"])
@jwt_required()
@transactional
def read_activity(lastactivityid):
    uid = get_jwt_identity()
    success = activity_service.mark_activities_as_read(uid, lastactivityid)
    return jsonify({"success": str(success).lower()}), 200

