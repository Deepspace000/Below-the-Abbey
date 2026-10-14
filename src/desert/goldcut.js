/* ==========================================================================
   LESS GOLD. The party should never end up rich. One curve is used for every large sum of gold in the game: small sums are left alone, and
   everything above 80 gold counts a fifth over that. Quest rewards are cut once, here, after every quest is defined, so that the reward
   shown and the reward paid are the same; chests and hoards call goldCut when they pay out.
   ========================================================================== */
const goldCut=g=>g<=80?g:Math.round((80+(g-80)*.2)/5)*5;
for(const id in QUESTS){const r=QUESTS[id].reward;if(r&&r.gold&&!r._cut){r.gold=goldCut(r.gold);r._cut=1}}
