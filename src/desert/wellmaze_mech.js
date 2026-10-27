/* ==========================================================================
   THE WELL MAZE: doors, keys, switches, secret closets, pits and the mirror walk, as laid out when a level is built (prefix wm / WM). WM.mech(c,wl) is called by WM.build.
   L = c.meta.wm becomes LEVELS[id]._wm: doors{'x,y'}, sw[], pits{}, vault{}, keyAt{}, mirror{}.
   ========================================================================== */
const WM_D4=[[0,-1],[1,0],[0,1],[-1,0]];
function wmBfs(c,x0,y0,avoid){const W=c.W,H=c.H,d=new Int32Array(W*H).fill(-1),q=[y0*W+x0];d[q[0]]=0;
  for(let i=0;i<q.length;i++){const p=q[i],x=p%W,y=(p/W)|0;for(const [a,b] of WM_D4){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||d[ny*W+nx]>=0||!c.open(nx,ny))continue;if(avoid&&avoid(nx,ny))continue;d[ny*W+nx]=d[p]+1;q.push(ny*W+nx)}}
  return d}
const wmDeg=(c,x,y)=>WM_D4.filter(([a,b])=>c.open(x+a,y+b)).length;
/* a sign beside a stair door: the room around a stair is small, so the sign may take any square next to the foot of the stair as long as the foot and the rest of the room stay reachable */
function wmStairSign(c,id,st){
  const W=c.W,blk=new Set(c.dec.filter(d=>d.block).map(d=>d.x+','+d.y)),from=c.M.arrive;
  const cand=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[st.ax+a,st.ay+b]).filter(([x,y])=>c.open(x,y)&&!blk.has(x+','+y)&&!(x===from.x&&y===from.y)&&!(x===st.ax&&y===st.ay));
  for(const [x,y] of cand){
    const d=wmBfs(c,from.x,from.y,(nx,ny)=>blk.has(nx+','+ny)||(nx===x&&ny===y));
    if(d[st.ay*W+st.ax]<0)continue;
    const n=c.D('wm_signpost',x,y,{block:true,npc:'wmnote_'+id,force:true});if(n){c.meta.notes[id]={x,y};return true}}
  console.warn('wm: no square for sign '+id);return false}
WM.VLOOT={lever1:['elixir','supermana'],weights:['elixir','potion6'],pair:['supermana','supermana','greatermana'],hidden:['elixir','potion6'],mirror:['elixir','supermana'],trap:['supermana','elixir'],bells:['wmring','supermana'],chain:['wmplate','supermana'],lanterns:['wmring','supermana']};
WM.mech=function(c,wl){
  const k=c.k,M=c.M,g=c.g,W=c.W,T=wl.tiles,rnd=c.rnd,L={doors:{},sw:[],pits:{},vault:{},keyAt:c.meta.keyAt||{},closets:[]};
  c.meta.wm=L;
  const addDoor=(x,y,o)=>{L.doors[x+','+y]=Object.assign({x,y},o)};
  const inRoomRect=(x,y)=>M.rooms.some(r=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1);
  // ---- the stairs ----
  if(k>0){const u=M.up;T.put(u.x,u.y,T.doorUp());addDoor(u.x,u.y,{type:'up'})}
  if(M.down){const d=M.down;T.put(d.x,d.y,T.doorDown(k));addDoor(d.x,d.y,{type:'down',key:'wmkey'+(k+1)});
    // a brass plate beside the foot of the stair names the key
    wmStairSign(c,'stairdown'+k,d)}
  if(k>0&&WM_NOTES['violet'+k])wmStairSign(c,'violet'+k,M.up);
  // ---- vault doors and the riddle closet ----
  for(const r of M.rooms){if(!r.sealed||r.noDoor||!r.door)continue;const q=r.door;
    const type=r.kind==='riddle'?'riddle':(r.vault==='mirror'?'secret':'sealed');
    T.put(q.x,q.y,type==='riddle'?T.doorRiddle():type==='sealed'?T.sealed():T.secret());g[q.y][q.x]='#';
    addDoor(q.x,q.y,{type,vault:r.vault||'riddle',room:r.id});L.vault[r.vault||'riddle']={x:q.x,y:q.y,room:r.id,inside:q.inside,outside:q.outside,rect:{x0:r.x0,x1:r.x1,y0:r.y0,y1:r.y1}};
    // the first treasure chest of a vault holds its special things
    const tc=c.dec.find(d=>d.k==='wm_treasure_chest'&&d.x>=r.x0&&d.x<=r.x1&&d.y>=r.y0&&d.y<=r.y1);
    if(tc&&WM.VLOOT[r.vault])c.meta.loot[tc.x+','+tc.y]=WM.VLOOT[r.vault].slice()}
  {const rr=M.rooms.find(r=>r.kind==='riddle'),dq=rr&&rr.door;if(rr){const cells=c.cells(rr).sort((a,b)=>Math.hypot(b[0]-dq.inside.x,b[1]-dq.inside.y)-Math.hypot(a[0]-dq.inside.x,a[1]-dq.inside.y));const kd=c.chest('treasure_chest',cells[0][0],cells[0][1],3,['wmkey2'],{force:true});if(kd)L.keyAt.wmkey2={x:kd.x,y:kd.y}}}
  // ---- dead ends: secret closets, then the switches ----
  const ends=[];for(let y=2;y<c.H-2;y++)for(let x=2;x<c.W-2;x++)if(c.free(x,y)&&wmDeg(c,x,y)===1&&M.dist[y*W+x]>=24&&!inRoomRect(x,y)&&!M.sdoors.some(q=>Math.abs(q.outside.x-x)+Math.abs(q.outside.y-y)<6))ends.push([x,y]);
  for(let i=ends.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[ends[i],ends[j]]=[ends[j],ends[i]]}
  const usedEnd=[],farFrom=(x,y,d)=>usedEnd.every(e=>Math.abs(e[0]-x)+Math.abs(e[1]-y)>=d);
  const takeEnd=(pred,gap)=>{const i=ends.findIndex(e=>c.free(e[0],e[1])&&farFrom(e[0],e[1],gap||10)&&(!pred||pred(e)));if(i<0)return null;const e=ends.splice(i,1)[0];usedEnd.push(e);return e};
  const distFromVault=v=>{const q=L.vault[v];return q?wmBfs(c,q.outside.x,q.outside.y):null};
  const addSw=(vault,type,x,y,need)=>{const n=L.sw.length;L.sw.push({n,vault,type,x,y,need:need||1});c.D(type==='crank'?'wm_crank':type==='chain'?'wm_chain':'wm_lever_up',x,y,{block:true,npc:'wmsw_'+n});return n};
  const farthestEnd=(vault,gap)=>{const d=distFromVault(vault);if(!d)return null;let best=null;for(const e of ends){if(!c.free(e[0],e[1])||!farFrom(e[0],e[1],gap||10))continue;const v=d[e[1]*W+e[0]];if(v<0)continue;if(!best||v>best.v)best={v,e}}
    if(!best)return null;ends.splice(ends.indexOf(best.e),1);usedEnd.push(best.e);return best.e};
  const CL={0:['chest','chest'],1:['lever:hidden','chest','chest'],2:['key3','chest','chest'],3:['chest','chest']}[k];
  for(const kind of CL){const D=kind.startsWith('lever')?farthestEnd('hidden',12):takeEnd(null,12);if(!D)continue;
    const E=WM_D4.map(([a,b])=>[D[0]+a,D[1]+b]).find(([x,y])=>c.open(x,y));if(!E)continue;
    T.put(E[0],E[1],T.secret());g[E[1]][E[0]]='#';addDoor(E[0],E[1],{type:'secret',closet:kind});L.closets.push({kind,x:D[0],y:D[1],door:{x:E[0],y:E[1]}});
    if(kind==='chest')c.chest('chest',D[0],D[1],2,null,{});
    else if(kind==='key3'){c.chest('treasure_chest',D[0],D[1],3,['wmkey3'],{});L.keyAt.wmkey3={x:D[0],y:D[1]}}
    else if(kind.startsWith('lever')){c.D('wm_lever_up',D[0],D[1],{block:true,npc:'wmsw_'+L.sw.length});L.sw.push({n:L.sw.length,vault:'hidden',type:'lever',x:D[0],y:D[1],need:1,hidden:true})}}
  // ---- the switches in plain sight at far dead ends ----
  if(k===0){const e=farthestEnd('lever1');if(e)addSw('lever1','lever',e[0],e[1])}
  if(k===1){const a=farthestEnd('pair',10);if(a){addSw('pair','crank',a[0],a[1],2);const b=takeEnd(e=>Math.abs(e[0]-a[0])+Math.abs(e[1]-a[1])>=34,10);if(b)addSw('pair','crank',b[0],b[1],2)}}
  const guard=(e,types,pits)=>{ // pits in the approach and watchers close by
    const N=WM_D4.map(([a,b])=>[e[0]+a,e[1]+b]).find(([x,y])=>c.open(x,y));if(!N)return;let p=[N[0],N[1]],prev=[e[0],e[1]],n=0;
    while(n<pits){const nx=WM_D4.map(([a,b])=>[p[0]+a,p[1]+b]).filter(([x,y])=>c.open(x,y)&&!(x===prev[0]&&y===prev[1]));if(!nx.length)break;if(wmDeg(c,p[0],p[1])<=2){L.pits[p[0]+','+p[1]]=2;n++}prev=p;p=nx[0]}
    let m=0;for(const [x,y] of [N,prev,p])if(m<types.length&&c.free(x,y)&&!(x===e[0]&&y===e[1])){c.enemy(types[m],x,y);m++}};
  if(k===2){const e=farthestEnd('trap',12);if(e){addSw('trap','lever',e[0],e[1]);guard(e,['wmspider','wmcultist'],3)}}
  if(k===3){const e=farthestEnd('chain',12);if(e){addSw('chain','chain',e[0],e[1]);guard(e,['wmgolem','wmgolem'],0)}}
  // ---- pits: a few hollow slabs in the corridors, never in a room, never near a stair ----
  const stair=[M.arrive,M.back].filter(Boolean);
  const cand=[];for(let y=2;y<c.H-2;y++)for(let x=2;x<c.W-2;x++)if(c.free(x,y)&&wmDeg(c,x,y)===2&&M.dist[y*W+x]>=18&&!inRoomRect(x,y)&&stair.every(s=>Math.abs(s.x-x)+Math.abs(s.y-y)>=14))cand.push([x,y]);
  for(let i=cand.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[cand[i],cand[j]]=[cand[j],cand[i]]}
  const pits=[];for(const [x,y] of cand){if(pits.length>=6)break;if(pits.every(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)>=9)&&!L.pits[x+','+y]){pits.push([x,y]);L.pits[x+','+y]=1}}
  // ---- the mirror walk (498): a white crystal at a dead end near the hall marks the start; the glass shows the walk with left and right turned about ----
  if(k===1){const mr=M.rooms.find(r=>r.kind==='mirror'),v=L.vault.mirror;if(mr&&v){
    let best=null;
    const fromHall=wmBfs(c,(mr.x0+mr.x1)>>1,(mr.y0+mr.y1)>>1);
    const starts=[];for(let y=2;y<c.H-2;y++)for(let x=2;x<c.W-2;x++)if(c.free(x,y)&&wmDeg(c,x,y)===1&&!inRoomRect(x,y)){const h=fromHall[y*W+x];if(h>=0&&h<=80)starts.push([x,y,h])}
    for(const [sx,sy,h] of starts){
      const d=wmBfs(c,sx,sy),len=d[v.outside.y*W+v.outside.x];if(len<8||len>70)continue;
      const path=[[v.outside.x,v.outside.y]];let cur=path[0];while(d[cur[1]*W+cur[0]]>0){const nxt=WM_D4.map(([a,b])=>[cur[0]+a,cur[1]+b]).find(([x,y])=>x>=0&&y>=0&&x<W&&y<c.H&&d[y*W+x]===d[cur[1]*W+cur[0]]-1);if(!nxt)break;path.push(nxt);cur=nxt}
      path.reverse();const runs=[];const f0=WM_D4.findIndex(q=>q[0]===path[1][0]-path[0][0]&&q[1]===path[1][1]-path[0][1]);let heading=f0,run=1;
      for(let i=2;i<path.length;i++){const dx=path[i][0]-path[i-1][0],dy=path[i][1]-path[i-1][1],hd=WM_D4.findIndex(q=>q[0]===dx&&q[1]===dy);
        if(hd!==heading){runs.push({n:run,turn:((hd-heading+4)%4)===1?'R':((hd-heading+4)%4)===3?'L':'B'});run=0;heading=hd}run++}
      runs.push({n:run,turn:null});
      const dd=[v.x-v.outside.x,v.y-v.outside.y],hd2=WM_D4.findIndex(q=>q[0]===dd[0]&&q[1]===dd[1]),rel=(hd2-heading+4)%4,side=rel===0?'ahead':rel===1?'right':rel===3?'left':'behind';
      const score=runs.length*4+Math.abs(len-24)*.3+h*.1+(runs.some(r=>r.turn==='B')?60:0);
      if(runs.length<=10&&(!best||score<best.score))best={score,runs,side,len,start:{x:sx,y:sy,f:f0}}}
    if(best){L.mirror={start:best.start,runs:best.runs,side:best.side,len:best.len};
      c.D('wm_crystal_white',best.start.x,best.start.y,{block:false,walk:true,deco:true,sc:.9});c.light(best.start.x,best.start.y,WM_COL.wht)}
    else console.error('wm: no mirror walk found')}}
};
