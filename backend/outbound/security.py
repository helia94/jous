import bcrypt

def encrypt_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def check_password(plain_pwd: str, hashed_pwd: str) -> bool:
    if not plain_pwd or not hashed_pwd:
        return False
    return bcrypt.checkpw(plain_pwd.encode("utf-8"), hashed_pwd.encode("utf-8"))
