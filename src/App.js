import ASRAnnotaionPage from "./pages/ASRAnnotaionPage";
import "./App.css";
import useScript from "./hooks/useScript";
import Header from "./layouts/Head";

function App() {
  return (
    <div className="App">
      <Header />
      <ASRAnnotaionPage />
    </div>
  );
}

export default App;
