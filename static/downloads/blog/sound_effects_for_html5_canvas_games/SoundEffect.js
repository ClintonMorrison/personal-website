//Object used to load and play sound effects simultaneously
function SoundEffect(filename) { 
    this.filename = filename; 
    this.sounds = new Array(); 

    for(var i = 0; i < 10; i++)
        this.sounds.push(new Audio(filename));
		
    this.indexToPlay = 0;
}

SoundEffect.prototype.play = function () {
    this.sounds[this.indexToPlay].play();
    this.indexToPlay++;
    if (this.indexToPlay > this.sounds.length - 1)
        this.indexToPlay = 0;
}

//Create and play a sound effect
var laserSound = new SoundEffect("sounds\\laser.wav");
laserSound.play();