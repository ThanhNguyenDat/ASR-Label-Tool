import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";

function Waveform(props) {
  const { audioUrl, options } = props;

  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const waveRef = useRef(null);

  const defaultOptions = {};

  useEffect(() => {
    const wavesurferOptions = options || defaultOptions;
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
  }, [audioUrl]);

  useEffect(() => {
    if (wavesurfer && isPlaying) {
      wavesurfer.on("finish", () => {
        if (!options?.autoPlay.value) setIsPlaying(false);
      });
    }
  }, [isPlaying]);

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

  return (
    <div>
      <div ref={waveRef}></div>
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
}

export default Waveform;
