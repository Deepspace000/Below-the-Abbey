async () => {
  const L=LEVELS[9640]||(KH_LAZY[9640](),LEVELS[9640]);
  return {row:L.rows[60].slice(80,90), d:L.decor.filter(d=>Math.abs(d.x-84)<=1&&Math.abs(d.y-60)<=1).map(d=>[d.k,d.x,d.y,d.block,d.npc,d._bgr]), wet:TERRS[9640]&&TERRS[9640].block?TERRS[9640].block[60*90+84]:null, it:L.items.filter(i=>i.k==='potion6')}
}
