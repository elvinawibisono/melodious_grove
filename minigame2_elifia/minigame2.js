let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let filter, microphoneStream = null;
let analyserNode = audioCtx.createAnalyser();
let audioData = new Float32Array(analyserNode.fftSize);
let corrolatedSignal = new Float32Array(analyserNode.fftSize);
let localMaxima = new Array(10);
const pitchBar = document.getElementById('pitchBar');
const pitchIndicator = document.getElementById('pitchIndicator');
let isMicrophoneEnabled = false;
var smoothedPitch = 0.0;
const smoothingFactor = 0.1;

const targetPitchMin = Math.floor(Math.random() * (1000 - 300) + 200);
const targetPitchMax = targetPitchMin + 300;

let greenBarDuration = 0;
let shouldUpdateBar = true; // Flag to control whether the bar should be updated

console.log(targetPitchMin, ' ', targetPitchMax);

function toggleMicrophone() {
  if (!isMicrophoneEnabled) {
    startPitchDetection();
  } else {
    stopMicrophone();
  }
}

function goToNextPage() {
  window.location.href = '../minigame3_luci/minigame3.html';
}

function startPitchDetection() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      filter = audioCtx.createBiquadFilter();
      filter.Q.value = 8.30;
      filter.frequency.value = 100;
      filter.gain.value = 3.0;
      filter.type = 'bandpass';

      microphoneStream = audioCtx.createMediaStreamSource(stream);
      microphoneStream.connect(filter);
      filter.connect(analyserNode);

      audioData = new Float32Array(analyserNode.fftSize);
      corrolatedSignal = new Float32Array(analyserNode.fftSize);

      setInterval(() => {
        analyserNode.getFloatTimeDomainData(audioData);

        let pitch = getAutocorrolatedPitch();

        updatePitchBarWidth(pitch);
      }, 100);

      isMicrophoneEnabled = true;
      document.getElementById('microphoneButton').textContent = 'Disable Microphone';
    })
    .catch((err) => {
      console.log(err);
    });
}

function stopMicrophone() {
  if (microphoneStream) {
    shouldUpdateBar = false; // Disable bar updates
    microphoneStream.disconnect();
    isMicrophoneEnabled = false;
    document.getElementById('microphoneButton').textContent = 'Toggle Microphone';
  }
}

function getAutocorrolatedPitch() {
  let maximaCount = 0;

  for (let l = 0; l < analyserNode.fftSize; l++) {
    corrolatedSignal[l] = 0;
    for (let i = 0; i < analyserNode.fftSize - l; i++) {
      corrolatedSignal[l] += audioData[i] * audioData[i + l];
    }
    if (l > 1) {
      if ((corrolatedSignal[l - 2] - corrolatedSignal[l - 1]) < 0
        && (corrolatedSignal[l - 1] - corrolatedSignal[l]) > 0) {
        localMaxima[maximaCount] = (l - 1);
        maximaCount++;
        if ((maximaCount >= localMaxima.length))
          break;
      }
    }
  }

  let maximaMean = localMaxima[0];

  for (let i = 1; i < maximaCount; i++)
    maximaMean += localMaxima[i] - localMaxima[i - 1];

  maximaMean /= maximaCount;

  return audioCtx.sampleRate / maximaMean;
}

function isPitchInRange(pitch) {
  return pitch >= targetPitchMin && pitch <= targetPitchMax;
}

function updatePitchBarWidth(pitch) {
  // Normalize the pitch value to fit within the bar's range
  if (shouldUpdateBar && !isNaN(pitch) && !isNaN(smoothedPitch)) {
    smoothedPitch = smoothingFactor * pitch + (1 - smoothingFactor) * smoothedPitch;
  }
  const normalizedPitch = Math.max(0, Math.min(1200, smoothedPitch));

  console.log('Smoothed Pitch: ', smoothedPitch, 'Pitch: ', pitch);

  if (isPitchInRange(smoothedPitch)) {
    pitchIndicator.style.backgroundColor = '#00ff00'; // Green
    greenBarDuration += 0.1;
  } else {
    pitchIndicator.style.backgroundColor = '#ff0000'; // Red
    greenBarDuration = 0;
  }

  if (greenBarDuration >= 3) {
    stopMicrophone();
    pitchIndicator.style.backgroundColor = '#0000ff'; // Blue
  } else {
    pitchIndicator.style.width = `${(normalizedPitch / 1200) * 100}%`;
  }
}

startPitchDetection();
