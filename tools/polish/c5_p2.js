()=>{const L=LEVELS[475];const zs=L._hgdp.zones.filter(z=>z.type==='safe');
const inz=d=>zs.some(z=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r+3);
const t={};for(const d of L.decor){if(!inz(d))continue;const k=d.k;const b=(typeof NPC_H!=='undefined'&&NPC_H[k]);const h=(b||0)*(d.sc||1);const im=IMG[k];const ar=im&&im.width?(im.width/im.height):0;
const o=t[k]=t[k]||{n:0,b:b||0,lo:1e9,hi:0,ar:+ar.toFixed(2),npc:d.npc||'',blk:0};o.n++;o.lo=Math.min(o.lo,h);o.hi=Math.max(o.hi,h);if(d.block)o.blk++}
return Object.entries(t).map(([k,o])=>[k,o.n,+o.b.toFixed(2),+o.lo.toFixed(2),+o.hi.toFixed(2),o.ar,o.blk,o.npc].join(' ')).sort()}
