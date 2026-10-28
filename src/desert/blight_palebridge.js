/* ==========================================================================
   PLACE 10 OF THE BLIGHTED ROAD: THE PALE BRIDGE AND THE GATE OF SALE (level 9700, rated 90; prefix blp / BLP). 80 by 70.
   The last stage before Sale. The road runs east to west along y 34 to 36. East gate x 78 (back to the Rookery Mill, 9690). A dry ravine runs north to south across the whole map (x 46 to 56) and the only way over it is the wide pale-stone bridge
   (y 34 to 36, parapets at y 33 and 37), held by the Pale Knight. West of the ravine a stretch of dead land with four unlit road lamps, a plague cart and a camp; then Sale's outer wall (x 8 to 10, running the whole height)
   with two towers (north tower: the gatehouse, 9701; south tower: the wall walk, 9702) and an open arch in the road; inside the wall a little toll yard with the Sale watch; the iron gate in the west edge (x 1) leads into Sale
   (BL_SALE: Sale's east gate square, SA.START), and Sale's east gate leads back here, to the toll yard (SA.ROAD = 9700 at x 4, y 35).
   THE PALE KNIGHT (blpaleknight, rating 90): he stands on the bridge as a person. Show him the Gate Key of Sale (vtgatekey, from the Vault of Maldrake) and he steps aside; or fight him. Flags: knightYield, knightFight, knight (dead).
   People (the Sale watch is peaceful): Captain Ysolde Marrow (blp_captain, gatehouse), Sergeant Hob Pike (blp_pike, toll yard), Joss Fenn the lamplighter (blp_joss), Corporal Piper the herald (blp_piper, east bank), Watchman Pell (blp_pell, wall walk).
   Quests: blq78 Lamps for the Last Mile (Joss), blq79 The Watch Banner (Pike), blq80 A Message for the Captain (Piper; hand in to the Captain), blq81 Wren's Trail (the Captain).
   Flags: G.flags.bl = {lamps (bitmask of 4), banner, bannerGiven, msg, glove, knightYield, knightFight, knight, khp, cartChest, gateChest}.
   ========================================================================== */
const BLP={ID:9700,GUARD:9701,WALK:9702,W:80,H:70};
BL_ROAD[9].W=BLP.W;BL_ROAD[9].H=BLP.H;
for(const [id,n] of [[9701,'The Gatehouse of Sale'],[9702,'The Wall Walk']]){LEVEL_NAMES[id]=n;LEVEL_RATING[id]=90}
/* Sale's east gate leads back here, and this place's west gate leads into Sale (the town's own table BL_SALE is read by blWestDest) */
if(typeof SA!=='undefined'){BL_SALE.id=SA.ID;BL_SALE.at={x:SA.START.x,y:SA.START.y,f:SA.START.f};SA.ROAD={to:BLP.ID,x:4,y:35,f:1}}
/* ---------- things carried ---------- */
ITEMDEF.blbanner={n:'Banner of the Sale Watch',k:'quest',t:'Quest item',ic:'book',c:'#8a8470',stack:1,price:0,sw:.5,d:'A torn banner of grey cloth with a white tower sewn on it, the colours of the Sale watch. It was left in a plague cart when the watch was driven back from the bridge. Sergeant Pike wants it back.'};
ITEMDEF.blwrenglove={n:"Wren's Glove",k:'quest',t:'Quest item',ic:'book',c:'#6a5a50',stack:1,price:0,sw:.1,d:'A small leather riding glove, worn at the thumb, with a thread of grey-green wool caught in the stitching. Wren wore gloves like it on the road. It lay by the south tower of the wall of Sale.'};
ITEMDEF.blwatchring={n:'Ring of the Sale Watch',k:'ring',t:'Ring',ic:'ring',c:'#c0c4c8',price:0,lvl:90,pas:{ward:20,dodge:.07,regen:.8,mpRegen:.5},int:6,hp:100,rar:1,sw:.1,d:'A heavy ring of grey iron with a white tower raised on the bezel. The Sale watch gives one to anybody who has done them a service. Adds 6 Intelligence and 100 health, every blow on the wearer is 20 lighter, enemies miss 7% more, and wounds and weariness close steadily. Needs level 90.'};
ITEMDEF.blwatchhelm={n:"Lamplighter's Hood",k:'head',t:'Helm',ic:'head',c:'#6a6458',armor:20,price:0,lvl:90,pas:{dmgPct:.06,dodge:.03,regen:.5},rar:1,gear:1,sw:.3,d:'A sooty grey hood with a flap that covers the face against lamp smoke. Joss Fenn wore it every night of his life. Armour 20, damage +6%, enemies miss 3% more, and wounds close steadily. Needs level 90.'};
ITEMDEF.blpalesword={n:"The Pale Knight's Sword",k:'weapon',t:'Sword',ic:'sword',c:'#e8ecf4',dmg:[500,610],hit:.2,req:{str:74},lvl:90,price:0,rar:1,eff:{bleed:[.3,6,40],bossdmg:.38},dbl:.24,sw:.6,d:'A long pale sword that has never been sharpened and has never needed to be. The blade is the colour of the moon on a frozen pond. Wounds bleed, and bosses take 38% more. Needs level 90.'};
/* ---------- the Pale Knight ---------- */
Object.assign(ENEMY_DEF,{blpaleknight:{name:'The Pale Knight',hp:540,dmg:[12,19],hit:.9,w:blW('boss_2',2.3),img:'bl_paleknight',xp:960,gold:[0,0],speed:1,verb:'cleaves',boss:true,aboveParty:0,bl:1,still:0,glow:.2}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('blpaleknight');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('blpaleknight');
if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.blpaleknight=[4000,4800];
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^blpaleknight/,'frostbitten',.3]);
/* ---------- the pictures ---------- */
function blpArt(){
  if(BLP._art)return;
  bl3Tint('bl_paleknight','gyp_boss_2','saturate(.15) brightness(1.5) contrast(.9)',2.1);
  bl3Tint('bl_paletower','wl_bldg1_4','saturate(.2) brightness(.8)',null);
  bl3Ghost('bl_g_dummy','kh_ohsold1_3');
  for(const [k,h] of [['b9_cart',.95],['kh_cart1_0',1.1],['gy_angel',1.95],['gy_lever',.9],['gy_igate',2.2],['gy_arch',2.5]])if(NPC_H[k]===undefined)NPC_H[k]=h;
  b9Art();BLP._art=1}
/* ---------- the sound: wind over the ravine, a far bell from Sale ---------- */
const BLPS={next:0};
function blpTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!SNDOPT.amb||LEVEL!==BLP.ID)return;const now=AC.currentTime;
  if(now>BLPS.next){BLPS.next=now+20+Math.random()*25;try{blsToll(1,.35+Math.random()*.2)}catch(e){}if(Math.random()<.5)try{wwsCreak(.6)}catch(e){}}}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{blpTick()}catch(e){console.error('blp tick',e)}}}
/* ---------- state ---------- */
const blpLamps=()=>{const m=blF().lamps|0;return (m&1?1:0)+(m&2?1:0)+(m&4?1:0)+(m&8?1:0)};
const blpPassed=()=>!!(blF().knightYield||blF().knight);
const BLP_LAMPS=[[17,33],[25,33],[33,33],[41,33]];
bl3Hide(BLP.ID,'blp_knight',()=>{const F=blF();return !!(F.knightFight||F.knightYield||F.knight)});
bl3OnArrive(n=>{
  if(n!==BLP.ID)return;const F=blF();
  if(F.knightFight&&!F.knight&&!G.enemies.some(e=>e.t==='blpaleknight'&&e.hp>0)){const m=bl3Add('blpaleknight',51,35,90);if(m&&F.khp){m.hp=Math.max(1,Math.round(m.maxhp*F.khp));m.alert=true}}
  try{const L=LEVELS[BLP.ID];if(L&&L._bl)BLP_LAMPS.forEach(([x,y],i)=>{if((F.lamps|0)&(1<<i))L._bl.lcol[x+','+y]=[1.5,1.05,.55]})}catch(e){}});
bl3Hit('blpaleknight',e=>{const F=blF();F.khp=e.hp/e.maxhp});
bl3Kill('blpaleknight',e=>{const F=blF();if(F.knight)return;F.knight=1;F.khp=0;bl3Give('blpalesword');bl3Heal();sfx('win');
  try{msg("The Pale Knight goes down on one knee, and then flat, and the pale light goes out of his helm. You take the Pale Knight's Sword.",'#ffe36a')}catch(x){}});
/* ---------- the people ---------- */
const BLP_MARROW=['Captain Ysolde Marrow, of the watch of Sale. You will have come over the bridge. Nobody has crossed it in four years but the watch\'s own dead, and two riders six days ago. I am not sure whether to ask you for your papers or to sit down.','We hold the wall, and the gate, and the road for a stage on either side. We hold what we can. The dead of Sale keep to the dead quarter, mostly. The ones on the road beyond the bridge are not ours. Those are the Sovereign\'s.','The Pale Knight was Sir Edmer Vane, who held this bridge for Sale as its first captain. He swore to hold it against anything that came. The Sovereign\'s silver took him at his word. He does not sleep, and he has not blinked, and he does not forget an oath. That is all he is now.','The gate is open to the living. Sale has few of those, and we are fond of every one. Mind the dead quarter, in the south west. Do not read the boards on the shops. The people behind them are very polite, and they want something done.'];
khNpc('blp_captain','Captain Ysolde Marrow','kh_ohsold1_2',()=>yrLines('blp_captain',BLP_MARROW));
const BLP_PIKE=['Sergeant Hob Pike. Toll yard, Sale. There is no toll. There never was. The toll bar is for show, and so that the dead have something to be polite at.','We lost the banner in the retreat. It went in a cart, and the cart went in the ditch on the far bank, and I have been telling myself for four years that I shall fetch it. I have a very good excuse. It is called a pale knight.','I do not mind the dead. I mind that they do not mind me. A man in my line likes to be hated a bit, for the sake of the work.'];
khNpc('blp_pike','Sergeant Hob Pike','kh_ohsold1_0',()=>yrLines('blp_pike',BLP_PIKE));
const BLP_JOSS=['Joss Fenn, lamplighter. The road lamps between the bridge and the wall were mine to keep, once. Four of them. I walked the whole last mile every dusk with a taper and a can. Now they are out, and the dead do not need them, but the living do.','The pale light is all right for the dead. They like it. But a living person on a dark road wants a yellow one. It is the one thing a lamp is for.','I cannot go out there without a taper, and my taper has the damp in it. If you have a light, I should be very glad of four small flames on the road. It is not much of a job. I have always thought it was a very good one.'];
khNpc('blp_joss','Joss Fenn, lamplighter','kh_ohfolk7_5',()=>yrLines('blp_joss',BLP_JOSS));
const BLP_PIPER=['Corporal Piper, herald of the Sale watch. I am meant to blow the horn when the bridge is clear. It has not been clear in four years. I keep the horn polished, and my cheeks in training.','I am stationed here, on the east bank, to hail anybody who comes. You are the first to come. Please do not take offence if I cry a little. It is only the habit of the thing.','The Pale Knight does not speak to me. I have tried. I once sang to him for a day. He did not turn his head. I have sometimes wondered whether he has the key, or whether the key has him.'];
khNpc('blp_piper','Corporal Piper, herald','kh_ohsold1_5',()=>yrLines('blp_piper',BLP_PIPER));
const BLP_PELL=['Watchman Pell. I have the night watch on the north wall. I count the lights in Sale every evening. There are eleven. There were three hundred.','It is not the dead I mind. It is the quiet. They do not shout at one another across the roofs. You would think a town of the dead would be rowdy, and it is the quietest place you ever knew.','On a clear day you can see all the way to the Pale Lands from here. A white shine on the horizon, like a snowfield, only it does not melt, and in the evening it breathes.'];
khNpc('blp_pell','Watchman Pell','kh_ohsold1_3',()=>yrLines('blp_pell',BLP_PELL));
/* ---------- the quests ---------- */
bl3Q('blq78','Lamps for the Last Mile','Joss Fenn, lamplighter',[
  ['Light the four road lamps on the dead land between the bridge and the wall of Sale. Each stands at the north edge of the road.',()=>blpLamps()>=4,['blp_lamp0','blp_lamp1','blp_lamp2','blp_lamp3']]],
  {gold:4200,xp:36000,items:['blwatchhelm','potion6']});
bl3Q('blq79','The Watch Banner','Sergeant Hob Pike',[
  ['Find the banner of the Sale watch in the plague cart by the road, on the east bank of the ravine, beyond the bridge.',()=>!!(blF().banner||blF().bannerGiven),['blp_cart']],
  ['Bring the banner to Sergeant Pike in the toll yard of Sale.',()=>!!blF().bannerGiven,['blp_pike']]],
  {gold:4400,xp:37000,items:['blwatchring','potion6']});
bl3Q('blq80','A Message for the Captain','Corporal Piper, herald',[
  ['Get over the Pale Bridge: show the Pale Knight the Gate Key of Sale, or defeat him.',()=>blpPassed(),['blp_knight']],
  ['Tell Captain Ysolde Marrow in the gatehouse that the bridge is open.',()=>!!blF().msg,['blp_captain']]],
  {gold:5600,xp:42000,items:['potion6','potion6']});
bl3Q('blq81',"Wren's Trail",'Captain Ysolde Marrow',[
  ["Find Wren's glove by the south tower of the wall of Sale, on the outside of the wall.",()=>!!(blF().glove||blF().gloveGiven),['blp_glove']],
  ['Show the glove to Captain Marrow in the gatehouse.',()=>!!blF().gloveGiven,['blp_captain']]],
  {gold:5000,xp:40000,items:['potion6','potion6','potion6']});
wwGive('blp_joss','blq78',()=>true,{
  offer:'Will you light my lamps? There are four of them, on the road between the bridge and the wall. My taper has gone damp, and the dead do not like it when a living man goes out after dark. You do not need me. You only need a flame. Walk up to each lamp, and say a word, and it will light.',
  accept:'Bless you. They stand along the north edge of the road, one every eight steps, from the wall to the bridge. Do not stand in the middle of the road after dark.',
  remind:()=>'You have lit '+blpLamps()+' of the four lamps. They are on the north edge of the road, between the bridge and the wall.',
  ready:'I saw them from the toll yard. Four little yellow lights. Four. It is the best thing I have seen in six years.',
  thanks:'Take my hood. It has seen a great many lamps. It smells of smoke and a little of home.',
  after:'The road lamps are lit, and every night I stand at the toll bar and watch them. There is nothing to watch for. I simply like to.'});
wwGive('blp_pike','blq79',()=>true,{
  offer:'I have a favour to ask, though I am ashamed. The banner of the watch is in a plague cart on the far side of the ravine. It went in the ditch in the retreat. I never fetched it. Four years. Will you? It is a grey cloth with a white tower on it. The cart is by the road, east of the bridge.',
  accept:'Thank you. It will be in the sacking in the back of the cart. You will have to get past the knight to the far side, and then back. I would not offer if I thought you could not.',
  remind:()=>blF().banner||bagCount('blbanner')>0?'You have the banner. Bring it to me, here in the toll yard.':'The banner is in the plague cart by the road, east of the bridge.',
  ready:'That is it. That is our colour. Look at it. It has not even faded. Thank you, I cannot say it enough.',
  thanks:'I shall hang it over the gatehouse. Take this ring. The watch gives one to each who does it a service, and until now nobody had done us one.',
  after:'The banner is over the gatehouse door. Every man of the watch looks up when he passes it. Ysolde says it is the first time in four years that anyone has done so.'});
wwGive('blp_piper','blq80',()=>true,{
  offer:'May I ask you something? The bridge is held, and I cannot cross. If you get over to the west side, and I think you can, will you tell Captain Marrow in the gatehouse that somebody came? I should like her to know that somebody came. I should like the horn to have been of use.',
  accept:'Thank you. The key is the best way, if you have it. If you do not, then the sword. The Knight was a good man, once. He will not mind.',
  remind:()=>blpPassed()?'You are over the bridge. Tell Captain Marrow in the gatehouse, in the north tower of the wall of Sale.':'You must get past the Pale Knight on the bridge, with the Gate Key of Sale or with a sword.',
  ready:'(Corporal Piper has already told you everything he can. You do not need to come back.)',
  thanks:'(No reward is given here.)',
  after:'I have blown the horn. It was not for anybody in particular. It was for the principle of the thing.'});
wwGive('blp_captain','blq81',()=>qSt('blq80')==='done'||blpPassed(),{
  offer:'May I trust you with something? Six days ago a woman and a man rode in through the gate, from the bridge. The knight let them by. He lets nobody by. The woman was called Wren. She said so. The man did not say anything. He had a ring of wrong gold, and a face like a bad cheque. They went up Candle Street to the chapel at the top of the town, the Sanctuary, and the door has been barred since. I would like to know more of her. She left a glove, I think, by the south tower. Would you bring it?',
  accept:'Thank you. The south tower is on the outside of the wall, west of the bridge. Look at the foot of it, among the stones. Be careful of the dead lands. The road lamps are out.',
  remind:()=>blF().glove||bagCount('blwrenglove')>0?'You have the glove. Show it to me here, in the gatehouse.':'The glove lies at the foot of the south tower, on the outside of the wall.',
  ready:'This is hers. That is her wool, grey-green. Thank you. It tells me she did not mean to be seen.',
  thanks:'I shall keep it. If she comes back, she shall have it. If she does not, then I shall know who to be sorry for. Take this, from the watch.',
  after:'I sit with the glove sometimes. It is a small leather thing. It is the only thing in Sale that smells of the road outside.'});
/* the hand-ins: the message to the Captain, the banner and the glove that were found */
yrHook('blp_captain',d=>{const F=blF();
  if(qSt('blq80')==='active'&&blpPassed()&&!F.msg)return say('Captain Marrow looks up from the table, and sees you, and puts down the pen very slowly.',[['Tell her that the bridge is open.',()=>{F.msg=1;sfx('win');if(qReady('blq80'))qTurnIn('blq80');return say('"Open," she says. "You are certain? It has been four years. I think I shall have to sit down." She does. "The horn," she says. "Somebody should tell Piper." You have just come from him. "Then he knows," she says, "and he has been blowing it all this time."',[BYE])}],['Not yet.',()=>null]]);
  return null});
yrHook('blp_captain',d=>{const F=blF();
  if(qSt('blq81')==='active'&&(F.glove||bagCount('blwrenglove')>0)&&!F.gloveGiven)return say('Captain Marrow sees the glove in your hand, and her face changes.',[['Show her the glove.',()=>{F.gloveGiven=1;bagRemove('blwrenglove',1);sfx('win');if(qReady('blq81'))qTurnIn('blq81');return say('"Wren," she says, and turns it over. "They went up to the Sanctuary, you know. I watched them go. She walked in front, and the man walked a little behind, and I thought, he is a man who has been told what to do for a very long time. The chapel door closed behind them at the top of Candle Street, and I have heard nothing from it since." She pauses. "If you go into Sale, do not knock too loud. That is all I know."',[BYE])}],['Not yet.',()=>null]]);
  return null});
yrHook('blp_pike',d=>{const F=blF();
  if(qSt('blq79')==='active'&&(F.banner||bagCount('blbanner')>0)&&!F.bannerGiven)return say('Sergeant Pike sees the grey cloth in your arms and takes his helm off.',[['Give him the banner.',()=>{F.bannerGiven=1;bagRemove('blbanner',1);sfx('win');bl3Heal();msg('You return the banner of the Sale watch. Every hero is healed.','#ffe9a0');if(qReady('blq79'))qTurnIn('blq79');return say('"That is it," he says, and holds it up. "That is it." He is quiet for a moment, and then he coughs. "Well. Never mind."',[BYE])}],['Not yet.',()=>null]]);
  return null});
/* ---------- the objects ---------- */
for(let i=0;i<4;i++)khNpc('blp_lamp'+i,'A cold road lamp','gy_lantern',d=>{const F=blF(),bit=1<<i;
  if((F.lamps|0)&bit)return say('The lamp burns yellow and steady. It is a small kind light on a dead road.',[BYE]);
  const earlier=(F.lamps|0)&((1<<i)-1);
  if(i>0&&earlier!==(1<<i)-1)return say('A cold lamp on a post. It will not light. The lamp before it, towards the wall, has to be lit first, so that this one has a flame to take.',[BYE]);
  return say('A cold road lamp on an iron post, with its glass dusty and its wick dry. Joss Fenn left a taper stub in the hook.',[['Light the lamp.',()=>{F.lamps=(F.lamps|0)|bit;sfx('key');try{const L=LEVELS[BLP.ID];if(L&&L._bl)L._bl.lcol[BLP_LAMPS[i][0]+','+BLP_LAMPS[i][1]]=[1.5,1.05,.55];for(const l of LIGHTS)if(Math.floor(l.x)===BLP_LAMPS[i][0]&&Math.floor(l.y)===BLP_LAMPS[i][1])l.col=[1.5,1.05,.55]}catch(e){}
    msg('You light the lamp ('+blpLamps()+' of 4).','#ffe36a');if(qSt('blq78')==='active')yrStep('You light a road lamp ('+blpLamps()+' of 4).');if(blpLamps()>=4)bl3Heal();return null}],BYE])});
khNpc('blp_cart','A plague cart','b9_cart',d=>{const F=blF();
  if(F.banner||F.bannerGiven)return say('The cart is empty, apart from sacking and old straw. A mouse looks out and goes in again.',[BYE]);
  return say('A grey plague cart, tipped half into the ditch. In the sacking at the back, a roll of grey cloth with a white tower sewn on it.',[['Take the banner.',()=>{F.banner=1;bl3Give('blbanner');sfx('key');msg('You take the banner of the Sale watch.','#ffe36a');return null}],BYE])});
khNpc('blp_glove','A glove in the stones','gy_ring',d=>{const F=blF();
  if(F.glove||F.gloveGiven)return say('A bare place among the stones, with the shape of a small glove pressed into the dust.',[BYE]);
  return say('Among the fallen stones at the foot of the south tower lies a small leather riding glove, worn at the thumb. A thread of grey-green wool is caught in the stitching.',[['Take the glove.',()=>{F.glove=1;d&&(d.found=true,d.hidden=true);bl3Give('blwrenglove');sfx('key');msg("You take Wren's glove.",'#ffe36a');return null}],BYE])});
khNpc('blp_knight','The Pale Knight','bl_paleknight',()=>blpKnightTalk());
function blpKnightTalk(){
  const F=blF(),key=bagCount('vtgatekey')>0;
  return say('(A knight in pale armour stands in the middle of the bridge, with his sword point-down on the stone. His visor is up. There is a face in it, and it has not blinked.) "None cross," he says. "Not by order of the Sovereign. Not by order of Sale. By my own. I am Sir Edmer Vane, captain of this bridge, and I swore a thing. A key, or a sword. That is all that I am able to take."',[
    ...(key?[['Show him the Gate Key of Sale.',()=>{F.knightYield=1;sfx('win');msg('The Pale Knight steps aside from the bridge.','#ffe36a');try{bl3Apply(LEVEL)}catch(e){}return say('(He looks at the key for a long moment. Something moves very slowly behind his eyes.) "That is the Sovereign\'s own," he says. "I was told to look for it. I was not told what to do when I saw it." He lifts his sword, and steps back to the parapet. "Go on," he says. "I should like to sit down, for a little."',[BYE])}]]:[]),
    ['Ask who he is.',()=>say('"I was captain of the watch of Sale. The wall was not finished, and the bridge was the only place where a handful could hold. I held it. The pale silver came on the third night, with a clerk in a grey coat, and a cart. I took the silver for the wall. I have been standing since."',[BYE])],
    ['We will not wait. We will fight.',()=>{F.knightFight=1;F.khp=1;sfx('growl');try{bl3Apply(LEVEL)}catch(e){}const m=bl3Add('blpaleknight',51,35,90);if(m)m.alert=true;msg('The Pale Knight lifts his sword.','#d09a80');return say('"Then it is the sword," says Sir Edmer, and he sounds very nearly relieved. "I should have preferred the key. But a sword is honest."',[BYE])}],
    ['Goodbye.',()=>null]])}
khNpc('blp_sign_e','A signpost','greensign',()=>say('A signpost at the east gate. The boards read THE ROOKERY MILL, to the east, and THE PALE BRIDGE, ahead. Under them: SALE 1 STAGE.',[BYE]));
khNpc('blp_sign_w','A signpost','greensign',()=>say('A signpost in the toll yard of Sale. The board reads SALE, to the west, through the gate, and under it: THE WATCH OF SALE WELCOMES THE LIVING. NO TOLL. PLEASE WIPE YOUR FEET. THE DEAD ARE NOT ALL UNFRIENDLY.',[BYE]));
khNpc('blp_sign_br','A signpost at the bridge','greensign',()=>say('A signpost at the foot of the bridge. THE PALE BRIDGE. BUILT FOR SALE BY THE FREE MEN OF THE ROAD. HELD, it says, in new paint, and below that, in old: IN PERPETUITY.',[BYE]));
khNpc('blp_mile','A stone','bl_slab',()=>say('A grey slab at the road\'s edge, cut with the words SALE and 1 STAGE. Somebody has put a small bunch of dried flowers at its foot, and somebody else has taken them away.',[BYE]));
khNpc('blp_toll','The toll bar','gy_rpost',()=>say('A black bar across the road on two posts, with a crow-shaped lantern on one end. A board says TOLL: NONE. The bar has been lifted off its pegs and stands against the wall.',[BYE]));
for(let i=0;i<2;i++)khNpc('blp_angel'+i,'A pale statue','gy_angel',()=>say(['A statue of a woman in a plain gown, with her hands held out as if to catch something. The plinth reads: THE FREE MEN OF THE ROAD, WHO BUILT THIS BRIDGE.','A statue of a man in a plain gown, with his hands folded. The plinth reads: AND THOSE WHO HELD IT.'][i],[BYE]));
khNpc('blp_wall','The wall of Sale','bl_column',()=>say('The outer wall of Sale: grey stone, three paces thick, and higher than any house in the town. Every stone has been scratched with a name. It goes on for as far as you can see in both directions.',[BYE]));
khNpc('blp_camp','A cold camp','gy_candles',()=>say('A cold camp at the side of the road, with a rolled blanket and a ring of dead embers. Somebody was waiting here for the bridge to open. There is a hand-lettered card: WE WENT HOME. WE WERE TOLD IT WAS CLOSED.',[BYE]));
khNpc('blp_cartchest','A pilgrim\'s chest','gy_chest',()=>{const F=blF();if(F.cartChest)return say('The chest is open and empty.',[BYE]);
  return say('A small iron-bound chest by the cold camp, with the lid slightly open.',[['Look inside.',()=>{F.cartChest=1;G.gold+=2200;bl3Give('potion6');sfx('win');msg('You take 2200 gold and a potion.','#ffe36a');return null}],BYE])});
khNpc('blp_gatechest','The watch strongbox','gy_chest',()=>{const F=blF();if(F.gateChest)return say('The strongbox is open. A list inside reads PAY, and a single entry, in a very neat hand: NONE.',[BYE]);
  return say('A grey strongbox with a white tower on the lid. It is not locked, and the watch does not seem to have thought of anybody stealing from it.',[['Open it.',()=>{F.gateChest=1;G.gold+=2400;bl3Give('potion6');sfx('win');msg('You take 2400 gold and a potion.','#ffe36a');return null}],BYE])});
khNpc('blp_map','A map of the road','gy_book',()=>say('A big map on the table, pinned flat with four daggers. It shows the road from Wenlock to Sale, stage by stage, with every place on it written in a neat hand. At the very west end, past Sale, the paper is blank, and somebody has written PALE LANDS, and underlined it twice, and then drawn a very small door.',[BYE]));
khNpc('blp_ledger','The watch ledger','gy_book',()=>say('The ledger of the watch of Sale, in a small square hand. The last forty pages are the same line, written over and over: QUIET NIGHT. NO CALLERS. QUIET NIGHT. NO CALLERS. On the last page: TWO RIDERS. WEST. THEY KNEW THE WAY.',[BYE]));
khNpc('blp_ballista','A ballista','gy_lever',()=>say('A great timber crossbow on a swivel, pointed west over the town. It is cocked, and there is a bolt in it, and the string has been oiled this morning. Pell says it has not been fired in four years and he oils it every day.',[BYE]));
khNpc('blp_glass','The wall spyglass','gy_rune',()=>say('A brass spyglass on a post. Through it, to the west, past the roofs of Sale, a long white shine lies on the horizon, like a snowfield. In the foreground, quite clearly, a small chapel stands at the top of a street, and its door is shut.',[BYE]));
khNpc('blp_stairs_up','The stair to the wall walk','gy_stair',()=>say('A stair in the thickness of the wall leads up to the wall walk.',[BYE]));
/* ---------- the level ---------- */
function blpBuild(p){
  blpArt();
  const C=blKit({id:BLP.ID,W:BLP.W,H:BLP.H,name:p.name,lvl:90,start:{x:75,y:35,f:3},wind:.45});
  b9Late();
  const {hs,block,fm,hgt}=C,F=blF(),W=BLP.W,H=BLP.H,ix=(x,y)=>y*W+x;
  C.hills(.12);b9Boundary(C,W,H);C.setF(2,2,77,67,'0');
  C.pth(2,34,77,36,'1');C.pth(2,33,5,37,'4');C.pth(40,34,57,36,'4');C.pth(46,34,56,36,'3');C.pth(11,34,13,36,'4');
  C.flatten(2,28,77,42);
  C.gate('E',35);C.gate('W',35);
  // the ravine: dry, deep, the whole height of the map; the bridge deck crosses it
  for(let y=3;y<=66;y++)for(let x=46;x<=56;x++){if(y>=34&&y<=36)continue;const edge=x===46||x===56;fm[ix(x,y)]=edge?'5':'6';hgt[ix(x,y)]=edge?-.5:-1.3;block[ix(x,y)]=1;C.used.add(x+','+y)}
  for(let y=3;y<=66;y++){for(const x of [45,57]){if(y>=33&&y<=37)continue;hgt[ix(x,y)]=-.1}}
  for(let x=46;x<=56;x++){C.dec('b9_fence',x,33,{block:true,sc:.9});C.dec('b9_fence',x,37,{block:true,sc:.9})}
  for(const x of [47,51,55]){for(const y of [32,38]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,C.pale)}}
  for(const [x,y,i] of [[44,32,0],[58,32,1],[44,38,1],[58,38,0]])C.dec('gy_angel',x,y,{block:true,npc:'blp_angel'+i,sc:.9});
  // the Pale Knight stands on the bridge, a person until the party chooses
  C.dec('bl_paleknight',51,35,{block:true,npc:'blp_knight',sc:1.0});
  C.foe('blbones',42,31);
  C.post(43,37,'bl_pb_br',[{n:'THE PALE BRIDGE',d:0},{n:'HELD',d:0}],'blp_sign_br','',{i:3});
  C.milestone(42,33);
  // Sale's outer wall: three thick, the whole height, with an open arch in the road and two towers; a little toll yard inside
  const WT=C.ch(gyTile('texGrey_2',3.5,{gain:.85,rgb:[.95,1,1]})),WT2=C.ch(gyTile('texGrey_1',3.5,{gain:.8,rgb:[.92,.98,1]}));
  for(let y=3;y<=66;y++){if(y>=34&&y<=36)continue;for(let x=8;x<=10;x++)C.solid(x,y,(hs(x,y,11)<.5)?WT:WT2)}
  C.house({x0:6,x1:12,y0:27,y1:32,face:'E',sty:'flint',roof:WL_ROOFS.b9slate?'b9slate':'slate',wh:3.6,to:BLP.GUARD,door:[12,29]});
  C.house({x0:6,x1:12,y0:38,y1:43,face:'E',sty:'flint',roof:WL_ROOFS.b9slate?'b9slate':'slate',wh:3.6,to:BLP.WALK,door:[12,41]});
  for(const [x,y] of [[13,27],[13,31],[13,39],[13,43],[13,33],[13,37]]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,C.warm)}
  C.dec('gy_arch',9,35,{block:false,sc:1.5});
  C.dec('gy_rpost',6,33,{block:true,sc:1});C.dec('gy_rpost',6,37,{block:true,sc:1});C.dec('gy_rpost',4,34,{block:true,npc:'blp_toll',sc:1});C.dec('gy_rpost',4,36,{block:true,sc:1});
  C.dec('kh_oqstuff_8',3,39,{block:true,sc:.8});C.dec('kh_oqstuff_9',3,31,{block:true,sc:.8});
  C.post(5,38,'bl_pb_w',[{n:'SALE',d:-1}],'blp_sign_w','',{i:5});
  C.light(3,33,C.warm);C.light(3,37,C.warm);C.light(7,35,C.warm);
  C.person('blp_pike',5,33,2);
  // the wall is lettered with names, and the outside of it has a cairn, the glove, and the lamps
  for(const y of [10,16,22,46,52,58]){C.dec('bl_column',11,y,{block:true,npc:'blp_wall',sc:.9})}
  for(const y of [14,20,50,56]){C.dec('gy_lantern',12,y,{block:true});C.light(12,y,C.pale)}
  if(!F.glove&&!F.gloveGiven)C.dec('gy_ring',11,44,{block:true,npc:'blp_glove',sc:1,bob:.1});
  for(const [x,y] of [[12,45],[12,47]])C.dec('bl_stone2',x,y,{block:true,sc:.7});
  // the dead land between the wall and the bridge: four unlit lamps, a camp, graves, dead hedges
  BLP_LAMPS.forEach(([x,y],i)=>{const lit=(F.lamps|0)&(1<<i);C.dec('gy_lantern',x,y,{block:true,npc:'blp_lamp'+i});C.light(x,y,lit?C.warm:C.pale)});
  C.person('blp_joss',15,37,2);
  C.dec('gy_candles',24,38,{block:true,npc:'blp_camp',sc:.8});C.dec('kh_oqstuff_8',22,38,{block:true,sc:.7});C.dec('gy_chest',26,39,{block:true,npc:'blp_cartchest',sc:.9});C.light(25,40,C.pale);
  for(let a=0;a<7;a++){const x=18+a*3,y=44+(a%2);C.dec('gy_mound',x,y,{block:true,sc:.7});C.dec(['bl_wcross','bl_lean','bl_stone1'][a%3],x,y-1,{block:true,sc:.8})}
  for(let x=14;x<=44;x++){if(x>=40&&x<=43)continue;for(const y of [32,38]){if(hs(x,y,33)<.8)C.DB('bl_hedge'+((hs(x,y,35)*3)|0),x,y,{sc:.62+hs(x,y,34)*.22})}}
  // the east bank: the cart with the banner, the waystation shell, the herald, the signs, lamps
  C.dec('b9_cart',62,38,{block:true,npc:'blp_cart',sc:1});C.light(63,40,C.pale);
  C.house({x0:64,x1:69,y0:25,y1:29,face:'S',sty:'flint',roof:WL_ROOFS.b9moss?'b9moss':'moss',wh:2.4,lit:false});
  C.dec('gy_web',63,30,{sc:.7});
  C.person('blp_piper',60,33,2);
  C.milestone(72,33);
  C.dec(blSlab('bl_mile10b',['SALE','1 STAGE'],{h:1.0,top:.2,span:.62}),74,37,{block:true,npc:'blp_mile'});
  C.post(74,33,'bl_pb_e',[{n:'THE PALE BRIDGE',d:-1},{n:'THE ROOKERY MILL',d:1}],'blp_sign_e','',{i:2});
  for(let x=60;x<=76;x+=5){C.dec('gy_lantern',x,38,{block:true});C.light(x,38,C.pale)}
  for(let x=59;x<=76;x++){for(const y of [33,37]){if([72,74,60].includes(x))continue;if(hs(x,y,33)<.8)C.DB('bl_hedge'+((hs(x,y,35)*3)|0),x,y,{sc:.62+hs(x,y,34)*.22})}}
  C.dress({trees:90,scrub:160,stones:12,bones:8,posts:6,keep:(x,y)=>(y>=31&&y<=39)||(x>=2&&x<=14&&y>=24&&y<=46)||(x>=44&&x<=58)||(x>=60&&x<=70&&y>=24&&y<=31)});
  // the creatures: the dead lands are the Sovereign's; the toll yard and the arch are the watch's and quiet
  C.foes([['bldeadwarden',20,34],['bldeadwarden',30,36],['bldeadwarden',38,35],['blghoul',22,30],['blghoul',34,42],['blghoul',28,26],['blhusk',16,28],['blhusk',24,50],['blhusk',36,56],['blhusk',40,24],['blbones',20,40],['blbones',32,34],['blbones',44,50],['blshade',26,20],['blshade',36,48],['blshade',18,56],['blbloat',30,60],['blhound',22,60],['blcrow',34,28],['blcrow',24,34],
    ['bldeadwarden',64,34],['bldeadwarden',64,35],['blghoul',66,42],['blghoul',68,20],['blhusk',62,48],['blhusk',72,52],['blbones',62,22],['blshade',64,58],['blshade',70,12],['blhound',66,56],['blbones',68,44],['blcrow',66,30],['blcrowflock',72,14],['blbloat',60,56]]);
  for(const [k,x,y] of [['potion6',28,30],['potion6',64,40],['potion6',30,54]])C.items.push({k,x,y,taken:false});
  C.mapNames.push({t:'The Pale Bridge',x:51,y:35,k:'place'},{t:'The Ravine',x:51,y:20,k:'place'},{t:'The Wall of Sale',x:9,y:20,k:'place'},{t:'The Gatehouse',x:9,y:29,k:'place'},{t:'The Wall Walk',x:9,y:41,k:'place'},{t:'The Toll Yard',x:4,y:35,k:'place'},{t:'The Last Mile',x:28,y:35,k:'place'},{t:'The Cold Camp',x:24,y:38,k:'place'},{t:'The Waystation Shell',x:66,y:27,k:'place'},{t:'The Plague Cart',x:62,y:38,k:'place'},{t:'To the Rookery Mill',x:75,y:33,k:'place'},{t:'To Sale',x:2,y:33,k:'place'});
  const lv=C.finish({start:{x:75,y:35,f:3}});
  b9Dim(lv);
  // the ravine is a black drop with mist lying in it, dead roots on the lip and nothing to see at the bottom
  {const mist=[],lip=[];for(let y=4;y<=66;y+=2)for(let x=47;x<=55;x+=2){if(y>=33&&y<=37)continue;mist.push([x+((y>>1)%2),y]);}
   for(let y=4;y<=66;y+=3){if(y>=31&&y<=39)continue;lip.push([46,y],[56,y])}
   b9Mist(lv,mist,{sc:1.7,bob:0,bobr:.9});b9Mist(lv,lip,{k:'b9_twig',sc:.8,bob:0,bobr:0});
   lv.floorSet=lv.floorSet.slice();if(FLOORS.b9_abyss)lv.floorSet[6]='b9_abyss'}
  lv.tele=undefined;lv._ground={'6':'#4c4a42','5':'#7a7260','4':'#d6d0bc','3':'#cfd0cc'};
  return lv}
/* ---------- the rooms ---------- */
const blpWall=()=>{b9Art();return IMG.b9_wall?'b9_wall':IMG.wl2_wall_3?'wl2_wall_3':'kh_ohwall1_0'};
function blpGuard(){
  blRoom({id:BLP.GUARD,name:'The Gatehouse of Sale',w:13,h:9,amb:.55,rating:90,floor:'wood',wall:blpWall(),
    back:{to:BLP.ID,x:13,y:29,f:1},
    lights:[[3,2],[9,2],[6,5],[2,7],[10,7]],lcol:{'3,2':[1.4,1.0,.6],'9,2':[1.4,1.0,.6],'6,5':[1.3,.95,.6],'2,7':[1.3,.95,.6],'10,7':[1.35,.98,.58]},col:[1.3,.95,.6],
    enemies:[],
    build:C=>{const P=(n,x,y,o)=>bl3Prop(C,n,x,y,o);
      P('hearth',9,1,{h:1.3});P('clock',7,1,{h:1.1});P('weaponrack',2,1,{h:1.0});P('weaponrack',4,1,{h:1.0});P('banner',11,1,{h:1.5,block:false});
      P('counciltable',6,3,{h:.8});C.raw('gy_book',5,3,{npc:'blp_map',solid:1,deco:false,bob:.45,sc:1});C.raw('gy_book',7,3,{npc:'blp_ledger',solid:1,deco:false,bob:.45,sc:.9});
      C.npc('blp_captain',6,5);
      P('bed',2,6,{h:.8});P('bed',2,7,{h:.8});P('cot',11,6,{h:.7});P('cot',11,7,{h:.7});
      C.raw('gy_chest',10,3,{npc:'blp_gatechest',solid:1,deco:false,sc:.9});
      P('candlerack',4,5,{h:1.0});P('coatrack',9,5,{h:1.0});P('waterbarrel',9,7,{h:.7});C.raw('gy_web',1,1,{block:false,sc:.5});C.raw('gy_bones',5,7,{block:false,sc:.5})}})}
function blpWalk(){
  blRoom({id:BLP.WALK,name:'The Wall Walk',w:11,h:8,amb:.5,rating:90,floor:'cobble',wall:blpWall(),
    back:{to:BLP.ID,x:13,y:41,f:1},
    lights:[[2,2],[8,2],[5,5]],lcol:{'2,2':[1.3,.95,.6],'8,2':[.72,1.1,.95],'5,5':[1.3,.95,.6]},col:[1.0,1.0,.85],
    enemies:[],
    build:C=>{const P=(n,x,y,o)=>bl3Prop(C,n,x,y,o);
      C.raw('gy_lever',3,2,{npc:'blp_ballista',solid:1,deco:false,sc:1.3});C.raw('gy_rune',8,2,{npc:'blp_glass',solid:1,deco:false,sc:.9});
      C.npc('blp_pell',5,4);
      for(const x of [0,10])C.raw('hl_p_window',x,4,{block:true,sc:1.0});
      P('weaponrack',9,5,{h:1.0});P('waterbarrel',2,6,{h:.7});P('candlerack',1,4,{h:1.0});C.raw('barrel',9,6,{block:true,sc:.9});
      C.raw('gy_web',1,1,{block:false,sc:.5});C.raw('gy_bones',6,6,{block:false,sc:.5})}})}
for(const [id,fn] of [[BLP.GUARD,blpGuard],[BLP.WALK,blpWalk]])
  KH_LAZY[id]=()=>{if(!LEVELS[id]){if(!LEVELS[BLP.ID])KH_LAZY[BLP.ID]();blpArt();fn()}return LEVELS[id]};
/* the quest rings */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx}),T=QRF.T;
  T.blq78={give:[N(9700,'blp_joss')],act:()=>blpLamps()>=4?[N(9700,'blp_joss')]:[N(9700,'blp_lamp'+Math.min(3,blpLamps()))],ready:[N(9700,'blp_joss')]};
  T.blq79={give:[N(9700,'blp_pike')],act:()=>blF().banner||bagCount('blbanner')>0?[N(9700,'blp_pike')]:[N(9700,'blp_cart')],ready:[N(9700,'blp_pike')]};
  T.blq80={give:[N(9700,'blp_piper')],act:()=>blpPassed()?[N(9701,'blp_captain')]:[N(9700,'blp_knight')],ready:[N(9701,'blp_captain')]};
  T.blq81={give:[N(9701,'blp_captain')],act:()=>blF().glove||bagCount('blwrenglove')>0?[N(9701,'blp_captain')]:[N(9700,'blp_glove')],ready:[N(9701,'blp_captain')]}}
blRegister(10,blpBuild,{fromE:{x:75,y:35,f:3},fromW:{x:4,y:35,f:1},exitY:35,rooms:[9701,9702],names:{9701:'The Gatehouse of Sale',9702:'The Wall Walk'},rating:{9701:90,9702:90}});
