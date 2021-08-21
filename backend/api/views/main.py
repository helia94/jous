import re
import traceback

from flask import Blueprint, request, jsonify
import dotenv
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, \
    create_refresh_token, get_jwt

main = Blueprint("main", __name__)  # initialize blueprint

import security
from api.models import db, UserAuth, Question
from api.models.User import User
from api.models.InvalidToken import InvalidToken
from api.core import logger

dotenv.load_dotenv()



def get_user_auths():
    users = UserAuth.query.all()
    return [{"id"      : i.id,
             "username": i.username,
             "email"   : i.email,
             "password": i.pwd}
            for i in users]


def get_uid_hannah():
    users = get_user_auths()
    hannah_user_auth = list(filter(lambda x: x["username"] == "Hannah", users))
    if len(hannah_user_auth)==0:
        userAuth = UserAuth("Hannah", "Hannah@Hannah.com", "Hannah")
        db.session.add(userAuth)
        db.session.flush()
        user = User(userAuth.id, "Hannah")
        db.session.add(user)
        db.session.commit()
        return userAuth.id
    return hannah_user_auth[0]["id"]


def add_user_auth(username, email, pwd):
    try:
        userAuth = UserAuth(username, email, pwd)

        db.session.add(userAuth)
        db.session.flush()
        user = User(userAuth.id, username)
        db.session.add(user)
        db.session.commit()
        return True, userAuth.id
    except Exception as e:
        logger.error(e)
        return False


def remove_user(uid):
    try:
        userAuth = UserAuth.query.get(uid)
        user = User.query.get(uid)
        db.session.delete(userAuth)
        db.session.delete(user)
        db.session.commit()
        return True
    except Exception as e:
        logger.error(e)
        return False


def add_question_helper(uid, content):
    try:
        question = Question(uid, content, [])
        db.session.add(question)
        db.session.commit()
        return True
    except Exception as e:
        logger.error(e)
        return False


def del_question(tid):
    try:
        question = Question.query.get(tid)
        db.session.delete(question)
        db.session.commit()
        return True
    except Exception as e:
        logger.error(e)
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
            user = list(filter(lambda x: security.dec(x["email"]) == email and security.checkpwd(password, x["password"]), get_user_auths()))
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
        logger.error(e)
        return jsonify({"error": e})


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
        users = get_user_auths()
        if len(list(filter(lambda x: security.dec(x["email"]) == email, users))) == 1:
            return jsonify({"error": "Email is used."})
        # Email validation check
        if not re.match(r"[\w._]{5,}@\w{3,}\.\w{2,4}", email):
            return jsonify({"error": "Invalid email"})
        success, _ = add_user_auth(username, security.enc(email), password)
        if success:
            return jsonify({"success": True})
        else:
            return jsonify({"success": False})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


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
        logger.error(e)
        return {"error": e}


@main.route("/api/logout/refresh", methods=["POST"], endpoint="access_refresh")
@jwt_required()
def refresh_logout():
    jti = get_jwt()["jti"]
    try:
        invalid_token = InvalidToken(jti=jti)
        invalid_token.save()
        return jsonify({"success": True})
    except Exception as e:
        logger.error(e)
        return {"error": e}


@main.route("/api/questions")
def get_questions():
    Questions = Question.query.all()
    return jsonify([{"id"          : i.id,
                     "content"     : i.content,
                     "username"    : i.user.username,
                     "time"        : i.time,
                     "reask_number": i.reask_number,
                     "like_number" : i.like_number
                     }
                    for i in Questions])


@main.route("/api/userquestions", methods=["POST"])
def get_user_questions():
    username = request.json["username"]
    Questions = Question.query.filter(Question.user.has(username=username)).all()
    return jsonify([{"id"          : i.id,
                     "content"     : i.content,
                     "username"    : i.user.username,
                     "time"        : i.time,
                     "reask_number": i.reask_number,
                     "like_number" : i.like_number
                     }
                    for i in Questions])


@main.route("/api/addquestion", methods=["POST"], endpoint="addQuestion")
@jwt_required()
def add_question():
    try:
        content = request.json["content"]
        anon = request.json["anon"]
        if not content:
            return jsonify({"error": "Invalid form"})
        uid = get_jwt_identity()
        if anon =="True":
            success = add_question_helper(get_uid_hannah(), content)
        else:
            success = add_question_helper(uid, content)
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


@main.route("/api/deletequestion/<tid>", methods=["DELETE"], endpoint="deleteQuestion")
@jwt_required()
def delete_question(tid):
    try:
        del_question(tid)
        return jsonify({"success": "true"})
    except:
        return jsonify({"error": "Invalid form"})


@main.route("/api/getcurrentuser", endpoint="getcurrentuser")
@jwt_required()
def get_current_user():
    uid = get_jwt_identity()
    user_auths = UserAuth.query.all()
    user_auth = list(filter(lambda x: x.id == uid, user_auths))[0]
    return jsonify({"id"      : user_auth.id,
                    "username": user_auth.username,
                    "email"   : user_auth.email,
                    "password": user_auth.pwd})


@main.route("/api/changepassword", methods=["POST"], endpoint="changepassword")
@jwt_required()
def change_password():
    try:
        userAuth = UserAuth.query.get(get_jwt_identity())
        if not (request.json["password"] and request.json["npassword"]):
            return jsonify({"error": "Invalid form"})
        if not security.checkpwd(request.json["password"], userAuth.pwd):
            return jsonify({"error": "Wrong password"})
        userAuth.pwd = request.json["npassword"]
        db.session.add(userAuth)
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


@main.route("/api/deleteaccount", methods=["DELETE"], endpoint="deleteaccount")
@jwt_required()
def delete_account():
    try:
        user = User.query.get(get_jwt_identity())
        questions = Question.query.all()
        for question in questions:
            if question.user.username == user.username:
                del_question(question.id)
        remove_user(user.id)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)})

# @jwt.token_in_blacklist_loader
# def check_if_blacklisted_token(decrypted):
#     jti = decrypted["jti"]
#     return InvalidToken.is_invalid(jti)
