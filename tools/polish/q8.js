()=>{const L=LEVELS[475],M=L._hgdm,W=M.W;const o={};o.tele=JSON.stringify(L.tele).slice(0,600);o.start=L.start;
o.dec=L.decor.filter(d=>d.k==='teleporter'||d.k==='gate'||/tele/.test(d.npc||'')).filter(d=>M.bio[d.y*W+d.x]<4).map(d=>[d.k,d.npc,d.x,d.y]);
o.prec=L._hgdm.prec?L._hgdm.prec.filter(p=>p.b<4).map(p=>[p.name,p.x,p.y,p.b]):null;
return o}
