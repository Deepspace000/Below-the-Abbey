/* ==========================================================================
   WENLOCK: THE POLISH (prefix wlp). The town builder (wenlock_town.js) calls wlPolish(C) at the end of wlBuild() with everything it has in hand (rows, tiles, decor, sky...).
   This file runs the finishing passes one after another, each in its own file and each guarded so that one failing pass never stops the town from building:
   glass (wenlock_glass.js), names and numbers (wenlock_names.js), chapel (wenlock_chapel.js), mill (wenlock_mill.js), air (wenlock_air.js), meadows (wenlock_meadow.js).
   It also holds the small global fixes: distant roofs and the waystone in the rooms.
   ========================================================================== */
const WLP_PASSES=[
  ['glass',C=>{wlgChurch(C)}],
  ['walls',C=>{if(typeof wlwPass==='function')wlwPass(C)}],
  ['names',C=>{if(typeof wlnPass==='function')wlnPass(C)}],
  ['chapel',C=>{if(typeof wlcPass==='function')wlcPass(C)}],
  ['mill',C=>{if(typeof wlmPass==='function')wlmPass(C)}],
  ['air',C=>{if(typeof wlaPass==='function')wlaPass(C)}],
  ['meadow',C=>{if(typeof wlePass==='function')wlePass(C)}]
];
function wlPolish(C){for(const [n,f] of WLP_PASSES){try{f(C)}catch(e){console.error('wlPolish '+n,e)}}}
/* distant roofs: a house roof is drawn out to forty squares, but the walls under it only out to the fog, so far houses floated as bare roofs. Roofs are kept only as far as walls are drawn. */
{const _k=khSkyList;khSkyList=function(cx,cy,dX,dY,L,md){const out=_k.apply(this,arguments);if(LEVEL!==496||typeof RANGE==='undefined'||!RANGE)return out;const r2=(RANGE+1.5)*(RANGE+1.5);
  return out.filter(s=>!s.smallSky||((s.x-cx)*(s.x-cx)+(s.y-cy)*(s.y-cy))<=r2)}}
/* the waystone: every room has one in a corner, which looked like a stray post. In a Wenlock room it is a plain wooden bench (it still wakes and still works, T to travel). */
{const _pt=placeTeleporter;placeTeleporter=function(){const r=_pt.apply(this,arguments);
  try{if(LEVEL>=WL.H0&&LEVEL<=WL.H0+99&&G.tele){const d=G.decor.find(q=>q.tele&&q.k==='teleporter');if(d){d.k='kh_ohgard1_3';d.sc=1.1;d.deco=true;NPC_H.kh_ohgard1_3=NPC_H.kh_ohgard1_3||.62}}}catch(e){console.error(e)}
  return r}}
/* ---- the rooms: touch-ups to the room data of wenlock_in.js ---- */
{const R=WLIN_ROOMS;
  // the widow's parlour: the right wall was bare
  R.home_spartan.props.push(['dresser',7,3,{h:.85}],['tapestry',7,5,{h:.8}]);
  // the smithy: the right wall was bare, and now has racks of tongs and blades
  R.forge.props.push(['hangstand',11,3,{h:1.1}],['weaponrack',11,7,{h:.95}],['shopcounter',9,7,{h:.55}]);R.forge.raw.push(['crate',11,6]);
  // the inn cellar and the old granary: a few more lights, and two hanging candle rings in the cellar
  R.cellar.amb=.46;R.cellar.lights=[[2,2],[12,2],[7,6],[3,8],[11,8],[1,5],[13,5],[7,2],[4,4],[10,4]];R.cellar.props.push(['chandelier',4,5,{free:1}],['chandelier',10,5,{free:1}]);
  R.granary.amb=.48;R.granary.lights=[[2,2],[10,2],[6,5],[2,7],[10,7],[6,2]];
}
/* the pets of the cottages: the same cat on the same cushion was in a dozen rooms; now each cottage picks its household from a longer list by its number */
for(const [id,n,face,lines,o] of [
  ['wli_home_parrot','A parrot in a cage','pet_parrot_0',["Hello. Hello. Hello. (It has said this forty times and it is still pleased.)","Pretty boy. (It is not clear who it is talking to. It is looking at the dog.)"],{sc:.9}],
  ['wli_home_dove','A pet dove','kh_anim1_5',["Coo. (She sits on the back of the chair and watches the room go by.)","Coo, coo. (She has been tame since she fell out of a nest in the spring.)"],{sc:.85}],
  ['wli_home_goat','A house goat','kh_anim1_3',["Maaa. (She is allowed in the kitchen. Nobody remembers agreeing to this.)","Maaa. (She has eaten the end of a rug and is now eating the other end, for balance.)"],{sc:.7}],
  ['wli_home_duck','A duck by the hearth','pet_duck_0',["Quack. (She has settled in front of the fire as if she paid the rent.)","Quack. (She has decided this house is hers and is walking round it to make the point.)"],{sc:.75}]]){
  khNpc(id,n,face,()=>yrLines(id,lines),o)}
{const _wb=wlinBuild;wlinBuild=function(D,name,b,C){
  if(/^home_/.test(name)&&D&&D.folk){const k=+String(b&&b.id||'').replace(/\D/g,'')||0,r=hash2(k,5,91);
    const catAlt=['wli_home_cat','wli_home_cat','wli_home_dog','wli_home_parrot','wli_home_dove','wli_home_goat','wli_home_duck','wli_home_cat'],dogAlt=['wli_home_dog','wli_home_dog','wli_home_cat','wli_home_goat','wli_home_duck','wli_home_dog'];
    if(name!=='home_cats'&&name!=='home_children'){
      D=Object.assign({},D,{folk:D.folk.map(f=>f[0]==='wli_home_cat'?[catAlt[(r*catAlt.length)|0]].concat(f.slice(1)):f[0]==='wli_home_dog'?[dogAlt[(hash2(k,6,92)*dogAlt.length)|0]].concat(f.slice(1)):f)})}}
  const out=_wb.call(this,D,name,b,C);
  // a rolled carpet or a plant in a corner, now and then
  try{if(/^home_/.test(name)){const k=+String(b&&b.id||'').replace(/\D/g,'')||0,w=D.w||9,h=D.h||7;
    const spots=[[1,h-2],[w-2,h-2],[1,3],[w-2,3]],pick=spots[(hash2(k,7,93)*spots.length)|0],r2=hash2(k,8,94);
    if(!C.has(pick[0],pick[1])){if(r2<.35)C.put('rolledcarpets',pick[0],pick[1]);else if(r2<.7&&IMG.flowerpot)C.raw('flowerpot',pick[0],pick[1],{sc:1})}}}catch(e){console.error(e)}
  return out}}
