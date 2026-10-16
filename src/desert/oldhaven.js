/* ==========================================================================
   OLDHAVEN, the city of King Osric. Reached from the quay (304) through a portcullis gate between two towers.
     305 Oldhaven (the city, 150 by 150)   306 The Court of King Osric   307 The King's Rest (inn)   308 Oldhaven Arms (smith)
     309 The Apothecary   310 The Chapel of Saint Brannoch   6000+ every other house and shop
   A grey stone castle city: a curtain wall with a gate between two towers, a great square before the castle, the king's road
   lined with soldiers, streets three houses apart with lanterns, and a door on every house.
   The end of this part of the story is in the court: the master ledger is read, the chancellor turns on the king, and the warrant is torn up.
   ========================================================================== */
for(const n of ['osric','vance','aldwyn','rguard'])loadImg('yar_p_'+n,'assets/yar_p_'+n+'.png');
Object.assign(NPC_H,{yar_p_osric:1,yar_p_vance:1,yar_p_aldwyn:1,yar_p_rguard:1});
// every person of Oldhaven stands about a cell tall, so that their faces can be seen from close by (a picture with no height set would be nearly one and a half)
for(const [pre,n] of [['kh_ohsold1_',6],['kh_ohfolk1_',6],['kh_ohfolk2_',6],['kh_ohfolk3_',6],['kh_ohfolk4_',6],['kh_ohfolk5_',6],['kh_ohfolk6_',6],['kh_ohfolk7_',6],['kh_ohcourt1_',6],['kh_oqmen_',6]])for(let i=0;i<n;i++)NPC_H[pre+i]=.98;
Object.assign(ENEMY_DEF,{
  chancellor:{name:'Chancellor Vance',hp:300,dmg:[11,17],hit:.82,w:.5,img:'yar_p_vance',xp:1600,gold:[400,700],speed:1,verb:'strikes',aboveParty:3},
  rguard:{name:'Royal Guard',hp:120,dmg:[9,14],hit:.78,w:.55,img:'yar_p_rguard',xp:300,gold:[40,90],speed:1,verb:'cuts',aboveParty:1}
});
const OH={W:150,H:150,ID:305,COURT:306,ROOM:307,HOME:6000,CX:74};
vq('vq6','The Court of King Osric','King Osric','At noon the party is brought before King Osric with the master ledger. Make him read it.',1,khFlag('pardoned'),{gold:6000,xp:25000,items:['potion4']});

/* ---- the painted pieces: kh_ohprops1_N and friends, and how tall each stands ---- */
const OH_PROP={horse:['ohprops1_1',1.45],banner:['ohprops1_2',2.6],ballista:['ohprops1_4',1.05],rack:['ohprops1_5',1.05],balls:['ohprops1_6',.5],barrel:['ohprops1_7',.62],treb:['ohtreb1_0',2.3]};
function ohAlias(){for(const k in OH_PROP){const [n,h]=OH_PROP[k],im=IMG['kh_'+n];if(im){IMG['oh_'+k]=im;NPC_H['oh_'+k]=h}}}

/* the wall styles: which painted picture each part is cut from, and the warm tint laid over it */
const OH_STY={
  gold:{plain:'kh_ohwall1_2',win:'kh_ohwall1_4',door:'kh_ohwall1_5',slit:'kh_ohwall1_3',tint:[255,236,196,.08]},
  honey:{plain:'kh_ohwall1_2',win:'kh_ohwall1_4',door:'kh_ohwall1_5',slit:'kh_ohwall1_3',tint:[255,208,146,.04]},
  cream:{plain:'kh_ohwall1_2',win:'kh_ohwall1_4',door:'kh_ohwall1_5',slit:'kh_ohwall1_3',tint:[255,246,228,.4]},
  rose:{plain:'kh_ohwall1_2',win:'kh_ohwall1_4',door:'kh_ohwall1_5',slit:'kh_ohwall1_3',tint:[255,184,156,.06]},
  grey:{plain:'kh_ohwall1_0',win:'kh_ohwall1_4',door:'kh_ohwall1_5',slit:'kh_ohwall1_3',tint:[255,234,200,.14]},
  castle:{plain:'kh_ohwall1_2',win:'kh_ohwall1_4',door:'kh_ohwall1_5',slit:'kh_ohwall1_3',tint:[255,232,188,.1]},
  castle2:{plain:'kh_ohwall1_0',win:'kh_ohwall1_4',door:'kh_ohwall1_5',slit:'kh_ohwall1_3',tint:[255,226,178,.12]}
};
/* the painted sheets, in the order their six pictures were drawn: plain, plain variant, upper window, shop window, door, small window */
function ohStyles(){
  const sheet=(name,n,fb,extra)=>{if(!IMG['kh_'+n+'_0'])return;OH_STY[name]=Object.assign({plain:'kh_'+n+'_0',alt:'kh_'+n+'_1',win:'kh_'+n+'_2',shop:'kh_'+n+'_3',door:'kh_'+n+'_4',win2:'kh_'+n+'_5',slit:'kh_ohwall1_3'},extra||{})};
  sheet('timber','ohwall2');sheet('golden','ohwall3');sheet('brick','ohwall4');sheet('cottage','ohwall5');
  if(IMG.kh_ohwall6_0){OH_STY.fort={plain:'kh_ohwall6_0',alt:'kh_ohwall6_1',slit:'kh_ohwall6_2',win:'kh_ohwall6_3',win2:'kh_ohwall6_3',shop:'kh_ohwall6_3',door:'kh_ohwall6_5',banner:'kh_ohwall6_4'}}
  for(const k of ['timber','golden','brick','cottage','fort'])if(!OH_STY[k])OH_STY[k]=OH_STY[{timber:'cream',golden:'gold',brick:'rose',cottage:'honey',fort:'castle'}[k]];
  // the castle styles use the painted fort sheet when it is there
  OH_STY.castle=Object.assign({},OH_STY.fort,{zoom:2,contrast:2.6});OH_STY.castle2=Object.assign({},OH_STY.fort,{zoom:1.7,contrast:2.4});
  if(OH_STY.golden)OH_STY.golden=Object.assign({},OH_STY.golden,{zoom:1.7,contrast:3.2});if(OH_STY.brick)OH_STY.brick=Object.assign({},OH_STY.brick,{zoom:1.5,contrast:1.6});if(OH_STY.cottage)OH_STY.cottage=Object.assign({},OH_STY.cottage,{contrast:1.8});
}
/* ---- the stone: wall pictures stood up into tall tiles, a door or a window in each ---- */
function ohTiles(){
  const C={};
  const make=(kind,pat,wh,img)=>{
    const key=kind+'|'+pat+'|'+wh+'|'+(img||'');if(C[key])return C[key];
    let S=typeof pat==='string'?OH_STY[pat]:{plain:'kh_ohwall1_'+pat,win:'kh_ohwall1_4',door:'kh_ohwall1_5',slit:'kh_ohwall1_3'};
    if(!S)S=OH_STY.gold;const Hp=Math.round(128*wh),pi=IMG[S.plain]||IMG.kh_ohwall1_0,units=Math.ceil(wh);
    const c=mkCanvas(128,Hp,(x,w,h)=>{
      x.fillStyle='#8a8478';x.fillRect(0,0,w,h);
      for(let u=0;u<units;u++){
        let im=pi;
        if(u===0&&kind==='door')im=IMG[S.door];
        else if(u===0&&kind==='gate')im=IMG[img];
        else if(u===0&&kind==='shopfront')im=IMG[S.shop||S.win];
        else if(u===0&&kind==='gwin')im=IMG[S.win2||S.win];      // a small window at street level, for the side walls
        else if(u===1&&(kind==='gwin'))im=IMG[S.win];
        else if(u===1&&kind==='window2')im=IMG[S.win2||S.win];
        else if(u===1&&(kind==='window'||kind==='shopfront'||kind==='door'))im=IMG[S.win];
        else if(kind==='plain2')im=IMG[S.alt||S.plain];
        else if(u===1&&kind==='slit')im=IMG[S.slit];
        else if(u===2&&kind==='window'&&wh>=2.9)im=IMG[S.win];
        if(im){
          const Z=S.zoom||1;
          if(Z>1&&(im===pi||im===IMG[S.alt])){ // masonry drawn bigger: fewer, chunkier stones, so a wall still reads as stone from a distance
            const sw=im.width/Z,sh=im.height/Z,fx=((u*.41+(typeof pat==='string'?pat.length:0)*.13+(wh*7)%1)%1),fy=((u*.57+.2)%1);
            x.drawImage(im,fx*(im.width-sw),fy*(im.height-sh),sw,sh,0,h-(u+1)*128,128,128);
          }else x.drawImage(im,0,0,im.width,im.height,0,h-(u+1)*128,128,128);
        }
      }
      if(S.tint&&kind!=='gate'){x.globalCompositeOperation='multiply';x.fillStyle='rgb('+S.tint[0]+','+S.tint[1]+','+S.tint[2]+')';x.fillRect(0,0,w,h);
        if(S.tint[3]){x.globalCompositeOperation='screen';x.fillStyle='rgba(255,238,205,'+S.tint[3]+')';x.fillRect(0,0,w,h)}x.globalCompositeOperation='source-over'}
    });
    const d=c.getContext('2d').getImageData(0,0,128,Hp).data;
    if(S.contrast&&kind!=='gate'){ // the painted stone is soft: stretch it round its mean so the courses and joints show from across a street
      let m0=0,m1=0,m2=0,n=0;for(let i=0;i<d.length;i+=4){m0+=d[i];m1+=d[i+1];m2+=d[i+2];n++}m0/=n;m1/=n;m2/=n;const k=S.contrast;
      for(let i=0;i<d.length;i+=4){d[i]=Math.max(0,Math.min(255,(d[i]-m0)*k+m0));d[i+1]=Math.max(0,Math.min(255,(d[i+1]-m1)*k+m1));d[i+2]=Math.max(0,Math.min(255,(d[i+2]-m2)*k+m2))}}
    const id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;if(wh>=2.5&&(pat==='castle'||pat==='castle2'||pat==='fort')&&kind!=='gate')TEX[id].cren=.3; // castle walls carry battlements
    const gid=KH_NEXT_GID++;T_TILE[gid]=id;
    return C[key]={gid,tex:id};
  };
  return {make};
}

/* ---- the people: soldiers, townsfolk and the court. Each stands for many of its kind in the streets. ---- */
const OH_FOLK=[
  {id:'oh_f_pike',n:'A halberdier',face:'kh_ohsold1_0',sc:1.08,lines:["Halt. No, I am joking. Move along, citizen. Slowly.","Forty paces from the gate to the square, and I have walked them nine thousand times. The cobbles are lying to me about the distance.","The halberd is heavier at the end of the day than at the start. Nobody tells you that.","Keep to the left of the king's road. The warhorses do not read signs."]},
  {id:'oh_f_xbow',n:'A crossbowman',face:'kh_ohsold1_1',sc:1.05,lines:["Do not stand in front of the wall at noon. We are testing the crossbows. Probably.","One bolt, one purpose, and a fortnight of sergeant's temper if I lose it.","I can hit a gull at forty paces. I have not. The sergeant says it is bad for morale, mostly the gull's.","Quiet street today. That is when I worry."]},
  {id:'oh_f_knight',n:'A knight of the Crown',face:'kh_ohsold1_2',sc:1.14,lines:["A knight of the Crown does not gossip. I will tell you only that the king is old and the chancellor is not.","My shield has a griffin on it. The griffin has seen more of Oldhaven than I have, and says nothing either.","Courtesy costs nothing. Say that to the sergeant who borrowed my second-best sword.","You carry yourselves like people who have been in a fight. Good. This city has forgotten how."]},
  {id:'oh_f_knight2',n:'A mace-bearing knight',face:'kh_ohsold1_3',sc:1.14,lines:["The red plume is for the Knights of the Gate. We stand where the arrows would come.","A mace does what a sword cannot, and does it without a speech.","If the warrant on your heads is true, you are very brave to walk here. If it is false, you are braver.","There is a feast in the keep tonight. I am on the door. There is always a feast, and I am always on the door."]},
  {id:'oh_f_banner',n:'A standard bearer',face:'kh_ohsold1_4',sc:1.12,lines:["The white sun on blue. Seven hundred years it has flown above this city, and I have to hold it up in a headwind.","They say the banner is lucky. I say it is long, and I am short.","Stand clear. If the wind turns, the standard will take your hat, and I will not be allowed to chase it."]},
  {id:'oh_f_herald',n:'A herald',face:'kh_ohsold1_5',sc:1.08,lines:["Hear ye! Well. Not you, specifically. But hear anyway.","I cry the hours, the proclamations and the prices of fish. In that order of dignity, and the reverse order of interest.","The court sits at noon, if the king is well, and the chancellor permits."]},
  {id:'oh_f_smith',n:'A blacksmith',face:'kh_ohfolk1_0',sc:1.05,lines:["Eleven hundred horseshoes since Michaelmas. The warhorses eat iron, I swear it.","A blade is only as good as the arm. And the quench. And the fire. And the temper of the smith.","If you need steel, the Oldhaven Arms has it, and the prices are not my fault."]},
  {id:'oh_f_baker',n:'A baker',face:'kh_ohfolk1_1',sc:1,lines:["Hot rolls, hot rolls! The garrison eats them by the sack, and still complains.","Fifty loaves for the castle every dawn, and the cook sends back three, with notes.","The bread of Oldhaven is round, honest and slightly burnt. Like the people."]},
  {id:'oh_f_noble',n:'A well-fed gentleman',face:'kh_ohfolk1_2',sc:1.04,lines:["The city is quite safe, I am told, though I find it impossible to be sure. I have hired another footman, to be certain.","I have a seat at the court, a house on the square and a cough. Only one of those is a nuisance.","Do you know the chancellor? Nor do I. That is how he likes it."]},
  {id:'oh_f_lady',n:'A lady of the court',face:'kh_ohfolk1_3',sc:1.06,lines:["How tiresome the soldiers are. How reassuring.","The queen wore green at Candlemas, and now every lady in the city has a green gown. I held out until Tuesday.","I do not interfere in matters of state. I merely listen very carefully at dinner."]},
  {id:'oh_f_monk',n:'A brother of the chapel',face:'kh_ohfolk1_4',sc:1,lines:["Peace be with you, and with your swords, when they are in their scabbards.","I am copying the psalter. I have reached the part about patience, which is convenient.","Saint Brannoch walked the roads and mended what he found. We keep his candles, and try to keep his habits."]},
  {id:'oh_f_boy',n:'A boy with a bucket',face:'kh_ohfolk1_5',sc:.78,lines:["I water the warhorses for a penny. They are very large. They do not bite. Much.","My father is a halberdier. I am going to be a knight, or a pie seller.","Is it true you came on a ship with a gull on the front?"]},
  {id:'oh_f_fishwife',n:'A fishwife',face:'kh_ohfolk2_0',sc:1,lines:["Herring, herring, fresh from the Dawn Walker's own quay! Well, near enough.","The soldiers never pay. The sergeant says it is a tax. I say it is a very poor sort of tax.","I smell of fish and I know everyone's business. Do not stand downwind of either."]},
  {id:'oh_f_friar',n:'A grey friar',face:'kh_ohfolk2_1',sc:1,lines:["Alms for the poor, and blessings for the rich, since the rich need them more.","I walk from gate to gate every day. The city is bigger than it looks, and the people smaller.","I have heard confessions from three guards, a baker and a wizard. The wizard was the shortest."]},
  {id:'oh_f_cook',n:'A cook',face:'kh_ohfolk2_2',sc:1.04,lines:["I cook for the castle kitchens, and I can tell you the king eats very little and the chancellor eats very well.","A good stew is two days old. Do not tell the court.","Do you like pepper? I have a cellar of it, and no one to blame."]},
  {id:'oh_f_beggar',n:'An old beggar',face:'kh_ohfolk2_3',sc:.96,lines:["A penny for an old man who remembers the king when he was young and the city had half as many walls.","I sit by the gate. Every secret in Oldhaven goes in or out of that gate, and none of them tip.","The chancellor's men took my cart. The king's men took my dog. The queen's maid gave me soup. Guess which I remember."]},
  {id:'oh_f_clerk',n:'A court clerk',face:'kh_ohfolk2_4',sc:1,lines:["I count things for the Crown. Today I have counted forty-one crates of nothing, in a very detailed ledger.","The court roll is closed to the public. I have never seen that done before.","I have a quill for lying and a quill for truth. The ink is the same."]},
  {id:'oh_f_maid',n:'A serving maid',face:'kh_ohfolk2_5',sc:1,lines:["Three jugs for the soldiers, one for the sergeant, and a very small one for the cat.","I have served ale to knights, thieves and a bishop. The bishop tipped best.","Mind the stairs. The last drunk is still on them."]}
];
/* thirty more people of the town: children and elders, craftsfolk, gentry and clergy, street life, servants and the watch */
const OH_FOLK2=[
  {id:'oh_g_girl',n:'Mina, a little girl',face:'kh_ohfolk3_0',sc:.74,lines:["This is Dolly. She is not allowed in the fountain, but she goes in anyway.","I can count to a hundred. One, two, three, four. It takes a long time.","Mama says not to talk to strangers. But you have a nice hat. Well, one of you."]},
  {id:'oh_g_eggs',n:'An old egg seller',face:'kh_ohfolk3_1',sc:.96,lines:["Eggs, fresh this morning. The hens are in a bad mood, so they are very good eggs.","Twelve eggs for a penny, and I will tell you which hen laid which.","The queen's cook buys my eggs. The queen's cook pays late. The eggs do not mind."]},
  {id:'oh_g_hoop',n:'A boy with a hoop',face:'kh_ohfolk3_2',sc:.78,lines:["I can roll it all the way from the gate to the fountain without it falling. Watch.","The hoop came off a barrel. The barrel is still in the cellar, and nobody has noticed yet.","If you see my sister, I was never here."]},
  {id:'oh_g_oldman',n:'An old man',face:'kh_ohfolk3_3',sc:1,lines:["I remember when this street was all mud. Now it is cobbles, and my knees prefer the mud.","I fought in the old wars. I mostly remember the food, which was terrible.","Sit with me a while. Everyone is in a hurry, and nobody gets there any sooner."]},
  {id:'oh_g_mother',n:'A young mother',face:'kh_ohfolk3_4',sc:1,lines:["He only sleeps when the bells are ringing. Please keep your voices down.","My husband is on the wall tonight. I am told that is an honour. It is also very cold.","Is it true some people on the quay sailed across the whole sea? With a baby on board I would have turned back at the first wave."]},
  {id:'oh_g_tavern',n:'A jolly tavern keeper',face:'kh_ohfolk3_5',sc:1.04,lines:["Best ale this side of the sea, and the worst jokes. Try the ale first.","I have been told I laugh too loudly. I was told it by customers who then stayed another hour.","A full mug is the oldest peace treaty there is."]},
  {id:'oh_c_carp',n:'A carpenter',face:'kh_ohfolk4_0',sc:1.04,lines:["Measure twice, cut once, and swear quietly. That is the whole trade.","These planks are oak. Oak from the east forest, where the trees are older than the city.","I am building a stage for the fair. Do not lean on it. Not yet."]},
  {id:'oh_c_mason',n:'A stonemason',face:'kh_ohfolk4_1',sc:1,lines:["Every stone in that wall was cut by hand. Some of them by my grandfather.","The castle needs a new battlement every spring. The weather bites, and the pigeons help.","A good mason never says a wall is finished. He says it is standing, for now."]},
  {id:'oh_c_weaver',n:'A weaver',face:'kh_ohfolk4_2',sc:1,lines:["Wool from the western hills, spun by me, woven by me, and sold by my husband, who gets all the credit.","A loose thread is a story that has not finished yet.","I am weaving blue and white for the king's banner. It is the third banner this year. The wind is very hard on them."]},
  {id:'oh_c_tanner',n:'A tanner',face:'kh_ohfolk4_3',sc:1.02,lines:["Yes, I smell. Everyone in the trade smells. Stand upwind and we will get along.","Good leather takes a year to make. Bad leather takes a week, and shows.","If you need a belt, I make a very good belt. If you need a friend, try the baker."]},
  {id:'oh_c_potter',n:'A potter',face:'kh_ohfolk4_4',sc:1,lines:["I made this jug this morning. It already has a crack. That is how you know it is honest work.","Clay is easy. It is the fire that is difficult.","The best pots in the city come from the kiln by the north wall. They are mine, in case that was not clear."]},
  {id:'oh_c_cooper',n:'A cooper',face:'kh_ohfolk4_5',sc:1,lines:["A barrel holds ale, fish, nails, or secrets. It is not my business which.","Forty staves and three hoops, and not one of them is allowed to leak.","The tavern next door buys a barrel a day. They do not return the empties. I have stopped counting."]},
  {id:'oh_n_lady',n:'A lady in blue',face:'kh_ohfolk5_0',sc:1.06,lines:["This hat is a great trial. It must be carried, not worn, and nobody warned me.","The court is a lovely place if you enjoy listening very carefully to nothing.","Blue and white are the colours of Oldhaven. I wear them whether I am in a good mood or not."]},
  {id:'oh_n_squire',n:'A young squire',face:'kh_ohfolk5_1',sc:1.02,lines:["I carry the helmet. One day I will wear the helmet. Today I carry it, and it is very heavy.","My knight says courage is going forward when you are afraid. I have a great deal of practice.","Is it true the tournament is to be held at the fair? I would give a year of my life to see it."]},
  {id:'oh_n_nun',n:'A nun',face:'kh_ohfolk5_2',sc:1,lines:["Peace be upon this street, and upon the cat that sits in the middle of it.","We bake bread for the poor on the chapel steps. You are welcome to a loaf, whoever you are.","Saint Brannoch welcomed every traveller. I try to do the same, and to ask no questions until they have eaten."]},
  {id:'oh_n_friar',n:'A wandering friar',face:'kh_ohfolk5_3',sc:1.06,lines:["I walk from town to town with a stick and no purse. People give me bread. It is a very good arrangement.","I have heard confession in three cities and one hay barn. The hay barn was the most honest.","The road east goes through the oak forest. Go with a friend, or a very large dog."]},
  {id:'oh_n_scholar',n:'A scholar',face:'kh_ohfolk5_4',sc:1,lines:["I am copying a book about the stars. The stars have not changed, but the spelling has.","Ink is a wonderful thing. It is also on my sleeve, my collar, and my cat.","I am told some people carried a ledger across the sea. I would give a great deal to read it. Please do not tell the chancellor's clerks."]},
  {id:'oh_n_wool',n:'A wool merchant',face:'kh_ohfolk5_5',sc:1.02,lines:["Wool is the gold of this kingdom, and I am a very comfortable man.","The fur collar is a necessity. It is cold on the quay. I tell my wife it is cold on the quay.","If you want to buy anything, I know a man. If you want to sell anything, I am the man."]},
  {id:'oh_s_minstrel',n:'A minstrel',face:'kh_ohfolk6_0',sc:1.02,lines:["I know four hundred songs. Three hundred and ninety of them are about a girl and a river.","A song for a penny, two songs for a groat, and the rest of the night for a meal.","The lute has seven strings and I can play on five of them. The audience cannot tell."]},
  {id:'oh_s_jester',n:'A travelling jester',face:'kh_ohfolk6_1',sc:1.02,lines:["Why did the knight sit on the roof? Because he had heard the drawbridge was down. I will explain it later.","I am not the king's fool. I am the fool of everyone who gives me an apple.","Hold this stick. No, the other end. Now you are part of the show."]},
  {id:'oh_s_flower',n:'A flower seller',face:'kh_ohfolk6_2',sc:.9,lines:["Roses, roses! Red for friends and pink for sweethearts and yellow for people who owe you money!","Take a flower. It is only a penny, and it will make somebody cross very happy.","These came from the castle gardens. The gardener does not know. Please do not tell the gardener."]},
  {id:'oh_s_apple',n:'An apple seller',face:'kh_ohfolk6_3',sc:1,lines:["Apples from the walled orchard, sweet as the day is long. A penny each, and one more if you smile.","Do not eat the green ones. I am not telling you why.","The knights eat three each, and they never pay. That is why I sell to the rest of you."]},
  {id:'oh_s_crier',n:'The town crier',face:'kh_ohfolk6_4',sc:.96,lines:["Hear ye, hear ye! The fair of Saint Brannoch comes to the green, to the sound of drums and the smell of sausages!","Oyez! A lost cat, grey, answers to Biscuit. Reward of one fish.","I have been told I am very loud. I was told it by people who then thanked me for the news."]},
  {id:'oh_s_falconer',n:'A falconer',face:'kh_ohfolk6_5',sc:1.02,lines:["She is called Windsor. She has killed forty-one pigeons and one hat.","Do not wave your arms near her. She thinks everything that moves is dinner.","The king hunts every autumn in the east forest. Windsor does the real work."]},
  {id:'oh_v_gardener',n:'A gardener',face:'kh_ohfolk7_0',sc:1.02,lines:["I trim the hedges in the ward. They grow back overnight out of spite.","Roses need patience, water, and a gardener who never says anything unkind about them.","If you must walk on the grass, walk where the grass is already dead. Nobody will notice."]},
  {id:'oh_v_page',n:'A page boy',face:'kh_ohfolk7_1',sc:.9,lines:["I carry messages for the court. I am not allowed to read them. I read them anyway.","If you see a lord wearing blue, please tell him his dinner is cold. He will be glad.","I run from the keep to the gate forty times a day. I am the fastest page in Oldhaven. I think."]},
  {id:'oh_v_wash',n:'A washerwoman',face:'kh_ohfolk7_2',sc:1,lines:["Sheets for the inn, shirts for the guard, and a very small pair of stockings for the squire's cat.","You can tell everything about a man by his shirt. I will not say what.","The water in the fountain is not for washing. I wash in the fountain."]},
  {id:'oh_v_stable',n:'A stable boy',face:'kh_ohfolk7_3',sc:.92,lines:["Forty horses and one of me. They all want breakfast at the same time.","The big grey bites. The little brown kicks. The old mare is perfect, and I love her.","If you need a horse for the east road, ask me, not the stable master. I know which ones are lazy."]},
  {id:'oh_v_archer',n:'A woodland archer',face:'kh_ohfolk7_4',sc:1.04,lines:["I came in from the oak forest this morning. The deer are thick this year, and so are the wolves.","A longbow is taller than a man and pulls like a mule. I would not trade it for a horse.","The forest is a lovely place. Keep to the paths, and be polite to the trees."]},
  {id:'oh_v_watch',n:'A town watchman',face:'kh_ohfolk7_5',sc:1.04,lines:["I walk the lanes at night with a lantern and a club. Mostly I use the lantern.","Lock your door, put out your fire, and say good evening to the cat. That is my whole advice.","There is a lot of coming and going in the lanes these days. I write it all down. Somebody should."]}
];
OH_FOLK.push(...OH_FOLK2);
OH_FOLK.forEach(f=>khNpc(f.id,f.n,f.face,()=>yrLines(f.id,f.lines),{sc:f.sc}));
const OH_FOLKBY=Object.fromEntries(OH_FOLK.map(f=>[f.id,f]));
const OH_CROWD=['oh_f_baker','oh_f_noble','oh_f_lady','oh_f_monk','oh_f_boy','oh_f_fishwife','oh_f_friar','oh_f_cook','oh_f_beggar','oh_f_clerk','oh_f_maid','oh_f_smith',...OH_FOLK2.map(f=>f.id),...OH_FOLK2.map(f=>f.id)];
const OH_SOLDIER=['oh_f_pike','oh_f_pike','oh_f_xbow','oh_f_pike','oh_f_knight','oh_f_xbow','oh_f_pike','oh_f_knight2'];

/* ---- the houses: what is inside each, by who lives there ---- */
const OH_SCENES={
  noble:{n:"A Nobleman's House",res:['oh_f_noble','oh_f_lady','oh_f_maid']},scholar:{n:"A Scholar's House",res:['oh_f_clerk','oh_f_monk']},wizard:{n:"A Wizard's Study",res:['oh_f_monk']},
  merchant:{n:"A Merchant's House",res:['oh_f_noble','oh_f_clerk','oh_f_baker']},warm:{n:'A Warm House',res:['oh_f_baker','oh_f_fishwife','oh_f_cook','oh_f_lady']},
  worker:{n:"A Craftsman's House",res:['oh_f_smith','oh_f_cook','oh_f_fishwife']},soldier:{n:"A Soldier's Billet",res:['oh_f_pike','oh_f_xbow','oh_f_knight2']},
  children:{n:"A Family's House",res:['oh_f_boy','oh_f_fishwife','oh_f_baker']},healer:{n:"A Healer's House",res:['oh_f_friar','oh_f_monk']},
  potter:{n:"A Potter's Workshop",res:['oh_f_cook','oh_f_smith']},musician:{n:"A Minstrel's House",res:['oh_f_lady','oh_f_maid']},
  spartan:{n:'A Bare House',res:['oh_f_beggar','oh_f_friar']},messy:{n:'A Messy House',res:['oh_f_beggar','oh_f_boy','oh_f_clerk']},
  priest:{n:"A Chaplain's House",res:['oh_f_monk','oh_f_friar']}
};
const OH_RICH=['noble','scholar','wizard','merchant','noble','musician','warm','priest'];
const OH_POOR=['worker','soldier','children','potter','spartan','messy','warm','soldier','healer','worker'];

/* ---- the shops and special doors: each is put on the lot nearest where it should be ---- */
const OH_SPECIAL=[
  {id:307,name:"The King's Rest",room:'inn',keeper:'oh_inn',want:[63,66],floor:'wood',pat:0},
  {id:308,name:'Oldhaven Arms',room:'shop',keeper:'oh_smith',want:[92,80],floor:'cobble',pat:0},
  {id:309,name:'The Apothecary',room:'shop',keeper:'oh_apoth',want:[44,50],floor:'wood',pat:1},
  {id:310,name:'The Chapel of Saint Brannoch',room:'prayer',keeper:'oh_priest',want:[40,66],floor:'cobble',pat:0,chapel:true},
  {name:"The Armourer's Yard",room:'shop',keeper:'oh_armour',want:[92,96],floor:'cobble',pat:0},
  {name:"The King's Bakery",room:'shop',keeper:'oh_bakery',want:[56,80],floor:'wood',pat:0},
  {name:'The Scroll House',room:'shop',keeper:'oh_scrolls',want:[28,26],floor:'wood',pat:1},
  {name:'Pack and Lantern',room:'shop',keeper:'oh_pack',want:[62,100],floor:'wood',pat:0},
  {name:'The Gilded Lance',room:'inn',keeper:'oh_inn2',want:[122,66],floor:'wood',pat:0},
  {name:'The Cookshop',room:'shop',keeper:'oh_cookshop',want:[110,112],floor:'wood',pat:0},
  {name:'The Garrison Hall',room:'hall',keeper:'oh_sergeant',want:[26,112],floor:'cobble',pat:1},
  {name:"The Herbwife's Cottage",room:'shop',keeper:'oh_herbs',want:[12,66],floor:'wood',pat:0},
  {name:'The Oldhaven Baths',room:'bath',keeper:'oh_bath',want:[100,64],pat:0,scene:'bath_grand'},
  {name:'The Glover and Tailor',room:'shop',keeper:'oh_tailor',want:[124,50],floor:'wood',pat:0}
];

/* ---- the plan of the city: eight columns of blocks and ten rows, two-square streets between them, the king's road down the middle ---- */
const OH_XC=[[6,16],[19,31],[34,46],[49,64],[84,99],[102,114],[117,129],[132,143]];
const OH_YR=[[6,17],[20,31],[34,41],[44,57],[60,72],[75,87],[90,102],[105,117],[120,132],[135,143]];
const OH_AVE={x0:67,x1:81},OH_ROAD={x0:73,x1:75},OH_CASTLE={x0:49,y0:6,x1:99,y1:41},OH_FAIR={x0:102,y0:75,x1:129,y1:102};
const OH_CROSS=[18.5,32.5,42.5,58.5,73.5,88.5,103.5,118.5,133.5]; // the middle of each east-west street
/* floors: 0 cobble street, 1 pale plaza stone, 2 lawn, 3 mossy cobble, 4 gravel and earth, 5 stained cobble */
/* the painted pictures of the greenery and the street, with the old pieces to fall back on */
const OH_ART={
  oak:[['ltree0',3.6],['ltree4',3.8],['ltree8',3.4],['ltree12',3.7],['ltree19',3.2],['ltree0',4.2],['ltree4',3.1]],
  orchard:[['ltree17',2.6],['ltree19',2.5],['ltree17',2.3]],
  willow:[['ltree8',3.2],['ltree4',3.4]],
  cypress:[['ltree19',2.8],['ltree0',3.0]],
  topiary:[['kh_city2_1',1.7]],
  bush:[['lbush0',.8],['lbush0_1',.8],['lbush0_2',.8]],
  bed:[['lflora0',.55],['lflora0_1',.55],['lflora0_2',.55],['kh_city2_5',.55]],
  box:[['kh_city2_5',.55]],
  pergola:[['kh_city2_4',2.4]],
  well:[['kh_city1_1',1.5]],
  pot:[['kh_city2_3',.9]],
  tub:[['yar_tub',.55],['yar_lavender',.55]]
};
function ohArt(){
  for(const k in OH_ART)for(const [n,h] of OH_ART[k]){if(IMG[n])NPC_H[n]=NPC_H[n]===undefined||k==='oak'||k==='orchard'||k==='willow'?h:NPC_H[n]}
  NPC_H.ltree0=3.6;NPC_H.ltree4=3.8;NPC_H.ltree8=3.4;NPC_H.ltree12=3.7;NPC_H.ltree19=3.2;NPC_H.ltree17=2.6;NPC_H.ltree18=2.7;
  NPC_H.kh_city2_1=1.7;Object.assign(NPC_H,{kh_ohgard1_0:1.7,kh_ohgard1_1:.95,kh_ohgard1_2:2.3,kh_ohgard1_3:.62,kh_ohgard1_4:1.0,kh_ohgard1_5:.95,kh_ohgard2_0:1.15,kh_ohgard2_1:.95,kh_ohgard2_2:1.35,kh_ohgard2_3:.7,kh_ohgard2_4:.75});
  IMG.oh_well=IMG.kh_city1_1;NPC_H.oh_well=1.5;IMG.oh_pergola=IMG.kh_city2_4;NPC_H.oh_pergola=2.4;IMG.oh_topiary=IMG.kh_city2_1;NPC_H.oh_topiary=1.7;NPC_H.kh_city2_4=2.4;NPC_H.kh_city2_5=.55;NPC_H.kh_city1_1=1.5;NPC_H.kh_city2_3=.9;NPC_H.lflora0=.55;NPC_H.lflora0_1=.55;NPC_H.lflora0_2=.55;NPC_H.lbush0=.8;NPC_H.lbush0_1=.8;
  for(let i=0;i<6;i++)NPC_H['kh_stall1_'+i]=1.5;for(const i of [0,1,3])NPC_H['kh_stall2_'+i]=.8;NPC_H.kh_stall2_2=.9;
  // the roofs: painted gables in several colours, some warmed up from the grey ones
  const tint=(src,name,rgb,lift)=>{if(IMG[name]||!IMG[src])return;const im=IMG[src];
    const c=mkCanvas(im.width,im.height,(x,w,h)=>{x.drawImage(im,0,0);x.globalCompositeOperation='multiply';x.fillStyle=`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;x.fillRect(0,0,w,h);
      if(lift){x.globalCompositeOperation='screen';x.fillStyle=`rgba(255,235,200,${lift})`;x.fillRect(0,0,w,h)}x.globalCompositeOperation='destination-in';x.drawImage(im,0,0)});
    IMG[name]=c};
  tint('kh_ohroof1_2','oh_rf_terra2',[255,206,170],.08);tint('kh_ohroof1_0','oh_rf_plum',[240,196,190],.18);tint('kh_ohroof1_1','oh_rf_sage',[200,255,215],.1);
  tint('kh_ohroof1_4','oh_rf_thatch',[255,236,170],.38);tint('kh_ohroof1_3','oh_rf_moss',[225,255,210],.25);tint('kh_ohroof1_0','oh_rf_brown',[255,215,170],.3);
  OH_ROOF.terra=IMG.oh_rf_terra2?'oh_rf_terra2':'kh_ohroof1_2';OH_ROOF.red='kh_ohroof1_2';OH_ROOF.slate='kh_ohroof1_1';OH_ROOF.plum=IMG.oh_rf_plum?'oh_rf_plum':'kh_ohroof1_0';
  OH_ROOF.sage=IMG.oh_rf_sage?'oh_rf_sage':'kh_ohroof1_1';OH_ROOF.shingle='kh_ohroof1_4';OH_ROOF.thatch=IMG.oh_rf_thatch?'oh_rf_thatch':'kh_ohroof1_4';OH_ROOF.moss=IMG.oh_rf_moss?'oh_rf_moss':'kh_ohroof1_3';OH_ROOF.brown=IMG.oh_rf_brown?'oh_rf_brown':'kh_ohroof1_0';
}
const OH_ROOF={};
/* sunlit paving: the old floors, lightened and warmed, so the streets are honey-coloured stone and the lawns bright green */
function ohFloors(){
  const warm=(src,name,m,add)=>{if(FLOORS[name]||!FLOORS[src])return;const s=FLOORS[src],d=new Uint8ClampedArray(s.length);
    for(let i=0;i<s.length;i+=4){d[i]=s[i]*m[0]+add[0];d[i+1]=s[i+1]*m[1]+add[1];d[i+2]=s[i+2]*m[2]+add[2];d[i+3]=255}FLOORS[name]=d};
  const paint=(name,k)=>{const im=IMG['kh_ohfloor1_'+k];if(im&&!FLOORS[name])FLOORS[name]=dsPaintedTex(im)};
  // painted ground: golden cobbles, flagstones, gravel, lawn and meadow
  paint('ohCobble',3);paint('ohPale',1);paint('ohMoss',0);paint('ohGravel',2);paint('ohLawn',4);paint('ohMeadow',5);
  // fallbacks from the old floors, lightened and warmed
  warm('cobble','ohCobble',[1.5,1.42,1.2],[26,20,8]);warm('pale','ohPale',[1.2,1.15,1.0],[28,22,10]);warm('mosscobble','ohMoss',[1.4,1.45,1.15],[18,20,6]);
  warm('dirt','ohGravel',[1.35,1.28,1.08],[34,28,12]);warm('lush','ohLawn',[1.2,1.28,.95],[10,22,0]);warm('lush','ohMeadow',[1.2,1.28,.95],[10,22,0]);
}

/* the house types: what the walls are made of, how tall, what roofs they take */
const OH_TYPES={
  timber:{sty:['timber','timber','timber'],wh:[2.5,2.9],roofs:['terra','shingle','red','brown']},
  merchant:{sty:['golden','golden','timber'],wh:[2.9,3.3],roofs:['slate','plum','sage','terra']},
  townhouse:{sty:['brick','brick','golden'],wh:[3.3,3.7],roofs:['slate','terra','plum']},
  cottage:{sty:['cottage','cottage','timber'],wh:[2.0,2.3],roofs:['thatch','moss','shingle','thatch']},
  guild:{sty:['golden','brick','golden'],wh:[3.3,3.6],roofs:['slate','sage'],tower:1},
  almshouse:{sty:['cottage','golden'],wh:[2.2,2.5],roofs:['terra','brown','moss']}
};
function ohPickType(h,rich,w){
  const r=hash2(h.x0,h.y0,51);
  if(w>=8&&r<.55)return 'guild';
  if(w<=4)return r<.55?'townhouse':'cottage';
  if(rich)return r<.4?'merchant':r<.7?'timber':r<.85?'townhouse':'guild';
  return r<.34?'cottage':r<.64?'timber':r<.82?'almshouse':'merchant';
}
function ohBuild(){
  if(LEVELS[OH.ID])return;
  ohAlias();ohArt();ohFloors();ohStyles();
  const W=OH.W,H=OH.H,N=W*H,hs=(a,b,c)=>hash2(a,b,c);
  const TM=ohTiles(),chars={D:LEVEL41_DATA.chars.D},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const block=new Uint8Array(N),fm=new Array(N).fill('0');
  const solid=(x,y,c)=>{rows[y][x]=c;block[y*W+x]=1};
  const sky=[],decor=[],scenery=[],lights=[],used=new Set();
  const lv={rows:null,start:{x:OH.CX,y:141,f:0},enemies:[],items:[],decor,scenery,sky,fmap:null,floorSet:['ohCobble','ohPale','ohLawn','ohMoss','ohGravel','ohMeadow'],floor:'ohCobble',ceil:'cloud',
    day:.98,outdoor:true,amb:.9,name:'Oldhaven',label:'Oldhaven',noExtras:true,diff:25,tele:{x:OH.CX,y:138},ceilH:5.2,chars,lights,portals:[]};
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)fm[y*W+x]=f};
  /* ---- the curtain wall: two squares thick, arrow slits in its face, towers along it ---- */
  const WALL=3.2,wPlain=ch(TM.make('plain','castle',WALL).gid),wSlit=ch(TM.make('slit','castle',WALL).gid),wDark=ch(TM.make('plain','castle2',WALL).gid);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(x>=6&&x<=143&&y>=6&&y<=143)continue;
    const face=x===5||y===5||x===144||y===144;
    solid(x,y,face&&(x+y)%4===0?wSlit:(x*7+y*3)%11===0?wDark:wPlain);
  }
  const pch=n=>{const c=String.fromCharCode(nextCh++);chars[c]=30+n;return c};
  // the portcullis gate on the south wall, between two towers
  const GX=OH.CX,gateWh=3.4,tWh=4.6;
  {const pg=TM.make('gate',0,gateWh,'kh_ohgate1_0');T_DOORS.ohportc=pg.tex;const gc=pch(2);
    for(let y=144;y<=145;y++)for(let x=GX-1;x<=GX+1;x++)solid(x,y,gc);
    const tp=ch(TM.make('plain','castle',tWh).gid),ts=ch(TM.make('slit','castle',tWh).gid);
    for(let y=144;y<=145;y++)for(const xs of [[GX-4,GX-2],[GX+2,GX+4]])for(let x=xs[0];x<=xs[1];x++)solid(x,y,y===144&&x%2===0?ts:tp);
    lv.portals[2]={to:304,x:0,y:0,f:2,tex:'ohportc'};
    sky.push({x:GX-3,y:144.6,k:'kh_ohtower1_3',w:7,z:tWh-.05,big:1},{x:GX+3,y:144.6,k:'kh_ohtower1_3',w:7,z:tWh-.05,big:1});
  }
  // the east gate: shut for now, a gatehouse at the end of the road that runs out of the city to the east
  {const EY=73,tp=ch(TM.make('plain','castle',tWh).gid),ts=ch(TM.make('slit','castle',tWh).gid),eg=ch(TM.make('gate',0,gateWh,'kh_ohgate1_0').gid);
    for(let x=144;x<=145;x++){for(let y=EY;y<=EY+1;y++)solid(x,y,eg);for(const ys of [[EY-3,EY-1],[EY+2,EY+4]])for(let y=ys[0];y<=ys[1];y++)solid(x,y,x===144&&y%2===0?ts:tp)}
    sky.push({x:144.6,y:EY-1.5,k:'kh_ohtower1_3',w:7,z:tWh-.05,big:1},{x:144.6,y:EY+3.5,k:'kh_ohtower1_3',w:7,z:tWh-.05,big:1});
    OH.eastGate={x:143,y:EY};
  }
  // towers along the wall
  for(let x=14;x<=136;x+=17){if(Math.abs(x-GX)<8)continue;for(const y of [4.5,145])sky.push({x,y,k:hs(x,y,3)<.5?'kh_ohtower1_2':'kh_ohtower1_3',w:5.5,z:WALL-.05,big:1})}
  for(let y=16;y<=134;y+=17){if(Math.abs(y-73)<6)continue;sky.push({x:4.5,y,k:hs(4.5,y,4)<.5?'kh_ohtower1_2':'kh_ohtower1_3',w:5.5,z:WALL-.05,big:1});sky.push({x:145,y,k:hs(145,y,4)<.5?'kh_ohtower1_2':'kh_ohtower1_3',w:5.5,z:WALL-.05,big:1})}
  for(const [x,y] of [[4.5,4.5],[145,4.5],[4.5,145],[145,145]])sky.push({x,y,k:'kh_ohtower1_3',w:9,z:WALL-.05,big:1});
  /* ---- helpers for everything that stands about ---- */
  const free=(x,y)=>x>5&&y>5&&x<144&&y<144&&rows[y][x]==='.'&&!block[y*W+x]&&!used.has(x+','+y);
  const dc=(k,x,y,o)=>{used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true},o||{}))};
  const tryDc=(k,x,y,o)=>{if(free(x,y)){dc(k,x,y,o);return true}return false};
  const walk=(k,x,y,o)=>{used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false,walk:true},o||{}))};
  const near=(x,y,rad)=>{for(let r=0;r<=rad;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(free(x+dx,y+dy))return [x+dx,y+dy]}return null};
  OH.near=near;OH.free=free;
  const person=(id,x,y,rad)=>{const kp=KH_KEEPERS[id];if(!kp)return null;const q=near(x,y,rad||3);if(!q)return null;walk(khFaceKey(kp.face),q[0],q[1],{npc:id,sc:kp.sc||1});return q};
  const pick=(arr,a,b,c)=>arr[(hs(a,b,c)*arr.length)|0];
  const P=k=>IMG['kh_'+k]?'kh_'+k:null,FOUNT=P('ohgard1_0')||'fountain',BENCH=P('ohgard1_3')||'yar_bench',ARBOUR=P('ohgard1_2'),HEDGE=P('ohgard1_1'),SUNDIAL=P('ohgard1_4'),FCART=P('ohgard1_5'),HIVES=P('ohgard2_0'),RBARREL=P('ohgard2_1'),WASH=P('ohgard2_2'),WBARROW=P('ohgard2_3'),HERBS=P('ohgard2_4');
  const art=(name,a,b,c)=>{const l=OH_ART[name].filter(([n])=>IMG[n]);return l.length?pick(l,a,b,c)[0]:null};
  const solidDc=(k,x,y,o)=>{if(k&&free(x,y)){dc(k,x,y,Object.assign({block:true,walk:false},o||{}));return true}return false}; // a tree or a plant you walk round
  const tree=(name,x,y)=>solidDc(art(name,x,y,61),x,y);
  const flowers=(x,y,sc)=>{const k=art('bed',x,y,62);if(k&&free(x,y)){used.add(x+','+y);scenery.push({k,wx:x+.5,wy:y+.5,sc:sc||1,decor:{k,walk:true,x,y}})}};
  const lamp=(x,y)=>{if(tryDc('lamp',x,y))lights.push([x,y])};
  const crowdAt=(x,y,rad,pool)=>{const aid=pick(pool||OH_CROWD,x,y,63),kp=KH_KEEPERS[aid];const q=near(x,y,rad||2);if(q&&kp)walk(khFaceKey(kp.face),q[0],q[1],{npc:aid,sc:kp.sc||1})};
  /* a hedge or a low wall round a garden, with gaps to walk in by */
  const hedge=(x0,y0,x1,y1,gaps,ch2)=>{
    const g=(x,y)=>gaps.some(([a,b])=>a===x&&b===y);
    for(let x=x0;x<=x1;x++)for(const y of [y0,y1])if(!g(x,y)&&free(x,y))solidDc(ch2||art('bush',x,y,64),x,y,{sc:1.3});
    for(let y=y0+1;y<y1;y++)for(const x of [x0,x1])if(!g(x,y)&&free(x,y))solidDc(ch2||art('bush',x,y,65),x,y,{sc:1.3});
  };
  /* ---- the castle: an inner curtain wall with corner towers, a gatehouse, and inside it lawns, gardens and the keep ---- */
  const CS=OH_CASTLE;
  {const cWh=3.6,cp=ch(TM.make('plain','castle',cWh).gid),cs=ch(TM.make('slit','castle',cWh).gid),cd=ch(TM.make('plain','castle2',cWh).gid),cw=ch(TM.make('window','castle',cWh).gid);
    for(let y=CS.y0;y<=CS.y1;y++)for(let x=CS.x0;x<=CS.x1;x++){
      const edge=x<=CS.x0+1||x>=CS.x1-1||y<=CS.y0+1||y>=CS.y1-1;
      if(!edge)continue;
      if(y>=CS.y1-1&&x>=GX-1&&x<=GX+1)continue; // the gate passage
      solid(x,y,(x+y)%5===0?cs:(x*3+y*5)%11===0?cd:cp);
    }
    setF(CS.x0+2,CS.y0+2,CS.x1-2,CS.y1-2,'2'); // the whole ward is lawn
    setF(GX-1,CS.y1-1,GX+1,CS.y1,'0');setF(GX-1,20,GX+1,CS.y1-2,'4'); // gravel from the gate to the palace
    // the keep and its two halls
    const kx0=63,kx1=85,ky0=8,ky1=19,gh=4.4,gp=ch(TM.make('plain','castle',gh).gid),gs=ch(TM.make('slit','castle',gh).gid),gw=ch(TM.make('window','castle',gh).gid);
    for(let y=ky0;y<=ky1;y++)for(let x=kx0;x<=kx1;x++)solid(x,y,y===ky1?((x%3===0)?gw:x%7===0?gs:gp):((x*5+y*3)%13===0?gs:gp));
    const pc=pch(1),pd=TM.make('gate',0,gh,'kh_ohgate1_1');T_DOORS.ohpalace=pd.tex;
    for(let x=GX-1;x<=GX+1;x++)solid(x,ky1,pc);
    lv.portals[1]={to:OH.COURT,x:17,y:27,f:0,tex:'ohpalace',req:'courtOpen',lock:'The great doors of the palace are shut. The gate-captain, Aldwyn, can tell you when the court sits.'};
    sky.push({x:GX,y:14,k:'kh_ohkeep1_0',w:34,z:gh-.3,big:1});
    for(const [x0,x1] of [[53,61],[87,95]]){ // the long halls beside the keep
      for(let y=9;y<=15;y++)for(let x=x0;x<=x1;x++)solid(x,y,y===15?(x%3===1?cw:cp):cp);
      if(IMG.kh_ohcast2_5)sky.push({x:(x0+x1+1)/2,y:12,k:'kh_ohcast2_5',w:9,z:3.6-.03,big:1});else sky.push({x:(x0+x1+1)/2,y:12,k:'kh_ohroof1_1',w:x1-x0+1.6,z:3.6-.03,big:1});
    }
    for(const [x,y,k,w] of [[CS.x0+.6,CS.y0+.6,'kh_ohtower1_3',10],[CS.x1+.6,CS.y0+.6,'kh_ohtower1_3',10],[CS.x0+.6,CS.y1+.6,'kh_ohtower1_3',10],[CS.x1+.6,CS.y1+.6,'kh_ohtower1_3',10],
      [GX-4,CS.y1+.5,'kh_ohtower1_3',8],[GX+4,CS.y1+.5,'kh_ohtower1_3',8],[kx0+1,ky1,'kh_ohtower1_0',5],[kx1,ky1,'kh_ohtower1_1',5],[kx0+1,ky0+1,'kh_ohtower1_4',4.4],[kx1,ky0+1,'kh_ohtower1_5',4.4],[CS.x0+12,CS.y0+1,'kh_ohtower1_2',5],[CS.x1-12,CS.y0+1,'kh_ohtower1_2',5],[CS.x0+.6,26,'kh_ohtower1_2',5.5],[CS.x1+.6,26,'kh_ohtower1_2',5.5]])
      sky.push({x,y,k,w,z:cWh-.05,big:1});
    // the painted gatehouse stands over the gate passage, and spires and round towers stand along the ward wall
    if(IMG.kh_ohcast2_2)sky.push({x:GX,y:CS.y1-.2,k:'kh_ohcast2_2',w:19,z:0,big:1});
    if(IMG.kh_ohcast2_6)for(const [x,y] of [[CS.x0+8,CS.y0+1],[CS.x1-8,CS.y0+1],[CS.x0+1,CS.y1-9],[CS.x1+.5,CS.y1-9]])sky.push({x,y,k:'kh_ohcast2_6',w:2.6,z:cWh-.05,big:1});
    if(IMG.kh_ohcast2_4)for(const [x,y] of [[CS.x0+.6,CS.y1-6],[CS.x1+.6,CS.y1-6],[CS.x0+.6,CS.y0+8],[CS.x1+.6,CS.y0+8]])sky.push({x,y,k:'kh_ohcast2_4',w:4.4,z:cWh-.05,big:1});
    // the gatehouse: its towers stand in the wall either side of the gate passage
    for(let y=CS.y1-1;y<=CS.y1;y++)for(const xs of [[GX-4,GX-2],[GX+2,GX+4]])for(let x=xs[0];x<=xs[1];x++)solid(x,y,ch(TM.make('plain','castle',4.4).gid));
    for(const x of [GX-2,GX+2]){tryDc('oh_banner',x,CS.y1-2)}
    /* the walled gardens of the ward */
    const wallGarden=(x0,y0,x1,y1,gap,kind)=>{
      const wl=ch(TM.make('plain','castle',1.7).gid),isG=(x,y)=>(gap[0]===x&&gap[1]===y)||(gap[2]===x&&gap[3]===y);
      for(let x=x0;x<=x1;x++)for(const y of [y0,y1])if(!isG(x,y))solid(x,y,wl);
      for(let y=y0+1;y<y1;y++)for(const x of [x0,x1])if(!isG(x,y))solid(x,y,wl);
      const cx=(x0+x1)>>1,cy=(y0+y1)>>1;
      fm[gap[1]*W+gap[0]]='4';fm[gap[3]*W+gap[2]]='4';
      // gravel cross paths
      for(let x=x0+1;x<x1;x++)fm[cy*W+x]='4';for(let y=y0+1;y<y1;y++)fm[y*W+cx]='4';
      if(kind==='rose'){
        for(let y=y0+2;y<y1-1;y+=2)for(const x of [x0+2,x1-2]){tree('bush',x,y)}
        for(let y=y0+2;y<y1-1;y+=2)for(const x of [cx-2,cx+2])if(free(x,y))flowers(x,y,1.1);
        tryDc(FOUNT,cx,cy,{block:true,walk:false});
        for(const [dx,dy] of [[-1,-2],[1,2]])tryDc(BENCH,cx+dx,cy+dy);
      }else if(kind==='cloister'){
        tryDc('oh_well',cx,cy,{block:true,walk:false});
        tree('oak',cx-3,cy-2);tree('oak',cx+3,cy+2);
        for(const [dx,dy] of [[-2,0],[2,0]])tryDc(BENCH,cx+dx,cy+dy);
        for(const x of [x0+2,x1-2])for(const y of [y0+2,y1-2])flowers(x,y,1.1);
      }else{ // a little orchard
        for(let y=y0+2;y<=y1-2;y+=3)for(let x=x0+2;x<=x1-2;x+=3){if(x===cx||y===cy)continue;tree('orchard',x,y)}
        tryDc(BENCH,cx+1,cy+1);
      }
    };
    wallGarden(54,23,69,36,[69,29,69,30],'rose');          // the rose garden, open towards the gravel walk
    wallGarden(79,23,94,36,[79,29,79,30],'cloister');      // the cloister garden
    wallGarden(53,18,60,21,[60,19,60,20],'orchard');       // little walled gardens tucked in the corners
    wallGarden(88,18,95,21,[88,19,88,20],'orchard');
    // lawn and walk: topiary along the gravel, oaks in the corners of the ward, flower beds
    for(let y=22;y<=38;y+=4){tree('topiary',GX-3,y);tree('topiary',GX+3,y)}
    for(const [x,y] of [[52,30],[96,30],[60,38],[88,38],[66,38],[82,38],[71,21],[77,21],[52,22],[96,22],[52,37],[96,37]])tree('oak',x,y);
    for(let y=21;y<=37;y+=2){flowers(GX-2,y);flowers(GX+2,y)}
    for(const x of [GX-9,GX+9])for(const y of [24,30,35])tryDc(BENCH,x,y);
    for(let y=22;y<=38;y+=4){lamp(GX-1,y+1);lamp(GX+1,y+1)}
    // the ward's people: knights, courtiers, gardeners, pages
    const wardNpc=['oh_f_knight','oh_f_knight2','oh_f_lady','oh_f_noble','oh_f_maid','oh_f_clerk','oh_f_banner','oh_f_pike'];
    for(const [x,y] of [[GX-2,21],[GX+2,21],[GX-2,38],[GX+2,38]])crowdAt(x,y,1,['oh_f_knight','oh_f_pike','oh_f_knight2']);
    for(let n=0;n<14;n++)crowdAt(54+((hs(n,1,66)*42)|0),22+((hs(n,2,66)*16)|0),3,hs(n,3,66)<.45?OH_SOLDIER:wardNpc);
  }
  /* ---- the great square before the castle: a fountain, oaks round the edge, flower beds, benches ---- */
  const SQ={x0:60,y0:43,x1:88,y1:58};
  setF(SQ.x0,SQ.y0,SQ.x1,SQ.y1,'1');setF(OH_AVE.x0,43,OH_AVE.x1,43,'1');
  dc(FOUNT,GX,51,{block:true,walk:false});
  for(const [dx,dy] of [[-3,0],[3,0],[0,-3],[0,3],[-3,-3],[3,-3],[-3,3],[3,3]])flowers(GX+dx,51+dy,1.15);
  for(const x of [SQ.x0+1,SQ.x1-1])for(const y of [45,51,57])tree('oak',x,y);
  for(const x of [66,82])for(const y of [45,57])tree('oak',x,y);
  for(const [x,y] of [[67,50],[81,50],[67,52],[81,52],[GX-5,48],[GX+5,48],[GX-5,54],[GX+5,54]])tryDc(BENCH,x,y);
  for(const [x,y] of [[SQ.x0,47],[SQ.x0,55],[SQ.x1,47],[SQ.x1,55],[GX-6,44],[GX+6,44],[GX-6,57],[GX+6,57]])lamp(x,y);
  for(const [x,y] of [[SQ.x0+3,44],[SQ.x1-3,44],[SQ.x0+3,57],[SQ.x1-3,57]])tryDc('oh_banner',x,y);
  /* ---- the king's road: cobble in the middle, lawns either side with oaks in a row, hedges and beds, crossing streets of cobble ---- */
  setF(OH_AVE.x0,59,OH_AVE.x1,143,'2');setF(OH_ROAD.x0,59,OH_ROAD.x1,143,'0');
  for(const cy of OH_CROSS)if(cy>59)setF(OH_AVE.x0,cy-.5,OH_AVE.x1,cy+.5,'0');
  const onCross=y=>OH_CROSS.some(c=>y>=c-1.5&&y<=c+1.5);
  for(let y=62;y<=140;y+=5){if(onCross(y))continue;tree('oak',71,y);tree('oak',77,y+2)}
  for(let y=64;y<=138;y+=6){if(onCross(y)||onCross(y+1))continue;flowers(69,y);flowers(79,y);if(hs(y,1,67)<.5)tryDc(BENCH,68,y+2);else tryDc(BENCH,80,y+2)}
  for(let y=61;y<=140;y+=8){if(onCross(y))continue;tree('topiary',OH_ROAD.x0-1,y);tree('topiary',OH_ROAD.x1+1,y)}
  for(let y=66;y<=140;y+=8){lamp(OH_ROAD.x0-1,y+3);lamp(OH_ROAD.x1+1,y+3)}
  for(let y=70;y<=134;y+=16){tryDc('oh_banner',OH_ROAD.x0-1,y);tryDc('oh_banner',OH_ROAD.x1+1,y+8)}
  /* ---- the blocks ---- */
  const houses=[],gardensOf=[];let nextSp=0;
  const typeOf=(i,j)=>{
    if((i===3||i===4)&&j<=2)return 'castle';
    if((i===3||i===4)&&j===3)return 'park';
    if(i===2&&j===4)return 'chapel';
    if(i===5&&j===3)return 'market';
    if(i>=5&&i<=6&&j>=5&&j<=6)return 'fair';
    const r=hs(i,j,71);
    if(j===9)return 'houses';
    if(r<.09)return 'orchard';if(r<.17)return 'garden';
    return 'houses';
  };
  // little plazas where some streets cross: the four blocks round the crossing each cut off a corner
  const notch=new Map(); // "i,j" -> {tl,tr,bl,br}
  const nt=(i,j,c)=>{const k=i+','+j;(notch.get(k)||notch.set(k,{}).get(k))[c]=1};
  for(let a=0;a<7;a++)for(let b=0;b<9;b++){
    if(a===3)continue; // the avenue is between columns 3 and 4
    if(hs(a,b,72)>.42)continue;
    if([typeOf(a,b),typeOf(a+1,b),typeOf(a,b+1),typeOf(a+1,b+1)].some(t=>t!=='houses'))continue;
    nt(a,b,'br');nt(a+1,b,'bl');nt(a,b+1,'tr');nt(a+1,b+1,'tl');
    const px=(OH_XC[a][1]+OH_XC[a+1][0])>>1,py=(OH_YR[b][1]+OH_YR[b+1][0])>>1;
    gardensOf.push({plaza:[px,py,a,b]});
  }
  const split=(len,seed)=>{ // house widths along a row, 4 to 7 squares, and where a lane goes through
    const out=[];let rest=len,n=0;
    while(rest>0){let w=4+((hs(seed,n,73)*4)|0);if(rest-w<4)w=rest;out.push(w);rest-=w;n++}
    return out;
  };
  const lanes=[];
  const addRow=(x0,x1,y0,y1,face,seed,gap)=>{ // a terrace of houses, with a lane 2 wide through it if gap is set
    const L=x1-x0+1;let parts=[[x0,x1]];
    if(gap&&L>=9){const lw=3+((hs(seed,9,73)*(L-8))|0);parts=[[x0,x0+lw-1],[x0+lw+2,x1]];lanes.push([x0+lw,y0,x0+lw+1,y1])}
    for(const [a,b] of parts){const ws=split(b-a+1,seed+a);let x=a;for(const w of ws){houses.push({x0:x,x1:x+w-1,y0,y1,face});x+=w}}
  };
  const addCol=(x0,x1,y0,y1,face,seed)=>{const hh=y1-y0+1,ws=split(hh,seed);let y=y0;for(const w of ws){houses.push({x0,x1,y0:y,y1:y+w-1,face});y+=w}};
  const lawnBlock=(b,kind)=>{
    const {x0,y0,x1,y1}=b;setF(x0,y0,x1,y1,'2');
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(hs(x,y,74)<.04)fm[y*W+x]='3';
    const cx=(x0+x1)>>1,cy=(y0+y1)>>1;
    if(kind==='orchard'){
      for(let y=y0+1;y<=y1-1;y+=3)for(let x=x0+1;x<=x1-1;x+=3)if(!(Math.abs(x-cx)<=1)&&!(Math.abs(y-cy)<=0))tree('orchard',x,y);
      for(let x=x0;x<=x1;x++)for(const y of [y0,y1])if(hs(x,y,75)<.45)tree('bush',x,y);
      if(SUNDIAL)tryDc(SUNDIAL,cx+((hs(x0,y0,91)<.5)?1:-1),cy,{block:true,walk:false});else tryDc(BENCH,cx,cy);
      if(HIVES)tryDc(HIVES,x1-1,y0+1,{block:true,walk:false});
    }else{ // a public garden: a pond or a fountain, paths, beds, an arbour and oaks
      for(let x=x0;x<=x1;x++)fm[cy*W+x]='4';for(let y=y0;y<=y1;y++)fm[y*W+cx]='4';
      if(hs(x0,y0,76)<.5)dc(FOUNT,cx,cy,{block:true,walk:false});else dc('oh_well',cx,cy,{block:true,walk:false});
      for(const [dx,dy] of [[-3,-3],[3,3],[-3,3],[3,-3]])tree(((dx+dy)&1)?'oak':'topiary',cx+dx,cy+dy);
      for(const [dx,dy] of [[-2,0],[2,0],[0,2],[0,-2]])tryDc(BENCH,cx+dx,cy+dy);
      for(let n=0;n<10;n++)flowers(x0+1+((hs(n,x0,77)*(x1-x0-1))|0),y0+1+((hs(n,y0,77)*(y1-y0-1))|0),1.1);
      if(HEDGE)for(const y of [y0,y1])for(let x=x0;x<=x1;x+=2){if(Math.abs(x-cx)<=1)continue;solidDc(HEDGE,x,y,{sc:1})}
      if(ARBOUR){tryDc(ARBOUR,cx,y0,{block:false});tryDc(ARBOUR,cx,y1,{block:false})}
      tryDc('oh_pergola',x0+2,y0+1,{block:false});
    }
    for(let n=0;n<4;n++)crowdAt(x0+2+((hs(n,x0,78)*(x1-x0-3))|0),y0+2+((hs(n,y0,78)*(y1-y0-3))|0),2);
  };
  OH_XC.forEach((XC0,i)=>OH_YR.forEach((YR0,j)=>{
    let [bx0,bx1]=XC0,[by0,by1]=YR0;
    const t=typeOf(i,j);if(t==='castle')return;
    if(i===0)bx0+=2;if(i===7)bx1-=2;if(j===0)by0+=2;if(j===9)by1-=2; // a street runs along the foot of the city wall
    const b={x0:bx0,y0:by0,x1:bx1,y1:by1};
    if(t==='park'){const x0=i===3?49:89,x1=i===3?59:99;lawnBlock({x0,x1,y0:44,y1:57},'garden');return}
    if(t==='orchard'||t==='garden'){lawnBlock(b,t);return}
    if(t==='fair'){
      if(i===5&&j===5){setF(OH_FAIR.x0,OH_FAIR.y0,OH_FAIR.x1,OH_FAIR.y1,'2');OH.fair=OH_FAIR;
        // the green stays open for the fair: oaks round the edge, a few stalls and the folk of the town
        for(let x=OH_FAIR.x0;x<=OH_FAIR.x1;x+=6){tree('oak',x,OH_FAIR.y0+1);tree('oak',x,OH_FAIR.y1-1)}
        for(let y=OH_FAIR.y0+5;y<=OH_FAIR.y1-5;y+=6){tree('oak',OH_FAIR.x0+1,y);tree('oak',OH_FAIR.x1-1,y)}
        for(let n=0;n<6;n++){const sx=106+n*4,sy=84+(n%2)*6,k='kh_stall1_'+n;if(IMG[k]&&free(sx,sy)){dc(k,sx,sy,{block:true,walk:false})}}
        for(let n=0;n<26;n++)crowdAt(OH_FAIR.x0+3+((hs(n,1,79)*(OH_FAIR.x1-OH_FAIR.x0-5))|0),OH_FAIR.y0+3+((hs(n,2,79)*(OH_FAIR.y1-OH_FAIR.y0-5))|0),2);
        for(let x=104;x<=127;x+=6)for(let y=80;y<=96;y+=8)lamp(x,y);
        if(FCART)for(const [x,y] of [[110,78],[120,92],[124,98],[105,96]])tryDc(FCART,x,y);
        if(HIVES)tryDc(HIVES,126,100);
      }
      return;
    }
    if(t==='market'){
      setF(b.x0,b.y0,b.x1,b.y1,'1');
      for(let n=0;n<8;n++){const k='kh_stall1_'+(n%6),sx=b.x0+2+(n%4)*3,sy=b.y0+2+((n/4)|0)*6;if(IMG[k]&&free(sx,sy))dc(k,sx,sy,{block:true,walk:false})}
      for(const [x,y,k] of [[b.x0+1,b.y0+4,'kh_stall2_3'],[b.x1-1,b.y0+4,'kh_stall2_0'],[b.x0+6,b.y1-1,'kh_stall2_1'],[b.x1-2,b.y1-1,'kh_stall2_2']])if(IMG[k])tryDc(k,x,y);
      dc('oh_well',(b.x0+b.x1)>>1,b.y0+4,{block:true,walk:false});
      if(FCART){tryDc(FCART,b.x0+5,b.y1-3);tryDc(FCART,b.x1-4,b.y0+8)}
      for(let x=b.x0+1;x<=b.x1;x+=4)tree('oak',x,b.y1);
      for(let n=0;n<14;n++)crowdAt(b.x0+((hs(n,1,80)*(b.x1-b.x0))|0),b.y0+((hs(n,2,80)*(b.y1-b.y0))|0),2);
      return;
    }
    if(t==='chapel'){ // the close of the chapel: a lawn with yews and oaks, the chapel in the middle
      setF(b.x0,b.y0,b.x1,b.y1,'2');
      const cw=9,cd=5,cx0=((b.x0+b.x1)>>1)-4,cy0=b.y0+5;
      houses.push({x0:cx0,x1:cx0+cw-1,y0:cy0,y1:cy0+cd-1,face:'S',chapel:1,type:'guild'});
      for(let x=b.x0;x<=b.x1;x+=3)tree('cypress',x,b.y0);
      for(const [x,y] of [[b.x0+1,b.y0+3],[b.x1-1,b.y0+3],[b.x0+1,b.y1-1],[b.x1-1,b.y1-1],[b.x0+2,b.y1-4],[b.x1-2,b.y1-4]])tree('oak',x,y);
      for(let y=cy0+cd+2;y<=b.y1-1;y+=2){flowers(cx0+2,y);flowers(cx0+cw-3,y)}
      for(const [x,y] of [[cx0-2,cy0+2],[cx0+cw+1,cy0+2]])for(let q=0;q<3;q++)tree('cypress',x,y+q*2);
      const fx=(b.x0+b.x1)>>1;setF(fx,cy0+cd,fx,b.y1,'4');setF(fx-1,cy0+cd,fx+1,cy0+cd,'4');
      for(let n=0;n<3;n++)crowdAt(fx,b.y1-3-n,2,['oh_f_monk','oh_f_friar','oh_f_lady']);
      return;
    }
    // blocks of houses: a ring round a green courtyard, or two terraces with a back lane
    const cut=notch.get(i+','+j)||{},w=bx1-bx0+1,h=by1-by0+1,seed=i*31+j*7;
    const cl=cut.tl?2:0,cr=cut.tr?2:0,bl=cut.bl?2:0,brr=cut.br?2:0;
    if(h>=10&&w>=11){
      const dN=3+(hs(i,j,81)<.4?1:0),dS=3+(hs(i,j,82)<.4?1:0),dW=3,dE=3;
      addRow(bx0+cl,bx1-cr,by0,by0+dN-1,'N',seed,true);
      addRow(bx0+bl,bx1-brr,by1-dS+1,by1,'S',seed+1,hs(i,j,85)<.5);
      addCol(bx0,bx0+dW-1,by0+dN,by1-dS,'W',seed+2);
      addCol(bx1-dE+1,bx1,by0+dN,by1-dS,'E',seed+3);
      const cx0=bx0+dW,cx1=bx1-dE+0,cy0=by0+dN,cy1=by1-dS; // the courtyard
      setF(cx0,cy0,cx1,cy1,'2');
      gardensOf.push({court:[cx0,cy0,cx1,cy1,i,j]});
    }else{
      const dN=(h-1)>>1,dS=h-1-dN;
      addRow(bx0+cl,bx1-cr,by0,by0+dN-1,'N',seed,true);
      addRow(bx0+bl,bx1-brr,by1-dS+1,by1,'S',seed+1,hs(i,j,88)<.5);
      const ly=by0+dN;setF(bx0,ly,bx1,ly,'4'); // the back lane between the terraces
      gardensOf.push({lane:[bx0,ly,bx1,ly,i,j]});
    }
  }));
  houses.forEach((h,k)=>{
    h.k=k;const w=h.x1-h.x0+1,d=h.y1-h.y0+1;h.w=(h.face==='N'||h.face==='S')?w:d;
    const dist=Math.hypot((h.x0+h.x1)/2-OH.CX,(h.y0+h.y1)/2-60),rich=dist<40||hs(h.x0,h.y0,14)<.12;
    h.type=h.type||ohPickType(h,rich,h.w);const T=OH_TYPES[h.type];
    h.wh=Math.round((T.wh[0]+hs(h.x0,h.y0,11)*(T.wh[1]-T.wh[0]))*10)/10;
    h.sty=pick(T.sty,h.x0,h.y0,12);h.rich=rich;
    const ci=(h.face==='N'||h.face==='S')?h.x0+((w-1)>>1)+(w>=6&&hs(h.x0,h.y0,13)<.5?1:0):h.y0+((d-1)>>1)+(d>=6&&hs(h.x0,h.y0,13)<.5?1:0);
    if(h.face==='N'){h.door=[ci,h.y0];h.front=[ci,h.y0-1];h.out=0;h.wall=[0,1]}
    else if(h.face==='S'){h.door=[ci,h.y1];h.front=[ci,h.y1+1];h.out=2;h.wall=[0,-1]}
    else if(h.face==='E'){h.door=[h.x1,ci];h.front=[h.x1+1,ci];h.out=1;h.wall=[-1,0]}
    else{h.door=[h.x0,ci];h.front=[h.x0-1,ci];h.out=3;h.wall=[1,0]}
  });
  // which house is which: the shops go to the lot nearest where each belongs
  const taken=new Set(),spec=[];
  const chapelH=houses.find(h=>h.chapel);
  if(chapelH){const sp=OH_SPECIAL.find(s=>s.chapel);taken.add(chapelH.k);chapelH.sp=sp;spec.push(chapelH)}
  for(const sp of OH_SPECIAL){
    if(sp.chapel)continue;
    let best=null,bd=1e9;
    for(const h of houses){if(taken.has(h.k)||h.w<5)continue;const dx=(h.x0+h.x1)/2-sp.want[0],dy=(h.y0+h.y1)/2-sp.want[1],dd=dx*dx+dy*dy;if(dd<bd){bd=dd;best=h}}
    if(best){taken.add(best.k);best.sp=sp;spec.push(best);if(best.type==='townhouse'||best.type==='cottage')best.type='timber'}
  }
  let homeN=0;
  for(const h of houses){
    h.id=h.sp&&h.sp.id?h.sp.id:OH.HOME+(homeN++);
    if(h.sp){h.name=h.sp.name;h.room=h.sp.room;h.keeper=h.sp.keeper;h.floor=h.sp.floor;h.wpat=h.sp.pat;h.scene=h.sp.scene}
    else{
      const pickS=(h.rich?OH_RICH:OH_POOR),sc=pickS[(hs(h.x0,h.y0,15)*pickS.length)|0];
      h.scene=sc;h.name=OH_SCENES[sc].n;h.room='home';h.floor=(sc==='soldier'||sc==='spartan'||sc==='potter')?'cobble':'wood';h.wpat=hs(h.x0,h.y0,16)<.7?0:1;
      const res=OH_SCENES[sc].res;h.keeper=hs(h.x0,h.y0,17)<.72?res[(hs(h.x0,h.y0,18)*res.length)|0]:null;
      if(hs(h.x0,h.y0,19)<.06)h.gold=25+((hs(h.x0,h.y0,20)*60)|0);
    }
  }
  // build the walls of each house
  for(const h of houses){
    const wh=h.wh,sty=h.sty,front=(x,y)=>h.face==='N'?y===h.y0:h.face==='S'?y===h.y1:h.face==='E'?x===h.x1:x===h.x0;
    const plain=ch(TM.make('plain',sty,wh).gid),plain2=ch(TM.make('plain2',sty,wh).gid),win=ch(TM.make(h.sp&&h.sp.room!=='prayer'?'shopfront':'window',sty,wh).gid),side=ch(TM.make('window',sty,wh).gid),side2=ch(TM.make('window2',sty,wh).gid),gwin=ch(TM.make('gwin',sty,wh).gid);
    const dtile=TM.make('door',sty,wh);
    const dgid=KH_NEXT_GID++;T_TILE[dgid]=dtile.tex;
    const mid=h.room==='inn'?[6,7]:h.room==='hall'?[5,6]:h.room==='shop'?[5,6]:h.room==='prayer'?[4,6]:[3,4];h.at={x:mid[0],y:mid[1],f:0};
    KH_DOOR[dgid]={lvl:h.id,at:h.at};
    for(let y=h.y0;y<=h.y1;y++)for(let x=h.x0;x<=h.x1;x++){
      let c;
      if(x===h.door[0]&&y===h.door[1])c=ch(dgid);
      else if(front(x,y))c=win;
      else c=((x+y)%3===0)?((x*2+y)%2?side:side2):((x*5+y*3)%5===1?gwin:(x*3+y)%4===1?plain2:plain); // windows upstairs and now and then down, so no wall is blank for long
      solid(x,y,c);
    }
    // the roof: a painted gable on top of the walls, and now and then a tower standing over the house
    const T=OH_TYPES[h.type],rk=pick(T.roofs,h.x0,h.y0,21),rimg=OH_ROOF[rk]||'kh_ohroof1_2';
    sky.push({x:(h.x0+h.x1+1)/2,y:(h.y0+h.y1+1)/2,k:rimg,w:h.w+.5,z:wh-.03});
    const tk=hs(h.x0,h.y0,22);
    if(T.tower||tk<.06)sky.push({x:(h.x0+h.x1+1)/2+(hs(h.x0,h.y0,23)-.5)*2,y:(h.y0+h.y1+1)/2,k:'kh_ohtower1_'+[0,1,4,5][(hs(h.x0,h.y0,24)*4)|0],w:2.8,z:wh-.03});
    // window boxes and tubs at the door
    if(hs(h.x0,h.y0,95)<.7){const along=(h.face==='N'||h.face==='S')?[[h.front[0]-1,h.front[1]],[h.front[0]+1,h.front[1]]]:[[h.front[0],h.front[1]-1],[h.front[0],h.front[1]+1]];
      for(const [tx,ty] of along){if(!free(tx,ty)||hs(tx,ty,96)>.6)continue;const k=hs(tx,ty,97)<.5?'yar_tub':art('box',tx,ty,98)||'yar_lavender';if(IMG[k]){used.add(tx+','+ty);scenery.push({k,wx:tx+.5,wy:ty+.5,sc:.85+hs(tx,ty,99)*.3,decor:{k,walk:true,x:tx,y:ty}})}}}
  }
  // the lanes between houses
  const lane=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(!block[y*W+x])fm[y*W+x]='4'};
  for(const [a,b,c,d] of lanes){lane(a,b,c,d);for(let x=a;x<=c;x++)for(let y=b-1;y<=d+1;y++)used.add(x+','+y)} // keep the lanes and their mouths clear
  /* ---- courtyards, back lanes and the little plazas ---- */
  for(const g of gardensOf){
    if(g.court){
      const [x0,y0,x1,y1,i,j]=g.court,cx=(x0+x1)>>1,cy=(y0+y1)>>1,kind=(hs(i,j,90)*5)|0;
      if(kind===0){tree('oak',cx,cy);for(const [dx,dy] of [[-2,1],[2,-1]])tryDc(BENCH,cx+dx,cy+dy)}
      else if(kind===1){tryDc('oh_well',cx,cy,{block:true,walk:false});for(const [dx,dy] of [[-2,-1],[2,1],[0,2]])flowers(cx+dx,cy+dy,1.15)}
      else if(kind===2){for(let y=y0;y<=y1;y+=2)for(let x=x0;x<=x1;x+=2)if(hs(x,y,91)<.6)tree('orchard',x,y)}
      else if(kind===3){tree('willow',cx,cy);for(let n=0;n<6;n++)flowers(x0+((hs(n,i,92)*(x1-x0+1))|0),y0+((hs(n,j,92)*(y1-y0+1))|0),1.1);tryDc(BENCH,cx+2,cy)}
      else{tryDc(FOUNT,cx,cy,{block:true,walk:false});for(const [dx,dy] of [[-2,0],[2,0]])tryDc('oh_topiary',cx+dx,cy+dy);for(let n=0;n<6;n++)flowers(x0+((hs(n,i,93)*(x1-x0+1))|0),y0+((hs(n,j,93)*(y1-y0+1))|0),1.1)}
      for(let x=x0;x<=x1;x++)for(const y of [y0,y1])if(hs(x,y,94)<.25)flowers(x,y);
      if(WASH&&hs(i,j,98)<.35)tryDc(WASH,x0+1,y1-1,{block:false});
      if(WBARROW&&hs(i,j,99)<.3)tryDc(WBARROW,x1-1,y1-1,{block:false});
      if(RBARREL&&hs(i,j,100)<.4)tryDc(RBARREL,x1,y0+1,{block:false});
      if(HERBS&&hs(i,j,101)<.3)tryDc(HERBS,x0+1,y0+1,{block:false});
      for(let n=0;n<3;n++)crowdAt(cx+((hs(n,i,96)*5-2)|0),cy+((hs(n,j,96)*4-2)|0),2);
    }else if(g.lane){
      const [x0,y,x1,,i,j]=g.lane;for(let x=x0+1;x<x1;x+=4)if(hs(x,j,89)<.55)flowers(x,y,1)
      tryDc('yar_tub',x0+((x1-x0)>>1),y);
    }else if(g.plaza){
      const [px,py]=g.plaza;
      // the plaza: a well or a great oak, benches and beds on the cut corners, lamps
      const x0=px-2,x1=px+3,y0=py-3,y1=py+4;setF(x0,y0,x1,y1,'1');
      if(hs(px,py,97)<.5)tree('oak',px-2,py-3);else dc('oh_well',px-2,py-2,{block:true,walk:false});
      tree('oak',px+3,py+4);
      for(const [x,y] of [[px-2,py+3],[px+3,py-3]])tryDc(BENCH,x,y);
      flowers(px-2,py+4,1.1);flowers(px+3,py-2,1.1);
      crowdAt(px,py,2);crowdAt(px+1,py+1,2);
    }
  }
  /* ---- lamps along every street ---- */
  const inCastle=(x,y)=>x>=CS.x0&&x<=CS.x1&&y<=CS.y1;
  for(const cy of OH_CROSS)for(let x=9+((cy*3)|0)%5;x<=141;x+=8){if(x>=OH_AVE.x0-1&&x<=OH_AVE.x1+1)continue;lamp(x,Math.floor(cy-.5))}
  for(const cx of [17.5,32.5,47.5,65.5,82.5,100.5,115.5,130.5])for(let y=12+(((cx*3)|0)%5);y<=140;y+=8)if(!inCastle(cx|0,y))lamp(Math.floor(cx-.5),y);
  /* ---- the gate: the king's road starts in a small square of its own, with the guards ---- */
  setF(66,135,82,143,'1');setF(GX-1,135,GX+1,143,'0');
  for(const [x,y] of [[GX-3,139],[GX+3,139]])for(const q of [0,2,4])tryDc('oh_banner',x,y-q*1.0|0);
  for(const [id,x,y] of [['oh_g1',GX-3,140],['oh_g2',GX+3,140]])person(id,x,y,2);
  for(const x of [GX-4,GX+4])for(const y of [136,142])tree('topiary',x,y);
  /* ---- the east road: out of the east gate and across the city to the fair green ---- */
  setF(OH_FAIR.x1+1,73,143,74,'4');
  /* ---- the named people: the gate, the square and the doors of the palace ---- */
  const named=[['oh_cap',GX,22],['oh_guardA',GX-3,20],['oh_guardB',GX+3,20],['oh_m1',66,50],['oh_m2',82,50],['oh_w1',64,52],['oh_w2',72,56],['oh_k1',76,56],['oh_o1',84,56],['oh_s1',68,47],['oh_pr',80,48]];
  for(const [id,x,y] of named)person(id,x,y,5);
  // the king's road is lined with a few guards, not a regiment
  let sn=0;
  for(let y=70;y<=134;y+=14){for(const sx of [OH_ROAD.x0,OH_ROAD.x1]){const id=OH_SOLDIER[(sn++)%OH_SOLDIER.length],kp=KH_KEEPERS[id];if(free(sx,y)&&kp)walk(khFaceKey(kp.face),sx,y,{npc:id,sc:kp.sc})}}
  // people in the streets and the square
  for(let n=0;n<54;n++){const x=60+((hs(n,1,40)*29)|0),y=44+((hs(n,2,40)*14)|0);if(Math.abs(x-GX)<2&&Math.abs(y-51)<2)continue;crowdAt(x,y,2,hs(n,3,40)<.18?OH_SOLDIER:OH_CROWD)}
  for(let n=0;n<190;n++){const x=8+((hs(n,1,41)*134)|0),y=8+((hs(n,2,41)*134)|0);if(inCastle(x,y))continue;
    const q=free(x,y)?[x,y]:near(x,y,1);if(!q)continue;const arr=hs(n,3,41)<.12?OH_SOLDIER:OH_CROWD,aid=arr[(hs(n,4,41)*arr.length)|0],kp=KH_KEEPERS[aid];walk(khFaceKey(kp.face),q[0],q[1],{npc:aid,sc:kp.sc})}
  // signs on the shops
  const KNAME={oh_bath:'Marta, bath keeper',oh_inn:'Wynn, innkeeper',oh_smith:'Bram, smith',oh_apoth:'Maud, apothecary',oh_priest:'Sister Margery',oh_armour:'Ser Gawen',oh_bakery:'Hild, baker',oh_scrolls:'Osbern, scribe',oh_pack:'Tilda',oh_inn2:'Dame Hester',oh_cookshop:'Pol',oh_sergeant:'Sergeant Cade',oh_herbs:'Old Ysolt',oh_tailor:'Fenwick'};
  for(const h of spec){
    const horizontal=h.face==='N'||h.face==='S',sx=horizontal?h.front[0]+1:h.front[0],sy=horizontal?h.front[1]:h.front[1]+1;
    const spot=(rows[sy]&&rows[sy][sx]==='.'&&!used.has(sx+','+sy))?[sx,sy]:h.front;
    decor.push({k:'sign_'+h.keeper,x:spot[0],y:spot[1],block:false,wd:h.wall,txt:[h.name.toUpperCase(),KNAME[h.keeper]||'']});
  }
  // the streets are not one cobble: moss in the damp corners, stains, bare earth, grass at the foot of the walls
  for(let y=6;y<144;y++)for(let x=6;x<144;x++){const i=y*W+x;if(fm[i]==='2'&&tsmooth(x/4.5,y/4.5,95)>.64){fm[i]='5';continue} // flowering meadow in patches on the lawns
    if(block[i]||fm[i]!=='0')continue;
    const n=tsmooth(x/6,y/6,91),m=tsmooth(x/2.5,y/2.5,92),r=hs(x,y,93);
    if(n>.72&&m>.4)fm[i]='3';else if(r<.012)fm[i]='4';
    else if((block[i-1]||block[i+1]||block[i-W]||block[i+W])&&m>.62&&r<.35)fm[i]='2';
  }
  /* ---- finish the level, the rooms behind the doors, and the doors of the gate ---- */
  lv.rows=rows.map(r=>r.join(''));
  const fmap=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmap.push(s)}lv.fmap=fmap;
  lv.mapNames=[{t:'Castle of King Osric',x:OH.CX,y:14,k:'place'},{t:'The Castle Ward',x:OH.CX,y:30,k:'place'},{t:'The Great Square',x:OH.CX,y:51,k:'place'},{t:"King's Road",x:OH.CX,y:100,k:'lane'},{t:'Portcullis Gate',x:OH.CX,y:141,k:'place'},
    {t:'Old Town',x:26,y:70,k:'place'},{t:'Market Square',x:108,y:51,k:'place'},{t:'Fair Green',x:115,y:88,k:'place'},{t:'Chapel Close',x:40,y:66,k:'place'},{t:'East Road',x:134,y:73,k:'lane'},{t:'Garrison Quarter',x:26,y:112,k:'place'},{t:'Lantern Street',x:26,y:25,k:'lane'},{t:'Smiths Quarter',x:122,y:112,k:'place'}];
  for(const h of houses){
    const id=h.id;LEVEL_NAMES[id]=h.name;
    KH_LAZY[id]=()=>{
      if(LEVELS[id])return;
      const b={id:'oh'+h.k,name:h.name,room:h.room,keeper:h.keeper,scene:h.scene,gold:h.gold,wallImg:'kh_ohwall1_'+h.wpat,floor:h.floor};
      const R=khRoom(b,id,{to:OH.ID,x:h.front[0],y:h.front[1],f:h.out});LEVELS[id]=R.level;LEVEL_NAMES[id]=h.name;
    };
  }
  OH.houses=houses;
  LEVELS[OH.ID]=lv;LEVEL_NAMES[OH.ID]='Oldhaven';
  {const hh=new Float32Array(N).fill(.3),rk=new Float32Array(N);TERRS[OH.ID]=yarTerrain(W,H,hh,rk,block)} // flat ground under a real sky
  const q4=LEVELS[304];if(q4)lv.portals[2].x=q4.start.x,lv.portals[2].y=q4.start.y;
}
KH_LAZY[OH.ID]=()=>{seaBuild(304);ohBuild()};LEVEL_NAMES[OH.ID]='Oldhaven';
for(let i=0;i<OH_SPECIAL.length+640;i++){const id=i<4?OH.ROOM+i:OH.HOME+i-4,stub=()=>{seaBuild(304);ohBuild();if(!LEVELS[id]&&KH_LAZY[id]&&KH_LAZY[id]!==stub)KH_LAZY[id]()};KH_LAZY[id]=stub}
for(const sp of OH_SPECIAL)if(sp.id)LEVEL_NAMES[sp.id]=sp.name;
/* ---- the court: a long hall of grey stone, the king and queen on their thrones, and the whole household of the Crown ---- */
function ohBuildCourt(){
  ohAlias();
  const W=35,H=30,g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('w'));
  for(let y=1;y<=H-3;y++)for(let x=1;x<=W-2;x++)g[y][x]='.';
  g[H-1][17]='0';g[H-2][17]='.';
  const rows=g.map(r=>r.join(''));
  const decor=[],put=(role,x,y,o)=>{const k=khProp(role);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH(role);decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}))};
  const raw=(k,x,y,o)=>decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true},o||{}));
  const npc=(id,k,x,y,o)=>decor.push(Object.assign({k,x,y,block:false,walk:true,npc:id,sc:1},o||{}));
  const arch=(id,x,y)=>{const f=OH_FOLKBY[id];npc(id,f.face,x,y,{sc:f.sc})};
  // the dais and the back wall
  put('throne',17,2);put('throne',20,2);
  for(const x of [4,8,12,24,28,31])raw('oh_banner',x,2);
  for(const x of [6,10,14,22,26,30])put('banner',x,2);
  for(const x of [5,29])for(const y of [6,14,22])put('statue',x,y);
  for(const [x,y] of [[9,9],[25,9],[9,17],[25,17],[14,23],[20,23]])put('brazier',x,y);
  for(const x of [2,32])for(const y of [5,10,15,20])raw('oh_banner',x,y);
  for(const x of [3,31])for(const y of [8,12,18,25])put('candle',x,y);
  put('desk',7,8);put('table',27,19);put('chair',26,19);put('chair',28,19);put('table',8,20);put('chair',7,20);put('chair',9,20);
  raw('oh_barrel',31,26);raw('oh_barrel',3,26);raw('oh_rack',3,22);raw('oh_rack',31,22);
  // the royal household
  npc('oh_king','yar_p_osric',17,3);npc('oh_queen','kh_ohcourt1_1',20,3);
  npc('oh_vance','yar_p_vance',14,4);
  npc('oh_treas','kh_ohcourt1_2',23,4);npc('oh_wiz','kh_ohcourt1_3',26,4);npc('oh_bishop','kh_ohcourt1_5',11,4);npc('oh_jest','kh_ohcourt1_4',17,8);
  npc('oh_halb','mayor',22,10);
  npc('oh_phys','kh_ohfolk1_4',28,10);npc('oh_scribe','kh_ohfolk2_4',7,9);npc('oh_armrer','kh_ohfolk1_0',29,16);
  npc('oh_lord1','kh_ohfolk1_2',12,12);npc('oh_lady1','kh_ohfolk1_3',23,13);npc('oh_lady2','kh_ohfolk1_3',11,15);npc('oh_lord2','kh_ohfolk1_2',24,16);
  npc('oh_maid','kh_ohfolk2_5',27,20);npc('oh_cookc','kh_ohfolk2_2',31,24);
  npc('oh_herald','kh_ohsold1_5',17,23);
  for(const [x,y] of [[6,3],[28,3]])arch('oh_f_banner',x,y);
  for(const [x,y] of [[9,3],[25,3]])arch('oh_f_knight',x,y);
  for(const [x,y] of [[13,9],[21,9],[13,15],[21,15],[13,21],[21,21]])arch(((x+y)&1)?'oh_f_knight2':'oh_f_knight',x,y);
  for(const y of [7,11,15,19,23]){arch('oh_f_pike',3,y);arch('oh_f_pike',31,y)}
  for(const [x,y] of [[15,26],[19,26]])arch('oh_f_xbow',x,y);
  // a red carpet from the doors to the thrones, and a stone dais
  const fmap=rows.map((r,y)=>[...r].map((c,x)=>c==='w'?'0':((x>=16&&x<=18&&y>=3)||(y>=2&&y<=3&&x>=12&&x<=22))?'1':'0').join(''));
  return {rows,fmap,start:{x:17,y:H-3,f:0},decor,lights:[[8,4],[17,5],[26,4],[8,10],[26,10],[8,16],[26,16],[17,12],[17,18],[8,22],[26,22],[17,25]]};
}
KH_LAZY[OH.COURT]=()=>{
  if(LEVELS[OH.COURT])return;const c=ohBuildCourt(),wg=khInteriorWall('palace','kh_ohwall1_0');
  LEVELS[OH.COURT]={rows:c.rows,fmap:c.fmap,floorSet:['cobble','carpet','pale','dirt','mosscobble','stainedcobble'],start:c.start,enemies:[],items:[],decor:c.decor,day:0,amb:.8,floor:'cobble',ceil:'beam',name:'The Court of King Osric',label:'Royal Court',lights:c.lights,ceilH:2.2,
    portals:[{to:OH.ID,x:OH.CX,y:41,f:2,tex:'tgate'}],diff:25,noExtras:true,chars:wg?{w:wg}:undefined};
  LEVEL_NAMES[OH.COURT]='The Court of King Osric';
};
LEVEL_NAMES[OH.COURT]='The Court of King Osric';
/* ---- shops and keepers of the new doors ---- */
khShop('oh_armour','Ser Gawen, the armourer','kh_ohsold1_2',"The Armourer's Yard",'Helms, shields and mail, hammered on the premises. Ser Gawen retired from the Gate to make things that stop swords instead of meeting them.','armour');
khShop('oh_bakery','Hild, the baker','kh_ohfolk1_1',"The King's Bakery",'Fresh rolls, pies and cheese. The king has one roll a day, and the garrison has the rest, so there is always plenty.','food');
khShop('oh_scrolls','Osbern, the scribe','kh_ohfolk2_4','The Scroll House','Scrolls of fire, frost and light, written in a very clear hand. I do not do lettering for the chancellor any more.','scroll');
khShop('oh_pack','Tilda, of Pack and Lantern','kh_ohfolk1_5','Pack and Lantern','Torches, lanterns, rope and travelling food. Everything a party needs and nothing it does not.','general');
khShop('oh_cookshop','Pol, the cook','kh_ohfolk2_2','The Cookshop','Stew, roast and pie by the bowl, and bread by the loaf. It is all good and all hot, and the soldiers eat first.','food');
khShop('oh_herbs','Old Ysolt, the herbwife','kh_ohfolk2_0',"The Herbwife's Cottage",'Herbs, salves and tinctures, brewed in my own kitchen and tested on my own cat. He is very well.','potion');
khShop('oh_tailor','Fenwick, the tailor','kh_ohfolk1_2','The Glover and Tailor','Gloves, jerkins and mail shirts for the less gallant. Whatever you need under armour, I can make.','armour');
khInn('oh_inn2','Dame Hester, of the Gilded Lance','kh_ohfolk2_5','The Gilded Lance',35,'The Gilded Lance. Soft beds, a great fire and a ceiling the knights cannot hit with their helmets. A room is 35 gold, and breakfast is on the house.');
khNpc('oh_sergeant','Sergeant Cade, of the garrison','kh_ohsold1_0',()=>say('This is the garrison hall. Two hundred men, one stove, and a rule about boots. If you want a job, ask the gate-captain. If you want a bed, try the King\'s Rest.',[BYE]),{sc:1.08});
/* ---- the household of the Crown ---- */
const ohSay=(id,n,face,a,b)=>khNpc(id,n,face,()=>say(G.flags.pardoned&&b?b:a,[BYE]));
ohSay('oh_queen','Queen Elowen','kh_ohcourt1_1',"I have sat at his side for thirty years, and I have never seen my husband look at a page the way he looks at the one in your hand. Let him read. Let him read it all.","The king is himself again, and I have my husband back. Whatever you ask of us, ask it quickly, before he decides to give you the whole kingdom.");
ohSay('oh_treas','Lord Treasurer Pell','kh_ohcourt1_2',"The tolls are in my books, and my books are in order. That is the difficulty. In this kingdom everything is always in order.","The accounts will be rewritten from the first page. It will take me the rest of my life, and I am delighted.");
ohSay('oh_wiz','Ismar, the court wizard','kh_ohcourt1_3',"I have been watching the chancellor for a year, through a very small window. It is a very small window. I regret nothing.","Magic cannot read a man's heart. A ledger can. I have underestimated paper all my life.");
ohSay('oh_bishop','Bishop Aldous','kh_ohcourt1_5',"Truth is a heavy thing, and very few people can lift it. Stand aside, and let the old king try.","Mercy is an easier thing to say than to do. I think the king will manage both, today.");
ohSay('oh_jest',"Pip, the king's fool",'kh_ohcourt1_4',"A fool sees a great deal. I see that the chancellor has stopped smiling at me, which is the first real warning I have had this year.","I told the king the truth in a joke for twenty years, and he laughed every time. Today he finally heard it. I may retire.");
ohSay('oh_phys','Brother Aldric, the physician','kh_ohfolk1_4',"His majesty is not ill. His majesty is tired. There is no tincture for that, and I have tried them all.","The king slept all night. Nobody in the palace can remember the last time.");
ohSay('oh_scribe',"Master Quillon, the king's scribe",'kh_ohfolk2_4',"I wrote the warrant against you, and I did not like the word forger. I wrote it anyway. The chancellor stood behind my chair.","I have begun a very long letter of apology. I am on page nine.");
ohSay('oh_armrer','Hale, the royal armourer','kh_ohfolk1_0',"Armour for the household, polish for the knights, and silence for the gentry. That is my whole trade.","I made Vance's chain of office. I may offer to melt it down.");
ohSay('oh_lord1','Lord Harrow','kh_ohfolk1_2',"There are rumours in the hall. I never listen to rumours. I only repeat them, so that they may be corrected.","I always said the chancellor was a rogue. Mostly quietly. To my dog.");
ohSay('oh_lord2','Lord Wexcombe','kh_ohfolk1_2',"The ledger. The ledger? The ledger! How remarkable. I would have asked for a chair.","I shall remember this day as the day I was entirely right.");
ohSay('oh_lady1','Lady Brisa','kh_ohfolk1_3',"Do not be frightened. The court is much worse than it looks. Stand up straight and say what you carry.","What a morning. I do believe my veil is crooked.");
ohSay('oh_lady2','Lady Hawise','kh_ohfolk1_3',"They say you came on a ship with a gull on the front. I find that delightful and rather suspicious.","I shall have the dressmaker make a gown for the occasion. Something with a gull.");
ohSay('oh_maid','A serving maid','kh_ohfolk2_5',"Wine for the king, wine for the queen, wine for the chancellor. I have been told not to spill, and I am trying so hard.","Nobody has dropped a tray all morning. It is a miracle, or a warning.");
ohSay('oh_cookc','The castle cook','kh_ohfolk2_2',"There is a roast for the feast, and no one to eat it. The court has lost its appetite. I am furious.","The feast will go ahead after all. I have not slept, and I am unbelievably happy.");
ohSay('oh_herald',"The king's herald",'kh_ohsold1_5',"All stand for King Osric! And for his lady! And for his chancellor. Somebody must.","Hear ye! The warrant is void! I have wanted to shout that for a week.");
/* ---- people ---- */
khNpc('oh_cap','Captain Aldwyn, of the Gate','yar_p_aldwyn',()=>{
  const F=G.flags;
  if(F.pardoned)return say('The warrant is void, and I am glad of it. I have never liked being told to chase honest people. The court is open to you.',[BYE]);
  if(F.courtOpen)return say('The court is sitting. Go in. Say your piece, and let the king read what you carry.',[BYE]);
  if(qSt('vq4')!=='done')return say('The court sits at noon, and not for armed strangers with a price on their heads. If you carry something the king should read, go and get it first.',[BYE]);
  return say('The court sits at noon. Armed parties are not admitted. But I hear there is a ledger, and a scribe called Isolde. Is it true you have it?',[['We have the master ledger, whole, in Isolde\'s hand.',()=>{F.courtOpen=1;return say('Then the king will want to see it, whatever Chancellor Vance says. Go in. The doors are open. I have not seen you, and I never saw you on the quay, and I will stand outside the door with my halberd and listen.',[BYE])}],['Not yet.',()=>null]])
},{q:'vq6'});
khNpc('oh_guardA','A royal guard','yar_p_rguard',()=>say('Eyes front. The gate-captain talks to petitioners. I just keep the door.',[BYE]));
khNpc('oh_guardB','A royal guard','yar_p_rguard',()=>say('If you are the four from the quay, keep your hands where I can see them. I am told to be polite. I do not always do what I am told.',[BYE]));
khNpc('oh_g1','A gate guard','kh_ohsold1_0',()=>say('Oldhaven. Walk, do not run, and do not draw anything in the street.',[BYE]));
khNpc('oh_g2','A gate guard','kh_ohsold1_1',()=>say('Twenty thousand crowns a head. I could have a very nice house. I could. Please do not make this difficult.',[BYE]));
khNpc('oh_m1','A merchant','kh_ohfolk1_2',()=>say(G.flags.pardoned?'Is it true? The king tore up the warrant in open court? Then the world is round after all. I have been selling lamp oil to the watch for years, and I never liked their faces.':'The whole city is talking about four strangers. A ransom! I would not mind five minutes in a back room with them. For the reward, you understand.',[BYE]));
khNpc('oh_m2','A baker','kh_ohfolk1_1',()=>say('Fresh rolls. Not for sale to anyone on the king\'s list. Which is everyone this week, apparently.',[BYE]));
khNpc('oh_w1','A fishwife','kh_ohfolk2_0',()=>say('The chancellor has been buying silence in this city for years. Everyone knows. Nobody says. Here, in the lane, anyone can say anything, because it is all very quiet.',[BYE]));
khNpc('oh_w2','A porter','kh_ohfolk1_0',()=>say('The king is old, and the chancellor is clever. That is all you need to know about Oldhaven.',[BYE]));
khNpc('oh_k1','A child','kh_ohfolk1_5',()=>say('Is it true that the Dawn Walker has a gull figurehead? My brother says it has a lady. I say it is a gull.',[BYE]));
khNpc('oh_o1','An old soldier','kh_ohsold1_3',()=>say('Osric was a good king, once. The old kind, who knew the names of his captains. Then he grew tired, and let the clever ones sign for him.',[BYE]));
khNpc('oh_s1','A city scribe','kh_ohfolk2_4',()=>say('I keep the court roll. Today the chancellor ordered the roll closed to the public. I have never heard that order before. I find it interesting.',[BYE]));
khNpc('oh_pr','A brother of the chapel','kh_ohfolk1_4',()=>say('Oldhaven has a chapel for every kind of sinner. Mine is for the tired ones.',[BYE]));
khShop('oh_shop1','Bram, the smith','smith',"Oldhaven Arms",'Steel, oil and a hot fire. Whatever the court says about you, steel does not ask.','arms');
khShop('oh_shop2','Hester, the grocer','merchant','The King\'s Larder','Bread, cheese and travelling food. The king\'s crest on the barrel makes it taste better.','food');
khInn('oh_inn','Wynn, innkeeper of the King\'s Rest','innkeeper','The King\'s Rest',30,'The King\'s Rest. Clean beds, hot water, a fire, and no questions. A room is 30 gold, and the soup is free.');
khShop('oh_smith','Bram, at the Oldhaven Arms','kh_ohfolk1_0','Oldhaven Arms','Swords, axes and plate. All of it made in the shop behind me.','arms');
khShop('oh_apoth','Maud, the apothecary','kh_ohfolk1_3','The Apothecary','Draughts for the body and tinctures for the mind. Tell me what ails you.','potion');
khNpc('oh_priest','Sister Margery, of the Chapel','priest',()=>say('Saint Brannoch watched over travellers. I watch over the ones who return. Would you like a blessing before you go to the court?',[['Ask for a blessing.',()=>{try{afflCure('cursed',-1,true)}catch(e){}msg('A calm settles on the party.','#a8d8ff');return say('Go with grace.',[BYE])}],BYE]));
khNpc('oh_king','King Osric','yar_p_osric',()=>say(G.flags.pardoned?'You have done me and my kingdom a greater service than any lord of mine. Six names remain in that ledger. Find them, and tell nobody but me.':'Speak, since you came such a long way.',[BYE]));
khNpc('oh_vance','Chancellor Vance','yar_p_vance',()=>say('Majesty, they are lying, as every forger does.',[BYE]));
khNpc('oh_halb','Mayor Halbrecht','mayor',()=>say(G.flags.pardoned?'The king has taken me for a liar. A pity. I was so good at it.':'The ledger is a forgery, your majesty! Do not listen!',[BYE]));
/* ---- the noon gate on the quay, the court, and the end ---- */
function ohWaitNoon(){const m=G.clock%1440;if(m<720)G.clock+=720-m;G.flags.oldhavenOpen=1;msg('Noon bells ring over Oldhaven. The gate on the quay swings open.','#ffe36a');sfx('level')}
(function(){
  const n=NPCS.oh_herald;if(!n||n._wn)return;n._wn=1;
  n.root=()=>{
    const F=G.flags;
    if(F.oldhavenOpen||F.pardoned)return say('The gate stands open. Walk, do not run.',[BYE]);
    return say('The king\'s court meets at noon. The gate is barred until the bells ring. Wait on the quay and do not touch your swords.',[['Wait for noon.',()=>{ohWaitNoon();return say('You wait on the stones while the harbour goes about its business around you. Then the noon bells ring, and the gate groans open.',[BYE])}],['Not yet.',()=>null]]);
  };
})();
Object.assign(CUTS,{
 oldhavenCourt:()=>[
  {text:'The great doors of the Court of Oldhaven open on a long hall of pale stone and blue banners. King Osric sits on a plain silver throne, older than the portraits of him. Chancellor Vance, the king’s chief minister, who keeps the royal seal, stands at his right hand, smiling, with a scroll in his ink-stained fingers. Mayor Halbrecht of Ironhill waits in chains by the dais.'},
  {who:'King Osric',text:'So these are the four forgers. I am told you came a very long way to be hanged.'},
  {who:hn(0),text:'We came to be heard, majesty. We carry the master ledger: the account Lord Corvane kept of every toll he took in your name, written out by his own scribe, Isolde.'},
  {who:'Chancellor Vance',text:'Majesty, the scribe Isolde is a thief who fled this court with the king’s silver. Whatever these people carry was written by a liar. They are the forgers, and the warrant says so.'},
  {who:hn(1),text:'The warrant is the forgery, majesty. Lord Corvane, your Warden of the Narrow Sea, charged tolls in your name and kept the silver. When we uncovered the crooked mayors on your western road, he sent a warrant against us under your seal: twenty thousand crowns on each of our heads.'},
  {who:'King Osric',text:'Corvane is dead?'},
  {who:hn(2),text:'He died on an island at the end of the Narrow Sea, sword in hand, with the third page of the ledger in the altar at his back.'},
  {text:'The king takes the ledger. The court is silent as he turns the pages. His hands are steady until the last one.'},
  {who:'King Osric',text:'Every toll, every year. And at the foot of the last page, in Corvane’s own hand: "V. keeps the seal. V. gives the word. V. is paid first." My chancellor is Vance. Vance keeps my seal.'},
  {who:'Chancellor Vance',text:'A forger’s fancy, majesty! Guards! These people have come to murder the king! Seize them!'},
  {text:'Silver armour rings on stone. The guards at the doors draw their swords, and Vance throws off his chain of office. In his chains, Halbrecht begins to laugh.'},
  {who:'King Osric',text:'Guards of the Crown, to me! Those who stand with Vance, die with him!'}
 ],
 oldhavenPardon:()=>[
  {text:'Vance falls on the steps of the dais, and the hall goes quiet. The guards who stood with him lower their swords one by one.'},
  {who:'King Osric',text:'For twenty years I have trusted the wrong man with my seal. And four people I called forgers have shown me.'},
  {who:'King Osric',text:'Hear it, all of you. The warrant against these four carried my seal, but I never signed it. Vance kept my seal, and Corvane wrote my name. A warrant I did not write is no warrant of mine. By my crown it is void, and the ransom on their heads is lifted. Let it be read in every town from Oldhaven to Thornwick. And let Mayor Halbrecht of Ironhill see the inside of the gaol he built for honest people.'},
  {who:'Mayor Halbrecht',text:'Majesty, I only did what I was told!'},
  {who:'King Osric',text:'Yes. That is what is wrong with you.'},
  {who:hn(0),text:'We ask nothing, majesty, except to walk our own road without a price on it.'},
  {who:'King Osric',text:'Then it is yours. But hear me. Vance and Corvane did not do this alone. In the margin of the ledger there are six more names: six people, at my court and in my city, who took Corvane’s silver or carried Vance’s orders. Corvane was not the only man who wrote letters. Six others wrote them too, and the ledger holds every one.'},
  {who:'King Osric',text:'I do not know which of my own court I can trust. You are strangers, you owe this city nothing, and you have already shown you can read a ledger. Find the six. Quietly. Ask nothing the first time.'},
  {text:'The king hands the party a slip of paper with six lines on it. Each is only a title and a nickname. On the table behind him, Ishkander’s letter lies open, its seal unbroken. The road home is clear. The road onward is a list of six.'}
 ]
});
function ohCourtFight(){
  const F=G.flags;F.courtFight=1;
  const v=G.decor.find(d=>d.npc==='oh_vance');if(v)v.hidden=true;
  seaSpawn('chancellor',3,true);for(let i=0;i<4;i++)seaSpawn('rguard',5,true);
  msg('Chancellor Vance draws a sword from under his robe.','#ff8a7a');
}
function oldhavenPardon(){
  const F=G.flags;if(F.pardoned)return;F.pardoned=1;F.wanted=0;
  for(const e of G.enemies)if(e.t==='rguard'&&e.hp>0){e.hp=0;e.dying=.55}
  const hb=G.decor.find(d=>d.npc==='oh_halb');if(hb)hb.hidden=true;
  startCut('oldhavenPardon',()=>{if(qSt('vq6')===null)qAccept('vq6');if(qReady('vq6'))qTurnIn('vq6');msg('The warrant is void. The ransom is lifted.','#ffe36a');sfx('win')});
}
function ohEnter(n){
  const F=G.flags;
  if(n===OH.COURT){
    const k=G.decor.find(d=>d.npc==='oh_halb');if(k&&F.pardoned)k.hidden=true;const v=G.decor.find(d=>d.npc==='oh_vance');if(v&&(F.courtFight))v.hidden=true;
    if(!F.courtSeen){F.courtSeen=1;if(qSt('vq6')===null)qAccept('vq6');startCut('oldhavenCourt',ohCourtFight)}
  }
}
/* the ledger names its master from the first page, so the court is not a surprise: V., someone close to the king */
const QNOTE={
  vq2:'The first page of the ledger: tolls, each signed off by the Warden of the Narrow Sea, Lord Corvane. In the margin beside every large payment there is one letter: V.',
  vq3:'The second page: more tolls, and a list of marines paid to hunt you. In the margin: “V. has sealed the warrant. V. says send the knives.”',
  vq4:'The third page, in Corvane’s own hand: “V. keeps the seal. V. gives the word. V. is paid first.” Whoever V. is, he sits very close to the king.'
};
QUESTS.vq5.desc+=' The pages name Corvane’s master only as “V.”, someone close to the king, so the ledger must go into King Osric’s own hands and no one else’s.';
