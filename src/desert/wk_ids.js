/* ==========================================================================
   THE WESTERN KINGDOMS, shared numbers (written first so that the three builders agree). Level 476 holds the Black Swill; a gate that opens in the Deeper Hollow maze (475) once he is dead
   leads to the Maze of Gardens (GARDEN, level 490), whose far end leads to the peaceful town of Wenlock (WENLOCK, level 496; its house interiors use 7000 to 7099, the garden's small rooms 491 to 495).
   Each builder sets its own start when its level is built, and the others read it only at run time:  WK.GSTART = {x,y,f}  (set by the garden builder: where the party arrives from the gate),
   WK.WSTART = {x,y,f}  (set by the Wenlock builder: where the party arrives from the garden), WK.GBACK = {x,y,f}  (set by the garden builder: where the party stands when it comes back from Wenlock).
   wkMet(what) is the hand-in hook of the main quest (defined by the quest builder): 'garden' when the party reaches the far end of the garden, 'wenlock' on entering Wenlock, 'mayor' when the party has spoken to the mayor.
   ========================================================================== */
const WK={GARDEN:490,WENLOCK:496,GARDEN_ROOMS:[491,492,493,494,495],WENLOCK_HOUSES:[7000,7099],WELL:[497,498,499,500],WELLDOOR:null,WELLBACK:null,GSTART:null,WSTART:null,GBACK:null};
if(typeof wkMet==='undefined'){var wkMet=function(what){}} // replaced by the quest builder (src/desert/blackswill.js)
/* Under the town well of Wenlock: dungeon levels WELL (497 to 500; verify free). WK.WELLDOOR={x,y} is the well's square in Wenlock (set by the town builder, who also calls goToLevel(497,...) from it once the well quest has opened it); WK.WELLBACK={x,y,f} where the party stands when it climbs out (set by the town builder). */
/* The Witch's Wood (Blackbriar Wood), level 520, entered from the gate of Blackbriar Lane at the north edge of Wenlock; its small rooms are 521 (Grisselda's cottage), 522 (the cellar) and 523 (the kitchen with the oven). WK.WITCHSTART is where the party stands on arriving from Wenlock, WK.WITCHBACK where it stands on coming out of the gate in Wenlock. */
WK.WITCH=520;WK.WITCH_ROOMS=[521,522,523];WK.WITCHSTART={x:27,y:53,f:0};WK.WITCHBACK={x:38,y:4,f:2};
/* The Wenlock Graveyard (level 530, rated 84) behind the lych-gate of Churchyard Lane at the west end of Wenlock; its crypt is 531 and its four mazes 532 to 535 (see gy_art.js, tools/GRAVEYARD_NOTES.md). WK.GRAVESTART is where the party stands on arriving from Wenlock, WK.GRAVEBACK where it stands on coming out of the gate in Wenlock. */
WK.GRAVE=530;WK.GRAVECRYPT=531;WK.GRAVEMAZES=[532,533,534,535];WK.GRAVESTART={x:66,y:35,f:3};WK.GRAVEBACK={x:4,y:31,f:1};
