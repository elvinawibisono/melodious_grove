// Create a Phaser.Game instance
var config = {
    type: Phaser.CANVAS,
    width: 1000,
    height: 800,
    physics: {
        default: 'arcade', 
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

var game = new Phaser.Game(config);
var player; 
var cursors;
var wallsGroup;
var maze;
var startX;
var startY;
var centerX;
var centerY;
var tileSize;
let reachedEnd = false;
let spotlight; 
var rays;
let flashlightGraphics;
var flashlightCover;
var flashlightReveal;
var maskImage;
var circle;
var music; 
var distanceThreshold = 1500;

// Load your images
function preload() {
    this.load.image('path_7_lft', 'img/path_7_lft.png');
    this.load.image('path_7_rgt', 'img/path_7_rgt.png');
    this.load.image('path_cross', 'img/path_cross.png');
    this.load.image('end', 'img/path_vert_up.png');
    this.load.image('path_hori_lft', 'img/path_hori_lft.png');
    this.load.image('path_hori_rgt', 'img/path_hori_rgt.png');
    this.load.image('path_hori', 'img/path_hori.png');
    this.load.image('path_L_rgt', 'img/path_L_rgt.png');
    this.load.image('path_portal_2', 'img/path_portal_2.png');
    this.load.image('path_portal', 'img/path_portal.png');
    this.load.image('path_T_down', 'img/path_T_down.png');
    this.load.image('path_T_lft', 'img/path_T_lft.png');
    this.load.image('path_T_rgt', 'img/path_T_rgt.png');
    this.load.image('path_T_up', 'img/path_T_up.png');
    this.load.image('path_vert_up', 'img/path_vert_up.png');
    this.load.image('path_vert', 'img/path_vert.png');
    this.load.image('wall', 'img/wall.png');
    this.load.spritesheet('girl', '../assets/characters/girl_main.png', { frameWidth: 16, frameHeight: 24});
    this.load.audio('backgroundMusic', '../assets/mazegame_music.mp3');
}
  


function create() {

    music = this.sound.add('backgroundMusic', { loop: true });
    music.play();

    // Create maze
    maze = [
    ["path_7_rgt", "path_hori", "path_hori", "path_hori", "path_7_lft"],
    ["path_vert", "wall", "wall", "wall", "end"],
    ["path_T_rgt", "path_hori", "path_T_down", "path_hori_lft", "wall"],
    ["path_vert_up", "wall", "path_vert", "wall", "wall"],
    ["wall", "path_hori_rgt", "path_cross", "path_hori", "path_7_lft"],
    ["path_T_rgt", "path_hori", "path_T_lft", "wall", "path_vert"],
    ["path_L_rgt", "path_hori", "path_cross", "path_hori", "path_T_lft"],
    ["wall", "wall", "path_vert", "wall", "path_vert_up"],
    ["path_hori_rgt", "path_hori", "path_T_up", "path_hori_lft", "wall"],
    ];

    tileSize = 200; 

    // Calculate the total width and height of the maze in pixels
    const mazeWidth = maze[0].length * tileSize;
    const mazeHeight = maze.length * tileSize;
    centerX = this.cameras.main.width / 2;
    centerY = this.cameras.main.height / 2;
    startX = centerX - mazeWidth / 2;
    startY = centerY - mazeHeight / 2;


    this.cameras.main.setBounds(500 - mazeWidth / 2, 400 - mazeHeight / 2, mazeWidth, mazeHeight);
    this.physics.world.setBounds(500 - mazeWidth / 2, 400 - mazeHeight / 2, mazeWidth, mazeHeight);


    wallsGroup = this.physics.add.staticGroup();

  
    // Create maze sprites
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const tile = maze[row][col];
            const x = startX + col * tileSize + tileSize / 2;
            const y = startY + row * tileSize + tileSize / 2;

            const sprite = this.physics.add.sprite(x, y, tile);
            sprite.setOrigin(0.5); 
            this.physics.world.enable(sprite);

            if (tile === "wall") {
                const wallSprite = wallsGroup.create(x, y, 'wall'); 
                wallSprite.setOrigin(0.5);
            }

         
        }
    }

 
    player = this.physics.add.sprite(673, 1173, 'girl');
    player.setOrigin(0.5);
    player.setScale(2);


    var graphics = this.add.graphics();

    // Draw a filled rectangle as the black background
    graphics.fillStyle(0x000000, 0.85); // black color, 1 opacity (fully opaque)
    graphics.fillRect(500 - mazeWidth / 2, 400 - mazeHeight / 2, mazeWidth, mazeHeight);
    graphics.fillStyle(0xffffff, 0);

  
    // Create a circle surrounding player 
    circle = this.add.graphics();
   
    circle.fillStyle(0xffffff,0);
    circle.fillCircle(0, 0, 30); 
    circle.lineStyle(2, 0xffffff, 1); 
    circle.strokeCircle(0, 0, 30);


    circle.setPosition(player.x, player.y);

    this.physics.world.enable(player, true, 0.5, 0.5);
    player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(player);
    this.physics.add.collider(player, wallsGroup);

    this.physics.world.debugDrawBody = true;
    this.physics.world.debugDrawStatic = true;

    // Configure animations of the sprite 
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

    // get the keyboard input 
    cursors = this.input.keyboard.createCursorKeys();



}

// update the game, based on the changes done for the game
// change the animation and volume 
function update (){

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

    circle.x = player.x;
    circle.y = player.y;

    const endTileRow = 1;
    const endTileCol = 4;
    const endTileX = startX + endTileCol * tileSize + tileSize / 2;
    const endTileY = startY + endTileRow * tileSize + tileSize / 2;
    
    // calculate the volume 
    var distance = Phaser.Math.Distance.Between(player.x, player.y, endTileX, endTileY);
    var volume = Phaser.Math.Clamp(1 - distance / distanceThreshold, 0, 1);

    // set the music volume based on the calculated volume 
    music.setVolume(volume);

    const playerRow = Math.floor((player.y - startY) / tileSize);
    const playerCol = Math.floor((player.x - startX) / tileSize);

    // destination tile 
    if (maze[playerRow][playerCol] === "end" && !reachedEnd) {
        reachedEnd = true;
        document.getElementById('nextGamePopup').style.display = 'block';
    }
}


function startNextGame() {
    window.location.href = '../transition_story/third_story.html';
}


