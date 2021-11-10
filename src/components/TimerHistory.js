import { useRef, useEffect } from "react";
import "../styles/TimerHistory.scss";

const TimerHistory = ({ timerHistoryLog }) => {
  const bottomRef = useRef();
  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  useEffect(() => {
    // scrollToBottom();
  }, [timerHistoryLog]);

  return (
    <div id="timer-history">
      {timerHistoryLog.reverse().map((skip) => (
        <div id="timer-history-log" key={skip.amount}>
          {skip.time}, {skip.type}, {skip.amount} {skip.unit}, {skip.oldTimer}
          {" => "}
          {skip.newTimer}
        </div>
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default TimerHistory;
