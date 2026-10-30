/* ==========================================================================
   THE TESTING MENU (prefix tm / TM). Loaded only by the GitHub Pages (and local) copy of the game: index.html has a one-line loader that does nothing on itch.io or in the Windows app, and both of those builds
   leave this file out. A "Testing" button on the title screen opens a list of typical parties (levels 5, 10, 15, ... 100, each in three kinds: best gear for the level; a weaker party with average weapons; and a real party where the front fighters hold the ok and good gear and the back line waits with cheap gear, and half the gold), each with a healer (a Priest) in the party and with gear that fits its level, some potions and food, an average amount of gold, the main quests
   done up to about that point of the story, and a couple of side quests done in each town passed. Choose one, press "Go to area", and pick the area on the usual Go to area list: the party is built when you arrive.
   (Quests are only marked done: the story flags that the quests would have set are not all set, so a few doors and talks may still behave as at the start.)
   ========================================================================== */
const TM={PRESETS:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],sel:null,apply:null};
const tmGold=n=>Math.round(3.2*n*n+600);
const tmEffL=d=>d.lvl||Math.min(100,Math.round(Math.sqrt(d.price||0)/1.2));
const tmOk=(id,d,n)=>d&&tmEffL(d)<=n&&(d.price||0)>0&&(d.price||0)<=40*n*n+300&&!/^pp_/.test(id)&&!d.rar&&d.k!=='quest';
function tmPotionTier(n){const ids=HEAL_IDS.filter(id=>ITEMDEF[id]&&(ITEMDEF[id].minLvl||0)<=n);return ids.slice(-2)}
function tmQuestPlan(n){
  const frac=Math.max(0,Math.min(1,(n-5)/75)),main=[...MAIN_QUESTS].filter(id=>QUESTS[id]),k=Math.round(main.length*frac);
  const by={},areas=(typeof QAREA_ORDER!=='undefined'?QAREA_ORDER.slice():[]);
  for(const id of Object.keys(QUESTS)){if(MAIN_QUESTS.has(id))continue;const a=QAREA[id]||'Elsewhere';(by[a]=by[a]||[]).push(id);if(!areas.includes(a))areas.push(a)}
  const ka=Math.round(areas.filter(a=>by[a]).length*frac),use=areas.filter(a=>by[a]).slice(0,ka),extra=[];
  for(const a of use)for(const id of by[a].slice(0,2))extra.push(id);
  return {main:main.slice(0,k),mainAll:main.length,extra,towns:use.length}}
// a real party: what most parties carry in the first thirty levels. Each piece is cheap (from the lowest third of what the shops sell by that level), or ok (the middle), or missing (one in seven of the armour slots), and only two pieces in the whole party are good (the best of the level)
function tmRealGear(h,hi,n,good){
  const rnd=hgdmRng(n*131+hi*17+7),want=HERO_DEF[hi].caster?['Staff']:/Priest/.test(HERO_DEF[hi].cls)?['Mace','Staff']:null;h.eq={};
  for(const slot of ['main','head','chest','arms','legs','off']){
    const list=[];
    for(const id of Object.keys(ITEMDEF)){const d=ITEMDEF[id];
      if(slot==='main'){if(d.k!=='weapon')continue;if(want&&!want.includes(d.t))continue}else if(slot==='off'){if(d.k!=='shield')continue}else if(d.k!==slot)continue;
      if(!tmOk(id,d,n)||!slotFits(slot,d,hi)||reqFail(h,d))continue;
      let v;if(slot==='main'){h.eq.main=mkItem(id);const r=heroDmgRange(h);v=(r[0]+r[1])/2;delete h.eq.main}else v=d.armor||0;
      list.push([id,v])}
    if(!list.length&&slot==='main'&&want){for(const id of Object.keys(ITEMDEF)){const d=ITEMDEF[id];if(d.k!=='weapon'||!tmOk(id,d,n)||!slotFits('main',d,hi)||reqFail(h,d))continue;h.eq.main=mkItem(id);const r=heroDmgRange(h);list.push([id,(r[0]+r[1])/2]);delete h.eq.main}}
    if(!list.length)continue;list.sort((a,b)=>a[1]-b[1]);const L=list.length;
    let tier;if(good.has(hi+':'+slot))tier='good';else{const r=rnd(),front=hi<2; // the front fighters get the upgrades first (mostly ok pieces); the back line waits, with mostly cheap old gear
      tier=(slot!=='main'&&r<(front?.08:.12))?'none':r<(front?.3:.72)?'cheap':'ok'}
    if(tier==='none')continue;
    let idx=tier==='good'?L-1:tier==='cheap'?Math.floor(rnd()*Math.max(1,Math.ceil(L*.3))):Math.min(L-1,Math.floor(L*.4)+Math.floor(rnd()*Math.max(1,Math.ceil(L*.3))));
    h.eq[slot]=mkItem(list[idx][0])}}
function tmCleanse(){try{for(const e of afflList().slice())afflRemove(e,true)}catch(er){}}
function tmApply(n,weak,real){
  // 0. the party is exactly level n: a higher one left by a save is rebuilt from level 1; the bag loses the usual test weapons and any spare gear
  { // a typical party, with a healer: Warrior, Thief, Mage and Priest
    setParty(DEFAULT_PARTY);
    G.heroes=HERO_DEF.map(h=>({hp:h.hp,max:h.hp,base:h.hp,mp:h.mp,mpMax:h.mp,alive:true,hurt:0,flash:0,lvl:1,xp:0,food:100,powSel:0,learned:[],str:h.str,dex:h.dex,int:h.int,eq:{},spellSel:0,lvlFlash:0,unarmed:h.unarmed}));
    HERO_DEF.forEach((d,i)=>{if(d.caster)G.heroes[i].eq.s0=mkItem('sp_fire')});
    G.heroes.forEach((h,i)=>{while(h.lvl<n){h.xp=xpNeed(h.lvl);levelUp(i)}});G.lvlBanners.length=0;G.sel=0}
  G.bag=G.bag.filter(it=>{const d=ITEMDEF[it.id];return d&&!['weapon','head','chest','arms','legs','shield','ring'].includes(d.k)});
  // 1. gear that fits the level (the best shop gear of the level, no rare or reward pieces), keeping the casters' spells
  const goodSet=new Set();if(real){goodSet.add('0:main');goodSet.add('0:chest')} // the two good pieces go to the front melee fighter: his weapon and his armour
  G.heroes.forEach((h,hi)=>{
    const keep={};for(const k of ['s0','s1','s2','s3'])if(h.eq&&h.eq[k])keep[k]=h.eq[k];
    if(real){tmRealGear(h,hi,n,goodSet);Object.assign(h.eq,keep);recalcMax(hi);h.hp=h.max;h.mp=h.mpMax;h.food=100;return}
    h.eq={};
    const wl=[];for(const id of Object.keys(ITEMDEF)){const d=ITEMDEF[id];if(d.k!=='weapon'||!tmOk(id,d,n)||!slotFits('main',d,hi)||reqFail(h,d))continue;h.eq.main=mkItem(id);const r=heroDmgRange(h),w=heroWeapon(h);wl.push([id,(r[0]+r[1])/2*(1+.5*(weaponCrit(w)+(w&&w.dbl||0)))*heroHitPct(hi,0),tmEffL(d)])}
    // casters carry a staff, the Priest a mace or staff, when the shops have one at this level
    {const want=HERO_DEF[hi].caster?['Staff']:/Priest/.test(HERO_DEF[hi].cls)?['Mace','Staff']:null;if(want){const f=wl.filter(q=>want.includes(ITEMDEF[q[0]].t));if(f.length){wl.length=0;wl.push(...f)}}}
    wl.sort((x,y)=>y[1]-x[1]);let pick=wl[0];
    if(weak&&wl.length){const goal=wl[0][1]*.8;pick=wl.reduce((b,q)=>Math.abs(q[1]-goal)<Math.abs(b[1]-goal)?q:b,wl[0])} // an average weapon: about four fifths as good as the best the shops sell by this level
    h.eq={};if(pick)h.eq.main=mkItem(pick[0]);
    for(const slot of ['head','chest','arms','legs','off']){let bi=null,ba=-1;for(const id of Object.keys(ITEMDEF)){const d=ITEMDEF[id];if(!['head','chest','arms','legs','shield'].includes(d.k)||!tmOk(id,d,n)||!slotFits(slot,d,hi)||reqFail(h,d))continue;if((d.armor||0)>ba){ba=d.armor||0;bi=id}}if(bi)h.eq[slot]=mkItem(bi)}
    const rings=Object.keys(ITEMDEF).filter(id=>ITEMDEF[id].k==='ring'&&tmOk(id,ITEMDEF[id],n)).sort((a,b)=>ITEMDEF[b].price-ITEMDEF[a].price);
    ['r0','r1'].forEach((s,i)=>{if(rings[i]&&slotFits(s,ITEMDEF[rings[i]],hi)&&!reqFail(h,ITEMDEF[rings[i]]))h.eq[s]=mkItem(rings[i])});
    Object.assign(h.eq,keep);
    recalcMax(hi);h.hp=h.max;h.mp=h.mpMax;h.food=100});
  // 2. potions and food
  G.bag=G.bag.filter(it=>!HEAL_IDS.includes(it.id)&&!['torch','bread','cheese','apple'].includes(it.id));
  const tier=tmPotionTier(n),add=(id,c)=>{if(ITEMDEF[id])for(let i=0;i<c;i++)bagAdd(mkItem(id))};
  tier.forEach((id,i)=>add(id,i===tier.length-1?6:4));
  for(const id of ['manadraught','antidote'])add(id,2);
  for(const [id,c] of [['torch',4],['bread',4],['cheese',3],['apple',3]])add(id,c);
  if(!bagCount('lantern'))add('lantern',1);
  // 3. gold
  G.gold=real?Math.round(tmGold(n)*.5):tmGold(n);
  // 4. the quests
  const Q=tmQuestPlan(n);for(const id of Q.main.concat(Q.extra))G.quests[id]={st:'done',base:0};
  // 5. each hero's special power is the strongest active power the hero has unlocked at this level (the one that needs the highest level)
  G.heroes.forEach((h,hi)=>{try{const PW=heroPowers(hi);let best=0,bl=-1;PW.forEach((p,k)=>{if(p&&p.act&&h.lvl>=p.lv&&p.lv>=bl){bl=p.lv;best=k}});h.powSel=best}catch(e){console.error('tm power',e)}});
  tmCleanse();TM.clean=[G.time+1.2,G.time+3]; // a test party starts with no afflictions (those an area gives on entering are cleared a moment later too)
  // the creatures of the area were sized while the party was being rebuilt at a low level: size them again now that it stands at level n
  for(const e of G.enemies){if(e.hp<=0||e.dying)continue;const fr=e.hp/e.maxhp;e.maxhp=enemyStat(e.t,e.lvl).hp;e.hp=Math.max(1,Math.ceil(e.maxhp*fr))}
  msg('Testing party, level '+n+(real?' (real party: a mix of cheap and ok gear, two good pieces)':weak?' (weaker, average weapons)':'')+': '+(real?Math.round(tmGold(n)*.5):tmGold(n))+' gold, '+Q.main.length+' main and '+Q.extra.length+' side quests marked done.','#9ae0ff')}
// ----- the screen -----
function tmDraw(){
  BTNS=[];veil(.82);bigPanel(24,8,432,304);
  txt('TESTING',240,22,13,'#d8c88e','center',true);
  txt('Choose a typical party (with a Priest to heal), then press Go to area. It is built when you arrive.',240,37,7.5,'#c8b888','center');
  const grp=[['Best gear for the level',48,''],['Weaker party: average weapons, not the best of their level',90,'w'],['Real party: front fighters upgraded first, back line cheap, half the gold',132,'r']];
  for(const [title,y0,pre] of grp){
    txt(title,40,y0-3,8.5,'#c8a860','left',true);
    TM.PRESETS.forEach((n,i)=>{const x=30+i*21,y=y0+2,on=TM.sel&&TM.sel.n===n&&(TM.sel.real?'r':TM.sel.weak?'w':'')===pre; // twenty levels in a row, 5 to 100: the row title says which kind of party
      ctx.save();ctx.fillStyle=on?'#4a3c1c':'#241c10';ctx.fillRect(x,y,19,24);ctx.lineWidth=1.2;ctx.strokeStyle=on?'#ffe36a':'#8a7448';ctx.strokeRect(x+.5,y+.5,18,23);ctx.restore(); // plain small boxes: the stone buttons are too wide for a number this small
      ctx.save();ctx.font="bold 9.5px 'IM Fell English SC',Georgia,serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText(String(n),x+9.5,y+12.5);ctx.fillStyle=on?'#ffffff':'#fff0bc';ctx.fillText(String(n),x+9.5,y+12.5);ctx.restore();btn('tm_'+pre+n,x,y,19,24); // bold, bright and outlined so it reads at once
      if(on){ctx.save();ctx.strokeStyle='#ffe36a';ctx.lineWidth=2;ctx.strokeRect(x-1,y-1,21,26);ctx.restore()}})}
  const S=TM.sel;
  if(S){const n=S.n,Q=tmQuestPlan(n),tier=tmPotionTier(n).map(id=>ITEMDEF[id].n).reverse().join(' and ');
    const L=[['Party','Warrior, Thief, Mage and Priest (the healer), every hero level '+n+' with full health.'],['Gear',(S.real?'A mix: the front fighters (Warrior and Thief) hold the upgrades, mostly ok pieces, and only the weapon and chest of the Warrior are good. The back line (Mage and Priest) waits with old cheap gear and some empty slots.':S.weak?'An average weapon of the last dozen levels (not the best); the best armour, helm, arms, legs and shield the shops sell by level '+n+', and two rings.':'The best weapon, helm, chest, arms, legs and shield the shops sell by level '+n+', and two rings.')],['Potions',tier+' (6 of the best, 4 of the next), mana potions, antidotes, torches and food.'],['Gold',(S.real?Math.round(tmGold(n)*.5):tmGold(n))+' gold'+(S.real?', half of what a party of this level has in hand (it takes a while to save).':', about what a party of this level has in hand.')],['Quests',Q.main.length+' of '+Q.mainAll+' main quests, and 2 side quests in each of the first '+Q.towns+' towns ('+Q.extra.length+' in all), marked done.']];
    L.forEach(([a,b],i)=>{txt(a,50,188+i*18,9,'#c8a860','left',true);txt(b,104,188+i*18,8,'#ece0c0','left',false,undefined,340)});
  }else txt('Pick a party above.',240,230,10,'#c8b888','center');
  btnText('tm_back','Back',36,286,58,20);
  btnText('tm_plain','Go to area (no test party)',150,286,170,20);
  if(S)btnText('tm_go','Go to area  >',330,286,110,20);
}
{const _d=drawGoto;drawGoto=function(){
  if(G.testScreen)return tmDraw();
  _d.apply(this,arguments);
  if(G.testPreset)txt('TEST PARTY: '+(G.testPreset.real?'REAL ':G.testPreset.weak?'WEAKER ':'LEVEL ')+G.testPreset.n,240,48,8.5,'#9ae0ff','center',true)}}
{const _g=gotoBtn;gotoBtn=function(id){
  if(G.testScreen){
    if(id==='tm_back'){G.testScreen=false;G.state='title';return}
    if(id==='tm_plain'){G.testScreen=false;G.testPreset=null;G.gs=0;return} // the plain Go to area list: your own party, raised to the level and gold set there
    if(id==='tm_go'&&TM.sel){G.testScreen=false;G.testPreset=TM.sel;G.gotoLvl=TM.sel.n;G.gotoGold=TM.sel.real?Math.round(tmGold(TM.sel.n)*.5):tmGold(TM.sel.n);G.gs=0;return}
    {const m=/^tm_([wr]?)(\d+)$/.exec(id);if(m){TM.sel={n:+m[2],weak:m[1]==='w',real:m[1]==='r'};return}}
    return}
  if(['go_lm','go_lp','go_gm','go_gp'].includes(id))G.testPreset=null; // changing the level or gold by hand goes back to the plain Go to area
  if(id==='go_back'){G.testPreset=null}
  return _g.apply(this,arguments)}}
// the title screen: a Testing button
{const _t=drawTitle;drawTitle=function(){_t.apply(this,arguments);try{if(G.state==='title')btnText('ttest','Testing',396,290,74,20)}catch(e){}}}
{const _tb=titleBtn;titleBtn=function(id){if(id==='ttest'){G.state='goto';G.testScreen=true;G.gs=0;sfx('equip');return}return _tb.apply(this,arguments)}}
// when the area has been entered, the party is built
{const _j=jumpToLevel;jumpToLevel=function(){TM.apply=G.testPreset||null;return _j.apply(this,arguments)}}
{const _u=update;update=function(dt){
  try{if(TM.clean&&TM.clean.length&&G.state==='play'&&G.time>=TM.clean[0]){TM.clean.shift();tmCleanse()}}catch(er){}
  try{if(TM.apply&&G.state==='play'&&G.heroes&&G.heroes.length&&!G.cut){const a=TM.apply;TM.apply=null;tmApply(a.n,a.weak,a.real)}}catch(e){console.error('tm',e);TM.apply=null}
  return _u.apply(this,arguments)}}
