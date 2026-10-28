(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,o={};o.vign=L._hgpb.log.vign;const pl=L.decor.find(d=>d.npc==='hgd_plaque');o.plaque=pl&&[pl.x,pl.y];o.boss=M.spots.filter(s=>s.boss).map(s=>[s.x,s.y]);
o.posts=L.decor.filter(d=>d.npc==='hgdb_post').map(d=>[d.k,d.x,d.y,d.wd.join(',')]);
const dirs={'0,-1':0,'1,0':1,'0,1':2,'-1,0':3};o.postsF=o.posts.map(p=>p.slice(0,3).concat([2]));
o.vignF=o.vign.map(v=>[v[0],v[1],v[2]]);
o.dead=[];let n=0;for(const d of L.decor){if(d._pbv&&!d.pic&&n<60&&Math.hypot(d.x-0,d.y)>0){}}
o.waysides=L.decor.filter(d=>d.k==='hpb_rune'||(d.npc==='hgdb_note'&&/Pace/.test(d.label||''))).slice(0,12).map(d=>[d.x,d.y,d.wd]);
return o})()
