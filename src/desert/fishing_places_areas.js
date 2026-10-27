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
  fplDef(n,c=>{c.shore({box:[2,4,c.W-3,c.H-6],step:sea?13:10,max:sea?14:12,water:sea?'salt':'fresh',seed:n})});
}
/* Greendale (32): a small lake in the east meadow, a rowing boat, and a little plank jetty */
fplDef(32,c=>{
  const cells=c.ellipse(47,10.5,3.3,2,17).filter(([x,y])=>!(x===47&&y<=10));
  if(!c.lake(cells,{floor:'water'}))return;
  c.jetty(47,8,0,1,3);
  c.stand(47,10,-1,0);c.stand(47,10,1,0);c.edgeStand(cells,'W',11);c.edgeStand(cells,'E',11);c.edgeStand(cells,'S',45);
  fplBank(c,{seed:43});
  c.deco('yar_boat_row',50,12,{block:false,walk:false,sc:1.1,force:1});
  c.deco('bench',45,7,{block:true,walk:false});c.deco('pt_willow',51,8,{sc:1.2});
});
