import { useEffect, useState } from "react";
import Waveform from "../../components/Waveform";

// const _audioUrl =
//   "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3";
// const _audioUrl =
//   "https://assets.mixkit.co/active_storage/sfx/1714/1714-preview.mp3";

function ASRAnnotaionPage() {
  const [options, setOptions] = useState({});
  const [audioUrl, setAudioUrl] = useState("");
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
      {audioUrl && (
        <Waveform
          audioUrl={audioUrl}
          options={options}
          setAnnotations={setAnnotations}
        />
      )}
    </div>
  );
}

export default ASRAnnotaionPage;
