/* ==========================================================================
   LITTLE DETAILS OF THE DEEPER HOLLOW MAZE (prefix hgx / HGX). Painted rocks (assets/ds_hgxrock0..7), statues (ds_hgxstat0..7) and small props (ds_hgxprop0..15), set out so that
   - every passage of three squares or more carries at least one small thing, never the same kind twice in a row along a way,
   - each of the 24 named precincts has its own family of props and its own centrepiece in its clearings, rooms and atriums,
   - about 120 statues stand in the wide places and in dead-end niches, boulders stand in the wide places, standing stones form rings in six big openings,
   - about 400 small pictures hang on the walls beside the corridors.
   Runs as the last decorating pass (just before the lakes are filled): it reads everything the other builders placed and keeps clear of it. Deterministic (hgdmRng 475090).
   Exposes L._hgdx for testing. A picture that does not exist yet is simply skipped (window.HGX_STAND = 1 swaps in stand-in sprites for testing).
   ========================================================================== */
{const hr=[.55,.55,.45,.25,1,.7,.35,.6],hp=[.3,.3,.25,.12,.3,.35,.3,.18,.3,.3,.08,.1,.4,.35,.3,.3]; // the rusty lantern (7) is 40 percent smaller
 for(let i=0;i<8;i++){NPC_H['art_hgxrock'+i]=hr[i];NPC_H['art_hgxstat'+i]=1.25}
 for(let i=0;i<16;i++)NPC_H['art_hgxprop'+i]=hp[i]}
const HGX_STANDIN={r:'hgt_pearlbush',s:'hgtb_deco_shellstatue',p:['art_hgdf_plant3','art_hgdf_plant1','hgt_mushrooms','art_hgdf_plant6','hgt_fern','art_hgdf_plant4','art_hgdf_plant2','hgt_reeds']};
function hgxKey(t,i){const k='art_hgx'+(t==='r'?'rock':t==='s'?'stat':'prop')+i,im=IMG[k];if(im&&im.width)return k;
  if(typeof window!=='undefined'&&window.HGX_STAND){const s=HGX_STANDIN[t];return Array.isArray(s)?s[i%s.length]:s}return null}
const HGX_DV=[[0,-1],[1,0],[0,1],[-1,0]],HGX_D9=[[0,0],[0,-1],[1,0],[0,1],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]];
// what lies about in each biome (props p, rocks r) and the statues (s) that belong to it
const HGX_BASE=[['p12','p5','p4','p0','p13','p1','p6','r3','r2'],['r6','r3','r2','p1','p0','p3','p7','p6','r1'],['p14','p2','p1','p3','p6','p0','r3'],['p8','p9','r3','p0','p1','p6','r2'],['p10','p13','p0','p1','r6','r3','p11','r2'],['p4','p11','p2','p3','r7','r3','p7'],['p11','p3','p2','p1','p7','p0','r3'],['p10','p7','p3','p2','p1','p11','p13']];
const HGX_BOUL=[[0,0,1],[5,1,0,4],[0,1],[0,1],[1,5,0],[7,0],[1,5],[5,1]];
const HGX_SPRIM=[0,1,2,3,4,5,6,7],HGX_SSEC=[[6,7],[6,0],[1,7],[7,2],[6,1],[6,3],[1,5],[0,2]];
// the 24 precincts (the order of the names in HGDMP.names): family of props, centrepiece, two extras
const HGX_SIG=[
 {fam:['p12','p4','p5'],cen:'roots',ex:['trail','toppled']},{fam:['p13','p0','p1'],cen:'bones',ex:['trail','lone']},{fam:['p5','p6','p4'],cen:'boulders',ex:['toppled','lone']},
 {fam:['r2','r3','p1'],cen:'cairns',ex:['trail','toppled']},{fam:['p6','p3','r6'],cen:'statue',ex:['trail','lone']},{fam:['r3','r6','r1'],cen:'slabs',ex:['toppled','lone']},
 {fam:['p14','p2','p1'],cen:'comb',ex:['trail','toppled']},{fam:['p2','p14','p0'],cen:'shrine',ex:['trail','lone']},{fam:['p1','p6','p14'],cen:'pots',ex:['toppled','lone']},
 {fam:['p8','p9','r3'],cen:'shells',ex:['trail','toppled']},{fam:['p8','p1','p0'],cen:'statue',ex:['trail','lone']},{fam:['p9','r3','r2'],cen:'ring',ex:['toppled','lone']},
 {fam:['p10','p13','p0'],cen:'statue',ex:['trail','toppled']},{fam:['p0','p13','r6'],cen:'bones',ex:['trail','lone']},{fam:['p10','p11','p1'],cen:'hoard',ex:['toppled','lone']},
 {fam:['p7','p2','p4'],cen:'shrine',ex:['trail','toppled']},{fam:['p4','r7','p11'],cen:'crystals',ex:['trail','lone']},{fam:['p3','p2','p4'],cen:'shrine',ex:['toppled','lone']},
 {fam:['p11','p3','p2'],cen:'tiles',ex:['trail','toppled']},{fam:['p11','p7','p1'],cen:'ring',ex:['trail','lone']},{fam:['p11','r6','p6'],cen:'statue',ex:['toppled','lone']},
 {fam:['p10','p7','p3'],cen:'hoard',ex:['trail','toppled']},{fam:['p7','p2','p13'],cen:'statue',ex:['trail','lone']},{fam:['p3','p10','p14'],cen:'shrine',ex:['toppled','lone']}];
function hgxBuild(L){
  if(L._hgdx)return;const T0=performance.now(),M=L._hgdm,W=M.W,H=M.H,bio=M.bio,kind=M.kind,rows=L.rows,fmap=L.fmap,rnd=hgdmRng(475090),N=W*H;
  const ch=(x,y)=>rows[y]&&rows[y][x],isWallC=c=>!!c&&c!=='.'&&c.charCodeAt(0)>=0x2e0&&c.charCodeAt(0)<0x2e8;
  const isOpen=(x,y)=>ch(x,y)==='.',pass=(x,y)=>{const c=ch(x,y);return !!c&&c!=='#'&&!isWallC(c)};
  const fm=(x,y)=>fmap[y][x];
  const inb=(x,y)=>x>1&&y>1&&x<W-2&&y<H-2;
  const bad=new Uint8Array(N),npcN=new Uint8Array(N),occ=new Uint8Array(N),blk=new Uint8Array(N),mine=new Uint8Array(N),picG=new Uint8Array(N);
  const mark=(g,x,y,r)=>{for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const a=x+dx,b=y+dy;if(a>=0&&b>=0&&a<W&&b<H)g[b*W+a]=1}};
  // ---- keep-out cells ----
  for(let y=0;y<H;y++){const r=rows[y];for(let x=0;x<W;x++){const c=r[x];if(c==='.'||isWallC(c)||c==='#'||c==='͡')continue;mark(bad,x,y,2)}} // doors, docks, ladders drawn as tiles
  mark(bad,M.sx,H-2,6);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const f=fmap[y][x];if(f==='6')bad[y*W+x]=1}
  const sk=['_hgds','_hgdu','_hgdt','_hgdw','_hgdwq','_hgdwqi','_hgdr','_hgdq','_hgdv','_hgdk','_hgdm2','_hgdm2q','_hgds2','_hgdb','_hgdkStatues','_hgdkCracks'],hv=[],seen=new Set();
  const harvest=(o,d)=>{if(!o||typeof o!=='object'||d>5||seen.size>40000||seen.has(o))return;seen.add(o);
    if(Array.isArray(o)){if(o.length===2&&Number.isFinite(o[0])&&Number.isFinite(o[1])){hv.push(o);return}for(const v of o)harvest(v,d+1);return}
    if(Number.isFinite(o.x)&&Number.isFinite(o.y))hv.push([o.x,o.y]);if(Number.isFinite(o.ax)&&Number.isFinite(o.ay))hv.push([o.ax,o.ay]);
    for(const k in o){const v=o[k];if(v&&typeof v==='object')harvest(v,d+1)}};
  for(const k of sk)harvest(L[k],0);
  for(const [x,y] of hv)if(x>=0&&y>=0&&x<W&&y<H){mark(bad,x,y,2)}
  if(L._hgds2)for(const [x,y] of hv.filter(()=>false))mark(npcN,x,y,3);
  const lk=L._hgdl&&L._hgdl.lakes||[];for(const k of lk){for(const pz of (k.plazas||(k.plaza?[k.plaza]:[])))for(const [x,y] of pz)mark(bad,x,y,1);
    for(const c of [k.docks&&k.docks.dep,k.docks&&k.docks.far].concat(k.wdocks||[]))if(c){mark(bad,c.x,c.y,3);mark(bad,c.ax,c.ay,2)}}
  const BIGR=/^(hg_chest|hg_house|pickpocket|gate|teleporter|hg_wizard)/;
  for(const d of L.decor){const i=d.y*W+d.x;occ[i]=1;if(d.block)blk[i]=1;if(d.npc){mark(npcN,d.x,d.y,3);mark(bad,d.x,d.y,1)}else if(BIGR.test(d.k))mark(bad,d.x,d.y,d.k==='gate'?2:1);
    if(d.pic&&d.wd)mark(picG,d.x,d.y,0)}
  for(const d of L.items)occ[d.y*W+d.x]=1;for(const d of L.enemies)occ[d.y*W+d.x]=1;
  // ---- the squares that can be reached on foot ----
  const dist=new Int32Array(N).fill(-1),q=[L.start.y*W+L.start.x];dist[q[0]]=0;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of HGX_DV){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||!isOpen(nx,ny))continue;const n=ny*W+nx;if(dist[n]>=0)continue;dist[n]=dist[c]+1;q.push(n)}}
  const reach=c=>dist[c]>=0;
  // ---- precincts ----
  const prec=hgdmpPrec(L),pb=[[],[],[],[],[],[],[],[]];for(const p of prec)pb[p.b].push(p);
  const pidCache=new Int16Array(N).fill(-1);
  const pidAt=(x,y)=>{const i=y*W+x;if(pidCache[i]>=0)return pidCache[i];const b=bio[i],ps=pb[b];let bi=0,bd=1e9;ps.forEach((s,j)=>{const d=Math.hypot(s.x-x,s.y-y);if(d<bd){bd=d;bi=j}});return pidCache[i]=b*3+Math.min(bi,2)};
  const counts={rock:0,stat:0,prop:0,wall:0,total:0,byBiome:[0,0,0,0,0,0,0,0],niche:0,rings:0,ringStones:0,boulders:0,coinTrails:0,byPrec:new Array(24).fill(0)};
  const r2=v=>Math.round(v*100)/100;
  const okc=(x,y)=>{if(!inb(x,y))return false;const i=y*W+x;if(dist[i]<0||bad[i]||occ[i])return false;const f=fmap[y][x];return f!=='5'&&f!=='6'};
  const inter=(x,y)=>{for(const [a,b] of HGX_D9){const xx=x+a,yy=y+b;if(!isOpen(xx,yy)||blk[yy*W+xx])return false}return fmap[y][x]!=='5'};
  const note=(t,x,y)=>{counts[t]++;counts.total++;counts.byBiome[bio[y*W+x]]++;counts.byPrec[pidAt(x,y)]++};
  const parse=s=>[s[0],+s.slice(1)];
  const prop=(code,x,y,o)=>{const [t,i]=parse(code),k=hgxKey(t,i);if(!k||!okc(x,y))return false;const e={k,x,y,hx:1,block:false,walk:true,deco:true,sc:r2(((o&&o.sc)||.8+rnd()*.4)*(t==='p'?(i===10||i===11?2.3:i===3?1.8:1):1))}; // coins, tiles and books are so low that they are drawn larger, or they would be specks
    if(!(o&&o.flat)){e.ox=r2((rnd()-.5)*.56);e.oy=r2((rnd()-.5)*.56)}else{e.ox=0;e.oy=0}
    L.decor.push(e);occ[y*W+x]=1;mine[y*W+x]=1;note(t==='r'?'rock':'prop',x,y);return true};
  const blocker=(code,x,y,anyKind)=>{const [t,i]=parse(code),k=hgxKey(t,i);if(!k||!okc(x,y)||(!anyKind&&kind[y*W+x]===0)||!inter(x,y))return false;
    L.decor.push({k,x,y,hx:1,block:true,deco:true,sc:r2(t==='s'?.95+rnd()*.1:.9+rnd()*.2)});occ[y*W+x]=1;blk[y*W+x]=1;mine[y*W+x]=1;note(t==='r'?'rock':'stat',x,y);return true};
  const pick=a=>a[(rnd()*a.length)|0];
  const famOf=pid=>HGX_SIG[pid].fam,poolOf=pid=>{const b=(pid/3)|0,f=HGX_SIG[pid].fam,out=[];for(const c of f)out.push(c,c,c);return out.concat(HGX_BASE[b])};
  const statPool=pid=>{const b=(pid/3)|0,i=pid%3,P=HGX_SPRIM[b],S=HGX_SSEC[b];return i===0?[P,P,P,S[0]]:i===1?[P,S[0],S[0],S[1]]:[P,S[1],S[1],S[0]]};
  const statues=[];for(const d of L.decor)if(/^hgtb_deco_(shellstatue|pearlplinth)$/.test(d.k))statues.push([d.x,d.y]);
  const nearStat=(x,y,g)=>statues.some(s=>Math.hypot(s[0]-x,s[1]-y)<g);
  const statue=(pid,x,y,anyKind)=>{if(npcN[y*W+x]||nearStat(x,y,7))return false;const sp=statPool(pid);for(let t=0;t<4;t++){const k=pick(sp);if(blocker('s'+k,x,y,anyKind)){statues.push([x,y]);return true}}return false};
  const ring=(cx,cy,rad,n,off)=>{const out=[];for(let k=0;k<n;k++){const a=off+k*6.2832/n;out.push([Math.round(cx+Math.cos(a)*rad),Math.round(cy+Math.sin(a)*rad)])}return out};
  // ---- 1) rings of standing stones in six big openings ----
  const spots=M.spots.filter(s=>!s.boss),spotCells=new Map();
  const cellsOf=s=>{let c=spotCells.get(s);if(c)return c;c=[];for(let y=s.y-s.r;y<=s.y+s.r;y++)for(let x=s.x-s.r;x<=s.x+s.r;x++)if(inb(x,y)&&kind[y*W+x]===s.type&&dist[y*W+x]>=0&&Math.hypot(x-s.x,y-s.y)<=s.r+.5)c.push([x,y]);spotCells.set(s,c);return c};
  {const usedP=new Set(),big=spots.filter(s=>s.type!==2&&s.r>=5).sort((a,b)=>b.r-a.r||a.x-b.x);let nr=0;
   for(const pass2 of [0,1])for(const s of big){if(nr>=6)break;const pid=pidAt(s.x,s.y);if(!pass2&&usedP.has(pid))continue;if(s._ring)continue;
     let best=null;for(let t=0;t<10;t++){const off=rnd()*6.28,pts=[],taken=new Set();for(const [px,py] of ring(s.x,s.y,4,7,off)){let f=null;for(const [a,b] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const x=px+a,y=py+b;if(okc(x,y)&&inter(x,y)&&kind[y*W+x]>0&&!taken.has(x+','+y)){f=[x,y];break}}if(f){pts.push(f);taken.add(f[0]+','+f[1])}}
       if(!best||pts.length>best.length)best=pts;if(pts.length>=7)break}
     if(!best||best.length<5)continue;let n=0;for(const [x,y] of best)if(blocker('r4',x,y,false))n++;if(n>=5){nr++;usedP.add(pid);s._ring=1;counts.ringStones+=n}}
   counts.rings=nr}
  // ---- 2) statues in the wide places: three to an atrium, two to a room, now and then one to a clearing ----
  for(const s of spots){const want=s.type===3?3:s.type===2?2:(rnd()<.5?1:0);if(!want)continue;const pid=pidAt(s.x,s.y),cs=cellsOf(s);if(!cs.length)continue;let got=0;
    for(let t=0;t<90&&got<want;t++){const [x,y]=cs[(rnd()*cs.length)|0];if(Math.hypot(x-s.x,y-s.y)<2)continue;if(statue(pid,x,y,false))got++}}
  // ---- 3) the centrepiece of every opening, by precinct ----
  const COMP={
    roots:(c,f)=>{ring(c.x,c.y,2,6,c.o).forEach(([x,y],i)=>prop(i%2?'p4':'p12',x,y));ring(c.x,c.y,3,4,c.o+.7).forEach(([x,y])=>prop('p5',x,y))},
    bones:(c,f)=>{blocker('r0',c.x,c.y,false);ring(c.x,c.y,2,5,c.o).forEach(([x,y],i)=>prop(i%2?'p13':'p0',x,y))},
    boulders:(c,f)=>{for(let i=0;i<3;i++){const a=c.o+i*2.1,rr=Math.max(1,c.r*.5);blocker(pick(['r0','r0','r5']),Math.round(c.x+Math.cos(a)*rr),Math.round(c.y+Math.sin(a)*rr),false)}ring(c.x,c.y,2,4,c.o+.5).forEach(([x,y])=>prop('r3',x,y))},
    cairns:(c,f)=>{blocker('r4',c.x,c.y,false);ring(c.x,c.y,2,5,c.o).forEach(([x,y])=>prop('r2',x,y))},
    slabs:(c,f)=>{blocker('r5',c.x,c.y,false);ring(c.x,c.y,2,3,c.o).forEach(([x,y])=>prop('r1',x,y,{sc:.9+rnd()*.3}));ring(c.x,c.y,3,3,c.o+1).forEach(([x,y])=>prop('r6',x,y))},
    comb:(c,f)=>{prop('p2',c.x,c.y);ring(c.x,c.y,2,6,c.o).forEach(([x,y])=>prop('p14',x,y))},
    pots:(c,f)=>{prop('p14',c.x,c.y);ring(c.x,c.y,2,8,c.o).forEach(([x,y],i)=>prop(i%2?'p6':'p1',x,y))},
    shells:(c,f)=>{ring(c.x,c.y,2,8,c.o).forEach(([x,y])=>prop('p8',x,y));ring(c.x,c.y,3,4,c.o+.4).forEach(([x,y])=>prop('p9',x,y))},
    ring:(c,f)=>{ring(c.x,c.y,2,6,c.o).forEach(([x,y])=>prop(f[0],x,y));prop(f[1],c.x,c.y)},
    crystals:(c,f)=>{for(let i=0;i<3;i++){const a=c.o+i*2.1;blocker('r7',Math.round(c.x+Math.cos(a)*2),Math.round(c.y+Math.sin(a)*2),false)}ring(c.x,c.y,3,5,c.o).forEach(([x,y])=>prop('p4',x,y))},
    shrine:(c,f)=>{prop('p3',c.x,c.y,{sc:1.1});ring(c.x,c.y,2,4,c.o).forEach(([x,y],i)=>prop(i%2?'p7':'p2',x,y))},
    tiles:(c,f)=>{ring(c.x,c.y,1,6,c.o).forEach(([x,y])=>prop('p11',x,y));ring(c.x,c.y,3,10,c.o).forEach(([x,y])=>prop('p11',x,y))},
    hoard:(c,f)=>{prop('p10',c.x,c.y,{sc:1.2});ring(c.x,c.y,1,6,c.o).forEach(([x,y])=>prop('p10',x,y));ring(c.x,c.y,2,4,c.o+.4).forEach(([x,y])=>prop('p7',x,y))},
    statue:(c,f)=>{let ok=false;for(const [dx,dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]])if(!ok&&statue(c.pid,c.x+dx,c.y+dy,false))ok=true;ring(c.x,c.y,2,4,c.o).forEach(([x,y],i)=>prop(f[1+(i%2)],x,y))}};
  for(const s of spots){const pid=pidAt(s.x,s.y),sig=HGX_SIG[pid],c={x:s.x,y:s.y,r:s.r,o:rnd()*6.28,pid};
    try{COMP[sig.cen](c,sig.fam)}catch(e){console.error('hgx cen',e)}
    // boulders of the biome in the wide places (blocking, never in a passage), a few pebbles and family props lying about
    const cs=cellsOf(s),b=bio[s.y*W+s.x],nb=Math.round(cs.length/70);
    for(let i=0,t=0;i<nb&&t<40;t++){const [x,y]=cs[(rnd()*cs.length)|0];if(blocker('r'+pick(HGX_BOUL[b]),x,y,false)){i++;counts.boulders++}}
    const pl=poolOf(pid),dens=s.type===3?.07:s.type===2?.06:.08;
    for(const [x,y] of cs){if(rnd()>=dens)continue;let near=false;for(let dy=-1;dy<=1&&!near;dy++)for(let dx=-1;dx<=1;dx++)if(mine[(y+dy)*W+x+dx]){near=true;break}if(near)continue;prop(pick(pl),x,y)}}
  // ---- 4) the extras of each precinct: a toppled pillar, a lone statue, a trail ----
  const ptSpots=[];for(let p=0;p<24;p++)ptSpots.push([]);for(const s of spots)ptSpots[pidAt(s.x,s.y)].push(s);
  for(let p=0;p<24;p++){const ls=ptSpots[p].slice().sort((a,b)=>b.r-a.r);if(!ls.length)continue;const sig=HGX_SIG[p];
    for(const ex of sig.ex){if(ex==='toppled'){const s=ls[0],cs=cellsOf(s);let done=0;for(let t=0;t<40&&!done;t++){const [x,y]=cs[(rnd()*cs.length)|0];if(blocker('r5',x,y,false)){done=1;const a=rnd()*6.28;for(let k=1;k<=3;k++)prop('r6',Math.round(x+Math.cos(a)*k),Math.round(y+Math.sin(a)*k),{sc:.8+rnd()*.3})}}}
      else if(ex==='lone'){const s=ls[ls.length-1],cs=cellsOf(s);for(let t=0;t<60;t++){const [x,y]=cs[(rnd()*cs.length)|0];if(statue(p,x,y,false)){const a=rnd()*6.28;ring(x,y,2,2,a).forEach(([xx,yy])=>prop(pick(sig.fam),xx,yy));break}}}}}
  // ---- 5) the passages: every stretch of three squares or more gets something small, never the same as the stretch next to it ----
  const DEG=(x,y)=>{let n=0;for(const [a,b] of HGX_DV)if(pass(x+a,y+b))n++;return n};
  const segId=new Int32Array(N).fill(-1),segs=[];
  const isSeg=(x,y)=>isOpen(x,y)&&kind[y*W+x]===0&&dist[y*W+x]>=0&&DEG(x,y)===2;
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const i=y*W+x;if(segId[i]>=0||!isSeg(x,y))continue;
    const comp=[[x,y]];segId[i]=-2;for(let k=0;k<comp.length;k++){const [cx,cy]=comp[k];for(const [a,b] of HGX_DV){const nx=cx+a,ny=cy+b,ni=ny*W+nx;if(segId[ni]===-1&&isSeg(nx,ny)){segId[ni]=-2;comp.push([nx,ny])}}}
    // order the cells along the way: from an end if there is one
    const inC=new Set(comp.map(c=>c[0]+','+c[1]));let st=comp[0];for(const c of comp){let n=0;for(const [a,b] of HGX_DV)if(inC.has((c[0]+a)+','+(c[1]+b)))n++;if(n===1){st=c;break}}
    const path=[st],vis=new Set([st[0]+','+st[1]]);for(let k=0;k<path.length;k++){const [cx,cy]=path[k];for(const [a,b] of HGX_DV){const key=(cx+a)+','+(cy+b);if(inC.has(key)&&!vis.has(key)){vis.add(key);path.push([cx+a,cy+b]);break}}}
    for(const c of comp)if(!vis.has(c[0]+','+c[1]))path.push(c);
    const id=segs.length;for(const [cx,cy] of comp)segId[cy*W+cx]=id;segs.push({id,path,picks:[],n:0})}
  const covered=s=>s.n>0;
  const segNeighbours=s=>{const out=new Set();for(const e of [s.path[0],s.path[s.path.length-1]])for(const [a,b] of HGX_DV){const jx=e[0]+a,jy=e[1]+b;if(segId[jy*W+jx]===s.id||!pass(jx,jy))continue;
      for(const [c,d] of HGX_DV){const sid=segId[(jy+d)*W+jx+c];if(sid>=0&&sid!==s.id)out.add(sid)}}return out};
  const order=segs.slice().sort((a,b)=>dist[a.path[0][1]*W+a.path[0][0]]-dist[b.path[0][1]*W+b.path[0][0]]);
  for(const s of order){const n=s.path.length;if(n<3)continue;const mid=s.path[n>>1],pid=pidAt(mid[0],mid[1]),pl=poolOf(pid),avoid=new Set(s.picks);
    for(const nb of segNeighbours(s))for(const p of segs[nb].picks)avoid.add(p);
    s.can=s.path.some(([x,y])=>okc(x,y));const cnt=n<8?1:n<18?2:n<40?3:4,taken=[];
    for(let k=0;k<cnt;k++){const tg=Math.floor((k+.5)*n/cnt);let spot=-1;
      for(let d=0;d<n&&spot<0;d++)for(const idx of d?[tg+d,tg-d]:[tg]){if(idx<0||idx>=n||taken.some(t=>Math.abs(t-idx)<3))continue;const [x,y]=s.path[idx];if(okc(x,y)&&!mine[y*W+x]){spot=idx;break}}
      if(spot<0)break;const avail=pl.filter(c=>!avoid.has(c)&&hgxKey(c[0],+c.slice(1))),code=avail.length?pick(avail):pick(pl.filter(c=>hgxKey(c[0],+c.slice(1))));if(!code)break;
      const [x,y]=s.path[spot];if(prop(code,x,y)){taken.push(spot);s.picks.push(code);avoid.add(code);s.n++}}}
  // trails: a line of one family prop along the longest passage of a precinct
  for(let p=0;p<24;p++){if(!HGX_SIG[p].ex.includes('trail'))continue;let best=null;for(const s of segs)if(s.path.length>=10&&(!best||s.path.length>best.path.length)){const m=s.path[s.path.length>>1];if(pidAt(m[0],m[1])===p)best=s}
    if(!best)continue;const code=HGX_SIG[p].fam[0];let n=0;for(let i=1;i<best.path.length&&n<9;i+=2){const [x,y]=best.path[i];if(prop(code,x,y,{sc:.8+rnd()*.3}))n++}if(n>2)counts.coinTrails++}
  // ---- 6) dead ends: a statue in the niche where one fits, otherwise a special find ----
  const dead=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(isOpen(x,y)&&dist[y*W+x]>=0&&DEG(x,y)===1&&kind[y*W+x]===0)dead.push([x,y]);
  for(let i=dead.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[dead[i],dead[j]]=[dead[j],dead[i]]}
  const SPECIAL=[['p3','p10','p0','r2','p2','p1'],['p3','p0','r2','r6','p1','p13'],['p14','p2','p3','p1','p0','p6'],['p8','p9','p0','r2','p1','p6'],['p10','p0','p13','r2','p1','r6'],['p4','p11','p3','p2','p0','p7'],['p3','p11','p2','p1','p0','p7'],['p10','p3','p7','p2','p13','p0']];
  let niche=0,want=Math.max(36,120-counts.stat);
  for(const [x,y] of dead){const pid=pidAt(x,y),b=bio[y*W+x];
    if(niche<want&&okc(x,y)&&!blk[(y)*W+x]&&!npcN[y*W+x]&&!nearStat(x,y,7)&&hgxKey('s',0)!==undefined){const sp=statPool(pid);let done=false;for(let t=0;t<3&&!done;t++){const k=hgxKey('s',pick(sp));if(!k)continue;L.decor.push({k,x,y,hx:1,block:true,deco:true,sc:r2(.95+rnd()*.1)});occ[y*W+x]=1;blk[y*W+x]=1;mine[y*W+x]=1;note('stat',x,y);statues.push([x,y]);niche++;done=true}if(done)continue}
    const sp=SPECIAL[b].filter(c=>hgxKey(c[0],+c.slice(1)));if(sp.length)prop(pick(sp),x,y,{sc:.95+rnd()*.25})}
  counts.niche=niche;
  // ---- 7) a few bundles of reeds in the marshes (reeds are the one thing that may stand in shallow water) ----
  {let n=0;for(let y=2;y<H-2&&n<60;y++)for(let x=2;x<W-2&&n<60;x++){if(fmap[y][x]!=='5'||!isOpen(x,y)||dist[y*W+x]<0||bad[y*W+x]||occ[y*W+x]||rnd()>=.03)continue;const k=hgxKey('p',15);if(!k)continue;
    L.decor.push({k,x,y,hx:1,block:false,walk:true,deco:true,sc:r2(.8+rnd()*.4),ox:r2((rnd()-.5)*.5),oy:r2((rnd()-.5)*.5)});occ[y*W+x]=1;mine[y*W+x]=1;note('prop',x,y);n++}}
  // ---- 8) little pictures on the walls beside the corridors ----
  {const faces=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const i=y*W+x;if(!isOpen(x,y)||dist[i]<0||bad[i]||fmap[y][x]==='5'||fmap[y][x]==='6')continue;
      for(const [a,b] of HGX_DV)if(isWallC(ch(x+a,y+b)))faces.push([x,y,a,b])}
    for(let i=faces.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[faces[i],faces[j]]=[faces[j],faces[i]]}
    const clearP=(x,y)=>{for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(Math.abs(dx)+Math.abs(dy)<3){const a=x+dx,b=y+dy;if(a>=0&&b>=0&&a<W&&b<H&&picG[b*W+a])return false}return true};
    for(const [x,y,a,b] of faces){if(counts.wall>=400)break;if(!clearP(x,y))continue;const bi=bio[(y+b)*W+x+a],pid=pidAt(x,y),r=rnd();let k;
      if(r<.42)k='art_hgdf_wsym'+bi;else if(r<.68)k='art_hgdf_wsym'+(8+((pid*5+1)%8));else if(r<.84)k='art_hgdf_wsym'+(8+((rnd()*8)|0));else k='art_hgdf_vine'+((rnd()*4)|0);
      if(!IMG[k])continue;L.decor.push({k,x,y,hx:1,wd:[a,b],pic:1,block:false,walk:true,deco:true,bob:k.indexOf('vine')>0?.9:.55});picG[y*W+x]=1;counts.wall++;counts.total++}}
  // ---- coverage of the passages ----
  let n3=0,cov=0,can=0,cc=0;for(const s of segs)if(s.path.length>=3){n3++;if(s.n>0)cov++;if(s.can){can++;if(s.n>0)cc++}}
  const why={bad:0,occ:0,water:0,mine:0,fm5:0,other:0,segs:0};for(const s of segs)if(s.path.length>=3&&!s.n){why.segs++;for(const [x,y] of s.path){const i=y*W+x;if(bad[i])why.bad++;else if(occ[i])why.occ++;else if(fmap[y][x]==='5')why.fm5++;else if(fmap[y][x]==='6')why.water++;else if(mine[i])why.mine++;else why.other++}}
  // the same little thing is never repeated near itself: where two non-blocking props or small rocks of the same picture lie within 9 squares, the later one is swapped for a different small thing that has no twin near it (or dropped if every kind is taken)
  {const cell=9,grid=new Map(),keep=[],fac=i=>i===10||i===11?2.3:i===3?1.8:1,ALT=[];let dropped=0,swapped=0;
    for(let n=0;n<16;n++)ALT.push('art_hgxprop'+n);for(const n of [1,2,3,6])ALT.push('art_hgxrock'+n);
    const near=(d,k)=>{const gx=(d.x/cell)|0,gy=(d.y/cell)|0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=grid.get((gx+a)+','+(gy+b)+','+k);if(l)for(const o of l)if(Math.abs(o.x-d.x)<9&&Math.abs(o.y-d.y)<9)return true}return false};
    const add=d=>{const key=((d.x/cell)|0)+','+((d.y/cell)|0)+','+d.k;if(!grid.has(key))grid.set(key,[]);grid.get(key).push(d)};
    const kindIdx=k=>{const m=/art_hgxprop(\d+)$/.exec(k);return m?+m[1]:-1};
    for(const d of L.decor){if(!d.hx||d.block||d.pic||!/art_hgx(prop|rock)/.test(d.k)){keep.push(d);continue}
      if(!near(d,d.k)){add(d);keep.push(d);continue}
      // a different small thing, tried from a point in the list that depends on the square, so neighbours differ
      let done=false;const st=((d.x*7+d.y*13)%ALT.length+ALT.length)%ALT.length;
      for(let t=0;t<ALT.length&&!done;t++){const k=ALT[(st+t)%ALT.length];if(k===d.k||!IMG[k]||!IMG[k].width||near(d,k))continue;
        const oi=kindIdx(d.k),ni=kindIdx(k);let sc=d.sc||1;if(oi>=0)sc/=fac(oi);if(ni>=0)sc*=fac(ni);d.k=k;d.sc=Math.round(sc*100)/100;add(d);keep.push(d);done=true;swapped++}
      if(!done)dropped++}
    L.decor=keep;counts.dedupDropped=dropped;counts.dedupSwapped=swapped;counts.total-=dropped}
  L._hgdx={why,counts,segments:{all:segs.length,len3:n3,covered:cov,pct:n3?Math.round(1000*cov/n3)/10:100,placeable:can,coveredOfPlaceable:cc,pctPlaceable:can?Math.round(1000*cc/can)/10:100},deadEnds:dead.length,statuesAll:statues.length,mineCells:mine.reduce((a,b)=>a+b,0),ms:Math.round(performance.now()-T0),prec:prec.map(p=>p.name)}}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdm&&L._hgdp&&L.decor)try{hgxBuild(L)}catch(e){console.error('hgdx',e)}}}
