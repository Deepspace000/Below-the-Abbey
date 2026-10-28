/* ==========================================================================
   COLLECTING: butterflies (a cage, then a hand to catch them), herbs picked off the ground, and shovels for treasure hunting.
   The Collection menu (Menu, More, Collection) holds the logs of the gems, the butterflies and the herbs.
   ========================================================================== */
/* ---------- butterflies: [key, name, value, weight (how common)] ---------- */
const BFLIES=[
 ['cabbagewhite','Cabbage White',10,10],['brimstone','Brimstone',11,9],['cloudedyellow','Clouded Yellow',12,8],['orangetip','Orange Tip',12,8],['smallcopper','Small Copper',13,8],
 ['commonblue','Common Blue',13,8],['hollyblue','Holly Blue',14,7],['meadowbrown','Meadow Brown',10,10],['speckledwood','Speckled Wood',11,9],['ringlet','Ringlet',12,8],
 ['gatekeeper','Gatekeeper',12,8],['smalltortoiseshell','Small Tortoiseshell',14,7],['redadmiral','Red Admiral',18,6],['peacock','Peacock',20,6],['paintedlady',"Painted Lady",20,6],
 ['comma','Comma',16,6],['marbledwhite','Marbled White',17,6],['chalkhillblue','Chalkhill Blue',18,5],['greenhairstreak','Green Hairstreak',22,4],['purplehairstreak','Purple Hairstreak',24,4],
 ['brownargus','Brown Argus',15,6],['wallbrown','Wall Brown',16,5],['silverwashed','Silver-washed Fritillary',26,3],['darkgreenfrit','Dark Green Fritillary',28,3],['swallowtail','Swallowtail',30,3],
 ['camberwell','Camberwell Beauty',60,1.2],['purpleemperor','Purple Emperor',90,.9],['glasswing','Glasswing',120,.6],['moonwing','Moonwing',160,.4],['sunflare','Sunflare Monarch',300,.2]];
for(const [k,n,v] of BFLIES)ITEMDEF['bf_'+k]={n,k:'quest',t:'Butterfly',ic:'herb',c:'#e8c050',stack:1,price:Math.ceil(v/.4)+1,d:`A ${n.toLowerCase()} in a little cage. A shop pays about ${v} gold. It is logged in the Collection.`,sw:.2,bf:v};
/* ---------- herbs ---------- */
const HERBS=[ // [key, name, price, minimum level of the place]
 ['sage','Sage',5,0],['thyme','Thyme',5,0],['rosemary','Rosemary',5,0],['mint','Mint',5,0],['lavender','Lavender',5,0],['chamomile','Chamomile',5,0],['marigold','Marigold',5,0],['dandelion','Dandelion',5,0],['nettle','Nettle',5,0],['yarrow','Yarrow',5,0],
 ['comfrey','Comfrey',5,0],['foxglove','Foxglove',8,8],['nightshade','Nightshade',8,8],['wolfsbane','Wolfsbane',8,8],['mandrake','Mandrake',12,15],
 ['feverfew','Feverfew',5,0],['valerian','Valerian',8,5],['burdock','Burdock',8,8],['elderflower','Elderflower',8,10],['sunleaf','Sunleaf',12,20],['moonpetal','Moonpetal',12,20],['bloodmoss','Bloodmoss',12,20],['ghostcap','Ghostcap',12,25],['dragonstongue',"Dragon's Tongue",20,30],
 ['silverleaf','Silverleaf',20,38],['frostbloom','Frostbloom',20,38],['emberroot','Emberroot',25,45],['dreamthistle','Dreamthistle',25,45]];
for(const [k,n,p] of HERBS)ITEMDEF['herb_'+k]={n,k:'quest',t:'Herb',ic:'herb',c:'#6a9a58',stack:1,price:p,d:`A picked ${n.toLowerCase()}. It is logged in the Collection, and sells at the usual herb price.`,sw:.3};
ITEMDEF.butterflycage={n:'Butterfly Cage',k:'quest',t:'Tool',ic:'herb',c:'#a0804a',stack:0,price:500,d:'A little cage of fine wire. With it in the bag, butterflies can be caught: a hand appears when one is near, and the best hand in the party tries.',sw:.3};
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('butterflycage',...BFLIES.map(b=>'bf_'+b[0]),...HERBS.map(h=>'herb_'+h[0]));
/* the log pages */
COLL.bf={title:'BUTTERFLY CATCHING',noun:'butterfly',items:()=>BFLIES.map(b=>({id:'bf_'+b[0],name:b[1],value:b[2]})),blurb:'Buy a butterfly cage from a trader. When a butterfly is on your square, the catch hand lights up.'};
COLL.herb={title:'HERB COLLECTING',noun:'herb',items:()=>HERBS.map(h=>({id:'herb_'+h[0],name:h[1],value:Math.max(1,Math.floor(h[2]*.4))})),blurb:'Herbs grow on the ground in the open lands. Walk over one to pick it.'};
COLL_KIND.herb_='herb';COLL_KIND.odd_='treasure';
COLL.treasure={title:'TREASURE',noun:'find',items:()=>[{id:'coins',name:'Coins',glyph:'bones',value:20},{id:'odd_boot',name:'Old Boots',value:1},...ODDITIES.map((o,i)=>({id:'odd_'+i,name:o[0].replace(/^An? /,''),value:o[1]})),{id:'weapon',name:'Buried Weapons',glyph:'sword',value:0},{id:'bottle',name:'Messages in Bottles',value:0}],blurb:'Dig with a shovel on an empty square. Gems you dig up are logged in the Jewel Hunter.'};
/* ---------- placing herbs on empty ground ---------- */
function herbPlace(n,late){
  const L=LEVELS[n];if(!L||L._herbs||!L.rows||!(L.outdoor||L.day>0)||L.khRoom)return;L._herbs=1;
  const H=L.rows.length,W=L.rows[0].length;L.items=L.items||[];
  const tb=typeof terrFor==='function'?terrFor(n):null,taken=new Set();
  for(const o of [...(L.items||[]),...(L.enemies||[]),...(L.decor||[])])taken.add(o.x+','+o.y);
  let floor=0;for(let y=0;y<H;y+=3)for(let x=0;x<W;x+=3)if(L.rows[y][x]==='.')floor++;floor*=9;
  const cnt=Math.max(2,Math.min(14,Math.round(floor/700))),rating=(typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[n])||L.diff||n,st=L.start||{x:1,y:1};
  const ok=(x,y)=>{if(L.rows[y][x]!=='.'||taken.has(x+','+y))return false;if(tb&&tb.block[y*tb.W+x])return false;
    for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const c=(L.rows[y+dy]||'')[x+dx];if(c&&c!=='.'&&/[0-9]/.test(c))return false} // not by a door
    return Math.abs(x-st.x)+Math.abs(y-st.y)>=4};
  let placed=0;
  for(let t=0;t<1200&&placed<cnt;t++){
    const x=1+Math.floor(hash2(t,n,911)*(W-2)),y=1+Math.floor(hash2(t,n,923)*(H-2));if(!ok(x,y))continue;
    const pool=HERBS.filter(h=>rating>=h[3]);let tot=0;const w=pool.map(h=>{const v=h[3]?1:4;tot+=v;return v});let u=hash2(placed,n,939)*tot,g=pool[0];for(let i=0;i<pool.length;i++){u-=w[i];if(u<=0){g=pool[i];break}}
    taken.add(x+','+y);const it={k:'herb_'+g[0],x,y};L.items.push(it);if(late&&G.items)G.items.push(Object.assign({taken:false},it));placed++}
}
/* ---------- the shovels: ten of them, from the peasant's to the king's ---------- */
const SHOVELS=[ // [id, name, chance of treasure per dig (%), price, level to be sold at, tint dark, tint light]
 ['shovel_1',"Peasant's Shovel",1,300,0,[44,34,24],[190,160,120]],['shovel_2',"Farmer's Shovel",1.5,450,0,[40,40,34],[200,190,150]],['shovel_3',"Miner's Shovel",2,650,8,[30,30,40],[170,180,200]],
 ['shovel_4',"Gravedigger's Shovel",2.5,950,15,[24,28,24],[150,200,160]],['shovel_5',"Sailor's Shovel",3,1400,22,[16,30,44],[150,205,235]],['shovel_6',"Knight's Shovel",4,2100,30,[36,36,44],[205,210,225]],
 ['shovel_7',"Dwarven Shovel",5,3100,38,[44,26,10],[240,170,90]],['shovel_8',"Silver Shovel",6.5,4600,46,[30,34,40],[235,240,250]],['shovel_9',"Royal Shovel",8,6800,54,[40,12,24],[245,150,170]],['shovel_10',"King's Golden Shovel",10,10000,62,[50,40,6],[255,226,110]]];
for(const [id,n,p,pr] of SHOVELS)ITEMDEF[id]={n,k:'quest',t:'Tool',ic:'pick',c:'#c8a050',stack:0,price:pr,sh:p,d:`A shovel for treasure hunting. Press Dig on an empty square: ${p}% of digs turn something up (the best shovel in the bag counts). Jewels, coins, boots, weapons and odd things.`,sw:.4};
const bestShovel=()=>{let b=null;for(const s of SHOVELS)if(bagCount(s[0])>0)b=s;return b};
function shovelIcons(){if(typeof pToneMap!=='function'||!IMG.icn_pick)return;for(const s of SHOVELS){if(IMG['icn_'+s[0]])continue;const im=pToneMap(IMG.icn_pick,s[5],s[6],1.6,.9,0);IMG['icn_'+s[0]]=im;IMG['ic_'+s[0]]=im;IMG['it_'+s[0]]=im}}
/* what the traders sell */
{SHOP_STOCK.push(['butterflycage',2],['shovel_1',2],['shovel_2',1]);MERCHANT_STOCK.push(['butterflycage',2],['shovel_1',2],['shovel_2',1]);
 if(typeof KH_STOCK!=='undefined'&&KH_STOCK.general){const g=KH_STOCK.general;KH_STOCK.general=()=>{const L=partyLevel();return g().concat([['butterflycage',3]],SHOVELS.filter(s=>L>=s[4]).map(s=>[s[0],1]))}}}
/* the shops that sell shovels (the traders, the general stores and the peddler's carts) stock the dearer, better shovels as the party's level rises: each time one of them opens,
   every shovel whose level the party has reached, and that the shop has not stocked before, is added to its shelves (a shovel that was bought out is not put back) */
{const _ol=openLoot;openLoot=function(d){const r=_ol.apply(this,arguments); // after the shelves exist (a cart or store opened for the first time makes them inside openLoot)
  try{if(d&&d.shop&&d.contents&&d.contents.some(x=>x.id==='butterflycage'||/^shovel_/.test(x.id))){
    const L=partyLevel(),seen=d.shovelSeen||(d.shovelSeen={});
    for(const sv of SHOVELS){if(seen[sv[0]])continue;if(d.contents.some(x=>x.id===sv[0])){seen[sv[0]]=1;continue}if(L>=sv[4]){d.contents.push({id:sv[0],n:1});seen[sv[0]]=1}}}}catch(e){console.error(e)}
  return r}}
/* ---------- digging ---------- */
const ODDITIES=[['A Bent Spoon',2],['A Clay Pipe',3],['A Glass Eye',9],['A Tarnished Locket',14],['A Chipped Doll',4],['A Bone Die',3],['A Rusted Horseshoe',2],['A Bronze Button',2],['A Cracked Teacup',3],['A Wooden Whistle',4],['A Bag of Marbles',6],['An Old Tooth',1]];
ODDITIES.forEach(([n,p],i)=>{ITEMDEF['odd_'+i]={n,k:'quest',t:'Oddity',ic:'bones',c:'#a89878',stack:1,price:Math.ceil(p/.4),d:'Dug up out of the ground. Somebody lost it, or hid it, or threw it away.',sw:.2}});
ITEMDEF.odd_boot={n:'An Old Boot',k:'quest',t:'Junk',ic:'bones',c:'#6a4a30',stack:1,price:1,d:'A left boot, with a hole in the sole. There is no right one.',sw:.3};
ITEMDEF.bottle={n:'A Message in a Bottle',k:'quest',t:'Quest item',ic:'potion',c:'#a8d8c8',stack:0,price:1,d:'A sealed green bottle with a note inside. See the Quests page.',sw:.3};
const dugKey=()=>LEVEL+':'+G.P.x+':'+G.P.y;
function canDigHere(){
  const L=LEVELS[LEVEL];if(!L||L.khRoom||!bestShovel()||G.state!=='play'||G.cut||G.talk||G.menu||G.inv.open||G.loot||G.overview||G.saves||G.map||TP||hostileNear())return false;
  const x=G.P.x,y=G.P.y;if(G.items.some(i=>!i.taken&&i.x===x&&i.y===y)||G.decor.some(d=>d.x===x&&d.y===y&&!d.found&&d.k!=='lamp'&&!d.deco&&!d.walk))return false;
  if(G.enemies.some(e=>e.hp>0&&e.x===x&&e.y===y))return false;
  if(L.portals&&L.portals.some(p=>Math.abs(p.x-x)+Math.abs(p.y-y)<2))return false;
  const c=(L.rows[y]||'')[x];return c==='.'||c===undefined;
}
function digReward(sh){
  const F=G.flags,L=LEVELS[LEVEL],pl=partyLevel(),r=Math.random(),give=id=>{if(!bagAdd(mkItem(id))){G.items.push({k:id,x:G.P.x,y:G.P.y,taken:false});msg('Your bag is full: it lies on the ground.','#d09a80')}try{collFound(id)}catch(e){}};
  if(r<.34){const g=10+Math.floor(Math.random()*21);G.gold+=g;{const T=collData('treasure');T._gold=(T._gold||0)+g;const o=T.coins||(T.coins={f:0,s:0,g:0});o.f++}msg(`Under the dirt: ${g} gold coins.`,'#ffe36a');sfx('key');return}
  if(r<.54){const gem=GEM_BY_VALUE[Math.min(39,Math.floor(Math.pow(Math.random(),1.4)*40))];give('gem_'+gem[0]);msg(`A glint in the dirt: a ${gem[1]}!`,'#a8e8ff');sfx('level');return}
  if(r<.62){give('odd_boot');msg('You dig up an old boot.','#c8b898');return}
  if(r<.78){const i=Math.floor(Math.random()*ODDITIES.length);give('odd_'+i);msg(`You dig up ${ODDITIES[i][0].toLowerCase()}.`,'#c8b898');return}
  if(r<.9){const best=Math.random()<.04;{const T=collData('treasure'),o=T.weapon||(T.weapon={f:0,s:0,g:0});o.f++}let id;
    if(best){id=['worldblade','starbow','ragnarok','doomhammer','sunderer','titanaxe','mountainmaul','stormbow2','kingslayer'].filter(i=>ITEMDEF[i])[Math.floor(Math.random()*9)]||'kingslayer'}
    else{const pool=(typeof GEAR!=='undefined'?GEAR:[]).filter(i=>ITEMDEF[i]&&ITEMDEF[i].k==='weapon'&&!ITEMDEF[i].rar&&(ITEMDEF[i].lvl||1)<=pl+6&&(ITEMDEF[i].lvl||1)>=pl-25);id=pool.length?pool[Math.floor(Math.random()*pool.length)]:'dagger'}
    give(id);msg(best?`A weapon of great power lies buried here: ${ITEMDEF[id].n}!`:`You unearth a buried weapon: ${ITEMDEF[id].n}.`,best?'#ffd76a':'#e0d8b8');sfx(best?'level':'equip');return}
  // a message in a bottle: it leads to a greater reward, buried elsewhere on this level
  {const T=collData('treasure'),o=T.bottle||(T.bottle={f:0,s:0,g:0});o.f++}
  F.bottles=F.bottles||{};const tries=300;let spot=null;const x0=G.P.x,y0=G.P.y,rows=L.rows;
  for(let t=0;t<tries&&!spot;t++){const a=Math.random()*Math.PI*2,d=10+Math.random()*14,x=Math.round(x0+Math.cos(a)*d),y=Math.round(y0+Math.sin(a)*d);
    if(x<2||y<2||y>=rows.length-2||x>=rows[0].length-2||rows[y][x]!=='.'||G.decor.some(q=>q.x===x&&q.y===y)||G.items.some(q=>q.x===x&&q.y===y))continue;spot={x,y}}
  if(!spot){G.gold+=40;msg('A bottle, but the note has run to nothing. A few coins are inside: 40 gold.','#ffe36a');return}
  const id='bt'+Object.keys(F.bottles).length,ns=spot.y<y0?'north':'south',ew=spot.x<x0?'west':'east',nm=LEVEL_NAMES[LEVEL]||'this place';
  const rw=Math.round((300+pl*30)*(1+Math.random()*.6));
  F.bottles[id]={lvl:LEVEL,x:spot.x,y:spot.y,rw,nm,ns,ew,dy:Math.abs(spot.y-y0),dx:Math.abs(spot.x-x0),done:0};
  bottleQuest(id);qAccept(id);msg('A sealed bottle! Inside is a note. A new quest: Message in a Bottle.','#ffe36a');sfx('level');
}
function bottleQuest(id){const b=(G.flags.bottles||{})[id];if(!b||QUESTS[id])return;
  QUESTS[id]={title:'Message in a Bottle',who:'A message in a bottle',desc:`The note says: "Seven strides under the old sky, then ${b.dy} north-south and ${b.dx} east-west. Dig where the ground is soft." It is on ${b.nm}: ${b.dy} squares ${b.ns} and ${b.dx} squares ${b.ew} of where the bottle lay. Dig there with a shovel. Reward: ${b.rw} gold and a jewel.`,need:1,goal:()=>(((G.flags.bottles||{})[id]||{}).done?1:0),reward:{gold:0}};QAREA[id]=b.nm}
function bottleCheck(){ // digging on the marked square
  const F=G.flags;if(!F.bottles)return false;
  for(const id in F.bottles){const b=F.bottles[id];if(b.done||b.lvl!==LEVEL||b.x!==G.P.x||b.y!==G.P.y)continue;
    b.done=1;G.gold+=b.rw;const gem=GEM_BY_VALUE[20+Math.floor(Math.random()*20)];if(bagAdd(mkItem('gem_'+gem[0])))collFound('gem_'+gem[0]);
    if(G.quests[id])G.quests[id].st='done';msg(`The bottle's treasure! ${b.rw} gold and a ${gem[1]}.`,'#ffe36a');sfx('win');return true}
  return false}
function doDig(){
  if(!canDigHere())return;const sh=bestShovel(),F=G.flags;F.dug=F.dug||{};
  if(F.dug[dugKey()]){msg('This ground has been turned over already.','#c8b898');return}
  F.dug[dugKey()]=1;{const T=collData('treasure');T._digs=(T._digs||0)+1}sfx('step');advanceTime(5);
  if(bottleCheck())return;
  if(Math.random()*100<sh[2])digReward(sh);else msg(['You dig. Only dirt.','You dig a neat hole. Nothing in it.','A worm, and a stone, and nothing else.'][Math.floor(Math.random()*3)],'#a89878');
}
/* ---------- butterflies in the air ---------- */
const BFS=[],BFF={};
function bfFrames(k){if(BFF[k])return BFF[k];const im=IMG['icn_bf_'+k];if(!im)return null;
  BFF[k]=[1,.68,.4,.68].map(sx=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.translate(im.width/2,im.height/2);x.scale(sx,1);x.drawImage(im,-im.width/2,-im.height/2);return c});return BFF[k]}
ENEMY_DEF.bfly={name:'Butterfly',hp:1,dmg:[0,0],hit:0,w:.3,img:'',xp:0,gold:[0,0],speed:1,fly:true};
function bfFree(L,x,y){const c=Math.round(x),d=Math.round(y);return L.rows[d]&&L.rows[d][c]==='.'&&G.grid[d]&&G.grid[d][c]===0}
function bfPick(rating){let tot=0;const w=BFLIES.map(b=>{const v=b[3]*(b[2]>=60&&rating<20?.3:1);tot+=v;return v});let u=Math.random()*tot;for(let i=0;i<BFLIES.length;i++){u-=w[i];if(u<=0)return BFLIES[i]}return BFLIES[0]}
function bfTick(dt){
  const L=LEVELS[LEVEL];if(!L||!(L.outdoor||L.day>0)||L.khRoom||G.state!=='play'||bagCount('butterflycage')<1||hostileNear()){BFS.length=0;return} // none in the air while enemies are close
  const rating=(typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[LEVEL])||L.diff||1,px=G.P.x+.5,py=G.P.y+.5;
  for(let i=BFS.length-1;i>=0;i--){const b=BFS[i];if(b.lvl!==LEVEL||Math.hypot(b.x-px,b.y-py)>18)BFS.splice(i,1)}
  G._bfT=(G._bfT||0)+dt;
  if(G._bfT>2.5&&BFS.length<(G._bfCap||(G._bfCap=Math.random()<.4?3:2))){G._bfT=0;G._bfCap=0;for(let t=0;t<30;t++){const a=Math.random()*Math.PI*2,d=4+Math.random()*6,x=px+Math.cos(a)*d,y=py+Math.sin(a)*d;if(bfFree(L,x,y)){const k=bfPick(rating);BFS.push({lvl:LEVEL,k:k[0],name:k[1],v:k[2],rare:k[2]>=60?1:k[2]>=28?.5:0,x,y,tx:x,ty:y,ph:Math.random()*6.28,t:Math.random()*4,e:{t:'bfly',x:0,y:0,hp:1}});break}}}
  for(const b of BFS){b.t-=dt;b.ph+=dt*9;
    if(b.t<=0||Math.hypot(b.tx-b.x,b.ty-b.y)<.15){b.t=1+Math.random()*2.5;const a=Math.random()*Math.PI*2,d=1+Math.random()*3,nx=b.x+Math.cos(a)*d,ny=b.y+Math.sin(a)*d;if(bfFree(L,nx,ny)){b.tx=nx;b.ty=ny}}
    const dx=b.tx-b.x,dy=b.ty-b.y,dl=Math.hypot(dx,dy)||1,sp=1.1*dt,nx=b.x+dx/dl*sp,ny=b.y+dy/dl*sp;if(bfFree(L,nx,ny)){b.x=nx;b.y=ny}else b.t=0}
}
function bfNear(){let best=null,bd=9;for(const b of BFS){const d=Math.hypot(b.x-(G.P.x+.5),b.y-(G.P.y+.5));if(d<bd){bd=d;best=b}}return best&&bd<2.6?{b:best,d:bd,on:Math.floor(best.x)===G.P.x&&Math.floor(best.y)===G.P.y}:null}
{const _sl=spriteList;let last=performance.now();spriteList=function(){const L=_sl.apply(this,arguments);try{const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;bfTick(dt);
  for(const b of BFS){const fr=bfFrames(b.k);if(!fr)continue;b.e.x=Math.floor(b.x);b.e.y=Math.floor(b.y);L.push({x:b.x,y:b.y,img:fr[Math.floor(b.ph)%4],w:b.rare>=1?.34:.28,bob:.42+Math.sin(b.ph*.35)*.1,e:b.e,fade:1})}}catch(e){console.error(e)}return L}}
function bfCatch(){
  const n=bfNear();if(!n||!n.on){msg('Get right under it first: the hand lights up when it is on your square.','#c8b898');return}
  const b=n.b,H=G.heroes.map((h,i)=>({h,i})).filter(o=>o.h.alive);if(!H.length)return;let top=H[0];for(const o of H)if(o.h.dex>top.h.dex)top=o;
  const chance=Math.max(.15,Math.min(.92,(.22+top.h.dex*.03)*(1-b.rare*.45))),nm=HERO_DEF[top.i].name;
  if(Math.random()<chance){BFS.splice(BFS.indexOf(b),1);const id='bf_'+b.k;if(bagAdd(mkItem(id))){collFound(id);msg(`${nm} catches a ${b.name}!`+(b.rare>=1?' What a rare one!':''),b.rare>=1?'#ffd76a':'#a8e8a0');sfx(b.rare>=1?'level':'potion')}else msg('Your bag is full.','#d09a80')}
  else{msg(`${nm} reaches for the ${b.name}, but it flutters out of reach.`,'#c8b898');sfx('miss');b.tx=b.x+(Math.random()-.5)*8;b.ty=b.y+(Math.random()-.5)*8;b.t=3}
}
/* the buttons: a catch hand when a butterfly is near, and Dig on an empty square */
function drawHand(cx,cy,s,col){ctx.save();ctx.translate(cx,cy);ctx.scale(s,s);ctx.fillStyle=col;ctx.strokeStyle='#1a1008';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.roundRect(-6,-1,12,10,3);ctx.fill();ctx.stroke();for(let i=0;i<4;i++){ctx.beginPath();ctx.roundRect(-6+i*3.2,-11+(i===1||i===2?-2:0),2.8,11,1.4);ctx.fill();ctx.stroke()}ctx.beginPath();ctx.roundRect(-9,-1,4,7,2);ctx.fill();ctx.stroke();ctx.restore()}
{const _ui=ui;ui=function(dt){_ui.apply(this,arguments);try{
  if(G.state!=='play'||G.cut||G.talk||G.menu||G.inv.open||G.loot||G.overview||G.saves||G.map||TP)return;
  if(bagCount('butterflycage')>0&&!hostileNear()){const n=bfNear();if(n){const on=n.on,a=.7+.3*Math.sin(G.time*8),bx=VW-68-8,by=154;ctx.save();ctx.globalAlpha=on?1:.65;ctx.fillStyle='rgba(8,6,4,.72)';rrect(ctx,bx,by,68,34,6);ctx.fill();ctx.lineWidth=on?2.4:1.4;ctx.strokeStyle=on?'#ffe36a':'#8a7448';rrect(ctx,bx,by,68,34,6);ctx.stroke();
    drawHand(bx+22,by+22+(on?Math.sin(G.time*9)*1.5:0),1,on?'#f4d8b0':'#a89a80');txt(on?'CATCH!':'Closer...',bx+45,by+17,on?8:7,on?'#ffe36a':'#c8b898','center',true);ctx.restore();btn('bfcatch',bx,by,68,34)}}
  if(canDigHere()){btnText('bfdig','Dig',6,154,52,20)}
}catch(e){}}}
{const _hb=handleBtn;handleBtn=function(id){if(id==='bfcatch'){bfCatch();return}if(id==='bfdig'){doDig();return}return _hb.apply(this,arguments)}}
{const _g=goToLevel;goToLevel=function(n,e){try{if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();herbPlace(n,false);shovelIcons();for(const id in ((G.flags||{}).bottles||{}))bottleQuest(id)}catch(x){console.error(x)}
  const r=_g.apply(this,arguments);try{if(LEVELS[n]&&!LEVELS[n]._herbs)herbPlace(n,true);BFS.length=0;for(const h of HERBS){const k='herb_'+h[0];if(IMG['icn_'+k]&&!IMG['it_'+k]){IMG['it_'+k]=IMG['icn_'+k]}}}catch(x){console.error(x)}return r}}
{const _r=restore;restore=function(sv){try{for(const id in (((sv||{}).flags||{}).bottles||{})){const b=sv.flags.bottles[id];if(!QUESTS[id])QUESTS[id]={title:'Message in a Bottle',who:'A message in a bottle',desc:`Dig ${b.dy} squares ${b.ns} and ${b.dx} squares ${b.ew} of the bottle's place on ${b.nm}. Reward: ${b.rw} gold and a jewel.`,need:1,goal:()=>(((G.flags.bottles||{})[id]||{}).done?1:0),reward:{gold:0}};QAREA[id]=b.nm}}catch(e){console.error(e)}return _r.apply(this,arguments)}}
/* ---------- the Collection menu ---------- */
function drawCollMenu(){
  BTNS=[];veil(.6);bigPanel(110,16,260,288);txt('COLLECTION',240,38,14,'#d8c88e','center',true);
  const row=(id,name,kind)=>{const C=COLL[kind],it=C.items(),d=collData(kind);let n=0;for(const q of it)if(d[q.id]&&(d[q.id].f||d[q.id].s))n++;return [id,name+'   '+n+'/'+it.length]};
  [row('cl_gems','Jewel Hunter','gems'),row('cl_bf','Butterfly Catching','bf'),row('cl_herb','Herb Collecting','herb'),row('cl_treasure','Treasure','treasure'),row('cl_shrines','Shrine Logbook','shrines')].forEach(([id,t],i)=>btnText(id,t,130,52+i*32,220,27));
  btnText('cl_back','Back',170,226,140,28);btn('menuclose',0,0,DW,DH);BTNS.unshift(BTNS.pop());
}
