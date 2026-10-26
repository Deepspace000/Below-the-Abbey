/* ==========================================================================
   WENLOCK: THE MAYOR AND THE TEN QUESTS (prefix wl / wlo_ / wlq). A chain of little stories, each handed on to the next person in town, funny and warm:
   1 the mayor's welcome, 2 a lost cat, 3 a missing pie, 4 a wedding ring in the duck pond, 5 a bully on the green, 6 a stuck cart, 7 a poem for the harvest,
   8 the knocking in the town well (the way down to the purple maze under the well, built in other files), 9 the belfry key, 10 the harvest bell.
   The table of quests is WL_QUESTS in wenlock_town.js. Rewards are for a party at level 80 (every quest pays double, see QREW_MUL).
   ========================================================================== */
ITEMDEF.wlkey={n:"The Belfry Key",k:'quest',t:'Quest item',ic:'key',c:'#c8a040',stack:1,price:1,d:'A long iron key on a loop of rope, a little damp, and with a faint smell of the bottom of a well. It opens the belfry of Saint Wenna\'s.',sw:.2};
QAREA_ORDER.splice(QAREA_ORDER.indexOf('Greendale')+1,0,'Wenlock');
const wlF=()=>G.flags;
const WL_REW={wlq1:{gold:250,xp:3000},wlq2:{gold:300,xp:3500},wlq3:{gold:350,xp:4000},wlq4:{gold:400,xp:4500},wlq5:{gold:500,xp:6000},wlq6:{gold:450,xp:5000},wlq7:{gold:500,xp:5500},wlq8:{gold:1000,xp:10000,items:['potion5','wlkey']},wlq9:{gold:600,xp:6000},wlq10:{gold:1000,xp:12000,items:['potion5','potion5']}};
function wlQ(id,who,steps,extra){
  const meta=WL_QUESTS.find(q=>q.id===id),q=yrQ(id,meta.title,who,steps,WL_REW[id],extra);QAREA[id]='Wenlock';
  return q}
/* a person who gives a quest once the one before is done (the mark over their head follows), with talk in between */
function wlGive(npcId,qid,prev,dlg,chat){
  const old=QGIVER[npcId];
  Object.defineProperty(QGIVER,npcId,{enumerable:true,configurable:true,get(){const l=[].concat(old&&!Array.isArray(old)?[old]:old||[]);if((!prev||qSt(prev)==='done')&&qSt(qid)!=='done')l.push(qid);return l.length?l:null}});
  yrHook(npcId,d=>{if(qSt(qid)==='done'||(prev&&qSt(prev)!=='done'))return null;return qNode(qid,dlg)})}
/* a step done by talking to somebody: say the line, mark it, and let the quest log tell the party */
function wlTalk(npcId,qid,flag,text,line){
  yrHook(npcId,d=>{const F=wlF();if(qSt(qid)==='active'&&!F[flag]){F[flag]=1;yrStep(text);return say(line,[BYE])}return null})}
/* ---- 1. A Proper Welcome: the mayor ---- */
khNpc('wlo_mayor','Mayor Aldous Thistlewood','kh_ohfolk1_2',d=>{
  const F=wlF();if(!F.wlMayorMet){F.wlMayorMet=1;try{wkMet('mayor')}catch(e){console.error(e)}}
  if(qSt('wlq9')==='done')return qNode('wlq10',WLD10);
  if(qSt('wlq1')==='done')return yrLines('wlo_mayor',["Sit, sit. The town is yours to rest in. The Harvest Bell will ring when the belfry key is found, and not before. Ask around, there is always a small matter somewhere.","The road west is not yet open. When it is, I shall have a ribbon, and a very large pair of scissors."]);
  return qNode('wlq1',WLD1)},{sc:1.05});
Object.defineProperty(QGIVER,'wlo_mayor',{enumerable:true,configurable:true,get(){const l=[];if(qSt('wlq1')!=='done')l.push('wlq1');if(qSt('wlq9')==='done'&&qSt('wlq10')!=='done')l.push('wlq10');return l.length?l:null}});
const WLD1=khQD("Welcome, welcome, welcome! Aldous Thistlewood, mayor of Wenlock, third generation and widest in the chain. So it is true, somebody has come out of the Maze of Gardens! Nobody comes out of the gardens. The last person to try was a tinker, and he came out on a Thursday, and could not be convinced it was not still Tuesday. On behalf of every person in Wenlock, thank you for passing through. Now, I must be honest: the road to the western kingdoms is not yet open. There is an ox on it. But you are most welcome to rest, to shop, to take the waters of our well, and to be fed by the entire town whether you like it or not. Would you do a small thing for me? I have written a note of welcome, and Bartle the crier must read it out in the square. He will not do it for me. He says I make him nervous.",
  'Splendid! I will tell him you are on the way. Mind the ducks. They will want to see the note.',
  (n,m)=>wlF().wlq1a?'Bartle has the note and is learning it by heart. Come back to me and tell me what the square thought.':'Bartle the crier is in the market square. He wears a very loud hat. You cannot miss it.',
  'Ah, you are back! And the square has been welcomed? It has? And did anyone cry? No? Good. Crying is for the feast.',
  'Wonderful! On a wet Sunday you would have a statue. As it is, you have this. And a standing invitation to the harvest feast, whenever the bell is mended.',
  "Sit, sit, rest. The Harvest Bell has not rung for three years, you know. There is a great deal to put right. I shall let you know if there is anything I can think of.",'Bartle has read it.');
wlQ('wlq1','Mayor Aldous Thistlewood',[["Take the mayor's note to Bartle the crier, in the market square. He wears a very loud hat.",()=>wlF().wlq1a,['wlo_crier']]]);
wlTalk('wlo_crier','wlq1','wlq1a',"Bartle has the mayor's note.","Oyez! Well, no, not yet, I have to learn it. 'Dear citizens of Wenlock, a very small number of strangers have arrived, and I am told they are not tinkers.' Oh, that is lovely. I shall cry it at noon, and then again, because I enjoy it. Tell the mayor I am delighted, and that he is not nervous-making at all, only slightly alarming.");
/* ---- 2. Oyez, a Lost Cat: Bartle ---- */
const WLD2=khQD("Oyez! Ah, strangers! You are the very people, I was just about to cry for somebody, anybody. It is Marmalade! Ginger cat, white socks, answers to nothing, especially not her name. She belongs to nobody and to everybody, and she has gone missing from the market, and the whole square is bereft. I am a crier, not a finder. I cry, and then things are found. Find her, and I shall cry about it all day.",
  'Oyez! The party sets out! I shall tell everyone, and nobody will be any the wiser.',
  (n,m)=>wlF().wlq2a?'Marmalade is safe. Come and tell me, so that I can cry it.':'She is somewhere among the market stalls. Try anywhere warm, with a view of fish.',
  'You have her? I knew it. I have already started to cry. Here, take this.',
  'Oyez! The cat is found! Wenlock may sleep soundly tonight! Take this, and my thanks, and also hers, though she will not say so.',
  'The cat is home, and the square sighs with relief. I hear Goody Prue on the green has had a small disaster of her own, if you can bear one more.',"The cat is found.");
wlQ('wlq2','Bartle the town crier',[["Find Marmalade, the ginger cat with white socks. Somewhere among the market stalls, somewhere warm, with a view of fish.",()=>wlF().wlq2a,['wlo_cat']]]);
wlGive('wlo_crier','wlq2','wlq1',WLD2);
khNpc('wlo_cat','Marmalade, the cat','kh_anim1_0',d=>{const F=wlF();
  if(qSt('wlq2')==='active'&&!F.wlq2a){F.wlq2a=1;yrStep('You have found Marmalade.');d.found=true;d.block=false;return say("A ginger cat with white socks, curled up in an empty fish crate with a fish. She looks at you with enormous calm. She has been here the whole time. She lets you pick her up, then lets herself down, then walks off towards the crier with her tail in the air, as if it had been her idea.",[BYE])}
  return say('Marmalade looks at you with great calm. This is her crate.',[BYE])});
/* ---- 3. The Missing Pie: Goody Prue ---- */
const WLD3=khQD("Oh, dear, oh, dear, my dear. It is Goodwife Crumb's best pie, a plum and apple that was cooling on her windowsill, and now it has quite gone. Fifteen years she has baked that pie for the harvest and not once has it walked. The only one who goes near that sill is Biscuit, the baker's dog, and he has a very innocent face, which is exactly what I do not like about it. Would you speak to him, dear? You are strangers, and he will tell you things.",
  'Thank you, dear. Biscuit lives by the bakery, on the north side of the high street. Mind your fingers, he is a good boy but a biter of the pie-adjacent.',
  (n,m)=>wlF().wlq3a?'Biscuit gave you a look and ran off east. Follow the crumbs, dear, and the pie will be at the end of them.':'Speak to Biscuit, the baker\'s dog, by the bakery. And then follow the crumbs.',
  'You have the pie! Oh, bless you. Crumbs and all?',
  'There, there, the pie is safe. Biscuit will get the crust, I expect. Crumb will have a tear in her eye and an apron over it. Take this, dear.',
  'The pie is home, the dog is forgiven, and I am to look as if I had known all along.','Here is the pie.');
wlQ('wlq3','Goody Prue',[["Ask Biscuit, the baker's dog, by the bakery, what he knows about the pie.",()=>wlF().wlq3a,['wlo_dog1']],["Follow the crumbs to the pie, which is somewhere behind the bakery.",()=>wlF().wlq3b,['wlo_pie']]]);
wlGive('wlo_gran','wlq3','wlq2',WLD3);
wlTalk('wlo_dog1','wlq3','wlq3a','Biscuit led you towards the crumbs.',"Woof. (Biscuit looks at you, looks at the pie-shaped gap in the world, and then trots off with great dignity towards the north. A very small trail of crumbs goes with him. He does not look back. Not once. This is how you know.)");
khNpc('wlo_pie','A basket in the grass','kh_oqstuff_4',d=>{const F=wlF();
  if(qSt('wlq3')==='active'&&F.wlq3a&&!F.wlq3b){F.wlq3b=1;yrStep('You have found the pie.');d.found=true;d.block=false;return say("Behind a bush, a basket. In the basket, a plum and apple pie, with one wedge missing and the rest untouched, and a very small dog-shaped dent in the grass beside it. Biscuit watches from the next garden. He is the picture of innocence. You pick up the pie.",[BYE])}
  return say('A basket, a few crumbs, and a certain atmosphere of recent crime.',[BYE])});
/* ---- 4. The Wedding Ring: Mrs Tanner ---- */
const WLD4=khQD("It was my mother's, and my grandmother's, and it is the only thing in the world that fits me properly. I took it off to wash my hands at the pond, and the pond has taken it, and now the ducks are looking very pleased with themselves. I have asked the children if they saw it. They saw a great many things. None of them was a ring. Would you ask again, and look? You may have better luck. You are not my children.",
  "Bless you. Daisy and Alfie play by the pond all day. They notice a great deal and say about half of it.",
  (n,m)=>wlF().wlq4a?'Daisy saw something shiny by the edge of the pond. Have a look in the reeds, on the side nearest the oaks.':'Ask the children by the pond, then search the water\'s edge.',
  'You have it? Oh, let me see. Oh! It is a little scratched and a little muddy, and it is perfect.',
  "Oh, bless you. I shall wear it to bed. I shall wear it in the bath. I shall tell my husband it was never lost, it was simply exploring. Take this, and a hug.",
  "The ring is on my finger, the ducks are in disgrace, and my husband is none the wiser. Fudge the constable was looking for you, by the way. Something about Hob.",'Is this it?');
wlQ('wlq4','Mrs Tanner',[["Ask the children on the green (Daisy, with the doll) if they saw a ring.",()=>wlF().wlq4a,['wlo_girl']],["Search the water's edge of the duck pond for the ring.",()=>wlF().wlq4b,['wlo_ring']]]);
wlGive('wlo_tanner','wlq4','wlq3',WLD4);
wlTalk('wlo_girl','wlq4','wlq4a','Daisy saw something shiny by the pond.',"A ring? Dolly saw a ring. It was shiny, and it went into the pond by the big oak, and a duck looked at it for a very long time, and then did nothing. Dolly says the duck was thinking. I think the duck was being mean.");
khNpc('wlo_ring','Something shiny in the reeds','kh_ohgard2_4',d=>{const F=wlF();
  if(qSt('wlq4')==='active'&&F.wlq4a&&!F.wlq4b){F.wlq4b=1;yrStep("You have found Mrs Tanner's ring.");d.found=true;d.block=false;return say("In the reeds at the edge of the pond, half buried in mud and guarded by a very suspicious duck, a gold ring. You reach in. The duck considers biting you, and then considers the ring, and then considers its life choices. You hold it up. It gleams.",[BYE])}
  return say('Reeds, mud, and a duck with opinions.',[BYE])});
/* ---- 5. A Quiet Word with Hob: Constable Fudge ---- */
ENEMY_DEF.wlo_hob=Object.assign({},ENEMY_DEF.bandit,{name:'Big Hob',img:'kh_oqmen_1',w:.58,xp:400,gold:[20,60],verb:'swings at'});
NPC_H.kh_oqmen_1=NPC_H.kh_oqmen_1||.98;
const WLD5=khQD("Ah. Yes. Hob. Well. It is a lovely village, and I am very proud of it, and I have never had any trouble. Except for Hob. He is a big lad, and he has been taking the little ones' hoops and the little ones' apples and the little ones' breath. I am the constable. I have a stick, and a very large conscience, and a small bad back. Would you, as a favour to a man who has never asked for a favour, have a quiet word with him? A fair duel, on the green. Nobody gets hurt that cannot be mended at the church. Hob is as stubborn as a barn door, but the lad is not wicked.",
  'Thank you! I shall be watching from a safe distance, with my eyes shut, to give nobody the idea I am involved.',
  (n,m)=>'Hob is on the village green. He will be rude. Do not take it to heart. He is rude to everybody, and the rudeness is a cry for attention.',
  'He is beaten? And not hurt, or not too hurt? Splendid, splendid.',
  'The little ones are cheering, the green is peaceful, and I am to pretend I had the idea myself. Take this, with the thanks of the village.',
  'Hob has been seen helping little Alfie roll his hoop. It is the only miracle I have ever witnessed.','Hob is beaten.');
wlQ('wlq5','Constable Fudge',[["Challenge Big Hob to a fair duel on the village green, and win.",()=>(wlF().k_wlo_hob||0)>=1,['wlo_bully']]]);
wlGive('wlo_watch','wlq5','wlq4',WLD5);
yrHook('wlo_bully',d=>{
  if(qSt('wlq5')!=='active'||(wlF().k_wlo_hob||0)>=1)return null;
  return say("Oi. You. Yes, you. I do not like the look of you. It is a very good look, and I do not like it. What are you going to do about it? Nothing? Good.",[['Challenge him to a duel.',()=>{d.found=true;d.block=false;G.talk=null;addEnemy('wlo_hob',d.x,d.y,true);msg('Big Hob rolls up his sleeves, and the village gasps.','#ffe36a');return null}],['Walk away.',()=>null]])});
/* ---- 6. The Stuck Cart: Jack Joiner ---- */
QUESTS.wlq6={title:'The Stuck Cart',who:'Jack Joiner, carpenter',desc:"Farmer Giles' hay cart is stuck in the lane, and the pushers are thirsty. Bring 3 mugs of ale to Jack Joiner. The Plough and Pigeon sells it.",need:3,goal:()=>bagCount('ale'),take:{ale:3},reward:WL_REW.wlq6};QAREA.wlq6='Wenlock';
const WLD6=khQD("Hob is quiet, I hear. Well. My turn. Farmer Giles' hay cart is stuck by the west lane, with a wheel in a ditch and four men pushing. They have been pushing since lunch. They have been pushing so long that they have started to push each other. Pushers want ale, and nothing else will move that cart. Three mugs, and you will be remembered in the history of Wenlock as the people who got the hay home. Wood I have. Ale I have not. I am a carpenter, I stay out of the pub for the sake of my fingers.",
  'Three mugs, and I will see you right. The Plough and Pigeon will have it, or the cooper.',
  (n,m)=>`${n} of ${m} mugs of ale. Try the Plough and Pigeon on the high street, or Hoop the cooper in Mill Lane.`,
  'Ale! Splendid. I can hear the cart groaning with joy from here.',
  'The cart is out, the hay is home, and the pushers are asleep on it. Thank you, strangers. You will find a small reward, and my gratitude, and an introduction to the curate. He has a terrible problem with a poem.',
  'The cart is home, the hay is home, and the pushers are in the pub. As it should be.','Here is the ale.');
wlGive('wlo_carpenter','wlq6','wlq5',WLD6);
/* ---- 7. A Poem for the Harvest: Curate Pettigrew ---- */
const WLD7=khQD("Oh, thank goodness, new faces, and ones who do not know my poetry. The harvest service is soon, and the vicar has asked me for a poem, and I have been sitting in the vestry for three days with a pen and a plate of biscuits. I have the first line. 'The wheat is gold, the barley too.' And then I stopped, because it is true, and nothing else is. I thought: I should ask the people of Wenlock for a line each. Old Walt on the green bench, Jory the minstrel in the market, and Goody Prue, who knows everything. Would you collect them for me?",
  'God bless you. I shall be in the churchyard, looking pensive, to give the impression that I am the author.',
  (n,m)=>`${n} of 3 lines: Old Walt (the bench on the green), Jory the minstrel (the square), Goody Prue (the green).`,
  'You have the verses? Oh, let me read them. Oh. Oh my. Oh dear. Oh, this is quite wonderful.',
  "It is rather rustic. It scans in places. 'The wheat is gold, the barley too, / The pig has got into the stew, / The bell is cracked but sweet withal, / And Walt is eighty, which is all.' I shall be known as a poet. Take this, and the thanks of the church.",
  'The poem is a great success and nobody knows who wrote it. I am told the pig is offended. Mrs Suds was asking for you, by the well.','Here are the verses.');
wlQ('wlq7','Curate Pettigrew',[["Get a line of the poem from Old Walt, who sits on the bench on the green.",()=>wlF().wlq7a,['wlo_oldwalt']],["Get a line from Jory the minstrel, in the market square.",()=>wlF().wlq7b,['wlo_minstrel']],["Get a line from Goody Prue, who knows everything, on the green.",()=>wlF().wlq7c,['wlo_gran']]]);
wlGive('wlo_curate','wlq7','wlq6',WLD7);
wlTalk('wlo_oldwalt','wlq7','wlq7a','Old Walt gave you a line.',"A line for the curate? 'And Walt is eighty, which is all.' There. That is it. That is the best thing I have ever said. I said it twice, to be sure. Tell him it is mine, and he is not to change a word.");
wlTalk('wlo_minstrel','wlq7','wlq7b','Jory gave you a line.',"A rhyme for the curate? Of course, of course. 'The bell is cracked but sweet withal.' Withal! I have been saving that for a ballad. I will give it to him for a penny and the credit. No penny? The credit, then. Write down my name.");
wlTalk('wlo_gran','wlq7','wlq7c','Goody Prue gave you a line.',"A line for the poem? Why, 'The pig has got into the stew.' I have no idea where it came from, dear. It is simply true. It is the truest thing about Wenlock. Off you go.");
/* ---- 8. The Knocking in the Well: Mrs Suds (the way down to the purple maze) ---- */
WK.WELLSTART=WK.WELLSTART||null;
const WLD8=khQD("It is the well, my dear, the town well, in the middle of the square, and it is knocking. Knock, knock, knock. Three times, then a pause, then a bit of a scrape. It has been doing it since Tuesday, and everybody says it is the pipes, and there are no pipes. And then the bell-ringer, Sexton Moss, dropped the key to the belfry down it, trying to peer in, and his hat after it, and I swear the hat came back up. Would you go and look? There is a ladder, and there is a bucket rope, and I am told by the very old that the well is a great deal deeper than the village is wide. Be careful, the down is not just a down.",
  'Bless you. The well is opened. There is a hatch under the bucket, a spiral of cold steps, and a very strange glow. Go carefully, and come back, and tell me what is knocking.',
  (n,m)=>wlF().wlWellDone?'You have been down and come back? Then speak to me, and we shall see what you found.':'The town well in the market square is open. Go down the steps, find what is knocking, and bring back the belfry key if you can.',
  'You came back! And you look as though you have had the kind of day that does not go in stories. What was it? Never mind. Do you have the key?',
  "Oh, you are heroes. Do not argue. Moss will weep. Take this, and the key, and a cup of tea whenever you like, and the sort of thanks that has a lot of tea in it.",
  'The well has gone quiet again, and the whole village has stopped looking at it sideways. Sexton Moss has been asking for you. He wants the key.','The knocking has stopped.');
wlQ('wlq8','Mrs Suds, the washerwoman',[["Go down the town well, in the market square, find what is knocking, and climb back out.",()=>wlF().wlWellDone||(typeof wlWellQuestGoal==='function'&&(()=>{try{return wlWellQuestGoal()}catch(e){return false}})()),['wlo_well']]],{well:1});
wlGive('wlo_washer','wlq8','wlq7',WLD8);
{const _qa=qAccept;qAccept=function(id){_qa.apply(this,arguments);if(id==='wlq8'){const F=wlF();F.wlWellOpen=true;try{msg('The town well in the market square is open.','#ffe36a')}catch(e){}}}}
function wlWellGo(){
  const F=wlF(),id=(typeof WK!=='undefined'&&WK.WELL&&WK.WELL[0])||497;
  if(!LEVELS[id]&&KH_LAZY[id])try{KH_LAZY[id]()}catch(e){console.error(e)}
  const st=WK.WELLSTART||(LEVELS[id]&&LEVELS[id].start)||{x:2,y:2,f:0};
  sfx('door');G.talk=null;goToLevel(id,{x:st.x,y:st.y,f:st.f||0});
  return null}
khNpc('wlo_well','The town well','kh_city1_1',d=>{const F=wlF();
  const opts=[];
  if(F.wlWellOpen)opts.push(['Climb down the steps.',()=>wlWellGo()]);
  opts.push(['Drop in a coin and wish.',()=>{if(G.gold<1)return say('You have no coin to drop. The well looks faintly disappointed.',[BYE]);G.gold-=1;return say(F.wlWellOpen?'The coin falls for a long time. Something far below catches it, and does not say thank you.':'The coin falls, and there is a tiny, faraway plink. A very small wish is made. Nothing happens, which is the best sort of wish.',[BYE])}]);
  opts.push(BYE);
  return say(F.wlWellOpen?"The well has a hatch under the bucket, open now: a spiral of old stone steps goes down into a faint purple glow. A cold breath comes up, and with it a very faint knock. Knock, knock, knock.":"A lovely old well with a little tiled roof, ringed with flowers, with a bucket on a rope. The water is a long way down. Now and then, if you listen very closely, there is a soft, distant knock. It is probably the pipes, though there are no pipes.",opts)});
/* ---- 9. The Belfry Key: Sexton Moss ---- */
QUESTS.wlq9={title:'The Belfry Key',who:'Sexton Moss',desc:"Take the belfry key, from the bottom of the well, to Sexton Moss in the churchyard, so that the harvest bell can be rung.",need:1,goal:()=>bagCount('wlkey'),take:{wlkey:1},reward:WL_REW.wlq9};QAREA.wlq9='Wenlock';
const WLD9=khQD("Nobody is ever in a hurry to see me. It is the nicest part of the trade. But I have a problem, and I must say it, and I am very sorry to say it to people who have come such a way. The key to the belfry has gone down the well. It is a great iron key, longer than my hand, and it is the only one. Without it the harvest bell cannot be rung, and without the bell, there is no harvest, and without the harvest there is no feast, and without the feast I have nobody to feed my sandwiches to. I understand Mrs Suds has asked you to look into the well. If you find a key, I would take it very kindly.",
  'Thank you. I shall be here, digging something, to give the impression of purpose.',
  (n,m)=>'Bring me the belfry key. Mrs Suds has sent you down the well for it. It will smell of the bottom of a well, I should think.',
  'Is that it? The key! Oh, the weight of it! And it smells of a well! It is perfect.',
  'The key! After three years the bell will ring on Sunday and I shall be at the rope. Take this. It is not much. It is what I have. The mayor will want to hear of it.',
  'The bell is ready, the rope is new, and I have a sandwich. All is well.','Here is the key.');
wlGive('wlo_gravedigger','wlq9','wlq8',WLD9);
/* ---- 10. The Harvest Bell: the mayor again ---- */
const WLD10=khQD("Moss tells me you have the key! The belfry opens! The bell shall ring! Strangers who came through the gardens and mended our town in a week. I am overcome, and my chain is a little tight. Now, there is a harvest feast to arrange, and it must be properly announced. Lady Eleanor Ashby, the flower show judge, on the green, must be told, because she will not come otherwise. And Bartle must cry it, for the whole town. Then come back to me. We shall have a feast the like of which Wenlock has not seen since the pig got into the stew.",
  'Splendid! I shall be here, practising a speech. It is a very long one. I have a shorter one for emergencies.',
  (n,m)=>wlF().wlq10a&&wlF().wlq10b?'Lady Eleanor and Bartle know. Come and tell me, and the feast shall begin.':'Tell Lady Eleanor Ashby (on the green) and Bartle the crier (in the square) about the bell. Then come back.',
  'Both of them know? The bell is ringing already, I think. Or that is my ears.',
  'The Harvest Bell has rung, the feast is laid, the whole town is on the green, and the vicar has already said grace twice by mistake. You have given us a good deal more than a week of help. Take this, and know that the western road will open some day, and when it does, there will be a very large feast waiting at the end of it.',
  'The feast was glorious, and the bell sounds well. The road west is still not open, but you are very welcome to rest here as long as you please. The town is yours.','All is told.');
wlQ('wlq10','Mayor Aldous Thistlewood',[["Tell Lady Eleanor Ashby, the flower show judge, on the village green, that the harvest bell will ring.",()=>wlF().wlq10a,['wlo_judge']],["Tell Bartle the crier, in the market square, so that he can cry the news.",()=>wlF().wlq10b,['wlo_crier']]]);
wlTalk('wlo_judge','wlq10','wlq10a','Lady Eleanor will come to the feast.',"The bell is mended? At last! I shall bring the good hat and the second-best cake. Tell the mayor I accept. I accept everything. I shall judge the feast too, if he likes. I have a very strong opinion about trifle.");
wlTalk('wlo_crier','wlq10','wlq10b','Bartle will cry the news of the feast.',"Oyez! The bell! The feast! The harvest! I shall cry it from here to the mill and back, and I shall only stop for lunch. This is the best day of my career. Do you mind if I sit down? I think I might weep.");
/* the mayor also has a few things to say when there is no quest to give */
{const lines=["Sit, sit. The Harvest Bell is the pride of the town, if one can be said to be proud of a bell that is cracked.","The road west is not yet open. When it is, I shall have a ribbon, and a very large pair of scissors.","The town is yours to rest in. The inn will have a bed, the well has a view, and the ducks will not bite you, much."];
  yrHook('wlo_mayor',d=>{if(qSt('wlq10')==='done')return yrLines('wlo_mayor',lines);return null})}
// the quest objects: where they stand (the town builder places each near this spot, off the roads)
const WL_QOBJ=[
  {npc:'wlo_cat',k:()=>'kh_anim1_0',at:[53,49],rad:3},
  {npc:'wlo_pie',k:()=>'kh_oqstuff_4',at:[16,45],rad:3},
  {npc:'wlo_ring',k:()=>'kh_ohgard2_4',at:[24,66],rad:2}
];
