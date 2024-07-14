const flip = document.getElementById("flip");
const backNode = document.querySelector(".back");
const frontNode = document.querySelector(".front");
const fullScreenBtn = document.getElementById("fullScreenBtn");
const configBtn = document.getElementById("configBtn");
const config = document.getElementById("config");
const bgColorPicker = document.getElementById("bgColorPicker");
const textColorPicker = document.getElementById("textColorPicker");
const blockColorPicker = document.getElementById("blockColorPicker");
const timerValue = document.getElementById("timerValue");
const startPauseBtn = document.getElementById("startPauseBtn");
const resetBtn = document.getElementById("resetBtn");
const timeInput = document.getElementById("timeInput");

let count = 0;
let isFlipping = false;

class Flipper {
  constructor(config) {
    this.config = {
      node: null,
      frontText: "number0",
      backText: "number1",
      duration: 600,
      ...config,
    };
    this.nodeClass = {
      flip: "flip",
      front: "digital front",
      back: "digital back",
    };
    this.frontNode = this.config.node.querySelector(".front");
    this.backNode = this.config.node.querySelector(".back");
    this.isFlipping = false;
    this.init();
  }

  init() {
    this.setFront(this.config.frontText);
    this.setBack(this.config.backText);
  }

  setFront(className) {
    this.frontNode.setAttribute(
      "class",
      `${this.nodeClass.front} ${className}`
    );
    this.frontNode.textContent = className.replace("number", "");
  }

  setBack(className) {
    this.backNode.setAttribute("class", `${this.nodeClass.back} ${className}`);
    this.backNode.textContent = className.replace("number", "");
  }

  flip(type, front, back) {
    if (this.isFlipping) return;

    this.isFlipping = true;
    this.setFront(front);
    this.setBack(back);
    const flipClass = `${this.nodeClass.flip} ${type}`;
    this.config.node.setAttribute("class", `${flipClass} go`);

    setTimeout(() => {
      this.config.node.setAttribute("class", flipClass);
      this.isFlipping = false;
      this.setFront(back);
    }, this.config.duration);
  }

  flipDown(front, back) {
    this.flip("down", front, back);
  }

  flipUp(front, back) {
    this.flip("up", front, back);
  }
}

const clock = document.getElementById("clock");
const flips = clock.querySelectorAll(".flip");

let timer;

startPauseBtn.addEventListener("click", () => {
  if (startPauseBtn.dataset.state == "rts") {
    clearInterval(timer);
    config.classList.toggle("hidden");
    resetBtn.classList.add("hidden");
    startPauseBtn.dataset.state = "rtp";
    startPauseBtn.textContent = "Pause";

    let [hours, minutes, seconds] = parseTimeInput(timeInput.value);
    
    const endTime = new Date(Date.now() + hours * 3600000 + minutes * 60000 + seconds * 1000);

    setTimeout(() => {
      updateClock(endTime);
    }, 1000);

    timer = setInterval(() => {
      updateClock(endTime), 1000
    });
  } else {
    config.classList.toggle("hidden");
    resetBtn.classList.remove("hidden");
    clearInterval(timer);
    const timerAtPause = timerValue.value;
    const [hours, minutes, seconds] = timerAtPause.match(/(\d{2})/g);
    const ms = (hours * 3600 + minutes * 60 + seconds) * 1000;
    formatCountdown(ms);
    startPauseBtn.dataset.state = "rts";
    startPauseBtn.textContent = "Start";
    timeInput.value = `${hours}h${minutes}m${seconds}s`;
  }
});

function parseTimeInput(input) {
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  const timeArr = input.match(/(\d{1,2})[hms]/g);

  if (timeArr) {
    timeArr.forEach((time) => {
      if (time.includes("h")) {
        hours = parseInt(time.replace("h", ""));
      } else if (time.includes("m")) {
        minutes = parseInt(time.replace("m", ""));
      } else if (time.includes("s")) {
        seconds = parseInt(time.replace("s", ""));
      }
    });
  }

  return [hours, minutes, seconds];
}

function updateClock(endTime) {
  const now = new Date();
  const diff = endTime - now;
  if (diff <= 0) {
    clearInterval(timer);
    return;
  }
  const timeStr = formatCountdown(diff);
  timerValue.value = timeStr;
  flipObjs.forEach((flipObj, i) => {
    const newDigit = timeStr[i];
    if (newDigit !== flipObj.frontNode.textContent) {
      flipObj.flipDown(
        `number${flipObj.frontNode.textContent}`,
        `number${newDigit}`
      );
    }
  });
}

function formatCountdown(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}${minutes}${seconds}`;
}

const flipObjs = Array.from(flips).map(
  (flip, i) =>
    new Flipper({
      node: flip,
      frontText: "number0",
      backText: "number1",
    })
);

configBtn.addEventListener("click", (e) => {
  config.classList.toggle("hidden");
});

fullScreenBtn.addEventListener("click", (e) => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
});

if (window) {
  window.onload = () => {
    bgColorPicker.value = localStorage.getItem("bgColor") || "#fff";
    bgColorPicker.jscolor.setPreviewElementBg(bgColorPicker.value);

    textColorPicker.value = localStorage.getItem("textColor") || "#fff";
    textColorPicker.jscolor.setPreviewElementBg(textColorPicker.value);

    blockColorPicker.value = localStorage.getItem("blockColor") || "#000";
    blockColorPicker.jscolor.setPreviewElementBg(blockColorPicker.value);

    document.documentElement.style.setProperty("--bg-color", bgColorPicker.value);
    document.documentElement.style.setProperty("--text-color", textColorPicker.value);
    document.documentElement.style.setProperty("--block-color", blockColorPicker.value);
  };
}

bgColorPicker.addEventListener("input", (e) => {
  let bgColor = e.target.value;
  document.documentElement.style.setProperty("--bg-color", bgColor);
  localStorage.setItem("bgColor", bgColor);
});

textColorPicker.addEventListener("input", (e) => {
  let textColor = e.target.value;
  document.documentElement.style.setProperty("--text-color", textColor);
  localStorage.setItem("textColor", textColor);
});

blockColorPicker.addEventListener("input", (e) => {
  let blockColor = e.target.value;
  document.documentElement.style.setProperty("--block-color", blockColor);
  localStorage.setItem("blockColor", blockColor);
});

resetBtn.addEventListener("click", (e) => {
  clearInterval(timer);
  timerValue.value = null;
  startPauseBtn.dataset.state = "rts";
  startPauseBtn.textContent = "Start";
  timeInput.value = null;
  flipObjs.forEach((flipObj) => {
    flipObj.flipDown("number0", "number0");
  });
});