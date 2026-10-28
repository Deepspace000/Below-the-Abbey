(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,o={fail:[],ok:0,notes:0,noteFail:[]};const Z=(d)=>M.bio[d.y*W+d.x]>=4;
const npcs={};for(const d of L.decor){if(d.npc)npcs[d.npc]=(npcs[d.npc]||0)+1}o.npcs=npcs;o.chests=L.decor.filter(d=>d.hgdTier).length;o.chestKeys=L.decor.filter(d=>/^hg_chest/.test(d.k)).length;o.items=L.items.length;o.enemies=L.enemies.length;
for(const d of G.decor){if(!d.npc||!(d.x>=0)||M.bio[d.y*W+d.x]<4)continue;const isNote=/^(hgdb_note|hgdb_post|hgd_note|hgd_sign)$/.test(d.npc);
  try{G.talk=null;startTalk(d);const ok=!!(G.talk&&G.talk.node);if(isNote){o.notes++;if(!ok)o.noteFail.push([d.npc,d.x,d.y])}else{if(ok)o.ok++;else o.fail.push([d.npc,d.x,d.y])}}catch(e){o.fail.push([d.npc,d.x,d.y,String(e).slice(0,60)])}G.talk=null}
o.fail=o.fail.slice(0,12);return o})()
