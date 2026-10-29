/* ==========================================================================
   THE PALE SPIRE: GOTHIC GEAR (prefix pgr / PGR; item ids pg_*). 26 unique pieces of level 100 gear, the strongest in the game: 12 weapons (two each of Sword, Axe, Mace, Bow, Staff,
   Dagger), 10 armour pieces (two each of head, chest, arms, legs, shield) and 4 rings. Every piece lies behind a boss, a quest, a riddle chest or a key chest, two on each built level
   and one or two outside (the Approach 9720 and the Court 9730). This file hooks from outside: it edits no level file. Plan, table and the list for the future floors: tools/PALE_SPIRE_GEAR.md.
   How a piece is found:
     boss   the first time the boss dies it drops the piece (hurtEnemy hook, message)
     quest  the item id is appended to QUESTS[q].reward.items (and a full bag drops it on the ground instead of losing it)
     riddle a chest in a dead end of the level (found by pgrSpot after the level is built); talk to it, answer a question about the castle; a wrong answer wakes two creatures, the chest stays shut
     key    a chest in a dead end that opens only for an item found elsewhere on the level
   State: G.flags.psp.pg = {got:{itemId:1}} (a piece is given once). To add a piece for a new floor, add a row to PGR.PLACE and an item to PGR_ITEMS (see the notes).
   ========================================================================== */
const PGR={};
/* palette: dark violet, black, antique brass, verdigris, bone */
const PGR_C={vio:'#4a2a6a',blk:'#1a1624',brass:'#b08d3c',verd:'#3f8f7a',bone:'#d8d0b8'};
const PGR_ITEMS={};
function pgrItem(id,o){
  const it=Object.assign({k:'weapon',price:0,lvl:100,rar:1,gear:1},o);it.id=id;it.pg=1;
  if(it.k==='weapon'){it.hit=it.hit===undefined?.2:it.hit;if(it.t==='Bow')it.ranged=7;it.d=it.d+' Needs level 100.'}
  else it.d=it.d+' Needs level 100.';
  ITEMDEF[id]=it;PGR_ITEMS[id]=it;return it}
/* ---------- weapons ---------- */
pgrItem('pg_tollblade',{n:'Tollbell Greatsword',t:'Sword',ic:'sword',c:PGR_C.brass,dmg:[760,880],req:{str:78},eff:{bossdmg:.4,stun:.15},dbl:.2,sw:.7,
  d:"A greatsword with a blade of bell bronze that rings low when it strikes, carried by the Gate Captain. About one blow in seven knocks the foe down, one blow in five does double damage, and bosses take 40% more."});
pgrItem('pg_weepingedge',{n:'Blade of the Weeping Saint',t:'Sword',ic:'sword',c:PGR_C.vio,dmg:[790,910],req:{str:78},eff:{bleed:[.5,8,60],exec:[.35,3]},dbl:.18,pas:{lifesteal:.04},sw:.5,
  d:"A thin black blade, with a saint's face carved in the hilt and a drop of green on the corner of each eye. Wounds bleed hard, a foe under 35% health takes three times the blow, and the wielder heals 4% of the melee damage dealt."});
pgrItem('pg_tearmaul',{n:'Tearstone Maul',t:'Mace',ic:'mace',c:PGR_C.bone,dmg:[600,700],req:{str:76},eff:{stun:.3,bossdmg:.35,shock:.2},dbl:.18,sw:.9,
  d:"A hammer of grey stone that weeps clear water from its head after every blow, taken from the Weeping Colossus. Three blows in ten knock the foe down, one blow in five shakes the ground and throws down every foe close by, and bosses take 35% more."});
pgrItem('pg_reckoning',{n:"The Steward's Reckoning",t:'Mace',ic:'mace',c:PGR_C.brass,dmg:[620,720],req:{str:76},eff:{vuln:[.4,5],bossdmg:.45,daze:.3},dbl:.2,sw:.85,
  d:"An iron mace on a chain, with a brass head cast in the shape of a bunch of keys. The Pale Steward counted everything with it. Four blows in ten leave the foe open to harm for five turns, three in ten leave it dazed, and bosses take 45% more."});
pgrItem('pg_gargcleaver',{n:'Gargoyle-Wing Cleaver',t:'Axe',ic:'axe',c:PGR_C.verd,dmg:[420,490],req:{str:76},eff:{cleave:1,bleed:[.5,6,60],bossdmg:.4},dbl:.22,sw:.8,
  d:"A broad axe whose blade is one stone wing of Mother Gargoyle, edged and set on a black haft. Each blow carries on into the foe behind, wounds bleed, and bosses take 40% more."});
pgrItem('pg_gaolheadsman',{n:"Drowned Gaoler's Headsman",t:'Axe',ic:'axe',c:PGR_C.blk,dmg:[425,490],req:{str:76},eff:{cleave:1,exec:[.4,4],bossdmg:.5},dbl:.2,sw:.8,
  d:"A black headsman's axe, green with cistern slime, that the Drowned Gaoler used on the prisoners. Each blow carries on into the foe behind, a foe under 40% health takes four times the blow, and bosses take 50% more."});
pgrItem('pg_falconbow',{n:"Falconer's Last Bow",t:'Bow',ic:'bow',c:PGR_C.bone,dmg:[680,780],req:{dex:76},eff:{pierce:1,double:.4},dbl:.18,sw:.42,
  d:"A bow of pale horn and black raven feathers, the last bow of the Sovereign's falconer. Shoots 7 squares, its arrows pass through to the foe behind, and four shots in ten send a second arrow."});
pgrItem('pg_winchbow',{n:'Portcullis-Wire Bow',t:'Bow',ic:'bow',c:PGR_C.brass,dmg:[700,800],req:{dex:76},eff:{pierce:1,vuln:[.35,4],bossdmg:.4},dbl:.2,sw:.45,
  d:"A bow with limbs of black iron, strung with winch wire from the gatehouse portcullis. Shoots 7 squares, its arrows pass through to the foe behind, a hit often leaves the foe open to harm, and bosses take 40% more."});
pgrItem('pg_briarstaff',{n:'Briarwood Rood Staff',t:'Staff',ic:'staff',c:PGR_C.verd,dmg:[270,320],magic:180,req:{int:76},eff:{bossdmg:.5,daze:.4,shock:.2},pas:{spellPct:.12,mpRegen:.8},sw:.44,
  d:"A staff of living briar with a single pale rose at the tip, cut from the Thorn Warden. Adds 180 to the power of spells, spell damage +12%, tiredness fades faster, bosses take 50% more, and foes reel dazed."});
pgrItem('pg_candlestaff',{n:'Staff of the Last Candle',t:'Staff',ic:'staff',c:PGR_C.vio,dmg:[285,335],magic:192,req:{int:76},eff:{bossdmg:.6,daze:.35},pas:{spellPct:.15,regen:.6,mpRegen:1},sw:.44,
  d:"A tall black staff topped with a candle that never burns down. The Chaplain lit it for the last service. Adds 192 to the power of spells, spell damage +15%, wounds close steadily, tiredness fades faster, bosses take 60% more, and foes reel dazed."});
pgrItem('pg_keyblade',{n:"Porter's Keyblade",t:'Dagger',ic:'dagger',c:PGR_C.brass,dmg:[470,540],req:{dex:74},eff:{bleed:[.6,8,50],exec:[.4,4]},dbl:.3,sw:.3,
  d:"A dagger forged from the oldest key of the gatehouse, with the wards of the lock for a blade. Wounds bleed hard, a foe under 40% health takes four times the blow, and three blows in ten do double damage."});
pgrItem('pg_questioner',{n:"The Questioner's Hook",t:'Dagger',ic:'dagger',c:PGR_C.blk,dmg:[490,560],req:{dex:74},eff:{bleed:[.5,6,70],vuln:[.4,5],bossdmg:.35},dbl:.28,pas:{crit:.08},sw:.3,
  d:"A short black hook-knife from the Question Room, worn smooth by the hands that used it. Wounds bleed deeply, four blows in ten leave the foe open to harm, bosses take 35% more, and double hits come 8% more often."});
/* ---------- armour ---------- */
pgrItem('pg_ravenhelm',{n:'Raven-Beak Helm',k:'head',t:'Helm',ic:'head',c:PGR_C.blk,armor:32,pas:{dodge:.09,crit:.08,regen:.8},sw:.4,
  d:"A black helm drawn forward into a long raven's beak, with two slits for the eyes. Armour 32, enemies miss 9% more, double hits come 8% more often, and wounds close steadily."});
pgrItem('pg_candlecrown',{n:'Crown of a Hundred Candles',k:'head',t:'Helm',ic:'head',c:PGR_C.brass,armor:33,pas:{dmgPct:.1,spellPct:.1,mpRegen:.9},sw:.4,
  d:"A brass crown with a hundred small cups for candles, black with old wax. Armour 33, all damage +10%, spell damage +10%, and tiredness fades faster."});
pgrItem('pg_cathedralplate',{n:'Plate of the Black Cathedral',k:'chest',t:'Chest',ic:'chest',c:PGR_C.vio,armor:84,pas:{ward:30,thorns:14,regen:.9,dodge:.08},sw:.55,
  d:"Black plate with pointed arches worked into the breast and a rose window of violet glass over the heart, from the armour on the Grand Stair. Armour 84, every blow on the wearer is 30 lighter, every enemy that strikes takes 14 damage, enemies miss 8% more, and wounds close steadily."});
pgrItem('pg_pitplate',{n:'Reliquary Plate of the Pit',k:'chest',t:'Chest',ic:'chest',c:PGR_C.bone,armor:86,pas:{lifesteal:.06,ward:26,regen:1.1,secondWind:.4},sw:.55,
  d:"Pale plate ribbed like a cage of bones, with small reliquary boxes set on the breast. It came out of the pit under the Oubliette. Armour 86, heals 6% of the melee damage dealt, every blow on the wearer is 26 lighter, wounds close steadily, and once per 30 rounds below a quarter health it heals 40%."});
pgrItem('pg_harrowarms',{n:"Road Warden's Vambraces",k:'arms',t:'Arms',ic:'arms',c:PGR_C.verd,armor:20,pas:{dmgPct:.06,thorns:10,ward:10},sw:.4,
  d:"Grey vambraces gone green at the seams, the last gear of the Road Wardens. Armour 20, all damage +6%, every enemy that strikes takes 10 damage, and every blow on the wearer is 10 lighter."});
pgrItem('pg_falconarms',{n:"Falconer's Mourning Gauntlets",k:'arms',t:'Arms',ic:'arms',c:PGR_C.blk,armor:21,pas:{crit:.07,dodge:.07,dmgPct:.05},sw:.4,
  d:"Black gauntlets with a thick leather cuff on the left, for a hawk to perch on. Armour 21, double hits come 7% more often, enemies miss 7% more, and all damage +5%."});
pgrItem('pg_pilgrimlegs',{n:"Pilgrim's Mourning Greaves",k:'legs',t:'Legs',ic:'legs',c:PGR_C.vio,armor:25,pas:{regen:1,dodge:.08,ward:12},sw:.4,
  d:"Dark violet greaves, worn through at the knees from a long walk on the cold road. Armour 25, wounds close quickly, enemies miss 8% more, and every blow on the wearer is 12 lighter."});
pgrItem('pg_cobweblegs',{n:'Cobweb-Mail Leggings',k:'legs',t:'Legs',ic:'legs',c:PGR_C.bone,armor:26,pas:{dodge:.1,thorns:9,mpRegen:.6},sw:.35,
  d:"Leggings of fine silver rings that are webbed over with grey spider silk, which never tears. Armour 26, enemies miss 10% more, every enemy that strikes takes 9 damage, and tiredness fades faster."});
pgrItem('pg_votiveshield',{n:'Votive Shield of the Nine Tokens',k:'shield',t:'Shield',ic:'shield',c:PGR_C.brass,armor:35,pas:{ward:20,thorns:16,dodge:.06},sw:.5,
  d:"A tall pointed shield, hung with nine small pilgrim tokens on brass chains. Armour 35, every blow on the wearer is 20 lighter, every enemy that strikes takes 16 damage, and enemies miss 6% more."});
pgrItem('pg_dawnshield',{n:'Bulwark of the Last Dawn',k:'shield',t:'Shield',ic:'shield',c:PGR_C.vio,armor:36,pas:{ward:24,secondWind:.4,thorns:12,regen:.7},sw:.5,
  d:"A black shield with a pale sunrise cut into the face, made for Sir Edrik Stamford's house. Armour 36, every blow on the wearer is 24 lighter, every enemy that strikes takes 12 damage, wounds close steadily, and once per 30 rounds below a quarter health it heals 40%."});
/* ---------- rings ---------- */
pgrItem('pg_cairnring',{k:'ring',n:'Cairn-Stone Band',t:'Ring',ic:'ring',c:PGR_C.bone,pas:{ward:26,regen:1,dodge:.08},hp:120,str:8,sw:.1,
  d:"A plain ring cut from one grey stone of the pilgrims' cairn. Adds 8 Strength and 120 health, every blow on the wearer is 26 lighter, enemies miss 8% more, and wounds close steadily."});
pgrItem('pg_briarring',{k:'ring',n:'Briar Rose Band',t:'Ring',ic:'ring',c:PGR_C.verd,pas:{ward:27,dodge:.09,regen:1.2,lifesteal:.03},hp:110,dex:8,sw:.1,
  d:"A ring of twisted green wire with one small white rose. It still has thorns. Adds 8 Dexterity and 110 health, every blow on the wearer is 27 lighter, enemies miss 9% more, wounds close quickly, and the wearer heals 3% of the melee damage dealt."});
pgrItem('pg_silencering',{k:'ring',n:'Ring of the Silent Question',t:'Ring',ic:'ring',c:PGR_C.blk,pas:{ward:28,crit:.08,dmgPct:.07},hp:130,str:9,sw:.1,
  d:"A heavy black ring with no mark at all on the inside, the only thing that the gaolers never made a prisoner answer. Adds 9 Strength and 130 health, every blow on the wearer is 28 lighter, double hits come 8% more often, and all damage +7%."});
pgrItem('pg_bellring',{k:'ring',n:'Drowned Bell Ring',t:'Ring',ic:'ring',c:PGR_C.verd,pas:{ward:30,mpRegen:1.1,regen:1,thorns:10},hp:140,int:10,sw:.1,
  d:"A small bell of green bronze on a ring band. It rings under water, and nothing hears it ring twice. Adds 10 Intelligence and 140 health, every blow on the wearer is 30 lighter, every enemy that strikes takes 10 damage, wounds close steadily, and tiredness fades faster."});
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push(...Object.keys(PGR_ITEMS));   // painted icons: assets/icn_<id>.png (tools/PS_GEAR_ICONS.md)
/* ---------- where every piece lies: [item, level, how, reference] ---------- */
PGR.PLACE=[
  ['pg_pilgrimlegs',9720,'riddle','pgr_c9720r'],['pg_cairnring',9720,'key','pgr_c9720k'],
  ['pg_tollblade',9721,'boss','psgatecaptain'],['pg_ravenhelm',9721,'riddle','pgr_c9721r'],
  ['pg_winchbow',9722,'key','pgr_c9722k'],['pg_harrowarms',9722,'quest','psq35'],
  ['pg_votiveshield',9723,'quest','psq1'],['pg_keyblade',9723,'quest','psq2'],
  ['pg_tearmaul',9730,'boss','pscolossus'],['pg_gargcleaver',9730,'boss','psgargmother'],
  ['pg_briarring',9731,'quest','psq4'],['pg_briarstaff',9731,'boss','psthornwarden'],
  ['pg_falconbow',9732,'key','pgr_c9732k'],['pg_falconarms',9732,'quest','psq5'],
  ['pg_cathedralplate',9740,'boss','psstairwarden'],['pg_candlecrown',9740,'riddle','pgr_c9740r'],
  ['pg_reckoning',9750,'boss','psteward'],['pg_cobweblegs',9750,'riddle','pgr_c9750r'],
  ['pg_weepingedge',9760,'boss','pssacristan'],['pg_candlestaff',9760,'quest','psq23'],
  ['pg_questioner',9780,'boss','psquestioner'],['pg_silencering',9780,'riddle','pgr_c9780r'],
  ['pg_gaolheadsman',9790,'boss','psdrowngaoler'],['pg_bellring',9790,'quest','psq33'],
  ['pg_pitplate',9800,'boss','pshunger'],['pg_dawnshield',9800,'quest','psq37']];
/* state and giving */
const pgrF=()=>{const F=pspF();if(!F.pg)F.pg={got:{}};if(!F.pg.got)F.pg.got={};return F.pg};
const pgrGot=id=>!!pgrF().got[id];
function pgrHas(id){
  if(bagCount(id)>0)return true;
  for(const h of G.heroes||[])if(h&&h.eq)for(const k in h.eq)if(h.eq[k]&&h.eq[k].id===id)return true;
  return false}
function pgrPut(id){if(!bagAdd(mkItem(id)))G.items.push({k:id,x:Math.round(G.P.x),y:Math.round(G.P.y),taken:false})}
/* give a piece once; false if it was given before */
function pgrGive(id,line){
  const F=pgrF();if(F.got[id]||!ITEMDEF[id])return false;
  F.got[id]=1;pgrPut(id);
  try{msg(line||('You find '+ITEMDEF[id].n+'.'),'#ffe36a');sfx('win')}catch(e){}
  return true}
const pgrStatus=()=>PGR.PLACE.map(p=>({item:p[0],level:p[1],how:p[2],ref:p[3],got:pgrGot(p[0])}));
/* ---------- bosses: the first death drops the piece ---------- */
PGR.boss={};
for(const [it,lv,how,ref] of PGR.PLACE)if(how==='boss')PGR.boss[ref]=it;
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;const r=_he.apply(this,arguments);
  try{if(was&&e.hp<=0&&PGR.boss[e.t]){const id=PGR.boss[e.t],nm=(ENEMY_DEF[e.t]&&ENEMY_DEF[e.t].name)||'The boss';
    pgrGive(id,nm+' falls, and leaves '+ITEMDEF[id].n+' on the stones. You take it.')}}catch(x){console.error('pgr boss',x)}
  return r}}
/* ---------- quests: the reward list gets the piece; a full bag drops it on the ground instead of losing it ---------- */
for(const [it,lv,how,ref] of PGR.PLACE)if(how==='quest'&&typeof QUESTS!=='undefined'&&QUESTS[ref]){
  const r=QUESTS[ref].reward||(QUESTS[ref].reward={});r.items=r.items||[];if(!r.items.includes(it))r.items.push(it)}
{const _qt=qTurnIn;qTurnIn=function(id){const r=_qt.apply(this,arguments);
  try{if(r&&QUESTS[id]&&QUESTS[id].reward)for(const it of (QUESTS[id].reward.items||[]))if(PGR_ITEMS[it]){
    pgrF().got[it]=1;if(!pgrHas(it)&&!G.items.some(q=>q.k===it&&!q.taken))pgrPut(it)}}catch(e){console.error('pgr quest',e)}
  return r}}
/* ---------- the chests ---------- */
PGR.CHESTS={
  pgr_c9720r:{lv:9720,kind:'riddle',foe:['psguard','pshalberd'],
    intro:"A chest of black wood stands in a hollow behind the dead trees. A brass plate on the lid says: A WRONG ANSWER WAKES THE HOUSE. THE PILGRIMS LEFT SMALL THINGS ON THE CAIRN, AND THEY LIE ABOUT THE ROAD AND THE BARBICAN. HOW MANY?",
    ans:[['Seven.',0],['Nine.',1],['Twelve.',0]]},
  pgr_c9720k:{lv:9720,kind:'key',key:'pstoken',alt:()=>qSt('psq1')==='done',btn:"Press a pilgrim's token into the hollow.",
    intro:"A small chest of grey stone stands at the foot of a dead tree, with a cairn carved on the lid. In the middle of the cairn is a hollow the size of a pilgrim's token.",
    miss:"You have no pilgrim's token. The porter says that nine of them lie about the road and the barbican.",
    ok:"You press a token into the hollow, and the lid swings up."},
  pgr_c9721r:{lv:9721,kind:'riddle',foe:['pshalberd','psguard'],
    intro:"A black chest stands in a corner of the guardroom, with a brass plate on the lid: A WRONG ANSWER WAKES THE HOUSE. THE DEAD MAN IN THE WINCH LOFT WORE A GREY CLOAK. WHAT WAS HE?",
    ans:[['A priest of the chapel.',0],['A cook of the kitchens.',0],['A Road Warden.',1]]},
  pgr_c9722k:{lv:9722,kind:'key',key:'pshorn',btn:"Sound the Warden's Horn at the chest.",
    intro:"A chest of iron-bound black wood stands among the winch gear, with a bell cast on the lid. The lock is the mouth of a horn. Only a horn sounded at it will open it.",
    miss:"You have no horn. A Road Warden's horn lies on the table in this loft.",
    ok:"The horn sounds, low and long, and the lock turns."},
  pgr_c9732k:{lv:9732,kind:'key',key:'pswhistle',btn:"Blow the Hound Master's whistle.",
    intro:"A chest stands at the back of the kennels, with a hound carved on the lid. A small silver mouthpiece is set into the lock. It wants a whistle.",
    miss:"You have no whistle. The Hound Master carries one, out on the east lawn.",
    ok:"The whistle sounds, thin and high, and the lock springs open."},
  pgr_c9740r:{lv:9740,kind:'riddle',foe:['psservant','pscourtier'],
    intro:"A black chest stands in a dead end of the halls, with a brass plate on the lid: A WRONG ANSWER WAKES THE HOUSE. WHICH BIRD IS CUT INTO LADY ISAUDE MARWEN'S SIGNET RING?",
    ans:[['A raven.',0],['A heron.',1],['A falcon.',0]]},
  pgr_c9750r:{lv:9750,kind:'riddle',foe:['pscook','pskrat'],
    intro:"A black chest stands behind the stores, with a brass plate on the lid: A WRONG ANSWER WAKES THE HOUSE. THE FOOTMAN SAYS THAT THE PALE STEWARD COUNTS THE SERVANTS, AND WHAT ELSE?",
    ans:[['The candles.',0],['The loaves.',0],['The spoons.',1]]},
  pgr_c9780r:{lv:9780,kind:'riddle',foe:['psturnkey','psflayed'],
    intro:"A black chest stands in a dead end of the gaols, with a brass plate on the lid: A WRONG ANSWER WAKES THE HOUSE. WHAT COLOUR IS THE STRING ROUND THE LID OF HOB GARRICK'S TIN?",
    ans:[['Red.',1],['Blue.',0],['White.',0]]}};
for(const [it,lv,how,ref] of PGR.PLACE)if((how==='riddle'||how==='key')&&PGR.CHESTS[ref])PGR.CHESTS[ref].item=it;
/* ambush: two creatures of the level's kind wake round the party (at most four alive at a time) */
function pgrAmbush(cid){
  const c=PGR.CHESTS[cid],L=LEVELS[LEVEL];if(!c||!L)return 0;
  PGR.amb=(PGR.amb||[]).filter(e=>e.hp>0&&G.enemies.includes(e));if(PGR.amb.length>=4)return 0;
  const types=c.foe.filter(t=>ENEMY_DEF[t]),px=Math.round(G.P.x),py=Math.round(G.P.y);if(!types.length)return 0;
  const bs=new Set(G.decor.filter(d=>d.block&&!d.found).map(d=>d.x+','+d.y)),taken=new Set(G.enemies.filter(e=>e.hp>0).map(e=>Math.round(e.x)+','+Math.round(e.y)));
  let n=0;
  for(let r=2;r<=5&&n<2;r++)for(let dy=-r;dy<=r&&n<2;dy++)for(let dx=-r;dx<=r&&n<2;dx++){
    if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=px+dx,y=py+dy,k=x+','+y;
    if(!L.rows[y]||L.rows[y][x]!=='.'||bs.has(k)||taken.has(k))continue;
    addEnemy(types[n%types.length],x,y,true);const e=G.enemies[G.enemies.length-1];if(e){PGR.amb.push(e);taken.add(k);n++}}
  return n}
function pgrChestTalk(cid,d){
  const c=PGR.CHESTS[cid],it=ITEMDEF[c.item];
  if(pgrGot(c.item))return say('The chest is open and empty. Grey cobwebs hang across the inside of the lid.',[BYE]);
  const open=()=>{pgrGive(c.item,'The lid swings up. Inside, on black cloth, lies '+it.n+'. You take it.');if(d){d.found=true;d.hidden=true;d.block=false}G.talk=null;return null};
  if(c.kind==='key'){
    const have=pgrHas(c.key)||(c.alt&&c.alt());
    return say(c.intro,[[c.btn,()=>have||pgrHas(c.key)||(c.alt&&c.alt())?(msg(c.ok,'#d8d4f0'),open()):say(c.miss,[BYE])],BYE])}
  const opts=c.ans.map(a=>[a[0],()=>{
    if(a[1]){msg('The plate says RIGHT, and the lock turns.','#d8d4f0');return open()}
    const n=pgrAmbush(cid);sfx('growl');G.talk=null;
    msg(n?'The plate says WRONG. The lid stays shut, and the shadows round you stand up.':'The plate says WRONG. The lid stays shut. You may try again.','#ff9a8a');return null}]);
  opts.push(['Leave it.',()=>null]);
  return say(c.intro,opts)}
for(const cid in PGR.CHESTS)khNpc(cid,'A black chest','gy_chest',(d=>()=>pgrChestTalk(cid,d))(null));
/* the chest talks with the decor entry it was called with */
for(const cid in PGR.CHESTS){const c=PGR.CHESTS[cid];NPCS[cid].root=KH_KEEPERS[cid].root=function(d){return pgrChestTalk(cid,d)};
  if(typeof bl3Hide==='function')bl3Hide(c.lv,cid,()=>pgrGot(c.item))}
/* find a dead end for a chest: an open reachable cell with three walls (else two, when the rest stays joined), far from doors, rest rooms, safe zones and the waystone */
function pgrSpot(L,id,taken,minD){
  const W=L.rows[0].length,H=L.rows.length,open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&L.rows[y][x]==='.';
  const blk=new Set(),occ=new Set();
  for(const d of L.decor){occ.add(d.x+','+d.y);if(d.block||(d.npc&&d.solid))blk.add(d.x+','+d.y)}
  for(const e of L.enemies||[])occ.add(Math.round(e.x)+','+Math.round(e.y));for(const i of L.items||[])occ.add(Math.round(i.x)+','+Math.round(i.y));
  const free=(x,y)=>open(x,y)&&!blk.has(x+','+y);
  const doors=[[L.start.x,L.start.y]];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=L.rows[y][x];if(c!=='.'&&L.chars&&KH_DOOR[L.chars[c]])doors.push([x,y])}
  for(const l of PSP.LINKS){if(l.from===id&&l.at)doors.push(l.at);if(l.to===id&&l.land)doors.push(l.land)}
  const P=L._ps||{},zones=(P.safe||[]).slice(),rests=P.rests||[];
  const inz=(z,x,y,e)=>z.rect?(x>=z.x0-e&&x<=z.x1+e&&y>=z.y0-e&&y<=z.y1+e):Math.hypot(x-z.x,y-z.y)<=z.r+e;
  const tele=L.tele||(PSP.TELE&&PSP.TELE.id===id?PSP.TELE.at:null);
  const dist=new Map([[L.start.x+','+L.start.y,0]]),q=[[L.start.x,L.start.y]];
  for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(dist.has(k)||!free(nx,ny))continue;dist.set(k,dist.get(x+','+y)+1);q.push([nx,ny])}}
  const reachCount=skip=>{const seen=new Set([L.start.x+','+L.start.y]),qq=[[L.start.x,L.start.y]];for(let i=0;i<qq.length;i++){const [x,y]=qq[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(seen.has(k)||k===skip||!free(nx,ny))continue;seen.add(k);qq.push([nx,ny])}}return seen.size};
  const cand=[];
  for(const [k,dd] of dist){
    const [x,y]=k.split(',').map(Number);if(occ.has(k)||dd<12)continue;
    if(zones.some(z=>inz(z,x,y,3))||rests.some(z=>inz({rect:1,x0:z.x0,y0:z.y0,x1:z.x1,y1:z.y1},x,y,3)))continue;
    if(tele&&Math.hypot(x-tele[0],y-tele[1])<=10)continue;
    let md=99;for(const o of doors)md=Math.min(md,Math.abs(o[0]-x)+Math.abs(o[1]-y));if(md<6)continue;
    if(taken.some(t=>Math.abs(t[0]-x)+Math.abs(t[1]-y)<(minD||14)))continue;
    const walls=[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>!free(x+a,y+b)).length;if(walls<2)continue;
    cand.push({x,y,walls,sc:(walls>=3?1000:0)+dd+md*3+hash2(x,y,id)*4})}
  cand.sort((a,b)=>b.sc-a.sc);
  const base=reachCount(null);
  for(const c of cand.slice(0,60)){
    if(c.walls>=3)return [c.x,c.y];
    if(reachCount(c.x+','+c.y)===base-1)return [c.x,c.y]}
  return null}
function pgrPlace(id){
  const L=LEVELS[id];if(!L||L._pgr)return;L._pgr=1;const taken=[];
  for(const cid in PGR.CHESTS){const c=PGR.CHESTS[cid];if(c.lv!==id)continue;
    const s=pgrSpot(L,id,taken);if(!s){console.error('pgr: no spot for',cid);continue}
    taken.push(s);c.at=s;
    L.decor.push({k:'gy_chest',x:s[0],y:s[1],block:true,solid:1,npc:cid,deco:false,sc:.95})}}
for(const lv of [...new Set(Object.values(PGR.CHESTS).map(c=>c.lv))]){
  const b=KH_LAZY[lv];if(!b)continue;
  KH_LAZY[lv]=function(){const r=b.apply(this,arguments);try{pgrPlace(lv)}catch(e){console.error('pgr place',lv,e)}return r}}

/* the painted teleport stone (assets/ps tele0 asleep, tele1 to tele4 awake) stands in the castle only: every other stone of the game keeps its own picture */
{let orig=null;const swap=()=>{try{const inC=typeof pspIs==='function'&&pspIs(LEVEL)&&IMG.ps_tele0;
    if(!orig)orig={t:[0,1,2,3,4].map(i=>IMG['tele'+i]),h:NPC_H.teleporter};
    if(inC){for(let i=0;i<5;i++)if(IMG['ps_tele'+i])IMG['tele'+i]=IMG['ps_tele'+i];NPC_H.teleporter=1.0}
    else{for(let i=0;i<5;i++)if(orig.t[i])IMG['tele'+i]=orig.t[i];if(orig.h!==undefined)NPC_H.teleporter=orig.h}}catch(e){console.error('tele swap',e)}};
  const _pt=placeTeleporter;placeTeleporter=function(){swap();return _pt.apply(this,arguments)}}
