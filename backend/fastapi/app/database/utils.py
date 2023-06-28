from fastapi import Request
# from typing import Annotated
import json

MAX_LIMIT = 200

# def parse_lb1(lb1: Annotated(str, dict)):
#     if isinstance(lb1, str):
#         lb1 = json.loads(lb1)
    
#     if not bool(lb1):
#         return {}
    
#     list_content = lb1['data']
#     if len(list_content) == 0:
#         return {}
    
#     class_id = list_content[0].get("class_id", None)
#     class_name = list_content[0].get("class_name", None)
#     seed = list_content[0].get('seed', None)
#     contents = [content.get("content") for content in list_content]
    
#     return {
#         "class_id": class_id,
#         "class_name": class_name,
#         "seed": seed,
#         "contents": contents,
#     }

def parse_req_2_json(req: Request):
    if isinstance(req, Request):
        d_query = dict(req.query_params)
        # d_query = dict(req.query_form)
    elif isinstance(req, dict):
        d_query = req
    return d_query

def parse_query_params(req: Request, columns = []):
    if isinstance(req, Request):
        d_query = dict(req.query_params)
    elif isinstance(req, dict):
        d_query = req
    print('d_query ', d_query)

    string_filter = ''
    filter_values = {}
    string_sort = ''
    string_offset_limit =  f' LIMIT 25 OFFSET 0 '

    if d_query:
        for k, v in d_query.items():
            if k == 'sort':
                string_sort = f''' ORDER BY '''
                list_sort_item = json.loads(d_query[k])
                print("sort: ", list_sort_item)
                for i in range(0, len(list_sort_item), 2):
                    string_sort += f' {list_sort_item[i]} {list_sort_item[i+1]} '
                    if i < len(list_sort_item) - 2:
                        string_sort += ','

            if k == 'filter':
                filter_conditions = []
                d_conditions = json.loads(d_query[k])
                cond_name_value = None

                for d_condition in d_conditions:
                    # for cond_name, cond_value in d_condition.items():
                    #     if cond_name == 'q':
                    #         continue
                        
                    #     if isinstance(cond_value, list) or isinstance(cond_value, tuple):
                    #         # if cond_name == 'ids':
                    #         filter_conditions.append(f" {cond_name} in %({cond_name})s ")
                    #         filter_values[cond_name] = tuple(cond_value)
                    #     else:
                    #         filter_conditions.append(f" {cond_name} = %({cond_name})s ")
                    #         filter_values[cond_name] = cond_value
                    # if filter_conditions: # prevent case filter={}
                    #     string_filter = ' WHERE '
                    #     string_filter += " AND ".join(filter_conditions)
                    
                    cond_name = d_condition['field']
                    cond_operator = d_condition['operator']
                    # check operator and adap value 
                    cond_value = d_condition['value']

                    if cond_name_value in filter_values:
                        cond_name_value = cond_name_value + "_1"
                    else:
                        cond_name_value = cond_name
                        
                    try:
                        cond_value = eval(cond_value)
                        if isinstance(cond_value, list) or isinstance(cond_value, tuple):
                            cond_value = tuple(cond_value)
                    except Exception as e:
                        cond_value = str(cond_value)

                    like_operators =  ['like', 'notLike', 'startsWith', 'endsWith' 'contain']
                    
                    if str(cond_operator).lower() in like_operators or cond_operator == 'contain':
                        if 'LIKE' in cond_operator:
                            cond_value = f"%{cond_value}"
                        if "startsWith" in cond_operator:
                            cond_value = f"{cond_value}%"
                        if "endsWith" in cond_operator:
                            cond_value = f"%{cond_value}"
                        if "contain" in cond_operator:
                            cond_value = f"%{cond_value}%"
                        
                        cond_operator = "LIKE"
                        filter_conditions.append(f" {cond_name}::text {cond_operator} %({cond_name_value})s")
                    else:
                        filter_conditions.append(f" {cond_name} {cond_operator} %({cond_name_value})s")


                    filter_values[cond_name_value] = cond_value
                if filter_conditions: # prevent case filter={}
                    string_filter = ' WHERE '
                    string_filter += " AND ".join(filter_conditions)

            if k == 'range':
                # offset, limit = json.loads(d_query[k])
                range_start, range_end = json.loads(d_query[k])
                limit = range_end - range_start + 1

                # string_offset_limit = f' LIMIT {min(limit, MAX_LIMIT)} OFFSET {range_start} '
                string_offset_limit = f' LIMIT {limit} OFFSET {range_start} '
    print('string_filter: ', string_filter)
    print('filter_values: ', filter_values)
    return string_filter, filter_values, string_sort, string_offset_limit
    # return where_condition, order_cond, min(limit , MAX_LIMIT), offset

def parse_update_params(data: dict):
    return ", ".join(f"{key} = %s" for key in data.keys())

def parse_create_params(data: dict):
    column_name = ', '.join(data.keys())
    symbol = ', '.join(['%s'] * len(data.keys()))
    return f"({column_name}) VALUES ({symbol})"

def tuple_result_2_dict_result(select_colums, results):
    res_results = []
    
    for result in results:
        assert len(select_colums) == len(result)
        row_dict = {}
        for idx, col_name in enumerate(select_colums):
            row_dict[col_name] = result[idx]
        res_results.append(row_dict)
    
    return res_results

def dict_result_2_tuple_result(select_columns, results, default_value=""):
    res_results = []
    for value in results:
        ress = []
        for column in select_columns:
            v = value.get(column, default_value)
            ress.append(v)
        res_results.append(ress)
    return res_results

def parse_query_data(req: Request):
    d_query = parse_req_2_json(req)

    string_update = ""
    update_conditions = []
    for cond_name, cond_value in d_query.items():
        update_conditions.append(f" {cond_name} = %({cond_name})s ")
        
    if update_conditions: # prevent case filter={}
        string_update = ' SET '
        string_update += " , ".join(update_conditions)

    return string_update