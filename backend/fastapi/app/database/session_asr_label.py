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
                              PASSWORD, DATABASE, keep_connection=True, print_log=True)

TABLE_NAME = 'asr_label'
TABLE_SEGMENTS = "asr_segments"

SELECT_COLUMNS = [
    'id',
    'seed',
    'label_url',
    'lb1',
    'exported',
]

COLUMNS_INSERT_SEGMENTS = [
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
    "status"
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
    print("sql: ", sql)
    print("res_results: ", res_results)
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
    # print("set_values: ", set_values)

    sql = f"""
        UPDATE {TABLE_NAME}
        {set_values}
        WHERE id = {id}
    """
    db.executeUpdate(sql)
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

def exportMoreSegments():
    list_seed = []
    
    sql = f"""
        SELECT {','.join(SELECT_COLUMNS)}
        FROM {TABLE_NAME}
        
        WHERE (lb1 IS NOT NULL AND lb1 <> '')
        AND (exported <> %(exported)s OR %(exported)s IS DISTINCT FROM 'exported')
        AND lb1 LIKE %(lb1_pattern)s -- check type json

        ORDER BY id ASC
        LIMIT 100
    """
    params = {'exported': 'exported', 'lb1_pattern': '%{"%"}%'}
    results = db.executeUpdate(sql, {**params})
    if not results:
        return []
    
    res_results = utils.tuple_result_2_dict_result(SELECT_COLUMNS, results)
    

    user_id = ''
    content = {}
    extras = {}
    seed = ''
    list_values = []
    list_seed = []
    label_url = "ERROR"

    for index, row in enumerate(res_results):
        # print("index: ", 1)
        lb1 = row['lb1']
        
        if not isinstance(lb1, str) or lb1 == 'EMPTY' or len(lb1) == 0:
            continue
        json_lb1 = json.loads(lb1)
        data = json_lb1['data']
        
        for d in data:
            label_url = "ERROR"
            
            user_id = d['user_id']
            seed = d['seed']
            list_seed.append(seed)

            index, length, text = "", "", ""
            audibility, noise, region = "", "", ""
            hard_level = 1
            
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
                    
                    try:
                        input_file = row['label_url']
                        # print("INPUT FILE: ", input_file)
                        data = asr_utils.cut_audio(input_file, 
                        start_time=int(index), length=int(length))
                        
                        # create link
                        label_url = asr_utils.create_link_by_file(data)
                        
                    except Exception as e:
                        print("ERROR: ", e)
                        label_url = "ERROR"

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
            tupple_child = (user_id, label_url, seed, index, length, text, audibility, noise, region, hard_level, "to_review")
            
            list_values.append(tupple_child)
    # list_values = list_values[:10]
    
    list_values = [str(value).replace("None", "ERROR") for value in list_values]
    
    # update to segments table
    # delete with seed
    sql = f'''
        DELETE FROM {TABLE_SEGMENTS} WHERE seed IN {tuple(list_seed)}
    '''
    db.execute(sql)
    
    # insert new value
    sql = f"""
        INSERT INTO {TABLE_SEGMENTS} (user_id, label_url, seed, index, length, text, audibility, noise, region, hard_level, status)
        VALUES {', '.join(list_values)}
    """
    # print("insert sql: ", sql)
    db.execute(sql, list_values)
    
    # update status exported of asr_label (big table)
    sql = f"""
        UPDATE {TABLE_NAME}
        SET exported = 'exported'
        WHERE id IN {tuple(list_seed)}
    """
    db.execute(sql)
    

    return list_values

def exportMoreSegmentsNew():
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