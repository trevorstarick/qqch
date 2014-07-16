#QQCH
## The first rule of QQCH is you don't talk about QQCH

`#define design ===  visual medium `
`#define architecture === internal design`

### PRETTY HAPPY WITH THESE IDEAS
- 2D scroller
- Xbox Controller support
- meant to be played with more than one person
- 1,2,3,4 split screen
- Characters sync to cloud service
- pseudo proceduraly generated map
- choose your own adventure style endings
- dnd style characters architecture
- space/fantasy/qqch
- websockets/webrtc online multiplayer
- random item drops with [0-5] quality [useless,meh,buffed,dayum,sheeeeit,heath ledger-ndary]
- use diablo-esque item system.
- art style tbd
- each player has uuid, map seed is based on the sum average of the uuids * time.
- once a player has died, their character is whiped on the cloud and on their local client. **dis shįt be bürtal søn**
- player stats for this game, this life, best life and total.
- friend leaderboard (steam integration)
- satire/cynic writing style. this game is a comedy not a beöwolf competitor.

### NEEDS FURTHER DISCUSSION
- multi player games can be paused/stopped but only players who were present at the last save may continue. if you leave, you're gone from that game.


## CALCULATIONS/ALGORITHMS

###mapLength calculation
- mapLength is math.range(lengthMin,x) where x starts as lengthMax and +-1 ever level complete.
- if more than one player. take average of mapLength.

## ARCHITECTURE

###mapArray arch.
- 2D array where each element has a UUID built from the ID system created for DFJS.
- ID system may need more work due to the fact that users need to be able to pass through blocks whilst being able to jump on them (a la mario)
- characters will not occupy a element in the mapArray as you will need to be able to see behind them.

---

###characterObject arch.

