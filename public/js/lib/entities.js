var Entities = function(config) {
  this.types = {
    me: {}, // Self player
    player: {}, // Other players
    block: {}
  };
  this.index = {};
};
Entities.prototype = {
  init: function() {
    // Alloc memory
  },
  spawn: function(type, options) {
    options.coordinates = options.coordinates.map(function(num) {
      return Math.floor(num / 8);
    });

    console.log(options);

    var x = options.coordinates[0];
    var y = options.coordinates[1];

    Map.array[x][y] = options.id;
    Entities.index[options.id] = options;
  }
};

module.exports = new Entities();