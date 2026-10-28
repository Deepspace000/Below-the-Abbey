/* ==========================================================================
   THE FLOORS OF THE VAULT (levels 9671 to 9678; prefix vt / VTB). One generic maker (vtMake) builds a crypt floor from a plan: rooms carved as rectangles, doors (stairs, pale-silver locks, the secret door),
   walls from the graveyard's painted brick in the floor's own colour, wall torches of one flame colour, candle niches, floors of the graveyard's stones. Each floor then furnishes itself (its dress function):
   decor, creatures, lights, traps. Walls and ceilings are 1.5 high so that the engine's wall torches stand at hand height.
   A decor piece with an npc id is talked to by vault_story.js (khNpc 'vto_...'); the game keeps only a few fields of a piece, so its number i is looked up by square (vtI).
   ========================================================================== */
const VTB={WH:1.5,S:.8};
/* the stone of a spike plate: the dim slate, a little bluer, with a dark seam inset from the edge and a pale rune cross in the middle, so that it can be seen and walked round */
function vtPlateFloor(){
  if(FLOORS.vtf_plate)return 'vtf_plate';const src=FLOORS[gyFloorTone('vtf_slate','gyf_slate',1.12,[.82,.95,1.3])];if(!src)return 'gyf_slate';
  const N=Math.round(Math.sqrt(src.length/4)),d=new Uint8ClampedArray(src);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=(y*N+x)*4,e=Math.min(x,y,N-1-x,N-1-y),c=Math.min(Math.abs(x-N/2),Math.abs(y-N/2)),dg=Math.abs(x-N/2)+Math.abs(y-N/2);
    let k=1,add=0;
    if(e<N*.04)k=.2;                                      // the seam between this stone and the next
    else if(e<N*.09)add=70;                               // a pale raised rim all round
    else if(c<2&&e>N*.14)add=95;                          // the rune cross
    else if(dg<N*.1)add=60;                               // a small bright diamond in the middle
    else k=1.04;
    d[i]=Math.min(255,src[i]*k+add*.85);d[i+1]=Math.min(255,src[i+1]*k+add*.95);d[i+2]=Math.min(255,src[i+2]*k+add*1.15)}
  FLOORS.vtf_plate=d;return 'vtf_plate'}
/* an iron gate set in the wall: the brick above it, the gate itself over darkness (not over brick, which showed through the bars as a blank pale panel); extra paints on top (the glowing locks) */
function vtGateTile(brick,WH,tag,gain,rgb,glow){
  return gyTile('vtdark',WH,{fac:{img:'stairFix_2',i:0,n:1},gain:gain,rgb:rgb,tag:tag,emit:.14,draw:(x,w,h)=>{
    const im=IMG['gyp_'+brick+'_0'],f=IMG.gyp_stairFix_2,gh=f?f.height*128/f.width:94,top=Math.max(0,h-gh-1);
    if(im&&top>0){x.save();x.beginPath();x.rect(0,0,w,top);x.clip();for(let yy=0;yy<top;yy+=128)x.drawImage(im,0,yy,128,128);x.restore()}
    if(glow)glow(x,w,h)}})}
const VT_SPEC={};
const vtI=d=>{const L=LEVELS[LEVEL],q=L&&L.decor.find(z=>z.x===d.x&&z.y===d.y&&z.npc===d.npc);return q&&q.i!==undefined?q.i:(d.i||0)};   // the number of a piece, looked up by its square
/* ---------- the maker ---------- */
function vtMake(id){
  if(LEVELS[id])return LEVELS[id];
  const S=VT_SPEC[id];if(!S)throw new Error('vt: no plan for '+id);
  gyAlias();vtPics();
  const W=S.W,H=S.H,WH=VTB.WH,hs=(a,b,c)=>hash2(a,b,c+id),g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  for(const r of S.rects)for(let y=r[1];y<=r[3];y++)for(let x=r[0];x<=r[2];x++)g[y][x]='.';
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const open=(x,y)=>g[y]&&g[y][x]==='.',near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const vt=v=>ch(gyTile(S.brick+'_'+v,WH,S.rgb||S.wall?{gain:1.05*(S.wall||1),rgb:S.rgb}:undefined));
  const VAR=(S.vars||[0,0,0,3,3,5,5,1,0,3,2,4]).map(vt),RIM=[4,5,1,4,2].map(vt);
  const rimCell=new Set();for(const r of S.rects)for(let y=r[1]-1;y<=r[3]+1;y++)for(let x=r[0]-1;x<=r[2]+1;x++)if(g[y]&&g[y][x]==='#')rimCell.add(y*W+x);
  const rows=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){
    if(g[y][x]==='.'){s+='.';continue}
    if(!near(x,y)){s+=VAR[0];continue}
    s+=rimCell.has(y*W+x)&&hs(x,y,3)<.45?RIM[(hs(x,y,4)*RIM.length)|0]:VAR[(hs(x,y,5)*VAR.length)|0]}rows.push(s)}
  const put=(x,y,c)=>{rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
  const decor=[],enemies=[],items=[],lights=[],lcol={},occ=new Set(),traps=[],locks={},miss=[],V={lcol,col:S.lcol,torch:S.torch,locks,traps,miss,id};
  const reserved=new Set();   // squares in front of a door: nothing stands there
  /* ---- the doors ---- */
  let start=null;const doorSq=[];
  for(const D of S.doors){
    const dx=D.x,dy=D.y;let gid;
    const inner=[[0,-1],[1,0],[0,1],[-1,0]].map(([a,b])=>[dx+a,dy+b]).find(([x,y])=>open(x,y));
    if(!inner)throw new Error('vt '+id+': door at '+dx+','+dy+' has no floor beside it');
    if(D.kind==='stair'){
      gid=gyTile(S.brick+'_0',WH,{fac:{img:'stairFix_0',i:0,n:1},gain:1.1,rgb:S.rgb,tag:'vtstair'+D.to});
      KH_DOOR[gid]={vt:'stair',lvl:D.to,get at(){return typeof D.at==='function'?D.at():D.at}};
      }
    else if(D.kind==='lock'){
      const L=VT_LOCKS[D.lock],seats=D.lock==='L3'?3:1;
      gid=vtGateTile(S.brick,WH,'vtlock'+D.lock,1.1,[.8,.95,1.25],(x,w,h)=>{
        for(let s=0;s<seats;s++){const cx=seats===1?64:34+s*30,cy=h-(seats===1?56:62),R=seats===1?11:9;const gr=x.createRadialGradient(cx,cy,1,cx,cy,R+5);gr.addColorStop(0,'rgba(235,246,255,1)');gr.addColorStop(.45,'rgba(160,200,250,.75)');gr.addColorStop(1,'rgba(90,130,200,0)');
          x.fillStyle=gr;x.beginPath();x.arc(cx,cy,R+5,0,6.3);x.fill();x.strokeStyle='rgba(240,248,255,1)';x.lineWidth=1.8;x.beginPath();x.arc(cx,cy,R*.55,0,6.3);x.stroke();x.beginPath();x.arc(cx,cy,R,0,6.3);x.stroke()}});
      KH_DOOR[gid]={vt:'lock',id:D.lock};locks[D.lock]={x:dx,y:dy}}
    else if(D.kind==='secret'){
      gid=gyTile(S.brick+'_'+(D.v===undefined?2:D.v),WH,{gain:1.05*(S.wall||1),rgb:[(S.rgb||[1,1,1])[0],(S.rgb||[1,1,1])[1],(S.rgb||[1,1,1])[2]+.00031],tag:'vtsecret'});
      KH_DOOR[gid]={vt:'secret'};V.secret={x:dx,y:dy}}
    else if(D.kind==='ringgate'){
      gid=vtGateTile(S.brick,WH,'vtring',1.35,[1.0,1.05,1.3]);
      KH_DOOR[gid]={vt:'ringgate'};V.ringgate={x:dx,y:dy}}
    else if(D.kind==='road'){
      gid=gyTile('texGrey_1',2.4,{fac:{img:'gatesC_0',i:0,n:1},gain:1.1,tag:'vtroad'+D.dir});
      KH_DOOR[gid]={vt:'road',dir:D.dir}}
    put(dx,dy,ch(gid));doorSq.push([dx,dy,inner[0],inner[1]]);reserved.add(inner[0]+','+inner[1]);occ.add(inner[0]+','+inner[1]);
    {const f=inner[1]>dy?2:inner[1]<dy?0:inner[0]>dx?1:3;if(D.down)V.downAt={x:inner[0],y:inner[1],f};if(D.start)start={x:inner[0],y:inner[1],f}}}
  /* ---- the helpers a floor's dress function uses ---- */
  const free=(x,y)=>open(x,y)&&!occ.has(x+','+y);
  const dec=(a,x,y,o)=>{o=o||{};const kk=GYA[a]?'gy_'+a:a;if(!open(x,y)){miss.push(a+'@'+x+','+y);return null}
    const d={k:kk,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}d.sc=(o.sc||1)*(o.raw?1:VTB.S);if(o.npc){d.npc=o.npc;d.deco=false;if(o.block)d.solid=1}
    if(o.i!==undefined)d.i=o.i;if(o.wd)d.wd=o.wd;if(o.txt)d.txt=o.txt;if(o.goldAmt)d.goldAmt=o.goldAmt;if(o.ox!==undefined){d.ox=o.ox;d.oy=o.oy}decor.push(d);occ.add(x+','+y);return d};
  const sign=(x,y,wd,a,b)=>{if(!open(x,y)){miss.push('sign@'+x+','+y);return}decor.push({k:'sign_gy',x,y,block:false,wd,txt:[a,b||''],sc:1})};
  const foe=(t,x,y,lvl)=>{if(!open(x,y)||(occ.has(x+','+y)&&!reserved.has(x+','+y))){miss.push('foe '+t+'@'+x+','+y);return false}enemies.push({t,x,y,lvl:lvl||S.diff});occ.add(x+','+y);return true};
  const light=(x,y,col)=>{if(!open(x,y)){miss.push('light@'+x+','+y);return}lights.push([x,y]);if(col)lcol[x+','+y]=col};
  const trap=(kind,x,y,o)=>{if(!open(x,y)){miss.push('trap@'+x+','+y);return}traps.push(Object.assign({kind,x,y,hidden:kind==='ambush'},o||{}))};
  const fm=[];for(let y=0;y<H;y++)fm.push(new Array(W).fill(S.floorDef||'0'));
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open(x,y))fm[y][x]=f};
  const C={id,S,W,H,g,rows,open,free,dec,sign,foe,light,trap,setF,decor,enemies,lights,lcol,occ,traps,V,rng:(a,b)=>hash2(a,b,id*3),start:null};
  S.dress(C);
  /* ---- the way in: the arrival square ---- */
  /* ---- wall torches of this floor's colour: along the way, every few squares, in the rooms more often; none beside a lock or a stair ---- */
  const torches=[];
  {const blk=new Set();for(const d of decor)if(d.block)blk.add(d.x+','+d.y);const skip=doorSq.map(q=>[q[0],q[1]]);
   const cand=[];
   for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(open(x,y)||rows[y][x]==='.'||skip.some(q=>Math.hypot(q[0]-x,q[1]-y)<2.2))continue;
     for(let f=0;f<4;f++){const nx=x+GYM_D[f][0],ny=y+GYM_D[f][1];if(!open(nx,ny)||blk.has(nx+','+ny))continue;
       const d4=GYM_D.filter(([a,b])=>open(nx+a,ny+b)).length,nar=(!open(nx-1,ny)&&!open(nx+1,ny))||(!open(nx,ny-1)&&!open(nx,ny+1));
       cand.push({x,y,f,nar,pri:d4>=3?1:d4===2?2:3,h:hs(x,y,f*7)})}}
   cand.sort((a,b)=>a.pri-b.pri||a.h-b.h);
   const nearT=(c,gp)=>torches.some(t=>Math.hypot(t[0]-c.x,t[1]-c.y)<gp);
   for(const c of cand){const gp=c.nar?3.4:2.7;if(nearT(c,gp))continue;torches.push([c.x,c.y,c.f,c.nar?1:0])}}
  V.torches=torches;
  /* ---- candle niches: a few alcoves cut into the walls of the halls ---- */
  {const tk=new Set(torches.map(t=>t[0]+','+t[1])),NIL=gyTile(S.brick+'_0',WH,{fac:{img:'cryptD_3',i:0,n:1},gain:.92*(S.wall||1),rgb:S.rgb,tag:'vtniche'+id,draw:(x,w,h)=>{
     const c=IMG.gyp_cryptD_2;x.globalCompositeOperation='lighter';const gr=x.createRadialGradient(64,h-62,2,64,h-62,46);gr.addColorStop(0,'rgba(255,170,70,.2)');gr.addColorStop(1,'rgba(255,140,40,0)');x.fillStyle=gr;x.fillRect(0,h-120,w,120);x.globalCompositeOperation='source-over';
     if(c)x.drawImage(c,0,0,c.width,c.height*.5,46,h-84,36,25)}}),cand=[];
   const nearDoor=(x,y)=>doorSq.some(q=>Math.hypot(q[0]-x,q[1]-y)<3.2);
   for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(open(x,y)||rows[y][x]==='.'||tk.has(x+','+y)||nearDoor(x,y))continue;
     const ns=GYM_D.filter(([a,b])=>open(x+a,y+b));if(ns.length!==1)continue;const [a,b]=ns[0],nx=x+a,ny=y+b;
     if(torches.some(t=>Math.hypot(t[0]-x,t[1]-y)<1.6)||occ.has(nx+','+ny))continue;cand.push({x,y,nx,ny,h:hs(x,y,95)})}
   cand.sort((p,q)=>p.h-q.h);const nic=[];
   for(const c of cand){if(nic.length>=(S.niches===undefined?10:S.niches))break;if(nic.some(n=>Math.hypot(n.x-c.x,n.y-c.y)<5))continue;nic.push(c);put(c.x,c.y,ch(NIL));light(c.nx,c.ny,[1.15,.8,.42])}}
  /* ---- a lamp every few squares where none is near ---- */
  {const have=lights.slice();for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!open(x,y))continue;if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=(S.lampGap||5.2))){have.push([x,y]);lights.push([x,y]);lcol[x+','+y]=S.lcol}}}
  /* ---- floors ---- */
  const fb0=gyFloorTone('vtf_'+id+'a',GY_FLOORSET[S.fl0===undefined?3:S.fl0],S.fgain||.5,S.ftint||[.9,.93,1]),fb1=gyFloorTone('vtf_'+id+'b',GY_FLOORSET[S.fl1===undefined?5:S.fl1],S.fgain1||.7,S.ftint||[.9,.93,1]),
    fw0=gyFloorWet('vtf_'+id+'w',fb0,S.lcol,id%97+3),fSet=[fb0,fb1,fw0,gyFloorTone('gyf_cflag','gyf_flag',.46,[.88,.92,1]),vtPlateFloor(),fb0];
  const fmS=fm.map(r=>r.join(''));
  const names=S.names||[];
  const L={rows,chars,fmap:fmS,floorSet:fSet,floor:fb0,floor2:fb1,ceil:S.ceil||'gyc_crypt',ceilH:WH,start,enemies,items,decor,lights,portals:[],day:0,amb:S.amb===undefined?.02:S.amb,torchGap:1e9,noTele:true,noExtras:true,
    name:VT.NAMES[id],label:VT.NAMES[id],diff:S.diff,mapNames:names,_vt:V};
  V.start=start;V.floorsN=fSet.length;
  LEVELS[id]=L;LEVEL_NAMES[id]=VT.NAMES[id];LEVEL_RATING[id]=S.diff;
  if(miss.length)console.warn('vt '+id+' missed: '+miss.join(' '));
  return L}
for(const id of [9671,9672,9673,9674,9675,9676,9677,9678])KH_LAZY[id]=((n)=>()=>vtMake(n))(id);
/* the ASCII of a floor, for the tests and for the notes: # wall, . floor, D door, letters for pieces */
function vtAscii(id){
  const L=LEVELS[id]||(KH_LAZY[id]&&(KH_LAZY[id](),LEVELS[id]));if(!L)return '';const rows=L.rows.map(r=>r.split('').map(c=>c==='.'?'.':'#'));
  for(const [k,gid] of Object.entries(L.chars)){const d=KH_DOOR[gid];if(!d)continue;for(let y=0;y<rows.length;y++)for(let x=0;x<L.rows[y].length;x++)if(L.rows[y][x]===k)rows[y][x]=d.vt==='lock'?'L':d.vt==='stair'?'S':d.vt==='secret'?'?':d.vt==='ringgate'?'R':'D'}
  for(const d of L.decor){if(d.k==='sign_gy')continue;const c=d.npc?'N':d.block?'o':'-';if(rows[d.y][d.x]==='.'||rows[d.y][d.x]==='-')rows[d.y][d.x]=c}
  for(const e of L.enemies)rows[e.y][e.x]=/^vt/.test(e.t)?'B':'e';
  for(const t of (L._vt&&L._vt.traps)||[])rows[t.y][t.x]=t.kind==='spike'?'^':'x';
  return rows.map(r=>r.join('')).join('\n')}
/* the self-check: from the arrival square with every lock shut, what can be reached; used by the tests */
function vtReach(id,opts){
  const L=LEVELS[id]||(KH_LAZY[id]&&(KH_LAZY[id](),LEVELS[id]));opts=opts||{};const W=L.rows[0].length,H=L.rows.length,bs=new Set();
  for(const d of L.decor)if(d.block||(d.npc&&d.solid))bs.add(d.x+','+d.y);
  const gate=(x,y)=>{if(!opts.thru)return false;const c=L.rows[y][x],d=c!=='.'&&KH_DOOR[L.chars[c]];return !!(d&&(d.vt==='lock'||d.vt==='secret'||d.vt==='ringgate'))};   // with thru, the locks and the secret door count as open
  const seen=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];
  for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of GYM_D){const nx=x+a,ny=y+b,k=nx+','+ny;if(seen.has(k)||nx<0||ny<0||nx>=W||ny>=H||(L.rows[ny][nx]!=='.'&&!gate(nx,ny))||bs.has(k))continue;seen.add(k);q.push([nx,ny])}}
  const open=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(L.rows[y][x]==='.'&&!seen.has(x+','+y)&&!bs.has(x+','+y))open.push([x,y]);
  return {seen,unreached:open}}
