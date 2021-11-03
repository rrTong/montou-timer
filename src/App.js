import { useState } from "react";
import Timer from "./components/Timer";
import moment from "moment";
import "./App.css";

function App() {
  const [timerStart, setTimerStart] = useState(moment());
  const [timerEnd, setTimerEnd] = useState(moment().add(2, "hours"));
  const [timerInput, settimerInput] = useState("02:00:00");
  let timerInputH = 2;
  let timerInputM = 0;
  let timerInputS = 0;

  const handleTimerInput = (e) => {
    [timerInputH, timerInputM, timerInputS] = e.split(":");
  };

  return (
    <div className="App">
      <h1>Montou Timer</h1>
      <input type="text" onChange={(e) => handleTimerInput(e.target.value)} />
      <button
        className="button"
        onClick={() => {
          setTimerStart(moment());
          setTimerEnd(
            moment()
              .add(timerInputH, "hours")
              .add(timerInputM, "minutes")
              .add(timerInputS, "seconds")
          );
        }}
      >
        restart
      </button>
      {true && <Timer timerStart={timerStart} timerEnd={timerEnd} />}
    </div>
  );
}

export default App;
