/* ==========================================================================
   SALE: THE TEN TRUST QUESTS (ids sa1 to sa10, journal area "Sale"). Every shop of Sale is barricaded. The keeper answers through the boards ("Go away", then "Prove you are friends"), and gives the party one job.
   Doing it takes the planks down (flag sa_open_<shop>, saApplyDoors in sale_town.js), opens the shop and changes the keeper's talk. Any order. Rewards are now generous in gold (four times the first figures), ordinary in experience (shown before the doubling of QREW_MUL).
     sa1  Pennyworth's Provisions   collect: 3 flasks of lamp oil from the ruined houses of Charnel Row (dead quarter)
     sa2  Ironbrow's Armoury        kill: Sir Ranulf the Hollow, a named wight at the south end of Charnel Row
     sa3  Stroud and Daughter       kill: 8 ghouls (the dead quarter and Hollin Farm)
     sa4  Marrowbone's Remedies     rescue: three apprentices hiding in the Hollow Cellar (601)
     sa5  The Dead Letter Scriptorium  deliver: a letter to the bellman on Bell Lane, and bring his reply back
     sa6  The Gilded Eye            retrieve: the stolen shop sign, from the ruined hut at Hollin Farm
     sa7  Madame Veil, Mourning Tailor  rescue: her nephew Pip, hiding in the Belfry (603)
     sa8  Crust and Cleaver         collect: 4 sacks of rye flour from Hollin Farm
     sa9  Vesper's Alembic          relic: grave-salt from the vault of the Sale Crypt (602)
     sa10 The Last Orders           serve: three ales to the three ghost regulars in the square
   ========================================================================== */
QAREA_ORDER.splice(Math.max(0,QAREA_ORDER.indexOf('Wenlock'))+1,0,'Sale');
const saF=()=>G.flags;
const SA_REW={sa1:{gold:1200,xp:4000},sa2:{gold:2000,xp:6500},sa3:{gold:2000,xp:6000},sa4:{gold:2400,xp:7000},sa5:{gold:1200,xp:4500},sa6:{gold:1800,xp:5500},sa7:{gold:2800,xp:8000},sa8:{gold:1400,xp:4500},sa9:{gold:3200,xp:9000,items:['potion5']},sa10:{gold:1600,xp:5000}};
function saQ(id,title,who,need,goal,desc,extra){
  const q=Object.assign({title,who,need,goal,reward:SA_REW[id]},extra||{});
  Object.defineProperty(q,'desc',{enumerable:true,get(){return typeof desc==='function'?desc():desc}});
  QUESTS[id]=q;QAREA[id]='Sale';return q}
const saFlagCount=(pre,n)=>()=>{let c=0;for(let i=1;i<=n;i++)if(saF()[pre+i])c++;return c};
/* the questions and answers: what the keeper says through the boards. offer / accept / remind(n,m) / ready / thanks / after, as khQD */
const SA_Q={
 sa1:{key:'general',who:'Tabitha Pennyworth',title:'Lamp Oil for Pennyworth',
  go:"A woman's voice, behind the planks: \"Go away. We are shut. We have been shut for nine years, and I have not changed my mind.\"",
  proof:"\"Prove you are friends. Everyone says they are friends. The last one who said so was a ghoul with a bad cough.\"",
  offer:"\"Tabitha Pennyworth, Pennyworth's Provisions. I have everything on these shelves except lamp oil, and without lamp oil I cannot light a lamp, and in this town that matters. There are flasks in the ruined houses on Charnel Row, in the dead quarter, where the storehouses were. Bring me three, and I will take the boards down.\"",
  accept:"\"Three flasks. They have a P scratched on the bottom. The dead quarter is south of Charnel Row, and the dead there are not friendly. Mind them.\"",
  remind:(n,m)=>`"Have you got the oil? That is ${n} of ${m} flasks. The ruined houses on Charnel Row, south of Candle Street."`,
  ready:"\"That clink. Is that glass? Is that oil? Put it through the gap.\"",
  thanks:"\"Three. All with a P on them. Wait there. I am coming out with the crowbar.\"",after:"\"The boards are down. Come in and spend something.\""},
 sa2:{key:'armour',who:'Sergeant Hob Ironbrow',title:'The Hollow Captain',
  go:"A gruff voice behind the planks: \"Go away. Armoury is shut. Move along.\"",
  proof:"\"Move along. Unless you can prove you are not one of Ranulf's.\"",
  offer:"\"Sergeant Hob Ironbrow, watch of Sale. Our captain was Sir Ranulf. He died on the wall in the plague and got up again, and now he walks the Charnel Yard at the south end of Charnel Row in his own armour, and takes any man of the watch who comes near. I cannot leave my door while he is out, and I cannot kill him, because he taught me how to fight. Kill Sir Ranulf the Hollow, and I will take the boards down.\"",
  accept:"\"He wears the old black plate and a blue light where his eyes were. He hits hard and he is slow. Do not go in without healing. The Charnel Yard is the end of Charnel Row, past the ruined houses.\"",
  remind:(n,m)=>'"Sir Ranulf is still walking. The Charnel Yard, south end of Charnel Row. Kill him and come back."',
  ready:"\"I felt it. The bell stopped for a moment. Tell me it is done.\"",
  thanks:"\"He is down. Thank you. Do you know, I would have given a great deal not to hear that. Wait there, I am taking the boards down myself.\"",after:"\"The door is open. Take what you like.\""},
 sa3:{key:'weapons',who:'Marta Stroud',title:'Ghouls at the Whetstone',
  go:"A woman's voice, behind the planks: \"Go away. We are shut. We are all shut.\"",
  proof:"\"Prove you are friends. I have a hammer, and I know where you are standing.\"",
  offer:"\"Marta Stroud, weaponsmith. I make the blades, my daughter makes the noise. Ghouls come out of the dead quarter at night and chew my whetstone, and the sound sets my teeth on edge, and I cannot work. Kill eight ghouls, in the dead quarter or at Hollin Farm, and I will take the boards down. I will count them. I count everything.\"",
  accept:"\"Eight. Ghouls, not skeletons. The skeletons do not chew. They only scrape.\"",
  remind:(n,m)=>`"${n} of ${m} ghouls. I can hear the rest of them. Eight, and you are done."`,
  ready:"\"It is quiet. I have not heard that sound in nine years. Is it done?\"",
  thanks:"\"Eight! I counted the bells. Wait there. Mind your fingers, the planks are old and have nails.\"",after:"\"The door is open. Buy something sharp.\""},
 sa4:{key:'apothecary',who:'Old Nan Marrowbone',title:'Three in the Cellar',
  go:"An old woman's voice, behind the planks: \"Go away. No cures today. No cures any day. Go away.\"",
  proof:"\"If you have come about the bell, I do not know anything. If you have come about the apprentices, speak up.\"",
  offer:"\"Nan Marrowbone, herbalist. I had three apprentices. They went down the cellar of the Ropewalk Cottage, on Charnel Row, to hide when the ghouls came, and the door stuck, and that was a month ago. I cannot go, my legs, and the cellar is full of the things that used to live in cellars. Find my three. Bring them out. I will take the boards down.\"",
  accept:"\"The Ropewalk Cottage is the second house on the west side of Charnel Row, in the dead quarter. The door is in the front room. Dorcas, Jory and Tam. Tell them I said to come home and be told off.\"",
  remind:(n,m)=>`"${n} of ${m} apprentices. The Ropewalk Cottage, on Charnel Row, down the cellar stair."`,
  ready:"\"I hear boots on the stair. Three pairs. Oh, my dears. Is it all of them?\"",
  thanks:"\"All three. Thank you, with my whole heart, and my knees. Wait there. I am taking the boards down myself.\"",after:"\"The door is open. Come in, dear. Sit.\""},
 sa5:{key:'books',who:'Ottoline Quill',title:'A Letter to the Bellman',
  go:"A woman's voice, behind the planks: \"Go away. We are shut. If you are here for a book, I have none.\"",
  proof:"\"Prove you are friends. Slip it under the door. Whatever it is. It had better be an apology.\"",
  offer:"\"Ottoline Quill, scrivener. I need a letter taken to Wick Tolliver, the bellman, in the little house on Bell Lane. We have not spoken in ten years. It is about a bell, and a quarrel, and a misunderstanding about a bell. I cannot go out and I will not put it through the boards. Take it to him, wait for his reply, bring it back, and I will take the boards down.\"",
  accept:"\"Here is the letter. Do not read it. It is sealed, and anyway, it is damp. He lives on the west side of Bell Lane. Do not let him offer you tea.\"",
  remind:(n,m)=>bagCount('sa_reply')?'"You have a reply. Slip it under the door."':bagCount('sa_letter')?'"Have you given Wick the letter? He lives on the west side of Bell Lane, in the little house."':'"I gave you a letter. Where is it? It is not on the street, is it?"',
  ready:"\"Three words? He wrote me three words? Give it here, through the gap.\"",
  thanks:"\"He said yes. After ten years. I knew he would. I knew it. Wait there, I am taking the boards down. I am putting on a better cardigan.\"",after:"\"The door is open. Mind the ink.\""},
 sa6:{key:'jeweller',who:'Silvio Gilt',title:'The Stolen Sign',
  go:"A man's voice, behind the planks: \"Go away. We are closed. Nothing of value is here. Nothing. Go.\"",
  proof:"\"If you are a thief, I have nothing. If you are not a thief, I am still sure I have nothing.\"",
  offer:"\"Silvio Gilt, jeweller. Somebody took the sign off my door. It is a gilded eye, carved, on a bracket. A ghoul took it, I think, for the shine, and carried it to Hollin Farm, in the south east. A shop without its sign is a shop nobody finds. Bring the Gilded Eye back, and I will take the boards down.\"",
  accept:"\"It is in a ruined hut at Hollin Farm. Follow the Back Track east past Tanners' Lane. Mind the dead.\"",
  remind:(n,m)=>'"The Gilded Eye. It is at Hollin Farm, in the ruined hut. Please hurry. I can see my own bracket from here, and it looks bare."',
  ready:"\"That is my sign. I can tell by the sound it makes. Put it through the gap.\"",
  thanks:"\"My Eye. Look at it. Scratched. Still the finest sign in Sale. Wait there, I am coming out for the ladder.\"",after:"\"The door is open, and so is the Eye. Come in.\""},
 sa7:{key:'tailor',who:'Madame Orla Veil',title:'The Boy in the Belfry',
  go:"A woman's voice, sharp, behind the planks: \"Go away. I am not in. I am not dressed for visitors.\"",
  proof:"\"Prove you are friends. You do not look like friends. You look like you need a hem.\"",
  offer:"\"Madame Orla Veil, mourning tailor. My nephew Pip climbed up the belfry on the day the ghouls came, and he has not come down. I can hear the bell ring when the wind does not blow. He is eleven. I cannot climb. I am sixty. Go up, bring him out, and I will take the boards down.\"",
  accept:"\"The Belfry is the black tower at the top of Bell Lane. He will be at the top, under the bell. There are ravens. And something worse. Mind your step.\"",
  remind:(n,m)=>'"My nephew. The Belfry, top of Bell Lane. Please. I can hear the bell."',
  ready:"\"That is his voice. Tell me that is his voice.\"",
  thanks:"\"Pip! You wretched, wonderful boy! Wait there. Wait there, both of you, I am putting down my shears.\"",after:"\"The door is open. Pip is under the table. Do not ask.\""},
 sa8:{key:'butcher',who:'Hettie Mawd',title:'Flour from Hollin Farm',
  go:"A woman's voice, behind the planks: \"Go away. No meat today. No bread either.\"",
  proof:"\"Prove you are friends, and prove you are not hungry. I cannot feed anybody. I have no flour.\"",
  offer:"\"Hettie Mawd, Crust and Cleaver. Butcher and baker, the only one in Sale. I have meat, I have an oven, and I have not a grain of flour. The mill at Hollin Farm, south east, has sacks of rye in the ruins. Bring me four. I will make you the best loaf you have ever had, and I will take the boards down.\"",
  accept:"\"Four sacks, the ones stamped with a wheatsheaf. They are in the ruins at Hollin Farm. Mind the dead. They like flour too, for some reason.\"",
  remind:(n,m)=>`"${n} of ${m} sacks of flour. Hollin Farm, south east, down the Back Track."`,
  ready:"\"I can smell that. Dry rye. Put it through the gap.\"",
  thanks:"\"Four sacks! Proper flour. The oven is already warm. Wait there, I am taking the boards down.\"",after:"\"The door is open, and the bread is in.\""},
 sa9:{key:'alchemist',who:'Master Orrin Vesper',title:'Grave-Salt from the Crypt',
  go:"A man's voice, thin and irritable, behind the planks: \"Go away. The alembic is shut. I am in the middle of something.\"",
  proof:"\"If you are going to ask for a potion, there is none. If you are going to ask for the recipe, there is none of that either.\"",
  offer:"\"Orrin Vesper, alchemist. I need grave-salt, a fist of it. It grows on the walls of the Sale Crypt where the damp gets in, at the end of Charnel Row, down the stair. It is the one thing I cannot make and cannot do without. Fetch me a piece, from the vault at the far end, and I will take the boards down.\"",
  accept:"\"The crypt is down the stair at the south end of Charnel Row. The salt is in the vault, white and cold. The dead in there will not like you taking it. Good luck.\"",
  remind:(n,m)=>'"The grave-salt. The Sale Crypt, down the stair at the end of Charnel Row, in the vault at the far end."',
  ready:"\"Is that cold? Is it white? Is it the salt? Put it through the gap.\"",
  thanks:"\"Splendid. The best I have seen. Wait there, I am coming out, and I am bringing nothing flammable.\"",after:"\"The door is open. Do not touch the green flask.\""},
 sa10:{key:'tavern',who:'Big Bram Cobb',title:'A Round for the Dead',
  go:"A deep voice, behind the planks: \"Go away. Closed. Last orders was nine years ago.\"",
  proof:"\"Prove you are friends. A friend would buy a round. A friend would buy three.\"",
  offer:"\"Bram Cobb, landlord of the Last Orders. I have three regulars standing in the square who have not had a drink in nine years. Old Tobias Lamb, Mad Meg Hollow and Ned the Drover. They are ghosts. They cannot hold a mug, but they can take a drink if it is put to them properly. I am passing you three ales through the gap. Take one to each of them, and I will take the boards down.\"",
  accept:"\"Here, three mugs. They are in the square, near the fountain and by my door. Go on. They will be very polite about it.\"",
  remind:(n,m)=>`"${n} of ${m} drinks. Tobias Lamb, Meg Hollow and Ned the Drover, in Gibbet Square."`,
  ready:"\"I heard a cheer. Faint. Did they cheer?\"",
  thanks:"\"A round for the dead. That is the best thing anyone has done in this town in nine years. Wait there, the planks are coming down.\"",after:"\"The door is open. A bed is upstairs.\""}};
/* the quests themselves: what is asked, and how the log counts it */
saQ('sa1',SA_Q.sa1.title,SA_Q.sa1.who,3,()=>bagCount('sa_oil'),'Bring 3 flasks of lamp oil from the ruined houses on Charnel Row (the dead quarter, south of Candle Street) to Tabitha Pennyworth at the barricaded general store.',{take:{sa_oil:3}});
saQ('sa2',SA_Q.sa2.title,SA_Q.sa2.who,1,()=>(saF().k_saranulf||0)>0?1:0,"Kill Sir Ranulf the Hollow, the wight who walks the Charnel Yard at the south end of Charnel Row, and tell Sergeant Hob Ironbrow at the barricaded armoury.");
saQ('sa3',SA_Q.sa3.title,SA_Q.sa3.who,8,q=>Math.min(8,(saF().k_saghoul||0)-(q.base||0)),'Kill 8 ghouls, in the dead quarter or at Hollin Farm, then tell Marta Stroud at the barricaded weaponsmith.',{cnt:'k_saghoul'});
saQ('sa4',SA_Q.sa4.title,SA_Q.sa4.who,3,saFlagCount('sa4_',3),()=>saF().sa4_1||saF().sa4_2||saF().sa4_3?'Find the rest of Nan Marrowbone\'s three apprentices in the Hollow Cellar, under the Ropewalk Cottage on Charnel Row.':'Find the three apprentices in the Hollow Cellar, under the Ropewalk Cottage (second house on the west side of Charnel Row), and tell Nan Marrowbone.');
saQ('sa5',SA_Q.sa5.title,SA_Q.sa5.who,1,()=>bagCount('sa_reply')?1:0,()=>bagCount('sa_reply')?'Take the bellman\'s reply back to Ottoline Quill at the barricaded Dead Letter Scriptorium.':'Take the letter to Wick Tolliver, the bellman, in the little house on the west side of Bell Lane, and bring his reply back to Ottoline Quill.',{give:'sa_letter',take:{sa_reply:1}});
saQ('sa6',SA_Q.sa6.title,SA_Q.sa6.who,1,()=>bagCount('sa_sign'),'Find the Gilded Eye, the stolen shop sign, in the ruined hut at Hollin Farm (south east, along the Back Track), and take it to Silvio Gilt at the barricaded jeweller.',{take:{sa_sign:1}});
saQ('sa7',SA_Q.sa7.title,SA_Q.sa7.who,1,()=>saF().sa7a?1:0,'Climb the Belfry, the black tower at the top of Bell Lane, and find Madame Veil\'s nephew Pip at the top. Then tell Madame Veil at the barricaded tailor.');
saQ('sa8',SA_Q.sa8.title,SA_Q.sa8.who,4,()=>bagCount('sa_flour'),'Bring 4 sacks of rye flour from the ruins of Hollin Farm (south east, along the Back Track) to Hettie Mawd at the barricaded Crust and Cleaver.',{take:{sa_flour:4}});
saQ('sa9',SA_Q.sa9.title,SA_Q.sa9.who,1,()=>bagCount('sa_gravesalt'),'Fetch grave-salt from the vault at the far end of the Sale Crypt (the stair at the south end of Charnel Row) and take it to Master Orrin Vesper at the barricaded alchemist.',{take:{sa_gravesalt:1}});
saQ('sa10',SA_Q.sa10.title,SA_Q.sa10.who,3,saFlagCount('sa10_',3),()=>'Give an ale to each of the three ghost regulars in Gibbet Square (Tobias Lamb, Meg Hollow and Ned the Drover), then tell Big Bram Cobb at the barricaded Last Orders.');
const SA_QSHOP={};for(const id in SA_Q)SA_QSHOP[id]=SA_Q[id].key;
/* the voice behind the boards, and the way it leads from "Go away" to the quest and back */
for(const id in SA_Q){const Q=SA_Q[id],key=Q.key,sp=SA_SPEC[key];
  khNpc('sa_b_'+key,Q.who+', behind the boards',null,d=>{
    const F=saF(),st=qSt(id);
    if(saShopOpen(key))return say(Q.after,[BYE]);
    if(st===null&&!F['sa_met_'+key])return say(Q.go,[['Say you mean no harm.',()=>{F['sa_met_'+key]=1;return say(Q.proof,[['Ask what they need.',()=>qNode(id,saDlg(id))],['Leave.',()=>null]])}],['Leave.',()=>null]]);
    return qNode(id,saDlg(id))});
  QGIVER['sa_b_'+key]=[id]}
function saDlg(id){const Q=SA_Q[id];return khQD(Q.offer,Q.accept,Q.remind,Q.ready,Q.thanks,Q.after,'Here you go.')}
/* handing in opens the shop */
function saOpenShop(key){
  const F=saF();F['sa_open_'+key]=1;sfx('door');msg('The planks come down, one by one. '+SA_SPEC[key].name+' is open.','#ffe36a');saApplyDoors()}
{const _qt=qTurnIn;qTurnIn=function(id){const r=_qt.apply(this,arguments);try{if(r&&SA_QSHOP[id])saOpenShop(SA_QSHOP[id])}catch(e){console.error(e)}return r}}
{const _qa=qAccept;qAccept=function(id){_qa.apply(this,arguments);if(id==='sa10')for(let i=0;i<3;i++)bagAdd(mkItem('ale'));if(id==='sa4'||id==='sa7')try{msg('Tip: the way down is a door in the dead quarter.','#a8b8d8')}catch(e){}}}
/* the three ghost regulars take their ale */
SA_REGS.forEach(([id],i)=>{const n=i+1;yrHook(id,d=>{const F=saF();
  if(qSt('sa10')==='active'&&!F['sa10_'+n]){
    if(bagCount('ale')<1)return say("A ghost looks at your hands, and then at your face. \"Come back with a drink, would you? I would be ever so grateful.\"",[BYE]);
    bagRemove('ale',1);F['sa10_'+n]=1;yrStep(['Old Tobias Lamb','Mad Meg Hollow','Ned the Drover'][i]+' has had a drink.');
    return say(["He takes the mug in both hands, and the ale goes down his throat and out of the back of his neck, and he does not seem to mind. \"Oh, that is good. Oh, that is the real thing. Thank you.\" He sits down on the cobbles, looking happier than any ghost you have seen.","She holds the mug up to the light, says \"To the Last Orders\", and drinks it in one go. The ale puddles on the cobbles. She looks at it with great pleasure. \"I never could finish one,\" she says. \"Now I never need to.\"","Ned takes the mug and downs it, and the beer falls through him and splashes on his boots. \"That is the best pint I never had,\" he says, and wipes his mouth on a sleeve that is not there."][i],[BYE])}
  return null})});
/* ---- what lies about for the quests, and the dead of the two zones ---- */
function saPlaceQuest(C){
  const {items,near,used,foe}=C,put=(k,x,y,r)=>{const q=near(x,y,r||4);if(q){used.add(q[0]+','+q[1]);items.push({k,x:q[0],y:q[1]})}};
  for(const [x,y] of [[17,44],[23,48],[17,56]])put('sa_oil',x,y);
  for(const [x,y] of [[60,56],[66,60],[61,65],[67,65]])put('sa_flour',x,y);
  put('sa_sign',62,63,3);
  const DEAD=[['saghoul',16,46],['saghoul',23,46],['saghoul',14,52],['saghoul',24,52],['saghoul',18,56],['saghoul',26,58],['saghoul',12,60],['saskel',22,42],['saskel',15,48],['saskel',25,56],['saskel',10,50],
    ['sapike',28,52],['sapike',14,58],['sazombie',11,44],['sazombie',30,60],['sawight',24,64],['sawight',13,64],['sabmage',28,46],['sagiant',32,54],['saranulf',23,60]];
  const FARM=[['saghoul',60,57],['saghoul',66,63],['saghoul',59,64],['saghoul',64,66],['sazombie',62,61],['sazombie',67,58],['saskel',58,60],['saskel',65,65],['sawight',66,66]];
  for(const [t,x,y] of DEAD.concat(FARM))foe(t,x,y)}
/* ---- the rings and marks on the maps: a gold ! over every keeper with a job, a ? once it is done (the engine's marks follow QGIVER); the ring points at the thing to do ---- */
if(typeof QRF!=='undefined'){
  const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx}),I=(l,id)=>({lvl:l,item:id}),b=k=>N(SA.ID,'sa_b_'+k);
  const T=QRF.T;
  T.sa1={give:[b('general')],act:[I(SA.ID,'sa_oil')],ready:[b('general')]};
  T.sa2={give:[b('armour')],act:[E(SA.ID,/^saranulf$/)],ready:[b('armour')]};
  T.sa3={give:[b('weapons')],act:[E(SA.ID,/^saghoul$/)],ready:[b('weapons')]};
  T.sa4={give:[b('apothecary')],act:[N(SA.CELLAR,'sa_surv1','sa_surv2','sa_surv3')],ready:[b('apothecary')]};
  T.sa5={give:[b('books')],act:()=>bagCount('sa_reply')?[b('books')]:[N(SA.ID,'sa_ringer')],ready:[b('books')]};
  T.sa6={give:[b('jeweller')],act:[I(SA.ID,'sa_sign')],ready:[b('jeweller')]};
  T.sa7={give:[b('tailor')],act:[N(SA.BELFRY,'sa_pip')],ready:[b('tailor')]};
  T.sa8={give:[b('butcher')],act:[I(SA.ID,'sa_flour')],ready:[b('butcher')]};
  T.sa9={give:[b('alchemist')],act:[I(SA.CRYPT,'sa_gravesalt')],ready:[b('alchemist')]};
  T.sa10={give:[b('tavern')],act:()=>[N(SA.ID,...['sa_reg1','sa_reg2','sa_reg3'].filter((id,i)=>!saF()['sa10_'+(i+1)]))],ready:[b('tavern')]};
  QRF.LOC[SA.ID]='sale';QRF.LOC[SA.CELLAR]='sale';QRF.LOC[SA.CRYPT]='sale';QRF.LOC[SA.BELFRY]='sale'}
