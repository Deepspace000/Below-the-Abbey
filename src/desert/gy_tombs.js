/* ==========================================================================
   THE SIX SMALL TOMBS (levels 536 to 541, prefix gy / GY). Family tombs built into the edge of the Wenlock Graveyard (see GY_TOMBS in gy_yard.js: four along the north and south sides, two on the west).
   Each is a small vaulted room (11 by 11) that you walk into from the yard: sarcophagi, candle stands, cobwebs, bones, a cold blue-green glow in the corners, and in some a little treasure.
   Nothing here fights. The door in the south wall leads back out to the lane beside the tomb's front.
   ========================================================================== */
const GY_TOMB_NAMES={536:'The Vane Tomb',537:'The Ashby Vault',538:'The Thorne Mausoleum',539:'The Marsh Crypt',540:'The Cobb Vault',541:'The Fell Tomb'};
function gyTombBuild(id){
  if(LEVELS[id])return LEVELS[id];
  gyAlias();
  const W=11,H=11,hs=(a,b,c)=>hash2(a,b,c),g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  for(let y=2;y<=8;y++)for(let x=2;x<=8;x++)g[y][x]='.';
  g[9][5]='.';
  const T=GY_TOMBS.find(t=>t.id===id)||GY_TOMBS[0];
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const WH=3.0,open=(x,y)=>g[y]&&g[y][x]==='.',near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const V=[0,3,0,5,0,1,3,0,2].map(v=>ch(gyTile('texGrey_'+v,WH,{rgb:[.92,.95,1]})));
  const rows=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){s+=open(x,y)?'.':near(x,y)?V[(hs(x,y,9)*V.length)|0]:V[0]}rows.push(s)}
  {const gid=gyTile('texGrey_0',WH,{fac:{img:'stairFix_0',i:0,n:1},gain:1.1});
   KH_DOOR[gid]={lvl:GY.ID,get at(){const f=T.front||[T.x,T.y];return {x:f[0],y:f[1],f:T.side==='N'?2:T.side==='S'?0:1}},gy:'tombexit'};
   rows[10]=rows[10].slice(0,5)+ch(gid)+rows[10].slice(6)}
  const decor=[],lights=[],lcol={},occ=new Set();
  const dec=(a,x,y,o)=>{o=o||{};const k=GYA[a]?'gy_'+a:a;if(!open(x,y))return null;const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}if(o.sc)d.sc=o.sc;if(o.npc){d.npc=o.npc;d.deco=false}if(o.i!==undefined)d.i=o.i;if(o.goldAmt)d.goldAmt=o.goldAmt;decor.push(d);occ.add(x+','+y);return d};
  const light=(x,y,col)=>{lights.push([x,y]);if(col)lcol[x+','+y]=col};
  // sarcophagi along the side walls, candle stands, a cold glow in every corner
  for(const [x,y] of [[3,3],[7,3],[3,6],[7,6]])dec('sarc',x,y,{block:true,sc:.9});
  for(const [x,y] of [[5,2],[2,5],[8,5]]){dec('candles',x,y,{block:true,sc:.75});light(x,y,[1.5,1.0,.5])}
  for(const [x,y] of [[2,2],[8,2],[2,8],[8,8],[5,5]])light(x,y,[.45,1.05,.95]);
  for(const [x,y] of [[2,3],[8,3],[2,7],[8,7],[4,2],[6,2]])dec('web',x,y,{sc:.5});
  for(const [x,y] of [[4,7],[6,7],[3,8]])dec('bones',x,y,{sc:.9});
  // some hold a little treasure on the floor at the back
  if(id%2===0)dec('chest',5,4,{block:true,goldAmt:2500+(id%7)*400});
  const fm=[];for(let y=0;y<H;y++)fm.push('3'.repeat(W));
  const L={rows,chars,fmap:fm,floorSet:GY_FLOORSET,floor:GY_FLOORSET[3],ceil:'gyc_crypt',ceilH:WH+1,start:{x:5,y:9,f:0},enemies:[],items:[],decor,lights,portals:[],day:0,amb:.05,torchGap:1e9,noTele:true,noExtras:true,
    name:GY_TOMB_NAMES[id],label:GY_TOMB_NAMES[id],diff:84,mapNames:[{t:GY_TOMB_NAMES[id],x:5,y:5,k:'place'}],peaceful:true,_gy:{kind:'crypt',lcol}};
  LEVELS[id]=L;LEVEL_NAMES[id]=GY_TOMB_NAMES[id];LEVEL_RATING[id]=84;
  return L}
for(const id of [536,537,538,539,540,541])KH_LAZY[id]=((i)=>()=>gyTombBuild(i))(id);
