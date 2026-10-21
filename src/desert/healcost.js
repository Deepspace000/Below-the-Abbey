/* HEALING COSTS A LITTLE MORE. A heal restores a share of the patient's own maximum health (healShare), so at high level a few points of mana bought a great deal; every healing
   power now costs about 30 percent more (at least one point), so a healer runs dry in a long fight and drinks a mana potion. Done once, when the game loads. */
(function(){
  const up=c=>c+Math.max(1,Math.ceil(c*.3)),isHeal=p=>p&&(p.type==='heal'||p.type==='healx'||(p.fx&&p.fx.some(f=>f[0]==='heal'||f[0]==='healpct')));
  try{
    for(const k in CLASSES){const c=CLASSES[k];for(const p of (c.powers||[]))if(p.act&&isHeal(p)&&!p._hc){p.cost=up(p.cost);p._hc=1}}
    for(const k in MX_POWER){const p=MX_POWER[k];if(p.act&&isHeal(p)&&!p._hc){p.cost=up(p.cost);p._hc=1}}
    for(const d of (typeof HERO_DEF!=='undefined'?HERO_DEF:[]))if(d&&d.sp&&d.sp.type==='heal'&&!d.sp._hc){d.sp.cost=up(d.sp.cost);d.sp._hc=1}
    if(typeof MX!=='undefined')for(const s of MX)if(isHeal(s)&&!s._hc){s.cost=up(s.cost);s._hc=1}
  }catch(e){console.warn('healcost',e)}
})();
