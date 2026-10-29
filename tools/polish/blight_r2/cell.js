async () => {
  const id=9622; if(!LEVELS[id])KH_LAZY[id](); const L=LEVELS[id];
  return {start:L.start, d:L.decor.filter(d=>d.x>=3&&d.x<=7&&d.y>=3&&d.y<=6).map(d=>[d.k,d.x,d.y,d.block,d.solid,d.npc,d.found])};
}
