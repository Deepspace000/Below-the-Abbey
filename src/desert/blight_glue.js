/* ==========================================================================
   THE SEAM BETWEEN THE BLIGHTED ROAD (blight_road.js) AND THE VAULT OF MALDRAKE (vault_core.js), which was built on its own.
   The Vault's gates ask VT.neighbour(dir) where the next place on the road is, and its neighbours land the party on the squares given here.
   East is the Wenlock side (the previous place), west is the Sale side (the next place).
   ========================================================================== */
if(typeof BL_ROAD!=='undefined'&&typeof VT!=='undefined'){
  const bgJ=()=>BL_ROAD.findIndex(q=>q.id===9670);
  {const p=BL_ROAD[bgJ()];if(p&&VT.arrive){p.fromE=VT.arrive.east;p.fromW=VT.arrive.west;p.built=true}}
  VT.neighbour=function(dir){const j=bgJ(),q=BL_ROAD[dir==='east'?j-1:j+1];if(!q)return null;
    return {id:q.id,at:dir==='east'?q.fromW:q.fromE}};
}
