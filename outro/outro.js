document.addEventListener('DOMContentLoaded', function () {
    const storyElement = document.getElementById('story');
    const hiddenButton = document.getElementById('hiddenButton');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const toggleButton = document.getElementById('toggleButton');

    function toggleMute() {
        backgroundMusic.muted = !backgroundMusic.muted;
        updateButtonAppearance();
    }

    function updateButtonAppearance() {
        const isMuted = backgroundMusic.muted;
        toggleButton.src = isMuted ? '../assets/icon-muted-white.png' : '../assets/icon-unmuted-white.png';
    }

    toggleButton.addEventListener('click', toggleMute);
    updateButtonAppearance();



    const storyTexts = ["We did it! We gathered all the ingredients that we needed to make the magic potion!",
                        "I have to quickly go back home now and give this to my grandma. Thank you so much for your help and hope we'll meet again in my next adventure!",
                        "THE END."];
    let currentTextIndex = 0;
    let isTyping = false;

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

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && !isTyping && currentTextIndex < storyTexts.length) {
            // clear existing text before starting the typing effect
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