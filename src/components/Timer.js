import { useState, useEffect } from "react";
import moment from "moment";

const format = "hh:mm:ss";
const timerEnd = moment().add(2, "hours");

const Timer = () => {
  const [timer, setTimer] = useState(moment());

  const timeDiff = timerEnd - timer;
  const seconds = Math.floor((timeDiff / 1000) % 60);
  const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <span>{hours}h</span>
      <span>{minutes}m</span>
      <span>{seconds}s</span>
    </>
  );
};

export default Timer;
