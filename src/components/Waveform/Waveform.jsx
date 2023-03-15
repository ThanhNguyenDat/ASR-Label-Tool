import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";

import styles from "./Waveform.scss";

import { randomColor } from "../../utils";

const cx = classNames.bind(styles);

function Waveform(props) {
  const { audioUrl, options, setAnnotations } = props;

  const [wavesurfer, setWavesurfer] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const waveRef = useRef(null);

  const defaultOptions = {};

  const wavesurferOptions = options || defaultOptions;

  useEffect(() => {
    // create wavesurfer with plugins
    const wavesurferInstance = WaveSurfer.create({
      container: waveRef.current,
      plugins: [RegionsPlugin.create()],
      ...wavesurferOptions,
    });
    console.log("url:", audioUrl);
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
          color: randomColor(0.1),
        });
        e.shiftKey ? region.playLoop() : region.play();

        setIsPlaying(true);
      });
      wavesurfer.on("region-click", editAnnotaion);

      // show description in head
      wavesurfer.on("region-in", showNote);

      wavesurfer.on("region-play", function (region) {
        region.once("out", function () {
          // console.log("end of region");
          setIsPlaying(false);
        });
      });

      // delete
      document
        .querySelector('[data-action="delete-region"]')
        .addEventListener("click", function () {
          let form = document.getElementById("editForm");
          let regionId = form.dataset.region;
          if (regionId) {
            wavesurfer.regions.list[regionId].remove();
            form.reset();
          }
        });
    }
  }, [wavesurfer]);

  /**
   * Display annotation.
   */
  function showNote(region) {
    if (!showNote.el) {
      showNote.el = document.querySelector("#subtitle");
    }
    showNote.el.textContent = region.data.note || "-";
  }

  /**
   * Edit annotation for a region.
   */
  function editAnnotaion(region) {
    let form = document.getElementById("editForm");

    form.style.opacity = 1;
    form.elements.start_time.value = Math.round(region.start * 10) / 10;
    form.elements.end_time.value = Math.round(region.end * 10) / 10;
    form.elements.description.value = region.data.note || "";

    form.onsubmit = function (e) {
      e.preventDefault();
      region.update({
        start: form.elements.start_time.value,
        end: form.elements.end_time.value,
        data: {
          note: form.elements.description.value,
        },
      });
      form.style.opacity = 1;
    };
    form.onreset = function () {
      form.style.opacity = 0;
      form.dataset.region = null;
    };

    form.dataset.region = region.id;
  }
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

    console.log("final data: ", data);
    setAnnotations(data);
  };

  return (
    <div className={cx("container")}>
      <p id="subtitle" className={cx("text-center text-info")}>
        &nbsp;
      </p>
      <div ref={waveRef}></div>
      <div className={cx("row")}>
        <div className={cx("col-sm-10")}>
          <p>Click on a region to enter an annotation.</p>
        </div>
        <div class="col-sm-2">
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
      <div>
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
    </div>
  );
}

export default Waveform;
