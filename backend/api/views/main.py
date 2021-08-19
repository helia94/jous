import re

from flask import Blueprint, request, jsonify
import dotenv
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, \
    create_refresh_token, get_jwt

main = Blueprint("main", __name__)  # initialize blueprint

import security
from api.models import db, UserAuth
from api.models.User import User
from api.models.Question import Question
from api.models.InvalidToken import InvalidToken
from api.core import logger

dotenv.load_dotenv()


def getUserAuths():
    users = UserAuth.query.all()
    return [{"id"      : i.id,
             "username": i.username,
             "email"   : i.email,
             "password": i.pwd}
            for i in users]


def addUserAuth(username, email, pwd):
    try:
        user = User(username, email, pwd)
        db.session.add(user)
        db.session.commit()
        return True
    except Exception as e:
        logger.error("addUserAuth", e)
        return False


def removeUser(uid):
    try:
        user = User.query.get(uid)
        db.session.delete(user)
        db.session.commit()
        return True
    except Exception as e:
        logger.error("removeUser", e)
        return False



def addQuestion(content, uid):
    try:
        question = Question(content=content, uid=uid, time =time.)
        db.session.add(question)
        db.session.commit()
        return True
    except Exception as e:
        logger.error("addQuestion", e)
        return False


def delQuestion(tid):
    try:
        Question = Question.query.get(tid)
        db.session.delete(Question)
        db.session.commit()
        return True
    except Exception as e:
        logger.error("delQuestion", e)
        return False


@main.route("/<a>")
def react_routes(a):
    return app.send_static_file("index.html")


@main.route("/")
def react_index():
    return app.send_static_file("index.html")


@main.route("/api/login", methods=["POST"])
def login():
    try:
        email = request.json["email"]
        password = request.json["pwd"]
        if email and password:
            user = list(filter(lambda x: security.dec(x["email"]) == email and security.checkpwd(password, x["password"]), getUserAuths()))
            # Check if user exists
            if len(user) == 1:
                token = create_access_token(identity=user[0]["id"])
                refresh_token = create_refresh_token(identity=user[0]["id"])
                return jsonify({"token": token, "refreshToken": refresh_token})
            else:
                logger.info("pass and user do not match")
                return jsonify({"error": "Invalid credentials"})
        else:
            logger.info("email or password not given")
            return jsonify({"error": "Invalid form"})
    except Exception as e:
        logger.error("unexpected error in login")
        logger.error(e)
        return jsonify({"error": "Invalid form"})


@main.route("/api/register", methods=["POST"])
def register():
    try:
        email = request.json["email"]
        email = email.lower()
        password = security.encpwd(request.json["pwd"])
        username = request.json["username"]
        if not (email and password and username):
            return jsonify({"error": "Invalid form"})
        # Check to see if user already exists
        users = getUserAuths()
        if len(list(filter(lambda x: security.dec(x["email"]) == email, users))) == 1:
            return jsonify({"error": "Email is used."})
        # Email validation check
        if not re.match(r"[\w._]{5,}@\w{3,}\.\w{2,4}", email):
            return jsonify({"error": "Invalid email"})
        addUserAuth(username, security.enc(email), password)
        return jsonify({"success": True})
    except Exception as e:
        logger.error("unexpected error in register")
        logger.error(e)
        return jsonify({"error": "Invalid form"})


@main.route("/api/checkiftokenexpire", methods=["POST"], endpoint="checkiftokenexpire")
@jwt_required()
def check_if_token_expire():
    return jsonify({"success": True})


@main.route("/api/refreshtoken", methods=["POST"], endpoint="refreshtoken")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    token = create_access_token(identity=identity)
    return jsonify({"token": token})


@main.route("/api/logout/access", methods=["POST"], endpoint="logout_access")
@jwt_required()
def access_logout():
    jti = get_jwt()["jti"]
    try:
        invalid_token = InvalidToken(jti=jti)
        invalid_token.save()
        return jsonify({"success": True})
    except Exception as e:
        logger.error("access_logout", e)
        return {"error": e.message}


@main.route("/api/logout/refresh", methods=["POST"], endpoint="access_refresh")
@jwt_required()
def refresh_logout():
    jti = get_jwt()["jti"]
    try:
        invalid_token = InvalidToken(jti=jti)
        invalid_token.save()
        return jsonify({"success": True})
    except Exception as e:
        logger.error("refresh_logout", e)
        return {"error": e.message}


@main.route("/api/Questions")
def get_Questions():
    Questions = Question.query.all()
    return jsonify([{"id"          : i.id,
                     "title"       : i.title,
                     "content"     : i.content,
                     "user"        : i.user.username,
                     "time"        : i.time,
                     "reask_number": i.reask_number,
                     "like_number" : i.like_number
                     }
                    for i in Questions])


@main.route("/api/addQuestion", methods=["POST"], endpoint="addQuestion")
@jwt_required()
def add_Question():
    try:
        title = request.json["title"]
        content = request.json["content"]
        if not (title and content):
            return jsonify({"error": "Invalid form"})
        uid = get_jwt_identity()
        addQuestion(title, content, uid)
        return jsonify({"success": "true"})
    except Exception as e:
        logger.error("add_question", e)
        return jsonify({"error": "Invalid form"})


@main.route("/api/deleteQuestion/<tid>", methods=["DELETE"], endpoint="deleteQuestion")
@jwt_required()
def delete_Question(tid):
    try:
        delQuestion(tid)
        return jsonify({"success": "true"})
    except:
        return jsonify({"error": "Invalid form"})


@main.route("/api/getcurrentuser", endpoint="getcurrentuser")
@jwt_required()
def get_current_user():
    uid = get_jwt_identity()
    users = User.query.all()
    user = list(filter(lambda x: x.id == uid, users))[0]
    return jsonify({"id": user.id,
            "username"  : user.username,
            "email"     : user.email,
            "password"  : user.pwd})


@main.route("/api/changepassword", methods=["POST"], endpoint="changepassword")
@jwt_required()
def change_password():
    try:
        user = User.query.get(get_jwt_identity())
        if not (request.json["password"] and request.json["npassword"]):
            return jsonify({"error": "Invalid form"})
        if not security.checkpwd(request.json["password"], user.pwd):
            return jsonify({"error": "Wrong password"})
        user.pwd = request.json["npassword"]
        db.session.add(user)
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        logger.error("change_password", e)
        return jsonify({"error": "Invalid form"})


@main.route("/api/deleteaccount", methods=["DELETE"], endpoint="deleteaccount")
@jwt_required()
def delete_account():
    try:
        user = User.query.get(get_jwt_identity())
        Questions = Question.query.all()
        for Question in Questions:
            if Question.user.username == user.username:
                delQuestion(Question.id)
        removeUser(user.id)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)})

# @jwt.token_in_blacklist_loader
# def check_if_blacklisted_token(decrypted):
#     jti = decrypted["jti"]
#     return InvalidToken.is_invalid(jti)
