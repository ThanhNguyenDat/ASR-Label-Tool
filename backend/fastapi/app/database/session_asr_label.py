from fastapi import Request
from app.database import utils
import requests
import json
import time

from ailabtools.connection_pool_postgresql import ConnectionPoolPostgreSql

from app.asr import utils as asr_utils


def get_cur_time():
    return int(time.time() * 1000)

HOSTNAME = 'localhost'
PORT = 5432
DATABASE = 'asr_label_log'
USERNAME = "postgres"
PASSWORD = "postgres"

db = ConnectionPoolPostgreSql(1, 1, HOSTNAME, PORT, USERNAME,
                              PASSWORD, DATABASE, keep_connection=True)

TABLE_NAME = 'asr_label'
TABLE_SEGMENTS = "asr_segments"

SELECT_COLUMNS = [
    'id',
    'seed',
    'label_url',
    'lb1',
    'exported',
]

COLUMNS_SEGMENTS = [
    "user_id", 
    "label_url", 
    "seed", 
    "index", 
    "length", 
    "text", 
    "audibility", 
    "noise", 
    "region", 
    "hard_level",
    "status",
    "predict_kaldi",
    "wer_kaldi",
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
    # print(
    #     f"parse: {s2 - s1}, query items: {s3 - s2}, query total: {s4 - s3} , reformat: {s5 - s4} ")
    
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
    string_update = utils.parse_query_data(body)
    sql = f"""
        UPDATE {TABLE_NAME}
        {string_update}
        WHERE id = %(id)s
    """
    db.executeUpdate(sql, {**body, "id": id})
    
    return id

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
            FROM asr_zalo_dev
            {string_filter}
        """
        res = db.executeUpdate(select_sql, {**filter_values})

        res_results = utils.tuple_result_2_dict_result(SELECT_COLUMNS, res)
        return res_results
    return []


def export_more_segments():
    list_seed = []
    
    sql = f"""
        SELECT {','.join(SELECT_COLUMNS)}
        FROM {TABLE_NAME}
        WHERE (lb1 IS NOT NULL AND lb1 <> '')
            AND (exported <> %(exported)s OR %(exported)s IS DISTINCT FROM 'exported')
            AND lb1 LIKE %(lb1_pattern)s -- check type json
        ORDER BY id ASC
        -- OFFSET 100
        LIMIT 100
    """
    params = {'exported': 'exported', 'lb1_pattern': '%{"%"}%'}
    results = db.executeUpdate(sql, {**params})
    
    if not results:
        return []
    
    res_results = utils.tuple_result_2_dict_result(SELECT_COLUMNS, results)

    
    list_values, list_seed = asr_utils.parse_values(res_results, COLUMNS_SEGMENTS)
    
    # update to segments table
    # delete with seed
    sql = f'''
        DELETE FROM {TABLE_SEGMENTS} WHERE seed IN %s
    '''
    db.executeUpdate(sql, (tuple(list_seed),))

    for v in list_values:
        print(v)

    # insert new value
    sql = f"""
        INSERT INTO {TABLE_SEGMENTS} 
        ( {', '.join(COLUMNS_SEGMENTS)} )

        VALUES  {', '.join(['%s'] * len(list_values))}
    """
    res_insert = db.executeUpdate(sql, list_values)
    print("RES: ", res_insert)
    # update status exported of asr_label (big table)
    sql = f"""
        UPDATE {TABLE_NAME}
        SET exported = 'exported'
        WHERE id IN %s
    """
    db.executeUpdate(sql, (tuple(list_seed),))
    
    return list_values

    list_seed = []
    
    sql = f"""
        SELECT {','.join(SELECT_COLUMNS)}
        FROM {TABLE_NAME}
        
        WHERE (lb1 IS NOT NULL AND lb1 <> '')
        AND (exported <> %(exported)s OR %(exported)s IS DISTINCT FROM 'exported')
        AND lb1 LIKE %(lb1_pattern)s -- check type json

        ORDER BY id ASC
        LIMIT 5
    """
    params = {'exported': 'exported', 'lb1_pattern': '%{"%"}%'}
    results = db.executeUpdate(sql, {**params})
    print(results)

    if not results:
        return []

    res_results = utils.tuple_result_2_dict_result(SELECT_COLUMNS, results)
    res_results = res_results[:5]

    # Optimize here
    list_values, list_seed = asr_utils.parse_values(res_results, list_seed)
    
    # update to segments table
    # delete with seed
    sql = f'''
        DELETE FROM {TABLE_SEGMENTS} WHERE seed IN %(seed)s
    '''
    db.executeUpdate(sql, {'seed': tuple(list_seed)})
    print("delete success")
    # hardcode -> khong make sure duoc la column name and value matching
    # insert new value
    values_insert = tuple([f"%({k})s" for k in COLUMNS_INSERT_SEGMENTS])
    
    sql = f"""
        INSERT INTO {TABLE_SEGMENTS} 
        ({' , '.join(COLUMNS_INSERT_SEGMENTS)})

        VALUES %s
    """
    values = " , ".join(list_values)
    # print(values)
    # db.executeUpdate(sql, {"values": values})
    db.executeUpdate(sql, values)
    print('insert success')
    # update status exported of asr_label (big table)
    sql = f"""
        UPDATE {TABLE_NAME}
        SET exported = 'exported'
        WHERE id IN %(seed)s
    """
    db.executeUpdate(sql, tuple(list_seed))

    return list_values