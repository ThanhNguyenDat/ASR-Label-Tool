import sys
sys.path.append("src")

from typing import Union

from fastapi import APIRouter, UploadFile, File, Request
from fastapi.responses import JSONResponse
import pydantic

class UserFaceID(pydantic.BaseModel):
    first_name: Union[str, None] = None
    last_name: Union[str, None] = None


router = APIRouter()

@router.get("/get-users")
async def get_users():
    pass

@router.get("/get-user/{id}")
async def get_user_by_uid(id=None):
    fake_data = {
        "60": {
            "first_name": "Vo",
            "last_name": "Danh"
        },
        "64": {
            "first_name": "Nguyen",
            "last_name": "Thanh"
        },
    }

    content = {
        "error_code": 0,
        "data": fake_data[id]
    }
    response = JSONResponse(content=content)
    return response

@router.post("/update-user/{uid}")
async def update_user_by_id(uid: str, user: UserFaceID):
    print('user: ', user)
    content = {
        "error_code": 0,
        "data": str(user)
    }
    return JSONResponse(content)