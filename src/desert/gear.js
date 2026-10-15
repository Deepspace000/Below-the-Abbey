/* ==========================================================================
   GEAR FOR THE HIGH LEVELS. Plain steel and leather, nothing magic: five weapons of each kind (swords, axes and maces, bows) and five of each armour
   (helms, body armour, shields) for levels 10, 20, 30, 40 and 50, each with a way of its own: bleeding, cleaving, executing, stunning, thorns,
   dodging. Plus stronger potions, mana and stamina draughts and brews of might, speed and iron skin. They are sold in the sword shops, armour shops
   and potion shops of Khemetra's Merchants' Quarter and of Ironhill (the buildings are placed in khemetra_build.js and ironhill_shops.js).
   ========================================================================== */
const GEAR=[];
function gw(id,n,t,lv,dmg,hit,req,price,col,eff,d,extra){
  const it=Object.assign({n,k:'weapon',t,ic:t==='Bow'?'bow':t==='Axe'?'axe':t==='Mace'?'mace':'sword',c:col,dmg,hit,req,price,lvl:lv,eff,d:d+` Needs level ${lv}.`,sw:t==='Bow'?.42:.44,gear:1},extra||{});
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
  sword:()=>['cutlass','wyrmfang','thunderaxe','skullcrusher','stormbow','greatsword','executioner','claymore','kingslayer','splitaxe','wolfaxe','maul','headsman','worldaxe','hunterbow','barbedbow','twinbow','warbow','silverbow'].map(id=>[id,1]),
  armour:()=>['drakehelm','wyrmplate','bulwark','ironcap','greathelm','hornhelm','centurion','warlordhelm','brigandine','hauberk','cuirass','lionplate','goldplate','roundshield','kiteshield','spikeshield','towershield','dragonshield'].map(id=>[id,1]),
  potion:()=>[['healdraught',6],['greaterheal',4],['superiorheal',2],['elixir',1],['manadraught',6],['greatermana',4],['supermana',2],['might',3],['swiftness',3],['ironskin',3],['keeneye',3],['antidote',5],['salve',5],['holywater',2],['sleeptea',3]]
};
// the new weapons borrow the painted picture of an older one, recoloured, until they have a painting of their own
function gearTintIcons(){
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
