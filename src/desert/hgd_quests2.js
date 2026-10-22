/* ==========================================================================
   QUESTS OF THE WATER (prefix hgdq / HGDQ). Old Gill, a retired diver in Nacre Landing, sets four tasks in the Drowned Maze (pearls, the warden, the bubble vents, the shell chests).
   Reed, the canal warden in Blue Lantern, sets five in the water passages (crocodiles, eels, snakes, the far dock, vine cuttings). Each gives the next as the last is done.
   ========================================================================== */
const HGDQ_G=['wq1','wq2','wq3','wq4'],HGDQ_R=['bq1','bq2','bq3','bq4','bq5'];
const HGDQ_DEF={
  wq1:{title:'Pearls from the Drowned Maze',who:'Old Gill, the diver',desc:'Old Gill wants 4 pearls from the shell chests of the Drowned Maze, under the water in the maze (steps down in the pond clearings). A helm is needed to breathe.',need:4,goal:()=>bagCount('pearl'),take:{pearl:4},reward:{gold:600,xp:2400,items:['potion3']}},
  wq2:{title:'The Warden of the Deep',who:'Old Gill, the diver',desc:'Something huge sleeps at the far end of the Drowned Maze. Old Gill wants Old Gulper dead, so that divers can use the passages again.',need:1,goal:()=>G.flags.hgdGulper?1:0,reward:{gold:900,xp:3600,items:['potion4']}},
  wq3:{title:'Breathing Lessons',who:'Old Gill, the diver',desc:'A diver must know the bubble vents. Breathe at 5 different vents in the Drowned Maze.',need:5,goal:()=>Object.keys(G.flags.hgdVents||{}).length,reward:{gold:500,xp:2000,items:['potion3']}},
  wq4:{title:'Shell Chests',who:'Old Gill, the diver',desc:'Open 6 of the shell chests in the Drowned Maze. Old Gill wants to know what the sea keeps there.',need:6,goal:()=>Object.keys(G.flags.hgdwOpened||{}).length,reward:{gold:1200,xp:4000,items:['potion4','hgcrystal']}},
  bq1:{title:'Crocodile Skins',who:'Reed, the canal warden',desc:'Crocodiles have taken the canals of the maze. Reed wants 6 swamp crocodiles killed in the Vine Canal or the Croc Canals.',need:6,cnt:'hgdk_wcroc',goal:q=>(G.flags.hgdk_wcroc||0)-(q.base||0),reward:{gold:700,xp:2800,items:['potion3']}},
  bq2:{title:'Eels in the Canal',who:'Reed, the canal warden',desc:'Marsh eels bite the boatmen. Kill 5 marsh eels in the water passages.',need:5,cnt:'hgdk_weel',goal:q=>(G.flags.hgdk_weel||0)-(q.base||0),reward:{gold:600,xp:2400,items:['potion3']}},
  bq3:{title:'Snake Bounty',who:'Reed, the canal warden',desc:'Vine snakes drop from the walls onto the boats. Kill 5 vine snakes in the water passages.',need:5,cnt:'hgdk_wsnake',goal:q=>(G.flags.hgdk_wsnake||0)-(q.base||0),reward:{gold:600,xp:2400,items:['potion3']}},
  bq4:{title:'The Far Docks',who:'Reed, the canal warden',desc:'Ride a boat through both canals and land at the far dock of each: the Vine Canal and the Croc Canals.',need:2,goal:()=>Object.keys(G.flags.hgdFar||{}).length,reward:{gold:1000,xp:3600,items:['potion4']}},
  bq5:{title:'Vine Cuttings',who:'Reed, the canal warden',desc:'Reed wants 4 herbs from the ground of the maze, to brew against the vine snakes\' venom.',need:4,goal:()=>bagCount('herb'),take:{herb:4},reward:{gold:800,xp:3000,items:['potion4','antidote']}}};
for(const id in HGDQ_DEF){QUESTS[id]=HGDQ_DEF[id];QAREA[id]='The Deeper Hollow'}
// counting what happens in the water
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;_he.apply(this,arguments);if(was&&e.hp<=0){const F=G.flags;
  if(e.t==='hgwcroc')F.hgdk_wcroc=(F.hgdk_wcroc||0)+1;else if(e.t==='hgweel')F.hgdk_weel=(F.hgdk_weel||0)+1;else if(e.t==='hgwsnake')F.hgdk_wsnake=(F.hgdk_wsnake||0)+1;else if(e.t==='uwgulper'&&LEVEL===HGDW.ID)F.hgdGulper=1}}}
{const _u=update;update=function(dt){try{if(LEVEL===HGDW.ID&&G.uw&&G.uw.vent&&G.state==='play'){const F=G.flags,V=UWS[HGDW.ID];if(V){const v=V.vents.find(q=>Math.abs(q[0]-G.P.x)<=1&&Math.abs(q[1]-G.P.y)<=1);if(v){F.hgdVents=F.hgdVents||{};F.hgdVents[v[0]+','+v[1]]=1}}}}catch(e){}return _u.apply(this,arguments)}}
{const _lf=lootFor;lootFor=function(d){if(LEVEL===HGDW.ID&&d&&d.hgdwTier){G.flags.hgdwOpened=G.flags.hgdwOpened||{};G.flags.hgdwOpened[d.x+','+d.y]=1}return _lf.apply(this,arguments)}}
{const _g=hgdbGo;hgdbGo=function(dk,toBoat){if(!toBoat&&dk&&dk.end==='out'){G.flags.hgdFar=G.flags.hgdFar||{};G.flags.hgdFar[dk.level]=1}return _g.apply(this,arguments)}}
/* ---------- the two givers ---------- */
const HGDQ_TALK={
  wq1:{offer:'I dived these waters forty years, before my lungs gave up. There is a flooded part of the maze, down the steps in the pond clearings, and it is full of shell chests. Bring me 4 pearls from them. Mind you wear helms, all of you, or the water will have you.',accept:'Good. Four pearls. Keep an eye on your air, and breathe at the vents.',ready:'Four pearls! Look at the shine on them. You have the sea in you.',thanks:'A fair bargain. And I have more work for those who can hold their breath.',after:'The sea is kind to those who ask politely.'},
  wq2:{offer:'At the far end of the drowned maze sleeps Old Gulper, a grouper the size of a barn. As long as it lives, no diver will cross that water. Kill it.',accept:'Take the long way round and the vents with you. It is slow, but it hits like a wave.',ready:'Gulper is dead? Then the maze under the water is open at last.',thanks:'You have done what forty years of divers could not.',after:'They say there is still treasure in the chests there.'},
  wq3:{offer:'A diver who does not know the vents is a diver who does not come home. Go down, and breathe at 5 different vents, so you know where the air is.',accept:'Five vents. Learn the way between them.',ready:'You breathe like a fish now.',thanks:'Good. Never swim farther than you can swim back.',after:'Count the vents on the way in, and count them again on the way out.'},
  wq4:{offer:'Last of my tasks: open 6 of the shell chests in the drowned maze, and tell me what the sea keeps in them.',accept:'Six chests, then. Do not drown over the last one.',ready:'Six chests opened. You are a diver in all but name.',thanks:'There. The sea has made you rich, and the sea has made you a friend.',after:'Come back whenever you are in need of a helm.'},
  bq1:{offer:'I keep the canals of the maze, and the crocodiles have taken them. They hide in the dark water under the vines. Kill 6 of them, and the boats can run again.',accept:'Keep the boat steady and your sword ready. They come up fast.',ready:'Six crocodiles! The canals are almost clear.',thanks:'Well done. There is more to do, if you have the stomach.',after:'The canals are quieter since you passed.'},
  bq2:{offer:'Now the eels. They bite the boatmen at the ankles. Kill 5 marsh eels in the water passages.',accept:'They are quick. Strike first.',ready:'Five eels. My boatmen will sleep tonight.',thanks:'My thanks. One more kind of pest remains.',after:'The water is cleaner for it.'},
  bq3:{offer:'The vine snakes drop from the walls onto the boats, and the venom is cruel. Kill 5 of them.',accept:'Look up as well as ahead.',ready:'Five snakes dead. That is a great relief.',thanks:'The vines can have the rest of the year in peace.',after:'Mind the vines, all the same.'},
  bq4:{offer:'A canal is not cleared until it has been crossed. Ride a boat through the Vine Canal and the Croc Canals, and land at the far dock of each.',accept:'There are docks in two lonely parts of the maze. Hop on, and steer well.',ready:'Both canals crossed! Then they are safe enough.',thanks:'You have the freedom of the water now.',after:'Fair winds.'},
  bq5:{offer:'One last thing. The snakes\' venom needs a cure. Bring me 4 herbs from the ground of the maze, any kind will do.',accept:'Herbs grow here and there on the ground. Keep your eyes open.',ready:'Four herbs. I will brew the antidote tonight.',thanks:'There. Keep a little of it for yourselves.',after:'My boats are in your debt.'}};
function hgdqGiver(npc,name,img,list,intro,doneLine){
  khNpc(npc,name,img,d=>{const nodeFn=()=>{
      const id=list.find(q=>qSt(q)!=='done');
      if(!id)return hgdNode(doneLine,[BYE],nodeFn);
      const t=HGDQ_TALK[id];
      const n=qNode(id,{offer:(qSt(id)===null&&list.indexOf(id)===0&&!G.flags[npc+'_met']?intro+' ':'')+t.offer,accept:t.accept,remind:(g,nn)=>QUESTS[id].desc+' ('+g+' of '+nn+'.)',ready:t.ready,thanks:t.thanks,after:t.after});
      if(qSt(id)===null)G.flags[npc+'_met']=1;
      n.text=hgdSay(n.text);return n};return nodeFn()},{q:list})}
hgdqGiver('hgd_diver','Old Gill, the diver','hg_npc4',HGDQ_G,'Come in, come in. Mind the dripping.','The sea is quiet now. Thank you. I mean it.');
hgdqGiver('hgd_warden','Reed, the canal warden','hg_npc2',HGDQ_R,'Boots off at the dock, if you please.','The canals are clear. I may have to find a hobby.');
// placed in two of the towns
function hgdqPlace(L){
  if(L._hgdq)return;const M=L._hgdm,W=M.W,P=L._hgdp,rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.',occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  const place=(zoneName,img,npc)=>{const z=P.zones.find(q=>q.name===zoneName);if(!z)return null;
    for(let r=1;r<9;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=z.x+dx,y=z.y+dy;if(!open(x,y)||occ.has(x+','+y))continue;
      let all=true;for(let ay=-1;ay<=1;ay++)for(let ax=-1;ax<=1;ax++)if(!open(x+ax,y+ay)||(occ.has((x+ax)+','+(y+ay))&&!(ax===0&&ay===0)))all=false;if(!all)continue;
      occ.add(x+','+y);L.decor.push({k:img,x,y,block:true,npc,sc:.72});return [x,y]}return null};
  L._hgdq={diver:place('Nacre Landing','hg_npc4','hgd_diver'),warden:place('Blue Lantern','hg_npc2','hgd_warden')}}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdb)try{hgdqPlace(L)}catch(e){console.error('hgdq',e)}}}
