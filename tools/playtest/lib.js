/* PLAYTEST bot library, injected into the page. Uses only the game's own input function act() and real timers. */
(()=>{
const PT=window.PT={};
window.requestAnimationFrame=()=>0;try{window.sfx=function(){};window.areaAudio=function(){}}catch(e){} // we drive the clock ourselves
PT.stats={steps:0,turns:0,rounds:0,talkNodes:0,talkChars:0,shopTx:0,rests:0,pumps:0,fights:0,wipes:0,kills:0};
PT.deaths=[];PT.events=[];PT.dmg={};PT.errs=[];
PT.ev=(t,o)=>{PT.events.push(Object.assign({t,lvl:LEVEL,time:Math.round(G.time)},o||{}))};
PT.tr=(x)=>{if(PT.debug)console.log('TR '+x)};PT.debug=false;PT.dl=0;PT.late=()=>PT.dl&&performance.now()>PT.dl;PT.where='';
PT.trim=()=>{if(G.floats.length>20)G.floats.length=0;if(G.fx.length>20)G.fx.length=0;if(G.hits&&G.hits.length>20)G.hits.length=0;if(G.lvlBanners.length>20)G.lvlBanners.length=0;if(G.arrows&&G.arrows.length>40)G.arrows.length=0};
PT.pump=(n,dt)=>{dt=dt||0.05;for(let i=0;i<n;i++){update(dt);PT.stats.pumps++;if((i&7)===0)PT.trim()}};
PT.waitAct=(max)=>{max=max||400;let i=0;if(G.cut&&PT.cut)PT.cut();while(!canAct()&&i<max&&G.state==='play'&&!G.talk&&!G.loot){update(0.05);PT.stats.pumps++;i++;if((i&7)===0)PT.trim()}PT.trim();return canAct()};
PT.rating=()=>{try{return gotoRate(LEVEL)||LEVEL_RATING[LEVEL]||0}catch(e){return LEVEL_RATING[LEVEL]||0}};
PT.avgLvl=()=>{const a=G.heroes;return a.reduce((n,h)=>n+h.lvl,0)/a.length};
/* death tracking: wrap enemyAct to attribute damage */
const _ea=enemyAct;
enemyAct=function(e){
  const before=G.heroes.map(h=>({hp:h.hp,al:h.alive}));
  PT.cur=e;
  const r=_ea.apply(this,arguments);
  const nm=(ENEMY_DEF[e.t]&&ENEMY_DEF[e.t].name)||e.t;
  G.heroes.forEach((h,i)=>{const d=before[i].hp-h.hp;if(d>0){const k=LEVEL+'|'+nm+'|'+e.lvl;PT.dmg[k]=(PT.dmg[k]||0)+d;PT.lastHit=PT.lastHit||{};PT.lastHit[i]={nm,lvl:e.lvl,d,t:G.rounds}}
    if(before[i].al&&!h.alive){PT.deaths.push({kind:'hero',rating:PT.rating(),gap:+(PT.rating()-PT.avgLvl()).toFixed(1),hero:HERO_DEF[i].name,area:LEVEL,areaName:(typeof LEVEL_NAMES!=='undefined'&&LEVEL_NAMES[LEVEL])||'',avgLvl:+PT.avgLvl().toFixed(1),killer:nm,killerLvl:e.lvl,round:G.rounds,fightRounds:PT.fightRounds||0,potions:PT.potUsed||0,time:G.time})}});
  return r;
};
/* grid helpers */
PT.passable=(x,y)=>{if(x<0||y<0||x>=MW||y>=MH)return false;const g=G.grid[y][x];if(!(g===0||g===3||(g===4&&G.keys>0)))return false;if(G.decor.some(d=>d.block&&d.x===x&&d.y===y&&!d.found))return false;return true};
PT.avoid=null;
PT.bfs=(tx,ty,opt)=>{opt=opt||{};const sx=G.P.x,sy=G.P.y;const N=MW*MH;const dist=new Float64Array(N).fill(1e9),prev=new Int32Array(N).fill(-1);const goalAdj=opt.adj;const bad=PT.bad||{};
  const pen=new Uint8Array(N);if(PT.avoid){for(const e of G.enemies){if(e.hp<=0||!PT.avoid(e))continue;for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++){if(Math.abs(dx)+Math.abs(dy)>5)continue;const x=e.x+dx,y=e.y+dy;if(x>=0&&y>=0&&x<MW&&y<MH)pen[y*MW+x]=1}}}
  // simple bucketed Dijkstra (costs 1 or 26)
  const buckets=[[sy*MW+sx]];dist[sy*MW+sx]=0;let cur=0,left=1;const heapPush=(c,d)=>{(buckets[d]=buckets[d]||[]).push(c)};
  const maxd=6000;
  while(cur<=maxd&&cur<buckets.length){const bk=buckets[cur];if(!bk||!bk.length){cur++;continue}const c=bk.pop();if(dist[c]!==cur)continue;
    const cx=c%MW,cy=(c/MW)|0;
    if(goalAdj?(Math.abs(cx-tx)+Math.abs(cy-ty)===1):(cx===tx&&cy===ty))return PT.path(prev,c,sx,sy);
    for(const d of DIRS){const nx=cx+d[0],ny=cy+d[1],n=ny*MW+nx;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;
      const isGoal=(nx===tx&&ny===ty);
      if(!isGoal&&!PT.passable(nx,ny))continue;if(isGoal&&!goalAdj&&!(PT.passable(nx,ny)||opt.any))continue;
      if(bad[LEVEL+'_'+nx+'_'+ny])continue;
      if(typeof TERR_STEP!=='undefined'&&TERR_STEP&&!terrStepOK(cx,cy,nx,ny))continue;
      const nd=cur+1+(pen[n]?25:0);if(nd<dist[n]){dist[n]=nd;prev[n]=c;heapPush(n,nd)}}}
  return null};
PT.path=(prev,c,sx,sy)=>{const p=[];while(c!==sy*MW+sx){p.push([c%MW,(c/MW)|0]);c=prev[c]}return p.reverse()};
PT.relTo=(nx,ny)=>{const dx=nx-G.P.x,dy=ny-G.P.y;const d=DIRS.findIndex(q=>q[0]===dx&&q[1]===dy);return d<0?-1:(d-G.P.f+4)%4};
PT.relAct=['fwd','right','back','left'];
/* one step along the path; returns 'moved','blocked','enemy','talk','busy' */
PT.stepTo=(nx,ny)=>{
  if(!PT.waitAct())return 'busy';
  const r=PT.relTo(nx,ny);if(r<0)return 'blocked';
  const ox=G.P.x,oy=G.P.y,lv=LEVEL,rounds0=G.rounds;
  act(PT.relAct[r]);PT.waitAct();
  if(LEVEL!==lv)return 'level';
  if(G.talk)return 'talk';if(G.loot)return 'loot';
  if(G.P.x!==ox||G.P.y!==oy){PT.stats.steps++;return 'moved'}
  if(enemyAt(nx,ny))return 'enemy';
  return 'blocked'};
/* ---------- fighting ---------- */
PT.adjEnemy=()=>G.enemies.filter(e=>e.hp>0&&Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)===1&&!e.surr);
PT.threat=(range)=>G.enemies.filter(e=>e.hp>0&&!e.surr&&e.alert&&Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<=(range||4));
PT.faceEnemy=()=>{const es=PT.adjEnemy();if(!es.length)return false;const f=frontEnemy(1);if(f)return true;const e=es[0];const dx=e.x-G.P.x,dy=e.y-G.P.y;const d=DIRS.findIndex(q=>q[0]===dx&&q[1]===dy);const rel=(d-G.P.f+4)%4;PT.waitAct();if(rel===1)act('turnR');else if(rel===3)act('turnL');else if(rel===2){act('turnR');PT.waitAct();act('turnR')}PT.stats.turns++;PT.waitAct();return true};
PT.healSpellIdx=(i)=>{try{const P=curPower(i);return P&&!P.t&&['heal','healall','mend'].includes(P.type)}catch(e){return false}};
PT.potionFor=(i)=>{try{return bestPotionIndex(i)>=0&&G.bag[bestPotionIndex(i)]&&idef(G.bag[bestPotionIndex(i)]).heal}catch(e){return false}};
PT.manaIdx=()=>G.bag.findIndex(b=>{const d=idef(b);return d&&d.mana});
PT.pol={heals:0,groupHeals:0,potions:0,manaPots:0,powers:0,attacks:0,cures:0,buffs:0,aoe:0,rounds:0};
PT.polReset=()=>{for(const k in PT.pol)PT.pol[k]=0};
PT.pots=()=>G.bag.filter(b=>HEAL_IDS.includes(b.id)).reduce((n,b)=>n+(b.n||1),0);
PT.powList=(i)=>{const h=G.heroes[i];let L=[];try{L=heroPowers(i)}catch(e){L=CLASSES[HERO_DEF[i].clsId].powers}return L.map((p,idx)=>({p,idx})).filter(x=>x.p.act&&h.lvl>=x.p.lv)};
PT.usePower=(i,pred)=>{const h=G.heroes[i];const c=PT.powList(i).filter(x=>pred(x.p)&&h.mp>=x.p.cost);if(!c.length)return false;c.sort((a,b)=>b.p.cost-a.p.cost);const old=h.powSel;h.powSel=c[0].idx;G.sel=i;act('special');const ok=G.acted[i];if(!ok)h.powSel=old;return ok};
PT.fracs=()=>G.heroes.map(h=>h.alive?h.hp/h.max:1);
PT.heroTurn=(i)=>{
  const h=G.heroes[i];if(!h.alive||G.acted[i])return;
  G.sel=i;PT.waitAct();
  const fr=PT.fracs(),frac=fr[i],cls=HERO_DEF[i].cls,P=PT.pol;
  const living=livingHeroes();const lowAny=living.filter(j=>fr[j]<.5),low60=living.filter(j=>fr[j]<.6);
  const adj=PT.adjEnemy();const nAdj=adj.length;
  const mpc=(p)=>p.cost;
  // cures: an afflicted hero uses a curing item if one is carried
  try{if(PT.afflicted&&PT.afflicted(i)){const ci=G.bag.findIndex(b=>idef(b)&&idef(b).cures);if(ci>=0&&useHeal(i,ci)){P.cures++;heroDone(i);return}}}catch(e){}
  // healers heal first when anyone is hurt
  const healer=(cls==='Priest'||cls==='Paladin');
  if(healer&&lowAny.length){
    if(low60.length>=2&&PT.usePower(i,p=>p.type==='healx'&&p.all)){P.groupHeals++;P.heals++;if(G.acted[i])return}
    if(PT.usePower(i,p=>(p.type==='heal'||(p.type==='healx'&&!p.all)))){P.heals++;if(G.acted[i])return}
    // out of mana: a mana potion, then fall through to potions
    if(h.mpMax>0&&PT.manaIdx()>=0&&h.mp<3){if(useHeal(i,PT.manaIdx())){P.manaPots++;heroDone(i);return}}
  }
  // own health: potion below 50 percent (the game picks the smallest potion that covers the wound); below 25 percent before anything else
  if(frac<.5&&PT.potionFor(i)){const hp0=h.hp;act('potion');if(G.acted[i]||h.hp>hp0){P.potions++;PT.potUsed=(PT.potUsed||0)+1;return}}
  // a hero at 10 percent with nothing to drink and a healer able to heal still lets the healer act first (handled above); otherwise keep fighting
  // mana potions for casters that ran dry
  if((cls==='Mage'||healer)&&h.mpMax>0&&h.mp<4&&PT.manaIdx()>=0&&h.mp<h.mpMax*.3){if(useHeal(i,PT.manaIdx())){P.manaPots++;heroDone(i);return}}
  // offence: area power on groups, buffs at the start of a fight, then the best single power, else a plain attack
  const enemiesNear=G.enemies.filter(e=>e.hp>0&&!e.surr&&Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<=3);
  const strong=enemiesNear.reduce((n,e)=>n+e.hp,0)>(h.lvl*30);
  if(enemiesNear.length>=2&&PT.usePower(i,p=>p.type==='aoe'||p.type==='daze')){P.aoe++;P.powers++;if(G.acted[i])return}
  if(!PT.buffedFight&&strong&&PT.usePower(i,p=>p.type==='buff'&&(p.party||p.b==='dmgPct'))){P.buffs++;PT.buffedFight=1;if(G.acted[i])return}
  if(cls==='Mage'){let sp=null;try{sp=specialInfo(i)}catch(e){}
    if(sp&&sp.spell&&h.mp>=sp.cost){const old=h.powSel;h.powSel=0;act('special');if(G.acted[i]){P.powers++;return}}
    else if(PT.manaIdx()>=0&&h.mp<4){if(useHeal(i,PT.manaIdx())){P.manaPots++;heroDone(i);return}}}
  else if(cls!=='Priest'&&strong){if(PT.usePower(i,p=>p.type==='melee'||p.type==='multi'||p.type==='twin'||p.type==='ranged'||p.type==='drain')){P.powers++;if(G.acted[i])return}}
  act('attack');P.attacks++;
  if(!G.acted[i]){act('wait')}
};
PT.faceEnemy=()=>{const es=PT.adjEnemy();if(!es.length)return false;
  // focus fire: the adjacent creature with the fewest hit points left (a dangerous or nearly dead one first)
  es.sort((a,b)=>a.hp-b.hp);const e=es[0];const f=frontEnemy(1);if(f&&f.e===e)return true;
  const dx=e.x-G.P.x,dy=e.y-G.P.y;const d=DIRS.findIndex(q=>q[0]===dx&&q[1]===dy);const rel=(d-G.P.f+4)%4;PT.waitAct();if(rel===1)act('turnR');else if(rel===3)act('turnL');else if(rel===2){act('turnR');PT.waitAct();act('turnR')}PT.stats.turns++;PT.waitAct();return true};
PT.fightRound=()=>{
  PT.faceEnemy();
  const r0=G.rounds;let guard=0;
  while(G.state==='play'&&G.rounds===r0&&guard++<8){
    for(const i of livingHeroes()){if(!G.acted[i]&&G.state==='play'&&G.rounds===r0){PT.heroTurn(i);PT.waitAct(30)}}
    PT.waitAct(200);
    if(G.rounds===r0&&G.acted.every((a,i)=>a||!G.heroes[i].alive)===false){/* a hero could not act */break}
  }
  PT.waitAct(400);PT.stats.rounds++;PT.fightRounds=(PT.fightRounds||0)+1;
};
PT.fight=(maxRounds)=>{ // fight until no hostile creature is near
  maxRounds=maxRounds||160;let n=0,idle=0;PT.fightRounds=0;PT.potUsed=0;PT.buffedFight=0;
  const k0=G.kills;
  while(G.state==='play'&&n<maxRounds&&!PT.late()&&(PT.adjEnemy().length||PT.threat(9).length)){PT.where='fight';PT.tr('fight n'+n+' mem'+Math.round(performance.memory.usedJSHeapSize/1e6)+' en'+PT.threat(9).map(e=>e.t+e.hp).join(',')+' hp'+G.heroes.map(h=>h.hp).join('/')+' r'+G.rounds);
    if(PT.adjEnemy().length){PT.fightRound();n++;idle=0;continue}
    const ts=PT.threat(9);let best=null,bd=1e9;
    for(const e of ts){const p=PT.bfs(e.x,e.y,{adj:true});if(p&&p.length<bd){bd=p.length;best=p}}
    // a ranged hero in line may shoot instead
    if(!best){PT.waitAct();act('wait');PT.waitAct(300);n++;if(++idle>6){idle=9;break}continue}
    if(best.length===0){PT.fightRound();n++;continue}
    const r0=G.rounds;const rr=PT.stepTo(best[0][0],best[0][1]);n++;
    if(rr!=='moved'&&rr!=='enemy'){if(++idle>5)break}else idle=0;
    if(rr==='level')break}
  if(idle>5)PT.noFightUntil=PT.stats.steps+10;PT.stats.fights++;PT.stats.kills+=G.kills-k0;return n};
/* ---------- resting and eating ---------- */
PT.eat=()=>{for(let i=0;i<4;i++){const h=G.heroes[i];if(!h.alive||h.food>=60)continue;const idx=G.bag.findIndex(b=>{const d=idef(b);return d&&d.k==='food'});if(idx>=0){useHeal(i,idx)}}};
PT.needRest=(th)=>{th=th||.5;const L=G.heroes;const dead=L.some(h=>!h.alive);const hp=L.filter(h=>h.alive).reduce((a,h)=>a+h.hp,0)/L.filter(h=>h.alive).reduce((a,h)=>a+h.max,0);return dead||hp<th||(th>=.6&&L.some((h,k)=>h.alive&&(HERO_DEF[k].cls==='Priest'||HERO_DEF[k].cls==='Mage')&&h.mpMax>0&&h.mp<h.mpMax*.3))};
PT.afflicted=(i)=>{try{return afflList().some(a=>a.hi===i)}catch(e){return false}};
PT.upkeep=()=>{if(G.heroes.some(h=>h.alive&&h.food<35))PT.eat()};
PT.rest=()=>{if(hostileNear())return false;PT.eat();const r=restParty(false);PT.stats.rests++;return r};
/* ---------- walking ---------- */
PT.walkTo=(tx,ty,opt)=>{opt=opt||{};let fails=0,total=0,noprog=0;const lv=LEVEL;PT.bad=PT.bad||{};
  while(total++<4000){PT.where='walkTo '+tx+','+ty+' L'+LEVEL;PT.tr(PT.where+' @'+G.P.x+','+G.P.y+' st'+G.state);if(PT.late())return 'timeout';
    if(G.state!=='play')return 'state:'+G.state;if(LEVEL!==lv)return 'level';
    if(G.talk||G.loot){if(opt.stopTalk)return 'talk';G.talk=null;G.loot=null}
    if(PT.adjEnemy().length||(PT.threat(3).length&&PT.stats.steps>=(PT.noFightUntil||0))){PT.fight();if(G.state!=='play')return 'state:'+G.state;if(!opt.noRest&&PT.needRest()&&!hostileNear())PT.rest()}
    if(!opt.adj&&G.P.x===tx&&G.P.y===ty)return 'arrived';
    const p=PT.bfs(tx,ty,opt);if(!p)return 'nopath';if(!p.length)return 'arrived';
    const [nx,ny]=p[0];const r=PT.stepTo(nx,ny);if(r==='moved')noprog=0;else if(++noprog>30){const ee=enemyAt(nx,ny);PT.stuck={lvl:LEVEL,at:[G.P.x,G.P.y],to:[nx,ny],enemy:ee&&{t:ee.t,hp:ee.hp,surr:ee.surr,dying:ee.dying,alert:ee.alert,lvl:ee.lvl},r};PT.events.push({t:'stuck',stuck:PT.stuck});return 'stuck'}
    if(r==='moved'){fails=0;if(p.length===1&&opt.adj)return 'arrived';continue}
    if(r==='level')return 'level';if(r==='talk'){if(opt.stopTalk)return 'talk';G.talk=null;PT.talkSkip=(PT.talkSkip||0)+1;fails++;if(fails>=3){PT.bad[LEVEL+'_'+nx+'_'+ny]=1;fails=0}continue}
    if(r==='loot'){G.loot=null;continue}
    if(r==='enemy'){const ee=enemyAt(nx,ny);if(ee&&ee.surr){ee._w=(ee._w||0)+1;PT.waitAct();if(ee._w<=4){act('wait');PT.waitAct(100);PT.stats.rounds++;continue}else{PT.events.push({t:'bug?',msg:'a surrendered bandit never left (mercyDone) and blocked the way; the party killed it',lvl:LEVEL});const d=DIRS.findIndex(q=>q[0]===ee.x-G.P.x&&q[1]===ee.y-G.P.y);const rel=(d-G.P.f+4)%4;if(rel===1)act('turnR');else if(rel===3)act('turnL');else if(rel===2){act('turnR');PT.waitAct();act('turnR')}PT.waitAct();act('attack');PT.waitAct(200);PT.stats.rounds++;continue}}PT.faceEnemy();PT.fight();continue}
    fails++;if(fails>=3){PT.bad[LEVEL+'_'+nx+'_'+ny]=1;fails=0}
  }
  return 'maxsteps'};
/* human time estimate (seconds): 1 s per step, 0.5 per turn, 3 per round, 15 chars per second reading + 1.5 per dialogue line, 12 s per shop transaction, 4 s per rest */
PT.humanSec=()=>{const s=PT.stats;return s.steps*1+s.turns*.5+s.rounds*3+s.talkChars/15+s.talkNodes*1.5+s.shopTx*12+s.rests*4};
PT.snap=()=>({st:G.state,lvl:LEVEL,P:{x:G.P.x,y:G.P.y,f:G.P.f},gold:G.gold,rounds:G.rounds,avg:PT.avgLvl(),heroes:G.heroes.map((h,i)=>({n:HERO_DEF[i].name,c:HERO_DEF[i].cls,l:h.lvl,hp:h.hp,max:h.max,mp:h.mp,mpMax:h.mpMax,a:h.alive,xp:h.xp,food:Math.round(h.food),eq:Object.fromEntries(Object.entries(h.eq||{}).map(([k,v])=>[k,v&&v.id]))})),bag:G.bag.map(b=>b.id+(b.n>1?'x'+b.n:'')),en:G.enemies.filter(e=>e.hp>0).length,stats:PT.stats,human:Math.round(PT.humanSec())});
})();
(()=>{const PT=window.PT;
PT.nearestEnemy=(filter)=>{let best=null,bd=1e9;for(const e of G.enemies){if(e.hp<=0||e.surr)continue;if(filter&&!filter(e))continue;const p=PT.bfs(e.x,e.y,{adj:true});if(p&&p.length<bd){bd=p.length;best=e}}return best};
PT.clearLevel=(opt)=>{opt=opt||{};let n=0,cap=opt.cap||80;const out=[];
  while(G.state==='play'&&n++<cap&&!PT.late()){PT.where='clearLevel';PT.tr('clear '+n);
    PT.upkeep();if(PT.needRest(.7)&&!hostileNear())PT.rest();const e=PT.nearestEnemy(opt.filter);if(!e)break;
    const r=PT.walkTo(e.x,e.y,{adj:true});out.push(r);
    if(r!=='arrived'&&r!=='talk')break;
    if(G.state!=='play')break;
    PT.faceEnemy();PT.fight();
    if(PT.needRest(.7)&&!hostileNear())PT.rest();
  }return out};
})();
(()=>{const PT=window.PT;
PT.purchases=[];
const SLOTK={weapon:['main'],head:['head'],chest:['chest'],arms:['arms'],legs:['legs'],shield:['off'],ring:['r0','r1','r2','r3']};
PT.score=(hi,id)=>{const d=ITEMDEF[id];if(!d)return -1;const cl=HERO_DEF[hi].cls;const caster=HERO_DEF[hi].caster;
  if(d.k==='weapon'){const dm=d.dmg?(d.dmg[0]+d.dmg[1])/2:0;let s=dm*(1+(d.hit||0)*2)*(1+(d.dbl||0))+(d.ranged?1:0);if(caster)s=dm*.5+(d.magic||0)*3;else s+=(d.magic||0)*.3;return s}
  if(d.k==='head'||d.k==='chest'||d.k==='arms'||d.k==='legs'||d.k==='shield')return (d.armor||0)*3+(d.hp||0)*.15+(d.dodge||0)*20;
  if(d.k==='ring')return (d.armor||0)*3+(d.hp||0)*.15+((d.hitb||0)*30)+(d.mpRegen||0)*2+(d.dmgPct||0)*20;
  return 0};
PT.canUse=(hi,id)=>{const d=ITEMDEF[id];if(!d)return false;return !reqFail(G.heroes[hi],d)};
PT.slotFor=(hi,id)=>{const d=ITEMDEF[id];const h=G.heroes[hi];if(d.k==='ring'){let best=null,bs=1e9;for(const s of RING_SLOTS){const cur=h.eq[s]?PT.score(hi,h.eq[s].id):-1;if(cur<bs){bs=cur;best=s}}return best}
  const l=SLOTK[d.k];return l?l[0]:null};
PT.curScore=(hi,slot)=>{const it=G.heroes[hi].eq[slot];return it?PT.score(hi,it.id):(slot==='main'?0:-.5)};
PT.gearUp=()=>{let n=0;const log=[];
  for(let hi=0;hi<4;hi++){let again=true,g=0;while(again&&g++<12){again=false;let bestI=-1,bestGain=0.01,bestSlot=null;
    G.bag.forEach((b,i)=>{const d=idef(b);if(!['weapon','head','chest','arms','legs','shield','ring'].includes(d.k))return;if(!PT.canUse(hi,b.id))return;
      if(d.k==='weapon'&&(HERO_DEF[hi].caster?false:false)){}
      const slot=PT.slotFor(hi,b.id);if(!slot)return;const gain=PT.score(hi,b.id)-PT.curScore(hi,slot);if(gain>bestGain){bestGain=gain;bestI=i;bestSlot=slot}});
    if(bestI>=0){const nm=ITEMDEF[G.bag[bestI].id].n;if(equipTo(hi,bestSlot,bestI)){n++;again=true;log.push(HERO_DEF[hi].name+' equips '+nm)}}}}
  return log};
/* open a loot container or shop decor by walking to it */
PT.openDecor=(d)=>{G.loot=null;const r=PT.walkTo(d.x,d.y,{adj:true,noRest:true});if(r!=='arrived'&&r!=='talk')return 'walk:'+r;
  PT.waitAct();const rel=PT.relTo(d.x,d.y);if(rel<0)return 'norel';act(PT.relAct[rel]);PT.waitAct(5);return G.loot?'open':'noopen'};
PT.takeAll=()=>{if(!G.loot||G.loot.shop)return;lootBtn('ltakeall');G.loot=null};
PT.lootAll=(opt)=>{opt=opt||{};const res=[];let n=0;
  for(const d of G.decor.filter(d=>d.loot&&!d.shop&&!d.looted&&(!opt.max||n<opt.max))){
    if(d.lockedBy&&!G.flags[d.lockedBy])continue;
    const r=PT.openDecor(d);if(r!=='open'){res.push(d.k+':'+r);continue}
    const c=(d.contents||[]).map(x=>x.id);PT.takeAll();d.looted=true;n++;res.push(d.k+'['+c.join(',')+']');
    if(PT.adjEnemy().length||PT.threat(3).length)PT.fight();if(G.state!=='play')break}
  return res};
/* shopping */
PT.priceBuy=id=>buyPrice(id);
PT.shopBuy=(box,i)=>{const L=G.loot;L.sel={side:'box',i};const g0=G.gold;lootBtn('lact');PT.stats.shopTx++;return g0-G.gold};
PT.shop=(opt)=>{opt=opt||{};if(!G.loot||!G.loot.shop)return 'noshop';const L=G.loot,box=L.decor.contents;const bought=[];
  const lvl=PT.avgLvl();
  /* 1. food and potions first: keep 5 food, 3 healing potions (more later), within 40% of gold */
  const budget=()=>G.gold;
  const cnt=(f)=>G.bag.reduce((n,b)=>n+(f(idef(b),b)?(b.n||1):0),0);
  const wantFood=Math.max(0,6-cnt(d=>d.k==='food'));
  const wantPot=Math.max(0,(opt.pots||Math.min(14,4+Math.floor(lvl/3)))-cnt((d,b)=>HEAL_IDS.includes(b.id)));
  const wantMana=Math.max(0,3-cnt((d)=>d.mana));
  const idxOf=(f)=>box.map((c,i)=>[c,i]).filter(([c])=>f(ITEMDEF[c.id],c)).sort((a,b)=>ITEMDEF[a[0].id].price-ITEMDEF[b[0].id].price);
  const hold=Math.floor(G.gold*.35);
  for(let k=0;k<wantFood;k++){const r=idxOf(d=>d.k==='food'&&d.feed>=50)[0]||idxOf(d=>d.k==='food')[0];if(!r)break;if(G.gold-buyPrice(r[0].id)<0)break;const nm=ITEMDEF[r[0].id].n,p=PT.shopBuy(box,r[1]);if(p>0)bought.push({it:r[0].id,price:p})}
  for(let k=0;k<wantPot;k++){const r=idxOf(d=>d.heal&&d.k==='potion'&&!d.mask&&!d.cures&&!d.buff)[0];if(!r)break;if(G.gold-buyPrice(r[0].id)<10)break;const id=r[0].id,p=PT.shopBuy(box,r[1]);if(p>0)bought.push({it:id,price:p})}
  for(let k=0;k<wantMana;k++){const r=idxOf(d=>d.mana&&d.k==='potion')[0];if(!r)break;if(G.gold-buyPrice(r[0].id)<10)break;const id=r[0].id,p=PT.shopBuy(box,r[1]);if(p>0)bought.push({it:id,price:p})}
  /* 2. gear: best gain per hero within gold */
  let loops=0;
  while(loops++<30){let best=null;
    for(let hi=0;hi<4;hi++)box.forEach((c,i)=>{const d=ITEMDEF[c.id];if(!['weapon','head','chest','arms','legs','shield','ring'].includes(d.k))return;if(!PT.canUse(hi,c.id))return;if(d.minLvl&&d.minLvl>lvl)return;
      const slot=PT.slotFor(hi,c.id);if(!slot)return;const p=buyPrice(c.id);if(p>G.gold)return;
      const gain=PT.score(hi,c.id)-PT.curScore(hi,slot);if(gain<=0.01)return;
      /* already carrying something at least as good for this hero? */
      const carried=G.bag.some(b=>ITEMDEF[b.id].k===d.k&&PT.canUse(hi,b.id)&&PT.score(hi,b.id)>=PT.score(hi,c.id));if(carried)return;
      const val=gain/p;if(!best||val>best.val&&gain>=best.gain*.3||gain>best.gain*2.5&&p<=G.gold)best={hi,i,id:c.id,p,gain,val}});
    if(!best)break;const g0=G.gold;if(PT.shopBuy(box,best.i)<=0)break;bought.push({it:best.id,price:g0-G.gold,for:HERO_DEF[best.hi].name});
    const eq=PT.gearUp();if(eq.length)bought[bought.length-1].equip=eq;
    if(G.gold<8)break}
  /* 3. sell what is worthless (non-equipped gear that no hero can use better) */
  const sold=PT.sellJunk();
  G.loot&&lootBtn&&0;
  for(const b of bought)PT.purchases.push(Object.assign({lvl:LEVEL,area:LEVEL,avg:+PT.avgLvl().toFixed(1),goldLeft:G.gold},b));
  return {bought,sold,gold:G.gold}};
PT.sellJunk=()=>{if(!G.loot||!G.loot.shop)return [];const sold=[];
  for(let i=G.bag.length-1;i>=0;i--){const b=G.bag[i],d=idef(b);if(!['weapon','head','chest','arms','legs','shield'].includes(d.k))continue;if(d.rar)continue;
    let useful=false;for(let hi=0;hi<4;hi++){if(!PT.canUse(hi,b.id))continue;const slot=PT.slotFor(hi,b.id);if(slot&&PT.score(hi,b.id)>PT.curScore(hi,slot)-0.0)useful=true}
    if(!useful){G.loot.sel={side:'bag',i};const g0=G.gold;lootBtn('lact');PT.stats.shopTx++;sold.push({it:b.id,got:G.gold-g0})}}
  G.loot.sel=null;return sold};
})();
(()=>{const PT=window.PT;PT.msgs=[];const _m=msg;msg=function(t){PT.tr('msg '+String(t).slice(0,40));try{PT.msgs.push(String(t));if(PT.msgs.length>3000)PT.msgs.splice(0,1000)}catch(e){}return _m.apply(this,arguments)};})();
(()=>{const PT=window.PT;
PT.wipes=[];
PT.recover=()=>{if(G.state!=='dead'&&G.state!=='win')return null;
  const w={pol:Object.assign({},PT.pol,{potsLeft:PT.pots(),manaPotsLeft:G.bag.filter(b=>idef(b)&&idef(b).mana).length,mp:G.heroes.map(h=>h.mp+'/'+h.mpMax).join(' '),gold:G.gold}),rating:PT.rating(),gap:+(PT.rating()-PT.avgLvl()).toFixed(1),area:LEVEL,areaName:(LEVEL_NAMES&&LEVEL_NAMES[LEVEL])||'',avgLvl:+PT.avgLvl().toFixed(1),state:G.state,round:G.rounds,fightRounds:PT.fightRounds||0,potions:PT.potUsed||0,last:Object.values(PT.lastHit||{}).map(x=>x.nm+' L'+x.lvl).slice(-4),time:Math.round(G.time)};
  PT.stats.wipes++;PT.wipes.push(w);
  PT.pump(60);handleBtn('endload');PT.pump(30);G.timers=[];
  w.restored=G.state==='play';w.afterLvl=LEVEL;w.afterGold=G.gold;
  if(G.state!=='play'){G.state='play'}
  PT.bad={};PT.lastHit={};PT.polReset();PT.buffedFight=0;return w};
PT.autosaveNow=()=>{try{writeSave('auto');return true}catch(e){return false}};
})();

(()=>{const PT=window.PT;
PT.collect=(opt)=>{opt=opt||{};let n=0,got=[];const skip=opt.skip||(()=>false);
  for(let k=0;k<200&&!PT.late();k++){PT.where='collect';let best=null,bd=1e9;
    for(const it of G.items){if(it.taken||skip(it))continue;if(PT['badItem'+LEVEL+it.x+'_'+it.y])continue;const p=PT.bfs(it.x,it.y);if(p&&p.length<bd){bd=p.length;best=it}}
    if(!best)break;const r=PT.walkTo(best.x,best.y);
    if(r!=='arrived'){PT['badItem'+LEVEL+best.x+'_'+best.y]=1;if(G.state!=='play')return got}
    else{if(!best.taken){PT['badItem'+LEVEL+best.x+'_'+best.y]=1}else got.push(best.k)}
    if(PT.needRest()&&!hostileNear())PT.rest()}
  return got};
})();
(()=>{const PT=window.PT;
PT.findTiles=(pred)=>{const r=[];for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(pred(G.grid[y][x],x,y))r.push([x,y,G.grid[y][x]]);return r};
PT.takeExit=(pred)=>{const ts=PT.findTiles(pred||((g)=>g===5||g===7));let best=null,bd=1e9;
  for(const [x,y] of ts){const p=PT.bfs(x,y,{adj:true});if(p&&p.length<bd){bd=p.length;best=[x,y]}}
  if(!best)return 'noexit';const lv=LEVEL;const r=PT.walkTo(best[0],best[1],{adj:true});if(r!=='arrived')return 'walk:'+r;
  PT.waitAct();const rel=PT.relTo(best[0],best[1]);act(PT.relAct[rel]);PT.pump(60);return LEVEL!==lv?'ok:'+LEVEL:('stay:'+G.state+(G.cut?':cut':''))};
})();
(()=>{const PT=window.PT;
PT.qlog=[];PT.talklog=[];PT.shopTag=0;
PT.cut=()=>{let n=0;while(G.cut&&n++<400){PT.stats.talkNodes++;try{cutAdvance()}catch(e){PT.errs.push('cut:'+e.message)}PT.pump(10)}PT.pump(20);return n};
const BAD=/^(not now|never mind|leave|goodbye|bye|no\b|no,|farewell|maybe later|just looking|i'?ll come back|come back|later|nothing|walk away|decline|refuse|we cannot|we can't)/i;
PT.snapQ=()=>{const o={};for(const k in G.quests)o[k]=G.quests[k].st;return o};
/* drive a conversation: picks the first sensible option on each page. opt.pick(text,i,optsArr) may override. Returns list of pages. */
PT.converse=(opt)=>{opt=opt||{};const pages=[];const seen={};let guard=0;const q0=PT.snapQ(),gold0=G.gold;
  while(G.talk&&guard++<40){const T=G.talk,nd=T.node;if(!nd)break;
    const txt=String(nd.text||'');pages.push({who:T.n&&T.n.name,text:txt.slice(0,160),opts:nd.opts.map(o=>String(o[0]).slice(0,60))});
    PT.stats.talkNodes++;PT.stats.talkChars+=txt.length;
    if(!nd.opts.length){G.talk=null;break}
    const key=txt.slice(0,80)+'|'+nd.opts.length;seen[key]=(seen[key]||0)+1;if(seen[key]>2){G.talk=null;break}
    let idx=-1;
    if(opt.pick){idx=opt.pick(txt,nd.opts.map(o=>String(o[0])));}
    if(idx<0||idx===undefined||idx===null){const dead=G.heroes.some(h=>!h.alive);
      const okOpt=(t)=>{t=String(t).trim();if(BAD.test(t))return false;
        if(/\(\d+ gold\)|gold each|\d+ gold\)/i.test(t)){if(/room|rest|sleep|stay|bed/i.test(t))return PT.needRest(.75)||G.heroes.some(h=>h.food<40);if(/raise|revive/i.test(t))return dead;return false}
        if(/blessing/i.test(t))return G.heroes.some(h=>h.alive&&h.hp<h.max*.8);
        if(/^drink$/i.test(t))return false;
        if(/^(trade|buy|shop|browse|see your wares|look at your wares)/i.test(t))return !(T.d&&T.d._shopped===PT.shopTag)&&(G.gold>=15);
        return true};
      idx=nd.opts.findIndex(o=>okOpt(o[0]));
      if(idx>=0&&/^(trade|buy|shop|browse|see your wares|look at your wares)/i.test(String(nd.opts[idx][0]).trim())&&T.d)T.d._shopped=PT.shopTag;}
    if(idx<0)idx=nd.opts.length-1;
    const next=nd.opts[idx][1]();
    PT.stats.talkChars+=String(nd.opts[idx][0]).length;
    if(G.talk!==T)break;
    if(next){T.node=next;T.t=G.time}else{G.talk=null}
    if(G.cut)PT.cut();
    if(G.loot)break;
  }
  const q1=PT.snapQ();const ch={};for(const k in q1)if(q0[k]!==q1[k])ch[k]=(q0[k]||'-')+'>'+q1[k];
  const rec={lvl:LEVEL,pages:pages.length,first:pages[0]&&pages[0].who,quests:ch,goldDelta:G.gold-gold0};
  PT.talklog.push(rec);for(const k in ch)PT.qlog.push({q:k,change:ch[k],lvl:LEVEL,who:rec.first,avg:+PT.avgLvl().toFixed(1),gold:G.gold,time:Math.round(G.time)});
  return {pages,ch,loot:!!G.loot}};
PT.npcs=()=>G.decor.filter(d=>d.npc&&!d.goat&&!d.found&&NPCS[d.npc]);
PT.talkTo=(d,opt)=>{G.talk=null;const r=PT.walkTo(d.x,d.y,{adj:true,noRest:true});if(r!=='arrived'&&r!=='talk')return {err:'walk:'+r};
  if(!G.talk){PT.waitAct();const rel=PT.relTo(d.x,d.y);if(rel>=0){const f=(rel===0);if(rel!==0){/* face it */ if(rel===1)act('turnR');else if(rel===3)act('turnL');else{act('turnR');PT.waitAct();act('turnR')}PT.waitAct()}
    if(d.walk){act('attack')}else act('fwd');PT.waitAct(5)}
    if(!G.talk&&!G.loot)startTalk(d)}
  if(!G.talk)return {err:'notalk'};
  return PT.converse(opt)};
PT.talkAllNpcs=(opt)=>{opt=opt||{};const out=[];for(const d of PT.npcs()){if(opt.filter&&!opt.filter(d))continue;if(d._talked&&!opt.again)continue;const r=PT.talkTo(d,opt);d._talked=true;out.push({npc:d.npc,k:d.k,r:r.err||{p:r.pages.length,ch:r.ch}});if(G.loot){if(G.loot.shop){PT.shop();}G.loot=null}if(G.state!=='play')break}
  return out};
})();
(()=>{const PT=window.PT;
PT.portals=()=>(G.portals||[]).filter(Boolean).map((p,i)=>({i,to:p.to,x:p.x,y:p.y,req:p.req,lock:p.lock}));
PT.takePortal=(to)=>{const ps=(G.portals||[]);const i=ps.findIndex(p=>p&&p.to===to);if(i<0)return 'noportal';
  const ts=PT.findTiles(g=>g===30+i);if(!ts.length)return 'notile';return PT.takeExit(g=>g===30+i)};
})();
(()=>{const PT=window.PT;
PT.fallbacks=[];
/* walk to a portal; if it cannot be reached on foot, log a BUG and use the portal's own destination (travel) */
PT.portalOrTravel=(to,why)=>{const r=PT.takePortal(to);if(String(r).startsWith('ok'))return r;if(!/^(noexit|walk:nopath|walk:stuck|walk:maxsteps|notile)$/.test(String(r)))return r;
  const p=(G.portals||[]).find(p=>p&&p.to===to);if(!p)return 'noportal';
  PT.fallbacks.push({lvl:LEVEL,to,reason:(why||'')+' => '+String(r),time:Math.round(G.time)});PT.events.push({t:'fallback',lvl:LEVEL,to,reason:(why||'')+' => '+String(r)});
  goToLevel(to,{x:p.x,y:p.y,f:p.f});PT.pump(10);return 'travel:'+LEVEL};
})();
(()=>{const PT=window.PT;
PT.special={1:[2],2:[3],11:[13],22:[32]};
PT.route=(from,to)=>{const prev={};prev[from]=null;const q=[from];while(q.length){const n=q.shift();if(n===to)break;for(const t of (PT.special[n]||[]))if(!(t in prev)){prev[t]=n;q.push(t)}const L=LEVELS[n];if(!L||!L.portals)continue;for(const p of L.portals){if(!p||p.to===undefined||p.to===null||p.to in prev)continue;prev[p.to]=n;q.push(p.to)}}
  if(!(to in prev))return null;const path=[];let c=to;while(c!==from){path.push(c);c=prev[c]}return path.reverse()};
PT.goLevel=(to)=>{const out=[];let guard=0;while(LEVEL!==to&&guard++<12){const path=PT.route(LEVEL,to);if(!path)return out.concat(['noroute']);const sp=(PT.special[LEVEL]||[]).includes(path[0]);const r=sp?PT.takeExit():PT.portalOrTravel(path[0],'route to '+to);out.push(path[0]+':'+r);if(PT.cut)PT.cut();if(G.state!=='play')break}return out};
})();
(()=>{const PT=window.PT;
const wrapFn=(name)=>{try{const f=window[name];if(typeof f!=='function')return;window[name]=function(){PT.tr('>'+name);const r=f.apply(this,arguments);PT.tr('<'+name);return r}}catch(e){}};
['heroAttack','frontEnemy','rollDmg','hurtEnemy','sfx','addFloat','heroHitPct','giveXP','levelUp','dropMagic','afflHit','mxVuln','mercyCheck','storyTick'].forEach(wrapFn);
})();
(()=>{const PT=window.PT;
/* FALLBACK (logged as a BUG): make a counter quest ready without playing it */
PT.skipQuestGoal=(qid,reason)=>{const q=QUESTS[qid],st=G.quests[qid];if(!q)return 'noquest';
  const rec={lvl:LEVEL,quest:qid,reason,time:Math.round(G.time),fallback:'set counter',avgLvl:+PT.avgLvl().toFixed(1)};
  if(q.cnt){G.flags[q.cnt]=(st&&st.base||0)+q.need}else if(qid==='wolves')G.flags.wolfKills=(st&&st.base||0)+q.need;else G.flags._skip_unknown=1;
  PT.fallbacks.push(rec);PT.events.push({t:'skip',quest:qid,reason});return qReady(qid)};
})();
(()=>{const PT=window.PT;
/* FALLBACK (logged): kill creatures matching filter through the game's own damage routine (xp, gold and story triggers fire as normal) */
PT.killForSkip=(filter,reason)=>{let n=0;const names=[];for(const e of G.enemies.slice()){if(e.hp>0&&(!filter||filter(e))){names.push((ENEMY_DEF[e.t]||{}).name+' L'+e.lvl);try{hurtEnemy(e,e.hp+1)}catch(x){PT.errs.push('killForSkip '+x.message)}n++}}
  PT.pump(30);PT.fallbacks.push({lvl:LEVEL,reason,killed:names.join(','),time:Math.round(G.time),fallback:'killed through game damage routine',avgLvl:+PT.avgLvl().toFixed(1)});PT.events.push({t:'skip',reason,killed:names});return n};
})();
(()=>{const PT=window.PT;
PT.activeQuests=()=>Object.entries(G.quests).filter(([k,v])=>v.st==='active'&&QUESTS[k]).map(([k,v])=>{const q=QUESTS[k];let prog=null;try{prog=qGoal(k)}catch(e){}return {id:k,who:q.who,need:q.need,prog,take:q.take||null,cnt:q.cnt||null,ready:qReady(k),title:q.title}});
PT.bagN=(id)=>G.bag.filter(b=>b.id===id).reduce((n,b)=>n+(b.n||1),0);
/* buy item id (up to n) from the shop that is currently open */
PT.buyId=(id,n)=>{if(!G.loot||!G.loot.shop)return 0;let got=0;const box=G.loot.decor.contents;for(let k=0;k<n;k++){const i=box.findIndex(c=>c.id===id);if(i<0)break;if(buyPrice(id)>G.gold)break;if(PT.shopBuy(box,i)<=0)break;got++;PT.purchases.push({lvl:LEVEL,area:LEVEL,avg:+PT.avgLvl().toFixed(1),goldLeft:G.gold,it:id,price:0,for:'quest item'})}return got};
/* walk into every goat (finds them) */
PT.findGoats=()=>{let n=0;for(const d of G.decor.filter(d=>d.goat&&!d.found)){const r=PT.walkTo(d.x,d.y,{adj:true,noRest:true});if(r!=='arrived')continue;PT.waitAct();const rel=PT.relTo(d.x,d.y);if(rel>=0){act(PT.relAct[rel]);PT.waitAct(5);G.talk=null;n++}}return n};
})();
(()=>{const PT=window.PT;PT.xp={};PT.ctx='other';
const wrap=(name,ctxf)=>{const f=window[name];if(typeof f!=='function')return;window[name]=function(){const old=PT.ctx;PT.ctx=ctxf.apply(this,arguments);try{return f.apply(this,arguments)}finally{PT.ctx=old}}};
wrap('qTurnIn',(id)=>'quest:'+id);
wrap('hurtEnemy',()=> 'kill');
const gx=window.giveXP;window.giveXP=function(a){const n=livingHeroes().length;const k=PT.ctx+'@'+LEVEL;PT.xp[k]=(PT.xp[k]||0)+a;return gx.apply(this,arguments)};
})();

(()=>{const PT=window.PT;
PT.xpTotal=()=>G.heroes.reduce((n,h)=>{let t=h.xp;for(let l=1;l<h.lvl;l++)t+=xpNeed(l);return n+t},0)/G.heroes.length;
/* visited fighting areas the party could grind: rating within [lo,hi] */
PT.grindCands=(lo,hi)=>{const seen=(G.flags&&G.flags.lvSeen)||{};const out=[];for(const k of Object.keys(seen)){const n=+k;const L=LEVELS[n];if(!L||!L.enemies||!L.enemies.length)continue;const r=gotoRate(n)||0;if(r>=lo&&r<=hi)out.push({n,r,name:LEVEL_NAMES[n]||'',en:L.enemies.length})}return out.sort((a,b)=>b.r-a.r)};
})();
