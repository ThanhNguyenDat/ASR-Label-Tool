from datetime import timedelta
import json
import requests

from fastapi import Depends, APIRouter, Request, Query, Response
from fastapi.responses import JSONResponse

from fastapi.security import OAuth2PasswordBearer
from fastapi.encoders import jsonable_encoder

from passlib.context import CryptContext

from typing_extensions import Annotated
from ailabtools.connection_pool_postgresql import ConnectionPoolPostgreSql

# db_config = {
#     "user": "postgres",
    
# }

# db = ConnectionPoolPostgreSql(2, 4, **db_config)

router = APIRouter()

# /users?_sort=title&_order=ASC&_start=0&_end=24
@router.get("/")
def getList(
    _sort: str = Query(default="title", description="Field to sort by"),
    _order: str = Query(default="ASC", description="Sort order (ASC or DESC)"),
    _start: int = Query(default=0, description="Start index of posts"),
    _end: int = Query(default=24, description="End index of posts"),

    # params for getMany
    id: int = Query(default=None, description="Id of user"),

    # search filter
    q: str = Query(default=None, description="Query in search"),

):
    # read data from database and handle it here
    url = f"https://jsonplaceholder.typicode.com/users?_sort={_sort}&_order={_order}&_start={_start}&_end={_end}"
    
    # handle for filter
    if q:
        url += f'&q={q}'


    # handle for getMany in frontend here
    if id:
        url = f"https://jsonplaceholder.typicode.com/users?id={id}"
    
    

    # call api or read database here
    response = requests.get(url)
    data = response.json()

    content = {
        "error_code": 0,
        "message": "add success",
        "data": data
    }
    
    response = JSONResponse(content=content)
    
    # get length in database
    response.headers["X-Total-Count"] = str(len(data))
    response.headers["Access-Control-Expose-Headers"] = "X-Total-Count"


    return response


@router.get("/{user_id}")
def getOne(user_id: int):
    response = requests.get(f"https://jsonplaceholder.typicode.com/users/{user_id}")
    data = response.json()

    content = {
        "error_code": 0,
        "message": "add success",
        "data": data
    }
    
    response = JSONResponse(content=content)
    return response


@router.put("/{user_id}")
def update(user_id: int, body: dict):
    response = requests.put(f"https://jsonplaceholder.typicode.com/users/{user_id}", data=body)
    data = response.json()
    
    content = {
        "error_code": 0,
        "message": "add success",
        "data": data
    }
    
    response = JSONResponse(content=content)
    
    return response

def updateMany():
    pass

@router.post("/")
def create():
    pass

@router.delete("/{user_id}")
def deleteOne(user_id: int):
    # read data from database and handle it here
    # response = requests.get("https://jsonplaceholder.typicode.com/posts?_sort=title&_order=ASC&_start=0&_end=24")
    response = requests.delete(f"https://jsonplaceholder.typicode.com/users/{user_id}")
    data = response.json()
    
    content = {
        "error_code": 0,
        "message": "add success",
        "data": data
    }
    
    response = JSONResponse(content=content)
    

    return response
