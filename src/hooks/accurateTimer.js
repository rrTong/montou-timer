// Alex Wayne
// https://gist.github.com/AlexJWayne/1d99b3cd81d610ac7351
// https://codepen.io/sayes2x/pen/GYdLqL

const accurateTimer = (fn, time = 1000) => {
  // nextAt is the value for the next time the timer should fire.
  // timeout holds the timeoutID so the timer can be stopped.
  let nextAt, timeout;
  // initilzes nextAt as now + the time in milliseconds you pass to accurateTimer.
  nextAt = new Date().getTime() + time;

  // This function schedules the next function call.
  const wrapper = () => {
    // next function call is always calculated from when the timer started
    nextAt += time;
    // there is where the next setTimeout is adjusted to keep the time accurate.
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    // the function passed to accurateTimer is called.
    fn();
  };

  // this function stops the timer.
  const cancel = () => clearTimeout(timeout);

  // the first function call is scheduled.
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());

  // the cancel function is returned so it can be called outside accurateTimer.
  return { cancel };
};

export default accurateTimer;
