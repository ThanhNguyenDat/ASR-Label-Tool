
import io
import requests
import json
from scipy.io import wavfile
from typing import List, Tuple

session_request = requests.session()


def create_link_by_file(data):
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

def tuple_result_2_dict_result(select_colums, results):
    res_results = []
    
    for result in results:
        assert len(select_colums) == len(result)
        row_dict = {}
        for idx, col_name in enumerate(select_colums):
            row_dict[col_name] = result[idx]
        res_results.append(row_dict)
    
    return res_results

def parse_values(data, list_seed: List, INSER_COLUMNS: List or Tuple = []) -> Tuple[List[dict], List]:
    # returns: [List[Dict], List[int]]

    if bool(INSER_COLUMNS):
        return []
    
    user_id = ''
    seed = ''
    label_url = ''

    content = {}
    extras = {}
    return_values = []
    
    for index, row in enumerate(data):
        lb1 = row['lb1']
        
        if not isinstance(lb1, str) or lb1 == 'EMPTY' or len(lb1) == 0:
            continue

        json_lb1 = json.loads(lb1)
        data = json_lb1['data']
        if not data:
            continue

        for d in data:
            label_url = ''
            
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
                        
                        data = cut_audio(input_file, 
                        start_time=int(index), length=int(length))
                        
                        # create link
                        label_url = create_link_by_file(data)
                        
                    except Exception as e:
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

            dict_child = {
                "user_id": user_id, 
                "label_url": label_url, 
                "seed": seed, 
                "index": index, 
                "length": length, 
                "text": text, 
                "audibility": audibility, 
                "noise": noise, 
                "region": region, 
                "hard_level": hard_level,
                "status": "to_review",
            }

            # parse columns
            dict_values = {}
            for column_name in INSER_COLUMNS:
                if column_name in dict_child.keys():
                    dict_values[column_name] = dict_child[column_name]
                else:
                    dict_values[column_name] = ""

            return_values.append(dict_values)
    

    return return_values, list_seed