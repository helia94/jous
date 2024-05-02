from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from backend.api.models import db
from backend.api.core import logger

class BaseRepo:

    def commit_db(self, db_object):
        try:
            db.session.add(db_object)
            db.session.commit()
            return True
        except Exception as e:
            logger.error(e)
            return False

    def delete(self, db_object):
        try:
            db.session.delete(db_object)
            db.session.commit()
            return True
        except Exception as e:
            logger.error(e)
            return False


