/* ==========================================================================
   QUESTS OF THE FRESHWATER MAZE (prefix hgdwq / HGDWQ). Four people live in the clearing beside the pond at the first steps (entrance 0) of the Deeper Hollow.
   They set nine tasks in the Drowned Maze (level 477, now a freshwater dungeon): a lost urn, cut reeds, two lost rings, leeches, a rare carp, piranhas, water scorpions
   and spiders, a drowned diver's journal, and Old Whiskers the catfish. Quest items lie on the floor of the maze, placed after it is built.
   ========================================================================== */
const HGDWQ_G={sexton:['fw1','fw2'],odile:['fw3','fw4'],cook:['fw5','fw6','fw7'],wynne:['fw8','fw9']};
Object.assign(ITEMDEF,{
  hgwurn:{n:'Funeral Urn',k:'quest',t:'Quest item',ic:'ore',c:'#a8845a',stack:1,price:0,d:'A clay urn with a sealed lid and a ring of painted reeds around it. Sexton Anselm wants it back.',sw:.34},
  hgwreed:{n:'Bundle of Cut Reeds',k:'quest',t:'Quest item',ic:'herb',c:'#8aa850',stack:1,price:1,d:'A tight bundle of long green reeds, cut in the reed beds of the drowned maze. They are wanted for funeral wreaths.',sw:.3},
  hgwring1:{n:"Corwen's Ring",k:'quest',t:'Quest item',ic:'ring',c:'#d8b050',stack:1,price:0,d:"A plain gold ring, worn thin. Inside is cut: O and C, always. Odile Pemm wants it back.",sw:.2},
  hgwring2:{n:"Odile's Ring",k:'quest',t:'Quest item',ic:'ring',c:'#e8d890',stack:1,price:0,d:"A slim gold ring with a tiny pearl. Inside is cut: C and O, always. It is the partner of Corwen's ring.",sw:.2},
  hgwcarp:{n:'Moonscale Carp',k:'quest',t:'Quest item',ic:'herring',c:'#d8e4f0',stack:1,price:0,d:'A fat carp with pale silver scales that shine like the moon. Brannoc Gule the cook wants one.',sw:.34},
  hgwjournal:{n:"Diver's Journal",k:'quest',t:'Quest item',ic:'scroll',c:'#7a8a5a',stack:1,price:0,d:"A swollen little book wrapped in oilcloth. On the first page: Property of Tam Tarn. If found, give it to my daughter Wynne.",sw:.3}});
const HGDWQ_DEF={
  fw1:{title:'The Lost Urn',who:'Anselm Dray, the sexton',desc:'A funeral urn was lost in the Drowned Maze, below the steps by the pond. Find the Funeral Urn in one of the chambers there and bring it to Anselm Dray. A helm is needed to breathe.',need:1,goal:()=>bagCount('hgwurn'),take:{hgwurn:1},reward:{gold:700,xp:2600,items:['potion3']}},
  fw2:{title:'Reeds for the Wreaths',who:'Anselm Dray, the sexton',desc:'Anselm needs 6 bundles of cut reeds for funeral wreaths. They lie in the reed beds of the Drowned Maze.',need:6,goal:()=>bagCount('hgwreed'),take:{hgwreed:6},reward:{gold:500,xp:2200,items:['potion3']}},
  fw3:{title:'Two Wedding Rings',who:'Odile Pemm',desc:'Odile and her husband Corwen lost their two wedding rings in the Drowned Maze when their boat went down. Find both, Corwen\'s Ring and Odile\'s Ring, in two different chambers.',need:2,goal:()=>(bagCount('hgwring1')>0?1:0)+(bagCount('hgwring2')>0?1:0),take:{hgwring1:1,hgwring2:1},reward:{gold:900,xp:3200,items:['potion4','gem_aquamarine']}},
  fw4:{title:'Leeches for the Healer',who:'Odile Pemm',desc:'Giant leeches in the Drowned Maze bite the divers and the wounds will not close. Odile wants 6 giant leeches killed there.',need:6,cnt:'hgwq_leech',goal:q=>(G.flags.hgwq_leech||0)-(q.base||0),reward:{gold:600,xp:2400,items:['potion3','antidote']}},
  fw5:{title:'The Moonscale Carp',who:'Brannoc Gule, the cook',desc:'Brannoc wants one Moonscale Carp, a rare fish that lives in one hidden chamber of the Drowned Maze. A creature guards the place.',need:1,goal:()=>bagCount('hgwcarp'),take:{hgwcarp:1},reward:{gold:1000,xp:3400,items:['potion4']}},
  fw6:{title:'Piranha Pie',who:'Brannoc Gule, the cook',desc:'Piranhas in the Drowned Maze strip every fish in the pond. Kill 8 piranhas there.',need:8,cnt:'hgwq_pir',goal:q=>(G.flags.hgwq_pir||0)-(q.base||0),reward:{gold:700,xp:2800,items:['potion3']}},
  fw7:{title:'Pests in the Pantry',who:'Brannoc Gule, the cook',desc:'Water scorpions and diving-bell spiders climb out of the maze into the kitchen. Kill 5 of them in the Drowned Maze, scorpions and spiders together.',need:5,cnt:'hgwq_bug',goal:q=>(G.flags.hgwq_bug||0)-(q.base||0),reward:{gold:650,xp:2600,items:['potion3','antidote']}},
  fw8:{title:"The Diver's Journal",who:'Wynne Tarn',desc:'Wynne\'s father Tam dived into the Drowned Maze and did not come back. Find his Diver\'s Journal there and bring it to Wynne.',need:1,goal:()=>bagCount('hgwjournal'),take:{hgwjournal:1},reward:{gold:800,xp:3000,items:['potion4','gem_jade']}},
  fw9:{title:'Old Whiskers',who:'Wynne Tarn',desc:'A huge catfish called Old Whiskers is the warden of the Drowned Maze. Wynne wants it dead so that no more divers are lost. It waits deep in the maze.',need:1,goal:()=>G.flags.hgwqWhisk?1:0,reward:{gold:1500,xp:4500,items:['potion4','gem_emerald','hgcrystal']}}};
for(const id in HGDWQ_DEF){QUESTS[id]=HGDWQ_DEF[id];QAREA[id]='The Deeper Hollow'}
if(typeof QNOTE!=='undefined'){
  QNOTE.fw1='Anselm sets the urn on the altar stone and says the old words over it. The room feels a little quieter.';
  QNOTE.fw3='Odile and Corwen sit side by side on the bench, each turning a ring on a finger.';
  QNOTE.fw8='Wynne reads the last page of the journal, folds it, and holds it against her chest.';
  QNOTE.fw9='The pond is still. Somewhere below, the water finally settles.'}
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push(
  'There are four of us in the clearing by the pond: a sexton, a cook, a widow and a diver\'s daughter. Each of us has lost something in the drowned maze below the steps.',
  'Under the pond steps the maze is all reeds, moss and green water. The narrow passages hide leeches, piranhas and a catfish as long as a boat.',
  'Cut reeds from the reed beds make good wreaths, and moonscale carp make the best soup in the world. Both are down in the water.');
/* ---------- counting what is killed ---------- */
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;_he.apply(this,arguments);if(was&&e.hp<=0){const F=G.flags;
  if(e.t==='hgfpiranha')F.hgwq_pir=(F.hgwq_pir||0)+1;
  else if(e.t==='hgfscorpion'||e.t==='hgfspider')F.hgwq_bug=(F.hgwq_bug||0)+1;
  else if(e.t==='hgfleech')F.hgwq_leech=(F.hgwq_leech||0)+1;
  else if(e.t==='hgfcatfish')F.hgwqWhisk=1}}}
/* ---------- the four givers ---------- */
const HGDWQ_TALK={
  fw1:{offer:'I keep the dead of this clearing. A funeral urn, sealed and painted with reeds, went down in the drowned maze when the old boat sank. The family will not rest until it is back in the ground. It lies in one of the chambers below the steps. Please bring it to me.',accept:'Thank you. Wear your helms, and look in the chambers, not the passages.',ready:'The urn, with the seal whole. Thank you, truly.',thanks:'The family can rest now. I will say a word for each of you.',after:'The dead are quiet today. That is all I ever ask.'},
  fw2:{offer:'There are always more funerals than wreaths. I need 6 bundles of cut reeds, and the best reeds grow thick in the beds of the drowned maze. Bring me 6 bundles.',accept:'Pick them where they grow thickest. Mind what lives in them.',ready:'Six fine bundles. These will last a week.',thanks:'The wreaths will look well. Take this for your trouble.',after:'The wreaths are done. Come back whenever someone has died. Sorry, that is a poor way to say goodbye.'},
  fw3:{offer:'Corwen and I were married fifty-one years. Last spring our boat went down on the pond and both our rings went into the water, and down the steps into the maze. I know it is a lot to ask. Find Corwen\'s ring and mine. They lie in two different chambers, I am told.',accept:'Bless you. Two rings, two chambers. Take your time.',ready:'Both rings! Corwen, come and see!',thanks:'I never thought I would feel them again. I wish I had more to give.',after:'Corwen has not taken his ring off since. Neither have I.'},
  fw4:{offer:'I am the healer here. The divers come up with giant leeches on them, and the bites will not close. I cannot cure what keeps coming back. Kill 6 giant leeches in the drowned maze, and the divers will have a better time.',accept:'Leeches like the dark, still water and the mud. Cut them off, do not pull them.',ready:'Six leeches. I will sleep better for it.',thanks:'My thanks. Keep a little salve of mine.',after:'There are fewer bitten divers at my door now.'},
  fw5:{offer:'I cook for this clearing, and I have heard of one fish all my life: the Moonscale Carp. Pale silver, fat as a loaf, and sweeter than any fish a pond can raise. One is said to live in a hidden chamber in the drowned maze, with something big guarding it. Bring me one.',accept:'Good luck. Do not let it flop out of your hands.',ready:'A Moonscale Carp! Look at the scales on it.',thanks:'You shall eat first. Here is your reward as well.',after:'The carp was worth every coin I never paid you. Thank you.'},
  fw6:{offer:'Piranhas have got into the maze, and they strip the pond of every fish I might cook. Kill 8 piranhas in the drowned maze. Then I can fish again.',accept:'They come in shoals. Fight with your back to a wall.',ready:'Eight piranhas gone. The pond will fill again.',thanks:'Fish for dinner at last. Thank you.',after:'The pond has fish again. Come and eat.'},
  fw7:{offer:'Water scorpions and diving-bell spiders climb out of the drowned maze at night and into my pantry. Kill 5 of them in the maze, any mix of the two, and I will keep my flour.',accept:'They hide in the reeds and under the moss. Look closely.',ready:'Five of the pests. My pantry owes you.',thanks:'No more bites in the bread bin. Here you are.',after:'The pantry is clean. Thank you.'},
  fw8:{offer:'My father Tam was a diver. He went into the maze below the steps last autumn and did not come up. He wrote everything in a little journal wrapped in oilcloth. I need to know where he went and what happened to him. Please find his journal and bring it to me.',accept:'Thank you. It will be in a chamber, I think. He always wrote when he rested.',ready:'My father\'s journal. His handwriting. Oh, Father.',thanks:'He was not lost. He ran out of air in the far chambers, writing to the end. I know now. That is more than I hoped for. Thank you.',after:'I read a page of it every night.'},
  fw9:{offer:'In the end it was not the dark, it was Old Whiskers. A catfish as long as a boat, and the warden of the whole maze. My father wrote about it in his journal. While it lives, divers will keep being lost. Kill Old Whiskers.',accept:'Be careful. It lies deep in the maze and it is bigger than anything else down there.',ready:'It is dead? Truly dead?',thanks:'My father would have wept. The water is safe now. Take this, all of it.',after:'The pond is calm tonight. Thank you.'}};
function hgdwqGiver(npc,name,img,list,intro,doneLine){
  khNpc(npc,name,img,d=>{const nodeFn=()=>{
      const id=list.find(q=>qSt(q)!=='done');
      if(!id)return hgdNode(doneLine,[BYE],nodeFn);
      const t=HGDWQ_TALK[id];
      const n=qNode(id,{offer:(qSt(id)===null&&list.indexOf(id)===0&&!G.flags[npc+'_met']?intro+' ':'')+t.offer,accept:t.accept,remind:(g,nn)=>QUESTS[id].desc+' ('+g+' of '+nn+'.)',ready:t.ready,thanks:t.thanks,after:t.after});
      if(qSt(id)===null)G.flags[npc+'_met']=1;
      n.text=hgdSay(n.text);return n};return nodeFn()},{q:list})}
hgdwqGiver('hgd_fwsexton','Anselm Dray, the sexton','hg_npc3',HGDWQ_G.sexton,'Quietly, please. This is a place of rest.','The dead of the clearing are all at peace. Thank you for all of it.');
hgdwqGiver('hgd_fwodile','Odile Pemm','hg_npc2',HGDWQ_G.odile,'Sit, dear. Corwen, put the kettle on.','Corwen and I have everything we need now, thanks to you.');
hgdwqGiver('hgd_fwcook','Brannoc Gule, the cook','hg_npc1',HGDWQ_G.cook,'Wipe your boots. I have flour on my hands.','The kitchen is quiet, the pond is full. What more could a cook want.');
hgdwqGiver('hgd_fwwynne','Wynne Tarn','hg_npc5',HGDWQ_G.wynne,'Hello. Are you going down the steps?','The water is calm and my father is at peace. I owe you everything.');
/* ---------- the givers stand in the pond clearing at the first steps ---------- */
function hgdwqPlace(L){
  if(L._hgdwq)return;const E=L._hgdw.entrances[0];if(!E)return;
  const rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.',occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  if(L._hgdt&&L._hgdt.stones)for(const s of L._hgdt.stones)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)occ.add((s.x+dx)+','+(s.y+dy));
  for(const e of L._hgdw.entrances){occ.add(e.x+','+e.y);occ.add(e.ax+','+e.ay)}
  const who=[['hg_npc3','hgd_fwsexton'],['hg_npc2','hgd_fwodile'],['hg_npc1','hgd_fwcook'],['hg_npc5','hgd_fwwynne']],res={};
  for(const [img,npc] of who){let spot=null;
    for(let r=2;r<=8&&!spot;r++)for(let dy=-r;dy<=r&&!spot;dy++)for(let dx=-r;dx<=r&&!spot;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=E.ax+dx,y=E.ay+dy;if(!open(x,y)||occ.has(x+','+y))continue;
      let all=true;for(let ay=-1;ay<=1;ay++)for(let ax=-1;ax<=1;ax++)if(!open(x+ax,y+ay)||(occ.has((x+ax)+','+(y+ay))&&!(ax===0&&ay===0)))all=false;if(!all)continue;spot=[x,y]}
    if(!spot)continue;occ.add(spot[0]+','+spot[1]);L.decor.push({k:img,x:spot[0],y:spot[1],block:true,npc,sc:.72});res[npc]=spot}
  L._hgdwq=res}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];
  if(!had&&L&&L._hgdb)try{hgdwqTry(L)}catch(e){console.error('hgdwq',e)}}}
// the water and the stones may be built a moment after the level itself: try now, and again when the party moves
function hgdwqTry(L){if(L._hgdwq||!L._hgdw||!L._hgdt)return;hgdwqPlace(L)}
{const _u=update;update=function(dt){try{const L=LEVELS[HGD.ID];if(L&&L._hgdb&&!L._hgdwq)hgdwqTry(L)}catch(e){}return _u.apply(this,arguments)}}
/* ---------- the quest items in the drowned maze ---------- */
function hgdwqPlaceItems(L){
  if(L._hgdwqi)return;const W=L.rows[0].length,H=L.rows.length,rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.',Z=L._hgdw||{},st=Z.stairs||[],far=Z.far;
  const occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y)),spots=[];
  const nearStairs=(x,y)=>st.some(s=>Math.abs(s.ax-x)+Math.abs(s.ay-y)<5),nearFar=(x,y)=>far&&Math.abs(far.x-x)<=2&&Math.abs(far.y-y)<=2;
  const okCell=(x,y)=>open(x,y)&&!occ.has(x+','+y)&&!nearStairs(x,y)&&!nearFar(x,y);
  let rooms=Array.isArray(Z.roomList)?Z.roomList.filter(r=>!(far&&Math.abs(r.cx-far.x)<=2&&Math.abs(r.cy-far.y)<=2)):[];
  if(!rooms.length){ // the room list is missing: take open cells with open neighbours, far from the stairs
    const c=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!okCell(x,y))continue;let n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))n++;if(n>=7)c.push({cx:x,cy:y,x,y,w:1,h:1})}
    const s0=st[0]||{ax:1,ay:1};c.sort((a,b)=>hash2(a.cx,a.cy,4771)-hash2(b.cx,b.cy,4771));
    for(const r of c){if(Math.hypot(r.cx-s0.ax,r.cy-s0.ay)<12)continue;if(rooms.every(q=>Math.hypot(q.cx-r.cx,q.cy-r.cy)>=9))rooms.push(r);if(rooms.length>=14)break}}
  rooms=rooms.slice().sort((a,b)=>hash2(a.cx,a.cy,4772)-hash2(b.cx,b.cy,4772));
  const cellIn=r=>{for(let k=0;k<=4;k++)for(let dy=-k;dy<=k;dy++)for(let dx=-k;dx<=k;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==k)continue;const x=r.cx+dx,y=r.cy+dy;if(okCell(x,y))return [x,y]}return null};
  const put=(id,r)=>{const c=cellIn(r);if(!c)return null;occ.add(c[0]+','+c[1]);const it={k:id,x:c[0],y:c[1]};L.items.push(it);if(LEVEL===HGDW_ID()&&G.items)G.items.push(Object.assign({taken:false},it));return c};
  const res={};let ri=0;const next=()=>rooms.length?rooms[(ri++)%rooms.length]:null;
  for(const id of ['hgwurn','hgwring1','hgwring2','hgwcarp','hgwjournal']){const r=next();if(r)res[id]=put(id,r)}
  if(res.hgwcarp&&typeof ENEMY_DEF!=='undefined'&&ENEMY_DEF.hgfturtle){ // a snapping turtle guards the carp
    const c=res.hgwcarp;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1]]){const x=c[0]+dx,y=c[1]+dy;if(open(x,y)&&!occ.has(x+','+y)){occ.add(x+','+y);L.enemies.push({t:'hgfturtle',x,y});res.guard=[x,y];break}}}
  // eight bundles of reeds, one in each of eight different open places, well apart from each other
  const reeds=[];const pool=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(okCell(x,y))pool.push([x,y]);
  pool.sort((a,b)=>hash2(a[0],a[1],4773)-hash2(b[0],b[1],4773));
  for(const c of pool){if(reeds.length>=8)break;if(reeds.every(q=>Math.hypot(q[0]-c[0],q[1]-c[1])>=8)){reeds.push(c);occ.add(c[0]+','+c[1]);const it={k:'hgwreed',x:c[0],y:c[1]};L.items.push(it);if(LEVEL===HGDW_ID()&&G.items)G.items.push(Object.assign({taken:false},it))}}
  res.reeds=reeds;L._hgdwqi=res}
function HGDW_ID(){return typeof HGDW!=='undefined'?HGDW.ID:477}
{const _b=hgdwBuild;hgdwBuild=function(){const had=!!LEVELS[HGDW.ID];_b.apply(this,arguments);const L=LEVELS[HGDW.ID];if(!had&&L)try{hgdwqPlaceItems(L)}catch(e){console.error('hgdwq items',e)}}}
