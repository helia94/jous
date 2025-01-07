import bcrypt
import base64
import hashlib
def encpwd(pwd):
    return bcrypt.hashpw(base64.b64encode(hashlib.sha256(pwd.encode()).digest()), bcrypt.gensalt()).decode()
def checkpwd(x, y):
    return bcrypt.checkpw(base64.b64encode(hashlib.sha256(x.encode()).digest()), y.encode())
