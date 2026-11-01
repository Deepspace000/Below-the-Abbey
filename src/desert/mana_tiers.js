/* ==========================================================================
   MANA DRAUGHT TIERS. Health has ten steps (POTION_LADDER, from the Healing Potion to the Divine Healing Potion). Mana had three (Mana Draught 40, Greater 70,
   Superior, which fills the bar), so a late maze could only give the small ones. Six more are added in the same wording and at the same levels as the health ones:
   Strong (seen from level 20), Very Strong (40), Ultra (50), Supreme (65), Mythic (100), Divine (140). The mana and stamina bars stay small (about 50 at level
   20, 90 at 40, 140 at 65, 210 at 100, 290 at 140), so the amounts rise from the old Greater Mana Draught's 70 and stop being a trifle only in price and in the
   level they are found at; the old three are kept. Shops stock them by the party's level (potionStockRows), the mana found lying about (manadrops.js) and the
   chests of the secret walls pick by manaTierFor / healTierFor. Icons: tools/make_mana_icons.py (painted bottles, recoloured).
   ========================================================================== */
const MANA_NEW=[['manastrong','Strong Mana Draught','#3a9af0',150,100,20],['manavery','Very Strong Mana Draught','#7a5af0',320,160,40],['manaultra','Ultra Mana Draught','#dfe6f4',650,230,50],
  ['manasupreme','Supreme Mana Draught','#70e0e8',1300,320,65],['manamythic','Mythic Mana Draught','#e070e0',2600,450,100],['manadivine','Divine Mana Draught','#f0c840',5000,700,140]];
for(const [id,n,c,price,mana,minLvl] of MANA_NEW){gp(id,n,c,price,`Restores ${mana} mana or stamina. Seen from level ${minLvl}.`,{mana,minLvl});ITEMDEF[id].sw=.3}
/* the ladders: [item, the level it is first seen at] */
const MANA_LADDER=[['manadraught',1],['greatermana',8]].concat(MANA_NEW.map(q=>[q[0],q[5]]));
/* the best tier a place of rating R gives is the highest whose level is at most R+10; the pick is that tier (7 in 10) or the one just below it, never lower */
function tierFor(ladder,rating,roll){const open=ladder.filter(([id,m])=>m<=rating+10&&ITEMDEF[id]);if(!open.length)return ladder[0][0];const best=open.length-1;return open[roll<.7?best:Math.max(0,best-1)][0]}
const healTierFor=(rating,roll)=>tierFor(POTION_LADDER,rating,roll),manaTierFor=(rating,roll)=>tierFor(MANA_LADDER,rating,roll);
/* the shops: from the level a tier is seen at, the shops that sell strong healing potions sell the matching mana draught too */
{const _ps=potionStockRows;potionStockRows=function(){const L=partyLevel();return _ps.apply(this,arguments).concat(MANA_NEW.filter(q=>L>=q[5]).map(q=>[q[0],q[0]==='manastrong'||q[0]==='manavery'?2:1]))}}
