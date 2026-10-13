/* ==========================================================================
   AFFLICTIONS AND STATES. Curses, fevers, poisons and tiredness that change how the party fights, and a few good states too.
   Each one has a picture in the menu (Menu > Afflictions) with a little about how it feels, how it is caught and how it is cured.
   Stat changes are added to the heroes' own numbers and taken off again when the affliction ends (each entry remembers what it changed).
   The watch of Khemetra warns anyone seen walking into a house, and jails them on the third warning.
   ========================================================================== */
const AFFL={
  cursed:{n:'Cursed',kind:'bad',fx:{dex:-3},who:'the whole party',col:'#a070d0',
    text:'A cold weight settles on the party. Feet slip on level ground, hands fumble with straps and doors seem to close a moment too soon. The curse follows the party like a shadow at noon.',
    src:'Opening cursed treasure, disturbing tombs, and the touch of the pharaoh\'s dead.',cure:'Visit a church or a temple. The Church of Light in Khemetra will lift it.',cureOn:['church']},
  fever:{n:'Fever',kind:'bad',fx:{str:-3},col:'#e07a50',
    text:'Hot skin, a pounding head and a cold sweat in the night. Swords feel twice as heavy and every ladder is a mountain.',
    src:'Foul water in the cisterns, the bites of rats and bats.',cure:'Rest three times. A cleansing salve from a potion seller will shorten it.',rest:3,cureItem:['salve'],healer:1},
  exhausted:{n:'Exhausted',kind:'bad',fx:{str:-2,dex:-2},who:'the whole party',col:'#c0a070',
    text:'Eyes sting, legs wobble, and the road ahead keeps swimming. The party has gone far too long without proper sleep.',
    src:'Going about forty hours without a night\'s rest.',cure:'Rest. One good night puts it right.',rest:1},
  poorly:{n:'Poorly',kind:'bad',fx:{str:-2,dex:-2},col:'#a8b878',days:3,
    text:'A night on cold stone has left everyone stiff, sniffling and slow, with an ache behind the eyes.',
    src:'A night in the temple cells of Khemetra.',cure:'It passes after three days, or after three rests. A healer can cure it for a fee.',rest:3,healer:1},
  poisoned:{n:'Poisoned',kind:'bad',drain:2,rounds:40,col:'#6ad06a',
    text:'A green heat crawls up the veins. Each heartbeat costs a little more strength, and the taste of metal will not leave the mouth.',
    src:'Spider bites, poisoned darts and tainted blades.',cure:'An antidote from a potion seller, or a healer. It also fades by itself after a while.',cureItem:['antidote'],healer:1},
  bleeding:{n:'Bleeding',kind:'bad',drain:1,rounds:60,col:'#d04040',
    text:'A deep cut that will not close. Every step leaves a drop on the floor, and the wolves will smell it.',
    src:'Wolf bites and bandit blades.',cure:'Rest, a cleansing salve, or a healer.',rest:1,cureItem:['salve'],healer:1},
  frostbitten:{n:'Frostbitten',kind:'bad',fx:{dex:-2},col:'#80c8e8',
    text:'Fingers that no longer answer and toes you cannot feel. The desert is hot by day and bitterly cold under the stars.',
    src:'Spending the cold hours of the night out in the open desert.',cure:'Rest in a warm place. One rest is enough.',rest:1},
  sunstroke:{n:'Sunstroke',kind:'bad',fx:{str:-2,int:-2},col:'#f0c040',
    text:'The noon sun hammers down until the dunes shimmer and thoughts turn to soup. Everything is too bright, and the head throbs.',
    src:'Marching through the open dunes at midday.',cure:'Rest in the shade, or wash in a bathhouse.',rest:1,cureOn:['bath']},
  dehydrated:{n:'Dehydrated',kind:'bad',fx:{str:-2},col:'#d0a860',
    text:'A dry tongue, cracked lips and a dizzy, drifting feeling. The party has been too long from water.',
    src:'Crossing the open desert without a drink.',cure:'Reach the city: its fountains, inns and baths have water. Resting also helps.',cureOn:['water','bath'],rest:2},
  sandblind:{n:'Sand-blinded',kind:'bad',fx:{dex:-2},col:'#e0c890',
    text:'Grit under every eyelid. Edges blur, and every blink is sandpaper. Swords go wide and arrows miss by a hand.',
    src:'Sandstorms in the open desert.',cure:'Wash your eyes in a bathhouse, or rest a night.',rest:1,cureOn:['bath']},
  haunted:{n:'Haunted',kind:'bad',fx:{int:-3},col:'#b8d0e8',
    text:'A cold hand on the shoulder when nobody is there, whispers in the dark, and a face at the edge of every mirror. Clear thinking is hard.',
    src:'The touch of ghosts and spectres.',cure:'A priest at a church, holy water, or laying the restless dead to rest (the Haunted Cellar quest).',cureOn:['church','quest:kh_ghosts'],cureItem:['holywater']},
  graverot:{n:'Grave Rot',kind:'bad',fx:{str:-3},col:'#8a9a58',
    text:'Grey patches creep over the skin and the smell of an old cellar clings to the clothes. Muscles waste away.',
    src:'Skeletons and the damp of ancient crypts.',cure:'Resting does not help. A cleansing salve, or a healer.',cureItem:['salve'],healer:1},
  tomblung:{n:'Tomb Dust',kind:'bad',fx:{str:-1,dex:-1},col:'#c8b898',
    text:'Four thousand years of dust in the lungs. Every breath rattles and the cough will not stop.',
    src:'Breathing the air of sealed tombs and pyramids.',cure:'A long soak in a bathhouse clears the chest.',cureOn:['bath']},
  stung:{n:'Venom-stung',kind:'bad',fx:{dex:-3},drain:1,rounds:25,col:'#c0e050',
    text:'A burning welt that swells and spreads. The limb will not do as it is told, and the world tilts when you stand too fast.',
    src:'Scorpion stings and cobra fangs.',cure:'An antidote from a potion seller, or a healer.',cureItem:['antidote'],healer:1},
  hangover:{n:'Hangover',kind:'bad',fx:{int:-2,dex:-1},col:'#d0a078',
    text:'Light is an insult and noise is violence. Last night\'s ale was a mistake that keeps explaining itself.',
    src:'Strong ale at an inn.',cure:'Rest.',rest:1},
  sleepless:{n:'Sleepless',kind:'bad',fx:{int:-2},days:2,col:'#7898c8',
    text:'Every time sleep comes, something wakes you: a creak, a whisper, a feeling of being watched. Rest gives only half its worth.',
    src:'Nights in haunted or sinister places.',cure:'A cup of sleeping tea, a healer, or a prayer at a church. It also wears off after two days.',cureOn:['church'],cureItem:['sleeptea'],healer:1},
  shaken:{n:'Shaken',kind:'bad',fx:{int:-2,dex:-1},col:'#a89870',
    text:'Hands that will not stop trembling and a heart that jumps at every shadow. The party saw something that should not exist.',
    src:'Dark and sinister houses, ghosts, and terrible bosses.',cure:'Rest twice, or pray at a church.',rest:2,cureOn:['church']},
  fleas:{n:'Flea-bitten',kind:'bad',fx:{dex:-1,int:-1},col:'#b88858',
    text:'An itch that crawls from hair to ankle. You scratch until it bleeds and cannot think about anything else.',
    src:'Filthy houses and the crowded lanes of the Beggars\' Quarter.',cure:'A good scrub in a bathhouse.',cureOn:['bath']},
  foodpoison:{n:'Food Poisoning',kind:'bad',fx:{str:-3},drain:1,rounds:10,col:'#98c058',
    text:'Cramps, a green face and a stomach that gives back everything. The pie smelled fine.',
    src:'Old or spoiled food.',cure:'Rest, or an antidote.',rest:1,cureItem:['antidote']},
  warned:{n:'Warned by the Watch',kind:'state',col:'#e8c878',days:2,
    text:'The city watch has noticed the party walking into people\'s homes. A guard has taken a note of your faces. Three warnings and you will see the inside of a temple cell.',
    src:'Walking into a house while a guard is within a few blocks.',cure:'It fades after two days, or ends when you pay the price of the cells.'},
  blessed:{n:'Blessed',kind:'good',fx:{str:1,dex:1,int:1},who:'the whole party',col:'#ffe890',days:2,
    text:'A warm light on the skin and a feeling that the next step will be the right one. The priests have put in a good word.',
    src:'Visiting a church or temple.',cure:'Not an affliction. It fades after two days.'},
  wellrested:{n:'Well Rested',kind:'good',fx:{str:1,dex:1},col:'#a8d898',days:1,
    text:'A deep sleep and a clear head. Everything is a little easier this morning.',
    src:'Resting in a proper inn.',cure:'Not an affliction. It fades after a day.'},
  wellfed:{n:'Well Fed',kind:'good',fx:{str:2},col:'#e8b868',days:1,
    text:'A full belly, a warm glow and the strength of a hot meal that stays with you all day.',
    src:'A hot meal at an inn.',cure:'Not an affliction. It fades after a day.'}
};
const AFFL_ORDER=Object.keys(AFFL);
/* which hits spread what: [creature name pattern, affliction, chance] */
const AFFL_HITS=[[/^rat$|^boss$/,'fever',.12],[/^bat$/,'fever',.06],[/wolf/,'bleeding',.2],[/^(bandit|hitman|hunter|archer)$/,'bleeding',.1],[/skel/,'graverot',.12],[/ghost|spectre|wraith/,'haunted',.3],[/ghost|spectre|wraith/,'shaken',.15],[/cobra/,'stung',.4],[/scorpion/,'stung',.35],[/spider|viper|asp/,'poisoned',.35],[/mummy/,'cursed',.1],[/^(hunter|hitman|overseer|guard|nomad2?|vulture)$/,'bleeding',.08],[/gandrick/,'cursed',.2],[/gandrick/,'shaken',.25],[/^boss$/,'shaken',.2],[/dwolf|wolf/,'fleas',.04]];
/* places that make the party ill when it walks in: [affliction, chance for each hero], and what the party notices */
function afflArea(n,L){
  const nm=(L&&L.name)||'',out=[];let msgText=null;
  const crypt=n===1||n===21||n===20||n===31||n===12||n===27;
  const tomb=n===42||n===51||n===56||n===65||n===54||n===59||(n>=100&&n<=151);
  if(crypt){msgText='Cold, damp air rises from the stones, and something old is rotting down here.';out.push(['graverot',n===12?.08:.18],['shaken',.15])}
  if(tomb){msgText='Four thousand years of dust hang in the air, and every breath tastes of it.';out.push(['tomblung',.4],['shaken',.12],['graverot',.08])}
  if(n===12||n===40||n===11){msgText=msgText||'The air is wet and sour. The walls sweat.';out.push(['fever',.14])}
  if(n===8||n===26){msgText='A bitter cold lives in this cave, and the stone drips.';out.push(['frostbitten',.2])}
  if(n===18){msgText='Rock dust hangs in the lamplight, thick as flour.';out.push(['tomblung',.3])}
  if(n===23||n===53||n===58||n===52||n===57||n===25){msgText='It stinks of animals and old straw. Things move in the bedding.';out.push(['fleas',.3])}
  if(n===50||n===55){msgText='Dry husks and clicking in the dark. Scorpions.';out.push(['stung',.4])}
  if(n===24){msgText='Something hums in the witch\'s hut. The air prickles, and a hex settles over the party.';out.push(['cursed',.3])}
  if(n===9){msgText='The house is too quiet. Something pale watches from the stairs.';out.push(['shaken',.5],['haunted',.25])}
  if(n===39){msgText='Waist-high thorns and a rank, sweet smell. Some of it stings the skin.';out.push(['poisoned',.3])}
  if(n===19){msgText='The moor is wet underfoot, and midges rise in clouds.';out.push(['fever',.06])}
  if(n===260)msgText='Green water laps at the stones. It stinks.';
  return {out,msgText};
}
const afflHeroName=hi=>(HERO_DEF[hi]&&HERO_DEF[hi].name)||'Hero';
function afflList(){return G.aff||(G.aff=[])}
function afflHas(id,hi){return afflList().some(e=>e.id===id&&(hi===undefined||e.hi===hi))}
function afflSeen(id){const F=G.flags;(F.affSeen=F.affSeen||{})[id]=1}
/* put an affliction on a hero (hi -1: on everyone alive) */
function afflInflict(id,hi,quiet){
  const A=AFFL[id];if(!A)return false;
  if(hi===undefined||hi===-1){let any=false;G.heroes.forEach((h,i)=>{if(h.alive&&afflInflict(id,i,true))any=true});if(any&&!quiet)msg((A.kind==='good'?'The party is ':'The whole party is ')+A.n.toLowerCase()+'.',A.col);return any}
  const h=G.heroes[hi];if(!h||!h.alive)return false;
  const ex=afflList().find(e=>e.id===id&&e.hi===hi);
  const until=A.days?G.clock+A.days*1440:0,rounds=A.rounds||0;
  if(ex){ex.until=Math.max(ex.until,until);ex.left=Math.max(ex.left||0,rounds);if(id==='warned')ex.count=(G.flags.khWarn||1);return false}
  const applied={};
  for(const k in (A.fx||{})){const before=h[k];h[k]=Math.max(1,h[k]+A.fx[k]);applied[k]=h[k]-before}
  afflList().push({id,hi,since:G.clock,until,left:rounds,rests:0,applied,count:id==='warned'?(G.flags.khWarn||1):0});
  afflSeen(id);
  if(!quiet)msg(`${afflHeroName(hi)} is ${A.kind==='good'?'':'afflicted: '}${A.n}.`,A.col);
  sfx(A.kind==='good'?'heal':'hurt');
  return true;
}
function afflRemove(e,why){
  const h=G.heroes[e.hi];
  if(h)for(const k in e.applied)h[k]=Math.max(1,h[k]-e.applied[k]);
  G.aff=afflList().filter(q=>q!==e);
  const A=AFFL[e.id];if(A&&why&&h)msg(`${afflHeroName(e.hi)} is no longer ${A.n.toLowerCase()}.`,'#9ae0a0');
}
function afflCure(id,hi,quiet){let n=0;for(const e of afflList().slice())if(e.id===id&&(hi===undefined||hi===-1||e.hi===hi)){afflRemove(e,!quiet);n++}return n}
function afflCureOn(tag){let n=0;for(const e of afflList().slice()){const A=AFFL[e.id];if(A&&(A.cureOn||[]).includes(tag)){afflRemove(e,true);n++}}return n}
/* time passes: timed afflictions end, and the open desert takes its toll */
function afflTime(min){
  if(!G.heroes)return;
  const F=G.flags,M=F.affM||(F.affM={lastRest:G.clock,sun:0,thirst:0,cold:0,storm:0});
  for(const e of afflList().slice())if(e.until&&G.clock>=e.until)afflRemove(e,true);
  const hour=(G.clock%1440)/60,des=LEVEL===43||(LEVEL>=60&&LEVEL<=64)||(LEVEL===41);
  if(G.clock-M.lastRest>2400&&!afflHas('exhausted')){afflInflict('exhausted',-1);M.lastRest=G.clock-1200}
  if(des&&G.state==='play'){
    M.thirst+=min;M.sun=(hour>=11&&hour<16)?M.sun+min:Math.max(0,M.sun-min);M.cold=(hour>=22||hour<5)?M.cold+min:Math.max(0,M.cold-min);
    if(M.sun>180){M.sun=0;afflInflict('sunstroke',-1)}
    if(M.thirst>480){M.thirst=0;afflInflict('dehydrated',-1)}
    if(M.cold>150){M.cold=0;afflInflict('frostbitten',-1)}
    if(typeof STORM!=='undefined'&&STORM.on&&STORM.a>.5){M.storm+=1;if(M.storm>25){M.storm=0;afflInflict('sandblind',-1)}}
  }
  // the cold open country of the north: nights in the forest and moor, and the high pass at any hour
  if(!des&&[2,7,10,19,20,22,32].includes(LEVEL)&&G.state==='play'){
    const night=(hour>=22||hour<5)||LEVEL===22;
    M.cold=night?M.cold+min:Math.max(0,M.cold-min);
    if(M.cold>(LEVEL===22?100:180)){M.cold=0;afflInflict('frostbitten',-1)}
    if(LEVEL===19){M.marsh=(M.marsh||0)+min;if(M.marsh>260){M.marsh=0;afflInflict('fever',(Math.random()*4)|0)}}
  }
}
/* each round of play: poisons and bleeding drain health (never to death) */
function afflRound(){
  for(const e of afflList().slice()){
    const A=AFFL[e.id];if(!A)continue;const h=G.heroes[e.hi];if(!h||!h.alive)continue;
    if(A.drain){h.hp=Math.max(1,h.hp-A.drain);h.hurt=.4;if(typeof addFloat==='function')addFloat(portraitX(e.hi)+19,250,'-'+A.drain,A.col)}
    if(A.rounds){e.left--;if(e.left<=0)afflRemove(e,true)}
  }
}
/* a creature hit a hero: it may pass something on */
function afflHit(eid,hi){
  for(const [re,id,ch] of AFFL_HITS)if(re.test(eid)&&Math.random()<ch){afflInflict(id,hi);}
}
/* resting */
function afflRest(inn){
  const F=G.flags,M=F.affM||(F.affM={lastRest:G.clock,sun:0,thirst:0,cold:0,storm:0});
  M.lastRest=G.clock;M.sun=0;M.cold=0;
  for(const e of afflList().slice()){const A=AFFL[e.id];if(!A||!A.rest)continue;e.rests++;if(e.rests>=A.rest)afflRemove(e,true)}
  if(afflHas('exhausted'))afflCure('exhausted',-1,true);
  if(afflHas('sleepless'))G.heroes.forEach((h,i)=>{if(h.alive&&afflHas('sleepless',i)){h.hp=Math.max(Math.min(h.hp,h.max),Math.ceil(h.max*.6));h.mp=Math.ceil(h.mpMax*.6)}});
  if(inn){
    afflInflict('wellrested',-1,true);afflInflict('wellfed',-1,true);msg('A proper bed and a hot meal. The party feels strong.','#a8d898');
    G.heroes.forEach((h,i)=>{if(h.alive&&Math.random()<.12)afflInflict('hangover',i)});
  }
}
function afflEat(hi,key){
  if(key==='ale'&&Math.random()<.25)afflInflict('hangover',hi);
  else if(/herring|sausage|pie|roast|pottage/.test(key||'')&&Math.random()<.07)afflInflict('foodpoison',hi);
}
/* moving between places: churches and baths cure, tombs and cellars spread */
function afflEnter(n){
  const L=LEVELS[n];if(!L)return;
  const F=G.flags,room=L.khRoom||'',sc=L.scene||'';
  later(300,()=>{
    if(LEVEL!==n)return;
    if(n===44){if(afflHas('dehydrated'))afflCureOn('water');(F.affM||(F.affM={})).thirst=0}
    if(['church','temple1','temple2','mosque'].includes(room)){
      const c=afflCureOn('church');
      afflInflict('blessed',-1);
      if(c)msg('The priests lay hands on the party. The weight lifts.','#ffe890');
    }
    if(/^bath/.test(sc)||room==='bath1'||room==='bath2'||room==='baths_cellar'&&false){
      const c=afflCureOn('bath');if(c)msg('Warm water, steam and a good scrub. The party feels clean again.','#a8e0e8');
    }
    if(n===260){G.heroes.forEach((h,i)=>{if(h.alive&&Math.random()<.35)afflInflict('fever',i)})}
    {const ar=afflArea(n,L);if(ar.out.length){if(ar.msgText)msg(ar.msgText,'#b8b0a0');for(const [id,ch] of ar.out)G.heroes.forEach((h,i)=>{if(h.alive&&Math.random()<ch)afflInflict(id,i)})}}
    if(n===3||n===13||n===33){if(afflHas('dehydrated'))afflCureOn('water');(F.affM||(F.affM={})).thirst=0}
    if(n===29||n===30||n===38){const c=afflCureOn('church');afflInflict('blessed',-1);if(c)msg('The bell tolls and the priest lays hands on the party. The weight lifts.','#ffe890')}
    if(sc==='dark'){msg('This house is cold and wrong. Something watches from the dark.','#a8a0c0');G.heroes.forEach((h,i)=>{if(h.alive&&Math.random()<.4)afflInflict('shaken',i);if(h.alive&&Math.random()<.15)afflInflict('sleepless',i)})}
    if(sc==='messy'||sc==='boarded'||sc==='worker'&&false){G.heroes.forEach((h,i)=>{if(h.alive&&Math.random()<.3)afflInflict('fleas',i)})}
    if(typeof khInPQ==='function'&&n===44&&G.P&&khInPQ(G.P.x,G.P.y)&&!afflHas('fleas')&&Math.random()<.1)G.heroes.forEach((h,i)=>{if(h.alive&&Math.random()<.3)afflInflict('fleas',i)});
  });
}
function afflQuest(id){
  if(id==='kh_ghosts'){afflCureOn('quest:kh_ghosts');afflCure('shaken',-1,true);afflInflict('blessed',-1)}
}
/* a cure item (antidote, salve, holy water, sleeping tea) drunk by a hero */
function afflUseItem(hi,idx){
  const it=G.bag[idx],d=idef(it),k=it.id;let n=0;
  for(const e of afflList().slice()){const A=AFFL[e.id];if(A&&(A.cureItem||[]).includes(k)&&(d.all||e.hi===hi)){afflRemove(e,true);n++}}
  if(!n){msg(`${afflHeroName(hi)} has nothing that the ${d.n} would cure.`,'#d0c090');return false}
  bagTake(idx);sfx('potion');return true;
}
/* ---------------------------------------------------------------- the watch of Khemetra, and the temple cells ---------------------------------------------------------------- */
const KH_JAIL=270;
function khGuardNear(){
  const P=G.P,L=LEVELS[44];let best=null,bd=19*19;
  for(const w of (L.walkers||[]))if(w.guard){const d=(w.x-P.x)**2+(w.y-P.y)**2;if(d<bd){bd=d;best=w}}
  for(const d of G.decor)if(d.npc==='kh_gateguard'&&!d.found){const q=(d.x-P.x)**2+(d.y-P.y)**2;if(q<bd){bd=q;best={k:d.k}}}
  return best;
}
function khGuardTalk(guard,text,opts){
  G.talk={d:{k:(guard&&guard.k)||khFaceKey('kh_npc3_0'),x:G.P.x,y:G.P.y},n:{name:'A guard of the watch'},node:say(text,opts),t:G.time,btns:[]};G.hold=null;G.queued=null;
}
/* walking into a house door: returns true if the watch stepped in (the party goes in afterwards) */
function afflHouseBump(d){
  const sc=d.sc||(LEVELS[d.lvl]&&LEVELS[d.lvl].scene);
  if(!sc||/^bath/.test(sc))return false;
  const g=khGuardNear();if(!g)return false;
  const F=G.flags;
  if(F.khWarnT!==undefined&&G.clock-F.khWarnT>2880){F.khWarn=0;afflCure('warned',-1,true)}
  F.khWarn=(F.khWarn||0)+1;F.khWarnT=G.clock;
  const enter=()=>{sfx('door');goToLevel(d.lvl,d.at);return null};
  sfx('locked');
  if(F.khWarn>=3){
    khGuardTalk(g,'Halt! That is three times I have told you to keep out of people\'s homes. You are under arrest, all of you. The temple cells will teach you manners.',[['Go quietly.',()=>{khJail();return null}]]);
  }else{
    afflCure('warned',-1,true);afflInflict('warned',-1,true);
    khGuardTalk(g,F.khWarn===1?'You there! Citizens do not just walk into other people\'s houses. That is your first warning. Do it again and the watch will take notice.':'I told you already, and here you are again. That is your second warning. The third time, you go to the cells.',[['Sorry, officer.',enter],['We will be quick.',enter]]);
  }
  return true;
}
function khJail(){
  const F=G.flags;F.khJailed=1;F.khJailOpen=0;sfx('locked');
  afflCure('warned',-1,true);
  if(!LEVELS[KH_JAIL]&&KH_LAZY[KH_JAIL])KH_LAZY[KH_JAIL]();
  goToLevel(KH_JAIL,{x:4,y:3,f:0});
  later(200,()=>msg('The cell door slams. The temple dungeons are cold, and the guards are done talking.','#d0b090'));
}
function khJailRelease(){
  const F=G.flags,b=KH_BUILDINGS.find(x=>x.id==='temple1');
  F.khJailed=0;F.khJailOpen=1;F.khWarn=0;
  const at=b&&b.front?{x:b.front[0],y:b.front[1],f:KH_FACE_F[b.m?b.m.face:1]}:{x:KH.CX,y:H_FALLBACK()};
  sfx('door');goToLevel(44,at);
  later(300,()=>msg('The party blinks in the daylight in front of the Temple of the Sun.','#e8d8a0'));
}
const H_FALLBACK=()=>KH.H-KH.WALL-4;
function khRoomJail(b){return {w:9,h:6,floor:'kh3',amb:.3,noExtras:true,lights:[[2,2],[6,2]],build:({raw,npc,mid})=>{
  raw('sacks',1,1);raw('sacks',7,1);raw('barrel',7,4);raw('crate',1,4);npc('kh_jailer',mid,1);
}}}
KH_LAZY[KH_JAIL]=()=>{
  if(LEVELS[KH_JAIL])return;
  const b=KH_BUILDINGS.find(x=>x.id==='temple1'),back=b&&b.front?{to:44,x:b.front[0],y:b.front[1],f:KH_FACE_F[b.m?b.m.face:1]}:{to:44,x:KH.CX,y:H_FALLBACK(),f:0};
  const lv=khRoom({id:'jail',name:'The Temple Dungeons',room:'jail',keeper:null},KH_JAIL,back).level;
  lv.portals[0].req='khJailOpen';lv.portals[0].lock='The cell door is locked. Speak to the jailer.';
  LEVELS[KH_JAIL]=lv;LEVEL_NAMES[KH_JAIL]='The Temple Dungeons';
};
khNpc('kh_jailer','The temple jailer','kh_npc3_2',d=>{
  const F=G.flags;
  const pay=()=>{if(G.gold<100)return say('A hundred gold, or you stay the night. I do not give credit.',[['Spend the night.',night],BYE]);G.gold-=100;msg('100 gold paid to the temple.','#e8c870');khJailRelease();return null};
  const night=()=>{
    advanceTime(480);
    let lost=0;while(lost<4){let fi=-1;for(let i=G.bag.length-1;i>=0;i--)if(G.bag[i]&&idef(G.bag[i]).k==='food'){fi=i;break}if(fi<0)break;bagTake(fi);lost++}
    afflInflict('poorly',-1);
    msg(lost?`The cell rats ate ${lost} of your food.`:'You had no food for the rats to take.','#e0a070');
    khJailRelease();return null;
  };
  if(!F.khJailed)return say('Go on, then. And keep out of people\'s houses.',[BYE]);
  return say('Three warnings, and you walked into houses anyway. The cells are cold and the bread is old. You can pay 100 gold to the temple and walk out now. Or sit out the night, lose some of your food to the rats, and walk out ill in the morning.',[['Pay 100 gold.',pay],['Spend the night in the cell.',night],['Not yet.',()=>null]]);
});
/* the priests of the chapels and the church of Ironhill heal for a fee as well */
function afflHealOptions(price){
  return afflList().filter(e=>{const A=AFFL[e.id];return A&&A.healer}).slice(0,4).map(e=>[`Cure ${AFFL[e.id].n} on ${afflHeroName(e.hi)} (${price} gold)`,()=>{
    if(G.gold<price)return say(`${price} gold. Not a coin less. Healing is hard work and herbs are not free.`,[BYE]);
    G.gold-=price;afflRemove(e,true);sfx('potion');return say('Hold still. There. Drink this and rest a little. You will be well.',[BYE]);
  }]);
}
if(typeof NPCS!=='undefined'&&NPCS.priest&&!NPCS.priest._aff){
  const base=NPCS.priest.root;NPCS.priest._aff=1;
  NPCS.priest.root=function(d){
    const n=base(d),extra=afflHealOptions(30);
    if(afflList().some(e=>{const A=AFFL[e.id];return A&&(A.cureOn||[]).includes('church')}))n.opts.unshift(['Ask the priest to lift a curse or a haunting',()=>{const c=afflCureOn('church');sfx('heal');return say(c?'He lays a hand on each of you and says the old words. The weight lifts.':'You carry no curse that he can lift.',[BYE])}]);
    n.opts.splice(Math.max(0,n.opts.length-1),0,...extra);
    return n;
  };
}
/* a healer of the city: cures the sicknesses of the body for a fee */
khNpc('kh_healer','Merit, the healer','kh_npc1_3',d=>{
  const list=afflList().filter(e=>{const A=AFFL[e.id];return A&&A.healer});
  if(!list.length)return say('You look healthy to me. Come back when you are not. I charge fair prices: forty gold for each sickness, and I do not ask how you got it.',[BYE]);
  const opts=list.slice(0,4).map(e=>[`Cure ${AFFL[e.id].n} on ${afflHeroName(e.hi)} (40 gold)`,()=>{
    if(G.gold<40)return say('Forty gold. Not a coin less. Healing is hard work and herbs are not free.',[BYE]);
    G.gold-=40;afflRemove(e,true);sfx('potion');return say('Hold still. There. Drink this and rest a little. You will be well.',[BYE]);
  }]);
  opts.push(BYE);
  return say('Fevers, poisons, cuts and rot: I have seen them all. Show me where it hurts. Forty gold a cure, and I do not ask questions.',opts);
});
/* ---------------------------------------------------------------- the menu pages ---------------------------------------------------------------- */
function afflEffectText(A){
  const bits=[];const nm={str:'Strength',dex:'Agility (Dexterity)',int:'Intelligence'};
  for(const k in (A.fx||{}))bits.push((A.fx[k]>0?'+':'')+A.fx[k]+' '+nm[k]);
  if(A.drain)bits.push('loses '+A.drain+' health every round');
  if(A.id==='sleepless'||A.n==='Sleepless')bits.push('rest restores only part of your health');
  if(!bits.length)bits.push(A.kind==='state'?'no change to your strength, but it counts against you':'no change');
  return bits.join(', ')+'. '+(A.who?('Affects '+A.who+'.'):'Affects the hero who has it.');
}
function drawAfflictions(){
  BTNS=[];veil(.7);bigPanel(30,10,420,300);
  txt('AFFLICTIONS AND STATES',240,27,13,'#d8c88e','center',true);
  const act=new Set(afflList().map(e=>e.id)),seen=G.flags.affSeen||{};
  const list=AFFL_ORDER.slice().sort((a,b)=>(act.has(b)-act.has(a))||(AFFL_ORDER.indexOf(a)-AFFL_ORDER.indexOf(b)));
  if(!G.affSel||!AFFL[G.affSel])G.affSel=list[0];
  const lx=38,top=42,viewH=232,rowH=16,total=list.length*rowH;G.afMax=Math.max(0,total-viewH);G.afs=clamp(G.afs||0,0,G.afMax);
  ctx.save();ctx.beginPath();ctx.rect(lx,top,150,viewH);ctx.clip();
  list.forEach((id,i)=>{
    const ry=top+i*rowH-G.afs;if(ry<top-rowH||ry>top+viewH)return;
    const A=AFFL[id],known=act.has(id)||seen[id],sel=G.affSel===id;
    if(sel){ctx.fillStyle='rgba(216,200,142,.2)';ctx.fillRect(lx,ry,150,rowH-1)}
    ctx.fillStyle=known?A.col:'#4a4438';ctx.fillRect(lx+4,ry+4,7,7);ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=.8;ctx.strokeRect(lx+4,ry+4,7,7);
    txt(known?A.n:'???',lx+16,ry+8,9,act.has(id)?'#ffe9a0':known?'#c8b890':'#6a6050','left',act.has(id));
    if(act.has(id))txt('now',lx+144,ry+8,7,'#9ae0a0','right',true);
    BTNS.push({id:'af_'+id,x:lx,y:Math.max(top,ry),w:150,h:rowH-1});
  });
  ctx.restore();
  BTNS.push({id:'afarea',x:lx,y:top,w:150,h:viewH,up:true,drag:'aff'});
  if(G.afMax>0){const th=viewH-4,bh=Math.max(20,th*viewH/total),by=top+2+(th-bh)*(G.afs/G.afMax);ctx.fillStyle='rgba(216,200,142,.12)';ctx.fillRect(190,top+2,3,th);ctx.fillStyle='rgba(216,200,142,.6)';ctx.fillRect(190,by,3,bh)}
  // the page for the chosen one
  const A=AFFL[G.affSel],known=act.has(G.affSel)||seen[G.affSel],px=202,pw=238;
  ctx.fillStyle='rgba(216,200,142,.25)';ctx.fillRect(px-6,top,1,viewH);
  if(!known){
    txt('Unknown',px,top+10,12,'#8a8070','left',true);
    wrapText('You have not met this one yet. The healers of Khemetra say that the road and the old places hold many sicknesses and a few blessings.',pw,9).forEach((l,i)=>txt(l,px,top+30+i*12,9,'#8a8070','left'));
  }else{
    txt(A.n,px,top+10,13,A.col,'left',true);
    txt(A.kind==='bad'?'AFFLICTION':A.kind==='good'?'BLESSING':'STATE',px+pw,top+10,8,A.kind==='good'?'#9ae0a0':A.kind==='bad'?'#e8907a':'#e8d090','right',true);
    let y=top+26;
    const who=afflList().filter(e=>e.id===G.affSel);
    if(who.length){
      const parts=who.map(e=>{let t=afflHeroName(e.hi);if(e.until){const dl=Math.max(0,Math.ceil((e.until-G.clock)/1440));t+=' ('+(dl<=1?'under a day':dl+' days')+' left)'}else if(e.left)t+=' ('+e.left+' rounds)';if(AFFL[e.id].rest)t+=' ('+Math.max(0,AFFL[e.id].rest-e.rests)+' rests to go)';if(e.id==='warned')t+=' (warning '+(e.count||G.flags.khWarn||1)+' of 3)';return t});
      const ls=wrapText('Now on: '+parts.join(', '),pw,8.5);ls.forEach((l,i)=>txt(l,px,y+i*11,8.5,'#9ae0a0','left',true));y+=ls.length*11+5;
    }
    const sect=(h,t,c)=>{txt(h,px,y,8,'#d8c88e','left',true);y+=10;const ls=wrapText(t,pw,8.5);ls.forEach((l,i)=>txt(l,px,y+i*10.5,8.5,c||'#c8bc98','left'));y+=ls.length*10.5+6};
    sect('EFFECT',afflEffectText(Object.assign({id:G.affSel},A)),'#e0d0a0');
    sect('HOW IT FEELS',A.text,'#b8aa88');
    sect('HOW YOU CATCH IT',A.src);
    sect('HOW TO CURE IT',A.cure,'#a8d8a0');
  }
  btnText('afexit','Close',190,282,100,22);
}

/* ---- the row of little pictures at the top right of the view: one for each affliction the party has ---- */
let AFFL_ICON_LOADED=false;
function afflHud(){
  const L=afflList();if(!L.length||G.cut||G.talk||G.menu||G.inv.open||G.loot||G.overview)return;
  if(!AFFL_ICON_LOADED){AFFL_ICON_LOADED=true;for(const id of AFFL_ORDER)loadImg('af_'+id,'assets/af_'+id+'.png')}
  const groups=new Map();
  for(const e of L){const g=groups.get(e.id)||groups.set(e.id,[]).get(e.id);g.push(e.hi)}
  const ids=AFFL_ORDER.filter(id=>groups.has(id)).sort((a,b)=>(AFFL[a].kind==='good')-(AFFL[b].kind==='good')),S=18,gap=3;
  ctx.save();
  ids.forEach((id,k)=>{
    const A=AFFL[id],col=k%8,row=(k/8)|0,x=420-6-(col+1)*(S+gap)+gap,y=4+row*(S+gap+4),im=IMG['af_'+id];
    ctx.fillStyle='rgba(10,8,5,.72)';rrect(ctx,x-1.5,y-1.5,S+3,S+3,3);ctx.fill();
    ctx.lineWidth=1.4;ctx.strokeStyle=A.kind==='good'?'#a8d898':A.kind==='state'?'#e8d090':A.col;rrect(ctx,x-1.5,y-1.5,S+3,S+3,3);ctx.stroke();
    if(im)ctx.drawImage(im,x,y,S,S);else{ctx.fillStyle=A.col;ctx.fillRect(x+2,y+2,S-4,S-4);txt(A.n[0],x+S/2,y+S/2+.5,9,'#1a1208','center',true)}
    const who=groups.get(id);
    if(who.length<4&&AFFL[id].who!=='the whole party'){let w='';for(const hi of who)w+=afflHeroName(hi)[0];txt(w,x+S/2,y+S+4.5,6.5,'#e8dcb4','center',true)}
    else if(who.length>=4)txt('all',x+S/2,y+S+4.5,6.5,'#e8dcb4','center',true);
    btn('afhud_'+id,x,y,S,S);
  });
  ctx.restore();
}
