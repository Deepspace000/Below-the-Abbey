/* Balance harness: runs inside the game page (needs testmenu.js, so localhost or Pages). Load with
   fetch('tools/balance/harness.js').then(r=>r.text()).then(eval) and then await BALH.stage('name'). Results go to window.BALH.out and are POSTed to http://127.0.0.1:8914/<name>.json if a receiver is running.
   No em dashes. The fight model: four heroes against a group of creatures, simple fixed strategy (see fight()). */
(function(){
const B=window.BALH={out:{},cache:{},SEC_ROUND:5,SEC_FIGHT:25};
const mulberry=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const rndI=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const yieldUI=()=>new Promise(r=>setTimeout(r,0));
const post=async(name,obj)=>{B.out[name]=obj;try{await fetch('http://127.0.0.1:8914/'+name+'.json',{method:'POST',body:JSON.stringify(obj)})}catch(e){}};
const bossy=t=>{const d=ENEMY_DEF[t];return !!d&&(isBossy(t)||!!d.aboveParty||(typeof NO_VARY!=='undefined'&&NO_VARY.includes(t)))};
const lvlOf=(t,r,rnd)=>{const d=ENEMY_DEF[t];if(d.partyLevel)return null;if(d.aboveParty)return r+Math.min(d.aboveParty,8);if(bossy(t))return r;return Math.max(1,r+(rnd?rndI(rnd,-1,1):0))};
/* ---------- 1. harvest the areas ---------- */
B.harvest=function(){
  const ids=Object.keys(LEVEL_RATING).map(Number).sort((a,b)=>a-b),areas=[];
  for(const id of ids){try{loadLevel(id);const L=LEVELS[id];if(!L)continue;
    const c={};for(const e of (L.enemies||[])){const t=Array.isArray(e)?e[0]:(e.t||e.type);if(ENEMY_DEF[t])c[t]=(c[t]||0)+1}
    let chest=0;for(const d of (L.decor||[])){if(d&&typeof d.gold==='number')chest+=d.gold}
    areas.push({id,name:L.name||('#'+id),r:LEVEL_RATING[id],c,chest,n:Object.values(c).reduce((a,b)=>a+b,0)})}catch(e){}}
  B.areas=areas;return areas};
/* ---------- 2. party snapshots ---------- */
const MODES={'':[false,false],w:[true,false],r:[false,true]};
B.snap=function(mode,P){
  const key=mode+'|'+P;if(B.cache[key])return B.cache[key];
  const m=MODES[mode];tmApply(P,m[0],m[1]);
  const S={mode,P,h:[],pots:[],cost:0,ward:[],hc:{},st:{}};
  G.heroes.forEach((h,i)=>{
    const w=heroWeapon(h),r=heroDmgRange(h),mid=(r[0]+r[1])/2,crit=Math.min(.95,weaponCrit(w)+(w&&w.dbl||0)+ringSum(h,'dbl')+pasH(h,'crit')),cm=1.3+pasH(h,'critDmg'),dp=1+pasH(h,'dmgPct');
    const basic=mid*(1+crit*(cm-1))*dp,hit=heroHitPct(i,0),hitF=heroHitPct(i,1);
    let spec=null;let healer=null;
    if(/Priest/.test(HERO_DEF[i].cls)){try{for(const p of heroPowers(i)){if(p&&p.act&&p.type==='heal'&&p.lv<=h.lvl){const sh=p.lv===1?healShare(h.lvl*.66,false):healShare(p.lv||h.lvl,!!p.all);if(!healer||sh>healer.share)healer={heal:true,cost:p.cost||3,type:'heal',share:p.all?sh*.5:sh}}}}catch(e){}}
    try{const P0=curPower(i),sp=specialInfo(i),t=P0.type;spec={cost:sp.cost||0,type:t};
      if(t==='heal'){spec.heal=true;spec.share=healShare(Math.min(80,h.lvl),false)}
      else if(t==='spell'){const SP=sp.spell&&SPELLS[sp.spell];if(SP&&!SP.self)spec.dmg=(((SP.dmg[0]+SP.dmg[1])/2)+intB(h)+magicBonus(h)+(P0.bonus||0))*(1+pas(i,'spellPct')),spec.noRoll=true;else spec=null}
      else if(t==='melee')spec.dmg=basic*(P0.m||1)+(P0.a||0);
      else if(t==='twin')spec.dmg=basic*2;
      else if(t==='backstab')spec.dmg=basic*2;
      else if(t==='butt')spec.dmg=7.5+strB(h);
      else if(t==='shot')spec.dmg=basic*(P0.m||1);
      else if(t==='volley')spec.dmg=basic*(P0.m||1)*2;
      else spec.dmg=basic*1.5}catch(e){spec=null}
    if(healer){S.heal=S.heal||[];S.heal.push(i)}
    S.h.push({max:h.max,mp:h.mp,basic,hit,hitF,armor:heroArmor(h),spec:healer?Object.assign({},healer,{atk:spec}):spec,cls:HERO_DEF[i].cls,lvl:h.lvl});
    for(const k in h.eq){const it=h.eq[k];if(it&&ITEMDEF[it.id])S.cost+=ITEMDEF[it.id].price||0}
    S.ward.push((()=>{try{return typeof armourWard==='function'?armourWard(i)||0:0}catch(e){return 0}})())});
  for(const it of G.bag){const d=ITEMDEF[it.id];if(d&&d.heal&&d.k==='potion')for(let n=0;n<(it.n||1);n++)S.pots.push(d.heal)}
  S.pots.sort((a,b)=>a-b);S.potCount=S.pots.length;
  S.hitC=(t,lvl,hi)=>{const k=t+'|'+lvl+'|'+hi;if(S.hc[k]!==undefined)return S.hc[k];return S.hc[k]=enemyHitC(ENEMY_DEF[t],hi,lvl,null)};
  S.stat=(t,lvl)=>{const k=t+'|'+lvl;return S.st[k]||(S.st[k]=enemyStat(t,lvl))};
  B.cache[key]=S;return S};
/* ---------- 3. the fight model ---------- */
// state: {hp[],mp[],alive[],pots[]}; foes: [{t,lvl}]. Strategy: a hero below 35 percent health drinks the weakest potion that fills him, else the strongest; the priest heals the most hurt ally below 60 percent while it has mana;
// otherwise a hero uses its special power or spell while it has the mana, else the plain attack on the front creature. Creatures all strike once a round, front fighters drawn three times as often as the back line.
B.newState=S=>({hp:S.h.map(x=>x.max),mp:S.h.map(x=>x.mp),alive:S.h.map(()=>true),pots:S.pots.slice()});
function fight(S,st,foes,rnd){
  const F=foes.map(f=>{const s=S.stat(f.t,f.lvl),d=ENEMY_DEF[f.t];return {t:f.t,lvl:f.lvl,hp:s.hp,dmg:s.dmg,xp:s.xp,fly:!!d.fly,alive:true}});
  const res={win:false,fallen:0,pots:0,rounds:0,xp:0,hpLost:0,mpUsed:0};const hp0=st.hp.slice(),mp0=st.mp.slice();
  for(let rd=0;rd<150;rd++){
    res.rounds++;
    for(let i=0;i<4;i++){if(!st.alive[i])continue;const H=S.h[i];const fr=F.find(f=>f.alive);if(!fr)break;
      if(st.hp[i]<H.max*.35&&st.pots.length){let bi=-1;const need=H.max-st.hp[i];for(let k=0;k<st.pots.length;k++){if(st.pots[k]>=need){bi=k;break}}if(bi<0)bi=st.pots.length-1;st.hp[i]=Math.min(H.max,st.hp[i]+st.pots[bi]);st.pots.splice(bi,1);res.pots++;continue}
      const sp=H.spec;
      if(sp&&sp.heal&&st.mp[i]>=sp.cost&&sp.cost>0){let w=-1,bf=.6;for(let j=0;j<4;j++)if(st.alive[j]){const f=st.hp[j]/S.h[j].max;if(f<bf){bf=f;w=j}}if(w>=0){st.hp[w]=Math.min(S.h[w].max,st.hp[w]+S.h[w].max*sp.share*(.9+rnd()*.2));st.mp[i]-=sp.cost;res.mpUsed+=sp.cost;continue}}
      let dmg=0,hitp=fr.fly?H.hitF:H.hit;
      if(sp&&!sp.heal&&sp.dmg&&st.mp[i]>=sp.cost&&sp.cost>0){st.mp[i]-=sp.cost;res.mpUsed+=sp.cost;if(sp.noRoll||rnd()<hitp)dmg=sp.dmg*(.85+rnd()*.3)}
      else if(rnd()<hitp)dmg=H.basic*(.8+rnd()*.4);
      if(dmg>0){fr.hp-=dmg;if(fr.hp<=0){fr.alive=false}}}
    if(!F.some(f=>f.alive)){res.win=true;break}
    const living=[];for(let j=0;j<4;j++)if(st.alive[j])for(let k=0;k<(j<2?3:1);k++)living.push(j);
    for(const f of F){if(!f.alive||!living.length)continue;const t=living[Math.floor(rnd()*living.length)];if(!st.alive[t])continue;
      if(rnd()<S.hitC(f.t,f.lvl,t)){const d=Math.max(1,rndI(rnd,f.dmg[0],f.dmg[1])-S.ward[t]);st.hp[t]-=d;if(st.hp[t]<=0){st.hp[t]=0;st.alive[t]=false;res.fallen++}}}
    if(!st.alive.some(x=>x))break}
  let pl=S.P;for(const f of F)if(!f.alive)res.xp+=Math.max(1,Math.round(f.xp*Math.min(1.5,Math.max(.3,1-.06*(pl-f.lvl)))));
  const tot=S.h.reduce((a,x)=>a+x.max,0);let lost=0;for(let i=0;i<4;i++)lost+=Math.max(0,hp0[i]-st.hp[i]);res.hpLost=lost/tot;
  res.alive=st.alive.filter(x=>x).length;return res}
B.fight=fight;
const mixOf=(areas,r)=>{const c={};for(const a of areas)if(a.r===r)for(const t in a.c)if(!bossy(t)&&!ENEMY_DEF[t].partyLevel)c[t]=(c[t]||0)+a.c[t];return c};
const pickFrom=(c,rnd)=>{let tot=0;for(const t in c)tot+=c[t];let x=rnd()*tot;for(const t in c){x-=c[t];if(x<=0)return t}return Object.keys(c)[0]};
/* ---------- 4. stages ---------- */
// MATRIX: win rate and health lost for every rating, party level = rating + d, d from -10 to 10 step 2, three kinds of party, 3 creatures of the area per fight
B.matrix=async function(N){N=N||120;
  if(!B.areas)B.harvest();const R=[...new Set(B.areas.filter(a=>Object.keys(mixOf([a],a.r)).length).map(a=>a.r))].sort((a,b)=>a-b);
  const offs=[-10,-8,-6,-4,-2,0,2,4,6,8,10],rows=[];
  for(const mode of ['','w','r']){
    for(let P=1;P<=135;P++){const rs=R.filter(r=>offs.includes(P-r));if(!rs.length)continue;const S=B.snap(mode,P);
      for(const r of rs){const mix=mixOf(B.areas,r),rnd=mulberry(P*977+r*31+mode.length*7+(mode==='w'?1:mode==='r'?2:0));let win=0,hl=0,rd=0,pt=0,fl=0;
        for(let n=0;n<N;n++){const st=B.newState(S),foes=[];for(let k=0;k<3;k++){const t=pickFrom(mix,rnd);foes.push({t,lvl:lvlOf(t,r,rnd)})}
          const x=fight(S,st,foes,rnd);win+=x.win?1:0;hl+=x.hpLost;rd+=x.rounds;pt+=x.pots;fl+=x.fallen}
        rows.push({m:mode,r,d:P-r,P,win:win/N,hp:hl/N,rounds:rd/N,pots:pt/N,fallen:fl/N})}
      if(P%10===0)await yieldUI()}}
  await post('matrix',{N,rows});return rows.length};
// KILL TABLE: hits to kill each creature (one hero attacking) and hits it needs to kill a hero, for the level-appropriate best-gear party
B.kills=async function(){
  if(!B.areas)B.harvest();const seen={},rows=[];
  for(const a of B.areas)for(const t in a.c){const d=ENEMY_DEF[t];if(d.partyLevel)continue;const lv=lvlOf(t,a.r,null);const k=t+'|'+lv;if(!seen[k])seen[k]={t,lv,n:0,areas:new Set()};seen[k].n+=a.c[t];seen[k].areas.add(a.name)}
  const list=Object.values(seen);let i=0;
  for(const o of list){const P=Math.max(1,Math.min(135,o.lv)),S=B.snap('',P),st=S.stat(o.t,o.lv),d=ENEMY_DEF[o.t];
    const avgHit=S.h.reduce((a,x)=>a+x.basic*(d.fly?x.hitF:x.hit),0)/4,sum=S.h.reduce((a,x)=>a+x.basic*(d.fly?x.hitF:x.hit),0);
    const md=(st.dmg[0]+st.dmg[1])/2;let kf=0,ka=0,wsum=0;for(let j=0;j<4;j++){const hc=S.hitC(o.t,o.lv,j),w=j<2?3:1;const dd=Math.max(1,md-S.ward[j]);kf+=0;ka+=w*(S.h[j].max/(dd*hc));wsum+=w}
    const hc0=S.hitC(o.t,o.lv,0),front=S.h[0].max/(Math.max(1,md-S.ward[0])*hc0);
    rows.push({t:o.t,name:d.name,lv:o.lv,n:o.n,boss:bossy(o.t),hp:st.hp,dmg:st.dmg,hitsToKill:st.hp/avgHit,roundsToKill:st.hp/sum,hitsToKillFront:front,hitsToKillAvg:ka/wsum,areas:[...o.areas].slice(0,3),heroMax:S.h[0].max});
    if(++i%80===0)await yieldUI()}
  await post('kills',rows);return rows.length};
// AUTOPLAY BOT: a party of level P (three kinds) clears every area of rating about P: groups of up to 3 creatures in a random order, the bosses last; rests when the average health is below half or someone is down; potions restocked at each rest.
B.bot=async function(reps){reps=reps||4;
  if(!B.areas)B.harvest();const out=[];
  for(const mode of ['','w','r']){
    for(let P=5;P<=115;P+=5){const S=B.snap(mode,P);
      for(const a of B.areas){if(a.r<=P-3||a.r>P+2||!a.n)continue;
        let agg={wipes:0,fallen:0,pots:0,rests:0,rounds:0,fights:0,xp:0,fails:0,hpLost:0};
        for(let rep=0;rep<reps;rep++){const rnd=mulberry(a.id*131+P*7+rep*3+(mode?mode.charCodeAt(0):0));
          const list=[];for(const t in a.c){if(ENEMY_DEF[t].partyLevel)continue;for(let n=0;n<a.c[t];n++)list.push({t,lvl:lvlOf(t,a.r,rnd),b:bossy(t)})}
          for(let i=list.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[list[i],list[j]]=[list[j],list[i]]}list.sort((x,y)=>(x.b?1:0)-(y.b?1:0));
          const groups=[];let cur=[];for(const f of list){if(f.b){if(cur.length){groups.push(cur);cur=[]}groups.push([f]);continue}cur.push(f);if(cur.length===3){groups.push(cur);cur=[]}}if(cur.length)groups.push(cur);
          let st=B.newState(S);
          for(const g of groups){let tries=0,done=false;while(!done&&tries<3){const avg=st.hp.reduce((s,x,i)=>s+x/S.h[i].max,0)/4;if(avg<.5||st.alive.some(x=>!x)){st=B.newState(S);agg.rests++}
            const x=fight(S,st,g,rnd);agg.fights++;agg.rounds+=x.rounds;agg.pots+=x.pots;agg.fallen+=x.fallen;agg.hpLost+=x.hpLost;
            if(x.win){done=true;agg.xp+=x.xp}else{agg.wipes++;tries++;st=B.newState(S)}}
            if(!done)agg.fails++}}
        const k=reps;out.push({m:mode,P,id:a.id,name:a.name,r:a.r,enemies:a.n,wipes:agg.wipes/k,fallen:agg.fallen/k,pots:agg.pots/k,rests:agg.rests/k,rounds:agg.rounds/k,fights:agg.fights/k,xp:agg.xp/k,fails:agg.fails/k,hours:(agg.rounds/k*B.SEC_ROUND+agg.fights/k*B.SEC_FIGHT)/3600})}
      await yieldUI()}}
  await post('bot',out);return out.length};
// XP: progression with the best-gear party killing everything in rating order (monsters only, then with the quest XP added); level when each rating is finished
const expGold=(t,lvl,pl)=>{const d=ENEMY_DEF[t],up=Math.max(0,lvl-pl),lm=up>0?1.5+.2*(up-1):1,dc=Math.min(.9,.25+up*.08);
  const big=(d.goldFixed||0)>=100||(d.gold&&d.gold[1]>=100),ls=BOSS_GOLD[t]?1+Math.min(lvl,100)*.02:big?1+Math.min(lvl,100)*.04:1+Math.min(lvl,100)*.1,pct=lm*ls*(typeof diffRew==='function'?diffRew():1);
  const sea=/^uw/.test(t)&&!/^(uwgiant|uweelboss|uwmega|uwgulper)$/.test(t)||t==='seaserpent',bg=BOSS_GOLD[t];
  if(bg)return (bg[0]+bg[1])/2*pct;if(sea)return dc*125*pct;if(big)return 300*pct;
  const carry=(d.goldFixed||(d.gold&&d.gold[1]>0&&(d.humanoid?1:dc)));return carry?(d.goldFixed||d.humanoid?1:dc)*30*pct:0};
B.expGold=expGold;
B.questMap=function(){ // quest to area rating: by area name against the level names
  const byName={};for(const id of Object.keys(LEVEL_RATING)){const L=LEVELS[id];if(L&&L.name){(byName[L.name]=byName[L.name]||[]).push(LEVEL_RATING[id])}}
  const names=Object.keys(byName),out={};
  for(const q of Object.keys(QUESTS)){const a=(typeof QAREA!=='undefined'&&QAREA[q])||'';let rs=byName[a];
    if(!rs){const m=names.filter(n=>n.toLowerCase().includes(a.toLowerCase())&&a);if(m.length)rs=m.flatMap(n=>byName[n])}
    if(!rs){const m=names.filter(n=>a.toLowerCase().includes(n.toLowerCase())&&n.length>4);if(m.length)rs=m.flatMap(n=>byName[n])}
    const r=QUESTS[q].reward||{};let rt=rs?rs.slice().sort((x,y)=>x-y)[rs.length>>1]:null,ov=null; // median rating of the matching places
    // placed by hand where the area name says nothing about the level (an assumption, stated in the report)
    if(/^kh_/.test(q))ov=40;else if(/^wq_/.test(q))ov=50;else if(/^wk\d/.test(q))ov=80;else if(/^dq/.test(q))ov=72;else if(/^psq/.test(q))ov=((r.xp||0)>=300000)?110:100;else if(/^(ad|hc)\d/.test(q))ov=70;else if(a==='The Blighted Lands')ov=90;else if(a==='The Pale Lands')ov=100;
    if(ov!==null)rt=ov;
    out[q]={area:a,r:rt,main:MAIN_QUESTS.has(q),gold:(r.gold||0)*QREW_MUL,xp:(r.xp||0)*QREW_MUL}}
  return out};
B.xp=async function(){
  if(!B.areas)B.harvest();const qm=B.questMap(),R=[...new Set(B.areas.map(a=>a.r).concat(Object.values(qm).filter(x=>x.r!=null).map(x=>x.r)))].sort((a,b)=>a-b);
  const runP=withQ=>{const rows=[];
  let lvl=1,xp=0,gold=0,qgold=0,qxp=0;
  const needOf=l=>xpNeed(l);
  for(const r of R){let kills=0,xpM=0,goldM=0,startL=lvl,chest=0;
    for(const a of B.areas)if(a.r===r){chest+=a.chest;for(const t in a.c){const d=ENEMY_DEF[t];if(d.partyLevel)continue;for(let n=0;n<a.c[t];n++){const l0=lvlOf(t,r,null),s=enemyStat(t,l0),g=Math.max(1,Math.round(s.xp*Math.min(1.5,Math.max(.3,1-.06*(lvl-l0)))));
      xp+=g;xpM+=g;kills++;goldM+=expGold(t,l0,lvl);while(xp>=needOf(lvl)){xp-=needOf(lvl);lvl++}}}}
    let qg=0,qx=0;if(withQ)for(const q in qm)if(qm[q].r===r){qg+=qm[q].gold;qx+=qm[q].xp}
    xp+=qx;while(xp>=needOf(lvl)){xp-=needOf(lvl);lvl++}
    gold+=goldM+chest;qgold+=qg;
    rows.push({r,kills,xpMonsters:xpM,questXP:qx,levelStart:startL,levelEnd:lvl,goldMonsters:goldM,chest,questGold:qg,cumGold:gold+qgold,tmGold:tmGold(lvl)})}
  return rows};
  const rows=runP(true),rowsNoQ=runP(false);
  await post('xp',{rows,rowsNoQ,qm});return rows.length};
// PACE: for a best-gear party of level L fighting the nearest area of rating about L: kills needed for the next level, hours at the assumed speed, and gold earned per hour
B.pace=async function(){
  if(!B.areas)B.harvest();const R=[...new Set(B.areas.filter(a=>Object.keys(mixOf([a],a.r)).length).map(a=>a.r))].sort((a,b)=>a-b),rows=[];
  for(let L=1;L<=125;L++){let rs=R[0];for(const r of R)if(Math.abs(r-L)<Math.abs(rs-L))rs=r;const mix=mixOf(B.areas,rs),S=B.snap('',L),rnd=mulberry(L*13+5);
    let tot=0;for(const t in mix)tot+=mix[t];let xk=0,gk=0;for(const t in mix){const w=mix[t]/tot,l0=lvlOf(t,rs,null),s=enemyStat(t,l0);xk+=w*Math.max(1,Math.round(s.xp*Math.min(1.5,Math.max(.3,1-.06*(L-l0)))));gk+=w*expGold(t,l0,L)}
    let rd=0,n=60;for(let i=0;i<n;i++){const st=B.newState(S),foes=[];for(let k=0;k<3;k++){const t=pickFrom(mix,rnd);foes.push({t,lvl:lvlOf(t,rs,rnd)})}rd+=fight(S,st,foes,rnd).rounds}
    const rpk=rd/n/3,secK=rpk*B.SEC_ROUND+B.SEC_FIGHT/3,need=xpNeed(L),kills=need/xk;
    rows.push({L,rs,gap:Math.abs(rs-L),xpKill:xk,goldKill:gk,rpk,kills,hours:kills*secK/3600,goldHour:gk/secK*3600,need})}
  await post('pace',rows);return rows.length};
// ECONOMY: price of the best gear of each level (from the test party), houses, super weapons, and hours of play per purchase
B.economy=async function(){
  const rows=[];for(let P=5;P<=130;P+=5){const S=B.snap('',P);let best=0;rows.push({P,gearSet:S.cost,potTop:Math.max(0,...Object.values(ITEMDEF).filter(d=>d.k==='potion'&&d.heal&&(d.minLvl||0)<=P).map(d=>d.price||0)),potCount:S.potCount})}
  const sup=Object.values(ITEMDEF).filter(d=>d.sup).map(d=>({n:d.n,price:d.price,lvl:d.lvl}));
  const houses=Object.entries(HS_SIZES).map(([k,v])=>({k,n:v.name,price:v.price}));
  const topw=Object.values(ITEMDEF).filter(d=>d.k==='weapon'&&d.price).sort((a,b)=>b.price-a.price).slice(0,15).map(d=>({n:d.n,price:d.price,lvl:d.lvl,rar:!!d.rar}));
  const weaponPrice=[];for(const P of [10,20,30,40,50,60,70,80,90,100,110]){const w=Object.values(ITEMDEF).filter(d=>d.k==='weapon'&&!d.rar&&d.price&&(d.lvl||0)<=P&&(d.lvl||0)>=P-9).map(d=>d.price);weaponPrice.push({P,max:Math.max(0,...w),med:w.sort((a,b)=>a-b)[w.length>>1]||0})}
  await post('economy',{rows,sup,houses,topw,weaponPrice});return rows.length};
// GEAR LADDER
B.gear=async function(){
  const groups={};const eff=d=>d.lvl||Math.min(100,Math.round(Math.sqrt(d.price||0)/1.2));
  for(const id of Object.keys(ITEMDEF)){const d=ITEMDEF[id];if(!d||!d.price||d.k==='quest'||/^pp_/.test(id))continue;let g=null,pw=0;
    if(d.k==='weapon'){g='weapon:'+(d.t||'?');const m=((d.dmg[0]+d.dmg[1])/2);pw=m*(1+2*(d.dbl||0))*(1+(d.hit||0))}
    else if(['head','chest','arms','legs','shield'].includes(d.k)){g=d.k;pw=(d.armor||0)+(d.hp||0)/10}
    else if(d.k==='ring'){g='ring';pw=(d.armor||0)+(d.dmgb||0)*5+(d.hitb||0)*100+(d.hp||0)/10}
    if(!g)continue;(groups[g]=groups[g]||[]).push({id,n:d.n,L:eff(d),p:pw,price:d.price,rar:!!d.rar||!!d.pg||!!d.sup})}
  const out={};
  for(const g in groups){const all=groups[g].sort((a,b)=>a.L-b.L||a.p-b.p);if(all.length<4)continue;
    const shop=all.filter(x=>!x.rar);
    const dead=[];for(const x of all){let m=0;for(const y of all)if(y.L<=x.L-2&&y.p>m)m=y.p;if(m>x.p*1.02&&x.L>=5)dead.push({n:x.n,L:x.L,p:Math.round(x.p),beatenBy:Math.round(m),rar:x.rar,price:x.price})}
    const step=(arr)=>{const rows=[];let best=0;for(let L=1;L<=130;L++){for(const x of arr)if(x.L===L&&x.p>best)best=x.p;rows.push(best)}return rows};
    const bs=step(shop),ba=step(all),gaps=(arr)=>{const res=[];let s=1;for(let L=2;L<=130;L++){if(arr[L-1]!==arr[L-2]){if(L-1-s>=9&&arr[s-1]>0)res.push([s,L-1]);s=L}}if(130-s>=9&&arr[s-1]>0)res.push([s,130]);return res};
    out[g]={count:all.length,shop:shop.length,dead:dead.length,deadList:dead.sort((a,b)=>b.beatenBy/b.p-a.beatenBy/a.p).slice(0,6),gapsShop:gaps(bs),gapsAll:gaps(ba),bestShop:bs.filter((_,i)=>[9,19,29,39,49,59,69,79,89,99,109,119,129].includes(i)),bestAll:ba.filter((_,i)=>[9,19,29,39,49,59,69,79,89,99,109,119,129].includes(i)),minL:all[0].L,maxL:all[all.length-1].L}}
  await post('gear',out);return Object.keys(out).length};
B.stage=async function(name,a){const t0=performance.now();const r=await B[name](a);return name+' done '+r+' in '+Math.round(performance.now()-t0)+' ms'};
})();
