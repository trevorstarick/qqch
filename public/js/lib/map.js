var Map = function() {
  this.array = [];
};

Map.prototype = {
  init: function() {
    this.array = new Array(width / size);
    for (i = 0; i < width / size; i++) {
      this.array[i] = new Array(height / size);
    }
  }
};

module.exports = new Map();