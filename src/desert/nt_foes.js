/* ==========================================================================
   THE NEVER-ENDING TOWER: CREATURES, LOOT AND SHOPS (prefix ntf / NTF).
   The creatures are the game's own, drawn from themed families (the graveyard, the blighted road, Sale, the witch wood, the hollow castle, the desert, the wild, the hives, the Pale Spire).
   A floor mixes two to four families chosen by its seed; every creature stands at the level of its floor. Bosses, wanderers, quest creatures and minis are never used.
   Every tenth floor has a guardian: a creature of the floor's pool made much stronger: five times the health, half as much damage again (ENEMY_DEF 'ntg_<type>').
   Shops: every 7th floor has a safe shop room; NT_SHOPS is the fixed cycle through every kind of shop in the game.
   ========================================================================== */
const NT_FAMS=[
  {k:'graveyard',n:'the dead of the graveyard',types:['gyskel','gypike','gybmage','gyghoul','gyzombie','gygiant','gywraith','gyshade','gybanshee','gyrats','gyhound','gyrat','gyraven']},
  {k:'blight',n:'the Blighted Road',types:['bldeadwarden','blhusk','blghoul','blbones','blbloat','blcrow','blshade','blhound','blscare','blpicker','blbrother','blringer']},
  {k:'sale',n:'the town of Sale',types:['saskel','sapike','sabmage','saghoul','sazombie','sagiant','sawight','saraven']},
  {k:'witchwood',n:'the witch wood',types:['wwscare','wwhound','wwspider','wwtoad','wwgolem','wwcrows','wwrevenant','wwroot','wwwisp','wwcrow']},
  {k:'hollow',n:'the hollow castle',types:['hlgoblin','hlslime','hlorc','hlhands','hlghost','hlwitch','hljester','hlmadman','hlwight','hlvictim','hlbutcher','hlphantom','hlheadless','hlbanshee','hlvampire','hlduke','hlwerewolf','hlwarlord','hlshifter','hlchoir','hlabom']},
  {k:'desert',n:'the deserts',types:['scorpion','dwolf','nomad','nomad2','vulture','cobra','mummy','pservant','dskeleton']},
  {k:'wild',n:'the wild',types:['rat','bat','skel','wolf','bandit','archer','hunter','hitman','guard','spectre','spectre2','ghost','bear','slime','assassin','ashguard','rguard']},
  {k:'hives',n:'the hives',types:['hgwasp','hglarva','hggolem','hgdgrub','hgdguard','hgdgolem','hgdslug','hgdjelly','hgdworm','hgdbug','hgdspider','hgdbeetle']},
  {k:'marsh',n:'the marsh',types:['hgins0','hgins1','hgins2','hgins3','hgins4','hgins5','hgins6','hgins7','hgmlocust','hgmmosquito','hgmhorsefly','hgmdragonfly','hgmhornet','hgmcricket','hgmtoad','hgmbeetle','hgwcroc','hgweel']},
  {k:'amethyst',n:'the amethyst well',types:['wmslime','wmbat','wmcrab','wmspider','wmcultist','wmbeetle','wmfungus','wmwraith','wmgolem']},
  {k:'pale',n:'the Pale Spire',types:['psguard','pshalberd','psarcher','pssentinel','psgargoyle','pschimera','pshydra','psmourner','psjudge','psthornsprite','psmoth','psraven','psarmour','psservant','pscourtier','psdancer','pscarver','pshhound','pscook','pskrat','psarmourer','psmonk','pschorister','psbookwraith','psink','psturnkey','psflayed','psshackle','pscellghost']}
];
/* a creature may be used if it is an ordinary one that stands at the level of its place and has a picture */
function ntfOk(t){
  const d=ENEMY_DEF[t];if(!d||!d.name||!d.img||!IMG[d.img])return false;
  if(d.boss||d.aboveParty>0||d.partyLevel||d.wander||d.roam||d.patrol||d.mini||d.act||d.shot||d.quest||d.fixedLevel)return false;
  if(typeof isBossy==='function'&&isBossy(t))return false;
  if(/mimic|bogey/i.test(t+d.name))return false;
  return true}
function ntfFamilies(){   // the families that can be drawn now (at least three usable creatures)
  const out=[];for(const f of NT_FAMS){const ok=f.types.filter(ntfOk);if(ok.length>=3)out.push({k:f.k,n:f.n,types:ok})}return out}
/* the pool of a floor: two to four families, and the creatures of those families */
function ntfPool(n,look,fams){
  const R=ntRng(ntSeed(n,61)),all=(fams||ntfFamilies()).slice();
  for(let i=all.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[all[i],all[j]]=[all[j],all[i]]}
  const k=Math.min(all.length,R.int(2,4)),use=all.slice(0,k),types=[];for(const f of use)for(const t of f.types)types.push(t);
  return {fams:use.map(f=>f.k),types}}
/* a guardian: the strongest-looking creature of the pool made much stronger. It is a copy of the ordinary creature in ENEMY_DEF. */
function ntfGuardian(type){
  const id='ntg_'+type;if(ENEMY_DEF[id])return id;const d=ENEMY_DEF[type];
  ENEMY_DEF[id]=Object.assign({},d,{name:'Guardian '+d.name.replace(/^The /,''),hp:Math.round(d.hp*5),dmg:[Math.round(d.dmg[0]*1.5),Math.round(d.dmg[1]*1.6)],hit:Math.min(.93,(d.hit||.85)+.05),w:(d.w||.7)*1.45,xp:d.xp*12,boss:true,aboveParty:0,ntg:1,glow:Math.max(d.glow||0,.3)});
  if(typeof NO_VARY!=='undefined')NO_VARY.push(id);
  if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD[id]=[2000,4000];
  return id}
/* ---------- the loot ---------- */
const NTF_CHESTS=['gy_chest','gy_chest','chest','vase0','vase1','vase2','vase3'];
function ntfGold(L,mul,r){const g=Math.round(L*40*(.6+r*1.4)*(mul||1));return Math.min(g,2e9)}
{const _lf=lootFor;lootFor=function(d){
  if(ntIs(LEVEL)&&d&&d.k&&(NTF_CHESTS.includes(d.k)||d.k==='treasure')){
    const L=LEVEL_RATING[LEVEL]||99,F=ntFloorOf(LEVEL),r=q=>hash2(d.x,d.y,900+q+(F%9973)),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
    const big=!!d.ntBig,mul=big?6:d.k==='treasure'?.5:1;
    for(let q=0;q<2+(big?2:0)+(r(30)<.4?1:0);q++)add(potionFor(r(10+q)),1);
    add('supermana',1+(big?2:0));if(r(2)<.6||big)add('elixir',1);
    for(let q=0;q<1+(big?2:0);q++){const a=typeof armourDrop==='function'?armourDrop(r(20+q)):null;if(a)add(a)}
    if(typeof ringFor==='function'&&(r(3)<.5||big))add(ringFor(r(4),Math.min(60,L)));
    if(r(5)<.5||big){const g=GEMS[Math.min(GEMS.length-1,Math.floor(Math.pow(r(6),.5)*GEMS.length))];add('gem_'+g[0],1)}
    d.gold=ntfGold(L,mul,r(7));return items}
  return _lf.apply(this,arguments)}}
if(typeof CONTAINERS!=='undefined')for(const k of ['gy_chest'])if(!CONTAINERS.includes(k))CONTAINERS.push(k);
/* ---------- the shops: a fixed cycle through every kind of shop in the game ---------- */
/* key, shop name, keeper's trade, KH_STOCK key, face. The first ten are the ordinary trades; then the other stocks of the game. */
const NT_SHOPS=[
  ['general','The General Store','general store keeper','sa_general','kh_ohfolk2_5'],
  ['armoury','The Armoury','armourer','sa_armour','kh_ohsold1_0'],
  ['weapons','The Weaponsmith','weaponsmith','sa_weapons','kh_ohfolk4_0'],
  ['apothecary','The Apothecary','apothecary','sa_apothecary','kh_ohfolk3_1'],
  ['books','The Bookseller','bookseller','sa_books','kh_ohfolk5_0'],
  ['jeweller','The Jeweller','jeweller','sa_jeweller','kh_ohfolk5_5'],
  ['tailor','The Tailor','tailor','sa_tailor','kh_ohfolk1_3'],
  ['butcher','The Butcher','butcher','sa_butcher','kh_ohfolk2_2'],
  ['baker','The Bakery','baker','food','kh_npc2_4'],
  ['alchemist','The Alchemist','alchemist','sa_alchemist','kh_ohfolk5_4'],
  ['inn','The Inn and Tavern','innkeeper','sa_tavern','kh_ohfolk3_5'],
  ['trader','The Trading Post','trader','trader','kh_ohfolk4_3'],
  ['smith','The Sun Forge','smith','arms','kh_npc5_4'],
  ['guardarm','The Guard Armoury','sergeant','armour','kh_npc3_0'],
  ['sword','The Swordsmith','swordsmith','sword','kh_ohfolk6_2'],
  ['armour2','The Mailmaker','mailmaker','armour2','kh_ohsold1_2'],
  ['potion','The Philtre Shop','potion seller','potion','kh_npc2_2'],
  ['potion2','The Strong Potions','potion seller','potion2','kh_npc4_5'],
  ['wlipotion','The Brewer','brewer','wli_potion','kh_ohfolk5_1'],
  ['scroll','The Silver Quill','scribe','scroll','kh_npc2_3'],
  ['wliscroll','The Scroll Room','scribe','wli_scrolls','kh_ohfolk5_3'],
  ['wliweap','The Armed Guild','weaponmaster','wli_weapons','kh_ohfolk4_1'],
  ['wliarm','The Plate Hall','plate maker','wli_armour','kh_ohsold1_1'],
  ['wligen','The Village Store','shopkeeper','wli_general','kh_ohfolk2_4'],
  ['green','The Greengrocer','greengrocer','wli_green','kh_ohfolk2_0'],
  ['wlibutch','The Meat Shop','butcher','wli_butcher','kh_ohfolk2_3'],
  ['wlibake','The Village Bakery','baker','wli_bakery','kh_ohfolk2_1'],
  ['wlitail','The Cloth Shop','tailor','wli_tailor','kh_ohfolk1_1'],
  ['cobbler','The Cobbler','cobbler','wli_cobbler','kh_ohfolk1_5'],
  ['chandler','The Chandler','chandler','wli_chandler','kh_ohfolk3_0'],
  ['cooper','The Cooper','cooper','wli_cooper','kh_ohfolk4_5'],
  ['herbs','The Herbalist','herbalist','wli_herbs','kh_ohfolk3_3'],
  ['sea','The Sea Goods Store','ship chandler','seagoods','kh_ohfolk4_2'],
  ['fishmonger','The Fishmonger','fishmonger','fishmonger','kh_ohfolk2_5'],
  ['tackle','The Bait and Tackle Shop','angler','fsh_bait','kh_ohfolk4_4'],
  ['fruit','The Fruit Stall','fruiterer','wls_fruit','kh_ohfolk1_0'],
  ['spice','The Spice Stall','spice merchant','wls_spice','kh_npc2_1'],
  ['pots','The Potters','potter','wls_pots','kh_ohfolk1_2'],
  ['cloth','The Cloth Stall','cloth seller','wls_cloth','kh_ohfolk1_4'],
  ['kgeneral','The Khemetra General Store','general merchant','general','kh_npc1_0']
];
/* stock keys that the cycle leaves out because another entry of the cycle already sells much the same things (the tests read this) */
const NT_SHOP_SKIP=['fish1','fish2','fish3','wls_jewels','wls_fish','wls_veg','wls_melon','wls_jars','wls_sacks'];
const NT_KEEPER_NAMES=['Orla','Bram','Wenna','Tobias','Hester','Lorcan','Mabyn','Osric','Petra','Garrick','Isolde','Dunstan','Rhosyn','Aldous','Edda','Cormac','Linnet','Hob','Sibyl','Fenn'];
function ntShopOf(n){const i=Math.floor(n/NT.SHOP_EVERY)-1;return NT_SHOPS[((i%NT_SHOPS.length)+NT_SHOPS.length)%NT_SHOPS.length]}
const NT_KEEP={};
function ntKeeper(i){   // the person behind the counter of shop number i of the cycle: a khNpc whose talk opens the shop
  const S=NT_SHOPS[i],id='nt_k_'+S[0];if(NT_KEEP[id])return id;NT_KEEP[id]=1;
  const name=NT_KEEPER_NAMES[(i*7)%NT_KEEPER_NAMES.length]+', the '+S[2];
  const stock=()=>{const f=KH_STOCK[S[3]];const r=typeof f==='function'?f():f;return (r||[]).filter(q=>ITEMDEF[q[0]])};
  const root=d=>{
    const L=LEVEL_RATING[LEVEL]||100;
    if(S[0]==='inn'){const cost=100+L*2;
      return say('The Inn and Tavern. Nothing in the tower can reach this room: the stair guards keep to their own landings. A bed costs '+cost+' gold, and you wake mended and fed.',[
        ['Take rooms ('+cost+' gold)',()=>{if(G.gold<cost)return say('That is '+cost+' gold. I cannot go lower.',[BYE]);G.gold-=cost;restParty(true);return say('You sleep behind a barred door. Everyone wakes healed and fed.',[BYE])}],
        ['Buy a meal or a drink',()=>{openShop(d,stock(),S[1]);return null}],BYE])}
    return say('Welcome. This is '+S[1].toLowerCase().replace(/^the /,'the ')+', and it is safe here. Look at what I have, and take your time.',[['Browse the wares',()=>{openShop(d,stock(),S[1]);return null}],
      ['What is this place?',()=>say('A shop on floor '+ntFloorOf(LEVEL)+' of the Never-Ending Tower. A shop opens on every seventh floor. The stair guards leave this room alone.',[BYE])],BYE])};
  khNpc(id,name,S[4],root);return id}
function ntShopIndex(n){const i=Math.floor(n/NT.SHOP_EVERY)-1;return ((i%NT_SHOPS.length)+NT_SHOPS.length)%NT_SHOPS.length}
