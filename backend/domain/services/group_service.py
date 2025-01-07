from outbound.repositories.group_repository import GroupRepository
from api.core.logger import logger

class GroupService:
    def __init__(self, group_repository=None):
        self.group_repository = group_repository or GroupRepository()

    def create_group(self, group_name, user_ids):
        if not group_name or not user_ids:
            return {"error": "Invalid form"}, 400

        # Check uniqueness
        existing = self.group_repository.find_by_name(group_name)
        if existing:
            return {"error": "Group name has to be unique."}, 400

        group_id = self.group_repository.create_group(group_name, user_ids)
        if not group_id:
            return {"error": "DB error"}, 500
        return {"success": True}, 200

    def add_users_to_group(self, group_name, new_user_ids):
        group = self.group_repository.find_by_name(group_name)
        if not group:
            return {"error": "Invalid group name"}, 400

        success = self.group_repository.add_users(group.id, new_user_ids)
        if not success:
            return {"error": "Could not update group users"}, 500
        return {"success": True}, 200

    # Etc...
