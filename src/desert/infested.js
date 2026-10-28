/* ==========================================================================
   INFESTED HOUSES (prefix inf / INF). One ordinary house in ten, in Oldhaven and in Khemetra, has been taken over: 1 to 5 low level creatures stand in the room, whoever
   lived there lies on the floor as a body, and a stair in the north wall goes down to a cellar (a few rooms joined by a corridor, a few creatures, a few chests and barrels).
   Which houses: chosen by a seeded hash of the house's level number (hash2(lvl,3,INF.SEED)<INF.CHANCE), so the same houses every time and in every save.
   Never infested: shops, inns, temples, baths, prayer houses, houses whose keeper gives a quest, hoard houses (500 gold or more), the Yarrim cottages, the houses the party can buy (housing.js, 3300 to 3323),
   and every hand-built room (they do not pass through the ordinary house path: Oldhaven homes are ids 6000 to 6999 with room 'home', Khemetra houses are 'house<n>').
   Level numbers: the cellar of house N is level N + 20000 (houses are 1000 to 9999, so cellars are 21000 to 29999; nothing else uses that range). Rooms are built lazily (KH_LAZY).
   How: khRoom is wrapped. When an ordinary house is built and passes infOk(), the finished room is changed in place (infMake): people become bodies (decor 'bones'), enemies and a stair are added, the painted
   room scene is dropped. The cellar builder is registered in KH_LAZY. A stub is registered for every possible cellar so that a save made inside a cellar can be loaded before the town is built.
   Cleared state: the enemies killed are remembered in G.flags.inf[level] (saved with the game) and never come back (the ordinary rule brings some creatures back each visit; infested places are excluded).
   Loot: lootFor is wrapped; chests and barrels in infested places hold low tier things only.
   Test: python tools/infest_test.py [port]
   ========================================================================== */
const INF={OFF:20000,CHANCE:.1,SEED:4417,stubs:{},kind:{},_k:null,okKinds:['house','mansion','low'],low:['rat','rat','bat','skel','bandit'],
  rooms:['The Store Room','The Wine Cellar','The Coal Cellar','The Cold Store']};
const infPick=lvl=>lvl>=1000&&lvl<10000&&hash2(lvl,3,INF.SEED)<INF.CHANCE;
const infCellarOf=lvl=>lvl+INF.OFF;
const infIs=n=>{const L=LEVELS[n];return !!(L&&L.infest)};
/* is this (just built) house an ordinary one that may be infested? */
function infOk(b,lvl,back){
  if(!b||!back||b.room!=='home'||!infPick(lvl))return false;
  const ok44=back.to===44&&/^house\d+$/.test(b.id)&&INF.okKinds.includes(INF.kind[lvl]),okOh=back.to===OH.ID&&/^oh\d+$/.test(b.id);
  if(!ok44&&!okOh)return false;
  if(b.gold>=500||b.script||b.wlin||b.tpl)return false;
  if(b.keeper&&typeof QGIVER!=='undefined'&&QGIVER[b.keeper])return false;
  const cid=infCellarOf(lvl);
  if(LEVELS[cid]&&!LEVELS[cid].infest)return false;
  if(KH_LAZY[cid]&&!INF.stubs[cid]&&!(LEVELS[cid]&&LEVELS[cid].infest))return false;
  return true;
}
function infReach(L,from,extraBlock){
  const rows=L.rows,H=rows.length,W=rows[0].length,bl=new Set((L.decor||[]).filter(d=>d.block!==false&&!d.walk).map(d=>d.x+','+d.y));
  if(extraBlock)for(const k of extraBlock)bl.add(k);
  const seen=new Set([from.x+','+from.y]),q=[[from.x,from.y]];
  while(q.length){const [x,y]=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;
    if(nx<0||ny<0||nx>=W||ny>=H||seen.has(k)||bl.has(k)||rows[ny][nx]!=='.')continue;seen.add(k);q.push([nx,ny])}}
  return seen;
}
/* change a built house into an infested one */
// the painted corpses (assets/ds_corpse0..3: on the back, on the front, curled up, in a robe). Usable as a decor name anywhere:
// {k:'corpse0'..'corpse3'}, or infCorpse(x,y) for one picked by position. Each is about 1.1 squares wide and lies low on the floor.
Object.assign(NPC_H,{corpse0:.186,corpse1:.205,corpse2:.42,corpse3:.248});
function infCorpse(x,y){return 'corpse'+((hash2(x*7+3,y*13+1,(typeof INF!=='undefined'&&INF.SEED||1)+21)*4)|0)}
function infMake(L,b,lvl,back){
  const cid=infCellarOf(lvl),town=back.to,rating=Math.max(1,((typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[town])||16)-3),H=L.rows.length,W=L.rows[0].length;
  L.infest=1;L.infestCellar=cid;L.diff=rating;LEVEL_RATING[lvl]=rating;L.amb=Math.min(L.amb||.66,.4);delete L.scene;
  // the people: each becomes a body lying where they stood
  const bodies=[];
  L.decor=L.decor.filter(d=>{if(d.npc&&d.npc!=='kh_gold'&&typeof KH_KEEPERS!=='undefined'&&KH_KEEPERS[d.npc]){bodies.push({x:d.x,y:d.y});return false}return true});
  if(!bodies.length)bodies.push(null);
  const R=(i,m)=>(hash2(lvl+i*17,i*5+1,INF.SEED+9)*m)|0;
  const st=L.start,occ=new Set(L.decor.map(d=>d.x+','+d.y)),reach=infReach(L,st);
  const free=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const k=x+','+y;if(L.rows[y][x]==='.'&&reach.has(k)&&!occ.has(k))free.push([x,y])}
  // the stair down, in the north wall, in front of a free square that can be reached
  let sx=null;{const cols=[];for(let x=1;x<W-1;x++)cols.push(x);cols.sort((a,c)=>hash2(a+lvl,1,INF.SEED+3)-hash2(c+lvl,1,INF.SEED+3));
    for(const x of cols)if(reach.has(x+',1')&&!occ.has(x+',1')){sx=x;break}
    if(sx===null){sx=cols[0];L.decor=L.decor.filter(d=>!(d.x===sx&&d.y===1))}} // a crowded room: the piece of furniture in front of the stair is taken away
  L.rows[0]=L.rows[0].slice(0,sx)+'1'+L.rows[0].slice(sx+1);
  L.portals=L.portals||[];
  L.portals[1]={to:cid,x:1,y:8,f:1,tex:'tomb'};
  occ.add(sx+',1');
  // the bodies (a person's spot, or a free square when nobody lived here; sometimes a second one)
  const spots=free.filter(([x,y])=>!occ.has(x+','+y)&&Math.abs(x-st.x)+Math.abs(y-st.y)>=2);
  const bodyAt=(p,i)=>{const q=p||spots[R(40+i,spots.length)]||free[0];if(!q)return;const x=q[0]!==undefined?q[0]:q.x,y=q[0]!==undefined?q[1]:q.y;L.decor.push({k:infCorpse(x,y),x,y,block:false,infBody:1});occ.add(x+','+y)};
  bodies.forEach((p,i)=>bodyAt(p,i));
  if(R(50,10)<4)bodyAt(null,9);
  // 1 to 5 creatures: not near the door, not on the stair, on squares the party can walk to
  const n=1+R(1,5),cand=free.filter(([x,y])=>!occ.has(x+','+y)&&Math.abs(x-st.x)+Math.abs(y-st.y)>=3).sort((a,c)=>hash2(a[0]+lvl,a[1],INF.SEED+7)-hash2(c[0]+lvl,c[1],INF.SEED+7));
  L.enemies=L.enemies||[];
  for(let i=0;i<n&&i<cand.length;i++)L.enemies.push({t:INF.low[R(10+i,INF.low.length)],x:cand[i][0],y:cand[i][1]});
  LEVEL_NAMES[cid]='The Cellar';
  KH_LAZY[cid]=()=>{if(!LEVELS[cid])LEVELS[cid]=infCellar(lvl,cid,rating,sx)};
}
/* the cellar: an entry room on the west side, a corridor running east, and three or four rooms off it, on alternate sides */
function infCellar(hid,cid,rating,sx){
  const W=29,H=17,CY=8,R=(i,m)=>(hash2(hid*7+i,i*13+3,INF.SEED+5)*m)|0;
  const g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const cut=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)g[y][x]='.'};
  cut(1,6,5,10);cut(6,CY,26,CY);
  const slots=[{up:1,x0:7},{up:0,x0:11},{up:1,x0:16},{up:0,x0:20}],nr=3+R(0,2),rooms=[];
  for(let i=0;i<nr;i++){const s=slots[i],w=6,x0=s.x0,px=x0+(w>>1);
    if(s.up){cut(x0,2,x0+w-1,5);cut(px,6,px,7);rooms.push({x0,x1:x0+w-1,y0:2,y1:5,px,far:2,up:1})}
    else{cut(x0,11,x0+w-1,14);cut(px,9,px,10);rooms.push({x0,x1:x0+w-1,y0:11,y1:14,px,far:14,up:0})}}
  g[CY][0]='0';
  // torches in the walls, now and then
  const rows=g.map((r,y)=>r.map((c,x)=>{if(c!=='#')return c;if(x>0&&g[y][x-1]==='.'&&hash2(x,y,INF.SEED+21)<.06)return '%';if(y>0&&g[y-1][x]==='.'&&hash2(x,y,INF.SEED+22)<.06)return '%';return '#'}).join(''));
  const used=new Set(['1,8','2,8','3,8']),decor=[],enemies=[],items=[];
  const cellsOf=r=>{const o=[];for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)o.push([x,y]);return o};
  // chests and barrels in the corners of the rooms, which never close a way
  const corners=r=>[[r.x0,r.far],[r.x1,r.far]];
  const order=rooms.map((_,i)=>i).sort((a,c)=>hash2(a+hid,2,INF.SEED+31)-hash2(c+hid,2,INF.SEED+31));
  const nChest=nr>=4?3:2;
  order.forEach((ri,k)=>{const r=rooms[ri],cs=corners(r);
    if(k<nChest){decor.push({k:'chest',x:cs[R(60+ri,2)][0],y:r.far,block:true});used.add(cs[0][0]+','+r.far)}
    const other=cs.find(c=>!decor.some(d=>d.x===c[0]&&d.y===c[1]));
    if(other)decor.push({k:R(70+ri,2)?'barrel':'crate',x:other[0],y:other[1],block:true});
    if(R(80+ri,3)===0){const q=cellsOf(r).filter(([x,y])=>x!==r.px&&!decor.some(d=>d.x===x&&d.y===y));const c=q[R(85+ri,q.length)];if(c)decor.push({k:'bones',x:c[0],y:c[1],block:false})}
    if(R(90+ri,3)===0){const q=cellsOf(r).filter(([x,y])=>x!==r.px&&!decor.some(d=>d.x===x&&d.y===y));const c=q[R(95+ri,q.length)];if(c)decor.push({k:infCorpse(c[0],c[1]),x:c[0],y:c[1],block:false,infBody:1})}});
  decor.forEach(d=>used.add(d.x+','+d.y));
  // creatures, mostly weak: 4 to 7, in the rooms and the corridor
  const cells=[];for(const r of rooms)for(const c of cellsOf(r))cells.push(c);for(let x=9;x<=26;x++)cells.push([x,CY]);
  const pool=INF.low.concat(['skel','rat','bat']);let cnt=4+R(2,4);
  for(let i=0;i<60&&cnt>0;i++){const c=cells[R(100+i,cells.length)],k=c[0]+','+c[1];if(used.has(k))continue;used.add(k);cnt--;
    enemies.push({t:R(200+i,9)===0?'ghost':pool[R(300+i,pool.length)],x:c[0],y:c[1]})}
  // a few things on the floor
  for(let i=0,got=0;i<40&&got<2;i++){const c=cells[R(400+i,cells.length)],k=c[0]+','+c[1];if(used.has(k))continue;used.add(k);got++;items.push({k:got===1?'potion':['cheese','torch','bread'][R(410+i,3)],x:c[0],y:c[1]})}
  const names=[{t:'The Stair Up',x:3,y:7,k:'place'},{t:'The Corridor',x:16,y:CY,k:'lane'}].concat(rooms.map((r,i)=>({t:INF.rooms[i],x:(r.x0+r.x1)>>1,y:r.up?r.y0:r.y1,k:'place'})));
  return {rows,start:{x:1,y:CY,f:1},enemies,items,decor,day:0,amb:.3,name:'The Cellar',label:'The Cellar',diff:rating,infest:1,ceilH:2.1,lights:[],
    portals:[{to:hid,x:sx,y:1,f:2,tex:'tomb'}],mapNames:names};
}
/* the wrappers */
{const _kr=khRoom;khRoom=function(b,lvl,back){
  const R=_kr.apply(this,arguments);
  try{if(infOk(b,lvl,back))infMake(R.level,b,lvl,back)}catch(e){console.error('infest',e)}
  return R}}
{const _p=khPickScene;khPickScene=function(m){INF._k=m&&m.kind;return _p.apply(this,arguments)}}
{const _h=khHouseId;khHouseId=function(){const n=_h.apply(this,arguments);INF.kind[n]=INF._k;INF._k=null;infStub(n);return n}}
/* a cellar can be asked for before its house has been built (a save made inside it): the stub builds the house, which registers the real builder */
function infStub(hid){
  if(!infPick(hid))return;const cid=infCellarOf(hid);
  if(LEVELS[cid]||KH_LAZY[cid])return;
  const stub=()=>{if(LEVELS[cid])return;if(!LEVELS[hid]&&KH_LAZY[hid])KH_LAZY[hid]();if(!LEVELS[cid]&&KH_LAZY[cid]&&KH_LAZY[cid]!==stub)KH_LAZY[cid]()};
  INF.stubs[cid]=1;KH_LAZY[cid]=stub;LEVEL_NAMES[cid]='The Cellar';
}
for(let i=0;i<OH_SPECIAL.length+640;i++){if(i>=4)infStub(OH.HOME+i-4)}
/* infested places keep their dead dead, and hold low tier loot */
{const _ls=levelState;levelState=function(){
  const s=_ls.apply(this,arguments),L=LEVELS[LEVEL];
  if(L&&L.infest&&s){const F=G.flags,m=F.inf||(F.inf={}),d=new Set((m[LEVEL]||[]).concat(s.dead||[]));m[LEVEL]=s.dead=Array.from(d)}
  return s}}
{const _ae=applyEnemyState;applyEnemyState=function(s){
  const L=LEVELS[LEVEL];
  if(L&&L.infest){const F=G.flags,m=F.inf||(F.inf={}),d=new Set((m[LEVEL]||[]).concat(s&&s.dead?s.dead:[]));if(d.size)G.enemies=G.enemies.filter(e=>!(e.id<ENEMY_SPAWNS.length&&d.has(e.id)));return}
  return _ae.apply(this,arguments)}}
{const _lf=lootFor;lootFor=function(d){
  const L=LEVELS[LEVEL];if(!(L&&L.infest))return _lf.apply(this,arguments);
  const rt=L.diff||1,r=k=>hash2(d.x,d.y,300+k+LEVEL),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
  if(d.k==='chest'){
    add(potionFor(r(1)),1+(r(2)<.4?1:0));add(['torch','bread','cheese','apple'][(r(3)*4)|0],1);
    if(r(4)<.6)add(['dagger','cap','jerkin','bracers','leggings','scrollLight','ringV'][(r(5)*7)|0],1);
    d.gold=10+Math.round(rt*(2+r(6)*3));
  }else{
    add(r(2)<.5?foodFor(r(3)):r(2)<.8?potionFor(r(4)):'torch',1);
    d.gold=r(5)<.5?2+Math.round(rt*r(6)):0;
  }
  return items}}
/* what the party is told when it walks in */
{const _be=typeof bathEnter==='function'?bathEnter:null;if(_be)bathEnter=function(n){
  const r=_be.apply(this,arguments);
  try{const L=LEVELS[n];if(L&&L.infest&&G.enemies.some(e=>e.hp>0)){
    msg(L.name==='The Cellar'?'The cellar is cold and dark. Something moves in it.':'Nobody answers. There is a body on the floor, and something is in the room. A stair goes down in the north wall.','#e8a090')}}catch(e){console.error(e)}
  return r}}
/* a link for testing: ?town=infested lands in the first infested house, ?town=infestedcellar in its cellar (the house first builds the town) */
function infSpot(which){
  if(typeof KH_READY!=='undefined'&&!KH_READY){ // the pictures are not loaded yet: land in Oldhaven now, and go on to the house when they are
    try{khLoadAssets().then(()=>{const t=infSpot(which);goToLevel(t[0],{x:t[1],y:t[2],f:t[3]})})}catch(e){console.error(e)}
    return [305,108,50,0]}
  try{seaBuild(304);ohBuild()}catch(e){console.error(e)}
  for(let id=OH.HOME;id<OH.HOME+OH_SPECIAL.length+640;id++){if(!infPick(id))continue;try{KH_LAZY[id]&&KH_LAZY[id]()}catch(e){}
    const L=LEVELS[id];if(L&&L.infest){if(which==='cellar'){KH_LAZY[L.infestCellar]();return [L.infestCellar,1,8,1]}return [id,L.start.x,L.start.y,L.start.f||0]}}
  return [305,108,50,0];
}
