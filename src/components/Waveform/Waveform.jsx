import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
// import { WaveSurfer } from 'wavesurfer-react';
import WaveSurfer from "wavesurfer.js";

import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";

import { Form, Input, Table, Tag } from "antd";

import styles from "./Waveform.scss";

import { randomColor } from "@utils/randomColor";
import { useHotkeys } from "react-hotkeys-hook";

import {iterifyArr} from '@utils/common/customArray'

const cx = classNames.bind(styles);

function Waveform(props) {
    let { commonInfo, dataLabel, annotations, setAnnotations } = props;
    const audioUrl = dataLabel[0]["file_name"]

    const [form] = Form.useForm();

    const [wavesurfer, setWavesurfer] = useState(null);
    const [selectedRegionKey, setSelectedRegionKey] = useState();

    const [dataTable, setDataTable] = useState([]);
    const [focusCell, setFocusCell] = useState({ row: null, col: null });

    const waveRef = useRef(null);
    const timelineRef = useRef(null);

    useHotkeys("space", () => {
        if (wavesurfer) {
            if (wavesurfer.isPlaying()) {
                wavesurfer.pause();
            } else {
                wavesurfer.play();
            }
        }
    });

    // disable because focus <input description>
    useHotkeys("delete", () => {
        // const row = dataTable.find(data => data.key === selectedRegionKey)
        // const id_wave = row && row.hasOwnProperty("id_wave") ? row.id_wave : null
        const id_wave = getIdByKey(selectedRegionKey);

        if (wavesurfer && id_wave) {
            wavesurfer.regions.list[id_wave].remove();
            updateDataTable(wavesurfer)
            setSelectedRegionKey(null)
        }
    })

    // useHotkeys("tab", (event) => {
    //     event.preventDefault();

    //     // find current cell in table
    //     const activateCell = document.activeElement;
    //     console.log(activateCell);
    // })

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
                RegionsPlugin.create(),
                MinimapPlugin.create({
                    height: 30,
                    waveColor: "#ddd",
                    progressColor: "#999",
                    cursorColor: "#999",
                    scrollParent: false
                }),
            ],
        });

        if (audioUrl) {
            wavesurferInstance.load(audioUrl);
            // audio loaded data
            wavesurferInstance.on("ready", function (region) {
                wavesurferInstance.enableDragSelection({
                    slop: 5,
                    color: randomColor(0.1),
                });

                wavesurferInstance.clearRegions();

                // load new anntations
                loadRegions(annotations, wavesurferInstance);
                updateDataTable(wavesurferInstance);

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
                    color: randomColor(0.6),
                });
                updateDataAnnotations(wavesurfer)
            });

            wavesurfer.on("region-click", function (region, event) {
                event.stopPropagation();

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
            });

            // Set Annotaions and Length Wavesurfer
            wavesurfer.on("region-updated", (region) => {
                updateDataTable(wavesurfer);
                setSelectedRegionKey(region.id);
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
                    color: randomColor(0.6),
                });
            });
        }
    }, [wavesurfer]);

    // handle event
    useEffect(() => {
        wavesurfer?.on("region-click", (region) => {
            const row = dataTable.find((d) => d.id_wave === region.id)
            if (row && row.hasOwnProperty('key')) {
                setSelectedRegionKey(row.key);
                setFocusCell({ row: row.id, col: "description" });
            };

            const rowElement = document.querySelector(`tr[data-row-key="${row?.key}"]`);
            if (rowElement) {
                rowElement.click();

                const des = rowElement.querySelector(`input[data-key="description"]`)
                if (des) des.focus()
            }   
        })

        wavesurfer?.on("region-created", (region) => {
            console.log("update");
            const row = dataTable.find((d) => d.id_wave === region.id)
            if (row && row.hasOwnProperty('key')) {
                setSelectedRegionKey(row.key);
                setFocusCell({ row: row.id, col: "description" });
            };

            const rowElement = document.querySelector(`tr[data-row-key="${row?.key}"]`);
            if (rowElement) {
                rowElement.click();

                const des = rowElement.querySelector(`input[data-key="description"]`)
                if (des) des.focus()
            }   
        })

    }, [dataTable.length])

    /**
     * Load annotations
     */
    const loadRegions = (annotations, wavesurfer) => {
        annotations.forEach((annotation) => {
            annotation.color = randomColor(0.6);
            annotation.data = {};
            annotation.data.note = annotation['content']['text'];
            annotation.start = annotation['content']['index']
            annotation.end = annotation['content']['length'] + annotation['content']['index']
            wavesurfer.addRegion(annotation);
        });
        updateDataTable(wavesurfer);
    };

    /**
     * Update data table
     */
    const updateDataTable = (wavesurfer) => {
        const wavesuferObjs = wavesurfer.regions.list;
        const wavesuferArray = Object.values(wavesuferObjs);
        // sort value by start time
        wavesuferArray.sort((a, b) => a.start - b.start);

        const _dataTable = wavesuferArray.map((region, index) => {
            return {
                key: index,
                id: index,
                start_time: Math.round(region.start * 100) / 100,
                end_time: Math.round(region.end * 100) / 100,
                description: region.data.note,
                color: region.color,
                id_wave: region.id
            };
        });

        setDataTable(_dataTable);
        updateDataAnnotations(wavesurfer);
    };

    const formatDataAnnotaions = (wavesurfer) => {
        if (wavesurfer) {
            const waveArray = Object.values(wavesurfer.regions.list)
            const formatted = waveArray.map((region, index) => {
                return {
                    "class_id": commonInfo[0].id,
                    "class_name": "Human",
                    "tag": {
                        "index": parseInt(region.start * 1000), // start
                        "length": parseInt((region.end - region.start) * 1000), // end - start
                        "text": region.data.note || "" // description
                    },
                    "extra": {
                        "hard_level": 1,
                        "classify": "noise"
                    },
                    'data_cat_id': dataLabel[0]['data_cat_id'],
                    'dataset_id': dataLabel[0]['dataset_id'],
                    'seed': dataLabel[0]['seed'],
                    'item_id': dataLabel[0]['id'],
                }
            })
            return formatted
        }
    }

    const updateDataAnnotations = (wavesurfer) => {
        const list_formatted_anns = formatDataAnnotaions(wavesurfer)
        setAnnotations(list_formatted_anns)
    }

    const updateWavesurferFromDataTable = (updatedDataTable) => {
        updatedDataTable.forEach(data => {
            const id_wave = data['id_wave'];
            wavesurfer.regions.list[id_wave].start = data.start_time;
            wavesurfer.regions.list[id_wave].end = data.end_time;
            wavesurfer.regions.list[id_wave].data.note = data.description;
        })
    }

    function getKeyById (id_wave) {
        // convert table key to wavesurfer id
        const row = dataTable.find(data => data.id_wave = id_wave)
        const key_table = row.key
        return key_table
    }

    function getIdByKey(key_table) {
        // convert wavesurfer id to table key
        const row = dataTable.find(data => data.key === key_table)
        if (row && row.hasOwnProperty("id_wave")) {
            return row.id_wave
        }
        return
        
    }

    return (
        <div className={cx("container overflow-hidden")}>
            <div className={cx("row")}>
                <p></p>
            </div>
            <div className={cx('row')}>
                {Object.keys(dataLabel).length ? (
                    <div>
                        <div ref={timelineRef}></div>
                        <div ref={waveRef}></div>
                    </div>
                ) : (
                    <div>
                        <h2>Audio not found</h2>
                        <div ref={timelineRef}></div>
                        <div ref={waveRef}></div>
                    </div>)
                }
            </div>
            <div className={cx("row")}>
                <p></p>
            </div>

            <div className={cx("row")}>
                {dataTable && (
                    <Form form={form}>
                        <Table
                            pagination={{ pageSize: 5 }}
                            dataSource={dataTable}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: event => {
                                        setSelectedRegionKey(record.key);

                                        form.setFieldsValue({
                                            start_time: record.start_time,
                                            end_time: record.end_time,
                                            description: record.description
                                        })

                                        // play region
                                        const region = wavesurfer.regions.list[record.id_wave]
                                        if (region) {
                                            region.play();
                                        }
                                    },
                                    // onBlur: event => {
                                    //     console.log("onblur: ", record);
                                    //     setSelectedRegionKey(null);
                                    // },
                                    onChange: event => {
                                        let tmp_values = form.getFieldsValue()
                                        
                                        // parse Int
                                        const values = {
                                            ...tmp_values,
                                            start_time: parseFloat(tmp_values.start_time),
                                            end_time: parseFloat(tmp_values.end_time)
                                        }

                                        // update data when change input
                                        let updateData = [...dataTable]

                                        updateData.splice(selectedRegionKey, 1, { ...record, ...values, key: selectedRegionKey })
                                        setDataTable(updateData);


                                        updateWavesurferFromDataTable(updateData);

                                        // update annotation after change value typing
                                        updateDataAnnotations(wavesurfer)
                                    }
                                }
                            }}                            

                            columns={[
                                // { title: "Index", dataIndex: "id", key: "id" },
                                {
                                    title: "Start Time",
                                    dataIndex: "start_time",
                                    key: "start_time",
                                    width: "10%",
                                    onCell: (record, rowIndex) => {
                                        return {
                                            onClick: event => {
                                                setFocusCell({ row: rowIndex, col: "start_time" });
                                            }
                                        }
                                    },
                                    render: (text, record, index) => {
                                        if (record.key === selectedRegionKey) {
                                            const shouldFocus = focusCell.row === index && focusCell.col === "start_time";
                                            
                                            return (<Form.Item
                                                name="start_time"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Enter your start time"
                                                    }
                                                ]}
                                            >
                                                <Input data-key="start_time" autoFocus={shouldFocus}/>
                                            </Form.Item>)
                                        } else {
                                            return <p>{text}</p>
                                        }
                                    }
                                },
                                {
                                    title: "End Time",
                                    dataIndex: "end_time",
                                    key: "end_time",
                                    width: "10%",
                                    onCell: (record, rowIndex) => {
                                        return {
                                            onClick: event => {
                                                setFocusCell({ row: rowIndex, col: "end_time" });
                                            }
                                        }
                                    },
                                    render: (text, record, index) => {
                                        if (record.key === selectedRegionKey) {
                                            const shouldFocus = focusCell.row === index && focusCell.col === "end_time";
                                            
                                            return (
                                                <Form.Item
                                                    name="end_time"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Enter your end time"
                                                        }
                                                    ]}
                                                >
                                                    <Input data-key="end_time" autoFocus={shouldFocus}/>
                                                </Form.Item>)
                                        } else {
                                            return <p>{text}</p>
                                        }
                                    }
                                },
                                {
                                    title: "Description",
                                    dataIndex: "description",
                                    key: "description",
                                    width: "70%",
                                    onCell: (record, rowIndex) => {
                                        return {
                                            onClick: event => {
                                                setFocusCell({ row: rowIndex, col: "description" });
                                            }
                                        }
                                    },
                                    render: (text, record, index) => {
                                        if (record.key === selectedRegionKey) {
                                            const shouldFocus = focusCell.row === index && focusCell.col === "description";
                                            
                                            return (<Form.Item
                                                name="description"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Enter your description"
                                                    }
                                                ]}
                                            >
                                                <Input data-key="description" autoFocus={shouldFocus}/>
                                            </Form.Item>)
                                        } else {
                                            return <p>{text}</p>
                                        }
                                    }
                                },
                                {
                                    title: "Operations",
                                    dataIndex: "operations",
                                    key: "operations",
                                    width: "10%",
                                    onCell: record => {
                                        return {
                                            onClick: event => {
                                                event.stopPropagation(); // this will avoid onRow being called
                                            }
                                        }
                                    },
                                    render: (_, record) => {
                                        return (
                                            <>
                                                <button
                                                    className={cx("btn btn-danger")}
                                                    onClick={() => {
                                                        wavesurfer.regions.list[record.id_wave].remove();
                                                        updateDataTable(wavesurfer)

                                                        setSelectedRegionKey(null)

                                                    }}
                                                >Delete</button>
                                            </>
                                        )
                                    }
                                }
                            ]}
                        >
                        </Table>
                    </Form>
                )}
            </div>
        </div >
    );
}

export default Waveform;
