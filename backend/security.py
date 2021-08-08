import bcrypt
import base64
import hashlib
from cryptography.fernet import Fernet

key = Fernet.generate_key()
e = Fernet(key)


def encpwd(pwd):
    return bcrypt.hashpw(base64.b64encode(hashlib.sha256(pwd.encode()).digest()), bcrypt.gensalt()).decode()


def checkpwd(x, y):
    return bcrypt.checkpw(base64.b64encode(hashlib.sha256(x.encode()).digest()), y.encode())


def enc(txt: str) -> str:
    return e.encrypt(txt.encode()).decode()


def dec(txt: str) -> str:
    return e.decrypt(txt.encode()).decode()
