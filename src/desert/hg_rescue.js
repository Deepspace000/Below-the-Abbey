/* ==========================================================================
   (From the owner's later request every hive has a rescue of eight villagers of its own: HGRS below; the Hush, Droning and Amber ones are hgrescue1 to 3, captured in honey, silk and wax.)
   THE FROGS IN THE HONEY: a rescue in the Queen's Hive (level 474). The Queen has taken eight villagers of the grassland into her hive and tied them up in honey, in eight of her chambers.
   The party finds them, walks into each one (or taps it, or presses attack in front of it) and frees it: the honey runs off, the frog thanks the party and goes. When the eighth is free the quest
   is done and the villagers give the party their spear, a high level weapon. The quest belongs to the Queen's Dictionary: Aldous Wend, who sends the party into the hive for the dictionary, tells of
   the missing villagers when that quest is taken (and the party is told again at the hive's door if it came some other way). The pictures are the villager frogs coated in honey and roped
   (tools/make_bound_frogs.py makes them from hg_npc0, 1, 3, 5 and 6). Last in the injection order.
   ========================================================================== */
const HGR={ID:474,N:8,SRC:[0,1,3,5,6]};
/* the four rescues, one per hive: h 0 Hush (honey), 1 Droning (silk cocoons), 2 Amber (wax cells), 3 Queen's (honey; the quest hgrescue and the flag hgFreed are the original ones) */
const HGRS=[
 {h:0,ID:471,q:'hgrescue1',flag:'hgFreed1',spr:'hg_bh0_',title:'Caught in the Clover Honey',hive:'the Hush Hive',how:'caught in honey',reward:{gold:1100,xp:14000},
  names:['Wib','Granny Plop','Dunk','Little Murp','Aunt Slosh','Old Fleb','Gribb','Mama Tuk'],
  free:'The pale honey cracks and runs off in slow cream-coloured strings. The frog steps out of the ropes, takes your hands and bows again and again.',
  say:['Oh, thank you! I only came in for one little taste. I have been stuck here for nine days.','You came for me! I knew somebody would. Look, I stayed very polite the whole time.','My feet! I have feet again! Never take feet for granted, dears.','I was told the honey here was free. It is not free. It is very, very sticky.','Bless your boots. If you ever come through Ulb, my kettle is always warm.','Careful on the way out, the floor is a bit cheerful with honey.','Free at last! I shall tell the pond all about you, and the pond will not stop talking.'],
  last:'That is all eight of us out. We have no gold to give, but you have our thanks, and a very sticky handshake.'},
 {h:1,ID:472,q:'hgrescue2',flag:'hgFreed2',spr:'hg_bh1_',title:'Wrapped in Silk',hive:'the Droning Hive',how:'hung in silk cocoons',reward:{gold:1300,xp:17000},
  names:['Mibb','Grandpa Thole','Squib','Little Dorp','Mama Fen','Old Brum','Tink','Auntie Plunk'],
  free:'The silk parts and falls away in grey strands. The frog drops to the floor, takes your hands and bows again and again.',
  say:['Out of a cocoon at last! I was starting to think I would come out with wings.','The silk was nice at first. Then it was not nice. Then it was extremely not nice.','You cut me down! I have been hanging about for days and I did not enjoy a minute of it.','Mind the drone, dears. It hums the whole time, and the tune is dreadful.','I never knew I was ticklish until the spiders arrived. Thank you.','At my age I should not be hung from a ceiling. Thank you, and good day.','Free! I shall sleep in a proper bed and never look at a hammock again.'],
  last:'All eight of us are out of the silk. The Droning Hive owes you an apology, and we thank you in its place.'},
 {h:2,ID:473,q:'hgrescue3',flag:'hgFreed3',spr:'hg_bh2_',title:'Sealed in the Wax',hive:'the Amber Hive',how:'sealed in wax cells',reward:{gold:1400,xp:18500},
  names:['Plub','Aunt Gurp','Wob','Little Smeek','Mother Dribb','Old Skreb','Nubb','Granny Clop'],
  free:'The wax cell cracks open and falls away in warm amber pieces. The frog steps out, takes your hands and bows again and again.',
  say:['I was sealed in a wax cell like a spare jar of jam. Thank you for opening me.','The wax was warm and the company was awful. Mostly it was me, talking to myself.','You broke the cell! Mind the bits, they are sharp when they are cold.','I counted the hexagons for three days. There are a great many.','Tell my mother I was not scared. Do not tell her I was scared. Either way, thank you.','I was so polite to the wall for so long that I forgot how to be rude. Thank you.','Out! I will walk home slowly and enjoy every single open door.'],
  last:'That is all eight of us out of the cells. The Amber Hive kept us warm, but we will not be going back.'},
 {h:3,ID:474,q:'hgrescue',flag:'hgFreed',spr:'hg_bound',title:'Freed from the Honey',hive:'the Queen’s Hive',how:'tied up in honey',reward:{gold:1500,xp:20000,items:['hgfrogspear']},
  names:['Pibb','Granny Slomp','Thrup','Little Wibble','Mama Gloop','Old Dreb','Blep','Auntie Quibb'],
  free:'The honey cracks and runs off in long gold strings. The frog steps out of the ropes, takes your hands and bows again and again.',
  say:['Oh, thank you, thank you! I have been stuck in this honey since the harvest. I can feel my feet again!','You came! I told them somebody would come. Mind the wasps on your way out, dears.','I thought I would be a candle by now. Bless you, strangers, bless you.','I was only looking for my goat! Thank you for the honey off my back.','My family will weep when they hear. Tell them nothing, I want to see their faces.','At my age, to be glued to a wall! Never again. Take care of yourselves.','Free! Free! I will hop home and I will never go near a hive again.'],
  last:'That is the last of us, and the Queen was keeping something else of ours. The spear of our village, the Amberthorn, was hidden in the wax. Take it, with our thanks.'}];
const hgrOf=n=>HGRS.find(r=>r.ID===n);
for(const r of HGRS)for(let i=0;i<5;i++){loadImg(r.spr+i,'assets/'+r.spr+i+'.png');NPC_H[r.spr+i]=[1.5,1.4,1.12,1.45,1.45][i]}
// the spear the villagers give (a reward only: it is not added to the shops or the chests)
gw('hgfrogspear','Amberthorn Spear','Sword',80,[88,120],.08,{str:38},9000,'#e8a830',{stun:.12,bleed:[.25,10,3]},'The oldest spear of the frogfolk, shaft of pond ash and a head of amber as hard as steel. One hit in eight knocks the foe senseless, and a quarter of the hits leave it bleeding.');
{const k=GEAR.indexOf('hgfrogspear');if(k>=0)GEAR.splice(k,1)}
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('hgfrogspear');
for(const r of HGRS){const own=r.h===3;
  QUESTS[r.q]={title:r.title,who:'Aldous Wend',desc:'Eight villagers of the grassland were taken into '+r.hive+' and '+r.how+'. Find them in the hive and walk into each one to free it. Aldous Wend says the villagers will be grateful'+(own?', and will give a great reward.':'. The book he wants is in the same hive.'),need:HGR.N,
    goal:()=>Math.min(HGR.N,G.flags[r.flag]||0),reward:r.reward};QAREA[r.q]='The Hollow Grasslands'}
/* the eight, put in eight chambers of each hive when it is built (the same places every time): in the lit chamber centres, well apart, out of the way of the door and the boss, and where the party can walk to them */
function hgrPlace(){
  const r=hgrOf(LEVEL),L=r&&LEVELS[r.ID];if(!L||L._frogs||!L.rows||!L.lights)return;L._frogs=1;
  const rows=L.rows,st=L.start,qe=(L.enemies||[]).find(e=>e.t==='hgboss'+(r.h+1)),busy=new Set(),blk=new Set();
  for(const o of [...(L.enemies||[]),...(L.items||[]),...(L.decor||[])])if(o){busy.add(o.x+','+o.y);if(o.block)blk.add(o.x+','+o.y)}
  const dist=new Map([[st.x+','+st.y,0]]),qq=[[st.x,st.y]];
  for(let k=0;k<qq.length;k++){const [x,y]=qq[k];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const K=(x+dx)+','+(y+dy);if(!dist.has(K)&&rows[y+dy]&&rows[y+dy][x+dx]==='.'&&!blk.has(K)){dist.set(K,dist.get(x+','+y)+1);qq.push([x+dx,y+dy])}}}
  const open=(x,y)=>rows[y]&&rows[y][x]==='.'&&!busy.has(x+','+y)&&dist.has(x+','+y);
  const nodes=L.lights.filter(p=>Math.hypot(p[0]-st.x,p[1]-st.y)>7&&!(qe&&Math.hypot(p[0]-qe.x,p[1]-qe.y)<5)).map(p=>({p,r:hash2(p[0],p[1],5151)})).sort((a,b)=>a.r-b.r);
  let chosen=[];
  for(const gap of [8,7,6,5,4]){chosen=[];
    for(const n of nodes){if(chosen.length>=HGR.N)break;if(chosen.some(c=>Math.hypot(c[0]-n.p[0],c[1]-n.p[1])<gap))continue;
      let spot=null;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[2,0],[0,2],[-1,1],[1,-1]])if(open(n.p[0]+dx,n.p[1]+dy)){spot=[n.p[0]+dx,n.p[1]+dy];break}
      if(spot)chosen.push(spot)}
    if(chosen.length>=HGR.N)break}
  // they stand on the floor where they were caught (a hive chamber is too low to hang a person from, and up under the ceiling they could not be seen);
  // the pictures have a little empty space under the feet, taken back with a small negative lift
  chosen.forEach((p,i)=>{const k=r.spr+(i%5),sc=.95,h=(NPC_H[k]||1.45)*sc;L.decor.push({k,x:p[0],y:p[1],block:false,walk:true,npc:'hgbound',sc,bob:r.h===1?-.07*h:r.h===2?0:-.05*h})})}   // (empty space under the feet: hg_bh1_ 7 per cent, hg_bh0_ and hg_bound 5, hg_bh2_ none)
{const _ll=loadLevel;loadLevel=function(n){_ll.apply(this,arguments);try{if(hgrOf(LEVEL))hgrPlace()}catch(e){console.error(e)}}}
const hgrIndex=d=>{const L=LEVELS[LEVEL];let k=0;for(const q of L.decor){if(q.npc==='hgbound'){if(q.x===d.x&&q.y===d.y)return k;k++}}return 0};
function hgFreeFrog(d){
  const F=G.flags,l=hgLvl(),r=hgrOf(LEVEL)||HGRS[3],i=hgrIndex(d),nm=r.names[i%HGR.N];
  if(qSt(r.q)===null)qAccept(r.q);
  d.found=true;d.block=false;F[r.flag]=(F[r.flag]||0)+1;sfx('key');
  const n=F[r.flag],last=n>=HGR.N;
  msg(`${nm} is free. ${Math.min(n,HGR.N)} of ${HGR.N} villagers freed.`,'#ffe36a');
  const speech=last?r.last:r.say[i%7];
  const body=r.free+' '+nm+' says: "'+hgGarble(speech,l)+'"'+hgFoot(l);
  if(last)return say(body,[[r.h===3?'Take the spear.':'Go home safely.',()=>{try{if(qReady(r.q))qTurnIn(r.q)}catch(e){console.error(e)}return say('The frogs hop away through the tunnels, singing. They will tell the whole grassland what you did.',[BYE])}]]);
  return say(body,[['Go home safely.',()=>null]])}
NPCS.hgbound={name:'A villager in the hive',img:'hg_npc0',root:d=>hgFreeFrog(d)};
{const _st=startTalk;startTalk=function(d){if(d&&d.npc==='hgbound'){const i=hgrIndex(d);d.kname=(hgrOf(LEVEL)||HGRS[3]).names[i%HGR.N];NPCS.hgbound.img='hg_npc'+HGR.SRC[i%5]}return _st.apply(this,arguments)}}
// walking into one frees it, as tapping it or pressing attack in front of it does
{const _dm=doMove;doMove=function(rel){try{const dir=DIRS[(G.P.f+rel)%4],nx=G.P.x+dir[0],ny=G.P.y+dir[1],fd=G.decor.find(q=>q.npc==='hgbound'&&!q.found&&q.x===nx&&q.y===ny);if(fd&&G.state==='play'&&!G.talk){startTalk(fd);return}}catch(e){console.error(e)}return _dm.apply(this,arguments)}}
/* each rescue belongs to the book of its hive: it is taken with the book (hgb1 with the Hush Hive and so on), and offered again at the hive's door */
{const _qa=qAccept;qAccept=function(id){const r=_qa.apply(this,arguments);
  try{const m=/^hgb([1-4])$/.exec(id),h=m?HGRS[+m[1]-1]:null;
    if(h&&qSt(h.q)===null&&!(G.flags[h.flag]>=HGR.N)){qAccept(h.q);msg(h.h===3?'Aldous Wend: "Eight of our villagers were dragged into that hive and tied up in honey. If you find them, free them. They have a gift for you."':'Aldous Wend: "The hive has taken eight of our villagers, '+h.how+'. Free them as you pass, and the grassland will be grateful."','#ffe36a')}}catch(e){console.error(e)}
  return r}}
{const _g=goToLevel;goToLevel=function(n){const r=_g.apply(this,arguments);try{const h=hgrOf(n);if(h&&qSt(h.q)===null&&!(G.flags[h.flag]>=HGR.N)){qAccept(h.q);msg('Small voices are calling for help somewhere in the hive.','#ffe36a')}}catch(e){console.error(e)}return r}}
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
/* THE BOOKS ON THEIR LECTERNS: in each of the four hives the language book lies on its lectern, which now glows gold so that it can be seen from far down the tunnels. The lectern can be walked onto
   and the book is taken from it (the book used to lie on the floor beside it). */
loadImg('hg_lecternglow','assets/hg_lecternglow.png');NPC_H.hg_lecternglow=1.92;
function hgLecterns(n){
  const L=LEVELS[n];if(!L||L._glow||!L.decor)return;L._glow=1;
  const lec=L.decor.find(d=>d.k==='hg_lectern');if(!lec)return;
  lec.k='hg_lecternglow';lec.block=false;lec.walk=true;lec.deco=true;
  const bk=(L.items||[]).find(i=>i.k==='hgbook'+(n-470));if(bk){bk.x=lec.x;bk.y=lec.y}
  if(L.lights&&!L.lights.some(p=>p[0]===lec.x&&p[1]===lec.y))L.lights.push([lec.x,lec.y])}
{const _ll3=loadLevel;loadLevel=function(n){_ll3.apply(this,arguments);try{if(LEVEL>=471&&LEVEL<=474)hgLecterns(LEVEL)}catch(e){console.error(e)}}}
