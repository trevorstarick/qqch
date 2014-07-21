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

  /** 
   * Canvas constructor
   * @constructor
   */
  var Canvas = {};
  var $canvas = $('canvas');

  for (var i = 0; i < $canvas.length; i++) {
    var id = $canvas[i].id;

    Canvas[id] = document.getElementById(id);
    Canvas[id].height = height;
    Canvas[id].width = width;
    Canvas[id + 'Ctx'] = Canvas[id].getContext('2d');
    Canvas[id + 'Ctx'].imageSmoothingEnabled = false;
  }

  function drawBackground() {
    var img = new Image();
    // img.src = 'lead_large.jpg';
    img.onload = function() {
      Canvas.backgroundCtx.drawImage(img, 0, 0);
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

  Canvas.game.addEventListener("click", function(e) {
    e.preventDefault();

    var rect = Canvas.game.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = Math.floor((e.clientY - rect.top) / 8) * 8;
    y += 8;

    Entities.spawn('block', {
      coordinates: [x, y],
      id: Object.keys(Entities.index).length + 1
    });
  }, false);

  Canvas.game.oncontextmenu = function(e) {
    e.preventDefault();

    var rect = Canvas.game.getBoundingClientRect();
    var x = Math.floor((e.clientX - rect.left) / 8) * 8;
    var y = Math.floor((e.clientY - rect.top) / 8) * 8;
    y += 8;

    Movement.move(x, y);
  };

  var Player = {
    x: 0,
    y: 0,
    xIncr: 0,
    yIncr: 0,
    height: -size, // To start the player bottom left;
    width: size,
    jumping: false,
    coordinates: function() {
      return [this.x, this.y];
    }
  };

  var Movement = function(config) {};
  Movement.prototype = {
    move: function(x, y) {
      if (x && y) {
        console.log(x, y);
        Player.x = x;
        Player.y = y;
      } else {
        this.collision();
      }
    },
    collision: function() {
      var xFutr = Player.x + (Player.xIncr * speed);
      var yFutr = Player.y + Player.yIncr;

      if (0 <= xFutr && xFutr <= width - size) {
        if (!Map.array[Math.ceil(xFutr / 8)][yFutr / 8] && !Map.array[Math.floor(xFutr / 8)][yFutr / 8]) {
          Player.x = xFutr;
          Player.y = yFutr;
        }
      }
    },
    jump: function() {
      var self = Player;
      self.y -= size;
      self.jumping = true;
      setTimeout(function() {
        Movement.fall();
        Player.jumping = false;
      }, 100);
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

  var Physics = function(config) {
    this.nextTick = false;
  };
  Physics.prototype = {
    gravity: function() {
      var coordinates = Player.coordinates();
      if (coordinates[1] <= height - 1 && !Player.jumping) {
        if (this.nextTick) {
          Movement.fall();
        } else {
          this.nextTick = true;
        }
      }
    }
  };

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

  var Game = function(config) {
    this.initialized = false;
    this.paused = false;

    this.players = 1;

    Map = new Map();
    Movement = new Movement();
    Entities = new Entities();
    Physics = new Physics();
  };
  Game.prototype = {
    init: function() {
      var listener = new window.keypress.Listener();
      listener.register_many(keycombos);
      console.log('Keys bound...');

      Map.init();
      console.log('Initialized map...');
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
    update: function() {
      meter.tickStart();

      Movement.move();
      Physics.gravity();

      meter.tick();
    }
  };
  window.qqch = new Game();
  qqch.run();
})();