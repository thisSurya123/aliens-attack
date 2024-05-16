console.log('connected');
var obstacles = [];
var bulletRight = [];
var bulletLeft = [];

function flyPlane(){
 myGameArea.start();
 play = new component("30px", "Consolas", "black", (myGameArea.canvas.width / 2) -50 , 50, "text");
 box = new component(30, 30, "gray", 0, 0, "");
}

function startGame(){
    myGameArea.start();
    anemie = new component(50, 50, "assets/alien.png", (myGameArea.canvas.width/2), 40, "image");
    char = new component(50, 50, "assets/pngwing.com.png", (myGameArea.canvas.width / 2) - 25, 340, "image");
    background = new component(myGameArea.canvas.width, myGameArea.canvas.height, "assets/skypixel.jpg", 0, 0, "image");
    gameOver = new component("50px", "Consolas", "black", (myGameArea.canvas.width/2) - 130, myGameArea.canvas.height/2 , "text");
    score = new component("30px", "Cosolas","black", (myGameArea.canvas.width - 150), 50, "text");
    hp = new component(500, 20, "yellow", 10, 10, "");
}

var myGameArea  = {
    canvas : document.createElement("canvas"),
    start : function(){
        this.canvas.width = 720;
        this.canvas.height = 450;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.canvas.style.cursor = "none";

        // redraw the canvas 50time per secon
        this.interval = setInterval(updateGameArea, 20);
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        // keyboard controller
        window.addEventListener("keydown", function(e){
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener("keyup", function(e){
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })

        window.addEventListener("mousemove", function(e){
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })

    },
    stop : function(){
        clearInterval(this.interval);
    },
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type){
    this.type = type;
    if(type == "image"){
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update  = function(){
        ctx = myGameArea.context;
        if(type == "image"){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }if(type == "text"){
             ctx.font = this.width + " " + this.height;
             ctx.fillStyle = this.color;
             ctx.fillText(this.text, this.x, this.y);
         }if(type == ""){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
         }
    }

    this.newPost = function(){
        if(this.x > (myGameArea.canvas.width - this.width)){
            this.x = myGameArea.canvas.width - this.width;
        }if(this.x < 0 ){
            this.x = 0;
        }

        this.x += this.speedX;
    }
    
    this.crashWith = function(otherobj){
        var myLeft = this.x;
        var myRight = this.x + (this.width);
        var myTop = this.y;
        var myBottom = this.y + (this.height);
        var otherLeft = otherobj.x ;
        var otherRight = otherobj.x + (otherobj.width);
        var otherTop = otherobj.y;
        var otherBottom = otherobj.y + (otherobj.height);
        var crash = true;
        if((myBottom < otherTop || myTop > otherBottom || myRight < otherLeft || myLeft > otherRight)){
            crash = false;
        }
        return crash;
    }
}


function everyinterval(n){
    if((myGameArea.frameNo / n ) % 1 == 0){return true;}
    return false;
    }

function updateGameArea(){
    // myGameArea.clear();
    // play.text = "Play";
    // if(myGameArea.x && myGameArea.y){
    //     box.x = myGameArea.x;
    //     box.y = myGameArea.y;
    // }
    // play.update();
    // box.update();
    var x, y;
    for(i = 0; i < bulletLeft.length; i += 1){
        if(anemie.crashWith(bulletLeft[i])){
            hp.width -= 0.3;
        }
        if(anemie.crashWith(bulletRight[i])){
            hp.width -= 0.3;
        }
    }
    if( hp.width < 0){
        gameOver.text = "You win";
        gameOver.update();
        myGameArea.stop();
        return;
    }
    if( hp.width < 100){
        hp.color = "red";
    }
    for(i = 0; i < obstacles.length; i +=1){
        if(char.crashWith(obstacles[i])){
            gameOver.text = "game over";
            gameOver.update();
            myGameArea.stop();
            return;
        }
    }
    myGameArea.clear();
    background.update();    
    myGameArea.frameNo += 1;
    if(myGameArea.frameNo == 1 || everyinterval(30)){
        anemie.speedX = Math.floor(Math.random() * (3 - (-3)+1) +(-3));
    }
    if(myGameArea.frameNo == 1 || everyinterval(100)){
        minWidth = 0;
        maxWidth = 650;
        minSpace = 80;
        maxSpace = 380;
        space = Math.floor(Math.random() * (maxSpace - minSpace + 1) + minSpace);
        height = 50;
        width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
        x = myGameArea.canvas.width - width;
        y = -50;
        obstacles.push(new component(width, height, "green", x, y, ""));
        obstacles.push(new component((maxWidth - width) - space, height, "green", 0 , y, ""));
    }
    for( i = 0; i < obstacles.length; i += 1){
        obstacles[i].y += 3;
        obstacles[i].update();
    }
    char.speedX = 0;
    char.speedY = 0;

    // up
    if( myGameArea.keys && myGameArea.keys[38]){ 
        bulletRight.push(new component(5, 10, "blue", char.x + 40, char.y+ 20, ""));
        bulletLeft.push(new component(5, 10, "red", char.x, char.y+ 20, ""));
    }
    if( myGameArea.keys && myGameArea.keys[37]) {char.speedX = -8;}
    if( myGameArea.keys && myGameArea.keys[39]) {char.speedX = 8; }
    score.text = "Score:  " + obstacles.length/2*10;
    score.update();

    for(i = 0; i < bulletLeft.length; i += 1){
        speed = Math.floor(Math.random() * (30 - 50+1) +30);
        bulletRight[i].y -= speed;
        bulletLeft[i].y -= speed;
        bulletRight[i].update();
        bulletLeft[i].update();
    }
    hp.update();
    anemie.newPost();
    char.newPost();
    char.update();
    anemie.update();
    
}