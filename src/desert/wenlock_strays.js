/* ==========================================================================
   WENLOCK: THE STRAYS (quests wlq11 and wlq12, ids wlo_goat1..5 and wlo_sheep1..5). Two more fetch quests, open as soon as the mayor's welcome is done:
   Farmer Giles has lost five goats and the wool merchant has lost five sheep, dotted about the town. Each animal is a step of its own (the log shows the next one and where it was
   last seen); clicking one when its quest is active sends it home. The town builder puts each one near its spot, off the roads (WL_QOBJ in wenlock_quests.js).
   ========================================================================== */
Object.assign(WL_REW,{wlq11:{gold:700,xp:7000},wlq12:{gold:800,xp:8000}});
WL_QUESTS.push(
  {id:'wlq11',giver:'Farmer Giles',title:'Five Runaway Goats',desc:'Five of Farmer Giles\' goats have got out of the top field and are somewhere about the town. Find them all.'},
  {id:'wlq12',giver:'A wool merchant',title:'Five Lost Sheep',desc:'Five of the wool merchant\'s sheep have wandered off from the wool yard. Find them all.'});
if(NPC_H.sheep===undefined)NPC_H.sheep=.5;
const WL_STRAYS=[
  {q:'wlq11',who:'Farmer Giles',kind:'goat',flag:'wlg',face:'kh_anim1_3',sc:.9,list:[
    ['Gruff',[46,16],'in the fields at the north end of town, near Farmer Giles.','Gruff looks at you, chews, and trots off home by himself. He does not say thank you.','Maaa. (Gruff is eating a hedge, and wants you to know it is his hedge.)'],
    ['Clover',[88,64],'among the apple trees of the orchard in the south-east.','Clover follows you for three steps, remembers she is a goat, and goes home the long way, eating the verge.','Maaa. (Clover is under an apple tree, hoping.)'],
    ['Thistle',[14,56],'in the meadow at the west end of town, below the High Street.','Thistle sighs, as if you have spoiled a very good plan, and ambles off home.','Maaa. (Thistle is staring at the horizon, planning something.)'],
    ['Barnaby',[38,33],'on the grass between the church and the market square.','Barnaby bleats once, loudly, to tell the whole town he is leaving on his own terms, and goes.','Maaa. (Barnaby is standing very still, in the hope that nobody has noticed him.)'],
    ['Nettle',[58,76],'in the meadow south of the village green, near the brook.','Nettle lets you hold a very small piece of her rope, and then leads you home. It was her idea.','Maaa. (Nettle is paddling in the brook, looking pleased with herself.)']]},
  {q:'wlq12',who:'A wool merchant',kind:'sheep',flag:'wll',face:'sheep',sc:1.2,list:[
    ['Dolores',[76,86],'near Wenlock Mill, at the far south-east.','Dolores gives you a long, flat look, says nothing at all, and strolls back to the wool yard.','Baa. (Dolores is looking at the mill wheel as if it owes her money.)'],
    ['Lord Fluff',[90,48],'at the east end of the High Street.','Lord Fluff allows you to say a few words, then turns, and processes back to the yard like a small, woolly bishop.','Baa. (Lord Fluff is standing in the road, blocking a cart, and does not care.)'],
    ['Pachamama',[68,60],'in the fields east of the market square.','Pachamama baas, flicks an ear, and wanders home. The cart behind her is very relieved.','Baa. (Pachamama is chewing something, and is not going to explain.)'],
    ['Alpaco',[66,24],'beside the big barn, in the north-east.','Alpaco bows his woolly head, turns about, and goes home with very great dignity indeed.','Baa. (Alpaco has got his head in a sack of oats, and is not coming out.)'],
    ['Brenda',[32,88],'in the south meadow across the brook.','Brenda sniffs, looks at the brook, looks at you, and decides you are almost as good as a bridge.','Baa. (Brenda is lying in the grass like a very large, very round cat.)']]}];
for(const S of WL_STRAYS){
  const ids=S.list.map((a,i)=>'wlo_'+S.kind+(i+1)),got=()=>S.list.reduce((n,a,i)=>n+(wlF()[S.flag+(i+1)]?1:0),0);
  S.list.forEach(([name,at,hint,foundLine,flavour],i)=>{
    const id=ids[i],flag=S.flag+(i+1);
    khNpc(id,name+(S.kind==='goat'?', a goat':', a sheep'),S.face,d=>{const F=wlF();
      if(qSt(S.q)==='active'&&!F[flag]){F[flag]=1;d.found=true;d.block=false;yrStep('You have found '+name+'. ('+got()+'/5)');return say(foundLine,[BYE])}
      return say(flavour,[BYE])},{sc:S.sc});
    WL_QOBJ.push({npc:id,k:()=>S.face,at,rad:6,o:{sc:S.sc}})});
  wlQ(S.q,S.who,S.list.map(([name,at,hint],i)=>['Find '+name+', '+(S.kind==='goat'?'a goat':'a sheep')+', last seen '+hint,()=>wlF()[S.flag+(i+1)],[ids[i]]]));
}
const WLD11=khQD("Five goats, gone! They were in the top field at breakfast, and by elevenses there was a hole in the hedge and a very smug sheep. They do it every spring, but never all five, and never in market week. They answer to Gruff, Clover, Thistle, Barnaby and Nettle, and to nothing else. Could you find them and send them home? They will not hurt you. They will only look at you as if you owe them rent.",
  "Bless you. They will be somewhere in town, wherever there is grass, or a hedge, or a bin. Tell them Giles sent you. They will not listen, but it is polite.",
  (n,m)=>n?n+' of '+m+' found. The rest are somewhere about town, on the grass, near a bin, or looking smug.':'Look wherever there is grass, or a hedge with a hole in it.',
  "All five? Let me count. One, two, three, four, five. And not one of them has said thank you. That is how I know they are mine.",
  "They are back in the top field, and already looking at the hedge. I shall mend it. I shall mend it badly. Take this, with my thanks.",
  "The goats are home. The hedge has a new hole. I have decided not to look at it.","All five are home.");
const WLD12=khQD("Sheep! Five of them, my best fleece-bearers, gone from the wool yard. Somebody left the gate open, and I will not say who, because it was me. They are called Dolores, Lord Fluff, Pachamama, Alpaco and Brenda, and each is worth more than the shop. They are not fast, but they are very, very stubborn, and they bite the hands that count them. Find them and send them home. Do not argue with them. They always win.",
  "Thank you. They will be about the town, wherever it is quiet and there is grass to be eaten. If one stares at you, take it as a mark of respect.",
  (n,m)=>n?n+' of '+m+' found. The others are about the town, looking at the grass.':'Look in the quiet places, the edges of town, and wherever a cart is blocked.',
  "All five home? Dolores, Fluff, Pachamama, Alpaco and Brenda? I shall count them twice, and then again, to be sure.",
  "They are in the yard, and all of them look as if the whole business was my fault. Which it was. Here, with my thanks, and a very fine bit of wool.",
  "The sheep are home, the gate is shut, and I have put a sign on it. The sign says SHUT. Dolores has read it, and is not impressed.","All five are home.");
wlGive('wlo_farmer','wlq11','wlq1',WLD11);
wlGive('wlo_merchant','wlq12','wlq1',WLD12);
