/* ==========================================================================
   MAGE GEAR. Eight cloth sets for the magic users, one every ten levels from 10 to 80: a hat, a robe, cuffs and leggings, each set in its own colours
   (Apprentice, Hedge Mage, Magus, Warlock, Sage, Enchanter, Wizard, Archmage). Cloth gives little armour, but every piece adds spell damage and healing,
   and from level 50 the hats and robes give back a little mana each round (mpRegen; the only way mana returns on its own is from gear like this).
   Any class may wear them. Sold in the armouries (the sets up to ten levels above the party) and found in chests, next to the armour sets.
   Pictures: assets/icn_mg_<set>_<h|c|a|l>.png (the Abbot's cloth pieces from the Pilgrim's Path, cleaned of crosses and recoloured, until they have paintings of their own).
   ========================================================================== */
const MG_SETS=[ // [key, name, level]
 ['app','Apprentice',10],['hed','Hedge Mage',20],['mag','Magus',30],['war','Warlock',40],['sag','Sage',50],['enc','Enchanter',60],['wiz','Wizard',70],['arc','Archmage',80]];
const MG_SLOTS=[['h','head','Helm','head','Hat',.55],['c','chest','Chest','chest','Robe',1],['a','arms','Arms','arms','Cuffs',.35],['l','legs','Legs','legs','Leggings',.45]];
const MG_IDS=[],MG_REGEN={50:.1,60:.15,70:.2,80:.3};
for(const [key,name,lv] of MG_SETS){
  const t=lv/10,A=Math.max(2,Math.round(2+lv*.14)),pr=Math.round(350*Math.pow(t,1.7)),sp=+(.02+.0013*lv).toFixed(3);
  for(const [sx,slot,ty,ic,nm,f] of MG_SLOTS){
    const id='mg_'+key+'_'+sx,pas={};let txt;
    if(sx==='h'||sx==='c'){pas.spellPct=sp;pas.healPct=+(sp*1.2).toFixed(3);txt=`Spell damage +${Math.round(sp*100)}% and healing +${Math.round(pas.healPct*100)}%.`}
    else if(sx==='a'){pas.spellPct=+(sp*.7).toFixed(3);txt=`Spell damage +${Math.round(pas.spellPct*100)}%.`}
    else{pas.spellPct=+(sp*.7).toFixed(3);pas.dodge=+(.01+lv*.0007).toFixed(3);txt=`Spell damage +${Math.round(pas.spellPct*100)}% and enemies miss ${Math.round(pas.dodge*100)}% more.`}
    if((sx==='h'||sx==='c')&&MG_REGEN[lv]){pas.mpRegen=MG_REGEN[lv];txt+=' Mana comes back a little each round.'}
    ITEMDEF[id]={n:`${name}'s ${nm}`,k:slot,t:ty,ic,c:'#8a8ae8',armor:Math.max(1,Math.round(A*f)),price:Math.max(30,Math.round(pr*f)),lvl:lv,pas,tier:lv,mage:1,
      d:`Cloth of the ${name} set, made for those who work magic. ${txt} Any class may wear it. Needs level ${lv}.`,sw:slot==='chest'?.34:.22,gear:1};
    GEAR.push(id);MG_IDS.push(id);
  }
}
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push(...MG_IDS);
{const _as=GEAR_STOCK.armour;GEAR_STOCK.armour=()=>{const L=partyLevel();return _as().concat(MG_IDS.filter(id=>ITEMDEF[id].lvl<=L+10).map(id=>[id,1]))}}
/* chests: now and then a piece of mage cloth from the best sets the party or the place has reached, instead of armour */
{const _ad=armourDrop;armourDrop=function(u){
  const L=Math.max(partyLevel(),(typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[LEVEL])||0);
  if(u<.4){const top=MG_SETS.map(x=>x[2]).filter(q=>q<=L).sort((x,y)=>y-x).slice(0,3),pool=MG_IDS.filter(id=>top.includes(ITEMDEF[id].lvl));if(pool.length)return pool[Math.floor(u/.4*pool.length*.9999)]}
  return _ad.apply(this,arguments)}}
