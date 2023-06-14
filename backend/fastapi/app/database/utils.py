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
                # # DanhVT code
                filter_conditions = []
                d_condition = json.loads(d_query[k])
                for cond_name, cond_value in d_condition.items():
                    if isinstance(cond_value, list) or isinstance(cond_value, tuple):
                        # if cond_name == 'ids':
                        filter_conditions.append(f" {cond_name} in %({cond_name})s ")
                        filter_values[cond_name] = tuple(cond_value)
                    else:
                        filter_conditions.append(f" {cond_name} = %({cond_name})s ")
                        filter_values[cond_name] = cond_value
                if filter_conditions: # prevent case filter={}
                    string_filter = ' WHERE '
                    string_filter += " AND ".join(filter_conditions)

                # # ThanhND13 Code
                # filter_conditions = []
                # # Biến trung gian
                # previous_key = None
                # current_operator = "AND"

                # d_condition = json.loads(d_query[k])
                # # Xây dựng câu truy vấn từ từ điển
                # for cond_name, cond_value in d_condition.items():
                #     if previous_key is None or previous_key == cond_name:
                #         current_operator = "AND"
                #     else:
                #         current_operator = "OR"
                    
                    
                #     if isinstance(cond_value, list) or isinstance(cond_value, tuple):
                #         # Đối với các trường có giá trị là danh sách, tạo điều kiện OR cho các giá trị trong danh sách
                #         filter_conditions.append(f" {cond_name} IN %({cond_name})s ")
                #         filter_values[cond_name] = tuple(cond_value)
                #     else:
                #         # Đối với các trường có giá trị là một giá trị duy nhất, tạo điều kiện bình thường
                #         filter_conditions.append(f" {cond_name} = %({cond_name})s ")
                #         filter_values[cond_name] = cond_value

                #     filter_conditions[-1] = f"({filter_conditions[-1]})"
                #     filter_conditions[-1] = f"{current_operator} {filter_conditions[-1]}"

                #     previous_key = cond_name
                # if filter_conditions:
                #     string_filter = " WHERE " + " ".join(filter_conditions)
                
            if k == 'range':
                # offset, limit = json.loads(d_query[k])
                range_start, range_end = json.loads(d_query[k])
                limit = range_end - range_start + 1
                string_offset_limit = f' LIMIT {min(limit, MAX_LIMIT)} OFFSET {range_start} '
    return string_filter, filter_values, string_sort, string_offset_limit
    # return where_condition, order_cond, min(limit , MAX_LIMIT), offset

def parse_body_values(body):
    if isinstance(body, Request):
        d_query = dict(body.query_params)
    elif isinstance(body, dict):
        d_query = body
    # print('data_update: ', d_query)

    multi_data_update = []
    values_to_update = ""
    if d_query:
        for key, value in d_query.items():
            key_value = f"{key}='{value}'"
            multi_data_update.append(key_value)
        values_to_update = " , ".join(multi_data_update)
        values_to_update = "SET " + values_to_update
    return values_to_update

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


