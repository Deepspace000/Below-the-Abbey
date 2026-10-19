/* ==========================================================================
   THE HOLLOW GRASSLANDS. A wide dark grassland under a sky that is never lit, with the wind always in it. Strange rocks sit on the low hills, the
   little villages are white round houses behind spiked wooden fences, and on the hills the insectivores sit in wait. Four beehive dungeons lie scattered
   over it. The people are frog-like and speak a tongue the party cannot follow until it has found the four books in the hives (see hollowgrass_talk.js).
   Levels: 470 the grassland, 471 to 474 the four hives. The way in is a spiked gate at the east end of the high ledge in the Hollow Land (level 364).
   ========================================================================== */
const HG={ID:470,HIVES:[471,472,473,474],W:150,H:150,DIFF:40,START:{x:75,y:142}};
const HG_TOWNS=[{k:'exsce',n:'Exsce',x:75,y:106},{k:'ulb',n:'Ulb',x:26,y:84},{k:'glorm',n:'Glorm',x:124,y:82},{k:'wexsh',n:'Wexsh',x:42,y:36},{k:'nibb',n:'Nibb',x:112,y:30}];
const HG_HIVE_AT=[[22,122],[128,116],[76,58],[80,12]];
const HG_HIVE_NAMES=['The Hush Hive','The Droning Hive','The Amber Hive','The Queen’s Hive'];
for(let i=0;i<10;i++){loadImg('hg_ins'+i,'assets/hg_ins'+i+'.png');loadImg('hg_ins'+i+'A','assets/hg_ins'+i+'A.png')}
for(const n of ['hg_frog0','hg_frog1','hg_swarm0','hg_swarm1','hg_swarm0A','hg_swarm1A','hg_larva','hg_larvaA','hg_wasp','hg_waspA','hg_golem','hg_golemA','hg_queen','hg_queenA','hg_house0','hg_house1','hg_house2','hg_arch','hg_lamp','hg_pillar','hg_tower0','hg_tower1','hg_tower2','hg_tower3','hg_tower4','hg_tower5','hg_tower6','hg_tower7','hg_palisade','hg_gate','hg_rock0','hg_rock1','hg_hive','hg_well','hg_chestwax','hg_chestweed','hg_chestjelly','hg_waxbarrel','hg_jar','hg_lectern','hg_eggs','hg_wizard','hg_npc0','hg_npc1','hg_npc3','hg_npc4','hg_npc5','hg_npc6'])loadImg(n,'assets/'+n+'.png');
Object.assign(NPC_H,{hg_frog0:1.0,hg_frog1:1.0,hg_house0:3.1,hg_house1:2.5,hg_house2:3.4,hg_arch:2.6,hg_lamp:2.2,hg_pillar:2.4,hg_tower0:5,hg_tower1:5,hg_tower2:5,hg_tower3:5,hg_palisade:1.6,hg_gate:2.1,hg_rock0:3.0,hg_rock1:2.2,hg_hive:3.2,hg_well:1.7,hg_chestwax:.62,hg_chestweed:.62,hg_chestjelly:.62,hg_waxbarrel:.95,hg_jar:1.1,hg_lectern:1.1,hg_eggs:.95,hg_wizard:1.35,hg_npc0:1.35,hg_npc1:1.25,hg_npc3:1.0,hg_npc4:1.4,hg_npc5:1.3,hg_npc6:1.3});
CONTAINERS.push('hg_chestwax','hg_chestweed','hg_chestjelly','hg_waxbarrel','hg_jar');
LEVEL_NAMES[HG.ID]='The Hollow Grasslands';HG.HIVES.forEach((id,i)=>LEVEL_NAMES[id]=HG_HIVE_NAMES[i]);
LEVEL_RATING[HG.ID]=HG.DIFF;HG.HIVES.forEach((id,i)=>LEVEL_RATING[id]=HG.DIFF+i*2);
WORLD_LOCS.push({k:'hollowgrass',n:'The Hollow Grasslands',sub:'a dark grassland beyond the Hollow Land',lv:[470,471,472,473,474],x:-6,y:290,ic:'trees'});
WIND_AMT[HG.ID]=1; // the wind is always in the grass
/* ---------- the creatures ---------- */
const HG_INS=[['Mire Tick',30,[3,6],.9],['Reed Skitter',38,[4,7],1.1],['Pond Stalker',48,[5,9],1.35],['Barbed Lurker',60,[6,11],1.6],['Gulping Mantis',74,[7,13],1.9],['Dusk Weaver',90,[8,15],2.2],['Glass-Eyed Hunter',110,[10,18],2.6],['Hollow Crawler',135,[11,20],3.0],['Spindle Tyrant',165,[13,23],3.5],['The Great Insectivore',210,[15,28],4.2]];
HG_INS.forEach((r,i)=>{ENEMY_DEF['hgins'+i]={name:r[0],hp:r[1],dmg:r[2],hit:.72+i*.012,w:r[3],img:'hg_ins'+i,xp:70+i*50,gold:[0,0],speed:1,verb:i<5?'bites':'impales',aboveParty:0,kind:'insectivore'}});
Object.assign(ENEMY_DEF,{
  hgswarm0:{name:'Biter Swarm',hp:26,dmg:[3,6],hit:.7,w:1.3,img:'hg_swarm0',xp:55,gold:[0,0],speed:2,fly:true,wander:true,verb:'stings',kind:'swarm'},
  hgswarm1:{name:'Moth Cloud',hp:22,dmg:[3,5],hit:.68,w:1.3,img:'hg_swarm1',xp:50,gold:[0,0],speed:2,fly:true,wander:true,verb:'bites',kind:'swarm'},
  hglarva:{name:'Hive Grub',hp:55,dmg:[5,9],hit:.72,w:1.3,img:'hg_larva',xp:90,gold:[0,6],speed:1,verb:'gnaws'},
  hgwasp:{name:'Hive Guard',hp:62,dmg:[6,11],hit:.78,w:.85,img:'hg_wasp',xp:120,gold:[2,12],speed:1,verb:'stabs'},
  hggolem:{name:'Wax Golem',hp:110,dmg:[8,15],hit:.74,w:1.45,img:'hg_golem',xp:170,gold:[4,16],speed:1,verb:'pounds'},
  hgboss1:{name:'Captain of the Hush Hive',hp:200,dmg:[10,18],hit:.82,w:1.25,img:'hg_wasp',xp:280,gold:[60,120],speed:1,verb:'spears',boss:true,aboveParty:2},
  hgboss2:{name:'The Droning Warden',hp:300,dmg:[12,21],hit:.82,w:2.1,img:'hg_golem',xp:420,gold:[80,150],speed:1,verb:'crushes',boss:true,aboveParty:3},
  hgboss3:{name:'The Mother Grub',hp:360,dmg:[13,23],hit:.82,w:2.4,img:'hg_larva',xp:560,gold:[100,180],speed:1,verb:'devours',boss:true,aboveParty:3},
  hgboss4:{name:'The Hive Queen',hp:480,dmg:[16,28],hit:.85,w:2.3,img:'hg_queen',xp:900,gold:[150,260],speed:1,verb:'stings',boss:true,aboveParty:4}});
for(const k of ['hgboss1','hgboss2','hgboss3','hgboss4'])if(typeof NO_VARY!=='undefined')NO_VARY.push(k);
/* ---------- foods, books, weapons and armour ---------- */
const HG_FOOD=[ // [id, name, colour, health, hunger, price, description]
 ['hgcomb','Hive Honeycomb','#e8b030',16,60,12,'A lump of golden comb, still dripping. Thick, sweet and chewy.'],
 ['hgjelly','Royal Jelly','#f0e0a0',26,90,30,'A small jar of pale, tingling jelly from the queen’s own cells. It tastes of flowers and pepper.'],
 ['hggrubs','Fried Hive Grubs','#c8a860',14,70,10,'A plate of grubs fried in wax. They crunch, and taste like roasted nuts.'],
 ['hgkelp','Pickled Pond Kelp','#4a5a38',12,50,8,'A tied bundle of kelp pickled in brine. Salty, sour and slippery.'],
 ['hgroot','Water-Lily Root','#d8d0b8',10,55,6,'A pale, starchy root dug out of the pond mud. Mild, like a potato.'],
 ['hgpond','Cloudy Pond Water','#78b890',8,25,7,'A flask of cloudy green water that glows faintly. The locals drink it. It tastes of pennies.']];
for(const [id,n,c,heal,feed,price,d] of HG_FOOD)ITEMDEF[id]={n,k:'food',t:'Meal',ic:'bread',c,heal,feed,stack:1,price,d:'Meal. Fills '+feed+' hunger and restores '+heal+' health. '+d,sw:.3};
ITEMDEF.hgreed={n:'Reed Bundle',k:'quest',t:'Reeds',ic:'ore',c:'#6a8a4a',stack:1,price:4,d:'A bundle of tall pond reeds, tied with a strip of bark. The villagers use them for roofs and rope.',sw:.2};
ITEMDEF.hgegg={n:'Amber Egg',k:'quest',t:'Treasure',ic:'ore',c:'#e0a030',stack:1,price:140,d:'A hard, glowing egg-shaped lump of amber. A shop pays about 140 gold for it.',sw:.3};
ITEMDEF.hgcrystal=Object.assign({},ITEMDEF.hgegg,{n:'Honey Crystal',d:'A crystal of honey hardened over many years. A shop pays about 140 gold for it.'});
const HG_BOOKS=[['The Primer of Ripples','#8a6a3a','A thin book of simple pictures and the words that go with them, written in the speech of the grasslands. Reading it, the party will follow a little of what the folk say.'],
 ['The Book of Small Courtesies','#7a6a4a','Greetings, thanks and the ordinary things people say to one another, written out in the grassland tongue.'],
 ['The Grammar of the Deep Water','#5a6a58','A heavy book that explains how the grassland tongue is put together. With it, most of what the folk say can be followed.'],
 ['The Queen’s Dictionary','#b88a30','A great book of every word in the grassland tongue, kept by the Hive Queen. With it, the party can follow everything the folk say.']];
HG_BOOKS.forEach((b,i)=>{ITEMDEF['hgbook'+(i+1)]={n:b[0],k:'quest',t:'Book',ic:'ore',c:b[1],stack:0,price:0,d:b[2],sw:.6}});
gw('hgsting','Stinger Blade','Sword',40,[34,48],.04,{str:24},2400,'#c89030',{bleed:[.3,6,3]},'A short blade made from the stinger of a giant hive insect. Three hits in ten leave the foe bleeding.');
gw('hgmandible','Mandible Axe','Axe',40,[38,54],-.02,{str:26},2600,'#8a7a40',{cleave:1},'An axe with a blade of serrated chitin. Every hit also cuts the foe standing behind the first.');
gw('hgbarb','Barbed Chitin Spear','Sword',35,[28,40],.06,{str:22},1700,'#7a6a3a',{stun:.15},'A long spear with a barbed tip. One hit in seven knocks the foe senseless for a round.');
ga('hgcarapace','shield','Carapace Shield','Shield',30,14,1100,'#8a8a3a',{thorns:5},'A round shield of overlapping beetle shells. Every enemy that strikes you takes 5 damage.');
ARM_SET_OF.hgchit={name:'Chitin Warden',bonus:{thorns:6,ward:3},btxt:'Every enemy that strikes you takes 6 damage, and every blow on you is 3 lighter.',lv:35,key:'hgchit'};
[['h','head','Chitin Helm','head',.55,'dodge'],['c','chest','Chitin Cuirass','chest',1,'ward'],['a','arms','Chitin Gauntlets','arms',.35,'thorns'],['l','legs','Chitin Greaves','legs',.45,'dodge']].forEach(([sx,slot,nm,ic,f,k])=>{
  const id='ar_hgchit_'+sx,t=3.5,v=k==='dodge'?.05:k==='ward'?5:7,pas={};pas[k]=v;
  ITEMDEF[id]={n:nm,k:slot,t:slot==='head'?'Helm':slot==='chest'?'Chest':slot==='arms'?'Arms':'Legs',ic,c:'#8a7a3a',armor:Math.max(2,Math.round(19*f)),price:Math.round(1000*f),lvl:35,pas,set:'hgchit',tier:35,
    d:(k==='dodge'?'Enemies miss 5% more.':k==='ward'?'Every blow on you is 5 lighter.':'Every enemy that strikes you takes 7 damage.')+' Set: Chitin Warden. All four pieces give: '+ARM_SET_OF.hgchit.btxt+' Needs level 35.',sw:slot==='head'?.38:slot==='chest'?.46:.4,gear:1};
  GEAR.push(id);ARM_IDS.push(id);void t});
const HG_GEAR=['hgsting','hgmandible','hgbarb','hgcarapace','ar_hgchit_h','ar_hgchit_c','ar_hgchit_a','ar_hgchit_l'];
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push(...HG_FOOD.map(f=>f[0]),'hgreed','hgegg','hgcrystal','hgbook1','hgbook2','hgbook3','hgbook4',...HG_GEAR);
/* chests, barrels and jars in the grasslands and the hives: foods first, a potion, a little gold, and the chitin gear now and then */
{const _lf=lootFor;lootFor=function(d){
  if(LEVEL>=HG.ID&&LEVEL<=HG.HIVES[3]&&d&&/^hg_(chest|waxbarrel|jar)/.test(d.k)){
    const r=k=>hash2(d.x,d.y,900+k),it=[],add=(id,n)=>it.push({id,n:ITEMDEF[id]&&ITEMDEF[id].stack?(n||1):1}),chest=/chest/.test(d.k),F=HG_FOOD.map(f=>f[0]);
    add(F[(r(1)*F.length)|0],2+((r(2)*3)|0));if(r(3)<.6)add(F[(r(4)*F.length)|0],2);
    if(r(5)<.5)add(potionFor(r(6)));
    if(chest&&r(7)<.4)add(HG_GEAR[(r(8)*HG_GEAR.length)|0]);
    if(r(9)<.2)add('hgcrystal');
    d.gold=chest?60+Math.floor(r(10)*180):10+Math.floor(r(11)*50);return it}
  return _lf.apply(this,arguments)}}
/* ---------- the walls of the hives: honeycomb, drawn in code ---------- */
function hgWaxTex(){
  if(IMG.hg_wax)return;
  IMG.hg_wax=mkCanvas(128,128,(x,w,h)=>{
    x.fillStyle='#3a2208';x.fillRect(0,0,w,h);const R=15,hh=R*Math.sqrt(3);
    for(let r=-1;r<9;r++)for(let c=-1;c<9;c++){const cx=c*R*1.5+8,cy=r*hh+(c%2?hh/2:0)+6,v=hash2(c+9,r+9,61),sh=Math.floor(185+v*60);
      x.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;x.lineTo(cx+(R-1.5)*Math.cos(a),cy+(R-1.5)*Math.sin(a))}x.closePath();
      const gr=x.createRadialGradient(cx-3,cy-4,2,cx,cy,R);gr.addColorStop(0,`rgb(${sh+50},${sh-10},${Math.floor(30+v*30)})`);gr.addColorStop(1,`rgb(${sh-50},${sh-90},18)`);x.fillStyle=gr;x.fill()}
    x.fillStyle='rgba(255,200,80,.18)';for(let i=0;i<9;i++)x.fillRect(hash2(i,1,62)*w,hash2(i,2,62)*h,2,12+hash2(i,3,62)*30)}); // the odd drip of honey
}
/* ---------- the four hives ---------- */
function hgHive(i){
  const id=HG.HIVES[i];if(LEVELS[id])return;hgWaxTex();
  const W=62,H=62,sd=id*11+5,hs=hash2,g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  OH_STY.hgwax=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:'hg_wax',door:'hg_wax',win:'hg_wax',alt:'hg_wax',zoom:1,contrast:1.05,tint:[255,255,255,0]});
  const TM=ohTiles(),wall=TM.make('plain','hgwax',2.7).gid,door=String.fromCharCode(0x2f0),dgid=KH_NEXT_GID++;T_TILE[dgid]=wdExitTile(2.7,'cave',[255,200,120]);KH_DOOR[dgid]={lvl:HG.ID,at:{x:HG_HIVE_AT[i][0],y:HG_HIVE_AT[i][1]+2,f:2}};
  const chars={'#':wall};chars[door]=dgid;
  // the cells of the hive: centres on a staggered lattice, joined by short tunnels
  const cols=6,rowsN=7,cell=(c,r)=>({c,r,x:Math.round(6+c*9+(r%2?4.5:0)),y:Math.round(6+r*8.2),on:false}),nodes=[];
  for(let r=0;r<rowsN;r++)for(let c=0;c<cols;c++)nodes.push(cell(c,r));
  const at=(c,r)=>nodes.find(n=>n.c===c&&n.r===r);
  const nbrs=n=>{const o=[[n.c-1,n.r],[n.c+1,n.r]],e=n.r%2?[0,1]:[-1,0];for(const dr of [-1,1])for(const dc of e)o.push([n.c+dc,n.r+dr]);return o.map(([c,r])=>at(c,r)).filter(Boolean)};
  const keep=n=>hs(n.c,n.r,sd)<.82||(n.c===2&&n.r===rowsN-1);
  const start=at(2,rowsN-1);start.on=true;const q=[start],edges=[],dist=new Map([[start,0]]);
  for(let k=0;k<q.length;k++){const n=q[k];for(const m of nbrs(n)){if(!keep(m))continue;if(!m.on){m.on=true;dist.set(m,dist.get(n)+1);q.push(m);edges.push([n,m])}else if(hs(n.c*7+m.c,n.r*5+m.r,sd+1)<.3&&!edges.some(e=>(e[0]===n&&e[1]===m)||(e[0]===m&&e[1]===n)))edges.push([n,m])}}
  const rad=n=>(hs(n.c,n.r,sd+2)<.35?2.5:3.4);
  for(const n of q){const R=rad(n);for(let y=Math.floor(n.y-R);y<=n.y+R;y++)for(let x=Math.floor(n.x-R);x<=n.x+R;x++)if(x>1&&y>1&&x<W-2&&y<H-2&&Math.hypot(x-n.x,y-n.y)<=R)g[y][x]='.'}
  for(const [a,b] of edges){let x=a.x,y=a.y;const sx=Math.sign(b.x-a.x),sy=Math.sign(b.y-a.y);while(x!==b.x||y!==b.y){if(x!==b.x&&(y===b.y||hs(x,y,sd+3)<.5))x+=sx;else y+=sy;for(const [ox,oy] of [[0,0],[1,0],[0,1]]){const xx=x+ox,yy=y+oy;if(xx>1&&yy>1&&xx<W-2&&yy<H-2)g[yy][xx]='.'}}}
  // the way out: the door in the wall below the first cell
  const sx=start.x,sy=start.y+Math.floor(rad(start))-0;let doorY=sy;while(g[doorY+1]&&g[doorY+1][sx]==='.')doorY++;g[doorY+1][sx]=door;
  const sp={x:sx,y:doorY};
  // far cell: the boss room
  let far=start,fd=-1;for(const n of q){if(dist.get(n)>fd){fd=dist.get(n);far=n}}
  const used=new Set([sp.x+','+sp.y]),cells=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(g[y][x]==='.'&&Math.hypot(x-sp.x,y-sp.y)>7)cells.push([x,y]);
  const pick=k=>{for(let t=0;t<80;t++){const c=cells[(hs(k,t,sd+4)*cells.length)|0];if(c&&!used.has(c[0]+','+c[1])){used.add(c[0]+','+c[1]);return c}}return null};
  const inFar=(x,y)=>Math.hypot(x-far.x,y-far.y)<=rad(far)+1;
  const decor=[],enemies=[],items=[],lights=[];
  for(const n of q){lights.push([n.x,n.y]);if(n!==start)decor.push({k:'hg_eggs',x:n.x,y:n.y,block:false,walk:true,deco:true,sc:.9})}
  const kinds=[['hglarva','hgswarm0'],['hglarva','hgwasp','hgswarm0','hgswarm1'],['hgwasp','hggolem','hgswarm1','hglarva'],['hgwasp','hggolem','hglarva','hgswarm0','hgswarm1']][i];
  const nFoe=12+i*4;for(let k=0;k<nFoe;k++){const c=pick(100+k);if(c&&!inFar(c[0],c[1])||(c&&k%3===0))enemies.push({t:kinds[(hs(k,i,sd+5)*kinds.length)|0],x:c[0],y:c[1]})}
  const bossT='hgboss'+(i+1);enemies.push({t:bossT,x:far.x,y:far.y+1});
  decor.push({k:'hg_lectern',x:far.x,y:far.y-2,block:true});items.push({k:'hgbook'+(i+1),x:far.x+1,y:far.y-2});used.add(far.x+','+(far.y-2));used.add((far.x+1)+','+(far.y-2));
  const CH=['hg_chestwax','hg_chestweed','hg_chestjelly'];
  for(let k=0;k<4+i;k++){const c=pick(200+k);if(c)decor.push({k:CH[(hs(k,i,sd+6)*3)|0],x:c[0],y:c[1],block:true})}
  for(let k=0;k<9;k++){const c=pick(300+k);if(c)decor.push({k:k%2?'hg_waxbarrel':'hg_jar',x:c[0],y:c[1],block:true})}
  for(let k=0;k<26;k++){const c=pick(400+k);if(c)decor.push({k:'hg_eggs',x:c[0],y:c[1],block:true,sc:.7+hs(k,3,sd+7)*.4})}
  for(let k=0;k<12;k++){const c=pick(500+k);if(c)items.push({k:['hgcomb','hgcomb','hgjelly','hggrubs'][k%4],x:c[0],y:c[1]})}
  const lv={rows:g.map(r=>r.join('')),start:{x:sp.x,y:sp.y-1,f:0},enemies,items,decor,chars,day:0,floor:'wood',name:HG_HIVE_NAMES[i],label:HG_HIVE_NAMES[i],diff:HG.DIFF+i*2,ceilH:2.7,torchGap:1e9,noTele:true,portals:[],lights,
    mapNames:[{t:HG_HIVE_NAMES[i],x:sp.x,y:H-1,k:'place'},{t:i===3?'The Queen’s Cell':'The Heart of the Hive',x:far.x,y:far.y-4,k:'place'}]};
  LEVELS[id]=lv;
}
