// =====================
// SETTINGS
// =====================
let settings = {
  volume: 0.7,
  readySetDelay: 1200,
  setGoDelay: 2000,
  goLoopSpeed: 800
};

// =====================
// STATE
// =====================
let readyAudio, setAudio, goAudio;
let goInterval;
let canReact = false;
let startTime;

// =====================
// STATS
// =====================
let best = null;
let total = 0;
let count = 0;

// =====================
// SCREEN CONTROL
// =====================
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.add("hidden");
  });

  const screen = document.getElementById(id);
  if (screen) screen.classList.remove("hidden");
}

// =====================
// SETTINGS OPEN
// =====================
function openSettings() {
  showScreen("settingsScreen");

  document.getElementById("volumeSlider").value = settings.volume;
  document.getElementById("delay1").value = settings.readySetDelay;
  document.getElementById("delay2").value = settings.setGoDelay;
  document.getElementById("delay3").value = settings.goLoopSpeed;
}

// =====================
// SETTINGS CLOSE
// =====================
function closeSettings() {
  showScreen("homeScreen");
}

// =====================
// SAVE SETTINGS
// =====================
function saveSettings() {
  settings.volume = parseFloat(document.getElementById("volumeSlider").value);
  settings.readySetDelay = parseInt(document.getElementById("delay1").value);
  settings.setGoDelay = parseInt(document.getElementById("delay2").value);
  settings.goLoopSpeed = parseInt(document.getElementById("delay3").value);

  closeSettings();
}

// =====================
// VOLUME HELPER
// =====================
function setVolume(audio) {
  if (audio) audio.volume = settings.volume;
}

// =====================
// START SEQUENCE
// =====================
function startSequence() {
  stopAllAudio();

  showScreen("homeScreen");

  readyAudio = new Audio("audio/ready.mp3");
  setAudio = new Audio("audio/set.mp3");
  goAudio = new Audio("audio/go.mp3");

  setVolume(readyAudio);
  setVolume(setAudio);
  setVolume(goAudio);

  readyAudio.play();

  setTimeout(() => {
    setAudio.play();

    setTimeout(() => {
      startGoDelay();
    }, settings.setGoDelay);

  }, settings.readySetDelay);
}

// =====================
// RANDOM GO DELAY
// =====================
function startGoDelay() {
  let delay = Math.random() * 4800 + 200;

  setTimeout(triggerGo, delay);

  startGoLoop();
}

// =====================
// GO LOOP AUDIO
// =====================
function startGoLoop() {
  goAudio.loop = true;
  goAudio.play();

  goInterval = setInterval(() => {
    goAudio.currentTime = 0;
    goAudio.play();
  }, settings.goLoopSpeed);
}

// =====================
// GO TRIGGER
// =====================
function triggerGo() {
  clearInterval(goInterval);
  stopAllAudio();

  showScreen("goScreen");

  canReact = true;
  startTime = performance.now();

  const goScreen = document.getElementById("goScreen");
  goScreen.onclick = handleReaction;
}

// =====================
// STOP AUDIO
// =====================
function stopAllAudio() {
  [readyAudio, setAudio, goAudio].forEach(a => {
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
  });
}

// =====================
// REACTION
// =====================
function handleReaction() {
  if (!canReact) return;

  let reaction = performance.now() - startTime;
  canReact = false;

  total += reaction;
  count++;

  if (!best || reaction < best) best = reaction;

  showScreen("resultScreen");

  document.getElementById("resultScreen").innerHTML = `
    <h1>${reaction.toFixed(0)} ms</h1>
    <p>Best: ${best.toFixed(0)} ms</p>
    <p>Avg: ${(total / count).toFixed(0)} ms</p>

    <button onclick="startSequence()">Start Again</button>
    <button onclick="showScreen('homeScreen')">Home</button>
  `;
}

// =====================
// INIT
// =====================
window.onload = () => {
  showScreen("homeScreen");
};