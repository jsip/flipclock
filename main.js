const flip = document.getElementById("flip");
const backNode = document.querySelector(".back");
const frontNode = document.querySelector(".front");
const fullScreenBtn = document.getElementById("fullScreenBtn");
const configBtn = document.getElementById("configBtn");
const config = document.getElementById("config");
const bgColorPicker = document.getElementById("bgColorPicker");
const textColorPicker = document.getElementById("textColorPicker");
const blockColorPicker = document.getElementById("blockColorPicker");

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
const startBtn = document.getElementById("startBtn");
const timeInput = document.getElementById("timeInput");

startBtn.addEventListener("click", () => {
  clearInterval(timer);
  config.classList.toggle("hidden");
  const [hours, minutes] = parseTimeInput(timeInput.value);
  const endTime = new Date(Date.now() + hours * 3600000 + minutes * 60000);
  updateClock(endTime);
  timer = setInterval(() => updateClock(endTime), 1000);
});

function parseTimeInput(input) {
  let hours = 0;
  let minutes = 0;

  const combinedMatch = input.match(/(\d+)h(\d+)?/);
  const separateMinutesMatch = input.match(/(\d+)m/);

  if (combinedMatch) {
    hours = parseInt(combinedMatch[1]);
    if (combinedMatch[2]) {
      minutes = parseInt(combinedMatch[2]);
    }
  } else if (separateMinutesMatch) {
    minutes = parseInt(separateMinutesMatch[1]);
  }

  return [hours, minutes];
}

function updateClock(endTime) {
  const now = new Date();
  const diff = endTime - now;
  if (diff <= 0) {
    clearInterval(timer);
    return;
  }
  const timeStr = formatCountdown(diff);
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

