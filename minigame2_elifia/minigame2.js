let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let microphoneStream = null;
  let analyserNode = audioCtx.createAnalyser();
  let audioData = new Float32Array(analyserNode.fftSize);
  let corrolatedSignal = new Float32Array(analyserNode.fftSize);
  let localMaxima = new Array(10);
  const pitchBar = document.getElementById('pitchBar');
  const pitchIndicator = document.getElementById('pitchIndicator');
  const frequencyDisplayElement = document.querySelector('#frequency');

  function startPitchDetection() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        microphoneStream = audioCtx.createMediaStreamSource(stream);
        microphoneStream.connect(analyserNode);

        audioData = new Float32Array(analyserNode.fftSize);
        corrolatedSignal = new Float32Array(analyserNode.fftSize);

        setInterval(() => {
          analyserNode.getFloatTimeDomainData(audioData);

          let pitch = getAutocorrolatedPitch();

          // Update the pitch bar width based on the calculated pitch
          updatePitchBarWidth(pitch);
        }, 50);
      })
      .catch((err) => {
        console.log(err);
      });
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
    const normalizedPitch = Math.min(3000, Math.max(0, pitch));
    console.log('Pitch: ', pitch)
    // Update the width of the pitch indicator
    pitchIndicator.style.width = `${(normalizedPitch / 3000) * 100}%`;
  }

  // Start the pitch detection when the page loads
  startPitchDetection();