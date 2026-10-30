/* ==========================================================================
   THE MAZE OF GARDENS, the level (id 490, rated 80; prefix gm / GM; the maze is made by garden_gen.js, the pictures are loaded by garden_art.js).
   A hedge maze of 91 by 91 squares under a real sky: nine precincts with their own hedges (clipped box, yew, holly, privet, laurel, copper beech, hawthorn, ivy on old stone and
   the flowering ones: roses, jasmine, wisteria, honeysuckle, lavender, hydrangea, clematis, nasturtium), nineteen garden rooms (a welcome court, fountain court, orchard, knot garden,
   rose garden, little turf labyrinth, herb and kitchen gardens, sundial lawn, hedge theatre, statue gallery, lily pond court, gazebo lawn, ruined folly, bee garden, wisteria walk, topiary zoo,
   the Wardens Court) and a hidden bower with a chest. The party comes in at the foot (WK.GSTART) through the iron gate and leaves at the far end through the lych-gate to Wenlock.
   Guardians: eleven stone statues and garden creatures that wake when the party comes near (level 80), and the Hedge Warden in front of the far gate. Notes in GARDEN_NOTES (tools/GARDEN_NOTES.md).
   ========================================================================== */
const GM_PLAQUES=[ // short notes hung on the hedges and posts; plain words
  ['KEEP LEFT','says the gardener, who is lost'],['THE LITTLE LABYRINTH','Walk in. Walk out. Think.'],['PLEASE DO NOT PICK THE ROSES','The roses pick back'],
  ['SUNDIAL LAWN','It tells the hour on sunny days'],['BEE GARDEN','The bees mind their own business'],['IN THIS ARBOUR','Lady Ysolde was kissed, 1204'],
  ['HERB GARDEN','Sage, thyme, rue and rosemary'],['WARDEN ON DUTY','Visitors will be clipped'],['TO THE KNOT GARDEN','Mind the low hedges'],
  ['A GARDENER WROTE','Trim in June, trim in August, and pray'],['THE POND','Ducks have the right of way'],['STATUES','Do not touch. They remember.'],
  ['FOLLY','Built ruined, on purpose'],['WELCOME','Please keep to the paths. All of them.'],['THE ORCHARD','Windfalls for the bees'],['TO WENLOCK','through the Wardens Court'],
  ['HERE LIES NOTHING','A joke of the old gardener'],['THE FOUNTAIN','Lord Aldric had it carried from the south'],['LOST?','So was the Duke'],['THE THEATRE','Plays at midsummer, rain permitting']];

function gmBuild(){
  if(LEVELS[GM.ID])return;
  gmAlias();
  const m=gmgPick(),W=GMG.W,H=GMG.H,g=m.g,N=GMG.N,rooms=GMG.ROOMS,R=gmgRng(7771),hs=(a,b,c)=>hash2(a,b,c);
  const rid={};rooms.forEach((r,i)=>{rid[r.id]=i});
  const Q={};rooms.forEach(r=>{const q=gmgRect(r);q.cx=(q.x0+q.x1)>>1;q.cy=(q.y0+q.y1)>>1;q.w=q.x1-q.x0+1;q.h=q.y1-q.y0+1;q.id=r.id;q.n=r.n;Q[r.id]=q});
  const inQ=(q,x,y,pad)=>{pad=pad||0;return x>=q.x0-pad&&x<=q.x1+pad&&y>=q.y0-pad&&y<=q.y1+pad};
  const roomAt=(x,y,pad)=>{for(const id in Q)if(inQ(Q[id],x,y,pad))return Q[id];return null};
  const isOpen=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&g[y][x]==='.';
  // ---- the hedges: three rows of three precincts, with ragged edges ----
  const A=i=>'gmhedgeA_'+i,B=i=>'gmhedgeB_'+i;
  const REG=[ // [row north to south][column west to east]: the hedge kinds of the precinct (see garden_hedges.js), base height, corridor ground (0 brick 1 gravel 2 flagstone 3 lawn 4 cobble 5 petals)
    [{h:['rose','box','privet','wisteria','hawthorn','roseW','niche'],wh:1.9,fl:5},{h:['yew','holly','ivy','jasmine','laurel','box','niche'],wh:2.3,fl:2},{h:['beech','wisteria','lavender','laurel','clematis','privet'],wh:2.1,fl:1}],
    [{h:['privet','hydrangea','box','honey','rose','niche','roseP'],wh:1.9,fl:3},{h:['yew','box','laurel','holly','niche','ivy','jasmine'],wh:2.2,fl:1},{h:['hawthorn','lavender','privet','nasturt','beech','honey','roseW'],wh:2.2,fl:4}],
    [{h:['box','clematis','rose','laurel','hydrangea','niche','roseP'],wh:1.9,fl:4},{h:['privet','roseW','box','jasmine','wisteria','niche','honey'],wh:1.9,fl:0},{h:['beech','yew','lavender','hawthorn','ivy','clematis'],wh:2.1,fl:3}]];
  const regAt=(x,y)=>{const u=x+Math.round(4*Math.sin(y*.11)+3*Math.sin(y*.047+1)),v=y+Math.round(4*Math.sin(x*.09+2));
    return REG[Math.max(0,Math.min(2,Math.floor(v/30.4)))][Math.max(0,Math.min(2,Math.floor(u/30.4)))]};
  const RS={ // the hedges of each room's walls, their height
    start:{h:['box','rose','wisteria','roseW','niche'],wh:2.2},fount:{h:['yew','jasmine','box','niche'],wh:2.5},orch:{h:['privet','hawthorn','honey','roseW'],wh:2.2},knot:{h:['box','lavender','rose'],wh:1.9},rose:{h:['rose','roseW','roseP','box'],wh:2.2},
    turf:{h:['box','hawthorn','privet'],wh:2.2},herb:{h:['lavender','box','honey','nasturt'],wh:1.9},kitchen:{h:['nasturt','box','privet','clematis'],wh:1.9},sun:{h:['box','hydrangea','roseW'],wh:1.9},theatre:{h:['yew','laurel','niche','ivy'],wh:2.5},
    gallery:{h:['yew','ivy','niche','laurel'],wh:2.5},pond:{h:['laurel','hydrangea','jasmine','box'],wh:2.2},gazebo:{h:['wisteria','clematis','rose','roseW'],wh:2.2},folly:{h:['ivy','beech','clematis'],wh:2.5},bee:{h:['honey','lavender','hydrangea','nasturt'],wh:1.9},
    wist:{h:['wisteria','jasmine','clematis','wisteria'],wh:2.2},zoo:{h:['box','yew','privet','holly'],wh:2.2},exit:{h:['yew','rose','roseW','box','niche'],wh:2.5}};
  // ---- tiles ----
  const TM=null,chars={},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const lowWall=new Map(); // cells inside rooms that are low hedges (knot garden, turf maze): value = tile name and height
  const rows=[],fm=[],occ=new Set(),decor=[],enemies=[],items=[],lights=[],used=new Set();
  const pick=(list,x,y,sd)=>list[Math.min(list.length-1,Math.floor(hs((x/3)|0,(y/3)|0,sd)*list.length))];
  const QH=h=>[1.9,2.2,2.5].reduce((b,v)=>Math.abs(v-h)<Math.abs(b-h)?v:b,2.2);   // the hedge heights are few, so that the garden is not made of hundreds of tile sizes
  const wallChar=(x,y)=>{
    if(x===0||y===0||x===W-1||y===H-1){const gate=(x===45&&y===0)?'gmgates_0':(x===45&&y===H-1)?'gmgates_1':null;
      return ch(gmHedge('yew',(hs(x,y,3)*4)|0,2.5,gate?{gate}:undefined))}
    const lw=lowWall.get(x+','+y);if(lw)return ch(gmHedge(lw[0],(hs(x,y,9)*4)|0,lw[1]));
    const q=roomAt(x,y,1);let reg;const inRoom=q&&RS[q.id];
    reg=inRoom?RS[q.id]:regAt(x,y);
    const [t,v]=gmhPick(reg.h,x,y,inRoom?31:37),wh=QH(reg.wh+(hs((x/4)|0,(y/4)|0,41)-.5)*.5);
    return ch(gmHedge(t,v,wh))};
  // ---- ground: the corridors take the ground of their precinct, in patches ----
  const GF=['gmf_brick','gmf_gravel','gmf_flag','gmf_lawn','gmf_cobble','gmf_petal'];
  const fl=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const reg=regAt(x,y);let f=reg.fl;if(hs((x/9)|0,(y/9)|0,53)<.3)f=[1,3,2,4][(hs((x/9)|0,(y/9)|0,54)*4)|0];fl[y*W+x]=f}
  // ---- the rooms: ground first ----
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)fl[y*W+x]=f};
  const Rm=id=>Q[id];
  const roomFloor={start:3,fount:2,orch:3,knot:1,rose:5,turf:3,herb:1,kitchen:1,sun:3,theatre:1,gallery:2,pond:2,gazebo:3,folly:1,bee:3,wist:5,zoo:3,exit:2,bower:5};
  for(const id in Q)setF(Q[id].x0,Q[id].y0,Q[id].x1,Q[id].y1,roomFloor[id]);
  // ---- helpers for the pieces ----
  const doorCell=new Set();for(const d of m.doors)doorCell.add(d.x+','+d.y);for(const d of m.sdoors)doorCell.add(d.x+','+d.y);
  const near=new Set();for(const d of m.doors){for(let k=-1;k<=1;k++)for(let l=-1;l<=1;l++)near.add((d.x+k)+','+(d.y+l));if(d.dx!==undefined){for(let t=1;t<=3;t++)near.add((d.x-Math.sign(d.dx)*t)+','+(d.y-Math.sign(d.dy)*t))}}
  for(const gy of [1,H-2]){const dy=gy===1?1:-1;for(let k=-1;k<=1;k++)for(let t=0;t<=2;t++)near.add((45+k)+','+(gy+dy*t))} // the two gates (north to Wenlock, south to the Deeper Hollow): the way in stays clear
  const free=(x,y)=>isOpen(x,y)&&!occ.has(x+','+y)&&!near.has(x+','+y);
  const placed=new Set(),faces=new Set(); // wall faces that already carry a picture (a trellis, a niche, a plaque): one picture per face
  const dec=(a,x,y,o)=>{o=o||{};const k=a.startsWith('gm_')||a==='chest'?a:'gm_'+a;if(!isOpen(x,y))return null;
    const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}if(o.sc)d.sc=o.sc;if(o.npc){d.npc=o.npc;d.deco=false;if(o.block)d.solid=1}if(o.txt)d.txt=o.txt;if(o.bob)d.bob=o.bob;if(o.goldAmt)d.goldAmt=o.goldAmt;if(o.wd){d.wd=o.wd;d.pic=1}
    if(o.wd){const fk=x+','+y+','+o.wd;if(faces.has(fk))return null;faces.add(fk)}else{const pk=k+'@'+x+','+y;if(placed.has(pk))return null;placed.add(pk)} // the same piece twice on one square: once is enough
    decor.push(d);if(o.block||o.occ)occ.add(x+','+y);return d};
  const D=(a,x,y,o)=>free(x,y)?dec(a,x,y,o):null;                 // only on free squares
  const DB=(a,x,y,o)=>D(a,x,y,Object.assign({block:true},o||{}));  // standing in the way
  const lamp=(x,y)=>{if(D('lamp',x,y)){lights.push([x,y])}};
  const plaqueN=new Set();let plq=0;
  // a plaque hangs flat on a hedge: on its own face (another face of the same square when that one is taken), and when the hedge behind is open (a doorway) it moves along the wall to the nearest hedge
  const plaque=(x,y,wd,t)=>{const T=t||GM_PLAQUES[(plq++)%GM_PLAQUES.length];if(!isOpen(x,y))return;
    const ok=(px,py,w)=>isOpen(px,py)&&!isOpen(px+w[0],py+w[1])&&!faces.has(px+','+py+','+w)&&!doorCell.has(px+','+py);
    let at=null;for(let s=0;s<=3&&!at;s++)for(const sg of (s?[1,-1]:[1])){const px=x+(wd[0]?0:s*sg),py=y+(wd[0]?s*sg:0);if(ok(px,py,wd)){at=[px,py,wd];break}}
    if(!at)for(const w of [[0,-1],[0,1],[1,0],[-1,0]])if(ok(x,y,w)){at=[x,y,w];break}
    if(!at)return;faces.add(at[0]+','+at[1]+','+at[2]);decor.push({k:'sign_gm',x:at[0],y:at[1],block:false,wd:at[2],txt:[T[0],T[1]]})};
  const foe=(t,x,y)=>{if(!isOpen(x,y))return;enemies.push({t,x,y,lvl:80});occ.add(x+','+y)};
  const ring=(q,pad,fn)=>{for(let x=q.x0+pad;x<=q.x1-pad;x++){fn(x,q.y0+pad);fn(x,q.y1-pad)}for(let y=q.y0+pad+1;y<q.y1-pad;y++){fn(q.x0+pad,y);fn(q.x1-pad,y)}};
  // a low hedge cell inside a room (blocks, painted as a clipped box hedge)
  const low=(x,y,tex,wh,force)=>{if(!isOpen(x,y)||doorCell.has(x+','+y)||(!force&&near.has(x+','+y)))return;lowWall.set(x+','+y,[(tex&&!/^gmhedge/.test(tex))?tex:'box',wh||.6]);g[y][x]='L'};
  const walkers=[];
  const walker=(a,x,y,r,o)=>{const d=D(a,x,y,Object.assign({bob:0},o||{}));if(!d)return;const id='gmw'+walkers.length;d.cloudid=id;walkers.push({id,home:[x,y],r,cell:[x,y],tgt:null,f:0,wait:R()*3,prev:null,sp:(o&&o.sp)||.5})};
  // ---- THE WELCOME COURT: the first look ----
  {const q=Q.start,cx=45;
    setF(q.x0,q.y0,q.x1,q.y1,3);setF(cx-2,q.y0,cx+2,q.y1,0);setF(q.x0,q.y1-3,q.x1,q.y1-1,0);setF(cx-1,q.y0,cx+1,q.y1,0);
    for(const x of [cx-3,cx+3])for(let y=q.y1-2;y>=q.y0+2;y-=2)DB('cypress',x,y);               // the avenue: a row of cypresses on each side
    for(const x of [q.x0+3,q.x1-3])for(let y=q.y0+2;y<=q.y1-2;y+=3)DB(hs(x,y,9)<.5?'yew':'cypress',x,y);
    for(const y of [q.y1-5,q.y0+8])for(const x of [cx-2,cx+2])D('top_cone',x,y);
    D('arbour',cx-1,q.y1-1);D('arbour',cx+1,q.y1-1);
    DB('fountain',cx,q.y0+3,{sc:1.15});lights.push([cx,q.y0+3]);
    for(const dx of [-2,2]){D('top_spiral',cx+dx,q.y0+1)}
    for(const dx of [-5,5]){DB('urn',cx+dx,q.y0+3);DB('bench_stone',cx+dx*1.6|0,q.y0+6)}
    DB('lady',q.x0+2,q.y0+2);DB('knight',q.x1-2,q.y0+2);
    for(const [x,y] of [[cx-3,q.y1-1],[cx+3,q.y1-1],[cx-6,q.y1-4],[cx+6,q.y1-4]])lamp(x,y);
    for(const [x,y,a] of [[q.x0+1,q.y1,'rose_red'],[q.x1-1,q.y1,'rose_white'],[q.x0+1,q.y0+8,'tulips'],[q.x1-1,q.y0+8,'tulips'],[cx-8,q.y0+3,'hydrangea'],[cx+8,q.y0+3,'hydrangea']])DB(a,x,y);
    walker('peacockfan',cx-4,q.y0+5,2);walker('peacock',cx+4,q.y0+6,2);walker('butterfly',cx-6,q.y0+2,3);
    plaque(cx+1,q.y1,[0,1],['WELCOME','Please keep to the paths. All of them.'])}
  // ---- THE FOUNTAIN COURT ----
  {const q=Q.fount;setF(q.x0,q.y0,q.x1,q.y1,2);setF(q.x0,q.y0,q.x0+2,q.y1,3);setF(q.x1-2,q.y0,q.x1,q.y1,3);
    DB('fountain',q.cx,q.cy,{sc:1.3});lights.push([q.cx,q.cy]);
    for(const [x,y] of [[q.x0,q.y0],[q.x1,q.y0],[q.x0,q.y1],[q.x1,q.y1]])DB('urn',x,y);
    DB('bench_stone',q.cx-4,q.cy-1);DB('bench_stone',q.cx+4,q.cy+1);D('hydrangea',q.cx-3,q.y0);D('hydrangea',q.cx+3,q.y1);
    D('top_ball',q.x0+2,q.cy);D('top_ball',q.x1-2,q.cy);lamp(q.cx-6,q.y0);lamp(q.cx+6,q.y1);walker('duck',q.cx+2,q.cy+2,2);
    foe('gmlion',q.x0+3,q.cy);plaque(q.cx,q.y0,[0,-1],['THE FOUNTAIN','Lord Aldric had it carried from the south'])}
  // ---- THE ORCHARD CLOSE ----
  {const q=Q.orch;setF(q.x0,q.y0,q.x1,q.y1,3);const T=['apple','crab','cherry','apple','lime'];let n=0;
    for(let y=q.y0+2;y<=q.y1-2;y+=3)for(let x=q.x0+2;x<=q.x1-2;x+=3){const t=T[(n++)%T.length];if((x+y)%2===0||true)DB(t,x+(hs(x,y,5)<.3?1:0),y)}
    for(let y=q.y0+2;y<=q.y1-2;y+=3)for(let x=q.x0+2;x<=q.x1-2;x+=3)setF(x-1,y-1,x+1,y+1,hs(x,y,6)<.4?5:3);
    DB('skep',q.x1-1,q.cy);DB('skep',q.x1-1,q.cy+2);DB('table',q.x0+4,q.y1-1);D('bench_wood',q.x0+6,q.y1-1);
    walker('rabbit',q.cx,q.cy+1,3);walker('rabbit',q.cx-3,q.cy-2,3);walker('bee',q.x1-2,q.cy+1,2);walker('butterfly',q.cx+2,q.cy-3,3);
    foe('gmhound',q.cx+1,q.cy);lamp(q.x0+1,q.y0+1);plaque(q.x0,q.cy,[-1,0],['THE ORCHARD','Windfalls for the bees'])}
  // ---- THE KNOT GARDEN: low box hedges in a pattern, the sundial at the heart ----
  {const q=Q.knot;setF(q.x0,q.y0,q.x1,q.y1,1);setF(q.x0+2,q.y0+2,q.x1-2,q.y1-2,3);setF(q.x0+4,q.y0+4,q.x1-4,q.y1-4,1);
    const r1=(x,y)=>{const d=Math.max(Math.abs(x-q.cx),Math.abs(y-q.cy));return d};
    for(let y=q.y0;y<=q.y1;y++)for(let x=q.x0;x<=q.x1;x++){const d=r1(x,y);const gapS=(d===4&&(x===q.cx||y===q.cy)&&(x===q.cx&&y>q.cy||y===q.cy&&x<q.cx)),gapN=(d===2&&(x===q.cx&&y<q.cy||y===q.cy&&x>q.cx));
      if(d===4&&!gapS)low(x,y,A(0),.42);if(d===2&&!gapN)low(x,y,A(0),.42)}
    DB('sundial',q.cx,q.cy);for(const [x,y] of [[q.x0,q.y0],[q.x1,q.y0],[q.x0,q.y1],[q.x1,q.y1]])DB('top_cone',x,y);
    for(const [x,y] of [[q.x0+1,q.cy],[q.x1-1,q.cy],[q.cx,q.y0+1],[q.cx,q.y1-1]])D('top_ball',x,y);
    D('tulips',q.cx-3,q.cy-3);D('tulips',q.cx+3,q.cy+3);D('lavender',q.cx+3,q.cy-3);D('lavender',q.cx-3,q.cy+3);lamp(q.cx+5,q.cy+5);walker('butterfly',q.cx-5,q.cy,3);
    plaque(q.cx,q.y0,[0,-1],['TO THE KNOT GARDEN','Mind the low hedges'])}
  // ---- THE ROSE GARDEN ----
  {const q=Q.rose;setF(q.x0,q.y0,q.x1,q.y1,5);setF(q.cx,q.y0,q.cx,q.y1,1);setF(q.x0,q.cy,q.x1,q.cy,1);
    for(let x=q.x0+2;x<=q.x1-2;x+=2){if(x===q.cx)continue;for(const y of [q.y0+1,q.y0+3,q.y1-1,q.y1-3])DB(((x+y)%4===0)?'rose_white':'rose_red',x,y)}
    D('arbour',q.cx,q.y0+2);D('arbour',q.cx,q.y1-2);D('arbour',q.x0+2,q.cy);D('arbour',q.x1-2,q.cy);DB('birdbath',q.cx,q.cy);
    DB('rosetree',q.x0,q.y0);DB('rosetree',q.x1,q.y0);DB('rosetree',q.x0,q.y1);DB('rosetree',q.x1,q.y1);DB('bench_wood',q.cx-3,q.cy+1);DB('bench_wood',q.cx+3,q.cy-1);
    lamp(q.cx-2,q.cy-2);lamp(q.cx+2,q.cy+2);walker('butterfly',q.cx+3,q.cy+3,3);walker('bee',q.cx-3,q.cy-3,2);foe('gmhound',q.cx+1,q.cy+3);
    plaque(q.cx-1,q.y0,[0,-1],['PLEASE DO NOT PICK THE ROSES','The roses pick back'])}
  // ---- THE LITTLE LABYRINTH: a walled box of low turf hedges, five by five, a chest at its heart ----
  {const q=Q.turf;setF(q.x0,q.y0,q.x1,q.y1,3);const bx0=q.x0+1,by0=q.y0+1,bx1=q.x1-1,by1=q.y1-1;
    // the box: wall ring, a one square gap at the south middle, nodes at odd offsets inside
    for(let y=by0;y<=by1;y++)for(let x=bx0;x<=bx1;x++){const edge=x===bx0||x===bx1||y===by0||y===by1;if(edge||(x-bx0)%2===0||(y-by0)%2===0)low(x,y,A(3),.4,true)}
    const rr=gmgRng(31),nodes=[],seen=new Set(),st=[[2,2]],cell=(i,j)=>[bx0+1+2*i,by0+1+2*j];
    // five by five nodes: a walk from the entrance node (2,4) outwards; walls between visited nodes are opened
    const adj={},open=(a,b)=>{(adj[a]=adj[a]||[]).push(b);(adj[b]=adj[b]||[]).push(a);const [x1,y1]=cell(a[0],a[1]),[x2,y2]=cell(b[0],b[1]);const mx=(x1+x2)>>1,my=(y1+y2)>>1;lowWall.delete(mx+','+my);g[my][mx]='.'};
    for(let j=0;j<5;j++)for(let i=0;i<5;i++){const [x,y]=cell(i,j);lowWall.delete(x+','+y);g[y][x]='.'}
    const s2=[[2,4]];seen.add('2,4');
    while(s2.length){const [i,j]=s2[s2.length-1],c=[[0,-1],[1,0],[0,1],[-1,0]].map(d=>[i+d[0],j+d[1]]).filter(([a,b])=>a>=0&&b>=0&&a<5&&b<5&&!seen.has(a+','+b));
      if(!c.length){s2.pop();continue}const n=c[(rr()*c.length)|0];open([i,j],n);seen.add(n[0]+','+n[1]);s2.push(n)}
    const [ex,ey]=cell(2,4);lowWall.delete(ex+','+(ey+1));g[ey+1][ex]='.'; // the gap in the south wall
    // the chest lies at the far end of the little maze (the node furthest from the way in)
    let far=[2,4],fd=-1;{const dd={'2,4':0},qq=[[2,4]];for(let i=0;i<qq.length;i++){const a=qq[i];for(const b of (adj[a]||[]))if(dd[b]===undefined){dd[b]=dd[a]+1;qq.push(b);if(dd[b]>fd){fd=dd[b];far=b}}}}
    const [cx,cy]=cell(far[0],far[1]);DB('chest',cx,cy,{goldAmt:4000});for(const [i,j] of [[0,0],[4,0],[0,4],[4,4]]){const [x,y]=cell(i,j);D('flowers'+(i+j)%3,x,y,{sc:.8})}
    DB('top_ball',bx0-1+0,by0-1+0);DB('top_ball',bx1+1,by0-1);D('lavender',q.x0,q.y1);D('lavender',q.x1,q.y1);lights.push([cx,cy]);
    plaque(ex,by1+1<=q.y1?by1+1:by1,[0,1],['THE LITTLE LABYRINTH','Walk in. Walk out. Think.'])}
  // ---- THE HERB GARDEN ----
  {const q=Q.herb;setF(q.x0,q.y0,q.x1,q.y1,1);
    for(const [dx,dy] of [[-3,-2],[3,-2],[-3,2],[3,2]])DB('herbbed',q.cx+dx,q.cy+dy);
    for(let x=q.x0;x<=q.x1;x+=2){D('lavender',x,q.y0);D('lavender',x,q.y1)}
    DB('sundial',q.cx,q.cy-3);DB('skep',q.x1,q.cy);DB('skep',q.x0,q.cy);DB('table',q.cx,q.cy+3);D('trellis',q.x0+1,q.y0+1);D('trellis',q.x1-1,q.y0+1);
    foe('gmtrap',q.cx,q.cy);walker('bee',q.cx-2,q.cy,2);lamp(q.cx+2,q.cy-2);plaque(q.cx,q.y1,[0,1],['HERB GARDEN','Sage, thyme, rue and rosemary'])}
  // ---- THE KITCHEN GARDEN ----
  {const q=Q.kitchen;setF(q.x0,q.y0,q.x1,q.y1,1);DB('well',q.cx,q.cy);
    for(const [x,y,a] of [[q.x0+1,q.y0+1,'cabbages'],[q.x1-1,q.y0+1,'pumpkins'],[q.x0+1,q.y1-1,'pumpkins'],[q.x1-1,q.y1-1,'cabbages']])DB(a,x,y);
    D('sunflowers',q.x0,q.cy);D('sunflowers',q.x1,q.cy);D('sunflowers',q.cx,q.y0);D('trellis',q.cx,q.y1);walker('rabbit',q.cx+1,q.cy+2,2);lamp(q.cx-2,q.cy+2)}
  // ---- THE SUNDIAL LAWN ----
  {const q=Q.sun;setF(q.x0,q.y0,q.x1,q.y1,3);setF(q.cx,q.y0,q.cx,q.y1,1);setF(q.x0,q.cy,q.x1,q.cy,1);DB('sundial',q.cx,q.cy,{sc:1.2});
    for(const [x,y] of [[q.cx-2,q.cy-2],[q.cx+2,q.cy+2]])DB('bench_stone',x,y);for(const [x,y] of [[q.x0,q.y0],[q.x1,q.y0],[q.x0,q.y1],[q.x1,q.y1]])DB('yew',x,y);
    D('tulips',q.cx-2,q.cy+2);D('tulips',q.cx+2,q.cy-2);walker('peahen',q.cx+2,q.cy+3,2);walker('butterfly',q.cx,q.cy-3,3);
    plaque(q.cx,q.y0,[0,-1],['SUNDIAL LAWN','It tells the hour on sunny days'])}
  // ---- THE HEDGE THEATRE ----
  {const q=Q.theatre;setF(q.x0,q.y0,q.x1,q.y1,1);setF(q.x0,q.y0,q.x1,q.y0+1,3);DB('theatre',q.cx,q.y0,{sc:1.9});
    for(const y of [q.y0+4,q.y0+6])for(let x=q.x0+1;x<=q.x1-1;x++){if(Math.abs(x-q.cx)<=1)continue;if((x-q.x0)%3===1)DB('bench_wood',x,y)}
    lamp(q.x0+1,q.y0+2);lamp(q.x1-1,q.y0+2);D('top_crown',q.x0+1,q.y1);D('top_crown',q.x1-1,q.y1);
    plaque(q.cx,q.y1,[0,1],['THE THEATRE','Plays at midsummer, rain permitting'])}
  // ---- THE STATUE GALLERY ----
  {const q=Q.gallery;setF(q.x0,q.y0,q.x1,q.y1,2);setF(q.x0,q.cy,q.x1,q.cy,0);
    const S=['knight','lady','saint','angel','lady','knight','angel','saint'];let n=0;
    for(let x=q.x0+1;x<=q.x1-1;x+=3){const a=S[(n++)%S.length],b=S[(n+3)%S.length];
      if(x===q.x0+4)foe('gmknight',x,q.y0+1);else DB(a,x,q.y0+1);
      if(x===q.x1-4)foe('gmknight',x,q.y1-1);else DB(b,x,q.y1-1)}
    for(let x=q.x0+2;x<=q.x1-2;x+=3){D('niche',x,q.y0,{wd:[0,-1],pic:1,bob:.5,occ:0})}
    lamp(q.x0+3,q.cy);lamp(q.cx,q.cy);lamp(q.x1-3,q.cy);DB('chest',q.x1,q.cy,{goldAmt:3000});
    plaque(q.x0,q.cy,[-1,0],['STATUES','Do not touch. They remember.'])}
  // ---- THE LILY POND COURT ----
  {const q=Q.pond;setF(q.x0,q.y0,q.x1,q.y1,2);setF(q.x0+3,q.y0+2,q.x1-3,q.y1-2,4);
    DB('pondrim',q.cx,q.cy,{sc:2.4});for(const dx of [-1,1])occ.add((q.cx+dx)+','+q.cy);
    for(const [x,y] of [[q.cx-2,q.cy-1],[q.cx+2,q.cy+1],[q.cx,q.cy-2],[q.cx,q.cy+2]])DB('lilytub',x,y);
    for(const [x,y] of [[q.x0,q.y0],[q.x1,q.y0]])DB(R()<.5?'willow':'willow2',x,y);DB('bench_stone',q.x0+2,q.y1);DB('bench_stone',q.x1-2,q.y1);
    walker('swan',q.cx-2,q.cy+1,2);walker('duck',q.cx+2,q.cy-1,2);walker('duck',q.cx+3,q.cy+1,2);walker('frog',q.cx,q.cy+3,2);lamp(q.x0+1,q.cy);lamp(q.x1-1,q.cy);
    foe('gmlion',q.x1-2,q.cy-2);plaque(q.cx,q.y1,[0,1],['THE POND','Ducks have the right of way'])}
  // ---- THE GAZEBO LAWN ----
  {const q=Q.gazebo;setF(q.x0,q.y0,q.x1,q.y1,3);setF(q.cx,q.y0,q.cx,q.y1,1);DB('gazebo',q.cx,q.cy,{sc:1.35});
    for(const [x,y] of [[q.x0,q.y0],[q.x1,q.y0],[q.x0,q.y1],[q.x1,q.y1]])DB('rose_red',x,y);D('rose_white',q.cx-3,q.cy);D('rose_white',q.cx+3,q.cy);DB('bench_wood',q.cx-3,q.y1);DB('bench_wood',q.cx+3,q.y0);
    lamp(q.cx-2,q.y0);lamp(q.cx+2,q.y1);walker('peahen',q.cx-3,q.cy+2,2);walker('butterfly',q.cx+3,q.cy+2,3)}
  // ---- THE RUINED FOLLY ----
  {const q=Q.folly;setF(q.x0,q.y0,q.x1,q.y1,1);DB('folly',q.cx,q.cy-1,{sc:1.35});
    DB('column',q.x0+1,q.y0+1);DB('column',q.x1-1,q.y0+1);DB('ruinarch',q.x0+1,q.y1-1);DB('obelisk',q.x1-1,q.y1-1);D('cross',q.cx,q.y1);D('fern',q.x0,q.cy);D('fern2',q.x1,q.cy);
    foe('gmgargoyle',q.cx-3,q.cy+2);foe('gmgargoyle',q.cx+3,q.cy+2);DB('chest',q.cx,q.y0,{goldAmt:3500});lamp(q.cx-2,q.cy+3);
    plaque(q.cx-3,q.y1,[0,1],['FOLLY','Built ruined, on purpose'])}
  // ---- THE BEE GARDEN ----
  {const q=Q.bee;setF(q.x0,q.y0,q.x1,q.y1,3);setF(q.cx,q.y0,q.cx,q.y1,1);
    for(const y of [q.y0+1,q.y1-1])for(let x=q.x0+1;x<=q.x1-1;x+=2)if(x!==q.cx)DB('skep',x,y);
    for(const [x,y] of [[q.x0,q.cy],[q.x1,q.cy]])D('sunflowers',x,y);D('lavender',q.cx-2,q.cy);D('lavender',q.cx+2,q.cy);D('hollyhock',q.x0+1,q.y1);D('hollyhock',q.x1-1,q.y0);
    foe('gmbriar',q.cx,q.cy);walker('bee',q.cx-2,q.cy-2,3);walker('bee',q.cx+2,q.cy+2,3);walker('bee',q.cx+1,q.cy-1,3);lamp(q.cx,q.y1);
    plaque(q.cx,q.y1,[0,1],['BEE GARDEN','The bees mind their own business'])}
  // ---- THE WISTERIA WALK ----
  {const q=Q.wist;setF(q.x0,q.y0,q.x1,q.y1,5);setF(q.cx,q.y0,q.cx,q.y1,1);D('wisteriaw',q.cx,q.cy-2,{sc:1.2});D('wisteriaw',q.cx,q.cy+2,{sc:1.2});
    DB('bench_wood',q.cx-2,q.cy);DB('bench_wood',q.cx+2,q.cy);DB('lady',q.x0,q.y0);DB('saint',q.x1,q.y0);DB('urn',q.x0,q.y1);DB('urn',q.x1,q.y1);
    lamp(q.cx-1,q.y1);lamp(q.cx+1,q.y0);walker('butterfly',q.cx+2,q.cy+2,3);D('laburnum',q.x0+1,q.cy);D('magnolia',q.x1-1,q.cy)}
  // ---- THE TOPIARY ZOO ----
  {const q=Q.zoo;setF(q.x0,q.y0,q.x1,q.y1,3);setF(q.cx,q.y0,q.cx,q.y1,1);setF(q.x0,q.cy,q.x1,q.cy,1);
    const T=['top_peacock','top_swan','top_rabbit','top_horse','top_dragon','top_stag','top_hound','top_crown'];let n=0;
    for(const [dx,dy] of [[-4,-2],[-2,-3],[2,-3],[4,-2],[-4,2],[-2,3],[2,3],[4,2]])DB(T[(n++)%8],q.cx+dx,q.cy+dy);
    DB('top_balls',q.cx-5,q.cy);DB('top_balls',q.cx+5,q.cy);foe('gmhound',q.cx,q.cy-1);foe('gmgargoyle',q.cx,q.cy+2);lamp(q.cx-1,q.cy+1);lamp(q.cx+1,q.cy-1);walker('rabbit',q.cx-3,q.cy+1,2)}
  // ---- THE WARDENS COURT: the far gate ----
  {const q=Q.exit;setF(q.x0,q.y0,q.x1,q.y1,2);setF(q.x0+3,q.y0,q.x1-3,q.y1,5);
    foe('gmwarden',45,q.cy+1);DB('knight',q.cx-5,q.y0+1);DB('knight',q.cx+5,q.y0+1);DB('cypress',q.cx-8,q.y0+2);DB('cypress',q.cx+8,q.y0+2);DB('cypress',q.cx-8,q.y1-1);DB('cypress',q.cx+8,q.y1-1);
    lamp(q.cx-2,q.y0);lamp(q.cx+2,q.y0);lamp(q.cx-4,q.cy+2);lamp(q.cx+4,q.cy+2);D('urn',q.cx-3,q.y0+1,{block:true});D('urn',q.cx+3,q.y0+1,{block:true});
    plaque(q.cx+1,q.y0,[0,-1],['TO WENLOCK','through the Wardens Court']);D('rose_red',q.cx-6,q.y1);D('rose_white',q.cx+6,q.y1)}
  // ---- THE HIDDEN BOWER ----
  {const q=Q.bower;setF(q.x0,q.y0,q.x1,q.y1,5);DB('chest',q.x1,q.cy,{goldAmt:6000});D('bowerseat',q.x0+1,q.cy,{block:true,sc:.8});D('lavender',q.x1,q.y0);D('rose_white',q.x1,q.y1);lights.push([q.cx,q.cy]);
    for(const d of m.sdoors){const o=dec('wisteriaw',d.x,d.y,{sc:1.05});}}
  // ---- every room is dressed along its walls: beds and shrubs round the edge, climbers hung on the hedges ----
  {const PAL={default:['hydrangea','rose_red','rose_white','lavender','hollyhock','delphinium','flowers0','flowers1','flowers2','fern'],
      folly:['fern','fern2','flowers0','lavender'],gallery:['top_cone','urn','lavender','flowers1'],pond:['lavender','hydrangea','flowers0','fern','delphinium'],theatre:['top_cone','lavender','rose_red','hydrangea'],
      zoo:['flowers0','flowers1','tulips','flowers2'],exit:['rose_red','rose_white','lavender','hydrangea'],start:['rose_red','rose_white','hydrangea','tulips'],knot:['lavender','tulips'],orch:['flowers0','flowers1','flowers2','fern'],turf:['lavender','flowers0']};
    const BLK=new Set(['hydrangea','rose_red','rose_white','top_cone','urn']);
    for(const id in Q){if(id==='bower')continue;const q=Q[id],pal=PAL[id]||PAL.default;
      ring(q,0,(x,y)=>{if(hs(x,y,71)>.5)return;const a=pal[(hs(x,y,72)*pal.length)|0];D(a,x,y,{block:BLK.has(a),sc:.85+hs(x,y,73)*.3})});
      // climbers hung on the hedge walls, a few squares apart
      for(let x=q.x0+1;x<=q.x1-1;x+=4){if(hs(x,q.y0,74)<.7&&isOpen(x,q.y0)&&!near.has(x+','+q.y0))dec(hs(x,q.y0,75)<.8?'trellis':'niche',x,q.y0,{wd:[0,-1]});
        if(hs(x,q.y1,76)<.5&&isOpen(x,q.y1)&&!near.has(x+','+q.y1))dec('trellis',x,q.y1,{wd:[0,1]})}
      for(let y=q.y0+1;y<=q.y1-1;y+=4){for(const [x,wd] of [[q.x0,[-1,0]],[q.x1,[1,0]]])if(hs(x,y,77)<.55&&isOpen(x,y)&&!near.has(x+','+y))dec('trellis',x,y,{wd})}}}
  // ---- the corridors: a few things at the dead ends and along the way ----
  const deg=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>isOpen(x+a,y+b)).length;
  const corr=[],dead=[];
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!isOpen(x,y)||roomAt(x,y,0)||near.has(x+','+y))continue;corr.push([x,y]);if(deg(x,y)===1)dead.push([x,y])}
  const DEADK=['bench_stone','birdbath','urn','sundial','lady','saint','angel','cross','niche','well','top_cone','top_ball','rosetree','bench_wood','hydrangea','obelisk'];
  let dn=0;for(const [x,y] of dead){if(hs(x,y,61)>.7)continue;const a=DEADK[(hs(x,y,62)*DEADK.length)|0],op=[[1,0],[-1,0],[0,1],[0,-1]].find(([p,q])=>isOpen(x+p,y+q));
    // seen from the way in: the piece stands at the end of the passage; a niche is set in the end wall
    const d=a==='niche'?(op?dec(a,x,y,{wd:[-op[0],-op[1]]}):null):dec(a,x,y,{block:true});if(d)dn++}
  // flowers and butterflies along the corridors (walk through)
  let fc=0;for(const [x,y] of corr){const r=hs(x,y,63);const foot=[[0,-1],[0,1],[1,0],[-1,0]].some(([p,q])=>!isOpen(x+p,y+q));if(r<(foot?.22:.1)&&!occ.has(x+','+y)){const a=hs(x,y,64)<.45?'tuft'+((hs(x,y,80)*12)|0):['flowers0','flowers1','flowers2','lavender','tulips','fern','fern2','rose_red','rose_white','hydrangea','delphinium','hollyhock','herbbed','lilytub','sunflowers','skep','rosetree','birdbath','cabbages','pumpkins'][(hs(x,y,64)*20)|0];dec(a,x,y,{sc:a[0]==='t'?.9+hs(x,y,65)*.5:.55+hs(x,y,65)*.25});fc++}
    else if(r<.04)dec('butterfly',x,y,{bob:.4})}
  // butterflies, bees and drifting motes of light, each circling its own square (moved smoothly by the update below)
  const FLY=[];{gmMotes();let bn=0,ben=0,mn=0;const add=(a,x,y,o,sp,r,b)=>{const d=dec(a,x,y,o);if(!d)return;d.cloudid='gmf'+FLY.length;FLY.push({sp,r,b,ph:hs(x,y,95)*6.28});return d};
    for(const [x,y] of corr){const r=hs(x,y,90);if(occ.has(x+','+y)||near.has(x+','+y))continue;
      if(r<.05&&bn<110){if(add('butterfly',x,y,{bob:.5,sc:.42+hs(x,y,92)*.3},.7+hs(x,y,94)*.8,.34,.5+hs(x,y,91)*.4))bn++}
      else if(r<.088&&ben<80){if(add('bee',x,y,{bob:.4,sc:.5},1.8+hs(x,y,94)*1.2,.3,.4+hs(x,y,91)*.3))ben++}
      else if(r<.125&&mn<110){if(add('mote'+((hs(x,y,96)*4)|0),x,y,{bob:.3,sc:.5+hs(x,y,92)*.5},.25+hs(x,y,94)*.3,.36,.25+hs(x,y,91)*.9))mn++}}}
  // climbers hung on the hedge walls along the corridors
  for(const [x,y] of corr){if(hs(x,y,78)>.022||occ.has(x+','+y))continue;const wl=[[0,-1],[0,1],[1,0],[-1,0]].filter(([p,q])=>!isOpen(x+p,y+q));if(wl.length&&wl.length<=2)dec('trellis',x,y,{wd:wl[(hs(x,y,79)*wl.length)|0]})}
  // lamps at some junctions
  let lc=0;for(const [x,y] of corr){if(deg(x,y)>=3&&hs(x,y,66)<.28&&!occ.has(x+','+y)){dec('lamp',x,y);lights.push([x,y]);lc++}}
  // plaques on the hedges at dead ends and along the way
  let pc=0;for(const [x,y] of corr){if(hs(x,y,67)>.014||occ.has(x+','+y))continue;const wdl=[[0,-1],[0,1],[1,0],[-1,0]].filter(([p,q])=>!isOpen(x+p,y+q));if(!wdl.length)continue;
    plaque(x,y,wdl[(hs(x,y,68)*wdl.length)|0]);pc++}
  // small finds at dead ends
  const IK=['potion3','potion3','supermana','elixir'];let ic=0;
  for(const [x,y] of dead){if(occ.has(x+','+y)||hs(x,y,69)>.14)continue;items.push({k:IK[ic%4],x,y});ic++}
  // sunbeams: a soft shaft of gold light at a few of the junctions, with a mote or two in it; and rose petals blowing low along the ground in the precincts of roses
  {let bc=0,pc2=0;for(const [x,y] of corr){if(occ.has(x+','+y)||near.has(x+','+y))continue;
      if(deg(x,y)>=3&&hs(x,y,97)<.1&&bc<9){const d=dec('beam',x,y,{bob:0,sc:1});if(d){bc++;add2('mote'+((hs(x,y,98)*4)|0),x,y,.35,.45)}}
      else if(hs(x,y,99)<.06&&pc2<70&&regAt(x,y).h.some(k=>/^rose/.test(k))){const d=dec('petal'+((hs(x,y,100)*3)|0),x,y,{bob:.03,sc:1});if(d){d.cloudid='gmf'+FLY.length;FLY.push({sp:.5+hs(x,y,94)*.4,r:.46,b:.03,ph:hs(x,y,95)*6.28});pc2++}}}
    function add2(a,x,y,sp,r){const d=dec(a,x,y,{bob:.5,sc:.7});if(d){d.cloudid='gmf'+FLY.length;FLY.push({sp,r,b:.5,ph:hs(x,y,95)*6.28})}}}
  // ---- the small folk and what they have lost (see garden_folk.js) ----
  {const D2=dead.slice().sort((p,q)=>hs(p[0],p[1],110)-hs(q[0],q[1],110));
    const spot=(room,dx,dy)=>{const q=Q[room];return q?[q.cx+dx,q.cy+dy]:null};
    const place=(a,npc,pos,o)=>{if(!pos)return;for(let r=0;r<4;r++)for(let ax=-r;ax<=r;ax++)for(let ay=-r;ay<=r;ay++){if(Math.max(Math.abs(ax),Math.abs(ay))!==r)continue;const x=pos[0]+ax,y=pos[1]+ay;if(isOpen(x,y)&&!occ.has(x+','+y)){const d=dec(a,x,y,Object.assign({npc},o||{}));if(d)return d}}};
    place('duck','gmo_duchess',spot('pond',3,2),{sc:1.1});place('robin','gmo_robin',spot('bee',3,1),{sc:1.4});place('lady','gmo_stonelady',spot('gallery',0,1),{block:true});place('knight','gmo_stoneknight',spot('wist',0,0),{block:true});place('saint','gmo_prompter',spot('theatre',2,2),{block:true});
    const far=(room,k,min)=>{const q=Q[room];return D2.filter(([x,y])=>Math.hypot(x-q.cx,y-q.cy)>min&&!occ.has(x+','+y))[k]};
    const ducks=['gmo_duckling1','gmo_duckling2','gmo_duckling3'],used2=new Set();
    ['pond'].forEach(()=>{let k=0;for(const [x,y] of D2){if(k>=3)break;const q=Q.pond;if(Math.hypot(x-q.cx,y-q.cy)<22||occ.has(x+','+y)||[...used2].some(u=>Math.hypot(u[0]-x,u[1]-y)<24))continue;const d=dec('duck',x,y,{npc:ducks[k],sc:.7});if(d){used2.add([x,y]);k++}}});
    {const q=Q.bee;const t=D2.find(([x,y])=>Math.hypot(x-q.cx,y-q.cy)>14&&Math.hypot(x-q.cx,y-q.cy)<40&&!occ.has(x+','+y));if(t)dec('bee',t[0],t[1],{npc:'gmo_queen',sc:2.4})}
    {const q=Q.theatre;let k=0;for(const [x,y] of D2){if(k>=3)break;if(occ.has(x+','+y)||Math.hypot(x-q.cx,y-q.cy)<14||[...used2].some(u=>Math.hypot(u[0]-x,u[1]-y)<16))continue;items.push({k:'gmpage',x,y});used2.add([x,y]);k++}}}
  // ---- the hedges: wall characters, floors ----
  for(let y=0;y<H;y++){let r='',f='';for(let x=0;x<W;x++){const c=g[y][x];r+=(c==='.')?'.':wallChar(x,y);f+=String(fl[y*W+x])}rows.push(r);fm.push(f)}
  // ---- the two gates ----
  {const gx=45,gy=0;const gid=chars[rows[gy][gx]];KH_DOOR[gid]={get lvl(){return WK.WENLOCK},get at(){return WK.WSTART||{x:2,y:2,f:0}}};
   const sg=chars[rows[H-1][gx]];KH_DOOR[sg]={get lvl(){return 475},get at(){const L=LEVELS[475];return L?{x:L.start.x,y:L.start.y,f:L.start.f||0}:{x:1,y:1,f:0}}}}
  // ---- checks: every open square is reachable, nothing that stands in the way cuts the garden in two ----
  {const blockSet=()=>{const s=new Set();for(const d of decor)if(d.block)s.add(d.x+','+d.y);for(const e of enemies)s.add(e.x+','+e.y);return s};
   const flood=(bs)=>{const seen=new Uint8Array(W*H),q=[m.start.y*W+m.start.x];seen[q[0]]=1;for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(!isOpen(nx,ny)||seen[ny*W+nx]||bs.has(nx+','+ny))continue;seen[ny*W+nx]=1;q.push(ny*W+nx)}}return seen};
   // squares that must stay reachable: doors, the start, the exit, the chests
   const must=[...m.doors.map(d=>[d.x,d.y]),...m.sdoors.map(d=>[d.x,d.y]),[45,1],[45,87]];for(const d of decor)if(d.k==='chest')must.push([d.x,d.y+1],[d.x,d.y-1],[d.x+1,d.y],[d.x-1,d.y]);
   let removed=0;for(let pass=0;pass<4;pass++){const bs=blockSet(),seen=flood(bs);
     // an open square that is walled in by decor
     let cut=0;for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(isOpen(x,y)&&!seen[y*W+x]&&!bs.has(x+','+y))cut++;
     if(!cut)break;
     // take away blocking decor that touches a cut-off square, nearest first
     const kill=new Set();for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(isOpen(x,y)&&!seen[y*W+x]&&!bs.has(x+','+y)){for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=(x+a)+','+(y+b);if(bs.has(k))kill.add(k)}}
     for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(d.block&&kill.has(d.x+','+d.y)&&d.k!=='chest'){decor.splice(i,1);removed++}}
     for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];if(kill.has(e.x+','+e.y)){enemies.splice(i,1);removed++}}}
   m.removedBlockers=removed}
  // ---- the level ----
  const sx=45,sy=87;
  const mapNames=[{t:'The Welcome Court',x:45,y:84,k:'place'},{t:'The Fountain Court',x:45,y:71,k:'place'},{t:'The Orchard Close',x:76,y:78,k:'place'},{t:'The Knot Garden',x:13,y:79,k:'place'},{t:'The Rose Garden',x:13,y:58,k:'place'},
    {t:'The Little Labyrinth',x:45,y:59,k:'place'},{t:'The Herb Garden',x:74,y:57,k:'place'},{t:'The Kitchen Garden',x:62,y:57,k:'place'},{t:'The Statue Gallery',x:13,y:40,k:'place'},{t:'The Lily Pond Court',x:45,y:41,k:'place'},{t:'The Gazebo Lawn',x:74,y:41,k:'place'},
    {t:'The Bee Garden',x:12,y:23,k:'place'},{t:'The Sundial Lawn',x:26,y:21,k:'place'},{t:'The Hedge Theatre',x:43,y:21,k:'place'},{t:'The Ruined Folly',x:74,y:24,k:'place'},{t:'The Wisteria Walk',x:10,y:7,k:'place'},{t:'The Topiary Zoo',x:77,y:7,k:'place'},{t:'The Wardens Court',x:45,y:7,k:'place'}];
  const lv={rows,chars,fmap:fm,floorSet:GM_FLOORSET,floor:GM_FLOORSET[3],ceil:'cloud',start:{x:sx,y:sy,f:0},enemies,items,decor,lights,portals:[],day:.98,outdoor:true,amb:.92,
    name:'The Maze of Gardens',label:'The Maze of Gardens',noExtras:true,diff:80,ceilH:4.5,noTele:true,mapNames,
    _gm:{fly:FLY,seed:m.seed,pathLen:m.pathLen,open:m.open,Q,doors:m.doors,sdoors:m.sdoors,walkers,plaques:pc,deadEnds:dead.length,removedBlockers:m.removedBlockers,decor:decor.length,enemies:enemies.length}};
  LEVELS[GM.ID]=lv;LEVEL_NAMES[GM.ID]='The Maze of Gardens';LEVEL_RATING[GM.ID]=80;
  // flat ground under a real sky (as in Oldhaven)
  {const NN=W*H,hh=new Float32Array(NN).fill(.3),rk=new Float32Array(NN),block=new Uint8Array(NN);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rows[y][x]!=='.')block[y*W+x]=1;TERRS[GM.ID]=yarTerrain(W,H,hh,rk,block)}
  WK.GSTART={x:sx,y:sy,f:0};WK.GBACK={x:45,y:3,f:2};
  return lv}
KH_LAZY[GM.ID]=gmBuild;LEVEL_NAMES[GM.ID]='The Maze of Gardens';LEVEL_RATING[GM.ID]=80;

/* ---- the guardians wake when the party comes near; things that wander; the chests; the way in and out ---- */
{const _ea=enemyAct;enemyAct=function(e){
  try{const d=ENEMY_DEF[e.t];if(d&&d.gm&&!e.alert){const dist=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);
    if(dist<=(e.t==='gmwarden'?5:3)){e.alert=true;try{msg(d.wake,'#e8d8a0');sfx('rattle')}catch(x){}return 200}
    if(dist<=5&&!e.warned){e.warned=true;try{msg('Something stirs among the '+(e.t==='gmbriar'||e.t==='gmtrap'?'plants.':'stones.'),'#c8c0a0')}catch(x){}}
    return 0}}catch(x){console.error(x)}
  return _ea.apply(this,arguments)}}
{const _u=update;let dec=null,map=null,blk=null;update=function(dt){
  try{if(LEVEL===GM.ID&&G.state==='play'&&G.decor){const L=LEVELS[GM.ID];if(L&&L._gm){
    if(dec!==G.decor){dec=G.decor;map=new Map();blk=new Set(G.decor.filter(q=>q.block).map(q=>q.x+','+q.y));for(const e of G.enemies)blk.add(e.x+','+e.y)}
    const open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&!blk.has(x+','+y)&&!(x===G.P.x&&y===G.P.y);
    for(const a of L._gm.walkers){let d=map.get(a.id);if(!d){d=G.decor.find(q=>q.cloudid===a.id);if(!d)continue;map.set(a.id,d)}
      if(!a.tgt){a.wait-=dt;if(a.wait>0)continue;
        const opts=[[1,0],[-1,0],[0,1],[0,-1]].map(([x,y])=>[a.cell[0]+x,a.cell[1]+y]).filter(([x,y])=>open(x,y)&&Math.hypot(x-a.home[0],y-a.home[1])<=a.r);
        if(!opts.length){a.wait=2;continue}
        let pick=null;if(a.prev){const sx=a.cell[0]+a.prev[0],sy=a.cell[1]+a.prev[1];if(opts.some(o=>o[0]===sx&&o[1]===sy)&&Math.random()<.6)pick=[sx,sy]}
        if(!pick)pick=opts[(Math.random()*opts.length)|0];a.prev=[pick[0]-a.cell[0],pick[1]-a.cell[1]];a.tgt=pick;a.f=0;a.wait=0}
      a.f+=dt*a.sp;if(a.f>=1){a.cell=a.tgt;a.tgt=null;a.f=0;a.wait=1+Math.random()*3;d.x=a.cell[0];d.y=a.cell[1];d.ox=0;d.oy=0;continue}
      d.x=a.cell[0];d.y=a.cell[1];d.ox=(a.tgt[0]-a.cell[0])*a.f;d.oy=(a.tgt[1]-a.cell[1])*a.f}}}}catch(e){}
  return _u.apply(this,arguments)}}
/* the butterflies, bees and motes of light circle their squares */
{const _uf=update;let fdec=null,fl=[];update=function(dt){
  try{if(LEVEL===GM.ID&&G.state==='play'&&G.decor){const L=LEVELS[GM.ID];if(L&&L._gm&&L._gm.fly){
    if(fdec!==G.decor){fdec=G.decor;fl=[];const by=new Map();for(const q of G.decor)if(q.cloudid&&q.cloudid.startsWith('gmf'))by.set(q.cloudid,q);L._gm.fly.forEach((f,i)=>{const d=by.get('gmf'+i);if(d)fl.push([d,f])})}
    const t=G.time;for(const [d,f] of fl){const a=t*f.sp+f.ph;d.ox=Math.sin(a)*f.r+Math.sin(a*2.3)*f.r*.3;d.oy=Math.cos(a*.8+f.ph)*f.r;d.bob=f.b+Math.sin(a*3)*.08}}}}catch(e){}
  return _uf.apply(this,arguments)}}
{const _lf=lootFor;lootFor=function(d){
  if(LEVEL===GM.ID&&d&&d.k==='chest'){
    const r=k=>hash2(d.x,d.y,300+k),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
    for(let q=0;q<3;q++)add(potionFor(r(40+q)),1);add('supermana',2);add('elixir',1);
    for(let q=0;q<2;q++){const a=typeof armourDrop==='function'?armourDrop(r(60+q)):null;if(a)add(a)}
    if(typeof ringFor==='function')add(ringFor(r(9),80));
    d.gold=d.goldAmt||3000;return items}
  return _lf.apply(this,arguments)}}

/* ---- the Go to area list (?town=gardens&lvl=80 is in the AREAS table of jumpFromUrl) ---- */
{const _gl=gotoListRaw;gotoListRaw=function(){const out=_gl.apply(this,arguments);
  try{if(!out.some(r=>r.n===GM.ID)){out.push({h:'The Maze of Gardens, the way to Wenlock'});out.push({n:GM.ID,name:'The Maze of Gardens'})}}catch(e){console.error(e)}
  return out}}
