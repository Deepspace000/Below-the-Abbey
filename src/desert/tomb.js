/* ==========================================================================
   THE TOMB OF SUT (level 42). A cave full of sand leads to the Hall of Eternity. Four wings each guard a golden sun disc:
   the Hall of Embers (fire traps), the Crypt of Sarcophagi (ambushes and a secret door), the Chamber of Switches
   (three levers) and the Sand Pit (scorpions). With all four in the great door's sockets the way opens to the
   throne room of Sut. When he falls, a door appears in the north wall.
   ========================================================================== */
const TOMBSZ={W:96,H:74};
function buildTomb(){
  const W=TOMBSZ.W,H=TOMBSZ.H,g=[],fl=[],th=[];
  for(let y=0;y<H;y++){g.push(new Array(W).fill('W'));fl.push(new Array(W).fill('0'));th.push(new Array(W).fill(''))}
  const R=(x0,y0,x1,y1,ft,t)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){g[y][x]='.';fl[y][x]=ft;th[y][x]=t}};
  const decor=[],enemies=[],items=[],lights=[],secrets=[];
  const put=(k,x,y,o)=>{decor.push(Object.assign({k,x,y,block:false},o||{}));return decor[decor.length-1]};
  const foe=(t,x,y,lvl)=>enemies.push({t,x,y,lvl:lvl||(t==='mummy'?16:15)});
  const brazier=(x,y)=>{put('brazier',x,y,{block:true});lights.push([x,y])};
  // ---- the cave of sand: a winding way in from the gate ----
  R(44,64,52,71,'2','cave');R(40,58,50,64,'2','cave');R(34,52,44,60,'2','cave');R(38,47,47,53,'2','cave');
  R(26,54,33,58,'2','cave');R(51,54,60,60,'2','cave');R(45,46,49,46,'1','hall');
  // ---- the Hall of Eternity ----
  R(30,26,66,45,'1','hall');R(46,26,50,45,'4','hall');
  // ---- corridors to the four wings and the great door ----
  R(22,34,29,36,'1','hall');           // west
  R(67,34,74,36,'1','hall');           // east
  R(37,14,41,25,'1','hall');R(33,14,36,16,'1','hall');   // north-west
  R(55,14,59,25,'1','hall');R(60,14,65,17,'1','hall');   // north-east
  R(47,13,49,24,'4','hall');           // beyond the great door
  // ---- Wing A: the Hall of Embers ----
  R(6,28,21,42,'5','fire');
  // ---- Wing B: the Crypt of Sarcophagi, with a vault behind a secret door ----
  R(75,26,90,44,'3','crypt');R(92,33,94,37,'1','vault');
  // ---- Wing C: the Chamber of Switches ----
  R(8,10,32,20,'3','switch');R(18,22,22,24,'5','vault');R(10,3,30,7,'3','crypt');R(14,8,16,9,'3','switch');
  R(1,12,4,16,'1','vault');
  // ---- Wing D: the Sand Pit ----
  R(66,4,90,22,'2','pit');
  // ---- the throne room of Sut ----
  R(34,2,62,12,'4','throne');
  // ---- the great door (three cells wide), the secrets, the gate cells of the vault ----
  g[25][47]=g[25][49]='G';g[25][48]='B';
  g[35][91]='S';secrets.push({x:91,y:35,id:'vaultB'});
  g[21][20]='S';secrets.push({x:20,y:21,id:'closet'});
  for(const x of [5,6,7]){g[14][x]='Q'}
  g[1][48]='H'; // where the way out will appear
  // the way in: the gate at the foot of the cave
  g[72][48]='0';
  // ---- walls: pick a face for every wall that borders a room ----
  const wall=(x,y,t)=>{
    const r=hash2(x,y,3);
    if(t==='cave')return 'K';
    if(t==='hall')return (x%6===0||y%6===0)?'G':(r<.28?'L':'H');
    if(t==='fire')return r<.5?'G':'H';
    if(t==='crypt')return r<.35?'W':'H';
    if(t==='pit')return r<.6?'K':'W';
    if(t==='throne')return r<.55?'G':'L';
    if(t==='vault')return 'G';
    if(t==='switch')return r<.45?'L':'G';
    return 'W';
  };
  const out=[];
  for(let y=0;y<H;y++){let row='';for(let x=0;x<W;x++){
    let c=g[y][x];
    if(c==='W'){let t='';for(let dy=-1;dy<=1&&!t;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<W&&ny<H&&g[ny][nx]==='.'){t=th[ny][nx];break}}c=t?wall(x,y,t):'W'}
    row+=c}out.push(row)}
  // ---- the cave: sand drifts, bones, a few scorpions ----
  for(let y=47;y<=71;y++)for(let x=26;x<=60;x++){if(g[y][x]!=='.'||th[y][x]!=='cave')continue;
    if(hash2(x,y,21)<.16)put('dune'+((hash2(x,y,22)*3)|0),x,y,{block:true,sc:.5+hash2(x,y,23)*.4,ox:(hash2(x,y,24)-.5)*.5,oy:.2});
    else if(hash2(x,y,25)<.012)put('dbones',x,y,{walk:true})}
  for(const [x,y] of [[48,66],[42,61],[36,56],[40,50],[28,56],[57,57],[55,58]])foe('scorpion',x,y);
  // ---- the hall ----
  for(const y of [29,33,37,41])for(const x of [36,42,54,60])put('dpillar'+((x+y)%2),x,y,{block:true});
  for(const [x,y] of [[33,27],[63,27],[33,44],[63,44],[45,27],[51,27],[45,44],[51,44],[42,31],[54,31],[42,39],[54,39]])brazier(x,y);
  for(const [x,y,k] of [[31,28,'danubis'],[65,28,'danubis'],[31,43,'danubis'],[65,43,'danubis'],[31,31,'dbastet'],[65,31,'dbastet'],[31,40,'dbastet'],[65,40,'dbastet']])put(k,x,y,{block:true});
  for(const [x,y] of [[34,45],[62,45],[34,27],[64,27]])put('vase'+((x+y)%4),x,y,{block:true});
  put('offering',48,28,{block:true});
  for(const [x,y] of [[38,44],[58,44]])put('sarcoph',x,y,{block:true,ambush:['mummy','mummy']});
  // ---- Wing A: the Hall of Embers ----
  { // a winding safe path east to west; the other cells hold scorched slabs that fire when stepped on
    const safe=new Set();let sy=35;for(let x=21;x>=9;x--){safe.add(x+','+sy);if(x<20&&hash2(x,sy,31)<.5){const ny=sy+(hash2(x,sy,32)<.5?-1:1);if(ny>=31&&ny<=39){sy=ny;safe.add(x+','+sy)}}}
    while(sy!==35){sy+=sy<35?1:-1;safe.add('9,'+sy)}   // the path ends in line with the disc
    for(const c of ['8,35','7,35','8,34','8,36'])safe.add(c);
    for(let y=29;y<=41;y++)for(let x=9;x<=20;x++){if(safe.has(x+','+y))continue;if(hash2(x,y,33)<.62)put('ventplate',x,y,{trap:'fire',walk:true})}
    for(const [x,y] of [[8,33],[8,37],[7,33],[7,37]])put('ventplate',x,y,{trap:'fire',hidden:true,walk:true}); // hidden ones, off the path
    items.push({k:'sundisc1',x:7,y:35});
    for(const [x,y] of [[7,29],[7,41],[20,29],[20,41],[13,28]])brazier(x,y);
    put('danubis',6,33,{block:true});put('danubis',6,37,{block:true});put('treasure',6,30,{block:true});put('vase2',6,40,{block:true});
    foe('scorpion',12,32);foe('scorpion',16,39);foe('scorpion',10,37);foe('mummy',9,31);foe('mummy',9,40);
  }
  // ---- Wing B: the Crypt of Sarcophagi ----
  for(const [x,y,amb] of [[78,28,1],[78,32,0],[78,38,1],[78,42,0],[83,28,0],[83,42,1],[87,30,1],[87,40,0]])put('sarcoph',x,y,{block:true,ambush:amb?['mummy','mummy']:undefined});
  for(const [x,y] of [[76,35],[88,35],[82,35]])put('sarcophU',x,y,{block:true,ambush:['mummy']});
  for(const [x,y] of [[76,27],[89,27],[76,43],[89,43],[82,31],[82,39]])brazier(x,y);
  for(const [x,y] of [[80,29],[85,43],[88,28],[80,43],[84,33],[84,37]])put('vase'+((x+y)%4),x,y,{block:true});
  put('treasure',90,27,{block:true});put('treasure',90,43,{block:true});
  foe('scorpion',80,35);foe('scorpion',86,36);foe('mummy',82,30,16);
  items.push({k:'sundisc2',x:93,y:35});put('treasure',93,33,{block:true});put('treasure',93,37,{block:true});brazier(94,34);
  // ---- Wing C: the Chamber of Switches ----
  for(const [x,y] of [[12,12],[12,18],[29,12],[29,18],[21,12],[21,18]])put('dpillar'+((x+y)%2),x,y,{block:true});
  for(const [x,y] of [[9,11],[9,19],[31,11],[31,19],[18,10],[23,10]])brazier(x,y);
  put('lever',20,10,{wd:[0,-1],idx:1,opens:[[7,14]],deco:true});
  put('lever',20,24,{wd:[0,1],idx:2,opens:[[6,14]],deco:true});
  put('lever',30,5,{wd:[1,0],idx:3,opens:[[5,14]],deco:true});
  foe('mummy',16,15);foe('mummy',26,15);foe('scorpion',14,18);
  for(const [x,y] of [[12,4],[26,4],[20,6],[13,6],[28,6]])foe('scorpion',x,y);
  put('treasure',29,4,{block:true});put('vase1',11,4,{block:true});put('vase3',29,6,{block:true});brazier(10,3);brazier(30,3);
  items.push({k:'sundisc3',x:2,y:14});put('treasure',2,12,{block:true});put('treasure',2,16,{block:true});put('vase0',4,12,{block:true});put('vase2',4,16,{block:true});brazier(3,13);
  // ---- Wing D: the Sand Pit ----
  for(let y=5;y<=21;y++)for(let x=67;x<=89;x++){if(g[y][x]!=='.')continue;
    if(hash2(x,y,41)<.12)put('dune'+((hash2(x,y,42)*3)|0),x,y,{block:true,sc:.55+hash2(x,y,43)*.5,ox:(hash2(x,y,44)-.5)*.5,oy:.2});
    else if(hash2(x,y,45)<.02)put('dbones',x,y,{walk:true})}
  for(const [x,y] of [[70,8],[74,6],[78,10],[82,7],[86,9],[72,14],[77,16],[83,15],[88,13],[80,19],[75,20],[86,20],[69,18],[84,11],[79,13]])foe('scorpion',x,y);
  foe('mummy',87,7,16);foe('mummy',88,10,16);foe('mummy',84,5,16);
  for(const [x,y] of [[70,5],[78,5],[88,5],[88,21],[70,21],[79,21]])put('treasure',x,y,{block:true});
  for(const [x,y] of [[71,10],[85,17],[80,8],[75,13]])put('vase'+((x+y)%4),x,y,{block:true});
  for(const [x,y] of [[67,5],[67,21],[89,5],[89,21],[78,12]])brazier(x,y);
  items.push({k:'sundisc4',x:89,y:6});
  // ---- the great door and the sealed way to Sut ----
  for(const [x,y] of [[46,15],[50,15],[46,22],[50,22]])brazier(x,y);
  foe('mummy',48,18,16);foe('mummy',48,21,16);foe('mummy',47,16,16);foe('mummy',49,16,16);
  // ---- the throne room ----
  for(const y of [4,7,10])for(const x of [37,43,53,59])put('dpillar'+((x+y)%2),x,y,{block:true});
  for(const [x,y] of [[35,3],[61,3],[35,11],[61,11],[45,3],[51,3],[40,12],[56,12]])brazier(x,y);
  put('dpharaoh',44,2,{block:true});put('dpharaoh',52,2,{block:true});put('sarcophU',40,3,{block:true});put('sarcophU',56,3,{block:true});
  for(const [x,y] of [[36,6],[60,6],[36,9],[60,9]])put('danubis',x,y,{block:true});
  for(const [x,y] of [[39,11],[57,11],[48,11]])put('treasure',x,y,{block:true});
  foe('sut',48,6,20);
  items.push({k:'potion',x:35,y:12},{k:'potion',x:61,y:12},{k:'bread',x:21,y:30},{k:'potion',x:48,y:60},{k:'cheese',x:12,y:5},{k:'potion',x:76,y:44});
  // nothing may stand inside a wall or on top of something solid
  const solid=new Set(decor.filter(d=>d.block).map(d=>d.x+','+d.y));
  const okCell=(x,y)=>y>=0&&y<H&&x>=0&&x<W&&g[y][x]==='.';
  const keepE=enemies.filter(e=>okCell(e.x,e.y)&&!solid.has(e.x+','+e.y));
  const discCells=new Set(items.filter(i=>/^sundisc/.test(i.k)).map(i=>i.x+','+i.y));
  for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(d.block&&discCells.has(d.x+','+d.y))decor.splice(i,1)}
  const keepI=items.filter(i=>okCell(i.x,i.y));
  return {rows:out,fm:fl.map(r=>r.join('')),decor,enemies:keepE,items:keepI,lights,secrets,start:{x:48,y:70,f:0}};
}
const TOMB=buildTomb();
const LEVEL42_DATA={rows:TOMB.rows,fmap:TOMB.fm,start:TOMB.start,enemies:TOMB.enemies,items:TOMB.items,decor:TOMB.decor,lights:TOMB.lights,secrets:TOMB.secrets,
  amb:.5,ceilH:1.7,floor:'tombslab',floorSet:['tombslab','tombgold','tombsand','tombdark','tomblapis','tombred'],ceil:'tomb',name:'The Tomb of Sut',label:'Tomb of Sut',diff:16,
  portals:[{to:41,x:RD.W>>1,y:RD.NORTH+1,f:2,tex:'tomb'},{to:43,x:40,y:200,f:0,tex:'sutdoor'}]};
LEVELS[42]=LEVEL42_DATA;
// the gate on the road is open now that the tomb exists, and puts the party at the foot of the cave
LEVEL41_DATA.portals[1]={to:42,x:TOMB.start.x,y:TOMB.start.y,f:0,tex:'tomb'};
LEVEL42_DATA.portals[0].x=SANDROAD.cxN;
function makeTombArt(rdune,rcl){
  makeTombSprites();
  const mk=(kind,seed,wh)=>{const t=dsWallTile(kind,seed),id=addTex(t.d,t.e||null);if(wh)TEX[id].wh=wh;const gid=TNF++;T_TILE[gid]=id;return gid};
  const gH=mk('glyph',11),gG=mk('gold',12),gL=mk('lapis',13),gP=mk('pillar',14),gK=mk('cave',15),gW=mk('plain',16),gS=mk('eye',17),gR=mk('rubble',18);
  // the great sealed door, in five states from empty to full
  SUNDOOR_GIDS.length=0;for(let n=0;n<=4;n++){const t=dsDoorSocketed(n),id=addTex(t.d);const gid=TNF++;T_TILE[gid]=id;SUNDOOR_GIDS.push(gid)}
  LEVEL42_DATA.chars={H:gH,G:gG,L:gL,P:gP,K:gK,W:gW,S:gS,B:SUNDOOR_GIDS[0],Q:gG};
  T_DOORS.sutdoor=addTex(dsDoorSocketed(4).d,null);
  LEVEL42_DATA.gidH=gH;
  if(typeof makeBurrowArt==='function')makeBurrowArt();
}
const SUNDOOR_GIDS=[];
