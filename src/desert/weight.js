/* ==========================================================================
   RINGS AND WEIGHT. A wide range of rings (strength, dexterity, intelligence, mana, health, armour, damage, profession rank, and carrying), and a weight
   system: every item weighs something, the party can carry a weight that grows with the heroes' combined strength, and the number of pack slots grows with it too.
   Over the limit the party fights worse, and cannot lift anything more from the floor, a chest or a shop.
   ========================================================================== */
const RINGS=[ // [id, name, colour, bonuses, price, tier, description]
 ['ringOx','Ring of the Ox','#b8783a',{str:2},180,1,'A heavy brass ring. Adds 2 Strength.'],
 ['ringFox','Ring of the Fox','#d8883a',{dex:2},180,1,'A thin copper ring that fits like a second skin. Adds 2 Dexterity.'],
 ['ringOwl','Ring of the Owl','#a8a8d8',{int:2},180,1,'A silver ring with two tiny round eyes. Adds 2 Intelligence.'],
 ['ringWell','Ring of the Well','#4a8ad8',{mpb:8},170,1,'A blue ring that is always a little cool. Adds 8 to maximum mana.'],
 ['ringBear','Ring of the Bear','#a86040',{hp:12},200,1,'A thick ring cut with claw marks. Adds 12 to maximum health.'],
 ['ringMule','Ring of the Pack Mule','#8a7a58',{bagb:8,wtb:15},260,1,'A plain leather-wrapped ring. Adds 8 pack slots and lets the party carry 15 kg more.'],
 ['ringPorter','Ring of the Porter','#9a8a68',{wtb:20},220,1,'An iron ring worn smooth by rope. Lets the party carry 20 kg more.'],
 ['ringCraft','Ring of the Craftsman','#d8c060',{profb:1},420,2,'A ring of fine gold wire. Adds 1 rank to the wearer’s profession.'],
 ['ringBulwark','Ring of the Bulwark','#7090b8',{armor:3},300,2,'A broad steel ring like a tiny shield. Adds 3 armor.'],
 ['ringLion','Ring of the Lion','#e0a030',{dmgb:3},340,2,'A golden ring with a mane of fine lines. Adds 3 to melee damage.'],
 ['ringHawk','Ring of the Hawk','#68b868',{hitb:.1},300,2,'A green ring with a sharp little beak. Adds 10% to hit chance.'],
 ['ringDuel','Ring of the Duellist','#c85a70',{dbl:.06},380,2,'A red ring that tingles in a fight. Adds 6% to double damage.'],
 ['ringFeather','Ring of the Featherweight','#e8e8d8',{wtp:.15},380,2,'A pale ring that seems to weigh nothing. Everything the party carries weighs 15% less.'],
 ['ringMoon','Ring of the Moon','#8a8ae8',{mpb:18},480,2,'A ring of pale silver with a crescent. Adds 18 to maximum mana.'],
 ['ringTitan','Ring of the Titan','#c8783a',{str:4},560,3,'A massive bronze ring. Adds 4 Strength.'],
 ['ringWind','Ring of the Wind','#a8d8e8',{dex:4},560,3,'A light ring that hums in a breeze. Adds 4 Dexterity.'],
 ['ringSage','Ring of the Sage','#c8a8f0',{int:4},560,3,'A violet ring with a thousand tiny letters. Adds 4 Intelligence.'],
 ['ringOak','Ring of the Oak','#6a8a3a',{hp:24},580,3,'A green ring of living wood that never dries. Adds 24 to maximum health.'],
 ['ringHaul','Ring of the Great Haul','#b89858',{bagb:16,wtb:30},700,3,'A ring on a golden chain-link band. Adds 16 pack slots and lets the party carry 30 kg more.'],
 ['ringChampion','Ring of the Champion','#f0d060',{str:1,dex:1,int:1},650,3,'A gold ring set with three small stones. Adds 1 to Strength, Dexterity and Intelligence.'],
 ['ringMaster','Ring of the Master Hand','#f0e8a0',{profb:2},900,4,'A ring that only a master of a trade is given. Adds 2 ranks to the wearer’s profession.']];
for(const [id,n,c,b,price,tier,d] of RINGS)ITEMDEF[id]=Object.assign({n,k:'ring',t:'Ring',ic:'ring',c,price:Math.round(price*1.8/10)*10,rar:1,d,sw:.2},b); // rings are dear
/* ---------- what everything weighs, in kilograms ---------- */
const WT_KIND={weapon:2.5,shield:3,head:1.5,chest:6,arms:1.5,legs:2.5,ring:.1,potion:.5,food:.4,spell:.2,quest:.15,light:1};
function itemWeightDef(d){
  if(!d)return .3;if(d.wt!==undefined)return d.wt;
  if(d.k==='weapon'&&d.dmg)return Math.round(Math.min(8,1+(d.dmg[0]+d.dmg[1])/2*.12)*10)/10;
  if(d.k==='chest'||d.k==='head'||d.k==='arms'||d.k==='legs'||d.k==='shield')return Math.round(((WT_KIND[d.k]||2)+(d.armor||0)*.5)*10)/10;
  if(d.k==='quest'&&/^(gem_|herb_|bf_)/.test(d.id||''))return .1;
  return WT_KIND[d.k]!==undefined?WT_KIND[d.k]:.4}
function itemWeight(id){const d=ITEMDEF[id];if(!d)return .3;if(/^(gem_|herb_|bf_)/.test(id))return .1;return itemWeightDef(d)}
const wtMul=()=>1-Math.min(.5,invParty('wtp'));
function packWeight(){let w=0;for(const it of G.bag)w+=itemWeight(it.id)*(it.n||1);return w*wtMul()}
function invCombinedStr(){let s=0;for(const h of G.heroes)if(h.alive!==false)s+=h.str;return s}
function invParty(key){let s=0;for(const h of G.heroes)if(h.alive!==false)s+=ringSum(h,key);return s}
let WT_CAP=100;
function invRecalc(){
  if(!G.heroes||!G.heroes.length)return;const cs=invCombinedStr();let slots=36+Math.round(cs*.5)+invParty('bagb'),cap=20+cs*1.6+invParty('wtb');
  try{if(hasCompanion('donkey')){slots+=12;cap+=30}if(hasCompanion('llama')){slots+=10;cap+=20}}catch(e){}
  BAGCAP=Math.max(slots,G.bag.length);WT_CAP=cap;const was=G.overload;G.overload=packWeight()>cap;if(G.overload&&!was&&G.state==='play')msg('The party is overloaded: it moves at half speed and fights worse. Drop something.','#e0a080');else if(!G.overload&&was&&G.state==='play')msg('The party can walk at full speed again.','#a8d8a0')}
petsApply=function(){invRecalc()};
/* ---------- the stat rings: strength, dexterity, intelligence and mana change the hero while the ring is worn ---------- */
function ringApply(h){
  if(!h||!h.eq)return;const want={str:ringSum(h,'str'),dex:ringSum(h,'dex'),int:ringSum(h,'int'),mp:ringSum(h,'mpb')},had=h._rs||{str:0,dex:0,int:0,mp:0};
  for(const k of ['str','dex','int']){const dl=want[k]-had[k];if(dl)h[k]+=dl}
  const dm=want.mp-had.mp;if(dm){h.mpMax=Math.max(1,h.mpMax+dm);h.mp=dm>0?Math.min(h.mpMax,h.mp+dm):Math.min(h.mp,h.mpMax)}
  h._rs=want}
{const _rm=recalcMax;recalcMax=function(hi){try{ringApply(G.heroes[hi])}catch(e){}return _rm.apply(this,arguments)}}
{const _u=update;update=function(dt){if(G.state==='play'&&G.heroes&&G.heroes.length){if(G.time>=(G._invT||0)){G._invT=G.time+.5;try{for(const h of G.heroes)ringApply(h);invRecalc()}catch(e){}}
    else{const o=packWeight()>WT_CAP;if(o!==!!G.overload){G.overload=o;msg(o?'The party is overloaded: it moves at half speed and fights worse. Drop something.':'The party can walk at full speed again.',o?'#e0a080':'#a8d8a0')}}} // the moment the load drops under the limit the party speeds up again
  return _u.apply(this,arguments)}}
/* ---------- the limit: nothing more can be lifted from the floor, a chest or a shop once the pack is full by weight ---------- */
{const _ba=bagAdd;bagAdd=function(it){
  if((G.loot||G._wtPick)&&it&&it.id){const w=itemWeight(it.id)*(it.n||1)*wtMul();if(packWeight()+w>WT_CAP+.001){G._heavy=1;return false}}
  G._heavy=0;return _ba.apply(this,arguments)}}
{const _pk=pickup;pickup=function(it){G._wtPick=1;try{return _pk.apply(this,arguments)}finally{G._wtPick=0}}}
{const _msg=msg;msg=function(t,c){if(G._heavy&&t==='Your bag is full.'){G._heavy=0;t='That is too heavy for the party to carry. Drop something first.'}return _msg.call(this,t,c)}}
/* ---------- rings turn up in chests: the better ones as the place gets harder ---------- */
function ringFor(u,rate){const tier=rate>=50?4:rate>=38?3:rate>=22?2:1,pool=RINGS.filter(r=>r[5]<=tier&&(r[5]===tier||u>.5||r[5]>=tier-1));return pool[Math.floor(u*pool.length)%pool.length][0]}
{const BASIC=['ringV','ringM','ringW','ringS'],_lf=lootFor;lootFor=function(d){const r=_lf.apply(this,arguments);
  if(Array.isArray(r))for(const it of r)if(BASIC.includes(it.id)&&hash2(d.x,d.y,801)<.75)it.id=ringFor(hash2(d.x,d.y,802),typeof DIFF==='function'?DIFF():20);
  return r}}

/* ---------- rings for sale: the armourers, the scroll sellers, the traders and the general stores, each with its own kind, and the better ones as the party grows ---------- */
{const SH={armour:['ringOx','ringBear','ringBulwark','ringTitan','ringOak','ringChampion'],armour2:['ringFox','ringHawk','ringDuel','ringLion','ringWind','ringChampion'],
  scroll:['ringOwl','ringWell','ringMoon','ringSage','ringCraft','ringMaster'],trader:['ringMule','ringPorter','ringFeather','ringHaul'],general:['ringMule','ringPorter','ringFeather','ringCraft'],sword:['ringLion','ringDuel','ringHawk']};
  for(const k in SH){const f=KH_STOCK[k];if(!f)continue;const ids=SH[k];
    KH_STOCK[k]=function(){const base=typeof f==='function'?f.apply(this,arguments):f,L=partyLevel(),tier=L>=45?4:L>=30?3:L>=15?2:1,extra=RINGS.filter(r=>ids.includes(r[0])&&r[5]<=tier).map(r=>[r[0],1]);
      return (Array.isArray(base)?base:[]).filter(e=>!(ITEMDEF[e[0]]&&ITEMDEF[e[0]].k==='ring'&&/^ring[VMWS]$/.test(e[0]))).concat(extra)}}}
