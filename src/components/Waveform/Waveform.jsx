import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";

import WaveSurfer from "wavesurfer.js";
// import { WaveSurfer } from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";

import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";

import styles from "./Waveform.scss";

import { randomColor } from "../../utils/randomColor";
import { Col, InputNumber, Row, Slider, Table, Tag } from "antd";

const cx = classNames.bind(styles);



const data = {
    "annotations": [
        {
            "class_id": 3579,
            "class_name": "Human",
            "content": {
                "index": 2.2, // start
                "length": 3, // end - start
                "text": "alo" // description
            },
            "extra": {
                "hard_level": 1,
                "classify": "noise"
            }
        },
        {
            "class_id": 3579,
            "class_name": "Human",
            "content": {
                "index": 6,
                "length": 3,
                "text": "1234"
            },
            "extra": {
                "hard_level": 0,
                "classify": "normal"
            }
        }
    ],

    "data": [
        {
            "data_cat_id": 2,
            "dataset_id": 1970,
            "seed": 380,
            "id": 2677,
            "file_name": "https://z3s.zaloapp.com/zai/upload/media/2023/3/17/1679022505_113605_1679022505184_23089.jpg" //url
        }
    ]
}


function Waveform(props) {
    console.log('wave component: ', window.AL);

    let { dataLabels } = props;

    const [wavesurfer, setWavesurfer] = useState(null);

    const [lengthWavesurfer, setLengthWavesurfer] = useState(0);
    const [dataTable, setDataTable] = useState([]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isReplaying, setIsReplaying] = useState(false);

    const [audioUrl, setAudioUrl] = useState("")
    const [annotations, setAnnotations] = useState([])

    const waveRef = useRef(null);
    const timelineRef = useRef(null);

    useEffect(() => {
        if (dataLabels) {
            if (dataLabels.hasOwnProperty('data')) {
                setAudioUrl(dataLabels['data'][0]['file_name']) // set first data item
            }

            if (dataLabels.hasOwnProperty('annotations')) {
                setAnnotations(dataLabels['annotations'])
            }
        }
    }, [dataLabels])

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
            maxCanvasWidth: 10,
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
                    color: randomColor(0.1),
                });

                // load annotations
                if (annotations) {
                    loadRegions(annotations, wavesurferInstance);
                    updateLengthWavesurfer(wavesurferInstance);
                }

                setWavesurfer(wavesurferInstance);
                setIsPlaying(false);
            });
        }

        return () => {
            wavesurferInstance.destroy();
        };
    }, [audioUrl]);

    // handle event and regions
    useEffect(() => {
        /**
         * Display annotation.
         */
        function showNote(region) {
            if (!showNote.el) {
                showNote.el = document.querySelector("#subtitle");
            }
            showNote.el.textContent = region.data.note || "-";
        }

        if (wavesurfer) {
            // enable drag select
            wavesurfer.on("ready", function (region) {
                wavesurfer.enableDragSelection({
                    color: randomColor(0.1),
                });
            });

            wavesurfer.on("region-created", function (region) {
                region.update({
                    color: randomColor(0.6),
                });
            });

            // autoPlay labeled region when click
            wavesurfer.on("region-click", function (region, e) {
                e.stopPropagation();
                // region.update({
                //   color: randomColor(0.6),
                // });

                // Play on dont replay, loop on replay
                // e.shiftKey ? region.playLoop() : region.play();
            });

            wavesurfer.on("region-dblclick", function (region, e) {
                region.update({
                    color: randomColor(0.6),
                });
            });

            // edit annotaion
            wavesurfer.on("region-click", editAnnotaion);

            // wavesurfer.on("region-play", function (region) {
            //   region.once("out", function () {
            //     console.log("is replay: ", isReplaying);
            //     isReplaying ? setIsPlaying(true) : setIsPlaying(false);
            //   });
            // });

            // show description in head
            wavesurfer.on("region-in", showNote);

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
            // Set Annotaions and Length Wavesurfer
            wavesurfer.on("region-updated", () => {
                updateLengthWavesurfer(wavesurfer);

            });

            // Create new region
            wavesurfer.on("region-update-end", (region) => {

                setIsPlaying(true);
                region.play();

                if (isReplaying) {
                    region.update({
                        loop: true
                    })
                } else {
                    region.update({
                        loop: false
                    })
                }

                if (region.end < region.start || region.end - region.start < 0.08) {
                    // alert("You should expand the labeling region")
                    region.remove()
                }
            });

            // handle replay
            wavesurfer.on("region-click", (region) => {
                setIsPlaying(true);

                region.play();

            });

            wavesurfer.on("region-play", function (region) {
                region.once("out", function () {
                    isReplaying ? setIsPlaying(true) : setIsPlaying(false);
                });
            });
        }
    }, [isReplaying, lengthWavesurfer, wavesurfer]);


    /**
     * Handle Replay a region with btn-check-replay
     */
    useEffect(() => {
        const btn_check_replay = document.getElementById("btn-check-replay");

        btn_check_replay.addEventListener("click", replayRegion);

        return () => {
            btn_check_replay.removeEventListener("click", replayRegion);
        };
    }, []);

    // Update isReplaying for region chunk
    useEffect(() => {
        if (wavesurfer) {
            Object.values(wavesurfer.regions.list).forEach(region => {
                region.update({
                    loop: isReplaying
                })
            })
        }
    }, [isReplaying, wavesurfer])

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
                start_time: region.start,
                end_time: region.end,
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

        // form.style.opacity = 1;
        form.elements.start_time.value = region.start; // Math.round(region.start * 10) / 10;
        form.elements.end_time.value = region.end; // Math.round(region.end * 10) / 10;
        form.elements.description.value = region.data.note || "";

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
                // form.style.opacity = 1;
            } else {
                alert("End time must be greater start time");
                form.elements.start_time.value = region.start; // Math.round(region.start * 10) / 10;
                form.elements.end_time.value = region.end; // Math.round(region.end * 10) / 10;
            }
        };

        form.onreset = function () {
            // form.style.opacity = 0;
            form.dataset.region = null;
        };
        form.dataset.region = region.id;
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

    // Handle Replay
    const replayRegion = (event) => {
        console.log("checkbox replay: ", event.target.checked);
        setIsReplaying(event.target.checked);


    };

    /**
     * Handle Play/Pause button
     */
    const handlePlayPause = () => {
        if (wavesurfer) {
            if (isPlaying) {
                wavesurfer.pause();
                setIsPlaying(false);
            } else {
                wavesurfer.play();
                setIsPlaying(true);
            }
        }
    };

    /*
     * Handle Submit button
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        let full_region_annotaions = Object.values(wavesurfer.regions.list);

        // format data
        const data = full_region_annotaions.map((region, index, array) => {
            return {
                "postags": [
                    {
                        "class_id": 3579,
                        "class_name": "Human",
                        "content": {
                            "index": region.start,
                            "length": region.end - region.start,
                            "text": region.data.note || ""
                        },
                        "extra": {
                            "hard_level": 0,
                            "classify": "normal"
                        }
                    }
                ],
                "fetch_number": 1 // fixed
            };
        });

        console.log("final data: ", data);
        window.AL.pushResult(data)
        console.log("Push data success");
    };

    return (
        <div className={cx("container")}>
            <div className={cx("row")}>
                <p id="subtitle" className={cx("text-center text-info")}>
                    &nbsp;
                </p>
            </div>

            {Object.keys(dataLabels).length ? (
                <div className={cx('row')}>
                    <div ref={waveRef}></div>
                    <div ref={timelineRef}></div>
                </div>) : (
                <div className={cx('row')}>
                    <h2>Audio not found</h2>
                    <div ref={waveRef}></div>
                    <div ref={timelineRef}>
                    </div>
                </div>)
            }


            <div className={cx("row")}>

                <div className={cx("col-sm-10")}>
                    <p>Click on a region to enter an annotation.</p>
                    {/* <input type="range" min="1" max="200" value={zoom} onChange={e => setZoom(e.target.value)} /> */}
                </div>

                <div className={cx("col-sm-2")}>
                    <div className={cx("form-check")}>
                        <div className={cx("row")}>
                            <div className={cx("col")}>
                                <label
                                    className={cx("form-check-label")}
                                    htmlFor="btn-check-replay"
                                >
                                    Replay
                                </label>
                            </div>
                            <div className={cx("col")}>
                                <input
                                    className={cx("form-check-input")}
                                    type="checkbox"
                                    id="btn-check-replay"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cx('row')}>
                        <div className={cx('col')}>
                            <button
                                onClick={handlePlayPause}
                                className={cx("btn btn-primary btn-block")}
                            >
                                {isPlaying ? (
                                    <span>
                                        <i className={cx("glyphicon glyphicon-pause")}></i>
                                        Pause
                                    </span>
                                ) : (
                                    <span>
                                        <i className={cx("glyphicon glyphicon-play")}></i>
                                        Play
                                    </span>
                                )}
                            </button>
                        </div>
                        <div className={cx('col')}>
                            <button
                                onClick={handleSubmit}
                                className={cx("btn btn-success btn-block")}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx("row")}>
                <div className={cx("col-sm-4")}>
                    <form className={cx("edit")} id="editForm" >
                        <div className={cx("form-group")}>
                            <div className={cx('row')}>
                                <div className={cx('col')}>
                                    <label htmlFor="start">Start Time</label>
                                </div>
                                <div className={cx('col')}>
                                    <input className={cx("form-control")} id="start_time" />
                                </div>
                            </div>
                        </div>

                        <div className={cx("form-group")}>
                            <div className={cx('row')}>
                                <div className={cx('col')}>
                                    <label htmlFor="end">End Time</label>
                                </div>
                                <div className={cx('col')}>
                                    <input className={cx("form-control")} id="end_time" />
                                </div>
                            </div>
                        </div>

                        <div className={cx("form-group")}>
                            <label htmlFor="description">Description</label>
                            <textarea
                                className={cx("form-control")}
                                id="description"
                                name="description"
                                rows={5}
                            />
                        </div>

                        <button type="submit" className={cx("btn btn-success btn-block")}>
                            Save
                        </button>
                        <button
                            type="button"
                            className={cx("btn btn-danger btn-block")}
                            data-action="delete-region"
                        >
                            Delete
                        </button>
                    </form>
                </div>

                <div className={cx("col-sm-8")}>
                    {dataTable && (
                        <Table
                            dataSource={dataTable}
                            columns={[
                                { title: "Index", dataIndex: "id", key: "id" },
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
                                {
                                    title: "Color",
                                    dataIndex: "color",
                                    key: "color",
                                    render: (_, { color }) => (
                                        <>
                                            <Tag color={color} key={color}>
                                                {color}
                                            </Tag>
                                        </>
                                    ),
                                },
                            ]}
                        ></Table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Waveform;
