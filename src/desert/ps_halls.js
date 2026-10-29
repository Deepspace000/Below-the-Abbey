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
  psstairwarden:{name:'The Stair Warden',hp:500,dmg:[11,17],hit:.9,w:1.4,ph:3.0,img:pic('psstairwarden'),xp:900,gold:[0,0],speed:1,verb:'swings his halberd at',boss:true,aboveParty:0,ps:1,still:1,glow:.3,noFlee:1,wake:'The giant armour on the landing straightens, and a halberd as long as a tree comes down off its shoulder.'},
  psantlered:{name:'The Antlered Lord',hp:450,dmg:[10,16],hit:.9,w:1.6,ph:2.5,img:pic('psantlered'),xp:800,gold:[0,0],speed:1,verb:'gores',boss:true,aboveParty:0,ps:1,still:1,glow:.35,noFlee:1,wake:'The antlered ghost lifts its head from the table, and a horn sounds somewhere under the floor.'}});
for(const t of ['psstairwarden','psantlered']){if(typeof NO_VARY!=='undefined')NO_VARY.push(t);if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push(t)}
if(typeof BOSS_GOLD!=='undefined'){BOSS_GOLD.psstairwarden=[5200,6200];BOSS_GOLD.psantlered=[4600,5600]}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^ps(armour|stairwarden)/,'shaken',.15],[/^ps(courtier|fiend|dancer)/,'cursed',.15],[/^pscarver/,'bleeding',.2],[/^ps(antlered|hhound)/,'bleeding',.18])}
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
  const marble=(x,y,dark)=>{const v=vn(x,y,32,801)*.5+vn(x,y,16,802)*.3+vn(x,y,8,803)*.2,vein=Math.abs(Math.sin((x*.07+y*.045+vn(x,y,32,804)*5)))<.06?1:0;let b=dark?64+v*38:206+v*38;if(vein)b+=dark?26:-26;return dark?[b*.92,b*.9,b*1.2]:[b*.97,b*.98,b*1.08]};
  FLOORS.psf_chq=mk((x,y)=>{const e=Math.min(x%64,y%64,63-x%64,63-y%64);if(e<1.6)return [38,36,52];const dark=((x>>6)+(y>>6))&1;return marble(x,y,dark)});
  FLOORS.psf_chq2=mk((x,y)=>{const e=Math.min(x%64,y%64,63-x%64,63-y%64);if(e<1.6)return [30,28,44];const dark=((x>>6)+(y>>6))&1;const m=marble(x,y,!dark);return [m[0]*.8,m[1]*.8,m[2]*.95]});
  FLOORS.psf_flag=mk((x,y)=>{const bx=((x+(((y>>5)&1)*32))>>6),by=y>>5,e=Math.min((x+(((y>>5)&1)*32))%64,y%32,63-(x+(((y>>5)&1)*32))%64,31-y%32);if(e<1.3)return [56,56,70];const v=.55+hh(bx,by,805)*.25+vn(x,y,16,806)*.3;return [150*v,152*v,172*v]});
  // the violet runner: deep violet cloth, silver-gold border, a small lozenge pattern
  FLOORS.psf_run=mk((x,y)=>{const e=Math.min(x,y,N-1-x,N-1-y);if(e<5)return [60,50,96];if(e<9)return [200,184,130];if(e<12)return [60,44,110];const lx=Math.abs((x%32)-16)+Math.abs((y%32)-16);let v=lx<9?1.18:1;const n=hh(x>>1,y>>1,807)*.1;return [(86*v)*(1+n),(58*v)*(1+n),(150*v)*(1+n)]});
  FLOORS.psf_wood=mk((x,y)=>{const pl=Math.floor(y/16),e=y%16,v=.62+hh(pl,(x>>5)+pl,808)*.28+vn(x,y,16,809)*.14;if(e<1.2)return [30,20,18];return [112*v,78*v,64*v]});
  FLOORS.psf_carpet=mk((x,y)=>{const e=Math.min(x,y,N-1-x,N-1-y);if(e<4)return [150,40,60];if(e<8)return [210,176,96];const lx=Math.abs((x%32)-16)+Math.abs((y%32)-16);const v=lx<7?1.15:1,n=hh(x,y,810)*.1;return [(176*v)*(1+n),(112*v)*(1+n),(104*v)*(1+n)]});
  FLOORS.psf_dais=mk((x,y)=>{const e=Math.min(x,y,N-1-x,N-1-y);if(e<2)return [60,58,80];const v=vn(x,y,32,811)*.5+vn(x,y,8,812)*.3;return [186+v*40,184+v*40,208+v*40]});
  FLOORS.psf_black=mk((x,y)=>{const e=Math.min(x%64,y%64,63-x%64,63-y%64);if(e<1.4)return [14,12,22];const v=vn(x,y,32,813)*.5+vn(x,y,8,814)*.4,vein=Math.abs(Math.sin(x*.05-y*.06+vn(x,y,32,815)*4))<.05?40:0;return [34+v*26+vein,32+v*24+vein,52+v*34+vein]});
  if(typeof gyFloorTone==='function'&&FLOORS.gyf_grass)gyFloorTone('psf_grass','gyf_grass',.72,[.78,.95,.88]);
  PSH._fl=['psf_chq','psf_flag','psf_run','psf_wood','psf_carpet','psf_dais',FLOORS.psf_grass?'psf_grass':'psf_black'];
  // a ceiling of dark coffers with pale ribs
  if(!CEILS.psc_hall){const base=IMG.gyp_texGrey_0?dsPaintedTex(IMG.gyp_texGrey_0):null,d=new Uint8ClampedArray(N*N*4);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=(y*N+x)*4,e=Math.min(x%64,y%64,63-x%64,63-y%64),rib=e<4;
      const b=base?base[o]:90,k=rib?.62:.34;d[o]=Math.min(255,b*k*.98);d[o+1]=Math.min(255,(base?base[o+1]:90)*k);d[o+2]=Math.min(255,(base?base[o+2]:96)*k*1.18);d[o+3]=255}CEILS.psc_hall=d}
  return PSH._fl}
/* the wall styles: stone and colour of each room. A tile is the painted stone plus drawn work: a gothic window, an arched bay with a plinth, ivy, silk panels, dark wood. */
const PSH_STYLES={
  hall:{tex:'texGrey_0',rgb:[1.0,1.0,1.2],gain:1.2,trim:'#d8d4ee',band:'rgba(52,44,86,.55)'},
  gallery:{tex:'texBone_0',rgb:[.95,.93,1.12],gain:1.0,trim:'#d8cfe8',band:'rgba(70,52,96,.5)'},
  statues:{tex:'texBone_1',rgb:[.9,.95,1.15],gain:1.0,trim:'#dce2f4',band:'rgba(48,56,96,.5)'},
  banquet:{tex:'texGrey_3',rgb:[1.25,.95,1.55],gain:1.35,trim:'#e0c878',band:'rgba(40,20,70,.6)',silk:'#4a2a7a'},
  salon:{tex:'texBone_0',rgb:[.8,.92,1.25],gain:1.0,trim:'#e8e4f8',band:'rgba(50,70,120,.4)',silk:'#6a7ab0'},
  trophy:{tex:'texGrey_3',rgb:[1.15,1.0,1.0],gain:1.25,trim:'#c8b08a',band:'rgba(70,40,24,.7)',wood:1},
  screens:{tex:'texGrey_3',rgb:[1.1,1.0,.95],gain:1.2,trim:'#b09070',band:'rgba(60,36,22,.75)',wood:1},
  lady:{tex:'texBone_0',rgb:[1.15,1.0,.88],gain:1.05,trim:'#e8d0a0',band:'rgba(110,70,50,.35)',silk:'#c89a84'},
  stair:{tex:'texGrey_0',rgb:[.8,.82,1.12],gain:1.05,trim:'#c4c0e0',band:'rgba(36,30,70,.65)'},
  closet:{tex:'texGrey_3',rgb:[1.1,1.0,.9],gain:1.15,trim:'#a89070',band:'rgba(50,36,24,.5)'}};
function pshTile(style,kind,v){
  const S=PSH_STYLES[style],WH=PSH.WH,key=style+kind+(v||0);PSH._tl=PSH._tl||{};if(PSH._tl[key]!==undefined)return PSH._tl[key];
  const tex=(v&&S.tex==='texGrey_0')?'texGrey_1':(v&&S.tex==='texBone_0')?'texBone_1':S.tex;
  const draw=(x,w,h)=>{
    const wain=h*.3;
    // wainscot band: darker lower part with a trim line
    x.fillStyle=S.band;x.fillRect(0,h-wain,w,wain);x.fillStyle=S.trim;x.globalAlpha=.55;x.fillRect(0,h-wain-2,w,3);x.globalAlpha=1;
    if(S.wood){x.fillStyle='rgba(40,22,10,.62)';x.fillRect(0,h-wain,w,wain);for(let i=0;i<4;i++){x.fillStyle='rgba(0,0,0,.4)';x.fillRect(i*32+1,h-wain+4,2,wain-8)}x.strokeStyle='rgba(200,160,100,.5)';x.strokeRect(6,h-wain+8,w-12,wain-16)}
    if(S.silk&&kind!=='win'){x.fillStyle=S.silk;x.globalAlpha=.5;x.fillRect(8,h*.12,w-16,h-wain-h*.12-10);x.globalAlpha=1;x.strokeStyle=S.trim;x.lineWidth=2;x.strokeRect(8,h*.12,w-16,h-wain-h*.12-10);x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=1;for(let i=1;i<6;i++){x.beginPath();x.moveTo(8+i*(w-16)/6,h*.12);x.lineTo(8+i*(w-16)/6,h-wain-10);x.stroke()}}
    if(kind==='win'||kind==='bay'||kind==='bay2'){
      const cx=w/2,top=h*(kind==='win'?.16:.22),bot=kind==='win'?h*.62:h-wain*.15,hw=kind==='win'?30:44;
      x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw*1.1);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.35);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw*1.1);x.lineTo(cx+hw,bot);x.closePath();
      x.save();x.clip();
      if(kind==='win'){const g=x.createLinearGradient(0,top,0,bot);g.addColorStop(0,'#c8b8ff');g.addColorStop(.5,'#8c78d8');g.addColorStop(1,'#3e3688');x.fillStyle=g;x.fillRect(0,0,w,h);
        x.strokeStyle='rgba(20,14,50,.9)';x.lineWidth=3;for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(cx+i*hw/2.5,top-20);x.lineTo(cx+i*hw/2.5,bot);x.stroke()}for(let j=0;j<5;j++){x.beginPath();x.moveTo(0,top+20+j*(bot-top)/5);x.lineTo(w,top+20+j*(bot-top)/5);x.stroke()}
        x.fillStyle='rgba(255,255,255,.55)';for(let j=0;j<6;j++){x.fillRect(cx-hw+8+((j*13)%50),top+10+((j*29)%(bot-top-20)),4,10)}}
      else{const g=x.createLinearGradient(0,top,0,bot);g.addColorStop(0,'#1c1830');g.addColorStop(1,'#0a0814');x.fillStyle=g;x.fillRect(0,0,w,h);
        // ivy creeping in from the top and the sides of the bay
        x.fillStyle='#2f5a34';for(let i=0;i<46;i++){const px=cx-hw+((i*37)%(hw*2)),py=top+((i*i*11)%((bot-top)*.55));x.beginPath();x.ellipse(px,py,5+((i*3)%4),3+(i%3),((i*7)%6)/2,0,6.3);x.fill()}x.fillStyle='#4a7e46';for(let i=0;i<24;i++){x.beginPath();x.ellipse(cx-hw+((i*53)%(hw*2)),top+((i*29)%((bot-top)*.5)),3,2,i,0,6.3);x.fill()}}
      x.restore();
      x.strokeStyle=S.trim;x.lineWidth=5;x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw*1.1);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.35);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw*1.1);x.lineTo(cx+hw,bot);x.stroke();
      x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=2;x.stroke()}
    if(kind==='ivy'){x.fillStyle='#2c5632';for(let i=0;i<150;i++){const px=(i*53)%w,py=h*(Math.pow(((i*37)%100)/100,1.5))*.85,r=3+((i*5)%5);x.globalAlpha=.9;x.beginPath();x.ellipse(px,py,r,r*.6,((i*3)%6)/2,0,6.3);x.fill()}
      x.fillStyle='#4c8248';for(let i=0;i<80;i++){x.beginPath();x.ellipse((i*71)%w,h*(((i*41)%100)/100)*.8,3,2,i,0,6.3);x.fill()}x.globalAlpha=1}
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
    if(kind==='iron'){g.addColorStop(0,'#2c2a3c');g.addColorStop(1,'#14121e')}else if(kind==='barred'){g.addColorStop(0,'#3a2c24');g.addColorStop(1,'#1c120c')}else{g.addColorStop(0,'#5a3a22');g.addColorStop(1,'#2a160c')}
    x.fillStyle=g;x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=2;for(let i=-4;i<=4;i++){x.beginPath();x.moveTo(cx+i*hw/4.2,top);x.lineTo(cx+i*hw/4.2,bot);x.stroke()}
    x.strokeStyle='rgba(0,0,0,.8)';x.lineWidth=3;x.beginPath();x.moveTo(cx,top-hw*.3);x.lineTo(cx,bot);x.stroke();
    const band=kind==='great'||kind==='gallery'?'#cfd4ea':'#6a6878';
    x.fillStyle=band;for(const yy of [.32,.52,.74,.9]){x.fillRect(cx-hw,h*yy,hw*2,6);x.fillStyle='rgba(0,0,0,.45)';x.fillRect(cx-hw,h*yy+6,hw*2,2);x.fillStyle=band}
    if(big){x.fillStyle='#e8e4fa';for(const yy of [.32,.52,.74,.9])for(let i=-3;i<=3;i++){x.beginPath();x.arc(cx+i*hw/3.4,h*yy+3,2.6,0,6.3);x.fill()}
      x.strokeStyle='#e8d890';x.lineWidth=3;x.beginPath();x.arc(cx-hw*.42,h*.62,9,0,6.3);x.stroke();x.beginPath();x.arc(cx+hw*.42,h*.62,9,0,6.3);x.stroke()}
    if(kind==='iron'){const gr=x.createRadialGradient(cx,h*.6,2,cx,h*.6,30);gr.addColorStop(0,'rgba(220,190,255,1)');gr.addColorStop(1,'rgba(130,80,220,0)');x.fillStyle=gr;x.beginPath();x.arc(cx,h*.6,30,0,6.3);x.fill();x.strokeStyle='#e8e0ff';x.lineWidth=2.5;x.beginPath();x.arc(cx,h*.6,10,0,6.3);x.stroke();x.fillStyle='#14121e';x.fillRect(cx-3,h*.6-4,6,14)}
    if(kind==='barred'){x.fillStyle='#4a4650';x.fillRect(cx-hw,h*.58,hw*2,12);x.fillStyle='#8a8694';x.fillRect(cx-hw,h*.58,hw*2,3);x.fillStyle='#b8a050';x.beginPath();x.arc(cx,h*.58+6,6,0,6.3);x.fill()}
    if(kind==='closet'){x.fillStyle='#c8a860';x.beginPath();x.arc(cx+hw*.55,h*.62,4,0,6.3);x.fill();x.fillRect(cx+hw*.55-1,h*.62,2,10)}
    if(kind==='service'||kind==='cloister'){x.fillStyle='#b8b0a0';x.beginPath();x.arc(cx+hw*.5,h*.62,5,0,6.3);x.fill();if(kind==='cloister'){x.strokeStyle='#4a8a50';x.lineWidth=3;for(let i=0;i<5;i++){x.beginPath();x.arc(cx-hw*.5+i*hw*.25,h*.5+((i%2)*14),8,0,3.2);x.stroke()}}}
    x.restore();
    x.strokeStyle=big?'#e8e4fa':'#9a96aa';x.lineWidth=big?7:5;x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.3);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw);x.lineTo(cx+hw,bot);x.stroke();
    x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=2;x.stroke()};
  const st=kind==='iron'||kind==='barred'?'stair':'hall';
  return PSH._dt[kind]=gyTile(PSH_STYLES[st].tex,WH,{gain:1.15,rgb:PSH_STYLES[st].rgb,tag:'psh_door_'+kind,emit:.25,fac:{img:'gatesC_0',i:0,n:1},draw})}
/* the secret-door tiles look exactly like the plain wall of the room, but are their own tile numbers */
function pshSecretTile(style){return gyTile(PSH_STYLES[style].tex,PSH.WH,{gain:PSH_STYLES[style].gain,rgb:[PSH_STYLES[style].rgb[0],PSH_STYLES[style].rgb[1],PSH_STYLES[style].rgb[2]+.00031],tag:'psh_secret_'+style,draw:(x,w,h)=>{const S=PSH_STYLES[style],wain=h*.3;x.fillStyle=S.band;x.fillRect(0,h-wain,w,wain);x.fillStyle=S.trim;x.globalAlpha=.55;x.fillRect(0,h-wain-2,w,3);x.globalAlpha=1}})}
/* ---------- the level ---------- */
const PSH_ROOMS=[ // k, rectangles (inner floor), wall style, floor slot, name
  ['A',[[46,68,66,81]],'hall','0','The Entrance Hall'],
  ['B',[[6,70,44,81]],'gallery','0','The Gallery of Portraits'],
  ['L',[[6,66,14,68]],'closet','1',"The Painters' Closet"],
  ['C',[[68,70,106,81]],'statues','0','The Hall of Statues'],
  ['D',[[36,32,76,65]],'hall','0','The Great Hall'],
  ['E',[[6,52,33,60],[3,55,5,57]],'screens','1','The Screens Passage'],
  ['F',[[80,40,106,64],[107,55,108,57]],'banquet','3','The Banqueting Hall'],
  ['G',[[6,30,32,50]],'salon','0','The Music Salon'],
  ['H',[[6,14,20,28]],'lady','4',"The Lady's Withdrawing Room"],
  ['I',[[44,10,68,28]],'stair','5','The Grand Stair Hall'],
  ['J',[[80,10,106,36]],'trophy','3','The Trophy and Hunting Hall']];
const PSH_PASS=[ // x0,y0,x1,y1, owner room, floor slot
  [45,75,45,77,'B','0'],[67,75,67,77,'C','0'],[55,66,57,67,'D','2'],[34,55,35,57,'D','2'],[77,55,79,57,'D','2'],[33,39,35,41,'D','0'],[55,29,57,31,'D','2'],[92,37,94,39,'J','3']];
function pshBuild(){
  if(LEVELS[PSH.ID])return LEVELS[PSH.ID];
  try{gyAlias();pshPics()}catch(e){console.error('psh pics',e)}
  const W=PSH.W,H=PSH.H,WH=PSH.WH,hs=(a,b,c)=>hash2(a,b,c+9740),fl=pshFloors();
  const g=[],fm=[],rid=[];for(let y=0;y<H;y++){g.push(new Array(W).fill('#'));fm.push(new Array(W).fill('0'));rid.push(new Array(W).fill(-1))}
  const RI={};PSH_ROOMS.forEach((r,i)=>{RI[r[0]]=i;for(const [x0,y0,x1,y1] of r[1])for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){g[y][x]='.';fm[y][x]=r[3];rid[y][x]=i}});
  for(const [x0,y0,x1,y1,o,f] of PSH_PASS)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){g[y][x]='.';fm[y][x]=f;rid[y][x]=RI[o]}
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&g[y][x]==='.';
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open(x,y))fm[y][x]=f};
  // the niches behind the two secret doors, and the closet door cell stay walls until opened; the niche cells themselves are floor
  g[68][24]='.';rid[68][24]=RI.B;fm[68][24]='1';g[68][88]='.';rid[68][88]=RI.C;fm[68][88]='1';
  // runners down the long axes
  setF(55,36,57,65,'2');setF(55,68,57,81,'2');setF(6,75,44,76,'2');setF(68,75,106,76,'2');setF(6,55,33,57,'2');setF(3,55,5,57,'2');setF(80,55,108,57,'2');setF(55,16,57,28,'2');setF(81,22,105,24,'2');setF(46,56,66,56,'0');
  setF(48,32,64,35,'5');setF(48,36,64,36,'5');                         // the dais of the Great Hall
  setF(50,16,62,22,'5');                                               // the landing of the Grand Stair
  { // the dance floor of the salon: a disc of pale marble
    for(let y=32;y<=48;y++)for(let x=8;x<=30;x++)if(open(x,y)&&Math.hypot((x-19)/8.5,(y-40)/7.5)<1)fm[y][x]='5'}
  setF(99,70,106,81,'6');                                              // the winter bay: pale grass (the garden bay at the east end of the Hall of Statues)
  setF(6,66,14,68,'3');
  // the grand stair massif (the stair block): wall inside the stair hall
  for(let y=10;y<=15;y++)for(let x=47;x<=65;x++){g[y][x]='#';rid[y][x]=-1}
  // ---- links from the contract ----
  const LK=pspLinksFrom(PSH.ID),over={},kindAt={},doorRec=[];
  const keep=new Set(),reserve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)keep.add(x+','+y)};
  for(const [x0,y0,x1,y1] of PSH_PASS)reserve(x0-1,y0-1,x1+1,y1+1);
  for(const l of PSP.LINKS)if(l.to===PSH.ID&&l.land)reserve(l.land[0]-1,l.land[1]-1,l.land[0]+1,l.land[1]+1);
  for(const l of LK){if(!l.at)continue;
    const kind=l.to===9730?(l.at[0]===56?'great':'gallery'):l.to===9750?'service':l.to===9760?'cloister':'iron';
    over[l.at[0]+','+l.at[1]]=pshDoorTile(kind);doorRec.push({at:l.at,link:l,kind});reserve(l.at[0]-1,l.at[1]-2,l.at[0]+1,l.at[1]+2)}
  reserve(55,16,57,19);
  // special door tiles
  const gidLady=pshDoorTile('closet'),gidClo=pshDoorTile('closet'),gidBar=pshDoorTile('barred');
  over['13,29']=pshDoorTile('closet');over['10,69']=gidClo;over['69,19']=gidBar;
  over['24,69']=pshSecretTile('gallery');over['88,69']=pshSecretTile('statues');
  reserve(12,28,14,30);reserve(9,69,11,71);reserve(68,18,70,20);reserve(23,68,25,71);reserve(87,68,89,71);
  const decor=[],enemies=[],items=[],lights=[],lcol={},kI={},r2={},occ=new Set(),wocc=new Set(),miss=[];
  const mapNames=[];
  PSH_ROOMS.forEach(r=>{const [x0,y0,x1,y1]=r[1][0];mapNames.push({t:r[4],x:(x0+x1)>>1,y:(y0+y1)>>1,k:'place'})});
  const fr=(x,y)=>open(x,y)&&!occ.has(x+','+y);
  /* put: a piece on the floor (block: solid; npc: talks) */
  const put=(k,x,y,o)=>{o=o||{};if(!open(x,y)||occ.has(x+','+y)||(keep.has(x+','+y)&&!o.force)){miss.push(k+'@'+x+','+y);return null}
    const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}if(o.sc)d.sc=o.sc;if(o.npc){d.npc=o.npc;d.deco=false;if(o.block)d.solid=1}if(o.bob!==undefined)d.bob=o.bob;if(o.ox!==undefined){d.ox=o.ox;d.oy=o.oy||0}if(o.txt)d.txt=o.txt;
    decor.push(d);if(!o.over)occ.add(x+','+y);return d};
  /* pic: a picture on the wall; (x,y) is the floor square in front, wd points at the wall */
  const pic=(k,x,y,wd,o)=>{o=o||{};const key=x+','+y+','+wd[0]+','+wd[1];if(!open(x,y)||wocc.has(key)||g[y+wd[1]]===undefined||g[y+wd[1]][x+wd[0]]!=='#'){miss.push('pic '+k+'@'+x+','+y);return null}
    const d={k,x,y,block:false,walk:true,deco:true,wd:[wd[0],wd[1]],pic:1};if(o.bob!==undefined)d.bob=o.bob;if(o.npc){d.npc=o.npc;d.deco=false}decor.push(d);wocc.add(key);return d};
  const foe=(t,x,y)=>{if(!open(x,y)||occ.has(x+','+y)||(keep.has(x+','+y))){miss.push('foe '+t+'@'+x+','+y);return false}if(!ENEMY_DEF[t]){miss.push('nodef '+t);return false}enemies.push({t,x,y,lvl:101});occ.add(x+','+y);return true};
  const lamp=(x,y,col,k,r)=>{if(!open(x,y))return;lights.push([x,y]);lcol[x+','+y]=col||PSH_COL.cold;if(k)kI[x+','+y]=k;if(r)r2[x+','+y]=r};
  const sign=(x,y,wd,a,b)=>{if(!open(x,y)){miss.push('sign@'+x+','+y);return}decor.push({k:'sign_gy',x,y,block:false,wd:[wd[0],wd[1]],txt:[a,b||''],sc:1})};
  const COLS=['col_fluted','col_twist','col_silver'];
  const col=(x,y,n)=>put('ps_'+COLS[n%3],x,y,{block:true});
  const stat=(x,y,i,o)=>put(PSH.st(i),x,y,Object.assign({block:true},o||{}));
  const pt=(i)=>pshPortrait(i);
  const mark=(x,y,kind)=>{kindAt[x+','+y]=kind};
  const S={g,fm,rid,open,put,pic,foe,lamp,sign,col,stat,pt,mark,fr,reserve,decor,enemies,items,lights,occ,miss,keep,over,kindAt,doorRec,setF,RI,hs,W,H};
  PSH.st=i=>{const n=['ps_st_veiled','ps_hst0','ps_hst1','ps_hst2','ps_hst3','ps_hst4','ps_hst5','ps_hst7'];return IMG[n[i%8]]?n[i%8]:'ps_hst0'};
  try{pshFurnish(S)}catch(e){console.error('pshFurnish',e);throw e}
  // ---- the wall tiles ----
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const styleAt=(x,y)=>{for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]){const a=x+dx,b=y+dy;if(a>=0&&b>=0&&a<W&&b<H&&g[b][a]==='.'&&rid[b][a]>=0)return PSH_ROOMS[rid[b][a]][2]}return 'hall'};
  const rows=[];
  for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){
    if(g[y][x]==='.'){s+='.';continue}
    const k=x+','+y;
    if(over[k]!==undefined){s+=ch(over[k]);continue}
    const st=styleAt(x,y),kd=kindAt[k]||'plain',v=(hs(x,y,3)*2)|0;
    s+=ch(pshTile(st,kd,kd==='plain'?v:0))}rows.push(s)}
  // the door records: which tile number is which door
  for(const d of doorRec){const c=rows[d.at[1]][d.at[0]],gid=chars[c];KH_DOOR[gid]={psh:'link',link:d.link,get lvl(){return d.link.to},kind:d.kind}}
  {const c=rows[29][13];KH_DOOR[chars[c]]={psh:'warp',a:[13,30,2],b:[13,28,0],y:29,msgIn:true}}
  {const c=rows[69][10];KH_DOOR[chars[c]]={psh:'closet'}}
  {const c=rows[19][69];KH_DOOR[chars[c]]={psh:'barred'}}
  {const c=rows[69][24];KH_DOOR[chars[c]]={psh:'niche',flag:'framePainted',cell:[24,68],walls:'The gold frame of the painted portrait... no. Only a wall of cold stone.'}}
  {const c=rows[69][88];KH_DOOR[chars[c]]={psh:'niche',flag:'statueTurned',cell:[88,68]}}
  const cf=(x0,y0,x1,y1,f)=>{};
  const fmS=fm.map(r=>r.join(''));
  // lights of the colour table for the walls' own lamp-posts: a light every few squares where none is near
  {const have=lights.slice();for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!open(x,y)||rid[y][x]===RI.H)continue;if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=7.5)){have.push([x,y]);lights.push([x,y]);lcol[x+','+y]=PSH_COL.cold}}}
  const L={rows,chars,fmap:fmS,floorSet:fl.slice(),floor:fl[0],floor2:fl[1],ceil:'psc_hall',ceilH:WH,start:{x:56,y:80,f:0},enemies,items,decor,lights,portals:[],day:0,amb:.34,torchGap:1e9,noTele:true,noExtras:true,sky:[],
    name:'The Ground Floor: the Great Halls',label:'The Great Halls',diff:101,mapNames,_psh:{lcol,kI,r2,col:PSH_COL.cold,miss,S:null}};
  LEVELS[PSH.ID]=L;LEVEL_NAMES[PSH.ID]=L.name;LEVEL_RATING[PSH.ID]=101;
  if(miss.length)console.warn('psh missed: '+miss.slice(0,60).join(' '));
  {const NN=W*H,hh=new Float32Array(NN).fill(.3),rk=new Float32Array(NN),block=new Uint8Array(NN);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rows[y][x]!=='.')block[y*W+x]=1;try{TERRS[PSH.ID]=yarTerrain(W,H,hh,rk,block)}catch(e){console.error(e)}}
  return L}
if(typeof pspRegister==='function'){try{pspRegister(PSH.ID,pshBuild,{})}catch(e){KH_LAZY[PSH.ID]=pshBuild}}else KH_LAZY[PSH.ID]=pshBuild;
LEVEL_NAMES[9740]='The Ground Floor: the Great Halls';LEVEL_RATING[9740]=101;

/* ---------- what stands in each room ---------- */
function pshFurnish(S){
  const {put,pic,foe,lamp,sign,col,stat,pt,mark,open,fr,RI,decor,hs,g}=S;
  const N=[0,-1],So=[0,1],Ea=[1,0],We=[-1,0],V=PSH_COL.violet,WM=PSH_COL.warm,CO=PSH_COL.cold;
  const thing=(k,id,x,y,o)=>put(k,x,y,Object.assign({block:true,npc:id},o||{}));
  const hang=(x,y,lt,col2)=>{put('ps_chandelier',x,y,{bob:1.45,over:true,sc:1});lamp(x,y,col2||CO,lt||1.7,150)};
  const wall=(k,list,wd,o)=>{for(const [x,y] of list)pic(k,x,y,wd,o)};
  const guard=(x,y)=>{if(ENEMY_DEF.psguard)foe('psguard',x,y);else foe('psarmour',x,y)};
  const mst=i=>{const n=['ps_st_chimera','ps_st_hydra','ps_st_judge','ps_st_headless','ps_st_bishop','ps_st_mourners','ps_st_veiled','ps_st_hound'][i%8];return IMG[n]&&!IMG[n]._ps?n:PSH.st(i)};
  PSH.mst=mst;
  /* ===== A. the Entrance Hall ===== */
  for(const y of [70,73,76,79]){col(50,y,(y/3|0)%2);col(62,y,((y/3|0)+1)%2)}
  for(const [x,y,i] of [[48,68,0],[51,68,3],[61,68,1],[64,68,4]]){mark(x,67,'bay');stat(x,y,i)}
  thing(PSH.st(2),'psh_anc1',53,69);thing(PSH.st(6),'psh_anc2',59,69);
  hang(56,72);hang(56,77,1.6);
  wall('ps_banner_violet',[[52,81],[60,81]],So,{});wall('ps_pt_pale_lands',[[48,81]],So);wall('ps_pt_feast',[[64,81]],So);sign(58,81,So,'THE ENTRANCE HALL','The Great Halls lie north');
  wall(pt(1),[[46,69],[46,72],[46,79]],We);wall(pt(8),[[66,69],[66,72],[66,79]],Ea);
  thing('ps_p_chamberlain','psh_chamberlain',53,76);
  thing('ps_suit_armour','psh_suitA',47,72);put('ps_suit_armour',65,72,{block:true});
  thing('hl_p_note','psh_notice',47,80,{sc:.5});
  guard(49,71);guard(63,71);foe('psarmour',48,78);foe('psarmour',64,78);
  /* ===== B. the Gallery of Portraits ===== */
  for(let x=9,i=0;x<=41;x+=4,i++){col(x,73,i%2);col(x,78,(i+1)%2)}
  {const skipN=new Set(),skipS=new Set(),wide=(set,x,k,r)=>{set.add(x);for(let d=1;d<=r;d++){set.add(x-d);set.add(x+d)}};
   const SPN={20:['ps_pt_king',1],23:['ps_pt_queen',1],27:['ps_pt_prince',1],32:['ps_pt_ancestors',2],38:['ps_pt_gallery8',1]},SPS={12:['ps_pt_battle',1],17:['ps_pt_hunt',1],35:['ps_pt_feast',1],40:['ps_pt_pale_lands',1]};
   for(const x in SPN){const [k,r]=SPN[x];pic(k,+x,70,N);wide(skipN,+x,k,r)}
   for(const x in SPS){const [k,r]=SPS[x];pic(k,+x,81,So);wide(skipS,+x,k,r)}
   let i=0;for(let x=7;x<=43;x+=2){if(Math.abs(x-10)<=1||Math.abs(x-24)<=1||skipN.has(x))continue;pic(pt(i++),x,70,N)}
   for(let x=7;x<=43;x+=2){if(Math.abs(x-28)<=2||skipS.has(x))continue;pic(pt(i++),x,81,So)}
   for(const y of [71,79])pic(pt(i++),6,y,We);for(const y of [71,73,79,81])pic(pt(i++),44,y,Ea)}
  for(const y of [74,77]){mark(5,y,'bay')}stat(6,74,0);stat(6,77,5);
  thing('ps_pt_isaude','psh_isaude',34,72,{sc:1});thing('ps_pt_empty','psh_emptyframe',14,80,{sc:1});
  thing('hl_p_lectern','psh_stand2',40,72);
  sign(26,81,So,'THE GALLERY OF PORTRAITS','West Gallery. Do not touch the frames.');
  hang(15,75);hang(25,75,1.8);hang(35,75);
  foe('psfiend',16,71);foe('psfiend',30,80);foe('psfiend',38,71);foe('psfiend',20,80);foe('pscarver',22,77);foe('pscourtier',36,77);foe('psarmour',12,80);foe('psarmour',40,79);foe('pscarver',8,76);
  put('chest',24,68,{block:true,force:1});
  /* the painters' closet */
  thing('hl_p_shelf','psh_pigments',7,67);thing('hl_p_lectern','psh_easel',12,67);put('hl_p_desk',9,66,{block:true});lamp(10,67,CO,1.6,100);
  /* ===== C. the Hall of Statues ===== */
  for(let x=72,i=0;x<=96;x+=8,i++)col(x,73,i);for(let x=76,i=0;x<=92;x+=8,i++)col(x,78,i+1);
  {const north=[71,74,77,80,83,92,95,98],south=[71,74,77,80,83,86,89,92,95,98];let i=0;const named={74:'psh_pl0',98:'psh_pl2',77:'psh_pl3',89:'psh_pl4',95:'psh_pl5'};
   for(const x of north){mark(x,69,'bay');const id=x===74?'psh_pl0':x===98?'psh_pl2':null;put(mst(i++),x,70,{block:true,npc:id||undefined})}
   mark(86,69,'bay');put(mst(i++),86,70,{block:true,npc:'psh_pl1'});
   put(mst(7),88,70,{block:true,npc:'psh_turner',force:1});
   for(const x of south){mark(x,82,'bay');const id=named[x]&&x!==74&&x!==98?named[x]:null;put(mst(i++),x,81,{block:true,npc:id||undefined})}
   for(const x of [76,84,92])put(mst(i++),x,73,{block:true});for(const x of [72,80,88,96])put(mst(i++),x,78,{block:true})}
  for(let y=70;y<=81;y++)mark(107,y,'ivy');for(let x=100;x<=106;x++)mark(x,69,'ivy');
  put('fountain',103,77,{block:true});for(const [x,y] of [[101,73],[105,73],[101,80],[105,80]])put('gy_bench',x,y,{block:true});
  for(const [x,y] of [[100,71],[106,71],[100,75],[100,79],[106,79]])put('ps_urn_pale',x,y,{block:true});
  put('ps_hst1',102,71,{block:true});put('ps_hst2',104,81,{block:true});put('ps_hst4',106,73,{block:true});
  for(const x of [99,100,101,105,106])put('ps_hedge',x,70,{});
  wall(pt(30),[[68,71],[68,73],[68,79],[68,81]],We);
  thing('ps_p_curator','psh_curator',74,80);sign(70,81,So,'THE HALL OF STATUES','Kings and monsters of the old house');
  hang(74,76);hang(86,76);hang(98,76);lamp(103,74,V,1.5,110);
  foe('psarmour',80,72);foe('psarmour',88,79);foe('psarmour',96,72);foe('pscarver',92,76);foe('psdancer',84,76);foe('psdancer',100,78);foe('pscourtier',78,79);
  put('chest',88,68,{block:true,force:1});
  /* ===== D. the Great Hall ===== */
  for(let y=36,i=0;y<=62;y+=4,i++){col(42,y,i%2?2:0);col(70,y,i%2?0:2);col(38,y+2,1);col(74,y+2,1)}
  for(const x of [49,56,63]){for(let y=40;y<=60;y++){if((y-40)%5===2)put('ps_candelabra_tall',x,y,{block:true});else put('ps_table_long',x,y,{block:true,sc:.8})}
    for(let y=41;y<=59;y+=3){put('ps_chair_high',x-1,y,{block:true});put('ps_chair_high',x+1,y,{block:true})}}
  for(const x of [50,52,54,58,60,62])put('ps_table_high',x,34,{block:true});put('ps_candelabra_tall',49,35,{block:true});put('ps_candelabra_tall',63,35,{block:true});
  for(const x of [51,53,59,61])put('ps_chair_high',x,33,{block:true});put('ps_throne',50,32,{block:true});put('ps_throne',62,32,{block:true});
  pic('ps_pt_battle',48,32,N);pic('ps_pt_hunt',64,32,N);
  pic('ps_hearth_cold',36,48,We,{bob:.35});pic('ps_hearth_cold',76,48,Ea,{bob:.35});lamp(37,48,[1.05,1.1,1.35],2.2,170);lamp(75,48,[1.05,1.1,1.35],2.2,170);
  for(const y of [38,43,53,59,63]){pic('ps_banner_violet',36,y,We);pic('ps_banner_violet',76,y,Ea)}
  for(const x of [41,45,67,71])mark(x,31,'win');for(const x of [38,43,69,74])pic('ps_banner_violet',x,32,N);
  for(const x of [38,41,45,48,66,69,72,75])pic(pt(40+x),x,65,So);sign(53,65,So,'THE GREAT HALL','Feast and dance of the old house');
  for(const [x,y] of [[53,46],[53,54],[59,46],[59,54],[45,42],[45,58],[67,42],[67,58],[56,38],[56,63]])hang(x,y,1.9);
  foe('psdancer',45,52);foe('psdancer',67,50);foe('psdancer',46,45);
  for(const [x,y] of [[52,44],[60,52],[52,58],[60,44]])foe('psservant',x,y);
  foe('pscourtier',45,38);foe('pscourtier',67,38);foe('pscourtier',50,63);foe('pscarver',47,60);foe('pscarver',65,44);
  foe('psarmour',53,37);foe('psarmour',59,37);foe('psarmour',40,64);foe('psarmour',72,64);
  thing('hl_p_note','psh_seating',54,62,{sc:.5});
  /* ===== E. the Screens Passage ===== */
  for(let x=9,i=0;x<=29;x+=4,i++){col(x,52,i);col(x,60,i+1)}
  for(const x of [12,20,28])put('ps_sideboard',x,53,{block:true});
  thing('hl_p_rack','psh_keyboard',31,54);
  wall(pt(60),[[11,52],[15,52],[19,52],[23,52],[27,52],[31,52]],N);wall(pt(61),[[11,60],[15,60],[19,60],[23,60],[27,60],[31,60]],So);
  pic('gy_hatch',24,60,So,{bob:.6});sign(26,60,So,'THE BUTTERY','The hatch is painted shut');
  sign(8,52,N,'THE SCREENS PASSAGE','West to the kitchens and armoury');
  hang(14,56,1.6);hang(24,56,1.6);
  foe('psservant',16,54);foe('psservant',26,58);foe('psservant',22,56);foe('pscarver',30,57);foe('psarmour',10,58);
  /* ===== F. the Banqueting Hall ===== */
  for(let x=84,i=0;x<=104;x+=4,i++){col(x,45,i);col(x,61,i+1)}
  for(let x=84;x<=103;x++){if((x-84)%4===2)put('ps_candelabra_tall',x,50,{block:true});else put('ps_table_long',x,50,{block:true,sc:.8})}
  for(let x=85;x<=103;x+=2){put('ps_chair_high',x,49,{block:true});put('ps_chair_high',x,51,{block:true})}
  for(let k=0;k<5;k++){const x=86+k*4;put('ps_p_courtier'+(k+1),x,49,{block:true,npc:'psh_guest'+k})}
  for(let k=0;k<4;k++){const x=88+k*4;put('ps_p_courtier'+(k+2),x,51,{block:true,npc:'psh_guest'+(5+k)})}
  thing('ps_chair_high','psh_headchair',83,50);thing('hl_p_note','psh_sheet3',104,50,{sc:.5});
  for(let x=81;x<=91;x++)put('ps_balustrade',x,42,{block:true});for(let x=95;x<=105;x++)put('ps_balustrade',x,42,{block:true});
  for(const x of [84,88,100,104])pic('ps_banner_violet',x,40,N);put('ps_harpsichord',98,41,{block:true});put('ps_candelabra_tall',82,41,{block:true});put('ps_candelabra_tall',104,41,{block:true});
  for(const y of [43,46,49,60,63])pic(pt(80+y),106,y,Ea);for(const x of [82,85,88,91,94,97,100,103])pic(pt(100+x),x,64,So);for(const y of [45,48,52,60,63])pic(pt(120+y),80,y,We);
  sign(82,64,So,'THE BANQUETING HALL','The State Dining Room');
  for(const [x,y] of [[88,47],[98,47],[88,53],[98,53]])hang(x,y,1.9,V);
  foe('psdancer',90,59);foe('psdancer',100,59);foe('pscourtier',86,47);foe('pscourtier',102,47);foe('pscarver',92,53);foe('pscarver',96,53);foe('psarmour',84,63);foe('psarmour',104,63);
  /* ===== G. the Music Salon ===== */
  for(const [x,y] of [[11,34],[27,34],[11,46],[27,46],[19,32],[19,48]])col(x,y,2);
  thing('ps_harpsichord','psh_harp',8,40);put('ps_chair_high',10,38,{block:true});put('ps_chair_high',10,42,{block:true});
  for(const x of [16,22])put('ps_chair_high',x,31,{block:true});
  for(const x of [9,17,21,25,29])pic('ps_mirror',x,30,N);for(const y of [36,44])pic('ps_mirror',6,y,We);
  wall(pt(140),[[9,50],[13,50],[17,50],[21,50],[25,50],[29,50]],So);wall(pt(150),[[32,34],[32,46]],Ea);
  thing('hl_p_lectern','psh_stand1',7,32);thing('ps_p_lutenist','psh_lutenist',9,45);
  sign(30,30,N,'THE MUSIC SALON','Dancing every night');
  for(const [x,y] of [[13,36],[25,36],[13,44],[25,44],[19,40]])hang(x,y,1.7,V);
  for(const [x,y] of [[17,38],[22,42],[15,44],[23,36]])foe('psdancer',x,y);foe('pscourtier',28,40);foe('pscourtier',12,48);
  /* ===== H. the Lady's Withdrawing Room (rest) ===== */
  thing('ps_bed_four','psh_bed',13,16);put('chest',18,16,{block:true});
  for(const x of [9,13,17])mark(x,13,'win');
  pic('ps_mirror',6,20,We);wall(pt(160),[[6,24]],We);wall(pt(161),[[20,22],[20,26]],Ea);pic(pt(165),20,18,Ea);
  put('ps_candelabra_tall',9,26,{block:true});put('ps_candelabra_tall',17,26,{block:true});put('ps_urn_pale',8,16,{block:true});
  for(const [x,y] of [[10,20],[16,20],[13,15],[8,26],[18,26]])lamp(x,y,WM,1.9,140);
  /* ===== I. the Grand Stair Hall ===== */
  for(const x of [50,52,60,62])mark(x,15,'win');for(const x of [49,53,59,63])mark(x,15,'pilaster');for(const x of [47,48,64,65])mark(x,15,'ivy');
  for(const y of [16,17,18,19,20,21,22]){put('ps_balustrade',49,y,{block:true});put('ps_balustrade',63,y,{block:true})}
  put(PSH.st(3),52,17,{block:true});put(PSH.st(5),60,17,{block:true});
  for(const y of [18,22,26]){col(46,y,0);col(66,y,0)}col(50,26,1);col(62,26,1);
  put(PSH.st(1),45,11,{block:true});put(PSH.st(4),67,11,{block:true});put(PSH.st(0),45,13,{block:true});put(PSH.st(2),67,13,{block:true});
  for(const y of [14,18,22])mark(43,y,'win');for(const y of [14,22])mark(69,y,'win');
  wall(pt(200),[[44,12],[44,16],[44,20],[44,24]],We);wall(pt(210),[[68,12],[68,15],[68,23],[68,26]],Ea);wall(pt(220),[[46,28],[50,28],[62,28],[66,28]],So);
  sign(54,16,N,'UP THE GRAND STAIR','The way to the state rooms. Ask the Chamberlain.');sign(68,20,Ea,'THE AUDIENCE CHAMBER','The Sovereign receives no one');
  hang(56,24,1.8);hang(56,19,1.8,V);lamp(46,16,V,1.7,120);lamp(66,16,V,1.7,120);
  foe('psstairwarden',56,21);
  /* ===== J. the Trophy and Hunting Hall ===== */
  for(const y of [14,19,24,30]){col(84,y,1);col(102,y,1)}col(90,12,0);col(96,12,0);
  for(let x=86;x<=100;x++){if((x-86)%4===2)put('ps_candelabra_tall',x,28,{block:true});else put('ps_table_long',x,28,{block:true,sc:.8})}
  for(let x=87;x<=99;x+=2){put('ps_chair_high',x,27,{block:true});put('ps_chair_high',x,29,{block:true})}
  put('ps_throne',93,11,{block:true});
  for(const x of [82,85,88,98,101,104])pic(x%2?'ps_trophy_stag':'ps_trophy_stag',x,10,N);
  for(const y of [13,17,21,25,30])pic('ps_pt_hunt',80,y,We);for(const y of [13,17,21,25,30])pic(y%2?'ps_banner_violet':'ps_pt_battle',106,y,Ea);
  for(const x of [82,86,102])put('hl_p_cage',x,34,{block:true});
  thing('chest','psh_bowchest',104,12);sign(90,36,So,'THE TROPHY AND HUNTING HALL','The Sovereign hunted here');
  for(const [x,y] of [[88,16],[98,16],[88,32],[98,32]])hang(x,y,1.8);
  foe('psantlered',93,15);foe('psarmour',84,13);foe('psarmour',102,13);foe('pscarver',88,30);
  for(const [x,y] of [[84,32],[100,32],[90,20],[96,20]])foe('pshhound',x,y);
  thing('hl_p_note','psh_huntbook',92,26,{sc:.5});
}

/* ---------- doors ---------- */
function pshSelfMove(a){G.talk=null;sfx('door');G.P.x=a[0];G.P.y=a[1];G.P.f=a[2];G.P.angT=(a[2]-1)*Math.PI/2;G.C={x:a[0],y:a[1],a:G.P.angT};try{reveal()}catch(e){}}
function pshDoor(d,nx,ny){
  const F=pshF();
  if(d.psh==='link'){const l=d.link;
    if(l.lock){
      if(bagCount(l.lock)<=0){sfx('locked');msg('An iron-bound door with a silver lock. It will not move. The key must be somewhere on this floor.','#c8c4e8');
        if(typeof QUESTS!=='undefined'&&QUESTS.psq10&&qSt('psq10')===null){qAccept('psq10');msg('The Chamberlain in the Entrance Hall may know where the key is kept.','#ffe36a')}return true}
      if(!F.stairOpen){F.stairOpen=1;msg('The silver key turns in the lock without a sound. The door opens inward.','#dcd4ff')}}
    if(!LEVELS[l.to]&&!KH_LAZY[l.to]){sfx('locked');msg('The way beyond is not open yet.','#c8c4e8');return true}
    if(!LEVELS[l.to])try{KH_LAZY[l.to]()}catch(e){console.error(e)}
    sfx('door');goToLevel(l.to,{x:l.land[0],y:l.land[1],f:l.land[2]});return true}
  if(d.psh==='warp'){const into=G.P.y<d.y?d.b:d.a;pshSelfMove(into);if(into===d.b)msg("The Lady's Withdrawing Room. It is warm and quiet here, and the light is candlelight. Nothing has followed you in.",'#f0c890');return true}
  if(d.psh==='closet'){if(F.closetOpen||bagCount('pskeyclo')>0){F.closetOpen=1;if(G.grid[ny][nx]!==0)G.grid[ny][nx]=0;sfx('door');msg("The brass key turns. The painters' closet is open.",'#e8dcc0');return true}
    sfx('locked');msg("A small door with a brass lock. A sign on it says PAINTERS. It is locked.",'#c8c4e8');return true}
  if(d.psh==='barred'){sfx('locked');msg("The Sovereign's audience chamber. Sealed.",'#c8c4e8');return true}
  if(d.psh==='niche'){if(F[d.flag]){if(G.grid[ny][nx]!==0)G.grid[ny][nx]=0;return true}sfx('bump');msg('A wall of cold stone. Nothing else.','#a8a8b8');return true}
  return false}
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];if(d&&d.psh)return pshDoor(d,nx,ny);return _k.apply(this,arguments)}}
/* arrival: hidden chests and opened secret doors follow the flags; the party is told where it is */
const PSH_HID=[[24,68,'framePainted'],[88,68,'statueTurned']];
function pshApply(){
  const F=pshF();if(!G.decor||!G.grid)return;
  for(const [x,y,flag] of PSH_HID){const on=!!F[flag];for(const d of G.decor)if(d.k==='chest'&&d.x===x&&d.y===y){d.found=!on;d.hidden=!on;if(!on)d.block=false}if(on&&G.grid[y+1])G.grid[y+1][x]=0}
  if(F.closetOpen&&G.grid[69])G.grid[69][10]=0}
function pshArrive(n){try{pshApply()}catch(e){console.error('pshApply',e)}}
/* ---------- helpers ---------- */
function pshGive(item){if(!bagAdd(mkItem(item)))G.items.push({k:item,x:Math.round(G.P.x),y:Math.round(G.P.y),taken:false})}
function pshDismiss(pred){let n=0;for(const e of G.enemies||[])if(e.hp>0&&!e.dying&&pred(e)){e.hp=0;e.dying=.55;n++}return n}
function pshTake(id,name,pic,flag,item,before,after,btn,done){
  khNpc(id,name,pic,d=>{const F=pshF();if(F[flag])return say(after,[BYE]);
    return say(before,[[btn,()=>{F[flag]=1;pshGive(item);sfx('key');msg(done,'#ffe36a');G.talk=null;return null}],BYE])});}
const pshTalk=(id,name,pic,text)=>khNpc(id,name,pic,()=>say(text,[BYE]));
const pshCount=o=>Object.keys(o||{}).length;
/* ---------- quests and people ---------- */
if(typeof QAREA!=='undefined'){for(const q of ['psq10','psq11','psq12'])QAREA[q]='The Pale Lands'}
yrQ('psq10','Up the Grand Stair','The Chamberlain, in the Entrance Hall',[
  ['Find the Second Floor Key. The Chamberlain says the household went up the Grand Stair and the keys went with the Sacristan. Ask the porter at the gate, the librarian and the prisoners below.',()=>!!pshF().key2||bagCount('pskey2')>0||!!pshF().stairOpen,['psh_chamberlain']],
  ['Open the iron-bound Grand Stair door at the north end of the Great Halls with the key.',()=>!!pshF().stairOpen,['psh_chamberlain']]],{gold:8000,xp:50000,items:['potion6','potion6']});
yrQ('psq11','The Wrong Waltz','The Lutenist, in the Music Salon',[
  ['Find the three sheets of the waltz: one on the stand in the Music Salon, one on the lectern in the Gallery of Portraits, one on the high table of the Banqueting Hall.',()=>!!(bagCount('pssheet1')&&bagCount('pssheet2')&&bagCount('pssheet3'))||!!pshF().waltz,['psh_stand1','psh_stand2','psh_sheet3']],
  ['Play the three sheets at the harpsichord in the Music Salon.',()=>!!pshF().waltz,['psh_harp']]],{gold:6500,xp:40000,items:['pslutering']});
yrQ('psq12',"The Curator's Count",'The Curator, in the Hall of Statues',[
  ['Read the nameplates of six statues in the Hall of Statues, so that the Curator can have them counted and named.',()=>pshCount(pshF().pl)>=6,['psh_pl0','psh_pl1','psh_pl2','psh_pl3','psh_pl4','psh_pl5']]],{gold:5000,xp:30000,items:['potion6']});
khNpc('psh_chamberlain','The Chamberlain (a ghost)','ps_p_chamberlain',()=>say('Good evening. Or good morning. I have lost the habit of telling them apart. I am the Chamberlain of this house, and I am afraid the house is closed. The Sovereign and the whole household went up the Grand Stair long ago, and the stair has been locked ever since. I cannot open it myself. I cannot open anything, now.',[
  ['What is this place?',()=>say('The Great Halls, the ground floor of the main block. The Great Hall is straight ahead, with the long tables. The Gallery of Portraits is west, the Hall of Statues is east. The service wing is beyond the Screens Passage, west of the Great Hall, and the cloister and chapel are beyond the Banqueting Hall, to the east.',[BYE])],BYE]));
blGiveOpt('psh_chamberlain','psq10',()=>true,{
  offer:'There is a door at the north end of the Great Halls, the Grand Stair, with a silver lock. The Sovereign sent for the key when the household went up, and nobody ever brought it back. If the key could be found, the stair could be opened. I would like to know that somebody had tried. Will you look for it?',
  accept:'Thank you. The keys of the upper floors were always returned to the Sacristan at dusk. The porter at the gate, the librarian in the east wing and the prisoners in the dungeons may remember more than I do. I am a ghost, and ghosts forget.',
  remind:()=>pshF().stairOpen?'Go back to the Chamberlain: the door is open.':'The key to the Grand Stair. Ask the porter at the gate, the librarian, and the prisoners below. Then open the iron-bound door at the north end of the Great Halls.',
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
    const n=pshDismiss(e=>e.t==='psdancer'&&e.x<34&&e.y<52);msg('The waltz comes out whole this time. In the walls, in the floor, the other half of the tune answers and falls quiet.'+(n?' The dancing dead stop, one by one, and fade away.':''),'#ffe36a');sfx('level');return null}],BYE])});
khNpc('psh_bed','A four-poster bed','ps_bed_four',()=>say('A great four-poster bed with violet curtains, made up fresh. The candles in the room burn with a warm yellow flame, the only warm light in the castle. Nothing in this room has ever moved.',[['Rest.',()=>{G.talk=null;if(typeof restParty==='function')restParty(true);return null}],BYE]));
pshTalk('psh_turner','A statue of a monster','ps_hst7','A heavy statue on a plinth in front of a plain stretch of wall. The plinth has an iron ring set into its side, worn bright.');
{const n=NPCS.psh_turner,old=n.root;n.root=d=>{const F=pshF();if(F.statueTurned)return say('The statue has been turned. Behind it, a niche stands open in the wall.',[BYE]);
  return say('A heavy statue on a plinth in front of a plain stretch of wall. The plinth has an iron ring set into its side, worn bright, and a scrape on the floor shows that it has been turned before.',[['Turn the statue by the ring.',()=>{F.statueTurned=1;G.talk=null;sfx('door');msg('The statue turns on its plinth with a grinding sound. A niche opens in the wall behind it.','#ffe36a');pshApply();return null}],BYE])};if(KH_KEEPERS.psh_turner)KH_KEEPERS.psh_turner.root=n.root}
/* the ghosts at the banquet: they do not move until the party sits at the head of the table */
const PSH_GUESTS=['The guest is a pale lady in a long gown. She holds a cup to her lips and does not drink.','A pale man in a doublet sits straight, looking at the empty plate in front of him, and smiling at it.','An old courtier, his chin on his chest. His hands rest on the table either side of a goblet that has dried to a ring.','A pale lady turns the stem of her glass between her fingers. She does not look at you. She is listening to something far away.','A courtier in a feathered hat sits very still. The feather moves, slowly, as if in a draught, though the air is quiet.','A young woman in a grey gown stares at the high table. The chair at the head is empty. She is waiting.','An old man with a white beard raises a hand to speak, and has been raising it for a hundred years.','A lady with a fan, fanning nothing.','A pale man with his napkin tucked in, a fork in his hand, and nothing on the fork.'];
for(let i=0;i<9;i++)khNpc('psh_guest'+i,'A ghost at the table','ps_p_courtier'+((i%5)+1),()=>say(PSH_GUESTS[i]+' It does not answer.',[BYE]));
khNpc('psh_headchair','The head of the table','ps_chair_high',()=>{const F=pshF();
  if(F.banquet)return say('The head of the table. The chair is pulled out, and the plates are empty.',[BYE]);
  return say('A tall chair at the head of the long table, pulled out as if the host had just risen. Every ghost at the table is facing it, and none has moved.',[['Sit down.',()=>{F.banquet=1;G.talk=null;sfx('rattle');
    const L=[[86,47],[92,47],[98,47],[102,53],[90,53],[96,53]];let n=0;for(const [x,y] of L){if(bl3Add(n%3===0?'psdancer':'pscourtier',x,y,101))n++}
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
    if(d.x===104&&d.y===12){add('pshuntbow');add(potionFor(r(1)),1);add('supermana',2);d.gold=5200;return items}
    for(let q=0;q<3;q++)add(potionFor(r(10+q)),1);add('supermana',1+(d.y<30?1:0));if(r(2)<.7)add('elixir',1);
    if(d.y>30){for(let q=0;q<2;q++){const a=typeof armourDrop==='function'?armourDrop(r(20+q)):null;if(a)add(a)}if(typeof ringFor==='function'&&r(3)<.6)add(ringFor(r(4),101))}
    d.gold=d.goldAmt||(d.y<30?2400:4200+Math.floor(r(5)*2800));
    if(d.x===24&&d.y===68||d.x===88&&d.y===68){if(typeof gemFor==='function')try{add(gemFor(r(6)))}catch(e){}d.gold=7500}
    return items}
  return _lf.apply(this,arguments)}}
/* ---------- the jump link and a test helper ---------- */
function pshReport(){const L=LEVELS[PSH.ID]||(KH_LAZY[PSH.ID]&&(KH_LAZY[PSH.ID](),LEVELS[PSH.ID]));if(!L)return null;const c={};for(const d of L.decor)c[d.k]=(c[d.k]||0)+1;return {decor:L.decor.length,enemies:L.enemies.length,lights:L.lights.length,cols:(c.ps_col_fluted||0)+(c.ps_col_twist||0)+(c.ps_col_silver||0),pics:L.decor.filter(d=>d.pic).length,miss:L._psh.miss}}
