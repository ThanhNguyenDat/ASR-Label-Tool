import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import Modal from "react-modal";

Modal.setAppElement("#root");

const wavesurferOptions = {
  container: "#waveform",
  waveColor: "violet",
  progressColor: "purple",
  plugins: [RegionsPlugin.create()],
};

function Waveform(props) {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoReplay, setAutoReplay] = useState(false);

  const [regions, setRegions] = useState([]);
  const [startPosition, setStartPosition] = useState(null);
  const [regionData, setRegionData] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const waveRef = useRef(null);

  useEffect(() => {
    const options = props.options || {};
    const wavesurferInstance = WaveSurfer.create({
      container: waveRef.current,
      ...options,
    });
    setWavesurfer(wavesurferInstance);

    if (props.url_audio) {
      wavesurferInstance.load(props.url_audio);
    }
    return () => {
      wavesurferInstance.destroy();
    };
  }, [props.url_audio, props.options]);

  useEffect(() => {
    if (wavesurfer && props.url_audio !== wavesurfer.getCurrentTime()) {
      wavesurfer.load(props.url_audio);
      setIsPlaying(false);
    }
  }, [props.url_audio, wavesurfer]);

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

  // Handle Replay audio
  const handleReplay = () => {
    if (wavesurfer && autoReplay) {
      console.log("1");
      wavesurfer.seekTo(0);

      wavesurfer.play();
      setIsPlaying(true);
    }
  };

  // Set enable or disable Replay button
  const handleToggleReplay = () => {
    setAutoReplay(!autoReplay);
  };

  useEffect(() => {
    console.log("auto replay: ", autoReplay);
    if (wavesurfer && autoReplay) {
      wavesurfer.on("finish", handleReplay);
    }
  }, [wavesurfer, autoReplay]);

  // annotaion regions
  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on("region-click", (region) => {
        setRegionData({
          start: region.start,
          end: region.end,
          text: region.data.text,
        });
      });
    }
  }, []);

  return (
    <div>
      <div ref={waveRef}></div>
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={handleToggleReplay}>
        {autoReplay ? "Disable Replay" : "Enable Replay"}
      </button>
    </div>
  );
}

export default Waveform;
