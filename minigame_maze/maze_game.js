// Create a Phaser.Game instance
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,  // Set the width to the window's width
    height: window.innerHeight,
    // width: 800,
    // height: 600,
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

// Load your images
function preload() {
    this.load.image('path_7_lft', 'img/path_7_lft.png');
    this.load.image('path_7_rgt', 'img/path_7_rgt.png');
    this.load.image('path_cross', 'img/path_cross.png');
    this.load.image('path_end', 'img/path_end.png');
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
}
    // ... load other images ...



function create() {
    // Set background color
    // this.cameras.main.setBackgroundColor('#000000');

    // Create maze
     const maze = [
    ["path_7_rgt", "path_hori", "path_hori", "path_hori", "path_7_lft"],
    ["path_vert", "wall", "wall", "wall", "end"],
    ["path_T_rgt", "path_hori", "path_T_down", "path_hori_lft", "wall"],
    ["path_vert_up", "wall", "path_vert", "wall", "wall"],
    ["wall", "path_hori_rgt", "path_cross", "path_hori", "path_7_lft"],
    ["path_portal_2", "wall", "path_vert", "wall", "path_vert"],
    ["path_L_rgt", "path_hori", "path_cross", "path_hori", "path_T_lft"],
    ["wall", "wall", "path_vert", "wall", "path_portal_1"],
    ["path_hori_rgt", "path_hori", "path_T_up", "path_hori_lft", "wall"],
    ];

    const tileSize = 200; // Adjust the tile size as needed

    // Calculate the total width and height of the maze in pixels
    const mazeWidth = maze[0].length * tileSize;
    const mazeHeight = maze.length * tileSize;
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const startX = centerX - mazeWidth / 2;
    const startY = centerY - mazeHeight / 2;

    

    // this.physics.world.enable(player);
    // player.setCollideWorldBounds(true);

    const wallsGroup = this.physics.add.staticGroup();

  
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

            // if (tile !== "wall") {
            //     sprite.body.setImmovable(true);

            //     // Add collisions between the player and the wall
            //     this.physics.add.collider(player, sprite);
            // }
            // if (tile === "wall") {
            //     wallsGroup.add(sprite);
            // }

            if (tile === "wall") {
                const wallSprite = wallsGroup.create(x, y, 'wall'); // Replace 'path_hori' with the appropriate key
                wallSprite.setOrigin(0.5);
            }

            // // Make the wall sprite immovable (so it doesn't react to collisions)
            // sprite.body.setImmovable(true);

            // // Add collisions between the player and the wall
            // this.physics.add.collider(player, sprite);
        }
    }

    // Create player
    // player = this.physics.add.sprite(centerX, centerY, 'girl');
    
    // player.setBounce(0.2);
    // player.setCollideWorldBounds(true);

    player = this.physics.add.sprite(centerX, centerY, 'girl');
    player.setOrigin(0.5);
    player.setScale(2);

    // player.setBounce(0.2);
    this.physics.world.enable(player);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, wallsGroup);

    // this.physics.world.enable(player);
    // player.setCollideWorldBounds(true);




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
//     player.anims.play('down');

//     // Set default animation
//     player.anims.play('down');

//     // Keyboard input for navigation
//     const cursors = this.input.keyboard.createCursorKeys();

//     this.input.keyboard.on('keydown_SPACE', function (event) {
//         console.log('Space key pressed!');
//     });

//     this.input.keyboard.on('keydown_UP', function (event) {
//         player.anims.play('up', true);
//     });

//     this.input.keyboard.on('keydown_DOWN', function (event) {
//         player.anims.play('down', true);
//     });

//     // Handle player movement
//     this.input.keyboard.on('keydown_LEFT', function (event) {
//         player.setVelocityX(-200); // Adjust the velocity as needed
//     });

//     this.input.keyboard.on('keydown_RIGHT', function (event) {
//         player.setVelocityX(200); // Adjust the velocity as needed
//     });

//     // Stop player movement on key release
//     this.input.keyboard.on('keyup_LEFT', function (event) {
//         player.setVelocityX(0);
//     });

//     this.input.keyboard.on('keyup_RIGHT', function (event) {
//         player.setVelocityX(0);
//     });

// }
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

    // if (cursors.up.isDown && player.body.touching.down)
    // {
    //     player.setVelocityY(-330);
    // }
}




// // Create the maze using Phaser.GameObjects.Sprite
// const maze = [
//    ["path_7_rgt", "path_hori", "path_hori", "path_hori", "path_7_lft"],
//    ["path_vert", "wall", "wall", "wall", "end"],
//    ["path_T_rgt", "path_hori", "path_T_down", "path_hori_lft", "wall"],
//    ["path_vert_up", "wall", "path_vert", "wall", "wall"],
//    ["wall", "path_hori_rgt", "path_cross", "path_hori", "path_7_lft"],
//    ["path_portal_2", "wall", "path_vert", "wall", "path_vert"],
//    ["path_L_rgt", "path_hori", "path_cross", "path_hori", "path_T_lft"],
//    ["wall", "wall", "path_vert", "wall", "path_portal_1"],
//    ["path_hori_rgt", "path_hori", "path_T_up", "path_hori_lft", "wall"],
// ];

// const tileSize = 32; // Adjust the tile size as needed

// // Function to convert maze positions to pixels
// function positionToPixels(row, col) {
//     return {
//         x: col * tileSize + tileSize / 2,
//         y: row * tileSize + tileSize / 2
//     };
// }

// // Function to create maze sprites
// function createMaze() {
//     for (let row = 0; row < maze.length; row++) {
//         for (let col = 0; col < maze[row].length; col++) {
//             const tile = maze[row][col];
//             const position = positionToPixels(row, col);

//             // Create a sprite for each maze element
//             const sprite = this.add.sprite(position.x, position.y, tile);
            
//             // Set the origin to the center
//             sprite.setOrigin(0.5);

//             // Optionally, add more customization for specific elements
//             // For example, you can add animations, physics, etc.
//         }
//     }
// }

// // Function to create the game
// function create() {
//     // Set background color
//     this.cameras.main.setBackgroundColor('#000000');

//     // Create the maze
//     createMaze.call(this);

//     // Add keyboard input for testing (replace with your game logic)
//     this.input.keyboard.on('keydown_SPACE', function (event) {
//         // Handle space key press
//         console.log('Space key pressed!');
//     });
// }









// const button = document.querySelector('.btn_start');
// const intro_msg = document.querySelector('.intro');
// const container = document.querySelector(".container");
// const main = document.querySelector(".main");
// const gridSize = 200;
// const startpoint = { x: 2, y: 4 };
// const endpoint = { x: 4, y: 0 };



// const maze = [
//    ["path_7_rgt", "path_hori", "path_hori", "path_hori", "path_7_lft"],
//    ["path_vert", "wall", "wall", "wall", "end"],
//    ["path_T_rgt", "path_hori", "path_T_down", "path_hori_lft", "wall"],
//    ["path_vert_up", "wall", "path_vert", "wall", "wall"],
//    ["wall", "path_hori_rgt", "path_cross", "path_hori", "path_7_lft"],
//    ["path_portal_2", "wall", "path_vert", "wall", "path_vert"],
//    ["path_L_rgt", "path_hori", "path_cross", "path_hori", "path_T_lft"],
//    ["wall", "wall", "path_vert", "wall", "path_portal_1"],
//    ["path_hori_rgt", "path_hori", "path_T_up", "path_hori_lft", "wall"],
// ];



// let maze_l2_length =  0;
// for (let i = 0; i < maze.length; i++) {
   
//    for (let j = 0; j < maze[i].length; j++) {
//       const cell = document.createElement("div");
//       cell.classList.add(maze[i][j]);
//       container.appendChild(cell);
//    }
// }

// //Generate CSS dynamically
// container.style.gridTemplateColumns = 'repeat('+ maze[0].length +', '+gridSize+'px)';
// container.style.gridTemplateRows = 'repeat('+maze.length+', '+gridSize+'px)';
// main.style.width = gridSize + "px";
// main.style.height = gridSize + "px";
// intro_msg.style.width = gridSize + "px";
// intro_msg.style.height = gridSize + "px";
// container.style.left = - (startpoint.x * gridSize) + "px";
// container.style.top = - (startpoint.y * gridSize) + "px";


// button.addEventListener('click', () => {
//    intro_msg.style.display = "none";
//    startGame();
// })

// function startGame() {
//    let playerRow = startpoint.y;
//    let playerCol = startpoint.x;
//    let topPosition = container.offsetTop;
//    let leftPosition = container.offsetLeft;
//    document.addEventListener("keydown", (event) => {

//       if (!main.classList.contains("success")) {
//          const key = event.key;
//          if (key === "ArrowUp") {
//             if (playerRow > 0 && maze[playerRow - 1][playerCol] !== "wall") {
//                playerRow--;
//                topPosition += gridSize;
//                container.style.top = topPosition + "px";
//             }
//          } else if (key === "ArrowDown") {
//             if (playerRow < maze.length - 1 && maze[playerRow + 1][playerCol] !== "wall") {
//                playerRow++;
//                topPosition -= gridSize;
//                container.style.top = topPosition + "px";
//             }
//          } else if (key === "ArrowLeft") {
//             if (playerCol > 0 && maze[playerRow][playerCol - 1] !== "wall") {
//                playerCol--;
//                leftPosition += gridSize;
//                container.style.left = leftPosition + "px";

//                main.classList.add("flip");

//             }
//          } else if (key === "ArrowRight") {
//             if (playerCol < maze[0].length - 1 && maze[playerRow][playerCol + 1] !== "wall") {
//                playerCol++;

//                if (leftPosition >= -(gridSize * endpoint.x)) {
//                   leftPosition -= gridSize;
//                   leftPosition == -(gridSize * endpoint.x);
//                   container.style.left = leftPosition + "px";
//                }

//                main.classList.remove("flip");
//             }
//          }

        

//          const portal_1 = { x: 4, y: (7-1) };
//          const portal_2 = { x: 0, y: (5+1) };
//          if(maze[playerRow][playerCol] === "path_portal_1"){
//             playerCol = portal_2.x;
//             playerRow = portal_2.y;
//             leftPosition = - (portal_2.x) * gridSize;
//             topPosition = - (portal_2.y)  * gridSize;
           
//             setTimeout(() => {
//                main.classList.add("portal");
//                container.classList.add("no_animation");
//                container.style.top = topPosition + "px";
//                container.style.left = leftPosition + "px";
//                return false;
//             }, 1000);
//             setTimeout(() => {
//                main.classList.remove("portal");
//                container.classList.remove("no_animation");
//                return false;
//             }, 2500);
//          }
//          else if(maze[playerRow][playerCol] === "path_portal_2"){
//             playerCol = portal_1.x;
//             playerRow = portal_1.y;
//             leftPosition = - (portal_1.x) * gridSize;
//             topPosition = - (portal_1.y)  * gridSize;
           
//             setTimeout(() => {
//                main.classList.add("portal");
//                container.classList.add("no_animation");
//                container.style.top = topPosition + "px";
//                container.style.left = leftPosition + "px";
              
//                return false;
//             }, 1000);
//             setTimeout(() => {
//                main.classList.remove("portal");
//                container.classList.remove("no_animation");
//                return false;
//             }, 2500);
//          }
//          else if (maze[playerRow][playerCol] === "end") {
//             setTimeout(() => {
//                main.classList.add("success");
//                container.style.left = -(gridSize * endpoint.x) + "px";
//                return false;
//             }, 1000);
//          } 

//       }
//    });



// }