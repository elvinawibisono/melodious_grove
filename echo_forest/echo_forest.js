const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,  // Set the width to the window's width
    height: window.innerHeight,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Preload assets like images, sprites, etc.
    this.load.image('background', '../assets/level_background.png');
}

function create() {
    // Create game objects and initialize the world
    this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background').setOrigin(0.5, 0.5);
}

function update() {
    // Update game logic
}
