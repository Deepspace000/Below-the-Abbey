/* ==========================================================================
   PLACE 5 OF THE BLIGHTED ROAD: THE BONE ORCHARD (level 9650, rated 87; rooms 9651 the Pressing Shed, 9652 the Cider Cellar, 9653 the Crypt of the Lost Patrol, 9654 Mother Hesper's hut, 9655 the Harvest Hall; prefix bo / BO). 84 by 72.
   The road runs east to west along y 35 to 37 (east gate x 82 back to Gallowmere, west gate x 1 on to Lanternrest Waystation, 9660). North of the road lie two orchards of white trees (rows three squares apart) that fruit skulls, with
   walking pickers among them (scarecrow-like, they stand still until the party is close); the pressing shed (door to 9651, a trapdoor inside leads to the cider cellar 9652) stands at the end of a lane in the north east,
   Mother Hesper's hut in the far north east, the Harvest Yard (a fenced yard with the Harvest Hall 9655, the harvest bell, and the Reaper-Farmer, a hard mini-boss with a scythe) in the middle. South of the road is the crypt field:
   rows of crypts and stones, and one small crypt (9653) in which a patrol from Oldhaven died, apart from its captain, who is pinned living to the wall.
   People: Bartle Cask the cider-maker (bo_bartle, in the cellar), Mother Hesper the hedge-witch (bo_hesper), Captain Corin Dace (bo_dace, pinned in the crypt; after he is freed he lies in the infirmary of Lanternrest).
   Quests: blq50 Skull-Apples for Mother Hesper (pick three), blq51 The Lost Patrol (free Captain Dace, take the crests of his three dead men, report to Captain Marsh at Lanternrest), blq52 The Harvest Bell (Bartle: break it with his cellar mallet),
   blq53 A Cask for the Garrison (Bartle: take the sealed cask to Quartermaster Tolliver at Lanternrest; the hand-in is in blight_lanternrest.js).
   Flags: G.flags.bl = {apples (n picked), appleTree:{i:1}, daceMet, daceFree, crests (n), crestTaken:{i:1}, bell, mallet, reaper, cask, chestH}.
   ========================================================================== */
const BO={ID:9650,SHED:9651,CELLAR:9652,CRYPT:9653,HUT:9654,HALL:9655,W:84,H:72};
for(const [id,n] of [[9651,'The Pressing Shed'],[9652,'The Cider Cellar'],[9653,'The Crypt of the Lost Patrol'],[9654,"Mother Hesper's Hut"],[9655,'The Harvest Hall']]){LEVEL_NAMES[id]=n;LEVEL_RATING[id]=87}
const BO_SHED={x0:61,x1:67,y0:25,y1:30,face:'S',sty:'timber',roof:'thatch2',wh:2.4,to:BO.SHED};
const BO_HUTH={x0:70,x1:73,y0:11,y1:13,face:'S',sty:'timber',roof:'thatch2',wh:2.2,to:BO.HUT};
const BO_CRYPTH={x0:24,x1:26,y0:52,y1:54,face:'S',sty:'flint',roof:'slate',wh:2.3,to:BO.CRYPT};
const BO_HALLH={img:'wl_bldg1_5',x0:38,x1:42,y0:20,y1:24,w:5.2,wh:2.4,to:BO.HALL};
/* ---------- things carried ---------- */
ITEMDEF.blskullapple={n:'Skull-Apple',k:'quest',t:'Quest item',ic:'ore',c:'#e8e4d4',stack:9,price:0,sw:.3,d:'A fruit the size of a fist, white and hard, with two hollows and a row of small teeth worked into the skin. It is cool, and it smells of cider. Mother Hesper wants three.'};
ITEMDEF.blcrest={n:'Patrol Crest',k:'quest',t:'Quest item',ic:'ore',c:'#c8a848',stack:9,price:0,sw:.1,d:'A small brass badge stamped with the crown of King Osric and the number of a patrol. It was taken from the remains of a soldier of Oldhaven. Captain Marsh at Lanternrest will want it.'};
ITEMDEF.blmallet={n:"Bartle's Cellar Mallet",k:'quest',t:'Quest item',ic:'sword',c:'#8a6a40',stack:1,price:0,sw:.8,d:'A long-handled oak mallet used to knock the bungs in. Bartle Cask says it is just heavy enough to crack a bell.'};
ITEMDEF.blcask={n:'Sealed Cask of Cider',k:'quest',t:'Quest item',ic:'potion',c:'#c89a38',stack:1,price:0,sw:2,d:'A small oak cask with a wax seal and the mark of the Bone Orchard burnt into the end. It is for the garrison at Lanternrest.'};
ITEMDEF.blhesperring={n:"Hesper's Hedge Ring",k:'ring',t:'Ring',ic:'ring',c:'#78a878',price:0,lvl:87,pas:{ward:17,dodge:.06,regen:.7,mpRegen:.5},int:6,hp:80,rar:1,sw:.1,d:'A ring of twisted green wire with a seed set in it, hard as a pebble. Adds 6 Intelligence and 80 health, every blow on the wearer is 17 lighter, enemies miss 6% more, and wounds and weariness close steadily. Needs level 87.'};
ITEMDEF.blorchardring={n:"Bartle's Bunghole Ring",k:'ring',t:'Ring',ic:'ring',c:'#c8a050',price:0,lvl:87,pas:{ward:17,dodge:.06,regen:.7,mpRegen:.4},int:5,hp:85,rar:1,sw:.1,d:'A heavy brass ring made from the tap of an old cider barrel, polished until it shines. Adds 5 Intelligence and 85 health, every blow on the wearer is 17 lighter, enemies miss 6% more, and wounds and weariness close steadily. Needs level 87.'};
ITEMDEF.blreapscythe={n:"The Reaper-Farmer's Scythe",k:'weapon',t:'Sword',ic:'sword',c:'#b8c0c0',dmg:[500,610],hit:.2,req:{str:70},lvl:87,price:0,rar:1,eff:{bleed:[.4,6,40],bossdmg:.3},dbl:.2,sw:.5,d:'A long curved blade on a grey ash snath, worn thin on the edge by a hundred harvests of things that should not be harvested. Wounds bleed hard, and bosses take 30% more. Needs level 87.'};
/* ---------- the creatures ---------- */
Object.assign(ENEMY_DEF,{
  blpicker:{name:'Skull-Picker',hp:76,dmg:[8,13],hit:.86,w:blWw('guardA_0',1.7),img:'wwi_scare',xp:30,gold:[0,0],speed:1,verb:'rakes',bl:1,still:1,wake:'A picker lowers its basket of skulls, and turns its sacking face towards you.'},
  blreaper:{name:'The Reaper-Farmer',hp:520,dmg:[11,18],hit:.9,w:blWw('guardA_3',2.5),img:'wwi_golem',xp:820,gold:[0,0],speed:1,verb:'reaps',boss:true,aboveParty:0,bl:1,still:1,glow:.12,wake:'The tall figure by the bell straightens, and sets the scythe on its shoulder. Under the straw hat there is nothing but a pale green light.'}
});
if(typeof NO_VARY!=='undefined')NO_VARY.push('blreaper');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('blreaper');
if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.blreaper=[3400,4200];
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^blpicker/,'fever',.12],[/^blreaper/,'bleeding',.3]);
ENEMY_DEF.blreaper.act=e=>gyBossAct(e,{moves:[
  {every:5,all:true,mult:.55,txt:'The Reaper-Farmer sweeps the scythe flat across the yard, and a wave of cold chaff goes through the whole party.',col:'#c8d8a0',verb:'Chaff cuts'},
  {every:3,mult:1.2,near:2,affl:'bleeding',txt:'The Reaper-Farmer brings the scythe round in a long, patient stroke, as if cutting a field.',col:'#d8e0b8',verb:'The scythe cuts'}]});
/* ---------- white trees: the painted dead trees of the wood and the graveyard, bleached (a filter over the painting) ---------- */
function boArt(){
  if(BO._art)return;
  const mk=(key,src,h)=>{if(!src||!src.width)return false;const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');try{x.filter='grayscale(1) brightness(2.3) contrast(.72)'}catch(e){}x.drawImage(src,0,0);IMG[key]=c;NPC_H[key]=h;return true};
  mk('bo_tree0',IMG.trees_5,2.6);mk('bo_tree1',IMG.trees_1,2.9);mk('bo_tree2',IMG.gyp_sceneB_1,2.8);mk('bo_tree3',IMG.trees_3,2.9);
  for(let i=0;i<4;i++)if(!IMG['bo_tree'+i]){IMG['bo_tree'+i]=IMG.gy_dead||IMG.ww_twig;NPC_H['bo_tree'+i]=NPC_H.gy_dead||2.6}
  BO._art=1}
const BO_FRUIT=[[11,13],[23,19],[14,25],[29,10],[61,16]];   // the five trees that bear skull-apples (on the rows of the orchards)
const BO_WHITE=['bo_tree0','bo_tree1','bo_tree2','bo_tree3','bo_tree0','bo_tree2'];
/* ---------- the people ---------- */
const boF=()=>blF();
khNpc('bo_bartle','Bartle Cask, cider-maker','kh_ohfolk2_2',()=>yrLines('bo_bartle',[
  'Forty autumns I pressed this orchard. White trees, red apples, a cider the king drank twice. Then the trees went white, and the apples went the shape of a head. I stopped pressing. A man has to draw the line somewhere, and I drew it at the teeth.',
  'The bell is the cause. It hangs in the Harvest Yard and tolls at dusk, and the pickers come down out of the rows with their baskets, and the skulls ripen. The Reaper-Farmer keeps it. He used to be Farmer Orrin. He took the Pale man’s wages, same as everyone.',
  'Do not drink what the orchard makes now. Do not let it near a cat. I tried. The cat looked at me for a week.']));
khNpc('bo_hesper','Mother Hesper, hedge-witch','kh_ohfolk4_3',()=>yrLines('bo_hesper',[
  'I am not that sort of witch. I do hedges. I do the little things that live in hedges, and the cures that grow in them. What is happening in the orchard is not the hedge’s business, and the hedge knows it, and is cross.',
  'The skull-apples are not as terrible as they look. Eight parts bone-meal, one part grief, and a pinch of cider yeast. Properly steeped, they stop a rotting. Properly cooked, they are very nearly pie.',
  'If you see a rowan sprig on the way, nod to it. It was kind to me once.']));
khNpc('bo_dace','Captain Corin Dace, of Oldhaven','kh_ohsold1_3',d=>{
  const F=boF();
  if(!F.daceFree)return say('A man in the mail and blue tabard of King Osric’s army hangs against the back wall of the crypt, with a long black blade through the cloth of his cloak above each shoulder, pinning him upright. His lips are cracked. He is alive. He tries to smile when he sees the light.',[['Pull the blades out of the wall.',()=>{F.daceFree=1;F.daceMet=1;sfx('win');if(d){d.found=true;d.block=false}try{const L=LEVELS[BO.CRYPT];if(L)for(const x of L.decor)if(x.npc==='bo_dace')x.found=true;blrDaceIn()}catch(e){console.error(e)}msg('Captain Dace staggers on to his feet. He says he will make his own way to Lanternrest.','#ffe36a');return say('He drops, and you catch him. "Water," he says, and drinks half your flask, and does not give it back. "Three of my lads are in here, with their crests still on. Take the crests to Captain Marsh. Tell him Dace is alive. I will crawl to the fort on my own if I must."',[BYE])}],BYE]);
  return yrLines('bo_dace',['"Go on. Take the crests to Marsh. I will be along. I just need to sit down for about a week."','"Do not eat the apples. I know they look like hospitality. They are not."'])},{sc:1});
/* ---------- the quests ---------- */
function boQ(id,title,who,steps,reward,extra){const q=yrQ(id,title,who,steps,reward,extra);QAREA[id]=BL.REGION;return q}
/* a quest whose description and targets follow what has been done: goal() 0 or 1, desc() and targets() are read every time */
function boQ2(id,title,who,goal,reward,desc,targets){
  const q={title,who,need:1,goal:()=>goal()?1:0,reward};if(reward.take){q.take=reward.take;delete reward.take}
  Object.defineProperty(q,'desc',{enumerable:true,get:desc});Object.defineProperty(q,'targets',{enumerable:false,get:targets});
  QUESTS[id]=q;QAREA[id]=BL.REGION;return q}
boQ2('blq50','Skull-Apples for Mother Hesper','Mother Hesper, hedge-witch',()=>(boF().apples|0)>=3,
  {gold:3300,xp:29000,items:['blhesperring','potion6'],take:{blskullapple:3}},
  ()=>{const n=Math.min(3,boF().apples|0);return n<3?'Pick three skull-apples from the fruiting white trees of the Bone Orchard ('+n+' of 3). The trees with a skull in their branches have them.':'Take the three skull-apples to Mother Hesper at her hut, in the far north east of the orchard.'},
  ()=>(boF().apples|0)<3?['bo_tree_0']:['bo_hesper']);
boQ2('blq51','The Lost Patrol','Captain Eldred Marsh, at Lanternrest',()=>!!boF().daceFree&&(boF().crests|0)>=3,
  {gold:4200,xp:36000,items:['potion6','potion6'],take:{blcrest:3}},
  ()=>{const F=boF(),n=Math.min(3,F.crests|0);if(F.daceFree&&n>=3)return 'Take the three patrol crests to Captain Eldred Marsh at Lanternrest Waystation, west along the road.';return (F.daceFree?'Captain Dace is free. ':'Free Captain Dace from the wall of the small crypt in the crypt field, south of the road. ')+'Take the crests of his three dead soldiers from the slabs ('+n+' of 3), then take them to Captain Marsh at Lanternrest.'},
  ()=>{const F=boF();return !F.daceFree?['bo_dace']:(F.crests|0)<3?['bo_rem0','bo_rem1','bo_rem2']:['blr_marsh']});
boQ('blq52','The Harvest Bell','Bartle Cask, cider-maker',[
  ["Take Bartle's cellar mallet (it hangs by the cellar door) and break the harvest bell in the Harvest Yard, in the middle of the orchard.",()=>!!boF().bell,['bo_bell']]],
  {gold:3800,xp:33000,items:['blorchardring','potion6']});
boQ2('blq53','A Cask for the Garrison','Bartle Cask, cider-maker',()=>!!boF().cask,
  {gold:2600,xp:22000,items:['potion6','potion6'],take:{blcask:1}},
  ()=>boF().cask?'Take the sealed cask to Quartermaster Tolliver at Lanternrest Waystation, west along the road.':'Take the sealed cask from the cider cellar, and take it to Quartermaster Tolliver at Lanternrest Waystation, west along the road.',
  ()=>boF().cask?['blr_tolliver']:['bo_cask']);
/* a person who gives a quest and keeps talking: the quest is one more thing to say (the quest mark follows cond), and a finished quest is handed in here. dlg.offer==='' means this person only takes the hand-in. */
function blGiveOpt(npcId,qid,cond,dlg){
  const dsc=Object.getOwnPropertyDescriptor(QGIVER,npcId),oldGet=dsc&&dsc.get?dsc.get:()=>dsc?dsc.value:null;
  Object.defineProperty(QGIVER,npcId,{enumerable:true,configurable:true,get(){const l=[].concat(oldGet.call(QGIVER)||[]);if(cond()&&qSt(qid)!=='done')l.push(qid);return l.length?l:null}});
  const n=NPCS[npcId],old=n.root,hand=dlg.offer==='';
  n.root=d=>{
    if(qReady(qid))return qNode(qid,dlg);
    const node=old(d);
    if(!hand&&cond()&&qSt(qid)!=='done'&&node&&node.opts){const st=qSt(qid);node.opts.splice(Math.max(0,node.opts.length-1),0,[st===null?'Is there anything we can do for you?':'About the favour you asked...',()=>qNode(qid,dlg)])}
    return node};
  if(KH_KEEPERS[npcId])KH_KEEPERS[npcId].root=n.root}
blGiveOpt('bo_hesper','blq50',()=>true,{
  offer:'Hush. You are not a hedge. Good. I have a small errand, and the orchard is full of things that have not been polite to me. I need three skull-apples, off the trees that have them, and I need them fresh. The pickers will wake if you rattle the branches. Mind your heads.',
  accept:'Bless you. The fruiting trees are the white ones with a pale round thing in the branches. There are five in the orchard. Pick any three, and bring them to my door.',
  remind:()=>'Three skull-apples, off the white trees with a pale round fruit in the branches. You have '+Math.min(3,boF().apples|0)+'.',
  ready:'Oh, those are lovely. Cool, and a good shape. Give them here, and do not look at their faces.',
  thanks:'There. The hedges will be grateful, and so am I. Take this. It grows, if you plant it, but I would not plant it.',
  after:'I have a pot of apple butter on that has not yet said a word. Very promising.'});
wwGive('bo_dace','blq51',()=>qSt('blq51')===null,{
  offer:'Listen to me. I am Dace, a captain of the Oldhaven foot. We came west from Lanternrest with eleven men to see why the cider carts had stopped. Eight we lost in the rows. These three are mine, here in the crypt. Take their crests off them, and take them to Captain Marsh at the fort. He will want to know what became of us. And pull these blades out of my cloak while you are about it.',
  accept:'Thank you. The crests are on the remains, on the stone slabs. Do not be long. The thing that did this is still tolling.',
  remind:()=>boF().daceFree?'Take the three crests from the remains in this crypt, then take them to Captain Marsh at Lanternrest.':'Pull the blades out of the wall, and take the crests off my three dead lads.',
  ready:'Captain Marsh is at the fort. Go west along the road to Lanternrest.',
  thanks:'Thank you.',
  after:'Dace is alive, and in Marsh’s infirmary, and has not stopped asking for tea.'});
blGiveOpt('bo_bartle','blq52',()=>true,{
  offer:'There is a bell in the Harvest Yard. Bronze, the size of a barrel, and I cast it myself for the harvest supper. Every dusk it tolls by itself, and the pickers rise. I cannot go up there. The Reaper-Farmer stands guard. But if the bell breaks, I think the orchard will stop. Will you break it? I will lend you my mallet.',
  accept:'Take the mallet. It is by the door of the cellar. It knocked bungs into forty thousand barrels, and it is not going to be troubled by a bell. The Harvest Yard is in the middle of the orchard, with a fence round it. The Reaper-Farmer stands by the bell.',
  remind:()=>boF().mallet?'You have the mallet. Break the harvest bell in the Harvest Yard.':'The mallet is in the cellar, by the door. Take it, and break the bell in the Harvest Yard.',
  ready:'It has stopped. I felt the tolling stop, from here. Like a tooth being left alone.',
  thanks:'Take my old brass tap, off the first barrel I ever sold. I have no more use for it.',
  after:'The orchard is quiet at dusk now. The trees are still white, but they are only trees.'});
blGiveOpt('bo_bartle','blq53',()=>qSt('blq52')==='done',{
  offer:'There are people at Lanternrest, a fort with a gate, a long way west. They are cut off and short of everything. I have one good cask left that did not go to bone, put by for my daughter’s wedding. Take it to the quartermaster there, Tolliver. He will know what to do with it.',
  accept:'It is the last cask in the cellar, with the wax seal on it. Mind how you carry it. It is the only thing left of the old orchard that is still good.',
  remind:()=>boF().cask?'You have the cask. Take it to Quartermaster Tolliver at Lanternrest, west along the road.':'The sealed cask is in the cellar.',
  ready:'Tolliver is at Lanternrest.',
  thanks:'Thank you.',
  after:'Tolliver wrote to say it was a good one. I did not know he could write.'});
/* ---------- the objects ---------- */
khNpc('bo_tree_0','A white fruiting tree','bo_tree1',d=>{
  const F=boF();F.appleTree=F.appleTree||{};const i=Math.max(0,BO_FRUIT.findIndex(f=>f[0]===d.x&&f[1]===d.y));
  if(F.appleTree[i])return say('A white tree, bare of fruit now. A pale ring is left on the branch where the skull-apple hung.',[BYE]);
  return say('A white tree, bleached like driftwood. In the fork of its branches hangs a round pale fruit with two hollows, and a thin curve of teeth worked into the skin. It rocks very slightly, though there is no wind.',[['Pick the skull-apple.',()=>{
    F.appleTree[i]=1;F.apples=(F.apples|0)+1;sfx('key');d.fruitGone=true;
    if(!bagAdd(mkItem('blskullapple')))msg('Your bag is full.','#d09a80');
    msg('You pick a skull-apple ('+F.apples+').','#ffe36a');
    try{for(const e of G.enemies)if(e.hp>0&&e.t==='blpicker'&&Math.hypot(e.x-G.P.x,e.y-G.P.y)<9&&e.still){e.still=0;e.woke=1}}catch(x){}
    return say('It comes away with a small sound, like a tooth. Somewhere among the trees, something rattles its basket.',[BYE])}],BYE])});
const BO_REMAINS=[
  ['Private Hal Wyke','A soldier of the Oldhaven foot lies on a stone slab, stripped of his helm, his hand still round the haft of a broken spear. The crest on his collar is brass, and bright.'],
  ['Private Jem Fordham','Another soldier lies on the next slab, with his shield on his chest and a wound in his side that closed over. His crest is on the strap of his helm.'],
  ['Sergeant Anna Pell','A woman in a sergeant’s stripes lies across the third slab with a notched sword under her hand. Her crest is pinned over her heart.']];
BO_REMAINS.forEach((r,i)=>khNpc('bo_rem'+i,r[0],'gy_bones',d=>{
  const F=boF();F.crestTaken=F.crestTaken||{};
  if(F.crestTaken[i])return say(r[0]+' lies in his place on the slab, with his collar bare. Somebody has closed his eyes.',[BYE]);
  return say(r[1],[['Take the crest.',()=>{F.crestTaken[i]=1;F.crests=(F.crests|0)+1;if(!bagAdd(mkItem('blcrest')))G.items.push({k:'blcrest',x:G.P.x,y:G.P.y,taken:false});sfx('key');msg('You take the crest of '+r[0]+' ('+F.crests+' of 3).','#ffe36a');return null}],BYE])}));
khNpc('bo_bell','The harvest bell','gy_bell',()=>{
  const F=boF();
  if(F.bell)return say('The harvest bell lies in three pieces on the trampled grass. It has a dull sound now, a flat clack, when the wind moves it.',[BYE]);
  if(bagCount('blmallet')>0)return say('A bronze bell the size of a barrel hangs from a post of white wood. A rope as thick as your wrist hangs from the clapper, and the rope is slightly warm. You have the cellar mallet.',[['Break the bell with the mallet.',()=>{F.bell=1;bagRemove('blmallet',1);sfx('win');G.shake=.6;msg('The bell cracks right through, with a sound like a stone going down a well, and every picker in the orchard sits down.','#ffe9a0');
      try{const L=LEVELS[BO.ID];if(L)for(const e of L.enemies)if(e.t==='blpicker')e.still=1}catch(x){}
      for(const e of G.enemies)if(e.hp>0&&e.t==='blpicker'){e.still=1;e.woke=0}
      try{for(const d of G.decor)if(d.npc==='bo_bell'){d.k='bl_slab';d.sc=.5}}catch(x){}return null}],BYE]);
  return say('A bronze bell the size of a barrel hangs from a post of white wood. The rope is warm. When you put your hand on the metal, it hums, and something in the orchard hums back. You would need something heavy to break it.',[BYE])});
khNpc('bo_press','The cider press','coopstack',()=>say('A great oak screw press with a stone bed, black with old juice. The cheeses of pulp in it are the colour of bone. A line of children’s milk teeth has been picked out of the sump with tweezers and set in a saucer.',[BYE]));
khNpc('bo_trap','A trapdoor','gy_hatch2',()=>say('A trapdoor in the floor of the pressing shed, with a ring and a worn rope. Cold air comes up, smelling of apples and wet stone. Somebody below is humming, very quietly, to keep from thinking.',[['Open it and go down.',()=>{sfx('door');G.talk=null;goToLevel(BO.CELLAR,{x:6,y:2,f:2});return null}],BYE]));
khNpc('bo_cellarup','A ladder','gy_hatch2',()=>say('A ladder goes up to the pressing shed.',[['Climb up.',()=>{sfx('door');G.talk=null;goToLevel(BO.SHED,{x:3,y:6,f:0});return null}],BYE]));
khNpc('bo_mallet','Bartle’s mallet','coopstack',()=>{
  const F=boF();
  if(F.mallet||F.bell)return say('The nail by the door where the mallet hung is empty.',[BYE]);
  if(qSt('blq52')!=='active')return say('A long oak mallet hangs by the cellar door, on a nail. It has been used a great deal.',[BYE]);
  return say('A long oak mallet hangs by the cellar door, on a nail.',[['Take the mallet.',()=>{F.mallet=1;if(!bagAdd(mkItem('blmallet')))G.items.push({k:'blmallet',x:G.P.x,y:G.P.y,taken:false});sfx('key');msg("You take Bartle's cellar mallet.",'#ffe36a');return null}],BYE])});
khNpc('bo_cask','A sealed cask','ale',()=>{
  const F=boF();
  if(F.cask||F.caskGiven)return say('The rack where the good cask stood is empty, with a clean ring in the dust.',[BYE]);
  if(qSt('blq53')!=='active')return say('A single small cask stands on its own rack, with a wax seal over the bung and a ribbon round it. It has been put by for somebody.',[BYE]);
  return say('A single small cask stands on its own rack, with a wax seal over the bung and a ribbon round it. It has been put by for somebody.',[['Take the cask.',()=>{F.cask=1;if(!bagAdd(mkItem('blcask')))G.items.push({k:'blcask',x:G.P.x,y:G.P.y,taken:false});sfx('key');msg('You take the sealed cask.','#ffe36a');return null}],BYE])});
khNpc('bo_hallchest','The Reaper-Farmer’s strongbox','gy_chest',()=>{
  const F=boF();
  if(F.chestH)return say('The strongbox is empty, and the straw hat in it has sunk to a flat grey ring.',[BYE]);
  return say('An iron strongbox under the harvest table, unlocked. Inside are a straw hat gone grey, a purse of coins from every mint on the road, and a loaf of bread that has never rotted.',[['Take the purse.',()=>{F.chestH=1;G.gold+=1900;if(ITEMDEF.supermana&&bagAdd(mkItem('supermana'))){}bagAdd(mkItem('potion6'));sfx('win');msg('You take 1900 gold, a mana flask and a potion.','#ffe36a');return null}],BYE])});
khNpc('bo_ledger','The harvest ledger','gy_book',()=>say('A harvest ledger on the table. Every page is a year, and a count: bushels, sacks, and then, from the year the Pale man came, a different count, in a neat hand: heads. The last entry is four hundred and six. Under it somebody has written: ENOUGH FOR THE FEAST OF THE WAXEN KING. The ink is still damp.',[BYE]));
const BO_SIGNS={
  e:['A signpost inside the east gate. The board reads GALLOWMERE, to the east. Below it, somebody has nailed a smaller board: THE ORCHARD IS NOT OPEN TO THE PUBLIC. THE PUBLIC IS INSIDE IT.'],
  w:['A signpost by the west gate. The board reads LANTERNREST WAYSTATION, to the west, with a small lantern painted under the word. Somebody has added: SAFE. A LITTLE. TRY THE SOUP.'],
  orch:['A signpost at the lane end. The board reads THE BONE ORCHARD, and below it: HARVEST YARD, north. PRESSING SHED, north east. CRYPT FIELD, south. Beneath that, in chalk: DO NOT SHAKE THE TREES.'],
  shed:['A sign nailed over the shed door. The letters are burnt in. They read: BARTLE CASK, CIDER. PRESSED FRESH. Somebody has crossed out FRESH and written ON THE DAY.'],
  yard:['A board on the fence of the Harvest Yard. It reads HARVEST YARD. NO GLEANING. KEEP TO THE ROWS. Under it somebody has scratched a tally of fifteen strokes, and then stopped.'],
  crypt:['A signpost at the edge of the crypt field. The board reads THE CRYPT FIELD, and below it, in a neat soldier’s hand: PATROL OF OLDHAVEN. THREE DAYS OUT. IF FOUND, PLEASE INFORM LANTERNREST.'],
  hut:['A sign hung on a branch. A hedge has been trimmed into the shape of an arrow. The board reads HEDGE-WITCH. KNOCK. DO NOT SHAKE THE GATE. THE GATE HAS OPINIONS.']};
for(const k in BO_SIGNS)khNpc('bo_sign_'+k,'A signpost','greensign',()=>say(BO_SIGNS[k][0],[BYE]));
khNpc('bo_cart','An apple cart','wl_prop1_5',()=>say('A cart heaped with white fruit under a tarpaulin. Every one of them has the same look, and when the cart creaks, they all lean a little the same way.',[BYE]));
khNpc('bo_stone','A grave board','bl_slab',d=>say(['HERE LIES A PICKER. NAME UNKNOWN. HE LOVED THE WORK.','HERE LIES TWO PICKERS, WHO SHARED A BASKET.','HERE LIES MISTRESS ORRIN, WIFE OF THE FARMER. SHE SAID IT WOULD END BADLY.','HERE LIES THE CIDER MASTER. HE IS NOT HERE. THE STONE WAS A GUESS.'][((d.x*7+d.y)|0)%4],[BYE]));
/* the Reaper-Farmer's death: the scythe falls to the party */
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;const r=_h.apply(this,arguments);
  try{if(was&&e.hp<=0&&e.t==='blreaper'){const F=boF();if(!F.reaper){F.reaper=1;if(!bagAdd(mkItem('blreapscythe')))G.items.push({k:'blreapscythe',x:Math.round(e.x),y:Math.round(e.y),taken:false});msg('The Reaper-Farmer falls in a drift of straw. His scythe stays upright in the ground, and you take it.','#ffe36a');sfx('win');
    for(const q of G.enemies)if(q.hp>0&&q.t==='blpicker'&&Math.hypot(q.x-e.x,q.y-e.y)<8){q.still=1;q.woke=0}}}}catch(x){console.error(x)}
  return r}}
/* ---------- the level ---------- */
function boBuild(p){
  boArt();
  const C=blKit({id:BO.ID,W:BO.W,H:BO.H,name:p.name,lvl:87,start:{x:78,y:36,f:3},wind:.38});
  const {hs}=C,F=blF();
  C.hills(.14);C.boundary();C.setF(2,2,BO.W-3,BO.H-3,'0');
  C.pth(2,35,81,37,'1');C.flatten(2,28,81,44);
  C.pth(64,31,64,34,'1');C.pth(71,15,71,34,'1');C.pth(43,25,45,34,'4');C.pth(20,38,20,66,'1');C.pth(44,38,44,66,'1');
  C.gate('E',36);C.gate('W',36);
  /* the pressing shed, the hedge-witch's hut, the small crypt, the harvest hall and yard */
  C.house(BO_SHED);C.house(BO_HUTH);C.house(BO_CRYPTH);C.picHouse(BO_HALLH);
  C.pth(36,25,52,33,'4');
  for(let x=36;x<=52;x++){if(x>=43&&x<=45)continue;C.dec('bl_wfence',x,33,{block:true,sc:.9})}
  for(let x=36;x<=52;x++)C.dec('bl_wfence',x,19,{block:true,sc:.9});
  for(let y=20;y<=32;y++){C.dec('bl_wfence',36,y,{block:true,sc:.9});C.dec('bl_wfence',52,y,{block:true,sc:.9})}
  C.thing('gy_bell','bo_bell',44,28,{sc:2.8});C.dec('bl_fence',43,28,{block:true,sc:.7});C.dec('bl_fence',45,28,{block:true,sc:.7});C.dec('bl_fence',44,29,{block:true,sc:.7});
  for(const [x,y] of [[40,26],[48,26],[40,32],[48,32]]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,C.pale)}
  C.dec('hay',50,30,{block:true,sc:1.2});C.dec('hay',38,30,{block:true,sc:1.1});C.dec('bl_barrow',48,31,{block:true,sc:.8});
  C.post(42,34,'bo_yard',[{n:'HARVEST YARD',d:0},{n:'THE ROAD',d:2}],'bo_sign_yard',BO_SIGNS.yard[0],{i:1});
  /* the shed yard: lamps, the cart, barrels */
  for(const [x,y] of [[62,31],[66,31]]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,C.warm)}
  C.dec('wl_prop1_5',59,32,{block:true,sc:.9,npc:'bo_cart'});C.dec('kh_oqstuff_8',68,31,{block:true});C.dec('kh_oqstuff_9',60,31,{block:true});C.dec('bl_urn',58,29,{block:true,sc:.8});
  C.post(65,32,'bo_shedpost',[{n:'BARTLE CASK, CIDER',d:0}],'bo_sign_shed',BO_SIGNS.shed[0],{i:2});
  /* Mother Hesper's door and hedge garden */
  for(const [x,y] of [[69,14],[74,14]]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,C.warm)}
  for(let x=68;x<=76;x++)if(x!==71)C.dec('bl_hedge'+((hs(x,16,3)*3)|0),x,16,{block:true,sc:.85});
  C.post(70,17,'bo_hutpost',[{n:'HEDGE-WITCH',d:0}],'bo_sign_hut',BO_SIGNS.hut[0],{i:3});
  C.dec('ww_rowan',74,15,{sc:.8});C.dec('ww_cauldron',69,12,{block:true,sc:.7});
  /* the crypt field: crypts and stones in rows, a low wall, the soldiers' marker */
  for(const y of [44,50,58,64])for(let x=8;x<=56;x+=6){if(Math.abs(x-20)<=2||Math.abs(x-44)<=2)continue;if(y>=48&&y<=61&&x>=22&&x<=28)continue;const k=['bl_crypt','bl_tomb','bl_mausoleum','bl_ccross','bl_tomb','bl_obelisk'][(hs(x,y,6)*6)|0];C.DB(k,x,y,{sc:.9})}
  for(let n=0;n<110;n++){const x=5+((hs(n,1,31)*54)|0),y=42+((hs(n,2,31)*24)|0);if(C.path.has(x+','+y))continue;const d=C.DB(['bl_lean','bl_stone1','bl_wcross','bl_stone2','bl_lean'][(hs(n,3,31)*5)|0],x,y,{sc:.85+hs(n,4,31)*.25});}
  for(let i=0;i<4;i++)C.dec('bl_slab',[10,16,34,50][i]+0,47+(i%2)*0,{block:true,npc:'bo_stone',i,sc:.9});
  C.post(21,40,'bo_cryptpost',[{n:'THE CRYPT FIELD',d:0},{n:'PATROL OF OLDHAVEN',d:1}],'bo_sign_crypt',BO_SIGNS.crypt[0],{i:5});
  C.dec('gy_lantern',23,55,{block:true});C.light(23,55,C.pale);C.dec('gy_lantern',27,55,{block:true});C.light(27,55,C.warm);
  C.dec('bl_fence',22,51,{block:true,sc:.8});C.dec('bl_fence',28,51,{block:true,sc:.8});
  /* the orchards: rows of white trees every three squares, with skulls (bones) at their feet; five bear skull-apples */
  const fruiting=BO_FRUIT,isFruit=(x,y)=>fruiting.some(f=>f[0]===x&&f[1]===y);
  const orch=[[4,5,34,31],[54,5,80,23]];
  for(const [x0,y0,x1,y1] of orch)for(let y=y0+2;y<=y1;y+=3)for(let x=x0+1;x<=x1;x+=3){
    if(C.path.has(x+','+y)||!C.isOpen(x,y))continue;
    if(x>=68&&x<=76&&y>=9&&y<=17)continue;
    const fr=isFruit(x,y);
    if(!fr&&hs(x,y,52)<.12)continue;
    const k=BO_WHITE[(hs(x,y,53)*BO_WHITE.length)|0];
    if(fr){const q=fruiting.findIndex(f=>f[0]===x&&f[1]===y);C.dec('bo_tree1',x,y,{block:true,npc:'bo_tree_0',i:q,sc:1.1});C.dec('gy_bones',x+1,y+1,{sc:.7})}
    else{const d=C.DB(k,x,y,{sc:.85+hs(x,y,54)*.35});if(d&&hs(x,y,55)<.55)C.D('gy_bones',x+((hs(x,y,56)<.5)?-1:1),y+1,{sc:.55+hs(x,y,57)*.3})}}
  for(const [x,y] of [[9,9],[18,8],[30,14],[26,24],[7,20],[33,27],[16,30],[58,10],[66,6],[78,12],[74,20],[56,20]])C.dec('bl_hedge'+((hs(x,y,9)*3)|0),x,y,{block:true,sc:.7});
  /* road: dead hedges both sides with lane gaps, pale lamps, milestone, signposts */
  for(let x=3;x<=80;x++){if([20,21,43,44,45,64,71].includes(x))continue;for(const y of [33,39]){if(x>=36&&x<=52&&y===33)continue;if(hs(x,y,33)<.84)C.DB('bl_hedge'+((hs(x,y,35)*3)|0),x,y,{sc:.62+hs(x,y,34)*.22})}}
  for(let x=10;x<=78;x+=8){if(x>40&&x<48)continue;C.dec('gy_lantern',x,40,{block:true});C.light(x,40,C.pale)}
  C.milestone(8,34);
  C.post(77,38,'bo_east',[{n:'GALLOWMERE',d:1}],'bo_sign_e',BO_SIGNS.e[0],{i:4});
  C.post(5,38,'bo_west',[{n:'LANTERNREST WAYSTATION',d:-1}],'bo_sign_w',BO_SIGNS.w[0],{i:5});
  C.post(46,38,'bo_lane',[{n:'THE BONE ORCHARD',d:0},{n:'HARVEST YARD',d:2}],'bo_sign_orch',BO_SIGNS.orch[0],{i:2});
  /* people */
  C.person('bo_hesper',71,16,2);
  C.dress({trees:40,scrub:150,stones:10,bones:12,posts:4,keep:(x,y)=>(x>=2&&x<=82&&y>=33&&y<=39)||(x>=34&&x<=54&&y>=18&&y<=34)||(x>=4&&x<=80&&y>=4&&y<=32&&((y-5)%3!==0&&false))||(x>=58&&x<=76&&y>=23&&y<=33)||(x>=4&&x<=60&&y>=42&&y<=66)||(x>=66&&x<=78&&y>=8&&y<=34)});
  /* the creatures: pickers in the rows and the yard, the Reaper-Farmer at the bell, husks and ghouls in the crypt field, hounds and crows on the road */
  C.foes([['blpicker',12,15],['blpicker',20,10],['blpicker',26,22],['blpicker',8,27],['blpicker',31,28],['blpicker',16,21],['blpicker',57,12],['blpicker',66,8],['blpicker',74,21],['blpicker',62,19],['blpicker',40,29],['blpicker',48,29],
    ['blreaper',44,31],
    ['blhusk',14,48],['blhusk',38,53],['blhusk',52,60],['blghoul',30,46],['blghoul',12,60],['blghoul',48,64],['blbones',10,54],['blbones',34,62],['blbones',56,48],['blbloat',40,60],['blshade',26,60],
    ['blhound',58,34],['blhound',30,38],['blcrow',20,34],['blcrow',68,38],['blbones',64,41]]);
  for(const [k,x,y] of [['potion6',16,12],['potion6',30,40],['potion6',48,56],['potion6',74,26]])C.items.push({k,x,y,taken:false});
  C.mapNames.push({t:'The Pressing Shed',x:64,y:26,k:'place'},{t:"Hesper's Hut",x:71,y:12,k:'place'},{t:'The Harvest Yard',x:44,y:29,k:'place'},{t:'The Harvest Bell',x:44,y:27,k:'place'},{t:'The Harvest Hall',x:40,y:21,k:'place'},{t:'The White Orchard',x:18,y:16,k:'place'},{t:'The East Orchard',x:66,y:14,k:'place'},{t:'The Crypt Field',x:34,y:56,k:'place'},{t:'Crypt of the Lost Patrol',x:25,y:53,k:'place'},{t:'To Gallowmere',x:78,y:33,k:'place'},{t:'To Lanternrest',x:6,y:33,k:'place'});
  const lv=C.finish({start:{x:78,y:36,f:3}});
  if(F.reaper)lv.enemies=lv.enemies.filter(e=>e.t!=='blreaper');
  if(F.bell)for(const d of lv.decor)if(d.npc==='bo_bell'){d.k='bl_slab';d.sc=.5}
  return lv}
/* ---------- the rooms ---------- */
const boP=(C,n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){C.raw('crate',x,y,{})}};
function boShed(){
  const f=BO_SHED.front;
  blRoom({id:BO.SHED,name:'The Pressing Shed',w:15,h:9,amb:.55,rating:87,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BO.ID,x:f[0],y:f[1],f:2},
    lights:[[3,2],[11,2],[7,5],[3,7],[12,7]],lcol:{'3,2':[1.4,1.0,.6],'11,2':[1.35,.98,.58],'7,5':[.75,1.1,.95],'3,7':[1.3,.95,.6],'12,7':[.75,1.1,.95]},col:[1.3,.95,.6],
    enemies:[['blpicker',13,3],['blbones',2,2]],
    build:C=>{
      boP(C,'coopstack',6,1,{h:1.1,npc:'bo_press',solid:1,deco:false});boP(C,'coopstack',8,1,{h:1.1});boP(C,'ale',1,2,{});boP(C,'ale',13,2,{});boP(C,'ale',1,3,{});
      boP(C,'shelving',3,1,{h:1.1});boP(C,'shelving',11,1,{h:1.1});boP(C,'longtable',9,5,{h:.7});boP(C,'longtable',5,5,{h:.7});boP(C,'waterbarrel',13,6,{h:.7});boP(C,'veg',12,3,{h:.6});
      C.raw('gy_hatch2',3,5,{npc:'bo_trap',solid:1,deco:false,sc:1});C.raw('gy_bones',7,6,{block:false,sc:.7});C.raw('gy_web',1,1,{block:false,sc:.5});C.raw('gy_bones',10,3,{block:false,sc:.6});C.raw('gy_bones',2,5,{block:false,sc:.55})}})}
function boCellar(){
  blRoom({id:BO.CELLAR,name:'The Cider Cellar',w:13,h:9,amb:.38,rating:87,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BO.SHED,x:3,y:6,f:0},
    lights:[[3,2],[9,2],[6,5],[10,7]],lcol:{'3,2':[1.35,.98,.58],'9,2':[.75,1.1,.95],'6,5':[1.3,.95,.6],'10,7':[.75,1.1,.95]},col:[1.2,.95,.65],
    enemies:[['blghoul',11,3],['blbones',2,2]],
    build:C=>{
      boP(C,'ale',2,1,{});boP(C,'ale',3,1,{});boP(C,'ale',4,1,{});boP(C,'ale',9,1,{});boP(C,'ale',10,1,{});boP(C,'coopstack',11,1,{h:.95});boP(C,'waterbarrel',1,4,{h:.7});
      boP(C,'cot',2,6,{h:.55});boP(C,'longtable',5,4,{h:.7});boP(C,'candlerack',1,7,{h:1.0});
      C.raw('ale',11,5,{npc:'bo_cask',solid:1,deco:false});C.raw('coopstack',6,7,{npc:'bo_mallet',solid:1,deco:false});
      C.raw('gy_hatch2',6,1,{npc:'bo_cellarup',solid:1,deco:false,sc:.9,hidden:true});C.raw('gy_web',1,1,{block:false,sc:.5});
      C.npc('bo_bartle',4,5)}})}
function boCrypt(){
  blRoom({id:BO.CRYPT,name:'The Crypt of the Lost Patrol',w:13,h:9,amb:.35,rating:87,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BO.ID,x:BO_CRYPTH.front[0],y:BO_CRYPTH.front[1],f:2},
    lights:[[2,2],[10,2],[6,4],[2,7],[10,7]],lcol:{'2,2':[.7,1.1,.95],'10,2':[.7,1.1,.95],'6,4':[1.3,.95,.6],'2,7':[.7,1.1,.95],'10,7':[.75,1.1,.95]},col:[1.1,.95,.8],
    enemies:[['blghoul',10,5],['blbones',2,5],['blbones',10,2],['blhusk',10,7]],
    build:C=>{
      for(let i=0;i<3;i++)C.raw('gy_sarc',2+i*3,3,{block:true,sc:1.0});
      C.raw('gy_bones',2,3,{npc:'bo_rem0',solid:1,deco:false,sc:1.3,bob:.2});C.raw('gy_bones',5,3,{npc:'bo_rem1',solid:1,deco:false,sc:1.3,bob:.2});C.raw('gy_bones',8,3,{npc:'bo_rem2',solid:1,deco:false,sc:1.3,bob:.2});
      C.raw('gy_candles',11,3,{block:true,sc:.8});C.raw('gy_candles',1,6,{block:true,sc:.8});C.raw('gy_web',1,1,{block:false,sc:.5});C.raw('gy_coffin',11,6,{block:true,sc:.9});C.raw('gy_bones',7,6,{block:false,sc:.7});
      if(!boF().daceFree){const kp=KH_KEEPERS.bo_dace;C.raw(khFaceKey(kp.face),6,1,{npc:'bo_dace',solid:1,deco:false,sc:kp.sc||1,block:true})}}})}
function boHut(){
  blRoom({id:BO.HUT,name:"Mother Hesper's Hut",w:11,h:8,amb:.6,rating:87,floor:'wood',wall:'kh_ohwall1_2',
    back:{to:BO.ID,x:BO_HUTH.front[0],y:BO_HUTH.front[1],f:2},
    lights:[[2,2],[8,2],[5,5]],lcol:{'2,2':[1.4,1.0,.6],'8,2':[.8,1.15,.9],'5,5':[1.35,.98,.58]},col:[1.3,.95,.6],
    build:C=>{
      boP(C,'cauldron',5,1,{h:.9});boP(C,'herbrack',2,1,{h:1.1});boP(C,'herbrack',3,1,{h:1.1});boP(C,'potshelf',8,1,{h:1.2});boP(C,'bed',9,5,{h:.7});boP(C,'cat',2,5,{h:.26});boP(C,'longtable',4,4,{h:.7});boP(C,'candlerack',1,3,{h:1.0});boP(C,'waterbarrel',9,6,{h:.7});
      C.raw('gy_web',1,1,{block:false,sc:.5});C.npc('bo_hesper',6,4)}})}
function boHall(){
  blRoom({id:BO.HALL,name:'The Harvest Hall',w:13,h:9,amb:.45,rating:87,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BO.ID,x:BO_HALLH.front[0],y:BO_HALLH.front[1],f:2},
    lights:[[3,2],[9,2],[6,5],[2,7],[10,7]],lcol:{'3,2':[1.35,.98,.58],'9,2':[.75,1.1,.95],'6,5':[1.3,.95,.6],'2,7':[.75,1.1,.95],'10,7':[1.3,.95,.6]},col:[1.2,.95,.65],
    enemies:[['blpicker',3,3],['blhusk',10,5]],
    build:C=>{
      boP(C,'longtable',4,4,{h:.7});boP(C,'longtable',6,4,{h:.7});boP(C,'longtable',8,4,{h:.7});boP(C,'hearth',6,1,{h:1.3});boP(C,'bookshelf',2,1,{h:1.1});boP(C,'bookshelf',10,1,{h:1.1});boP(C,'dresser',11,3,{h:1.0});boP(C,'banner',3,1,{h:1.5,block:false});
      C.raw('gy_book',6,4,{npc:'bo_ledger',solid:1,deco:false,bob:.38,sc:1});C.raw('gy_chest',11,6,{npc:'bo_hallchest',solid:1,deco:false,sc:.9});
      boP(C,'coatrack',1,5,{h:1.0});C.raw('gy_bones',3,7,{block:false,sc:.7});C.raw('gy_web',1,1,{block:false,sc:.5})}})}
/* Captain Dace, once freed, lies in the infirmary at Lanternrest (blight_lanternrest.js builds that room and calls this when it exists) */
function blrDaceIn(){try{if(typeof blrDaceAdd==='function')blrDaceAdd()}catch(e){console.error(e)}}
for(const [id,fn] of [[BO.SHED,boShed],[BO.CELLAR,boCellar],[BO.CRYPT,boCrypt],[BO.HUT,boHut],[BO.HALL,boHall]])
  KH_LAZY[id]=()=>{if(!LEVELS[id]){if(!LEVELS[BO.ID])KH_LAZY[BO.ID]();fn()}return LEVELS[id]};
/* the quest rings */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx}),T=QRF.T;
  T.blq50={give:[N(9654,'bo_hesper')],act:()=>(blF().apples|0)>=3?[N(9654,'bo_hesper')]:[N(9650,'bo_tree_0')],ready:[N(9654,'bo_hesper')]};
  T.blq51={give:[N(9653,'bo_dace')],act:()=>!blF().daceFree?[N(9653,'bo_dace')]:(blF().crests|0)<3?[N(9653,'bo_rem0','bo_rem1','bo_rem2')]:[N(9660,'blr_marsh')],ready:[N(9660,'blr_marsh')]};
  T.blq52={give:[N(9652,'bo_bartle')],act:()=>blF().mallet?[N(9650,'bo_bell')]:[N(9652,'bo_mallet')],ready:[N(9652,'bo_bartle')]};
  T.blq53={give:[N(9652,'bo_bartle')],act:()=>blF().cask?[N(9661,'blr_tolliver')]:[N(9652,'bo_cask')],ready:[N(9662,'blr_tolliver')]}}
blRegister(5,boBuild,{fromE:{x:78,y:36,f:3},fromW:{x:4,y:36,f:1},exitY:36,rooms:[9651,9652,9653,9654,9655],names:{9651:'The Pressing Shed',9652:'The Cider Cellar',9653:'The Crypt of the Lost Patrol',9654:"Mother Hesper's Hut",9655:'The Harvest Hall'},rating:{9651:87,9652:87,9653:87,9654:87,9655:87}});
BL_ROAD[4].W=BO.W;BL_ROAD[4].H=BO.H;
