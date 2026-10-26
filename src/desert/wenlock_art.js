/* ==========================================================================
   WENLOCK: THE PICTURES (prefix wl / WL). Wenlock is an English country market town in the western kingdoms (level 496, houses 7100 to 7199).
   Its own painted pictures are in assets/wl (manifest.json lists them; cut from Gemini sheets by tools/ingest_wl.py) and are loaded as IMG['wl_<name>'].
   Every piece has a fall-back among the older pictures (the Oldhaven walls, roofs and folk), so the town always builds, with or without the new art.
   ========================================================================== */
const WL={ID:496,W:100,H:100,H0:7100,CELLAR:7190,GRANARY:7191,KEY:{}};
const WLART={man:null,loading:null,ready:false};
function wlLoad(){
  if(WLART.loading)return WLART.loading;
  WLART.loading=(async()=>{
    await khLoadAssets();
    try{WLART.man=await (await fetch('assets/wl/manifest.json?v='+VERSION)).json()}catch(e){WLART.man={}}
    await Promise.all(Object.keys(WLART.man).map(k=>loadImg('wl_'+k,'assets/wl/'+WLART.man[k].file)));
    WLART.ready=true;
  })().catch(e=>{console.error('wlLoad',e);WLART.man=WLART.man||{};WLART.ready=true});
  return WLART.loading;
}
const wlHas=k=>!!IMG['wl_'+k];
/* the first picture that exists: new art first, then the older pieces */
function wlPick(...keys){for(const k of keys){if(IMG[k])return k;if(IMG['wl_'+k])return 'wl_'+k}return null}
/* heights (in cells) of everything that stands about */
function wlHeights(){
  Object.assign(NPC_H,{cow:.62,wl_cow:.62,hay:.72,kh_ohgard1_0:1.7,kh_ohgard1_2:2.3,kh_ohgard1_3:.62,kh_ohgard1_4:1.0,kh_ohgard1_5:.95,kh_ohgard2_0:1.15,kh_ohgard2_1:.95,kh_ohgard2_2:1.35,kh_ohgard2_3:.7,kh_ohgard2_4:.75,kh_ohgard2_5:1.1,
    kh_oqdogs_0:.5,kh_oqdogs_1:.62,kh_oqdogs_2:.5,kh_oqdogs_3:.36,kh_oqdogs_4:.46,kh_oqdogs_5:.44,kh_anim1_0:.3,kh_anim1_3:.55,kh_anim1_4:.7,kh_anim1_5:.26,
    kh_stall1_0:1.5,kh_stall1_1:1.5,kh_stall1_2:1.5,kh_stall1_3:1.5,kh_stall1_4:1.5,kh_stall1_5:1.5,kh_stall2_0:.8,kh_stall2_1:.8,kh_stall2_2:.9,kh_stall2_3:.8,kh_oqstuff_0:1.2,kh_oqstuff_1:.4,kh_oqstuff_2:.6,kh_oqstuff_4:.4,kh_oqstuff_6:.3,kh_oqstuff_8:.7,kh_oqstuff_9:.55,kh_oqstuff_10:.6,
    kh_city1_1:1.5,kh_city2_1:1.7,kh_city2_2:.8,kh_city2_3:.9,kh_city2_4:2.4,kh_city2_5:.55,kh_ohtower1_1:3.4,kh_ohtower1_4:3.4,kh_ohtower1_0:3.2,kh_ytree1_0:1.5,kh_fire1_0:.7,kh_fire1_4:1.0,kh_fire1_3:.7,kh_ohprops1_7:.62,kh_cart1_0:.8,
    ltree0:3.4,ltree4:3.6,ltree8:3.3,ltree12:3.5,ltree17:2.4,ltree19:3.1,lbush0:.8,lflora0:.55,lflora0_1:.55,lflora0_2:.55});
  // each person stands about a cell tall
  for(const [pre,n] of [['kh_ohfolk1_',6],['kh_ohfolk2_',6],['kh_ohfolk3_',6],['kh_ohfolk4_',6],['kh_ohfolk5_',6],['kh_ohfolk6_',6],['kh_ohfolk7_',6],['kh_ohsold1_',6],['kh_oqmen_',6]])for(let i=0;i<n;i++)if(NPC_H[pre+i]===undefined)NPC_H[pre+i]=.98;
  for(const [pre,n] of [['kh_yfolk1_',6],['kh_yfolk2_',6],['kh_yfolk3_',6]])for(let i=0;i<n;i++)if(NPC_H[pre+i]===undefined)NPC_H[pre+i]=.82;
  for(const [pre,n] of [['kh_npc1_',7],['kh_npc2_',6],['kh_npc3_',6],['kh_npc4_',6],['kh_npc5_',6],['kh_npc6_',6]])for(let i=0;i<n;i++)if(NPC_H[pre+i]===undefined&&typeof KH_NPC_H!=='undefined'&&KH_NPC_H[pre+i])NPC_H[pre+i]=KH_NPC_H[pre+i];
  Object.assign(NPC_H,{wl_prop1_0:1.9,wl_prop1_1:.8,wl_prop1_2:2.6,wl_prop1_3:1.0,wl_prop1_4:1.7,wl_prop1_5:.95});
  // the new pieces: height by name from the manifest (set by the ingest tool in the "h" field when it is not the default)
  for(const k in (WLART.man||{})){const m=WLART.man[k];if(m.h_cells)NPC_H['wl_'+k]=m.h_cells}
}
/* the roofs of Wenlock: new painted gables first, the Oldhaven ones (tinted) after */
const WL_ROOFS={};
function wlRoofs(){
  if(typeof ohArt==='function')ohArt();
  const R=OH_ROOF,list=(...a)=>a.filter(Boolean);
  const mk=(name,...keys)=>{const k=wlPick(...keys);if(k)WL_ROOFS[name]=k};
  mk('thatch','roof1_0','oh_rf_thatch','kh_yroof3_1');mk('thatch2','roof1_1','kh_yroof3_5','oh_rf_thatch');
  mk('tile','roof1_2','oh_rf_terra2','kh_ohroof1_2');mk('tile2','oh_rf_brown','kh_ohroof1_2');
  mk('slate','roof1_4','kh_ohroof1_1');mk('stone','roof1_3','kh_ohroof1_0');
  mk('moss','roof1_5','oh_rf_moss','kh_ohroof1_3');mk('shingle','kh_ohroof1_4');mk('plum','oh_rf_plum','kh_ohroof1_0');mk('sage','oh_rf_sage','kh_ohroof1_1');mk('blue','kh_ohroof1_1');
  mk('red','kh_ohroof1_2');mk('brown','oh_rf_brown','kh_ohroof1_0');mk('dark','kh_ohroof1_0');
  // more colours of roof, warmed or cooled from the painted ones, so no two neighbours match for long
  const tint=(src,name,rgb,lift)=>{const im=IMG[src];if(!im||IMG[name]){if(IMG[name])WL_ROOFS[name]=name;return}
    IMG[name]=mkCanvas(im.width,im.height,(x,w,h)=>{x.drawImage(im,0,0);x.globalCompositeOperation='multiply';x.fillStyle=`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;x.fillRect(0,0,w,h);
      if(lift){x.globalCompositeOperation='screen';x.fillStyle=`rgba(255,235,200,${lift})`;x.fillRect(0,0,w,h)}x.globalCompositeOperation='destination-in';x.drawImage(im,0,0)});WL_ROOFS[name]=name};
  tint('kh_yroof3_1','wl_rf_thatch3',[225,215,190],.05);tint('kh_yroof3_5','wl_rf_thatch4',[255,240,200],.12);tint('kh_ohroof1_0','wl_rf_honey',[255,225,170],.42);
  tint('kh_ohroof1_2','wl_rf_rose',[255,196,184],.12);tint('kh_ohroof1_4','wl_rf_oak',[255,210,160],.2);tint('kh_ohroof1_1','wl_rf_green',[200,240,215],.1);
}
/* the floors of Wenlock: cobbles, pale paving, lawn, gravel, brook water, meadow (the order of floorSet) */
function wlFloors(){
  if(typeof ohFloors==='function')ohFloors();
  return ['ohCobble','ohPale','ohLawn','ohGravel',FLOORS.bluewater?'bluewater':'ohMoss','ohMeadow'];
}
/* the wall styles: the Oldhaven sheets, and the new English ones when they have been painted */
function wlStyles(){
  if(typeof ohStyles==='function')ohStyles();
  const sheet=(name,n,extra)=>{if(!IMG['wl_'+n+'_0'])return false;OH_STY[name]=Object.assign({plain:'wl_'+n+'_0',alt:'wl_'+n+'_1',win:'wl_'+n+'_2',shop:'wl_'+n+'_3',door:'wl_'+n+'_4',win2:'wl_'+n+'_5',slit:'kh_ohwall1_3'},extra||{});return true};
  OH_STY.wlgrey={plain:'kh_ohwall1_0',alt:'kh_ohwall1_1',win:'kh_ohwall1_4',shop:'kh_ohwall1_4',door:'kh_ohwall1_5',win2:'kh_ohwall1_4',slit:'kh_ohwall1_3',tint:[255,234,200,.14]};
  for(const k of ['timber','golden','brick','cottage'])if(!OH_STY[k])OH_STY[k]=OH_STY.gold;
  WL.sty={timber:'timber',honey:'golden',brick:'brick',white:'cottage',flint:sheet('wlflint','wall1')?'wlflint':'wlgrey',
    black:sheet('wlblack','wall2')?'wlblack':'timber',thatchw:sheet('wlcob','wall3')?'wlcob':'cottage',stone:sheet('wlstone','wall4')?'wlstone':'golden'};
}
