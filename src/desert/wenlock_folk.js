/* ==========================================================================
   WENLOCK: THE PEOPLE OUTDOORS (prefix wlo_ for people). About forty named townsfolk and a few animals, each standing in a place of their own (never in a road), with
   several short, warm things to say, one after another. The shops, inn and church inside are built by wenlock_in_*.js; the mayor and the quests are in wenlock_quests.js.
   ========================================================================== */
/* ---- the folk: id, name, face, height, place, lines ---- */
const WL_FOLK=[
  {id:'wlo_smith',n:'Fenn Ironside',face:'kh_ohfolk1_0',sc:1.05,out:[11,47],lines:["Hammer, tongs, fire. That is the whole trade. The rest is shouting.","I made every horseshoe in Wenlock. The horses have never thanked me, but they have never kicked me either, which is the same thing."]},
  {id:'wlo_boy',n:'Tommy Briggs',face:'kh_ohfolk1_5',sc:.78,out:[21,60],lines:["I am going to be a knight when I grow up. Or a baker. Or a knight who bakes.","Mister, is it true you came through the gardens? Did the hedges move? Mum says the hedges move."]},
  {id:'wlo_girl',n:'Daisy Briggs',face:'kh_ohfolk3_0',sc:.74,out:[23,62],lines:["This is Dolly. She is not allowed on the pond, but she goes anyway.","I can count to a hundred. One, two, three, four, five. It takes ages."]},
  {id:'wlo_alfie',n:'Alfie with the hoop',face:'kh_ohfolk3_2',sc:.78,out:[20,67],lines:["I can roll it all the way round the pond without it falling in. Mostly.","If you see my sister, I was never here."]},
  {id:'wlo_oldwalt',n:'Old Walt',face:'kh_ohfolk3_3',sc:1,out:[31,64],lines:["I have sat on this bench for fifty years. They have mended it four times and never once asked me to move.","Sit a while. Everybody is in a hurry, and nobody has got there any sooner."]},
  {id:'wlo_gran',n:'Goody Prue',face:'kh_ohfolk2_0',sc:1,out:[32,62],lines:["I know everybody's business, and everybody's business knows me.","Do not mind the geese. They are only pretending to be fierce. It is the swan you want to watch for."]},
  {id:'wlo_minstrel',n:'Jory the minstrel',face:'kh_ohfolk6_0',sc:1.02,out:[50,52],lines:["I know four hundred songs. Three hundred and ninety are about a girl and a river, and the other ten are about a girl and a different river.","A song for a penny, two for a groat, and the rest of the night for a meal."]},
  {id:'wlo_jester',n:'Mumble, a travelling jester',face:'kh_ohfolk6_1',sc:1.02,out:[46,48],lines:["Why did the knight sit on the roof? He had heard the drawbridge was down. I will explain it later.","I am the fool of everyone who gives me an apple. It is a small kingdom, but loyal."]},
  {id:'wlo_crier',n:'Bartle the town crier',face:'kh_ohfolk6_4',sc:.96,out:[49,48],lines:["Oyez, oyez! The flower show is on the green on Saturday! Bring your marrows! Bring your roses! Do not bring your goat!","Oyez! A lost cat, ginger, answers to Marmalade and to nothing else. Reward of one very good pie."]},
  {id:'wlo_falconer',n:'Hawkins the falconer',face:'kh_ohfolk6_5',sc:1.02,out:[38,62],lines:["She is called Duchess. She has caught forty pigeons and a hat.","Do not wave your arms near her. She thinks everything that moves is lunch, including the vicar."]},
  {id:'wlo_gardener',n:'Mistress Rose Tulip',face:'kh_ohfolk6_2',sc:.92,out:[34,71],lines:["Roses, dear, are a matter of patience, and bone meal, and never saying anything unkind to them within earshot.","I have won the flower show eleven years running, and Old Hedge has not forgiven me for any of them."]},
  {id:'wlo_hedge',n:'Old Hedge, the gardener',face:'kh_ohfolk7_0',sc:1.02,out:[36,73],lines:["My marrow is the biggest marrow in the county. Mistress Tulip says it is a pumpkin. It is a marrow. It simply has ambition.","The secret is manure. And talking to it. And, if it is a marrow, a very firm tone."]},
  {id:'wlo_judge',n:'Lady Eleanor Ashby, flower show judge',face:'kh_ohfolk5_0',sc:1.06,out:[37,70],lines:["I have judged this show for twenty years, and I have never once been bribed. I have been offered a great deal of cake.","Everything is judged on colour, scent, and the look in the exhibitor's eye."]},
  {id:'wlo_curate',n:'Curate Pettigrew',face:'kh_ohfolk2_1',sc:1,out:[22,28],lines:["I am the vicar's curate, which means I do everything the vicar is going to do next Tuesday.","The bell is cracked, the roof leaks, and the choir is a pig farmer and his sister. We are very happy."]},
  {id:'wlo_friar',n:'Brother Tuck, a travelling friar',face:'kh_ohfolk5_3',sc:1.04,out:[20,27],lines:["I walk from town to town with a stick and no purse. People give me bread. It is a very good arrangement.","I have heard confession in three cities and one hay barn. The hay barn was the most honest."]},
  {id:'wlo_gravedigger',n:'Sexton Moss',face:'kh_ohfolk4_1',sc:1,out:[30,20],lines:["Nobody's ever in a hurry to see me. That is the nicest thing about the trade.","Quiet lot, my customers. I have never once had a complaint."]},
  {id:'wlo_squire',n:'Piers, a young squire',face:'kh_ohfolk5_1',sc:1.02,out:[52,46],lines:["I carry the helmet. One day I will wear the helmet. Today I carry it, and it is very heavy.","Sir Gareth says courage is going forward when you are afraid. I have a great deal of practice."]},
  {id:'wlo_knight',n:'Sir Gareth of the Western March',face:'kh_ohsold1_2',sc:1.12,out:[54,52],lines:["I ride west when the road opens. Until then I am guarding the market square from, ah, unruly pigeons.","A knight does not gossip. I will tell you only that the baker's pie was last seen going east at a trot."]},
  {id:'wlo_pedlar',n:'Silas, a pedlar',face:'kh_ohfolk5_5',sc:1.02,out:[44,55],lines:["Needles, ribbons, buttons, bells and one very good boot. I will sell you the boot at a loss.","Everything in this pack was lost by somebody and found by me. That is what finding means."]},
  {id:'wlo_carpenter',n:'Jack Joiner, carpenter',face:'kh_ohfolk4_0',sc:1.04,out:[60,47],lines:["Measure twice, cut once, and swear quietly. That is the whole trade.","I built the stocks on the green. Nobody has ever been in them. They are the best work of my life."]},
  {id:'wlo_mason',n:'Stubbs the mason',face:'kh_ohfolk4_1',sc:1,out:[28,45],lines:["Every stone in that church was cut by hand, and most of them were dropped on my foot.","A good wall is never finished. It is only standing, for now."]},
  {id:'wlo_potter',n:'Clay the potter',face:'kh_ohfolk4_4',sc:1,out:[51,47],lines:["I made this jug this morning. It already has a crack. That is how you know it is honest work.","Clay is easy. It is the fire that is difficult."]},
  {id:'wlo_washer',n:'Mrs Suds, the washerwoman',face:'kh_ohfolk7_2',sc:1,out:[66,55],lines:["Sheets for the inn, shirts for the squire, and a very small pair of stockings for the vicar's cat.","You can tell everything about a man by his shirt. I never say what."]},
  {id:'wlo_farmer',n:'Farmer Giles',face:'kh_ohfolk7_3',sc:1.02,out:[50,12],lines:["Wheat, barley and sheep. I have not had a day off since the old king died, and I was not told he had.","If the brook floods, I move the cow. If the cow floods, I move the brook."]},
  {id:'wlo_shepherd',n:'Meg the shepherd',face:'kh_ohfolk7_4',sc:1,out:[44,11],lines:["Forty sheep, one dog, and a very firm understanding.","Sheep are not stupid. They simply have different priorities. Mostly the grass in the next field."]},
  {id:'wlo_hunter',n:'Rafe the woodsman',face:'kh_ohfolk7_4',sc:1,out:[70,12],lines:["I came in from the western wood this morning. The deer are thick, the wolves are thin, and the squirrels are rude.","If you are heading west, wait for the road to open, and bring a friend, or a very large dog."]},
  {id:'wlo_farmhand',n:'Dobbs the farmhand',face:'kh_ohfolk7_3',sc:.96,out:[62,17],lines:["I look after the granary. Which means I look after the rats, as they look after nothing.","The boss says an honest day's work. I say an honest day's work, with a pie."]},
  {id:'wlo_miller',n:'Dusty the miller',face:'kh_ohfolk4_3',sc:1,out:[79,89],lines:["I grind the corn, and the corn grinds me. It is a fair arrangement.","Mind the wheel. It has not hurt anyone since Tuesday."]},
  {id:'wlo_beekeeper',n:'Mother Honeybee',face:'kh_ohfolk3_1',sc:.98,out:[80,58],lines:["The bees and I have an understanding. They do not sting me, and I do not mention their taxes.","Do not wave. Do not run. Do not, whatever you do, say the word jam."]},
  {id:'wlo_dairymaid',n:'Hetty the dairymaid',face:'kh_ohfolk2_5',sc:.98,out:[62,90],lines:["Twelve cows and every one of them has a name and a grudge.","Butter by Tuesday, cheese by Friday, and the cream comes when it feels like it."]},
  {id:'wlo_bully',n:'Big Hob',face:'kh_ohfolk1_0',sc:1.08,out:[36,66],lines:["Oi. What are you looking at? Do not answer that.","I am not a bully. I am a very forceful conversationalist."]},
  {id:'wlo_tanner',n:'Mrs Tanner',face:'kh_ohfolk3_4',sc:1,out:[27,73],lines:["I was married at Saint Wenna's, and this ring was my mother's, and my grandmother's before that.","I have been to every puddle in Wenlock. I am not looking for anything."]},
  {id:'wlo_watch',n:'Constable Fudge',face:'kh_ohfolk7_5',sc:1.02,out:[56,49],lines:["I keep the peace. There has been none to keep since the Michaelmas goose, and I am proud of it.","Move along. No, do not move along, stay, it is a lovely day. Carry on."]},
  {id:'wlo_page',n:'Wren, the mayor\'s page',face:'kh_ohfolk7_1',sc:.9,out:[27,35],lines:["I carry messages for the mayor. I am not allowed to read them. I read them anyway. They are mostly about drains.","If you see a lord with a very large hat, please tell him the soup is cold."]},
  {id:'wlo_merchant',n:'A wool merchant',face:'kh_ohfolk5_5',sc:1.02,out:[74,47],lines:["Wool is the gold of this kingdom, and I am a very comfortable man.","If you want to buy anything, I know a man. If you want to sell anything, I am that man."]},
  {id:'wlo_stall1',n:'An apple seller',face:'kh_ohfolk6_3',sc:1,out:[44,47],lines:["Apples! Sweet as a sunny day and twice as crisp. A penny each, and a bite free if you smile.","Do not eat the green ones. I am not telling you why."]},
  {id:'wlo_stall2',n:'A cheese seller',face:'kh_ohfolk7_2',sc:1,out:[54,52],lines:["Cheese! Sharp, mild or mouldy, and the mouldy ones are the best. I have a customer who swears by them, and a doctor who swears at them.","Try a crumb. Try another. Now you have to buy."]},
  {id:'wlo_stall3',n:'A fishwife',face:'kh_ohfolk2_0',sc:1,out:[53,47],lines:["Fish from the river, fresh as a slap. Well, fresh as yesterday.","The cat has been watching my stall since dawn. I have made my peace with this."]},
  {id:'wlo_stall4',n:'An egg woman',face:'kh_ohfolk3_1',sc:.96,out:[42,48],lines:["Eggs, a dozen a penny. The hens are in a mood, so they are very good eggs.","I will tell you which hen laid which, if you promise not to tell the hens."]},
  {id:'wlo_stall5',n:'A spice seller',face:'kh_ohfolk6_5',sc:1,out:[47,47],lines:["Cinnamon, pepper, saffron.","Smell that."]},
  {id:'wlo_stall6',n:'A jeweller',face:'kh_ohfolk2_3',sc:1,out:[54,53],lines:["Rings and charms.","Nothing here is stolen."]},
  {id:'wlo_stall7',n:'A melon seller',face:'kh_ohfolk7_1',sc:1,out:[54,48],lines:["Melons, cold from the cellar.","Mind the crate."]},
  {id:'wlo_stall8',n:'A jar seller',face:'kh_ohfolk1_2',sc:1,out:[42,52],lines:["Jars of ale, water and honey.","Please bring the jar back."]},
  {id:'wlo_traveller',n:'A weary traveller',face:'kh_oqmen_5',sc:1,out:[75,48],lines:["I have walked from the sea. I am told it was a short cut.","Is it always this peaceful? I keep waiting for something to happen, and it keeps not."]},
];
/* the animals: dogs, cats, a goat, chickens */
const WL_ANIMALS=[
  {id:'wlo_dog1',n:'Biscuit, the baker\'s dog',face:'kh_oqdogs_3',sc:1,out:[17,47],lines:["Woof.","Woof. (He looks at your pockets, then at your face, then at your pockets.)"]},
  {id:'wlo_dog2',n:'Admiral, a large wolfhound',face:'kh_oqdogs_1',sc:1,out:[30,52],lines:["Woof. (He leans on your knee until you scratch his ears.)","Woof. (This is the dog who is, apparently, in charge of the square.)"]},
  {id:'wlo_dog3',n:'Mutt, a sheepdog',face:'kh_oqdogs_2',sc:1,out:[46,12],lines:["Woof. (He wants to herd you towards the pub.)","Woof. (He has noticed a sheep. He is trying to look as though he has not.)"]},
  {id:'wlo_cat2',n:'Duchess, a tabby',face:'kh_anim1_0',sc:1,out:[63,53],lines:["Miaow. (She looks at you as a queen looks at a very small stool.)","Mrr. (She is sitting in the exact middle of the sun, and has no intention of moving.)"]},
  {id:'wlo_goat',n:'A goat',face:'kh_anim1_3',sc:.9,out:[86,52],lines:["Maaa. (He has just eaten a hat, and is thinking about the other one.)","Maaa. (He gives you a look of calm, patient contempt.)"]},
  {id:'wlo_donkey',n:'Neddy, the donkey',face:'kh_anim1_4',sc:.9,out:[66,47],lines:["Hee-haw. (He has a strong opinion and has decided not to share it.)","Hee-haw. (The donkey looks, you suspect, at the world's long list of unfinished business.)"]}
];
for(const f of WL_FOLK.concat(WL_ANIMALS))if(f.id!=='wlo_mayor')khNpc(f.id,f.n,f.face,()=>yrLines(f.id,f.lines),{sc:f.sc});
/* ---- placement: each person stands near their place, off the roads (wenlock_town.js calls this) ---- */
function wlPlaceFolk(C){
  C.person('wlo_mayor',27,31,4);
  for(const f of WL_FOLK.concat(WL_ANIMALS)){if(f.hall||f.inn)continue;if(f.out)C.person(f.id,f.out[0],f.out[1],5)}
  if(typeof WL_QOBJ!=='undefined')for(const o of WL_QOBJ){const q=C.near(o.at[0],o.at[1],o.rad||3);if(q)C.dc(o.k(),q[0],q[1],Object.assign({npc:o.npc,deco:false},o.o||{}))}
  // the signpost at the west end, the stalls' people, geese and chickens
  C.dc('greensign',4,49,{block:false,walk:true,npc:'wlo_signpost',deco:false});
  for(const [x,y] of [[10,46],[30,46],[88,46],[63,45]])C.tryDc('chicken',x,y);
}
/* the apple trees: a click shakes one, and half the time an apple falls into the bag */
khNpc('wlo_appletree','An apple tree','ltree17',()=>{
  if(Math.random()<.5){
    if(bagAdd(mkItem('apple'))){sfx('key');msg('An apple falls from the tree.','#ffe36a')}
    else msg('An apple falls, but your bag is full.','#e0a080');
  }else msg('You shake the tree. Leaves fall, and no apple.','#c8b890');
  return null});
khNpc('wlo_signpost','A signpost','kh_ohgard2_5',()=>say('Two fingers point west and east. The west one reads TO THE WESTERN KINGDOMS, and below it, painted in a wobbly hand, (not yet open). The east one reads TO THE GARDENS. Somebody has added: AND GOOD LUCK.',[BYE]));
