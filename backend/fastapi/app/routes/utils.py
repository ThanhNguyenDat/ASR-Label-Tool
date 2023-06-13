from fastapi import Request
import requests
import json
import io
import time

session_request = requests.session()

MAX_LIMIT = 200

def get_current_time():
    return time.time() * 1000

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
                # filter_conditions = []
                # d_condition = json.loads(d_query[k])
                # for cond_name, cond_value in d_condition.items():
                #     if isinstance(cond_value, list) or isinstance(cond_value, tuple):
                #         if cond_name == 'ids':
                #             filter_conditions.append(" id in %(ids)s ")
                #             filter_values[cond_name] = tuple(cond_value)
                #     else:
                #         filter_conditions.append(f" {cond_name} = %({cond_name})s ")
                #         filter_values[cond_name] = cond_value
                # if filter_conditions: # prevent case filter={}
                #     string_filter = ' where '
                #     string_filter += " AND ".join(filter_conditions)
                
                filter_conditions = []
                d_condition = json.loads(d_query[k])
                # Xây dựng câu truy vấn từ từ điển
                for cond_name, cond_value in d_condition.items():
                    if isinstance(cond_value, list) and cond_name != 'status':
                        # Đối với các trường có giá trị là danh sách, tạo điều kiện OR cho các giá trị trong danh sách
                        or_conditions = [f"{cond_name}='{value}'" for value in cond_value]
                        condition = f"({' OR '.join(or_conditions)})"

                        filter_conditions.append(condition)
                    else:
                        # Đối với các trường có giá trị là một giá trị duy nhất, tạo điều kiện bình thường
                        condition = f"{cond_name}='{cond_value}'"
                        filter_conditions.append(condition)
                
                string_filter += f" WHERE {' AND '.join(filter_conditions)}"
                
                # hard code
                if ("status='to_review'" in string_filter):
                    string_filter = string_filter.replace("status='to_review'", "(status='to_review' OR status IS NULL)")

            
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


def createLinkByFile(data):
    url = "https://api.zalo.ai/v1/create_async_public/create_link_async?tail=wav"

    payload = {}

    files=[
        ('img_file',('tmp.wav', data, 'audio/wav'))
    ]
    headers = {
        'apikey': 'QWDITwI6sHTdt3WiGh2VLFbTDLJLHVjb'
    }

    response = session_request.request("POST", url, headers=headers, data=payload, files=files)

    #{"error_message":"Successful.","error_code":0,"data":"https://api.zalo.ai/ailab_video/2023/06/12/0248a122-7e3b-4c3b-b9a8-5c97edd10a0c1686560863791789568.wav"}
    res = response.text
    res = json.loads(res)

    return res.get("data", "")

def cut_audio(input_file: str, start_time=0, length=0):

    # start_time, length: mili-second
    from scipy.io import wavfile
    
    if input_file.startswith("http"):
        
        response = session_request.get(input_file)
        if response.status_code != 200:
            return None
        audio_data = response.content
        
        # Đọc dữ liệu âm thanh từ bộ nhớ đệm
        sample_rate, data = wavfile.read(io.BytesIO(audio_data))

    else:
        # Đọc tệp âm thanh WAV
        sample_rate, data = wavfile.read(input_file)
    end_time = start_time + length

    start_time = start_time / 1000
    end_time = end_time / 1000

    # Chuyển đổi thời gian từ giây sang mẫu âm thanh
    start_sample = int(start_time * sample_rate)
    end_sample = int(end_time * sample_rate)

    # Cắt audio
    cut_data = data[start_sample:end_sample]
    
    # # Ghi audio cắt vào tệp mới
    # wavfile.write(output_file, sample_rate, cut_data)
    # return cut_data
    with io.BytesIO() as f:
        wavfile.write(f, sample_rate, cut_data)
        f.seek(0)
        byte_data = f.read()

    return byte_data
