import classNames from "classnames/bind";
import React, { useEffect, useRef, useState } from "react";
// import { WaveSurfer } from 'wavesurfer-react';
import WaveSurfer from "wavesurfer.js";

import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
// import TimelinePlugin from "wavesurfer.js/src/plugin/timeline";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";
import { PlayCircleOutlined, SettingOutlined } from "@ant-design/icons";


import { useHotkeys } from "react-hotkeys-hook";


import {iterifyArr} from '@utils/common/customArray'
import { randomColor } from "@utils/randomColor";

import TableWaveform from "../../containers/TableWaveform";

import styles from "./Waveform.scss";
import { Button, Menu, Modal, Popover } from "antd";

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
  

function Waveform(props) {
    const start_time = performance.now();
    let { 
        commonInfo, 
        dataLabel, 
        annotations, 

        setResultLabel,
    } = props;
    const audioUrl = dataLabel[0]["file_name"]

    const [wavesurfer, setWavesurfer] = useState(null);
    const [selectedRegionKey, setSelectedRegionKey] = useState();
    // const [lengthWavesurfer, setLengthWavesurfer] = useState(0);

    const [dataTable, setDataTable] = useState([])
    const [focusCell, setFocusCell] = useState({ row: null, col: null });

    const waveRef = useRef(null);
    const timelineRef = useRef(null);

    /*
     * Initial wavesurfer
     */
    useEffect(() => {
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
                // MinimapPlugin.create({
                //     height: 30,
                //     waveColor: "#ddd",
                //     progressColor: "#999",
                //     cursorColor: "#999",
                //     scrollParent: false
                // }),
            ],
        });

        if (audioUrl) {
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
            });
            
        }

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
                console.log("wavesurfer: ", wavesurfer.regions.list);
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
        annotations.map((annotation, index) => {
            const region = {}
            region.color = randomColor(0.2);
            region.data = {};
            
            region.start = annotation.content.index
            region.end = annotation.content.length + annotation.content.index
            region.data.note = annotation.content.text;
            
            region.data.audibility = annotation.extra?.classify?.audibility || "good";
            region.data.noise = annotation.extra?.classify?.noise || "clean";
            region.data.echo = annotation.extra?.classify?.echo || "clean";
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

                key: index,        
                id: index,
                wave_id: region.id,
                
                start_time: Math.round(region.start * 1000) / 1000,
                end_time: Math.round(region.end * 1000) / 1000,
                description: region.data.note,
                color: region.color,

                audibility: region.data.audibility || "good",
                noise: region.data.noise || "clean",
                echo: region.data.echo || "clean"
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
            })        
        }
    }

    /**
     * Update data table
     */
    const updateDataTablePerCell = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        console.log(`update data table info: ${rowIndex} ${columnId} ${value}`)
        
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
    const formatResultLabel = (dataTable) => {
        const formatted = dataTable.map((data, index) => {
            return {
                "class_id": commonInfo[0]?.id || undefined,
                "class_name": "Human",
                "tag": {
                    "index": parseInt(data.start_time * 1000),
                    "length": parseInt(data.end_time * 1000),
                    "text": data.description || "",
                },
                "extras": {
                    "hard_level": 1,
                    "classify": {
                        "audibility": data.audibility,
                        "noise": data.noise,
                        "echo": data.echo,
                    }
                },
                'data_cat_id': dataLabel[0]['data_cat_id'],
                'dataset_id': dataLabel[0]['dataset_id'],
                'seed': dataLabel[0]['seed'],
                'item_id': dataLabel[0]['id'],
            }
        });
        
        return formatted;
        // if (wavesurfer) {
        //     const waveArray = Object.values(wavesurfer.regions.list)
        //     const formatted = waveArray.map((region, index) => {
        //         return {
        //             "class_id": commonInfo[0].id,
        //             "class_name": "Human",
        //             "tag": {
        //                 "index": parseInt(region.start * 1000), // start
        //                 "length": parseInt((region.end - region.start) * 1000), // end - start
        //                 "text": region.data.note || "" // description
        //             },
        //             "extra": {
        //                 "hard_level": 1,
        //                 "classify": {
        //                     "audibility": region.data.audibility,
        //                     "noise": region.data.noise,
        //                     "echo": region.data.echo
        //                 }
        //             },
        //             'data_cat_id': dataLabel[0]['data_cat_id'],
        //             'dataset_id': dataLabel[0]['dataset_id'],
        //             'seed': dataLabel[0]['seed'],
        //             'item_id': dataLabel[0]['id'],
        //         }
        //     })
        //     return formatted
        // }
    }

    const updateResultLabel = (dataTable) => {
        const list_formatted_anns = formatResultLabel(dataTable)
        setResultLabel(list_formatted_anns)
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
            title: "Echo",
            dataIndex: "echo",
            key: "echo",
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

    function handleDeleteRow(record) {
        wavesurfer.regions.list[record.wave_id].remove();
        const newDataTable = [...dataTable];
        const id = newDataTable.findIndex((item) => item.wave_id === record.wave_id);
        newDataTable.splice(id, 1);
        
        setDataTable(newDataTable)
        updateResultLabel(newDataTable)
        setSelectedRegionKey(null);
    }


    function setPlaybackRate(rate) {
        wavesurfer?.setPlaybackRate(rate)
    }

    const onClickSettingButton = (value) => {
        console.log('click ', value);

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

    const end_time = performance.now();
    console.log(`Thời gian render waveform: ${end_time - start_time} ms`);
    return (
        
        <div className={cx("overflow-hidden")}>
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
            <div className={cx("row")} style={{padding: 15}}>
                <div className={cx("col")} style={{ textAlign: "right"}}>
                    <Popover trigger="click" title="Setting" content={contentIconSetting} placement="leftTop">
                        <SettingOutlined  style={{fontSize: '25px', paddingRight: 15}}/>
                    </Popover>
                </div>
            </div>

            <div className={cx("row")}>
                    <TableWaveform
                        columns={columns}
                        dataTable={dataTable}
                        setDataTable={setDataTable}
                        updateDataTablePerCell={updateDataTablePerCell}

                        playWaveform={wavesurfer}

                        setSelectedRegionKey={setSelectedRegionKey}
                        selectedRegionKey={selectedRegionKey}
                        setFocusCell={setFocusCell}
                        focusCell={focusCell}

                        updateWavesurferByDataTable={updateWavesurferByDataTable}

                    />    
            </div>
        </div >
       
    );
}


export default Waveform;
