/* ==========================================================================
   POWERS SCALING. Every damaging power of every class (the class ladder and the bought spells) is tuned by one rule, so that inside a class a later
   power always hits harder AND costs more than an earlier one, and the damage for each point of cost is about the same all along a line
   (single-target powers are one line, area powers another; buffs and control have their own lines).

   The rule. Each class has one number E, the damage a single-target power does for each point of its cost, written in "usual blows":
        damage of a use  =  cost x E x U x g
   U is the caster's own usual blow (see psU): the average weapon hit with strength, rings, double-hit chance and damage bonuses for a fighter, and
   (intelligence bonus + staff magic + 8) with the spell bonuses for a mage or a sorcerer. So the power grows with the weapon, the stat and the gear, as
   the creatures' health grows with the level of the place. g = (1 + 0.0035 x (hero level - the power's unlock level)) x (1 + 0.002 x hero level): the first part rewards each level of mastery beyond the
   unlock, the second makes every power a little stronger as the hero grows, beyond what the weapon and the stats give. An area power does 0.4 x that for each foe it reaches (so about 1.2 times a single power when three are close).
   Damage over time (bleed, poison, burn) is part of the same total, and is spread over its rounds. Costs are fixed numbers that rise with the
   unlock level; they never change with the caster's level, so an early power stays cheap and simply stops mattering as the heroes grow.
   Powers keep their names and ids and their place in the list; new powers are put in by level, and old saved selections are moved to follow them.
   Healing is not touched here (see heal_scaling.js). The core "Spell" of a mage or sorcerer is the scroll in hand and is not changed.
   ========================================================================== */
(function(){
if(typeof CLASSES==='undefined'||typeof MX==='undefined')return;
const K=.0035,KL=.002,GT=.4;
const isCaster=n=>n==='Mage'||n==='Sorcerer';
const clsOf=h=>{const i=G.heroes.indexOf(h);return i>=0&&HERO_DEF[i]?HERO_DEF[i].cls:'Warrior'};
const heroIdx=h=>G.heroes.indexOf(h);
function uW(h){const r=heroDmgRange(h),w=heroWeapon(h);const crit=weaponCrit(w)+(w&&w.dbl||0)+ringSum(h,'dbl')+pasH(h,'crit');return (r[0]+r[1])/2*(1+pasH(h,'dmgPct'))*(1+.5*crit)}
function uM(h){return (intB(h)+magicBonus(h)+8)*(1+pasH(h,'spellPct'))}
function psU(h){return isCaster(clsOf(h))?uM(h):uW(h)}
const gF=(L,u)=>(1+K*Math.max(0,L-u))*(1+KL*L);
function useHero(){ // the hero who is using a power now
  try{const h=G.heroes[G.curHero===undefined?G.sel:G.curHero];if(h)return h}catch(e){}
  return null;
}
function cardHero(){ // the hero whose card is on screen (the powers page), else the selected hero
  try{if(G.inv&&G.inv.open&&G.heroes[G.inv.hero])return G.heroes[G.inv.hero];const h=G.heroes[G.sel||0];if(h)return h}catch(e){}
  return null;
}
const rng=(M,u)=>{const a=[1,2];a._M=M;a._u=u;return a}; // a damage range for the spell code, that is replaced by a number worked out from the hero (see mxDmg below)

/* [kind, key, cost, role, options]  kind c: a class power by name, x: a spell by id, n: a new power.   role s: single target, g: area.
   options: dot: share of the total that is damage over time. p: the plain words of the card (the number is added by the game). */
const E_CLS={Warrior:.31,Barbarian:.30,Paladin:.25,Ranger:.35,Archer:.36,Thief:.38,Assassin:.33,Mage:.20,Sorcerer:.20,Priest:.20,Monk:.40,Goat:.36};
const SPEC={
Warrior:[
 ['c','Power Strike',6,'s',{p:'A crushing blow.'}],
 ['c','Cleave',8,'s',{p:'Two heavy swings that never miss.'}],
 ['x','w30',11,'s',{dot:.25,p:'A low cut to the legs: it slows the foe and leaves it bleeding.'}],
 ['n',{name:'Skullsplitter',lv:50,type:'melee'},14,'s',{p:'A downward blow aimed at the helm.'}],
 ['c',"Titan's Fury",17,'s',{p:'The strike that wins wars.'}],
 ['n',{name:'Worldsplitter',lv:80,type:'melee'},22,'s',{p:'A blow that cracks the ground under the foe.'}]],
Barbarian:[
 ['c','Rage Blow',8,'s',{p:'A wild swing with everything behind it.'}],
 ['x','b20',10,'s',{dot:.35,p:'Claws tear the foe ahead and leave it bleeding.'}],
 ['n',{name:'Skull Cleaver',lv:50,type:'melee'},14,'s',{p:'One chop, then the foe sits down.'}],
 ['c','Avatar of Ruin',19,'s',{p:'The hills themselves swing the axe.'}],
 ['n',{name:"Mountain's Wrath",lv:80,type:'melee'},26,'s',{p:'A roar, a leap and a blow like a landslide.'}],
 ['x','b40',10,'g',{p:'A fist into the ground: foes within 3 squares are thrown down for 2 rounds.'}],
 ['c','Whirlwind',13,'g',{p:'Spin and hit every foe within 2 squares.'}]],
Paladin:[
 ['c','Smite',6,'s',{p:'A holy blow, doubled against skeletons.'}],
 ['x','p20',9,'s',{p:'Golden chains hold the foe ahead for 4 rounds and burn it.'}],
 ['n',{name:'Righteous Blow',lv:50,type:'melee',undead:1},13,'s',{p:'A blow that rings like a bell, doubled against skeletons.'}],
 ['c','Judgment',16,'s',{p:'The sentence is carried out. Doubled against skeletons.'}],
 ['n',{name:'Sunbrand',lv:80,type:'melee',undead:1},22,'s',{p:'The blade burns white. Doubled against skeletons.'}],
 ['x','p40',11,'g',{p:'Holy fire on foes within 3 squares, doubled against skeletons, and it curses them.'}],
 ['c','Holy Wrath',14,'g',{p:'Holy fire hits every foe within 3 squares. Doubled against skeletons.'}]],
Ranger:[
 ['c','Aimed Shot',5,'s',{p:'A careful shot that never misses, up to 3 tiles away.'}],
 ['c','Pinning Shot',7,'s',{p:'A shot that leaves the target dazed, up to 3 tiles away.'}],
 ['x','r30',9,'s',{dot:.3,p:'A poisoned shot: damage, then poison every round.'}],
 ['c','Rapid Fire',11,'s',{p:'Three arrows that never miss, up to 4 tiles away.'}],
 ['n',{name:'Heartseeker',lv:60,type:'shot',range:4},15,'s',{p:'One arrow, loosed after a long breath, up to 4 tiles away.'}],
 ['n',{name:'Killing Shot',lv:80,type:'shot',range:5},21,'s',{p:'The shot the old hunters talk about, up to 5 tiles away.'}],
 ['x','r40',9,'g',{dot:1,p:'Wasps cover every foe within 3 squares: stung, poisoned and blinded.'}],
 ['x','r50',12,'g',{p:'The forest rises: foes within 4 squares take damage, are rooted and lash out at each other.'}],
 ['c','Arrow Storm',15,'g',{p:'Arrows hit every foe within 4 tiles.'}]],
Archer:[
 ['c','Volley',6,'s',{p:'Two arrows that never miss, up to 4 tiles away.'}],
 ['x','a10',7,'s',{dot:.35,p:'An arrow wrapped in fire: damage, then burning every round.'}],
 ['c','Piercing Shot',9,'s',{p:'A shot that goes through the armour, up to 4 tiles away.'}],
 ['x','a20',11,'s',{p:'An arrow through the foot: damage, and the foe is pinned for 3 rounds.'}],
 ['c','Triple Shot',13,'s',{p:'Three arrows that never miss, up to 4 tiles away.'}],
 ['x','a40',15,'s',{dot:.35,p:'A black arrow: damage and bleeding, and the foe hits weaker for 8 rounds.'}],
 ['x','a50',17,'s',{p:'One arrow of dragon bone. A foe under a quarter health simply dies.'}],
 ['c','Perfect Shot',20,'s',{p:'One shot, up to 5 tiles away.'}],
 ['n',{name:'Starfall Shot',lv:80,type:'shot',range:5},25,'s',{p:'An arrow that comes down out of a clear sky, up to 5 tiles away.'}],
 ['x','a30',10,'g',{p:'A hundred arrows fall on every foe within 4 squares.'}],
 ['c','Arrow Rain',13,'g',{p:'Arrows hit every foe within 4 tiles.'}]],
Thief:[
 ['c','Twin Stab',5,'s',{p:'Two stabs that never miss.'}],
 ['x','t30',8,'s',{dot:.35,p:'A poisoned stab that also slows the foe.'}],
 ['c','Flurry',10,'s',{p:'Three attacks that never miss.'}],
 ['c','Death Mark',13,'s',{p:'One long, patient cut.'}],
 ['n',{name:'Shadowstrike',lv:70,type:'melee'},17,'s',{p:'Out of the dark and into the ribs.'}],
 ['n',{name:'Moonless Kill',lv:80,type:'melee'},22,'s',{p:'The blow nobody sees.'}]],
Assassin:[
 ['c','Backstab',5,'s',{p:'A stab to the back: half as much again against a foe that has not noticed you.'}],
 ['x','s10',7,'s',{dot:.5,p:'A wire round the throat: damage, then bleeding every round.'}],
 ['c','Nerve Strike',9,'s',{p:'A blow to the nerves that leaves the target dazed.'}],
 ['x','s50',11,'s',{p:'A foe under 40% health dies at once.'}],
 ['c','Assassinate',14,'s',{p:'A single blow where it counts.'}],
 ['n',{name:'Needle in the Dark',lv:70,type:'melee'},18,'s',{p:'A thin blade, a thick shadow, a quiet end.'}],
 ['n',{name:"Reaper's Kiss",lv:80,type:'melee'},23,'s',{p:'The last thing the foe ever feels.'}],
 ['x','s40',11,'g',{dot:.6,p:'A cloud of green death over every foe within 3 squares.'}]],
Mage:[
 ['x','m30b',10,'s',{p:'A lance of pure force. The foe takes more from the next blows.'}],
 ['x','m40',13,'s',{p:'A beam of unmaking. A foe under 20% health is dust.'}],
 ['n',{name:'Arcane Ruin',lv:60,type:'mx',aim:'front',col:'#90c0ff',fx:()=>[['dmg',rng(0,60)],['vuln',3]]},17,'s',{p:'The weave unravels around the foe ahead, which then takes more from the next blows.'}],
 ['c','Fireball',12,'g',{p:'Fire hits every foe within 3 tiles.'}],
 ['c','Chain Lightning',15,'g',{p:'Lightning hits every foe within 4 tiles.'}],
 ['c','Meteor',21,'g',{p:'A meteor hits every foe within 4 tiles.'}],
 ['n',{name:'Starfall',lv:80,type:'mx',aim:['area',4],col:'#a0c0ff',fx:()=>[['dmg',rng(0,80)]]},28,'g',{p:'The stars themselves come down on every foe within 4 squares.'}]],
Sorcerer:[
 ['c','Siphon',7,'s',{p:'Drains health from the enemy ahead and heals you for half of it.'}],
 ['n',{name:'Soul Rend',lv:60,type:'mx',aim:'front',col:'#c060e0',fx:()=>[['dmg',rng(0,60)],['curse',4]]},15,'s',{p:'The foe ahead is torn along its seams and hits weaker for 4 rounds.'}],
 ['n',{name:'Annihilating Ray',lv:80,type:'mx',aim:'front',col:'#ff60c0',fx:()=>[['dmg',rng(0,80)]]},22,'s',{p:'A ray of raw ruin through the foe ahead.'}],
 ['x','z30b',9,'g',{p:'Lightning leaps between every foe within 3 squares.'}],
 ['c','Frost Nova',11,'g',{p:'Ice hits every foe within 3 tiles and stuns them.'}],
 ['x','z40',13,'g',{dot:.3,p:'A cone of fire: foes within 3 squares take damage and burn for 5 rounds.'}],
 ['c','Lightning Storm',16,'g',{p:'Lightning hits every foe within 4 tiles.'}],
 ['c','Cataclysm',22,'g',{p:'Ruin hits every foe within 4 tiles.'}]],
Priest:[
 ['n',{name:'Sunlance',lv:65,type:'mx',aim:'front',col:'#fff4c0',fx:()=>[['dmg',rng(0,65)]]},14,'s',{p:'A spear of daylight through the foe ahead.'}],
 ['x','c30b',9,'g',{p:'Hallowed light on every foe within 3 squares, and it curses them.'}],
 ['x','c40',12,'g',{p:'Light from the heavens strikes every foe within 4 squares, and curses them.'}],
 ['n',{name:'Hallowed Fire',lv:50,type:'mx',aim:['area',3],col:'#ffe9a0',fx:()=>[['dmg',rng(0,50)],['curse',3]]},15,'g',{p:'Cold white fire on every foe within 3 squares, and it curses them.'}],
 ['n',{name:'Dawn of Judgement',lv:80,type:'mx',aim:['area',4],col:'#fffbe0',fx:()=>[['dmg',rng(0,80)],['curse',6]]},24,'g',{p:'The sun comes up inside the crypt. Every foe within 4 squares is struck and cursed.'}]],
Monk:[
 ['c','Palm Strike',5,'s',{p:'A focused strike.'}],
 ['c','Flurry of Blows',7,'s',{p:'Three strikes that never miss.'}],
 ['x','k30',9,'s',{dot:.3,p:'A strike that keeps hurting: damage, bleeding and a weakened foe.'}],
 ['c','Stunning Fist',11,'s',{p:'A blow that leaves the target dazed.'}],
 ['c','Dragon Kick',13,'s',{p:'A kick from the height of the stairs.'}],
 ['n',{name:'Fist of the Mountain',lv:70,type:'melee'},16,'s',{p:'Stillness, then a single blow with the weight of the mountain.'}],
 ['n',{name:'Hundred-Fold Palm',lv:80,type:'melee'},20,'s',{p:'A hundred strikes in the space of one breath.'}],
 ['x','k50',12,'g',{p:'Five rapid blows land on every foe within 3 squares.'}]],
Goat:[
 ['c','Headbutt',5,'s',{p:'A hard butt that leaves the foe dazed for a turn.'}],
 ['c','Charge',8,'s',{p:'A charge that leaves the target dazed.'}],
 ['x','g40',10,'s',{p:'A charge from the high peaks: a stunned foe.'}],
 ['c','Rampage',12,'s',{p:'Three butts that never miss.'}],
 ['c','Legend of the Mountain',16,'s',{p:'The mountain remembers, and the target is dazed.'}],
 ['n',{name:'Avalanche of Horns',lv:80,type:'melee',daze:1},22,'s',{p:'Everything the goat has, all at once.'}],
 ['x','g50',13,'g',{p:'A spectral herd thunders through every foe within 5 squares.'}]]
};
/* non-damage powers whose numbers are changed so that the line is in order (buffs get stronger and dearer, control lasts longer and costs more) */
const NUM_FIX=[
 // [class, kind, key, changes]
 ['Warrior','x','w20',{cost:12}],
 ['Warrior','x','w40',{cost:14}],
 ['Barbarian','x','b30',{cost:12}],
 ['Barbarian','x','b50',{cost:21}]
];

/* ---- the numbers of one power ---- */
const MAP={}; // 'class|key' -> {cost,role,M,dot,p}
function noteMap(cls,key,cost,role,o,u){const E=E_CLS[cls],M=cost*E*(role==='g'?GT:1);MAP[cls+'|'+key]={cost,role,M,dot:o.dot||0,p:o.p,u,cls}}
const fmt=n=>String(Math.max(1,Math.round(n)));
function dmgText(info,h){
  if(!h)return '';const U=psU(h),g=gF(h.lvl,info.u),tot=info.M*U*g,dir=tot*(1-info.dot);
  let s='';
  if(dir>=1)s+=` About ${fmt(dir)} damage${info.role==='g'?' to each foe in reach':''} for ${HERO_DEF[heroIdx(h)]?HERO_DEF[heroIdx(h)].name:'the hero'} at level ${h.lvl}.`;
  if(info.dot>0)s+=` ${dir>=1?'Plus about':'About'} ${fmt(tot*info.dot)} more over the following rounds.`;
  return s;
}
function defineDesc(P,info){
  const base=info.p;
  Object.defineProperty(P,'d',{get(){let h=null;try{h=cardHero()}catch(e){}return base+dmgText(info,h)},set(v){},configurable:true,enumerable:true});
}

/* ---- class powers ---- */
const ORIG_LEN={},NEW_N={},OLD_IDX={};
function newClassPower(cls,def,cost){
  const P={lv:def.lv,name:def.name,cost,type:def.type,act:true};
  if(def.type==='mx'){P.mx='pw_'+def.name.toLowerCase().replace(/[^a-z]+/g,'_');P.aim=def.aim;P.fx=def.fx();P.col=def.col}
  if(def.range)P.range=def.range;if(def.undead)P.undead=1;if(def.daze)P.daze=1;
  return P;
}
function setWeaponM(P,info,n){
  const base=info.M/(n||1);
  Object.defineProperty(P,'m',{get(){const h=useHero();return base*gF(h?h.lvl:1,info.u)*(P._bsk?psBackstab():1)},set(v){},configurable:true,enumerable:true});
}
function psBackstab(){try{const f=frontEnemy(1);return f&&!f.e.alert?1.5:1}catch(e){return 1}}
function setCasterDmg(P,info){
  Object.defineProperty(P,'dmg',{get(){
    const h=useHero();if(!h)return [1,2];
    const sp=1+pasH(h,'spellPct'),D=info.M*psU(h)*gF(h.lvl,info.u),c=D/sp-intB(h)-magicBonus(h);
    return [Math.max(1,Math.round(c*.85)),Math.max(2,Math.round(c*1.15))]},set(v){},configurable:true,enumerable:true});
}
function annotateMx(P,fxList,info){ // give the damage ranges and the damage over time of a spell their share of the total
  const dmgs=fxList.filter(f=>f[0]==='dmg'||f[0]==='exec'||f[0]==='undead');
  const dots=fxList.filter(f=>f[0]==='bleed'||f[0]==='poison'||f[0]==='burn');
  const dirShare=info.M*(1-info.dot),dotShare=info.M*info.dot;
  for(const f of dmgs){const r=f[0]==='dmg'?f[1]:f[2];if(r&&typeof r==='object'){r._M=dirShare/dmgs.length;r._u=info.u}}
  for(const f of dots){f._M=dotShare/dots.length;f._u=info.u}
}
function applyClassPower(cls,P,cost,role,o,info){
  P.cost=cost;
  const t=P.type;
  if(t==='twin'){P.type='multi';P.n=2;delete P.a}
  if(t==='backstab'){P.type='melee';P._bsk=1;P.a=0}
  if(t==='butt'){P.type='melee';P.daze=1;P.a=0}
  const ty=P.type;
  if(ty==='melee'){P.a=0;setWeaponM(P,info,1)}
  else if(ty==='multi'||ty==='ranged'){setWeaponM(P,info,P.n||1)}
  else if(ty==='shot'){setWeaponM(P,info,1)}
  else if(ty==='volley'){setWeaponM(P,info,2)}
  else if(ty==='aoe'||ty==='daze'){
    if(P.dmg!==undefined&&isCaster(cls)){delete P.dmg;setCasterDmg(P,info)}
    else{if(P.dmg!==undefined){delete P.dmg}P.m=undefined;setWeaponM(P,info,1)}
  }
  else if(ty==='drain'){delete P.dmg;setCasterDmg(P,info)}
  else if(ty==='mx'){annotateMx(P,P.fx,info)}
  defineDesc(P,info);
}
function psApply(){
  for(const cls in SPEC){
    const c=CLASSES.find(x=>x.name===cls);if(!c)continue;
    ORIG_LEN[cls]=c.powers.length;OLD_IDX[cls]=c.powers.slice();
    const adds=[];
    for(const [kind,key,cost,role,o] of SPEC[cls]){
      if(kind==='c'){
        const P=c.powers.find(p=>p.name===key&&p.act&&!p._ps);if(!P){console.warn('powers_scaling: no class power',cls,key);continue}
        const info={cost,role,M:cost*E_CLS[cls]*(role==='g'?GT:1),dot:o.dot||0,p:o.p,u:P.lv};P._ps=1;
        applyClassPower(cls,P,cost,role,o,info);
        if(c.powers[0]===P&&c.sp){c.sp.cost=cost}
      }else if(kind==='x'){
        const s=MX.find(z=>z.id===key),P=MX_POWER[key];if(!s||!P){console.warn('powers_scaling: no spell',key);continue}
        const info={cost,role,M:cost*E_CLS[cls]*(role==='g'?GT:1),dot:o.dot||0,p:o.p,u:s.lv};
        s.cost=cost;P.cost=cost;annotateMx(P,P.fx,info);defineDesc(P,info);
        Object.defineProperty(s,'d',{get(){let h=null;try{h=cardHero()}catch(e){}return o.p+dmgText(info,h)},set(v){},configurable:true,enumerable:true});
      }else{
        const P=newClassPower(cls,key,cost);
        const info={cost,role,M:cost*E_CLS[cls]*(role==='g'?GT:1),dot:0,p:o.p,u:key.lv};
        applyClassPower(cls,P,cost,role,o,info);
        P._new=1;adds.push(P);
      }
    }
    // put the new powers in by level
    for(const P of adds){let at=c.powers.findIndex(p=>p.lv>P.lv);if(at<0)at=c.powers.length;c.powers.splice(at,0,P)}
    NEW_N[cls]=adds.length;
  }
  // non-damage fixes
  for(const [cls,kind,key,ch] of NUM_FIX){
    if(kind==='x'){const s=MX.find(z=>z.id===key),P=MX_POWER[key];if(!s||!P)continue;
      for(const k in ch){if(k==='cost'){s.cost=ch.cost;P.cost=ch.cost}else if(k==='fx'){s.fx.length=0;ch.fx.forEach(f=>s.fx.push(f))}else if(k==='d'){s.d=ch.d;P.d=ch.d}}}
  }
  // class buffs and control that were out of order
  const W=CLASSES.find(x=>x.name==='Warrior');
  {const sw=W.powers.find(p=>p.name==='Shield Wall'&&p.act);if(sw){sw.amt=8;sw.rounds=10;sw.cost=18;sw.d='The whole party gains +8 armor for 10 rounds.'}}
  const B=CLASSES.find(x=>x.name==='Barbarian');
  {const sr=B.powers.find(p=>p.name==='Savage Roar'&&p.act&&p.type==='daze');if(sr){ // the old class stun becomes a real roar, stronger than the spell of level 10
    sr.name='Thunderous Roar';sr.type='mx';sr.mx='pw_thunderous_roar';sr.aim=['area',3];sr.fx=[['fear',6],['curse',6]];sr.col='#e86a50';sr.cost=13;delete sr.range;
    sr.d='A roar that shakes dust from the roof: every foe within 3 squares flees for 6 rounds and fights weaker for 6.'}}
}
psApply();

/* ---- the spell code: damage from the hero, not from a fixed range ---- */
{const _d=mxDmg;mxDmg=function(hi,r){
  if(r&&r._M!==undefined){const h=G.heroes[hi];return Math.max(1,Math.round(r._M*psU(h)*gF(h.lvl,r._u)*(.85+Math.random()*.3)))}
  return _d.apply(this,arguments)}}
{const _a=mxApplyEnemy;mxApplyEnemy=function(hi,E,fx,P){
  const r=_a.apply(this,arguments);
  try{if(fx&&fx._M!==undefined&&E.st&&E.st[fx[0]]&&typeof E.st[fx[0]]==='object'){const h=G.heroes[hi],n=Math.max(1,fx[1]);E.st[fx[0]].d=Math.max(1,Math.round(fx._M*psU(h)*gF(h.lvl,fx._u)/n))}}catch(e){console.error(e)}
  return r}}

/* ---- the list of powers: saved selections follow the new order ---- */
{const _hp=heroPowers;heroPowers=function(hi){
  const h=G.heroes[hi];
  if(h&&h.powV!==1){
    const cn=HERO_DEF[hi]&&HERO_DEF[hi].cls,old=OLD_IDX[cn];
    if(old&&h.powSel>0){ // an old saved selection counts in the order the list had before: the class powers, then the learned spells
      let n;if(h.powSel<old.length){n=CLASSES.find(x=>x.name===cn).powers.indexOf(old[h.powSel]);if(n<0)n=0}else n=h.powSel-old.length+CLASSES.find(x=>x.name===cn).powers.length;
      h.powSel=n}
    h.powV=1;
  }
  return _hp.apply(this,arguments)}}

/* ---- animations and pictures for the new powers ---- */
try{PFX_RULES.unshift([/hallowed|sunlance|dawn of judg/i,'holy'],[/arcane ruin|soul rend|annihilat|unmaking/i,'bolt'],[/starfall/i,'fire'],[/thunderous roar/i,'shock'],[/worldsplitter|mountain's wrath|avalanche/i,'shock'])}catch(e){}
function pwTintIcons(){
  if(typeof pToneMap!=='function')return;
  const T={'Arcane Ruin':['sp_m40',[10,24,70],[150,200,255]],'Starfall':['sp_z40',[10,10,60],[200,210,255]],'Soul Rend':['sp_z20',[60,10,60],[250,160,240]],'Annihilating Ray':['sp_z50',[60,10,40],[255,150,200]],
    'Sunlance':['sp_c40',[70,56,10],[255,244,170]],'Hallowed Fire':['sp_c30b',[60,50,10],[255,236,160]],'Dawn of Judgement':['sp_c40',[60,60,40],[255,252,224]],'Thunderous Roar':['sp_b10',[70,20,10],[255,160,120]]};
  for(const c of CLASSES)for(const p of c.powers){
    const t=T[p.name];if(!t||p.icn)continue;const id='sp_'+p.mx;
    if(IMG[id]){p.icn=id;continue}
    const b=IMG[t[0]]||(t[0]==='sp_c30b'?IMG.sp_c30||IMG.sp_c40:null);if(!b)continue;
    IMG[id]=pToneMap(b,t[1],t[2],1.6,.9,0);p.icn=id}
}
{const _m=typeof mxTintIcons==='function'?mxTintIcons:null;if(_m)mxTintIcons=function(){_m.apply(this,arguments);try{pwTintIcons()}catch(e){console.error(e)}}}
window.PS={K,KL,GT,E_CLS,SPEC,MAP,psU,gF,uW,uM,NEW_N,ORIG_LEN};
})();
