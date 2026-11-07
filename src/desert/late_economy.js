/* ==========================================================================
   LATE-GAME ECONOMY. (1) Every quest that pays 5,000 gold or more (as paid, after the x2 of QREW_MUL) now pays half the gold: the late quests were paying far more than anything cost.
   (2) Six super weapons, about 100,000 gold each, sold by Ysolde Vane, the Last Smith, in the Watch Nook on the ramparts (floor 5 of the Pale Spire). They are the best weapons in the game.
   Ids pg_sw_1 to pg_sw_6; painted icons assets/icn_pg_sw_<n>.png.
   ========================================================================== */
function leHalve(id){const r=QUESTS[id]&&QUESTS[id].reward;if(r&&r.gold&&!r._half&&r.gold*QREW_MUL>=5000){r.gold=Math.round(r.gold/2);r._half=1}}
for(const id of Object.keys(QUESTS))leHalve(id);
/* quests added after this file loads, or changed by a later file, are caught when their reward is shown or paid */
{const _rt=rewardText;rewardText=function(id){leHalve(id);return _rt.apply(this,arguments)}}
{const _qt=qTurnIn;qTurnIn=function(id){leHalve(id);return _qt.apply(this,arguments)}}
const LE_SUPER=[
 ['pg_sw_1','Dawnbreaker Brand','Sword','sword','#e8c060',[1560,1760],{str:90},{bossdmg:.7,bleed:[.6,10,120],stun:.22,exec:[.4,4]},.26,.7,
  "A tall greatsword of white gold with sunrise light running along the blade. Wounds bleed hard, a foe under 40% health takes four times the blow, about one blow in five knocks the foe down, one blow in four does double damage, and bosses take 70% more."],
 ['pg_sw_2','Eclipse Cleaver','Axe','axe','#1a1624',[1620,1820],{str:90},{cleave:1,bossdmg:.75,exec:[.45,5],bleed:[.55,10,120]},.26,.8,
  "A huge double-bladed axe, black as a new moon with a thin ring of light round its edge. Each blow carries on into the foe behind, a foe under 45% health takes five times the blow, wounds bleed hard, and bosses take 75% more."],
 ['pg_sw_3','Starfall Maul','Mace','mace','#4a5a8a',[1540,1740],{str:90},{stun:.4,bossdmg:.7,shock:.35,vuln:[.4,6]},.24,.9,
  "A war hammer with a head of dark meteoric iron set with points of cold light. About two blows in five knock the foe down, one in three shakes the ground and throws down every foe close by, a hit often leaves the foe open to harm, and bosses take 70% more."],
 ['pg_sw_4','Whisper of the Last Hour','Dagger','dagger','#c8b8ff',[1480,1660],{dex:90},{bleed:[.7,12,120],exec:[.5,5],bossdmg:.55},.4,.3,
  "A slim pale blade with fine sand trapped inside it that never stops falling. Wounds bleed very hard, a foe under half health takes five times the blow, double hits come often, and bosses take 55% more."],
 ['pg_sw_5','Comet-Tail Longbow','Bow','bow','#a8d0ff',[1560,1760],{dex:90},{pierce:1,double:.6,vuln:[.4,6],bossdmg:.65},.24,.42,
  "A tall bow of pale silver wood with a streak of blue-white light along the limbs. Shoots 7 squares, its arrows pass through to the foe behind, three shots in five send a second arrow, a hit often leaves the foe open to harm, and bosses take 65% more."],
 ['pg_sw_6','Staff of the Unwritten Sky','Staff','staff','#e8d890',[520,620],{int:92},{bossdmg:.9,daze:.45,shock:.35},.0,.44,
  "A tall pale-gold staff, topped by a floating ring that holds a slow swirl of night sky. Adds 420 to the power of spells, spell damage +35%, tiredness fades very fast, bosses take 90% more, and foes are often dazed."]
].map(a=>{const o={n:a[1],t:a[2],ic:a[3],c:a[4],dmg:a[5],req:a[6],eff:a[7],dbl:a[8],sw:a[9],d:a[10],price:100000};
  if(a[2]==='Staff'){o.magic=420;o.pas={spellPct:.35,mpRegen:2,regen:.8}}
  return psf6Item(a[0],120,o)});
for(const it of LE_SUPER)if(!it.dbl)delete it.dbl;
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push(...LE_SUPER.map(i=>i.id));
khNpc('psf5_smith','Ysolde Vane, the Last Smith','ps_c_psservant',d=>say('"They call me the Last Smith, because I am the one still at the anvil. Nobody has asked me for a plain blade in years. The ones I make now are made from what the tower leaves behind: black iron, star metal, a little of the clock. They are not cheap. One hundred thousand gold each, and I do not haggle with the dead or the living."',
  [['Show me the weapons',()=>{G.talk=null;openShop(d,LE_SUPER.map(i=>[i.id,1]),"The Last Smith's Anvil");return null}],BYE]),{sc:1});
