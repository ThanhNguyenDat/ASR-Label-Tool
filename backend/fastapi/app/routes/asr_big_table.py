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

    sql = f"""
        SELECT {','.join(column_names)}
        FROM {TABLE_NAME}
        {string_filter}
        {string_sort}
        {string_offset_limit}
    """

    # results = db.executeUpdate(sql, {**filter_values})
    results = db.execute(sql, {**filter_values})
    res_results = utils.tuple_result_2_dict_result(column_names, results)
    for index, row in enumerate(res_results):
        lb1 = str(row['lb1'])

    return res_results

