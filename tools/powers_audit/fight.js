// runs inside the page after audit.js. window.__pf.fight(classIds[4], L, nFoes, reps): the party fights nFoes creatures of level L in a corridor, no enemy attacks (rounds to kill only).
// Policy: every hero uses its highest-level damaging class power it can afford, otherwise a plain attack. Real functions: heroSpecial and heroAttack.
(function(){
const DMGT=['melee','multi','shot','volley','ranged','aoe','drain','backstab','twin','butt'];
function pickFoe(){
  let best=null,bd=1e9;for(const k in ENEMY_DEF){const d=ENEMY_DEF[k];if(!d.hp||d.boss||d.fly||d.ranged||/skel|ghost|spectre|wraith|mummy|zombie|uw/.test(k))continue;const x=Math.abs(d.hp-170);if(x<bd){bd=x;best=k}}
  return best;
}
function party(cls,L){
  const mk=window.__pa.mkHero;
  const hs=[];
  cls.forEach((c,i)=>{ // build into slot i (mkHero builds slot 0): build then move
    const save=HERO_DEF[0];const r=mk(c,L);HERO_DEF[i]=HERO_DEF[0];G.heroes[i]=G.heroes[0];if(i>0){HERO_DEF[0]=save}
  });
}
window.__pf={pickFoe,
fight(cls,L,nFoes,reps,policy){
  reps=reps||10;nFoes=nFoes||3;const foe=pickFoe();const res=[];
  const rm=window.msg;window.msg=function(){};
  const rafl=window.addFloat;
  for(let rep=0;rep<reps;rep++){
    // build four heroes
    const H=[],D=[];
    for(let i=0;i<4;i++){window.__pa.mkHero(cls[i],L);H[i]=G.heroes[0];D[i]=HERO_DEF[0]}
    for(let i=0;i<4;i++){HERO_DEF[i]=D[i];G.heroes[i]=H[i];H[i].mp=H[i].mpMax;H[i].hp=H[i].max;H[i].alive=true;H[i].learned=[]}
    G.buffs=[];G.enemies.length=0;
    const dir=DIRS[G.P.f];let foes=[];
    for(let k=0;k<nFoes;k++){const st=enemyStat(foe,L);foes.push({id:k,t:foe,lvl:L,hp:st.hp,maxhp:st.hp,alert:true,chilled:0,flash:0,lunge:0,dying:0,seed:1,sx:210,sy:100,x:0,y:0,rx:0,ry:0})}
    G.enemies=foes.slice();
    const place=()=>{const live=G.enemies.filter(e=>e.hp>0);live.forEach((e,k)=>{e.x=G.P.x+dir[0]*(k+1);e.y=G.P.y+dir[1]*(k+1);e.rx=e.x;e.ry=e.y})};
    let rounds=0,ownMana=0;
    // trial: how much one use of each power (and of a plain attack) does against this line of foes, with no dice; the greedy policy then takes the best affordable one every turn
    const place0=()=>{const live=G.enemies.filter(e=>e.hp>0);live.forEach((e,k)=>{e.x=G.P.x+dir[0]*(k+1);e.y=G.P.y+dir[1]*(k+1);e.rx=e.x;e.ry=e.y})};
    const trial={};
    {const RR=Math.random,RD=window.rollDmg;Math.random=()=>.5;window.rollDmg=function(h,mult){const r=heroDmgRange(h);return {d:Math.max(1,Math.round((r[0]+r[1])/2*(mult||1)*(1+pasH(h,'dmgPct')))),crit:false}};
     for(let i=0;i<4;i++){const h=G.heroes[i],PW=heroPowers(i);trial[i]=[];
       const run=(fn,k,cost)=>{place0();const hp0=G.enemies.map(e=>e.hp);const mp0=h.mp;const ps=h.powSel;if(k>=0)h.powSel=k;fn(i);h.mp=mp0;h.powSel=ps;let t=0;G.enemies.forEach((e,q)=>{t+=hp0[q]-e.hp;e.hp=hp0[q];e.st=null;e.chilled=0});return t};
       trial[i].push({k:-1,cost:0,dmg:run(heroAttack,-1)*(1+.5*(weaponCrit(heroWeapon(h))+pasH(h,'crit')))});
       PW.forEach((P,k)=>{if(P.act&&!P.mx&&DMGT.includes(P.type)&&h.lvl>=P.lv){h.mp=h.mpMax;const d=run(heroSpecial,k,P.cost);trial[i].push({k,cost:P.cost,dmg:d})}});
       h.mp=h.mpMax}
     Math.random=RR;window.rollDmg=RD}
    while(G.enemies.some(e=>e.hp>0)&&rounds<400){
      rounds++;place();
      for(let i=0;i<4;i++){
        if(!G.enemies.some(e=>e.hp>0))break;place();
        const h=G.heroes[i];let best=trial[i][0];
        if(policy!=='plain'){for(const t of trial[i])if(t.k>=0&&h.mp>=t.cost&&t.dmg>best.dmg)best=t}
        if(best.k>=0){h.powSel=best.k;const w=h.mp;const ok=heroSpecial(i);ownMana+=w-h.mp;if(!ok)heroAttack(i)}
        else heroAttack(i);
      }
      G.enemies=G.enemies.filter(e=>e.hp>0);
    }
    res.push(rounds);G.enemies=[];
  }
  window.msg=rm;
  return {foe,L,cls,rounds:res.reduce((a,b)=>a+b,0)/res.length,min:Math.min(...res),max:Math.max(...res),foeHp:enemyStat(foe,L).hp};
}};

// smooth, dice-free version: expected rounds to kill nFoes foes (trial damage of each power, mana spent greedily, plain attacks scaled by the chance to hit)
window.__pf.expected=function(cls,L,nFoes){
  const foe=pickFoe();const RR=Math.random,RD=window.rollDmg;
  const H=[],D=[];for(let i=0;i<4;i++){window.__pa.mkHero(cls[i],L);H[i]=G.heroes[0];D[i]=HERO_DEF[0]}
  for(let i=0;i<4;i++){HERO_DEF[i]=D[i];G.heroes[i]=H[i];H[i].mp=H[i].mpMax;H[i].hp=H[i].max;H[i].alive=true;H[i].learned=[]}
  G.buffs=[];const dir=DIRS[G.P.f];const foes=[];
  for(let k=0;k<nFoes;k++){const st=enemyStat(foe,L);foes.push({id:k,t:foe,lvl:L,hp:st.hp,maxhp:st.hp,alert:true,chilled:0,flash:0,lunge:0,dying:0,seed:1,sx:210,sy:100,x:G.P.x+dir[0]*(k+1),y:G.P.y+dir[1]*(k+1),rx:0,ry:0})}
  G.enemies=foes;const rm=window.msg;window.msg=function(){};
  Math.random=()=>.5;window.rollDmg=function(h,mult){const r=heroDmgRange(h);return {d:Math.max(1,Math.round((r[0]+r[1])/2*(mult||1)*(1+pasH(h,'dmgPct')))),crit:false}};
  const tr=[];
  for(let i=0;i<4;i++){const h=G.heroes[i],PW=heroPowers(i);tr[i]=[];
    const run=(fn,k)=>{const hp0=foes.map(e=>e.hp);const mp0=h.mp,ps=h.powSel;if(k>=0)h.powSel=k;fn(i);h.mp=mp0;h.powSel=ps;let t=0;foes.forEach((e,q)=>{t+=hp0[q]-e.hp;e.hp=hp0[q];e.st=null;e.chilled=0});return t};
    const w=heroWeapon(h);tr[i].push({k:-1,cost:0,dmg:run(heroAttack,-1)*heroHitPct(i,false)*(1+.5*(weaponCrit(w)+(w&&w.dbl||0)+ringSum(h,'dbl')+pasH(h,'crit')))});
    PW.forEach((P,k)=>{if(P.act&&!P.mx&&DMGT.includes(P.type)&&h.lvl>=P.lv){h.mp=h.mpMax;tr[i].push({k,cost:P.cost,dmg:run(heroSpecial,k)*(1+.5*(P.dmg===undefined?(weaponCrit(w)+(w&&w.dbl||0)+ringSum(h,'dbl')+pasH(h,'crit')):0))});}});
    h.mp=h.mpMax}
  Math.random=RR;window.rollDmg=RD;window.msg=rm;
  const total=foes.reduce((a,e)=>a+e.hp,0);let cum=0,r=0;const mp=G.heroes.map(h=>h.mpMax);
  while(cum<total&&r<2000){r++;let d=0;for(let i=0;i<4;i++){let b=tr[i][0];for(const t of tr[i])if(t.k>=0&&mp[i]>=t.cost&&t.dmg>b.dmg)b=t;mp[i]-=b.cost;d+=b.dmg}
    if(cum+d>=total){return {foe,L,cls,rounds:r-1+(total-cum)/d,foeHp:total/nFoes}}cum+=d}
  return {foe,L,cls,rounds:r,foeHp:total/nFoes};
};
})();
