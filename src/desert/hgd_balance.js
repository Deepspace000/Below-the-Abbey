/* ==========================================================================
   BALANCE (prefix bal / BAL). A smoother difficulty gradient and shorter fights.
   1. The weapon curve: ordinary weapons of level 16 to 29 are raised on a smooth ramp (x1.0 at level 15 to about x2.8 at level 29), so party damage climbs steadily towards the level 30 weapons instead of
      jumping about 3 times at level 30 (see the weapon curve in hgd_minis.js, which raised everything from level 30 up).
   2. Shorter fights: creature health is cut to BAL.HP (0.6, so a fight lasts about 40% fewer rounds). To pay for it, creature damage is raised by BAL.dk(level), fitted so that three creatures of a place's level cost
      a level-appropriate party about BAL.target(level) of its health: a gentle rise from 10% at level 10 to 17% at level 100. These are only the best-geared case, so real parties with less gear, and bosses, will lose more; tune BAL.dkT.
   ========================================================================== */
const BAL={HP:.6,
  // creature health factor by level: unchanged (1.0) up to level 30, then rising through levels 30 to 40 so that the better weapons of the middle game do not kill an ordinary creature in one or two hits (about three rounds to kill at every level from 30 up)
  hpT:[[1,1],[28,1],[30,1],[35,1.08],[40,1.25],[50,1.26],[60,1.12],[70,1.16],[80,1.03],[100,.95]],
  dkT:[[1,1],[25,1],[28,1.15],[30,1.3],[32,1.6],[34,1.75],[40,1.65],[50,1.85],[60,1.95],[70,2.1],[80,2.1],[90,2.2],[100,2.3]], // (level, creature damage factor): refitted with the longer fights above
  tgT:[[10,10],[20,11],[30,12],[50,14],[100,17]]}; // the health a party should lose in one fight against three creatures of its own level, in percent: a gentle rise
BAL.lerp=(T,x)=>{if(x<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++)if(x<=T[i][0]){const a=T[i-1],b=T[i];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0])}return T[T.length-1][1]};
BAL.dk=l=>BAL.lerp(BAL.dkT,l);BAL.hp=l=>BAL.lerp(BAL.hpT,l);BAL.target=l=>BAL.lerp(BAL.tgT,l);
// 1. the weapon ramp (done once, when the game loads)
{const done=new Set();for(const id in ITEMDEF){const d=ITEMDEF[id];if(!d||d.k!=='weapon'||!d.lvl||d.lvl<16||d.lvl>29||d.rar||done.has(d))continue;done.add(d);
  const f=1+1.8*Math.pow((d.lvl-15)/15,1.5);d.dmg=[Math.round(d.dmg[0]*f),Math.round(d.dmg[1]*f)]}}
// 2. creature health and damage
/* From level 28 an ordinary creature is sized by how many hits it takes from a hero with good gear for the party's level (AH, average hit = damage times chance to hit, of an average party: a party with the best gear takes about a quarter fewer hits, and sails through for a while), as a rough guide, not a rule:
   a creature takes about 13 hits from an average party of its own level, so one the party has outgrown takes fewer, and one above the party more (BAL.hitsRel(0));
   the kind of creature changes it (a wolf-like one about 60 percent of that, the toughest ordinary kinds up to 175 percent), and each kind is a little different (plus or minus 15 percent), so no two fights feel the same.
   Bosses and great creatures keep the older formula (health factor hpT). The new sizing fades in from level 26 to 32; below it nothing changes. */
BAL.REF=48;BAL.DMG=1.12; // every creature hits 12 percent harder, at every level
BAL.ahT=[[1,8],[10,14],[20,36],[25,54],[28,62],[30,98],[34,100],[36,143],[40,150],[46,164],[50,178],[60,182],[70,183],[100,184]]; // the average hit (damage times chance to hit) of an average (weaker) party: about four fifths of one with the best gear for its level, so a party with better gear than average kills faster for a while
BAL.ah=l=>BAL.lerp(BAL.ahT,l);
BAL.w=l=>Math.max(0,Math.min(1,(l-26)/6));
BAL.hitsRel=rel=>BAL.lerp([[-6,10],[0,13.3],[3,20],[8,23]],rel); // matched to Gandrick's Wood, which felt just right to a weaker party at level 10: its creatures take about 9 to 17 hits (the average of the three weapon heroes) from them
BAL.kind=(t,base)=>{let h=0;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))|0;const j=.85+.3*(((h>>>0)%1000)/1000);return Math.max(.6,Math.min(1.4,base/BAL.REF))*j};
BAL.partyLvl=L=>{const a=(G.heroes||[]).filter(h=>h.alive!==false);return a.length?a.reduce((n,h)=>n+h.lvl,0)/a.length:L};
{const _es=enemyStat;enemyStat=function(t,lvl){const r=_es.apply(this,arguments),L=lvl||lvlHere(),k=BAL.dk(L),d=ENEMY_DEF[t],old=Math.max(1,Math.round(r.hp*BAL.hp(L))),w=BAL.w(L);
  const ordinary=d&&!(d.boss||d.aboveParty||(typeof NO_VARY!=='undefined'&&NO_VARY.includes(t))||d.partyLevel||/^w_/.test(t));
  if(ordinary&&w>0){const nw=BAL.ah(L)*BAL.hitsRel(0)*BAL.kind(t,d.hp);r.hp=Math.max(1,Math.round(old*(1-w)+nw*w))}else r.hp=old; // sized from the creature's own level, never from the party (the party's level changes while it is being levelled up, and that once gave some creatures a fraction of their health)
  r.dmg=[Math.max(1,Math.round(r.dmg[0]*k*BAL.DMG)),Math.max(1,Math.round(r.dmg[1]*k*BAL.DMG))];return r}}

// 3. mana runs out faster: every power, spell and special costs half as much again (at least one more), so a party has to plan its straight hits and its power hits
BAL.MANA=1.5;
(function(){const up=c=>c>0?Math.max(c+1,Math.round(c*BAL.MANA)):c,fix=o=>{if(o&&typeof o.cost==='number'&&!o._mb){o.cost=up(o.cost);o._mb=1}};
  try{for(const k in CLASSES){const c=CLASSES[k];fix(c.sp);for(const p of (c.powers||[]))fix(p)}
    for(const k in MX_POWER)fix(MX_POWER[k]);
    if(typeof MX!=='undefined')for(const s of MX)fix(s);
    for(const d of (typeof HERO_DEF!=='undefined'?HERO_DEF:[]))if(d)fix(d.sp);
    for(const k in SPELLS)fix(SPELLS[k])}catch(e){console.warn('bal mana',e)}})();
