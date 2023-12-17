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
    const storyTexts = ["Yay! We did it ! We are inside the forest now. Let's find the first ingredient: the stone mushroom!", 
                       "Hmm, rumour has it that it grows around the goblin cave, I wonder where is it..", 
                        "OOOH!! AHHHHHH!!!!", 
                        "Oh no! We fell down a hole. What should we do?"];
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
        // if the story is done, show the button that will let the user go to the first minigame
        if (currentTextIndex === storyTexts.length) {
            hiddenButton.classList.remove('hidden'); // show hidden button
        }
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

// controller for the button that will direct the user to the first minigame
function handleHiddenButtonClick() {
    window.location.href = 'second_storyp2.html';
}