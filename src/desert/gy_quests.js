/* ==========================================================================
   LADY ALDITH AND HER FIVE QUESTS (prefix gy / GYQ). The ghost in the crypt (level 531) tells her story piece by piece and sends the party into the four mazes in turn
   (the order is only the order she tells it in; the mazes can be done in any order, and the relics wait in the bag until she asks for them):
   gyq1 The Wedding Ring (Red Ossuary, key, Lord Corwin Vane), gyq2 The Name-stone (Grey Charnel, three levers, Digger Grimsby), gyq3 The Locket (Black Barrow, a hunt of eight spirits, Sir Aldric),
   gyq4 The Book of Rest (Pale Catacombs, a trapped chest, Prioress Morwenna), gyq5 A Place to Rest (the grave in the graveyard: the ending).
   The people and things of the graveyard talk here too. Rewards are for a level 84 party (every quest pays double, see QREW_MUL); the mazes pay a little more each.
   All the writing is plain and warm. Jokes in the epitaphs and the ghost's talk are the writer's, to be replaced freely.
   ========================================================================== */
QAREA_ORDER.splice(Math.max(0,QAREA_ORDER.indexOf('Wenlock'))+1,0,'Wenlock Graveyard');
const GY_REW={gyq1:{gold:1800,xp:5000,items:['potion6','supermana']},gyq2:{gold:2000,xp:5500,items:['potion6','potion6']},gyq3:{gold:2200,xp:6000,items:['supermana','elixir']},gyq4:{gold:2500,xp:6500,items:['elixir','supermana']},
  gyq5:{gold:12000,xp:12000,items:['gylantern','gysword','gyring2','gyrose','elixir']}};
function gyQuest(id,title,who,steps,reward){
  const q={title,who,need:steps.length,goal:()=>steps.reduce((n,s)=>n+(s[1]()?1:0),0),reward};
  Object.defineProperty(q,'desc',{enumerable:true,configurable:true,get(){const s=steps.find(s=>!s[1]());return s?(typeof s[0]==='function'?s[0]():s[0]):'Go back to '+who.split(',')[0]+'. All is done.'}});
  Object.defineProperty(q,'targets',{enumerable:false,configurable:true,get(){const s=steps.find(s=>!s[1]());return s?(s[2]||[]):[]}});
  QUESTS[id]=q;QAREA[id]='Wenlock Graveyard';return q}
const gyD=k=>()=>!!gyF().dead[k];
gyQuest('gyq1','The Wedding Ring','Lady Aldith, in the crypt',[
  ["Find the Warden's Iron Key in a chest in the Warden's Cell, deep in the Red Ossuary (the mossy iron gate, north east of the tomb).",()=>{const F=gyF();return !!(F.key||F.dead[0])},['gyo_door0','gyo_keychest']],
  ["Open the iron door at the far end of the Red Ossuary, and take Lady Aldith's ring from Lord Corwin Vane.",gyD(0),['gyo_door0']]],GY_REW.gyq1);
gyQuest('gyq2','The Name-stone','Lady Aldith, in the crypt',[
  ["Pull the three levers of the Grey Charnel in the order the stone in the first room asks for (the sunken stair, south east of the tomb).",()=>{const F=gyF();return !!(F.lev||F.dead[1])},['gyo_door1','gyo_lever','gyo_riddle']],
  ["Go through the open gate, and take Lady Aldith's name-stone from Digger Grimsby.",gyD(1),['gyo_door1']]],GY_REW.gyq2);
gyQuest('gyq3','The Locket','Lady Aldith, in the crypt',[
  [()=>"Put eight restless spirits of the Black Barrow to rest ("+Math.min(8,gyF().k3|0)+" of 8), so that the sealed door will open (the stone archway, south west of the tomb).",()=>(gyF().k3|0)>=8||!!gyF().dead[2],['gyo_door2']],
  ["Go through the door, and take Sir Edmund's locket from Sir Aldric the Forsworn.",gyD(2),['gyo_door2']]],GY_REW.gyq3);
gyQuest('gyq4','The Book of Rest','Lady Aldith, in the crypt',[
  ["Find the Prioress's seal in the trapped chest in the Reliquary of the Pale Catacombs (the trapdoor, north west of the tomb).",()=>{const F=gyF();return !!(F.seal||F.dead[3])},['gyo_door3','gyo_trapchest']],
  ["Open the Prioress's sealed door, and take the Book of Rest from Prioress Morwenna.",gyD(3),['gyo_door3']]],GY_REW.gyq4);
gyQuest('gyq5','A Place to Rest','Lady Aldith, in the crypt',[
  ["Take the name-stone, the ring, the locket and the book to Lady Aldith's grave, in the family plot south of the tomb, and read the page that is marked.",()=>!!gyF().peace,['gyo_grave']]],GY_REW.gyq5);
Object.defineProperty(QGIVER,'gyo_ghost',{enumerable:true,configurable:true,get(){return gyF().peace?null:['gyq1','gyq2','gyq3','gyq4','gyq5']}});
/* ---- what Lady Aldith says ---- */
const GYQ_D=[
 khQD("Oh. You can see me. Please do not run. They usually run, and it is so hard on my confidence. I am Aldith Wenlock, and this crypt was my husband's family's long before it was anybody's cellar. I have been here for three hundred years, because I forgot how to leave, and because four small things were never put right. I would so like to rest. I am told it is quite lovely, and that nobody asks you to be anywhere on time. The first thing is my ring. Lord Corwin Vane took it off my finger as I was dying. He said he would look after it. He has looked after it all the way down into the Red Ossuary, under the mossy iron gate in the north east corner of the graveyard, and he is still sitting on it. The skeletons down there are very rude, and the iron door at the far end is locked. I am sorry. It is a great deal to ask of strangers.",
  "Thank you. Truly. I would offer you tea, but I am not equipped for it. The Red Ossuary is under the mossy iron gate, north east of the tomb. Mind the dead, and mind your feet. I did.",
  (n,m)=>"The ring is with Lord Corwin Vane, at the far end of the Red Ossuary. There is a key to find first. The Warden was the careful sort, and kept it in a chest in his cell.",
  "You have it. I can feel it, like a draught from a door I had forgotten was there. May I see?",
  "It is so much smaller than I remember. Or I have got larger, and I am fairly sure it is the other thing. Thank you. Would you keep it for me? I cannot hold it, and it should not go back into the dark. Now you will want to know why he took it. Corwin Vane wanted my husband's land. Edmund went to the wars and never came home, and Vane came calling every week with a new hat. When I would not marry him, he told the village that I had stolen the church silver. I had not. I should have noticed. Speak to me again, when you can bear it. There is a second thing.",
  "The ring is found, and I am a good deal lighter.","Here is your ring."),
 khQD("I died that same winter, of a cold, in a house with a bad roof and no visitors, which tells you what the village thought of me by then. Vane had one thing more to do. He paid the gravedigger, a man called Grimsby, to take the name-stone from my grave, so that nobody would know where to put flowers, or a prayer. It worked rather too well. My own grave has been nameless for three hundred years, and people walk across it. Grimsby went down into the Grey Charnel, by the sunken stair in the south east, and took the stone with him, and he never came up. He is very good at digging, and I would not like to say what he has been digging since. Would you bring my name back?",
  "Bless you. The Grey Charnel is under the sunken stair, south east of the tomb. It is cold down there, and it smells, and the people in it are not at their best.",
  (n,m)=>"Grimsby has my name-stone, at the end of the Grey Charnel. There is a gate down there with no lock, and three levers somewhere. He was a tidy man, in his way.",
  "That is it. I know it by the leaves round the edge. Please, may I look?",
  "A little stone, with room for one word. I had stopped hoping to see anything with my name on it. It will go on my grave, if you do not mind carrying it. Now. Edmund. I have never told anyone how he died, because nobody has asked in three hundred years, and the dead are not asked much. He did not die in a battle. He died holding a bridge, so that his friend could cross. The friend was Sir Aldric. Come back to me when you are ready, and I shall tell you the rest.",
  "My name is safe, and that is the nicest thing anybody has said to me in a very long while.","Here is your name-stone."),
 khQD("Sir Aldric loved Edmund like a brother, and he had sworn, on his honour, to carry Edmund's locket home to me. There are two curls of hair in it, his and mine, tied with the same thread. And Aldric could not do it. He could not stand in my doorway and say, he is dead, and it is on my account, and I am alive. So he kept the locket, and he did not come, and the shame is a very heavy thing to carry for three hundred years. He is in the Black Barrow now, under the stone archway in the south west, with a great many of the dead who could not leave. The Barrow will not let you in to him until the restless ones in it have been quietened. Eight of them, I think. Please be kind to him. He was a good man who did not know how to say a hard thing.",
  "Thank you. The Black Barrow is under the stone archway, south west of the tomb. It is very cold, and it is full of people who are sorry. Be gentle where you can, and quick where you must.",
  (n,m)=>"Sir Aldric has the locket, in the Black Barrow. The way to him is sealed with grief, and will open when eight of the restless dead have been quietened.",
  "You have been to the Barrow. I can tell. It follows you about, a little, like a cold. Is it there? May I see it?",
  "Oh, Edmund. Your hair was always so unreasonable. It will not lie down even now. ... Thank you. Tell Aldric, if he is anywhere to be told, that I forgave him long ago. I do not suppose it is the sort of thing that is much use afterwards, but it is true. One more. This is the one that is truly mine.",
  "I have his locket, and I have my ring, and the stone is on the way. I am almost too happy to be dead.","Here is the locket."),
 khQD("I must tell you the plain thing. I am buried the wrong way. Nobody read the service over me. The prioress of the old convent, Mother Morwenna, was paid by Vane to say that a thief does not deserve one, and she shut the book, and rang her bell, and went home. Without the words I cannot go, not truly, however many things you bring me. She took the book down into the Pale Catacombs, by the trapdoor in the north west corner of the graveyard, and she has been ringing that bell ever since. She is the worst of them. Vane was only greedy. She knew. She keeps her chapel behind a sealed door, and the seal in a chest that she has trapped. Please come back in one piece. The Catacombs are full of rats, and the dead are sharper there.",
  "Thank you. The Pale Catacombs are under the trapdoor, north west of the tomb. If you hear a bell, that is her. Do not follow it, until you are ready to.",
  (n,m)=>"The Prioress has the book, at the end of the Pale Catacombs. Her seal is in a trapped chest in the reliquary, and her door will not open without it.",
  "You have the book. And all of you look as if you have been through a very large and unpleasant hedge. Is the page marked?",
  "The page is marked. I have heard the first line so many times through the stone. 'Go gently, and go home.' It is not much, is it? It is only a few words. I had not realised it was only a few words. Now there is the last thing, and it is the easiest, and the hardest.",
  "I have the words, at last. I cannot tell you what that is like.","Here is the book."),
 khQD("Please take them to my grave. It is in the family plot, south of the tomb, beside Edmund's stone. It is the one with no name, and I am sorry about the moss. Lay the name-stone on it, put my ring and Edmund's locket on top, and read the page that is marked. That is all. I shall come, I think. I have never been to my own funeral, and I would like to see how it goes.",
  "Thank you. The plot is south of the tomb, with the little iron fence. I shall be there. I have been told I am always late, but that was when I was alive.",
  (n,m)=>"Lay the name-stone, the ring and the locket on my grave, and read the marked page. It is south of the tomb, beside Edmund's stone.",
  "It is done, and I am all light.","","Peace, at last.","")];
/* the ghost herself: the first quest not yet done (they come one after the other), and otherwise a few kind words */
khNpc('gyo_ghost','Lady Aldith','gyi_ghost0',d=>{const F=gyF();F.met=1;
  const ids=['gyq1','gyq2','gyq3','gyq4','gyq5'];
  for(let i=0;i<5;i++)if(qSt(ids[i])!=='done')return qNode(ids[i],GYQ_D[i]);
  return say("I am only the memory of a light, now. Go well.",[BYE])},{sc:1.05});
/* ---- the graveyard: the stones, the doors, the tomb ---- */
const gyI=d=>{const L=LEVELS[LEVEL],q=L&&L.decor.find(z=>z.x===d.x&&z.y===d.y&&z.npc===d.npc);return q&&q.i!==undefined?q.i:(d.i||0)};   // the game keeps only a few fields of a piece of scenery, so its number is looked up by square
khNpc('gyo_stone','A weathered stone','gy_stone1',d=>{const e=GY_EPI[gyI(d)%GY_EPI.length];return say(e[0]+'. '+e[1],[BYE])});
const GY_DOORT=[
 ["A tall wrought-iron gate, furred with moss and ajar by exactly one person's width. Brick steps go down behind it, and the air that comes up smells of old pennies and red brick dust. THE RED OSSUARY. Skeletons. (Level 84.)",'Go down the steps.'],
 ["A sunken stair, with a dark stone arch and wet steps going down into the earth. The air from it is cold and green. THE GREY CHARNEL. Ghouls, zombies and worse. (Level 85.)",'Go down the stair.'],
 ["A stone archway, plain and old, with a skull for a keystone, and nothing behind it but the dark. The dark is very black. THE BLACK BARROW. Wraiths and shades. (Level 86.)",'Go through the archway.'],
 ["A wooden trapdoor in a grassy hump, iron-bound, with two rings for handles. Somebody has painted NO on it, and somebody else has painted over the NO with YES, and then somebody else has painted NO again. THE PALE CATACOMBS. Rats, bone hounds, and a bell. (Level 87.)",'Open the trapdoor.']];
for(let k=0;k<4;k++)khNpc('gyo_door'+k,['The mossy iron gate','The sunken stair','The stone archway','The trapdoor'][k],['gy_igate2','gy_stair','gy_arch','gy_hatch2'][k],d=>{
  const F=gyF(),done=F.dead[k];
  return say(GY_DOORT[k][0]+(done?" The enemy of Lady Aldith is dead, and the place is quiet, though not empty.":""),[[GY_DOORT[k][1],()=>{G.talk=null;sfx('door');const id=GY.M[k];if(!LEVELS[id]&&KH_LAZY[id])KH_LAZY[id]();const st=LEVELS[id].start;goToLevel(id,{x:st.x,y:st.y,f:st.f});return null}],['Not yet.',()=>null]])});
// the dialogues call gyo_door for decor made with the generic id; the yard uses gyo_door with i
khNpc('gyo_door','A door into the earth','gy_igate2',d=>NPCS['gyo_door'+(d.i||0)].root(d));
khNpc('gyo_crypt','The tomb','gy_crypt',d=>say("A great mossy tomb, with a double door of stone standing ajar. Over it, a pediment, and carved in the pediment, faint but readable, WENLOCK. A stair goes down behind the door, and at the bottom of the stair there is candlelight, which is rather more than a tomb usually stretches to. Lady Aldith's Crypt.",[['Go down.',()=>{G.talk=null;sfx('door');goToLevel(GY.CRYPT,{x:GY_C.start.x,y:GY_C.start.y,f:GY_C.start.f});return null}],['Not yet.',()=>null]]));
khNpc('gyo_chapel','The ruined chapel','gy_chapel',()=>say("The front wall of the old chapel of Saint Wenna, and nothing behind it. A fine pointed window, with the stone tracery still in it, and ivy all over the rest. The chapel burnt down in the time of the old king, and the village has never been in a hurry to replace it. It still gets prayed in. You can tell by the candle stubs.",[BYE]));
khNpc('gyo_hut',"The gravedigger's hut",'gy_hut',()=>say("A small timber hut with a plank door, a lantern, and a notice on the door in a neat hand: BACK IN TEN MINUTES. The notice is very faded. Somebody has underlined 'ten' in a different ink. The door is locked.",[BYE]));
khNpc('gyo_opengrave','A heap of earth','gy_mound',()=>say("A heap of fresh brown earth, a spade stuck in it, and a coffin lid leaning on it. There is no hole that you can see. Somebody has stuck a small card in the earth: NOT YET.",[BYE]));
khNpc('gyo_angel','A stone angel','gy_angel',()=>say("A stone angel with her face in her hands. Somebody has tucked a small knitted scarf round her neck, in the winter, and nobody will say who.",[BYE]));
khNpc('gyo_edmund','Sir Edmund Wenlock','gy_edmund',()=>say("SIR EDMUND WENLOCK, knight. Husband. A small, plain stone, slightly crooked, with a wreath of dried flowers hung on it, and the name cut a great deal deeper than the dates. It says: HE HELD THE BRIDGE. Nothing else. The stone beside it has no name at all.",[BYE]));
khNpc('gyo_edmund2','Sir Edmund Wenlock','gy_edmund',()=>say("SIR EDMUND WENLOCK, knight. The same plain stone as the one up in the yard, cut for the crypt. HE HELD THE BRIDGE, it says. Someone has hung a wreath on it, dried, and very old, and not dusty at all.",[BYE]));
khNpc('gyo_altar','The altar','gy_altar',d=>say(gyF().peace?"The altar is bare except for the candles, which are all lit, and a single dried red rose with a grey ribbon. It is very quiet. It is the sort of quiet that you could put a hand on.":"A plain stone altar with a white cloth, a black iron cross and two tall candles that burn without any need of wax. The cloth is very old and very clean. Lady Aldith keeps it so, she says, because there is nothing else to do with her hands.",[BYE]));
const GY_SARC=["LORD ALARIC WENLOCK. 'Built the chapel, drained the marsh, and was loved by neither the priest nor the frogs.'","LADY MATILDA WENLOCK. 'She had eleven children, and the grace to be buried in a separate coffin from each.'","SIR HUGH WENLOCK. 'He died of a surfeit of lampreys. We are told it was a good way to go.'","MARGERY, wife of Alaric the Younger. 'She is here with her cat, which is not recorded.'","THOMAS WENLOCK, steward. 'Counted everything twice. The second count is in the vault.'","SIR GUY WENLOCK. 'A knight of the shire, and a very bad poet.'","DAME ISOLDE WENLOCK. 'Her beloved dog lies at her feet, and has done for six hundred years.'","OLD HUGH THE ELDER. 'This coffin is too short, we know. We are sorry. He was shorter than he said.'","ROBERT, a younger son. 'He travelled, and returned, and was buried. In that order.'","EDWARD AND EDWIN. 'Twin brothers. Identical in all things, they say, except the matter of who was the elder.'","The ABBOT'S MAN. 'Nobody remembers his name. It is probably in the lid.'","A KNIGHT, unnamed. 'He fought for the family, and has a sarcophagus bigger than he deserved.'"];
khNpc('gyo_sarc','A sarcophagus','gy_sarc',d=>say(GY_SARC[gyI(d)%GY_SARC.length],[BYE]));
khNpc('gyo_coffin','A coffin on trestles','gy_coffin',()=>say("A coffin on two trestles, with its lid ajar. It is lined with black velvet, and it is empty, and the velvet is, frankly, wasted. Lady Aldith says it was put out for her in the year she died, in case, and she has been annoyed about it ever since, because she never got to use it.",[BYE]));
khNpc('gyo_digger','Dill, the sexton\'s nephew','kh_ohfolk3_2',d=>{const F=gyF(),n=(F.digT||0)%5;F.digT=n+1;
  const L=["Evening. Uncle Moss says I am not to talk to the living, because it is a waste of good grave-digging time. Hello.","The mazes? Four of them, under the yard. Go round clockwise from the lych-gate: the mossy gate, the sunken stair, the archway and the trapdoor. Skeletons first, then the ghouls, then the wraiths. Then the rats. The rats are the worst, they are not even dignified.","Lady Aldith? Oh, she is lovely. Cold as a pond, but lovely. She is down in the Wenlock crypt, under the big tomb, and she will not hurt a fly. The flies are not so sure.","I bury, I do not enquire. That is the first rule of the trade, and the second one is, do not stand in the hole.","The mound over there is for nobody, as far as I know. I keep the spade in it so it will not go missing. It goes missing anyway."];
  return say(L[n],[BYE])});
KH_KEEPERS.gyo_digger.sc=1;
/* ---- inside the mazes ---- */
const GY_NOTES={100:"THE RED OSSUARY. Brick-built, before the great plague, for the dead of the old parish. Nothing here is the worse for being dead, and a good deal of it is the worse for being about.",101:"THE GREY CHARNEL. Where the parish put the people it did not like to think about. A hand-lettered notice says: THE LEVERS ARE NOT FOR PLAYING WITH.",102:"THE BLACK BARROW. Black stone, brought a very long way, for a knight and the men who died round him. The air is cold, and keeps getting colder.",103:"THE PALE CATACOMBS. Bone-white brick under a skin of moss. A bell rings somewhere, on its own, once in a long while. It is not a cheerful bell.",
 0:"Scratched on a brick: 'Warden Hale was here. Keys on a hook, hook in the cell. Do not lose the key. He did.'",1:"A skeleton's rib, set in the mortar, with one word cut into it: DON'T.",2:"On the wall, in a careful hand: 'The Wardens kept the dead in alphabetical order. This was a mistake, since they moved.'",3:"A child's chalk, very old, on a brick: ALDITH WAS NICE. Nobody has rubbed it out in three hundred years.",
 10:"A scrawl on the stone: 'I pulled the crown first. Do not pull the crown first.'",11:"A lantern hook with a note on it: 'Bring your own light. The Charnel's has gone off.'",12:"A gravedigger's tally, scratched on the wall: forty strokes, then the word ENOUGH.",13:"An empty stone coffin. On the inside of the lid, somebody has scratched: I GOT BETTER.",
 20:"A knight's gauntlet stands on a ledge, palm up, holding nothing. The dust on it is very even.",21:"Scratched in the black stone: 'He kept the locket so that he would have somewhere to put the shame.'",22:"A ring of candle stubs, all burnt down at once, and a single pale petal in the middle.",23:"On a ledge, a small wooden horse, much loved, with one ear chewed. It is not at all dusty.",
 30:"A tiny bell on a nail, tied up with a ribbon so that it cannot ring. Somebody has cut the ribbon, and tied it again.",31:"Gnawed into the brick: THE RATS DID NOT DO THE TRAP. THE PRIORESS DID.",32:"A bone-white brick with a line of prayer cut round it, in Latin, going round and round. Somebody has written under it, in English: still going.",33:"A heap of bones in order, size by size, like a very bad orchestra."};
khNpc('gyo_note','A note, a stone, a sign','gy_sign',d=>say(GY_NOTES[gyI(d)]||GY_NOTES[0],[BYE]));
khNpc('gyo_riddle','A stone in the first room','gy_stone1',()=>say("A grey stone, cut in a good square hand: 'THREE LEVERS IN THE CHARNEL, THE CROSS, THE CROWN, AND THE CANDLE. THE CROSS COMES FIRST, FOR THE CROSS IS ALWAYS FIRST. THE CANDLE COMES SECOND, TO SEE WHAT COMES. THE CROWN COMES LAST, AS CROWNS DO, IN THE END, TO THE DUST.' Underneath, scratched: 'told you.'",[BYE]));
const GY_LEVER=['The cross','The crown','The candle'],GY_ORDER=[0,2,1];
khNpc('gyo_lever','An iron lever','gy_lever',d=>{const F=gyF(),i=gyI(d),nm=GY_LEVER[i];
  if(F.lev||F.dead[1])return say("The lever of "+nm.toLowerCase()+" is down, and stays down. The gate has been opened.",[BYE]);
  return say("A rusty iron lever on a stone base, with a small plaque in front of it: "+nm.toUpperCase()+".",[['Pull it.',()=>{
    F.seq=F.seq||[];sfx('door');
    if(GY_ORDER[F.seq.length]!==i){F.seq=[];msg('Clunk. Every lever in the Charnel springs back, and a distant gate does not open. Wrong order.','#d09a80');return say("The lever of "+nm.toLowerCase()+" goes down with a clank, and then, a moment later, all three of them come back up with a terrible rattle. That was not the right order.",[BYE])}
    F.seq.push(i);
    if(F.seq.length===3){F.lev=1;F.seq=[];gyOpenDoor(1);return say("The last lever goes down, and stays down. Somewhere in the Charnel a very heavy gate rolls aside.",[BYE])}
    msg('The lever of '+nm.toLowerCase()+' stays down. '+F.seq.length+' of 3.','#c8d8a0');return say("The lever of "+nm.toLowerCase()+" goes down with a deep clunk, and stays there. "+F.seq.length+" of 3.",[BYE])}],['Leave it.',()=>null]])});
khNpc('gyo_keychest',"The Warden's chest",'gy_chest',d=>{const F=gyF();
  if(F.key||F.dead[0]||bagCount('gykey'))return say("The Warden's chest, empty now except for a pair of mouldy gloves and a note: 'I told you to keep the key on you.'",[BYE]);
  return say("A heavy chest, iron-bound, in the Warden's cell. The lid is not locked. Perhaps the Warden thought nobody would come this far. Inside, on a bed of old straw, lies a rusty iron key as long as a hand.",[['Take the key.',()=>{F.key=1;bagAdd(mkItem('gykey'));sfx('key');msg("You take the Warden's Iron Key.",'#ffe36a');return say("You take the Warden's Iron Key. It is heavy, and the rust comes off in red flakes on your glove.",[BYE])}],['Leave it.',()=>null]])});
khNpc('gyo_trapchest',"The Prioress's chest",'gy_chest',d=>{const F=gyF();
  if(F.seal||F.dead[3]||bagCount('gyseal'))return say("The Prioress's chest is open, and empty, and a little sad about it.",[BYE]);
  const open=(clean)=>{F.seal=1;bagAdd(mkItem('gyseal'));sfx('key');msg("You take the Prioress's Bone Seal.",'#ffe36a');
    if(!clean){const hit=[];for(const i of livingHeroes()){const h=G.heroes[i],dmg=Math.max(1,Math.min(h.hp-1,Math.round(h.max*.14)));h.hp-=dmg;h.hurt=1;hit.push(i);addFloat(portraitX(i)+19,250,'-'+dmg,'#a8e090');try{afflInflict('poisoned',i,true)}catch(x){}}
      msg('A glass vial bursts under the hinge, and a green cloud rolls out and into everybody.','#a8e090');
      const free=gyFreeAround({x:d.x,y:d.y},3);for(let n=0;n<2&&n<free.length;n++)addEnemy('gyrats',free[n][0],free[n][1],true)}
    return say(clean?"The wire parts with a tiny click. Nothing happens, and nothing goes on happening, and you lift the lid. In a nest of grey wool lies a seal of carved bone, on a cord, stamped with a bell.":"The lid comes up, and the trap goes off, and for a moment everybody is very sorry. When the cloud has thinned there is a seal of carved bone in the chest, on a cord, stamped with a bell. The rats of the Catacombs have heard the noise, and are coming.",[BYE])};
  return say("A small, heavy chest with a brass lock, in the middle of the Reliquary. A hair-fine wire runs from the lid down under the hinge, to something that glints. It was put there on purpose, and by somebody who wished you ill.",[
    ['Cut the wire, carefully.',()=>{if(Math.random()<.7)return open(true);msg('The wire is cut a hair too late.','#d09a80');return open(false)}],
    ['Force the lid.',()=>open(false)],['Leave it.',()=>null]])});
/* ---- the grave: the ending ---- */
const GY_RELICS=['gyname','gyring','gylocket','gybook'];
function gyHasRelics(){return GY_RELICS.every(id=>bagCount(id)>0)}
khNpc('gyo_grave',"A grave with no name",'gy_slab',d=>{const F=gyF();
  if(F.peace)return say("The stone now bears a name in clean deep letters: ALDITH, WIFE OF EDMUND WENLOCK. Beside it lie a gold ring, a silver locket, and a black prayer book, with a handful of fresh flowers. It is very quiet here, in a good way. The moss on it has been trimmed back by somebody.",[BYE]);
  if(qSt('gyq5')==='active'){
    if(!gyHasRelics())return say("The grave of Lady Aldith, which has no name on it. You have not everything yet. You need her name-stone, her ring, Edmund's locket and the Prioress's book. Keep looking.",[BYE]);
    return say("A flat grey stone, with moss all over it. You have everything. Her name-stone, her ring, Edmund's locket, and the book with the page marked.",[['Lay them down, and read the page.',()=>gyCut(1)],['Not yet.',()=>null]])}
  return say("A plain grey stone in the Wenlock family plot, beside Sir Edmund's, with moss over the face and an empty place at the foot, as if it were waiting for a name. "+(F.met?"Lady Aldith said that this is hers.":"Somebody has put a single, fresh flower on it."),[BYE])});
function gyCutGhost(k,show){
  const g=GY_Y.grave;let d=G.decor.find(q=>q.gyCut);
  if(show&&!d){d={k:'gy_'+k,x:g.x,y:g.y+1,block:false,walk:true,deco:true,gyCut:1,sc:1.05};G.decor.push(d)}
  else if(d){if(show)d.k='gy_'+k;else{d.found=true;d.hidden=true}}}
const GY_CUT={
 1:()=>say("You kneel at the grave with no name. The moss is soft, and wet with the mist. You lay the name-stone against the head of it, and the carved leaves round the edge seem to catch what is left of the daylight. You set the ring on the stone, and Edmund's locket beside it, and open the book at the marked page. The writing is very small, and very plain, and not at all like the woman who would not read it.",[['Read it aloud.',()=>gyCut(2)]]),
 2:()=>{sfx('heal');sfx('level');gyCutGhost('ghost1',true);return say("'Go gently, and go home. The door is open. You are expected.' It is not long. You read it twice, because it feels wrong to leave it. Under your knees the earth lets go of something very old and very heavy. The mist begins to glow from the inside, softly, like a lamp behind a curtain. A lady stands at the grave in a gown of light, with her hand to her mouth, and she is looking at the stone.",[['Look up.',()=>gyCut(3)]])},
 3:()=>{gyCutGhost('ghost1',true);return say("'It has my name on it,' says Lady Aldith. 'Look at that. ALDITH. I had forgotten how many letters it has.' She looks at the stone beside it, for some time. 'Edmund's is crooked. It is a good stone, but it is crooked. He was always slightly crooked. I used to straighten his collar.' She wipes her face with the back of a hand that is not quite there. 'I know how this goes, I think. You are supposed to be sad. Please do not. I have been dead for three hundred years, and it has been very dull, and now it is going to be interesting.'",[['Tell her she is welcome.',()=>gyCut(4)]])},
 4:()=>{gyCutGhost('ghost2',true);return say("'You took a long road, for strangers,' says Lady Aldith, and she is smiling now, with her eyes shut, in the light. 'Lord Corwin Vane will not enjoy this news. Take my husband's sword. It lay in my tomb, and I would like something of ours to be used for something useful. Take the lantern, too, it is lit from the last of me, and it will keep you company in the dark. And the rose is for luck. And stop looking so worried. It is only dying. I have done it before, and it did not hurt at all, and I was very bad at it.'",[['Say goodbye.',()=>gyCut(5)]])},
 5:()=>{
   const F=gyF();F.peace=1;F.bell=1;sfx('win');gyCutGhost('ghost2',false);
   try{tone(660,655,2.4,'sine',.16);tone(1320,1310,1.6,'sine',.06,.02);tone(1980,1970,1.1,'sine',.03,.04)}catch(e){}
   const ok=qTurnIn('gyq5');
   for(const id of ['gyname','gylocket','gybook','gyring'])bagRemove(id,1);   // the four things are on her grave now
   gyDressGrave();
   return say("She smiles, and the smile is the last of her to go. There is a moment of perfect light, and perfect quiet, and then the evening is only an evening, and the mist is only mist. On the stone, in clean deep letters, there is a name: ALDITH, WIFE OF EDMUND WENLOCK. Far away, in the town, a bell rings once, as if it had been waiting to.",[['Stand up, quietly.',()=>null]])}};
function gyCut(n){return GY_CUT[n]()}
/* the grave after the ending: the stone carries the name, and the four things lie on it; the crypt a lit shrine (see gyArrive) */
function gyDressGrave(){
  try{const g=GY_Y.grave,d=G.decor.find(q=>q.npc==='gyo_grave');if(d){d.k='gy_nameplate';d.sc=.8}
    const add=(k,x,y,sc)=>{if(!G.decor.some(q=>q.k===k&&q.x===x&&q.y===y))G.decor.push({k,x,y,block:false,walk:true,deco:true,sc:sc||1,gyDress:1})};
    add('gy_ring',g.x-1,g.y+1,.8);add('gy_locket',g.x+1,g.y+1,.8);add('gy_book',g.x,g.y+2,.8);add('gy_rose',g.x,g.y-1,1)}catch(e){console.error(e)}}
/* what changes when a level is entered: the picture of the ghost, the lights, the dressed grave, the shrine */
function gyArrive(n){
  const F=gyF(),L=LEVELS[n];if(!L)return;
  if(n===GY.CRYPT){
    const gd=G.decor.find(d=>d.npc==='gyo_ghost'),done=['gyq1','gyq2','gyq3','gyq4'].filter(i=>qSt(i)==='done').length;
    if(gd){if(F.peace){gd.found=true;gd.block=false;gd.hidden=true}else gd.k=done>=2?'gy_ghost1':'gy_ghost0'}
    if(F.peace){for(const [x,y] of [[11,3],[13,3],[10,5],[14,5],[12,5],[10,12],[14,12],[8,10],[16,10]])LIGHTS.push({x:x+.5,y:y+.5,ph:hash2(x,y,17)*6.28,key:-7000-LIGHTS.length,taken:false,red:false,free:true,calm:true,col:[1.3,1.0,.6],kI:1.5,range2:140});
      for(const l of LIGHTS){if(l.free&&!l.lamp){l.col=[1.3,1.02,.62]}}
      if(!G.decor.some(d=>d.gyShrine)){G.decor.push({k:'gy_rose',x:12,y:3,block:false,walk:true,deco:true,sc:1,gyShrine:1});G.decor.push({k:'gy_candles',x:8,y:5,block:true,sc:.8,gyShrine:1});G.decor.push({k:'gy_candles',x:16,y:5,block:true,sc:.8,gyShrine:1})}}
    else if(!F.metCrypt){F.metCrypt=1;msg('Candlelight, and a smell of cold stone. At the far end of the nave, a pale lady stands very still, as if she had been waiting for someone to come in and sit down.','#c8d8ff')}}
  if(n===GY.ID){if(F.peace)gyDressGrave();if(!F.metYard){F.metYard=1;msg('The old graveyard of Wenlock, under a low blue mist. The stones lean together like people at a bus stop. At the heart of it is a tomb, with a light in its door.','#b8c8e8')}}
  if(gyMazeK(n)>=0&&!F['metM'+gyMazeK(n)]){F['metM'+gyMazeK(n)]=1;msg(['Red brick, and a smell of old pennies. Somewhere ahead, a skeleton is clearing its throat.','Grey stone, wet with something. A soft, slow dragging, on the far side of a wall.','Black basalt, and cold. Very far off, somebody is crying, quietly, in a high old voice.','Pale brick under green moss. Somewhere a little bell rings, and the rats stop to listen.'][gyMazeK(n)],'#d8c8b0')}}
/* the bell of Wenlock rings once, the first time the party is back in the town after the ending, and the townsfolk have something new to say */
function gyTownArrive(){
  const F=gyF();if(!F.peace)return;
  if(F.bell&&!F.bellRung){F.bellRung=1;later(1800,()=>{try{tone(523,520,3.2,'sine',.2);tone(1046,1040,2.2,'sine',.09,.02);tone(1568,1560,1.4,'sine',.04,.04);tone(262,260,3.6,'sine',.1)}catch(e){}msg("From the tower of Saint Wenna's, one stroke of the old cracked bell. Nobody was meant to be ringing it. The whole town looks up, and then, for no reason at all, smiles.",'#ffe9a0')})}}
{const NEW=[['wlo_mayor',"Did you hear the bell? Nobody was at the rope, and it rang as sweetly as it has in three hundred years. Sexton Moss says it is the damp. I say it is Lady Aldith, and that she has gone home, and that I owe her an apology on behalf of every Thistlewood since the beginning."],
  ['wlo_gravedigger',"The old crypt has gone all warm and quiet. I have been in it forty years and never once felt it was a nice place to be. Somebody has left a rose on the altar. Do not tell the vicar, he will want to charge for it."],
  ['wlo_curate',"There is a story in the village that Lady Aldith's grave has a name on it. I went to look. It has. I came back and wrote it in the register myself, in my best hand. It is the best entry in the book, and I am not saying that because I am the curate."],
  ['wlo_crier',"Oyez! Oyez! The Lady of Wenlock is at rest, and her name is on her stone, and the whole town is to be told! ... I am told that I have already told it twice, and the second time was to the pig."]];
  for(const [id,line] of NEW)try{yrHook(id,d=>{const F=gyF();if(F.peace&&!F['town_'+id]){F['town_'+id]=1;return say(line,[BYE])}return null})}catch(e){console.error('gy town',e)}}
