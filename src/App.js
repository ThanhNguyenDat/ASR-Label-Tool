import { useEffect, useState } from "react";
import "./App.css";
import Waveform from "./components/Waveform";

// const _audioUrl =
//   "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3";

function App() {
  const [options, setOptions] = useState({});
  const [audioUrl, setAudioUrl] = useState("");
  const [annotaions, setAnnotations] = useState([]);

  return (
    <div className="App">
      <input
        placeholder="hi"
        onChange={(event) => {
          setAudioUrl(event.target.value);
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

export default App;
