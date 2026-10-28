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
  const k=c.k,M=c.M,cells=wmCorridor(c,WM.S(14)),tbl=WM_FOES[k],tot=tbl.reduce((a,b)=>a+b[1],0),rnd=c.rnd,placed=[];
  const near=(x,y,d)=>placed.some(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)<d);
  const sx=[M.arrive,M.back].filter(Boolean),far=(x,y)=>sx.every(s=>Math.abs(s.x-x)+Math.abs(s.y-y)>=WM.S(12));
  for(let i=cells.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[cells[i],cells[j]]=[cells[j],cells[i]]}
  for(const gap of [8,6,5,4].map(WM.S)){
    for(const [x,y] of cells){if(placed.length>=WM.COUNT[k])break;if(!c.free(x,y)||near(x,y,gap)||!far(x,y))continue;
      let r=rnd()*tot,t=tbl[0][0];for(const [tt,w] of tbl){if((r-=w)<0){t=tt;break}}
      placed.push([x,y]);c.enemy(t,x,y)}
    if(placed.length>=WM.COUNT[k])break}}
function wmFinds(c){
  const M=c.M,deg=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>c.open(x+a,y+b)).length,ends=[];
  for(let y=2;y<c.H-2;y++)for(let x=2;x<c.W-2;x++)if(c.free(x,y)&&deg(x,y)===1&&M.dist[y*c.W+x]>=WM.S(16)&&!wmInRoom(M,x,y))ends.push([x,y]);
  const kinds=['potion5','potion6','greatermana','supermana','potion5','potion6','elixir','potion6'],pick=c.pick(ends,10);
  pick.forEach(([x,y],i)=>{c.items.push({k:kinds[i%kinds.length],x,y});c.mark(x,y)})}
WM.LIGHTS=[93,86,88,92]; // the lights each floor had in the first layout
function wmLamps(c){
  let k;const M=c.M,W=c.W,have=c.lights.slice();
  for(let y=2;y<c.H-2;y++)for(let x=2;x<c.W-2;x++){if(!c.open(x,y)||M.dist[y*W+x]<0||M.dist[y*W+x]%7!==3)continue;
    if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=5)){have.push([x,y]);c.lights.push([x,y])}}
  // the floors are smaller now but keep every light they had: the rest stand at free squares, spaced as widely as they can be
  const want=WM.LIGHTS[k=c.k],cells=[];for(let y=2;y<c.H-2;y++)for(let x=2;x<W-2;x++)if(c.open(x,y)&&M.dist[y*W+x]>=0)cells.push([x,y]);
  for(let gap=4;gap>=1&&c.lights.length<want;gap--){for(let i=cells.length-1;i>0;i--){const j=(c.rnd()*(i+1))|0;[cells[i],cells[j]]=[cells[j],cells[i]]}
    for(const [x,y] of cells){if(c.lights.length>=want)break;if(c.lights.every(l=>Math.hypot(l[0]-x,l[1]-y)>=gap))c.lights.push([x,y])}}}
WM.MAN={ // what each floor held in the first (61 by 61) layout: decor by kind and creatures by kind. The new layouts are made to hold exactly these
 497:{decor:{sack2:1,wm_barrel:3,wm_bellflower:3,wm_boat:2,wm_bookshelf:2,wm_brazier:4,wm_bucket:2,wm_candelabra:4,wm_cask:5,wm_chest:9,wm_crate:3,wm_crystal_small:7,wm_gold:1,wm_ladder:2,wm_lever_up:1,wm_mine_cart:1,wm_mush_cluster:2,wm_noticeboard:2,wm_orb_pedestal:1,wm_ore_cart:1,wm_scale:1,wm_shrine:1,wm_signpost:6,wm_skeleton:1,wm_statue:2,wm_tools:3,wm_treasure_chest:3,wm_windlass:1},foes:{wmbat:10,wmbeetle:1,wmcrab:3,wmcultist:5,wmgolem:1,wmslime:15,wmspider:5}},
 498:{decor:{wm_barrel_stack:2,wm_barrel_tall:3,wm_bellflower:5,wm_bookshelf:5,wm_brazier:3,wm_candelabra:3,wm_cask:2,wm_chest:9,wm_crank:2,wm_crate:1,wm_crystal_small:9,wm_crystal_tall:1,wm_crystal_teal:4,wm_crystal_white:3,wm_geode:1,wm_gold:3,wm_lamp_post:2,wm_lever_up:1,wm_mirror:8,wm_moss_mound:4,wm_mush_cluster:1,wm_mush_tall:1,wm_mush_tree:5,wm_shrine:1,wm_signpost:8,wm_skeleton:1,wm_statue:3,wm_treasure_chest:5,wm_web:9},foes:{wmbat:4,wmbeetle:6,wmcrab:8,wmcultist:9,wmfungus:7,wmgolem:2,wmslime:6,wmspider:17,wmwraith:8}},
 499:{decor:{wm_barrel_stack:2,wm_barrel_tall:1,wm_bell:3,wm_bellflower:7,wm_bookshelf:5,wm_brazier:3,wm_candelabra:4,wm_cask:4,wm_chest:8,wm_crystal_pillar:2,wm_crystal_small:10,wm_crystal_tall:1,wm_crystal_white:2,wm_geode:2,wm_gold:1,wm_keg:2,wm_ladder:1,wm_lamp_post:1,wm_lever_up:1,wm_mine_cart:1,wm_moss_mound:2,wm_mush_bulb:1,wm_mush_tree:1,wm_noticeboard:2,wm_ore_cart:1,wm_shrine:1,wm_signpost:7,wm_skeleton:1,wm_statue:3,wm_tools:1,wm_treasure_chest:4,wm_web:2},foes:{wmbat:7,wmbeetle:9,wmcrab:1,wmcultist:11,wmfungus:7,wmgolem:6,wmslime:3,wmspider:4,wmwraith:14}},
 502:{decor:{wm_bellflower:5,wm_brazier:3,wm_candelabra:5,wm_chain:1,wm_chest:7,wm_crystal_pillar:7,wm_crystal_small:13,wm_crystal_tall:7,wm_crystal_teal:15,wm_crystal_white:4,wm_geode:3,wm_gold:1,wm_ladder:1,wm_lantern_gold:1,wm_lantern_lilac:1,wm_lantern_violet:1,wm_mine_cart:1,wm_orb_pedestal:1,wm_ore_cart:1,wm_rune:1,wm_shrine:2,wm_signpost:6,wm_skeleton:4,wm_statue:5,wm_tools:1,wm_treasure_chest:4,wm_web:2},foes:{wmbat:4,wmbeetle:8,wmcrab:9,wmcultist:6,wmfungus:5,wmgolem:17,wmslime:3,wmwarden:1,wmwraith:7}}};

/* the dressing of the rooms is drawn at random, and a smaller floor draws a little differently; this makes every floor hold exactly the decor and the creatures of WM.MAN (a surplus piece
   takes the kind of a missing one in the same class, standing or walk-through, on the same square: nothing is added or taken away) */
WM.FLAG={};
function wmEqualize(c){
  const man=WM.MAN[WM.IDS[c.k]];if(!man)return;
  const pinned=new Set();if(c.meta.wm&&c.meta.wm.mirror)pinned.add(c.meta.wm.mirror.start.x+','+c.meta.wm.mirror.start.y);
  const free=d=>!d.npc&&c.meta.tier[d.x+','+d.y]===undefined&&!pinned.has(d.x+','+d.y)&&!/chest|^wm_(ladder|lever_up|crank|chain)/.test(d.k);
  for(const d of c.dec)if(WM.FLAG[d.k]===undefined)WM.FLAG[d.k]=!!d.block;
  const have={};for(const d of c.dec)have[d.k]=(have[d.k]||0)+1;
  const need=Object.keys(man.decor).filter(k=>(have[k]||0)<man.decor[k]);
  for(const kind of need){while((have[kind]||0)<man.decor[kind]){
    const flag=WM.FLAG[kind];const cand=c.dec.filter(d=>free(d)&&(have[d.k]||0)>(man.decor[d.k]||0)&&(flag===undefined||!!d.block===flag));
    let pool=cand;if(!pool.length)pool=c.dec.filter(d=>free(d)&&(have[d.k]||0)>(man.decor[d.k]||0)&&!d.block===!flag===false);   // no piece of the same class: a walk-through piece may stand in for a standing one and the other way round
    if(!pool.length)pool=c.dec.filter(d=>free(d)&&(have[d.k]||0)>(man.decor[d.k]||0));
    if(!pool.length){ // nothing to turn into it: a new piece of a plain dressing kind goes on a free rim square of a room that has the same kind of floor furniture
      const rooms=c.M.rooms.filter(r=>!r.sealed&&['grotto','library','mine','cellar','fungus','shrine','spiders','cistern','lake','camp'].includes(r.kind));const sq=[];for(const r of rooms)for(const q of c.rim(r))sq.push(q);
      const q=sq.length&&sq[(c.rnd()*sq.length)|0];if(!q){console.warn('wm: cannot match decor '+kind+' on '+WM.IDS[c.k]);break}
      if(flag===false)c.deco(kind.slice(3),q[0],q[1],{});else c.prop(kind.slice(3),q[0],q[1],{});have[kind]=(have[kind]||0)+1;continue}
    const d=pool[pool.length-1];have[d.k]--;d.k=kind;have[kind]=(have[kind]||0)+1;delete d.sc;
    if(flag===true){d.block=true;delete d.walk;delete d.deco}else if(flag===false){d.block=false;d.walk=true;d.deco=true}}}
  for(let i=c.dec.length-1;i>=0;i--){const d=c.dec[i];if((have[d.k]||0)>(man.decor[d.k]||0)&&free(d)){have[d.k]--;c.dec.splice(i,1)}}   // a left over piece of random dressing goes (these are the extras the first layout happened not to draw)
  const hv={};for(const e of c.enemies)hv[e.t]=(hv[e.t]||0)+1;
  for(const t of Object.keys(man.foes)){while((hv[t]||0)<man.foes[t]){
    const cand=c.enemies.filter(e=>(hv[e.t]||0)>(man.foes[e.t]||0));if(!cand.length)break;
    const e=cand[cand.length-1];hv[e.t]--;e.t=t;hv[t]=(hv[t]||0)+1}}}
/* a few orb frames on every floor (an orb in an ornate iron frame that glows in the floor's own colour and can be lifted out, see orbs.js): beside the keys, at the puzzles, in the rooms and at lonely dead ends */
WM.ORBN=8;
function wmOrbs(c){
  const k=c.k,M=c.M,o=WM.ORBS[k],W=c.W,picked=[],spaced=(x,y,g)=>picked.every(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)>=g),pool=[];
  const nb=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[x+a,y+b]).filter(([qx,qy])=>c.free(qx,qy)&&!c.isMouth(qx,qy));
  const keyAt=(c.meta.wm&&c.meta.wm.keyAt)||{};
  for(const id in keyAt){const q=keyAt[id],n=nb(q.x,q.y);if(n.length)pool.push(n[0])}
    for(const kind of ['mirror','bells','lanterns','camp','shrine','cellar','library','mine','grotto','fungus','spiders','cistern','lake'])for(const r of M.rooms)if(r.kind===kind&&!r.sealed){const rim=c.rim(r);if(rim.length)pool.push(rim[(c.rnd()*rim.length)|0])}
  const ends=[];for(let y=2;y<c.H-2;y++)for(let x=2;x<c.W-2;x++)if(c.free(x,y)&&[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>c.open(x+a,y+b)).length===1&&!wmInRoom(M,x,y)&&!c.isMouth(x,y))ends.push([x,y]);
  for(let i=ends.length-1;i>0;i--){const j=(c.rnd()*(i+1))|0;[ends[i],ends[j]]=[ends[j],ends[i]]}
  for(const gap of [7,5,4,3]){for(const q of pool.concat(ends)){if(picked.length>=WM.ORBN)break;if(c.free(q[0],q[1])&&!c.isMouth(q[0],q[1])&&spaced(q[0],q[1],gap)){picked.push(q);
    const d=c.D('wm_orbframe'+k,q[0],q[1],{block:true,npc:'wm_orbframe',orbFrame:true,orbColor:o.css,emptyK:'wm_orbframeE'+k,force:true});if(d)c.light(q[0],q[1],o.col)}}
    if(picked.length>=WM.ORBN)break}
  c.meta.orbs=picked.length}
WM.build=function(k){
  const id=WM.IDS[k];if(LEVELS[id])return;wmArt();
  const M=WM.M[k],c=wmContext(k,M),wl=wmWalls(k,M);c.wl=wl;
  wmFloors(c);
  for(const r of M.rooms){const f=WM.furnish[r.kind];if(f)try{f(c,r)}catch(e){console.error('wm furnish',r.kind,e)}}
  try{WM.mech(c,wl)}catch(e){console.error('wm mech',e)}
  wmSpawn(c);wmFinds(c);wmLamps(c);wmEqualize(c);wmOrbs(c);
  const rows=wl.rows,arr=M.arrive;
  const fmr=c.fm.map(r=>r.join(''));
  const names=[];for(const r of M.rooms){if(r.sealed||!WM.ROOMNAMES[r.kind])continue;names.push({t:WM.ROOMNAMES[r.kind],x:(r.x0+r.x1)>>1,y:(r.y0+r.y1)>>1,k:'place'})}
  const L={rows,start:{x:arr.x,y:arr.y,f:arr.f},enemies:c.enemies,items:c.items,decor:c.dec,chars:wl.chars,fmap:fmr,floor:'wmflag',floor2:'wmcobble',floorSet:['wmflag','wmcobble','wmmoss','wmwater','wmflag','wmflag'],
    ceil:k===3?'wmceilx':'wmceil',ceilH:WM.WH,day:0,amb:0,torchGap:1e9,noTele:true,noExtras:true,portals:[],lights:c.lights,name:WM.NAMES[k],label:WM.NAMES[k],diff:WM.RATING[k],mapNames:names,
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
    if(!free.length&&d.npc){ // the room had no square left: any free square of a room that is reached will do (a puzzle piece must not be lost)
      for(const q of M.rooms){if(q.sealed)continue;for(let y=q.y0;y<=q.y1;y++)for(let x=q.x0;x<=q.x1;x++)if(r.reach.has(x+','+y)&&!r.blk.has(x+','+y)&&!c.isMouth(x,y)&&!c.occ.has(x+','+y)&&!D4.every(([a,b])=>U.has((x+a)+','+(y+b))))free.push([x,y])}
      free.sort((a,b)=>Math.hypot(a[0]-d.x,a[1]-d.y)-Math.hypot(b[0]-d.x,b[1]-d.y))}
    if(free.length&&(L._wm.tier[d.x+','+d.y]!==undefined||d.npc)){const f=free[0];const old=d.x+','+d.y;
      if(L._wm.tier[old]!==undefined){L._wm.tier[f[0]+','+f[1]]=L._wm.tier[old];delete L._wm.tier[old];if(L._wm.loot[old]){L._wm.loot[f[0]+','+f[1]]=L._wm.loot[old];delete L._wm.loot[old]}for(const kk in L._wm.keyAt)if(L._wm.keyAt[kk].x===d.x&&L._wm.keyAt[kk].y===d.y)L._wm.keyAt[kk]={x:f[0],y:f[1]}}
      d.x=f[0];d.y=f[1];c.occ.add(f[0]+','+f[1])}
    else{d.block=false;d.walk=true;d.deco=true;if(d.npc)delete d.npc}
    r=run()}
  L._wm.unreached=r.un.length;if(r.un.length)console.error('wm: level '+WM.IDS[k]+' has '+r.un.length+' squares the party cannot reach: '+r.un.map(p=>p.join(',')).join(' '));
  return r.un.length};
