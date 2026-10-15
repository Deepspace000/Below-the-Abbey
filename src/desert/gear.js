/* ==========================================================================
   GEAR FOR THE HIGH LEVELS. Plain steel and leather, nothing magic: five weapons of each kind (swords, axes and maces, bows) and five of each armour
   (helms, body armour, shields) for levels 10, 20, 30, 40 and 50, each with a way of its own: bleeding, cleaving, executing, stunning, thorns,
   dodging. Plus stronger potions, mana and stamina draughts and brews of might, speed and iron skin. They are sold in the sword shops, armour shops
   and potion shops of Khemetra's Merchants' Quarter and of Ironhill (the buildings are placed in khemetra_build.js and ironhill_shops.js).
   ========================================================================== */
const GEAR=[];
function gw(id,n,t,tier,dmg,hit,req,price,col,eff,d,extra){
  const lv=Math.max(1,tier-10); // weapons ask for ten levels less than their tier (the tier keeps the picture and the price bracket)
  const it=Object.assign({n,k:'weapon',t,ic:t==='Bow'?'bow':t==='Axe'?'axe':t==='Mace'?'mace':'sword',c:col,dmg,hit,req,price,lvl:lv,tier,eff,d:d+` Needs level ${lv}.`,sw:t==='Bow'?.42:.44,gear:1},extra||{});
  if(t==='Bow')it.ranged=extra&&extra.ranged||4;
  ITEMDEF[id]=it;GEAR.push(id);
}
function ga(id,k,n,t,lv,armor,price,col,pas,d,req){
  ITEMDEF[id]={n,k,t,ic:k==='head'?'head':k==='shield'?'shield':'chest',c:col,armor,price,lvl:lv,pas:pas||null,req:req||null,d:d+` Needs level ${lv}.`,sw:k==='head'?.38:k==='shield'?.42:.46,gear:1};
  GEAR.push(id);
}
// swords
gw('cutlass',"Serrated Cutlass",'Sword',10,[10,16],.05,{str:14},400,'#b8a8a0',{bleed:[.25,5,3]},'A curved blade with a saw edge. A quarter of its hits leave the foe bleeding.');
gw('greatsword','Cleaving Greatsword','Sword',20,[18,28],0,{str:18},900,'#b8bcc8',{cleave:1},'A huge blade swung in a great arc. Every hit also cuts the foe standing behind the first.');
gw('executioner',"Executioner's Blade",'Sword',30,[26,38],.02,{str:22},1600,'#6a6a78',{exec:[.3,2.5]},'A black broad blade. Against a foe under 30% health it deals two and a half times damage.',{dbl:.1});
gw('claymore','Vanguard Claymore','Sword',40,[38,54],.04,{str:26},2600,'#90b0d8',{stun:.2},'A heavy steel-blue claymore. One hit in five knocks the foe senseless for a round.');
gw('kingslayer','Kingslayer','Sword',50,[54,78],.1,{str:30},4200,'#e8d890',{bossdmg:.5},'A king-sized longsword that rarely misses. Bosses and great beasts take half again as much from it.',{dbl:.12});
// axes and hammers
gw('splitaxe','Splitting Axe','Axe',10,[12,19],-.04,{str:16},400,'#a8a8b0',{daze:.15},'A woodsman\'s axe with a wicked edge. One hit in seven leaves the foe dazed.');
gw('wolfaxe','Wolf-Haft Axe','Axe',20,[22,32],-.03,{str:20},900,'#9aa0aa',{cleave:1},'A bearded axe from the north. Hits carry through to the foe behind.');
gw('maul','Spiked Maul','Mace',30,[34,50],-.04,{str:24},1600,'#80808c',{vuln:[.3,3]},'A spiked iron maul. A third of its hits crack the foe\'s guard: it takes half again as much damage for three rounds.');
gw('headsman',"Headsman's Axe",'Axe',40,[46,66],-.02,{str:28},2600,'#505058',{exec:[.25,3]},'A long black axe. Against a foe under a quarter health it deals triple damage.');
gw('worldaxe','Earthsplitter','Axe',50,[64,92],-.03,{str:32},4200,'#e0c870',{shock:.25},'A gigantic double axe. One hit in four shakes the ground and knocks down every foe within two squares.');
// bows
gw('hunterbow',"Hunter's Longbow",'Bow',10,[9,15],.1,{dex:14},400,'#8a6a40',{},'A plain, well-made longbow. Shoots up to 4 squares and rarely misses.',{ranged:4});
gw('barbedbow','Barbed Bow','Bow',20,[16,24],.06,{dex:18},900,'#a89878',{bleed:[.3,6,4]},'Bone barbs on the limbs and barbed arrows. A third of its hits leave the foe bleeding.',{ranged:4});
gw('twinbow','Twinstring Bow','Bow',30,[24,36],.06,{dex:22},1600,'#8a7a50',{double:.25},'Two strings, two arrows. One shot in four sends a second arrow after the first.',{ranged:4});
gw('warbow','Steppe Warbow','Bow',40,[36,52],.08,{dex:26},2600,'#c0a070',{pierce:1},'A horn and sinew recurve bow. Its arrows pass through the foe and strike the one behind.',{ranged:5});
gw('silverbow','Windrunner','Bow',50,[50,72],.15,{dex:30},4200,'#d0d8e8',{bossdmg:.25},'A slim bow of silvered wood, quick and true. Shoots 6 squares; great beasts take a quarter more.',{ranged:6,dbl:.2});
// master weapons for level 30: the best steel a smith will sell, for a lot of gold
gw('wyrmfang',"Wyrmfang Sabre",'Sword',30,[34,48],.05,{str:22},2400,'#e8c060',{bleed:[.4,8,4]},'A gold-hilted sabre with a blade ground from a dragon tooth. Two hits in five leave the foe bleeding badly.',{dbl:.1});
gw('thunderaxe','Thunder Axe','Axe',30,[36,50],-.03,{str:24},2800,'#d86a50',{shock:.2},'A broad red axe that rings like a bell. One hit in five shakes the ground and knocks down every foe within two squares.');
gw('skullcrusher','Skullcrusher','Mace',30,[32,46],-.02,{str:22},2200,'#7aa0d8',{stun:.2},'A blue-steel war hammer with a head like an anvil. One hit in five knocks the foe senseless for a round.');
gw('stormbow','Stormstring Bow','Bow',30,[30,44],.08,{dex:22},2400,'#90d878',{double:.3},'A bow strung with something that crackles. Shoots 5 squares, and three shots in ten send a second arrow after the first.',{ranged:5,dbl:.1});
// the in-between tiers: levels 5, 15, 25, 35, 45, 55 and 60, four weapons each (sword, axe, mace, bow), and a set of four 50-80 weapons for 4000g
const TIERW=[];
{ // [id, name, type, level, damage, hit, req, price, effect, what it does, extra]
  const R=[
  ['gladius','Legion Gladius','Sword',5,[6,10],.02,{str:12},150,{},'A short, plain army sword. Quick and reliable.'],
  ['hatchet','Sharp Hatchet','Axe',5,[6,10],-.04,{str:12},150,{},'A hand axe with a proper edge.'],
  ['cudgel','Iron Cudgel','Mace',5,[5,9],-.02,{str:12},140,{},'A club with iron bands. Crude and heavy.'],
  ['huntbow','Hunting Bow','Bow',5,[4,8],.04,{dex:12},150,{},'A simple bow for small game. Shoots up to 3 squares.',{ranged:3}],
  ['bastard','Bastard Sword','Sword',15,[14,22],.03,{str:16},650,{bleed:[.2,5,3]},'Long enough for two hands, light enough for one. One hit in five leaves the foe bleeding.'],
  ['beardaxe','Bearded Axe','Axe',15,[14,22],-.04,{str:16},650,{daze:.15},'A hooked axe from the hill forts. One hit in seven leaves the foe dazed.'],
  ['flanged','Flanged Mace','Mace',15,[15,23],-.03,{str:16},650,{daze:.2},'A mace with steel flanges that bite through mail. One hit in five dazes the foe.'],
  ['longbow','Yew Longbow','Bow',15,[11,18],.08,{dex:16},650,{},'A tall yew bow. Shoots up to 4 squares.',{ranged:4}],
  ['tempered','Tempered Longsword','Sword',25,[20,35],.05,{str:20},1500,{exec:[.2,2]},'A longsword of fine, folded steel. Against a foe under 20% health it deals double damage.'],
  ['battleaxe',"Knight's Battle Axe",'Axe',25,[20,35],-.03,{str:20},1500,{cleave:1},'A broad axe made for the melee. Every hit also cuts the foe standing behind the first.'],
  ['warhammer','Steel War Hammer','Mace',25,[21,35],-.03,{str:20},1500,{vuln:[.25,3]},'A steel hammer with a spike on the back. A quarter of its hits crack the guard of the foe.'],
  ['compbow','Composite Bow','Bow',25,[20,35],.08,{dex:20},1500,{pierce:1},'Horn, sinew and wood glued together. Its arrows pass through the foe and strike the one behind.',{ranged:4}],
  ['frostbrand','Frostbrand','Sword',35,[32,46],.05,{str:24},2100,{stun:.15},'A blade that never loses its frost. One hit in seven freezes the foe for a round.'],
  ['reaveraxe','Reaver Axe','Axe',35,[33,48],-.03,{str:24},2100,{bleed:[.3,8,4]},'A black, jagged axe. Three hits in ten leave the foe bleeding.'],
  ['greatmaul','Great Maul','Mace',35,[34,50],-.03,{str:24},2200,{stun:.2},'A two-handed maul with a head like a boulder. One hit in five knocks the foe senseless.'],
  ['elvenbow','Elven Bow','Bow',35,[32,46],.1,{dex:24},2100,{double:.25},'A slender bow that is quicker than it looks. Shoots 5 squares, and one shot in four sends a second arrow.',{ranged:5}],
  ['doomblade','Doomblade','Sword',45,[46,66],.06,{str:28},3300,{bleed:[.4,10,4]},'A cruel, notched sword. Two hits in five leave the foe bleeding badly.'],
  ['dreadaxe','Dread Axe','Axe',45,[47,68],-.02,{str:28},3300,{exec:[.25,2.5]},'A huge axe with a skull on the haft. Against a foe under a quarter health it deals two and a half times damage.'],
  ['titanhammer','Titan Hammer','Mace',45,[48,70],-.03,{str:28},3400,{vuln:[.3,4]},'A hammer for a giant. A third of its hits crack the guard of the foe for four rounds.'],
  ['bonebow','Dragonbone Bow','Bow',45,[44,64],.1,{dex:28},3300,{bleed:[.3,8,4]},'A bow of dragon rib. Shoots 5 squares, and its arrows leave the foe bleeding.',{ranged:5}],
  ['nightfall','Nightfall','Sword',45,[50,80],.07,{str:28},4000,{exec:[.25,2.5]},'A black greatsword that drinks the light. Against a foe under a quarter health it deals two and a half times damage.',{dbl:.1}],
  ['dragonmaw','Dragonmaw Axe','Axe',45,[50,80],-.02,{str:28},4000,{cleave:1,bleed:[.3,8,4]},'An axe with a jaw of dragon teeth. It cuts through to the foe behind, and three hits in ten leave a foe bleeding.'],
  ['judgement','Hammer of Judgement','Mace',45,[50,80],-.02,{str:28},4000,{stun:.2,vuln:[.25,3]},'A white hammer that falls like a sentence. One hit in five stuns the foe, and one in four cracks its guard.'],
  ['ruinbow','Bow of Ruin','Bow',45,[50,80],.1,{dex:28},4000,{pierce:1,double:.2},'A black bow that shoots through armour. Shoots 5 squares, its arrows pass through to the foe behind, and one shot in five sends a second arrow.',{ranged:5,dbl:.1}],
  ['sunderer','Sunderer','Sword',55,[70,100],.08,{str:32},5200,{bossdmg:.4},'A vast grey blade that breaks armour. Bosses and great beasts take 40% more from it.'],
  ['titanaxe','Titan Axe','Axe',55,[70,102],-.03,{str:32},5200,{shock:.25},'An axe the size of a door. One hit in four shakes the ground and knocks down every foe within two squares.'],
  ['mountainmaul','Mountain Maul','Mace',55,[72,104],-.03,{str:32},5300,{stun:.25},'A maul cut from a mountain. One hit in four knocks the foe senseless.'],
  ['stormbow2','Stormcaller Bow','Bow',55,[66,96],.12,{dex:32},5200,{double:.3},'A bow that hums before a storm. Shoots 6 squares, and three shots in ten send a second arrow.',{ranged:6}],
  ['worldblade','Worldbreaker Blade','Sword',60,[82,118],.1,{str:34},6500,{exec:[.3,3]},'The sword the old kings were buried with. Against a foe under 30% health it deals triple damage.',{dbl:.12}],
  ['ragnarok','Ragnarok Axe','Axe',60,[84,120],-.02,{str:34},6500,{cleave:1,shock:.15},'A war axe of the last battle. It cuts through to the foe behind, and shakes the ground one time in seven.'],
  ['doomhammer','Doom Hammer','Mace',60,[86,122],-.03,{str:34},6600,{stun:.2,shock:.2},'A hammer that ends arguments. It stuns one hit in five and shakes the ground one in five.'],
  ['starbow','Starfall Bow','Bow',60,[80,114],.14,{dex:34},6500,{bossdmg:.3},'A silver bow that shoots light. Shoots 6 squares; great beasts take 30% more.',{ranged:6,dbl:.15}]
  ];
  for(const r of R){gw(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],'#c8ccd4',r[8],r[9],r[10]);TIERW.push(r[0])}
}
// helms
ga('ironcap','head','Iron Cap','Helm',10,3,250,'#9aa0aa',null,'A plain iron cap with a nose guard.',{str:10});
ga('greathelm','head','Knight\'s Greathelm','Helm',20,4,500,'#b0b4bc',{dodge:.03},'A closed helm with a narrow slit. Blows glance off it.',{str:14});
ga('hornhelm','head','Horned Helm','Helm',30,5,900,'#8a8a96',{dmgPct:.05},'A horned helm that makes the wearer look twice as angry. All damage +5%.',{str:18});
ga('centurion','head','Centurion Helm','Helm',40,6,1500,'#c8a050',{crit:.05},'A bronze helm with a red crest. +5% double hits.',{str:22});
ga('warlordhelm',"Warlord's Helm",'Helm',50,8,2400,'#d8b860',{dodge:.05,dmgPct:.05},'A gold-trimmed helm worn by great captains. Enemies miss 5% more; damage +5%.',{str:26});
// master armour for level 30, to go with the master weapons
ga('drakehelm','head','Drakescale Helm','Helm',30,7,2000,'#c8603a',{dmgPct:.08,crit:.04},'A helm of overlapping red scales. All damage +8% and +4% double hits.',{str:22});
// body armour
ga('brigandine','chest','Studded Brigandine','Chest',10,5,450,'#7a5a3a',{regen:.15},'Leather studded with iron. Recover a little health every few rounds.');
ga('hauberk','chest','Steel Hauberk','Chest',20,7,900,'#a0a8b0',{dodge:.03},'A shirt of steel rings. Enemies miss 3% more.');
ga('cuirass','chest','Plate Cuirass','Chest',30,9,1600,'#b8bcc4',{regen:.2},'A polished steel breastplate. Recover health steadily.');
ga('lionplate','chest','Lionplate','Chest',40,12,2600,'#b0b4bc',{thorns:3},'Plate with lion-head pauldrons. Every enemy that strikes you takes 3 damage.');
ga('goldplate','chest','Gilded Plate','Chest',50,15,4000,'#d8b860',{dodge:.06,regen:.3},'Gold-trimmed steel plate. Enemies miss 6% more and wounds close fast.');
ga('wyrmplate','chest','Wyrmscale Plate','Chest',30,12,2800,'#4a7a9a',{dodge:.05,regen:.25},'Plate hung with the scales of a great wyrm. Enemies miss 5% more and wounds close steadily.',{str:24});
// shields
ga('roundshield','shield','Banded Round Shield','Shield',10,3,300,'#8a6238',{dodge:.04},'A round shield with an iron boss. Enemies miss 4% more.',{str:10});
ga('kiteshield','shield','Kite Shield','Shield',20,4,600,'#c0c8d0',{dodge:.06},'A long shield with a blue stripe. Enemies miss 6% more.',{str:14});
ga('spikeshield','shield','Spiked Shield','Shield',30,5,1100,'#707078',{thorns:4},'An iron shield bristling with spikes. Every enemy that strikes you takes 4 damage.',{str:18});
ga('towershield','shield','Lion Tower Shield','Shield',40,7,1800,'#303038',{dodge:.08},'A tall dark shield with a golden lion. Enemies miss 8% more.',{str:22});
ga('dragonshield','shield','Dragon Shield','Shield',50,9,2800,'#a07840',{dodge:.1,thorns:6},'A huge bronze shield with a dragon. Enemies miss 10% more and take 6 damage for every blow they land.',{str:26});
ga('bulwark','shield','Bulwark of Ages','Shield',30,8,2200,'#8a8a96',{thorns:6,dodge:.06},'A slab of black iron older than the kingdom. Enemies miss 6% more and take 6 damage for every blow they land.',{str:22});
// potions and brews
function gp(id,n,col,price,d,o){ITEMDEF[id]=Object.assign({n,k:'potion',t:'Potion',ic:'potion',c:col,stack:1,price,d,sw:.26},o)}
gp('healdraught','Healing Draught','#d03a2a',60,'Restores 60 health.',{heal:60});
gp('greaterheal','Greater Healing Draught','#e0502e',140,'Restores 120 health.',{heal:120});
gp('superiorheal','Superior Healing Draught','#f06a30',320,'Restores 220 health.',{heal:220});
gp('elixir','Elixir of Life','#ff9a3a',700,'Restores 400 health.',{heal:400});
gp('manadraught','Mana Draught','#3a6ae0',70,'Restores 20 mana or stamina.',{mana:20});
gp('greatermana','Greater Mana Draught','#4a7af0',170,'Restores 45 mana or stamina.',{mana:45});
gp('supermana','Superior Mana Draught','#6a9aff',380,'Restores 80 mana or stamina.',{mana:80});
gp('might','Potion of Might','#e07030',120,'The drinker deals 25% more damage for 25 rounds.',{buff:{b:'dmgPct',amt:.25,rounds:25}});
gp('swiftness','Potion of Swiftness','#50d0e0',110,'Enemies miss the drinker 15% more for 25 rounds.',{buff:{b:'dodge',amt:.15,rounds:25}});
gp('ironskin','Potion of Iron Skin','#9098a8',110,'The drinker gains +5 armor for 25 rounds.',{buff:{b:'armor',amt:5,rounds:25}});
gp('keeneye','Potion of the Keen Eye','#f0e060',100,'The drinker hits 12% more often for 25 rounds.',{buff:{b:'hitPct',amt:.12,rounds:25}});
if(typeof HEAL_IDS!=='undefined')for(const id of ['healdraught','greaterheal','superiorheal','elixir'])HEAL_IDS.push(id);
if(typeof ART_ITEM_IDS!=='undefined')for(const id of GEAR)ART_ITEM_IDS.push(id);
/* what the shops sell */
const GEAR_STOCK={
  sword:()=>[...TIERW,'cutlass','wyrmfang','thunderaxe','skullcrusher','stormbow','greatsword','executioner','claymore','kingslayer','splitaxe','wolfaxe','maul','headsman','worldaxe','hunterbow','barbedbow','twinbow','warbow','silverbow'].map(id=>[id,1]),
  armour:()=>['drakehelm','wyrmplate','bulwark','ironcap','greathelm','hornhelm','centurion','warlordhelm','brigandine','hauberk','cuirass','lionplate','goldplate','roundshield','kiteshield','spikeshield','towershield','dragonshield'].map(id=>[id,1]),
  potion:()=>[['healdraught',6],['greaterheal',4],['superiorheal',2],['elixir',1],['manadraught',6],['greatermana',4],['supermana',2],['might',3],['swiftness',3],['ironskin',3],['keeneye',3],['antidote',5],['salve',5],['holywater',2],['sleeptea',3]]
};
// the new weapons borrow the painted picture of an older one, recoloured, until they have a painting of their own
function gearTintIcons(){
  const TC={5:[[44,34,24],[210,184,150]],15:[[24,28,36],[205,214,228]],25:[[14,26,40],[165,208,238]],35:[[40,18,44],[232,176,242]],45:[[50,14,8],[255,155,105]],55:[[42,38,6],[255,236,124]],60:[[10,42,38],[155,255,232]]};
  const BASE={Sword:{5:'sword',15:'cutlass',25:'greatsword',35:'claymore',45:'claymore',55:'kingslayer',60:'kingslayer'},Axe:{5:'splitaxe',15:'splitaxe',25:'wolfaxe',35:'headsman',45:'headsman',55:'worldaxe',60:'worldaxe'},Mace:{5:'mace',15:'mace',25:'maul',35:'maul',45:'maul',55:'maul',60:'maul'},Bow:{5:'hunterbow',15:'hunterbow',25:'barbedbow',35:'twinbow',45:'warbow',55:'silverbow',60:'silverbow'}};
  for(const id of TIERW){const d=ITEMDEF[id];if(IMG['icn_'+id])continue;const b=IMG['icn_'+BASE[d.t][d.tier]];if(!b||typeof pToneMap!=='function')continue;
    const c=TC[d.tier],im=pToneMap(b,c[0],c[1],1.6,.9,0);IMG['icn_'+id]=im;IMG['ic_'+id]=im;IMG['it_'+id]=im}
  const T={wyrmfang:['greatsword',[70,44,8],[255,222,120]],thunderaxe:['headsman',[60,12,10],[255,130,100]],skullcrusher:['maul',[10,24,60],[160,208,255]],stormbow:['twinbow',[16,48,20],[190,255,150]],drakehelm:['centurion',[60,16,10],[255,140,100]],wyrmplate:['cuirass',[10,30,50],[150,210,240]],bulwark:['spikeshield',[24,24,30],[200,200,215]]};
  for(const id in T){if(IMG['icn_'+id])continue;const b=IMG['icn_'+T[id][0]];if(!b||typeof pToneMap!=='function')continue;
    const c=pToneMap(b,T[id][1],T[id][2],1.7,.9,0);IMG['icn_'+id]=c;IMG['ic_'+id]=c;IMG['it_'+id]=c}
}
/* what the gear does, in play */
function gearPas(hi,key){
  const h=G.heroes[hi];if(!h||!h.eq)return 0;let s=0;
  for(const k in h.eq){const it=h.eq[k];if(!it)continue;const d=ITEMDEF[it.id];if(d&&d.pas&&d.pas[key])s+=d.pas[key]}
  return s;
}
function weaponProc(i,E,dmg,w,k){
  const e=w&&w.eff;if(!e||!E)return;
  const h=G.heroes[i],d0=DIRS[G.P.f],nm=ENEMY_DEF[E.t].name;
  if(E.hp>0){
    if(e.bleed&&Math.random()<e.bleed[0])mxApplyEnemy(i,E,['bleed',e.bleed[1],e.bleed[2]],null);
    if(e.daze&&Math.random()<e.daze){E.chilled=1;msg(`The ${nm} reels, dazed.`,'#e8c870')}
    if(e.stun&&Math.random()<e.stun)mxApplyEnemy(i,E,['hold',1],null);
    if(e.vuln&&Math.random()<e.vuln[0])mxApplyEnemy(i,E,['vuln',e.vuln[1]],null);
    if(e.exec&&E.hp<=E.maxhp*e.exec[0]){const x=Math.round(dmg*(e.exec[1]-1));msg(`The finishing blow! +${x}.`,'#ffd76a');hurtEnemy(E,x)}
    if(e.bossdmg&&mxIsBoss(E)){hurtEnemy(E,Math.round(dmg*e.bossdmg))}
  }
  if(e.cleave||e.pierce){
    const e2=enemyAt(G.P.x+d0[0]*(k+1),G.P.y+d0[1]*(k+1));
    if(e2&&e2.hp>0){const x=Math.max(1,Math.round(dmg*(e.pierce?.8:.6)));hurtEnemy(e2,x);msg(`${e.pierce?'The arrow passes through':'The blow carries on'} and hits the ${ENEMY_DEF[e2.t].name} for ${x}.`,'#ffd76a')}
  }
  if(e.shock&&Math.random()<e.shock){
    const L=G.enemies.filter(q=>q.hp>0&&Math.abs(q.x-G.P.x)+Math.abs(q.y-G.P.y)<=2);
    if(L.length>1||(L.length===1&&L[0]!==E)||true){for(const q of L)mxApplyEnemy(i,q,['hold',1],null);msg('The ground shudders. Foes are thrown down!','#e0c870');G.shake=Math.max(G.shake||0,.3)}
  }
  if(e.double&&Math.random()<e.double&&E.hp>0){const r=rollDmg(h);hurtEnemy(E,r.d);msg(`A second arrow follows for ${r.d}.`,'#ffd76a')}
}
