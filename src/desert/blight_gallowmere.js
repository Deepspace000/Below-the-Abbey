/* ==========================================================================
   PLACE 4 OF THE BLIGHTED ROAD: GALLOWMERE (level 9640, rated 86; prefix blg / BLG). 90 by 76. A drowned fen village.
   The east gate (x 88, y 38) opens on the east bank. A causeway of planks runs west across the black water (y 38 and 39, x 51 to 74) with five lamp posts beside it (the lanterns keep the wisps off:
   lamp 1 lights from the bank, each next one from the one before; a lit lamp burns away the wisps within five squares). The causeway comes ashore in the village on its mud island (houses on stilts,
   the Gallows Tree, the green, the well, the jetty with the rowing boat). A second causeway leads west (x 14 to 22) to the west bank, the gate (x 1, y 38) and on to the Bone Orchard (9650), and the
   reed beds and peat fields beyond it. By boat (the jetty at 51,48): Heron Isle (north east, the lost lantern, a grave marker, wisps) and the Reeve's Isle (north west, the Reeve's house 9642 with the Drowned Reeve).
   Rooms: 9641 the ferryman's house (Osk Brine), 9642 the Reeve's flooded hall (boss), 9643 Nan Sallow's cottage.
   People: Osk Brine ferryman (blg_osk), Nan Sallow peat-cutter (blg_nan), Tam Corder reed-cutter (blg_tam), three ghosts of the drowned (blg_ghost).
   Quests: blq11 The Ferryman's Lantern (Osk), blq12 Peat Salt (Nan), blq13 Graves of the Drowned (Tam), blq14 The Drowned Reeve (Nan: put the Reeve to rest; he drops the Reeve's Rod).
   Flags: G.flags.bl = {lamps (bitmask of lit lamps), lantern, lanternGiven, salt (bitmask), saltGiven, mk (bitmask of grave markers set upright), reeve (the Reeve is dead), blgChest, blgReeveChest}.
   ========================================================================== */
const BLG={ID:9640,OSK:9641,REEVE:9642,NAN:9643,W:90,H:76};
BL_ROAD[3].W=BLG.W;BL_ROAD[3].H=BLG.H;
for(const [id,n] of [[9641,"Osk Brine's House"],[9642,"The Reeve's Flooded Hall"],[9643,"Nan Sallow's Cottage"]]){LEVEL_NAMES[id]=n;LEVEL_RATING[id]=86}
const BLG_LAMPS=[[72,37],[67,37],[62,37],[57,37],[52,37]];
const BLG_HOUSE_NAN={x0:30,x1:32,y0:33,y1:34,face:'S',sty:'dtimber',roof:'thatch2',wh:2.2,to:BLG.NAN};
const BLG_HOUSE_OSK={x0:41,x1:43,y0:43,y1:44,face:'N',sty:'dtimber',roof:'thatch2',wh:2.3,to:BLG.OSK};
const BLG_HOUSE_REEVE={x0:24,x1:31,y0:8,y1:11,face:'S',sty:'dflint',roof:'slate',wh:2.7,to:BLG.REEVE};
const BLG_DOCK={x:50,y:48,boat:[51,48]},BLG_HERON={boat:[62,19],at:{x:62,y:18}},BLG_REEVEISLE={boat:[28,19],at:{x:28,y:18}};
/* ---------- things carried ---------- */
ITEMDEF.blferrylamp={n:"Osk's Ferry Lantern",k:'quest',t:'Quest item',ic:'ore',c:'#e0c080',stack:1,price:0,sw:.4,d:'A tarnished ship\'s lantern with a horn window and a hook for the bow of a boat. The oil has long since gone, but the wick is still dry and the glass has not a crack in it. Osk Brine would like it back.'};
ITEMDEF.blferryring={n:"Osk's Tide Ring",k:'ring',t:'Ring',ic:'ring',c:'#88a8a8',price:0,lvl:86,pas:{ward:17,dodge:.06,regen:.7,mpRegen:.5},int:5,hp:85,rar:1,sw:.1,d:'A ring of green-grey bronze, a knot of rope in the band, worn smooth by forty years on an oar. Adds 5 Intelligence and 85 health, every blow on the wearer is 17 lighter, enemies miss 6% more, and wounds and weariness close steadily. Needs level 86.'};
ITEMDEF.blpeathood={n:"Peat-Cutter's Hood",k:'head',t:'Helm',ic:'head',c:'#6a5a44',armor:17,price:0,lvl:86,pas:{dmgPct:.06,dodge:.03,regen:.5},rar:1,gear:1,sw:.3,d:'A hood of oiled brown wool and peat-stained leather, made so that you could cut turf in the rain for a whole day without a thought. It smells faintly of smoke and salt. Armour 17, damage +6%, enemies miss 3% more, and wounds close steadily. Needs level 86.'};
ITEMDEF.blreevestaff={n:"The Reeve's Rod",k:'weapon',t:'Sword',ic:'sword',c:'#8a9488',dmg:[470,580],hit:.2,req:{str:70},lvl:86,price:0,rar:1,eff:{bleed:[.3,6,40],bossdmg:.35},dbl:.22,sw:.5,d:'The long black rod of the Reeve of Gallowmere, topped with a bronze weight like a plumb-bob. Cold water drips from it and does not stop. Wounds bleed, and bosses take 35% more. Needs level 86.'};
/* ---------- the pictures and the water ---------- */
function blgArt(){
  if(BLG._art)return;
  if(typeof gyFloorTone==='function'&&FLOORS.water&&!FLOORS.blf_water)try{gyFloorTone('blf_water','water',.95,[.6,.95,.9])}catch(e){console.error(e)}
  if(!FLOORS.blf_water)FLOORS.blf_water=FLOORS.water||FLOORS.cobble;
  if(!FLOORS.blf_flood){if(typeof gyFloorTone==='function'&&FLOORS.water)try{gyFloorTone('blf_flood','water',.5,[.7,.9,.8])}catch(e){}if(!FLOORS.blf_flood)FLOORS.blf_flood=FLOORS.blf_water}
  for(const [k,h] of [['yar_boat_row',.55],[b14Dead('b14_greeds','greeds','saturate(.2) brightness(.5)'),.9],[b14Dead('b14_reeds','reeds','saturate(.12) brightness(.5)'),.85],['hgwm_reed0',1.5],['ww_crowtree',1.9],['ww_totem',1.2],['ww_sign',1.2],['ww_willow',2.6],['wm_boat',.8],['gy_ghost0',1.1],['gy_ghost1',1.1],['gy_ghost2',1.1],['lamp',1.5],['kh_oqstuff_9',.5]])if(NPC_H[k]===undefined)NPC_H[k]=h;
  BLG._art=1}
/* ---------- the sound: water, drips, the sigh of the wisps ---------- */
const BLGS={nextDrip:0,nextGlug:0,nextSigh:0,nextCrow:0};
function blgTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!SNDOPT.amb)return;
  const now=AC.currentTime;
  if(LEVEL===BLG.ID){
    if(now>BLGS.nextDrip){BLGS.nextDrip=now+4+Math.random()*6;try{wwsDrip(.5+Math.random()*.3)}catch(e){}}
    if(now>BLGS.nextGlug){BLGS.nextGlug=now+9+Math.random()*14;const f=110+Math.random()*60;tone(f,f*.55,.28,'sine',.05,0);tone(f*1.6,f*.9,.18,'sine',.03,.12)}
    if(now>BLGS.nextSigh){BLGS.nextSigh=now+20+Math.random()*25;nz(1.6,.03,'bandpass',700,420,0);nz(1.4,.02,'bandpass',1100,600,.5)}}
  else if(LEVEL===BLG.REEVE){
    if(now>BLGS.nextDrip){BLGS.nextDrip=now+3+Math.random()*4;try{wwsDrip(.8)}catch(e){}}
    if(now>BLGS.nextGlug){BLGS.nextGlug=now+8+Math.random()*10;tone(90,50,.4,'sine',.05,0)}}}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{if(blIs(LEVEL))blgTick()}catch(e){console.error('blg tick',e)}}}
/* ---------- the creatures: the wisps ---------- */
Object.assign(ENEMY_DEF,{
  blwisp:{name:'Fen Wisp',hp:92,dmg:[9,15],hit:.88,w:blWw('guardB_3',.85),img:'wwi_wisp',xp:34,gold:[0,0],speed:2,fly:true,floatH:.35,verb:'scorches',bl:1,still:1,glow:.4,wake:'A pale green light lifts off the water and drifts towards you, sighing.'},
  blreeve:{name:'The Drowned Reeve',hp:430,dmg:[10,17],hit:.9,w:blW('crA_5',1.45),img:'gyi_giant',xp:760,gold:[0,0],speed:1,verb:'crushes',boss:true,aboveParty:0,bl:1,still:1,glow:.1,wake:'The Reeve of Gallowmere rises out of the black water in his hall, streaming, with a bronze rod in his hand and weed in his chain of office.'}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('blreeve');
if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.blreeve=[3400,4200];
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^blwisp/,'cursed',.15],[/^blreeve/,'foodpoison',.25]);
/* ---------- the people ---------- */
const BLG_OSK_LINES=[
  'Osk Brine. Ferryman. Forty years on the Gallowmere water, and never lost a passenger, until the water came up and took the village. Then I lost all of them, and I have been rather quiet about it since.',
  'It was the Wardens, they say. The village would not pay the toll, a whole village, to a man. Reeve Marrick stood up in the hall and said, we have paid enough, and the Sovereign\'s clerk smiled, and the dykes opened that night. I was across the mere with a load of eels. I heard it go.',
  'Keep to the lights on the causeway. Five lamps, and every one lit from the last. The wisps cannot stand a flame carried by a living hand. They are not wicked. They are the village, a little thin, looking for the way home.'];
khNpc('blg_osk','Osk Brine, the ferryman','kh_oqmen_0',()=>yrLines('blg_osk',BLG_OSK_LINES));
const BLG_NAN_LINES=[
  'Nan Sallow. I cut peat, and I salt it, and I salt other things. In a fen, a thing that is salted keeps. I have kept my husband for nine years. He is under the bed. He is a little dry, but he is no trouble.',
  'The old Reeve is in his hall on the island, in the black water, and he will not come out, and he will not stop paying. That is the worst of it. He keeps saying, I will pay it, I will pay it now. And there is nobody left to take it.',
  'Do not drink the water, and do not follow the little lights, and do not, whatever you do, offer to pay anyone for anything. It is the one word the fen has never forgiven.'];
khNpc('blg_nan','Nan Sallow, peat-cutter','kh_ohfolk7_2',()=>yrLines('blg_nan',BLG_NAN_LINES));
const BLG_TAM_LINES=[
  'Tam Corder. Reed-cutter. I cut for thatch, and for the dead, and sometimes for those I cannot tell apart. I have a good eye for a reed and a poor one for a living face. If you are alive, nod. Good. That was a fine nod.',
  'There are three families still lying in the mud with no mark on them: Corder, Peascod and Hay. I cannot rest until they have markers. They are cut, you see, they are only fallen over, and I am not strong enough to put them right.',
  'I have not left the green in four years. The geese are gone. The bells are gone. I keep waiting for something to ring and it has not, and I think that is all there is of Gallowmere now. A man standing on a green, waiting.'];
khNpc('blg_tam','Tam Corder, reed-cutter','kh_ohfolk4_4',()=>yrLines('blg_tam',BLG_TAM_LINES));
const BLG_GHOST_LINES=[
  ['(A pale woman stands in the reeds with her hands wrung together.) "We did not pay. Everybody says it as if it were a crime. We simply did not pay. We were having supper."','(She does not seem to see you.) "Is it morning? Somebody has left the door open. The whole house is so wet."'],
  ['(A tall drowned man in a dripping Sunday coat holds his hat in both hands.) "Corder was the name. They never put it up. I would so like it put up, if it is no trouble."','(He weeps without a sound.) "It is not the water. It is that I cannot remember if I locked the door."'],
  ['(A child stands quite still in the shallows, up to her knees.) "Daddy said we were not to pay. Daddy said we were free. Is that what free is?"','(She looks at her feet.) "I like it here. The fish are my friends. It is only that they are very cold."']];
for(let i=0;i<3;i++)khNpc('blg_ghost'+i,'A drowned ghost',['gy_ghost0','gy_ghost1','gy_ghost2'][i],()=>yrLines('blg_ghost'+i,BLG_GHOST_LINES[i]));
/* ---------- the quests ---------- */
function blgQ(id,title,who,steps,reward,extra){const q=yrQ(id,title,who,steps,reward,extra);QAREA[id]=BL.REGION;return q}
const blgBits=m=>{let n=0;for(let i=0;i<5;i++)if((m|0)&(1<<i))n++;return n};
const blgSalt=()=>blgBits(blF().salt),blgMk=()=>blgBits(blF().mk),blgLamps=()=>blgBits(blF().lamps);
blgQ('blq11',"The Ferryman's Lantern",'Osk Brine, the ferryman',[
  ["Find Osk's ferry lantern. It was lost on Heron Isle, in the north east of the fen. Take the rowing boat from the jetty in the village.",()=>!!(blF().lantern||blF().lanternGiven),['blg_lantern','blg_boat0']],
  ['Give the lantern to Osk Brine in his house by the jetty.',()=>!!blF().lanternGiven,['blg_osk']]],
  {gold:3600,xp:30000,items:['blferryring','potion6']});
blgQ('blq12','Peat Salt','Nan Sallow, peat-cutter',[
  ['Bring Nan three sacks of peat salt from the fen: one from the salt pans in the south, one from the south west bank, one from the south east bank.',()=>blgSalt()>=3,['blg_salt']],
  ['Give the three sacks of salt to Nan Sallow in her cottage.',()=>!!blF().saltGiven,['blg_nan']]],
  {gold:3400,xp:29000,items:['blpeathood','potion6']});
blgQ('blq13','Graves of the Drowned','Tam Corder, reed-cutter',[
  ['Set upright the three grave markers of the drowned families: Corder (in the reed beds, north west), Peascod (on Heron Isle, north east) and Hay (under the Gallows Tree).',()=>blgMk()>=3,['blg_marker']]],
  {gold:4200,xp:33000,items:['potion6','potion6','potion6']});
blgQ('blq14','The Drowned Reeve','Nan Sallow, peat-cutter',[
  ["Put the Drowned Reeve of Gallowmere to rest in his flooded hall on the Reeve's Isle (north west; row there from the jetty).",()=>!!blF().reeve,['blg_boat0']]],
  {gold:5200,xp:38000,items:['potion6','potion6']});
wwGive('blg_osk','blq11',()=>true,{
  offer:'Will you do an old man a favour? I lost my lantern on Heron Isle, the night they took the village. I rowed out after the wisps, and I thought I could shame them home, and I put it down to wave. I have not been able to go back. It is the only light that ever got me over the mere in the dark. The boat is tied at the jetty. Row out to the north east.',
  accept:'Thank you. You will know it by the horn window. Do not let the lights near the boat. Hold your own light up, and say you are a friend of Osk Brine, and they may not sting.',
  remind:()=>blF().lantern?'You have the lantern. Bring it to me, here in my house.':'Heron Isle is north east. Take the boat from the jetty, and keep your light in front of you.',
  ready:'There it is. The very glass, and not a crack in it. Oh. Oh, my old friend.',
  thanks:'I shall hang it in the window, and light it every night, so that anybody still out there knows where the shore is. Take this. It has pulled me across every night of my life.',
  after:'The lantern is in the window, and a good many small lights come in the evenings to look at it, and go away again, quietly. I am glad.'});
wwGive('blg_nan','blq12',()=>true,{
  offer:'I am running very low on peat salt, dear, and I have a great deal of salting to do. A fen is a hungry thing, and the dead keep walking if they are not looked after. Three sacks. One at the salt pans in the south, one on the south west bank, and one on the south east bank. They were left when the water came up.',
  accept:'Bless you. They are heavy, so take your time. Mind the wisps in the south east, and do not stand on the pans in the rain.',
  remind:()=>'You have '+blgSalt()+' of the three sacks of peat salt. The pans in the south, the south west bank, and the south east bank.',
  ready:'Three good sacks. I can feel the grain of it through the cloth. That will keep the whole of the village, and a bit over.',
  thanks:'I shall start tonight. Take this hood. I cut turf in it for thirty years, and it never let a drop through. I should like a living person to have it.',
  after:'I salt as I go now. One by one they lie down, and stay down, and say thank you in their way. It is rather lovely.'});
wwGive('blg_tam','blq13',()=>true,{
  offer:'May I ask a thing? There are three families of Gallowmere who were drowned in the dyke-break, and their grave markers lie flat in the mud. Corder, in the reed beds in the north west. Peascod, on Heron Isle. Hay, under the Gallows Tree here on the green. If someone were to stand them up again, I could stop worrying.',
  accept:'Thank you. They are only slabs, they are heavy but not stuck. Just lift them and set them in the earth, and say the name.',
  remind:()=>'You have set up '+blgMk()+' of the three markers. Corder in the north west, Peascod on Heron Isle, Hay under the Gallows Tree.',
  ready:'All three. I felt every one go in, like a nail into a plank. They are at rest, or as near as a fen allows.',
  thanks:'It is a small thing. It is all there is left to do for them. Take this, and my thanks.',
  after:'I go and look at the three of them every evening. Corder, Peascod, Hay. It is a very good arrangement.'});
wwGive('blg_nan','blq14',()=>qSt('blq12')==='done',{
  offer:'There is one more thing, and I will not pretend it is a small one. The Reeve is in his hall on the island. He drowned standing up, and he has never sat down. He still says, I will pay, I will pay it now, and the water in his hall rises every night. Put him to rest. His rod is a good thing, and nobody else is going to use it. The boat will take you to the island, and you go in at the door of the stilt house.',
  accept:'You are a brave fool, and I like it. He is big, and wet, and not at all angry. That is what makes him dangerous. He means well.',
  remind:()=>blF().reeve?'The Reeve is at rest. Come and tell me.':'The Reeve is in his flooded hall on the north west island. Row from the jetty, then go in at the door of the stilt house.',
  ready:'I felt the water go down. All the way down the fen. Like a long breath let out.',
  thanks:'Thank you. He was a good man. He just would not pay. Here: for your trouble, and for the rest of us.',
  after:'The fen is quieter. The wisps are fewer. The peat is only peat again. It is a very good evening, for Gallowmere.'});
/* ---------- the objects ---------- */
khNpc('blg_boat0','The ferry boat','yar_boat_row',()=>say('A flat rowing boat tied to the end of the jetty, with a pair of oars in it, a bailer, and an inch of black water. The rope has been repaired many times by the same patient hand.',[['Row to Heron Isle, north east.',()=>blgRow(BLG_HERON.at,'You row out across the black water. The little lights part round the boat and close again behind it.')],["Row to the Reeve's Isle, north west.",()=>blgRow(BLG_REEVEISLE.at,'You row out across the black water, past a line of old stakes that were a fence once. The Reeve\'s house stands on stilts on its island, and one window is lit.')],['Not yet.',()=>null]]),{sc:1});
khNpc('blg_boat1','The ferry boat','yar_boat_row',()=>say('The ferry boat, tied up on Heron Isle.',[['Row back to the village.',()=>blgRow({x:50,y:48},'You row back over the water, and the village lights rise up out of the reeds.')],['Not yet.',()=>null]]));
khNpc('blg_boat2','The ferry boat','yar_boat_row',()=>say("The ferry boat, tied up at the Reeve's Isle.",[['Row back to the village.',()=>blgRow({x:50,y:48},'You row back over the water, and the village lights rise up out of the reeds.')],['Not yet.',()=>null]]));
function blgRow(at,txt){
  G.talk=null;sfx('door');G.P.x=at.x;G.P.y=at.y;G.P.f=at.y<30?2:(at.y>40?0:2);G.P.angT=(G.P.f-1)*Math.PI/2;G.C={x:G.P.x,y:G.P.y,a:G.P.angT};try{reveal()}catch(e){}
  try{msg(txt,'#b8d0a8')}catch(e){}return null}
/* the lamps of the causeway */
function blgLampLight(i){
  const [x,y]=BLG_LAMPS[i];
  try{const L=LEVELS[BLG.ID];if(L&&L._bl)L._bl.lcol[x+','+y]=[1.5,1.05,.55];for(const l of LIGHTS)if(Math.floor(l.x)===x&&Math.floor(l.y)===y)l.col=[1.5,1.05,.55]}catch(e){}}
function blgBanish(i){
  const [x,y]=BLG_LAMPS[i];let n=0;
  try{for(const e of G.enemies)if(e.t==='blwisp'&&e.hp>0&&Math.hypot(e.x-x,e.y-y)<=5.5){hurtEnemy(e,99999999);n++}}catch(e){console.error(e)}
  return n}
khNpc('blg_lamp','A causeway lamp','gy_lantern',d=>{
  const F=blF(),i=d.i|0,bit=1<<i;
  if(((F.lamps|0)&bit))return say('The lamp burns steady and warm, a small gold flame behind horn. The pale lights in the reeds keep well back from it.',[BYE]);
  if(i>0&&!((F.lamps|0)&(1<<(i-1))))return say('A lamp on a post, cold, with a dry wick. A card hangs from it, in a careful hand: LIGHT FROM THE LAST. The last lamp is further along the causeway to the east, and the flame must come from it.',[BYE]);
  return say(i===0?'A lamp on a post at the foot of the causeway. The wick is dry, and a tinder-box hangs beside it on a string. A card says: LIGHT ME FIRST. ALL THE OTHERS LIGHT FROM ME.':'A lamp on a post. The wick is dry. A card hangs from it: LIGHT FROM THE LAST. The lamp behind you burns, and a spill hangs ready.',[['Light the lamp.',()=>{F.lamps=(F.lamps|0)|bit;blgLampLight(i);const n=blgBanish(i);sfx('win');msg('The lamp takes a flame. '+(n?n+(n>1?' wisps burn':' wisp burns')+' away in the light.':'The pale lights in the reeds draw back.'),'#ffe9a0');return null}],BYE])});
khNpc('blg_lantern',"Osk's lantern",'lamp',d=>{
  const F=blF();if(F.lantern||F.lanternGiven)return say('A bare patch of grass where the lantern lay, with a ring of pressed reeds round it.',[BYE]);
  return say('A ship\'s lantern lies on its side in the sedge at the water\'s edge, with its horn window turned up to the sky, quite unbroken. Nobody has touched it in forty years. Round it the grass is very flat, as if something had sat beside it, waiting.',[['Take the lantern.',()=>{F.lantern=1;if(!bagAdd(mkItem('blferrylamp')))G.items.push({k:'blferrylamp',x:G.P.x,y:G.P.y,taken:false});d.found=true;d.hidden=true;sfx('key');msg("You take Osk's ferry lantern.",'#ffe36a');return null}],BYE])});
yrHook('blg_osk',d=>{const F=blF();
  if(qSt('blq11')==='active'&&F.lantern&&!F.lanternGiven&&bagCount('blferrylamp')>0)return say('Osk Brine looks at the lantern in your hand, and for a moment he cannot speak. The window is clean. The wick is dry. It is all there.',[['Give him the lantern.',()=>{bagRemove('blferrylamp',1);F.lanternGiven=1;sfx('win');msg('You give Osk Brine his lantern.','#ffe36a');return say('He takes it in both hands, and turns it to the light, and for a moment you think he will weep. Then he rubs the glass with his sleeve, and nods once, and says nothing at all.',[BYE])}],['Not yet.',()=>null]]);
  return null});
const BLG_MARKS=[['CORDER','Reed-cutters, six'],['PEASCOD','Fishers, five'],['HAY','Thatchers, four']];
khNpc('blg_marker','A fallen grave marker',blSlab('bl_mk0',['CORDER','FAMILY'],{h:.7,top:.2,span:.55}),d=>{
  const F=blF(),i=d.i|0,bit=1<<i,t=BLG_MARKS[i]||BLG_MARKS[0];
  if((F.mk|0)&bit)return say('A grave marker, set upright in the mud: '+t[0]+'. '+t[1]+'. Someone has pressed a handful of reeds against its foot.',[BYE]);
  return say('A flat slab of grey stone lying in the mud, with a name cut in it: '+t[0]+'. Below it, the cut is a tally of the drowned: '+t[1]+'. It has been lying here a long time.',[['Set the marker upright.',()=>{F.mk=(F.mk|0)|bit;d.k=blgMarkKey(i,true);try{if(LEVEL===BLG.ID)for(const q of G.decor)if(q.npc==='blg_ghost'+i)q.found=true}catch(e){}sfx('win');if(qSt('blq13')==='active')yrStep('You set a grave marker upright ('+blgMk()+' of 3).');return say('You set your shoulder under the slab and heave it upright, and it settles into the mud with a long sigh. The water in the reeds goes very still.',[BYE])}],BYE])});
function blgMarkKey(i,up){return blSlab('bl_mk'+i+(up?'u':''),[BLG_MARKS[i][0],up?'AT REST':'FAMILY'],{h:up?1.0:.7,top:.2,span:.55})}
khNpc('blg_salt','A sack of peat salt','kh_oqstuff_9',d=>{
  const F=blF(),i=d.i|0,bit=1<<i;
  if((F.salt|0)&bit)return say('Bare flagstones, and a few grains of grey salt where the sack lay.',[BYE]);
  return say('A sack of grey peat salt, left where it was dropped. The cloth is stiff with damp, and the salt inside is as hard as sugar. A tag is tied to the neck: SALLOW. DO NOT LET THE WET GET IN.',[['Take the sack.',()=>{F.salt=(F.salt|0)|bit;d.found=true;d.hidden=true;sfx('key');msg('You take a sack of peat salt ('+blgSalt()+' of 3).','#ffe36a');return null}],BYE])});
yrHook('blg_nan',d=>{const F=blF();
  if(qSt('blq12')==='active'&&blgSalt()>=3&&!F.saltGiven)return say('Nan Sallow looks at the three grey sacks, and her face goes soft. "Oh, you dear things," she says. "Give them here."',[['Give her the three sacks of salt.',()=>{F.saltGiven=1;sfx('win');msg('You give Nan Sallow the peat salt.','#ffe36a');return say('She hefts each sack in turn, and sniffs it, and puts it carefully on the shelf. "Bless you," she says. "That will keep the lot of us."',[BYE])}],['Not yet.',()=>null]]);
  return null});
khNpc('blg_gibbet','The Gallows Tree','ww_crowtree',()=>say('A great black tree on the village green, with an iron cage hanging from a limb, and three ropes. A board nailed to the trunk says: TO WHOM IT MAY CONCERN. WHOEVER REFUSES THE TOLL. Under it, fresh paint: WE DID NOT. Nobody hangs here now. It is only that the tree has not forgotten.',[BYE]));
khNpc('blg_hanged','A hanged scarecrow','ww_totem',()=>say('A scarecrow hung from a beam by its neck, in a drowned man\'s Sunday coat, with a placard: I DID NOT PAY. The straw of its face is green with damp, and somebody has put a clay pipe in its mouth, kindly.',[BYE]));
khNpc('blg_bog','A bog body','gy_mound',d=>{const t=['A man lies in the peat, flat on his back, tanned dark as a saddle, with a rope still round his neck. Somebody has laid a few reeds over his face. He has been here a very long time, and he is in surprisingly good order.','A woman lies curled on her side in the black earth, with her knees drawn up and a plait of red hair still on her shoulder. Her hands are over her ears. The peat has kept every line of her face.','A boy lies in the peat, small and brown, in a wool cap. A reed has been placed in his hand. A stake at his foot says, in Nan Sallow\'s hand: SALTED.'];return say(t[(d.i|0)%3],[BYE])});
khNpc('blg_well','The village well','ww_well',()=>say('A stone well with a little roof, in the middle of the green. The water in it is perfectly black and perfectly still. Written on the lid: DO NOT PAY. Somebody has crossed out DO NOT and written DID NOT.',[BYE]));
khNpc('blg_tollhut','The toll hut','bl_hut',()=>say('A toll hut at the foot of the causeway, door nailed open. Inside, a table, and a ledger, and a very long list of names, each with a mark beside it. The marks are all the same: NO. The last name on the list is GALLOWMERE.',[BYE]));
khNpc('blg_sign_e','A signpost','greensign',()=>say('A signpost at the east gate. The board reads GALLOWMERE, to the west, across the causeway. Under it, nailed on lower: KEEP TO THE LIGHTS. NO WADING. NO PAYING.',[BYE]));
khNpc('blg_sign_w','A signpost','greensign',()=>say('A signpost by the west gate. The board reads THE BONE ORCHARD, to the west. Below it: WE WOULD NOT RECOMMEND IT. Below that, in a better hand: BUT THE FRUIT IS VERY FINE.',[BYE]));
khNpc('blg_sign_v','A signpost','greensign',()=>say('A signpost at the head of the village. The board reads GALLOWMERE, A FREE VILLAGE. Under it somebody has added: POPULATION 212. Under that, with a nail: 3.',[BYE]));
khNpc('blg_reevedoor',"The Reeve's door",'gy_arch',()=>say('The stilt door of the Reeve\'s house, a low arch set in black planks, with a bronze plumb-bob for a knocker. Water runs steadily out underneath it, over the step, and into the mere. A voice on the other side says, very distinctly and a little hopefully: "Is that the clerk? I have it here. I have it all here."',[['Open the door and go in.',()=>{sfx('door');G.talk=null;goToLevel(BLG.REEVE,{x:7,y:10,f:0});return null}],BYE]));
khNpc('blg_reevechest',"The Reeve's strongbox",'gy_chest',()=>{
  const F=blF();if(F.blgReeveChest)return say('The strongbox is open, and the toll money inside has gone to rust and weed.',[BYE]);
  return say('A bronze-bound strongbox on the dais, under the Reeve\'s chair, full of coins that have been counted and recounted. There is a ribbon on it, and a label: FOR THE TOLL.',[['Take the money.',()=>{F.blgReeveChest=1;G.gold+=2200;sfx('win');msg('You take 2200 gold.','#ffe36a');return null}],BYE])});
khNpc('blg_reevechair',"The Reeve's chair",'mi_pew',()=>say('A heavy chair of black oak, with a seat worn hollow. The arms are carved with reeds. A little pool of black water has gathered on the seat.',[BYE]));
khNpc('blg_chest','A fen chest','gy_chest',()=>{
  const F=blF();if(F.blgChest)return say('The chest is empty, apart from silt.',[BYE]);
  return say('A sea-chest on the jetty, green with weed, left behind by the water. The lock has long since rusted through.',[['Open it.',()=>{F.blgChest=1;G.gold+=1500;sfx('win');msg('You take 1500 gold.','#ffe36a');return null}],BYE])});
khNpc('blg_hoblid','Nan\'s husband','gy_coffin',()=>say('A neat pine box under the bed, with a lid held down by two nails, and a card in Nan Sallow\'s hand: HOB. SALTED. DO NOT OPEN. A thin knocking comes from the inside, once, and stops, as though he knew you were looking.',[BYE]));
khNpc('blg_nets','Nets','hay',()=>say('A heap of fishing nets, with the floats still on them and a good deal of weed. Not one is whole. They have all been cut, neatly, with something sharp.',[BYE]));
khNpc('blg_chart','A chart of the mere','greensign',()=>say('A chart of the Gallowmere water, drawn on oiled cloth. The village is a small black square. The dykes are marked in red, and every one of them is crossed through. A note at the margin: THEY WERE OPENED FROM THE INSIDE.',[BYE]));
/* the Reeve's rod falls when the Reeve falls */
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;const r=_h.apply(this,arguments);
  try{if(was&&e.hp<=0&&e.t==='blreeve'){const F=blF();if(!F.reeve){F.reeve=1;if(!bagAdd(mkItem('blreevestaff')))G.items.push({k:'blreevestaff',x:Math.round(e.x),y:Math.round(e.y),taken:false});msg("The Drowned Reeve sinks, and the water goes down round him. His rod floats up. You take the Reeve's Rod.",'#ffe36a');sfx('win')}}}catch(x){console.error(x)}
  return r}}
/* ---------- the level ---------- */
function blgBuild(p){
  blgArt();
  const C=blKit({id:BLG.ID,W:BLG.W,H:BLG.H,name:p.name,lvl:86,start:{x:84,y:38,f:3},wind:.32});
  const {hs,decor,fm,hgt,block}=C,W=BLG.W,H=BLG.H,F=blF(),X0=C.X0,X1=C.X1,Y0=C.Y0,Y1=C.Y1;
  C.hills(.08);C.boundary();
  const land=new Uint8Array(W*H),ix=(x,y)=>y*W+x;
  const ell=(cx,cy,rx,ry,j)=>{for(let y=Math.floor(cy-ry-2);y<=cy+ry+2;y++)for(let x=Math.floor(cx-rx-2);x<=cx+rx+2;x++){if(x<X0||y<Y0||x>X1||y>Y1)continue;const d=((x-cx)/rx)**2+((y-cy)/ry)**2;if(d<=1+(hs(x,y,9)-.5)*(j||.3))land[ix(x,y)]=1}};
  const box=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=X0&&x<=X1&&y>=Y0&&y<=Y1)land[ix(x,y)]=1};
  ell(36,40,15,15);                       // the village island
  box(74,28,87,62);ell(80,45,8,18,.2);    // the east bank
  box(50,38,74,39);                       // the causeway
  box(14,38,22,39);box(2,28,14,62);ell(8,18,8,12,.25);   // the west causeway, the west bank, the north west reed beds
  ell(66,13,7,5);                         // Heron Isle
  ell(28,12,8,6);                         // the Reeve's Isle
  ell(38,62,10,7);box(35,52,38,58);       // the south salt pans and their neck
  box(49,48,50,48);box(62,17,62,18);box(28,17,28,18);   // the three piers
  // the house stilts: a ring of water round each of the two stilt houses on the island, open at the front
  box(BLG_HOUSE_OSK.x0-1,BLG_HOUSE_OSK.y0-1,BLG_HOUSE_OSK.x1+1,BLG_HOUSE_OSK.y1+1);box(BLG_HOUSE_NAN.x0-1,BLG_HOUSE_NAN.y0-1,BLG_HOUSE_NAN.x1+1,BLG_HOUSE_NAN.y1+1);
  box(BLG_HOUSE_REEVE.x0-1,BLG_HOUSE_REEVE.y0-1,BLG_HOUSE_REEVE.x1+1,BLG_HOUSE_REEVE.y1+2);
  // ground and water
  for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){const i=ix(x,y);if(land[i]){fm[i]='0';hgt[i]=.3}else{fm[i]='5';hgt[i]=-.3;block[i]=1}}
  C.setF(74,28,87,62,'0');C.setF(2,28,14,62,'0');
  C.pth(50,38,74,39,'2');C.pth(14,38,22,39,'2');C.pth(22,38,50,39,'1');C.pth(75,37,87,39,'1');C.pth(2,37,13,39,'1');
  C.pth(33,35,40,41,'3');C.pth(47,40,48,47,'1');C.pth(49,48,50,48,'2');C.pth(62,17,62,18,'2');C.pth(28,17,28,18,'2');C.pth(35,52,38,58,'1');C.pth(36,40,36,33,'1');C.pth(42,40,42,41,'1');C.pth(31,35,31,37,'1');
  C.pth(28,13,28,16,'1');C.pth(62,12,62,16,'1');for(let y=58;y<=66;y++)for(let x=30;x<=46;x++)if(land[ix(x,y)]){fm[ix(x,y)]='4';C.path.add(x+','+y)}
  const wat=(x,y)=>!land[ix(x,y)],ok=(x,y)=>x>=X0&&y>=Y0&&x<=X1&&y<=Y1&&land[ix(x,y)]&&!C.used.has(x+','+y);
  C.gate('E',38);C.gate('W',38);
  // the houses: two stilt houses with enterable doors, a few shut ones
  C.house(BLG_HOUSE_NAN);C.house(BLG_HOUSE_OSK);C.house(BLG_HOUSE_REEVE);
  for(const h of [{x0:40,x1:41,y0:33,y1:34,face:'S',sty:'dtimber',roof:'thatch2',wh:2.1},{x0:26,x1:27,y0:42,y1:43,face:'N',sty:'dtimber',roof:'thatch2',wh:2.1},{x0:46,x1:47,y0:32,y1:33,face:'S',sty:'dtimber',roof:'thatch2',wh:2.1},{x0:30,x1:31,y0:44,y1:45,face:'N',sty:'dtimber',roof:'thatch2',wh:2.1}])C.house(Object.assign({lit:false},h));
  for(const h of [BLG_HOUSE_NAN,BLG_HOUSE_OSK,BLG_HOUSE_REEVE]){for(const [x,y] of [[h.x0-1,h.y0-1],[h.x1+1,h.y0-1],[h.x0-1,h.y1+1],[h.x1+1,h.y1+1]])C.dec('gy_rpost',x,y,{block:true,sc:.9})}
  C.dec('gy_lantern',25,12,{block:true});C.light(25,12,C.pale);C.dec('gy_lantern',29,12,{block:true});C.light(29,12,C.warm);
  // the village green: the Gallows Tree, the hanged, the well, signs, lamps
  C.dec('ww_crowtree',36,31,{block:true,npc:'blg_gibbet',sc:1.1});C.dec('ww_totem',34,32,{block:true,npc:'blg_hanged',sc:.9});C.dec('ww_totem',38,32,{block:true,npc:'blg_hanged',sc:.9});
  C.dec('ww_well',34,37,{block:true,npc:'blg_well',sc:.9});C.light(36,36,C.pale);C.light(33,40,C.pale);
  C.post(40,37,'bl_gm_v',[{n:'GALLOWMERE',d:0},{n:'A FREE VILLAGE',d:0}],'blg_sign_v','A signpost at the head of the village. The board reads GALLOWMERE, A FREE VILLAGE. Under it somebody has added: POPULATION 212. Under that, with a nail: 3.',{i:2});
  C.dec('ww_sign',45,37,{block:true,sc:.8,npc:'blg_sign_v'});
  for(const x of [26,30,44,48]){C.dec('gy_lantern',x,37,{block:true});C.light(x,37,C.pale)}
  for(const x of [28,32,46]){C.dec('gy_lantern',x,40,{block:true});C.light(x,40,C.pale)}
  C.dec('hay',44,41,{block:true,sc:.9,npc:'blg_nets'});C.dec('barrel',45,42,{block:true,sc:.9});C.dec('crate',46,42,{block:true,sc:.9});
  C.person('blg_tam',37,34,2);
  // the jetty, the boat and the chest
  C.dec('yar_boat_row',BLG_DOCK.boat[0],BLG_DOCK.boat[1],{block:true,npc:'blg_boat0',sc:1.5});
  C.dec('gy_chest',49,47,{block:true,npc:'blg_chest',sc:.9});C.dec('gy_lantern',48,49,{block:true});C.light(48,49,C.warm);C.dec('gy_rpost',51,49,{block:true,sc:.9});C.dec('gy_rpost',51,47,{block:true,sc:.9});
  // the causeway lamps and the east bank
  BLG_LAMPS.forEach(([x,y],i)=>{const lit=(F.lamps|0)&(1<<i);C.dec('gy_lantern',x,y,{block:true,npc:'blg_lamp',i});C.light(x,y,lit?C.warm:C.pale)});
  C.dec('bl_hut',80,34,{block:true,npc:'blg_tollhut',sc:.9});C.light(80,36,C.warm);
  C.post(83,40,'bl_gm_e',[{n:'GALLOWMERE',d:-1}],'blg_sign_e','A signpost at the east gate. The board reads GALLOWMERE, to the west, across the causeway. Under it, nailed on lower: KEEP TO THE LIGHTS. NO WADING. NO PAYING.',{i:3});
  C.milestone(84,35);
  for(let y=30;y<=46;y+=4){C.dec('gy_lantern',77,y,{block:true});C.light(77,y,C.pale)}
  // the west bank
  C.post(6,40,'bl_gm_w',[{n:'THE BONE ORCHARD',d:-1}],'blg_sign_w','A signpost by the west gate. The board reads THE BONE ORCHARD, to the west. Below it: WE WOULD NOT RECOMMEND IT. Below that, in a better hand: BUT THE FRUIT IS VERY FINE.',{i:5});
  for(let x=4;x<=12;x+=4){C.dec('gy_lantern',x,36,{block:true});C.light(x,36,C.pale)}
  // the lantern, the markers, the salt, the bog bodies
  if(!F.lantern&&!F.lanternGiven)C.dec('lamp',69,13,{block:true,npc:'blg_lantern',sc:.5});
  C.dec('yar_boat_row',BLG_HERON.boat[0],BLG_HERON.boat[1],{block:true,npc:'blg_boat1',sc:1.5});C.dec('yar_boat_row',BLG_REEVEISLE.boat[0],BLG_REEVEISLE.boat[1],{block:true,npc:'blg_boat2',sc:1.5});
  [[8,14],[67,11],[38,33]].forEach(([x,y],i)=>{const set=(F.mk|0)&(1<<i);C.dec(blgMarkKey(i,!!set),x,y,{block:true,npc:'blg_marker',i});if(!set)C.dec(['gy_ghost0','gy_ghost1','gy_ghost2'][i],x+(i===2?-1:1),y+1,{block:true,npc:'blg_ghost'+i,sc:.9})});
  [[38,64],[8,56],[82,58]].forEach(([x,y],i)=>{if(!((F.salt|0)&(1<<i)))C.dec('kh_oqstuff_9',x,y,{block:true,npc:'blg_salt',i,sc:.9})});
  [[10,50],[6,52],[12,58],[8,46],[44,58],[41,64],[30,50],[78,52],[84,50],[70,12]].forEach(([x,y],i)=>C.dec('gy_mound',x,y,{block:true,npc:'blg_bog',i,sc:.7}));
  b14GalDress(C,land,ix);
  // reeds along every shore, grey and tall; drowned willows; scrub; pale lights over the water
  for(let y=Y0+1;y<=Y1-1;y++)for(let x=X0+1;x<=X1-1;x++){
    const i=ix(x,y),r=hs(x,y,61);
    if(land[i]){const sh=wat(x-1,y)||wat(x+1,y)||wat(x,y-1)||wat(x,y+1);
      if(sh&&r<.55&&ok(x,y)&&!C.path.has(x+','+y)){const d=C.D(r<.08?b14Dead('b14_greeds','greeds','saturate(.2) brightness(.5)'):r<.3?'hgwm_reed0':b14Dead('b14_reeds','reeds','saturate(.12) brightness(.5)'),x,y,{sc:.8+hs(x,y,62)*.5});if(d){d.ox=(hs(x,y,63)-.5)*.5}}
      else if(!sh&&r>.93&&ok(x,y)&&!C.path.has(x+','+y))C.DB(r>.97?'ww_willow':'gy_dead',x,y,{sc:.85+hs(x,y,64)*.4})
      else if(!sh&&r<.12&&ok(x,y)&&!C.path.has(x+','+y)){const d=C.D('bl_grass'+((hs(x,y,65)*4)|0),x,y,{sc:.7+hs(x,y,66)*.6});if(d){d.ox=(hs(x,y,67)-.5)*.6;d.oy=(hs(x,y,68)-.5)*.5}}}
    else if(r<.045){const nb=wat(x-1,y)&&wat(x+1,y)&&wat(x,y-1)&&wat(x,y+1);if(nb&&!(y>=36&&y<=41&&x>=48&&x<=76)){const d=C.dec(r<.02?'hgwm_reed0':b14Dead('b14_greeds','greeds','saturate(.2) brightness(.5)'),x,y,{sc:.9+hs(x,y,69)*.5});if(d)d.ox=(hs(x,y,70)-.5)*.4}}}
  for(let n=0;n<26;n++){const x=X0+2+((hs(n,1,71)*(X1-X0-4))|0),y=Y0+2+((hs(n,2,71)*(Y1-Y0-4))|0);if(wat(x,y)&&!(y>=35&&y<=42&&x>=14&&x<=76))C.light(x,y,[.55,1.15,.8])}
  // the dead and the wisps (the wisps wait where the lamps have not reached, none within five squares of a lit lamp)
  const land2=(t,x,y,r)=>{for(let k=0;k<=(r||4);k++)for(let dy=-k;dy<=k;dy++)for(let dx=-k;dx<=k;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==k)continue;const a=x+dx,b=y+dy;if(ok(a,b)&&!C.path.has(a+','+b)){C.foe(t,a,b);return true}}return false};
  const litNear=(x,y)=>BLG_LAMPS.some(([lx,ly],i)=>((F.lamps|0)&(1<<i))&&Math.hypot(x-lx,y-ly)<=5.5);
  const wisps=[[68,38],[64,39],[60,38],[56,39],[53,38],[76,29],[76,47],[66,12],[70,15],[64,14],[28,7],[24,13],[34,12],[40,50],[20,30],[10,26],[84,56],[80,60],[30,64]];
  for(const [x,y] of wisps){if(litNear(x,y))continue;if(y>=38&&y<=39&&x>=50&&x<=74){if(!C.used.has(x+','+y))C.foe('blwisp',x,y)}else land2('blwisp',x,y,3)}
  for(const [t,x,y] of [['blbloat',12,50],['blbloat',44,60],['blbloat',30,48],['blbloat',82,52],['blhusk',9,44],['blhusk',40,56],['blhusk',76,58],['blhusk',26,38],['blghoul',34,46],['blghoul',10,32],['blghoul',79,53],['blghoul',46,36],
      ['blcrow',24,30],['blcrow',46,50],['blcrow',78,48],['blshade',20,20],['blshade',36,60],['blshade',6,58],['blbones',30,34],['blcrowflock',60,12]])land2(t,x,y,4);
  for(const [k,x,y] of [['potion6',9,34],['potion6',38,66],['potion6',84,60]])C.items.push({k,x,y,taken:false});
  C.mapNames.push({t:'The Causeway',x:62,y:36,k:'place'},{t:'The Village Green',x:36,y:37,k:'place'},{t:'The Gallows Tree',x:36,y:30,k:'place'},{t:"Osk Brine's House",x:42,y:42,k:'place'},{t:"Nan Sallow's Cottage",x:31,y:32,k:'place'},{t:'The Jetty',x:49,y:49,k:'place'},{t:'Heron Isle',x:66,y:12,k:'place'},{t:"The Reeve's Isle",x:28,y:10,k:'place'},{t:'The Salt Pans',x:38,y:63,k:'place'},{t:'The Reed Beds',x:8,y:16,k:'place'},{t:'The Peat Fields',x:9,y:52,k:'place'},{t:'The Toll Hut',x:80,y:33,k:'place'},{t:'To Ashenfold and the Church',x:85,y:36,k:'place'},{t:'To the Bone Orchard',x:6,y:36,k:'place'});
  const lv=C.finish({start:{x:84,y:38,f:3}});
  lv.tele=undefined;lv.floorSet=lv.floorSet.slice();lv.floorSet[0]='blf_mud';lv.floorSet[5]=b14Mere();lv._ground={'5':'#6d8c8a','0':'#8a7e5e','4':'#cbc6b2'};   // the engine has six floor slots (0 to 5): land is slot 0 (wet mud), water slot 5 (before this the water was char 6, which drew as slot 5, the mud)
  return lv}
/* ---------- the rooms ---------- */
function blgOsk(){
  const f=BLG_HOUSE_OSK.front;
  blRoom({id:BLG.OSK,name:"Osk Brine's House",w:13,h:9,amb:.5,rating:86,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BLG.ID,x:f[0],y:f[1],f:0},
    lights:[[3,2],[9,2],[6,5],[11,7]],lcol:{'3,2':[1.4,1.0,.6],'9,2':[.75,1.1,.95],'6,5':[1.3,.95,.6],'11,7':[1.35,.98,.58]},col:[1.3,.95,.6],
    enemies:[],
    build:C=>{
      const P=(n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){C.raw('crate',x,y,{})}};
      P('cothearth',6,1,{h:.95});P('clock',3,1,{h:1.1});P('dresser',10,1,{h:1.0});P('bed',2,6,{h:.7});P('longtable',7,5,{h:.7});P('waterbarrel',11,3,{h:.7});P('candlerack',9,1,{h:1.0});P('cat',4,7,{h:.26});
      C.raw('hay',1,3,{npc:'blg_nets',solid:1,deco:false,sc:.9});C.raw('greensign',4,1,{npc:'blg_chart',solid:1,deco:false,sc:.8});
      C.raw('yar_boat_row',11,6,{block:true,sc:1.3});C.raw('gy_web',1,1,{block:false,sc:.5});
      C.npc('blg_osk',5,4)}})}
function blgReeve(){
  blRoom({id:BLG.REEVE,name:"The Reeve's Flooded Hall",w:15,h:12,amb:.4,rating:86,floor:'blf_flood',wall:IMG.wl2_wall_3?'wl2_wall_3':'kh_ohwall1_0',
    back:{to:BLG.ID,x:BLG_HOUSE_REEVE.front[0],y:BLG_HOUSE_REEVE.front[1],f:2},
    lights:[[3,2],[11,2],[7,5],[3,8],[11,8],[7,10]],lcol:{'3,2':[.65,1.15,.85],'11,2':[.65,1.15,.85],'7,5':[.7,1.1,.9],'3,8':[.7,1.1,.9],'11,8':[.65,1.15,.85],'7,10':[1.3,.95,.6]},col:[.7,1.1,.9],
    enemies:[['blreeve',7,3],['blbloat',3,5],['blbloat',11,5],['blwisp',4,2],['blwisp',10,2]],
    build:C=>{
      const P=(n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){C.raw('crate',x,y,{})}};
      P('banner',3,1,{h:1.6});P('banner',11,1,{h:1.6});P('tapestry',7,0,{h:1.1,free:true,block:false});P('counciltable',7,6,{h:.8});P('chandelier',7,8,{h:1.0,free:true,block:false});
      C.raw('mi_pew',7,2,{npc:'blg_reevechair',solid:1,deco:false,sc:1.0});C.raw('gy_chest',9,2,{npc:'blg_reevechest',solid:1,deco:false,sc:.9});
      C.raw('hay',1,9,{block:false,sc:.6});C.raw('gy_bones',5,9,{block:false,sc:.3});C.raw('gy_bones',11,10,{block:false,sc:.3});C.raw('gy_web',1,1,{block:false,sc:.5});C.raw('gy_web',13,1,{block:false,sc:.5});
      C.raw(b14Dead('b14_greeds','greeds','saturate(.2) brightness(.5)'),2,5,{block:false,sc:.9});C.raw(b14Dead('b14_greeds','greeds','saturate(.2) brightness(.5)'),12,5,{block:false,sc:.9});C.raw(b14Dead('b14_greeds','greeds','saturate(.2) brightness(.5)'),1,7,{block:false,sc:.7})}})}
function blgNan(){
  const f=BLG_HOUSE_NAN.front;
  blRoom({id:BLG.NAN,name:"Nan Sallow's Cottage",w:11,h:9,amb:.5,rating:86,floor:'wood',wall:'kh_ohwall1_2',
    back:{to:BLG.ID,x:f[0],y:f[1],f:2},
    lights:[[3,2],[8,2],[5,5]],lcol:{'3,2':[1.4,1.0,.6],'8,2':[1.35,.98,.58],'5,5':[1.3,.95,.6]},col:[1.3,.95,.6],
    enemies:[],
    build:C=>{
      const P=(n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){C.raw('crate',x,y,{})}};
      P('hearth',5,1,{h:1.2});P('potshelf',2,1,{h:1.0});P('potshelf',8,1,{h:1.0});P('bed',8,6,{h:.7});P('dresser',9,3,{h:1.0});P('coopstack',1,4,{h:.95});P('veg',1,6,{h:.6});P('cat',3,7,{h:.26});P('waterbarrel',9,7,{h:.7});P('rocker',3,4,{h:.7});
      C.raw('gy_coffin',7,7,{npc:'blg_hoblid',solid:1,deco:false,sc:.6});C.raw('gy_web',9,1,{block:false,sc:.5});
      C.npc('blg_nan',5,4)}})}
for(const [id,fn] of [[BLG.OSK,blgOsk],[BLG.REEVE,blgReeve],[BLG.NAN,blgNan]])
  KH_LAZY[id]=()=>{if(!LEVELS[id]){if(!LEVELS[BLG.ID])KH_LAZY[BLG.ID]();blgArt();fn()}return LEVELS[id]};
/* the quest rings */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),T=QRF.T;
  T.blq11={give:[N(9641,'blg_osk')],act:()=>blF().lantern?[N(9641,'blg_osk')]:[N(9640,'blg_boat0'),N(9640,'blg_lantern')],ready:[N(9641,'blg_osk')]};
  T.blq12={give:[N(9643,'blg_nan')],act:()=>blgSalt()>=3?[N(9643,'blg_nan')]:[N(9640,'blg_salt')],ready:[N(9643,'blg_nan')]};
  T.blq13={give:[N(9640,'blg_tam')],act:[N(9640,'blg_marker')],ready:[N(9640,'blg_tam')]};
  T.blq14={give:[N(9643,'blg_nan')],act:()=>blF().reeve?[N(9643,'blg_nan')]:[N(9640,'blg_boat0'),{lvl:9642,en:/^blreeve$/}],ready:[N(9643,'blg_nan')]}}
blRegister(4,blgBuild,{fromE:{x:84,y:38,f:3},fromW:{x:4,y:38,f:1},exitY:38,rooms:[9641,9642,9643],names:{9641:"Osk Brine's House",9642:"The Reeve's Flooded Hall",9643:"Nan Sallow's Cottage"},rating:{9641:86,9642:86,9643:86}});

/* ---------- polish (round 1 to 4): the village and the banks, dressed ---------- */
function b14GalDress(C,land,ix){
  const nets=b14Dead('b14_nets','yar_nets','saturate(.25) brightness(.62)',1.2),pots=b14Dead('b14_pots','yar_pots','saturate(.3) brightness(.6)',.4),cage=b14Dead('b14_cage','ww_cagefull','saturate(.4) brightness(.7)',1.1),
    cage0=b14Dead('b14_cage0','ww_cageempty','saturate(.4) brightness(.7)',1.1),cart=b14Dead('b14_cart','cart','saturate(.3) brightness(.62)',1.1),sacks=b14Dead('b14_sacks','sacks','saturate(.3) brightness(.6)',.7),
    ban=b14Dead('b14_banner','banner','saturate(.5) brightness(.75)',1.6),crates=b14Dead('b14_fcrates','yar_crates','saturate(.3) brightness(.6)',.8);
  const ok=(x,y)=>x>=C.X0&&y>=C.Y0&&x<=C.X1&&y<=C.Y1&&land[ix(x,y)]&&C.free(x,y)&&!C.path.has(x+','+y);
  const put=(k,x,y,o)=>{if(ok(x,y))C.dec(k,x,y,Object.assign({block:true},o||{}))};
  // the village green: cages with bones at the Gallows Tree, nets on poles, pots, crates, a cart, torn banners
  put(cage,35,33,{sc:.9});put(cage0,37,33,{sc:.9});put(ban,32,37);put(ban,40,36);put(nets,44,36,{sc:1});put(nets,28,36,{sc:1});put(pots,45,40);put(pots,29,40);put(crates,47,41);put(crates,43,39);put(cart,31,41,{sc:.9});put(sacks,44,43,{sc:.9});
  // the jetty and the causeway: nets, pots and crates
  put(nets,49,46);put(pots,52,47);put(crates,48,50);put(nets,58,36);put(pots,64,36);put(crates,70,36);put(pots,76,36);
  // the banks: a wrecked cart each end, sacks and barrels by the toll hut and the bone orchard road
  put(cart,78,36,{sc:.9});put(cart,8,36,{sc:.9});put('barrel',79,34,{sc:.8});put(sacks,81,34);put('barrel',6,36,{sc:.8});put(crates,10,36);
  for(const [x,y] of [[34,38],[40,38],[44,38],[48,38],[56,38],[66,38],[10,38],[78,38]])if(ok(x,y))C.dec('gy_bones',x,y,{sc:.4})}
