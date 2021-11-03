import { useState } from "react";
import Timer from "./components/Timer";
import moment from "moment";
import "./App.css";

function App() {
  const [timerStart, setTimerStart] = useState(moment());
  const [timerEnd, setTimerEnd] = useState(moment().add(2, "hours"));
  const [timerInput, setTimerInput] = useState("02:00:00");
  let timerInputH = 2;
  let timerInputM = 0;
  let timerInputS = 0;

  const handleTimerInput = (e) => {
    const re = /^\d{0,2}:?[0-9]{0,2}:?[0-9]{0,2}$/;
    if (e.target.value.match(re) != null) {
      if (e.target.value.length === 2 || e.target.value.length === 5) {
        e.target.value += ":";
      }
      e.target.value = e.target.value.replace(/:+/g, ":");
    }

    [timerInputH, timerInputM, timerInputS] = e.target.value.split(":");

    timerInputH = timerInputH || 0;
    timerInputM = timerInputM || 0;
    timerInputS = timerInputS || 0;
  };

  return (
    <div className="App">
      <h1>Montou Timer</h1>
      <input type="text" onChange={(e) => handleTimerInput(e)} />
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
