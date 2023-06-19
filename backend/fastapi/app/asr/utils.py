
import io
import requests
import json
from scipy.io import wavfile
from typing import List, Tuple
import jiwer

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

def calculate_wer(gt: str, pred: str):
    if not gt and not pred:
        return None
    
    return jiwer.wer(gt, pred)

def parse_values(inputs, INSER_COLUMNS: List or Tuple = []) -> Tuple[List[dict], List]:
    # returns: [List[Dict], List[int]]   
    list_values = []
    list_seed = []
    for row in inputs:
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

            index, length, text = 0, 0, ""
            
            audibility, noise, region = None, None, None

            predict_kaldi, wer_kaldi = None, None
            predict_wenet, wer_wenet = None, None

            hard_level = 1
            
            if 'content' in d:
                content = d['content']

                if 'tag' in content:
                    tag = content['tag']
                    index = tag.get('index', "")
                    length = tag.get('length', "")
                    text = tag.get('text', "")
                    
                    try:
                        input_file = row['label_url']
                        data = cut_audio(input_file, start_time=int(index), length=int(length))
                        
                        label_url = create_link_by_file(data)

                        if not isinstance(label_url, str):
                            label_url = "ERROR"

                    except Exception as e:
                        print("ERROR: ", e)
                        label_url = "ERROR"

                if 'extras' in content:
                    extras = content['extras']
                    classify = extras.get('classify', {})
                    
                    audibility = classify.get('audibility', "")
                    noise = classify.get('noise', "")
                    region = classify.get('region', "")
                    hard_level = extras.get('hard_level', hard_level)

                    predict_kaldi = classify.get("predict_kaldi", "")
                    if predict_kaldi:
                        wer_kaldi = classify.get("wer_kaldi", calculate_wer(text, predict_kaldi))
                    predict_wenet = classify.get("predict_wenet", "")
                    if predict_wenet:
                        wer_wenet = classify.get("wer_wenet", calculate_wer(text, predict_wenet))
                
            print("url: ", label_url)
            dict_value = {
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
                "predict_kaldi": predict_kaldi,
                "wer_kaldi": wer_kaldi,
                "predict_wenet": predict_wenet,
                "wer_wenet": wer_wenet,
            }


            values = []
            for column in INSER_COLUMNS:
                # if column in dict_value and dict_value[column] is None:
                #     dict_value[column] = ""
                v = dict_value.get(column, None)
                values.append(v)
            
            list_values.append(tuple(values))
    
    
    return list_values, list_seed