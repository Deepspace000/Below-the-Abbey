/* ==========================================================================
   THE WANDERERS. Fifteen strange creatures that turn up on any level without warning, each with a legend, a picture and an attack
   picture. Nine of them have a favour to ask (and so start a quest); six simply hunt, and one of those, the Messenger of Death, is
   the rarest and the worst: he hides the five letters of his name on the walls of a level, and when the party has read all five,
   the party is dead. The pictures are assets/ds_w_<id>.png (idle) and ds_w_<id>A.png (attacking); the Messenger is ds_messenger.
   The Wanderers menu (in the main menu) shows every one the party has met, with its picture, its legend and its stats.
   ========================================================================== */
const WANDERERS=[
  {id:'messenger',img:'messenger',n:'The Messenger of Death',h:1.45,iw:168,ih:420,hp:70,dmg:[10,16],hit:.8,xp:2500,gold:[0,0],speed:1,mode:'death',above:5,
   note:'Always five levels above the party. Rare: one level in twenty-five.',
   legend:'He is older than the letters he hides. They say that when a man is born, the Messenger takes the first letter of his death and writes it on a wall somewhere he has yet to walk. He will not hurt you. He does not need to. He only wants to be seen walking away, and for you to read what he has written.'},
  {id:'ferryman',n:'The Ferryman of Dust',h:1.25,iw:212,ih:400,hp:60,dmg:[7,12],hit:.78,xp:900,gold:[40,90],speed:1,mode:'quest',
   legend:'Before there were roads there were rivers, and before the rivers dried the Ferryman carried the dead across. The rivers are dust now. He still poles through the dust with his blue lantern, looking for a crossing, and he is always, always late.'},
  {id:'mossback',n:'Mother Mossback',h:1.0,iw:320,ih:400,hp:140,dmg:[6,10],hit:.7,xp:1000,gold:[0,0],speed:1,mode:'quest',
   legend:'Mother Mossback was old when the abbey was a hill. A hermit built a hut on her shell and died in it three hundred years ago, and the tree on her back grew from his walking stick. She is slow, patient, and, if you ask nicely, very fond of apples.'},
  {id:'candleknight',n:'Sir Wick, the Candle Knight',h:1.1,iw:195,ih:400,hp:75,dmg:[8,13],hit:.76,xp:1100,gold:[30,80],speed:1,mode:'fight',above:1,magic:1,
   legend:'Sir Wick lost his head in a duel he had won. A priest, ashamed, set a candle on his neck to light him home, and it has never gone out. He still looks for the man who beat him and cannot understand why nobody will duel him. He burns a little shorter every year.'},
  {id:'glassstag',n:'The Glass Stag',h:1.0,iw:241,ih:400,hp:55,dmg:[8,13],hit:.78,xp:1100,gold:[0,0],speed:2,mode:'fight',above:1,magic:1,
   legend:'A stag of living crystal, said to be what is left when a forest is struck by lightning twice. It sees straight through you. It is shy, fast and sharp, and where it dies it leaves a field of glittering shards.'},
  {id:'marrow',n:'Aunt Marrow',h:1.3,iw:163,ih:400,hp:70,dmg:[8,14],hit:.78,xp:900,gold:[0,0],speed:1,mode:'quest',
   legend:'Aunt Marrow lost her child to the winter and has pushed the pram ever since. She is very polite, very thin and very sad, and she always has one favour to ask. Do not look into the pram.'},
  {id:'weatherhound',n:'The Weather Hound',h:.95,iw:237,ih:400,hp:60,dmg:[9,14],hit:.8,xp:1300,gold:[0,0],speed:2,mode:'fight',above:1,magic:1,ranged:3,shot:'a bolt of lightning',
   legend:'When a storm cannot find a town, it sends the Hound. It follows the party with the weather: rain on one side, lightning on the other, and its barking is the thunder.'},
  {id:'toll',n:'Grubb the Toll Troll',h:1.0,iw:243,ih:400,hp:120,dmg:[9,14],hit:.74,xp:1000,gold:[60,140],speed:1,mode:'quest',
   legend:'Grubb was a toll-keeper before the road was moved. Nobody told him. He sits by his sign for the road that is no longer there and charges whoever happens by. He is not a bad troll. He is a troll with a grudge about the road.'},
  {id:'hollowbride',n:'The Hollow Bride',h:1.15,iw:182,ih:400,hp:65,dmg:[8,13],hit:.78,xp:1000,gold:[0,0],speed:1,mode:'quest',
   legend:'She waited at the church for a groom who went to the wrong church. She is still waiting. If a wedding goes by she follows it, weeping, and when it is over she keeps her bouquet and her silence.'},
  {id:'rattlebones',n:'Brother Rattlebones',h:.9,iw:158,ih:400,hp:70,dmg:[7,12],hit:.76,xp:900,gold:[10,40],speed:1,mode:'quest',
   legend:'Brother Rattlebones was a bell-ringer so devoted that death did not stop him. He rings for everything that passes, and will cheerfully ring for you, if you will let him count you among the dead.'},
  {id:'saltwife',n:'The Salt Wife',h:1.05,iw:131,ih:400,hp:60,dmg:[7,12],hit:.76,xp:900,gold:[0,0],speed:1,mode:'quest',
   legend:'A fisherman\'s wife who wept so long for her drowned husband that she turned to salt. She cannot cross water and cannot stop weeping, and where her tears fall nothing grows. She is thirsty, always.'},
  {id:'thistlewick',n:'Thistlewick the Alchemist',h:.62,iw:280,ih:400,hp:50,dmg:[6,10],hit:.74,xp:800,gold:[20,60],speed:1,mode:'quest',
   legend:'Thistlewick the gnome has been trying to brew the perfect potion for two hundred years and has managed eleven imperfect ones. He is delighted by every one of them. He asks very little. Mostly herbs.'},
  {id:'manyeyedox',n:'The Many-Eyed Ox',h:1.0,iw:288,ih:400,hp:150,dmg:[10,16],hit:.8,xp:1400,gold:[0,0],speed:1,mode:'fight',above:1,magic:1,
   legend:'No one has ever counted the eyes of the Many-Eyed Ox, because it keeps looking back. It is the herd-keeper of a vanished god. It does not blink, and it never forgets a face, even yours.'},
  {id:'crowncrab',n:'The Crown Crab',h:.6,iw:412,ih:388,hp:110,dmg:[9,14],hit:.78,xp:1200,gold:[60,160],speed:1,mode:'fight',above:1,magic:1,
   legend:'The Crown Crab claims the whole shore and every wreck on it. The crown came from a drowned king who was too proud to leave it behind. The crab thinks it is the king. In a sense, it is.'},
  {id:'unfinished',n:'The Unfinished Man',h:1.05,iw:167,ih:400,hp:60,dmg:[7,12],hit:.76,xp:900,gold:[0,0],speed:1,mode:'quest',
   legend:'The Unfinished Man is a portrait that walked away from its painter. The painter died before the right half was done, so half of him is a person and half is an idea. He is looking for paint. He is a gentleman about it.'}
];
const WBY={};WANDERERS.forEach(w=>{WBY[w.id]=w;w.key='w_'+w.id;w.img=w.img||w.key;w.w=w.h*w.iw/w.ih});
/* the favours they ask: what, how many, what they pay */
const WQ={
  ferryman:{title:'A Light for the River',item:'torch',n:2,reward:{gold:700,xp:3200,items:['ringW']},
    offer:'A light. That is all I ask. The river is gone, but the crossing is still there, in the dust, and I cannot see it. Two torches, to mark the banks. Then I can finally carry someone over, and be late no more.',accept:'Two torches. Set them where the river was.',remind:n=>n+' of 2 torches. The river is waiting.',ready:'Torches! Their light is the colour of water.',thanks:'He plants them in the dust, and for a moment there is a river, black and wide, and he steps out onto it. "Thank you," he says. "Take this. The dead gave it to me, for the fare."',after:'He is gone, and the dust where he stood is wet.'},
  mossback:{title:'Apples for Mother Mossback',item:'apple',n:4,reward:{gold:600,xp:2600,items:['potion3','potion3']},
    offer:'Hello, little ones. My knees are older than your gods and my tree wants apples. It has not had an apple since the hermit, and it has strong opinions on the subject. Four, if you would. I am very slow, but I am grateful, and I live a very long time.',accept:'Four apples. Take your time. I will be here, or somewhere near.',remind:n=>n+' of 4 apples. I can wait. I am very good at it.',ready:'I can smell them from here.',thanks:'She eats one, slowly, with her eyes shut, and lets the tree have the rest. "Take these," she says, and a small flask rolls out from under the shell. "The hermit brewed them. They have improved."',after:'The tree on her back has put out a single white flower.'},
  marrow:{title:'Something Sweet for the Baby',item:'honeycomb',n:1,reward:{gold:800,xp:3000,items:['ringS']},
    offer:'Forgive me. I do not like to ask. The baby will not sleep, and she wants something sweet, and I have nothing sweet. A little honeycomb, perhaps. Only one. I would be so very grateful. You must not look in the pram while I wait.',accept:'One honeycomb. Thank you. I will be very quiet.',remind:n=>'A honeycomb, please. It has been such a long night.',ready:'Oh. Oh, thank you.',thanks:'She holds the honeycomb out over the pram, and something inside takes it very gently. The pram stops rocking. "She is asleep," she whispers. "Thank you. Take this. I never had anything to give anyone."',after:'The pram is gone, and so is she. You find you are very glad you did not look.'},
  toll:{title:'The Toll',gold:60,reward:{gold:0,xp:2400,items:['helm']},
    offer:'HALT. This is Grubb\'s road. Sixty gold to pass. Everyone pays. (He looks past you at the empty land behind.) It is a very good road. I do not know why nobody uses it.',accept:'Sixty gold. Pay when you are ready. I am not going anywhere. I have a sign.',remind:n=>'Sixty gold. The sign says so.',ready:'Have you got it? Sixty? Honestly? Nobody ever pays.',thanks:'He counts it three times, weeping a little, and puts it in the bag at his belt. "Safe passage," he says, with great dignity. "And a helmet. I took it off a man who did not pay."',after:'The toll is paid. The road, such as it is, is safe, in a manner of speaking.'},
  hollowbride:{title:'Flowers for the Hollow Bride',item:'wildflower',n:3,reward:{gold:700,xp:2800,items:['ringM']},
    offer:'(A voice like a breath in an empty church.) Forgive me. I have been here a long time and I have only the one bouquet, and it is dust. The groom will be here soon. Three flowers, wild ones, so that I am not unprepared.',accept:'Three flowers. He will be here at any moment.',remind:n=>n+' of 3. He will be here soon.',ready:'They are so bright. He will like them.',thanks:'She holds them to her chest, and for a moment, behind the veil, there is a face. "He is not coming, is he?" she says. "No. Thank you. Take this. It was meant for him."',after:'There is a faded bouquet and a pale ring of light on the floor, and nothing else.'},
  rattlebones:{title:'Laid to Rest',kills:6,reward:{gold:600,xp:2600,items:['scrollLight']},
    offer:'(He rings the bell, once.) Peace, friends. The ground is restless. Six of the things that creep here have not yet been given their bell. I am a bell-ringer, and I am not allowed to strike a blow. You are. Lay six to rest, and I will ring for each.',accept:'Six. And I will ring for every one. It is the least I can do, and the most.',remind:n=>n+' of 6. I heard the bell ring itself.',ready:'I heard them. Every one.',thanks:'He rings six times, slowly, and the sound goes a very long way. "Rest," he says, to nobody. "Take this. It was in the belfry. It will do you more good than it did the bell."',after:'A faint bell rings in the distance, and then another.'},
  saltwife:{title:'Water for the Salt Wife',item:'water',n:3,reward:{gold:600,xp:2600,items:['holywater','holywater']},
    offer:'(She weeps, quietly, a thin salt rain.) I am so thirsty. I cannot cross water and I cannot drink it, for it dissolves me. But I could drink it from a hand. Three, if you can spare it. Three cups of cool water.',accept:'Three cups of water. Thank you. I am so dry.',remind:n=>n+' of 3. I am so thirsty.',ready:'Water. Oh. Water.',thanks:'She drinks, one cup after another, and where the water goes she grows a little less white. "I will weep for something else now," she says. "Take these. They are my tears, from before I was salt."',after:'A dark patch in the dust, and a smell of the sea.'},
  thistlewick:{title:'Herbs for Thistlewick',item:'herb',n:3,reward:{gold:500,xp:2400,items:['potion3','potion3','sleeptea']},
    offer:'Ah! Customers! Splendid. I am Thistlewick, alchemist, bottler of the eleven finest imperfect potions in the country. The twelfth is almost there. It needs only three herbs. Not rare ones. Moor herbs. I would go myself, but I am small and the moor is large.',accept:'Three herbs! Oh, it will be a masterpiece. A small one.',remind:n=>n+' of 3 herbs. The twelfth potion is almost there.',ready:'Herbs! Are those herbs? They are! Give them here!',thanks:'He throws them in, stirs, and the bottle goes green, then purple, then a colour with no name. "Eleven and a half," he says, happily. "Take these. The old ones. I made them with love and a few mistakes."',after:'A faint smell of mushrooms, and a very small cap on the ground, quite empty.'},
  unfinished:{title:'Paint for the Unfinished Man',item:'dates',n:3,reward:{gold:700,xp:2800,items:['ringV']},
    offer:'Good day. Forgive me, I am not entirely here. I need paint, you see, and a gentleman does not go about half-coloured. Dark dates will do for the brown, and they have a violet in them when they are crushed. Three, if you would be so kind.',accept:'Three dates. Thank you. I shall be a new man. A newer one.',remind:n=>n+' of 3 dates. I am doing my best to hold still.',ready:'Dates! Splendid. And so fresh.',thanks:'He crushes them with the brush and paints his right arm, slowly, and it fills in. "How do I look?" he says. He looks, for a moment, entirely like a man. "Take this. It was in my coat pocket. I never found out what it was for."',after:'A smear of violet on the floor, and the clean mark of a bootprint.'}
};
WANDERERS.forEach(w=>{if(WQ[w.id])w.q=WQ[w.id]});

/* ---- the creatures that fight ---- */
for(const w of WANDERERS){
  if(w.mode==='quest')continue;
  ENEMY_DEF[w.key]={name:w.n,hp:w.hp,dmg:w.dmg,hit:w.hit,w:w.w,img:w.img,xp:w.xp,gold:w.gold,speed:w.speed,patrol:w.id!=='messenger',wander:true,ranged:w.ranged,shot:w.shot,verb:'strikes',aboveParty:w.above||0,dropMagic:w.magic||0,wanderer:w.id,};
  if(!ENEMY_DEF[w.key].ranged)delete ENEMY_DEF[w.key].ranged;
}
ENEMY_DEF.w_messenger.act=e=>msgrAct(e);
ENEMY_DEF.w_messenger.dropItem='deathsword';
ITEMDEF.deathsword={n:'The Last Word',k:'weapon',t:'Sword',ic:'sword',c:'#a01828',dmg:[20,29],hit:.12,req:{str:14},price:2200,rar:1,d:'A long black blade that was the Messenger of Death\'s own. It has never missed, and it has never once been wrong about who was next.',sw:.4};
for(const w of WANDERERS)NPC_H[w.key]=w.h;
NPC_H.msgr_D=NPC_H.msgr_E=NPC_H.msgr_A=NPC_H.msgr_T=NPC_H.msgr_H=.5;

/* ---- the favours: each is an ordinary quest ---- */
QAREA_ORDER.splice(QAREA_ORDER.indexOf('Elsewhere'),0,'Wandering Monsters');
const wPlace=id=>{const r=((G.flags.wRec||{})[id])||null;return r&&LEVEL_NAMES[r.lv]?LEVEL_NAMES[r.lv]:'where you met'};
for(const w of WANDERERS){
  const q=w.q;if(!q)continue;const id='wq_'+w.id;
  QUESTS[id]={title:q.title,who:w.n,need:q.item?q.n:q.gold?1:q.kills,reward:q.reward,
    goal:q.item?()=>Math.min(bagCount(q.item),q.n):q.gold?()=>G.gold>=q.gold?1:0:g=>Math.min(q.kills,G.kills-(g.base||0)),
    take:q.item?{[q.item]:q.n}:undefined};
  Object.defineProperty(QUESTS[id],'desc',{enumerable:true,get(){return q.item?'Bring '+q.n+' x '+(ITEMDEF[q.item]?ITEMDEF[q.item].n:q.item)+' to '+w.n+', last seen '+wPlace(w.id)+'. The shops and the wild have them.':q.gold?w.n+' wants '+q.gold+' gold to let you pass. Last seen '+wPlace(w.id)+'.':w.n+' wants '+q.kills+' creatures laid to rest. Last seen '+wPlace(w.id)+'.'}});
  QAREA[id]='Wandering Monsters';QGIVER['w_'+w.id]=id;
  const root=d=>{
    const F=G.flags;
    if(qSt(id)==='done')return say(q.after,[BYE]);
    if(w.id==='toll'){
      if(qSt(id)===null)return say(q.offer,[['Pay the toll (60 gold)',()=>{if(G.gold<60)return say('You do not have it. Nobody ever has it.',[BYE]);qAccept(id);G.gold-=60;G.quests[id].paid=1;QUESTS[id].goal=()=>1;qTurnIn(id);F.wDone=F.wDone||{};F.wDone[w.id]=1;return say(q.thanks+' Reward: '+rewardText(id)+'.',[BYE])}],['Not today.',()=>null]]);
      return say(q.after,[BYE])}
    if(qSt(id)===null)return say(q.offer,[['We will do it.',()=>{qAccept(id);if(q.kills)G.quests[id].base=G.kills;return say(q.accept,[BYE])}],['Not now.',()=>null]]);
    if(qReady(id))return say(q.ready,[['Here you are.',()=>{const rw=rewardText(id);qTurnIn(id);(F.wDone=F.wDone||{})[w.id]=1;return say(q.thanks+' Reward: '+rw+'.',[BYE])}],BYE]);
    return say(q.remind(qGoal(id)),[BYE])};
  khNpc('w_'+w.id,w.n,w.key,root);
}
const wGold=QUESTS.wq_toll;if(wGold){wGold.goal=()=>G.gold>=60?1:0}

/* ---- the Messenger of Death ---- */
const MSG_LETTERS='DEATH';
function msgrRec(){const F=G.flags;F.msgrLv=F.msgrLv||{};return F.msgrLv[LEVEL]}
function msgrReg(){const F=G.flags;F.msgrSeen=F.msgrSeen||{};return F.msgrSeen}
CUTS.msgrTouch=()=>[
  {text:'Something very thin and very black has come out of the dark, laid one long cold finger on '+hn(0)+'\'s shoulder, and gone again. It did not run. It simply was not there any more. Where it stood, the air has the smell of a snuffed candle.'},
  {who:hn(1),text:'I know that smile. I heard it from my grandmother, and she heard it from hers. That was the Messenger of Death.'},
  {who:hn(2),text:'The what? Please tell me this is one of your stories.'},
  {who:hn(1),text:'He hides the five letters of his name, D, E, A, T and H, on the walls of the places where people walk. He writes them in blood, in a hand that shakes. And every letter you see goes down in a book somewhere. When you have read all five, that is the end. All of us. At once.'},
  {who:hn(3),text:'That is a story to frighten children. Is it not? Tell me it is.'},
  {who:hn(1),text:'Children are the only ones who ever lived to tell it.'},
  {who:hn(2),text:'Gods. Then we do not look at the walls. We cover our eyes and walk blind.'},
  {who:hn(1),text:'You cannot help seeing. That is the whole of the curse. But they say he can be killed. He touches you to say he is here, and then he runs, and hides, and waits to be found. The sword he carries is said to be the sharpest that ever was.'},
  {who:hn(0),text:'Then we find him first. Before the walls do.'},
  {who:hn(3),text:'I am going to be sick. Somebody tell me what the first letter is when we see it, because I do not want to know.'}];
CUTS.msgrDeath=()=>[
  {text:'The last letter is a crooked H, drips running down it from the crossbar. It is the fifth. D. E. A. T. H.'},
  {who:hn(1),text:'It is too late. You have seen all the letters.'},
  {text:'The torches go out together. In the dark, very close, something very thin and very black is smiling the widest smile of all, and its long fingers are already reaching.'},
  {text:'The Messenger of Death comes through the party like a cold wind, touching each of the four in turn, and nobody has time to scream.'},
  {text:'Four torches lie on the floor, burning, and then not.'}];
function msgrPlace(){ // called when a level is built
  const F=G.flags;F.wRoll=F.wRoll||{};
  const dead=(F.msgrLv&&F.msgrLv[LEVEL]&&F.msgrLv[LEVEL].dead);
  if(dead)return;
  let rec=msgrRec();
  if(!rec){
    if(F.wRoll['m'+LEVEL])return;F.wRoll['m'+LEVEL]=1;
    if(!wLevelOk()||Math.random()>=.04)return;
    const cells=wReach(G.P.x,G.P.y,26);if(cells.length<40)return;
    const far=cells.filter(c=>c[2]>=14);const pick=a=>a[(Math.random()*a.length)|0];
    const here=pick(far.length?far:cells);
    const walls=[];for(const c of cells){if(c[2]<5)continue;const x=c[0],y=c[1];for(const [dx,dy] of DIRS){const g=(G.grid[y+dy]||[])[x+dx];if(g>0&&!(g>=30&&g<100)&&g!==3&&!G.decor.some(d=>d.x===x&&d.y===y&&d.block))walls.push([x,y,dx,dy]);}}
    const chosen=[];walls.sort(()=>Math.random()-.5);
    for(const w of walls){if(chosen.length>=5)break;if(chosen.every(c=>Math.abs(c[0]-w[0])+Math.abs(c[1]-w[1])>=7))chosen.push(w)}
    if(chosen.length<5)return;
    rec=F.msgrLv[LEVEL]={x:here[0],y:here[1],letters:chosen.map((w,i)=>({k:MSG_LETTERS[i],x:w[0],y:w[1],wd:[w[2],w[3]]})),state:'lurk',born:G.rounds,hp:null};
  }
  // the letters, flat on the walls
  for(const L of rec.letters)G.decor.push({k:'msgr_'+L.k,x:L.x,y:L.y,block:false,walk:true,deco:true,loot:false,shop:false,wd:L.wd,msgr:L.k});
  // the Messenger himself, standing still in the dark
  const st=enemyStat('w_messenger',DIFF());
  const e={id:G.enemies.length,t:'w_messenger',lvl:DIFF(),x:rec.x,y:rec.y,rx:rec.x,ry:rec.y,hp:st.hp,maxhp:st.hp,alert:true,chilled:0,flash:0,lunge:0,dying:0,seed:Math.random()*10,sx:210,sy:100,ms:rec.state,hide:rec.hide};
  G.enemies.push(e);rebalanceEnemies();if(rec.hp!==null&&rec.hp!==undefined)e.hp=Math.max(1,Math.min(e.maxhp,Math.round(e.maxhp*rec.hp)));
  rec.born=rec.born||G.rounds;
}
function msgrEnemy(){return G.enemies.find(e=>e.t==='w_messenger'&&e.hp>0)}
/* breadth-first search over the free floor: [x,y,steps] for every cell within r steps */
function wReach(sx,sy,r){
  const out=[],seen=new Set([sx+','+sy]),q=[[sx,sy,0]];
  while(q.length){const [x,y,d]=q.shift();out.push([x,y,d]);if(d>=r)continue;for(const [dx,dy] of DIRS){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(seen.has(k)||cellBlocked(nx,ny))continue;seen.add(k);q.push([nx,ny,d+1])}}
  return out.filter(c=>!cellBlocked(c[0],c[1]));
}
function wStep(e,tx,ty){ // the next square on the way to (tx,ty), or null
  const seen=new Set([e.x+','+e.y]),q=[[e.x,e.y,null]];
  while(q.length){const [x,y,first]=q.shift();if(x===tx&&y===ty)return first;
    for(const [dx,dy] of DIRS){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(seen.has(k)||cellBlocked(nx,ny)||(enemyAt(nx,ny)&&!(nx===tx&&ny===ty)))continue;seen.add(k);q.push([nx,ny,first||[nx,ny]]);if(seen.size>6000)return null}}
  return null;
}
function msgrAct(e){
  const rec=msgrRec();if(!rec)return 1;
  const d=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);
  if(e.hp<e.maxhp&&d===1){enemyAttack(e);return 300}                // once hurt he fights
  if(e.ms==='lurk'){
    if(G.rounds-rec.born>=22){e.ms=rec.state='rush'}
    return 1}
  if(e.ms==='rush'){
    for(let s=0;s<3;s++){
      if(Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)===1)break;
      const st=wStep(e,G.P.x,G.P.y);if(!st)break;
      // the step he takes is the first square on the way to the party, but never onto the party itself
      if(st[0]===G.P.x&&st[1]===G.P.y)break;e.x=st[0];e.y=st[1];
    }
    if(Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)===1){ // he touches them, and goes
      wMet('messenger');
      for(let i=0;i<4;i++)if(G.heroes[i].alive)try{afflInflict('shaken',i,true)}catch(x){}
      try{afflInflict('haunted',(Math.random()*4)|0,true)}catch(x){}
      e.ms=rec.state='flee';e.hide=rec.hide=wHideCell(e);e.lunge=1;sfx('screech');
      G.talk=null;G.hold=null;G.queued=null;later(250,()=>startCut('msgrTouch'));
      return 400}
    return 150}
  if(e.ms==='flee'){
    const h=e.hide||(e.hide=rec.hide=wHideCell(e));
    for(let s=0;s<3;s++){if(e.x===h[0]&&e.y===h[1])break;const st=wStep(e,h[0],h[1]);if(!st)break;e.x=st[0];e.y=st[1]}
    if(e.x===h[0]&&e.y===h[1])e.ms=rec.state='hide';
    return 130}
  return 1; // hiding: he waits to be found
}
function wHideCell(e){ // somewhere far from the party and out of its sight
  const cells=wReach(e.x,e.y,40).filter(c=>c[2]>=10&&Math.abs(c[0]-G.P.x)+Math.abs(c[1]-G.P.y)>=14&&!hasLOS(c[0],c[1],G.P.x,G.P.y)&&!enemyAt(c[0],c[1]));
  if(!cells.length)return [e.x,e.y];return cells[(Math.random()*cells.length)|0].slice(0,2);
}
function msgrFrame(){ // every frame: has the party read a letter?
  const rec=msgrRec();if(!rec||G.state!=='play'||G.cut||G.talk)return;
  const reg=msgrReg();const C=G.C;
  for(const L of rec.letters){
    if(reg[L.k])continue;
    const dx=L.x+.5-C.x-.5,dy=L.y+.5-C.y-.5,dist=Math.hypot(dx,dy);if(dist>6.5)continue;
    const cosA=(dx*Math.cos(C.a)+dy*Math.sin(C.a))/(dist||1);if(dist>.7&&cosA<.62)continue;
    if(dx*L.wd[0]+dy*L.wd[1]<-.3&&dist>1.2)continue;            // the plaque faces away from where the party is
    if(!hasLOS(Math.round(C.x),Math.round(C.y),L.x,L.y))continue;
    reg[L.k]=1;sfx('screech');msg('Scrawled on the wall in blood: the letter '+L.k+'.','#ff6a5a');
    wMet('messenger');
    if(MSG_LETTERS.split('').every(l=>reg[l])){G.talk=null;G.hold=null;G.queued=null;startCut('msgrDeath',()=>{for(const h of G.heroes){h.hp=0;h.alive=false}G.state='dead';sfx('lose')})}
    break}
}
function msgrHud(){
  const reg=msgrReg();if(!G.flags.msgrSeen||!Object.keys(reg).length||G.state!=='play'||G.menu||G.cut)return;
  const rec=msgrRec();if(!rec&&Object.keys(reg).length<5)return; // the letters belong to the level where they were seen
  ctx.save();ctx.font=`bold 15px ${FTITLE}`;ctx.textAlign='center';ctx.textBaseline='middle';
  const x0=240-MSG_LETTERS.length*8.5;
  MSG_LETTERS.split('').forEach((l,i)=>{const seen=reg[l],pul=.75+.25*Math.sin(G.time*5+i);
    ctx.lineWidth=3;ctx.strokeStyle='rgba(10,2,2,.85)';ctx.strokeText(seen?l:'_',x0+i*17,33);
    ctx.globalAlpha=seen?pul:.5;ctx.fillStyle=seen?'#e0301e':'#6a5a4a';ctx.fillText(seen?l:'_',x0+i*17,33)});
  ctx.restore();
}
/* the dropped blade */
function dropNamed(e,def){
  const id=def.dropItem;if(!id)return;
  if(bagAdd(mkItem(id)))msg('The Messenger of Death falls apart, and where he stood lies '+ITEMDEF[id].n+'!','#e090f0');
  else{G.items.push({k:id,x:e.x,y:e.y,taken:false});msg(ITEMDEF[id].n+' falls to the ground. Your bag is full.','#e090f0')}
  const rec=msgrRec();if(rec)rec.dead=true;
}

/* ---- the wanderers in general ---- */
function wLevelOk(){
  const L=LEVELS[LEVEL];if(!L||LEVEL>=200&&LEVEL<1000&&!L.outdoor)return false;if(LEVEL>=1000)return false;
  if(LEVEL>=291&&LEVEL<=299)return false;
  let open=0;for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(G.grid[y][x]===0)open++;
  return open>=300;
}
function wMet(id){const F=G.flags;F.wMet=F.wMet||{};if(!F.wMet[id]){F.wMet[id]=1;msg('A new entry in the Wandering Monsters menu: '+WBY[id].n+'.','#e0c8ff')}}
function wPlaceWanderer(){
  const F=G.flags;F.wRoll=F.wRoll||{};F.wRec=F.wRec||{};
  // those already standing on this level
  for(const id in F.wRec){const r=F.wRec[id];if(r.lv!==LEVEL)continue;const w=WBY[id];if(!w||(F.wDone&&F.wDone[id]))continue;
    if(w.mode==='quest')G.decor.push({k:w.key,x:r.x,y:r.y,block:false,walk:true,npc:'w_'+id,sc:1,wander:1})}
  if(F.wRoll['w'+LEVEL])return;F.wRoll['w'+LEVEL]=1;
  if(!wLevelOk()||Math.random()>=.16)return;
  if(Object.values(F.wRec).some(r=>r.lv===LEVEL))return;
  const pool=WANDERERS.filter(w=>w.id!=='messenger'&&!(F.wRec[w.id]&&w.mode==='quest')&&!(F.wDone&&F.wDone[w.id]));
  if(!pool.length)return;const w=pool[(Math.random()*pool.length)|0];
  const cells=wReach(G.P.x,G.P.y,26).filter(c=>c[2]>=8&&!G.decor.some(d=>d.x===c[0]&&d.y===c[1]&&d.block));
  if(!cells.length)return;const c=cells[(Math.random()*cells.length)|0];
  if(w.mode==='quest'){
    F.wRec[w.id]={lv:LEVEL,x:c[0],y:c[1]};
    G.decor.push({k:w.key,x:c[0],y:c[1],block:false,walk:true,npc:'w_'+w.id,sc:1,wander:1});
  }else{
    const st=enemyStat(w.key,DIFF());
    G.enemies.push({id:G.enemies.length,t:w.key,lvl:DIFF(),x:c[0],y:c[1],rx:c[0],ry:c[1],hp:st.hp,maxhp:st.hp,alert:false,chilled:0,flash:0,lunge:0,dying:0,seed:Math.random()*10,sx:210,sy:100,wanderer:w.id});rebalanceEnemies();
  }
}
let WSEEN_T=0;
function wanderFrame(){
  if(G.state!=='play'||!G.decor)return;
  msgrFrame();
  if(G.time-WSEEN_T<.4)return;WSEEN_T=G.time;
  const F=G.flags;
  // meeting one: it is in sight and near
  for(const d of G.decor)if(d.npc&&d.npc.startsWith('w_')&&!d.found){
    const id=d.npc.slice(2),w=WBY[id];if(!w||(F.wMet&&F.wMet[id]))continue;
    if(Math.abs(d.x-G.P.x)+Math.abs(d.y-G.P.y)<=10&&hasLOS(d.x,d.y,G.P.x,G.P.y)){wMet(id);msg(w.n+' stands in the dark ahead.','#e0c8ff')}
    if(F.wDone&&F.wDone[id]){d.found=true;msg(w.n+' wanders off, and is gone.','#e0c8ff')}
  }
  for(const e of G.enemies){if(e.hp<=0||!ENEMY_DEF[e.t]||!ENEMY_DEF[e.t].wanderer||e.t==='w_messenger')continue;const id=ENEMY_DEF[e.t].wanderer;
    if(!(F.wMet&&F.wMet[id])&&Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<=9&&hasLOS(e.x,e.y,G.P.x,G.P.y)){wMet(id);msg(WBY[id].n+' comes out of the dark!','#ff9a8a')}}
  const m=msgrEnemy();if(m){const rec=msgrRec();if(rec){rec.x=m.x;rec.y=m.y;rec.hp=m.hp/m.maxhp;rec.hide=m.hide}
    if(m.ms!=='lurk'&&m.ms!=='hide'&&(F.wMet&&!F.wMet.messenger))wMet('messenger');}
  // a quest-giver wanders a step now and then, and the record follows it
  if(G.rounds%7===0&&!G._wmove){G._wmove=1;for(const d of G.decor)if(d.wander&&!d.found&&d.npc){const o=DIRS[(Math.random()*4)|0],nx=d.x+o[0],ny=d.y+o[1];
      if(!cellBlocked(nx,ny)&&!enemyAt(nx,ny)&&!(nx===G.P.x&&ny===G.P.y)&&!G.decor.some(z=>z!==d&&z.x===nx&&z.y===ny&&z.block)){d.x=nx;d.y=ny;const r=(F.wRec||{})[d.npc.slice(2)];if(r&&r.lv===LEVEL){r.x=nx;r.y=ny}}}}
  if(G.rounds%7!==0)G._wmove=0;
}
/* hook the game: the level being built, every frame, and the screen */
{const _pt=placeTeleporter;placeTeleporter=function(){_pt();try{msgrPlace();wPlaceWanderer()}catch(e){console.error(e)}}}
{const _up=update;update=function(dt){_up(dt);try{wanderFrame()}catch(e){}}}
{const _ui=ui;ui=function(dt){_ui(dt);try{msgrHud()}catch(e){}}}
{const _hurt=hurtEnemy;hurtEnemy=function(e,dmg){const def=ENEMY_DEF[e.t],was=e.hp>0;_hurt(e,dmg);if(was&&e.hp<=0&&def&&def.dropItem)dropNamed(e,def);if(def&&def.wanderer)wMet(def.wanderer)}}

/* ---- the Wanderers menu ---- */
const WSIL={};
function wSil(id){ // an unmet creature, as a black shape
  if(WSIL[id])return WSIL[id];const im=IMG[WBY[id].key];if(!im)return null;
  return WSIL[id]=mkCanvas(im.width,im.height,(x,w,h)=>{x.drawImage(im,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#0c0806';x.fillRect(0,0,w,h)});
}
function drawWanderers(){
  BTNS=[];veil(.7);bigPanel(24,8,432,304);
  const F=G.flags,met=id=>!!(F.wMet&&F.wMet[id]);G.wsel=clamp(G.wsel||0,0,WANDERERS.length-1);
  txt('WANDERING MONSTERS',240,24,13,'#d8c88e','center',true);
  const n=WANDERERS.filter(w=>met(w.id)).length;txt(n+' of '+WANDERERS.length+' met',240,37,8.5,'#a89878','center');
  WANDERERS.forEach((w,i)=>{const y=48+i*15.2,sel=i===G.wsel;
    if(sel){ctx.fillStyle='rgba(216,200,142,.2)';ctx.fillRect(34,y-6,170,13)}
    txt(met(w.id)?w.n:'?  ?  ?',40,y,8.3,sel?'#f0e4b4':met(w.id)?'#cdbf94':'#6a5c44','left',sel);btn('wl_'+i,34,y-7,170,14)});
  const w=WANDERERS[G.wsel],seen=met(w.id);
  // the picture, which swings from standing to striking
  ctx.save();ctx.fillStyle='rgba(8,6,4,.8)';rrect(ctx,212,44,236,150,5);ctx.fill();ctx.strokeStyle=goldG(212,44,236,150);ctx.lineWidth=1.4;rrect(ctx,212,44,236,150,5);ctx.stroke();
  const atk=((G.time*1.1)|0)%2===1,im=seen?(atk&&IMG[w.key+'A']?IMG[w.key+'A']:IMG[w.key]):wSil(w.id);
  if(im){const s=Math.min(138/im.height,224/im.width);ctx.drawImage(im,330-im.width*s/2,189-im.height*s,im.width*s,im.height*s)}
  ctx.restore();
  txt(seen?w.n:'Unknown',330,203,11,seen?'#f0e4b4':'#8a7a58','center',true);
  if(seen){
    const L=WRAP(w.legend,222,8);L.slice(0,7).forEach((s,k)=>txt(s,216,216+k*10,8,'#cdbf94','left'));
    const pl=Math.round(G.heroes.filter(h=>h.alive).reduce((a,h)=>a+h.lvl,0)/Math.max(1,G.heroes.filter(h=>h.alive).length))||1;
    let line;
    if(w.mode==='quest')line='Asks a favour. '+(F.wDone&&F.wDone[w.id]?'Done.':QUESTS['wq_'+w.id]&&qSt('wq_'+w.id)?'In progress.':'')+'   Health about '+Math.round(w.hp*(1+.45*(pl-1)));
    else{const st=enemyStat(w.key,pl+(w.above||0));line='Level '+(pl+(w.above||0))+'   Health '+st.hp+'   Damage '+st.dmg[0]+' to '+st.dmg[1]+'   Speed '+w.speed+(w.ranged?'   Ranged':'')}
    txt(line,216,290,7.8,'#e8c878','left');
    if(w.note)txt(w.note,216,280,7.2,'#c8a888','left');
  }else{txt('Meet it, and it will be written here.',330,222,8.5,'#8a7a58','center')}
  btnText('wback','Back',195,297,90,15);
}
const WRAP=(s,w,sz)=>wrapText(s,w,sz);
