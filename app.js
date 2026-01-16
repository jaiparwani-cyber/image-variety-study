/* ================= CONFIG ================= */

const IMAGE_LIST = [
  "images\a_2_4.9663.jpg",
"images\a_3_5.9304.jpg",
"images\a_4_1.7517.jpg",
"images\a_5_6.8506.jpg",
"images\a_6_9.8057.jpg",
"images\a_7_2.9955.jpg",
"images\a_8_5.7675.jpg",
"images\a_9_9.8798.jpg",
"images\a_10_4.9481.jpg",
"images\a_11_7.8638.jpg",
"images\a_12_1.6301.jpg",
"images\a_13_6.9188.jpg",
"images\a_14_1.9671.jpg",
"images\a_15_7.8318.jpg",
"images\a_16_1.9401.jpg",
"images\a_17_3.9660.jpg",
"images\a_18_5.9244.jpg",
"images\a_19_5.9233.jpeg",
"images\b_1_4.8927.jpg",
"images\b_2_4.9970.jpg",
"images\b_3_4.9484.png",
"images\b_4_1.9999.png",
"images\b_5_1.6449.jpg",
"images\b_6_0.7655.jpg",
"images\b_7_4.9371.jpg",
"images\b_8_4.9640.jpg",
"images\b_9_9.8616.jpg",
"images\b_10_4.8838.jpg",
"images\b_11_4.9756.jpg",
"images\b_12_1.9938.png",
"images\b_13_5.9965.png",
"images\b_14_1.0539.png",
"images\b15_8.4448.png",
"images\b16_1.7875.png",
"images\variety_2_1.08.png",
"images\variety_2_1.09.png",
"images\variety_9_1.53.png",
"images\variety_14_2.00.png",
"images\variety_19_2.61.png",
"images\variety_24_2.97.png",
"images\variety_29_3.52.png",
"images\variety_41_4.00.png",
"images\variety_46_4.55.png",
"images\variety_61_5.50.png",
"images\variety_67_6.45.png",
"images\variety_73_6.82.png",
"images\variety_81_7.72.png",
"images\variety_95_8.76.png",
"images\a_1_4.9865.jpg"
];

const API_URL = "https://script.google.com/macros/s/AKfycbyv-iYJhGEhCxOoFhnUrfEtzbkEXkdJ_vQ9GiSr8ZXlAqtnB0hNZSyuPgctvk3e375p8A/exec";

/* ================= SESSION ================= */

let sessionId = localStorage.getItem("session_id");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("session_id", sessionId);
}

/* ================= STATE ================= */

let comparisons = 0;
let startTime = null;
let currentPair = null;

/* ================= DOM ================= */

const leftImg = document.getElementById("leftImage");
const rightImg = document.getElementById("rightImage");
const counter = document.getElementById("counter");

/* ================= PAIRS ================= */

function generateAllPairs(images) {
  const pairs = [];
  for (let i = 0; i < images.length; i++) {
    for (let j = i + 1; j < images.length; j++) {
      pairs.push([images[i], images[j]]);
    }
  }
  return pairs;
}

let pairQueue = generateAllPairs(IMAGE_LIST);
shuffle(pairQueue);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function nextPair() {
  if (pairQueue.length === 0) {
    pairQueue = generateAllPairs(IMAGE_LIST);
    shuffle(pairQueue);
  }
  return pairQueue.pop();
}

/* ================= DISPLAY ================= */

function loadNextTrial() {
  currentPair = nextPair();

  const [left, right] = Math.random() < 0.5
    ? [currentPair[0], currentPair[1]]
    : [currentPair[1], currentPair[0]];

  leftImg.src = left;
  rightImg.src = right;

  startTime = performance.now();
}

/* ================= SUBMIT ================= */

async function submitChoice(side) {
  const decisionTime = Math.round(performance.now() - startTime);

  comparisons++;
  counter.textContent = `Comparisons: ${comparisons}`;

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      image_a: currentPair[0],
      image_b: currentPair[1],
      shown_left: leftImg.src,
      shown_right: rightImg.src,
      selected: side,
      decision_time_ms: decisionTime,
      session_id: sessionId
    })
  });

  loadNextTrial();
}

/* ================= EVENTS ================= */

leftImg.onclick = () => submitChoice("left");
rightImg.onclick = () => submitChoice("right");

/* ================= START ================= */

loadNextTrial();
