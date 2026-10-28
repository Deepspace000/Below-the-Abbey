()=>{try{hgBuild();hgdBuild()}catch(e){}const L=LEVELS[475],P=L._hgdp;
const safe=P.zones.filter(z=>z.type==='safe');const out={zones:safe.map(z=>[z.name,z.x,z.y,z.r])};
const inz=(d,z)=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r;
out.towns={};
for(const z of safe){const ds=L.decor.filter(d=>inz(d,z));const c={};for(const d of ds){const k=d.k+(d.npc?'#'+d.npc:'');c[k]=(c[k]||0)+1}
 out.towns[z.name]={n:ds.length,kinds:c,items:L.items.filter(i=>inz(i,z)).map(i=>[i.k||i.t||i.id,i.x,i.y,i.text?1:0]).slice(0,30),en:L.enemies.filter(e=>inz(e,z)).length}}
out.fields=[...new Set(L.decor.flatMap(d=>Object.keys(d)))];
out.itemFields=[...new Set(L.items.flatMap(d=>Object.keys(d)))];
return out}
