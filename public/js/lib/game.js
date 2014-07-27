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
    if (this.gamepads) Input.pollGamepadInput();

    meter.tick();
  }
};

global.Game = module.exports = new Game();