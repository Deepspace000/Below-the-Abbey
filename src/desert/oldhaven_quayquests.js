/* ==========================================================================
   THE QUAY OF OLDHAVEN: SIX SMALL QUESTS. Seven new people stand on the quay plaza (placed by oldhaven_quay.js from OQQ_FOLK). Three of the quests happen on the
   quay itself: rats on the wharf, loaves for the dockers, a muster of three dockhands. Three lead into the city: a packet for the Captain of the Gate, a sailor's word
   for a fishwife in the lanes, and herring for the baker. The quests are open from the first visit to the quay. Same plain style as the siege quests (oldhaven_siege.js):
   a gold ! over a giver, a green ? when the work is done and the giver is the one to tell.
   ========================================================================== */
const OQQ=()=>{const F=G.flags;return F.oqq||(F.oqq={met:{},cap:0,sis:0,baker:0})};
const oqqq=(id,t,who,desc,need,goal,reward,extra)=>{QUESTS[id]=Object.assign({title:t,who,desc,need,goal,reward},extra||{});QAREA[id]='Oldhaven'};

/* ---- the people of the quay: [id, name, face, where on the plaza] ---- */
const OQQ_FOLK=[
 {id:'oq_q_master',n:'Harbourmaster Brandt',face:'kh_ohfolk6_5',at:[40,27]},
 {id:'oq_q_hobb',n:'Hobb, a dockhand',face:'kh_ohfolk4_1',at:[30,30]},
 {id:'oq_q_ned',n:'Ned, a dockhand',face:'kh_ohfolk1_5',at:[47,30]},
 {id:'oq_q_orla',n:'Orla, a rope hand',face:'kh_ohfolk3_4',at:[34,22]},
 {id:'oq_q_pell',n:'Pell, the customs clerk',face:'kh_ohfolk2_4',at:[44,17]},
 {id:'oq_q_tam',n:'Tam, a sailor just landed',face:'kh_ohfolk6_4',at:[52,26]},
 {id:'oq_q_marn',n:'Marn, a fishwife',face:'kh_ohfolk3_1',at:[31,15]}
];

/* ---- the rats: the wharf fills with them when the harbourmaster's job is taken, and again each time the party comes back to the quay until six are dead ---- */
function oqqSync(){
  if(LEVEL!==OQ.ID||qSt('oq1')!=='active')return;
  const q=G.quests.oq1,left=6-Math.max(0,(G.flags.k_rat||0)-(q.base||0));let have=G.enemies.filter(e=>e.t==='rat'&&!e.dying&&e.hp>0).length;
  for(let n=0;n<400&&have<left;n++){
    const x=24+((hash2(n,7,301)*33)|0),y=12+((hash2(n,8,301)*21)|0);
    if(!G.grid[y]||G.grid[y][x]!==0||cellBlocked(x,y)||enemyAt(x,y)||Math.hypot(x-G.P.x,y-G.P.y)<5)continue;
    addEnemy('rat',x,y,false);have++;
  }
}
{const _qa=qAccept;qAccept=function(id){const r=_qa.apply(this,arguments);
  if(id==='oq1')oqqSync();
  if(id==='oq6'){let n=0;for(let i=0;i<3;i++)if(bagAdd(mkItem('herring')))n++;msg(n?`Marn gives you ${n} smoked herring in a cloth.`:'Your bag is full. Marn keeps the herring until you have room.','#e0c880')}
  return r}}
{const _oe=ohEnter;ohEnter=function(n){_oe.apply(this,arguments);if(n===OQ.ID)oqqSync()}}

/* ---- the quests ---- */
oqqq('oq1','Rats on the Wharf','Harbourmaster Brandt','Rats have come off a grain ship and are all over the quay. Kill 6 of them on the plaza and the wharf.',6,q=>(G.flags.k_rat||0)-(q.base||0),{gold:400,xp:4000},{cnt:'k_rat'});
oqqq('oq2','Loaves for the Dockers','Hobb, a dockhand','The dockers have not eaten since dawn. Bring Hobb 4 loaves of bread. The bakers and the stalls sell it.',4,()=>Math.min(4,bagCount('bread')),{gold:250,xp:2500},{take:{bread:4}});
oqqq('oq3','The Muster','Harbourmaster Brandt','Brandt wants to know who is on the quay today. Speak to the three hands on the plaza, Hobb, Ned and Orla, and tell each to report to him.',3,()=>Object.keys(OQQ().met).length,{gold:350,xp:3500});
oqqq('oq4','Papers for the Gate','Pell, the customs clerk','Pell has a sealed packet of ship papers for the Captain of the Gate. Take it through the gate into the city, give it to Captain Aldwyn, and tell Pell it is done.',1,()=>OQQ().cap?1:0,{gold:500,xp:5000});
oqqq('oq5','A Sailor\'s Word','Tam, a sailor just landed','Tam has a sister in the lanes of Oldhaven, a fishwife, and a message for her: he is home and well. Find her in the city, tell her, and come back and tell Tam.',1,()=>OQQ().sis?1:0,{gold:450,xp:4500});
oqqq('oq6','Marn\'s Herring','Marn, a fishwife','Marn sells smoked herring on the quay and has a standing order from a baker in the city. Take the 3 herring she gives you to the baker, then tell Marn it is done.',1,()=>OQQ().baker?1:0,{gold:600,xp:6000});

const OQQD={
 oq1:khQD('Rats! Off a grain ship, and now they are in every barrel and basket on the quay. I will pay for six dead ones. They are on the plaza and the wharf, so mind the fish stalls.','Six rats. They will find you if you walk the plaza.',(g,n)=>`Six rats, and you have killed ${g} of ${n}.`,'The quay smells better already. Take your pay.','Six rats gone. The fishwives will sing about you.','The quay is quiet again, for now.'),
 oq2:khQD('Come here. The hands have been on the wharf since dawn and the cookshop is shut. Four loaves would hold them until supper. Can you find me some?','Four loaves. Bakers and stalls have them.',(g,n)=>`Four loaves, you have ${g}.`,'Four loaves, and still warm. The hands will be glad. Here.','Four loaves for the hands.','The hands are fed. Thank you.','Here is the bread.'),
 oq3:khQD('Every morning I count who is on my quay. This morning I am short of clerks and long on trouble. Speak to Hobb, Ned and Orla on the plaza, and tell each to report to me. Then I will know they are alive.','Hobb, Ned and Orla. Tell them Brandt wants a word.',(g,n)=>`${g} of ${n} hands told.`,'All three told. They will grumble, but they will come. Here is your pay.','All three hands reported. Take this.','Every hand is counted.'),
 oq4:khQD('You look like you can walk through a gate without being stopped. I have a sealed packet of ship papers for Captain Aldwyn, and I cannot leave my table. It must go to him by hand. He stands inside the city gate. Will you take it?','The packet is sealed. Give it to Captain Aldwyn, inside the gate, and come back and tell me.',(g,n)=>'Have you given the packet to Captain Aldwyn yet? He is inside the city gate.','Delivered? Good. The papers could not wait. Here is your pay.','The papers are with the Captain. Take this.','The papers are delivered.'),
 oq5:khQD('I have been at sea eight months, and I have a sister in Oldhaven, a fishwife, in the lanes. I cannot leave the quay until the ship is unloaded. Would you find her and tell her I am home, and well? I would take it kindly.','Tell her Tam is home. She works in the lanes of the city.',(g,n)=>'Have you found my sister, the fishwife in the lanes of the city?','She knows! Thank you, thank you. This is for you.','She knows I am home. Take this.','My sister knows I am home.'),
 oq6:khQD('Smoked herring for the baker in the city, three of them, paid in advance, and I have not left my stall since the dawn. If you take them across the plaza and through the gate, the baker is in the lanes. Tell me when she has them.','Three herring in a cloth. The baker is in the lanes of the city.',(g,n)=>'The baker has not told me she has the herring yet.','She has them? Good. Then the order is filled. Take this.','The herring are with the baker. Take this.','The baker has her herring.')
};
/* the quay people: those with a job to give, and those who only talk */
khNpc('oq_q_master','Harbourmaster Brandt','kh_ohfolk6_5',()=>{
  if(qSt('oq1')!=='done')return qNode('oq1',OQQD.oq1);
  if(qSt('oq3')!=='done')return qNode('oq3',OQQD.oq3);
  return say('The quay runs better with you on it. Mind the gulls, they are the real harbour authority.',[BYE]);
},{q:['oq1','oq3']});
khNpc('oq_q_hobb','Hobb, a dockhand','kh_ohfolk4_1',()=>{
  const M=OQQ().met;if(qSt('oq3')==='active'&&!M.hobb){M.hobb=1;return say('Report to Brandt? I have been reporting to him for twenty years. Tell him I am coming, and that I am hungry.',[BYE])}
  if(qSt('oq2')!=='done')return qNode('oq2',OQQD.oq2);
  return say('The loaves went down well. A man can unload a ship on bread and thanks.',[BYE]);
},{q:'oq2'});
khNpc('oq_q_ned','Ned, a dockhand','kh_ohfolk1_5',()=>{
  const M=OQQ().met;if(qSt('oq3')==='active'&&!M.ned){M.ned=1;return say('Brandt wants me? What have I done now? Never mind. Tell him I will come when the crate is down.',[BYE])}
  return say('Mind your feet. Crates fall off this quay more often than people think.',[BYE]);
});
khNpc('oq_q_orla','Orla, a rope hand','kh_ohfolk3_4',()=>{
  const M=OQQ().met;if(qSt('oq3')==='active'&&!M.orla){M.orla=1;return say('Brandt is counting again. Tell him I am here, and that the new rope is too short, as always.',[BYE])}
  return say('A good rope outlasts a good captain, I say.',[BYE]);
});
khNpc('oq_q_pell','Pell, the customs clerk','kh_ohfolk2_4',()=>{
  if(qSt('oq4')!=='done')return qNode('oq4',OQQD.oq4);
  return say('Papers, papers. The sea is wide, and every ship wants a stamp.',[BYE]);
},{q:'oq4'});
khNpc('oq_q_tam','Tam, a sailor just landed','kh_ohfolk6_4',()=>{
  if(qSt('oq5')!=='done')return qNode('oq5',OQQD.oq5);
  return say('Dry land. I had forgotten it holds still.',[BYE]);
},{q:'oq5'});
khNpc('oq_q_marn','Marn, a fishwife','kh_ohfolk3_1',()=>{
  if(qSt('oq6')!=='done')return qNode('oq6',OQQD.oq6);
  return say('Herring, herring! The baker has never complained, which is the highest praise there is.',[BYE]);
},{q:'oq6'});

/* ---- the city end of the three errands ---- */
repWrap('oh_cap',()=>qSt('oq4')==='active'&&!OQQ().cap,'The customs clerk\'s packet',()=>{OQQ().cap=1;return say('Ship papers from the quay, sealed. Good. Tell Pell I have them, and that the seal was neater than usual.',[BYE])});
repWrap('oh_w1',()=>qSt('oq5')==='active'&&!OQQ().sis,'A word from Tam, the sailor',()=>{OQQ().sis=1;return say('Tam? Home? From eight months at sea? Oh, thank you. Tell him the kettle is on and I will be down to the quay the minute I can leave the stall.',[BYE])});
repWrap('oh_m2',()=>qSt('oq6')==='active'&&!OQQ().baker,'Marn\'s herring',()=>{
  if(bagCount('herring')<3)return say('Marn\'s herring? Three of them, I paid for. You have not got them on you. Come back with them.',[BYE]);
  bagRemove('herring',3);OQQ().baker=1;return say('Three smoked herring, and wrapped well. Marn does not let me down. Tell her the rolls are on me next week.',[BYE])});
