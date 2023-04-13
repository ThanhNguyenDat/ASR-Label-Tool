from datetime import datetime, timedelta
from typing import Union
import json

from fastapi import Depends, HTTPException, status, APIRouter, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse

from fastapi_sqlalchemy import db

from jose import JWTError, jwt
from passlib.context import CryptContext

from typing_extensions import Annotated
from sqlalchemy.sql import text

from ..models.accountModel import User, Role, UserRole
from ..schema.accountSchema import Token, TokenData, User as UserSchema

# from ..dependencies import get_token_header
from ..database.postgres import DBSession
from .http_exceptions import *

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_user(username):
    session = DBSession()
    user = session.query(User).filter_by(username=username).first()
    # get role in session
    roles = [role.id for role in user.roles]
    
    session.close()
    
    user.role_ids = roles
    
    if not user:
        return False
    
    return user

def get_user_with_roles(username):
    session = DBSession()
    user = session.query(User).select_from(UserRole).join(User).join(Role).filter(User.username == username).first()
    session.close()

    if not user:
        return False
    
    return user

def check_user_permission(current_user, role_name):
    session = DBSession()
    user = session.query(User).select_from(UserRole).join(User).join(Role).filter(User.username == current_user.username).filter(Role.name==role_name).first()
    session.close()
    
    if not user:
        return False
    
    return user

def check_role_exist(role_name):
    session = DBSession()
    role = session.query(Role).filter_by(name=role_name).first()
    if not role:
        return False
    return role

def add_role(name, description):
    session = DBSession()
    new_role = Role(name=name, description=description)
    session.add(new_role)
    session.commit()
    session.close()
    return new_role

def add_user(username, password, email):
    session = DBSession()
    user = session.query(User).filter_by(username=username).first()
    if user:
        session.close()
        return False
    
    password_hashed = pwd_context.hash(password)
    user = User(username=username, password=password_hashed, email=email)
    session.add(user)
    session.commit()
    session.close()
    return True

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username:str, password:str):    
    user = get_user(username)
    

    if not user:
        return False
    
    # code to test
    if user.username == 'admin':
        if password == user.password:
            return user
        else:
            return False
    
    # optimize here
    if not verify_password(password, user.password):
        return False
    
    return user

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) # error
        
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = get_user(token_data.username)
    
    if user is None:
        raise credentials_exception
    return user