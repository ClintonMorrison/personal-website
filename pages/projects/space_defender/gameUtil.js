/**
 * @fileOverview This file contains various functions used in the other 
 * JavaScript files which are useful for implementing HTML5 games. 
 * This file was created by Clinton Morrison on July 2, 2013.
 *
 * @name gameUtil.js
 * @author Clinton Morrison
 */


/* ---------------------------------------------------------------------- */

/**
 * Used to cause an object to inherit from another object.
 * @param ParentClassOrObject The object or parent to inherit from.
 * @returns {Function}
 * @author Gavin Kistner (code taken from http://phrogz.net/JS/classes/OOPinJS2.html )
 */
Function.prototype.inheritsFrom = function (ParentClassOrObject) {
    if (ParentClassOrObject.constructor === Function) {
        //Normal Inheritance
        this.prototype = new ParentClassOrObject();
        this.prototype.constructor = this;
        this.prototype.parent = ParentClassOrObject.prototype;
    } else {
        //Pure Virtual Inheritance
        this.prototype = ParentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = ParentClassOrObject;
    }
    return this;
};

/* ---------------------------------------------------------------------- */



/**
 * This function creates a vector object.Vectors represent a direction or
 * position in 2D space.
 * @param {number} x The x length of the vector.
 * @param {number} y The y length of the vector.
 * @constructor
 */
function Vector(x, y) {
    /**
     * X component of vector.
     * @type {number}
     */
    this.x = x;

    /**
     * Y component of vector.
     * @type {number}
     */
    this.y = y;
}

/**
 * Returns a vector connecting vector v to this vector.
 * @param {Vector} v The vector to get a vector from.
 * @return {Vector} A vector connecting vector v to this vector.
 */
Vector.prototype.vectorFrom = function (v) {
    return new Vector(this.x - v.x, this.y - v.y);
};

/**
 * Returns a vector with length 1 parallel to this vector.
 * @return {Vector} A normalized copy of this vector.
 */
Vector.prototype.getNormalized = function () {
    var magnitude = Math.sqrt(this.x * this.x + this.y * this.y);

    if (magnitude == 0.0)
        return new Vector(0, 0);

    return new Vector(this.x / magnitude, this.y / magnitude);
};

/**
 * Returns a scaled version of this vector.
 * @param {number} k constant to scale the vector by.
 * @return {Vector} A scaled copy of this vector.
 */
Vector.prototype.getScaled = function (k) {
    return new Vector(this.x * k, this.y * k);
};

/**
 * Returns a string version of this vector.
 * @return {String} A string representation of this vector.
 */
Vector.prototype.toString = function () {
    return ("(" + this.x + ", " + this.y + ")");
};

/**
 * Returns the length of this vector.
 * @return {number} Length of vector.
 */
Vector.prototype.getMagnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * Adds a vector v to this vector.
 * @param {Vector} vec The vector to add to this vector.
 */
Vector.prototype.add = function(vec) {
    this.x += vec.x;
    this.y += vec.y;
};

/**
 * Returns a new vector which is this vector with v added to it.
 * @param {Vector} vec The vector to add to a copy of this vector.
 * @return {Vector} Copy of this vector with v added to it.
 */
Vector.prototype.getAdded = function (vec) {
    return new Vector(this.x + vec.x, this.y + vec.y);
};

/**
 * Returns the distance between this vector and a vector v.
 * @param {Vector} vec The vector to get the distance to.
 * @return {number} The distance to the vector v.
 */
Vector.prototype.distanceFrom = function(vec) {
    var s = new Vector(this.x - vec.x, this.y-vec.y);
    return Math.sqrt(s.x*s.x + s.y*s.y);
};

/**
 * Returns the angle this vector makes in the unit circle.
 * @return {number} The angle of the vector.
 */
Vector.prototype.getAngle = function () {
    var theta = Math.atan(Math.abs(this.y/this.x)) * 180 / Math.PI;

    if (this.x <= 0 && this.y >= 0) theta = 180 - theta;
    else if (this.x <= 0 && this.y <= 0) theta = 180 + theta;
    else if(this.x >= 0 && this.y <= 0) theta = 360 - theta;

    return theta;
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a color object.
 * @param {number} r The red component of the color (between 0 and 255).
 * @param {number} g The green component of the color (between 0 and 255).
 * @param {number} b The blue component of the color (between 0 and 255).
 * @constructor
 */
function Color(r, g, b) {
    /**
     * Red component of the color (between 0 and 255).
     * @type {number}
     */
    this.r = r;

    /**
     * Green component of the color (between 0 and 255).
     * @type {number}
     */
    this.g = g;

    /**
     * Blue component of the color (between 0 and 255).
     * @type {number}
     */
    this.b = b;
}

/**
 * Converts the color to a hexadecimal string. (ie #RRGGBB).
 */
Color.prototype.toString = function () {
    var rStr = this.r.toString(16);
    if (rStr.length < 2) rStr = "0" + rStr;

    var gStr = this.g.toString(16);
    if (gStr.length < 2) gStr = "0" + gStr;

    var bStr = this.b.toString(16);
    if (bStr.length < 2) bStr = "0" + bStr;

    return "#" + rStr + gStr + bStr;

};

/* ---------------------------------------------------------------------- */


/**
 * Creates a rectangle.
 * @param {number} x X coordinate of top left corner of rectangle.
 * @param {number} y Y coordinate of top left corner of rectangle.
 * @param {number} w Width of rectangle.
 * @param {number} h Height of rectangle.
 * @constructor
 */
function Rectangle(x, y, w, h) {
    /**
     * X coordinate of top left corner of rectangle.
     * @type {number}
     */
    this.x = x;

    /**
     * Y coordinate of top left corner of rectangle.
     * @type {number}
     */
    this.y = y;

    /**
     * Width of rectangle.
     * @type {number}
     */
    this.w = w;
    this.h = h;
}

Rectangle.prototype.containsPoint = function (p) {
    return (p.x >= this.x && p.x <= this.x + this.w &&
        p.y >= this.y && p.y <= this.y + this.h);
};

/**
 * Creates a rectangle centered at a given point
 * of given dimensions.
 * @param {number} centX X coordinate of rectangle center.
 * @param {number} centY Y coordinate of rectangle center.
 * @param {number} w Width of rectangle.
 * @param {number} h Height of rectangle.
 * @returns {Rectangle}
 */
function createCenteredRectangle(centX, centY, w, h) {
    return new Rectangle(centX - w / 2, centY - h / 2, w, h);
}

/* ---------------------------------------------------------------------- */



/**
 * Creates a UserInput object.
 * This is used to read and interpret user input.
 * @constructor
 */
function UserInput() {
    this.mouseClicks = [];
    this.mousePosition = new Vector(0, 0);
    this.mouseDown = false;
    this.keysDown = [];
}

/**
 * Records a mouse click.
 * @param {Vector} mouseClickPosition the position of a mouse click.
 */
UserInput.prototype.onMouseClick = function (mouseClickPosition) {
    this.mouseClicks[0] = mouseClickPosition;
};

/**
 * Records the most recent mouse position.
 * @param {Vector} mousePosition the current position of the mouse.
 */
UserInput.prototype.onMouseMove = function (mousePosition) {
    this.mousePosition = mousePosition;
};

/**
 * Gets a mouse click.
 * @return {Vector} The position of the last mouse click.
 */
UserInput.prototype.getMouseClick = function () {
    var p = null;

    if (this.mouseClicks.length > 0) {
        p = this.mouseClicks[0];
    }

    return p;
};

/**
 * Clears all stored mouse clicks.
 */
UserInput.prototype.clearMouseClicks = function () {
    this.mouseClicks = [];
};

/**
 * Called to pass in key down data.
 * @param {number} keyCode The key code of a key which is down.
 */
UserInput.prototype.onKeyDown = function (keyCode) {
    if (this.keysDown.indexOf(keyCode) === -1) {
        this.keysDown.push(keyCode);
    }
};

/**
 * Called to pass in key up data.
 * @param {number} keyCode The key code of a key which is up.
 */
UserInput.prototype.onKeyUp = function (keyCode) {
    var index = this.keysDown.indexOf(keyCode);
    if (index !== -1) {
        this.keysDown.splice(index, 1);
    }
};

/**
 * Called when mouse is pressed down.
 */
UserInput.prototype.onMouseDown = function () {
    this.mouseDown = true;
};

/**
 * Called when mouse is released.
 */
UserInput.prototype.onMouseUp = function () {
    this.mouseDown = false;
};

/**
 * Checks if a given key is down.
 * @param {number} keyCode The key code of the key.
 * @returns {boolean} Whether or not the key is down.
 */
UserInput.prototype.isKeyDown = function (keyCode) {
    return (this.keysDown.indexOf(keyCode) !== -1);
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a timer. Timers can be used to wait before triggering
 * an event. Timers must be updated each game loop.
 * @param {number} maxTime Time until timer is finished (ms).
 * @constructor
 */
function GameTimer(maxTime) {

    this.elapsedTime = 0;
    this.maxTime = maxTime;
    this.finished = false;
}

/**
 * Updates this timer.
 * @param {number} time Time elapsed since last update.
 */
GameTimer.prototype.update = function (time) {
    this.elapsedTime += time;

    if (this.elapsedTime > this.maxTime) {
        this.finished = true;
    }
};

/**
 * Resets this timer.
 */
GameTimer.prototype.reset = function () {
    this.elapsedTime -= this.maxTime;
    this.finished = false;
};

/* ---------------------------------------------------------------------- */


/**
 * Creates a new Sprite object.
 * @param {Vector} position Position vector of sprite.
 * @param {Vector} velocity Velocity vector of sprite.
 * @constructor
 */
function Sprite(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.offset = new Vector(0, 0);
}

/**
 * Updates this sprite.
 * @param {number} time Time elapsed since last update.
 */
Sprite.prototype.update = function (time) {
    this.position.x += this.velocity.x * time;
    this.position.y += this.velocity.y * time;
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a star object. Stars are small white
 * rectangles drawn to screen. To simulate depth
 * stars that are larger are moved faster than those
 * that appear smaller.
 * @param {Vector} position Position of star.
 * @param {Vector} velocity Velocity of star.
 * @param {Vector} windowSize Size of game window.
 * @constructor
 */
function Star(position, velocity, windowSize) {

    Sprite.call(this, position, velocity);
    this.maxLength = 4;
    this.length = Math.random() * this.maxLength;
    this.outOfBounds = false;
    this.color = "white";
    this.drawingPosition = new Vector(0, 0);
    this.shake = false;

    this.velocity = this.velocity.getScaled(this.length / this.maxLength);
}

/**
 * Controls if stars should shake randomly about
 * their current position or not.
 * @param {boolean} shake True if stars should shake.
 */
Star.prototype.setShake = function(shake) {
    this.shake = shake;
};

/**
 * Draws star to canvas.
 * @param {CanvasRenderingContext2D} ctx Drawing context to draw star to.
 */
Star.prototype.draw = function (ctx) {
    this.drawingPosition = new Vector(this.position.x - this.offset.x * this.length / this.maxLength,
        this.position.y - this.offset.y * this.length / this.maxLength);
    ctx.fillStyle = this.color;

    var screenX = this.drawingPosition.x;
    var screenY = this.drawingPosition.y;

    while (screenX < 0) screenX += windowSize.x;
    while (screenX > windowSize.x) screenX -= windowSize.x;

    while (screenY < 0) screenY += windowSize.y;
    while (screenY > windowSize.y) screenY -= windowSize.y;

    if (this.shake) {
        screenX += Math.random() * 5;
        screenY += Math.random() * 5;
    }

    ctx.fillRect(screenX, screenY, this.length, this.length);
};

/**
 * Moves and updates star. Flags star as being
 * out of bounds if star is out of bounds.
 * @param {number} time Time (ms) since last update.
 */
Star.prototype.update = function (time) {

    Sprite.prototype.update.call(this, time);

    if (this.position.x  < 0 || this.position.x > windowSize.x
        || this.position.y < 0 || this.position.y > windowSize.y) {
        this.outOfBounds = true;
    }
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a star manager (for main menu background).
 * Draws and updates a group of stars.
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function StarManager(windowSize) {

    /**
     * Array of stars to draw and update.
     * @type {Array}
     */
    this.stars = [];

    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    //Begin with many stars already created
    for (var i = 0; i < 200; i++) {
        this.stars.push(new Star(new Vector(Math.random()*this.windowSize.x, Math.random()*this.windowSize.y), new Vector(0.09, 0.07), this.windowSize));
    }
}

/**
 * Draws stars to canvas.
 * @param {CanvasRenderingContext2D} ctx Drawing context to draw stars to.
 */
StarManager.prototype.draw = function (ctx) {
    for (var i = 0; i < this.stars.length; i++) {
        this.stars[i].draw(ctx);
    }
};

/**
 * Updates stars.
 * @param {number} time Time since last update.
 */
StarManager.prototype.update = function (time) {
    for (var i = 0; i < this.stars.length; i++) {
        this.stars[i].update(time);
    }
};

/**
 * Creates new star at edge of screen.
 */
StarManager.prototype.createNewStar = function () {

    var sides = ["top", "bottom", "left", "right"];
    var side = sides[Math.floor(Math.random() * sides.length)];
    var position;

    if (side == "top")
        position = new Vector(Math.random() * windowSize.x, 0);
    else if (side == "bottom")
        position = new Vector(Math.random() * windowSize.x, windowSize.y);
    else if (side == "left")
        position = new Vector(0, Math.random()*windowSize.y);
    else if (side == "right")
        position = new Vector(windowSize.x, Math.random() * windowSize.y);

    this.stars.push(new Star(position, new Vector(0.09, 0.07), this.windowSize));
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a circular button.
 * @param {string} text Text for button to display.
 * @param {number} radius Radius of circle representing button.
 * @param {string} foregroundColor String representing color of button.
 * @param {string} highlightColor String representing color of button when highlighted.
 * @param {string} backgroundColor String representing color of button background.
 * @param {Vector} relativePosition Vector with x and y components between 0 and 1 representing button position relative to windowSize.
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function Button(text, radius, foregroundColor, highlightColor,
                backgroundColor, relativePosition, windowSize) {

    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * True if button was clicked.
     * @type {boolean}
     */
    this.clicked = false;

    /**
     * True if button is highlighted (mouse is over button).
     * @type {boolean}
     */
    this.highlighted = false;

    /**
     * Relative position of button within game window.
     * Vector has x and y components between 0 and 1.
     * Position is relative to windowSize.
     * @type {Vector}
     */
    this.relativePosition = relativePosition;

    /**
     * Actual position of button on screen.
     * @type {Vector}
     */
    this.position = new Vector(this.relativePosition.x * windowSize.x, this.relativePosition.y * windowSize.y);

    /**
     * Radius of circle representing button.
     * @type {number}
     */
    this.radius = radius;

    /**
     * Color of foreground (text and circle when button not highlighted).
     * @type {string}
     */
    this.foregroundColor = foregroundColor;

    /**
     * Background color of button.
     * @type {string}
     */
    this.backgroundColor = backgroundColor;

    /**
     * Color of button foreground when highlighted (text and circle when button is highlighted).
     * @type {string}
     */
    this.highlightColor = highlightColor;

    /**
     * Text to display on button.
     * @type {string}
     */
    this.text = text;

    /**
     * Size of font on button.
     * @type {number}
     */
    this.fontSize = 14;

    /**
     * Thickness of border around button.
     * @type {number}
     */
    this.edgeThickness = 5;
}

/**
 * Draws button.
 * @param {CanvasRenderingContext2D} ctx Context to draw button to.
 */
Button.prototype.draw = function (ctx) {
    //Draw background
    ctx.beginPath();
    ctx.fillStyle = this.backgroundColor;

    ctx.arc(this.relativePosition.x * windowSize.x, this.relativePosition.y * windowSize.y,
        this.radius, 0, 2 * Math.PI);

    ctx.closePath();
    ctx.fill();

    //Draw foreground
    ctx.beginPath();
    if (this.highlighted) ctx.strokeStyle = this.highlightColor;
    else ctx.strokeStyle = this.foregroundColor;
    ctx.lineWidth = this.edgeThickness;

    ctx.arc(this.relativePosition.x * windowSize.x, this.relativePosition.y*windowSize.y,
        this.radius, 0, 2 * Math.PI);

    ctx.closePath();
    ctx.stroke();

    //Draw text
    ctx.font = "bold " + this.fontSize + "px sans-serif";
    if (this.highlighted) ctx.fillStyle = this.highlightColor;
    else ctx.fillStyle = this.foregroundColor;
    var textMeasure = ctx.measureText(this.text);
    var singleLine = true;

    if(textMeasure.width > this.radius*2) {
        singleLine = false;
    }

    if (singleLine) {
        var textBox = createCenteredRectangle(this.relativePosition.x * windowSize.x,
            this.relativePosition.y * windowSize.y + 1.5 * this.fontSize / 4, textMeasure.width, 0);
        ctx.fillText(this.text, textBox.x, textBox.y);
    }
    if(!singleLine) {

        var words = this.text.split(" ");
        var width1 = ctx.measureText(words[0]).width;
        var width2 = ctx.measureText(words[1]).width;

        var textBox1 = createCenteredRectangle(this.relativePosition.x * windowSize.x,
            this.relativePosition.y * windowSize.y + 1.5 * this.fontSize / 4 - 6, width1, 0);

        var textBox2 = createCenteredRectangle(this.relativePosition.x * windowSize.x,
            this.relativePosition.y * windowSize.y + 1.5 * this.fontSize / 2 + 6, width2, 0);

        if (words.length == 2) {
            ctx.fillText(words[0], textBox1.x, textBox1.y);
            ctx.fillText(words[1], textBox2.x, textBox2.y);
        }
    }
};

/**
 * Updates button.
 * @param {UserInput} input User input.
 */
Button.prototype.update = function(input) {

    this.highlighted = this.position.distanceFrom(
        input.mousePosition) < this.radius;

    var clickPosition = input.getMouseClick();

    if (clickPosition != null && this.position.distanceFrom(
        clickPosition) < this.radius) {
        this.clicked = true;
    }
};

/**
 * Returns whether the button has been clicked
 * and sets this.clicked to false.
 * @returns {boolean} Whether the button has been clicked or not.
 */
Button.prototype.wasClicked = function() {
    if(this.clicked) {
        this.clicked = false;
        return true;
    }
    return false;
};

/* ---------------------------------------------------------------------- */



/**
 * Creates rectangular button.
 * @param {string} text Text for button to display.
 * @param {number} width Width of rectangle representing button.
 * @param {number} height Height of rectangle representing button.
 * @param {number} fontSize Size of font of button text.
 * @param {string} foregroundColor String representing color of button.
 * @param {string} highlightColor String representing color of button when highlighted.
 * @param {string} backgroundColor String representing color of button background.
 * @param {Vector} relativePosition Vector with x and y components between 0 and 1 representing button position relative to windowSize.
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */

function ButtonRect(text, width, height, fontSize, foregroundColor,
                    highlightColor, backgroundColor, relativePosition, windowSize) {

    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * True if button has been clicked.
     * @type {boolean}
     */
    this.clicked = false;

    /**
     * True if button is highlighted (mouse is over button).
     * @type {boolean}
     */
    this.highlighted = false;

    /**
     * Relative position of button within game window.
     * Vector has x and y components between 0 and 1.
     * Position is relative to windowSize.
     * @type {Vector}
     */
    this.relativePosition = relativePosition;

    /**
     * Actual position of button on screen.
     * @type {Vector}
     */
    this.position = new Vector(this.relativePosition.x * windowSize.x, this.relativePosition.y * windowSize.y);

    /**
     * Color of foreground (text and rectangle when button not highlighted).
     * @type {string}
     */
    this.foregroundColor = foregroundColor;

    /**
     * Background color of button.
     * @type {string}
     */
    this.backgroundColor = backgroundColor;

    /**
     * Color of button foreground when highlighted (text and rectangle when button is highlighted).
     * @type {string}
     */
    this.highlightColor = highlightColor;

    /**
     * Text to display on button.
     * @type {string}
     */
    this.text = text;

    /**
     * Size of font on button.
     * @type {number}
     */
    this.fontSize = fontSize;

    /**
     * Width of button rectangle.
     * @type {number}
     */
    this.width = width;

    /**
     * Height of button rectangle.
     * @type {number}
     */
    this.height = height;

    /**
     * Thickness of border around button.
     * @type {number}
     */
    this.edgeThickness = 5;

    /**
     * Rectangle corresponding to shape of button.
     * @type {Rectangle}
     */
    this.boundingBox = createCenteredRectangle(this.relativePosition.x * windowSize.x,
        this.relativePosition.y * windowSize.y, this.width, this.height);
}

/**
 * Draws button.
 * @param {CanvasRenderingContext2D} ctx Context to draw button to.
 */
ButtonRect.prototype.draw = function (ctx) {

    //Draw edge
    ctx.beginPath();
    ctx.fillStyle = this.foregroundColor;
    if (this.highlighted) ctx.fillStyle = this.highlightColor;
    ctx.rect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.w, this.boundingBox.h);
    ctx.closePath();
    ctx.fill();

    //Draw background
    ctx.beginPath();
    ctx.fillStyle = this.backgroundColor;
    ctx.rect(this.boundingBox.x + this.edgeThickness, this.boundingBox.y + this.edgeThickness, this.boundingBox.w - this.edgeThickness * 2, this.boundingBox.h - this.edgeThickness * 2);
    ctx.closePath();
    ctx.fill();


    //Draw text
    ctx.beginPath();
    ctx.fillStyle = this.foregroundColor;
    if (this.highlighted) ctx.fillStyle = this.highlightColor;
    var textMeasure = ctx.measureText(this.text);
    var textBox = createCenteredRectangle(this.relativePosition.x * windowSize.x, this.relativePosition.y * windowSize.y + 1.5 * this.fontSize / 4, textMeasure.width, 0);
    ctx.font = "bold " + this.fontSize + "px sans-serif";
    ctx.fillText(this.text, textBox.x, textBox.y);
    ctx.closePath();
    ctx.fill();
};

/**
 * Updates button.
 * @param {UserInput} input User input.
 */
ButtonRect.prototype.update = function (input) {
    this.highlighted = this.boundingBox.containsPoint(input.mousePosition);

    var clickPosition = input.getMouseClick();
    if (clickPosition != null && this.highlighted) {
        this.clicked = true;
    }
};

/**
 * Returns whether the button has been clicked
 * and sets this.clicked to false.
 * @returns {boolean} Whether the button has been clicked or not.
 */
ButtonRect.prototype.wasClicked = function () {
    if (this.clicked) {
        this.clicked = false;
        return true;
    }
    return false;
};

/* ---------------------------------------------------------------------- */



/**
 * Creates text which floats off screen.
 * Used for displaying points player earned.
 * and health player healed.
 * @param {string} text Text to display.
 * @param {string} color Hex string corresponding to color of text.
 * @param {string} font Name of font for text.
 * @param {number} size Size of font for text.
 * @param {number} speed Speed that text floats upwards.
 * @param {Vector} position Initial position of floating text.
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function FloatingText(text, color, font, size, speed, position, windowSize) {
    /**
     * Text to display.
     * @type {string}
     */
    this.text = text;

    /**
     * Hex string corresponding to color of text.
     * @type {string}
     */
    this.color = color;

    /**
     * Name of font for text.
     * @type {string}
     */
    this.font = font;

    /**
     * Size of font for text.
     * @type {number}
     */
    this.size = size;

    /**
     * Speed that text floats upwards.
     * @type {number}
     */
    this.speed = speed;

    /**
     * Position of floating text.
     * @type {Vector}
     */
    this.position = position;

    /**
     * True if text has floated off the screen.
     * @type {boolean}
     */
    this.outOfBounds = false;
}

/**
 * Draws floating text.
 * @param {CanvasRenderingContext2D} ctx Context to draw button to.
 */
FloatingText.prototype.draw = function (ctx) {
    if (!this.outOfBounds) {
        ctx.fillStyle = this.color;
        ctx.font = this.size + "px " + this.font;
        ctx.fillText(this.text, this.position.x, this.position.y);
    }
};

/**
 * Updates floating text by applying velocity
 * and checking if text is still on screen.
 * @param {number} time Time since last update (ms).
 */
FloatingText.prototype.update = function (time) {
    this.position.y += this.speed * time;

    if (this.position.y > windowSize.y || this.position.y < 0) {
        this.outOfBounds = true;
    }
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a label.
 * Labels are used to display text in menus.
 * @param {string} text Text to display.
 * @param {number} fontSize Font size of text.
 * @param {string} foregroundColor Hex string giving color of text.
 * @param {string} backgroundColor Hex string giving color of text shadow.
 * @param {Vector} relativePosition Relative position of label within game window (x and y components must be between 0 and 1).
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function Label(text, fontSize, foregroundColor, backgroundColor, relativePosition, windowSize) {

    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Relative position of label within game window.
     * Vector has x and y components between 0 and 1.
     * Position is relative to windowSize.
     * @type {Vector}
     */
    this.relativePosition = relativePosition;

    /**
     * Actual position of label on screen.
     * @type {Vector}
     */
    this.position = new Vector(this.relativePosition.x * windowSize.x, this.relativePosition.y * windowSize.y);


    /**
     * Hex string giving color of text.
     * @type {string}
     */
    this.foregroundColor = foregroundColor;

    /**
     * Hex string giving color of text shadow.
     * @type {string}
     */
    this.backgroundColor = backgroundColor;

    /**
     * Text to display.
     * @type {string}
     */
    this.text = text;

    /**
     * Font size to display text in.
     * @type {number}
     */
    this.fontSize = fontSize;
}

/**
 * Draws label.
 * @param {CanvasRenderingContext2D} ctx Context to draw label to.
 */
Label.prototype.draw = function (ctx) {

    var bgOffset = this.fontSize/40 * 3;
    ctx.fillStyle = this.backgroundColor;
    ctx.font = "bold " + this.fontSize + "px sans-serif";
    var textMeasure = ctx.measureText(this.text);
    var textBox = createCenteredRectangle(this.relativePosition.x * windowSize.x + bgOffset, this.relativePosition.y * windowSize.y + 1.5 * this.fontSize / 4 + bgOffset, textMeasure.width, 0);
    ctx.fillText(this.text, textBox.x, textBox.y);

    ctx.fillStyle = this.foregroundColor;
    ctx.font = "bold " + this.fontSize + "px sans-serif";
    textMeasure = ctx.measureText(this.text);
    textBox = createCenteredRectangle(this.relativePosition.x * windowSize.x, this.relativePosition.y * windowSize.y + 1.5 * this.fontSize / 4, textMeasure.width, 0);
    ctx.fillText(this.text, textBox.x, textBox.y);
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a menu box.
 * This is a box to draw which.
 * menu items are contained in.
 * @param {string} foregroundColor Hex string giving border color.
 * @param {string} backgroundColor Hex string giving background color.
 * @param {Vector} relativePosition Relative position of label within game window (x and y components must be between 0 and 1).
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function MenuBox(foregroundColor, backgroundColor, relativePosition, windowSize) {

    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Relative position of label within game window.
     * Vector has x and y components between 0 and 1.
     * Position is relative to windowSize.
     * @type {Vector}
     */
    this.relativePosition = relativePosition;

    /**
     * Rectangle giving bounds of menu box.
     * @type {Rectangle}
     */
    this.boundingBox = createCenteredRectangle(this.relativePosition.x * windowSize.x, this.relativePosition.y * windowSize.y, windowSize.x * 0.75, windowSize.y * 0.75);

    /**
     * Color of edge of menu box.
     * @type {string}
     */
    this.foregroundColor = foregroundColor;

    /**
     * Color of background of menu box.
     * @type {string}
     */
    this.backgroundColor = backgroundColor;
}

/**
 * Draws the menu box.
 * @param {CanvasRenderingContext2D} ctx Context to draw menu box to.
 */
MenuBox.prototype.draw = function (ctx) {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.w, this.boundingBox.h);
    var lineWidth = 5;
    ctx.fillStyle = this.foregroundColor;
    ctx.fillRect(this.boundingBox.x + lineWidth, this.boundingBox.y + lineWidth, this.boundingBox.w - lineWidth*2, this.boundingBox.h - lineWidth*2);
};

/* ---------------------------------------------------------------------- */



/**
 * Array index for points array in the Triangle object.
 * Corresponds to bottom left point of triangle.
 * @type {number}
 */
var TRIANGLE_POINT_LEFT = 0;

/**
 * Array index for points array in the Triangle object.
 * Corresponds to top point of triangle.
 * @type {number}
 */
var TRIANGLE_POINT_TOP = 1;

/**
 * Array index for points array in the Triangle object.
 * Corresponds to bottom right point of triangle.
 * @type {number}
 */
var TRIANGLE_POINT_RIGHT = 2;

/**
 * Creates a triangle.
 * Triangles are used to draw ships.
 * @param {number} base Length of base of triangle.
 * @param {number} height Height of triangle.
 * @param {string} color Hex string giving color of triangle.
 * @param {Vector} position Position of center of triangle.
 * @param {number} angularVelocity Angular velocity of triangle (radians/ms).
 * @param {Vector} windowSize Dimensions of game window.
 * @extends Sprite.
 * @constructor
 */
function Triangle(base, height, color, position, angularVelocity, windowSize) {

    Sprite.call(this, position, new Vector(0,0));

    /**
     * True if triangle is out of bounds.
     * @type {boolean}
     */
    this.outOfBounds = false;

    /**
     * Height of triangle.
     * @type {number}
     */
    this.height = height;

    /**
     * Length of base of triangle.
     * @type {number}
     */
    this.base = base;

    /**
     * Angular velocity of triangle (radians/ms).
     * @type {number}
     */
    this.angularVelocity = angularVelocity;

    /**
     * Rotation of triangle from original position (radians).
     * @type {number}
     */
    this.rotation = 0;

    /**
     * Color of triangle.
     * @type {string}
     */
    this.color = color;

    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Offset to draw triangle with from actual position.
     * @type {Vector}
     */
    this.offset = new Vector(0,0);

    /**
     * Array of points making up triangle.
     * @type {Array}
     */
    this.points = [];

    //Add points to triangle around centroid (this.position)
    if(this.position !== undefined) {
        this.points.push(new Vector(this.position.x - this.base/2, this.position.y + this.height/3));
        this.points.push(new Vector(this.position.x, this.position.y - 2*this.height/3));
        this.points.push(new Vector(this.position.x + this.base/2, this.position.y + this.height/3));
    }
}
Triangle.inheritsFrom(Sprite);

/**
 * Draws triangle.
 * @param {CanvasRenderingContext2D} ctx Context to draw triangle to.
 */
Triangle.prototype.draw = function (ctx) {
	
    ctx.fillStyle = "white";
    ctx.beginPath();

    ctx.moveTo(this.points[0].x - this.offset.x, this.points[0].y - this.offset.y);
    for (var i = 0; i < this.points.length; i += 1) {
        ctx.lineTo(this.points[i].x - this.offset.x, this.points[i].y - this.offset.y);
    }
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.strokeStyle = this.color;
    ctx.stroke();


    ctx.fillStyle = "white";
};

/**
 * Rotates points of triangle.
 * @param {number} degrees Angle to rotate points by (in degrees).
 */
Triangle.prototype.rotate = function (degrees) {

    var sinTheta = Math.sin(degrees * Math.PI / 180);
    var cosTheta = Math.cos(degrees * Math.PI / 180);
    for (var i = 0; i < this.points.length; i++) {

        var tmpX = cosTheta * (this.points[i].x - this.position.x) - sinTheta * (this.points[i].y - this.position.y) + this.position.x;
        var tmpY = sinTheta * (this.points[i].x - this.position.x) + cosTheta * (this.points[i].y - this.position.y) + this.position.y;

        this.points[i].x = tmpX;
        this.points[i].y = tmpY;

    }
};

/**
 * Updates triangle by applying necessary rotations
 * and translations to the points.
 * @param {number} time Time since last update (ms).
 */
Triangle.prototype.update = function (time) {

    this.rotate(this.angularVelocity * time);
    this.rotation += this.angularVelocity * time;

    if (this.rotation < 0)
        this.rotation = 360 + this.rotation;

    if (this.rotation > 360)
        this.rotation = this.rotation % 360;

    for (var i = 0; i < this.points.length; i++) {
        this.points[i].x += time * this.velocity.x;
        this.points[i].y += time * this.velocity.y;
    }

    Sprite.prototype.update.call(this, time);
};

/**
 * Sets position and translates points accordingly.
 * @param {Vector} p Vector to set position to.
 */
Triangle.prototype.setPosition = function (p) {
    var transform = new Vector(p.x - this.position.x, p.y - this.position.y);
    this.position = new Vector(this.position.x + transform.x, this.position.y + transform.y);
    for (var i = 0; i < this.points.length; i++) {
        this.points[i].x += transform.x;
        this.points[i].y += transform.y;
    }
};

/**
 * Checks if triangle contains point.
 * @param {Vector} p Point to check.
 * @returns {boolean} True if point contained in triangle.
 */
Triangle.prototype.containsPoint = function(p) {
    var maxX = this.points[0].x;
    var minX = this.points[0].x;
    var maxY = this.points[0].y;
    var minY = this.points[0].y;

    for (var i = 1; i < this.points.length; i++) {
        if (this.points[i].x > maxX) maxX = this.points[i].x;
        if (this.points[i].x < minX) minX = this.points[i].x;
        if (this.points[i].y > maxY) maxY = this.points[i].y;
        if (this.points[i].y < minY) minY = this.points[i].y;
    }

    var boundingBox = new Rectangle(minX, minY, maxX - minX, maxY - minY);

    return boundingBox.containsPoint(p);
};

/**
 * Checks if point is right of triangle.
 * @param {Vector} p Point to check.
 * @returns {boolean} True if point is right of triangle.
 */
Triangle.prototype.pointRightOf = function(p) {
    var leftDist = this.points[TRIANGLE_POINT_LEFT].distanceFrom(p);
    var rightDist = this.points[TRIANGLE_POINT_RIGHT].distanceFrom(p);
    return (rightDist > leftDist);
};

/**
 * Checks if point is above triangle.
 * @param {Vector} p Point to check.
 * @returns {boolean} True if point is above triangle.
 */
Triangle.prototype.pointAbove = function(p) {
    var topDist = this.points[TRIANGLE_POINT_TOP].distanceFrom(p);
    var bottomPoint = new Vector( (this.points[TRIANGLE_POINT_RIGHT].x +  this.points[TRIANGLE_POINT_LEFT].x)/2, (this.points[TRIANGLE_POINT_RIGHT].y +  this.points[TRIANGLE_POINT_LEFT].y)/2 );
    var bottomDist = bottomPoint.distanceFrom(p);
    return (topDist < bottomDist);
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a line segment.
 * Line segments are used launched as debris when
 * ships are destroyed.
 * @param {Vector} startPoint Starting point of line.
 * @param {Vector} endPoint Ending point of line.
 * @param {number} range How far the fragment can travel before disappearing.
 * @param {string} color Hex string giving color of line segment.
 * @param {Vector} velocity velocity of line segment.
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function LineSegment(startPoint, endPoint, range, color, velocity, windowSize) {
    /**
     * Midpoint of line segment.
     * @type {Vector}
     */
    this.midPoint = startPoint.getAdded(endPoint).getScaled(0.5);
    Sprite.call(this, this.midPoint, velocity);

    /**
     * Length of line segment.
     * @type {number}
     */
    this.length = Math.random() * 7;

    /**
     * True if line segment is no longer on the screen.
     * @type {boolean}
     */
    this.outOfBounds = false;

    /**
     * Angular velocity of line segment.
     * @type {number}
     */
    this.angularVelocity = 0.2;

    /**
     * Rotation of line segment for initial position.
     * @type {number}
     */
    this.rotation = 0;

    /**
     * Hex string giving color of line segment.
     * @type {string}
     */
    this.color = color;

    /**
     * Dimension of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * True if line segment was destroyed.
     * @type {boolean}
     */
    this.destroyed = false;

    /**
     * How far the fragment can travel before disappearing.
     * @type {number}
     */
    this.range = range;

    /**
     * How far the line segment has traveled so far.
     * @type {number}
     */
    this.distanceTraveled = 0;

    /**
     * Array of points making up line segment.
     * @type {Array}
     */
    this.points = [];

    this.points.push(new Vector(startPoint.x, startPoint.y));
    this.points.push(new Vector(endPoint.x, endPoint.y));
}

/**
 * Draws line segment.
 * @param {CanvasRenderingContext2D} ctx Drawing context.
 */
LineSegment.prototype.draw = function (ctx) {
    if (!this.destroyed) {
        ctx.fillStyle = "white";
        ctx.beginPath();

        ctx.moveTo(this.points[0].x - this.offset.x, this.points[0].y - this.offset.y);
        for (var i = 0; i < this.points.length; i += 1) {
            ctx.lineTo(this.points[i].x - this.offset.x, this.points[i].y - this.offset.y);
        }
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
};

/**
 * Updates line segment.
 * @param {number} time Time since last update.
 */
LineSegment.prototype.update = function (time) {
    if (!this.destroyed) {
        this.distanceTraveled += this.velocity.getScaled(time).getMagnitude();

        if (this.distanceTraveled > this.range) {
            this.destroyed = true;
        }

        this.rotate(this.angularVelocity * time);
        this.rotation += this.angularVelocity * time;

        for (var i = 0; i < this.points.length; i++) {
            this.points[i].x += time * this.velocity.x;
            this.points[i].y += time * this.velocity.y;
        }
        Sprite.prototype.update.call(this, time);
    }
};

/**
 * Rotates line segment by angle.
 * @param {number} degrees Degrees to rotate line segment by.
 */
LineSegment.prototype.rotate = function (degrees) {
    var sinTheta = Math.sin(degrees * Math.PI / 180);
    var cosTheta = Math.cos(degrees * Math.PI / 180);
    for (var i = 0; i < this.points.length; i++) {

        var tmpX = cosTheta * (this.points[i].x - this.position.x) - sinTheta * (this.points[i].y - this.position.y) + this.position.x;
        var tmpY = sinTheta * (this.points[i].x - this.position.x) + cosTheta * (this.points[i].y - this.position.y) + this.position.y;

        this.points[i].x = tmpX;
        this.points[i].y = tmpY;

    }
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a type of laser.
 * Used by ships to create lasers.
 * @param {number} damage Damage laser does when hitting another ship.
 * @param {number} speed Top speed of laser.
 * @param {number} cooldown Time (ms) ship must wait before being able to fire laser again.
 * @param {number} range Distance lasers can travel before being destroyed.
 * @param {number} radius Radius of circle representing laser.
 * @param {string} color Hex string giving color of laser.
 * @constructor
 */
function LaserType(damage, speed, cooldown, range, radius, color) {
    /**
     * Damage laser does when hitting another ship.
     * @type {number}
     */
    this.damage = damage;

    /**
     * Top speed of laser.
     * @type {number}
     */
    this.speed = speed;

    /**
     * Time ship must wait before being able to fire laser again.
     * @type {number}
     */
    this.cooldown = cooldown;

    /**
     * Distance lasers can travel before being destroyed.
     * @type {number}
     */
    this.range = range;

    /**
     * Radius of circle representing laser.
     * @type {number}
     */
    this.radius = radius;

    /**
     * Hex string giving color of laser.
     * @type {string}
     */
    this.color = color;

    /**
     * Time (ms) since laser was last fired.
     * @type {number}
     */
    this.timeSinceLastFire = 0;

    /**
     * True if laser is ready to be fired.
     * @type {boolean}
     */
    this.readyToFire = true;
}

/**
 * Creates a laser at an appropriate position to be fired from a given ship.
 * @param {Ship} ship Ship to fire laser.
 * @param {boolean} isPlayerOne True if ship is player one.
 * @returns {Laser} Laser to be fired.
 */
LaserType.prototype.launchFromShip = function (ship, isPlayerOne) {
    if (this.readyToFire) {
        this.timeSinceLastFire = 0;
        this.readyToFire = false;

        return new Laser(isPlayerOne, this.damage, this.speed,
            this.range, this.radius, this.color,
            ship.points[TRIANGLE_POINT_TOP].getAdded(ship.direction.getScaled(5)),
            ship.direction, ship.windowSize);
    }
    return null;
};

/**
 * Updates LaserType by counting time since last fire and
 * setting the weapon to be ready to fire when cooldown expires.
 * @param {number} time Time since last update.
 */
LaserType.prototype.update = function (time) {
    this.timeSinceLastFire += time;
    if (this.timeSinceLastFire > this.cooldown) this.readyToFire = true;
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a laser.
 * Lasers are fired from ships and do damage to other ships.
 * @param {boolean} fromPlayerOne True if laser was fired by player 1.
 * @param {number} damage Damage laser will do on contact with another ship.
 * @param {number} speed Maximum speed of laser.
 * @param {number} range Distance laser can travel before being destroyed.
 * @param {number} radius Radius of circle representing laser.
 * @param {string} color Hex string giving color of laser.
 * @param {Vector} position Initial position of laser.
 * @param {Vector} direction Vector in direction of direction laser should move.
 * @param {Vector} windowSize Dimensions of game window.
 * @extends {Sprite}
 * @constructor
 */
function Laser(fromPlayerOne, damage, speed, range, radius, color, position, direction, windowSize) {

    this.direction = direction.getNormalized();
    this.damage = damage;
    this.speed = speed;
    this.fromPlayerOne = fromPlayerOne;
    Sprite.call(this, position, direction.getScaled(this.speed));
    
    this.range = range;
    this.radius = radius;
    this.color = color;
    this.windowSize = windowSize;
    this.distanceTraveled = 0;
    this.destroyed = false;
}
Laser.inheritsFrom(Sprite);

/**
 * Draws laser.
 * @param {CanvasRenderingContext2D} ctx Drawing context.
 */
Laser.prototype.draw = function (ctx) {
    if (!this.destroyed) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.position.x - this.offset.x, this.position.y - this.offset.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
};

/**
 * Updates laser.
 * @param {number} time Time since last update (ms).
 */
Laser.prototype.update = function (time) {
    if (!this.destroyed) {
        Sprite.prototype.update.call(this, time);
        this.distanceTraveled += this.velocity.getScaled(time).getMagnitude();

        if (this.distanceTraveled > this.range)
            this.destroyed = true;
    }
};

/**
 * Causes laser to damage ship.
 * Reduces ship health and flags laser as destroyed.
 * @param {Ship} ship Ship to damage.
 */
Laser.prototype.damageShip = function (ship) {
    if (!this.destroyed) {
        ship.health -= this.damage;
        this.destroyed = true;
    }
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a repair kit.
 * Players can collect repair kits to restore health.
 * @param {number} healing Amount to increase health by.
 * @param {number} radius Radius of circle representing repair kit.
 * @param {string} color Hex string giving color of repair kit.
 * @param {Vector} position Position of repair kit.
 * @param {Vector} windowSize Dimensions of game window.
 * @extends {Sprite}
 * @constructor
 */
function RepairKit(healing, radius, color, position, windowSize) {
    Sprite.call(this, position, new Vector(0,0));

    /**
     * Amount to increase player health by when collected.
     * @type {number}
     */
    this.healing = healing;

    /**
     * Radius of repair kit circle.
     * @type {number}
     */
    this.radius = radius;

    /**
     * Initial radius of repair kit.
     * Repair kit grows to reach the actual radius after it is created.
     * @type {number}
     */
    this.currentRadius = 0;

    /**
     * Hex string giving color of repair kit.
     * @type {string}
     */
    this.color = color;

    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * True if repair kit was collected and no longer exists.
     * @type {boolean}
     */
    this.destroyed = false;
}
RepairKit.inheritsFrom(Sprite);

/**
 * Draws repair kit.
 * @param {CanvasRenderingContext2D} ctx Drawing context of canvas.
 */
RepairKit.prototype.draw = function (ctx) {
    if (!this.destroyed) {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        ctx.arc(this.position.x - this.offset.x, this.position.y - this.offset.y, this.currentRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
};

/**
 * Updates repair kit.
 * @param {number} time Time since last update.
 */
RepairKit.prototype.update = function (time) {

    if(this.currentRadius < this.radius) {
        this.currentRadius += 0.001*this.radius*time;
    }

    if (!this.destroyed) {
        Sprite.prototype.update.call(this, time);
    }
};

/**
 * Uses repair kit to heal ship.
 * Restores ship's health and sets repair kit as destroyed.
 * @param {Ship} ship Ship to heal.
 */
RepairKit.prototype.healShip = function (ship) {
    if (!this.destroyed) {
        ship.health += this.healing;

        if (ship.health > ship.maxHealth)
            ship.health = ship.maxHealth;

        this.destroyed = true;
    }
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a ship.
 * @param {number} topSpeed Maximum speed the ship is allowed to travel.
 * @param {number} health Maximum health of ship.
 * @param {LaserType} laserType Type of laser ship can fire.
 * @param {number} base Triangle base length of ship.
 * @param {number} height Triangle height of ship.
 * @param {string} color Hex string giving color of ship.
 * @param {Vector} position Initial position of ship.
 * @param {Vector} direction Direction of ship.
 * @param {number} angularVelocity Initial angular velocity of ship.
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function Ship(topSpeed, health, laserType, base, height, color, position, direction, angularVelocity, windowSize) {

    Triangle.call(this, base, height, color, position, angularVelocity, windowSize);

    this.speed = topSpeed;
    this.topSpeed = topSpeed;
    this.maxHealth = health;
    this.health = health;
    this.direction = direction;
    this.destroyed = false;
    this.topAngularVelocity = angularVelocity;
    this.firedLasers = [];
    this.lineFragments = [];
    this.laserType = laserType;
    this.windowSize = windowSize;
}
Ship.inheritsFrom(Triangle);

/**
 * Draws ship.
 * @param {CanvasRenderingContext2D} ctx Drawing context of canvas.
 */
Ship.prototype.draw = function (ctx) {
    if (!this.destroyed) {
        Triangle.prototype.draw.call(this, ctx);
    }
};

/**
 * Updates the ship.
 * @param {number} time Time since last update (ms).
 */
Ship.prototype.update = function (time) {

    if (!this.destroyed) {
        this.direction = new Vector(Math.sin(this.rotation * Math.PI / 180),
            -Math.cos(this.rotation * Math.PI / 180)).getNormalized();
        this.velocity = this.direction.getScaled(this.speed);
        this.laserType.update(time);
        Triangle.prototype.update.call(this, time);
    }

    if (!this.destroyed && this.health <= 0) {
        this.kill();
    }

};

/**
 * Fires laser by pushing laser into firedLasers array.
 * The game then later pops the lasers from this array and
 * adds them to the actual game.
 * @param {boolean} isPlayer True if the laser is from the player.
 */
Ship.prototype.fireLaser = function(isPlayer) {
    this.firedLasers.push(this.laserType.launchFromShip(this, isPlayer));
};

/**
 * Generates a random velocity that can be used by a line fragment.
 * @returns {Vector} random velocity vector.
 */
Ship.prototype.getRandomFragmentVelocity = function() {
    var vec = new Vector(Math.random(), Math.random());
    vec = vec.getNormalized().getScaled(this.topSpeed*1.5);
    if(Math.random() > 0.5) vec.x *= -1;
    if (Math.random() > 0.5) vec.y *= -1;
    return vec;
};

/**
 * Adds line fragments to the lineFragments array.
 * The game later pops these line fragments from this array.
 * and adds them to the actual game.
 * @param {number} num Number of line fragments to create.
 */
Ship.prototype.produceLineFragments = function (num) {

    for (var i = 0; i < num; i++) {
        var newVelocity = this.getRandomFragmentVelocity();
        this.lineFragments.push(new LineSegment(this.points[0], this.points[1], 1300, this.color, newVelocity, this.windowSize));

        newVelocity = this.getRandomFragmentVelocity();
        this.lineFragments.push(new LineSegment(this.points[1], this.points[2], 1300, this.color, newVelocity, this.windowSize));

        newVelocity = this.getRandomFragmentVelocity();
        this.lineFragments.push(new LineSegment(this.points[2], this.points[0], 1300, this.color, newVelocity, this.windowSize));
    }
};

/**
 * Determines if the ship has been hit by a given laser.
 * @param {Laser} laser Laser to check.
 * @returns {boolean} True if player is colliding with laser.
 */
Ship.prototype.isHit = function (laser) {
    return this.containsPoint(laser.position);
};

/**
 * Immediately kills ship
 */
Ship.prototype.kill = function () {
    this.health = 0;
    this.destroyed = true;
    this.produceLineFragments(3);
};


/**
 * Creates a player.
 * @param {boolean} drawCentered True if the player should be drawn in the center of the screen.
 * @param {number} playerNum Number of the player. ie player 1 or player 2.
 * @param {number} topSpeed Maximum speed the player is allowed to travel.
 * @param {number} health Maximum health of player.
 * @param {LaserType} laserType Type of laser player can fire.
 * @param {number} base Triangle base length of player's ship.
 * @param {number} height Triangle height of player's ship.
 * @param {string} color Hex string giving color of player's ship.
 * @param {Vector} velocity Velocity of player.
 * @param {number} topAngularVelocity Maximum angular velocity the player may have.
 * @param {Vector} windowSize Dimensions of game window.
 * @extends {Ship}
 * @constructor
 */
function Player(drawCentered, playerNum, topSpeed, health, laserType, base, height, color, velocity, topAngularVelocity, windowSize) {

    var position = new Vector(windowSize.x / 2, windowSize.y / 2);
    this.initialPosition = new Vector(windowSize.x / 2, windowSize.y / 2);
    this.displacement = new Vector(0, 0);
    this.playerNum = playerNum;
    if (!drawCentered) {
        position = new Vector(windowSize.x * Math.random(), windowSize.y * Math.random());
    }


    Ship.prototype.constructor.call(this, topSpeed, health, laserType, base, height, color, position, velocity, topAngularVelocity, windowSize);
    this.angularVelocity = 0;
    this.drawCentered = drawCentered;

    this.displayedHealth = this.health;
}
Player.inheritsFrom(Ship);

/**
 * Draws player's health bar.
 * @param {CanvasRenderingContext2D} ctx Drawing context of canvas.
 */
Player.prototype.drawHealthBar = function (ctx) {

    var xPoint = 20;
    if(this.playerNum == 1) xPoint = 20;
    if(this.playerNum == 2) xPoint = this.windowSize.x - 330;

    ctx.beginPath();
    ctx.fillStyle = "#777";
    ctx.rect(xPoint, this.windowSize.y - 30, 300, 10);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(xPoint, this.windowSize.y - 30, 300* this.displayedHealth/this.maxHealth, 10);
    ctx.closePath();
    ctx.fill();
};

/**
 * Draws player's ship and health bar.
 * @param {CanvasRenderingContext2D} ctx Drawing context of canvas.
 */
Player.prototype.draw = function (ctx) {
    Ship.prototype.draw.call(this, ctx);
    this.drawHealthBar(ctx);
};

/**
 * Updates player's ship.
 * @param {number} time Time since last update (ms).
 * @param {UserInput} input Input from player.
 */
Player.prototype.update = function (time, input) {

    if (!this.destroyed) {
        this.velocity = this.direction.getScaled(this.speed);
        this.displacement = new Vector(this.displacement.x + this.velocity.x * time, this.displacement.y + this.velocity.y * time);//(this.virtualVelocity.getScaled(time));
        Ship.prototype.update.call(this, time);

        if (this.drawCentered) {
            this.offset = this.displacement;
        }
        else {
            this.offset = new Vector(0, 0);
            this.displacement = new Vector(0, 0);
        }

        if (this.displayedHealth < this.health) {
            this.displayedHealth += 0.08 * time;
        }

        if (this.displayedHealth > this.health) {
            this.displayedHealth -= 0.08 * time;
        }

        this.laserType.update(time);

        //Prevent from moving off screen if not being drawn in centered mode
        if (!this.drawCentered) {
            var edge = 50;
            if (this.position.x < edge) this.setPosition(new Vector(edge, this.position.y));
            else if (this.position.x > this.windowSize.x - edge) this.setPosition(new Vector(this.windowSize.x - edge, this.position.y));
            if (this.position.y < edge) this.setPosition(new Vector(this.position.x, edge));
            else if (this.position.y > this.windowSize.y - edge) this.setPosition(new Vector(this.position.x, this.windowSize.y - edge));
        }

        //Check input
        if (this.playerNum == 1 && input.isKeyDown(KEY_A) || this.playerNum == 2 && input.isKeyDown(KEY_LEFT)) {
            this.angularVelocity = -this.topAngularVelocity;
        } else if (this.playerNum == 1 && input.isKeyDown(KEY_D) || this.playerNum == 2 && input.isKeyDown(KEY_RIGHT)) {
            this.angularVelocity = this.topAngularVelocity;
        } else {
            if (Math.abs(this.angularVelocity) > 0.01) {
                if (this.angularVelocity > 0) this.angularVelocity -= 0.0006 * time;
                else this.angularVelocity += 0.0006 * time;
            } else {
                this.angularVelocity = 0;
            }
        }

        if (this.playerNum == 1 && input.isKeyDown(KEY_W) || this.playerNum == 2 && input.isKeyDown(KEY_UP)) {
            this.speed = this.topSpeed;
        } else if (this.playerNum == 1 && input.isKeyDown(KEY_S) || this.playerNum == 2 && input.isKeyDown(KEY_DOWN)) {
            this.speed = -this.topSpeed;
        } else {
            if (this.speed > 0) {
                this.speed -= 0.001 * time;
            } else {
                this.speed = 0;
            }
        }

        if (this.playerNum == 1 && input.isKeyDown(KEY_SPACE) || this.playerNum == 2 && input.isKeyDown(KEY_ENTER)) {
            if (this.laserType.readyToFire) {
                if (this.playerNum == 1)
                    this.fireLaser(true);
                else
                    this.fireLaser(false);
            }
        }

        if (input.isKeyDown(KEY_X)) {
            if (!this.destroyed) {
                this.kill();
            }
        }
    }
};

/* ---------------------------------------------------------------------- */



/**
 * Creates an enemy ship.
 * @param {number} value Points player gains by destroying ship.
 * @param {number} topSpeed Maximum speed the enemy is allowed to travel.
 * @param {number} topAngularSpeed Maximum angular velocity the enemy may have.
 * @param {number} health Maximum health of enemy.
 * @param {LaserType} laserType Type of laser enemy can fire.
 * @param {number} base Triangle base length of enemy's ship.
 * @param {number} height Triangle height of enemy's ship.
 * @param {string} color Hex string giving color of enemy ship.
 * @param {Vector} direction Direction of enemy ship.
 * @param {Vector} position Initial position of enemy ship.
 * @param {number} angularVelocity Initial angular velocity of enemy ship.
 * @param {Vector} windowSize Dimensions of game window.
 * @extends {Ship}
 * @constructor
 */
function Enemy(value, topSpeed, topAngularSpeed, health, laserType, base,
               height, color, position, direction, angularVelocity, windowSize) {

    Ship.prototype.constructor.call(this, topSpeed, health, laserType, base, height,
        color, position, direction, angularVelocity, windowSize);

    this.aiThinkTimer = new GameTimer(100 + 100 * Math.random());

    this.angularVelocity = 0.16;
    this.topAngularSpeed = topAngularSpeed;
    this.topSpeed = topSpeed;
    this.speed = 0.05;
    this.value = value;
}
Enemy.inheritsFrom(Ship);

/**
 * Draws enemy ship.
 * @param {CanvasRenderingContext2D} ctx Drawing context of canvas.
 */
Enemy.prototype.draw = function (ctx) {
    Ship.prototype.draw.call(this, ctx);
};

/**
 * Updates enemy ship.
 * @param {number} time Time since last update.
 * @param {Ship} player Player's ship.
 */
Enemy.prototype.update = function (time, player) {

    if (!this.destroyed) {
        Ship.prototype.update.call(this, time);

        this.aiThinkTimer.update(time);

        if (this.aiThinkTimer.finished) {

            var dist = new Vector(this.position.x - player.position.x, this.position.y - player.position.y);
            var distAngle = dist.getAngle();
            var angleDif = this.rotation - distAngle + 180;
            if (angleDif > 180) angleDif = angleDif - 360;
            if (angleDif < -180) angleDif = angleDif + 360;

            var allowableOffset = 0;
            var turnLeft = !(angleDif >= -90 + allowableOffset && angleDif <= 90 - allowableOffset);
            var turnRight = !(angleDif >= 90 + allowableOffset || angleDif <= -90 - allowableOffset);

            if (turnLeft)
                this.angularVelocity = -this.topAngularSpeed;
            else if (turnRight)
                this.angularVelocity = this.topAngularSpeed;
            else
                this.angularVelocity = 0;
            this.speed = this.topSpeed;

            if (dist.getMagnitude() < this.laserType.range && Math.abs(Math.abs(angleDif) - 90) < 30)
                if (!player.destroyed && this.laserType.readyToFire)
                    this.fireLaser(false);

            this.aiThinkTimer.reset();
        }
    }
};
