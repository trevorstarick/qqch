var Movement = function(config) {};
Movement.prototype = {
  move: function(x, y) {
    if (x && y) {
      console.log(x, y);
      Player.x = x;
      Player.y = y;
    } else {
      var _speed = speed;
      if (Player.crouching) {
        _speed = _speed * (2 / 5);
      }
      var xFutr = Player.x + (Player.xIncr * _speed);
      var yFutr = Player.y + Player.yIncr;

      if (0 <= xFutr && xFutr <= width - size) {
        if (!Map.array[Math.ceil(xFutr / 8)][yFutr / 8] && !Map.array[Math.floor(xFutr / 8)][yFutr / 8]) {
          Player.x = xFutr;
          Player.y = yFutr;
        }
      }
    }
  },
  jump: function() {
    var y = Math.floor(Player.y / 8) - 1;

    var left = !Map.array[Math.floor((Player.x - 1) / 8) + 1][y];
    var right = !Map.array[Math.floor(Player.x / 8)][y];

    if (left && right) {
      var self = Player;
      self.y -= size;
      self.jumping = true;
      setTimeout(function() {
        var y = Math.floor(Player.y / 8) + 1;

        var left = !Map.array[Math.floor((Player.x - 1) / 8) + 1][y];
        var right = !Map.array[Math.floor(Player.x / 8)][y];

        if (left && right) {
          Player.y += size;
        }
        Player.jumping = false;
      }, 100);
    }
  },
  fall: function() {
    var y = Math.floor(Player.y / 8) + 1;

    var left = !Map.array[Math.floor((Player.x - 1) / 8) + 1][y];
    var right = !Map.array[Math.floor(Player.x / 8)][y];

    if (left && right) {
      Player.y += size;
    }
  }
};

module.exports = new Movement();