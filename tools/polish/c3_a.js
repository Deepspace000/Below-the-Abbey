()=>{const L=LEVELS[475],zs=L._hgdp.zones.filter(z=>z.type==='safe');const R={zones:zs.map(z=>[z.name,z.town,z.x,z.y,z.r]),churches:[],houses:L.decor.filter(d=>d.hs==='hgdpc_house').map(d=>[d.k,d.x,d.y])};
for(const d of L.decor.filter(d=>/^hgd_church\d$/.test(d.npc))){const t=+d.npc.slice(-1),z=zs.find(z=>z.town===t);R.churches.push([d.npc,d.x,d.y,z?Math.round(Math.hypot(z.x-d.x,z.y-d.y)):null])}
R.size=[L.rows.length,L.rows[0].length];return R}
