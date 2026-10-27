/* ==========================================================================
   BETTER GOODS FOR THORNWICK AND IRONHILL. The playtest found that gear did not keep pace with the creatures: the shops of the two towns sold only plain (tier 0, white) goods,
   and the party piled up gold with nothing worth buying. Gear tiers are white (basic), green, blue, red, purple and orange; they are worked out from the price (see
   tools/SHOP_TIERS_NOTES.md), the game has no tier names of its own.

   Thornwick (Aldous's Store, the Witch's Shelf) now sells plain goods plus green and early blue gear for every class.
   Ironhill (Brannoch's Forge, Dorn's Store, Steelhold Blades, Ironhill Plate and Mail, the Cauldron) sells blue and red gear, with the odd purple piece.
   Everything is gated by the party: a thing shows in the shop when its level is at most the party level plus 5, so the better goods appear a few levels before they can be
   worn (each piece says "Needs level N" in its text, and the game refuses to equip it before that). The shops pick up newly allowed goods each time they are opened.
   Khemetra's shops and everything else are untouched. Last in the injection order. The goods are the ones that already exist (gear.js, armour.js, magegear.js, weight.js),
   plus the daggers, staves, a mace, a shield and chain sleeves and leggings made here, to fill the gaps (nothing but swords, axes, maces and bows had tiers; no dagger or staff did).
   ========================================================================== */
const ST_ENABLED=false; // false leaves every shop exactly as before (the new items exist but nothing sells them); set true to turn the new stock on
const ST_IDS=[];
function stWeapon(id,n,t,lv,dmg,hit,req,price,eff,d,x){
  ITEMDEF[id]=Object.assign({n,k:'weapon',t,ic:t==='Dagger'?'dagger':t==='Staff'?'staff':'mace',c:'#c8ccd4',dmg,price,lvl:lv,req,eff:eff||undefined,
    d:d+` Needs level ${lv}.`,sw:t==='Dagger'?.34:t==='Staff'?.4:.44,gear:1},hit?{hit}:{},x||{});
  if(!ITEMDEF[id].eff)delete ITEMDEF[id].eff;
  ST_IDS.push(id)}
function stArmour(id,k,n,t,lv,armor,price,col,req,d){
  ITEMDEF[id]={n,k,t,ic:k==='shield'?'shield':k==='arms'?'bracers':'leggings',c:col,armor,price,lvl:lv,req:req||undefined,d:d+` Needs level ${lv}.`,sw:k==='shield'?.42:.4,gear:1};
  if(!ITEMDEF[id].req)delete ITEMDEF[id].req;
  ST_IDS.push(id)}
// daggers (a little less damage than a sword of the same price, a better chance to hit)
stWeapon('st_stiletto','Steel Stiletto','Dagger',1,[5,8],.08,{dex:12},150,null,'A narrow steel blade made for the gap in the armour. Quick and sure.');
stWeapon('st_poniard','Notched Poniard','Dagger',1,[8,13],.1,{dex:14},400,{bleed:[.25,5,3]},'A thin blade with a notched edge. A quarter of its hits leave the foe bleeding.');
stWeapon('st_kris','Wavy Kris','Dagger',5,[12,19],.1,{dex:16},650,{daze:.15},'A dagger with a wavy blade that is hard to read. One hit in seven leaves the foe dazed.');
stWeapon('st_rondel','Rondel Dagger','Dagger',10,[15,24],.1,{dex:18},900,{exec:[.2,2]},'A round-hilted knife for the last thrust. Against a foe under 20% health it deals double damage.');
stWeapon('st_misericorde','Misericorde','Dagger',15,[17,29],.12,{dex:20},1500,{exec:[.25,2.2]},'The dagger of mercy, thin as a needle. Against a foe under a quarter health it deals more than double damage.');
stWeapon('st_dirk','Highland Dirk','Dagger',20,[30,44],.12,{dex:22},1600,{bleed:[.4,8,4]},'A long dirk with a black handle. Two hits in five leave the foe bleeding.');
stWeapon('st_midnightkris','Midnight Kris','Dagger',25,[54,78],.14,{dex:24},2100,{bleed:[.35,8,4],exec:[.2,2]},'A dark, wavy blade that is hard to see in the dusk. It bleeds the foe, and finishes the weak.');
stWeapon('st_nightblade','Nightblade','Dagger',30,[100,142],.15,{dex:26},2600,{exec:[.3,2.5],bleed:[.4,8,4]},'A black dagger that drinks the light. Against a foe under 30% health it deals two and a half times damage.',{dbl:.1});
// staves (a little melee damage, and spell power for the casters)
stWeapon('st_oakstaff','Oak Staff','Staff',1,[2,5],0,{int:8},150,null,'A plain staff of seasoned oak with an iron cap. Adds 5 to the power of spells.',{magic:5});
stWeapon('st_ashstaff','Ash Staff','Staff',1,[3,6],0,{int:10},400,null,'A pale, straight staff of ash, carved with small runes. Adds 8 to the power of spells.',{magic:8});
stWeapon('st_runestaff','Runed Staff','Staff',5,[4,8],0,{int:12},650,null,'A staff with a band of silver runes around the head. Adds 11 to the power of spells.',{magic:11});
stWeapon('st_hedgestaff',"Hedgewizard's Staff",'Staff',10,[5,10],0,{int:14},900,null,'A knotted staff cut from a hedge and bound with copper wire. Adds 15 to the power of spells.',{magic:15});
stWeapon('st_sagestaff',"Sage's Staff",'Staff',15,[7,13],0,{int:17},1500,null,'A tall staff with a crystal in the head. Adds 20 to the power of spells.',{magic:20});
stWeapon('st_moonstaff','Moonwood Staff','Staff',20,[14,24],0,{int:20},1600,{daze:.15},'A silver-white staff from a tree that grows only by moonlight. Adds 26 to the power of spells, and one blow in seven leaves the foe dazed.',{magic:26});
stWeapon('st_stormstaff','Stormwood Staff','Staff',25,[24,38],0,{int:23},2100,{daze:.2},'A staff of black, split wood that crackles when it is held. Adds 34 to the power of spells, and one blow in five leaves the foe dazed.',{magic:34});
stWeapon('st_magusstaff','Staff of the Magus','Staff',30,[50,82],0,{int:26},2600,{daze:.2},'The staff of a master of the art, topped with a gold claw around a blue stone. Adds 40 to the power of spells, and one blow in five leaves the foe dazed.',{magic:40});
// a mace, a shield, and chain for the arms and legs
stWeapon('st_morningstar','Morning Star','Mace',1,[10,16],-.03,{str:14},400,{daze:.12},'A spiked iron ball on a chain-wrapped haft. One hit in eight leaves the foe dazed.');
stArmour('st_rimmed','shield','Iron-Rimmed Shield','Shield',5,3,180,'#8a8a96',{str:9},'A wooden shield with a rim and a boss of iron.');
stArmour('st_chainarms','arms','Chain Sleeves','Arms',5,4,190,'#9aa0aa',null,'Sleeves of small iron rings over padded cloth.');
stArmour('st_chainlegs','legs','Chain Leggings','Legs',5,4,230,'#9aa0aa',null,'Leggings of small iron rings over padded cloth.');
/* the new pieces borrow the painted picture of a plain one, recoloured by price, until they have paintings of their own */
{const _gt=gearTintIcons;gearTintIcons=function(){
  _gt.apply(this,arguments);
  try{if(typeof pToneMap!=='function')return;
    const COL=[[400,[[14,34,16],[190,236,170]]],[1100,[[14,26,44],[170,206,246]]],[2600,[[50,12,10],[255,160,140]]],[1e9,[[36,16,50],[226,182,250]]]];
    for(const id of ST_IDS){const d=ITEMDEF[id];if(IMG['icn_'+id])continue;const b=IMG['icn_'+d.ic];if(!b)continue;
      const c=COL.find(q=>d.price<q[0])[1],im=pToneMap(b,c[0],c[1],1.6,.9,0);IMG['icn_'+id]=im;IMG['ic_'+id]=im;IMG['it_'+id]=im}
  }catch(e){console.error(e)}}}
/* what each shop sells: [item, how many, party level it first shows at (default: the item's level minus 5)] */
const ST_SHOPS={
  "Aldous's Store":{items:[ // Thornwick: the plain stock stays; green and early blue goods are added
    ['gladius',1],['hatchet',1],['cudgel',1],['huntbow',1],['st_stiletto',1],['st_oakstaff',1],
    ['cutlass',1],['splitaxe',1],['hunterbow',1],['st_morningstar',1],['st_poniard',1],['st_ashstaff',1],
    ['bastard',1],['beardaxe',1],['flanged',1],['longbow',1],['st_kris',1],['st_runestaff',1],
    ['greatsword',1],['wolfaxe',1],['barbedbow',1],['st_rondel',1],['st_hedgestaff',1],
    ['st_rimmed',1],['roundshield',1],['ar_boar_h',1],['ironcap',1],['ar_boar_c',1],['brigandine',1],['st_chainarms',1],['ar_boar_a',1],['st_chainlegs',1],['ar_boar_l',1],
    ['mg_app_h',1],['mg_app_c',1],['mg_app_a',1],['mg_app_l',1],
    ['ringOx',1],['ringFox',1],['ringOwl',1],['ringWell',1],['ringBear',1],
    ['healdraught',4],['manadraught',3],['greaterheal',2,12]]},
  "The Witch's Shelf":{items:[ // the witch of the Thornwood: potions, staves and cloth for the casters
    ['healdraught',3],['manadraught',4],['greatermana',2,14],['ringWell',1],['ringOwl',1],['ringMoon',1,12],
    ['st_oakstaff',1],['st_ashstaff',1],['st_runestaff',1],['st_hedgestaff',1],
    ['mg_app_h',1],['mg_app_c',1],['mg_app_a',1],['mg_app_l',1],['mg_hed_h',1],['mg_hed_a',1],['mg_hed_l',1]]},
  "Brannoch's Forge":{items:[ // Ironhill: good plain steel (blue, and red as the party grows)
    ['bastard',1],['beardaxe',1],['flanged',1],['longbow',1],['st_kris',1],['st_runestaff',1],
    ['greatsword',1],['wolfaxe',1],['barbedbow',1],['st_rondel',1],['st_hedgestaff',1],
    ['tempered',1],['battleaxe',1],['warhammer',1],['compbow',1],['st_misericorde',1],['st_sagestaff',1],
    ['executioner',1],['maul',1],['twinbow',1],['st_dirk',1],['st_moonstaff',1],
    ['st_rimmed',1],['roundshield',1],['kiteshield',1],['spikeshield',1],
    ['ironcap',1],['greathelm',1],['hornhelm',1],['brigandine',1],['hauberk',1],
    ['healdraught',3],['greaterheal',2]]},
  "Dorn's Store":{items:[ // Ironhill's general store: everyday gear, blue at most
    ['bastard',1],['beardaxe',1],['flanged',1],['longbow',1],['st_kris',1],['st_runestaff',1],
    ['st_rimmed',1],['roundshield',1],['kiteshield',1],['ironcap',1],['brigandine',1],['st_chainarms',1],['st_chainlegs',1],
    ['ar_boar_h',1],['ar_boar_c',1],['ar_boar_a',1],['ar_boar_l',1],['ar_iron_a',1],['ar_iron_l',1],
    ['mg_app_h',1],['mg_app_c',1],['mg_hed_h',1],
    ['ringBear',1],['ringBulwark',1],['ringHawk',1],['ringLion',1],['ringMoon',1],
    ['healdraught',4],['greaterheal',3],['manadraught',3],['greatermana',2]]},
  'Steelhold Blades':{replace:1,items:[ // Ironhill's swordsmith: blue to red steel, and the odd purple blade
    ['greatsword',1],['wolfaxe',1],['barbedbow',1],['st_rondel',1],['st_hedgestaff',1],
    ['tempered',1],['battleaxe',1],['warhammer',1],['compbow',1],['st_misericorde',1],['st_sagestaff',1],
    ['executioner',1],['maul',1],['twinbow',1],['st_dirk',1],['st_moonstaff',1],
    ['frostbrand',1],['reaveraxe',1],['greatmaul',1],['elvenbow',1],['st_midnightkris',1],['st_stormstaff',1],
    ['wyrmfang',1],['skullcrusher',1],['stormbow',1],['thunderaxe',1],
    ['claymore',1],['headsman',1],['warbow',1],['st_nightblade',1],['st_magusstaff',1],
    ['ringHawk',1],['ringLion',1],['ringDuel',1]]},
  'Ironhill Plate and Mail':{replace:1,items:[ // Ironhill's armourer: blue to red armour for every slot, mage cloth, and the odd purple piece
    ['roundshield',1],['kiteshield',1],['spikeshield',1],['bulwark',1],
    ['ironcap',1],['greathelm',1],['ar_iron_h',1],['hornhelm',1],['ar_rime_h',1],['drakehelm',1],
    ['brigandine',1],['hauberk',1],['ar_iron_c',1],['cuirass',1],['ar_rime_c',1],['wyrmplate',1],
    ['ar_iron_a',1],['ar_rime_a',1],['ar_iron_l',1],['ar_rime_l',1],
    ['ar_boar_h',1],['ar_boar_c',1],['ar_boar_a',1],['ar_boar_l',1],
    ['mg_hed_h',1],['mg_hed_c',1],['mg_hed_a',1],['mg_hed_l',1],['mg_mag_h',1],['mg_mag_c',1],['mg_mag_a',1],['mg_mag_l',1],
    ['ringBulwark',1],['ringTitan',1],['ringWind',1],['ringSage',1],['ringOak',1],['ringChampion',1]]},
  'The Cauldron':{replace:1,items:[ // Ironhill's alchemist: the draughts that fit the levels
    ['healdraught',6],['greaterheal',4,10],['superiorheal',3,18],['elixir',1,22],['potion2',3,20],
    ['manadraught',6],['greatermana',4,12],['supermana',2,20],
    ['might',3],['swiftness',3],['ironskin',3],['keeneye',3],
    ['antidote',5],['salve',5],['holywater',2],['sleeptea',3]]}
};
function stVisible(r){const d=ITEMDEF[r[0]];if(!d)return false;const at=r[2]!==undefined?r[2]:Math.max(1,(d.lvl||1)-5);return partyLevel()>=at}
function stRows(T,stock){
  const out=T.replace?[]:stock.map(r=>[r[0],r[1]]),have=new Set(out.map(r=>r[0]));
  for(const r of T.items){if(have.has(r[0])||!stVisible(r))continue;have.add(r[0]);out.push([r[0],r[1]])}
  return out}
{const _os=openShop;openShop=function(d,stock,name){
  const T=ST_SHOPS[name];
  if(!ST_ENABLED||!T||!d||(typeof repRefuses==='function'&&repRefuses()))return _os.apply(this,arguments);
  if(T.replace&&d.contents&&!d.tierSeen)d.contents=null; // an old stock of a shop that is now curated is thrown away once
  const first=!d.contents,rows=stRows(T,stock);
  if(!first){ // the shop has been opened before: the goods that the party has since reached are put out
    const seen=d.tierSeen||(d.tierSeen={});
    for(const r of rows.concat(T.replace||!stock.some(q=>q[0]==='potion')?[]:potionStockRows())){
      if(seen[r[0]]||d.contents.some(c=>c.id===r[0]))continue;seen[r[0]]=1;d.contents.push({id:r[0],n:r[1]})}}
  const res=_os.call(this,d,first?rows:stock,name);
  if(first&&d.contents){d.tierSeen={};for(const c of d.contents)d.tierSeen[c.id]=1}
  return res}}
/* Aldous no longer says "nothing fancy" */
try{const _ar=ST_ENABLED&&NPCS.aldous&&NPCS.aldous.root;if(_ar)NPCS.aldous.root=function(){const n=_ar.apply(this,arguments);
  if(n&&typeof n.text==='string'&&n.text.indexOf('Nothing fancy.')>=0)n.text=n.text.replace('Nothing fancy.','And since the road opened, a few better pieces from the Ironhill smiths.');return n}}catch(e){console.error(e)}
