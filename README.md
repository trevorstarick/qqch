#QQCH
## The first rule of QQCH is you don't talk about QQCH

### Core Elements
- JavaScript/HTML5
- 2D platformer/scroller
- Action/Adventure/RPG
- Xbox controller primary
- Mouse/Keyboard secondary
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