/* ==========================================================================
   THE VAULT OF MALDRAKE, place 7 of the Blighted Road (levels 9670 to 9678; prefix vt / VT). Core: ids, names, ratings, creatures, items, the lighting and sound of the place, the pale-silver locks,
   the traps, the road links to the neighbouring places, loading and saving.
   9670 The Barrow Hill (outside, rated 88)       9671 The Barrow Stair   9672 The Ossuary of the Roll (the ring of coffins)   9673 The Bell Gallery (the bell room)
   9674 The Silvered Cellars (89)                  9675 The Hall of Underhill   9676 The Stair of Quiet   9677 Maldrake's Sanctum   9678 The Secret Archive.
   Pictures are the Wenlock graveyard's (gy_art.js, loaded by gyLoad), the Witch's Wood trees, the Orange Spire props (hl_p_*) and Oldhaven's soldiers (kh_*): nothing new is painted.
   Files: vault_core.js (this), vault_build.js (the floors), vault_hill.js (the hill), vault_boss.js (Maldrake), vault_story.js (people, books, quests, maps, jump links). Notes: tools/VAULT_NOTES.md.
   THE SEAM WITH THE ROAD FRAMEWORK (src/desert/blight_road.js, written by someone else): this place stands on its own. VT.link = {east:9660, west:9680} are the neighbouring places; VT.arrive says where the party
   stands when it comes in from the east or the west. The framework may set VT.neighbour(dir) or fill BL_ARRIVE[id] = {east:{x,y,f}, west:{x,y,f}} for each place; if neither exists the place on the other side
   is entered at its start square, and if it is not there at all the road says that it is closed.
   ========================================================================== */
const VT={ID:9670,F:[9671,9672,9673,9674,9675,9676],SANCT:9677,ARCH:9678,LAST:9678,ready:false,loading:null,
  LV:{9670:88,9671:88,9672:88,9673:88,9674:89,9675:89,9676:89,9677:89,9678:89},
  NAMES:{9670:'The Barrow Hill',9671:'The Barrow Stair',9672:'The Ossuary of the Roll',9673:'The Bell Gallery',9674:'The Silvered Cellars',9675:'The Hall of Underhill',9676:'The Stair of Quiet',9677:"Maldrake's Sanctum",9678:'The Secret Archive'},
  link:{east:9660,west:9680},arrive:{east:{x:60,y:45,f:3},west:{x:3,y:45,f:1}},hillBack:{x:34,y:13,f:2}};
const vtIs=n=>n>=9670&&n<=9678;
const vtInside=n=>n>=9671&&n<=9678;
for(const n in VT.LV){LEVEL_RATING[n]=VT.LV[n];LEVEL_NAMES[n]=VT.NAMES[n]}
const vtF=()=>G.flags.vt||(G.flags.vt={locks:{},ring:[],bells:[],pages:{},hill:0,tr:{},open:{},reach:{},sig:{}});
const vtLvlK=n=>VT.F.indexOf(n);
/* ---------- the creatures: the graveyard's dead at rating 88 and 89, three named ones above them ---------- */
Object.assign(ENEMY_DEF,{
  vtwarden:{name:'The Barrow Warden',hp:300,dmg:[8,13],hit:.9,w:gyW('boss_0',1.25)*1.05,img:'vti_warden',xp:600,gold:[0,0],speed:1,verb:'hews',boss:true,gy:1,vtb:1,glow:.3},
  vtsilver:{name:'The Silver Warden',hp:430,dmg:[9,14],hit:.9,w:gyW('boss_2',1.55),img:'vti_silver',xp:600,gold:[0,0],speed:1,verb:'cleaves',boss:true,gy:1,vtb:2,glow:.5},
  vtmaldrake:{name:'Wystan Maldrake',hp:640,dmg:[9,15],hit:.92,w:.7,img:'vti_maldrake',xp:900,gold:[0,0],speed:1,verb:'smites',boss:true,gy:1,vtb:3,glow:.6,noFlee:1}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('vtwarden','vtsilver','vtmaldrake');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('vtwarden','vtsilver','vtmaldrake');
if(typeof BOSS_GOLD!=='undefined'){BOSS_GOLD.vtwarden=[3600,4400];BOSS_GOLD.vtsilver=[4200,5000];BOSS_GOLD.vtmaldrake=[6000,7500]}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^vtmaldrake/,'cursed',.25],[/^vtsilver/,'shaken',.2],[/^vtwarden/,'bleeding',.2]);
/* the pictures of the three: the graveyard's knights and the Orange Spire's wizard-king stand in, toned to pale silver (a painted Maldrake of his own is a gap, see tools/VAULT_NOTES.md) */
function vtTone(src,key,mul,add,sat){
  const im=IMG[src];if(!im||IMG[key])return;
  try{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height),p=d.data;
    for(let i=0;i<p.length;i+=4){if(p[i+3]<8)continue;const l=p[i]*.3+p[i+1]*.59+p[i+2]*.11,s=sat===undefined?.35:sat,k=Math.pow(p[i+3]/255,3);   // the soft edge of the picture is toned but not brightened, so no halo
      p[i]=Math.min(255,(l+(p[i]-l)*s)*mul[0]+add[0]*k);p[i+1]=Math.min(255,(l+(p[i+1]-l)*s)*mul[1]+add[1]*k);p[i+2]=Math.min(255,(l+(p[i+2]-l)*s)*mul[2]+add[2]*k)}
    x.putImageData(d,0,0);IMG[key]=c}catch(e){console.error('vtTone',key,e)}}
function vtPics(){
  vtTone('hl_boss0','vti_warden',[1.15,1.22,1.4],[26,30,42],.12);        // the skeleton king of the Orange Spire, silvered and made the old barrow guard
  vtTone('gyp_boss_2','vti_silver',[1.12,1.18,1.32],[22,28,40],.18);       // the armoured knight, pale as moonlit silver
  vtTone('hg_wizard','vti_maldrake',[1.08,1.12,1.22],[26,28,36],.2);       // Aldous Wend's figure, leached grey by the silver (the painted pieces are a stand-in)
  NPC_H.vti_warden=NPC_H.vti_warden||1.25;NPC_H.vti_silver=NPC_H.vti_silver||1.55;NPC_H.vti_maldrake=1.1;
  IMG.vti_wizard=IMG.vti_maldrake;
  const aw=(k,h)=>IMG[k]?+(h*IMG[k].width/IMG[k].height).toFixed(2):.7;   // the creature's width from its picture, for the height wanted
  ENEMY_DEF.vtwarden.w=aw('vti_warden',1.35);ENEMY_DEF.vtsilver.w=aw('vti_silver',1.55);ENEMY_DEF.vtmaldrake.w=aw('vti_maldrake',1.25)}
/* ---------- the things the party carries ---------- */
ITEMDEF.vtkey1={n:'Pale Silver Key',k:'quest',t:'Key',ic:'key',c:'#c8d4e4',stack:1,price:0,sw:.2,d:"A key of pale silver. It opens the first pale-silver lock of the Vault of Maldrake, at the south end of the Warden's Hall on the first floor."};
ITEMDEF.vtsigil={n:'Silver Sigil of Underhill',k:'quest',t:'Key',ic:'ore',c:'#d8e2f0',stack:1,price:0,sw:.2,d:"A flat silver disc stamped with a small house and a well. Three of them open the third pale-silver lock, on the fourth floor of the Vault of Maldrake."};
ITEMDEF.vtseal={n:"The Sanctum Seal",k:'quest',t:'Key',ic:'ore',c:'#e8eef8',stack:1,price:0,sw:.2,d:"A silver seal on a cord. It opens the last pale-silver lock of the Vault of Maldrake, the door to Maldrake's Sanctum on the sixth floor."};
ITEMDEF.vtcontract={n:'The Silver Contract',k:'quest',t:'Lore',ic:'book',c:'#d8d0b8',stack:1,price:0,sw:.1,d:"A sheet of grey vellum: the contract between Wystan Maldrake and the Pale Sovereign. The last clause says how it ends. Read all of it aloud to Maldrake in his Sanctum, and he must agree that it is over."};
ITEMDEF.vtgatekey={n:'The Gate Key of Sale',k:'quest',t:'Key',ic:'key',c:'#e6ecf6',stack:1,price:0,rar:1,sw:.3,d:"A long silver key with a crown for a bow. It opens the great gate of Sale at the west end of the Blighted Road. The Pale Sovereign left it with Maldrake."};
ITEMDEF.vtring={n:"Maldrake's Silver Ring",k:'quest',t:'Lore',ic:'ring',c:'#e4ecf8',stack:1,price:0,sw:.1,d:"Maldrake's ring, a plain band of pale silver that is always cold. The dead of Underhill walk when it turns. It cannot be taken off, except by killing the one who wears it."};
ITEMDEF.vtbroken={n:'The Broken Ring',k:'quest',t:'Lore',ic:'ring',c:'#c0c8d4',stack:1,price:0,sw:.1,d:"The two halves of Maldrake's silver ring. It has no power now."};
for(let i=1;i<=7;i++)ITEMDEF['vtpg'+i]={n:"Maldrake's Journal, page "+i,k:'quest',t:'Lore',ic:'book',c:'#b8a888',stack:1,price:0,sw:.05,d:'A page of the journal of Wystan Maldrake. Read it again at the lectern or desk where you found it.'};
ITEMDEF.vtpg0={n:'The Roll of Underhill',k:'quest',t:'Lore',ic:'book',c:'#c8b898',stack:1,price:0,sw:.1,d:'The parish roll of Underhill. It lists, in order, the eight villagers the grey fever took first. The eight coffins in the Ring open in that order.'};
ITEMDEF.vtstaff={n:"Maldrake's Black Staff",k:'weapon',t:'Staff',ic:'staff',c:'#9aa4b8',dmg:[188,262],magic:118,req:{int:74},lvl:89,price:0,rar:1,eff:{bossdmg:.5,daze:.3},sw:.44,d:"The staff of black ash that Maldrake carried. Adds 118 to the power of spells, bosses take 50% more, and one blow in three leaves the foe dazed. Needs level 89."};
ITEMDEF.vtring2={n:'Ring of the Quiet Silver',k:'ring',t:'Ring',ic:'ring',c:'#cfe0f6',price:0,lvl:89,pas:{ward:16,dodge:.07,regen:.7,mpRegen:.5},int:7,hp:80,rar:1,sw:.1,d:"A clean silver band made from the metal of Maldrake's broken ring. Adds 7 Intelligence and 80 health, every blow on the wearer is 16 lighter, enemies miss 7% more, and wounds and tiredness heal steadily. Needs level 89."};
ITEMDEF.vtamulet={n:'Underhill Well Ring',k:'ring',t:'Ring',ic:'ring',c:'#b8d0e8',price:0,lvl:88,pas:{ward:10,dodge:.04},hp:60,rar:1,sw:.1,d:"A silver ring stamped with a small well, a keepsake of Underhill. Adds 60 health and every blow on the wearer is 10 lighter. Needs level 88."};
/* ---------- the spell Maldrake leaves: every hero may learn it (the sympathy ending) ---------- */
{const id='vtquiet',s={cls:'Vault',lv:88,id,name:'Quiet the Dead',aim:['area',5],fx:[['undead',12,[110,150]],['sleep',3]],d:'Undead within 5 squares flee for 12 rounds or are destroyed outright, and the living cower for 3 rounds. Learned from Maldrake.',col:'#cfe0ff',cost:30,price:0};
  if(typeof MX!=='undefined'&&!MX.some(m=>m.id===id)){MX.push(s);MX_POWER[id]={lv:s.lv,act:true,cost:s.cost,type:'mx',name:s.name,d:s.d,col:s.col,mx:id,aim:s.aim,fx:s.fx,icn:'sp_c20'}}}
/* ---------- loading: the pictures first, then the level; the Wenlock graveyard's pictures are used, so they are loaded with it ---------- */
function vtLoad(){
  if(VT.loading)return VT.loading;
  VT.loading=Promise.all([gyLoad(),typeof khLoadAssets==='function'?khLoadAssets():0]).then(()=>{try{gyAlias();vtPics()}catch(e){console.error('vtLoad',e)}VT.ready=true}).catch(e=>{console.error('vtLoad',e);VT.ready=true});
  return VT.loading}
{const _g=goToLevel;goToLevel=function(n,entry){
  if(vtIs(n)&&!VT.ready&&!VT._wait){VT._wait=1;vtLoad().then(()=>{VT._wait=0;goToLevel(n,entry)});return}
  if(vtIs(n)&&LEVELS[n]===undefined&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error(e)}
  const dead=vtIs(n)&&G.lst&&G.lst[n]&&G.lst[n].dead?new Set(G.lst[n].dead):null;
  const r=_g.call(this,n,entry);
  try{if(vtIs(n)){
    if(dead&&G.enemies)G.enemies=G.enemies.filter(e=>!(e.id<ENEMY_SPAWNS.length&&dead.has(e.id)));   // the fallen stay down: nothing returns to a barrow
    if(typeof vtArrive==='function')vtArrive(n)}}catch(e){console.error('vtArrive',e)}
  return r}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(vtIs(n)&&!VT.ready&&!VT._wait){VT._wait=1;vtLoad().then(()=>{VT._wait=0;jumpToLevel(n,target)});return}
  if(vtIs(n)&&target<88)target=88;
  return _j.apply(this,arguments)}}
{const _r=restore;restore=function(sv){
  if(sv&&vtIs(sv.level)&&!VT.ready&&!VT._wait){VT._wait=1;vtLoad().then(()=>{VT._wait=0;restore(sv)});return}
  return _r.apply(this,arguments)}}
{const _rn=restoreNow;restoreNow=function(sv){const r=_rn.apply(this,arguments);
  try{if(vtIs(LEVEL)&&typeof vtArrive==='function')vtArrive(LEVEL)}catch(e){console.error('vt restore',e)}
  return r}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||vtIs(n)}}
if(typeof TELE_KEEP_HI!=='undefined')TELE_KEEP_HI.add(9670);   // the hill has a stone, the crypt floors none (noTele)
/* ---------- the look and the sound ---------- */
{const _w=weatherNow;weatherNow=function(){
  if(LEVEL===VT.ID)return {id:'fog',n:'Grey blight-mist',fog:.026,haze:.78,dark:.05,mix:.5,col:[196,214,178],text:'A sick grey-green mist lies on the hill. The grass is dead to the root, the barrows are open at the doors, and the crows do not fly. Somewhere low a bell is tolling for nobody.'};
  if(vtIs(LEVEL))return null;
  return _w.apply(this,arguments)}}
if(typeof WIND_AMT!=='undefined'){WIND_AMT[9670]=.42;for(let n=9671;n<=9678;n++)WIND_AMT[n]=.02}
const VTS={nextCrow:0,nextBell:0,nextDrip:0,nextCreak:0,nextMoan:0,nextWhisper:0};
function vtsCrow(v){if(!AC||G.mute)return;const n=1+((Math.random()*3)|0),f=500+Math.random()*180;for(let i=0;i<n;i++){tone(f,f*.7,.2,'sawtooth',.03*v,i*.34);nz(.2,.012*v,'bandpass',1500,1000,i*.34+.02)}}
function vtsBell(v){if(!AC||G.mute)return;const f=146.8;tone(f,f*.995,2.6,'sine',.05*v,0);tone(f*2.4,f*2.38,1.7,'sine',.02*v,0);tone(f*3.9,f*3.9,1.0,'sine',.01*v,0);nz(.5,.004*v,'bandpass',900,600,0)}   // one slow, low toll, far off
function vtsDrip(v){if(!AC||G.mute)return;const f=900+Math.random()*700;tone(f,f*.6,.12,'sine',.03*v,0);tone(f*.7,f*.5,.14,'sine',.012*v,.1)}
function vtsCreak(v){if(!AC||G.mute)return;const f=100+Math.random()*60;tone(f,f*1.5,.6,'sawtooth',.02*v,0);tone(f*1.5,f*1.1,.4,'sawtooth',.016*v,.4);nz(.7,.008*v,'bandpass',380,280,0)}
function vtsMoan(v){if(!AC||G.mute)return;const f=170+Math.random()*60;tone(f,f*.8,1.6,'sine',.02*v,0);tone(f*1.5,f*1.2,1.4,'triangle',.008*v,.2);nz(1.4,.004*v,'bandpass',700,400,0)}
function vtsTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!vtIs(LEVEL)||!SNDOPT.amb)return;
  const now=AC.currentTime;
  if(LEVEL===VT.ID){
    if(now>VTS.nextCrow){VTS.nextCrow=now+8+Math.random()*14;vtsCrow(.5+Math.random()*.5)}
    if(now>VTS.nextBell){VTS.nextBell=now+19+Math.random()*16;vtsBell(.5+Math.random()*.4)}
    if(now>VTS.nextCreak){VTS.nextCreak=now+16+Math.random()*24;vtsCreak(.5)}
  }else{
    if(now>VTS.nextDrip){VTS.nextDrip=now+3+Math.random()*6;vtsDrip(.5+Math.random()*.5)}
    if(now>VTS.nextCreak){VTS.nextCreak=now+13+Math.random()*20;vtsCreak(.5+Math.random()*.4)}
    if(now>VTS.nextMoan){VTS.nextMoan=now+24+Math.random()*30;vtsMoan(.5+Math.random()*.4)}
    if(LEVEL===9673&&now>VTS.nextBell){VTS.nextBell=now+17+Math.random()*14;vtsBell(.35)}   // the bell gallery rings itself, very faintly
    if(LEVEL===9675&&now>VTS.nextWhisper){VTS.nextWhisper=now+11+Math.random()*13;vtsMoan(.6)}
  }}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{vtsTick()}catch(e){console.error('vts',e)}}}
/* the lights: lamps take the colour of the floor; the wall torches of each floor are one flame colour, put in the engine's list after setupLights has emptied it */
{const _sl=setupLights;setupLights=function(){
  const r=_sl.apply(this,arguments);
  try{if(vtIs(LEVEL)){const L=LEVELS[LEVEL],V=L&&L._vt;if(V){
      for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=V.lcol[key]||V.col;l.kI=V.kI||1.35;l.range2=V.range2||110;l.calm=true}
      if(V.torches&&V.torch){gyFlames();const T=V.torch;
        for(const [x,y,f,nar] of V.torches){const d=GYM_D[f],O=nar?.035:TORCH_OUT;
          LIGHTS.push({x:x+.5+d[0]*(.5+O),y:y+.5+d[1]*(.5+O),ph:hash2(x,y,5)*6.28,key:(y*MW+x)*4+f,taken:false,red:!!T.red,fl:T.fl,col:T.col,o:O,nar:!!nar,range2:150,kI:1.25})}}}}}catch(e){console.error('vt lights',e)}
  return r}}
/* ---------- the loot: chests hold potions, mana, gear and gold, better the deeper the floor ---------- */
if(typeof CONTAINERS!=='undefined'&&!CONTAINERS.includes('gy_chest'))CONTAINERS.push('gy_chest');
{const _lf=lootFor;lootFor=function(d){
  if(vtIs(LEVEL)&&d&&d.k==='gy_chest'){
    const r=q=>hash2(d.x,d.y,900+q+LEVEL),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})},k=Math.max(0,LEVEL-9670);
    for(let q=0;q<2+(k>3?1:0);q++)add(potionFor(r(10+q)),1);add('supermana',1+(k>2?1:0));if(r(2)<.6)add('elixir',1);
    for(let q=0;q<1+(k>3?1:0);q++){const a=typeof armourDrop==='function'?armourDrop(r(20+q)):null;if(a)add(a)}
    if(typeof ringFor==='function'&&r(3)<.5)add(ringFor(r(4),88+(k>3?1:0)));
    d.gold=(d.goldAmt||0)||3200+k*400+Math.floor(r(5)*2800);return items}
  return _lf.apply(this,arguments)}}
/* ---------- the map names, for the parchment sheets ---------- */
if(typeof mpmgiKind==='function'){const _k=mpmgiKind;mpmgiKind=function(lv){return lv>=9671&&lv<=9678?'dungeon':lv===9670?'land':_k.apply(this,arguments)}}
/* ---------- the road: the east and west gates of the hill, to the neighbouring places ---------- */
function vtNeighbour(dir){
  const id=VT.link[dir];let at=null,ok=false;
  try{if(typeof VT.neighbour==='function'){const r=VT.neighbour(dir);if(r){return r}}}catch(e){console.error(e)}
  try{if(typeof BL_ARRIVE!=='undefined'&&BL_ARRIVE[id]){at=BL_ARRIVE[id][dir==='east'?'west':'east']||null}}catch(e){}
  ok=!!(LEVELS[id]||(typeof KH_LAZY!=='undefined'&&KH_LAZY[id]));
  if(ok&&!at){if(!LEVELS[id]&&KH_LAZY[id])try{KH_LAZY[id]()}catch(e){console.error(e)}const L=LEVELS[id];if(L&&L.start)at={x:L.start.x,y:L.start.y,f:L.start.f}}
  return ok&&at?{id,at}:null}
function vtRoad(dir){
  const n=vtNeighbour(dir),name=dir==='east'?'Lanternrest Waystation':'Hollowbell Abbey';
  if(!n){sfx('locked');msg('The road '+(dir==='east'?'back to '+name:'on to '+name)+' is lost in black fog. (That part of the Blighted Road is not open yet.)','#c8d0b8');return}
  sfx('door');goToLevel(n.id,n.at)}
/* ---------- the doors: the pale-silver locks, the stairs, the secret door, the road ---------- */
const VT_LOCKS={
  L1:{lvl:9671,name:'The first pale-silver lock',key:'vtkey1',msg:"A gate of grey iron with a pale-silver lock set in it, a disc of cold metal the size of a hand, humming very faintly. The Barrow Warden wears the key.",open:'The Pale Silver Key turns in the lock without a sound, and the disc goes dark. The gate swings in.'},
  L2:{lvl:9673,name:'The second pale-silver lock',need:'bells',msg:"A gate with a pale-silver lock and no keyhole at all. On the plate beside it: THE PEAL OF UNDERHILL OPENS ME. The five bells of the gallery hang over the hall behind you.",open:'The last bell dies away, and the pale-silver lock opens like an eye.'},
  L3:{lvl:9674,name:'The third pale-silver lock',need:'sigils',msg:"A tall gate of pale silver with three round seats cut into it, each the size of a small plate. Three sigils of Underhill would fit them. The cellars hold three rooms; each guards one.",open:'The three sigils sit in their seats and the silver round them runs bright. The great gate rolls aside.'},
  L4:{lvl:9676,name:"The lock of the Sanctum",key:'vtseal',msg:"The last gate of the Vault, bound in pale silver, with a lock shaped like a crown. A seal on a cord would fit it. The Silver Warden walks the stair in front of it, wearing one.",open:"The Sanctum Seal fits the crown-shaped lock. It turns once, and stays turned, and a cold light comes under the gate."}};
function vtLockOpen(id){const F=vtF();return !!F.locks[id]}
function vtLockSet(id,quiet){
  const F=vtF(),L=VT_LOCKS[id],V=LEVELS[L.lvl]&&LEVELS[L.lvl]._vt;if(!F.locks[id])F.locks[id]=1;
  if(V&&V.locks&&V.locks[id]&&LEVEL===L.lvl&&G.grid&&G.grid[V.locks[id].y])G.grid[V.locks[id].y][V.locks[id].x]=0;
  if(!quiet){sfx('door');msg(L.open,'#cfe0ff')}}
function vtLockTry(id){
  const L=VT_LOCKS[id],F=vtF();
  if(F.locks[id]){vtLockSet(id,true);return true}
  if(L.key&&bagCount(L.key)){bagRemove(L.key,1);vtLockSet(id);return true}
  if(L.need==='bells'&&F.bellsDone){vtLockSet(id);return true}
  if(L.need==='sigils'&&bagCount('vtsigil')>=3){bagRemove('vtsigil',3);vtLockSet(id);return true}
  sfx('locked');msg(L.msg,'#c8d4e8');return false}
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.vt){
    if(d.vt==='lock'){if(vtLockOpen(d.id)){if(G.grid[ny][nx]!==0)G.grid[ny][nx]=0;return true}vtLockTry(d.id);return true}
    if(d.vt==='road'){vtRoad(d.dir);return true}
    if(d.vt==='secret'){const F=vtF();if(F.secret){if(G.grid[ny][nx]!==0)G.grid[ny][nx]=0;return true}sfx('bump');msg('A wall of damp stone. Nothing else.','#a8a498');return true}
    if(d.vt==='ringgate'){const F=vtF();if(F.ringDone){if(G.grid[ny][nx]!==0)G.grid[ny][nx]=0;return true}sfx('locked');msg('A gate of grey iron with no lock and no handle. Eight coffins stand in a ring round a rune behind you. Something here must be done in the right order.','#c8d4e8');return true}
    if(d.vt==='stair'){sfx('door');const at=typeof d.at==='function'?d.at():d.at;goToLevel(d.lvl,at);return true}
    return true}
  return _k.apply(this,arguments)}}
/* open locks stay open: when the level is loaded, and every frame until the grid has caught up (the grid is made after the level is loaded) */
{const _u=update;update=function(dt){try{if(vtIs(LEVEL)&&G.state==='play'){const F=G.flags.vt;
    if(F&&G.vtOpenLv!==LEVEL){G.vtOpenLv=LEVEL;const V=LEVELS[LEVEL]._vt;if(V&&V.locks)for(const id in V.locks)if(F.locks[id]&&G.grid[V.locks[id].y])G.grid[V.locks[id].y][V.locks[id].x]=0;
      if(V&&V.secret&&F.secret&&G.grid[V.secret.y])G.grid[V.secret.y][V.secret.x]=0;
      if(V&&V.ringgate&&F.ringDone&&G.grid[V.ringgate.y])G.grid[V.ringgate.y][V.ringgate.x]=0}
    vtTraps(dt)}}catch(e){console.error('vt update',e)}return _u.apply(this,arguments)}}
{const _ll=loadLevel;loadLevel=function(n){const r=_ll.apply(this,arguments);G.vtOpenLv=-1;return r}}
/* ---------- the traps: spike plates (a tile of a different stone, which can be walked round or pressed), and hidden plates that wake the dead ---------- */
function vtTraps(dt){
  const L=LEVELS[LEVEL],V=L&&L._vt;if(!V||!V.traps||!V.traps.length)return;const F=vtF(),P=G.P,key=P.x+','+P.y;
  for(const t of V.traps){
    const k=LEVEL+':'+t.x+','+t.y;if(F.tr[k])continue;
    if(t.x===P.x&&t.y===P.y){F.tr[k]=1;vtSpring(t);return}
    if(t.hidden&&!t.warned){const d=DIRS[P.f],ax=P.x+d[0],ay=P.y+d[1],bx=P.x+d[0]*2,by=P.y+d[1]*2;
      if((ax===t.x&&ay===t.y)||(bx===t.x&&by===t.y)){t.warned=1;if(vtNotices()){msg('Something about the floor ahead looks wrong. There might be a trap.','#e8d8a0')}}}}}
function vtNotices(){try{return G.heroes.some((h,i)=>h.alive&&h.hp>0&&(/Thief|Assassin|Ranger|Archer/i.test((HERO_DEF[i]&&HERO_DEF[i].cls)||(h.cls||''))||(h.dex||0)>=14))}catch(e){return false}}
function vtSpring(t){
  if(t.kind==='spike'){
    sfx('bump');G.shake=.5;msg('Click. Spikes shoot up out of the floor.','#e8a090');
    for(let hi=0;hi<4;hi++){const h=G.heroes[hi];if(!h||!h.alive||h.hp<=0)continue;const front=hi<2,d=Math.max(1,Math.round(h.max*(front?.09:.045)));
      h.hp-=d;h.hurt=1;msg(HERO_DEF[hi].name+' takes '+d+' from the spikes.','#e8a090');addFloat(portraitX(hi)+19,250,'-'+d,'#e8a090');
      if(h.hp<=0){h.hp=0;h.alive=false;msg(HERO_DEF[hi].name+' has fallen!','#ff8a7a');try{bondFall(hi)}catch(x){}if(G.sel===hi)nextHero()}}
    later(1800,()=>msg('The spikes sink back. The plate is safe now.','#c8c0a8'))}
  else if(t.kind==='ambush'){
    sfx('door');G.shake=.3;msg('A plate clicks under your boot. Bones rattle in the walls all round you.','#e8c8a0');
    const spec=t.spawn||['gyskel','gyskel'],P=G.P,free=gyFreeAround({x:P.x,y:P.y},3);
    spec.forEach((tt,i)=>{const f=free[i];if(f){addEnemy(tt,f[0],f[1],true);const m=G.enemies[G.enemies.length-1];if(m){m.lvl=LEVELS[LEVEL].diff;m.vtAdd=1}}})}}
/* ---------- the dead of a place stay dead; creatures count for the quests ---------- */
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){
  const was=e&&e.hp>0;_he.apply(this,arguments);
  try{if(was&&e.hp<=0&&vtIs(LEVEL)){const F=vtF();
    if(LEVEL===VT.ID&&ENEMY_DEF[e.t]&&ENEMY_DEF[e.t].gy&&!ENEMY_DEF[e.t].vtb)G.flags.vtHill=(G.flags.vtHill|0)+1;
    if(typeof vtDied==='function')vtDied(e)}}catch(x){console.error('vt hurt',x)}}}
/* a creature of the vault is never lowered or raised: it stands at its floor's rating */
function vtFoe(L,t,x,y,lvl){L.enemies.push({t,x,y,lvl:lvl||L.diff});return true}
