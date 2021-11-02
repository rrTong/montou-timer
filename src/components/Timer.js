import { useState, useEffect } from "react";
import moment from "moment";
import accurateTimer from "../hooks/accurateTimer";
import idleBasic from "../assets/idle-basic.gif";
import follow from "../assets/follow.gif";
import sub from "../assets/sub.gif";
import giveaway from "../assets/giveaway.gif";
import "../styles/Timer.css";

const timerStart = moment();
const timerEnd = moment().add(2, "hours");
let oneMinCount = 0;
let twoMinCount = 0;
let fiveMinCount = 0;
let gifTimer = 0;

const Timer = () => {
  const [timer, setTimer] = useState(moment());
  let timeDiff = moment.duration(timerEnd.diff(timer));
  const [timeElapsed, setTimeElapsed] = useState(
    moment().utcOffset(0).startOf("day").add(1, "seconds")
  );
  let timeElapsedDiff = moment.duration(timeElapsed);
  const [gifState, setGifState] = useState(idleBasic);

  if (timer.isSame(timerEnd) || timer.isAfter(timerEnd)) {
    if (gifState !== giveaway) setGifState(giveaway);
  }

  useEffect(() => {
    const interval = accurateTimer(() => {
      setTimer((prevTimer) => prevTimer.clone().add(1, "seconds"));
      setTimeElapsed((prevTimeElapsed) =>
        prevTimeElapsed.clone().add(1, "seconds")
      );
      if (gifTimer > 0) {
        gifTimer--;
      } else {
        setGifState(idleBasic);
      }
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
          const promise = new Promise((resolve, reject) => {
            resolve(setGifState(idleBasic));
          });
          promise.then(() => {
            setGifState(follow);
            gifTimer = 30;
          });
        }}
      >
        -1 minute
      </button>
      <button
        className="button"
        id="button-two-min"
        onClick={() => {
          setTimer((prevTimer) => prevTimer.clone().add(2, "minutes"));
          twoMinCount++;
          const promise = new Promise((resolve, reject) => {
            resolve(setGifState(idleBasic));
          });
          promise.then(() => {
            setGifState(sub);
            gifTimer = 30;
          });
        }}
      >
        -2 minutes
      </button>
      <button
        className="button"
        id="button-five-min"
        onClick={() => {
          setTimer((prevTimer) => prevTimer.clone().add(5, "minutes"));
          fiveMinCount++;
          const promise = new Promise((resolve, reject) => {
            resolve(setGifState(idleBasic));
          });
          promise.then(() => {
            setGifState(sub);
            gifTimer = 30;
          });
        }}
      >
        -5 minutes
      </button>
      <div>
        <img id="gif" src={gifState} alt="montou-animation" />
      </div>
      <div id="timer-info">
        <table>
          <tbody>
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
              <td>-2 minute</td>
              <td>{twoMinCount}</td>
            </tr>
            <tr>
              <td>-5 minutes</td>
              <td>{fiveMinCount}</td>
            </tr>
            <tr>
              <td>Total Time Skipped:</td>
              <td>
                {oneMinCount + twoMinCount * 2 + fiveMinCount * 5} minutes
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Timer;
