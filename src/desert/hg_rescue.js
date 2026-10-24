/* ==========================================================================
   THE FROGS IN THE HONEY: a rescue in the Queen's Hive (level 474). The Queen has taken eight villagers of the grassland into her hive and tied them up in honey, in eight of her chambers.
   The party finds them, walks into each one (or taps it, or presses attack in front of it) and frees it: the honey runs off, the frog thanks the party and goes. When the eighth is free the quest
   is done and the villagers give the party their spear, a high level weapon. The quest belongs to the Queen's Dictionary: Aldous Wend, who sends the party into the hive for the dictionary, tells of
   the missing villagers when that quest is taken (and the party is told again at the hive's door if it came some other way). The pictures are the villager frogs coated in honey and roped
   (tools/make_bound_frogs.py makes them from hg_npc0, 1, 3, 5 and 6). Last in the injection order.
   ========================================================================== */
const HGR={ID:474,N:8,NAMES:['Pibb','Granny Slomp','Thrup','Little Wibble','Mama Gloop','Old Dreb','Blep','Auntie Quibb'],SRC:[0,1,3,5,6]};
for(let i=0;i<5;i++)loadImg('hg_bound'+i,'assets/hg_bound'+i+'.png');
Object.assign(NPC_H,{hg_bound0:1.5,hg_bound1:1.4,hg_bound2:1.12,hg_bound3:1.45,hg_bound4:1.45});
// the spear the villagers give (a reward only: it is not added to the shops or the chests)
gw('hgfrogspear','Amberthorn Spear','Sword',80,[88,120],.08,{str:38},9000,'#e8a830',{stun:.12,bleed:[.25,10,3]},'The oldest spear of the frogfolk, shaft of pond ash and a head of amber as hard as steel. One hit in eight knocks the foe senseless, and a quarter of the hits leave it bleeding.');
{const k=GEAR.indexOf('hgfrogspear');if(k>=0)GEAR.splice(k,1)}
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('hgfrogspear');
QUESTS.hgrescue={title:'Freed from the Honey',who:'Aldous Wend',desc:'Eight villagers of the grassland were taken into the Queen’s Hive and tied up in honey. Find them in the hive and walk into each one to free it. Aldous Wend says the villagers will give a great reward.',need:HGR.N,
  goal:()=>Math.min(HGR.N,G.flags.hgFreed||0),reward:{gold:1500,xp:20000,items:['hgfrogspear']}};QAREA.hgrescue='The Hollow Grasslands';
/* the eight, put in eight chambers of the hive when it is built (the same places every time) */
function hgrPlace(){
  const L=LEVELS[HGR.ID];if(!L||L._frogs||!L.rows||!L.lights)return;L._frogs=1;
  const rows=L.rows,st=L.start,qe=(L.enemies||[]).find(e=>e.t==='hgboss4'),busy=new Set();
  for(const o of [...(L.enemies||[]),...(L.items||[]),...(L.decor||[])])if(o)busy.add(o.x+','+o.y);
  const open=(x,y)=>rows[y]&&rows[y][x]==='.'&&!busy.has(x+','+y);
  const nodes=L.lights.filter(p=>Math.hypot(p[0]-st.x,p[1]-st.y)>9&&!(qe&&Math.hypot(p[0]-qe.x,p[1]-qe.y)<6)).map(p=>({p,r:hash2(p[0],p[1],5151)})).sort((a,b)=>a.r-b.r);
  const chosen=[];
  for(const n of nodes){if(chosen.length>=HGR.N)break;if(chosen.some(c=>Math.hypot(c[0]-n.p[0],c[1]-n.p[1])<9))continue;
    let spot=null;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[2,0],[0,2]])if(open(n.p[0]+dx,n.p[1]+dy)){spot=[n.p[0]+dx,n.p[1]+dy];break}
    if(spot)chosen.push(spot)}
  chosen.forEach((p,i)=>L.decor.push({k:'hg_bound'+(i%5),x:p[0],y:p[1],block:false,walk:true,npc:'hgbound',sc:1}))}
{const _ll=loadLevel;loadLevel=function(n){_ll.apply(this,arguments);try{if(LEVEL===HGR.ID)hgrPlace()}catch(e){console.error(e)}}}
const hgrIndex=d=>{const L=LEVELS[HGR.ID];let k=0;for(const q of L.decor){if(q.npc==='hgbound'){if(q.x===d.x&&q.y===d.y)return k;k++}}return 0};
const HGR_SPEECH=['Oh, thank you, thank you! I have been stuck in this honey since the harvest. I can feel my feet again!','You came! I told them somebody would come. Mind the wasps on your way out, dears.','I thought I would be a candle by now. Bless you, strangers, bless you.','I was only looking for my goat! Thank you for the honey off my back.','My family will weep when they hear. Tell them nothing, I want to see their faces.','At my age, to be glued to a wall! Never again. Take care of yourselves.','Free! Free! I will hop home and I will never go near a hive again.','That is the last of us, and the Queen was keeping something else of ours.'];
function hgFreeFrog(d){
  const F=G.flags,l=hgLvl(),i=hgrIndex(d),nm=HGR.NAMES[i%HGR.N];
  if(qSt('hgrescue')===null)qAccept('hgrescue');
  d.found=true;d.block=false;F.hgFreed=(F.hgFreed||0)+1;sfx('key');
  const n=F.hgFreed,last=n>=HGR.N;
  msg(`${nm} is free. ${Math.min(n,HGR.N)} of ${HGR.N} villagers freed.`,'#ffe36a');
  const speech=last?HGR_SPEECH[7]+' The spear of our village, the Amberthorn, was hidden in the wax. Take it, with our thanks.':HGR_SPEECH[i%7];
  const body='The honey cracks and runs off in long gold strings. The frog steps out of the ropes, takes your hands and bows again and again. '+nm+' says: "'+hgGarble(speech,l)+'"'+hgFoot(l);
  if(last)return say(body,[['Take the spear.',()=>{try{if(qReady('hgrescue'))qTurnIn('hgrescue')}catch(e){console.error(e)}return say('The frogs hop away through the tunnels, singing. They will tell the whole grassland what you did.',[BYE])}]]);
  return say(body,[['Go home safely.',()=>null]])}
NPCS.hgbound={name:'A frog in the honey',img:'hg_bound0',root:d=>hgFreeFrog(d)};
{const _st=startTalk;startTalk=function(d){if(d&&d.npc==='hgbound'){const i=hgrIndex(d);d.kname=HGR.NAMES[i%HGR.N];NPCS.hgbound.img='hg_npc'+HGR.SRC[i%5]}return _st.apply(this,arguments)}}
// walking into one frees it, as tapping it or pressing attack in front of it does
{const _dm=doMove;doMove=function(rel){try{const dir=DIRS[(G.P.f+rel)%4],nx=G.P.x+dir[0],ny=G.P.y+dir[1],fd=G.decor.find(q=>q.npc==='hgbound'&&!q.found&&q.x===nx&&q.y===ny);if(fd&&G.state==='play'&&!G.talk){startTalk(fd);return}}catch(e){console.error(e)}return _dm.apply(this,arguments)}}
/* the rescue belongs to the Queen's Dictionary: it is taken with it, and offered again at the hive's door */
{const _qa=qAccept;qAccept=function(id){const r=_qa.apply(this,arguments);
  try{if(id==='hgb4'&&qSt('hgrescue')===null){qAccept('hgrescue');msg('Aldous Wend: "Eight of our villagers were dragged into that hive and tied up in honey. If you find them, free them. They have a gift for you."','#ffe36a')}}catch(e){console.error(e)}
  return r}}
{const _g=goToLevel;goToLevel=function(n){const r=_g.apply(this,arguments);try{if(n===HGR.ID&&qSt('hgrescue')===null&&!(G.flags.hgFreed>=HGR.N)){qAccept('hgrescue');msg('Small voices are calling for help somewhere in the hive.','#ffe36a')}}catch(e){console.error(e)}return r}}
/* SLOWER CREATURES in the Hollow Grasslands and the hives (levels 470 to 474): the fast ones (speed 2, two steps at a time) take one step, and every step, blow and shot waits 150 thousandths of a second longer. */
{const _ea=enemyAct;enemyAct=function(e){
  if(LEVEL<470||LEVEL>474)return _ea.apply(this,arguments);
  const def=ENEMY_DEF[e.t],sp=def&&def.speed;if(def&&sp>1)def.speed=1;
  let r;try{r=_ea.apply(this,arguments)}finally{if(def&&sp>1)def.speed=sp}
  return typeof r==='number'&&r>0?r+150:r}}
/* NOOKS IN THE GRASSLAND: the Hollow Grasslands (level 470) are open ground, so a party could be surrounded. Thirty small outcrops of rock are set about it, each a square with rock on three sides
   and the open side facing one of the four ways: stand in it and only one creature at a time can reach you in melee. They keep clear of the villages, the hive doors, the start, the creatures and
   every other object, and are the same every time. */
function hgNooks(){
  const L=LEVELS[470];if(!L||L._nooks||!L.rows)return;L._nooks=1;
  const rows=L.rows,H=rows.length,W=rows[0].length,busy=new Set();
  const mark=(x,y,r)=>{for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)busy.add((x+dx)+','+(y+dy))};
  for(const o of [...(L.enemies||[]),...(L.items||[]),...(L.decor||[])])if(o)mark(o.x,o.y,1);
  for(const t of HG_TOWNS)mark(t.x,t.y,16);for(const h of HG_HIVE_AT)mark(h[0],h[1],8);mark(HG.START.x,HG.START.y,10);
  for(const p of (L.portals||[]))if(p)mark(p.x,p.y,4);
  const free=(x,y)=>x>1&&y>1&&x<W-2&&y<H-2&&rows[y][x]==='.'&&!busy.has(x+','+y);
  const dirs=[[0,-1],[1,0],[0,1],[-1,0]],placed=[];let tries=0;
  while(placed.length<30&&tries<4000){tries++;
    const x=2+Math.floor(hash2(tries,470,611)*(W-4)),y=2+Math.floor(hash2(tries,470,613)*(H-4)),o=(hash2(x,y,617)*4)|0,open=dirs[o];
    if(placed.some(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)<14))continue;
    // the standing square and the three squares round it, and the two open squares in front, must be free
    const cells=[];let ok=free(x,y)&&free(x+open[0],y+open[1])&&free(x+open[0]*2,y+open[1]*2);
    for(const [dx,dy] of dirs)if(ok&&(dx!==open[0]||dy!==open[1])){if(free(x+dx,y+dy))cells.push([x+dx,y+dy]);else ok=false}
    if(!ok)continue;
    // the two squares beside the open one are rock as well, so the mouth is one square wide
    const sx=-open[1],sy=open[0];for(const s of [-1,1]){const cx=x+open[0]+sx*s,cy=y+open[1]+sy*s;if(free(cx,cy))cells.push([cx,cy])}
    placed.push([x,y]);cells.forEach(([cx,cy],i)=>{L.decor.push({k:hash2(cx,cy,619)<.5?'hg_rock0':'hg_rock1',x:cx,y:cy,block:true,sc:.9+hash2(cx,cy,621)*.25});mark(cx,cy,1)});mark(x,y,2)}}
{const _ll2=loadLevel;loadLevel=function(n){_ll2.apply(this,arguments);try{if(LEVEL===470)hgNooks()}catch(e){console.error(e)}}}
