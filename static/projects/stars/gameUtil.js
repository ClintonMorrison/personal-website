/* Author: Clinton Morrison
 * Date: July 2
 *
 * This file contains various objects used in the other JavaScript files
 * which are useful in general.
 */

//Create vector
function Vector(x, y) {
    this.x = x;
    this.y = y;

    this.vectorFrom = function (v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    this.getNormalized = function () {
        var magnitude = Math.sqrt(this.x * this.x + this.y * this.y);

        if (magnitude == 0.0)
            return new Vector(0, 0);

        return new Vector(this.x / magnitude, this.y / magnitude);
    }

    this.getScaled = function (k) {
        return new Vector(this.x * k, this.y * k);
    }

    this.toString = function () {
        return ("(" + x + ", " + y + ")");
    }

    this.getMagnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    this.add = function(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    this.getAdded = function (vec) {
        var u = new Vector(this.x + vec.x, this.y + vec.y);
        return u;
    }

    this.distanceFrom = function(vec) {
        var s = new Vector(this.x - vec.x, this.y-vec.y);
        var dist = Math.sqrt(s.x*s.x + s.y*s.y);
        return dist;
    }
}




//Creates a color
function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;

    //Converts color to hex code
    this.toString = function () {
        var rStr = this.r.toString(16);
        if (rStr.length < 2) rStr = "0" + rStr;

        var gStr = this.g.toString(16);
        if (gStr.length < 2) gStr = "0" + gStr;

        var bStr = this.b.toString(16);
        if (bStr.length < 2) bStr = "0" + bStr;

        return "#" + rStr + gStr + bStr;

    }
}



//Creates a rectangle
function Rectangle(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    //Checks if the rectangle contains a point
    this.containsPoint = function (p) {
        if (p.x >= this.x && p.x <= this.x + this.w && p.y >= this.y && p.y <= this.y + this.h)
            return true;
        else
            return false;
    }
}

//Creates centered rectangle (centered at a point (x,y) )
function createCeneteredRectangle(centX, centY, w, h) {
    return new Rectangle(centX - w / 2, centY - h / 2, w, h);
}


//Keeps track of user input
function UserInput() {

    this.mouseClicks = new Array();
    this.mousePosition = new Vector(0, 0);
    this.mouseDown = false;

    this.keysDown = new Array();

    //Records a mouse click event
    this.onMouseClick = function(mouseClickPosition) {
        this.mouseClicks[0] = mouseClickPosition;
    }

    //Records the most recent mouse position
    this.onMouseMove = function (mousePosition) {
        this.mousePosition = mousePosition;
    }

    //Gets a mouse click
    this.getMouseClick = function () {
        if (this.mouseClicks.length > 0) {
            var p = this.mouseClicks[0];
            //this.mouseClicks.splice(0, 1);
            return p;
        }
        else return null;
    }

    this.clearMouseClicks = function() {
        this.mouseClicks = new Array();
    }

    this.onKeyDown = function(keyCode) {
        if(this.keysDown.indexOf(keyCode) == -1) {
            this.keysDown.push(keyCode);
            console.log("Key down! -> " + event.keyCode.toString());
        }
    }

    this.onKeyUp = function (keyCode) {
        var index = this.keysDown.indexOf(keyCode);
        if (index != -1) {
            this.keysDown.splice(index, 1);
            console.log("Key up! -> " + event.keyCode.toString());
        }
    }

    this.onMouseDown = function () {
        this.mouseDown = true;
    }

    this.onMouseUp = function () {
        this.mouseDown = false;
    }


    this.isKeyDown = function (keyCode) {
        return (this.keysDown.indexOf(keyCode) != -1);
    }

}


//Creates a game timer
function GameTimer(updateTime) {

    this.elapsedTime = 0;
    this.updateTime = updateTime;
    this.finished = false;

    this.update = function (time) {
        this.elapsedTime += time;
        
        if (this.elapsedTime > this.updateTime) {
            this.finished = true;
        }
    }

    this.reset = function () {
        this.elapsedTime -= this.updateTime;
        this.finished = false;
    }

}



//Creates a sprite
function Sprite(position, velocity) {

    this.position = position;
    this.velocity = velocity;
    this.offset = new Vector(0, 0);

    this.update = function (time) {
        this.position.x += this.velocity.x * time;
        this.position.y += this.velocity.y * time;
    }

}

function createRandomHexColor() { 
    var nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

    var n1 = 0;
    var n2 = 0;
    var n3 = 0;

    while(n1 + n2 + n3 < 30) {
        n1 = Math.floor(Math.random() * nums.length);
        n2 = Math.floor(Math.random() * nums.length);
        n3 = Math.floor(Math.random() * nums.length);
    }

    var col = "#" + nums[n1] + nums[n2] + nums[n3];
	return col;
}

var brightColors = ["#F00", "#0F0", "#00F", "#FF0", "#F0F", "#0FF"];
function createBrightColor() {
    return brightColors[Math.floor(Math.random() * brightColors.length)];
}

//Creates a star
function Star(position, velocity, windowSize) {

    Sprite.call(this, position, velocity);
    this.maxLength = 4;
    this.length = Math.random() * this.maxLength;
    this.outOfBounds = false;
    this.color = "white";
    this.brightColor = createBrightColor();
    this.colorMode = false;
    this.drawingPosition = new Vector(0, 0);
    this.shake = false;
    this.windowSize = windowSize;
    this.approachSpeed = 0.0;
	
    this.setShake = function(shake) {
        this.shake = shake;
    }


    this.velocity = this.velocity.getScaled(this.length / this.maxLength);
	this.z = this.length / this.maxLength;

    this.draw = function (ctx) {
        this.drawingPosition = new Vector(this.position.x - this.offset.x * this.length / this.maxLength, this.position.y - this.offset.y * this.length / this.maxLength);
        //if (this.drawingPosition.x > 0 && this.drawingPosition.x < windowSize.x && this.drawingPosition.y > 0 && this.drawingPosition.y < windowSize.y) { //|| this.drawingPosition.y > 0 && this.drawingPosition.y < windowSize.y) {
            ctx.fillStyle = this.color;
            
            if (this.colorMode) {
                ctx.fillStyle = this.brightColor;
            }

			//console.log(this.windowSize);
            var screenX = this.drawingPosition.x;
            var screenY = this.drawingPosition.y;
            
            var allowableOffset = 0;
            while (screenX < -allowableOffset) screenX += this.windowSize.x;
            while (screenX > this.windowSize.x + allowableOffset) screenX -= this.windowSize.x;

            while (screenY < allowableOffset) screenY += this.windowSize.y;
            while (screenY > this.windowSize.y - allowableOffset) screenY -= this.windowSize.y;
            
            while (this.length > this.maxLength) this.length -= this.maxLength;

            if (this.shake) {
                screenX += Math.random() * 5;
                screenY += Math.random() * 5;
            }

            ctx.fillRect(screenX, screenY, this.length, this.length);
        //} 
    }

    var superUpdate = this.update;
    this.update = function (time, newWindowSize) {
			this.windowSize = newWindowSize;
            //superUpdate.call(this, time);
            this.position.x += this.velocity.getScaled(this.length / this.maxLength).x;
            this.position.y += this.velocity.getScaled(this.length / this.maxLength).y;
            this.length += this.approachSpeed * time;
            

        if (this.position.x  < 0 || this.position.x > this.windowSize.x
            || this.position.y < 0 || this.position.y > this.windowSize.y) {
            this.outOfBounds = true;
        }
    }
}


//Creates a star manager (for main menu background)
function StarManager(windowSize) {

    this.stars = new Array();
    this.windowSize = windowSize;
    this.starDensity = 0.0002;


    //Create a new set of stars
    this.createStars = function() {
        this.stars = new Array();
        var starCount = this.windowSize.x * this.windowSize.y * this.starDensity;

        if(starCount < 50) starCount = 50;

        for (var i = 0; i < starCount; i++) {
            this.stars.push(new Star(new Vector(Math.random()*this.windowSize.x, Math.random()*this.windowSize.y), new Vector(0.09, 0.07), this.windowSize));
        }

    }


    //Draw stars
    this.draw = function (ctx) {
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].draw(ctx);
        }
    }

    //Update stars
    this.update = function (time, newWindowSize) {

        if(this.windowSize.x != newWindowSize.x || this.windowSize.y != newWindowSize.y){
            this.windowSize = newWindowSize;
            this.createStars();
        }

		this.windowSize = newWindowSize;
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].update(time, newWindowSize);
        }
    }

    //Create new star on edge of screen
    this.createNewStar = function () {

        var sides = ["top", "bottom", "left", "right"];
        var side = sides[Math.floor(Math.random() * sides.length)];
        var position;
        if (side == "top")
            position = new Vector(Math.random() * this.windowSize.x, 0);   
        else if (side == "bottom")
            position = new Vector(Math.random() * this.windowSize.x, this.windowSize.y);
        else if (side == "left")
            position = new Vector(0, Math.random()*this.windowSize.y);
        else if (side == "right")
            position = new Vector(this.windowSize.x, Math.random() * this.windowSize.y);

        this.stars.push(new Star(position, new Vector(0.09, 0.07), this.windowSize));
    }

    //Set velocity of all stars
    this.setVelocity = function(v) {
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].velocity = v;
        }
    }

    //Set approach speed of all stars
    this.setApproachSpeed = function (s) {
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].approachSpeed = s;
        }
    }

    //Set approach speed of all stars
    this.setShake = function (s) {
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].setShake(s);
        }
    }

    //Set approach speed of all stars
    this.setColorMode = function (c) {
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].colorMode = c;
        }
    }



    this.createStars();
}



