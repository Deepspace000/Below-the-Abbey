/* ==========================================================================
   THE LIVING WORLD: seasons and weather, luck and omens, and the things that happen on the road.
   Seasons follow the calendar (thirty days each). Weather is set for each eight-hour stretch of the day from the day, the season and the region.
   Rain, fog, snow, frost and heat change how far the party can see, how fast cold, thirst and sun wear it down, and how easily it is ambushed.
   Luck nudges double hits, gold from the slain and the dodge; omens and the day's fortune push it up or down.
   Events (a passing caravan, a night thief, a travelling bard) turn up now and then.
   ========================================================================== */
const SEASONS=['Spring','Summer','Autumn','Winter'];
function seasonOf(){return SEASONS[Math.floor(G.clock/1440/30)%4]}
function dayNum(){return Math.floor(G.clock/1440)}
const WX_DEF={
  clear:{n:'Clear',fog:0,haze:0,dark:1,mix:0,col:[0,0,0],text:'A clear sky. Nothing in the way.'},
  rain:{n:'Rain',fog:.045,haze:.5,dark:.78,mix:.22,col:[96,108,120],fx:'rain',cold:2,wet:1,text:'Steady rain. The ground is slick, the light is grey and everyone is chilled through. Long exposure brings fever.'},
  storm:{n:'Thunderstorm',fog:.07,haze:.62,dark:.58,mix:.32,col:[70,76,92],fx:'rain',cold:2.5,wet:2,flash:1,text:'A thunderstorm. Rain in sheets, lightning, and a roar that hides footsteps. Cold and wet wear the party down fast.'},
  fog:{n:'Fog',fog:.14,haze:.9,dark:.88,mix:.5,col:[186,190,192],fx:'fog',stealth:1,text:'A thick fog. Nothing can be seen beyond a few squares, and it hides the party from enemies too.'},
  snow:{n:'Snow',fog:.07,haze:.7,dark:.86,mix:.4,col:[222,228,236],fx:'snow',cold:3,text:'Falling snow. Silent and beautiful, and it bites. Cold exposure is three times as fast.'},
  frost:{n:'Hard Frost',fog:.03,haze:.4,dark:.95,mix:.15,col:[190,210,230],cold:2.5,text:'A hard, bright frost. The air hurts to breathe, and fingers go numb quickly.'},
  heat:{n:'Heat Wave',fog:.025,haze:.7,dark:1,mix:.28,col:[246,210,150],fx:'heat',sun:2,thirst:1.6,text:'A heat wave. The air shimmers. Sun and thirst wear the party down twice as fast.'},
  haze:{n:'Dust Haze',fog:.06,haze:.8,dark:.92,mix:.45,col:[220,190,150],fx:'haze',text:'Dust hangs in the air and turns the sun to a dull coin. The view shortens.'}
};
function wxRegionOf(n){
  if(n===41||n===43||n===44||(n>=60&&n<=64))return 'desert';
  if([2,3,7,10,13,19,20,22,32,33,39].includes(n))return 'north';
  return null;
}
/* the weather over the party right now: null indoors and underground */
function weatherNow(){
  const L=LEVELS[LEVEL];if(!L||!G.clock)return null;
  const reg=wxRegionOf(LEVEL);if(!reg)return null;
  const block=Math.floor(G.clock/480),season=Math.floor(G.clock/1440/30)%4,r=hash2(block,reg==='desert'?7:3,41);
  let id='clear';
  if(reg==='north'){
    const T=[[['clear',.45],['rain',.25],['fog',.2],['storm',.1]],[['clear',.6],['rain',.14],['fog',.08],['storm',.06],['heat',.12]],[['clear',.34],['rain',.3],['fog',.3],['storm',.06]],[['clear',.3],['snow',.32],['fog',.2],['frost',.18]]][season];
    let a=0;for(const [k,p] of T){a+=p;if(r<a){id=k;break}}
  }else{
    const T=season===1?[['clear',.45],['heat',.45],['haze',.1]]:[['clear',.65],['heat',.2],['haze',.15]];
    let a=0;for(const [k,p] of T){a+=p;if(r<a){id=k;break}}
  }
  const w=WX_DEF[id];return Object.assign({id},w);
}
function wxAlert(){const w=weatherNow();return w&&w.id==='fog'?3:6}
function weatherAhead(k){ // what the next stretch will bring, by id (for the journal)
  const save=G.clock;G.clock+=480*k;const w=weatherNow();G.clock=save;return w;
}
/* the weather in the picture: rain, snow, a flash of lightning, a shimmer of heat */
function drawWeatherFx(){
  const w=weatherNow();if(!w||!w.fx)return;
  const t=G.time;ctx.save();
  if(w.fx==='rain'){
    ctx.strokeStyle='rgba(190,205,225,.5)';ctx.lineWidth=.8;ctx.beginPath();
    const n=w.id==='storm'?150:90;
    for(let i=0;i<n;i++){const x=((i*47+t*130*(1+(i%3)*.2))%460)-20,y=((i*83+t*420)%230)-10;ctx.moveTo(x,y);ctx.lineTo(x-4,y+11)}
    ctx.stroke();
    if(w.flash&&((t*.37)%7)<.14){ctx.fillStyle='rgba(235,240,255,.55)';ctx.fillRect(0,0,420,210)}
  }else if(w.fx==='snow'){
    ctx.fillStyle='rgba(245,248,255,.85)';
    for(let i=0;i<80;i++){const x=((i*53+t*18+Math.sin(t+i)*14)%440)-10,y=((i*71+t*38*(1+(i%4)*.25))%230)-10;ctx.fillRect(x,y,1.6+(i%3)*.6,1.6+(i%3)*.6)}
  }else if(w.fx==='heat'){
    ctx.fillStyle='rgba(255,200,110,.08)';ctx.fillRect(0,0,420,210);
    ctx.fillStyle='rgba(255,236,190,.07)';for(let i=0;i<5;i++){const y=112+i*7+Math.sin(t*2+i)*2;ctx.fillRect(0,y,420,2.2)}
  }else if(w.fx==='haze'){ctx.fillStyle='rgba(214,180,130,.12)';ctx.fillRect(0,0,420,210)}
  else if(w.fx==='fog'){ctx.fillStyle='rgba(205,208,210,.10)';ctx.fillRect(0,0,420,210)}
  ctx.restore();
}
/* what the weather says on the clock */
function weatherLabel(){const w=weatherNow();return seasonOf()+(w?' - '+w.n:'')}
/* ---------------------------------------------------------------- luck and omens ---------------------------------------------------------------- */
const OMENS=[
  {t:'A white dove lands on the road and does not fly away.',l:2,good:1},{t:'You find a four-leaf clover growing in a crack in the stones.',l:2,good:1},
  {t:'A shooting star crosses the sky in broad daylight.',l:3,good:1},{t:'A beggar blesses you for no reason at all.',l:1,good:1},{t:'A rainbow stands over the road ahead.',l:2,good:1},
  {t:'A black cat crosses your path and stares at you.',l:-2,good:0},{t:'A raven lands on a signpost and croaks three times.',l:-2,good:0},{t:'A mirror cracks in someone\'s window as you pass.',l:-3,good:0},
  {t:'You spill salt, and the wind blows it over everyone\'s shoulder.',l:-2,good:0},{t:'Your shadow looks longer than it should, and is slow to follow.',l:-1,good:0}
];
function lukeData(){const F=G.flags;return F.luck||(F.luck={base:0,day:-1,omen:null,shift:0})}
function luckVal(){
  const L=lukeData(),d=dayNum();
  if(L.day!==d){L.day=d;const o=OMENS[(hash2(d,5,77)*OMENS.length)|0];L.omen=(hash2(d,6,78)<.5)?o:null;L.shift=0;L.said=0}
  let v=L.base+(L.omen?L.omen.l:0)+L.shift;
  if(typeof companionLuck==='function')v+=companionLuck();
  return clamp(v,-10,10);
}
function luckAdd(a,why){lukeData().base=clamp(lukeData().base+a,-6,6);if(why)msg(`${a>0?'Fortune smiles':'Fortune frowns'} (${why}).`,a>0?'#e8e090':'#d0a0a0')}
function luckSay(){
  const L=lukeData();luckVal();
  if(L.omen&&!L.said&&G.state==='play'&&!G.cut){L.said=1;msg(L.omen.t,L.omen.good?'#e8e090':'#c0a8c8')}
}
function luckPas(key){const v=luckVal();return key==='crit'?v*.005:key==='goldPct'?v*.02:key==='dodge'?v*.003:0}
/* ---------------------------------------------------------------- the road: caravans, night thieves and bards ---------------------------------------------------------------- */
function worldEventsTick(min){
  if(G.state!=='play'||G.cut||G.talk||G.menu||LEVEL>=7100)return; // never in a cave or a wild dungeon
  const F=G.flags,E=F.ev||(F.ev={clock:G.clock,last:-9999}),t=repTownOf(LEVEL),reg=wxRegionOf(LEVEL),hour=(G.clock%1440)/60;
  E.clock+=min;
  luckSay();
  if(E.clock<90||G.clock-E.last<240||G.decor.some(d=>d.ev))return; // events are rare
  E.clock=0;
  const luck=luckVal();
  if(t&&hour>=18&&hour<24&&Math.random()<.35)return evSpawn('ev_bard',IMG.ev_bard?'ev_bard':'peasantW','Tamsin Larkwhistle, the travelling bard, has set up near the square. A small crowd gathers.');
  if(!t&&reg&&hour>=7&&hour<19&&Math.random()<.28+Math.max(0,luck)*.01)return evSpawn('ev_trader','peasantM','A passing merchant has pulled his cart off the road and hung out a sign: wares for sale.');
}
function evSpawn(npc,face,text){
  const f=freeNear(G.P.x,G.P.y,5,1);if(!f.length)return;
  const [x,y]=f[0];G.decor.push({k:face,x,y,block:true,npc,ev:1});buildDecorMap();G.flags.ev.last=G.clock;
  msg(text,'#e8e0a0');sfx('key');
}
/* a thief or an ambush while the party sleeps in the open */
function worldRest(inn){
  if(inn||G.state!=='play')return;
  const reg=wxRegionOf(LEVEL);if(!reg||repTownOf(LEVEL))return;
  const scout=typeof profPerk==='function'?profPerk('scout'):0,cat=typeof hasCompanion==='function'?((hasCompanion('cat')?.08:0)+(hasCompanion('dog')?.1:0)+(hasCompanion('duck')?.05:0)):0,luck=luckVal();
  const guard=scout*.06+cat+luck*.01+(weatherNow()&&weatherNow().stealth?.06:0);
  const r=Math.random();
  if(r<.14-guard){
    const lost=Math.min(G.gold,Math.max(5,Math.round(G.gold*(.05+Math.random()*.08))));
    if(lost>0){G.gold-=lost;msg(`Thieves came in the night. ${lost} gold is gone from the party's purse.`,'#e0a080');luckAdd(-1)}
  }else if(r<.22-guard){
    later(400,()=>{if(G.state==='play'&&!G.cut){msg('A shout in the dark! Bandits have found the camp!','#ff9a8a');spawnWave(['bandit','bandit','archer'])}});
  }
}
khNpc('ev_trader','A passing merchant','peasantM',d=>say('A traveller\'s prices on a traveller\'s road. I carry what the road demands: food, light, cures and the odd bargain.',[['Show me your cart.',()=>{
  openShop(d,[['bread',6],['cheese',4],['water',6],['torch',4],['antidote',3],['salve',3],['healdraught',3],['manadraught',2],['holywater',1],['sleeptea',2]],'The Passing Cart');return null}],['Any news from the road?',()=>say(typeof rumourFor==='function'?rumourFor('road'):'The road is long and the news is stale.',[BYE])],BYE]));
loadImg('ev_bard','assets/ev_bard.png');NPC_H.ev_bard=1.25;
const BARD_SONGS=[ // what Tamsin sings, one for each evening
  ['The Ballad of the Goat and the Tax Roll','A long, rolling ballad about a goat who ate every page of the tax roll, and the three tax men who followed her for a year to get it back, one bite at a time. The square laughs until it cries.'],
  ['The Dragon Who Went on a Diet','A bright song about a dragon who stopped eating knights for the good of her scales. It ends badly for the knights, and very well for the baker.'],
  ['Saint Elen’s Lament','A slow, clear lament for the pilgrims who walk the long road and do not come back the same. Nobody speaks when it ends. Somebody blows their nose.'],
  ['The Drowned Bell of Oldhaven','A cold, lovely song about a bell that still rings under the harbour on the nights before a storm. Tamsin plays it very quietly, and the lamps seem to dim.'],
  ['Three Crows at the Crossroads','A quick, wicked drinking song about three crows who sell the same road to three travellers. The chorus is shouted by everyone who knows it, and a few who do not.'],
  ['The Lantern in the Oak','A gentle tune about a lantern someone left in an old oak, and every traveller who has sat beneath it since. It is the one she plays last.']];
khNpc('ev_bard','Tamsin Larkwhistle, bard','ev_bard',d=>{
  const F=G.flags,day=dayNum(),song=BARD_SONGS[day%BARD_SONGS.length];
  if(F.bardDay===day)return say('I have sung you my best for tonight. Come back tomorrow evening; I know a good many more, and I never sing the same one twice running.',[BYE]);
  return say('Tamsin Larkwhistle, at your service, and at the service of anyone with a coin and a quiet minute! I walk the roads for the songs, and the roads walk me for the dinners. Tonight it is “'+song[0]+'”. Five gold, or whatever you can spare.',[
    ['Hear the song (5 gold)',()=>{if(G.gold<5)return say('Five gold. Even bards have to eat, I am afraid.',[BYE]);G.gold-=5;F.bardDay=day;afflInflict('wellrested',-1,true);luckAdd(1);return say(song[1]+' The party feels rested, and a little braver.',[BYE])}],
    ['Tip generously (25 gold)',()=>{if(G.gold<25)return say('That is a kind thought, and I can hear in your purse that you cannot afford it.',[BYE]);G.gold-=25;F.bardDay=day;luckAdd(2,'a generous tip');honourAdd(1);const t=repTownOf(LEVEL);if(t)repAdd(t,2,'you tipped the bard');afflInflict('wellrested',-1,true);return say('Tamsin bows so low her feather brushes the stones, and sings “'+song[0]+'” twice, once for the square and once for you. Then she adds a verse that mentions each of you by name.',[BYE])}],
    ['Heard anything on the road?',()=>say(typeof rumourFor==='function'?rumourFor('town'):'Only songs, I am afraid. But songs travel, and so does gossip.',[BYE])],BYE]);
},{sc:1});
journalPage({id:'wx',title:'Weather and Seasons',
  summary:()=>{const w=weatherNow();return `${seasonOf()}, day ${dayNum()+1}. ${w?'Now: '+w.n+'.':'Indoors or underground: no weather here.'} Open for the forecast and what each kind of weather does.`},
  note:()=>0,
  draw(){
    jFrame('Weather and seasons');
    const w=weatherNow(),yr=Math.floor(G.clock/1440/30),sd=Math.floor(G.clock/1440)%30+1;
    txt(`${seasonOf()}, day ${sd} of 30`,40,46,12,'#e8d89a','left',true);
    txt(`Day ${dayNum()+1} of the journey`,440,46,9,'#a89878','right');
    SEASONS.forEach((s,i)=>{const x=40+i*100,cur=s===seasonOf();ctx.fillStyle=cur?'rgba(216,200,142,.35)':'rgba(40,24,16,.7)';ctx.fillRect(x,54,92,16);ctx.strokeStyle='#7a6440';ctx.strokeRect(x,54,92,16);txt(s,x+46,62.5,9,cur?'#fff0b0':'#a89878','center',cur)});
    txt('Now',40,90,10,'#d8c88e','left',true);
    txt(w?w.n:'No weather here',90,90,11,'#e0e8f0','left',true);
    wrapText(w?w.text:'Under a roof or under the ground the weather cannot reach the party. Outside, it decides how far you see, how fast cold and heat wear you down, and how easily thieves find your camp.',380,8.5).forEach((l,i)=>txt(l,40,104+i*11,8.5,'#c8bc98','left'));
    txt('Next stretches of the day (eight hours each)',40,148,10,'#d8c88e','left',true);
    for(let k=1;k<=4;k++){const a=weatherAhead(k);txt(`${k===1?'Next':'In '+k*8+' hours'}`,40,166+(k-1)*14,8.5,'#a89878','left');txt(a?a.n:'-',140,166+(k-1)*14,9,'#e0e8f0','left',true)}
    txt('A scout can tell you more, and a lucky party gets fewer bad days.',40,232,8,'#a89878','left');
    const L=lukeData();txt(`Fortune today: ${luckVal()>0?'+':''}${luckVal()}${L.omen?'  -  '+L.omen.t:''}`,40,252,8.5,luckVal()>=0?'#e8e090':'#c0a8c8','left',false,undefined,400);
  }
});
journalPage({id:'luck',title:'Luck and Omens',
  summary:()=>{const v=luckVal();return `Luck ${v>0?'+':''}${v}. Luck nudges double hits, gold from the slain and the dodge. ${lukeData().omen?'Today: '+lukeData().omen.t:'No omen today.'}`},
  note:()=>0,
  draw(){
    jFrame('Luck and omens');
    const v=luckVal();
    txt(`Luck: ${v>0?'+':''}${v}`,240,52,18,v>=0?'#e8e090':'#c0a8c8','center',true);
    jBar(60,64,360,10,(v+10)/20,v>=0?'#e8d060':'#9080c0');ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(240,62,1,14);
    wrapText('Luck nudges every roll: +0.5% double hits and +2% gold from the slain for each point, and enemies miss a little more often. It is made of what you have done (kind acts and fair play raise it, cruelty and curses lower it), the omen of the day, and the company you keep.',380,8.5).forEach((l,i)=>txt(l,40,92+i*11,8.5,'#c8bc98','left'));
    const L=lukeData();
    txt('Today',40,150,10,'#d8c88e','left',true);
    wrapText(L.omen?L.omen.t+` (${L.omen.l>0?'+':''}${L.omen.l} luck for the day)`:'The day has no omen. Nothing in the sky or on the road to read.',380,8.5).forEach((l,i)=>txt(l,40,164+i*11,8.5,L.omen&&L.omen.good?'#e8e090':'#b8aa88','left'));
    txt('What raises it',40,196,10,'#d8c88e','left',true);txt('Tipping bards, honest quests, kindness, a cat in the party, a rabbit\'s foot.',40,210,8,'#a8d898','left',false,undefined,400);
    txt('What lowers it',40,228,10,'#d8c88e','left',true);txt('Curses, theft, black cats, ravens and cracked mirrors.',40,242,8,'#d09890','left',false,undefined,400);
  }
});

/* ---------------------------------------------------------------- mercy: a beaten bandit may beg ---------------------------------------------------------------- */
function mercyCheck(e){
  const d=ENEMY_DEF[e.t];if(!d||d.kind!=='bandit'||e.surr||e.noMercy||mxIsBoss(e)||e.poly)return;
  if(e.hp>e.maxhp*.22||Math.random()>.12)return; // only now and then: about one beaten bandit in eight begs
  e.surr=true;e.surrT=0;e.alert=false;(e.st=e.st||{}).hold=0;
  msg(`The ${d.name} throws down his weapon and begs for mercy!`,'#e8d890');if(typeof mxFloat==='function')mxFloat(e,'Mercy!','#e8d890');
}
function mercyBroken(e){
  if(!e.surr||e.mercyDone)return;e.mercyDone=true;
  e.surr=false;e.noMercy=true;e.alert=true; // struck again: he fights on (or can simply be killed), never stands in the way surrendered
  honourAdd(-3,'you struck down a man who had surrendered');luckAdd(-1);const t=repTownOf(LEVEL);if(t)repAdd(t,-2,'word gets round');
}
function mercyTick(){
  for(const e of G.enemies){
    if(!e.surr||e.hp<=0||e.mercyDone)continue;
    e.surrT=(e.surrT||0)+1;
    if(e.surrT>=3){
      const g=rnd(8,30),nm=ENEMY_DEF[e.t].name;e.hp=0;e.dying=.55;e.surr=false;G.gold+=g;
      honourAdd(2,'mercy');luckAdd(1);const t=repTownOf(LEVEL);if(t)repAdd(t,1,'a bandit speaks well of you');
      msg(`The ${nm} stammers his thanks, presses ${g} gold into your hand and runs. `+(Math.random()<.4?'"One thing I heard on the road," he calls back. '+rumourFor('road').replace('They say: ',''):''),'#a8e0a0');
    }
  }
}
