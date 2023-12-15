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

function toggleMicrophone() {
  if (!isMicrophoneEnabled) {
    startPitchDetection();
  } else {
    stopMicrophone();
  }
}


function startPitchDetection() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        /* https://stackoverflow.com/questions/16949768/how-can-i-reduce-the-noise-of-a-microphone-input-with-the-web-audio-api */

      // Create a notch filter to suppress specific frequencies (adjust as needed)
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

        // Update the pitch bar width based on the calculated pitch
        updatePitchBarWidth(pitch);
      }, 50);
      
      isMicrophoneEnabled = true;
      document.getElementById('microphoneButton').textContent = 'Disable Microphone';
    })
    .catch((err) => {
      console.log(err);
    });
}

function stopMicrophone() {
  if (microphoneStream) {
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

function updatePitchBarWidth(pitch) {
  // Normalize the pitch value to fit within the bar's range
  if (!isNaN(pitch) && !isNaN(smoothedPitch)) {
    smoothedPitch = smoothingFactor * pitch + (1 - smoothingFactor) * smoothedPitch;
  }

    // Normalize the smoothed pitch value to fit within the bar's range
    const normalizedPitch = Math.max(0, Math.min(1200, smoothedPitch));

    console.log('Smoothed Pitch: ', smoothedPitch, 'Pitch: ', pitch);

    // Update the width of the pitch indicator
    pitchIndicator.style.width = `${(normalizedPitch / 1200) * 100}%`;
//   var normalizedPitch = 0;

//   if (pitch < 1000) {
//     normalizedPitch = Math.max(0, pitch)
//   }
//   console.log('Pitch: ', pitch)
//   // Update the width of the pitch indicator
//   pitchIndicator.style.width = `${(normalizedPitch / 1000) * 100}%`;
}

// Start the pitch detection when the page loads
startPitchDetection();

function goToNextPage() {
  window.location.href = 'minigame3_luci/minigame3.html';
}