from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from backend.inbound.service_factory import feature_service
from backend.outbound.llm.audio_transcription import audio_transcription_client
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

@feature_api.route("/stat", methods=["GET"])
def get_stats():
    stats = feature_service.get_stats()
    return jsonify(stats), 200





MAX_AUDIO_UPLOAD_BYTES = 25 * 1024 * 1024


@feature_api.route("/audio/transcribe", methods=["POST"])
def transcribe_audio():
    audio_file = request.files.get("audio")
    if not audio_file:
        return jsonify({"error": "Missing audio file."}), 400

    filename = secure_filename(audio_file.filename or "recording.webm")
    if not filename:
        return jsonify({"error": "Invalid audio file name."}), 400

    audio_file.stream.seek(0, 2)
    file_size = audio_file.stream.tell()
    audio_file.stream.seek(0)

    if file_size <= 0:
        return jsonify({"error": "Audio file is empty."}), 400

    if file_size > MAX_AUDIO_UPLOAD_BYTES:
        return jsonify({"error": "Audio file is too large (max 25MB)."}), 400

    language = request.form.get("language", type=str, default=None)

    try:
        transcript = audio_transcription_client.transcribe(audio_file, language=language)
    except Exception:
        return jsonify({"error": "Transcription service is currently unavailable."}), 502

    return jsonify({"transcript": transcript.strip()}), 200
