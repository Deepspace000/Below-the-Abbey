/* ==========================================================================
   PLACE 9 OF THE BLIGHTED ROAD: THE ROOKERY MILL (level 9690, rated 89; prefix blr / BLR). 80 by 70.
   A windmill on a hill, and a court of crows that watch the road for the Pale Sovereign. The road runs east to west along y 34 to 36 (east gate x 78 back to Hollowbell Abbey, 9680; west gate x 1 on to the Pale Bridge, 9700).
   A millrace (a channel of black water, blocked) runs north to south across the road under a plank bridge (x 24 to 26) into a mill pond. On the hill north of the road stands the windmill (door to 9691); on the hill's east flank
   the Parliament Stones, a ring of standing stones where seven rooks and their Speaker sit in session. West of the race the Miller's house (9694); east of it a dead watermill and the sluice lever.
   Rooms: 9691 the grinding floor (Gaffer Tolly the miller's ghost), 9692 the loft (grain sacks), 9693 the cap (the Crow Queen's aerie, a spyglass), 9694 the miller's house (Dame Tolly's ghost).
   THE PARLIAMENT BARGAIN (the Speaker, blr_speaker): pay 1500 gold or give a thing of pale silver (peace: F.parl='bribe'), do the court a service (quest blq44, then F.parl='help'), or refuse and fight (F.parl='war').
   The Crow Queen (blcrowqueen, flying, front-on crow pictures, rating 89) is a boss enemy in the cap. If the court is at peace (bribe or help) she is taken out of the fight and sits there as a person; after help she gives her crown.
   Quests: blq44 The Parliament's Service (Speaker Rook), blq45 The Last Grinding (Gaffer Tolly), blq46 The Queen's Perch (Gaffer Tolly), blq47 Look West (Dame Tolly).
   Flags: G.flags.bl = {parl, th (bitmask of 3 thimbles), race (sluice open), sacks (bitmask of 3), ground, queen (killed), queenGift, glass (looked west), cartChest, millChest}.
   ========================================================================== */
const BLR={ID:9690,GROUND:9691,LOFT:9692,CAP:9693,HOUSE:9694,W:80,H:70};
BL_ROAD[8].W=BLR.W;BL_ROAD[8].H=BLR.H;
for(const [id,n] of [[9691,'The Rookery Mill: the grinding floor'],[9692,'The Rookery Mill: the loft'],[9693,'The Rookery Mill: the cap'],[9694,"The Miller's House"]]){LEVEL_NAMES[id]=n;LEVEL_RATING[id]=89}
/* ---------- things carried ---------- */
ITEMDEF.blthimble={n:'Silver Thimble',k:'quest',t:'Quest item',ic:'ore',c:'#d8dce4',stack:3,price:0,sw:.1,d:'A small thimble of pale silver, dented by a beak. The crows of the Rookery Mill collect them. They are cold, and each is stamped with a tiny crown.'};
ITEMDEF.blgrainsack={n:'Sack of Rye',k:'quest',t:'Quest item',ic:'ore',c:'#a89870',stack:3,price:0,sw:.8,d:'A small sack of dry rye, left in the loft of the Rookery Mill. It has been there so long that mice have made their peace with it. Gaffer Tolly wants it ground.'};
ITEMDEF.blrookring={n:'Rook-Feather Ring',k:'ring',t:'Ring',ic:'ring',c:'#2c3038',price:0,lvl:89,pas:{ward:19,dodge:.07,regen:.7,mpRegen:.5},int:6,hp:95,rar:1,sw:.1,d:'A ring of black iron with a single feather set into the band under glass. The Parliament gives one to anyone it owes. Adds 6 Intelligence and 95 health, every blow on the wearer is 19 lighter, enemies miss 7% more, and wounds and weariness close steadily. Needs level 89.'};
ITEMDEF.blmillcap={n:"Miller's Flour Cap",k:'head',t:'Helm',ic:'head',c:'#c8c4b8',armor:19,price:0,lvl:89,pas:{dmgPct:.06,dodge:.03,regen:.5},rar:1,gear:1,sw:.3,d:'A thick linen cap dusted with flour that never quite comes out. Gaffer Tolly wore it every day of his life at the mill. Armour 19, damage +6%, enemies miss 3% more, and wounds close steadily. Needs level 89.'};
ITEMDEF.blcrowcrown={n:"The Crow Queen's Crown",k:'head',t:'Helm',ic:'head',c:'#383c48',armor:21,price:0,lvl:89,pas:{dmgPct:.08,dodge:.05,regen:.6},rar:1,gear:1,sw:.3,d:'A crown of black feathers wired round a band of pale silver. It is much lighter than it looks, and it hums when a crow lands near. Armour 21, damage +8%, enemies miss 5% more, and wounds close steadily. Needs level 89.'};
/* ---------- creatures ---------- */
Object.assign(ENEMY_DEF,{blcrowqueen:{name:'The Crow Queen',hp:470,dmg:[12,18],hit:.9,w:2.4,img:'wwi_crow',xp:880,gold:[0,0],speed:2,fly:true,floatH:.6,verb:'rends',boss:true,aboveParty:0,bl:1,still:1,glow:.1,wake:'The biggest crow you have ever seen opens its wings across the whole cap of the mill. Every other crow in the Rookery cries out at once.'}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('blcrowqueen');
if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.blcrowqueen=[3800,4600];
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^blcrowqueen/,'bleeding',.3]);
/* the flying crow pictures of tools/crows are used for every crow of the road, and the Queen is the big Carrion Crow */
if(typeof CROW_KIND!=='undefined'){CROW_KIND.blcrow={set:'crow',span:.9,body:.709,rise:.7,sh:.7};CROW_KIND.blcrowflock={set:'flock',span:1.55,body:.576,rise:.62,sh:.95};CROW_KIND.blcrowqueen={set:'carrion',span:3.3,body:.71,rise:1.1,sh:1.5}}
/* ---------- the pictures ---------- */
function blrArt(){
  if(BLR._art)return;
  try{if(typeof blgArt==='function')blgArt()}catch(e){console.error(e)}
  bl3Tint('bl_windmill','wl_bldg1_2','saturate(.3) brightness(.62) sepia(.2)',null);
  bl3Tint('bl_watermill','wl_bldg1_3','saturate(.3) brightness(.6) sepia(.15)',null);
  bl3Ghost('bl_g_miller','kh_ohfolk4_3');bl3Ghost('bl_g_widow','kh_ohfolk3_1');
  bl3Tint('bl_thimble','gy_ring','saturate(.1) brightness(1.5)',.34);
  for(const [k,h] of [['gy_raven',1.05],['bl_g_miller',.98],['bl_g_widow',.98],['hay',.8],['kh_oqstuff_9',.5],['ww_stone',1.7],['ww_crowtree',1.9],['gy_obelisk',2.3],['gy_column',1.9],['gy_lever',.9],['kh_cart1_0',1.1]])if(NPC_H[k]===undefined||k.startsWith('bl_g_'))NPC_H[k]=h;
  BLR._art=1}
/* ---------- the sound: crows, the creak of the sails, the race ---------- */
const BLRS={nextCaw:0,nextSail:0};
function blrTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!SNDOPT.amb)return;
  if(LEVEL<BLR.ID||LEVEL>BLR.ID+9)return;const now=AC.currentTime;
  if(now>BLRS.nextCaw){BLRS.nextCaw=now+(LEVEL===BLR.ID?4:7)+Math.random()*9;try{wwsCrow(.6+Math.random()*.5)}catch(e){}}
  if(now>BLRS.nextSail){BLRS.nextSail=now+(LEVEL===BLR.ID?15:8)+Math.random()*12;try{wwsCreak(LEVEL===BLR.ID?.5:.8)}catch(e){}}}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{blrTick()}catch(e){console.error('blr tick',e)}}}
/* ---------- the court's state ---------- */
const blrParl=()=>{const F=blF();return F.parl||(qSt('blq44')==='done'?'help':null)};
const blrPeace=()=>{const p=blrParl();return p==='bribe'||p==='help'};
const blrTh=()=>{const m=blF().th|0;return (m&1?1:0)+(m&2?1:0)+(m&4?1:0)};
const blrSacks=()=>{const m=blF().sacks|0;return (m&1?1:0)+(m&2?1:0)+(m&4?1:0)};
const blrQueenDone=()=>!!(blF().queen||(blrPeace()&&true));
bl3Hide(BLR.CAP,'blr_queen',()=>!blrPeace()||!!blF().queen);
bl3OnArrive(n=>{
  if(n===BLR.CAP&&blrPeace()&&!blF().queen){const had=G.enemies.length;G.enemies=G.enemies.filter(e=>e.t!=='blcrowqueen');if(G.enemies.length!==had)G.enemies.forEach((e,i)=>e.id=i)}});
/* ---------- the people ---------- */
const BLR_TOLLY=['(A ghost in a floury apron, with a sack over one shoulder, looks up from the millstone.) Gaffer Tolly. Forty years at this mill, and I never ground a thing the whole of the time but what the farmers brought. Now it is grinding on its own, and I do not know what.','The crows came for the grain, first. A few. Then more. Then they stopped coming for the grain, and I thought, well, that is odd, and then I thought, they are looking at the road. All of them, all day. Looking west. As if they were waiting for a coach.','They have a parliament, you know. On the hill, in the old stones. They sit, and they vote, and they send for me when they have a motion. I have never once voted for anything and I have had to attend every sitting.','The Queen lives at the top. She does not like the sails to stop. I have not been up in a long time. I am told the view is very good.'];
khNpc('blr_tolly','Gaffer Tolly, a ghost','bl_g_miller',()=>yrLines('blr_tolly',BLR_TOLLY));
const BLR_WIDOW=['(A ghost in a grey shawl sits at the table, folding the same cloth over and over.) Dame Tolly. You will take tea? No. Nobody does. I put it out every afternoon, in case.','My husband is in the mill, and I am in the house, and we meet at supper. It is a very good arrangement. We have been married fifty-one years and it has never been better.','My sister lives in Sale. Mabel. She makes candles. She wrote to say the gate was shut and that they were all quite safe, and that was a very long time ago, and I should like to know if it is still shut.'];
khNpc('blr_widow','Dame Tolly, a ghost','bl_g_widow',()=>yrLines('blr_widow',BLR_WIDOW));
const BLR_ROOKS=[
  ['(A rook with a ring of silver on one leg turns its head and examines you with one eye.) "Weight, you are. Heavy. Four of you, and one in a hat that is too big. The Parliament has noted it."','(It hops.) "Do not stand behind me. I am the one who counts, and I do not like being counted back."'],
  ['(A scruffy rook bounces on a stone.) "I voted yes! I do not know what I voted for but I voted yes, and I will vote yes again, and then I will have a biscuit."','(It cocks its head.) "Have you got a biscuit? Do you have an opinion on biscuits? The Speaker says we have to have opinions."'],
  ['(A tall thin rook, quite bald in the neck, speaks very slowly.) "I am the Watcher on the West Stone. Nothing has passed in six days but a pair of riders, and one pale knight who has not blinked since the Sovereign\'s clerk was last this way."','(It does not look round.) "I do not turn my head when I am speaking to a traveller. It is a rule."'],
  ['(A glossy rook preens its wing, and talks while it preens.) "Everything in the Rookery is recorded. The speaker says so. The flaw in the system is that we all say we are going to write it down, and we all leave it to somebody else, and the Speaker has only one beak."','(It looks at you sideways.) "Do you know the best thing about being a crow? Nobody sees us eating."'],
  ['(A young rook with a very short tail looks at you, and looks away, and looks back.) "Are you the ones who are going to kill the Queen? Everybody says you are. I am not allowed an opinion. But if you did, I would not cry. Much."'],
  ['(A rook with one eye holds a bright silver button very carefully in its beak, and says something that comes out as a mumble, and puts the button down.) "Mine," it says, finally, in a firm voice, and picks it up again.'],
  ['(A big grave rook shuffles on its stone, and clears its throat in a way that makes the others stop.) "Order. The Parliament is in session. We are discussing the matter of the road, and the matter of the Sovereign, and the matter of whose turn it is to watch the west."','(It subsides.) "It is nobody\'s turn. It is always nobody\'s turn."']];
for(let i=0;i<7;i++)khNpc('blr_rook'+i,'A rook of the Parliament','gy_raven',()=>yrLines('blr_rook'+i,BLR_ROOKS[i]));
/* ---------- the Speaker and the bargain ---------- */
khNpc('blr_speaker','Speaker Rook of the Parliament','gy_raven',()=>blrSpeakerTalk());
function blrSpeakerTalk(){
  const F=blF(),p=blrParl();
  if(p==='war')return say('(The Speaker will not look at you. The stones around it are empty, and the sky above the hill is full of wings.) "The Parliament has voted," it says. "You were told the toll, and you refused it. There is nothing more to say that the Queen has not already said with her claws."',[BYE]);
  if(p==='bribe')return say('(The Speaker bows its head, a long slow bow, with one eye on your pocket.) "The Parliament has accepted your toll, and the Parliament does not forget a payment. You may cross the hill, and the mill, and the road. Mind the scarecrows. They are not ours."',[BYE]);
  if(p==='help')return say('(The Speaker preens a wing, and for once it is not looking at anything else.) "The Parliament has its thimbles back, and the court owes you a debt. A crow does not like to owe. It is the one thing we have in common with the Sovereign."',[BYE]);
  return say('(A big old rook stands on the tallest stone in the ring, with a collar of silver wire. The ring of lesser rooks falls quiet.) "The Parliament of the Rookery is in session. This is the Speaker. Everybody who crosses the hill pays the court a toll. It has always been the custom. Fifteen hundred gold, or a thing of pale silver, or a service. We are not unreasonable. We watch the road for the Sovereign, and we like to be paid for it."',[
    ['Pay the toll: 1500 gold.',()=>{if(G.gold<1500)return say('(The Speaker looks at your purse, and then at you, with great sorrow.) "You do not have it. We counted."',[BYE]);G.gold-=1500;F.parl='bribe';sfx('win');msg('You pay the Parliament 1500 gold. The court is at peace with you.','#ffe36a');blrApplyNow();return say('(The rooks lean in to hear the coins counted. The Speaker bows.) "Accepted. The Parliament will note it. You have passage, and the Queen has been told."',[BYE])}],
    ...(bagCount('blsilverclapper')>0||bagCount('blwaxseal')>0?[['Give a thing of pale silver.',()=>{if(bagCount('blwaxseal')>0)bagRemove('blwaxseal',1);else bagRemove('blsilverclapper',1);F.parl='bribe';sfx('win');msg('The Parliament takes the pale silver. The court is at peace with you.','#ffe36a');blrApplyNow();return say('(The whole ring shifts at once, and eyes the silver like a row of lamps.) "Oh. Oh, that is very fine. The Parliament accepts. We will talk about it for years."',[BYE])}]]:[]),
    ...(qSt('blq44')==='active'||qSt('blq44')==='done'?[]:[['What service would settle it?',()=>{qAccept('blq44');return say('"Three of our silver thimbles have been taken from the Rookery by the miller\'s dead, the wind, and a careless cart. They are the court\'s regalia. One is at the sluice by the millrace, east bank. One is in the mill loft. One is in the plague cart at the side of the road. Bring them to me, and the toll is settled, and the Parliament will remember it."',[BYE])}]]),
    ['We will not pay. We will fight.',()=>{F.parl='war';sfx('growl');msg('The Parliament rises in a roar of wings.','#d09a80');blrWar();return say('(A hush, and then the whole ring leaves the stones at once, in a clatter and a scream.) "Then the Parliament is adjourned," says the Speaker. "Queen! They have refused!"',[BYE])}],
    ['Goodbye.',()=>null]])}
Object.defineProperty(QGIVER,'blr_speaker',{enumerable:true,configurable:true,get(){return !blrParl()&&qSt('blq44')===null?['blq44']:null}});
function blrWar(){
  const L=LEVELS[LEVEL];if(LEVEL!==BLR.ID)return;
  for(const e of G.enemies)if(/^bl(crow|crowflock|scare)$/.test(e.t)&&e.hp>0)e.alert=true;
  for(const [dx,dy] of [[-3,-2],[3,-2],[0,3],[4,2]])bl3Add('blcrow',G.P.x+dx,G.P.y+dy,89);
  bl3Add('blcrowflock',G.P.x,G.P.y-4,89)}
function blrApplyNow(){try{bl3Apply(LEVEL)}catch(e){}}
/* ---------- the quests ---------- */
bl3Q('blq44',"The Parliament's Service",'Speaker Rook',[
  ['Find the three silver thimbles of the Parliament: at the sluice on the east bank of the millrace, in the loft of the windmill, and in the plague cart on the road.',()=>blrTh()>=3,['blr_thimble']],
  ['Give the three thimbles to the Speaker at the Parliament Stones on the hill.',()=>qSt('blq44')==='done'||!!blF().thGiven,['blr_speaker']]],
  {gold:4400,xp:37000,items:['blrookring','potion6']});
bl3Q('blq45','The Last Grinding','Gaffer Tolly, a ghost',[
  ['Open the sluice at the millrace (the lever on the east bank, by the dead watermill).',()=>!!blF().race,['blr_sluice']],
  ['Take three sacks of rye from the loft of the windmill.',()=>blrSacks()>=3||!!blF().ground,['blr_sack']],
  ['Grind the rye at the millstone on the grinding floor.',()=>!!blF().ground,['blr_stone']]],
  {gold:4000,xp:34000,items:['blmillcap','potion6']});
bl3Q('blq46',"The Queen's Perch",'Gaffer Tolly, a ghost',[
  ["Settle the Crow Queen in the cap of the mill: put her down, or make peace with the Parliament.",()=>!!blF().queen||blrPeace(),['blr_capdoor']]],
  {gold:5200,xp:40000,items:['potion6','potion6']});
bl3Q('blq47','Look West','Dame Tolly, a ghost',[
  ["Look west through the brass spyglass in the cap of the mill, and see what stands at the end of the road.",()=>!!blF().glass,['blr_glass']],
  ["Tell Dame Tolly in the miller's house what you saw.",()=>qSt('blq47')==='done',['blr_widow']]],
  {gold:3800,xp:32000,items:['potion6','potion6','potion6']});
wwGive('blr_tolly','blq45',()=>true,{
  offer:'Would you grind something for me? I want to make one last loaf, for my wife, and I cannot. The sluice is shut, so the wheel does not turn. The lever is on the east bank of the race, by the old watermill. Three sacks of rye lie in the loft, and I cannot lift them, my hands go through. A last grinding. It is a small thing to ask of the living.',
  accept:'Thank you. Open the sluice first, or the stone will not turn. The loft is up the ladder, over my head. And mind the crows. They like the rye.',
  remind:()=>'The sluice lever is on the east bank. The rye is in the loft. The millstone is here, in front of me.',
  ready:'There. It is ground. I can smell it from here, the flour on the air. Oh, it has been such a long time.',
  thanks:'I shall bake it tonight, and put it on the table. She will not eat it, but she will notice. Take my cap. It is full of fifty years of dust, and a very little luck.',
  after:'The wheel turns. It is a small thing, and the whole mill is the better for it. I can hear the water.'});
wwGive('blr_tolly','blq46',()=>qSt('blq45')==='done',{
  offer:'The Queen sits at the top of the mill, on the sail shaft, and she will not come down. She has been there since before the Sovereign\'s clerk last came through. I would like the shaft to be free. The Parliament will talk about it for ever. You could settle it. By the sword, if you must, or by whatever the crows agree to.',
  accept:'Be careful. She is bigger than she looks, and she looks the size of a wagon. The ladder goes up from the loft.',
  remind:()=>'The Queen is at the top of the mill, in the cap. You can fight her, or settle things with the Parliament on the hill.',
  ready:'The shaft is turning. I can hear it from here. It has a good, honest, regular sound.',
  thanks:'You have done the Rookery a service, and the mill a greater one. Take this, from an old miller.',
  after:'The sails go round, and nobody sits on them. I should not have thought I would miss her.'});
wwGive('blr_widow','blq47',()=>true,{
  offer:'Will you do a thing for me? My sister Mabel lives in Sale. I have not had a word from her in so long. My husband says the mill has a spyglass in the cap, a brass one, and that on a clear day you can see the walls. Would you look? Only to see whether the lamps are lit. Then come and tell me. It is a small thing, but I should so like to know.',
  accept:'Thank you, dear. The spyglass is in the cap, at the top of the mill. I do not go up. I have not the stairs for it, and I should only get dust on my shawl.',
  remind:()=>'The spyglass is in the cap of the mill, at the top. Look west.',
  ready:'Tell me. Oh, tell me what you saw. Is the gate shut? Is there a light in the candle-maker\'s window?',
  thanks:'A light in the window. That is all I wanted. You may have this, my dear, and my thanks. It is all I have to give away.',
  after:'A light in the window. I shall tell my husband. He will pretend not to listen, and he will be glad.'});
/* the thimbles are handed to the Speaker */
yrHook('blr_speaker',d=>{const F=blF();
  if(qSt('blq44')==='active'&&blrTh()>=3&&!F.thGiven)return say('(The Speaker has seen the thimbles in your hand before you have seen them yourself. Every rook in the ring turns to look.) "Those," says the Speaker, in a very small voice, "are the regalia of the court."',[['Give the three thimbles to the Speaker.',()=>{F.thGiven=1;F.parl='help';bagRemove('blthimble',9);sfx('win');msg('You return the three silver thimbles. The Parliament is at peace with you.','#ffe36a');blrApplyNow();qTurnIn('blq44');return say('(The ring erupts in a storm of wings and cheering. The Speaker bows until its beak touches the stone.) "The court is in your debt. The Queen has been told. The Parliament will remember."',[BYE])}],['Not yet.',()=>null]]);
  return null});
/* ---------- the objects ---------- */
const BLR_THIMBLE_TXT=['A bright thimble of pale silver lies in the grass by the sluice, with a small crown stamped on it.','A silver thimble sits in the straw of the loft, where a nest has been made round it.','A silver thimble shines among the planks of the plague cart, stuck into the sack of a dead pilgrim.'];
khNpc('blr_thimble','A silver thimble','bl_thimble',d=>{const F=blF(),i=(d&&d.i)|0,bit=1<<i;
  if((F.th|0)&bit)return say('A scuff in the dirt where a thimble lay.',[BYE]);
  return say(BLR_THIMBLE_TXT[i]||BLR_THIMBLE_TXT[0],[['Take the thimble.',()=>{F.th=(F.th|0)|bit;d&&(d.found=true,d.hidden=true);bl3Give('blthimble');sfx('key');msg('You take a silver thimble ('+blrTh()+' of 3).','#ffe36a');if(qSt('blq44')==='active')yrStep('You take a silver thimble ('+blrTh()+' of 3).');return null}],BYE])});
khNpc('blr_sluice','The sluice lever','gy_lever',()=>{const F=blF();
  if(F.race)return say('The sluice is open. Black water runs fast down the race, and the wheel of the dead watermill is turning, very slowly, with a sound like a long breath.',[BYE]);
  return say('A long iron lever set in a post at the head of the sluice. The lever is stiff with rust, and beyond it the black water is heaped against a wooden gate.',[['Pull the lever.',()=>{F.race=1;sfx('door');msg('The sluice opens. Black water thunders down the race.','#ffe36a');if(qSt('blq45')==='active')yrStep('You open the sluice.');return null}],BYE])});
khNpc('blr_sack','A sack of rye','kh_oqstuff_9',d=>{const F=blF(),i=(d&&d.i)|0,bit=1<<i;
  if((F.sacks|0)&bit)return say('Only a dent in the straw where the sack lay.',[BYE]);
  return say('A small sack of dry rye, tied at the neck with a bit of string. A mouse looks out of the straw, and looks away.',[['Take the sack.',()=>{F.sacks=(F.sacks|0)|bit;d&&(d.found=true,d.hidden=true);bl3Give('blgrainsack');sfx('key');msg('You take a sack of rye ('+blrSacks()+' of 3).','#ffe36a');if(qSt('blq45')==='active')yrStep('You take a sack of rye ('+blrSacks()+' of 3).');return null}],BYE])});
khNpc('blr_stone','The millstone','ww_stone',()=>{const F=blF();
  if(F.ground)return say('The millstone is warm. A drift of fine pale flour lies round it, and does not blow away.',[BYE]);
  if(!F.race)return say('A great round millstone, grey and cracked, on a bed of worn wood. It will not turn. The wheel outside has no water.',[BYE]);
  if(blrSacks()<3&&bagCount('blgrainsack')<3)return say('A great round millstone, turning slowly on its bed now that the sluice is open. It wants grain. You have '+blrSacks()+' of three sacks of rye.',[BYE]);
  return say('The millstone turns, slow and heavy, with the water behind it. A hopper above is empty and waiting.',[['Pour in the three sacks of rye.',()=>{F.ground=1;bagRemove('blgrainsack',9);sfx('win');bl3Heal();msg('The millstone grinds the rye. A soft sweet smell of flour fills the room. Every hero is healed.','#ffe9a0');return null}],BYE])});
khNpc('blr_capdoor','A ladder to the cap','gy_hatch2',()=>say('A ladder goes up through a trapdoor into the cap of the mill. The wood is polished by claws, and black feathers lie on every rung.',[['Climb the ladder to the cap.',()=>{sfx('door');G.talk=null;goToLevel(BLR.CAP,{x:7,y:9,f:0});return null}],BYE]));
khNpc('blr_looploft','A ladder up','gy_hatch2',()=>say('A ladder goes up from the grinding floor through a trapdoor into the loft.',[['Climb to the loft.',()=>{sfx('door');G.talk=null;goToLevel(BLR.LOFT,{x:2,y:7,f:0});return null}],BYE]));
khNpc('blr_loftdown','A ladder down','gy_hatch2',()=>say('The ladder back down to the grinding floor.',[['Climb down.',()=>{sfx('door');G.talk=null;goToLevel(BLR.GROUND,{x:10,y:2,f:2});return null}],BYE]));
khNpc('blr_capdown','A ladder down','gy_hatch2',()=>say('The ladder back down to the loft.',[['Climb down.',()=>{sfx('door');G.talk=null;goToLevel(BLR.LOFT,{x:10,y:2,f:2});return null}],BYE]));
khNpc('blr_glass','A brass spyglass','gy_rune',()=>{const F=blF();
  return say('A brass spyglass on a tripod, pointed at a slit window in the west wall.',[['Look through it.',()=>{const first=!F.glass;F.glass=1;if(first&&qSt('blq47')==='active')yrStep('You look west through the spyglass.');return say('You put your eye to the glass. Far down the road, over a dry ravine, a pale stone bridge stands in the haze, with a knight in pale armour at the middle of it, quite still. Beyond the bridge is a long grey wall with two towers and a gate, and over the wall the roofs of a town. In one of the windows under the wall, small and yellow and steady, a candle is burning.',[BYE])}],BYE])});
khNpc('blr_queen','The Crow Queen','gy_raven',()=>blrQueenTalk(),{sc:3.2});
function blrQueenTalk(){
  const F=blF(),p=blrParl();
  if(p==='help'&&!F.queenGift)return say('(The Crow Queen sits across the sail shaft, filling the whole cap like a black wagon. One eye, as big as a plate, follows you.) "The Parliament has told me. You returned the regalia. I owe a debt. A queen pays her debts. Take this, and know that no crow on this road will lift a beak against you."',[['Take the crown.',()=>{F.queenGift=1;bl3Give('blcrowcrown');sfx('win');msg("The Crow Queen gives you her crown of black feathers.",'#ffe36a');return null}],BYE]);
  if(p==='help')return say('(The Crow Queen turns on her perch, wings half open, and the whole mill shifts a little.) "The road is yours. I will tell the others. Do not come back with the thimbles in your pockets. I have an eye for them."',[BYE]);
  return say('(The Crow Queen sits on the sail shaft, filling the cap, and does not move. One great eye follows you. She says nothing, which for a crow is a kind of speech.) The Parliament has accepted your toll, and so has she. There is nothing more to be said. She tucks her head under a wing.',[BYE])}
khNpc('blr_ledger','The Parliament ledger','gy_book',()=>say('A flat stone, scratched all over with tally marks, beak-pecked in neat rows. Across the top, the words THE ROAD, in a crow\'s very careful hand. The most recent entries are down the right side. SIX DAYS PAST: TWO RIDERS, WEST. ONE WOMAN, GREY EYES, WHO LOOKED UP AND ANSWERED A CROW, WHICH NOBODY DOES. ONE MAN, WHO DID NOT. THE MAN WORE A RING OF WRONG GOLD. THE PALE KNIGHT LET THEM BY. UNDER IT, SMALLER: HE HAS NEVER LET ANYBODY BY.',[BYE]));
khNpc('blr_notice','A board on the hill path','greensign',()=>say('A board on the path to the hill. THE ROOKERY. BY ORDER OF THE PARLIAMENT. TOLL: FIFTEEN HUNDRED, OR PALE SILVER, OR A SERVICE. TRESPASSERS WILL BE NOTED. Somebody has scratched under it: NOTED, THEN PECKED.',[BYE]));
khNpc('blr_watermill','The old watermill','bl_watermill',()=>say('A small stone watermill on the east bank, with its wheel in the race and the door chained from outside. A plate over the door says: TOLLY AND SON. FLOUR FOR THE ROAD. A card on the chain says: SHUT. THE FLOUR WENT BAD.',[BYE]));
khNpc('blr_millwindow','The Rookery Mill','bl_windmill',()=>say('A tall white mill on the hill, now the colour of ash. The sails turn very slowly, though the air is still, and every spar has a crow on it. Black feathers lie in drifts round the door.',[BYE]));
khNpc('blr_bridge','The plank bridge','bl_fence',()=>say('A plank bridge over the millrace, wide enough for a cart. Black water runs very fast beneath it. On the rail, somebody has scratched: DO NOT LOOK DOWN. YOU WILL SEE SOMEONE YOU KNOW.',[BYE]));
khNpc('blr_pond','The mill pond','bl_urn',()=>say('A deep still pond of black water. Dead leaves lie on it, and a lot of small bright objects lie at the bottom, glinting. Crows come to the edge to look at them, and go away again.',[BYE]));
khNpc('blr_cart','A plague cart','kh_cart1_0',()=>say('A cart of grey boards, tipped half into the ditch, with a dead pilgrim\'s pack sagging off the tail.',[BYE]));
khNpc('blr_millchest','The mill chest','gy_chest',()=>{const F=blF();if(F.millChest)return say('The chest is open and empty, apart from flour.',[BYE]);
  return say('A flour-white chest by the wall. The lid is not locked.',[['Open it.',()=>{F.millChest=1;G.gold+=1900;bl3Give('potion6');sfx('win');msg('You take 1900 gold and a potion.','#ffe36a');return null}],BYE])});
khNpc('blr_housechest','The widow\'s chest','gy_chest',()=>{const F=blF();if(F.houseChest)return say('The chest is open. Folded linen, and nothing else.',[BYE]);
  return say('A small chest at the foot of the bed, with a ribbon round it.',[['Open it.',()=>{F.houseChest=1;G.gold+=1500;sfx('win');msg('You take 1500 gold.','#ffe36a');return null}],BYE])});
khNpc('blr_nest','A great nest','ww_crowtree',()=>say('A heap of sticks and shining things as wide as a cart, on the sail shaft. Buttons, spoons, a gold tooth, a child\'s shoe, forty keys, and one carefully folded handkerchief.',[BYE]));
khNpc('blr_wheel','The wheel of the mill','ww_cauldron',()=>say('The great wooden gears of the mill turn slowly, and the shaft passes through the floor above with a groan. Everything is thick with dust and black feathers.',[BYE]));
khNpc('blr_stones','A standing stone','gy_obelisk',()=>say('A grey standing stone, taller than a man, scratched all over with tally marks. Every flat face has a rook on it, or a rook\'s mark.',[BYE]));
khNpc('blr_scare','A field scarecrow','ww_totem',()=>say('A scarecrow on a post in the dead field, with a crow on each arm. They have not been frightened of it for years. It seems very sorry about it.',[BYE]));
/* the Queen: crows come when she is hurt */
bl3Hit('blcrowqueen',e=>{const fr=e.hp/e.maxhp;e._ph=e._ph|0;const ph=fr<=.33?2:fr<=.66?1:0;
  if(ph>e._ph){e._ph=ph;const a=bl3Add('blcrow',e.x-2,e.y+2,89),b=bl3Add('blcrow',e.x+2,e.y+2,89);if(a||b){msg('The Queen screams, and the crows of the cap come off the beams.','#d8c8e0');sfx('growl')}}});
bl3Kill('blcrowqueen',e=>{const F=blF();if(F.queen)return;F.queen=1;bl3Give('blcrowcrown');bl3Heal();sfx('win');
  try{msg("The Crow Queen comes down off the sail shaft like a dropped sheet, and lies still. You take the Crow Queen's Crown.",'#ffe36a')}catch(x){}});
/* ---------- the level ---------- */
function blrBuild(p){
  blrArt();
  const C=blKit({id:BLR.ID,W:BLR.W,H:BLR.H,name:p.name,lvl:89,start:{x:75,y:35,f:3},wind:.42});
  const {hs,block,fm}=C,F=blF(),W=BLR.W,H=BLR.H,ix=(x,y)=>y*W+x,hgt=C.hgt;
  C.hills(.34);C.boundary();C.setF(2,2,77,67,'0');
  C.pth(2,34,77,36,'1');C.pth(43,15,44,33,'1');C.pth(16,29,16,33,'1');C.pth(52,28,60,28,'1');C.pth(56,26,60,33,'1');C.pth(28,28,28,33,'1');C.pth(29,29,34,29,'1');
  C.flatten(2,28,77,40);C.flatten(36,4,52,20);C.flatten(50,14,70,30);C.flatten(12,22,34,40);
  C.gate('E',35);C.gate('W',35);
  // the millrace: black water across the whole map north to south, under a plank bridge on the road; a pond at each end
  const wat=new Uint8Array(W*H);
  for(let y=3;y<=66;y++)for(const x of [24,25,26]){if(y>=34&&y<=36)continue;wat[ix(x,y)]=1}
  const ell=(cx,cy,rx,ry)=>{for(let y=cy-ry-1;y<=cy+ry+1;y++)for(let x=cx-rx-1;x<=cx+rx+1;x++){if(x<3||y<3||x>76||y>66)continue;if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1+(hs(x,y,9)-.5)*.3)wat[ix(x,y)]=1}};
  ell(25,57,10,7);ell(25,9,5,4);
  for(let y=34;y<=36;y++)for(let x=18;x<=32;x++)wat[ix(x,y)]=0;
  for(let y=3;y<=66;y++)for(let x=3;x<=76;x++){if(wat[ix(x,y)]){fm[ix(x,y)]='6';hgt[ix(x,y)]=-.3;block[ix(x,y)]=1;C.used.add(x+','+y)}}
  for(let y=34;y<=36;y++)for(let x=24;x<=26;x++)fm[ix(x,y)]='3';
  for(let x=23;x<=27;x++){if(x!==25)C.dec('bl_fence',x,33,{block:true,sc:.8});C.dec('bl_fence',x,37,{block:true,sc:.8})}
  C.dec('gy_lantern',23,33,{block:true});C.light(23,33,C.pale);C.dec('gy_lantern',27,37,{block:true});C.light(27,37,C.pale);
  C.dec('bl_fence',25,33,{block:true,sc:.8,npc:'blr_bridge'});
  C.dec('bl_urn',22,38,{block:true,npc:'blr_pond',sc:.8});
  // the windmill on the hill
  C.picHouse({img:'bl_windmill',x0:42,x1:45,y0:10,y1:14,w:5.4,wh:3.2,to:BLR.GROUND,door:[43,14]});
  C.reserve(40,8,47,16);C.light(41,16,C.pale);C.light(46,16,C.pale);
  for(const [x,y] of [[41,17],[46,17]]){C.dec('gy_lantern',x,y,{block:true})}
  C.dec('bl_urn',40,15,{block:true,sc:.8});C.dec('bl_urn',47,15,{block:true,sc:.8});
  for(const [x,y] of [[41,10],[47,12],[40,13],[46,9]])C.dec('gy_rpost',x,y,{block:true});
  C.dec('greensign',42,30,{block:true,npc:'blr_notice'});
  // the Parliament Stones: a ring of twelve stones, seven rooks, the Speaker on the tall stone, the ledger
  const PC=[60,20];
  for(let a=0;a<12;a++){const x=Math.round(PC[0]+6.4*Math.cos(a*Math.PI/6)),y=Math.round(PC[1]+4.6*Math.sin(a*Math.PI/6));if(a===3)continue;C.dec(a%2?'gy_column':'gy_obelisk',x,y,{block:true,npc:'blr_stones',sc:.95})}
  C.dec('gy_obelisk',PC[0]-1,PC[1]-1,{block:true,sc:1.0});C.dec('gy_raven',PC[0]-1,PC[1]-1,{block:true,npc:'blr_speaker',sc:1.7,oy:-.9});
  for(let i=0;i<7;i++){const a=i*2*Math.PI/7+.3,x=Math.round(PC[0]+3.6*Math.cos(a)),y=Math.round(PC[1]+2.6*Math.sin(a));C.dec('gy_raven',x,y,{block:true,npc:'blr_rook'+i,sc:1.0})}
  C.dec('gy_book',PC[0]+1,PC[1]+1,{block:true,npc:'blr_ledger',sc:1.2,bob:.1});
  for(const [x,y] of [[PC[0]-8,PC[1]],[PC[0]+8,PC[1]],[PC[0],PC[1]-6],[PC[0],PC[1]+6]]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,C.pale)}
  C.pth(55,24,56,26,'1');
  // the miller's house west of the race, the dead watermill east of it, the sluice, the pond, the field
  C.house({x0:14,x1:19,y0:24,y1:28,face:'S',sty:'timber',roof:'thatch2',wh:2.3,to:BLR.HOUSE,col:C.warm});
  C.dec('hay',12,27,{block:true,sc:1});C.dec('barrel',20,29,{block:true,sc:.9});C.dec('kh_oqstuff_8',12,30,{block:true,sc:.7});
  C.picHouse({img:'bl_watermill',x0:29,x1:33,y0:22,y1:26,w:5.4,wh:2.6,door:[31,26]});
  C.dec('bl_urn',30,28,{block:true,sc:.8,npc:'blr_watermill'});
  C.light(29,28,C.pale);C.light(33,28,C.pale);
  C.dec('gy_lever',27,30,{block:true,npc:'blr_sluice',sc:1});C.light(28,31,C.pale);
  if(!((F.th|0)&1))C.dec('bl_thimble',28,31,{block:true,npc:'blr_thimble',i:0,sc:1.0,bob:.1});
  C.dec('kh_cart1_0',50,38,{block:true,npc:'blr_cart',sc:1});
  if(!((F.th|0)&4))C.dec('bl_thimble',51,38,{block:true,npc:'blr_thimble',i:2,sc:1.0,bob:.1});
  C.dec('ww_crowtree',68,10,{block:true,sc:1.2,npc:'blr_millwindow'});
  for(const [x,y] of [[40,22],[48,26],[66,32],[10,32],[18,22]])C.dec('gy_rpost',x,y,{block:true});
  for(let y=42;y<=62;y+=3)for(let x=44;x<=74;x+=4){const d=C.D('ww_totem',x+(hs(x,y,5)<.5?0:1),y,{block:true,npc:'blr_scare',sc:.85});}
  C.person('blr_tolly',36,33,2);
  // the road: milestone, signs, lamps, dead hedges
  C.milestone(8,33);
  C.post(74,38,'bl_rk_e',[{n:'THE ROOKERY MILL',d:0},{n:'HOLLOWBELL ABBEY',d:1}],'blr_signE','A signpost inside the east gate. One board reads THE ROOKERY MILL, ahead, and the other HOLLOWBELL ABBEY, to the east. Under them somebody has pecked a small neat row of tally marks, one for each traveller.',{i:2});
  C.post(6,38,'bl_rk_w',[{n:'THE PALE BRIDGE',d:-1},{n:'SALE: 1 STAGE',d:-1}],'blr_signW','A signpost by the west gate. The boards read THE PALE BRIDGE, to the west, and SALE: 1 STAGE. Under them: THE BRIDGE IS HELD. A key, or a sword. Below that, in a crow\'s tidy hand: OR A FRIEND.',{i:5});
  for(let x=3;x<=76;x++){if([24,25,26,27,43,44,16].includes(x))continue;for(const y of [33,37]){if(hs(x,y,33)<.82)C.DB('bl_hedge'+((hs(x,y,35)*3)|0),x,y,{sc:.62+hs(x,y,34)*.22})}}
  for(let x=9;x<=72;x+=9){if(x>=20&&x<=30)continue;C.dec('gy_lantern',x,38,{block:true});C.light(x,38,C.pale)}
  C.dress({trees:120,scrub:200,stones:12,bones:6,posts:10,keep:(x,y)=>(y>=32&&y<=38)||(x>=38&&x<=48&&y>=6&&y<=34)||(x>=48&&x<=72&&y>=12&&y<=30)||(x>=10&&x<=35&&y>=20&&y<=40)||(x>=22&&x<=28)});
  // the creatures: crows on the hill and over the road, flocks in dead trees, scarecrows in the field, the dead pilgrims
  C.foes([['blcrow',56,16],['blcrow',64,24],['blcrow',52,24],['blcrow',46,30],['blcrow',34,30],['blcrow',70,38],['blcrow',14,38],['blcrowflock',68,12],['blcrowflock',36,8],['blcrowflock',10,10],['blcrowflock',16,52],
    ['blscare',50,44],['blscare',58,48],['blscare',66,52],['blscare',72,44],['blscare',54,58],['blscare',62,58],['blshade',60,14],['blshade',40,20],['blshade',12,46],['blhusk',52,40],['blhusk',72,56],['blhusk',14,26],['blhusk',34,46],
    ['blghoul',66,42],['blghoul',46,52],['blghoul',20,50],['bldeadwarden',60,34],['bldeadwarden',34,36],['bldeadwarden',10,36],['blbones',56,38],['blbones',40,40],['blhound',70,22],['blhound',30,60],['blbloat',20,60]]);
  for(const [k,x,y] of [['potion6',34,10],['potion6',70,30],['potion6',48,64]])C.items.push({k,x,y,taken:false});
  C.mapNames.push({t:'The Rookery Mill',x:43,y:11,k:'place'},{t:'The Parliament Stones',x:60,y:20,k:'place'},{t:'The Plank Bridge',x:25,y:35,k:'place'},{t:'The Millrace',x:25,y:20,k:'place'},{t:"The Miller's House",x:16,y:26,k:'place'},{t:'The Old Watermill',x:31,y:24,k:'place'},{t:'The Sluice',x:27,y:30,k:'place'},{t:'The Mill Pond',x:25,y:57,k:'place'},{t:'The Scarecrow Field',x:58,y:52,k:'place'},{t:'The Crow Tree',x:68,y:10,k:'place'},{t:'To Hollowbell Abbey',x:75,y:33,k:'place'},{t:'To the Pale Bridge',x:6,y:33,k:'place'});
  const lv=C.finish({start:{x:75,y:35,f:3}});
  lv.tele=undefined;lv.floorSet=lv.floorSet.slice();lv.floorSet[6]='blf_water';lv._ground={'6':'#5f7c7c','5':'#8a7e5e','4':'#cbc6b2'};
  return lv}
/* ---------- the rooms ---------- */
const blrWall=()=>IMG.wl2_wall_3?'wl2_wall_3':'kh_ohwall1_0';
function blrGround(){
  blRoom({id:BLR.GROUND,name:'The Rookery Mill: the grinding floor',w:13,h:10,amb:.5,rating:89,floor:'wood',wall:blrWall(),
    back:{to:BLR.ID,x:43,y:15,f:2},
    lights:[[3,2],[10,2],[6,5],[3,8],[10,8]],lcol:{'3,2':[1.4,1.0,.6],'10,2':[.72,1.1,.95],'6,5':[1.3,.95,.6],'3,8':[.75,1.1,.95],'10,8':[1.35,.98,.58]},col:[1.0,1.0,.8],
    enemies:[['blcrow',3,4],['blcrow',10,4],['blshade',10,7]],
    build:C=>{const P=(n,x,y,o)=>bl3Prop(C,n,x,y,o);
      C.raw('ww_stone',6,3,{npc:'blr_stone',solid:1,deco:false,sc:1.1});C.raw('ww_cauldron',3,2,{npc:'blr_wheel',solid:1,deco:false,sc:1.2});
      C.npc('blr_tolly',7,5);
      C.raw('gy_hatch2',11,2,{npc:'blr_looploft',solid:1,deco:false,sc:1});
      for(const [x,y] of [[1,6],[2,7],[11,6],[11,7]])C.raw('hay',x,y,{block:true,sc:1});
      C.raw('gy_chest',1,2,{npc:'blr_millchest',solid:1,deco:false,sc:.9});
      P('waterbarrel',2,8,{h:.7});P('coatrack',11,5,{h:1.0});C.raw('barrel',9,8,{block:true,sc:.9});
      C.raw('gy_web',1,1,{block:false,sc:.5});C.raw('gy_web',11,1,{block:false,sc:.5});C.raw('gy_bones',8,6,{block:false,sc:.6});C.raw('gy_bones',4,6,{block:false,sc:.5})}})}
function blrLoft(){
  const F=blF();
  blRoom({id:BLR.LOFT,name:'The Rookery Mill: the loft',w:13,h:9,amb:.45,rating:89,floor:'wood',wall:blrWall(),
    back:{to:BLR.GROUND,x:10,y:2,f:2},
    lights:[[3,2],[10,2],[6,5]],lcol:{'3,2':[.72,1.1,.95],'10,2':[.72,1.1,.95],'6,5':[1.3,.95,.6]},col:[.9,1.05,.85],
    enemies:[['blcrow',4,5],['blcrow',9,4],['blcrow',7,7],['blshade',3,7]],
    build:C=>{
      for(const [x,y] of [[1,2],[2,2],[11,2],[1,5],[11,6],[2,7]])C.raw('hay',x,y,{block:true,sc:1});
      [[3,3],[9,3],[6,7]].forEach(([x,y],i)=>{if(!((F.sacks|0)&(1<<i)))C.raw('kh_oqstuff_9',x,y,{npc:'blr_sack',solid:1,deco:false,i,sc:.9})});
      if(!((F.th|0)&2))C.raw('bl_thimble',6,2,{npc:'blr_thimble',solid:1,deco:false,i:1,sc:1.0,bob:.2});
      C.raw('gy_hatch2',2,7,{npc:'blr_loftdown',solid:1,deco:false,sc:1});
      C.raw('gy_hatch2',10,7,{npc:'blr_capdoor',solid:1,deco:false,sc:1});
      for(const x of [1,11])C.raw('hl_p_window',x,4,{block:true,sc:1.0});
      C.raw('crate',5,2,{block:true,sc:.9});C.raw('barrel',8,2,{block:true,sc:.9});C.raw('gy_bones',6,5,{block:false,sc:.6});C.raw('gy_web',1,1,{block:false,sc:.6});C.raw('gy_web',11,1,{block:false,sc:.6})}})}
function blrCap(){
  blRoom({id:BLR.CAP,name:'The Rookery Mill: the cap',w:11,h:10,amb:.4,rating:89,floor:'wood',wall:blrWall(),
    back:{to:BLR.LOFT,x:10,y:7,f:2},
    lights:[[2,2],[8,2],[5,5],[2,8],[8,8]],lcol:{'2,2':[.72,1.1,.95],'8,2':[.72,1.1,.95],'5,5':[.8,1.1,1.0],'2,8':[.72,1.1,.95],'8,8':[1.3,.95,.6]},col:[.85,1.05,.95],
    enemies:[['blcrowqueen',5,3],['blcrow',2,5],['blcrow',8,5],['blcrowflock',5,7]],
    build:C=>{
      C.raw('ww_crowtree',5,1,{npc:'blr_nest',solid:1,deco:false,sc:.9});
      C.raw('gy_raven',5,3,{npc:'blr_queen',solid:1,deco:false,sc:3.0});
      C.raw('gy_rune',9,2,{npc:'blr_glass',solid:1,deco:false,sc:.9});
      C.raw('ww_cauldron',1,3,{npc:'blr_wheel',solid:1,deco:false,sc:1.2});
      for(const x of [0,10])C.raw('hl_p_window',x,4,{block:true,sc:1.0});
      C.raw('gy_hatch2',5,8,{npc:'blr_capdown',solid:1,deco:false,sc:1});
      C.raw('gy_bones',3,6,{block:false,sc:.6});C.raw('gy_bones',8,7,{block:false,sc:.6});C.raw('gy_web',1,1,{block:false,sc:.5});C.raw('gy_web',9,1,{block:false,sc:.5})}})}
function blrHouse(){
  blRoom({id:BLR.HOUSE,name:"The Miller's House",w:11,h:8,amb:.5,rating:89,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BLR.ID,x:16,y:29,f:2},
    lights:[[3,2],[8,2],[5,5]],lcol:{'3,2':[1.4,1.0,.6],'8,2':[1.35,.98,.58],'5,5':[1.3,.95,.6]},col:[1.3,.95,.6],
    enemies:[['blcrow',8,5]],
    build:C=>{const P=(n,x,y,o)=>bl3Prop(C,n,x,y,o);
      P('hearth',5,1,{h:1.3});P('pietable',5,4,{h:.7});P('rocker',3,4,{h:.7});P('bed',2,6,{h:.8});P('dresser',9,1,{h:1.1});P('clock',2,1,{h:1.1});P('waterbarrel',9,6,{h:.7});
      C.npc('blr_widow',6,4);
      C.raw('gy_chest',9,3,{npc:'blr_housechest',solid:1,deco:false,sc:.9});
      C.raw('gy_web',9,1,{block:false,sc:.5});C.raw('gy_bones',7,6,{block:false,sc:.5})}})}
for(const [id,fn] of [[BLR.GROUND,blrGround],[BLR.LOFT,blrLoft],[BLR.CAP,blrCap],[BLR.HOUSE,blrHouse]])
  KH_LAZY[id]=()=>{if(!LEVELS[id]){if(!LEVELS[BLR.ID])KH_LAZY[BLR.ID]();blrArt();fn()}return LEVELS[id]};
/* the quest rings */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx}),T=QRF.T;
  T.blq44={give:[N(9690,'blr_speaker')],act:()=>{if(blrTh()>=3)return [N(9690,'blr_speaker')];const F=blF(),o=[];if(!((F.th|0)&1))o.push(N(9690,'blr_thimble'));if(!((F.th|0)&2))o.push(N(9692,'blr_thimble'));if(!((F.th|0)&4))o.push(N(9690,'blr_thimble'));return o},ready:[N(9690,'blr_speaker')]};
  T.blq45={give:[N(9691,'blr_tolly')],act:()=>{const F=blF();if(F.ground)return [N(9691,'blr_tolly')];if(!F.race)return [N(9690,'blr_sluice')];if(blrSacks()<3)return [N(9692,'blr_sack')];return [N(9691,'blr_stone')]},ready:[N(9691,'blr_tolly')]};
  T.blq46={give:[N(9691,'blr_tolly')],act:()=>blF().queen||blrPeace()?[N(9691,'blr_tolly')]:[N(9692,'blr_capdoor'),E(9693,/^blcrowqueen$/),N(9690,'blr_speaker')],ready:[N(9691,'blr_tolly')]};
  T.blq47={give:[N(9694,'blr_widow')],act:()=>blF().glass?[N(9694,'blr_widow')]:[N(9692,'blr_capdoor'),N(9693,'blr_glass')],ready:[N(9694,'blr_widow')]}}
blRegister(9,blrBuild,{fromE:{x:75,y:35,f:3},fromW:{x:4,y:35,f:1},exitY:35,rooms:[9691,9692,9693,9694],names:{9691:'The Rookery Mill: the grinding floor',9692:'The Rookery Mill: the loft',9693:'The Rookery Mill: the cap',9694:"The Miller's House"},rating:{9691:89,9692:89,9693:89,9694:89}});
