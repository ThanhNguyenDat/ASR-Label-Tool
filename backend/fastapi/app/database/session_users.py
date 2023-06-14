from fastapi import Request
from app.database import utils
import requests
import json

from ailabtools.connection_pool_postgresql import ConnectionPoolPostgreSql
import time

def get_cur_time():
    return int(time.time() * 1000)

HOSTNAME = 'localhost'
PORT = 5432
DATABASE = 'asr_label_log'
USERNAME = "postgres"
PASSWORD = "postgres"
db = ConnectionPoolPostgreSql(1, 1, HOSTNAME, PORT, USERNAME,
                              PASSWORD, DATABASE, keep_connection=True, print_log=True)

TABLE_NAME = 'users'
SELECT_COLUMNS = [
    "id",
    "uname",
]

def get_all(req: Request):
    s1 = get_cur_time()
    string_filter, filter_values, string_sort, string_offset_limit = utils.parse_query_params(
        req)
    s2 = get_cur_time()

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

    results = db.executeUpdate(sql, {**filter_values})
    s3 = get_cur_time()

    results_total = db.executeUpdate(sql_count, {**filter_values})
    s4 = get_cur_time()
    
    res_results = utils.tuple_result_2_dict_result(SELECT_COLUMNS, results)
    
    s5 = get_cur_time()
    print(
        f"parse: {s2 - s1}, query items: {s3 - s2}, query total: {s4 - s3} , reformat: {s5 - s4} ")
    return res_results, results_total[0][0]


def get_one(id: int, req: Request):
    sql = f"""
        SELECT {','.join(SELECT_COLUMNS)}
        FROM {TABLE_NAME}
        WHERE id={id}
    """

    results = db.executeUpdate(sql)

    res_results = utils.tuple_result_2_dict_result(SELECT_COLUMNS, results)
    
    # return object not array
    res_results = res_results[0]

    return res_results

def update(id: int, body: dict):
    set_values = utils.parse_body_values(body)

    sql = f"""
        UPDATE {TABLE_NAME}
        {set_values}
        WHERE id = {id}
    """

    db.executeUpdate(sql)


    return id