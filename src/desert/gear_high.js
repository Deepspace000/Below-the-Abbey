/* ==========================================================================
   SHOP WEAPONS FOR LEVELS 62 TO 78, and every tier in the gear shops. The ordinary weapons stopped at level 50 (the 60 to 80 ones were all drops).
   Twenty new plain-steel weapons (sword, axe, mace, bow; five tiers) with a price. Then Wenlock, Sale, the Deeper Hollow's arms and armour shops
   and Dwen the stone-smith sell every priced, non-unique weapon and piece of armour in the game, and Oldhaven's arms shops and armourers sell
   them up to level 80.
   ========================================================================== */
const GH_IDS=[];
{ // [id, name, type, level, effect, what it does, extra]
  const R=[
  ['gh_sw62','Duskfall Blade','Sword',62,{bleed:[.35,12,5]},'A dark blade with a long fuller. More than a third of its hits leave the foe bleeding.'],
  ['gh_sw66','Oathbreaker','Sword',66,{exec:[.3,3]},'A grey broadsword. Against a foe under 30% health it deals triple damage.'],
  ['gh_sw70','Greywind Longsword','Sword',70,{bossdmg:.45},'A long, plain, perfectly balanced sword. Bosses and great beasts take 45% more from it.'],
  ['gh_sw74','Kingsbane Brand','Sword',74,{stun:.2,bleed:[.3,14,5]},'A heavy brand with a red edge. One hit in five stuns the foe, and three in ten leave it bleeding.'],
  ['gh_sw78','Crownsplitter','Sword',78,{exec:[.3,3.5]},'A huge two-handed sword made to cut through helms. Against a foe under 30% health it deals three and a half times damage.'],
  ['gh_ax62','Ravager Axe','Axe',62,{cleave:1},'A broad axe with a curved edge. Every hit also cuts the foe standing behind the first.'],
  ['gh_ax66','Frostmaw Axe','Axe',66,{daze:.2,cleave:1},'A pale steel axe that is always cold to touch. It cuts through to the foe behind, and one hit in five dazes.'],
  ['gh_ax70','Gravewind Axe','Axe',70,{bleed:[.4,14,5]},'A rust-red axe with a long hooked beard. Two hits in five leave the foe bleeding.'],
  ['gh_ax74','Dragonsplitter','Axe',74,{cleave:1,shock:.15},'A huge double axe. It cuts through to the foe behind, and one hit in seven shakes the ground.'],
  ['gh_ax78','Worldsunder','Axe',78,{shock:.3},'An axe with a haft as long as a spear. Three hits in ten shake the ground and knock down every foe within two squares.'],
  ['gh_mc62','Bonecrusher','Mace',62,{vuln:[.3,4]},'A flanged mace with a head like a fist. A third of its hits crack the foe\'s guard for four rounds.'],
  ['gh_mc66','Thunderfall Maul','Mace',66,{stun:.2},'A two-handed maul that rings like a bell. One hit in five knocks the foe senseless.'],
  ['gh_mc70','Siegebreaker','Mace',70,{vuln:[.35,4]},'A ram of iron on a short haft. Over a third of its hits crack the foe\'s guard.'],
  ['gh_mc74','Oathhammer','Mace',74,{stun:.25,shock:.15},'A white-steel hammer. One hit in four stuns the foe, and one in seven shakes the ground.'],
  ['gh_mc78','Hammer of Ages','Mace',78,{stun:.25,vuln:[.3,4]},'A hammer older than the kingdom. It stuns one hit in four and cracks the guard of the foe one in three.'],
  ['gh_bw62','Hawkeye Bow','Bow',62,{pierce:1},'A tall, dark bow. Shoots 6 squares, and its arrows pass through to the foe behind.',{ranged:6}],
  ['gh_bw66','Stormfeather Bow','Bow',66,{double:.3},'A bow fletched with grey feathers. Shoots 6 squares, and three shots in ten send a second arrow.',{ranged:6}],
  ['gh_bw70','Wraithstring Bow','Bow',70,{bleed:[.35,12,5]},'A bow with a pale, humming string. Shoots 6 squares, and its arrows leave the foe bleeding.',{ranged:6}],
  ['gh_bw74','Skyrender','Bow',74,{pierce:1,double:.2},'A long bow of black horn. Shoots 7 squares, its arrows pass through to the foe behind, and one shot in five sends a second arrow.',{ranged:7}],
  ['gh_bw78','Bow of Last Light','Bow',78,{bossdmg:.35},'A silver bow that never misses a big target. Shoots 7 squares; bosses and great beasts take 35% more.',{ranged:7,dbl:.15}]];
  const AVG={62:270,66:295,70:325,74:365,78:410};
  for(const [id,n,t,L,eff,d,ex] of R){
    const a=AVG[L]*(t==='Bow'?.93:1),lo=Math.round(a*.82),hi=Math.round(a*1.18),req=Math.round(34+(L-62)/4),price=Math.round(6500*(1+(L-50)/25));
    const it={n,k:'weapon',t,ic:t==='Bow'?'bow':t==='Axe'?'axe':t==='Mace'?'mace':'sword',c:'#c8ccd4',dmg:[lo,hi],hit:t==='Bow'?.12:t==='Sword'?.08:-.02,req:t==='Bow'?{dex:req}:{str:req},price,lvl:L,tier:L,eff,d:d+` Needs level ${L}.`,sw:t==='Bow'?.42:.44,gear:1};
    if(t==='Bow')it.ranged=ex&&ex.ranged||6;
    if(ex&&ex.dbl)it.dbl=ex.dbl;
    ITEMDEF[id]=it;GH_IDS.push(id);if(typeof GEAR!=='undefined')GEAR.push(id)}
}
// they borrow the picture of an older weapon, recoloured, until each has a painting of its own
{const TC={62:[[10,42,38],[155,255,232]],66:[[40,18,44],[232,176,242]],70:[[50,14,8],[255,155,105]],74:[[14,26,40],[165,208,238]],78:[[42,38,6],[255,236,124]]},BASE={Sword:'kingslayer',Axe:'worldaxe',Mace:'maul',Bow:'twinbow'};
  const tint=()=>{if(typeof pToneMap!=='function')return;for(const id of GH_IDS){if(IMG['icn_'+id])continue;const d=ITEMDEF[id],b=IMG['icn_'+BASE[d.t]];if(!b)continue;const c=TC[d.lvl],im=pToneMap(b,c[0],c[1],1.6,.9,0);IMG['icn_'+id]=im;IMG['ic_'+id]=im;IMG['it_'+id]=im}};
  const _dw=drawWorld;drawWorld=function(){tint();return _dw.apply(this,arguments)}}
/* ---- every tier: all priced, non-unique weapons and armour up to a level, two of the cheap pieces and one of the rest ---- */
const ghGear=(kinds,max)=>Object.keys(ITEMDEF).filter(id=>{const d=ITEMDEF[id];return d&&!d.rar&&kinds.includes(d.k)&&(d.price||0)>0&&(d.lvl||1)<=max}).sort((a,b)=>(ITEMDEF[a].lvl||1)-(ITEMDEF[b].lvl||1)||ITEMDEF[a].price-ITEMDEF[b].price).map(id=>[id,ITEMDEF[id].price<400?2:1]);
const GH_WEAP=['weapon'],GH_ARM=['shield','head','chest','legs','arms','armor','armour'];
// Wenlock and Sale: everything
KH_STOCK.wli_weapons=()=>ghGear(GH_WEAP,999);
KH_STOCK.wli_armour=()=>ghGear(GH_ARM,999);
KH_STOCK.sa_weapons=()=>ghGear(GH_WEAP,999);
KH_STOCK.sa_armour=()=>ghGear(GH_ARM,999);
KH_STOCK.sa_tailor=()=>KH_STOCK.wli_tailor().concat(ghGear(['head','chest','legs','arms'],999));
// the Deeper Hollow: the arms and armour shop of every town, and Dwen the stone-smith
{const _h=hgds2Stock;hgds2Stock=function(kind,town){if(kind==='arms')return ghGear(GH_WEAP,999);if(kind==='armour')return ghGear(GH_ARM,999);return _h.apply(this,arguments)}}
if(typeof HGDP_SHOPS!=='undefined'&&HGDP_SHOPS[1])HGDP_SHOPS[1][1].push(...ghGear(GH_WEAP.concat(GH_ARM),999));
// Oldhaven: up to level 80
KH_STOCK.oh_arms=()=>KH_STOCK.arms().concat(ghGear(GH_WEAP,80));
KH_STOCK.oh_armour=()=>KH_STOCK.armour().concat(ghGear(['shield','head','chest'],80));
KH_STOCK.oh_tailor=()=>KH_STOCK.armour().concat(ghGear(['chest','legs','arms'],80));
