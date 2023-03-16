import { useEffect, useState } from "react";
import Waveform from "../../components/Waveform";
import useScript from "../../hooks/useScript";

// const _audioUrl =
//   "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3"; // bi loi

// const _audioUrl =
//   "https://assets.mixkit.co/active_storage/sfx/1714/1714-preview.mp3"; // khoong bi loi

function ASRAnnotaionPage() {
  // useScript({ url: "https://label.lab.zalo.ai/ui/ailab_ui_api.js" });

  const [options, setOptions] = useState({
    height: 100,
    pixelRatio: 1,
    scrollParent: true,
    normalize: true,
    minimap: true,
    backend: "MediaElement",
  });

  const [audioUrl, setAudioUrl] = useState("./errorNe.mp3");
  const [annotaions, setAnnotations] = useState([]);

  return (
    <div className="container ASRAnnotaionPage">
      <input
        placeholder="Nhập link audio coi thằng nhóc"
        onChange={(event) => {
          setAudioUrl(event.target.value);
          setAnnotations([]);
        }}
      />
      {audioUrl && <Waveform audioUrl={audioUrl} options={options} />}
    </div>
  );
}

export default ASRAnnotaionPage;
