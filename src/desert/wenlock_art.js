/* ==========================================================================
   WENLOCK: THE PICTURES (prefix wl / WL). Wenlock is an English country market town in the western kingdoms (level 496, houses 7000 to 7099).
   Its own painted pictures are in assets/wl (manifest.json lists them; cut from Gemini sheets by tools/ingest_wl.py) and are loaded as IMG['wl_<name>'].
   Every piece has a fall-back among the older pictures (the Oldhaven walls, roofs and folk), so the town always builds, with or without the new art.
   ========================================================================== */
const WL={ID:496,W:100,H:100,H0:7000,CELLAR:7090,GRANARY:7091,KEY:{}};
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
  Object.assign(NPC_H,{cow:.62,wl_cow:.62,hay:.72,kh_ohgard1_0:1.7,kh_ohgard1_2:2.3,kh_ohgard1_3:.5,kh_ohgard1_4:1.0,kh_ohgard1_5:.95,kh_ohgard2_0:1.15,kh_ohgard2_1:.95,kh_ohgard2_2:1.35,kh_ohgard2_3:.7,kh_ohgard2_4:.75,kh_ohgard2_5:1.1,
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
  // painted-quality ground: the thin seams and dither of the old tiles broke up into dots at a distance, so the paving is softened, the lane is packed earth with grass in it, the water is a rippled green-grey pond
  const blur=(src,r)=>{const n=2*r+1,t=new Uint8ClampedArray(src.length),o=new Uint8ClampedArray(src.length);
    for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){let R=0,G=0,B=0;for(let k=-r;k<=r;k++){const i=(y*TS+((x+k+TS)%TS))*4;R+=src[i];G+=src[i+1];B+=src[i+2]}const j=(y*TS+x)*4;t[j]=R/n;t[j+1]=G/n;t[j+2]=B/n}
    for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){let R=0,G=0,B=0;for(let k=-r;k<=r;k++){const i=(((y+k+TS)%TS)*TS+x)*4;R+=t[i];G+=t[i+1];B+=t[i+2]}const j=(y*TS+x)*4;o[j]=R/n;o[j+1]=G/n;o[j+2]=B/n;o[j+3]=255}
    return o};
  const mix=(a,b,f)=>{const d=new Uint8ClampedArray(a.length);for(let i=0;i<a.length;i+=4){const k=typeof f==='function'?f((i>>2)%TS,((i>>2)/TS)|0):f;d[i]=a[i]*(1-k)+b[i]*k;d[i+1]=a[i+1]*(1-k)+b[i+1]*k;d[i+2]=a[i+2]*(1-k)+b[i+2]*k;d[i+3]=255}return d};
  const mul=(a,m)=>{const d=new Uint8ClampedArray(a.length);for(let i=0;i<a.length;i+=4){d[i]=a[i]*m[0];d[i+1]=a[i+1]*m[1];d[i+2]=a[i+2]*m[2];d[i+3]=255}return d};
  if(!FLOORS.wlPale&&FLOORS.ohPale)FLOORS.wlPale=mul(mix(FLOORS.ohPale,blur(FLOORS.ohPale,3),.93),[.97,.93,.86]);
  if(!FLOORS.wlEarth&&FLOORS.ohGravel&&FLOORS.ohLawn){const gb=blur(FLOORS.ohGravel,2),lb=blur(FLOORS.ohLawn,3);
    FLOORS.wlEarth=mul(mix(gb,lb,(x,y)=>Math.max(0,Math.min(.85,dsNoise(x,y,8,771)*2.2-.75))),[1,.94,.84])}
  if(!FLOORS.wlMeadow&&FLOORS.ohLawn&&FLOORS.ohMeadow)FLOORS.wlMeadow=mix(FLOORS.ohLawn,blur(FLOORS.ohMeadow,1),(x,y)=>.3+.5*dsNoise(x,y,3,772));
  if(!FLOORS.wlWater)FLOORS.wlWater=dsFloor((x,y)=>{const n=dsNoise(x,y,4,331),m=dsNoise(x,y,8,332),r=Math.sin(TAU*(1*x/TS+3*y/TS+n*1.4))*.5+.5,k=.98+.26*r+.3*(m-.5);return [70*k+14,104*k+16,104*k+10]});
  return ['ohCobble',FLOORS.wlPale?'wlPale':'ohPale','ohLawn',FLOORS.wlEarth?'wlEarth':'ohGravel',FLOORS.wlWater?'wlWater':(FLOORS.bluewater?'bluewater':'ohMoss'),FLOORS.wlMeadow?'wlMeadow':'ohMeadow'];
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
