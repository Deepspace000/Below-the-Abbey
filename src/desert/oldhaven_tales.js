/* ==========================================================================
   TALES OF OLDHAVEN: TEN QUESTS (ot1 to ot10; prefix oht / OHT). Open once the party is pardoned (G.flags.pardoned). Plain words, like the siege quests.
   Chain A, the bells: ot1 The Noon Bells (Verger Alma) > ot2 Mending the Bell (Bellfounder Tolliver on the quay) > ot3 The True Twelve (Alma).
   Chain B, the survey: ot4 The Sewer Survey (Mistress Corvane) > ot5 A Chart for the Woodwardens (after the siege; handed in to Hale in the Oakwood).
   Chain C, the hat: ot6 The Herald’s Hat (the herald; clues from the fishwife and the baker; the hat is in the crypt).
   Others: ot7 Three Pies (Dame Tansy), ot8 The Lost Lad (Bess), ot9 The Name on the Tomb (Odo Thane), ot10 Wat Crowe (Constable Harl).
   The dungeons are in oldhaven_under.js. State is in G.flags.oht (OHT()).
   ========================================================================== */
const OHT_FOLK=[['oht_alma',42,68,5],['oht_corvane',30,76,6],['oht_tansy',74,59,5],['oht_bess',58,90,5],['oht_odo',27,29,5],['oht_harl',70,36,5]];
const OHT_QFOLK=[{id:'oht_tolliver',at:[35,24]}];
const ohtq=(id,t,who,desc,need,goal,reward,extra)=>{QUESTS[id]=Object.assign({title:t,who,desc,need,goal,reward},extra||{});QAREA[id]='Oldhaven'};
const ohtOpen=()=>!!G.flags.pardoned;

ohtq('ot1','The Noon Bells','Verger Alma','Verger Alma looks after the church bell of Oldhaven. She wants the party to listen to it strike noon, in the city or on the quay, and count the strokes. Then tell her what you heard. She can let the hours pass for you.',1,()=>OHT().noon?1:0,{gold:300,xp:3000});
ohtq('ot2','Mending the Bell','Bellfounder Tolliver','The twelfth stroke of the bell is flat because the clapper pin was stolen. Bring Bellfounder Tolliver the clapper pin from the bandit hideaway under the city (through the hidden door in the sewer) and 6 scraps of bronze from under the city. Total needed: 7.',7,()=>Math.min(1,bagCount('bellpin'))+Math.min(6,bagCount('bronzescrap')),{gold:700,xp:7000},{take:{bellpin:1,bronzescrap:6}});
ohtq('ot3','The True Twelve','Verger Alma','The bell is mended. Listen to it strike twelve at noon and twelve at midnight, and tell Verger Alma that every stroke rings true. The night watch changes on the midnight strokes. She can let the hours pass for you.',2,()=>(OHT().tNoon?1:0)+(OHT().tMid?1:0),{gold:1000,xp:10000});
ohtq('ot4','The Sewer Survey','Mistress Corvane','Mistress Corvane, a mapmaker, is drawing the sewers of Oldhaven. Go down into the sewer (the manhole south of the great square, or the grating on the quay), and read all five iron gratings. Then tell her how many gratings there are, how many piers the quay has, and the name of the ship at the end of the long middle pier.',2,()=>(OHT().sewer?1:0)+(Object.keys(OHT().grates||{}).length>=5?1:0),{gold:600,xp:6000});
ohtq('ot5','A Chart for the Woodwardens','Mistress Corvane','Mistress Corvane has drawn a chart of the sewers and where they run out beyond the east wall. Carry it to Hale, captain of the woodwardens, in the Oakwood.',1,()=>OHT().charted?1:0,{gold:900,xp:9000},{give:'mapchart'});
ohtq('ot6','The Herald’s Hat','the king’s herald','A gull took the plumed hat of the herald on the quay. Ask the fishwife in the lanes and the baker near the great square if they saw where it went, find the hat, and bring it back. Needed: both clues and the hat.',3,()=>(OHT().hatW?1:0)+(OHT().hatB?1:0)+(bagCount('heraldhat')>0?1:0),{gold:450,xp:4500},{take:{heraldhat:1}});
ohtq('ot7','Three Pies','Dame Tansy','Dame Tansy bakes pies for people who forget to eat. Give one pie each to the herald on the quay, Captain Aldwyn at the city gate and Sister Ilse at the fair green. Then tell Dame Tansy.',3,()=>(OHT().pieH?1:0)+(OHT().pieC?1:0)+(OHT().pieS?1:0),{gold:500,xp:5000});
ohtq('ot8','The Lost Lad','Bess, a washerwoman','Bess’s son Pip went down a manhole after his ball and has not come home. Find him in the sewers under the city and send him home, then tell Bess.',1,()=>OHT().pip?1:0,{gold:450,xp:4500});
ohtq('ot9','The Name on the Tomb','Odo Thane, the lamplighter','Odo Thane is the last of a family of lamplighters. His first ancestor is buried in the crypt under the chapel. Read the tomb with the carved lamp, then tell Odo the name on it.',1,()=>OHT().tomb?1:0,{gold:500,xp:5000});
ohtq('ot10','Wat Crowe','Constable Harl','Wat Crowe leads a band of robbers that hides under the city. Constable Harl pays a bounty for his death. The hideaway is behind a hidden door in the sewer. Kill Wat Crowe.',1,q=>(G.flags.k_ohcrowe||0)-(q.base||0),{gold:1200,xp:12000},{cnt:'k_ohcrowe'});

/* ---- when each can be taken (read by oldhaven_quest_guard.js for the gold !) ---- */
Object.assign(OHQ_GATE,{
  ot1:ohtOpen,ot2:()=>qSt('ot1')==='done',ot3:()=>qSt('ot2')==='done',
  ot4:ohtOpen,ot5:()=>qSt('ot4')==='done'&&!!G.flags.siegeWon,
  ot6:ohtOpen,ot7:ohtOpen,ot8:ohtOpen,ot9:ohtOpen,ot10:ohtOpen});
QGIVER.oht_alma=['ot1','ot3'];QGIVER.oht_tolliver=['ot2'];QGIVER.oht_corvane=['ot4','ot5'];QGIVER.oh_herald=['ot6'];
QGIVER.oht_tansy=['ot7'];QGIVER.oht_bess=['ot8'];QGIVER.oht_odo=['ot9'];QGIVER.oht_harl=['ot10'];
/* the chart is handed in to Hale (not to the giver): a green ? over Hale while the party carries it */
{const _qm=questMark;questMark=function(d){const m=_qm(d);if(d&&d.npc==='oa_hale'&&!d.found&&!d.hidden&&qSt('ot5')==='active'&&bagCount('mapchart')>0)return 2;return m}}

/* ---- the bell: hearing it counts only while the quest is active (hooks called from oldhaven_bells.js) ---- */
function ohtFlat(){return qSt('ot1')!==null&&!OHT().fixed}
function ohtStruck(h,k){
  if(k!==12)return '';const T=OHT();
  if(!T.fixed){if(h===12&&qSt('ot1')==='active'){T.noon=1;return 'The twelfth stroke is flat and dull, not like the eleven before it.'}return ''}
  if(qSt('ot3')==='active'){if(h===12)T.tNoon=1;else T.tMid=1;return 'All twelve strokes ring true.'}
  return '';
}
function ohtWait(h){const m=G.clock%1440,t=h*60;G.clock+=((t-m+1440)%1440)||1440;msg(h===12?'The hours pass until noon.':'The hours pass until midnight.','#a8d8ff')}
const ohtWaitOpts=()=>[['Let the hours pass until noon.',()=>{ohtWait(12);return null}],['Let the hours pass until midnight.',()=>{ohtWait(0);return null}]];
{const _t=qTurnIn;qTurnIn=function(id){const r=_t.apply(this,arguments);if(id==='ot2'&&qSt('ot2')==='done'){OHT().fixed=1;msg('The bellfounder takes the pin and the bronze up to the bell tower.','#e8d070')}return r}}
{const _a=qAccept;qAccept=function(id){const r=_a.apply(this,arguments);
  if(id==='ot7'){let n=0;for(let i=0;i<3;i++)if(bagAdd(mkItem('tansypie')))n++;msg(n?`Dame Tansy gives you ${n} pies in cloths.`:'Your bag is full. Dame Tansy keeps the pies until you have room.','#e0c880')}
  return r}}

/* ---- the words ---- */
const OHTD={
 ot1:khQD('The bell of Oldhaven is mine to keep, and lately it sounds wrong to me, but I am old and my ears may be the fault. Will you listen to it strike noon, and count? Anywhere in the city or on the quay will do. Then tell me what you heard.','Listen for the twelve strokes at noon. I can make the hours pass if you wish.',(g,n)=>'Have you heard the noon bell yet? Stand in the city or on the quay when it strikes.','So. You heard it too. Eleven strokes true, and the twelfth flat, like a dropped pan. The bell is sound, so the fault is in the clapper. Bellfounder Tolliver on the quay will know. Tell him I sent you.','Thank you. Go to Bellfounder Tolliver on the quay.','You were right about the bell. Thank you.'),
 ot2:khQD('Alma sent you? Then you heard it. The clapper pin is gone. It is a bronze pin as long as your hand, and the bandits took it, along with half the bronze in the lower town. They hide under the city. Find the sewer, and a hidden door in it. Bring me the pin, and 6 scraps of old bronze to cast a new bearing. Bronze lies about under the city, in the sewer, the crypt and the hideaway.','The pin is in the bandit hideaway. Six scraps of bronze from anywhere under the city.',(g,n)=>`The pin and 6 scraps of bronze: you have ${g} of ${n}.`,'The pin, and the bronze! Give them here. I will have the bell mended by sundown.','The bell is mended. Tell Alma to listen at noon and at midnight.','The bell is mended.'),
 ot3:khQD('Tolliver says the bell is mended. I would not trust my own ears again. Listen to it strike twelve at noon, and twelve at midnight, and tell me whether it rings true. The night watch changes on the midnight strokes, and they have been changing late for a month.','Noon and midnight. I can make the hours pass for you.',(g,n)=>`True strokes heard: ${g} of ${n}. Noon and midnight both count.`,'Noon and midnight, and all twelve true? Oh, that is good to hear. The watch will change on time again. Here.','The bell sings again. Thank you.','The bell rings true.'),
 ot4:khQD('I am drawing the sewers of Oldhaven. Nobody has done it, and the sewers are older than the city. I need someone to go down and look. Read all five iron gratings in the sewer, and then I will ask three things. How many gratings are there? How many piers does the quay have? And what is the name of the ship at the end of the long middle pier? You find the manhole south of the great square, and there is a grating on the quay.','Go down into the sewer and read the gratings. Look at the quay too. Come back and I will ask three questions.',(g,n)=>'Have you been down into the sewer and read all the gratings? Then come and answer my questions.','You have been down, then. Now, my three questions.','Thank you. My chart is the better for it.','The chart is nearly finished.'),
 ot5:khQD('The sewer comes out beyond the east wall, in the Oakwood, and that matters to the woodwardens. The Ash Guard could have used it. Here is my chart. Take it to Hale, captain of the woodwardens, in the Oakwood, and put it in his hand.','The chart is in your bag. Give it to Hale in the Oakwood.',(g,n)=>'Hale is in the Oakwood. The chart is in your bag.','Hale has it? Good.','The woodwardens have the chart.','The woodwardens have the chart.'),
 ot6:khQD('A gull! A gull took my hat, the tall one with the white plume. I had it off for a moment, to scratch. I saw it fly towards the city. The fishwife in the lanes may have seen it, and the baker near the great square. Please find my hat. I cannot stand on the quay with a bare head.','Ask the fishwife and the baker. Then find the hat.',(g,n)=>`Clues and hat: ${g} of ${n}. Ask the fishwife and the baker, then find the hat.`,'My hat! A little chewed, but it is my hat. Take this.','My hat is back. Thank you.','I have my hat.'),
 ot7:khQD('Pies! I bake too many, and people forget to eat. Here are three. Give one to the king’s herald on the quay, one to Captain Aldwyn at the city gate, and one to Sister Ilse at the fair green. Then come back and tell me. They are hot, so do not dawdle.','Three pies: the herald, Captain Aldwyn and Sister Ilse.',(g,n)=>`Pies given: ${g} of ${n}.`,'All three fed? Then my work is done. Here is your pay.','Three people fed. Thank you.','Thank you for the pies.'),
 ot8:khQD('My Pip went down a manhole after his ball, and the grating dropped shut. That was yesterday. The watch will not go down there, and I cannot. Please, find him. The manhole is by the washhouse, south of the great square.','Pip is in the sewers under the city. Send him home.',(g,n)=>'Have you found Pip? He went down the manhole by the washhouse.','He is home! He is home, wet through. Take this.','Pip is home. Thank you.','Pip is safe at home.'),
 ot9:khQD('I am Odo Thane, and my family has lit the lamps of Oldhaven for ten generations. The first lamplighter lies in the crypt under the chapel, in Chapel Close, in a tomb with a lamp carved on the lid. Nobody remembers his first name. Read the tomb for me, and tell me what it says.','The tomb is in the crypt under the chapel. Come back and tell me his name.',(g,n)=>'Have you read the tomb in the crypt under the chapel?','You have read it. Tell me the name.','That is him. Thank you. The lamps will be lit in his name.','I know his name now.'),
 ot10:khQD('Wat Crowe has robbed half the lower town, and then he vanishes. He hides under the city. There is a hidden door in the sewer, at the north-east end, in a bricked-off chamber, and a loose brick opens it. The city pays a bounty on his head. Will you kill him?','Wat Crowe is in the bandit hideaway. Find the loose brick in the sewer.',(g,n)=>'Wat Crowe is still alive.','Crowe is dead? Then the lower town can sleep. Here is the bounty.','Crowe is dead. Take the bounty.','The robbers are gone.')
};
/* a node with extra choices while the quest runs */
const ohtNode=(id,D,extra)=>{
  if(qSt(id)==='active'&&!qReady(id)&&extra){return say(D.remind(qGoal(id),QUESTS[id].need),extra().concat([BYE]))}
  return qNode(id,D)};

/* ---- the people ---- */
khNpc('oht_alma','Verger Alma','kh_ohfolk5_1',()=>{
  if(qSt('ot1')!=='done')return ohtNode('ot1',OHTD.ot1,ohtWaitOpts);
  if(qSt('ot2')!=='done')return say('Tolliver, the bellfounder, is on the quay. He will know what is wrong with the bell.',[BYE]);
  if(qSt('ot3')!=='done')return ohtNode('ot3',OHTD.ot3,ohtWaitOpts);
  return say('Listen. Twelve strokes, every one true.',[BYE])},{q:['ot1','ot3']});
khNpc('oht_tolliver','Bellfounder Tolliver','kh_ohfolk6_2',()=>{
  if(qSt('ot2')!=='done'){
    if(qSt('ot2')===null&&qSt('ot1')!=='done')return say('I cast bells. The great bell of Oldhaven is mine, and I would have it sing right. Speak to Verger Alma in Chapel Close about it.',[BYE]);
    return qNode('ot2',OHTD.ot2)}
  return say('The bell is mended. Bronze is a patient metal.',[BYE])},{q:['ot2']});
khNpc('oht_corvane','Mistress Corvane','kh_ohfolk2_4',()=>{
  if(qSt('ot4')==='active'&&qReady('ot4'))return ohtQuiz();
  if(qSt('ot4')!=='done')return qNode('ot4',OHTD.ot4);
  if(qSt('ot5')!=='done'&&G.flags.siegeWon)return qNode('ot5',OHTD.ot5);
  return say('I am Corvane, a mapmaker. No relation to the Warden of the Narrow Sea, and I would thank you not to ask.',[BYE])},{q:['ot4','ot5']});
function ohtQuiz(){
  const wrong=()=>say('That does not match my own count. Go and look again.',[BYE]);
  const ask=(txt,opts,right,next)=>say(txt,opts.map(o=>[String(o),()=>String(o)===String(right)?next():wrong()]));
  return ask('First: how many iron gratings are there in the sewer?',[3,4,5,6,7],5,()=>
    ask('Second: how many piers does the quay have?',[3,4,5,6],5,()=>
      ask('Third: what is the name of the ship at the end of the long middle pier?',['The Silver Marten','The Dawn Walker','The Gull’s Rest'],'The Dawn Walker',()=>{
        const rw=rewardText('ot4');qTurnIn('ot4');return say('All three right. My chart can be drawn now. Reward: '+rw+'. Come back when the east gate is open, and I will have a task for you.',[BYE])})))}
khNpc('oht_tansy','Dame Tansy','kh_ohfolk4_4',()=>{
  if(qSt('ot7')!=='done')return qNode('ot7',OHTD.ot7);
  return say('Pies for everyone. A person cannot think on an empty belly.',[BYE])},{q:['ot7']});
khNpc('oht_bess','Bess, a washerwoman','kh_ohfolk5_5',()=>{
  if(qSt('ot8')!=='done')return qNode('ot8',OHTD.ot8);
  return say('Pip is not allowed within ten paces of a manhole now.',[BYE])},{q:['ot8']});
khNpc('oht_odo','Odo Thane, the lamplighter','kh_ohfolk7_0',()=>{
  if(qSt('ot9')==='active'&&qReady('ot9')){
    const wrong=()=>say('That is not the name I know of, and he would not have been a Thorne or a Thayne. Read the tomb again.',[BYE]);
    return say(OHTD.ot9.ready,['Edric Thane','Edmund Thane','Eadric Thorne'].map(n=>[n,()=>{if(n!=='Edric Thane')return wrong();const rw=rewardText('ot9');qTurnIn('ot9');return say(OHTD.ot9.thanks+' Reward: '+rw+'.',[BYE])}]))}
  if(qSt('ot9')!=='done')return qNode('ot9',OHTD.ot9);
  return say('Edric Thane, first lamplighter. I say his name every dusk now.',[BYE])},{q:['ot9']});
khNpc('oht_harl','Constable Harl','kh_ohsold1_3',()=>{
  if(qSt('ot10')!=='done')return qNode('ot10',OHTD.ot10);
  return say('The lower town is quiet. I could get used to it.',[BYE])},{q:['ot10']});

/* ---- the clues and hand-ins on people who already live in Oldhaven ---- */
repWrap('oh_herald',()=>(qSt('ot6')===null&&OHQ_GATE.ot6())||qSt('ot6')==='active','About your hat',()=>qNode('ot6',OHTD.ot6));
repWrap('oh_w1',()=>qSt('ot6')==='active'&&!OHT().hatW,'Have you seen the herald’s hat?',()=>{OHT().hatW=1;return say('The herald’s big plumed hat? A gull had it, flying low over the chapel roofs, the plume streaming behind it like a flag. It went down the chapel side, towards Chapel Close. Try there.',[BYE])});
repWrap('oh_m2',()=>qSt('ot6')==='active'&&!OHT().hatB,'Have you seen the herald’s hat?',()=>{OHT().hatB=1;return say('A white plume? The gulls nest in the old vent beside the chapel, the one that goes down to the crypt. If that hat is anywhere, it is down in the crypt, in the light well at the back, where the gulls drop their treasure. Take a lantern.',[BYE])});
const ohtPie=(npc,flag,line)=>repWrap(npc,()=>qSt('ot7')==='active'&&!OHT()[flag]&&bagCount('tansypie')>0,'Give Dame Tansy’s pie',()=>{bagRemove('tansypie',1);OHT()[flag]=1;return say(line,[BYE])});
ohtPie('oh_herald','pieH','A pie! From Dame Tansy? She feeds the whole city. Thank you. I will eat it before the gulls see it.');
ohtPie('oh_cap','pieC','A pie, at my post. Dame Tansy knows I forget to eat. Tell her I am grateful, and that I will pay for the next one.');
ohtPie('oh_x_sister','pieS','A pie. How kind. I will eat it after the evening prayers. Tell Dame Tansy that she is in my prayers.');
repWrap('oa_hale',()=>qSt('ot5')==='active'&&!OHT().charted&&bagCount('mapchart')>0,'Give Hale Mistress Corvane’s chart',()=>{
  const T=OHT();bagRemove('mapchart',1);T.charted=1;const rw=rewardText('ot5');qTurnIn('ot5');
  return say('A chart of the sewers, and where they come out! The Ash Guard knew about this, and we did not. Tell the mapmaker the woodwardens are in her debt. Reward: '+rw+'.',[BYE])});
/* before the pardon the givers have no work to hand out (matches the gold ! gates above) */
for(const id of ['oht_alma','oht_corvane','oht_tansy','oht_bess','oht_odo','oht_harl','oht_tolliver']){
  const n=NPCS[id],base=n.root,wrap=function(d){
    if(!ohtOpen()&&!Object.keys(G.quests).some(k=>/^ot\d+$/.test(k)))return say('Not now, friend. Come back when the court has settled things and you are free in the city.',[BYE]);
    return base.call(this,d)};
  n.root=wrap;if(KH_KEEPERS[id])KH_KEEPERS[id].root=wrap}
