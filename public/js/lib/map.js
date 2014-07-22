var Map = function() {
  this.array = [];
};

Map.prototype = {
  init: function() {
    this.array = new Array(width / 8);
    for (i = 0; i < width / 8; i++) {
      this.array[i] = new Array(height / 8);
    }
  },
  update: function() {},
  render: function() {},
  slide: function(direction) {},
  setViewport: function(height, width) {},
};

module.exports = new Map();