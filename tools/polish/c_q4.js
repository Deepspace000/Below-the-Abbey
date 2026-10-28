()=>{try{hgBuild();hgdBuild()}catch(e){}const L=LEVELS[475],P=L._hgdp;
const out={shops:L._hgds2.shops.map(s=>s.join(',')).join(' | '),ch:JSON.stringify(L._hgdch),maps:{}};
for(const z of P.zones.filter(z=>z.type==='safe'&&z.name!=='The Foot of the Maze')){
 const g=[];for(let y=z.y-z.r-1;y<=z.y+z.r+1;y++){let s='';for(let x=z.x-z.r-1;x<=z.x+z.r+1;x++){let c=(L.rows[y]&&L.rows[y][x]==='.')?'.':'#';
  const ds=L.decor.filter(d=>d.x===x&&d.y===y);if(ds.length){const d=ds[0];c=d.npc?(/shop|s2|church/.test(d.npc)?'$':/_q/.test(d.npc)?'!':/note|sign/.test(d.npc)?'n':'p'):/tree/.test(d.k)?'T':/lamp/.test(d.k)?'l':/statue|plinth/.test(d.k)?'S':/chest/.test(d.k)?'C':/teleporter/.test(d.k)?'X':'o'}
  if(L.items.some(i=>i.x===x&&i.y===y))c='i';s+=c}g.push(s)}out.maps[z.name+' ('+z.x+','+z.y+') origin '+(z.x-z.r-1)+','+(z.y-z.r-1)]=g.join('\n')}
return out}
