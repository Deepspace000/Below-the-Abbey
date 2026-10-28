/* PRIEST HEALING AS A LADDER OF FIXED AMOUNTS, LIKE THE HEALING POTIONS (see tools/heal_audit/HEAL_AUDIT_AFTER.md).
   Loads last and replaces healScaled and healCrit, so the quick Heal, the powers and the spells all use one formula.
   A heal restores a fixed number of health points:  amount = (base + perLevel x caster level) x (1 + the priest's healing bonus, Faith and Saint).
   It is NOT a percent of the patient's health. Hero health keeps growing, so the first heals become mostly useless in the late game, as the weak
   potions do, and the player moves up to the stronger spells. The level and Faith bonus is small and the same kind for every spell, and every spell
   has a bigger base than the one below it in its line (singles with singles, groups with groups), so a weaker spell can never out-heal a stronger one.
   Mana is a fixed cost per spell, proportional to the amount healed (all allies counted), the same at every level.
   The amount is capped at what the patient is missing. Resurrection and Revive keep their own rules. Other classes keep the old formula. */
(function(){
  /* key: power name, or spell id.  g = group heal (each living ally), base = health at level 0, lv = health added per caster level, cost = mana (fixed).
     Potion ladder for comparison: 30, 60 (draught), 90, 120, 210, 220, 450 health. */
  const TIER={
    'Heal':{n:'Heal',g:0,base:10,lv:.4,cost:3},
    'Greater Heal':{n:'Greater Heal',g:0,base:270,lv:.5,cost:26},
    'c10':{n:'Purify',g:1,base:8,lv:.3,cost:9},
    'Mend':{n:'Mend',g:1,base:30,lv:.4,cost:19},
    'Divine Intervention':{n:'Divine Intervention',g:1,base:100,lv:.4,cost:45}
  };
  window.HEAL_TIER=TIER;
  const keyOf=P=>typeof P==='string'?P:(P&&(P.mx||P.name));
  const tierOf=(hi,P)=>{try{if(!P||!HERO_DEF[hi]||HERO_DEF[hi].cls!=='Priest')return null;return TIER[keyOf(P)]||null}catch(e){return null}};
  window.healTierOf=tierOf;
  const amountOf=(t,L,bonus)=>Math.max(1,Math.round((t.base+t.lv*Math.max(1,L||1))*(1+(bonus||0))));
  window.healTierAmount=(key,L,bonus)=>amountOf(TIER[key],L,bonus);
  const legacy=window.healScaled;
  window.healScaled=function(hi,tg,old,rank,group,P){
    const t=tierOf(hi,P);if(!t)return legacy.apply(this,arguments);
    const a=amountOf(t,G.heroes[hi].lvl,pas(hi,'healPct'));
    return Math.max(0,Math.min(a,tg.max-tg.hp)); // never more than the patient is missing, so the number shown is what was really healed
  };
  window.healCrit=function(t,amt){
    if(Math.random()<.12){const x=Math.max(0,Math.min(Math.round(amt*.75),t.max-t.hp));t.hp+=x;G._healCrit=1;return x}return 0;
  };
  /* the real number for the priest in the party, for the cards */
  const priestIdx=()=>{try{let b=-1;G.heroes.forEach((h,i)=>{if(HERO_DEF[i]&&HERO_DEF[i].cls==='Priest'&&(b<0||h.lvl>G.heroes[b].lvl))b=i});return b}catch(e){return -1}};
  const now=k=>{const i=priestIdx();let L=1,b=0;if(i>=0){L=G.heroes[i].lvl;try{b=pas(i,'healPct')}catch(e){}}return amountOf(TIER[k],L,b)};
  const TEXT={
    'Heal':()=>`Restores about ${now('Heal')} health to the most wounded ally. A small, cheap heal that is not much use once the party is strong.`,
    'Greater Heal':()=>`Restores about ${now('Greater Heal')} health to the most wounded ally.`,
    'Mend':()=>`Restores about ${now('Mend')} health to every living ally.`,
    'Divine Intervention':()=>`The greatest group heal: every living ally recovers about ${now('Divine Intervention')} health.`,
    'c10':()=>`Cleanses every affliction on the party and restores about ${now('c10')} health to everyone.`
  };
  const live=(o,k)=>{if(!o)return;try{Object.defineProperty(o,'d',{get:TEXT[k],set(v){},configurable:true,enumerable:true})}catch(e){console.warn('heal text',e)}};
  const setCost=(o,t)=>{if(o){o.cost=t.cost;o._hc=1}};
  try{
    const pr=CLASSES.find(c=>c.name==='Priest');
    if(pr){
      for(const p of pr.powers||[]){const t=TIER[p.name];if(t&&p.act!==false){live(p,p.name);setCost(p,t)}}
      if(pr.sp){live(pr.sp,'Heal');setCost(pr.sp,TIER.Heal)}
    }
    for(const s of MX){if(s.id==='c10'){live(s,'c10');setCost(s,TIER.c10)}}
    if(MX_POWER.c10){live(MX_POWER.c10,'c10');setCost(MX_POWER.c10,TIER.c10)}
  }catch(e){console.warn('heal_scaling',e)}
})();
