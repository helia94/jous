from api.models.base import db
from api.models.Activity import Activity
from api.core.logger import logger

class ActivityRepository:
    def find_activities_for_user(self, uid, limit=10):
        activities = Activity.query \
            .filter_by(toUid=uid) \
            .order_by(Activity.id.desc()) \
            .limit(limit).all()
        # Convert to list of dicts if needed
        return [{
            "id": a.id,
            "toUid": a.toUid,
            "fromUid": a.fromUid,
            "time": a.time,
            "type": a.type.value,
            "read": a.read,
            "what": a.what
        } for a in activities]

    def mark_as_read(self, uid, last_activity_id):
        try:
            to_mark = Activity.query \
                .filter(Activity.toUid == uid) \
                .filter(Activity.id <= last_activity_id) \
                .filter(Activity.read == False) \
                .all()
            for t in to_mark:
                t.read = True
                db.session.add(t)
            db.session.commit()
            return True
        except Exception as e:
            logger.error(e)
            db.session.rollback()
            return False
        
    def log_activity(self, recipient_id, activity_type, actor_id, question_id):
        try:
            activity = Activity(recipient_id, actor_id, activity_type, question_id)
            db.commit_db(activity)
            return True
        except Exception as e:
            logger.error(e)
            db.session.rollback()
            return False
        
