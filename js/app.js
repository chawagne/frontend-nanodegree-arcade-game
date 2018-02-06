// Enemies our player must avoid
class Enemy {
  constructor() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = this.randomSpeed();
    this.x = 0;
    this.y = this.randomLocation();
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);
  }

  // Draw the enemy on the screen, required method for game
  render() {
    drawHitBox(this);
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

}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
  constructor() {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
  }

  update() {
    //collision detection
    allEnemies.forEach(enemy => {
      if (Math.floor(enemy.x) === Math.floor(player.x)) {
        console.log('hit');
      }
    })
  }
  render() {
    drawHitBox(this);
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
let allEnemies = [new Enemy()];
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
let drawHitBox = (entity) => {
  ctx.strokeStyle = 'red';
  if (entity === player) {
    ctx.strokeRect(entity.x+17, entity.y+63, 67, 77);
  } else {
    ctx.strokeRect(entity.x, entity.y+77, 100, 68);
  }

}
