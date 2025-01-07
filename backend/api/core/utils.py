import logging
from typing import Tuple
from flask import current_app, jsonify
from flask.wrappers import Response

logger = logging.getLogger(__name__)

def create_response(data=None, status=200, message=""):
    """
    Utility to wrap all responses in a consistent JSON structure.
    """
    if data is not None and not isinstance(data, dict):
        raise TypeError("Data should be a dictionary if provided.")

    response_body = {
        "success": 200 <= status < 300,
        "message": message,
        "result": data,
    }
    return jsonify(response_body), status


def all_exception_handler(error: Exception) -> Tuple[Response, int]:
    """
    A general catch-all error handler.
    """
    logger.exception("Unhandled exception occurred")
    return create_response(message=str(error), status=500)

class Mixin:
    """
    Utility Base Class for SQLAlchemy Models.
    Adds `to_dict()` to easily serialize objects to dictionaries.
    """

    def to_dict(self):
        d_out = dict(self.__dict__)
        d_out.pop("_sa_instance_state", None)
        # rename "id" to "_id" if you want
        return d_out