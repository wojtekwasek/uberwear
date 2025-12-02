from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from models.tables.client import Client
from sqlalchemy.orm import Session
from models.tables.admin import Admin
from models.tables.courier import Courier
from utils.config import cfg
from utils.database import get_db   
from models.tables.user import User, UserType
import bcrypt

SECRET_KEY = cfg().AUTH_SECRET
TOKEN_EXPIRATION = cfg().TOKEN_EXPIRATION_MINUTES
ALGORITHM = "HS256"

oauth2_scheme = HTTPBearer()

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + int(timedelta(minutes=TOKEN_EXPIRATION))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_admin(db: Session, uid: int):
    return db.query(Admin).filter(Admin.user_ID == uid).first()

def get_client(db: Session, uid: int):
    return db.query(Client).filter(Client.user_ID == uid).first()

def get_courier(db: Session, uid: int):
    return db.query(Courier).filter(Courier.user_ID == uid).first()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def get_current_user(db: Session = Depends(get_db), cretentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    token = cretentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=f"Could not validate credentials - check your Authorization header",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(db, email=email)
    if user is None:
        raise credentials_exception
    return user
    
def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.status != "Active":
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_active_admin(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.user_type != UserType.Admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    admin = get_admin(db, current_user.user_ID)
    if not admin:
        raise HTTPException(status_code=403, detail="Admin role not found")
    return current_user

def get_current_active_client(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    client = get_client(db, current_user.user_ID)
    if not client:
        raise HTTPException(status_code=403, detail="User is not a valid client")
    return client

def get_current_active_courier(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    courier = get_courier(db, current_user.user_ID)
    if not courier:
        raise HTTPException(status_code=403, detail="User is not a valid courier")
    return courier