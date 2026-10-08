let faceMesh;
let camera;
let cameraStream;
let stage;
let cameraButton;
let cameraStatus;
let blurTimer;
let isBlurred = true;
let pendingBlur = null;
let tracking = false;

function setup() {
  noCanvas();
}

window.addEventListener("load", function () {
  stage = document.getElementById("stage");
  camera = document.getElementById("camera");
  cameraButton = document.getElementById("camera-button");
  cameraStatus = document.getElementById("camera-status");
  cameraButton.addEventListener("click", startCamera);
});

// async/await waits for the camera and model to be ready.
// An HTML video keeps all styling in CSS, avoiding p5 .hide().
async function startCamera() {
  if (tracking) {
    stopCamera();
    return;
  }
  cameraButton.disabled = true;
  cameraStatus.textContent = "Starting camera and loading face detection…";
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }, audio: false
    });
    camera.srcObject = cameraStream;
    await camera.play();
    // Your p5.js 2 version uses an asynchronous ml5 constructor.
    if (!faceMesh) faceMesh = await ml5.faceMesh({ maxFaces: 1 });
    tracking = true;
    faceMesh.detectStart(camera, gotFaces);
    cameraButton.textContent = "Stop camera";
    cameraStatus.textContent = "Look toward the screen.";
    cameraStream.getVideoTracks()[0].addEventListener("ended", stopCamera);
  } catch (error) {
    stopCamera();
    cameraStatus.textContent = "Camera or model unavailable. Allow camera access and use localhost or HTTPS, then retry.";
    console.error(error);
  }
  cameraButton.disabled = false;
}

function gotFaces(faces) {
  if (!tracking) return;
  let looking = false;
  if (faces.length > 0) looking = facingScreen(faces[0]);
  scheduleBlur(!looking);
}

// Estimate head direction using the nose and outer eye corners.
// This is not precise eye-gaze tracking.
function facingScreen(face) {
  let eyeOne = face.keypoints[33];
  let eyeTwo = face.keypoints[263];
  let nose = face.keypoints[1];
  let chin = face.keypoints[152];
  if (!eyeOne || !eyeTwo || !nose || !chin) return false;
  let left = Math.min(eyeOne.x, eyeTwo.x);
  let eyeWidth = Math.abs(eyeTwo.x - eyeOne.x);
  let eyeHeight = (eyeOne.y + eyeTwo.y) / 2;
  let faceHeight = chin.y - eyeHeight;
  if (eyeWidth < 20 || faceHeight < 20) return false;
  let sideways = (nose.x - left) / eyeWidth;
  let vertical = (nose.y - eyeHeight) / faceHeight;
  // Adjust these ranges for stricter or more forgiving detection.
  return sideways > 0.25 && sideways < 0.75 &&
    vertical > 0.15 && vertical < 0.7;
}

// A half-second delay prevents flickering on one missed detection.
function scheduleBlur(shouldBlur) {
  if (shouldBlur === isBlurred) {
    clearTimeout(blurTimer);
    pendingBlur = null;
    return;
  }
  if (pendingBlur === shouldBlur) return;
  clearTimeout(blurTimer);
  pendingBlur = shouldBlur;
  blurTimer = setTimeout(changeBlur, 500, shouldBlur);
}

function changeBlur(shouldBlur) {
  isBlurred = shouldBlur;
  pendingBlur = null;
  if (shouldBlur) {
    stage.classList.add("is-blurred");
    cameraStatus.textContent = "Look back. The images will return.";
  } else {
    stage.classList.remove("is-blurred");
    cameraStatus.textContent = "You’re here.";
  }
}

function stopCamera() {
  tracking = false;
  clearTimeout(blurTimer);
  pendingBlur = null;
  if (faceMesh) faceMesh.detectStop();
  if (cameraStream) {
    cameraStream.getTracks().forEach(function (track) { track.stop(); });
  }
  cameraStream = null;
  camera.srcObject = null;
  changeBlur(true);
  cameraButton.textContent = "Enable camera";
  cameraStatus.textContent = "Camera stopped.";
}

window.addEventListener("pagehide", function () {
  if (cameraStream) stopCamera();
});
