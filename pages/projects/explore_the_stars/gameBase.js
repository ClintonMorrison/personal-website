/* Author: Clinton Morrison
 * Date: July 2
 *
 * This file implements the base of a HTML5 game, including the game loop, input,
 * and drawing the game. 
 */

window.onload = window.onresize = function() {
	var c = document.getElementById("gameCanvas");
	 c.width = window.innerWidth; 
	c.height = window.innerHeight;
}


//Global Variables
var mousePosition = new Vector(0, 0);
var c = document.getElementById("gameCanvas");
c.width = window.innerWidth; 
c.height = window.innerHeight;
var windowSize = new Vector( window.innerWidth, window.innerHeight);
var updateTime = 1000 / 60;

//Create an instance of the game
var game = new Game(c.getContext("2d"), windowSize);
var input = new UserInput();

//Start game loop
window.setInterval("gameLoop()", updateTime);

//The main loop of the game
function gameLoop() {
    updateGame();
    renderGame();
}

//Renders the game
function renderGame() {
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, c.width, c.height);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "18px Courier New";
    //ctx.fillText("Mouse position: " + input.mousePosition, c.width - 300, c.height - 20);

    game.draw(ctx);
    
}


//Updates the game
function updateGame() {
    var c = document.getElementById("gameCanvas");
    var windowSize1 = new Vector(c.width, c.height);
    game.update(updateTime, input, windowSize1);
    input.clearMouseClicks();

}


//Event handlers
c.onmousemove = function (e) {
    var rect = c.getBoundingClientRect();
    mousePosition = new Vector(e.clientX - rect.left, e.clientY - rect.top);
    input.onMouseMove(mousePosition);
};

window.onclick = function (e) {
    clickPosition = mousePosition;
    input.onMouseClick(clickPosition);
};

window.onmousedown = function (e) {
    input.onMouseDown();
};

window.onmouseup = function (e) {
    input.onMouseUp();
    console.log("Mouse up!");
};


c.onkeyup = function (e) {
};


var KEY_W = 87;
var KEY_X = 88;
var KEY_S = 83;
var KEY_A = 65;
var KEY_D = 68;
var KEY_SPACE = 32;

window.onkeydown = function (event) {
    input.onKeyDown(event.keyCode);

};

window.onkeyup = function (event) {
    input.onKeyUp(event.keyCode);
    

};


