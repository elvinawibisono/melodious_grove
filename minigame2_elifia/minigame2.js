const storyElement = document.getElementById('story');
    
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let filter, compressor, microphoneStream = null;
let analyserNode = audioCtx.createAnalyser();
let audioData = new Float32Array(analyserNode.fftSize);
let corrolatedSignal = new Float32Array(analyserNode.fftSize);
let localMaxima = new Array(10);
const pitchBar = document.getElementById('pitchBar');
const pitchIndicator = document.getElementById('pitchIndicator');
let isMicrophoneEnabled = false;
var smoothedPitch = 0.0;
const smoothingFactor = 0.1;

// sets the range that the user needs to sing
const targetPitchMin = Math.floor(Math.random() * (500 - 250) + 150);
const targetPitchMax = targetPitchMin + 250;

// checks if the user holds the note for 3 seconds and to stop updating if the user already won
let greenBarDuration = 0;
let shouldUpdateBar = true; 

let currentTextIndex = 0;
let isTyping = false;
storyTexts = ["Hmm, I think we have reached the famous SINGING TREES of the MELODIOUS GROVE.",
        "I was told that one of the ingredients for the magic potion is hidden within these trees and you must sing at a certain pitch range to obtain the ingredient!",
        "Above me is a bar that will show you the pitch when you sing into the microphone. When you find the correct pitch range, the bar will turn green. You'll need to hold that note and sing within that pitch range for 3 seconds until the bar turns blue.",
        "Good luck! You can do this."]

postGameStory = ["Yay you did it! You helped me obtain the ingredient. Thank you!",
                "Now, onto the last challenge!"]

console.log(targetPitchMin, ' ', targetPitchMax);


function typeWriterEffect(text, index) {
    if (index < text.length) {
        isTyping = true;
        storyElement.innerHTML += text.charAt(index);
        index++;
        setTimeout(() => typeWriterEffect(text, index), 50); // Adjust the typing speed here
    } else {
        isTyping = false;  // Reset the flag when typing is done
    }
}

document.addEventListener('keydown', function (event) {
    if (currentTextIndex == storyTexts.length) {
        if (shouldUpdateBar) {
            console.log('start')
            startPitchDetection();
        }
        
    }
    else if (event.key === 'Enter' && !isTyping && currentTextIndex < storyTexts.length) {
        // Clear existing text before starting the typing effect
        storyElement.innerHTML = '';
        typeWriterEffect(storyTexts[currentTextIndex], 0);
        currentTextIndex++;
    }
    else if (currentTextIndex == storyTexts.length + postGameStory.length) {
        hiddenButton.classList.remove('hidden');
    }
    else if (event.key === 'Enter' && !isTyping && currentTextIndex > storyTexts.length) {
        storyElement.innerHTML = '';
        typeWriterEffect(postGameStory[currentTextIndex-storyTexts.length], 0);
        currentTextIndex++;
    }
    
});



function goToNextPage() {
  window.location.href = '../minigame3_luci/minigame3.html';
}

/* https://stackoverflow.com/questions/69237143/how-do-i-get-the-audio-frequency-from-my-mic-using-javascript */
function startPitchDetection() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        /* https://stackoverflow.com/questions/16949768/how-can-i-reduce-the-noise-of-a-microphone-input-with-the-web-audio-api */
        compressor = audioCtx.createDynamicsCompressor();
        compressor.threshold.value = -50;
        compressor.knee.value = 40;
        compressor.ratio.value = 12;
        compressor.reduction.value = -20;
        compressor.attack.value = 0;
        compressor.release.value = 0.25;

      filter = audioCtx.createBiquadFilter();
      filter.Q.value = 8.30;
      filter.frequency.value = 100;
      filter.gain.value = 3.0;
      filter.type = 'bandpass';

      microphoneStream = audioCtx.createMediaStreamSource(stream);
      microphoneStream.connect(filter);
      filter.connect(analyserNode);
      filter.connect(compressor);

      compressor.connect(analyserNode)

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
    // document.getElementById('microphoneButton').textContent = 'Toggle Microphone';
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
  const normalizedPitch = Math.max(0, Math.min(600, smoothedPitch));

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
    if (!isTyping && currentTextIndex == storyTexts.length) {
        storyElement.innerHTML = '';
        typeWriterEffect(postGameStory[currentTextIndex-storyTexts.length], 0);
        currentTextIndex++;
    } 
  } else {
    pitchIndicator.style.width = `${(normalizedPitch / 600) * 100}%`;
  }
}

function tellStory() {
    typeWriterEffect(storyTexts[currentTextIndex], 0);
    currentTextIndex = (currentTextIndex + 1);
    
}

tellStory()