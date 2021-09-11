/**
 * @fileOverview This file implements the content of the game that 
 * describes what specifically should be drawn and updated for 
 * this game. This file was created by Clinton Morrison on June 30, 2013.
 *
 * @name spaceGame.js
 * @author Clinton Morrison
 */

 
 // TODO:
 // - Add high score system to game
 // - Add more enemies
 // - Add menus to submit and view high scores

/* ---------------------------------------------------------------------- */

/**
 * Creates a music manager to manage game music.
 * @constructor
 */
function MusicManager() {

    /**
     * True if music is enabled.
     * @type {boolean}
     */
    this.musicOn = true;

    /**
     * True if user is currently in a menu.
     * @type {boolean}
     */
    this.inMenu = true;

    /**
     * Music to play when user is in menu.
     * @type {HTMLElement}
     */
    this.menuMusic = document.getElementById("menuMusic");

    /**
     * Music to play when user is playing game.
     * @type {HTMLElement}
     */
    this.gameMusic = document.getElementById("gameMusic");
    this.gameMusic.muted = "muted";
}

/**
 * Mutes game music.
 */
MusicManager.prototype.toggleMute = function () {
    this.musicOn = !this.musicOn;
    if (!this.musicOn) {
        this.menuMusic.muted = "muted";
        this.gameMusic.muted = "muted";
    } else {
        if(this.inMenu) this.menuMusic.muted = "";
        else this.gameMusic.muted = "";
    }
};

/**
 * Plays music intended for game menus.
 */
MusicManager.prototype.playMenuMusic = function () {
    this.inMenu = true;
    if (this.musicOn) {
        this.menuMusic.muted = "";
    }
    this.gameMusic.muted = "muted";
};

/**
 * Plays music intended for game play.
 */
MusicManager.prototype.playGameMusic = function () {
    this.inMenu = false;
    this.menuMusic.muted = "muted";
    if (this.musicOn) {
        this.gameMusic.muted = "";
    }
};

/* ---------------------------------------------------------------------- */



/**
 * Creates a sound effect which can be played multiple times concurrently.
 * @param {string} filename Name of sound file.
 * @constructor
 */
function SoundEffect(filename) {
    /**
     * Filename of sound effect.
     * @type {string}
     */
    this.filename = filename;

    /**
     * Array of copies of audio to use to play sound effect multiple times at once.
     * @type {Array}
     */
    this.sounds = [];

    /**
     * True if sound is enabled.
     * @type {boolean}
     */
    this.soundOn = true;

    for(var i = 0; i < 4; i++)
        this.sounds.push(new Audio(this.filename));

    /**
     * Index corresponding to Audio element in sounds array that should
     * be played next.
     * @type {number}
     */
    this.indexToPlay = 0;
}

/**
 * Plays an instance of this sound effect.
 */
SoundEffect.prototype.play = function () {
    if (this.soundOn) {
        console.log("Playing sound:", this.filename);
        this.sounds[this.indexToPlay].play();
        this.indexToPlay++;
        if (this.indexToPlay > this.sounds.length - 1) {
            this.indexToPlay = 0;
        }
    }
};

/* ---------------------------------------------------------------------- */


/**
 * Creates SoundManager.
 * Acts as container for all game sound effects.
 * @constructor
 */
function SoundManager() {
    /**
     * True if sound is enabled.
     * @type {boolean}
     */
    this.soundOn = true;

    /**
     * Sound effect to be played when lasers are fired.
     * @type {SoundEffect}
     */
    this.laserSound = new SoundEffect("/static/projects/space_defender/laser.wav");

    /**
     * Sound effect to be played when a ship takes damage.
     * @type {SoundEffect}
     */
    this.damageSound = new SoundEffect("/static/projects/space_defender/hurt.wav");

    /**
     * Sound effect to play when a ship collects a repair kit.
     * @type {SoundEffect}
     */
    this.repairSound = new SoundEffect("/static/projects/space_defender/powerup.wav");

    /**
     * Sound effect to play when a ship explodes.
     * @type {SoundEffect}
     */
    this.explosionSound = new SoundEffect("/static/projects/space_defender/explosion.wav");
}

/**
 * Toggles sound effects on or off.
 */
SoundManager.prototype.toggleSoundOn = function() {
    this.soundOn = ! this.soundOn;
    this.laserSound.soundOn = this.soundOn;
    this.damageSound.soundOn = this.soundOn;
    this.repairSound.soundOn = this.soundOn;
    this.explosionSound.soundOn = this.soundOn;
};

/* ---------------------------------------------------------------------- */



/**
 * Index of game state array corresponding to state
 * where the main menu is being displayed.
 * @type {number}
 */
var GameStateIndex_Menu = 0;

/**
 * Index of game state array corresponding to state
 * where the game is running in single player mode.
 * @type {number}
 */
var GameStateIndex_Running = 1;

/**
 * Index of game state array corresponding to state
 * where the about menu is being displayed.
 * @type {number}
 */
var GameStateIndex_MenuAbout = 2;

/**
 * Index of game state array corresponding to state
 * where the help menu is being displayed.
 * @type {number}
 */
var GameStateIndex_MenuHelp = 3;

/**
 * Index of game state array corresponding to state
 * where the pause menu is being displayed.
 * @type {number}
 */
var GameStateIndex_MenuPause= 4;

/**
 * Index of game state array corresponding to state
 * where the game over menu is being displayed.
 * @type {number}
 */
var GameStateIndex_MenuLost = 5;

/**
 * Index of game state array corresponding to state
 * where the game is running in two player mode.
 * @type {number}
 */
var GameStateIndex_RunningTwoPlayer = 6;

/**
 * Index of game state array corresponding to state
 * where the settings menu is being displayed.
 * @type {number}
 */
var GameStateIndex_MenuSettings = 7;

/**
 * Index of game state array corresponding to state
 * where the high scores menu is displayed.
 * @type {number}
 */
var GameStateIndex_MenuHighscores = 8;

/**
 * Index of game state array corresponding to state
 * where the submit high score menu is displayed.
 * @type {number}
 */
var GameStateIndex_MenuSubmitHighscore = 9;

/**
 * Index of game state array corresponding
 * to the game state that is currently running.
 * @type {number}
 */
var currentGameState = GameStateIndex_Menu;

/**
 * Number of ships to begin the game with.
 * @type {number}
 */
var shipCount = 4;

/**
 * True if the player has lost the game in single player mode.
 * @type {boolean}
 */
var gameLost = false;

/**
 * True if the game is currently running in one player mode.
 * @type {boolean}
 */
var onePlayerMode = true;

/**
 * Manages game music.
 * Allows music to be toggled on and off and
 * keeps track of which song is current playing.
 * @type {MusicManager}
 */
var musicManager = new MusicManager();

/**
 * Manages game sound effects.
 * Provides interface to play various
 * sound effects used in game.
 * @type {SoundManager}
 */
var soundManager = new SoundManager();

/* ---------------------------------------------------------------------- */



/**
 * Creates an instance of the game.
 * @param {CanvasRenderingContext2D} ctx Drawing context of canvas.
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function Game(ctx, windowSize) {

    /**
     * The player's score.
     * @type {number}
     */
    this.score = 0;

    /**
     * Increases the player's score.
     * @param {number} x Amount to increase score by.
     */
    this.increaseScore = function (x) {
        this.score += x;
    };

    /**
     * Resets the player's score to 0.
     */
    this.resetScore = function () {
        this.score = 0;
    };

    /**
     * The dimensions of the game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Array of possible game states.
     * Only the current game state is updated and drawn each update.
     * @type {Array}
     */
    this.gameStates = [];
    this.gameStates.push(new GameStateMenu(ctx, this.windowSize));
    this.gameStates.push(new GameStateRunning(ctx, this.windowSize, this));
    this.gameStates.push(new GameStateMenuAbout(ctx, this.windowSize));
    this.gameStates.push(new GameStateMenuHelp(ctx, this.windowSize));
    this.gameStates.push(new GameStateMenuPause(ctx, this.windowSize, this));
    this.gameStates.push(new GameStateMenuLost(ctx, this.windowSize, this));
    this.gameStates.push(new GameStateRunningTwoPlayer(ctx, this.windowSize, this));
    this.gameStates.push(new GameStateMenuSettings(ctx, this.windowSize));

    /**
     * Draws the current game state.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     */
    this.draw = function(ctx){
        this.gameStates[currentGameState].draw(ctx);
    };

    /**
     * Updates current game state.
     * @param {number} time Time since last update (ms).
     * @param {UserInput} input Input from user.
     */
    this.update = function(time, input){
        this.gameStates[currentGameState].update(time, input);
    };
}

/* ---------------------------------------------------------------------- */



/**
 * Creates the a game running state.
 * @param {CanvasRenderingContext2D} ctx Drawing context.
 * @param {Vector} windowSize Dimensions of game window.
 * @param {Game} game
 * @constructor
 */
function GameStateRunning(ctx, windowSize, game) {
    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Player one's space ship.
     * @type {Player}
     */
    this.player = new Player(true, 1, 0.3, 100,
        new LaserType(50, 0.5, 300, 400, 3, "yellow"),
        20, 50, "red", new Vector(0, 0.02), 0.16, windowSize);

    /**
     * Dimensions of game window.
     * @type {Rectangle}
     */
    this.windowBox = new Rectangle(0, 0, this.windowSize.x, this.windowSize.y);

    /**
     * Enemy ships.
     * @type {Array}
     */
    this.ships = [];

    /**
     * Number of milliseconds state was running for.
     * @type {number}
     */
    this.timeElapsed = 0;

	/**
     * Timer to determine when to spawn a new ship.
     * @type {GameTimer}
     */
	 this.spawnShipTimer = new GameTimer(1500);
	
    /**
     * Timer for delay before showing game over menu after player dies.
     * @type {GameTimer}
     */
    this.lostMenuDelayTimer = new GameTimer(3000);

    /**
     * True if stars in background should shake.
     * This effect is applied when the player takes damage.
     * @type {boolean}
     */
    this.shakeDisplay = false;

    /**
     * Timer to control how long shake effect
     * is applied when player takes damage.
     * @type {GameTimer}
     */
    this.shakeTimer = new GameTimer(200);

    /**
     * Button to pause the game.
     * @type {Button}
     */
    this.buttonPause = new Button("||", 17, "#900", "#F00", "black",
        new Vector(0.94, 0.94), windowSize);
    this.buttonPause.edgeThickness = 2;
    this.buttonPause.fontSize = 16;

    /**
     * Generates a random position to spawn an enemy.
     * @returns {Vector}
     */
    this.getRandomEnemySpawnPosition = function () {
        var position = new Vector(0, 0);
        var r = Math.random();

        if (r < 0.25) {
            position = new Vector(this.player.position.x + windowSize.x, this.player.position.y + Math.random() * windowSize.y);
        } else if (r < 0.5) {
            position = new Vector(-this.player.position.x - windowSize.x, this.player.position.y - Math.random() * windowSize.y);
        } else if (r < 0.75) {
            position = new Vector(this.player.position.x + Math.random() * windowSize.x, this.player.position.y + windowSize.y);
        } else {
            position = new Vector(this.player.position.x - Math.random() * windowSize.x, this.player.position.y - windowSize.y);
        }

        return position;
    };


    /**
     * Adds an "easy" ship to the game.
     */
     this.addEasyShip = function () {
        var position = this.getRandomEnemySpawnPosition();
        this.ships.push(new Enemy(25, 0.1, 0.1, 100, new LaserType(5, 0.4, 500, 400, 3, "#0AD"), 20, 50, "blue", position, new Vector(0, 0), Math.random() * 0.5, windowSize));
    };

    /**
     * Adds a "boss" ship to the game.
     */
    this.addBossShip = function () {
        var position = this.getRandomEnemySpawnPosition();
        this.ships.push(new Enemy(100, 0.1, 0.1, 400, new LaserType(30, 0.5, 1000, 600, 6, "#F0B"), 50, 80, "#0F0", position, new Vector(0, 0), Math.random() * 0.5, windowSize));
    };

    /**
     * Adds a "fire" ship to the game.
     */
    this.addFireShip = function () {
        var position = this.getRandomEnemySpawnPosition();
        this.ships.push(new Enemy(5, 0.2, 0.1, 25, new LaserType(1, 0.5, 100, 150, 2, "orange"), 10, 50, "#FFD700", position, new Vector(0, 0), Math.random() * 0.5, windowSize));
    };

    /**
     * Adds a "sniper" ship to the game.
     */
    this.addSniperShip = function () {
        var position = this.getRandomEnemySpawnPosition();
        this.ships.push(new Enemy(25, 0.05, 0.1, 25, new LaserType(15, 0.4, 1500, 700, 3.5, "#777"), 17, 53, "#777", position, new Vector(0, 0), Math.random() * 0.5, windowSize));
    };

    for (var i = 0; i < shipCount; i++) {
        this.addFireShip();
    }

    /**
     * Lasers that have been fired and are still active.
     * @type {Array}
     */
    this.lasers = [];

    /**
     * Line fragment debris from exploding ships.
     * @type {Array}
     */
    this.lineFragments = [];

    /**
     * Stars to draw in background.
     * @type {Array}
     */
    this.stars = [];

    for (var i = 0; i < 100; i++) {
        this.stars.push(new Star(new Vector( Math.random() * this.windowSize.x, Math.random()*this.windowSize.y), new Vector(0, 0), this.windowSize));
    }

    /**
     * Repair kits that player can collect.
     * @type {Array}
     */
    this.repairKits = [];

    /**
     * Spawns a repair kit at the location of a ship.
     * @param ship
     */
    this.spawnRepairKit = function (ship) {
        var size = 3;
        if (ship.value < 30) size = 3;
        else if (ship.value < 75) size = 8;
        else size = 12;
        this.repairKits.push(new RepairKit(ship.value, size, "#0F0", ship.position, this.windowSize));
    };

    /**
     * Floating text segments to draw and update.
     * @type {Array}
     */
    this.floatingTexts = [];
    this.floatingTexts.push(new FloatingText("DESTROY THE ENEMY SHIPS!", "white", "Courier New", 20, -0.1, new Vector(this.windowSize.x / 2 - 160, this.windowSize.y), this.windowSize));

    /**
     * Draws the game.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     */
    this.draw = function (ctx) {

        var i;

        //Draw stars
        for (i = 0; i < this.stars.length; i++) {
            this.stars[i].draw(ctx);
        }

        //Draw repair kits
        for (i = 0; i < this.repairKits.length; i++) {
            this.repairKits[i].draw(ctx);
        }

        //Draw line fragments
        for (i = 0; i < this.lineFragments.length; i++) {
            this.lineFragments[i].draw(ctx);
        }

        //Draw player
        this.player.draw(ctx);

        //Draw enemy ships
        for (i = 0; i < this.ships.length; i++) {
            if(!this.ships.destroyed)
				this.ships[i].draw(ctx);
        }

        //Draw lasers
        for (i = 0; i < this.lasers.length; i++) {
            this.lasers[i].draw(ctx);
        }

        //Draw floating texts
        for (i = 0; i < this.floatingTexts.length; i++) {
            this.floatingTexts[i].draw(ctx);
        }

        //Draw pause button
        this.buttonPause.draw(ctx);

        //Draw information
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "23px Courier New";
        ctx.fillText("SCORE: " + game.score, this.windowSize.x - 350,
            this.windowSize.y - 20);
    };

    /**
     * Updates game.
     * @param {number} time Time elapsed since last update.
     * @param {UserInput} input Input from user.
     */
    this.update = function (time, input) {

        var i, j, labelPosition;

        this.buttonPause.update(input);
        if(input.isKeyDown(KEY_P) || input.isKeyDown(KEY_ESCAPE) || this.buttonPause.wasClicked()) {
            currentGameState = GameStateIndex_MenuPause;
        }

        this.timeElapsed += time;
		

        if (this.shakeDisplay) {
            this.shakeTimer.update(time);
            if (this.shakeTimer.finished) {
                this.shakeDisplay = false;
            }
        }

        if (this.player.destroyed) {
            this.lostMenuDelayTimer.update(time);

            if (this.lostMenuDelayTimer.finished) {
                gameLost = true;
                musicManager.playMenuMusic();
                currentGameState = GameStateIndex_MenuLost;
            }
        }

        //Spawn new enemies
		this.spawnShipTimer.update(time);
		if(this.spawnShipTimer.finished) {
			this.spawnShipTimer.reset();
			var rand = Math.random();
			
			if (rand < 0.7) {
				this.addFireShip();
			} else if (rand < 0.85) {
				this.addEasyShip();
			} else if (rand < 0.9) {
				this.addSniperShip();
			} else if (rand <= 1) {
				this.addBossShip();
			}
		}
        this.player.update(time, input);

        //Get lasers from player
        while (this.player.firedLasers.length > 0) {
            this.lasers.push(this.player.firedLasers.pop());
            soundManager.laserSound.play();
        }

        //Get line fragments from player
        while (this.player.lineFragments.length > 0) {
            this.lineFragments.push(this.player.lineFragments.pop());
        }

        //Damage hit player
        for (j = 0; j < this.lasers.length; j++) {
            
            if (this.lasers[j] != null && !this.lasers[j].fromPlayerOne && this.player.isHit(this.lasers[j]) && !this.player.destroyed) {
                this.shakeDisplay = true;
                this.shakeTimer.reset();
                this.lasers[j].damageShip(this.player);

                if (this.player.health <= 0) {
                    soundManager.explosionSound.play();
                } else {
                    soundManager.damageSound.play();
                }
            }
        }

        //Heal player with repair kits
        for (j = 0; j < this.repairKits.length; j++) {
            if (this.repairKits[j] != null && this.player.isHit(this.repairKits[j]) && !this.player.destroyed) {
                this.repairKits[j].healShip(this.player);
                labelPosition = this.player.position.getAdded(this.player.offset.getScaled(-1));
                this.floatingTexts.push(new FloatingText("+" + this.repairKits[j].healing, "#0F0", "Courier New", 12, -0.19, labelPosition, this.windowSize));
                soundManager.repairSound.play();
            }
        }

        //Update enemy ships
        for (i = 0; i < this.ships.length; i++) {
            this.ships[i].update(time, this.player);
            this.ships[i].offset = this.player.displacement;

            //Get line fragments from ships
            while (this.ships[i].lineFragments.length > 0) {
                this.lineFragments.push(this.ships[i].lineFragments.pop());
            }

            //Get lasers from ships
            while (this.ships[i].firedLasers.length > 0) {
                this.lasers.push(this.ships[i].firedLasers.pop());
                soundManager.laserSound.play();
            }

            //Remove destroyed ships
            if (this.ships[i].destroyed) {
                this.ships.splice(i, 1);
                i--;
            }

            //Damage hit ships
            for (j = 0; j < this.lasers.length; j++) {
                if (this.ships[i] != null) {
                    if (this.lasers[j] != null && this.lasers[j].fromPlayerOne && this.ships[i].isHit(this.lasers[j])) {
                        this.lasers[j].damageShip(this.ships[i]);

                        if (this.ships[i].health <= 0) {
                            game.increaseScore(this.ships[i].value);

                            var comments = ["Good job!", "Great!", "Fantastic!", "Good!", "Excellent!", "Kill Them All!"];
                            var comment = comments[Math.floor(Math.random()*comments.length)];

                            labelPosition = this.ships[i].position.getAdded(this.ships[i].offset.getScaled(-1));
                            this.floatingTexts.push(new FloatingText("+" + this.ships[i].value, "white", "Courier New", 12, -0.19, labelPosition, this.windowSize));
                            soundManager.explosionSound.play();
                            if(Math.random() > 0.65)
                                this.spawnRepairKit(this.ships[i]);
                        } else {
                            soundManager.damageSound.play();
                        }
                    }
                }
            }
        }

        //Update fired lasers
        for (i = 0; i < this.lasers.length; i++) {
            if(this.lasers[i] != null)  {
                this.lasers[i].update(time);
                this.lasers[i].offset = this.player.displacement;
            }

            //Remove destroyed lasers
            if (this.lasers[i] == null || this.lasers[i].destroyed) {
                this.lasers.splice(i, 1);
                i--;
            }
        }

        //Update repair kits
        for (i = 0; i < this.repairKits.length; i++) {
            if (this.repairKits[i] != null) {
                this.repairKits[i].update(time);
                this.repairKits[i].offset = this.player.displacement;
            }

            //Remove destroyed lasers
            if (this.repairKits[i] == null || this.repairKits[i].destroyed) {
                this.repairKits.splice(i, 1);
                i--;
            }
        }

        //Update stars
        for (i = 0; i < this.stars.length; i++) {
            this.stars[i].update(time);
            this.stars[i].offset = this.player.displacement.getScaled(0.9);
            this.stars[i].setShake(this.shakeDisplay);
        }

        //Update floating texts
        for (i = 0; i < this.floatingTexts.length; i++) {
            this.floatingTexts[i].update(time);
        }
		
		//Update line fragments (debris)
        for (i = 0; i < this.lineFragments.length; i++) {
            this.lineFragments[i].update(time);
            this.lineFragments[i].offset = this.player.displacement;

            //Remove destroyed fragments
            if (this.lineFragments[i].destroyed) {
                this.lineFragments.splice(i, 1);
                i--;
            }
        }
    };
	
	
	
}

/* ---------------------------------------------------------------------- */



/**
 * Creates game state for playing two player games.
 * @param {CanvasRenderingContext2D} ctx Drawing context.
 * @param {Vector} windowSize Dimensions of game window.
 * @param {Game} game
 * @constructor
 */
function GameStateRunningTwoPlayer(ctx, windowSize, game) {
    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Player one's ship.
     * @type {Player}
     */
    this.player = new Player(false, 1, 0.2, 100, new LaserType(15, 0.5, 300, 400, 3, "blue"), 20, 50, "blue", new Vector(0, 0.02), 0.13, windowSize);

    /**
     * Player two's ship.
     * @type {Player}
     */
    this.player2 = new Player(false, 2, 0.2, 100, new LaserType(15, 0.5, 300, 400, 3, "red"), 20, 50, "red", new Vector(0, 0.02), 0.13, windowSize);

    /**
     * Player one's score.
     * @type {number}
     */
    this.p1Score = 0;

    /**
     * Player two's score.
     * @type {number}
     */
    this.p2Score = 0;

    /**
     * Button to pause the game.
     * @type {Button}
     */
    this.buttonPause = new Button("||", 17, "#900", "#F00", "black", new Vector(0.5, 0.95), windowSize);
    this.buttonPause.edgeThickness = 1;
    this.buttonPause.fontSize = 16;

    /**
     * Respawns player one.
     */
    this.spawnPlayer1 = function () {
        this.player = new Player(false, 1, 0.2, 100, new LaserType(15, 0.5, 300, 400, 3, "blue"), 20, 50, "blue", new Vector(0, 0.02), 0.18, windowSize);
    };

    /**
     * Respawns player two.
     */
    this.spawnPlayer2 = function () {
        this.player2 = new Player(false, 2, 0.2, 100, new LaserType(15, 0.5, 300, 400, 3, "red"), 20, 50, "red", new Vector(0, 0.02), 0.18, windowSize);
    };

    this.spawnPlayer1();
    this.spawnPlayer2();

    /**
     * Rectangle to draw around menu.
     * @type {Rectangle}
     */
    this.windowBox = new Rectangle(0, 0, this.windowSize.x, this.windowSize.y);

    /**
     * Number of milliseconds elapsed while two player mode was the current game state.
     * @type {number}
     */
    this.timeElapsed = 0;

    /**
     * Lasers which have been fired by player or enemy ships.
     * @type {Array}
     */
    this.lasers = [];

    /**
     * Debris created by destroyed ships.
     * @type {Array}
     */
    this.lineFragments = [];

    /**
     * Floating text to display indicating how many points a player gained
     * or how much health was healed.
     * @type {Array}
     */
    this.floatingTexts = [];

    /**
     * Star manager which draws and updates stars in background.
     * @type {Array}
     */
    this.stars = [];
	
	/**
	 * Timer to control when to spawn repair kits.
	 * @type {GameTimer}
	 */
	 this.spawnRepairKitsTimer = new GameTimer(5000);

    for (var i = 0; i < 100; i++) {
        this.stars.push(new Star(new Vector( Math.random() * this.windowSize.x, Math.random()*this.windowSize.y), new Vector(0, 0), this.windowSize));
    }

    /**
     * Repair kits that can be collected by player one or two.
     * @type {Array}
     */
    this.repairKits = [];

    /**
     * Spawns a repair kit.
     * @param ship
     */
    this.spawnRepairKit = function (ship) {
        var size = 3;
        if (ship.value < 30) size = 3;
        else if (ship.value < 75) size = 8;
        else size = 12;
        this.repairKits.push(new RepairKit(ship.value, size, "#0F0", ship.position, this.windowSize));
    };


    /**
     * Draws game menu.
     * @param {CanvasRenderingContext2D} ctx Context to draw to.
     */
    this.draw = function (ctx) {

        var i;

        //Draw stars
        for (i = 0; i < this.stars.length; i++) {
            this.stars[i].draw(ctx);
        }

        //Draw repair kits
        for (i = 0; i < this.repairKits.length; i++) {
            this.repairKits[i].draw(ctx);
        }

        //Draw line fragments
        for (i = 0; i < this.lineFragments.length; i++) {
            this.lineFragments[i].draw(ctx);
        }

        //Draw player
        this.player.draw(ctx);
        this.player2.draw(ctx);

        //Draw lasers
        for (i = 0; i < this.lasers.length; i++) {
            this.lasers[i].draw(ctx);
        }

        //Draw floating texts
        for (i = 0; i < this.floatingTexts.length; i++) {
            this.floatingTexts[i].draw(ctx);
        }

        //Draw pause button
        this.buttonPause.draw(ctx);


        //Draw information
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "18px Courier New";

        ctx.fillStyle = "#00F";
        ctx.font = "50px Courier New";
        ctx.fillText(this.p1Score, 25, 40);
        ctx.fillStyle = "#F00";
        ctx.fillText(this.p2Score, this.windowSize.x - 100, 40);
    };

    /**
     * Updates game.
     * @param {number} time Time since last update (ms).
     * @param {UserInput} input Input from user.
     */
    this.update = function (time, input) {

        var i, j, labelPosition;

        this.timeElapsed += time;

        this.buttonPause.update(input);
        if (input.isKeyDown(KEY_P) || input.isKeyDown(KEY_ESCAPE) || this.buttonPause.wasClicked()) {
            currentGameState = GameStateIndex_MenuPause;
        }

        //Spawn repair kits
		this.spawnRepairKitsTimer.update(time);
        if (this.spawnRepairKitsTimer.finished) {
			this.spawnRepairKitsTimer.reset();
            this.repairKits.push(new RepairKit(50, 5, "#0F0", new Vector(30 + (this.windowSize.x-60)*Math.random(), 30 + (this.windowSize.y-60)*Math.random(), this.windowSize)));
        }

        //Check if players killed
        if (this.player.destroyed) {
            labelPosition = this.player.position;
            this.floatingTexts.push(new FloatingText("+1", "red", "Courier New", 16, -0.19, labelPosition, this.windowSize));
            this.spawnPlayer1();
            this.p2Score++;
        }

        if (this.player2.destroyed) {
            labelPosition = this.player2.position;
            this.floatingTexts.push(new FloatingText("+1", "blue", "Courier New", 16, -0.19, labelPosition, this.windowSize));
            this.spawnPlayer2();
            this.p1Score++;
        }

        //Update player
        this.player.update(time, input);
        this.player2.update(time, input);

         //Get lasers from player
        while (this.player.firedLasers.length > 0) {
            this.lasers.push(this.player.firedLasers.pop());
            soundManager.laserSound.play();
        }

        //Get lasers from player2
        while (this.player2.firedLasers.length > 0) {
            this.lasers.push(this.player2.firedLasers.pop());
            soundManager.laserSound.play();
        }

        //Get line fragments from player
        while (this.player.lineFragments.length > 0) {
            this.lineFragments.push(this.player.lineFragments.pop());
        }

        //Get line fragments from player2
        while (this.player2.lineFragments.length > 0) {
            this.lineFragments.push(this.player2.lineFragments.pop());
        }

        //Update line fragments (debris)
        for (i = 0; i < this.lineFragments.length; i++) {
            this.lineFragments[i].update(time);
            this.lineFragments[i].offset = this.player.displacement;

            //Remove destroyed fragments
            if (this.lineFragments[i].destroyed) {
                this.lineFragments.splice(i, 1);
                i--;
            }
        }

        //Damage hit player
        for (j = 0; j < this.lasers.length; j++) {
            
            if (this.lasers[j] != null && !this.lasers[j].fromPlayerOne && this.player.isHit(this.lasers[j]) && !this.player.destroyed) {
                    this.lasers[j].damageShip(this.player);

                    if (this.player.health <= 0) {
                        soundManager.explosionSound.play();
                    } else {
                        soundManager.damageSound.play();
                    }
            }

            if (this.lasers[j] != null && this.lasers[j].fromPlayerOne && this.player2.isHit(this.lasers[j]) && !this.player2.destroyed) {
                this.lasers[j].damageShip(this.player2);

                if (this.player2.health <= 0) {
                    soundManager.explosionSound.play();
                } else {
                    soundManager.damageSound.play();
                }
            }
        }

        //Heal player with repair kits
        for (j = 0; j < this.repairKits.length; j++) {

            if (this.repairKits[j] != null && this.player.isHit(this.repairKits[j]) && !this.player.destroyed) {
                labelPosition = this.player.position.getAdded(this.player.offset.getScaled(-1));
                this.floatingTexts.push(new FloatingText("+" + this.repairKits[j].healing, "#0F0", "Courier New", 12, -0.19, labelPosition, this.windowSize));
                this.repairKits[j].healShip(this.player);
                soundManager.repairSound.play();
                
            }

            if (this.repairKits[j] != null && this.player2.isHit(this.repairKits[j]) && !this.player2.destroyed) {
                this.repairKits[j].healShip(this.player2);
                soundManager.repairSound.play();

                labelPosition = this.player2.position.getAdded(this.player2.offset.getScaled(-1));
                this.floatingTexts.push(new FloatingText("+" + this.repairKits[j].healing, "0F0", "Courier New", 12, -0.19, labelPosition, this.windowSize));

            }
        }

        //Update fired lasers
        for (i = 0; i < this.lasers.length; i++) {
            if(this.lasers[i] != null)  {
                this.lasers[i].update(time);
                this.lasers[i].offset = this.player.displacement;
            }

            //Remove destroyed lasers
            if (this.lasers[i] == null || this.lasers[i].destroyed) {
                this.lasers.splice(i, 1);
                i--;
            }
        }

        //Update repair kits
        for (i = 0; i < this.repairKits.length; i++) {
            if (this.repairKits[i] != null) {
                this.repairKits[i].update(time);
                this.repairKits[i].offset = this.player.displacement;
            }

            //Remove destroyed lasers
            if (this.repairKits[i] == null || this.repairKits[i].destroyed) {
                this.repairKits.splice(i, 1);
                i--;
            }
        }

        //Update stars
        for (i = 0; i < this.stars.length; i++) {
            this.stars[i].update(time);
            this.stars[i].setShake(false);
        }

        //Update floating texts
        for (i = 0; i < this.floatingTexts.length; i++) {
            this.floatingTexts[i].update(time);
        }
    };
}

/* ---------------------------------------------------------------------- */



/**
 * Creates game state for displaying main menu.
 * @param {CanvasRenderingContext2D} ctx Drawing context.
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function GameStateMenu(ctx, windowSize) {

    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Star manager to draw and update stars for menu background.
     * @type {StarManager}
     */
    this.stars = new StarManager(windowSize);

    /**
     * Button to play one player game.
     * @type {ButtonRect}
     */
    this.buttonPlay1 = new ButtonRect("ONE PLAYER", 300,50,18, "#900", "#F00", "black", new Vector(0.5, 0.50), windowSize);

    /**
     * Button to play two player game.
     * @type {ButtonRect}
     */
    this.buttonPlay2 = new ButtonRect("TWO PLAYER", 300, 50, 18, "#900", "#F00", "black", new Vector(0.5, 0.66), windowSize);

    /**
     * Button to go to help menu.
     * @type {Button}
     */
    this.buttonHelp = new Button("HELP", 40, "#777", "#CCC", "black", new Vector(0.1, 0.88), windowSize);

    /**
     * Button to go to about menu.
     * @type {Button}
     */
    this.buttonAbout = new Button("ABOUT", 40, "#777", "#CCC", "black", new Vector(0.63, 0.88), windowSize);

    /**
     * Button to see more games by Clinton Morrison.
     * @type {Button}
     */
    this.buttonMoreGames = new Button("MORE GAMES", 40, "#777", "#CCC", "black", new Vector(0.9, 0.88), windowSize);

    /**
     * Button to go to settings menu.
     * @type {Button}
     */
    this.buttonSettings = new Button("SETTINGS", 40, "#777", "#CCC", "black", new Vector(0.37, 0.88), windowSize);

    /**
     * Label displaying title of game.
     * @type {Label}
     */
    this.labelTitle = new Label("SPACE   DEFENDER", 40, "#F00", "#777", new Vector(0.5, 0.21), windowSize);

    /**
     * Label displaying author of game.
     * @type {Label}
     */
    this.labelAuthor = new Label("Created by Clinton Morrison", 18, "#777", "#333", new Vector(0.5, 0.31), windowSize);
}

/**
 * Draws game menu.
 * @param {CanvasRenderingContext2D} ctx Context to draw to.
 */
GameStateMenu.prototype.draw = function (ctx) {
    this.stars.draw(ctx);
    this.buttonPlay1.draw(ctx);
    this.buttonPlay2.draw(ctx);
    this.buttonHelp.draw(ctx);
    this.buttonAbout.draw(ctx);
    this.buttonMoreGames.draw(ctx);
    this.labelTitle.draw(ctx);
    this.labelAuthor.draw(ctx);
    this.buttonSettings.draw(ctx);
};

/**
 * Updates the menu.
 * @param {number} time Time since last update (ms).
 * @param {UserInput} input Input from user.
 */
GameStateMenu.prototype.update = function (time, input) {
    this.stars.update(time);
    this.buttonPlay1.update(input);
    this.buttonPlay2.update(input);
    this.buttonHelp.update(input);
    this.buttonAbout.update(input);
    this.buttonMoreGames.update(input);
    this.buttonSettings.update(input);

    if (this.buttonPlay1.wasClicked()) {
        currentGameState = GameStateIndex_Running;
        musicManager.playGameMusic();
        onePlayerMode = true;
    }

    if (this.buttonPlay2.wasClicked()) {
        currentGameState = GameStateIndex_RunningTwoPlayer;
        musicManager.playGameMusic();
        onePlayerMode = false;
    }

    if (this.buttonAbout.wasClicked()) {
        currentGameState = GameStateIndex_MenuAbout;
    }

    if (this.buttonSettings.wasClicked()) {
        currentGameState = GameStateIndex_MenuSettings;
    }

    if (this.buttonHelp.wasClicked()) {
        currentGameState = GameStateIndex_MenuHelp;
    }

    if (this.buttonMoreGames.wasClicked()) {
        window.location = "http://clintonmorrison.com/games";
    }
};

/* ---------------------------------------------------------------------- */



/**
 * The game state that draws the about menu.
 * @param {CanvasRenderingContext2D} ctx Drawing context.
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function GameStateMenuAbout(ctx, windowSize) {
    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Star manager to draw and update stars in background.
     * @type {StarManager}
     */
    this.stars = new StarManager(windowSize);

    /**
     * Button to return back to main menu.
     * @type {Button}
     */
    this.buttonBack = new Button("BACK",40, "#900", "#F00", "black", new Vector(0.8, 0.75), windowSize);

    /**
     * Rectangle to draw around menu.
     * @type {MenuBox}
     */
    this.menuBox = new MenuBox("black", "#900", new Vector(0.5, 0.5), windowSize);

    /**
     * Labels to draw to menu.
     * @type {Array}
     */
    this.labels = [];
    this.labels.push(new Label("ABOUT", 30, "#F00", "#777", new Vector(0.5, 0.20), windowSize));

    this.labels.push(new Label("This game was developed by Clinton Morrison.",
        18, "#777", "#333", new Vector(0.5, 0.35), windowSize));

    this.labels.push(new Label("Sound effects were created using bfxr.net.",
        18, "#777", "#333", new Vector(0.5, 0.45), windowSize));

    this.labels.push(new Label("Music by Mutkanto and Derail Sane on freesound.org.",
        18, "#777", "#333", new Vector(0.5, 0.55), windowSize));

}

/**
 * Draws game about menu.
 * @param {CanvasRenderingContext2D} ctx Context to draw to.
 */
GameStateMenuAbout.prototype.draw = function (ctx) {
    this.stars.draw(ctx);
    this.menuBox.draw(ctx);
    this.buttonBack.draw(ctx);
    for (var i = 0; i < this.labels.length; i++) {
        this.labels[i].draw(ctx);
    }
};

/**
 * Updates the menu by processing user input,
 * updating the star manager, and checking if the
 * user has pressed any buttons.
 * @param {number} time Time since last update (ms).
 * @param {UserInput} input Input from user.
 */
GameStateMenuAbout.prototype.update = function (time, input) {
    this.stars.update(time);
    this.buttonBack.update(input);

    if (this.buttonBack.wasClicked()) {
        currentGameState = GameStateIndex_Menu;
    }
};

/* ---------------------------------------------------------------------- */



/**
 * Creates settings menu.
 * @param {CanvasRenderingContext2D} ctx Drawing context.
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function GameStateMenuSettings(ctx, windowSize) {

    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Draws and updates stars.
     * @type {StarManager}
     */
    this.stars = new StarManager(windowSize);

    /**
     * Button to return to main menu.
     * @type {Button}
     */
    this.buttonBack = new Button("BACK",40, "#900", "#F00", "black", new Vector(0.8, 0.75), windowSize);

    /**
     * Rectangle to draw around menu.
     * @type {MenuBox}
     */
    this.menuBox = new MenuBox("black", "#900", new Vector(0.5, 0.5), windowSize);

    /**
     * Text and labels to draw.
     * @type {Array}
     */
    this.labels = [];
    this.labels.push(new Label("SETTINGS", 30, "#F00", "#777", new Vector(0.5, 0.20), windowSize));
    this.labels.push(new Label("Toggle sound and music by pressing the buttons below.",
        14, "#777", "#333", new Vector(0.5, 0.35), windowSize))

    /**
     * Button to toggle sound on and off.
     * @type {ButtonRect}
     */
    this.buttonSound = new ButtonRect("SOUND ON", 100, 30, 14, "#777", "#CCC", "black",
        new Vector(0.5, 0.45), windowSize);

    /**
     * Button to toggle music on and off.
     * @type {ButtonRect}
     */
    this.buttonMusic = new ButtonRect("MUSIC ON", 100, 30, 14, "#777", "#CCC", "black",
        new Vector(0.5, 0.55), windowSize);
}

/**
 * Draws game settings menu.
 * @param {CanvasRenderingContext2D} ctx Context to draw to.
 */
GameStateMenuSettings.prototype.draw = function (ctx) {
    this.stars.draw(ctx);
    this.menuBox.draw(ctx);
    this.buttonBack.draw(ctx);
    this.buttonSound.draw(ctx);
    this.buttonMusic.draw(ctx);

    for (var i = 0; i < this.labels.length; i++) {
        this.labels[i].draw(ctx);
    }
};

/**
 * Updates settings menu.
 * @param {number} time Time since last input (ms).
 * @param {UserInput} input Input from user.
 */
GameStateMenuSettings.prototype.update = function (time, input) {
    this.stars.update(time);
    this.buttonBack.update(input);
    this.buttonMusic.update(input);
    this.buttonSound.update(input);

    if (this.buttonBack.wasClicked()) {
        currentGameState = GameStateIndex_Menu;
    }

    if (this.buttonMusic.wasClicked()) {
        musicManager.toggleMute();
        if (musicManager.musicOn) {
            this.buttonMusic.text = "MUSIC ON";
        } else {
            this.buttonMusic.text = "MUSIC OFF";
        }
    }

    if (this.buttonSound.wasClicked()) {
        soundManager.toggleSoundOn();
        if (soundManager.soundOn) {
            this.buttonSound.text = "SOUND ON";
        } else {
            this.buttonSound.text = "SOUND OFF";
        }
    }
};

/* ---------------------------------------------------------------------- */



/**
 * Game state which displays gave over menu.
 * @param {CanvasRenderingContext2D} ctx Drawing context.
 * @param {Vector} windowSize Dimensions of game window.
 * @param {Game} game
 * @constructor
 */
function GameStateMenuLost(ctx, windowSize, game) {

    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Draws and updates stars.
     * @type {StarManager}
     */
    this.stars = new StarManager(windowSize);

    /**
     * Button to return to main menu.
     * @type {Button}
     */
    this.buttonOkay = new Button("OKAY", 40, "#900", "#F00", "black", new Vector(0.8, 0.75), windowSize);

    /**
     * Rectangle to draw around menu.
     * @type {MenuBox}
     */
    this.menuBox = new MenuBox("black", "#900", new Vector(0.5, 0.5), windowSize);

    /**
     * Text to display in menu.
     * @type {Array}
     */
    this.labels = [];
    this.labels.push(new Label("GAME OVER", 30, "#F00", "#777", new Vector(0.5, 0.20), windowSize));
    this.labels.push(new Label("Your ship was destroyed! Your final score was " + game.score + ".", 18, "#777", "#333", new Vector(0.5, 0.35), windowSize));

    /**
     * {CanvasRenderingContext2D} ctx Drawing context of canvas.
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;
}

/**
 * Draws game over menu.
 * @param {CanvasRenderingContext2D} ctx Context to draw to.
 */
GameStateMenuLost.prototype.draw = function (ctx) {
    this.stars.draw(ctx);
    this.menuBox.draw(ctx);
    this.buttonOkay.draw(ctx);
    for (var i = 0; i < this.labels.length; i++) {
        this.labels[i].draw(ctx);
    }
};

/**
 * Updates menu.
 * @param {number} time Time since last update (ms).
 * @param {UserInput} input Input from user.
 */
GameStateMenuLost.prototype.update = function (time, input) {
    this.labels[1] =  new Label("Your ship was destroyed! Your final score was " + game.score + ".", 18, "#777", "#333", new Vector(0.5, 0.35), windowSize);
    this.stars.update(time);
    this.buttonOkay.update(input);

    if (this.buttonOkay.wasClicked()) {
        game.resetScore();
        currentGameState = GameStateIndex_Menu;
    }

    if (gameLost) {
        game.gameStates[GameStateIndex_Running] = new GameStateRunning(this.ctx, windowSize, game);
        gameLost = false;
    }
};

/* ---------------------------------------------------------------------- */



/**
 * Game state which draws game paused menu.
 * @param {CanvasRenderingContext2D} ctx Drawing context.
 * @param {Vector} windowSize c.
 * @param {Game} game
 * @constructor
 */
function GameStateMenuPause(ctx, windowSize, game) {
    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Star manager to draw and update stars in background.
     * @type {StarManager}
     */
    this.stars = new StarManager(windowSize);

    /**
     * Button to resume game.
     * @type {ButtonRect}
     */
    this.buttonResume = new ButtonRect("RESUME", 300, 50, 18, "#900", "#F00", "black", new Vector(0.5, 0.5), windowSize);

    /**
     * Button to restart game.
     * @type {ButtonRect}
     */
    this.buttonRestart = new ButtonRect("RESTART", 300, 50, 18, "#900", "#F00", "black", new Vector(0.5, 0.65), windowSize);

    /**
     * Button to return to main menu.
     * @type {ButtonRect}
     */
    this.buttonMenu = new ButtonRect("RETURN TO MENU", 300,50, 18, "#900", "#F00", "black", new Vector(0.5, 0.8), windowSize);

    /**
     * Rectangle to draw around menu.
     * @type {MenuBox}
     */
    this.menuBox = new MenuBox("black", "#900", new Vector(0.5, 0.5), windowSize);

    /**
     * Labels to draw.
     * @type {Array}
     */
    this.labels = [];
    this.labels.push(new Label("GAME PAUSED", 30, "#F00", "#777", new Vector(0.5, 0.30), windowSize));

    /**
     * Drawing context of canvas.
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;
}

/**
 * Draws game pause menu.
 * @param {CanvasRenderingContext2D} ctx Context to draw to.
 */
GameStateMenuPause.prototype.draw = function (ctx) {
    this.stars.draw(ctx);
    this.buttonMenu.draw(ctx);
    this.buttonResume.draw(ctx);
    this.buttonRestart.draw(ctx);
    for (var i = 0; i < this.labels.length; i++) {
        this.labels[i].draw(ctx);
    }
};

/**
 * Updates menu.
 * @param {number} time Time since last update (ms).
 * @param {UserInput} input Input from user.
 */
GameStateMenuPause.prototype.update = function (time, input) {
    this.stars.update(time);
    this.buttonMenu.update(input);
    this.buttonResume.update(input);
    this.buttonRestart.update(input);

    if (this.buttonMenu.wasClicked()) {
        game.resetScore();
        currentGameState = GameStateIndex_Menu;
        musicManager.playMenuMusic();
    }

    if (this.buttonRestart.wasClicked()) {
        if (onePlayerMode == true) {
            game.gameStates[GameStateIndex_Running] = new GameStateRunning(this.ctx, windowSize, game);
            game.resetScore();
            currentGameState = GameStateIndex_Running;
        }
        else {
            currentGameState = GameStateIndex_RunningTwoPlayer;
            game.gameStates[GameStateIndex_RunningTwoPlayer] = new GameStateRunningTwoPlayer(this.ctx, windowSize, game);
        }
    }


    if (this.buttonResume.wasClicked()) {
        if(onePlayerMode == true)
            currentGameState = GameStateIndex_Running;
        else
            currentGameState = GameStateIndex_RunningTwoPlayer;
    }
};

/* ---------------------------------------------------------------------- */



/**
 * Game state which draws game paused menu.
 * @param {CanvasRenderingContext2D} ctx Drawing context.
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function GameStateMenuHelp(ctx, windowSize) {
    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Star manager to draw and update stars for background.
     * @type {StarManager}
     */
    this.stars = new StarManager(windowSize);

    /**
     * Button to return to main menu.
     * @type {Button}
     */
    this.buttonBack = new Button("BACK",30, "#900", "#F00", "black", new Vector(0.82, 0.79), windowSize);

    /**
     * Box to draw around menu.
     * @type {MenuBox}
     */
    this.menuBox = new MenuBox("black", "#900", new Vector(0.5, 0.5), windowSize);

    /**
     * Labels to draw to menu.
     * @type {Array}
     */
    this.labels = [];
    this.labels.push(new Label("HELP", 30, "#F00", "#777", new Vector(0.5, 0.20), windowSize));

    this.labels.push(new Label("Fire lasers to destroy other space ships.", 14, "#777", "#333", new Vector(0.5, 0.28), windowSize));
    this.labels.push(new Label("Destroy enemy ships to earn points.", 14, "#777", "#333", new Vector(0.5, 0.32), windowSize));
    this.labels.push(new Label("Collect green repair kits to repair your ship.", 14, "#777", "#333", new Vector(0.5, 0.36), windowSize));

    this.labels.push(new Label("Sound and music can be toggled in the settings menu.", 14, "#777", "#333", new Vector(0.5, 0.45), windowSize));
    this.labels.push(new Label("Press 'P' or 'Escape' to pause the game at any time.", 14, "#777", "#333", new Vector(0.5, 0.49), windowSize));

    this.labels.push(new Label("PLAYER 1", 16, "#777", "#600", new Vector(0.5, 0.59), windowSize));
    this.labels.push(new Label("Control your space ship using WSAD.", 14, "#777", "#333", new Vector(0.5, 0.63), windowSize));
    this.labels.push(new Label("Fire lasers by pressing the space bar.", 14, "#777", "#333", new Vector(0.5, 0.67), windowSize));

    this.labels.push(new Label("PLAYER 2", 16, "#777", "#600", new Vector(0.5, 0.75), windowSize));
    this.labels.push(new Label("Control your space ship using the arrow keys.", 14, "#777", "#333", new Vector(0.5, 0.79), windowSize));
    this.labels.push(new Label("Fire lasers by pressing enter.", 14, "#777", "#333", new Vector(0.5, 0.83), windowSize));
}

/**
 * Draws help menu.
 * @param {CanvasRenderingContext2D} ctx Context to draw to.
 */
GameStateMenuHelp.prototype.draw = function (ctx) {
    this.stars.draw(ctx);
    this.menuBox.draw(ctx);
    this.buttonBack.draw(ctx);
    for (var i = 0; i < this.labels.length; i++) {
        this.labels[i].draw(ctx);
    }
};

/**
 * Updates menu.
 * @param {number} time Time since last update (ms).
 * @param {UserInput} input Input from user.
 */
GameStateMenuHelp.prototype.update = function (time, input) {
    this.stars.update(time);
    this.buttonBack.update(input);

    if (this.buttonBack.wasClicked()) {
        currentGameState = GameStateIndex_Menu;
    }
};

/* ---------------------------------------------------------------------- */



/**
 * Game state when game is running.
 * @param {CanvasRenderingContext2D} ctx Context to draw to.
 * @param {Vector} windowSize Dimensions of game window.
 * @constructor
 */
function GameStateMenuRun(ctx, windowSize) {
    /**
     * Dimensions of game window.
     * @type {Vector}
     */
    this.windowSize = windowSize;

    /**
     * Star manager to draw and update stars in background.
     * @type {StarManager}
     */
    this.stars = new StarManager(windowSize);

    /**
     * Button to play single player game.
     * @type {Button}
     */
    this.buttonOnePlayer = new Button("ONE PLAYER",70, "#900", "#F00", "black", new Vector(0.35, 0.6), windowSize);

    /**
     * Button to play two player game.
     * @type {Button}
     */
    this.buttonTwoPlayer = new Button("TWO PLAYER",70, "#900", "#F00", "black", new Vector(0.65, 0.6), windowSize);

    /**
     * Box to draw around menu.
     * @type {MenuBox}
     */
    this.menuBox = new MenuBox("black", "#900", new Vector(0.5, 0.5), windowSize);

    /**
     * Labels to draw to menu.
     * @type {Array}
     */
    this.labels = [];
    this.labels.push(new Label("SPACE DEFENDER", 30, "#F00", "#777", new Vector(0.5, 0.20), windowSize));
    this.labels.push(new Label("What type of game would you like to play?", 18, "#777", "#333", new Vector(0.5, 0.35), windowSize));
}

/**
 * Draws run menu.
 * @param {CanvasRenderingContext2D} ctx Context to draw to.
 */
GameStateMenuRun.prototype.draw = function (ctx) {
    this.stars.draw(ctx);
    this.menuBox.draw(ctx);
    this.buttonOnePlayer.draw(ctx);
    this.buttonTwoPlayer.draw(ctx);
    for (var i = 0; i < this.labels.length; i++) {
        this.labels[i].draw(ctx);
    }
};

/**
 * Updates menu.
 * @param {number} time Time since last update (ms).
 * @param {UserInput} input Input from user.
 */
GameStateMenuRun.prototype.update = function (time, input) {
    this.stars.update(time);
    this.buttonOnePlayer.update(input);
    this.buttonTwoPlayer.update(input);

    if (this.buttonOnePlayer.wasClicked()) {
        musicManager.playGameMusic();
        currentGameState = GameStateIndex_Running;
    }

    if (this.buttonTwoPlayer.wasClicked()) {
        musicManager.playGameMusic();
        currentGameState = GameStateIndex_RunningTwoPlayer;
    }
};
