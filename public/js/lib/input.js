var Input = function(config) {
  this.gamepads = [];
  this.axes = [];
  this.buttons = [];
  this.keys = {};
  this.repeat = {
    65: function() {
      Movement.move(-1);
    },
    68: function() {
      Movement.move(+1);
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

    if (!this.keys[key]) {
      if (this.single[key]) this.single[key].call();
      if (this.toggle[key]) this.toggle[key]('down');
    }

    this.keys[key] = true;
  },
  keyup: function(e) {
    var key = e.key || e.keyCode;

    if (this.toggle[key]) this.toggle[key]('up');

    delete this.keys[key];
  },
  pollKeyboardInput: function() {
    for (var key in this.keys) {
      key = +key;
      if (this.repeat[key]) this.repeat[key].call();
    }
  },
  pollGamepadInput: function() {
    var gp = this.gamepads[0];
    var buttons = [];

    if (gp) {

      if (!this.buttons) this.buttons = buttons;
      for (var button in gp.buttons) {
        buttons.push(gp.buttons[button].value);
      }

      if (JSON.stringify(this.buttons) !== JSON.stringify(buttons)) {
        // console.log(this.buttons);
      }

      if (0 < gp.axes[0] || gp.axes[0] < 0) Movement.move(gp.axes[0]);
      if (!this.buttons[0] && this.buttons[0] !== buttons[0]) Movement.jump();
      if (this.buttons[1] !== buttons[1]) Movement.crouch();
      if (this.buttons[14]) Movement.move(-1);
      if (this.buttons[15]) Movement.move(+1);

      this.axes = gp.axes;
      this.buttons = buttons;
    }
  },
  pollGamepads: function() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    for (var i = 0; i < gamepads.length; i++) {
      var gp = gamepads[i];
      if (gp) this.gamepads = gamepads;
    }
  }
};
module.exports = new Input();