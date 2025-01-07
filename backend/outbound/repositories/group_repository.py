from api.models.base import db
from api.models.Group import Group
from api.models.User import User
from api.core.logger import logger

class GroupRepository:
    def find_by_name(self, group_name):
        return Group.query.filter_by(group_name=group_name).first()

    def create_group(self, group_name, user_ids):
        try:
            g = Group(group_name, user_ids)
            db.session.add(g)
            db.session.flush()
            # update each user’s groups array
            for uid in user_ids:
                user = User.query.get(uid)
                if user:
                    u_groups = user.groups or []
                    u_groups.append(g.id)
                    user.groups = u_groups
                    db.session.add(user)
            db.session.commit()
            return g.id
        except Exception as e:
            logger.error(e)
            db.session.rollback()
            return None

    def add_users(self, group_id, new_user_ids):
        try:
            group = Group.query.get(group_id)
            if not group:
                return False
            current_users = set(group.users or [])
            for uid in new_user_ids:
                current_users.add(uid)
                # also update user’s groups array
                user = User.query.get(uid)
                if user:
                    ug = user.groups or []
                    if group_id not in ug:
                        ug.append(group_id)
                        user.groups = ug
                        db.session.add(user)
            group.users = list(current_users)
            db.session.add(group)
            db.session.commit()
            return True
        except Exception as e:
            logger.error(e)
            db.session.rollback()
            return False
