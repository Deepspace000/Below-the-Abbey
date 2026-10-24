/* ==========================================================================
   THE HOLLOW CREATURES, SCALED DOWN. The creatures of the Hollow lands (the Hollow Land, the Grasslands, the Deeper Hollow and its marsh, the Underlevel, the lakes) were written later than the
   old creatures with much bigger numbers (health 100 to 650 where an old creature has 30 to 80, damage up to 37 where the Hitman has 13), and they were marked as fixed-level creatures (NO_VARY),
   which kept the balance code (hgd_balance.js) from sizing their health like everyone else's. So they had 5 to 20 times the health and 2 to 4 times the damage of an ordinary creature of their level.
   Now an ordinary Hollow creature is sized like any other: its health comes from the balance code, and its damage is capped at an average of 13 on the base scale (the Hitman, the hardest-hitting old creature, is 10.5).
   Bosses, mini-bosses, demons and the great creatures are not touched. Last in the injection order.
   ========================================================================== */
const HOLLOW_DMG_AVG_MAX=13;
const hollowOrdinary=t=>{const d=ENEMY_DEF[t];return !!(d&&d.dmg&&/^(hg|hl)/.test(t)&&!d.boss&&!d.mini&&!isXpBoss(t))};
for(const t of Object.keys(ENEMY_DEF)){
  if(!hollowOrdinary(t))continue;const d=ENEMY_DEF[t];
  if(d.aboveParty===1)d.aboveParty=0; // the crocodiles: ordinary creatures, so they follow the same 1 below, at or 1 above rule
  if(typeof NO_VARY!=='undefined')for(let i=NO_VARY.length-1;i>=0;i--)if(NO_VARY[i]===t)NO_VARY.splice(i,1);
  const avg=(d.dmg[0]+d.dmg[1])/2;if(avg>HOLLOW_DMG_AVG_MAX){const k=HOLLOW_DMG_AVG_MAX/avg;d.dmg=[Math.max(1,Math.round(d.dmg[0]*k)),Math.max(1,Math.round(d.dmg[1]*k))]}
}
