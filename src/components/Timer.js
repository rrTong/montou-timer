import { useState, useEffect } from "react";
import moment from "moment";
import "../styles/Timer.css";

const timerStart = moment();
const timerEnd = moment().add(2, "hours");

const Timer = () => {
  const [timer, setTimer] = useState(moment());
  const [showGreen, setShowGreen] = useState(false);
  let timeDiff = moment.duration(timerEnd.diff(timer));

  if (timer.isSame(timerEnd) || timer.isAfter(timerEnd)) {
    if (!showGreen) setShowGreen(true);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer.clone().add(1, "seconds"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <span>{timeDiff.hours()}h</span>
        <span>{timeDiff.minutes()}m</span>
        <span>{timeDiff.seconds()}s</span>
      </div>
      <button
        onClick={() => {
          setTimer((prevTimer) => prevTimer.clone().add(1, "seconds"));
        }}
      >
        -1 second
      </button>
      <button
        onClick={() => {
          setTimer((prevTimer) => prevTimer.clone().add(1, "minutes"));
        }}
      >
        -1 minute
      </button>
      <button
        onClick={() => {
          setTimer((prevTimer) => prevTimer.clone().add(5, "minutes"));
        }}
      >
        -5 minutes
      </button>
      <div
        style={{
          backgroundColor: showGreen && "green",
          height: "100px",
          width: "100px",
        }}
      ></div>
      <div id="timer-info">
        <table>
          <tr>
            <td>Timer Start: </td>
            <td>{timerStart.format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
          </tr>
          <tr>
            <td>Timer End: </td>
            <td>{timerEnd.format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default Timer;
