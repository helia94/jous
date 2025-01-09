from backend.outbound.repositories.activity_repository import ActivityRepository
from backend.api.core.logger import logger

class ActivityService:
    def __init__(self, activity_repository=None):
        self.activity_repository = activity_repository or ActivityRepository()

    def get_user_activities(self, uid):
        activities = self.activity_repository.find_activities_for_user(uid)
        return [self._serialize_activity(a) for a in activities]

    def mark_activities_as_read(self, uid, last_activity_id):
        return self.activity_repository.mark_as_read(uid, last_activity_id)


    def _serialize_activity(self, a):
        return {
            "id": a.id,
            "fromUid": self.activity_repository.get_user_name(a.fromUid),
            "time": a.time,
            "type": a.type.value,
            "read": a.read,
            "what": a.what
        } 