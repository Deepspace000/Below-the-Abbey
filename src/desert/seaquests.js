/* ==========================================================================
   QUESTS OF THE SEA. Tam Salvor in Yarrim sells the Diving Helms. Four dive quests, one under each island. Four chains for the open sea:
   the Drowned Fleet (Sable Maeve), Orsa's Sons, Serpents and Pearls, and the Kraken's Price.
   ========================================================================== */
ITEMDEF.wreckoak={n:'Wreck-Oak',k:'quest',t:'Timber',ic:'herb',c:'#7a6a4a',stack:1,price:30,d:'A salt-hard plank of black oak, long drowned and never rotted. Shipwrights say it takes any edge and any weight.',sw:.5};
ITEMDEF.serpentegg={n:'Serpent Egg',k:'quest',t:'Egg',ic:'herb',c:'#40a080',stack:1,price:0,d:'A leathery green egg as big as a loaf, warm in the hand. Something inside turns over when you move.',sw:.5};
ITEMDEF.admiralblade={n:"The Admiral's Cutlass",k:'weapon',t:'Sword',ic:'sword',c:'#d8e4f0',dmg:[22,32],hit:.1,req:{str:14},price:2800,rar:1,d:'A curved blade of blue steel with a pearl in the hilt, kept dry in a sealed case for a hundred years. It cuts as if the sea were helping.',sw:.4};
ITEMDEF.greatharpoon={n:'The Great Harpoon',k:'weapon',t:'Sword',ic:'sword',c:'#c8d0d8',dmg:[26,36],hit:.06,req:{str:16},price:3200,rar:1,d:'Wreck-oak shaft, a barbed head as long as a forearm, and a coil of line. Made by Pell the chandler to answer the Kraken.',sw:.6};
const SQ=n=>{const F=G.flags;return F[n]||(F[n]={})};
/* ---- Tam Salvor and the helms ---- */
khNpc('yr_diver','Tam Salvor, the helm-maker','kh_yfolk3_4',d=>{
  const F=G.flags;
  return say('Tam Salvor. I make helms for people who want to look at the bottom of things. A Diving Helm is brass, riveted, with a glass visor and a hose to a little bellows. It gives four minutes of air and no more, but there are streams of bubbles on the sea floor, vents, and a hero standing in one breathes freely until the helm is full again. Every one of you needs one, in the helmet slot.',[
    ['Buy diving helms.',()=>{openShop(d,[['divehelm',8]],"Tam Salvor's Helms");return null}],
    ['Where can we dive?',()=>say('Off every island you have a dive line, a red-and-white buoy on a rope. Saltbarrow has a reef, the Isle of Bells a drowned abbey, Cinder Isle a garden of vents and Last Light a wreck among the kelp. Giant clams hold pearls, and the big things down there bite, so go in with your swords.',[BYE])],
    [F.gill?'Thank you for the helms, but I hear you do not need them any more.':'Is there another way to breathe down there?',()=>say(F.gill?'A Potion of the Gill. Imagine it. I make helms for a living and a bottle of green water does it better. Congratulations. I will find another trade.':'There is a potion. The old sailors call it the Gill. Whoever drinks it, the sea takes in for good. I have never seen a bottle. They say a priest might part with one for pearls, and that the last wreck keeps a bottle of its own.',[BYE])],
    BYE]);
});
YR_QFOLK.push({id:'yr_diver',at:[60,41],rad:6});
/* ---- the dive quests ---- */
const dq=(id,t,who,desc,lv,reward)=>vq(id,t,who,desc,1,()=>(G.flags.uwPrize&&G.flags.uwPrize[lv])?1:0,reward);
dq('uq1',"Maeve's Sunk Fortune",'Sable Maeve',"Sable Maeve's treasure went down with her flagship on the reef below Saltbarrow, and a very big octopus lives in it now. Dive, kill the Reef Warden and bring up her chest. You need a Diving Helm each.",320,{gold:900,xp:6000,items:['potion4']});
dq('uq2','The Silent Bell','Brother Aldous','The great bell of the drowned abbey fell to the sea floor, and its clapper was torn away. Brother Aldous would like it back. A colossal moray lives in the abbey now.',321,{gold:1100,xp:7000,items:['potion4']});
dq('uq3','The Heart of the Vent','Ketra, the ash-priestess','Ketra says the Cinder Isle was born from one black crystal at the bottom of the sea, the Heart of the Vent, and a creature of teeth guards it. Dive to the Vent Gardens and bring it up.',322,{gold:1300,xp:8000,items:['potion4']});
dq('uq4','The Lens of Last Light','Isolde','The beacon of Last Light fell into the sea with its great lens. Isolde wants it raised, and a very old fish is circling in the wreck. Dive and bring the lens up.',323,{gold:1600,xp:9500,items:['potion4']});
const DU={
 uq1:khQD('Corvane\'s guns sank my flagship on the reef off this island, with the whole company\'s pay in the hold. A reef warden has moved in: an octopus the size of a cottage. If you can get a helm each from Tam Salvor in Yarrim, go down and fetch my chest. Mind the sharks.','The dive line is a buoy on the south beach. Four minutes of air a time, and the bubbles at the vents give you more.',(n,m)=>'The chest is on the reef floor, behind the Warden. The dive line is the buoy on the south beach.','You have it? My chest?','My old cutlass. My pay. Forty names I owe. Bless you, friends. Here, for the trouble.','The reef has quieted down. I sleep a little better.'),
 uq2:khQD('When the sea took the abbey, the bell went with it, and the clapper tore off and fell separately. A bell with no tongue is a gate with no hinge. There is an eel down there that has made the nave its den. Bring me the clapper, and the bells will sound again.','The dive line is the buoy on the south beach. Bring a helm for every one of you.',(n,m)=>'The clapper is somewhere in the nave of the drowned abbey, and the Abbey Eel is guarding it.','The clapper! Give it here. Let me hold it.','It is heavier than I expected. When it rings again I will think of you.','The bell is hung again. On still nights you can hear it under the water.'),
 uq3:khQD('Cinder Isle was born from one crystal, thrown up from the sea floor in the first fire of the world. The Heart of the Vent, we call it. It lies in the Vent Gardens, and a tyrant lives there, a shark as long as a ship. Bring me the Heart and the mountain will keep its peace.','Down the dive line off the south beach. The vents are your friends: bubbles to breathe.',(n,m)=>'The Heart of the Vent lies in the Tyrant\'s arena at the far end of the vent gardens.','The Heart. I can feel the mountain\'s pulse in it.','It is warm. The mountain is grateful, and so am I. Take this.','The mountain sleeps, because of you.'),
 uq4:khQD('The beacon fell into the sea a century ago, with its lens. The lens is why it was called Last Light: you could see it from three days away. It lies in the wreck below the kelp, with a very old fish for company. If you bring it up, we can light it again.','Down the dive line. Wear your helms. The kelp forest is lovely, if you are not eaten in it.',(n,m)=>'The lens lies in the wreck among the kelp, and Old Gulper circles it.','The lens! Oh, look at the light in it.','I can hardly hold it. Thank you. There is another thing down there, if you have not found it yet: a green bottle in the same chest. The old keepers said it was a gift from the sea.','The lens sits on the shore, catching the sun. Soon the beacon will shine again.')
};
repWrap('sb_maeve',()=>qSt('vq1')==='done'&&qSt('uq1')!=='done','About the sunk flagship',()=>qNode('uq1',DU.uq1));
repWrap('ib_aldous',()=>qSt('vq2')==='done'&&qSt('uq2')!=='done','About the abbey bell',()=>qNode('uq2',DU.uq2));
repWrap('ci_ketra',()=>qSt('vq3')==='done'&&qSt('uq3')!=='done','About the Heart of the Vent',()=>qNode('uq3',DU.uq3));
repWrap('ll_isolde',()=>qSt('vq4')==='done'&&qSt('uq4')!=='done','About the beacon lens',()=>qNode('uq4',DU.uq4));
/* ---- chain A: the Drowned Fleet ---- */
vq('sa1','Logbooks of the Fleet','Sable Maeve','Corvane scattered Sable Maeve\'s fleet across the Vaast Sea. The ships\' logbooks are in the wrecks that drift or lie on the islands. Bring Maeve the news from 3 of them.',3,()=>Math.min(3,Object.keys(SQ('saLogs')).length),{gold:900,xp:5000});
vq('sa2',"The Admiral's Cache",'Sable Maeve',"The logbooks point to Leviathan's Rest, a speck far in the east, where Maeve's old Admiral buried his prize. Nobody sails east of the line, because of what lives there. Kill the Kraken, land on Leviathan's Rest and open the cache.",1,khFlag('saCache'),{gold:2500,xp:14000,items:['potion4']});
const DA1=khQD('Corvane shot my fleet to pieces, and the pieces are scattered. Every ship kept a log, and the logs say where the Admiral hid the best of what we took. Look in the wrecks, the floating ones and the ones on the islands. Find three logs and tell me what they say.','Drifting wrecks mark the open sea, and the little islands keep more. Walk up to one and look.',(n,m)=>`${n} of ${m} logs found. There are more wrecks out there.`,'Three logs! Read them to me.','The Admiral\'s cache is on Leviathan\'s Rest, at the far east of the sea. That is past the line where the Kraken lives. A harpoon would help, if anyone made one.','The logs are in my sea chest. The Admiral\'s cache is a long way east.');
const DA2=khQD('The cache is on Leviathan\'s Rest, past the Kraken line. Nobody has sailed there in a hundred years. The sea east of x545 belongs to something with a thousand arms. If you kill it, the cache is yours, and half of it is mine. Pell makes a harpoon, they say.','Sail east. You will know when you cross the line, because the gulls stop. The cache is under the old altar on the island.',(n,m)=>'The Kraken first, then Leviathan\'s Rest, at the far east of the sea.','The cache! Did you find it?','Every coin and the Admiral\'s own cutlass! I knew the old man hid it well. You have earned your half and more.','The Admiral\'s cache is yours, and the east is open.');
repWrap('sb_maeve',()=>qSt('vq1')==='done',"About the Drowned Fleet",()=>{
  if(qSt('sa1')!=='done')return qNode('sa1',DA1);
  return qNode('sa2',DA2);
});
khNpc('sea_wreck','A drifting wreck','yar_wreck',d=>{
  const F=G.flags,L=SQ('saLogs');
  if(qSt('sa1')==='active'&&!L['f'+d.cat]){L['f'+d.cat]=1;sfx('key');const n=Object.keys(L).length;return say(`Among the weed and the rotted ropes, a sea chest with a bronze lock. Inside, in oilcloth: a ship's log, the last pages written in a shaking hand about a black hull and a red heron. ${n} of 3 logs found.`,[BYE])}
  return say('The hull of a wrecked ship rides low in the water, broken-masted and weed-hung. Whatever she was, nothing is left aboard but a few ropes and gulls.',[BYE])});
khNpc('isle_wreck','A wrecked hull','yar_wreck',d=>{
  const F=G.flags,L=SQ('saLogs');
  if(qSt('sa1')==='active'&&!L['i'+d.cat]){L['i'+d.cat]=1;sfx('key');const n=Object.keys(L).length;return say(`The ribs of a wrecked ship, and in the sand beneath the stern, a sea chest. A ship's log, wrapped in oilcloth, with a great many names crossed out. ${n} of 3 logs found.`,[BYE])}
  return say('The ribs of a wrecked ship stand out of the sand, hung with weed. Cracked barrels, a rusted lantern and a broken oar lie in her shadow.',[BYE])});
khNpc('isle_altar','An old altar','yar_altar',d=>{
  const F=G.flags;
  if(LEVEL!==343)return say('A weathered stone altar. Someone burned something here long ago, and the stone still remembers the heat.',[BYE]);
  if(!F.krakenSlain)return say('A black altar of glass and bone. The sea beyond it is silent, and you feel watched.',[BYE]);
  if(F.saCache)return say('The cache is open and empty.',[BYE]);
  F.saCache=1;sfx('key');G.gold+=goldCut(4000);giveXP(6000);bagAdd(mkItem2('admiralblade',1));
  return say('Under the altar, a vault of black stone, dry as a bone. A hundred years of coin in leather bags, charts, a captain\'s signet, and a sealed case with a blue-steel cutlass in it.',[BYE])});
/* ---- chain B: Orsa's Sons ---- */
vq('sb1','Two Boys at Sea',"Orsa, keeper of the Yarrim Light",'Orsa\'s sons, Tobin and Wren, sailed out in the Gull\'s Wing three weeks ago, and never came home. Find them. Tobin is on a big forest island, Wren on a rock far out. Ask the sailors.',2,()=>Object.keys(SQ('sbFound')).length,{gold:900,xp:5000});
vq('sb2','Bring Them Home',"Orsa, keeper of the Yarrim Light",'Tobin and Wren are alive. Take them home aboard the Dawn Walker and see Orsa at the Yarrim Light.',1,khFlag('sbHome'),{gold:1600,xp:8000,items:['potion4']});
const DB1=khQD('My boys took the Gull\'s Wing out three weeks ago to fish the far reefs, and the wind took them. A fisherman from the pier swears he saw smoke on the big forest island in the middle of the sea, and a white sail on a rock to the north-west. Find them, if you have a ship and a heart. I will keep the lamp lit.','The Hollow Isle is the forest island north-west of the middle of the sea. The rock is Cormorant Ledge, in the south-west.',(n,m)=>`${n} of ${m} found.`,'You found them? Both?','Oh, thank you. Thank you. Go and bring them in.','They are home and well, and the lamp burns for them.');
const DB2=khQD('Both alive! Then bring them home. The Dawn Walker is the only ship in Yarrim that can sail out and back.','They wait on their islands. When you have spoken to them both, sail home to the Light.',(n,m)=>'Talk to both boys, then bring them to me.','My boys! Are they aboard?','You have given me back my sons. I have no gold, but I have a lamp, and the lamp is yours as long as you live.','They are at home and sleeping, and I will not stop looking at them.');
repWrap('yr_orsa',()=>qSt('yar6')==='done',"About her sons",()=>{
  if(qSt('sb1')!=='done')return qNode('sb1',DB1);
  return qNode('sb2',DB2);
});
khNpc('sn_tobin','Tobin, a castaway','peasantM',d=>{
  const F=G.flags,S=SQ('sbFound');
  if(qSt('sb1')===null)return say('A man in a torn smock, living on berries and a smoky fire. "Have you come from Yarrim? Is my mother still lighting the lamp?" He seems to know you have not come for him.',[BYE]);
  if(!S.tobin){S.tobin=1;return say('A man in a torn smock, thin and brown. "The Gull\'s Wing is on the rocks round the headland. Wren and I split up to look for water. He went north-west on the little raft. My mother sent you? Tell her we are alive. Let me come aboard, I can work.", he says. He climbs down to the beach and waits by your boat.',[BYE])}
  return say('Tobin waits by the ship, patient and happy. "Home," he says. "Home."',[BYE])});
khNpc('sn_wren','Wren, a castaway','fisher',d=>{
  const F=G.flags,S=SQ('sbFound');
  if(qSt('sb1')===null)return say('A thin young man in a scrap of sail, waving at every gull that goes by. "Are you real?" he says. "Be real."',[BYE]);
  if(!S.wren){S.wren=1;return say('"You came! I have been counting waves for nineteen days. Tobin? He is alive? Praise the tide." He stumbles down to the sand. "My mother will have lit the lamp every night, whatever I did."',[BYE])}
  return say('Wren sits on the sand, laughing a little at nothing. "Home," he says.',[BYE])});
function sbHomeCheck(){const S=SQ('sbFound');if(S.tobin&&S.wren&&!S.home&&qSt('sb2')==='active'){S.home=1;G.flags.sbHome=1}}
/* ---- chain C: serpents and pearls ---- */
vq('sc1','A Bounty on Serpents','Tamsin Kell, the harbourmaster','The sea serpents of the Vaast Sea take a boat a month. Tamsin Kell is paying for them. Kill 5 sea serpents in the open sea.',5,q=>(G.flags.k_seaserpent||0)-(q.base||0),{gold:1500,xp:6500},{cnt:'k_seaserpent'});
vq('sc2','Pearls for the Tide','Brother Haldane',"Brother Haldane wants 5 pearls for the chapel's tide-offering. Giant clams under the islands keep pearls.",5,()=>Math.min(5,bagCount('pearl')),{gold:700,xp:4500,items:['gillpotion']},{take:{pearl:5}});
vq('sc3','The Serpent\'s Egg','Tamsin Kell, the harbourmaster','A sea serpent has laid an egg on Ashwood, the big forest island in the north-east. Tamsin wants it brought to her. What she does with it is her business, or the party\'s.',1,()=>(bagCount('serpentegg')>0||G.flags.sc3Done)?1:0,{gold:1200,xp:6000});
const DC1=khQD('The serpents take a boat a month, and a good sailor a boat. The town pays a bounty. Five dead serpents, and I will pay you from the harbour chest. They hunt in the open water, between the islands.','Take the Dawn Walker out. They are big and they hit hard. Keep the bow toward them.',(n,m)=>`${n} of ${m} serpents.`,'Five serpents dead? I will tell the whole harbour.','There is the harbour chest. I will have the fishermen name a boat after you.','The water is quieter. Boats are coming in whole again.');
const DC3=khQD('A serpent laid an egg on Ashwood, in the north-east, on the high ground. The egg is worth a great deal. If it hatches the island is lost, and so is every boat that passes it. Bring it to me, and I will decide.','Ashwood is the big forest island in the north-east of the sea. Keep your swords out. The mother is not far.',(n,m)=>'The egg is in a nest on Ashwood.','You have the egg. Warm, isn\'t it? Almost alive.','Smash it, or give it to the sea. I will tell you what I think: the sea took my husband, and I have thought about it every night. Do as you think best.','The egg is gone from my life. One way or the other.');
repWrap('yr_harbour',()=>qSt('yar6')==='done',"About serpents",()=>{
  if(qSt('sc1')!=='done')return qNode('sc1',DC1);
  if(!G.flags.sc3Done&&bagCount('serpentegg')>0)return say('You have the egg? Show me. Smash it, and the sea loses a monster and the town gains a good night. Give it back to the deep, and you will have done a thing the sea remembers.',[['Smash it.',()=>{bagRemove('serpentegg',1);G.flags.sc3Done=1;G.flags.sc3Smash=1;if(qSt('sc3')==='active'){qTurnIn('sc3')}honourAdd(-1,'you smashed the serpent egg');return say('It breaks with a sound like wet leather. The harbour is safe, and the party feels a little smaller.',[BYE])}],['Return it to the sea.',()=>{bagRemove('serpentegg',1);G.flags.sc3Done=1;G.flags.sc3Return=1;if(qSt('sc3')==='active'){qTurnIn('sc3')}honourAdd(3,'you returned the serpent egg');try{luckAdd(5)}catch(e){}return say('You carry it down to the end of the pier and set it in the water. It sinks slowly, glowing a little. Far out, something large turns over and goes down after it. The party feels very lucky.',[BYE])}],BYE]);
  return qNode('sc3',DC3);
});
khNpc('sn_nest','A serpent nest','yar_driftwood',d=>{
  const F=G.flags;
  if(qSt('sc3')!=='active')return say('A heap of driftwood and kelp on a high ledge, with a smooth hollow in the middle. Something large was here. The sand is still warm.',[BYE]);
  if(F.sc3Got)return say('The nest is empty now, and cold.',[BYE]);
  F.sc3Got=1;d.found=true;sfx('key');bagAdd(mkItem2('serpentegg',1));
  return say('In the hollow, an egg the size of a loaf, green and leathery, and warm. Somewhere out on the water, a very long neck lifts to look at the island.',[BYE])});
const DPEARL=khQD('Pearls! For the tide-offering, five pearls, white and whole. The giant clams under the islands keep them. It is dangerous work down there, and there is a bottle of something under the last wreck, a gift of the sea. But a priest can offer something too.','Dive off any of the islands. Giant clams, open ones, hold pearls half the time.',(n,m)=>`${n} of ${m} pearls.`,'Five pearls. Show me.','Five perfect pearls. I will lay them in the tide. And here is a bottle our order has kept for years, and never found the right people for.','The chapel\'s tide is full of pearls. The sea is pleased.');
repWrap('yr_priest',()=>true,"About the pearls",()=>qNode('sc2',DPEARL));
/* ---- chain D: the Kraken's Price ---- */
vq('sd1','Wreck-Oak',"Pell, the ship's chandler",'Pell can make a harpoon for the Kraken, if you bring him 3 planks of wreck-oak. Diving timbers under the islands are the only oak that has lasted.',3,()=>Math.min(3,bagCount('wreckoak')),{gold:600,xp:4000},{take:{wreckoak:3}});
vq('sd2','Kraken Slayer','Menkaure, the shipwright','Pell has made the Great Harpoon. The Kraken stands between the two coasts of the Vaast Sea. Sail east of the line and kill it, and the way across to the Eastern Lands and Oldhaven is open.',1,khFlag('krakenSlain'),{gold:3000,xp:20000,items:['potion4']});
const DD1=khQD('The Kraken. Everyone knows it is there and nobody says its name. I can make a harpoon to take it, with wreck-oak for the shaft, but I do not have any. Planks of black oak from the old wrecks, three of them. They are on the sea floor now. You have helms. Bring me wreck-oak.','Timbers stand in the wrecks under every island. The ones with iron nails in them are the right ones.',(n,m)=>`${n} of ${m} planks.`,'Three planks. Black as ink, and not a soft spot in them.','Give me a minute... There. The Great Harpoon. It is yours, for as long as you carry the nerve. Take it to Menkaure.','The Great Harpoon is made. Whatever happens to the Kraken is now between you and the sea.');
const DD2=khQD('Pell has made a harpoon? Then the east is open to anyone who is brave enough. Past the line, where the gulls stop, the Kraken rises. Kill it, and the east of the sea is ours, and the Dawn Walker can go where she likes.','Go east. When the sea turns black, aim for the head. The tentacles are just for show.',(n,m)=>'The Kraken is in the far east of the sea.','It is dead? Truly?','The Kraken is dead. I have lived my whole life with that thing at the edge of every chart, and it is gone. Take this.','The east is open, and the sea is a little less afraid.');
repWrap('yr_chandler',()=>qSt('yar6')==='done'&&qSt('sd1')!=='done',"About a harpoon",()=>{const r=qNode('sd1',DD1);return r});
repWrap('yr_menkaure',()=>G.flags.voyage&&(qSt('sd1')==='done'||qSt('vq4')==='done'),"About the Kraken",()=>qNode('sd2',DD2));
// Pell makes the harpoon when the oak is handed in (the quest's own turn-in is not told about the item)
(function(){const _t=qTurnIn;qTurnIn=function(id){const r=_t(id);if(r&&id==='sd1'){bagAdd(mkItem2('greatharpoon',1));msg('Pell hands over the Great Harpoon.','#ffe36a')}return r}})();
khNpc('uw_oak','A drowned timber','uw_timber',d=>{
  const F=G.flags;F.uwOak=F.uwOak||{};const key=LEVEL+':'+d.cat;
  if(F.uwOak[key]||qSt('sd1')!=='active')return say(qSt('sd1')==='active'?'You have already cut a plank from this timber.':'A great black timber stands in the sand, hung with weed and barnacles. Iron nails run through it, black as the wood.',[BYE]);
  F.uwOak[key]=1;bagAdd(mkItem2('wreckoak',1));sfx('key');d.found=true;return say('You work a plank loose from the black oak with the back of your sword. It is heavy and cold, and not a soft spot in it.',[BYE])});
/* the kraken's death is the day the east opened */
(function(){const _t=seaTick;seaTick=function(dt){_t(dt);const F=G.flags;if(LEVEL===SN.ID&&F.krakenSeen&&!F.krakenSlain&&(F.k_kraken||0)>0){F.krakenSlain=1;msg('The Kraken sinks, and the black water clears. For the first time in a hundred years the sea to the east is open.','#ffe36a');sfx('win');try{if(qSt('sd2')==='active')qTurnIn('sd2')}catch(e){}}sbHomeCheck()}})();
/* sailing home with the boys: the check is also made on every landing */
(function(){const _e=seaEnterHook;seaEnterHook=function(n){_e(n);if(n===290)sbHomeCheck()}})();

/* the gold ! over everyone with another quest to give (the first not yet done in the list is the one that counts) */
(function(){
  const add=(id,ids)=>{const cur=QGIVER[id],arr=Array.isArray(cur)?cur.slice():(cur?[cur]:[]);for(const q of ids)if(!arr.includes(q))arr.push(q);QGIVER[id]=arr};
  add('sb_maeve',['uq1','sa1','sa2']);add('ib_aldous',['uq2']);add('ci_ketra',['uq3']);add('ll_isolde',['uq4']);
  add('yr_orsa',['sb1','sb2']);add('yr_harbour',['sc1','sc3']);add('yr_priest',['sc2']);add('yr_chandler',['sd1']);add('yr_menkaure',['sd2']);
})();
