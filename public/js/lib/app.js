window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// (function() {
Game = require('./game.js');
Entities = require('./entities.js');
Input = require('./input.js');
Map = require('./map.js');
Physics = require('./physics.js');
Movement = require('./movement.js');

width = 640;
height = 360;
size = 8;
speed = 2;
fallingSpeed = 8;
fps = 60;
then = Date.now();
interval = 1000 / fps;
now = '';
delta = '';

Player = {
  x: 4 * size,
  y: 40 * size,
  xIncr: 0,
  yIncr: 0,
  originalHeight: -size,
  height: -size,
  width: size,
  jumping: false,
  crouching: false,
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