/* ==========================================================================
   THE WIZARD'S SPELLS. A shop (in Khemetra's Merchants' Quarter and in Ironhill) sells five spells to every class, at levels 10, 20, 30,
   40 and 50 for 500, 1000, 1500, 2000 and 2500 gold. A bought spell is memorised by that hero and joins the power page.
   Spells hold, sleep, scare, curse, burn, bleed and poison enemies, turn them into sheep and cows, make them fight each other, and more.
   The enemy side of it (what happens on an enemy's turn) is mxEnemyAct, called first thing from enemyAct.
   ========================================================================== */
const MX_PRICE={10:500,20:1000,30:1500,40:2000,50:2500},MX_COST={10:6,20:9,30:12,40:15,50:18};
const MX=[],MX_POWER={};
/* mx(class, level, id, name, aim, effects, what it does, colour)
   aim: 'front' (the foe ahead, up to 4 squares), ['area',n] (foes within n squares), 'party', 'self', 'dead'
   effects: [kind, ...]  dmg [a,b] | hold n | sleep n | fear n | curse n | bleed n d | poison n d | burn n d | blind n | confuse n | poly kind n | vuln n | slow n
            banish | exec pct [a,b] | steal k | heal [a,b] | healpct p | buff key amt rounds | cleanse | revive pct | feed n | surge */
function mx(cls,lv,id,name,aim,fx,d,col){MX.push({cls,lv,id,name,aim,fx,d,col,cost:MX_COST[lv],price:MX_PRICE[lv]})}
mx('Warrior',10,'w10','Intimidating Shout',['area',3],[['fear',4]],'A roar that sends every foe within 3 squares running for 4 rounds.','#e86a50');
mx('Warrior',20,'w20','Shield Wall',  'party',[['buff','armor',5,8]],'The whole party locks shields: armor +5 for 8 rounds.','#6a9ae8');
mx('Warrior',30,'w30','Hamstring',    'front',[['dmg',[20,30]],['slow',6],['bleed',6,4]],'A low cut to the legs: damage, slows the foe and leaves it bleeding.','#d04040');
mx('Warrior',40,'w40','Battle Standard','party',[['buff','dmgPct',.25,10],['buff','hitPct',.1,10]],'A raised banner: the party deals 25% more damage and hits 10% more often for 10 rounds.','#e8c040');
mx('Warrior',50,'w50',"Warlord's Challenge",['area',4],[['confuse',4],['vuln',4]],'Every foe within 4 squares turns on its neighbours, and takes more damage while it does.','#e8a040');
mx('Barbarian',10,'b10','Savage Roar',['area',3],[['fear',4],['curse',4]],'A bestial roar: foes within 3 squares flee and fight weaker.','#e86a50');
mx('Barbarian',20,'b20','Rend','front',[['dmg',[24,34]],['bleed',8,4]],'Claws tear the foe ahead and leave it bleeding for 8 rounds.','#d04040');
mx('Barbarian',30,'b30','Blood Frenzy','self',[['buff','dmgPct',.6,6],['buff','crit',.15,6]],'Red rage: +60% damage and +15% double hits for 6 rounds.','#ff4040');
mx('Barbarian',40,'b40','Earthshatter',['area',3],[['dmg',[30,44]],['hold',2]],'A fist into the ground: foes within 3 squares take damage and are thrown down for 2 rounds.','#c09050');
mx('Barbarian',50,'b50','Avatar of the Bear','self',[['buff','dmgPct',1,8],['buff','regen',3,8],['buff','armor',4,8]],'The bear spirit takes you: double damage, fast healing and +4 armor for 8 rounds.','#b07840');
mx('Paladin',10,'p10','Lay on Hands','front|ally',[['heal',[40,60]],['cleanse']],'Heals the most wounded ally for 40-60 and cleanses their afflictions.','#ffe9a0');
mx('Paladin',20,'p20','Holy Chains','front',[['dmg',[18,26]],['hold',4]],'Golden chains hold the foe ahead for 4 rounds and burn it.','#f0d060');
mx('Paladin',30,'p30','Aura of Courage','party',[['buff','dmgPct',.15,12],['buff','hitPct',.1,12],['buff','dodge',.08,12]],'The party fights bolder for 12 rounds: +15% damage, +10% to hit and enemies miss more.','#fff0b0');
mx('Paladin',40,'p40','Smite Evil',['area',3],[['dmg',[30,40]],['curse',6]],'Holy fire on foes within 3 squares, doubled against the undead, and cursing them.','#fff8d0');
mx('Paladin',50,'p50','Avenging Angel','party',[['buff','dmgPct',.4,8],['heal',[30,40],1]],'An angel at your side: the party heals for 30-40 and deals 40% more damage for 8 rounds.','#ffe070');
mx('Ranger',10,'r10','Entangling Roots',['area',3],[['hold',3]],'Roots burst from the ground and hold every foe within 3 squares for 3 rounds.','#58a040');
mx('Ranger',20,'r20','Bark Skin','party',[['buff','armor',6,10]],'The skin of the whole party toughens like bark: armor +6 for 10 rounds.','#8a6a3a');
mx('Ranger',30,'r30','Poison Arrow','front',[['dmg',[26,36]],['poison',10,4]],'A poisoned shot: damage, then 4 poison damage each round for 10 rounds.','#50d050');
mx('Ranger',40,'r40','Swarm of Wasps',['area',3],[['poison',6,3],['blind',5]],'Wasps cover every foe within 3 squares: stung, poisoned and unable to see.','#f0c030');
mx('Ranger',50,'r50','Wrath of the Forest',['area',4],[['dmg',[36,52]],['hold',3],['confuse',3]],'The forest itself rises: foes take damage, are rooted and lash out at each other.','#2a8a30');
mx('Archer',10,'a10','Flaming Arrow','front',[['dmg',[20,28]],['burn',5,5]],'An arrow wrapped in fire: damage and 5 burn damage each round for 5 rounds.','#ff8030');
mx('Archer',20,'a20','Pinning Shot','front',[['dmg',[22,32]],['hold',3]],'An arrow through the foot: damage and pinned in place for 3 rounds.','#c0a060');
mx('Archer',30,'a30','Rain of Arrows',['area',4],[['dmg',[26,38]]],'A hundred arrows fall on every foe within 4 squares.','#e8d8a8');
mx('Archer',40,'a40','Cursed Arrow','front',[['dmg',[30,42]],['curse',8],['bleed',8,4]],'A black arrow: damage, bleeding, and the foe hits weaker for 8 rounds.','#a060d0');
mx('Archer',50,'a50','Dragonbone Arrow','front',[['exec',.25,[70,100]]],'One arrow of dragon bone: 70-100 damage, and a foe under a quarter health simply dies.','#ffe090');
mx('Thief',10,'t10','Pickpocket','front',[['steal',3]],'Lift gold from the foe ahead. You get more at higher levels.','#e8c840');
mx('Thief',20,'t20','Smoke Bomb',['area',3],[['blind',5]],'Thick smoke blinds every foe within 3 squares for 5 rounds: they miss much more often.','#707080');
mx('Thief',30,'t30','Venom Blade','front',[['dmg',[26,36]],['poison',8,4],['slow',6]],'A poisoned stab that also slows the foe.','#60e060');
mx('Thief',40,'t40','Befuddle',['area',4],[['confuse',4]],'Foes within 4 squares see enemies everywhere and fight each other for 4 rounds.','#c070e0');
mx('Thief',50,'t50','Master Heist',['area',4],[['steal',14],['hold',2]],'Rob every foe within 4 squares blind and leave them frozen with surprise for 2 rounds.','#ffd040');
mx('Assassin',10,'s10','Garrote','front',[['dmg',[16,24]],['bleed',10,5]],'A wire round the throat: damage and 5 bleeding damage each round for 10 rounds.','#d04040');
mx('Assassin',20,'s20','Marked for Death','front',[['vuln',8],['curse',8]],'The foe takes 50% more damage from every blow for 8 rounds and hits weaker.','#e04040');
mx('Assassin',30,'s30','Night Terror',['area',4],[['fear',5]],'Nightmares walk among the foes within 4 squares: they flee for 5 rounds.','#8060a0');
mx('Assassin',40,'s40','Poison Cloud',['area',3],[['dmg',[22,32]],['poison',8,5]],'A cloud of green death over every foe within 3 squares.','#70d070');
mx('Assassin',50,'s50','Death Warrant','front',[['exec',.4,[80,110]]],'A foe under 40% health dies at once. Otherwise it takes 80-110 damage.','#c02020');
mx('Mage',10,'m10','Hold Person','front',[['hold',5]],'The foe ahead cannot move or act for 5 rounds.','#70a8ff');
mx('Mage',20,'m20','Polymorph: Sheep','front',[['poly','sheep',8]],'The foe becomes a harmless sheep for 8 rounds. Baa.','#f0f0f0');
mx('Mage',30,'m30','Mirror Images','party',[['buff','dodge',.25,8]],'Ghostly copies of the party draw blows: enemies miss 25% more for 8 rounds.','#90c0ff');
mx('Mage',40,'m40','Disintegrate','front',[['exec',.2,[90,130]]],'A beam of unmaking: 90-130 damage, and a foe under 20% health is dust.','#90ffb0');
mx('Mage',50,'m50','Time Stop','all',[['hold',3]],'Time stops for every foe in sight for 3 rounds. The party moves freely.','#a0d0ff');
mx('Sorcerer',10,'z10','Wail of Fear',['area',4],[['fear',5]],'A wail that turns the courage of every foe within 4 squares to water.','#c060e0');
mx('Sorcerer',20,'z20','Polymorph: Cow','front',[['poly','cow',8]],'The foe becomes a placid cow for 8 rounds. Moo.','#d8b890');
mx('Sorcerer',30,'z30','Wild Surge','front',[['surge']],'Raw chaos: a random mighty effect. Damage, a sheep, a heal, a hold. Anything can happen.','#ff60c0');
mx('Sorcerer',40,'z40',"Dragon's Breath",['area',3],[['dmg',[34,48]],['burn',5,6]],'A cone of fire: foes within 3 squares take damage and burn for 5 rounds.','#ff6020');
mx('Sorcerer',50,'z50','Rift of Banishing','front',[['banish']],'Opens a rift that swallows the foe ahead. Great beasts and bosses take a heavy blow instead.','#8040c0');
mx('Priest',10,'c10','Purify','party',[['cleanse'],['heal',[12,20],1]],'Cleanses every affliction on the party and heals everyone for 12-20.','#e8f0ff');
mx('Priest',20,'c20','Turn Undead',['area',4],[['undead',10,[40,60]]],'Undead within 4 squares flee for 10 rounds or are destroyed. Living foes cower for 2 rounds.','#fff0b0');
mx('Priest',30,'c30','Sanctuary Ward','party',[['buff','armor',4,10],['buff','dodge',.15,10]],'A sacred ward: armor +4 and enemies miss 15% more for 10 rounds.','#ffe9a0');
mx('Priest',40,'c40','Divine Wrath',['area',4],[['dmg',[34,50]],['curse',6]],'Light from the heavens strikes every foe within 4 squares, and curses them.','#fffbe0');
mx('Priest',50,'c50','Resurrection','dead',[['revive',.7],['healpct',.5]],'Raises every fallen hero at 70% health and heals the living for half.','#ffd860');
mx('Monk',10,'k10','Pressure Point','front',[['hold',4]],'A finger on the right spot: the foe ahead cannot move for 4 rounds.','#70e0a0');
mx('Monk',20,'k20','Wholeness of Body','self',[['heal',[50,70]],['cleanse']],'You heal 50-70 and cleanse every affliction on you.','#70e090');
mx('Monk',30,'k30','Quivering Palm','front',[['dmg',[30,44]],['bleed',6,5],['curse',6]],'A strike that keeps hurting: damage, bleeding and a weakened foe.','#b060e0');
mx('Monk',40,'k40','Mantra of Peace',['area',4],[['sleep',5]],'Foes within 4 squares fall asleep until they are hurt, or 5 rounds pass.','#90b0ff');
mx('Monk',50,'k50','Thousand Fists',['area',3],[['dmg',[26,36]],['dmg',[26,36]],['dmg',[26,36]],['dmg',[26,36]],['dmg',[26,36]]],'Five rapid blows land on every foe within 3 squares.','#ffd040');
mx('Goat',10,'g10','Bleat of Doom',['area',4],[['fear',4]],'A bleat so awful that every foe within 4 squares runs for 4 rounds.','#c070e0');
mx('Goat',20,'g20','Eat Anything','party',[['cleanse'],['feed',30],['heal',[16,24],1]],'The goat eats everything, then the party feels better: cleansed, fed and healed.','#a0c860');
mx('Goat',30,'g30','Polymorph: Goat','front',[['poly','goat',10]],'The foe becomes a goat for 10 rounds. It seems pleased.','#e8e8d8');
mx('Goat',40,'g40','Mountain Charge','front',[['dmg',[40,60]],['hold',3]],'A charge from the high peaks: heavy damage and a stunned foe.','#d0a060');
mx('Goat',50,'g50','Great Stampede',['area',5],[['dmg',[44,64]],['hold',2]],'A spectral herd thunders through every foe within 5 squares.','#e8c880');
for(const s of MX)MX_POWER[s.id]={lv:s.lv,act:true,cost:s.cost,type:'mx',name:s.name,d:s.d,col:s.col,mx:s.id,aim:s.aim,fx:s.fx,icn:'sp_'+s.id};
const MX_BY_CLASS={};for(const s of MX)(MX_BY_CLASS[s.cls]=MX_BY_CLASS[s.cls]||[]).push(s);
['sheep','cow','frog'].forEach(n=>{if(typeof loadImg==='function')loadImg(n,'assets/'+n+'.png')});
for(const s of MX){if(typeof loadImg==='function')loadImg('sp_'+s.id,'assets/sp_'+s.id+'.png')}
/* a hero's powers: the class powers, then every spell they have memorised */
function heroPowers(hi){
  const c=CLASSES[HERO_DEF[hi].clsId],h=G.heroes[hi];
  if(!h||!h.learned||!h.learned.length)return c.powers;
  return c.powers.concat(h.learned.map(id=>MX_POWER[id]).filter(Boolean));
}
/* ---------------------------------------------------------------- casting ---------------------------------------------------------------- */
const MX_BOSS=new Set(['boss','gandrick','halbrecht','mayor','wraith','overseer','cyclops']);
function mxIsBoss(e){const d=ENEMY_DEF[e.t];return !!(d.boss||MX_BOSS.has(e.t)||(d.xp||0)>=500)}
function mxName(e){const d=ENEMY_DEF[e.t];return e.poly?e.poly.name:d.name}
const MX_POLY={sheep:{img:'sheep',w:.62,name:'sheep',snd:'Baa!'},cow:{img:'cow',w:.9,name:'cow',snd:'Moo.'},goat:{img:'goat',w:.6,name:'goat',snd:'Maa-aa!'},frog:{img:'frog',w:.4,name:'frog',snd:'Ribbit.'},chicken:{img:'chicken',w:.4,name:'chicken',snd:'Bwaak!'}};
function mxDmg(hi,r){
  const h=G.heroes[hi],base=rnd(r[0],r[1])*(1+h.lvl*.035),stat=Math.max(0,Math.max(h.int,h.str,h.dex)-8)/3;
  return Math.max(1,Math.round((base+stat)*(1+pas(hi,'spellPct'))));
}
function mxFloat(e,t,c){if(typeof addFloat==='function')addFloat(e.sx,e.sy-26,t,c||'#ffe9a0')}
function mxApplyEnemy(hi,E,fx,P){
  const h=G.heroes[hi],st=E.st||(E.st={}),boss=mxIsBoss(E),nm=mxName(E),k=fx[0];
  const ctl=n=>boss?Math.max(1,Math.floor(n/2)):n;
  if(boss&&['hold','sleep','fear','confuse','poly'].includes(k)&&Math.random()<.5){msg(`The ${nm} shrugs it off.`,'#c8b898');mxFloat(E,'Resists','#c8b898');return}
  switch(k){
    case 'dmg':{let d=mxDmg(hi,fx[1]);if(P&&P.mx==='p40'&&E.t==='skel')d*=2;hurtEnemy(E,d);break}
    case 'hold':st.hold=Math.max(st.hold||0,ctl(fx[1]));msg(`The ${nm} is held fast.`,'#a0c8ff');mxFloat(E,'Held','#a0c8ff');break;
    case 'sleep':st.sleep=Math.max(st.sleep||0,ctl(fx[1]));msg(`The ${nm} falls asleep.`,'#90b0ff');mxFloat(E,'Asleep','#90b0ff');break;
    case 'fear':st.fear=Math.max(st.fear||0,ctl(fx[1]));msg(`The ${nm} turns to flee.`,'#e0a0f0');mxFloat(E,'Scared','#e0a0f0');break;
    case 'curse':st.curse=Math.max(st.curse||0,fx[1]);msg(`The ${nm} is cursed.`,'#c080e0');mxFloat(E,'Cursed','#c080e0');break;
    case 'bleed':st.bleed={n:fx[1],d:fx[2]+Math.floor(h.lvl/12)};msg(`The ${nm} is bleeding.`,'#e06060');mxFloat(E,'Bleeding','#e06060');break;
    case 'poison':st.poison={n:fx[1],d:fx[2]+Math.floor(h.lvl/12)};msg(`The ${nm} is poisoned.`,'#70e070');mxFloat(E,'Poisoned','#70e070');break;
    case 'burn':st.burn={n:fx[1],d:fx[2]+Math.floor(h.lvl/12)};msg(`The ${nm} is on fire.`,'#ff9040');mxFloat(E,'Burning','#ff9040');break;
    case 'blind':st.blind=Math.max(st.blind||0,fx[1]);msg(`The ${nm} cannot see.`,'#b0b0c0');mxFloat(E,'Blind','#b0b0c0');break;
    case 'confuse':st.confuse=Math.max(st.confuse||0,ctl(fx[1]));msg(`The ${nm} sees enemies everywhere.`,'#e080e0');mxFloat(E,'Confused','#e080e0');break;
    case 'vuln':st.vuln=Math.max(st.vuln||0,fx[1]);msg(`The ${nm} lowers its guard.`,'#e8a060');mxFloat(E,'Exposed','#e8a060');break;
    case 'slow':st.slow=Math.max(st.slow||0,fx[1]);msg(`The ${nm} slows down.`,'#a0b0d0');mxFloat(E,'Slowed','#a0b0d0');break;
    case 'poly':{
      if(boss){msg(`The ${nm} is too mighty to change.`,'#c8b898');mxFloat(E,'Immune','#c8b898');break}
      const p=MX_POLY[fx[1]];E.poly={img:p.img,w:p.w,name:p.name,left:fx[2]};st.hold=0;st.fear=0;st.confuse=0;
      msg(`The ${ENEMY_DEF[E.t].name} is turned into a ${p.name}! ${p.snd}`,'#ffe9a0');mxFloat(E,p.snd,'#ffe9a0');break}
    case 'banish':{
      if(boss){const d=Math.round(E.maxhp*.25);hurtEnemy(E,d);msg(`The rift tears a great piece from the ${nm}.`,'#c090ff');break}
      msg(`The ${nm} is swallowed by the rift!`,'#c090ff');hurtEnemy(E,E.hp+1);break}
    case 'exec':{
      if(E.hp<=E.maxhp*fx[1]&&!boss){msg(`The ${nm} falls dead at once.`,'#ffe090');hurtEnemy(E,E.hp+1)}
      else hurtEnemy(E,mxDmg(hi,fx[2]));break}
    case 'steal':{try{honourAdd(-1,'you picked a pocket')}catch(e){};const g=Math.max(1,Math.round(rnd(fx[1]*.6,fx[1]*1.4)*(1+h.lvl*.3)));G.gold+=g;msg(`${HERO_DEF[hi].name} steals ${g} gold from the ${nm}.`,'#ffd76a');mxFloat(E,'+'+g,'#ffd76a');break}
    case 'undead':{
      if(E.t==='skel'||/skel|ghost|spectre|wraith|mummy/.test(E.t)){
        if(!boss&&E.hp<=E.maxhp*.5){msg(`The ${nm} crumbles to nothing.`,'#fff0b0');hurtEnemy(E,E.hp+1)}
        else{st.fear=Math.max(st.fear||0,fx[1]);hurtEnemy(E,mxDmg(hi,fx[2]));mxFloat(E,'Turned','#fff0b0')}
      }else{st.hold=Math.max(st.hold||0,2);mxFloat(E,'Cowers','#e0d8a0')}
      break}
    case 'surge':{
      const r=Math.random();
      if(r<.3)mxApplyEnemy(hi,E,['dmg',[70,110]],P);
      else if(r<.5)mxApplyEnemy(hi,E,['poly',Math.random()<.5?'sheep':'frog',8],P);
      else if(r<.7)mxApplyEnemy(hi,E,['hold',5],P);
      else if(r<.85){mxApplyParty(hi,['heal',[40,60],1]);msg('The surge washes warm over the party.','#9ae0a0')}
      else mxApplyEnemy(hi,E,['fear',6],P);
      break}
  }
}
function mxApplyParty(hi,fx,P){
  const def=HERO_DEF[hi],k=fx[0];
  if(k==='buff'){
    const key=fx[1],self=P&&P.aim==='self';
    G.buffs=G.buffs.filter(b=>!(b.name===P.name&&b.b===key&&b.hi===(self?hi:-1)));
    G.buffs.push({name:P.name,b:key,amt:fx[2],left:fx[3],hi:self?hi:-1});
  }else if(k==='heal'){
    const who=fx[2]?livingHeroes():(()=>{const l=livingHeroes().filter(j=>G.heroes[j].hp<G.heroes[j].max);if(!l.length)return livingHeroes().slice(0,1);let b=l[0];for(const j of l)if(G.heroes[j].hp/G.heroes[j].max<G.heroes[b].hp/G.heroes[b].max)b=j;return [b]})();
    for(const j of (P&&P.aim==='self'?[hi]:who)){const g=G.heroes[j],a=Math.round((rnd(fx[1][0],fx[1][1])+Math.floor(Math.max(0,G.heroes[hi].int-8)/3))*(1+pas(hi,'healPct')));g.hp=Math.min(g.max,g.hp+a);if(typeof addFloat==='function')addFloat(portraitX(j)+19,250,'+'+a,'#7fe08a')}
    sfx('heal');
  }else if(k==='healpct'){for(const j of livingHeroes()){const g=G.heroes[j];g.hp=Math.min(g.max,g.hp+Math.round(g.max*fx[1]));if(typeof addFloat==='function')addFloat(portraitX(j)+19,250,'+',' #7fe08a'.trim())}sfx('heal')}
  else if(k==='cleanse'){
    const sel=P&&P.aim==='self'?[hi]:P&&P.aim==='front|ally'?null:livingHeroes();
    let n=0;for(const e of afflList().slice()){const A=AFFL[e.id];if(A&&A.kind==='bad'&&(!sel||sel.includes(e.hi))){afflRemove(e,false);n++}}
    if(n)msg(n===1?'An affliction is lifted.':n+' afflictions are lifted.','#a8e0e8');
  }
  else if(k==='revive'){for(let j=0;j<4;j++){const g=G.heroes[j];if(!g.alive){g.alive=true;g.hp=Math.max(1,Math.ceil(g.max*fx[1]));msg(`${HERO_DEF[j].name} rises!`,'#ffe9a0')}}sfx('level')}
  else if(k==='feed'){for(const g of G.heroes)if(g.alive)g.food=Math.min(100,g.food+fx[1])}
}
function mxTargets(hi,aim){
  if(aim==='front'||aim==='front|ally'){const f=frontEnemy(4);return f?[f.e]:[]}
  if(aim==='all')return G.enemies.filter(e=>e.hp>0&&Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<=8&&hasLOS(G.P.x,G.P.y,e.x,e.y));
  if(Array.isArray(aim)&&aim[0]==='area')return G.enemies.filter(e=>e.hp>0&&Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<=aim[1]&&hasLOS(G.P.x,G.P.y,e.x,e.y));
  return null; // party-side
}
function mxCast(i,P){
  const h=G.heroes[i],def=HERO_DEF[i];
  if(h.mp<P.cost){msg(`${def.name} lacks the ${def.mpn.toLowerCase()}.`,'#d09a80');return false}
  const ally=P.aim==='party'||P.aim==='self'||P.aim==='front|ally'||P.aim==='dead';
  if(P.aim==='dead'&&!G.heroes.some(x=>!x.alive)&&G.heroes.every(x=>x.hp>=x.max)){msg('Nobody needs it.');return false}
  let T=null;
  if(!ally||P.aim==='front|ally'){
    T=mxTargets(i,P.aim==='front|ally'?'front':P.aim);
    if(!T.length&&P.aim!=='front|ally'){msg('No foe in range.','#d09a80');return false}
    if(P.aim==='front|ally'&&!T.length)T=[];
  }
  h.mp-=P.cost;sfx('spell');
  msg(`${def.name} casts ${P.name}!`,P.col||'#ffe9a0');
  if(typeof G!=='undefined')G.shake=Math.max(G.shake||0,.12);
  const party=P.fx.filter(f=>['buff','heal','healpct','cleanse','revive','feed'].includes(f[0])),foe=P.fx.filter(f=>!party.includes(f));
  if(P.aim==='front|ally'){for(const f of party)mxApplyParty(i,f,P);for(const E of T)for(const f of foe)mxApplyEnemy(i,E,f,P)}
  else if(ally)for(const f of P.fx)mxApplyParty(i,f,P);
  else{for(const E of T)for(const f of foe){if(E.hp>0)mxApplyEnemy(i,E,f,P)}for(const f of party)mxApplyParty(i,f,P)}
  return true;
}
/* ---------------------------------------------------------------- the enemy's turn ---------------------------------------------------------------- */
function mxFreeStep(e,pick){
  const opts=DIRS.map(d=>[e.x+d[0],e.y+d[1]]).filter(([x,y])=>!cellBlocked(x,y)&&!enemyAt(x,y)&&!(x===G.P.x&&y===G.P.y));
  if(!opts.length)return false;
  const o=pick(opts);e.x=o[0];e.y=o[1];return true;
}
function mxEnemyAct(e){
  const st=e.st;if(!st)return undefined;
  if(e.surr)return 0; // a man who has thrown down his sword does not fight
  const nm=mxName(e);
  for(const k of ['bleed','poison','burn']){
    const s=st[k];
    if(s&&s.n>0){s.n--;const d=s.d;hurtEnemy(e,d);msg(`The ${nm} ${k==='burn'?'burns':k==='poison'?'sickens':'bleeds'} for ${d}.`,k==='burn'?'#ff9040':k==='poison'?'#70e070':'#e06060');if(e.hp<=0)return 220}
    if(s&&s.n<=0)st[k]=null;
  }
  const tick=()=>{for(const k of ['curse','blind','vuln'])if(st[k]>0)st[k]--};
  if(st.hold>0){st.hold--;tick();msg(`The ${nm} is held fast.`,'#a0c8ff');return 130}
  if(st.sleep>0){st.sleep--;tick();msg(`The ${nm} sleeps.`,'#90b0ff');return 130}
  if(e.poly){
    e.poly.left--;
    if(e.poly.left<=0){msg(`The ${e.poly.name} shimmers and becomes a ${ENEMY_DEF[e.t].name} again!`,'#ffd890');e.poly=null;return 200}
    tick();
    if(Math.random()<.5)msg(`The ${e.poly.name} ${e.poly.name==='cow'?'chews placidly':e.poly.name==='sheep'?'bleats and wanders':e.poly.name==='frog'?'hops about':'wanders about'}.`,'#e8dcb4');
    mxFreeStep(e,o=>o[rnd(0,o.length-1)]);return 130;
  }
  if(st.fear>0){
    st.fear--;tick();
    const d0=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);
    msg(`The ${nm} runs away in terror.`,'#e0a0f0');
    mxFreeStep(e,o=>{let b=o[0],bd=-1;for(const q of o){const d=Math.abs(q[0]-G.P.x)+Math.abs(q[1]-G.P.y)+Math.random();if(d>bd){bd=d;b=q}}return bd>d0-1?b:o[rnd(0,o.length-1)]});
    return 130;
  }
  if(st.confuse>0){
    st.confuse--;tick();
    const others=G.enemies.filter(o=>o!==e&&o.hp>0&&!o.poly);
    let tgt=null,bd=99;for(const o of others){const d=Math.abs(o.x-e.x)+Math.abs(o.y-e.y);if(d<bd){bd=d;tgt=o}}
    if(!tgt||bd>9){msg(`The ${nm} swings at shadows.`,'#e080e0');mxFreeStep(e,o=>o[rnd(0,o.length-1)]);return 150}
    if(bd===1){
      const sx=enemyStat(e.t,e.lvl),d=rnd(sx.dmg[0],sx.dmg[1]);hurtEnemy(tgt,d);e.lunge=1;
      msg(`The ${nm} attacks the ${mxName(tgt)} for ${d}!`,'#f0a0f0');return 300;
    }
    mxFreeStep(e,o=>{let b=o[0],bd2=99;for(const q of o){const d=Math.abs(q[0]-tgt.x)+Math.abs(q[1]-tgt.y)+Math.random()*.5;if(d<bd2){bd2=d;b=q}}return b});
    msg(`The ${nm} stumbles towards the ${mxName(tgt)}.`,'#e080e0');return 150;
  }
  if(st.slow>0){st.slow--;st.flip=!st.flip;if(st.flip){tick();msg(`The ${nm} moves sluggishly.`,'#a0b0d0');return 130}}
  tick();
  return undefined;
}
/* what an enemy's own attacks suffer from: cursed enemies hit weaker, blinded ones miss */
function mxMiss(e){const s=e.st;return s&&s.blind>0?.35:(s&&s.curse>0?.12:0)}
function mxMul(e){const s=e.st;return s&&s.curse>0?.7:1}
function mxVuln(e,dmg){const s=e.st;if(!s)return dmg;if(s.sleep>0)s.sleep=0;return s.vuln>0?Math.round(dmg*1.5):dmg}
function mxPlate(e){
  const s=e.st,out=[];if(e.poly)out.push(e.poly.name);
  if(s){if(s.hold>0)out.push('held');if(s.sleep>0)out.push('asleep');if(s.fear>0)out.push('scared');if(s.confuse>0)out.push('confused');if(s.curse>0)out.push('cursed');if(s.blind>0)out.push('blind');if(s.vuln>0)out.push('exposed');if(s.slow>0)out.push('slowed');if(s.bleed&&s.bleed.n>0)out.push('bleeding');if(s.poison&&s.poison.n>0)out.push('poisoned');if(s.burn&&s.burn.n>0)out.push('burning')}
  return out.join(', ');
}
/* ---------------------------------------------------------------- buying: the shop screen ---------------------------------------------------------------- */
function mxLearn(hi,s){
  const h=G.heroes[hi];h.learned=h.learned||[];
  if(h.learned.includes(s.id))return 'Already known.';
  if(h.lvl<s.lv)return `${HERO_DEF[hi].name} must be level ${s.lv}.`;
  if(G.gold<s.price)return `That costs ${s.price} gold.`;
  G.gold-=s.price;h.learned.push(s.id);sfx('level');
  msg(`${HERO_DEF[hi].name} memorises ${s.name}. It joins the power page.`,'#ffe9a0');
  return null;
}
function openSpellShop(){G.talk=null;G.menu='spellshop';G.sshero=G.sshero===undefined?0:G.sshero;G.ssmsg=''}
function drawSpellShop(){
  BTNS=[];veil(.72);bigPanel(14,6,452,308);
  txt("THE WIZARD'S SPELLS",240,22,13,'#d8c88e','center',true);
  txt(`Gold: ${G.gold}`,452,22,9,'#ffe36a','right',true);
  const hi=clamp(G.sshero||0,0,3),h=G.heroes[hi],def=HERO_DEF[hi],list=MX_BY_CLASS[def.cls]||[];
  for(let k=0;k<4;k++){
    const x=24+k*58,sel=k===hi,hh=G.heroes[k],img=portraitImg(k);
    ctx.save();ctx.fillStyle='#0a0806';ctx.fillRect(x,32,50,56);if(img){const sw=Math.min(img.width,img.height*(50/56)),sx=(img.width-sw)/2;ctx.drawImage(img,sx,0,sw,img.height,x,32,50,56)}
    ctx.lineWidth=sel?2.4:1.4;ctx.strokeStyle=sel?'#ffe36a':'#7a6440';ctx.strokeRect(x,32,50,56);ctx.restore();
    txt(HERO_DEF[k].name,x+25,95,7.5,sel?'#ffe9a0':'#c8b898','center',true,undefined,50);
    txt('Lv '+hh.lvl+' '+HERO_DEF[k].cls,x+25,104,6.5,'#9a8a68','center',false,undefined,56);
    btn('ssh'+k,x,32,50,72);
  }
  txt(`${def.name} the ${def.cls}: ${list.length} spells for sale`,24+4*58+10,50,8,'#d8c88e','left',true,undefined,200);
  txt('A bought spell is memorised and joins the power page.',24+4*58+10,62,7.5,'#a89878','left',false,undefined,210);
  if(G.ssmsg)txt(G.ssmsg,24+4*58+10,80,8,'#e8a070','left',true,undefined,210);
  const top=106,rh=38;
  list.forEach((s,k)=>{
    const y=top+k*rh,known=(h.learned||[]).includes(s.id),open=h.lvl>=s.lv,can=open&&G.gold>=s.price&&!known;
    ctx.save();rrect(ctx,22,y,436,rh-3,5);ctx.fillStyle=known?'rgba(30,50,24,.92)':'rgba(40,18,14,.92)';ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle=known?'#7ac060':open?'#a88a48':'#5a4a34';ctx.stroke();ctx.restore();
    const im=IMG['sp_'+s.id];ctx.fillStyle='#120c08';ctx.fillRect(28,y+3,34,34);
    if(im)ctx.drawImage(im,29,y+4,32,32);else{ctx.fillStyle=s.col;ctx.fillRect(34,y+9,22,22)}
    ctx.strokeStyle=s.col;ctx.lineWidth=1.2;ctx.strokeRect(28,y+3,34,34);
    ctx.globalAlpha=open||known?1:.55;
    txt(s.name,70,y+9,9.5,'#ecdca8','left',true,undefined,200);
    txt(`Level ${s.lv}  -  ${s.cost} ${def.mpn.slice(0,4).toLowerCase()}`,70,y+19,7,'#9ac8ff','left');
    wrapText(s.d,310,7.2).slice(0,2).forEach((l,q)=>txt(l,70,y+28+q*8.2,7.2,'#c8bc98','left'));
    ctx.globalAlpha=1;
    if(known)txt('MEMORISED',450,y+13,8,'#9ae0a0','right',true);
    else if(!open)txt(`Needs level ${s.lv}`,450,y+13,8,'#e8905a','right',true);
    else{btnText('ssb'+k,`Buy ${s.price}g`,388,y+4,66,18);if(!can)txt(G.gold<s.price?'too dear':'',450,y+31,6.5,'#e8905a','right')}
  });
  btnText('ssexit','Leave',190,298,100,16);
}
function spellShopBtn(id){
  if(id==='ssexit'){G.menu=false;return}
  let m=/^ssh(\d)$/.exec(id);if(m){G.sshero=+m[1];G.ssmsg='';return}
  m=/^ssb(\d)$/.exec(id);
  if(m){const hi=clamp(G.sshero||0,0,3),list=MX_BY_CLASS[HERO_DEF[hi].cls]||[],s=list[+m[1]];if(!s)return;G.ssmsg=mxLearn(hi,s)||''}
}
/* the wizards behind the counters */
function mxWizard(d,who,line){
  return say(line,[['Show me your spells.',()=>{openSpellShop();return null}],['What do you teach?',()=>say('Five spells for every kind of adventurer, at levels ten, twenty, thirty, forty and fifty. Warriors have shouts and shields, priests have mercy and wrath, thieves have smoke and sleight of hand, and goats have things I do not discuss. Each is memorised, and stays with whoever buys it.',[['Show me your spells.',()=>{openSpellShop();return null}],BYE])],BYE]);
}
khNpc('kh_wizard','Zahir, the court wizard','kh_npc6_4',d=>mxWizard(d,'Zahir','Spells, my friends. Every one is real, every one is sold fairly, and no one has ever been turned into a frog by accident. Not by me, at least. Look around, and ask.'));
khNpc('ih_wizard','Corvin, the hedge wizard','kh_npc6_4',d=>mxWizard(d,'Corvin','A fine day for magic. Ironhill is full of strong arms and weak spells. Let me fix the second part.'));
