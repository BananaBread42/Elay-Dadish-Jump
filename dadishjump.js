//board
let board;
let boardWidth = 250;
let boardHeight = 500;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

//physics
let velocityX = 0;
let velocityY = 0;
let initialVelocitY = -8;
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

//score
let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //load images
    doodlerRightImg = new Image();
    doodlerRightImg.src = "./Dadish-right.png";
    doodler.img = doodlerRightImg;

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./Dadish-left.png";

    platformImg = new Image();
    platformImg.src = "./dadish-platform.png";

    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    velocityY = initialVelocitY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver){
        // draw game over screen
        context.clearRect(0, 0, board.width, board.height);

        context.font = "30px sans-serif";
        context.fillStyle = "black";
        context.fillText("GAME OVER", boardWidth/3, boardHeight/2);

        context.font = "16px sans-serif";
        context.fillText("Press SPACE to Restart", boardWidth/3, boardHeight/2 + 40);

        context.fillText("Score: " + score, boardWidth/3, boardHeight/2 + 80);
        context.fillText("High Score: " + maxScore, boardWidth/3, boardHeight/2 + 110);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //doodler movement
    doodler.x += velocityX;

    //wrap around
    if (doodler.x > boardWidth){
        doodler.x = 0;
    }
    else if (doodler.x + doodler.width < 0){
        doodler.x = boardWidth;
    }

    //gravity
    velocityY += gravity;
    doodler.y += velocityY;

    //fall = game over
    if (doodler.y > board.height){
        gameOver = true;
    }

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    //platforms
    for(let i = 0; i < platformArray.length; i++){
        let platform = platformArray[i];

        if (velocityY < 0 && doodler.y < boardHeight*3/4) {
            platform.y -= initialVelocitY;
        }

        if (detectCollision(doodler, platform) && velocityY >= 0){
            velocityY = initialVelocitY;
        }

        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    //remove old platforms
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight){
        platformArray.shift();
        newPlatform();
    }

    //score
    updateScore();

    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText("Score: " + score, 10, 20);
    context.fillText("High Score: " + maxScore, 10, 40);

    //smooth stop (friction)
    velocityX *= 0.9;
}

function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD"){
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA"){
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
    else if (e.code == "Space" && gameOver){
        //RESET GAME PROPERLY
        doodler.img = doodlerRightImg;
        doodler.x = doodlerX;
        doodler.y = doodlerY;

        velocityX = 0;
        velocityY = initialVelocitY;
        score = 0;
        gameOver = false;

        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];

    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    for (let i = 0; i < 6; i++){
        let randomX = Math.floor(Math.random() * boardWidth*3/4);

        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }

        platformArray.push(platform);
    }
}

function newPlatform(){
    let randomX = Math.floor(Math.random() * boardWidth*3/4);

    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function updateScore(){
    let points = Math.floor(10);

    if (velocityY < 0){
        score += points;

        if (score > maxScore){
            maxScore = score;
        }
    }
}