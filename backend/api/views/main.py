from flask import Blueprint,request, jsonify
import dotenv
import re
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, \
    create_refresh_token, get_jwt
main = Blueprint("main", __name__)  # initialize blueprint

import security
from api.models import db
from api.models.User import User
from api.models.Tweet import Tweet
from api.models.InvalidToken import InvalidToken
from api.core import logger


dotenv.load_dotenv()

def getUsers():
    users = User.query.all()
    return [{"id": i.id, "username": i.username, "email": i.email, "password": i.pwd} for i in users]


def getUser(uid):
    users = User.query.all()
    user = list(filter(lambda x: x.id == uid, users))[0]
    return {"id": user.id, "username": user.username, "email": user.email, "password": user.pwd}


def addUser(username, email, pwd):
    try:
        user = User(username, email, pwd)
        db.session.add(user)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False


def removeUser(uid):
    try:
        user = User.query.get(uid)
        db.session.delete(user)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False





def getTweets():
    tweets = Tweet.query.all()
    return [{"id": i.id, "title": i.title, "content": i.content, "user": getUser(i.uid)} for i in tweets]


def getUserTweets(uid):
    tweets = Tweet.query.all()
    return [{"id": item.id, "userid": item.user_id, "title": item.title, "content": item.content} for item in
            filter(lambda i: i.user_id == uid, tweets)]


def addTweet(title, content, uid):
    try:
        user = list(filter(lambda i: i.id == uid, User.query.all()))[0]
        twt = Tweet(title=title, content=content, user=user)
        db.session.add(twt)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False


def delTweet(tid):
    try:
        tweet = Tweet.query.get(tid)
        db.session.delete(tweet)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
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
            user = list(filter(lambda x: security.dec(x["email"]) == email and security.checkpwd(password, x["password"]), getUsers()))
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
        print(email, password, request.json["pwd"], username)
        if not (email and password and username):
            return jsonify({"error": "Invalid form"})
        # Check to see if user already exists
        users = getUsers()
        if len(list(filter(lambda x: security.dec(x["email"]) == email, users))) == 1:
            return jsonify({"error": "Email is used."})
        # Email validation check
        if not re.match(r"[\w._]{5,}@\w{3,}\.\w{2,4}", email):
            return jsonify({"error": "Invalid email"})
        addUser(username, security.enc(email), password)
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
        print(e)
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
        print(e)
        return {"error": e.message}


@main.route("/api/tweets")
def get_tweets():
    return jsonify(getTweets())


@main.route("/api/addtweet", methods=["POST"], endpoint="addtweet")
@jwt_required()
def add_tweet():
    try:
        title = request.json["title"]
        content = request.json["content"]
        if not (title and content):
            return jsonify({"error": "Invalid form"})
        uid = get_jwt_identity()
        addTweet(title, content, uid)
        return jsonify({"success": "true"})
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid form"})


@main.route("/api/deletetweet/<tid>", methods=["DELETE"], endpoint="deletetweet")
@jwt_required()
def delete_tweet(tid):
    try:
        delTweet(tid)
        return jsonify({"success": "true"})
    except:
        return jsonify({"error": "Invalid form"})


@main.route("/api/getcurrentuser", endpoint="getcurrentuser")
@jwt_required()
def get_current_user():
    uid = get_jwt_identity()
    return jsonify(getUser(uid))


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
        print(e)
        return jsonify({"error": "Invalid form"})


@main.route("/api/deleteaccount", methods=["DELETE"], endpoint="deleteaccount")
@jwt_required()
def delete_account():
    try:
        user = User.query.get(get_jwt_identity())
        tweets = Tweet.query.all()
        for tweet in tweets:
            if tweet.user.username == user.username:
                delTweet(tweet.id)
        removeUser(user.id)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)})

# @jwt.token_in_blacklist_loader
# def check_if_blacklisted_token(decrypted):
#     jti = decrypted["jti"]
#     return InvalidToken.is_invalid(jti)