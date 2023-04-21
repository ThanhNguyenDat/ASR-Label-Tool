import classNames from "classnames/bind";
import React, { useEffect, useState } from "react";

// import Waveform from "../../components/Waveform"
import Waveform from "@components/Waveform";
import useScript from "@hooks/useScript";
import { Button, Layout, Pagination, Table } from "antd";
import axios from 'axios';

import style from "./ASRAnnotationReviewPage.scss";

import { customArray, iterifyArr } from '../../utils/common/customArray'

import Box, { BoxProps } from '@mui/material/Box';
import ItemFlexbox from "../../components/ItemFlexbox/ItemFlexbox";


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


function ASRAnnotationReviewPage(props) {
    // do performance
    const start = performance.now();


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


    const { clicked, setClicked, points, setPoints } = useContextMenu();
    const [color, setColor] = React.useState('#f5f5f5')
    const [colors, setColors] = React.useState({});

        // Full flow when anntations change
    useEffect(() => {
        console.log('on change use effect ')
        if (window.AL) {
            window.AL.onReceiveRequestResult(function (data) {
                // const final_annotations = annotations
                // window.AL.pushResultFail();
                console.log("data push result: dataLabels ", annotations);
                console.log("data push result: resultLabel ", resultLabel);
                // window.AL.pushResultFail();
                window.AL.pushResult({ 'postags': resultLabel, 'fetch_number': 1 });
                // window.AL.pushResult({'postags': dataLabels['annotations'], 'fetch_number': 1});

            })
            window.AL.onReceiveData(function (data) {
                console.log('onReceiveData', data)
                if (data.length > 0) {
                    // update data - annotations
                    setDataLabel(data[0]['data'])
                    const anns = data[0]['annotation']
                    if (anns.length > 0) {
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
                        setAnnotations(formatted_anns)
                    } 

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
        }
    }, [annotations, resultLabel])

    function formatResultData (data) {
        const childResult = []

        const anns = data['annotation']
        if (anns.length > 0) {
            childResult.push(anns.map(anno => ({
                'class_id': 0,
                'class_name': 'Other',
                'tag': {...[anno.content]},
                'extras': { 
                    ...[anno.extra],
                    'review': null,
                },
                'data_cat_id': data['data'][0]['data_cat_id'],
                'dataset_id': data['data'][0]['dataset_id'],
                'seed': data['data'][0]['seed'],
                'item_id': data['data'][0]['id'],    
            })))
        }
        return childResult
        
    }

    React.useEffect(() => {
        const fetchAPI = async () => {
            await axios.get(`http://0.0.0.0:8211/get-full-data`)
            .then(response => {
                console.log('response: ', response)
                const data = response.data.data;

                const ids = data.map(d => {
                    return  d.data[0].id
                })
                
                setDataLabelIds(ids);
                setEntireDataLabel(data);

                // console.log('data: ', data);
                const _result = data.map(d => formatResultData(d));
                console.log('result: ', _result)
                setEntireResultLabel(_result); // set here


                setDataLabelId(ids[0])
            })
        }
        fetchAPI();
    }, [])

    React.useEffect(() => {
        const data = entireDataLabel.find(d => d.data[0].id == dataLabelId)
        if (data) {
            setDataLabel(data['data']);
            const anns = data['annotation']
            if (anns.length > 0) {
                const formatted_anns = anns.map(ele => ({
                    ...ele,
                    content: {
                        ...ele['content'],
                        index: ele['content']['index']/1000,
                        length: ele['content']['length']/1000
                    }
                }))
                setAnnotations(formatted_anns)
            } else {
                setAnnotations([])
            }
        }
        
    }, [dataLabelId])

    // update props
    const waveform_props = {
        commonInfo: commonInfo,

        dataLabel,
        annotations,

        setResultLabel,
        ...props
    }


    // code thực thi trong componentDidMount

    const end = performance.now();
    console.log(`Thời gian render: ${end - start} ms`);


    return (
        <div className={cx("ASRAnnotaionPage")}>
            <div className="row" style={{height: "100vh"}}>
                <div className="col-2" >
                    <Button 
                        style={{ 
                            
                            height: 100,
                            width: 100,
                            bottom: 0,

                        }}
                    >Next</Button>
                </div>
                <div className="container col row">
                        <div className="col-10">
                            {dataLabelId && (
                            <>
                                <Waveform {...waveform_props} />
                                
                                <button onClick={()=>{console.log(`result push ${resultLabel.length}: ${JSON.stringify(resultLabel)}`)}}>resultLabel</button>
                                <button onClick={()=>{console.log(`annota push ${annotations.length}: ${JSON.stringify(annotations)}`)}}>annotations</button>
                            </>
                            )}
                        </div>
                        <div className="col-2" >
                            <div className="row" 
                                style={{
                                    // position: 'relative', // left right
                                    height: '30vh', 
                                    overflowY: 'scroll',
                                    paddingTop: 20,
                                }}
                            >
                                {dataLabelIds.map(id => {
                                    // get review by id
                                    // const review = entireResultLabel.find(rsLabel => rsLabel.)

                                    // color = colors[id]
                                    return (
                                        <div className="col-sm-3" style={{paddingBottom: 10}}>
                                            <ItemFlexbox
                                                key={id}
                                                
                                                id={id}
                                                resultLabel={resultLabel}
                                                setResultLabel={setResultLabel}
                                                
                                                onClick={(e)=>{
                                                    setDataLabelId(id)
                                                }}

                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    setClicked(false);
                                                    console.log('id ', id)
                                                    setPoints({
                                                        x: e.pageX,
                                                        y: e.pageY,
                                                    });
                                                    
                                                    setClicked(true);
                                                    setDataLabelId(id)
                                                }}
                                                clicked={clicked}
                                                points={points}
                                                color={color}
                                                setColor={setColor}
                                                

                                            >{id}</ItemFlexbox>
                                            
                                        </div>
                                    )
                                })}
                            </div>
                            
                        </div>
                        
                         
                </div> 
            </div>
            
        </div>
    );
}

export default ASRAnnotationReviewPage;