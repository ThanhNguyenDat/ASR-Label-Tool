import classNames from "classnames/bind";
import React, { useEffect, useRef, useState } from "react";
// import { WaveSurfer } from 'wavesurfer-react';
import WaveSurfer from "wavesurfer.js";

import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import { PlayCircleOutlined, SettingOutlined } from "@ant-design/icons";


import { randomColor } from "@utils/randomColor";

import TableWaveform from "../../containers/TableWaveform";

import styles from "./WaveformReview.scss";
import { Button, Menu, Modal, Popover } from "antd";

import axios from "axios";

const cx = classNames.bind(styles);

const colors = {
    low: 'green',
    medium: 'orange',
    high: 'red',
    
    // audibility
    good: 'blue',
    audible: 'green',
    bad: 'red',

    normal: 'blue',
};
  

function WaveformReview(props) {
    // document.body.style.overflow = 'hidden';

    let { 
        commonInfo, 
        dataLabel, 
        annotations, 

        // dataLabelId,
        entireDataLabel,
        setEntireDataLabel,

        selectedRegionKey, 
        setSelectedRegionKey,
    } = props;

    const audioUrl = dataLabel[0]["file_name"]
    const dataLabelId = dataLabel[0].id

    const [wavesurfer, setWavesurfer] = useState(null);
    
    // const [lengthWavesurfer, setLengthWavesurfer] = useState(0);

    const [dataTable, setDataTable] = useState([])
    const [focusCell, setFocusCell] = useState({ row: null, col: null });
    const [tableLoading, setTableLoading] = useState(false);

    const waveRef = useRef(null);
    const timelineRef = useRef(null);
    
    /*
     * Initial wavesurfer
     */
    useEffect(() => {
        // setTableLoading(true);

        // create wavesurfer with plugins
        const wavesurferInstance = WaveSurfer.create({
            container: waveRef.current,
            height: 100,
            pixelRatio: 1,
            scrollParent: true,
            normalize: true,
            minimap: true,
            backend: 'WebAudio',
            
            plugins: [
                TimelinePlugin.create({
                    container: timelineRef.current,
                    timeInterval: (pxPerSec) => {
                        var retval = 1;
                        if (pxPerSec >= 25 * 100) {
                            retval = 0.01;
                        } else if (pxPerSec >= 25 * 40) {
                            retval = 0.025;
                        } else if (pxPerSec >= 25 * 10) {
                            retval = 0.1;
                        } else if (pxPerSec >= 25 * 4) {
                            retval = 0.25;
                        } else if (pxPerSec >= 25) {
                            retval = 1;
                        } else if (pxPerSec * 5 >= 25) {
                            retval = 5;
                        } else if (pxPerSec * 15 >= 25) {
                            retval = 15;
                        } else {
                            retval = Math.ceil(0.5 / pxPerSec) * 60;
                        }
                        return retval;
                    },
                    fontSize: 12,

                }),
                RegionsPlugin.create(),
                
            ],
        });
        
        if (audioUrl) {
            // setTableLoading(true);

            wavesurferInstance.load(audioUrl);
            // audio loaded data
            wavesurferInstance.on("ready", function (region) {
                wavesurferInstance.enableDragSelection({
                    slop: 5,
                    color: randomColor(0.2),
                });

                wavesurferInstance.clearRegions();

                // load new anntations
                loadRegions(annotations, wavesurferInstance);
                setWavesurfer(wavesurferInstance);
                // setTableLoading(false);
            });
            
            
        }
        // setTableLoading(false);
        return () => {
            wavesurferInstance.destroy();
        };
    }, [audioUrl]);

    // handle event and regions when wavesurfer initial (PARENT)
    useEffect(() => {
        if (wavesurfer) {
            wavesurfer.on("region-created", function (region, event) {
                region.update({
                    color: randomColor(0.2),
                });
            });
            
            wavesurfer.on("region-click", function (region, event) {
                const newDataTable = updateDataTableByWavesurfer(wavesurfer);
                updateResultLabel(newDataTable);

                console.log('new dataTable: ', newDataTable)

                event.stopPropagation();
                // play region and replay region
                region.play()
                if (event.shiftKey) {
                    console.log("shift key");
                    region.update({
                        loop: true
                    })
                } else {
                    console.log("non shift key");
                    region.update({
                        loop: false
                    })
                }

                // focus description
                const row = newDataTable.find((d) => d.wave_id === region.id)
                if (row && row.hasOwnProperty('key')) {
                    setSelectedRegionKey(row.key);
                    setFocusCell({ row: row.id, col: "description" });
                };
                const rowElement = document.querySelector(`tr[data-row-key="${row?.key}"]`);
                if (rowElement) { // bug click lan 2 khong forcus
                    rowElement.click();
                    rowElement.querySelector(`input[data-key="description"]`)?.focus()
                }
                
            });

            // Set Annotaions and Length Wavesurfer
            wavesurfer.on("region-updated", (region) => {
                setSelectedRegionKey(region.id);
                console.log(wavesurfer.regions.list);
                const newDataTable = updateDataTableByWavesurfer(wavesurfer);
                updateResultLabel(newDataTable);
                
            });

            // Create new region
            wavesurfer.on("region-update-end", (region, event) => {
                region.play();

                if (region.end < region.start || region.end - region.start < 0.08) {
                    region.remove()
                }
            });

            // update new color region
            wavesurfer.on("region-dblclick", function (region, event) {
                region.update({
                    color: randomColor(0.2),
                });
            });
        }
    }, [wavesurfer]);
    
    /**
     * Load annotations
     */
    const loadRegions = (annotations, wavesurfer) => {
        
        annotations.map((annotation, id) => {
            const region = {}
            region.color = randomColor(0.2);
            region.data = {};
            
            region.start = annotation.content.tag.index / 1000;
            region.end = (annotation.content.tag.length + annotation.content.tag.index) / 1000;
            region.data.note = annotation.content.tag.text;
            
            region.data.audibility = annotation.content.extras?.classify?.audibility || "good";
            region.data.noise = annotation.content.extras?.classify?.noise || "clean";
            region.data.echo = annotation.content.extras?.classify?.echo || "clean";
            region.data.region = annotation.content.extras?.classify?.region || "other";

            region.data.review = annotation.content.extras?.review || "";
            wavesurfer.addRegion(region);
        });

        const newDataTable = updateDataTableByWavesurfer(wavesurfer);
        updateResultLabel(newDataTable);
    };
    
    const updateDataTableByWavesurfer = (wavesurfer) => {
        const wavesurferRegionList = Object.values(wavesurfer.regions.list);
        // sort by start of wavesurfer
        wavesurferRegionList.sort((a, b) => a.start - b.start);

        const newDataTable = wavesurferRegionList.map((region, index) => {
            return {
                ...region.data,

                "key": index,        
                "id": index,
                "wave_id": region.id,
                "start_time": Math.round(region.start * 1000) / 1000,
                "end_time": Math.round(region.end * 1000) / 1000,
                "description": region.data.note,
                "color": region.color,
                "audibility": region.data.audibility || "good",
                "noise": region.data.noise || "clean",
                "echo": region.data.echo || "clean",
                "region": region.data.region || "other",
                

                "predict_kaldi": region.data.predict_kaldi,
                "predict_wenet": region.data.predict_wenet,
                "review": region.data.review || "",
            }
        })
        setDataTable(newDataTable);
        return newDataTable
    }

    // To do: update wavesurfer
    const updateWavesurferByDataTable = (dataTable) => {
        // const wave_id = dataTable.find(data => data.wave_id === 'wave_id')
        if (wavesurfer){
            dataTable.forEach((row, rowIndex)=> {
                const region = wavesurfer.regions.list[row.wave_id]

                region.start = row.start_time;
                region.end = row.end_time;
                region.data.note = row.description;

                region.data.audibility = row.audibility;
                region.data.noise = row.noise;
                region.data.echo = row.echo;
                region.data.region = row.region;

                region.data.predict_kaldi = row.predict_kaldi;
                region.data.predict_wenet = row.predict_wenet;
                region.data.review = row.review;
            })        
        }
    }

    /**
     * Update data table
     */
    const updateDataTablePerCell = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        
        const newDataTable = dataTable.map((row, index) => {
            if (index===rowIndex) {
                return {
                    ...dataTable[rowIndex],
                    [columnId]: value
                }
            }
            return row
        })
        
        setDataTable(newDataTable)
        
        // To do: update wavesurfer
        updateWavesurferByDataTable(newDataTable);

        // Update annotaion
        updateResultLabel(newDataTable);
    }

    // BUTTON NEXT
    // Todo: update follow both dataTable and wavesurfer
    const formatResultLabel = dataTable => dataTable.map((data, index) => (
        {
            "class_id": commonInfo[0]?.id,
            "class_name": "Human",
            
            "content": {
                "tag": {
                    "index": parseInt(data.start_time * 1000),
                    "length": parseInt((data.end_time - data.start_time) * 1000),
                    "text": data.description || "",
                },
                "extras": {
                    "hard_level": 1,
                    "classify": {
                        "audibility": data.audibility,
                        "noise": data.noise,
                        "echo": data.echo,
                        "region": data.region,
                    },
                    "review": data.review,
                },
            },

            'data_cat_id': dataLabel[0]['data_cat_id'],
            'dataset_id': dataLabel[0]['dataset_id'],
            'seed': dataLabel[0]['seed'],
            'item_id': dataLabel[0]['id'],
        }
    ));

    const updateResultLabel = (dataTable) => {
        const _index = entireDataLabel.findIndex(data => data.data[0].id === dataLabelId)
        
        const formatedAnnotations = formatResultLabel(dataTable)
        const updateResult = {
            "annotation": formatedAnnotations,
            "data": dataLabel,
        };
        const _entireDataLabel = JSON.parse(JSON.stringify(entireDataLabel))
        _entireDataLabel[_index] = updateResult
        setEntireDataLabel(_entireDataLabel)
    }

    function handleDeleteRow(record) {
        wavesurfer.regions.list[record.wave_id]?.remove();
        const newDataTable = [...dataTable];
        const id = newDataTable.findIndex((item) => item.wave_id === record.wave_id);
        newDataTable.splice(id, 1);
        
        setDataTable(newDataTable);
        updateResultLabel(newDataTable);
        setSelectedRegionKey(null);

    }



    // Returns Uint8Array of WAV bytes
    // function getWavBytes(buffer, options) {
    //     const type = options.isFloat ? Float32Array : Uint16Array
    //     const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT
    
    //     const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }))
    //     const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);
    
    //     // prepend header, then add pcmBytes
    //     wavBytes.set(headerBytes, 0)
    //     wavBytes.set(new Uint8Array(buffer), headerBytes.length)
    
    //     return wavBytes
    // }

    function bufferToWave(abuffer, offset, len) {
        var numOfChan = abuffer.numberOfChannels,
          length = len * numOfChan * 2 + 44,
          buffer = new ArrayBuffer(length),
          view = new DataView(buffer),
          channels = [], i, sample,
          pos = 0;
    
        // write WAVE header
        setUint32(0x46464952);                         // "RIFF"
        setUint32(length - 8);                         // file length - 8
        setUint32(0x45564157);                         // "WAVE"
    
        setUint32(0x20746d66);                         // "fmt " chunk
        setUint32(16);                                 // length = 16
        setUint16(1);                                  // PCM (uncompressed)
        setUint16(numOfChan);
        setUint32(abuffer.sampleRate);
        setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        setUint16(numOfChan * 2);                      // block-align
        setUint16(16);                                 // 16-bit (hardcoded in this demo)
    
        setUint32(0x61746164);                         // "data" - chunk
        setUint32(length - pos - 4);                   // chunk length
    
        // write interleaved data
        for(i = 0; i < abuffer.numberOfChannels; i++)
          channels.push(abuffer.getChannelData(i));
    
        while(pos < length) {
          for(i = 0; i < numOfChan; i++) {             // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true);          // update data chunk
            pos += 2;
          }
          offset++                                     // next source sample
        }
    
        // create Blob
        return new Blob([buffer], {type: "audio/mpeg"});
    
        function setUint16(data) {
          view.setUint16(pos, data, true);
          pos += 2;
        }
    
        function setUint32(data) {
          view.setUint32(pos, data, true);
          pos += 4;
        }
    }
    function convertInstanceToBufferArray (region, wavesurferInstance)  {
        var start = region.start, end = region.end;
        const segmentDuration = end - start;
        var originalBuffer = wavesurferInstance.backend.buffer;

        var emptySegment = wavesurferInstance.backend.ac.createBuffer(
            originalBuffer.numberOfChannels,
            segmentDuration * originalBuffer.sampleRate,
            originalBuffer.sampleRate
        )

        for (var i = 0; i < originalBuffer.numberOfChannels; i++) {
            var chanData = originalBuffer.getChannelData(i);
            var segmentChanData = emptySegment.getChannelData(i);
            for (var j = 0, len = chanData.length; j < len; j++) {
                segmentChanData[j] = chanData[j];
            }
        }
        
        return emptySegment
    }


    function handleShowPredictRow(record) {
        const currentRowDataTableIndex = dataTable.findIndex(data => data.id === record.id);
        
        const region = wavesurfer.regions.list[record.wave_id];
        // const start = region.start;
        // const end = region.end;

        // // const start = wavesurfer.regions.list[0].start;
        // // const end = wavesurfer.regions.list[0].end;

        // // // Get the selected region's PCM audio data
        // const audioData = wavesurfer.backend.buffer.getChannelData(0);
        // const sampleRate = wavesurfer.backend.buffer.sampleRate;
        

        // // // Calculate the start and end samples based on the selected region
        // const startSample = Math.floor(start * sampleRate);
        // const endSample = Math.floor(end * sampleRate);

        // // // Extract the audio data for the selected region
        // const regionData = audioData.subarray(startSample, endSample);

        // // // Convert the audio data to bytes
        // const byteArray = new Int16Array(regionData.length);
        // for (let i = 0; i < regionData.length; i++) {
        //     byteArray[i] = regionData[i] * 32767;
        // }
        // const byteData = new Uint8Array(byteArray.buffer);
        // const data = wavesurfer.exportPCM(originalBuffer.length);
        var pcmData = wavesurfer.exportPCM(1024, 10000, true);
        console.log(pcmData);
        // console.log('orgin: ', originalBuffer);
        // console.log('buffer', buffer);
        // console.log("data: ", data);

        let request_data = {
            'seed': dataLabel[0]['seed'],
            'item_id': dataLabel[0]['id'],
            'start_time': region.start,
            'end_time': region.end,
            'url': audioUrl,
        }
        const fetchAPI = async () => {
            await axios.post(process.env.REACT_APP_API_PREDICT, request_data, 
                {
                    headers: {
                        'Content-Type': 'Application/json',
                    },
                }
            ) 
            .then(response => {
                const response_data = response.data.data;

                const newDataTable = [...dataTable];
                // show current
                newDataTable[currentRowDataTableIndex].predict_kaldi = response_data.predict_kaldi
                newDataTable[currentRowDataTableIndex].predict_wenet = response_data.predict_wenet
                
                // update current data
                updateDataTablePerCell(currentRowDataTableIndex, "predict_kaldi", response_data.predict_kaldi);
                updateDataTablePerCell(currentRowDataTableIndex, "predict_wenet", response_data.predict_wenet);

                // setDataTable(newDataTable);
                // updateResultLabel(newDataTable);
            })  
            .catch(error => {console.log(error)})            
        }
        fetchAPI();
        // call api show predict here
    }
    
    // updateDataAnnotations(dataTable);
    const columns = [
        {
            title: "Start Time",
            dataIndex: "start_time",
            key: "start_time",
            width: "5%",
        },
        {
            title: "End Time",
            dataIndex: "end_time",
            key: "end_time",
            width: "5%",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "40%",
            editInput: true,
        },
        {
            title: "Audibility",
            dataIndex: "audibility",
            key: "audibility",
            width: "10%",
            editSelectOption: [
                {value: "good", color: "blue"}, 
                {value: "audible", color: "green"}, 
                {value: "bad", color: "red"}
            ]
        },
        {
            title: "Noise",
            dataIndex: "noise",
            key: "noise",
            width: "10%",
            editSelectOption: [
                {value:"heavy", color: "red"},
                {value:"medium", color: "orange"},
                {value:"light", color: "green"},
                {value:"clean", color: "blue"}
            ]
        },
        {
            title: "Region",
            dataIndex: "region",
            key: "region",
            width: "10%",
            editSelectOption: [
                {value:"heavy", color: "red"},
                {value:"medium", color: "orange"},
                {value:"light", color: "green"},
                {value:"clean", color: "blue"}
            ]
        },
        {
            title: "Operations",
            dataIndex: "operations",
            key: "operations",
            width: "5%",
            buttonTypes: [
                {type: 'delete', handleFunction: handleDeleteRow}
            ],
        }
    ]
    
    function setPlaybackRate(rate) {
        wavesurfer?.setPlaybackRate(rate)
    }

    const onClickSettingButton = (value) => {

        if (value && value.keyPath.includes("PlaybackSpeed")) {
            setPlaybackRate(value.key)
        }
    };

    function getItem(label, key, icon, children, type) {
        return {
          key,
          icon,
          children,
          label,
          type,
        };
    }

    const items = [
        getItem('Playback speed', 'PlaybackSpeed', <PlayCircleOutlined />, [
            getItem(
                null, 
                'groupPlaybackSpeed', 
                null, 
                [getItem('0.25', '0.25'), getItem('0.5', '0.5'), getItem('Normal', '1.0'), getItem('1.5', '1.5'), getItem('2.0', '2.0')], 
                'group'
            ),
        ]),
    ]

    // tach code ra thanh 1 file rieng
    const contentIconSetting = (
        <>
            <Menu 
                onClick={onClickSettingButton}
                items={items}
                mode="inline"
            />
        </>
    );

    return (
        
        <div >
            <div className={cx("row")}>
                <p></p>
            </div>
            <div className={cx('row')}>
                {Object.keys(dataLabel).length ? (
                    <div>
                        <div ref={waveRef}></div>
                        <div ref={timelineRef}></div>
                    </div>
                ) : (
                    <div>
                        <h2>Audio not found</h2>
                        <div ref={waveRef}></div>
                        <div ref={timelineRef}></div>
                    </div>)
                }
            </div>
            <div className={cx("row")} style={{padding: 15}} onClick={()=>{setSelectedRegionKey(null)}}>
                <div className={cx("col")} style={{ textAlign: "right"}}>
                    <Popover trigger="click" title="Setting" content={contentIconSetting} placement="leftTop">
                        <SettingOutlined  style={{fontSize: '25px', paddingRight: 15}}/>
                    </Popover>
                </div>
            </div>

            <div className={cx("row")} style={{zIndex: 999}}>
                    <TableWaveform
                        columns={columns}
                        dataTable={dataTable}
                        setDataTable={setDataTable}
                        updateDataTablePerCell={updateDataTablePerCell}
                        loading={tableLoading}
                        playWaveform={wavesurfer}

                        setSelectedRegionKey={setSelectedRegionKey}
                        selectedRegionKey={selectedRegionKey}
                        setFocusCell={setFocusCell}
                        focusCell={focusCell}

                        updateWavesurferByDataTable={updateWavesurferByDataTable}


                        handleDeleteRow={handleDeleteRow}
                        handleShowPredictRow={handleShowPredictRow}
                    />    
            </div>
        </div >
       
    );
}


export default WaveformReview;
