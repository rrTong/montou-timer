import { useState, useEffect } from "react";
import moment from "moment";
import accurateTimer from "../hooks/accurateTimer";
import idle from "../assets/idle.gif";
import follow from "../assets/follow.gif";
import sub from "../assets/sub.gif";
import giveaway from "../assets/giveaway.gif";
import "../styles/Timer.css";

let minSkipped = 0;
let secSkipped = 0;
let gifTimer = 0;

const Timer = ({ timerStart, timerEnd }) => {
  const [timer, setTimer] = useState(moment());
  let timeDiff = moment.duration(timerEnd.diff(timer));
  const [timeElapsed, setTimeElapsed] = useState(
    moment().utcOffset(0).startOf("day").add(1, "seconds")
  );
  let timeElapsedDiff = moment.duration(timeElapsed);

  const [followInput, setFollowInput] = useState(1);
  const [subInput, setSubInput] = useState(5);

  const skipTime = (amount, gif) => {
    minSkipped += Number(amount);
    setTimer((prevTimer) => prevTimer.clone().add(amount, "minutes"));
    const promise = new Promise((resolve, reject) => {
      resolve(setGifState(idle));
    });
    promise.then(() => {
      setGifState(gif);
      gifTimer = 30;
    });
  };

  const handleFollowInput = (e) => {
    const re = /^\d*$/;
    if (e.target.value.match(re)) {
      setFollowInput(e.target.value);
    }
  };

  const handleFollowSubmit = (e) => {
    e.preventDefault();
    skipTime(followInput, follow);
  };

  const handleSubInput = (e) => {
    const re = /^\d*$/;
    if (e.target.value.match(re)) {
      setSubInput(e.target.value);
    }
  };

  const handleSubSubmit = (e) => {
    e.preventDefault();
    skipTime(subInput, sub);
  };

  const [gifState, setGifState] = useState(idle);

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
        setGifState(idle);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeElapsed(moment().utcOffset(0).startOf("day").add(1, "seconds"));
    setTimer(moment());
    minSkipped = 0;
    secSkipped = 0;
  }, [timerStart, timerEnd]);

  return (
    <>
      <div>
        <span className="timer-text">{timeDiff.hours()}h </span>
        <span className="timer-text">{timeDiff.minutes()}m </span>
        <span className="timer-text">{timeDiff.seconds()}s</span>
      </div>
      <div id="dashboard">
        <div>
          <button
            className="button"
            id="button-thirty-sec"
            onClick={() => {
              setTimer((prevTimer) => prevTimer.clone().add(30, "seconds"));
              secSkipped += 30;
              const promise = new Promise((resolve, reject) => {
                resolve(setGifState(idle));
              });
              promise.then(() => {
                setGifState(follow);
                gifTimer = 30;
              });
            }}
          >
            -30 seconds
          </button>
          <button
            className="button"
            id="button-one-min"
            onClick={() => {
              setTimer((prevTimer) => prevTimer.clone().add(1, "minutes"));
              minSkipped += 1;
              const promise = new Promise((resolve, reject) => {
                resolve(setGifState(idle));
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
              minSkipped += 2;
              const promise = new Promise((resolve, reject) => {
                resolve(setGifState(idle));
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
              minSkipped += 5;
              const promise = new Promise((resolve, reject) => {
                resolve(setGifState(idle));
              });
              promise.then(() => {
                setGifState(sub);
                gifTimer = 30;
              });
            }}
          >
            -5 minutes
          </button>
        </div>
        <div className="dashboard-panel">
          <form onSubmit={(e) => handleFollowSubmit(e)}>
            <input
              className="input"
              type="number"
              value={followInput}
              onChange={(e) => handleFollowInput(e)}
            />
            <input className="button" type="submit" value="Follow" />
          </form>
          <form onSubmit={(e) => handleSubSubmit(e)}>
            <input
              className="input"
              type="number"
              value={subInput}
              onChange={(e) => handleSubInput(e)}
            />
            <input className="button" type="submit" value="Sub" />
          </form>
        </div>
      </div>
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
              <td>Total Time Skipped:</td>
              <td>
                {minSkipped} minutes, {secSkipped} seconds
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Timer;
