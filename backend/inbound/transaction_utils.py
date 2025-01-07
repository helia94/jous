from api.models.base import db
from flask import jsonify
from functools import wraps

def transactional(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            result = f(*args, **kwargs)
            db.session.commit()
            return result
        except Exception as e:
            print(e)
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
    return decorated_function