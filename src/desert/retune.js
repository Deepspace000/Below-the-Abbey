/* ==========================================================================
   RETUNE (v3.870). Two things, both found with the balance harness (tools/balance/harness.js):
   1. Ordinary creatures from level 30 up hit harder by a factor fitted area by area (RT_MUL), so a party with ordinary gear loses a steady share of its health in every area (about a third at level 30 to 60,
      about two fifths after) and the spikes (ratings 72, 74, 100, 107, 108) are flattened, while a party with the best gear still loses only about a fifth and wins almost every fight. Bosses are not changed.
   2. (From area level 25 up; the early game is left as it was.) A party that is already above an area's level gets much less experience from it (each level over the next rated area's level, or the area's own plus one, costs 50 percent, down to 5 percent), and no single reward gives more than two levels,
      so an area lifts the party by about one level and the next area is not trivial.
   ========================================================================== */
const RT_MUL={30:2.19,31:2.12,32:1.32,34:1.44,36:1.52,37:1.33,39:1.34,41:1.5,42:1.44,45:1.42,46:1.66,48:1.68,49:1.36,50:1.27,55:1.47,56:1.39,57:2.04,67:2.11,68:2.08,69:1.48,70:1.26,72:.92,74:.96,77:1.41,80:1.08,81:1.29,82:1,83:1.6,84:1.89,85:1.62,86:1.39,87:1.65,88:1.68,89:1.68,90:1.56,100:.91,101:1.4,102:1.58,103:.95,104:.94,106:.96,107:.82,108:.79,109:1.21,110:1,111:1.04};
/* the ratings that have creatures: a big area (the Deeper Hollow, the Blighted Lands) is rated for where the party enters it, and the party is meant to rise through the whole gap to the next rating there, so an area's XP is only held back once the party is above the NEXT rating (at least the area's own plus one) */
const RT_RATES=[4,7,9,10,13,16,19,25,28,29,30,31,32,34,36,37,39,41,42,45,46,48,49,50,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,72,74,77,80,81,82,83,84,85,86,87,88,89,90,100,101,102,103,104,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120];
const rtCeil=r=>{for(const q of RT_RATES)if(q>r)return Math.max(q,r+1);return r+1};
const KING_HP=120000,KING_DMG=[400,600];
const RT_KEYS=Object.keys(RT_MUL).map(Number).sort((a,b)=>a-b);
const rtMul=l=>{if(l<30)return 1;const k=RT_KEYS;if(l>=k[k.length-1])return 1;for(let i=1;i<k.length;i++)if(l<=k[i]){const a=k[i-1],b=k[i],x=Math.log(RT_MUL[a]),y=Math.log(RT_MUL[b]);return Math.exp(x+(y-x)*(l-a)/(b-a))}return 1};
{const _es=enemyStat;enemyStat=function(t,lvl){const r=_es.apply(this,arguments);
  try{const d=ENEMY_DEF[t],L=lvl||lvlHere();
    const bossy=!d||isBossy(t)||d.aboveParty||d.partyLevel||/^w_/.test(t)||(typeof NO_VARY!=='undefined'&&NO_VARY.includes(t));
    if(t==='psf6_king'){r.hp=KING_HP;r.dmg=[KING_DMG[0],KING_DMG[1]]} // the Pale King hit for 3,600 to 5,500 and one-shot every hero; now 400 to 600, with 120,000 health (the harness: best gear wins about nine in ten, average gear needs healing and care)
    else if(!bossy&&L>=30){const m=rtMul(L);r.dmg=[Math.max(1,Math.round(r.dmg[0]*m)),Math.max(1,Math.round(r.dmg[1]*m))]}}catch(e){}
  return r}}
{const _gx=giveXP;giveXP=function(a){
  try{if(!G.flags.autoScaleOn&&typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[LEVEL]!==undefined){
    const L=livingHeroes(),pl=L.length?L.reduce((n,i)=>n+G.heroes[i].lvl,0)/L.length:1,base=LEVEL_RATING[LEVEL],off=lvlHere()-base,over=pl-(rtCeil(base)+off);
    if(lvlHere()>=25){if(over>0)a=Math.round(a*Math.max(.05,1-.5*over));
    a=Math.min(a,Math.round(xpNeed(Math.max(1,Math.round(pl)))*2))}}}catch(e){}
  return _gx.call(this,a)}}
