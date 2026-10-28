(()=>{const L=LEVELS[475];const near=(x,y,r)=>L.decor.filter(d=>Math.abs(d.x-x)<=r&&Math.abs(d.y-y)<=r).map(d=>[d.k,d.x,d.y,d.sc,d.npc||'',d.pic?1:0,d.ox||0,d.oy||0,(NPC_H[d.k]||0)*(d.sc||1)].join('|'));
const out={forge:near(49,89,3),stone:near(46,94,3),dune:near(42,90,3),tess:near(121,16,3),blueL:near(28,45,3),de169:near(169,78,3),tea:near(178,92,4),tear:near(103,27,5)};
const ks={};for(const d of L.decor){if(!d.npc)continue;ks[d.npc]=(ks[d.npc]||0)+1}out.npcs=ks;
out.chair=[NPC_H.art_hgtb_chair,NPC_H.hgtb_chair,NPC_H.art_hgtb_table,NPC_H.hgtb_table,NPC_H.art_hgtb_furn_bookshelf];return out})()
