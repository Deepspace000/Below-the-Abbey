()=>{try{hgBuild();hgdBuild()}catch(e){}const L=LEVELS[475];const P=L._hgdp;
return {keys:Object.keys(L).join(','),pk:Object.keys(P).join(','),zones:P.zones.filter(z=>z.type==='safe').map(z=>[z.name,z.x,z.y,z.r,z.town]),
 decor:L.decor.length,npcs:L.decor.filter(d=>d.npc).length,sampleNpc:L.decor.filter(d=>d.npc).slice(0,3),sample:L.decor.filter(d=>!d.npc).slice(0,5),items:L.items.length,ndef:Object.keys(NPC_H||{}).length, rows:[L.rows.length,L.rows[0].length]}}
