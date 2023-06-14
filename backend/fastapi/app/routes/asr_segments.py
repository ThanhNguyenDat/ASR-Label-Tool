from datetime import timedelta
import json
import requests
import traceback as tb

from fastapi import APIRouter, Request, Response

import time
from app.database import session_asr_segments as db_session

router = APIRouter(
    prefix="/api/v1/asr_segments",
    tags=["asr_segments"],
)

@router.get("/")
async def getList(req: Request, res: Response):
    res = {
        "error_code": 0,
        "error_message": "Success",
        "data": []
    }
    try:
        st = time.time()
        items, total_item = db_session.get_all(req)
        res["data"] = items
        res["total"] = total_item
        et = time.time()
        print(f'toook : {et - st}')
    except Exception as e:
        print('tb: ', tb.format_exc())
        res["error_code"] = 1,
        res["error_message"] = str(e)
    return res


@router.get("/{id}")
async def getOne(id: int, req: Request):
    res = {
        "error_code": 0,
        "error_message": "Success",
        "data": []
    }
    try:
        st = time.time()
        items = db_session.get_one(id, req)
        res["data"] = items
        et = time.time()
        print(f'toook : {et - st}')
    except Exception as e:
        print('tb: ', tb.format_exc())
        res["error_code"] = 1,
        res["error_message"] = str(e)
    return res



@router.put("/{id}")
async def updateOne(id: int, body: dict, req: Request):
    res = {
        "error_code": 0,
        "error_message": "Success",
        "data": []
    }
    try:
        st = time.time()
        items = db_session.update(id, body)
        res["data"] = items
        et = time.time()
        print(f'toook : {et - st}')
    except Exception as e:
        print('tb: ', tb.format_exc())
        res["error_code"] = 1,
        res["error_message"] = str(e)
    return res

