import { useEffect, useState } from "react";
import "./App.css";
import Waveform from "./components/Waveform";

const audioUrl =
  "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3";

function App() {
  const [shouldReplay, setShouldReplay] = useState(false);
  const [options, setOptions] = useState({});

  useEffect(() => {
    setOptions({
      autoPlay: shouldReplay,
      loop: shouldReplay,
    });
  }, [shouldReplay]);

  function handleToggleReplay() {
    setShouldReplay((prevShouldReplay) => !prevShouldReplay);
  }

  return (
    <div className="App">
      <Waveform audioUrl={audioUrl} options={options} />
      <button onClick={handleToggleReplay}>
        {shouldReplay ? "Disable Replay" : "Enable Replay"}
      </button>
    </div>
  );
}

export default App;
