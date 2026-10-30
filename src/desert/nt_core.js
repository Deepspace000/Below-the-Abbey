/* ==========================================================================
   THE NEVER-ENDING TOWER: THE FLOORS (prefix ntc / ntBuild...). Floor n (1, 2, 3, ...) is level id NT.BASE + n, rated 99 + n (floor 1 is level 100). Floor 0 is the entrance hall (nt_map.js).
   A floor is made from its number alone (ntLook, ntGen, a seeded random generator), the first time the party goes there, and again whenever it is needed (a saved game, a teleport): so
   nothing but flags is saved. What the party changes (chests opened, items taken, the dead, shop stock) is kept in G.lst by the game, which works because the order of everything a floor holds
   is the same every time it is built. Floors far from the party are given back (LEVELS, textures): the tower has no end, the memory has.
   Stairs: the arrival square of every floor stands in front of its stairs DOWN (a door tile in the wall); the stairs UP are at the far end of the plan.
   Files: nt_look.js (colours, looks, tiles), nt_gen.js (plans), nt_foes.js (creatures, loot, shops), nt_core.js (this), nt_map.js (entrance hall, world map, achievements, jump links).
   ========================================================================== */
const NTC={plans:new Map(),live:new Set(),keep:3,loading:null};
function ntPlan(n){
  let p=NTC.plans.get(n);if(p)return p;
  const look=ntLook(n);p={look,plan:ntGen(n,look)};NTC.plans.set(n,p);
  if(NTC.plans.size>48){const k=NTC.plans.keys().next().value;NTC.plans.delete(k)}
  return p}
/* ---------- loading the pictures: the graveyard, the witch wood, the town of Wenlock and Oldhaven's folk, Sale, the Pale Spire ---------- */
function ntLoadOwn(){return fetch('assets/nt/manifest.json?v='+VERSION).then(r=>r.json()).catch(()=>({})).then(man=>{NT.man=man||{};return Promise.all(Object.keys(NT.man).map(k=>loadImg('nt_'+k,'assets/nt/'+NT.man[k].file).then(()=>{if(NT.man[k].h)NPC_H['nt_'+k]=NT.man[k].h}).catch(()=>0)))})}
function ntLoad(){
  if(NT.loading)return NT.loading;
  NT.loading=(async()=>{
    const tryDo=async(f,nm)=>{try{await f()}catch(e){console.error('ntLoad '+nm,e)}};
    await tryDo(()=>wlLoad(),'wl');
    await tryDo(()=>gyLoad(),'gy');
    await tryDo(()=>khLoadAssets(),'kh');
    if(typeof saLoad==='function')await tryDo(()=>saLoad(),'sa');
    if(typeof pspLoadOwn==='function'&&typeof pspPics==='function')await tryDo(async()=>{await pspLoadOwn();pspPics()},'psp');
    if(typeof wwLoad==='function')await tryDo(()=>wwLoad(),'ww');
    await tryDo(()=>ntLoadOwn(),'own');
    try{gyAlias()}catch(e){}
    try{gyFlames()}catch(e){}
    NT.ready=true})();
  return NT.loading}
/* ---------- the floor ---------- */
function ntSafeBlock(a,W,H,x,y){   // can a solid thing stand on this open square without cutting the plan in two? (its open neighbours stay joined within the 3 by 3)
  const open=(i,j)=>i>=0&&j>=0&&i<W&&j<H&&a[j*W+i]===1&&!(i===x&&j===y);
  const cells=[];for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if((i||j)&&open(x+i,y+j))cells.push([i,j]);
  const nb=cells.filter(([i,j])=>Math.abs(i)+Math.abs(j)===1);if(nb.length<=1)return true;
  const seen=new Set([nb[0].join()]),q=[nb[0]];
  for(let k=0;k<q.length;k++){const [i,j]=q[k];for(const [di,dj] of NTG_D){const c=[i+di,j+dj];if(!cells.some(z=>z[0]===c[0]&&z[1]===c[1])||seen.has(c.join()))continue;seen.add(c.join());q.push(c)}}
  return nb.every(c=>seen.has(c.join()))}
/* wall torches: every wall square that has an open square beside it is a candidate; rooms first, then bends, then corridors; none nearer than 2.3 squares (3.0 in a one-wide corridor) to another */
function ntTorchSpots(open,W,H,skip,hs){
  const out=[],cand=[];
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){
    if(open(x,y)||(skip&&skip(x,y)))continue;
    for(let f=0;f<4;f++){const nx=x+NTG_D[f][0],ny=y+NTG_D[f][1];if(!open(nx,ny))continue;
      const d4=NTG_D.filter(([ax,ay])=>open(nx+ax,ny+ay)).length,nar=(!open(nx-1,ny)&&!open(nx+1,ny))||(!open(nx,ny-1)&&!open(nx,ny+1));
      cand.push({x,y,f,nar,nx,ny,pri:d4>=3?1:d4===2?2:3,h:hs(x,y,f*7)})}}
  cand.sort((p,q)=>p.pri-q.pri||p.h-q.h);
  const gapR=2.3,gapN=3.0,grid=new Map(),cell=4;   // the gap is measured between the squares the torches light, so that the two sides of a thin wall have torches of their own
  const nearT=(c,gp)=>{const gx=Math.floor(c.nx/cell),gy=Math.floor(c.ny/cell);for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const l=grid.get((gx+i)+','+(gy+j));if(l)for(const t of l)if(Math.hypot(t[0]-c.nx,t[1]-c.ny)<gp)return true}return false};
  for(const c of cand){const gp=c.nar?gapN:gapR;if(nearT(c,gp))continue;out.push([c.x,c.y,c.f,c.nar?1:0]);const k=Math.floor(c.nx/cell)+','+Math.floor(c.ny/cell);(grid.get(k)||grid.set(k,[]).get(k)).push([c.nx,c.ny])}
  return out}
function ntBuildFloor(n){
  const id=ntIdOf(n);if(LEVELS[id])return LEVELS[id];
  if(n<1)throw new Error('nt: floor '+n);
  if(!NT.ready)throw new Error('nt: pictures not loaded');
  gyAlias();
  const {look,plan}=ntPlan(n),P=look.pal,W=plan.W,H=plan.H,a=plan.G.a,R=ntRng(ntSeed(n,71)),hs=(x,y,c)=>hash2(x,y,c+(n%99991));
  const rating=ntRatingOf(n);
  NT._making=true;let T,gDown,gUp,gNic;
  try{T=ntWallTiles(n,look);gDown=ntStairTile(n,look,false);gUp=ntStairTile(n,look,true);gNic=ntNicheTile(n,look)}finally{NT._making=false}
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&a[y*W+x]===1;
  const wat=plan.water||new Set(),isWat=(x,y)=>wat.has(y*W+x);   // pond squares: closed in the plan, floor and blocker here
  const near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const PL=T.plain.map(ch),RIM=T.rim.map(ch),FAR=ch(T.far);
  const rows=[];
  for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){
    if(open(x,y)||isWat(x,y)){s+='.';continue}
    if(!near(x,y)){s+=FAR;continue}
    s+=hs(x,y,3)<.18?RIM[(hs(x,y,4)*RIM.length)|0]:PL[(hs(x,y,5)*PL.length)|0]}rows.push(s)}
  const put=(x,y,c)=>{rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
  put(plan.down.x,plan.down.y,ch(gDown));put(plan.up.x,plan.up.y,ch(gUp));
  KH_DOOR[gDown]={nt:'down'};KH_DOOR[gUp]={nt:'up'};
  const occ=new Set(),decor=[],enemies=[],items=[],lights=[],lcol={},torches=[],V={lcol,col:P.lcol,torch:{fl:P.flame,col:P.lcol,red:P.flame===1},id};
  const reserved=new Set([plan.down.ix+','+plan.down.iy,plan.up.ix+','+plan.up.iy,plan.stone.x+','+plan.stone.y]);
  for(const k of reserved)occ.add(k);
  /* the route from the arrival to the stairs up (a shortest walk): nothing stands on it, so no brazier, chest, urn or creature can block the way */
  const route=new Set();
  {let x=plan.up.ix,y=plan.up.iy,d=plan.dist[y*W+x];
   for(let g=0;g<6000;g++){route.add(x+','+y);if(!(d>0))break;let moved=false;for(const [dx,dy] of NTG_D){const nx=x+dx,ny=y+dy;if(open(nx,ny)&&plan.dist[ny*W+nx]===d-1){x=nx;y=ny;d--;moved=true;break}}if(!moved)break}}
  for(const k of route)occ.add(k);
  V.route=route;
  const free=(x,y)=>open(x,y)&&!occ.has(x+','+y);
  /* ---- ponds: dark still water, blocking (an invisible blocker on each square, as the game's lakes have), with a fishing spot on one edge; reeds and grass round it (walk-through) ---- */
  const ponds=plan.ponds||[],pondStands=[];
  for(const pd of ponds){
    for(const [x,y] of pd.cells){decor.push({k:'pstump',x,y,block:true,sc:.0001,wdh:1,fplWater:1,nt:'pond'});occ.add(x+','+y)}
    const st=pd.stand;occ.add(st.x+','+st.y);pondStands.push({x:st.x,y:st.y,dx:st.dx,dy:st.dy});
    const reeds=['reeds','hgwm_reed0','greeds'].filter(k=>IMG[k]),grass=['pgrass1','pgrass0'].filter(k=>IMG[k]);
    const rim=new Set();for(const [x,y] of pd.cells)for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const nx=x+i,ny=y+j;if(open(nx,ny)&&!isWat(nx,ny))rim.add(nx+','+ny)}
    pd.rim=[...rim].map(k=>k.split(',').map(Number));
    for(const [x,y] of pd.rim){const h=hs(x,y,131);if(x===st.x&&y===st.y)continue;if(route.has(x+','+y))continue;
      if(h<.42&&reeds.length){decor.push({k:reeds[(hs(x,y,132)*reeds.length)|0],x,y,block:false,walk:true,deco:true,sc:.8+hs(x,y,133)*.5,ox:(hs(x,y,134)-.5)*.5,oy:(hs(x,y,135)-.5)*.4})}
      else if(h<.6&&grass.length){decor.push({k:grass[(hs(x,y,136)*grass.length)|0],x,y,block:false,walk:true,deco:true,sc:.9+hs(x,y,137)*.4,ox:(hs(x,y,138)-.5)*.5,oy:(hs(x,y,139)-.5)*.4})}}}
  /* the arrival square and the stone: a clear zone round them, where nothing stands and no creature is put */
  const SAFE=7,safeFrom=[[plan.down.ix,plan.down.iy],[plan.stone.x,plan.stone.y]];
  const inSafe=(x,y)=>safeFrom.some(([sx,sy])=>Math.hypot(sx-x,sy-y)<=SAFE);
  const shop=plan.shop,inShop=(x,y)=>shop&&x>=shop.x0-1&&x<=shop.x1+1&&y>=shop.y0-1&&y<=shop.y1+1;
  const nearShopDoor=(x,y)=>shop&&Math.hypot(x-shop.door.x,y-shop.door.y)<10;
  /* ---- wall torches: lots of them, along the corridors and round the rooms ---- */
  V.torches=torches.push(...ntTorchSpots(open,W,H,(x,y)=>(x===plan.down.x&&y===plan.down.y)||(x===plan.up.x&&y===plan.up.y)||isWat(x,y),hs))&&torches;
  /* ---- candle niches: a few alcoves cut into the walls ---- */
  {const tk=new Set(torches.map(t=>t[0]+','+t[1])),cand=[];
   for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(open(x,y)||rows[y][x]==='.'||tk.has(x+','+y))continue;
     if((x===plan.down.x&&y===plan.down.y)||(x===plan.up.x&&y===plan.up.y))continue;
     const ns=NTG_D.filter(([ax,ay])=>open(x+ax,y+ay));if(ns.length!==1)continue;const [ax,ay]=ns[0];
     if(torches.some(t=>Math.hypot(t[0]-x,t[1]-y)<1.6))continue;cand.push({x,y,nx:x+ax,ny:y+ay,h:hs(x,y,95)})}
   cand.sort((p,q)=>p.h-q.h);const nic=[];
   for(const c of cand){if(nic.length>=Math.round(W*H/260))break;if(nic.some(m=>Math.hypot(m.x-c.x,m.y-c.y)<5))continue;nic.push(c);put(c.x,c.y,ch(gNic));lights.push([c.nx,c.ny]);lcol[c.nx+','+c.ny]=P.lcol}}
  /* ---- the squares: rooms, dead ends, corridors ---- */
  const cells=[],dead=[];
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!open(x,y))continue;cells.push([x,y]);
    let c=0;for(const [dx,dy] of NTG_D)if(open(x+dx,y+dy))c++;if(c===1)dead.push([x,y])}
  const d8=(x,y)=>{let c=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if((i||j)&&open(x+i,y+j))c++;return c};
  /* ---- floors ---- */
  const fm=[];for(let y=0;y<H;y++)fm.push(new Array(W).fill('0'));
  for(const r of plan.rooms){const slot=(r.big||r.centre||r.kind==='oct')&&look.floorKind!=='plain'?'3':'1';for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)if(open(x,y))fm[y][x]=slot}
  for(const c of (plan.clearings||[]))for(const [x,y] of c.cells)if(open(x,y))fm[y][x]='1';
  for(const pd of ponds){for(const [x,y] of pd.rim)fm[y][x]='2';for(const [x,y] of pd.cells)fm[y][x]='4'}
  if(shop)for(let y=shop.y0;y<=shop.y1;y++)for(let x=shop.x0;x<=shop.x1;x++)fm[y][x]='3';
  for(const [x,y] of cells)if(fm[y][x]==='0'&&hs(x,y,41)<.06)fm[y][x]='2';
  /* ---- braziers: standing fires in the rooms and at the corners of the way ---- */
  {const want=Math.max(4,Math.round(cells.length/70)),list=cells.slice();
   for(let i=list.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[list[i],list[j]]=[list[j],list[i]]}
   const placed=[];
   for(const [x,y] of list){if(placed.length>=want)break;
     if(occ.has(x+','+y)||inShop(x,y)||d8(x,y)<5||d8(x,y)>7)continue;
     let wallAdj=false;for(const [dx,dy] of NTG_D)if(!open(x+dx,y+dy))wallAdj=true;if(!wallAdj)continue;
     if(placed.some(p=>Math.hypot(p[0]-x,p[1]-y)<6))continue;
     if(Math.hypot(x-plan.down.ix,y-plan.down.iy)<3||Math.hypot(x-plan.up.ix,y-plan.up.iy)<3||Math.hypot(x-plan.stone.x,y-plan.stone.y)<2)continue;
     if(!ntSafeBlock(a,W,H,x,y))continue;
     placed.push([x,y]);occ.add(x+','+y);decor.push({k:'brazier',x,y,block:true,sc:1});lights.push([x,y]);lcol[x+','+y]=P.lcol.map(v=>v*1.1)}}
  /* ---- the shop room ---- */
  if(shop){
    const si=ntShopIndex(n),S=NT_SHOPS[si],kid=ntKeeper(si),kp=KH_KEEPERS[kid],cx=Math.floor((shop.x0+shop.x1)/2),ky=shop.y0+1;
    decor.push({k:khFaceKey(kp.face),x:cx,y:ky,block:true,npc:kid,sc:kp.sc||1});occ.add(cx+','+ky);
    for(const [dx,k] of [[-2,'wm_barrel'],[2,'sacks'],[-3,'sacks'],[3,'wm_barrel']]){const x=cx+dx;if(x>=shop.x0&&x<=shop.x1&&IMG[k]&&ntSafeBlock(a,W,H,x,ky)){decor.push({k,x,y:ky,block:true,sc:.9});occ.add(x+','+ky)}}
    for(const x of [shop.x0,shop.x1]){lights.push([x,shop.y0+1]);lcol[x+','+(shop.y0+1)]=[1.6,1.1,.6]}
    lights.push([cx,shop.y1-1]);lcol[cx+','+(shop.y1-1)]=[1.5,1.05,.6];
    V.shop={x:cx,y:ky,name:S[1],idx:si}}
  /* ---- chests, jars and a few loose things ---- */
  let chests=0;
  {const budget=Math.max(4,Math.round(cells.length/42)),cand=dead.concat(cells.filter(([x,y])=>d8(x,y)>=6&&hs(x,y,61)<.05),(plan.clearings||[]).flatMap(c=>c.cells.filter(([x,y])=>open(x,y)&&d8(x,y)>=5&&d8(x,y)<=7&&hs(x,y,64)<.12)));
   for(const [x,y] of cand){if(chests>=budget)break;
     if(!free(x,y)||inShop(x,y)||inSafe(x,y)||(Math.hypot(x-plan.up.ix,y-plan.up.iy)<3)||!ntSafeBlock(a,W,H,x,y))continue;
     if(dead.some(q=>q[0]===x&&q[1]===y)&&hs(x,y,62)>.7)continue;
     const k=NTF_CHESTS[(hs(x,y,63)*NTF_CHESTS.length)|0];if(!IMG[k]&&!IMG['gy_chest'])continue;
     occ.add(x+','+y);decor.push({k:IMG[k]?k:'gy_chest',x,y,block:true,sc:k==='gy_chest'?.8:k.startsWith('vase')?.9:1});chests++}}
  /* ---- the creatures ---- */
  const poolSel=ntfPool(n,look,NT._fams),pool=poolSel.types;
  const reachDist=plan.dist;
  const kindDen={dense:.012,semi:.010,sparse:.0075,spiral:.009,cross:.009,ring:.009,caves:.011}[look.kind];
  const grp={dense:[1,2],semi:[1,3],sparse:[2,4],spiral:[1,3],cross:[1,3],ring:[1,3],caves:[1,3]}[look.kind];
  {const total=Math.max(6,Math.round(cells.length*kindDen)),spots=cells.filter(([x,y])=>free(x,y)&&!inSafe(x,y)&&!inShop(x,y)&&!nearShopDoor(x,y)&&reachDist[y*W+x]>=8);
   for(let i=spots.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[spots[i],spots[j]]=[spots[j],spots[i]]}
   let made=0,si=0;
   while(made<total&&si<spots.length){
     const [x,y]=spots[si++];if(!free(x,y))continue;
     const size=R.int(grp[0],grp[1]);let t=pool[Math.floor(R()*pool.length)];
     for(let g=0;g<size&&made<total;g++){
       const q=g===0?[x,y]:(()=>{for(const [dx,dy] of NTG_D){const nx=x+dx*g,ny=y+dy*g;if(free(nx,ny)&&!inSafe(nx,ny))return [nx,ny]}return null})();
       if(!q)break;if(!free(q[0],q[1]))continue;
       enemies.push({t:g&&R()<.4?pool[Math.floor(R()*pool.length)]:t,x:q[0],y:q[1],lvl:rating});occ.add(q[0]+','+q[1]);made++}}}
  /* ---- the guard on the stairs up (and on every tenth floor a guardian and a great chest) ---- */
  {const ux=plan.up.ix,uy=plan.up.iy,gs=cells.filter(([x,y])=>free(x,y)&&!inSafe(x,y)&&!inShop(x,y)&&Math.hypot(x-ux,y-uy)>=2&&Math.hypot(x-ux,y-uy)<=6);
   const k=Math.min(gs.length,3+(n%3));for(let i=0;i<k;i++){const j=Math.floor(R()*gs.length),[x,y]=gs.splice(j,1)[0];if(!free(x,y))continue;enemies.push({t:pool[Math.floor(R()*pool.length)],x,y,lvl:rating});occ.add(x+','+y)}
   if(n%NT.GUARD_EVERY===0){
     let best=pool[0],bs=-1;for(const t of pool){const d=ENEMY_DEF[t],s=d.hp*(d.dmg[0]+d.dmg[1]);if(s>bs){bs=s;best=t}}
     const gid=ntfGuardian(best),gcell=cells.find(([x,y])=>free(x,y)&&!inSafe(x,y)&&Math.hypot(x-ux,y-uy)>=3&&Math.hypot(x-ux,y-uy)<=7);
     if(gcell){enemies.push({t:gid,x:gcell[0],y:gcell[1],lvl:rating});occ.add(gcell[0]+','+gcell[1])}
     const cc=cells.find(([x,y])=>free(x,y)&&Math.hypot(x-ux,y-uy)>=2&&Math.hypot(x-ux,y-uy)<=4&&ntSafeBlock(a,W,H,x,y));
     if(cc){occ.add(cc[0]+','+cc[1]);decor.push({k:IMG.gy_chest?'gy_chest':'chest',x:cc[0],y:cc[1],block:true,sc:1.1,goldAmt:Math.min(2e9,Math.round(rating*40*6*(1+R())))});chests++}}}
  /* ---- nothing may cut the plan in two: while a square cannot be reached, the solid props round it are taken away ---- */
  for(let pass=0;pass<30;pass++){
    const blk=new Set();for(const d of decor)if(d.block)blk.add(d.x+','+d.y);
    const seen=new Set([plan.down.ix+','+plan.down.iy]),q=[[plan.down.ix,plan.down.iy]];
    for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [dx,dy] of NTG_D){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(seen.has(k)||!open(nx,ny)||blk.has(k))continue;seen.add(k);q.push([nx,ny])}}
    const lost=cells.filter(([x,y])=>!seen.has(x+','+y)&&!blk.has(x+','+y));
    if(!lost.length)break;
    let victim=null,bd=1e9;
    for(const d of decor){if(!d.block||d.npc||d.fplWater)continue;for(const [x,y] of lost){const dd=Math.abs(d.x-x)+Math.abs(d.y-y);if(dd<bd){bd=dd;victim=d}}}
    if(!victim)break;decor.splice(decor.indexOf(victim),1);occ.delete(victim.x+','+victim.y);if(victim.k!=='brazier')chests--}
  /* ---- gems, potions and bones on the ground ---- */
  {const nG=Math.max(3,Math.round(cells.length/55)),spots=cells.filter(([x,y])=>free(x,y)&&!inSafe(x,y)&&!inShop(x,y));
   for(let i=spots.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[spots[i],spots[j]]=[spots[j],spots[i]]}
   let g=0;for(const [x,y] of spots){if(g>=nG)break;const u=Math.pow(R(),.55),gem=GEMS[Math.min(GEMS.length-1,Math.floor(u*GEMS.length))];items.push({k:'gem_'+gem[0],x,y});occ.add(x+','+y);g++}
   let p=0;for(let i=g;i<spots.length&&p<Math.max(2,Math.round(cells.length/180));i++){const [x,y]=spots[i];if(occ.has(x+','+y))continue;items.push({k:'potion',x,y});occ.add(x+','+y);p++}
   const dress=['gy_bones','gy_web','gy_urn'].filter(k=>IMG[k]);
   if(dress.length)for(let i=0;i<spots.length;i+=9){const [x,y]=spots[i];if(occ.has(x+','+y))continue;const k=dress[(hs(x,y,77)*dress.length)|0];
     if(k==='gy_web'){   // a web hangs on a wall face, never free in the room (the castle rule); none where the square has no wall beside it
       const wd=NTG_D.find(([dx,dy])=>!open(x+dx,y+dy)&&!isWat(x+dx,y+dy)&&rows[y+dy][x+dx]!==chMap.get(gNic)&&!((x+dx===plan.down.x&&y+dy===plan.down.y)||(x+dx===plan.up.x&&y+dy===plan.up.y)));
       if(wd)decor.push({k,x,y,pic:1,wd:[wd[0],wd[1]],block:false,walk:true,deco:true,sc:.7,bob:.9});continue}
     decor.push({k,x,y,block:false,walk:true,deco:true,sc:.7})}}
  const fmS=fm.map(r=>r.join(''));
  const fSet=ntFloorSet(n,look),ceil=ntCeil(n,look);
  const L={rows,chars,fmap:fmS,floorSet:fSet,floor:fSet[0],floor2:fSet[1],ceil,ceilH:look.wh,start:{x:plan.down.ix,y:plan.down.iy,f:plan.down.f},enemies,items,decor,lights,portals:[],day:0,amb:look.amb,torchGap:1e9,
    noExtras:true,tele:{x:plan.stone.x,y:plan.stone.y},name:look.name,label:look.name,teleName:look.name,diff:rating,mapNames:[],_nt:V,_gems:1};
  V.look=look;V.plan=plan;V.pool=poolSel;V.chests=chests;V.rating=rating;
  V.ponds=ponds.length;V.fishing=pondStands;
  LEVELS[id]=L;LEVEL_RATING[id]=rating;NTC.live.add(n);
  if(typeof fshAddSpots==='function'){if(FSH_ADD[id])delete FSH_ADD[id];if(pondStands.length)fshAddSpots(id,pondStands,{water:'deep'})}   // dark still water: the 'deep' catch table (eel, crayfish, catfish, ray, angler, leaf dragon, ...)
  return L}
/* a floor far from the party is given back */
function ntEvict(cur){
  for(const f of [...NTC.live]){if(Math.abs(f-cur)<=NTC.keep)continue;const id=ntIdOf(f);if(LEVEL===id)continue;
    delete LEVELS[id];ntRelease(f);NTC.live.delete(f);try{delete FSH_ADD[id];delete FSHV.cache[id]}catch(e){}}}
/* ---------- going in, going up and down ---------- */
{const _g=goToLevel;goToLevel=function(n,entry){
  if(ntIs(n)){
    if(!NT.ready&&!NT._wait){NT._wait=1;try{msg('The tower stairs lead on...','#c8d0e8')}catch(e){}ntLoad().then(()=>{NT._wait=0;goToLevel(n,entry)});return}
    if(!LEVELS[n]){try{ntEnsure(n)}catch(e){console.error('nt build',n,e)}}}
  const dead=ntIs(n)&&G.lst&&G.lst[n]&&G.lst[n].dead?new Set(G.lst[n].dead):null;
  const r=_g.call(this,n,entry);
  try{if(ntIs(n)){
    if(dead&&G.enemies)G.enemies=G.enemies.filter(e=>!(e.id<ENEMY_SPAWNS.length&&dead.has(e.id)));   // the fallen stay down
    ntArrive(n)}}catch(e){console.error('ntArrive',e)}
  return r}}
function ntEnsure(n){const f=ntFloorOf(n);if(LEVELS[n])return LEVELS[n];if(f===0&&typeof ntBuildEntrance==='function')return ntBuildEntrance();return ntBuildFloor(f)}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(ntIs(n)&&!NT.ready&&!NT._wait){NT._wait=1;ntLoad().then(()=>{NT._wait=0;jumpToLevel(n,target)});return}
  if(ntIs(n)&&!LEVELS[n])ntEnsure(n);
  return _j.apply(this,arguments)}}
{const _r=restore;restore=function(sv){
  if(sv&&ntIs(sv.level)){
    if(!NT.ready&&!NT._wait){NT._wait=1;ntLoad().then(()=>{NT._wait=0;restore(sv)});return}
    if(!LEVELS[sv.level])ntEnsure(sv.level);
    if(typeof LEVELS[44]!=='undefined'&&LEVELS[44]&&LEVELS[44].stub){return restoreNow(sv)}   // the tower does not need the golden city
  }
  return _r.apply(this,arguments)}}
{const _rn=restoreNow;restoreNow=function(sv){const r=_rn.apply(this,arguments);try{if(ntIs(LEVEL))ntArrive(LEVEL,true)}catch(e){console.error('nt restore',e)}return r}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||ntIs(n)}}
/* a teleport to a floor that is not built (after a reload, or far away): built first */
{const _tp=teleportTo;teleportTo=function(n){
  if(ntIs(n)){
    if(!NT.ready){if(!NT._wait){NT._wait=1;ntLoad().then(()=>{NT._wait=0;teleportTo(n)})}return}
    if(!LEVELS[n])try{ntEnsure(n)}catch(e){console.error(e);return}}
  return _tp.apply(this,arguments)}}
function ntStairGo(dir){
  const f=ntFloorOf(LEVEL),t=f+dir;if(t<0)return;
  if(t===0){sfx('door');const at=NT.ENT&&NT.ENT.back?NT.ENT.back:{x:18,y:4,f:2};goToLevel(NT.BASE,at);return}
  const {plan}=ntPlan(t),s=dir>0?plan.down:plan.up;
  sfx('door');goToLevel(ntIdOf(t),{x:s.ix,y:s.iy,f:s.f})}
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.nt==='up'){ntStairGo(1);return true}
  if(d&&d.nt==='down'){ntStairGo(-1);return true}
  return _k.apply(this,arguments)}}
/* ---------- the look in the game: no weather inside, torches of the floor's flame, lamps of its colour ---------- */
{const _w=weatherNow;weatherNow=function(){if(ntIs(LEVEL))return null;return _w.apply(this,arguments)}}
{const _sl=setupLights;setupLights=function(){
  const r=_sl.apply(this,arguments);
  try{if(ntIs(LEVEL)){const L=LEVELS[LEVEL],V=L&&L._nt;if(V){
      for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=V.lcol[key]||V.col;l.kI=1.7;l.range2=150;l.calm=true}
      if(V.torches&&V.torch){gyFlames();const T=V.torch;
        for(const [x,y,f,nar] of V.torches){const d=NTG_D[f],O=nar?.035:TORCH_OUT;
          LIGHTS.push({x:x+.5+d[0]*(.5+O),y:y+.5+d[1]*(.5+O),ph:hash2(x,y,5)*6.28,key:(y*MW+x)*4+f,taken:false,red:!!T.red,fl:T.fl,col:T.col,o:O,nar:!!nar,range2:180,kI:1.6})}}}}}catch(e){console.error('nt lights',e)}
  return r}}
/* ---------- sound: the vault's drips, creaks and moans, and a different voice for each kind of plan ---------- */
const NTS={n:{}};
function ntsTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!ntIs(LEVEL)||!SNDOPT.amb||typeof vtsDrip!=='function')return;
  const now=AC.currentTime,V=LEVELS[LEVEL]&&LEVELS[LEVEL]._nt,kind=V&&V.look?V.look.kind:'dense',N=NTS.n;
  const due=(k,lo,hi)=>{if(N[k]===undefined||N[k]-now>hi+5){N[k]=now+Math.random()*hi;return false}if(now<=N[k])return false;N[k]=now+lo+Math.random()*(hi-lo);return true};
  if(due('drip',3,9))vtsDrip(.4+Math.random()*.4);
  if(due('creak',14,34))vtsCreak(.45);
  if(due('moan',26,60))vtsMoan(.4);
  const per={dense:['chn','stp'],semi:['page','hush'],sparse:['stn','stp'],spiral:['bell','hush'],cross:['gust','stn'],ring:['hush','bell'],caves:['drip2','moan2']}[kind]||[];
  for(const p of per){
    if(p==='chn'&&due('chn',12,30))vtsChain(.6);else if(p==='stp'&&due('stp',16,36))vtsSteps(.5);else if(p==='page'&&due('page',14,34))vtsPage(.6);
    else if(p==='hush'&&due('hush',16,36))vtsHush(.7);else if(p==='stn'&&due('stn',20,44))vtsStone(.6);else if(p==='bell'&&due('bell',22,40))vtsBell(.3);
    else if(p==='gust'&&due('gust',14,32))vtsGust(.5);else if(p==='drip2'&&due('drip2',2,5))vtsDrip(.7);else if(p==='moan2'&&due('moan2',18,40))vtsMoan(.5)}}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{ntsTick()}catch(e){console.error('nts',e)}}}
/* the floors have no names in the list of places (there are endless floors): the parchment map is drawn by nt_map.js */
