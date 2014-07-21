window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

(function() {
  var size = 8,
    speed = 4,
    fps = 60,
    now,
    then = Date.now(),
    interval = 1000 / fps,
    delta,
    width = 640,
    height = 360;

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
    history: 25 // How many history states to show in a graph.
  });

  var canvas = document.getElementById("game");
  canvas.width = 640;
  canvas.height = 400;

  var ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.oImageSmoothingEnabled = false;

  var backgroundCanvas = document.getElementById("background");
  backgroundCanvas.width = 640;
  backgroundCanvas.height = 400;

  var backgroundCtx = backgroundCanvas.getContext("2d");

  function drawBackground() {
    var img = new Image();
    // img.src = 'lead_large.jpg';
    img.onload = function() {
      backgroundCtx.drawImage(img, 0, 0);
    };
  }
  drawBackground();

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
      return Movement.jump();
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

  canvas.oncontextmenu = function(e) {
    e.preventDefault();
  };

  var Player = {
    x: -1,
    y: -1,
    xIncr: 0,
    yIncr: 0,
    height: -size, // To start the player bottom left;
    width: size
  };

  var Movement = function(config) {
    moving = false;
    inAir = false;
    crouch = false;
    direction = 0; // -1: Left; 0: Still; 1: Right
  };
  Movement.prototype = {
    left: function() {},
    right: function() {},
    crouch: function() {},
    move: function() {
      // console.log(0 <= this.x, this.x <= canvas.width);
      var xFutr = Player.x + (Player.xIncr * speed);
      var yFutr = Player.y + (Player.yIncr * speed);
      if (0 <= xFutr && xFutr <= canvas.width - size) {
        Player.x = xFutr;
      }
      if (0 <= yFutr && yFutr <= canvas.height - size) {
        Player.y = yFutr;
      }
    },
    jump: function() {
      var self = Player;
      self.y -= size;
      setTimeout(function() {
        self.y += size;
      }, 100);
    }
  };

  var Entities = function(config) {
    types = {
      me: {}, // Self player
      player: {} // Other players
    };
  };
  Entities.prototype = {
    init: function() {
      // Alloc memory
    },
    spawn: function(type, options) {
      if (type === 'me') {
        Player.x = 1 * size;
        Player.y = canvas.height;
      }
    }
  };

  var Physics = function(config) {};
  Physics.prototype = {
    gravity: function() {}
  };

  var Map = function() {};
  Map.prototype = {
    init: function() {},
    update: function() {},
    render: function() {},
    slide: function(direction) {},
    setViewport: function(height, width) {},
  };

  var Game = function(config) {
    initialized = false;
    paused = false;

    players = 1;

    Entities = new Entities();
    Movement = new Movement();
  };
  Game.prototype = {

    init: function() {
      var listener = new window.keypress.Listener();
      listener.register_many(keycombos);
      console.log('Keys bound...');

      Entities.spawn('me');
      for (var i = 0; i < this.players; i++) {
        Entities.spawn('players', i);
      }
      console.log('Spawned ' + i + ' players...');

      this.initialized = true;

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
      (function listKeysPressed(e) {

      })();
      Movement.move();
      meter.tick();
    },
    debug: function() {

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
})();