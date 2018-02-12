// Enemies our player must avoid
class Enemy {
  constructor() {
    /*
    sprite (string): Reference to enemy image.
    speed (num): Speed of the enemy.
    x (num): Spawn point on the x-axis.
    y (num): Spawn point on the y-axis.
    despawn (bool): Should the enemy be despawned.
    hitBox (object):  Contains the top-left coordinate of the enemy png, as well as the hitbox width and height.  This is used for collision detection.
    */
    this.sprite = 'images/enemy-bug.png';
    this.speed = this.randomSpeed();
    this.x = -100;
    this.y = this.randomLocation();
    this.despawn = false;
    this.hitBox = {
      hitX: 0,
      hitY: 77,
      width: 100,
      height: 68,
    }
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    //The new x coordinate is the speed of the enemy multiplied by the game timer.
    this.x += (this.speed * dt);
    //Check to see if the enemy should despawn.
    this.despawn = this.despawnCheck();
  }
  // Draw the enemy on the screen
  render() {
    //Draw hit box if in debug mode
    drawHitBox(this.x + this.hitBox.hitX, this.y + this.hitBox.hitY, this.hitBox.width, this.hitBox.height);
    //Draw the enemy
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  //Randomly determine and return speed.  There is a 1/3 chance of it being fast, medium, or slow.
  randomSpeed() {
    let randomNum = Math.floor(Math.random() * 3);
    switch (randomNum) {
      //Slow speed
      case 0:
        return 100;
        //Medium speed
      case 1:
        return 150;
        //Fast speed
      case 2:
        return 300;
    }
  }
  //Randomly determine and return spawn row.  There is a 1/3 chance of it being top, middle, or bottom.
  randomLocation() {
    //Randomly determine spawn row
    let randomNum = Math.floor(Math.random() * 3);
    switch (randomNum) {
      //Top row
      case 0:
        return 62;
        //Middle row
      case 1:
        return 145;
        //Bottom row
      case 2:
        return 228;
    }
  }
  //Check to see if enemy should despawn.
  despawnCheck() {
    //After the x coordinate is > 500, the enemy will no longer be visible on the canvas and can be removed.
    return this.x > 500;
  }


}


//The player character
class Player {
  constructor() {
    /*
    sprite (string): Reference to player image.
    x (num): Spawn point on the x-axis.
    y (num): Spawn point on the y-axis.
    hitBox (object):  Contains the top-left coordinate of the player png, as well as the hitbox width and height.  This is used for collision detection.
    */
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
    this.hitBox = {
      hitX: 17,
      hitY: 63,
      width: 67,
      height: 77,
    }
  }
  resetPlayer() {
    //fill this out
  }

  //This is called by the engine for each game tick.
  update() {
    //playerLocation (object): The player's coordinates at each corner, as well as the center point vertically.
    let playerLocation = {
      upLeft: [this.x + this.hitBox.hitX, this.y + this.hitBox.hitY],
      upRight: [this.x + this.hitBox.hitX + this.hitBox.width, this.y + this.hitBox.hitY],
      downLeft: [this.x + this.hitBox.hitX, this.y + this.hitBox.hitY + this.hitBox.height],
      downRight: [this.x + this.hitBox.hitX + this.hitBox.width, this.y + this.hitBox.hitY + this.hitBox.height],
      verticalCenter: (this.y + this.hitBox.hitY + this.hitBox.height + this.hitBox.width + this.y + this.hitBox.hitY) / 2,
    }
    //Check for collision using the current player's location and enemy locations.
    this.checkCollisions(playerLocation, allEnemies);
  }
  //Check to see if the player has collided with the enemy.
  //parameters: playerLocation (object): The player's position.  allEnemies (array): All enemies currently on the screen.
  checkCollisions(playerLocation, allEnemies) {
    //For each enemy, calculate the left, right, top, and bottom bounds of their hitbox.
    allEnemies.forEach((enemy) => {
      let enemyLocation = {
        left: enemy.x + enemy.hitBox.hitX,
        right: enemy.x + enemy.hitBox.hitX + enemy.hitBox.width,
        up: enemy.y + enemy.hitBox.hitY,
        down: enemy.y + enemy.hitBox.hitY + enemy.hitBox.height,
      }
      //Needs to be refactored into functions for performance
      let one = (playerLocation.verticalCenter <= enemyLocation.down) && (playerLocation.verticalCenter >= enemyLocation.up);
      let two = (playerLocation.upLeft[0] <= enemyLocation.right && playerLocation.upLeft[0] >= enemyLocation.left)
      let three = (playerLocation.upRight[0] <= enemyLocation.right && playerLocation.upRight[0] >= enemyLocation.left)
      if (one && (two || three)) {
        resetGame();
      }

    });
  }

  // Draw the player on the screen
  render() {
    //Draw the player hitbox if in debug mode.
    drawHitBox(this.x + this.hitBox.hitX, this.y + this.hitBox.hitY, this.hitBox.width, this.hitBox.height);
    //Draw the player.
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  // Handle keyboard presses from the user.
  // parameters: keyPress (string): The arrow key pressed.
  handleInput(keyPress) {
    /*
    For each keypress, check to see if character is in bounds.  If they are, update their x or y poisition.
      x range 0 : 400
      y range -15 : 400
    */
    switch (keyPress) {
      case 'up':
        //Check for win here
        if (this.y - 83 >= -15) {
          this.y -= 83;
        }
        break;
      case 'down':
        if (this.y + 83 <= 400) {
          this.y += 83;
        }
        break;
      case 'left':
        if (this.x - 100 >= 0) {
          this.x -= 100;
        }
        break;
      case 'right':
        if (this.x + 100 <= 400) {
          this.x += 100;
        }
        break;
    }
  }

}


/*
Global objects
debug (bool): If true, the game is in debug mode.  Player and enemy hitboxes will be visible.
allEnemies (array): A list of all enemy pbject on the screen.
player (object): The player.
*/
let debug = false;
let allEnemies = [];
let player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

//for debugging
let drawHitBox = (x, y, width, height) => {
  ctx.strokeStyle = 'red';
  if (debug === true) {
    ctx.strokeRect(x, y, width, height);
  }
}

//Randomly spawns a new enemy object and adds it to the list of enemies.
let spawnEnemy = () => {
  // 9/1000 chance that an enemy will spawn.
  let roll = Math.floor(Math.random() * 1000) + 1;
  if (roll >= 992) {
    allEnemies.push(new Enemy);
  }
}
//Returns an array of all enemies, removing those that are no longer onscreen.
//parameters: An array of all displayed enemies.
let despawnEnemy = (allEnemies) => {
  //Enemies that can be despawned are removed from the list of all enemies.
  purgedEnemis = allEnemies.filter((enemy) => {
    return (enemy.despawn === false);
  })
  return purgedEnemis;
}

//Resets the game.  Clears the list of enemies, and creates a new player.
let resetGame = () => {
  allEnemies = [];
  player = new Player();
}
