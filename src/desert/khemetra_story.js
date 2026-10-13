/* ==========================================================================
   KHEMETRA: THE STORY. Shopkeepers and priests, twenty quests of city life, the cartographer's chain across the seven
   deserts, the grand vizier and the wizard under the city, and the shipwright who looks to the sea.
   ========================================================================== */
const khNpc=(id,name,face,root,o)=>{o=o||{};KH_KEEPERS[id]={name,face,sc:o.sc||1,root};NPCS[id]={name,img:face,root};if(o.q)QGIVER[id]=o.q};
const khQuest=(id,title,who,desc,need,goal,reward,extra)=>{QUESTS[id]=Object.assign({title,who,desc,need,goal,reward},extra||{});QAREA[id]='Khemetra'};
QAREA_ORDER.splice(QAREA_ORDER.indexOf('Greendale')+1,0,'Khemetra');
const khFlag=f=>()=>G.flags[f]?1:0;
const khKills=(k,cnt)=>q=>(G.flags[k]||0)-(q.base||0);
/* ---- what the shops sell ---- */
const KH_STOCK={
  potion:()=>[['potion',8],['redpotion',3],['bluepotion',3],['greenpotion',3],['yellowpotion',3]].concat(potionStockRows()),
  scroll:()=>[['sp_fire',2],['scrollFrost',2],['scrollLight',3],['ringV',1],['ringM',1],['ringW',1],['ringS',1]],
  food:()=>[['bread',14],['cheese',10],['dates',14],['water',14],['apple',10],['ale',8],['nuts',10],['herring',6],['sausage',8],['pottage',8],['pie',5],['roast',4],['honeycomb',4]],
  arms:()=>[['dagger',4],['sword',4],['mace',3],['axe',3],['bow',3],['staff',3],['ironblade',1],['ironaxe',1]],
  armour:()=>[['cap',4],['helm',3],['shield',4],['jerkin',4],['leggings',4],['bracers',4],['prismhelm',1]],
  general:()=>[['torch',14],['lantern',4],['bread',8],['water',10],['herb',6],['honeycomb',3],['wildflower',4],['potion',4],['ore',3]],
};
const khShop=(id,name,face,title,greet,stock,sc)=>khNpc(id,name,face,d=>say(greet,[['Browse the wares',()=>{openShop(d,KH_STOCK[stock](),title);return null}],BYE]),{sc});
khShop('kh_nefer','Nefer, the potion seller','kh_npc2_2',"Nefer's Philtres",'Potions for every ache and every adventure. Red for blood, blue for breath, green for the sickly, yellow for the brave. Everything is brewed this week.','potion');
khShop('kh_greenflask','Tamit, of the Green Flask','kh_npc1_3','The Green Flask','Welcome to the Green Flask. My grandmother brewed these. Her grandmother knew the recipe before the city had walls.','potion');
khShop('kh_senet','Old Senet, the healer','kh_npc4_5',"Old Senet's Remedies",'Come in, come in. Sit. Tell me where it hurts, and then buy something, because whatever it is, I have a bottle for it.','potion');
khShop('kh_quill','Iry, of the Silver Quill','kh_npc2_3','The Silver Quill','Scrolls of fire, frost and light, sealed with wax and warranted against smudging. Rings too, if you are the sort who likes jewellery with consequences.','scroll');
khShop('kh_sevenscrolls','Wenis, keeper of Seven Scrolls','kh_npc4_2','House of Seven Scrolls','Every spell here was copied by hand by my family. Please do not read them aloud inside the shop.','scroll');
khShop('kh_baker','Merit, the baker','kh_npc2_4','The Golden Crust Bakery','Bread, still warm. The best in Khemetra, and I will fight anyone who says the baker on the next street is better.','food');
khShop('kh_dates','Hapu, the date seller','kh_npc2_0','Dates and Dreams','Dates from the oasis groves. Fresh dates, honeyed dates, dates stuffed with almonds. A date a day keeps the healer away.','food');
khShop('kh_spices','Perneb, the spice merchant','kh_npc2_1','The Spice Garden','Saffron from the north, pepper from the east, and mint from my own window box. What shall we season today?','food');
khShop('kh_pantry','Hapi, of the Pantry','kh_npc1_0',"Hapi's Pantry",'Cheese, nuts, dried fish and ale. Provisions for the road, and a seat by the door if you want to hear about the road.','food');
khShop('kh_forge','Khaset, the smith','kh_npc5_4','The Sun Forge','Swords, maces and axes, hammered while the sun is high so the steel takes the light. Do not touch the hot ones.','arms',1.05);
khShop('kh_armoury','Sergeant Ahmose, the armourer','kh_npc3_0',"The Guard's Armoury",'Helms, shields and mail. Everything is tested on my own guards, who complain a great deal and survive.','armour');
khShop('kh_silk','Qadir, the cloth trader','kh_npc2_5','Silk and Linen','Silk from the far east, linen from the river, and a few travel supplies in the back for the sort of person who needs both.','general');
khShop('kh_pack','Zahra, of the Wanderer\'s Pack','kh_npc1_1',"The Wanderer's Pack",'Torches, lanterns, food and water. All the things you forget until you are three days into the dunes.','general');
/* ---- inns, prayer houses, temples, baths ---- */
const khInn=(id,name,face,title,cost,line)=>khNpc(id,name,face,()=>say(line,[['Rent rooms ('+cost+' gold)',()=>{if(G.gold<cost)return say('You cannot afford a room. Come back with a little more silver.',[BYE]);G.gold-=cost;restParty(true);return say('You sleep in clean beds with the windows open to the night air. Everyone wakes healed and fed.',[BYE])}],['Any news?',()=>say(KH_GOSSIP[(Math.abs(id.length*7+(G.rounds||0))%KH_GOSSIP.length)],[BYE])],BYE]));
khInn('kh_inn1','Hasan, innkeeper of the Gilded Camel','kh_npc6_2','The Gilded Camel',25,'The Gilded Camel! Beds, baths of hot water, and a cook who can make a lamb disappear into a dozen dishes. A room is 25 gold.');
khInn('kh_inn2','Dalila, innkeeper of the Sleeping Sphinx','kh_npc1_1','The Sleeping Sphinx',20,'Welcome to the Sleeping Sphinx. We never close, and the sphinx has never once complained about noise. Twenty gold for a room.');
khInn('kh_inn3','Rashid, innkeeper of the Moon and Mint','kh_npc1_0','The Moon and Mint',30,'The Moon and Mint, where the tea is sweet and the sheets are cleaner. Thirty gold, and the tea is free.');
for(const i of [1,2,3]){khNpc('kh_inn'+i+'_p1','A traveller','kh_npc5_2',()=>say(KH_GOSSIP[(i*5+3)%KH_GOSSIP.length],[BYE]));khNpc('kh_inn'+i+'_p2','A merchant','kh_npc2_0',()=>say(KH_GOSSIP[(i*7+11)%KH_GOSSIP.length],[BYE]))}
for(const a of ['inn1','inn2','inn3']){} // patrons are named for the inns that hold them
const khPray=(id,name,face,line,cost)=>khNpc(id,name,face,()=>say(line,[['Offer a prayer ('+cost+' gold, the party is healed)',()=>{if(G.gold<cost)return say('Give what you can, and the blessing comes anyway. But the lamps are expensive, and you have too little for even a small offering.',[BYE]);G.gold-=cost;G.heroes.forEach((h,i)=>{if(!h.alive){h.alive=true;h.hp=Math.max(1,Math.ceil(h.max/2))}else h.hp=h.max;h.mp=h.mpMax});sfx('potion');return say('Warm light washes over the party. Wounds close, and the weariness lifts away.',[BYE])}],['Ask for a blessing without an offering',()=>say('Blessings are free. The healing comes from the lamps, and the lamps are not.',[BYE])],BYE]));
khPray('kh_pray1','Priestess Nebet','kh_npc4_1','Welcome to the House of the Rising Sun. Rest your eyes in the light, and tell me what troubles you.',15);
khPray('kh_pray2','Brother Omari','kh_npc4_4','The Guiding Star shows the way home to anyone who is lost. Even to those who are not sure where home is.',15);
khPray('kh_pray3','Priestess Hana','kh_npc4_1','In the House of Eternal Life we do not fear the end. We tend the lamps, and we sing for those who walked ahead.',15);
khPray('kh_pray4','Brother Pasha','kh_npc4_0','Under the New Moon every beginning is allowed. What would you like to begin?',15);
khPray('kh_temple1','Acolyte Tuya','kh_npc4_1','The Temple of the Sun burns one lamp for every soul in the city. Four hundred thousand lamps. Please do not count them.',20);
khPray('kh_temple2','High Priest Omari','kh_npc4_0','The Temple of Bastet is the cat goddess house. The cats here are holy. So is anything they sit on.',20);
khPray('kh_mosque','Imam Qadir','kh_npc4_3','Peace be upon you. The Great Mosque is open to every traveller. Come in out of the sun, and rest your eyes in the cool of the dome.',20);
khPray('kh_church','Father Idris','kh_npc4_0','The Church of Light has stood longer than the palace. We ring the bell for every traveller who comes home.',20);
const khBath=(id,name,face,line)=>khNpc(id,name,face,()=>say(line,[['Take the waters (10 gold, rest and refresh)',()=>{if(G.gold<10)return say('The waters are open to everyone with ten gold. You have a little less.',[BYE]);G.gold-=10;G.heroes.forEach(h=>{if(h.alive){h.hp=Math.min(h.max,h.hp+Math.ceil(h.max*.6));h.mp=h.mpMax}});advanceTime(60);sfx('potion');return say('Hot water, mint and steam. The party emerges pink, calm and a good deal more cheerful.',[BYE])}],BYE]));
khBath('kh_bath1','Isis, the bath attendant','kh_npc6_3','Welcome to the Court Baths. Towels, oils and hot water, in that order. Weapons are left at the door.');
khBath('kh_bath2','Dedi, keeper of the Blue Hammam','kh_npc6_3','The Blue Hammam is the oldest bath in the city. The tiles are older than the vizier, and cleaner.');
/* ---- work houses, quest halls ---- */
const khJob=(id,title,who,item,n,pay,xp,line)=>khQuest(id,title,who,line,n,()=>bagCount(item),{gold:pay,xp},{take:{[item]:n}});
khJob('kh_j_water','Water for the Labourers',"The Labourers' Hall",'water',8,40,90,'The Labourers Hall needs 8 jars of water for the workers on the new aqueduct. Water is sold at the markets.');
khJob('kh_j_bread','Bread for the Crews',"The Labourers' Hall",'bread',6,36,80,'The Labourers Hall needs 6 loaves of bread for the dawn crew.');
khJob('kh_j_torch','Torches for the Night Gang',"The Labourers' Hall",'torch',6,40,90,'The night gang needs 6 torches. Buy them at any general store.');
khJob('kh_j_dates','Dates for the Drivers',"The Day Hire House",'dates',8,50,100,'The Day Hire House needs 8 handfuls of dates for the caravan drivers.');
khJob('kh_j_ale','Ale for the Roofers',"The Day Hire House",'ale',5,45,95,'The roofers need 5 mugs of ale to finish the Weavers roof before dark.');
khJob('kh_j_nuts','Nuts for the Cooks',"The Day Hire House",'nuts',6,40,90,'The Day Hire House needs 6 handfuls of nuts for the palace kitchens.');
khJob('kh_j_lantern',"Lanterns for the Porters",'Porters Guild','lantern',3,150,200,'The Porters Guild needs 3 lanterns for the night deliveries.');
khJob('kh_j_herb',"Herbs for the Porters",'Porters Guild','herb',5,60,120,'The Porters Guild needs 5 bundles of herbs for the guild healer.');
khJob('kh_j_cheese',"Cheese for the Porters",'Porters Guild','cheese',5,55,110,'The Porters Guild needs 5 pieces of cheese for the feast of the first haul.');
const khBoard=(id,name,face,jobs,line)=>khNpc(id,name,face,()=>{
  const open=jobs.filter(j=>qSt(j)===null),act=jobs.filter(j=>qSt(j)==='active');
  const rd=act.find(qReady);
  if(rd)return say('You have what we asked for. Hand it over.',[['Here you are.',()=>{qTurnIn(rd);return say('Fair work, fairly done. Come back when you want more.',[BYE])}],BYE]);
  const opts=open.map(j=>[QUESTS[j].title,()=>say(QUESTS[j].desc+' It pays '+QUESTS[j].reward.gold+' gold.',[['I will do it.',()=>{qAccept(j);return say('Good. Bring it here when you have it.',[BYE])}],['Not now.',()=>null]])]);
  if(act.length)return say('You already have work from us: '+act.map(j=>QUESTS[j].title).join(', ')+'.',opts.concat([BYE]));
  if(!opts.length)return say('There is no more work today. You have done every job we had. Come back some other season.',[BYE]);
  return say(line,opts.concat([BYE]));
});
khBoard('kh_work1','Clerk Wenis','kh_npc3_3',['kh_j_water','kh_j_bread','kh_j_torch'],'Day work for day wages. Pick a job and bring us the goods.');
khBoard('kh_work2','Clerk Bastet','kh_npc3_3',['kh_j_dates','kh_j_ale','kh_j_nuts'],'We hire by the day. Honest work, honest pay, mostly.');
khBoard('kh_work3','Guildmaster Pia','kh_npc5_3',['kh_j_lantern','kh_j_herb','kh_j_cheese'],'The Porters Guild always has deliveries. Choose one.');
// bounty contracts, bought from the quest halls
khQuest('kh_b_skel','Contract: Skeletons','The Contract House',"Kill 10 skeletons. The Contract House pays for the dead who do not stay buried.",10,khKills('k_skel'),{gold:260,xp:500},{cnt:'k_skel'});
khQuest('kh_b_scorp','Contract: Scorpions','The Contract House','Kill 10 scorpions or cobras in the deserts. The caravans pay well for safe roads.',10,khKills('k_scorp'),{gold:300,xp:550},{cnt:'k_scorp'});
khQuest('kh_b_mummy','Contract: The Wrapped Dead','The Bounty Board','Kill 8 mummies. Anywhere in the deserts. The temples will pay for proof.',8,khKills('k_mummy'),{gold:380,xp:700},{cnt:'k_mummy'});
const khContracts=(id,name,face,jobs,fee)=>khNpc(id,name,face,()=>{
  const act=jobs.find(j=>qSt(j)==='active'),rd=act&&qReady(act);
  if(rd)return say('The contract is fulfilled. The seal is on the paper, and the gold is yours.',[['Collect the reward.',()=>{qTurnIn(act);return say('A pleasure doing business. Come back for another contract.',[BYE])}],BYE]);
  const open=jobs.filter(j=>qSt(j)===null);
  const opts=open.map(j=>[QUESTS[j].title+' ('+fee+' gold to take it)',()=>say(QUESTS[j].desc+' It pays '+QUESTS[j].reward.gold+' gold.',[['Take the contract.',()=>{if(G.gold<fee)return say('The fee is '+fee+' gold. You have too little.',[BYE]);G.gold-=fee;qAccept(j);return say('Signed and sealed. Good hunting.',[BYE])}],['Not now.',()=>null]])]);
  if(act)return say('You already carry a contract: '+QUESTS[act].title+'. Finish it first.',[BYE]);
  if(!opts.length)return say('Every contract on the board is done. We will have more after the next caravan.',[BYE]);
  return say('Contracts for the brave. A small fee seals each one, and the reward is paid in full on completion.',opts.concat([BYE]));
});
khContracts('kh_quest1','Clerk Seba','kh_npc3_3',['kh_b_skel','kh_b_scorp'],30);
khContracts('kh_quest2','Bounty Master Gamal','kh_npc3_2',['kh_b_mummy','kh_b_scorp'],40);
