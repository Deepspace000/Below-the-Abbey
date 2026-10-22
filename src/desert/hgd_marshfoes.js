/* ==========================================================================
   MARSH FOES for the Deeper Hollow marshes (prefix hgm / HGMR). Eight marsh vermin; pictures are assets/ds_hgm*.png (IMG['art_<id>']).
   ========================================================================== */
const HGMR={enemies:['hgmlocust','hgmmosquito','hgmhorsefly','hgmdragonfly','hgmhornet','hgmcricket','hgmtoad','hgmbeetle']};
Object.assign(ENEMY_DEF,{
  hgmlocust:{name:'Marsh Locust',hp:260,dmg:[14,26],hit:.82,w:1.2,img:'art_hgmlocust',xp:240,gold:[0,20],speed:2,fly:true,verb:'chews',aboveParty:0},
  hgmmosquito:{name:'Giant Mosquito',hp:220,dmg:[12,24],hit:.8,w:1.1,img:'art_hgmmosquito',xp:200,gold:[0,15],speed:1,fly:true,verb:'stabs',aboveParty:0},
  hgmhorsefly:{name:'Giant Horsefly',hp:300,dmg:[16,28],hit:.82,w:1.3,img:'art_hgmhorsefly',xp:280,gold:[0,20],speed:1,fly:true,verb:'bites',aboveParty:0},
  hgmdragonfly:{name:'Razor Dragonfly',hp:340,dmg:[18,30],hit:.86,w:1.4,img:'art_hgmdragonfly',xp:340,gold:[0,25],speed:2,fly:true,verb:'slashes',aboveParty:0},
  hgmhornet:{name:'Marsh Hornet',hp:280,dmg:[16,28],hit:.84,w:1.3,img:'art_hgmhornet',xp:300,gold:[0,20],speed:1,fly:true,verb:'stings',aboveParty:0},
  hgmcricket:{name:'Bog Cricket',hp:360,dmg:[14,28],hit:.8,w:1.4,img:'art_hgmcricket',xp:300,gold:[0,25],speed:1,verb:'lashes',aboveParty:0},
  hgmtoad:{name:'Bloated Bog Toad',hp:480,dmg:[18,30],hit:.82,w:1.7,img:'art_hgmtoad',xp:380,gold:[5,25],speed:.7,verb:'lunges at',aboveParty:0},
  hgmbeetle:{name:'Mire Beetle',hp:460,dmg:[20,30],hit:.84,w:1.6,img:'art_hgmbeetle',xp:400,gold:[5,25],speed:1,verb:'gores',aboveParty:0}});
if(typeof NO_VARY!=='undefined')NO_VARY.push(...HGMR.enemies);
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^hgmmosquito/,'fever',.3],[/^hgmhorsefly/,'bleeding',.25],[/^hgmhornet/,'stung',.3],[/^hgmlocust/,'bleeding',.15],[/^hgmdragonfly/,'bleeding',.25],[/^hgmtoad/,'poisoned',.2]);
