from datetime import timedelta
from typing import Union
import json

from fastapi import Depends, APIRouter, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from passlib.context import CryptContext

from typing_extensions import Annotated
from sqlalchemy.sql import text

from ..models.accountModel import User, Role, UserRole
from ..schema.accountSchema import User as UserSchema

from ..database.postgres import DBSession
from .common import *
from .http_exceptions import incorrect_username_password_exception, permission_denied_exception

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1 # API ACCESS TIME

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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
        raise incorrect_username_password_exception
    
    user = authenticate_user(req['username'], req['password'])
    if not user:
        raise incorrect_username_password_exception
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    content = {
        "data": {
            "access_token": access_token,
        },
        "error_code": 0,
        "message": "Login successful",
        "success": True
    }

    # Get ip and port of client
    ip_client = request.client.host
    port_client = request.client.port
    print(f'{ip_client}:{port_client}')

    response = JSONResponse(content=content)
    print("response: ", content)
    # response.set_cookie("access_token", access_token)
    return response


@router.get("/login-info")
async def get_login_info(
    current_user: Annotated[UserSchema, Depends(get_current_user)]
):
    # user = current_user # username va password
    content = {
        "error_code": 0,
        "success": True,
        "data": {
            "role_ids": current_user.role_ids,
            "email": current_user.email,
            "id": current_user.id,
        }
    }
    response = JSONResponse(content=content)
    return response


@router.get("/get-roles")
async def get_roles(
    current_user: Annotated[UserSchema, Depends(get_current_user)]
):
    session = DBSession()
    roles = session.query(Role).all()
    
    def get_info_role(role):
        return {
            "role_id": role.id,
            "role_name": role.name,
            "role_description": role.description
        }
    
    content = {
        "data": [get_info_role(role) for role in roles],
        "error_code": 0,
        "success": True,
    }
    response = JSONResponse(content=content)
    session.close()
    return response


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


@router.get("/users-roles") # only admin
async def user_role(
    current_user: Annotated[UserSchema, Depends(get_current_user)]
):
    if not check_user_permission(current_user=current_user, role_name='admin'):
        raise permission_denied_exception
    
    session = DBSession()
    users_roles = session.query(User, Role).select_from(UserRole).join(User).join(Role).all()
    
    res = {}
    for user, role in users_roles:
        if user in res.keys():
            res[user.username].append(role.name)
        
        if user not in res.keys():
            res[user.username] = [role.name]
    
    content = {
        "data": res
    }
    session.close()

    response = JSONResponse(content=content)
    return response


@router.post("/create-role")
async def create_role(
    current_user: Annotated[UserSchema, Depends(get_current_user)],
    request: Request
):
    if not check_user_permission(current_user=current_user, role_name='admin'):
        return permission_denied_exception
    
    role = await request.json()
    
    role_name = role.get("name", "")
    role_desp = role.get("description", "")

    role = check_role_exist(role_name=role_name)
    if role:
        return role_exist_exception
    
    new_role = add_role(name=role_name, description=role_desp)
    if not new_role:
        return False
    
    content = {
        "success": "ok"
    }
    response = JSONResponse(content=content)
    return response


@router.patch("/update-role")
async def update_user_role(
    current_user: Annotated[UserSchema, Depends(get_current_user)],
    request: Request
):
    session = DBSession()

    req = await request.json()
    new_roles = req.get("roles", [])
    user = session.query(User).filter_by(id=current_user.id).first()

    old_roles = [ur.role_id for ur in user.roles]
    
    return old_roles

@router.get("/test_query_sql")
async def test_query_sql(    
    current_user: Annotated[UserSchema, Depends(get_current_user)],
    request: Request,
):
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
    user = {
        "username": current_user.username
    }
    response = JSONResponse(content={"data": str(req), "user": user})
    return response