/* ==========================================================================
   WENLOCK: THE KEEPERS (ids wli_k_*). Every shopkeeper, the landlord, the vicar, the teacher, the almoner and the hall clerk, with what they sell.
   Stock is for a party of level 80, as in the Hollow Grasslands: the potion ladder to potion7, mana potions, escape potions, the best arms and armour under 30000 gold.
   (The librarian is in wenlock_in_folk.js beside the books.)
   ========================================================================== */
const wliHas=r=>ITEMDEF[r[0]];
KH_STOCK.wli_potion=()=>[['healdraught',6],['greaterheal',5],['superiorheal',4],['elixir',3],['manadraught',6],['greatermana',5],['supermana',3],['might',3],['swiftness',3],['ironskin',3],['keeneye',3],['antidote',6],['salve',6],['holywater',3],['sleeptea',3],['hgescape',2],['potion',2]].concat(potionStockRows()).filter(wliHas);
KH_STOCK.wli_scrolls=()=>{const sp=Object.keys(ITEMDEF).filter(id=>ITEMDEF[id].k==='spell'),rg=Object.keys(ITEMDEF).filter(id=>ITEMDEF[id].k==='ring'&&(ITEMDEF[id].price||0)<=6000).slice(0,6);
  return KH_STOCK.scroll().concat(sp.map(id=>[id,2]),rg.map(id=>[id,1]),[['manadraught',4],['greatermana',3],['supermana',2]].filter(wliHas))};
KH_STOCK.wli_weapons=()=>{const hi=Object.keys(ITEMDEF).filter(id=>{const d=ITEMDEF[id];return !d.rar&&d.k==='weapon'&&d.lvl>=20&&d.lvl<=85&&(d.price||0)>0&&(d.price||0)<=30000&&!/Harpoon|Scimitar/.test(d.n||'')}).sort((a,b)=>ITEMDEF[a].lvl-ITEMDEF[b].lvl);
  return GEAR_STOCK.sword().concat(hi.slice(-14).map(id=>[id,1]))};
KH_STOCK.wli_armour=()=>{const hi=Object.keys(ITEMDEF).filter(id=>{const d=ITEMDEF[id];return (d.k==='shield'||d.k==='head'||d.k==='chest'||d.k==='legs'||d.k==='armor'||d.k==='armour')&&!d.rar&&d.lvl>=20&&d.lvl<=85&&(d.price||0)>0&&(d.price||0)<=30000}).sort((a,b)=>ITEMDEF[a].lvl-ITEMDEF[b].lvl);
  return GEAR_STOCK.armour().concat(hi.slice(-14).map(id=>[id,1])).concat(KH_STOCK.armour())};
KH_STOCK.wli_general=()=>[['torch',14],['lantern',5],['bread',10],['cheese',8],['water',12],['herb',6],['honeycomb',4],['wildflower',8],['potion',4],['antidote',4],['ore',3],['apple',8],['ale',8],['hgescape',2]].filter(wliHas);
KH_STOCK.wli_green=()=>[['apple',20],['wildflower',10],['herb',8],['nuts',10],['dates',6],['pottage',6],['water',10],['cheese',6],['honeycomb',6]].filter(wliHas);
KH_STOCK.wli_butcher=()=>[['sausage',16],['roast',10],['pie',8],['herring',8],['pottage',8],['cheese',6]].filter(wliHas);
KH_STOCK.wli_bakery=()=>[['bread',24],['pie',12],['honeycomb',8],['cheese',6],['ale',6],['apple',6]].filter(wliHas);
KH_STOCK.wli_tailor=()=>[['jerkin',3],['cap',3],['leggings',3],['bracers',3],['shield',2]].filter(wliHas).concat(GEAR_STOCK.armour().slice(-6));
KH_STOCK.wli_cobbler=()=>[['leggings',4],['bracers',3],['cap',2]].filter(wliHas).concat(KH_STOCK.armour().slice(0,4));
KH_STOCK.wli_chandler=()=>[['torch',24],['lantern',8],['water',6]].filter(wliHas);
KH_STOCK.wli_cooper=()=>[['ale',16],['water',10],['honeycomb',4],['apple',4]].filter(wliHas);
KH_STOCK.wli_herbs=()=>[['herb',12],['wildflower',8],['honeycomb',4],['antidote',6],['salve',6],['holywater',3],['sleeptea',4]].filter(wliHas);
const WLI_SHOPS={ // id: name, face, shop title, greeting, stock key (the keepers' names are the ones the town file gives them)
  wli_k_smith:['Fenn Ironside','wl2_folk2_1',"Fenn's Forge",'Swords, maces and axes, hammered while you wait. Mind the sparks, mind the anvil, and mind the apprentice, who does not yet know which end is hot.','wli_weapons'],
  wli_k_bakery:['Goodwife Crumb','kh_ohfolk1_1',"Crumb's Bakery",'Fresh bread, warm pies, and honey buns that have never lasted till Sunday. I have been up since three, so if I look short, that is the sleep.','wli_bakery'],
  wli_k_butcher:['Hodge the Butcher','kh_ohfolk2_2','Hodge the Butcher','Sausages, pies and roast, and I know every pig by name. That one was Gerald. He was a very good pig.','wli_butcher'],
  wli_k_scrolls:['Ambrose Quill','kh_ohfolk5_4',"Quill's Scrolls",'Scrolls, rings and a few things I will not describe in front of the cat. Do mind the ink, it has opinions.','wli_scrolls'],
  wli_k_tailor:['Madame Lacey','kh_ohfolk4_2','Madame Lacey, Tailor','Hems, hose and hats. I can take in a coat, let out a coat, or tell you honestly that the coat has had its day. Stand still. Stand stiller.','wli_tailor'],
  wli_k_armour:['Old Sergeant Blackwood','kh_ohsold1_0',"Blackwood's Armoury",'Helms, shields and good plate. I wore this very breastplate for thirty years and the only thing that ever got through it was a wasp.','wli_armour'],
  wli_k_weapons:['Osric Hale','kh_ohsold1_3','Hale and Daughters, Weaponsmiths','Swords, axes, maces and bows. My daughters make the swords. I make the noise. Between us we have never sold a bad blade, or a quiet afternoon.','wli_weapons'],
  wli_k_general:['Mrs Dibble','kh_ohfolk2_5',"Dibble's General Store",'Rope, lamps, bread, string, buttons and bits. If I have not got it you did not need it, and if I have, it is on the shelf behind the other thing.','wli_general'],
  wli_k_green:['Pip Hargreaves','kh_ohfolk6_3','Hargreaves the Greengrocer','Apples, herbs, honey and flowers, picked this morning by me and my aching back. Take an apple. No, take two. Take the one with the worm, he is lonely.','wli_green'],
  wli_k_potion:['Mistress Verity Holt','kh_ohfolk5_0',"Holt's Potions and Cordials",'Good day, good day. Draughts for the hurt, cordials for the weary, and a tonic for gentlemen who have been to the Plough and Pigeon. Everything is brewed in the copper in the back and labelled in my best handwriting.','wli_potion'],
  wli_k_herbs:['Old Bryony','kh_ohfolk3_1',"Old Bryony's Herb Shop",'Come in, dear, mind the bunches, they bite. Sage for the wise, thyme for the hurried, and nettle for people who will not take advice. Ask me about brewing, if you have the patience.','wli_herbs'],
  wli_k_cooper:['Barnaby Hoop','kh_ohfolk4_5','Hoop the Cooper','Barrels, buckets and tubs, tight as a drum. I make nothing that leaks, except gossip, and that is the customers.','wli_cooper'],
  wli_k_chandler:['Wick','kh_ohfolk7_5',"Wick's Chandlery",'Candles, lanterns and torches. Light, in short. People ask what the trade is like. I say it is a bright prospect.','wli_chandler'],
  wli_k_cobbler:['Tom Heel','kh_ohfolk4_3','Tom Heel, Cobbler','Boots mended while you wait. Boots made while you wait longer. I once resoled a pair with the owner still in them. He was a very patient man.','wli_cobbler']
};
for(const id in WLI_SHOPS){const [n,face,title,greet,stock]=WLI_SHOPS[id];khShop(id,n,face,title,greet,stock)}
if(typeof repWrap==='function'&&typeof herbariumTalk==='function')repWrap('wli_k_herbs',()=>HERBAL_RECIPES().some(r=>!recData()[r.id]),'Learn herbal remedies (the herbarium)',()=>herbariumTalk('wli_k_herbs'));
/* the Plough and Pigeon: a room and a good meal, gossip, and the way down to the cellar */
const WLI_GOSSIP=['They say the road west was walked by kings once. Now it is walked by one ox, and he has not decided whether to go on.','The vicar has been writing a poem for the harvest. We are all being very brave about it.','There is a ghost in the cellar, down the door by the hearth. He is perfectly polite. He only complains about the draught.','The miller says the brook is lower this summer. The ducks say it is the same as ever. I believe the ducks.',"Somebody has stolen Goodwife Crumb's pie again. Everybody knows who. Nobody will say, because he is cute.",'You came through the gardens? Nobody comes through the gardens. The last one who did was the tinker, and he had to be told it was Thursday.','The flower show is on the green on Saturday, and it is the only day of the year that Mistress Tulip and Old Hedge are civil to each other. Barely.'];
khNpc('wli_k_inn','Joss Pluckrose, landlord of the Plough and Pigeon','kh_ohfolk3_5',()=>{
  const cost=60;
  return say('The Plough and Pigeon! A fire in the hearth, a bed with a proper mattress, and ale that has never harmed anybody who stopped at two. A room is '+cost+' gold, and you wake mended and fed.',[
    ['Take rooms ('+cost+' gold)',()=>{if(G.gold<cost)return say('Sixty gold, friend. I cannot go lower, the mattress costs me more than that in sleep alone.',[BYE]);G.gold-=cost;restParty(true);return say('You sleep like babies who have been told a very good story. Everyone wakes healed and fed, and somebody has left a jug of water by the bed.',[BYE])}],
    ['Buy a meal',()=>{openShop(G.talk.d,KH_STOCK.wli_bakery().concat(KH_STOCK.wli_butcher(),[['ale',10]]),'The Plough and Pigeon');return null}],
    ['Any news?',()=>say(WLI_GOSSIP[(G.rounds||0)%WLI_GOSSIP.length],[BYE])],BYE])});
wliLines('wli_nell','Nell, the serving maid','wl2_folk2_5',["Three jugs for the farmers, one for the squire, and a very small one for the cat.","Mind the stairs. The last drunk is still on them.","The cellar door is by the hearth. Do not go down for the ale. The ale is up here. It is the ghost who is down there."]);
wliLines('wli_farmers','A farmer at the bar','kh_ohfolk7_3',["It is a good ale. It is not the ale that is the trouble. It is the ales after.","I came in for a quiet one. That was four hours ago."]);
wliLines('wli_traveller2','A traveller by the fire','kh_ohfolk5_3',["The hearth is a fine hearth. I have put my boots near it, and the boots are very pleased.","They say the road west is shut. I am told by seven different people, and one of them was a goose."]);
/* the church of Saint Wenna */
const wliLvl=()=>{const a=G.heroes||[];return Math.max(1,Math.round(a.reduce((n,h)=>n+h.lvl,0)/Math.max(1,a.length)))};
khNpc('wli_k_church',"Reverend Alder, vicar of Saint Wenna's",'wl2_folk1_1',d=>{
  const lvl=wliLvl(),heal=4*lvl+10,raise=40*lvl,hurt=G.heroes.some(h=>h.alive&&(h.hp<h.max||h.mp<h.mpMax)),dead=G.heroes.map((h,i)=>h.alive?-1:i).filter(i=>i>=0);
  const opts=[];
  opts.push(['Ask for healing ('+heal+' gold)',()=>{
    if(!hurt)return say('You are all quite well. Keep your gold, and put a penny in the box on the way out if you feel moved. Or do not. The roof is only leaking a little.',[BYE]);
    if(G.gold<heal)return say('The church asks '+heal+' gold for candles, herbs and a new bell rope. Come back when you have it, and welcome.',[BYE]);
    G.gold-=heal;G.heroes.forEach(h=>{if(h.alive){h.hp=h.max;h.mp=h.mpMax}});sfx('heal');return say('The vicar lays a warm hand on each of you and says the old words in a very small voice. Your hurts close, and your strength comes back.',[BYE])}]);
  if(dead.length)opts.push(['Raise '+HERO_DEF[dead[0]].name+' ('+raise+' gold)',()=>{
    if(G.gold<raise)return say('Raising the fallen costs '+raise+' gold, and the church cannot do it for less. I have asked.',[BYE]);
    G.gold-=raise;const h=G.heroes[dead[0]];h.alive=true;h.hp=Math.max(1,Math.ceil(h.max/2));sfx('heal');return say('The bell rings by itself, and '+HERO_DEF[dead[0]].name+' breathes again, rather surprised.',[BYE])}]);
  try{if(typeof afflCureOn==='function'&&typeof afflList==='function'&&afflList().some(e=>{const A=AFFL[e.id];return A&&(A.cureOn||[]).includes('church')}))opts.push(['Ask the vicar to lift a curse or a haunting',()=>{const c=afflCureOn('church');sfx('heal');return say(c?'He says the old words and ends with a sneeze. The weight lifts.':'You carry no curse that he can lift.',[BYE])}])}catch(e){}
  try{if(typeof afflHealOptions==='function')opts.push(...afflHealOptions(30))}catch(e){}
  opts.push(BYE);
  return say("Welcome to Saint Wenna's. The roof leaks a little, the bell is cracked a little, and the vicar is flustered a lot. Do you need healing, or a prayer?",opts)});
/* the school, the almshouse and the hall */
khNpc('wli_k_school','Miss Larkin, the schoolmistress','wl2_folk1_2',()=>yrLines('wli_k_school',["I teach reading, sums and good manners, in that order, and I get as far as the sums.","The children are at their lessons. Or at the window. It is hard to tell from here.","Tommy says two and two is five. I have told him it is four. We have agreed to differ until Thursday."]));
khNpc('wli_k_almshouse','Sister Maud, almoner','kh_ohfolk5_2',()=>yrLines('wli_k_almshouse',["The almshouse has six beds and eleven opinions. Everybody is welcome and nobody is allowed to talk about the soup.","Blessed are the cheesemakers. I have looked it up. It is in a footnote.","If you are hungry there is soup. If you are not hungry there is also soup. It is a very generous soup."]));
khNpc('wli_k_hall','Clerk Fiddlesticks','wl2_folk2_4',()=>yrLines('wli_k_hall',["Births, deaths, pigs and rain. I keep a book of all four. The pigs are the most reliable.","The mayor is about the town, being mayoral. If you need a form, there is a form. If you want to know what the form is for, there is another form.","The notice boards are on the walls. Please read them. Nobody ever does, and I have started to take it personally."]));
/* the households: who is at home */
{const R=[['wli_r_wife',"A farmer's wife",'wl2_folk1_0',["Come in, come in, wipe your boots, mind the dog. I would offer tea, but I have only got the good tea, and that is for the vicar.","The cat is not on the table. The cat is merely above the floor."]],
  ['wli_r_old','An old man','wl2_folk2_2',["I have lived in this house since before the brook moved.","My knees say rain. My knees are very rarely wrong, and never useful."]],
  ['wli_r_mum','A young mother','kh_ohfolk3_4',["Shh. He has just gone off. If he wakes I will make you rock him.","He only sleeps when the church bell rings. It is a very noisy household in Wenlock, and I like it."]],
  ['wli_r_cook','A cook','kh_ohfolk2_2',["I make a stew that has been going since March. I just keep adding.","A good stew is two days old. Do not tell the vicar."]],
  ['wli_r_weaver','A weaver','kh_ohfolk4_2',["Wool from the hill sheep, spun by me, woven by me, and sold by my husband, who gets all the credit.","A loose thread is a story that has not finished yet."]],
  ['wli_r_man','A retired soldier','kh_ohsold1_1',["I fought in the old wars. I remember the food, which was terrible, and the sergeant, who was worse.","Quiet town. I have a quiet house. I do not miss it at all. Much."]],
  ['wli_r_girl','A girl with a book','wl2_folk1_4',["Shh, I am at the good part. There is a dragon and he is really quite nice.","Please do not tell Miss Larkin I am reading during the sums."]],
  ['wli_r_scholar','A scholar','kh_ohfolk5_4',["I am copying a book about the stars. The stars have not changed, but the spelling has.","Ink is a wonderful thing. It is also on my sleeve, my collar and my cat."]],
  ['wli_r_nun','A lay sister','kh_ohfolk5_2',["We bake the church bread on Fridays, and the mice get the first loaf. It is a covenant.","Peace be upon this house, and on the mouse that lives in it."]],
  ['wli_r_fiddler','A fiddler','wl2_folk2_0',["I am working on a tune. It is not finished. It has no ending and no beginning, and the middle is very strong.","If I stop, the cat stops. If the cat stops, the neighbours cheer."]]];
  for(const [id,n,face,lines] of R)wliLines(id,n,face,lines,id==='wli_r_girl'?{sc:.8}:undefined)}
/* the stand-in faces while a new picture is not there (the new figures are in assets/wl2) */
function wlinFaces(){const F={wl2_folk1_0:'kh_ohfolk2_5',wl2_folk1_1:'kh_ohfolk1_4',wl2_folk1_2:'kh_ohfolk1_3',wl2_folk1_3:'kh_ohfolk1_5',wl2_folk1_4:'kh_ohfolk3_0',wl2_folk1_5:'kh_ohfolk2_2',wl2_folk2_0:'kh_ohfolk6_0',wl2_folk2_1:'kh_ohfolk1_0',wl2_folk2_2:'kh_ohfolk3_3',wl2_folk2_3:'kh_ohfolk2_0',wl2_folk2_4:'kh_ohfolk5_5',wl2_folk2_5:'kh_ohfolk2_5',wl2_home_2:'kh_anim1_0',wl2_home_3:'kh_oqdogs_3'};
  for(const id in KH_KEEPERS){const k=KH_KEEPERS[id];if(id.startsWith('wli_')&&k.face&&k.face.startsWith('wl2_')&&!IMG[k.face]&&F[k.face])k.face=F[k.face]}}
