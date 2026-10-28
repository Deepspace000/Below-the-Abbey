()=>{const L=LEVELS[475];const zs=L._hgdp.zones.filter(z=>z.type==='safe');
const R=[];for(const d of L.decor){if(!d.hgs)continue;const z=zs.find(z=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r+3);R.push([d.x,d.y,d.hgs,d.pic?'wall':'stand',(d.wd||[]).join(','),d.sc||1,d.label||'',z?z.name:'-',d.npc].join('|'))}
return {n:R.length,inzone:R.filter(r=>!r.includes('|-|')).length,rows:R.filter(r=>r.includes('|-|')).slice(0,40),zrows:R.filter(r=>!r.includes('|-|'))}}
