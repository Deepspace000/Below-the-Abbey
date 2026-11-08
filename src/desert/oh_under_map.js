/* ==========================================================================
   THE THREE DUNGEONS UNDER OLDHAVEN ON THE WORLD MAP (v3.880). The sewers, the crypt under the chapel and Crowe's hideaway (levels 6710, 6711, 6712, oldhaven_under.js) get small cave marks
   directly under Oldhaven, a little smaller than the other cave marks. They use the same placing as the eight new dungeons (gapdungeons.js): the mark takes the nearest clear spot to its host, here
   preferring the south, clear of every picture and name.
   ========================================================================== */
if(typeof WORLD_LOCS!=='undefined'){
  for(const [id,n] of [[6710,'The Sewers of Oldhaven'],[6711,'The Crypt Under the Chapel'],[6712,'Crowe\u2019s Hideaway']])
    if(!WORLD_LOCS.some(l=>l.k==='ohu'+id))WORLD_LOCS.push({k:'ohu'+id,n,lv:[id],x:1170,y:206,ic:'cave',sc:.34,gap:id,host:305,pref:Math.PI/2});
}
