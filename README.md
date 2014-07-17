#QQCH
## The first rule of QQCH is you don't talk about QQCH

### Core Elements
- JavaScript/HTML5
- 2D platformer/scroller
- Action/Adventure/RPG
- Xbox controller primary
- Mouse/Keyboard secondary
- Chromecast cause why not
- 1-4 player split screen
- Characters sync to cloud service
- Pseudo proceduraly generated/[herringbone](http://nothings.org/gamedev/herringbone/) map
- Choose your own Adventure story progression
- DnD characters architecture
- Space/Fantasy theme
- Online multiplayer through websockets/webrtc
- Random item drops with different quality [useless,meh,buffed,dayum,sheeeeit,heath ledger-ndary]
- Diablo-esque item system
- Art style TBD
- Each player has UUID, map seed is based on the sum average of the UUIDs * Unix timestamp
- Once a player has died, their character is whiped on the cloud and maybe on their local client **dis shįt be bürtal søn**
- Player statistics for [current game, this life, best life, total play]
- Friend leaderboard (Steam integration)
- Satire/cynic writing style

### NEEDS FURTHER DISCUSSION
- Multi-player games can be paused/stopped but only players who were present at the last save/end of the game may continue. If you leave, you're gone from that game until its done.


## CALCULATIONS/ALGORITHMS

###mapLength calculation
- `mapLength` is `Math.range(lengthMin,x)` where `x` starts as `lengthMax` and `x+=1` for every level completed
- If more than one player; take average of `mapLength`.

## ARCHITECTURE

###mapArray
- 2D array where each element has a UUID built from the ID system created for DFJS
- ID system may need more work due to the fact that users need to be able to pass through blocks whilst being able to jump on them
- Characters will not occupy a element in the mapArray as you will need to be able to see behind them.

###characterObject
- Saved as JSON
- Saved in LocalStorage

```JavaScript
{
	"name": "TrevorStarick",
	"prefix": "Über",
	"class": "Wizard",
	"level": 51,
	"items": [
		0x1CEB00DA,
		0x00BAB10C,
		0xDEADBEEF,
		0xFEE1DEAD,
		0xBAADF00D
	],
	"uuid": "deadbeef-dead-beef-dead-beef00000075",
	""
}
```

###gameStructure

- RequireJS/Browserify

```
.
├── Gruntfile.js
├── public
│	├── index.html
│	├── dist
│	│   ├── dfjs.js
│	│   └── dfjs.min.js
│	├── gamefiles
│	│	├── sounds
│	│	│   ├── 00_main.ogg
│	│	│   ├── 01_theme.ogg
│	│	│   └── 99_ending.ogg
│	│	└── images
│	│	    ├── items.png
│	│	    ├── armour.png
│	│	    └── enviroment.png
│	├── css
│	│   ├── bootstrap-theme.min.css
│	│   ├── bootstrap.min.css
│	│   └── stylesheet.css
│	├── fonts
│	│   ├── glyphicons-halflings-regular.eot
│	│   ├── glyphicons-halflings-regular.svg
│	│   ├── glyphicons-halflings-regular.ttf
│	│   └── glyphicons-halflings-regular.woff
│	├── images
│	│   ├── button_close.png
│	│   ├── button_close_hover.png
│	│   └── top-titlebar.png
│	├── js
│	│   ├── bootstrap.min.js
│	│   ├── jquery.min.js
│	│   ├── stats.min.js
│	│   └── titlebar.js
│	└── package.json
│
├──	lib
│	├── main.js
│	├── core
│	│   ├── entities.js
│	│   ├── game.js
│	│   ├── map.js
│	│   ├── physics.js
│	│   └── seedrandom.js
│	├── ai
│	│	├── index.js
│	│   └── pathfinding.js
│	├── input
│	│	├── index.js
│	│   └── keybindings.js
│	├── physics
│	│   └── index.js
│	└── sound
│	    └── keypress.js
├── build
│	└── releases
│		└──qqch
│			├── windows
│			│	└── *
│			└── mac
│				└── *
└── node_modules
	└── *

```

## Module skeleton

1. Declare the object by name and as a function.
2. Define any object related variables with `this`
3. Define the object prototypes
4. Instantiate the object and set as the exported module

#### Example:
```
// Create new object and load config if needed
var Map = function(config) {
  this.initialized = false;
};

// Initialize prototype
Map.prototype = {
  // Create new function
  init: function() {
    for (var x = 0; x <= 80 - 1; x++) {
      var row = [];
      for (var y = 0; y <= 45 - 1; y++) {
        row.push(-1);
      }
      Game.map.push(row);
    }
    this.initialized = true;
    console.log('Map initialized...');
  },
  // Create another function
  foobar: function(argument) {
    var result = argument.substring(0, 16);
    return result;
  }
};

// Instantiate and return Object.

// Alternatively you can just do this on
// the other side but it seems easier this way.

// If the Object/Module requires a config,
// you'll have instantiate it in whichever
// module or function has the config.

module.exports = new Map();
```

## How to Build

I provide a fully compiled version of the game in the `dist` folder. Both plain and minified formats are in there.

Install NPM if you haven't already done so. NPM is a package manager that ships with Node.js. Then open up your console and navigate to the root folder of this project.

Run `npm install` once to install all the dependencies needed by this project. Next there are a few options:

Run `grunt build` to perform a new bundle build to the `dist` folder and a new node-webkit build to the `build` folder. This way Browserify will generate a bundle from every required script in the `lib` folder, this will also generate a minified file of the bundle. This is preferred when you are done developing and want to push your new changes, as this version doesn't include the debug map.

Run `grunt dev` to watch every module needed in the project for changes. Watchify will take care of rebuilding the bundle so the only thing you have to do is refresh your browser. No need to run `grunt build` everytime you make a change. This version includes a debug map so you are able to debug single files while the .js file included is still the bundle file.

Run `grunt debug` to let JSHint check the code for you, a tool that helps to detect errors and potential problems in your JavaScript code.