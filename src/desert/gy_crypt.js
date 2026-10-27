/* ==========================================================================
   LADY ALDITH'S CRYPT (level 531, rated 84; prefix gy / GY). A small vaulted crypt (25 by 21) under the tomb in the middle of the graveyard: a long nave of sarcophagi and candle stands, an apse with
   an altar at the north end where Lady Aldith's ghost waits, a transept with wall niches of bones, and two small side chambers. The stair up to the graveyard is in the south wall.
   When she has found peace (G.flags.gy.peace) the ghost is gone and the crypt is a quiet lit shrine: all the candles burn, a rose lies on the altar, the light is warm gold and nothing here fights.
   ========================================================================== */
const GY_C={W:25,H:21,start:{x:12,y:17,f:0},ghost:{x:12,y:6},altar:{x:12,y:2}};
function gyCryptBuild(){
  if(LEVELS[GY.CRYPT])return LEVELS[GY.CRYPT];
  gyAlias();
  const W=GY_C.W,H=GY_C.H,hs=(a,b,c)=>hash2(a,b,c),g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const rect=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)g[y][x]='.'};
  rect(8,4,16,16);rect(10,1,14,3);rect(2,8,22,12);rect(4,12,4,14);rect(20,12,20,14);rect(2,14,6,18);rect(18,14,22,18);rect(11,17,13,18);
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const WH=3.0,open=(x,y)=>g[y]&&g[y][x]==='.',near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const V=[0,3,0,5,0,1,3,0,2].map(v=>ch(gyTile('texGrey_'+v,WH,{rgb:[.92,.95,1]})));
  const rows=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){s+=open(x,y)?'.':near(x,y)?V[(hs(x,y,9)*V.length)|0]:V[0]}rows.push(s)}
  {const gid=gyTile('texGrey_0',WH,{fac:{img:'stairFix_0',i:0,n:1},gain:1.1});KH_DOOR[gid]={lvl:GY.ID,get at(){return {x:GY_Y.crypt.x,y:GY_Y.crypt.y+2,f:2}},gy:'cryptexit'};
   rows[19]=rows[19].slice(0,12)+ch(gid)+rows[19].slice(13)}
  const decor=[],lights=[],occ=new Set(),lcol={};
  const dec=(a,x,y,o)=>{o=o||{};const k=GYA[a]?'gy_'+a:a;if(!open(x,y))return null;const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}if(o.sc)d.sc=o.sc;if(o.npc){d.npc=o.npc;d.deco=false}if(o.i!==undefined)d.i=o.i;decor.push(d);occ.add(x+','+y);return d};
  const light=(x,y,col)=>{lights.push([x,y]);if(col)lcol[x+','+y]=col};
  // the apse: the altar, the candle stands on either side, the cross of candles
  dec('altar',12,2,{block:true,npc:'gyo_altar'});dec('candles',10,2,{block:true});dec('candles',14,2,{block:true});
  light(11,2,[1.3,.95,.55]);light(13,2,[1.3,.95,.55]);light(12,3,[1.2,.9,.55]);
  // the nave: sarcophagi down both sides, candles between them
  for(const [x,y,i] of [[9,5,0],[15,5,1],[9,8,2],[15,8,3],[9,13,4],[15,13,5],[9,15,6],[15,15,7]])dec('sarc',x,y,{block:true,npc:'gyo_sarc',i,sc:.9});
  for(const [x,y] of [[9,10],[15,10]])dec('candles',x,y,{block:true,sc:.8});
  for(const [x,y] of [[10,6],[14,6],[10,14],[14,14],[12,10]])light(x,y,[1.25,.9,.55]);
  // the transept: niches in the end walls, tombs in the arms, bones
  for(const [x,y] of [[2,9],[2,11],[22,9],[22,11]])dec('niche',x,y,{block:false,sc:.85});
  for(const [x,y,i] of [[3,9,8],[3,11,9],[21,9,10],[21,11,11]])dec('sarc',x,y,{block:true,npc:'gyo_sarc',i,sc:.85});
  for(const [x,y] of [[5,10],[19,10]])light(x,y,[1.15,.85,.5]);
  // the two chambers: a coffin on trestles in the west, a family stone in the east, cobwebs
  dec('coffin',4,16,{block:true,npc:'gyo_coffin'});dec('edmund',20,16,{block:true,npc:'gyo_edmund2'});light(4,15,[1.1,.8,.5]);light(20,15,[1.1,.8,.5]);
  for(const [x,y] of [[9,1],[15,1],[3,8],[21,8],[9,4],[15,4],[3,14],[21,14],[8,16],[16,16]])dec('web',x,y,{sc:.8});
  for(const [x,y] of [[5,17],[6,15],[19,17],[18,15],[3,18]])dec('bones',x,y,{sc:.9});
  light(12,17,[1.1,.85,.55]);
  // the ghost, on the step before the apse (her picture follows the story; see gyArrive)
  dec('ghost0',GY_C.ghost.x,GY_C.ghost.y,{block:true,npc:'gyo_ghost'});
  lights.push([GY_C.ghost.x,GY_C.ghost.y+1]);lcol[GY_C.ghost.x+','+(GY_C.ghost.y+1)]=[.6,.85,1.5];
  const names=[{t:'The Apse',x:12,y:2,k:'place'},{t:'The Nave',x:12,y:11,k:'place'},{t:'The Transept',x:5,y:10,k:'place'},{t:'The Western Chamber',x:4,y:16,k:'place'},{t:'The Eastern Chamber',x:20,y:16,k:'place'}];
  const fm=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=(open(x,y)&&(x>=10&&x<=14&&y<=3))?'3':'3';fm.push(s)}
  const L={rows,chars,fmap:fm,floorSet:GY_FLOORSET,floor:GY_FLOORSET[3],ceil:'gyc_crypt',ceilH:WH+1,start:{x:GY_C.start.x,y:GY_C.start.y,f:GY_C.start.f},enemies:[],items:[],decor,lights,portals:[],day:0,amb:.04,torchGap:1e9,noTele:true,noExtras:true,
    name:GY.NAMES[531],label:GY.NAMES[531],diff:84,mapNames:names,peaceful:true,_gy:{kind:'crypt',lcol}};
  LEVELS[GY.CRYPT]=L;
  return L}
KH_LAZY[GY.CRYPT]=gyCryptBuild;
