/* ==========================================================================
   SHOP WEAPONS FOR LEVELS 62 TO 78, and every tier in the gear shops. The ordinary weapons stopped at level 50 (the 60 to 80 ones were all drops).
   Twenty new plain-steel weapons (sword, axe, mace, bow; five tiers) with a price. Then Wenlock, Sale, the Deeper Hollow's arms and armour shops
   and Dwen the stone-smith sell every priced, non-unique weapon and piece of armour in the game, and Oldhaven's arms shops and armourers sell
   them up to level 80.
   ========================================================================== */
const GH_IDS=[];
{ // [id, name, type, level, effect, what it does, extra]
  const R=[
  ['gh_sw62','Duskfall Blade','Sword',62,{bleed:[.35,12,5]},'A dark blade with a long fuller. More than a third of its hits leave the foe bleeding.'],
  ['gh_sw66','Oathbreaker','Sword',66,{exec:[.3,3]},'A grey broadsword. Against a foe under 30% health it deals triple damage.'],
  ['gh_sw70','Greywind Longsword','Sword',70,{bossdmg:.45},'A long, plain, perfectly balanced sword. Bosses and great beasts take 45% more from it.'],
  ['gh_sw74','Kingsbane Brand','Sword',74,{stun:.2,bleed:[.3,14,5]},'A heavy brand with a red edge. One hit in five stuns the foe, and three in ten leave it bleeding.'],
  ['gh_sw78','Crownsplitter','Sword',78,{exec:[.3,3.5]},'A huge two-handed sword made to cut through helms. Against a foe under 30% health it deals three and a half times damage.'],
  ['gh_ax62','Ravager Axe','Axe',62,{cleave:1},'A broad axe with a curved edge. Every hit also cuts the foe standing behind the first.'],
  ['gh_ax66','Frostmaw Axe','Axe',66,{daze:.2,cleave:1},'A pale steel axe that is always cold to touch. It cuts through to the foe behind, and one hit in five dazes.'],
  ['gh_ax70','Gravewind Axe','Axe',70,{bleed:[.4,14,5]},'A rust-red axe with a long hooked beard. Two hits in five leave the foe bleeding.'],
  ['gh_ax74','Dragonsplitter','Axe',74,{cleave:1,shock:.15},'A huge double axe. It cuts through to the foe behind, and one hit in seven shakes the ground.'],
  ['gh_ax78','Worldsunder','Axe',78,{shock:.3},'An axe with a haft as long as a spear. Three hits in ten shake the ground and knock down every foe within two squares.'],
  ['gh_mc62','Bonecrusher','Mace',62,{vuln:[.3,4]},'A flanged mace with a head like a fist. A third of its hits crack the foe\'s guard for four rounds.'],
  ['gh_mc66','Thunderfall Maul','Mace',66,{stun:.2},'A two-handed maul that rings like a bell. One hit in five knocks the foe senseless.'],
  ['gh_mc70','Siegebreaker','Mace',70,{vuln:[.35,4]},'A ram of iron on a short haft. Over a third of its hits crack the foe\'s guard.'],
  ['gh_mc74','Oathhammer','Mace',74,{stun:.25,shock:.15},'A white-steel hammer. One hit in four stuns the foe, and one in seven shakes the ground.'],
  ['gh_mc78','Hammer of Ages','Mace',78,{stun:.25,vuln:[.3,4]},'A hammer older than the kingdom. It stuns one hit in four and cracks the guard of the foe one in three.'],
  ['gh_bw62','Hawkeye Bow','Bow',62,{pierce:1},'A tall, dark bow. Shoots 6 squares, and its arrows pass through to the foe behind.',{ranged:6}],
  ['gh_bw66','Stormfeather Bow','Bow',66,{double:.3},'A bow fletched with grey feathers. Shoots 6 squares, and three shots in ten send a second arrow.',{ranged:6}],
  ['gh_bw70','Wraithstring Bow','Bow',70,{bleed:[.35,12,5]},'A bow with a pale, humming string. Shoots 6 squares, and its arrows leave the foe bleeding.',{ranged:6}],
  ['gh_bw74','Skyrender','Bow',74,{pierce:1,double:.2},'A long bow of black horn. Shoots 7 squares, its arrows pass through to the foe behind, and one shot in five sends a second arrow.',{ranged:7}],
  ['gh_bw78','Bow of Last Light','Bow',78,{bossdmg:.35},'A silver bow that never misses a big target. Shoots 7 squares; bosses and great beasts take 35% more.',{ranged:7,dbl:.15}]];
  const AVG={62:270,66:295,70:325,74:365,78:410};
  for(const [id,n,t,L,eff,d,ex] of R){
    const a=AVG[L]*(t==='Bow'?.93:1),lo=Math.round(a*.82),hi=Math.round(a*1.18),req=Math.round(34+(L-62)/4),price=Math.round(6500*(1+(L-50)/25));
    const it={n,k:'weapon',t,ic:t==='Bow'?'bow':t==='Axe'?'axe':t==='Mace'?'mace':'sword',c:'#c8ccd4',dmg:[lo,hi],hit:t==='Bow'?.12:t==='Sword'?.08:-.02,req:t==='Bow'?{dex:req}:{str:req},price,lvl:L,tier:L,eff,d:d+` Needs level ${L}.`,sw:t==='Bow'?.42:.44,gear:1};
    if(t==='Bow')it.ranged=ex&&ex.ranged||6;
    if(ex&&ex.dbl)it.dbl=ex.dbl;
    ITEMDEF[id]=it;GH_IDS.push(id);if(typeof GEAR!=='undefined')GEAR.push(id)}
}
// they borrow the picture of an older weapon, recoloured, until each has a painting of its own
{const TC={62:[[10,42,38],[155,255,232]],66:[[40,18,44],[232,176,242]],70:[[50,14,8],[255,155,105]],74:[[14,26,40],[165,208,238]],78:[[42,38,6],[255,236,124]]},BASE={Sword:'kingslayer',Axe:'worldaxe',Mace:'maul',Bow:'twinbow'};
  const tint=()=>{if(typeof pToneMap!=='function')return;for(const id of GH_IDS){if(IMG['icn_'+id])continue;const d=ITEMDEF[id],b=IMG['icn_'+BASE[d.t]];if(!b)continue;const c=TC[d.lvl],im=pToneMap(b,c[0],c[1],1.6,.9,0);IMG['icn_'+id]=im;IMG['ic_'+id]=im;IMG['it_'+id]=im}};
  const _dw=drawWorld;drawWorld=function(){tint();return _dw.apply(this,arguments)}}
/* ---- levels 82 to 110: thirty-two weapons in eight painted sets (assets/icn_gh_<type><level>.png), expensive, each with effects of its own ---- */
const GH2_IDS=[];
{ // [level, set, [sword, axe, mace, bow] each [name, effect, extra stats, flavour]]
  const SETS=[
  [82,'Wyrmbone',[
    ['Wyrmtooth Sabre',{bleed:[.4,16,6],burn:[.2,12,4]},0,'A sabre ground from a dragon tooth, still warm to the hand.'],
    ['Wyrmbone Cleaver',{cleave:1,bleed:[.35,16,5]},0,'A double axe of ivory dragon bone, ridged like a spine.'],
    ['Drakeknuckle Mace',{vuln:[.35,4],stun:.15},0,'A flanged mace of knuckle bones from a great wyrm.'],
    ['Wyrmrib Bow',{pierce:1,burn:[.25,10,4]},0,'A bow made from a dragon\'s rib, its tips still smouldering.']]],
  [86,'Ashen Ember',[
    ['Cinderbrand',{burn:[.45,16,5]},0,'A black blade cracked with veins of molten orange.'],
    ['Emberfall Axe',{cleave:1,burn:[.3,14,4]},0,'An axe of cooling lava. Embers fall from the edge as it swings.'],
    ['Ashen Hammer',{shock:.25,burn:[.25,14,4]},0,'A hammer that has never quite cooled.'],
    ['Embershot Bow',{burn:[.4,14,5],double:.2},0,'A bow whose arrows catch fire as they leave the string.']]],
  [90,'Starforged',[
    ['Constellation Blade',{chain:[.5,3]},0,'A midnight-blue blade scattered with stars.'],
    ['Starfall Axe',{chain:[.4,3],cleave:1},0,'An axe whose edge leaves a trail of falling stars.'],
    ['Comet Maul',{stun:.25,nova:[.2,.6]},0,'A maul like a fallen star, heavy and cold.'],
    ['Starseeker Bow',{double:.3,bossdmg:.3,pierce:1},{crit:.08},'A bow that finds its target in any darkness. +8% chance of a critical hit.']]],
  [94,'Bloodmoon',[
    ['Bloodmoon Edge',{bleed:[.45,18,6]},{lifesteal:.06},'A crimson blade that drinks what it cuts. The wielder heals 6% of the damage dealt.'],
    ['Crimson Reaver',{exec:[.3,3.5]},{lifesteal:.06,critDmg:.2},'A red axe with a crescent edge. The wielder heals 6% of the damage dealt, and critical hits do 20% more damage.'],
    ['Vampire Maul',{vuln:[.35,5],bleed:[.3,16,5]},{lifesteal:.07},'A dark red maul that never dries. The wielder heals 7% of the damage dealt.'],
    ['Bow of Red Tides',{bleed:[.4,16,5],double:.2},{lifesteal:.05},'A blood-red bow. The wielder heals 5% of the damage dealt.']]],
  [98,'Voidglass',[
    ['Voidreaver',{curse:[.4,6],exec:[.3,3.5]},{crit:.07,critDmg:.15},'A sword of black obsidian with violet light in its veins. +7% chance of a critical hit, and critical hits do 15% more damage.'],
    ['Riftcleaver',{cleave:1,fear:[.3,3]},0,'An obsidian axe that seems to cut the air itself.'],
    ['Null Maul',{blind:[.3,4],stun:.2},0,'A black glass maul that swallows the light around it.'],
    ['Wraith Bow',{slow:[.4,4],pierce:1,curse:[.25,5]},{critDmg:.25},'A bow of black glass. Its arrows pass through the foe like smoke. Critical hits do 25% more damage.']]],
  [102,'Sunsteel',[
    ['Dawnbringer',{bossdmg:.55,blind:[.25,3]},{regen:.2},'A golden blade that shines like noon. Wounds close steadily.'],
    ['Sunreaver',{shock:.3,burn:[.3,16,4]},{regen:.2},'A gold and white axe engraved with sun rays. Wounds close steadily.'],
    ['Hammer of Noon',{stun:.3,manaleech:3},{mpRegen:.2},'A golden hammer with a sun on its face. Mana returns faster.'],
    ['Sunfire Bow',{burn:[.45,18,5],double:.25},0,'A golden bow whose arrows burn like the sun.']]],
  [106,'Tidal',[
    ['Drowned King\'s Blade',{poison:[.5,16,6],slow:[.3,3]},0,'A verdigris blade raised from a sunken ship, inlaid with sea-glass.'],
    ['Kraken Axe',{cleave:1,slow:[.35,3],shock:.15},0,'A green bronze axe that drips cold seawater.'],
    ['Leviathan Maul',{stun:.25,slow:[.4,4]},0,'A heavy bronze maul with a coral head.'],
    ['Tidecaller Bow',{poison:[.4,14,5],pierce:1,double:.2},0,'A bow of green bronze and pearl, strung with something that hums like the sea.']]],
  [110,'Godforged',[
    ['Heavenfall',{exec:[.35,4],bossdmg:.5},{lifesteal:.08,critDmg:.3},'A radiant sword with feathered wings at the guard. The wielder heals 8% of the damage dealt, and critical hits do 30% more damage.'],
    ['Halo Axe',{cleave:1,chain:[.5,4],shock:.2},0,'A golden axe crowned with a halo ring.'],
    ['Seraph\'s Mace',{stun:.3,vuln:[.4,5]},{regen:.3},'A white and gold mace with a halo. Wounds close quickly.'],
    ['Bow of Ascension',{double:.35,pierce:1,bossdmg:.4},{crit:.1},'A golden bow wrapped in wings, that shoots light itself. +10% chance of a critical hit.']]]];
  const T=['Sword','Axe','Mace','Bow'],K=['sw','ax','mc','bw'],pc=x=>Math.round(x*100)+'%';
  const TX={bleed:v=>`${pc(v[0])} of hits leave the foe bleeding.`,burn:v=>`${pc(v[0])} of hits set the foe on fire.`,poison:v=>`${pc(v[0])} of hits poison the foe.`,curse:v=>`${pc(v[0])} of hits curse the foe.`,fear:v=>`${pc(v[0])} of hits make the foe flee.`,blind:v=>`${pc(v[0])} of hits blind the foe.`,slow:v=>`${pc(v[0])} of hits slow the foe.`,
    cleave:()=>'Every hit also cuts the foe behind the first.',pierce:()=>'Its arrows pass through to the foe behind.',stun:v=>`One hit in ${Math.round(1/v)} knocks the foe senseless.`,vuln:v=>`${pc(v[0])} of hits crack the foe's guard.`,exec:v=>`Against a foe under ${pc(v[0])} health it deals ${v[1]} times damage.`,bossdmg:v=>`Bosses and great beasts take ${pc(v)} more.`,shock:v=>`${pc(v)} of hits shake the ground and knock down foes within two squares.`,double:v=>`${pc(v)} of shots send a second arrow.`,
    chain:v=>`Each hit arcs on to up to ${v[1]} other nearby foes for ${pc(v[0])} of the damage.`,nova:v=>`${pc(v[0])} of hits blast every foe within two squares for ${pc(v[1])} of the damage.`,manaleech:v=>`Every hit restores ${v} mana to the wielder.`};
  const AVG=L=>430+(L-82)*13.5;
  for(const [L,set,W] of SETS)W.forEach(([n,eff,pas,fl],k)=>{
    const t=T[k],id='gh_'+K[k]+L,a=AVG(L)*(t==='Bow'?.93:1),req=Math.round(40+(L-82)/4),price=Math.round(20000*Math.pow(L/80,1.7)/100)*100;
    const ex=Object.keys(eff).map(q=>TX[q](eff[q])).join(' ');
    const it={n,k:'weapon',t,ic:t==='Bow'?'bow':t==='Axe'?'axe':t==='Mace'?'mace':'sword',c:'#c8ccd4',dmg:[Math.round(a*.82),Math.round(a*1.18)],hit:t==='Bow'?.14:t==='Sword'?.1:0,req:t==='Bow'?{dex:req}:{str:req},price,lvl:L,tier:L,eff,d:`${fl} ${ex} Needs level ${L}.`,sw:t==='Bow'?.42:.46,gear:1};
    if(pas)it.pas=pas;if(t==='Bow')it.ranged=L>=100?7:6;
    ITEMDEF[id]=it;GH2_IDS.push(id);if(typeof GEAR!=='undefined')GEAR.push(id)});
  if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push(...GH2_IDS);
}
/* the new things a weapon can do on a hit (the old ones are in weaponProc) */
{const _wp=weaponProc;weaponProc=function(i,E,dmg,w,k){
  _wp.apply(this,arguments);
  const e=w&&w.eff;if(!e||!E)return;
  try{
    if(E.hp>0){
      for(const q of ['burn','poison'])if(e[q]&&Math.random()<e[q][0])mxApplyEnemy(i,E,[q,e[q][1],e[q][2]],null);
      for(const q of ['curse','fear','blind','slow'])if(e[q]&&Math.random()<e[q][0])mxApplyEnemy(i,E,[q,e[q][1]],null);
    }
    if(e.chain){const near=G.enemies.filter(q=>q!==E&&q.hp>0&&Math.abs(q.x-E.x)+Math.abs(q.y-E.y)<=3).slice(0,e.chain[1]);
      if(near.length){const x=Math.max(1,Math.round(dmg*e.chain[0]));for(const q of near)hurtEnemy(q,x);msg(`The blow arcs on to ${near.length} more for ${x} each.`,'#a8d0ff')}}
    if(e.nova&&Math.random()<e.nova[0]){const L=G.enemies.filter(q=>q.hp>0&&Math.abs(q.x-G.P.x)+Math.abs(q.y-G.P.y)<=2),x=Math.max(1,Math.round(dmg*e.nova[1]));
      if(L.length){for(const q of L)hurtEnemy(q,x);msg(`A burst of force blasts ${L.length} foe${L.length>1?'s':''} for ${x} each!`,'#ffd76a');G.shake=Math.max(G.shake||0,.3)}}
    if(e.manaleech){const h=G.heroes[i];if(h&&h.alive&&h.mp<h.mpMax)h.mp=Math.min(h.mpMax,h.mp+e.manaleech)}
  }catch(err){console.error('ghProc',err)}}}
/* ---- every tier: all priced, non-unique weapons and armour up to a level, two of the cheap pieces and one of the rest ---- */
const ghGear=(kinds,max)=>Object.keys(ITEMDEF).filter(id=>{const d=ITEMDEF[id];return d&&!d.rar&&kinds.includes(d.k)&&(d.price||0)>0&&(d.lvl||1)<=max}).sort((a,b)=>(ITEMDEF[a].lvl||1)-(ITEMDEF[b].lvl||1)||ITEMDEF[a].price-ITEMDEF[b].price).map(id=>[id,ITEMDEF[id].price<400?2:1]);
const GH_WEAP=['weapon'],GH_ARM=['shield','head','chest','legs','arms','armor','armour'];
// Wenlock and Sale: everything
KH_STOCK.wli_weapons=()=>ghGear(GH_WEAP,999);
KH_STOCK.wli_armour=()=>ghGear(GH_ARM,999);
KH_STOCK.sa_weapons=()=>ghGear(GH_WEAP,999);
KH_STOCK.sa_armour=()=>ghGear(GH_ARM,999);
KH_STOCK.sa_tailor=()=>KH_STOCK.wli_tailor().concat(ghGear(['head','chest','legs','arms'],999));
// the Deeper Hollow: the arms and armour shop of every town, and Dwen the stone-smith
{const _h=hgds2Stock;hgds2Stock=function(kind,town){if(kind==='arms')return ghGear(GH_WEAP,999);if(kind==='armour')return ghGear(GH_ARM,999);return _h.apply(this,arguments)}}
if(typeof HGDP_SHOPS!=='undefined'&&HGDP_SHOPS[1])HGDP_SHOPS[1][1].push(...ghGear(GH_WEAP.concat(GH_ARM),999));
// Oldhaven: up to level 80
KH_STOCK.oh_arms=()=>KH_STOCK.arms().concat(ghGear(GH_WEAP,80));
KH_STOCK.oh_armour=()=>KH_STOCK.armour().concat(ghGear(['shield','head','chest'],80));
KH_STOCK.oh_tailor=()=>KH_STOCK.armour().concat(ghGear(['chest','legs','arms'],80));
