/* ==========================================================================
   THE GREAT ARMOUR SETS. Ten full sets of armour (helm, chest, arms, legs) for levels 10, 20, 30 ... 100, each with its own painted pieces and its own
   way of fighting: wards that cut every blow, life drawn from the foe, a second wind, mana that comes back, thorns, dodging.
   Wear all four pieces of a set and its set bonus wakes. Sold in the armouries (the higher sets as the party grows) and found in chests.
   ========================================================================== */
const ARM_SETS=[ // [key, name, level, colour, flavour, effects of helm / chest / arms / legs, set bonus, set title]
 ['boar','Boarhide',10,'#8a6a44','Hardened boiled leather with bone studs and the tusks of a great boar.',['dodge','regen','crit','hungerSlow'],{ward:2,thorns:3},'Boarhide Hunter'],
 ['iron','Ironscale',20,'#8a929c','Overlapping dark iron scales, riveted and plain.',['ward','thorns','dmgPct','dodge'],{ward:4,regen:.25},'Ironscale Warden'],
 ['rime','Rimeforged',30,'#8ac8e8','Pale blue steel rimed with frost, trimmed with white fur.',['dodge','ward','mpRegen','lifesteal'],{secondWind:.3,mpRegen:.2},'Rimeforged Sentinel'],
 ['ember','Emberplate',40,'#d8602a','Black iron plate with cracks of glowing red, like cooling lava.',['dmgPct','thorns','crit','regen'],{thorns:8,dmgPct:.08},'Emberplate Champion'],
 ['sun','Sunsteel',50,'#e8c860','Polished gold and white steel, engraved with the sun.',['regen','dodge','lifesteal','mpRegen'],{secondWind:.4,regen:.5},'Sunsteel Paladin'],
 ['void','Voidglass',60,'#7a4ac8','Black obsidian glass plate with veins of violet light.',['crit','lifesteal','dodge','dmgPct'],{lifesteal:.08,crit:.06,mpRegen:.2},'Voidglass Reaver'],
 ['storm','Stormwrought',70,'#58d0f0','Bright blue steel engraved with lightning, and it crackles.',['dodge','mpRegen','crit','dmgPct'],{dodge:.08,mpRegen:.5},'Stormwrought Tempest'],
 ['wyrm','Wyrmbone',80,'#e8e0c8','Ivory plates of dragon bone, ridged and toothed.',['ward','thorns','regen','lifesteal'],{ward:8,thorns:12},'Wyrmbone Slayer'],
 ['star','Starforged',90,'#3a58b8','Midnight plate scattered with silver stars.',['mpRegen','dodge','secondWind','regen'],{mpRegen:.6,secondWind:.4},'Starforged Seer'],
 ['god','Godforged',100,'#f0e0a0','Radiant white and gold plate with a halo and feathered wings.',['ward','lifesteal','dmgPct','regen'],{secondWind:.5,dmgPct:.1,ward:8,mpRegen:.3},'Godforged Exemplar']];
const ARM_SLOTS=[['h','head','Helm','head',.55],['c','chest','Chest','chest',1],['a','arms','Arms','arms',.35],['l','legs','Legs','legs',.45]];
const ARM_NAMES={boar:['Tusked Boarhide Helm','Boarhide Cuirass','Boarhide Vambraces','Boarhide Greaves'],iron:['Ironscale Coif','Ironscale Hauberk','Ironscale Vambraces','Ironscale Greaves'],rime:['Rimeforged Helm','Rimeforged Breastplate','Rimeforged Bracers','Rimeforged Greaves'],ember:['Emberplate Helm','Emberplate Cuirass','Emberplate Vambraces','Emberplate Greaves'],sun:['Sunsteel Helm','Sunsteel Cuirass','Sunsteel Vambraces','Sunsteel Greaves'],void:['Voidglass Crown','Voidglass Cuirass','Voidglass Vambraces','Voidglass Greaves'],storm:['Stormwrought Helm','Stormwrought Breastplate','Stormwrought Vambraces','Stormwrought Greaves'],wyrm:['Wyrmbone Skull Helm','Wyrmbone Cuirass','Wyrmbone Vambraces','Wyrmbone Greaves'],star:['Starforged Helm','Starforged Breastplate','Starforged Vambraces','Starforged Greaves'],god:['Godforged Helm','Godforged Cuirass','Godforged Vambraces','Godforged Greaves']};
const ARM_VAL={dodge:t=>+(.012*t+.01).toFixed(3),regen:t=>+(.08*t+.08).toFixed(2),thorns:t=>Math.round(2*t),dmgPct:t=>+(.012*t+.01).toFixed(3),crit:t=>+(.01*t+.01).toFixed(3),mpRegen:t=>+(.06*t+.04).toFixed(2),ward:t=>Math.round(1.2*t+.5),lifesteal:t=>+(.008*t+.02).toFixed(3),secondWind:t=>+(.2+.02*t).toFixed(2),hungerSlow:t=>+(.04*t+.06).toFixed(2)};
const armPct=v=>Math.round(v*100);
const ARM_TXT={dodge:v=>`Enemies miss ${armPct(v)}% more.`,regen:()=>'Wounds close steadily.',thorns:v=>`Every enemy that strikes you takes ${v} damage.`,dmgPct:v=>`All damage +${armPct(v)}%.`,crit:v=>`+${armPct(v)}% double hits.`,mpRegen:()=>'Mana comes back faster.',ward:v=>`Every blow on you is ${v} lighter.`,lifesteal:v=>`Heals ${armPct(v)}% of melee damage dealt.`,secondWind:v=>`Once per 30 rounds, below a quarter health, heals ${armPct(v)}%.`,hungerSlow:v=>`Hunger falls ${armPct(v)}% slower.`};
const ARM_IDS=[],ARM_SET_OF={};
for(const [key,name,lv,col,fl,keys,bonus,title] of ARM_SETS){
  const t=lv/10,A=Math.round(5+lv*.38),pr=Math.round(400*Math.pow(t,1.7));
  const btxt=Object.keys(bonus).map(k=>ARM_TXT[k](bonus[k])).join(' ');
  ARM_SET_OF[key]={name:title,bonus,btxt,lv,key};
  ARM_SLOTS.forEach(([sx,slot,ty,ic,f],i)=>{
    const id='ar_'+key+'_'+sx,k=keys[i],v=ARM_VAL[k](t),pas={};pas[k]=v;
    ITEMDEF[id]={n:ARM_NAMES[key][i],k:slot,t:ty,ic,c:col,armor:Math.max(2,Math.round(A*f)),price:Math.max(30,Math.round(pr*f)),lvl:lv,pas,set:key,tier:lv,
      d:`${ARM_TXT[k](v)} Set: ${title}. All four pieces give: ${btxt} Needs level ${lv}.`,sw:slot==='head'?.38:slot==='chest'?.46:.4,gear:1};
    GEAR.push(id);ARM_IDS.push(id);
  });
}
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push(...ARM_IDS);
/* the set bonus: four pieces of one set */
{const _gp=gearPas;gearPas=function(hi,key){
  let s=_gp(hi,key);const h=G.heroes[hi];if(!h||!h.eq)return s;
  const n={};for(const k in h.eq){const it=h.eq[k];const d=it&&ITEMDEF[it.id];if(d&&d.set)n[d.set]=(n[d.set]||0)+1}
  for(const sk in n)if(n[sk]>=4){const b=ARM_SET_OF[sk].bonus;if(b[key])s+=b[key]}
  return s}}
/* what the armouries sell: the sets up to ten levels above the party */
{const _as=GEAR_STOCK.armour;GEAR_STOCK.armour=()=>{const L=partyLevel();return _as().concat(ARM_IDS.filter(id=>ITEMDEF[id].lvl<=L+10).map(id=>[id,1]))}}
/* chests give pieces from the best sets that the party or the place has reached */
function armourDrop(u){
  const L=Math.max(partyLevel(),(typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[LEVEL])||0),top=ARM_SETS.map(x=>x[2]).filter(q=>q<=L).sort((x,y)=>y-x).slice(0,3),pool=ARM_IDS.filter(id=>top.includes(ITEMDEF[id].lvl));
  return pool.length?pool[Math.floor(u*pool.length)%pool.length]:null}
/* the new effects: a ward, life from the foe, a second wind */
function armourWard(t){return Math.round(pas(t,'ward'))}
function armourLeech(i,d){const f=pas(i,'lifesteal');if(f>0){const h=G.heroes[i];if(h&&h.alive&&h.hp<h.max){const n=Math.max(1,Math.round(d*f));h.hp=Math.min(h.max,h.hp+n);addFloat(portraitX(i)+19,250,'+'+n,'#7fe08a')}}}
function armourSecondWind(t){
  const h=G.heroes[t],f=pas(t,'secondWind');if(!h||!h.alive||f<=0||h.hp>=h.max*.25||(h.swT!==undefined&&G.rounds<h.swT))return;
  h.swT=G.rounds+30;const n=Math.round(h.max*f);h.hp=Math.min(h.max,h.hp+n);sfx('heal');msg(`${HERO_DEF[t].name} catches a second wind (+${n}).`,'#ffe9a0');addFloat(portraitX(t)+19,250,'+'+n,'#ffe9a0')}
