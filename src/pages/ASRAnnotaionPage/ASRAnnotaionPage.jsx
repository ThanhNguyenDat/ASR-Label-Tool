import classNames from "classnames/bind";
import { useEffect, useState } from "react";

// import Waveform from "../../components/Waveform"
import Waveform from "@components/Waveform";
import useScript from "@hooks/useScript";

import style from "./ASRAnnotaionPage.scss";

import { customArray, iterifyArr } from '../../utils/common/customArray'

const cx = classNames.bind(style)

// const _audioUrl =
//   "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3"; // bi loi

// const _audioUrl =
//   "https://assets.mixkit.co/active_storage/sfx/1714/1714-preview.mp3"; // khoong bi loi

const data = {
    "annotation": [
        {
            "class_id": 3579,
            "class_name": "Human",
            "content": {
                "index": 0, // start
                "length": 2, // end - start
                "text": "alo" // description
            },
            "extra": {
                "hard_level": 1,
                "classify": {
                    "audibility": "good",
                    "noise": "clean",
                    "echo": "clean",
                }
            }
        },
        {
            "class_id": 3579,
            "class_name": "Human",
            "content": {
                "index": 2,
                "length": 0.5,
                "text": "1234"
            },
            "extra": {
                "hard_level": 0,
                "classify": {
                    "audibility": "audible",
                    "noise": "medium",
                    "echo": "light",
                }
            }
        }
    ],
    "data": [
        {
            "data_cat_id": 2,
            "dataset_id": 1970,
            "seed": 380,
            "id": 2677,
            "file_name": "https://assets.mixkit.co/active_storage/sfx/1714/1714-preview.mp3" //url
        }
    ]
}


function ASRAnnotaionPage(props) {
    // const [commonInfo, setCommonInfo] = useState([
    //     { color: '#474747', description: 'Other class', id: 3709, name: 'Other' },
    //     { color: '#0000FF', description: 'noise', id: 3710, name: 'noise' }
    // ])
    // const [dataLabel, setDataLabel] = useState(data['data']);
    // const [annotations, setAnnotations] = useState(data['annotation']);
    
    const [commonInfo, setCommonInfo] = useState([])
    const [dataLabel, setDataLabel] = useState([
        {
            "file_name": "https://assets.mixkit.co/active_storage/sfx/1714/1714-preview.mp3" //url
        }
    ]);
    const [annotations, setAnnotations] = useState([]);
    

    const [resultLabel, setResultLabel] = useState([]);
    // Full flow when anntations change
    useEffect(() => {
        console.log('on change use effect ')
        if (window.AL) {
            console.log("receive data");
            console.log(`data push result before onReceiveRequestResult : data: ${dataLabel}`);
            console.log(`data push result before onReceiveRequestResult : annotation: ${annotations}`);
            window.AL.onReceiveRequestResult(function (data) {
                // const final_annotations = annotations
                // window.AL.pushResultFail();
                console.log('alo onReceiveRequestResult ')
                console.log("data push result: dataLabels ", annotations);
                // window.AL.pushResultFail();
                window.AL.pushResult({ 'postags': resultLabel, 'fetch_number': 1 });
                // window.AL.pushResult({'postags': dataLabels['annotations'], 'fetch_number': 1});

                console.log('after push result')
            })
            console.log('hi')
            window.AL.onReceiveData(function (data) {
                console.log('onReceiveData', data)
                if (data.length > 0) {
                    // update data - annotations

                    console.log("data[0] ", data[0])

                    setDataLabel(data[0]['data'])
                    const anns = data[0]['annotation']
                    const formatted_anns = anns.map(ele => {
                        return {
                            ...ele,
                            content: {
                                ...ele['content'],
                                index: ele['content']['index']/1000,
                                length: ele['content']['length']/1000
                            }
                        }
                    })
                    console.log('formatted_anns ', formatted_anns)
                    setAnnotations(formatted_anns)
                }

            })

            window.AL.onPushResultFail(function (data) {
                alert('fail to push' + data['message']);
            });

            window.AL.onReceiveCommonInfo(function (data) {
                console.log('onReceiveCommonInfo in', data)
                var classes = data['classes'];
                setCommonInfo(classes)
                window.AL.pushSettings({
                    'settings': [
                        {
                            'type': 'text',
                            'id': 1,
                            'name': 'Video Name',
                            'options': []
                        },
                        {
                            'type': 'text',
                            'id': 2,
                            'name': 'Frame ID',
                            'options': []
                        },
                    ]
                });
                console.log('onReceiveCommonInfo out ', data)

            });

            window.AL.onUpdateSelectClass(function (data) {
                console.log('onUpdateSelectClass data', data)
            });

            window.AL.onReceiveRequestResetCurrent(function (data) {
                console.log('onReceiveRequestResetCurrent ', data)
            });

            console.log("receive data success");
        }
    }, [annotations])

    // update props
    const waveform_props = {
        // audioUrl: audioUrl,
        // annotations: annotations,
        // dataLabels: dataLabels || {}, // dataLabels
        // setDataLabels: setDataLabels,
        commonInfo: commonInfo,

        dataLabel,
        annotations,

        setResultLabel,
        ...props
    }

    return (
        <div className={cx("container ASRAnnotaionPage")}>
            <Waveform {...waveform_props} />
            {/* <button onClick={()=>{console.log(`result push ${resultLabel.length}: ${JSON.stringify(resultLabel)}`)}}>resultLabel</button>
            <button onClick={()=>{console.log(`annota push ${annotations.length}: ${JSON.stringify(annotations)}`)}}>annotations</button> */}
        </div>
    );
}

export default ASRAnnotaionPage;
