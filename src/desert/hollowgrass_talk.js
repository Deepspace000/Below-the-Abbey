/* ==========================================================================
   THE HOLLOW GRASSLANDS, part three: the grassland tongue, the wizard Aldous Wend, the people of the five villages and their twenty quests.
   The party starts out understanding none of it. Each of the four books (found in the four hives) raises G.flags.hgLang by one, and a quest from a villager
   can only be taken once the party's understanding has reached the quest's tier. What the villagers say otherwise is shown as it sounds: some words clear,
   the rest a gurgle of syllables.
   ========================================================================== */
const hgLvl=()=>G.flags.hgLang||0;
/* the grassland tongue as the party hears it until all four books are in: words shaped like the town names (Exsce, Ulb, Glorm, Nibb), same length as the real word */
const HG_CON='xcsrngdxcsrxcsngdltmz',HG_VOW='aeeoaeio';
/* a word of the tongue: the fixed word from HG_LEX (hollowgrass_lex.js, made by tools/make_lexicon.py), also with a plural, -ed, -ing or 's ending. hgLexB gives [english base word, hollow word] or null */
const HG_SUF=[['ing','gn'],['ed','d'],['es','x'],['s','x']],hgHas=k=>Object.prototype.hasOwnProperty.call(HG_LEX,k);
function hgLexB(k){
  if(hgHas(k))return [k,HG_LEX[k]];
  let m=/^(.+)'s$/.exec(k);if(m){const b=hgLexB(m[1]);if(b)return [b[0],b[1]+"'x"]}
  for(const [sf,h] of HG_SUF){if(k.length<sf.length+3||!k.endsWith(sf))continue;const b=k.slice(0,-sf.length);
    for(const c of [b,b+'e',b[b.length-1]===b[b.length-2]?b.slice(0,-1):b])if(hgHas(c))return [c,HG_LEX[c]+h]}
  return null}
/* words are learned by asking: G.flags.hgWordSeen[english] counts the times a word was shown in a talk, G.flags.hgWords[english]=1 marks a learned word */
const hgLearned=k=>hgLvl()>=4||!!(G.flags.hgWords&&G.flags.hgWords[k]);
const HG_RECENT=[]; // the last few garbled texts, so a message can be shown again with the words just learned
function hgGarble(text,l,noCount){
  if(l>=4)return text;
  const F=G.flags,counted={};
  const out=text.replace(/[A-Za-z’']+/g,w=>{
    const key=w.toLowerCase().replace(/’/g,"'"),lb=hgLexB(key);let o;
    if(lb){
      if(hgLearned(lb[0]))return w; // a learned word is heard in plain English
      if(!noCount&&!counted[lb[0]]){counted[lb[0]]=1;const S=F.hgWordSeen||(F.hgWordSeen={});S[lb[0]]=(S[lb[0]]||0)+1}
      o=lb[1]}
    else{ // not in the lexicon: a made-up word, always the same for the same word
      let s=0;for(let i=0;i<key.length;i++)s=(s*31+key.charCodeAt(i))|0;
      const n=Math.max(1,Math.min(8,key.length));let vv=0,cc=0;o='';
      for(let i=0;i<n;i++){
        const r=hash2(s,i*7+n,78);let v=r<(n<3?.5:.34);
        if(vv>=1&&hash2(s,i*5+n,80)>.1)v=false;else if(vv>=2)v=false;else if(cc>=3)v=true;else if(i===0&&n>2&&r<.25)v=false;
        const pick=hash2(s,i*13+n,79);
        o+=v?HG_VOW[(pick*HG_VOW.length)|0]:HG_CON[(pick*HG_CON.length)|0];
        if(v){vv++;cc=0}else{cc++;vv=0}}}
    return w[0]===w[0].toUpperCase()&&w[0]!==w[0].toLowerCase()?o[0].toUpperCase()+o.slice(1):o});
  HG_RECENT.push({plain:text,out});if(HG_RECENT.length>10)HG_RECENT.shift();return out}
/* "Ask about a word.": offered once a word has been heard twice and is not yet learned */
function hgAskCands(){const S=G.flags.hgWordSeen||{};return Object.keys(S).filter(w=>S[w]>=2&&hgHas(w)&&!hgLearned(w)).sort((a,b)=>S[b]-S[a]||(a<b?-1:1)).slice(0,4)}
function hgAskAdd(nd){ // puts the option into a dialogue node, before its last option (Goodbye)
  if(hgLvl()>=4||!hgAskCands().length)return nd;
  nd.opts.splice(Math.max(0,nd.opts.length-1),0,['Ask about a word.',()=>hgAskList(nd)]);return nd}
function hgAskList(back){
  const c=hgAskCands();if(!c.length)return back;
  return say('Which word?',c.map(w=>[HG_LEX[w],()=>hgPuzzle(w,back)]).concat([['Never mind.',()=>back]]))}
/* the NPC's message as it reads now: each garbled piece is made again, so a word just learned shows in plain English at once */
function hgShowAgain(back,note){
  if(!back||typeof back.text!=='string')return say(note,[BYE]);
  const l=hgLvl();let t=back.text;
  for(const r of HG_RECENT.slice().reverse()){if(r.out&&t.includes(r.out)){t=t.replace(r.out,hgGarble(r.plain,l,true));r.out=null}}
  t=t.replace('  [You cannot understand a word of it.]',hgFoot(l));
  return Object.assign({},back,{text:note+'  '+t,opts:(back.opts||[]).filter(o=>o[0]!=='Ask about a word.')})}
function hgPuzzle(w,back){
  const pool=Object.keys(HG_LEX).filter(k=>k!==w&&!hgLearned(k)).map(k=>[Math.abs(k.length-w.length)+Math.random()*2,k]).sort((a,b)=>a[0]-b[0]).slice(0,2).map(a=>a[1]);
  const all=[w].concat(pool);for(let i=all.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[all[i],all[j]]=[all[j],all[i]]}
  const opts=[],node=say('They point and say the word again: "'+HG_LEX[w]+'". What does it mean?',opts);
  all.forEach(o=>opts.push([o,()=>{
    if(o!==w)return say('They shake their head. That is not what it means. Try again.',opts);
    (G.flags.hgWords||(G.flags.hgWords={}))[w]=1;msg('You learned: '+HG_LEX[w]+' = '+w+'.','#a8e8c0');
    return hgAskAdd(hgShowAgain(back,'You learned: '+HG_LEX[w]+' = '+w+'.'))}]));
  opts.push(['Never mind.',()=>back]);
  return node}
const hgFoot=l=>l>=4?'':(G.flags.hgWords&&Object.keys(G.flags.hgWords).length?'  [You understand only the words you have learned.]':'  [You cannot understand a word of it.]');
/* ---------- the quests ---------- */
const HG_TIERREW=[null,{gold:300,xp:5000},{gold:700,xp:10000,items:['hgjelly']},{gold:1200,xp:16000,items:['hgjelly','hgjelly']},{gold:1800,xp:24000}];
const HG_Q={}; // quest id -> data
function hgq(id,tier,title,who,kind,what,n,plural,desc,offer,accept,extra){
  const rew=Object.assign({},HG_TIERREW[tier]);if(extra&&extra.item)rew.items=(rew.items||[]).concat(extra.item);
  const q={title,who,desc,need:n,reward:rew};
  if(kind==='kill'){q.cnt='k_'+what;q.goal=cq('k_'+what)}else{q.goal=()=>Math.min(n,bagCount(what));q.take={};q.take[what]=n}
  QUESTS[id]=q;QAREA[id]='The Hollow Grasslands';HG_Q[id]={tier,who,plural,offer,accept};
}
// town 0, Exsce
hgq('hgq1',1,'Reed Bundles','Mother Glubba','item','hgreed',6,'reed bundles','Mother Glubba of Exsce needs 6 bundles of pond reeds to mend her roof. They grow in the long grass of the grasslands.','My roof has more holes than roof, and the rains come sideways here. Six bundles of reeds would mend it. They grow in the grass, out on the plain. Please.','Six bundles. Be quick, the drips are on my bed.');
hgq('hgq2',2,'Biter Swarms','Guard Skroop','kill','hgswarm0',4,'biter swarms','Guard Skroop of Exsce wants 4 swarms of biting insects driven off.','The biters come in clouds off the hills and they take the thin ones first. Four swarms gone, and my watch will sleep. Hit them as they come, and keep moving.','Four clouds. The grass is full of them.');
hgq('hgq3',3,'Honey for the Healer','Healer Wibb','item','hgcomb',3,'honeycombs','Healer Wibb of Exsce needs 3 honeycombs from the beehive dungeons, for a medicine.','The cure for the shaking sickness is a paste of honey, and the only honey is in the hives. Three combs, still fresh. I would not ask if I had another way.','Three combs from the hives. Mind the wasps.');
hgq('hgq4',4,'The Great One','Elder Ubbo','kill','hgins9',1,'Great Insectivores','Elder Ubbo of Exsce wants the Great Insectivore killed, the one as big as a house.','Every village has lost someone to the great one on the high hills, the one as big as a house. It has sat there since my grandfather’s time. If it could be killed, the whole grassland would breathe. I know it is a great thing to ask.','The Great One. May the pond be with you.');
// town 1, Ulb
hgq('hgq5',1,'Roots from the Mud','Granny Murrp','item','hgroot',5,'water-lily roots','Granny Murrp of Ulb wants 5 water-lily roots, dug out of the pond mud.','My knees are too old to dig, and the roots are best fresh. Five of the pale ones, from the mud by the ponds. I will make you a stew you will remember.','Five roots, the pale ones. Not the grey.');
hgq('hgq6',2,'Moth Clouds','Guard Plonk','kill','hgswarm1',4,'moth clouds','Guard Plonk of Ulb wants 4 clouds of pale biting moths cleared from the grass.','The pale moths are worse than the biters. They come at dusk, and there is no dusk here, so they come all the time. Four clouds of them, if you can bear it.','Four of the pale clouds. Keep your mouth shut.');
hgq('hgq7',3,'The Gulping Ones','Elder Orrl','kill','hgins4',2,'Gulping Mantises','Elder Orrl of Ulb wants 2 Gulping Mantises killed on the hills near the village.','Two gulping ones sit on the hills above Ulb, and the herders will not take the flocks out. They are bigger than a man and quicker than they look. Two of them dead, and the hills are ours again.','Two of the gulping ones. Take care on the slopes.');
hgq('hgq8',4,'The Hollow Crawlers','Healer Neeb','kill','hgins6',2,'Glass-Eyed Hunters','Healer Neeb of Ulb wants 2 Glass-Eyed Hunters killed. They hunt at the edge of the village.','I tend the ones who come back from the hills, and I am tired of what I find. Two of the glass-eyed hunters have taken the high road. If you can end them, I will have fewer wounds to tend.','Two glass-eyed hunters. You are brave, or foolish. We need both.');
// town 2, Glorm
hgq('hgq9',1,'Small Pests','Little Sploo','kill','hgins0',3,'Mire Ticks','Little Sploo of Glorm wants 3 Mire Ticks cleared from the ponds, so that the children can play.','There are ticks in my pond, with legs like needles! Three of them. Please make them go away, and I will tell nobody you were scared of them.','Three ticks. Look in the wet places.');
hgq('hgq10',2,'The Barbed Ones','Guard Drub','kill','hgins2',3,'Pond Stalkers','Guard Drub of Glorm wants 3 Pond Stalkers killed on the track.','The stalkers sit at the bends in the track and wait for the carts. Three of them dead and the carts will run on time. They are not clever, but they are patient.','Three stalkers. They sit still, so you get the first strike.');
hgq('hgq11',3,'Dusk Weavers','Elder Mowl','kill','hgins5',2,'Dusk Weavers','Elder Mowl of Glorm wants 2 Dusk Weavers killed. They spin their webs between the hill rocks.','The weavers have strung their webs between the rocks, and anything that touches them is gone by morning. Two of them, and the rocks are free. Do not touch the threads.','Two weavers. Keep to the open ground.');
hgq('hgq12',4,'The Hollow Crawlers','Merchant Gruff','kill','hgins7',2,'Hollow Crawlers','Merchant Gruff of Glorm wants 2 Hollow Crawlers killed, so that his caravans can go north.','My caravans will not go north. Two crawlers the size of carts sit on the north road, and every driver I hire quits. Kill them and the road opens, and I pay in coin.','Two crawlers on the north road. May your blades be sharp.');
// town 3, Wexsh
hgq('hgq13',1,'Reed-Skitters','Elder Wuul','kill','hgins1',3,'Reed Skitters','Elder Wuul of Wexsh wants 3 Reed Skitters killed in the grass round the village.','They are only small, but they eat the thatch, and the thatch is all we have. Three skitters dead and the roofs will last the season. Look in the tall grass.','Three skitters. They are fast, but there is no brain in them.');
hgq('hgq14',2,'The Barbed Lurkers','Mama Plibb','kill','hgins3',3,'Barbed Lurkers','Mama Plibb of Wexsh wants 3 Barbed Lurkers killed on the hills.','My boy went up the hill for a lost lamb and came back with a leg full of barbs. Three of the lurkers on that hill must die. Please. I have only my thanks, and a little coin.','Three lurkers on the hill. Go with care.');
hgq('hgq15',3,'The Hive Guards','Guard Ploom','kill','hgwasp',6,'hive guards','Guard Ploom of Wexsh wants 6 of the great wasps that guard the hives killed.','The wasps that guard the hives are the reason we cannot reach the honey. Six of them, in the hives themselves. It is a hard thing, and I would go myself if I had the legs for it.','Six hive guards. Their lances go through a shield.');
hgq('hgq16',4,'The Spindle Tyrant','Healer Fleek','kill','hgins8',1,'Spindle Tyrants','Healer Fleek of Wexsh wants the Spindle Tyrant killed. It sits on the far hill.','A tall one sits on the far hill, with legs like spears, and it has taken three of my patients before I could reach them. One death, and the hill is quiet. It is the biggest thing but one.','The Spindle Tyrant. Come back alive.');
// town 4, Nibb
hgq('hgq17',1,'Cloudy Water','Aunt Bleb','item','hgpond',4,'flasks of pond water','Aunt Bleb of Nibb wants 4 flasks of the cloudy pond water, for the festival.','The festival needs the glowing water, the cloudy kind, from the deep ponds. Four flasks. We always run short, because the young ones drink it.','Four flasks of the glowing water. Not from the shallows.');
hgq('hgq18',2,'Pickled Kelp','Little Bibb','item','hgkelp',6,'bundles of pickled kelp','Little Bibb of Nibb wants 6 bundles of pickled kelp, for the festival feast.','I am doing the feast! Nobody else would. I need six bundles of pickled kelp, and I do not know how to pickle. If you find some, bring it to me, and I will give you a very good reward.','Six bundles. Do not eat them on the way.');
hgq('hgq19',3,'Royal Jelly','Healer Slup','item','hgjelly',2,'jars of royal jelly','Healer Slup of Nibb wants 2 jars of royal jelly from the hives.','Royal jelly will mend what my herbs cannot. The queens make it, deep in the hives, and the chests there hold a little. Two jars. I cannot pay much, but the village will remember.','Two jars of royal jelly. You will find them in the chests of the hives.');
hgq('hgq20',4,'Wax Golems','Guard Grull','kill','hggolem',4,'wax golems','Guard Grull of Nibb wants 4 wax golems killed in the hives.','The hives are full of golems of wax, made by the queen to walk her halls. They have started to wander out. Four of them gone and the village is safe. Hit them hard, they are brittle.','Four golems. Hit them hard, they crack.');
// the four books
const HG_BOOKQ=[['The Primer of Ripples','The Hush Hive'],['The Book of Small Courtesies','The Droning Hive'],['The Grammar of the Deep Water','The Amber Hive'],['The Queen’s Dictionary','The Queen’s Hive']];
HG_BOOKQ.forEach((b,i)=>{const id='hgb'+(i+1);QUESTS[id]={title:'The Book: '+b[0],who:'Aldous Wend',desc:'Aldous Wend, in Exsce, wants '+b[0]+' brought to him from '+b[1]+'. Each book teaches the party more of the grassland tongue.',need:1,goal:()=>Math.min(1,bagCount(id.replace('hgb','hgbook'))),take:{[id.replace('hgb','hgbook')]:1},reward:{gold:500*(i+1),xp:6000*(i+1)}};QAREA[id]='The Hollow Grasslands'});
QAREA_ORDER.splice(QAREA_ORDER.indexOf('Elsewhere'),0,'The Hollow Grasslands');
function hgQD(id){const Q=HG_Q[id],nm=Q.who.replace(/^(Mother|Guard|Healer|Elder|Granny|Little|Merchant|Mama|Aunt) /,'');
  return khQD(Q.offer,Q.accept,(g,n)=>`${g} of ${n} ${Q.plural}.`,'You have done it! I could not understand a word of your language, and yet here you are, with exactly what I asked for. The grassland has strange friends.','Thank you, truly. The pond will remember you, and so will I.','Thank you again. Everyone here knows what you did.','Here it is.')}
const HGQD={};for(const id in HG_Q)HGQD[id]=hgQD(id);
const HG_QOF={};
/* ---------- the villagers ---------- */
function hgNative(id,name,img,chat,qid,o){
  o=o||{};
  const root=()=>{const F=G.flags,l=hgLvl();
    if(qid){const st=qSt(qid),Q=HG_Q[qid];
      if(st==='active'||st==='done'||l>=4)return qNode(qid,HGQD[qid]);
      return hgAskAdd(say(hgGarble(Q.offer,l)+hgFoot(l),[BYE]))}
    const k='hgc_'+id,i=(F[k]||0)%chat.length;F[k]=i+1;
    return hgAskAdd(say(hgGarble(chat[i],l)+hgFoot(l),chat.length>1?[['Listen again.',()=>NPCS[id].root()],BYE]:[BYE]))};
  khNpc(id,name,img,o.root||root,{q:qid||undefined,sc:o.sc});
  if(qid)HG_QOF[id]={tier:4};
}
const HG_STOCK=[['hgcomb',6],['hgkelp',6],['hgroot',6],['hgpond',4],['hgjelly',3],['hggrubs',5],['potion',4],['hgbarb',1],['hgcarapace',1]];
function hgMerchant(id,name,img,greet){
  hgNative(id,name,img,[greet],null,{root:()=>{const l=hgLvl();
    return hgAskAdd(say(hgGarble(greet,l)+hgFoot(l),[['Trade (pointing at things).',()=>{openShop(G.talk.d,HG_STOCK,name);return null}],BYE]))}})}
function hgHealer(id,name,img,greet){
  hgNative(id,name,img,[greet],null,{root:()=>{const l=hgLvl();
    return hgAskAdd(say(hgGarble(greet,l)+hgFoot(l),[['Be tended (40 gold).',()=>{if(G.gold<40)return say('You cannot pay forty gold. The healer shrugs, kindly.',[BYE]);G.gold-=40;restParty(false);return say('Cool, damp hands and a green paste. Everyone feels better.',[BYE])}],BYE]))}})}
// [id, name, picture, position from the middle of the village, quest, what they say, scale]
const HG_FOLK=[
 [['hgn_glubba','Mother Glubba','hg_npc1',[-2,0],'hgq1',['The pond is high this year, and so are the prices.','Do not step on the reeds, little ones sleep in them.']],
  ['hgn_skroop','Guard Skroop','hg_npc4',[0,-8],'hgq2',['The gate is open to the honest and shut to the biters. Mostly.']],
  ['hgn_wibb','Healer Wibb','hg_npc6',[5,3],'hgq3',['A cough, a limp and a fever, the same as every morning.']],
  ['hgn_ubbo','Elder Ubbo','hg_npc0',[0,-2],'hgq4',['Sit, sit. The pond has been here longer than we have, and it will be here after.']],
  ['hgn_brollo','Brollo, the trader','hg_npc5',[5,-2],null,['Honey, kelp, roots and a few good things from the hives. Look as long as you like.'],'merchant'],
  ['hgn_pip','Pip','hg_npc3',[-5,3],null,['Have you seen the big ones on the hills? I have! From very far away!','I am not afraid of anything. Except the moths. And spiders.'],'child'],
  ['hg_aldous','Aldous Wend, wizard','hg_wizard',[2,0],null,null,'wizard']],
 [['hgn_murrp','Granny Murrp','hg_npc1',[-2,0],'hgq5',['The mud gives and the mud takes. You have to know which day it is.']],
  ['hgn_plonk','Guard Plonk','hg_npc4',[0,8],'hgq6',['Quiet watch tonight. Or no. It is always the same watch.']],
  ['hgn_orrl','Elder Orrl','hg_npc0',[0,-2],'hgq7',['We came here when the water rose. We stayed because it did not fall.']],
  ['hgn_neeb','Healer Neeb','hg_npc6',[5,3],'hgq8',['I can mend a leg. I cannot mend a fright.']],
  ['hgn_bibb','Bibb','hg_npc3',[-5,-3],null,['I found a shell! It is a whole one! Do you want it? You cannot have it.']],
  ['hgn_lorr','Lorr, the herder','hg_npc4',[5,-2],null,['The flocks are quiet today. The hills are not.','I have lost three sheep this year. The hills have eaten them.']]],
 [['hgn_sploo','Little Sploo','hg_npc3',[-2,0],'hgq9',['I am the bravest in Glorm. I am the smallest, but the bravest.']],
  ['hgn_drub','Guard Drub','hg_npc4',[0,-8],'hgq10',['Nothing gets past me. Except the biters. And the moths. And the mud.']],
  ['hgn_mowl','Elder Mowl','hg_npc0',[0,-2],'hgq11',['In my day the hills were quiet and the water was warm. In my day, I was not so old.']],
  ['hgn_gruff','Merchant Gruff','hg_npc5',[5,3],'hgq12',['Trade is slow. The roads are bad. The crawlers eat the caravans.']],
  ['hgn_sprell','Sprell, the baker','hg_npc1',[-5,3],null,['Kelp bread, hot! Water-lily bread, hot! Moth-wing bread, I do not recommend.']],
  ['hgn_gleb','Gleb, the healer','hg_npc6',[5,-3],null,['Bring me a cut and I will bring you a scar. Bring me a scar and I will bring you a story.']]],
 [['hgn_wuul','Elder Wuul','hg_npc0',[0,-2],'hgq13',['Wexsh is the oldest village. It is also the smallest, which is a coincidence.']],
  ['hgn_plibb','Mama Plibb','hg_npc1',[-2,0],'hgq14',['My boy is clever. He gets it from his father, who was not.']],
  ['hgn_ploom','Guard Ploom','hg_npc4',[0,8],'hgq15',['I have guarded this gate for twenty years and nothing has come in. This is the only reason I am still here.']],
  ['hgn_fleek','Healer Fleek','hg_npc6',[5,3],'hgq16',['The old ones say the grassland was a pond once. I believe them.']],
  ['hgn_snorr','Snorr, the trader','hg_npc5',[-5,-3],null,['I trade in what people want. People want kelp, mostly.'],'merchant'],
  ['hgn_wimm','Wimm','hg_npc3',[5,-2],null,['One day I will go to the hives and bring back a whole honeycomb. One day. Not today.']]],
 [['hgn_bleb','Aunt Bleb','hg_npc1',[-2,0],'hgq17',['The festival is the best night of the year. Though it is always dark.']],
  ['hgn_bibbn','Little Bibb','hg_npc3',[0,-2],'hgq18',['I am cooking the feast! I am doing the whole feast! By myself! Alone!']],
  ['hgn_slup','Healer Slup','hg_npc6',[5,3],'hgq19',['The queens make the best medicine in the world, and nobody can get it.']],
  ['hgn_grull','Guard Grull','hg_npc4',[0,8],'hgq20',['The north gate is mine. I like the north gate. It is quiet. Mostly.']],
  ['hgn_oom','Elder Oom','hg_npc0',[5,-2],null,['I remember when the roof glowed, long ago. I was very small. It was very bright. I did not like it.']],
  ['hgn_trundle','Trundle, the trader','hg_npc5',[-5,3],null,['Everything has a price. Even a kind word. Especially a kind word.'],'merchant']]];
for(const town of HG_FOLK)for(const f of town){const [id,nm,img,p,qid,chat,role]=f;
  if(role==='wizard')continue;
  if(role==='merchant')hgMerchant(id,nm,img,chat[0]);
  else if(/Healer|healer/.test(nm)&&!qid)hgHealer(id,nm,img,chat[0]);
  else hgNative(id,nm,img,chat,qid,{sc:role==='child'?.8:undefined})}
function hgPopulate(ti,cx,cy,decor,used){
  for(const f of HG_FOLK[ti]){const [id,nm,img,p,qid,chat,role]=f,x=cx+p[0],y=cy+p[1];
    if(role==='wizard'){decor.push({k:'hg_wizard',x,y,block:false,walk:true,npc:'hg_aldous',sc:1});continue}
    decor.push({k:img,x,y,block:false,walk:true,npc:id,sc:role==='child'?.8:1});used.add(x+','+y)}
  // the extra merchants and healers of the larger villages
  if(ti===2||ti===3||ti===4){}
}
/* ---------- the frog-whales: harmless ---------- */
const HG_FROGLINES=['A great damp creature, something between a whale and a frog, sits chewing reeds. It looks at you with huge, gentle eyes and does not move.','The frog-whale burps, softly, and goes back to its reeds. It is plainly harmless.','The great round creature turns one slow eye towards you, decides that you are not interesting, and sighs through its wide mouth.','A frog-whale sits in the grass, glistening. Small insects land on it and it ignores them. It is warm to the touch.'];
khNpc('hg_frogbeast','A frog-whale','hg_frog0',()=>say(HG_FROGLINES[(G.flags.hgFrog=(G.flags.hgFrog||0)+1)%HG_FROGLINES.length],[BYE]));
/* ---------- Aldous Wend ---------- */
khNpc('hg_aldous0','Aldous Wend, wizard','hg_wizard',()=>{
  const l1=say('Well met, travellers! Do not be alarmed. I am Aldous Wend, a wizard, and I have been waiting a long while for someone with sensible boots. You have come through the portal into the Hollow Grasslands, a great cavern inside the earth, where the roof is lost in the dark and the wind never stops.',[['Go on.',()=>l2]]);
  const l2=say('The people who live here are good people, but they speak in the gurgle and click of the deep ponds, and no stranger can follow it. You will hear them, and read what they say, and understand none of it. They cannot ask you for help, and you cannot give it.',[['Go on.',()=>l3]]);
  const l3=say('I can. There is a village a good walk north along the track, called Exsce. Meet me there; follow the dirt track to the great shell gate in the wall. Exsce is a tall city of stairs, and my study is at the top of the spiral tower. I will give you four tasks, and each one will teach you more of their tongue. Mind the hills on the way: there are things in the long grass that sit and wait. Walk on the track, and do not go near the high ground.',[['We will meet you in Exsce.',()=>{const F=G.flags;F.hgIntro=1;const d=G.decor.find(q=>q.npc==='hg_aldous0');if(d){d.hidden=true;d.npc=undefined;d.block=false}msg('Aldous Wend has asked you to meet him in the village of Exsce, a good walk north along the track.','#ffe36a');return null}]]);
  return l1;
},{sc:1});
const HG_HINTS=['The Hush Hive lies to the west, a long walk south-west of Exsce, in the low hills. It is the smallest of the four, and the quietest. The grubs in it are slow.','The Droning Hive lies far to the east, beyond Glorm. The wasps there are many and they never sleep, so go well rested.','The Amber Hive lies north of Exsce, beyond the high hills, in rocky ground. Its guardian is made of wax. It is slow, but it hits hard.','The Queen’s Hive lies in the far north, past Nibb, at the top of the grassland. The queen keeps her great dictionary there. Go last, and go ready.'];
khNpc('hg_aldous','Aldous Wend, wizard','hg_wizard',()=>{
  const F=G.flags,lv=hgLvl(),nextId='hgb'+(lv+1),nextOk=lv<4&&(qSt(nextId)===null||qSt(nextId)==='active'||qSt(nextId)==='done');
  const opts=[];
  if(!F.hgMetAldous){F.hgMetAldous=1;return say('There you are, and with your boots, too! This is Exsce, the nearest of the five villages: Exsce, Ulb, Glorm, Wexsh and Nibb. You cannot understand a word they say, and that is a thing I mean to mend. I need four books. Each is kept in one of the four beehives that lie about the grassland, and each will teach you more of their tongue than the last.',[['Tell me about the first book.',()=>qNode('hgb1',HG_BD.hgb1)],BYE])}
  if(lv<4)opts.push(['About the next book.',()=>qNode(nextId,HG_BD[nextId])]);
  opts.push(['Where are the hives?',()=>say('There are four. '+HG_HINTS.join(' '),[BYE])]);
  opts.push(['How do I learn their tongue?',()=>say('Bring me the books, one by one. The first gives you a handful of words, the second most of the courtesies, the third nearly all of it, and the fourth, the queen’s own dictionary, the whole language. At each step more of what the villagers say will make sense, and the villagers will begin to ask you for things. They have twenty tasks between them, five for each stage of your learning. Until you know the tongue you cannot agree to them.',[BYE])]);
  opts.push(BYE);
  return say(lv>=4?'You speak the grassland tongue as well as any of them now. I am almost jealous. Go and find the villagers: they have a great many tasks for someone who can understand them.':lv===0?'The villagers will not make sense to you yet. Bring me the first book from the Hush Hive.':'The villagers will not make sense to you until I have all four books. Bring me the next one.',opts)
},{sc:1,q:['hgb1','hgb2','hgb3','hgb4']});
const HG_BD={};
[['hgb1','The first book is The Primer of Ripples, in the Hush Hive, to the west. It is a book of simple words. The Hush Hive is the quietest of them, but the grubs bite and the guard wasps are not friendly. Find the lectern in the heart of the hive, and bring me what is on it. And if you see any frogs caught in the honey there, free them: the hive has taken eight of our villagers.','The Hush Hive, to the west. The book is on a lectern in the heart of the hive.','The Primer! Look at the state of it. Oh, you did well, you really did. Here: let me say something to you in the old tongue. There. Did you catch a word? That is the beginning.','Take this for your trouble. And go and find the villagers: they will make a little more sense now.','The Primer of Ripples is at its home.','Here is the Primer of Ripples.'],
 ['hgb2','The second book is The Book of Small Courtesies, in the Droning Hive, far to the east. The wasps there are many, and the golems are patient. Do not fight in the open halls if you can fight in a doorway. The hive has also hung eight of our villagers up in silk cocoons. Cut them down if you can.','The Droning Hive, far to the east. The book is in the heart of the hive.','The Courtesies! Good. Now you will be able to say thank you, which is most of the language. Do you hear it? Now you will be able to follow most of what people say when they are being polite.','A fine piece of work. Go and be polite to somebody.','The Book of Small Courtesies is at its home.','Here is The Book of Small Courtesies.'],
 ['hgb3','The third book is The Grammar of the Deep Water, in the Amber Hive, north of Exsce. The hive is full of wax, and a great golem of wax stands in its heart. It will take more than a sword to break it. Eight of our villagers are sealed in the wax cells there. Open them, if you have the stomach.','The Amber Hive, north of Exsce, beyond the high hills. The book is in the heart of the hive.','The Grammar! This is a very big book. Now the sentences will make sense, and not only the words. You will soon hear them properly.','Brilliant. Nearly there. One more, and it is the hardest.','The Grammar of the Deep Water is at its home.','Here is The Grammar of the Deep Water.'],
 ['hgb4','The last is the Queen’s Dictionary, in the Queen’s Hive, at the far north of the grassland. The queen herself guards it. She is large, and she is not welcoming. I do not ask lightly.','The Queen’s Hive, in the far north. The dictionary is in the heart of the hive, where the queen sits.','The Dictionary! The queen’s own! You have done something very few have done. Now there is no word in the grassland that you cannot follow. Go. Be understood.','You have all four. I am proud of you. Go and help them, they need it.','The Queen’s Dictionary is at its home.','Here is the Queen’s Dictionary.']
].forEach(([id,offer,accept,ready,thanks,after,turn])=>{HG_BD[id]=khQD(offer,accept,()=>QUESTS[id].desc,ready,thanks,after,turn)});
/* a book handed in raises the party's understanding of the tongue */
{const _t=qTurnIn;qTurnIn=function(id){const ok=_t.apply(this,arguments),m=/^hgb(\d)$/.exec(id);
  if(ok&&m){const n=+m[1];if((G.flags.hgLang||0)<n){G.flags.hgLang=n;if(n>=4)msg('You can now understand everything the people of the grassland say.','#a8e8c0')}}
  return ok}}
/* the gold ! over a villager is only shown once the party knows enough of the tongue to take the quest */
{const _qm=questMark;questMark=function(d){const r=_qm.apply(this,arguments);if(r===1&&d&&d.npc&&HG_QOF[d.npc]&&HG_QOF[d.npc].tier>hgLvl())return 0;return r}}
/* the wizard comes to meet the party at the start, and the first look at the land */
{const _u=update;update=function(dt){
  if(LEVEL===HG.ID&&G.state==='play'&&G.decor&&!G.flags.hgIntro&&!G.talk&&!G.menu&&!G.overview&&!G.cut&&!G.loot&&!G.inv.open){const d=G.decor.find(q=>q.npc==='hg_aldous0'&&!q.hidden);
    if(d){const dx=G.P.x-d.x,dy=G.P.y-d.y,dist=Math.hypot(dx,dy);G._hgT=(G._hgT||0)-dt;
      if(dist>2.6){if(G._hgT<=0){G._hgT=.35;const sx=Math.abs(dx)>=Math.abs(dy)?Math.sign(dx):0,sy=sx?0:Math.sign(dy),nx=d.x+sx,ny=d.y+sy;if(!G.decor.some(q=>q!==d&&q.block&&q.x===nx&&q.y===ny)){d.x=nx;d.y=ny}}}
      else{G.flags.hgIntro=1;startTalk(d)}}} // the welcome starts once; if it is closed early the wizard can still be talked to
  return _u.apply(this,arguments)}}
{const _oe=ohEnter;ohEnter=function(n){_oe.apply(this,arguments);if(n===HG.ID&&!G.flags.hgSeen){G.flags.hgSeen=1;msg('Wind hisses through the long grass. You are inside the earth: a vast cavern, with a roof lost in the dark overhead.','#b8c8d8')}}}
