var Physics = function(config) {
  this.nextTick = false;
};
Physics.prototype = {
  gravity: function() {
    var coordinates = Player.getCoordinates();
    if (coordinates[1] <= height - 1 && !Player.jumping) {
      if (this.nextTick) {
        Movement.fall();
      } else {
        this.nextTick = true;
      }
    }
  }
};

module.exports = new Physics();