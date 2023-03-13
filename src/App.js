import "./App.css";
import Waveform from "./components/Waveform";

const url_audio =
  "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3";

function App() {
  return (
    <div className="App">
      <Waveform url_audio={url_audio} />
    </div>
  );
}

export default App;
