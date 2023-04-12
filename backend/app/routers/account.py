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
from ..database.postgres import engine, DBSession

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter(
    # dependencies=[Depends()],    
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_user(username):
    session = DBSession()
    user = session.query(User).filter_by(username=username).first()
    session.close()

    if not user:
        return False
    
    return user

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
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
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

@router.get("/")
async def root():
    return 200


@router.post("/signin")
async def signin(
    # form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
    request: Request
):
    req = await request.json()
    if ("username" not in req.keys() or "password" not in req.keys()):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = authenticate_user(req['username'], req['password'])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me/", response_model=UserSchema)
async def read_users_me(
    current_user: Annotated[UserSchema, Depends(get_current_user)]
):
    content = {
        "data": {
            "username": str(current_user.username),
        }
    }
    response = JSONResponse(content=content)
    return response


@router.post("/signup")
async def signup(request: Request):
    req = await request.json()
    
    username = req.get("username")
    password = req.get("password")
    email = req.get("email", "")
    isSuccess = add_user(username, password, email)
    if isSuccess:
        content = {
            "data": "sucess"
        }
    else:
        content = {
            "data": "fail"
        }
    response = JSONResponse(content=content)
    return response


@router.get("/users-roles")
async def user_role():
    session = DBSession()
    # users_roles = session.query(User, Role).select_from(UserRole).join(User).join(Role).all()
    users_roles = session.query(User, Role).select_from(UserRole).join(User).join(Role).filter(User.username == 'admin').all()

    for user, role in users_roles:
         print(f"User '{user.username}' is in role '{role.name}'")


@router.get("/test_query_sql")
async def test_query_sql(request: Request):
    # with engine.connect() as con:
    #     statement = text('''SELECT * FROM "user"''')

    #     rs = con.execute(statement)

    #     data = [row for row in rs]
    #     print(data)

    #     content = {
    #         "data": jsonable_encoder(str(data))
    #     }

    #     response = JSONResponse(content=content)
    #     return response
    req = await request.json()
    response = JSONResponse(content={"data": str(req)})
    return response