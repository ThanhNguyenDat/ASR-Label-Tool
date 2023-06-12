from datetime import timedelta
import json
import requests

from fastapi import Depends, APIRouter, Request, Query, Response
from fastapi.responses import JSONResponse

from passlib.context import CryptContext

from typing_extensions import Annotated
from ailabtools.connection_pool_postgresql import ConnectionPoolPostgreSql
from ..database import Database, get_db
import psycopg2
from typing import List, Dict, DefaultDict


# sau nay se bo vao connection pool -> tim hieu them ve thread async

config = {
    "host": "localhost",
    # "port": 8210,
    # "host": "postgres-db-asr-label",
    "user": "postgres",
    "password": "postgres",
    "port": 5432,
    "database": "asr_label_log",   
}
db = Database(**config)
router = APIRouter()

@router.get("/")
def getList(
    sort: str = Query(default=None), 
    range: str = Query(default=None), 
    filter: str = Query(default=None),
):
    data = []
    _content_range = f"0-10/404"

    query = f'''
        SELECT COUNT(*) AS table_length
        FROM "users"
    '''
    
    table_length = db.execute(query)
    if table_length:
        table_length = table_length[0][0]
        content_range = f"0-10/{table_length}"
        
    query = "SELECT id, username FROM users"
    if filter:
        filter = json.loads(filter)
        if filter != {}:
            filter_conditions = []
            for key, value in filter.items():
                if isinstance(value, list):
                    for v in value:
                        filter_conditions.append(f"{key} = '{v}'")
                else:
                    filter_conditions.append(f"{key} = '{value}'")
            query += f" WHERE {' AND '.join(filter_conditions)}"

    
    if sort:
        if isinstance(sort, str):
            sort = eval(sort)
        if len(sort) > 1:
            query += f" ORDER BY {sort[0]} {sort[1]}"
    
    if range:
        if isinstance(range, str):
            range = eval(range)
        query += f" LIMIT {range[1] - range[0] + 1} OFFSET {range[0]}"
        
        content_range = f"{range[0]}-{range[1]}/404"

    data = db.execute(query)
    
    if data and len(data) > 0:
        data = [{
            'id': d[0],
            'username': d[1],
        } for d in data]

        content_range_split = content_range.split("/")
        content_range = f"{content_range_split[0]}/{len(data)}"

        
    content = {
        "error_code": 0,
        "message": "add success",
        "data": data
    }
    
    response = JSONResponse(content=content)
    
    # get length in database
    
    response.headers["Content-Range"] = _content_range
    response.headers["Access-Control-Expose-Headers"] = "Content-Range"

    return response




@router.get("/{id}")
def getOne(id: int):
    
    data = {}
    try:
          
        query = f'''
            "SELECT id, username FROM users"
        '''
        data = db.execute(query)
        
        # parse data to key values
        data = [{
            'id': d[0],
            'username': d[1],
        } for d in data]        
        data = data[0]

    except Exception as e:        
        print("ERROR: ", e)

    content = {
        "error_code": 0,
        "message": "add success",
        "data": data
    }
    
    response = JSONResponse(content=content)
    return response
