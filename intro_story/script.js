document.addEventListener('DOMContentLoaded', function () {
    const storyElement = document.getElementById('story');
    const hiddenButton = document.getElementById('hiddenButton');

    const storyTexts = ["Hi, my name is Ari!", 
                        "My grandma is dying and I need your help to save her.", 
                        "I need to find the ingredients to make a magic potion that could heal her.",
                        "But, the ingredients are hidden in the MELODIOUS GROVE, a mysterious forest that I've only heard of in stories!",
                        "Please help me find my way around the MELODIOUS GROVE and save my grandma!!!"];
    let currentTextIndex = 0;
    let isTyping = false;

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
        if (currentTextIndex === storyTexts.length) {
            hiddenButton.classList.remove('hidden'); // Show the hidden button
        }
        if (event.key === 'Enter' && !isTyping && currentTextIndex < storyTexts.length) {
            // Clear existing text before starting the typing effect
            storyElement.innerHTML = '';
            typeWriterEffect(storyTexts[currentTextIndex], 0);
            currentTextIndex++;
        }
    });

    // Start the typing effect when the page loads
    typeWriterEffect(storyTexts[currentTextIndex], 0);
    currentTextIndex = (currentTextIndex + 1) % storyTexts.length;
});

function handleHiddenButtonClick() {
    // Handle the hidden button click, e.g., proceed to the next part of your game
    window.location.href = '../minigame1.html';
}
