import classNames from "classnames/bind";
import React, { useEffect, useState } from "react";

import WaveformReview from "@components/WaveformReview";
import useScript from "@hooks/useScript";
import { Button, Layout, Pagination, Table } from "antd";
import axios from 'axios';

import style from "./ASRAnnotationReviewPage.scss";

import { customArray, iterifyArr } from '../../utils/common/customArray'

import Box, { BoxProps } from '@mui/material/Box';
import ItemFlexbox from "../../components/ItemFlexbox/ItemFlexbox";
// import _ from "lodash";

import useContextMenu from '@hooks/useContextMenu';

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

const default_data = [
    {
        "annotation": [
            {
                "class_id": 3715,
                "class_name": "Other",
                "content": {
                    'tag':{
                        "index": 290,
                        "length": 4920,
                        "text": "mi có ăn chay trường cái tâm mi mới mới tịnh lại thôi."
                    },
                    "extras": {}
                },
            }
        ],
        "data": [
            {
                "data_cat_id": 2,
                "dataset_id": 1970,
                "seed": 380,
                "id": 1470,
                "file_name": "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3"
            }
        ]
    },
    {
        "annotation": [
            {
                "class_id": 3709,
                "class_name": "Other",
                "content": {
                    'tag': {
                        "index": 430,
                        "length": 1230,
                        "text": "chạy không nói nhanh nhe"
                    },
                    "extras": {}
                },
            },
            {
                "class_id": 3709,
                "class_name": "Other",
                "content": {
                    "tag":{
                        "index": 1670,
                        "length": 3080,
                        "text": "xe vô gần tới rồi nữa tiếng nữa là xe chạy rồi"
                    },
                    "extras": {}
                },
            }
        ],
        "data": [
            {
                "data_cat_id": 2,
                "dataset_id": 1970,
                "seed": 380,
                "id": 1471,
                "file_name": "https://assets.mixkit.co/active_storage/sfx/667/667-preview.mp3"
            }
        ]
    },
    
]


const rv1_fake = {
    "data": [
      {
        "class_id": 3709,
        "class_name": "Human",
        "content": {
          "tag": {
            "index": 290,
            "length": 4920,
            "text": "mi có ăn chay trường cái tâm mi mới mới tịnh lại thôi."
          },
          "extras": {
            "hard_level": 1,
            "classify": {
              "audibility": "good",
              "noise": "clean",
              "echo": "clean"
            },
            "review": "Good"
          }
        },
        "data_cat_id": 2,
        "dataset_id": 1970,
        "seed": 380,
        "item_id": 1470
      }
    ]
  }


function ASRAnnotationReviewPage(props) {
    document.body.style.overflow = 'hidden';

    const [dataLabelIds, setDataLabelIds] = React.useState([]);
    
    const [entireDataLabel, setEntireDataLabel] = React.useState([]);

    const [dataLabelId, setDataLabelId] = React.useState(null);





    const [commonInfo, setCommonInfo] = useState([
        { color: '#474747', description: 'Other class', id: 3709, name: 'Other' },
        { color: '#0000FF', description: 'noise', id: 3710, name: 'noise' }
    ])
    const [dataLabel, setDataLabel] = useState(data['data']);
    const [annotations, setAnnotations] = useState(data['annotation']);
    
    // const [commonInfo, setCommonInfo] = useState([])
    // const [dataLabel, setDataLabel] = useState([
    //     {
    //         "file_name": "https://assets.mixkit.co/active_storage/sfx/1714/1714-preview.mp3" //url
    //     }
    // ]);
    // const [annotations, setAnnotations] = useState([]);
    
    
    const [resultLabel, setResultLabel] = useState([]);

    const [entireResultLabel, setEntireResultLabel] = useState([])
    const [originResultLabel, setOriginResultLabel] = useState(entireResultLabel)
    
    const [historyIds, setHistoryIds] = useState([]);
    const [oldResult, setOldResult] = useState([]);

    const { clicked, setClicked, points, setPoints } = useContextMenu();
    const [selectedRegionKey, setSelectedRegionKey] = useState();
    
    const [idActive, setIdActive] = React.useState('');
    
    // Full flow when anntations change
    useEffect(() => {
        if (window.AL) {
            window.AL.onReceiveRequestResult(function (data) {
                // const final_annotations = annotations
                // window.AL.pushResultFail();
                console.log("data push result: dataLabels ", annotations);
                console.log("data push result: resultLabel ", resultLabel);
                // window.AL.pushResultFail();

                // format before pushResult, press Next
                const finnalResult = formatFinnalResult(entireResultLabel)
                window.AL.pushResult({ 'postags': finnalResult, 'fetch_number': 5 });
                // window.AL.pushResult({'postags': dataLabels['annotations'], 'fetch_number': 1});

            })
            window.AL.onReceiveData(function (data) {
                console.log('onReceiveData ', data)
                if (data.length > 0) {
                    // data = formatDataFromServer(data);

                    const ids = data.map(d => {
                        return  d.data[0].id
                    })
                    
                    setDataLabelIds(ids);
                    setEntireDataLabel(data);
        
                    // console.log('data: ', data);
                    const _result = data.map(d => formatResultData(d));
                    setEntireResultLabel(_result); // set here
        
                    setDataLabelId(ids[0])



                    // update data - annotations
                    // setDataLabel(data[0]['data'])
                    // const anns = data[0]['annotation']
                    // if (anns.length > 0) {
                    //     const formatted_anns = anns.map(ele => {
                    //         return {
                    //             ...ele,
                    //             content: {
                    //                 ...ele['content'],
                    //                 index: ele['content']['index']/1000,
                    //                 length: ele['content']['length']/1000
                    //             }
                    //         }
                    //     })
                    //     setAnnotations(formatted_anns)
                    // } 

                }

            })

            window.AL.onPushResultFail(function (data) {
                // alert('fail to push' + data['message']);
                console.log("onPushResultFail ", data)
            });

            window.AL.onReceiveCommonInfo(function (data) {
                console.log('onReceiveCommonInfo in', data)
                var classes = data['classes'];
                setCommonInfo(classes)
                window.AL.pushSettings({'settings': [
                    {
                        'type': 'text', 
                        'id': 1,
                        'name': 'From Idx', 
                        'options': []
                    },
                    {
                        'type': 'text', 
                        'id': 2,
                        'name': 'Num Items', 
                        'options': []
                    },
                ]});

                // window.AL.pushSettings({
                //     'settings': [
                //         {
                //             'type': 'text',
                //             'id': 1,
                //             'name': 'FromID',
                //             'options': []
                //         },
                //         {
                //             'type': 'text',
                //             'id': 2,
                //             'name': 'Num Items',
                //             'options': []
                //         },
                //         {
                //             'type': 'switch',
                //             'id': 3,
                //             'name': 'ToReview',
                //             'options': []
                //         },
                //     ]
                // });
            });

            window.AL.onUpdateSelectClass(function (data) {
                console.log('onUpdateSelectClass data', data)
            });

            window.AL.onReceiveRequestSettings(function (data) {
                console.log("onReceiveRequestSettings ", data)
            })

            window.AL.onReceiveRequestResetCurrent(function (data) {
                console.log('onReceiveRequestResetCurrent ', data)
            });
        }
    }, [annotations, resultLabel])
    

    React.useEffect(() => {
        const fetchAPI = async () => {
            await axios.get(`http://0.0.0.0:8211/get-full-data`)
            .then(response => {
                const data = response.data.data;
                
                const ids = data.map(d => {
                    return  d.data[0].id
                })
                console.log('data: ', data)
                setDataLabelIds(ids);
                setEntireDataLabel(data);

                // console.log('data: ', data);
                const _result = data.map(d => formatResultData(d));
                console.log('response: ', _result)
                setEntireResultLabel(_result); // set here
                
                // set origin data when call api first time
                if (_result.toString() !== entireDataLabel.toString()) {
                    console.log('reset origin data when call api first time')
                    setOriginResultLabel(_result);
                }

                setDataLabelId(ids[0]);
            })
            .catch(error => {
                const data = default_data;
                const ids = data.map(d => {
                    return  d.data[0].id
                })
                
                setDataLabelIds(ids);
                setEntireDataLabel(data);
                

                // console.log('data: ', data);
                const _result = data.map(d => formatResultData(d));
                setEntireResultLabel(_result); // set here
                
                setDataLabelId(ids[0])
                
                // for compare 2 array
                const _oldResult = originResultLabel.find(data => data[0][0].item_id === dataLabelId)
                setOldResult(_oldResult)
            })
        }

        try {
            
            fetchAPI();
        } catch (error) {
            console.log('error: ', error)
        } 
    }, [])

    React.useEffect(() => {

        console.log('entire result: ', entireResultLabel)
        const finnalData = formatFinnalResult(entireResultLabel)
        console.log('finnal: ', finnalData)

        const data = entireDataLabel.find(d => d.data[0].id == dataLabelId)
        const result = entireResultLabel.find(r => r[0][0].item_id === dataLabelId)
        console.log('result: ', result)
        if (data) {
            console.log('data["data"]: ', data)
            setDataLabel(data['data']);
        }

        if (result) {
            const anns = result[0]
            if (anns.length > 0) {
                const formatted_anns = anns.map(ele => ({
                    // 'class_id': ele['class_id'],
                    // 'class_name': ele['class_name'],
                    // 'content': {
                    //     'tag':{
                    //         ...ele['content']['tag'],
                    //         index: ele['content']['tag']['index'] / 1000,
                    //         length: ele['content']['tag']['length'] / 1000,
                    //     },
                    //     'extra': ele['content']['extras']
                    // },
                    ...ele,
                    content: {
                        ...ele['content'],
                        'tag': {
                            'text': ele['content']['tag']['text'],
                            'index': ele['content']['tag']['index'] / 1000,
                            'length': ele['content']['tag']['length'] / 1000,
                        },
                    }
                }))
                console.log('formatted_anns: ', formatted_anns)
                setAnnotations(formatted_anns)
            } else {
                setAnnotations([])
            }
        }
        
        const _historyIds = historyIds
        _historyIds.push(dataLabelId)
        setHistoryIds(_historyIds)
        
        // const _oldResult = originResultLabel.find(data => data[0][0].item_id === dataLabelId)
        // setOldResult(_oldResult)


        /*
        * Code to fix bug id and old result
        */

        // get old result with id
        const oldId = _historyIds[_historyIds.length - 2]
        
        const oldResult = originResultLabel.find(data => data[0][0].item_id === oldId) // bug -> getting current result -> means entireResultLabel
        const currentResult = entireResultLabel.find(data => data[0][0].item_id === oldId)
        
        let isSame = true
        if (oldResult && currentResult){
            // twoArrayDiff = _.isEqual(oldResult[0], currentResult[0]);
            isSame = compareTwoArray(oldResult[0], currentResult[0]);
        } 
        console.log('isSame: ', isSame)
        
        if (isSame === false) {
            // call api here
            console.log('call api update and reset origin result label');
            // setOriginResultLabel(entireResultLabel);
        }

    }, [dataLabelId])

    const formatFinnalResult = (entireResultLabel) => {
        const finnal = entireResultLabel.map(result => {
            result = result[0][0]
            return {
                "class_id": commonInfo[0]?.id,
                "class_name": result['class_name'],
                "tag": {
                    "index": parseInt(result.content.tag.index),
                    "length": parseInt(result.content.tag.length),
                    // "length": parseInt(data.end_time * 1000),
                    "text": result.content.tag.text || "",
                },
                "extras": {
                    "hard_level": 1,
                    "classify": {
                        "audibility": result.content.extras?.classify?.audibility || 'good',
                        "noise": result.content.extras?.classify?.noise || 'clean',
                        "echo": result.content.extras?.classify?.echo || 'clean',
                    },
                    "review": result.content.extras?.review || null,
                },
                'data_cat_id': result['data_cat_id'],
                'dataset_id': result['dataset_id'],
                'seed': result['seed'],
                'item_id': result['item_id'],
            }
        })
        return finnal
    } 

    function formatDataFromServer (dataServer) {
        const formatAnnotation = (annotations) => {
            return annotations.map(anno => ({
                ...anno,
                'content': {
                    'tag': {
                        'index': anno['content']['index'] * 1000,
                        'length': anno['content']['length'] * 1000,
                        'text': anno['content']['text']
                    },
                }
            }))
        }

        const formatedData = dataServer.map(d => ({
            "data": d['data'],
            "annotation": formatAnnotation(d['annotation'])
        }))
        return formatedData
    }


    function formatResultData (data) {
        const childResult = []

        const anns = data['annotation']
        if (anns.length > 0) {
            childResult.push(anns.map(anno => ({
                'class_id': anno['class_id'],
                'class_name': anno['class_name'],
                'content': {
                    'tag': {...anno.content.tag},
                    'extras': { 
                        ...anno.content.extras,
                        'review': anno.content.extras?.review || null,
                    },
                },
                'data_cat_id': data['data'][0]['data_cat_id'],
                'dataset_id': data['data'][0]['dataset_id'],
                'seed': data['data'][0]['seed'],
                'item_id': data['data'][0]['id'],    
            })))
        }
        return childResult
    }


    const compareTwoArray = (oldResult, currentResult) => {
        console.log('oldResult: ', oldResult);
        console.log('currentResult: ', currentResult);
        
        // get text (description)
        const oldText = oldResult.map(old => old.content.tag.text)
        const currentText = currentResult.map(current => current.content.tag.text)
        // console.log('oldText: ', oldText)
        // console.log('currentText: ', currentText)
        
        // get extras
        const oldExtras = oldResult.map(old => old.extras)
        const currentExtras = currentResult.map(current => current.extras)
        // console.log('oldExtras: ', oldExtras);
        // console.log('currentExtras: ', currentExtras);
        // console.log('extrasSame: ', oldExtras === currentExtras)

        return (oldResult.length === currentResult.length &&
                oldText.toString() === currentText.toString())
        // return oldResult.toString() == currentResult.toString()
    }


    const onSubmitSample = (dataLabelId) => {
        console.log('submit id: ', dataLabelId);
        // get result label with 
        const current_result_label = entireResultLabel.find(data => data[0][0].item_id === dataLabelId)
        // console.log('current: ', current_result_label)
        const data = current_result_label[0]
        
        // format data
        const dataToUpdate = {
            'data': data
        }

        console.log('dataToUpdate: ', dataToUpdate)
        
        // call api
        const fetchAPI = async () => {
            // await axios.post(`http://0.0.0.0:8211/update_data`, {'raw-data': dataToUpdate}, {
            //     headers: {
            //         'Content-Type': 'Application/json',
            //     }
            // })

            await axios.post(process.env.REACT_APP_API_UPDATE, dataToUpdate, {
                headers: {
                    'Content-Type': 'Application/json',
                }
            })
            .then(response => {
                console.log('response: ', response)
            })
            .catch(error => {
                console.log('error: ', error)
            })
            
        }
        fetchAPI();
    }


    const addActiveClass = (e) => {
        const clicked = e.target.id
        console.log('e.target: ', e)
        console.log('idClick: ', clicked)
        if (idActive === clicked) {
            // setActive('');
        } else {
            setIdActive(clicked)
        } 
    }

    // update props
    const waveform_props = {
        commonInfo: commonInfo,

        dataLabel,
        annotations,

        dataLabelId,
        entireResultLabel,
        setEntireResultLabel,

        setResultLabel,
        selectedRegionKey, 
        setSelectedRegionKey,
        ...props
    }

    return (
        <div className={cx("ASRAnnotaionPage")}>
            <div className="row" style={{height: "100vh"}} >
                
                <div className="col-10">
                    {dataLabelId && (
                    <>
                        <WaveformReview {...waveform_props}/>
                    </>
                    )}
                    <div style={{height: '100%'}} onClick={()=>{setSelectedRegionKey(null)}}></div>
                </div>
                <div className="col-2" onClick={()=>{setSelectedRegionKey(null)}}>
                    <div 
                        className="container"
                        style={{
                            position: 'relative',
                            height: '30vh', 
                            overflowY: 'scroll',
                            overflowX: 'hidden',
                            paddingTop: 20,
                        }}
                    >

                        <div className="row row-cols-auto">
                            {dataLabelIds.map(id => {
                                const current_data = entireDataLabel.find(d => d.data[0].id === id)
                                const seed = current_data.data[0].seed
                                
                                return (
                                    <div
                                        id={id}
                                        key={id}
                                        className={`col ${idActive.toString()===id.toString() ? 'active' : ''}`} 
                                        style={{paddingBottom: 10}} 
                                        // onClick={e=>{
                                        //     addActiveClass(e)
                                        // }}
                                    >
                                        <ItemFlexbox
                                            key={id}
                                            seed={seed}

                                            id={id}
                                            entireResultLabel={entireResultLabel}
                                            setEntireResultLabel={setEntireResultLabel}
                                            
                                            dataLabelId={dataLabelId}

                                            onClick={(e)=>{
                                                setSelectedRegionKey(null)
                                                setDataLabelId(id)

                                                addActiveClass(e)
                                            }}

                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                
                                                setClicked(false);
                                                setPoints({
                                                    x: e.pageX,
                                                    y: e.pageY,
                                                });
                                                
                                                setClicked(true);
                                                setDataLabelId(id);

                                                addActiveClass(e)
                                            }}

                                            clicked={clicked}
                                            points={points}
                                            

                                        />
                                        
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <Button style={{left: 0}} onClick={()=>{
                            onSubmitSample(dataLabelId)
                        }
                        }>Submit</Button>
                    </div>
                </div>
                
                         
                
            </div>
            
        </div>
    );
}

export default ASRAnnotationReviewPage;