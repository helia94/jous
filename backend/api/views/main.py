import re

from flask import Blueprint, request, jsonify
import dotenv
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, \
    create_refresh_token, get_jwt


api = Blueprint("main", __name__)  # initialize blueprint

from backend import security
from backend.api.models import db, UserAuth, Question, PublicAnswer, Group, GroupAnswer, Activity
from backend.api.models.User import User
from backend.api.models.InvalidToken import InvalidToken
from backend.api.core import logger


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


def commit_db(db_object):
    try:
        db.session.add(db_object)
        db.session.commit()
        return True
    except Exception as e:
        logger.error(e)
        return False


def delete(db_object):
    try:
        db.session.delete(db_object)
        db.session.commit()
        return True
    except Exception as e:
        logger.error(e)
        return False


def get_answers(question):
    answers = PublicAnswer.query.filter(PublicAnswer.question == question).order_by(PublicAnswer.id.desc()).limit(20).all()
    answers = list(reversed(answers))
    return [{"id"      : i.id,
             "content" : i.content,
             "username": i.user.username,
             "time"    : i.time,
             }
            for i in answers]


def get_public_answers(question, group):
    answers = GroupAnswer.query \
        .filter(GroupAnswer.group == group) \
        .filter(GroupAnswer.question == question) \
        .order_by(GroupAnswer.id.desc()).limit(20).all()
    answers = list(reversed(answers))
    return format_answers(answers)


def format_answers(answers):
    return [{"id"      : i.id,
             "content" : i.content,
             "username": i.user.username,
             "time"    : i.time,
             }
            for i in answers]


def get_group_id(groupname):
    group = Group.query.filter(Group.group_name == groupname).first()
    return group


def jsoniy_questions(questions):
    return jsonify([{"id"           : i.id,
                     "content"      : i.content,
                     "username"     : i.user.username,
                     "time"         : i.time,
                     "reask_number" : i.reask_number,
                     "like_number"  : i.like_number,
                     "answer_number": len(i.public_answer)
                     }
                    for i in questions])


@api.route("/<a>")
def react_routes(a):
    return app.send_static_file("index.html")


@api.route("/")
def react_index():
    return app.send_static_file("index.html")


@api.route("/login", methods=["POST"])
def login():
    try:
        emailorusername = request.json["email"]
        password = request.json["pwd"]
        if emailorusername and password:
            user = list(filter(lambda x: (x["email"] == emailorusername or x["username"] == emailorusername) and security.checkpwd(password, x["password"]), get_user_auths()))
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


@api.route("/register", methods=["POST"])
def register():
    try:
        email = request.json["email"]
        email = email.lower()
        password = security.encpwd(request.json["pwd"])
        username = request.json["username"]
        if not (password and username):
            return jsonify({"error": "Invalid form"})
        # Check to see if user already exists
        users = get_user_auths()
        if len(list(filter(lambda x: x["username"] == username, users))) == 1:
            return jsonify({"error": "Username is used."})
        # Email validation check
        if email:
            if not re.match(r"[\w._]{5,}@\w{3,}\.\w{2,4}", email):
                return jsonify({"error": "Invalid email"})
        success, _ = add_user_auth(username, email, password)
        if success:
            return jsonify({"success": True})
        else:
            return jsonify({"success": False})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": str(e)})


@api.route("/checkiftokenexpire", methods=["POST"], endpoint="checkiftokenexpire")
@jwt_required()
def check_if_token_expire():
    return jsonify({"success": True})


@api.route("/refreshtoken", methods=["POST"], endpoint="refreshtoken")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    token = create_access_token(identity=identity)
    return jsonify({"token": token})


@api.route("/logout/access", methods=["POST"], endpoint="logout_access")
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


@api.route("/logout/refresh", methods=["POST"], endpoint="access_refresh")
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


@api.route("/questions/<offset>")
@api.route("/questions", defaults={"offset": "0"})
def get_questions(offset):
    pageSize = 20
    questions = Question.query.order_by(Question.id.desc()) \
        .limit(pageSize).offset(pageSize * int(offset)).all()
    questions = list(reversed(questions))
    return jsoniy_questions((questions))


@api.route("/userquestions/<offset>", methods=["POST"])
@api.route("/userquestions", methods=["POST"], defaults={"offset": "0"})
def get_user_questions(offset):
    pageSize = 10
    username = request.json["username"]
    questions = Question.query.filter(Question.user.has(username=username)) \
        .order_by(Question.id.desc()) \
        .limit(pageSize).offset(pageSize * offset).all()
    questions = list(reversed(questions))
    return jsoniy_questions(questions)


@api.route("/groupquestions/<groupname>", methods=["GET"], defaults={"offset": "0"})
@api.route("/groupquestions/<groupname>/<offset>", methods=["GET"])
@jwt_required()
def get_group_questions(groupname, offset):
    pageSize = 20
    group = get_group_id(groupname)
    if not group:
        return jsonify({"error": "Invalid group name"})
    uid = get_jwt_identity()
    if uid not in group.users:
        return jsonify({"error": "Must be a group member"})
    group_questions = group.questions
    questions = Question.query.filter(Question.id.in_(group_questions)) \
        .order_by(Question.id.desc()) \
        .limit(pageSize).offset(pageSize * offset).all()
    questions = list(reversed(questions))
    return jsonify([{"question": {"id"          : i.id,
                                  "content"     : i.content,
                                  "username"    : i.user.username,
                                  "time"        : i.time,
                                  "reask_number": i.reask_number,
                                  "like_number" : i.like_number
                                  },
                     "answers" : get_public_answers(i.id, group.id)}
                    for i in questions])


@api.route("/addquestion", methods=["POST"], endpoint="addQuestion")
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
        questions = User.query.get(uid).questions
        questions.append(question.id)
        User.query.get(uid).questions = questions
        db.session.commit()
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


@api.route("/addanswer", methods=["POST"], endpoint="addanswer")
@jwt_required()
def add_answer():
    try:
        content = request.json["content"]
        anon = request.json["anon"]
        question = request.json["question"]
        groupname = request.json.get("group")
        if not content and question:
            return jsonify({"error": "Invalid form"})
        uid = get_jwt_identity()
        if not groupname:
            if anon == "True":
                uid = get_uid_hannah()
                answer = PublicAnswer(uid, question, content)

            else:
                answer = PublicAnswer(uid, question, content)
            activity_type = "answer"
            what = question
        else:
            group = get_group_id(groupname)
            if group:
                answer = GroupAnswer(uid, group.id, question, content)
                activity_type = "answerInGroup"
                what = group.id
                toUid = group.users.remove(uid)
            else:
                return jsonify({"error": "group name is wrong"})
        success = commit_db(answer)
        if not groupname:
            user_answers = User.query.get(uid).answers
            user_answers.append(answer.id)
            User.query.get(uid).answers = user_answers
            db.session.commit()
            question_answers = Question.query.get(int(question)).public_answer
            question_author = Question.query.get(int(question)).uid
            toUid = question_author
            question_answers.append(answer.id)
            Question.query.get(int(question)).public_answer = question_answers
            db.session.commit()
        add_activity_to_db(toUid, uid, activity_type, what)
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


def add_activity_to_db(toUid, uid, activity_type, what):
    if isinstance(toUid, int):
        if toUid != uid:
            activity = Activity(toUid, uid, activity_type, what)
            commit_db(activity)
    else:
        for u in toUid:
            activity = Activity(u, uid, activity_type, what)
            commit_db(activity)


@api.route("/addgroup", methods=["POST"], endpoint="addgroup")
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
        if Group.query.filter(Group.group_name == name).first():
            return jsonify({"error": "Group name has to be unique."})
        if uid not in uids:
            uids.append(uid)
        group = Group(name, uids)
        success = commit_db(group)
        db.session.flush()
        for u in uids:
            logger.info(f"user {u} groups:{User.query.get(u).groups}")
            User.query.get(u).groups = User.query.get(u).groups + [group.id]
        db.session.commit()
        logger.info(f"user {u} groups after adding:{User.query.get(u).groups}")
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


@api.route("/adduserstogroup", methods=["POST"], endpoint="adduserstogroup")
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
            user_groups = User.query.get(u).groups
            user_groups.append(group.id)
            User.query.get(u).groups = user_groups
        db.session.commit()
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        logger.error(e)
        return jsonify({"error": e})


@api.route("/addquestiontogroup", methods=["POST"], endpoint="addquestiongroup")
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


@api.route("/removeuserfromgroup", methods=["POST"], endpoint="removeuserfromgroup")
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


@api.route("/useranswers", methods=["POST"])
def get_user_answers():
    username = request.json["username"]
    try:
        answers = PublicAnswer.query.filter(PublicAnswer.user.has(username=username)).order_by(PublicAnswer.id.desc()).limit(50).all()
        return jsonify([{"id"      : i.id,
                         "content" : i.content,
                         "username": i.user.username,
                         "time"    : i.time,
                         "question": i.question
                         }
                        for i in answers])
    except Exception as e:
        logger.error(e)
        return jsonify({"success": "false"})


@api.route("/useranswerstoquestions", methods=["GET"])
@jwt_required()
def get_answers_to_user_question():
    try:
        uid = get_jwt_identity()
        user = User.query.get(uid)
        questions = user.questions
        answers = PublicAnswer.query.filter(PublicAnswer.question.in_(questions)).order_by(PublicAnswer.id.desc()).limit(50).all()
        return jsonify([{"id"      : i.id,
                         "content" : i.content,
                         "username": i.user.username,
                         "time"    : i.time,
                         "question": i.question
                         }
                        for i in answers])
    except Exception as e:
        logger.error(e)
        return jsonify({"success": "false"})


@api.route("/usergroups", methods=["POST"])
@jwt_required()
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


@api.route("/useractivities", methods=["GET"])
@jwt_required()
def get_user_activity():
    uid = get_jwt_identity()
    try:
        activities = Activity.query.filter(Activity.toUid == uid).order_by(Activity.id.desc()).limit(10).all()
        return jsonify([
            {
                "id"  : i.id,
                "toUid"  : i.toUid,
                "fromUid": get_username(i.fromUid),
                "time"   : i.time,
                "type"   : i.type.value,
                "read"   : i.read,
                "what"   : i.what
            }
            for i in activities])
    except Exception as e:
        logger.error(e)
        return jsonify({"success": "false"})


@api.route("/readuseractivity/<lastactivityid>", methods=["GET"])
@jwt_required()
def read_activity(lastactivityid):
    uid = get_jwt_identity()
    try:
        activities = Activity.query.filter(Activity.toUid == uid).filter(Activity.id <= lastactivityid).filter(Activity.read == False).order_by(Activity.id.desc()).limit(10).all()
        for activity in activities:
            activity.read = True
        success = db.session.commit()
        if success:
            return jsonify({"success": "true"})
        else:
            return jsonify({"success": "false"})
    except Exception as e:
        logger.error(e)
        return jsonify({"success": "false"})


@api.route("/question/<tid>", methods=["GET"], endpoint="question")
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


@api.route("/deletequestion/<tid>", methods=["DELETE"], endpoint="deleteQuestion")
@jwt_required()
def delete_question(tid):
    try:
        PublicAnswer.query.filter(PublicAnswer.question==tid).delete()
        delete(Question.query.get(tid))
        return jsonify({"success": "true"})
    except:
        return jsonify({"error": "Invalid form"})


@api.route("/likequestion/<tid>", methods=["POST"], endpoint="likeQuestion")
def like_question(tid):
    try:
        Question.query.get(tid).like_number += 1
        db.session.commit()
        return jsonify({"success": "true"})
    except:
        return jsonify({"error": "delete did not work"})


@api.route("/deleteanswer/<tid>", methods=["DELETE"], endpoint="deleteAnswer")
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


@api.route("/deletegroup/<tid>", methods=["DELETE"], endpoint="deletegroup")
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


@api.route("/getcurrentuser", endpoint="getcurrentuser")
@jwt_required()
def get_current_user():
    uid = get_jwt_identity()
    user_auths = UserAuth.query.all()
    user_auth = list(filter(lambda x: x.id == uid, user_auths))[0]
    return jsonify({"id"      : user_auth.id,
                    "username": user_auth.username,
                    "email"   : user_auth.email,
                    "password": user_auth.pwd})


@api.route("/changepassword", methods=["POST"], endpoint="changepassword")
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


@api.route("/deleteaccount", methods=["DELETE"], endpoint="deleteaccount")
@jwt_required()
def delete_account():
    try:
        user = User.query.get(get_jwt_identity())
        questions = Question.query.filter(Question.user == user.uid).all()
        delete(questions)
        remove_user(user.id)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)})

# @jwt.token_in_blacklist_loader
# def check_if_blacklisted_token(decrypted):
#     jti = decrypted["jti"]
#     return InvalidToken.is_invalid(jti)
