
import io
import json
import threading
import time
from typing import List, Tuple
import shutil

import numpy as np
import requests
import jiwer
from scipy.io import wavfile

from ailabtools.ailab_multiprocessing import pool_worker
import cachetools

session_request = requests.session()


def get_cur_time():
    return int(time.time() * 1000)


def create_link_by_data(data):
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

def download_audio(url):
    response = session_request.get(url, stream=True)
    if response.status_code != 200:
        return None
    audio_data = response.content
    return audio_data

def get_sample_rate_data(audio_data):
    sample_rate, data = wavfile.read(io.BytesIO(audio_data))
    return sample_rate, data

def cut_audio(sample_rate, data, start_time=0, length=0):
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

def process_row(row, INSER_COLUMNS, list_values, list_seed, time_get_link, time_cut_audio, time_create_link, lock):
    lb1 = row['lb1']
    input_file = row['label_url']
    if not input_file:
        return 
    
    if not isinstance(lb1, str) or lb1 == 'EMPTY' or len(lb1) == 0:
        return
    
    s0 = get_cur_time()
    audio_data = download_audio(input_file) # slow
    e0 = get_cur_time()
    s1 = get_cur_time()
    sample_rate, array_data = get_sample_rate_data(audio_data)
    e1 = get_cur_time()
    print("call request: ", (e0 - s0))
    print("get_sample_rate_data: ", (e1-s1))
    # get data in lb1 asr_label's column
    json_lb1 = json.loads(lb1)
    lb1_data = json_lb1.get("data", [])

    for d in lb1_data:
        label_url = "ERROR"

        user_id = d.get('user_id', 1)
        seed = d['seed']

        with lock:
            list_seed.append(seed)

        index, length, text = 0, 0, ""

        audibility, noise, region = None, None, None

        predict_kaldi, wer_kaldi = None, None
        predict_wenet, wer_wenet = None, None

        hard_level = 1

        if 'content' in d:
            content = d.get('content', {})

            if 'tag' in content:
                tag = content['tag']
                index = tag.get('index', "")
                length = tag.get('length', "")
                text = tag.get('text', "")

                try:
                    s4 = get_cur_time()
                    data = cut_audio(sample_rate, array_data, start_time=int(index), length=int(length))
                    e4 = get_cur_time()
                    s5 = get_cur_time()
                    label_url = create_link_by_data(data)
                    e5 = get_cur_time()
                    print(f"cut_audio: {e4 - s4} \n create_link: {e5 - s5}")
                    time_cut_audio.append((e4 - s4))
                    time_create_link.append((e5 - s5))

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
                predict_wenet = classify.get("predict_wenet", "")

                if len(predict_kaldi) == 0 or len(predict_wenet) == 0:
                    # call api
                    if label_url != "ERROR":
                        pass

                if predict_kaldi:
                    wer_kaldi = classify.get("wer_kaldi", calculate_wer(text, predict_kaldi))
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

        row_value = [dict_value.get(column, None) for column in INSER_COLUMNS]
        with lock:
            list_values.append(tuple(row_value))

def get_label_url(input):
    return input.get("label_url", "")

def get_seed(input):
    return input.get("seed", "")

def parse_values(inputs, INSER_COLUMNS):
    # download audio and save to dict

    # label_urls = [get_label_url(inp) for inp in inputs]


    # handle data
    list_values = []
    list_seed = []

    time_get_link = []
    time_cut_audio = []
    time_create_link = []


    lock = threading.Lock()  # Lock object for thread synchronization
    s0 = get_cur_time()

    def process_row_wrapper(row):
        process_row(row, INSER_COLUMNS, list_values, list_seed, time_get_link, time_cut_audio, time_create_link, lock)

    threads = []
    for row in inputs:
        thread = threading.Thread(target=process_row_wrapper, args=(row, ))
        thread.start()
        threads.append(thread)

    # Wait for all threads to complete
    for thread in threads:
        thread.join()

    e0 = get_cur_time()
    print("TOTAL TIME: ", (e0 - s0))
    print("AVR GET LINK: ", np.mean(time_get_link))
    print("AVR CUT AUDIO: ", np.mean(time_cut_audio))
    print("AVR CREATE LINK: ", np.mean(time_create_link))

    return list_values, list_seed


def parse_values_old(inputs, INSER_COLUMNS: List or Tuple = []) -> Tuple[List[dict], List]:
    # returns: [List[Dict], List[int]]   
    
    list_values = []
    list_seed = []

    time_get_link = []
    time_cut_audio = []
    time_create_link = []

    s0 = get_cur_time()
    for row in inputs:
        lb1 = row['lb1']
        
        if not isinstance(lb1, str) or lb1 == 'EMPTY' or len(lb1) == 0:
            continue
        json_lb1 = json.loads(lb1)
        data = json_lb1['data']
        
        for d in data:
            s1 = get_cur_time()
            label_url = "ERROR"
            
            user_id = d.get('user_id', 1)
            
            seed = d['seed']
            list_seed.append(seed)

            index, length, text = 0, 0, ""
            
            audibility, noise, region = None, None, None

            predict_kaldi, wer_kaldi = None, None
            predict_wenet, wer_wenet = None, None

            hard_level = 1
            e1 = get_cur_time()
            if 'content' in d:
                
                s2 = get_cur_time()
                content = d.get('content', {})

                if 'tag' in content:
                    tag = content['tag']
                    index = tag.get('index', "")
                    length = tag.get('length', "")
                    text = tag.get('text', "")
                    e2 = get_cur_time()
                    try:
                        s3 = get_cur_time()
                        input_file = row['label_url']
                        e3 = get_cur_time()
                        s4 =  get_cur_time()
                        data = cut_audio(seed, input_file, start_time=int(index), length=int(length))
                        e4 = get_cur_time()
                        s5 =  get_cur_time()
                        label_url = create_link_by_file(data)
                        e5 = get_cur_time()
                        print(f"get label_url: {e3-s3} \n cut_audio: {e4-s4} \n create_link: {e5-s5}")
                        time_get_link.append((e3-s3))
                        time_cut_audio.append((e4-s4))
                        time_create_link.append((e5-s5))

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
                    predict_wenet = classify.get("predict_wenet", "")
                    
                    if len(predict_kaldi) == 0 or len(predict_wenet) == 0:
                        # call api
                        if label_url != "ERROR":
                            pass

                    if predict_kaldi:
                        wer_kaldi = classify.get("wer_kaldi", calculate_wer(text, predict_kaldi))
                    if predict_wenet:
                        wer_wenet = classify.get("wer_wenet", calculate_wer(text, predict_wenet))
                
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


            # values = []
            # for column in INSER_COLUMNS:
                
            #     v = dict_value.get(column, None)
            #     values.append(v)

            values = [dict_value.get(column, None) for column in INSER_COLUMNS]
            list_values.append(tuple(values))

    e0 = get_cur_time()
    print("TOTAL TIME: ", (e0-s0))
    print("AVR GET LINK: ", np.mean(time_get_link))
    print("AVR CUT AUDIO: ", np.mean(time_cut_audio))
    print("AVR CREATE LINK: ", np.mean(time_create_link))

    return list_values, list_seed