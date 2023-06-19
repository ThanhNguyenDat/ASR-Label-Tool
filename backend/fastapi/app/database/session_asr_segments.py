import os

from fastapi import Request, Form
from app.database import utils
from app.asr import utils as asr_utils

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

TABLE_NAME = 'asr_segments'
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
    "predict_kaldi",
    "wer_kaldi",
    "predict_wenet",
    "wer_wenet",
    "user_id",
    "status",
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

    print("sql: ", sql)
    print(filter_values)

    results = db.executeUpdate(sql, {**filter_values})
    print("results: ", results)
    s3 = get_cur_time()

    results_total = db.executeUpdate(sql_count, {**filter_values})
    s4 = get_cur_time()

    res_results = utils.tuple_result_2_dict_result(SELECT_COLUMNS, results)
    
    # hardcode
    for res in res_results:
        if not res['status']:
            res['status'] = 'to_review'
    
    s5 = get_cur_time()
    print(
        f"parse: {s2 - s1}, query items: {s3 - s2}, query total: {s4 - s3} , reformat: {s5 - s4} ")
    return res_results, results_total[0][0]


def update_predict(**kwargs):
    
    d_query = utils.parse_req_2_json(kwargs)
    # print("form: ", form)
    # print("form dict: ", dict(form))
    print('d_query ', d_query)
    id = d_query.get("id", None)
    if not id:        
        print("Not found id")
        return None

    # call api to 
    try:
        res = requests.post(os.environ['API_PREDICT'], 
            data={}, 
            headers={     
                'Content-Type': 'Application/json',
        })
        # update to database
        res = res.json()
        res = res.get("data")

    except Exception as erro:
        res = None
        print("error: ", erro)

    if not res:
        return None
    
    predict_kaldi = res.get("predict_kaldi", "")
    predict_wenet = res.get("predict_wenet", "")
    
    update_values = {
        "predict_kaldi": predict_kaldi,
        "predict_wenet": predict_wenet,
    }
    

    # string_update = ""
    # update_conditions = []
    # for cond_name, cond_value in update_values.items():
    #     update_conditions.append(f" {cond_name} = %({cond_name})s ")
        
    # if update_conditions: # prevent case filter={}
    #     string_update = ' SET '
    #     string_update += " , ".join(update_conditions)

    string_update = utils.parse_query_data(update_values)

    print("-"*60)
    print(update_values)
    print(string_update)


    sql = f"""
        UPDATE {TABLE_NAME}
        {string_update}
        WHERE id=%(id)s
    """
    db.executeUpdate(sql, {**update_values, "id": id})

    return res

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


def update_many(req: Request, data: dict):
    s1 = get_cur_time()
    string_filter, filter_values, string_sort, string_offset_limit = utils.parse_query_params(req)
    s2 = get_cur_time()
    
    if 'ids' in filter_values:
        sql = ''
        values = tuple()

        for id in filter_values['ids']:
            sql += f'''
                UPDATE {TABLE_NAME}
                SET {utils.parse_update_params(data)}
                WHERE id = %s;
            '''
            values += tuple(list(data.values()) + [id])

        update_res = db.executeUpdate(sql, values)

        select_sql = f"""
            SELECT {','.join(SELECT_COLUMNS)}
            FROM {TABLE_NAME}
            {string_filter}
        """
        res = db.executeUpdate(select_sql, {**filter_values})

        res_results = utils.tuple_result_2_dict_result(SELECT_COLUMNS, res)
        return res_results
    return []

def update(id: int, body: dict):
    string_update = utils.parse_query_data(body)
    
    sql = f"""
        UPDATE {TABLE_NAME}
        {string_update}
        WHERE id = %(id)s
    """
    db.executeUpdate(sql, {**body, "id": id})
    
    return id

