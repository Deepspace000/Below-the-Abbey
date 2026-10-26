/* ==========================================================================
   THE BLACK SWILL, and the way west (prefix bsw / BSW). Act 8 of the main story.
   1. When Cinder's quest hgsph (six burning spheres) is done, Cinder asks the party to go down to the Underlevel (level 476, rating 80) and kill the Black Swill, a boss of level 80 (quest bsw1).
   2. The Black Swill is a colossal black jelly (assets/ds_bsw.png idle, assets/ds_bswA.png attacking). It lies on the big island in the middle of the Black Sea, which is widened into a round chamber with a ring of pillars
      (bswChamber, built when the Underlevel is built). A boat is needed: the island is in open water, with one boat moored at its south shore. It splits off black slimes as it is hurt, spits a corroding glob at the front line every
      fourth round, and mends itself a little every round. It does not come back once it is dead (G.flags.bswDead is saved with the game).
   3. After the quest is accepted the Underlevel map and the mini map mark the place (gold ring, skull) and a dashed line shows the way from the nearest dock.
   4. When it dies: a cutscene, the reward, and the party stands again on the surface of the Deeper Hollow maze (475), in the great atrium at the top, where a tall painted gate has opened in the north wall and Aldous Wend waits.
      The new main quest The Western Kingdoms (wk1 to wk3): the gate leads to the Maze of Gardens (WK.GARDEN, level 490), whose far end leads to Wenlock (WK.WENLOCK, 496). The other builders call wkMet('garden'|'wenlock'|'mayor').
   Test link: ?town=blackswill&lvl=80 (a level 80 party on the island's south shore with the quest active); ?town=blackswill&lvl=80&dead=1 (the Black Swill is already dead, standing at the gate on the surface).
   ========================================================================== */
const BSW={ID:476,SURF:475};
/* ---------- the creatures ---------- */
Object.assign(ENEMY_DEF,{
  bsw:{name:'The Black Swill',hp:800,dmg:[5,8],hit:.9,w:4.6,img:'bsw',xp:900,gold:[0,0],speed:1,verb:'engulfs',boss:true,glow:.45},
  bswslime:{name:'Swill Slime',hp:22,dmg:[1,3],hit:.8,w:1.5,img:'hgu_hgusl2',xp:1,gold:[0,0],speed:1,verb:'smothers',glow:.8}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('bsw','bswslime');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('bsw'); // it is allowed to be taller than the window
if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.bsw=[2500,3500];
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^bsw$/,'poisoned',.3],[/^bsw$/,'graverot',.12],[/^bswslime$/,'poisoned',.2]);
/* ---------- the gear it leaves ---------- */
ITEMDEF.bswblade={n:'Swillcleaver',k:'weapon',t:'Sword',ic:'sword',c:'#3a2a5a',dmg:[385,460],hit:.2,req:{str:64},lvl:80,price:0,rar:1,eff:{exec:[.4,4],bossdmg:.7,bleed:[.4,8,50]},dbl:.2,sw:.46,d:'A black blade that still drips. A foe under 40% health takes four times the blow, bosses take 70% more, and wounds bleed. Cut from the Black Swill. Needs level 80.'};
ITEMDEF.bswmantle={n:'Swillhide Mantle',k:'chest',t:'Chest',ic:'chest',c:'#2a1a40',armor:46,price:0,lvl:80,pas:{ward:16,regen:.6,dodge:.07},rar:1,gear:1,sw:.46,d:'A mantle of black, glossy hide that the Black Swill left behind. Enemies miss 7% more, every blow on you is 16 lighter, and wounds close steadily. Needs level 80.'};
/* ---------- the quests ---------- */
const BSW_DESC='Cinder, the ember warden, asks the party to go down to the Underlevel and kill the Black Swill, a boss of level 80, a great black jelly that lies in a chamber on the island in the middle of the Black Sea. You will need a boat, lots of gear and plenty of potions: healing, mana and escape. The map of the Underlevel shows where it lies.';
QUESTS.bsw1={title:'The Black Swill',who:'Cinder, the ember warden',desc:BSW_DESC,need:1,goal:()=>G.flags.bswDead?1:0,reward:{gold:20000,xp:100000,items:['bswblade','potion6','potion6','hgescape']}};
QUESTS.wk1={title:'The Western Kingdoms',who:'Aldous Wend, wizard',desc:'With the Black Swill dead, a gate has opened in the north wall of the great atrium at the top of the Deeper Hollow maze. It leads out of the Hollow Lands, to the western kingdoms. First comes the Maze of Gardens: go through the gate and walk the gardens to their far end.',need:1,goal:()=>(G.flags.wkGarden||G.flags.wkWenlock||G.flags.wkMayor)?1:0,reward:{gold:3000,xp:20000,items:['potion6']}};
QUESTS.wk2={title:'The Town of Wenlock',who:'Aldous Wend, wizard',desc:'The far end of the Maze of Gardens opens on the town of Wenlock, a peaceful town in the western kingdoms. Walk in.',need:1,goal:()=>(G.flags.wkWenlock||G.flags.wkMayor)?1:0,reward:{gold:4000,xp:25000,items:['potion6']}};
QUESTS.wk3={title:'The Mayor of Wenlock',who:'The mayor of Wenlock',desc:'Speak to the mayor of Wenlock.',need:1,goal:()=>G.flags.wkMayor?1:0,reward:{gold:6000,xp:40000,items:['potion6','potion6']}};
for(const id of ['bsw1','wk1','wk2','wk3'])QAREA[id]=id==='bsw1'?'The Deeper Hollow':'The Western Kingdoms';
if(typeof MAIN_QUESTS!=='undefined')['bsw1','wk1','wk2','wk3'].forEach(id=>MAIN_QUESTS.add(id));
if(typeof QNEXT!=='undefined'){QNEXT.wk1='wk2';QNEXT.wk2='wk3'}
if(typeof QNOTE!=='undefined'){
  QNOTE.bsw1='The black water drains, and a grey light comes down through the rock.';
  QNOTE.wk3='The road to the western kingdoms goes on from Wenlock, in the next part of the game.'}
if(typeof QAREA_ORDER!=='undefined'&&!QAREA_ORDER.includes('The Western Kingdoms'))QAREA_ORDER.push('The Western Kingdoms');
/* the hand-in hook the garden and Wenlock builders call (see wk_ids.js) */
function bswQuestEnsure(id){if(qSt(id)===null){G.quests[id]={st:'active',ord:(G.flags.qSeq=(G.flags.qSeq|0)+1),base:0}}}
wkMet=function(what){
  const F=G.flags;try{
    if(what==='garden'&&!F.wkGarden){F.wkGarden=1;bswQuestEnsure('wk1');qTurnIn('wk1');if(qSt('wk2')===null)bswQuestEnsure('wk2')}
    else if(what==='wenlock'&&!F.wkWenlock){F.wkGarden=1;F.wkWenlock=1;bswQuestEnsure('wk1');qTurnIn('wk1');bswQuestEnsure('wk2');qTurnIn('wk2');if(qSt('wk3')===null)bswQuestEnsure('wk3')}
    else if(what==='mayor'&&!F.wkMayor){F.wkGarden=1;F.wkWenlock=1;F.wkMayor=1;for(const id of ['wk1','wk2','wk3']){bswQuestEnsure(id);qTurnIn(id)}msg('The road to the western kingdoms goes on from Wenlock, in the next part of the game.','#ffe36a')}
  }catch(e){console.error('wkMet',e)}};
/* ---------- the story pages ---------- */
STORY.push(
  {id:'bsw',c:()=>qSt('bsw1')!==null,t:'The Black Swill',x:'When the six burning spheres were dead, Cinder the ember warden told the party what was left. Under the maze, in the black sea of the Underlevel, on an island in the middle of the water, lies the Black Swill: a huge black jelly, level 80 and older than the maze. Nothing that goes into its chamber without lots of gear and plenty of potions comes out again. The map of the Underlevel shows the place.'},
  {id:'bswdead',c:()=>G.flags.bswDead,t:'The Black Water Drains',x:'The party crossed the Black Sea by boat, stood on the island among the pillars and killed the Black Swill. It sagged and ran out of itself into the sea, the water cleared, and a grey light came down through the rock. The light lifted the party up through the dark and set it down on the surface, in the great atrium at the top of the maze.'},
  {id:'wkgate',c:()=>qSt('wk1')!==null||G.flags.bswDead,t:'The Gate in the Atrium',x:'In the north wall of the atrium a tall gate stood open that nobody had seen before: dark stone, wrought iron, and beyond it a gravel path between green hedges in full sun. Aldous Wend was waiting at its foot. The gate leads out of the Hollow Lands, to the western kingdoms, and the first thing beyond it is the Maze of Gardens.'},
  {id:'wkmaze',c:()=>G.flags.wkGate||G.flags.wkGarden,t:'The Maze of Gardens',x:'Beyond the gate lay a maze of tall, clipped hedges, rose arbours, wisteria tunnels, fountains and lily ponds, all in warm light and birdsong. Nothing in it is hostile. The way through winds a long time between the hedges, and the party followed it to the far end.'},
  {id:'wenlock',c:()=>G.flags.wkWenlock,t:'Wenlock',x:'The far end of the gardens opened on Wenlock, a peaceful town of stone and timber cottages with flower boxes, a market square with a fountain, an inn, a church and a green. It is the first town of the western kingdoms.'},
  {id:'wkmayor',c:()=>G.flags.wkMayor,t:'The Mayor of Wenlock',x:'The party spoke to the mayor of Wenlock, who welcomed them. The road to the western kingdoms goes on from here, in the next part of the game.'});
{const _sn=storyNext;storyNext=function(){const F=G.flags;
  if(F.wkMayor)return 'You have met the mayor of Wenlock. The road to the western kingdoms goes on in the next part of the game.';
  if(F.wkWenlock)return 'Speak to the mayor of Wenlock.';
  if(F.wkGarden)return 'Walk into Wenlock, the town at the far end of the garden.';
  if(F.wkGate)return 'Walk the Maze of Gardens to its far end. The town of Wenlock lies beyond.';
  if(F.bswDead&&qSt('wk1')==='active')return 'Walk through the open gate in the north wall of the great atrium at the top of the Deeper Hollow maze, into the Maze of Gardens, and on to its far end.';
  if(F.bswDead)return 'Go to the new gate in the north wall of the great atrium at the top of the Deeper Hollow maze, speak to Aldous Wend, and walk into the Maze of Gardens.';
  if(qSt('bsw1')==='active')return 'Go down to the Underlevel, take a boat across the Black Sea to the island in the middle, and kill the Black Swill, a level 80 boss. Bring lots of gear and potions. The map shows the place.';
  if(qSt('hgsph')==='done'&&qSt('bsw1')===null)return 'Speak to Cinder, the ember warden, in the Deeper Hollow maze.';
  return _sn.apply(this,arguments)}}
/* ---------- Cinder gives the quest ---------- */
{const CINDER_TEXT=['The six spheres are out. The maze is cooler for it, and I owe you more than a blade. There is one more fire in this place, and it is not a fire. It is cold.',
  'Under the maze lies the Underlevel, and in the middle of its black sea, on an island, lies the Black Swill. A great black jelly. It is a boss of level 80, and everything that has gone near it has been eaten. The dark insects are children beside it.',
  'I will not send you down there blind. You will need lots of gear and lots of potions: healing to keep four people alive, mana to keep the spells going, and an escape potion in every pack. You will need a boat, for the island is in open water. Open the map of the Underlevel once you have taken the job. It will show where the Black Swill lies, and the way from the nearest dock.'];
  const wrap=function(orig){return function(d){
    if(qSt('hgsph')==='done'){
      if(qSt('bsw1')===null)return say(CINDER_TEXT[0],[['Go on.',()=>say(CINDER_TEXT[1],[['Go on.',()=>say(CINDER_TEXT[2],[['We will kill it.',()=>{qAccept('bsw1');G.flags.bswKnown=1;return say('Then go carefully. Take the ladders down, find a boat, and cross the black water to the island. Level 80, remember. If it goes badly, drink the escape potion and come back for more potions. The Swill will still be there.',[BYE])}],['We need to prepare first.',()=>say('Then prepare. Lots of gear, lots of potions. I will be here.',[BYE])]])],['Not now.',()=>null]])],['Not now.',()=>null]]);
      if(qSt('bsw1')==='active'&&!G.flags.bswDead)return say('The Black Swill lies on the island in the middle of the Black Sea, in the Underlevel. The map shows the place. Level 80. Lots of gear, lots of potions, a boat. Go well.',[BYE]);
      if(qSt('bsw1')==='done')return say('The black water is clean. I did not think I would live to see it. The maze is cooler, and the Underlevel too.',[BYE])}
    return orig.apply(this,arguments)}};
  if(NPCS.hgd_cinder)NPCS.hgd_cinder.root=wrap(NPCS.hgd_cinder.root);
  if(KH_KEEPERS.hgd_cinder)KH_KEEPERS.hgd_cinder.root=NPCS.hgd_cinder?NPCS.hgd_cinder.root:wrap(KH_KEEPERS.hgd_cinder.root);
  QGIVER.hgd_cinder=['hgsph','bsw1']}
/* ---------- the chamber on the island ---------- */
function bswChamber(L){
  if(L._bsw)return;const o=L._hgdo;if(!o||!o.island)return;
  const W=201,H=201,I=o.island,cx=I.cx,cy=I.cy,R=9.6,rows=L.rows.map(r=>r.split('')),fm=L.fmap.map(r=>r.split('')),ix=(x,y)=>y*W+x;
  const edge=(x,y)=>{const a=Math.atan2(y-cy,x-cx);return R+.9*Math.sin(a*3+.7)+.6*Math.sin(a*5+1.9)+.4*Math.sin(a*8)};
  const land=new Set();
  for(let y=cy-13;y<=cy+13;y++)for(let x=cx-13;x<=cx+13;x++){if(x<8||y<8||x>=W-8||y>=H-8)continue;const d=Math.hypot(x-cx,y-cy),r=edge(x,y);if(d>=r)continue;
    const ch=rows[y][x];if(ch==='.'&&!o.wm[ix(x,y)]&&!o.isle[ix(x,y)])continue; // never cut into a corridor
    rows[y][x]='.';fm[y][x]=d>r-1.5?'3':d<2.4?'3':'2';o.wm[ix(x,y)]=0;o.sec[ix(x,y)]=0;o.isle[ix(x,y)]=1;land.add(x+','+y)}
  // six pillars in a ring, standing off the middle
  const pil=[];for(let k=0;k<6;k++){const a=k*Math.PI/3,px=Math.round(cx+Math.cos(a)*6.6),py=Math.round(cy+Math.sin(a)*6.6);if(land.has(px+','+py)){rows[py][px]='#';fm[py][px]='0';pil.push([px,py])}}
  L.rows=rows.map(r=>r.join(''));L.fmap=fm.map(r=>r.join(''));
  L.enemies=L.enemies.filter(e=>!land.has(e.x+','+e.y));
  // the chest moves behind the boss, to the north shore
  const ch=L.decor.find(d=>d.k==='chest'&&d.x===I.chest[0]&&d.y===I.chest[1]);
  if(ch){let ty=cy-7;while(ty>cy-10&&!land.has(cx+','+ty))ty++;ch.x=cx;ch.y=ty;I.chest=[cx,ty]}
  // the boss, once
  if(!(G&&G.flags&&G.flags.bswDead)&&!L.enemies.some(e=>e.t==='bsw'))L.enemies.push({t:'bsw',x:cx,y:cy});
  // the landing at the south shore, and a boat moored just off it
  let ly=cy;for(let y=cy;y<=cy+13;y++)if(land.has(cx+','+y))ly=y;
  const wy=ly+1,boat=[cx,wy];if(o.wm[ix(cx,wy)]===1){o.boats.push(boat);L.decor.push({k:'yar_boat_row',x:cx,y:wy,block:false,walk:true,deco:true,sc:1.7,bob:-.22})}
  I.r=R;I.cells=I.cells.concat([...land].map(s=>s.split(',').map(Number)));
  L._bsw={cx,cy,R,pillars:pil,landing:{x:cx,y:ly,f:DIRS.findIndex(d=>d[0]===0&&d[1]===-1)},boat,boatIdx:o.boats.length-1};
  L.mapNames=(L.mapNames||[]).concat([{t:'The Black Swill',x:cx,y:cy,k:'place'}])}
{const _b=hgduBuild;hgduBuild=function(){const had=!!LEVELS[HGDU.ID];_b.apply(this,arguments);const L=LEVELS[HGDU.ID];if(!had&&L&&L._hgdo)try{bswChamber(L)}catch(e){console.error('bswChamber',e)}}}
// a boat for the island joins the saved list of boats (an older save made before it existed has one fewer)
{const _u=update;update=function(dt){try{if(LEVEL===BSW.ID&&G.state==='play'){const L=LEVELS[BSW.ID],F=G.flags;
    if(L&&L._bsw&&F.hgdOcean&&F.hgdOcean.boats&&F.hgdOcean.boats.length<=L._bsw.boatIdx&&L._hgdo.boats.length>L._bsw.boatIdx){while(F.hgdOcean.boats.length<L._hgdo.boats.length)F.hgdOcean.boats.push(L._hgdo.boats[F.hgdOcean.boats.length].slice())}
    if(F.bswDead&&G.enemies.some(e=>/^bsw/.test(e.t)&&e.hp>0))for(const e of G.enemies)if(/^bsw/.test(e.t)&&e.hp>0){e.hp=0;e.dying=0} // it does not come back
  }}catch(e){}return _u.apply(this,arguments)}}
/* ---------- how it fights ---------- */
function bswFree(e,rad){const out=[];for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++){if(!dx&&!dy)continue;const x=e.x+dx,y=e.y+dy;
    if(cellBlocked(x,y)||enemyAt(x,y)||(x===G.P.x&&y===G.P.y)||(typeof hgoWater==='function'&&hgoWater(x,y)))continue;out.push([x,y,Math.abs(dx)+Math.abs(dy)])}
  out.sort((a,b)=>a[2]-b[2]||Math.random()-.5);return out}
function bswSplit(e){
  const alive=G.enemies.filter(q=>q.t==='bswslime'&&q.hp>0).length,free=bswFree(e,3);let n=0;
  for(let k=0;k<2&&alive+n<3&&k<free.length;k++){addEnemy('bswslime',free[k][0],free[k][1],true);n++}
  if(n){msg('A piece of the Black Swill tears free and crawls toward you.','#b890d8');sfx('growl')}}
function bswSpit(e){
  const st=enemyStat(e.t,e.lvl),def=ENEMY_DEF[e.t];let hit=0;
  msg('The Black Swill heaves and spits a corroding glob across the front line!','#c8a0f0');sfx('screech');G.shake=.4;
  for(const hi of [0,1]){const h=G.heroes[hi];if(!h||!h.alive||h.hp<=0)continue;
    if(Math.random()<enemyHitC(def,hi,e.lvl,e)+.05){let d=Math.max(1,Math.round(rnd(st.dmg[0],st.dmg[1])*1.15));if(typeof armourWard==='function')d=Math.max(1,d-armourWard(hi));
      h.hp-=d;h.hurt=1;hit++;msg('The glob eats into '+HERO_DEF[hi].name+' for '+d+'.','#e8a090');addFloat(portraitX(hi)+19,250,'-'+d,'#b8f060');
      try{if(h.hp>0)afflInflict('poisoned',hi,true)}catch(x){}
      if(h.hp<=0){h.hp=0;h.alive=false;msg(HERO_DEF[hi].name+' has fallen!','#ff8a7a');try{bondFall(hi)}catch(x){}if(G.sel===hi)nextHero()}}
    else msg('The glob splashes past '+HERO_DEF[hi].name+'.','#a09880')}
  return 330}
ENEMY_DEF.bsw.act=e=>{
  if(e.hp<=0)return 0;
  if(e.hp<e.maxhp)e.hp=Math.min(e.maxhp,e.hp+Math.max(1,Math.round(e.maxhp*.0025))); // its open eyes knit it back together a little every round
  e.bswR=(e.bswR||0)+1;
  const d=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);
  if(e.bswR%4===0&&d<=5&&hasLOS(e.x,e.y,G.P.x,G.P.y))return bswSpit(e);
  return 0};
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){
  const boss=!!(e&&e.t==='bsw'&&e.hp>0);
  _he.apply(this,arguments);
  if(!boss)return;
  if(e.hp<=0){try{bswDied(e)}catch(x){console.error('bswDied',x)}return}
  const step=Math.min(9,Math.floor((1-e.hp/e.maxhp)*10));e.bswSplit=e.bswSplit||0;
  while(e.bswSplit<step){e.bswSplit++;try{bswSplit(e)}catch(x){console.error(x)}}}}
/* ---------- its death ---------- */
CUTS.bswDead=()=>[
  {text:'The great black mass shudders. Every one of its red eyes turns toward the roof of the cave, and then, one by one, they go out.'},
  {text:'The Black Swill sags. It runs out of itself like a spilled barrel of tar, down the steps of the island and into the sea, and the sea takes it without a sound.'},
  {text:'The black water thins. It grows clear, and then green, and for the first time in a thousand years a grey light comes down through the rock from somewhere very high above.'},
  {who:hn(1),text:'Do you feel that? The air is moving.'},
  {who:hn(0),text:'It is only water, and it is only light. Hold on to the boat.'},
  {text:'The light grows. It lifts the party off its feet as gently as a hand, and carries it up through the rock, past the ladders and the long dark corridors, and sets it down in the sun.'}];
function bswDied(e){
  const F=G.flags;if(F.bswDead)return;F.bswDead=1;
  for(const q of G.enemies)if(q.t==='bswslime'&&q.hp>0){q.hp=0;q.dying=.4}
  msg('The Black Swill is dead!','#ffd76a');
  for(const id of ['bswmantle','potion6','potion6','potion6']){if(!bagAdd(mkItem(id)))G.items.push({k:id,x:e.x,y:e.y,taken:false})}
  msg('In the slime where it fell lie a Swillhide Mantle and three potions.','#c8a0f0');
  later(1100,()=>startCut('bswDead',bswEnd))}
function bswEnd(){
  const F=G.flags;try{bswQuestEnsure('bsw1');qTurnIn('bsw1')}catch(e){console.error(e)}
  try{bswSurface()}catch(e){console.error('bswSurface',e)}
  const at=bswGateFoot();goToLevel(BSW.SURF,at);G.cut=null;G.talk=null;bswPeace(at);
  for(const h of G.heroes){h.alive=true;if(h.hp<=0)h.hp=Math.ceil(h.max/2)}
  msg('You stand in the great atrium at the top of the maze, in warm light. In the north wall a tall gate is open, and Aldous Wend is waiting.','#e8e0a0')}
/* ---------- the surface: the gate and Aldous ---------- */
function bswPeace(at){ // the party arrives to a quiet atrium: whatever stood within seven squares of the gate has gone, and the party looks at the gate
  for(const e of G.enemies)if(e.hp>0&&Math.abs(e.x-at.x)+Math.abs(e.y-at.y)<=9&&e.t!=='hgdwarden'){e.hp=0;e.dying=0}
  G.P.f=at.f;G.P.angT=(at.f-1)*Math.PI/2;G.C={x:G.P.x,y:G.P.y,a:G.P.angT}}
function bswGateCell(){const L=LEVELS[BSW.SURF];const M=L&&L._hgdm;if(!M)return {x:100,y:1};const top=M.spots.find(s=>s.boss)||{x:100,y:12};return {x:top.x,y:1}}
function bswGateFoot(){const g=bswGateCell(),L=LEVELS[BSW.SURF];let y=g.y+1;if(L)while(y<30&&L.rows[y][g.x]!=='.')y++;return {x:g.x,y:y,f:DIRS.findIndex(d=>d[0]===0&&d[1]===-1)}}
function bswSurface(){ // the gate becomes a gate, and Aldous stands at its foot: patched into the level, so it is the same after a save and a load
  const L=LEVELS[BSW.SURF];if(!L||L._bswGate)return;
  let ch=null;for(let c=0x3b0;c<0x3f0;c++){const s=String.fromCharCode(c);if(!L.chars[s]){ch=s;break}}if(!ch)return;
  const sty='bsw_gate',TM=ohTiles();
  OH_STY[sty]=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:'tex_abbeywall',door:(IMG.art_tex_bsw_gate&&IMG.art_tex_bsw_gate.width)?'art_tex_bsw_gate':'tex_abbeywall',win:'tex_abbeywall',alt:'tex_abbeywall',zoom:1,contrast:1.0,tint:[255,255,255,0]});
  L.chars[ch]=TM.make('door',sty,3.3).gid;try{const tx=TEX[T_TILE[L.chars[ch]]];if(tx&&tx.d&&!tx.e){tx.e=tx.d;LIT_TILES.add(L.chars[ch])}}catch(e){} // the gate glows with the light beyond it
  
  const g=bswGateCell(),row=L.rows[g.y].split('');row[g.x]=ch;L.rows[g.y]=row.join('');
  L._bswGate={x:g.x,y:g.y};
  const f=bswGateFoot(),open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&!L.decor.some(d=>d.x===x&&d.y===y);
  const ax=[f.x-2,f.x+2,f.x-3,f.x+3].find(x=>open(x,f.y))||f.x-2;
  L.decor.push({k:'hg_wizard',x:ax,y:f.y,block:false,walk:true,npc:'bsw_aldous',sc:1});
  if(G.decor&&G.decor!==L.decor&&LEVEL===BSW.SURF){G.decor.push(L.decor[L.decor.length-1])}}
{const _l=loadLevel;loadLevel=function(n){
  if(n===BSW.SURF&&G.flags&&G.flags.bswDead){if(!LEVELS[n]&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error(e)}try{bswSurface()}catch(e){console.error('bswSurface',e)}}
  return _l.apply(this,arguments)}}
khNpc('bsw_aldous','Aldous Wend, wizard','hg_wizard',()=>{
  const F=G.flags;
  if(qSt('wk1')===null)return say('Aldous Wend leans on his staff at the foot of the gate, looking up at it. "I came up the moment the water cleared. Look at it. That gate was not here this morning, and I think it was here all the time, hidden behind the Swill. It leads out of the Hollow Lands, all the way out, to the western kingdoms. I have only ever read of them."',[['Where does it lead?',()=>say('"First to a garden. A maze of gardens, if the old books are right: hedges, roses, fountains, and nothing that bites. Beyond that, a town called Wenlock, and past Wenlock I cannot say. Go through, walk the garden to its far end, and see. I will keep the gate warm for you."',[['We will go.',()=>{qAccept('wk1');return say('"Good. Take food and your good boots. The garden is long, and very easy to be lost in, and very pleasant to be lost in."',[BYE])}],['Not yet.',()=>null]])],BYE]);
  if(qSt('wk1')==='active')return say('"The gate stands open, there in the north wall. Walk through, and keep walking until the hedges end. The garden is a maze, but it is a kind one."',[BYE]);
  if(qSt('wk2')==='active')return say('"Wenlock lies at the far end of the garden. Go on."',[BYE]);
  return say('"Wenlock, and the western kingdoms beyond it. I envy you. Go and look, and write to me."',[BYE])},{q:['wk1']});
/* walking into the gate */
{const _db=desertBump;desertBump=function(nx,ny,g){
  try{if(LEVEL===BSW.SURF){const L=LEVELS[BSW.SURF];if(L&&L._bswGate&&L._bswGate.x===nx&&L._bswGate.y===ny&&G.flags.bswDead){sfx('locked');
      hgduPrompt('A tall gate stands open in the wall, and beyond it a gravel path runs between green hedges in full sun. Do you want to go through, into the Maze of Gardens?',[['Go through.',()=>{G.talk=null;sfx('door');bswThroughGate();return null}],['Not yet.',()=>null]]);return true}}}catch(e){console.warn('bsw gate',e)}
  return _db.apply(this,arguments)}}
function bswThroughGate(){
  try{if(!LEVELS[WK.GARDEN]&&KH_LAZY[WK.GARDEN])KH_LAZY[WK.GARDEN]()}catch(e){console.error('garden build',e)}
  if(!LEVELS[WK.GARDEN]||!WK.GSTART){msg('The gate is open, but the gardens beyond are not ready yet.','#d09a80');return}
  const F=G.flags;F.wkGate=1;if(qSt('wk1')===null)bswQuestEnsure('wk1');
  goToLevel(WK.GARDEN,WK.GSTART);G.cut=null;msg('You step through the gate into the Maze of Gardens.','#c8e8a0')}
/* ---------- the map shows where it lies ---------- */
function bswShown(){const F=G.flags;return F&&!F.bswDead&&(qSt('bsw1')==='active'||F.bswKnown)}
function bswTrans(){const V=MPL&&MPL.view;if(!V||!V.z)return null;const z=V.z,A=V.area;return {z,A,pt:(cx,cy)=>[A.x+(V.X(cx+.5)-V.sx0)*z,A.y+(V.Y(cy+.5)-V.sy0)*z]}}
function bswSkull(c,x,y,s,col){c.save();c.translate(x,y);c.fillStyle=col;c.strokeStyle='#14060a';c.lineWidth=s*.14;c.beginPath();c.arc(0,-s*.12,s*.56,Math.PI,0);c.lineTo(s*.42,s*.34);c.lineTo(-s*.42,s*.34);c.closePath();c.fill();c.stroke();
  c.fillStyle='#14060a';c.beginPath();c.arc(-s*.2,-s*.1,s*.15,0,6.3);c.arc(s*.2,-s*.1,s*.15,0,6.3);c.fill();c.fillRect(-s*.2,s*.14,s*.4,s*.2);c.restore()}
{const _do=drawOverview;drawOverview=function(){const r=_do.apply(this,arguments);
  try{const L=LEVELS[BSW.ID];if(LEVEL===BSW.ID&&G.overview&&!G.world&&L&&L._bsw&&bswShown()&&(G.hgdView|0)===5){const T=bswTrans();if(T){const b=L._bsw,[px,py]=T.pt(b.cx,b.cy),A=T.A;
      ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();
      // the way: a dashed line from the nearest dock across the water
      const dk=L._hgdo.docks&&L._hgdo.docks[0];if(dk){const [dx,dy]=T.pt(dk.wx,dk.wy),[ex,ey]=T.pt(b.landing.x,b.landing.y+1);ctx.strokeStyle='#e8c04a';ctx.lineWidth=1.3;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
        ctx.font='bold 5.6px '+FUI;ctx.textAlign='center';ctx.lineWidth=2.2;ctx.strokeStyle='rgba(5,1,2,.9)';ctx.strokeText('Dock',dx,dy+11);ctx.fillStyle='#e8c04a';ctx.fillText('Dock',dx,dy+11)}
      const pulse=.5+.5*Math.sin(G.time*3),r0=T.z*5+8+pulse*2;
      ctx.strokeStyle='rgba(255,210,70,'+(.55+.4*pulse)+')';ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(px,py,r0,0,6.3);ctx.stroke();ctx.strokeStyle='rgba(200,30,20,.9)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(px,py,r0-3,0,6.3);ctx.stroke();
      bswSkull(ctx,px,py,9,'#efe6cc');
      ctx.font='bold 7px '+FUI;ctx.textAlign='center';ctx.lineJoin='round';ctx.lineWidth=2.6;ctx.strokeStyle='rgba(5,1,2,.95)';ctx.strokeText('The Black Swill',px,py+r0+8);ctx.fillStyle='#ffd24a';ctx.fillText('The Black Swill',px,py+r0+8);
      ctx.restore()}}}catch(e){}
  return r}}
{const _m=drawMinimap;drawMinimap=function(x,y,w,h){_m.apply(this,arguments);
  try{const L=LEVELS[BSW.ID];if(LEVEL===BSW.ID&&G.state==='play'&&L&&L._bsw&&bswShown()){const cs=4.6*MMZ(),ox=x+w/2-(G.C.x+.5)*cs,oy=y+h/2-(G.C.y+.5)*cs,b=L._bsw,px=ox+(b.cx+.5)*cs,py=oy+(b.cy+.5)*cs;
    if(px>x-12&&px<x+w+12&&py>y-12&&py<y+h+12){ctx.save();ctx.beginPath();ctx.rect(x+2,y+2,w-4,h-4);ctx.clip();const pulse=.5+.5*Math.sin(G.time*3);
      ctx.strokeStyle='rgba(255,210,70,'+(.6+.4*pulse)+')';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(px,py,cs*5.5,0,6.3);ctx.stroke();bswSkull(ctx,px,py,Math.max(7,cs*2.2),'#efe6cc');ctx.restore()}}}catch(e){}}}
/* ---------- the people talk about it ---------- */
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('Cinder says there is something in the middle of the black sea under the maze, on the island, that has been there since before the maze. Whatever it is, it is level eighty, and I am staying up here.');
/* ---------- the test link: ?town=blackswill&lvl=80 ---------- */
function bswSpot(){
  const F=G.flags;try{if(typeof hgBuild==='function'){hgBuild();hgdBuild()}if(!LEVELS[BSW.ID]&&KH_LAZY[BSW.ID])KH_LAZY[BSW.ID]()}catch(e){console.error(e)}
  const L=LEVELS[BSW.ID];
  if(!F.bswJump){F.bswJump=1;G.quests.hgsph={st:'done',base:0};
    for(const [id,n] of [['potion5',6],['potion6',4],['hgescape',3],['torch',4]])for(let k=0;k<n;k++)bagAdd(mkItem(id));
    if(new URLSearchParams(location.search).get('dead')==='1'){F.bswDead=1;G.quests.bsw1={st:'done',base:0}}else{G.quests.bsw1={st:'active',ord:1,base:0};F.bswKnown=1}}
  if(F.bswDead){bswSurface();const g=bswGateFoot();return [BSW.SURF,g.x,g.y,g.f]}
  const b=L&&L._bsw;return b?[BSW.ID,b.landing.x,b.landing.y,b.landing.f]:[BSW.ID,L?L.start.x:100,L?L.start.y:100,0]}
