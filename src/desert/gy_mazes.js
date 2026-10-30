/* ==========================================================================
   THE FOUR MAZES UNDER THE WENLOCK GRAVEYARD (levels 532 to 535; prefix gy / GYM). Each is 31 by 31, a maze of one-square corridors with a few small rooms, walled in its own painted brick:
   0 The Red Ossuary (red clay brick, RED torches, skeletons, level 84, quest: a KEY for the iron door, boss Lord Corwin Vane)
   1 The Grey Charnel (grey stone brick, YELLOW torches, ghouls and zombies, 85, quest: three LEVERS in the order of a riddle, boss Digger Grimsby)
   2 The Black Barrow (black basalt brick, BLUE torches, wraiths, shades and banshees, 86, quest: a HUNT, put eight restless spirits to rest, boss Sir Aldric the Forsworn)
   3 The Pale Catacombs (bone-white mossy brick, PURPLE torches, rats, bone hounds and ravens, 87, quest: a TRAPPED CHEST with the Prioress's seal, boss Prioress Morwenna).
   The boss waits in a room at the far corner, behind one door (a wall cell that opens). Everything the party needs for the door lies outside it, and the self-check (end of this file) proves it.
   The talk, the levers, the chests and the boss fights are in gy_quests.js and gy_boss.js.
   ========================================================================== */
const GYM={W:31,H:31,N:15,WH:1.3};   // walls and ceiling 1.3 high, so that the wall torches (drawn by the engine at a height worked out from the ceiling) stand at the height of a hand
const GYM_SPEC=[
 {seed:84011,brick:'texRed',name:GY.NAMES[532],lcol:[1.45,.58,.34],torch:{fl:1,red:true,col:[1.5,.6,.35],name:'red',css:'#e0452a'},floor:'3',floor2:'1',ceil:'gyc_0',
  rooms:[{id:'start',kind:'start',i:0,j:13,w:2,h:2},{id:'boss',kind:'boss',i:11,j:0,w:4,h:3},{id:'cell',kind:'cell',w:3,h:2,zone:[2,8,1,5]},{id:'hall',kind:'hall',w:3,h:3,zone:[4,9,5,10]},{id:'ossuary',kind:'ossuary',w:2,h:2,zone:[9,13,6,11]},{id:'chapel',kind:'chapel',w:2,h:2,zone:[1,5,7,11]}],
  foes:[['gyskel',5],['gypike',3],['gybmage',2]],count:22},
 {seed:85029,brick:'texGrey',name:GY.NAMES[533],lcol:[1.35,1.2,.42],torch:{fl:4,col:[1.45,1.25,.4],name:'yellow',css:'#f2d23c'},floor:'5',floor2:'2',ceil:'gyc_1',
  rooms:[{id:'start',kind:'start',i:0,j:13,w:2,h:2},{id:'boss',kind:'boss',i:11,j:0,w:4,h:3},{id:'lev0',kind:'lever',w:2,h:2,zone:[1,4,1,5]},{id:'lev1',kind:'lever',w:2,h:2,zone:[5,9,8,12]},{id:'lev2',kind:'lever',w:2,h:2,zone:[10,13,6,11]},{id:'pit',kind:'hall',w:3,h:3,zone:[4,8,3,7]}],
  foes:[['gyghoul',4],['gyzombie',5],['gygiant',2]],count:22},
 {seed:86043,brick:'texBlack',vars:[2,3,5,5,1,3,2,4,3,5],name:GY.NAMES[534],lcol:[.45,.78,1.6],torch:{fl:3,col:[.45,.8,1.7],name:'blue',css:'#4f9cff'},floor:'5',floor2:'3',ceil:'gyc_2',
  rooms:[{id:'start',kind:'start',i:0,j:13,w:2,h:2},{id:'boss',kind:'boss',i:11,j:0,w:4,h:3},{id:'moot',kind:'hall',w:3,h:3,zone:[3,8,4,9]},{id:'sorrow',kind:'hall',w:3,h:2,zone:[8,12,7,12]},{id:'vigil',kind:'chapel',w:2,h:2,zone:[1,5,1,5]}],
  foes:[['gywraith',4],['gyshade',4],['gybanshee',4]],count:24},
 {seed:87057,brick:'texBone',name:GY.NAMES[535],lcol:[.68,.45,.88],torch:{fl:2,col:[.56,.36,.74],name:'purple',css:'#b06cf0'},floor:'4',floor2:'2',ceil:'gyc_3',wall:.55,floorGain:.55,
  rooms:[{id:'start',kind:'start',i:0,j:13,w:2,h:2},{id:'boss',kind:'boss',i:11,j:0,w:4,h:3},{id:'reliquary',kind:'reliquary',w:2,h:2,zone:[3,9,5,10]},{id:'nest',kind:'hall',w:3,h:3,zone:[5,10,9,12]},{id:'bonehall',kind:'ossuary',w:3,h:2,zone:[1,5,2,6]}],
  foes:[['gyrats',4],['gyhound',4],['gyrat',3],['gyraven',3]],count:24}
];
const GYM_D=[[0,-1],[1,0],[0,1],[-1,0]];
/* the maze maker: pure code. Rooms are blocks of lattice nodes (a node is the cell 2i+1,2j+1) carved first; the rest is a walk over the lattice that likes to go straight. The boss room is left out of the walk and joined by ONE door cell. */
function gyMazeGen(spec){
  const N=GYM.N,W=GYM.W,H=GYM.H,NN=N*N;
  for(let attempt=0;attempt<30;attempt++){
    const R=gyRng(spec.seed+attempt*131),g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
    const occ=new Uint8Array(NN),rooms=[];
    const fits=(i0,j0,w,h,gap)=>{if(i0<0||j0<0||i0+w>N||j0+h>N)return false;for(let j=j0-gap;j<j0+h+gap;j++)for(let i=i0-gap;i<i0+w+gap;i++)if(i>=0&&j>=0&&i<N&&j<N&&occ[j*N+i])return false;return true};
    let bad=false;
    for(const sp of spec.rooms){let ok=false,i0=sp.i,j0=sp.j;
      if(sp.i!==undefined)ok=fits(i0,j0,sp.w,sp.h,0);
      else for(let t=0;t<400&&!ok;t++){const z=sp.zone;i0=z[0]+((R()*(z[1]-z[0]+1))|0);j0=z[2]+((R()*(z[3]-z[2]+1))|0);ok=fits(i0,j0,sp.w,sp.h,t<250?1:0)}
      if(!ok){bad=true;break}
      const r=Object.assign({},sp,{i0,j0,i1:i0+sp.w-1,j1:j0+sp.h-1,x0:2*i0+1,y0:2*j0+1,x1:2*(i0+sp.w-1)+1,y1:2*(j0+sp.h-1)+1});rooms.push(r);
      for(let j=j0;j<j0+sp.h;j++)for(let i=i0;i<i0+sp.w;i++)occ[j*N+i]=1}
    if(bad)continue;
    const boss=rooms.find(r=>r.kind==='boss'),start=rooms.find(r=>r.kind==='start');
    for(const r of rooms)for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)g[y][x]='.';
    const inBoss=(i,j)=>i>=boss.i0&&i<=boss.i1&&j>=boss.j0&&j<=boss.j1;
    const vis=new Uint8Array(NN),dirIn=new Int8Array(NN).fill(-1),st=[start.j0*N+start.i0];vis[st[0]]=1;
    while(st.length){const u=st[st.length-1],i=u%N,j=(u/N)|0,cand=[];
      for(let d=0;d<4;d++){const a=i+GYM_D[d][0],b=j+GYM_D[d][1];if(a<0||b<0||a>=N||b>=N||vis[b*N+a]||inBoss(a,b))continue;cand.push(d)}
      if(!cand.length){st.pop();continue}
      let d=cand[(R()*cand.length)|0];if(dirIn[u]>=0&&cand.includes(dirIn[u])&&R()<.6)d=dirIn[u];
      const a=i+GYM_D[d][0],b=j+GYM_D[d][1];g[2*j+1+GYM_D[d][1]][2*i+1+GYM_D[d][0]]='.';g[2*b+1][2*a+1]='.';vis[b*N+a]=1;dirIn[b*N+a]=d;st.push(b*N+a)}
    // a few loops between nodes that are both in the maze
    for(let t=0,k=0;k<10&&t<600;t++){const i=(R()*(N-1))|0,j=(R()*(N-1))|0,d=R()<.5?1:2,a=i+GYM_D[d][0],b=j+GYM_D[d][1];if(a>=N||b>=N||inBoss(i,j)||inBoss(a,b)||!vis[j*N+i]||!vis[b*N+a])continue;const cx=2*j+1+GYM_D[d][1],cy=cx,mx=2*i+1+GYM_D[d][0],my=2*j+1+GYM_D[d][1];if(g[my][mx]==='#'){g[my][mx]='.';k++}}
    // distances from the start
    const dist=new Int32Array(W*H).fill(-1),sx=start.x0,sy=start.y0,Q=[sy*W+sx];dist[Q[0]]=0;
    for(let q=0;q<Q.length;q++){const c=Q[q],x=c%W,y=(c/W)|0;for(const [dx,dy] of GYM_D){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||dist[ny*W+nx]>=0)continue;dist[ny*W+nx]=dist[c]+1;Q.push(ny*W+nx)}}
    // the boss door: the cell between an edge node of the boss room and a node of the maze, as far from the start as can be
    let best=null;
    for(let j=boss.j0;j<=boss.j1;j++)for(let i=boss.i0;i<=boss.i1;i++)for(const [dx,dy] of GYM_D){const a=i+dx,b=j+dy;if(a<0||b<0||a>=N||b>=N||inBoss(a,b)||!vis[b*N+a])continue;
      const ox=2*a+1,oy=2*b+1,dd=dist[oy*W+ox];if(dd<0)continue;if(!best||dd>best.dd)best={dd,x:2*i+1+dx,y:2*j+1+dy,ox,oy,ix:2*i+1,iy:2*j+1}}
    if(!best)continue;
    let floors=0,reached=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y][x]==='.'){floors++;if(dist[y*W+x]>=0)reached++}
    if(reached<floors-boss.w*2*boss.h*2)continue;
    return {g,rooms,boss,start,door:best,dist,floors,reached,seed:spec.seed+attempt*131}}
  throw new Error('gy: maze could not be made')}
/* ---- the wall tiles of a maze: the brick in six variants, and the rim of every room in the stained and chipped ones ---- */
function gyMazeBuild(k){
  const id=GY.M[k];if(LEVELS[id])return LEVELS[id];
  gyAlias();
  const spec=GYM_SPEC[k],M=gyMazeGen(spec),W=GYM.W,H=GYM.H,g=M.g,WH=GYM.WH,hs=(a,b,c)=>hash2(a,b,c),R=gyRng(M.seed*7+k);
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const vt=v=>ch(gyTile(spec.brick+'_'+v,WH,spec.wall?{gain:1.05*spec.wall}:undefined));
  const VAR=(spec.vars||[0,0,0,3,3,5,5,1,0,3,2,4]).map(vt),RIM=[4,5,1,4,2].map(vt);
  const open=(x,y)=>g[y]&&g[y][x]==='.',near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const rimCell=new Set();for(const r of M.rooms)for(let y=r.y0-1;y<=r.y1+1;y++)for(let x=r.x0-1;x<=r.x1+1;x++)if(g[y]&&g[y][x]==='#')rimCell.add(y*W+x);
  const rows=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){
    if(g[y][x]==='.'){s+='.';continue}
    if(!near(x,y)){s+=VAR[0];continue}
    s+=rimCell.has(y*W+x)&&hs(x,y,3)<.5?RIM[(hs(x,y,4)*RIM.length)|0]:VAR[(hs(x,y,5)*VAR.length)|0]}rows.push(s)}
  const put=(x,y,c)=>{rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
  // the way up: a doorway in the west wall of the start room, an arched stair
  const sr=M.start,ex={x:0,y:(sr.y0+sr.y1)>>1};
  {const gid=gyTile(spec.brick+'_0',WH,{fac:{img:'stairFix_0',i:0,n:1},gain:1.1});
   KH_DOOR[gid]={lvl:GY.ID,get at(){const d=GY_Y.doors[k],dy=d.y<35?1:-1;return {x:d.x,y:d.y+dy,f:d.y<35?2:0}},gy:'up',k};put(ex.x,ex.y,ch(gid))}
  // the boss door: an iron-barred gate in the wall cell, opened by the key, the levers, the dead or the seal
  {const gid=gyTile(spec.brick+'_0',WH,{fac:{img:'stairFix_2',i:0,n:1},gain:[1.3,1.15,1.4,.95][k]});KH_DOOR[gid]={gy:'bossdoor',k,x:M.door.x,y:M.door.y};put(M.door.x,M.door.y,ch(gid))}
  // ---- decor, creatures, lights ----
  const decor=[],enemies=[],items=[],lights=[],occ=new Set(),lcol={};
  const isRoomCell=(x,y,r)=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1;
  const roomOf=(x,y)=>M.rooms.find(r=>isRoomCell(x,y,r));
  const mouths=new Set();for(const r of M.rooms)for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)for(const [dx,dy] of GYM_D){const nx=x+dx,ny=y+dy;if(!isRoomCell(nx,ny,r)&&open(nx,ny)){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)mouths.add((x+a)+','+(y+b))}}
  mouths.add((sr.x0)+','+((sr.y0+sr.y1)>>1));mouths.add(M.door.ix+','+M.door.iy);mouths.add(M.door.ox+','+M.door.oy);
  occ.add(M.door.ox+','+M.door.oy);occ.add(M.door.ix+','+M.door.iy);occ.add(sr.x0+','+ex.y);   // nothing ever stands in front of a door
  const free=(x,y)=>open(x,y)&&!occ.has(x+','+y);
  const dec=(a,x,y,o)=>{o=o||{};const kk=GYA[a]?'gy_'+a:a;if(!open(x,y))return null;const d={k:kk,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}d.sc=(o.sc||1)*(/^(chest|bones|lever|lean|stone1)$/.test(a)?1:.75);if(o.npc){d.npc=o.npc;d.deco=false}if(o.i!==undefined)d.i=o.i;if(o.wd){d.wd=o.wd}if(o.txt)d.txt=o.txt;decor.push(d);occ.add(x+','+y);return d};
  const foe=(t,x,y)=>{if(!free(x,y))return false;enemies.push({t,x,y,lvl:84+k});occ.add(x+','+y);return true};
  const light=(x,y,col)=>{lights.push([x,y]);if(col)lcol[x+','+y]=col};
  const cellsOf=r=>{const o=[];for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)o.push([x,y]);return o};
  const doorCell=new Set();for(const r of M.rooms)for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)for(const [dx,dy] of GYM_D){const nx=x+dx,ny=y+dy;if(!isRoomCell(nx,ny,r)&&open(nx,ny))doorCell.add(x+','+y)}
  const safe=(r)=>{const c=cellsOf(r).filter(([x,y])=>free(x,y)&&!mouths.has(x+','+y));return c.length?c:cellsOf(r).filter(([x,y])=>free(x,y)&&!doorCell.has(x+','+y)&&!mouths.has(x+','+y+'!'))};
  const pick=(arr,n)=>{const a=arr.slice(),o=[];while(a.length&&o.length<n)o.push(a.splice((R()*a.length)|0,1)[0]);return o};
  const room=id=>M.rooms.find(r=>r.id===id);
  // the dead ends (squares with one way out), away from the start
  const deg=(x,y)=>GYM_D.filter(([dx,dy])=>open(x+dx,y+dy)).length;
  const ends=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(open(x,y)&&deg(x,y)===1&&M.dist[y*W+x]>=14&&!roomOf(x,y))ends.push([x,y]);
  const far=(a,b,d)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])>=d;
  // rooms: furnish by kind
  const FURN={
    start:r=>{light((r.x0+r.x1)>>1,(r.y0+r.y1)>>1,spec.lcol);dec('candles',r.x0+2,r.y1,{block:true,sc:.7});
      // the name of the place, on a hanging plaque on the north wall, two squares ahead and a little to the left of the arrival square, so that it is in view when the party comes down
      decor.push({k:'sign_gy',x:r.x0+2,y:r.y0,block:false,wd:[0,-1],txt:[spec.name.toUpperCase(),'Level '+(84+k)]})},
    boss:r=>{const cx=(r.x0+r.x1)>>1,cy=(r.y0+r.y1)>>1;light(cx,cy,spec.lcol);light(r.x0,r.y0,spec.lcol);light(r.x1,r.y1,spec.lcol);
      for(const [x,y] of [[r.x0,r.y0],[r.x1,r.y0],[r.x0,r.y1],[r.x1,r.y1]])if(free(x,y)&&!mouths.has(x+','+y))dec('candles',x,y,{block:true,sc:.8});
      for(let n=0;n<4;n++){const [x,y]=[r.x0+1+((hs(n,1,k+40)*(r.x1-r.x0-1))|0),r.y0+((hs(n,2,k+40)*(r.y1-r.y0+1))|0)];if(free(x,y)&&!(x===cx&&y===cy)&&!mouths.has(x+','+y))dec('bones',x,y)}},
    hall:r=>{const c=safe(r);light((r.x0+r.x1)>>1,(r.y0+r.y1)>>1,spec.lcol);for(const [x,y] of pick(c.filter(([x,y])=>x===r.x0||x===r.x1||y===r.y0||y===r.y1),3))dec(['sarc','candles','coffin','tomb'][(hs(x,y,k+50)*4)|0],x,y,{block:true,sc:.85});for(const [x,y] of pick(safe(r),2))dec('bones',x,y)},
    chapel:r=>{light((r.x0+r.x1)>>1,(r.y0+r.y1)>>1,spec.lcol);const c=safe(r);const p=pick(c,2);if(p[0])dec('altar',p[0][0],p[0][1],{block:true,sc:.8});if(p[1])dec('candles',p[1][0],p[1][1],{block:true,sc:.75})},
    ossuary:r=>{light((r.x0+r.x1)>>1,(r.y0+r.y1)>>1,spec.lcol);for(const [x,y] of pick(safe(r),2))dec('niche',x,y,{block:false,sc:.6});for(const [x,y] of pick(safe(r),3))dec('bones',x,y,{sc:1.1})},
    cell:r=>{light((r.x0+r.x1)>>1,(r.y0+r.y1)>>1,spec.lcol)},
    lever:r=>{light((r.x0+r.x1)>>1,(r.y0+r.y1)>>1,spec.lcol);for(const [x,y] of pick(safe(r),2))dec('web',x,y,{sc:.8})},
    reliquary:r=>{light((r.x0+r.x1)>>1,(r.y0+r.y1)>>1,spec.lcol);for(const [x,y] of pick(safe(r),2))dec('candles',x,y,{block:true,sc:.75})}
  };
  for(const r of M.rooms){const f=FURN[r.kind];if(f)try{f(r)}catch(e){console.error('gy furnish',r.kind,e)}}
  // ---- what the quest of this maze needs ----
  const Q={};
  const roomSpot=(r,avoid)=>{const c=safe(r);if(!c.length)return null;c.sort((a,b)=>(Math.abs(a[0]-((r.x0+r.x1)>>1))+Math.abs(a[1]-((r.y0+r.y1)>>1)))-(Math.abs(b[0]-((r.x0+r.x1)>>1))+Math.abs(b[1]-((r.y0+r.y1)>>1))));return c[0]};
  if(k===0){ // the key lies in a chest in the Warden's cell, guarded
    const r=room('cell'),p=roomSpot(r);if(p){const d=dec('chest',p[0],p[1],{block:true,npc:'gyo_keychest'});Q.key={x:p[0],y:p[1]};
      for(const [x,y] of pick(cellsOf(r).filter(([x,y])=>free(x,y)&&Math.abs(x-p[0])+Math.abs(y-p[1])>=1),2))foe(['gypike','gybmage'][(hs(x,y,k+60)*2)|0],x,y)}}
  if(k===1){ // three levers in three lever rooms (the order is the riddle on the stone in the start room)
    Q.lev=[];['lev0','lev1','lev2'].forEach((id,i)=>{const r=room(id),p=roomSpot(r);if(p){dec('lever',p[0],p[1],{block:true,npc:'gyo_lever',i});Q.lev[i]={x:p[0],y:p[1]}}});
    {const r=M.start,p=safe(r)[0];if(p){dec('stone1',p[0],p[1],{block:true,npc:'gyo_riddle'});Q.riddle={x:p[0],y:p[1]}}}}
  if(k===3){ // the trapped chest in the reliquary
    const r=room('reliquary'),p=roomSpot(r);if(p){dec('chest',p[0],p[1],{block:true,npc:'gyo_trapchest'});Q.chest={x:p[0],y:p[1]};
      for(const [x,y] of pick(cellsOf(r).filter(([x,y])=>free(x,y)),2))foe('gyrats',x,y)}}
  // a few notes lying about (the little stories of the place)
  {const spots=pick(ends.filter(e=>far(e,[M.start.x0,M.start.y0],14)),4);spots.forEach(([x,y],i)=>{if(free(x,y))dec('lean',x,y,{block:true,npc:'gyo_note',i:k*10+i})})}
  // small chests at dead ends (potions, gold, a piece of gear)
  {const cs=pick(ends.filter(e=>free(e[0],e[1])),3);for(const [x,y] of cs)dec('chest',x,y,{block:true,sc:.9})}
  // light: a lamp every few squares along the way
  {const have=lights.slice();for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!open(x,y)||M.dist[y*W+x]<0||false)continue;if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=4.2)){have.push([x,y]);light(x,y,spec.lcol)}}}
  // cobwebs and bones in corners of corridors (walk through)
  for(const [x,y] of ends){if(free(x,y)&&hs(x,y,k+70)<.35)dec(hs(x,y,k+71)<.5?'bones':'web',x,y,{sc:.8})}
  // ---- the creatures: not near the start, not in the boss room, spread out ----
  {const cells=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(free(x,y)&&M.dist[y*W+x]>=14&&!roomOf(x,y)?.id?.match(/^(boss|start)$/)&&!mouths.has(x+','+y))cells.push([x,y]);
    for(let i=cells.length-1;i>0;i--){const j=(R()*(i+1))|0;[cells[i],cells[j]]=[cells[j],cells[i]]}
    const tbl=spec.foes,tot=tbl.reduce((a,b)=>a+b[1],0),placed=[];
    for(const [t0,x0] of [[0,0]]);
    for(const gap of [7,5,4,3]){for(const [x,y] of cells){if(enemies.length>=spec.count+3)break;if(!free(x,y)||placed.some(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)<gap))continue;
        let r=R()*tot,t=tbl[0][0];for(const [tt,w] of tbl){if((r-=w)<0){t=tt;break}}placed.push([x,y]);foe(t,x,y)}
      if(enemies.length>=spec.count+3)break}}
  // the boss
  const bt=['gyvane','gygrimsby','gyaldric','gymorwenna'][k];
  {const r=M.boss,cx=(r.x0+r.x1)>>1,cy=(r.y0+r.y1)>>1;enemies.push({t:bt,x:cx,y:cy,lvl:84+k});occ.add(cx+','+cy);Q.boss={x:cx,y:cy,t:bt}}
  // ---- floors ----
  // the floor set of this maze: 0 the floor, 1 the second floor, 2 and 4 the same with puddles of standing water, 3 the dim flagstone of chapels and boss rooms
  const fb0=spec.floorGain?gyFloorTone('gyf_m'+k+'a',GY_FLOORSET[+spec.floor],spec.floorGain):GY_FLOORSET[+spec.floor],fb1=spec.floorGain?gyFloorTone('gyf_m'+k+'b',GY_FLOORSET[+spec.floor2],spec.floorGain):GY_FLOORSET[+spec.floor2],
    fw0=gyFloorWet('gyf_m'+k+'w0',fb0,spec.lcol,k*17+3),fw1=gyFloorWet('gyf_m'+k+'w1',fb1,spec.lcol,k*17+8),fSet=[fb0,fb1,fw0,gyFloorTone('gyf_cflag','gyf_flag',.46,[.88,.92,1]),fw1,fb0];
  const fm=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){let f='0';if(open(x,y)&&hs(x,y,k+80)<.16)f='1';
      if(open(x,y)){const r=roomOf(x,y);if(r&&(r.kind==='chapel'||r.kind==='boss'))f='3';else if(!r&&hs(x,y,k+90)<.2&&!mouths.has(x+','+y))f=f==='1'?'4':'2'}s+=f}fm.push(s)}
  const names=[];   // every room of a maze has its own name on the map
  for(const r of M.rooms){const nm={start:null,boss:{0:"The Vane Hall",1:"The Gravedigger's Pit",2:"The Knight's Vigil",3:"The Prioress's Chapel"}[k],cell:"The Warden's Cell",hall:'The Charnel Hall',chapel:'The Little Chapel',ossuary:'The Bone Room',lever:'The Lever Room',reliquary:'The Reliquary'}[r.kind];
    const own={lev0:'The Cross Lever Room',lev1:'The Crown Lever Room',lev2:'The Candle Lever Room',moot:'The Moot Hall',sorrow:'The Hall of Sorrow',nest:"The Rats' Nest",bonehall:'The Bone Hall'}[r.id];if(own||nm)names.push({t:own||nm,x:(r.x0+r.x1)>>1,y:(r.y0+r.y1)>>1,k:'place'})}
  // ---- the wall torches of this maze (one colour for the whole maze): at junctions, along the corridors every few squares, round the boss chamber and in the start room ----
  const torches=[];
  {const blk=new Set();for(const d of decor)if(d.block)blk.add(d.x+','+d.y);
   const skip=new Set([M.door.x+','+M.door.y,sr.x0-1+','+ex.y]);
   const cand=[];
   for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(open(x,y)||skip.has(x+','+y)||Math.hypot(x-M.door.x,y-M.door.y)<3.1)continue;   // no torch beside the boss door: the gate would glare
     for(let f=0;f<4;f++){const nx=x+GYM_D[f][0],ny=y+GYM_D[f][1];if(!open(nx,ny)||blk.has(nx+','+ny))continue;
       const d4=GYM_D.filter(([a,b])=>open(nx+a,ny+b)).length,nar=(!open(nx-1,ny)&&!open(nx+1,ny))||(!open(nx,ny-1)&&!open(nx,ny+1)),rm=roomOf(nx,ny),
         pri=rm&&rm.kind==='boss'?0:d4>=3?1:rm?2:3;
       cand.push({x,y,f,nx,ny,nar,pri,h:hs(x,y,f*7+k)})}}
   cand.sort((a,b)=>a.pri-b.pri||a.h-b.h);
   const near=(c,g)=>torches.some(t=>Math.hypot(t[0]-c.x,t[1]-c.y)<g);
   for(const c of cand){const g=c.pri===0?1.6:c.pri===1?1.7:c.pri===2?2.1:(c.nar?2.6:3);if(near(c,g))continue;torches.push([c.x,c.y,c.f,c.nar?1:0])}}
  // ---- wall niches with candles: a few alcoves cut into the corridor walls, each lit by its own little warm light and one more candle-lit pool of colour ----
  const NICHES=[];
  {const nic=NICHES,tor=torches,bossD=(x,y)=>Math.hypot(x-M.door.x,y-M.door.y)<3.2,tk=new Set(tor.map(t=>t[0]+','+t[1]));
   const NIL=gyTile(spec.brick+'_0',WH,{fac:{img:'cryptD_3',i:0,n:1},gain:.92*(spec.wall||1),tag:'niche'+k,draw:(x,w,h)=>{
     const c=IMG.gyp_cryptD_2;x.globalCompositeOperation='lighter';const g=x.createRadialGradient(64,h-62,2,64,h-62,46);g.addColorStop(0,'rgba(255,170,70,.2)');g.addColorStop(1,'rgba(255,140,40,0)');x.fillStyle=g;x.fillRect(0,h-120,w,120);x.globalCompositeOperation='source-over';
     if(c){x.drawImage(c,0,0,c.width,c.height*.5,46,h-84,36,25)}}});
   const cand=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(open(x,y)||rows[y][x]==='.'||tk.has(x+','+y)||bossD(x,y)||(x===ex.x&&Math.abs(y-ex.y)<3))continue;
     const ns=GYM_D.filter(([a,b])=>open(x+a,y+b));if(ns.length!==1)continue;const [a,b]=ns[0],nx=x+a,ny=y+b;if(roomOf(nx,ny)&&roomOf(nx,ny).kind==='boss')continue;if(M.dist[ny*W+nx]<5)continue;
     if(tor.some(t=>Math.hypot(t[0]-x,t[1]-y)<1.5))continue;cand.push({x,y,nx,ny,h:hs(x,y,k+95)})}
   cand.sort((p,q)=>p.h-q.h);
   for(const c of cand){if(nic.length>=16)break;if(nic.some(n=>Math.hypot(n.x-c.x,n.y-c.y)<4))continue;nic.push(c);put(c.x,c.y,ch(NIL));light(c.nx,c.ny,[1.15,.8,.42])}}
  const arr={x:sr.x0,y:ex.y,f:1};
  const L={rows,chars,fmap:fm,floorSet:fSet,floor:fb0,floor2:fb1,ceil:spec.ceil,ceilH:GYM.WH,start:arr,enemies,items,decor,lights,portals:[],day:0,amb:0,torchGap:1e9,noTele:true,noExtras:true,
    name:spec.name,label:spec.name,diff:84+k,mapNames:names,_gy:{kind:'maze',k,M,Q,lcol,niches:NICHES,ground:(()=>{const c=GYMP.ground[spec.floor],o={};for(const f of '012345')o[f]=c;return o})(),seed:M.seed,exit:ex,torches,torch:spec.torch}};
  try{wlTidy(L,{id:id})}catch(e){console.error('wlTidy maze',e)}   // webs flat in real corners, pictures on real walls (wenlock_polish.js)
  LEVELS[id]=L;
  gyMazeCheck(k,L);
  return L}
for(let k=0;k<4;k++)KH_LAZY[GY.M[k]]=()=>gyMazeBuild(k);
/* the self-check: from the arrival square, with the boss door shut, every square outside the boss room is reachable, and so is everything the quest needs; a blocking piece that closes something off is made walk-through */
function gyMazeCheck(k,L){
  const {M,Q}=L._gy,W=GYM.W,H=GYM.H,g=M.g,D4=GYM_D;
  const run=()=>{const bs=new Set();for(const d of L.decor)if(d.block||d.npc)bs.add(d.x+','+d.y);
    const seen=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];
    for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of D4){const nx=x+a,ny=y+b,kk=nx+','+ny;if(seen.has(kk)||nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||bs.has(kk))continue;if(isBoss(nx,ny))continue;seen.add(kk);q.push([nx,ny])}}
    const un=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y][x]==='.'&&!isBoss(x,y)&&!seen.has(x+','+y)&&!bs.has(x+','+y))un.push([x,y]);
    return {seen,bs,un}};
  const isBoss=(x,y)=>x>=M.boss.x0&&x<=M.boss.x1&&y>=M.boss.y0&&y<=M.boss.y1;
  let r=run();
  for(let guard=0;guard<40&&r.un.length;guard++){const U=new Set(r.un.map(p=>p[0]+','+p[1])),cand=L.decor.filter(d=>(d.block||d.npc)&&!(d.npc&&/^gyo_(lever|keychest|trapchest|riddle)$/.test(d.npc))&&D4.some(([a,b])=>U.has((d.x+a)+','+(d.y+b))));
    if(!cand.length)break;const d=cand[0];d.block=false;d.walk=true;d.deco=true;if(d.npc)delete d.npc;r=run()}
  // what the quest needs must be reachable (stand next to it)
  const adj=(p)=>p&&D4.some(([a,b])=>r.seen.has((p.x+a)+','+(p.y+b)));
  const need=[];if(Q.key)need.push(Q.key);if(Q.lev)for(const p of Q.lev)need.push(p);if(Q.riddle)need.push(Q.riddle);if(Q.chest)need.push(Q.chest);
  const badNeed=need.filter(p=>!adj(p));
  L._gy.unreached=r.un.length;L._gy.badNeed=badNeed.length;L._gy.doorReach=D4.some(([a,b])=>r.seen.has((M.door.x+a)+','+(M.door.y+b)));
  if(r.un.length||badNeed.length||!L._gy.doorReach)console.error('gy maze '+k+': unreached '+r.un.length+', needs cut off '+badNeed.length+', door reach '+L._gy.doorReach);
  return r.un.length+badNeed.length}
