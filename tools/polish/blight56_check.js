() => {
 const IDS=[9650,9651,9652,9653,9654,9655,9660,9661,9662,9663,9664,9665,9666], out={};
 for(const id of IDS){ try{ if(!LEVELS[id]) KH_LAZY[id]();
  const L=LEVELS[id], W=L.rows[0].length, H=L.rows.length, rep=[];
  const bs=new Map(); for(const d of L.decor) if(d.block&&!d.found) bs.set(d.x+','+d.y,d.k);
  const wk=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&L.rows[y][x]==='.'&&!bs.has(x+','+y);
  const st=L.start, seen=new Uint8Array(W*H), q=[st.y*W+st.x]; seen[q[0]]=1;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(wk(nx,ny)&&!seen[ny*W+nx]){seen[ny*W+nx]=1;q.push(ny*W+nx)}}}
  const reach=(x,y)=>[[0,0],[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>x+a>=0&&y+b>=0&&x+a<W&&y+b<H&&seen[(y+b)*W+x+a]);
  // unreachable open cells count (only those not enclosed in solid)
  let open=0,un=0; for(let y=0;y<H;y++)for(let x=0;x<W;x++) if(wk(x,y)){open++; if(!seen[y*W+x]) un++}
  rep.push('open '+open+' unreach '+un);
  for(const d of L.decor){ if(d.npc&&!reach(d.x,d.y)) rep.push('NPC unreachable '+d.npc+'@'+d.x+','+d.y);
    if(d.k==null) rep.push('nokey @'+d.x+','+d.y);
    if(d.sc!==undefined&&!isFinite(d.sc)) rep.push('NaN sc '+d.k)}
  for(const e of L.enemies){ if(!seen[e.y*W+e.x]) rep.push('foe unreachable '+e.t+'@'+e.x+','+e.y); if(!ENEMY_DEF[e.t]) rep.push('bad foe '+e.t)}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const g=L.chars[L.rows[y][x]]; if(g!==undefined&&KH_DOOR[g]){ if(!reach(x,y)) rep.push('door unreachable '+x+','+y); 
     // door front blocked/ tight
     let fr=0; for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]) if(wk(x+a,y+b)) fr++; 
     // props within 1 of door
     for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const k=bs.get((x+a)+','+(y+b)); if(k&&!/lantern|lamp/.test(k)) rep.push('block prop near door '+k+'@'+(x+a)+','+(y+b)+' door '+x+','+y)} }}
  // duplicates: same key within 2 squares (chebyshev)
  const dd=L.decor.filter(d=>d.k);
  for(let i=0;i<dd.length;i++)for(let j=i+1;j<dd.length;j++){const a=dd[i],b=dd[j]; if(a.k===b.k&&Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y))<=2&&!/grass|twig|bo_tree|gy_dead|ww_|stone|lean|bones|wfence|hedge|lantern|urn|fence/.test(a.k)) rep.push('dup '+a.k+' '+a.x+','+a.y+' / '+b.x+','+b.y)}
  for(let i=0;i<L.enemies.length;i++)for(let j=i+1;j<L.enemies.length;j++){const a=L.enemies[i],b=L.enemies[j]; if(a.t===b.t&&Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y))<=1) rep.push('foe dup '+a.t+' '+a.x+','+a.y+' / '+b.x+','+b.y)}
  // chokepoints: reachable cell with walls on both opposite sides, width 1 corridor of length>=1
  const tight=[]; const tt0=a=>a.map(t=>t.split(/[vh]/)[0].split(',').map(Number));
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){ if(!seen[y*W+x]) continue;
    const ew=!wk(x-1,y)&&!wk(x+1,y), ns=!wk(x,y-1)&&!wk(x,y+1);
    // 1-wide passage only if it connects: open on the other axis both sides
    if(ew&&wk(x,y-1)&&wk(x,y+1)) tight.push(x+','+y+'v:'+(bs.get((x-1)+','+y)||'wall')+'/'+(bs.get((x+1)+','+y)||'wall')); else if(ns&&wk(x-1,y)&&wk(x+1,y)) tight.push(x+','+y+'h:'+(bs.get(x+','+(y-1))||'wall')+'/'+(bs.get(x+','+(y+1))||'wall')); }
  // enemies in tight spots
  for(const e of L.enemies){ const x=e.x,y=e.y; let n=0; for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++) if(wk(x+a,y+b)) n++; if(n<=4) rep.push('foe cramped '+e.t+'@'+x+','+y+' open '+n)}
  const tt=tight.filter(t=>{const [xy]=t.split(/[vh]/);const [x,y]=xy.split(',').map(Number);return x>3&&y>3&&x<W-4&&y<H-4}); 
  // which tight cells are real chokepoints: with the cell closed, some target (door, npc, foe) can no longer be reached
  const targets=[]; for(const d of L.decor) if(d.npc) targets.push([d.x,d.y]); for(const e of L.enemies) targets.push([e.x,e.y]);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const g=L.chars[L.rows[y][x]]; if(g!==undefined&&KH_DOOR[g]) targets.push([x,y])}
  const choke=[];
  for(const t of tt0(tight)){ const [x0,y0]=t; const s2=new Uint8Array(W*H),q2=[st.y*W+st.x]; s2[q2[0]]=1;
    for(let i=0;i<q2.length;i++){const c=q2[i],x=c%W,y=(c/W)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx===x0&&ny===y0)continue;if(wk(nx,ny)&&!s2[ny*W+nx]){s2[ny*W+nx]=1;q2.push(ny*W+nx)}}}
    const lost=targets.filter(([tx,ty])=>seen[ty*W+tx]&&![[0,0],[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>s2[(ty+b)*W+tx+a]&&!(tx+a===x0&&ty+b===y0)));
    if(lost.length) choke.push(x0+','+y0+' cuts '+lost.length+' ('+lost.slice(0,2).map(l=>l.join(',')).join(' ')+')') }
  rep.push('CHOKEPOINTS '+choke.length+': '+choke.join(' | '));
  rep.push('tight cells '+tt.length+': '+tt.slice(0,80).join(' '));
  out[id]=rep }catch(e){out[id]=['ERR '+e+' '+(e.stack||'').replace(/s+/g,' ').slice(0,300)]} }
 return out }
