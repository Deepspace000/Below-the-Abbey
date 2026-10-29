/* ==========================================================================
   THE PALE SPIRE, PACKAGE 4: the ground floor, service and quiet rooms (prefix psw / PSW). Levels 9750 (Kitchens and Armoury, the west wing) and 9760 (Cloister, Chapel and Library, the east wing).
   Owns: the two levels, the maker pswMake, the creatures pscook pskrat psarmourer psbakeghost psmonk pschorister psbookwraith psink psteward pssacristan (and psarmour if package 3 did not define it),
   the items pskey2 psladle psdawnwarden and the quest items of psq20 to psq23, the key flow (candle bracket, sacristy, boss, key, the three locked stairs), the rest rooms (Maids' Loft, Almonry), the people psw_*, quests psq20 to psq23.
   Pictures come from pswPic(name): a painted ps_<name> when it exists, else a stand-in made from existing pieces (see PSW_STAND). Nothing here is drawn in code except walls and floors.
   Notes: tools/PALE_SPIRE_NOTES.md (section Package 4). Contract numbers come from ps_ids.js (pspLinksFrom).
   ========================================================================== */
const PSW={W:9750,E:9760,ids:[9750,9760],ready:false,loading:null};
const pswIs=n=>n===9750||n===9760;
const pswF=()=>{const F=G.flags;return F.psp||(F.psp={})};
PSW.NAMES={9750:'The Ground Floor: Kitchens and Armoury',9760:'The Ground Floor: Cloister, Chapel and Library'};
for(const n of PSW.ids){LEVEL_RATING[n]=101;LEVEL_NAMES[n]=PSW.NAMES[n]}
/* ---------- items ---------- */
ITEMDEF.pskey2={n:'The Second Floor Key',k:'quest',t:'Key',ic:'key',c:'#dfe6f2',stack:1,price:0,rar:1,sw:.3,d:'A tall silver key with a violet stone in the bow. It opens the three stair doors to the second floor of the Pale Spire.'};
ITEMDEF.psladle={n:"Peck's Ladle",k:'quest',t:'Quest item',ic:'ore',c:'#b8b0a0',stack:1,price:0,sw:.3,d:"A long iron ladle with a worn wooden grip. Ansel Peck cooked with it for thirty years. It hangs by the great hearth in the kitchens."};
ITEMDEF.psdawnwarden={n:'Dawnwarden',k:'quest',t:'Quest item',ic:'sword',c:'#e8ecf4',stack:1,price:0,rar:1,sw:.6,d:"A long bright sword with a plain hilt, taken from Sir Edrik Stamford when he was brought in. It hangs on a rack in the armoury. Sir Edrik wants it back."};
ITEMDEF.psloaf={n:'Pale Loaf',k:'quest',t:'Quest item',ic:'bread',c:'#e8e0d0',stack:6,price:0,sw:.2,d:'A small round loaf, cold and white, from the ovens of the Bakehouse. The ghosts of the servants are hungry.'};
ITEMDEF.pshilt={n:'Sword Hilt',k:'quest',t:'Quest item',ic:'sword',c:'#a8a8b4',stack:3,price:0,sw:.2,d:"A sword hilt with no blade. The armourer of the Pale Spire hammered it flat once and cannot remember where he put the rest."};
for(let i=1;i<=5;i++)ITEMDEF['psbook'+i]={n:['The Book of Hours','Ledger of Candles','A Herbal of the Pale Lands','Songs for the Choir','A Treatise on Locks'][i-1],k:'quest',t:'Lore',ic:'book',c:'#9a8cb0',stack:1,price:0,sw:.2,d:'A library book with a violet cloth cover and the stamp of the Pale Spire library inside. It should not be here. The librarian wants it back on its shelf.'};
ITEMDEF.pshabit={n:"The Sacristan's Habit",k:'quest',t:'Lore',ic:'book',c:'#8a7ca0',stack:1,price:0,sw:.2,d:'A thin book bound in grey cloth.'};
ITEMDEF.psstew={n:'Pale Stew',k:'food',t:'Meal',ic:'pottage',c:'#d8d4c8',heal:120,feed:90,stack:1,price:0,sw:.3,d:'A bowl of thick white stew, hot for the first time in years. It heals a good deal and fills the stomach.'};
ITEMDEF.pslibring={n:"Ring of the Overdue Page",k:'ring',t:'Ring',ic:'ring',c:'#c8b8e8',price:0,lvl:101,pas:{ward:20,dodge:.07,regen:.7,mpRegen:.6},int:8,hp:90,rar:1,sw:.1,d:'A thin silver ring with a violet chip of glass set in it, from the librarian of the Pale Spire. Adds 8 Intelligence and 90 health, every blow on the wearer is 20 lighter, enemies miss 7% more, and wounds and tiredness heal steadily. Needs level 101.'};
ITEMDEF.psarmourplate={n:"The Armourer's Pale Hauberk",k:'chest',t:'Chest',ic:'chest',c:'#d0d4e4',armor:62,price:0,lvl:101,pas:{ward:22,regen:.7,dodge:.08},rar:1,gear:1,sw:.5,d:"A hauberk of pale steel rings that the Dead Armourer finished when he thought nobody was looking. Enemies miss 8% more, every blow on the wearer is 22 lighter, and wounds close steadily. Needs level 101."};
ITEMDEF.pscandle={n:'Blessed Candle',k:'potion',t:'Potion',ic:'potion',c:'#f0e8c0',price:0,d:'A candle of the Pale Chaplain, lit once at the chapel altar. It lifts haunting and curses from whoever holds it to their brow. A blessing in wax.',cures:1,sw:.2,all:1};
ITEMDEF.psfont={n:'Font Water',k:'potion',t:'Potion',ic:'potion',c:'#c8e0f0',price:0,d:'Water from the font of the Pale Chapel, still clean. It lifts haunting and curses from whoever drinks it.',cures:1,sw:.3,all:1};
/* ---------- creatures ---------- */
function pswW(img,h){const s=IMG[img];return s&&s.height?+(h*s.width/s.height).toFixed(2):h*.45}
const PSW_FOES={
  pscook:{name:'Pale Cook',hp:58,dmg:[6,10],hit:.85,h:1.0,src:'smith',xp:24,speed:1,verb:'chops at',glow:.15},
  pskrat:{name:'Kitchen Rat Swarm',hp:42,dmg:[5,8],hit:.86,h:.55,src:'gy_rats',xp:20,speed:2,verb:'gnaws'},
  psarmourer:{name:'Dead Armourer',hp:62,dmg:[7,11],hit:.85,h:1.0,src:'smith',xp:26,speed:1,verb:'hammers',glow:.2},
  psbakeghost:{name:"Baker's Ghost",hp:46,dmg:[5,9],hit:.84,h:.95,src:'hl_p_ghost',xp:22,speed:1,fly:true,floatH:.1,verb:'chills',glow:.5},
  psmonk:{name:'Pale Monk',hp:56,dmg:[6,10],hit:.85,h:1.0,src:'w_rattlebones',xp:24,speed:1,verb:'strikes',glow:.2},
  pschorister:{name:'Pale Chorister',hp:44,dmg:[6,11],hit:.86,h:.9,src:'hl_p_ghost',xp:26,speed:1,ranged:2,still:1,wake:'The choir stops singing, all at once, and turns to look at you.',fly:true,floatH:.1,verb:'sings at',glow:.6},
  psbookwraith:{name:'Book Wraith',hp:50,dmg:[6,11],hit:.86,h:1.0,src:'wm_wraith',xp:26,speed:1,fly:true,floatH:.15,verb:'whirls pages at',glow:.5,ranged:2},
  psink:{name:'Ink Blot',hp:40,dmg:[4,8],hit:.86,h:.5,src:'gy_rats',xp:20,speed:1,verb:'smears',slow:1},
  psarmour:{name:'Hollow Suit of Armour',hp:66,dmg:[7,12],hit:.85,h:1.05,src:'hl_p_armour',xp:26,speed:1,verb:'swings at',still:1,wake:'The empty suit of armour turns its helm towards you with a grinding of plates.'},
  psteward:{name:'The Pale Steward',hp:520,dmg:[9,15],hit:.9,h:1.5,src:'priest',xp:700,speed:1,verb:'rakes',boss:true,glow:.5,noFlee:1},
  pssacristan:{name:'The Pale Sacristan',hp:580,dmg:[9,15],hit:.9,h:1.4,src:'monk',xp:700,speed:1,verb:'smites',boss:true,glow:.6,noFlee:1}};
function pswFoePics(){
  for(const k in PSW_FOES){const d=PSW_FOES[k],kk='psw_i_'+k;
    if(!IMG[kk]){const pk=(IMG['ps_c_'+k]&&!IMG['ps_c_'+k]._ps)?'ps_c_'+k:IMG['ps_'+k]?'ps_'+k:null,src=(pk&&IMG[pk])||IMG[d.src];if(src&&src.width){
      if(pk)IMG[kk]=src;else try{const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');try{x.filter=PSW_FILT[k]||'saturate(.3) brightness(1.2) hue-rotate(205deg)'}catch(e){}x.drawImage(src,0,0);IMG[kk]=c}catch(e){IMG[kk]=src}}}
    if(IMG[kk]){NPC_H[kk]=(IMG['ps_c_'+k]&&NPC_H['ps_c_'+k])||d.h;ENEMY_DEF[k].w=pswW(kk,NPC_H[kk]);ENEMY_DEF[k].img=kk}}}
const PSW_FILT={pscook:'saturate(.25) brightness(1.3) hue-rotate(205deg)',psarmourer:'saturate(.25) brightness(1.3) hue-rotate(205deg)',psmonk:'saturate(.3) brightness(1.45) hue-rotate(205deg)',pssacristan:'saturate(.3) brightness(1.5) hue-rotate(205deg)',psteward:'saturate(.2) brightness(1.5) hue-rotate(205deg)',
  psbakeghost:'saturate(.3) brightness(1.15) hue-rotate(205deg)',pschorister:'saturate(.3) brightness(1.3) hue-rotate(205deg)',psbookwraith:'saturate(.5) brightness(1.15) hue-rotate(20deg)',psink:'brightness(.25) saturate(.4)',pskrat:'brightness(.9) saturate(.3)',psarmour:'saturate(.25) brightness(1.35) hue-rotate(205deg)'};
for(const k in PSW_FOES){if(k==='psarmour'&&ENEMY_DEF.psarmour)continue;const d=PSW_FOES[k];
  ENEMY_DEF[k]={name:d.name,hp:d.hp,dmg:d.dmg,hit:d.hit,w:d.h*.45,img:'gyi_skel',xp:d.xp,gold:d.boss?[0,0]:[140,380],speed:d.speed,verb:d.verb,psw:1};
  for(const q of ['fly','floatH','glow','ranged','boss','noFlee','still','wake'])if(d[q]!==undefined)ENEMY_DEF[k][q]=d[q]}
if(typeof NO_VARY!=='undefined')NO_VARY.push('psteward','pssacristan');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('psteward','pssacristan');
if(typeof BOSS_GOLD!=='undefined'){BOSS_GOLD.psteward=[4400,5400];BOSS_GOLD.pssacristan=[4400,5400]}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^pschorister/,'haunted',.2],[/^psbakeghost/,'shaken',.15],[/^pssacristan/,'cursed',.2],[/^psteward/,'shaken',.2],[/^psink/,'shaken',.1]);
/* ---------- pictures: painted ps_<name> if present, else a stand-in from existing pieces ---------- */
/* name: [source key, filter, height in squares]. Painted drop-ins: IMG['ps_'+name] (assets/ps) win automatically. */
const PSW_STAND={
  cauldron_big:['ww_cauldron','saturate(.2) brightness(1.2) hue-rotate(205deg)',1.0],spit_hearth:['hgtb_furn_hearth','saturate(.3) hue-rotate(205deg) brightness(.95)',1.25],
  butcher_block:['wm_crate','',.62],pans_hanging:['wm_cage_lantern','saturate(.5)',.5],barrels:['wm_barrel','',.62],cask:['wm_cask','',.55],oven:['hgtb_furn_hearth','saturate(.15) brightness(.8) hue-rotate(205deg)',1.0],
  pews:['mi_pew','saturate(.5) hue-rotate(205deg) brightness(.95)',.8],altar:['mi_altar','saturate(.6) hue-rotate(205deg)',1.45],window_stained:['hl_p_window','',1.9],font:['mi_font','saturate(.6) hue-rotate(205deg)',1.0],
  reliquary_chest:['wm_chest','saturate(.5) brightness(1.4) hue-rotate(10deg)',.5],lectern:['hl_p_lectern','',.95],bookcase_tall:['hl_p_shelf','saturate(.6) hue-rotate(205deg) brightness(.9)',1.7],
  bookcase_wm:['wm_bookshelf','',1.6],reading_desk:['hl_p_desk','',.8],globe:['hgtb_furn_books_globe','saturate(.4) hue-rotate(205deg)',.6],scroll_rack:['hgtb_furn_cabinet','saturate(.5) hue-rotate(205deg) brightness(.8)',.6],
  st_saint1:['mi_saint','saturate(.2) brightness(.95) hue-rotate(205deg)',1.7],st_saint2:['wm_statue','saturate(.25) brightness(1.5) hue-rotate(10deg)',1.55],st_saint3:['mi_angel','saturate(.15) brightness(1.1) hue-rotate(205deg)',1.8],st_saint4:['mi_saint','saturate(.15) brightness(.8) hue-rotate(205deg)',1.7],
  candelabra:['mi_candel','saturate(.5) hue-rotate(205deg)',1.45],chandelier:['mi_chand','saturate(.5) hue-rotate(205deg)',1.2],brazier:['wm_brazier','',.9],
  ghost_librarian:['hl_p_ghost','saturate(.4) hue-rotate(205deg)',1.15],ghost_chamberlain:['hl_p_ghost','saturate(.3) hue-rotate(160deg)',1.15],
  armoury_rack:['hgstall_armour','',.9],sword_rack:['hgstall_arms','',.9],suit:['hl_p_armour','saturate(.25) brightness(1.35) hue-rotate(205deg)',1.05],
  bed:['hgtb_furn_bed','saturate(.35) sepia(.5) hue-rotate(-10deg)',.55],cabinet:['hgtb_furn_cabinet','saturate(.25) hue-rotate(10deg) brightness(.8)',.55],table:['hgtb_table','saturate(.25) hue-rotate(10deg) brightness(.85)',.55],
  chair:['hgtb_chair','saturate(.3) brightness(.9)',.5],bucket:['wm_bucket','',.4],tools:['wm_tools','',.55],candle:['hl_p_candle','',.65],
  cl_monk:['hgxstat6','saturate(.1) brightness(1.9)',1.5],cl_knight:['hgxstat0','saturate(.1) brightness(1.9)',1.6],cl_smith:['hgxstat1','saturate(.1) brightness(1.9)',1.5],cl_angel:['hgxstat2','saturate(.1) brightness(1.9)',1.7],cl_maiden:['hgxstat3','saturate(.1) brightness(1.9)',1.5],cl_girl:['hgxstat7','saturate(.1) brightness(1.9)',1.3],bench_moss:['gy_bench','sepia(.4) hue-rotate(50deg) saturate(1.7) brightness(1.0)',.55],
  desk:['hl_p_desk','',.8],note:['hl_p_note','',.5],chest:['wm_chest','',.5],coffer:['gy_chest','',.55],banner:['hl_p_banner','saturate(.5) hue-rotate(40deg)',1.3],tomb:['hl_p_tomb','',.8],
  hearth:['hgtb_furn_hearth','saturate(.3) hue-rotate(205deg) brightness(1.0)',1.2],cage:['hl_p_cage','',.8],clock:['hgtb_furn_clock','saturate(.3) hue-rotate(10deg)',1.0],mirror:['wm_mirror','',1.2],
  well:['ww_well','saturate(.4) brightness(1.1) hue-rotate(205deg)',.9],lamp:['hgtb_lamp_tall','saturate(.4) hue-rotate(205deg)',1.3],basket:['sack','',.4],jar:['vase1','',.5],vase:['vase0','saturate(.4) brightness(1.2)',.5],
  fern:['hgt_fern','saturate(.6) brightness(.8)',.7],ivy:['hgt_vine_wisteria','saturate(.6) hue-rotate(60deg) brightness(.8)',1.3],shrub:['hgt_shrub','saturate(.5) brightness(.7) hue-rotate(20deg)',.8],bones:['gy_bones','',.35],
  pond:['hgtb_tank_round','saturate(.6) hue-rotate(205deg) brightness(.6)',.5],lilies:['hgdf_plant7','',.6],flowers:['hgt_pearlbush','saturate(.5)',.6],flowers2:['hgtb_plant_lupin','saturate(.8) hue-rotate(20deg)',.8],flowers3:['wm_bellflower','',.7],rose:['gy_rose','',.4],
  tapestry:['hl_p_banner','saturate(.3) hue-rotate(205deg)',1.4],plaque:['hs_plaque','',.7],sack:['sack2','',.4],sacks:['sacks','',.5],keg:['wm_keg','',.55],crate:['wm_crate','',.5],pot:['vase3','',.5],
  grill:['hl_p_chains','',1.3],stool:['hgtb_chair','saturate(.2) brightness(.7)',.4],rug:['hgtb_rug_lilac_runner','',.2],banner_long_a:['hl_p_banner','saturate(1.4) sepia(.7) hue-rotate(-15deg) brightness(.75)',2.4],banner_long_b:['hl_p_banner','saturate(1.2) sepia(.9) hue-rotate(-30deg) brightness(.65)',2.4],
};
{const DK='grayscale(.85) brightness(.46) contrast(1.3)';
 const F={furn_sideboard:['hgtb_furn_cabinet',DK,.85],furn_organ:['mi_altar',DK,2.0],furn_chair_high:['hgtb_chair',DK,1.1],furn_fireplace_tall:['hgtb_furn_hearth',DK,1.7],furn_wardrobe:['hgtb_furn_cabinet',DK,1.6],furn_cradle:['hgtb_furn_bed',DK,.5],furn_bed_canopy:['hgtb_furn_bed',DK,1.3],furn_bookcase:['hl_p_shelf',DK,1.9],furn_desk:['hl_p_desk',DK,.9],furn_screen_tracery:['hl_p_window',DK,1.6],furn_pulpit:['hl_p_lectern',DK,1.5],furn_altarpiece:['mi_altar',DK,2.1],furn_pew_black:['mi_pew',DK,.9],furn_lectern_black:['hl_p_lectern',DK,1.15],furn_clock_grandfather:['hgtb_furn_clock',DK,1.9],furn_candelabra_black:['mi_candel',DK,1.5],window_stained_tall:['hl_p_window','',3.4]};
 for(const n in F){PSW_STAND[n]=F[n];if(typeof PSP_PICS!=='undefined'&&!PSP_PICS[n])PSP_PICS[n]=[F[n][2],[F[n][0]],{dark:1}]}}
/* ambient ghosts: translucent stand-ins (a painted ghost_<name> or p_ghost_<name> in assets/ps wins) */
const PSW_GHOST={ghost_servant:[['gyi_ghost1','hl_p_ghost'],1.6],ghost_cook:[['gyi_ghost0','hl_p_ghost'],1.6],ghost_baker:[['gyi_ghost0','hl_p_ghost'],1.6],ghost_armourer:[['hl_p_armour','hl_p_ghost'],1.7],ghost_choir:[['gyi_banshee','gyi_ghost2','hl_p_ghost'],1.5],ghost_monk:[['gyi_ghost2','hl_p_ghost'],1.6],ghost_scholar:[['gyi_ghost1','hl_p_ghost'],1.6],ghost_maid:[['gyi_ghost0','hl_p_ghost'],1.5]};
for(const n in PSW_GHOST)if(typeof PSP_PICS!=='undefined'&&!PSP_PICS[n])PSP_PICS[n]=[PSW_GHOST[n][1],PSW_GHOST[n][0],{ghost:1}];
/* every ambient ghost wears one of the painted gaunt p_ghost_* pieces (no folk or stand-in sprites) */
const PSW_GMAP={ghost_servant:'butler',ghost_cook:'maid',ghost_baker:'gentleman',ghost_armourer:'soldier',ghost_choir:'child',ghost_monk:'priest',ghost_scholar:'gentleman',ghost_maid:'maid',ghost_librarian:'lady',ghost_chamberlain:'butler'};
function pswPic(name){
  const pnt=n=>IMG[n]&&!IMG[n]._ps;
  {const gk='ps_p_ghost_'+PSW_GMAP[name];if(PSW_GMAP[name]&&pnt(gk)){NPC_H[gk]=NPC_H[gk]||1.8;return gk}}
  if(PSW_GHOST[name]&&!pnt('ps_'+name)&&!pnt('ps_p_'+name)){const k='psw_'+name;if(IMG[k])return k;const src=PSW_GHOST[name][0].map(n=>IMG[n]).find(i=>i&&i.width);if(!src)return null;
    try{const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.globalAlpha=.5;x.filter='brightness(1.2) saturate(.4) hue-rotate(185deg)';x.drawImage(src,0,0);IMG[k]=c}catch(e){IMG[k]=src}NPC_H[k]=PSW_GHOST[name][1];return k}
  if(PSW_GHOST[name]&&pnt('ps_p_'+name)){NPC_H['ps_p_'+name]=NPC_H['ps_p_'+name]||PSW_GHOST[name][1];return 'ps_p_'+name}
  if(pnt('ps_'+name)){NPC_H['ps_'+name]=NPC_H['ps_'+name]||(PSW_STAND[name]?PSW_STAND[name][2]:1);return 'ps_'+name}
  const k='psw_'+name,d=PSW_STAND[name];
  if(IMG[k])return k;
  if(!d){if(typeof PSP_PICS!=='undefined'&&PSP_PICS[name]&&typeof pspPic==='function')return pspPic(name);return IMG[name]?name:null}
  const src=IMG[d[0]];if(!src||!src.width)return null;
  if(d[3]){try{const [a,b,cw,chh]=d[3],c=document.createElement('canvas');c.width=Math.max(8,src.width*cw|0);c.height=Math.max(8,src.height*chh|0);const x=c.getContext('2d');x.filter=d[1]||'none';x.drawImage(src,src.width*a,src.height*b,src.width*cw,src.height*chh,0,0,c.width,c.height);IMG[k]=c}catch(e){IMG[k]=src}}
  else if(d[1]){try{const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.filter=d[1];x.drawImage(src,0,0);IMG[k]=c}catch(e){IMG[k]=src}}else IMG[k]=src;
  NPC_H[k]=d[2];return k}

let PSW_STATN=0;const pswStat=()=>['cl_monk','cl_knight','cl_angel','cl_smith','cl_maiden','cl_girl'][(PSW_STATN++)%6];
/* ---------- loading, arrival, doors, light ---------- */
function pswLoad(){
  if(PSW.loading)return PSW.loading;
  PSW.loading=Promise.resolve(typeof wlLoad==='function'?wlLoad():0).then(()=>typeof gyLoad==='function'?gyLoad():0).then(()=>{try{gyAlias()}catch(e){console.error(e)}PSW.ready=true}).catch(e=>{console.error('pswLoad',e);PSW.ready=true});
  return PSW.loading}
{const _g=goToLevel;goToLevel=function(n,entry){
  if(pswIs(n)&&!PSW.ready&&!PSW._wait){PSW._wait=1;pswLoad().then(()=>{PSW._wait=0;goToLevel(n,entry)});return}
  if(pswIs(n)&&LEVELS[n]===undefined)try{pswMake(n)}catch(e){console.error(e)}
  const r=_g.call(this,n,entry);
  try{if(pswIs(n))pswArrive(n)}catch(e){console.error('pswArrive',e)}
  return r}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(pswIs(n)&&!PSW.ready&&!PSW._wait){PSW._wait=1;pswLoad().then(()=>{PSW._wait=0;jumpToLevel(n,target)});return}
  return _j.apply(this,arguments)}}
{const _r=restore;restore=function(sv){
  if(sv&&pswIs(sv.level)&&!PSW.ready&&!PSW._wait){PSW._wait=1;pswLoad().then(()=>{PSW._wait=0;restore(sv)});return}
  return _r.apply(this,arguments)}}
{const _rn=restoreNow;restoreNow=function(sv){const r=_rn.apply(this,arguments);try{if(pswIs(LEVEL))pswArrive(LEVEL)}catch(e){console.error('psw restore',e)}return r}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||pswIs(n)}}
{const _ll=loadLevel;loadLevel=function(n){const r=_ll.apply(this,arguments);G.pswOpenLv=-1;return r}}
function pswArrive(n){
  PSW._gd=null;
  pswFoePics();
  const F=pswF(),L=LEVELS[n],V=L&&L._psw;
  if(V&&V.secret&&F.sacristyOpen&&G.grid[V.secret.y])G.grid[V.secret.y][V.secret.x]=0;
  if(typeof pswApplyHidden==='function')pswApplyHidden(n);
  if(!F['seen'+n]){F['seen'+n]=1;msg(n===9750?'The service wing. Copper pans hang cold from the beams, and somewhere a cleaver is being sharpened.':'The east wing. It is very quiet. Somewhere a single voice is humming, and stops.','#cfd0e8')}}
/* the doors: stair doors that need the Second Floor Key, the hidden door to the sacristy */
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psw){
    if(d.psw==='secret'){const F=pswF();if(F.sacristyOpen){if(G.grid[ny][nx]!==0)G.grid[ny][nx]=0;return true}sfx('bump');msg('Plain cold wall. Nothing else.','#a8a8b8');return true}
    if(d.psw==='lock'){
      const F=pswF(),lk=d.link;F.stairBumped=1;
      if(!bagCount('pskey2')){sfx('locked');msg('An iron-bound double door with a great silver lock, chained and padlocked. It will not move. The key is not on this floor. Look below.','#c8d0e8');try{pspClue(1)}catch(e){}return true}
      const lv=pspLevel(lk.to);
      if(lv&&lv.built){sfx('door');goToLevel(lk.to,{x:lk.land[0],y:lk.land[1],f:lk.land[2]});return true}
      sfx('door');msg('The Second Floor Key turns in the silver lock. The door opens on a dark stair, but the way up is sealed by a fall of pale stone. The upper floors of the Pale Spire are not open yet.','#cfd8f0');return true}
    if(d.psw==='dungeon'){sfx('door');goToLevel(d.lvl,d.at);return true}
    return true}
  return _k.apply(this,arguments)}}
/* an opened hidden door stays open: applied on load of the level and every frame until the grid exists */
{const _u=update;update=function(dt){try{if(pswIs(LEVEL)&&G.state==='play'){const F=G.flags.psp,L=LEVELS[LEVEL],V=L&&L._psw;
    if(F&&G.pswOpenLv!==LEVEL&&G.grid&&G.grid.length){G.pswOpenLv=LEVEL;if(V&&V.secret&&F.sacristyOpen&&G.grid[V.secret.y])G.grid[V.secret.y][V.secret.x]=0}
    if(V&&V.rests)pswRestWatch(V);if(V&&V.ghosts)pswGhostTick(V)}}catch(e){console.error('psw update',e)}return _u.apply(this,arguments)}}
/* ghosts: drift along their loops, chill and gutter the candles when near, cold spots */
function pswGhostTick(V){
  const t=G.time||0,P=G.P;if(!P||!G.decor)return;
  if(PSW._gv!==LEVEL||!PSW._gd){PSW._gv=LEVEL;PSW._gd=G.decor.filter(d=>d.npc&&/^psw_gh/.test(d.npc));PSW._cold=new Set();PSW._gseen={}}
  const gl=[];
  for(const d of PSW._gd){const g=V.ghostById[d.npc];if(!g||d.hidden)continue;
    const L=g.len;let a=((t*g.sp+g.ph*L)%L+L)%L,i=0;while(i<g.seg.length-1&&a>g.seg[i]){a-=g.seg[i];i++}
    const p0=g.pts[i],p1=g.pts[(i+1)%g.pts.length],u=g.seg[i]?a/g.seg[i]:0,wx=p0[0]+(p1[0]-p0[0])*u+.5,wy=p0[1]+(p1[1]-p0[1])*u+.5;
    d.x=Math.floor(wx);d.y=Math.floor(wy);d.ox=wx-(d.x+.5);d.oy=wy-(d.y+.5);gl.push([wx,wy,d])}
  for(const q of gl){if(Math.hypot(q[0]-P.x-.5,q[1]-P.y-.5)<3.2){const k=q[2].npc;if((!PSW._gseen[k]||t-PSW._gseen[k]>45)&&t-(PSW._lastCold||-99)>20){PSW._gseen[k]=t;PSW._lastCold=t;try{msg('The air goes cold. The candle flames lean away and gutter.','#bfe0f0');sfx('rattle')}catch(e){}}}}
  for(const l of LIGHTS){if(l.kI===undefined)continue;if(l._k0===undefined)l._k0=l.kI;let f=1;for(const q of gl){const dd=Math.hypot(q[0]-l.x,q[1]-l.y);if(dd<4)f=Math.min(f,.35+.65*(dd/4)*Math.abs(Math.sin(t*19+(l.ph||0)*7)))}l.kI=l._k0*f}
  V.cold.forEach((c,i)=>{if(!PSW._cold.has(i)&&Math.hypot(c.x-P.x,c.y-P.y)<c.r){PSW._cold.add(i);try{msg(c.t,'#bfe0f0');sfx('rattle')}catch(e){}}})}
/* rest rooms: a calm line on walking in; (the bed does the resting) */
function pswRestWatch(V){
  const P=G.P,k=LEVEL;let inn=null;for(const r of V.rests)if(P.x>=r.x0&&P.x<=r.x1&&P.y>=r.y0&&P.y<=r.y1)inn=r;
  if(inn&&PSW._in!==inn.name){PSW._in=inn.name;msg(inn.line,'#f0c890')}else if(!inn)PSW._in=null}
/* lights: lamps take the colour of the place; the wall torches have their own colours (silver, violet, and warm in the rest rooms) */
{const _sl=setupLights;setupLights=function(){
  const r=_sl.apply(this,arguments);
  try{if(pswIs(LEVEL)){const L=LEVELS[LEVEL],V=L&&L._psw;if(V){
      for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=V.lcol[key]||V.col;l.kI=1.45;l.range2=170;l.calm=true}
      gyFlames();
      for(const [x,y,f,nar,fl,col] of V.torches){const d=GYM_D[f],O=nar?.035:TORCH_OUT;
        LIGHTS.push({x:x+.5+d[0]*(.5+O),y:y+.5+d[1]*(.5+O),ph:hash2(x,y,5)*6.28,key:(y*MW+x)*4+f,taken:false,red:false,fl,col,o:O,nar:!!nar,range2:150,kI:1.25})}}}}catch(e){console.error('psw lights',e)}
  return r}}
{const _w=weatherNow;weatherNow=function(){if(pswIs(LEVEL))return null;return _w.apply(this,arguments)}}
if(typeof WIND_AMT!=='undefined'){WIND_AMT[9750]=.02;WIND_AMT[9760]=.02}
if(typeof mpmgiKind==='function'){const _k=mpmgiKind;mpmgiKind=function(lv){return pswIs(lv)?'dungeon':_k.apply(this,arguments)}}
/* chests of the wings hold potions, mana, gear and gold */
if(typeof CONTAINERS!=='undefined')for(const k of ['wm_chest','gy_chest','psw_coffer','psw_chest','ps_chest','ps_coffer'])if(!CONTAINERS.includes(k))CONTAINERS.push(k);
{const _lf=lootFor;lootFor=function(d){
  if(pswIs(LEVEL)&&d&&(d.k==='wm_chest'||d.k==='gy_chest'||d.k==='psw_chest'||d.k==='psw_coffer'||d.k==='ps_chest'||d.k==='ps_coffer')){
    const r=q=>hash2(d.x,d.y,700+q+LEVEL),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
    for(let q=0;q<3;q++)add(potionFor(r(10+q)),1);add('supermana',2);if(r(2)<.6)add('elixir',1);
    for(let q=0;q<1;q++){const a=typeof armourDrop==='function'?armourDrop(r(20+q)):null;if(a)add(a)}
    if(typeof ringFor==='function'&&r(3)<.5)add(ringFor(r(4),101));
    d.gold=(d.goldAmt||0)||3800+Math.floor(r(5)*3000);return items}
  return _lf.apply(this,arguments)}}
/* ---------- floors and walls (made in code): black weathered stone, verdigris trim, dark green moss ---------- */
const PSW_STY={ash:{p:'ashlar',pg:2.3,tex:'texBlack',g:1.2,rgb:[.8,.9,1.0],v:[0,0,0,3,3,4,4,1,2,4]},blk:{p:'brick_dark',pg:2.5,tex:'texBlack',g:1.2,rgb:[.85,.95,1.1],v:[0,1,2,3,4]},dark:{p:'ashlar',pg:1.8,tex:'texBlack',g:.9,rgb:[.78,.88,1.0],v:[1,1,2,2,4,0,3]},
  warm:{p:'brick_dark',pg:3.0,prgb:[1.3,1.0,.78],tex:'texBone',g:1.28,rgb:[1.12,1.0,.86],v:[0,1,2,3,4,5]},moss:{p:'ashlar_moss',pg:2.5,tex:'texBlack',g:1.05,rgb:[.64,.96,.8],v:[0,1,3,4,2]},verd:{p:'ivy_wall',pg:2.0,tex:'texBone',g:.62,rgb:[.68,.92,1.05],v:[0,1,2,3,4,5]}};
function pswFloors(){
  if(PSW._fl)return PSW._fl;gyFloors();
  const mk=(nm,fn)=>{if(FLOORS[nm])return nm;const N=128,d=new Uint8ClampedArray(N*N*4);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=(y*N+x)*4,c=fn(x,y);d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255}FLOORS[nm]=d;return nm};
  const hh=(a,b,c)=>hash2(a,b,c);
  const flag=gyFloorTone('pswf_flag','gyf_flag',.8,[.8,.9,1.02]),dark=gyFloorTone('pswf_dark','gyf_flag',.5,[.72,.82,.98]);
  const cheq=mk('pswf_cheq',(x,y)=>{const w=((x>>6)+(y>>6))&1,v=hh(x>>1,y>>1,31)*18+hh(x>>3,y>>3,32)*12,e=Math.min(x&63,y&63,63-(x&63),63-(y&63));let b=w?[44,52,66]:[10,12,17];if(e<1.5)b=w?[24,30,40]:[3,4,7];return [b[0]+v,b[1]+v,b[2]+v*.9]});
  const carp=mk('pswf_carpet',(x,y)=>{const v=hh(x>>1,y>>1,41)*12,dm=Math.abs((x%32)-16)+Math.abs((y%32)-16),mark=dm<4?1:0,b=dm<8?[36,40,54]:[24,28,40];const e=Math.min(x&31,y&31);return [b[0]+v+mark*110,b[1]+v+mark*80,b[2]+v+mark*20+(e<1?8:0)]});
  const lawn=gyFloorTone('pswf_lawn','gyf_grass',.5,[.62,.9,.72]);
  const cob=gyFloorTone('pswf_cob','gyf_cobble',.55,[.74,.86,1.0]),wet=gyFloorWet('pswf_wetcob',cob,[.4,.5,.7],5);
  const warm=gyFloorTone('pswf_warm','wood'in FLOORS?'wood':'gyf_flag',1.0,[1.1,.95,.8]);
  PSW._fl=[flag,dark,cheq,carp,warm,lawn,wet];
  if(!CEILS.pswc){const im=IMG.gyp_texBlack_2||IMG.gyp_texGrey_3;if(im&&typeof dsPaintedTex==='function'){const b=dsPaintedTex(im),d=new Uint8ClampedArray(b.length);for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,b[i]*.75);d[i+1]=Math.min(255,b[i+1]*.85);d[i+2]=Math.min(255,b[i+2]*1.0);d[i+3]=255}CEILS.pswc=d}}
  return PSW._fl}
/* ---------- the maker ----------
   A level is a list of rooms: pswR(x0,y0,x1,y1,wallStyle,floor,height): an open rectangle (inclusive), its floor number (0 flag 1 dark 2 black and green marble 3 carpet 4 warm wood 5 lawn 6 wet cobble) and its floor height (0 to 1.2;
   steps between neighbours must be .55 or less). spec.solid = [x0,y0,x1,y1,style] makes pillars and partitions inside rooms. spec.hg = [x0,y0,x1,y1,h] sets heights (stairs, platforms). */
const PSW_SPEC={};
const pswR=(x0,y0,x1,y1,sty,flo,h)=>({x0,y0,x1,y1,sty:sty||'ash',flo:flo||0,h:h||0});
function pswMake(id){
  if(LEVELS[id])return LEVELS[id];
  const S=PSW_SPEC[id];if(!S)throw new Error('psw: no plan for '+id);
  gyAlias();pswFoePics();pswPeople();const FL=pswFloors();
  const W=S.W,H=S.H,WH=S.wh||3.4,hs=(a,b,c)=>hash2(a,b,c+id),g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const hh=new Float32Array(W*H),fm=[];for(let y=0;y<H;y++)fm.push(new Array(W).fill('0'));
  for(const r of S.rects)for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++){g[y][x]='.';fm[y][x]=String(r.flo);hh[y*W+x]=r.h}
  const sty=[];for(let y=0;y<H;y++)sty.push(new Array(W).fill(null));
  for(const r of S.rects)for(let y=r.y0-1;y<=r.y1+1;y++)for(let x=r.x0-1;x<=r.x1+1;x++)if(g[y]&&g[y][x]==='#'&&!sty[y][x])sty[y][x]=r.sty;
  for(const s of S.solid||[])for(let y=s[1];y<=s[3];y++)for(let x=s[0];x<=s[2];x++){g[y][x]='#';sty[y][x]=s[4]||'blk';hh[y*W+x]=0}
  for(const s of S.hg||[])for(let y=s[1];y<=s[3];y++)for(let x=s[0];x<=s[2];x++)if(g[y][x]==='.')hh[y*W+x]=s[4];
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chars[c]=gid;chMap.set(gid,c)}return c};
  const open=(x,y)=>g[y]&&g[y][x]==='.';
  const tiles={};const tileFor=(st,v)=>{const s=PSW_STY[st]||PSW_STY.ash,k=st+v;if(tiles[k]===undefined){const pt=s.p?pspTex(s.p,null):null;tiles[k]=ch(pt?gyTile(pt,WH,{gain:s.pg,rgb:s.prgb||[.82,.95,1.0],tag:'pw'+st+v}):gyTile(s.tex+'_'+v,WH,{gain:s.g,rgb:s.rgb}))}return tiles[k]};
  const inner=ch(gyTile('texBlack_3',WH,{gain:.5,rgb:[.7,.9,.8]}));
  const rows=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){
    if(g[y][x]==='.'){s+='.';continue}
    const st=sty[y][x];if(!st){s+=inner;continue}
    const sp=PSW_STY[st]||PSW_STY.ash;s+=tileFor(st,sp.v[(hs(x,y,5)*sp.v.length)|0])}rows.push(s)}
  const put=(x,y,c)=>{rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
  const decor=[],enemies=[],items=[],lights=[],lcol={},occ=new Set(),miss=[],V={lcol,col:S.lcol||[.55,.95,1.2],miss,id,rests:S.rests||[]},reserved=new Set(),doorSq=[];
  let start=null;
  const D4=[[0,-1],[1,0],[0,1],[-1,0]];
  for(const D of S.doors){
    const dx=D.x,dy=D.y,inn=D4.map(([a,b])=>[dx+a,dy+b]).find(([x,y])=>open(x,y));
    if(!inn)throw new Error('psw '+id+': door at '+dx+','+dy+' has no floor beside it');
    if(D.kind!=='secret'&&!D.link)throw new Error('psw '+id+': door at '+dx+','+dy+' has no link in the contract');
    const st=sty[dy][dx]||'ash',sp=PSW_STY[st]||PSW_STY.ash,brick=sp.tex;let gid;
    const fcol=(inn[1]>dy?2:inn[1]<dy?0:inn[0]>dx?1:3);
    if(D.kind==='link'){
      const lk=D.link;gid=gyTile(brick+'_0',WH,{fac:{img:D.img||'gatesC_1',i:0,n:1},gain:sp.g*.8,rgb:sp.rgb,tag:'pswl'+id+dx+'_'+dy,emit:.3});
      KH_DOOR[gid]={lvl:lk.to,at:{x:lk.land[0],y:lk.land[1],f:lk.land[2]}}}
    else if(D.kind==='lock'){
      const lk=D.link;gid=pspStairDoorTile(brick+'_0',WH,sp.g*.9,[.8,.95,1.1],'w'+id);
      KH_DOOR[gid]={psw:'lock',link:lk}}
    else if(D.kind==='dungeon'){
      const lk=D.link;gid=gyTile(brick+'_0',WH,{fac:{img:'f_dungeongate',i:0,n:1,fit:1},gain:1.0,rgb:[.85,.95,1.05],tag:'pswd'+id,emit:.35});
      KH_DOOR[gid]={psw:'dungeon',lvl:lk.to,at:{x:lk.land[0],y:lk.land[1],f:lk.land[2]}}}
    else if(D.kind==='secret'){
      gid=gyTile(brick+'_'+(D.v===undefined?2:D.v),WH,{gain:sp.g,rgb:[sp.rgb[0],sp.rgb[1],sp.rgb[2]+.00031],tag:'pswsecret'});
      KH_DOOR[gid]={psw:'secret'};V.secret={x:dx,y:dy}}
    put(dx,dy,ch(gid));doorSq.push([dx,dy,inn[0],inn[1]]);reserved.add(inn[0]+','+inn[1]);occ.add(inn[0]+','+inn[1]);
    if(D.start)start={x:inn[0],y:inn[1],f:fcol===2?0:fcol===0?2:fcol===1?3:1}}
  if(S.start)start=S.start;
  /* ---- the kit for a dress function ---- */
  const free=(x,y)=>open(x,y)&&!occ.has(x+','+y);
  const dec=(key,x,y,o)=>{o=o||{};if(!key){miss.push('nokey@'+x+','+y);return null}if(!open(x,y)){miss.push(key+'@'+x+','+y);return null}
    const d={k:key,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}d.sc=o.sc||1;if(o.npc){d.npc=o.npc;d.deco=false;if(o.block)d.solid=1}
    if(o.i!==undefined)d.i=o.i;if(o.wd){d.wd=o.wd;d.pic=1}if(o.txt)d.txt=o.txt;if(o.goldAmt)d.goldAmt=o.goldAmt;if(o.ox!==undefined){d.ox=o.ox;d.oy=o.oy}if(o.bob!==undefined)d.bob=o.bob;if(o.lift!==undefined)d.lift=o.lift;
    if(o.text)d.text=o.text;decor.push(d);if(!o.walkOk&&!o.wd)occ.add(x+','+y);return d};
  const p=(name,x,y,o)=>{const k=pswPic(name);if(o===undefined)o={block:true};else if(o.block===undefined)o=Object.assign({block:!(o.wd||o.walkOk||!Object.keys(o).length)},o);return k?dec(k,x,y,o):(miss.push('nopic:'+name+'@'+x+','+y),null)};
  const sign=(x,y,wd,a,b)=>{if(!open(x,y)){miss.push('sign@'+x+','+y);return}decor.push({k:'sign_gy',x,y,block:false,wd,txt:[a,b||''],sc:1})};
  const foe=(t,x,y)=>{if(!open(x,y)||(occ.has(x+','+y)&&!reserved.has(x+','+y))){miss.push('foe '+t+'@'+x+','+y);return false}enemies.push({t,x,y,lvl:(id===9750&&!(ENEMY_DEF[t]&&ENEMY_DEF[t].boss))?S.diff-1:S.diff});occ.add(x+','+y);return true};
  const light=(x,y,col)=>{if(!open(x,y)){miss.push('light@'+x+','+y);return}lights.push([x,y]);if(col)lcol[x+','+y]=col};
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open(x,y))fm[y][x]=f};
  const fill=(x0,y0,x1,y1,fn)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)fn(x,y)};
  /* wall dressing: a thing hung on the wall beside floor cell x,y (wd = the way to the wall). Does not block. */
  let garN=0;   // wall gargoyles sit on a visible painted corbel, low enough to be seen from the floor, and only the best 16 of a level are kept
  const w=(name,x,y,wd,o)=>{if(name==='c_psgargoyle'){if(garN>=16||hs(x,y,17)>=.5)return null;const d=p(name,x,y,Object.assign({wd,bob:1.55},o||{}));if(d){garN++;const cn=['corbel_gargoyle_a','corbel_gargoyle_b','corbel_gargoyle_c'][(x*7+y*3)%3],ck=pspPic(cn);if(ck)dec(ck,x,y,{wd,bob:.88})}return d}return p(name,x,y,Object.assign({wd},o||{}))};
  /* an ambient ghost drifting slowly along a closed loop of open squares (a decor that the update hook moves), and a cold spot (a message when the party walks in) */
  const ghosts=[];V.ghosts=ghosts;V.ghostById={};V.cold=[];
  const GL={servant:'"Is it dinner? It is always almost dinner."',cook:'"The pot must not boil dry. Who is watching the pot?"',baker:'"The loaves are proving. Mind the draught."',armourer:'"Every blade back on its rack. Every one. I counted."',choir:'The voice is very far away, and very sad, and it does not stop.',monk:'"Silence. Please. Some of us are praying."',scholar:'"Shh. Overdue. Everything is overdue."',maid:'"Is the bed made? I made the bed."'};
  const ghost=(name,pts,o)=>{o=o||{};const k=pswPic(name);if(!k){miss.push('noghost:'+name);return null}
    if(!pts.every(q=>open(q[0],q[1]))){miss.push('ghostloop:'+name+'@'+pts[0]);return null}
    const gid='psw_gh'+id+'_'+ghosts.length,kind=name.replace('ghost_','');
    khNpc(gid,'A ghost',k,()=>say(o.line||GL[kind]||'The ghost does not answer.',[BYE]));
    const d=dec(k,pts[0][0],pts[0][1],{npc:gid,walkOk:1,lift:.12,sc:o.sc||1});if(!d)return null;
    const seg=pts.map((q,i)=>{const r=pts[(i+1)%pts.length];return Math.hypot(r[0]-q[0],r[1]-q[1])}),len=seg.reduce((a,b)=>a+b,0);
    if(!len)return d;const g={pts,seg,len,sp:o.sp||.3,ph:o.ph===undefined?hs(pts[0][0],pts[0][1],3):o.ph};ghosts.push(g);V.ghostById[gid]=g;return d};
  const cold=(x,y,r,t)=>V.cold.push({x,y,r:r||2,t:t||'A cold spot. Your breath shows, and something brushes past you that is not there.'});
  const C={id,S,W,H,g,rows,open,free,dec,p,w,sign,foe,light,setF,fill,decor,enemies,lights,lcol,occ,V,items,reserved,hs,hh,ghost,cold};
  S.dress(C);
  /* the long-abandoned house: sheets, webs, mirrors, ancestors, candles, red lanterns (shared dresser in ps_halls.js) */
  try{const taken=new Set();for(const d of decor)if(d.wd)taken.add(d.x+','+d.y+','+d.wd[0]+','+d.wd[1]);let mi=0;
    pshHaunt({W,H,seed:id,pi:id%5,open,start:[start.x,start.y],blocked:()=>decor.filter(d=>d.block).map(d=>d.x+','+d.y),free:(x,y)=>free(x,y)&&!reserved.has(x+','+y),wall:(x,y,a,b)=>!open(x+a,y+b)&&!doorSq.some(q=>q[0]===x+a&&q[1]===y+b)&&rows[y+b]!==undefined&&rows[y+b][x+a]!=='.',taken:(x,y,a,b)=>taken.has(x+','+y+','+a+','+b),
      counts:S.haunt||{mirror:5,portrait:8,sheetwin:5,cobcorner:14,cobthick:6,candles:8,redlamp:6,dust:6,spider:3},
      wallPic:(k,x,y,wd,o)=>{const oo={wd,bob:o.bob};if(o.mirror!==undefined)oo.npc='psh_mir'+((mi++)%12);const d=dec(k,x,y,oo);if(d)taken.add(x+','+y+','+wd[0]+','+wd[1]);return !!d},
      floorProp:(k,x,y,o)=>!!dec(k,x,y,{block:!!o.block,sc:o.sc,walkOk:!o.block}),light:(x,y,c)=>light(x,y,c)})}catch(e){console.error('psw haunt',e)}
  /* ---- wall torches: sickly green-white and verdigris in the cold rooms, orange in the warm ones ---- */
  const torches=[],warmAt=(x,y)=>(S.warm||[]).some(r=>x>=r[0]-1&&x<=r[2]+1&&y>=r[1]-1&&y<=r[3]+1);
  {const blk=new Set();for(const d of decor)if(d.block)blk.add(d.x+','+d.y);const cand=[];
   for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(open(x,y)||rows[y][x]==='.'||doorSq.some(q=>Math.hypot(q[0]-x,q[1]-y)<2.2))continue;
     for(let f=0;f<4;f++){const nx=x+GYM_D[f][0],ny=y+GYM_D[f][1];if(!open(nx,ny)||blk.has(nx+','+ny))continue;
       const d4=GYM_D.filter(([a,b])=>open(nx+a,ny+b)).length,nar=(!open(nx-1,ny)&&!open(nx+1,ny))||(!open(nx,ny-1)&&!open(nx,ny+1));
       cand.push({x,y,f,nar,pri:d4>=3?1:d4===2?2:3,h:hs(x,y,f*7)})}}
   cand.sort((a,b)=>a.pri-b.pri||a.h-b.h);
   for(const c of cand){const gp=c.nar?3.6:3.2;if(torches.some(t=>Math.hypot(t[0]-c.x,t[1]-c.y)<gp))continue;
     const nx=c.x+GYM_D[c.f][0],ny=c.y+GYM_D[c.f][1],wm=warmAt(nx,ny),r=hs(c.x,c.y,9);
     torches.push([c.x,c.y,c.f,c.nar?1:0,wm?0:(r<.4?2:3),wm?[1.4,.92,.45]:(r<.4?[.3,.85,1.1]:[.55,.95,1.2])])}}
  V.torches=torches;
  /* ---- a lamp every few squares where none is near ---- */
  {const have=lights.slice();for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!open(x,y))continue;if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=(S.lampGap||4.6))){have.push([x,y]);lights.push([x,y]);lcol[x+','+y]=warmAt(x,y)?[1.45,1.0,.5]:V.col}}}
  const fmS=fm.map(r=>r.join(''));
  const L={rows,chars,fmap:fmS,floorSet:FL.slice(),floor:FL[0],floor2:FL[1],ceil:(S.ceil&&CEILS[S.ceil])?S.ceil:(CEILS.pswc?'pswc':'gyc_1'),ceilH:WH,start,enemies,items,decor,lights,portals:[],day:0,amb:S.amb===undefined?.16:S.amb,torchGap:1e9,noTele:true,noExtras:true,
    name:PSW.NAMES[id],label:PSW.NAMES[id],diff:S.diff,mapNames:S.names||[],_psw:V};
  /* heights: floors that rise (stairs, platforms, galleries). Walls stand on 0 and are as tall as the roof, so a raised floor still has a ceiling above it. */
  {let any=false,bad=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(hh[i])any=true;if(open(x,y)){if(open(x+1,y)&&Math.abs(hh[i+1]-hh[i])>.55)bad++;if(open(x,y+1)&&Math.abs(hh[i+W]-hh[i])>.55)bad++}}
   if(any)L.terrace={h:hh,roof:WH};if(bad)miss.push('steps too high: '+bad)}
  V.start=start;
  LEVELS[id]=L;LEVEL_NAMES[id]=PSW.NAMES[id];LEVEL_RATING[id]=S.diff;
  if(miss.length)console.warn('psw '+id+' missed: '+miss.join(' '));
  return L}
for(const id of PSW.ids){const fn=()=>pswMake(id);if(typeof pspRegister==='function')try{pspRegister(id,fn,{})}catch(e){KH_LAZY[id]=fn}else KH_LAZY[id]=fn}
/* the self-check used by the tests: breadth first search from a square, with the hidden door and locked stairs counted as open when thru is set */
function pswReach(id,from,thru){
  const L=LEVELS[id]||(KH_LAZY[id]&&(KH_LAZY[id](),LEVELS[id])),W=L.rows[0].length,H=L.rows.length,bs=new Set();
  for(const d of L.decor)if(d.block||(d.npc&&d.solid))bs.add(d.x+','+d.y);
  const gate=(x,y)=>{if(!thru)return false;const c=L.rows[y][x],d=c!=='.'&&KH_DOOR[L.chars[c]];return !!(d&&d.psw==='secret')};
  const st=from||L.start,seen=new Set([st.x+','+st.y]),q=[[st.x,st.y]];
  for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of GYM_D){const nx=x+a,ny=y+b,k=nx+','+ny;if(seen.has(k)||nx<0||ny<0||nx>=W||ny>=H||(L.rows[ny][nx]!=='.'&&!gate(nx,ny))||bs.has(k))continue;seen.add(k);q.push([nx,ny])}}
  const un=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(L.rows[y][x]==='.'&&!seen.has(x+','+y)&&!bs.has(x+','+y))un.push([x,y]);
  return {seen,unreached:un}}
/* ===== 9750 THE GROUND FLOOR, KITCHENS AND ARMOURY (the west wing): a vaulted warren, 48 x 40 ===== */
const pswLk=(id,x,y)=>pspLinkAt(id,x,y);
const pswCold=[.78,.94,1.1],pswVerd=[.3,.9,1.05],pswSick=[1.0,.95,.7],pswFire=[1.5,.85,.4],pswWarm=[1.5,1.05,.55];
{const r=pswR;
PSW_SPEC[9750]={W:48,H:40,diff:101,wh:3.4,lcol:pswCold,
  rects:[
    r(3,4,9,10,'blk',1),r(10,7,10,7,'blk',1),r(11,4,15,10,'dark',1),r(16,7,16,7,'dark',1),r(17,4,22,10,'blk',0),r(23,8,23,8,'blk',0),r(24,4,29,9,'dark',1),r(30,6,30,6,'dark',1),r(31,4,38,10,'verd',0),r(39,8,39,8,'verd',0),
    r(3,12,39,12,'verd',6),r(6,11,6,11,'verd',6),r(13,11,13,11,'verd',6),r(20,11,20,11,'verd',6),r(27,10,27,11,'verd',6),r(35,11,35,11,'verd',6),
    r(9,13,9,13,'verd',6),r(18,13,18,13,'verd',6),r(28,13,28,13,'verd',6),r(33,13,33,13,'verd',6),
    r(5,13,5,13,'dark',0),r(13,13,13,13,'dark',0),r(23,13,23,13,'blk',0),
    r(3,14,8,19,'dark',0),r(5,20,5,20,'dark',0),r(3,21,8,26,'moss',6),r(9,23,9,23,'moss',6),
    r(10,14,16,18,'dark',0),r(17,16,17,16,'dark',0),r(10,20,16,26,'moss',6),r(17,23,17,23,'moss',6),
    r(18,14,29,25,'blk',1),r(23,26,23,27,'blk',1),
    r(30,16,32,17,'moss',5),r(33,16,33,17,'blk',1),r(34,14,38,18,'dark',3,1.0),r(30,23,30,23,'blk',1),r(31,21,38,26,'blk',4),r(35,27,35,27,'blk',4),
    r(5,27,5,27,'moss',6),r(13,27,13,27,'moss',6),
    r(3,28,39,28,'verd',6),r(9,29,9,29,'verd',6),r(16,29,16,29,'verd',6),r(24,29,24,29,'verd',6),r(33,29,33,29,'verd',6),r(18,27,18,27,'verd',6),r(27,27,27,27,'verd',6),
    r(6,29,6,31,'moss',5),r(3,32,8,36,'warm',4,1.0),
    r(20,29,20,29,'blk',2),r(16,30,24,35,'blk',2),r(12,29,12,29,'dark',1),r(10,30,14,36,'dark',1),r(15,33,15,33,'dark',1),r(25,33,25,33,'dark',1),
    r(29,29,29,29,'dark',1),r(26,30,32,36,'dark',1),r(33,33,33,33,'dark',1),r(36,29,36,29,'verd',6),r(34,30,38,36,'verd',6),r(39,34,39,34,'verd',6),
    r(40,4,44,13,'blk',1),r(40,14,41,19,'blk',1),r(40,20,44,25,'blk',1),r(40,26,41,30,'blk',1),r(40,31,44,37,'blk',1)],
  solid:[[21,18,21,18,'blk'],[26,18,26,18,'blk'],[21,22,21,22,'blk'],[26,22,26,22,'blk'],[18,32,18,32,'blk'],[22,32,22,32,'blk'],[18,34,18,34,'blk'],[22,34,22,34,'blk'],[3,4,3,4,'blk'],[9,4,9,4,'blk'],[3,10,3,10,'blk'],[9,10,9,10,'blk']],
  hg:[[11,4,15,5,.5],[11,6,15,6,.25],[30,16,30,17,.25],[31,16,31,17,.5],[32,16,32,17,.75],[33,16,33,17,1.0],[6,29,6,29,.25],[6,30,6,30,.5],[6,31,6,31,.75],[20,14,27,15,.3]],
  warm:[[3,32,8,36]],
  rests:[{name:'loft',x0:3,y0:29,x1:8,y1:36,line:"The Maids' Loft, up a stair above the scullery. Candles burn warm here, the first warm light in the Pale Spire. Nothing in this room means any harm."}],
  doors:[{x:45,y:22,kind:'link',link:pswLk(9750,45,22),start:1},{x:45,y:12,kind:'link',link:pswLk(9750,45,12)},{x:6,y:3,kind:'lock',link:pswLk(9750,6,3)},{x:20,y:36,kind:'dungeon',link:pswLk(9750,20,36)}],
  start:{x:42,y:22,f:3},
  names:[{t:'West Turret',x:6,y:7,k:'place'},{t:'The Forge',x:13,y:6,k:'place'},{t:'The Armoury',x:20,y:7,k:'place'},{t:'The Guardroom',x:26,y:7,k:'place'},{t:'The Bakehouse',x:35,y:7,k:'place'},{t:'Service Lane',x:20,y:12,k:'place'},{t:'The Larder',x:5,y:17,k:'place'},{t:'The Scullery',x:5,y:24,k:'place'},{t:'The Pantry',x:13,y:16,k:'place'},{t:'The Still-room',x:13,y:23,k:'place'},{t:'The Great Kitchen',x:23,y:17,k:'place'},{t:"The Steward's Office",x:36,y:16,k:'place'},{t:"The Servants' Hall",x:34,y:24,k:'place'},{t:'Lower Lane',x:20,y:28,k:'place'},{t:"The Maids' Loft",x:6,y:34,k:'place'},{t:'The Undercroft Stair',x:20,y:32,k:'place'},{t:'The Coal Cellar',x:12,y:33,k:'place'},{t:'The Buttery',x:29,y:33,k:'place'},{t:'The Salting Room',x:36,y:33,k:'place'},{t:'The Service Gallery',x:42,y:8,k:'place'},{t:'The Chute Court',x:42,y:34,k:'place'}],
  dress(C){const {dec,p,w,sign,foe,light,ghost,cold}=C;
    const cyc=(a,i)=>a[i%a.length];
    const wall=(nm,xs,y,wd)=>xs.forEach(x=>w(nm,x,y,wd));
    // ---- the West Turret: a round stair room, black stone, a spiral going up ----
    sign(5,4,[0,-1],'THE WEST TURRET','Stair to the second floor');
    p('suit',3,5);p('suit',9,5);p('stairs_curved',6,9,{sc:1.1});p('cl_monk',3,9);p('candelabra',9,9);
    w('c_psgargoyle',4,4,[0,-1]);w('c_psgargoyle',8,4,[0,-1]);w('banner_long_a',3,7,[-1,0]);w('ivy',9,8,[1,0]);w('window_slit',5,10,[0,1]);w('alcove_weeper',7,10,[0,1]);
    light(6,8,pswVerd);light(4,6,pswCold);foe('psarmour',8,8);
    // ---- the Forge bay: a raised hearth with steps, anvil, coals ----
    sign(12,4,[0,-1],'THE FORGE','Mind the coals');
    p('hearth',13,4,{sc:1.2});p('tools',12,4,{sc:1.2});p('brazier',14,4);p('barrels',11,4);p('bucket',15,6,{});p('armoury_rack',11,9);p('armoury_rack',15,9);p('sword_rack',11,10);p('suit',15,10);p('crate',14,9);
    w('banner_long_a',12,10,[0,1]);w('c_psgargoyle',14,10,[0,1]);w('vine_b',11,8,[-1,0]);wall('lantern_bracket',[12,14],4,[0,-1]);
    light(13,6,pswFire);light(13,9,pswCold);foe('psarmourer',13,8);p('coffer',15,4);
    // ---- the Armoury: racks, Dawnwarden, the Armourer ----
    sign(19,4,[0,-1],'THE ARMOURY','Weapons are returned to the rack');
    p('sword_rack',17,4);p('armoury_rack',18,4);p('sword_rack',21,4,{npc:'psw_dawnrack'});p('sword_rack',22,4,{npc:'psw_hilt1'});
    p('armoury_rack',19,7);p('armoury_rack',20,7);p('suit',17,10);p('suit',22,10);p('suit',17,5);p('brazier',22,5);p('table',18,9);
    w('banner_long_b',22,6,[1,0]);w('ivy',17,6,[-1,0]);w('c_psgargoyle',19,10,[0,1]);w('c_psgargoyle',21,10,[0,1]);w('window_slit',20,4,[0,-1]);
    {const kp=KH_KEEPERS.psw_armourer;if(kp)dec(pswPic('ghost_librarian'),19,6,{npc:'psw_armourer',block:false,walkOk:1})}
    foe('psarmour',21,9);foe('psarmour',18,8);light(20,6,pswCold);light(18,9,pswVerd);
    // ---- the Guardroom ----
    sign(26,4,[0,-1],'THE GUARDROOM','Keep your hands where they can be seen');
    p('table',26,6);p('table',27,6);p('stool',25,7,{});p('cage',29,4);p('sword_rack',24,4,{npc:'psw_hilt3'});p('suit',29,9);p('barrels',24,9);p('lamp',29,8);
    w('banner_long_a',29,5,[1,0]);w('c_psgargoyle',27,4,[0,-1]);w('alcove_knight',24,6,[-1,0]);w('iron_fence_a',28,9,[0,1]);
    foe('psarmour',25,5);foe('psarmourer',28,8);light(26,8,pswSick);
    // ---- the Bakehouse ----
    sign(34,4,[0,-1],'THE BAKEHOUSE','Bread for the household');
    [32,34,36,38].forEach(x=>p('oven',x,4));p('table',33,7);p('table',34,7);p('table',36,7);p('table',37,7);p('sacks',31,10);p('sacks',38,10);p('barrels',31,9);p('butcher_block',38,6);p('pans_hanging',35,6,{walkOk:1});
    [[33,5],[35,5],[37,5],[32,9],[34,9],[37,9]].forEach(([x,y],i)=>pswLoaf(C,i+1,x,y));
    {const k=pswPic('ghost_chamberlain');dec(k,35,8,{npc:'psw_baker1',walkOk:1});dec(k,33,8,{npc:'psw_baker2',walkOk:1})}
    w('window_slit',38,7,[1,0]);w('vine_a',31,8,[-1,0]);w('c_psgargoyle',32,10,[0,1]);w('lantern_bracket',36,10,[0,1]);
    foe('psbakeghost',32,7);foe('psbakeghost',36,9);foe('pskrat',38,9);light(34,6,pswCold);light(35,9,pswVerd);
    [[9,12,[0,-1]],[24,12,[0,-1]],[34,12,[0,-1]],[11,28,[0,1]],[25,28,[0,1]],[31,28,[0,1]],[20,25,[0,1]],[26,25,[0,1]],[24,34,[1,0]],[41,18,[1,0]]].forEach(([x,y,d])=>w('c_psgargoyle',x,y,d));
    // ---- Service Lane (the upper lane): a vaulted passage with arches, lanterns, statues in niches ----
    p('arch_low',11,12,{block:false});p('arch_ivy',25,12,{block:false});p('arch_low',37,12,{block:false});
    p('alcove_weeper',9,13);p('alcove_monk',18,13);p('alcove_knight',28,13);p('alcove_maiden',33,13);
    [4,8,15,22,30].forEach((x,i)=>w(cyc(['vine_a','vine_b'],i),x,12,[0,-1]));[7,17,26,35].forEach(x=>w('lantern_bracket',x,12,[0,1]));
    w('c_psgargoyle',16,12,[0,-1]);w('c_psgargoyle',31,12,[0,-1]);foe('pskrat',15,12);foe('pskrat',33,12);
    // ---- the Larder ----
    sign(7,14,[0,-1],'THE LARDER','Cold store');
    [[3,15],[3,17],[8,15],[8,17]].forEach(([x,y])=>p('cabinet',x,y));p('barrels',3,18);p('barrels',8,18);p('table',6,17);p('table',7,17);p('crate',6,14);p('pans_hanging',6,15,{walkOk:1});p('bones',7,19,{});
    w('window_slit',3,16,[-1,0]);w('vine_b',8,16,[1,0]);foe('pskrat',4,17);foe('pskrat',7,18);light(5,16,pswCold);
    // ---- the Scullery ----
    sign(6,21,[0,-1],'THE SCULLERY','Wash your hands');
    p('cauldron_big',4,24,{sc:1.1});p('barrels',3,22);p('barrels',8,25);p('bucket',3,26,{});p('tools',7,22);p('pot',7,24);p('pans_hanging',6,22,{walkOk:1});p('sacks',3,25);p('sack',7,26,{});
    w('vine_a',8,22,[1,0]);w('alcove_empty',3,24,[-1,0]);w('c_psgargoyle',6,26,[0,1]);foe('pskrat',7,25);foe('pskrat',4,22);light(6,24,pswVerd);
    // ---- the Pantry ----
    sign(12,14,[0,-1],'THE PANTRY','Dry goods');
    [10,11,12,14,15,16].forEach((x,i)=>p(i%2?'cabinet':'cabinet',x,14));p('sacks',10,18);p('sacks',16,18);p('jar',12,17,{});p('jar',14,17,{});p('table',12,16);p('table',13,16);
    w('vine_b',10,16,[-1,0]);w('lantern_bracket',13,18,[0,1]);foe('pskrat',11,17);foe('psbakeghost',15,18);light(13,17,pswCold);
    // ---- the Still-room with the well ----
    sign(12,20,[0,-1],'THE STILL-ROOM','Milk and small beer');
    p('well_pale',13,23,{sc:1.2,npc:'psw_well'});p('cabinet',10,21);p('cabinet',10,25);p('barrels',16,21);p('barrels',16,25);p('urn_big',11,22);p('keg',14,25);p('stool',12,24,{});
    p('arch_low',11,23,{block:false});w('vine_a',16,22,[1,0]);w('alcove_maiden',12,26,[0,1]);foe('pskrat',11,25);foe('pskrat',15,21);light(13,21,pswVerd);light(13,25,pswCold);
    // ---- the Great Kitchen: a vault with a huge hearth on a dais ----
    sign(24,14,[0,-1],'THE GREAT KITCHEN','The fires are lit and nobody is cooking');
    [19,20,21,25,26,27].forEach((x,i)=>p(i%3===1?'spit_hearth':'hearth',x,14,{sc:i%3===1?1.3:1.1}));p('cauldron_big',20,15,{sc:1.1});p('cauldron_big',26,15,{sc:1.1});
    [[19,19],[20,19],[24,19],[25,19],[19,21],[20,21],[27,21],[28,21],[19,24],[20,24],[26,24],[27,24]].forEach(([x,y],i)=>p(cyc(['butcher_block','table'],i),x,y));
    p('barrels',19,16);p('barrels',28,15);p('sacks',28,24);p('sacks',18,24);p('keg',28,18);p('stool',22,21,{});p('stool',24,22,{});
    p('pans_hanging',22,16,{walkOk:1});p('pans_hanging',24,17,{walkOk:1});p('chandelier',23,18,{walkOk:1,bob:.6});w('banner_long_a',18,18,[-1,0]);w('banner_long_b',29,15,[1,0]);w('clock_face',22,25,[0,1]);
    w('c_psgargoyle',22,14,[0,-1]);w('c_psgargoyle',24,14,[0,-1]);wall('window_slit',[19,21,27],14,[0,-1]);w('vine_b',18,18,[-1,0]);w('vine_a',29,19,[1,0]);w('alcove_empty',18,21,[-1,0]);w('window_great',29,22,[1,0]);
    pswLadle(C,22,15);pswHilt(C,2,18,22);
    foe('psteward',23,20);foe('pscook',19,22);foe('pscook',28,19);foe('pscook',22,24);foe('pskrat',28,22);foe('psbakeghost',19,17);foe('psbakeghost',28,16);
    light(22,16,pswCold);light(24,16,pswCold);light(23,19,pswVerd);light(19,23,pswCold);light(28,23,pswCold);
    // ---- the stair corridor up to the Steward's gallery ----
    w('lantern_bracket',32,16,[0,-1]);w('vine_b',31,17,[0,1]);w('c_psgargoyle',33,17,[0,1]);w('iron_fence_a',31,16,[0,-1]);
    // ---- the Steward's Office, up a stair, looking down on the kitchen ----
    sign(36,14,[0,-1],"THE STEWARD'S OFFICE",'Ledgers and keys');
    p('furn_desk',37,15,{npc:'psw_ledger'});p('furn_chair_high',37,16,{});p('furn_wardrobe',35,14,{npc:'psw_keyshelf'});p('furn_sideboard',38,14);p('globe',34,14);p('furn_clock_grandfather',34,18);p('furn_fireplace_tall',38,17);p('rug',36,17,{walkOk:1});p('candle',38,18);
    pswBook(C,1,35,17);w('window_great',38,16,[1,0]);w('tapestry',36,18,[0,1]);w('c_psgargoyle',34,15,[-1,0]);light(36,16,pswSick);
    // ---- the Servants' Hall ----
    sign(34,21,[0,-1],"THE SERVANTS' HALL",'Meals at the bell');
    [33,34,36,37].forEach(x=>{p('table',x,25);p('stool',x,26,{})});p('furn_fireplace_tall',34,22);p('furn_sideboard',35,22);p('furn_chair_high',32,22,{});p('pot',31,26);p('barrels',38,22);
    {const k=pswPic('ghost_chamberlain'),k2=pswPic('ghost_librarian');dec(k,32,24,{npc:'psw_servant1',walkOk:1});dec(k2,36,23,{npc:'psw_servant2',walkOk:1});dec(k,38,25,{npc:'psw_servant3',walkOk:1})}
    pswBook(C,2,32,22);w('tapestry',38,24,[1,0]);w('c_psgargoyle',31,21,[0,-1]);w('alcove_maiden',31,25,[-1,0]);w('vine_b',33,26,[0,1]);foe('psbakeghost',37,22);light(34,24,pswCold);p('coffer',38,26);
    // ---- Lower Lane ----
    p('arch_ivy',10,28,{block:false});p('arch_low',26,28,{block:false});p('arch_ivy',38,28,{block:false});
    p('alcove_knight',9,29);p('alcove_weeper',16,29);p('alcove_monk',24,29);p('alcove_maiden',33,29);p('alcove_empty',18,27);p('alcove_weeper',27,27);
    [4,14,21,30,36].forEach((x,i)=>w(cyc(['vine_b','vine_a'],i),x===36?37:x,28,[0,1]));[7,19,32].forEach(x=>w('lantern_bracket',x,28,[0,-1]));
    w('c_psgargoyle',13,28,[0,1]);w('c_psgargoyle',28,28,[0,1]);foe('pskrat',14,28);foe('pskrat',30,28);
    // ---- the Maids' Loft (REST ROOM, warm, up a stair) ----
    sign(7,32,[0,-1],"THE MAIDS' LOFT",'Rest here');
    [[3,33],[3,35],[8,33],[8,35]].forEach(([x,y],i)=>p('bed',x,y,{npc:i===0?'psw_bed':undefined}));
    p('chest',8,36);p('cabinet',5,36);p('candle',5,33);p('candle',7,35);p('table',6,33);p('vase',7,36,{});p('rug',6,35,{walkOk:1});p('sack',4,34,{});p('chair',7,33,{});
    {const kp=KH_KEEPERS.psw_dorcas;if(kp)dec(kp.face,6,34,{npc:'psw_dorcas',walkOk:1,sc:kp.sc||1})}
    w('window_stained_tall',8,34,[1,0]);w('vine_a',3,34,[-1,0]);w('tapestry',5,32,[0,-1]);
    for(const [x,y] of [[5,34],[7,34],[6,31]])light(x,y,pswWarm);
    // ---- the Undercroft stair hall: the dungeon door ----
    sign(18,35,[0,1],'THE UNDERCROFT','Keys with the Steward');sign(22,35,[0,1],'NO FOOD BELOW','Nothing goes down to be eaten');
    p('brazier',17,30);p('brazier',23,30);p('suit',17,35);p('suit',23,35);p('barrels',24,35);p('grill',17,32,{walkOk:1});p('cl_knight',24,32);
    w('banner_long_b',18,30,[0,-1]);w('c_psgargoyle',19,30,[0,-1]);w('c_psgargoyle',21,30,[0,-1]);w('alcove_knight',16,31,[-1,0]);w('arch_stair',20,35,[0,1]);
    foe('psarmour',23,33);foe('psarmour',17,34);light(20,31,pswVerd);light(17,33,pswCold);light(23,34,pswCold);
    // ---- the Coal Cellar ----
    sign(11,30,[0,-1],'THE COAL CELLAR','Keep the door shut');
    p('sacks',10,31);p('sacks',10,32);p('sacks',14,31);p('barrels',14,36);p('crate',10,36);p('cl_smith',10,34);p('bucket',13,35,{});p('bones',11,35,{});
    w('c_psgargoyle',12,36,[0,1]);w('vine_a',14,34,[1,0]);foe('pskrat',11,33);foe('pskrat',12,35);light(12,33,pswCold);
    // ---- the Buttery (wine) ----
    sign(30,30,[0,-1],'THE BUTTERY','Wine and small beer');
    [31,32,34,35].forEach(y=>{p('cask',27,y);p('barrels',31,y)});p('table',29,35);p('jar',28,36,{});p('keg',32,36);p('cl_maiden',26,36);
    w('c_psgargoyle',29,36,[0,1]);w('vine_b',26,32,[-1,0]);foe('pskrat',28,35);foe('pskrat',30,31);light(29,32,pswVerd);light(29,34,pswCold);
    // ---- the Salting Room ----
    sign(37,30,[0,-1],'THE SALTING ROOM','Hams and herring');
    p('grill',35,31,{walkOk:1});p('grill',37,32,{walkOk:1});p('barrels',34,36);p('barrels',38,36);p('butcher_block',35,35);p('butcher_block',37,35);p('cl_monk',38,31);p('keg',34,31);
    w('vine_a',36,36,[0,1]);w('c_psgargoyle',34,34,[-1,0]);foe('pskrat',36,34);foe('pskrat',35,33);light(36,33,pswVerd);
    // ---- the Service Gallery (the east spine) ----
    sign(44,11,[1,0],'TO THE GREAT HALLS','Through the Screens Passage');sign(44,4,[0,-1],'GARDEROBE','');p('bucket',44,5,{});
    dec('gy_column',43,5,{block:true,sc:1.2});dec('gy_column',43,8,{block:true,sc:1.2});dec('gy_column',43,9,{block:true,sc:1.2});p('alcove_empty',41,6);p('alcove_knight',41,9);p('barrels',44,9);
    w('c_psgargoyle',42,4,[0,-1]);w('iron_fence_a',44,7,[1,0]);w('vine_a',40,5,[-1,0]);w('lantern_bracket',40,10,[-1,0]);
    foe('pskrat',41,5);light(42,8,pswCold);
    w('c_psgargoyle',40,16,[-1,0]);w('vine_b',41,15,[1,0]);p('cl_angel',41,17);light(40,15,pswVerd);
    sign(44,21,[1,0],'THE KITCHEN DOOR','Out to the Court of Statues');dec('gy_column',43,20,{block:true,sc:1.2});dec('gy_column',43,24,{block:true,sc:1.2});p('barrels',44,24);p('barrels',44,25);p('lamp',44,20);
    w('vine_a',40,22,[-1,0]);w('c_psgargoyle',42,20,[0,-1]);w('window_great',40,24,[-1,0]);light(42,24,pswCold);foe('psarmour',41,25);
    p('cl_knight',41,28);w('vine_b',40,27,[-1,0]);w('lantern_bracket',41,26,[1,0]);
    p('barrels',40,31);p('barrels',40,32);p('cl_knight',42,34);p('chest',44,36);p('crate',44,31);w('c_psgargoyle',43,31,[0,-1]);w('vine_a',44,34,[1,0]);foe('psarmour',42,36);foe('pskrat',41,33);light(42,33,pswVerd);
    // ---- the household that never left: ghosts drift through the kitchens, a few wraiths watch ----
    ghost('ghost_baker',[[32,8],[37,8],[37,9],[32,9]],{sp:.25});ghost('ghost_servant',[[33,5],[36,5],[36,6],[33,6]],{sp:.2,ph:.4});
    ghost('ghost_cook',[[22,20],[24,20],[24,22],[22,22]],{sp:.3});ghost('ghost_servant',[[20,17],[27,17],[27,20],[20,20]],{sp:.28,ph:.5});ghost('ghost_maid',[[20,24],[27,25],[24,25]],{sp:.25});
    ghost('ghost_servant',[[32,23],[37,23]],{sp:.2});ghost('ghost_cook',[[11,24],[15,24],[15,22],[11,22]],{sp:.22});
    ghost('ghost_armourer',[[19,8],[21,8],[21,9],[19,9]],{sp:.25});ghost('ghost_armourer',[[12,8],[14,8]],{sp:.2,ph:.5});ghost('ghost_monk',[[25,8],[28,8],[28,7],[25,7]],{sp:.2});
    ghost('ghost_servant',[[5,12],[35,12]],{sp:.35});ghost('ghost_maid',[[35,28],[5,28]],{sp:.3});ghost('ghost_servant',[[41,5],[42,12]],{sp:.22});ghost('ghost_cook',[[18,31],[22,31]],{sp:.2});
    cold(33,8,2);cold(23,18,2.5);cold(36,23,2);cold(20,8,2);cold(15,12,2);cold(20,33,2.5);cold(42,10,2);cold(13,24,2);
    foe('psbookwraith',23,16);foe('psbookwraith',20,5);foe('psbookwraith',37,10);
}};
/* ===== 9760 THE GROUND FLOOR, CLOISTER, CHAPEL AND LIBRARY (the east wing): 48 x 40 ===== */
PSW_SPEC[9760]={W:48,H:40,diff:101,ceil:'tex_vault_ribbed',wh:3.4,lcol:pswCold,
  rects:[
    r(3,9,6,16,'blk',3),r(4,17,5,18,'blk',3,.3),r(3,19,6,27,'blk',3),r(4,28,5,29,'blk',3,.3),r(3,30,6,37,'blk',3),
    r(7,10,8,10,'dark',1),r(7,22,8,22,'verd',0),r(7,34,8,34,'dark',1),
    r(9,4,24,14,'dark',1),r(15,15,15,16,'verd',0),r(25,6,28,6,'dark',1),
    r(9,17,21,19,'verd',0),r(9,27,21,29,'verd',0),r(9,20,11,26,'verd',0),r(19,20,21,26,'verd',0),r(12,20,18,26,'moss',5,.25),
    r(15,30,15,31,'verd',0),r(9,32,21,36,'dark',1),r(22,34,28,34,'dark',1),
    r(22,22,27,22,'verd',0),r(24,21,24,21,'verd',0),r(25,23,25,23,'verd',0),
    r(28,18,38,26,'blk',2),r(39,18,44,26,'blk',2),r(28,10,36,16,'blk',3),
    r(29,4,37,8,'verd',0),r(38,6,38,6,'verd',0),r(39,4,44,8,'blk',1),r(42,9,42,9,'blk',1),r(39,10,44,16,'warm',4),r(41,17,41,17,'warm',4),
    r(41,27,41,28,'blk',1),r(39,29,44,36,'dark',1),r(38,33,38,33,'dark',1),r(29,29,37,36,'dark',1)],
  solid:[[39,18,39,20,'verd'],[39,24,39,26,'verd'],[11,33,11,33,'blk'],[14,33,14,33,'blk'],[17,33,17,33,'blk'],[20,33,20,33,'blk'],[12,35,12,35,'blk'],[15,35,15,35,'blk'],[18,35,18,35,'blk'],
    [32,6,32,6,'blk'],[34,6,34,6,'blk'],[29,29,29,29,'blk'],[37,29,37,29,'blk'],[29,36,29,36,'blk'],[37,36,37,36,'blk'],[3,17,3,18,'blk'],[6,17,6,18,'blk'],[3,28,3,29,'blk'],[6,28,6,29,'blk']],
  hg:[[9,5,24,5,.5],[9,4,24,4,1.0],[42,19,42,25,.25],[43,19,43,25,.5],[44,19,44,25,.5],[31,31,35,34,.5],[39,31,44,31,.25],[39,32,44,33,.5],[39,34,44,34,.25]],
  warm:[[39,10,44,16]],
  rests:[{name:'almonry',x0:39,y0:10,x1:44,y1:16,line:"The Almonry, a pilgrim's cell. Candles burn warm here, and the room is still and kind."}],
  doors:[{x:2,y:22,kind:'link',link:pswLk(9760,2,22),start:1},{x:2,y:12,kind:'link',link:pswLk(9760,2,12)},{x:42,y:3,kind:'lock',link:pswLk(9760,42,3)},{x:35,y:17,kind:'secret'}],
  start:{x:5,y:22,f:1},
  names:[{t:"The Pilgrims' Hall",x:4,y:13,k:'place'},{t:'The Library',x:16,y:9,k:'place'},{t:'The Cloister',x:15,y:18,k:'place'},{t:'The Garth',x:15,y:23,k:'place'},{t:'The Ossuary',x:15,y:34,k:'place'},{t:'The Chapter House',x:33,y:5,k:'place'},{t:'East Turret',x:41,y:6,k:'place'},{t:'The Almonry',x:41,y:13,k:'place'},{t:'The Sacristy',x:32,y:13,k:'place'},{t:'The Chapel',x:33,y:22,k:'place'},{t:'The Chancel',x:41,y:22,k:'place'},{t:'The Bell Room',x:33,y:33,k:'place'},{t:'The Clock Room',x:42,y:33,k:'place'},{t:'The Dormitory',x:4,y:33,k:'place'}],
  dress(C){const {dec,p,w,sign,foe,light,ghost,cold}=C;
    const cyc=(a,i)=>a[i%a.length];const stat=pswStat;
    const wall=(nm,xs,y,wd)=>xs.forEach(x=>w(nm,x,y,wd));
    // ---- the Pilgrims' Hall: three narrow chambers one above the other, with low arches between them ----
    sign(4,9,[0,-1],"THE PILGRIMS' HALL",'Quiet, please');
    p('alcove_monk',6,9);p('bench_moss',6,14);p('bench_moss',3,15);p('lamp',3,9);p('st_saint1',3,11);w('c_psgargoyle',5,9,[0,-1]);w('ivy',3,13,[-1,0]);w('banner_long_a',6,15,[1,0]);w('vine_a',3,16,[-1,0]);
    p('arch_ivy',5,17,{block:false});p('arch_low',5,18,{block:false});foe('psmonk',4,15);light(5,14,pswCold);light(4,10,pswVerd);
    sign(3,21,[-1,0],'THE CLOISTER DOOR','Out to the Court of Statues');sign(3,19,[0,-1],'TO THE LIBRARY AND THE CHAPEL','Through the cloister');
    p('alcove_weeper',6,19);p('bench_moss',3,25);p('st_saint2',6,25);p('lamp',3,19);w('vine_b',3,23,[-1,0]);w('c_psgargoyle',3,27,[0,1]);foe('psmonk',5,26);foe('psmonk',4,24);light(5,25,pswCold);
    p('arch_low',5,28,{block:false});p('arch_ivy',5,29,{block:false});
    [[3,31],[3,33],[3,35],[6,31],[6,36]].forEach(([x,y])=>p('bed',x,y));p('chest',3,37);p('candle',6,33);p('cl_girl',6,35);w('window_slit',3,34,[-1,0]);w('vine_a',6,32,[1,0]);w('c_psgargoyle',4,37,[0,1]);
    sign(3,30,[0,-1],'THE DORMITORY','Pilgrims sleep here');foe('psmonk',5,35);light(4,34,pswVerd);
    // ---- the Library: tall stacks, a gallery up two steps, ladders ----
    sign(17,4,[0,-1],'THE LIBRARY','Books must be returned');
    [11,14,17,20,23].forEach(x=>{const gap=(x===14||x===20);for(let y=6;y<=12;y++){if(gap&&y===9)continue;p('furn_bookcase',x,y)}});
    for(let x=10;x<=23;x+=2)w(cyc(['bookcase_tall','bookcase_wm'],x),x,4,[0,-1]);
    p('stairs_moss',13,7,{sc:.8});p('stairs_moss',19,10,{sc:.8});
    [[10,13],[12,13],[17,13],[20,13],[22,13]].forEach(([x,y])=>p('furn_desk',x,y));[10,12,17,20,22].forEach(x=>p('chair',x,14,{}));
    p('furn_lectern_black',13,13,{npc:'psw_lectern'});p('globe',18,14);p('scroll_rack',21,14);p('furn_candelabra_black',22,12);p('furn_candelabra_black',9,13);
    {const kp=KH_KEEPERS.psw_librarian;if(kp)dec(pswPic('ghost_librarian'),16,13,{npc:'psw_librarian',walkOk:1})}
    p('furn_desk',13,11,{npc:'psw_habit'});
    w('c_psgargoyle',9,4,[0,-1]);w('c_psgargoyle',24,4,[0,-1]);w('alcove_weeper',9,8,[-1,0]);w('alcove_knight',9,12,[-1,0]);w('window_great',24,8,[1,0]);w('window_great',24,12,[1,0]);w('vine_a',9,11,[-1,0]);w('banner_long_a',9,6,[-1,0]);w('banner_long_b',24,8,[1,0]);
    p('iron_rail',12,4,{block:false});p('iron_rail',16,4,{block:false});p('iron_rail',21,4,{block:false});
    foe('psbookwraith',13,9);foe('psbookwraith',19,8);foe('psbookwraith',22,11);foe('psbookwraith',16,11);foe('psink',18,13);foe('psink',15,6);
    for(const [x,y] of [[12,7],[18,7],[21,11],[16,12],[12,12],[10,9]])light(x,y,cyc([pswCold,pswVerd],x+y));
    w('lantern_bracket',25,6,[0,-1]);
    // ---- the Cloister: an arcade round a tiny garth with a well ----
    sign(14,17,[0,-1],'THE CLOISTER WALK','Walk in silence');
    [21,23,25].forEach(y=>dec('gy_column',11,y,{block:true,sc:1.1}));[21,23,25].forEach(y=>dec('gy_column',19,y,{block:true,sc:1.1}));[13,15,17].forEach(x=>{dec('gy_column',x,19,{block:true,sc:1.1});dec('gy_column',x,27,{block:true,sc:1.1})});
    w('alcove_monk',9,20,[-1,0]);w('alcove_weeper',9,24,[-1,0]);w('alcove_knight',11,17,[0,-1]);w('alcove_maiden',19,17,[0,-1]);w('alcove_weeper',11,29,[0,1]);w('alcove_knight',19,29,[0,1]);
    w('vine_a',10,17,[0,-1]);w('vine_b',14,17,[0,-1]);w('vine_a',18,17,[0,-1]);w('vine_b',13,29,[0,1]);w('vine_a',17,29,[0,1]);w('vine_b',21,24,[1,0]);w('c_psgargoyle',9,17,[0,-1]);w('c_psgargoyle',21,17,[0,-1]);w('c_psgargoyle',9,29,[0,1]);w('c_psgargoyle',21,29,[0,1]);
    p('bench_moss',9,26);pswBook(C,3,10,26);p('bench_moss',21,21);p('bench_moss',10,18);
    p('well',15,23,{sc:1.15,npc:'psw_well2'});dec('gy_yew',12,20,{block:true,sc:.8});dec('gy_yew',18,20,{block:true,sc:.8});dec('gy_yew',12,26,{block:true,sc:.8});dec('gy_yew',18,26,{block:true,sc:.8});
    p('shrub',13,21);p('shrub',17,21);p('shrub',13,25);p('cl_angel',17,23);p('pond',17,25,{});p('lilies',16,26,{walkOk:1});p('flowers',14,21,{walkOk:1});p('flowers2',16,21,{walkOk:1});p('fern',14,25,{walkOk:1});p('rose',13,23,{walkOk:1});p('flowers3',12,24,{walkOk:1});
    foe('psmonk',10,19);foe('psmonk',20,28);foe('psmonk',20,20);if(ENEMY_DEF.psmarblehound){foe('psmarblehound',16,28);foe('psmarblehound',10,22)}
    for(const [x,y] of [[10,19],[20,19],[10,27],[20,27],[15,24],[14,18],[16,28]])light(x,y,cyc([pswCold,pswVerd],x));
    // passage to the chapel
    p('cl_monk',24,21);p('cl_maiden',25,23);w('vine_a',23,22,[0,-1]);w('lantern_bracket',26,22,[0,1]);p('arch_low',26,22,{block:false});
    // ---- the Ossuary Walk: skull niches and creepy statues ----
    sign(14,32,[0,-1],'THE OSSUARY','The dead are kept here');
    [10,13,16,19,21].forEach((x,i)=>w(cyc(['alcove_weeper','alcove_empty','alcove_knight','alcove_monk','alcove_maiden'],i),x,36,[0,1]));[10,12,16,18,20].forEach((x,i)=>w(cyc(['alcove_empty','alcove_weeper','alcove_monk'],i),x,32,[0,-1]));
    p('bones',10,34,{});p('bones',13,34,{});p('bones',19,34,{});p('cl_knight',21,32);p('cl_angel',9,36);p('cl_monk',16,33);w('c_psgargoyle',9,35,[-1,0]);w('vine_b',21,35,[1,0]);p('arch_low',22,34,{block:false});
    foe('psmonk',13,32);foe('psmonk',18,36);light(12,34,pswVerd);light(18,34,pswCold);light(15,36,pswVerd);
    [[13,17,[0,-1]],[17,17,[0,-1]],[16,29,[0,1]],[11,36,[0,1]],[14,36,[0,1]],[17,36,[0,1]],[20,36,[0,1]],[9,9,[-1,0]],[24,10,[1,0]],[30,26,[0,1]],[34,26,[0,1]],[6,12,[1,0]],[6,24,[1,0]],[29,33,[-1,0]],[44,36,[1,0]],[31,8,[0,1]],[35,8,[0,1]]].forEach(([x,y,d])=>w('c_psgargoyle',x,y,d));
    // ---- the Chapter House ----
    sign(30,4,[0,-1],'THE CHAPTER HOUSE','Where the chapter sat');
    p('furn_lectern_black',33,6,{npc:'psw_chapterbook'});[30,36].forEach(x=>{p('furn_pew_black',x,8);p('furn_pew_black',x+1,8)});p('tomb',30,5,{sc:.9});p('furn_candelabra_black',31,4);p('furn_candelabra_black',36,4);p(stat(),37,8);
    w('window_stained_tall',33,4,[0,-1]);w('window_stained_tall',35,4,[0,-1]);w('banner_long_a',30,8,[0,1]);w('banner_long_b',36,8,[0,1]);w('c_psgargoyle',34,4,[0,-1]);w('vine_a',29,7,[-1,0]);w('alcove_monk',29,8,[0,1]);w('c_psgargoyle',33,8,[0,1]);
    {const kp=KH_KEEPERS.psw_chaplain;if(kp)dec(pswPic('ghost_chamberlain'),33,7,{npc:'psw_chaplain',walkOk:1})}
    pswBook(C,5,36,7);foe('psmonk',31,7);foe('psmonk',36,5);foe('psmonk',33,5);light(33,5,pswCold);light(30,7,pswVerd);light(36,7,pswVerd);
    // ---- the East Turret ----
    sign(40,4,[0,-1],'THE EAST TURRET','Stair to the second floor');
    p('suit',39,4);p('suit',44,4);p('stairs_curved',44,7,{sc:1.1});p('furn_candelabra_black',39,8);p('cl_monk',44,8);
    w('c_psgargoyle',41,4,[0,-1]);w('c_psgargoyle',43,4,[0,-1]);w('banner_long_b',39,7,[-1,0]);w('ivy',44,6,[1,0]);w('window_slit',40,8,[0,1]);foe('psarmour',40,7);light(41,7,pswVerd);light(43,5,pswCold);
    // ---- the Almonry (REST ROOM, warm) ----
    sign(41,10,[0,-1],'THE ALMONRY','A bed for pilgrims');
    p('furn_bed_canopy',39,12,{npc:'psw_bed2'});p('furn_bed_canopy',39,14);p('furn_bed_canopy',44,12);p('furn_cradle',40,11);p('chest',44,16);p('candle',40,15);p('rug',42,13,{walkOk:1});p('furn_chair_high',43,14,{});p('furn_sideboard',43,11);p('furn_wardrobe',44,14);
    w('window_stained_tall',44,13,[1,0]);w('vine_a',39,16,[-1,0]);w('tapestry',40,16,[0,1]);
    for(const [x,y] of [[41,12],[43,15],[40,14]])light(x,y,pswWarm);
    // ---- the Sacristy ----
    sign(30,10,[0,-1],'THE SACRISTY','Vestments and the sacred vessels');
    [29,31,33,35].forEach((x,i)=>p(cyc(['furn_wardrobe','furn_sideboard'],i),x,10));w('tapestry',28,13,[-1,0]);w('tapestry',36,13,[1,0]);p('furn_candelabra_black',33,16);p('furn_candelabra_black',28,16);p('table',35,12);w('mirror',32,10,[0,-1]);p('chair',36,15,{});
    dec(pswPic('reliquary_chest'),32,13,{block:true,npc:'psw_reliquary',sc:1.15});p(stat(),36,12);p(stat(),28,12);w('c_psgargoyle',30,10,[0,-1]);w('alcove_empty',28,15,[-1,0]);w('vine_b',36,14,[1,0]);
    foe('pssacristan',33,14);for(const [x,y] of [[32,12],[30,15],[35,14],[29,11]])light(x,y,cyc([pswVerd,pswCold],x));
    // ---- the Chapel: nave, stalls, six candles, the odd bracket ----
    sign(31,18,[0,-1],'THE CHAPEL','Please do not light the candles out of order');
    [30,31,33,34,36,37].forEach(x=>{p('furn_pew_black',x,20);p('furn_pew_black',x,24)});pswBook(C,4,32,20);
    [[29,26],[29,18],[33,18],[33,26],[37,18],[37,26]].forEach(([x,y],i)=>p('furn_candelabra_black',x,y,{npc:'psw_cand'+(i+1)}));
    dec(pswPic('furn_candelabra_black'),28,20,{block:true,npc:'psw_bracket',sc:1.0});p('font',28,23,{npc:'psw_font'});p('plaque',28,24,{npc:'psw_candleplaque'});
    [[30,21],[34,21],[31,23],[36,23],[41,20],[41,24],[40,19],[40,25]].forEach(([x,y])=>foe('pschorister',x,y));
    wall('window_stained_tall',[30,33,37],18,[0,-1]);w('banner_long_a',32,26,[0,1]);w('banner_long_b',28,19,[-1,0]);w('banner_long_a',28,25,[-1,0]);wall('window_stained_tall',[31,35,38],26,[0,1]);w('c_psgargoyle',35,18,[0,-1]);w('c_psgargoyle',36,26,[0,1]);w('vine_a',28,19,[-1,0]);w('vine_b',28,25,[-1,0]);
    p('chandelier',31,22,{walkOk:1,bob:.6});p('chandelier',35,22,{walkOk:1,bob:.6});
    p('furn_altarpiece',44,22,{npc:'psw_altar',sc:1.1});p('furn_lectern_black',41,22,{npc:'psw_nave'});p('furn_organ',44,19);p('st_saint2',44,24);p('furn_pulpit',38,20);p('furn_screen_tracery',38,24);p('furn_clock_grandfather',28,26);w('alcove_knight',43,18,[0,-1]);w('alcove_maiden',43,26,[0,1]);p('furn_candelabra_black',42,20);p('furn_candelabra_black',42,24);
    w('window_great',44,21,[1,0]);w('window_great',44,23,[1,0]);w('c_psgargoyle',40,18,[0,-1]);w('c_psgargoyle',40,26,[0,1]);
    for(const [x,y] of [[31,19],[35,19],[31,25],[35,25],[38,22],[41,22],[43,22]])light(x,y,cyc([pswCold,pswVerd],x+y));
    // ---- the Bell Room: a great bell on a raised floor ----
    sign(31,29,[0,-1],'THE BELL ROOM','Do not ring');
    p('bell_big',33,32,{sc:1.6});p('bell_small',31,32,{block:false});p('bell_small',35,32,{block:false});p('bell_frame',33,34,{block:false});p('cl_angel',30,35);p('cl_monk',36,35);p('barrels',30,30);p('barrels',36,30);
    w('window_slit',29,32,[-1,0]);w('window_slit',37,32,[1,0]);w('clock_face',33,29,[0,-1]);w('banner_long_a',31,29,[0,-1]);w('banner_long_b',35,29,[0,-1]);w('c_psgargoyle',32,36,[0,1]);w('c_psgargoyle',35,36,[0,1]);w('vine_a',30,36,[0,1]);w('vine_b',29,35,[-1,0]);
    foe('psmonk',31,30);foe('psmonk',35,35);light(33,31,pswVerd);light(31,35,pswCold);light(35,30,pswCold);
    // ---- the Clock Room: gears, weights and a pendulum ----
    sign(42,29,[0,-1],'THE CLOCK ROOM','The clock stopped at midnight');
    p('clock',40,30,{sc:1.8});p('clock',43,30,{sc:1.4});p('chandelier',41,34,{walkOk:1,bob:.6});p('barrels',44,36);p('barrels',39,36);p('tools',44,32);p('cl_smith',39,35);
    w('clock_face',44,34,[1,0]);w('clock_face',42,29,[0,-1]);w('banner_long_a',40,29,[0,-1]);w('banner_long_b',44,30,[1,0]);w('c_psgargoyle',40,36,[0,1]);w('c_psgargoyle',43,36,[0,1]);w('vine_a',39,31,[-1,0]);w('lantern_bracket',44,31,[1,0]);foe('psarmour',43,35);foe('psink',41,31);
    light(41,33,pswSick);light(43,35,pswCold);light(40,30,pswVerd);
    // ---- a ghost choir, ghost scholars and the monks who never left; cold spots; wraiths ----
    ghost('ghost_choir',[[29,22],[38,22]],{sp:.22});ghost('ghost_choir',[[30,23],[36,23],[36,21],[30,21]],{sp:.18,ph:.3});ghost('ghost_choir',[[31,19],[36,19]],{sp:.15,ph:.7});
    ghost('ghost_choir',[[40,22],[41,19],[41,25]],{sp:.17});
    ghost('ghost_scholar',[[12,6],[12,12]],{sp:.25});ghost('ghost_scholar',[[19,6],[19,13]],{sp:.22,ph:.3});ghost('ghost_scholar',[[16,6],[16,12]],{sp:.2,ph:.6});
    ghost('ghost_monk',[[10,18],[20,18],[20,28],[10,28]],{sp:.28});ghost('ghost_monk',[[14,22],[16,22],[16,24],[14,24]],{sp:.2});ghost('ghost_monk',[[10,34],[20,34]],{sp:.2});ghost('ghost_monk',[[30,6],[36,6]],{sp:.18});
    ghost('ghost_maid',[[40,11],[43,11],[43,15],[40,15]],{sp:.12,line:'"A bed for pilgrims. Rest. You look tired, and I have time."'});ghost('ghost_monk',[[4,10],[4,15]],{sp:.2});ghost('ghost_monk',[[31,31],[35,31],[35,35],[31,35]],{sp:.15});
    cold(33,22,2.5);cold(15,12,2);cold(15,23,2.5);cold(14,34,2);cold(33,33,2);cold(5,14,2);cold(41,23,2);
    foe('psbookwraith',19,28);foe('psbookwraith',33,23);foe('psbookwraith',42,35);
}};
}
/* ---------- things lying about (pickups), people, key flow, quests ---------- */
PSW.pick={};                           // npc id -> flag name: taken things are hidden again on every arrival
function pswTake(id,name,flag,item,before,after,btn,msgText){
  PSW.pick[id]=flag;
  khNpc(id,name,'hl_p_note',d=>{const F=pswF();
    if(F[flag])return say(after,[BYE]);
    return say(before,[[btn,()=>{F[flag]=1;if(d){d.found=true;d.hidden=true;d.block=false}
      if(item&&!bagAdd(mkItem(item)))G.items.push({k:item,x:Math.round(G.P.x),y:Math.round(G.P.y),taken:false});
      sfx('key');msg(msgText,'#ffe36a');G.talk=null;return null}],BYE])})}
function pswApplyHidden(n){
  const F=pswF();if(!G.decor)return;
  for(const d of G.decor){const fl=PSW.pick[d.npc];if(fl&&F[fl]){d.found=true;d.hidden=true;d.block=false}}
  if(G.enemies){
    if(F.sacristanDead)G.enemies=G.enemies.filter(e=>e.t!=='pssacristan');
    if(F.stewardDead)G.enemies=G.enemies.filter(e=>e.t!=='psteward');
    if(F.candlesDone)G.enemies=G.enemies.filter(e=>e.t!=='pschorister')}}
const pswPickPic={loaf:'basket',hilt:'sword_rack',book:'bookmark',ladle:'tools'};
function pswItemDecor(C,key,x,y,o){const k=key==='book'?'gy_book':pswPic(pswPickPic[key]);return k?C.dec(k,x,y,o):null}
function pswLoaf(C,i,x,y){pswItemDecor(C,'loaf',x,y,{npc:'psw_loaf'+i,sc:.8,walkOk:1})}
function pswHilt(C,i,x,y){C.dec(IMG.icn_sword?'icn_sword':pswPic('tools'),x,y,{npc:'psw_hilt'+i,sc:1,walkOk:1})}
function pswBook(C,i,x,y){C.dec('gy_book',x,y,{npc:'psw_book'+i,sc:1.1,walkOk:1})}
function pswLadle(C,x,y){C.dec(pswPic('tools'),x,y,{npc:'psw_ladle',sc:.6,walkOk:1})}
for(let i=1;i<=6;i++)pswTake('psw_loaf'+i,'A cold loaf','loaf'+i,'psloaf','A round loaf of white bread, cold and perfect, lying where a baker left it. Nobody has eaten it in a long time.','You have already taken the loaf from here.','Take the loaf.','You take a Pale Loaf.');
for(let i=1;i<=3;i++)pswTake('psw_hilt'+i,'A sword hilt','hilt'+i,'pshilt',['A sword hilt with no blade, left among the weapons.','A sword hilt, hammered flat on one side and tossed in a corner.','A sword hilt lying half under a bench in the guardroom.'][i-1],'You have taken the hilt from here.','Take the hilt.','You take a sword hilt.');
for(let i=1;i<=5;i++)pswTake('psw_book'+i,'A strayed book','book'+i,'psbook'+i,['A book with a violet cloth cover, left on a desk. The stamp of the library is inside the front board.','A book with a violet cloth cover, pushed behind a bench. It has the library stamp.','A book with a violet cloth cover, forgotten on a stone bench in the cloister. It has the library stamp.','A book with a violet cloth cover, left on a pew. It has the library stamp.','A book with a violet cloth cover, left on the chapter house lectern. It has the library stamp.'][i-1],'You have taken the book from here.','Take the book.','You take a library book.');
pswTake('psw_ladle',"Peck's ladle",'ladle','psladle','A long iron ladle hangs on a nail by the great hearth, its handle worn pale and smooth. Cook Ansel Peck used it for thirty years. A name is scratched on the bowl: PECK.','The nail by the hearth is empty now.','Take the ladle.',"You take Peck's ladle.");
pswTake('psw_dawnrack','A weapon rack','dawn','psdawnwarden','On this rack hangs one sword that is brighter than the rest, with a plain hilt and a tag in a careful hand: STAMFORD. DAWNWARDEN. KEEP SAFE. It does not look as if anyone has touched it.','The rack is empty where the bright sword hung.','Take Dawnwarden.','You take Dawnwarden. It is very light for such a long blade.');
/* ---------- text: notes, books, plaques ---------- */
const PSW_LEDGER="The Steward's ledger lies open on the desk, in a neat dry hand. Most of the page is lists of bread, wine and candles delivered. At the bottom: 'Keys to the upper floors, sent below with the guard at dusk, to be kept where nobody climbs. The Sacristan has the receipt.'";
const PSW_KEYSHELF="A cabinet with forty small hooks, each with a brass tag: LARDER, CELLAR, ARMOURY, WINE, and so on. The hooks are empty, except one. The tag reads UNDERCROFT and the key is not for sale, but nobody is here to mind. The three hooks marked UPPER STAIRS are bare. Under them somebody has chalked one word: BELOW.";
const PSW_HABIT="A thin book in grey cloth, titled The Sacristan's Habit, written by a monk of the chapel. Most of it is about vestments and washing. One page is marked with a ribbon: 'Brother Aldous would not keep the upper keys in the chapel. He had them sent down with the guards to the oubliette, the pit at the bottom of the dungeons, where nobody would climb for them. He wrote it all in his journal and hid the journal where the candles are.'";
const PSW_PLAQUE="A brass plaque beside the font. The letters say: THE ORDER OF THE CANDLES. 'Start at the west end of the south wall. Then the west end of the north wall. Then the middle of the north wall. Then the middle of the south wall. Then the east end of the north wall. Last, the east end of the south wall. Light them in this order and the choir will rest. Light them out of order and every flame goes out.'";
khNpc('psw_ledger',"The Steward's ledger",'hl_p_note',()=>{try{pspClue(2)}catch(e){}return say(PSW_LEDGER,[BYE])});
khNpc('psw_keyshelf','A cabinet of key hooks','hl_p_note',()=>{try{pspClue(2)}catch(e){}return say(PSW_KEYSHELF,[BYE])});
khNpc('psw_habit',"A reading desk",'hl_p_lectern',()=>{pswF().habitRead=1;try{pspClue(3)}catch(e){}return say(PSW_HABIT,[BYE])});
khNpc('psw_candleplaque','A brass plaque','hl_p_note',()=>say(PSW_PLAQUE,[BYE]));
khNpc('psw_lectern','A great lectern','hl_p_lectern',()=>say('A great book lies open on the lectern, a catalogue of the library in tiny hand. Each line has a shelf mark. Many of the marks have been struck through and a note added: MISSING. A different, firmer hand has written across the foot of the page: THE LIBRARIAN WOULD LIKE THEM BACK.',[BYE]));
khNpc('psw_chapterbook','A lectern','hl_p_lectern',()=>say('The chapter book of the Pale Spire lies open at the last entry. It reads: "The Chapter met, as it always meets. The Sovereign did not attend. Nobody was surprised." The ink stops there.',[BYE]));
khNpc('psw_nave','A lectern in the nave','hl_p_lectern',()=>say('A lectern with a prayer book open on it. Every page is the same prayer, written out by hand again and again, for a very long time. It asks for the candles to be lit in the right order.',[BYE]));
khNpc('psw_well','A wellhouse','hl_p_note',()=>say('A little wellhouse with a pitched roof stands in the scullery, its bucket on a rope. The water far down is black and very cold. It does not seem to have been drawn for years.',[BYE]));
khNpc('psw_well2','The garth well','hl_p_note',()=>say('A stone well in the middle of the garth, with a lid of pale stone and a ring of ivy round the rim. A coin lies on the lid, a silver one, left for luck by somebody a long time ago.',[BYE]));
khNpc('psw_font','The font','mi_font',()=>{const F=pswF();
  if(F.fontTaken)return say('The font holds clear water, still and cold. A small dove is carved in the middle of the bowl. You have already taken some.',[BYE]);
  return say('The font is full of clear water, which is odd, because no rain reaches this room. A small dove is carved in the middle of the bowl.',[['Take a little water.',()=>{F.fontTaken=1;if(!bagAdd(mkItem('psfont')))G.items.push({k:'psfont',x:Math.round(G.P.x),y:Math.round(G.P.y),taken:false});sfx('heal');msg('You take a vial of font water.','#c8e0f0');G.talk=null;return null}],BYE])});
khNpc('psw_altar','The altar','mi_altar',()=>say('A plain stone altar with a white cloth, a cross and two candles that have never been lit. The cloth is clean. Something has been written in the dust on the step, and wiped away.',[BYE]));
khNpc('psw_bed',"A narrow bed",'hgtb_furn_bed',()=>say('A narrow bed with clean sheets, warm in the candlelight. Nothing in this room means any harm. Rest here?',[['Rest, free.',()=>{G.talk=null;restParty(true);return null}],BYE]));
khNpc('psw_bed2',"A pilgrim's bed",'hgtb_furn_bed',()=>say("A bed with a grey blanket, made up for any pilgrim who comes. A candle burns beside it. Rest here?",[['Rest, free.',()=>{G.talk=null;restParty(true);return null}],BYE]));
/* ---------- the key flow: the odd candle bracket, the sacristy, the reliquary ---------- */
khNpc('psw_bracket','A candle bracket','mi_candel',()=>{const F=pswF();
  if(F.sacristyOpen)return say('The bracket is turned. In the north wall, a door of stone has ground aside.',[BYE]);
  return say('A candle stand like the others in the chapel, with one difference: a faint ring of gold round the stem, polished by hands that have turned it many times. It looks as if it was made to be pulled.',[['Pull it.',()=>{
    F.sacristyOpen=1;const V=LEVELS[9760]._psw;if(V&&V.secret&&G.grid[V.secret.y])G.grid[V.secret.y][V.secret.x]=0;
    sfx('door');try{if(AC&&!G.mute){nz(1.8,.05,'lowpass',160,70,0);tone(50,42,1.8,'sine',.04,0)}}catch(e){}
    msg('You pull the candle stand. Somewhere in the north wall, stone grinds on stone, and a door that was a plain wall a moment ago swings open.','#e8e0ff');G.talk=null;return null}],BYE])});
khNpc('psw_reliquary',"The Sacristan's reliquary",'wm_chest',()=>{const F=pswF();
  if(F.journalTaken)return say('The reliquary chest stands open. On a grey cloth lies the print of a small book, and nothing else.',[BYE]);
  const alive=G.enemies&&G.enemies.some(e=>e.t==='pssacristan'&&e.hp>0);
  if(alive&&!F.sacristanDead)return say('A reliquary chest of pale wood with silver bands. The lid will not lift. Something that was a man stands guard over it, and he is watching you.',[BYE]);
  return say('The lid of the reliquary lifts. Inside, on a grey cloth, lies a small book bound in grey, and a purse of old gold. The book is the Sacristan\'s journal.',[['Take the journal and the gold.',()=>{
    F.journalTaken=1;G.gold=(G.gold||0)+6000;try{if(!bagAdd(mkItem('potion6')))G.items.push({k:'potion6',x:Math.round(G.P.x),y:Math.round(G.P.y),taken:false})}catch(e){}
    sfx('key');msg('You take the Sacristan\'s journal and 6,000 gold. The last entry reads: the upper keys were sent down with the guards to the oubliette, to be kept where nobody climbs.','#ffe36a');try{pspClue(3)}catch(e){}G.talk=null;return null}],BYE])});
/* ---------- candles (psq23) ---------- */
function pswCandle(i){
  khNpc('psw_cand'+i,'A chapel candle stand','mi_candel',()=>{const F=pswF();
    if(F.candlesDone)return say('The candle stand is lit, and the flame does not move. The whole chapel is quiet.',[BYE]);
    const n=F.candleN|0;
    if(i<=n)return say('This candle is already lit.',[BYE]);
    return say('An unlit candle on a tall iron stand. You can light it from your own torch.',[['Light it.',()=>{
      G.talk=null;
      if(i===n+1){F.candleN=i;sfx('door');
        if(i===6){F.candlesDone=1;pswChoirRest();msg('The sixth flame takes. The singing stops. The choir stands very still, then they lower their heads, and are gone.','#e8e0ff')}
        else msg('Candle '+i+' of 6 takes the flame.','#f0e0b0')}
      else{F.candleN=0;sfx('locked');msg('The flame takes, then gutters, and one after another every candle you have lit goes dark. The order was wrong.','#d09a80')}
      return null}],BYE])},{})}
for(let i=1;i<=6;i++)pswCandle(i);
function pswChoirRest(){if(G.enemies)G.enemies=G.enemies.filter(e=>e.t!=='pschorister')}
/* ---------- the fights: the Sacristan and the Steward call help at two thirds and one third of their health; both are remembered when they die ---------- */
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){
  const was=e&&e.hp>0;const r=_h.apply(this,arguments);
  try{if(e&&pswIs(LEVEL)&&(e.t==='pssacristan'||e.t==='psteward')){
    const F=pswF(),sac=e.t==='pssacristan';
    if(was&&e.hp<=0){if(sac){F.sacristanDead=1;msg('The Pale Sacristan sinks to his knees and fades. The reliquary no longer holds its lid shut.','#e8e0ff')}else{F.stewardDead=1;msg('The Pale Steward drops his ring of keys, and it rings on the flags and is still.','#e8e0ff')}}
    else if(e.hp>0&&e.maxhp){const fr=e.hp/e.maxhp;e.ph=e.ph|0;
      if(e.ph<1&&fr<.67||e.ph<2&&fr<.34){e.ph++;const t=sac?'pschorister':'psbakeghost',n=2;
        if(typeof bl3Add==='function')for(let i=0;i<n;i++)bl3Add(t,Math.round(e.x)+(i?-1:1),Math.round(e.y)+1,LEVELS[LEVEL].diff);
        msg(sac?'The Sacristan lifts a hand. Two choristers answer from the walls.':'The Steward rattles his keys. Two ghosts of the kitchen come to his call.','#e8d8ff')}}}}catch(x){console.error('psw hurt',x)}
  return r}}
{const _gl=goToLevel;goToLevel=function(n,entry){const r=_gl.apply(this,arguments);try{if(pswIs(n))pswApplyHidden(n)}catch(e){console.error(e)}return r}}
/* ---------- people ---------- */
function pswPeople(){
  if(PSW._ppl)return;PSW._ppl=1;
  const gl=pswPic('ghost_librarian')||'hl_p_ghost',gc=pswPic('ghost_chamberlain')||'hl_p_ghost',fk=pswPic('ghost_maid')||'priest';
  khNpc('psw_dorcas','Dorcas Fenne, kitchen maid',fk,()=>qNode('psq20',DLG20),{q:'psq20'});
  khNpc('psw_armourer','The Armourer',gl,()=>qNode('psq21',DLG21),{q:'psq21'});
  khNpc('psw_librarian','The Librarian',gl,()=>qNode('psq22',DLG22),{q:'psq22'});
  khNpc('psw_chaplain',"The Chaplain",gc,()=>qNode('psq23',DLG23),{q:'psq23'});
  const talk=(id,name,face,lines)=>khNpc(id,name,face,()=>{const F=pswF(),k='t_'+id,i=(F[k]|0)%lines.length;F[k]=i+1;return say(lines[i],lines.length>1?[['Go on.',()=>say(lines[(i+1)%lines.length],[BYE])],BYE]:[BYE])});
  talk('psw_baker1','A baker, long dead',gc,['"Proofing. The bread is always proofing. It has been proofing since the Sovereign went up the stair and did not come down."','"Do you smell that? That is bread. There is no bread. That is the smell I am left with."']);
  talk('psw_baker2','Another baker',gl,['"Mind the oven door. It is cold, but I keep forgetting that it is cold."','"We used to bake for two hundred. Now I bake for the rats, and they do not say thank you."']);
  talk('psw_servant1','A servant of the household',gc,['"Dinner is at the bell. The bell has not rung. Dinner is still at the bell."','"I think we are very hungry. It is hard to say. Hunger is a thing the living have."']);
  talk('psw_servant2','A scullery maid',gl,['"I scrubbed the same pot four hundred times. I think it is clean now. I cannot stop."']);
  talk('psw_servant3','A footman',gc,['"The kitchens are not safe, sir. The Steward walks them, with his keys. He counts us. He counts the spoons."','"Dorcas hid in the loft. Bless her. She is the only one of us who is still breathing."']);}
const DLG20={offer:"Oh. Oh, you are real. You are not like them. I am Dorcas. I hid in the loft the night the household went upstairs, and I have been here since, living on what I could find. The servants downstairs are still here, though. They are dead, and they are hungry, and they will not eat anything but bread from the Bakehouse. Will you bring six loaves? They are about the north rooms. The ghosts there are not friendly, but the bread is good.",yes:'We will bring bread.',accept:'Thank you. Six loaves, from the Bakehouse. Please hurry, they have been waiting a long time.',
  remind:(n,m)=>'Six loaves from the Bakehouse, please. The ovens are at the north end of the wing, the room east of the armoury.',ready:'Is that bread? Six loaves? Oh, bless you. Give them here.',turn:'Here is the bread.',thanks:'I will take them down to the servants myself. I have not been this happy in years. Take this, it is the last of the good stew.',after:'The servants are quiet now. They are eating, if that is the word. I think they are happier.'};
const DLG21={offer:"Ah. Living hands. I am the Armourer, or what is left. There is a problem. I hammered three sword hilts flat in a fit of bad temper on the night everything stopped, and I cannot find the blades or the hilts. One is in the armoury here. One I think I dropped in the great kitchen, and one is in the guardroom. Bring me the three hilts. I will forge them again, and I will pay you for it.",yes:'We will look for them.',accept:'Good. A hilt in the armoury, one in the great kitchen, one in the guardroom. Look on the floor, under the benches.',
  remind:(n,m)=>'Three hilts: the armoury, the great kitchen and the guardroom. Mind the other armourers; they are not as friendly as I am.',ready:'Three hilts! Let me see them.',turn:'Here they are.',thanks:'It is a start. The blades will come, in time. Take this, I made it when I thought nobody was looking.',after:'The hilts are on the anvil. The blades will come. Everything comes, eventually.'};
const DLG22={offer:"Overdue. Five books are overdue. Five! The whole library is quiet and orderly, except for five books that have strayed through the ground floor: one in the Steward's office, one in the servants' hall, one in the cloister, one in the chapel and one in the chapter house. They have violet covers and my stamp inside. Bring them back to me. I will not shout. I will be very polite and very disappointed.",yes:'We will fetch them.',accept:'Thank you. Five books, five places: the Steward\'s office, the servants\' hall, the cloister, the chapel and the chapter house.',
  remind:(n,m)=>'Five books with violet covers. The Steward\'s office, the servants\' hall, the cloister bench, a pew in the chapel and the chapter house lectern.',ready:'Are those my books?',turn:'Here are the five books.',thanks:'All five. I shall file them at once. For this I owe you something, and I am a person who pays what she owes. This ring was mine.',after:'The shelves are in order. It is a small thing, and it is all I ask.'};
const DLG23={offer:"Welcome, if you are real. I am the Chaplain. The choir has sung the same hymn for a long time, because six candles in the chapel were put out, and the hymn cannot end until they are lit again. A plaque in the nave, beside the font, says in what order. If you light them right, the choir will rest and you may walk the chapel in peace. If you light them wrong, every flame goes out and you must begin again.",yes:'We will light the candles.',accept:'Thank you. Read the plaque by the font, and take your time.',
  remind:(n,m)=>'Six candles in the chapel, in the order of the plaque by the font. If you light one out of order, they all go dark.',ready:'The singing has stopped. Is it done?',turn:'It is done.',thanks:'Then they are at rest, and so shall I be soon. I give you what a chaplain has: a blessing, and the last candle I blessed myself.',after:'The chapel is quiet. It is a good quiet.'};
yrQ('psq20','Bread for the Dead','Dorcas Fenne, kitchen maid',[['Bring six Pale Loaves from the Bakehouse to Dorcas, in the Maids\' Loft.',()=>bagCount('psloaf')>=6,['psw_loaf1','psw_loaf2','psw_loaf3','psw_loaf4','psw_loaf5','psw_loaf6']]],{gold:5000,xp:30000,items:['psstew']},{take:{psloaf:6}});
yrQ('psq21','A Sword Out of Place','The Armourer, in the armoury',[['Find three sword hilts: in the armoury, the great kitchen and the guardroom. Bring them to the Armourer.',()=>bagCount('pshilt')>=3,['psw_hilt1','psw_hilt2','psw_hilt3']]],{gold:6000,xp:35000,items:['psarmourplate']},{take:{pshilt:3}});
yrQ('psq22','Overdue','The Librarian, in the library',[['Return five strayed books to the Librarian: the Steward\'s office, the servants\' hall, the cloister, the chapel, the chapter house.',()=>[1,2,3,4,5].every(i=>bagCount('psbook'+i)>=1),['psw_book1','psw_book2','psw_book3','psw_book4','psw_book5']]],{gold:6500,xp:40000,items:['pslibring']},{take:{psbook1:1,psbook2:1,psbook3:1,psbook4:1,psbook5:1}});
yrQ('psq23',"The Chaplain's Candles",'The Chaplain, in the chapter house',[['Light the six candles of the chapel in the order on the plaque by the font.',()=>!!pswF().candlesDone,['psw_cand1','psw_cand2','psw_cand3','psw_cand4','psw_cand5','psw_cand6']]],{gold:7000,xp:45000,items:['pscandle','psfont']});
for(const q of ['psq20','psq21','psq22','psq23'])QAREA[q]=PSP.REGION;
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids});
  QRF.T.psq20={give:[N(9750,'psw_dorcas')],act:[N(9750,'psw_loaf1','psw_loaf2','psw_loaf3','psw_loaf4','psw_loaf5','psw_loaf6')],ready:[N(9750,'psw_dorcas')]};
  QRF.T.psq21={give:[N(9750,'psw_armourer')],act:[N(9750,'psw_hilt1','psw_hilt2','psw_hilt3')],ready:[N(9750,'psw_armourer')]};
  QRF.T.psq22={give:[N(9760,'psw_librarian')],act:[N(9760,'psw_librarian')],ready:[N(9760,'psw_librarian')]};
  QRF.T.psq23={give:[N(9760,'psw_chaplain')],act:[N(9760,'psw_cand1','psw_cand2','psw_cand3','psw_cand4','psw_cand5','psw_cand6')],ready:[N(9760,'psw_chaplain')]}}

