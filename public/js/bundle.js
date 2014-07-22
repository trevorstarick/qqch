(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// (function() {
Game = require('./game.js');
Entities = require('./entities.js');
Input = require('./input.js');
Map = require('./map.js');
Physics = require('./physics.js');
Movement = require('./movement.js');

size = 8;
speed = 2;
fps = 60;
width = 640;
height = 360;
then = Date.now();
interval = 1000 / fps;
now = '';
delta = '';

Player = {
  x: 4 * size,
  y: 40 * size,
  xIncr: 0,
  yIncr: 0,
  // height: -3 * size,
  // width: 2 * size,
  height: -size,
  width: size,
  jumping: false,
  collision: {},
  getCoordinates: function() {
    return [this.x, this.y];
  }
};

meter = new FPSMeter({
  interval: 100, // Update interval in milliseconds.
  smoothing: 10, // Spike smoothing strength. 1 means no smoothing.
  show: 'fps', // Whether to show 'fps', or 'ms' = frame duration in milliseconds.
  toggleOn: 'click', // Toggle between show 'fps' and 'ms' on this event.
  decimals: 1, // Number of decimals in FPS number. 1 = 59.9, 2 = 59.94, ...
  maxFps: fps, // Max expected FPS value.
  threshold: 100, // Minimal tick reporting interval in milliseconds.

  // Meter position
  position: 'absolute', // Meter position.
  zIndex: 10, // Meter Z index.
  left: '5px', // Meter left offset.
  top: '5px', // Meter top offset.
  right: 'auto', // Meter right offset.
  bottom: 'auto', // Meter bottom offset.
  margin: '0 0 0 0', // Meter margin. Helps with centering the counter when left: 50%;

  // Theme
  theme: 'dark', // Meter theme. Build in: 'dark', 'light', 'transparent', 'colorful'.
  heat: 2, // Allow themes to use coloring by FPS heat. 0 FPS = red, maxFps = green.

  // Graph
  graph: 1, // Whether to show history graph.
  history: 25 // How many history states to show in a graph.
});

/** 
 * Canvas constructor
 * @constructor
 */
Canvas = {};
$canvas = $('canvas');

for (var i = 0; i < $canvas.length; i++) {
  var id = $canvas[i].id;

  Canvas[id] = document.getElementById(id);
  Canvas[id].height = height;
  Canvas[id].width = width;
  Canvas[id + 'Ctx'] = Canvas[id].getContext('2d');
  Canvas[id + 'Ctx'].imageSmoothingEnabled = false;
}

Canvas.game.addEventListener("click", function(e) {
  e.preventDefault();

  var rect = Canvas.game.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = Math.floor((e.clientY - rect.top) / size) * size;
  y += size;

  Entities.spawn('block', {
    coordinates: [x, y],
    id: Object.keys(Entities.index).length + 1
  });
}, false);

Canvas.game.oncontextmenu = function(e) {
  e.preventDefault();

  var rect = Canvas.game.getBoundingClientRect();
  var x = Math.floor((e.clientX - rect.left) / size) * size;
  var y = Math.floor((e.clientY - rect.top) / size) * size;
  y += size;

  Movement.set(x, y);
};

function drawBackground() {
  var img = new Image();
  // img.src = 'lead_large.jpg';
  img.onload = function() {
    Canvas.backgroundCtx.drawImage(img, 0, 0);
  };
}
drawBackground();

Game.init();
Game.run();
// })();
},{"./entities.js":2,"./game.js":3,"./input.js":4,"./map.js":5,"./movement.js":6,"./physics.js":7}],2:[function(require,module,exports){
var Entities = function(config) {
  this.types = {
    me: {}, // Self player
    player: {}, // Other players
    block: {}
  };
  this.index = {};
};
Entities.prototype = {
  spawn: function(type, options) {
    options.coordinates = options.coordinates.map(function(num) {
      return Math.floor(num / size);
    });

    console.log(options);

    var x = options.coordinates[0];
    var y = options.coordinates[1];

    Map.array[x][y] = options.id;
    this.index[options.id] = options;
  }
};

module.exports = new Entities();
},{}],3:[function(require,module,exports){
(function (global){
var Game = function(config) {
  this.gamepads = true;
  this.initialized = false;
  this.paused = false;
  this.players = 1;
};

Game.prototype = {
  init: function() {
    Map.init();
    console.log('Initialized map...');

    Input.init();

    window.addEventListener("gamepadconnected", function(e) {
      console.log('gamepadconnected', e);
      Game.gamepads = true;
    });
    window.addEventListener("gamepaddisconnected", function(e) {
      console.log('gamepaddisconnected', e);
      Game.gamepads = false;
    });

    document.addEventListener("keydown", function(e) {
      // console.log('keydown', e);
      Input.keydown(e);
    }, false);
    document.addEventListener("keyup", function(e) {
      // console.log('keyup', e);
      Input.keyup(e);
    }, false);

    this.initialized = true;
    console.log('Game initialized...');
  },
  draw: function() {
    Canvas.gameCtx.clearRect(0, 0, width, height);
    Canvas.gameCtx.fillStyle = "rgba(255,255, 255, 1)";
    Canvas.gameCtx.fillRect(Player.x, Player.y, Player.width, Player.height);

    for (var each in Entities.index) {
      var data = Entities.index[each];
      var x = data.coordinates[0];
      var y = data.coordinates[1];

      Canvas.entitiesCtx.fillStyle = "rgba(255,0, 255, 1)";
      Canvas.entitiesCtx.fillRect(x * size, (y - 1) * size, size, size);
    }
  },
  run: function() {
    now = Date.now();
    delta = now - then;

    if (!this.initialized) {
      this.init();
    } else if (!this.paused) {
      if (delta > interval) {
        this.update();

        then = now - (delta % interval);

        this.draw();
      }
    }

    requestAnimationFrame(this.run.bind(this));
  },
  pause: function() {
    this.paused = true;
  },
  resume: function() {
    this.paused = false;
  },
  update: function() {
    meter.tickStart();

    Movement.pollLocation();
    Physics.gravity();
    Input.pollKeyboardInput();
    Input.pollGamepads();

    // console.log(Input.gamepads.length);
    if (this.gamepads) {
      Input.pollGamepadInput();
    }

    meter.tick();
  }
};

global.Game = module.exports = new Game();
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
var Input = function(config) {
  this.gamepads = [];
  this.axes = [];
  this.buttons = [];
  this.keys = {};

  this.keybindings = {
    65: function() {
      Movement.move('left');
    },
    68: function() {
      Movement.move('right');
    },
    32: function() {
      Movement.jump();
    },
    83: function() {
      Movement.crouch();
    }
  };
};
Input.prototype = {
  init: function() {},
  keydown: function(e) {
    var key = e.key || e.keyCode;
    this.keys[key] = true;
  },
  keyup: function(e) {
    var key = e.key || e.keyCode;
    delete this.keys[key];
  },
  pollKeyboardInput: function() {
    for (var key in this.keys) {
      key = +key;
      if (this.keybindings[key]) {
        this.keybindings[key].call();
      }
    }
  },
  pollGamepadInput: function() {
    var gp = this.gamepads[0];

    if (gp) {
      if (JSON.stringify(this.axes) !== JSON.stringify(gp.axes)) {
        console.log(gp.axes);
        if (gp.axes[0] < 0) {
          console.log('left');
        }
        if (0 < gp.axes[0]) {
          console.log('right');
        }
        Player.xIncr = gp.axes[0];

        // if (gp.axes[1] < 0) {
        //   console.log('up');
        // }
        // if (0 < gp.axes[1]) {
        //   console.log('down');
        // }
      }
      this.axes = gp.axes;

      var buttons = [];
      for (var button in gp.buttons) {
        buttons.push(gp.buttons[button].value);
      }
      if (JSON.stringify(this.buttons) !== JSON.stringify(buttons)) {
        console.log(buttons);
        if (buttons[0]) {
          console.log('jump');
          Movement.jump();
        }
        if (buttons[1] && !Player.crouching) {
          console.log('crouch');
          Movement.crouch();
        }
        console.log(this.buttons[1], buttons[1]);
        if (this.buttons[1] === 1 && buttons[1] === 0) {
          console.log("/crouch");
          Player.height = -size;
          Player.crouching = false;
        }
      }
      this.buttons = buttons;
    }
  },
  pollGamepads: function() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    for (var i = 0; i < gamepads.length; i++) {
      var gp = gamepads[i];
      if (gp) {
        this.gamepads = gamepads;
      }
    }
  }
};
module.exports = new Input();
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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

    for (var i = 0; i < check.length; i++) {
      var k = check[i][0];
      if (Map.array[k[0]][k[1]]) {
        whichBlocks.push(k);
        canMove = false;
      }
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
},{}],7:[function(require,module,exports){
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
},{}]},{},[1])