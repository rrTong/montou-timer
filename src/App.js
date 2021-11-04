import { useState } from "react";
import Timer from "./components/Timer";
import moment from "moment";
import "./App.css";

function App() {
  const [timerStart, setTimerStart] = useState(moment());
  const [timerEnd, setTimerEnd] = useState(moment().add(2, "hours"));
  const [timerInput, setTimerInput] = useState("02:00:00");
  const [timerInputH, setTimerInputH] = useState(2);
  const [timerInputM, setTimerInputM] = useState(0);
  const [timerInputS, setTimerInputS] = useState(0);

  const handleTimerInput = (e) => {
    const re = /^\d{0,2}:?[0-9]{0,2}:?[0-9]{0,2}$/;
    const two_chars_no_colons_regex = /([^:]{2}(?!:))/;

    if (e.target.value.match(re)) {
      setTimerInput(e.target.value.replace(two_chars_no_colons_regex, "$1:"));
    }

    let [h, m, s] = e.target.value.split(":");

    setTimerInputH(h || 0);
    setTimerInputM(m || 0);
    setTimerInputS(s || 0);
  };

  const handleTimerSubmit = (e) => {
    e.preventDefault();
    setTimerStart(moment());
    setTimerEnd(
      moment()
        .add(timerInputH, "hours")
        .add(timerInputM, "minutes")
        .add(timerInputS, "seconds")
    );
  };

  return (
    <div className="App">
      <h1>Montou Timer</h1>
      <form onSubmit={(e) => handleTimerSubmit(e)}>
        <input
          type="text"
          value={timerInput}
          onChange={(e) => handleTimerInput(e)}
        />
        <input type="submit" value="Start" />
        <input
          type="reset"
          value="Clear"
          onClick={() => {
            setTimerInput("");
          }}
        />
      </form>

      {true && <Timer timerStart={timerStart} timerEnd={timerEnd} />}
    </div>
  );
}

export default App;
