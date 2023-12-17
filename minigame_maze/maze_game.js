// Create a Phaser.Game instance
var config = {
    type: Phaser.CANVAS,
    // width: window.innerWidth,  // Set the width to the window's width
    // height: window.innerHeight,
    width: 1000,
    height: 800,
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
    // this.load.spritesheet('girl', '../assets/char free/ari.png', { frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('girl', '../assets/characters/girl_main.png', { frameWidth: 16, frameHeight: 24});
    this.load.audio('backgroundMusic', '../assets/mazegame_music.mp3');
}
    // ... load other images ...



function create() {
    // Set background color
    // this.cameras.main.setBackgroundColor('#000000');

    music = this.sound.add('backgroundMusic', { loop: true });
    music.play();

    // const blackScreen = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);
    // blackScreen.setOrigin(0);

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

    tileSize = 200; // Adjust the tile size as needed

    // Calculate the total width and height of the maze in pixels
    const mazeWidth = maze[0].length * tileSize;
    const mazeHeight = maze.length * tileSize;
    centerX = this.cameras.main.width / 2;
    centerY = this.cameras.main.height / 2;
    startX = centerX - mazeWidth / 2;
    startY = centerY - mazeHeight / 2;

    // this.cameras.main.setBounds(0, -mazeHeight / 2, mazeWidth, mazeHeight);
    // this.physics.world.setBounds(0, -mazeHeight / 2, mazeWidth, mazeHeight);

    this.cameras.main.setBounds(500 - mazeWidth / 2, 400 - mazeHeight / 2, mazeWidth, mazeHeight);
    this.physics.world.setBounds(500 - mazeWidth / 2, 400 - mazeHeight / 2, mazeWidth, mazeHeight);




    wallsGroup = this.physics.add.staticGroup();

  
    // Create maze sprites
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const tile = maze[row][col];
            const x = startX + col * tileSize + tileSize / 2;
            const y = startY + row * tileSize + tileSize / 2;

            // Create a sprite for each maze element
            const sprite = this.physics.add.sprite(x, y, tile);
            sprite.setOrigin(0.5); // Set the origin to the center
            this.physics.world.enable(sprite);

            if (tile === "wall") {
                const wallSprite = wallsGroup.create(x, y, 'wall'); // Replace 'path_hori' with the appropriate key
                wallSprite.setOrigin(0.5);
            }

         
        }
    }


   


    player = this.physics.add.sprite(centerX, centerY, 'girl');
    player.setOrigin(0.5);
    player.setScale(2);
    // player.setBounce(0.2);

    var graphics = this.add.graphics();

    // Draw a filled rectangle as the black background
    graphics.fillStyle(0x000000, 0.85); // black color, 1 opacity (fully opaque)
    graphics.fillRect(500 - mazeWidth / 2, 400 - mazeHeight / 2, mazeWidth, mazeHeight);
    graphics.fillStyle(0xffffff, 0);

  

    

    circle = this.add.graphics();
   
    // circle.fillStyle(0xffffff, 0); // 0x000000 is black color, 0 is transparency
    circle.fillStyle(0xffffff,0);
    // circle.fillCircle(player.x, player.y, 30);
    circle.fillCircle(0, 0, 30); 
    circle.lineStyle(2, 0xffffff, 1); // Set line style (2 is the line width), use lineStyle instead of fillStyle
    circle.strokeCircle(0, 0, 30);


   

    // const maskImage2 = graphics.createGeometryMask();
    // rect.setMask(maskImage2)

// Draw a filled circle at the player's position
    // graphics.fillCircle(player.x, player.y, 30);


    const maskImage = circle.createGeometryMask();
    // maskImage.invertAlpha = true;
    // graphics.setMask(maskImage);



    circle.setPosition(player.x, player.y);

    // circle.fillStyle(0xffffff,0);

    // graphics.clear();


    // player.setBounce(0.2);
    this.physics.world.enable(player, true, 0.5, 0.5);
    player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(player);
    this.physics.add.collider(player, wallsGroup);

    this.physics.world.debugDrawBody = true;
    this.physics.world.debugDrawStatic = true;

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


    console.log(player.x)

    rays = [];

    for (let i = 0; i < 360; i += 1) {
        const radians = Phaser.Math.DegToRad(i);
        const ray = new Phaser.Geom.Line(player.x, player.y, player.x + Math.cos(radians) * 1000, player.y + Math.sin(radians) * 1000);
        rays.push(ray);
    }

    // // Integrate flashlight from RevealLightScene
    // const x = 400;
    // const y = 300;

    // flashlightReveal = this.add.image(x, y, 'path_cross');
    // flashlightCover = this.add.image(x, y, 'path_cross');
    // flashlightCover.setTint(0x004c99);

    // const width = flashlightCover.width;
    // const height = flashlightCover.height;

    // const renderTexture = this.make.renderTexture({
    //     width,
    //     height,
    //     add: false
    // });

    // maskImage = this.make.image({
    //     x,
    //     y,
    //     key: renderTexture.texture.key,
    //     add: false
    // });

    // flashlightCover.mask = new Phaser.Display.Masks.BitmapMask(this, maskImage);
    // flashlightCover.mask.invertAlpha = true;

    // flashlightReveal.mask = new Phaser.Display.Masks.BitmapMask(this, maskImage);

    // flashlight = this.add.circle(0, 0, 30, 0x000000, 1);
    // flashlight.visible = false;

    // this.flashlightElements = {
    //     flashlightReveal,
    //     flashlightCover,
    //     renderTexture,
    //     maskImage
    // };



}

function update (){
    // if (gameOver)
    // {
    //     return;
    // }

   
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


    // circle.clear();
    // circle.fillStyle(0xffffff, 0); // white color, fully opaque
    // circle.fillCircle(0, 0, 200); // adjust the radius as needed
    // circle.generateTexture('flashlightMask', 400, 400); // generate a texture for the circle
    // this.cameras.main.mask = new Phaser.Display.Masks.BitmapMask(this, 'flashlightMask');



    // this.children.removeAll(true);

    

    // Update rays based on the player's position
    // for (let i = 0; i < rays.length; i++) {
    //     const radians = Phaser.Math.DegToRad(i);
    //     rays[i].x1 = player.x;
    //     rays[i].y1 = player.y;
    //     rays[i].x2 = player.x + Math.cos(radians) * 1000;
    //     rays[i].y2 = player.y + Math.sin(radians) * 1000;
    // }

    // Draw the flashlight
    // const { flashlightReveal, flashlightCover, renderTexture, maskImage } = this.flashlightElements;

    // const x = player.x - flashlightCover.x + flashlightCover.width * 0.5;
    // const y = player.y - flashlightCover.y + flashlightCover.height * 0.5;

    // renderTexture.clear();
    // renderTexture.draw(flashlight, x, y);

    console.log(maze[3][0])

    destination = maze[3][0]

    const endTileRow = 1;
    const endTileCol = 4;
    const endTileX = startX + endTileCol * tileSize + tileSize / 2;
    const endTileY = startY + endTileRow * tileSize + tileSize / 2;
    

    var distance = Phaser.Math.Distance.Between(player.x, player.y, endTileX, endTileY);
    var volume = Phaser.Math.Clamp(1 - distance / distanceThreshold, 0, 1);

    // music.context.volume.setValueAtTime(volume, this.sound.game.audioContext.currentTime);

    music.setVolume(volume);

    console.log("Player Coordinates:", player.x, player.y);
    console.log("Destination Coordinates:", endTileX, endTileY);
    console.log("Distance:", distance);
    console.log("Calculated Volume:", volume);

    
    console.log("Camera Bounds:", this.cameras.main.worldView);


   


    const playerRow = Math.floor((player.y - startY) / tileSize);
    const playerCol = Math.floor((player.x - startX) / tileSize);

    if (maze[playerRow][playerCol] === "end" && !reachedEnd) {
        reachedEnd = true;
        window.alert('Congratulations! You reached the end of the maze!');
        player.setPosition(startX + playerCol * tileSize + tileSize / 2, startY + playerRow * tileSize + tileSize / 2);
    }
}





function getRayIntersection(ray) {
    const hitWalls = wallsGroup.getChildren().filter(wall => Phaser.Geom.Intersects.LineToRectangle(ray, wall.getBounds()));
    if (hitWalls.length > 0) {
        const bounds = hitWalls[0].getBounds();
        const center = { x: bounds.centerX, y: bounds.centerY };
        return center;
    } else {
        return null;
    }

}