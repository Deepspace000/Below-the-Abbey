/* ==========================================================================
   PLACE 8 OF THE BLIGHTED ROAD: HOLLOWBELL ABBEY (level 9680, rated 88; prefix blh / BLH). 84 by 76.
   A ruined monastery of undead monks, and the plague bell, cast of pale silver, that tolls the dead up. Sister house of the Hollow Abbey under Oldhaven (Brother Sevrin).
   The road runs east to west along y 37 to 39 (east gate x 82 back to the Vault of Maldrake, 9670; west gate x 1 on to the Rookery Mill, 9690). A lane goes north from the road to the abbey gate in the precinct wall.
   Inside the wall: the cloister (arcade, garth, well), the abbey church (fallen in; a stair down to the crypt), the chapter house, the scriptorium, the refectory, the bell tower, the brothers' graves, the dormitory ruin.
   Rooms: 9681 the chapter house, 9682 the scriptorium, 9683 the refectory, 9684 the ringing chamber (bell tower), 9685 the belfry (the plague bell and the Abbot), 9686 the crypt of the brothers.
   People: Brother Elias (living, gate lodge, blh_elias), Prior Hugh (ghost, chapter house, blh_prior), Brother Cuthbert the bell-ringer (ghost, blh_cuthbert), Brother Anselm the cook (ghost, blh_anselm), Brother Osmund the scribe (ghost, blh_osmund).
   Boss: Abbot Cornelius, who keeps tolling (blabbot, rating 88, belfry). While the bell can still be rung it tolls the dead up out of the graves; cutting its three ropes (blq72) or killing the Abbot stops it.
   Quests: blq70 The Sister House (Elias), blq71 The Silent Supper (Anselm), blq72 The Bell Ropes (Cuthbert), blq73 The Tolling Abbot (Prior Hugh).
   Flags: G.flags.bl = {letter, letterRead, hb (kills of Hollow Brothers since blq71), ropes (bitmask of three), abbot, chapterChest, crypt1, tolled}.
   ========================================================================== */
const BLH={ID:9680,CHAPTER:9681,SCRIPT:9682,REFEC:9683,TOWER:9684,BELFRY:9685,CRYPT:9686,W:84,H:76};
BL_ROAD[7].W=BLH.W;BL_ROAD[7].H=BLH.H;
for(const [id,n] of [[9681,'The Chapter House'],[9682,'The Scriptorium'],[9683,'The Refectory'],[9684,'The Ringing Chamber'],[9685,'The Belfry of Hollowbell'],[9686,'The Crypt of the Brothers']]){LEVEL_NAMES[id]=n;LEVEL_RATING[id]=88}
/* ---------- things carried ---------- */
ITEMDEF.blsevrinletter={n:"Brother Sevrin's Letter",k:'quest',t:'Quest item',ic:'book',c:'#c8bc98',stack:1,price:0,sw:.1,d:'A folded letter sealed with a grey rose pressed into the wax. It is addressed to the Prior of Hollowbell and was never opened. It is in the hand of Brother Sevrin of the Hollow Abbey under Oldhaven. Prior Hugh should read it.'};
ITEMDEF.blsilverclapper={n:'The Silver Clapper',k:'quest',t:'Quest item',ic:'ore',c:'#d8e0ea',stack:1,price:0,sw:.8,d:'The clapper of the plague bell of Hollowbell, a heavy tongue of pale silver as long as a forearm. It is cold, and it hums when nothing is near it. Crows are said to love pale silver.'};
ITEMDEF.blgreyring={n:'Ring of the Grey Rose',k:'ring',t:'Ring',ic:'ring',c:'#a8b0b0',price:0,lvl:88,pas:{ward:18,dodge:.06,regen:.7,mpRegen:.5},int:6,hp:90,rar:1,sw:.1,d:'A plain ring of grey metal with a small rose cut into the bezel. Brother Sevrin gave one to every brother he trusted. Adds 6 Intelligence and 90 health, every blow on the wearer is 18 lighter, enemies miss 6% more, and wounds and weariness close steadily. Needs level 88.'};
ITEMDEF.blringercowl={n:"Bell-Ringer's Cowl",k:'head',t:'Helm',ic:'head',c:'#7a7468',armor:18,price:0,lvl:88,pas:{dmgPct:.06,dodge:.03,regen:.5},rar:1,gear:1,sw:.3,d:'A thick wool cowl with the ears padded, worn by the ringers of Hollowbell against the noise of the bell. Armour 18, damage +6%, enemies miss 3% more, and wounds close steadily. Needs level 88.'};
ITEMDEF.blabbotcrozier={n:"Abbot Cornelius's Crozier",k:'weapon',t:'Sword',ic:'sword',c:'#c8ccd4',dmg:[480,590],hit:.2,req:{str:72},lvl:88,price:0,rar:1,eff:{bleed:[.3,6,40],bossdmg:.36},dbl:.22,sw:.5,d:'The staff of the Abbot of Hollowbell, a long shaft of black wood with a hook of pale silver. It rings a little when it strikes. Wounds bleed, and bosses take 36% more. Needs level 88.'};
/* ---------- creatures ---------- */
Object.assign(ENEMY_DEF,{
  blbrother:{name:'Hollow Brother',hp:54,dmg:[6,11],hit:.86,w:blW('crA_2',.7),img:'gyi_bmage',xp:25,gold:[0,0],speed:1,ranged:2,verb:'blasts',bl:1,glow:.3},
  blringer:{name:'Dead Bell-Ringer',hp:62,dmg:[7,12],hit:.86,w:blW('crB_0',.95),img:'gyi_wraith',xp:27,gold:[0,0],speed:1,verb:'rakes',bl:1,glow:.15},
  blabbot:{name:'Abbot Cornelius',hp:440,dmg:[11,17],hit:.9,w:blW('boss_3',2.0),img:'bl_abbot',xp:800,gold:[0,0],speed:1,verb:'strikes',boss:true,aboveParty:0,bl:1,still:1,glow:.25,wake:'The Abbot of Hollowbell turns from the bell. A pale light runs along the hook of his crozier, and the rope beside him swings by itself.'}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('blabbot');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('blabbot');
if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.blabbot=[3600,4400];
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^blabbot/,'haunted',.3],[/^blbrother/,'cursed',.15]);
/* ---------- the pictures: all painted pieces of the game, greyed or made pale by a filter ---------- */
function blhArt(){
  if(BLH._art)return;
  try{blcArt()}catch(e){}
  bl3Tint('bl_abbot','gyp_boss_3','saturate(.25) brightness(.95) contrast(1.05)',null);
  bl3Tint('bl_hall','wl_bldg1_1','saturate(.4) brightness(.68) sepia(.15)',null);
  bl3Tint('bl_tower','wl_bldg1_4','saturate(.35) brightness(.66) sepia(.1)',null);
  bl3Tint('bl_silverbell',IMG.hpb_bell_4?'hpb_bell_4':'gy_bell','grayscale(.85) brightness(1.4) contrast(.95)',IMG.hpb_bell_4?.85:1.0);
  bl3Tint('bl_silverbellL',IMG.hpb_bell_4?'hpb_bell_4':'gy_bell','grayscale(.85) brightness(1.4) contrast(.95)',IMG.hpb_bell_4?.85:1.0);
  /* round 2: painted pieces (Gemini): the ruined church front, the Abbot, and the bell (made pale silver here) */
  if(IMG.blh_church&&IMG.blh_church.width){bl3Tint('bl_church',IMG.blh_church,'saturate(.85) brightness(.95)',1)}
  if(IMG.blh_abbot&&IMG.blh_abbot.width){IMG.bl_abbot=IMG.blh_abbot;NPC_H.bl_abbot=1.9;ENEMY_DEF.blabbot.w=+(1.9*IMG.blh_abbot.width/IMG.blh_abbot.height).toFixed(2)}
  if(IMG.bl_bell&&IMG.bl_bell.width){bl3Tint('bl_silverbell',IMG.bl_bell,'grayscale(.75) brightness(1.55) contrast(.9)',.85);bl3Tint('bl_silverbellL',IMG.bl_bell,'grayscale(.75) brightness(1.55) contrast(.9)',.85)}
  bl3Tint('bl_rope','ww_ribbon','saturate(.3) brightness(.7) sepia(.5)',.9);
  bl3Ghost('bl_g_prior','kh_ohcourt1_5');bl3Ghost('bl_g_cuth','kh_ohfolk5_3');bl3Ghost('bl_g_anselm','kh_ohfolk2_2');bl3Ghost('bl_g_osmund','kh_ohfolk2_1');bl3Ghost('bl_g_monk','kh_ohfolk1_4');bl3Ghost('bl_g_monk2','kh_ohfolk5_4');
  for(const [k,h] of [['bl_g_prior',.98],['bl_g_cuth',.98],['bl_g_anselm',.98],['bl_g_osmund',.98],['bl_g_monk',.98],['bl_g_monk2',.98],['gy_ghost0',1.1],['gy_ghost1',1.1],['gy_ghost2',1.1],['gy_banshee',1.0],['ww_cauldron',.95],['kh_cart1_0',1.1],['mi_pew',.8]])if(NPC_H[k]===undefined||k.startsWith('bl_g_'))NPC_H[k]=h;
  BLH._art=1}
/* the monk art is made when the first level of the abbey is built; the names are registered at once */
bl3Hide(9680,'blh_none',()=>false);
/* ---------- the sound: the plague bell ---------- */
const BLHS={next:0,raised:0};
function blhToll(vol){try{playSmp('church_bell1',vol,.5);setTimeout(()=>playSmp('church_bell2',vol*.7,.42),400)}catch(e){blsToll(1,vol)}}
const blhRopes=()=>{const m=blF().ropes|0;return (m&1?1:0)+(m&2?1:0)+(m&4?1:0)};
const blhTolling=()=>!blF().abbot&&blhRopes()<3;
function blhTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!SNDOPT.amb)return;
  const now=AC.currentTime;
  if(LEVEL<BLH.ID||LEVEL>BLH.ID+9)return;
  if(!blhTolling()){return}
  if(now<BLHS.next)return;
  const here=LEVEL===BLH.ID,near=LEVEL===BLH.TOWER||LEVEL===BLH.BELFRY;
  BLHS.next=now+(near?16:26)+Math.random()*14;
  blhToll(near?1:here?.75:.4);
  if(here){try{msg('The plague bell tolls, and somewhere in the graves something answers it.','#b8d0a8')}catch(e){}blhRaise()}}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{blhTick()}catch(e){console.error('blh tick',e)}}}
/* a toll raises a dead man from a grave in the precinct (at most three at a time, never close to the party) */
function blhRaise(){
  const alive=G.enemies.filter(e=>e.toll&&e.hp>0).length;if(alive>=3)return;
  const L=LEVELS[LEVEL],gs=L.decor.filter(d=>d.k==='gy_mound'&&Math.hypot(d.x-G.P.x,d.y-G.P.y)>8&&Math.hypot(d.x-G.P.x,d.y-G.P.y)<26);if(!gs.length)return;
  const g=gs[(Math.random()*gs.length)|0],m=bl3Add(Math.random()<.5?'blbones':'blghoul',g.x,g.y+1,88);if(m){m.toll=1;m.alert=true;BLHS.raised++}}
/* ---------- the people ---------- */
const BLH_ELIAS=['Brother Elias. I am the only brother left who is alive, and I was not here when it happened. I was at the market in Wenlock buying lamp oil. I came back and found them all standing in the cloister, listening.','The bell was a gift. A clerk in a grey coat brought it in a cart, wrapped in sacking, and said the Sovereign wished the abbey well. It was cast of pale silver, and it had the sweetest note any of us had ever heard. Prior Hugh said it was a mercy for the sick.','It does not ring them to prayer. It rings them up. Every stroke, one more brother or one more pilgrim gets out of the ground and comes to the abbey, looking for somebody. They are very polite about it.','I sleep in the gate lodge, outside the wall. The wall is only a wall, but the dead do not like to cross a road. I think they remember that roads are for going somewhere.'];
khNpc('blh_elias','Brother Elias','kh_ohfolk5_3',()=>yrLines('blh_elias',BLH_ELIAS));
const BLH_PRIOR=['(The ghost of an old man in a bishop\'s cope sits in the Prior\'s stall, very upright.) Prior Hugh of Hollowbell. You will forgive me not rising. I did rise once, in the night, and stood in the cloister for some years, and I find that I prefer to sit.','I took the bell. I want you to know that I took it, and that nobody forced me. The sick were dying in the infirmary faster than we could bury them, and the clerk said it would call them home to rest. It did. It called them home, and it did not let them rest.','The Abbot, Cornelius, rings it now. He was the strongest of us, and the first to hear it properly. I told him to stop. He said, I cannot, Hugh, it is the only thing I am sure of. I have not spoken to him since. It is a very long time to be cross with a friend.','If you go up the tower, be quick about it. The ringers are not unkind, but they do not know that the supper is over.'];
khNpc('blh_prior','Prior Hugh, a ghost','bl_g_prior',()=>yrLines('blh_prior',BLH_PRIOR));
const BLH_CUTH=['(A ghost in a brown habit, with a heavy leather pad over each ear, nods at you and says something. You cannot hear it. He points at his ears and shrugs.) Cuthbert. Chief ringer. I am deaf, you see. Forty years under that bell. It is the only reason I did not hear it the night it changed.','I do not ring it. I want to say that plainly. The Abbot rings it by hand, from above, and I have been pulling on the ropes down here to try to stop him, and I cannot cut them. My hands go through. You are alive. A living hand can cut a rope.','Three ropes in all. Two come down into this room, one goes up into the belfry beside the bell itself. Cut them all and the Abbot has nothing to pull. He will still have his crozier, mind.','You will find the Abbot a very sad man. They are the worst kind to fight. They do not hold back.'];
khNpc('blh_cuthbert','Brother Cuthbert, a ghost','bl_g_cuth',()=>yrLines('blh_cuthbert',BLH_CUTH));
const BLH_ANSELM=['(A stout ghost in a floury apron stands at the hearth with a ladle in his hand.) Brother Anselm, cook. You have come for supper. Good. Everybody has come for supper. It is the best attended supper we have ever had. I have had to put out four extra tables.','They sit. They do not eat. I put out the soup and the soup goes cold and I take it back and put out more. I do not mind. A cook cooks. It is the one thing I am still sure that I am.','The ones who walk in the cloister are late, you understand. They come in at all hours, they track mud, and they do not say grace. I cannot serve a table that will not stay sat.','Mind the soup. It is only soup. But it has been there a very long time.'];
khNpc('blh_anselm','Brother Anselm, a ghost','bl_g_anselm',()=>yrLines('blh_anselm',BLH_ANSELM));
const BLH_OSMUND=['(A thin ghost in a grey habit, with ink on his fingers, looks up from a desk and then goes on writing.) Osmund, scribe. I am copying the Rule. I have copied it nine hundred and fourteen times. I find the same mistake in every copy and I cannot fix it, because it is in the original.','I wrote down what happened the night of the first toll, as I was supposed to. The page is in the back of the book on the lectern. I would not read it before supper.','There is a letter on my desk that came the same day as the bell. I have never opened it. It is not addressed to me. A scribe does not read other people\'s post. It is the one rule I have never broken, and it is the only thing I am proud of.'];
khNpc('blh_osmund','Brother Osmund, a ghost','bl_g_osmund',()=>yrLines('blh_osmund',BLH_OSMUND));
const BLH_MONKS=[['(A ghostly brother in a brown habit kneels with his hands together.) "...and forgive us our silence, and our bell, and the people in our graves, as we forgive those who ring it."','(He does not seem to see you.) "Amen. Amen. Is it time for the bell? It must be nearly time for the bell."'],['(A ghost in a black robe stands very straight, with a book open in his hands, reading it upside down.) "I like to think I am being useful. It is a very good book. I have been reading it for ever and I do not know how it ends."','(He turns a page.) "I know it ends. Somebody has told me. I just cannot find it."']];
for(let i=0;i<2;i++)khNpc('blh_monk'+i,'A ghost of the abbey',i?'bl_g_monk2':'bl_g_monk',()=>yrLines('blh_monk'+i,BLH_MONKS[i]));
/* ---------- the quests ---------- */
const blhHb=()=>Math.min(6,blF().hb|0);
const blhLetterOk=()=>!!blF().letterRead;
bl3Q('blq70','The Sister House','Brother Elias',[
  ["Find the unopened letter from Brother Sevrin of the Hollow Abbey, on a desk in the scriptorium (the house on the west side of the cloister).",()=>!!(blF().letter||blF().letterRead),['blh_letter']],
  ["Read Brother Sevrin's letter to Prior Hugh, in the chapter house (the hall on the east side of the cloister).",()=>blhLetterOk(),['blh_prior']]],
  {gold:4000,xp:34000,items:['blgreyring','potion6']});
bl3Q('blq71','The Silent Supper','Brother Anselm, a ghost',[
  ['Put six Hollow Brothers to rest. They walk the cloister and the yard and will not sit for supper.',()=>blhHb()>=6,['blh_anselm']]],
  {gold:3800,xp:32000,items:['potion6','potion6','potion6']});
bl3Q('blq72','The Bell Ropes','Brother Cuthbert, a ghost',[
  ['Cut the three ropes of the plague bell: two in the ringing chamber at the foot of the tower, one in the belfry beside the bell.',()=>blhRopes()>=3,['blh_rope0','blh_rope1','blh_rope2']]],
  {gold:4200,xp:35000,items:['blringercowl','potion6']});
bl3Q('blq73','The Tolling Abbot','Prior Hugh, a ghost',[
  ['Put Abbot Cornelius to rest in the belfry, at the top of the bell tower. He has the pale silver clapper.',()=>!!blF().abbot,['blh_abbotdoor']]],
  {gold:5600,xp:40000,items:['potion6','potion6']});
wwGive('blh_elias','blq70',()=>true,{
  offer:'Will you do something for me? A letter came to the abbey the day the bell did. A brother in the house under Oldhaven wrote it, and it was never opened. I think it was a warning. I think it came an hour too late. It lies on a desk in the scriptorium. I cannot go in. Read it to Prior Hugh, and perhaps he will know what he did not know.',
  accept:'Thank you. The scriptorium is the long house west of the cloister. The scribe there is polite and will not mind. The Prior is in the chapter house, in his stall.',
  remind:()=>blF().letter||bagCount('blsevrinletter')>0?'You have the letter. Read it to Prior Hugh in the chapter house, east of the cloister.':'The letter is on a desk in the scriptorium, west of the cloister.',
  ready:'You read it to him? What did he say? ... Ah. Then it was a warning. Thank you for telling me. I would rather know.',
  thanks:'Take this. Sevrin gave one to every brother he trusted, and Hugh kept mine for me. It is not much of a ring. It is a very good rose.',
  after:'I have written to Sevrin, at the Hollow Abbey, to say that his letter was read. I shall give it to the next pilgrim going east.'});
wwGive('blh_anselm','blq71',()=>true,{
  offer:'Will you help me? There are brothers who walk the cloister at all hours, with their hoods up, and they will not come in to supper. I cannot serve a table that will not stay seated. If six of them were put to rest, the rest might feel they could sit. They blast with a pale light, and they do not stop for the soup.',
  accept:'Six, then. They are in the cloister and the yard, and the quiet ones by the graves. Be kind, if you can. They were good brothers.',
  remind:()=>'Six Hollow Brothers. You have put '+blhHb()+' to rest.',
  ready:'Six. I felt it, you know, in the kitchen. The room went quiet, all at once, like a pot that has been taken off the fire.',
  thanks:'A cook gives what a cook has. I have nothing but gratitude and a great deal of cold soup. Take both. The gold is the Abbey\'s, and I think it would want you to have it.',
  after:'The tables are a little emptier. I have put out clean bowls, in case any of them change their minds.'});
wwGive('blh_cuthbert','blq72',()=>true,{
  offer:'Will you cut the ropes? I have tried and tried, and my hands go through. The Abbot pulls the bell by hand, up in the belfry, and the sound brings the dead out of the ground. Three ropes: two down here, in this room, and one beside the bell. Cut them and he cannot toll. I would be very grateful, and I shall not hear a word of it.',
  accept:'Good. Use a blade, or anything sharp. They are thick, and old, and they are very cold. Do not hold on to them while you cut. They pull.',
  remind:()=>'You have cut '+blhRopes()+' of the three ropes. Two are in this room, and one is up in the belfry.',
  ready:'It has stopped. I felt it in my feet. For the first time in forty years, nothing is ringing. Oh, I do not like the quiet. Thank you.',
  thanks:'Take the cowl. A ringer wears it for the noise. You will not need it now, but I think I should like it to go on being worn.',
  after:'I sit in the tower in the evenings and listen to nothing. It is a great deal of nothing. I am getting used to it.'});
wwGive('blh_prior','blq73',()=>blF().letterRead||qSt('blq70')==='done',{
  offer:'Will you stop him? Cornelius will not stop, and I cannot make him. He is up in the belfry with the bell, and he is not himself, and he is stronger than any of us ever was. He has the clapper, the tongue of pale silver, and as long as he has it the bell will find a way to ring. Put him to rest. Be gentle if you can, but do not be gentle at the cost of yourselves.',
  accept:'Thank you. Up the tower, through the ringing chamber, up the stair. He will warn you. He is a courteous man. It is his greatest fault.',
  remind:()=>'The Abbot is in the belfry, at the top of the bell tower in the north west corner of the abbey. Cut the ropes first, if you can, so that he cannot call the dead.',
  ready:'It is quiet. I have waited a long time for it to be quiet. Thank you. I am glad it was you, and not one of us.',
  thanks:'Take what is left of the abbey. The clapper is for you to keep, and for you to decide about. Pale silver is a dangerous gift, whoever gives it.',
  after:'I have been to the cloister. It is empty. I walked the whole of it and nobody was there. It is the first time in my life that I have been glad of a ruined abbey.'});
/* the letter is read to the Prior */
yrHook('blh_prior',d=>{const F=blF();
  if(qSt('blq70')==='active'&&(F.letter||bagCount('blsevrinletter')>0)&&!F.letterRead)return say('Prior Hugh looks at the letter in your hand, and the grey rose in the wax, and does not move at all.',[['Read it to him.',()=>{F.letterRead=1;bagRemove('blsevrinletter',1);sfx('win');msg("You read Brother Sevrin's letter to Prior Hugh.",'#ffe36a');return say('"To the Prior and Brothers of Hollowbell. Dear Hugh. We have shut our own Abbot under his chair, and he will still not hush. The Court below asks for silver too. If the Sovereign has sent you a gift, a bell, a cart of grain, anything, do not use it. I have seen what pale silver does to a house that is hungry. If you have already taken it, do not ring it. Pull the ropes. Plant something. Your friend, Sevrin." The Prior is quiet for a long time. "He always did write a good letter," he says. "And there was a postscript?" There is. "I still have your cuttings of the grey rose. They have taken well." The Prior laughs, once, and covers his face.',[BYE])}],['Not yet.',()=>null]]);
  return null});
/* ---------- the objects ---------- */
bl3Take('blh_letter','A letter on a desk','gy_book','letter','blsevrinletter',
  'A single folded letter lies on the scribe\'s desk, with a grey rose pressed into the wax. It has never been opened. Written across the front: TO THE PRIOR AND BROTHERS OF HOLLOWBELL. FROM BROTHER SEVRIN, OF THE HOUSE UNDER OLDHAVEN.',
  'The desk is bare where the letter lay. There is a clean square in the dust.','Take the letter.',"You take Brother Sevrin's letter.");
const BLH_GRAVES=[['BR. WILFRID','Cellarer. Counted every cask.'],['BR. MARTIN','Gardener of the infirmary.'],['BR. TOBIAS','Novice. Nineteen.'],['BR. JOHN','Choirmaster. Died singing.'],['BR. AMBROSE','Porter. Let in the cart.'],['BR. NICHOLAS','Brewer. Left a good ale.'],['BR. PETER','Infirmarian. Died last.']];
for(let i=0;i<8;i++)khNpc('blh_grave'+i,'A grave board','bl_slab',()=>{const t=BLH_GRAVES[i]||['PILGRIMS','Buried without a name, in the quarantine rows.'];return say(t[0]+'. '+t[1]+' Cut under it, smaller: HE HEARD THE BELL.',[BYE])});
khNpc('blh_sign_lane','A signboard','greensign',()=>say('A board at the foot of the lane. HOLLOWBELL ABBEY. PILGRIMS WELCOME. GUESTS RECEIVED AS CHRIST. Below it, in a newer hand: PLEASE DO NOT RING THE BELL. It has been scratched at, and a second hand has added: IT RINGS ITSELF.',[BYE]));
khNpc('blh_well','The cloister well','ww_well',()=>say('A stone well in the middle of the garth, with a wooden lid. Cut round the rim: THE WATER OF HOLLOWBELL IS SWEET. The water is dark, and a long way down. When you lean over, a bell sounds, once, from the bottom of the shaft.',[BYE]));
khNpc('blh_church','The abbey church','bl_church',()=>say('The abbey church has fallen in. The nave is open to the sky and filled with nettles, and the altar stands in the middle of them, quite clean. At the crossing a narrow stair goes down into the dark.',[BYE]));
khNpc('blh_dorm','The dormitory','bl_chapel',()=>say('The ruin of the dormitory. Forty beds in a row, and every one of them made. The roof is gone, and the rain has not reached the blankets. A hand-lettered card on the end of each bed gives a name, and under the name, a word: GONE.',[BYE]));
khNpc('blh_infirmary','The infirmary garden','gy_rose',()=>say('A herb garden gone to weeds. In one bed, among the nettles, a single grey rose is flowering. A label on a stick says: SEVRIN, CUTTING. TAKEN WELL.',[BYE]));
khNpc('blh_foundry','The bell foundry','ww_cauldron',()=>say('A ring of black stones, a clay furnace and a pit as wide as a cart. The pit is lined with grey ash, and in the bottom lies a mould of broken clay in the shape of a bell. Nothing grows within ten paces. A tin plate says: CAST HERE, ON THE FEAST OF ST JUDE, BY THE ABBEY, FOR THE ABBEY, AT ITS OWN EXPENSE. The sum is cut out with a knife.',[BYE]));
khNpc('blh_cart','A plague cart','kh_cart1_0',()=>say('A two-wheeled cart, tipped on its side, with a faded sheet. A card nailed to the shaft reads: FOR THE INFIRMARY, FROM A FRIEND. Underneath, the same neat hand has written: AND THERE IS MORE WHERE THIS CAME FROM.',[BYE]));
khNpc('blh_lodge','The gate lodge','bl_hut',()=>say('A little lodge outside the wall, with a bed, a kettle and a shelf of lamp oil. A card by the door: BR. ELIAS. PLEASE KNOCK. THE DEAD NEED NOT.',[BYE]));
const BLH_BOOK='The Rule of Hollowbell lies open on a lectern. "Chapter 1: Of the Silence. Chapter 2: Of the Hours. Chapter 3: Of the Bell, which shall be rung by the sacristan alone, at the hours, and at no other time." At the back, in a fresher hand, a page headed THE FIRST TOLL. "The bell was rung at midnight, by the Abbot, to try the note. It was very fine. Forty-one brothers went to the windows to listen. When we looked out, the graveyard was full of people, all standing very still, and all of them facing the abbey, and all of them smiling. It is written here that we were glad."';
khNpc('blh_rule','The Rule of Hollowbell','gy_book',()=>say(BLH_BOOK,[BYE]));
khNpc('blh_chapterchest','The chapter chest','gy_chest',()=>{const F=blF();if(F.chapterChest)return say('The chest is open. A list inside is headed OFFERINGS, and is empty.',[BYE]);
  return say('An iron-bound chest with three locks, all of which are open. Inside lie the pilgrim offerings of forty years.',[['Take what is in it.',()=>{F.chapterChest=1;G.gold+=1800;sfx('win');msg('You take 1800 gold.','#ffe36a');return null}],BYE])});
khNpc('blh_abbotseat','The Abbot\'s seat','mi_pew',()=>say('A tall carved stall at the head of the chapter house, with a cushion worn to the shape of a very heavy man. A cup of stale wine stands on the arm. On the back of the seat somebody has cut: CORNELIUS. HE IS NEEDED ELSEWHERE.',[BYE]));
khNpc('blh_stall','A chapter stall','mi_pew',()=>say('A carved stall with a name plate. All the plates are different, and all the stalls are empty, and all the cushions are warm.',[BYE]));
khNpc('blh_table','The refectory table','gy_candles',()=>say('A long table laid for forty. Every bowl is full of soup, grey and still, and a skeleton in a cowl sits at every place with a spoon in its fingers. A reading lectern at the end holds a book open at the same page it has always been open at: THE LIFE OF SAINT BENEDICT, CHAPTER FOUR. A cook\'s ghost says: they will not eat, but they like to be asked.',[BYE]));
khNpc('blh_seated','A brother at supper','gy_skel',()=>say('A skeleton in a brown cowl sits at the table with a spoon in its hand. The spoon is in the soup. The soup is a very long time old. When you lean closer the jaw moves, and a dry voice says, without any malice: "Is it the bell?"',[BYE]));
khNpc('blh_kitchen','The kitchen range','gy_candles',()=>say('A big black range with seven pots on it, all of them simmering. The fire has no fuel and no ash. A ladle hangs ready on every hook. Chalked on the wall: SOUP. SOUP. SOUP. BREAD (NONE).',[BYE]));
khNpc('blh_tower','The bell tower','bl_tower',()=>say('A round tower of grey stone with a conical roof, higher than the church. A slit window near the top glows faintly white. Every few minutes the whole tower hums.',[BYE]));
khNpc('blh_ruin','A ruined wall','bl_column',()=>say('A broken stretch of the precinct wall, with the stones tumbled out into the grass. Somebody has built a small cairn on top, and put a pale stone on it.',[BYE]));
for(let i=0;i<3;i++)khNpc('blh_rope'+i,'A bell rope','bl_rope',d=>{
  const F=blF(),bit=1<<i;
  if((F.ropes|0)&bit)return say('The rope has been cut. The loose end hangs a little above the floor, and does not swing.',[BYE]);
  return say(['A thick bell rope hangs from the ceiling, grey with age, with a woolly grip at the end. It is cold to the touch, and it moves a very little when nobody is near it.','The second rope. It is thicker than the first, and wet, and it is moving as if somebody far above were pulling.','The third rope hangs beside the plague bell itself. It is as thick as an arm, and it is warm, and the bell above it is humming.'][i]||'A bell rope.',
    [['Cut the rope.',()=>{F.ropes=(F.ropes|0)|bit;d&&(d.found=true,d.hidden=true);sfx('key');
      if(blhRopes()>=3){msg('The last rope falls. The bell hangs silent.','#ffe9a0');bl3Heal()}else msg('You cut the rope ('+blhRopes()+' of 3).','#ffe36a');
      if(qSt('blq72')==='active'&&blhRopes()<3)yrStep('You cut a bell rope ('+blhRopes()+' of 3).');return null}],BYE])});
khNpc('blh_bell','The plague bell','bl_silverbell',()=>say('The plague bell of Hollowbell hangs in the middle of the belfry, taller than a man, and white as new snow. It is cast of pale silver, and nothing has ever tarnished it. A line is cut round the lip: I CALL THE HOUSEHOLD HOME. Even when it is still, the air near it hums. '+(blhRopes()>=3||blF().abbot?'The clapper is gone. It will never ring again.':'It is the sweetest sound you have ever wanted to run away from.'),[BYE]));
khNpc('blh_abbotdoor','Stairs up to the belfry','gy_stair',()=>say('A narrow stone stair winds up the tower. The air coming down it is cold and smells of rain and silver.',[['Climb to the belfry.',()=>{sfx('door');G.talk=null;goToLevel(BLH.BELFRY,{x:7,y:9,f:0});return null}],BYE]));
khNpc('blh_stairdown','Stairs down','gy_stair',()=>say('The stair back down to the ringing chamber.',[['Go down.',()=>{sfx('door');G.talk=null;goToLevel(BLH.TOWER,{x:4,y:2,f:2});return null}],BYE]));
khNpc('blh_cryptdoor','The stair to the crypt','gy_stair',()=>say('A stair under the fallen crossing of the church, going down. A smell of cold stone and old candle comes up it.',[BYE]));
khNpc('blh_coffin','A brother\'s coffin','gy_coffin',()=>say('A plain coffin with a name plate. The lid has been pushed aside from inside, and the plate says: BR. WILFRID. HE COUNTED EVERYTHING. The inside is empty, and neat.',[BYE]));
for(let i=0;i<3;i++)khNpc('blh_sarc'+i,'An abbot\'s tomb','gy_sarc',()=>say(['ABBOT ANSELM I. HE FOUNDED THIS HOUSE. HE RANG THE FIRST BELL, WHICH WAS OF IRON, AND WAS SATISFIED.','ABBOT GILES. HE BUILT THE CLOISTER. HE SAID IT WAS FOR THE BROTHERS TO WALK IN, AND NOT FOR THE BELL TO BE HEARD IN.','ABBOT CORNELIUS. A LEFT SPACE, AND A NAME CUT IN IT, AND A DATE THAT HAS NOT YET BEEN FILLED IN.'][i],[BYE]));
khNpc('blh_cryptchest','A brothers\' chest','gy_chest',()=>{const F=blF();if(F.crypt1)return say('The chest is open and empty.',[BYE]);
  return say('A small iron chest with a candle stub on the lid. It holds what the brothers kept for their burial.',[['Open it.',()=>{F.crypt1=1;G.gold+=2000;bl3Give('potion6');sfx('win');msg('You take 2000 gold and a potion.','#ffe36a');return null}],BYE])});
/* the abbot: three phases of his bell */
bl3Hit('blabbot',e=>{const fr=e.hp/e.maxhp;e._ph=e._ph|0;
  const ph=fr<=.33?2:fr<=.66?1:0;
  if(ph>e._ph){e._ph=ph;
    if(blhRopes()<3){const a=bl3Add('blbones',e.x-2,e.y+2,88),b=bl3Add('blbrother',e.x+2,e.y+2,88);if(a||b){msg('The Abbot strikes the bell with his crozier. Two of the brothers climb up out of the floor.','#d8c8e0');sfx('growl')}}
    else msg('The Abbot reaches for the bell rope, and finds it cut. He weeps.','#b8d0a8')}});
bl3Kill('blabbot',e=>{const F=blF();if(F.abbot)return;F.abbot=1;
  bl3Give('blabbotcrozier');bl3Give('blsilverclapper');bl3Heal();sfx('win');
  try{msg("Abbot Cornelius lays down his crozier. The pale silver clapper rolls out of his sleeve. You take the Abbot's crozier and the Silver Clapper.",'#ffe36a')}catch(x){}
  try{blhToll(1.2)}catch(x){}});
/* Hollow Brothers put down count towards blq71 */
bl3Kill('blbrother',e=>{if(qSt('blq71')==='active'){const F=blF();F.hb=(F.hb|0)+1;if(F.hb<=6)msg('A Hollow Brother put to rest ('+Math.min(6,F.hb)+' of 6).','#ffe36a')}});
/* ---------- the level ---------- */
function blhBuild(p){
  blhArt();
  const C=blKit({id:BLH.ID,W:BLH.W,H:BLH.H,name:p.name,lvl:88,start:{x:79,y:38,f:3},wind:.36});
  const {hs}=C,F=blF();
  C.hills(.16);C.boundary();C.setF(2,2,81,73,'0');
  C.pth(2,37,81,39,'1');
  C.pth(40,25,42,36,'3');C.pth(30,13,46,13,'3');C.pth(30,23,46,23,'3');C.pth(29,13,29,23,'3');C.pth(47,13,47,23,'3');C.pth(30,18,46,18,'3');C.pth(38,13,38,23,'3');
  C.pth(23,14,28,14,'3');C.pth(48,17,56,17,'3');C.pth(49,24,54,24,'3');C.pth(22,9,29,9,'3');C.pth(29,9,29,12,'3');C.pth(36,10,36,12,'3');
  C.flatten(2,3,81,40);
  C.gate('E',38);C.gate('W',38);
  // the precinct wall: ruined, with a gap at the gate
  for(let x=14;x<=70;x++){if(x>=40&&x<=42){}else if(hs(x,31,3)<.9)C.DB('bl_fence',x,31,{sc:.95});if(hs(x,4,3)<.9&&!(x>=20&&x<=25))C.DB('bl_fence',x,4,{sc:.95})}   // no fence inside the bell tower (21 to 24) or touching it
  for(let y=5;y<=30;y++){if(hs(14,y,3)<.88)C.DB('bl_fence',14,y,{sc:.95});if(hs(70,y,3)<.88)C.DB('bl_fence',70,y,{sc:.95})}
  for(const [x,y] of [[14,4],[70,4],[14,31],[70,31],[39,31],[43,31]]){C.DB('bl_column',x,y,{sc:1.1,npc:x===39||x===43?undefined:'blh_ruin'});}
  C.dec('gy_lych',41,31,{sc:1.1});C.light(40,30,C.pale);C.light(42,30,C.pale);
  // the church, fallen in: the painted church over a hidden block; the door goes down to the crypt
  C.picHouse({img:'bl_church',x0:33,x1:40,y0:5,y1:9,w:IMG.blh_church?6.8:8.3,wh:2.8,to:BLH.CRYPT,door:[36,9]});
  C.reserve(32,4,41,11);C.light(35,11,C.pale);C.light(38,11,C.pale);
  // the cloister: a ring of broken columns, the garth, the well
  for(let x=28;x<=48;x+=2){for(const y of [12,24]){if(y===24&&x>=38&&x<=42)continue;if(hs(x,y,4)<.88)C.DB('bl_column',x,y,{sc:.85})}}
  for(let y=14;y<=22;y+=2){for(const x of [28,48]){if(hs(x,y,4)<.85)C.DB('bl_column',x,y,{sc:.85})}}
  C.dec('ww_well',38,18,{block:true,npc:'blh_well',sc:.9});C.light(38,16,C.pale);C.light(38,20,C.pale);
  for(const [x,y] of [[34,16],[42,20]])C.DB('gy_dead',x,y,{sc:.9});
  for(const [x,y] of [[34,20],[42,16],[32,18],[44,18]])C.dec('gy_bench',x,y,{block:false});
  for(const [x,y] of [[31,15],[45,15],[31,21],[45,21]]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,C.pale)}
  // the scriptorium (west), chapter house (east), refectory (south east), bell tower (north west)
  C.house({x0:17,x1:22,y0:12,y1:16,face:'E',sty:'flint',roof:'slate',wh:2.5,to:BLH.SCRIPT,col:C.warm});
  C.picHouse({img:'bl_hall',x0:52,x1:57,y0:12,y1:16,w:6.2,wh:2.6,to:BLH.CHAPTER,door:[54,16]});C.light(52,18,C.warm);C.light(57,18,C.warm);
  C.house({x0:55,x1:64,y0:21,y1:26,face:'W',sty:'flint',roof:'moss',wh:2.5,to:BLH.REFEC,col:C.warm});
  C.picHouse({img:'bl_tower',x0:21,x1:24,y0:4,y1:8,w:4.6,wh:3.4,to:BLH.TOWER,door:[22,8]});C.light(21,10,C.pale);C.light(25,10,C.pale);
  C.dec('bl_urn',20,10,{block:true,sc:.8});C.dec('bl_urn',26,10,{block:true,sc:.8});
  // the dormitory ruin, the infirmary garden, the herb beds
  C.dec('bl_chapel',22,26,{block:true,npc:'blh_dorm',sc:1.15});C.light(22,28,C.pale);C.dec('gy_bones',25,27,{});
  for(let x=33;x<=45;x+=2){if(x>=40&&x<=42)continue;C.dec('bl_fence',x,28,{block:true,sc:.7});C.dec('ww_twig2',x,29,{sc:.55})}   // the lane to the gate (40 to 42) is kept clear
  C.dec('gy_rose',38,28,{block:true,npc:'blh_infirmary',sc:1});
  // the brothers' graves: seven mounds, seven boards, in a railed plot in the north east
  for(let x=57;x<=69;x++)C.dec('bl_fence',x,11,{block:true,sc:.85});
  BLH_GRAVES.forEach((g,i)=>{const x=58+i*2,y=7;C.dec('gy_mound',x,y+1,{block:true,sc:.75});C.dec(blSlab('bl_hbg'+i,[g[0].replace('BR. ',''),'BROTHER'],{h:.95,top:.2,span:.55}),x,y,{block:true,npc:'blh_grave'+i})});
  for(const [x,y] of [[57,5],[69,5],[57,10],[69,10]]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,C.pale)}
  C.dec('bl_ccross',64,9,{block:true,sc:.9});C.dec('bl_angel',63,5,{block:true,sc:.9});
  // the lane, the signs, the people
  C.post(44,34,'bl_hb_lane',[{n:'HOLLOWBELL ABBEY',d:0},{n:'PILGRIMS WELCOME',d:0}],'blh_sign_lane','A board at the foot of the lane. HOLLOWBELL ABBEY. PILGRIMS WELCOME. GUESTS RECEIVED AS CHRIST. Below it, in a newer hand: PLEASE DO NOT RING THE BELL. It has been scratched at, and a second hand has added: IT RINGS ITSELF.',{i:2});
  for(const y of [27,31,34]){C.dec('gy_lantern',39,y,{block:true});C.light(39,y,C.pale);C.dec('gy_lantern',43,y,{block:true});C.light(43,y,C.pale)}
  C.person('blh_monk0',33,22,2);C.person('blh_monk1',44,15,2);
  // the road: milestone, signs, lamps, dead hedges
  C.milestone(8,36);
  C.post(74,40,'bl_hb_e',[{n:'HOLLOWBELL ABBEY',d:0},{n:'THE VAULT OF MALDRAKE',d:1}],'blh_signE','A signpost inside the east gate. One board reads HOLLOWBELL ABBEY, ahead, and the other THE VAULT OF MALDRAKE, to the east. Under them: SOUND OF BELL: NORMAL.',{i:4});
  C.post(6,40,'bl_hb_w',[{n:'THE ROOKERY MILL',d:-1},{n:'SALE',d:-1}],'blh_signW','A signpost by the west gate. The boards read THE ROOKERY MILL, to the west, and SALE. Somebody has added a smaller board: DO NOT FEED THE CROWS. THEY ARE KEEPING A LIST.',{i:5});
  for(let x=3;x<=80;x++){if([40,41,42,43,44].includes(x))continue;for(const y of [36,40]){if(hs(x,y,33)<.84)C.DB('bl_hedge'+((hs(x,y,35)*3)|0),x,y,{sc:.62+hs(x,y,34)*.22})}}
  for(let x=10;x<=76;x+=8){if(x>=36&&x<=48)continue;C.dec('gy_lantern',x,41,{block:true});C.light(x,41,C.pale)}
  // south of the road: the gate lodge, the plague cart, the bell foundry, the pilgrims' graves
  C.dec('bl_hut',16,45,{block:true,npc:'blh_lodge',sc:.8});C.light(17,47,C.warm);C.dec('kh_oqstuff_8',14,45,{block:true,sc:.7});C.person('blh_elias',19,46,2);
  C.dec('kh_cart1_0',46,43,{block:true,npc:'blh_cart',sc:1});
  C.dec('ww_cauldron',68,50,{block:true,npc:'blh_foundry',sc:1.6});C.dec('gy_candles',65,50,{block:true,sc:.8});C.dec('gy_candles',71,50,{block:true,sc:.8});C.light(68,52,C.pale);
  for(let a=0;a<10;a++){const x=Math.round(68+5.5*Math.cos(a*.628)),y=Math.round(50+4*Math.sin(a*.628));if(a===5||a===0)continue;C.dec('bl_urn',x,y,{block:true,sc:.7})}
  for(let r=0;r<3;r++)for(let c=0;c<9;c++){const x=30+c*3,y=52+r*4;C.dec('gy_mound',x,y,{block:true,sc:.7});C.dec(['bl_wcross','bl_lean','bl_stone1'][(c+r)%3],x,y-1,{block:true,sc:.8})}
  C.dec(blSlab('bl_hb_pit',['PILGRIMS','FROM THE ROAD'],{h:.95,top:.2,span:.55}),29,50,{block:true,npc:'blh_grave7'});C.light(34,49,C.pale);C.light(46,49,C.pale);
  C.dress({trees:130,scrub:250,stones:14,bones:8,posts:6,keep:(x,y)=>(x>=13&&x<=71&&y>=3&&y<=32)||(y>=35&&y<=41)||(x>=38&&x<=44&&y>=32&&y<=44)||(x>=14&&x<=22&&y>=42&&y<=50)||(x>=62&&x<=74&&y>=45&&y<=56)||(x>=28&&x<=56&&y>=48&&y<=64)});
  // the creatures: brothers in the cloister and yard, ringers at the tower, the raised dead in the graves, the road
  C.foes([['blbrother',31,16],['blbrother',45,16],['blbrother',31,21],['blbrother',45,21],['blbrother',36,26],['blbrother',50,26],['blbrother',26,19],['blbrother',66,8],['blbrother',62,18],
    ['blringer',24,11],['blringer',19,10],['blghoul',26,24],['blghoul',60,14],['blghoul',40,27],['blbones',37,15],['blbones',39,21],['blbones',50,20],['blbones',24,19],['blbones',64,27],['blshade',46,8],['blshade',30,8],['blshade',66,28],
    ['blbones',33,54],['blbones',45,57],['blghoul',39,60],['blghoul',51,54],['blshade',36,62],['blbloat',42,58],['blbones',69,47],['blhusk',58,45],['blhusk',24,56],
    ['bldeadwarden',60,38],['bldeadwarden',28,38],['blhusk',50,40],['blcrow',22,34],['blcrow',56,34],['blcrow',70,43],['blhound',34,44],['blhound',12,50],['blcrowflock',72,8]]);
  for(const [k,x,y] of [['potion6',27,33],['potion6',70,34],['potion6',44,66]])C.items.push({k,x,y,taken:false});
  C.mapNames.push({t:'Hollowbell Abbey',x:41,y:15,k:'place'},{t:'The Abbey Gate',x:41,y:31,k:'place'},{t:'The Fallen Church',x:37,y:7,k:'place'},{t:'The Cloister',x:38,y:18,k:'place'},{t:'The Scriptorium',x:19,y:14,k:'place'},{t:'The Chapter House',x:54,y:14,k:'place'},{t:'The Refectory',x:60,y:23,k:'place'},{t:'The Bell Tower',x:22,y:6,k:'place'},{t:"The Brothers' Graves",x:63,y:7,k:'place'},{t:'The Dormitory',x:22,y:26,k:'place'},{t:'The Gate Lodge',x:16,y:44,k:'place'},{t:'The Bell Foundry',x:68,y:50,k:'place'},{t:"The Pilgrims' Graves",x:38,y:54,k:'place'},{t:'To the Vault of Maldrake',x:78,y:36,k:'place'},{t:'To the Rookery Mill',x:6,y:36,k:'place'});
  const lv=C.finish({start:{x:79,y:38,f:3}});
  lv.tele=undefined;
  return lv}
/* ---------- the rooms ---------- */
const blhFloor=()=>FLOORS.wl2f5?'wl2f5':FLOORS.cobble?'cobble':'wood';
const blhWall=()=>IMG.wl2_wall_3?'wl2_wall_3':'kh_ohwall1_0';
const BLH_COL={pale:[.72,1.1,.95],warm:[1.4,1.0,.6]};
function blhChapter(){
  blRoom({id:BLH.CHAPTER,name:'The Chapter House',w:17,h:11,amb:.5,rating:88,floor:blhFloor(),wall:blhWall(),
    back:{to:BLH.ID,x:54,y:17,f:2},
    lights:[[3,2],[8,2],[13,2],[3,8],[13,8],[8,6]],lcol:{'3,2':BLH_COL.pale,'8,2':BLH_COL.warm,'13,2':BLH_COL.pale,'3,8':BLH_COL.warm,'13,8':BLH_COL.pale,'8,6':BLH_COL.warm},col:[.9,1.05,.9],
    enemies:[['blbones',4,7],['blbrother',12,7]],
    build:C=>{const P=(n,x,y,o)=>bl3Prop(C,n,x,y,o);
      P('banner',3,1,{h:1.5,block:false});P('banner',13,1,{h:1.5,block:false});P('tapestry',8,1,{h:1.1,block:false});
      C.raw('mi_pew',8,2,{npc:'blh_abbotseat',solid:1,deco:false,sc:1.1});
      for(const y of [4,6]){for(const x of [2,3,4,5]){C.raw('mi_pew',x,y,{npc:'blh_stall',solid:1,deco:false,sc:.9})}for(const x of [11,12,13,14]){C.raw('mi_pew',x,y,{npc:'blh_stall',solid:1,deco:false,sc:.9})}}
      C.npc('blh_prior',8,5);
      P('lectern',8,7,{h:1.0});C.raw('gy_book',8,7,{npc:'blh_rule',solid:1,deco:false,bob:.55,sc:1});
      C.raw('gy_chest',15,2,{npc:'blh_chapterchest',solid:1,deco:false,sc:.9});
      P('candlerack',1,5,{h:1.0});P('candlerack',15,5,{h:1.0});P('clock',6,1,{h:1.1});P('waterbarrel',1,9,{h:.7});
      C.raw('gy_web',1,1,{block:false,sc:.5});C.raw('gy_web',15,1,{block:false,sc:.5});C.raw('gy_bones',5,9,{block:false,sc:.6});C.raw('gy_bones',12,9,{block:false,sc:.6})}})}
function blhScript(){
  const F=blF();
  blRoom({id:BLH.SCRIPT,name:'The Scriptorium',w:13,h:9,amb:.5,rating:88,floor:'wood',wall:blhWall(),
    back:{to:BLH.ID,x:23,y:14,f:3},
    lights:[[3,2],[9,2],[6,5],[2,7],[10,7]],lcol:{'3,2':BLH_COL.warm,'9,2':BLH_COL.warm,'6,5':BLH_COL.pale,'2,7':BLH_COL.pale,'10,7':BLH_COL.warm},col:[1.3,.95,.6],
    enemies:[['blbrother',10,6]],
    build:C=>{const P=(n,x,y,o)=>bl3Prop(C,n,x,y,o);
      P('bookshelf',2,1,{h:1.1});P('bookshelf',4,1,{h:1.1});P('bookshelf',10,1,{h:1.1});P('scrollrack',8,1,{h:1.0});
      P('readdesk',3,4,{h:.85});P('readdesk',6,4,{h:.85});P('readdesk',9,4,{h:.85});   // (a fourth desk stood in front of the door)
      if(!F.letter&&!F.letterRead)C.raw('gy_book',6,4,{npc:'blh_letter',solid:1,deco:false,bob:.38,sc:1});
      C.npc('blh_osmund',4,6);C.raw('gy_book',3,4,{npc:'blh_rule',solid:1,deco:false,bob:.38,sc:.9});
      P('candlerack',11,5,{h:1.0});P('waterbarrel',11,7,{h:.7});C.raw('gy_web',1,1,{block:false,sc:.5});C.raw('gy_bones',9,7,{block:false,sc:.6})}})}
function blhRefec(){
  blRoom({id:BLH.REFEC,name:'The Refectory',w:19,h:9,amb:.5,rating:88,floor:blhFloor(),wall:blhWall(),
    back:{to:BLH.ID,x:54,y:24,f:1},
    lights:[[3,2],[9,2],[15,2],[3,6],[9,6],[15,6]],lcol:{'3,2':BLH_COL.warm,'9,2':BLH_COL.warm,'15,2':BLH_COL.warm,'3,6':BLH_COL.pale,'9,6':BLH_COL.pale,'15,6':BLH_COL.warm},col:[1.2,1.0,.7],
    enemies:[['blbrother',6,6],['blbrother',13,6],['blbones',9,7]],
    build:C=>{const P=(n,x,y,o)=>bl3Prop(C,n,x,y,o);
      P('hearth',2,1,{h:1.3});P('oven',5,1,{h:1.0});P('ale',16,1,{h:.8});P('bakertable',9,1,{h:.7});P('herbrack',12,1,{h:1.0});
      C.raw('gy_candles',3,1,{npc:'blh_kitchen',solid:1,deco:false,sc:.8});
      P('longtable',5,4,{h:.6,free:true});P('longtable',9,4,{h:.6,free:true});P('longtable',13,4,{h:.6,free:true});
      for(const x of [4,6,8,10,12,14]){C.raw('gy_skel',x,3,{npc:'blh_seated',solid:1,deco:false,sc:.7})}
      C.raw('gy_candles',9,4,{npc:'blh_table',solid:1,deco:false,sc:.4,bob:.5});   // on the middle table, not in front of the door
      C.npc('blh_anselm',3,3);
      P('lectern',17,3,{h:1.0});P('waterbarrel',17,6,{h:.7});C.raw('gy_web',1,1,{block:false,sc:.5});C.raw('gy_bones',7,7,{block:false,sc:.6});C.raw('gy_bones',14,7,{block:false,sc:.6})}})}
function blhTowerRoom(){
  const F=blF();
  blRoom({id:BLH.TOWER,name:'The Ringing Chamber',w:9,h:9,amb:.42,rating:88,floor:'wood',wall:blhWall(),
    back:{to:BLH.ID,x:22,y:9,f:2},
    lights:[[2,2],[6,2],[4,5]],lcol:{'2,2':BLH_COL.pale,'6,2':BLH_COL.pale,'4,5':BLH_COL.warm},col:[.8,1.05,.9],
    enemies:[['blringer',6,5],['blringer',2,6],['blcrow',4,3]],
    build:C=>{
      C.raw('bl_rope',2,3,{npc:'blh_rope0',solid:1,deco:false,sc:1.2});C.raw('bl_rope',6,3,{npc:'blh_rope1',solid:1,deco:false,sc:1.2});
      C.raw('gy_stair',4,1,{npc:'blh_abbotdoor',solid:1,deco:false,sc:.95});
      C.npc('blh_cuthbert',4,5);
      for(const x of [1,7])C.raw('hl_p_window',x,4,{block:true,sc:1.0});
      C.raw('barrel',1,7,{block:true,sc:.9});C.raw('crate',7,7,{block:true,sc:.9});C.raw('gy_bones',3,7,{block:false,sc:.6});C.raw('gy_web',1,1,{block:false,sc:.6});C.raw('gy_web',7,1,{block:false,sc:.6})}})}
function blhBelfry(){
  blRoom({id:BLH.BELFRY,name:'The Belfry of Hollowbell',w:15,h:11,amb:.38,rating:88,floor:'wood',wall:blhWall(),
    back:{to:BLH.TOWER,x:4,y:2,f:2},
    lights:[[3,2],[11,2],[7,6],[3,8],[11,8]],lcol:{'3,2':BLH_COL.pale,'11,2':BLH_COL.pale,'7,6':[.95,1.15,1.2],'3,8':BLH_COL.pale,'11,8':BLH_COL.pale},col:[.85,1.1,1.0],
    enemies:[['blabbot',7,4],['blcrow',3,5],['blcrow',11,5],['blshade',3,8],['blshade',11,8]],
    build:C=>{
      C.raw('bl_silverbell',7,2,{npc:'blh_bell',solid:1,deco:false,sc:1.9});
      C.raw('bl_rope',9,5,{npc:'blh_rope2',solid:1,deco:false,sc:1.2});
      for(const x of [1,13])C.raw('hl_p_window',x,4,{block:true,sc:1.1});
      for(const [x,y] of [[2,2],[12,2]])C.raw('gy_candles',x,y,{block:true,sc:.9});
      C.raw('barrel',2,9,{block:true,sc:.9});C.raw('crate',12,9,{block:true,sc:.9});C.raw('gy_bones',5,7,{block:false,sc:.6});C.raw('gy_bones',9,8,{block:false,sc:.5});C.raw('gy_web',1,1,{block:false,sc:.6});C.raw('gy_web',13,1,{block:false,sc:.6});
      C.raw('gy_stair',7,9,{npc:'blh_stairdown',solid:1,deco:false,sc:.95})}})}
function blhCrypt(){
  blRoom({id:BLH.CRYPT,name:'The Crypt of the Brothers',w:19,h:13,amb:.36,rating:88,floor:FLOORS.mosscobble?'mosscobble':'cobble',wall:blhWall(),
    back:{to:BLH.ID,x:36,y:10,f:2},
    lights:[[3,3],[9,2],[15,3],[3,9],[15,9],[9,7],[9,11]],lcol:{'3,3':BLH_COL.pale,'9,2':BLH_COL.pale,'15,3':BLH_COL.pale,'3,9':BLH_COL.warm,'15,9':BLH_COL.pale,'9,7':BLH_COL.pale,'9,11':BLH_COL.warm},col:[.72,1.05,.92],
    enemies:[['blbones',5,5],['blbones',13,5],['blghoul',4,9],['blghoul',14,9],['blbrother',9,5],['blbones',6,10],['blshade',9,9]],
    build:C=>{
      for(const [x,y] of [[1,3],[1,6],[1,9],[17,3],[17,6],[17,9]])C.raw('gy_niche',x,y,{block:true,sc:.9});
      for(const [x,y] of [[4,3],[14,3],[4,7],[14,7],[7,10],[11,10]])C.raw('gy_coffin',x,y,{npc:'blh_coffin',solid:1,deco:false,sc:.9});
      C.raw('gy_sarc',6,1,{npc:'blh_sarc0',solid:1,deco:false,sc:1.1});C.raw('gy_sarc',9,1,{npc:'blh_sarc1',solid:1,deco:false,sc:1.1});C.raw('gy_sarc',12,1,{npc:'blh_sarc2',solid:1,deco:false,sc:1.1});
      for(const [x,y] of [[2,1],[16,1],[1,11],[17,11]])C.raw('gy_candles',x,y,{block:true,sc:.85});
      C.raw('gy_chest',16,11,{npc:'blh_cryptchest',solid:1,deco:false,sc:.9});
      C.raw('gy_web',1,1,{block:false,sc:.6});C.raw('gy_web',17,1,{block:false,sc:.6});C.raw('gy_bones',8,6,{block:false,sc:.7});C.raw('gy_bones',11,5,{block:false,sc:.7});
      C.raw('gy_stair',9,11,{block:true,sc:.9})}})}
for(const [id,fn] of [[BLH.CHAPTER,blhChapter],[BLH.SCRIPT,blhScript],[BLH.REFEC,blhRefec],[BLH.TOWER,blhTowerRoom],[BLH.BELFRY,blhBelfry],[BLH.CRYPT,blhCrypt]])
  KH_LAZY[id]=()=>{if(!LEVELS[id]){if(!LEVELS[BLH.ID])KH_LAZY[BLH.ID]();blhArt();fn()}return LEVELS[id]};
/* the quest rings */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx}),T=QRF.T;
  T.blq70={give:[N(9680,'blh_elias')],act:()=>blF().letterRead?[N(9680,'blh_elias')]:blF().letter||bagCount('blsevrinletter')>0?[N(9681,'blh_prior')]:[N(9682,'blh_letter')],ready:[N(9680,'blh_elias')]};
  T.blq71={give:[N(9683,'blh_anselm')],act:[E(9680,/^blbrother$/)],ready:[N(9683,'blh_anselm')]};
  T.blq72={give:[N(9684,'blh_cuthbert')],act:()=>blhRopes()>=3?[N(9684,'blh_cuthbert')]:[N(9684,'blh_rope0','blh_rope1'),N(9685,'blh_rope2')],ready:[N(9684,'blh_cuthbert')]};
  T.blq73={give:[N(9681,'blh_prior')],act:()=>blF().abbot?[N(9681,'blh_prior')]:[N(9684,'blh_abbotdoor'),E(9685,/^blabbot$/)],ready:[N(9681,'blh_prior')]}}
blRegister(8,blhBuild,{fromE:{x:79,y:38,f:3},fromW:{x:4,y:38,f:1},exitY:38,rooms:[9681,9682,9683,9684,9685,9686],names:{9681:'The Chapter House',9682:'The Scriptorium',9683:'The Refectory',9684:'The Ringing Chamber',9685:'The Belfry of Hollowbell',9686:'The Crypt of the Brothers'},rating:{9681:88,9682:88,9683:88,9684:88,9685:88,9686:88}});
