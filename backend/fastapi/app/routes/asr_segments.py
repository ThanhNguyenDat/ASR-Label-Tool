from datetime import timedelta
import json
import requests

from fastapi import Depends, APIRouter, Request, Query, Response, HTTPException, status
from fastapi.responses import JSONResponse

from passlib.context import CryptContext

from typing_extensions import Annotated
from ..database import Database
import psycopg2
import jiwer
from app.routes import utils

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

SELECT_COLUMNS = [
    "id",
    "label_url",
    "seed",
    "index",
    "length",
    "text",
    "audibility",
    "noise",
    "region",
    "text_kaldi",
    "wer_kaldi",
    "text_wenet",
    "wer_wenet",
    "user_id",
    "status",
]

TABLE_NAME = "segments"



# @router.get("/")
# async def getList(
#     sort: str = Query(default=None), 
#     range: str = Query(default=None), 
#     filter: str = Query(default=None),
#     # request: Request
# ):
#     # call api or read database here
#     data = []
    
#     try:
#         query = f'''
#             SELECT rt.id AS id, 
#             rt.label_url AS label_url, 
#             rt.seed AS seed, 
#             rt.index AS index, 
#             rt.length AS length, 
#             rt.text AS text, 
#             rt.audibility AS audibility, 
#             rt.noise AS noise, 
#             rt.region AS region,
#             rt.text_kaldi as text_kaldi,
#             rt.wer_kaldi as wer_kaldi,
#             rt.text_wenet as text_wenet,
#             rt.wer_wenet as wer_wenet,
#             rt.user_id as user_id,
#             rt.status as status
            
#             FROM segments AS rt
#         '''
#         if filter:
#             filter = json.loads(filter)
            
#             if filter != {}:
#                 filter_conditions = []
#                 # Xây dựng câu truy vấn từ từ điển
#                 for key, values in filter.items():
#                     if isinstance(values, list) and key != 'status':
#                         # Đối với các trường có giá trị là danh sách, tạo điều kiện OR cho các giá trị trong danh sách
#                         or_conditions = [f"{key}='{value}'" for value in values]
#                         condition = f"({' OR '.join(or_conditions)})"

#                         filter_conditions.append(condition)
#                     else:
#                         # Đối với các trường có giá trị là một giá trị duy nhất, tạo điều kiện bình thường
#                         condition = f"{key}='{values}'"
#                         filter_conditions.append(condition)

#                 # Xây dựng câu truy vấn cuối cùng
#                 # query = "SELECT * FROM asr WHERE " + " OR ".join(filter_conditions)
#                 query_count = f'''
#                     SELECT COUNT(*) FROM segments WHERE { ' AND '.join(filter_conditions)}
#                 '''

#                 query += f" WHERE {' AND '.join(filter_conditions)}"

#                 if ("status='to_review'" in query):
#                     query = query.replace("status='to_review'", "(status='to_review' OR status IS NULL)")

#                     query_count = query_count.replace("status='to_review'", "(status='to_review' or status IS NULL)")
        
#         data = db.execute(query_count)
#         if data:
#             table_len = data[0][0]
#         else:
#             table_len = 0
        
        
        
#         if sort:
#             if isinstance(sort, str):
#                 sort = eval(sort)
#             if len(sort) > 1:        
#                 query += f" ORDER BY {sort[0]} {sort[1]}"
                

#         if range:
#             if isinstance(range, str):
#                 range = eval(range)
#             query += f" LIMIT {range[1] - range[0] + 1} OFFSET {range[0]}"
            
#         res = db.execute(query)
#         # parse data to key values
#         data = []
#         for d in res:
#             per_res = {
#                 "id": d[0],
#                 "label_url": d[1],
#                 "seed": d[2],
#                 "index": d[3],
#                 "length": d[4],
#                 "text": d[5],
#                 "audibility": d[6],
#                 "noise": d[7],
#                 "region": d[8],
#                 "text_kaldi": d[9],
#                 "wer_kaldi": d[10],
#                 "text_wenet": d[11],
#                 "wer_wenet": d[12],
#                 "user_id": d[13],
#                 "status": d[14],
#             }

#             if not bool(per_res['wer_kaldi']) and bool(per_res['text_kaldi']):
#                 wer =  jiwer.wer(str(per_res['text']), str([per_res['text_kaldi']]))
#                 per_res['wer_kaldi'] = wer
#                 if False:
#                     db.execute('''
                        
#                     ''')
#             if not bool(per_res['wer_wenet']) and bool(per_res['text_wenet']):
#                 wer =  jiwer.wer(str(per_res['text']), str([per_res['text_wenet']]))
#                 per_res['wer_wenet'] = wer
            
#             data.append(per_res)

#     except Exception as e:        
#         print("ERROR: ", e)
#     print(data)
#     content = {
#         "error_code": 0,
#         "message": "success",
#         "data": data,
#         "total": table_len
#     }
    
#     response = JSONResponse(content=content)
    
#     return response

# @router.get("/{id}")
# def getOne(id: int):
    
#     data = None
#     try:
          
#         query = f'''
#             SELECT rt.id AS id, 
#             rt.label_url AS label_url, 
#             rt.seed AS seed, 
#             rt.index AS index, 
#             rt.length AS length, 
#             rt.text AS text, 
#             rt.audibility AS audibility, 
#             rt.noise AS noise, 
#             rt.region AS region,
#             rt.text_kaldi as text_kaldi,
#             rt.wer_kaldi as wer_kaldi,
#             rt.text_wenet as text_wenet,
#             rt.wer_wenet as wer_wenet,
#             rt.user_id as user_id

#             FROM segments AS rt
#         '''
#         data = db.execute(query)
        
#         # parse data to key values
#         data = [{
#             "id": d[0],
#             "label_url": d[1],
#             "seed": d[2],
#             "index": d[3],
#             "length": d[4],
#             "text": d[5],
#             "audibility": d[6],
#             "noise": d[7],
#             "region": d[8],
#             "text_kaldi": d[9],
#             "wer_kaldi": d[10],
#             "text_wenet": d[11],
#             "wer_wenet": d[12],
#             "user_id": d[13],
#         } for d in data]
#         data = data[0]

#     except Exception as e:        
#         print("ERROR: ", e)


#     content = {
#         "error_code": 0,
#         "message": "success",
#         "data": data
#     }
    
#     response = JSONResponse(content=content)
#     return response

@router.get("/")
def getList(req: Request):
    string_filter, filter_values, string_sort, string_offset_limit = utils.parse_query_params(req)

    sql = f"""
        SELECT {','.join(SELECT_COLUMNS)}
        FROM {TABLE_NAME}
        {string_filter}
        {string_sort}
        {string_offset_limit}
    """

    sql_count = f"""
        SELECT count(*) 
        FROM {TABLE_NAME}
        {string_filter}
    """

    results = db.execute(sql, {**filter_values})
    
    results_total = db.execute(sql_count, {**filter_values})
    
    res_results = utils.tuple_result_2_dict_result(SELECT_COLUMNS, results)
    
    content = {
        "error_code": 0,
        "message": "success",
        "data": res_results,
        "total": results_total[0][0]
    }
    
    response = JSONResponse(content=content)
    return response

@router.get("/{id}")
def getOne(id: int):
    sql = f'''
        SELECT {','.join(SELECT_COLUMNS)}
        FROM {TABLE_NAME}
        WHERE id={id}
    '''
    print(sql)
    results = db.execute(sql)

    res_results = utils.tuple_result_2_dict_result(SELECT_COLUMNS, results)

    content = {
        "error_code": 0,
        "message": "success",
        "data": res_results[0]
    }
    
    response = JSONResponse(content=content)
    return response


@router.put("/{id}")
def update(id: int, body: dict):
    print("update")
    if not body:
        return JSONResponse({
            "error_code": 1,
            "message": "success",
            "data": None
        })
    
    if body != {}:
        data_to_update = []
        # Xây dựng câu truy vấn từ từ điển
        for key, value in body.items():
            key_value = f"{key}='{value}'"
            data_to_update.append(key_value)
        data_to_update = " , ".join(data_to_update)

        query = f'''
            UPDATE "segments"
            SET {data_to_update}
            WHERE id = {id}
            ;
        '''
        print(query)

        data = db.execute(query)
        print("data updated: ", data)
        content = {
            "error_code": 0,
            "message": "success",
            "data": id
        }
        
        response = JSONResponse(content=content)
        return response

@router.post("/")
def create():
    pass

@router.delete("/{user_id}")
def deleteOne(user_id: int):
    pass