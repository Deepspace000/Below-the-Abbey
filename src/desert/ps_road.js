/* ==========================================================================
   THE PALE SPIRE: THE CROOKED ROAD (prefix pcr / PCR). Level 9715, outdoor, 48 x 64, rating 100.
   The way from the Pale Spire to the Never-Ending Tower. From the east postern of the Court of Statues (9730, square 60,30) a five-wide road
   winds north in switchbacks, through a bone field, past a rest shrine, a glade of crosses and a glade of leaning lamps, to the forecourt of the
   Crooked Tower, where the gate (30,4) opens on the tower's entrance hall (NT.BASE, arrive at NT.ENT.arrive). The tower's south gate (nt_map.js) leads back here.
   Contract: the links are in ps_ids.js (9730 <-> 9715, 9715 -> NT.BASE with ext:1). A party under level 100 is turned back at the tower gate (ntLevelOk in nt_map.js).
   Look: dark gothic. Black stone walls, dead gnarled trees, overcast sky, bones, iron fences, leaning lamps, a rest shrine. No houses, no village props, no animals.
   Rules kept: the middle three squares of the road stay empty (nothing stands on the route); solid props stand only five squares or more off the route centre line
   (trees, stones) or on the edge row (fence and lamp pictures, which can be walked through); the few creatures stand in the glades, at least three squares off the route.
   ========================================================================== */
const PCR_GOLD=[1.7,1.15,.55];
const PCR={ID:9715,W:48,H:64,
  /* the centre line of the road, from the postern (south east) to the tower gate (north) */
  ROUTE:[[40,60],[40,52],[10,52],[10,42],[38,42],[38,32],[12,32],[12,22],[30,22],[30,6]],
  /* glades: [x0,y0,x1,y1,floor,name] */
  GLADES:[[22,48,34,56,'gravel','The Bone Field'],[3,38,15,46,'flagdark','The Wayside Shrine'],[30,28,44,36,'gravel','The Glade of Crosses'],[4,18,18,26,'gravel','The Leaning Lamps'],[22,6,38,14,'flagdark','The Tower Forecourt']]};
function pcrBuild(info){
  const W=PCR.W,H=PCR.H;
  const C=pspMake({id:9715,start:{x:40,y:59,f:0},walled:true,wall:'dark',wh:3.4,floor:'cobble',amb:.95,wind:.3});
  const {rows,block}=C,hs=C.hs,PAL=PSP_PAL,SI=PAL.silver,GR=PAL.green,ix=(x,y)=>y*W+x;
  const open=(x,y)=>rows[y]&&rows[y][x]==='.';
  /* ---- the road: five wide, along the centre line ---- */
  const R=PCR.ROUTE,cl=[];
  for(let i=0;i<R.length-1;i++){const [ax,ay]=R[i],[bx,by]=R[i+1];
    if(ax===bx){for(let y=Math.min(ay,by);y<=Math.max(ay,by);y++)cl.push([ax,y])}else{for(let x=Math.min(ax,bx);x<=Math.max(ax,bx);x++)cl.push([x,ay])}}
  for(const [x,y] of cl){C.carve(x-2,y-2,x+2,y+2);C.setFloor(x-2,y-2,x+2,y+2,'cobble')}
  for(const g of PCR.GLADES){C.carve(g[0],g[1],g[2],g[3]);C.setFloor(g[0],g[1],g[2],g[3],g[4])}
  /* the line of the road itself in dressed flags, one square wide, so that the way reads from far off */
  for(const [x,y] of cl)C.setFloorCell(x,y,'flagdark');
  /* distance from the centre line (Chebyshev), for every open square */
  const dist=new Float32Array(W*H).fill(99);
  for(const [cx,cy] of cl)for(let y=Math.max(0,cy-6);y<=Math.min(H-1,cy+6);y++)for(let x=Math.max(0,cx-6);x<=Math.min(W-1,cx+6);x++){const d=Math.max(Math.abs(x-cx),Math.abs(y-cy));if(d<dist[ix(x,y)])dist[ix(x,y)]=d}
  const D=(x,y)=>dist[ix(x,y)];
  /* the postern and the tower gate are set INTO a wall: the squares beside and behind them are wall (the road's five-wide carve had left each door standing free in open floor) */
  for(let y=61;y<=62;y++)for(let x=36;x<=44;x++)C.solid(x,y,C.ch(pspWallGid('dark',(hs(x,y,4)*4)|0,3.4)));
  for(let x=26;x<=34;x++)C.solid(x,4,C.ch(pspWallGid(x===30?'pier':'dark',(hs(x,4,4)*4)|0,3.4)));
  /* ---- the walls: black stone, moss, a little ivy ---- */
  const near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const SET=['dark','dark','ash','dark','moss','ash','dun','ivy','dark','ash'];
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(open(x,y)||!near(x,y))continue;C.solid(x,y,C.ch(pspWallGid(SET[(hs(x,y,3)*SET.length)|0],(hs(x,y,4)*4)|0,3.4)))}
  /* ---- the doors: the postern (south), the tower gate (north) ---- */
  C.links({style:{'Postern':'gate','Tower':'great'}});
  /* ---- dressing ---- */
  const FENCE=['iron_fence_a','iron_fence_b'];
  const lamp=(x,y,col)=>{if(!C.free(x,y))return;C.dec('gy_lantern',x,y,{block:false,sc:1.05});C.light(x,y,col||SI)};
  const edge=(x,y)=>open(x,y)&&D(x,y)===2;                // the outer row of the road
  const far=(x,y,d)=>open(x,y)&&D(x,y)>=(d||5)&&C.free(x,y);   // well off the route: solid props only here
  const tree=(x,y,sc)=>{if(far(x,y,3))C.dec('gy_dead',x,y,{block:true,sc:sc||1.5+hs(x,y,7)*.7})};
  /* the iron fence along the outer row, with gaps, and a leaning lamp every few squares (walk-through pictures) */
  for(const [cx,cy] of cl){
    for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2]]){const x=cx+dx,y=cy+dy;
      if(!edge(x,y)||C.decor.some(d=>d.x===x&&d.y===y))continue;
      const r=hs(x,y,21);
      if(r<.4)C.prop(FENCE[(x+y)&1],x,y,{block:false,maxW:1.02});
      else if(r<.43)C.dec('gy_dead',x,y,{block:false,sc:.8+hs(x,y,22)*.3});          // a bare twig tree you can brush past
      else if(r<.5)C.dec('gy_bones',x,y,{block:false,sc:.7});
      else if(r<.6)C.prop('moss_rock',x,y,{block:false})}}
  cl.forEach(([x,y],i)=>{if(i%11===5){for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2]])if(edge(x+dx,y+dy)){lamp(x+dx,y+dy,i%22===5?SI:GR);break}}});
  /* the glades: dead trees, stones, bones */
  for(const g of PCR.GLADES){
    const [x0,y0,x1,y1]=g;
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(!open(x,y)||!C.free(x,y))continue;const r=hs(x,y,31),d=D(x,y);
      if(d>=3){
        if(r<.05)tree(x,y);
        else if(r<.13)C.dec('gy_bones',x,y,{block:false,sc:.8});
        else if(r<.155&&g[5]!=='The Tower Forecourt')C.dec(['gy_stone1','gy_stone2','gy_ccross','gy_wcross'][(hs(x,y,32)*4)|0],x,y,{block:true,sc:.95})}}}
  /* the Bone Field: skulls on posts and heaps of bones */
  for(const [x,y] of [[24,50],[27,54],[31,50],[33,54],[23,55],[30,55]])if(far(x,y,3))C.prop('skull_pillar',x,y,{block:true});
  for(let k=0;k<12;k++){const x=22+((hs(k,1,51)*13)|0),y=48+((hs(k,2,51)*9)|0);if(open(x,y)&&C.free(x,y))C.dec('gy_bones',x,y,{block:false,sc:.6+hs(k,3,51)*.5})}
  /* the Glade of Crosses: rows of crosses and a great old tree */
  for(let x=33;x<=43;x+=2)for(const y of [29,35])if(far(x,y,3))C.dec(['gy_ccross','gy_wcross','gy_stone1'][(x>>1)%3],x,y,{block:true,sc:1});
  tree(42,29,2.3);tree(31,35,2.1);
  /* the Leaning Lamps: lamps that lean over the road, a ring of them */
  for(const [x,y] of [[5,19],[8,19],[11,19],[15,19],[5,25],[8,25],[15,25],[17,22],[5,22]])if(open(x,y))lamp(x,y,hs(x,y,9)<.5?SI:[.8,1.2,.6]);
  /* the Wayside Shrine: a safe place with a bench, a warm lantern, a free rest */
  {const x0=5,y=41,id='pcr_bench';
    C.safe.push({rect:1,x0,y0:y,x1:x0+2,y1:y+1});
    C.rests.push({x0,y0:y,x1:x0+2,y1:y+1,line:'A wayside shrine. A bench, a warm lantern, a loaf and a cup. Nothing hostile comes near.',name:'The Wayside Shrine'});
    C.light(x0+1,y,C.warmCol);
    if(!NPCS[id])khNpc(id,'A pilgrim bench','gy_bench',()=>say('A stone bench under a small shrine of the Pale Mother, with a lantern that does not flicker. The road behind you is long, and the one ahead is longer.',[['Rest a while.',()=>{try{restParty(true)}catch(e){}return null}],['Leave.',()=>null]]));
    C.dec('gy_bench',x0+1,y+1,{block:true,npc:id,sc:1.1});C.dec(pspPic('lantern_red_a'),x0,y,{block:false});C.dec(pspPic('statue_plinth'),x0+2,y,{block:true})}
  for(const [x,y] of [[5,39],[9,39],[13,39],[4,45],[14,45]])if(far(x,y,3))C.dec(pspPic('urn_big'),x,y,{block:true,sc:.9});
  /* the tower forecourt: two lamps, two urns, a sign, the gate framed by an arch */
  C.prop('arch_iron',30,5,{block:false});
  for(const x of [26,34]){lamp(x,8,PCR_GOLD)}C.light(30,5,PCR_GOLD);C.light(29,7,PCR_GOLD);C.light(31,7,PCR_GOLD);
  for(const x of [24,36])C.prop('urn_big',x,7,{block:true});
  for(const x of [23,37])C.prop('pillar_lantern',x,10,{block:true,sc:.8});
  C.sign(28,5,[0,-1],'THE CROOKED TOWER','North of the Pale Spire. Level 100 and up');C.sign(32,5,[0,-1],'LEVEL 100 AND UP','The gate turns back the unready');
  C.vines(26,5,{});C.vines(34,5,{});
  /* the postern end */
  C.sign(38,60,[0,1],'THE EAST POSTERN','Back to the Court of Statues');C.sign(42,60,[0,1],'THE CROOKED ROAD','North to the Crooked Tower');lamp(38,58,PCR_GOLD);lamp(42,58,PCR_GOLD);
  /* a few chests in the glades */
  for(const [x,y,t] of [[24,54,1],[41,34,1],[6,20,1]])if(far(x,y,3))C.chest(x,y,{tier:t});
  /* ---- creatures: few, in the glades, at least three squares off the route ---- */
  const spot=(x0,y0,x1,y1,seed)=>{for(let k=0;k<80;k++){const x=x0+((hs(k,seed,61)*(x1-x0+1))|0),y=y0+((hs(k,seed,62)*(y1-y0+1))|0);if(open(x,y)&&D(x,y)>=3&&C.free(x,y)&&!C.safe.some(z=>pspInZone(z,x,y,2)))return [x,y]}return null};
  const FOE=(t,g,seed,wake)=>{const q=spot(g[0],g[1],g[2],g[3],seed);if(q)(wake?pspStatueWake:pspFoe)(C,t,q[0],q[1])};
  const G=PCR.GLADES;
  FOE('psguard',G[0],1);FOE('pshalberd',G[0],2);FOE('pssentinel',G[0],3,1);
  FOE('psmourner',G[2],4);FOE('pssentinel',G[2],5,1);FOE('psguard',G[2],6);
  FOE('psmourner',G[3],7);FOE('psguard',G[3],8);
  FOE('pssentinel',G[4],9,1);FOE('pssentinel',G[4],10,1);
  for(const e of C.enemies)e.lvl=100;
  C.glow(7,SI);
  psgNoLooseArch(C);
  const lv=C.finish({start:{x:40,y:59,f:0}});
  lv.mapNames=[{t:'The East Postern',x:40,y:58,k:'place'},{t:'The Bone Field',x:28,y:52,k:'place'},{t:'The Wayside Shrine',x:7,y:42,k:'place'},{t:'The Glade of Crosses',x:37,y:32,k:'place'},{t:'The Leaning Lamps',x:10,y:22,k:'place'},{t:'The Tower Forecourt',x:30,y:10,k:'place'}];
  return lv}
pspRegister(9715,pcrBuild);
/* the tower gate turns back a party below level 100 (ntLevelOk, nt_map.js) */
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psp&&d.psp.to===1000000000&&typeof ntLevelOk==='function'&&!ntLevelOk()){ntTooLow();return true}
  return _k.apply(this,arguments)}}
