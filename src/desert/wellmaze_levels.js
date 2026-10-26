/* ==========================================================================
   THE WELL MAZE: putting a level together (prefix wm / WM). WM.build(k) is registered as the lazy builder of each level id.
   ========================================================================== */
WM.furnish={};WM.mech=function(){};
function wmInRoom(M,x,y){return M.rooms.some(r=>x>=r.x0-0&&x<=r.x1&&y>=r.y0&&y<=r.y1)}
function wmFloors(c){
  const M=c.M,W=c.W,H=c.H,fm=[];for(let y=0;y<H;y++)fm.push(new Array(W).fill('0'));
  // corridors: a drift of cobble and moss
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(c.g[y][x]!=='.')continue;const n=wmNoise(x,y,909+c.k*17);fm[y][x]=n<.22?'2':n<.5?'1':'0'}
  const fill=(r,ch,f)=>{for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)if(!f||f(x,y,r))fm[y][x]=ch};
  for(const r of M.rooms){const k=r.kind;
    if(k==='cistern')fill(r,'3',(x,y,r)=>x>r.x0&&x<r.x1&&y>r.y0&&y<r.y1);
    else if(k==='lake')fill(r,'3',(x,y,r)=>x>r.x0+1&&x<r.x1-1&&y>r.y0&&y<r.y1-1);
    else if(k==='cellar'||k==='mine'||k==='camp')fill(r,'1');
    else if(k==='fungus'||k==='spiders')fill(r,'2');
    else if(k==='library'||k==='shrine'||k==='vault'||k==='boss'||k==='lanterns'||k==='bells'||k==='mirror'||k==='start'||k==='stairOut')fill(r,'0');
    else if(k==='grotto'||k==='island')fill(r,'0')}
  c.fm=fm}
/* squares of corridor (not in any room) far enough from the start and the stairs */
function wmCorridor(c,minDist){
  const M=c.M,out=[];
  for(let y=2;y<c.H-2;y++)for(let x=2;x<c.W-2;x++){if(!c.free(x,y)||M.dist[y*c.W+x]<minDist||wmInRoom(M,x,y))continue;out.push([x,y])}
  return out}
function wmSpawn(c){
  const k=c.k,M=c.M,cells=wmCorridor(c,14),tbl=WM_FOES[k],tot=tbl.reduce((a,b)=>a+b[1],0),rnd=c.rnd,placed=[];
  const near=(x,y,d)=>placed.some(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)<d);
  const sx=[M.arrive,M.back].filter(Boolean),far=(x,y)=>sx.every(s=>Math.abs(s.x-x)+Math.abs(s.y-y)>=12);
  for(let i=cells.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[cells[i],cells[j]]=[cells[j],cells[i]]}
  for(const gap of [8,6,5,4]){
    for(const [x,y] of cells){if(placed.length>=WM.COUNT[k])break;if(!c.free(x,y)||near(x,y,gap)||!far(x,y))continue;
      let r=rnd()*tot,t=tbl[0][0];for(const [tt,w] of tbl){if((r-=w)<0){t=tt;break}}
      placed.push([x,y]);c.enemy(t,x,y)}
    if(placed.length>=WM.COUNT[k])break}}
function wmFinds(c){
  const M=c.M,deg=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>c.open(x+a,y+b)).length,ends=[];
  for(let y=2;y<c.H-2;y++)for(let x=2;x<c.W-2;x++)if(c.free(x,y)&&deg(x,y)===1&&M.dist[y*c.W+x]>=16&&!wmInRoom(M,x,y))ends.push([x,y]);
  const kinds=['potion5','potion6','greatermana','supermana','potion5','potion6','elixir','potion6'],pick=c.pick(ends,10);
  pick.forEach(([x,y],i)=>{c.items.push({k:kinds[i%kinds.length],x,y});c.mark(x,y)})}
function wmLamps(c){
  const M=c.M,W=c.W,have=c.lights.slice();
  for(let y=2;y<c.H-2;y++)for(let x=2;x<c.W-2;x++){if(!c.open(x,y)||M.dist[y*W+x]<0||M.dist[y*W+x]%7!==3)continue;
    if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=5)){have.push([x,y]);c.lights.push([x,y])}}}
WM.build=function(k){
  const id=WM.IDS[k];if(LEVELS[id])return;wmArt();
  const M=WM.M[k],c=wmContext(k,M),wl=wmWalls(k,M);c.wl=wl;
  wmFloors(c);
  for(const r of M.rooms){const f=WM.furnish[r.kind];if(f)try{f(c,r)}catch(e){console.error('wm furnish',r.kind,e)}}
  try{WM.mech(c,wl)}catch(e){console.error('wm mech',e)}
  wmSpawn(c);wmFinds(c);wmLamps(c);
  const rows=wl.rows,arr=M.arrive;
  const fmr=c.fm.map(r=>r.join(''));
  const names=[];for(const r of M.rooms){if(r.sealed||!WM.ROOMNAMES[r.kind])continue;names.push({t:WM.ROOMNAMES[r.kind],x:(r.x0+r.x1)>>1,y:(r.y0+r.y1)>>1,k:'place'})}
  const L={rows,start:{x:arr.x,y:arr.y,f:arr.f},enemies:c.enemies,items:c.items,decor:c.dec,chars:wl.chars,fmap:fmr,floor:'wmflag',floor2:'wmcobble',floorSet:['wmflag','wmcobble','wmmoss','wmwater','wmflag','wmflag'],
    ceil:k===3?'wmceilx':'wmceil',ceilH:WM.WH,day:0,amb:0,torchGap:1e9,noTele:true,noExtras:true,portals:[],lights:c.lights,name:WM.NAMES[k],label:WM.NAMES[k],diff:WM.DIFF,mapNames:names,
    _wm:Object.assign({k,M,seed:M.seedUsed,tier:c.meta.tier,loot:c.meta.loot,notes:c.meta.notes,lcol:c.meta.lcol||{},doors:{},switches:[],pits:{}},c.meta.wm||{})};
  LEVELS[id]=L;WM.checks(k,c)};
WM.ROOMNAMES={shaft:'The Well Shaft',start:null,camp:"The Diggers' Camp",cistern:'The Flooded Cistern',cellar:'The Wine Cellar',shrine:'The Forgotten Shrine',mine:'The Collapsed Mine',grotto:'The Crystal Grotto',library:'The Dripping Library',
  mirror:'The Hall of Mirrors',spiders:'The Silk Hall',fungus:'The Fungus Forest',bells:'The Bell Hall',lanterns:'The Hall of Lanterns',boss:"The Warden's Court",lake:'The Amethyst Lake',stairOut:null};
for(let k=0;k<4;k++)KH_LAZY[WM.IDS[k]]=()=>WM.build(k);
/* a level is checked for itself when it is built: every square reachable, every key and vault door reachable, nothing walled in by its own furniture */
WM.checks=function(k,c){
  const L=LEVELS[WM.IDS[k]],W=c.W,H=c.H,M=c.M,D4=[[1,0],[-1,0],[0,1],[0,-1]];
  const doorOpen=new Set(Object.entries(L._wm.doors).filter(([,d])=>d.type!=='up'&&d.type!=='down').map(([kk])=>kk));
  const island=M.rooms.find(r=>r.kind==='island'),inIsl=(x,y)=>island&&x>=island.x0&&x<=island.x1&&y>=island.y0&&y<=island.y1;
  const run=()=>{const blk=new Set();for(const d of c.dec)if(d.block||d.npc)blk.add(d.x+','+d.y);
    const reach=new Set([M.arrive.x+','+M.arrive.y]),q=[[M.arrive.x,M.arrive.y]];
    for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of D4){const nx=x+a,ny=y+b,kk=nx+','+ny;if(reach.has(kk)||nx<0||ny<0||nx>=W||ny>=H)continue;
      if(!(c.g[ny][nx]==='.'||doorOpen.has(kk)))continue;if(blk.has(kk))continue;reach.add(kk);q.push([nx,ny])}}
    const un=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(c.g[y][x]==='.'&&!blk.has(x+','+y)&&!reach.has(x+','+y)&&!inIsl(x,y))un.push([x,y]);
    return {reach,blk,un}};
  let r=run();
  for(let guard=0;guard<30&&r.un.length;guard++){
    // a piece standing next to a walled-in square is moved to a reached free square of the same room, or else made walk-through
    const U=new Set(r.un.map(p=>p[0]+','+p[1])),cand=c.dec.filter(d=>(d.block||d.npc)&&!(d.npc&&/^wm(sw_|bell_|lamp_|row|_ladder|_scale|_prize)/.test(d.npc))&&D4.some(([a,b])=>U.has((d.x+a)+','+(d.y+b))));
    if(!cand.length)break;const d=cand[0];
    const room=M.rooms.find(q=>d.x>=q.x0&&d.x<=q.x1&&d.y>=q.y0&&d.y<=q.y1),free=[];
    if(room)for(let y=room.y0;y<=room.y1;y++)for(let x=room.x0;x<=room.x1;x++)if(r.reach.has(x+','+y)&&!r.blk.has(x+','+y)&&!c.isMouth(x,y)&&!c.occ.has(x+','+y)&&!D4.every(([a,b])=>U.has((x+a)+','+(y+b))))free.push([x,y]);
    if(free.length&&(L._wm.tier[d.x+','+d.y]!==undefined||d.npc)){const f=free[0];const old=d.x+','+d.y;
      if(L._wm.tier[old]!==undefined){L._wm.tier[f[0]+','+f[1]]=L._wm.tier[old];delete L._wm.tier[old];if(L._wm.loot[old]){L._wm.loot[f[0]+','+f[1]]=L._wm.loot[old];delete L._wm.loot[old]}for(const kk in L._wm.keyAt)if(L._wm.keyAt[kk].x===d.x&&L._wm.keyAt[kk].y===d.y)L._wm.keyAt[kk]={x:f[0],y:f[1]}}
      d.x=f[0];d.y=f[1];c.occ.add(f[0]+','+f[1])}
    else{d.block=false;d.walk=true;d.deco=true;if(d.npc)delete d.npc}
    r=run()}
  L._wm.unreached=r.un.length;if(r.un.length)console.error('wm: level '+WM.IDS[k]+' has '+r.un.length+' squares the party cannot reach: '+r.un.map(p=>p.join(',')).join(' '));
  return r.un.length};
