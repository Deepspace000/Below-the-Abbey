/* ==========================================================================
   THE EDGE OF A HIGHER LEVEL. A creature above the party's average level is harder than its stats alone say:
   - it hits more often: +0.6 percent to its chance to hit for every level it stands above the party, at most +18 percent (so +14 percent against a level 84 creature and a level 60 party);
   - it takes slightly less damage: 0.5 percent less for every level above, at most 20 percent less (12 percent less at 24 levels up).
   A creature at or below the party's level is not changed. The party level is the average of the living heroes (adaAvgLvl, adapt.js).
   ========================================================================== */
const LE={hitPer:.006,hitMax:.18,dmgPer:.005,dmgMax:.20};
function leGap(e){
  if(!e||!(e.lvl>0)||typeof adaAvgLvl!=='function')return 0;
  const a=adaAvgLvl();return a>0?Math.max(0,e.lvl-a):0}
{const _hc=enemyHitC;enemyHitC=function(def,hi,lvl,e){
  const base=_hc.apply(this,arguments),g=leGap(e);
  return g>0?Math.min(.97,base+Math.min(LE.hitMax,g*LE.hitPer)):base}}
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){
  const g=leGap(e);
  if(g>0&&typeof dmg==='number'&&dmg>1){const a=Array.prototype.slice.call(arguments);a[1]=Math.max(1,Math.round(dmg*(1-Math.min(LE.dmgMax,g*LE.dmgPer))));return _he.apply(this,a)}
  return _he.apply(this,arguments)}}
