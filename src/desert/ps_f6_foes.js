/* ==========================================================================
   THE PALE TOWER (floor 6 of the Pale Spire): the ten bosses of rooms 1 to 10, the Pale King of room 11, and the top-level gear (prefix psf6; item ids pg_f6_*).
   Pictures: 'ps_f6rN_foe' (idle) and 'ps_f6rN_foeA' (attack, swapped in when e.lunge>.2 by the img+'A' convention) for room N; room 11 is the king.
   State: G.flags.psp.f6 = {boss:{1..10: 2 when dead}, king: 2 when dead}. The ten room bosses do not drop gear (the chests in the rooms hold pg_f6_1..10); the king drops four pieces.
   Loaded after ps_court.js, ps_gear.js, ps_f4_moon.js and blight_late.js. The level file ps_f6_tower.js uses PSF6_FOES, PSF6_GEAR and may define psf6Won().
   ========================================================================== */
const PSF6_FOES=['psf6_e1','psf6_e2','psf6_e3','psf6_e4','psf6_e5','psf6_e6','psf6_e7','psf6_e8','psf6_e9','psf6_e10'];
const PSF6_GEAR=['pg_f6_1','pg_f6_2','pg_f6_3','pg_f6_4','pg_f6_5','pg_f6_6','pg_f6_7','pg_f6_8','pg_f6_9','pg_f6_10'];
/* ---------- state and helpers ---------- */
function psf6F(){if(!G.flags)G.flags={};if(!G.flags.psp)G.flags.psp={};const P=G.flags.psp;if(!P.f6)P.f6={};if(!P.f6.boss)P.f6.boss={};return P.f6}
/* the phase a boss has just entered (0 when none): cuts are health fractions in falling order, e.g. [.5] or [.75,.5,.25] */
function psf6Phase(e,cuts){
  const r=e.hp/(e.maxhp||e.hp||1);let ph=0;for(let i=0;i<cuts.length;i++)if(r<cuts[i])ph=i+1;
  if(ph<=(e._ph|0))return 0;e._ph=ph;return ph}
/* call helpers: at most 4 helpers alive, each marked _kid; 'shrink' scales a helper's health (used when a boss is called as a helper) */
function psf6Call(e,types,lvl,shrink){
  let n=0;
  for(const t of types){
    if(!ENEMY_DEF[t])continue;
    if(G.enemies.filter(m=>m._kid&&m.hp>0).length>=4)break;
    const m=bl3Add(t,e.x,e.y,lvl);
    if(m){m._kid=1;if(shrink){m.hp=m.maxhp=Math.max(1,Math.round(m.hp*shrink))}n++}}
  return n}
const psf6Heal=(e,f)=>{e.hp=Math.min(e.maxhp||e.hp,e.hp+Math.round((e.maxhp||e.hp)*f))};
/* ---------- the ten room bosses ---------- */
const psf6B=(n,o)=>pscE('psf6_e'+n,Object.assign({img:'ps_f6r'+n+'_foe',ph:2.1,w:.8,hit:.92,boss:true,aboveParty:0,gold:[0,0],ps:1,psf6:n},o));
Object.assign(ENEMY_DEF,{
  psf6_e1:psf6B(1,{name:'The Gilded Usher',hp:1200,dmg:[22,32],verb:'cuts',xp:900,blind:1,glow:.5}),
  psf6_e2:psf6B(2,{name:'The Organist Wraith',hp:1400,dmg:[24,34],verb:'rakes',xp:1050,fly:true,floatH:.3}),
  psf6_e3:psf6B(3,{name:'The Clock Reaper',hp:1600,dmg:[26,37],verb:'reaps',xp:1200,speed:2}),
  psf6_e4:psf6B(4,{name:'The Reliquary Mimic',hp:1800,dmg:[28,40],verb:'bites',xp:1350}),
  psf6_e5:psf6B(5,{name:'The Weaver',hp:2000,dmg:[21,29],verb:'bites',xp:1500,speed:2}),
  psf6_e6:psf6B(6,{name:'The Mirror Duchess',hp:2200,dmg:[32,45],verb:'slashes',xp:1650}),
  psf6_e7:psf6B(7,{name:'The Thorn Scribe',hp:2400,dmg:[34,47],verb:'stabs',xp:1800,regrow:1}),
  psf6_e8:psf6B(8,{name:'The Weeping Saint',hp:2600,dmg:[36,50],verb:'crushes',xp:1950}),
  psf6_e9:psf6B(9,{name:'The Crown Knight',hp:2900,dmg:[27,37],verb:'cuts',xp:2150}),
  psf6_e10:psf6B(10,{name:"The King's Executioner",hp:3200,dmg:[40,56],verb:'chops',xp:2400})});
/* the room bosses are warm-ups: weaker than first made (less than half the health, 60% of the damage). Only the Pale King is hard. */
for(const t of PSF6_FOES){const d=ENEMY_DEF[t];d.hp=Math.round(d.hp*.42);d.dmg=[Math.round(d.dmg[0]*.6),Math.round(d.dmg[1]*.6)]}
if(typeof NO_VARY!=='undefined')NO_VARY.push(...PSF6_FOES,'psf6_king');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('psf6_king');
if(typeof BOSS_GOLD!=='undefined'){
  const G0=[[5000,6500],[5500,7000],[6000,7500],[6500,8000],[7000,8800],[7500,9400],[8000,10000],[8500,10600],[9000,11300],[9000,12000]];
  PSF6_FOES.forEach((t,i)=>{BOSS_GOLD[t]=G0[i]});BOSS_GOLD.psf6_king=[12000,16000]}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push(
  [/^psf6_e1$/,'shaken',.2],[/^psf6_e2$/,'shaken',.3],[/^psf6_e3$/,'cursed',.2],[/^psf6_e4$/,'bleeding',.25],[/^psf6_e5$/,'poisoned',.35],
  [/^psf6_e6$/,'cursed',.25],[/^psf6_e7$/,'bleeding',.35],[/^psf6_e8$/,'cursed',.3],[/^psf6_e9$/,'shaken',.25],[/^psf6_e10$/,'bleeding',.4],[/^psf6_king$/,'cursed',.3]);
/* deaths: set the room flag, short plain message (a helper copy of a boss does not count) */
const psf6Dead=(n,m,col)=>bl3Kill('psf6_e'+n,e=>{if(e._kid)return;psf6F().boss[n]=2;msg(m,col||'#d8d0f0')});
psf6Dead(1,'The Gilded Usher falls apart. The candle flames go out one by one.');
psf6Dead(2,'The Organist Wraith stops mid-chord and fades. The organ is silent.');
psf6Dead(3,'The Clock Reaper stops. Its hands point to midnight and do not move.');
psf6Dead(4,'The Reliquary Mimic snaps shut and lies still. It is only a box now.');
psf6Dead(5,'The Weaver curls up on her web and does not move again.');
psf6Dead(6,'The Mirror Duchess cracks across the face and breaks into a hundred pieces.');
psf6Dead(7,'The Thorn Scribe drops his pen. His thorns stop growing.');
psf6Dead(8,'The Weeping Saint cracks and goes grey. The tears stop.');
psf6Dead(9,'The Crown Knight kneels, and his crown rolls off. He does not get up.');
psf6Dead(10,"The King's Executioner lets go of his axe and falls. The way up is clear.");
/* phases: each boss has its own trick at 50 percent health or lower */
bl3Hit('psf6_e1',e=>{const p=psf6Phase(e,[.5]);if(!p)return;
  if(psf6Call(e,['psmoth','psmoth'],112))msg('The Usher shakes his head and the candle flames break off. Two swarms of flame-lit moths fill the room.','#ffd88a')});
bl3Hit('psf6_e2',e=>{const p=psf6Phase(e,[.66,.33]);if(!p)return;
  if(psf6Call(e,['psstarmoth','psstarmoth'],113))msg('The Wraith plays a long low chord on the air. Two swarms of star moths answer it.','#c8b8f0')});
bl3Hit('psf6_e3',e=>{const p=psf6Phase(e,[.5,.2]);if(!p)return;
  psf6Heal(e,.12);msg('The Clock Reaper turns its hands back. It mends 12% of its health.','#ffd88a')});
bl3Hit('psf6_e4',e=>{const p=psf6Phase(e,[.5]);if(!p)return;
  if(psf6Call(e,['psgargoyle','psgargoyle'],114))msg('The lid flies open and two small stone shapes jump out of the box.','#d8d0b8')});
bl3Hit('psf6_e5',e=>{const p=psf6Phase(e,[.66,.33]);if(!p)return;
  if(psf6Call(e,['psthornsprite','psthornsprite'],115))msg('The Weaver shakes her web. Two small spiders drop out of it.','#e0e0f0')});
bl3Hit('psf6_e6',e=>{const p=psf6Phase(e,[.66,.33]);if(!p)return;
  if(psf6Call(e,['psmirrorshade','psmirrorshade'],116))msg("Two reflections step out of the Duchess's mirrors and stand beside her.",'#d0e8ff')});
bl3Hit('psf6_e7',e=>{const p=psf6Phase(e,[.5]);if(!p)return;
  psf6Heal(e,.1);if(psf6Call(e,['psthornsprite','psthornsprite'],117))msg('The Scribe writes a line on the air. His wounds close and two thorn sprites climb out of the ink.','#bfe8c8')});
bl3Hit('psf6_e8',e=>{const p=psf6Phase(e,[.66,.33]);if(!p)return;
  psf6Heal(e,.08);if(psf6Call(e,['psmourner'],118))msg('The Saint weeps, and a stone mourner rises out of the tears. The Saint heals 8% of her health.','#cfd8ff')});
bl3Hit('psf6_e9',e=>{const p=psf6Phase(e,[.5]);if(!p)return;
  if(psf6Call(e,['psguard','psguard'],119))msg('The Crown Knight raises his sword. Two pale guards come running to his side.','#e0e0f0')});
bl3Hit('psf6_e10',e=>{const p=psf6Phase(e,[.66,.33]);if(!p)return;
  if(psf6Call(e,['psmarblehound','psmarblehound'],120))msg('The Executioner whistles. Two marble hounds slip in through the door behind you.','#e0e0f0')});
/* ---------- the Pale King ---------- */
ENEMY_DEF.psf6_king=pscE('psf6_king',{img:'ps_f6r11_foe',ph:2.6,w:.9,name:'The Pale King',hp:10000,dmg:[70,105],hit:.94,verb:'strikes',xp:20000,boss:true,aboveParty:0,gold:[0,0],ps:1});
bl3Hit('psf6_king',e=>{
  const ph=psf6Phase(e,[.75,.5,.25]);if(!ph)return;
  const T=[null,['psf6_e1','psf6_e2'],['psf6_e5','psf6_e6'],['psf6_e8','psf6_e9'],['psf6_e3','psf6_e10']][ph],
        M=[null,'The Pale King lifts one hand. The Gilded Usher and the Organist Wraith come back, weaker than before.',
          'The Pale King lifts one hand. The Weaver and the Mirror Duchess come back, weaker than before.',
          'The Pale King lifts one hand. The Weeping Saint and the Crown Knight come back, weaker than before.',
          "The Pale King raises both hands. The Clock Reaper and the King's Executioner come back, weaker than before."][ph];
  if(psf6Call(e,T,120,.2))msg(M,'#e8e0ff')});
bl3Kill('psf6_king',e=>{
  const F=psf6F();F.king=2;
  msg('The Pale King sinks to his knees, and the pale crown slips from his head. He is silent, and he does not rise again. The tower is yours.','#ffe36a');
  if(!F.got){F.got=1;for(const id of ['pg_f6_k1','pg_f6_k2','pg_f6_k3','pg_f6_k4'])bl3Give(id);
    msg("Four pieces lie where he fell: the Black Crown of the Pale King, the Sceptre of the Pale King, and his gauntlets and greaves.",'#ffe36a')}
  if(typeof psf6Won==='function')psf6Won()});
/* ---------- gear: like pgrItem but for levels 112 to 120 ---------- */
function psf6Item(id,lvl,o){
  const it=Object.assign({k:'weapon',price:0,rar:1,gear:1},o,{lvl});it.id=id;it.pg=1;
  if(it.k==='weapon'){it.hit=it.hit===undefined?.2:it.hit;if(it.t==='Bow')it.ranged=7}
  it.d=it.d+' Needs level '+lvl+'.';
  ITEMDEF[id]=it;if(typeof PGR_ITEMS!=='undefined')PGR_ITEMS[id]=it;return it}
const C6=(typeof PGR_C!=='undefined')?PGR_C:{vio:'#4a2a6a',blk:'#1a1624',brass:'#b08d3c',verd:'#3f8f7a',bone:'#d8d0b8'};
/* the ten chest pieces, one per room */
psf6Item('pg_f6_1',112,{n:'Candleflame Greatsword',t:'Sword',ic:'sword',c:C6.brass,dmg:[980,1120],req:{str:82},eff:{bossdmg:.5,bleed:[.5,8,80],stun:.18},dbl:.22,sw:.7,
  d:"A black and gold greatsword with a crown of small flames burning along the blade, taken from the Gilded Usher. Wounds bleed hard, about one blow in six knocks the foe down, one blow in five does double damage, and bosses take 50% more."});
psf6Item('pg_f6_2',113,{n:'Organ-Pipe Staff',t:'Staff',ic:'staff',c:C6.vio,dmg:[340,400],magic:260,req:{int:82},eff:{bossdmg:.7,daze:.4,shock:.25},pas:{spellPct:.2,mpRegen:1.4},sw:.44,
  d:"A tall staff made of five thin organ pipes bound together, which hum when it is raised. It belonged to the Organist Wraith. Adds 260 to the power of spells, spell damage +20%, tiredness fades much faster, bosses take 70% more, and foes are often dazed."});
psf6Item('pg_f6_3',114,{n:"Reaper's Minute-Hand",t:'Dagger',ic:'dagger',c:C6.bone,dmg:[900,1020],req:{dex:80},eff:{bleed:[.6,10,80],exec:[.45,4],bossdmg:.35},dbl:.34,pas:{crit:.1},sw:.3,
  d:"A long brass clock hand with a razor edge, pulled from the Clock Reaper. Wounds bleed hard, a foe under 45% health takes four times the blow, bosses take 35% more, and double hits come 10% more often."});
psf6Item('pg_f6_4',115,{k:'chest',n:'Reliquary Cuirass',t:'Chest',ic:'chest',c:C6.bone,armor:98,pas:{ward:36,thorns:18,regen:1.2,lifesteal:.06,secondWind:.45},sw:.55,
  d:"A cuirass of pale gilt plate with small locked reliquary boxes set all over the breast, from the Reliquary Mimic. Armour 98, every blow on the wearer is 36 lighter, every enemy that strikes takes 18 damage, wounds close quickly, the wearer heals 6% of the melee damage dealt, and once per 30 rounds below a quarter health it heals 45%."});
psf6Item('pg_f6_5',116,{n:"Weaver's Silkstring Bow",t:'Bow',ic:'bow',c:C6.bone,dmg:[960,1100],req:{dex:82},eff:{pierce:1,double:.5,vuln:[.35,5],bossdmg:.45},dbl:.2,sw:.42,
  d:"A bow of pale bone strung with spider silk that is stronger than wire, taken from the Weaver. Shoots 7 squares, its arrows pass through to the foe behind, half of all shots send a second arrow, a hit often leaves the foe open to harm, and bosses take 45% more."});
psf6Item('pg_f6_6',117,{k:'shield',n:'Mirror Duchess Aegis',t:'Shield',ic:'shield',c:C6.vio,armor:46,pas:{ward:30,thorns:26,dodge:.1,regen:.9},sw:.5,
  d:"A tall oval shield of silvered glass in a black frame. Blows that land on it come back on the attacker. Armour 46, every blow on the wearer is 30 lighter, every enemy that strikes takes 26 damage, enemies miss 10% more, and wounds close steadily."});
psf6Item('pg_f6_7',118,{k:'ring',n:'Thorn Scribe Signet',t:'Ring',ic:'ring',c:C6.verd,pas:{ward:36,crit:.1,dmgPct:.09,regen:1.3,lifesteal:.03},hp:190,dex:11,str:10,sw:.1,
  d:"A black signet ring with a thorn for a seal, which the Scribe used on every page. Adds 11 Dexterity, 10 Strength and 190 health, every blow on the wearer is 36 lighter, double hits come 10% more often, all damage +9%, wounds close quickly, and the wearer heals 3% of the melee damage dealt."});
psf6Item('pg_f6_8',119,{n:'Maul of the Weeping Saint',t:'Mace',ic:'mace',c:C6.bone,dmg:[940,1080],req:{str:84},eff:{stun:.35,bossdmg:.5,shock:.25,vuln:[.3,5]},dbl:.2,sw:.9,
  d:"A heavy mace of grey stone, cut from the Weeping Saint's own hand. Clear water runs from its head after each blow. About one blow in three knocks the foe down, one blow in four shakes the ground and throws down every foe close by, bosses take 50% more, and a hit sometimes leaves the foe open to harm."});
psf6Item('pg_f6_9',120,{k:'head',n:"Crown Knight's Great Helm",t:'Helm',ic:'head',c:C6.brass,armor:40,pas:{dodge:.1,dmgPct:.1,spellPct:.1,regen:1,mpRegen:1},sw:.4,
  d:"A tall black helm with a gold crown welded on top, the visor shut for good. It was the Crown Knight's. Armour 40, enemies miss 10% more, all damage +10%, spell damage +10%, wounds close quickly, and tiredness fades faster."});
psf6Item('pg_f6_10',120,{n:"Headsman's Axe of the Pale King",t:'Axe',ic:'axe',c:C6.blk,dmg:[1000,1160],req:{str:84},eff:{cleave:1,exec:[.45,5],bossdmg:.6,bleed:[.5,8,80]},dbl:.24,sw:.8,
  d:"A huge black axe with a blade as wide as a door, carried by the King's Executioner. Each blow carries on into the foe behind, a foe under 45% health takes five times the blow, wounds bleed hard, bosses take 60% more, and one blow in four does double damage."});
/* the king's four drops */
psf6Item('pg_f6_k1',120,{k:'head',n:'Black Crown of the Pale King',t:'Helm',ic:'head',c:C6.blk,armor:44,pas:{dodge:.12,crit:.1,dmgPct:.12,spellPct:.12,regen:1.2,mpRegen:1.2},sw:.4,
  d:"A heavy crown of black iron set with seven pale stones, taken from the Pale King. Armour 44, enemies miss 12% more, double hits come 10% more often, all damage +12%, spell damage +12%, wounds close quickly, and tiredness fades faster."});
psf6Item('pg_f6_k2',120,{n:'Sceptre of the Pale King',t:'Staff',ic:'staff',c:C6.vio,dmg:[380,450],magic:300,req:{int:86},eff:{bossdmg:.8,daze:.4,shock:.3},pas:{spellPct:.25,mpRegen:1.6,regen:.8},sw:.44,
  d:"A long sceptre of pale stone with a black orb at the tip, held by the Pale King. Adds 300 to the power of spells, spell damage +25%, tiredness fades much faster, wounds close steadily, bosses take 80% more, and foes are often dazed."});
psf6Item('pg_f6_k3',120,{k:'arms',n:'Gauntlets of the Pale King',t:'Arms',ic:'arms',c:C6.vio,armor:26,pas:{dmgPct:.1,crit:.09,thorns:16,ward:16},sw:.4,
  d:"Black gauntlets with pale stone knuckles, the Pale King's. Armour 26, all damage +10%, double hits come 9% more often, every enemy that strikes takes 16 damage, and every blow on the wearer is 16 lighter."});
psf6Item('pg_f6_k4',120,{k:'legs',n:'Greaves of the Pale King',t:'Legs',ic:'legs',c:C6.bone,armor:32,pas:{regen:1.3,dodge:.11,ward:18,mpRegen:.8},sw:.4,
  d:"Pale grey greaves that never mark or scuff, the Pale King's. Armour 32, wounds close quickly, enemies miss 11% more, every blow on the wearer is 18 lighter, and tiredness fades faster."});
/* painted icons: assets/icn_<id>.png for the fourteen Pale Tower pieces */
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push(...Object.keys(ITEMDEF).filter(k=>k.startsWith('pg_f6_')));
