/* ==========================================================================
   QUESTS OF THE WATER (prefix hgdq / HGDQ). Old Gill, a retired diver in Nacre Landing, sets four tasks in the Drowned Maze (pearls, the warden, the bubble vents, the shell chests).
   Reed, the lake warden, stands in the landing beside the departure dock of the first lake and sets five (crocodiles, eels, snakes, the far docks, reeds); Bram the boatwright (lost net), Fenn the beekeeper (water lilies) and Odda the ferrywoman (a letter for a hermit at a far dock) stand at the other lakes. Each chain gives the next as the last is done.
   ========================================================================== */
const HGDQ_G=['wq1','wq2','wq3','wq4'],HGDQ_R=['bq1','bq2','bq3','bq4','bq5'];
Object.assign(ITEMDEF,{
  hglreed:{n:'Lake Reeds',k:'quest',t:'Quest item',ic:'herb',c:'#8aa850',stack:1,price:1,d:'A bundle of long green reeds, cut from a lake in the maze.',sw:.3},
  hgllily:{n:'Water Lily Flower',k:'quest',t:'Quest item',ic:'herb',c:'#f0b8d8',stack:1,price:1,d:'A pink water lily, picked from a floating pad on a lake in the maze.',sw:.2},
  hglnet:{n:'Lost Fishing Net',k:'quest',t:'Quest item',ic:'ore',c:'#b8a878',stack:0,price:0,d:'A wet fishing net, tangled with reeds. It was lost on an islet in a lake of the maze.',sw:.5},
  hglletter:{n:'Sealed Letter',k:'quest',t:'Quest item',ic:'scroll',c:'#e8e0c0',stack:0,price:0,d:'A letter sealed with green wax. It is for the hermit who lives by the far dock of the second lake.',sw:.1}});
const HGDQ_DEF={
  wq1:{title:'Pearls from the Drowned Maze',who:'Old Gill, the diver',desc:'Old Gill wants 4 pearls from the shell chests of the Drowned Maze, under the water in the maze (steps down in the pond clearings). A helm is needed to breathe.',need:4,goal:()=>bagCount('pearl'),take:{pearl:4},reward:{gold:600,xp:2400,items:['potion3']}},
  wq2:{title:'The Warden of the Deep',who:'Old Gill, the diver',desc:'Something huge sleeps at the far end of the Drowned Maze. Old Gill wants Old Gulper dead, so that divers can use the passages again.',need:1,goal:()=>G.flags.hgdGulper?1:0,reward:{gold:900,xp:3600,items:['potion4']}},
  wq3:{title:'Breathing Lessons',who:'Old Gill, the diver',desc:'A diver must know the bubble vents. Breathe at 5 different vents in the Drowned Maze.',need:5,goal:()=>Object.keys(G.flags.hgdVents||{}).length,reward:{gold:500,xp:2000,items:['potion3']}},
  wq4:{title:'Shell Chests',who:'Old Gill, the diver',desc:'Open 6 of the shell chests in the Drowned Maze. Old Gill wants to know what the sea keeps there.',need:6,goal:()=>Object.keys(G.flags.hgdwOpened||{}).length,reward:{gold:1200,xp:4000,items:['potion4','hgcrystal']}},
  bq1:{title:'Crocodile Skins',who:'Reed, the lake warden',desc:'Crocodiles have taken the lakes of the maze. Reed wants 6 swamp crocodiles killed on the lakes. Hop on a boat at a dock to reach them.',need:6,cnt:'hgdk_wcroc',goal:q=>(G.flags.hgdk_wcroc||0)-(q.base||0),reward:{gold:700,xp:2800,items:['potion3']}},
  bq2:{title:'Eels in the Lake',who:'Reed, the lake warden',desc:'Marsh eels bite the boatmen. Kill 5 marsh eels on the lakes.',need:5,cnt:'hgdk_weel',goal:q=>(G.flags.hgdk_weel||0)-(q.base||0),reward:{gold:600,xp:2400,items:['potion3']}},
  bq3:{title:'Snake Bounty',who:'Reed, the lake warden',desc:'Vine snakes drop from the walls onto the boats. Kill 5 vine snakes on the lakes.',need:5,cnt:'hgdk_wsnake',goal:q=>(G.flags.hgdk_wsnake||0)-(q.base||0),reward:{gold:600,xp:2400,items:['potion3']}},
  bq4:{title:'The Far Docks',who:'Reed, the lake warden',desc:'Cross all three lakes by boat and land at the far dock of each. There is a dock in a dead-end corridor at each end of a lake.',need:3,goal:()=>Object.keys(G.flags.hgdFar||{}).length,reward:{gold:1000,xp:3600,items:['potion4']}},
  bq5:{title:'Reeds for the Roofs',who:'Reed, the lake warden',desc:'Reed wants 8 bundles of cut reeds, to mend the roofs of the dock huts. Bundles of reeds float among the reed beds on the lakes. Steer the boat over them to pick them up.',need:8,goal:()=>bagCount('hglreed'),take:{hglreed:8},reward:{gold:800,xp:3000,items:['potion4','antidote']}},
  bq6:{title:'The Lost Net',who:'Bram, the boatwright',desc:'Bram lost his best fishing net on a little islet in the first lake, the one beside his boathouse. Take the boat out, find the Lost Fishing Net floating among the reeds by the islet, and bring it back.',need:1,goal:()=>bagCount('hglnet'),take:{hglnet:1},reward:{gold:700,xp:2600,items:['potion3']}},
  bq7:{title:'Lilies for the Bees',who:'Fenn, the beekeeper',desc:'Fenn keeps bees by the third lake, and they love water lilies. Bring 4 water lily flowers, picked from the floating pads on the lakes by steering the boat over them.',need:4,goal:()=>bagCount('hgllily'),take:{hgllily:4},reward:{gold:650,xp:2500,items:['potion3','hgjelly']}},
  bq8:{title:'A Letter for the Hermit',who:'Odda, the ferrywoman',desc:'Odda gives you a sealed letter for Old Marl, a hermit who lives by the far dock of the second lake. Cross the lake by boat, land at the far dock and hand it over.',need:1,goal:()=>G.flags.hgdLetterDone?1:0,reward:{gold:900,xp:3300,items:['potion4']}}};
for(const id in HGDQ_DEF){QUESTS[id]=HGDQ_DEF[id];QAREA[id]='The Deeper Hollow'}
// counting what happens in the water
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;_he.apply(this,arguments);if(was&&e.hp<=0){const F=G.flags;
  if(e.t==='hgwcroc')F.hgdk_wcroc=(F.hgdk_wcroc||0)+1;else if(e.t==='hgweel')F.hgdk_weel=(F.hgdk_weel||0)+1;else if(e.t==='hgwsnake')F.hgdk_wsnake=(F.hgdk_wsnake||0)+1;else if(e.t==='uwgulper'&&LEVEL===HGDW.ID)F.hgdGulper=1}}}
{const _u=update;update=function(dt){try{if(LEVEL===HGDW.ID&&G.uw&&G.uw.vent&&G.state==='play'){const F=G.flags,V=UWS[HGDW.ID];if(V){const v=V.vents.find(q=>Math.abs(q[0]-G.P.x)<=1&&Math.abs(q[1]-G.P.y)<=1);if(v){F.hgdVents=F.hgdVents||{};F.hgdVents[v[0]+','+v[1]]=1}}}}catch(e){}return _u.apply(this,arguments)}}
{const _lf=lootFor;lootFor=function(d){if(LEVEL===HGDW.ID&&d&&d.hgdwTier){G.flags.hgdwOpened=G.flags.hgdwOpened||{};G.flags.hgdwOpened[d.x+','+d.y]=1}return _lf.apply(this,arguments)}}
/* ---------- the two givers ---------- */
const HGDQ_TALK={
  wq1:{offer:'I dived these waters forty years, before my lungs gave up. There is a flooded part of the maze, down the steps in the pond clearings, and it is full of shell chests. Bring me 4 pearls from them. Mind you wear helms, all of you, or the water will have you.',accept:'Good. Four pearls. Keep an eye on your air, and breathe at the vents.',ready:'Four pearls! Look at the shine on them. You have the sea in you.',thanks:'A fair bargain. And I have more work for those who can hold their breath.',after:'The sea is kind to those who ask politely.'},
  wq2:{offer:'At the far end of the drowned maze sleeps Old Gulper, a grouper the size of a barn. As long as it lives, no diver will cross that water. Kill it.',accept:'Take the long way round and the vents with you. It is slow, but it hits like a wave.',ready:'Gulper is dead? Then the maze under the water is open at last.',thanks:'You have done what forty years of divers could not.',after:'They say there is still treasure in the chests there.'},
  wq3:{offer:'A diver who does not know the vents is a diver who does not come home. Go down, and breathe at 5 different vents, so you know where the air is.',accept:'Five vents. Learn the way between them.',ready:'You breathe like a fish now.',thanks:'Good. Never swim farther than you can swim back.',after:'Count the vents on the way in, and count them again on the way out.'},
  wq4:{offer:'Last of my tasks: open 6 of the shell chests in the drowned maze, and tell me what the sea keeps in them.',accept:'Six chests, then. Do not drown over the last one.',ready:'Six chests opened. You are a diver in all but name.',thanks:'There. The sea has made you rich, and the sea has made you a friend.',after:'Come back whenever you are in need of a helm.'},
  bq1:{offer:'I keep the lakes of the maze, and the crocodiles have taken them. There are three, each with a boat at the steps down. Hop on, and kill 6 of them in the dark water under the vines.',accept:'Keep the boat steady and your sword ready. They come up fast.',ready:'Six crocodiles! The lakes are almost clear.',thanks:'Well done. There is more to do, if you have the stomach.',after:'The lakes are quieter since you passed.'},
  bq2:{offer:'Now the eels. They bite the boatmen at the ankles. Kill 5 marsh eels on the lakes.',accept:'They are quick. Strike first.',ready:'Five eels. My boatmen will sleep tonight.',thanks:'My thanks. One more kind of pest remains.',after:'The water is cleaner for it.'},
  bq3:{offer:'The vine snakes drop from the walls onto the boats, and the venom is cruel. Kill 5 of them.',accept:'Look up as well as ahead.',ready:'Five snakes dead. That is a great relief.',thanks:'The vines can have the rest of the year in peace.',after:'Mind the vines, all the same.'},
  bq4:{offer:'A lake is not cleared until it has been crossed. Ride a boat over each of the three lakes and land at the far dock. The far dock is at the end of a dead-end corridor, on the other side of the lake from where you start.',accept:'Hop on at a dock, steer to the far side, and bump the far dock to land. Then walk on.',ready:'All three lakes crossed! Then they are safe enough.',thanks:'You have the freedom of the water now.',after:'Fair winds.'},
  bq5:{offer:'One last thing. My dock huts need new thatch. Bring me 8 bundles of reeds from the reed beds on the lakes. They float among the reeds, and you pick them up by steering the boat over them.',accept:'Look in the reed beds, and by the little islets. Eight bundles.',ready:'Eight bundles of reeds. The roofs will be dry by winter.',thanks:'There. Keep a little of it for yourselves.',after:'My boats are in your debt.'},
  bq6:{offer:'I build the boats here, and I lost my best net on an islet in the first lake, the one just beyond this dock. Take a boat out, find the Lost Fishing Net floating among the reeds by the islet, and bring it back.',accept:'Mind the crocodiles. They like the islet.',ready:'My net! Look at the knots, not one cut.',thanks:'A fair trade. Use the boats whenever you like.',after:'The boats are tied up and waiting.'},
  bq7:{offer:'I keep bees by this lake, and they will work for nothing but water lilies. Bring me 4 lily flowers from the floating pads on the lakes. Steer the boat over them to pick them.',accept:'The pads are pale green and the flowers are pink. Four will do.',ready:'Four lilies. The bees will hum all night.',thanks:'There is honey in it for you, one of these days.',after:'The bees are glad of you.'},
  bq8:{offer:'There is a hermit, Old Marl, who lives by the far dock of the second lake. No one has been to see him since spring. Take this letter across the lake by boat, land at the far dock and give it to him.',accept:'It is a long way round on foot, and a short way by water. Mind the crocodiles.',ready:'He has read it! Good. I could not get a boat across for weeks.',thanks:'Thank you. That is one worry less.',after:'Fair winds.'}};
function hgdqGiver(npc,name,img,list,intro,doneLine){
  khNpc(npc,name,img,d=>{const nodeFn=()=>{
      const id=list.find(q=>qSt(q)!=='done');
      if(!id)return hgdNode(doneLine,[BYE],nodeFn);
      const t=HGDQ_TALK[id];
      const n=qNode(id,{offer:(qSt(id)===null&&list.indexOf(id)===0&&!G.flags[npc+'_met']?intro+' ':'')+t.offer,accept:t.accept,remind:(g,nn)=>QUESTS[id].desc+' ('+g+' of '+nn+'.)',ready:t.ready,thanks:t.thanks,after:t.after});
      if(qSt(id)===null)G.flags[npc+'_met']=1;
      n.text=hgdSay(n.text);return n};return nodeFn()},{q:list})}
hgdqGiver('hgd_diver','Old Gill, the diver','hg_npc4',HGDQ_G,'Come in, come in. Mind the dripping.','The sea is quiet now. Thank you. I mean it.');
hgdqGiver('hgd_warden','Reed, the lake warden','hg_npc2',HGDQ_R,'Boots off at the dock, if you please.','The lakes are clear. I may have to find a hobby.');
hgdqGiver('hgd_boatwright','Bram, the boatwright','hg_npc3',['bq6'],'Mind the planks, they are wet.','The boats are all in order, thanks to you.');
hgdqGiver('hgd_beekeeper','Fenn, the beekeeper','hg_npc4',['bq7'],'Stand still, they are curious.','The bees are well fed. Thank you.');
hgdqGiver('hgd_ferry','Odda, the ferrywoman','hg_npc1',['bq8'],'Looking for a crossing?','The hermit has his letter. I can rest easy.');
khNpc('hgd_hermit','Old Marl, the hermit','hg_npc5',d=>{const F=G.flags,nodeFn=()=>{
  if(F.hgdLetterDone)return hgdNode('Odda writes a fine hand. I will answer when the water is low. Tell her so.',[BYE],nodeFn);
  if(bagCount('hglletter')>0)return hgdNode('Is that a letter? Nobody has found me by boat in years. Give it here.',[['Hand over the letter.',()=>{bagRemove('hglletter',1);F.hgdLetterDone=1;msg('Old Marl reads the letter twice, and smiles.','#a8e8c0');return nodeFn()}],BYE],nodeFn);
  return hgdNode('I live by the far dock because the boat comes there. It does not come often.',[BYE],nodeFn)};return nodeFn()});
// the ferrywoman hands over the letter when the task is taken
{const _u=update;update=function(dt){try{const F=G.flags;if(F&&G.state==='play'&&!F.hgdLetterGiven&&qSt('bq8')==='active'&&!G.talk){F.hgdLetterGiven=1;if(bagAdd(mkItem('hglletter')))msg('Odda gives you a sealed letter.','#a8e8c0');else F.hgdLetterGiven=0}}catch(e){}return _u.apply(this,arguments)}}
// placed in two of the towns
function hgdqPlace(L){
  if(L._hgdq)return;const M=L._hgdm,P=L._hgdp,rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.',occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  const place=(zoneName,img,npc)=>{const z=P.zones.find(q=>q.name===zoneName);if(!z)return null;
    for(let r=1;r<9;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=z.x+dx,y=z.y+dy;if(!open(x,y)||occ.has(x+','+y))continue;
      let all=true;for(let ay=-1;ay<=1;ay++)for(let ax=-1;ax<=1;ax++)if(!open(x+ax,y+ay)||(occ.has((x+ax)+','+(y+ay))&&!(ax===0&&ay===0)))all=false;if(!all)continue;
      occ.add(x+','+y);L.decor.push({k:img,x,y,block:true,npc,sc:.72});return [x,y]}return null};
  // the lake people stand on the landing beside a departure dock (the wide part of the corridor), the hermit in a nook beside a far dock
  const lk=L._hgdl&&L._hgdl.lakes||[],land=(k,u,img,npc)=>{if(!k||!k.plaza)return null;const c=k.plaza.find(q=>q[2]===u&&q[3]===0);if(!c||occ.has(c[0]+','+c[1]))return null;occ.add(c[0]+','+c[1]);L.decor.push({k:img,x:c[0],y:c[1],block:true,npc,sc:.72,hgdl:1});return [c[0],c[1]]};
  const hermitSpot=()=>{const B=lk[1]&&lk[1].docks&&lk[1].docks.far;if(!B)return null;if(B.nook)return B.nook;
    const blk=new Set(L.decor.filter(d=>d.block||d.npc).map(d=>d.x+','+d.y));
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const cx=B.ax+a,cy=B.ay+b;if(!open(cx,cy)||blk.has(cx+','+cy)||occ.has(cx+','+cy))continue;
      const b2=new Set(blk);b2.add(cx+','+cy);const seen=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];let ok=false;
      for(let i=0;i<q.length&&!ok;i++){const [x,y]=q[i];for(const [e,f] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+e,ny=y+f,k=nx+','+ny;if(seen.has(k)||!open(nx,ny)||b2.has(k))continue;if(nx===B.ax&&ny===B.ay){ok=true;break}seen.add(k);q.push([nx,ny])}}
      if(ok)return [cx,cy]}return null};
  const hn=hermitSpot(),hermit=hn?(L.decor.push({k:'hg_npc5',x:hn[0],y:hn[1],block:true,npc:'hgd_hermit',sc:.72,hgdl:1}),hn):null;
  L._hgdq={diver:place('Nacre Landing','hg_npc4','hgd_diver'),warden:land(lk[0],3,'hg_npc2','hgd_warden'),boatwright:land(lk[0],5,'hg_npc3','hgd_boatwright'),ferry:land(lk[1],3,'hg_npc1','hgd_ferry'),beekeeper:land(lk[2],3,'hg_npc4','hgd_beekeeper'),hermit}}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdb)try{hgdqPlace(L)}catch(e){console.error('hgdq',e)}}}
