var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,  // Set the width to the window's width
    height: window.innerHeight,
    physics: {
        default: 'arcade', // Enable Arcade Physics
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
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
    this.load.spritesheet('girl', '../assets/characters/girl_main.png', { frameWidth: 16, frameHeight: 24});
}

function create() {
    this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background').setOrigin(0.5, 0.5);

    // Calculate the center of the game canvas
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    player = this.physics.add.sprite(centerX, centerY, 'girl');
    player.setOrigin(0.5);

    player.setScale(3);

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('girl', { frames: [2, 10, 18] }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('girl', { frames: [0, 8, 16] }),
        frameRate: 10,
        repeat: -1
    });

    // Configure animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('girl', { frames: [6, 14, 22] }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('girl', { frames: [4, 12, 20] }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'girl', frame: 4 } ],
        frameRate: 20
    });

    cursors = this.input.keyboard.createCursorKeys();


}

function update() {
    // Update game logic

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }

    else if (cursors.up.isDown)
    {
        player.setVelocityY(-160);

        player.anims.play('up', true);
    }

    else if (cursors.down.isDown)
    {
        player.setVelocityY(160);

        player.anims.play('down', true);
    }


    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else

    {
        player.setVelocityX(0);
        player.setVelocityY(0);

        player.anims.play('turn');
    }
}
