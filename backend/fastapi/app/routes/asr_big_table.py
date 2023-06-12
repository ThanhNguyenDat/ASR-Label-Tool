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

from ailabtools.connection_pool_postgresql import ConnectionPoolPostgreSql
import time
import app.routes.utils as utils

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


# HOSTNAME = 'localhost'
# PORT = 5432
# DATABASE = 'asr_label_log'
# USERNAME = "postgres"
# PASSWORD = "postgres"
# db = ConnectionPoolPostgreSql(1, 1, HOSTNAME, PORT, USERNAME,
#                               PASSWORD, DATABASE, keep_connection=True, print_log=True)




TABLE_NAME = "asr_label"
TABLE_SEGMENTS = "segments"

SELECT_COLUMNS = [
    'id',
    'label_url',
    'ds_name',
    'user_zalo_id',
    'status'
]

router = APIRouter()

@router.post("/")
def getList():
    pass

@router.get("/export_to_segments")
def exportToSegments(req: Request):
    column_names = ["label_url", "lb1"]
    string_filter, filter_values, string_sort, string_offset_limit = utils.parse_query_params(
    req)

    # only data with exported = NULL
    sql = f"""
        SELECT {','.join(column_names)}
        FROM {TABLE_NAME}
        WHERE exported is null
    """

    results = db.execute(sql)
    res_results = utils.tuple_result_2_dict_result(column_names, results)

    user_id = ''
    content = {}
    extras = {}
    seed = ''
    list_values = []
    list_seed = []

    for index, row in enumerate(res_results):
        lb1 = row['lb1']
        label_url = row['label_url']

        if not isinstance(lb1, str) or lb1 == 'EMPTY' or len(lb1) == 0:
            continue
        json_lb1 = json.loads(lb1)
        data = json_lb1['data']
        
        for d in data:
            user_id = d['user_id']
            seed = d['seed']
            list_seed.append(seed)

            index, length, text = None, None, None
            audibility, noise, region = None, None, None
            hard_level = None

            if 'content' in d.keys():
                content = d['content']
                if 'tag' in content.keys():
                    tag = content['tag']
                    
                    if 'index' in tag.keys():
                        index = tag['index']
                    if 'length' in tag.keys():
                        length = tag['length']
                    if 'text' in tag.keys():
                        text = tag['text']

                if 'extras' in content.keys():
                    extras = content['extras']
                    if 'classify' in extras:
                        classify = extras['classify']
                        if 'audibility' in classify.keys():
                            audibility = classify['audibility']
                            
                        if 'noise' in classify.keys():
                            noise = classify['noise']
                            
                        if 'region' in extras.keys():
                            region = classify['region']
                    if 'hard_level' in extras:
                        hard_level = extras['hard_level']
            tupple_child = (user_id, label_url, seed, index, length, text, audibility, noise, region, hard_level)
            
            list_values.append(tupple_child)
    list_values = list_values[:10]
    
    list_values = [str(value).replace("None", "NULL") for value in list_values]
    
    # update to segments table
    # delete with seed
    sql = f'''
        DELETE FROM segments WHERE seed IN {tuple(list_seed)}
    '''
    
    db.execute(sql, list_seed)
    
    # insert new value
    sql = f"""
        INSERT INTO segments (user_id, label_url, seed, index, length, text, audibility, noise, region, hard_level)
        VALUES {', '.join(list_values)}
    """
    print(sql)
    db.execute(sql, list_values)



    return list_values

