/* ==========================================================================
   THE WELL MAZE: furnishing the rooms (prefix wm / WM). WM.furnish[kind](c,room). c is the context made by wmContext (wellmaze_build.js).
   Props are the painted pieces of assets/ds_wm_*.png; blocking pieces stand on the rim of a room or on inner squares with a gap round them, never on a doorway.
   ========================================================================== */
const WM_COL={vio:[1.05,.5,1.5],lil:[1.15,.8,1.4],gold:[1.4,1.0,.45],teal:[.5,1.2,1.1],wht:[1.2,1.15,1.3]};
const WM_LV=(c,k)=>c.k===k;
function wmSpread(c,r,names,n,inner,o){ // n pieces of the listed kinds on free squares of a room (inner or rim), not touching each other
  const cells=c.pick(inner?c.inner(r):c.rim(r),inner?n*3:n*3),got=[];
  for(const [x,y] of cells){if(got.length>=n)break;if(got.some(p=>Math.abs(p[0]-x)<=1&&Math.abs(p[1]-y)<=1))continue;if(!c.free(x,y))continue;
    const nm=names[(c.rnd()*names.length)|0];c.prop(nm,x,y,Object.assign({},o||{}));got.push([x,y])}
  return got}
function wmFoes(c,r,list,n){const cells=c.pick(c.inner(r).concat(c.rim(r)),n*3);let m=0;for(const [x,y] of cells){if(m>=n)break;if(!c.free(x,y))continue;c.enemy(list[m%list.length],x,y);m++}}
const WMFU=WM.furnish;
WMFU.start=function(c,r){const R=c.rect(r);
  if(c.k===0){ // the well shaft: ladder up in the north wall, windlass, bucket and the scale of the weights puzzle
    c.D('wm_ladder',R.cx,R.y0,{block:true,npc:'wm_ladderup'});c.mark(R.cx,R.y0+1);
    c.prop('windlass',R.x1,R.y0,{});c.deco('bucket',R.x1,R.y0+1,{});
    c.D('wm_scale',R.x0,R.cy,{block:true,npc:'wm_scale'});
    c.note('shaft1',R.x0,R.y0,'signpost');
    c.note('weights',R.x0,R.y1,'noticeboard');
    c.prop('tools',R.x1,R.y1,{});
    for(const [x,y] of [[R.cx-1,R.cy],[R.cx+1,R.cy]])c.light(x,y,WM_COL.lil);
    c.light(R.x1,R.y0+1,WM_COL.gold)}
  else{const u=c.M.up,far=u.f===2?[[R.x0,R.y1],[R.x1,R.y1]]:u.f===0?[[R.x0,R.y0],[R.x1,R.y0]]:u.f===1?[[R.x1,R.y0],[R.x1,R.y1]]:[[R.x0,R.y0],[R.x0,R.y1]];
    for(const [x,y] of far){c.prop('brazier',x,y,{});c.light(x,y,WM_COL.vio)}c.light(R.cx,R.cy,WM_COL.lil)}}
WMFU.stairOut=function(c,r){const R=c.rect(r);c.prop('brazier',R.x0,R.y1,{});c.light(R.x0,R.y1,WM_COL.gold);c.prop('brazier',R.x1,R.y1,{});c.light(R.x1,R.y1,WM_COL.vio)};
WMFU.camp=function(c,r){const R=c.rect(r);
  c.note('camp1',R.x0,R.y0,'noticeboard');c.prop('tools',R.x1,R.y0,{});c.prop('bucket',R.x1,R.y1,{block:false,walk:true});
  c.D('wm_barrel',R.x0,R.y1,{block:true,npc:'wmw_barrel'});c.D('wm_crate',R.cx,R.y0,{block:true,npc:'wmw_crate'});
  c.deco('skeleton',R.cx,R.y1,{});
  if(c.k===0){const q=c.free(R.x1-1,R.cy)?[R.x1-1,R.cy]:c.pick(c.rim(r),1)[0];if(q)c.D('sack2',q[0],q[1],{block:true,npc:'wm_hoblunch',sc:.7})}   // Hobb's lunchbox (the quest Hobb's Lunch, hobs_lunch.js)
  c.light(R.cx,R.cy,WM_COL.gold);wmFoes(c,r,['wmbat','wmslime'],2)};
WMFU.cistern=function(c,r){const R=c.rect(r);
  if(c.k===0){c.D('wm_boat',R.x0,R.cy,{block:true,npc:'wmrow_a'});c.note('cistern1',R.x0,R.y0,'signpost')}
  for(const [x,y] of c.pick(c.inner(r),4))c.deco('crystal_small',x,y,{});
  c.chest('chest',R.x1,R.cy,1,null,{});
  c.light(R.cx,R.cy,WM_COL.teal);c.light(R.x0+1,R.y0+1,WM_COL.vio);
  wmFoes(c,r,['wmcrab','wmslime','wmcrab','wmslime'],c.k===0?3:4)};
WMFU.cellar=function(c,r){const R=c.rect(r);
  wmSpread(c,r,['cask','cask','barrel_tall','keg'],5,false,{});
  if(c.k===0){c.D('wm_barrel',R.x1,R.y0,{block:true,npc:'wmw_barrel'});c.D('wm_barrel',R.x0,R.y1,{block:true,npc:'wmw_barrel'});c.D('wm_crate',R.x1,R.y1,{block:true,npc:'wmw_crate'})}
  if(c.k===0)c.note('cellar1',R.x0,R.y0,'signpost');c.chest('chest',R.cx,R.y1,1,null,{});
  c.light(R.cx,R.cy,WM_COL.gold);wmFoes(c,r,['wmspider','wmbat','wmslime'],c.k===0?2:3)};
WMFU.shrine=function(c,r){const R=c.rect(r);
  c.prop('shrine',R.cx,R.y0,{});c.prop('statue',R.cx,R.cy,{});
  c.prop('candelabra',R.x0,R.y0,{});c.prop('candelabra',R.x1,R.y0,{});
  for(const [x,y] of c.pick(c.rim(r),3))c.deco('bellflower',x,y,{});
  if(c.k===0)c.D('wm_crate',R.x1,R.y1,{block:true,npc:'wmw_crate'});
  c.note('shrine'+c.k,R.x0,R.y1,'signpost');
  c.light(R.cx,R.y0+1,WM_COL.lil);c.light(R.x0,R.y0,WM_COL.wht);
  wmFoes(c,r,c.k===0?['wmbat']:['wmcultist','wmcultist','wmwraith'],c.k===0?1:3)};
WMFU.mine=function(c,r){const R=c.rect(r);
  c.prop('mine_cart',R.x0,R.y0,{});c.prop('ore_cart',R.x1,R.y0,{});c.prop('tools',R.x0,R.y1,{});c.deco('ladder',R.cx,R.y0,{block:true,walk:false});
  for(const [x,y] of c.pick(c.inner(r),3))c.deco('crystal_small',x,y,{});
  c.note(c.k===2?'lantern_order':'mine'+c.k,R.x1,R.y1,'signpost');
  if(c.k===0){const q=c.free(R.cx,R.y1)?[R.cx,R.y1]:c.pick(c.inner(r),1)[0];if(q)c.D('wm_gold',q[0],q[1],{block:true,npc:'wm_hobring',sc:.45})}   // the family ring (the quest Hobb's Lunch)
  if(c.k===0){ // the foreman's strongbox at the far corner: the Violet Key, and a mimic
    const q=c.free(R.x1-1,R.y1)?[R.x1-1,R.y1]:c.pick(c.rim(r),1)[0];
    const kc=c.chest('chest',q[0],q[1],2,['wmkey1'],{ambush:['wmmimic'],goldAmt:0});c.meta.keyAt=c.meta.keyAt||{};if(kc)c.meta.keyAt.wmkey1={x:kc.x,y:kc.y}}
  else c.chest('chest',R.cx,R.y1,2,null,{});
  c.light(R.cx,R.cy,WM_COL.gold);wmFoes(c,r,['wmbeetle','wmgolem','wmbeetle'],c.k===0?2:3)};
WMFU.grotto=function(c,r){const R=c.rect(r);
  wmSpread(c,r,['crystal_tall','crystal_white','crystal_teal','crystal_pillar','geode','crystal_tall'],c.k===3?7:6,true,{});
  wmSpread(c,r,['crystal_small','crystal_teal','geode'],5,false,{});
  for(const [x,y] of c.pick(c.rim(r),3))c.deco('crystal_small',x,y,{});
  c.chest('treasure_chest',R.x1,R.y0,2,null,{});
  if(c.k===1)c.note('grotto1',R.x0,R.y1,'signpost');if(r.id==='grotto2')c.note('grotto2',R.x0,R.y1,'signpost');
  c.light(R.cx,R.cy,WM_COL.vio);c.light(R.x0,R.y0,WM_COL.wht);c.light(R.x1,R.y1,WM_COL.teal);c.light(R.x0,R.y1,WM_COL.vio);
  wmFoes(c,r,['wmcrab','wmgolem','wmbeetle','wmgolem'],c.k===3?5:4)};
WMFU.library=function(c,r){const R=c.rect(r);
  for(let x=R.x0;x<=R.x1;x+=2)if(c.free(x,R.y0)&&!c.mouths(r).has(x+','+R.y0))c.prop('bookshelf',x,R.y0,{});
  c.prop('statue',R.cx,R.cy,{});for(const [x,y] of c.pick(c.rim(r),2))c.prop('web',x,y,{});
  c.note('library'+c.k,R.x0,R.y1,'signpost');
  if(c.k===2)c.note('bell_hint',R.x1,R.y1,'noticeboard');
  c.light(R.cx,R.y0+1,WM_COL.lil);c.light(R.cx,R.y1,WM_COL.vio);
  wmFoes(c,r,['wmwraith','wmspider','wmwraith'],3)};
WMFU.mirror=function(c,r){const R=c.rect(r);
  const mm=[];for(let x=R.x0;x<=R.x1;x+=2)if(c.free(x,R.y0))mm.push([x,R.y0]);for(let x=R.x0;x<=R.x1;x+=2)if(c.free(x,R.y1))mm.push([x,R.y1]);
  mm.forEach(([x,y],i)=>{c.D('wm_mirror',x,y,{block:true,npc:'wmmirror_'+(i%3)})});
  c.prop('statue',R.cx,R.cy,{});c.note('mirror1',R.x0,R.cy,'signpost');
  c.light(R.cx,R.cy,WM_COL.wht);c.light(R.x0,R.y0,WM_COL.vio);c.light(R.x1,R.y1,WM_COL.vio);
  wmFoes(c,r,['wmwraith','wmcultist','wmwraith'],3)};
WMFU.spiders=function(c,r){const R=c.rect(r);
  for(const [x,y] of c.pick(c.rim(r).concat(c.inner(r)),7))c.prop('web',x,y,{});
  c.deco('skeleton',R.cx,R.cy,{});c.note('spiders1',R.x0,R.y1,'signpost');
  c.light(R.cx,R.cy,WM_COL.lil);c.light(R.x1,R.y0,WM_COL.vio);
  wmFoes(c,r,['wmspider'],7)};
WMFU.fungus=function(c,r){const R=c.rect(r);
  wmSpread(c,r,['mush_tree','mush_tall','mush_cluster','mush_tree','mush_bulb'],c.k===1?9:6,true,{});
  for(const [x,y] of c.pick(c.rim(r),6))c.deco(c.rnd()<.5?'bellflower':'moss_mound',x,y,{});
  c.note('fungus'+c.k,R.x0,R.y1,'signpost');if(c.k===2)c.note('trap1',R.x1,R.y1,'signpost');
  c.light(R.cx,R.cy,WM_COL.lil);c.light(R.x0,R.y0,WM_COL.teal);c.light(R.x1,R.y1,WM_COL.vio);
  wmFoes(c,r,['wmfungus','wmfungus','wmbat'],c.k===1?5:4)};
WMFU.bells=function(c,r){const R=c.rect(r);
  for(let i=0;i<3;i++){const x=R.x0+2+i*Math.max(2,((R.w-4)>>1));if(x<=R.x1-1)c.D('wm_bell',x,R.y0,{block:true,npc:'wmbell_'+i,sc:1})}
  c.deco('skeleton',R.cx,R.y1,{});c.note('bellringer1',R.x0,R.y1,'noticeboard');c.prop('candelabra',R.x1,R.y1,{});
  for(const [x,y] of c.pick(c.inner(r),2))c.prop('crystal_pillar',x,y,{});
  c.light(R.cx,R.cy,WM_COL.gold);c.light(R.x0,R.y0,WM_COL.vio);c.light(R.x1,R.y0,WM_COL.vio);
  wmFoes(c,r,['wmwraith','wmwraith','wmcultist','wmwraith'],4)};
WMFU.lanterns=function(c,r){const R=c.rect(r);
  const L3=['violet','lilac','gold'];
  L3.forEach((nm,i)=>{const x=R.x0+2+i*Math.max(2,((R.w-4)>>1));if(x<=R.x1-1)c.D('wm_lantern_'+nm,x,R.y0,{block:true,npc:'wmlamp_'+i,bob:.35})});
  c.D('wm_rune',R.cx,R.y1,{block:true,npc:'wmnote_lanterns1'});c.meta.notes.lanterns1={x:R.cx,y:R.y1};
  for(const [x,y] of c.pick(c.inner(r),2))c.prop('crystal_tall',x,y,{});
  c.light(R.cx,R.cy,WM_COL.vio);wmFoes(c,r,['wmgolem','wmwraith','wmgolem'],3)};
WMFU.boss=function(c,r){const R=c.rect(r);
  for(const [x,y] of [[R.x0+2,R.y0+1],[R.x1-2,R.y0+1],[R.x0+2,R.y1-1],[R.x1-2,R.y1-1]])if(c.free(x,y)){c.prop('crystal_pillar',x,y,{});}
  c.prop('brazier',R.x0,R.y1,{});c.prop('brazier',R.x1,R.y1,{});c.light(R.x0,R.y1,WM_COL.vio);c.light(R.x1,R.y1,WM_COL.vio);
  c.D('wm_orb_pedestal',R.cx,R.y0,{block:true,npc:'wm_prize'});
  for(const [x,y] of c.pick(c.rim(r),4))c.deco('crystal_teal',x,y,{});
  for(const [x,y] of [[R.x0,R.y0],[R.x1,R.y0],[R.x0,R.cy],[R.x1,R.cy]])if(c.free(x,y))c.prop('statue',x,y,{});   // a hall of statues, with candles and old bones of the ones who came before
  for(const [x,y] of [[R.cx-2,R.y0],[R.cx+2,R.y0]])if(c.free(x,y))c.prop('candelabra',x,y,{});
  for(const [x,y] of c.pick(c.rim(r),3))c.deco('skeleton',x,y,{});for(const [x,y] of c.pick(c.rim(r),2))c.prop('web',x,y,{});
  c.light(R.cx,R.cy,WM_COL.wht);c.light(R.cx,R.y0+1,WM_COL.vio);c.light(R.x0+1,R.cy,WM_COL.vio);c.light(R.x1-1,R.cy,WM_COL.vio);
  c.note('warden1',R.cx-1,R.y1,'signpost');
  c.enemy('wmwarden',R.cx,R.cy-0);c.meta.boss={x:R.cx,y:R.cy};
  c.enemy('wmgolem',R.cx-3,R.y1-1);c.enemy('wmgolem',R.cx+3,R.y1-1)};
WMFU.lake=function(c,r){const R=c.rect(r);
  for(const [x,y] of c.pick(c.rim(r),6))c.deco(c.rnd()<.5?'crystal_teal':'bellflower',x,y,{});
  for(const [x,y] of c.pick(c.rim(r),2))c.prop('crystal_tall',x,y,{});
  c.note('lake1',R.x0,R.y0,'signpost');c.light(R.cx,R.cy,WM_COL.teal);c.light(R.x0,R.cy,WM_COL.vio);c.light(R.x1,R.cy,WM_COL.vio);
  wmFoes(c,r,['wmslime','wmcrab','wmslime','wmwraith'],5)};
WMFU.island=function(c,r){const R=c.rect(r);
  c.D('wm_boat',R.x0,R.cy,{block:true,npc:'wmrow_b'});c.chest('treasure_chest',R.x1,R.cy,3,null,{});c.prop('candelabra',R.cx,R.y0,{});c.light(R.cx,R.cy,WM_COL.gold)};
WM.VVAR={v1:1,v2:4,v3:0,v4:3,v5:3,v6:3,v7:1,v8:0,v9:2}; // which of the five dressings each vault has (fixed, so a vault keeps its look wherever it stands)
WMFU.vault=function(c,r){const R=c.rect(r);
  const cells=c.pick(c.rim(r),4);let n=0;
  for(const [x,y] of cells){if(n>=3)break;c.chest(n===0?'treasure_chest':'chest',x,y,3,null,{});n++}
  const v=WM.VVAR[r.id]!==undefined?WM.VVAR[r.id]:(hash2(r.x0,r.y0,c.k*17+3)*5)|0;   // five dressings, so the vaults do not all look alike
  if(v===0){c.D('wm_gold',R.cx,R.cy,{block:false,walk:true,deco:true});c.prop('candelabra',R.x0,R.y0,{})}
  else if(v===1){for(const x of [R.x0,R.x1])c.prop('bookshelf',x,R.y0,{});c.prop('statue',R.cx,R.cy,{});c.prop('candelabra',R.x0,R.y1,{})}
  else if(v===2){for(const [x,y] of c.pick(c.inner(r),3))c.prop('crystal_tall',x,y,{});c.prop('shrine',R.cx,R.y0,{});c.deco('skeleton',R.cx,R.cy,{})}
  else if(v===3){for(const [x,y] of c.pick(c.inner(r).concat(c.rim(r)),4))c.prop(['barrel_stack','crate','cask','barrel_tall'][(hash2(x,y,5)*4)|0],x,y,{});c.D('wm_gold',R.cx,R.cy,{block:false,walk:true,deco:true,sc:.7});c.prop('lamp_post',R.x1,R.y1,{})}
  else{c.prop('brazier',R.x0,R.y0,{});c.prop('brazier',R.x1,R.y0,{});c.prop('orb_pedestal',R.cx,R.cy,{});for(const [x,y] of c.pick(c.rim(r),2))c.deco('mush_cluster',x,y,{})}
  c.light(R.cx,R.cy,WM_COL.gold);c.light(R.x1,R.y0,WM_COL.wht)};
WMFU.riddle=function(c,r){const R=c.rect(r);c.light(R.cx,R.cy,WM_COL.gold)};
WM.ROOMNAMES.shaft='The Well Shaft';
