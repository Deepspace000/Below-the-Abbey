async () => {
  for(let i=0;i<60&&!(LEVEL===9610||LEVEL===9620);i++) await new Promise(r=>setTimeout(r,500));
  const o={};
  for(const id of [9621,9622,9623,9611]){ if(!LEVELS[id]) KH_LAZY[id](); const L=LEVELS[id]; const g=L.rows.map(r=>r.split('').map(c=>c==='.'?'.':'#'));
    for(const d of L.decor){ if(d.block||d.solid) g[d.y][d.x]= d.npc?'N':'B'; else g[d.y][d.x]= g[d.y][d.x]==='.'?'o':g[d.y][d.x]; }
    for(const e of L.enemies) g[Math.round(e.y)][Math.round(e.x)]='E';
    if(L.start) g[L.start.y][L.start.x]='S';
    o[id]={start:L.start,grid:g.map(r=>r.join(''))}; }
  return o }
