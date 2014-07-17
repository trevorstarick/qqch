window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// (function() {
var size = 8,
  speed = 4,
  fps = 60,
  now,
  then = Date.now(),
  interval = 1000 / fps,
  delta;

var meter = new FPSMeter({
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
  history: 50 // How many history states to show in a graph.
});

var canvas = document.getElementById("game");
canvas.width = 640;
canvas.height = 400;

var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;

canvas.oncontextmenu = function(e) {
  e.preventDefault();
};

var Player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  xIncr: 0,
  yIncr: 0,
  height: -size,
  width: size,
  move: function() {
    // console.log(0 <= this.x, this.x <= canvas.width);
    var xFutr = this.x + (this.xIncr * speed);
    var yFutr = this.y + (this.yIncr * speed);
    if (0 <= xFutr && xFutr <= canvas.width - size) {
      this.x = xFutr;
    }
    if (0 <= yFutr && yFutr <= canvas.height - size) {
      this.y = yFutr;
    }
  },
  jump: function() {
    var self = this;
    self.y -= size;
    setTimeout(function() {
      self.y += size;
    }, 100);
  }
};

var Game = function(config) {
  initialized = false;
  paused = false;
  foo = 'bar';
};

var keycombos = [{
  "keys": "a",
  "on_keydown": function() {
    Player.xIncr -= 1;
  },
  "on_keyup": function() {
    Player.xIncr = 0;
  },
  "prevent_repeat": true,
}, {
  "keys": "d",
  "on_keydown": function() {
    Player.xIncr += 1;
  },
  "on_keyup": function() {
    Player.xIncr = 0;
  },
  "prevent_repeat": true,
}, {
  "keys": "space",
  "on_keydown": function() {
    return Player.jump();
  },
  "prevent_repeat": true
}, {
  "keys": "s",
  "on_keydown": function() {
    Player.height = Player.height / 2;
  },
  "on_keyup": function() {
    Player.height = -size;
  },
  "prevent_repeat": true
}, {
  "keys": "down",
  "on_keydown": function() {
    Player.y += size;
  },
  "prevent_repeat": true
}, {
  "keys": "up",
  "on_keydown": function() {
    Player.y -= size;
  },
  "prevent_repeat": true
}];

Game.prototype = {
  init: function() {
    this.initialized = true;
    var listener = new window.keypress.Listener();
    listener.register_many(keycombos);
    console.log('Game initialized...');
  },
  draw: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255, 255, 1)";
    ctx.fillRect(Player.x, Player.y, Player.width, Player.height);
  },
  togglePaused: function() {
    if (this.paused) {
      this.resume();
    } else {
      this.pause();
    }
  },
  pause: function() {
    this.paused = true;
  },
  resume: function() {
    this.paused = false;
  },
  update: function() {
    meter.tickStart();
    Player.move();
    meter.tick();
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
  }
};

var qqch = new Game();

qqch.run();
// })();