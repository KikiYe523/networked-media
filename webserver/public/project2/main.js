let audioSpeed = 1;
let backgroundAudio;

// all timing settings !!!!
let firstPause = 500;
let frameTime = 1000;
let noteHold = 10000;
let fadeDuration = 600;
let traceFade = 2000;
let endingHold = 2000;
let arrivalFraction = 1 / 2;

// the opening only plays once
let introParagraphs = [
  "Are you still there?",
  "We’re the things around your home.\nA receipt in your bag. Fruit you left out.\nSomething at the back of your fridge.\nDinner you only knew once it was cooked.",
  "We dry out, soften, shrink, and change.\nUsually, you catch us before or after.\nYou miss the part in between.",
  "Maybe you’re looking this time.\nWe’ll carry on either way.",
];
let typingSpeed = 30;
let introHold = 500;
let introFade = 1000;
let introBox;
let introText;
let introParagraph = 0;
let introStarted;
let introFinished = false;

// eyes change when an object arrives
let background;
let backgroundFrames;
let backgroundFrame = 0;

// keep these lists in the same order so each name matches its object
let ids = [
  "egg",
  "lamb",
  "glass",
  "blister_pills",
  "tomato",
  "strawberry",
  "lemon",
  "orange",
  "receipt",
  "toilet_roll",
];

let names = [
  "Raw egg",
  "Raw lamb chops",
  "Ice cube in tea",
  "Pills eaten",
  "Cherry tomatoes eaten",
  "Half of a strawberry",
  "Lemon slice",
  "Orange peel",
  "Receipt",
  "Toilet paper used",
];

let frameCounts = [];

// the page elements and what has happened so far
let stage;
let objects = [];
let images = [];
let labels = [];
let lineStarted = [];
let currentFrames = [];
let arrivalTimes = [];
let finished = [];
let arrivedCount = 0;
let completedCount = 0;
let playbackTime = -firstPause;
let lastUpdate;
let activeItem = -1;
let detailStarted;
let fadeStarted;
let fading = false;
let ending = false;
let endingStarted;
let endingVisible = false;
let endingText =
  "Are you still there?\n\nThere’s a little less of us now.\nMaybe you saw it happen.\n\nSomewhere around you,\nsomething else is changing.";

// wait for the page and images to load before starting
window.addEventListener("load", function () {
  backgroundAudio = document.getElementById("background-audio");
  backgroundAudio.playbackRate = audioSpeed;
  backgroundAudio.volume = 0.3;
  startAudio();
  document.addEventListener("click", startAudio);
  document.addEventListener("keydown", startAudio);

  stage = document.getElementById("stage");
  introBox = document.getElementById("introduction");
  introText = document.getElementById("intro-text");
  background = document.getElementById("background");
  backgroundFrames = background.querySelectorAll(".background-frame");

  for (let i = 0; i < ids.length; i++) {
    objects[i] = document.getElementById("object-" + ids[i]);
    images[i] = objects[i].querySelectorAll(".piece");
    frameCounts[i] = images[i].length;
    lineStarted[i] = 0;
    labels[i] = document.getElementById("label-" + ids[i]);
    currentFrames[i] = 0;
    arrivalTimes[i] = 0;
    finished[i] = false;
    labels[i].textContent = observationLabel(i);
  }

  lastUpdate = new Date().getTime();
  introStarted = lastUpdate;
  background.classList.add("is-visible");
  // check the time every 100ms. each image still stays for 1 second
  setInterval(updateScreensaver, 100);
});

function updateScreensaver() {
  let now = new Date().getTime();
  let passed = now - lastUpdate;
  lastUpdate = now;

  if (!introFinished) {
    updateIntroduction(now);
    return;
  }

  if (ending) {
    updateEnding(now);
    return;
  }

  if (arrivedCount === 0) {
    arrive(0);
    return;
  }

  // pause the other sequences so there is time to read the receipt
  if (activeItem >= 0) {
    if (!fading && now - detailStarted >= noteHold) {
      fading = true;
      fadeStarted = now;
      objects[activeItem].classList.add("is-fading");
      stage.classList.remove("showing-detail");
      for (let i = 0; i < objects.length; i++) {
        objects[i].classList.remove("is-background");
      }
    }
    if (fading && now - fadeStarted >= fadeDuration) {
      finishDetails(now);
    }
    return;
  }

  playbackTime += passed;
  if (playbackTime < 0) return;

  for (let i = 0; i < arrivedCount; i++) {
    if (!finished[i]) {
      let elapsed = playbackTime - arrivalTimes[i];
      let frame = Math.floor(elapsed / frameTime);
      if (frame >= frameCounts[i]) {
        frame = frameCounts[i] - 1;
      }
      if (frame !== currentFrames[i]) {
        currentFrames[i] = frame;
        changeFrame(i, frame);
        labels[i].textContent = observationLabel(i);
      }
    }
  }

  if (arrivedCount < ids.length) {
    let previous = arrivedCount - 1;
    let delay = frameCounts[previous] * frameTime * arrivalFraction;
    if (playbackTime - arrivalTimes[previous] >= delay) {
      arrive(arrivedCount);
    }
  }

  for (let i = 0; i < arrivedCount; i++) {
    let duration = frameCounts[i] * frameTime;
    if (!finished[i] && playbackTime - arrivalTimes[i] >= duration) {
      showDetails(i, now);
      return;
    }
  }
}

// 1 typing function for both texts. add the letters with a loop
function typeText(text, letters) {
  let visibleText = "";
  for (let i = 0; i < letters && i < text.length; i++) {
    visibleText += text[i];
  }
  introText.textContent = visibleText;
}

function updateIntroduction(now) {
  let paragraph = introParagraphs[introParagraph];
  let elapsed = now - introStarted;
  let letters = Math.floor(elapsed / typingSpeed);
  typeText(paragraph, letters);

  let typingDuration = paragraph.length * typingSpeed;
  if (elapsed >= typingDuration + introHold) {

    introBox.classList.add("is-faded");
  }

  if (elapsed >= typingDuration + introHold + introFade) {
    introParagraph++;
    if (introParagraph === introParagraphs.length) {
      introFinished = true;
      introBox.classList.add("is-hidden");
    } else {
      introText.textContent = "";
      introBox.classList.remove("is-faded");
      introStarted = now;

    }
  }
}

function arrive(index) {
  arrivalTimes[index] = playbackTime;
  if (index === 0) {
    arrivalTimes[index] = 0;
  }
  changeBackground(index + 1);
  lineStarted[index] = new Date().getTime();
  objects[index].classList.add("is-present");
  arrivedCount++;
}

// show one frame and hide the rest using classes
function changeFrame(index, frame) {
  for (let i = 0; i < images[index].length; i++) {
    images[index][i].classList.remove("is-current");
  }
  images[index][frame].classList.add("is-current");
}

function showDetails(index, now) {
  activeItem = index;
  detailStarted = now;
  fading = false;
  objects[index].classList.add("is-active");
  for (let i = 0; i < objects.length; i++) {
    if (i !== index) {
      objects[i].classList.add("is-background");
    }
  }
  stage.classList.add("showing-detail");
}

function finishDetails(now) {
  let index = activeItem;
  finished[index] = true;
  labels[index].textContent = names[index];
  objects[index].classList.add("is-finished");
  objects[index].classList.remove("is-active", "is-fading");
  activeItem = -1;
  fading = false;
  completedCount++;
  if (completedCount === ids.length) {
    ending = true;
    endingStarted = now;
    endingVisible = false;
    stage.classList.add("is-ending");
    changeBackground(11);
  }
}

// use the same text box for the ending
function updateEnding(now) {
  let elapsed = now - endingStarted;

  // let the names and lines disappear before the ending starts
  if (elapsed < traceFade) return;

  if (!endingVisible) {
    introText.textContent = "";
    introBox.classList.remove("is-hidden", "is-faded");
    endingVisible = true;
  }

  let typingElapsed = elapsed - traceFade;
  let letters = Math.floor(typingElapsed / typingSpeed);
  typeText(endingText, letters);
  let typingDuration = endingText.length * typingSpeed;

  if (typingElapsed >= typingDuration + endingHold) {
    introBox.classList.add("is-faded");
  }

  if (typingElapsed >= typingDuration + endingHold + introFade) {
    introBox.classList.add("is-hidden");
    resetCollection();
  }
}

// arrays start at 0, so frame 12 is backgroundFrames[11]
function changeBackground(frame) {
  backgroundFrames[backgroundFrame].classList.remove("is-current");
  backgroundFrames[frame].classList.add("is-current");
  backgroundFrame = frame;
}

function resetCollection() {
  for (let i = 0; i < ids.length; i++) {
    objects[i].classList.remove("is-present", "is-finished", "is-background");
    changeFrame(i, 0);
    currentFrames[i] = 0;
    arrivalTimes[i] = 0;
    finished[i] = false;
    labels[i].textContent = observationLabel(i);
  }
  arrivedCount = 0;
  completedCount = 0;
  playbackTime = -firstPause;
  ending = false;
  stage.classList.remove("is-ending");
}

// these labels show the time the objects took
function observationLabel(index) {
  let label = "";
  let progress = currentFrames[index] / (frameCounts[index] - 1);

  if (ids[index] === "glass" || ids[index] === "egg" || ids[index] === "lamb") {
    let totalSeconds = 3600;

    if (ids[index] === "lamb") {
      totalSeconds = 300;
    }

    if (ids[index] === "egg") {
      totalSeconds = 60;
    }

    let seconds = Math.floor(progress * totalSeconds);
    let minutes = Math.floor(seconds / 60);

    seconds = seconds % 60;

    let minuteText = "" + minutes;
    let secondText = "" + seconds;

    if (minutes < 10) {
      minuteText = "0" + minutes;
    }

    if (seconds < 10) {
      secondText = "0" + seconds;
    }

    label = minuteText + ":" + secondText;
  } else {
    let days = 7;

    if (ids[index] === "strawberry") {
      days = 6;
    }

    if (ids[index] === "blister_pills" || ids[index] === "tomato") {
      days = 5;
    }

    let moment = Math.floor(progress * (days * 2 - 1));
    let day = Math.floor(moment / 2) + 1;
    let timeOfDay = "morning";

    if (moment % 2 === 1) {
      timeOfDay = "evening";
    }

    label = "Day " + day + " / " + timeOfDay;
  }

  return label;
}

let lineX = [12, 48, 82, 28, 65, 10, 45, 85, 28, 68];
let lineY = [28, 25, 30, 47, 47, 66, 66, 65, 84, 84];

// keep p5 just for the line animation
function setup() {
  pixelDensity(1);
  createCanvas(
    windowWidth,
    windowHeight,
    document.getElementById("floating-canvas"),
  );
  frameRate(30);
}

function draw() {
  clear();
  strokeWeight(1);
  let now = new Date().getTime();
  for (let i = 1; i < arrivedCount; i++) {
    let opacity = (now - lineStarted[i]) / 2000;
    if (opacity > 1) opacity = 1;
    stroke(218, 35, 25, opacity * 255);
    line(
      (width * lineX[i - 1]) / 100,
      (height * lineY[i - 1]) / 100,
      (width * lineX[i]) / 100,
      (height * lineY[i]) / 100,
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// sound  need a click or key press before the browser allows it!!!!!
function startAudio() {
  if (backgroundAudio.paused) {
    backgroundAudio.play().catch(function () {
      console.log("Click or press a key to start the audio.");
    });
  }
}
