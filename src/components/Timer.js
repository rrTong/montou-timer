import { useState, useEffect } from "react";
import moment from "moment";
import accurateTimer from "../hooks/accurateTimer";
import "../styles/Timer.css";

const timerStart = moment();
const timerEnd = moment().add(2, "hours");
let oneMinCount = 0;
let fiveMinCount = 0;

const Timer = () => {
  const [timer, setTimer] = useState(moment());
  let timeDiff = moment.duration(timerEnd.diff(timer));
  const [timeElapsed, setTimeElapsed] = useState(
    moment().utcOffset(0).startOf("day").add(1, "seconds")
  );
  let timeElapsedDiff = moment.duration(timeElapsed);
  const [showGreen, setShowGreen] = useState(false);

  if (timer.isSame(timerEnd) || timer.isAfter(timerEnd)) {
    if (!showGreen) setShowGreen(true);
  }

  useEffect(() => {
    const interval = accurateTimer(() => {
      setTimer((prevTimer) => prevTimer.clone().add(1, "seconds"));
      setTimeElapsed((prevTimeElapsed) =>
        prevTimeElapsed.clone().add(1, "seconds")
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <span className="timer-text">{timeDiff.hours()}h </span>
        <span className="timer-text">{timeDiff.minutes()}m </span>
        <span className="timer-text">{timeDiff.seconds()}s</span>
      </div>
      <button
        className="button"
        id="button-one-min"
        onClick={() => {
          setTimer((prevTimer) => prevTimer.clone().add(1, "minutes"));
          oneMinCount++;
        }}
      >
        -1 minute
      </button>
      <button
        className="button"
        id="button-five-min"
        onClick={() => {
          setTimer((prevTimer) => prevTimer.clone().add(5, "minutes"));
          fiveMinCount++;
        }}
      >
        -5 minutes
      </button>
      <div
        style={{
          backgroundColor: showGreen && "rgba(51, 255, 0)",
          height: "100px",
          width: "100px",
          margin: "10px auto",
        }}
      ></div>
      <div id="timer-info">
        <table>
          <tr>
            <td>Timer Start:</td>
            <td>{timerStart.format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
          </tr>
          <tr>
            <td>Timer End:</td>
            <td>{timerEnd.format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
          </tr>
          <tr>
            <td>Time Elapsed:</td>
            <td>
              <span>{timeElapsedDiff.hours()}h </span>
              <span>{timeElapsedDiff.minutes()}m </span>
              <span>{timeElapsedDiff.seconds()}s</span>
            </td>
          </tr>
          <tr>
            <td>-1 minute</td>
            <td>{oneMinCount}</td>
          </tr>
          <tr>
            <td>-5 minutes</td>
            <td>{fiveMinCount}</td>
          </tr>
          <tr>
            <td>Total Time Skipped:</td>
            <td>{oneMinCount + fiveMinCount * 5} minutes</td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default Timer;
