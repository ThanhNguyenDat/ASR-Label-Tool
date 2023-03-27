import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
// import { WaveSurfer } from 'wavesurfer-react';
import WaveSurfer from "wavesurfer.js";

import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";

import { Table, Tag } from "antd";

import styles from "./Waveform.scss";

import { randomColor } from "@utils/randomColor";
import { useHotkeys } from "react-hotkeys-hook";


const cx = classNames.bind(styles);

function Waveform(props) {
    // console.log('wave component: ', window.AL);

    let { commonInfo, dataLabel, annotations, setAnnotations } = props;
    // const [dataLabelInfo, setDataLabelInfo] = useState({})

    const [wavesurfer, setWavesurfer] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);

    const [lengthWavesurfer, setLengthWavesurfer] = useState(0);
    const [dataTable, setDataTable] = useState([]);

    const [audioUrl, setAudioUrl] = useState(dataLabel[0]['file_name'])

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

    useHotkeys(["command+c", "ctrl+c"], () => { })

    useHotkeys("delete", () => {
        if (wavesurfer && selectedRegion) {
            wavesurfer.regions.list[selectedRegion.id].remove();
            setSelectedRegion(null);
        }
    })

    // useEffect(() => {
    //     if (dataLabels) {
    //         if (dataLabels.hasOwnProperty('data') && dataLabels['data'].length > 0) {
    //             setAudioUrl(dataLabels['data'][0]['file_name']) // set first data item
    //             const _data_label_info = {}
    //             _data_label_info['data_cat_id'] = dataLabels['data'][0]['data_cat_id']
    //             _data_label_info['dataset_id'] = dataLabels['data'][0]['dataset_id']
    //             _data_label_info['seed'] = dataLabels['data'][0]['seed']
    //             _data_label_info['item_id'] = dataLabels['data'][0]['id']
    //             setDataLabelInfo(_data_label_info)
    //         }

    //         if (dataLabels.hasOwnProperty('annotations')) {
    //             setAnnotations(dataLabels['annotations'])
    //         }
    //     }
    // }, [dataLabels])

    useEffect(() => {
        if (dataLabel.length > 0) {
            setAudioUrl(dataLabel[0]['file_name'])
        }

    }, [dataLabel])

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

                // load annotations
                if (annotations.length > 0) {
                    // clear all regions in wavesurfer
                    wavesurferInstance.clearRegions();

                    // load new anntations
                    loadRegions(annotations, wavesurferInstance);
                    updateLengthWavesurfer(wavesurferInstance);
                }

                setWavesurfer(wavesurferInstance);
                // setIsPlaying(false);
            });
        }

        return () => {
            wavesurferInstance.destroy();
        };
    }, [dataLabel[0]['file_name']]);

    // handle event and regions
    useEffect(() => {


        if (wavesurfer) {
            // enable drag select
            wavesurfer.on("ready", function (region) {
                wavesurfer.enableDragSelection({
                    color: randomColor(0.1),
                });
            });

            wavesurfer.on("region-created", function (region, event) {
                region.update({
                    color: randomColor(0.6),
                });
            });

            // autoPlay labeled region when click
            wavesurfer.on("region-click", function (region, event) {
                event.stopPropagation();
            });

            wavesurfer.on("region-dblclick", function (region, event) {
                region.update({
                    color: randomColor(0.6),
                });
            });

            // edit annotaion
            wavesurfer.on("region-click", (region, event) => {
                event.preventDefault();
                editAnnotaion(region);
            });


            // delete region
            const delete_region = document.querySelector(
                '[data-action="delete-region"]'
            );
            delete_region.addEventListener("click", deleteAnnotaion);
            return () => {
                delete_region.removeEventListener("click", deleteAnnotaion);
            };
        }
    }, [wavesurfer]);

    /**
     * Handle annotaions
     */
    useEffect(() => {
        if (wavesurfer) {
            wavesurfer.on("region-created", () => {
                updateDataAnnotations(wavesurfer)
                console.log("wavesufer update: ", wavesurfer.regions.list);
            })

            // Set Annotaions and Length Wavesurfer
            wavesurfer.on("region-updated", (region) => {
                updateLengthWavesurfer(wavesurfer);

                // update form infor
                let form = document.getElementById("editForm");
                updateForm(form, region)
                setSelectedRegion(region)
            });

            // Create new region
            wavesurfer.on("region-update-end", (region, event) => {
                // setIsPlaying(true);
                setSelectedRegion(region);
                region.play();

                if (region.end < region.start || region.end - region.start < 0.08) {
                    // alert("You should expand the labeling region")
                    region.remove()
                }
            });

            // handle replay
            wavesurfer.on("region-click", (region, event) => {
                // setIsPlaying(true);
                setSelectedRegion(region);
                // event.shiftKey ? region.playLoop() : region.play();

                region.play()
                if (event.shiftKey) {
                    console.log("shift key");
                    region.update({
                        loop: true
                    })
                    // region.playLoop();
                } else {
                    console.log("non shift key");
                    region.update({
                        loop: false
                    })
                    // region.play();
                }


                console.log("wavesurfer", wavesurfer);
                console.log("region: ", region);
            });

            wavesurfer.on("region-play", function (region) {
                region.once("out", function () {
                    // isReplaying ? setIsPlaying(true) : setIsPlaying(false);
                });
            });
        }
    }, [lengthWavesurfer, wavesurfer]);

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
        updateLengthWavesurfer(wavesurfer);
    };

    /**
     * Update length
     */
    const updateLengthWavesurfer = (wavesurfer) => {

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
            };
        });

        setLengthWavesurfer(wavesuferArray.length);
        setDataTable(_dataTable);
    };

    /**
     * Edit annotation for a region.
     */
    function editAnnotaion(region) {
        let form = document.getElementById("editForm");
        updateForm(form, region)

        form.onsubmit = function (e) {
            e.preventDefault();
            const start = form.elements.start_time.value;
            const end = form.elements.end_time.value;
            if (end > start) {
                region.update({
                    start: start,
                    end: end,
                    data: {
                        note: form.elements.description.value,
                    },
                });
            } else {
                // alert("End time must be greater start time");
                form.elements.start_time.value = region.start; // Math.round(region.start * 10) / 10;
                form.elements.end_time.value = region.end; // Math.round(region.end * 10) / 10;
            }
        };

        form.onreset = function () {
            form.dataset.region = null;
        };
        form.dataset.region = region.id;
    }


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
        // setDataLabels({
        //     data: dataLabel,
        //     annotations: list_formatted_anns
        // })
        setAnnotations(list_formatted_anns)
    }

    const handleSaveRegion = (event) => {
        if (selectedRegion) {
            event.preventDefault();
            let form = document.getElementById("editForm")
            const start = form.elements.start_time.value;
            const end = form.elements.end_time.value;
            if (end > start) {
                selectedRegion.update({
                    start: start,
                    end: end,
                    data: {
                        note: form.elements.description.value,
                    },
                });
            } else {
                // alert("End time must be greater start time");
                form.elements.start_time.value = selectedRegion.start; // Math.round(region.start * 10) / 10;
                form.elements.end_time.value = selectedRegion.end; // Math.round(region.end * 10) / 10;
            }
            updateDataAnnotations(wavesurfer)
        }
    }

    /**
     * Delete annotaion for a region
     */
    function deleteAnnotaion() {
        let form = document.getElementById("editForm");

        let regionId = form.dataset.region;
        if (regionId) {
            wavesurfer.regions.list[regionId].remove();
            form.reset();
        }
        updateLengthWavesurfer(wavesurfer);
    }

    const updateForm = (form, region, roundRate = 100) => {
        // update form infor
        form.elements.start_time.value = Math.round(region.start * roundRate) / roundRate;
        form.elements.end_time.value = Math.round(region.end * roundRate) / roundRate;
        form.elements.description.value = region.data.note || "";
    }

    return (
        <div className={cx("container overflow-hidden")}>
            <div className={cx("row")}>
                {/* <p id="subtitle" className={cx("text-center text-info")}>
                    &nbsp;
                </p> */}
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
                <div className={cx("col-sm-9")}>
                    <div className={cx("row")}>
                        <form className={cx("edit form h-100")} id="editForm" >
                            <div className={cx('row')}>
                                <div className={cx('col-9')}>
                                    <div className={cx("row")}>
                                        <div className={cx("col-4")}>
                                            <div className={cx("form-group")} style={{ paddingLeft: 10 }}>
                                                <div className={cx("col")}>
                                                    <div className={cx("row")}>
                                                        <label htmlFor="start_time">Start Time</label>
                                                    </div>
                                                    <div className={cx("row")}>
                                                        <input className={cx("form-control")} id="start_time" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx("form-group")} style={{ paddingLeft: 10, paddingTop: 20 }}>
                                                <div className={cx('col')}>
                                                    <div className={cx('row')}>
                                                        <label htmlFor="end_time">End Time</label>
                                                    </div>
                                                    <div className={cx('row')}>
                                                        <input className={cx("form-control")} id="end_time" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx("col-8")}>
                                            <div className={cx("form-group")}>
                                                <label htmlFor="description">Description</label>
                                                <textarea
                                                    className={cx("form-control")}
                                                    id="description"
                                                    name="description"
                                                    rows={5}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className={cx("col-3")}>
                                    <div className={cx('col')}>
                                        <div className={cx('col')}>
                                            <label></label>
                                        </div>
                                        <div className={cx("col")}>
                                            <button type="button" onClick={handleSaveRegion} className={cx("btn btn-success btn-block w-100")}>
                                                Save
                                            </button>
                                        </div>
                                        <div className={cx('col')} style={{ paddingTop: 10 }}>
                                            <label>or</label>
                                        </div>
                                        <div className={cx("col")} style={{ paddingTop: 10 }}>
                                            <button
                                                type="button"
                                                className={cx("btn btn-block btn-danger w-100")}
                                                data-action="delete-region"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className={cx("col-sm-3")}>
                    {dataTable && (
                        <Table
                            pagination={{ pageSize: 5 }}
                            dataSource={dataTable}
                            columns={[
                                // { title: "Index", dataIndex: "id", key: "id" },
                                {
                                    title: "Start Time",
                                    dataIndex: "start_time",
                                    key: "start_time",
                                },
                                { title: "End Time", dataIndex: "end_time", key: "end_time" },
                                {
                                    title: "Description",
                                    dataIndex: "description",
                                    key: "description",
                                },
                                // {
                                //     title: "Color",
                                //     dataIndex: "color",
                                //     key: "color",
                                //     render: (_, { color }) => (
                                //         <>
                                //             <Tag color={color} key={color}>
                                //                 {color}
                                //             </Tag>
                                //         </>
                                //     ),
                                // },
                            ]}
                        ></Table>
                    )}
                </div>
            </div>
        </div >
    );
}

export default Waveform;
