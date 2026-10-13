/* ==========================================================================
   THE PARTY AS A COMPANY: skills, trades, camp, bonds, crafting and companions.
   - Skills (lockpicking, persuasion, stealth, appraisal) grow with use and open doors, talk guards round, hide the party and fetch better prices.
   - Trades (healer, smith, scout, cook, alchemist, merchant): each hero may take one; ranks grow with use and give passive perks.
   - Camp: cook, sharpen, tend the sick, tell stories, forage, spar. Camping builds friendships and rivalries, and they matter in a fight.
   - Crafting: recipes learned from healers, alchemists and priests turn herbs and reagents into antidotes, salves, tea and potions.
   - Companions: a goat, a cat or a donkey, each with a use of its own.
   Everything is kept in G.flags, so it saves with the game.
   ========================================================================== */
const SKILLS={
  lockpick:{n:'Lockpicking',d:'Opens locked doors and shuttered houses. Without it, a locked house stays locked.',cls:['Thief','Assassin']},
  persuade:{n:'Persuasion',d:'Talks the watch round and lowers the prices shopkeepers ask. 1% off per level.',cls:['Paladin','Priest','Goat','Barbarian']},
  stealth:{n:'Stealth',d:'Guards notice you from further off or not at all, and enemies wake later.',cls:['Thief','Assassin','Ranger','Archer']},
  appraise:{n:'Appraisal',d:'Knows what things are worth: 1.5% more for everything you sell, per level.',cls:['Mage','Sorcerer','Monk','Warrior']}
};
function skData(){const F=G.flags;return F.skills||(F.skills={lockpick:0,persuade:0,stealth:0,appraise:0})}
function skXP(id,n){const S=skData(),before=skBase(id);S[id]=(S[id]||0)+(n||2);const after=skBase(id);if(after>before)msg(`${SKILLS[id].n} improves to level ${after}.`,'#ffe9a0')}
function skBase(id){return Math.min(10,Math.floor(Math.sqrt((skData()[id]||0)/3)))}
function skLevel(id){let b=skBase(id);if(G.heroes&&G.heroes.some((h,i)=>h.alive&&SKILLS[id].cls.includes(HERO_DEF[i].cls)))b+=2;return Math.min(12,b)}
function skillMul(side){return side==='buy'?1-Math.min(.1,skBase('persuade')*.01):1+Math.min(.15,skBase('appraise')*.015)}
/* ---------------------------------------------------------------- trades ---------------------------------------------------------------- */
const TRADES={
  healer:{n:'Healer',d:'Heals 6% more per rank, tends the sick in camp, and calms the hurt.',col:'#a8e0a0'},
  smith:{n:'Smith',d:'Deals 2% more damage per rank, and sharpens the party\'s blades at camp.',col:'#e0a070'},
  scout:{n:'Scout',d:'Hits 1.5% more and is missed 1% more per rank. Better at foraging, reads the weather, spots thieves.',col:'#90d080'},
  cook:{n:'Cook',d:'Hunger falls 8% slower per rank and hearty meals at camp are stronger.',col:'#e8c070'},
  alchemist:{n:'Alchemist',d:'Brews more reliably, and a good brew sometimes makes double.',col:'#a0c8f0'},
  merchant:{n:'Merchant',d:'Pays 1% less and sells for 1% more per rank, wherever the party shops.',col:'#e0d070'}
};
const TRADE_IDS=Object.keys(TRADES),RANK_XP=[0,10,30,70,140];
function profData(){const F=G.flags;return F.prof||(F.prof={})}
function profOf(hi){return profData()[hi]||null}
function profRank(hi){const p=profOf(hi);if(!p)return 0;let r=1;for(let k=1;k<5;k++)if(p.xp>=RANK_XP[k])r=k+1;return r}
function profXP(trade,n){
  G.heroes.forEach((h,i)=>{const p=profOf(i);if(!p||p.id!==trade||!h.alive)return;const b=profRank(i);p.xp+=n||1;const a=profRank(i);if(a>b)msg(`${HERO_DEF[i].name} is now a rank ${a} ${TRADES[trade].n}.`,'#ffe9a0')});
}
function profPerk(trade){let r=0;G.heroes.forEach((h,i)=>{const p=profOf(i);if(p&&p.id===trade&&h.alive)r=Math.max(r,profRank(i))});return r}
function profPas(hi,key){
  const p=profOf(hi);if(!p||!G.heroes[hi].alive)return 0;const r=profRank(hi);
  switch(p.id){
    case 'healer':return key==='healPct'?.06*r:0;
    case 'smith':return key==='dmgPct'?.02*r:0;
    case 'scout':return key==='hitPct'?.015*r:key==='dodge'?.01*r:0;
    case 'cook':return key==='hungerSlow'?.08*r:0;
  }
  return 0;
}
function profMul(side){const r=profPerk('merchant');return side==='buy'?1-.01*r:1+.01*r}
/* ---------------------------------------------------------------- bonds ---------------------------------------------------------------- */
function bondKey(i,j){return i<j?i+'-'+j:j+'-'+i}
function bondData(){
  const F=G.flags;
  if(!F.bonds){F.bonds={};for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){const r=hash2(i*7+3,j*11+5,HERO_DEF[i].name.length*31+HERO_DEF[j].name.length);F.bonds[bondKey(i,j)]=Math.round((r-.5)*8)}}
  return F.bonds;
}
function bondVal(i,j){return bondData()[bondKey(i,j)]||0}
function bondAdd(i,j,a){const B=bondData(),k=bondKey(i,j),old=B[k]||0;B[k]=clamp(old+a,-10,10);const t0=bondTier(old),t1=bondTier(B[k]);if(t0!==t1)msg(`${HERO_DEF[i].name} and ${HERO_DEF[j].name}: ${t1}.`,B[k]>old?'#a8e0a0':'#e0a080')}
function bondTier(v){return v>=8?'inseparable friends':v>=5?'good friends':v>=2?'friendly':v<=-8?'bitter rivals':v<=-5?'rivals':v<=-2?'at odds':'colleagues'}
function bondPas(hi,key){
  let s=0;
  for(let j=0;j<4;j++){if(j===hi||!G.heroes[j].alive)continue;const v=bondVal(hi,j);
    if(v>=5){if(key==='dodge')s+=.012;if(v>=8&&key==='armor')s+=1}
    else if(v<=-5){if(key==='dmgPct')s+=.03;if(key==='hitPct')s-=.01}}
  return s;
}
/* a friend falls: the others who loved them are enraged */
function bondFall(t){
  for(let j=0;j<4;j++){if(j===t||!G.heroes[j].alive)continue;if(bondVal(j,t)>=5){G.buffs.push({name:'Enraged',b:'dmgPct',amt:.3,left:10,hi:j});msg(`${HERO_DEF[j].name} cries out and fights on in a fury at ${HERO_DEF[t].name}'s fall!`,'#ff9a8a')}}
}
/* ---------------------------------------------------------------- camp ---------------------------------------------------------------- */
const FOOD_KIND=()=>G.bag.filter(b=>idef(b).k==='food');
function foodUnits(){return G.bag.reduce((a,b)=>a+(idef(b).k==='food'?b.n:0),0)}
function takeFood(n){let t=0;while(t<n){let fi=-1;for(let i=G.bag.length-1;i>=0;i--)if(G.bag[i]&&idef(G.bag[i]).k==='food'){fi=i;break}if(fi<0)break;bagTake(fi);t++}return t}
function campLog(){const F=G.flags,d=dayNum();if(F.campDay!==d){F.campDay=d;F.campDone={}}return F.campDone} // what each hero has done today: one choice per hero per day
function campFree(hi){return !campLog()[hi]&&G.heroes[hi]&&G.heroes[hi].alive}
function campOk(){if(hostileNear()){msg('Not with enemies about.','#d09a80');return false}return true}
const CAMP_ACTS=[
  {id:'rest',n:'Rest the night',d:'Eight hours. Heals everyone, cures what rest cures.',cost:'8 hours',ok:()=>true,run:()=>{restParty(false)}},
  {id:'cook',n:'Cook a hearty meal',d:'Two food items make a stew for the party: Well Fed (+2 strength) for a day and hunger filled. A cook makes it better.',cost:'1 hour, 2 food',ok:()=>foodUnits()>=2,run:hi=>{
    takeFood(2);advanceTime(60);const r=profPerk('cook');
    G.heroes.forEach(h=>{if(h.alive)h.food=Math.min(100,h.food+40+r*8)});afflInflict('wellfed',-1,true);if(r>=3)G.buffs.push({name:'A Master\'s Stew',b:'regen',amt:.4,left:200,hi:-1});
    profXP('cook',2);msg('The stew is hot and hearty. The party eats in good spirits.','#e8c070');bondRandom(1)}},
  {id:'sharpen',n:'Sharpen and mend the gear',d:'Blades keen, straps mended: the party deals more damage for the next day of fighting. A smith does it better.',cost:'30 minutes',ok:()=>true,run:hi=>{
    advanceTime(30);const r=profPerk('smith');G.buffs=G.buffs.filter(b=>b.name!=='Sharpened Blades');G.buffs.push({name:'Sharpened Blades',b:'dmgPct',amt:.06+.025*r,left:400,hi:-1});
    profXP('smith',2);msg(`Whetstones ring. The party deals ${Math.round((.06+.025*r)*100)}% more damage for a long while.`,'#e0a070')}},
  {id:'tend',n:'Tend the sick',d:'Rest and care for those with afflictions that a healer can ease. Each has a chance of cure; a healer improves it.',cost:'2 hours',ok:()=>afflList().some(e=>AFFL[e.id]&&AFFL[e.id].healer),run:hi=>{
    advanceTime(120);const r=profPerk('healer'),sk=skBase('persuade')*.01;let n=0;
    for(const e of afflList().slice()){const A=AFFL[e.id];if(A&&A.healer&&Math.random()<.35+.12*r+sk){afflRemove(e,true);n++}else if(A&&A.rest&&Math.random()<.5)e.rests++}
    G._campInfo={n};profXP('healer',2);msg(n?'Careful nursing works. '+n+(n>1?' sicknesses are cured.':' sickness is cured.'):'The patients rest, but nothing is cured yet.','#a8e0a0')}},
  {id:'stories',n:'Tell stories round the fire',d:'An hour of tales and songs. Friendships grow, grudges cool a little, and morale rises.',cost:'1 hour',ok:()=>true,run:hi=>{
    advanceTime(60);for(let j=0;j<4;j++)if(j!==hi&&G.heroes[j].alive)bondAdd(hi,j,1);bondRandom(1);luckAdd(1);msg(`${HERO_DEF[hi].name} tells a tale by the fire. It gets bigger with every telling, and the party laughs together.`,'#e8d8a0')}},
  {id:'spar',n:'Spar',d:'Two heroes drill together. Friends grow closer, and rivals settle things a little. A small crowd gathers.',cost:'1 hour',ok:()=>true,run:hi=>{
    const free=[0,1,2,3].filter(j=>j!==hi&&campFree(j)),b=free.length?free[(Math.random()*free.length)|0]:(hi+1)%4,a=hi;G._campInfo={b};advanceTime(60);bondAdd(a,b,1);giveXP(8);campLog()[b]='sparred';msg(`${HERO_DEF[a].name} and ${HERO_DEF[b].name} spar until both are out of breath.`,'#e8d8a0')}},
  {id:'forage',n:'Forage',d:'Search the wilds for herbs and reagents. Only outdoors. A scout finds more.',cost:'1 hour',ok:()=>!!wxRegionOf(LEVEL)&&!repTownOf(LEVEL),run:hi=>{forage()}}
];
function bondRandom(a){const i=(Math.random()*4)|0;let j=(i+1+((Math.random()*3)|0))%4;if(G.heroes[i].alive&&G.heroes[j].alive)bondAdd(i,j,a)}
function forage(){
  advanceTime(60);const r=profPerk('scout'),luck=Math.max(0,luckVal())*.02;let found=[];
  const des=wxRegionOf(LEVEL)==='desert',w=weatherNow(),bad=w&&(w.id==='snow'||w.id==='frost')?.3:0;
  const table=des?[['water',.6],['lotus',.15],['herb',.15]]:[['herb',.55],['wildflower',.5],['nightshade',.25],['honeycomb',.15]];
  for(const [id,p] of table)if(Math.random()<Math.max(.05,p+r*.07+luck-bad)){const n=1+((Math.random()<.3+r*.1)?1:0);if(bagAdd(mkItem2(id,n)))found.push(n+' '+ITEMDEF[id].n.toLowerCase())}
  profXP('scout',2);skXP('stealth',1);try{petForage()}catch(e){}
  G._campInfo={found};
  msg(found.length?'Foraging turns up '+found.join(', ')+'.':'An hour of looking turns up nothing useful.','#a8d898');
}
function campRun(id){
  const a=CAMP_ACTS.find(x=>x.id===id);if(!a)return;
  if(!campOk())return;if(!a.ok()){msg('You cannot do that now.','#d09a80');return}
  const hi=G.sel;
  if(id!=='rest'){ // sleeping is for everyone; every other choice uses up one hero's day
    const done=campLog();
    if(done[hi]){msg(`${HERO_DEF[hi].name} has already chosen today: ${done[hi]}. Pick another hero, or wait for tomorrow.`,'#d09a80');return}
    if(!G.heroes[hi].alive){msg(`${HERO_DEF[hi].name} cannot do that now.`,'#d09a80');return}
    done[hi]={cook:'cooked',sharpen:'sharpened the gear',tend:'tended the sick',stories:'told stories',spar:'sparred',forage:'foraged'}[id]||id;
  }
  G._campInfo=null;a.run(hi);
  if(id!=='rest')campMoment(id,hi);
}
/* a few lines that describe the moment, shown when a hero spends the day's choice */
const CAMP_SCENES={
  cook:[
    "{n} hangs the pot over the fire and counts out what food is left. Onion, a little salt, whatever the road has given. The smell rises, and one by one the others drift closer.|{o} claims the first bowl, burns a tongue, and swears it is the best stew in the world.",
    "{n} stirs with a wooden spoon and tastes, frowns, tastes again. A pinch of something from a pocket goes in. Nobody asks what.|The party eats in the firelight, mostly in silence, and silence is the kind of compliment a cook understands.",
    "It takes an hour, and {n} will not be hurried. The pot bubbles. The steam smells of home, though not any home the party has had lately.|{o} wipes the bowl clean with a crust of bread. “Same again tomorrow,” {o} says, and means it."
  ],
  sharpen:[
    "{n} sits on a stone with the whetstone and a rag and goes down the line of blades one by one. The ring of steel carries a long way in the dark.|The edges come up bright. Straps are mended, buckles are tightened, and the party's gear looks a little less like it has been dragged across a continent.",
    "{n} spits on the stone and sets to work. Each stroke has the same sound, a dry whisper, and each blade ends up keener than it began.|{o} tests an edge on a thumbnail and nods, which is as close as {o} comes to thanks."
  ],
  tend:[
    "{n} lays out clean cloths, heats water and gets to work on those who are ailing. It is slow, ugly, patient work, and nobody complains.|By the end of the hour the party is quieter, and a little healthier for it."
  ],
  stories:[
    "{n} pokes the fire and begins, “This happened a long time ago, on a road a lot like this one.” The tale grows with every telling: a bigger beast, a taller wall, a worse storm.|{o} interrupts twice to correct the details, and is told to tell it properly then. The laughter carries out into the dark.",
    "The fire pops. {n} starts a song, off-key and cheerfully, and halfway through the second verse the others are joining in on the parts they know.|Somewhere past midnight, the grudges of the road get a little smaller. Someone says they will remember tonight.",
    "{n} tells the tale of the first fight the four of them ever shared, and gets it wrong in all the flattering ways. {o} lets the lies stand.|It is the sort of evening that does not change anything, and that will be remembered for a long time."
  ],
  forage:[
    "{n} wanders off along the edge of the camp, head down, eyes on the ground, turning over leaves and stones with a stick.|{f}",
    "{n} slips out of the firelight and into the quiet, looking for the small green things that make medicine and meals. It is slow, patient work, and the wild gives up its secrets grudgingly.|{f}"
  ],
  spar:[
    "{n} and {p} clear a ring in the dust and take up wooden practice blades. They circle once, politely.|Then it gets less polite. A thud, a curse, a laugh. An hour on, both are out of breath and sitting in the dirt, and neither will admit to losing.",
    "“One more round,” says {p}. “You said that three rounds ago,” says {n}. The sticks crack together under the torchlight.|By the end of it they have each learned something new about how the other thinks, and have the bruises to prove it."
  ]
};
function campMoment(id,hi){
  const pool=CAMP_SCENES[id];if(!pool)return;
  const n=HERO_DEF[hi].name,others=[0,1,2,3].filter(j=>j!==hi&&G.heroes[j].alive),o=others.length?HERO_DEF[others[(Math.random()*others.length)|0]].name:n,info=G._campInfo||{};
  const p=info.b!==undefined?HERO_DEF[info.b].name:o;
  let parts=pool[(Math.random()*pool.length)|0].split('|');
  const f=info.found&&info.found.length?'Back at the fire with '+info.found.join(', ')+'.':'Back at the fire with empty hands, and a good story about a thorn.';
  const lines=parts.map(t=>({text:t.replace(/\{f\}/g,f).replace(/\{n\}/g,n).replace(/\{o\}/g,o).replace(/\{p\}/g,p)}));
  if(id==='tend'&&info.n!==undefined)lines.push({text:info.n?`${info.n===1?'One':'Some'} of the sick feel better. The fever breaks, or the cough eases.`:'Nothing is cured yet, but rest and care will do more tomorrow.'});
  G._campLines=lines;startCut('campMoment');
}
Object.assign(CUTS,{campMoment:()=>G._campLines||[{text:'The hour passes quietly.'}]});
journalPage({id:'camp',title:'Camp and Bonds',
  summary:()=>{const v=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){const b=bondVal(i,j);if(Math.abs(b)>=5)v.push(`${HERO_DEF[i].name} & ${HERO_DEF[j].name}: ${bondTier(b)}`)}return 'Cook, sharpen, tend the sick, forage, spar or tell stories. '+(v.length?v.slice(0,2).join('; ')+'.':'No firm friendships or rivalries yet.')},
  note:()=>0,
  draw(){
    jFrame('Camp and bonds');
    txt(`Hour ${((G.clock%1440)/60)|0}   ${weatherLabel()}`,440,25,8,'#a89878','right');
    const done=campLog(),hiC=G.sel,freeC=campFree(hiC);
    CAMP_ACTS.forEach((a,k)=>{
      const x=36+(k%2)*212,y=36+Math.floor(k/2)*36,ok=a.ok()&&(a.id==='rest'||freeC);
      ctx.save();rrect(ctx,x,y,204,32,4);ctx.fillStyle=ok?'rgba(44,22,14,.92)':'rgba(24,18,14,.85)';ctx.fill();ctx.lineWidth=1.3;ctx.strokeStyle=ok?'#a88a48':'#4a4034';ctx.stroke();ctx.restore();
      txt(a.n,x+7,y+8,8.8,ok?'#ecdca8':'#7a7060','left',true,undefined,130);txt(a.cost,x+198,y+8,6.8,ok?'#9ac8ff':'#6a6a70','right');
      wrapText(a.d,190,6.8).slice(0,2).forEach((l,q)=>txt(l,x+7,y+18+q*7.6,6.8,ok?'#b8aa88':'#6a6050','left'));
      btn('cp_'+a.id,x,y,204,32);
    });
    txt(freeC?`${HERO_DEF[hiC].name} can do one thing today.`:`${HERO_DEF[hiC].name} has already ${done[hiC]||'chosen'} today.`,40,184,7.6,freeC?'#e8d8a0':'#d09a80','left');
    txt('Tap a portrait to choose who acts. Each hero gets one choice a day; resting is for all.',440,184,7,'#988a70','right');
    txt('BONDS',40,197,10,'#d8c88e','left',true);
    let n=0;
    for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
      const v=bondVal(i,j),col=v>=2?'#a8d880':v<=-2?'#e08060':'#a89878',x=40+(n%2)*212,y=204+Math.floor(n/2)*20;n++;
      txt(`${HERO_DEF[i].name} & ${HERO_DEF[j].name}`,x,y+6,8.5,'#e2d8bc','left',true,undefined,140);txt(bondTier(v),x+204,y+6,8,col,'right');
      jBar(x,y+11,204,5,(v+10)/20,v>=0?'#a8d880':'#d07050');ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(x+102,y+10,1,7);
    }
    txt('Friends (5+) dodge more and fight in a fury if a friend falls. Rivals (-5 or less) hit harder to prove a point, but lose their aim a little.',40,274,7.2,'#988a70','left',false,undefined,400);
    txt('Camp activities need a quiet moment with no enemy near.',40,292,7.4,'#a89878','left');
  },
  click(id){const m=/^cp_(.+)$/.exec(id);if(m)campRun(m[1])}
});
/* ---------------------------------------------------------------- crafting and herbalism ---------------------------------------------------------------- */
function mkItemN(id,n){return {id,n:n||1}}
const RECIPES=[
  {id:'antidote',n:'Antidote',in:{nightshade:1,herb:1},out:['antidote',2],from:'Merit the healer, or the witch',price:40},
  {id:'salve',n:'Cleansing Salve',in:{herb:2,honeycomb:1},out:['salve',2],from:'Merit the healer',price:40},
  {id:'sleeptea',n:'Sleeping Tea',in:{wildflower:2,water:1},out:['sleeptea',2],from:'The witch, or a priest',price:30},
  {id:'holywater',n:'Holy Water',in:{water:2,wildflower:1},out:['holywater',1],from:'A priest',price:60},
  {id:'healdraught',n:'Healing Draught',in:{herb:2,water:1},out:['healdraught',1],from:'An alchemist',price:80},
  {id:'manadraught',n:'Mana Draught',in:{lotus:1,water:1},out:['manadraught',1],from:'An alchemist',price:80},
  {id:'swiftness',n:'Potion of Swiftness',in:{lotus:1,honeycomb:1},out:['swiftness',1],from:'An alchemist',price:100},
  {id:'ironskin',n:'Potion of Iron Skin',in:{ore:2,water:1},out:['ironskin',1],from:'A swordsmith',price:100}
];
ITEMDEF.nightshade={n:'Nightshade',k:'quest',t:'Reagent',ic:'herb',c:'#6a3a8a',stack:1,price:6,d:'Dark berries and a purple flower. Poison in a spoon, medicine in a pinch.',sw:.3};
ITEMDEF.lotus={n:'Blue Lotus',k:'quest',t:'Reagent',ic:'herb',c:'#6a9ae0',stack:1,price:8,d:'A blue lotus from a still pool. Calming, and strange to taste.',sw:.3};
function recData(){const F=G.flags;return F.recipes||(F.recipes={})}
function mkItem2(id,n){return {id,n:n||1}}
function canCraft(r){return recData()[r.id]&&Object.keys(r.in).every(k=>bagCount(k)>=r.in[k])}
function craft(r){
  if(!campOk())return;if(!canCraft(r)){msg('You lack something for that.','#d09a80');return}
  const ar=profPerk('alchemist'),p=Math.min(.98,.8+.04*ar);
  advanceTime(30);
  const ok=Math.random()<p;
  for(const k in r.in)bagRemove(k,ok?r.in[k]:Math.ceil(r.in[k]/2));
  if(!ok){msg(`The ${r.n.toLowerCase()} goes wrong: a puff of smoke, and half the ingredients are wasted.`,'#d0a080');return}
  let n=r.out[1];if(Math.random()<.04+ar*.06){n*=2;msg('The brew comes out twice as strong as you hoped!','#ffe9a0')}
  for(let q=0;q<n;q++)if(!bagAdd(mkItem2(r.out[0],1)))msg('Your bag is full. Some was lost.','#d09a80');
  profXP('alchemist',2);msg(`You brew ${n>1?n+' ':'a '}${ITEMDEF[r.out[0]].n.toLowerCase()}${n>1?'s':''}.`,'#9ae0a0');sfx('potion');
}
function learnRecipe(id,price){const r=RECIPES.find(x=>x.id===id);if(recData()[id])return say('You already know that one.',[BYE]);if(G.gold<price)return say(`That costs ${price} gold.`,[BYE]);G.gold-=price;recData()[id]=1;sfx('key');msg(`You learn to make ${r.n.toLowerCase()}.`,'#ffe9a0');return say(`There. Write it down: ${Object.keys(r.in).map(k=>r.in[k]+' '+ITEMDEF[k].n.toLowerCase()).join(' and ')} makes ${r.out[1]>1?r.out[1]+' ':'one '}${ITEMDEF[r.out[0]].n.toLowerCase()}${r.out[1]>1?'s':''}. Brew it at any camp.`,[BYE])}
const RECIPE_TEACH={kh_healer:['antidote','salve'],kh_alchemist:['healdraught','manadraught','swiftness'],ih_alchemist:['healdraught','manadraught','swiftness'],priest:['holywater','sleeptea'],witch:['sleeptea','antidote'],kh_swordsmith:['ironskin'],ih_swordsmith:['ironskin']};
for(const npc in RECIPE_TEACH)for(const rid of RECIPE_TEACH[npc]){
  const r=RECIPES.find(x=>x.id===rid);
  repWrap(npc,()=>!recData()[rid],`Learn to brew ${r.n.toLowerCase()} (${r.price} gold)`,()=>learnRecipe(rid,r.price));
}
journalPage({id:'craft',title:'Crafting and Herbalism',
  summary:()=>{const k=Object.keys(recData()).length;return k?`${k} recipes known. Gather herbs, brew at camp.`:'No recipes yet. Healers, alchemists, priests and the witch teach them for a fee. Forage for herbs at camp.'},
  note:()=>0,
  draw(){
    jFrame('Crafting and herbalism');
    txt('Brewing takes half an hour and needs a quiet moment. Forage at camp for herbs. Recipes are taught by healers, alchemists, priests and the witch.',40,42,7.6,'#a89878','left',false,undefined,400);
    RECIPES.forEach((r,k)=>{
      const known=recData()[r.id],ok=canCraft(r),y=62+k*28;
      ctx.save();rrect(ctx,36,y,408,25,4);ctx.fillStyle=known?'rgba(40,28,18,.92)':'rgba(24,18,14,.8)';ctx.fill();ctx.lineWidth=1.2;ctx.strokeStyle=ok?'#9ac870':known?'#a88a48':'#4a4034';ctx.stroke();ctx.restore();
      txt(known?r.n:'???',44,y+8,9,known?'#ecdca8':'#6a6050','left',true);
      txt(known?`Makes ${r.out[1]>1?r.out[1]+' ':''}${ITEMDEF[r.out[0]].n}`:`Taught by: ${r.from} (${r.price} gold)`,44,y+18,7,known?'#9ac8ff':'#8a7a60','left');
      if(known){let x=190;for(const k2 in r.in){const have=bagCount(k2),need=r.in[k2];txt(`${ITEMDEF[k2].n} ${have}/${need}`,x,y+12.5,7.6,have>=need?'#a8d880':'#e08060','left');x+=96}}
      if(known)btnText('cr_'+r.id,'Brew',390,y+3,48,19);
    });
  },
  click(id){const m=/^cr_(.+)$/.exec(id);if(m){const r=RECIPES.find(x=>x.id===m[1]);if(r)craft(r)}}
});
/* ---------------------------------------------------------------- skills and trades ---------------------------------------------------------------- */
journalPage({id:'trade',title:'Skills and Trades',
  summary:()=>{const t=G.heroes.map((h,i)=>{const p=profOf(i);return p?`${HERO_DEF[i].name}: ${TRADES[p.id].n} ${profRank(i)}`:null}).filter(Boolean);return (t.length?t.join(', ')+'. ':'No hero has a trade yet. ')+'Lockpicking, persuasion, stealth and appraisal grow with use.'},
  note:()=>G.heroes.some((h,i)=>h.alive)&&!Object.keys(profData()).length,
  draw(){
    jFrame('Skills and trades');
    txt('SKILLS (party)',40,42,10,'#d8c88e','left',true);
    Object.keys(SKILLS).forEach((id,k)=>{
      const S=SKILLS[id],x=40+(k%2)*212,y=50+Math.floor(k/2)*38,b=skBase(id),bonus=skLevel(id)-b;
      txt(`${S.n}  ${b}${bonus?` (+${bonus})`:''}`,x,y+6,9,'#ecdca8','left',true);jBar(x,y+11,200,5,b/10,'#d8b048');
      wrapText(S.d,200,6.6).slice(0,2).forEach((l,q)=>txt(l,x,y+23+q*7,6.6,'#a89878','left'));
    });
    txt('TRADES (one per hero; changing a trade costs 100 gold after the first)',40,134,10,'#d8c88e','left',true);
    G.heroes.forEach((h,i)=>{
      const y=146+i*34,p=profOf(i),T=p&&TRADES[p.id];
      ctx.save();rrect(ctx,36,y,408,31,4);ctx.fillStyle='rgba(44,22,14,.9)';ctx.fill();ctx.lineWidth=1.2;ctx.strokeStyle='#7a6440';ctx.stroke();ctx.restore();
      txt(`${HERO_DEF[i].name} the ${HERO_DEF[i].cls}`,44,y+9,9,'#e2d8bc','left',true,undefined,150);
      if(T){const r=profRank(i),next=RANK_XP[r]||null;txt(`${T.n}, rank ${r}`,44,y+21,8.5,T.col,'left',true);jBar(150,y+17,100,5,next?(p.xp-RANK_XP[r-1])/(next-RANK_XP[r-1]):1,T.col);wrapText(T.d,170,6.6).slice(0,2).forEach((l,q)=>txt(l,260,y+8+q*7.6,6.6,'#a89878','left'))}
      else txt('No trade yet',44,y+21,8.5,'#8a7a60','left');
      btnText('tr_'+i,p?'Change':'Take up',392,y+5,46,21);
    });
  },
  click(id){
    const m=/^tr_(\d)$/.exec(id);if(!m)return;const i=+m[1],P=profData(),cur=P[i];
    const idx=cur?TRADE_IDS.indexOf(cur.id):-1,nextId=TRADE_IDS[(idx+1)%TRADE_IDS.length];
    if(cur&&G.gold<100){msg('Changing trade costs 100 gold.','#d09a80');return}
    if(cur)G.gold-=100;
    P[i]={id:nextId,xp:cur&&cur.id===nextId?cur.xp:0};sfx('equip');msg(`${HERO_DEF[i].name} takes up the trade of ${TRADES[nextId].n.toLowerCase()}.`,'#ffe9a0');
  }
});
(function(){ // Kal sets up in Ironhill, near the south wall
  const L=LEVELS[13];if(!L||!L.rows||L._kal)return;L._kal=1;
  const taken=new Set((L.decor||[]).filter(d=>d.block||d.npc).map(d=>d.x+','+d.y));let best=null,bd=1e9;
  for(let y=1;y<L.rows.length-1;y++)for(let x=1;x<L.rows[0].length-1;x++){if(L.rows[y][x]!=='.'||taken.has(x+','+y))continue;const d=Math.abs(x-9)+Math.abs(y-27);if(d<bd){bd=d;best=[x,y]}}
  if(best)L.decor.push({k:'beggar',x:best[0],y:best[1],block:true,npc:'pet_trader'});
})();

/* ---------------------------------------------------------------- locked doors: pick the lock and walk into the house ---------------------------------------------------------------- */
const LD_DIFF={15:0,16:.05,17:0,18:0,19:-.12};
const lockedKey=(lv,x,y)=>40000+lv*10000+y*100+x;
function lockedDoor(g,nx,ny){
  const F=G.flags,key=lockedKey(LEVEL,nx,ny),un=F.unlocked||(F.unlocked={}),ms=g>=200?[(TILE_MSG[g]||'It is locked.')]:DOOR_MSGS[g];
  if(!LEVELS[LEVEL]||LEVEL===44||LEVEL>=40000||(g>=200&&!repTownOf(LEVEL)))return false; // only the doors of towns and villages
  if(un[key]){sfx('door');goToLevel(key,{x:4,y:4,f:0});return true}
  const lv=skLevel('lockpick'),ch=clamp(.18+lv*.065+luckVal()*.01+(LD_DIFF[g]||0),.04,.95),t=repTownOf(LEVEL);
  const text=ms[(hash2(nx,ny,3)*ms.length)|0]+(lv>0?` Chance of picking it: about ${Math.round(ch*100)}%.`:' You have no talent for locks yet, but you could try.');
  G.talk={d:{k:'_',x:nx,y:ny},n:{name:'A locked door'},node:say(text,[['Try to pick the lock.',()=>{
    if(Math.random()<ch){
      un[key]=1;skXP('lockpick',3);honourAdd(-1,'breaking in');if(t&&Math.random()<.35)repAdd(t,-2,'a neighbour saw you at the door');
      sfx('door');G.talk=null;goToLevel(key,{x:4,y:4,f:0});return null;
    }
    skXP('lockpick',1);if(t&&Math.random()<.3)repAdd(t,-2,'a neighbour heard the noise');
    return say(Math.random()<.5?'The pick snaps in the lock with a tiny, awful sound.':'The pins will not set. Somewhere inside, a floorboard creaks.',[['Try again.',()=>lockedDoor(g,nx,ny)&&null],['Leave it.',()=>null]]);
  }],['Leave it alone.',()=>null]]),t:G.time,btns:[]};
  G.hold=null;G.queued=null;
  return true;
}
function makeLockedHouse(n){
  if(n<40000)return false;const id=n-40000,lv=Math.floor(id/10000),rem=id%10000,y=Math.floor(rem/100),x=rem%100,L0=LEVELS[lv];if(!L0||!L0.rows)return false;
  let fx=x,fy=y+1,ff=2;
  for(const [dx,dy,f] of [[0,1,2],[0,-1,0],[1,0,1],[-1,0,3]]){const q=L0.rows[y+dy]&&L0.rows[y+dy][x+dx];if(q==='.'){fx=x+dx;fy=y+dy;ff=f;break}}
  const r=hash2(x*7+lv,y*13,n%101),scenes=['warm','worker','spartan','messy','children','healer','cats','fisher','scholar','empty','potter','soldier','warm','worker'];
  const scene=scenes[(r*scenes.length)|0],name=KH_SCENE_NAME[scene],b={id:'lh'+n,name,room:'home',keeper:null,scene};
  if(hash2(n,7,91)<.1){b.gold=5+((hash2(n,9,92)*46)|0);b.goldMsg='A few coins lie forgotten in the corner.'}
  const lvl=khRoom(b,n,{to:lv,x:fx,y:fy,f:ff}).level;
  if(b.gold)KH_GOLD[n]={gold:b.gold,msg:b.goldMsg};
  LEVELS[n]=lvl;LEVEL_NAMES[n]=name;return true;
}
