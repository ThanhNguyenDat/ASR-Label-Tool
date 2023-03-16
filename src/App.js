import ASRAnnotaionPage from "./pages/ASRAnnotaionPage";
import "./App.css";
import useScript from "./hooks/useScript";

// const _audioUrl =
//   "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3";

function App() {
  useScript("https://label.lab.zalo.ai/ui/ailab_ui_api.js");

  return (
    <div className="App">
      <ASRAnnotaionPage />
    </div>
  );
}

export default App;
