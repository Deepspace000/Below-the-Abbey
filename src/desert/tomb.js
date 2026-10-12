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
  const corr=new Set(); // narrow passages: nothing is ever placed in them or beside them
  const C=(x0,y0,x1,y1,ft)=>{R(x0,y0,x1,y1,ft||'1','hall');for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)corr.add(x+','+y)};
  const decor=[],enemies=[],items=[],lights=[],secrets=[];
  const put=(k,x,y,o)=>{decor.push(Object.assign({k,x,y,block:false},o||{}));return decor[decor.length-1]};
  const foe=(t,x,y,lvl)=>enemies.push({t,x,y,lvl:lvl||(t==='mummy'?16:15)});
  const brazier=(x,y)=>{put('brazier',x,y,{block:true});lights.push([x,y])};
  const walk={block:false,walk:true}; // treasure and vases can be walked through, like lamps
  // ---- the cave of sand: a winding, narrow way in from the gate ----
  R(47,63,49,71,'2','cave');R(40,61,49,63,'2','cave');R(40,53,42,61,'2','cave');R(40,53,50,55,'2','cave');R(48,46,50,55,'2','cave');
  R(35,56,39,58,'2','cave');R(50,61,56,63,'2','cave');
  // ---- the Hall of Eternity: a long processional hall ----
  R(40,26,56,45,'1','hall');R(44,26,52,45,'4','hall');
  // ---- passages: one cell wide ----
  C(22,35,39,35);C(57,35,75,35);                                  // west and east
  C(42,15,42,25);C(24,15,41,15);                                  // north-west, to the Chamber of Switches
  C(54,16,54,25);C(54,16,75,16);                                  // north-east, to the Sand Pit
  C(48,13,48,18,'4');R(47,19,49,24,'4','hall');                   // beyond the great door: a narrow guard chamber, then a passage to Sut
  // ---- Wing A: the Hall of Embers ----
  R(6,31,21,39,'5','fire');
  // ---- Wing B: the Crypt of Sarcophagi, with a vault behind a secret door ----
  R(76,32,90,38,'3','crypt');R(92,34,94,36,'1','vault');
  // ---- Wing C: the Chamber of Switches ----
  R(15,10,23,20,'3','switch');R(19,22,21,24,'5','vault');R(15,4,30,6,'3','crypt');C(15,7,15,9,'3');
  C(8,14,14,14,'1');R(2,13,4,15,'1','vault');
  // ---- Wing D: the Sand Pit ----
  R(76,5,89,17,'2','pit');
  // ---- the throne room of Sut ----
  R(40,2,56,12,'4','throne');
  // ---- the great door, the secrets, the gate cells of the vault ----
  g[25][47]=g[25][49]='G';g[25][48]='B';
  g[35][91]='S';secrets.push({x:91,y:35,id:'vaultB'});
  g[21][20]='S';secrets.push({x:20,y:21,id:'closet'});
  for(const x of [5,6,7]){g[14][x]='Q'}
  g[1][48]='H'; // where the way out will appear
  g[72][48]='0'; // the way in: the gate at the foot of the cave
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
  const floor=(x,y)=>y>=0&&y<H&&x>=0&&x<W&&g[y][x]==='.';
  // places where a passage meets a room or a door: nothing stands within two squares of these
  const MOUTHS=[[48,26],[48,24],[48,19],[48,13],[48,12],[48,45],[48,46],[40,35],[56,35],[42,26],[54,26],[21,35],[76,35],[90,35],[76,16],[23,15],[15,14],[16,14],[15,10],[15,6],[20,20],[20,22],[4,14],[8,14],[48,70],[48,71]];
  const near=(x,y,r,list)=>list.some(([a,b])=>Math.max(Math.abs(a-x),Math.abs(b-y))<=r);
  const clearOf=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(corr.has((x+dx)+','+(y+dy)))return false;return !near(x,y,2,MOUTHS)};
  // spots for creatures: floor cells of a region that keep clear of the passages, spread out
  const spots=(x0,y0,x1,y1,n,seed,gap)=>{
    const c=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(floor(x,y)&&clearOf(x,y)&&!corr.has(x+','+y))c.push([x,y,hash2(x,y,seed)]);
    c.sort((a,b)=>a[2]-b[2]);const got=[];for(const p of c){if(got.length>=n)break;if(got.every(q=>Math.max(Math.abs(q[0]-p[0]),Math.abs(q[1]-p[1]))>=(gap||3)))got.push(p)}
    return got.map(p=>[p[0],p[1]]);
  };
  // ---- the cave ----
  for(const [x0,y0,x1,y1] of [[35,56,39,58],[50,61,56,63]])for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(floor(x,y)&&hash2(x,y,21)<.22&&clearOf(x,y)&&x>x0&&x<x1)put('dune'+((hash2(x,y,22)*3)|0),x,y,{block:true,sc:.5+hash2(x,y,23)*.4,ox:(hash2(x,y,24)-.5)*.5,oy:.2});
  for(let y=47;y<=71;y++)for(let x=34;x<=57;x++){if(!floor(x,y)||hash2(x,y,25)>=.02||!clearOf(x,y))continue;put('dbones',x,y,{walk:true})}
  for(const [x,y] of [[41,58],[52,62],[45,54]])foe('scorpion',x,y);
  lights.push([48,66],[44,62],[41,57],[45,54],[49,49]);
  // ---- the hall ----
  for(const y of [29,33,37,41])for(const x of [43,53])put('dpillar'+((x+y)%2),x,y,{block:true});
  for(const [x,y] of [[40,28],[56,28],[40,43],[56,43],[46,27],[50,27],[46,44],[50,44]])brazier(x,y);
  for(const [x,y,k] of [[40,31,'danubis'],[56,31,'danubis'],[40,40,'danubis'],[56,40,'danubis'],[40,38,'dbastet'],[56,38,'dbastet'],[40,32,'dbastet'],[56,32,'dbastet']])put(k,x,y,{block:true});
  for(const [x,y] of [[41,44],[55,44],[41,27],[55,27]])put('vase'+((x+y)%4),x,y,walk);
  put('offering',44,28,{block:true});
  for(const [x,y] of [[41,43],[55,43]])put('sarcoph',x,y,{block:true,ambush:['mummy','mummy']});
  lights.push([48,31],[48,40],[44,35],[52,35]);
  for(const x of [28,34,63,69])lights.push([x,35]);
  // ---- Wing A: the Hall of Embers ----
  { // a winding safe path east to west; the other cells hold scorched slabs that fire when stepped on
    const safe=new Set();let sy=35;for(let x=21;x>=9;x--){safe.add(x+','+sy);if(x<20&&hash2(x,sy,31)<.5){const ny=sy+(hash2(x,sy,32)<.5?-1:1);if(ny>=32&&ny<=38){sy=ny;safe.add(x+','+sy)}}}
    while(sy!==35){sy+=sy<35?1:-1;safe.add('9,'+sy)}   // the path ends in line with the disc
    for(const c of ['8,35','7,35','8,34','8,36'])safe.add(c);
    for(let y=31;y<=39;y++)for(let x=9;x<=20;x++){if(safe.has(x+','+y))continue;if(hash2(x,y,33)<.62)put('ventplate',x,y,{trap:'fire',walk:true,sc:1.7})}
    for(const [x,y] of [[8,33],[8,37],[7,33],[7,37]])put('ventplate',x,y,{trap:'fire',hidden:true,walk:true,sc:1.7}); // hidden ones, off the path
    items.push({k:'sundisc1',x:7,y:35});
    for(const [x,y] of [[7,31],[7,39],[20,31],[20,39],[13,31]])brazier(x,y);
    put('danubis',6,33,{block:true});put('danubis',6,37,{block:true});put('treasure',6,31,walk);put('vase2',6,39,walk);
    foe('scorpion',12,33);foe('scorpion',16,38);foe('mummy',10,32);foe('mummy',11,39);
    lights.push([14,35],[10,35]);
  }
  // ---- Wing B: the Crypt of Sarcophagi ----
  for(const [x,y,amb] of [[78,32,1],[82,32,0],[86,32,1],[78,38,0],[82,38,1],[86,38,0]])put('sarcoph',x,y,{block:true,ambush:amb?['mummy','mummy']:undefined});
  for(const [x,y] of [[80,34],[84,36],[88,34]])put('sarcophU',x,y,{block:true,ambush:['mummy']});
  for(const [x,y] of [[76,32],[90,32],[76,38],[90,38],[83,34],[83,36]])brazier(x,y);
  for(const [x,y] of [[80,33],[88,37],[85,37],[79,37]])put('vase'+((x+y)%4),x,y,walk);
  put('treasure',90,33,walk);put('treasure',90,37,walk);
  foe('scorpion',80,36);foe('scorpion',86,36);foe('mummy',84,34,16);
  items.push({k:'sundisc2',x:93,y:35});put('treasure',93,34,walk);put('treasure',93,36,walk);brazier(94,34);
  lights.push([82,35],[86,35]);
  // ---- Wing C: the Chamber of Switches ----
  for(const [x,y] of [[17,12],[21,12],[17,18],[21,18]])put('dpillar'+((x+y)%2),x,y,{block:true});
  for(const [x,y] of [[15,11],[23,11],[15,19],[23,19]])brazier(x,y);
  put('lever',20,10,{wd:[0,-1],idx:1,opens:[[7,14]],deco:true});
  put('lever',20,24,{wd:[0,1],idx:2,opens:[[6,14]],deco:true});
  put('lever',30,5,{wd:[1,0],idx:3,opens:[[5,14]],deco:true});
  foe('mummy',18,15);foe('mummy',22,16);foe('scorpion',19,19);foe('scorpion',27,5);
  put('treasure',29,4,walk);put('vase1',17,4,walk);put('vase3',29,6,walk);brazier(15,4);brazier(30,4);
  items.push({k:'sundisc3',x:2,y:14});put('treasure',2,13,walk);put('treasure',2,15,walk);put('vase0',4,13,walk);put('vase2',4,15,walk);lights.push([3,14],[11,14]);
  lights.push([19,15],[20,5],[28,5],[20,23]);
  // ---- Wing D: the Sand Pit ----
  for(let y=5;y<=17;y++)for(let x=76;x<=89;x++){if(!floor(x,y))continue;
    if(hash2(x,y,41)<.1&&clearOf(x,y)&&!(x===89&&y===6))put('dune'+((hash2(x,y,42)*3)|0),x,y,{block:true,sc:.55+hash2(x,y,43)*.5,ox:(hash2(x,y,44)-.5)*.5,oy:.2});
    else if(hash2(x,y,45)<.02)put('dbones',x,y,{walk:true})}
  for(const [x,y] of spots(76,5,89,17,4,46,4))foe('scorpion',x,y);
  foe('mummy',87,8,16);foe('mummy',88,11,16);foe('mummy',85,6,16);
  for(const [x,y] of [[77,5],[89,17],[77,17],[89,12]])put('treasure',x,y,walk);
  for(const [x,y] of [[80,9],[85,14],[82,6],[79,14]])put('vase'+((x+y)%4),x,y,walk);
  for(const [x,y] of [[76,5],[76,17],[89,5],[89,17],[82,11]])brazier(x,y);
  items.push({k:'sundisc4',x:89,y:6});lights.push([80,10],[86,12],[83,7]);
  // ---- the great door and the sealed way to Sut ----
  foe('mummy',48,20,16);foe('mummy',48,22,16);foe('mummy',47,19,16);
  lights.push([48,21],[48,15]);
  // ---- the throne room ----
  for(const y of [4,7,10])for(const x of [44,52])put('dpillar'+((x+y)%2),x,y,{block:true});
  for(const [x,y] of [[41,2],[55,2],[41,12],[55,12],[46,3],[50,3]])brazier(x,y);
  put('dpharaoh',44,2,{block:true});put('dpharaoh',52,2,{block:true});put('sarcophU',41,4,{block:true});put('sarcophU',55,4,{block:true});
  for(const [x,y] of [[41,7],[55,7],[41,10],[55,10]])put('danubis',x,y,{block:true});
  for(const [x,y] of [[42,11],[54,11],[46,11]])put('treasure',x,y,walk);
  foe('sut',48,6,20);
  items.push({k:'potion',x:42,y:8},{k:'potion',x:54,y:8},{k:'potion',x:9,y:35},{k:'potion',x:41,y:58},{k:'potion',x:18,y:5},{k:'potion',x:79,y:34});
  lights.push([48,6],[48,9]);
  // nothing stands in a wall, in a passage or beside a doorway
  const keepD=decor.filter(d=>['lever','ventplate','dbones','brazier'].includes(d.k)?floor(d.x,d.y):(floor(d.x,d.y)&&clearOf(d.x,d.y)));
  decor.length=0;decor.push(...keepD);
  const solid=new Set(decor.filter(d=>d.block).map(d=>d.x+','+d.y));
  const keepE=enemies.filter(e=>floor(e.x,e.y)&&!solid.has(e.x+','+e.y)&&!corr.has(e.x+','+e.y));
  const discCells=new Set(items.filter(i=>/^sundisc/.test(i.k)).map(i=>i.x+','+i.y));
  for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(discCells.has(d.x+','+d.y)&&d.k!=='lever')decor.splice(i,1)}
  const keepI=items.filter(i=>floor(i.x,i.y));
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
  Object.assign(DS_TEXREG,{wall_glyph:T_TILE[gH],wall_gold:T_TILE[gG],wall_lapis:T_TILE[gL],wall_pillar:T_TILE[gP],wall_cave:T_TILE[gK],wall_plain:T_TILE[gW],wall_eye:T_TILE[gS],wall_rubble:T_TILE[gR]});
  SUNDOOR_GIDS.forEach((g,n)=>{DS_TEXREG['sundoor'+n]=T_TILE[g]});
  T_DOORS.sutdoor=addTex(dsDoorSocketed(4).d,null);DS_TEXREG.sutdoor=T_DOORS.sutdoor;
  LEVEL42_DATA.gidH=gH;
  if(typeof makeBurrowArt==='function')makeBurrowArt();
}
const SUNDOOR_GIDS=[];
