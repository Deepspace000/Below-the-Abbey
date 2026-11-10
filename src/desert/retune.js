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
const KING_HP=64000,KING_DMG=[600,900];
const RT_KEYS=Object.keys(RT_MUL).map(Number).sort((a,b)=>a-b);
const rtMul=l=>{if(l<30)return 1;const k=RT_KEYS;if(l>=k[k.length-1])return 1;for(let i=1;i<k.length;i++)if(l<=k[i]){const a=k[i-1],b=k[i],x=Math.log(RT_MUL[a]),y=Math.log(RT_MUL[b]);return Math.exp(x+(y-x)*(l-a)/(b-a))}return 1};
/* RETUNE 2 (v3.895), found with the same harness after its healing was made to match the game (fixed amounts, heal_scaling.js).
   RT_DMG and RT_HP: what an ordinary creature's damage and health are multiplied by (on top of RT_MUL), by the rating of the place (see rtKey), read off between the ratings listed. 1 = unchanged.
   Bosses: from level 30 up no boss hits harder on average than a third of the health of a front fighter of its level (RT_FRONT), and none has more health than a
   well equipped party deals in RT_BOSS_ROUNDS rounds (RT_REF). These are ceilings only: a boss below them is not changed. Both follow the difficulty setting. */
const RT_DMG={4:1,7:1.13,9:1.88,10:1.51,13:2.06,16:1.68,19:1.21,22:1.52,25:1.64,28:1.33,29:1.21,30:0.71,31:0.83,32:0.78,34:0.91,36:0.75,37:0.82,39:0.79,41:0.68,42:0.76,45:0.7,46:0.76,48:0.68,49:0.72,50:0.71,52:1.17,54:0.66,55:0.93,56:0.7,57:0.58,58:0.47,59:0.32,60:0.35,61:0.29,62:0.29,63:0.35,64:0.27,65:0.36,66:0.41,67:0.57,68:0.61,69:0.64,70:0.68,72:0.59,74:0.53,77:0.86,80:0.5,81:0.78,82:0.47,83:0.64,84:0.43,85:0.6,86:0.59,87:0.54,88:0.47,89:0.47,90:0.62,92:0.73,94:0.42,96:0.41,98:0.76,101:0.48,102:0.46,103:0.57,104:0.58,106:0.53,107:0.55,108:0.53,109:0.56,110:0.48,111:0.5,112:1};
const RT_HP={4:0.68,7:0.83,9:0.8,10:1.06,13:0.97,16:0.99,19:0.56,22:0.92,25:1.02,28:1,29:0.84,30:1.22,31:1.53,32:1.1,34:1.21,36:1.1,37:0.95,39:1.05,41:1.31,42:1.17,45:1.46,46:1.59,48:1.27,49:1.19,50:0.97,52:1.45,54:1.37,55:1.78,56:1.59,57:1.83,58:1.24,59:1.49,60:1.19,61:1.16,62:1.76,63:1.61,64:1.24,65:1.5,66:1.62,67:2.14,68:2.55,69:1.55,70:1.71,72:1.88,74:2.09,77:2.4,80:1.96,81:2.19,82:1.76,83:2.58,84:2.6,85:2.39,86:2.33,87:2.77,88:2.6,89:2.46,90:2.99,92:3,94:2.58,96:2.57,98:3,101:3,102:2.92,103:2.17,104:2.46,106:2.33,107:2.52,108:2.48,109:3,110:2.83,111:3,112:1};
const RT_BOSS_ROUNDS=18,RT_BOSS_HITS=2; // 2 blows before armour: armour now takes up to half off a blow (armourCut), so about 4 blows in the best armour, under 3 in poor armour
const RT_REF=[[30,470],[40,720],[50,920],[60,1200],[70,1550],[80,1740],[90,1950],[100,2450],[110,2800],[120,2880]];
const RT_FRONT=l=>15.3*l+19;
const RT_BOSS_HP={boss:.75}; // the Rat King: a party in the gear the crypts hand out took about thirty rounds
const rtTab=(T,l)=>{let k=T._k;if(!k)Object.defineProperty(T,'_k',{value:k=Object.keys(T).map(Number).sort((a,b)=>a-b),writable:true});if(l<=k[0])return T[k[0]];if(l>=k[k.length-1])return T[k[k.length-1]];for(let i=1;i<k.length;i++)if(l<=k[i]){const a=k[i-1],b=k[i],x=Math.log(T[a]),y=Math.log(T[b]);return Math.exp(x+(y-x)*(l-a)/(b-a))}return 1};
const rtRef=l=>{const R=RT_REF;if(l<=R[0][0])return R[0][1];for(let i=1;i<R.length;i++)if(l<=R[i][0])return R[i-1][1]+(R[i][1]-R[i-1][1])*(l-R[i-1][0])/(R[i][0]-R[i-1][0]);return R[R.length-1][1]};
/* The two tables were measured place by place (each rating has its own mix of creatures), so a creature is looked up by the rating of the place it stands in,
   not by its own level, which varies by one either way. A creature whose level is far from the level of the place (a fixed level, another place) is looked up by its own level.
   RT_KEY: the balance harness sets it to the rating it is testing; in the game it stays null. */
let RT_KEY=null;
const rtKey=L=>{if(RT_KEY!==null)return RT_KEY;try{const b=LEVEL_RATING[LEVEL];if(b!==undefined&&Math.abs(L-lvlHere())<=2)return b}catch(e){}return L};
{const _es=enemyStat;enemyStat=function(t,lvl){const r=_es.apply(this,arguments);
  try{const d=ENEMY_DEF[t],L=lvl||lvlHere();
    const bossy=!d||isBossy(t)||d.aboveParty||d.partyLevel||/^w_/.test(t)||(typeof NO_VARY!=='undefined'&&NO_VARY.includes(t));
    if(t==='psf6_king'){r.hp=KING_HP;r.dmg=[KING_DMG[0],KING_DMG[1]]} // the Pale King hit for 3,600 to 5,500 and one-shot every hero; now a fixed health and damage (see KING_HP)
    else if(!bossy){const K=rtKey(L),m=rtMul(L)*rtTab(RT_DMG,K),h=rtTab(RT_HP,K);
      if(m!==1)r.dmg=[Math.max(1,Math.round(r.dmg[0]*m)),Math.max(1,Math.round(r.dmg[1]*m))];
      if(h!==1)r.hp=Math.max(1,Math.round(r.hp*h))}
    else if(d){
      if(RT_BOSS_HP[t])r.hp=Math.max(1,Math.round(r.hp*RT_BOSS_HP[t]));
      if(L>=30){let dm=1,hm=1;try{dm=diffDmg();hm=diffHp()}catch(e){}
        const capD=RT_FRONT(L)/RT_BOSS_HITS*dm,avg=(r.dmg[0]+r.dmg[1])/2;
        if(avg>capD){const f=capD/avg;r.dmg=[Math.max(1,Math.round(r.dmg[0]*f)),Math.max(1,Math.round(r.dmg[1]*f))]}
        const capH=Math.round(RT_BOSS_ROUNDS*rtRef(L)*hm);if(r.hp>capH)r.hp=capH}}}catch(e){}
  return r}}
{const _gx=giveXP;giveXP=function(a){
  try{if(!G.flags.autoScaleOn&&typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[LEVEL]!==undefined){
    const L=livingHeroes(),pl=L.length?L.reduce((n,i)=>n+G.heroes[i].lvl,0)/L.length:1,base=LEVEL_RATING[LEVEL],off=lvlHere()-base,over=pl-(rtCeil(base)+off);
    if(lvlHere()>=25){if(over>0)a=Math.round(a*Math.max(.05,1-.5*over));
    a=Math.min(a,Math.round(xpNeed(Math.max(1,Math.round(pl)))*2))}}}catch(e){}
  return _gx.call(this,a)}}
