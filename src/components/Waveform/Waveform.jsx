import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import TimelinePlugin from "wavesurfer.js/src/plugin/timeline";
/**
 * Random RGBA color.
 */
function randomColor(alpha) {
  return (
    "rgba(" +
    [
      ~~(Math.random() * 255),
      ~~(Math.random() * 255),
      ~~(Math.random() * 255),
      alpha || 1,
    ] +
    ")"
  );
}

function Waveform(props) {
  const { audioUrl, options } = props;

  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [regions, setRegions] = useState([]);
  const [clickRegion, setClickRegion] = useState(false);

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

    if (audioUrl) {
      wavesurferInstance.load(audioUrl);
    }

    setWavesurfer(wavesurferInstance);
    setIsPlaying(false);

    return () => {
      wavesurferInstance.destroy();
    };
  }, [audioUrl, wavesurferOptions]);

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on("ready", function () {
        wavesurfer.enableDragSelection({
          color: randomColor(0.1),
        });
        if (localStorage.regions) {
          loadRegions(JSON.parse(localStorage.regions));
        } else {
          fetch("annotaions.json")
            .then((r) => r.json())
            .then((data) => {
              loadRegions(data);
              saveRegions();
            });
        }
      });

      wavesurfer.on("region-click", function (region, e) {
        e.stopPropagation();
        e.shiftKey ? region.playLoop() : region.play();
      });

      //   wavesurfer.on("region-click", editAnnotation);

      wavesurfer.on("region-in", showNote);

      //   wavesurfer.on("region-play", function (region) {
      //     region.once("out", function () {
      //       wavesurfer.play(region.start);
      //       wavesurfer.pause();
      //     });
      //   });
    }
  }, [loadRegions, wavesurfer]);

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

  /**
   * Save annotations to localStorage.
   */
  function saveRegions() {
    localStorage.regions = JSON.stringify(
      Object.keys(wavesurfer.regions.list).map(function (id) {
        let region = wavesurfer.regions.list[id];
        return {
          start: region.start,
          end: region.end,
          attributes: region.attributes,
          data: region.data,
        };
      })
    );
  }

  /**
   * Load regions from localStorage.
   */
  function loadRegions(regions) {
    regions.forEach(function (region) {
      region.color = randomColor(0.1);
      wavesurfer.addRegion(region);
    });
  }

  /**
   * Display annotation.
   */
  function showNote(region) {
    if (!showNote.el) {
      showNote.el = document.querySelector("#subtitle");
    }
    let text = region.start + " - " + region.end;
    showNote.el.textContent = region.description || text;
  }

  /**
   * Edit annotation for a region.
   */
  function editAnnotation(region) {
    let form = document.forms.edit;

    form.style.opacity = 1;
    form.elements.start.value = Math.round(region.start * 10) / 10;
    form.elements.end.value = Math.round(region.end * 10) / 10;
    form.elements.description.value = region.description || "";

    form.onsubmit = function (e) {
      e.preventDefault();
      region.update({
        start: form.elements.start.value,
        end: form.elements.end.value,
        description: form.elements.description.value,
      });
      form.style.opacity = 0;
    };

    form.onreset = function () {
      form.style.opacity = 0;
      form.dataset.region = null;
    };
    form.dataset.region = region.id;
  }

  return (
    <div>
      <p id="subtitle" class="text-center text-info">
        &nbsp;
      </p>
      <div ref={waveRef}></div>
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>

      <div>
        <form className="edit">
          <div className="form-group">
            <label for="start">Start Time</label>
            <input className="form-control" id="start" name="start" />
          </div>

          <div className="form-group">
            <label for="end">End Time</label>
            <input className="form-control" id="end" name="end" />
          </div>

          <div className="form-group">
            <label for="description">Description Time</label>
            <input
              className="form-control"
              id="description"
              name="description"
            />
          </div>

          <button type="submit" className="btn btn-success btn-block">
            Save
          </button>
          <button type="button" data-action="delete-region">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

export default Waveform;
