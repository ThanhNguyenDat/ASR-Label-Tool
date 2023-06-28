import os
import time

from fastapi import Request
from ailabtools.connection_pool_postgresql import ConnectionPoolPostgreSql

from app.database import utils

def get_cur_time():
    return int(time.time() * 1000)

HOSTNAME = 'localhost'
PORT = 5432
DATABASE = 'asr_label_log'
USERNAME = "postgres"
PASSWORD = "postgres"
db = ConnectionPoolPostgreSql(1, 1, HOSTNAME, PORT, USERNAME,
                              PASSWORD, DATABASE, keep_connection=True, print_log=True)


TABLE_NAME = 'asr_benchmark'


SELECT_COLUMNS = [
    "id",
    "seed" ,
    "label_url" , 

    "full_text" ,
    "predict_google" ,
    "google_text_type",
    "wer_google" ,
    "predict_kaldi" ,
    "wer_kaldi" ,
    "predict_wenet" ,
    "wer_wenet",
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
    print("SQL: ", sql)
    results = db.executeUpdate(sql, {**filter_values})
    # print("results: ", results)
    s3 = get_cur_time()

    results_total = db.executeUpdate(sql_count, {**filter_values})
    s4 = get_cur_time()

    res_results = utils.tuple_result_2_dict_result(SELECT_COLUMNS, results)
    
    # # hardcode
    # for res in res_results:
    #     if not res['status']:
    #         res['status'] = 'to_review'
    
    s5 = get_cur_time()
    print(
        f"parse: {s2 - s1}, query items: {s3 - s2}, query total: {s4 - s3} , reformat: {s5 - s4} ")
    return res_results, results_total[0][0]

def get_column_names(req: Request):
    return SELECT_COLUMNS

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
