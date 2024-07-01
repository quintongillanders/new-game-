var canvas = document.getElementById('gameCanvas');
canvas.width = 800;
canvas.height = 800;
var ctx = canvas.getContext('2d');
document.getElementById("gameCanvas").style.display = 'none';
document.getElementById("timer").style.display = 'none';
document.getElementById("playerscore").style.display = 'none';
document.getElementById("optionsmenu").style.display = 'none';
var level1Complete = document.getElementById('level1Complete'); // level 1 complete message
var timer; // timer variable
var timeLeft = 50; // default time
var lives; // lives variable
var lives = 3; // number of lives remaining 
var worms = []; // array for worm 
var score = 0;
var maxWorms = 20;
var wormsPerSpawn = 1;
var growthRate = 0.1; // increases the speed of the growth rate of the worm, shrinking and growing in size
var radius;
var minRadius = 2;
var maxRadius = 25;
var position;
var caught;
var gradient;
var wormSpawnInterval;
var character;
var position;
const awaitLoadCount = 3;
let loadcount = 0;
let musicOn = true;
let SoundEffectsOn = true;
let characterFlashInterval;

function saveSettings() {
    const musicOption = document.querySelector('input[name="music"]:checked').value;
    const SoundEffectsOption = document.querySelector('input[name="music"]:checked').value;

    musicOn = (musicOption === 'on');
    SoundEffectsOption = (SoundEffectsOption === 'on');

}

function playMusic() {
    if (musicEnabled) {
        document.getElementById('poisonforest').play();
    } else {
        document.getElementById('poisonforest').pause();
    }
}

function playSoundEffect() {
    if (soundEffectsEnabled) {
        document.getElementById.apply('wormcaught').play();
    }
}

document.getElementById('saveSettings').addEventListener('click', function(event) {
    event.preventDefault();
    saveSettings();
});

function updateScore() {
    $('#score').html(score);
}

// this will display the "time up" message when the time runs out
function updatelevel1Timer() {
    timeLeft = timeLeft - 1;
    if (timeLeft >= 0)
        $('#timer').html(timeLeft);
    else {
        level1Passed();
    }
}

function updateLives() {
    $('#lives').html(lives);
}

function handleCollision() {
    if (!character || !character.position) {
        return;
    }
    for (let i = 0; i < worms.length; i++) {
        const worm = worms[i];
        const distance = Math.sqrt((character.position[0] - worm.x) ** 2 + (character.position[1] - worm.y) ** 2);
        if (distance <= worm.radius) {
            playerHit();
            worms.splice(i, 1); // removes the worm from the canvas after contact with the player
            i --;
        }
    }
}

function playerHit() {
    var audio = document.getElementById("damage");
    audio.pause();
    audio.currentTime = 0;
    audio.play();
    audio.volume = 0.2;

    lives -= 1;
    updateLives();
    
    if (lives <= 0) {
        gameOver();
    }
}

function flashCharacter() {
    
}

function killWorm() {
    var audio = document.getElementById("wormcaught");
    audio.pause();
    audio.currentTime = 0;
    audio.play();
    audio
    score++;
    audio.volume = 0.2;
    updateScore();
}



function startGame() {
    var audio = document.getElementById('poisonforest');
    audio.volume = 0.2; // music volume
    audio.currentTime = 0;
    if (audio.paused) {
        audio.play();
        audio

    }
    
    // show the level 1 message
    document.getElementById("level1Text").style.display = 'block';
    // hide the level text after 3 seconds and then start the level
    setTimeout(function() {
        document.getElementById("level1Text").style.display = 'none';
    }, 3000); // 3 seconds

    timer = setInterval(updatelevel1Timer, 1000);
    document.getElementById("mainmenu").style.display = 'none';
    document.getElementById("gameCanvas").style.display = 'block';
    document.getElementById("timer").style.display = 'block';
    document.getElementById("playerscore").style.display = 'block';
    worms = [];
    forest();
    updatelevel1Timer();
    createWorms();

    wormSpawnInterval = setInterval(function () {
        for (let i = 0; i < wormsPerSpawn; i++) {
            if (worms.length >= maxWorms) {
                return;
            }
            createWorms();
        }
    }, 1000)
}


document.getElementById('startGame').addEventListener("click", startGame);

function options() {
document.getElementById("optionsmenu").style.display = 'block';
document.getElementById("mainmenu").style.display = 'none';
}

document.getElementById('options').addEventListener('click', function(event) {
    event.preventDefault();
    options();
});


function level1Passed() {
    var gameOver = document.getElementById('level1Complete');
    var poisonforest = document.getElementById('poisonforest');
    poisonforest.pause();
    gameOver.currentTime = 0;
    levelpassed.play();

    clearInterval(timer); // stop the timer
    clearInterval(wormSpawnInterval);
    character = null; // despawn the character when the time runs out

    // show the completion message
    gameOver.style.display = 'block';
    document.getElementById("gameCanvas").style.display = 'none';
    updateScore();

    setTimeout(function () {
        location.reload();
    }, 6000);
}



// spawns in the character, map, and worms
function forest() {
    // Character Sprite sheet image from https://opengameart.org/content/base-character-spritesheet-16x16
    const characterSpriteSheet = new Image();
    characterSpriteSheet.src = "./assets/main_character.png";
    characterSpriteSheet.onload = load;

    // Background image Hand painted sand texture from https://opengameart.org/content/hand-painted-sand-texture-0
    const backgroundImage = new Image();
    backgroundImage.src = "./assets/grass.png";
    backgroundImage.onload = load;

    // set this to the number of elements you want to load before initalising
    const awaitLoadCount = 3;
    let loadCount = 0;

    // time tracking
    let lastTimeStamp = 0;
    let tick = 0;

    // canvas and context, not const as we don't set the value until document ready
    let canvas;
    let ctx;

    // game objects
    let character;

    // run when the website has finished loading
    $('document').ready(function () {
        console.log("ready");
        load();
    });

    // call this function after each loadable element has finished loading.
    // Once all elements are loaded, loadCount threshold will be met to init.
    function load() {
        loadCount++;
        console.log("load " + loadCount);
        if (loadCount >= awaitLoadCount) {
            init();
        }
    }


    // initialise canvas and game elements
    function init() {
        console.log("init");
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');

        character = Character(
            characterSpriteSheet,
            [64, 64],

            [ // main character set
                [ // walk up track
                    [0, 0], [64, 0], [128, 0], [192, 0]
                ],
                [ // walk down track 
                    [256, 0], [320, 0], [384, 0], [448, 0]
                ],
                [ // walk left track
                    [0, 64], [64, 64], [128, 64], [192, 64]
                ],
                [ // walk right track 
                    [256, 64], [320, 64], [384, 64], [448, 64]
                ],
                [ // action track
                    [256, 0], [384, 128], [448, 128]
                ],

            ],

            1
        );

        character.init();
        const minWorms = 50;
        const maxWorms = 100;
        const numWorms = Math.floor(Math.random() * (maxWorms - minWorms + 1)) + minWorms;

        
        gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, maxRadius);
        gradient.addColorStop(1, "lightgreen");
        gradient.addColorStop(1, "green");
        worms = [];

        document.addEventListener("keydown", doKeyDown);
        document.addEventListener("keyup", doKeyUp);

        window.requestAnimationFrame(run);
    }

    // Game loop function
    function run(timeStamp) {
        tick = (timeStamp - lastTimeStamp);
        lastTimeStamp = timeStamp;

        update(tick);
        handleCollision();
        draw();

        window.requestAnimationFrame(run);
    }

    function update() {
        character.update(tick);
        for (let i = 0; i < worms.length; i++) {
            worms[i].update(tick);
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, 0, 0, 800, 800);
        for (let i = 0; i < worms.length; i++) {
            worms[i].draw(ctx);
        }
        character.draw(ctx);
    }

    function doKeyDown(e) {
        e.preventDefault();
        if (character != undefined) { character.doKeyInput(e.key, true); }
    }

    function doKeyUp(e) {
        e.preventDefault();
        if (character != undefined) {
            character.doKeyInput(e.key, false);
            if (e.key === " ") {

            }
        }
    }

    // Create and return a new Character object.
    // Param: spritesheet = Image object
    // Param: spriteSize = Array of 2 numbers [width, height]
    // Param: spriteFrames = 3D array[Tracks[Frames[Frame X, Y]]]
    // Param: spriteScale = Number to scale sprite size -> canvas size
    function Character(spritesheet, spriteSize, spriteFrames, spriteScale) {
        return {

            spriteSheet: spritesheet,       // image containing the sprites
            spriteFrameSize: spriteSize,    // dimensions of the sprites in the spritesheet
            spriteFrames: spriteFrames,     // 3d array. X = animation track, Y = animation frame, Z = X & Y of frame
            spriteScale: spriteScale,       // amount to scale sprites by (numbers except 1 will be linearly interpolated)
            spriteCanvasSize: spriteSize,   // Calculated size after scale. temp value set, overwritten in init

            animationTrack: 0,              // current animation frame set to use
            animationFrame: 0,              // current frame in animation to draw
            frameTime: 125,                 // milliseconds to wait between animation frame updates
            timeSinceLastFrame: 0,          // track time since the last frame update was performed
            lastAction: "",                 // Last user input action performed

            position: [0, 0],               // position of the character (X, Y)
            direction: [0, 0],              // X and Y axis movement amount
            velocity: 0.2,                   // rate of position change for each axis

            // Initialise variables that cannot be calculated during
            // object creation.
            init() {
                console.log("init");
                // Apply scale multiplier to sprite frame dimensions
                this.spriteCanvasSize = [
                    this.spriteFrameSize[0] * this.spriteScale,
                    this.spriteFrameSize[1] * this.spriteScale
                ];
            },

            // Handle actions for the character to perform.
            // param: action = string of action name.
            action(action) {
                console.log(`action: ${action}. Animation Frame ${this.animationFrame}`);
                // ignore duplicate actions.
                if (action == this.lastAction) {
                    console.log(`repeated action: ${action}`);
                    return;
                }

                // Handle each action type as cases.
                switch (action) {
                    case "moveLeft":
                        this.animationTrack = 2;
                        this.animationFrame = 0;
                        this.direction[0] = -this.velocity;
                        break;
                    case "moveRight":
                        this.animationTrack = 3;
                        this.animationFrame = 0;
                        this.direction[0] = this.velocity;
                        break;
                    case "moveUp":
                        this.animationTrack = 0;
                        this.animationFrame = 0;
                        this.direction[1] = -this.velocity;
                        break;
                    case "moveDown":
                        this.animationTrack = 1;
                        this.animationFrame = 0;
                        this.direction[1] = this.velocity;
                        break;
                    case "noMoveHorizontal":
                        this.direction[0] = 0;
                        this.animationFrame = 0;
                        break;
                    case "noMoveVertical":
                        this.direction[1] = 0;
                        this.animationFrame = 0;
                        break;
                    case "catchWorm":
                        console.log("catch worm");
                        this.animationTrack = 4;
                        this.animationFrame = 0;
                        this.frameTime = 100;
                    case "noCatchWorm":
                        console.log("stop catching worm");
                        // action finished, possibly set animation frame to default of moveDown.
                        this.animationFrame = 0;
                        this.frameTime = 128;
                        break;
                    default:
                        this.direction = [0, 0];
                        break;
                }

                // keep track of last action to avoid reinitialising the current action.
                this.lastAction = action;
            },

            update(tick) {
                // increase time keeper by last update delta
                this.timeSinceLastFrame += tick;
                // check if time since last frame meets threshold for new frame
                if (this.timeSinceLastFrame >= this.frameTime) {
                    // reset frame time keeper
                    this.timeSinceLastFrame = 0;

                    // update frame to next frame on the track. 
                    // Modulo wraps the frames from last frame to first.
                    if (this.direction[0] !== 0 || this.direction[1] !== 0 || this.lastAction === "catchWorm") {
                        this.animationFrame = (this.animationFrame + 1) % this.spriteFrames[this.animationTrack].length;
                    }
                }

                // Calculate how much movement to perform based on how long
                // it has been since the last position update.
                this.position[0] += this.direction[0] * tick;
                this.position[1] += this.direction[1] * tick;

                // boundary checking
                if (this.position[0] < 0) {
                    this.position[0] = 0;
                }

                if (this.position[1] < 0) {
                    this.position[1] = 0;
                }

                if (this.position[0] + this.spriteCanvasSize[0] > canvas.width) {
                    this.position[0] = canvas.width - this.spriteCanvasSize[0];
                }

                if (this.position[1] + this.spriteCanvasSize[1] > canvas.height) {
                    this.position[1] = canvas.height - this.spriteCanvasSize[1];
                }

            },
            // Draw character elements using the passed context (canvas).
            // Param: context = canvas 2D context.
            draw(context) {
                // Draw image to canvas.
                // Params: (spritesheet Image, 
                //          sprite X, sprite Y, sprite width, sprite height
                //          position on canvas X, position on canvas Y, scaled width, scaled height).
                context.drawImage(
                    this.spriteSheet,
                    this.spriteFrames[this.animationTrack][this.animationFrame][0],
                    this.spriteFrames[this.animationTrack][this.animationFrame][1],
                    this.spriteFrameSize[0],
                    this.spriteFrameSize[1],
                    this.position[0],
                    this.position[1],
                    this.spriteCanvasSize[0],
                    this.spriteCanvasSize[1]
                );
            },

            // Handle input from keyboard for the character.
            // Param: e = event key string.
            // Param: isKeyDown = boolean, true = key pressed, false = key released
            doKeyInput(e, isKeydown = true) {
                switch (e) {
                    case "w": // move up
                        if (isKeydown) this.action("moveUp");
                        else this.action("noMoveVertical");
                        break;
                    case "a": // move right
                        if (isKeydown) this.action("moveLeft");
                        else this.action("noMoveHorizontal");
                        break;
                    case "s": // move down
                        if (isKeydown) this.action("moveDown");
                        else this.action("noMoveVertical");
                        break;
                    case "d": // move left
                        if (isKeydown) this.action("moveRight");
                        else this.action("noMoveHorizontal");
                        break;
                    case " ": // space bar to catch the worms
                        if (isKeydown) {
                            caught = false;
                            this.action("catchWorm");
                            for (let i = 0; i < worms.length; i++) {
                                const worm = worms[i];
                                const distance = Math.sqrt((this.position[0] - worm.x) ** 2 + (this.position[1] - worm.y) ** 2);
                                if (distance <= 30) {
                                    worms.splice(i, 1);
                                    killWorm();
                                    caught = true;
                                    break;

                                }
                            }
                            if (!caught) {
                                missWorm();
                            }

                        } else {

                            this.action("noCatchWorm");
                            break;

                        }
                        break;
                    default:
                        if (!isKeydown) this.action("stop");
                        break;
                }

            }
        };
    }
}

class GameObject {
    constructor(context, x, y, vx, vy, width, height) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = width;
        this.height = height;

        this.isColliding = false;

        this.draw = this.draw.bind(this);
        this.update = this.update.bind(this);
        this.getRight = this.getRight.bind(this);
        this.getBottom = this.getBottom.bind(this);
        this.setVelocity = this.setVelocity.bind(this);
        this.offsetVelocity = this.offsetVelocity.bind(this);
    }
    getRight() {
        return (this.x + this.width);
    }

    getBottom() {
        return (this.y + this.height);
    }

    draw(context) { };
    update(secondsPassed) { };
}

// drawing the worms as semi circles
class SemiCircle extends GameObject {
    constructor(context, x, y, vx, vy, radius, growthRate) {
        super(context, x, y, vx, vy);

        this.radius = radius;
        this.growthRate = growthRate;
        // new variable to tell if worm size should be growing or shrinking.
        this.isGrowing = true;
        this.minRadius = 10;
        this.maxRadius = 40;
        this.draw = this.draw.bind(this);
        this.update = this.update.bind(this);
        this.setVelocity = this.setVelocity.bind(this);
    }

    draw(ctx) {
        super.draw(ctx);        
        console.log("worm.draw");
        ctx.fillStyle = this.gradient; 
        ctx.strokeStyle = 'lightsand';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, Math.PI, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    update(secondsPassed) {
        super.update(secondsPassed);

        // check if should be growing or not.
        if (this.isGrowing) {
            // if growing, increase radius by growthRate
            this.radius += this.growthRate;
            // when growing, check if max size has been achieved
            if (this.radius >= this.maxRadius) {
                // If max size, change lifecycle phase to shrinking mode
                this.isGrowing = false;
                //update gradient colours
                this.gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.maxRadius);
                this.gradient.addColorStop(1, "lightgreen");
                this.gradient.addColorStop(0, "green");
            }
        }
        // If shrinking after growing
        else {
            // decrease size by growth rate
            this.radius -= this.growthRate;
            // check if minimum size has been achieved
            if (this.radius <= this.minRadius) {
                this.radius = this.minRadius;
                this.x - Math.random() * this.context.canvas.width;
                this.y = Math.random() * this.context.canvas.height;
                // if min size, change lifecycle phase to growing mode and respawn the worm at a random point on the canvas to start growing again
                this.isGrowing = true;
                this.gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.maxRadius);
                this.gradient.addColorStop(1, "lightgreen");
                this.gradient.addColorStop(0, "green");
            }
        }

        const newX = this.x + this.vx * secondsPassed;
        const newY = this.y + this.vy * secondsPassed;

        if (newX - this.radius < 0 || newX + this.radius > this.context.canvas.width) {
            this.vx *= -1;
        }

        if (newY - this.radius < 0 || newY + this.radius > this.context.canvas.height) {
            this.vy *= -1;
        }

        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

    }

    isPointInside(x, y) {
        const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        return distance <= this.radius;
    }

    setVelocity(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }

    offsetVelocity(vx, vy) {
        this.vx += vx;
        this.vy += vy;
    }
}

// creating the worms  
function createWorms() {
    console.log("spawning worm")
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;

    // worm speed
    let vx = (Math.random() - 0.5) * 0.2; 
    let vy = (Math.random() - 0.5) * 0.2;

    

    let worm = new SemiCircle(ctx, x, y, vx, vy, minRadius, growthRate);


    worm.gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.maxRadius);
                worm.gradient.addColorStop(1, "lightgreen");
                worm.gradient.addColorStop(0, "green");


    worms.push(worm);
}



