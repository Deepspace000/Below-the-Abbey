/* ==========================================================================
   THE WITCH'S WOOD: THE PEOPLE, THE EIGHT CHAINED QUESTS AND THE WITCH (prefix ww / wwo_ for people / wwq for quests). "Into the Oven".
   1 The Boy Who Followed the Smell (Goodwife Marrow: three clues in the wood)   2 Salt and Iron (Goody Prue: salt from Brother Tuck, a horseshoe from Fenn the smith)
   3 The Hag-Stone and the Rowan (Sexton Moss: the dry brook and the old chapel; he makes the Witchbane Charm)   4 Break the Witch's Wards (Brother Tuck: three bone totems)
   5 The Key to the Cellar (Constable Fudge: the Flesh-Pile carries it)   6 Little Prisoners (Goodwife Marrow: three cages in the cellar)
   7 Into the Oven (Mayor Thistlewood: drive Grisselda out of her parlour, corner her in the kitchen, push her into the oven)   8 The Last Crumbs (Goody Prue: the recipe book; a gingerbread stall opens).
   Flags (G.flags): wwBoot wwRibbon wwCrumbs wwSalt wwIron wwHag wwRowan wwCharm wwT1..3 wwCellarOpen wwCage1..3 wwFreedN wwHostile wwFled wwCornered wwDead wwRecipe wwStall wwHpFrac.
   Every step can be done before its quest is taken (nothing is lost), and every flag is saved. Rewards are for a party at level 82 (every quest pays double, see QREW_MUL): about 84,000 XP in all.
   ========================================================================== */
const wwF=()=>G.flags;
/* ---- the things carried ---- */
ITEMDEF.wwsalt={n:'Blessed Salt',k:'quest',t:'Quest item',ic:'herb',c:'#e8e8e0',stack:1,price:1,d:'A twist of paper with salt that Brother Tuck blessed at Michaelmas, and again on a Tuesday for good measure. Witches dislike it.',sw:.1};
ITEMDEF.wwhorseshoe={n:'Cold Iron Horseshoe',k:'quest',t:'Quest item',ic:'key',c:'#8a8a94',stack:1,price:1,d:'A horseshoe hammered by Fenn Ironside under a half moon, never worn by any horse. Witches dislike it very much.',sw:.3};
ITEMDEF.wwhagstone={n:'Hag-Stone',k:'quest',t:'Quest item',ic:'gem',c:'#8a9a8a',stack:1,price:1,d:'A round grey stone with a hole worn through it by the water of the dry brook. Look through the hole and a witch cannot hide.',sw:.2};
ITEMDEF.wwrowan={n:'Rowan Sprig',k:'quest',t:'Quest item',ic:'herb',c:'#c84030',stack:1,price:1,d:'A sprig of rowan with red berries, taken from the yard of the ruined chapel. The old people hung it over their doors against witches.',sw:.05};
ITEMDEF.wwcharm={n:'Witchbane Charm',k:'quest',t:'Quest item',ic:'amulet',c:'#a0c8a0',stack:1,price:1,d:'Iron, salt, rowan and a hag-stone, tied with Sexton Moss\'s best black string. It breaks the bone totems that feed a witch\'s wards.',sw:.2};
ITEMDEF.wwkey={n:'Cellar Key',k:'quest',t:'Quest item',ic:'key',c:'#b8a070',stack:1,price:1,d:'A long iron key on a loop of sinew, taken from the Flesh-Pile. It opens the trapdoor under Grisselda Blackbriar\'s cottage.',sw:.2};
ITEMDEF.wwrecipe={n:"Grisselda's Recipe Book",k:'quest',t:'Quest item',ic:'book',c:'#6a4a3a',stack:1,price:1,d:'A greasy book of recipes in a spidery hand. The first half is gingerbread. The second half is best not read before dinner.',sw:.3};
ITEMDEF.wwginger={n:'Gingerbread Man',k:'food',t:'Treat',ic:'bread',c:'#a8602a',heal:34,feed:50,stack:1,price:12,sw:.2,d:'A small gingerbread man with white icing and a hopeful look. Sold on the stall in Wenlock market, and perfectly safe.'};
ITEMDEF.wwring={n:'Hag-Stone Ring',k:'ring',t:'Ring',ic:'ring',c:'#78b880',price:0,lvl:82,pas:{ward:12,dodge:.06,regen:.5},int:6,hp:60,rar:1,sw:.1,d:'A ring set with a stone that has a hole worn through it. Look through the hole and you see what is really there. Adds 6 Intelligence and 60 health, every blow on the wearer is 12 lighter, enemies miss 6% more, and wounds close steadily. Needs level 82.'};
ITEMDEF.wwhat={n:"Grisselda's Singed Hat",k:'head',t:'Helm',ic:'head',c:'#2a2a2e',armor:15,price:0,lvl:82,pas:{dmgPct:.05,dodge:.03},rar:1,gear:1,sw:.36,d:'A tall black pointed hat, scorched at the brim, smelling faintly of gingerbread and very faintly of justice. It is a little too big for everyone. Armour 15, damage +5%, enemies miss 3% more. Needs level 82.'};
const WW_REW={wwq1:{gold:400,xp:3000},wwq2:{gold:350,xp:3000,items:['potion5']},wwq3:{gold:500,xp:3500,items:['wwcharm']},wwq4:{gold:600,xp:4500,items:['potion6']},wwq5:{gold:800,xp:4500,items:['potion6']},
  wwq6:{gold:1000,xp:4500,items:['potion6','potion6']},wwq7:{gold:6000,xp:11000,items:['wwring','potion6','potion6']},wwq8:{gold:1500,xp:4000,items:['wwhat','wwginger']}};
for(const k in WW_REW){WW_REW[k].gold=Math.round(WW_REW[k].gold*1.1);WW_REW[k].xp=Math.round(WW_REW[k].xp*1.1)}   // a little above Wenlock's own rewards: the wood is level 82
function wwQ(id,title,who,steps,extra){const q=yrQ(id,title,who,steps,WW_REW[id],extra);QAREA[id]='Wenlock';return q}
/* a person who gives a quest once a condition holds (the mark over the head follows); yieldIf: leave the person alone while the town's older quests need them */
function wwGive(npcId,qid,cond,dlg,yieldIf){
  const dsc=Object.getOwnPropertyDescriptor(QGIVER,npcId),oldGet=dsc&&dsc.get?dsc.get:()=>dsc?dsc.value:null;
  Object.defineProperty(QGIVER,npcId,{enumerable:true,configurable:true,get(){const o=oldGet.call(QGIVER),l=[].concat(o||[]);if(cond()&&qSt(qid)!=='done'&&!(yieldIf&&yieldIf()))l.push(qid);return l.length?l:null}});
  yrHook(npcId,d=>{if(qSt(qid)==='done'||!cond()||(yieldIf&&yieldIf()))return null;return qNode(qid,dlg)})}
/* one-off line from a person, given when the quest is active and the flag not yet set; item: given to the bag */
function wwGift(npcId,qid,flag,item,text,line){
  yrHook(npcId,d=>{const F=wwF();if(qSt(qid)==='active'&&!F[flag]){F[flag]=1;if(item){if(!bagAdd(mkItem(item)))msg('Your bag is full.','#d09a80')}yrStep(text);return say(line,[BYE])}return null})}
/* what a person says once the witch is in the oven */
function wwAfter(npcId,lines,yieldIf){yrHook(npcId,d=>{if(!wwF().wwDead||(yieldIf&&yieldIf()))return null;return yrLines('wwa_'+npcId,lines)})}
const wlActive=()=>Object.keys(G.quests).some(k=>/^wlq/.test(k)&&qSt(k)==='active');
/* ---- Wenlock's new people (placed by wlPlaceFolk, see the end of this file) ---- */
khNpc('wwo_marrow','Goodwife Marrow','kh_ohfolk3_5',d=>{
  const F=wwF();if(F.wwDead)return yrLines('wwo_marrow',["Pip has been told never to follow a smell again. He has been told by me, by the constable and by a crow. He says he will follow a pie, though. That is different.","I have made the biggest pie in the county, and it is for you, and you may not eat it until you are sitting down."]);
  if(F.wwFreedN)return yrLines('wwo_marrow',["They are home, every one, and they are not to be let out of my sight until Michaelmas. Now go and see the mayor, dears. He has a plan, and a very large pair of oven gloves."]);
  if(qSt('wwq1')==='done')return yrLines('wwo_marrow',["Goody Prue is on the green, by the pond. Tell her about the gingerbread. She will go quiet, and then she will say something useful."]);
  return say("Pip! Pip! ... Oh. Sorry. You are not Pip. I have been calling him up the lane since Tuesday.",[BYE])},{sc:1});
khNpc('wwo_pip','Pip','kh_ohfolk1_4',()=>yrLines('wwo_pip',["She was nice at first. She gave me gingerbread. Then she gave me a list. The list was very long and it had the word BASTE on it eleven times.","I did not like the cage. The cage was not even a good cage. I could have got out, except for the key. And my legs. And the crows.","Button is home, and I am home, and I am never going to smell anything again."]),{sc:.78});
khNpc('wwo_twins','The Pottle twins','kh_ohfolk1_3',()=>yrLines('wwo_twins',["She said we were a bit thin. Then she said, 'We will fix that.' I did not like that she said, 'We.'","We were in the cage for three days and we have been told it is rude to say it was boring, but it was a bit boring. Mostly it was frightening, and then boring."]),{sc:.74});
khNpc('wwo_hannah','Little Hannah','kh_ohfolk3_0',()=>yrLines('wwo_hannah',["The witch kept my doll. She said it was for the stew. I told her it was not that sort of doll.","I knew somebody would come. Mummy always comes. She just takes a while to find her shoes."]),{sc:.7});
khNpc('wwo_buttonw','Button, the dog','kh_oqdogs_3',()=>yrLines('wwo_buttonw',["Woof. (He is wearing a small ribbon, and he is looking at every crow in Wenlock with great suspicion.)","Woof. (He leans on your leg, and then lies on your foot, so that you cannot leave.)"]),{sc:1});
khNpc('wwo_gingerstall','Pip at the gingerbread stall','kh_ohfolk2_4',d=>{
  const stock=[['wwginger',30],['bread',12],['pie',8],['cheese',6],['apple',10]];
  return say("GINGERBREAD! Fresh this morning, from the book of recipes with all the nasty bits torn out. Goody Prue says it is perfectly safe, and she tasted it first, and she is still here. A bite? A man? A whole biscuit barrel?",[['Buy something.',()=>{G.talk=null;openShop(d,stock,'The Gingerbread Stall');return null}],['Just looking.',()=>null]])},{sc:1});
khNpc('wwo_lanesign','A signpost','greensign',()=>say("A crooked signpost at the top of Blackbriar Lane, with a painted skull on the board and the word BLACKBRIAR, which somebody has underlined twice. Below, in a smaller hand: NO CHILDREN. Below that, in a hand much wobblier: that means YOU, Pip. At the very bottom, scratched with a nail: THE GATE IS NOT LOCKED. THAT IS THE WORRYING PART.",[BYE]));
/* ---- the quests of the wood ---- */
const wwObj=(id,name,alias,fn)=>khNpc(id,name,'ww_'+alias,fn);
/* clue 1: the boot (the gate glade), clue 2: the ribbon (on the track), clue 3: the crumbs (on the track) */
wwObj('wwo_boot',"A child's boot",'boot',d=>{const F=wwF();if(!F.wwBoot){F.wwBoot=1;yrStep("You have found a child's boot.");d.found=true;d.block=false;return say("A small boot, lying on its side in the moss, one lace chewed. It is a good boot, with a patch on the toe that somebody sewed with love and not much skill. The boy left here in a hurry, or was carried. A smell of ginger hangs on the air, thick as soup.",[BYE])}return say('A small, muddy boot.',[BYE])});
wwObj('wwo_ribbon','A blue ribbon on a thorn','ribbon',d=>{const F=wwF();if(!F.wwRibbon){F.wwRibbon=1;yrStep('You have found a blue ribbon on a thorn.');d.found=true;d.block=false;return say("A blue ribbon, tied in a bow round a bare thorn twig. Whoever tied it knew how to make a bow, and wanted it seen. It points, very slightly, north.",[BYE])}return say('A blue ribbon.',[BYE])});
wwObj('wwo_crumbs','A trail of breadcrumbs','crumbs',d=>{const F=wwF();if(!F.wwCrumbs){F.wwCrumbs=1;yrStep('You have found a trail of breadcrumbs.');d.found=true;d.block=false;return say("Crumbs. Real bread, very small, in a line that wanders through the moss and goes on, north, as if someone were leaving them on purpose. The crows have been at the first half. Nobody has touched the second half. Somebody is being clever, and somebody else knows.",[BYE])}return say('Crumbs.',[BYE])});
wwObj('wwo_hagstone','A round grey stone','hagstone',d=>{const F=wwF();if(!F.wwHag){F.wwHag=1;if(bagAdd(mkItem('wwhagstone')))yrStep('You have found a hag-stone.');d.found=true;d.block=false;return say("In the cracked mud of the dry brook, a round grey stone with a hole worn right through it. You look through the hole. Where a rotten bridge stood a moment ago, there is, very faintly, a green path, going north. You put the stone in your pocket. It is warm.",[BYE])}return say('A hole in a stone.',[BYE])});
wwObj('wwo_rowan','A sprig of rowan','rowan',d=>{const F=wwF();if(!F.wwRowan){F.wwRowan=1;if(bagAdd(mkItem('wwrowan')))yrStep('You have picked a rowan sprig.');d.found=true;d.block=false;return say("A little rowan tree in the yard of the ruined chapel, the only green thing for a mile, with berries as red as a warning. You take a sprig. Somewhere behind the chapel wall, something sighs, as if it had been waiting a very long time for a sensible person.",[BYE])}return say('A small rowan tree.',[BYE])});
/* the bone totems: the party smashes them with the charm */
function wwTotem(n){return d=>{const F=wwF(),fl='wwT'+n;
  if(F[fl])return say('Splinters of bone and a scorch of green on the ground.',[BYE]);
  if(!F.wwCharm)return say("A totem of lashed sticks, hung with skulls, feathers and rags, with a bone cross on the top that glows faintly green. It hums. Your blows would only bounce off it. Whatever breaks it must hurt a witch: iron, salt, rowan, a hag-stone.",[BYE]);
  return say("The totem hums at you. The Witchbane Charm is hot in your hand. Break it?",[['Smash the totem.',()=>{
    F[fl]=1;d.found=true;d.block=false;sfx('win');const k=(F.wwT1?1:0)+(F.wwT2?1:0)+(F.wwT3?1:0);
    yrStep(k>=3?'The last totem is broken. The wards on the cottage are gone.':'A bone totem is broken ('+k+' of 3).');
    try{const L=LEVELS[WW.ID];for(let i=0;i<2;i++)wwSummonAround(d.x,d.y,'wwcrow',1)}catch(e){console.error(e)}
    return say("You swing the horseshoe and press the charm to the bone cross. The whole totem shrieks like a kettle, the skulls chatter, the rags catch with a green flame, and then it falls apart in a rain of bones. Out of the branches, two crows with extremely strong opinions come to say so. "+(k>=3?"At last, far to the north, something enormous goes CLICK, like a door that has lost its lock.":"Two to go, if there are two more."),[BYE])}],['Leave it.',()=>null]])}}
for(const n of [1,2,3])khNpc('wwo_totem'+n,'A bone totem','ww_totem',wwTotem(n));
/* signposts in the wood */
const WW_SIGNS=["A signpost made of two planks and a skull. THIS WAY, says one arrow. THAT WAY, says the other. They point in the same direction.","TO THE COTTAGE, says the sign, in cheerful paint. Under it, in smaller letters: wipe your boots. Under that, in the smallest letters of all: and say your prayers.","A plank nailed to a stump: FOLLOW THE DIRT, NOT THE LIGHTS. Somebody has underlined LIGHTS, and then drawn a very small, unhappy face.","DANGER, says the sign. DANGER OF WHAT, someone has scratched under it. The answer, in a very different hand, is: YES.","BLACKBRIAR WOOD. PLEASE KEEP TO THE PATH. THE PATH IS A SUGGESTION. THE DIRT IS A PROMISE. WELCOME.","Carved into a root: MORE GINGERBREAD THIS WAY. The root has teeth marks on it."];
khNpc('wwo_sign','A signpost','ww_sign',d=>say(WW_SIGNS[(d.i||0)%WW_SIGNS.length],[BYE]));
/* the cages: with the key, the party lets the captives out and they run for Wenlock */
function wwCage(n,who,run){return d=>{const F=wwF(),fl='wwCage'+n;
  if(F[fl])return say('An empty cage with its door open, and a very small boot print in the dust.',[BYE]);
  if(!F.wwCellarOpen)return say('The cage is locked.',[BYE]);
  return say(who,[['Open the cage.',()=>{F[fl]=1;F.wwFreedN=(F.wwFreedN||0)+1;d.k='ww_cageempty';sfx('key');sfx('win');
    yrStep(F.wwFreedN>=3?'The last cage is open. Every captive is free.':'A cage is open ('+F.wwFreedN+' of 3).');
    if(!F.wwHostile){F.wwHostile=1;try{msg('Far above you, a door slams. A cackle shakes the cellar roof: "Who is touching my larder?"','#e8a0a0')}catch(e){}}
    return say(run,[BYE])}],['Not yet.',()=>null]])}}
khNpc('wwo_cage1','A hanging cage','ww_cagefull',wwCage(1,"Two small faces look out between the bars. 'Are you the constable?' whispers the little one. 'Are you a crow? You are not a crow. Please, the key is on a hook upstairs, I saw it, she said it was where the hat goes.' It is Pip, and his dog's collar is round his wrist.","You turn the great key. The cage door groans open. Pip comes out like a cork and hugs your knees, and tells you everything at once, in order of importance, which is not the order it happened in. 'RUN,' you say, and he runs, up the stair, out of the cottage and down the track, shouting for his mother and, for some reason, for a pie."));
khNpc('wwo_cage2','A hanging cage','ww_cagefull',wwCage(2,"Two small faces peep out of the dark. 'We are the Pottle twins,' says one. 'We are in the middle of a game of cards,' says the other. 'We are losing,' says the first, 'and she is cheating.'","The key turns. The Pottle twins climb out in perfect step, brush off their knees and say, 'Thank you,' together, which is the most frightening thing that has happened all day. Then they run, one after the other, and you hear them, far up the stair, arguing about who was first."));
khNpc('wwo_cage3','A hanging cage','ww_cagefull',wwCage(3,"A girl in a muddy pinafore sits in the cage with her arms folded and a face like a thundercloud. 'My name is Hannah,' she says, 'and I want my doll, and I want my mother, and I want a word with that woman.'","You open the cage. Hannah steps out, shakes her pinafore straight, looks up the stair as if she means to go and find the witch herself, and then thinks better of it and runs for home. 'Tell her the doll is not for the stew,' she shouts, from the dark."));
khNpc('wwo_button','Button, a small dog','kh_oqdogs_3',d=>{const F=wwF();if(F.wwButton)return say('The cellar is empty of dogs, and the floor is neater for it.',[BYE]);
  return say("A small brown dog is tied to a ring in the wall, with a piece of string, and the string is very chewed. He looks at you with huge, hopeful eyes, and thumps his tail on the floor.",[['Untie him.',()=>{F.wwButton=1;d.found=true;d.block=false;sfx('win');return say("Button shoots up the stair like a cannonball, barks once at the ceiling, and is gone. Somewhere far above, a crow is surprised.",[BYE])}],['Pat him.',()=>say('He licks your whole hand, thoroughly, and looks at the knot again.',[BYE])]])});
/* ---- Grisselda Blackbriar: sugar until she is not ---- */
const WW_TAUNTS=["Grisselda shrieks: 'Sugar and spice and everything NASTY!'","Grisselda cackles: 'I have been baking since before your grandfather was a bad idea!'","Grisselda howls: 'Nobody knocks! NOBODY KNOCKS!'","Grisselda screams: 'My gingerbread! You have stood on my gingerbread!'","Grisselda crows: 'Oh, I shall enjoy you. With gravy.'","Grisselda spits: 'I have eaten better heroes than you before breakfast. Well. Toasted.'"];
function wwHostile(d){const F=wwF();F.wwHostile=1;if(d){d.found=true;d.block=false}
  if(LEVEL===WW.COTTAGE&&!F.wwFled&&!F.wwDead&&!G.enemies.some(q=>q.t==='wwwitch'&&q.hp>0)){addEnemy('wwwitch',8,6,true)}}
khNpc('wwo_grisselda','Grisselda Blackbriar','wwi_witch',d=>{const F=wwF();
  const base=()=>say("Visitors! Oh, you poor chilled things, come in, come in, wipe your boots on the cat. I am only an old woman who bakes. Sit by the cauldron, it is only soup. It is mostly soup. It is certainly not anyone I know.",[
    ['Ask about the missing children.',()=>say("Children? What children? Wenlock has no children, dear, only small loud rumours. Whatever would I do with a child? Roast... host. HOST. Ahem. Nobody comes this far up the lane, nobody at all. I have not seen a soul in years, and the soul I did see was extremely tasty, I mean, extremely tiresome.",[['Ask about the gingerbread.',()=>base()],['Draw weapons.',()=>fight()],BYE])],
    ['Take a gingerbread.',()=>{if(!F.wwGaveGinger&&bagAdd(mkItem('wwginger'))){F.wwGaveGinger=1;return say("Take one, take one! It has never harmed a soul. Well, only the first bite. (You take a gingerbread man. It smiles at you. It is, you notice, not quite smiling in the way gingerbread should.)",[['Ask about the missing children.',()=>base()],['Draw weapons.',()=>fight()],BYE])}return say("Oh, you have one already. Greedy! I like that in a person. It means more of them for the pot.",[['Draw weapons.',()=>fight()],BYE])}],
    ['Draw weapons.',()=>fight()],BYE]);
  const fight=()=>{G.talk=null;wwHostile(d);sfx('rattle');msg('Grisselda drops the spoon. "Oh, I did so hope you would not. CROWS!"','#e8a0a0');return say("The old woman's smile slides off her face like butter off a hot knife. 'Oh, I did so hope you would not,' says Grisselda Blackbriar. 'Hands off my kettle. Hands off my children. Hands off my pretty, pretty kitchen. CROWS!' The rafters come alive with wings.",[BYE])};
  return base()},{sc:1.05});
/* the oven, and the witch in the corner of it */
khNpc('wwo_oven','The great oven','ww_oven',d=>{const F=wwF();
  if(F.wwDead)return say("The great iron door is shut, and the latch has dropped by itself. The oven is warm, and quiet, and there is a very faint smell of ginger. Nobody knocks from the inside.",[BYE]);
  if(F.wwCornered)return say("The oven door stands open, and the fire inside is a deep, patient red. Behind you, Grisselda is cornered against the brick, which is where she is going.",[BYE]);
  return say("A great brick oven, black with a hundred years of soot, big enough to put a pig in, or a person, or a small committee. The iron door hangs open and the fire inside is a deep, patient red. A long iron peel leans against the brick. It is a very good oven. It is a very, very good oven.",[BYE])});
khNpc('wwo_witchc','Grisselda Blackbriar','wwi_witchA',d=>{const F=wwF();
  const done=()=>{F.wwDead=1;d.found=true;d.block=false;sfx('door');sfx('locked');sfx('win');yrStep('Grisselda Blackbriar is in the oven, for good.');
    const od=G.decor.find(q=>q.npc==='wwo_oven');if(od)od.sc=od.sc||1;
    const rd=G.decor.find(q=>q.npc==='wwo_recipe');if(rd){rd.found=false}
    return null};
  const beg=()=>say("Stop! Stop, stop, STOP. Let us be sensible. I am a frail old woman, and you are a large, heavily armed committee. I have gold. I have a very good ring. I have a recipe for ginger nuts that has made men weep. I shall give back every child, every goat and every hat in my possession, and I shall move to the seaside, and I shall take up knitting.",[
    ['Push her into the oven.',()=>say("You step forward. She steps back. The backs of her knees meet the oven door, which is open, and which is, as it happens, quite hot. 'Now, dearies,' says Grisselda, with a dreadful bright smile, 'let us not do anything hasty with the...'",[['Push.',()=>say("You push. It is, in the end, surprisingly easy. She is surprisingly light, mostly hair and complaint. She goes in with a shriek, a swish of black skirts and one boot. The iron door swings shut with a CLANG that goes through the whole cottage, and the latch drops by itself. For a moment the oven roars. Then there is a smell of ginger, and burnt sugar, and, faintly, relief.",[['Listen.',()=>say("From inside the oven, very small and very far away: 'I would like it noted that I was only trying to be friendly.' Then the fire pops, and there is nothing at all. Out in the wood the crows stop calling. Somewhere above you, an old clock starts to tick again, as if it had been holding its breath for sixty years.",[['Leave the oven shut.',()=>done()]])]])],['Wait.',()=>beg()]])],
    ['We would like to hear you beg a little more.',()=>say("Oh, you cruel, cruel children! Very well. I am sorry. I am extremely, enormously, gingerbreadly sorry. I shall never boil anyone again. I shall be so good. I shall leave a light on for the little ones. I... you are not listening. You are looking at the oven. Please do not look at the oven.",[['Push her into the oven.',()=>beg().opts[0][1]()],['Walk away.',()=>null]])],
    ['Walk away.',()=>null]]);
  return beg()},{sc:1.05});
khNpc('wwo_recipe',"Grisselda's recipe book",'ww_gingerman',d=>{const F=wwF();if(!F.wwDead)return say('Nothing here.',[BYE]);
  if(!F.wwRecipe){F.wwRecipe=1;d.found=true;d.block=false;if(bagAdd(mkItem('wwrecipe')))yrStep("You have taken Grisselda's recipe book.");return say("On the table, face up and open, a greasy book in a spidery hand. The first half is gingerbread, honest gingerbread, with a drawing of a small man. The second half is a list headed THE REST. You close the book. You do not read THE REST. A gingerbread man by the cover waves at you, and you pretend you did not see.",[BYE])}
  return say('The table, a smell of ginger, and a gingerbread man who has gone very still.',[BYE])});
/* ---- 1. The Boy Who Followed the Smell: Goodwife Marrow ---- */
const WWD1=khQD("Please. Please, you look as if you can walk further than I can. My Pip is seven, and he went up Blackbriar Lane three days ago after a smell of gingerbread, and the dog went after him, and neither has come home. Nobody goes into the wood. The wood has opinions. The lane gate is not locked, because nobody has ever needed to lock it, and I would give anything for him, my pies, my chickens, my good shawl. Would you look? Not even for him, just for a sign, a shoe, anything. I cannot think past the smell of gingerbread, and neither could he.",
  "Bless you. The gate is at the top of the lane, north of the back track. Keep to the dirt in the wood, dears. Everything else in there wants a word.",
  (n,m)=>`${n} of ${m} signs of Pip found: a boot in the gate glade, a ribbon on a thorn, and crumbs on the track.`,
  "The boot, the ribbon, the crumbs. That is his boot, and that is the ribbon I sewed to his coat. He left a trail. He is a clever boy. Hansel would have been proud.",
  "He is alive, then, or he was. And the crumbs lead north, to the clearing, to the cottage. There is only one person in the wood with a cottage. Go to Goody Prue on the green. She knows the old stories, and she has been looking grim since I told her about the smell.",
  "Go and see Goody Prue, dears. She knows what to do about the cottage. I will keep the kettle on.",'Here is what we found.');
wwQ('wwq1','The Boy Who Followed the Smell','Goodwife Marrow',[["Find a child's boot in the gate glade of Blackbriar Wood, north of Wenlock (the gate is at the top of Blackbriar Lane).",()=>wwF().wwBoot,['wwo_boot']],["Find a blue ribbon on a thorn, further along the dirt track.",()=>wwF().wwRibbon,['wwo_ribbon']],["Find the trail of breadcrumbs on the track.",()=>wwF().wwCrumbs,['wwo_crumbs']]]);
wwGive('wwo_marrow','wwq1',()=>true,WWD1);
/* ---- 2. Salt and Iron: Goody Prue ---- */
const WWD2=khQD("Dear, dear. Gingerbread, and a boy, and a wood where nothing grows right. I know that smell. I smelled it when I was a girl, and my grandmother told me to hold my breath. That is Grisselda Blackbriar's cottage, and she has been hungry for sixty years. You cannot just knock. She is a witch, and witches dislike four things: iron, salt, a stone with a hole in it, and rowan. For now, go to Brother Tuck for a pinch of blessed salt, and to Fenn the smith for a horseshoe that has never been on a horse. Ask politely. Tuck bites if you hurry him.",
  "Good. Brother Tuck is by the church, and Fenn is at the forge on the high street. Do not let either of them talk about the weather.",
  (n,m)=>`${n} of ${m}: blessed salt from Brother Tuck (by the church), a cold iron horseshoe from Fenn Ironside (the forge).`,
  "Salt and iron. Good, good. You hold them like a pair of people holding hands in the dark. Now, listen.",
  "Now the other two things you must fetch from the wood itself: a hag-stone, from the dry brook, and a sprig of rowan from the old chapel. Take all four to Sexton Moss in the churchyard. He knows the old charm-making, and he will not be surprised. He is never surprised. Go with God, and a stick.",
  "Sexton Moss, in the churchyard, will make the charm. He is the only man in Wenlock who is never surprised.",'We have both.');
wwQ('wwq2','Salt and Iron','Goody Prue',[["Ask Brother Tuck, the friar by the church, for blessed salt.",()=>wwF().wwSalt,['wlo_friar']],["Ask Fenn Ironside, at the forge, for a cold iron horseshoe.",()=>wwF().wwIron,['wlo_smith']]]);
wwGive('wlo_gran','wwq2',()=>qSt('wwq1')==='done',WWD2,()=>qSt('wlq7')==='active'&&!wwF().wlq7c);
wwGift('wlo_friar','wwq2','wwSalt','wwsalt','Brother Tuck has given you blessed salt.',"Salt? Of course. Blessed it myself at Michaelmas, and then again on a Tuesday for good measure. Not a word about the sermon. She will not like it at all. Here, a pinch, in a twist of paper. Do not put it on your chips.");
wwGift('wlo_smith','wwq2','wwIron','wwhorseshoe','Fenn has given you a cold iron horseshoe.',"A horseshoe for a witch? I made twelve for the vicar's mare and she kicked off all of them. Here. Cold iron, hammered under a half moon, never worn. If you hit somebody with it, do apologise afterwards. It is only polite.");
/* ---- 3. The Hag-Stone and the Rowan: Sexton Moss ---- */
const WWD3=khQD("Prue sent you? Good. Nobody sends me anything, they just go quiet. I can make a charm, but it wants four things: the iron and the salt, which you have, and a stone with a hole in it from the dry brook, and a sprig of rowan from the old chapel's yard. The last two are in the wood. I would fetch them myself, but I only go into the ground, not through it. Bring all four, and I will make the Witchbane Charm. It is not complicated, only a little frightening, and it needs black string.",
  "Thank you. I shall be here, digging something, so as to give the impression of purpose.",
  (n,m)=>`${n} of ${m}: a hag-stone from the dry brook in the wood, rowan from the old chapel, and the iron and salt still in your bag.`,
  "The stone, the rowan, the iron, the salt. Four lovely things, and not one of them gold. Give them here, and stand back. I have never been surprised, but this is close.",
  "There. The charm is made. Iron, salt, rowan and the stone, bound with my best black string. It will break any ward of hers. Take it to Brother Tuck, he knows about the bone totems. And tell him the string was my idea.",
  "The charm will do what it must. Brother Tuck is the man to talk to about the totems.",'Here are the four things.');
wwQ('wwq3','The Hag-Stone and the Rowan','Sexton Moss',[["Find a hag-stone, a stone with a hole in it, in the dried brook that crosses Blackbriar Wood.",()=>bagCount('wwhagstone')>0,['wwo_hagstone']],["Pick a sprig of rowan in the yard of the ruined chapel, in the east of the wood.",()=>bagCount('wwrowan')>0,['wwo_rowan']],["Bring the hag-stone, the rowan, the salt and the horseshoe to Sexton Moss in the churchyard.",()=>bagCount('wwsalt')>0&&bagCount('wwhorseshoe')>0&&bagCount('wwhagstone')>0&&bagCount('wwrowan')>0]],{take:{wwhagstone:1,wwrowan:1,wwsalt:1,wwhorseshoe:1}});
wwGive('wlo_gravedigger','wwq3',()=>qSt('wwq2')==='done',WWD3,()=>qSt('wlq9')==='active');
/* ---- 4. Break the Witch's Wards: Brother Tuck ---- */
const WWD4=khQD("I looked at that cottage once, from a very long way off, and I have said a great many prayers about it since. She has three bone totems standing in the wood: one in the graveyard glade, one under the hanged man's oak, one in the circle of standing stones. They feed a ward over her door like three legs under a stool. Break them with the charm, and the door will open to anyone. A word of advice: things guard them, and the things have been waiting a long time, and are in a poor mood. Mind the golems. They are mostly shame.",
  "God go with you. And the crows will be unreasonable. That is simply who crows are.",
  (n,m)=>`${n} of ${m} bone totems broken: the graveyard glade, the hanged man's oak, the circle of standing stones.`,
  "The wards are down! I felt it in my teeth. I am not a man given to being brave, but I may lie down in a field and say that I was.",
  "Three legs gone from under the stool, and the stool is in a heap. I felt it from here. Take this, and my blessing. There is a cellar under that cottage, I am told, and the constable has heard something about a key.",
  "The wards are gone. The constable is the one to see about the key.",'The totems are down.');
wwQ('wwq4',"Break the Witch's Wards",'Brother Tuck',[["Smash the bone totem in the graveyard glade (west, the south side of Blackbriar Wood).",()=>wwF().wwT1,['wwo_totem1']],["Smash the bone totem under the hanged man's oak (west, in the middle).",()=>wwF().wwT2,['wwo_totem2']],["Smash the bone totem in the circle of standing stones (east).",()=>wwF().wwT3,['wwo_totem3']]]);
wwGive('wlo_friar','wwq4',()=>qSt('wwq3')==='done',WWD4);
/* ---- 5. The Key to the Cellar: Constable Fudge ---- */
QUESTS.wwq5={title:'The Key to the Cellar',who:'Constable Fudge',desc:"The Flesh-Pile in the root hollow, north of the well glade in Blackbriar Wood, wears the key to Grisselda's cellar. Kill it and bring the key to Constable Fudge on the village green.",need:1,goal:()=>bagCount('wwkey'),take:{wwkey:1},reward:WW_REW.wwq5};QAREA.wwq5='Wenlock';
const WWD5=khQD("A key. Yes. A poacher I arrested last month, for poaching a pigeon, which is a serious matter, told me in his cups that Grisselda's cellar key hangs round the neck of a great heap of stitched things in the root hollow. The Flesh-Pile, he called it. I did not believe him until he started weeping. The cellar is where she keeps what she keeps. You will want to kill the Flesh-Pile, and I will want to be somewhere else, with my back to it. Bring me the key, and the honour of the watch, which is mostly a hat, is yours.",
  "Good. It is in the root hollow, north of the well glade. You will smell it first. I did not go to look. I read about it, in a book, that I made up.",
  (n,m)=>"Bring me the cellar key. The Flesh-Pile in the root hollow wears it, north of the well glade.",
  "That is the key? It is very large, and it smells of a wet dog and an ending. I shall hold it at arm's length, and say that I held it.",
  "Splendid. The watch is in your debt, which is a small and creaky debt, but it is ours. The Flesh-Pile is dead, and the cellar can be opened. Mrs Marrow was asking for you. She has a plan for the cages, if there are cages.",
  "The Flesh-Pile is dead, and the key is mine to hold. Mrs Marrow has been asking after you.",'Here is the key.');
wwGive('wlo_watch','wwq5',()=>qSt('wwq4')==='done',WWD5,()=>qSt('wlq5')==='active');
/* ---- 6. Little Prisoners: Goodwife Marrow ---- */
const WWD6=khQD("You are back! You have news? A key! Then there is a chance. If they are alive at all, they will be in the cellar of that cottage, in a cage, or the closest thing she has. Open every cage, and tell them to run for home. I will be at the gate with every blanket in Wenlock and a very large stick, which I do not intend to use, unless I do.",
  "Bless you. The cellar door is in the west wall of her parlour. Go quietly. Anything that can hear will not be pleased.",
  (n,m)=>`${n} of ${m} cages opened in Grisselda's cellar (the locked door in the west wall of the cottage parlour).`,
  "They are home! Pip is home! He is eating. He has been eating for an hour. He says she gave him gingerbread, and then a list of chores, and the word BASTE was on the list eleven times. I do not know what to say, except that I shall bake for you, dears, for the rest of my life.",
  "Every child, safe, and the Pottle twins have already lost an argument with their mother. Now you must finish it. The mayor wants a word. He has been sitting on his hands, which is a great strain on a mayor.",
  "They are all home, and the mayor has a plan. Go and see him.",'Every cage is open.');
wwQ('wwq6','Little Prisoners','Goodwife Marrow',[["Open the first of Grisselda's three hanging cages in her cellar.",()=>wwF().wwCage1,['wwo_cage1']],["Open the second cage.",()=>wwF().wwCage2,['wwo_cage2']],["Open the third cage.",()=>wwF().wwCage3,['wwo_cage3']]]);
wwGive('wwo_marrow','wwq6',()=>qSt('wwq5')==='done',WWD6);
/* ---- 7. Into the Oven: Mayor Thistlewood ---- */
const WWD7=khQD("I have been informed, by several people at once, that there is a witch. In my woods. Well, to be fair, nobody said they were MY woods, but I do the paperwork. The town council, which is me, has voted. She is to be stopped. There is only one way the old stories say it can be done, and that is a very large oven, and she has one, I am told, in the kitchen. You must fight her in her parlour until she runs, follow her into the kitchen, corner her against the oven, and, and I put this as delicately as a mayor can, put her in it. Please do not put it in writing. If anyone asks, I was at a fete.",
  "Splendid. I shall be here, practising the face of a man who knew nothing.",
  (n,m)=>wwF().wwFled?(wwF().wwCornered?'She is cornered in the kitchen. The oven door is open.':'She has fled into the kitchen, the east door of the parlour. Follow her.'):`${n} of ${m}: fight Grisselda in her parlour, corner her in the kitchen, and push her into the oven.`,
  "It is done? In the oven? Both boots? Well. Well, well, well. I have never been so proud, and so ashamed, and so hungry, all at once.",
  "Wenlock owes you more than it has. The town will have a feast, and a plaque, and the plaque will be wrong. Take this, and my chain, which I shall not lend you, but which I shall mention. And let it be known: the road to the wood is open again, to anyone who wants gingerbread.",
  "She is in the oven, and the town is safe. The feast is Sunday. I shall be giving a speech, which I wrote, and which is very short, for me.",'The witch is in the oven.');
wwQ('wwq7','Into the Oven','Mayor Aldous Thistlewood',[["Fight Grisselda Blackbriar in her parlour until she flees (the cottage in the north of Blackbriar Wood).",()=>wwF().wwFled,['wwo_grisselda']],["Corner her in her kitchen, the east door of the parlour.",()=>wwF().wwCornered,['wwo_witchc']],["Push her into the oven.",()=>wwF().wwDead,['wwo_oven']]]);
wwGive('wlo_mayor','wwq7',()=>qSt('wwq6')==='done',WWD7,()=>qSt('wlq1')==='active'||qSt('wlq10')==='active'||(qSt('wlq9')==='done'&&qSt('wlq10')!=='done'));
/* ---- 8. The Last Crumbs: Goody Prue ---- */
const WWD8=khQD("She is gone, and I do not mind telling you I have not slept so well in sixty years. I will tell you a secret. I helped Grisselda's mother with a ginger nut once, long ago, when she was nice. There is a book in that kitchen, her recipe book. It has gingerbread in it, and it has a great many other things in it which should be burnt. Fetch it, and I will see it burnt, and keep only the page with the ginger nuts. This town has not had a decent gingerbread for sixty years.",
  "Good. It will be on the kitchen table, I should think, and do not read the back half. I did, once. I have never been the same about stew.",
  (n,m)=>"Bring Grisselda's recipe book from the kitchen of her cottage.",
  "That is the book. Do not open it. Give it here, with the tongs. There. It is already warm. I can feel it, trying to be funny.",
  "There. Burnt, all but one page, and one page is all a town needs. Pip is going to set up a stall in the market. You will have the first one, free, and a very small gingerbread man as a keepsake, and a hat. I do not know why a hat. It was in the kitchen, and it was looking at me.",
  "The stall is in the square, and Pip is doing a great deal of business, and I keep the page.",'Here is the book.');
wwQ('wwq8','The Last Crumbs','Goody Prue',[["Take Grisselda's recipe book from her kitchen table, in the cottage in Blackbriar Wood.",()=>wwF().wwRecipe,['wwo_recipe']],["Bring the recipe book to Goody Prue on the village green.",()=>bagCount('wwrecipe')>0]],{take:{wwrecipe:1}});
wwGive('wlo_gran','wwq8',()=>qSt('wwq7')==='done',WWD8,()=>qSt('wlq7')==='active'&&!wwF().wlq7c);
{const _t=qTurnIn;qTurnIn=function(id){const r=_t.apply(this,arguments);try{if(r){const F=wwF();if(id==='wwq3')F.wwCharm=1;if(id==='wwq8'){F.wwStall=1;try{msg('A gingerbread stall opens in the market square of Wenlock.','#ffe36a')}catch(e){}}}}catch(e){console.error(e)}return r}}
/* ---- the town reacts, a little (only people who give no quests, so nothing else is cut off) ---- */
wwAfter('wlo_boy',["The witch is in the oven! Mister, did you put her in? Did she scream? Did she say anything clever? I would have said something clever.","I am going to be a knight, or a baker, or a knight who bakes witches. Dibs."]);
wwAfter('wlo_jester',["Why did the witch go in the oven? Because she wanted to be well done. I will explain it later.","I am writing a ballad: The Ballad of the Oven. Only the first line is done. 'Oh, she was nasty and she was old.' That is the whole line."]);
wwAfter('wlo_hedge',["The crows have gone quiet, and my marrow has doubled overnight. I do not say there is a connection. I say my marrow is the biggest marrow in the county.","The witch's roses were the best in the wood. I stole a cutting. If it grows teeth, I shall take it back."]);
wwAfter('wlo_knight',["Sir Gareth wishes it known that he intended to ride north and deal with the witch, and was prevented only by the stable door, which was jammed, and which has since been mended by an unknown hand.","A knight does not boast. I will say only that an excellent party has put a witch in an oven, and that I was extremely nearby."]);
wwAfter('wlo_beekeeper',["The bees have been very quiet since the witch went. They are thinking about it. I think they are relieved.","Do not wave. Do not run. Do not say the word oven."]);
wwAfter('wlo_squire',["Piers carries the helmet, and he has been told that a hero's squire is the finest job in the world, and he is thinking of asking for a raise.","They put a witch in an oven, and I carried the helmet, and nobody noticed. That is how you know it was a good day."]);
/* ---- the witch's turn: spells, summons, and her flight to the kitchen ---- */
function wwSummonAround(x,y,t,n){let c=0;for(let r=1;r<5&&c<n;r++)for(let a=-r;a<=r&&c<n;a++)for(let b=-r;b<=r&&c<n;b++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const xx=x+a,yy=y+b;
  if(G.grid[yy]&&G.grid[yy][xx]===0&&!(xx===G.P.x&&yy===G.P.y)&&!enemyAt(xx,yy)&&!G.decor.some(q=>q.block&&!q.found&&q.x===xx&&q.y===yy)){addEnemy(t,xx,yy,true);G.enemies[G.enemies.length-1].summoned=1;c++}}return c}
function wwWitchAct(e){
  const F=wwF();e.wt=(e.wt||0)+1;F.wwHpFrac=e.hp/Math.max(1,e.maxhp);
  if(e.wt%3!==0)return 0;
  const alive=G.enemies.filter(q=>q.summoned&&q.hp>0).length,k=(e.wt/3)%4,taunt=WW_TAUNTS[(Math.random()*WW_TAUNTS.length)|0];
  e.lunge=1;sfx('screech');
  if(k===0&&afflInflict('cursed',-1,true)){msg(taunt,'#e8a0a0');msg('A green curse settles on the party like a wet blanket. The whole party is cursed.','#b080e0');return 460}
  if(k===1&&afflInflict('hagblind',-1,true)){msg(taunt,'#e8a0a0');msg('Grisselda flings a handful of green smoke. The whole party is hag-blinded, and everything has a halo.','#a0e060');return 460}
  if(alive<5){const crows=(k===3&&LEVEL===WW.COTTAGE)?'wwhound':'wwcrow';msg(taunt,'#e8a0a0');const n=wwSummonAround(e.x,e.y,crows,2);if(n){msg(crows==='wwcrow'?'The rafters empty into the room in a storm of black wings.':'Two hounds, thin as grudges, leap out of the shadows.','#e8a0a0');return 460}}
  return 0}
/* damage rules for the witch (she cannot be killed by the blows: she flees at half health, and is cornered in the kitchen) and the Flesh-Pile's key */
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){
  let lim=0;
  if(e&&e.t==='wwwitch'&&e.hp>0){lim=Math.floor(e.maxhp*(LEVEL===WW.COTTAGE?.5:LEVEL===WW.KITCHEN?.12:.05));if(e.hp-dmg<lim)dmg=Math.max(0,e.hp-lim)}
  const was=e&&e.hp>0;_he.call(this,e,dmg);
  try{
    if(e&&e.t==='wwwitch'&&e.hp>0&&lim>0&&e.hp<=lim){
      const F=wwF();
      if(LEVEL===WW.COTTAGE&&!F.wwFled){e.hp=0;e.dying=.55;F.wwFled=1;F.wwHpFrac=lim/Math.max(1,e.maxhp);yrStep('Grisselda has fled from her parlour.');
        for(const q of G.enemies)if(q.summoned&&q.hp>0){q.hp=0;q.dying=.55}
        msg('Grisselda staggers, shrieks, and flings her cauldron spoon at the ceiling. "Not the KITCHEN! You will not follow me into the kitchen, my pretties!" She is gone through the east door in a flap of skirts and a smell of burnt sugar.','#e8a0a0');sfx('screech')}
      else if(LEVEL===WW.KITCHEN&&!F.wwCornered){e.hp=0;e.dying=.55;F.wwCornered=1;yrStep('Grisselda Blackbriar is cornered against the oven.');
        for(const q of G.enemies)if(q.summoned&&q.hp>0){q.hp=0;q.dying=.55}
        const d=G.decor.find(q=>q.npc==='wwo_witchc');if(d){d.found=false;d.block=true}
        msg('Grisselda backs into the brick of the oven with her hands up. "Wait! Wait, wait, wait!" The oven door is open behind her, and glowing. She is cornered. Speak to her.','#e8a0a0')}}
    if(e&&e.t==='wwabom'&&was&&e.hp<=0){const F=wwF();if(!F.wwKeyGot){F.wwKeyGot=1;F.wwCellarOpen=1;if(bagAdd(mkItem('wwkey')))msg('Among the stitches of the Flesh-Pile hangs a long iron key. You take the cellar key.','#ffe36a');else F.wwKeyGot=0;sfx('key')}}
  }catch(x){console.error('wwhit',x)}}}
/* ---- arriving: the witch in her parlour, her kitchen, the cages, the folk of Wenlock who were freed ---- */
function wwArrive(n){
  const F=wwF();wwLights();
  if(n===WW.ID&&!F.wwSeen){F.wwSeen=1;msg('Blackbriar Wood. The fog is a wall and the trees have faces. Keep to the dirt.','#a8d890')}
  if(n===WW.COTTAGE){
    const d=G.decor.find(q=>q.npc==='wwo_grisselda');if(d){const gone=F.wwHostile||F.wwFled||F.wwDead;d.found=!!gone;d.block=!gone}
    if(F.wwHostile&&!F.wwFled&&!F.wwDead&&!G.enemies.some(q=>q.t==='wwwitch'&&q.hp>0)){addEnemy('wwwitch',8,6,true);msg('Grisselda Blackbriar stands by her cauldron with the spoon in her fist and murder in her smile. "Thieves! In my house!"','#e8a0a0')}
    if(F.wwDead){/* the parlour after: nothing more to do */}
  }
  if(n===WW.CELLAR){for(const nn of [1,2,3]){const c=G.decor.find(q=>q.npc==='wwo_cage'+nn);if(c&&F['wwCage'+nn])c.k='ww_cageempty'}const b=G.decor.find(q=>q.npc==='wwo_button');if(b&&F.wwButton){b.found=true;b.block=false}}
  if(n===WW.KITCHEN){
    if(F.wwFled&&!F.wwCornered&&!F.wwDead&&!G.enemies.some(q=>q.t==='wwwitch'&&q.hp>0)){addEnemy('wwwitch',6,4,true);const w=G.enemies[G.enemies.length-1];w.hp=Math.max(1,Math.ceil(w.maxhp*(F.wwHpFrac||.49)));msg('Grisselda is waiting by the oven with a face like a split melon. "Come in, then. Come in and be BAKED."','#e8a0a0')}
    const c=G.decor.find(q=>q.npc==='wwo_witchc');if(c){const on=F.wwCornered&&!F.wwDead;c.found=!on;c.block=on}
    const r=G.decor.find(q=>q.npc==='wwo_recipe');if(r){const on=F.wwDead&&!F.wwRecipe;r.found=!on}}
  if(n===WL.ID){
    const show={wwo_pip:F.wwCage1,wwo_twins:F.wwCage2,wwo_hannah:F.wwCage3,wwo_buttonw:F.wwButton||F.wwCage1,wwo_gingerstall:F.wwStall};
    for(const id in show){const d=G.decor.find(q=>q.npc===id);if(d){d.found=!show[id];d.block=false}}}}
/* ---- 9. The Lost Washing: Goody Prue (after Salt and Iron). Three smocks blew off her line into Blackbriar Wood and are caught on thorns along the dirt track. ---- */
WW_REW.wwq9={gold:1400,xp:6000,items:['potion6','potion6']};
const WWD9=khQD("Oh, you again, and just in time. The wind took my washing on Monday. Three good smocks, off the line and over the wall, and straight up Blackbriar Lane into the wood. I am not going in there for a smock. Not for three. Would you? They will be hanging on thorns along the dirt track, wherever the wind dropped them. Bring them back and I will wash yours for free for the rest of your life, which at your rate of travel may be short.",
  "Bless you. Stay on the dirt track and keep your hands off anything that glows.",
  (n,m)=>`${n} of ${m} smocks found. They are caught on thorns along the dirt track in Blackbriar Wood, north of Wenlock.`,
  "All three! Look at them. One has a bit of moss on it, but that is the wood's doing and not mine. They are still damp, so they have not been up there long.",
  "Here is something for the trouble. I will not ask what it was like in there. I do not want to know about the trees.",
  "The smocks are dry and folded and the line has new pegs. Thank you again.","All three smocks are here.");
wwQ('wwq9','The Lost Washing','Goody Prue',[1,2,3].map(i=>['Find smock number '+i+' of 3, caught on a thorn along the dirt track in Blackbriar Wood.',()=>wwF()['wwSmock'+i],['wwo_smock'+i]]));
wwGive('wlo_gran','wwq9',()=>qSt('wwq2')==='done'&&(qSt('wwq7')!=='done'||qSt('wwq8')==='done'),WWD9,()=>qSt('wlq7')==='active'&&!wwF().wlq7c);
for(const i of [1,2,3])wwObj('wwo_smock'+i,'A smock on a thorn','ribbon',d=>{const F=wwF();
  if(qSt('wwq9')==='active'&&!F['wwSmock'+i]){F['wwSmock'+i]=1;yrStep('You have found a smock ('+[1,2,3].filter(k=>F['wwSmock'+k]).length+' of 3).');d.found=true;d.block=false;return say('A plain linen smock, damp and snagged on a thorn. It has a darned patch at the elbow. You fold it into your bag.',[BYE])}
  return say('A plain linen smock hangs on a thorn. It is not yours to take.',[BYE])});
/* ---- where Wenlock's new people stand (wlPlaceFolk is called by wlBuild; the freed folk and the stall stand there hidden until they are real) ---- */
const WW_PLACE=[['wwo_marrow',36,8,4],['wwo_pip',40,10,4],['wwo_twins',36,12,4],['wwo_hannah',41,12,4],['wwo_buttonw',39,9,4],['wwo_gingerstall',47,53,4]];
{const _p=wlPlaceFolk;wlPlaceFolk=function(C){_p.apply(this,arguments);try{for(const [id,x,y,r] of WW_PLACE)C.person(id,x,y,r)}catch(e){console.error('wwplace',e)}}}
