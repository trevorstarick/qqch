var Input = function(config) {
  this.gamepads = [];
  this.axes = [];
  this.buttons = [];
  this.keys = {};
  this.repeat = {
    65: function() {
      Movement.move('left');
    },
    68: function() {
      Movement.move('right');
    }
  };
  this.single = {
    32: function() {
      Movement.jump();
    }
  };
  this.toggle = {
    83: function(status) {
      Movement.crouch(status);
    }
  };
};
Input.prototype = {
  init: function() {},
  keydown: function(e) {
    var key = e.key || e.keyCode;
    if (this.single[key]) {
      if (!this.keys[key]) {
        this.single[key].call();
      }
    }

    if (this.toggle[key]) {
      if (!this.keys[key]) {
        this.toggle[key]('down');
      }
    }

    this.keys[key] = true;
  },
  keyup: function(e) {
    var key = e.key || e.keyCode;

    if (this.toggle[key]) {
      this.toggle[key]('up');
    }

    delete this.keys[key];
  },
  pollKeyboardInput: function() {
    for (var key in this.keys) {
      key = +key;
      // Repeats function
      if (this.repeat[key]) {
        this.repeat[key].call();
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