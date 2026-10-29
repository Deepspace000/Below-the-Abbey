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
  psteward:{name:'The Pale Steward',hp:480,dmg:[9,15],hit:.9,h:1.5,src:'priest',xp:700,speed:1,verb:'rakes',boss:true,glow:.5,noFlee:1},
  pssacristan:{name:'The Pale Sacristan',hp:450,dmg:[9,15],hit:.9,h:1.4,src:'monk',xp:700,speed:1,verb:'smites',boss:true,glow:.6,noFlee:1}};
function pswFoePics(){
  for(const k in PSW_FOES){const d=PSW_FOES[k],kk='psw_i_'+k;
    if(!IMG[kk]){const src=IMG['ps_'+k]||IMG[d.src];if(src&&src.width){
      if(IMG['ps_'+k])IMG[kk]=src;else try{const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');try{x.filter=PSW_FILT[k]||'saturate(.3) brightness(1.2) hue-rotate(200deg)'}catch(e){}x.drawImage(src,0,0);IMG[kk]=c}catch(e){IMG[kk]=src}}}
    if(IMG[kk]){NPC_H[kk]=d.h;ENEMY_DEF[k].w=pswW(kk,d.h);ENEMY_DEF[k].img=kk}}}
const PSW_FILT={pscook:'saturate(.25) brightness(1.3) hue-rotate(190deg)',psarmourer:'saturate(.25) brightness(1.3) hue-rotate(190deg)',psmonk:'saturate(.3) brightness(1.45) hue-rotate(200deg)',pssacristan:'saturate(.3) brightness(1.5) hue-rotate(210deg)',psteward:'saturate(.2) brightness(1.5) hue-rotate(200deg)',
  psbakeghost:'saturate(.3) brightness(1.15) hue-rotate(180deg)',pschorister:'saturate(.3) brightness(1.3) hue-rotate(230deg)',psbookwraith:'saturate(.5) brightness(1.15) hue-rotate(20deg)',psink:'brightness(.25) saturate(.4)',pskrat:'brightness(.9) saturate(.3)',psarmour:'saturate(.25) brightness(1.35) hue-rotate(200deg)'};
for(const k in PSW_FOES){if(k==='psarmour'&&ENEMY_DEF.psarmour)continue;const d=PSW_FOES[k];
  ENEMY_DEF[k]={name:d.name,hp:d.hp,dmg:d.dmg,hit:d.hit,w:d.h*.45,img:'gyi_skel',xp:d.xp,gold:[0,0],speed:d.speed,verb:d.verb,psw:1};
  for(const q of ['fly','floatH','glow','ranged','boss','noFlee','still','wake'])if(d[q]!==undefined)ENEMY_DEF[k][q]=d[q]}
if(typeof NO_VARY!=='undefined')NO_VARY.push('psteward','pssacristan');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('psteward','pssacristan');
if(typeof BOSS_GOLD!=='undefined'){BOSS_GOLD.psteward=[4400,5400];BOSS_GOLD.pssacristan=[4400,5400]}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^pschorister/,'haunted',.2],[/^psbakeghost/,'shaken',.15],[/^pssacristan/,'cursed',.2],[/^psteward/,'shaken',.2],[/^psink/,'shaken',.1]);
/* ---------- pictures: painted ps_<name> if present, else a stand-in from existing pieces ---------- */
/* name: [source key, filter, height in squares]. Painted drop-ins: IMG['ps_'+name] (assets/ps) win automatically. */
const PSW_STAND={
  cauldron_big:['ww_cauldron','saturate(.2) brightness(1.2) hue-rotate(200deg)',1.0],spit_hearth:['hgtb_furn_hearth','saturate(.3) hue-rotate(200deg) brightness(.95)',1.25],
  butcher_block:['wm_crate','',.62],pans_hanging:['wm_cage_lantern','saturate(.5)',.5],barrels:['wm_barrel','',.62],cask:['wm_cask','',.55],oven:['hgtb_furn_hearth','saturate(.15) brightness(.8) hue-rotate(210deg)',1.0],
  pews:['mi_pew','saturate(.5) hue-rotate(230deg) brightness(.95)',.8],altar:['mi_altar','saturate(.6) hue-rotate(220deg)',1.45],window_stained:['hl_p_window','',1.9],font:['mi_font','saturate(.6) hue-rotate(200deg)',1.0],
  reliquary_chest:['wm_chest','saturate(.5) brightness(1.4) hue-rotate(10deg)',.5],lectern:['hl_p_lectern','',.95],bookcase_tall:['hl_p_shelf','saturate(.6) hue-rotate(210deg) brightness(.9)',1.7],
  bookcase_wm:['wm_bookshelf','',1.6],reading_desk:['hl_p_desk','',.8],globe:['hgtb_furn_books_globe','saturate(.4) hue-rotate(190deg)',.6],scroll_rack:['hgtb_furn_cabinet','saturate(.5) hue-rotate(200deg) brightness(.8)',.6],
  st_saint1:['mi_saint','saturate(.2) brightness(.95) hue-rotate(200deg)',1.7],st_saint2:['wm_statue','saturate(.25) brightness(1.5) hue-rotate(10deg)',1.55],st_saint3:['mi_angel','saturate(.15) brightness(1.1) hue-rotate(200deg)',1.8],st_saint4:['mi_saint','saturate(.15) brightness(.8) hue-rotate(220deg)',1.7],
  candelabra:['mi_candel','saturate(.5) hue-rotate(200deg)',1.45],chandelier:['mi_chand','saturate(.5) hue-rotate(200deg)',1.2],brazier:['wm_brazier','',.9],
  ghost_librarian:['hl_p_ghost','saturate(.4) hue-rotate(220deg)',1.15],ghost_chamberlain:['hl_p_ghost','saturate(.3) hue-rotate(160deg)',1.15],
  armoury_rack:['hgstall_armour','',.9],sword_rack:['hgstall_arms','',.9],suit:['hl_p_armour','saturate(.25) brightness(1.35) hue-rotate(200deg)',1.05],
  bed:['hgtb_furn_bed','saturate(.35) sepia(.5) hue-rotate(-10deg)',.55],cabinet:['hgtb_furn_cabinet','saturate(.25) hue-rotate(10deg) brightness(.8)',.55],table:['hgtb_table','saturate(.25) hue-rotate(10deg) brightness(.85)',.55],
  chair:['hgtb_chair','saturate(.3) brightness(.9)',.5],bucket:['wm_bucket','',.4],tools:['wm_tools','',.55],candle:['hl_p_candle','',.65],
  cl_monk:['hgxstat6','saturate(.1) brightness(1.9)',1.5],cl_knight:['hgxstat0','saturate(.1) brightness(1.9)',1.6],cl_smith:['hgxstat1','saturate(.1) brightness(1.9)',1.5],cl_angel:['hgxstat2','saturate(.1) brightness(1.9)',1.7],cl_maiden:['hgxstat3','saturate(.1) brightness(1.9)',1.5],cl_girl:['hgxstat7','saturate(.1) brightness(1.9)',1.3],bench_moss:['gy_bench','sepia(.4) hue-rotate(50deg) saturate(1.7) brightness(1.0)',.55],
  desk:['hl_p_desk','',.8],note:['hl_p_note','',.5],chest:['wm_chest','',.5],coffer:['gy_chest','',.55],banner:['hl_p_banner','saturate(.5) hue-rotate(40deg)',1.3],tomb:['hl_p_tomb','',.8],
  hearth:['hgtb_furn_hearth','saturate(.3) hue-rotate(200deg) brightness(1.0)',1.2],cage:['hl_p_cage','',.8],clock:['hgtb_furn_clock','saturate(.3) hue-rotate(10deg)',1.0],mirror:['wm_mirror','',1.2],
  well:['ww_well','saturate(.4) brightness(1.1) hue-rotate(200deg)',.9],lamp:['hgtb_lamp_tall','saturate(.4) hue-rotate(180deg)',1.3],basket:['sack','',.4],jar:['vase1','',.5],vase:['vase0','saturate(.4) brightness(1.2)',.5],
  fern:['hgt_fern','saturate(.6) brightness(.8)',.7],ivy:['hgt_vine_wisteria','saturate(.6) hue-rotate(60deg) brightness(.8)',1.3],shrub:['hgt_shrub','saturate(.5) brightness(.7) hue-rotate(20deg)',.8],bones:['gy_bones','',.35],
  pond:['hgtb_tank_round','saturate(.6) hue-rotate(160deg) brightness(.7)',.5],lilies:['hgdf_plant7','',.6],flowers:['hgt_pearlbush','saturate(.5)',.6],flowers2:['hgtb_plant_lupin','saturate(.8) hue-rotate(20deg)',.8],flowers3:['wm_bellflower','',.7],rose:['gy_rose','',.4],
  tapestry:['hl_p_banner','saturate(.3) hue-rotate(200deg)',1.4],plaque:['hs_plaque','',.7],sack:['sack2','',.4],sacks:['sacks','',.5],keg:['wm_keg','',.55],crate:['wm_crate','',.5],pot:['vase3','',.5],
  grill:['hl_p_chains','',1.3],stool:['hgtb_chair','saturate(.2) brightness(.7)',.4],rug:['hgtb_rug_lilac_runner','',.2],
};
function pswPic(name){
  if(IMG['ps_'+name]){NPC_H['ps_'+name]=NPC_H['ps_'+name]||(PSW_STAND[name]?PSW_STAND[name][2]:1);return 'ps_'+name}
  const k='psw_'+name,d=PSW_STAND[name];
  if(IMG[k])return k;
  if(!d)return IMG[name]?name:null;
  const src=IMG[d[0]];if(!src||!src.width)return null;
  if(d[1]){try{const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.filter=d[1];x.drawImage(src,0,0);IMG[k]=c}catch(e){IMG[k]=src}}else IMG[k]=src;
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
      if(!bagCount('pskey2')){sfx('locked');msg('An iron-bound door with a silver lock. It will not move. The key must be somewhere on this floor.','#c8d0e8');return true}
      const lv=pspLevel(lk.to);
      if(lv&&lv.built){sfx('door');goToLevel(lk.to,{x:lk.land[0],y:lk.land[1],f:lk.land[2]});return true}
      sfx('door');msg('The Second Floor Key turns in the silver lock. The door opens on a dark stair, but the way up is sealed by a fall of pale stone. The upper floors of the Pale Spire are not open yet.','#cfd8f0');return true}
    if(d.psw==='dungeon'){sfx('door');goToLevel(d.lvl,d.at);return true}
    return true}
  return _k.apply(this,arguments)}}
/* an opened hidden door stays open: applied on load of the level and every frame until the grid exists */
{const _u=update;update=function(dt){try{if(pswIs(LEVEL)&&G.state==='play'){const F=G.flags.psp,L=LEVELS[LEVEL],V=L&&L._psw;
    if(F&&G.pswOpenLv!==LEVEL&&G.grid&&G.grid.length){G.pswOpenLv=LEVEL;if(V&&V.secret&&F.sacristyOpen&&G.grid[V.secret.y])G.grid[V.secret.y][V.secret.x]=0}
    if(V&&V.rests)pswRestWatch(V)}}catch(e){console.error('psw update',e)}return _u.apply(this,arguments)}}
/* rest rooms: a calm line on walking in; (the bed does the resting) */
function pswRestWatch(V){
  const P=G.P,k=LEVEL;let inn=null;for(const r of V.rests)if(P.x>=r.x0&&P.x<=r.x1&&P.y>=r.y0&&P.y<=r.y1)inn=r;
  if(inn&&PSW._in!==inn.name){PSW._in=inn.name;msg(inn.line,'#f0c890')}else if(!inn)PSW._in=null}
/* lights: lamps take the colour of the place; the wall torches have their own colours (silver, violet, and warm in the rest rooms) */
{const _sl=setupLights;setupLights=function(){
  const r=_sl.apply(this,arguments);
  try{if(pswIs(LEVEL)){const L=LEVELS[LEVEL],V=L&&L._psw;if(V){
      for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=V.lcol[key]||V.col;l.kI=1.7;l.range2=190;l.calm=true}
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
/* ---------- floors and walls (made in code) ---------- */
const PSW_STY={ash:{tex:'texGrey',g:1.5,rgb:[.97,.97,1.1],v:[0,0,0,3,3,5,5,1,2,4]},dark:{tex:'texGrey',g:1.3,rgb:[.9,.93,1.08],v:[1,1,2,2,4,0,3]},warm:{tex:'texBone',g:1.28,rgb:[1.12,1.0,.86],v:[0,1,2,3,4,5]},
  moss:{tex:'texGrey',g:1.0,rgb:[.8,1.05,.85],v:[0,1,3,4,5,2]},rib:{tex:'texBone',g:1.15,rgb:[.95,.92,1.1],v:[0,1,2,3,4,5]}};
function pswFloors(){
  if(PSW._fl)return PSW._fl;gyFloors();
  const mk=(nm,fn)=>{if(FLOORS[nm])return nm;const N=128,d=new Uint8ClampedArray(N*N*4);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=(y*N+x)*4,c=fn(x,y);d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255}FLOORS[nm]=d;return nm};
  const hh=(a,b,c)=>hash2(a,b,c);
  const flag=gyFloorTone('pswf_flag','gyf_flag',1.2,[.93,.94,1.1]),dark=gyFloorTone('pswf_dark','gyf_flag',.85,[.86,.88,1.02]);
  const cheq=mk('pswf_cheq',(x,y)=>{const w=((x>>6)+(y>>6))&1,v=hh(x>>1,y>>1,31)*22+hh(x>>3,y>>3,32)*18,e=Math.min(x&63,y&63,63-(x&63),63-(y&63));let b=w?[222,223,236]:[44,42,60];if(e<1.5)b=w?[170,170,190]:[20,18,30];return [b[0]+(w?-v:v),b[1]+(w?-v:v),b[2]+(w?-v:v*1.2)]});
  const carp=mk('pswf_carpet',(x,y)=>{const v=hh(x>>1,y>>1,41)*14,dm=Math.abs((x%32)-16)+Math.abs((y%32)-16),mark=dm<4?1:0,b=dm<8?[92,66,128]:[74,52,108];const e=Math.min(x&31,y&31);return [b[0]+v+mark*50,b[1]+v+mark*40,b[2]+v+mark*20+(e<1?10:0)]});
  const lawn=gyFloorTone('pswf_lawn','gyf_grass',.62,[.78,.98,.86]);
  const cob=gyFloorTone('pswf_cob','gyf_cobble',.62,[.84,.9,1.05]),wet=gyFloorWet('pswf_wetcob',cob,[.45,.5,.75],5);
  const warm=gyFloorTone('pswf_warm','wood'in FLOORS?'wood':'gyf_flag',1.0,[1.1,.95,.8]);
  PSW._fl=[flag,dark,cheq,carp,warm,lawn,wet];
  if(!CEILS.pswc){const im=IMG.gyp_texGrey_3;if(im&&typeof dsPaintedTex==='function'){const b=dsPaintedTex(im),d=new Uint8ClampedArray(b.length);for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,b[i]*.9);d[i+1]=Math.min(255,b[i+1]*.9);d[i+2]=Math.min(255,b[i+2]*1.05);d[i+3]=255}CEILS.pswc=d}}
  return PSW._fl}
/* ---------- the maker ---------- */
const PSW_SPEC={};
function pswMake(id){
  if(LEVELS[id])return LEVELS[id];
  const S=PSW_SPEC[id];if(!S)throw new Error('psw: no plan for '+id);
  gyAlias();pswFoePics();pswPeople();const FL=pswFloors();
  const W=S.W,H=S.H,WH=S.wh||2.2,hs=(a,b,c)=>hash2(a,b,c+id),g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  for(const r of S.rects)for(let y=r[1];y<=r[3];y++)for(let x=r[0];x<=r[2];x++)g[y][x]='.';
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chars[c]=gid;chMap.set(gid,c)}return c};
  const open=(x,y)=>g[y]&&g[y][x]==='.';
  /* wall style of each wall cell: the first room that touches it */
  const sty=[];for(let y=0;y<H;y++)sty.push(new Array(W).fill(null));
  for(const r of S.rects){const st=r[4]||'ash';for(let y=r[1]-1;y<=r[3]+1;y++)for(let x=r[0]-1;x<=r[2]+1;x++)if(g[y]&&g[y][x]==='#'&&!sty[y][x])sty[y][x]=st}
  const tiles={};const tileFor=(st,v)=>{const s=PSW_STY[st]||PSW_STY.ash,k=st+v;if(tiles[k]===undefined)tiles[k]=ch(gyTile(s.tex+'_'+v,WH,{gain:s.g,rgb:s.rgb}));return tiles[k]};
  const inner=ch(gyTile('texBlack_3',WH,{gain:.5,rgb:[.8,.8,1]}));
  const rows=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){
    if(g[y][x]==='.'){s+='.';continue}
    const st=sty[y][x];if(!st){s+=inner;continue}
    const sp=PSW_STY[st]||PSW_STY.ash;s+=tileFor(st,sp.v[(hs(x,y,5)*sp.v.length)|0])}rows.push(s)}
  const put=(x,y,c)=>{rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
  const decor=[],enemies=[],items=[],lights=[],lcol={},occ=new Set(),miss=[],V={lcol,col:S.lcol||[.85,1.0,1.55],miss,id,rests:S.rests||[]},reserved=new Set(),doorSq=[];
  let start=null;
  const D4=[[0,-1],[1,0],[0,1],[-1,0]];
  for(const D of S.doors){
    const dx=D.x,dy=D.y,inn=D4.map(([a,b])=>[dx+a,dy+b]).find(([x,y])=>open(x,y));
    if(!inn)throw new Error('psw '+id+': door at '+dx+','+dy+' has no floor beside it');
    const st=sty[dy][dx]||'ash',sp=PSW_STY[st]||PSW_STY.ash,brick=sp.tex;let gid;
    const fcol=(inn[1]>dy?2:inn[1]<dy?0:inn[0]>dx?1:3);
    if(D.kind==='link'){
      const lk=D.link;gid=gyTile(brick+'_0',WH,{fac:{img:D.img||'gatesC_1',i:0,n:1},gain:sp.g*.8,rgb:sp.rgb,tag:'pswl'+id+dx+'_'+dy,emit:.3});
      KH_DOOR[gid]={lvl:lk.to,at:{x:lk.land[0],y:lk.land[1],f:lk.land[2]}}}
    else if(D.kind==='lock'){
      const lk=D.link;gid=gyTile(brick+'_0',WH,{fac:{img:'stairFix_0',i:0,n:1},gain:sp.g*.9,rgb:[.85,.9,1.3],tag:'pswk'+id+dx+'_'+dy,emit:.3,draw:(x,w,h)=>{
        const cx=64,cy=h-58,gr=x.createRadialGradient(cx,cy,1,cx,cy,16);gr.addColorStop(0,'rgba(210,190,255,1)');gr.addColorStop(.5,'rgba(150,110,230,.55)');gr.addColorStop(1,'rgba(100,70,200,0)');x.fillStyle=gr;x.beginPath();x.arc(cx,cy,16,0,6.3);x.fill();
        x.strokeStyle='rgba(235,240,255,.95)';x.lineWidth=2;x.strokeRect(cx-6,cy-4,12,13);x.beginPath();x.arc(cx,cy-4,5,Math.PI,0);x.stroke()}});
      KH_DOOR[gid]={psw:'lock',link:lk}}
    else if(D.kind==='dungeon'){
      const lk=D.link;gid=gyTile(brick+'_0',WH,{fac:{img:'f_dungeongate',i:0,n:1,fit:1},gain:1.0,rgb:[.9,.9,1.1],tag:'pswd'+id,emit:.35});
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
    if(o.text)d.text=o.text;decor.push(d);if(!o.walkOk)occ.add(x+','+y);return d};
  const p=(name,x,y,o)=>{const k=pswPic(name);return k?dec(k,x,y,o):(miss.push('nopic:'+name+'@'+x+','+y),null)};
  const sign=(x,y,wd,a,b)=>{if(!open(x,y)){miss.push('sign@'+x+','+y);return}decor.push({k:'sign_gy',x,y,block:false,wd,txt:[a,b||''],sc:1})};
  const foe=(t,x,y)=>{if(!open(x,y)||(occ.has(x+','+y)&&!reserved.has(x+','+y))){miss.push('foe '+t+'@'+x+','+y);return false}enemies.push({t,x,y,lvl:S.diff});occ.add(x+','+y);return true};
  const light=(x,y,col)=>{if(!open(x,y)){miss.push('light@'+x+','+y);return}lights.push([x,y]);if(col)lcol[x+','+y]=col};
  const fm=[];for(let y=0;y<H;y++)fm.push(new Array(W).fill(S.floorDef||'0'));
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open(x,y))fm[y][x]=f};
  const fill=(x0,y0,x1,y1,fn)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)fn(x,y)};
  const C={id,S,W,H,g,rows,open,free,dec,p,sign,foe,light,setF,fill,decor,enemies,lights,lcol,occ,V,items,reserved,hs};
  S.dress(C);
  /* ---- wall torches: silver and violet in the cold rooms, orange in the warm ones ---- */
  const torches=[],warmAt=(x,y)=>(S.warm||[]).some(r=>x>=r[0]-1&&x<=r[2]+1&&y>=r[1]-1&&y<=r[3]+1);
  {const blk=new Set();for(const d of decor)if(d.block)blk.add(d.x+','+d.y);const cand=[];
   for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(open(x,y)||rows[y][x]==='.'||doorSq.some(q=>Math.hypot(q[0]-x,q[1]-y)<2.2))continue;
     for(let f=0;f<4;f++){const nx=x+GYM_D[f][0],ny=y+GYM_D[f][1];if(!open(nx,ny)||blk.has(nx+','+ny))continue;
       const d4=GYM_D.filter(([a,b])=>open(nx+a,ny+b)).length,nar=(!open(nx-1,ny)&&!open(nx+1,ny))||(!open(nx,ny-1)&&!open(nx,ny+1));
       cand.push({x,y,f,nar,pri:d4>=3?1:d4===2?2:3,h:hs(x,y,f*7)})}}
   cand.sort((a,b)=>a.pri-b.pri||a.h-b.h);
   for(const c of cand){const gp=c.nar?3.6:3.2;if(torches.some(t=>Math.hypot(t[0]-c.x,t[1]-c.y)<gp))continue;
     const nx=c.x+GYM_D[c.f][0],ny=c.y+GYM_D[c.f][1],w=warmAt(nx,ny),r=hs(c.x,c.y,9);
     torches.push([c.x,c.y,c.f,c.nar?1:0,w?0:(r<.45?2:3),w?[1.4,.92,.45]:(r<.45?[1.15,.72,1.75]:[.78,.95,1.65])])}}
  V.torches=torches;
  /* ---- a lamp every few squares where none is near ---- */
  {const have=lights.slice();for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!open(x,y))continue;if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=(S.lampGap||4.6))){have.push([x,y]);lights.push([x,y]);lcol[x+','+y]=warmAt(x,y)?[1.45,1.0,.5]:V.col}}}
  const fmS=fm.map(r=>r.join(''));
  const L={rows,chars,fmap:fmS,floorSet:FL.slice(),floor:FL[0],floor2:FL[1],ceil:CEILS.pswc?'pswc':'gyc_1',ceilH:WH,start,enemies,items,decor,lights,portals:[],day:0,amb:S.amb===undefined?.16:S.amb,torchGap:1e9,noTele:true,noExtras:true,
    name:PSW.NAMES[id],label:PSW.NAMES[id],diff:S.diff,mapNames:S.names||[],_psw:V};
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
/* ===== 9750 THE GROUND FLOOR, KITCHENS AND ARMOURY (the west wing) ===== */
const pswLk=(id,x,y)=>pspLinkAt(id,x,y);
const pswCold=[.82,.97,1.6],pswViolet=[1.2,.75,1.8],pswWarm=[1.5,1.05,.55];
PSW_SPEC[9750]={W:72,H:64,diff:101,wh:2.2,lcol:pswCold,
  rects:[[4,5,12,12,'ash'],[14,4,40,12,'dark'],[42,4,55,12,'dark'],[58,4,66,56,'ash'],[67,39,68,41,'ash'],[67,23,68,25,'ash'],[67,5,68,6,'dark'],[67,52,68,53,'dark'],
    [4,14,12,26,'dark'],[4,28,12,40,'dark'],[14,14,26,26,'dark'],[14,28,26,40,'dark'],[28,14,54,41,'dark'],[4,43,57,44,'ash'],
    [4,46,12,56,'warm'],[24,50,36,58,'ash'],[38,46,46,56,'ash'],[48,46,56,56,'dark'],
    [13,8,13,9],[41,8,41,9],[56,8,57,9],[8,13,9,13],[33,13,34,13],[47,13,48,13],[13,19,13,20],[8,27,9,27],[19,27,20,27],[13,33,13,34],[27,19,27,20],[27,33,27,34],[55,27,57,28],
    [8,41,9,42],[19,41,20,42],[40,42,41,42],[8,45,9,45],[30,45,31,49],[42,45,43,45],[51,45,52,45],[57,50,57,51]],
  warm:[[4,46,12,56]],
  rests:[{name:'loft',x0:4,y0:46,x1:12,y1:56,line:"The Maids' Loft. Candles burn warm here, the first warm light in the Pale Spire. Nothing in this room means any harm."}],
  doors:[{x:69,y:40,kind:'link',link:pswLk(9750,69,40)},{x:69,y:24,kind:'link',link:pswLk(9750,69,24)},{x:8,y:4,kind:'lock',link:pswLk(9750,8,4)},{x:30,y:59,kind:'dungeon',link:pswLk(9750,30,59)}],
  start:{x:66,y:40,f:3},
  names:[{t:'West Turret',x:8,y:8,k:'place'},{t:'The Armoury',x:20,y:8,k:'place'},{t:'The Guardroom',x:34,y:8,k:'place'},{t:'The Bakehouse',x:48,y:8,k:'place'},{t:'The Service Hall',x:62,y:30,k:'place'},{t:'The Larder',x:8,y:20,k:'place'},{t:'The Scullery',x:8,y:34,k:'place'},{t:'The Pantry',x:20,y:20,k:'place'},{t:'The Buttery',x:20,y:34,k:'place'},{t:'The Great Kitchen',x:41,y:28,k:'place'},{t:"The Maids' Loft",x:8,y:51,k:'place'},{t:'The Undercroft Stair',x:30,y:54,k:'place'},{t:"The Steward's Office",x:42,y:51,k:'place'},{t:"The Servants' Hall",x:52,y:51,k:'place'}],
  dress(C){const {dec,p,sign,foe,light,setF,fill}=C;
    const cyc=(a,i)=>a[i%a.length];
    setF(14,4,54,12,'1');setF(28,14,54,41,'1');setF(4,14,26,40,'1');setF(4,43,57,44,'1');setF(24,50,56,58,'1');setF(4,46,12,56,'4');setF(58,4,68,56,'0');
    // ---- the West Turret Room ----
    sign(6,5,[0,-1],'THE WEST TURRET','Stair to the second floor');
    p('suit',5,6,{block:true});p('suit',11,6,{block:true});p('candelabra',7,10,{block:true});p('table',5,10,{block:true});p('chair',6,11,{});p('lamp',11,11,{block:true});p('banner',4,8,{wd:[-1,0]});
    light(8,7,pswViolet);light(8,10,pswCold);foe('psarmour',10,9);
    // ---- the Armoury (west half) and the Guardroom (east half) ----
    sign(15,4,[0,-1],'THE ARMOURY','Weapons are returned to the rack');sign(29,4,[0,-1],'THE GUARDROOM','Keep your hands where they can be seen');
    [15,18].forEach((x,i)=>p(i===1?'armoury_rack':'sword_rack',x,5,{block:true}));
    p('sword_rack',24,5,{block:true,npc:'psw_dawnrack'});p('sword_rack',21,5,{block:true,npc:'psw_hilt1'});     // Dawnwarden hangs here
    [15,19,23].forEach((x,i)=>p('suit',x,11,{block:true}));foe('psarmour',17,11);foe('psarmour',21,11);
    p('brazier',14,10,{block:true});p('tools',14,9,{block:true});p('crate',16,10,{block:true});p('bucket',14,8,{});
    p('armoury_rack',24,9,{block:true});p('candelabra',20,8,{block:true});p('table',18,8,{block:true});p('cask',22,10,{block:true});
    foe('psarmourer',19,9);
    {const k=pswPic('ghost_chamberlain');const kp=KH_KEEPERS.psw_armourer;if(kp)dec(pswPic('ghost_librarian')||k,16,7,{npc:'psw_armourer',block:false,walkOk:1})}
    dec(pswPic('suit'),27,5,{block:true,sc:1.1});dec(pswPic('suit'),27,11,{block:true,sc:1.1});
    p('table',33,8,{block:true});p('stool',31,8,{});p('stool',35,9,{});p('sword_rack',38,5,{block:true,npc:'psw_hilt3'});p('suit',30,5,{block:true});p('suit',38,11,{block:true});p('banner',40,8,{wd:[1,0]});
    p('barrels',31,11,{block:true});p('chair',36,7,{});p('candle',32,5,{block:true});p('lamp',39,9,{block:true});
    foe('psarmour',31,6);foe('psarmour',37,6);foe('psarmourer',34,10);foe('psarmour',36,11);
    for(const [x,y] of [[20,6],[33,10],[16,9],[37,8]])light(x,y,pswCold);
    // ---- the Bakehouse ----
    sign(43,4,[0,-1],'THE BAKEHOUSE','Bread for the household');
    [44,48,52].forEach(x=>p('oven',x,4,{block:true}));
    p('table',45,7,{block:true});p('table',49,7,{block:true});p('butcher_block',53,7,{block:true});p('sacks',43,11,{block:true});p('sacks',54,11,{block:true});p('basket',47,10,{});p('barrels',54,5,{block:true});
    p('chest',54,9,{block:true});p('pans_hanging',46,6,{walkOk:1});p('lamp',43,6,{block:true});
    for(let i=1;i<=6;i++){const [x,y]=[[45,6],[49,6],[53,6],[46,9],[50,10],[44,10]][i-1];pswLoaf(C,i,x,y)}
    {const k=pswPic('ghost_chamberlain');const a=dec(k,50,8,{npc:'psw_baker1',walkOk:1});const b=dec(k,47,11,{npc:'psw_baker2',walkOk:1})}
    foe('psbakeghost',44,8);foe('psbakeghost',52,10);foe('pskrat',55,11);
    for(const [x,y] of [[46,8],[52,6]])light(x,y,pswCold);
    // ---- the Larder ----
    sign(5,14,[0,-1],'THE LARDER','Cold store');
    p('barrels',5,15,{block:true});p('keg',7,15,{block:true});p('sacks',11,15,{block:true});p('crate',5,19,{block:true});p('sacks',11,21,{block:true});p('pot',6,24,{block:true});p('basket',11,25,{});p('cask',5,25,{block:true});p('bones',8,22,{});
    foe('pskrat',8,18);foe('pskrat',9,24);
    // ---- the Scullery with its wellhouse (the courtyard wells of the old castles) ----
    sign(5,28,[0,-1],'THE SCULLERY','Wash your hands');
    p('well',8,34,{block:true,sc:1.15,npc:'psw_well'});p('bucket',6,34,{});p('bucket',10,33,{});p('tools',5,30,{block:true});p('pot',11,30,{block:true});p('basket',5,38,{});p('barrels',11,38,{block:true});p('pans_hanging',8,30,{walkOk:1});p('sacks',5,36,{block:true});
    foe('pskrat',9,38);foe('pskrat',6,32);
    light(8,31,pswCold);light(8,37,pswCold);
    // ---- the Pantry ----
    sign(15,14,[0,-1],'THE PANTRY','Dry goods');
    [15,17,19,21,23].forEach((x,i)=>p(i%2?'cabinet':'bookcase_wm',x,14,{block:true}));
    p('sacks',25,16,{block:true});p('jar',15,19,{});p('crate',25,22,{block:true});p('jar',17,24,{});p('barrels',15,25,{block:true});p('table',20,20,{block:true});p('basket',22,24,{});
    foe('pskrat',19,18);foe('pskrat',23,23);foe('psbakeghost',18,22);
    // ---- the Buttery and Wine Store ----
    sign(15,28,[0,-1],'THE BUTTERY','Wine and small beer');
    [15,17,19,21,23,25].forEach((x,i)=>p(i%2?'barrels':'cask',x,29,{block:true}));
    p('keg',15,34,{block:true});p('cask',25,34,{block:true});p('barrels',15,39,{block:true});p('keg',17,39,{block:true});p('cask',23,39,{block:true});p('table',20,37,{block:true});p('jar',19,31,{});p('bucket',25,38,{});
    foe('pskrat',22,33);foe('pskrat',18,36);
    for(const [x,y] of [[20,31],[20,37]])light(x,y,pswViolet);
    // ---- the Great Kitchen ----
    sign(29,14,[0,-1],'THE GREAT KITCHEN','The fires are lit and nobody is cooking');
    [[36,14],[46,14]].forEach(([x,y])=>p('spit_hearth',x,y,{block:true,sc:1.1}));p('hearth',31,14,{block:true});p('hearth',51,14,{block:true});
    p('cauldron_big',33,15,{block:true,sc:1.1});p('cauldron_big',49,15,{block:true,sc:1.1});p('cauldron_big',41,15,{block:true});
    p('pans_hanging',39,16,{walkOk:1});p('pans_hanging',44,16,{walkOk:1});
    [32,34,36,38].forEach((x,i)=>p(cyc(['butcher_block','table'],i),x,20,{block:true}));[44,46,48,50].forEach((x,i)=>p(cyc(['table','butcher_block'],i),x,20,{block:true}));
    [32,34,36,38].forEach((x,i)=>p(cyc(['table','butcher_block'],i),x,34,{block:true}));[44,46,48,50].forEach((x,i)=>p(cyc(['butcher_block','table'],i),x,34,{block:true}));
    p('barrels',29,16,{block:true});p('barrels',53,16,{block:true});p('sacks',29,39,{block:true});p('sacks',53,39,{block:true});p('keg',53,23,{block:true});p('pot',29,24,{block:true});p('basket',53,36,{});p('bucket',29,36,{});p('stool',40,22,{});p('stool',42,23,{});p('pot',53,31,{block:true});
    p('lamp',40,40,{block:true});p('candelabra',42,26,{block:true});
    pswLadle(C,37,16);pswHilt(C,2,29,26);
    foe('psteward',41,30);foe('pscook',34,24);foe('pscook',47,24);foe('pscook',35,37);foe('pscook',48,37);foe('pskrat',40,38);foe('psbakeghost',31,31);foe('psbakeghost',51,28);
    for(const [x,y] of [[34,17],[48,17],[41,24],[34,31],[48,31],[41,37]])light(x,y,pswCold);
    // ---- the service hall (spine): benches, barrels, banners, a dark runner of flags ----
    sign(59,5,[0,-1],'THE SERVICE HALL','Deliveries and the Kitchen Door');
    [8,13,18,31,36,47,53].forEach((y,i)=>{p(cyc(['barrels','sacks','crate','keg'],i),58,y,{block:true});p(cyc(['lamp','crate','barrels','sacks'],i+1),66,y+(i%2?1:0),{block:true})});
    [10,16,34,50].forEach((y,i)=>p('stool',59,y,{}));p('basket',65,29,{});p('basket',60,52,{});p('banner',62,5,{wd:[0,-1]});p('pans_hanging',66,45,{walkOk:1});
    p('bucket',58,22,{});p('bucket',58,55,{});
    for(let y=8;y<=54;y+=7)light(62,y,pswCold);
    // closets
    sign(68,5,[0,-1],'GARDEROBE','');p('bucket',68,6,{});p('stool',67,5,{});sign(68,52,[0,-1],'GARDEROBE','');p('bucket',68,53,{});
    // the doors east
    sign(67,39,[0,-1],'THE KITCHEN DOOR','Out to the Court of Statues');sign(67,23,[0,-1],'TO THE GREAT HALLS','Through the Screens Passage');
    p('lamp',68,41,{block:true});p('lamp',68,25,{block:true});
    // ---- the Maids' Loft (REST ROOM, warm) ----
    sign(5,46,[0,-1],"THE MAIDS' LOFT",'Rest here');
    [[5,48],[5,52],[11,48],[11,52]].forEach(([x,y],i)=>p('bed',x,y,{block:true,npc:i===0?'psw_bed':undefined}));
    p('chest',11,55,{block:true});p('cabinet',5,55,{block:true});p('candle',8,48,{block:true});p('candle',8,54,{block:true});p('table',8,51,{block:true});p('vase',7,56,{});p('rug',8,53,{walkOk:1});p('basket',12,50,{});p('chair',9,51,{});
    {const kp=KH_KEEPERS.psw_dorcas;if(kp)dec(kp.face,7,50,{npc:'psw_dorcas',walkOk:1,sc:kp.sc||1})}
    for(const [x,y] of [[8,47],[8,50],[8,55]])light(x,y,pswWarm);
    // ---- the Undercroft stair room ----
    p('brazier',27,56,{block:true});p('brazier',33,56,{block:true});p('suit',25,52,{block:true});p('suit',35,52,{block:true});p('barrels',25,57,{block:true});p('crate',35,57,{block:true});p('banner',30,50,{wd:[0,-1]});
    sign(28,58,[0,1],'THE UNDERCROFT','Keys with the Steward');sign(32,58,[0,1],'NO FOOD BELOW','Nothing goes down to be eaten');
    light(30,53,pswViolet);light(26,54,pswCold);light(34,54,pswCold);
    // ---- the Steward's Office ----
    sign(39,46,[0,-1],"THE STEWARD'S OFFICE",'Ledgers and keys');
    p('desk',42,48,{block:true,npc:'psw_ledger'});p('chair',42,49,{});p('cabinet',39,47,{block:true,npc:'psw_keyshelf'});p('cabinet',45,47,{block:true});p('lamp',39,55,{block:true});p('candle',45,53,{block:true});p('rug',42,52,{walkOk:1});p('crate',45,55,{block:true});p('table',40,52,{block:true});
    pswBook(C,1,44,50);
    light(42,50,pswViolet);light(42,54,pswCold);
    // ---- the Servants' Hall ----
    sign(49,46,[0,-1],"THE SERVANTS' HALL",'Meals at the bell');
    [50,52,54].forEach((x,i)=>p('table',x,50,{block:true}));[50,52,54].forEach(x=>p('stool',x,52,{}));[50,54].forEach(x=>p('stool',x,48,{}));
    p('hearth',52,46,{block:true});p('barrels',49,55,{block:true});p('lamp',55,55,{block:true});p('basket',55,48,{});p('pot',49,47,{block:true});
    pswBook(C,2,55,53);
    {const k=pswPic('ghost_chamberlain'),k2=pswPic('ghost_librarian');dec(k,51,54,{npc:'psw_servant1',walkOk:1});dec(k2,53,48,{npc:'psw_servant2',walkOk:1});dec(k,55,51,{npc:'psw_servant3',walkOk:1})}
    foe('psbakeghost',52,54);
    for(const [x,y] of [[52,48],[52,53]])light(x,y,pswCold)}};
/* ===== 9760 THE GROUND FLOOR, CLOISTER, CHAPEL AND LIBRARY (the east wing) ===== */
PSW_SPEC[9760]={W:72,H:64,diff:101,wh:2.3,lcol:pswCold,
  rects:[[3,28,11,56,'ash'],[14,34,38,36,'moss'],[14,58,38,60,'moss'],[14,37,16,57,'moss'],[36,37,38,57,'moss'],[17,37,35,57,'moss'],
    [14,4,40,28,'ash'],[25,29,26,33,'ash'],[41,5,42,6,'dark'],[41,20,42,21,'dark'],[44,5,56,15,'ash'],[51,17,56,21,'warm'],[58,5,68,12,'ash'],[45,16,46,33,'ash'],[42,34,68,60,'ash'],[58,22,68,32,'rib'],
    [12,35,13,36],[12,50,13,51],[41,12,43,13],[53,16,54,16],[57,8,57,9],[39,46,41,47]],
  warm:[[51,17,56,21]],
  rests:[{name:'almonry',x0:51,y0:17,x1:56,y1:21,line:"The Almonry, a pilgrim's cell. Candles burn warm here, and the room is still and kind."}],
  doors:[{x:2,y:50,kind:'link',link:pswLk(9760,2,50)},{x:2,y:30,kind:'link',link:pswLk(9760,2,30)},{x:66,y:4,kind:'lock',link:pswLk(9760,66,4)},{x:62,y:33,kind:'secret'}],
  start:{x:5,y:50,f:1},
  names:[{t:"The Pilgrims' Hall",x:7,y:42,k:'place'},{t:'The Cloister Walk',x:26,y:35,k:'place'},{t:'The Garth',x:26,y:47,k:'place'},{t:'The Library',x:27,y:16,k:'place'},{t:'The Chapter House',x:50,y:10,k:'place'},{t:'The Almonry',x:54,y:19,k:'place'},{t:'East Turret',x:63,y:8,k:'place'},{t:'The Chapel',x:55,y:47,k:'place'}],
  dress(C){const {dec,p,sign,foe,light,setF,fill}=C;
    const cyc=(a,i)=>a[i%a.length];const col=pswPic('plinth_statue');
    setF(3,28,11,56,'0');setF(3,29,11,56,'0');setF(6,29,8,56,'3');setF(14,34,38,60,'6');setF(17,37,35,57,'5');setF(14,4,40,28,'0');setF(25,29,26,33,'0');setF(41,5,42,6,'1');setF(41,20,42,21,'1');
    setF(44,5,56,15,'0');setF(51,17,56,21,'4');setF(58,5,68,12,'0');setF(45,16,46,33,'0');setF(42,34,68,60,'2');setF(42,46,66,48,'3');setF(58,22,68,32,'0');setF(41,12,43,13,'0');
    // ---- the Pilgrims' Hall: the two arrivals, a violet runner, ivy columns, mossy benches, statues of pilgrims ----
    sign(4,28,[0,-1],"THE PILGRIMS' HALL",'Quiet, please');
    for(let y=32;y<=54;y+=4){dec('gy_column',5,y,{block:true,sc:1.05});dec('gy_column',9,y,{block:true,sc:1.05})}
    [36,44].forEach(y=>{p('bench_moss',3,y,{block:true});p('bench_moss',11,y+2,{block:true})});
    [34,40,48,54].forEach((y,i)=>p(i%2?'st_saint1':'st_saint2',11,y,{block:true}));[38,46,52].forEach((y,i)=>p(pswStat(),3,y,{block:true}));
    p('lamp',3,32,{block:true});p('lamp',11,52,{block:true});p('ivy',3,41,{wd:[-1,0]});p('ivy',11,38,{wd:[1,0]});
    foe('psmonk',7,38);foe('psmonk',8,44);
    for(let y=30;y<=54;y+=6)light(7,y,pswCold);
    sign(3,34,[-1,0],'TO THE LIBRARY AND THE CHAPEL','Through the cloister');sign(3,48,[-1,0],'THE CLOISTER DOOR','Out to the Court of Statues');
    // ---- the Cloister Walk and the garth (ref: an ivy cloister, statues on plinths in the arches, mossy benches, wet cobbles, fog) ----
    for(let i=0;i<5;i++){const y=38+i*5;dec('gy_column',16,y,{block:true,sc:1.1});dec('gy_column',36,y+2,{block:true,sc:1.1});p(i%2?'st_saint3':pswStat(),16,y+2,{block:true});p(i%2?pswStat():'st_saint2',36,y,{block:true})}
    for(let i=0;i<5;i++){const x=19+i*4;dec('gy_column',x,36,{block:true,sc:1.1});p(i%2?pswStat():'st_saint1',x+2,36,{block:true});dec('gy_column',x+2,58,{block:true,sc:1.1});p(i%2?'st_saint2':pswStat(),x,58,{block:true})}
    [[15,38],[15,46],[15,54],[37,41],[37,49],[37,55]].forEach(([x,y],i)=>{p('bench_moss',x,y,{block:true})});
    [[20,35],[32,35],[22,59],[30,59]].forEach(([x,y])=>p('ivy',x,y,{wd:[0,y<40?-1:1]}));
    dec('gy_yew',26,47,{block:true,sc:.8});p('well',26,41,{block:true,npc:'psw_well2'});p('shrub',20,40,{block:true});p('shrub',32,40,{block:true});p('shrub',20,54,{block:true});p('fern',23,53,{});p('fern',29,43,{});p('flowers',32,45,{walkOk:1});p('flowers',21,45,{walkOk:1});
    // the grotto nook of the garth (ref: statue in an arch, stream into a lily pond, flowers white and bruise purple and one red)
    p(pswStat(),34,53,{block:true,sc:1.1});p('pond',33,55,{block:true});p('lilies',32,56,{walkOk:1});p('flowers2',34,56,{walkOk:1});p('flowers3',32,54,{walkOk:1});p('rose',35,54,{walkOk:1});p('bench_moss',30,55,{block:true});p('vase',35,56,{});
    sign(30,34,[0,-1],'THE CLOISTER WALK','Walk in silence');
    pswBook(C,3,17,58);
    foe('psmonk',15,42);foe('psmonk',37,52);foe('psmonk',24,59);foe('psmonk',28,35);if(ENEMY_DEF.psmarblehound){foe('psmarblehound',26,52);foe('psmarblehound',22,43)}
    for(const [x,y] of [[15,40],[15,52],[37,44],[37,54],[26,36],[26,59],[26,47]])light(x,y,pswCold);
    // ---- the Library and Scriptorium ----
    sign(15,4,[0,-1],'THE LIBRARY','Books must be returned');sign(35,4,[0,-1],'THE SCRIPTORIUM','Ink is kept in the east aisle');
    for(let x=15;x<=39;x+=2)p(cyc(['bookcase_tall','bookcase_wm'],x>>1),x,4,{block:true});
    for(const y of [8,14,20]){for(const x of [16,18,20,22,32,34,36,38])p(cyc(['bookcase_wm','bookcase_tall'],(x+y)>>1),x,y,{block:true})}
    for(let y=6;y<=26;y+=4){p('bookcase_tall',14,y,{block:true});p('bookcase_wm',40,y,{block:true})}
    for(const x of [17,20]){p('reading_desk',x,24,{block:true});p('chair',x,25,{})}
    p('reading_desk',34,24,{block:true,npc:'psw_habit'});p('chair',34,25,{});p('reading_desk',37,24,{block:true});p('scroll_rack',31,22,{block:true});p('scroll_rack',23,22,{block:true});p('globe',27,21,{block:true});p('lectern',27,12,{block:true,npc:'psw_lectern'});
    p('candelabra',24,11,{block:true});p('candelabra',30,11,{block:true});p('lamp',15,27,{block:true});p('lamp',39,27,{block:true});p('mirror',27,5,{wd:[0,-1]});
    {const k=pswPic('ghost_librarian'),kp=KH_KEEPERS.psw_librarian;if(kp)dec(k,26,18,{npc:'psw_librarian',walkOk:1})}
    foe('psbookwraith',19,11);foe('psbookwraith',35,11);foe('psbookwraith',19,17);foe('psbookwraith',35,17);foe('psbookwraith',27,8);foe('psink',24,23);foe('psink',30,25);foe('psink',37,19);
    for(const [x,y] of [[27,7],[27,13],[27,19],[18,12],[36,12],[18,22],[36,22]])light(x,y,cyc([pswCold,pswViolet],x+y));
    sign(25,29,[-1,0],'TO THE CLOISTER','');p('candle',25,30,{block:true});p('candle',26,32,{block:true});
    sign(42,5,[1,0],'GARDEROBE','');p('bucket',42,6,{});sign(42,20,[1,0],'GARDEROBE','');p('bucket',42,21,{});
    // ---- the Chapter House ----
    sign(45,5,[0,-1],'THE CHAPTER HOUSE','Where the chapter sat');
    for(let x=45;x<=55;x+=2)p('bench_moss',x,14,{block:true});p('bench_moss',44,8,{block:true});p('bench_moss',44,11,{block:true});p('bench_moss',56,8,{block:true});p('bench_moss',56,11,{block:true});
    p('lectern',50,11,{block:true,npc:'psw_chapterbook'});p('candelabra',47,9,{block:true});p('candelabra',53,9,{block:true});p('window_stained',48,5,{wd:[0,-1]});p('window_stained',52,5,{wd:[0,-1]});p('tomb',46,6,{block:true,sc:.9});p('lamp',55,6,{block:true});p(pswStat(),55,13,{block:true});
    {const k=pswPic('ghost_chamberlain'),kp=KH_KEEPERS.psw_chaplain;if(kp)dec(k,50,8,{npc:'psw_chaplain',walkOk:1})}
    pswBook(C,5,54,6);
    foe('psmonk',47,12);foe('psmonk',54,10);foe('psmonk',49,13);
    for(const [x,y] of [[50,7],[47,13],[54,13]])light(x,y,pswViolet);
    // ---- the Almonry (REST ROOM, warm) ----
    sign(52,17,[0,-1],'THE ALMONRY','A bed for pilgrims');
    p('bed',52,19,{block:true,npc:'psw_bed2'});p('bed',55,19,{block:true});p('chest',56,21,{block:true});p('candle',53,21,{block:true});p('rug',54,20,{walkOk:1});p('vase',51,21,{});p('chair',54,18,{});
    for(const [x,y] of [[54,19],[52,21]])light(x,y,pswWarm);
    // ---- the passage from the Chapter House to the chapel ----
    for(let y=20;y<=30;y+=5)p(cyc([pswStat(),'st_saint4'],y),45,y,{block:true});p('lamp',46,18,{block:true});p('lamp',46,32,{block:true});p('bench_moss',46,25,{block:true});
    light(45,22,pswCold);light(46,28,pswCold);sign(46,16,[0,-1],'TO THE CHAPEL','');
    // ---- the East Turret Room ----
    sign(60,5,[0,-1],'THE EAST TURRET','Stair to the second floor');
    p('suit',60,6,{block:true});p('suit',64,6,{block:true});p('candelabra',63,10,{block:true});p('table',67,9,{block:true});p('chair',66,10,{});p('banner',68,8,{wd:[1,0]});p('lamp',58,11,{block:true});p('bucket',67,11,{});
    light(66,7,pswViolet);light(62,10,pswCold);foe('psmonk',62,9);foe('psarmour',66,9);
    // ---- the Chapel ----
    sign(43,34,[0,-1],'THE CHAPEL','Please do not light the candles out of order');
    for(const y of [40,42,44])for(let x=46;x<=56;x+=2)p('pews',x,y,{block:true});
    for(const y of [50,52,54])for(let x=46;x<=56;x+=2)p('pews',x,y,{block:true});
    pswBook(C,4,46,44);
    [[60,40],[62,40],[64,40],[60,42],[60,52],[62,52],[64,52],[60,54]].forEach(([x,y])=>{p('pews',x,y,{block:true})});
    p('altar',67,47,{block:true,npc:'psw_altar',sc:1.1});p('font',44,43,{block:true,npc:'psw_font'});p('lectern',64,47,{block:true,npc:'psw_nave'});
    p('st_saint1',66,43,{block:true});p('st_saint2',66,51,{block:true});p('st_saint3',68,38,{block:true});p('st_saint4',68,56,{block:true});
    [38,46,52,57].forEach((y,i)=>{p('window_stained',68,y,{wd:[1,0]})});[48,54,60].forEach(x=>p('window_stained',x,34,{wd:[0,-1]}));[48,56,62].forEach(x=>p('window_stained',x,60,{wd:[0,1]}));
    p('chandelier',50,46,{walkOk:1,bob:.6});p('chandelier',58,48,{walkOk:1,bob:.6});
    // the six candles (psq23) and the odd bracket (the lever to the sacristy)
    [[50,59],[50,35],[55,35],[58,59],[66,35],[66,59]].forEach(([x,y],i)=>p('candelabra',x,y,{block:true,npc:'psw_cand'+(i+1)}));
    dec(pswPic('candelabra'),45,35,{block:true,npc:'psw_bracket',sc:1.0});
    p('plaque',44,57,{block:true,npc:'psw_candleplaque'});
    // the choir: eight Pale Choristers in the stalls, standing until the party comes into the nave
    [[60,41],[62,41],[64,41],[61,43],[60,53],[62,53],[64,53],[61,55]].forEach(([x,y])=>foe('pschorister',x,y));
    for(const [x,y] of [[46,38],[54,38],[62,38],[46,57],[54,57],[62,57],[48,47],[56,47],[66,47]])light(x,y,cyc([pswCold,pswViolet],x+y));
    // ---- the Sacristy ----
    sign(60,22,[0,-1],'THE SACRISTY','Vestments and the sacred vessels');
    [59,61,63,65,67].forEach((x,i)=>p(cyc(['cabinet','bookcase_wm'],i),x,22,{block:true}));p('tapestry',58,27,{wd:[-1,0]});p('tapestry',68,27,{wd:[1,0]});p('candelabra',60,31,{block:true});p('candelabra',66,31,{block:true});p('table',66,24,{block:true});p('mirror',64,22,{wd:[0,-1]});p('chair',67,29,{});
    dec(pswPic('reliquary_chest'),63,25,{block:true,npc:'psw_reliquary',sc:1.15});p(pswStat(),67,25,{block:true});p(pswStat(),59,29,{block:true});
    foe('pssacristan',64,28);
    for(const [x,y] of [[63,24],[62,28],[67,30],[59,25]])light(x,y,cyc([pswViolet,pswCold],x))}};
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
const PSW_LEDGER="The Steward's ledger lies open on the desk, in a neat dry hand. Most of the page is lists of bread, wine and candles delivered. At the bottom: 'Keys to the upper floors, all returned to the Sacristan at dusk, as always. The Sacristan keeps them in the chapel. He says nobody should ask where.'";
const PSW_KEYSHELF="A cabinet with forty small hooks, each with a brass tag: LARDER, CELLAR, ARMOURY, WINE, and so on. The hooks are empty, except one. The tag reads UNDERCROFT and the key is not for sale, but nobody is here to mind. The three hooks marked UPPER STAIRS are bare.";
const PSW_HABIT="A thin book in grey cloth, titled The Sacristan's Habit, written by a monk of the chapel. Most of it is about vestments and washing. One page is marked with a ribbon: 'Brother Aldous would never leave the keys in the vestry or the cellar. He kept them where the candles are, and told nobody. He said the one who needs them will look at the candles.'";
const PSW_PLAQUE="A brass plaque beside the font. The letters say: THE ORDER OF THE CANDLES. 'Start at the west end of the south wall. Then the west end of the north wall. Then the middle of the north wall. Then the middle of the south wall. Then the east end of the north wall. Last, the east end of the south wall. Light them in this order and the choir will rest. Light them out of order and every flame goes out.'";
khNpc('psw_ledger',"The Steward's ledger",'hl_p_note',()=>say(PSW_LEDGER,[BYE]));
khNpc('psw_keyshelf','A cabinet of key hooks','hl_p_note',()=>say(PSW_KEYSHELF,[BYE]));
khNpc('psw_habit',"A reading desk",'hl_p_lectern',()=>{pswF().habitRead=1;return say(PSW_HABIT,[BYE])});
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
  if(F.key2||bagCount('pskey2'))return say('The reliquary chest stands open. On a grey cloth lies the print of a long key, and nothing else.',[BYE]);
  const alive=G.enemies&&G.enemies.some(e=>e.t==='pssacristan'&&e.hp>0);
  if(alive&&!F.sacristanDead)return say('A reliquary chest of pale wood with silver bands. The lid will not lift. Something that was a man stands guard over it, and he is watching you.',[BYE]);
  return say('The lid of the reliquary lifts. Inside, on a grey cloth, lies a tall silver key with a violet stone in the bow.',[['Take the key.',()=>{
    F.key2=true;if(!bagAdd(mkItem('pskey2')))G.items.push({k:'pskey2',x:Math.round(G.P.x),y:Math.round(G.P.y),taken:false});
    sfx('key');msg('You take the Second Floor Key. It opens the three stair doors to the second floor.','#ffe36a');G.talk=null;return null}],BYE])});
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
  const gl=pswPic('ghost_librarian')||'hl_p_ghost',gc=pswPic('ghost_chamberlain')||'hl_p_ghost',fk=['kh_ohfolk3_0','kh_ohfolk2_0','peasantF','peasantM'].find(k=>IMG[k])||'priest';
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
