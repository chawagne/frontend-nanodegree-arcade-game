// Enemies our player must avoid
class Enemy {
  constructor() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
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
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);
    this.despawn = this.despawnCheck();
  }

  // Draw the enemy on the screen, required method for game
  render() {
    drawHitBox(this.x + this.hitBox.hitX, this.y + this.hitBox.hitY, this.hitBox.width, this.hitBox.height);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  randomSpeed() {
    //Randomly determine speed
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
  randomLocation() {
    //Randomly determine speed
    let randomNum = Math.floor(Math.random() * 3);
    switch (randomNum) {
      //Slow speed
      case 0:
        return 62;
        //Medium speed
      case 1:
        return 145;
        //Fast speed
      case 2:
        return 228;
    }
  }
  despawnCheck() {
      return this.x > 500;
    }


}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
  constructor() {
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

  update() {
    //Get player corner coordinates
    let playerLocation = {
      upLeft: [this.x + this.hitBox.hitX, this.y + this.hitBox.hitY],
      upRight: [this.x + this.hitBox.hitX + this.hitBox.width, this.y + this.hitBox.hitY],
      downLeft: [this.x + this.hitBox.hitX, this.y + this.hitBox.hitY + this.hitBox.height],
      downRight: [this.x + this.hitBox.hitX + this.hitBox.width, this.y + this.hitBox.hitY + this.hitBox.height],
      verticalCenter: (this.y + this.hitBox.hitY + this.hitBox.height + this.hitBox.width + this.y + this.hitBox.hitY) / 2,
    }
    this.checkCollisions(playerLocation, allEnemies);
  }
  checkCollisions(playerLocation, allEnemies) {

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
        console.log('hit!')
      }

    });
  }


  render() {
    drawHitBox(this.x + this.hitBox.hitX, this.y + this.hitBox.hitY, this.hitBox.width, this.hitBox.height);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  handleInput(keyPress) {
    /*Check to see if character is in bounds.
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let debug = true;
let allEnemies = [];
const player = new Player();

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

//spawn enemy
let spawnEnemy = () => {
  let roll = Math.floor(Math.random() * 1000) + 1;
  if (roll >= 992) {
    allEnemies.push(new Enemy);
  }
}
let despawnEnemy = (allEnemies) => {
  purgedEnemis = allEnemies.filter( (enemy) =>{
    return (enemy.despawn === false);
  })
  return purgedEnemis;
}
