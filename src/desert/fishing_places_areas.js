/* ==========================================================================
   FISHING PLACES, THE RECIPES (prefix fpl): one fplDef per area, using the tools of fishing_places.js.
   ========================================================================== */
/* Ironhill (13): a glade in the trees south of the town, reached by a gap in the fence at the end of the lane at x 23, with a small lake, reeds, a bench and three spots */
fplDef(13,c=>{
  c.clear(22,27,24,27,/^fence$/);c.clear(17,28,29,34);
  const cells=c.ellipse(23,31,3.2,2.1,11);
  if(!c.lake(cells,{floor:'water'}))return;
  c.edgeStand(cells,'N',23);c.edgeStand(cells,'W',31);c.edgeStand(cells,'E',31);
  fplBank(c,{seed:41});
  c.deco('bench',20,29,{block:true,walk:false,sc:1});c.deco('pt_willow',27,29,{sc:1.2});c.deco('lamp',25,28,{sc:1});
});
/* Khemetra (44): a pond in the lawn of the parks and the three named gardens (every pond has a bit of reed round it and two to four spots) */
fplDef(44,c=>{
  const C=typeof KH_CITY!=='undefined'?KH_CITY:null;if(!C)return;
  const plz=C.plazas.filter(p=>p.z===2),parks=plz.filter(p=>p.park).filter((p,i)=>i%2===0),gardens=plz.filter(p=>!p.park);
  const offs=[[0,0],[4,0],[-4,0],[0,4],[0,-4],[5,4],[-5,-4],[5,-4],[-5,4],[0,7],[0,-7]];
  let n=0;
  for(const p of [...gardens,...parks]){
    const cx=(p.x0+p.x1)>>1,cy=(p.y0+p.y1)>>1;let done=false;
    for(let k=0;k<offs.length&&!done;k++){
      const px=cx+offs[k][0],py=cy+offs[k][1],cells=c.ellipse(px,py,3.4,2.3,(px*7+py)|0);
      if(cells.some(([x,y])=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const r=c.L.rows[y+dy];return !r||r[x+dx]!=='.'})))continue; // a dry path between the pond and every wall, so no pond lies against a door
      if(!c.lake(cells,{floor:'water',quiet:true,into:'2'}))continue;
      done=true;c.quietStands=true;let s=0;
      s+=c.edgeStand(cells,'N',px)?1:0;s+=c.edgeStand(cells,'S',px)?1:0;s+=c.edgeStand(cells,'W',py)?1:0;s+=c.edgeStand(cells,'E',py)?1:0;
      c.quietStands=false;n++;
      if(!s)c.refused.push('khemetra pond without a spot '+px+','+py)}
  }
  fplBank(c,{seed:47,reedP:.4});
  c.refused.length||0;
});
/* Yarrim (290): the beach on the east shore, salt water */
fplDef(290,c=>{c.shore({box:[54,12,76,72],step:5,max:16,water:'salt',seed:3})});
/* Oldhaven Quay (304): along the quay edge and the ends of the jetties, salt water */
fplDef(304,c=>{c.shore({box:[2,30,78,66],step:4,max:30,water:'salt',seed:4,dirs:[[0,1],[1,0],[-1,0]]})});
/* the Pilgrim's Path: the sea legs run along the coast (salt, beach spots), the mountain legs along their rivers and ponds (fresh) */
for(let n=400;n<=423;n++){
  const sea=(n>=400&&n<=407)||(n>=416&&n<=421);
  if(sea)fshSetWater(n,'salt');
  fplDef(n,c=>{c.shore({box:[2,4,c.W-3,c.H-6],step:sea?13:10,max:sea?14:12,water:sea?'salt':'fresh',seed:n});
    // the mountain legs with only puddles of water get a couple of small ponds in the flat verge, away from the road
    if(!sea&&c.stands.length<10){const before=c.stands.length;fplLakes(c,{n:3,seed:n*3,rx:[2.6,3.6],ry:[1.8,2.6],margin:5,tol:.7,path:'1',floor:'bluewater',water:'fresh',sep:60,box:[56,60,94,c.H-60]});c.refused=c.refused.filter(m=>!/lakes found room/.test(m))}});
}
/* a few lakes in open country: tries positions in a fixed random order, keeps each one that has room, and puts spots on its four sides */
function fplLakes(c,o){
  const got=[];const box=o.box||[8,8,c.W-9,c.H-9];
  for(let t=0;t<4000&&got.length<o.n;t++){
    const cx=box[0]+((hash2(t,1,o.seed)*(box[2]-box[0]))|0),cy=box[1]+((hash2(t,2,o.seed)*(box[3]-box[1]))|0);
    if(got.some(g=>Math.hypot(g[0]-cx,g[1]-cy)<(o.sep||24)))continue;
    const rx=o.rx[0]+hash2(t,3,o.seed)*(o.rx[1]-o.rx[0]),ry=o.ry[0]+hash2(t,4,o.seed)*(o.ry[1]-o.ry[0]),cells=c.ellipse(cx,cy,rx,ry,t+o.seed);
    if(!c.roomFor(cells,o.margin||8,o.tol||0,o.path||null))continue;
    if(!c.lake(cells,{floor:o.floor||'water',quiet:true}))continue;
    got.push([cx,cy]);c.quietStands=true;let s=0;
    for(const [side,al] of [['N',cx],['S',cx],['W',cy],['E',cy]])s+=c.edgeStand(cells,side,al,o.water)?1:0;
    c.quietStands=false;if(o.rim)c.rim(o.rim,o.path);
    if(!s)c.refused.push('pond without a spot '+cx+','+cy)}
  if(got.length<o.n)c.refused.push('only '+got.length+' of '+o.n+' lakes found room');
  fplBank(c,{seed:o.seed+5,reedP:.5});return got}
/* the Hollow Land (364): four black pools in the great dark hall, deep water */
fplDef(364,c=>{
  const spots=[[20,24,4.2,2.8],[51,31,4.2,2.8],[19,40,3.6,2.4],[54,54,4.4,2.6]];
  for(const [cx,cy,rx,ry] of spots){const cells=c.ellipse(cx,cy,rx,ry,cx*3+cy);
    if(!c.lake(cells,{floor:'water'}))continue;c.quietStands=true;
    for(const [side,al] of [['N',cx],['S',cx],['W',cy],['E',cy]])c.edgeStand(cells,side,al,'deep');c.quietStands=false}
  fplBank(c,{seed:61,reedP:.5});
});
/* the Hollow Grasslands (470): six ponds on flat grass, away from paths, villages and hives, sand round them (fresh) */
fplDef(470,c=>{fplLakes(c,{n:5,seed:71,rx:[3.4,4.6],ry:[2.4,3.2],margin:7,tol:.5,path:'1',rim:'bluesand',water:'fresh',sep:28})});
/* the Deeper Hollow (475) and the Underlevel (476): spots along the edges of the dark waters, deep water */
fplDef(475,c=>{c.windows({max:12,step:14,water:'deep',seed:75});c.shore({step:7,max:10,water:'deep',seed:75})});
fplDef(476,c=>{c.shore({step:8,max:30,water:'deep',seed:76})});
/* Greendale (32): a small lake in the east meadow beyond the plots (the large and medium for-sale houses stand at x 42 to 49, so the lake is a two-row pond at x 56 to 62 with a walkable north bank) and a rowing boat */
fplDef(32,c=>{
  c.clear(55,8,62,8);   // the north bank is walkable, so the pond never cuts the east end off
  const cells=c.ellipse(59,9.5,3.2,1.25,17);
  if(!c.lake(cells,{floor:'water'}))return;
  c.edgeStand(cells,'N',58);c.edgeStand(cells,'N',60);c.edgeStand(cells,'W',9);
  fplBank(c,{seed:43});
  c.deco('yar_boat_row',60,10,{block:false,walk:false,sc:1.1,force:1});
});
