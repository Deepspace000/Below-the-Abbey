/* ==========================================================================
   THE PALE SPIRE, PACKAGE 3: THE GREAT HALLS (level 9740, 112 by 84, rating 101; prefix psh / PSH). Ground floor, the main block: Entrance Hall, the two galleries, the Great Hall, the Banqueting Hall,
   the Screens Passage, the Music Salon, the Lady's Withdrawing Room (rest), the Grand Stair Hall (Stair Warden), the Trophy and Hunting Hall (Antlered Lord).
   Self contained: its own floor maker (pshBuild), wall tiles drawn in code from the graveyard's painted stone, stand-in pictures (made from existing pieces; painted pieces 'ps_<name>' win when they exist).
   Contract: tools/PALE_SPIRE_PLAN.md and src/desert/ps_ids.js (link squares are read from PSP.LINKS). Notes: tools/PALE_SPIRE_NOTES.md.
   ========================================================================== */
const PSH={ID:9740,W:112,H:84,WH:2.8,ready:false,_wait:0};
const pshIs=n=>n===9740;
const pshF=()=>{const F=G.flags;return F.psp||(F.psp={})};
const PSH_COL={cold:[.86,.92,1.1],violet:[.72,.55,1.05],warm:[1.5,1.05,.55],gold:[1.25,1.0,.62]};
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
  S('col_fluted',pshFilt('ds_dpillar1','grayscale(.85) brightness(1.4) contrast(.9) sepia(.15) hue-rotate(200deg)'),3.0);
  S('col_twist',pshFilt('hg_pillar','brightness(1.0) saturate(.8) hue-rotate(10deg)'),3.0);
  S('col_silver',pshFilt('ds_wm_crystal_pillar','hue-rotate(15deg) saturate(.45) brightness(1.35)'),2.9);
  S('table_long',pshFilt('hl_p_feast','grayscale(.45) hue-rotate(190deg) brightness(1.05)'),.95);
  S('table_high',pshFilt('hl_p_feast','hue-rotate(250deg) saturate(.8) brightness(1.1)',true),1.0);
  S('chair_high',pshFilt('ds_hgtb_chair','grayscale(.3) brightness(.95) hue-rotate(220deg)'),1.0);
  S('chandelier',pshFilt('ds_hgtb_furn_chandelier','hue-rotate(35deg) saturate(.7) brightness(1.15)'),1.5);
  S('banner_violet',pshFilt('hl_p_banner','hue-rotate(250deg) saturate(.75) brightness(.95)'),2.3);
  S('hearth_cold',pshFilt('ds_hgtb_furn_hearth','hue-rotate(175deg) saturate(1.1) brightness(1.1)'),2.1);
  S('throne',pshFilt('hl_p_throne','grayscale(.35) brightness(1.15) hue-rotate(230deg)'),1.9);
  S('candelabra_tall',pshFilt('ds_hpb_candelabra_6','hue-rotate(20deg) saturate(.8)'),1.5);
  S('bed_four',pshFilt('ds_hgtb_furn_bed','saturate(.55) hue-rotate(260deg) brightness(1.05)'),1.5);
  S('harpsichord',pshFilt('hl_p_desk','grayscale(.4) hue-rotate(200deg) brightness(1.1)'),1.0);
  S('suit_armour',pshFilt('hl_p_armour','grayscale(.4) brightness(1.3) hue-rotate(210deg)'),1.9);
  S('balustrade',pshFilt('gy_fence','grayscale(1) brightness(1.55) contrast(.85)'),.95);
  S('mirror',pshFilt('hl_p_mirror','grayscale(.3) brightness(1.25)'),2.0);S('hedge',pshFilt('lbush0','hue-rotate(-25deg) saturate(.45) brightness(.7)'),.8);S('sideboard',pshFilt('hl_p_desk','brightness(.7) hue-rotate(200deg) saturate(.6)'),.9);
  {const a=IMG.cr_stag;if(a){const c=pshCv(150,170),x=c.getContext('2d');x.fillStyle='#5a3c22';x.beginPath();x.ellipse(75,90,70,78,0,0,6.3);x.fill();x.strokeStyle='#c8b080';x.lineWidth=5;x.stroke();x.drawImage(a,0,0,a.width,a.height*.5,12,6,126,126*a.height*.5/a.width);S('trophy_stag',c,1.1)}}
  S('urn_pale',pshFilt('gy_urn','grayscale(1) brightness(1.5) contrast(.9) sepia(.1) hue-rotate(200deg)'),1.1);
  const st=[['statue','grayscale(.6) brightness(1.55)',1.9,0],['ds_wm_statue','grayscale(.55) brightness(1.2)',1.9,0],['lpstatue','grayscale(.7) brightness(1.5)',1.9,1],['mw_statue','grayscale(.5) brightness(1.2)',1.8,0],['gy_angel','grayscale(.7) brightness(1.3)',1.9,1],['ds_dsutstatue','grayscale(.9) brightness(1.4)',1.9,0],['ds_dsphinx','grayscale(.9) brightness(1.3)',1.0,0]];
  st.forEach((a,i)=>S('hst'+i,pshFilt(a[0],a[1],a[3]),a[2]));
  S('hst7',pshFilt('statue','grayscale(.8) brightness(1.15) hue-rotate(220deg)',true),1.9);
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
  for(const [n,src] of [['p_chamberlain','kh_ohfolk4_1'],['p_lutenist','kh_ohfolk6_1'],['p_curator','kh_ohfolk5_2']]){const c=pshFilt(src,ghost);if(c)pshSet(n,c,1.7)}
  PSH.pics=1}
