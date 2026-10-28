/* ==========================================================================
   ORDERED LEVEL CHANGES. goToLevel defers a trip to a place whose pictures are still loading (G._khWait for the cities, G._hsWait for the towns and houses), and the deferred trip fires later. A second goToLevel that came in meanwhile
   (the test links ?town=wellmaze and ?town=graveyard go to Ironhill first and then on) ran at once and was then overwritten by the late first one, leaving the party in Ironhill.
   Now a goToLevel that arrives while a deferred trip is pending waits its turn and runs after it. Last in the injection order.
   ========================================================================== */
{const _g=goToLevel,Q=[];
 goToLevel=function(n,entry){
   if(G._khWait||G._hsWait){Q.push([n,entry,this]);return}
   const r=_g.apply(this,arguments);
   if(Q.length&&!G._khWait&&!G._hsWait){const q=Q.shift();setTimeout(()=>goToLevel.call(q[2],q[0],q[1]),0)}
   return r}}
