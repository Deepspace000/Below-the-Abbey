/* ==========================================================================
   BALANCE (prefix bal / BAL). A smoother difficulty gradient and shorter fights.
   1. The weapon curve: ordinary weapons of level 16 to 29 are raised on a smooth ramp (x1.0 at level 15 to about x2.8 at level 29), so party damage climbs steadily towards the level 30 weapons instead of
      jumping about 3 times at level 30 (see the weapon curve in hgd_minis.js, which raised everything from level 30 up).
   2. Shorter fights: creature health is cut to BAL.HP (0.6, so a fight lasts about 40% fewer rounds). To pay for it, creature damage is raised by BAL.dk(level), fitted so that three creatures of a place's level cost
      a level-appropriate party about BAL.target(level) of its health: a gentle rise from 10% at level 10 to 17% at level 100. These are only the best-geared case, so real parties with less gear, and bosses, will lose more; tune BAL.dkT.
   ========================================================================== */
const BAL={HP:.6,
  // creature health factor by level: 0.6 early (fights about 40 percent shorter), rising through levels 25 to 40 so that the better weapons of the middle game do not kill an ordinary creature in one or two hits (about three rounds to kill at every level from 30 up)
  hpT:[[1,.6],[20,.6],[25,.67],[28,.72],[30,.86],[35,1.08],[40,1.25],[50,1.26],[60,1.12],[70,1.16],[80,1.03],[100,.95]],
  dkT:[[1,1],[10,1],[15,1],[20,1.2],[25,1.5],[28,1.6],[30,1.62],[35,1.77],[40,1.87],[50,2.05],[60,2.16],[70,2.18],[80,1.95],[90,1.9],[100,1.85]], // (level, creature damage factor): refitted with the longer fights above
  tgT:[[10,10],[20,11],[30,12],[50,14],[100,17]]}; // the health a party should lose in one fight against three creatures of its own level, in percent: a gentle rise
BAL.lerp=(T,x)=>{if(x<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++)if(x<=T[i][0]){const a=T[i-1],b=T[i];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0])}return T[T.length-1][1]};
BAL.dk=l=>BAL.lerp(BAL.dkT,l);BAL.hp=l=>BAL.lerp(BAL.hpT,l);BAL.target=l=>BAL.lerp(BAL.tgT,l);
// 1. the weapon ramp (done once, when the game loads)
{const done=new Set();for(const id in ITEMDEF){const d=ITEMDEF[id];if(!d||d.k!=='weapon'||!d.lvl||d.lvl<16||d.lvl>29||d.rar||done.has(d))continue;done.add(d);
  const f=1+1.8*Math.pow((d.lvl-15)/15,1.5);d.dmg=[Math.round(d.dmg[0]*f),Math.round(d.dmg[1]*f)]}}
// 2. creature health and damage
{const _es=enemyStat;enemyStat=function(t,lvl){const r=_es.apply(this,arguments),L=lvl||lvlHere(),k=BAL.dk(L);
  r.hp=Math.max(1,Math.round(r.hp*BAL.hp(L)));r.dmg=[Math.max(1,Math.round(r.dmg[0]*k)),Math.max(1,Math.round(r.dmg[1]*k))];return r}}
