/* ==========================================================================
   THE SMALL FOLK OF THE MAZE OF GARDENS (prefix gmo_ / gmq). Four little favours for the quiet corners of the garden, asked by the garden's own creatures and statues (the pictures are all the garden's own):
   gmq1 Duchess Mallard (the Lily Pond Court) has lost three ducklings in the hedges; gmq2 the Robin (the Bee Garden) wants the wandering queen bee brought home; gmq3 the Stone Lady (the Statue Gallery) has a
   letter for the Stone Knight (the Wisteria Walk); gmq4 the Prompter (a stone saint in the Hedge Theatre) wants three torn pages of the play, found at dead ends. Where they stand and where the things to find are
   is decided in garden_maze.js (GM_FOLK, filled by gmBuild); the talk and the quests are here. Rewards are for a level 80 party.
   ========================================================================== */
Object.assign(WL_REW,{gmq1:{gold:500,xp:5000},gmq2:{gold:600,xp:6000,items:['potion5']},gmq3:{gold:700,xp:6500},gmq4:{gold:800,xp:7500,items:['potion5']}});
WL_QUESTS.push(
  {id:'gmq1',giver:'Duchess Mallard',title:'Three Ducklings',desc:'Duchess Mallard has lost her three ducklings among the hedges of the garden. Find them.'},
  {id:'gmq2',giver:'The Robin',title:'The Missing Queen',desc:'The queen bee has wandered off from the Bee Garden. Find her.'},
  {id:'gmq3',giver:'The Stone Lady',title:'A Letter for the Knight',desc:'The stone lady in the Statue Gallery has a letter for the stone knight in the Wisteria Walk.'},
  {id:'gmq4',giver:'The Prompter',title:'Three Torn Pages',desc:'The prompter in the Hedge Theatre wants three torn pages of the play, from three dead ends in the maze.'});
ITEMDEF.gmpage={n:'A Torn Page',k:'quest',t:'Quest item',ic:'scroll',c:'#e8dcb8',stack:1,price:0,sw:.05,d:'A page torn from a play, in a looping hand. The ink has run a little where it was rained on. It reads: ENTER A GARDENER, WITH A SPADE, LOOKING SUSPICIOUS.'};
const gmF=()=>G.flags;
const gmCount=(...f)=>f.reduce((n,k)=>n+(gmF()[k]?1:0),0);
/* a thing to find: click it while the quest is active */
function gmFind(npc,face,name,q,flag,line,flav,sc){
  khNpc(npc,name,face,d=>{const F=gmF();
    if(qSt(q)==='active'&&!F[flag]){F[flag]=1;d.found=true;d.block=false;yrStep(name+' found. ('+(flag.startsWith('gmd')?gmCount('gmd1','gmd2','gmd3')+'/3':'')+')');return say(line,[BYE])}
    return say(flav,[BYE])},{sc:sc||1})}
// ---- 1. the ducklings ----
const GMD1=khQD("Quack. Oh, forgive me, I do not quack at strangers, it is only that I am quite beside myself. I took my three ducklings for a walk through the hedges, one fell in love with a butterfly, one chased a bee, and one simply sat down, and when I turned round they had all gone. There are a great many corners in this garden, and they are very small. Would you look for them? Please be gentle. They are only ducklings.",
  "Thank you, thank you. Look at the ends of the paths, the quiet corners, wherever a very small duck might sit and think. They answer to peep.",
  (n,m)=>n+' of '+m+' found. They will be in quiet corners at the ends of the paths, being very small.',
  "Peep? Oh, you have them? All three? Come here, come here, you terrible children!",
  "Three ducklings, counted twice, and one is already asleep. You have the thanks of the Pond Court, and a little something from the pond. Do come again. The lilies are lovely in the evening.",
  "The ducklings are home and extremely pleased with themselves. They have started telling people about the butterfly.","All three are home.");
gmFind('gmo_duckling1','gm_duck','The first duckling','gmq1','gmd1',"A very small duck, sitting at the end of a path, looking at nothing. 'Peep,' it says. It follows you to the edge of the hedge, and then it goes home on its own, very quickly.","Peep. (It is sitting in the middle of the path, looking at a leaf.)",.8);
gmFind('gmo_duckling2','gm_duck','The second duckling','gmq1','gmd2',"A duckling, covered in pollen, with a bee still sitting on its head. 'Peep!' it says, and it waddles off home, with the bee, in great triumph.","Peep. (It is wearing a bee.)",.8);
gmFind('gmo_duckling3','gm_duck','The third duckling','gmq1','gmd3',"A duckling gazing up at a butterfly with its whole heart. 'Peep,' it says sadly, and it leaves with you, looking back over its shoulder at the butterfly.","Peep. (It is staring at the sky.)",.8);
khNpc('gmo_duchess','Duchess Mallard','gm_duck',d=>say("Quack. A lovely evening, is it not? Please mind the lilies.",[BYE]),{sc:1.2});
wlGive('gmo_duchess','gmq1',null,GMD1);
wlQ('gmq1','Duchess Mallard',['gmd1','gmd2','gmd3'].map((f,i)=>['Find duckling number '+(i+1)+', somewhere at the end of a path.',()=>gmF()[f],['gmo_duckling'+(i+1)]]));
// ---- 2. the queen bee ----
const GMD2=khQD("Tweet, tweet, I hope you do not mind, I do not usually speak to people, but I am worried. The queen of the Bee Garden has wandered off. The bees are all in a flutter, they have stopped making honey and started making speeches, and the garden does not smell the same. She is very big and very golden, and she has gone to sit somewhere quiet and think. Would you find her, and tell her they are all waiting?",
  "Thank you. Try the quiet corners where the paths end. She likes somewhere warm, and somewhere with a view of flowers.",
  (n,m)=>gmF().gmq2a?'You have found her. Come back and tell me, and I shall tell the bees.':'A quiet, warm corner at the end of a path, with a view of flowers. She is very big and very golden.',
  "She is found? And she will come home? Oh, tweet, I could sing.",
  "The hive has gone quiet, which is the sound of bees being happy. Here, a little honey from the queen, and a good deal of thanks. Mind the thistle on your way out.",
  "The queen is home, the bees are working, and the Bee Garden smells of summer again.","She is on her way home.");
gmFind('gmo_queen','gm_bee','The queen bee','gmq2','gmq2a',"A bee as big as a loaf, golden and heavy, sitting in a patch of sun with her feet up. 'Bzzz,' she says, which means, quite clearly, 'Five more minutes.' But she rises, and she hums off towards the Bee Garden, and the little bees fall in behind her.","Bzzz. (She is sitting very still, being queenly.)",3.2);
khNpc('gmo_robin','The Robin','gm_robin',d=>say("Tweet. Everything in the Bee Garden is perfectly fine, and I would like you to know that I am worried sick.",[BYE]),{sc:1.6});
wlGive('gmo_robin','gmq2',null,GMD2);
wlQ('gmq2','The Robin',[['Find the queen bee, somewhere warm at the end of a path, and tell her that the hive is waiting.',()=>gmF().gmq2a,['gmo_queen']]]);
// ---- 3. a letter for the knight ----
const GMD3=khQD("Do not stare, dear. It is rude to stare at a lady in stone. But since you are here, you may as well be of use. Three hundred years ago the knight on the other side of the garden, in the wisteria, wrote me a letter, and I never answered it, because I am made of stone, and the post is slow. I have written one now. It is very short. It says, Yes. Would you take it to him?",
  "Thank you, dear. He is in the Wisteria Walk, in the north west corner. He will be the one standing in the wisteria. He has been standing there a long time.",
  (n,m)=>gmF().gmq3a?'You have given it to him? Come and tell me what he said. I want the whole thing, and I want it slowly.':'The knight is in the Wisteria Walk, in the north west corner of the garden, standing in the wisteria.',
  "He said what? Oh, he did not! Say it again.",
  "Three hundred years, and all it took was a letter, and someone to carry it. Thank you, dear. Here, a little something for the post. I shall write to him again tomorrow.",
  "The knight is writing back. It will take a decade. We are in no hurry.","He has the letter.");
khNpc('gmo_stonelady','The Stone Lady','gm_lady',d=>say("I am not looking at you. I am looking at the knight, who is a very long way away.",[BYE]),{sc:1});
wlGive('gmo_stonelady','gmq3',null,GMD3);
khNpc('gmo_stoneknight','The Stone Knight','gm_knight',d=>{const F=gmF();
  if(qSt('gmq3')==='active'&&!F.gmq3a){F.gmq3a=1;yrStep('The knight has the letter.');return say("A small, folded square of paper. He reads it. For a long time there is no sound at all, except the wisteria. Then, very slowly, the knight lowers his sword and says, in a voice like a landslide, 'Yes?' He reads it again. 'YES?' he says. 'Tell her I will write back. Tell her it may take some time. Tell her I have a great deal to say.'",[BYE])}
  return say("The wisteria has grown over his boots. He does not mind. He is thinking about a letter.",[BYE])},{sc:1});
wlQ('gmq3','The Stone Lady',[['Take the stone lady\'s letter to the stone knight in the Wisteria Walk, in the north west corner of the garden.',()=>gmF().gmq3a,['gmo_stoneknight']]]);
// ---- 4. three torn pages ----
const GMD4=khQD("Psst. Down here. No, here. I am the prompter, which is a very quiet job, and I have a problem. The play on this stage, The Gardener and the Duke, is to be performed at midsummer, and the wind has taken the script. Three pages are lying about at the ends of the paths, in the quiet places, and without them the Duke will say the wrong lines, and the gardener will be very rude. Please would you fetch them?",
  "Thank you. Look at the ends of the paths, the dead ends. A page will be lying there, looking guilty.",
  (n,m)=>bagCount('gmpage')+' of 3 pages. They are lying at the ends of the paths, looking guilty.',
  "Pages! Yes! Page two, page five, and what is this, page nine? Perfect. Perfect, perfect, perfect.",
  "The Duke shall have his lines, and the gardener shall have a spade, and it will be the finest midsummer the theatre has ever had. Please take this, with my thanks, and come to the play. Seats are free. The hedges are not very comfortable.",
  "The play goes on at midsummer. The Duke is learning his lines. The gardener is practising being rude.","I have all three pages.");
khNpc('gmo_prompter','The Prompter','gm_saint',d=>say("Shhh. Not so loud. The actors are resting.",[BYE]),{sc:1});
wlGive('gmo_prompter','gmq4',null,GMD4);
wlQ('gmq4','The Prompter',[['Find three torn pages of the play at the ends of the paths, and bring them to the prompter in the Hedge Theatre.',()=>bagCount('gmpage')>=3,['gmo_prompter']]]);
