/* ==========================================================================
   THE VOYAGE. The next part of the main story.
   The party fled the western kingdom with a forged warrant on their heads. In Khemetra the wizard Ishkander vouched for them.
   Now the king of Khemetra returns, and the audience shows who really wants them dead: Lord Corvane, Warden of the western
   Crown, who has put twenty thousand crowns on each of their heads and sent knives after them into the city. His black ship, the
   Black Heron, is hunting off Yarrim. The party must leave by sea in the Dawn Walker and follow the three pages of the master
   ledger, copied by his exiled scribe Isolde and hidden on the islands of the Narrow Sea, then carry it home to the court of
   King Osric at Oldhaven.
   Quests: mq1 mq2 (Khemetra), yar2 .. yar7 (the road to Yarrim), vq1 .. vq5 (the islands and home).
   ========================================================================== */
for(const n of ['bench','ship_dawn','ship_heron','palms','tent','arch','wreck','runestone','crystals','bones','altar','p_king','p_corvane','p_maeve','p_aldous','p_ketra','p_isolde'])loadImg('yar_'+n,'assets/yar_'+n+'.png');
Object.assign(NPC_H,{yar_bench:.62,yar_ship_dawn:2.6,yar_ship_heron:2.8,yar_palms:1.7,yar_tent:1.0,yar_arch:1.6,yar_wreck:1.7,yar_runestone:1.4,yar_crystals:.9,yar_bones:.55,yar_altar:.95,yar_p_king:1,yar_p_corvane:1,yar_p_maeve:.95,yar_p_aldous:.92,yar_p_ketra:.72,yar_p_isolde:.9});
Object.assign(ENEMY_DEF,{
  assassin:{name:'Assassin',hp:70,dmg:[9,14],hit:.8,w:.5,img:'assassin',xp:140,gold:[40,90],speed:1,verb:'stabs',aboveParty:1},
  cinder:{name:'Cinder Guardian',hp:260,dmg:[11,17],hit:.8,w:1.3,img:'yar_crystals',xp:900,gold:[200,320],speed:1,verb:'smashes',aboveParty:2},
  corvane:{name:'Lord Corvane',hp:340,dmg:[12,19],hit:.84,w:.42,img:'yar_p_corvane',xp:2400,gold:[600,900],speed:1,verb:'cuts',aboveParty:3}
});
const MQ={};
const QAREA_SEA=n=>{QAREA_ORDER.splice(QAREA_ORDER.indexOf('Yarrim')+1,0,n)};
QAREA_SEA('The Narrow Sea');
const vq=(id,t,who,desc,need,goal,reward,extra)=>{QUESTS[id]=Object.assign({title:t,who,desc,need,goal,reward},extra||{});QAREA[id]='The Narrow Sea'};
const mq=(id,t,who,desc,need,goal,reward,extra)=>{QUESTS[id]=Object.assign({title:t,who,desc,need,goal,reward},extra||{});QAREA[id]='Khemetra'};

/* ---- 1. until the king returns ---- */
mq('mq1','Until the King Returns','Ishkander, the wizard','Ishkander says the king of Khemetra comes home from his summer court in three days. Stay in the city, stay alive, and go to the palace when the trumpets sound. There is a price on your heads, and knives are looking for you.',1,khFlag('kingBack'),{gold:200,xp:800});
mq('mq2','The King\'s Audience','King Rahotep','King Rahotep has returned and will hear your story in the throne room of the palace.',1,khFlag('audience'),{gold:500,xp:2000});
const DM1=khQD('The king of Khemetra comes home from his summer court in three days, and I have sent word ahead. Until then, stay in the city. Stay awake, too. The warrant that brought you here has a price on it, twenty thousand crowns on each of your heads, and that kind of money buys knives. They have long reach, and Khemetra has a great many doors.','Walk in the open, sleep at an inn, and do not open a door you do not have to. If a stranger in grey comes close, kill him first and ask who he was afterwards.',(n,m)=>'The king is not home yet. Stay alive, and keep your swords close. There will be more of them.','You heard the trumpets? Then the king is home.','He will see you straight away. Say plainly what happened. He values plain speech, and I will be standing at his side.','The king is home. Go to the throne room in the palace. Do not keep a king waiting.','The trumpets have sounded.');
const DM2=khQD('The throne room is open. King Rahotep waits there.','Go now. Walk straight in.',(n,m)=>'The king is waiting in the throne room.','The audience is over? Then you know now what you are fighting.','Rahotep keeps his word. Go, and see the vizier.','You have spoken with the king. The Sea Gate is the next door.');
repWrap('kh_ishkander',()=>G.flags.scoriaWizard,'About the king',()=>{
  const F=G.flags;if(qSt('mq1')==='done'&&qSt('mq2')==='done')return say('You have spoken with the king? Good. The vizier will do the rest. The Sea Gate in the east wall was sealed for a reason, but I think the reason has run out.',[BYE]);
  if(qSt('mq1')==='active'&&F.mqDay0===undefined)F.mqDay0=dayNum();
  if(qSt('mq1')===null)return say(DM1.offer,[['We will be careful.',()=>{qAccept('mq1');F.mqDay0=dayNum();return say(DM1.accept,[BYE])}],['Not now.',()=>null]]);
  if(qSt('mq1')!=='done')return qNode('mq1',DM1);
  return qNode('mq2',DM2);
});

/* ---- 2. the assassins in Khemetra ---- */
const MQ_STALK=['A cloaked figure peels away from the crowd and walks straight toward you. A blade glints under the cloak.','Someone behind you has been keeping step with you for three streets. Now the footsteps stop, and a knife is drawn.','A man in grey drops from a low roof into the street and does not say a word.','A beggar rises from a doorway. His hands are steady and very clean. There is a dagger in each.','The crowd parts. One figure does not part with it. "Twenty thousand crowns," he says quietly, and comes on.'];
function mqStalk(){
  const F=G.flags,P=G.P;let c=null;
  for(let i=0;i<60&&!c;i++){
    const a=Math.random()*TAU,d=5+Math.random()*4,x=Math.round(P.x+Math.cos(a)*d),y=Math.round(P.y+Math.sin(a)*d);
    if(x<2||y<2||x>=MW-2||y>=MH-2)continue;
    if(G.grid[y][x]!==0||cellBlocked(x,y)||enemyAt(x,y))continue;c=[x,y];
  }
  if(!c)return;
  addEnemy('assassin',c[0],c[1],true);F.mqAtt=(F.mqAtt||0)+1;
  msg(MQ_STALK[(F.mqAtt-1)%MQ_STALK.length],'#e8a090');
}
function mqTick(){
  const F=G.flags;
  if(typeof storyTickDays==='function'&&G.state==='play'&&G.time>(MQ._s||0)){MQ._s=G.time+3;try{storyTickDays()}catch(e){}}
  if(LEVEL===306&&F.courtFight&&!F.pardoned&&!G.cut&&!G.enemies.some(e=>e.t==='chancellor'&&e.hp>0)&&typeof oldhavenPardon==='function')oldhavenPardon();
  if(F.mqDay0===undefined||G.state!=='play')return;
  const t=G.time;if(t<(MQ._t||0))return;MQ._t=t+4;
  if(!F.kingBack&&dayNum()>=F.mqDay0+3){F.kingBack=1;msg('Trumpets sound over Khemetra. The king has come home. He will see you in the throne room.','#ffe36a');sfx('level')}
  if(LEVEL===44&&!F.voyage&&(F.mqAtt||0)<9&&!G.talk&&!G.cut&&!G.menu&&!(G.inv&&G.inv.open)&&!G.loot&&!(G.timers&&G.timers.length)&&!hostileNear()){
    if(F.mqNext===undefined)F.mqNext=G.clock+90;
    if(G.clock>=F.mqNext){F.mqNext=G.clock+1440*(F.kingBack?.45:.3)*(.7+Math.random()*.6);mqStalk()}
  }
}
function mqEnter(n){ // an assassin lies in wait behind some of the doors of Khemetra, one to a house
  const F=G.flags;
  if(n===199){const k=G.decor.find(d=>d.npc==='kh_king');if(k)k.hidden=!F.kingBack}
  if(F.mqDay0===undefined||F.voyage)return;
  if(n>=1000&&n<30000){
    F.mqAmb=F.mqAmb||{};if(F.mqAmb[n])return;
    if(hash2(n,5,77)<.075){
      F.mqAmb[n]=1;let best=null,bd=-1;
      for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){if(G.grid[y][x]!==0||cellBlocked(x,y)||enemyAt(x,y))continue;const d=Math.abs(x-G.P.x)+Math.abs(y-G.P.y);if(d>bd){bd=d;best=[x,y]}}
      if(best)addEnemy('assassin',best[0],best[1],false);
    }
  }
}

/* ---- 3. the king and the audience ---- */
khNpc('kh_king','King Rahotep','yar_p_king',()=>{
  const F=G.flags;
  if(F.audience)return say(F.yarOpen?'The Sea Gate is open. Go with my blessing, and bring that ledger home. A king who cannot trust his own seal is no king, and I would not like to see Osric learn it the hard way.':'I have ordered the Sea Gate unsealed. Hotep-Ra, my vizier, will tell you where the key lies. Do not wait. Corvane does not.',[BYE]);
  return say('Ishkander wrote to me in a short letter, and a long one. Come forward. Tell me what happened, and I will know whether it is true.',[['We killed Gandrick, and were hunted for it. We are not forgers.',()=>{if(qSt('mq2')===null)qAccept('mq2');startCut('mqAudience',mqAudienceEnd);return null}]]);
},{q:'mq2'});
function mqAudienceEnd(){
  const F=G.flags;F.audience=1;F.kingOrder=1;
  if(qSt('mq1')==='active'&&qReady('mq1'))qTurnIn('mq1');
  if(qSt('mq2')===null)qAccept('mq2');if(qReady('mq2'))qTurnIn('mq2');
  msg('The king orders the Sea Gate unsealed. Speak to the grand vizier, Hotep-Ra.','#ffe36a');
}
Object.assign(CUTS,{mqAudience:()=>[
  {text:'The throne room of Khemetra is bright with morning. King Rahotep sits beneath the great golden falcon wings. Ishkander stands at his right hand, and the grand vizier at his left. The party walks the length of the hall and kneels.'},
  {who:'King Rahotep',text:'Ishkander wrote to me of four strangers, a dead bandit and a ledger. I have read the ledger. The warrant that brought you here bears the seal of King Osric of the western realm. The hand that signed it is not his.'},
  {who:'Ishkander',text:'It is the hand of Lord Corvane, the Warden of the western Crown. I have known his writing for twenty years. Gandrick paid tolls on every road in the west, and the tolls went to Corvane, and the ledger names every coin. You found a thread, and he wants the whole garment burned, with you in it.'},
  {who:'Hotep-Ra',text:'The reward is twenty thousand crowns on each of your heads, my king. The knives that found you in our streets were bought with it.'},
  {who:hn(0),text:'Then give us a way to prove the warrant is false. We want our names back.'},
  {who:'Ishkander',text:'The ledger you carry is a copy. The master was written in triplicate by Corvane\'s own scribe, Isolde, who fled the western court by sea three years ago, taking three pages with her, and hid them one by one with the island keepers who sheltered her. Bring me all three, and even a king must listen. Osric will not be able to call it a forgery.'},
  {text:'A horn sounds from the east gate of the palace. Doors bang. A rider is half carried into the throne room, grey with salt and dust. He falls at the foot of the throne.'},
  {who:'A dying rider',text:'The Black Heron... Corvane\'s ship. She lies off Yarrim. He asks in every tavern for four strangers. He burns the boats of those who will not say. He said... he will have you... by the new moon.'},
  {text:'The rider\'s head falls. No one in the hall speaks.'},
  {who:'King Rahotep',text:'He has come east himself, to finish what his knives could not. Then we will meet him on ground of my choosing. Hotep-Ra, unseal the Sea Gate. It has been shut for a hundred years because of the dead in the tunnel, and I think the dead will have to make way. The ship Menkaure built lies hidden at Yarrim. Take her. Take the ledger. Go.'},
  {who:'Ishkander',text:'Be careful on the road. Corvane has friends in this city who owe him nothing and will not stop for a king.'}
],
 yarCastOff:()=>[
  {text:'The Dawn Walker slips her moorings on the evening tide. The lighthouse of Yarrim burns over the harbour, and the pier is crowded with fishermen who have come to see her go.'},
  {who:'Menkaure',text:'Hold on to something. She is a good ship, but she has not seen open water in a hundred years, and neither have I.'},
  {text:'Out beyond the reef a black ship turns toward the harbour. A red heron on her sails. Lanterns blaze along her rail like a row of teeth.'},
  {who:'Lord Corvane',text:'Four strangers in a stolen ship. You have given me a long journey, and I have not enjoyed one league of it. Heave to, or I shall sink you where you float.'},
  {who:hn(0),text:'Not today.'},
  {who:'Menkaure',text:'Then run! West of the reef, by the lamp! She draws too much water to follow us into the shallows!'},
  {text:'Cannon fire flashes behind them. The Dawn Walker leans into the wind. The lights of Yarrim shrink to a single spark. By dawn there is only the sea, and a line of low islands ahead.'},
  {who:'Menkaure',text:'Isolde hid her pages on islands the city has no charts for. Saltbarrow first. There is a pirate there with her own reasons to hate Corvane.'}
],
 corvaneDuel:()=>[
  {text:'The altar stands in a ring of broken stones at the highest point of the island. As the party reaches it, the wind drops to nothing, and a boat grates against the rocks far below.'},
  {who:'Lord Corvane',text:'You are the first people I have been unable to find in a month. I have followed your lamp across half the Narrow Sea. Your friend Isolde wrote three copies of my ledger and one of them lies in that chest. Step away from it.'},
  {who:hn(1),text:'You forged a king\'s warrant to cover your tolls. We have all three pages now, and a king who is going to read them.'},
  {who:'Lord Corvane',text:'Kings read what they are given. Osric reads what I give him. A pity. You were so close to being forgotten.'}
],
 oldhavenArrive:()=>[
  {text:'Dawn over Oldhaven. The royal harbour is a wall of pale stone, banners hanging limp in the first light. Every gun on the quay is turned toward the water, and every one of them has seen the Dawn Walker.'},
  {who:'A harbour herald',text:'The king\'s court meets at noon! No armed party may pass the gate! The Crown\'s warrant stands against four named persons, and the Crown\'s ransom stands with it!'},
  {who:hn(0),text:'We carry the master ledger in Isolde\'s own hand. We ask to be heard.'},
  {who:'A harbour herald',text:'Then you will be heard, and shackled while it is read. The gate opens at noon. Wait on the quay.'},
  {who:'Menkaure',text:'Noon. I have never liked the look of a courtyard with a gallows in it. But we have come a long way, and the road ends at that gate.'}
]});

/* ---- guards of the palace know the king is back ---- */
(function(){
  for(const id of ['kh_guardA','kh_guardB','kh_page','kh_herald']){
    const n=NPCS[id];if(!n||n._kb)continue;n._kb=1;const base=n.root;
    n.root=function(d){const F=G.flags;if(F.kingBack&&!F.audience)return say('The king has returned! He is asking for four strangers in the throne room. Go in. Go in!',[BYE]);return base.apply(this,arguments)};
  }
})();
(function(){const _b=khBuildWorld;khBuildWorld=function(){const first=!KH_WORLD_DONE;_b.apply(this,arguments);if(first&&LEVELS[KH_PALACE])LEVELS[KH_PALACE].decor.push({k:'yar_p_king',x:16,y:3,block:true,npc:'kh_king',sc:1,hidden:true})}})();

/* ---- 4. cast off from Yarrim, and the ship's chart ---- */
vq('yar7','Cast Off','Menkaure, the shipwright','The Dawn Walker is ready at the pier in Yarrim. Corvane\'s ship waits off the reef. Speak to Menkaure at the end of the pier.',1,khFlag('voyage'),{gold:0,xp:3000});
khNpc('yr_menkaure','Menkaure, the shipwright','kh_menk1_0',()=>{
  const F=G.flags;
  if(F.voyage)return say('She runs better than I dared hope. Wherever the chart says, we sail.',[['Look at the chart.',()=>seaChart()],BYE]);
  if(qSt('yar6')!=='done')return say('She is nearly ready. Tamsin Kell is still gathering stores, and the lamp must burn before we try the reef at night. When all that is done, come and find me. I will be here on the pier, counting rope.',[BYE]);
  return say('The stores are aboard, the hold is clean, and the lamp is lit. The Black Heron has been circling off the reef for two days. We will not get a better night than this one. Are you ready?',[['Cast off.',()=>{if(qSt('yar7')===null)qAccept('yar7');startCut('yarCastOff',castOffEnd);return null}],['Not yet.',()=>null]]);
},{q:'yar7'});
function castOffEnd(){
  const F=G.flags;F.voyage=1;if(qReady('yar7'))qTurnIn('yar7');
  const to=SEA_ARRIVE(300);goToLevel(300,to);
}
function seaDests(){
  const F=G.flags,d=[];
  d.push([300,'Saltbarrow',true],[301,'The Isle of Bells',qSt('vq1')==='done'],[302,'Cinder Isle',qSt('vq2')==='done'],[303,'Last Light',qSt('vq3')==='done']);
  return d;
}
function seaChart(){
  const F=G.flags;
  if(!F.voyage)return say('The Dawn Walker lies at the pier, tall and quiet. Menkaure walks the deck with a coil of rope. He will want to speak to you before she sails.',[BYE]);
  const opts=[];
  for(const [id,name,ok] of seaDests()){if(id===LEVEL)continue;if(ok)opts.push(['Sail to '+name+'.',()=>{sailTo(id);return null}])}
  if(LEVEL!==290)opts.push(['Sail back to Yarrim.',()=>{sailTo(290);return null}]);
  opts.push(['Not yet.',()=>null]);
  return say('The Dawn Walker\'s chart lies open on the table under a lamp. Corvane\'s black ship is marked in red. Where shall she sail?',opts);
}
function sailTo(id){
  const F=G.flags;G.clock+=60*(id===290?8:6);msg('The Dawn Walker leans into the wind. Hours pass on the water.','#a8d8ff');sfx('level');
  goToLevel(id,SEA_ARRIVE(id));
}
khNpc('yr_ship','The Dawn Walker','yar_ship_dawn',()=>seaChart());
