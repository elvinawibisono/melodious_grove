// initialize all variables
const storyElement = document.getElementById('story');
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let highpassFilter, lowpassFilter, microphoneStream = null;
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
let targetPitchMin = Math.floor(Math.random() * (500 - 100) + 150);
let targetPitchMax = targetPitchMin + 100;

// checks if the user holds the note for 3 seconds and to stop updating if the user already won
let greenBarDuration = 0;
let shouldUpdateBar = true; 

// variables to tell the story in the game
let currentTextIndex = 0;
let isTyping = false;
storyTexts = ["Hmm, I think we have reached the famous SINGING TREES of the MELODIOUS GROVE.",
        "I was told that one of the ingredients for the magic potion is hidden within these trees and you must sing at a certain pitch range to obtain the ingredient!",
        "Above me is a bar that will show you the pitch when you sing into the microphone. When you find the correct pitch range, the bar will turn green. You'll need to hold that note and sing within that pitch range for a few seconds before we get any response from the trees.",
        "Good luck! You can do this."]

postGameStory = ["Yay you did it! You helped me obtain the ingredient. Thank you!",
                "Now, let's find the other ingredients!"]

console.log(targetPitchMin, ' ', targetPitchMax);

let level = 1

// prints the story text with a type writer effect
function typeWriterEffect(text, index) {
    if (index < text.length) {
        isTyping = true;
        storyElement.innerHTML += text.charAt(index);
        index++;
        setTimeout(() => typeWriterEffect(text, index), 50);
    } else {
        isTyping = false;
    }
}

// continues the story or game based on a keydown event
document.addEventListener('keydown', function (event) {
    // if the story at the beginning of the game has all been told, start the game (pitch detection)
    if (currentTextIndex == storyTexts.length) {
        if (shouldUpdateBar) {
            console.log('start')
            startPitchDetection();
        }
    }
    // if all the story meant to be told at the beginning of the game hasn't been told, keep telling the story
    else if (event.key === 'Enter' && !isTyping && currentTextIndex < storyTexts.length) {
        storyElement.innerHTML = ''; // Clear existing text before starting the typing effect
        typeWriterEffect(storyTexts[currentTextIndex], 0);
        currentTextIndex++;
    }
    // if all the story texts has been told, show the button that allows the user to go to the next minigame
    else if (currentTextIndex == storyTexts.length + postGameStory.length) {
        hiddenButton.classList.remove('hidden');
    }
    // tells the story after the game finished
    else if (event.key === 'Enter' && !isTyping && currentTextIndex > storyTexts.length) {
        storyElement.innerHTML = '';
        typeWriterEffect(postGameStory[currentTextIndex-storyTexts.length], 0);
        currentTextIndex++;
    }
    
});

/* 
* Credit to:
* https://stackoverflow.com/questions/69237143/how-do-i-get-the-audio-frequency-from-my-mic-using-javascript 
*/
function startPitchDetection() {
  // asks permission to turn on microphone
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      // Create a highpass filter
      highpassFilter = audioCtx.createBiquadFilter();
      highpassFilter.type = 'highpass';
      highpassFilter.frequency.value = 600;

      // Create a lowpass filter
      lowpassFilter = audioCtx.createBiquadFilter();
      lowpassFilter.type = 'lowpass';
      lowpassFilter.frequency.value = 50;

      // Create a microphone input streams
      microphoneStream = audioCtx.createMediaStreamSource(stream);

      // Connect the different components
      microphoneStream.connect(highpassFilter);
      highpassFilter.connect(lowpassFilter);
      lowpassFilter.connect(analyserNode)

      // Initialize the audio signals to be autocorrolated
      audioData = new Float32Array(analyserNode.fftSize);
      corrolatedSignal = new Float32Array(analyserNode.fftSize);

      setInterval(() => {
        // Get audio signal
        analyserNode.getFloatTimeDomainData(audioData);

        // Run autocorrolation and get pitch
        let pitch = getAutocorrolatedPitch();

        // Update the pitch bar at the top of the page
        updatePitchBarWidth(pitch);
      }, 100);

      // flag to check whether the microphone is on or not
      isMicrophoneEnabled = true;
    })
    .catch((err) => {
      console.log(err);
    });
}

// Turns off the microphone so it stops updating the pitch bar
function stopMicrophone() {
  if (microphoneStream) {
    shouldUpdateBar = false; 
    microphoneStream.disconnect();
    isMicrophoneEnabled = false;
  }
}

/* 
* Credit to:
* https://stackoverflow.com/questions/69237143/how-do-i-get-the-audio-frequency-from-my-mic-using-javascript 
*/
function getAutocorrolatedPitch() {
  let maximaCount = 0;

  // run autocorrolation
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

  // find the mean distance between maximas
  let maximaMean = localMaxima[0];

  for (let i = 1; i < maximaCount; i++)
    maximaMean += localMaxima[i] - localMaxima[i - 1];

  maximaMean /= maximaCount;

  // returns frequency
  return audioCtx.sampleRate / maximaMean;
}

// checks if pitch is in the random target pitch range
function isPitchInRange(pitch) {
  return pitch >= targetPitchMin && pitch <= targetPitchMax;
}

// function that will update the width of the pitch bar at the top of the page
function updatePitchBarWidth(pitch) {
  // gets the smoothed pitch to be displayed in the pitch bar
  /* smoothed pitch prevents the pitch bar width to drastically change and smoothly transitions from
  * one pitch to another */
  if (shouldUpdateBar && !isNaN(pitch) && !isNaN(smoothedPitch)) {
    smoothedPitch = smoothingFactor * pitch + (1 - smoothingFactor) * smoothedPitch;
  }

  // normalize it so that it fits the range of the pitch bar
  const normalizedPitch = Math.max(0, Math.min(600, smoothedPitch));

  console.log('Smoothed Pitch: ', smoothedPitch, 'Pitch: ', pitch);

  // if the smoothed pitch is in the target pitch range, turn the bar green and start counting the duration
  if (isPitchInRange(smoothedPitch)) {
    pitchIndicator.style.backgroundColor = '#00ff00'; // Green
    greenBarDuration += 0.1;
  } 
  // if the smoothed pitch is not in target pitch range, color the bar red and reset the duration count
  else {
    pitchIndicator.style.backgroundColor = '#ff0000'; // Red
    greenBarDuration = 0;
  }

  // if the bar has been green for about 3 seconds, run this block of code
  if (greenBarDuration >= 3) {
    stopMicrophone();

    // go to the next level if there are still more levels to complete
    if (level < 3) {
      startNextLevel()
    }

    // if all the levels have been completed, tell the post game story
    if (level == 3 && !isTyping && currentTextIndex == storyTexts.length) {
        storyElement.innerHTML = '';
        typeWriterEffect(postGameStory[currentTextIndex-storyTexts.length], 0);
        currentTextIndex++;
    } 
    
  } 
  // else, update the pitch bar width to the normalized pitch
  else {
    pitchIndicator.style.width = `${(normalizedPitch / 600) * 100}%`;
  }
}

// allows for the next level of the game to start
function startNextLevel() {
  // increase level
  level++;

  // reset pitch bar variables
  greenBarDuration = 0;
  shouldUpdateBar = true;

  // regenerate a new random pitch range
  targetPitchMin = Math.floor(Math.random() * (500 - 100) + 150);
  targetPitchMax = targetPitchMin + 100;

  // For level 2 of the game
  if (level == 2) {
    // tell the next part of the story to introduce the users to level 2 of the game
    if (!isTyping) {
      storyElement.innerHTML = '';
      typeWriterEffect('Huh, that\'s weird... Nothing Happened! Shall we try again?',0);
    }
    // run pitch detection
    setTimeout(() => {
      startPitchDetection();
    }, 6000);
  } 

  // For level 3 (final level) of the game
  else if (level == 3) {
    // tell the story
    if (!isTyping) {
      storyElement.innerHTML = '';
      typeWriterEffect('Oh wait, I can hear the leaves rustling! We should do it one more time and I think that\'ll do it.',0);
    }
    // run pitch detection
    setTimeout(() => {
      startPitchDetection();
    }, 6000);
  }
}

// goes to the next minigame
function goToNextPage() {
  window.location.href = '../minigame3_luci/transition.html';
}

// go through the story texts to tell the user the story
function tellStory() {
  typeWriterEffect(storyTexts[currentTextIndex], 0);
  currentTextIndex = (currentTextIndex + 1);
}

// run tellStory() as the page loads
tellStory()