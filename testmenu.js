/* ==========================================================================
   THE TESTING MENU (prefix tm / TM). Loaded only by the GitHub Pages (and local) copy of the game: index.html has a one-line loader that does nothing on itch.io or in the Windows app, and both of those builds
   leave this file out. A "Testing" button on the title screen opens a list of typical parties (level 10, 20, ... 80), each with gear that fits its level, some potions and food, an average amount of gold, the main quests
   done up to about that point of the story, and a couple of side quests done in each town passed. Choose one, press "Go to area", and pick the area on the usual Go to area list: the party is built when you arrive.
   (Quests are only marked done: the story flags that the quests would have set are not all set, so a few doors and talks may still behave as at the start.)
   ========================================================================== */
const TM={PRESETS:[10,20,30,40,50,60,70,80],sel:null,apply:null};
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
function tmApply(n){
  // 0. the party is exactly level n: a higher one left by a save is rebuilt from level 1; the bag loses the usual test weapons and any spare gear
  if(G.heroes.some(h=>h.lvl!==n)){
    G.heroes=HERO_DEF.map(h=>({hp:h.hp,max:h.hp,base:h.hp,mp:h.mp,mpMax:h.mp,alive:true,hurt:0,flash:0,lvl:1,xp:0,food:100,powSel:0,learned:[],str:h.str,dex:h.dex,int:h.int,eq:{},spellSel:0,lvlFlash:0,unarmed:h.unarmed}));
    HERO_DEF.forEach((d,i)=>{if(d.caster)G.heroes[i].eq.s0=mkItem('sp_fire')});
    G.heroes.forEach((h,i)=>{while(h.lvl<n){h.xp=xpNeed(h.lvl);levelUp(i)}});G.lvlBanners.length=0}
  G.bag=G.bag.filter(it=>{const d=ITEMDEF[it.id];return d&&!['weapon','head','chest','arms','legs','shield','ring'].includes(d.k)});
  // 1. gear that fits the level (the best shop gear of the level, no rare or reward pieces), keeping the casters' spells
  G.heroes.forEach((h,hi)=>{
    const keep={};for(const k of ['s0','s1','s2','s3'])if(h.eq&&h.eq[k])keep[k]=h.eq[k];
    h.eq={};
    let best=null,bv=-1;for(const id of Object.keys(ITEMDEF)){const d=ITEMDEF[id];if(d.k!=='weapon'||!tmOk(id,d,n)||!slotFits('main',d,hi)||reqFail(h,d))continue;h.eq.main=mkItem(id);const r=heroDmgRange(h),w=heroWeapon(h),v=(r[0]+r[1])/2*(1+.5*(weaponCrit(w)+(w&&w.dbl||0)))*heroHitPct(hi,0);if(v>bv){bv=v;best=id}}
    h.eq={};if(best)h.eq.main=mkItem(best);
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
  G.gold=tmGold(n);
  // 4. the quests
  const Q=tmQuestPlan(n);for(const id of Q.main.concat(Q.extra))G.quests[id]={st:'done',base:0};
  msg('Testing party, level '+n+': suitable gear, '+tmGold(n)+' gold, '+Q.main.length+' main and '+Q.extra.length+' side quests marked done.','#9ae0ff')}
// ----- the screen -----
function tmDraw(){
  BTNS=[];veil(.82);bigPanel(24,8,432,304);
  txt('TESTING',240,22,13,'#d8c88e','center',true);
  txt('Choose a typical party, then press Go to area. It is built when you arrive. This menu is only in the GitHub Pages copy of the game.',240,37,7.5,'#c8b888','center');
  TM.PRESETS.forEach((n,i)=>{const x=40+(i%4)*104,y=56+((i/4)|0)*36,on=TM.sel===n;
    btnText('tm_'+n,'Level '+n,x,y,98,28);
    if(on){ctx.save();ctx.strokeStyle='#ffe36a';ctx.lineWidth=2;ctx.strokeRect(x-1,y-1,100,30);ctx.restore()}});
  const n=TM.sel;
  if(n){
    const Q=tmQuestPlan(n),tier=tmPotionTier(n).map(id=>ITEMDEF[id].n).reverse().join(' and ');
    const L=[['Party','Every hero is level '+n+' with full health.'],['Gear','The best weapon, helm, chest, arms, legs and shield the shops sell by level '+n+', and two rings.'],['Potions',tier+' (6 of the best, 4 of the next), a few mana potions and antidotes, torches and food.'],['Gold',tmGold(n)+' gold, about what a party of this level has in hand.'],['Quests',Q.main.length+' of '+Q.mainAll+' main quests, and 2 side quests in each of the first '+Q.towns+' towns ('+Q.extra.length+' in all), marked done.']];
    L.forEach(([a,b],i)=>{txt(a,50,146+i*24,9,'#c8a860','left',true);txt(b,110,146+i*24,8.5,'#ece0c0','left',false,undefined,330)});
  }else txt('Pick a level above.',240,150,10,'#c8b888','center');
  btnText('tm_back','Back',36,286,58,20);
  if(n)btnText('tm_go','Go to area  >',330,286,110,20);
}
{const _d=drawGoto;drawGoto=function(){
  if(G.testScreen)return tmDraw();
  _d.apply(this,arguments);
  if(G.testPreset)txt('TEST PARTY: LEVEL '+G.testPreset,240,48,8.5,'#9ae0ff','center',true)}}
{const _g=gotoBtn;gotoBtn=function(id){
  if(G.testScreen){
    if(id==='tm_back'){G.testScreen=false;G.state='title';return}
    if(id==='tm_go'&&TM.sel){G.testScreen=false;G.testPreset=TM.sel;G.gotoLvl=TM.sel;G.gotoGold=tmGold(TM.sel);G.gs=0;return}
    if(/^tm_\d+$/.test(id)){TM.sel=+id.slice(3);return}
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
  try{if(TM.apply&&G.state==='play'&&G.heroes&&G.heroes.length&&!G.cut){const n=TM.apply;TM.apply=null;tmApply(n)}}catch(e){console.error('tm',e);TM.apply=null}
  return _u.apply(this,arguments)}}
