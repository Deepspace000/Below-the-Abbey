async () => {
  const id=window.__gid||9622; if(!LEVELS[id]&&KH_LAZY[id])KH_LAZY[id](); const L=LEVELS[id]; const H=L.rows.length,W=L.rows[0].length; const g=[];
  for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=L.rows[y][x]==='.'?'.':'#';g.push(s.split(''))}
  for(const d of L.decor){if(d.x<0||d.y<0||d.x>=W||d.y>=H)continue; g[d.y][d.x]=d.npc?'N':(d.block||d.solid)?'o':(g[d.y][d.x]==='.'?',':g[d.y][d.x])}
  for(const e of L.enemies)g[Math.round(e.y)][Math.round(e.x)]='E'; g[L.start.y][L.start.x]='S';
  return g.map(r=>r.join(''));
}
