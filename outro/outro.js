// run this block of code as the page loads
document.addEventListener('DOMContentLoaded', function () {
    // initialize variables
    const storyElement = document.getElementById('story');
    const hiddenButton = document.getElementById('hiddenButton');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const toggleButton = document.getElementById('toggleButton');

    // handle muting/unmuting background music
    function toggleMute() {
        backgroundMusic.muted = !backgroundMusic.muted;
        updateButtonAppearance();
    }

    // change the speaker picture depending on whether the music is muted or not
    function updateButtonAppearance() {
        const isMuted = backgroundMusic.muted;
        toggleButton.src = isMuted ? '../assets/icon-muted-white.png' : '../assets/icon-unmuted-white.png';
    }

    toggleButton.addEventListener('click', toggleMute);
    updateButtonAppearance();


    // story here
    const storyTexts = ["We did it! We gathered all the ingredients that we needed to make the magic potion!",
                        "I have to quickly go back home now and give this to my grandma. Thank you so much for your help and hope we'll meet again in my next adventure!",
                        "THE END."];
    let currentTextIndex = 0;
    let isTyping = false;

    // function that will tell the story with a type writer effect
    function typeWriterEffect(text, index) {
        if (index < text.length) {
            isTyping = true;
            storyElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(() => typeWriterEffect(text, index), 50);
        }
        // only tell the next part of the story after the current story is done typing 
        else {
            isTyping = false; 
        }
    }

     // listens for keydown events
    document.addEventListener('keydown', function (event) {
        // continue telling the story
        if (event.key === 'Enter' && !isTyping && currentTextIndex < storyTexts.length) {
            storyElement.innerHTML = '';
            typeWriterEffect(storyTexts[currentTextIndex], 0);
            currentTextIndex++;
        }
    });

    // start typing when the page loads
    typeWriterEffect(storyTexts[currentTextIndex], 0);
    currentTextIndex = (currentTextIndex + 1) % storyTexts.length;
});

function handleHiddenButtonClick() {
    window.location.href = '../minigame1.html';
}