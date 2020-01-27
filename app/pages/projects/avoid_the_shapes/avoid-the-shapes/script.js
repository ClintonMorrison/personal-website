
/**
 * @fileOverview This file contains the source code for
 * the arcade style game "Avoid The Shapes". This code
 * was created by Clinton Morrison on June 30, 2013.
 *
 * @name script.js
 * @author Clinton Morrison
 */


/**
 * String describing the current game state
 * Allowable states are "menu", "retry", "submit", "running" and "highscore"
 * @type {string}
 */
var state = "menu";

/**
 * The current position of the user's mouse
 * @type {Vector}
 */
var mousePosition = new Vector(0,0);

/**
 * The position of the last mouse click
 * @type {Vector}
 */
var clickPosition = new Vector(0,0);

/**
 * String corresponding between characters
 * user typed since last update
 * @type {Array}
 */
var charsTyped = [];
/**
 * The player's sprite
 * @type {Player}
 */
var player = new Player();

/**
 * Draws and updates the main menu
 * @type {MainMenu}
 */
var mainMenu = new MainMenu();

/**
 * Draws and updates the retry menu
 * @type {RetryMenu}
 */
var retryMenu = new RetryMenu();

/**
 * Draws and updates the highscore submit menu
 * @type {SubmitMenu}
 */
var submitMenu = new SubmitMenu();

/**
 * Draws and updates the highscore menu
 * @type {HighscoreMenu}
 */
var highscoreMenu = new HighscoreMenu();


/**
 * Array of enemy sprites
 * @type {Array}
 */
var sprites = [];

/**
 * Array of valid sprite colors
 * @type {string[]}
 */
var colors = ["green", "red", "blue", "purple", "orange"];

/**
 * Array of valid sprite shapes
 * @type {string[]}
 */
var shapes = ["circle"];

/**'
 * Queue of messages to be printed to the screen
 * @type {MessageQueue}
 */
var messageQueue = new MessageQueue();

/**
 * Image for toggle music button
 * @type {Image}
 */
var musicImage = new Image();
musicImage.src = 'musicnoteselected.png';

/**
 * Audio file played when player explodes
 * @type {Audio}
 */
var explodeSound = new Audio("gameExplode.mp3");

/**
 * True if sound is enabled
 * @type {boolean}
 */
var soundOn = true;

/**
 * Time between frames
 * @type {number}
 */
var updateTime = 1000/60;

/**
 * Current score of player
 * @type {number}
 */
var score = 0;

/**
 * Reference to canvas
 * @type {HTMLElement}
 */
var c = document.getElementById("canvas"); //Reference to canvas

/**
 * 2D Drawing Context of canvas
 * @type {*}
 */
var ctx = c.getContext("2d"); //2D drawing context


/**
 * Button which toggles music on and off
 * @type {ImageButton}
 */
var musicButton = new ImageButton('musicnote.png', //Creates button to toggle music
    'musicnoteselected.png', new Vector(c.width-50, c.height - 50),
    new Vector(40,40));

//Begin game loop
window.setInterval("gameLoop()", updateTime);

//Add 50 sprites
for(var i = 1; i < 50; i++)
    addRandomSprite();

/**
 * Handles user mouse move events
 * @param e
 */
c.onmousemove = function(e){
    var c = document.getElementById("canvas");
    var rect = c.getBoundingClientRect();
    mousePosition = new Vector(e.clientX - rect.left, e.clientY - rect.top);
};

/**
 *
 * @param e
 */

window.onkeydown = function(e){
    e.preventDefault();
    charsTyped.push(e.keyCode);
};

/**
 * Handles user mouse click events
 * @param e
 */
c.onclick = function(e){
    clickPosition = mousePosition;
};

/**
 * Main game loop
 */
function gameLoop()
{
    updateGame();
    renderGame();
}

/**
 * Renders the game
 */
function renderGame()
{

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,800,500);
    ctx.lineWidth = 5;

    for(var i = 0; i < sprites.length; i++)
    {
        sprites[i].draw(ctx);
    }

    if(state == "running")
    {
        ctx.fillStyle = "#FFFFFF";
        ctx.font="18px Courier New";
        ctx.fillText("Score: " + score, 10, c.height - 20);
        player.draw(ctx);

        messageQueue.draw(ctx);
    }

    if(state === "menu")
    {
        mainMenu.draw(ctx);
    }
    else if(state === "retry")
    {
        retryMenu.draw(ctx);
    }
    else if(state === "submit")
    {
        submitMenu.draw(ctx);
    } else if(state === "highscore")
    {
        highscoreMenu.draw(ctx);
    }

    musicButton.draw(ctx);
}

/**
 * Removes sprites which have moved off
 * the screen and are no longer visible
 */
function removeOutOfBoundsSprites()
{
    var c = document.getElementById("canvas");

    for(var i = 0; i < sprites.length; i++)
    {
        if(sprites[i].position.x + sprites[i].radius < 0 || sprites[i].position.x - sprites[i].radius > c.width
        || sprites[i].position.y + sprites[i].radius < 0 || sprites[i].position.y - sprites[i].radius > c.height)
        {
            sprites.splice(i, 1);
            addRandomSprite();
        }
    }
}

/**
 * Updates the game
 */
function updateGame()
{
    if(score % 200 == 0 && state == "running") addRandomSprite();

    if(state == "running")
        player.update(mousePosition, updateTime);


    for(var i = 0; i < sprites.length; i++)
    {
        sprites[i].update(updateTime);

        if(state == "running" && player.collidingWith(sprites[i]))
        {
            player.kill();
        }

    }
    removeOutOfBoundsSprites();
    messageQueue.update(updateTime);
    musicButton.update(mousePosition, clickPosition);

    if(state == "menu")
    {
        mainMenu.update(mousePosition, updateTime, clickPosition);
        clickPosition = new Vector(0,0);
    }
    else if(state == "running")
    {
        score++;
    }
    else if(state == "retry")
    {
        retryMenu.update(mousePosition, updateTime, clickPosition);
        clickPosition = new Vector(0,0);
    }
    else if(state == "submit")
    {
        submitMenu.update(mousePosition, updateTime, clickPosition, charsTyped);
        clickPosition = new Vector(0,0);
    }
    else if(state == "highscore")
    {
        highscoreMenu.update(mousePosition, updateTime, clickPosition);
    }

    if(!player.alive && player.timeDead > 2000 && state == "running")
    {
        showRetryMenu();
    }

    if(musicButton.wasClicked() == true)
    {
        soundOn = ! soundOn;
        var music = document.getElementById("gameMusic");


        if(soundOn) music.muted = "";
        else music.muted = "muted";
    }

    clickPosition = new Vector(0,0);
    charsTyped = [];
}

/**
 * Adds a random sprite to the
 * sprites array
 */
function addRandomSprite()
{
    var randomSign1;
    var randomSign2;

    if(Math.random() > 0.5)
        randomSign1 = 1;
    else
        randomSign1 = -1;

    if(Math.random() > 0.5)
        randomSign2 = 1;
    else
        randomSign2 = -1;

    var startPositionSelector = Math.random();
    var position = new Vector(Math.random()*c.width, Math.random()*c.height);
    var velocity = new Vector(Math.random()*0.1*randomSign1, Math.random()*0.1*randomSign2);

    if(startPositionSelector < 0.25)
    {
        position = new Vector(0, Math.random()*c.height);
        velocity = new Vector(Math.random()*0.1, randomSign1*Math.random()*0.1);
    }
    else if(startPositionSelector < 0.50)
    {
        position = new Vector(c.width, Math.random()*c.height);
        velocity = new Vector(-Math.random()*0.1, randomSign1*Math.random()*0.1);
    }
    else if(startPositionSelector < 0.75)
    {
        position = new Vector(Math.random()*c.width, c.height);
        velocity = new Vector(randomSign1*Math.random()*0.1, -Math.random()*0.1);
    }
    else
    {
        position = new Vector(Math.random()*c.width, 0);
        velocity = new Vector(randomSign1*Math.random()*0.1, Math.random()*0.1);
    }

    sprites.push(new Sprite(position, velocity, Math.random()*50, shapes[Math.floor(Math.random()*shapes.length)], colors[Math.floor(Math.random()*colors.length)]));
}

/**
 * Creates a new game
 * This is called when the user first plays the game,
 * as well as when they die and restart the game.
 */
function startNewGame()
{
    state = "running";
    messageQueue.clear();
    messageQueue.enqueue(new Message("Move the mouse to control the yellow circle."));
    messageQueue.enqueue(new Message("Avoid touching other circles."));
    messageQueue.enqueue(new Message("Survive as long as you can."));
    score = 0;
    sprites = [];
    player.revive();
    player = new Player();

    for(var i = 1; i < 5; i++)
        addRandomSprite();
}

/**
 * Switches game state to retry
 * so that the retry menu is displayed
 * to the user
 */
function showRetryMenu()
{
    state = "retry";
    messageQueue.enqueue(new Message("M"));

    sprites = [];

    for(var i = 1; i < 50; i++)
        addRandomSprite();

}

/**
 * Creates a vector
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function Vector(x, y)
{
    /**
     * x component of vector
     * @type {number}
     */
    this.x = x;

    /**
     * y component of vector
     * @type {number}
     */
    this.y = y;
}

/**
 * Returns the vector from this vector to another
 * @param {Vector} v Vector to find vector to
 * @returns {Vector} Vector from this vector to v
 */
Vector.prototype.vectorFrom = function (v)
{
    return new Vector(this.x - v.x, this.y - v.y);
};

/**
 * Returns the length of this vector
 * @return {number} Length of vector
 */
Vector.prototype.getLength = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * Returns the magnitude (length) of
 * this vector
 * @return {number} Magnitude of vector
 */
Vector.prototype.getMagnitude = function () {
    return this.getLength();
};

/**
 * Scales this vector by a constant
 * @param {number} k constant to scale vector by
 */
Vector.prototype.scale = function (k) {
    this.x *= k;
    this.y *= k;
};

/**
 * Returns a scaled version of this vector
 * @param {number} k constant to scale the vector by
 * @return {Vector} A scaled copy of this vector
 */
Vector.prototype.getScaled = function (k) {
    return new Vector(this.x * k, this.y * k);
};

/**
 * Normalizes this vector
 */
Vector.prototype.normalize = function () {
    var len = this.getLength();
    this.x = this.x / len;
    this.y = this.y / len;
};

/**
 * Returns a vector with length 1 parallel to this vector
 * @return {Vector} A normalized copy of this vector
 */
Vector.prototype.getNormalized = function () {
    var len = this.getLength();
    return new Vector(this.x / len, this.y / len);
};

/**
 * Returns a vector connecting this vector to vector v
 * @param {Vector} v The vector to get a vector to from this vector
 * @return {Vector} A vector connecting this vector to vector v
 */
Vector.prototype.getVectorTo = function (v) {
    return new Vector(v.x - this.x, v.y - this.y);
};

/**
 * Returns the distance between this vector and a vector v
 * @param {Vector} v The vector to get the distance to
 * @return {number} The distance to the vector v
 */
Vector.prototype.getDistanceTo = function (v) {
    return this.getVectorTo(v).getLength();
};

/**
 * Returns a string version of this vector
 * @return {String} A string representation of this vector
 */
Vector.prototype.toString = function () {
    return "[" + this.x + ", " + this.y + "]";
};

/**
 * Returns a copy of this vector
 * @return {Vector} A copy of this vector
 */
Vector.prototype.copy = function () {
    return new Vector(this.x, this.y);
};

/**
 * Returns a squared version of this vector
 * @return {Vector} A squared version of this vector
 */
Vector.prototype.getSquared = function () {
    return new Vector(this.x * this.x, this.y * this.y);
};

/**
 * Adds a vector v to this vector
 * @param {Vector} v The vector to add to this vector
 */
Vector.prototype.add = function (v) {
    this.x += v.x;
    this.y += v.y;
};

/**
 * Returns a new vector which is this vector with v added to it
 * @param {Vector} v The vector to add to a copy of this vector
 * @return {Vector} Copy of this vector with v added to it
 */
Vector.prototype.getAdded = function (v) {
    var newVec = this.copy();
    newVec.add(v);
    return newVec;
};

/**
 * Subtracts a vector v from this vector
 * @param {Vector} v The vector to subtract from this vector
 */
Vector.prototype.sub = function (v) {
    this.x -= v.x;
    this.y -= v.y;
};

/**
 * Returns a new vector which is this vector with v subtracted from it
 * @param {Vector} v The vector to subtract from a copy of this vector
 * @return {Vector} Copy of this vector with v subtracted from it
 */
Vector.prototype.getSubbed = function (v) {
    var newVec = this.copy();
    newVec.sub(v);
    return newVec;
};

/**
 * Returns the dot product of this vector and another vector v
 * @param {Vector} v The vector to dot with this vector
 * @return {number} The dot product of this vector and v
 */
Vector.prototype.getDot = function (v) {
    return this.x * v.x + this.y * v.y;
};

/**
 * Returns the angle this vector makes in the unit circle
 * @return {number} The angle of the vector
 */
Vector.prototype.getAngle = function () {
    var theta = Math.atan(Math.abs(this.y / this.x)) * 180 / Math.PI;

    if (this.x <= 0 && this.y >= 0) {
        theta = 180 - theta;
    } else if (this.x <= 0 && this.y <= 0) {
        theta = 180 + theta;
    } else if (this.x >= 0 && this.y <= 0) {
        theta = 360 - theta;
    }

    return theta;
};


/**
 * Rotates this vector about a point given by a vector p
 * @param {Vector} p The point to rotate this vector about
 * @param {number} angle The angle (in radians) to rotate this vector
 */
Vector.prototype.rotateAbout = function (p, angle) {
    var sin, cos, cent, newX, newY;

    sin = Math.sin(angle);
    cos = Math.cos(angle);
    cent = p.copy();

    this.x -= cent.x;
    this.y -= cent.y;

    newX = this.x * cos - this.y * sin;
    newY = this.x * sin + this.y * cos;

    this.x = newX + cent.x;
    this.y = newY + cent.y;
};


/**
 * Creates a player
 * @constructor
 */
function Player()
{
    /**
     * Position of player
     * @type {Vector}
     */
    this.position = new Vector(400,200);

    /**
     * Velocity of player
     * @type {Vector}
     */
    this.velocity = new Vector(0,0);

    /**
     * Radius of player circle
     * @type {number}
     */
    this.radius = 20;

    /**
     * Indicates whether player is alive or not
     * @type {boolean}
     */
    this.alive = true;

    /**
     * How many milliseconds the player has been dead
     * @type {number}
     */
    this.timeDead = 0;

    /**
     * Array of fragments produced
     * when player explodes
     * @type {Array}
     */
    this.fragments = [];
}

/**
 * Draws the player
 * @param {CanvasRenderingContext2D} ctx Canvas drawing context
 */
Player.prototype.draw = function (ctx)
{
    if(this.alive)
    {
        ctx.beginPath();
        ctx.fillStyle="yellow";
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    else
    {
        for(var i = 0; i < this.fragments.length; i++)
            this.fragments[i].draw(ctx);
    }
};

/**
 * Updates the player
 * @param {Vector} mousePosition Current mouse position
 * @param {number} time Time since last update
 */
Player.prototype.update = function (mousePosition, time)
{
    var vx = 0;
    var vy = 0;

    this.velocity = mousePosition.vectorFrom(this.position).getNormalized().getScaled(0.08);
    this.position = new Vector(this.position.x + this.velocity.x*time, this.position.y + this.velocity.y*time);

    if(!this.alive)
    {
        this.timeDead += time;
        for(var i = 0; i < this.fragments.length; i++)
        {
            this.fragments[i].update(time);
        }
    }
};

/**
 * Checks if player has collided with a sprite s
 * @param {Sprite} s Sprite to check for collision with
 * @returns {boolean} True if player is colliding with sprite s
 */
Player.prototype.collidingWith = function(s)
{
    var centerDiff = this.position.vectorFrom(s.position);
    var distance = centerDiff.getMagnitude();

    return distance < this.radius + s.radius;
};

/**
 * Kills the player
 */
Player.prototype.kill = function()
{
    if(this.alive == true)
    {
        explodeSound.play();
        this.alive = false;
        for(var i = 0; i < 35; i++)
        {
            this.createRandomFragment();
        }
    }
};

/**
 * Brings player back to life
 */
Player.prototype.revive = function()
{
    this.alive = true;
    this.fragments = [];
    this.timeDead = 0;
};

/**
 * Creates circular drawable debris fragment
 * Created when player dies
 */
Player.prototype.createRandomFragment = function()
{
    //Generate random velocity
    var randomSign1;
    var randomSign2;

    if(Math.random() > 0.5)
        randomSign1 = 1;
    else
        randomSign1 = -1;

    if(Math.random() > 0.5)
        randomSign2 = 1;
    else
        randomSign2 = -1;

    var s = new Sprite(new Vector(this.position.x, this.position.y),
        new Vector(Math.random()*0.4*randomSign1, Math.random()*0.4*randomSign2),
        Math.random()*14, shapes[Math.floor(shapes.length*Math.random())], "yellow");
    this.fragments.push(s);
};


/**
 * Creates a sprite
 * @param {Vector} position Position of sprite
 * @param {Vector} velocity Velocity of sprite
 * @param {number} radius Radius of sprite
 * @param {string} shape Shape of sprite
 * @param {string} color Color of sprite
 * @constructor
 */
function Sprite(position, velocity, radius, shape, color)
{
    /**
     * Position of sprite
     * @type {Vector}
     */
    this.position = position;

    /**
     * Velocity of sprite
     * @type {Vector}
     */
    this.velocity = velocity;

    /**
     * Radius of circle
     * @type {number}
     */
    this.radius = radius;

    /**
     * Shape of sprite (circle or square)
     * @type {string}
     */
    this.shape = shape;

    /**
     * Color of sprite (can be hex string or word, ie "#F00" or "red")
     * @type {string}
     */
    this.color = color;
}

/**
 * Draws sprite
 * @param {CanvasRenderingContext2D} ctx Context to draw sprite to
 */
Sprite.prototype.draw = function(ctx)
{
    if(this.shape == "circle")
    {
        ctx.beginPath();
        ctx.strokeStyle=this.color;
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
        ctx.closePath();
        ctx.stroke();
    }
    else if(this.shape == "square")
    {
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.position.x, this.position.y, this.radius*2, this.radius*2);
    }
};


/**
 * Updates sprite
 * @param {number} time Time since last update
 */
Sprite.prototype.update = function(time)
{
    this.position = new Vector(this.position.x + this.velocity.x*time, this.position.y + this.velocity.y*time);
};


/**
 * Creates a button
 * @param {Vector} position Position of button
 * @param {string} text Text of button
 * @constructor
 */
function Button(position, text)
{
    /**
     * Position of button
     * @type {Vector}
     */
    this.position = position;

    /**
     * Text to display on button
     * @type {string}
     */
    this.text = text;

    /**
     * True if button is selected (if the mouse is over the button)
     * @type {boolean}
     */
    this.selected = false;

    /**
     * True if button was clicked
     * @type {boolean}
     */
    this.clicked = false;

    /**
     * Rectangle enclosing button
     * @type {Rectangle}
     */
    this.rect = new Rectangle(position.x, position.y-35, text.length*25, 40);
}

/**
 * Draws button
 * @param {CanvasRenderingContext2D} ctx Context to draw button to
 */
Button.prototype.draw = function(ctx)
{
    ctx.fillStyle = "#AA0000";
    ctx.font="40px Courier New";
    ctx.fillText(this.text, this.position.x - 2, this.position.y - 2);
    if(this.selected) ctx.fillStyle = "red";
    else ctx.fillStyle = "#FFFFFF";
    ctx.fillText(this.text, this.position.x, this.position.y);

};

/**
 * Updates button
 * @param {Vector} mouse Position of mouse
 * @param {number} time Time since last update
 * @param {Vector} click Position of click
 */
Button.prototype.update = function(mouse, time, click)
{
    this.selected = this.rect.containsPoint(mouse);

    if(this.rect.containsPoint(click))
        this.clicked = true;

};

/**
 * Returns whether the button has been clicked
 * and sets this.clicked to false.
 * @returns {boolean} Whether the button has been clicked or not
 */
Button.prototype.wasClicked = function()
{
    if(this.clicked)
    {
        this.clicked = false;
        return true;
    }
    else
        return false;
};

/**
 * Creates a color
 * @param {number} r Red component of color (between 0 and 255)
 * @param {number} g Green component of color (between 0 and 255)
 * @param {number} b Blue component of color (between 0 and 255)
 * @constructor
 */
function Color(r, g, b)
{
    /**
     * Red component of color (between 0 and 255)
     * @type {number}
     */
    this.r = r;

    /**
     * Green component of color (between 0 and 255)
     * @type {number}
     */
    this.g = g;

    /**
     * Blue component of color (between 0 and 255)
     * @type {number}
     */
    this.b = b;
}

/**
 * Converts color to hex string (ie #01F0A0)
 * @returns {string} Hex string representing color
 */
Color.prototype.toString = function()
{
    var rStr = this.r.toString(16);
    if(rStr.length < 2) rStr = "0" + rStr;

    var gStr = this.g.toString(16);
    if(gStr.length < 2) gStr = "0" + gStr;

    var bStr = this.b.toString(16);
    if(bStr.length < 2) bStr = "0" + bStr;

    return "#" + rStr + gStr + bStr;
};

/**
 * Creates queue to store and write
 * messages from game to screen
 * @constructor
 */
function MessageQueue()
{
    /**
     * Array of messages currently in queue
     * @type {Array}
     */
    this.messages = [];
}

/**
 * Adds a message to the queue
 * @param {Message} a Message to add to queue
 */
MessageQueue.prototype.enqueue = function(a)
{
    this.messages.push(a);
};

/**
 * Removes message from the queue
 */
MessageQueue.prototype.dequeue = function()
{
    if(this.messages.length >= 1) this.messages.splice(0, 1);
};

/**
 * Draws message to canvas
 * @param {CanvasRenderingContext2D} ctx Context to draw message to
 */
MessageQueue.prototype.draw = function(ctx)
{
    if(this.messages.length >= 1) this.messages[0].draw(ctx);
};

/**
 * Updates current message and moves onto next message
 * when current message is finished
 * @param {number} time Time since last update
 */
MessageQueue.prototype.update = function(time)
{
    if(this.messages.length >= 1)
    {
        this.messages[0].update(time);
        if(this.messages[0].finished)
        {
            this.dequeue();
        }
    }
};

/**
 * Removes all messages in the queue
 */
MessageQueue.prototype.clear = function()
{
    this.messages = [];
};


/**
 * Creates a message which can be drawn to
 * the screen
 * @param {string} text Text to display
 * @constructor
 */
function Message(text)
{
    /**
     * Text of message
     * @type {string}
     */
    this.text = text;

    /**
     * Color of message
     * @type {Color}
     */
    this.color = new Color(0,0,0);

    /**
     * Time that the message was displayed so far
     * @type {number}
     */
    this.timeElapsed = 0.0;

    /**
     * Time that the message should be displayed for
     * @type {number}
     */
    this.delay = 4000.0;

    /**
     * True if the message has been displayed long enough
     * @type {boolean}
     */
    this.finished = false;
}

/**
 * Draws message to screen
 * @param {CanvasRenderingContext2D} ctx Context to draw message to
 */
Message.prototype.draw = function(ctx)
{
    if( !this.finished )
    {
        ctx.fillStyle = this.color.toString();
        ctx.font="22px Courier New";
        ctx.fillText(this.text, 10, 40);
    }
};

/**
 * Updates message (applies color transition)
 * @param {number} time Time since last update
 */
Message.prototype.update = function(time)
{
    if( !this.finished)
    {
        this.timeElapsed += time;
        if(this.timeElapsed > this.delay) this.finished = true;
        var p = this.timeElapsed / this.delay;
        this.color = new Color(Math.floor(255*p), Math.floor(255*p), Math.floor(255*p));
    }
};

/**
 * Creates a rectangle
 * @param {number} x x coordinate of top left corner of rectangle
 * @param {number} y y coordinate of top left corner of rectangle
 * @param {number} w width of rectangle
 * @param {number} h height of rectangle
 * @constructor
 */
function Rectangle(x, y, w, h)
{
    /**
     * x coordinate of top left corner of rectangle
     * @type {number}
     */
    this.x = x;

    /**
     * y coordinate of top left corner of rectangle
     * @type {number}
     */
    this.y = y;

    /**
     * width of rectangle
     * @type {number}
     */
    this.w = w;

    /**
     * height of rectangle
     * @type {number}
     */
    this.h = h;
}

/**
 * Checks if rectangle contains point p
 * @param {Vector} p Point to check if inside rectangle
 * @returns {boolean} Whether or not rectangle contains point p
 */
Rectangle.prototype.containsPoint = function(p)
{
    return p.x >= this.x && p.x <= this.x+this.w && p.y >= this.y && p.y <= this.y+this.h;
};

/**
 * Creates a main menu
 * @constructor
 */
function MainMenu()
{
    var c = document.getElementById("canvas");

    /**
     * Button to press to play the game
     * @type {Button}
     */
    this.buttonPlay = new Button(new Vector((c.width-100)/2, (c.height)/2 + 5), "PLAY");


    /**
     * Button to press to view high scores
     * @type {Button}
     */
    this.buttonHighscores = new Button(new Vector((c.width-100)/2 - 70, (c.height)/2 + 60), "HIGH SCORES");

    /**
     * Rectangle enclosing main menu
     * @type {Rectangle}
     */
    this.box = new Rectangle((c.width-400)/2, (c.height-200)/2, 400, 200);
}

/**
 * Draws the main menu
 * @param {CanvasRenderingContext2D} ctx Context to draw main menu to
 */
MainMenu.prototype.draw = function(ctx)
{
    var c = document.getElementById("canvas");

    //Draw menu background
    ctx.fillStyle = "#000000";
    ctx.fillRect(this.box.x, this.box.y, this.box.w, this.box.h);
    ctx.strokeStyle = "#AA0000";
    ctx.strokeRect(this.box.x, this.box.y, this.box.w, this.box.h);

    //Draw title
    ctx.fillStyle = "#FFFFFF";
    ctx.font="36px Courier New";
    ctx.fillText("Avoid The Shapes!", this.box.x + 15, this.box.y + 36);

    //Draw credits
    ctx.fillStyle = "#FFFFFF";
    ctx.font="12px Courier New";
    ctx.fillText("Created by Clinton Morrison", this.box.x + 10, this.box.y + this.box.h - 10);

    //Draw buttons
    this.buttonPlay.draw(ctx);
    this.buttonHighscores.draw(ctx);

};

/**
 * Updates main menu of game
 * @param {Vector} mouse Position of mouse
 * @param {number} time Time (ms) since last update
 * @param {Vector} click Position of mouse click
 */
MainMenu.prototype.update = function(mouse, time, click)
{
    this.buttonPlay.update(mouse, time, click);
    this.buttonHighscores.update(mouse, time, click);

    if(this.buttonPlay.wasClicked())
    {
        state = "running";
        startNewGame();
    }

    if(this.buttonHighscores.wasClicked())
    {
        state = "highscore";
    }
};

/**
 * Creates retry menu
 * Displayed to player after they have died
 * @constructor
 */
function RetryMenu()
{
    var c = document.getElementById("canvas");

    /**
     * Button to press to play game again
     * @type {Button}
     */
    this.buttonPlay = new Button(new Vector((c.width-240)/2, (c.height)/2 + 120), "PLAY AGAIN");

    /**
     * Button to press to submit score to high score database
     * @type {Button}
     */
    this.buttonSubmitScore = new Button(new Vector((c.width-290)/2, (c.height)/2 + 50), "SUBMIT SCORE");

    /**
     * Rectangle enclosing retry menu
     * @type {Rectangle}
     */
    this.box = new Rectangle((c.width-400)/2, (c.height-300)/2, 400, 300);
}

/**
 * Draw retry menu
 * @param {CanvasRenderingContext2D} ctx Context to draw menu to
 */
RetryMenu.prototype.draw = function(ctx)
{
    var c = document.getElementById("canvas");

    //Draw menu background
    ctx.fillStyle = "#000000";
    ctx.fillRect(this.box.x, this.box.y, this.box.w, this.box.h);
    ctx.strokeStyle = "#AA0000";
    ctx.strokeRect(this.box.x, this.box.y, this.box.w, this.box.h);

    //Draw title
    ctx.fillStyle = "#FFFFFF";
    ctx.font="36px Courier New";
    ctx.fillText("You Lost!", this.box.x + 100, this.box.y + 43);

    //Draw score
    ctx.fillStyle = "#FFFFFF";
    ctx.font="20px Courier New";
    ctx.fillText("Your final score was " + score + ".", this.box.x + 55, this.box.y + 105);

    //Draw buttons
    this.buttonPlay.draw(ctx);
    this.buttonSubmitScore.draw(ctx);
};

/**
 * Updates retry menu
 * @param {Vector} mouse Position of mouse
 * @param {number} time Time since last update (ms)
 * @param {Vector} click Position of mouse click
 */
RetryMenu.prototype.update = function(mouse, time, click)
{
    this.buttonPlay.update(mouse, time, click);
    this.buttonSubmitScore.update(mouse, time, click);

    if(this.buttonPlay.wasClicked())
    {
        state = "running";
        startNewGame();
    }

    if(this.buttonSubmitScore.wasClicked())
    {
        state = "submit";
    }

};





/**
 * Creates submit menu
 * Displayed to player to allow
 * high score submissions
 * @constructor
 */
function SubmitMenu()
{
    var c = document.getElementById("canvas");

    /**
     * Button to press to return to main menu
     * @type {Button}
     */
    this.buttonBack = new Button(new Vector((c.width-330)/2, (c.height)/2 + 130), "RETURN TO MENU");

    /**
     * Button to press to submit high score
     * @type {Button}
     */
    this.buttonSubmitScore = new Button(new Vector((c.width-290)/2, (c.height)/2 + 80), "SUBMIT SCORE");

    /**
     * Rectangle enclosing menu
     * @type {Rectangle}
     */
    this.box = new Rectangle((c.width-400)/2, (c.height-300)/2, 400, 300);

    /**
     * Name typed by user for high score to be entered under
     * @type {string}
     */
    this.nameString = "";
}

/**
 * Draw submit menu
 * @param {CanvasRenderingContext2D} ctx Context to draw menu to
 */
SubmitMenu.prototype.draw = function(ctx)
{
    var c = document.getElementById("canvas");
    var name = "";

    //Draw menu background
    ctx.fillStyle = "#000000";
    ctx.fillRect(this.box.x, this.box.y, this.box.w, this.box.h);
    ctx.strokeStyle = "#AA0000";
    ctx.strokeRect(this.box.x, this.box.y, this.box.w, this.box.h);

    //Draw title
    ctx.fillStyle = "#FFFFFF";
    ctx.font="36px Courier New";
    ctx.fillText("High Score", this.box.x + 100, this.box.y + 53);

    //Draw score
    ctx.fillStyle = "#FFFFFF";
    ctx.font="20px Courier New";
    ctx.fillText("Type your name below:", this.box.x + 75, this.box.y + 105);

    //Draw text box
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(this.box.x + 75, this.box.y + 130, 250, 40);
    ctx.closePath();
    ctx.stroke();

    //Draw name
    ctx.fillStyle = "#FFFFFF";
    ctx.font="20px Courier New";
    ctx.fillText(this.nameString, this.box.x + 85, this.box.y + 155);


    //Draw buttons
    this.buttonBack.draw(ctx);
    this.buttonSubmitScore.draw(ctx);
};

/**
 * Updates retry menu
 * @param {Vector} mouse Position of mouse
 * @param {number} time Time since last update (ms)
 * @param {Vector} click Position of mouse click
 * @param {Array} Key codes typed by user since last update
 */
SubmitMenu.prototype.update = function(mouse, time, click, stringTyped)
{
    this.buttonBack.update(mouse, time, click);
    this.buttonSubmitScore.update(mouse, time, click);

    var i;
    for(i = 0; i < stringTyped.length; i++) {
        //If backspace or delete typed
        if(stringTyped[i] === 8 || stringTyped[i] === 46) {
            if(this.nameString.length > 0) {
                this.nameString = this.nameString.slice(0, this.nameString.length-1);
            }
        } else if ((stringTyped[i] >= 48 && stringTyped[i] <= 90
                    || stringTyped[i] === 32) && this.nameString.length < 8) {
            this.nameString += String.fromCharCode(stringTyped[i]);
        }
    }

    if(this.buttonBack.wasClicked())
    {
        state = "menu";
    }

    if(this.buttonSubmitScore.wasClicked())
    {

        //Set hidden fields in submit form
        document.getElementById('gameField').value = "avoid_the_shapes";
        document.getElementById('userField').value = this.nameString;
        document.getElementById('scoreField').value = score;

        //Submit score to PHP file
        document.getElementById('highScoreSubmitForm').submit();
    }

};







/**
 * Creates high score menu
 * Displays high scores fetched
 * from high score database
 * @constructor
 */
function HighscoreMenu()
{
    var c = document.getElementById("canvas");

    /**
     * Button to press to return to main menu
     * @type {Button}
     */
    this.buttonBack = new Button(new Vector((c.width-330)/2, (c.height)/2 + 130), "RETURN TO MENU");

     /**
     * Rectangle enclosing menu
     * @type {Rectangle}
     */
    this.box = new Rectangle((c.width-400)/2, (c.height-300)/2, 400, 300);
}

/**
 * Draw high score menu
 * @param {CanvasRenderingContext2D} ctx Context to draw menu to
 */
HighscoreMenu.prototype.draw = function(ctx)
{
    var c = document.getElementById("canvas");
    var name = "";

    //Draw menu background
    ctx.fillStyle = "#000000";
    ctx.fillRect(this.box.x, this.box.y, this.box.w, this.box.h);
    ctx.strokeStyle = "#AA0000";
    ctx.strokeRect(this.box.x, this.box.y, this.box.w, this.box.h);

    //Draw title
    ctx.fillStyle = "#FFFFFF";
    ctx.font="36px Courier New";
    ctx.fillText("High Scores", this.box.x + 100, this.box.y + 35);


    //Draw high scores
    ctx.font="20px Courier New";
    for(i = 0; i < scores.length; i++) {
        ctx.fillText(i+1, this.box.x + 40, this.box.y + 80 + 30*i);
        ctx.fillText(scores[i].user, this.box.x + 80, this.box.y + 80 + 30*i);
        ctx.fillText(scores[i].score, this.box.x + 300, this.box.y + 80 + 30*i);
    }

    //Draw buttons
    this.buttonBack.draw(ctx);
};

/**
 * Updates high score menu
 * @param {Vector} mouse Position of mouse
 * @param {number} time Time since last update (ms)
 * @param {Vector} click Position of mouse click
 */
HighscoreMenu.prototype.update = function(mouse, time, click)
{
    this.buttonBack.update(mouse, time, click);

    if(this.buttonBack.wasClicked())
    {
        state = "menu";
    }
};











/**
 * Creates a button which is displayed as
 * an image
 * @param {string} imagePath Path to image
 * @param {string} imageSelectedPath Path to image for when button is selected
 * @param {Vector} position Position of button
 * @param {Vector} dimensions Dimensions of image
 * @constructor
 */
function ImageButton(imagePath, imageSelectedPath, position, dimensions)
{
    /**
     * Image of button when button is not highlighted
     * @type {Image}
     */
    this.image = new Image();
    this.image.src = imagePath;

    /**
     * Image of button when button is highlighted
     * @type {Image}
     */
    this.imageSelected = new Image();
    this.imageSelected.src = imageSelectedPath;

    /**
     * Position of button
     * @type {Vector}
     */
    this.position = position;

    /**
     * True if button is selected
     * @type {boolean}
     */
    this.selected = false;

    /**
     * True if button has been clicked
     * @type {boolean}
     */
    this.clicked = false;

    /**
     * Bounding rectangle for button
     * @type {Rectangle}
     */
    this.rect = new Rectangle(position.x, position.y, dimensions.x, dimensions.y);
}

/**
 * Draws the image button
 * @param {CanvasRenderingContext2D} ctx
 */
ImageButton.prototype.draw = function(ctx)
{
    if(this.selected) ctx.drawImage(this.imageSelected, this.position.x, this.position.y);
    else ctx.drawImage(this.image, this.position.x, this.position.y);
};

/**
 * Updates the image button
 * @param {Vector} mouse Mouse position
 * @param {Vector} click Position of mouse click
 */
ImageButton.prototype.update = function(mouse, click)
{
    this.selected = this.rect.containsPoint(mouse);

    if(this.rect.containsPoint(click)) {
        this.clicked = true;
    }
};

/**
 * Gets if button was clicked
 * Sets this.clicked to false if button
 * was clicked
 * @returns {boolean} Whether button was clicked or not
 */
ImageButton.prototype.wasClicked = function()
{
    if(this.clicked)
    {
        this.clicked = false;
        return true;
    }
    else return false;
};
