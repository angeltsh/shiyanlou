//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//准备画布
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//准备图片
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//游戏对象
var hero = {
    speed: 120 // movement in pixels per second
};
var monster = {
	speed: 50,
	rfx:1,
	rfy:1
};
var monstersCaught = 0;

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
// 处理用户输入
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//游戏结束重置
// Reset the game when the player catches a monster
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // Throw the monster somewhere on the screen randomly
    monster.x = 15 + (Math.random() * (canvas.width - 60 - 15));
    monster.y = 16 + (Math.random() * (canvas.height - 64 - 16));

};

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//更新游戏状态
var update = function (modifier) {
	
	updateMonster(modifier);
	
	if (38 in keysDown) { // Player holding up
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
    }
	
	//处理边界位置
	updateSide();
	
    // Are they touching?
    if (
        hero.x <= (monster.x + 31)
        && monster.x <= (hero.x + 31)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        reset();
    }
};

//更新怪物位置
var isUpdate=0;
var updateMonster=function(modifier){
	monster.x += monster.rfx * monster.speed * modifier;
	monster.y += monster.rfy * monster.speed * modifier;
	
	isUpdate++;
	
	if(isUpdate<10){
		return;
	}else{
		isUpdate=0;
	}
	
	var rf=Math.random();
	if (rf<0.2) {
		monster.rfx=1;
		monster.rfy=1;
	}else if(rf<0.5){
		monster.rfx=1;
		monster.rfy=-1;
	}else if(rf<0.7){
		monster.rfx=-1;
		monster.rfy=1;
	}else{
		monster.rfx=-1;
		monster.rfy=-1;
	}
}

//边界位置处理
var updateSide=function(){
	if(hero.x>canvas.width-32){
		hero.x=16;
	}
	if(hero.x<16){
		hero.x=canvas.width-32;
	}
	if(hero.y>canvas.height-32){
		hero.y=16;
	}
	if(hero.y<16){
		hero.y=canvas.height-32;
	}
	if(monster.x>canvas.width-30){
		monster.x=16;
	}
	if(monster.x<16){
		monster.x=canvas.width-30;
	}
	if(monster.y>canvas.height-30){
		monster.y=16;
	}
	if(monster.y<16){
		monster.y=canvas.height-30;
	}
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//渲染物体
// Draw everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//主循环结构
// The main game loop
var main = function () {
    var now = Date.now();

    var delta = now - then;
    //console.log(delta);
    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//参数调整
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
