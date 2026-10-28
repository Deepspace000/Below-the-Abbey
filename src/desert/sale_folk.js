/* ==========================================================================
   SALE: THE FOLK. Who is about, who is dangerous, and where.
   THE RULE OF THE STREETS. Everywhere in Sale except SA_ZONES (the Dead Quarter south of Candle Street and west of Tanners' Lane, and Hollin Farm in the south east) the dead are GHOSTS: pale
   walk-through townsfolk who talk and never fight. In the two zones the dead are hostile (skeletons, ghouls, zombies, wights, a bone priest, a bloated gravedigger, Sir Ranulf the Hollow): they wake only when the
   party is inside the same zone, and lose it (go quiet and walk home) the moment it leaves. So Candle Street, the square, Bell Lane, Tanners' Lane and the Back Track west of the farm are safe to walk, and every shop door can be reached.
   The living: the gravedigger Old Spade, the bellman Wick Tolliver, three survivors in the Hollow Cellar, the boy in the Belfry, and the ten shopkeepers behind their boards.
   ========================================================================== */
Object.assign(ENEMY_DEF,{saraven:Object.assign({},ENEMY_DEF.gyraven,{gy:undefined,sa:1,name:'Belfry Raven'})});
/* ---- ghosts: id, name, picture (index into SA_GHOSTFOLK, or 'gl0'..'gl2' for the three painted ladies), lines, and where they stand (the nearest free square off the road) ---- */
const SA_GHOSTS=[
  ['sa_g_watch','A ghost of the watch',9,["I am the watch. I have been the watch for nine years. Nobody has come through this gate in that time, so I am doing well.","The shops are shut and barricaded, every one. The keepers will talk to you through the boards if you knock. The dead quarter is south of Charnel Row. Do not go in there unless you can fight."],[66,38]],
  ['sa_g_gibbet','A hanged ghost',10,["I was hanged on that gibbet for stealing a loaf of bread. That was in my second year of being a baker's boy. I am dead now and the loaf is still in the oven. Nobody has dared to hang anyone else since.","The gibbet is not used any more. I stand next to it out of habit."],[39,34]],
  ['sa_g_priest','A ghost in a stole',1,["I was the priest of the Sanctuary. I am not allowed in any more. It is barred from the inside, and I did not see who barred it.","A candle burns in the window every night. Somebody leaves bread on the step, and in the morning it is gone. I think they are alive. I would not knock."],[35,32]],
  ['sa_g_mother','A ghost mother',3,["I am dead. It is all right. My daughter is dead as well, and we are both here, so nothing is wrong.","If you find her, she is near the fountain. She will tell you she is not allowed to talk to strangers. She is."],[33,39]],
  ['sa_g_girl','A ghost girl',11,["I am not allowed to talk to strangers. Hello.","The fountain has been dry since before I died. I used to put my feet in it. Now I put my feet near it."],[36,38]],
  ['sa_g_baker','A ghost baker',4,["I baked bread for forty years. I have not baked any for nine, because I cannot hold a loaf, only the idea of one.","Hettie Mawd runs Crust and Cleaver now. She is alive. She sells good bread, and I tell her what is wrong with it."],[27,34]],
  ['sa_g_carter','A ghost carter',5,["My cart is the one in the square. It still has the last load on it. It is plague bedding, and nobody has moved it, which is a very good idea.","If you want a ride to the east gate, I am sorry. The horse is dead too, and he has taken it badly."],[32,41]],
  ['sa_g_old','An old ghost',2,["I sat on this bench every afternoon for fifty years. I died on it. I have been sitting on it ever since. I am not sure the arrangement changed much.","The living are polite to me. I appreciate it."],[31,37]],
  ['sa_g_lad','A ghost apprentice',7,["I was Stroud's apprentice. The weaponsmith is barricaded now. She will not open the door unless a stranger kills ghouls for her. She says it is nothing personal. It is a little personal.","I never finished my first sword. It is still on the bench in there, half-ground. I think about it."],[26,37]],
  ['sa_g_widow','A ghost widow',6,["My husband died first and I died second. He says he got there first. I say I was never late for anything.","We were married forty years. I have been dead for nine. We are still married. That is how I know the vows are good."],[46,35]],
  ['sa_g_sexton','A ghost sexton',8,["I dug every grave in Sale until there were too many. Then I stopped, and then I was in one.","Old Spade is the gravedigger now. He is alive. He keeps to his cottage on the Back Track, and he does not talk to ghosts, which is rude, but he is busy."],[38,61]],
  ['sa_g_bell','A ghost bellwoman',0,["I rang the bell for forty years. Now it rings without me. I tell it when to stop. It does not listen.","Wick Tolliver is the bellman now. He is alive. He lives in the little house on Bell Lane and he is very tired."],[56,28]],
  ['sa_g_reeve','A ghost of the reeve',1,["I was the reeve of Sale. I kept the book of the dead, and I am in it, on page ninety. The book is on the table in the Dead Letter Scriptorium.","If you can persuade Ottoline Quill to open her door, she has the whole book. Be nice to her. She is not in a good mood, and she has not been since she died. No, since she nearly died."],[50,35]],
  ['sa_g_lamp','A ghost lamplighter',5,["I lit every lamp on this street for thirty years. I still do. I do it with my hand, which does nothing, but the street likes the effort.","The lamps in Sale burn on their own now. I like to think I am responsible."],[22,35]],
  ['sa_g_drover','A ghost drover',9,["I drove cattle from the east farms to the market in Sale. The road was long. It is longer now, because it is blocked.","If you came from the east, then the road is open, and I would like to hear about it."],[63,37]]];
for(const [id,name,fi,lines] of SA_GHOSTS)khNpc(id,name,'sa_gh_'+fi,()=>yrLines(id,lines));
/* the regulars of the Last Orders: three ghosts in the square who would like a drink (quest sa10, sale_quests.js), and three inside the tavern once it is open */
const SA_REGS=[['sa_reg1','Old Tobias Lamb, a ghost',0,[41,39],"Tobias Lamb, a drover, dead nine years. I used to have three ales a night at the Last Orders. Now I have none, and I do not sleep, so the nights are long."],
  ['sa_reg2','Mad Meg Hollow, a ghost',3,[44,41],"Meg Hollow. Sold eels. Died of them, the doctor said. I miss the Last Orders. I miss anything with a cup."],
  ['sa_reg3','Ned the Drover, a ghost',9,[38,41],"Ned. I drove carts. I died in a ditch, thinking about the Last Orders, and I would like to say that the beer was worth it."]];
for(const [id,name,fi,at,line] of SA_REGS)khNpc(id,name,'sa_gh_'+fi,()=>say(line,[BYE]));
const SA_INNGH={sa_inn_g1:['An old ghost at the bar',2,["I drank here for sixty years. I am still here, and the ale is still good. I cannot drink it, but I can tell when it is.","The Last Orders closes at midnight. It has closed at midnight every night since I died. I check."]],
  sa_inn_g2:['A ghost minstrel',8,["I know eleven songs. They are all about the dead. I was very popular, once, and then everybody died.","If you want a tune, I play the lute. It plays itself, but I am nearby."]],
  sa_inn_g3:['A ghost serving girl',11,["Three ales for the corner, one for the bar, and a very small one for the dog. The dog is dead too.","Big Bram is a good man. He kept the doors open as long as he could. Then he barricaded them. That was a good choice."]]};
for(const id in SA_INNGH){const [name,fi,lines]=SA_INNGH[id];khNpc(id,name,'sa_gh_'+fi,()=>yrLines(id,lines))}
/* ---- the living ---- */
const SA_DIG=["Spade. Gravedigger. There is no shortage of work, but it is the same grave every time, and the dead keep coming up out of it.","I do not talk to the ghosts. They want to talk about their own funerals, and I have been to them all.","If you are going into the dead quarter, go in with a full health bar and an empty bag. Leave it at the Last Orders. Oh, it is closed. Leave it at the cottage."];
khNpc('sa_digger','Old Spade, the gravedigger','kh_ohfolk3_3',()=>yrLines('sa_digger',SA_DIG));
khNpc('sa_k_digger','Old Spade, the gravedigger','kh_ohfolk3_3',()=>yrLines('sa_digger2',["Mind the boots. Mind the floor. Mind the corner. I have a lot of things for digging and none of them are tidy.","The dead quarter is south of Charnel Row. The farm is south-east, down the track. They do not leave their ground, so if you cannot win, walk out of it. They go quiet."]));
khNpc('sa_k_ringer','Wick Tolliver, the bellman','kh_ohfolk2_3',()=>yrLines('sa_ringer2',["I ring the bell at dawn and dusk. It rings by itself the rest of the time, and I have given up arguing with it.","There is a boy in the belfry. Not mine. Madame Veil's nephew. He climbed up there to hide and did not come down. I cannot go up. My knees."]));
khNpc('sa_ringer','Wick Tolliver, the bellman','kh_ohfolk2_3',()=>{
  const F=G.flags;
  if(qSt('sa5')==='active'&&bagCount('sa_letter')>0&&!bagCount('sa_reply')){bagRemove('sa_letter',1);bagAdd(mkItem('sa_reply'));yrStep('Wick has read the letter and written a reply.');
    return say("A letter. For me. From Ottoline Quill! I have not had a letter in nine years, and she has not spoken to me in ten. Wait. Wait there.\n\nHe writes three words on the back, shakes it dry, and gives it to you. 'Tell her yes.'",[BYE])}
  if(qSt('sa5')==='active'&&bagCount('sa_reply')>0)return say("Take that back to her. Tell her yes. Tell her I said it three times. Do not read it.",[BYE]);
  return yrLines('sa_ringer',["Wick Tolliver, the bellman. I ring the bell at dawn and dusk. It rings by itself the rest of the time. I have asked it to stop, nicely.","The bell is the only thing in Sale that makes any noise, and it is the one thing nobody can find the rope of."])});
/* the three survivors in the Hollow Cellar and the boy in the belfry (quests sa4 and sa7) */
const SA_SURV=[['sa_surv1','Dorcas Heel, an apprentice','kh_ohfolk3_0',"I am so glad to see a living face I could cry, and I have, twice. We are Nan Marrowbone's apprentices. We came down here to hide from the ghouls and the door stuck. That was a month ago. Go back up. I know the way out. There is a coal chute behind the barrels."],
  ['sa_surv2','Little Jory, an apprentice','kh_ohfolk1_5',"Is it daytime? I have not seen daytime in a month. We have eaten all the beans. We have eaten the candles. Please tell Nan we are alive. And that I did not eat her candles. It was Dorcas."],
  ['sa_surv3','Tam Marrowbone, an apprentice','kh_ohfolk6_3',"Nan's grandson. They said do not go in the cellar, so I went in the cellar. Do not tell her. Tell her we are fine. We are not fine, but you got here, so we are going to be."]];
for(const [id,name,face,line] of SA_SURV)khNpc(id,name,face,d=>{const n=+id.slice(-1),F=G.flags;
  if(qSt('sa4')==='active'&&!F['sa4_'+n]){F['sa4_'+n]=1;yrStep(name.split(',')[0]+' is free and on the way out.');d.found=true;d.block=false;return say(line,[BYE])}
  return say('They have gone up the coal chute. The cellar is a good deal quieter.',[BYE])});
khNpc('sa_pip','Pip, Madame Veil\'s nephew','kh_ohfolk1_5',d=>{const F=G.flags;
  if(qSt('sa7')==='active'&&!F.sa7a){F.sa7a=1;yrStep('Pip is free and on his way down.');d.found=true;d.block=false;return say("You are not a ghost! You are not a ghoul! You are two people and some more people! I climbed up here because the ghouls were in the street and I did not know the bell was haunted. It is. It rings when I do not touch it. Can I go home? Is Aunt Orla angry? She is, is she. Tell her I am coming. I am coming down very slowly, because of the ravens.",[BYE])}
  return say('The boy has gone down the stairs. The bell sways by itself, and rings once.',[BYE])});
/* ---- readable things ---- */
khNpc('sa_notice','The notice board',null,()=>say('A board nailed to a post, with five notices.\n\nBY ORDER OF THE REEVE: the dead quarter is closed. Do not go there. If you go there, do not take anything out of it. If you take something out of it, do not take it into the shops.\n\nWANTED: a living apothecary. Apply to Nan Marrowbone, door barricaded, shout.\n\nFOUND: one boot. Child\'s. Left.\n\nLOST: Hollin Farm.\n\nTHE LAST ORDERS WILL REOPEN WHEN THE BOARDS ARE DOWN.',[BYE]));
khNpc('sa_fountain','The dead fountain',null,()=>say('A round stone fountain with a basin full of dust and dead leaves. The figure at its centre has no head. Somebody has propped a wooden ladle against it, and somebody has put a coin in the basin, and nobody has taken it.',[BYE]));
khNpc('sa_gibbet','The gibbet',null,()=>say('A tall wooden gibbet, black with weather, and an empty iron cage hanging from it. A loaf of bread lies in the bottom of the cage, hard as stone. The ghost who is standing beside it does not look up.',[BYE]));
khNpc('sa_hut','A ruined farm hut',null,()=>say('A farm hut with half its roof gone. The walls are scratched with the marks of claws, and a child\'s toy horse sits on the sill. There is nothing in it to take.',[BYE]));
khNpc('sa_stub','A cairn of stones',null,()=>say('A cairn of stones with a bit of red cloth tied to it. A signpost leans against it, with an arrow pointing back the way you came. The road to the east has not been built yet.',[BYE]));
/* ---- placing them ---- */
function saPlaceFolk(C){
  const {person,near,free,walk,decor}=C,hs=C.hs;
  for(const [id,,,,at] of SA_GHOSTS)person(id,at[0],at[1],4);
  for(const [id,,,at] of SA_REGS)person(id,at[0],at[1],4);
  person('sa_digger',41,60,3);person('sa_ringer',56,23,3);
  // the ghost children and a crow or two on the posts of the safe streets
  for(const [x,y] of [[10,34],[27,38],[47,37],[55,33],[8,38]])C.tryDc('gy_rpost',x,y,{});
}
/* ---- the dead are hostile only inside their zones ---- */
{const _ea=enemyAct;enemyAct=function(e){
  if(LEVEL===SA.ID){const def=ENEMY_DEF[e.t];
    if(def&&def.sa){const z=saZoneAt(e.rx,e.ry),px=G.P.x,py=G.P.y,inZ=!!(z&&px>=z.x0&&px<=z.x1&&py>=z.y0&&py<=z.y1);
      if(!inZ){if(e.alert||e.x!==e.rx||e.y!==e.ry){e.alert=false;if(!enemyAt(e.rx,e.ry)&&!(px===e.rx&&py===e.ry)){e.x=e.rx;e.y=e.ry}}return 0}}}
  return _ea.apply(this,arguments)}}
/* walking into a hostile zone says so, once each time */
{const _u=update;update=function(dt){
  try{if(G.state==='play'&&LEVEL===SA.ID&&G.P){const z=saZoneAt(G.P.x|0,G.P.y|0),zk=z?z.k:'';
    if(G._saZone!==zk){G._saZone=zk;if(z)msg(z.n+'. The dead here are not peaceful.','#e8a090');else if(G._saZoneSeen)msg('Back on the safe streets. The dead here are ghosts, and mean no harm.','#a8c8e8');G._saZoneSeen=1}}}catch(e){}
  return _u.apply(this,arguments)}}
function saZoneHint(){G._saZone=undefined;G._saZoneSeen=0}
