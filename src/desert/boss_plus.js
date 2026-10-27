/* ==========================================================================
   BOSSES ONE LEVEL ABOVE THEIR AREA. Sut, Lord of the Red Desert (the Tomb of Sut, area level 39) stands one level above the area, like the other creatures of the
   place stand within one level of it. This runs after the game has set every creature's level for the area (rebalanceEnemies), on arrival and whenever it is run again.
   Add a creature to BOSS_PLUS (its type and how many levels above) to give another boss the same. Last in the injection order.
   ========================================================================== */
const BOSS_PLUS={sut:1};
{const _rb=rebalanceEnemies;rebalanceEnemies=function(){
  const r=_rb.apply(this,arguments);
  try{for(const e of G.enemies){const up=BOSS_PLUS[e.t];if(!up||e.hp<=0||e.dying||e.base===undefined)continue;
    const nl=e.base+up;if(e.lvl!==nl){const fr=e.hp/Math.max(1,e.maxhp);e.lvl=nl;e.vd=-up;e.maxhp=enemyStat(e.t,nl).hp;e.hp=Math.max(1,Math.ceil(e.maxhp*fr))}}}catch(x){console.error('bossplus',x)}
  return r}}
