/* ==========================================================================
   THE PEOPLE, BOOKS AND QUESTS OF THE VAULT (prefix vt / VTS2). Sergeant Hale of Oldhaven stands at the garrison picket on the hill and gives the five quests bl7a to bl7e; the rest of the Vault is read:
   the Roll of Underhill, the seven journal pages, the coffins, the bells, the sigil altars, the red-eyed book, the contract, Maldrake and Hesper.
   THE STORY: Wystan Maldrake kept the barrows of Underhill and was the village's nearest thing to a doctor. The grey fever (the Blight) came. The Pale Sovereign's agent, the Pale Factor, offered silver
   that would mend the village, for a service, and Maldrake signed. The silver did not mend the sick. It stood them up again after they died, and the ring he wears turns them out to walk the Blighted Road.
   He sealed himself under the hill behind five pale-silver locks so that the living could not reach him and he could do no worse. The Sovereign also left him the key of the gate of Sale to keep.
   Ending A (sympathy): read him the Silver Contract aloud, every clause (the contract is in the secret archive); the ring breaks, he gives the key and a spell, and dies at peace.
   Ending B (fight): the hard boss. The key comes from his body. No sympathy bonus.
   Quests: bl7a The Dead on the Hill, bl7b Down the Barrow Stair, bl7c What Maldrake Wrote, bl7d The Last Locks, bl7e The Gate Key of Sale. Hale gives a and e; b, c and d complete as the party earns them.
   ========================================================================== */
/* ---------- the plain rules ---------- */
const vtPages=()=>{const F=vtF();return [1,2,3,4,5,6].filter(i=>F.pages[i]).length};
const vtFlag=f=>()=>!!vtF()[f];
if(typeof QAREA_ORDER!=='undefined'&&!QAREA_ORDER.includes('The Blighted Lands'))QAREA_ORDER.push('The Blighted Lands');
function vtQuest(id,title,who,steps,reward,o){
  const q=Object.assign({title,who,need:steps.length,goal:()=>steps.reduce((n,s)=>n+(s[1]()?1:0),0),reward},o||{});
  Object.defineProperty(q,'desc',{enumerable:true,configurable:true,get(){const s=steps.find(s=>!s[1]());return s?(typeof s[0]==='function'?s[0]():s[0]):'All is done. Tell Sergeant Hale.'}});
  QUESTS[id]=q;QAREA[id]='The Blighted Lands';if(typeof MAIN_QUESTS!=='undefined')MAIN_QUESTS.add(id);return q}
const VT_REW={bl7a:{gold:3000,xp:20000,items:['potion6']},bl7b:{gold:4000,xp:30000,items:['potion6','supermana']},bl7c:{gold:5000,xp:36000,items:['elixir']},bl7d:{gold:6000,xp:45000,items:['supermana','elixir']},bl7e:{gold:12000,xp:70000,items:['vtamulet']}};
QUESTS.bl7a={title:'The Dead on the Hill',who:'Sergeant Hale, at the garrison picket',need:8,cnt:'vtHill',goal:q=>(G.flags.vtHill|0)-(q.base||0),reward:VT_REW.bl7a};
Object.defineProperty(QUESTS.bl7a,'desc',{enumerable:true,configurable:true,get(){return 'Kill 8 of the dead on the Barrow Hill, so that Sergeant Hale can get to the door. ('+Math.min(8,Math.max(0,(G.flags.vtHill|0)-((G.quests.bl7a&&G.quests.bl7a.base)||0)))+' of 8)'}});
QAREA.bl7a='The Blighted Lands';if(typeof MAIN_QUESTS!=='undefined')MAIN_QUESTS.add('bl7a');
vtQuest('bl7b','Down the Barrow Stair','Sergeant Hale, at the garrison picket',[
  ["Go through the door of the Vault at the top of the hill. In the Barrow Stair, kill the Barrow Warden for the Pale Silver Key and open the first pale-silver lock at the south end of the Warden's Hall.",()=>!!vtF().locks.L1],
  ["On the second floor, open the Ring of Coffins in the order of the Roll of Underhill (the Roll is on the lectern in the Reading Room), and go down through the Coffin Gate.",()=>!!vtF().ringDone],
  ["On the third floor, ring the five bells of the Bell Gallery in the right order, and open the second pale-silver lock.",()=>!!vtF().locks.L2]],VT_REW.bl7b);
vtQuest('bl7c','What Maldrake Wrote','Sergeant Hale, at the garrison picket',[
  [()=>"Find four pages of Maldrake's journal. They lie on the lecterns and desks of the Vault, one on each of the first six floors ("+Math.min(4,vtPages())+" of 4).",()=>vtPages()>=4]],VT_REW.bl7c,{need:4,goal:()=>Math.min(4,vtPages())});
vtQuest('bl7d','The Last Locks','Sergeant Hale, at the garrison picket',[
  ["On the fourth floor, the Silvered Cellars, fetch the three Silver Sigils of Underhill (the Room of Needles, the Hounds' Den, the Silvered Hall) and open the third pale-silver lock.",()=>!!vtF().locks.L3],
  ["On the sixth floor, kill the Silver Warden for the Sanctum Seal, and open the last pale-silver lock.",()=>!!vtF().locks.L4],
  ["Go down into Maldrake's Sanctum.",()=>!!vtF().reach[9677]]],VT_REW.bl7d);
vtQuest('bl7e','The Gate Key of Sale','Sergeant Hale, at the garrison picket',[
  ["Take the Gate Key of Sale from Wystan Maldrake in his Sanctum, by listening to him or by killing him.",()=>!!vtF().gotKey||bagCount('vtgatekey')>0]],VT_REW.bl7e);
QNEXT.bl7a='bl7b';QNEXT.bl7b='bl7c';QNEXT.bl7c='bl7d';QNEXT.bl7d='bl7e';
QNOTE.bl7e='Sergeant Hale writes to Lanternrest and to Oldhaven: the dead of the Barrow Hill are the Sovereign\'s, the way west is open as far as the gate of Sale, and the party holds the key.';
QGIVER.vto_hale=['bl7a','bl7b','bl7c','bl7d','bl7e'];
/* quests that are earned in the Vault finish by themselves (the party is not going to climb six floors to be told so) */
{const _u=update;let nt=0;update=function(dt){try{if(vtInside(LEVEL)&&G.state==='play'&&(nt-=dt)<=0){nt=1.2;for(const id of ['bl7b','bl7c','bl7d'])if(qReady(id))qTurnIn(id)}}catch(e){console.error('vt auto',e)}return _u.apply(this,arguments)}}
/* ---------- the texts ---------- */
const VT_SARC=[
 "TOLL, the keeper of this door. He kept it for forty years, and he is still on duty.",
 "A barrow-chief of the old people, name worn off. Somebody has put a clay cup of water on the lid, very recently, and the water is clean.",
 "MARTHA GREY, 1 child, 4 grandchildren, 1 very strong opinion about the weather.",
 "HERE LIES A STRANGER, who came to Underhill in a storm and was given supper. He stayed, and then he stayed longer.",
 "OSWIN REEVE, who counted the village's sheep every spring, and was always one short. He was the one.",
 "Two names on one lid, and a gap between them where a third was meant to go. The stone-cutter ran out of money.",
 "GAFFER PENN, bee-man. The lid has a small, neat hole in it, and bees have been through it in better years.",
 "A sarcophagus with its lid slid off a hand's breadth. Inside, dust, and a ribbon, and a tooth.",
 "ALDWYN DUNN, thatcher. He thatched the Vault door in his youth. It has never leaked.",
 "THE LAST OF THE OLD PEOPLE. The stone is much older than the village, and it is not unfriendly.",
 "HOB AND NELLIE LARK. They quarrelled for sixty years, and lie side by side, with a hand's breadth of stone between them.",
 "BROTHER SILAS, who taught the children their letters in the chapel. Every letter on this stone is correct.",
 "A cracked lid. Silver thread runs through the crack like a vein, and it is cold.",
 "MOTHER TAMSIN, the village midwife before Nan Pelter. The lid is smooth in one place, where children touch it for luck.",
 "EDRIC WELLS, a boy of fourteen. His mother carved the lid herself, and it is not very good, and it is the best thing here."];
const VT_VILLAGERS=[
 "A woman in a blue apron sits at the table with a wooden spoon in her hand. The bowl in front of her is full of grey dust. Silver thread runs along the veins of her wrists.",
 "A man in his Sunday coat, with a clay pipe in his teeth that has never been lit. His eyes are open. He is watching the door, as a man watches a door when he is waiting for somebody who is late.",
 "A child in a nightshirt sits on a stool with her feet not touching the floor. She has been sitting there for a long time. The silver in her veins has made her very still.",
 "An old man leans on a stick he has not put down, with his chin on his chest. He might be asleep. He is not asleep.",
 "A young woman has her hair in a plait with a blue ribbon. The ribbon is new. Someone has tied it for her, very recently, and very carefully.",
 "A big man with a smith's forearms sits with his hands flat on the table, as though the table might get up.",
 "A man and a woman sit side by side with their hands held on the table between them. Their fingers have gone grey, and have not let go.",
 "A boy of about twelve, with a toy boat in front of him, a good one with a paper sail. He is not playing with it.",
 "An old woman in a shawl, with her eyes shut. Her lips move in a prayer that is nine hundred years old and she is saying it very slowly.",
 "A man with a ferryman's hands and a ferryman's rope round his waist, still wet, though nothing here is wet.",
 "A girl with a shepherd's crook across her knees, and a lamb made of grey wool on the table in front of her.",
 "A thin man with ink on his fingers, a clerk or a priest, who has written the same line on the table in front of him over and over with his finger: 'I will be late for supper.'"];
const VT_VILLAGERS_FREE=["The villager sits as before, but the silver thread has gone dull and the grey hand has let go of the spoon. This one is only dead, now, and at rest.","The villager's eyes are closed. The pipe has fallen out of the mouth. There is a smile, or something close to one.","The child has put her head on the table, like a child at the end of a long evening.","The old man has put down the stick, at last, and is asleep, properly.","The ribbon is still blue. The girl is quiet.","The smith's hands have opened, and the table has been left to stay where it is.","The two hands have not let go of each other. They do not need to.","The boy has taken up the paper boat, and has it in both hands.","The old woman's lips have stopped. The prayer is finished.","The rope has come undone, and has dropped to the floor in a neat coil.","The lamb of grey wool has been taken in both arms.","The clerk has finished the line. It says, now, 'I am not late.'"];
const VT_BARROWS=["The barrow of the Millers. The wooden door in its side is shut, and a rowan twig has been nailed over the latch.","An open barrow of the Thatchers. The door is off, and fresh earth lies on the grass in front of it. Something has come out of this one, and not long ago.","The barrow of the Pelter family. The door is shut, but the grass in front is trodden flat in a path that leads to the road.","An open barrow of the Brambles. A dead crow sits on the lintel, stiff as a carving.","The barrow of the Cobbs. The door is shut. A horseshoe hangs over it, and it has been there a long time and is not much help.","An open barrow. The door hangs from one hinge, and the dark inside is warmer than the air outside.","The barrow of the Fenns. The door is shut and barred with a black iron bar. Somebody has chalked 'SORRY' on it.","An open barrow. Silver thread shines faintly on the threshold, in the dirt, like a snail's track.","The barrow of the Brights. Shut. A wreath of dead flowers is tied to the latch. They were fresh a week ago.","An open barrow of the Reeves. Eleven footprints go out of it and none go in.","The barrow of the Dunns, the last before the path turns. Shut. A child's wooden horse stands by the door.","An open barrow. The sound of a slow, patient shovel comes out of it, though there is no shovel.","The barrow of the Larks. Shut, and neatly kept. Somebody comes here and cleans it, and has done so quite recently.","An old barrow, older than the village, with no door at all, only a round stone. It is warm to the touch, and does not feel unfriendly."];
/* ---------- the signs, the camp, the hill, Underhill ---------- */
khNpc('vto_sign','A sign','ww_sign',d=>{const t=VTH_SIGNS[vtI(d)%VTH_SIGNS.length];return gySay(t[0]+'. '+t[1],[BYE])});
khNpc('vto_barrow','A barrow','gy_hatch',d=>gySay(VT_BARROWS[vtI(d)%VT_BARROWS.length],[BYE]));
khNpc('vto_cart','A wrecked wagon','cart',()=>gySay("A garrison wagon, on its side, with the king's mark burned into the tailboard. The horse is still in the harness. It is a skeleton. It looks a little offended.",[BYE]));
khNpc('vto_plaguecart','A dead-cart','cart',()=>gySay("The dead-cart of Underhill, the kind a village keeps for a bad autumn. It is empty. Whatever it carried has got up and walked away, and left the shafts neatly on the ground.",[BYE]));
khNpc('vto_banner','A garrison standard','banner',()=>gySay("The standard of the Oldhaven garrison, a white tower on blue. There is a hole in it about the size of a hand.",[BYE]));
khNpc('vto_hut','A cottage of Underhill','gy_hut',d=>{const i=vtI(d);return gySay(["The door is off. Inside, the table is laid for supper for six, and every dish is full of grey dust.","A cottage with a good thatch, and a pot on the hook over a cold hearth. On the wall someone has pencilled the heights of four children, with their names. The last mark is a month old.","A cottage with the shutters nailed up from the inside. Nobody came out. The nails are bright, and so are the scratches round them."][i%3],[BYE])});
khNpc('vto_chapel','The chapel of Underhill','gy_chapel',()=>gySay("The ruined chapel of Underhill. The bell frame at the gable is empty. Hale says the bells went into the hill a long time ago and nobody saw them go, and the bell that tolls at night comes from there.",[BYE]));
khNpc('vto_well','The well of Underhill','ww_well',()=>gySay("The well of Underhill. A thin skin of pale silver lies on the water, and when you lift it with a stick it hangs from the stick like grey wax, and will not drop off. The villagers drank this, in the autumn of the fever. They said it was sweet.",[BYE]));
khNpc('vto_wick','Corporal Wick, of the Oldhaven garrison','kh_ohsold1_1',d=>{const F=vtF();
  return gySay(F.freed?"Corporal Wick has his bandaged arm out of its sling and is looking at it. 'Funny thing,' he says. 'It stopped hurting at the same time the bell stopped. I don't know what you did, but I thank you for it.'":F.dead?"Corporal Wick has been told. He is very quiet. 'The key is yours, then,' he says. 'We will manage the dead. We always do.'":"Corporal Wick has one arm in a sling and the other round a tin mug. 'Sergeant won't say it,' he says, 'so I will. We have been here nine days and I have buried four of my friends, and the next night they came up the hill and walked past me. Quite politely. One of them said good evening. Find out who's doing it, sir. Please. I should like to have a word.'",[BYE])},{sc:1});
/* ---------- Hale ---------- */
const VT_HALE={
 intro:"Halt. Oh, good, you are alive. That puts you ahead of most. I am Sergeant Hale, King Osric's garrison at Oldhaven, forward picket, which is a fancy name for me, Corporal Wick and a wagon. The garrison at Lanternrest sent six of us up the Road to find out why the dead walk down off this hill. There were six of us.",
 intro2:"They come down every night about the time the bell tolls. In rows. Quite tidy. They go west along the Road as far as Hollowbell, and they come back before dawn, and nobody tells them to stop. We have lost three wagons and four good men. The village below is Underhill, or was. It had twelve households. I have not found one living person in it.",
 intro3:"At the top of the hill there is a door. Behind it is the Vault of Maldrake, the barrow-tomb of the village, and Maldrake kept it: a quiet man, a hedge-wizard, who mended my wagon wheel once with a charm and would not take a penny. He went down in there at the start of winter and shut the doors with locks of pale silver. And that is when the dead started getting up. I would like to know why, and I would like it stopped. Will you go?",
 offer:"First, the hill. Eight of the dead, for sword practice, so that I can bring my men up to the terrace and not lose another. Then we talk about the door.",
 accept:"Good. Mind the path. The barrows with the doors open are the ones that are in use. They come out slow, but there are a lot of them. I will be here, by the fire, with Wick, and a very small amount of hope."};
function vtHaleFresh(){
  const F=vtF();
  if(qSt('bl7e')==='done'||F.fin){
    return gySay(F.freed?"Hale is sitting on a barrel with his helmet in his lap. 'I do not know what you did down there,' he says, 'but the bell has not rung since the day you went in. I stood on the hill last night and nothing walked down it. Nothing. I think I may cry, and I would like you to look at the hill while I do it. The road is yours, as far as the gate of Sale.'":"Hale does not get up. 'You did what you had to,' he says. 'The key is yours. I will not say I am sorry he is gone. I will say that I did not like the sound of it, when you said he thanked you. The dead are still walking, I see. The Sovereign still has a hand in it. Somebody must come back and read the paper to them one day, whatever the paper is.'",[BYE]);}
  if(qSt('bl7a')===null){
    const offer=()=>gySay(VT_HALE.offer,[["We will clear the hill.",()=>{qAccept('bl7a');G.flags.vtMet=1;return gySay(VT_HALE.accept,[BYE])}],['Not yet.',()=>null]]);
    const three=()=>gySay(VT_HALE.intro3,[["We will go.",offer],["Who are the dead?",()=>vtHaleDead()],['Not yet.',()=>null]]);
    const two=()=>gySay(VT_HALE.intro2,[['Go on.',three]]);
    return gySay(VT_HALE.intro,[['Go on.',two]])}
  if(qReady('bl7a'))return gySay("Hale looks up the hill, and counts something in his head. 'That is eight,' he says. 'The path is quiet. I can feel the difference in my teeth. Take this: it is what the Oldhaven garrison pays when it has anything to pay with. And the next job is the hard one. The door.'",[['We will take it.',()=>{const rw=rewardText('bl7a');qTurnIn('bl7a');return gySay("Hale gives you "+rw+". 'The door at the top,' he says. 'Pale silver locks. The first is on the other side of a Warden, if I have heard right: the old barrow guard. Go down the Stair, find what they are guarding, and work out why Maldrake shut himself in. I want to know what he wrote. Anything he wrote. A man leaves a trail.'",[BYE])}],BYE]);
  if(qReady('bl7e'))return gySay(F.freed?"You have the key, and Hale sees it before you say a word. 'Gods,' he says. 'You did it without a fight. I heard the bell stop. All of us did. The whole hill went quiet, and Wick sat down in the road.' He takes a long breath. 'The Gate Key of Sale. Keep it. Oldhaven will hear about this, and so will the king. The garrison at Lanternrest will be glad.'":"You have the key. Hale looks at it for a long time. 'Was it hard?' he asks. 'It was hard,' he answers himself. 'Well. It is done, and you have it. Oldhaven will hear. The dead will go on walking, but there is a road to Sale in your pocket, and I will tell the king that is more than anybody else managed.'",[['Here you are.',()=>{const rw=rewardText('bl7e');qTurnIn('bl7e');F.fin=1;return gySay("Hale gives you "+rw+". 'The road west is yours,' he says. 'Hollowbell is next. The abbey is full of monks, and I understand none of them are alive. Be careful of the bell.'",[BYE])}],BYE]);
  // a quest under way: where to go next
  const hint=qSt('bl7b')==='active'?"'The door is at the top of the path, between the angels. Down the Stair, find the Warden, find the key. And do not walk in the middle of a passage you cannot see the end of.'":qSt('bl7c')==='active'?"'Maldrake wrote things down. A man like that does. Find his journal pages, there are lecterns and desks all down the Vault. I would like to know what he was thinking, whether I like it or not.'":qSt('bl7d')==='active'?"'The last locks, then. Three sigils on the fourth floor. A seal on the sixth, from the one they call the Silver Warden. And then him.'":qSt('bl7e')==='active'?"'The key of Sale is on his table, if the Pale Sovereign's men are to be believed. I would like to hear how he looks. If you can, see to it that he is not suffering.'":"'Eight of the dead, for sword practice. The hill is yours.'";
  return gySay(["Hale is poking the fire with a bone, which he will not admit is a bone. ",""][0]+hint,[['Tell me about the dead.',()=>vtHaleDead()],['What do you know about the garrison?',()=>vtHaleGarrison()],["Has anyone been through here lately?",()=>vtHaleWren()],BYE])}
function vtHaleDead(){return gySay("'They are Underhill's. I know a few faces. The miller. The ferryman's wife. There was a little girl, last week, in a nightshirt, going west with the rest, holding a doll. I could not shoot her. Wick shot at her, and missed on purpose, and neither of us has mentioned it. They are not angry, you understand. They look tired. They look as if they have been told to walk and nobody has said where.'",[BYE])}
function vtHaleGarrison(){return gySay("'The garrison at Lanternrest is the fort up the Road, the old coaching inn with a wall round it. Oldhaven put a hundred men in it when the Road went bad. It is the one safe place between here and the Pale Bridge, if you do not count what the soldiers cook. They sent six of us here. Their captain is a hard woman, and fair. She will want a report.'",[BYE])}
function vtHaleWren(){return gySay("'A girl in a green cloak, and an old wizard with a staff the shape of a corkscrew, came along the Road nine days ago, going west. Pleasant girl. She asked about the hill, and I said do not go in, and she said she had somewhere to be. She did not look at the hill once, you know. As though she did not dare to. The old man looked at it a long time. He said something about silver. Then they went on to Sale.'",[BYE])}
khNpc('vto_hale','Sergeant Hale of Oldhaven','kh_ohsold1_0',()=>vtHaleFresh(),{q:QGIVER.vto_hale});
/* ---------- the journal: the Roll, the seven pages, a note from the loft ---------- */
const VT_BOOK=[
 {t:'The Roll of Underhill',x:"PARISH ROLL OF UNDERHILL, kept by Brother Alder, clerk and priest. In the autumn of the third year of the Blight the grey fever came to the village. These are the ones it took, in the order it took them. One: Edda Marl, aged nine, the miller's daughter. Two: Old Joss Thatcher, aged seventy-four. Three: Nan Pelter, aged forty, the midwife. Four: Wat Bramble, aged thirty-three, the ferryman. Five: Dame Orla Fenn, aged sixty-eight, widow. Six: Piers Cobb, aged forty-five, the smith. Seven: Nell Bright, aged nineteen, shepherdess. Eight, in another hand: Brother Alder, aged fifty-two, who wrote this roll and buried the others. Underneath, in a third hand, small and tidy: 'They asked to lie together, so I have laid them in the Ring, each in a coffin of their own. I will not have them woken in the wrong order. Open them as they went. W.M.'"},
 {t:'Maldrake\'s journal, page one',x:"WYSTAN MALDRAKE, his journal. The first week of the fever. I keep the barrows of this hill, and I am the nearest thing Underhill has to a doctor, which is to say I know which herbs not to use. Edda Marl died this morning. She was nine. Her father carried her up the hill himself. The herbs do nothing. I have written to the abbey at Hollowbell for a physician. There is no answer. There is no answer from anywhere. The Road is empty, and the sky over the west is the colour of old milk."},
 {t:'The gravedigger\'s tally',x:"TALLY, kept by the gravedigger of Underhill in the fever autumn. Tuesday, two. Wednesday, one. Thursday, three, and the priest is poorly. I have run out of coffin wood. Mr Maldrake says to use the old barrow chests, and he will lay them in a Ring in the vault below, in the order they go, so that nobody is put in the wrong place and nobody is forgotten. I told him I never heard of such a thing. He said, 'Neither had I.' Then he put his hand on my shoulder, and I was surprised, because I am not used to it. (On the back, in Maldrake's hand: 'The tally is wrong by one. I have corrected it.')"},
 {t:'Maldrake\'s journal, the peal',x:"MALDRAKE, in the Bell Gallery. The old rule of the parish is that the bells ring for the dead by their age: the youngest first, and the Great Bell last, because the Great Bell is never rung alone. When the fever took eight in one week I rang them all, and wrote the order down so that it would not be forgotten. First the Child's Bell. Then the Widow's, for those who stay behind. Then the Miller's. Then the Priest's. Last, the Great Bell. Pull them in that order, and the lock will hear it. I made the lock to hear it. I wanted somebody to be able to come in, in the end, who had read this far."},
 {t:'Letters of the Pale Factor',x:"TO MASTER WYSTAN MALDRAKE OF UNDERHILL. We are told that your village is sick. The Pale Sovereign has silver that mends it, a gift of the Pale Lands, given freely. A cup in the well will do for a household. Sign below for the delivery, and for a small service we ask in return, which will not be heavy. Your servant, the Pale Factor. [Second letter, a month later:] Master Maldrake. The Sovereign is much pleased. Your village is on its feet. We ask the service now. Those who have been mended will walk the Road west at night as far as Hollowbell, and come back by dawn. They will not tire. You will turn the ring on your finger to send them out, and turn it back to call them in. Keep the key that came with this letter. It is the key of the gate of Sale. The Sovereign will send for it."},
 {t:'Maldrake\'s journal, the study',x:"MALDRAKE. I have tried to take off the ring. It does not come off. I have tried to stop, and I cannot stop. The dead of Underhill sit down to supper in the Great Hall every night at seven, in their best clothes, and I cannot make them eat, and I cannot make them leave. The silver did not mend them. It let them die, and then it stood them up again, and the Pale Factor looked very pleased. Hesper went before the silver came. She does not sit at the table. I do not know why. I am glad. I am so glad. If you are reading this in my old study, there is a shelf behind you with a book on it that has a red eye. That is the way to the Archive. Everything that I could not say aloud is there."},
 {t:'Maldrake\'s journal, the stair',x:"MALDRAKE. I have built the locks. Five of them, in pale silver, the sort that answer only to the living with a reason: a key, a peal, a sigil for each of three, a seal. They keep the dead in and the living out, so that nobody is hurt, and so that I cannot do worse than I have done. The Silver Warden holds the last seal. He was the oldest of the barrow guard, and asked to stay on. If you have got this far you are either a soldier or a fool, and I say to both: I am sorry, and please be quick. The ring turns every night at midnight, and I am not always able to hold it back."},
 {t:'Maldrake\'s journal, the last page',x:"MALDRAKE, in the Archive. If anyone reads this, the contract is on the desk. The last clause says that the debt is paid if the whole of the contract is read aloud to me, before a witness, and I agree that it is over. I have never been able to read it aloud. The Sovereign wrote that clause so that the words would stop in my throat, and they do. I can only hear it. If a stranger will read it to me, I will agree. Please. Bring it down to the Sanctum and read it, every word. Then the ring will break. And forgive me, if you can, the Road I have blighted."}];
VT_BOOK[21]={t:"The founder's ledger",x:"LEDGER of the bell-founder of Underhill. Five bells cast for the village in my time, all from one pour: the Child's Bell (high, thin, the first to ring), the Widow's, the Miller's (the deepest), the Priest's, and the Great Bell, cast last, and a good deal heavier than the plan. A note in the margin: 'Ring the Great Bell last. It does not like to ring alone. Nobody knows why. The Great Bell is very old, and has views.'"};
khNpc('vto_book','A lectern','hl_p_lectern',d=>{
  const i=vtI(d),B=VT_BOOK[i],F=vtF();if(!B)return gySay("A book, closed. The pages have stuck together.",[BYE]);
  const first=i<=7&&!F.pages[i];
  if(first){F.pages[i]=1;if(i>=1&&!bagCount('vtpg'+i)&&ITEMDEF['vtpg'+i])bagAdd(mkItem('vtpg'+i));if(i===0&&!bagCount('vtpg0'))bagAdd(mkItem('vtpg0'));sfx('key');msg('You read: '+B.t+'.','#ffe36a');
    if(i>=1&&i<=6&&vtPages()===4)msg('That is four pages of the journal.','#ffe36a')}
  return gySay(B.t.toUpperCase()+'. '+B.x,[BYE])},{sc:1});
khNpc('vto_desk','A desk','hl_p_desk',()=>gySay("A desk with a few things on it: a pen worn to a stub, a dried inkwell, and an old wax seal that has been pressed and pressed until the picture has gone.",[BYE]));
khNpc('vto_desk2',"Maldrake's table",'hl_p_desk',()=>gySay("Maldrake's table. Tea in a cup, long cold. A child's toy cart with a missing wheel. A map of the Road, with a very tidy line drawn along it from here to the west, and a very tidy cross on Sale. And a pale silver key with a crown for a bow, lying on a folded cloth, as if it were being kept clean.",[BYE]));
khNpc('vto_shelf','A bookcase','hl_p_shelf',()=>gySay("A bookcase, full of books about herbs, bells, barrows and weather. A few are about the history of Underhill, a village of twelve households that was never very important, and every one of them has been read to pieces.",[BYE]));
khNpc('vto_shelf1','A bookcase with a red eye','hl_p_shelf',d=>{const F=vtF();
  if(F.secret)return gySay("The bookcase stands as before. One book is slightly out of line, and a door in the east wall of the study stands open, with a narrow stair beyond it.",[BYE]);
  return gySay("A bookcase of rotted volumes, and one book on the third shelf with a red eye painted on its spine. The eye is warm, and follows you a very little. The painting is not old.",[['Pull the red-eyed book.',()=>{F.secret=1;sfx('door');G.shake=.4;if(G.grid[LEVELS[9675]._vt.secret.y])G.grid[LEVELS[9675]._vt.secret.y][LEVELS[9675]._vt.secret.x]=0;msg('Somewhere in the east wall of the study, a stone door slides open.','#ffe36a');return gySay("The book tips forward like a lever, and a low grinding comes from the east wall. A stone door has opened there, and behind it a narrow stair goes down into the dark.",[BYE])}],['Leave it.',()=>null]])});
khNpc('vto_cage','An iron cage','hl_p_cage',()=>gySay("An iron cage, empty but for a tin cup and a rag. Somebody has scratched a calendar on the bars, and given up at nineteen.",[BYE]));
khNpc('vto_fenn','Private Tam Fenn, of the Oldhaven garrison','kh_ohsold1_1',()=>{const F=vtF(),g=!F.fennGift;
  const t=g?"A soldier is crouched in the corner of the cell with a sword across his knees. 'Quiet,' he whispers. 'Quiet. I am Private Fenn, of Hale's patrol. The sergeant sent six of us in, and I am the only one who got as far as this room, and that is only because I hid. The Warden at the bottom wears a pale key round his neck. And the passage before it has plates on the sides. Walk down the middle.' He presses a flask into your hand. 'It was my mother's. Please. Take it.'":"'Walk down the middle,' Fenn says. 'The passage to the Warden. Down the middle. And whatever you do, do not open the Ring in the wrong order. I did not do it myself. I heard about it.'";
  if(g){F.fennGift=1;if(!bagAdd(mkItem('potion6')))G.items.push({k:'potion6',x:G.P.x,y:G.P.y,taken:false})}
  return gySay(t,[BYE])});
khNpc('vto_sarc','A sarcophagus','gy_sarc',d=>gySay(VT_SARC[vtI(d)%VT_SARC.length],[BYE]));
khNpc('vto_altar','The altar of Underhill','gy_altar',()=>gySay("A plain altar of grey stone, with a bowl on it, and in the bowl a handful of grey earth from every grave in the village, mixed. It is the oldest thing here, and the only thing in the Vault that has not been touched by the silver.",[BYE]));
khNpc('vto_villager','A villager of Underhill','gy_zombie',d=>{const i=vtI(d),F=vtF();return gySay(F.freed?VT_VILLAGERS_FREE[i%12]:VT_VILLAGERS[i%12],[BYE])});
const VT_HOUSE=['Marl','Thatcher','Pelter','Bramble','Fenn','Cobb','Bright','Penn','Tanner','Reeve','Dunn','Lark'];
khNpc('vto_memorial','A candle for a household','gy_candles',d=>{const i=vtI(d),F=vtF();return gySay("A candle for the household of "+VT_HOUSE[i%12]+", in Underhill. "+(F.freed?"It has gone out, and nobody has relit it. It does not need to be.":"It has burned for three winters, and the wax has never run down. Beside it lies a small stone with the names of the household, scratched very carefully, one at a time."),[BYE])});
khNpc('vto_mirror','A tall mirror','hl_p_mirror',()=>gySay(vtF().freed?"A tall mirror, dark and still. Nothing looks out of it now.":"A tall standing mirror, dark as a pond. Two pale eyes look out of it from very deep. They are not yours. They look at you for a moment, in a polite and interested sort of way, and then go away.",[BYE]));
khNpc('vto_rune','The rune of the Ring','gy_rune',()=>{const F=vtF();return gySay(F.ringDone?"The rune in the middle of the Ring has gone dark. The eight coffins stand open round it, and the gate to the south is open.":"A tall stone with a pale rune on it, glowing. Under it, cut small: 'THE ORDER THEY WENT.' The eight coffins stand round it in a ring, and every lid has a name on it. "+(F.ring&&F.ring.length?F.ring.length+" of 8 are open.":"None are open."),[BYE])});
const VT_COFFIN_SAY=["Inside there is nothing but grey dust, and a coil of pale silver thread. The lid is light, and sinks back by itself when you let go.","The coffin is empty, and lined with a child's blanket that is not nearly old enough to be here.","The lid lifts. There is a spoon inside, and a lock of hair tied with blue wool.","Nothing in it but silver thread, and a wedding ring that fits nobody now.","Dust, a clay pipe, and a flat stone with the shape of a hand worn into it.","Inside, the dust has been smoothed very carefully, as if somebody had made a bed of it.","Only a rope, coiled, and a ferryman's brass whistle.","Dust, and a brass bell the size of a thumb. It does not make a sound."];
khNpc('vto_coffin','A coffin','hl_p_coffin',d=>{
  const i=vtI(d),F=vtF(),nm=VT_RING.names[i];F.ring=F.ring||[];
  if(F.ringDone)return gySay("The coffin of "+nm[0]+", "+nm[1]+". The lid is open. There is nothing in it.",[BYE]);
  if(F.ring.includes(i))return gySay("The coffin of "+nm[0]+" is open, and stays open. "+F.ring.length+" of 8.",[BYE]);
  return gySay("A coffin with a lid of black wood, and a brass plate: "+nm[0]+", "+nm[1]+". "+(F.ring.length?F.ring.length+" of 8 have been opened.":"Nothing has been opened yet."),[['Open the lid.',()=>vtCoffin(i)],['Leave it.',()=>null]])});
function vtCoffin(i){
  const F=vtF();F.ring=F.ring||[];const want=VT_RING.order[F.ring.length];
  if(i===want){F.ring.push(i);sfx('door');
    if(F.ring.length===8){F.ringDone=1;G.shake=.5;sfx('win');const V=LEVELS[9672]._vt;if(V.ringgate&&G.grid[V.ringgate.y])G.grid[V.ringgate.y][V.ringgate.x]=0;msg('The eighth lid lifts. The rune in the middle of the Ring goes out, and the Coffin Gate in the south wall rolls open.','#ffe36a');
      return gySay(VT_COFFIN_SAY[i]+" All eight lids stand open, in the order they went. The rune goes out. Far off, a heavy gate opens.",[BYE])}
    msg(F.ring.length+' of 8.','#c8d8a0');return gySay(VT_COFFIN_SAY[i]+" "+F.ring.length+" of 8.",[BYE])}
  F.ring=[];sfx('growl');G.shake=.5;msg('Wrong. Every lid slams shut, and something answers from inside.','#d09a80');
  const free=gyFreeAround({x:G.P.x,y:G.P.y},3);for(let n=0;n<2&&n<free.length;n++){addEnemy('gyghoul',free[n][0],free[n][1],true);const m=G.enemies[G.enemies.length-1];if(m){m.vtAdd=1;m.lvl=88}}
  return gySay("The lid lifts. That was not the right one. Every lid in the Ring slams shut at once, the rune flares, and two grey shapes climb out of the nearest coffins, not at all pleased to have been disturbed.",[BYE])}
khNpc('vto_bell','A bell','gy_bell',d=>{
  const i=vtI(d),F=vtF();F.bells=F.bells||[];
  if(F.bellsDone)return gySay(VT_BELLS.names[i]+" hangs quiet. The peal is done.",[BYE]);
  return gySay(VT_BELLS.names[i].toUpperCase()+". "+VT_BELLS.sub[i]+". "+(F.bells.length?F.bells.length+" of 5 rung in this peal.":"The rope is within reach."),[['Ring it.',()=>vtBell(i)],['Leave it.',()=>null]])});
function vtBellSound(i,vol){if(!AC||G.mute)return;const f=VT_BELLS.freq[i];tone(f,f*.997,2.8,'sine',.07*(vol||1),0);tone(f*2.4,f*2.39,1.9,'sine',.025*(vol||1),0);tone(f*4.1,f*4.1,1.1,'sine',.012*(vol||1),0);nz(.4,.006*(vol||1),'bandpass',1200,800,0)}
function vtBell(i){
  const F=vtF();F.bells=F.bells||[];const want=VT_BELLS.order[F.bells.length];
  vtBellSound(i,1);
  if(i===want){F.bells.push(i);msg('The bell rings. '+F.bells.length+' of 5.','#a8c8ff');
    if(F.bells.length===5){F.bellsDone=1;later(1800,()=>{vtLockSet('L2');G.shake=.4})
      return gySay("The Great Bell rings last, long and deep, and the whole gallery hums with it. Somewhere to the south, a pale-silver lock hears it.",[BYE])}
    return gySay("The bell rings, clear and true. "+F.bells.length+" of 5.",[BYE])}
  F.bells=[];if(AC&&!G.mute){for(const k of [0,1,2,3,4])tone(VT_BELLS.freq[k]*(1+k*.03),VT_BELLS.freq[k]*(1+k*.03),1.2,'sawtooth',.02,k*.05)}
  msg('Wrong. The bells jangle all at once, and the dead answer.','#d09a80');G.shake=.5;
  const free=gyFreeAround({x:G.P.x,y:G.P.y},3);for(const t of ['gyshade','gybanshee']){const f=free.shift();if(!f)break;addEnemy(t,f[0],f[1],true);const m=G.enemies[G.enemies.length-1];if(m){m.vtAdd=1;m.lvl=88}}
  return gySay("That was not the right bell. All five jangle together, a sour, scraping noise, and from the dark above the gallery something very thin begins to scream.",[BYE])}
khNpc('vto_sigilaltar','An altar of pale silver','gy_altar',d=>{
  const i=vtI(d),F=vtF();F.sig=F.sig||{};const where=["the Room of Needles","the Hounds' Den","the Silvered Hall"][i];
  if(F.sig[i]||F.locks.L3)return gySay("The altar in "+where+", empty. The sigil is gone.",[BYE]);
  return gySay("A low altar of pale silver, with a round seat cut in it, and in the seat a flat silver disc stamped with a small house and a well. The sigil of Underhill. It is cold.",[['Take the sigil.',()=>{F.sig[i]=1;bagAdd(mkItem('vtsigil'));sfx('key');msg('You take a Silver Sigil of Underhill ('+Object.keys(F.sig).length+' of 3).','#ffe36a');return gySay("You take the sigil. The altar goes dull.",[BYE])}],['Leave it.',()=>null]])});
khNpc('vto_contractdesk',"Maldrake's desk",'hl_p_desk',()=>{const F=vtF();
  if(F.contract||bagCount('vtcontract')||F.freed)return gySay("The desk is empty now. On the blotter, a clean square where the paper lay.",[BYE]);
  return gySay("A tidy desk. On the blotter, a single sheet of grey vellum, written in silver ink, and sealed with a small pale crown. It is the only thing in the Archive that is not covered in dust. It has been read many, many times.",[['Take the contract.',()=>{F.contract=1;bagAdd(mkItem('vtcontract'));sfx('key');msg('You take the Silver Contract.','#ffe36a');return gySay("You take the paper. It is light, and cold, and the last clause is underlined.",[BYE])}],['Leave it.',()=>null]])});
khNpc('vto_hesper','Hesper Maldrake','gy_ghost2',()=>{const F=vtF();
  const t=F.freed?"Hesper's light is very steady now. 'I felt it,' she says. 'The ring. All the way down here. Thank you. I will sit with him a while. I am not going anywhere. I am quite content.'":F.contract||bagCount('vtcontract')?"'You have it,' says the ghost of a woman with a plain, kind face. 'Good. Take it down to the Sanctum, and read it to him, every word. He cannot say it. The Sovereign saw to that. I could not carry it, you see. I am only a draught with opinions. I was his wife. I died in the spring before the silver came, and I have been in the Archive, keeping his accounts. Be gentle. Please. He was always the gentlest man I knew.'":"A ghost sits at the end of the room, in a plain grey dress, with a ledger on her knee. 'Oh,' she says. 'Somebody has come. I am Hesper Maldrake. I was his wife. I died in the spring before the silver came, and I have been in the Archive ever since, keeping his accounts, because he forgot how. There is a paper on the desk. It is the one that matters. Take it down to him. He cannot read it aloud. The Sovereign saw to that. But you can.'";
  return gySay(t,[BYE])});
/* ---------- Maldrake ---------- */
const VT_CONTRACT="THE CONTRACT OF SILVER. 'I, Wystan Maldrake, of Underhill, a hedge-wizard, receive from the Pale Sovereign, by the hand of the Pale Factor, silver for the mending of the people of my village. In return I give my art to the Sovereign's service for as long as any silver of this gift remains in any person of Underhill, living or dead. I will raise, keep and send out whom the Sovereign names. I will keep the Key of the Gate of Sale until it is sent for. I will not take off the ring.' It is signed in a farmer's careful hand. Under the signature, in much smaller writing: 'The debt is paid if, before a witness, the whole of this contract is read aloud to the signer, and the signer, hearing it, agrees that it is ended. The ring will then break.'";
khNpc('vto_maldrake','Wystan Maldrake','vti_maldrake',()=>vtMaldrakeTalk(),{});
function vtMaldrakeTalk(){
  const F=vtF();F.metM=1;
  const hasC=bagCount('vtcontract')>0,top=!F.talked;F.talked=1;
  const head=top?"A thin grey man sits at a table under a window of black glass, and does not look up. His hair has gone the colour of the silver on his finger. 'You have come through the locks,' he says. 'Then the Silver Warden is dead. I felt it here.' He touches the ring. 'I am Wystan Maldrake. I was the barrow-keeper of Underhill, and a hedge-wizard, and a husband, and I am very tired. Say what you have come for. I will try to listen before it turns.'":"Maldrake looks up from his hands. 'Yes?' he says. 'Say it quickly. The ring is warm.'";
  const opts=[];
  if(hasC)opts.push(["We have read your Silver Contract. Let us read it to you.",()=>vtReadContract(0)]);
  else if(vtPages()>=3||F.pages[7])opts.push(["We have read your journal. It said to bring the contract.",()=>gySay("He closes his eyes. 'The contract is in the Archive,' he says. 'Behind the red-eyed book, on the fifth floor, in my old study. It is the paper on the desk. I hid it from myself, so that I could not burn it, in case the ring needed it. Bring it. Please. I will hold the ring as long as I can. It will not be long.'",[BYE])]);
  opts.push(["Why did you do it?",()=>gySay("'For eighty-one people,' he says. 'You must understand that I did not know. A man in a grey coat came to the village in the autumn, very polite, and said there was silver that would cure the fever. We were burying one a day. I signed in a good light, with a steady hand, and I read the first clause and not the others, because I wanted to believe. The silver mended them, for a season. Then the fever took them anyway, and the silver stood them up again, and they looked at me.' He stops. 'They do not eat. They do not sleep. They sit. I cannot make them leave. And at midnight the ring turns, and I send them down the Road. I would do anything not to. I have tried. It turns my hand.'",[BYE])]);
  opts.push(["We have come for the Gate Key of Sale.",()=>vtKeyAsk()]);
  opts.push(['Leave.',()=>null]);
  return gySay(head,opts)}
function vtKeyAsk(){return gySay("'It is on the table,' he says. 'A key with a crown for a bow. The Sovereign gave it to me to keep, and said she would send for it.' He turns it on the cloth with one finger, and does not pick it up. 'I would give it to you in a moment. I cannot. The ring will not let me give it, not to anyone who is not hers. You would have to take it, and I would try not to hurt you, and I would fail. I am very sorry. I think you had better be quick, and I think you had better be sure.'",[["Then we will do it.",()=>{vtMaldrakeFight();return null}],["Not yet. There may be another way.",()=>null]])}
function vtReadContract(n){
  const parts=[
   ["You unfold the grey vellum and begin to read aloud. 'The Contract of Silver. I, Wystan Maldrake, of Underhill, a hedge-wizard, receive from the Pale Sovereign, by the hand of the Pale Factor, silver for the mending of the people of my village.' Maldrake has put both hands over his mouth. His shoulders shake. He nods, very slowly, to say go on.",'Go on.'],
   ["'In return I give my art to the Sovereign's service for as long as any silver of this gift remains in any person of Underhill, living or dead. I will raise, keep and send out whom the Sovereign names.' The silver ring is turning on his finger, round and round, slowly, as if it were listening. 'I did not read that part,' he whispers. 'I did not read that part.'",'Go on.'],
   ["'I will keep the Key of the Gate of Sale until it is sent for. I will not take off the ring.' He is crying, quietly, without any fuss, like a man who has cried for three winters and is very practised. 'Yes,' he says. 'Yes. That is what I wrote. Is there more?'",'Go on.'],
   ["'The debt is paid if, before a witness, the whole of this contract is read aloud to the signer, and the signer, hearing it, agrees that it is ended.' You look up. 'The ring will then break.'",'Ask him.']];
  if(n<parts.length)return gySay(parts[n][0],[[parts[n][1],()=>vtReadContract(n+1)]]);
  return gySay("'I agree,' says Wystan Maldrake. His voice is clear and steady, for the first time since you came in. 'I have heard it, every word, and I agree that it is ended. It is ended. Let it be ended.'",[['Break the ring.',()=>{vtMaldrakeFree();return null}]])}
function vtMaldrakeFree(){
  const F=vtF();if(F.freed)return;F.freed=1;F.gotKey=1;F.fight=F.fight||0;G.talk=null;bagRemove('vtcontract',1);
  if(AC&&!G.mute){tone(880,220,1.4,'sine',.08,0);tone(1320,330,1.2,'sine',.04,.1);nz(.8,.01,'bandpass',2000,400,0)}
  G.shake=.6;msg('The silver ring breaks across, with a sound like a dropped glass. Far above you, a bell stops.','#cfe0ff');sfx('win');
  for(const it of ['vtgatekey','vtring2','vtbroken'])if(!bagAdd(mkItem(it)))G.items.push({k:it,x:G.P.x,y:G.P.y,taken:false});
  for(const it of ['potion6','potion6','supermana','supermana','elixir'])if(!bagAdd(mkItem(it)))G.items.push({k:it,x:G.P.x,y:G.P.y,taken:false});
  try{for(const h of G.heroes){h.learned=h.learned||[];if(!h.learned.includes('vtquiet'))h.learned.push('vtquiet')}msg('Maldrake teaches the party Quiet the Dead. It joins the power page of every hero.','#ffe9a0')}catch(e){console.error(e)}
  G.gold+=10000;giveXP(60000);msg('You have the Gate Key of Sale, and 10,000 gold.','#ffe36a');
  vtMaldrakeVanish();
  later(1200,()=>{G.talk={d:{k:'vti_maldrake',x:G.P.x,y:G.P.y,npc:'vto_maldrake'},n:{name:'Wystan Maldrake',root:()=>null},node:say("Maldrake takes a long breath, the first long breath he has taken in three winters. 'Thank you,' he says. 'Take the key. It was never mine to keep. I have made you a ring from the silver, and given you the one spell I learned in all this time that is any good: the words that let the dead lie down. Use them kindly. And go and tell Hale that the bell will not ring again.' He sits down at his table with his hands open on the cloth, and the window of black glass behind him goes, very slowly, clear. 'I can see the hill,' he says. 'I can see it. It is rather nice.' He does not say anything more.",[['Leave him in peace.',()=>{vtMaldrakeVanish();return null}]]),t:G.time,btns:[]}})}
/* ---------- the story pages, what to do next, the arrival of a level ---------- */
STORY.push(
 {id:'vthill',c:()=>vtF().reach&&vtF().reach[9670],t:'The Barrow Hill',x:'Past the toll house and the farm and the hollow church, the Blighted Road came to a hill of barrows, and a garrison picket at its foot. Sergeant Hale of Oldhaven told the party that the dead of the village of Underhill walk down off this hill every night, west along the Road, and come back by dawn. At the top of the hill a door leads into the Vault of Maldrake.'},
 {id:'vtvault',c:()=>vtF().reach&&vtF().reach[9671],t:'Into the Vault',x:'The party went down the Barrow Stair into the Vault: a crypt of six floors, closed with five locks of pale silver, kept by the old barrow guard. The Barrow Warden wore the first key.'},
 {id:'vtroll',c:()=>vtF().pages&&vtF().pages[0],t:'The Roll of Underhill',x:'On the second floor the party read the Roll of Underhill, which lists the eight villagers the grey fever took first, in the order they died. Eight coffins stand in a ring round a rune, and open only in that order.'},
 {id:'vtpeal',c:()=>vtF().bellsDone,t:'The Peal of Underhill',x:'The party rang the five bells of the Bell Gallery in the order of the old parish rule: the child, the widow, the miller, the priest, and last the Great Bell. The second lock opened.'},
 {id:'vtletters',c:()=>vtF().pages&&vtF().pages[4],t:'The Pale Factor',x:'In the cellars the party found the letters of the Pale Factor, the agent of the Pale Sovereign. He offered the village of Underhill silver that would mend the grey fever, in return for a small service. The service was the walking of the dead down the Blighted Road.'},
 {id:'vtjournal',c:()=>vtPages()>=4,t:'What Maldrake Wrote',x:'The journal of Wystan Maldrake, the hedge-wizard who kept the barrows, tells how the silver did not mend his village but stood it up again after it died. He sealed himself under the hill behind locks of pale silver so that he could do no more harm, and wrote that he hoped somebody would come who had read this far.'},
 {id:'vtmal',c:()=>vtF().reach&&vtF().reach[9677],t:'Wystan Maldrake',x:'In the Sanctum under the hill sits Wystan Maldrake, thin and grey, with a ring of pale silver he cannot take off. He kept the Gate Key of Sale for the Pale Sovereign. He is not a cruel man. He is a man who signed a paper.'},
 {id:'vtfree',c:()=>vtF().freed,t:'A Quiet Hill',x:'The party read the Silver Contract aloud to Maldrake, every clause, and he agreed that it was ended. The ring broke, and the bell on the hill stopped. He gave the party the Gate Key of Sale, a ring of the quiet silver, and the spell that lets the dead lie down, and sat at his table and watched the hill clear.'},
 {id:'vtkill',c:()=>vtF().dead,t:'The Key from the Barrow',x:'The party fought Wystan Maldrake in his Sanctum and killed him. He thanked them. The Gate Key of Sale came from his coat. The ring on his hand did not stop, and the dead of Underhill still walk.'});
{const _sn=storyNext;storyNext=function(){const F=G.flags,V=F.vt;
  if(V&&(V.reach||V.pages)&&!(F.vtDone)){
    if(qSt('bl7e')==='done')return 'The Vault of Maldrake is done. The key of the gate of Sale is yours. Go west along the Blighted Road.';
    if(V.gotKey||bagCount('vtgatekey'))return 'Take the Gate Key of Sale back to Sergeant Hale at the garrison picket at the foot of the Barrow Hill.';
    if(qSt('bl7d')==='active'||qSt('bl7e')==='active'||V.reach&&V.reach[9676])return V.contract||bagCount('vtcontract')?"Go down to Maldrake's Sanctum, below the sixth floor, and read him the Silver Contract aloud.":"Take the Sanctum Seal from the Silver Warden on the sixth floor, go down to Maldrake's Sanctum and take the Gate Key of Sale from him. For a kinder end, find the Silver Contract in the Secret Archive (the red-eyed book, in the old study on the fifth floor).";
    if(qSt('bl7c')==='active'||qSt('bl7b')==='active'||qSt('bl7a')==='done')return 'Go down through the Vault of Maldrake: the Barrow Warden holds the first key, the Roll of Underhill opens the Ring of Coffins, the five bells open the second lock, three sigils the third, and the Silver Warden holds the last seal.'}
  if(qSt('bl7a')==='active')return 'Kill 8 of the dead on the Barrow Hill, and talk to Sergeant Hale at the garrison picket again.';
  if(V&&V.reach&&V.reach[9670]&&qSt('bl7a')===null)return 'Speak to Sergeant Hale at the garrison picket at the foot of the Barrow Hill.';
  return _sn.apply(this,arguments)}}
/* what happens when a floor is entered (also after a saved game): the first words of each place, the reach flags, the state of the sanctum */
const VT_FIRST={9670:'The Barrow Hill. Level 88. A grey-green mist, dead grass, and a bell tolling for nobody.',9671:'The Barrow Stair. Level 88. Candles, old stone, and something that stands guard.',9672:'The Ossuary of the Roll. Level 88. Eight coffins in a ring, and a lectern with a book.',9673:'The Bell Gallery. Level 88. Five bells hang over the hall.',9674:'The Silvered Cellars. Level 89. The air is cold, and the walls shine faintly.',9675:'The Hall of Underhill. Level 89. A long table has been laid for supper, and it is full.',9676:'The Stair of Quiet. Level 89. The last way down.',9677:"Maldrake's Sanctum. Level 89. Twelve candles, a table, and one man.",9678:'The Secret Archive. Level 89. Books, dust, and one clean desk.'};
function vtArrive(n){
  const F=vtF();F.reach=F.reach||{};const first=!F.reach[n];F.reach[n]=1;if(first)msg(VT_FIRST[n],'#cfd8c0');
  if(n===9677)vtSanctumState();
  if(LEVEL===9677&&first&&!F.freed&&!F.fight)later(800,()=>msg('A man at a table looks up, and then looks away again, as if he were used to being disappointed.','#cfe0ff'))}
/* ---------- the rings on the maps (the quest log's circles) ---------- */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx}),X=(l,x,y)=>({lvl:l,xy:[x,y]}),F=(l,fn)=>({lvl:l,fn});
  const books=l=>F(l,()=>{const L=LEVELS[l],V=vtF(),o=[];if(L)for(const d of L.decor)if(d.npc==='vto_book'&&!V.pages[d.i]&&d.i>=1&&d.i<=6)o.push({x:d.x,y:d.y});return o});
  QRF.T.bl7a={give:[N(9670,'vto_hale')],act:[E(9670,/^gy(skel|ghoul|zombie|wraith|hound|raven|pike|bmage)$/)],ready:[N(9670,'vto_hale')]};
  QRF.T.bl7b={give:[N(9670,'vto_hale')],act:()=>{const V=vtF();return !V.locks.L1?[E(9671,/^vtwarden$/),X(9671,14,25),X(9670,34,12)]:!V.ringDone?[N(9672,'vto_rune')]:[N(9673,'vto_bell')]}};
  QRF.T.bl7c={give:[N(9670,'vto_hale')],act:()=>[books(9671),books(9672),books(9673),books(9674),books(9675),books(9676)]};
  QRF.T.bl7d={give:[N(9670,'vto_hale')],act:()=>{const V=vtF();return !V.locks.L3?[N(9674,'vto_sigilaltar')]:!V.locks.L4?[E(9676,/^vtsilver$/),X(9676,14,33)]:[N(9677,'vto_maldrake')]}};
  QRF.T.bl7e={give:[N(9670,'vto_hale')],act:[N(9677,'vto_maldrake')],ready:[N(9670,'vto_hale')]}}
/* ---------- the parchment maps (one drawing for the hill and the floors) ---------- */
const VTMP={ground:{'0':'#b8b58f','1':'#b9a07c','2':'#c9c2ae','3':'#bdb8ae','4':'#d0c6a8','5':'#8c919c'},ink:'#241812'};
function vtMapDraw(c,x,L,api){
  const R=L.rows,W=R[0].length,H=R.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,PX=F.ox,PY=F.oy,PW=W*s,PH=H*s,INK=MPL.INK,hill=LEVEL===9670;
  const wall=(cx,cy)=>!(R[cy]&&R[cy][cx]==='.'),col=(cx,cy)=>{const g=L.chars[R[cy][cx]],q=GY.col&&GY.col[g];return q||[110,108,104]};
  x.save();x.shadowColor='rgba(40,30,10,.5)';x.shadowBlur=14;x.shadowOffsetX=3;x.shadowOffsetY=5;x.fillStyle='#2a2418';x.fillRect(PX-1.6,PY-1.6,PW+3.2,PH+3.2);x.restore();
  x.save();x.beginPath();x.rect(PX,PY,PW,PH);x.clip();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
    if(wall(cx,cy)){const k=col(cx,cy),v=hash2(cx,cy,5)*12-6;x.fillStyle=`rgb(${Math.max(0,Math.min(255,k[0]*.8+v))|0},${Math.max(0,Math.min(255,k[1]*.8+v))|0},${Math.max(0,Math.min(255,k[2]*.8+v))|0})`}
    else{const f=L.fmap[cy][cx];x.fillStyle=VTMP.ground[f]||'#cfc8b6'}
    x.fillRect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2)}
  x.strokeStyle=VTMP.ink;x.lineWidth=hill?.5:.7;x.lineCap='round';x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    if(wall(cx,cy-1)){x.moveTo(X0,Y0);x.lineTo(X0+s,Y0)}if(wall(cx,cy+1)){x.moveTo(X0,Y0+s);x.lineTo(X0+s,Y0+s)}if(wall(cx-1,cy)){x.moveTo(X0,Y0);x.lineTo(X0,Y0+s)}if(wall(cx+1,cy)){x.moveTo(X0+s,Y0);x.lineTo(X0+s,Y0+s)}}
  x.stroke();
  const D=(G.decor&&G.decor.length&&vtIs(LEVEL)?G.decor:L.decor).slice().sort((a,b)=>a.y-b.y);
  const BIG=/^(gy_(chapel|hut|angel|altar|sarc|candles|lych|obelisk|column|ccross|tomb|urn|chest|lever|mound|barrow|hatch|bell)|hl_p_(coffin|lectern|desk|cage|shelf)|yar_tent|wm_bell|cart)$/;
  for(const d of D){if(d.found||d.hidden)continue;const k=d.k||'';
    if(BIG.test(k)&&IMG[k]){const im=IMG[k],big=/chapel|hut|tent|hatch/.test(k),hh=Math.max(2.4,Math.min(big?14:8,(NPC_H[k]||1)*s*(d.sc||1)*(big?1.5:1.3))),ww=hh*im.width/im.height;x.drawImage(im,X(d.x+.5)-ww/2,Y(d.y+1)-hh+s*.3,ww,hh)}
    else if(hill&&/^gy_(stone1|stone2|lean|slab|wcross|rpost)$/.test(k)){x.fillStyle='#7a766c';x.strokeStyle=VTMP.ink;x.lineWidth=.25;x.fillRect(X(d.x+.2),Y(d.y+.1),s*.6,s*.8);x.strokeRect(X(d.x+.2),Y(d.y+.1),s*.6,s*.8)}
    else if(/^gy_lantern$/.test(k)){x.fillStyle='#d8d0a0';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),s*.4,0,6.3);x.fill()}
    else if(hill&&/^(dead|ltree2|gy_dead)$/.test(k)){x.fillStyle='#4a4238';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),s*.34,0,6.3);x.fill()}}
  const tint=L._vt&&L._vt.torch;
  if(tint){x.fillStyle=tint.css;x.strokeStyle=VTMP.ink;x.lineWidth=.3;for(const t of (L._vt.torches||[])){const dx=GYM_D[t[2]][0],dy=GYM_D[t[2]][1];x.beginPath();x.arc(X(t[0]+.5+dx*.6),Y(t[1]+.5+dy*.6),Math.max(1,s*.34),0,6.3);x.fill();x.stroke()}}
  // the pale-silver locks and the stairs
  for(const [k,gid] of Object.entries(L.chars)){const dd=KH_DOOR[gid];if(!dd)continue;for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)if(R[cy][cx]===k){
    x.fillStyle=dd.vt==='lock'?'#d8e4f8':dd.vt==='stair'||dd.vt==='road'?'#e8c860':'#a0a0a0';x.strokeStyle=VTMP.ink;x.lineWidth=.4;if(dd.vt==='secret')continue;x.beginPath();x.arc(X(cx+.5),Y(cy+.5),Math.max(1.4,s*.5),0,6.3);x.fill();x.stroke()}}
  x.restore();
  const names=L.mapNames||[];
  names.forEach((n,i)=>{const px=X(n.x+.5),py=Y(n.y+.5);x.save();x.fillStyle='rgba(250,240,200,.92)';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(px,py,3.6,0,6.3);x.fill();x.stroke();x.restore();api.text(x,String(i+1),px,py+.2,5.4,INK)});
  api.title(x,VT.NAMES[LEVEL]||'The Vault of Maldrake','',12,5);
  api.compass(x,50,262,15);
  {const a=392,b=40,w=84,lh=10.4,h=14+names.length*lh;api.panel(x,a,b,w,h);api.text(x,'Places',a+w/2,b+8,6.6,'#6a1a0e');
    names.forEach((n,i)=>{api.text(x,(i+1)+'  '+n.t.replace(/^The /,''),a+5,b+17+i*lh,5.2,INK,'left')})}
  {const a=6,b=46,w=84,rowsK=hill?[['Dead grass',VTMP.ground['0']],['Road',VTMP.ground['4']],['Path',VTMP.ground['2']],['Terrace',VTMP.ground['3']]]:[['Floor',VTMP.ground['3']],['Wall',(()=>{const k=col(0,0);return `rgb(${k[0]*.8|0},${k[1]*.8|0},${k[2]*.8|0})`})()],['Pale lock','#d8e4f8'],['Stair','#e8c860']],h=14+rowsK.length*13;
    api.panel(x,a,b,w,h);api.text(x,'Key',a+w/2,b+8,6.6,'#6a1a0e');
    rowsK.forEach(([t,cc],i)=>{x.fillStyle=cc;x.strokeStyle=INK;x.lineWidth=.5;x.fillRect(a+6,b+16+i*13,10,6);x.strokeRect(a+6,b+16+i*13,10,6);api.text(x,t,a+22,b+19+i*13,6,INK,'left')})}}
mplInstall({name:'vault',levels:[9670,9671,9672,9673,9674,9675,9676,9677,9678],draw:vtMapDraw,tint:[2,6,0],foot:'You are the yellow arrow. The numbers on the map are listed on the right.'});
/* the Go to area list */
{const _gl=gotoListRaw;gotoListRaw=function(){const out=_gl.apply(this,arguments);
  try{if(!out.some(r=>r.n===VT.ID)){out.push({h:'The Vault of Maldrake, on the Blighted Road'});for(let n=VT.ID;n<=VT.LAST;n++)out.push({n,name:VT.NAMES[n]})}}catch(e){console.error(e)}
  return out}}
/* ---------- the test links: ?town=vault&lvl=88 (the picket at the foot of the hill; add &q=1..5 for the quests, &pages=1, &contract=1, &open=1 for every lock open), ?town=vaultboss&lvl=89 (the sanctum, every lock open) ---------- */
function vtSpot(w){return w==='vaultboss'?[9677,12,20,0]:[9670,30,44,0]}
{const _j=jumpFromUrl;jumpFromUrl=function(){
  const q=new URLSearchParams(location.search),town=(q.get('town')||'').toLowerCase().replace(/[^a-z]/g,'');
  if(town!=='vault'&&town!=='vaultboss'&&town!=='vaultarchive')return _j.apply(this,arguments);
  const orig=location.pathname+location.search+location.hash,target=Math.max(1,Math.min(95,parseInt(q.get('lvl')||'88',10)||88));
  q.set('town','ironhill');q.set('lvl','40');
  try{history.replaceState(null,'',location.pathname+'?'+q.toString()+location.hash)}catch(e){}
  try{_j.apply(this,arguments)}finally{try{history.replaceState(null,'',orig)}catch(e){}}
  G.heroes.forEach((h,i)=>{while(h.lvl<target){h.xp=xpNeed(h.lvl);levelUp(i)}h.alive=true;h.hp=h.max;h.mp=h.mpMax;h.food=Math.max(h.food||0,100)});
  if(q.get('gear')!=='0')try{giveJumpGear(target)}catch(e){console.error(e)}
  const F=vtF(),Q=(town==='vaultboss'||town==='vaultarchive')?Math.max(3,parseInt(q.get('q')||'0',10)||0):(parseInt(q.get('q')||'0',10)||0);   // the sanctum and the archive come with the way open and the quests under way
  if(Q>=1){qAccept('bl7a');G.flags.vtMet=1;G.flags.vtHill=8;qTurnIn('bl7a')}     // qTurnIn starts bl7b by itself
  if(q.get('open')||town==='vaultboss'||Q>=3){for(const k of ['L1','L2','L3','L4'])F.locks[k]=1;F.ringDone=1;F.bellsDone=1;F.secret=1}
  if(q.get('pages')||Q>=3){for(let i=0;i<=6;i++){F.pages[i]=1;if(i>=1&&!bagCount('vtpg'+i))bagAdd(mkItem('vtpg'+i))}}
  if(q.get('contract')||town==='vaultarchive'){F.pages[7]=1;if(!bagCount('vtcontract'))bagAdd(mkItem('vtcontract'));F.contract=1}
  if(q.get('keys')){for(const id of ['vtkey1','vtseal'])bagAdd(mkItem(id));for(let i=0;i<3;i++)bagAdd(mkItem('vtsigil'))}
  let [id,x0,y0,f0]=vtSpot(town==='vaultarchive'?'vault':town);
  if(town==='vaultarchive'){id=9678}
  const go=()=>{vtMake&&0;const L=LEVELS[id]||(KH_LAZY[id]&&(KH_LAZY[id](),LEVELS[id]));let at={x:x0,y:y0,f:f0};if(town==='vaultarchive'){at={x:L.start.x,y:L.start.y,f:L.start.f}}
    goToLevel(id,at);G.state='play';G.menu=false;msg('Your party stands at '+VT.NAMES[id]+', at level '+target+'.','#ffe36a')};
  G.state='play';G.menu=false;if(VT.ready)go();else vtLoad().then(go)}}
