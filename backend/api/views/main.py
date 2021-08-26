import re

from flask import Blueprint, request, jsonify
import dotenv
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, \
    create_refresh_token, get_jwt

main = Blueprint("main", __name__)  # initialize blueprint

import security
from api.models import db, UserAuth, Question, PublicAnswer, Group, GroupAnswer
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
    if len(hannah_user_auth) == 0:
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
    userAuth = UserAuth.query.get(uid)
    user = User.query.get(uid)
    delete(userAuth)
    delete(user)


def get_username(uid):
    user = User.query.get(uid)
    return user.username


def get_uid(username):
    user = User.query.filter(User.username == username).first()
    if not user:
        return None
    return user.uid


def commit_db(answer):
    try:
        db.session.add(answer)
        db.session.commit()
        return True
    except Exception as e:
        logger.error(e)
        return False


def delete(object):
    try:
        db.session.delete(object)
        db.session.commit()
        return True
    except Exception as e:
        logger.error(e)
        return False


def get_answers(question):
    answers = PublicAnswer.query.filter(PublicAnswer.question == question).limit(20).all()
    return [{"id"      : i.id,
             "content" : i.content,
             "username": i.user.username,
             "time"    : i.time,
             }
            for i in answers]


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
        if len(list(filter(lambda x: x["username"] == username, users))) == 1:
            return jsonify({"error": "Username is used."})
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
    questions = Question.query.all()
    return jsoniy_questions(questions)


@main.route("/api/userquestions", methods=["POST"])
def get_user_questions():
    username = request.json["username"]
    questions = Question.query.filter(Question.user.has(username=username)).limit(50).all()
    return jsoniy_questions(questions)

@main.route("/api/groupquestions/<groupname>", methods=["GET"])
@jwt_required()
def get_group_questions(groupname):
    group = Group.query.filter(Group.group_name==groupname).first()
    if not group:
        return jsonify({"error": "Invalid group name"})
    uid = get_jwt_identity()
    if uid not in group.users:
        return jsonify({"error": "Must be a group member"})
    group_questions = group.questions
    questions = Question.query.filter(Question.id.in_(group_questions)).limit(50).all()
    return jsoniy_questions(questions)


def jsoniy_questions(questions):
    return jsonify([{"id"          : i.id,
                     "content"     : i.content,
                     "username"    : i.user.username,
                     "time"        : i.time,
                     "reask_number": i.reask_number,
                     "like_number" : i.like_number
                     }
                    for i in questions])


@main.route("/api/addquestion", methods=["POST"], endpoint="addQuestion")
@jwt_required()
def add_question():
    try:
        content = request.json["content"]
        anon = request.json["anon"]
        if not content:
            return jsonify({"error": "Invalid form"})
        uid = get_jwt_identity()
        if anon == "True":
            uid1 = get_uid_hannah()
            question = Question(uid1, content, [])
        else:
            question = Question(uid, content, [])
        success = commit_db(question)
        User.query.get(uid).questions += [question.id]
        db.session.commit()
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


@main.route("/api/addanswer", methods=["POST"], endpoint="addanswer")
@jwt_required()
def add_answer():
    try:
        content = request.json["content"]
        anon = request.json["anon"]
        question = request.json["question"]
        group = request.json.get("group")
        if not content and question:
            return jsonify({"error": "Invalid form"})
        uid = get_jwt_identity()
        if not group:
            if anon == "True":
                uid1 = get_uid_hannah()
                answer = PublicAnswer(uid1, question, content)
            else:
                answer = PublicAnswer(uid, question, content)
        else:
            answer = GroupAnswer(uid, group, question, content)
        success = commit_db(answer)
        User.query.get(uid).answers += [answer.id]
        db.session.commit()
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


@main.route("/api/addgroup", methods=["POST"], endpoint="addgroup")
@jwt_required()
def add_group():
    try:
        name = request.json["name"]
        users = request.json["users"].split(',')
        if not name and users:
            return jsonify({"error": "Invalid form"})
        uid = get_jwt_identity()
        uids = [get_uid(user) for user in users]
        if None in uids:
            return jsonify({"error": "Invalid username, check and try again."})
        if get_uid_hannah() in uids:
            return jsonify({"error": "Hannah does not wanna join."})
        if Group.query.filter(Group.group_name==name).first():
            return jsonify({"error": "Group name has to be unique."})
        if uid not in uids:
            uids.append(uid)
        group = Group(name, uids)
        success = commit_db(group)
        db.session.flush()
        for u in uids:
            logger.info(f"user {u} groups:{User.query.get(u).groups}")
            User.query.get(u).groups = User.query.get(u).groups+[group.id]
        db.session.commit()
        logger.info(f"user {u} groups after adding:{User.query.get(u).groups}")
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


@main.route("/api/adduserstogroup", methods=["POST"], endpoint="adduserstogroup")
@jwt_required()
def add_user_to_group():
    try:
        name = request.json["name"]
        users = request.json["users"]
        if not name and users:
            return jsonify({"error": "Invalid form"})
        uids = [get_uid(user) for user in users]
        if None in uids:
            return jsonify({"error": "Invalid username, check and try again."})
        if get_uid_hannah() in uids:
            return jsonify({"error": "Hannah does not wanna join."})
        group = Group.query.filter(Group.group_name == name).first()
        if not group:
            return jsonify({"error": "Invalid group name"})
        group.users = list(set(group.users + uids))
        success = commit_db()
        for u in uids:
            User.query.get(u).groups += [group.id]
        db.session.commit()
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


@main.route("/api/addquestiontogroup", methods=["POST"], endpoint="addquestiongroup")
@jwt_required()
def add_question_to_group():
    try:
        name = request.json["name"]
        question = request.json["question"]
        if not name and question:
            return jsonify({"error": "Invalid form"})
        group = Group.query.filter(Group.group_name == name).first()
        if not group:
            return jsonify({"error": "Invalid group name"})
        group.questions = list(set(group.questions + [question]))
        db.session.commit()
        return jsonify({"success": "false"})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


@main.route("/api/removeuserfromgroup", methods=["POST"], endpoint="removeuserfromgroup")
@jwt_required()
def remove_user_from_group():
    try:
        name = request.json["name"]
        user = request.json["user"]
        if not name and user:
            return jsonify({"error": "Invalid form"})
        uid = get_uid(user)
        if not uid:
            return jsonify({"error": "Invalid username, check and try again."})
        group = Group.query.filter(Group.group_name == name).first()
        if not group:
            return jsonify({"error": "Invalid group name"})
        group.users = group.users.remove(uid)
        success = commit_db()
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


@main.route("/api/useranswers", methods=["POST"])
def get_user_answers():
    username = request.json["username"]
    try:
        answers = PublicAnswer.query.filter(PublicAnswer.user.has(username=username)).limit(50).all()
        return jsonify([{"id"         : i.id,
                         "content"    : i.content,
                         "username"   : i.user.username,
                         "time"       : i.time,
                         }
                        for i in answers])
    except Exception as e:
        logger.error(e)
        return jsonify({"success": "false"})


@main.route("/api/usergroups", methods=["POST"])
def get_user_groups():
    username = request.json["username"]
    uid = get_uid(username)
    try:
        user = User.query.get(uid)
        groups = Group.query.filter(Group.id.in_(user.groups)).all()
        return jsonify([{"id"        : i.id,
                         "group_name": i.group_name,
                         }
                        for i in groups])
    except Exception as e:
        logger.error(e)
        return jsonify({"success": "false"})


@main.route("/api/question/<tid>", methods=["GET"], endpoint="question")
@jwt_required()
def get_question(tid):
    try:
        q = Question.query.get(tid)
        if q is not None:
            return jsonify({
                "question": {
                    "id"          : q.id,
                    "content"     : q.content,
                    "username"    : q.user.username,
                    "time"        : q.time,
                    "reask_number": q.reask_number,
                    "like_number" : q.like_number,
                    "tags"        : q.tags,
                    "likes"       : q.likes,
                    "reasks"      : q.reasks,
                },
                "answers" : get_answers(q.id)
            })
        else:
            return jsonify({"error": "invalid question id"})
    except Exception as e:
        logger.error(e)
        return jsonify({"success": "false"})


@main.route("/api/deletequestion/<tid>", methods=["DELETE"], endpoint="deleteQuestion")
@jwt_required()
def delete_question(tid):
    try:
        question = Question.query.get(tid)
        delete(question)
        return jsonify({"success": "true"})
    except:
        return jsonify({"error": "Invalid form"})


@main.route("/api/deleteanswer/<tid>", methods=["DELETE"], endpoint="deleteAnswer")
@jwt_required()
def delete_answer(tid):
    try:
        answer = PublicAnswer.query.get(tid)
        success = delete(answer)
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        return jsonify({"error": e})


@main.route("/api/deletegroup/<tid>", methods=["DELETE"], endpoint="deletegroup")
@jwt_required()
def delete_group(tid):
    try:
        group = Group.query.get(tid)
        success = delete(group)
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        return jsonify({"error": e})


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
        questions = Question.query.filter(Question.user==user.uid).all()
        delete(questions)
        remove_user(user.id)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)})

# @jwt.token_in_blacklist_loader
# def check_if_blacklisted_token(decrypted):
#     jti = decrypted["jti"]
#     return InvalidToken.is_invalid(jti)
