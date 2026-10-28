/* ==========================================================================
   SALE: THE LOOK (prefix sa / SA). Pictures, creatures, items, weather and the way the town loads.
   Sale reuses what is already painted: Wenlock's walls, roofs and folk (assets/wl, wl2), the graveyard's undead, ghosts, dead trees, lanterns, gothic fronts and brick (assets/gy, gy2),
   and adds only what the painted set lacks, in assets/sa (manifest.json): the barricade, the gibbet and the dead fountain. Each piece has a stand-in until its sheet is cut.
   The look: cold dusk, low fog (weatherNow), dark roofs, grey and black stone, ghosts made from the painted townsfolk (pale, see-through, fading at the feet).
   ========================================================================== */
const SA_ART={man:null};
/* the painted pieces of Sale itself, loaded as IMG['sa_<name>'] (assets/sa/manifest.json: name -> {file, h_cells}); none yet is fine */
async function saLoadOwn(){
  try{SA_ART.man=await (await fetch('assets/sa/manifest.json?v='+VERSION)).json()}catch(e){SA_ART.man={}}
  await Promise.all(Object.keys(SA_ART.man||{}).map(k=>loadImg('sa_'+k,'assets/sa/'+SA_ART.man[k].file)));
}
function saLoad(){
  if(SA.loading)return SA.loading;
  SA.loading=(async()=>{
    await wlLoad();
    await gyLoad();
    await saLoadOwn();
    saPrep();
    SA.ready=true;
  })().catch(e=>{console.error('saLoad',e);SA.ready=true});
  return SA.loading}
/* a ghost: a painted townsperson made pale and see-through, fading out towards the feet */
function saGhost(src,key,tone){
  const im=IMG[src];if(!im||!im.width||IMG[key])return;
  /* the painted person is kept (face, clothes, folds) and drained of colour, then given a cold blue light, a pale glow round the edge and a fade at the feet */
  IMG[key]=mkCanvas(im.width,im.height,(x,w,h)=>{
    const t=document.createElement('canvas');t.width=w;t.height=h;const tx=t.getContext('2d');
    try{tx.filter='grayscale(1) contrast(1.25) brightness(1.18)'}catch(e){}tx.drawImage(im,0,0);tx.filter='none';
    tx.globalCompositeOperation='source-atop';tx.fillStyle=tone||'rgba(120,170,230,.42)';tx.fillRect(0,0,w,h);
    try{x.shadowColor='rgba(150,200,255,.75)';x.shadowBlur=Math.max(4,w*.05)}catch(e){}
    x.globalAlpha=.78;x.drawImage(t,0,0);x.shadowBlur=0;x.globalAlpha=1;
    x.globalCompositeOperation='destination-in';const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(0,0,0,.82)');g.addColorStop(.55,'rgba(0,0,0,.6)');g.addColorStop(.85,'rgba(0,0,0,.28)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,w,h)});
  NPC_H[key]=NPC_H[src]||.98}
const SA_GHOSTFOLK=['kh_ohfolk1_0','kh_ohfolk1_2','kh_ohfolk2_0','kh_ohfolk2_5','kh_ohfolk3_3','kh_ohfolk4_0','kh_ohfolk4_3','kh_ohfolk5_2','kh_ohfolk6_0','kh_ohsold1_1','kh_oqmen_1','kh_ohfolk3_0'];
/* the stone of Sale: the painted Oldhaven walls, cooled and darkened (a style per look) */
const SA_STYLES={sa_slate:[150,156,172,0],sa_moss:[148,168,146,0],sa_black:[108,110,124,0],sa_bone:[206,200,186,.04],sa_brick:[184,142,134,0],sa_ash:[168,166,164,0]};
function saRoofs(){
  const mk=(name,src,rgb)=>{const im=IMG[src];if(!im||!im.width)return;if(IMG[name]){WL_ROOFS[name]=name;return}
    IMG[name]=mkCanvas(im.width,im.height,(x,w,h)=>{x.drawImage(im,0,0);x.globalCompositeOperation='multiply';x.fillStyle='rgb('+rgb.join(',')+')';x.fillRect(0,0,w,h);x.globalCompositeOperation='destination-in';x.drawImage(im,0,0)});WL_ROOFS[name]=name};
  const base=k=>WL_ROOFS[k]||'kh_ohroof1_0';
  mk('sa_rf_1',base('slate'),[150,152,170]);mk('sa_rf_2',base('stone'),[140,144,150]);mk('sa_rf_3',base('moss'),[150,170,150]);mk('sa_rf_4',base('dark'),[160,150,160]);mk('sa_rf_5',base('plum'),[150,125,150]);
  mk('sa_rf_6',base('tile'),[150,112,106]);mk('sa_rf_7',base('tile2'),[136,118,112]);mk('sa_rf_8',base('thatch'),[130,124,110]);mk('sa_rf_9',base('shingle'),[130,122,126]);
}
const SA_ROOFSET=['sa_rf_1','sa_rf_2','sa_rf_3','sa_rf_4','sa_rf_5','sa_rf_6','sa_rf_7','sa_rf_8','sa_rf_9'];
function saFloors(){
  gyAlias();
  const t=(out,src,g,c)=>gyFloorTone(out,src,g,c);t('gyf_cflag','gyf_flag',.46,[.88,.92,1]);
  t('sa_cobble','gyf_cobble',.62,[.9,.95,1.06]);t('sa_flag','gyf_flag',.52,[.9,.94,1.06]);t('sa_dead','gyf_dirt',.5,[.92,.98,.86]);t('sa_earth','gyf_dirt',.66,[1,.92,.84]);
  t('sa_dry','gyf_grass',.42,[1.05,.92,.5]);t('sa_mire','gyf_dirt',.34,[.8,.95,.9]);
  return ['sa_cobble','sa_flag','sa_dead','sa_earth','sa_mire','sa_dry']}
function saPrep(){
  wlHeights();wlRoofs();wlStyles();gyAlias();saRoofs();
  for(const k in SA_STYLES){const t=SA_STYLES[k];OH_STY[k]={plain:'kh_ohwall1_0',alt:'kh_ohwall1_1',win:'kh_ohwall1_4',shop:'kh_ohwall1_4',door:'kh_ohwall1_5',win2:'kh_ohwall1_4',slit:'kh_ohwall1_3',tint:t,zoom:1.5,contrast:1.7}}
  SA_GHOSTFOLK.forEach((s,i)=>saGhost(s,'sa_gh_'+i));
  for(const i of [0,1,2]){if(IMG['gyp_ghost_'+i])NPC_H['sa_gl_'+i]=1.1}
  // the stand-ins for the pieces that are painted later: a boarded door is the iron fence, the gibbet and the dead fountain are the wooden post and a tall stone
  const alias=(k,srcs,h)=>{if(IMG['sa_'+k]){NPC_H['sa_'+k]=NPC_H['sa_'+k]||(SA_ART.man&&SA_ART.man[k]&&SA_ART.man[k].h_cells)||h;return}for(const s of srcs)if(IMG[s]){IMG['sa_'+k]=IMG[s];NPC_H['sa_'+k]=h;return}};
  for(const i of [0,1,2]){if(!IMG['sa_planks'+i]){IMG['sa_planks'+i]=mkCanvas(8,8,()=>{});NPC_H['sa_planks'+i]=.5}} // the planks are painted on the door tile itself; this invisible piece only carries the keeper's voice and the quest mark
// the pieces that were stand-ins are made from the painted props that exist, darkened and mossed by a filter (nothing drawn): the gibbet is the hanging cage, the dead fountain the stone fountain gone green, the plague cart the covered cart gone grey
  const grade=(k,src,filter,h)=>{if(IMG['sa_'+k]&&SA_ART.man&&SA_ART.man[k])return;const im=IMG[src];if(!im||!im.width)return false;
    IMG['sa_'+k]=mkCanvas(im.width,im.height,(x)=>{try{x.filter=filter}catch(e){}x.drawImage(im,0,0)});NPC_H['sa_'+k]=h;return true};
  grade('gibbet','hl_p_cage','brightness(.5) saturate(.55) sepia(.45) contrast(1.1)',2.0)||alias('gibbet',['gy_rpost'],2.4);
  grade('fountain','fountain','brightness(.62) saturate(.7) hue-rotate(38deg) contrast(1.08)',1.05)||alias('fountain',['gy_urn'],1.5);
  grade('cart','cart','brightness(.5) saturate(.35) sepia(.3) contrast(1.1)',.95)||alias('cart',['kh_cart1_0'],.9);
  // a dead well and a heap of coffins for the lanes (the same filter again)
  grade('well','well','brightness(.55) saturate(.4) hue-rotate(30deg)',.85);grade('coffins','gy_coffin','brightness(.6) saturate(.5) sepia(.3)',1.1);
}
/* ---- the dead (the graveyard's creatures under Sale's own names; none of them is a boss) ---- */
{const cl=(base,o)=>Object.assign({},ENEMY_DEF[base],{gy:undefined,sa:1},o);
 Object.assign(ENEMY_DEF,{
  saskel:cl('gyskel',{name:'Gaunt Skeleton'}),sapike:cl('gypike',{name:'Pikeman of the Watch'}),sabmage:cl('gybmage',{name:'Bone Priest'}),
  saghoul:cl('gyghoul',{name:'Sale Ghoul'}),sazombie:cl('gyzombie',{name:'Plague Zombie'}),sagiant:cl('gygiant',{name:'Bloated Gravedigger'}),
  sawight:cl('gywraith',{name:'Wight of Sale'}),saranulf:cl('gyaldric',{name:'Sir Ranulf the Hollow',hp:230,dmg:[8,13],hit:.9,xp:200,boss:undefined,gyb:undefined,verb:'cleaves',act:undefined,w:gyW('boss_2',1.4),sa:1,named:1})});
 for(const t of ['saskel','sapike','sabmage','saghoul','sazombie','sagiant','sawight','saranulf'])if(ENEMY_DEF[t].gyb!==undefined)delete ENEMY_DEF[t].gyb;
 if(typeof NO_VARY!=='undefined')NO_VARY.push('saranulf');if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('saranulf');
 if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^saghoul/,'tomblung',.2],[/^sazombie/,'foodpoison',.2],[/^sagiant/,'foodpoison',.2],[/^sawight/,'shaken',.2],[/^saranulf/,'shaken',.2],[/^saskel|^sapike/,'graverot',.12])}
/* ---- the things the party carries for the ten trust quests ---- */
Object.assign(ITEMDEF,{
  sa_oil:{n:'Flask of Lamp Oil',k:'quest',t:'Quest item',ic:'lantern',c:'#d8b050',stack:1,price:0,sw:.3,d:'A stoppered clay flask of lamp oil, sealed with wax, left in a cupboard in the dead quarter of Sale. Somebody has scratched P on the base. It belongs to Pennyworth\'s Provisions.'},
  sa_flour:{n:'Sack of Rye Flour',k:'quest',t:'Quest item',ic:'ore',c:'#d8cba0',stack:1,price:0,sw:.8,d:'A small sack of rye flour from the mill at Hollin Farm, still dry, still good, and stamped with a wheatsheaf. The baker will know it.'},
  sa_sign:{n:'The Gilded Eye',k:'quest',t:'Quest item',ic:'amulet',c:'#e0b850',stack:1,price:0,sw:.5,d:'A carved and gilded shop sign in the shape of an eye, taken down from the jeweller\'s door by something with long fingers and hung in a ruined farm. The gilt is scratched, the eye is still bright.'},
  sa_gravesalt:{n:'Grave-Salt',k:'quest',t:'Quest item',ic:'ore',c:'#e8e8f0',stack:1,price:0,sw:.3,d:'A fist of white crystals found in the Sale Crypt where the walls sweat. The alchemist wants it more than gold. It is cold, and your fingers go numb if you hold it too long.'},
  sa_letter:{n:"The Scrivener's Letter",k:'quest',t:'Quest item',ic:'book',c:'#e8dcc0',stack:1,price:0,sw:.05,d:'A letter folded in thirds, sealed with black wax and addressed in a careful hand to the bellman of Sale. It is damp.'},
  sa_reply:{n:"The Bellman's Reply",k:'quest',t:'Quest item',ic:'book',c:'#cfc4a8',stack:1,price:0,sw:.05,d:'A scrap of paper with three words on it, written with a shaking hand. The bellman has signed it with a drawing of a bell.'}});
/* ---- the look: cold fog and dusk over the streets; the cellars, crypt and belfry keep their own dark ---- */
{const _w=weatherNow;weatherNow=function(){
  if(LEVEL===SA.ID)return {id:'fog',n:'Grave fog',fog:.03,haze:.6,dark:.55,mix:.55,col:[150,160,184],text:'A cold grey fog lies in the streets of Sale. A bell tolls somewhere, a long way off, and nobody is ringing it.'};
  if(saIs(LEVEL))return null;
  return _w.apply(this,arguments)}}
/* ---- arrival: the pictures first, then the level; every id of Sale builds when asked for ---- */
{const _g=goToLevel;goToLevel=function(n,entry){
  if(saIs(n)&&!SA.ready&&!SA._wait){SA._wait=1;try{msg('Fog, and the toll of a far bell...','#a8b8d8')}catch(e){}saLoad().then(()=>{SA._wait=0;goToLevel(n,entry)}).catch(()=>{SA._wait=0});return}
  if(saIs(n)&&!LEVELS[n]&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error('sale build',e)}
  if(saIs(n)&&!LEVELS[n]){try{sfx('locked');msg('The door is locked. Nobody answers.','#d09a80')}catch(e){}return}
  const r=_g.apply(this,arguments);
  if(saIs(n)){try{saArrive(n)}catch(e){console.error('saArrive',e)}}
  return r}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(saIs(n)&&!SA.ready&&!SA._wait){SA._wait=1;saLoad().then(()=>{SA._wait=0;jumpToLevel(n,target)});return}
  return _j.apply(this,arguments)}}
{const _r=restore;restore=function(sv){
  const l=sv&&sv.level;
  if(saIs(l)&&!SA.ready&&!SA._wait){SA._wait=1;saLoad().then(()=>{SA._wait=0;if(!LEVELS[l]&&KH_LAZY[l])try{KH_LAZY[l]()}catch(e){console.error(e)}restore(sv)});return}
  return _r.apply(this,arguments)}}
{const _rn=restoreNow;restoreNow=function(sv){const r=_rn.apply(this,arguments);try{if(saIs(LEVEL))saArrive(LEVEL)}catch(e){console.error('sale restore',e)}return r}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||saIs(n)}}
