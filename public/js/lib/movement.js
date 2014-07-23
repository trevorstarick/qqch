var Movement = function(config) {
  this.coordinates = [];
  this.direction = [];
};
Movement.prototype = {
  collisionCheck: function(direction) {
    var a, b, c, d, e, f, g, h;
    var z = Player.collision.round;

    a = z[0][0];
    b = z[0][1];
    c = z[0][2];
    d = z[1][2];
    e = z[2][2];
    f = z[2][1];
    g = z[2][0];
    h = z[1][0];

    var directions = {
      jump: [b],
      fall: [f],
      left: [h],
      right: [d],
    };

    // var directions = {
    //   jump: [a, b, c],
    //   fall: [e, f, g],
    //   left: [a, h, g],
    //   right: [c, d, e],
    // };

    var whichBlocks = [];
    var canMove = true;
    var check = directions[direction];

    // console.log(direction, JSON.stringify(check));
    if (direction === 'left' && Player.x - speed < 0) {
      return false;
    }

    if (direction === 'right' && width < Player.x + Player.width + speed) {
      return false;
    }

    for (var i = 0; i < check.length; i++) {
      var k = check[i][0];
      if (Map.array[k[0]][k[1]]) {
        whichBlocks.push(k);
        canMove = false;
      }
    var falling = (y !== height) && !Map.array[directions.fall[0]][directions.fall[1]];
    if (direction === 'jump' && falling) {
      return false;
    }
    // console.log(canMove, whichBlocks);
    return canMove;
  },
  set: function(x, y) {
    console.log(x, y);
    Player.x = x;
    Player.y = y;
  },
  pollLocation: function() {
    var a, b, c, d, e, f, g, h;
    var o = [Player.x, Player.y];

    a = [Player.x - Player.width, Player.y + Player.height];
    b = [Player.x, Player.y + Player.height];
    c = [Player.x + Player.width, Player.y + Player.height];
    d = [Player.x + Player.width, Player.y];
    e = [Player.x + Player.width, Player.y - Player.height];
    f = [Player.x, Player.y - Player.height];
    g = [Player.x - Player.width, Player.y - Player.height];
    h = [Player.x - Player.width, Player.y];

    Player.collision.actual = [
      [
        [a],
        [b],
        [c]
      ],
      [
        [h],
        [o],
        [d]
      ],
      [
        [g],
        [f],
        [e]
      ]
    ];

    o = [Math.round(Player.x / 8), Math.round(Player.y / 8)];

    a = [Math.floor((Player.x - Player.width) / 8), Math.floor((Player.y + Player.height) / 8)];
    b = [Math.round(Player.x / 8), Math.floor((Player.y + Player.height) / 8)];
    c = [Math.ceil((Player.x + Player.width) / 8), Math.floor((Player.y + Player.height) / 8)];
    d = [Math.ceil((Player.x + Player.width) / 8), Math.round(Player.y / 8)];
    e = [Math.ceil((Player.x + Player.width) / 8), Math.ceil((Player.y - Player.height) / 8)];
    f = [Math.round(Player.x / 8), Math.ceil((Player.y - Player.height) / 8)];
    g = [Math.floor((Player.x - Player.width) / 8), Math.ceil((Player.y - Player.height) / 8)];
    h = [Math.floor((Player.x - Player.width) / 8), Math.round(Player.y / 8)];

    Player.collision.round = [
      [
        [a],
        [b],
        [c]
      ],
      [
        [h],
        [o],
        [d]
      ],
      [
        [g],
        [f],
        [e]
      ]
    ];
  },
  move: function(direction) {
    if (this.collisionCheck(direction)) {
      switch (direction) {
        case "left":
          Player.x -= 1 * speed;
          break;
        case "right":
          Player.x += 1 * speed;
          break;
      }
    }
  },
  jump: function() {
    if (!Player.jumping) {
      if (this.collisionCheck('jump')) {
        var self = Player;
        self.y -= size;
        self.jumping = true;
        setTimeout(function() {
          console.log('a');
          Player.y += size;
          Player.jumping = false;
        }, 100);
      }
    }
  },
  crouch: function(key) {
    if (!Player.crouching) {
      Player.height = Player.height / 2;
      Player.crouching = true;
    } else if (!Player.crouching) {
      Player.height = Player.height * 2;
      Player.crouching = false;
    }
  },
  fall: function() {
    if (this.collisionCheck('fall')) {
      Player.y += size;
    }
  }
};

module.exports = new Movement();