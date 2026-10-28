()=>{const L=LEVELS[477],E=L._hgdwe;
const sp=E.vignettes.map(v=>[v.name,v.x,v.y]);
const ap=(L._hgdw.stairs||[]).map(s=>[s.x,s.y,s.ax,s.ay]);
const en={};for(const e of L.enemies){en[e.t]=(en[e.t]||0)+1}
return {sp,ap,en,ne:L.enemies.length,hasKeys:Object.keys(L).join(','),vk:Object.keys(E.vignettes[0]).join(','),far:L._hgdw.far,start:L.start}}
