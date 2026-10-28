/* ==========================================================================
   PLACE 6 OF THE BLIGHTED ROAD: LANTERNREST WAYSTATION (level 9660, rated 87; rooms 9661 the inn The Last Lantern, 9662 the Armoury, 9663 the Stable and Forge, 9664 the Captain's Hall, 9665 the Infirmary, 9666 the Beacon Room; prefix blr / BLR). 90 by 76.
   The one SAFE place on the Blighted Road: the fort of the Oldhaven garrison, a walled coaching inn. The road runs east to west along y 59 to 61 (east gate x 88 back to the Bone Orchard, west gate x 1 on to the Vault of Maldrake, 9670).
   North of the road stands the fort (walls x 18 to 70, y 6 to 46, a gate in the south wall at x 43 to 45): a cobbled yard with a well, stocks, a drill dummy, a stew pot and a supply wagon, rows of tents with refugees, sentries in King Osric's
   colours, and six buildings: the Beacon Tower (21 to 23), the inn (27 to 29), the Captain's Hall (41 to 47), the Stable and Forge (60 to 64), the Armoury (23 to 25 south) and the Infirmary (63 to 65 south). No creature lives inside the walls.
   Outside: the burnt supply wagon (east), the scout's hut (north west), the ruined patrol camp (south west), and the Road-Maw's hollow (south east), where the patrols went.
   People: Captain Eldred Marsh (blr_marsh), Quartermaster Hob Tolliver (blr_tolliver, the army-gear shop), Dunstan Hale the smith (blr_smith, a weapon shop), Dame Hester Pole (blr_inn, the free inn and the teleport stone), Surgeon Ysolde Fenn (blr_surgeon),
   Nell Wick the chandler (blr_nell), Corporal Wynn Pell the signaller (blr_pell), Scout Tam Reed (blr_scout), sentries and refugees. Captain Dace of the Bone Orchard patrol lies in the infirmary once he is freed.
   Quests: blq54 Bread for the Garrison, blq55 Medicine for the Infirmary, blq56 Torches for the Walls (the three supplies), blq57 The Patrols That Never Came Back (kill the Road-Maw, take back the patrol flag), blq58 The Lost Scout,
   blq59 The Signal Beacon (lamp oil and flint, light it); hand-ins of blq51 (the Lost Patrol) and blq53 (the cask) are here too. The Garrison Reserve (second stock) opens when all three supplies are done.
   Flags: G.flags.bl = {marshMet, maw, mawFlag, scoutFound, scoutHome, oil, flint, beaconLit, wren}.
   ========================================================================== */
const BLR={ID:9660,INN:9661,ARM:9662,FORGE:9663,HALL:9664,INFIRM:9665,BEACON:9666,W:90,H:76};
for(const [id,n] of [[9661,'The Last Lantern'],[9662,'The Garrison Armoury'],[9663,'The Stable and Forge'],[9664,"The Captain's Hall"],[9665,'The Infirmary'],[9666,'The Beacon Room']]){LEVEL_NAMES[id]=n;LEVEL_RATING[id]=87}
if(typeof TELE_KEEP_HI!=='undefined')TELE_KEEP_HI.add(BLR.INN);   // the road's one teleport stone stands in the inn
const BLR_BEACON={x0:21,x1:23,y0:9,y1:12,face:'S',sty:'flint',roof:'slate',wh:3.5,to:BLR.BEACON};
const BLR_INNH={x0:27,x1:29,y0:10,y1:13,face:'S',sty:'timber',roof:'slate',wh:2.4,to:BLR.INN};
const BLR_HALLH={img:'wl_bldg1_1',x0:41,x1:47,y0:9,y1:13,w:7.2,wh:2.6,to:BLR.HALL};
const BLR_BARN={img:'wl_bldg1_5',x0:60,x1:64,y0:9,y1:13,w:5.2,wh:2.4,to:BLR.FORGE};
const BLR_ARMH={x0:23,x1:25,y0:24,y1:27,face:'S',sty:'flint',roof:'slate',wh:2.4,to:BLR.ARM};
const BLR_INFH={x0:63,x1:65,y0:24,y1:27,face:'S',sty:'white',roof:'thatch2',wh:2.4,to:BLR.INFIRM};
const blrF=()=>blF();
/* ---------- things carried ---------- */
ITEMDEF.bloil={n:'Cask of Lamp Oil',k:'quest',t:'Quest item',ic:'potion',c:'#d8b050',stack:1,price:0,sw:1.5,d:'A small sealed cask of lamp oil, rescued from the burnt supply wagon. The beacon at Lanternrest is dry. Take it to Corporal Pell.'};
ITEMDEF.blflint={n:'Patrol Flint and Steel',k:'quest',t:'Quest item',ic:'ore',c:'#9098a0',stack:1,price:0,sw:.2,d:'A flint and a steel striker in an oilcloth, from the ruined camp of a lost patrol. The beacon at Lanternrest has no spark. Take it to Corporal Pell.'};
ITEMDEF.blpatrolflag={n:'Patrol Colours',k:'quest',t:'Quest item',ic:'book',c:'#5a78b8',stack:1,price:0,sw:.3,d:'A torn blue flag with the crown of King Osric, rolled round a broken staff. It was the colours of the patrols that went out from Lanternrest and did not come back. Captain Marsh will want it.'};
ITEMDEF.blgarrisonring={n:"Garrison Signet",k:'ring',t:'Ring',ic:'ring',c:'#7090d0',price:0,lvl:87,pas:{ward:18,dodge:.06,regen:.7,mpRegen:.4},int:5,hp:90,rar:1,sw:.1,d:'A heavy signet ring stamped with the crown of King Osric and a lantern, given by Captain Marsh to those the garrison owes. Adds 5 Intelligence and 90 health, every blow on the wearer is 18 lighter, enemies miss 6% more, and wounds and weariness close steadily. Needs level 87.'};
ITEMDEF.blbeaconring={n:"Beacon-Keeper's Ring",k:'ring',t:'Ring',ic:'ring',c:'#e8b848',price:0,lvl:87,pas:{ward:17,dodge:.07,regen:.8,mpRegen:.5},int:6,hp:80,rar:1,sw:.1,d:'A ring of bright brass worked in the shape of a flame, worn by the keepers of the beacon at Lanternrest. Adds 6 Intelligence and 80 health, every blow on the wearer is 17 lighter, enemies miss 7% more, and wounds and weariness close steadily. Needs level 87.'};
ITEMDEF.blscoutring={n:"Scout's Lucky Thimble",k:'ring',t:'Ring',ic:'ring',c:'#b8b8c0',price:0,lvl:87,pas:{ward:16,dodge:.08,regen:.6,mpRegen:.4},int:4,hp:70,rar:1,sw:.1,d:'A steel thimble on a cord, worn for luck by a scout who has been lucky exactly once. Adds 4 Intelligence and 70 health, every blow on the wearer is 16 lighter, enemies miss 8% more, and wounds and weariness close steadily. Needs level 87.'};
/* ---------- the Road-Maw: the thing that ate the patrols ---------- */
Object.assign(ENEMY_DEF,{
  blmaw:{name:'The Road-Maw',hp:540,dmg:[12,19],hit:.9,w:blWw('guardB_2',2.4),img:'wwi_abom',xp:840,gold:[0,0],speed:1,verb:'swallows',boss:true,aboveParty:0,bl:1,still:1,glow:.1,wake:'The mound of earth in the hollow splits open. It is all mouth, and the mouth is full of buckles and helmets.'}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('blmaw');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('blmaw');
if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.blmaw=[3600,4400];
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^blmaw/,'foodpoison',.3]);
ENEMY_DEF.blmaw.act=e=>gyBossAct(e,{moves:[
  {every:5,all:true,mult:.5,txt:'The Road-Maw heaves, and a foul grey slurry full of buttons and bone breaks over the whole party.',col:'#b8c890',verb:'Slurry burns'},
  {every:3,mult:1.15,near:2,affl:'foodpoison',txt:'The Road-Maw gulps at the nearest hero, and the great jaws close like a gate.',col:'#c8d8a0',verb:'The jaws crush'}]});
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;const r=_h.apply(this,arguments);
  try{if(was&&e.hp<=0&&e.t==='blmaw'){const F=blrF();if(!F.maw){F.maw=1;F.mawFlag=1;if(!bagAdd(mkItem('blpatrolflag')))G.items.push({k:'blpatrolflag',x:Math.round(e.x),y:Math.round(e.y),taken:false});msg('The Road-Maw collapses into a heap of black earth. In it lies a torn blue flag, still rolled on its staff. You take it.','#ffe36a');sfx('win')}}}catch(x){console.error(x)}
  return r}}
/* ---------- art: tents, stocks, a stew pot, banners (filters over the painted Wenlock and witch wood pieces) ---------- */
function blrArt(){
  if(BLR._art)return;
  const mk=(key,src,filter,h)=>{if(!src||!src.width)return false;const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');try{x.filter=filter}catch(e){}x.drawImage(src,0,0);IMG[key]=c;NPC_H[key]=h;return true};
  if(!mk('blr_tent0',IMG.wl_prop1_3,'sepia(.75) saturate(.55) brightness(.72) hue-rotate(-12deg)',1.9))IMG.blr_tent0=null;
  if(!mk('blr_tent1',IMG.wl_prop1_3,'sepia(.5) saturate(.5) brightness(.6) hue-rotate(160deg)',1.7))IMG.blr_tent1=null;
  if(!mk('blr_stocks',IMG.wl_prop1_2,'sepia(.5) saturate(.7) brightness(.8)',1.15))IMG.blr_stocks=IMG.wl_prop1_2;
  if(!mk('blr_stew',IMG.propsA_0||IMG.ww_cauldron,'hue-rotate(-95deg) saturate(.85) brightness(.9)',.9))IMG.blr_stew=IMG.ww_cauldron;
  BLR._art=1}
function blrBanner(){return IMG.wl2_hall_0?'wl2_hall_0':IMG.kh_throne1_1?'kh_throne1_1':null}
/* ---------- the people ---------- */
const blrMen=(id,name,face,lines,o)=>khNpc(id,name,face,()=>yrLines(id,lines),o);
khNpc('blr_marsh','Captain Eldred Marsh, of Oldhaven','kh_ohsold1_1',()=>{
  const F=blrF();
  if(!F.marshMet){F.marshMet=1;F.wren=1;return say('A tall man in a blue tabard, the crown of King Osric on his chest, looks up from a table of maps. He has not slept in some time. "Oldhaven sent us, King Osric’s foot, forty of us, to hold this fort and keep the road to Sale open. That was a year ago. The road closed behind us, and the road ahead went bad, and here we are. You came from the east? Then you are the first living face we have had in two months. Sit. Ask me what you like."',[['Have you seen a woman called Wren?',()=>blrWren()],['What is this place?',()=>blrAbout()],BYE])}
  return say('Captain Marsh is bent over his maps, with a cold cup at his elbow. "Yes? Ask. I have nothing else to do but be asked."',[['Have you seen a woman called Wren?',()=>blrWren()],['What is this place?',()=>blrAbout()],['What is on the road ahead?',()=>blrAhead()],BYE])});
function blrWren(){return say('"Wren. A small woman with a pack, and no good sense. Yes. Weeks ago. She came in at the east gate with an old man, Aldous Wend, who looked as if he had been dug up and given a stick. They slept two nights in the inn. She would not say why they were going to Sale. He would not stop looking west. I told them the road was blighted, and she said it was not her first blight. They left at dawn. I sent no escort. I had none to send."',[['Did she leave anything?',()=>say('"A message with the innkeeper, I think. She said: if anyone comes after us, tell them the pact is not what it sounds like. Then she laughed, and did not look as if she thought it was funny. I do not know what the pact is. I did not ask. You learn, in a fort, not to ask things you cannot help with."',[BYE])],BYE])}
function blrAbout(){return say('"Lanternrest Waystation. A coaching inn for the Sale road, once, with a stable and a smithy. Oldhaven walled it, and we made it a fort. The walls are good. The garrison is thin. We are short of food, medicine and torches, and nobody has come through the gate that was not a refugee or a corpse. We are the only living place on the road. If you can help us, we would be very glad."',[BYE])}
function blrAhead(){return say('"The road west is blighted. You will have seen it in the east: dead hedges, the pale light, the crows. It gets worse. West of here lies the Vault of Maldrake, a barrow hill with a crypt under it, and past that an abbey that tolls its dead up, a mill full of crows, and a bridge with a knight on it. Sale is at the end. Come back here to rest. The beds are free, and the gate is always open."',[BYE])}
khNpc('blr_tolliver','Quartermaster Hob Tolliver','kh_ohsold1_4',d=>{
  const F=blrF(),st=blrStage();
  return say(['"Garrison stores. Everything here is army issue, signed for and counted. Do not ask me for a discount. I would give you one, and then I would have to count it as a loss, and I do not have a column for that."','"Mind the mail. It was made for men, and men who ate regularly. Fit is a matter of belts."','"I count what we have every morning. It does not take long."'][(F.rounds||0)%3],
    [['Browse the garrison stores',()=>{G.talk=null;blrOpenStores(d);return null}],BYE])},{sc:1});
khNpc('blr_reserve','The garrison reserve','gy_chest',d=>{
  if(blrStage()<3)return say('A locked iron chest with the king’s crown stamped on the lid, and a card tacked to it in Tolliver’s hand: GARRISON RESERVE. NOT UNTIL THE STORES ARE FULL. FOOD, MEDICINE AND TORCHES. SIGNED, H. TOLLIVER.',[BYE]);
  return say('The iron chest stands open, and Tolliver has pinned a new card to it: GARRISON RESERVE. SIGNED FOR. SELECT WITH CARE. Inside, in sacking, is the best of what Oldhaven sent.',[['Look through the reserve.',()=>{G.talk=null;blrOpenReserve(d);return null}],BYE])});
khNpc('blr_smith','Dunstan Hale, smith','kh_ohfolk4_1',d=>say('"Hale, smith to the garrison, and to the stable, and to anyone with a hoof or a hand. I do blades for the fort and shoes for the horses. I have the same hammer for both, and it is a great economy."',[['Browse the blades',()=>{G.talk=null;blrOpenSmith(d);return null}],BYE]));
khNpc('blr_inn','Dame Hester Pole, innkeeper','kh_ohfolk3_1',d=>say('"Welcome to The Last Lantern. Do not say last. It is the last on the road, yes, but we do not say it. A bed is free for any who walk in alive, by the captain’s order, and the soup is on the hob. The teleport stone is in the corner of the common room, if you have woken one elsewhere. It is rather warm. I think it likes the fire."',
  [['Take rooms (free)',()=>{G.talk=null;restParty(true);return say('You sleep behind a barred door in a real bed, and the lantern in the window burns all night. Everyone wakes healed and fed.',[BYE])}],['Buy a meal',()=>{G.talk=null;openShop(d,[['ale',16],['pottage',12],['pie',8],['bread',10],['sausage',8],['cheese',6]].filter(r=>ITEMDEF[r[0]]),'The Last Lantern');return null}],['Any news?',()=>say(BLR_NEWS[(G.rounds||0)%BLR_NEWS.length],[BYE])],['Did Wren leave a message?',()=>say('"She did. She said: tell whoever comes after that the pact is not what it sounds like. She tipped me a silver coin, a pale one. I do not spend it. It sits on the shelf and I look at it. It looks back."',[BYE])],BYE]));
const BLR_NEWS=['"A refugee came in last week from Gallowmere and swears the drowned there wave at you. He is under the table. He does not mind it."','"The soup is cabbage, and then it is cabbage, and then, on festival days, it is cabbage with a bone. I am saving the bone."','"The captain does not sleep. He walks the wall until three, and then he sits in the hall until dawn. He says it is a duty. I think he is waiting for a patrol."'];
khNpc('blr_surgeon','Surgeon Ysolde Fenn','kh_ohfolk5_1',()=>yrLines('blr_surgeon',[
  'I have seven in the infirmary, and fourteen in the camp who ought to be. A bandage does not need to be sterile if you have no other bandage. That is the first rule of field medicine, and I hate it.',
  'The road wounds do not heal clean. The wound goes grey and stays grey. Salve helps. Antidote helps with the other thing. Mostly I hold hands, and boil water, and curse.',
  'If you see Captain Dace, tell him to stop trying to stand up. He is a very good patient in the sense that he is exactly as bad as I expected.']));
khNpc('blr_nell','Nell Wick, chandler','kh_ohfolk2_3',()=>yrLines('blr_nell',[
  'I made candles in Gallowmere for forty years, and then there was no more tallow and no more Gallowmere. I came up the road with a bag of wicks and nothing to put on them. The fort has the torches. The torches are for the walls. I understand. I still sit here and make wicks.',
  'A tallow candle is a good, honest thing. It burns down and does not complain. People do not think of it, until the dark has a face.',
  'The light on the wall is the only thing that keeps the road-crows back. That is why the torches are the first to go short, and the last thing we can spare.']));
khNpc('blr_pell','Corporal Wynn Pell, signaller','kh_ohsold1_2',()=>yrLines('blr_pell',[
  'The beacon on the tower used to burn all night, a big cresset of oil, and you could see it from the Bone Orchard on a clear night. The last of the oil went with the supply wagon on the road, and the flint went with the lads at the camp. Now it is a bowl of cold iron, and I sit by it, and the road is dark.',
  'A beacon says: we are still here. That is all it says. You would be surprised how much that matters to people who are walking in the dark.',
  'I have one flag, and the wind took the other. I am a signaller with half a flag.']));
khNpc('blr_scout','Scout Tam Reed','kh_ohfolk1_3',()=>{
  const F=blrF();
  if(!F.scoutFound){F.scoutFound=1;sfx('key');return say('A thin young man in a scout’s grey cloak crouches inside the old waymarker hut with a knife in his hand and his back to the wall. He has not eaten in some days. He looks at you, and at the knife, and puts the knife away very slowly. "You are alive. I thought you were the other thing. Lanternrest is that way, isn’t it. I got turned round in the fog. Can you tell me which way is the gate? I think I lost my nerve about nine days ago."',[['Come with us. We will take you to the gate.',()=>blrScoutHome()],['Stay where you are.',()=>null]])}
  if(!F.scoutHome)return say('"Please. The gate. I will keep behind you and not say anything stupid."',[['Come with us. We will take you to the gate.',()=>blrScoutHome()],BYE]);
  return yrLines('blr_scout',['"I got a hot meal and a bed, and the captain did not shout. I am a very lucky scout."','"I think I will stay in the fort, now, for a bit. Possibly the rest of my life."'])},{sc:.95});
function blrScoutHome(){
  const F=blrF();F.scoutHome=1;sfx('win');G.talk=null;
  try{const L=LEVELS[BLR.ID];if(L)for(const d of L.decor)if(d.npc==='blr_scout'&&d.hutScout){d.found=true;d.block=false}}catch(e){}
  try{for(const d of G.decor)if(d.npc==='blr_scout'&&d.hutScout){d.found=true;d.block=false}}catch(e){}
  try{const L=LEVELS[BLR.ID];if(L&&!L.decor.some(d=>d.npc==='blr_scout'&&!d.hutScout))blrScoutIn(L.decor)}catch(e){console.error(e)}
  msg('Tam Reed hurries off down the road, and you hear the gate guard cheer him in.','#ffe36a');return null}
function blrScoutIn(decor){const kp=KH_KEEPERS.blr_scout;decor.push({k:khFaceKey(kp.face),x:30,y:34,block:false,walk:true,npc:'blr_scout',sc:kp.sc||1})}
/* Captain Dace in the infirmary once he is free */
function blrDaceAdd(){
  const L=LEVELS[BLR.INFIRM];if(!L||!blrF().daceFree)return;
  if(!L.decor.some(x=>x.npc==='bo_dace')){const kp=KH_KEEPERS.bo_dace;L.decor.push({k:khFaceKey(kp.face),x:7,y:3,block:true,solid:1,npc:'bo_dace',sc:kp.sc||1})}}
yrHook('bo_dace',d=>LEVEL===BLR.INFIRM?yrLines('bo_dace_in',['"Marsh has been. He sat there for an hour and did not say a word and then he said, you have not lost them, they were never lost, they were pinned. I think that was kind. I think it was."','"Tell the lady surgeon I am not in the least bit dizzy. I am just standing very quickly."','"The orchard. I can still hear the bell. They say it stopped, and I can still hear it. Perhaps it only stopped for everybody else."']):null);
/* sentries, soldiers and refugees: each a person with something to say */
blrMen('blr_gate1','Sentry Aldis Roke, at the gate','kh_ohsold1_0',['"Halt. Oh, you are alive. Pass. Mind the lamp, it is the only thing between this wall and the dark."','"Road ahead is blighted, friend. Dead hedges, pale lights, things in the ditch that were people. Stay on the road, do not drink from anything, do not answer anything that calls you by name. That is the whole manual."','"I have stood this gate for eleven months. I think I have said that every day, to nobody."']);
blrMen('blr_gate2','Sentry Mags Pellew','kh_ohsold1_5',['"We turned away eleven carts in the first month, and let in nine hundred people in the second. Funny how that goes. A fort is a gate, and a gate is a decision."','"The captain says we are not a prison. We are a promise. I said, to whom? He said, to whoever is left."']);
blrMen('blr_wall1','Sentry Tobin Hart, on the wall','kh_ohsold1_3',['"I walk the wall from the beacon tower to the stable and back, a hundred and four paces. I have worn a groove."','"At night the road lights up with pale lamps, a long way off, in a line, like somebody is carrying them west. I do not look. That is rule one."']);
blrMen('blr_wall2','Sentry Dill Cobb, on the wall','kh_oqmen_2',['"I am not afraid. I am simply watching very carefully, and very close to the wall."','"The torches are the only thing that matter. A wall is a thing you stand behind. A torch is a thing you stand in front of."']);
blrMen('blr_drill','Sergeant Bram Oakes, drillmaster','kh_ohsold1_2',['"Shield high! Spear low! Heart, you idiot, in the middle! That is a dummy, not your mother-in-law!"','"We drill every morning. The recruits are all cooks and farriers. They are improving. One of them hit the dummy on Tuesday."']);
blrMen('blr_cook','Cook Peg Harrow','kh_ohfolk2_2',['"Cabbage. I had a pig once. He was called Colonel. We are not to say what became of him."','"The stew is for everyone: soldiers, refugees, the dog, the other dog. Eat at the pot, not in the tents. It keeps the tents tidy."']);
blrMen('blr_stable','Ostler Joss Marlow','kh_ohfolk1_5',['"Nine horses left of thirty. They do not like the road. The horses never did like the road. They are cleverer than the army."','"I sleep in the straw with the big grey. He is called Lord Pettigrew, which I did not choose."'],{sc:1});
const BLR_REF=[
  ['blr_ref1','Old Gaffer Ham, refugee','kh_ohfolk2_3',['"I walked from Gallowmere. I am eighty-one. The fort took me in. I told the captain I was not worth the bread. He said, nobody is, and gave me the bread."','"I have a granddaughter in Sale. At least I did. I am going to find her, once I can stand up straight."']],
  ['blr_ref2','Mistress Tansy Dunn, refugee','kh_ohfolk3_2',['"We had a farm near the Church of the Hollow Saint. We left when the bells started ringing backwards. My husband carried the cow. We lost the cow."','"The soldiers are kind. Very kind. They are just so tired that kindness comes out of them like a yawn."']],
  ['blr_ref3','Young Alfie Dunn','kh_ohfolk1_4',['"I am going to be a soldier. Sergeant Oakes says I have the stance. I have never had a stance before, so I think I am very good."','"I have a stick. It is my sword. It has killed seven imaginary crows."']],
  ['blr_ref4','Brother Anselm, a monk of the Hollow Saint','kh_ohfolk5_4',['"I carried the Saint’s relic from the church. The church bells began to toll by themselves, and I thought, that is enough of that. I am saying the office in the camp. People attend. It is mostly the dog."','"There is a prayer for every day, in my order. For today it is: Lord, let it be dull."']],
  ['blr_ref5','Mistress Orla Pike, refugee','kh_ohfolk3_4',['"I do the washing. It is a small thing, and everyone is grateful, and no one has given me a clean shirt since the spring."','"I have heard that Sale has a market, and the market has a baker, and the baker has an oven. I think about that oven a great deal."']],
  ['blr_ref6','Wat Ferrier, refugee','kh_ohfolk4_5',['"Drover. I had a hundred sheep. I have a very good whistle, now, and nobody to whistle at."','"If you go west, there is a hill with graves in it. Do not go in the front. Everybody goes in the front."']]];
for(const r of BLR_REF)blrMen(r[0],r[1],r[2],r[3]);
/* ---------- the quests ---------- */
function blrQ(id,title,who,steps,reward,extra){const q=yrQ(id,title,who,steps,reward,extra);QAREA[id]=BL.REGION;return q}
blrQ('blq54','Bread for the Garrison','Quartermaster Hob Tolliver',[
  ['Bring twelve loaves of bread to Quartermaster Tolliver at Lanternrest. You can buy them in Wenlock, or from bakers on the road.',()=>bagCount('bread')>=12,['blr_tolliver']]],
  {gold:2400,xp:20000,items:['potion6','potion6'],take:{bread:12}});
blrQ('blq55','Medicine for the Infirmary','Surgeon Ysolde Fenn',[
  ['Bring six cleansing salves and four antidotes to Surgeon Fenn in the infirmary at Lanternrest.',()=>bagCount('salve')>=6&&bagCount('antidote')>=4,['blr_surgeon']]],
  {gold:2600,xp:22000,items:['potion6','potion6'],take:{salve:6,antidote:4}});
blrQ('blq56','Torches for the Walls','Nell Wick, chandler',[
  ['Bring fifteen torches to Nell Wick in the camp at Lanternrest, for the walls.',()=>bagCount('torch')>=15,['blr_nell']]],
  {gold:2400,xp:20000,items:['potion6','potion6'],take:{torch:15}});
blrQ('blq57','The Patrols That Never Came Back','Captain Eldred Marsh, of Oldhaven',[
  ['Find what ate the patrols: the Road-Maw, in a hollow south east of the fort, off the road. Kill it, and take back the patrol colours.',()=>!!blrF().maw,['blr_mawspot']]],
  {gold:4500,xp:38000,items:['blgarrisonring','potion6','potion6']});
blrQ('blq58','The Lost Scout','Captain Eldred Marsh, of Oldhaven',[
  ['Find Scout Tam Reed, who went out nine days ago and did not come back. Look in the old waymarker hut north west of the fort, off the road, and tell him the way home.',()=>!!blrF().scoutHome,['blr_scout']]],
  {gold:3200,xp:27000,items:['blscoutring','potion6']});
blrQ('blq59','The Signal Beacon','Corporal Wynn Pell, signaller',[
  ['Find lamp oil in the burnt supply wagon on the road east of the fort, and flint and steel in the ruined patrol camp south west of it.',()=>!!(blrF().oil&&blrF().flint)||!!blrF().beaconLit,['blr_wagon','blr_camp']],
  ['Light the beacon in the Beacon Room of the tower, in the north west of the fort.',()=>!!blrF().beaconLit,['blr_beacon']]],
  {gold:4000,xp:34000,items:['blbeaconring','potion6','potion6']});
/* hand-in of the Bone Orchard's quests (blq51, blq53) here: the mark is a green question mark only when the quest is ready */
blGiveOpt('blr_marsh','blq51',()=>qSt('blq51')==='active'&&qReady('blq51'),{
  offer:'',accept:'',remind:()=>'',
  ready:'Marsh looks at the three brass crests in your hand for a long time. Then he turns them over, one at a time, and reads the numbers on the back. "Wyke. Fordham. Pell." His voice does not change. "She was my sister’s girl. Is Dace alive?"',
  thanks:'He sits down, slowly. "Alive. Pinned to a wall, and alive. You have brought me two things I did not expect, and I do not know which is the worse. Thank you. Take this. It is not enough."',
  after:'Marsh keeps the three crests on his table, beside the lamp.'});
blGiveOpt('blr_tolliver','blq53',()=>qSt('blq53')==='active'&&qReady('blq53'),{
  offer:'',accept:'',remind:()=>'',
  ready:'Tolliver stares at the sealed cask as if it were a ledger that had added itself up. "From the orchard? That is a Bone Orchard cask, with the Cask brand. That is, that was, the best cider on the road. Where did you get it?"',
  thanks:'He breaks the wax seal with a thumb, sniffs, and shuts his eyes. "It is good. It is a good cider. Do you know how long it has been since I tasted something that was not cabbage? I will put it in the infirmary. For the medicinal use. And possibly for me."',
  after:'Tolliver keeps a mug behind the counter. He says it is a medical instrument.'});
blGiveOpt('blr_tolliver','blq54',()=>true,{
  offer:'The stores are empty of bread. I can stretch it for three days, and after that the soldiers eat cabbage and the refugees eat the soldiers’ cabbage. A dozen loaves, a proper dozen, bought or baked, would give the garrison a week. I would be most grateful, and I would sign for it in triplicate.',
  accept:'Twelve loaves. Buy them in a town if you can, Wenlock has bakers, or take them from the road if you find any. I will count them when you bring them. I will count them twice.',
  remind:()=>'Twelve loaves of bread. You have '+Math.min(12,bagCount('bread'))+'.',
  ready:'Twelve loaves. I do not believe it. Let me count them. One, two, three, and so on.',
  thanks:'Right. Twelve. Signed for. The garrison will eat well for a week, and I will remember who made it so.',
  after:'The loaves lasted nine days. Some of them were shared.'});
blGiveOpt('blr_surgeon','blq55',()=>true,{
  offer:'I have seven bad wounds in the infirmary that will not close, and I have not a drop of salve left to put on them. A road wound needs cleansing salve, six jars would do, and antidote for the ones the thing in the ditch poisoned, four. You can buy both from any decent apothecary. Will you?',
  accept:'Six salves and four antidotes, as quickly as you can. I will keep them going on boiled water until then.',
  remind:()=>'Six cleansing salves and four antidotes. You have '+Math.min(6,bagCount('salve'))+' salves and '+Math.min(4,bagCount('antidote'))+' antidotes.',
  ready:'Oh, those are the real thing. In bottles. With corks.',
  thanks:'You have saved three lives, and I am not exaggerating, and I am not going to say which. I will have a word with the captain about you.',
  after:'The ward is quiet now. Two of them are asking for dinner.'});
blGiveOpt('blr_nell','blq56',()=>true,{
  offer:'The walls burn torches all night, and the torches are the only thing that keeps the road-crows from the parapet. We are down to eight. A good torch lasts four hours. Fifteen torches would keep the walls lit for a week. Could you find fifteen? I will make the wicks.',
  accept:'Fifteen torches. They are cheap in any town. Bring them to me, and I will see they reach the wall.',
  remind:()=>'Fifteen torches. You have '+Math.min(15,bagCount('torch'))+'.',
  ready:'Fifteen torches. Real ones. Oh, I could weep. I will not. I have a reputation.',
  thanks:'The wall will blaze tonight. The lads will think the captain has gone mad. Thank you. Take this, with my blessing.',
  after:'The walls have been lit every night since. It looks very fine from the road.'});
blGiveOpt('blr_marsh','blq57',()=>true,{
  offer:'Seven patrols have gone out from this fort, and not one has come back. Six men, ten men, twelve. We found their tracks, and the tracks went to a hollow south east of here, off the road, and ended there. A thing lives in it, and it is eating my soldiers. I have not the strength to go. Will you find it, and kill it, and bring me back the colours the last patrol carried?',
  accept:'Thank you. The hollow is south east of the fort, off the road, where the ground drops. Go with all four of you, and go well fed. When you hear it, it is already too late to turn round.',
  remind:()=>blrF().maw?'You have the patrol colours. Bring them to me.':'The hollow is south east of the fort, off the road. Kill the thing that ate the patrols.',
  ready:'You have them. The colours of the seventh patrol.',
  thanks:'It is dead. I will tell the garrison tonight. Thank you, for the six, and the ten, and the twelve. They are not coming home. But now we know. Take this signet. It was my captain’s.',
  after:'The garrison sleeps better. The captain looks a year younger.'});
blGiveOpt('blr_marsh','blq58',()=>qSt('blq57')==='done',{
  offer:'One more thing, and I would be ashamed to ask, but I will. A scout went out nine days ago to look at the road to the west, and did not come back. Tam Reed. He is nineteen. I think he is hiding, and I think he is lost. There is an old waymarker hut north west of the fort, off the road. Would you look in it?',
  accept:'Thank you. If he is there, tell him the gate is open, and the captain is not angry. He will not believe the second part.',
  remind:()=>blrF().scoutFound?'Tam Reed is in the waymarker hut, north west of the fort. Tell him the way home.':'The old waymarker hut north west of the fort, off the road.',
  ready:'He is back. I saw him come in. He is eating three bowls of cabbage.',
  thanks:'I did not think I would see him again. Nineteen, and he lasted nine days alone on that road. I should make him a sergeant. Take this. It was his luck, and now it is yours.',
  after:'Tam Reed is on the wall tonight. He asked for the east end, where it is closest to the stew.'});
blGiveOpt('blr_pell','blq59',()=>true,{
  offer:'The beacon on the tower has been dark for a month. Oil is gone, flint is gone. If it were lit, every poor soul walking the road would see it and know there was a roof. There was a cask of lamp oil in the supply wagon that burnt on the road east of the fort. There is flint and steel in the ruined camp of the third patrol, south west, off the road. Bring me both, and then we will light it, you and I.',
  accept:'Oil from the wagon, east. Flint from the camp, south west. Then up the tower, to the Beacon Room. The beacon will light the whole road.',
  remind:()=>blrF().oil&&blrF().flint?'You have the oil and the flint. Light the beacon in the Beacon Room.':'The oil is in the burnt wagon east of the fort, and the flint is in the ruined patrol camp south west, off the road.',
  ready:'It is lit. Look at it. It is blazing.',
  thanks:'The Bone Orchard can see it, I think. Gallowmere can. Every poor soul on the road can. Take this. It is the keeper’s ring, and you are the keeper tonight.',
  after:'The beacon burns all night. A refugee came to the gate this morning and said she followed the light for two days.'});
/* ---------- the objects ---------- */
khNpc('blr_wagon','A burnt supply wagon','wl_prop1_5',d=>{
  const F=blrF();
  if(F.oil||F.beaconLit)return say('The burnt wagon sits on its axle, with the tarpaulin gone to ash. The oil barrel is gone from the back.',[BYE]);
  if(qSt('blq59')!=='active')return say('A supply wagon, burnt black, with two spokes left in one wheel. A barrel lies on its side in the ashes. A soldier’s tabard is still caught in the wheel, and the colour of it has run.',[BYE]);
  return say('A supply wagon, burnt black, with two spokes left in one wheel. A small barrel lies on its side in the ashes, and it has not burnt. It is sealed, and it sloshes. The label says LAMP OIL, FOR THE BEACON, LANTERNREST.',[['Take the cask of lamp oil.',()=>{F.oil=1;if(!bagAdd(mkItem('bloil')))G.items.push({k:'bloil',x:G.P.x,y:G.P.y,taken:false});sfx('key');msg('You take the cask of lamp oil.','#ffe36a');return null}],BYE])});
khNpc('blr_camp','A ruined patrol camp','gy_chest',d=>{
  const F=blrF();
  if(F.flint||F.beaconLit)return say('The ruined camp: three collapsed tents, a cold fire, a row of grey bones in blankets. The oilcloth bundle is gone from the chest.',[BYE]);
  if(qSt('blq59')!=='active')return say('A ruined patrol camp: three collapsed tents, a cold fire ring, and a row of grey bones under blankets, laid out neatly by someone who survived long enough to do it. A small chest stands by the fire.',[BYE]);
  return say('A ruined patrol camp: three collapsed tents, a cold fire ring, and a row of grey bones under blankets, laid out neatly by someone who survived long enough to do it. A small chest stands by the fire, with a bundle of oilcloth on top.',[['Take the oilcloth bundle.',()=>{F.flint=1;if(!bagAdd(mkItem('blflint')))G.items.push({k:'blflint',x:G.P.x,y:G.P.y,taken:false});sfx('key');msg('You take the flint and steel.','#ffe36a');return null}],BYE])});
khNpc('blr_beacon','The beacon','hearth',d=>{
  const F=blrF();
  if(F.beaconLit)return say('The beacon burns in its iron cresset, a column of clean gold fire, and the Beacon Room is as bright as noon. Through the arrow slit you can see the whole road, west to the hills and east towards the orchard.',[BYE]);
  if(F.oil&&F.flint&&bagCount('bloil')>0&&bagCount('blflint')>0)return say('A great iron cresset, cold, on a stone plinth in the middle of the tower room. A pipe of oil runs to it from a stone tank. The tank is dry. You have oil and flint.',[['Pour the oil, strike the flint.',()=>{bagRemove('bloil',1);bagRemove('blflint',1);F.beaconLit=1;sfx('win');G.shake=.3;msg('The beacon catches with a soft thump, and the whole tower fills with gold light. Across the dark land to the east, a second light, very small, answers from the hills.','#ffe9a0');
      try{const L=LEVELS[BLR.BEACON];if(L&&L._bl)L._bl.lcol['4,3']=[1.6,1.2,.6]}catch(e){}return null}],BYE]);
  return say('A great iron cresset, cold, on a stone plinth in the middle of the tower room. A pipe of oil runs to it from a stone tank. The tank is dry, and there is no spark in the room.',[BYE])});
khNpc('blr_mawspot','The Road-Maw’s hollow','bl_barrow',()=>say('A round hollow in the ground south east of the fort, a stone’s throw off the road. The earth is trampled flat all round it, and mixed with it are buckles, buttons, a broken bugle, and a very great many boot-prints that go in and none that come out.',[BYE]));
khNpc('blr_hut','The waymarker hut','bl_hut',()=>say('An old waymarker hut of the Road Wardens, with a low door. Somebody is inside, breathing very quietly.',[BYE]));
khNpc('blr_dummy','A drill dummy','ww_totem',()=>say('A scarecrow pole of the garrison, with a helm on top and a great many dents. Somebody has painted a face on the helm. It is smiling. The sergeant’s mother-in-law, perhaps.',[BYE]));
khNpc('blr_well','The garrison well','ww_well',()=>say('A deep stone well in the middle of the yard, with a new rope and a clean bucket. The water is cold, and it tastes of iron and stone and nothing else. A board nailed to the roof says: BOILED, THEN DRUNK. BY ORDER.',[BYE]));
khNpc('blr_stocks','The garrison stocks','blr_stocks',()=>say('A pair of wooden stocks, with a notice: FOR THEFT FROM THE STORES. TWO HOURS. The padlock is rusty, and the wood is new. It has been used exactly once, on a very sorry sergeant, who was only taking a little cabbage.',[BYE]));
khNpc('blr_stew','The stew pot','blr_stew',()=>say('An iron cauldron the size of a barrel over a good fire, full of a thick brown stew with a ladle standing in it. The ladle is on a chain. The queue for it goes round the well twice. It is, by a margin, the most hopeful thing in the Blighted Lands.',[BYE]));
khNpc('blr_wagon2','The supply wagon','wl_prop1_5',()=>say('The garrison’s last supply wagon, drawn up under the wall, with the shafts down. It is empty. A chalk tally is scrawled on the side: LAST LOAD, 214 DAYS AGO.',[BYE]));
khNpc('blr_tent','A tent','blr_tent0',d=>say(['A soldier’s bell tent, patched. A bedroll, a boot, a letter from home, half written.','A refugee family’s tent: a blanket, a pan, a doll with one eye. A child’s drawing of a house is pinned inside.','A tent with a cat in it. The cat looks at you. It is the best-fed living creature on the road.','A tent with a prayer on the flap in chalk: LORD, LET IT BE DULL.'][((d&&d.x||0)+(d&&d.y||0))%4],[BYE]));
khNpc('blr_notice','The notice board','greensign',()=>say('A notice board by the gate. RULES OF LANTERNREST, BY ORDER OF THE CAPTAIN: 1. THE GATE IS OPEN. 2. NO DRAWN WEAPON IN THE YARD. 3. ANYONE WHO CAN LIFT A BUCKET LIFTS ONE. 4. THE SOUP IS FOR EVERYONE. 5. DO NOT FEED THE CROWS. 6. IF IT KNOWS YOUR NAME, DO NOT ANSWER. Underneath, somebody has added: 7. BE KIND. It is in the captain’s hand.',[BYE]));
khNpc('blr_signW','A signpost','greensign',()=>say('A signpost at the west gate. The board reads THE VAULT OF MALDRAKE, to the west, and under it somebody has hung a small second board: LAST LAMP. LAST SOUP. LAST CHANCE TO TURN ROUND.',[BYE]));
khNpc('blr_signE','A signpost','greensign',()=>say('A signpost inside the east gate. The board reads THE BONE ORCHARD, to the east. Below it, in a soldier’s hand: STAY ON THE ROAD. DO NOT SHAKE THE TREES.',[BYE]));
khNpc('blr_signFort','A signpost','greensign',()=>say('A signpost at the foot of the fort lane. The board reads LANTERNREST WAYSTATION, north, with a painted lantern, and below it: KING OSRIC’S GARRISON. ALL WELCOME. NO TOLL. Somebody has added a wobbling heart.',[BYE]));
khNpc('blr_bench','A bench','gy_bench',()=>say('A bench outside the stable, with a carved name on the end of it: PELLEW. Beside it, in a different hand: STILL HERE.',[BYE]));
/* what stock is for sale: gear is read from ITEMDEF (as the Sale shops do), by item level and by how well the garrison has been supplied */
const blrStage=()=>['blq54','blq55','blq56'].reduce((n,q)=>n+(qSt(q)==='done'?1:0),0);
function blrGear(kinds,lo,hi){
  return Object.keys(ITEMDEF).filter(id=>{const d=ITEMDEF[id];return d&&!d.rar&&kinds.includes(d.k)&&(d.price||0)>0&&(d.lvl||1)>=lo&&(d.lvl||1)<=hi}).sort((a,b)=>(ITEMDEF[b].lvl||1)-(ITEMDEF[a].lvl||1)||ITEMDEF[a].price-ITEMDEF[b].price).map(id=>[id,1])}
const BLR_ARMOUR=['shield','head','chest','legs','arms','armor','armour','feet','cloak'];
function blrStores(){
  const st=blrStage(),hi=79+st*3;   // 79, 82, 85, 88
  return blrGear(BLR_ARMOUR,58,hi).slice(0,34).concat([['healdraught',8],['greaterheal',st>=1?6:3],['superiorheal',st>=2?4:0],['antidote',8],['salve',8],['bread',20],['torch',20]].filter(r=>ITEMDEF[r[0]]&&r[1]>0))}
function blrReserve(){return blrGear(BLR_ARMOUR,80,92).slice(0,26).concat([['superiorheal',6],['elixir',5],['supermana',3],['potion6',4]].filter(r=>ITEMDEF[r[0]]))}
function blrSmith(){const st=blrStage(),hi=80+st*3;return blrGear(['weapon'],58,hi).slice(0,30).concat([['torch',20]].filter(r=>ITEMDEF[r[0]]))}
function blrTop(d,rows,name){   // a shop opened before gets the goods of a higher stage added once
  if(!d.contents){openShop(d,rows,name);d.blrSeen={};for(const c of d.contents)d.blrSeen[c.id]=1;return}
  const seen=d.blrSeen||(d.blrSeen=Object.fromEntries(d.contents.map(c=>[c.id,1])));
  for(const r of rows)if(!seen[r[0]]){seen[r[0]]=1;d.contents.push({id:r[0],n:r[1]})}
  openShop(d,rows,name)}
function blrOpenStores(d){blrTop(d,blrStores(),'The Garrison Stores')}
function blrOpenReserve(d){blrTop(d,blrReserve(),'The Garrison Reserve')}
function blrOpenSmith(d){blrTop(d,blrSmith(),"Hale's Forge")}
/* the level */
function blrBuild(p){
  blrArt();
  const C=blKit({id:BLR.ID,W:BLR.W,H:BLR.H,name:p.name,lvl:87,start:{x:84,y:60,f:3},wind:.3});
  const {hs,rows}=C,F=blF(),WARM=C.warm;
  C.hills(.1);C.boundary();C.setF(2,2,BLR.W-3,BLR.H-3,'0');
  C.pth(2,59,87,61,'1');C.flatten(2,5,87,70);
  C.gate('E',60);C.gate('W',60);
  /* the fort: a wall ring two thick, corner towers, a gate in the south wall */
  const wt=C.ch(gyTile('texGrey_1',3.0,{gain:.95,rgb:[.95,.97,.93],tag:'blrw'})),wt2=C.ch(gyTile('texGrey_2',3.0,{gain:.9,rgb:[.95,.95,.92],tag:'blrw2'})),tw=C.ch(gyTile('texGrey_1',4.3,{gain:1.0,rgb:[.98,.98,.94],tag:'blrt'}));
  const FX0=18,FX1=70,FY0=6,FY1=46;
  for(let y=FY0;y<=FY1;y++)for(let x=FX0;x<=FX1;x++){
    if(!(x<FX0+2||x>FX1-2||y<FY0+2||y>FY1-2))continue;
    if(y>=FY1-1&&x>=43&&x<=45)continue;
    const tower=((x<FX0+4||x>FX1-4)&&(y<FY0+4||y>FY1-4))||((x>=40&&x<=42||x>=46&&x<=48)&&y>=FY1-1);
    C.solid(x,y,tower?tw:(hs(x,y,8)<.5?wt:wt2))}
  C.setF(20,8,68,44,'4');
  C.reserve(FX0-1,FY0-1,FX1+1,FY1+1);   // nothing but what is placed by hand
  C.pth(43,14,45,45,'3');C.pth(21,29,67,31,'3');C.pth(43,47,45,58,'3');C.pth(41,47,47,52,'3');
  /* the buildings */
  C.house(BLR_BEACON);C.house(BLR_INNH);C.picHouse(BLR_HALLH);C.picHouse(BLR_BARN);C.house(BLR_ARMH);C.house(BLR_INFH);
  /* the gate: two lamps, two sentries, banners; the notice board */
  for(const x of [42,46]){C.dec('gy_lantern',x,48,{block:true});C.light(x,48,WARM)}
  for(const x of [40,48]){C.dec('gy_lantern',x,44,{block:true});C.light(x,44,WARM)}
  C.person('blr_gate1',42,43,2);C.person('blr_gate2',46,43,2);
  C.dec('greensign',41,41,{block:true,npc:'blr_notice'});
  C.post(44,57,'blr_fortpost',[{n:'LANTERNREST WAYSTATION',d:0},{n:'THE ROAD',d:2}],'blr_signFort','',{i:1});
  const bn=blrBanner();if(bn){for(const [x,y] of [[39,43],[49,43],[43,15],[45,15],[20,29],[68,29]])C.dec(bn,x,y,{block:true,sc:.9})}
  /* the yard: well, stocks, drill dummies, stew pot, the supply wagon, lamps */
  C.thing('ww_well','blr_well',52,20,{sc:1});C.light(52,22,WARM);
  C.thing('blr_stocks','blr_stocks',54,36,{sc:1});C.thing('ww_totem','blr_dummy',34,36,{sc:.8});C.thing('ww_totem','blr_dummy',36,38,{sc:.8});C.thing('blr_stew','blr_stew',38,19,{sc:1});C.light(38,21,WARM);
  C.thing('wl_prop1_5','blr_wagon2',34,22,{sc:1});C.dec('bl_urn',36,23,{block:true,sc:.8});
  for(const [x,y] of [[41,15],[47,15],[30,28],[58,28],[30,33],[58,33],[26,16],[62,16],[26,40],[62,40],[36,26],[52,26]]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,WARM)}
  for(const [x,y] of [[36,31],[52,31],[24,32],[64,32],[44,40]])C.light(x,y,WARM);
  C.dec('kh_ohgard2_1',31,26,{block:true,sc:.9});C.dec('kh_ohgard1_5',57,26,{block:true,sc:.9});C.dec('kh_oqstuff_8',66,29,{block:true});C.dec('kh_oqstuff_9',22,29,{block:true});C.dec('hay',66,17,{block:true,sc:1.2});C.dec('hay',57,17,{block:true,sc:1.1});C.dec('gy_bench',66,14,{block:true,npc:'blr_bench'});
  C.dec('kh_ohgard2_3',29,19,{block:true,sc:.9});C.dec('kh_ohgard2_1',31,17,{block:true,sc:.9});
  /* wall stairs and sentries (the wall walk is the top of the wall: its stairs and the men beside them) */
  for(const [x,y] of [[22,15],[66,15],[22,40],[66,40],[44,9]]){C.dec('gy_stair',x,y,{block:true,sc:.75})}
  C.person('blr_wall1',24,41,2);C.person('blr_wall2',64,41,2);
  /* tents: rows of soldier tents in the west and refugee tents in the east, with the stew pot and the well between */
  const tents=[[24,18],[27,20],[30,23],[24,21],[26,34],[29,36],[32,34],[24,37],[28,40],[34,41],[58,20],[61,17],[64,20],[60,22],[57,34],[60,36],[63,34],[58,40],[62,40],[66,36]];
  tents.forEach(([x,y],i)=>{if(!C.dec(IMG.blr_tent0&&i%3?'blr_tent'+((i%3)%2):'blr_tent0',x,y,{block:true,npc:'blr_tent',sc:1,i}))console.error('tent',x,y)});
  /* people */
  C.person('blr_drill',33,38,2);C.person('blr_cook',39,22,2);C.person('blr_stable',62,16,2);
  C.person('blr_nell',60,30,2);C.person('blr_pell',22,14,2);
  [['blr_ref1',58,24],['blr_ref2',62,24],['blr_ref3',60,38],['blr_ref4',56,22],['blr_ref5',65,38],['blr_ref6',59,32]].forEach(([id,x,y])=>C.person(id,x,y,2));
  if(F.scoutHome)blrScoutIn(C.decor);
  /* the road, outside: dead hedges with gaps, lamps, milestone, signs */
  for(let x=3;x<=86;x++){if([8,9,12,13,43,44,45,66,67,76,77].includes(x))continue;for(const y of [57,63]){if(hs(x,y,33)<.78)C.DB('bl_hedge'+((hs(x,y,35)*3)|0),x,y,{sc:.62+hs(x,y,34)*.22})}}
  for(let x=10;x<=84;x+=8){if(x>40&&x<48)continue;C.dec('gy_lantern',x,64,{block:true});C.light(x,64,x>34&&x<54?WARM:C.pale)}
  C.milestone(8,58);
  C.post(5,64,'blr_w',[{n:'THE VAULT OF MALDRAKE',d:-1}],'blr_signW','',{i:5});
  C.post(82,64,'blr_e',[{n:'THE BONE ORCHARD',d:1}],'blr_signE','',{i:4});
  /* the scout's hut, the burnt wagon, the ruined camp, the Road-Maw's hollow */
  C.pth(8,50,8,56,'1');C.thing('bl_hut','blr_hut',8,49,{sc:.7});C.dec('bl_fence',6,50,{block:true,sc:.8});C.dec('bl_fence',10,50,{block:true,sc:.8});
  if(!F.scoutHome){const kp=KH_KEEPERS.blr_scout,q=C.near(8,51,2,false);if(q){const d={k:khFaceKey(kp.face),x:q[0],y:q[1],block:false,walk:true,npc:'blr_scout',sc:kp.sc||1,hutScout:1};C.decor.push(d);C.used.add(q[0]+','+q[1])}}
  C.pth(76,53,77,56,'1');C.thing('wl_prop1_5','blr_wagon',76,52,{sc:1});C.dec('gy_bones',75,53,{sc:.7});C.dec('bl_wcross',78,52,{block:true,sc:.8});
  C.pth(12,64,13,68,'1');C.thing('gy_chest','blr_camp',12,69,{sc:.9});for(const [x,y] of [[10,68],[14,68],[11,70],[13,71]])C.dec('gy_bones',x,y,{sc:.8});C.dec('bl_stone2',9,70,{block:true,sc:.8});
  C.pth(66,64,67,68,'1');C.thing('bl_barrow','blr_mawspot',66,70,{sc:1.4});for(const [x,y] of [[64,69],[68,69],[64,71],[68,71],[62,70],[70,70]])C.dec('gy_bones',x,y,{sc:.8});
  C.dress({trees:60,scrub:140,stones:10,bones:12,posts:4,keep:(x,y)=>(x>=16&&x<=72&&y>=4&&y<=48)||(x>=2&&x<=88&&y>=56&&y<=64)});
  /* the creatures: only outside the walls, away from the gate; the Road-Maw in its hollow */
  C.foes([['blmaw',66,72],
    ['blhusk',20,54],['blhusk',58,54],['blghoul',34,54],['blghoul',72,66],['blbones',22,66],['blbones',46,68],['blbones',10,58],['blhound',50,66],['blhound',78,57],['blcrow',30,56],['blcrow',68,56],['blshade',14,72],['blbloat',40,70],['blhusk',80,68],['blghoul',6,66],['blbones',84,50],['blhusk',10,40],['blhusk',78,36],['blhound',8,28],['blcrow',80,28]]);
  for(const [k,x,y] of [['potion6',24,54],['potion6',54,68],['potion6',80,44]])C.items.push({k,x,y,taken:false});
  C.mapNames.push({t:'The Gate',x:44,y:46,k:'place'},{t:"The Captain's Hall",x:44,y:11,k:'place'},{t:'The Last Lantern (Inn)',x:28,y:12,k:'place'},{t:'The Armoury',x:24,y:26,k:'place'},{t:'Stable and Forge',x:62,y:11,k:'place'},{t:'The Infirmary',x:64,y:26,k:'place'},{t:'The Beacon Tower',x:22,y:10,k:'place'},{t:'The Tents',x:60,y:30,k:'place'},{t:'The Well',x:52,y:20,k:'place'},{t:"The Scout's Hut",x:8,y:49,k:'place'},{t:'The Burnt Wagon',x:76,y:52,k:'place'},{t:'The Ruined Camp',x:12,y:69,k:'place'},{t:"The Road-Maw's Hollow",x:66,y:70,k:'place'},{t:'To the Bone Orchard',x:84,y:57,k:'place'},{t:'To the Vault of Maldrake',x:5,y:57,k:'place'});
  const lv=C.finish({start:{x:84,y:60,f:3}});
  if(F.maw)lv.enemies=lv.enemies.filter(e=>e.t!=='blmaw');
  return lv}
/* ---------- the rooms ---------- */
const blrP=(C,n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){C.raw('crate',x,y,{})}};
const BLR_LC=[1.4,1.0,.6];
function blrInn(){
  const f=BLR_INNH.front;
  blRoom({id:BLR.INN,name:'The Last Lantern',w:15,h:10,amb:.7,rating:87,floor:'wood',wall:'kh_ohwall1_2',tele:[13,2],
    back:{to:BLR.ID,x:f[0],y:f[1],f:2},
    lights:[[3,2],[11,2],[7,5],[2,8],[12,8]],lcol:{'3,2':BLR_LC,'11,2':BLR_LC,'7,5':[1.5,1.05,.55],'2,8':BLR_LC,'12,8':BLR_LC},col:[1.4,1.0,.6],
    build:C=>{
      blrP(C,'hearth',7,1,{h:1.3});for(const x of [3,4,5,9,10,11])blrP(C,'bar',x,3,{});blrP(C,'potshelf',2,1,{h:1.2});blrP(C,'potshelf',3,1,{h:1.2});blrP(C,'potshelf',11,1,{h:1.2});blrP(C,'ale',1,2,{});blrP(C,'ale',13,4,{});
      blrP(C,'longtable',3,6,{h:.7});blrP(C,'longtable',11,6,{h:.7});blrP(C,'longtable',7,8,{h:.7});blrP(C,'chandelier',7,5,{free:1});blrP(C,'lute',13,8,{});blrP(C,'waterbarrel',1,8,{h:.7});blrP(C,'cat',9,2,{h:.26});blrP(C,'dog',5,8,{h:.36});
      C.npc('blr_inn',7,2);C.raw('gy_web',1,1,{block:false,sc:.4})}})}
function blrArmoury(){
  const f=BLR_ARMH.front;
  blRoom({id:BLR.ARM,name:'The Garrison Armoury',w:13,h:9,amb:.6,rating:87,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BLR.ID,x:f[0],y:f[1],f:2},
    lights:[[2,2],[10,2],[6,5]],lcol:{'2,2':BLR_LC,'10,2':BLR_LC,'6,5':[1.35,.98,.58]},col:[1.3,.95,.6],
    build:C=>{
      for(const x of [2,4,8,10])blrP(C,'mannequin',x,1,{});blrP(C,'shields',6,1,{});for(const x of [4,5,7,8])blrP(C,'shopcounter',x,3,{});blrP(C,'weaponrack',11,4,{});blrP(C,'mannequin',1,5,{});blrP(C,'shields',1,3,{bob:.2});blrP(C,'anvil',11,6,{h:.45});
      C.raw('gy_chest',11,2,{npc:'blr_reserve',solid:1,deco:false,sc:.9});C.raw('crate',1,7,{});C.raw('barrel',3,7,{});
      C.npc('blr_tolliver',6,2)}})}
function blrForge(){
  const f=BLR_BARN.front;
  blRoom({id:BLR.FORGE,name:'The Stable and Forge',w:15,h:9,amb:.55,rating:87,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BLR.ID,x:f[0],y:f[1],f:2},
    lights:[[3,2],[7,2],[11,2],[6,6]],lcol:{'3,2':[1.5,1.05,.55],'7,2':[1.5,1.05,.55],'11,2':BLR_LC,'6,6':BLR_LC},col:[1.35,.98,.55],
    build:C=>{
      blrP(C,'forge',7,1,{h:1.3});blrP(C,'anvil',5,3,{h:.55});for(const x of [2,3,11,12])blrP(C,'weaponrack',x,1,{});for(const x of [8,9,10])blrP(C,'shopcounter',x,3,{});blrP(C,'hangstand',13,4,{h:1.0});blrP(C,'shields',1,5,{});
      for(const [x,y] of [[2,7],[3,7],[12,7],[13,7]])C.raw('hay',x,y,{block:true,sc:1.0});C.raw('barrel',13,2,{});C.raw('crate',1,3,{});
      C.npc('blr_smith',6,3);C.npc('blr_stable',10,7)}})}
function blrHall(){
  const f=BLR_HALLH.front;
  blRoom({id:BLR.HALL,name:"The Captain's Hall",w:13,h:10,amb:.6,rating:87,floor:'wood',wall:'kh_ohwall1_2',
    back:{to:BLR.ID,x:f[0],y:f[1],f:2},
    lights:[[2,2],[10,2],[6,5],[2,8],[10,8]],lcol:{'2,2':BLR_LC,'10,2':BLR_LC,'6,5':[1.35,.98,.58],'2,8':BLR_LC,'10,8':BLR_LC},col:[1.3,.95,.6],
    build:C=>{
      blrP(C,'hearth',6,1,{h:1.3});blrP(C,'banner',3,1,{h:1.6,block:false});blrP(C,'banner',9,1,{h:1.6,block:false});blrP(C,'counciltable',6,5,{h:.8});blrP(C,'mayorchair',6,3,{h:1.0});
      blrP(C,'bookshelf',1,2,{h:1.1});blrP(C,'bookshelf',11,2,{h:1.1});blrP(C,'noticeboard',2,6,{h:.9,block:false});blrP(C,'coatrack',11,7,{h:1.0});blrP(C,'waterbarrel',1,8,{h:.7});
      C.raw('gy_candles',3,5,{block:true,sc:.8});C.raw('gy_candles',9,5,{block:true,sc:.8});
      C.npc('blr_marsh',6,4)}})}
function blrInfirmary(){
  const f=BLR_INFH.front;
  blRoom({id:BLR.INFIRM,name:'The Infirmary',w:13,h:9,amb:.6,rating:87,floor:'wood',wall:'kh_ohwall1_2',
    back:{to:BLR.ID,x:f[0],y:f[1],f:2},
    lights:[[2,2],[10,2],[6,5],[2,7],[10,7]],lcol:{'2,2':BLR_LC,'10,2':BLR_LC,'6,5':[1.35,.98,.58],'2,7':[1.0,1.1,.9],'10,7':BLR_LC},col:[1.25,1.0,.7],
    build:C=>{
      blrP(C,'cot',2,3,{h:.55});blrP(C,'cot',2,5,{h:.55});blrP(C,'cot',10,3,{h:.55});blrP(C,'cot',10,5,{h:.55});blrP(C,'bed',7,3,{h:.7});blrP(C,'bed',9,6,{h:.7});
      blrP(C,'herbrack',4,1,{h:1.1});blrP(C,'apothcab',6,1,{h:.95});blrP(C,'potshelf',8,1,{h:1.2});blrP(C,'cauldron',11,1,{h:.9});blrP(C,'waterbarrel',1,7,{h:.7});blrP(C,'shelving',12,5,{h:1.0});
      C.npc('blr_surgeon',5,4);
      blrDaceAdd()}})}
function blrBeacon(){
  const f=BLR_BEACON.front;
  blRoom({id:BLR.BEACON,name:'The Beacon Room',w:9,h:9,amb:.45,rating:87,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BLR.ID,x:f[0],y:f[1],f:2},
    lights:[[2,2],[6,2],[4,3],[4,6]],lcol:{'2,2':[.75,1.1,.95],'6,2':[.75,1.1,.95],'4,3':blrF().beaconLit?[1.6,1.2,.6]:[.6,1.0,.9],'4,6':[1.3,.95,.6]},col:[1.1,.95,.8],
    build:C=>{
      C.raw('hearth',4,3,{block:true,npc:'blr_beacon',solid:1,deco:false,sc:1.0,hidden:true});blrP(C,'hearth',4,2,{h:1.5});blrP(C,'weaponrack',1,3,{h:.9});blrP(C,'bed',7,6,{h:.7});blrP(C,'waterbarrel',7,2,{h:.7});blrP(C,'noticeboard',2,1,{h:.9,block:false});
      C.npc('blr_pell',2,6)}})}
for(const [id,fn] of [[BLR.INN,blrInn],[BLR.ARM,blrArmoury],[BLR.FORGE,blrForge],[BLR.HALL,blrHall],[BLR.INFIRM,blrInfirmary],[BLR.BEACON,blrBeacon]])
  KH_LAZY[id]=()=>{if(!LEVELS[id]){if(!LEVELS[BLR.ID])KH_LAZY[BLR.ID]();fn()}return LEVELS[id]};
/* the quest rings */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx}),T=QRF.T;
  T.blq54={give:[N(9662,'blr_tolliver')],act:[N(9662,'blr_tolliver')],ready:[N(9662,'blr_tolliver')]};
  T.blq55={give:[N(9665,'blr_surgeon')],act:[N(9665,'blr_surgeon')],ready:[N(9665,'blr_surgeon')]};
  T.blq56={give:[N(9660,'blr_nell')],act:[N(9660,'blr_nell')],ready:[N(9660,'blr_nell')]};
  T.blq57={give:[N(9664,'blr_marsh')],act:()=>blF().maw?[N(9664,'blr_marsh')]:[E(9660,/^blmaw$/),N(9660,'blr_mawspot')],ready:[N(9664,'blr_marsh')]};
  T.blq58={give:[N(9664,'blr_marsh')],act:()=>blF().scoutHome?[N(9664,'blr_marsh')]:[N(9660,'blr_scout')],ready:[N(9664,'blr_marsh')]};
  T.blq59={give:[N(9666,'blr_pell')],act:()=>blF().beaconLit?[N(9666,'blr_pell')]:blF().oil&&blF().flint?[N(9666,'blr_beacon')]:[N(9660,'blr_wagon','blr_camp')],ready:[N(9666,'blr_pell')]}}
blRegister(6,blrBuild,{fromE:{x:84,y:60,f:3},fromW:{x:4,y:60,f:1},exitY:60,rooms:[9661,9662,9663,9664,9665,9666],names:{9661:'The Last Lantern',9662:'The Garrison Armoury',9663:'The Stable and Forge',9664:"The Captain's Hall",9665:'The Infirmary',9666:'The Beacon Room'},rating:{9661:87,9662:87,9663:87,9664:87,9665:87,9666:87}});
BL_ROAD[5].W=BLR.W;BL_ROAD[5].H=BLR.H;
