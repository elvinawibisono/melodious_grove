const storyElement = document.getElementById('story');
    

let currentTextIndex = 0;
let isTyping = false;
storyTexts = ["We made it past the forest! But it looks like we still need 3 main ingredients.",
        "We have come across these three chests! All I know is that they hold the remaining secret ingredients we need to bring to grandma! Please help me open them!",
        "In order to open the chests, you must remember and open them using the power of music! You must memorize a sequence of patterns that will be played for you, and then play it back using your computer's keyboard.",
        "When we start, you must press PLAY. There will be 5 notes played for you, ranging from 5 different notes(first box), 12 different notes (second box), or 24 different notes (third box), based on level. ",
        "Good luck cracking the boxes!"]

postGameStory = ["Yay you did it! You helped me obtain the ingredient. Thank you!",
                "Now, onto the last challenge!"]



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
        //ADd the button to click on it, and then move to the next page
        document.getElementById("hiddenButton").style.display = "block";
        
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

var playButton = document.getElementById("hiddenButton");

playButton.addEventListener('click', function () {
  goToNextPage();
});


function goToNextPage() {
  window.location.href = 'minigame3.html';
}


function tellStory() {
    typeWriterEffect(storyTexts[currentTextIndex], 0);
    currentTextIndex = (currentTextIndex + 1);
    
}

tellStory()