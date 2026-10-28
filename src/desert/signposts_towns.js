/* ==========================================================================
   SIGNPOSTS TO TOWNS AND PLACES (prefix spt). The plain green signposts (picture greensign) that point to a town or a named place now carry that name
   lettered on their boards, in the way of the Wenlock street signs (wlnPostPic in wenlock_names.js): one board to a place, an arrow shape pointing the
   right way, one line of text shrunk to fit, and each post with its own colours and lettering. What each one says, and where it stands, is listed in
   tools/signposts/INVENTORY.md.
   - The boards are painted into the picture of the post, so they read from every side. The arrow is right for the way the party usually walks up to the
     post (the "f" of each post below: 0 north, 1 east, 2 south, 3 west): a place off to the left or right gets an arrow to that side, a place straight
     ahead gets a rounded board with a triangle pointing up, a place behind gets one with a triangle pointing down.
   - The examine text names the same places and the same points of the compass as the boards. The game has no distances for these roads, so there are none.
   - The pictures are made when the level is loaded; the level's decor entries are changed in place (the same index, so saves are not touched).
   Signs that point to nothing (shop signs, notices, the signs of the Pilgrim's Path that already say TO YARRIM) are left alone.
   ========================================================================== */
const SPT_POSTS=[
  // Greendale Forest (level 32): the three green posts all said the same thing; now each says where it stands. Anaea is through the east gate (63,10), the Old Grove through the cave in the north east (55,3)
  {id:'spt_gd1',lvl:32,npc:'gsign',at:[14,29],f:1,i:0,boards:[{n:'ANAEA',t:[63,10]},{n:'THE OLD GROVE',t:[55,3]}],
    say:w=>`A signpost beside the forest road. The old painted arrows had faded, and somebody has lettered the boards again. One reads ANAEA, to the ${w[0]}. The other reads THE OLD GROVE, to the ${w[1]}, and under it, in different handwriting: "Bring bread for the deer."`},
  {id:'spt_gd2',lvl:32,npc:'gsign',at:[33,13],f:1,i:5,boards:[{n:'ANAEA',t:[63,10]},{n:'THE OLD GROVE',t:[55,3]}],
    say:w=>`A signpost where the track bends. One board reads ANAEA, to the ${w[0]}, with a little carved house on the post above it. The other reads THE OLD GROVE, to the ${w[1]}, and under it, in different handwriting: "Bring bread for the deer."`},
  {id:'spt_gd3',lvl:32,npc:'gsign',at:[56,10],f:1,i:1,boards:[{n:'ANAEA',t:[63,10]},{n:'THE OLD GROVE',t:[55,3]}],
    say:w=>`A signpost close to the east end of the forest. One board reads ANAEA, to the ${w[0]}, and the town gate is only a few steps on. The other reads THE OLD GROVE, to the ${w[1]}, and under it, in different handwriting: "Bring bread for the deer."`},
  // Wenlock (level 496): the post at the west end of High Street, and the two lane posts by the gates of the wood and the churchyard
  {id:'spt_wl1',lvl:496,npc:'wlo_signpost',f:3,i:3,boards:[{n:'THE WESTERN KINGDOMS',v:[-1,0]},{n:'THE GARDENS',v:[1,0]}],
    say:w=>`Two boards on the post at the west end of High Street. One reads THE WESTERN KINGDOMS, to the ${w[0]}, and below it, painted in a wobbly hand, (not yet open). The other reads THE GARDENS, back to the ${w[1]}. Somebody has added: AND GOOD LUCK.`},
  {id:'spt_wl2',lvl:496,npc:'wwo_lanesign',f:0,i:2,boards:[{n:'BLACKBRIAR WOOD',v:[0,-1]}],
    say:w=>`A crooked signpost at the top of Blackbriar Lane. The board reads BLACKBRIAR WOOD, to the ${w[0]}, and somebody has underlined it twice. Below, in a smaller hand: NO CHILDREN. Below that, in a hand much wobblier: that means YOU, Pip. At the very bottom, scratched with a nail: THE GATE IS NOT LOCKED. THAT IS THE WORRYING PART.`},
  {id:'spt_wl3',lvl:496,npc:'gyo_lanesign',f:3,i:4,boards:[{n:'CHURCHYARD LANE',v:[-1,0]}],
    say:w=>`A signpost at the head of the lane. The board reads CHURCHYARD LANE, to the ${w[0]}, and under it: the old churchyard. The gate closes at dusk. Residents let themselves in.`}
];
const SPT_FACE=[[0,-1],[1,0],[0,1],[-1,0]];
/* the eight points of the compass for a step (dx,dy) on the map, where north is up */
function sptCompass(dx,dy){const a=Math.atan2(-dy,dx),k=((Math.round(a/(Math.PI/4))%8)+8)%8;return ['east','north east','north','north west','west','south west','south','south east'][k]}
/* which way a board points for someone facing f: -1 left, 1 right, 0 straight ahead, 2 behind */
function sptWay(f,dx,dy){const L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,F=SPT_FACE[f],fw=ux*F[0]+uy*F[1],rt=ux*-F[1]+uy*F[0];return fw>=.92?0:fw<=-.92?2:rt>0?1:-1}
function sptVec(p,b){return b.t?[b.t[0]-p.at[0],b.t[1]-p.at[1]]:b.v}
/* make the picture and the examine text of one post, once, and return the decor key */
function sptMake(p,at){
  const key=p.id;if(IMG[key])return key;
  const vs=p.boards.map(b=>sptVec(Object.assign({},p,{at}),b));
  IMG[key]=wlnPostPic(p.i,p.boards.map((b,k)=>({n:b.n,d:sptWay(p.f,vs[k][0],vs[k][1])})));
  NPC_H[key]=1.35;
  const words=vs.map(v=>sptCompass(v[0],v[1]));
  khNpc(p.id,'A signpost',key,()=>say(p.say(words),[BYE]));
  p.words=words;p.made=true;
  return key;
}
/* change the decor entries of a level in place, before the level is set up */
function sptPatch(n){
  const todo=SPT_POSTS.filter(p=>p.lvl===n&&!p.patched);if(!todo.length)return;
  if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();
  const L=LEVELS[n];if(!L||!L.decor||!IMG.greensign||!IMG.greensign.width)return;
  const used=new Set();
  for(const p of todo){
    const d=L.decor.find(e=>e.npc===p.npc&&!used.has(e)&&(!p.at||(e.x===p.at[0]&&e.y===p.at[1])));if(!d)continue;
    used.add(d);const at=[d.x,d.y];
    d.k=sptMake(p,at);d.npc=p.id;p.patched=true;p.cell=at;
  }
}
{const _ll=loadLevel;loadLevel=function(n){
  try{sptPatch(n)}catch(e){console.error('sptPatch',e)}
  return _ll.apply(this,arguments)}}
