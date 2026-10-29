/* ==========================================================================
   THE PALE SPIRE, PACKAGE 3: THE GREAT HALLS (level 9740, 64 by 48, rating 101; prefix psh / PSH). REDESIGN: a chain of tall rooms, not one hall: Entrance Hall, Great Nave (columns every two squares, aisles), Gallery of Portraits, Dining Hall, Music Salon, Lady's Withdrawing Room (rest),
   Screens Passage, Minstrels' Gallery and Lower Vault (narrow stairs), Banqueting Hall, Trophy and Hunting Hall (Antlered Lord), Hall of Statues, Winter Bay, Grand Stair Hall (Stair Warden). Palette: black weathered stone, verdigris green, sickly green-white light.
   Self contained: its own floor maker (pshBuild), wall tiles drawn in code from the graveyard's painted stone, stand-in pictures (made from existing pieces; painted pieces 'ps_<name>' win when they exist).
   Contract: tools/PALE_SPIRE_PLAN.md and src/desert/ps_ids.js (link squares are read from PSP.LINKS). Notes: tools/PALE_SPIRE_NOTES.md.
   ========================================================================== */
const PSH={ID:9740,W:64,H:48,WH:3.2,ready:false,_wait:0};
const pshIs=n=>n===9740;
const pshF=()=>{const F=G.flags;return F.psp||(F.psp={})};
const PSH_COL={cold:[.66,.98,1.22],violet:[.5,.78,1.18],warm:[1.5,1.05,.55],gold:[1.15,.9,.55]};
/* ---------- new names (owner request 31 Oct 2026): black gothic carved furniture, long banners, ghosts. Painted pieces assets/ps/<name>.webp replace the stand-ins with no code change. [name, stand-in source, height in cells] ---------- */
const PSH_FURN=[['furn_sideboard','hl_p_desk',1.5],['furn_organ','hl_p_shelf',3.0],['furn_chair_high','ds_hgtb_chair',2.1],['furn_fireplace_tall','ds_hgtb_furn_hearth',2.8],['furn_wardrobe','hl_p_shelf',2.5],['furn_cradle','hl_p_coffin',.9],
  ['furn_bed_canopy','ds_hgtb_furn_bed',2.6],['furn_bookcase','hl_p_shelf',2.4],['furn_desk','hl_p_desk',1.2],['furn_screen_tracery','gy_fence',1.9],['furn_pulpit','hl_p_lectern',1.9],['furn_altarpiece','hl_p_alcove',3.0],['furn_throne_black','hl_p_throne',2.4],
  ['furn_table_long_black','hl_p_feast',1.0],['furn_chair_dining_black','ds_hgtb_chair',1.3],['furn_harpsichord_black','hl_p_desk',1.3],['furn_candelabra_black','ds_hpb_candelabra_6',1.7],['furn_clock_grandfather','hl_p_shelf',2.3],
  ['furn_mirror_gothic','hl_p_mirror',2.2],['furn_pew_black','gy_bench',1.1],['furn_lectern_black','hl_p_lectern',1.5]];
/* ghost pictures: [name, sources (first that exists), height, filter]; translucent cold figures made from existing ghost sprites until the art agent paints p_ghost_* / ghost_* */
const PSH_GPICS=[['p_ghost_lady',['gyp_ghost_1'],1.8],['p_ghost_monk',['gyp_ghost_0'],1.8],['p_ghost_child',['gyp_ghost_0'],1.05],['p_ghost_maid',['gyp_ghost_2'],1.7],['p_ghost_servant',['gyp_ghost_0'],1.7],
  ['p_ghost_coachman',['gyp_ghost_2'],1.75],['p_ghost_diner',['gyp_ghost_1'],1.5],['p_ghost_hunter',['gyp_ghost_2'],1.85],['p_ghost_sculptor',['gyp_ghost_0'],1.75],['p_ghost_choir',['gyp_ghost_0'],1.2],
  ['p_ghost_bride',['gyp_ghost_1'],1.85],['p_ghost_prisoner',['gyp_ghost_0'],1.7],['p_ghost_officer',['gyp_ghost_2'],1.9],['ghost_hound',['gyp_crB_4','gyi_hound'],.9],['ghost_couple',['gyp_ghost_1'],1.85],['ghost_wraith',['gyp_ghost_0'],2.0]];
/* named hauntings to the painted p_ghost_* pieces (butler child dancer gentleman lady maid priest soldier) */
const PSH_GMAP=[['p_ghost_monk','priest'],['p_ghost_servant','butler'],['p_ghost_coachman','gentleman'],['p_ghost_diner','gentleman'],['p_ghost_hunter','soldier'],['p_ghost_sculptor','butler'],['p_ghost_choir','child'],['p_ghost_bride','lady'],['p_ghost_prisoner','soldier'],['p_ghost_officer','soldier']];
for(const [n,src,h] of PSH_FURN)PSP_PICS[n]=[h,[src],{dark:1}];
for(const [n,src,h] of PSH_GPICS)PSP_PICS[n]=[h,src,{ghost:1}];
if(!PSP_PICS.window_stained_tall)PSP_PICS.window_stained_tall=[3.4,['hl_p_window'],{}];
PSP_PICS.banner_long_a=[3.0,['hl_p_banner'],{}];PSP_PICS.banner_long_b=[3.0,['hl_p_banner'],{}];PSP_PICS.tex_vault_ribbed=[1,['gy_slab'],{}];
/* ---------- loading: the graveyard's stone, the Oldhaven people, and the few extra stand-in pictures ---------- */
const PSH_EXTRA=[['ds_wm_statue','ds_wm_statue.png'],['ds_hgtb_furn_chandelier','ds_hgtb_furn_chandelier.png'],['ds_hgtb_table','ds_hgtb_table.png'],['ds_hgtb_chair','ds_hgtb_chair.png'],['ds_hgtb_furn_hearth','ds_hgtb_furn_hearth.png'],
  ['ds_hgtb_furn_bed','ds_hgtb_furn_bed.png'],['ds_hpb_candelabra_4','ds_hpb_candelabra_4.png'],['ds_hpb_candelabra_6','ds_hpb_candelabra_6.png'],['ds_wm_candelabra','ds_wm_candelabra.png'],['ds_wm_crystal_pillar','ds_wm_crystal_pillar.png'],
  ['ds_w_candleknight','ds_w_candleknight.png'],['ds_w_glassstag','ds_w_glassstag.png'],['cr_stag','cr_stag.png'],['hl_pt3','hl_pt3.png'],['hl_pt4','hl_pt4.png'],['hl_pt5','hl_pt5.png'],['ds_dsutstatue','ds_dsutstatue.png'],['ds_dsphinx','ds_dsphinx.png'],
  ['hl_p_cage','hl_p_cage.png'],['guard','guard.png'],['ds_hgtb_furn_stage','ds_hgtb_furn_stage.png'],['hl_p_chains','hl_p_chains.png'],['hl_p_tomb','hl_p_tomb.png'],['hl_p_coffin','hl_p_coffin.png']];
async function pshLoadOwn(){
  await Promise.all(PSH_EXTRA.filter(a=>!IMG[a[0]]).map(a=>loadImg(a[0],'assets/'+a[1]).catch(()=>0)));
  try{if(!PSH.man)PSH.man=await (await fetch('assets/ps/manifest.json?v='+VERSION)).json()}catch(e){PSH.man={}}
  await Promise.all(Object.keys(PSH.man||{}).filter(k=>!IMG['ps_'+k]||IMG['ps_'+k]._ps).map(k=>loadImg('ps_'+k,'assets/ps/'+(PSH.man[k].file||k+'.png')).then(()=>{if(IMG['ps_'+k]&&PSH.man[k].h)NPC_H['ps_'+k]=PSH.man[k].h}).catch(()=>0)))}
function pshLoad(){
  if(PSH.loading)return PSH.loading;
  PSH.loading=Promise.all([gyLoad(),typeof khLoadAssets==='function'?khLoadAssets():0,pshLoadOwn()]).then(()=>{try{gyAlias();pshPics()}catch(e){console.error('pshLoad',e)}PSH.ready=true}).catch(e=>{console.error('pshLoad',e);PSH.ready=true});
  return PSH.loading}
{const _g=goToLevel;goToLevel=function(n,entry){
  if(pshIs(n)&&!PSH.ready){if(!PSH._wait){PSH._wait=1;pshLoad().then(()=>{PSH._wait=0;goToLevel(n,entry)})}return}
  if(pshIs(n)&&LEVELS[n]===undefined&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error(e)}
  const r=_g.call(this,n,entry);
  try{if(pshIs(n))pshArrive(n)}catch(e){console.error('pshArrive',e)}
  return r}}
{const _r=restore;restore=function(sv){
  if(sv&&pshIs(sv.level)&&!PSH.ready){if(!PSH._wait){PSH._wait=1;pshLoad().then(()=>{PSH._wait=0;restore(sv)})}return}
  return _r.apply(this,arguments)}}
{const _rn=restoreNow;restoreNow=function(sv){const r=_rn.apply(this,arguments);try{if(pshIs(LEVEL))pshArrive(LEVEL)}catch(e){console.error('psh restore',e)}return r}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||pshIs(n)}}
{const _w=weatherNow;weatherNow=function(){if(pshIs(LEVEL))return null;return _w.apply(this,arguments)}}
if(typeof WIND_AMT!=='undefined')WIND_AMT[9740]=.02;
/* lights: every lamp of the halls takes its own colour (cold silver, violet, warm only in the rest room) */
{const _sl=setupLights;setupLights=function(){const r=_sl.apply(this,arguments);
  try{if(pshIs(LEVEL)){const L=LEVELS[LEVEL],V=L&&L._psh;if(V)for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y),c=V.lcol[key];l.col=c||V.col;l.kI=V.kI[key]||1.35;l.range2=V.r2[key]||115;l.calm=true}}}catch(e){console.error('psh lights',e)}
  return r}}
/* ---------- pictures: tailored stand-ins under the names the plan fixed (ps_<name>); a painted piece from assets/ps replaces them with no code change ---------- */
function pshCv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function pshFilt(src,filter,flip){const im=typeof src==='string'?IMG[src]:src;if(!im||!im.width)return null;const c=pshCv(im.width,im.height),x=c.getContext('2d');try{x.filter=filter||'none'}catch(e){}
  if(flip){x.translate(c.width,0);x.scale(-1,1)}x.drawImage(im,0,0);x.setTransform(1,0,0,1,0,0);x.filter='none';return c}
function pshSet(name,cv,h){const k='ps_'+name;if(!cv)return false;if(IMG[k]&&!IMG[k]._ps)return false;cv._ps=1;IMG[k]=cv;NPC_H[k]=h;return true}
/* a gold frame round a picture (the frame is the only part drawn in code; the painted content inside is an existing picture) */
function pshFrame(inner,w,h,o){o=o||{};const t=Math.round(Math.min(w,h)*.085)+4,c=pshCv(w+t*2,h+t*2),x=c.getContext('2d'),W=c.width,H=c.height;
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#f0d890');g.addColorStop(.3,'#a07828');g.addColorStop(.55,'#e4c870');g.addColorStop(.8,'#8a6420');g.addColorStop(1,'#d8b860');
  x.fillStyle=g;x.fillRect(0,0,W,H);x.strokeStyle='rgba(60,36,8,.85)';x.lineWidth=2;x.strokeRect(1,1,W-2,H-2);x.strokeRect(t-1.5,t-1.5,W-2*t+3,H-2*t+3);
  x.strokeStyle='rgba(255,236,170,.7)';x.lineWidth=1.2;x.strokeRect(t*.45,t*.45,W-t*.9,H-t*.9);
  x.fillStyle='#e8d080';for(const [px,py] of [[t*.5,t*.5],[W-t*.5,t*.5],[t*.5,H-t*.5],[W-t*.5,H-t*.5],[W/2,t*.5],[W/2,H-t*.5]]){x.beginPath();x.arc(px,py,t*.28,0,6.3);x.fill();x.strokeStyle='rgba(60,36,8,.8)';x.lineWidth=1;x.stroke()}
  x.fillStyle=o.bg||'#14101c';x.fillRect(t,t,w,h);
  if(inner){x.save();x.beginPath();x.rect(t,t,w,h);x.clip();if(typeof inner==='function')inner(x,t,t,w,h);else x.drawImage(inner,t,t,w,h);x.restore()}
  x.fillStyle='rgba(20,10,30,.18)';x.fillRect(t,t,w,h);x.strokeStyle='rgba(0,0,0,.55)';x.lineWidth=3;x.strokeRect(t+1.5,t+1.5,w-3,h-3);return c}
const PSH_POOL=['hl_pt0','hl_pt1','hl_pt2','hl_pt3','hl_pt4','hl_pt5'];
function pshPortrait(i){ // the i-th stand-in portrait: six painted ones, flipped and re-coloured so that no two neighbours match
  const src=PSH_POOL[i%6],hue=[0,25,-30,60,-60,110,150,-100][((i/6)|0)%8],flip=((i/3)|0)%2===1,k='pshpt'+i;if(IMG[k])return k;
  const c=pshFilt(src,'hue-rotate('+hue+'deg) saturate('+(.55+((i*7)%5)*.12)+') brightness('+(.85+((i*3)%4)*.07)+')',flip);if(!c)return 'ps_pt_king';c._ps=1;IMG[k]=c;NPC_H[k]=1.35;return k}
function pshPics(){
  const S=(n,cv,h)=>pshSet(n,cv,h);
  S('col_fluted',pshFilt('ds_dpillar1','grayscale(1) brightness(.5) contrast(1.15) sepia(.45) hue-rotate(195deg)'),3.0);
  S('col_twist',pshFilt('hg_pillar','grayscale(1) brightness(.42) contrast(1.2) sepia(.55) hue-rotate(195deg)'),3.0);
  S('col_silver',pshFilt('ds_wm_crystal_pillar','hue-rotate(290deg) saturate(.8) brightness(.72)'),2.9);
  S('table_long',pshFilt('hl_p_feast','grayscale(.6) sepia(.4) hue-rotate(195deg) brightness(.55)'),.95);
  S('table_high',pshFilt('hl_p_feast','grayscale(.6) sepia(.4) hue-rotate(195deg) brightness(.55)',true),1.0);
  S('chair_high',pshFilt('ds_hgtb_chair','grayscale(.5) brightness(.6) sepia(.4) hue-rotate(195deg)'),1.0);
  S('chandelier',pshFilt('ds_hgtb_furn_chandelier','hue-rotate(5deg) saturate(.55) brightness(.8)'),1.5);
  S('banner_violet',pshFilt('hl_p_banner','hue-rotate(24deg) saturate(.85) brightness(.62)'),2.3);
  S('hearth_cold',pshFilt('ds_hgtb_furn_hearth','hue-rotate(175deg) saturate(1.1) brightness(.9)'),2.1);
  S('throne',pshFilt('hl_p_throne','grayscale(.5) brightness(.5) hue-rotate(195deg)'),1.9);
  S('candelabra_tall',pshFilt('ds_hpb_candelabra_6','hue-rotate(20deg) saturate(.8)'),1.5);
  S('bed_four',pshFilt('ds_hgtb_furn_bed','saturate(.55) hue-rotate(260deg) brightness(1.05)'),1.5);
  S('harpsichord',pshFilt('hl_p_desk','grayscale(.4) hue-rotate(200deg) brightness(1.1)'),1.0);
  S('suit_armour',pshFilt('hl_p_armour','grayscale(.5) brightness(.75) sepia(.3) hue-rotate(195deg)'),1.9);
  S('balustrade',pshFilt('gy_fence','grayscale(1) brightness(.8) sepia(.3) hue-rotate(195deg)'),.95);
  S('mirror',pshFilt('hl_p_mirror','grayscale(.5) brightness(.9) sepia(.3) hue-rotate(195deg)'),2.0);S('hedge',pshFilt('lbush0','hue-rotate(-25deg) saturate(.45) brightness(.7)'),.8);S('sideboard',pshFilt('hl_p_desk','brightness(.7) hue-rotate(200deg) saturate(.6)'),.9);
  {const a=IMG.cr_stag;if(a){const c=pshCv(150,170),x=c.getContext('2d');x.fillStyle='#5a3c22';x.beginPath();x.ellipse(75,90,70,78,0,0,6.3);x.fill();x.strokeStyle='#c8b080';x.lineWidth=5;x.stroke();x.drawImage(a,0,0,a.width,a.height*.5,12,6,126,126*a.height*.5/a.width);S('trophy_stag',c,1.1)}}
  S('urn_pale',pshFilt('gy_urn','grayscale(1) brightness(.75) sepia(.4) hue-rotate(195deg)'),1.1);
  const gv=' sepia(.35) hue-rotate(195deg)',st=[['statue','grayscale(.8) brightness(.85)'+gv,1.9,0],['ds_wm_statue','grayscale(.8) brightness(.8)'+gv,1.9,0],['lpstatue','grayscale(.8) brightness(.9)'+gv,1.9,1],['mw_statue','grayscale(.8) brightness(.8)'+gv,1.8,0],['gy_angel','grayscale(.8) brightness(.85)'+gv,1.9,1],['ds_dsutstatue','grayscale(.9) brightness(.8)'+gv,1.9,0],['ds_dsphinx','grayscale(.9) brightness(.8)'+gv,1.0,0]];
  st.forEach((a,i)=>S('hst'+i,pshFilt(a[0],a[1],a[3]),a[2]));
  S('hst7',pshFilt('statue','grayscale(.9) brightness(.7) sepia(.4) hue-rotate(190deg)',true),1.9);
  const P=(n,inner,w,h,hh)=>{S(n,pshFrame(inner,w,h),hh)};
  P('pt_king',IMG.hl_pt0,146,131,1.6);P('pt_queen',IMG.hl_pt1,146,131,1.6);P('pt_prince',IMG.hl_pt4,146,128,1.4);
  P('pt_battle',(x,x0,y0,w,h)=>{const g=x.createLinearGradient(0,y0,0,y0+h);g.addColorStop(0,'#3a2a48');g.addColorStop(.6,'#7a3a3a');g.addColorStop(1,'#2a1a1a');x.fillStyle=g;x.fillRect(x0,y0,w,h);
    for(const [k,fx,sc] of [['gyi_aldric',.3,1],['gyi_vane',.62,.9],['gyi_pike',.8,.8],['gyi_pike',.12,.7]]){const im=IMG[k];if(im){const hh=h*.9*sc,ww=hh*im.width/im.height;x.drawImage(im,x0+w*fx-ww/2,y0+h-hh,ww,hh)}}},220,150,1.6);
  P('pt_hunt',(x,x0,y0,w,h)=>{const g=x.createLinearGradient(0,y0,0,y0+h);g.addColorStop(0,'#586a58');g.addColorStop(1,'#222c22');x.fillStyle=g;x.fillRect(x0,y0,w,h);
    for(const [k,fx,sc] of [['cr_stag',.38,.95],['guard',.72,.85],['gyi_hound',.18,.35]]){const im=IMG[k];if(im){const hh=h*.9*sc,ww=hh*im.width/im.height;x.drawImage(im,x0+w*fx-ww/2,y0+h-hh,ww,hh)}}},220,150,1.6);
  P('pt_feast',pshFilt('hl_p_feast','saturate(.8) brightness(.9)'),220,120,1.4);
  P('pt_pale_lands',pshFilt('hl_castle','grayscale(.7) hue-rotate(200deg) brightness(1.2)'),220,125,1.4);
  P('pt_ancestors',(x,x0,y0,w,h)=>{for(let i=0;i<5;i++){const im=IMG[PSH_POOL[(i*5+1)%6]];if(im)x.drawImage(im,im.width*.2,0,im.width*.6,im.height,x0+i*w/5,y0,w/5+1,h)}},330,110,1.2);
  P('pt_empty',null,146,131,1.6);
  P('pt_isaude',(x,x0,y0,w,h)=>{const im=IMG.gyp_ghost_1;x.fillStyle='#2a3048';x.fillRect(x0,y0,w,h);if(im){const hh=h*1.55,ww=hh*im.width/im.height;x.drawImage(im,x0+w/2-ww/2,y0-h*.08,ww,hh)}},120,150,1.6);
  P('pt_gallery8',(x,x0,y0,w,h)=>{for(let i=0;i<8;i++){const im=IMG[PSH_POOL[(i*5)%6]];if(im){const cw=w/4,c2=h/2;x.drawImage(im,x0+(i%4)*cw,y0+((i/4)|0)*c2,cw-2,c2-2)}}},300,150,1.4);
  const ghost='saturate(.2) brightness(1.25) opacity(.8)';
  const C=(id,src,f,h,flip)=>{const c=pshFilt(src,f,flip);if(c){pshSet('c_'+id,c,h);const d=ENEMY_DEF[id];if(d)d.w=+(h*c.width/c.height).toFixed(2)}};
  C('psarmour','hl_p_armour','grayscale(.45) brightness(1.3) hue-rotate(210deg)',1.9);
  C('psservant','gyp_ghost_0','saturate(.25) brightness(1.15) opacity(.85)',1.7);
  C('pscourtier','gyp_ghost_2','saturate(.4) brightness(1.1) hue-rotate(40deg)',1.8);
  C('psfiend','gyp_crB_2','saturate(.5) brightness(1.1) hue-rotate(60deg)',1.8);
  C('pscarver','gyp_crB_0','brightness(1.35) saturate(.5)',1.9);
  C('psstairwarden','ds_w_candleknight','grayscale(.5) brightness(1.3) hue-rotate(200deg)',3.0);
  C('psantlered','ds_w_glassstag','saturate(.8) brightness(1.1) hue-rotate(20deg)',2.5);
  C('pshhound','gyp_crB_4','grayscale(.7) brightness(1.4)',.95);
  {const a=IMG.gyp_ghost_1,b=IMG.gyp_ghost_2;if(a&&b){const h=Math.max(a.height,b.height),c=pshCv(Math.round((a.width+b.width)*.78),h),x=c.getContext('2d');try{x.filter='saturate(.4) brightness(1.15) opacity(.85)'}catch(e){}
    x.drawImage(a,0,h-a.height);x.translate(c.width,0);x.scale(-1,1);x.drawImage(b,0,h-b.height);pshSet('c_psdancer',c,1.8);if(ENEMY_DEF.psdancer)ENEMY_DEF.psdancer.w=+(1.8*c.width/c.height).toFixed(2)}}
  for(const [n,src] of [['p_chamberlain','gyp_ghost_2'],['p_lutenist','gyp_ghost_1'],['p_curator','gyp_ghost_0']]){const c=pshFilt(src,ghost);if(c)pshSet(n,c,1.7)}
  { // black gothic furniture: very dark carved wood with a faint cold sheen
    const blk='brightness(.52) contrast(1.15) saturate(.5) sepia(.2) hue-rotate(195deg)';
    for(const [n,src,h] of PSH_FURN)S(n,pshFilt(src,blk),h);
    // long banners: the old banner stretched tall, aged brass and orange-brown
    for(const [n,flip,f] of [['banner_long_a',false,'hue-rotate(22deg) saturate(.9) brightness(.58)'],['banner_long_b',true,'hue-rotate(12deg) saturate(.7) brightness(.5)']]){const b=pshFilt('hl_p_banner',f,flip);
      if(b){const c=pshCv(Math.round(b.width*.62),Math.round(b.height*1.5)),x=c.getContext('2d');x.drawImage(b,0,0,c.width,c.height);S(n,c,3.0)}}
    // ghosts: pale, cold, see-through
    const gf='saturate(.2) brightness(1.15) hue-rotate(190deg) opacity(.62)';
    for(const [n,src,h] of PSH_GPICS){let c=null;for(const q of src){c=pshFilt(q,gf);if(c)break}if(c)S(n,c,h)}
    {const a=IMG.ps_p_ghost_lady||IMG.gyp_ghost_1,b=IMG.ps_p_ghost_gentleman||IMG.gyp_ghost_2;if(a&&b){const hh=Math.max(a.height,b.height),c=pshCv(Math.round((a.width+b.width)*.8),hh),x=c.getContext('2d');try{x.filter=gf}catch(e){}x.drawImage(a,0,hh-a.height);x.translate(c.width,0);x.scale(-1,1);x.drawImage(b,0,hh-b.height);S('ghost_couple',c,1.85)}}
    for(const [id,src,f,h] of [['pswraith','gyp_ghost_1','brightness(.55) saturate(.35) hue-rotate(195deg) opacity(.9)',2.1],['psofficer','saturate(.2) brightness(1.1) hue-rotate(195deg) opacity(.78)',1.9]]){const c=pshFilt(src,f)||pshFilt('gyp_ghost_2',f);if(c){pshSet('c_'+id,c,h);const d=ENEMY_DEF[id];if(d)d.w=+(h*c.width/c.height).toFixed(2)}}
  }
  /* the painted gaunt ghosts (p_ghost_*) stand in for every named haunting: no folk sprites, no minstrels */
  for(const [a,b] of PSH_GMAP){const k='ps_p_ghost_'+b;if(IMG[k]&&!IMG[k]._ps){IMG['ps_'+a]=IMG[k];NPC_H['ps_'+a]=NPC_H[k]||1.8}}
  for(const [a,b] of [['p_chamberlain','butler'],['p_lutenist','dancer'],['p_curator','gentleman']]){const k='ps_p_ghost_'+b;if(IMG[k]){IMG['ps_'+a]=IMG[k];NPC_H['ps_'+a]=NPC_H[k]||1.8}}
  {const k='ps_p_ghost_soldier';if(IMG[k]&&ENEMY_DEF.psofficer){IMG['ps_c_psofficer']=IMG[k];NPC_H['ps_c_psofficer']=1.9;ENEMY_DEF.psofficer.w=+(1.9*IMG[k].width/IMG[k].height).toFixed(2)}}
  /* hostile hall folk wear the painted gaunt ghosts too, tinted so that a foe is not mistaken for a harmless haunting */
  for(const [id,b,f,h] of [['psservant','butler','hue-rotate(70deg) saturate(1.5) brightness(.8) contrast(1.15)',1.8],['pscourtier','gentleman','hue-rotate(250deg) saturate(1.5) brightness(.78) contrast(1.15)',1.85],['psdancer','dancer','hue-rotate(305deg) saturate(1.6) brightness(.85)',1.6],['pscarver','butler','hue-rotate(165deg) saturate(1.7) brightness(.7) contrast(1.2)',1.9]]){const k='ps_p_ghost_'+b;if(IMG[k]){const c=pshFilt(k,f);if(c){pshSet('c_'+id,c,h);const d=ENEMY_DEF[id];if(d)d.w=+(h*c.width/c.height).toFixed(2)}}}
  PSH.pics=1}

/* ---------- the creatures of the halls (ratings follow the place: 101; the bosses are tuned by eye, see the notes) ---------- */
{const pic=id=>'ps_c_'+id;
Object.assign(ENEMY_DEF,{
  psarmour:{name:'Hollow Suit of Armour',hp:96,dmg:[8,13],hit:.86,w:.62,ph:1.9,img:pic('psarmour'),xp:30,gold:[0,0],speed:1,verb:'cleaves',still:1,ps:1,wake:'The empty armour turns its helm toward you with a grinding sound, and lifts its sword.'},
  psservant:{name:'Pale Servant',hp:56,dmg:[6,10],hit:.85,w:.6,ph:1.7,img:pic('psservant'),xp:26,gold:[0,0],speed:1,ranged:2,verb:'hurls a plate at',ps:1,glow:.2},
  pscourtier:{name:'Pale Courtier',hp:62,dmg:[8,13],hit:.87,w:.6,ph:1.8,img:pic('pscourtier'),xp:28,gold:[0,0],speed:1,ranged:2,verb:'curses',ps:1,glow:.25},
  psdancer:{name:'Whirling Dancer',hp:52,dmg:[7,11],hit:.88,w:.9,ph:1.8,img:pic('psdancer'),xp:27,gold:[0,0],speed:2,verb:'spins into',ps:1,glow:.2},
  psfiend:{name:'Portrait Fiend',hp:72,dmg:[8,13],hit:.88,w:.7,ph:1.8,img:pic('psfiend'),xp:30,gold:[0,0],speed:2,verb:'rakes',ps:1,still:1,glow:.15,wake:'A painted face tears itself out of its frame and drops to the floor.'},
  pscarver:{name:'Spectral Carver',hp:80,dmg:[9,14],hit:.88,w:.8,ph:1.9,img:pic('pscarver'),xp:32,gold:[0,0],speed:1,verb:'carves',ps:1,glow:.15},
  pshhound:{name:'Pale Hunting Hound',hp:54,dmg:[7,11],hit:.87,w:.7,ph:.95,img:pic('pshhound'),xp:27,gold:[0,0],speed:2,verb:'savages',ps:1},
  pswraith:{name:'Hall Wraith',hp:118,dmg:[10,15],hit:.88,w:.7,ph:2.1,img:pic('pswraith'),xp:36,gold:[0,0],speed:2,fly:true,floatH:.12,verb:'rakes',ps:1,glow:.35},
  psofficer:{name:'Ghost Officer',hp:110,dmg:[11,16],hit:.89,w:.7,ph:1.9,img:pic('psofficer'),xp:34,gold:[0,0],speed:1,verb:'cuts',ps:1,glow:.25},
  psstairwarden:{name:'The Stair Warden',hp:500,dmg:[11,17],hit:.9,w:1.4,ph:3.0,img:pic('psstairwarden'),xp:900,gold:[0,0],speed:1,verb:'swings his halberd at',boss:true,aboveParty:0,ps:1,still:1,glow:.3,noFlee:1,wake:'The giant armour on the landing straightens, and a halberd as long as a tree comes down off its shoulder.'},
  psantlered:{name:'The Antlered Lord',hp:450,dmg:[10,16],hit:.9,w:1.6,ph:2.5,img:pic('psantlered'),xp:800,gold:[0,0],speed:1,verb:'gores',boss:true,aboveParty:0,ps:1,still:1,glow:.35,noFlee:1,wake:'The antlered ghost lifts its head from the table, and a horn sounds somewhere under the floor.'}});
for(const t of ['psstairwarden','psantlered']){if(typeof NO_VARY!=='undefined')NO_VARY.push(t);if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push(t)}
if(typeof BOSS_GOLD!=='undefined'){BOSS_GOLD.psstairwarden=[5200,6200];BOSS_GOLD.psantlered=[4600,5600]}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^ps(armour|stairwarden)/,'shaken',.15],[/^ps(courtier|fiend|dancer|wraith)/,'cursed',.15],[/^psofficer/,'bleeding',.15],[/^pscarver/,'bleeding',.2],[/^ps(antlered|hhound)/,'bleeding',.18])}
/* ---------- items of this floor ---------- */
ITEMDEF.pspigment={n:'Pigment Pot',k:'quest',t:'Quest item',ic:'potion',c:'#a890d0',stack:9,price:0,sw:.2,d:"A small clay pot of dry pigment from the painters' closet of the Gallery of Portraits."};
ITEMDEF.pssignet={n:"Isaude's Signet Ring",k:'quest',t:'Quest item',ic:'ring',c:'#d8c070',stack:1,price:0,sw:.1,d:"A gold signet ring cut with a heron. Lady Isaude Marwen hid it behind her own portrait."};
ITEMDEF.pskeyclo={n:"Painters' Closet Key",k:'quest',t:'Key',ic:'key',c:'#c8a860',stack:1,price:0,sw:.1,d:"A small brass key on a loop of string, marked PAINTERS. It opens the closet at the west end of the Gallery of Portraits."};
for(const [i,w] of [[1,'the Music Salon'],[2,'the Gallery of Portraits'],[3,'the Banqueting Hall']])ITEMDEF['pssheet'+i]={n:'Music Sheet '+i,k:'quest',t:'Lore',ic:'book',c:'#e8e0c8',stack:1,price:0,sw:.05,d:'A sheet of music written for the harpsichord, found in '+w+'. The Lutenist in the Music Salon asked for all three.'};
ITEMDEF.pswardhalberd={n:"The Stair Warden's Halberd",k:'weapon',t:'Sword',ic:'sword',c:'#cfd4ee',dmg:[560,660],hit:.2,req:{str:76},lvl:102,price:0,rar:1,eff:{bossdmg:.35,bleed:[.3,6,45]},dbl:.2,sw:.7,d:"A halberd of pale steel as long as a tree, taken from the giant armour on the landing of the Grand Stair. Wounds bleed, and bosses take 35% more. Needs level 102."};
ITEMDEF.psantlerring={n:"The Antlered Lord's Signet",k:'ring',t:'Ring',ic:'ring',c:'#c8d0e0',price:0,lvl:102,pas:{ward:19,dodge:.07,regen:.8,mpRegen:.5},str:7,hp:90,rar:1,sw:.1,d:"A heavy silver ring cut with a stag's head, worn by the hunter who led the Sovereign's hunts. Adds 7 Strength and 90 health, every blow on the wearer is 19 lighter, enemies miss 7% more, and wounds close steadily. Needs level 102."};
ITEMDEF.pslutering={n:"The Lutenist's Ring",k:'ring',t:'Ring',ic:'ring',c:'#d8d0f0',price:0,lvl:101,pas:{ward:18,dodge:.07,regen:.7,mpRegen:.7},int:7,hp:80,rar:1,sw:.1,d:"A thin silver ring set with a violet bead that hums when it is turned. Adds 7 Intelligence and 80 health, every blow on the wearer is 18 lighter, enemies miss 7% more, and tiredness fades steadily. Needs level 101."};
/* ---------- floors, ceiling and wall tiles (code: the graveyard's painted stone, toned cold) ---------- */
function pshFloors(){
  if(PSH._fl)return PSH._fl;
  const N=128,mk=fn=>{const d=new Uint8ClampedArray(N*N*4);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=(y*N+x)*4,c=fn(x,y);d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255}return d};
  const hh=(a,b,c)=>hash2(a,b,c),vn=(x,y,cs,sd)=>{const P=N/cs,u=x/cs,v=y/cs,i=Math.floor(u),j=Math.floor(v),fx=u-i,fy=v-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),g=(a,b)=>hh(((a%P)+P)%P,((b%P)+P)%P,sd);return(g(i,j)*(1-sx)+g(i+1,j)*sx)*(1-sy)+(g(i,j+1)*(1-sx)+g(i+1,j+1)*sx)*sy};
  // marble: white and slate-violet chequer, two by two to the square, soft veins, dark joints
  const marble=(x,y,dark)=>{const v=vn(x,y,32,801)*.5+vn(x,y,16,802)*.3+vn(x,y,8,803)*.2,vein=Math.abs(Math.sin((x*.07+y*.045+vn(x,y,32,804)*5)))<.06?1:0;let b=dark?40+v*30:92+v*40;if(vein)b+=dark?24:30;return dark?[b*.7,b*.8,b*.98]:[b*.8,b*.92,b*1.14]};
  FLOORS.psf_chq=mk((x,y)=>{const e=Math.min(x%64,y%64,63-x%64,63-y%64);if(e<1.6)return [10,14,22];const dark=((x>>6)+(y>>6))&1;return marble(x,y,dark)});
  FLOORS.psf_chq2=mk((x,y)=>{const e=Math.min(x%64,y%64,63-x%64,63-y%64);if(e<1.6)return [10,14,20];const dark=((x>>6)+(y>>6))&1;const m=marble(x,y,!dark);return [m[0]*.8,m[1]*.85,m[2]*.95]});
  FLOORS.psf_flag=mk((x,y)=>{const bx=((x+(((y>>5)&1)*32))>>6),by=y>>5,e=Math.min((x+(((y>>5)&1)*32))%64,y%32,63-(x+(((y>>5)&1)*32))%64,31-y%32);if(e<1.3)return [10,14,20];const v=.5+hh(bx,by,805)*.28+vn(x,y,16,806)*.3;return [60*v,72*v,92*v]});
  // the violet runner: deep violet cloth, silver-gold border, a small lozenge pattern
  FLOORS.psf_run=mk((x,y)=>{const e=Math.min(x,y,N-1-x,N-1-y);if(e<5)return [40,22,16];if(e<9)return [170,130,70];if(e<12)return [56,28,18];const lx=Math.abs((x%32)-16)+Math.abs((y%32)-16);let v=lx<9?1.2:1;const n=hh(x>>1,y>>1,807)*.1;return [(98*v)*(1+n),(46*v)*(1+n),(30*v)*(1+n)]});
  FLOORS.psf_wood=mk((x,y)=>{const pl=Math.floor(y/16),e=y%16,v=.62+hh(pl,(x>>5)+pl,808)*.28+vn(x,y,16,809)*.14;if(e<1.2)return [14,12,12];return [60*v,52*v,44*v]});
  FLOORS.psf_carpet=mk((x,y)=>{const e=Math.min(x,y,N-1-x,N-1-y);if(e<4)return [30,70,52];if(e<8)return [170,150,90];const lx=Math.abs((x%32)-16)+Math.abs((y%32)-16);const v=lx<7?1.15:1,n=hh(x,y,810)*.1;return [(70*v)*(1+n),(104*v)*(1+n),(82*v)*(1+n)]});
  FLOORS.psf_dais=mk((x,y)=>{const e=Math.min(x,y,N-1-x,N-1-y);if(e<2)return [14,18,28];const v=vn(x,y,32,811)*.5+vn(x,y,8,812)*.3;return [66+v*34,78+v*40,102+v*36]});
  FLOORS.psf_black=mk((x,y)=>{const e=Math.min(x%64,y%64,63-x%64,63-y%64);if(e<1.4)return [8,10,14];const v=vn(x,y,32,813)*.5+vn(x,y,8,814)*.4,vein=Math.abs(Math.sin(x*.05-y*.06+vn(x,y,32,815)*4))<.05?40:0;return [18+v*18+vein*.6,22+v*20+vein*.8,32+v*26+vein]});
  if(typeof gyFloorTone==='function'&&FLOORS.gyf_grass)gyFloorTone('psf_grass','gyf_grass',.72,[.78,.95,.88]);
  // the painted textures (assets/ps tex_*) replace the code-drawn flagstone, black marble and vault when they are loaded
  const fromTex=(key,g,tn)=>{const im=IMG['ps_'+key];if(!im||!im.width)return null;try{const c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.drawImage(im,0,0,N,N);const s=x.getImageData(0,0,N,N).data,d=new Uint8ClampedArray(N*N*4);for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,s[i]*g*tn[0]);d[i+1]=Math.min(255,s[i+1]*g*tn[1]);d[i+2]=Math.min(255,s[i+2]*g*tn[2]);d[i+3]=255}return d}catch(e){return null}};
  {const a=fromTex('tex_flagstone',2.2,[.8,.95,1.15]);if(a)FLOORS.psf_flag=a;const b=fromTex('tex_marble',2.4,[.75,.95,1.1]);if(b)FLOORS.psf_black=b;const v=fromTex('tex_vault_ceiling',2.6,[.75,.92,1.2]);if(v)CEILS.psc_hall=v}
  PSH._fl=['psf_chq','psf_flag','psf_run','psf_wood','psf_carpet','psf_dais',FLOORS.psf_grass?'psf_grass':'psf_black'];
  // a ribbed groin vault: diagonal and cross ribs of pale slate, dark webbing that darkens toward the springers, a boss at the crossing (tex_vault_ribbed)
  if(!CEILS.psc_hall){const d=new Uint8ClampedArray(N*N*4);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=(y*N+x)*4,e=Math.min(x,y,N-1-x,N-1-y),dd=Math.min(Math.abs(x-y),Math.abs(x+y-(N-1)))/1.42,cx=x-N/2+.5,cy=y-N/2+.5,rc=Math.hypot(cx,cy);
      let rib=dd<3.2||e<3.2,boss=rc<9,k;const n=hh(x>>1,y>>1,820)*.08+vn(x,y,16,821)*.14;
      if(boss)k=rc<5?1.25:.9;else if(rib)k=.95-(dd<1?0:.1)+n;else k=.2+Math.min(.28,Math.min(dd,e)/90)+n*.6;
      d[o]=Math.min(255,70*k*1.0);d[o+1]=Math.min(255,82*k*1.02);d[o+2]=Math.min(255,104*k*1.08);d[o+3]=255}CEILS.psc_hall=d}
  return PSH._fl}
/* the wall styles: stone and colour of each room. A tile is the painted stone plus drawn work: a gothic window, an arched bay with a plinth, ivy, silk panels, dark wood. */
const PSH_STYLES={
  hall:{tex:'texBlack_0',rgb:[.74,.86,1.0],gain:1.45,trim:'#b09058',band:'rgba(6,10,20,.66)'},
  gallery:{tex:'texBlack_1',rgb:[.78,.86,1.0],gain:1.4,trim:'#b89a60',band:'rgba(8,12,22,.58)'},
  statues:{tex:'texBlack_2',rgb:[.72,.86,1.04],gain:1.45,trim:'#a8a090',band:'rgba(6,12,22,.58)'},
  banquet:{tex:'texBlack_3',rgb:[.82,.86,1.0],gain:1.45,trim:'#c0a060',band:'rgba(10,10,22,.66)',silk:'#1a2240'},
  salon:{tex:'texBlack_1',rgb:[.7,.86,1.06],gain:1.4,trim:'#b8a070',band:'rgba(8,16,30,.52)',silk:'#2a3858'},
  trophy:{tex:'texBlack_3',rgb:[.9,.84,.8],gain:1.35,trim:'#a07a48',band:'rgba(28,18,12,.7)',wood:1},
  screens:{tex:'texBlack_3',rgb:[.86,.84,.82],gain:1.35,trim:'#907850',band:'rgba(22,16,12,.75)',wood:1},
  lady:{tex:'texBone_0',rgb:[1.1,.96,.8],gain:1.0,trim:'#e8d0a0',band:'rgba(110,70,50,.35)',silk:'#8a6458'},
  stair:{tex:'texBlack_4',rgb:[.66,.8,1.02],gain:1.45,trim:'#a89060',band:'rgba(4,8,18,.72)'},
  closet:{tex:'texBlack_3',rgb:[.9,.86,.78],gain:1.25,trim:'#98846a',band:'rgba(24,20,16,.5)'}};
function pshTile(style,kind,v){
  const S=PSH_STYLES[style],WH=PSH.WH,key=style+kind+(v||0);PSH._tl=PSH._tl||{};if(PSH._tl[key]!==undefined)return PSH._tl[key];
  const tex=(v&&S.tex==='texGrey_0')?'texGrey_1':(v&&S.tex==='texBone_0')?'texBone_1':S.tex;
  const draw=(x,w,h)=>{
    const wain=h*.3;
    // wainscot band: darker lower part with a trim line
    x.fillStyle=S.band;x.fillRect(0,h-wain,w,wain);x.fillStyle=S.trim;x.globalAlpha=.55;x.fillRect(0,h-wain-2,w,3);x.globalAlpha=1;
    if(!S.wood&&kind!=='steps'&&S.tex!=='texBone_0'){ // carved wainscot: two pointed panels and a frieze of little trefoils on the string course
      x.strokeStyle=S.trim;x.globalAlpha=.42;x.lineWidth=2.5;for(let i=0;i<2;i++){const cx2=32+i*64,tp=h-wain+8,bt=h-6;x.beginPath();x.moveTo(cx2-22,bt);x.lineTo(cx2-22,tp+18);x.quadraticCurveTo(cx2-22,tp,cx2,tp-6);x.quadraticCurveTo(cx2+22,tp,cx2+22,tp+18);x.lineTo(cx2+22,bt);x.closePath();x.stroke();x.fillStyle='rgba(0,0,0,.25)';x.fill()}
      x.globalAlpha=.5;x.fillStyle=S.trim;for(let i=0;i<8;i++){x.beginPath();x.arc(8+i*16,h-wain-9,3.2,0,6.3);x.fill()}x.globalAlpha=1}
    if(S.wood){x.fillStyle='rgba(40,22,10,.62)';x.fillRect(0,h-wain,w,wain);for(let i=0;i<4;i++){x.fillStyle='rgba(0,0,0,.4)';x.fillRect(i*32+1,h-wain+4,2,wain-8)}x.strokeStyle='rgba(200,160,100,.5)';x.strokeRect(6,h-wain+8,w-12,wain-16)}
    if(S.silk&&kind!=='win'){x.fillStyle=S.silk;x.globalAlpha=.5;x.fillRect(8,h*.12,w-16,h-wain-h*.12-10);x.globalAlpha=1;x.strokeStyle=S.trim;x.lineWidth=2;x.strokeRect(8,h*.12,w-16,h-wain-h*.12-10);x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=1;for(let i=1;i<6;i++){x.beginPath();x.moveTo(8+i*(w-16)/6,h*.12);x.lineTo(8+i*(w-16)/6,h-wain-10);x.stroke()}}
    if(kind==='win'||kind==='bay'||kind==='bay2'){
      const cx=w/2,top=h*(kind==='win'?.16:.22),bot=kind==='win'?h*.62:h-wain*.15,hw=kind==='win'?30:44;
      x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw*1.1);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.35);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw*1.1);x.lineTo(cx+hw,bot);x.closePath();
      x.save();x.clip();
      if(kind==='win'){const g=x.createLinearGradient(0,top,0,bot);g.addColorStop(0,'#b0dcff');g.addColorStop(.5,'#3a76ae');g.addColorStop(1,'#0c2a52');x.fillStyle=g;x.fillRect(0,0,w,h);
        x.strokeStyle='rgba(2,6,14,.92)';x.lineWidth=3;for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(cx+i*hw/2.5,top-20);x.lineTo(cx+i*hw/2.5,bot);x.stroke()}for(let j=0;j<5;j++){x.beginPath();x.moveTo(0,top+20+j*(bot-top)/5);x.lineTo(w,top+20+j*(bot-top)/5);x.stroke()}
        x.fillStyle='rgba(255,255,255,.55)';for(let j=0;j<6;j++){x.fillRect(cx-hw+8+((j*13)%50),top+10+((j*29)%(bot-top-20)),4,10)}}
      else{const g=x.createLinearGradient(0,top,0,bot);g.addColorStop(0,'#1c1830');g.addColorStop(1,'#0a0814');x.fillStyle=g;x.fillRect(0,0,w,h);
        // ivy creeping in from the top and the sides of the bay
        x.fillStyle='#2f5a34';for(let i=0;i<46;i++){const px=cx-hw+((i*37)%(hw*2)),py=top+((i*i*11)%((bot-top)*.55));x.beginPath();x.ellipse(px,py,5+((i*3)%4),3+(i%3),((i*7)%6)/2,0,6.3);x.fill()}x.fillStyle='#4a7e46';for(let i=0;i<24;i++){x.beginPath();x.ellipse(cx-hw+((i*53)%(hw*2)),top+((i*29)%((bot-top)*.5)),3,2,i,0,6.3);x.fill()}}
      x.restore();
      x.strokeStyle=S.trim;x.lineWidth=5;x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw*1.1);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.35);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw*1.1);x.lineTo(cx+hw,bot);x.stroke();
      x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=2;x.stroke()}
    if(kind==='ivy'){x.fillStyle='#2c5632';for(let i=0;i<150;i++){const px=(i*53)%w,py=h*(Math.pow(((i*37)%100)/100,1.5))*.85,r=3+((i*5)%5);x.globalAlpha=.9;x.beginPath();x.ellipse(px,py,r,r*.6,((i*3)%6)/2,0,6.3);x.fill()}
      x.fillStyle='#4c8248';for(let i=0;i<80;i++){x.beginPath();x.ellipse((i*71)%w,h*(((i*41)%100)/100)*.8,3,2,i,0,6.3);x.fill()}x.globalAlpha=1}
    if(kind==='plain'&&!S.wood&&!S.silk){const arch=(cx2,hw2,top2,bot2,al)=>{x.beginPath();x.moveTo(cx2-hw2,bot2);x.lineTo(cx2-hw2,top2+hw2*1.2);x.quadraticCurveTo(cx2-hw2,top2+hw2*.1,cx2,top2-hw2*.3);x.quadraticCurveTo(cx2+hw2,top2+hw2*.1,cx2+hw2,top2+hw2*1.2);x.lineTo(cx2+hw2,bot2);x.closePath();x.fillStyle='rgba(0,0,0,'+al+')';x.fill();x.strokeStyle=S.trim;x.globalAlpha=.55;x.lineWidth=3;x.stroke();x.globalAlpha=1};
      if(!v){arch(w/2,40,h*.2,h-wain-2,.3);arch(w/2,26,h*.33,h-wain-2,.22)}else{arch(w*.27,22,h*.3,h-wain-2,.3);arch(w*.73,22,h*.3,h-wain-2,.3)}
      x.fillStyle='rgba(20,44,34,.45)';for(let i=0;i<26;i++){x.beginPath();x.ellipse((i*61)%w,h-wain-(i*7)%14,4+(i%3),2,i,0,6.3);x.fill()}}
    if(kind==='steps'){const n=9;for(let i=0;i<n;i++){const yy=h*.1+i*(h*.9/n);x.fillStyle='rgba(0,0,0,'+(.18+.03*i)+')';x.fillRect(0,yy,w,2);x.fillStyle='rgba(150,170,210,.16)';x.fillRect(0,yy+2,w,2)}x.fillStyle='rgba(30,40,70,.35)';x.fillRect(0,0,w,h*.1);x.fillStyle='rgba(2,6,12,.5)';x.fillRect(0,h-wain,w,wain);x.strokeStyle='#7088a8';x.lineWidth=3;x.strokeRect(2,2,w-4,h-4);
      x.fillStyle='#24402c';for(let i=0;i<40;i++){x.beginPath();x.ellipse((i*47)%w,h-(i*13)%(h*.5),5,3,i,0,6.3);x.fill()}}
    if(kind==='iron'){const cx=w/2,top=h*.2,bot=h*.72,hw=32;x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.4);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw);x.lineTo(cx+hw,bot);x.closePath();x.save();x.clip();x.fillStyle='#04060c';x.fillRect(0,0,w,h);
      x.strokeStyle='#10141c';x.lineWidth=3;for(let i=-4;i<=4;i++){x.beginPath();x.moveTo(cx+i*hw/4.2,top-12);x.lineTo(cx+i*hw/4.2,bot);x.stroke()}for(let j=0;j<4;j++){x.beginPath();x.arc(cx,top+hw*.55+j*(bot-top)/4.6,hw*.7,0.2,2.9);x.stroke()}x.restore();x.strokeStyle='#2c3444';x.lineWidth=5;x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.4);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw);x.lineTo(cx+hw,bot);x.stroke();x.strokeStyle=S.trim;x.lineWidth=2;x.stroke()}
    if(kind==='face'){const cx=w/2,cy=h*.42;x.fillStyle='rgba(130,146,170,.55)';x.beginPath();x.ellipse(cx,cy,26,34,0,0,6.3);x.fill();x.strokeStyle='rgba(0,0,0,.7)';x.lineWidth=3;x.stroke();x.fillStyle='#02040a';x.beginPath();x.ellipse(cx-10,cy-8,6,8,.3,0,6.3);x.fill();x.beginPath();x.ellipse(cx+10,cy-8,6,8,-.3,0,6.3);x.fill();
      x.fillStyle='#8cd8ff';x.globalAlpha=.8;x.beginPath();x.arc(cx-10,cy-6,2.2,0,6.3);x.fill();x.beginPath();x.arc(cx+10,cy-6,2.2,0,6.3);x.fill();x.globalAlpha=1;x.fillStyle='#02040a';x.beginPath();x.ellipse(cx,cy+16,10,13,0,0,6.3);x.fill();x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=2;x.beginPath();x.moveTo(cx-6,cy+3);x.lineTo(cx,cy+8);x.lineTo(cx+6,cy+3);x.stroke();
      x.fillStyle='rgba(130,146,170,.5)';for(const s2 of [-1,1]){x.beginPath();x.moveTo(cx+s2*22,cy-24);x.lineTo(cx+s2*40,cy-50);x.lineTo(cx+s2*12,cy-30);x.closePath();x.fill()}}
    if(kind==='pilaster'){x.fillStyle='rgba(255,255,255,.1)';x.fillRect(w*.3,0,w*.4,h);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(w*.3,0,3,h);x.fillRect(w*.7-3,0,3,h);x.fillStyle=S.trim;x.globalAlpha=.6;x.fillRect(w*.26,0,w*.48,5);x.fillRect(w*.26,h-wain-7,w*.48,6);x.globalAlpha=1}
  };
  return PSH._tl[key]=gyTile(tex,WH,{gain:S.gain,rgb:S.rgb,tag:'psh_'+key,draw});
}

/* ---------- door tiles (code: oak, silver, iron) ---------- */
function pshDoorTile(kind){
  PSH._dt=PSH._dt||{};if(PSH._dt[kind]!==undefined)return PSH._dt[kind];
  const WH=PSH.WH,draw=(x,w,h)=>{
    const big=kind==='great'||kind==='gallery',hw=big?52:kind==='closet'?30:40,top=h*(big?.14:.3),bot=h,cx=w/2;
    x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.3);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw);x.lineTo(cx+hw,bot);x.closePath();
    x.save();x.clip();
    const g=x.createLinearGradient(0,top,0,bot);
    if(kind==='iron'){g.addColorStop(0,'#2c2a3c');g.addColorStop(1,'#14121e')}else if(kind==='barred'){g.addColorStop(0,'#3a2c24');g.addColorStop(1,'#1c120c')}else{g.addColorStop(0,'#2a2220');g.addColorStop(1,'#0a0808')}
    x.fillStyle=g;x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=2;for(let i=-4;i<=4;i++){x.beginPath();x.moveTo(cx+i*hw/4.2,top);x.lineTo(cx+i*hw/4.2,bot);x.stroke()}
    x.strokeStyle='rgba(0,0,0,.8)';x.lineWidth=3;x.beginPath();x.moveTo(cx,top-hw*.3);x.lineTo(cx,bot);x.stroke();
    const band=kind==='great'||kind==='gallery'?'#b09058':'#4a4a58';
    x.fillStyle=band;for(const yy of [.32,.52,.74,.9]){x.fillRect(cx-hw,h*yy,hw*2,6);x.fillStyle='rgba(0,0,0,.45)';x.fillRect(cx-hw,h*yy+6,hw*2,2);x.fillStyle=band}
    if(big){x.fillStyle='#e0c890';for(const yy of [.32,.52,.74,.9])for(let i=-3;i<=3;i++){x.beginPath();x.arc(cx+i*hw/3.4,h*yy+3,2.6,0,6.3);x.fill()}
      x.strokeStyle='#e8d890';x.lineWidth=3;x.beginPath();x.arc(cx-hw*.42,h*.62,9,0,6.3);x.stroke();x.beginPath();x.arc(cx+hw*.42,h*.62,9,0,6.3);x.stroke()}
    if(kind==='iron'){const gr=x.createRadialGradient(cx,h*.6,2,cx,h*.6,30);gr.addColorStop(0,'rgba(190,225,255,1)');gr.addColorStop(1,'rgba(70,130,220,0)');x.fillStyle=gr;x.beginPath();x.arc(cx,h*.6,30,0,6.3);x.fill();x.strokeStyle='#d8ecff';x.lineWidth=2.5;x.beginPath();x.arc(cx,h*.6,10,0,6.3);x.stroke();x.fillStyle='#14121e';x.fillRect(cx-3,h*.6-4,6,14)}
    if(kind==='barred'){x.fillStyle='#4a4650';x.fillRect(cx-hw,h*.58,hw*2,12);x.fillStyle='#8a8694';x.fillRect(cx-hw,h*.58,hw*2,3);x.fillStyle='#b8a050';x.beginPath();x.arc(cx,h*.58+6,6,0,6.3);x.fill()}
    if(kind==='steps'){x.fillStyle='#02100a';x.fillRect(0,0,w,h);for(let i=0;i<8;i++){const yy=h*.28+i*(h*.72/8);x.fillStyle='rgba('+(70+i*10)+','+(110+i*12)+','+(90+i*10)+',.9)';x.fillRect(cx-hw*(.35+i*.08),yy,hw*(.7+i*.16),h*.72/8-3)}}
    if(kind==='closet'){x.fillStyle='#c8a860';x.beginPath();x.arc(cx+hw*.55,h*.62,4,0,6.3);x.fill();x.fillRect(cx+hw*.55-1,h*.62,2,10)}
    if(kind==='service'||kind==='cloister'){x.fillStyle='#b8b0a0';x.beginPath();x.arc(cx+hw*.5,h*.62,5,0,6.3);x.fill();if(kind==='cloister'){x.strokeStyle='#4a8a50';x.lineWidth=3;for(let i=0;i<5;i++){x.beginPath();x.arc(cx-hw*.5+i*hw*.25,h*.5+((i%2)*14),8,0,3.2);x.stroke()}}}
    x.restore();
    x.strokeStyle=big?'#b09058':'#585868';x.lineWidth=big?7:5;x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.3);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw);x.lineTo(cx+hw,bot);x.stroke();
    x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=2;x.stroke()};
  const st=kind==='iron'||kind==='barred'||kind==='steps'?'stair':'hall';
  return PSH._dt[kind]=gyTile(PSH_STYLES[st].tex,WH,{gain:1.15,rgb:PSH_STYLES[st].rgb,tag:'psh_door_'+kind,emit:.25,fac:{img:'gatesC_0',i:0,n:1},draw})}
/* the secret-door tiles look exactly like the plain wall of the room, but are their own tile numbers */
function pshSecretTile(style){return gyTile(PSH_STYLES[style].tex,PSH.WH,{gain:PSH_STYLES[style].gain,rgb:[PSH_STYLES[style].rgb[0],PSH_STYLES[style].rgb[1],PSH_STYLES[style].rgb[2]+.00031],tag:'psh_secret_'+style,draw:(x,w,h)=>{const S=PSH_STYLES[style],wain=h*.3;x.fillStyle=S.band;x.fillRect(0,h-wain,w,wain);x.fillStyle=S.trim;x.globalAlpha=.55;x.fillRect(0,h-wain-2,w,3);x.globalAlpha=1}})}
/* ---------- the level: a chain of tall rooms (64 by 48), no hall bigger than the columns and furniture allow ---------- */
const PSH_ROOMS=[ // k, rectangles (inner floor), wall style, floor slot, name
  ['A',[[26,40,38,45]],'hall','0','The Entrance Hall'],
  ['B',[[4,43,24,45]],'gallery','0','The Gallery of Portraits'],
  ['L',[[4,38,6,41]],'closet','1',"The Painters' Closet"],
  ['N',[[26,18,38,38]],'hall','0','The Great Nave'],
  ['I',[[26,6,38,17]],'stair','5','The Grand Stair Hall'],
  ['G',[[11,6,24,15]],'salon','0','The Music Salon'],
  ['H',[[4,4,9,10]],'lady','4',"The Lady's Withdrawing Room"],
  ['D',[[8,19,24,27]],'hall','0','The Dining Hall'],
  ['E',[[3,29,24,31]],'screens','1','The Screens Passage'],
  ['M',[[8,33,24,35]],'screens','3',"The Minstrels' Gallery"],
  ['V',[[8,37,22,39]],'stair','1','The Lower Vault'],
  ['F',[[40,26,60,35]],'banquet','3','The Banqueting Hall'],
  ['J',[[40,18,60,24]],'trophy','3','The Trophy and Hunting Hall'],
  ['W',[[46,37,58,39]],'statues','6','The Winter Bay'],
  ['C',[[40,41,60,45]],'statues','0','The Hall of Statues']];
/* openings between rooms (arches, screens): x0,y0,x1,y1, owner room, floor slot */
const PSH_PASS=[
  [31,39,33,39,'N','2'],[25,44,25,44,'B','0'],[39,43,39,44,'C','0'],[25,8,25,8,'G','0'],[25,23,25,24,'D','0'],[25,30,25,30,'E','1'],
  [39,30,39,31,'F','3'],[39,21,39,22,'J','3'],[50,25,51,25,'J','3'],[52,36,53,36,'W','6'],[47,40,47,40,'W','6'],[56,40,56,40,'W','6'],
  [12,28,12,28,'E','1'],[17,28,17,28,'E','1'],[22,28,22,28,'E','1']];
/* recesses (hidden alcoves for the creepy statues), one cell each, open to a room cell beside them */
const PSH_RECESS=[[8,42,'B'],[12,42,'B'],[19,42,'B'],[22,42,'B'],[25,37,'N'],[39,37,'N']];
/* secret niches: chest cell, the door tile that opens, flag */
const PSH_HIDDEN=[{chest:[15,41],door:[15,42],flag:'framePainted'},{chest:[42,39],door:[42,40],flag:'statueTurned'}];
function pshBuild(){
  if(LEVELS[PSH.ID])return LEVELS[PSH.ID];
  try{gyAlias();pshPics()}catch(e){console.error('psh pics',e)}
  const W=PSH.W,H=PSH.H,WH=PSH.WH,hs=(a,b,c)=>hash2(a,b,c+9740),fl=pshFloors();
  const g=[],fm=[],rid=[];for(let y=0;y<H;y++){g.push(new Array(W).fill('#'));fm.push(new Array(W).fill('0'));rid.push(new Array(W).fill(-1))}
  const RI={};PSH_ROOMS.forEach((r,i)=>{RI[r[0]]=i;for(const [x0,y0,x1,y1] of r[1])for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){g[y][x]='.';fm[y][x]=r[3];rid[y][x]=i}});
  for(const [x0,y0,x1,y1,o,f] of PSH_PASS)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){g[y][x]='.';fm[y][x]=f;rid[y][x]=RI[o]}
  for(const [x,y,o] of PSH_RECESS){g[y][x]='.';fm[y][x]='1';rid[y][x]=RI[o]}
  for(const h of PSH_HIDDEN){const [x,y]=h.chest;g[y][x]='.';fm[y][x]='1';rid[y][x]=RI[x<30?'B':'C']}
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&g[y][x]==='.';
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open(x,y))fm[y][x]=f};
  // runners down the long axes
  setF(31,19,33,38,'2');setF(31,40,33,45,'2');setF(5,44,24,44,'2');setF(41,43,59,43,'2');setF(3,30,24,30,'2');setF(31,6,33,17,'2');
  setF(28,40,36,40,'0');setF(46,26,58,26,'0');
  setF(27,6,37,8,'5');setF(31,9,33,17,'2');                            // the landing of the Grand Stair
  setF(41,18,59,18,'5');setF(49,18,51,20,'5');                       // the dais of the hunting hall
  { for(let y=6;y<=15;y++)for(let x=11;x<=24;x++)if(open(x,y)&&Math.hypot((x-18)/5.6,(y-10.5)/4.4)<1)fm[y][x]='5' }   // the dance floor of the salon
  setF(46,37,58,39,'6');setF(4,38,6,41,'3');
  // the two flights of the Grand Stair: solid blocks of steps either side of the well
  const stairBlocks=[];for(let y=9;y<=16;y++){for(let x=26;x<=29;x++){g[y][x]='#';rid[y][x]=-1;stairBlocks.push([x,y,-1])}for(let x=35;x<=38;x++){g[y][x]='#';rid[y][x]=-1;stairBlocks.push([x,y,1])}}
  // ---- links from the contract ----
  const LK=pspLinksFrom(PSH.ID),over={},kindAt={},doorRec=[];
  const keep=new Set(),reserve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)keep.add(x+','+y)};
  for(const [x0,y0,x1,y1] of PSH_PASS)reserve(x0-1,y0-1,x1+1,y1+1);
  for(const l of PSP.LINKS)if(l.to===PSH.ID&&l.land)reserve(l.land[0]-1,l.land[1]-1,l.land[0]+1,l.land[1]+1);
  for(const l of LK){if(!l.at)continue;
    const kind=l.to===9730?(l.at[0]===32?'great':'gallery'):l.to===9750?'service':l.to===9760?'cloister':'iron';
    over[l.at[0]+','+l.at[1]]=pshDoorTile(kind);doorRec.push({at:l.at,link:l,kind});reserve(l.at[0]-1,l.at[1]-2,l.at[0]+1,l.at[1]+2)}
  reserve(31,6,33,9);
  const ownTile=kind=>{const b=pshDoorTile(kind),n=KH_NEXT_GID++;T_TILE[n]=T_TILE[b];if(GY.col&&GY.col[b])GY.col[n]=GY.col[b];return n};
  const special={ // wall tiles that are doors of their own
    '10,8':['warp',ownTile('closet'),{A:[8,8,3],B:[12,8,1],msgB:null,msgA:"The Lady's Withdrawing Room. It is warm and quiet here, and the light is candlelight. Nothing has followed you in."}],
    '9,32':['warp',ownTile('steps'),{A:[9,30,0],B:[9,34,2],msgB:"You climb a narrow stair, round and round, up to the minstrels' gallery.",msgA:'You go down the narrow stair to the Screens Passage.'}],
    '22,36':['warp',ownTile('steps'),{A:[22,34,0],B:[22,38,2],msgB:'You go down a narrow stair, under the floor of the halls, into a vault.',msgA:'You climb the narrow stair back up to the minstrels\' gallery.'}],
    '5,42':['closet',ownTile('closet'),{}],'39,8':['barred',ownTile('barred'),{}]};
  for(const k in special)over[k]=special[k][1];
  for(const h of PSH_HIDDEN)over[h.door.join(',')]=pshSecretTile(h.door[0]<30?'gallery':'statues');
  reserve(8,7,12,9);reserve(8,29,10,33);reserve(21,34,23,38);reserve(4,40,6,43);reserve(38,7,39,9);
  for(const h of PSH_HIDDEN)reserve(h.chest[0]-1,h.chest[1]-1,h.chest[0]+1,h.door[1]+1);
  const decor=[],enemies=[],items=[],lights=[],lcol={},kI={},r2={},occ=new Set(),wocc=new Set(),miss=[];
  const mapNames=[];
  PSH_ROOMS.forEach(r=>{const [x0,y0,x1,y1]=r[1][0];mapNames.push({t:r[4],x:(x0+x1)>>1,y:(y0+y1)>>1,k:'place'})});
  const fr=(x,y)=>open(x,y)&&!occ.has(x+','+y);
  const put=(k,x,y,o)=>{o=o||{};if(!open(x,y)||occ.has(x+','+y)||(keep.has(x+','+y)&&!o.force)){miss.push(k+'@'+x+','+y);return null}
    const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}if(o.sc)d.sc=o.sc;if(o.npc){d.npc=o.npc;d.deco=false;if(o.block)d.solid=1}if(o.bob!==undefined)d.bob=o.bob;if(o.ox!==undefined){d.ox=o.ox;d.oy=o.oy||0}if(o.txt)d.txt=o.txt;
    decor.push(d);if(!o.over)occ.add(x+','+y);return d};
  const pic=(k,x,y,wd,o)=>{o=Object.assign({},o||{});if(/banner_long/.test(k))o.bob=.1;const key=x+','+y+','+wd[0]+','+wd[1];if(!open(x,y)||wocc.has(key)||g[y+wd[1]]===undefined||g[y+wd[1]][x+wd[0]]!=='#'||over[(x+wd[0])+','+(y+wd[1])]!==undefined){miss.push('pic '+k+'@'+x+','+y);return null}
    const d={k,x,y,block:false,walk:true,deco:true,wd:[wd[0],wd[1]],pic:1};if(o.bob!==undefined)d.bob=o.bob;if(o.npc){d.npc=o.npc;d.deco=false}decor.push(d);wocc.add(key);return d};
  const foe=(t,x,y)=>{if(!open(x,y)||occ.has(x+','+y)||(keep.has(x+','+y))){miss.push('foe '+t+'@'+x+','+y);return false}if(!ENEMY_DEF[t]){miss.push('nodef '+t);return false}enemies.push({t,x,y,lvl:101});occ.add(x+','+y);return true};
  const lamp=(x,y,col,k,r)=>{if(!open(x,y))return;lights.push([x,y]);lcol[x+','+y]=col||PSH_COL.cold;if(k)kI[x+','+y]=k;if(r)r2[x+','+y]=r};
  const sign=(x,y,wd,a,b)=>{if(!open(x,y)){miss.push('sign@'+x+','+y);return}decor.push({k:'sign_gy',x,y,block:false,wd:[wd[0],wd[1]],txt:[a,b||''],sc:1})};
  const COLS=['col_fluted','col_twist','col_silver'];
  const col=(x,y,n)=>put('ps_'+COLS[n%3],x,y,{block:true});
  PSH.st=i=>{const n=['ps_st_veiled','ps_st_saint1','ps_st_saint2','ps_st_judge','ps_st_saint3','ps_st_bishop','ps_st_saint4','ps_st_headless'];const k=n[i%8];return IMG[k]&&!IMG[k]._ps?k:(IMG['ps_hst'+(i%5)]?'ps_hst'+(i%5):'ps_hst0')};
  const stat=(x,y,i,o)=>put(PSH.st(i),x,y,Object.assign({block:true},o||{}));
  const pt=(i)=>pshPortrait(i);
  const mark=(x,y,kind)=>{kindAt[x+','+y]=kind};
  const S={g,fm,rid,open,put,pic,foe,lamp,sign,col,stat,pt,mark,fr,reserve,decor,enemies,items,lights,occ,miss,keep,over,kindAt,doorRec,setF,RI,hs,W,H,stairBlocks};
  try{pshFurnish(S)}catch(e){console.error('pshFurnish',e);throw e}
  for(const [x,y] of stairBlocks)kindAt[x+','+y]='steps';
  // ---- the wall tiles ----
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const styleAt=(x,y)=>{for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]){const a=x+dx,b=y+dy;if(a>=0&&b>=0&&a<W&&b<H&&g[b][a]==='.'&&rid[b][a]>=0)return PSH_ROOMS[rid[b][a]][2]}return 'hall'};
  const rows=[];
  for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){
    if(g[y][x]==='.'){s+='.';continue}
    const k=x+','+y;
    if(over[k]!==undefined){s+=ch(over[k]);continue}
    const st=styleAt(x,y);let kd=kindAt[k]||'plain';const v=(hs(x,y,3)*2)|0;if(kd==='plain'&&hs(x,y,5)<.2&&st!=='lady'&&st!=='closet')kd='ivy';
    s+=ch(pshTile(st,kd,kd==='plain'?v:0))}rows.push(s)}
  // the door records: which tile number is which door
  for(const d of doorRec){const c=rows[d.at[1]][d.at[0]],gid=chars[c];KH_DOOR[gid]={psh:'link',link:d.link,get lvl(){return d.link.to},get at(){const q=d.link.land;return {x:q[0],y:q[1],f:q[2]}},kind:d.kind}}
  for(const k in special){const [x,y]=k.split(',').map(Number),c=rows[y][x],[t,,o]=special[k];KH_DOOR[chars[c]]=Object.assign({psh:t,x,y},o)}
  for(const h of PSH_HIDDEN){const c=rows[h.door[1]][h.door[0]];KH_DOOR[chars[c]]={psh:'niche',flag:h.flag,cell:h.chest}}
  const fmS=fm.map(r=>r.join(''));
  // lights: a pale light every few squares where none is near (the colour table is cold green-white; warm only in the rest room)
  {const have=lights.slice();for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!open(x,y)||rid[y][x]===RI.H)continue;if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=7.5)){have.push([x,y]);lights.push([x,y]);lcol[x+','+y]=PSH_COL.cold}}}
  const L={rows,chars,fmap:fmS,floorSet:fl.slice(),floor:fl[0],floor2:fl[1],ceil:'psc_hall',ceilH:WH,start:{x:32,y:44,f:0},enemies,items,decor,lights,portals:[],day:0,amb:.3,torchGap:1e9,noTele:true,noExtras:true,sky:[],
    name:'The Ground Floor: the Great Halls',label:'The Great Halls',diff:101,mapNames,_psh:{lcol,kI,r2,col:PSH_COL.cold,miss,S:null,gdata:Object.fromEntries((S.gh||[]).map(g=>[g.id,g]))}};
  LEVELS[PSH.ID]=L;LEVEL_NAMES[PSH.ID]=L.name;LEVEL_RATING[PSH.ID]=101;
  if(miss.length)console.warn('psh missed: '+miss.slice(0,60).join(' '));
  {const NN=W*H,hh=new Float32Array(NN).fill(.3),rk=new Float32Array(NN),block=new Uint8Array(NN);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rows[y][x]!=='.')block[y*W+x]=1;try{TERRS[PSH.ID]=yarTerrain(W,H,hh,rk,block)}catch(e){console.error(e)}}
  return L}
if(typeof pspRegister==='function'){try{pspRegister(PSH.ID,pshBuild,{})}catch(e){KH_LAZY[PSH.ID]=pshBuild}}else KH_LAZY[PSH.ID]=pshBuild;
LEVEL_NAMES[9740]='The Ground Floor: the Great Halls';LEVEL_RATING[9740]=101;

/* ---------- THE HAUNTED HOUSE DRESSER (shared by halls, wings and dungeon): sheeted windows, dust-sheeted furniture, cobwebs, haunted mirrors, ancestor portraits, glowing candles, red lanterns.
   Painted pieces (assets/ps) are used when they exist; a few have a stand-in (mirror, candles, portraits in the halls); the others are simply not placed until painted. ---------- */
for(const n of ['a','b','c']){PSP_PICS['mirror_haunted_'+n]=[2.2,['hl_p_mirror'],{dark:1}];PSP_PICS['candles_glow_'+n]=[.8,['hl_p_candle'],{keep:1}]}
const PSH_HP={mirror:['mirror_haunted_a','mirror_haunted_b','mirror_haunted_c'],portrait:[1,2,3,4,5,6,7,8].map(i=>'portrait_ancestor_'+i),sheetwin:['window_sheeted_a','window_sheeted_b','window_sheeted_c'],
  cobcorner:['cobweb_corner_a','cobweb_corner_b'],cobthick:['cobweb_thick_a','cobweb_thick_b','cobweb_thick_c'],candles:['candles_glow_a','candles_glow_b','candles_glow_c'],redlamp:['lantern_red_a','lantern_red_b'],dust:['dust_sheet_furniture_a','dust_sheet_furniture_b'],spider:['web_spider'],bedweb:['bed_cobweb_a','bed_cobweb_b']};
const PSH_RED=[1.7,.32,.26];
const pshPainted=n=>{const k='ps_'+n;return IMG[k]&&!IMG[k]._ps?k:null};
function pshHaunt(o){
  const W=o.W,H=o.H,D4=[[0,-1],[1,0],[0,1],[-1,0]],hs=(a,b,c)=>hash2(a,b,c+(o.seed||0)),out={};
  const key=(t,i)=>{const nm=PSH_HP[t][i%PSH_HP[t].length],p=pshPainted(nm);if(p)return p;if(o.stand&&o.stand[t])return o.stand[t](i,nm);if(PSP_PICS[nm])return pspPic(nm);return null};
  const slots=[],corners=[],narrow=[],floor=[];
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!o.open(x,y))continue;const ws=D4.filter(([a,b])=>o.wall(x,y,a,b)&&!o.taken(x,y,a,b));
    for(const [a,b] of ws)slots.push([x,y,[a,b],hs(x,y,a*3+b+11)]);
    const wl=D4.filter(([a,b])=>o.wall(x,y,a,b));
    if(wl.length>=2&&wl.some(([a,b])=>wl.some(([c,d])=>a*c+b*d===0)))corners.push([x,y,wl,hs(x,y,5)]);
    if(wl.length===2&&wl[0][0]+wl[1][0]===0&&wl[0][1]+wl[1][1]===0&&o.free(x,y))narrow.push([x,y,hs(x,y,6)]);
    if(o.free(x,y)&&wl.length>=1)floor.push([x,y,wl,hs(x,y,7)])}
  const by=(a,b)=>a[a.length-1]-b[b.length-1];
  const spaced=(list,n,gap,use)=>{let c=0;const got=[];list.sort(by);for(const e of list){if(c>=n)break;if(got.some(q=>Math.hypot(q[0]-e[0],q[1]-e[1])<gap))continue;if(use(e,c)!==false){got.push(e);c++}}return c};
  const cnt=o.counts||{};
  out.mirror=spaced(slots.slice(),cnt.mirror||0,6,(e,i)=>{const k=key('mirror',i);if(!k)return false;return o.wallPic(k,e[0],e[1],e[2],{bob:.5,mirror:i})});
  out.portrait=spaced(slots.slice(),cnt.portrait||0,3.2,(e,i)=>{const k=key('portrait',i+(o.pi||0));if(!k)return false;return o.wallPic(k,e[0],e[1],e[2],{bob:.6,portrait:i})});
  out.sheetwin=spaced(slots.slice(),cnt.sheetwin||0,4,(e,i)=>{const k=key('sheetwin',i);if(!k)return false;return o.wallPic(k,e[0],e[1],e[2],{bob:.5})});
  out.cobcorner=spaced(corners.slice(),cnt.cobcorner||0,3,(e,i)=>{const k=key('cobcorner',i);if(!k)return false;const w=e[2][i%e[2].length];return o.wallPic(k,e[0],e[1],w,{bob:.9})});
  out.redlamp=spaced(slots.slice(),cnt.redlamp||0,6.5,(e,i)=>{const k=key('redlamp',i);if(!k)return false;const r=o.wallPic(k,e[0],e[1],e[2],{bob:1.0});if(r&&o.light)o.light(e[0],e[1],PSH_RED);return r});
  out.cobthick=spaced(narrow.slice(),cnt.cobthick||0,5,(e,i)=>{const k=key('cobthick',i);if(!k)return false;return o.floorProp(k,e[0],e[1],{block:false,thick:1})});
  out.candles=spaced(floor.slice(),cnt.candles||0,5,(e,i)=>{const k=key('candles',i);if(!k)return false;const r=o.floorProp(k,e[0],e[1],{block:false,sc:.7});if(r&&o.light)o.light(e[0],e[1],[1.6,1.0,.45]);return r});
  out.dust=spaced(floor.slice(),cnt.dust||0,4.5,(e,i)=>{const k=key('dust',i);if(!k)return false;return o.floorProp(k,e[0],e[1],{block:true})});
  out.spider=spaced(corners.slice(),cnt.spider||0,9,(e,i)=>{const k=key('spider',i);if(!k)return false;return o.floorProp(k,e[0],e[1],{block:false,sc:.6})});
  return out}
/* little tales told by a haunted mirror and an ancestor, for the interactive touches */
const PSH_MIRROR_LINES=['The glass shows the room behind you, and the room is empty. You are not in it.','You look into the mirror. Something in it looks away.','A pale hand is pressed flat on the other side of the glass. It was there before you came.','The mirror shows a lit candle where there is none. The reflection of the room is older than the room.','Your breath does not cloud the glass. Someone else\'s does.','For a moment the mirror shows a girl standing behind you. When you turn, she is closer.'];
const PSH_ANCESTOR_LINES=['The painted eyes follow you along the wall. You are almost sure they are not painted.','The portrait is of a lean man with a hard mouth. The nameplate has been scratched off from the inside.','A pale old woman in black, painted with her hands folded. One of the folded hands is no longer in the picture.','Every ancestor of the house is painted with the same cold smile. It is a little wider than it was.'];
/* ---------- what stands in each room ---------- */
function pshFurnish(S){
  const {put,pic,foe,lamp,sign,col,stat,pt,mark,open,fr,RI,decor,hs,g}=S;
  const N=[0,-1],So=[0,1],Ea=[1,0],We=[-1,0],V=PSH_COL.violet,WM=PSH_COL.warm,CO=PSH_COL.cold;
  const P=n=>pspPic(n);
  const thing=(k,id,x,y,o)=>put(k,x,y,Object.assign({block:true,npc:id},o||{}));
  const hang=(x,y,lt,col2)=>{put('ps_chandelier',x,y,{bob:1.75,over:true,sc:1});lamp(x,y,col2||CO,lt||1.7,150)};
  const wall=(k,list,wd,o)=>{for(const [x,y] of list)pic(k,x,y,wd,o)};
  const hi=.6;let bn=0;const PB=()=>P((bn++)%3===1?'banner_long_b':'banner_long_a');
  const GH=(S.gh=[]);
  /* a ghost: a see-through figure that drifts along the loop of points pts (walks through furniture), now and then whispers one of its lines when the party is near; o: sp speed, lines, shy (runs from the party), sc */
  const ghost=(id,pic,pts,o)=>{o=o||{};const k='ps_gh_'+id,pk=P(pic);if(IMG[pk]){IMG[k]=IMG[pk];NPC_H[k]=(NPC_H[pk]||1.7)*(o.sc||1)}
    decor.push({k,x:pts[0][0],y:pts[0][1],block:false,walk:true,deco:true,bob:.1});GH.push(Object.assign({id,pts,sp:.3,lines:null},o))};   // portraits and banners hang higher on the tall walls
  const guard=(x,y)=>{if(ENEMY_DEF.psguard)foe('psguard',x,y);else foe('psarmour',x,y)};
  const mst=i=>{const n=['ps_st_chimera','ps_st_hydra','ps_st_judge','ps_st_headless','ps_st_bishop','ps_st_mourners','ps_st_veiled','ps_st_hound'][i%8];return IMG[n]&&!IMG[n]._ps?n:PSH.st(i)};
  PSH.mst=mst;
  const pew=(x,y)=>put(P('furn_pew_black'),x,y,{block:true});
  const gar=(x,y,wd)=>pic(P('st_gargoyle'),x,y,wd,{bob:1.7});   // a gargoyle crouched high on a corbel
  const vine=(x,y,wd,n)=>pic(P(n||'vine_a'),x,y,wd,{bob:.9});
  const alc=(x,y,n)=>put(P(n),x,y,{block:true});
  /* ===== A. the Entrance Hall ===== */
  for(const y of [41,43,45]){col(27,y,(y/2|0)%3);col(37,y,((y/2|0)+1)%3)}
  for(const [x,y,i] of [[29,41,0],[35,41,3]]){stat(x,y,i)}
  thing(PSH.st(2),'psh_anc1',29,44);thing(PSH.st(6),'psh_anc2',35,44);
  hang(32,41,1.7);hang(32,43,1.5);
  for(const x of [28,36])pic(P('arch_ivy'),x,45,So,{bob:.1});
  wall(PB(),[[29,45],[35,45]],So,{bob:hi});sign(31,45,So,'THE ENTRANCE HALL','The Great Halls lie north');
  wall(pt(1),[[26,41],[26,42]],We);wall(pt(8),[[38,41],[38,45]],Ea);
  gar(30,45,So);gar(34,45,So);
  thing('ps_p_chamberlain','psh_chamberlain',30,42);
  thing(P('suit_armour'),'psh_suitA',27,44);put(P('suit_armour'),37,44,{block:true});
  thing('hl_p_note','psh_notice',28,45,{sc:.5});
  guard(31,41);guard(33,41);foe('psarmour',36,43);foe('psarmour',28,43);
  ghost('coach','p_ghost_coachman',[[28,42],[36,42],[36,44],[28,44]],{sp:.32,lines:['Mind the step. The Sovereign is waiting.','The trunks must go up before dark. They never go up.','Have you come for the ball? You are very late.']});
  /* ===== B. the Gallery of Portraits (long, three wide) ===== */
  {const skipN=new Set([5,15]),skipS=new Set([18]);let i=0;
   pic('ps_pt_empty',9,43,N,{npc:'psh_emptyframe',bob:hi});skipN.add(9);pic('ps_pt_isaude',22,43,N,{npc:'psh_isaude',bob:hi});skipN.add(22);
   for(const x of [8,12,19,22])skipN.add(x);
   for(let x=6;x<=24;x+=2){if(skipN.has(x))continue;pic(pt(i++),x,43,N,{bob:hi})}
   for(let x=5;x<=23;x+=2){if(skipS.has(x)||Math.abs(x-18)<=1)continue;pic(pt(i++),x,45,So,{bob:hi})}
   pic(pt(i++),4,43,We,{bob:hi});pic(pt(i++),4,45,We,{bob:hi})}
  for(const x of [8,12,19,22])mark(x,41,'bay');
  alc(8,42,'alcove_weeper');alc(12,42,'alcove_maiden');alc(19,42,'alcove_monk');alc(22,42,'alcove_empty');
  for(const x of [6,10,14,22])gar(x,45,So);
  for(const x of [7,11,21])col(x,44,x%3);
  thing(P('furn_lectern_black'),'psh_stand2',23,45);
  sign(14,45,So,'THE GALLERY OF PORTRAITS','West Gallery. Do not touch the frames.');
  hang(10,44,1.6);hang(14,44,1.8);hang(20,44,1.6);
  for(const x of [7,13,21])vine(x,43,N,'vine_b');
  foe('psfiend',9,44);foe('psfiend',14,44);foe('psfiend',21,45);foe('pscarver',12,45);foe('pscourtier',23,44);
  put('chest',15,41,{block:true,force:1});
  /* the painters' closet */
  thing('hl_p_shelf','psh_pigments',4,39);thing(P('furn_lectern_black'),'psh_easel',6,39);put(P('furn_desk'),5,38,{block:true});lamp(5,40,CO,1.6,100);
  ghost('child','p_ghost_child',[[5,44],[23,44],[5,43],[23,45]],{sp:.55,shy:1,lines:['Shh. Nurse will find us.','Do not tell nurse I was inside the frames.']});
  put(P('furn_clock_grandfather'),11,45,{block:true});put(P('furn_clock_grandfather'),20,45,{block:true});put(P('furn_screen_tracery'),9,45,{block:true});put(P('furn_lectern_black'),16,45,{block:true});
  /* ===== C. the Hall of Statues (with alcoves, columns and a winter bay behind) ===== */
  for(let x=44,i=0;x<=58;x+=4,i++)col(x,43,i);
  {let i=0;const named={41:'psh_pl0',59:'psh_pl2',45:'psh_pl3',53:'psh_pl4',57:'psh_pl5',49:'psh_pl1'};
   for(let x=41;x<=60;x+=2){if(x===47||x===56||x===42||x===43)continue;mark(x,40,'bay');put(mst(i++),x,41,{block:true,npc:named[x]||undefined})}
   put(mst(7),43,41,{block:true,npc:'psh_turner',force:1});mark(43,40,'bay');
   for(let x=41;x<=59;x+=2){mark(x,46,'bay');put(mst(i++),x,45,{block:true})}
   for(const x of [45,54,59])put(mst(i++),x,42,{block:true});for(const x of [49,55])put(mst(i++),x,44,{block:true})}
  for(const x of [42,46,50,54,58])gar(x,45,So);
  thing('ps_p_curator','psh_curator',41,44);sign(46,45,So,'THE HALL OF STATUES','Kings and monsters of the old house');
  hang(44,42,1.6);hang(52,42,1.6);hang(58,44,1.6);
  for(const x of [48,52])vine(x,41,N);
  wall(pt(30),[[40,41],[40,42]],We);
  foe('psarmour',47,42);foe('psarmour',55,44);foe('psarmour',60,42);foe('pscarver',51,43);foe('psdancer',45,44);foe('pscourtier',57,42);
  ghost('sculptor','p_ghost_sculptor',[[42,44],[58,44],[58,42],[42,42]],{sp:.28,lines:['Hold still. I am nearly done with your face.','Every one of them sat for me. They sat very still.']});
  /* ===== W. the Winter Bay: a small broken conservatory, vines and iron ===== */
  for(let x=47;x<=57;x++){if(x===52||x===53)continue;mark(x,36,'bay');mark(x,40,'iron')}
  mark(47,40,'bay');mark(56,40,'bay');
  put('fountain',52,38,{block:true});for(const [x,y] of [[49,39],[55,39]])put('gy_bench',x,y,{block:true});
  for(const [x,y] of [[47,38],[58,38],[50,38],[55,38]])put('ps_urn_pale',x,y,{block:true});
  for(const x of [49,51,54,56])put(P('rose_pale'),x,37,{});
  for(const x of [47,57])vine(x,37,N,'vine_a');
  foe('psfiend',50,39);foe('pscourtier',55,37);
  lamp(52,38,V,1.5,110);
  ghost('winter','p_ghost_lady',[[48,38],[56,38],[56,39],[48,37]],{sp:.2,lines:['The roses came back. Nobody planted them.']});
  /* ===== N. the Great Nave: tall, narrow, columns every two squares, aisles under a gallery ===== */
  for(let y=19,i=0;y<=37;y+=2,i++){col(29,y,i%3);col(35,y,(i+1)%3)}
  for(const y of [20,26,33]){mark(25,y,'win');mark(39,y-1,'win')}
  for(const y of [19,22,28,35]){mark(25,y,'iron')}for(const y of [20,27,33,36]){mark(39,y,'iron')}
  for(const y of [21,27,32,36])mark(25,y,'face');for(const y of [23,29,25])mark(39,y,'face');
  for(const y of [21,27,31]){wall(PB(),[[26,y]],We,{bob:hi});wall(PB(),[[38,y]],Ea,{bob:hi})}
  for(const y of [20,26,32,36])gar(38,y,Ea);
  for(const y of [19,25,29,35])gar(26,y,We);
  alc(25,37,'alcove_knight');alc(39,37,'alcove_weeper');mark(25,38,'face');mark(39,38,'face');
  for(const y of [22,28,34]){stat(27,y,y%5);stat(37,y,(y+1)%5)}
  for(const y of [21,27,33])put(P('urn_big'),37,y,{block:true});
  for(const y of [24,30,36])vine(26,y,We,'vine_b');
  // tall stained windows high in both nave walls, like the clerestory of a cathedral
  for(const y of [20,23,28,33])pic(P('window_stained_tall'),26,y,We,{bob:.55});for(const y of [22,24,29,34])pic(P('window_stained_tall'),38,y,Ea,{bob:.55});
  hang(32,21,1.9);hang(32,26,2.0);hang(32,31,2.0);hang(32,36,1.9);
  for(const y of [20,28,34])lamp(27,y,V,1.5,120);
  for(const [x,y] of [[31,22],[33,26],[31,30],[33,34]])put(P('furn_candelabra_black'),x,y,{block:true});for(const [x,y] of [[33,22],[31,26],[33,30]])put(P('urn_big'),x,y,{block:true});
  sign(29,38,So,'THE GREAT NAVE','Feast and dance of the old house');
  foe('psdancer',31,25);foe('psdancer',33,29);
  foe('pscourtier',27,21);foe('pscourtier',37,31);foe('psservant',36,25);foe('psservant',28,34);
  foe('psarmour',33,36);foe('psarmour',31,20);foe('psarmour',37,23);foe('pscarver',27,29);
  thing('hl_p_note','psh_seating',32,23,{sc:.5});
  // pews either side of the long aisle, a pulpit, and the ghost procession (a funeral that never reaches the end)
  for(const y of [20,21,26,27,32,33]){pew(28,y);pew(36,y)}
  put(P('furn_pulpit'),27,25,{block:true});put(P('furn_pulpit'),37,25,{block:true});put(P('furn_screen_tracery'),28,36,{block:true});put(P('furn_screen_tracery'),36,36,{block:true});
  ghost('monk1','p_ghost_monk',[[32,37],[32,20],[32,37]],{sp:.28,lines:['Requiem aeternam. We sing for the household.','The household does not hear us. We sing anyway.']});
  ghost('monk2','p_ghost_diner',[[32,34],[32,20],[32,37],[32,34]],{sp:.28,lines:['Light a candle. Not that one.']});
  ghost('monk3','p_ghost_maid',[[32,30],[32,20],[32,37],[32,30]],{sp:.28,lines:['Walk behind us. Do not walk in front.']});
  ghost('bride','p_ghost_bride',[[27,20],[27,36],[27,20]],{sp:.24,lines:['I was to be married at noon. The bells never rang.','Have you seen my groom? He went up the great stair.']});
  foe('pswraith',37,29);foe('pswraith',27,23);
  /* ===== D. the Dining Hall ===== */
  for(let x=9,i=0;x<=24;x+=3,i++){col(x,20,i);col(x,26,i+1)}
  for(let x=11;x<=21;x++){if((x-11)%5===2)put(P('furn_candelabra_black'),x,23,{block:true});else put(P('furn_table_long_black'),x,23,{block:true,sc:.8})}
  for(let x=12;x<=20;x+=2){put(P('furn_chair_dining_black'),x,22,{block:true});put(P('furn_chair_dining_black'),x,24,{block:true})}
  put(P('furn_throne_black'),9,23,{block:true});put(P('furn_chair_dining_black'),23,23,{block:true});
  pic(P('furn_fireplace_tall'),8,21,We,{bob:.35});lamp(9,22,[.7,1.15,.85],2.2,170);
  wall(PB(),[[12,19],[16,19],[20,19]],N,{bob:hi});pic('ps_pt_feast',14,19,N,{bob:hi});pic('ps_pt_hunt',18,19,N,{bob:hi});
  for(const x of [10,22])mark(x,18,'win');
  for(const x of [9,15,21])gar(x,27,So);
  for(const x of [10,24])vine(x,27,So,'vine_a');
  sign(11,27,So,'THE DINING HALL','Dinner at seven');
  hang(13,22,1.8);hang(19,24,1.8);
  foe('psservant',10,24);foe('psservant',22,21);foe('psservant',16,25);foe('pscourtier',19,22);foe('pscarver',23,25);foe('psarmour',9,25);
  // the dinner of the dead: diners at the table, a servant gliding along it with a tray
  for(const [i,x,y] of [[0,12,22],[1,16,22],[2,20,22],[3,14,24],[4,18,24],[5,10,24]])decor.push((()=>{const k='ps_gh_diner'+i,pk=P('p_ghost_diner');if(IMG[pk]){IMG[k]=IMG[pk];NPC_H[k]=NPC_H[pk]}GH.push({id:'diner'+i,pts:[[x,y]],sp:0,lines:i%2?['More wine. There is no wine. More wine.']:['Pass the salt. Pass the salt. Pass the salt.']});return {k,x,y,block:false,walk:true,deco:true,bob:.05}})());
  ghost('waiter','p_ghost_servant',[[10,24],[22,24],[22,21],[10,21]],{sp:.42,lines:['Dinner is served. Dinner has been served for a hundred years.']});
  put(P('furn_sideboard'),10,20,{block:true});put(P('furn_sideboard'),17,20,{block:true});put(P('furn_sideboard'),22,20,{block:true});put(P('furn_wardrobe'),8,26,{block:true});put(P('furn_clock_grandfather'),24,21,{block:true});
  /* ===== E. the Screens Passage ===== */
  for(let x=7,i=0;x<=23;x+=4,i++)col(x,31,i+1);
  for(const x of [9,13,21])put(P('furn_sideboard'),x,29,{});
  thing('hl_p_rack','psh_keyboard',23,30);
  wall(pt(60),[[8,31],[14,31],[20,31]],So,{bob:hi});
  pic('gy_hatch',15,31,So,{bob:.6});sign(17,31,So,'THE BUTTERY','The hatch is painted shut');
  sign(7,29,N,'THE SCREENS PASSAGE','West to the kitchens and armoury');
  sign(10,31,So,'STAIR','Up to the minstrels\' gallery');
  hang(13,30,1.6);hang(21,30,1.6);
  for(const x of [5,11,19,23])gar(x,31,So);
  foe('psservant',14,30);foe('psservant',20,29);foe('pscarver',17,30);foe('psarmour',6,29);
  ghost('trayA','p_ghost_diner',[[4,30],[22,30],[4,30]],{sp:.4,lines:['Mind your back, sir.']});
  ghost('trayB','p_ghost_maid',[[22,29],[5,29],[22,29]],{sp:.35,lines:['The soup is cold. It was always cold.']});
  /* ===== M. the Minstrels' Gallery (up the narrow stair): a balcony strip over the dining hall ===== */
  for(let x=10;x<=23;x++)if(x!==22)put(P('iron_rail'),x,33,{});
  for(const x of [12,17])col(x,34,2);
  put(P('furn_harpsichord_black'),10,35,{block:true});put(P('furn_chair_dining_black'),12,35,{block:true});put(P('furn_candelabra_black'),16,35,{block:true});
  for(const x of [9,13,19])mark(x,36,'face');
  for(const x of [11,15,19])vine(x,35,So,'vine_a');
  hang(14,34,1.6);lamp(20,34,V,1.5,110);
  foe('pscourtier',18,34);foe('psfiend',14,35);
  put('chest',24,33,{block:true,force:1});
  ghost('choir','p_ghost_choir',[[10,34],[22,34],[10,34]],{sp:.26,lines:['La la la... we have not finished the psalm.','Sing with us. Only the high part.']});
  put(P('furn_organ'),23,35,{block:true});
  /* ===== V. the Lower Vault (down the narrow stair): ribbed undercroft with hidden alcoves ===== */
  for(const x of [12,18])col(x,38,x/3|0);
  for(const x of [9,12,16,19])mark(x,36,'bay');
  for(const x of [10,14,18,21])mark(x,40,'bay');
  put(P('alcove_weeper'),10,37,{block:true});put(P('alcove_monk'),15,37,{block:true});put(P('alcove_knight'),20,37,{block:true});
  put(P('alcove_maiden'),20,39,{block:true});
  for(const x of [9,15,21])vine(x,39,So,'vine_b');
  put('hl_p_coffin',15,39,{block:true});put('hl_p_tomb',10,39,{block:true});
  lamp(15,38,V,1.4,110);
  foe('psarmour',14,38);foe('psarmour',19,38);foe('psfiend',11,38);
  put('chest',8,38,{block:true,force:1});
  ghost('prisoner','p_ghost_prisoner',[[10,38],[20,38]],{sp:.22,lines:['I was sealed in with the dead. Nobody came.','Is it still raining up there?']});
  foe('pswraith',16,38);
  /* ===== G. the Music Salon: a ring of columns round a dance floor ===== */
  for(const y of [8,10,12,14]){col(13,y,2);col(22,y,2)}for(const x of [15,17,19,21]){col(x,7,2);col(x,14,2)}
  thing(P('furn_harpsichord_black'),'psh_harp',12,11);  for(const x of [16,20])put(P('furn_chair_dining_black'),x,6,{block:true});
  for(const x of [13,17,21])pic(P('furn_mirror_gothic'),x,6,N,{bob:hi});for(const y of [9,13])pic(P('furn_mirror_gothic'),24,y,Ea,{bob:hi});
  for(const x of [12,24,15,19])mark(x,5,'face');
  for(const x of [14,18,22])gar(x,15,So);
  for(const x of [12,16,20])vine(x,15,So,'vine_a');
  wall(pt(140),[[13,15],[17,15],[21,15]],So,{bob:hi});
  thing(P('furn_lectern_black'),'psh_stand1',11,7);thing('ps_p_lutenist','psh_lutenist',12,14);
  sign(24,12,Ea,'THE MUSIC SALON','Dancing every night');
  for(const [x,y] of [[16,9],[20,12],[18,10]])hang(x,y,1.7,V);put(P('urn_big'),17,11,{block:true});put(P('furn_candelabra_black'),20,9,{block:true});put(P('furn_candelabra_black'),15,12,{block:true});
  for(const [x,y] of [[16,10],[20,10],[17,12],[19,9]])foe('psdancer',x,y);foe('pscourtier',23,7);
  decor.push((()=>{const k='ps_gh_harp',pk=P('p_ghost_lady');if(IMG[pk]){IMG[k]=IMG[pk];NPC_H[k]=NPC_H[pk]}GH.push({id:'harp',pts:[[13,11]],sp:0,lines:['It goes like this. And then it goes wrong.','I play it every night. No one comes to dance.'],music:1});return {k,x:13,y:11,block:false,walk:true,deco:true,bob:.04}})());
  ghost('waltzA','ghost_couple',[[16,9],[20,9],[21,12],[16,12]],{sp:.5,rest:'salon',lines:['One, two, three. One, two, three.']});
  ghost('waltzB','ghost_couple',[[20,12],[16,12],[16,9],[20,9]],{sp:.5,rest:'salon',lines:['You are standing in the dance.']});
  put(P('furn_bookcase'),11,12,{block:true});put(P('furn_bookcase'),11,14,{block:true});put(P('furn_clock_grandfather'),24,14,{block:true});put(P('furn_organ'),24,10,{block:true});put(P('furn_screen_tracery'),23,7,{block:true});
  /* ===== H. the Lady's Withdrawing Room (rest) ===== */
  thing(P('furn_bed_canopy'),'psh_bed',6,6);put('chest',8,5,{block:true});
  for(const x of [5,7,9])mark(x,3,'win');
  pic(P('furn_mirror_gothic'),4,8,We,{bob:hi});wall(pt(160),[[4,6],[4,9]],We,{bob:hi});pic(pt(161),9,10,So,{bob:hi});
  put(P('furn_candelabra_black'),4,10,{block:true});put(P('furn_candelabra_black'),8,10,{block:true});put('ps_urn_pale',9,5,{block:true});
  for(const [x,y] of [[5,8],[8,8],[6,4],[5,10],[9,9]])lamp(x,y,WM,1.9,140);
  put(P('furn_wardrobe'),9,6,{block:true});put(P('furn_cradle'),4,4,{block:true});put(P('furn_desk'),6,10,{block:true});put(P('furn_screen_tracery'),7,7,{block:true});put(P('furn_clock_grandfather'),9,4,{block:true});
  /* ===== I. the Grand Stair Hall ===== */
  for(const x of [29,31,33,35])mark(x,5,'win');mark(30,5,'pilaster');mark(34,5,'pilaster');mark(28,5,'ivy');mark(36,5,'ivy');mark(27,5,'face');mark(37,5,'face');
  for(let y=9;y<=16;y++){put('ps_balustrade',30,y,{block:true});put('ps_balustrade',34,y,{block:true})}
  put(PSH.st(3),30,8,{block:true});put(PSH.st(5),34,8,{block:true});
  for(const x of [27,29])pic(P('alcove_knight'),x,6,N,{bob:.2});
  for(const x of [35,37])pic(P('alcove_maiden'),x,6,N,{bob:.2});
  col(31,17,0);col(33,17,0);
  for(const y of [7,13])mark(25,y,'win');mark(25,10,'iron');mark(25,11,'face');
  gar(26,7,We);gar(38,6,Ea);
  wall(pt(200),[[26,6]],We,{bob:hi});wall(pt(210),[[38,7]],Ea,{bob:hi});
  sign(32,6,N,'UP THE GRAND STAIR','The way to the state rooms. Ask the Chamberlain.');sign(38,8,Ea,'THE AUDIENCE CHAMBER','The Sovereign receives no one');
  hang(32,11,2.3);hang(32,7,1.8,V);lamp(28,7,V,1.7,120);lamp(36,7,V,1.7,120);
  /* the way up: broad mossy steps rising to the great barred double door, chains and a padlock, cold light through the bars */
  put(P('iron_gate_big'),32,6,{block:false,force:true,sc:1.1,over:true});put(P('chains'),31,6,{block:false,force:true,over:true});put(P('chains'),33,6,{block:false,force:true,over:true});
  put(P('arch_stair'),32,8,{block:false,force:true,sc:1.2,over:true});for(const [x,y] of [[32,7]])put(P('stairs_moss'),x,y,{block:false,force:true,over:true});
  pic(P('vine_b'),31,6,N,{bob:.9});pic(P('vine_a'),33,6,N,{bob:.9});pic(P('banner_long_a'),30,6,N,{bob:hi});pic(P('banner_long_b'),34,6,N,{bob:hi});lamp(32,6,[.7,1.0,1.9],2.2,150);lamp(32,9,[.7,1.0,1.8],1.6,110);
  foe('psstairwarden',32,13);
  put(P('furn_organ'),28,7,{block:true});put(P('furn_altarpiece'),36,7,{block:true});put(P('furn_clock_grandfather'),27,8,{block:true});
  ghost('maid','p_ghost_maid',[[28,7],[36,7],[36,8],[28,8]],{sp:.22,clue:2,lines:['They took the key down to where the lamps do not burn.','He went up the stair and never came down.','I wash the steps every night. They will not stay clean.']});
  /* ===== F. the Banqueting Hall ===== */
  for(let x=42,i=0;x<=58;x+=4,i++){col(x,27,i);col(x,34,i+1)}
  for(let k=0;k<5;k++){put('ps_p_courtier'+(k+1),43+k*3,29,{block:true,npc:'psh_guest'+k})}
  for(let k=0;k<4;k++){put('ps_p_courtier'+(k+2),44+k*3,31,{block:true,npc:'psh_guest'+(5+k)})}
  for(let x=42;x<=55;x++){if((x-42)%5===2)put(P('furn_candelabra_black'),x,30,{block:true});else put(P('furn_table_long_black'),x,30,{block:true,sc:.8})}
  for(let x=43;x<=55;x+=2){put(P('furn_chair_dining_black'),x,29,{block:true});put(P('furn_chair_dining_black'),x,31,{block:true})}
  thing(P('furn_chair_dining_black'),'psh_headchair',41,30);thing('hl_p_note','psh_sheet3',56,30,{sc:.5});
  for(let x=41;x<=59;x++)if(x!==50&&x!==51)put('ps_balustrade',x,26,{block:true});
  for(const x of [43,47,55,59])pic(PB(),x,26,N,{bob:hi});
  for(const x of [41,45,49,53,57])mark(x,25,'win');
  for(const x of [42,52,58])mark(x,25,'face');
  for(const y of [27,29,32,34])pic(pt(80+y),60,y,Ea,{bob:hi});for(const x of [42,45,48,51,54,57])pic(pt(100+x),x,35,So,{bob:hi});
  for(const x of [43,50,57])gar(x,35,So);
  for(const x of [44,56])vine(x,35,So,'vine_a');
  sign(46,35,So,'THE BANQUETING HALL','The State Dining Room');
  for(const [x,y] of [[46,28],[52,28],[46,33],[52,33]])hang(x,y,1.9,V);
  foe('psdancer',48,33);foe('psdancer',55,33);foe('pscourtier',44,33);foe('pscourtier',57,27);foe('pscarver',50,27);foe('pscarver',59,34);foe('psarmour',41,34);
  ghost('ball1','ghost_couple',[[42,33],[58,33],[58,28],[42,28]],{sp:.55,lines:['The last waltz. Do not let the music stop.']});
  ghost('ball2','ghost_couple',[[58,28],[42,28],[42,33],[58,33]],{sp:.55,lines:['May I have this dance? I have asked for a hundred years.']});
  ghost('ball3','ghost_couple',[[50,33],[50,28],[56,31],[44,31]],{sp:.5,lines:['They are all looking at you.']});
  foe('psofficer',57,33);foe('psofficer',41,33);
  /* ===== J. the Trophy and Hunting Hall ===== */
  for(const x of [44,56]){col(x,19,1);col(x,23,1)}
  for(let x=44;x<=56;x++){if((x-44)%4===2)put(P('furn_candelabra_black'),x,21,{block:true});else put(P('furn_table_long_black'),x,21,{block:true,sc:.8})}
  for(let x=45;x<=55;x+=2){if(x===49)continue;put(P('furn_chair_dining_black'),x,20,{block:true});put(P('furn_chair_dining_black'),x,22,{block:true})}
  put(P('furn_throne_black'),50,18,{block:true});
  for(const x of [42,46,54,58])pic(P('trophy_stag'),x,18,N,{bob:1.4});
  for(const y of [19,21,23])pic('ps_pt_hunt',60,y,Ea,{bob:hi});for(const x of [43,48,53,58])pic(x%2?PB():'ps_pt_battle',x,24,So,{bob:hi});
  for(const x of [41,59])put('hl_p_cage',x,24,{block:true});
  for(const x of [41,46,55,59])mark(x,17,'face');
  put('chest',59,19,{block:true});sign(46,24,So,'THE TROPHY AND HUNTING HALL','The Sovereign hunted here');
  for(const [x,y] of [[47,20],[53,22]])hang(x,y,1.8);
  foe('psantlered',50,19);foe('psarmour',43,22);foe('psarmour',58,22);foe('pscarver',57,19);
  for(const [x,y] of [[45,23],[55,23],[43,19],[57,21]])foe('pshhound',x,y);
  thing('hl_p_note','psh_huntbook',49,23,{sc:.5});

  ghost('hunter','p_ghost_hunter',[[42,22],[58,22],[58,20],[42,20]],{sp:.34,lines:['Hounds! Where are the hounds?','The quarry was not an animal.']});
  ghost('hhound','ghost_hound',[[44,22],[58,22],[58,20],[44,20]],{sp:.34,sc:1});
  foe('psofficer',43,22);
  /* ===== the long-abandoned house: sheets, webs, mirrors, ancestors, candles, red lanterns ===== */
  {const taken=new Set();for(const d of decor)if(d.wd)taken.add(d.x+','+d.y+','+d.wd[0]+','+d.wd[1]);let mi=0,pi=0;
   pshHaunt({W:S.W,H:S.H,seed:9740,pi:3,open:(x,y)=>open(x,y),free:(x,y)=>S.fr(x,y)&&!S.keep.has(x+','+y),wall:(x,y,a,b)=>g[y+b]&&g[y+b][x+a]==='#'&&S.over[(x+a)+','+(y+b)]===undefined,taken:(x,y,a,b)=>taken.has(x+','+y+','+a+','+b),
     stand:{portrait:(i)=>pshPortrait(20+i)},
     counts:{mirror:9,portrait:16,sheetwin:9,cobcorner:20,cobthick:9,candles:14,redlamp:11,dust:9,spider:5},
     wallPic:(k,x,y,wd,o)=>{const oo={bob:o.bob};if(o.mirror!==undefined)oo.npc='psh_mir'+(mi++%12);else if(o.portrait!==undefined&&(pi++%2===0))oo.npc='psh_ancp'+(pi%8);const d=pic(k,x,y,wd,oo);return !!d},
     floorProp:(k,x,y,o)=>!!put(k,x,y,o),
     light:(x,y,c)=>lamp(x,y,c,1.3,70)})}}

/* ---------- doors ---------- */
function pshSelfMove(a){G.talk=null;sfx('door');G.P.x=a[0];G.P.y=a[1];G.P.f=a[2];G.P.angT=(a[2]-1)*Math.PI/2;G.C={x:a[0],y:a[1],a:G.P.angT};try{reveal()}catch(e){}}
/* ---------- the hunt for the Second Floor Key: graded clues (F.keyClue 1 = not on this floor, 2 = sent below with the guard, 3 = in the Oubliette); the key itself lies in the Oubliette 9800 ---------- */
const PSH_CLUE_MSG={1:'Journal: the Second Floor Key is not on this floor.',2:'Journal: the upper keys went down with the guard.',3:'Journal: the Second Floor Key lies in the Oubliette, at the very bottom of the dungeons.'};
function pspClue(n,text){const F=pshF();if(text)msg(text,'#e8dcc0');if((F.keyClue|0)<n){F.keyClue=n;if(typeof qSt==='function'&&qSt('psq10')==='active')msg(PSH_CLUE_MSG[n],'#ffe36a')}}
function pshDoor(d,nx,ny){
  const F=pshF();
  if(d.psh==='link'){const l=d.link;
    if(l.lock){
      if(bagCount(l.lock)<=0){sfx('locked');msg('An iron-bound double door with a great silver lock, chained and padlocked. It will not move. The key is not on this floor. Look below.','#c8c4e8');pspClue(1);
        if(typeof QUESTS!=='undefined'&&QUESTS.psq10&&qSt('psq10')===null){qAccept('psq10');msg('The Chamberlain in the Entrance Hall may know where the key is kept.','#ffe36a')}return true}
      if(!F.stairOpen){F.stairOpen=1;msg('The silver key turns in the lock without a sound. The door opens inward.','#dcd4ff')}}
    if(!LEVELS[l.to]&&!KH_LAZY[l.to]){sfx('locked');msg('The way beyond is not open yet.','#c8c4e8');return true}
    if(!LEVELS[l.to])try{KH_LAZY[l.to]()}catch(e){console.error(e)}
    sfx('door');goToLevel(l.to,{x:l.land[0],y:l.land[1],f:l.land[2]});return true}
  if(d.psh==='warp'){const px=G.P.x,py=G.P.y,da=Math.hypot(px-d.A[0],py-d.A[1]),db=Math.hypot(px-d.B[0],py-d.B[1]),toB=da<db,into=toB?d.B:d.A;pshSelfMove(into);const m=toB?d.msgB:d.msgA;if(m)msg(m,'#f0c890');return true}
  if(d.psh==='closet'){if(F.closetOpen||bagCount('pskeyclo')>0){F.closetOpen=1;if(G.grid[ny][nx]!==0)G.grid[ny][nx]=0;sfx('door');msg("The brass key turns. The painters' closet is open.",'#e8dcc0');return true}
    sfx('locked');msg("A small door with a brass lock. A sign on it says PAINTERS. It is locked.",'#c8c4e8');return true}
  if(d.psh==='barred'){sfx('locked');msg("The Sovereign's audience chamber. Sealed.",'#c8c4e8');return true}
  if(d.psh==='niche'){if(F[d.flag]){if(G.grid[ny][nx]!==0)G.grid[ny][nx]=0;return true}sfx('bump');msg('A wall of cold stone. Nothing else.','#a8a8b8');return true}
  return false}
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];if(d&&d.psh)return pshDoor(d,nx,ny);return _k.apply(this,arguments)}}
/* arrival: hidden chests and opened secret doors follow the flags; the party is told where it is */
function pshApply(){
  const F=pshF();if(!G.decor||!G.grid)return;
  for(const h of PSH_HIDDEN){const [x,y]=h.chest,on=!!F[h.flag];for(const d of G.decor)if(d.k==='chest'&&d.x===x&&d.y===y){d.found=!on;d.hidden=!on;if(!on)d.block=false}if(on&&G.grid[h.door[1]])G.grid[h.door[1]][h.door[0]]=0}
  if(F.waltz)pshHideGhosts('salon');
  if(F.closetOpen&&G.grid[42])G.grid[42][5]=0}
function pshArrive(n){try{pshApply()}catch(e){console.error('pshApply',e)}}
/* ---------- the haunting: ghosts drift along their loops through the furniture, whisper a plain line when the party is close, run away if shy, and make the candles gutter when they pass ---------- */
PSH.chill=0;
function pshHideGhosts(tag){if(!G.decor)return 0;const V=LEVELS[PSH.ID]&&LEVELS[PSH.ID]._psh;let n=0;for(const d of G.decor){if(!d.k||d.k.indexOf('ps_gh_')!==0)continue;const D=V&&V.gdata[d.k.slice(6)];if(D&&D.rest===tag){d.hidden=true;d.found=true;n++}}return n}
function pshGhostTick(dt){
  const L=LEVELS[PSH.ID],V=L&&L._psh;if(!V||!G.decor||dt>.5)return;
  const px=G.P.x,py=G.P.y,t=G.time,near=[];
  for(const d of G.decor){
    if(!d.k||d.k.indexOf('ps_gh_')!==0||d.hidden)continue;
    const D=V.gdata[d.k.slice(6)];if(!D)continue;
    const g=d._g||(d._g={i:1,pause:0,say:-99,li:0,flee:0,seed:(d.x*7+d.y*13)%6.28});
    const dxp=d.x-px,dyp=d.y-py,dp=Math.hypot(dxp,dyp);
    // move along the loop
    if(D.pts.length>1&&D.sp>0){
      if(g.pause>0)g.pause-=dt;else{
        let tx,ty;
        if(D.shy&&dp<4.2){ // runs from the party: to the end of its loop that is farthest from the party
          let bd=-1,bp=D.pts[0];for(const q of D.pts){const dd=Math.hypot(q[0]-px,q[1]-py);if(dd>bd){bd=dd;bp=q}}tx=bp[0];ty=bp[1];g.flee=1}
        else{const q=D.pts[g.i%D.pts.length];tx=q[0];ty=q[1];g.flee=0}
        const ex=tx-d.x,ey=ty-d.y,el=Math.hypot(ex,ey),sp=D.sp*(g.flee?2.4:1)*dt;
        if(el<=sp+.02){d.x=tx;d.y=ty;if(!g.flee){g.i=(g.i+1)%D.pts.length;if(!D.shy&&Math.random()<.35)g.pause=2+Math.random()*3}}else{d.x+=ex/el*sp;d.y+=ey/el*sp}}}
    d.bob=(D.sp>0?.12:.04)+.05*Math.sin(t*1.4+g.seed);
    if(dp<6)near.push([d.x,d.y,dp]);
    // whisper
    if(D.lines&&dp<2.4&&t-g.say>16+(g.li%3)*4){g.say=t;const line=D.lines[g.li%D.lines.length];g.li++;
      msg('"'+line+'"','#b4d0e8');PSH.chill=t;
      if(D.clue)pspClue(D.clue);
      if(D.music){try{if(typeof tone==='function'){const n=[392,440,494,587,523,440,392];n.forEach((f,i)=>{tone(f,f*.99,.5,'triangle',.04,i*.5)})}}catch(e){}}
      else if(g.li%2){try{sfx('rattle')}catch(e){}}}}
  // candles gutter near ghosts, and a cold breath is felt now and then
  if(typeof LIGHTS!=='undefined'){
    for(const l of LIGHTS){if(!l.free||l.lamp)continue;if(l._k0===undefined)l._k0=l.kI||1.35;let f=1;
      for(const q of near){const dd=Math.hypot(l.x-q[0]-.5,l.y-q[1]-.5);if(dd<6){const a=1-dd/6;f=Math.min(f,1-a*.6*(.5+.5*Math.sin(t*19+l.x*3.1+l.y*1.7)))}}
      l.kI=l._k0*Math.max(.25,f)}}
  if(near.length&&near.some(q=>q[2]<3)&&t-(PSH.coldT||-99)>40){PSH.coldT=t;msg('The air turns cold, and the candles lean away.','#9cc0e0')}
}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);try{if(pshIs(LEVEL)&&G&&G.state==='play')pshGhostTick(dt)}catch(e){console.error('psh ghosts',e)}return r}}
/* ---------- helpers ---------- */
function pshGive(item){if(!bagAdd(mkItem(item)))G.items.push({k:item,x:Math.round(G.P.x),y:Math.round(G.P.y),taken:false})}
function pshDismiss(pred){let n=0;for(const e of G.enemies||[])if(e.hp>0&&!e.dying&&pred(e)){e.hp=0;e.dying=.55;n++}return n}
function pshTake(id,name,pic,flag,item,before,after,btn,done){
  khNpc(id,name,pic,d=>{const F=pshF();if(F[flag])return say(after,[BYE]);
    return say(before,[[btn,()=>{F[flag]=1;pshGive(item);sfx('key');msg(done,'#ffe36a');G.talk=null;return null}],BYE])});}
const pshTalk=(id,name,pic,text)=>khNpc(id,name,pic,()=>say(text,[BYE]));
for(let i=0;i<12;i++)khNpc('psh_mir'+i,'A mirror','ps_mirror_haunted_a',()=>say(PSH_MIRROR_LINES[i%PSH_MIRROR_LINES.length],[BYE]));
for(let i=0;i<8;i++)khNpc('psh_ancp'+i,'A portrait','ps_portrait_ancestor_'+(1+i%8),()=>say(PSH_ANCESTOR_LINES[i%PSH_ANCESTOR_LINES.length],[BYE]));
const pshCount=o=>Object.keys(o||{}).length;
/* ---------- quests and people ---------- */
{const kc=()=>pshF().keyClue|0,hasKey=()=>!!pshF().key2||bagCount('pskey2')>0;
  const S=[['',()=>kc()>=1||hasKey()||!!pshF().stairOpen,['psh_chamberlain']],['',()=>kc()>=2||hasKey()||!!pshF().stairOpen,['psh_chamberlain']],['',()=>hasKey()||!!pshF().stairOpen,['psh_chamberlain']],['',()=>!!pshF().stairOpen,['psh_chamberlain']]];
  const T=[()=>'Find the Second Floor Key. Try the chained iron-bound door at the top of the Grand Stair, then ask around: ledgers, books, ghosts and the prisoners may remember where the keys went.',
    ()=>'The Second Floor Key is not on this floor. Find word of where the upper keys went: a ledger in the service wing, the library, a chaplain note, a ghost, a prisoner.',
    ()=>kc()>=3?'The upper keys went down with the guard. The key lies in the Oubliette, at the very bottom of the dungeons. Fight your way down and open the strongbox on the dais.':'The upper keys went down with the guard. Find out where: the gaoler log book in the Undercroft Gaols, the prisoners, the sacristy journal.',
    ()=>'You have the key. Open the chained Grand Stair door at the north end of the Great Halls.'];
  S.forEach((s,i)=>Object.defineProperty(s,'0',{get:T[i]}));
  yrQ('psq10','Up the Grand Stair','The Chamberlain, in the Entrance Hall',S,{gold:8000,xp:50000,items:['potion6','potion6']})}
yrQ('psq11','The Wrong Waltz','The Lutenist, in the Music Salon',[
  ['Find the three sheets of the waltz: one on the stand in the Music Salon, one on the lectern in the Gallery of Portraits, one on the high table of the Banqueting Hall.',()=>!!(bagCount('pssheet1')&&bagCount('pssheet2')&&bagCount('pssheet3'))||!!pshF().waltz,['psh_stand1','psh_stand2','psh_sheet3']],
  ['Play the three sheets at the harpsichord in the Music Salon.',()=>!!pshF().waltz,['psh_harp']]],{gold:6500,xp:40000,items:['pslutering']});
yrQ('psq12',"The Curator's Count",'The Curator, in the Hall of Statues',[
  ['Read the nameplates of six statues in the Hall of Statues, so that the Curator can have them counted and named.',()=>pshCount(pshF().pl)>=6,['psh_pl0','psh_pl1','psh_pl2','psh_pl3','psh_pl4','psh_pl5']]],{gold:5000,xp:30000,items:['potion6']});
khNpc('psh_chamberlain','The Chamberlain (a ghost)','ps_p_chamberlain',()=>say('Good evening. Or good morning. I have lost the habit of telling them apart. I am the Chamberlain of this house, and I am afraid the house is closed. The Sovereign and the whole household went up the Grand Stair long ago, and the stair has been locked ever since. I cannot open it myself. I cannot open anything, now.',[
  ['What is this place?',()=>say('The Great Halls, the ground floor of the main block. The Great Nave is straight ahead, tall and narrow, and the Grand Stair is at the far end of it. The Gallery of Portraits is west of this hall and the Hall of Statues is east. The Dining Hall, the Music Salon and the Screens Passage open off the west side of the nave, and the Banqueting Hall and the Hunting Hall off the east side. The service wing is beyond the Screens Passage, and the cloister and chapel are beyond the Banqueting Hall.',[BYE])],BYE]));
for(const q of ['psq10','psq11','psq12'])QAREA[q]=PSP.REGION;   // after yrQ, which files them under Yarrim
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids});
  QRF.T.psq10={give:[N(9740,'psh_chamberlain')],act:[N(9740,'psh_chamberlain')],ready:[N(9740,'psh_chamberlain')]};
  QRF.T.psq11={give:[N(9740,'psh_lutenist')],act:[N(9740,'psh_lutenist')],ready:[N(9740,'psh_lutenist')]};
  QRF.T.psq12={give:[N(9740,'psh_curator')],act:[N(9740,'psh_pl0','psh_pl1','psh_pl2','psh_pl3','psh_pl4','psh_pl5')],ready:[N(9740,'psh_curator')]}}
blGiveOpt('psh_chamberlain','psq10',()=>true,{
  offer:'There is a door at the north end of the Great Halls, at the top of the Grand Stair, with a silver lock. The Sovereign sent for the key when the household went up, and nobody ever brought it back. If the key could be found, the stair could be opened. I would like to know that somebody had tried. Will you look for it?',
  accept:'Thank you. The keys of the upper floors were always sent for safekeeping, and I do not remember where. Try the door, read what the household left behind, ask the ghosts and the prisoners. I am a ghost, and ghosts forget.',
  remind:()=>pshF().stairOpen?'Go back to the Chamberlain: the door is open.':(pshF().keyClue|0)>=3?'The key lies in the Oubliette, at the bottom of the dungeons. Then open the iron-bound door at the north end of the Great Halls.':'The key to the Grand Stair is not on this floor. Look below: ledgers, books, ghosts and prisoners will tell you more.',
  ready:'You have opened it. I heard the lock turn from here, and I think I have not heard a sound so good in a hundred years.',
  thanks:'The household is up there still. Mind them. Take this, it is the last of the kitchen stores.',
  after:'The stair is open. I will stay here, in case anyone comes back down.'});
khNpc('psh_lutenist','The Lutenist (a ghost)','ps_p_lutenist',()=>say('Shh. Listen. Do you hear it? The waltz in the walls. It is wrong. It was always wrong, but now it will not stop, and the dancers will not stop either.',[
  ['Who are the dancers?',()=>say('Courtiers of the house. They danced here on the night the household went up the stair, and they have danced since. They do not know they are dead.',[BYE])],BYE]));
blGiveOpt('psh_lutenist','psq11',()=>true,{
  offer:'I wrote a waltz for the last ball. Three sheets: one for this salon, one for the Gallery of Portraits and one for the Banqueting Hall, where the high table stood. The sheets were scattered, and now the waltz is only half played, over and over, in the walls. If you could find all three and play them through at the harpsichord, I think the dancers would be allowed to rest.',
  accept:'The sheet for this room is on the music stand in the corner. The Gallery sheet is on a lectern at the east end of the Gallery of Portraits. The last one lies on the high table in the Banqueting Hall, east of the Great Hall. Play them on the harpsichord when you have all three.',
  remind:()=>(bagCount('pssheet1')+bagCount('pssheet2')+bagCount('pssheet3'))+' of 3 sheets. The Salon stand, the Gallery lectern, the Banqueting Hall table. Then the harpsichord.',
  ready:'You have played it. The walls are quiet. For the first time since the ball, they are quiet.',
  thanks:'Take this ring. It was given to me by the old Queen. I will not be needing it.',
  after:'The salon is quiet. A few of the courtiers still stand about, but they no longer dance.'});
khNpc('psh_curator','The Curator (a ghost)','ps_p_curator',()=>say('Mind the plinths. The statues of this hall are the pride of the house: the founders in the bays on the left, the monsters of the old wars on the right. The count has not been kept since I died.',[BYE]));
blGiveOpt('psh_curator','psq12',()=>true,{
  offer:'I never finished the count. The plinths bear names, if the dust is wiped off. If you would read six of them, I could close the book. Any six will do, and they are along both walls, in the arched bays.',
  accept:'Thank you. Stand in front of a statue and look at the plinth. Six names, and then come back to me.',
  remind:()=>pshCount(pshF().pl)+' of 6 plinths read.',
  ready:'Six names. The Founder, the Hydra, the Judge: I knew them all. The count is closed.',
  thanks:'Here, a little something from the Curator\'s purse.',
  after:'The count is closed. I like to look at them just the same.'});
/* the six plinths of psq12 and the two kings of the entrance hall */
const PSH_PL=[
  ['KING ALDWIN THE FOUNDER','A plinth of grey stone. The nameplate reads KING ALDWIN THE FOUNDER, WHO RAISED THE FIRST TOWER. The stone king holds a trowel instead of a sword.'],
  ['THE HYDRA OF MARWEN','The nameplate reads THE HYDRA OF MARWEN, SLAIN AT THE FORD BY SIR ROLAND. The statue has five necks, and every head has been carved looking at the door.'],
  ['QUEEN ISOLDE THE LATE','The nameplate reads QUEEN ISOLDE THE LATE, WHO WAS ALWAYS AFTER THE FEAST. Her stone hands are open, as if she were waiting for a cup.'],
  ['THE JUDGE OF HORNS','The nameplate reads THE JUDGE OF HORNS, WHO SAT AT THE OLD ASSIZE. A heavy statue with ram horns and a pair of scales, and one of the pans is missing.'],
  ['THE HEADLESS KNIGHT','The nameplate reads SIR EDMUND, WHO WOULD NOT BOW. The statue kneels and has no head at all. The neck has been cut smooth, and the cut has been polished.'],
  ['THE HOUND OF THE HUNT','The nameplate reads BRAN, FIRST HOUND OF THE SOVEREIGN. The marble hound looks very alive, and has been set facing the door.']];
PSH_PL.forEach((p,i)=>khNpc('psh_pl'+i,p[0],'ps_hst'+(i%5),()=>{const F=pshF();F.pl=F.pl||{};const first=!F.pl[i];F.pl[i]=1;return say(p[1]+(first&&qSt('psq12')==='active'?' ('+pshCount(F.pl)+' of 6 plinths read.)':''),[BYE])}));
pshTalk('psh_anc1','A statue of an ancestor','ps_hst1','A tall statue on a plinth. The nameplate reads KING OSRIC THE FIRST, 220 YEARS BEFORE THE LAST. The stone face is calm. The eyes were once painted, and the paint has gone.');
pshTalk('psh_anc2','A statue of an ancestor','ps_hst2','A statue of a queen with a crown of stone leaves. The nameplate reads QUEEN MAUD, MOTHER OF THE SOVEREIGN. Somebody has left a dry white rose at her feet, a long time ago.');
pshTalk('psh_suitA','A suit of armour','ps_suit_armour','A suit of plate armour on a wooden stand. The visor is down. It does not move, and neither does the dust on it.');
pshTalk('psh_notice','A notice','hl_p_note','A notice board of the household. It reads: HOUSEHOLD ORDERS. DINNER AT SEVEN IN THE GREAT HALL. SERVANTS TO USE THE SCREENS PASSAGE. NO ONE TO GO UP THE GRAND STAIR WITHOUT THE KEY. The last line has been underlined twice.');
pshTalk('psh_seating','The seating of the house','hl_p_note','A card of seating for the Great Hall: the long tables for the household and guests, the high table on the dais for the Sovereign. There is a name for every chair, and every name has been struck out with a single line.');
pshTalk('psh_huntbook','The hunt book','hl_p_note','A heavy book chained to the table. It lists the hunts of the Sovereign, one line each: the date, the quarry, the hounds. The last line reads: THE QUARRY WAS NOT AN ANIMAL. HOUNDS RETURNED. HUNTER DID NOT.');
pshTalk('psh_easel','An easel','hl_p_lectern',"An easel with a half-finished picture on it. It shows a woman at a window, and the face has never been painted. The brushes beside it are dry. A note is pinned to the easel: THE LAST PORTRAIT. FRAME NINE. I WILL FINISH IT TOMORROW.");
khNpc('psh_isaude','A portrait of Lady Isaude Marwen','ps_pt_isaude',()=>{const F=pshF();
  if(F.signet)return say('The portrait of Lady Isaude Marwen: a calm woman in a dark gown with a small gold heron on her hand. The back of the frame is bare, and so is the wall behind it.',[BYE]);
  return say('The portrait of Lady Isaude Marwen: a calm woman in a dark gown. A small gold heron is painted on her hand, and the painted ring has a real shine. The frame is loose on the wall.',[['Look behind the frame.',()=>{F.signet=1;pshGive('pssignet');sfx('key');msg("A gold signet ring cut with a heron lies in a gap behind the frame. You take it.",'#ffe36a');G.talk=null;return null}],BYE])});
khNpc('psh_emptyframe','An empty frame','ps_pt_empty',()=>{const F=pshF();
  if(F.framePainted)return say('The gold frame now holds a picture of a woman at a window. The paint is still wet in places. Somewhere nearby, stone is grinding.',[BYE]);
  const pal=bagCount('pspalette')>0||bagCount('psgauntpalette')>0||bagCount('psgaunt')>0||F.palette;
  return say('A gold frame with nothing in it, hanging by itself. A little brass plate says: THE LAST PORTRAIT. NOT YET PAINTED.',pal?[['Paint the frame with the painter\'s palette.',()=>{pshPaintFrame();return null}],BYE]:[BYE])});
function pshPaintFrame(){const F=pshF();if(F.framePainted)return false;F.framePainted=1;G.talk=null;sfx('door');msg('You paint the empty frame with the court painter\'s palette. A wall nearby grinds open, and a niche shows behind it.','#ffe36a');pshApply();return true}
khNpc('psh_pigments','A shelf of pigments','hl_p_shelf',()=>say('The shelf is empty, except for dry brushes and dust.',[BYE]));
{const n=NPCS.psh_pigments,old=n.root;n.root=d=>{const F=pshF();if(F.pigments)return old(d);return say('A shelf of small clay pots, each with a dab of colour on the lid. Three pots have a violet mark scratched on them, as if set aside.',[['Take the three marked pots.',()=>{F.pigments=1;pshGive('pspigment');pshGive('pspigment');pshGive('pspigment');sfx('key');msg('You take three pots of pigment.','#ffe36a');G.talk=null;return null}],BYE])};if(KH_KEEPERS.psh_pigments)KH_KEEPERS.psh_pigments.root=n.root}
pshTake('psh_keyboard','A board of key hooks','hl_p_rack','closetKey','pskeyclo','A board of brass hooks, each with a paper label: LARDER, PANTRY, SILVER, CELLAR. All the hooks are empty but one. The label on it says PAINTERS, and the key hangs there on a loop of string.','The hooks are empty. A paper label still says PAINTERS, over a bare nail.','Take the key marked PAINTERS.','You take a small brass key marked PAINTERS.');
pshTake('psh_stand1','A music stand','hl_p_lectern','sheet1','pssheet1','A music stand with a single sheet on it, written for the harpsichord. The title is in neat hand: WALTZ FOR THE LAST BALL, THE SALON.','The music stand is bare.','Take the sheet.','You take the first sheet of the waltz.');
pshTake('psh_stand2','A lectern','hl_p_lectern','sheet2','pssheet2','A lectern with a sheet of music clipped to it: WALTZ FOR THE LAST BALL, THE GALLERY.','The lectern is bare.','Take the sheet.','You take the second sheet of the waltz.');
pshTake('psh_sheet3','A sheet of music on the table','hl_p_note','sheet3','pssheet3','A sheet of music lying on the high table among the plates: WALTZ FOR THE LAST BALL, THE BANQUET.','Only crumbs and old wine rings are left on the table here.','Take the sheet.','You take the third sheet of the waltz.');
khNpc('psh_harp','A harpsichord','ps_harpsichord',()=>{const F=pshF();
  if(F.waltz)return say('The harpsichord is quiet. The strings have a faint violet bloom on them, like frost.',[BYE]);
  const all=bagCount('pssheet1')&&bagCount('pssheet2')&&bagCount('pssheet3');
  if(!all)return say('A harpsichord with a cracked lid. A music desk stands open on it, with room for three sheets of music. You have '+(bagCount('pssheet1')+bagCount('pssheet2')+bagCount('pssheet3'))+' of the three.',[['Press a key.',()=>say('One high note rings, then another, then the rest of the notes try to follow it and give up. It is the wrong waltz, and there is a gap in it the size of a sheet.',[BYE])],BYE]);
  return say('Three sheets of music, ready on the desk. The harpsichord is cold.',[['Play the waltz.',()=>{F.waltz=1;G.talk=null;try{if(typeof tone==='function'){const n=[392,440,494,587,523,440,392,330];n.forEach((f,i)=>{tone(f,f*.99,.5,'triangle',.05,i*.45);tone(f/2,f/2,.5,'sine',.03,i*.45)})}}catch(e){}
    const n=pshDismiss(e=>e.t==='psdancer'&&e.x<26&&e.y<18)+pshHideGhosts('salon');msg('The waltz comes out whole this time. In the walls, in the floor, the other half of the tune answers and falls quiet.'+(n?' The dancing dead stop, one by one, and fade away.':''),'#ffe36a');sfx('level');return null}],BYE])});
khNpc('psh_bed','A four-poster bed','ps_bed_four',()=>say('A great four-poster bed with violet curtains, made up fresh. The candles in the room burn with a warm yellow flame, the only warm light in the castle. Nothing in this room has ever moved.',[['Rest.',()=>{G.talk=null;if(typeof restParty==='function')restParty(true);return null}],BYE]));
pshTalk('psh_turner','A statue of a monster','ps_hst7','A heavy statue on a plinth beside a plain stretch of wall. The plinth has an iron ring set into its side, worn bright.');
{const n=NPCS.psh_turner,old=n.root;n.root=d=>{const F=pshF();if(F.statueTurned)return say('The statue has been turned. Beside it, a niche stands open in the wall.',[BYE]);
  return say('A heavy statue on a plinth beside a plain stretch of wall. The plinth has an iron ring set into its side, worn bright, and a scrape on the floor shows that it has been turned before.',[['Turn the statue by the ring.',()=>{F.statueTurned=1;G.talk=null;sfx('door');msg('The statue turns on its plinth with a grinding sound. A niche opens in the wall beside it.','#ffe36a');pshApply();return null}],BYE])};if(KH_KEEPERS.psh_turner)KH_KEEPERS.psh_turner.root=n.root}
/* the ghosts at the banquet: they do not move until the party sits at the head of the table */
const PSH_GUESTS=['The guest is a pale lady in a long gown. She holds a cup to her lips and does not drink.','A pale man in a doublet sits straight, looking at the empty plate in front of him, and smiling at it.','An old courtier, his chin on his chest. His hands rest on the table either side of a goblet that has dried to a ring.','A pale lady turns the stem of her glass between her fingers. She does not look at you. She is listening to something far away.','A courtier in a feathered hat sits very still. The feather moves, slowly, as if in a draught, though the air is quiet.','A young woman in a grey gown stares at the high table. The chair at the head is empty. She is waiting.','An old man with a white beard raises a hand to speak, and has been raising it for a hundred years.','A lady with a fan, fanning nothing.','A pale man with his napkin tucked in, a fork in his hand, and nothing on the fork.'];
for(let i=0;i<9;i++)khNpc('psh_guest'+i,'A ghost at the table','ps_p_courtier'+((i%5)+1),()=>say(PSH_GUESTS[i]+' It does not answer.',[BYE]));
khNpc('psh_headchair','The head of the table','ps_chair_high',()=>{const F=pshF();
  if(F.banquet)return say('The head of the table. The chair is pulled out, and the plates are empty.',[BYE]);
  return say('A tall chair at the head of the long table, pulled out as if the host had just risen. Every ghost at the table is facing it, and none has moved.',[['Sit down.',()=>{F.banquet=1;G.talk=null;sfx('rattle');
    const L=[[44,28],[50,28],[56,28],[54,32],[46,33],[50,33]];let n=0;for(const [x,y] of L){if(bl3Add(n%3===0?'psdancer':'pscourtier',x,y,101))n++}
    for(let i=0;i<9;i++){for(const d of G.decor)if(d.npc==='psh_guest'+i){d.found=true;d.hidden=true;d.block=false}}
    msg('As you sit, every chair scrapes back at once. The guests stand, all together, and turn to look at you.','#ffd0d0');return null}],BYE])});
/* ---------- the two great ones: what they leave behind ---------- */
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;const r=_h.apply(this,arguments);
  try{if(was&&e.hp<=0&&pshIs(LEVEL)){const F=pshF();
    if(e.t==='psstairwarden'&&!F.wardenDead){F.wardenDead=1;pshGive('pswardhalberd');msg("The Stair Warden's armour falls apart in pieces. The halberd rings on the stone, and you take it.",'#ffe36a')}
    if(e.t==='psantlered'&&!F.antleredDead){F.antleredDead=1;pshGive('psantlerring');msg("The Antlered Lord is gone. A silver ring lies on the table where his hand was, and you take it.",'#ffe36a')}}}catch(x){console.error('psh kill',x)}
  return r}}
/* ---------- chests: potions and gear for the rating of the place; the lady's chest holds potions only; the hunting chest holds the good bow ---------- */
ITEMDEF.pshuntbow={n:"The Sovereign's Hunting Bow",k:'weapon',t:'Bow',ic:'bow',c:'#d0d4ec',dmg:[500,600],hit:.16,req:{dex:72},lvl:102,price:0,rar:1,ranged:7,eff:{pierce:1,double:.3},dbl:.15,sw:.42,d:"A long bow of pale yew bound with silver wire, kept in the Trophy and Hunting Hall. Shoots 7 squares, its arrows pass through to the foe behind, and three shots in ten send a second arrow. Needs level 102."};
{const _lf=lootFor;lootFor=function(d){
  if(pshIs(LEVEL)&&d&&d.k==='chest'){const r=q=>hash2(d.x,d.y,700+q),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
    if(d.x===59&&d.y===19){add('pshuntbow');add(potionFor(r(1)),1);add('supermana',2);d.gold=5200;return items}
    for(let q=0;q<3;q++)add(potionFor(r(10+q)),1);add('supermana',1+(d.y<20?1:0));if(r(2)<.7)add('elixir',1);
    if(d.y>26){for(let q=0;q<2;q++){const a=typeof armourDrop==='function'?armourDrop(r(20+q)):null;if(a)add(a)}if(typeof ringFor==='function'&&r(3)<.6)add(ringFor(r(4),101))}
    d.gold=d.goldAmt||(d.y<20?2400:4200+Math.floor(r(5)*2800));
    if(d.x===15&&d.y===41||d.x===42&&d.y===39){if(typeof gemFor==='function')try{add(gemFor(r(6)))}catch(e){}d.gold=7500}
    return items}
  return _lf.apply(this,arguments)}}
/* ---------- the jump link and a test helper ---------- */
function pshReport(){const L=LEVELS[PSH.ID]||(KH_LAZY[PSH.ID]&&(KH_LAZY[PSH.ID](),LEVELS[PSH.ID]));if(!L)return null;const c={};for(const d of L.decor)c[d.k]=(c[d.k]||0)+1;return {decor:L.decor.length,enemies:L.enemies.length,lights:L.lights.length,cols:(c.ps_col_fluted||0)+(c.ps_col_twist||0)+(c.ps_col_silver||0),pics:L.decor.filter(d=>d.pic).length,miss:L._psh.miss,ghosts:Object.keys(L._psh.gdata).length}}
