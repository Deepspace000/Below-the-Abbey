/* ==========================================================================
   THE PALE SPIRE: THE CROOKED ROAD (prefix pcr / PCR). Level 9715, outdoor, 48 x 64, rating 100.
   The way from the Pale Spire to the Never-Ending Tower. From the east postern of the Court of Statues (9730, square 60,30) a five-wide road
   winds north in switchbacks, through a bone field, past a rest shrine, a glade of crosses and a glade of leaning lamps, to the forecourt of the
   Crooked Tower, where the gate (30,4) opens on the tower's entrance hall (NT.BASE, arrive at NT.ENT.arrive). The tower's south gate (nt_map.js) leads back here.
   Contract: the links are in ps_ids.js (9730 <-> 9715, 9715 -> NT.BASE with ext:1). A party under level 100 is turned back at the tower gate (ntLevelOk in nt_map.js).
   Look (rebuilt 30 Oct 2026): an OPEN DEAD FOREST, not a walled lane. The road is a cobbled track with dirt shoulders and a flagstone centre line; either side lie dead-grass verges and
   irregular clumps of blocking gnarled trees (gy_dead, ww_crowtree, ww_stump, gy_yew, greyed), thinning into glades. Beyond the trees the map is a solid bank of dark leaf and bark wall
   (pcrForestWall, drawn in code like the boundary of the Blighted Lands), so the party cannot walk off and the edge reads as forest. The overcast night sky, the moon, the drifting cloud, the castle
   skyline and a ground mist all show above it (outdoor level, ceil ps_sky, lv.fogAt). The only stone is the postern stub, the tall stepped gate-house wall of the tower at the north end (the gate is set into it),
   a few ruined wall fragments and a gate-post or two. The signs are painted wooden posts that stand on the ground (C.post), never plaques on nothing.
   Rules kept: the middle three squares of the road stay empty (nothing stands on the route); solid props stand only off the road (verge and forest);
   the few creatures stand in the glades, at least three squares off the route.
   ========================================================================== */
const PCR_GOLD=[1.7,1.15,.55];
const PCR={ID:9715,W:48,H:64,
  /* the centre line of the road, from the postern (south east) to the tower gate (north) */
  ROUTE:[[40,60],[40,52],[10,52],[10,42],[38,42],[38,32],[12,32],[12,22],[30,22],[30,6]],
  /* glades: [x0,y0,x1,y1,floor,name] */
  GLADES:[[22,48,34,56,'gravel','The Bone Field'],[3,38,15,46,'flagdark','The Wayside Shrine'],[30,28,44,36,'gravel','The Glade of Crosses'],[4,18,18,26,'gravel','The Leaning Lamps'],[22,5,38,14,'flagdark','The Tower Forecourt']]};
/* the forest wall: black bark and dark leaf, drawn in code (like the boundary of the Blighted Lands), in four variants */
const PCRK={};
function pcrForestWall(v,wh){
  const k=v+'|'+wh;if(PCRK[k]!==undefined)return PCRK[k];
  const hsx=(a,b,c)=>hash2(a,b,c+9000+v*17);
  return PCRK[k]=gyTile('texBlack_3',wh,{gain:.95,rgb:[.78,.86,.8],tag:'pcrF'+v,draw:(x,w,h)=>{
    x.fillStyle='rgba(52,58,50,.85)';x.fillRect(0,0,w,h);
    for(let t=0;t<5;t++){const px=hsx(t,1,1)*w,tw=5+hsx(t,2,1)*9;x.fillStyle='rgba(30,26,22,.8)';x.fillRect(px,0,tw,h);x.fillStyle='rgba(120,110,96,.4)';x.fillRect(px+tw*.15,0,2,h)}   // trunks
    for(let n=0;n<46;n++){const px=hsx(n,3,2)*w,py=hsx(n,4,2)*h,r=10+hsx(n,5,2)*22,g=hsx(n,6,2);x.fillStyle=g<.4?'rgba(24,30,26,.75)':g<.75?'rgba(78,84,72,.6)':'rgba(110,116,100,.45)';
      x.beginPath();x.ellipse(px,py,r,r*.7,hsx(n,7,2)*3,0,6.3);x.fill()}   // clumps of dead leaf
    for(let n=0;n<26;n++){const px=hsx(n,8,3)*w,py=hsx(n,9,3)*h;x.strokeStyle='rgba(8,6,6,.8)';x.lineWidth=2+hsx(n,10,3)*3;x.beginPath();x.moveTo(px,py);x.lineTo(px+(hsx(n,11,3)-.5)*60,py+(hsx(n,12,3)-.3)*60);x.stroke()}   // twigs
    const gr=x.createLinearGradient(0,h-128,0,h);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(2,6,4,.5)');x.fillStyle=gr;x.fillRect(0,h-128,w,128)}})}
function pcrBuild(info){
  const W=PCR.W,H=PCR.H;
  const C=pspMake({id:9715,start:{x:40,y:59,f:0},floor:'deadgrass',wh:3.4,amb:.95,wind:.3,castle:{at:[14,100],far:130,near:70,lift:28,lift1:18,h0:34,h1:60,wm:1.9,ring:1}});
  const {rows,block}=C,hs=C.hs,PAL=PSP_PAL,SI=PAL.silver,GR=PAL.green,ix=(x,y)=>y*W+x;
  const T=k=>psgToned(k);   // the graveyard pieces, greyed and darkened so that they sit in the castle's palette
  const open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const vn=(x,y,cs,sd)=>{const u=x/cs,v=y/cs,i=Math.floor(u),j=Math.floor(v),fx=u-i,fy=v-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);return(hs(i,j,sd)*(1-sx)+hs(i+1,j,sd)*sx)*(1-sy)+(hs(i,j+1,sd)*(1-sx)+hs(i+1,j+1,sd)*sx)*sy};
  /* ---- the road: five wide, along the centre line, with a gentle wander (one square either way, none near the bends) ---- */
  const R=PCR.ROUTE,cl=[],seen=new Set(),add=(x,y)=>{const k=x+','+y;if(!seen.has(k)){seen.add(k);cl.push([x,y])}};
  for(let i=0;i<R.length-1;i++){const [ax,ay]=R[i],[bx,by]=R[i+1],len=Math.abs(bx-ax)+Math.abs(by-ay);
    for(let t=0;t<=len;t++){const w=Math.min(1,Math.min(t,len-t)/4),off=Math.round(1.25*w*Math.sin(t/3.3+i*1.7));
      if(ax===bx)add(ax+off,ay+(by>ay?t:-t));else add(ax+(bx>ax?t:-t),ay+off)}}
  const core=new Uint8Array(W*H),inGlade=new Uint8Array(W*H),roadc=new Uint8Array(W*H);
  for(const [cx,cy] of cl)for(let y=cy-2;y<=cy+2;y++)for(let x=cx-2;x<=cx+2;x++)if(x>=2&&y>=2&&x<=W-3&&y<=H-3){core[ix(x,y)]=1;roadc[ix(x,y)]=1}
  for(const g of PCR.GLADES)for(let y=g[1];y<=g[3];y++)for(let x=g[0];x<=g[2];x++){core[ix(x,y)]=1;inGlade[ix(x,y)]=1}
  /* E: how far (squares, king moves) every square is from the road or a glade */
  const E=new Float32Array(W*H).fill(99);for(let i=0;i<W*H;i++)if(core[i])E[i]=0;
  for(let pass=0;pass<2;pass++){
    const ys=[...Array(H).keys()],xs=[...Array(W).keys()];if(pass){ys.reverse();xs.reverse()}
    const nb=pass?[[1,0],[1,1],[0,1],[-1,1]]:[[-1,0],[-1,-1],[0,-1],[1,-1]];
    for(const y of ys)for(const x of xs)for(const [a,b] of nb){const nx=x+a,ny=y+b;if(nx>=0&&ny>=0&&nx<W&&ny<H&&E[ix(nx,ny)]+1<E[ix(x,y)])E[ix(x,y)]=E[ix(nx,ny)]+1}}
  /* the open ground: the road, the glades and an irregular band of forest floor round them (two to six squares); everything else is forest wall */
  const lim=(x,y)=>2+Math.floor(vn(x,y,6,41)*3.2+vn(x,y,3,42)*1.6);
  const wallAt=(x,y)=>C.solid(x,y,C.ch(pcrForestWall((hs(x,y,3)*4)|0,3.4)));
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const inb=x>=2&&y>=2&&x<=W-3&&y<=H-3;
    if(!(inb&&(core[ix(x,y)]||E[ix(x,y)]<=lim(x,y))))wallAt(x,y)}
  /* ---- the ground: dead grass, the cobbled road with dirt shoulders and a dressed-flag centre line, gravel and flags in the glades ---- */
  for(const g of PCR.GLADES){const cx=(g[0]+g[2])/2,cy=(g[1]+g[3])/2,rx=(g[2]-g[0])/2+.5,ry=(g[3]-g[1])/2+.5,formal=g[5]==='The Tower Forecourt'||g[5]==='The Wayside Shrine';
    for(let y=g[1];y<=g[3];y++)for(let x=g[0];x<=g[2];x++){const e=((x-cx)/rx)**2+((y-cy)/ry)**2;if(formal?(e<1.4||g[5]==='The Tower Forecourt'):e<.8)C.setFloorCell(x,y,g[4])}}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(roadc[ix(x,y)]&&open(x,y)&&!inGlade[ix(x,y)])C.setFloorCell(x,y,'cobble');
  const D=new Float32Array(W*H).fill(99);   // distance from the centre line (king moves)
  for(const [cx,cy] of cl)for(let y=Math.max(0,cy-6);y<=Math.min(H-1,cy+6);y++)for(let x=Math.max(0,cx-6);x<=Math.min(W-1,cx+6);x++){const d=Math.max(Math.abs(x-cx),Math.abs(y-cy));if(d<D[ix(x,y)])D[ix(x,y)]=d}
  const Dq=(x,y)=>D[ix(x,y)];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(open(x,y)&&Dq(x,y)===2&&!inGlade[ix(x,y)]&&hs(x,y,17)<.7)C.setFloorCell(x,y,'trackdirt');   // worn dirt shoulders
  cl.forEach(([x,y],i)=>{if(open(x,y)&&i%3!==2)C.setFloorCell(x,y,'flagdark')});   // a broken line of dressed flags down the middle
  /* ---- the tower: a tall stepped gate-house wall at the north end with the gate set into it, and the postern set into a stub of wall at the south end ---- */
  for(let y=1;y<=3;y++)for(let x=25;x<=35;x++)C.solid(x,y,C.ch(pspWallGid(x===30?'pier':'dark',(hs(x,y,4)*4)|0,5.0)));
  for(let x=26;x<=34;x++)C.solid(x,4,C.ch(pspWallGid(x===30?'pier':'dark',(hs(x,4,4)*4)|0,3.4)));
  for(let y=61;y<=62;y++)for(let x=36;x<=44;x++)C.solid(x,y,C.ch(pspWallGid('dark',(hs(x,y,4)*4)|0,3.4)));
  C.links({style:{'Postern':'gate','Tower':'great'}});
  /* ---- the trees: clumps of gnarled dead trees that block, thickest further from the road; never on the road or in the glades ---- */
  const TREES=['gy_dead','ww_crowtree','gy_dead','ww_stump','gy_yew'],treeAt=(x,y,sc,k)=>C.dec(T(k||TREES[(hs(x,y,8)*TREES.length)|0]),x,y,{block:true,sc:sc||(.95+hs(x,y,7)*.4)});
  const free=(x,y)=>open(x,y)&&C.free(x,y);
  const nearLink=(x,y)=>(Math.abs(x-40)<=4&&y>=57)||(Math.abs(x-30)<=4&&y<=9);
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){
    if(!free(x,y)||core[ix(x,y)]||nearLink(x,y))continue;
    const e=E[ix(x,y)],clump=vn(x,y,4,51)*1.1+.45,p=Math.min(.97,(e===1?.18:e===2?.6:e===3?.88:.95)*clump*(e===1?1.4*vn(x,y,3,58):1));
    if(hs(x,y,52)<p){const d=treeAt(x,y);if(d){d.ox=(hs(x,y,53)-.5)*.8;d.oy=(hs(x,y,54)-.5)*.5;d.sc=(d.sc||1)*(.8+hs(x,y,59)*.7)}}}
  /* dead scrub and bones in the verge (walk-through) */
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!free(x,y)||core[ix(x,y)])continue;const r=hs(x,y,55);
    if(r<.08)C.D(['bl_grass0','bl_grass1','bl_grass2','bl_grass3','ww_twig2'][(hs(x,y,56)*5)|0],x,y,{sc:.7+hs(x,y,57)*.7});else if(r<.1)C.D(T('gy_bones'),x,y,{block:false,sc:.7})}
  /* a few ruined fragments of wall at the forest edge (never in the road) */
  for(const [x0,y0,x1,y1] of [[19,45,21,45],[41,38,41,40],[7,28,9,28],[24,18,24,20],[33,42,35,42],[16,36,16,38]]){
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open(x,y)&&!core[ix(x,y)]&&!C.decor.some(d=>d.x===x&&d.y===y)){C.solid(x,y,C.ch(pspWallGid(['dark','moss','ash'][(x+y)%3],(hs(x,y,4)*4)|0,1.2+hs(x,y,9)*1.4)))}}
  /* ---- dressing ---- */
  const lamp=(x,y,col)=>{if(!C.free(x,y))return;C.dec('gy_lantern',x,y,{block:false,sc:1.05});C.light(x,y,col||SI)};
  const edge=(x,y)=>open(x,y)&&Dq(x,y)===2&&!inGlade[ix(x,y)];                // the outer row of the road
  /* a leaning lamp every few squares along the road's edge (walk-through), stones and heaps on the shoulder */
  cl.forEach(([x,y],i)=>{if(i%13===5){for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2]])if(edge(x+dx,y+dy)){lamp(x+dx,y+dy,i%26===5?SI:GR);break}}});
  for(const [cx,cy] of cl)for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2]]){const x=cx+dx,y=cy+dy;if(edge(x,y)&&C.free(x,y)&&hs(x,y,21)<.05)C.prop(['moss_rock','cobble_heap'][(x+y)&1],x,y,{block:false})}
  /* the glades: stones, bones and graves among the trees (inside the glade only, three or more squares from the route) */
  for(const g of PCR.GLADES){
    const [x0,y0,x1,y1]=g;
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(!open(x,y)||!C.free(x,y)||roadc[ix(x,y)])continue;const r=hs(x,y,31),d=Dq(x,y);
      if(d>=3){
        if(r<.025)treeAt(x,y);
        else if(r<.055)C.dec([T('gy_bones'),pspPic('cobble_heap'),pspPic('moss_rock')][(hs(x,y,33)*3)|0],x,y,{block:false,sc:.8});
        else if(r<.075&&g[5]!=='The Tower Forecourt')C.dec(T(['gy_stone1','gy_stone2','gy_ccross','gy_wcross'][(hs(x,y,32)*4)|0]),x,y,{block:true,sc:.95})}}}
  /* the Bone Field: skulls on posts and heaps of bones */
  for(const [x,y] of [[24,50],[31,50],[33,54],[23,55]])if(Dq(x,y)>=3&&C.free(x,y))C.prop('skull_pillar',x,y,{block:true});
  for(const [x,y,k] of [[26,48,0],[29,53,1],[22,51,0],[33,50,2]])if(open(x,y)&&C.free(x,y))C.dec(k===0?T('gy_bones'):k===1?pspPic('cobble_heap'):pspPic('moss_rock'),x,y,{block:false,sc:.75})
  /* the Glade of Crosses: rows of crosses and a great old tree */
  for(let x=33;x<=43;x+=2)for(const y of [29,35])if(Dq(x,y)>=3&&C.free(x,y)&&((x>>1)+y)%3)C.dec(T(['gy_ccross','gy_wcross','gy_stone1'][(x>>1)%3]),x,y,{block:true,sc:1});
  if(C.free(42,29))treeAt(42,29,1.3,'gy_yew');if(C.free(31,35))treeAt(31,35,1.2,'ww_crowtree');
  /* the Leaning Lamps: lamps that lean over the road, a ring of them */
  for(const [x,y] of [[5,19],[8,19],[11,19],[15,19],[5,25],[8,25],[15,25],[17,22],[5,22]])if(open(x,y))lamp(x,y,hs(x,y,9)<.5?SI:[.8,1.2,.6]);
  /* the Wayside Shrine: a safe place with a bench, a warm lantern, a free rest */
  {const x0=5,y=41,id='pcr_bench';
    C.safe.push({rect:1,x0,y0:y,x1:x0+2,y1:y+1});
    C.rests.push({x0,y0:y,x1:x0+2,y1:y+1,line:'A wayside shrine. A bench, a warm lantern, a loaf and a cup. Nothing hostile comes near.',name:'The Wayside Shrine'});
    C.light(x0+1,y,C.warmCol);
    if(!NPCS[id])khNpc(id,'A pilgrim bench','gy_bench',()=>say('A stone bench under a small shrine of the Pale Mother, with a lantern that does not flicker. The road behind you is long, and the one ahead is longer.',[['Rest a while.',()=>{try{restParty(true)}catch(e){}return null}],['Leave.',()=>null]]));
    C.dec(T('gy_bench'),x0+1,y+1,{block:true,npc:id,sc:1.1});C.dec(pspPic('lantern_red_b'),x0,y,{block:false});C.dec(pspPic('statue_plinth'),x0+2,y,{block:true})}
  for(const [x,y] of [[5,39],[9,39],[13,39],[4,45],[14,45]])if(Dq(x,y)>=3&&C.free(x,y))C.dec(pspPic('urn_big'),x,y,{block:true,sc:.9});
  /* the tower forecourt: two lamps, two urns, two gate-posts, a signpost, the gate set into the wall */
  for(const x of [26,34]){lamp(x,8,PCR_GOLD)}C.light(30,5,PCR_GOLD);C.light(29,7,PCR_GOLD);C.light(31,7,PCR_GOLD);
  for(const x of [24,36])C.prop('urn_big',x,7,{block:true});
  for(const x of [27,33])C.prop('pillar_lantern',x,5,{block:true,sc:.9});   // the gate-posts, beside the gate
  for(const x of [23,37])C.prop('pillar_lantern',x,10,{block:true,sc:.8});
  C.vines(26,5,{});C.vines(34,5,{});
  /* signs: painted wooden posts that stand on the ground, boards lettered with the names */
  C.post(24,5,'pcr_post_tower',['THE CROOKED TOWER','LEVEL 100 AND UP'],'pcr_post_tower','A signpost at the foot of the tower wall. THE CROOKED TOWER, and under it: LEVEL 100 AND UP. The gate turns back the unready.',{sc:1.05});
  C.post(37,58,'pcr_post_road',['THE CROOKED ROAD','THE EAST POSTERN'],'pcr_post_road','A signpost by the postern. THE CROOKED ROAD runs north to the Crooked Tower. The EAST POSTERN is behind you, back to the Court of Statues.',{sc:1.05});
  lamp(38,58,PCR_GOLD);lamp(42,58,PCR_GOLD);
  /* a few chests in the glades */
  for(const [x,y,t] of [[24,54,1],[41,34,1],[6,20,1]])if(Dq(x,y)>=3&&C.free(x,y))C.chest(x,y,{tier:t});
  /* ---- creatures: few, in the glades, at least three squares off the route ---- */
  const spot=(x0,y0,x1,y1,seed)=>{for(let k=0;k<80;k++){const x=x0+((hs(k,seed,61)*(x1-x0+1))|0),y=y0+((hs(k,seed,62)*(y1-y0+1))|0);if(open(x,y)&&Dq(x,y)>=3&&C.free(x,y)&&!C.safe.some(z=>pspInZone(z,x,y,2)))return [x,y]}return null};
  const FOE=(t,g,seed,wake)=>{const q=spot(g[0],g[1],g[2],g[3],seed);if(q)(wake?pspStatueWake:pspFoe)(C,t,q[0],q[1])};
  const G=PCR.GLADES;
  FOE('psguard',G[0],1);FOE('pshalberd',G[0],2);FOE('pssentinel',G[0],3,1);
  FOE('psmourner',G[2],4);FOE('pssentinel',G[2],5,1);FOE('psguard',G[2],6);
  FOE('psmourner',G[3],7);FOE('psguard',G[3],8);
  FOE('pssentinel',G[4],9,1);FOE('pssentinel',G[4],10,1);
  for(const e of C.enemies)e.lvl=100;
  C.glow(7,SI);
  /* nothing may be sealed in: a square of open ground that the road cannot reach (ringed by trees) becomes forest wall */
  {const bs=new Set();for(const d of C.decor)if(d.block)bs.add(d.x+','+d.y);
   const reach=new Uint8Array(W*H),q=[ix(40,59)];reach[q[0]]=1;
   for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||reach[ix(nx,ny)]||!open(nx,ny)||bs.has(nx+','+ny))continue;reach[ix(nx,ny)]=1;q.push(ix(nx,ny))}}
   for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(open(x,y)&&!reach[ix(x,y)]&&!bs.has(x+','+y)){wallAt(x,y);for(let i=C.decor.length-1;i>=0;i--)if(C.decor[i].x===x&&C.decor[i].y===y)C.decor.splice(i,1);for(let i=C.lights.length-1;i>=0;i--)if(C.lights[i][0]===x&&C.lights[i][1]===y)C.lights.splice(i,1)}}
  psgNoLooseArch(C);psgPost(C,false);
  /* a tree right beside a walkable square is kept small and pushed back from it: a big canopy on the next square filled the whole view of anyone walking past */
  {const blk=new Set(C.decor.filter(d=>d.block).map(d=>d.x+','+d.y)),walk=(x,y)=>open(x,y)&&!blk.has(x+','+y);
   for(const d of C.decor){if(!d.block||!/gy_dead|crowtree|stump|gy_yew/.test(String(d.k)))continue;const nb=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].filter(([a,b])=>walk(d.x+a,d.y+b));if(!nb.length)continue;
     const h=NPC_H[d.k]||3,cap=2.0/h;if((d.sc||1)>cap)d.sc=cap;d.ox=Math.max(-.35,Math.min(.35,-nb.reduce((t,q)=>t+q[0],0)*.2));d.oy=Math.max(-.35,Math.min(.35,-nb.reduce((t,q)=>t+q[1],0)*.2))}}
  const lv=C.finish({start:{x:40,y:59,f:0}});
  lv.fogAt=()=>[70,100,112,.02];   // a cold ground mist over the whole road
  lv.mapNames=[{t:'The East Postern',x:40,y:58,k:'place'},{t:'The Bone Field',x:28,y:52,k:'place'},{t:'The Wayside Shrine',x:7,y:42,k:'place'},{t:'The Glade of Crosses',x:37,y:32,k:'place'},{t:'The Leaning Lamps',x:10,y:22,k:'place'},{t:'The Tower Forecourt',x:30,y:10,k:'place'}];
  return lv}
pspRegister(9715,pcrBuild);
/* the tower gate turns back a party below level 100 (ntLevelOk, nt_map.js) */
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psp&&d.psp.to===1000000000&&typeof ntLevelOk==='function'&&!ntLevelOk()){ntTooLow();return true}
  return _k.apply(this,arguments)}}
