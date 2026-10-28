()=>{const L=LEVELS[475];const zs=L._hgdp.zones.filter(z=>z.type==='safe');const out={zones:zs.map(z=>[z.name,z.x,z.y,z.r])};
const near=(d,x,y,r)=>Math.hypot(d.x-x,d.y-y)<=r;
const pick=(x,y,r)=>L.decor.filter(d=>near(d,x,y,r)).map(d=>[d.x,d.y,d.k,d.npc||'',d.hs||'',d.sc||1,d.block?1:0,d.label||''].join('|'));
out.hedge=pick(112,179,4);out.nacre=pick(76,101,5);out.house14=pick(71,101,3);
out.signs=L.decor.filter(d=>d.k&&/hang|sign/i.test(d.k)||/hanging/.test(d.hgtBase||'')).map(d=>[d.x,d.y,d.k,d.hgtBase||'',d.sc||1,d.npc||'',d.hs||''].join('|')).slice(0,60);
return out}
