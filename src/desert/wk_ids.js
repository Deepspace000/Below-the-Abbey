/* ==========================================================================
   THE WESTERN KINGDOMS, shared numbers (written first so that the three builders agree). Level 476 holds the Black Swill; a gate that opens in the Deeper Hollow maze (475) once he is dead
   leads to the Maze of Gardens (GARDEN, level 490), whose far end leads to the peaceful town of Wenlock (WENLOCK, level 496; its house interiors use 7100 to 7199, the garden's small rooms 491 to 495).
   Each builder sets its own start when its level is built, and the others read it only at run time:  WK.GSTART = {x,y,f}  (set by the garden builder: where the party arrives from the gate),
   WK.WSTART = {x,y,f}  (set by the Wenlock builder: where the party arrives from the garden), WK.GBACK = {x,y,f}  (set by the garden builder: where the party stands when it comes back from Wenlock).
   wkMet(what) is the hand-in hook of the main quest (defined by the quest builder): 'garden' when the party reaches the far end of the garden, 'wenlock' on entering Wenlock, 'mayor' when the party has spoken to the mayor.
   ========================================================================== */
const WK={GARDEN:490,WENLOCK:496,GARDEN_ROOMS:[491,492,493,494,495],WENLOCK_HOUSES:[7100,7199],WELL:[497,498,499,500],WELLDOOR:null,WELLBACK:null,GSTART:null,WSTART:null,GBACK:null};
if(typeof wkMet==='undefined'){var wkMet=function(what){}} // replaced by the quest builder (src/desert/blackswill.js)
/* Under the town well of Wenlock: dungeon levels WELL (497 to 500; verify free). WK.WELLDOOR={x,y} is the well's square in Wenlock (set by the town builder, who also calls goToLevel(497,...) from it once the well quest has opened it); WK.WELLBACK={x,y,f} where the party stands when it climbs out (set by the town builder). */
