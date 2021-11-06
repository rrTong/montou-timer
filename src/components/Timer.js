import { useState, useEffect } from "react";
import moment from "moment";
import accurateTimer from "../hooks/accurateTimer";
import idle from "../assets/idle.gif";
import follow from "../assets/follow.gif";
import sub from "../assets/sub.gif";
import giveaway from "../assets/giveaway.gif";
import "../styles/Timer.css";

let paused = false;
let minSkipped = 0;
let secSkipped = 0;
let msSkipped = 0;
let gifTimer = 0;

const Timer = ({ timerStart, timerEnd }) => {
  const [timer, setTimer] = useState(moment());
  let timeDiff = moment.duration(timerEnd.diff(timer));
  const [timeElapsed, setTimeElapsed] = useState(
    moment().utcOffset(0).startOf("day").add(1, "seconds")
  );
  let timeElapsedDiff = moment.duration(timeElapsed);
  const [pausedButtonText, setPausedButtonText] = useState("Pause Timer");

  const [bitsInput, setBitsInput] = useState(100);
  const [followInput, setFollowInput] = useState(30);
  const [followSelectedOption, setFollowSelectedOption] = useState("seconds");
  const [subInput, setSubInput] = useState(5);

  const handleDefaultInput = () => {
    setBitsInput(100);
    setFollowInput(30);
    setFollowSelectedOption("seconds");
    setSubInput(5);
  };

  const handlePause = () => {
    if (paused) {
      setPausedButtonText("Pause Timer");
    } else {
      setPausedButtonText("Resume Timer");
    }
    paused = !paused;
  };

  const skipTime = (amount, unit, gif) => {
    if (unit === "minutes") {
      minSkipped += Number(amount);
    } else if (unit === "seconds") {
      secSkipped += Number(amount);
    } else if (unit === "milliseconds") {
      msSkipped += Number(amount);
    }
    setTimer((prevTimer) => prevTimer.clone().add(amount, unit));
    const promise = new Promise((resolve, reject) => {
      resolve(setGifState(idle));
    });
    promise.then(() => {
      setGifState(gif);
      gifTimer = 30;
    });
  };

  const handleBitsInput = (e) => {
    const re = /^\d*$/;
    if (e.target.value.match(re)) {
      setBitsInput(e.target.value);
    }
  };

  const handleBitsSubmit = (e) => {
    e.preventDefault();
    if (bitsInput < 500) {
      skipTime(bitsInput * 600, "milliseconds", sub);
    } else {
      skipTime(bitsInput * 600, "milliseconds", follow);
    }
  };

  const handleFollowInput = (e) => {
    const re = /^\d*$/;
    if (e.target.value.match(re)) {
      setFollowInput(e.target.value);
    }
  };

  const handleFollowSelectedOption = (e) => {
    setFollowSelectedOption(e.target.value);
  };

  const handleFollowSubmit = (e) => {
    e.preventDefault();
    skipTime(followInput, followSelectedOption, follow);
  };

  const handleSubInput = (e) => {
    const re = /^\d*$/;
    if (e.target.value.match(re)) {
      setSubInput(e.target.value);
    }
  };

  const handleSubSubmit = (e) => {
    e.preventDefault();
    if (e.nativeEvent.submitter.value === "x5") {
      skipTime(subInput * 5, "minutes", sub);
    } else {
      skipTime(subInput, "minutes", sub);
    }
  };

  const [gifState, setGifState] = useState(idle);

  if (timer.isSame(timerEnd) || timer.isAfter(timerEnd)) {
    if (gifState !== giveaway) setGifState(giveaway);
  }

  useEffect(() => {
    const interval = accurateTimer(() => {
      if (!paused) {
        setTimer((prevTimer) => prevTimer.clone().add(1, "seconds"));
        setTimeElapsed((prevTimeElapsed) =>
          prevTimeElapsed.clone().add(1, "seconds")
        );
      }
      console.log(paused);
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
    msSkipped = 0;
  }, [timerStart, timerEnd]);

  return (
    <>
      <div>
        <span className="timer-text">{timeDiff.hours()}h </span>
        <span className="timer-text">{timeDiff.minutes()}m </span>
        <span className="timer-text">{timeDiff.seconds()}s</span>
      </div>
      <div id="dashboard">
        <div className="dashboard-panel">
          <div>
            <button className="button" onClick={handlePause}>
              {pausedButtonText}
            </button>
          </div>
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
          <div>
            <button className="button" onClick={handleDefaultInput}>
              Default Custom Input
            </button>
          </div>
        </div>
        <div className="dashboard-panel">
          <form onSubmit={(e) => handleBitsSubmit(e)}>
            <input className="input" disabled value={"600"} />
            <input
              type="radio"
              value="milliseconds"
              checked="checked"
              disabled="disabled"
            />
            <label className="radio-text">ms</label>
            <input
              className="input"
              id="input-bits"
              type="number"
              value={bitsInput}
              onChange={(e) => handleBitsInput(e)}
            />
            <input
              className="button"
              id="button-bits"
              type="submit"
              value="Bits"
            />
          </form>
          <form onSubmit={(e) => handleFollowSubmit(e)}>
            <input
              className="input"
              type="number"
              value={followInput}
              onChange={(e) => handleFollowInput(e)}
            />
            <input
              type="radio"
              value="minutes"
              checked={followSelectedOption === "minutes"}
              onChange={(e) => handleFollowSelectedOption(e)}
            />
            <label>m</label>
            <input
              type="radio"
              value="seconds"
              checked={followSelectedOption === "seconds"}
              onChange={(e) => handleFollowSelectedOption(e)}
            />
            <label className="radio-text">s</label>
            <input className="button" type="submit" value="Follow" />
          </form>
          <form onSubmit={(e) => handleSubSubmit(e)}>
            <input
              className="input"
              type="number"
              value={subInput}
              onChange={(e) => handleSubInput(e)}
            />
            <input
              type="radio"
              value="minutes"
              checked="checked"
              disabled="disabled"
            />
            <label className="radio-text">m</label>
            <input
              className="button"
              id="button-sub"
              type="submit"
              value="Sub"
            />
            <input
              className="button"
              id="button-sub-x5"
              type="submit"
              value="x5"
            />
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
                {minSkipped} minutes, {secSkipped} seconds, {msSkipped}{" "}
                milliseconds
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Timer;
