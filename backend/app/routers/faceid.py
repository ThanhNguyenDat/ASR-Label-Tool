import sys
sys.path.append("src")

from fastapi import APIRouter, UploadFile, File, Request
from fastapi.responses import FileResponse, JSONResponse

router = APIRouter()

@router.get("/get-users")
def get_users():
    pass

@router.get("/get-user-by-id/{id}")
def get_user_by_uid(id=None):
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
