/* ==========================================================================
   OLDHAVEN, ACT 2: THE SIEGE. When the six names are settled, Vance's Ash Guard seize the east gate. The city holds out: bread for the
   wall, timber for the breach, cats for the grain stores, pigeons for the post, families to the chapel, a tunnel from the bakery, and
   two fights at the gate. Eight quests, all small and plain. The siege ends when the second fight is won.
   ========================================================================== */
ENEMY_DEF.ashguard={name:'Ash Guard',hp:90,dmg:[8,13],hit:.76,w:.55,img:'yar_p_rguard',xp:160,gold:[20,60],speed:1,verb:'cuts',aboveParty:1};
const SGF=()=>{const F=G.flags;return F.sg||(F.sg={fam:{},pig:{},spawn:0})};
const sgq=(id,t,who,desc,need,goal,reward,extra)=>{QUESTS[id]=Object.assign({title:t,who,desc,need,goal,reward},extra||{});QAREA[id]='Oldhaven'};

/* ---- the Ash Guard at the east gate ---- */
function ohSiegeSync(){ // called when the party is in Oldhaven: put the waiting Ash Guard on the east road
  const S=SGF();if(LEVEL!==OH.ID||!S.spawn)return;
  let n=S.spawn;
  for(let x=140;x>=124&&n>0;x--)for(const y of [73,74,75,72]){
    if(n<=0)break;if(!G.grid[y]||G.grid[y][x]!==0||cellBlocked(x,y)||enemyAt(x,y))continue;
    addEnemy('ashguard',x,y,true);n--;
  }
  S.spawn=n;
}
const SG_ON={sg1:()=>{G.flags.siege=1;SGF().spawn+=6;msg('Smoke rises from the east gate. The Ash Guard have taken it.','#ff9a7a');ohSiegeSync()},sg8:()=>{SGF().spawn+=10;ohSiegeSync()}};
{const _qa=qAccept;qAccept=function(id){const r=_qa.apply(this,arguments);if(SG_ON[id])SG_ON[id]();return r}}
{const _oe=ohEnter;ohEnter=function(n){_oe.apply(this,arguments);if(n===OH.ID){ohSiegeSync();if(G.flags.siege&&!G.flags.siegeWon&&!SGF().said){SGF().said=1;msg('The city is under siege. The east gate is held by the Ash Guard.','#ff9a7a')}}}}

/* ---- the folk of the siege, placed in the city by ohBuild ---- */
const SG_FOLK=[
 {id:'oh_s_mason',n:'Dunstan, the mason',face:'kh_ohfolk4_1',at:[70,60]},
 {id:'oh_s_cats',n:'Gammer Wick, of the Cats Guild',face:'kh_ohfolk3_1',at:[86,60]},
 {id:'oh_s_falc',n:'Rook, the falconer',face:'kh_ohfolk6_5',at:[64,62]},
 {id:'oh_s_tobias',n:'Tobias, the crier',face:'kh_ohfolk6_4',at:[80,62]},
 {id:'oh_s_boy',n:'Little Ned, who keeps pigeons',face:'kh_ohfolk1_5',at:[76,64]},
 {id:'oh_s_fam1',n:'A young mother and her children',face:'kh_ohfolk3_4',at:[62,70]},
 {id:'oh_s_fam2',n:'An old man and his grandson',face:'kh_ohfolk3_3',at:[84,70]},
 {id:'oh_s_fam3',n:'An egg seller and her family',face:'kh_ohfolk3_1',at:[66,76]},
 {id:'oh_s_fam4',n:'A washerwoman and her sisters',face:'kh_ohfolk7_2',at:[82,76]}
];
const OH_SIEGEFOLK=SG_FOLK.map(f=>[f.id,f.at[0],f.at[1]]);
const sgSay=(id,pre)=>say(pre,[BYE]);
SG_FOLK.forEach(f=>{
  const fam=/fam/.test(f.id),pig=['oh_s_falc','oh_s_tobias','oh_s_boy'].includes(f.id);
  khNpc(f.id,f.n,f.face,()=>{
    const S=SGF(),F=G.flags;
    if((f.id==='oh_s_mason'||f.id==='oh_s_cats')&&!F.siege)return say(f.id==='oh_s_mason'?'Good stone, honest mortar. Oldhaven walls will outlast us all.':'My cats keep the rats out of the grain. They also keep the grain, in a sense.',[BYE]);
    if(f.id==='oh_s_mason')return qNode('sg3',SGD.sg3);
    if(f.id==='oh_s_cats')return qNode('sg4',SGD.sg4);
    if(pig){
      if(qSt('sg5')==='active'&&!S.pig[f.id]){S.pig[f.id]=1;return say(f.id==='oh_s_falc'?'Yes, I will send a hawk with a message to the forest. Birds do not need a gate. Tell the captain it is done.':f.id==='oh_s_tobias'?'Hear ye: pigeons for the captain. I will have them in the loft by dusk, and I will not say a word. That is a joke. I will say several words.':'My pigeons can reach the north fort in half a day! I will send three. They are called Pie, Crumb and Sir Flaps.',[BYE])}
      if(qSt('sg5')==='done')return say('The birds are flying. Thank you for the idea.',[BYE]);
      return say(f.id==='oh_s_boy'?'I keep pigeons on the roof of the cookshop. They are rude but fast.':f.id==='oh_s_falc'?'A good hawk can carry a note. A bad hawk carries off the pigeon.':'Hear ye: the siege is on, the fish is off, and the bread is rationed.',[BYE]);
    }
    if(fam){
      if(qSt('sg6')==='active'&&!S.fam[f.id]){S.fam[f.id]=1;return say('The chapel? Yes, we will go now. Thank you. We were afraid to leave the house.',[BYE])}
      return say(qSt('sg6')==='done'?'We are safe at the chapel. Thank you.':'We heard the bells. We are packing a bag. Is it dangerous?',[BYE]);
    }
    return say('Peace be with you.',[BYE]);
  },{q:f.id==='oh_s_mason'?'sg3':f.id==='oh_s_cats'?'sg4':undefined});
});

/* ---- the quests ---- */
sgq('sg1','Smoke at the East Gate','Captain Aldwyn, of the Gate','Vance\'s Ash Guard have taken the east gate. Fight them off the east road. Kill 6 of them.',6,q=>(G.flags.k_ashguard||0)-(q.base||0),{gold:800,xp:8000},{cnt:'k_ashguard'});
sgq('sg2','Bread for the Wall','Sergeant Cade, of the garrison','The garrison is short of food. Bring Sergeant Cade 8 loaves of bread. The bakeries, the Cookshop and the stalls sell it.',8,()=>Math.min(8,bagCount('bread')),{gold:400,xp:4000});
sgq('sg3','Mend the Wall','Dunstan, the mason','The wall near the east gate has a crack. Bring Dunstan 5 pieces of wood to brace it. Wood is sold in general stores.',5,()=>Math.min(5,bagCount('wood')),{gold:500,xp:4500});
sgq('sg4','The Cats Guild','Gammer Wick, of the Cats Guild','The grain stores are full of rats, and the cats are tired. Give Gammer Wick 3 herrings for the cats.',3,()=>Math.min(3,bagCount('herring')),{gold:300,xp:3500});
sgq('sg5','Pigeon Post','Captain Aldwyn, of the Gate','The city needs word sent to the north fort. Speak to the three pigeon keepers: Rook the falconer, Tobias the crier and Little Ned.',3,()=>Object.keys(SGF().pig).length,{gold:500,xp:5000});
sgq('sg6','Out of the Fire','Sergeant Cade, of the garrison','Four families near the east wall are still in their homes. Tell each to go to the chapel: a young mother, an old man, an egg seller and a washerwoman.',4,()=>Object.keys(SGF().fam).length,{gold:600,xp:6000});
sgq('sg7','The Bakery Tunnel','Perrin, the baker','Perrin\'s second oven door leads to an old tunnel under the wall. Bring her 3 torches to light it, and it can carry supplies.',3,()=>Math.min(3,bagCount('torch')),{gold:700,xp:6500});
sgq('sg8','The Sortie','Captain Aldwyn, of the Gate','The wall is mended, the people are safe and the tunnel is open. Now take the east gate back. Kill 10 more Ash Guard.',10,q=>(G.flags.k_ashguard||0)-(q.base||0),{gold:2500,xp:18000},{cnt:'k_ashguard'});

const SGD={
 sg1:khQD('Smoke, and trumpets. The Ash Guard have the east gate, and the order came from Vance\'s office. We have one route in and out, the quay. Will you clear the east road? There are about six of them, and they are not good soldiers, but they are many.','Good. The road is the one east of the square. Mind the crossbows on the gate.',(g,n)=>`Six Ash Guard on the east road, and you have beaten ${g} of ${n}.`,'The road is clear. Thank you. They will be back, so rest while you can.','Six down. Take this, from the king\'s purse.','Well done at the gate.','Six of them are dead.'),
 sg2:khQD('We are short on bread, and a soldier on a thin loaf is a soldier who complains. Bring me eight loaves, and I will not tell the captain how many you ate on the way.','Thank you. Eight loaves. The bakeries and the cookshop have them.',(g,n)=>`Eight loaves, you have ${g}.`,'Eight loaves! The cooks will weep. Take your reward.','Eight loaves for the garrison. Take this.','The garrison is fed, thanks to you.','Here are eight loaves.'),
 sg3:khQD('There is a crack in the wall near the east gate. I need five pieces of wood to brace it before they bring up the ram. Can you find me some?','Five pieces of wood. General stores sell them.',(g,n)=>`Five pieces of wood, you have ${g}.`,'That will hold. Thank you. I will put a good brace on it.','Five pieces of wood. Take your pay.','The wall is holding.','Here is the wood.'),
 sg4:khQD('The rats are eating the grain, and my cats are tired. Cats work for fish. Three herrings should keep the guild going all week. Can you spare them?','Three herrings. I will tell the cats. They will pretend not to care.',(g,n)=>`Three herrings, you have ${g}.`,'The cats are purring so loudly the rats are leaving. Take this.','Three herrings. A fair trade.','The cats are working hard.','Here are three herrings.'),
 sg5:khQD('The north fort is half a day away, and the gate is shut. We have pigeons, and three people who keep them. Speak to Rook the falconer, Tobias the crier and Little Ned, and tell each to send a bird.','Three keepers, three birds. Good luck.',(g,n)=>`${g} of ${n} pigeon keepers told.`,'All three birds are away. We will have an answer by dusk.','The birds are flying. Take this.','The pigeons are flying.','All three are told.'),
 sg6:khQD('Four families live next to the east wall, and they will be in the way of the fighting. A young mother, an old man, an egg seller and a washerwoman. Tell each to go to the chapel. Can you do that?','Four families to the chapel. Thank you.',(g,n)=>`${g} of ${n} families told.`,'All four families are safe. Take this.','Four families, safe. Take this.','The families are safe.','All four are told.'),
 sg7:khQD('Come in, quietly. My second oven door leads to an old tunnel under the wall. It ends in the cellar of the garrison. If we light it, we can carry bread under the siege lines. I need three torches. Can you bring them?','Three torches. Quick as you can.',(g,n)=>`Three torches, you have ${g}.`,'Three torches. The tunnel is lit, and the bread can flow. Here.','Three torches, and a tunnel full of bread.','The tunnel is open.','Here are three torches.'),
 sg8:khQD('The wall is mended, the people are safe, and the bread is flowing under the wall. We have one chance to take the east gate back. I need you in front. Kill ten more of the Ash Guard, and the gate is ours again.','Ten more. I will watch from the wall. Go.',(g,n)=>`Ten Ash Guard, you have beaten ${g} of ${n}.`,'The gate is ours! Take this, from the whole city.','The siege is over, and the king owes you a great deal.','The gate is open, and the city is free.','The gate is ours.')
};
repWrap('oh_cap',()=>qSt('oq0')==='done'&&qSt('sg1')!=='done','About the east gate',()=>qNode('sg1',SGD.sg1));
repWrap('oh_cap',()=>qSt('sg1')==='done'&&qSt('sg5')!=='done','About the pigeon post',()=>qNode('sg5',SGD.sg5));
repWrap('oh_cap',()=>qSt('sg1')==='done'&&qSt('sg7')==='done'&&qSt('sg8')!=='done','About retaking the gate',()=>qNode('sg8',SGD.sg8));
repWrap('oh_sergeant',()=>qSt('sg1')==='done'&&qSt('sg2')!=='done','About the bread',()=>qNode('sg2',SGD.sg2));
repWrap('oh_sergeant',()=>qSt('sg1')==='done'&&qSt('sg6')!=='done','About the families',()=>qNode('sg6',SGD.sg6));
repWrap('oh_x_baker',()=>qSt('sg1')==='done'&&qSt('ox3')==='done'&&qSt('sg7')!=='done','About the tunnel',()=>qNode('sg7',SGD.sg7));
// the siege ends when the sortie is handed in
{const _qt=qTurnIn;qTurnIn=function(id){const r=_qt.apply(this,arguments);if(id==='sg8'){G.flags.siegeWon=1;G.flags.siege=0;msg('The east gate is open again. The siege of Oldhaven is over.','#a8e8a0')}return r}}
