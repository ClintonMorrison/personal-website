/**
 * @fileOverview This file implements the base of a HTML5 game, 
 * including the game loop, input, and drawing the game.
 * This file was created by Clinton Morrison on July 2, 2013.
 *
 * @name gameBase.js
 * @author Clinton Morrison
 */


/**
 * Position of mouse.
 * @type {Vector}
 */
var mousePosition = new Vector(0, 0);

/**
 * Canvas to draw game to.
 * @type {HTMLElement}
 */
var c = document.getElementById("gameCanvas");

/**
 * Size of game window.
 * @type {Vector}
 */
var windowSize = new Vector(c.width, c.height);

/**
 * Maximum FPS to update game at.
 * @type {number}
 */
var TARGET_FPS = 70;

/**
 * Minimum between updates (to reach target FPS).
 * @type {number}
 */
var updateTime = 1000 / TARGET_FPS;

/**
 * System time at last update.
 * @type {number}
 */
var timeOfLastUpdate = new Date();

/**
 * Current FPS of game.
 * @type {number}
 */
var currentFPS = TARGET_FPS;


/**
 * Instance of the game.
 */
var game = new Game(c.getContext("2d"), windowSize);

/**
 * Input from user.
 * @type {UserInput}
 */
var input = new UserInput();

//Start game loop
window.setInterval("gameLoop()", updateTime);

/**
 * Main game loop.
 */
function gameLoop() {
    updateGame();
    renderGame();
}

/**
 * Draws the game to the canvas graphics context.
 */
function renderGame() {
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, c.width, c.height);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "18px Courier New";

    game.draw(ctx);

}

/**
 * Updates the game.
 */
function updateGame() {
	//Calculate time since last update
    var curTime = new Date();
    var time = curTime - timeOfLastUpdate;
    timeOfLastUpdate = new Date();

    //Calculate FPS
    currentFPS = 1000 / time;

    //Cap time per update at 500 to prevent odd behaviour if game runs very slowly
    if(time > 500 & 5*updateTime < 500)
        time = 500;

    game.update(time, input);
    input.clearMouseClicks();

}

/**
 * Handler for mouse move event.
 * @param e
 */
c.onmousemove = function (e) {
    var rect = c.getBoundingClientRect();
    mousePosition = new Vector(e.clientX - rect.left, e.clientY - rect.top);
    input.onMouseMove(mousePosition);
};

/**
 * Handler for mouse click event.
 * @param e
 */
c.onclick = function (e) {
    clickPosition = mousePosition;
    input.onMouseClick(clickPosition);
};

var KEY_W = 87;
var KEY_X = 88;
var KEY_S = 83;
var KEY_A = 65;
var KEY_D = 68;
var KEY_P = 80;
var KEY_SPACE = 32;
var KEY_UP = 38;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_ENTER = 13;
var KEY_ESCAPE = 27

/**
 * Handler for key down event.
 * @param event
 */
window.onkeydown = function (event) {
	event.preventDefault();
    input.onKeyDown(event.keyCode);

};

/**
 * Handler for key up event.
 * @param event
 */
window.onkeyup = function (event) {
	event.preventDefault();
    input.onKeyUp(event.keyCode);
};


