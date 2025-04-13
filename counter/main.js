function formatTime(t) {
  return `00${parseInt(t)}`.slice(-2);
}

function displayTime(cel, bel, ts, total) {
  cel.innerHTML = `${formatTime(ts / 60)} : ${formatTime(ts % 60)}`;
  bel.style.width = `${(ts / total) * 100}%`;
}

window.addEventListener("load", function () {
  const recLengthSec = 1 * 60;
  let startTime = null;
  let intervalId = null;

  const bar = document.getElementById("bar");
  const button = document.getElementById("button");
  const counter = document.getElementById("counter");

  function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
    startTime = null;
    button.innerHTML = "start";
    displayTime(counter, bar, recLengthSec, recLengthSec);
  }

  function startTimer() {
    startTime = Date.now();
    button.innerHTML = "stop";
    intervalId = setInterval(updateTimer, 50);
  }

  function updateTimer() {
    const ellapsedSec = (Date.now() - startTime) / 1000;
    const toShow = recLengthSec - ellapsedSec;

    if (toShow < 0) {
      stopTimer();
    } else {
      displayTime(counter, bar, toShow, recLengthSec);
    }
  }

  button.addEventListener("click", function () {
    if (intervalId) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  stopTimer();
});
