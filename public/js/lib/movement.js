var Movement = function(config) {
  this.coordinates = [];
  this.direction = [];
};
Movement.prototype = {
  collisionCheck: function(direction) {
    var a, b, c, d, e, f, g, h;
    var canMove = true;
    var x = Player.x;
    var y = Player.y;

    if (typeof direction !== 'string') {
      if (direction < 0) {
        direction = 'left';
      } else {
        direction = 'right';
      }
    }

    var directions = {
      jump: [
        Math.round(x / 8),
        Math.floor((y + Player.height) / 8)
      ],
      fall: [
        Math.round(x / 8),
        Math.ceil((y - Player.height) / 8)
      ],
      left: [
        Math.floor((x + speed - size / 2) / 8),
        Math.round(y / 8)
      ],
      right: [
        Math.ceil(((x + Player.width - size / 2) - speed) / 8),
        Math.round(y / 8)
      ],
    };

    var check = directions[direction];
    var falling = (y !== height) && !Map.array[directions.fall[0]][directions.fall[1]];

    if (direction === 'left' && Player.x - speed < 0) return false;
    if (direction === 'right' && width < Player.x + Player.width + speed) return false;
    if (direction === 'jump' && falling) return false;
    if (Map.array[check[0]][check[1]]) return false;

    return true;
  },
  set: function(x, y) {
    Player.x = x;
    Player.y = y;
  },
  pollLocation: function() {
    var a, b, c, d, e, f, g, h;
    Player.bound = {
      left: Player.x,
      right: Player.x + Player.width,
    };
  },
  move: function(velocity) {
    if (this.collisionCheck(velocity)) Player.x += velocity * speed;
  },
  crouch: function() {
    // console.log('Crouching:', Player.crouching);

    if (Player.crouching) {
      Player.height = Player.originalHeight / 2;
      Player.crouching = false;
    } else if (!Player.crouching) {
      Player.height = Player.originalHeight;
      Player.crouching = true;
    }
  },
  jump: function() {
    if (this.collisionCheck('jump')) {
      var self = Player;
      self.y -= size;
      self.jumping = true;
      setTimeout(function() {
        Player.y += size;
        Player.jumping = false;
      }, 100);
    }
  },
  fall: function() {
    if (this.collisionCheck('fall')) Player.y += size;
  }
};

module.exports = new Movement();