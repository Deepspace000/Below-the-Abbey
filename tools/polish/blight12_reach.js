async () => {
  for(let i=0;i<60&&!(LEVEL===9610||LEVEL===9620);i++) await new Promise(r=>setTimeout(r,500));
  const ids = (window.__ids || [9610,9611,9620,9621,9622,9623]);
  const out = {};
  for (const id of ids) {
    if (!LEVELS[id] && KH_LAZY[id]) KH_LAZY[id]();
    const L = LEVELS[id]; if (!L) { out[id] = 'NO LEVEL'; continue; }
    const rows = L.rows, H = rows.length, W = rows[0].length;
    const blk = new Uint8Array(W*H);
    const rep = {dupes:[], blockedKey:[], narrow:[], tight:[], unreach:[], badkeys:[], nan:[]};
    const rowsOpen = (x,y)=> rows[y][x]==='.';
    for (let y=0;y<H;y++) for (let x=0;x<W;x++) if(!rowsOpen(x,y)) blk[y*W+x]=1;
    const doorCells=[];
    for (let y=0;y<H;y++) for (let x=0;x<W;x++){ const c=rows[y][x]; if(c==='.')continue; const g=L.chars&&L.chars[c]; if(g!==undefined && typeof KH_DOOR!=='undefined' && KH_DOOR[g]) doorCells.push({x,y,g}); }
    const decors = L.decor||[];
    for (const d of decors){
      if(isNaN(d.x)||isNaN(d.y)) rep.nan.push(d.k);
      if(d.block||d.solid){ if(d.x>=0&&d.y>=0&&d.x<W&&d.y<H) blk[d.y*W+d.x]=1; }
      if(d.k && typeof IMG!=='undefined' && !IMG[d.k]) rep.badkeys.push(d.k+'@'+d.x+','+d.y);
    }
    for (const e of (L.enemies||[])) if(isNaN(e.x)||isNaN(e.y)) rep.nan.push('enemy '+e.t);
    for (const e of (L.enemies||[])) if(e.t && !ENEMY_DEF[e.t]) rep.badkeys.push('enemy '+e.t);
    for (const it of (L.items||[])) if(it.k && !ITEMDEF[it.k]) rep.badkeys.push('item '+it.k);
    for (const d of decors) if(d.npc && !NPCS[d.npc] && !(typeof KH_KEEPERS!=='undefined'&&KH_KEEPERS[d.npc])) rep.badkeys.push('npc '+d.npc);
    // dupes: same key within 2 squares (cheb) among decor that is not scrub/tree
    const skip=/^(bl_grass|ww_twig|bl_hedge|gy_dead|ww_willow|ww_oakmoss|ww_oakface|gy_bones|bl_wfence|bl_fence|gy_web|hay|gy_rpost|bl_lean|bl_stone|bl_wcross|bl_slab)/;
    for (let i=0;i<decors.length;i++) for (let j=i+1;j<decors.length;j++){
      const a=decors[i],b=decors[j]; if(a.k!==b.k||skip.test(a.k)) continue;
      if(Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y))<=2) rep.dupes.push(a.k+' '+a.x+','+a.y+' / '+b.x+','+b.y);
    }
    // free map
    const free=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&!blk[y*W+x];
    const wide=(x,y)=>{ if(!free(x,y)) return false; for(const [ox,oy] of [[0,0],[-1,0],[0,-1],[-1,-1]]){ if(free(x+ox,y+oy)&&free(x+ox+1,y+oy)&&free(x+ox,y+oy+1)&&free(x+ox+1,y+oy+1)) return true;} return false; };
    // key points
    const pts=[];
    const st=L.start; if(st) pts.push({n:'start',x:st.x,y:st.y});
    const adj=(x,y)=>{ for(const [a,b] of [[0,1],[0,-1],[1,0],[-1,0]]) if(free(x+a,y+b)) return {x:x+a,y:y+b}; return null; };
    for(const dc of doorCells){ const a=adj(dc.x,dc.y); pts.push({n:'door '+dc.x+','+dc.y,x:a?a.x:dc.x,y:a?a.y:dc.y,none:!a}); }
    for(const d of decors){ if(d.npc){ let p = free(d.x,d.y)?{x:d.x,y:d.y}:adj(d.x,d.y); pts.push({n:'npc '+d.npc+'@'+d.x+','+d.y,x:p?p.x:d.x,y:p?p.y:d.y,none:!p}); } }
    for(const it of (L.items||[])){ pts.push({n:'item '+it.k+'@'+it.x+','+it.y,x:it.x,y:it.y,none:!free(it.x,it.y)}); }
    // dijkstra from start with penalty on narrow cells
    const dist=new Float32Array(W*H).fill(1e9), prev=new Int32Array(W*H).fill(-1);
    if(st){ const s=st.y*W+st.x; dist[s]=0; const pq=[[0,s]];
      while(pq.length){ pq.sort((a,b)=>a[0]-b[0]); const [dd,c]=pq.shift(); if(dd>dist[c]) continue; const x=c%W,y=(c/W)|0;
        for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+a,ny=y+b; if(!free(nx,ny)) continue; const w=1+(wide(nx,ny)?0:30); const nc=ny*W+nx; if(dd+w<dist[nc]){dist[nc]=dd+w;prev[nc]=c;pq.push([dd+w,nc]);} } } }
    const narrowSeen=new Set();
    for(const p of pts){ if(p.none||!free(p.x,p.y)){ rep.unreach.push(p.n+' (no free cell)'); continue; }
      const c=p.y*W+p.x; if(dist[c]>=1e9){ rep.unreach.push(p.n); continue; }
      let k=c; while(k>=0){ const x=k%W,y=(k/W)|0; if(!wide(x,y)) narrowSeen.add(x+','+y); k=prev[k]; } }
    rep.narrow=[...narrowSeen];
    // blocked quest-ish things: decor blocking a doorway front
    for(const dc of doorCells){ for(const [a,b] of [[0,1],[0,-1],[1,0],[-1,0]]){ const x=dc.x+a,y=dc.y+b; if(x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.'&&blk[y*W+x]) { const bd=decors.filter(d=>d.x===x&&d.y===y&&(d.block||d.solid)).map(d=>d.k); rep.blockedKey.push('door '+dc.x+','+dc.y+' front '+x+','+y+' '+bd.join('|')); } } }
    // enemies tight: free neighbours count (8) < 5 or not wide
    for(const e of (L.enemies||[])){ const x=Math.round(e.x),y=Math.round(e.y); let n=0; for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++) if((a||b)&&free(x+a,y+b)) n++; if(!wide(x,y)||n<5) rep.tight.push(e.t+'@'+x+','+y+' n='+n); if(!free(x,y)) rep.tight.push(e.t+'@'+x+','+y+' ON BLOCKED'); }
    // enemies near each other same type in 1 square
    out[id]={W,H,decor:decors.length,rep};
  }
  return out;
}
