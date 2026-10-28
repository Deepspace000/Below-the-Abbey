()=>{const o=G.decor.filter(d=>d.hgt==='Note'||d.hgt===''||(d.hgtBase&&!d.label)).map(d=>[d.x,d.y,d.k,d.hgtBase,d.hgt,d.label,d.npc,(d.hgdwText||'').slice(0,20),!!d.pic]);
const near=G.decor.filter(d=>Math.abs(d.x-21)<=1&&Math.abs(d.y-38)<=2).map(d=>[d.x,d.y,d.k.slice(0,20),d.hgt,d.label,d.npc]);return {o,near,n:G.decor.filter(d=>d.hgt).length}}
