/* ==========================================================================
   XP CAPS. An ordinary creature is worth at most 150 base XP (the Mummy, the richest of the old creatures: 6,000 XP at level 40), however tough it is; several creatures of
   the Hollow lands, the sea and the marsh were worth many times that. A boss, mini-boss or named great creature never gives more than ONE LEVEL of XP: the amount the
   party's average level needs to go up one level (xpNeed). Quest and story rewards are not touched. Last in the injection order, so it sees every other change to enemyStat.
   ========================================================================== */
const XP_ORDINARY_MAX=150;
const XP_NOT_BOSS=['assassin','rguard','ashguard','hlgoblin','hlmadman','hlvictim','hgwcroc']; // stand a level or more above the party, but are ordinary creatures (the crocodiles come forty at a time)
const isXpBoss=t=>isBossy(t)&&!XP_NOT_BOSS.includes(t);
{const _es=enemyStat;enemyStat=function(t,lvl){const r=_es.apply(this,arguments);
  try{const d=ENEMY_DEF[t];if(d&&r&&r.xp!==undefined&&!isXpBoss(t)){const lv=lvl||lvlHere();r.xp=Math.min(r.xp,XP_ORDINARY_MAX*lv)}}catch(e){}
  return r}}
{const _kx=killXP;killXP=function(base,elvl){const x=_kx.apply(this,arguments);
  const L=livingHeroes(),pl=L.length?Math.round(L.reduce((n,i)=>n+G.heroes[i].lvl,0)/L.length):1;
  return Math.max(1,Math.min(x,xpNeed(Math.max(1,pl))))}}
/* the Rat King, the first boss (level 3 in the crypts): a party usually reaches him around level 5, and he gives it one full level there (450 XP); a party at level 4 or below also gets a full level, a party above level 5 a bit less */
ENEMY_DEF.boss.xp=175;
