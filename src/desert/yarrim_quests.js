/* ==========================================================================
   YARRIM: NINE QUIRKY QUESTS. Each has a few steps, a few people and one very small mystery:
   the Admiral's telescope, the great crab census, a message in a bottle, Wen's left boot, the wedding of two boats,
   a donkey who will not budge, a thief of nets, the drowned lantern and a shanty with no last verse.
   The painted villagers are in assets/kh (yfolk1..3), the things they ask about in yprop1 and ycrab1.
   ========================================================================== */
Object.assign(NPC_H,{
  kh_yfolk1_0:.74,kh_yfolk1_1:.82,kh_yfolk1_2:.84,kh_yfolk1_3:.78,kh_yfolk1_4:.82,kh_yfolk1_5:.86,
  kh_yfolk2_0:.84,kh_yfolk2_1:.84,kh_yfolk2_2:.82,kh_yfolk2_3:.84,kh_yfolk2_4:.82,kh_yfolk2_5:.6,
  kh_yfolk3_0:.8,kh_yfolk3_1:.8,kh_yfolk3_2:.84,kh_yfolk3_3:.78,kh_yfolk3_4:.66,kh_yfolk3_5:.84,
  kh_yprop1_0:.42,kh_yprop1_1:.42,kh_yprop1_2:.6,kh_yprop1_3:.44,kh_yprop1_4:.66,kh_yprop1_5:1.1,
  kh_ycrab1_0:.3,kh_ycrab1_1:.3,kh_ycrab1_2:.34,kh_ycrab1_3:.38,kh_ycrab1_4:.3,kh_ycrab1_5:.28
});
KH_STOCK.trader=()=>[['torch',8],['lantern',3],['potion',6],['antidote',4],['salve',4],['bread',10],['water',12],['dates',8],['herring',8],['ale',8],['apple',8],['wildflower',6],['herb',4],['cheese',4],['nuts',4],['dagger',2],['bow',2],['cap',3],['jerkin',2]];

const YR_QFOLK=[];   // people placed where their trouble is: {id, at:[x,y], rad}
const YR_QOBJ=[];    // things the quests ask the party to find: {npc, k, at:[x,y], rad, o}
const yrDay=()=>Math.floor((G.clock||0)/1440);
const yrF=()=>G.flags;
const yrStep=t=>{sfx('key');msg(t,'#ffe36a')};
const yrLines=(key,lines)=>{const F=G.flags,k='yg_'+key,i=(F[k]||0)%lines.length;F[k]=i+1;return say(lines[i],[BYE])};
/* a quest in steps: the log shows the first step still to do, and the quest is ready when they are all done */
function yrQ(id,title,who,steps,reward,extra){
  const q=Object.assign({title,who,need:steps.length,goal:()=>steps.reduce((n,s)=>n+(s[1]()?1:0),0),reward},extra||{});
  Object.defineProperty(q,'desc',{enumerable:true,get(){const s=steps.find(s=>!s[1]());return s?s[0]:'Go back to '+who.split(',')[0]+'. All is done.'}});
  Object.defineProperty(q,'targets',{enumerable:false,get(){const s=steps.find(s=>!s[1]());return s?(s[2]||[]):[]}});
  QUESTS[id]=q;QAREA[id]='Yarrim';return q}
/* put a new branch into the talk of someone who already has a root: fn(d) gives a dialogue node, or nothing to leave things as they were */
function yrHook(id,fn){const n=NPCS[id],k=KH_KEEPERS[id];if(!n)return;const old=n.root;n.root=d=>fn(d)||old(d);if(k)k.root=n.root}
/* a shopkeeper or innkeeper who also has a favour to ask: the shop stays open, and the favour is one more thing to say */
function yrAfterShop(id,qid,dlg,ask,about){
  const n=NPCS[id],old=n.root;const was=QGIVER[id];QGIVER[id]=(was?[].concat(was):[]).concat(qid);
  n.root=d=>{
    if(qReady(qid))return qNode(qid,dlg);
    const node=old(d),st=qSt(qid);if(st==='done')return node;
    node.opts.splice(Math.max(0,node.opts.length-1),0,[st===null?ask:about,()=>qNode(qid,dlg)]);return node};
  KH_KEEPERS[id].root=n.root}
const yrPlace=(id,at,rad)=>YR_QFOLK.push({id,at,rad:rad||5});
const yrObj=(npc,k,at,rad,o)=>YR_QOBJ.push({npc,k,at,rad:rad||3,o:o||{}});
function yarPlaceQuestFolk(C){
  for(const f of YR_QFOLK){const kp=KH_KEEPERS[f.id];if(!kp)continue;const q=C.near(f.at[0],f.at[1],f.rad);if(q)C.walk(khFaceKey(kp.face),q[0],q[1],{npc:f.id,sc:kp.sc||1})}
  for(const o of YR_QOBJ){const q=C.near(o.at[0],o.at[1],o.rad);if(q)C.dc(o.k,q[0],q[1],Object.assign({npc:o.npc,deco:false},o.o))}
}

/* ---- 1. the Admiral's telescope: Pell, Gwen and a herring gull in a very small hat ---- */
yrQ('yq_tele',"The Admiral's Telescope",'Pell, the chandler',[
  ['Ask Gwen, who talks to gulls, how to bargain with the Admiral. She is down by the harbour.',()=>yrF().yq1a,['yr_gwen']],
  ['Leave 2 salt herring for the Admiral on his post along the pier. Corran and Wen sell herring.',()=>yrF().yq1b,['yr_admiral']]
],{gold:380,xp:1700,items:['potion2']});
const D_TELE=khQD("Somebody has taken my brass telescope off the shop window sill, and I know who. A herring gull the size of a spaniel, in a hat nobody remembers giving him, who the whole harbour calls the Admiral. He has it on a post along the pier and he looks at the sea through it as if he owned it. Get it back, and it will be worth your while.",
  "Gulls cannot be fought, only bargained with. Gwen, the girl with the gull on her arm, speaks gull better than most people speak people. Start with her.",
  (n,m)=>yrF().yq1a?'Two salt herring, left on the Admiral\'s post along the pier. That is what Gwen says he will take.':'Ask Gwen about the Admiral. She is down by the harbour, with a gull on her arm.',
  'You have it? Do not tell me. Let me look.',
  'Not a scratch! A little gull spit on the lens, but that is character. And a bite mark on the eyepiece. I shall charge extra for the bite mark. Here, this is yours.',
  'The telescope is back on the window sill, and the Admiral sits on the roof opposite and stares at it. I have put up a curtain.',
  'Here is your telescope.');
yrAfterShop('yr_chandler','yq_tele',D_TELE,'Is there anything you need?',"About the Admiral's telescope");
khNpc('yr_gwen','Gwen, who talks to gulls','kh_yfolk3_5',d=>{
  const F=G.flags;
  if(qSt('yq_tele')==='active'&&!F.yq1a){F.yq1a=1;yrStep('Gwen told you how to bargain with the Admiral.');return say("The Admiral? He is a sweetheart, if you are a herring. He will trade anything for two salt herring left on his post along the pier, and he means it. He is quite well known for it. Tell him Gwen sent you. He will not care, but it is polite.",[BYE])}
  return yrLines('gwen',["This is Mr Pickles. He is not the Admiral. The Admiral is much worse.","Gulls have a whole language. It is mostly the word 'mine'.","If a gull looks at you for a long time, it is not being friendly. It is pricing your lunch."])});
yrPlace('yr_gwen',[55,41],3);
khNpc('yr_admiral','The Admiral','kh_yprop1_4',d=>{
  const F=G.flags;
  if(qSt('yq_tele')==='active'&&!F.yq1b){
    if(bagCount('herring')<2)return say('The Admiral looks at you, then at your empty hands, then at you again. It is a look that has ended careers. He wants 2 salt herring.',[BYE]);
    return say('The Admiral stands on his post with a brass telescope tucked under one wing like a sceptre. He looks at you from under a tiny black hat. He looks at your hands.',[['Leave 2 salt herring for him.',()=>{bagRemove('herring',2);F.yq1b=1;yrStep('The Admiral has returned the telescope.');return say('The Admiral inspects the herring one at a time, as if checking them for forgeries, and then eats both. He hacks, drops the telescope on the planks with great dignity, and spreads his wings in the manner of a bird who has completed an honest day\'s trade.',[BYE])}],BYE])}
  return say(F.yq1b?'The Admiral sits on his post and pretends he has never seen a telescope in his life.':'A very large herring gull in a very small hat, perched on a post. He has a medal on his chest and nobody remembers giving it to him. He regards you as a man regards a late tax.',[BYE])});
yrObj('yr_admiral','kh_yprop1_4',[72,40],3);

/* ---- 2. the great crab census: Tamsin Kell wants every crab on the shore counted ---- */
const YR_CRABS=[
  ['The red crab raises both claws and holds still while you tally him. "Count me properly," he says, in the way crabs say things, which is by clicking.',[53,46]],
  ['The green crab will not be counted until you have said please. You say please. He allows it, with the air of a magistrate.',[56,45]],
  ['You tally the hermit crab, and then, to be fair, you tally his shell. He objects. The tally stands at one crab. The shell is a resident.',[58,35]],
  ['The spider crab is quite a lot of crab. You are not sure whether to count the legs. You decide on one crab with eight points of view.',[59,32]],
  ['The grey crab holds up his one enormous claw like a very rude question. You count him anyway. He is a great one for being counted.',[57,48]],
  ['A tiny crab in a brass thimble stands to attention and demands to be counted twice, on the grounds that he is wearing a helmet. You count him once and give him a nod. He accepts the nod.',[51,50]]
];
QUESTS.yq_crab={title:'The Great Crab Census',who:'Tamsin Kell, the harbourmaster',need:6,goal:()=>Object.keys(yrF().yqCrab||{}).length,
  desc:'The harbour board has decreed that every crab on the shore be counted before the spring tax. Find and tally the 6 crabs of Yarrim, on the beach and along the quay.',reward:{gold:420,xp:1900,items:['ringS']}};
QAREA.yq_crab='Yarrim';
Object.defineProperty(QUESTS.yq_crab,'targets',{enumerable:false,get(){const t=yrF().yqCrab||{};return YR_CRABS.map((c,i)=>i).filter(i=>!t[i]).map(i=>'yr_crab'+i)}});
const D_CRAB=khQD("The harbour board has decreed that every crab on the shore must be counted before the spring tax, and I am the board. I have never counted a crab. They will not stay still, and they are rude about it. Find them, tally them, and be polite. I make it six.",
  'Along the beach and the quay, mostly. Walk up to each one and tally it. Do not let them argue with you.',
  (n,m)=>n+' of '+m+' crabs have been tallied. They are along the beach and the quay.',
  'Six crabs? Not seven? The board will be thrilled.',
  'Six, in the ledger, in my best handwriting. The crabs have been informed. They did not reply, but one of them clicked at me. Here is the harbour board\'s fee, and something from my own pocket.',
  'The census is in the archive. Next year we count the gulls, and then I shall need a bigger ledger.');
YR_CRABS.forEach((c,i)=>{
  khNpc('yr_crab'+i,'A crab','kh_ycrab1_'+i,d=>{
    const F=G.flags;F.yqCrab=F.yqCrab||{};
    if(F.yqCrab[i])return say('You have already counted this one. He looks at you as if he knows it and expects an apology.',[BYE]);
    if(qSt('yq_crab')!=='active')return say('A crab, going about its business. It has the look of something that has been counted before and did not enjoy it.',[BYE]);
    F.yqCrab[i]=1;const n=Object.keys(F.yqCrab).length;yrStep(n+' of 6 crabs tallied.');
    return say(c[0]+' ('+n+' of 6)',[BYE])});
  yrObj('yr_crab'+i,'kh_ycrab1_'+i,c[1],3);
});

/* ---- 3. a message in a bottle: Wink, Old Maren and the tide ---- */
yrQ('yq_bottle','A Message in a Bottle','Wink, a child',[
  ['Show the note from the bottle to Old Maren, who lives in the little house by the chapel.',()=>yrF().yq3a,['yr_maren']],
  ["Cast Maren's reply into the sea from the post at the end of the pier.",()=>yrF().yq3b,['yr_post']],
  ['Wait for the tide to turn, and come back to the post at the end of the pier tomorrow morning.',()=>yrF().yq3c,['yr_post']],
  ['Tell Old Maren what the bottle said.',()=>yrF().yq3d,['yr_maren']]
],{gold:450,xp:2100,items:['potion3']});
const D_BOTTLE=khQD("I found a bottle on the beach, with a note in it that nobody can read. Not even Brother Haldane, and he reads everything. It is in a very old hand, with a lot of loops. I think it is from the sea. Will you take it to Old Maren? She reads old handwriting. She read my report card in a day.",
  'Thank you! She lives in the little house by the chapel. Take care of the note. It is the only one I have.',
  (n,m)=>!yrF().yq3a?'Take the note to Old Maren, in the little house by the chapel.':!yrF().yq3b?'Cast Maren\'s reply into the sea from the post at the end of the pier.':!yrF().yq3c?'The tide has to turn first. Go back to the post tomorrow morning.':'Tell Old Maren what the bottle said.',
  'You are back! Did she read it? Did the bottle come back? What did it say?',
  'Biscuits? The sea wants biscuits! Maren cried and laughed at the same time, and I told her it was a very good bottle. Here, have my best shell, and this, from her.',
  'I look at every bottle on the beach now. So far, mostly sand. But one day.',
  'We have news.');
khStreetQ('yr_child','Wink, a child','kh_yfolk2_5',"The gulls steal your fish if you do not watch them. One stole my supper yesterday, and then it sat on the roof and ate it in front of me.",'yq_bottle',D_BOTTLE);
yrHook('yr_maren',d=>{
  const F=G.flags;
  if(qSt('yq_bottle')==='active'&&!F.yq3a){F.yq3a=1;yrStep('Maren is going to answer the note.');return say('A note? Show me. (She reads, and goes very still.) That is Tobias\'s hand. My husband. He has been gone nineteen years. He never could write a straight line, and he never could stop. He says the island is real, and that it has a spring, and that he is well, and that he is cross about something, and I cannot read what. ... Give me a pen. I shall answer him. Take this bottle to the post at the end of the pier, and put it in the sea where the tide turns. Then we will see.',[BYE])}
  if(qSt('yq_bottle')==='active'&&F.yq3c&&!F.yq3d){F.yq3d=1;yrStep('Maren knows what the bottle said.');return say('Biscuits? He wants biscuits. Nineteen years, and he wants biscuits. That is my Tobias. ... Tell the child thank you. And tell the child that I always knew there was an island with a spring on it. I always knew.',[BYE])}
  return null});
khNpc('yr_post','A post at the end of the pier','yar_driftwood',d=>{
  const F=G.flags;
  if(qSt('yq_bottle')==='active'&&F.yq3a&&!F.yq3b)return say('A grey post at the end of the pier, rubbed smooth by a hundred years of rope. The tide turns here. You can feel it pulling at the planks.',[['Cast Maren\'s reply into the sea.',()=>{F.yq3b=1;F.yq3day=yrDay();yrStep('The bottle bobs away on the tide.');return say('You uncork nothing, because Maren has already corked it, and you drop the bottle off the end of the pier. It floats for a moment, spins twice, and sets off in the direction of nowhere in particular, very upright, like a bottle with an appointment.',[BYE])}],BYE]);
  if(qSt('yq_bottle')==='active'&&F.yq3b&&!F.yq3c){
    if(yrDay()>F.yq3day&&khHour()>=5){F.yq3c=1;yrStep('The bottle has come back with an answer.');return say('A green bottle is bumping gently against the post. It is the same one. You fish it out, and there is a second slip of paper beside Maren\'s, in a hand that wobbles like a drunken spider. It says one word, in very large letters: BISCUITS.',[BYE])}
    return say('The tide is still turning. The bottle is somewhere out there, being a bottle. Come back tomorrow morning.',[BYE])}
  return say('A grey post at the end of the pier, rubbed smooth by a hundred years of rope. The sea sucks at it, thoughtfully.',[BYE])});
yrObj('yr_post','yar_driftwood',[85,43],3);

/* ---- 4. Wen's left boot ---- */
yrQ('yq_boot',"Wen's Left Boot",'Wen, the trader',[
  ['Find the sea boot that washed up on the beach, south of the harbour.',()=>yrF().yq4a,['yr_boot']],
  ['Coax the crab out of the boot with a salt herring.',()=>yrF().yq4b,['yr_boot']]
],{gold:300,xp:1500,items:['bracers']});
const D_BOOT=khQD("I have lost my left boot, and I am a man with two feet and one boot. A fisherman said he saw it come ashore on the beach, south of the harbour, but he would say that. He said he saw a sea serpent last Tuesday. Find the boot, bring it back, and Wen will remember you in his will.",
  'The beach, south of the harbour. Look for something brown and boot-shaped, and do not step in anything.',
  (n,m)=>!yrF().yq4a?'The boot is on the beach, south of the harbour.':'Coax the crab out with a salt herring, and bring the boot to Wen.',
  'That is a boot! That is certainly a boot.',
  'It is a boot. It is a very good boot. It is... (he looks at the boot, and at his own feet, and at you) ... it is a RIGHT boot. I lost my LEFT boot. ... Well. I have two right boots now. It is a start. A right boot is a right boot, and Wen is a man of his word. Here.',
  'I wear the right boot on the left foot. It has changed the way I walk. I think it is an improvement.',
  'Here is your boot.');
yrAfterShop('yr_trader','yq_boot',D_BOOT,'Is there anything you need?',"About the boot");
khNpc('yr_boot','A sea boot','kh_yprop1_0',d=>{
  const F=G.flags;
  if(qSt('yq_boot')==='active'&&!F.yq4a){F.yq4a=1;yrStep('You have found the boot. There is a crab in it.');return say('A single sea boot lies on its side in the sand, and a small red crab lives in it. He peers over the top. He will not move. He has the air of a crab who has signed a lease.',[BYE])}
  if(qSt('yq_boot')==='active'&&F.yq4a&&!F.yq4b){
    if(bagCount('herring')<1)return say('The crab holds the boot with both claws. A salt herring would settle the matter, in the way that fish settle most matters in Yarrim.',[BYE]);
    return say('The crab holds on to the boot with both claws and looks at you over the top of it.',[['Offer him a salt herring.',()=>{bagRemove('herring',1);F.yq4b=1;d.found=true;d.block=false;yrStep('You have Wen\'s boot.');return say('The crab takes the herring in one claw and the deal in the other. He climbs out, salutes, and walks away into the surf. You pick up the boot. It is a very large, very damp, very right boot.',[BYE])}],BYE])}
  return say(F.yq4b?'A dent in the sand where a boot used to be.':'A worn brown sea boot, on its side in the sand. A crab looks out of it with some suspicion.',[BYE])});
yrObj('yr_boot','kh_yprop1_0',[54,48],3);

/* ---- 5. the wedding of two boats: Selk, Brother Haldane and the harbour ---- */
yrQ('yq_wed','The Wedding of the Boats','Selk, the ship dealer',[
  ['Ask Brother Haldane, in the Chapel of the Tides, whether he will marry two boats.',()=>yrF().yq5a,['yr_priest']],
  ['Bring Brother Haldane 3 wildflowers for the bridesmaids. Wen sells them.',()=>yrF().yq5b,['yr_priest']],
  ['Take 2 mugs of ale to the boats on the harbour shore, for the toast.',()=>yrF().yq5c,['yr_boatA','yr_boatB']]
],{gold:520,xp:2300,items:['ringW']});
const D_WED=khQD("Between ourselves, I have a problem. The Silver Gull and the Little Prudence have been moored side by side for four years, and every night they bump. The harbour is talking. I have decided they should be married. It will be tasteful. There will be flowers. I need a priest, and a toast, and a little dignity.",
  'Brother Haldane is in the Chapel of the Tides. Be tactful. He has married stranger things. He once married a man and his mule.',
  (n,m)=>!yrF().yq5a?'Ask Brother Haldane, in the chapel, whether he will do it.':!yrF().yq5b?'Brother Haldane wants 3 wildflowers for the bridesmaids.':'Two mugs of ale to the boats on the harbour shore, for the toast.',
  'Is it done? Did they say yes? Did they say anything?',
  'They looked lovely. The Silver Gull leaned a little towards the Little Prudence, which is either love or a loose mooring, and I am choosing love. Here is something for your trouble, and a lifelong discount on rowing boats that I will honour for a week or two.',
  'The boats are very happy. They bump a great deal less. Nobody talks about it any more, and that is what I wanted.',
  'It is done.');
yrAfterShop('yr_dealer','yq_wed',D_WED,'Is there anything you need?','About the wedding');
yrHook('yr_priest',d=>{
  const F=G.flags;
  if(qSt('yq_wed')==='active'&&!F.yq5a){F.yq5a=1;yrStep('Brother Haldane will marry the boats, with flowers.');return say('Marry two boats? (He is quiet for a moment.) I have married a man and a mule, and a baker and her oven, and a widow and the sea, which was a hard one. A boat is not the strangest thing that has asked me. The tide gives its blessing to anyone who asks nicely. But every wedding needs flowers. Bring me three wildflowers for the bridesmaids, and I will bless them at the water.',[BYE])}
  if(qSt('yq_wed')==='active'&&F.yq5a&&!F.yq5b){
    if(bagCount('wildflower')<3)return say('Three wildflowers, for the bridesmaids. A boat deserves a bouquet, even a small one. Wen sells them.',[BYE]);
    return say('You have the flowers? Three, that is a small and honest wedding.',[['Give him the 3 wildflowers.',()=>{bagRemove('wildflower',3);F.yq5b=1;yrStep('The bridesmaids are in flowers. Now for the toast.');return say('He arranges them in a jar, bows to them, and says a few words over it in a language that sounds like waves. "The boats are blessed. A toast, now, if you would. Ale, at the water. Two mugs, one for each."',[BYE])}],BYE])}
  return null});
[['yr_boatA','The Silver Gull','yar_boat_dhow',[52,46],"The Silver Gull, a dhow with a good heart and a bad rudder."],['yr_boatB','The Little Prudence','yar_boat_fish',[55,48],"The Little Prudence, a fishing smack that has never lost a crew. Mostly."]].forEach(([id,nm,k,at,txt])=>{
  khNpc(id,nm,k,d=>{
    const F=G.flags;
    if(qSt('yq_wed')==='active'&&F.yq5b&&!F.yq5c){
      if(bagCount('ale')<2)return say(txt+' She is dressed for a wedding, with a jar of wildflowers on her bow. A toast needs 2 mugs of ale.',[BYE]);
      return say(txt+' She is dressed for a wedding, with a jar of wildflowers on her bow.',[['Pour a mug of ale over each bow and drink to them.',()=>{bagRemove('ale',2);F.yq5c=1;yrStep('The boats are married.');return say('You pour one mug over each bow and drink to the couple. Somewhere behind you Brother Haldane rings a very small bell. The Silver Gull creaks. The Little Prudence creaks back. Two gulls on the harbour wall stand to attention. Somebody is crying, and it might be Selk.',[BYE])}],BYE])}
    return say(txt+(F.yq5c?' She seems happier, and so does the one next to her.':''),[BYE])});
  yrObj(id,k,at,3);
});

/* ---- 6. Biscuit will not budge: Hamid, three apples and a bedtime story ---- */
yrQ('yq_donk',"Biscuit Won't Budge",'Hamid, the donkey driver',[
  ['Bring Biscuit the donkey 3 apples. Wen sells them.',()=>yrF().yq6a,['yr_donkey']],
  ['Biscuit wants a bedtime story. Ask Old Jory, who knows a great many.',()=>yrF().yq6b,['yr_old']],
  ['Tell Biscuit the story, on the harbour square.',()=>yrF().yq6c,['yr_donkey']]
],{gold:350,xp:1600});
const D_DONK=khQD("Biscuit has sulked since Tuesday. He will not walk. He will not trot. He has sat down in the road with the face of a donkey who has seen things. A donkey who will not pull is a cart that will not move, and a driver who will not eat. If you can make him go, I will take half the fare off every ride you ever take.",
  'He wants apples, I think. And something else. He will not tell me what. He tells me nothing. I have known him eleven years.',
  (n,m)=>!yrF().yq6a?'Biscuit wants 3 apples. Wen sells them.':!yrF().yq6b?'Biscuit wants a bedtime story. Old Jory has a great many.':'Tell Biscuit the story, here at the cart.',
  'He is up! He is standing! Look at his ears!',
  'Half fare, for the rest of your lives, and I mean it. Biscuit means it too. He has not said so, but he has stopped sulking, and you cannot say fairer than that.',
  'Biscuit trots now like a donkey with a plan. He looks at me as if I were the one who had been difficult.',
  'Biscuit is on his feet.');
khNpc('yr_donkey','Hamid and his donkey','kh_cart1_0',d=>{
  const F=G.flags,opts=[['Ask for a ride',()=>yrDonkeyMenu()]],st=qSt('yq_donk');
  if(qReady('yq_donk'))return qNode('yq_donk',D_DONK);
  if(st===null)opts.push(['Biscuit looks miserable. What is wrong?',()=>qNode('yq_donk',D_DONK)]);
  else if(st==='active'){
    if(!F.yq6a&&bagCount('apple')>=3)opts.push(['Give Biscuit 3 apples.',()=>{bagRemove('apple',3);F.yq6a=1;yrStep('Biscuit has eaten the apples.');return say('Biscuit eats all three apples, slowly, one at a time, looking at you over each one. When the last is gone he lets out a long breath and looks at you as if to say: that was the starter.',[BYE])}]);
    if(F.yq6b&&!F.yq6c)opts.push(['Tell Biscuit the story.',()=>{F.yq6c=1;yrStep('Biscuit has heard the story, and is thinking.');return say('You tell Biscuit about the donkey who was afraid of the sea, and the sea who was afraid of him. Biscuit listens with both ears. At the end, he nods once, gets to his feet with a long creak, and stamps. Hamid stares. "He has not stood up since Tuesday," he says, in a very small voice.',[BYE])}]);
    opts.push(['About Biscuit',()=>qNode('yq_donk',D_DONK)]);
  }
  opts.push(BYE);
  return say('A grey donkey stands in the shafts of a cart with a striped canopy'+(st==='active'&&!F.yq6c?', looking like the last donkey in the world':'')+'. The driver tips his turban. "Biscuit and I go back to Khemetra by the Sea Gate, and up the coast to the other towns, for a fare. Biscuit bites. I do not. A ride?"',opts)},{q:'yq_donk'});
yrHook('yr_old',d=>{
  const F=G.flags;
  if(qSt('yq_donk')==='active'&&!F.yq6b){F.yq6b=1;yrStep('Old Jory told you a story for a donkey.');return say('A bedtime story for a donkey? I know sixty-one, and all of them are true except the ones that are not. Here is the one for donkeys. Once there was a donkey who was afraid of the sea. And the sea was afraid of him. They looked at each other across the sand for a hundred years, and neither blinked, and in the end they got used to one another, and now he brays at it every morning, and it says nothing back, and they are both very happy. That is the whole story. It is the best one. Tell it slowly.',[BYE])}
  return null});

/* ---- 7. the thief of nets: Nell, Garrick and a seal with a family ---- */
yrQ('yq_seal','The Net Thief of the Night Tide','Nell, the net-mender',[
  ['Watch the net racks on the beach between nine at night and five in the morning, and see who is stealing the nets.',()=>yrF().yq7a,['yr_seal']],
  ['Ask Garrick, the other net-mender, for his oldest net.',()=>yrF().yq7b,['yr_net']],
  ['At night, trade the old net and 2 salt herring to the thief at the net racks.',()=>yrF().yq7c,['yr_seal']]
],{gold:480,xp:2200,items:['potion3']});
const D_SEAL=khQD("Every night a net goes missing off the racks on the beach. I mend five by day, and four are gone by morning. It is not the gulls. It is not the crabs. It is someone with a purpose. I am too old to sit up all night in a cold wind with a lantern. I can pay somebody to do it. I have a lot of nets and, apparently, nobody to keep them.",
  'The racks are on the beach, by the harbour. Go at night, between nine and five, and keep your eyes open. Whoever it is, be kind. I have a feeling.',
  (n,m)=>!yrF().yq7a?'Watch the net racks on the beach at night, between nine and five.':!yrF().yq7b?'Ask Garrick for his oldest net.':'At night, trade the old net and 2 salt herring at the net racks.',
  'You know who it is, do you? Do not tell me. Is it a cat?',
  'A seal, with three pups, in my best net? Well! Well, well. I shall mend them a new bed myself, with the oldest net I have. I knew it would be something like that. I did not know it would be a seal. Here is your fee.',
  'The nets stay on the racks now. At night I hear a very large breath out there on the beach, and a very small one beside it, and I sleep like a child.',
  'It was a seal, with three pups.');
khStreetQ('yr_woman','Nell, a net-mender','kh_yfolk3_0',"Mind where you walk on the beach. The crabs nip, and the gulls dive. Everything out here wants a little of you.",'yq_seal',D_SEAL);
yrHook('yr_net',d=>{
  const F=G.flags;
  if(qSt('yq_seal')==='active'&&!F.yq7b){F.yq7b=1;yrStep('Garrick gave you his oldest net.');return say('My oldest net? Nell sent you. She would. (He rummages in a heap, and holds up something that is more hole than net.) This one. It has not caught a fish since before I had a moustache. It is holes, tied together with other holes. It is the perfect net for giving to anyone.',[BYE])}
  return null});
khNpc('yr_seal','A grey seal','kh_yprop1_2',d=>{
  const F=G.flags,act=qSt('yq_seal')==='active';
  if(!khNight())return say(act?'A big grey seal sleeps among the net racks on the beach, snoring like a bellows. A seal sleeping beside the nets. Come back at night, between nine and five, and see what he does when the lamps are out.':'A big grey seal sleeps on the sand beside the net racks, snoring like a bellows. Better not to wake him.',[BYE]);
  if(act&&!F.yq7a){F.yq7a=1;yrStep('You have seen who takes the nets. He has a family.');return say('In the dark, a sleek grey seal is dragging a net down the beach with the dedication of a burglar. He sees you. He does not stop. Behind him under a pile of nets, three small pups yawn in a row. He is not a thief. He is a father with a draught.',[BYE])}
  if(act&&F.yq7a&&!F.yq7c){
    if(!F.yq7b)return say('The seal looks at the net in his mouth, at the nets on the racks, and then at you. You have nothing to trade. Garrick, the other net-mender, may have an old net to spare.',[BYE]);
    if(bagCount('herring')<2)return say('The seal looks at you, and then at your hands. He wants 2 salt herring with the old net, as a deposit.',[BYE]);
    return say('The seal holds a good net firmly in his mouth. He looks at you, and then at the bundle in your arms.',[['Trade him the old net and 2 salt herring.',()=>{bagRemove('herring',2);F.yq7c=1;yrStep('The seal has taken the old net. Nell\'s nets are safe.');return say('The seal sniffs the old net, accepts it as an upgrade, accepts the herring as a down payment, and shuffles up the beach with his pups behind him, leaving Nell\'s good net on the sand. One of the pups looks back. It is the best moment of the week.',[BYE])}],BYE])}
  return say(F.yq7c?'A cold pile of old net on the sand, a flat patch where a seal slept, and a very small nose-print.':'A seal, awake, in the dark, looking at you with enormous eyes.',[BYE])});
yrObj('yr_seal','kh_yprop1_2',[55,45],3);

/* ---- 8. the drowned lantern: Bessa, Orsa, Pell and a boat hook ---- */
yrQ('yq_lant','The Drowned Lantern','Bessa, the innkeeper',[
  ['Ask Orsa, at the lighthouse, about the light that people see in the harbour at night.',()=>yrF().yq8a,['yr_orsa']],
  ['Ask Pell the chandler for a boat hook.',()=>yrF().yq8b,['yr_chandler']],
  ['At night, hook the lantern out of the water by the harbour steps.',()=>yrF().yq8c,['yr_deeplantern']]
],{gold:560,xp:2600,items:['scrollLight']});
const D_LANT=khQD("This inn is called the Drowned Lantern after a lantern the old skipper dropped off the quay ninety years ago, and the lantern is supposed to still be burning at the bottom of the harbour. Everyone tells the story, and nobody has seen it. Not once. I want it hung over my bar. A drowned lantern with no lantern is a sign with a lie on it.",
  'Orsa up at the lighthouse knows about lights in the water. Ask her first. Then you will want something long to reach with.',
  (n,m)=>!yrF().yq8a?'Ask Orsa, at the lighthouse, about the light in the harbour.':!yrF().yq8b?'Ask Pell the chandler for a boat hook.':'At night, by the harbour steps, hook out the lantern.',
  'You have it! Do not say a word. Let me look at it. ... Oh.',
  'She holds it up, and the whole inn goes quiet. It is a brass lantern, and it is burning. "It is the lantern," she whispers. "The Drowned Lantern." She hangs it above the bar, and the flame does not flicker. "A bed here is free to you for ever," she says. "I mean it. And so does the lantern."',
  'The lantern hangs over the bar, burning, and nobody can say with what. A bed is free for you whenever you want one.',
  'Here it is.');
yrAfterShop('yr_inn','yq_lant',D_LANT,'Is there anything you need?','About the lantern');
yrHook('yr_orsa',d=>{
  const F=G.flags;
  if(qSt('yq_lant')==='active'&&!F.yq8a){F.yq8a=1;yrStep('Orsa knows about the light in the harbour.');return say('The light in the water? Everybody sees it, and nobody believes they have. It is by the harbour steps, at night, a little gold glow under a hand of water. A lantern, I think. A sealed brass one. A skipper dropped it ninety years ago, and it has been lit ever since, and I do not ask why. You cannot swim for it. You need a long hook from the quay. Ask Pell the chandler. He has one the length of a mast.',[BYE])}
  return null});
yrHook('yr_chandler',d=>{
  const F=G.flags;
  if(qSt('yq_lant')==='active'&&!F.yq8b){F.yq8b=1;yrStep('Pell has lent you a boat hook.');return say('A boat hook? For the lantern? Everybody wants to know who has the nerve, and nobody has the hook. (He lifts a pole as long as a mast from behind the door.) Here. Mind the point. Bring it back whole and wet.',[BYE])}
  return null});
khNpc('yr_deeplantern','A glow in the water','kh_yprop1_3',d=>{
  const F=G.flags,act=qSt('yq_lant')==='active';
  if(act&&F.yq8b&&!F.yq8c){
    if(!khNight())return say('Under a hand of clear water by the harbour steps, something brass sits on the bottom, and it is dark. It might light at night, between nine and five.',[BYE]);
    F.yq8c=1;d.found=true;d.block=false;yrStep('You have fished the Drowned Lantern out of the harbour.');return say('On the bottom step, under a hand of water, a lantern burns with a steady gold flame, exactly as the story says. You lower the boat hook, catch the ring, and lift it out. It is dripping, and warm, and it is still burning. You hold it to the light, and it hums, very softly, like a kettle.',[BYE])}
  if(act&&!F.yq8b)return say('A faint gold glow, down in the water by the harbour steps. It is too deep to reach by hand. A long hook would do it.',[BYE]);
  return say(F.yq8c?'The steps, wet and empty. The harbour looks a little less haunted.':'A faint gold glow in the water by the harbour steps, no brighter than a candle. It will not be hurried.',[BYE])});
yrObj('yr_deeplantern','kh_yprop1_3',[57,42],3);
{const n=NPCS.yr_inn,old=n.root;n.root=d=>{ // the grateful innkeeper gives the party free beds
  if(qSt('yq_lant')==='done'){return say('The lantern burns over the bar. A bed is free for you whenever you want one.',[['Take a room (free)',()=>{restParty(true);return say('You sleep under the lantern, and it hums to you all night. Everyone wakes healed and fed.',[BYE])}],['Any news?',()=>say(KH_GOSSIP[(Math.abs(7*(G.rounds||0)))%KH_GOSSIP.length],[BYE])],BYE])}
  return old(d)};KH_KEEPERS.yr_inn.root=n.root}

/* ---- 9. the shanty with no last verse: Rafe, Jory, Maren and Finn ---- */
yrQ('yq_shanty','The Shanty With No Last Verse','Rafe, the fiddler',[
  ['Ask Old Jory, the sailor, for a verse of the shanty.',()=>yrF().yq9a,['yr_old']],
  ['Ask Old Maren, in her house, for a verse.',()=>yrF().yq9b,['yr_maren']],
  ['Ask Finn, the fisherman, for a verse.',()=>yrF().yq9c,['yr_fisher2']]
],{gold:600,xp:2800,items:['ringM']});
const D_SHANTY=khQD("I am writing the shanty of Yarrim. Forty-one verses, and the last one will not come. I have the tune, I have the chorus, I have a fiddle and a bad knee. What I do not have is what the place thinks of itself, and a shanty is only what a place thinks of itself, with a tune on it. Three people know. Old Jory, who has seen everything, Old Maren, who has lost more of it, and Finn, who does nothing but fish and complain. Ask each for a verse, and bring them to me.",
  'Jory is on the harbour. Maren is in her house, by the chapel. Finn is about on the quay. Be gentle. A verse is a shy animal.',
  (n,m)=>n+' of '+m+' verses. Old Jory, Old Maren and Finn have them.',
  'Verses? All three? Let me hear them. No, let me PLAY them.',
  'Thank you, truly.',
  'The shanty is sung every night in the Drowned Lantern, and the last verse is the best. The inn sings it louder than the rest, and nobody knows why.',
  'Here are the verses.');
CUTS.yrShanty=()=>[
  {text:'Rafe tucks the fiddle under his chin, and the inn goes quiet. It is a slow, rolling tune, in time with the tide. He sings, in a voice like a rusty hinge, and it is beautiful anyway.'},
  {text:'"I sailed from Yarrim in the morning, when the Vaast was young and wide, with a barrel of salt and a bottle of rum and a gull on every side." (Old Jory\'s verse.)'},
  {text:'"My Tobias went for the island with the spring that never dries. He came home with a bucket and a story and a pair of other men\'s eyes." (Old Maren\'s verse.)'},
  {text:'"The herring run in silver and the gulls run off with half, and the Admiral wears a hat, and nobody dares to laugh." (Finn\'s verse.)'},
  {text:'"So haul away for Yarrim, boys, the lantern light is low, the tide is in, the crab is out, so heave and off we go." The whole inn joins the chorus, and the lantern over the bar rings a little in the glass.'},
  {text:'Rafe sings the last verse, which he has had in his head the whole time, and which nobody has ever heard before. When he is done, there is a long silence, and then somebody blows their nose.'}];
khStreetQ('yr1_p1','Rafe, a fiddler','kh_yfolk3_2',"A man at the next table sold me a map to a treasure island. I paid him in fish. He left. The map is of the next table.",'yq_shanty',D_SHANTY);
{const n=NPCS.yr1_p1,old=n.root;n.root=d=>{
  if(qReady('yq_shanty'))return say(D_SHANTY.ready,[['Here are the verses.',()=>{if(qTurnIn('yq_shanty')){yrF().yrShanty=1;G.talk=null;startCut('yrShanty')}return null}],BYE]);
  return old(d)};KH_KEEPERS.yr1_p1.root=n.root}
yrHook('yr_old',d=>{
  const F=G.flags;
  if(qSt('yq_shanty')==='active'&&!F.yq9a){F.yq9a=1;yrStep('Old Jory gave you a verse of the shanty.');return say('A verse? For the fiddler? I have a hundred, and ninety of them cannot be sung in front of a priest. This one can. "I sailed from Yarrim in the morning, when the Vaast was young and wide, with a barrel of salt and a bottle of rum and a gull on every side." That is the one. It is a true one. It is only a little exaggerated, and only about the gulls.',[BYE])}
  return null});
yrHook('yr_maren',d=>{
  const F=G.flags;
  if(qSt('yq_shanty')==='active'&&!F.yq9b){F.yq9b=1;yrStep('Old Maren gave you a verse of the shanty.');return say('A verse from me? (She laughs, a little.) I have never sung in my life. But I have one. Tell the fiddler. "My Tobias went for the island with the spring that never dries. He came home with a bucket and a story and a pair of other men\'s eyes." ... He did, you know. I never got the other men\'s eyes back. But I got the bucket.',[BYE])}
  return null});
yrHook('yr_fisher2',d=>{
  const F=G.flags;
  if(qSt('yq_shanty')==='active'&&!F.yq9c){F.yq9c=1;yrStep('Finn gave you a verse of the shanty.');return say('A verse? I do not sing. I fish. And complain, if you want to be exact about it. ... This is the only one I know. "The herring run in silver and the gulls run off with half, and the Admiral wears a hat, and nobody dares to laugh." That is the whole of Yarrim, in four lines, and a fiddler can have it for free.',[BYE])}
  return null});

/* a few more words from the people who belong to no quest, so that the village talks */
khNpc('yr_tam','Tam, a boy with a kite','kh_yfolk3_4',d=>yrLines('tam',["I flew my kite over the lighthouse and it saw the whole sea. Now it will not stop talking about it.","The wind here is always going somewhere. I do not know where. I follow it, but it is quicker.","If you let go of the string, the kite goes up and up and never comes back. That is not a mistake. That is a plan."]));
