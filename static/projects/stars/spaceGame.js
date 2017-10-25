/* Author: Clinton Morrison
 * Date: July 2
 *
 * This file implements the content of the game that describes what specifically
 * should be drawn and updated for this space game
 */




//Create an instance of a game
function Game(ctx, windowSize) {

    this.windowSize = windowSize;

    this.score = 0;    
    this.stars = new StarManager(this.windowSize);

    //Draws the game
    this.draw = function(ctx){
    	this.stars.draw(ctx);

    
    }

    this.starVelocity = new Vector(0,0);
    var colored = false;
    //Updates the game
    this.update = function(time, input, newWindowSize){
		this.stars.update(time, newWindowSize);

        if(input.mousePosition.distanceFrom(newWindowSize.getScaled(0.5)) > newWindowSize.getMagnitude()*0.01) {
            var v = new Vector(newWindowSize.getScaled(0.5).x - input.mousePosition.x, -newWindowSize.getScaled(0.5).y + input.mousePosition.y);
            v.y *= -1;
            this.stars.setVelocity(v.getScaled(.02));
        }    else {
        }

        if (input.getMouseClick() != null) {
            colored = ! colored;
            this.stars.setColorMode(colored);
            input.clearMouseClicks();

        } else {
        }


    }

}


