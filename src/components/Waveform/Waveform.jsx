import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";

import WaveSurfer from "wavesurfer.js";
// import { WaveSurfer } from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";

import styles from "./Waveform.scss";

import { randomColor } from "../../utils";
import { Table, Tag } from "antd";

const cx = classNames.bind(styles);

function Waveform(props) {
  const { audioUrl, options } = props;

  const [wavesurfer, setWavesurfer] = useState(null);

  const [annotaions, setAnnotations] = useState([]);
  const [lengthWavesurfer, setLengthWavesurfer] = useState(0);
  const [dataTable, setDataTable] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);

  const waveRef = useRef(null);

  const defaultOptions = {};

  const wavesurferOptions = options || defaultOptions;

  /*
   * Initial wavesurfer
   */
  useEffect(() => {
    // create wavesurfer with plugins
    const wavesurferInstance = WaveSurfer.create({
      container: waveRef.current,
      plugins: [
        RegionsPlugin.create(),
        MinimapPlugin.create({
          height: 30,
          waveColor: "#ddd",
          progressColor: "#999",
          cursorColor: "#999",
        }),
      ],
      ...wavesurferOptions,
    });

    if (audioUrl) {
      wavesurferInstance.load(audioUrl);
    }

    setWavesurfer(wavesurferInstance);
    setIsPlaying(false);

    return () => {
      wavesurferInstance.destroy();
    };
  }, [audioUrl, wavesurferOptions]);

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
      wavesurfer.on("ready", function () {
        wavesurfer.enableDragSelection({
          color: randomColor(0.1),
        });
      });

      // autoPlay labeled region when click
      wavesurfer.on("region-click", function (region, e) {
        e.stopPropagation();
        region.update({
          color: randomColor(0.6),
        });

        // Play on dont replay, loop on replay
        // e.shiftKey ? region.playLoop() : region.play();
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
        updateLengthWavesurfer();
      });

      wavesurfer.on("region-update-end", (region) => {
        setIsPlaying(true);
        region.play();
      });

      // handle replay
      wavesurfer.on("region-click", (region) => {
        setIsPlaying(true);
        console.log("region: ", region.start, region.end);

        // wavesurfer.play(region.start, region.end);
        region.play();

        if (isReplaying) {
          // region.playLoop();
          region.update({
            loop: true,
          });
        } else {
          region.update({
            loop: false,
          });
        }
      });

      wavesurfer.on("region-play", function (region) {
        region.once("out", function () {
          console.log("is replay: ", isReplaying);

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

  /**
   * Update length
   */
  const updateLengthWavesurfer = () => {
    const wavesuferObjs = wavesurfer.regions.list;
    const wavesuferArray = Object.values(wavesuferObjs);

    const _dataTable = wavesuferArray.map((region, index, array) => {
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
    setAnnotations(wavesuferArray);
    setDataTable(_dataTable);
  };

  /**
   * Edit annotation for a region.
   */
  function editAnnotaion(region) {
    let form = document.getElementById("editForm");

    form.style.opacity = 1;
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
        form.style.opacity = 1;
      } else {
        alert("End time must greater start time");
        form.elements.start_time.value = region.start; // Math.round(region.start * 10) / 10;
        form.elements.end_time.value = region.end; // Math.round(region.end * 10) / 10;
      }
    };

    form.onreset = function () {
      form.style.opacity = 0;
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
    updateLengthWavesurfer();
  }

  // Handle Replay
  const replayRegion = (event) => {
    console.log("click: ", event.target.checked);
    setIsReplaying(event.target.checked);
  };

  /**
   * Handle button
   */

  // Handle Play or Pause audio
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

    const data = full_region_annotaions.map((region, index, array) => {
      return {
        start_time: region.start,
        end_time: region.end,
        description: region.data.note || "",
      };
    });
    console.log("bool: ", data.length);
    console.log("final data: ", data);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("row")}>
        <p id="subtitle" className={cx("text-center text-info")}>
          &nbsp;
        </p>
      </div>
      <div ref={waveRef}></div>
      <div className={cx("row")}>
        <div className={cx("col-sm-10")}>
          <p>Click on a region to enter an annotation.</p>
        </div>
        <div className={cx("col-sm-2")}>
          <div className={cx("form-check")}>
            <label
              className={cx("form-check-label")}
              htmlFor="btn-check-replay"
            >
              Replay
            </label>

            <input
              className={cx("form-check-input")}
              type="checkbox"
              id="btn-check-replay"
            />
          </div>

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
          <button
            onClick={handleSubmit}
            className={cx("btn btn-success btn-block")}
          >
            Submit
          </button>
        </div>
      </div>
      <div className={cx("row")}>
        <form className={cx("edit")} id="editForm">
          <div className={cx("form-group")}>
            <label htmlFor="start">Start Time</label>
            <input className={cx("form-control")} id="start_time" />
          </div>

          <div className={cx("form-group")}>
            <label htmlFor="end">End Time</label>
            <input className={cx("form-control")} id="end_time" />
          </div>

          <div className={cx("form-group")}>
            <label htmlFor="description">Description</label>
            <textarea
              className={cx("form-control")}
              id="description"
              name="description"
              rows={3}
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
      <div className={cx("row")}>
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
  );
}

export default Waveform;
