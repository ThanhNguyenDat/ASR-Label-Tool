from fastapi import Request
import json

MAX_LIMIT = 200

# def parse_query_params(d_query):
def parse_query_params(req: Request):
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
                for i in range(0, len(list_sort_item), 2):
                    string_sort += f' {list_sort_item[i]} {list_sort_item[i+1]} '
                    if i < len(list_sort_item) - 2:
                        string_sort += ','

            if k == 'filter':
                filter_conditions = []
                d_condition = json.loads(d_query[k])
                for cond_name, cond_value in d_condition.items():
                    if isinstance(cond_value, list) or isinstance(cond_value, tuple):
                        if cond_name == 'ids':
                            filter_conditions.append(" id in %(ids)s ")
                            filter_values[cond_name] = tuple(cond_value)
                    else:
                        filter_conditions.append(f" {cond_name} = %({cond_name})s ")
                        filter_values[cond_name] = cond_value
                if filter_conditions: # prevent case filter={}
                    string_filter = ' where '
                    string_filter += " AND ".join(filter_conditions)
            
            if k == 'range':
                # offset, limit = json.loads(d_query[k])
                range_start, range_end = json.loads(d_query[k])
                limit = range_end - range_start + 1
                string_offset_limit = f' LIMIT {min(limit, MAX_LIMIT)} OFFSET {range_start} '
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
