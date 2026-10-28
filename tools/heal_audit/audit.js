// runs inside the page: returns rows for one party level (levels must be asked in ascending order)
(function(){
window.__healAudit=function(L,N){
  N=N||30;
  const PI=G.heroes.findIndex((h,i)=>HERO_DEF[i].cls==='Priest'); // Wulfric
  const out={level:L,rows:[],checks:[]};
  G.heroes.forEach((h,i)=>{while(h.lvl<L){h.xp=xpNeed(h.lvl);levelUp(i)}h.alive=true});
  const pr=G.heroes[PI];pr.learned=['c10','c50'];
  G.lvlBanners.length=0;
  const realCrit=window.healCrit;window.healCrit=function(){return 0};
  const floats=[];const rf=window.addFloat;window.addFloat=function(x,y,t,c){floats.push(String(t));return rf&&rf.apply(this,arguments)};
  let HP1=true;const wound=()=>{G.heroes.forEach((h,i)=>{h.alive=true;h.hp=HP1?1:Math.max(1,Math.floor(h.max*(.2+.1*((i*7)%4)/3)))})};  // 1 hp (the whole heal shows) or 20..30 percent
  const msgs=[];const rm=window.msg;window.msg=function(t){msgs.push(String(t));return rm&&rm.apply(this,arguments)};
  const PW=heroPowers(PI);
  const items=[];
  PW.forEach((p,k)=>{if(p.act&&(p.type==='heal'||p.type==='healx'||p.type==='revive'||(p.fx&&p.fx.some(f=>f[0]==='heal'||f[0]==='healpct'||f[0]==='revive'))))items.push({k,p})});
  for(const {k,p} of items){
    const row={level:L,name:p.name,key:p.mx||p.type,listed:p.cost,avail:pr.lvl>=p.lv,desc:String(p.d||''),group:!!(p.all||(p.fx&&p.fx.some(f=>f[0]==='heal'&&f[2])))};
    if(!row.avail){out.rows.push(row);continue}
    pr.powSel=k;
    const mpBefore=[];let deducted=[],deltas=[],pcts=[],touched=[],dead=0,calls=0,perCastTotal=[];
    for(let n=0;n<N;n++){
      wound();pr.mpMax=Math.max(pr.mpMax,500);pr.mp=500;
      const hp0=G.heroes.map(h=>h.hp);G.heroes[0].alive=true;
      const was=pr.mp;
      const ok=heroSpecial(PI);
      deducted.push(was-pr.mp);
      let tot=0,cnt=0;
      G.heroes.forEach((h,i)=>{const d=h.hp-hp0[i];if(d>0){tot+=d;cnt++;pcts.push(d/h.max);deltas.push(d)}});
      perCastTotal.push(tot);touched.push(cnt);
    }
    const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
    row.mana=avg(deducted);row.manaMin=Math.min(...deducted);row.manaMax=Math.max(...deducted);
    row.avgHeal=avg(deltas);row.avgPct=avg(pcts)*100;row.targets=avg(touched);row.total=avg(perCastTotal);
    row.maxPct=Math.max(0,...pcts)*100;
    HP1=false;{let pc=[];for(let n=0;n<N;n++){wound();pr.mp=500;const h0=G.heroes.map(h=>h.hp);heroSpecial(PI);G.heroes.forEach((h,i)=>{const d=h.hp-h0[i];if(d>0)pc.push(d/h.max)})}row.pct2030=avg(pc)*100}HP1=true;
    {const rr=Math.random;Math.random=()=>.5;let dp=[],dh=[];wound();pr.mp=500;const h0=G.heroes.map(h=>h.hp);heroSpecial(PI);Math.random=rr;G.heroes.forEach((h,i)=>{const d=h.hp-h0[i];if(d>0){dp.push(d/h.max);dh.push(d)}});row.detPct=avg(dp)*100;row.detHeal=avg(dh)}
    // cap: patient at max-1, never above max; count overheal
    wound();G.heroes.forEach(h=>h.hp=h.max-1);pr.mp=500;const hpA=G.heroes.map(h=>h.hp);const mA=pr.mp;
    floats.length=0;msgs.length=0;const okc=heroSpecial(PI);{const nums=[];floats.forEach(f=>{const m=f.match(/\d+/);if(m)nums.push(+m[0])});msgs.forEach(t=>{const m=t.match(/for (\d+)/);if(m)nums.push(+m[1])});row.capShown=nums.length?Math.max(...nums):null;row.capGain=Math.max(0,...G.heroes.map((h,i)=>h.hp-hpA[i]))}row.capOk=G.heroes.every(h=>h.hp<=h.max);row.capCast=okc;row.capMana=mA-pr.mp;
    // everyone full: failed cast must take no mana
    G.heroes.forEach(h=>{h.alive=true;h.hp=h.max});pr.mp=500;const okf=heroSpecial(PI);row.fullCast=okf;row.fullMana=500-pr.mp;
    // not enough mana: refused, nothing deducted
    wound();pr.mp=p.cost-1;const hpL=G.heroes.map(h=>h.hp);const okl=heroSpecial(PI);row.lowCast=okl;row.lowMana=(p.cost-1)-pr.mp;row.lowHealed=G.heroes.some((h,i)=>h.hp>hpL[i]);
    // dead hero not healed (unless revive)
    wound();G.heroes[0].alive=false;G.heroes[0].hp=0;pr.mp=500;const mD=pr.mp;heroSpecial(PI);row.deadMana=mD-pr.mp;row.deadHealed=G.heroes[0].alive?false:G.heroes[0].hp>0;row.reviveWorked=G.heroes[0].alive;G.heroes[0].alive=true;
    // description number
    const m=row.desc.match(/about (\d+) percent/);row.descPct=m?+m[1]:null;const m2=row.desc.match(/about (\d+) health/);row.descAmt=m2?+m2[1]:null;
    row.cardCost=specialInfo(PI).cost;
    // second description: the spell card (powers page text)
    try{if(window.HEAL_TIER&&window.HEAL_TIER[p.mx||p.name])row.model=window.healTierAmount(p.mx||p.name,L,pas(PI,'healPct'))}catch(e){}
    out.rows.push(row);
  }
  // quick Heal also by the class special cast with Heal power already covered (powSel 0). Reset.
  pr.powSel=0;window.healCrit=realCrit;window.addFloat=rf;window.msg=rm;
  out.priest={lvl:pr.lvl,max:pr.max,int:pr.int,mpMax:HERO_DEF[PI].mp+HERO_DEF[PI].grow.mp*(L-1),faith:pas(PI,'healPct')};
  out.maxes=G.heroes.map(h=>h.max);
  return out;
};
})();
