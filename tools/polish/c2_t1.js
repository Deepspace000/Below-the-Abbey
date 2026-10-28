()=>{const L=LEVELS[475],zs=L._hgdp.zones.filter(z=>z.type==='safe');const out=[];
for(const z of zs){const ppl=L.decor.filter(d=>d.npc&&Math.hypot(d.x-z.x,d.y-z.y)<=z.r&&!/hgdpc_text/.test(d.npc));
out.push([z.name,z.town,z.x,z.y,z.r,ppl.map(d=>d.npc.replace('hgd_','')+'@'+d.x+','+d.y).join(' ')])}
return out}
