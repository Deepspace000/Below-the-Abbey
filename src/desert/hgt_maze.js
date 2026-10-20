/* hgt_maze.js  (prefix hgtz)  MAZES for the terraced towns of the Hollow Grasslands. Builders on the library builder B (hgtlNew, see hgt_lib.js).
   Deterministic from a seed. Every open cell is reachable by the step rule (hgtlValidate), every maze has a reward at its centre,
   there is always a route out (all passages are two-way and steps are at most 0.3 high).

   MAIN CALL
     const m = hgtzMaze(B, x, y, w, h, opts);      // builds a maze inside the rectangle x,y,w,h of the builder
       returns { entry:{x,y}       the opened border cell where the party walks in (a wall cell turned into a doorway)
                 approach:{x,y}    the cell just outside the entry (the caller connects its own path to this cell; it is at the street height opts.base)
                 centre:{x,y}      the reward cell (chest, lamp, shrine, creature or the foot of the lookout stair)
                 top:{x,y,h}       only for reward 'view': the lookout platform at the top of the spiral stair
                 secret:{x,y}|null the hidden passage cell (an open cell hung with a walk-through light-vine) of the second route
                 cells:[[x,y],..]  every open cell of the maze (stairs included)
                 rect:{x,y,w,h}, algo, kind, reward, lamps:[[x,y],..], deadEnds:[[x,y],..], floorH, wallH }
     Footprint: the rectangle is used whole (odd sizes waste nothing; leftover cells become border wall). w,h should be at least 15 (small
     secret mazes 9 by 9 work with kind 'hedge'/'tall' and reward 'chest'). Everything is built on B.rows/B.h/B.kind/B.decor/B.lights.

   opts (all optional)
     algo     'backtracker' (long winding corridors) | 'prim' (many short branches) | 'kruskal' | 'wilson' (unbiased) | 'braid' (loops, no dead ends mostly)
              | 'spiral' (a spiral with side branches) | 'circular' (concentric rings with few gaps) | 'labyrinth' (ONE path, classical: concentric circuits
              walked in turn, all turnings on one spoke) | 'chartres' (ONE path, four quarters of zigzag lunations round a centre) | 'dungeon' (rooms, doors,
              false rooms, corridors). Default 'backtracker'.
     kind     'hedge' (height 1.6, green painted tints, lawn floor) | 'tall' (wall height wallH 3 to 6, default 4.5) | 'tube' (covered cells, wall height 2.4,
              B.tube lists the covered cells; hgtzApplyLids(B,lv) fills terrace.lid for the engine tubes) | 'sunken' (floor opts.depth below the street, default 2.4,
              steps down on the entry side, walls rise to the street) | 'raised' (floor opts.raise above the street, default 2.6, steps up, pedestal ring of pillars)
              | 'tri' (three levels of 2.6 rise, joined by stair blocks and a long ramp bridge along the north edge; w >= 70) | 'shell' (round, ring walls in
              alternating tints, lit seams at the gaps, use algo 'circular' or leave it) | 'indoor' (walls 2.6, rooms; use with hgtzIndoorLevel).
     side     side of the entry: 'S' (default), 'W', 'N', 'E'.     base  street height outside (default hgtlH(B,x,y)).    seed  number.
     reward   'chest' (loot chest of the city) | 'creature' (a neutral creature nook, plain line when examined) | 'lamp' | 'shrine' (obelisk and lamps)
              | 'view' (a spiral stair up to a lookout above the walls, a lamp on top). Default chosen from the seed.
     secret   true: a second route behind a light-vine into the reward chamber (default random).        braid  0..1 dead end removal for any algo (default 0).
     lampEvery  distance (cells along the path) between lamps (default 7; tube 4).   lamps  false for no lamps.
     palette  array of tints 'p' 'a' 'c' 'l' (pink aqua cream lilac) for the walls; default 3 picked from the seed. Hedges ignore it.
     tile     callback (role, wh, info) -> a map char, a tile gid (number) or undefined. role is one of 'wall' 'post' 'border' 'rail' 'lit' 'chamber' 'pillar';
              wh is the wall height wanted; info {wx,wy,lx,ly,band,kind}. Return undefined for the default painted pick. City agents pass the art
              agent's detailed wall textures through this callback. Chars you return must be present in the level chars you assemble.
     floor    fmap digit for the maze floor (B.fm is a Uint8Array filled when used; default hedge 4, others 5).     rooms (dungeon) number of rooms.
     creature decor key of the creature in a creature nook (default 'hg_frog1').     chestKey decor key of the chest.

   OTHER CALLS
     hgtzIndoorLevel(id, opts)  a flat interior level (multi-room indoor maze with doors and false rooms) with the door back to opts.back {lvl,at:{x,y,f}}; returns a level
                                object for hgtRegister.
     hgtzApplyLids(B, lv, h)    sets lv.terrace.lid (Float32Array, ceiling height above the floor per covered cell, 0 elsewhere) from B.tube; harmless before the engine reads it.
     hgtzDeadEnds(B, cells)     list of dead end cells.   hgtzSolve(B, from, to) path length or -1 (step rule).
     hgtzTestLevel()            the level 486 (registered below). Link ?town=hgtmaze&lvl=34.
   Colour and tiles: palette picks vary by block of 6 by 6 cells so you know where you are; lamps stand at intervals, and also at junctions near the reward.
   Secret doors: no teleports and no engine hook. A secret route is an open cell hung with a walk-through banner or light-vine (decor walk:true deco:true),
   listed in B.secrets. */

const HGTZ={K:{lamp:'hgt_lamppost',vine:'hgt_lightvine',obelisk:'hgt_obelisk',chest:['hg_chestjelly','hg_chestwax','hg_chestweed'],creature:'hg_frog1',
  plants:['hgt_fern','hgt_shrub','hgt_mushrooms','hgt_crystalgrass','hgt_bulbflower'],falseRoom:['hg_lectern','hg_jar','hg_eggs']},
  TN:{p:{p:'hgt_wp',w:'hgt_ww0',b:'hgt_wb0'},a:{p:'hgt_wa',w:'hgt_ww1',b:'hgt_wb1'},c:{p:'hgt_wc',w:'hgt_ww3',b:'hgt_wb2'},l:{p:'hgt_wl',w:'hgt_ww2',b:'hgt_wb3'}},
  STEP:.26};

/* ---------- random numbers and lattice ---------- */
function hgtzRng(seed){let s=(seed|0)^0x9e3779b9;return function(){s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
function hgtzLat(cw,ch){const n=cw*ch;return {cw,ch,n,act:new Uint8Array(n).fill(1),adj:Array.from({length:n},()=>new Set()),room:new Int16Array(n).fill(-1),rooms:[],doors:[]}}
function hgtzNb(L,a){const i=a%L.cw,j=(a/L.cw)|0,o=[];if(j>0)o.push(a-L.cw);if(i<L.cw-1)o.push(a+1);if(j<L.ch-1)o.push(a+L.cw);if(i>0)o.push(a-1);return o.filter(b=>L.act[b])}
function hgtzLink(L,a,b){L.adj[a].add(b);L.adj[b].add(a)}
function hgtzActive(L){const o=[];for(let a=0;a<L.n;a++)if(L.act[a])o.push(a);return o}
function hgtzShuffle(R,a){for(let i=a.length-1;i>0;i--){const j=(R()*(i+1))|0;const t=a[i];a[i]=a[j];a[j]=t}return a}

/* ---------- spanning tree algorithms (on the active nodes) ---------- */
function hgtzBacktrack(L,R,start){const seen=new Uint8Array(L.n),st=[start];seen[start]=1;
  for(let a=0;a<L.n;a++)if(L.adj[a].size)seen[a]=seen[a];
  while(st.length){const a=st[st.length-1],c=hgtzNb(L,a).filter(b=>!seen[b]);if(!c.length){st.pop();continue}const b=c[(R()*c.length)|0];hgtzLink(L,a,b);seen[b]=1;st.push(b)}}
function hgtzPrim(L,R,start){const inT=new Uint8Array(L.n),fr=[];inT[start]=1;const add=a=>{for(const b of hgtzNb(L,a))if(!inT[b])fr.push([a,b])};add(start);
  while(fr.length){const k=(R()*fr.length)|0,e=fr[k];fr[k]=fr[fr.length-1];fr.pop();if(inT[e[1]])continue;inT[e[1]]=1;hgtzLink(L,e[0],e[1]);add(e[1])}}
function hgtzKruskal(L,R,wfn){const p=new Int32Array(L.n);for(let i=0;i<L.n;i++)p[i]=i;const f=a=>{while(p[a]!==a){p[a]=p[p[a]];a=p[a]}return a};
  for(let a=0;a<L.n;a++)for(const b of L.adj[a])p[f(a)]=f(b);
  const E=[];for(let a=0;a<L.n;a++)if(L.act[a])for(const b of hgtzNb(L,a))if(b>a)E.push([(wfn?wfn(a,b):0)+R(),a,b]);
  E.sort((u,v)=>u[0]-v[0]);
  for(const e of E){const ra=f(e[1]),rb=f(e[2]);if(ra!==rb){p[ra]=rb;hgtzLink(L,e[1],e[2])}}}
function hgtzWilson(L,R,start){const list=hgtzShuffle(R,hgtzActive(L)),inT=new Uint8Array(L.n);inT[start]=1;
  for(const s of list){if(inT[s])continue;const nxt=new Map();let a=s;while(!inT[a]){const c=hgtzNb(L,a),b=c[(R()*c.length)|0];nxt.set(a,b);a=b}
    a=s;while(!inT[a]){const b=nxt.get(a);hgtzLink(L,a,b);inT[a]=1;a=b}}}
function hgtzBraid(L,R,p){for(let a=0;a<L.n;a++){if(!L.act[a]||L.adj[a].size!==1||R()>=p)continue;const c=hgtzNb(L,a).filter(b=>!L.adj[a].has(b));if(!c.length)continue;const de=c.filter(b=>L.adj[b].size===1),pool=de.length?de:c;hgtzLink(L,a,pool[(R()*pool.length)|0])}}
/* spiral order over the whole lattice (masked nodes are skipped by the caller) */
function hgtzSpiralOrder(cw,ch){const vis=new Uint8Array(cw*ch),out=[],D=[[1,0],[0,1],[-1,0],[0,-1]];let x=0,y=0,d=0;
  for(let k=0;k<cw*ch;k++){out.push(y*cw+x);vis[y*cw+x]=1;let nx=x+D[d][0],ny=y+D[d][1];if(nx<0||ny<0||nx>=cw||ny>=ch||vis[ny*cw+nx]){d=(d+1)&3;nx=x+D[d][0];ny=y+D[d][1]}x=nx;y=ny}
  return out}

/* ---------- the single path labyrinths ---------- */
/* classical: rings round the chamber, every turn on one spoke (south middle). returns the node path or null. */
function hgtzRingPath(L,ch0){ // ch0 {i0,j0,c} chamber node box; rings are Chebyshev rings of nodes round it
  const K=Math.min(ch0.i0,ch0.j0,L.cw-ch0.i0-ch0.c,L.ch-ch0.j0-ch0.c);if(K<2)return null;
  const col=ch0.i0+((ch0.c-1)>>1),rings=[];
  for(let k=0;k<K;k++){ // k=0 outermost
    const d=K-k,x0=ch0.i0-d,x1=ch0.i0+ch0.c-1+d,y0=ch0.j0-d,y1=ch0.j0+ch0.c-1+d,cyc=[];
    for(let x=col;x>=x0;x--)cyc.push([x,y1]);for(let y=y1-1;y>=y0;y--)cyc.push([x0,y]);for(let x=x0+1;x<=x1;x++)cyc.push([x,y0]);for(let y=y0+1;y<=y1;y++)cyc.push([x1,y]);for(let x=x1-1;x>col;x--)cyc.push([x,y1]);
    rings.push(cyc.map(q=>q[1]*L.cw+q[0]))}
  const path=[];rings.forEach((r,k)=>{const seq=k%2===0?r:r.slice().reverse();for(const n of seq)path.push(n)});
  return path}
/* quarters: pinwheel of four rectangles round a centre chamber, each walked in radial zigzag lines. window origin (wx,wy), size N, chamber c, k even. */
function hgtzPinwheel(L,wx,wy,N,c,k){
  const n=k+c,P=(x,y)=>(wy+y)*L.cw+(wx+x);
  // each rect: lines (outer->inner) in tangential order
  const lines=(r)=>{const out=[];
    if(r===0)for(let x=0;x<n;x++){const l=[];for(let y=0;y<k;y++)l.push(P(x,y));out.push(l)}                       // top: lines are columns, outer y=0
    if(r===1)for(let y=0;y<n;y++){const l=[];for(let x=N-1;x>=k+c;x--)l.push(P(x,y));out.push(l)}               // right: rows, outer x=N-1
    if(r===2)for(let x=N-1;x>=k;x--){const l=[];for(let y=N-1;y>=k+c;y--)l.push(P(x,y));out.push(l)}            // bottom: columns, outer y=N-1
    if(r===3)for(let y=N-1;y>=k;y--){const l=[];for(let x=0;x<k;x++)l.push(P(x,y));out.push(l)}                 // left: rows, outer x=0
    return out};
  const order=[2,3,0,1],path=[];
  order.forEach((r,idx)=>{let ls=lines(r);if(idx===0)ls=ls.slice(1);if(idx===3)ls=ls.slice(0,ls.length-1);
    ls.forEach((l,t)=>{let seq=l;
      if(idx===0)seq=t%2===0?l:l.slice().reverse();          // starts outer end
      else seq=t%2===0?l.slice().reverse():l;               // starts inner end
      for(const q of seq)path.push(q)})});
  for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i];if(Math.abs((a%L.cw)-(b%L.cw))+Math.abs(((a/L.cw)|0)-((b/L.cw)|0))!==1)return null}
  return path}

/* ---------- own spiral stair cells for lookouts ---------- */
function hgtzSpiralCells(S){const vis=new Set(),K=(x,y)=>x+','+y,ins=(x,y)=>x>=0&&y>=0&&x<S&&y<S,D=[[1,0],[0,1],[-1,0],[0,-1]];let x=0,y=0,d=0;const out=[[0,0]];vis.add(K(0,0));
  const ok=(nx,ny)=>{if(!ins(nx,ny)||vis.has(K(nx,ny)))return false;for(const dd of D){const ax=nx+dd[0],ay=ny+dd[1];if(ax===x&&ay===y)continue;if(vis.has(K(ax,ay)))return false}return true};
  for(let g=0;g<S*S;g++){let moved=false;for(let t=0;t<2&&!moved;t++){const dd=(d+t)&3,nx=x+D[dd][0],ny=y+D[dd][1];if(ok(nx,ny)){d=dd;x=nx;y=ny;vis.add(K(x,y));out.push([x,y]);moved=true}}if(!moved)break}
  return out}

/* ---------- wall tiles (painted pictures of the art set, hedges tinted green) ---------- */
const hgtzTileCache={};
function hgtzReal(){return typeof hgtaWallTile==='function'&&typeof hgtaPic==='function'&&!!hgtaPic('hgt_wp')}
function hgtzTinted(src,wh,mul,key){ // a tinted copy of a stacked painted wall (green hedge); the leaf clumps are a brightness variation of the painting, tileable sideways
  const k='t|'+src+'|'+wh+'|'+key;if(hgtzTileCache[k]!==undefined)return hgtzTileCache[k];
  if(typeof hgtwHedgeTile==='function'){const hg=hgtwHedgeTile(wh,mul,k);if(hg!==undefined)return hgtzTileCache[k]=hg} // leafy painted-vine hedge (hgt_walls.js)
  const {c,Hp}=hgtaStack(src,wh),x=c.getContext('2d'),im=x.getImageData(0,0,128,Hp),d=im.data;let sd=1234+(key.length*77)+((mul[0]*100)|0);
  const g=(i,j,sc)=>hgtzHash(i,j,sd+sc);
  const vn=(px,py,cell,sc)=>{const fx=px/cell,fy=py/cell,i=Math.floor(fx),j=Math.floor(fy),tx=fx-i,ty=fy-j,n=Math.round(128/cell),w=a=>((a%n)+n)%n;
    const sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty),a0=g(w(i),j,sc),a1=g(w(i+1),j,sc),b0=g(w(i),j+1,sc),b1=g(w(i+1),j+1,sc);return (a0+(a1-a0)*sx)*(1-sy)+(b0+(b1-b0)*sx)*sy};
  for(let py=0;py<Hp;py++)for(let px=0;px<128;px++){const o=(py*128+px)*4,n=vn(px,py,16,1)*.5+vn(px,py,8,2)*.3+vn(px,py,4,3)*.2,v=.45+1.1*n,
    lum=(d[o]+d[o+1]+d[o+2])/3;const base=90+lum*.25; // the pale picture only carries the shading; the colour is the tint
    d[o]=Math.min(255,base*mul[0]*v*1.25);d[o+1]=Math.min(255,base*mul[1]*v*1.25);d[o+2]=Math.min(255,base*mul[2]*v*1.25)}
  const id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;const gid=KH_NEXT_GID++;T_TILE[gid]=id;return hgtzTileCache[k]=gid}
const HGTZ_GREENS=[['hgt_wa',[.45,.95,.4]],['hgt_wc',[.8,1,.35]],['hgt_wl',[.3,.8,.55]]];
function hgtzPlaceholder(role,wh,band,o){if(o.kind==='hedge'||role==='hedge')return HGTL_CHARS.hedge;
  const t='abcd'[((band%4)+4)%4];if(role==='lit')return HGTL_CHARS.window_mid;if(role==='border')return HGTL_CHARS['nacre_'+t+(wh<2.5?'_low':wh<4.5?'_mid':'')];
  return HGTL_CHARS['nacre_'+t+(wh<1?'_rail':wh<2.5?'_low':wh<4.5?'_mid':wh<8?'':'_cap')]}
function hgtzHash(a,b,s){let h=Math.imul(a|0,374761393)+Math.imul(b|0,668265263)+Math.imul(s|0,1274126177);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function hgtzDefaultTile(o,role,wh,info){
  wh=Math.max(.5,Math.round(wh*20)/20);
  if(!hgtzReal())return hgtzPlaceholder(role,wh,info.band,o);
  const pal=o._pal,band=info.band,n=pal.length;let gid;
  if(o.kind==='hedge'){
    const g=HGTZ_GREENS[(role==='post'||role==='border'?2:((band%2)+2)%2)%HGTZ_GREENS.length],mul=g[1].map(v=>role==='border'?v*.8:v);
    gid=hgtzTinted(g[0],wh,mul,role+((band%2)+2)%2)}
  else{const T=HGTZ.TN[pal[((band%n)+n)%n]],T2=HGTZ.TN[pal[(((band+1)%n)+n)%n]];
    if(role==='lit')gid=hgtaWallTile('hgt_wb3',wh);
    else if(role==='chamber')gid=hgtaWallTile('hgt_wb2',wh,{top:'hgt_wb3'});
    else if(role==='pillar')gid=hgtaWallTile(T2.p,wh,{base:T2.b,top:T2.b});
    else if(role==='rail')gid=hgtaWallTile(T.p,wh);
    else if(role==='border')gid=wh>=2.5?hgtaWallTile(T2.p,wh,{base:T2.b,mid:T2.p,top:T2.b}):hgtaWallTile(T2.p,wh);
    else if(role==='post')gid=hgtaWallTile(T2.p,wh,wh>=2.5?{top:T2.b}:{});
    else{const win=wh>=2.5&&hgtzHash(info.wx,info.wy,o.seed)<.2;gid=wh>=2.5?hgtaWallTile(T.p,wh,{mid:win?T.w:T.p,top:T.b}):hgtaWallTile(T.p,wh)}}
  return hgtaChar(gid)}

/* ---------- the builder ---------- */
const HGTZ_KIND={hedge:{wallH:1.6,floor:4,lampEvery:9},tall:{wallH:4.5,floor:5,lampEvery:7},tube:{wallH:2.4,floor:5,lampEvery:4,tube:true},sunken:{wallH:2.4,floor:5,lampEvery:7,depth:2.4},
  raised:{wallH:2.2,floor:5,lampEvery:7,raise:2.6},tri:{wallH:2.4,floor:5,lampEvery:7},shell:{wallH:4.4,floor:5,lampEvery:6,algo:'circular',round:true},indoor:{wallH:2.6,floor:5,lampEvery:6}};
function hgtzCtx(B,x,y,w,h,o){
  const rot={S:0,W:1,N:2,E:3}[o.side||'S']||0,lw0=rot&1?h:w,lh0=rot&1?w:h;
  const C={B,x,y,w,h,o,rot,lw0,lh0,cells:[],R:o.R,band:null,lamps:[],tubes:[]};
  C.T=(lx,ly)=>{switch(rot){case 0:return [x+lx,y+ly];case 1:return [x+lh0-1-ly,y+lx];case 2:return [x+lw0-1-lx,y+lh0-1-ly];default:return [x+ly,y+lw0-1-lx]}};
  C.ch=(role,wh,lx,ly)=>{const [wx,wy]=C.T(lx,ly),band=C.band?C.band(lx,ly):(Math.floor(lx/6)+Math.floor(ly/6)),info={wx,wy,lx,ly,band,kind:o.kind};
    if(o.tile){const r=o.tile(role,wh,info);if(r!==undefined&&r!==null)return typeof r==='number'?hgtaChar(r):r}
    return hgtzDefaultTile(o,role,wh,info)};
  C.wall=(lx,ly,role,wh,foot)=>{const [wx,wy]=C.T(lx,ly);if(!hgtlIn(B,wx,wy))return;hgtlWall(B,wx,wy,C.ch(role,wh,lx,ly),foot)};
  C.open=(lx,ly,hh,kind,fd)=>{const [wx,wy]=C.T(lx,ly);if(!hgtlIn(B,wx,wy))return;hgtlOpen(B,wx,wy,hh,kind===undefined?HGTL.K.ALLEY:kind);
    if(fd!==undefined){if(!B.fm)B.fm=new Uint8Array(B.W*B.H);B.fm[wy*B.W+wx]=fd}C.cells.push([wx,wy]);if(o.tube)C.tubes.push([wx,wy])};
  C.dec=(k,lx,ly,od)=>{const [wx,wy]=C.T(lx,ly);hgtlDecor(B,k,wx,wy,od);if(od&&od.block&&!od.walk)B.occ.add(wx+','+wy);return [wx,wy]};
  return C}

/* fill a zone rectangle with walls: border ring, posts and wall cells */
function hgtzFillZone(C,Z){for(let j=0;j<Z.lh;j++)for(let i=0;i<Z.lw;i++){const lx=Z.ox+i,ly=Z.oy+j,edge=i===0||j===0||i===Z.lw-1||j===Z.lh-1;
  if(edge)C.wall(lx,ly,'border',Z.bwh,Z.bfoot);else C.wall(lx,ly,(i&1)===0&&(j&1)===0?'post':'wall',Z.wh,Z.fl)}}
const hgtzNX=(Z,i)=>Z.ox+1+2*i, hgtzNY=(Z,j)=>Z.oy+1+2*j;

/* make the lattice of a zone: masks, algorithm; returns Z.L */
function hgtzLattice(C,Z){
  const o=C.o,R=C.R,L=hgtzLat(Z.cw,Z.ch);Z.L=L;
  const algo=Z.algo,ci=(Z.cw-1)/2,cj=(Z.ch-1)/2;
  // strip nodes (stairs row)
  if(Z.strip)for(let i=0;i<Z.strip.m;i++)L.act[(Z.ch-1)*Z.cw+i]=0;
  // round mask
  if(Z.round){const rad=Math.min(Z.cw,Z.ch)/2+.35;for(let j=0;j<Z.ch;j++)for(let i=0;i<Z.cw;i++)if(Math.hypot(i-ci,j-cj)>rad)L.act[j*Z.cw+i]=0}
  // single path labyrinths: a window of nodes anchored to the south, with a centre chamber
  const cc=Z.cs; // chamber nodes per side
  const win=(algo==='labyrinth'||algo==='chartres');
  let i0=Math.floor((Z.cw-cc)/2),j0=Math.floor((Z.ch-cc)/2);
  if(Z.strip)j0=Math.min(j0,Z.ch-cc-2);
  Z.chamber=cc>0?{i0,j0,c:cc}:null;
  if(win){
    const mn=Math.min(Z.cw,Z.ch);let path=null;
    if(algo==='chartres'){let N=mn%2?mn:mn-1,k=Math.floor((N-3)/2);if(k%2)k--;
      if(k>=2){const c=N-2*k;N=2*k+c;const wx=Math.floor((Z.cw-N)/2),wy=Z.ch-N;
        L.act.fill(0);for(let y=0;y<N;y++)for(let x=0;x<N;x++)L.act[(wy+y)*Z.cw+wx+x]=1;
        Z.chamber={i0:wx+k,j0:wy+k,c};for(let y=0;y<c;y++)for(let x=0;x<c;x++)L.act[(wy+k+y)*Z.cw+wx+k+x]=0;
        path=hgtzPinwheel(L,wx,wy,N,c,k);Z.win={wx,wy,N,k,c}}}
    else{const c=3,K=Math.floor((mn-c)/2);
      if(K>=2){const N=c+2*K,wx=Math.floor((Z.cw-N)/2),wy=Z.ch-N;
        L.act.fill(0);for(let y=0;y<N;y++)for(let x=0;x<N;x++)L.act[(wy+y)*Z.cw+wx+x]=1;
        Z.chamber={i0:wx+K,j0:wy+K,c};for(let y=0;y<c;y++)for(let x=0;x<c;x++)L.act[(wy+K+y)*Z.cw+wx+K+x]=0;
        path=hgtzRingPath(L,Z.chamber);Z.win={wx,wy,N,K,c}}}
    if(!path){Object.assign(Z,{algo:'backtracker',cs:2,chamber:null,win:null});return hgtzLattice(C,Z)}
    for(let t=1;t<path.length;t++)hgtzLink(L,path[t-1],path[t]);
    Z.entryNode=path[0];Z.endNode=path[path.length-1];
    const used=new Set(path);for(let a=0;a<L.n;a++)if(L.act[a]&&!used.has(a))L.act[a]=0;
    if(algo==='labyrinth')C.band=(lx,ly)=>{const i=Math.floor((lx-Z.ox-1)/2),j=Math.floor((ly-Z.oy-1)/2),q=Z.chamber,d=Math.max(q.i0-i,i-(q.i0+q.c-1),q.j0-j,j-(q.j0+q.c-1));return Math.max(0,d)};
    else C.band=(lx,ly)=>{const i=Math.floor((lx-Z.ox-1)/2),j=Math.floor((ly-Z.oy-1)/2),w=Z.win;return (i<w.wx+w.k&&j>=w.wy+w.k?0:i>=w.wx+w.k&&j>=w.wy+w.k+w.c?1:i>=w.wx+w.k+w.c&&j<w.wy+w.k+w.c?2:3)};
    return Z}
  // chamber for tree algorithms
  if(cc>0){for(let y=0;y<cc;y++)for(let x=0;x<cc;x++)L.act[(j0+y)*Z.cw+i0+x]=0}
  // entry node
  let en;
  if(Z.strip)en=(Z.ch-1)*Z.cw+Z.strip.m;
  else{ // bottom-most active node near the chosen column
    const c0=Math.max(0,Math.min(Z.cw-1,Z.entryCol!==undefined?Z.entryCol:Math.floor(R()*Z.cw)));en=-1;
    for(let j=Z.ch-1;j>=0&&en<0;j--)for(let d=0;d<Z.cw&&en<0;d++)for(const s of [c0+d,c0-d]){if(s>=0&&s<Z.cw&&L.act[j*Z.cw+s]){en=j*Z.cw+s;break}}}
  Z.entryNode=en;
  const wsp=(()=>{if(algo!=='spiral')return null;const ord=hgtzSpiralOrder(Z.cw,Z.ch).filter(a=>L.act[a]),pos=new Map();ord.forEach((a,t)=>pos.set(a,t));return (a,b)=>Math.abs(pos.get(a)-pos.get(b))===1?0:(o.spiralLoose||.8)})();
  const rg=(a,b)=>{const ra=Math.max(Math.abs(a%Z.cw-ci),Math.abs(((a/Z.cw)|0)-cj)),rb=Math.max(Math.abs(b%Z.cw-ci),Math.abs(((b/Z.cw)|0)-cj));return ra===rb?0:(o.ringLoose||.85)};
  if(algo==='circular'){C.band=(lx,ly)=>{const i=(lx-Z.ox-1)/2,j=(ly-Z.oy-1)/2;return Math.floor(Math.max(Math.abs(i-ci),Math.abs(j-cj))/1.4)}}
  if(algo==='dungeon')hgtzDungeon(C,Z,R);
  else if(algo==='prim')hgtzPrim(L,R,en);
  else if(algo==='kruskal')hgtzKruskal(L,R);
  else if(algo==='wilson')hgtzWilson(L,R,en);
  else if(algo==='spiral')hgtzKruskal(L,R,wsp);
  else if(algo==='circular')hgtzKruskal(L,R,rg);
  else hgtzBacktrack(L,R,en);
  if(o.braid>0||algo==='braid')hgtzBraid(L,R,o.braid>0?o.braid:.85);
  return Z}

/* dungeon: rooms of several nodes, joined to corridors by doors; leaf rooms are the false rooms */
function hgtzDungeon(C,Z,R){const L=Z.L,o=C.o,want=o.rooms||Math.max(5,Math.floor(Z.cw*Z.ch/16));let id=0;
  const free=(i,j,w,h)=>{for(let y=j-1;y<=j+h;y++)for(let x=i-1;x<=i+w;x++){if(x<0||y<0||x>=Z.cw||y>=Z.ch)continue;const a=y*Z.cw+x;if(L.room[a]>=0)return false;if((x>=i&&x<i+w&&y>=j&&y<j+h)&&!L.act[a])return false}return i>=0&&j>=0&&i+w<=Z.cw&&j+h<=Z.ch};
  for(let t=0;t<want*30&&id<want;t++){const w=2+((R()*3)|0),h=2+((R()*2)|0),i=(R()*(Z.cw-w+1))|0,j=(R()*(Z.ch-h+1))|0;
    if(Z.strip&&j+h>=Z.ch-1&&i<Z.strip.m+1)continue;if(Z.entryNode>=0&&(()=>{const ei=Z.entryNode%Z.cw,ej=(Z.entryNode/Z.cw)|0;return ei>=i-1&&ei<=i+w&&ej>=j-1&&ej<=j+h})())continue;
    if(!free(i,j,w,h))continue;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++)L.room[(j+y)*Z.cw+i+x]=id;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=(j+y)*Z.cw+i+x;if(x<w-1)hgtzLink(L,a,a+1);if(y<h-1)hgtzLink(L,a,a+Z.cw)}
    L.rooms.push({id,i,j,w,h});id++}
  hgtzKruskal(L,R);
  // doors: links between a room node and a node of another room or corridor
  for(let a=0;a<L.n;a++)for(const b of L.adj[a])if(b>a&&(L.room[a]!==L.room[b]))L.doors.push([a,b]);
  // a few loops
  if(!(o.algo==='dungeon'&&o.braid===0)){const extra=Math.floor(L.rooms.length/2);for(let t=0;t<extra*8&&L.doors.length<L.rooms.length*3;t++){const a=(R()*L.n)|0;if(!L.act[a])continue;const c=hgtzNb(L,a).filter(b=>!L.adj[a].has(b)&&(L.room[a]!==L.room[b]||L.room[a]<0&&false));if(!c.length)continue;const b=c[(R()*c.length)|0];if(L.room[a]<0&&L.room[b]<0&&R()<.7)continue;hgtzLink(L,a,b);L.doors.push([Math.min(a,b),Math.max(a,b)])}}}

/* carve the lattice into the grid */
function hgtzCarve(C,Z){const L=Z.L,o=C.o,fl=Z.fl,fd=o.floor;
  const nx=i=>hgtzNX(Z,i),ny=j=>hgtzNY(Z,j),nxy=ny;
  for(let a=0;a<L.n;a++){if(!L.act[a])continue;const i=a%Z.cw,j=(a/Z.cw)|0;C.open(nx(i),ny(j),fl,HGTL.K.ALLEY,fd)}
  for(let a=0;a<L.n;a++)for(const b of L.adj[a])if(b>a){const i=a%Z.cw,j=(a/Z.cw)|0,i2=b%Z.cw,j2=(b/Z.cw)|0;C.open(nx(i)+(i2-i),ny(j)+(j2-j),fl,HGTL.K.ALLEY,fd)}
  // rooms (dungeon): the whole block is floor, the posts inside are removed
  for(const r of L.rooms){for(let y=nxy(r.j);y<=nxy(r.j+r.h-1);y++)for(let x=nx(r.i);x<=nx(r.i+r.w-1);x++)C.open(x,y,fl,HGTL.K.ALLEY,fd)}
  // chamber box
  if(Z.chamber){const q=Z.chamber,S=2*q.c-1,x0=nx(q.i0),y0=ny(q.j0);Z.cbox={x0,y0,S};
    for(let y=0;y<S;y++)for(let x=0;x<S;x++)C.open(x0+x,y0+y,fl,HGTL.K.PLAZA,fd)}}

/* distances along open cells from a world cell, step rule */
function hgtzDist(B,sx,sy){const W=B.W,d=new Int32Array(B.W*B.H).fill(-1);if(!hgtlIsOpen(B,sx,sy))return d;const q=[[sx,sy]];d[sy*W+sx]=0;let qi=0;
  while(qi<q.length){const [x,y]=q[qi++],h=B.h[y*W+x];for(const dd of HGTL.DIRS){const nx=x+dd[0],ny=y+dd[1];if(!hgtlIn(B,nx,ny)||d[ny*W+nx]>=0||B.rows[ny][nx]!=='.')continue;if(Math.abs(B.h[ny*W+nx]-h)>HGTL.CLIMB)continue;d[ny*W+nx]=d[y*W+x]+1;q.push([nx,ny])}}
  return d}
function hgtzSolve(B,from,to){const d=hgtzDist(B,from.x,from.y);return d[to.y*B.W+to.x]}
function hgtzDeadEnds(B,cells){const o=[];for(const [x,y] of cells){let n=0;for(const dd of HGTL.DIRS)if(hgtlIsOpen(B,x+dd[0],y+dd[1])&&Math.abs(hgtlH(B,x+dd[0],y+dd[1])-hgtlH(B,x,y))<=HGTL.CLIMB)n++;if(n===1)o.push([x,y])}return o}

const HGTZ_PETS=['hgtb_pinkbulb','hgtb_lilacmoth','hgtb_lanternbeetle','hgtb_pearlslug','hgtb_amberpup','hgtb_creamjelly','hgtb_jadeeel','hgtb_fishfly','hgtb_creammoth','hgtb_pups'];
function hgtzPlaceReward(C,wx,wy,reward){const B=C.B,o=C.o,R=C.R;
  if(reward==='lamp')reward='chest'; // a lamp alone is no reward: the centre holds a chest, the lamps stand round it
  if(reward==='chest'){const ks=Array.isArray(o.chestKey)?o.chestKey:(o.chestKey?[o.chestKey]:HGTZ.K.chest);hgtlDecor(B,ks[(R()*ks.length)|0],wx,wy,{block:true,sc:.95});B.occ.add(wx+','+wy)}
  else if(reward==='creature'){const pk=o.creature||(typeof IMG!=='undefined'&&IMG.hgtb_pinkbulb?HGTZ_PETS[(R()*HGTZ_PETS.length)|0]:null);
    if(pk)hgtlDecor(B,pk,wx,wy,{block:true,sc:1,txt:'It watches you and does not move.'});else hgtlDecor(B,HGTZ.K.creature,wx,wy,{block:true,sc:.25,txt:'It watches you and does not move.'});B.occ.add(wx+','+wy)}
  else if(reward==='shrine'){hgtlDecor(B,HGTZ.K.obelisk,wx,wy,{block:true,sc:.9});B.occ.add(wx+','+wy)}
  else hgtlDecor(B,HGTZ.K.lamp,wx,wy,{block:false,walk:true,deco:true,sc:1.1});
  hgtlLight(B,wx,wy)}
/* the chamber: ring corridor, reward inside */
function hgtzChamber(C,Z,out){const o=C.o,R=C.R,q=Z.cbox;if(!q)return;const S=q.S,fl=Z.fl,B=C.B;
  const cx=q.x0+((S-1)>>1),cy=q.y0+((S-1)>>1);
  const reward=o.reward;out.boxC=C.T(cx,cy);out.boxS=S;
  // chamber wall ring is already walls; inside: ring corridor (cells at the box edge) and an inner box S-2
  const inner=(x,y)=>x>q.x0&&y>q.y0&&x<q.x0+S-1&&y<q.y0+S-1;
  if(reward==='view'){
    const Sin=S-2,cells=hgtzSpiralCells(Sin),n=cells.length,need=Math.max(.6,Z.wh-.1),rise=Math.max(.15,Math.min(.3,need/n)),vis=new Set(cells.map(c=>c[0]+','+c[1])),hOf=new Map();
    cells.forEach((c,t)=>hOf.set(c[0]+','+c[1],fl+rise*(t+1)));
    for(let j=0;j<Sin;j++)for(let i=0;i<Sin;i++){const k=i+','+j,lx=q.x0+1+i,ly=q.y0+1+j;
      if(vis.has(k)){C.open(lx,ly,hOf.get(k),HGTL.K.STAIR,o.floorStair)}
      else{let m=1e9;for(const dd of HGTL.DIRS){const v=hOf.get((i+dd[0])+','+(j+dd[1]));if(v!==undefined&&v<m)m=v}if(m===1e9)m=fl+rise*n;C.wall(lx,ly,'rail',.85,m)}}
    const e=cells[n-1],top=fl+rise*n;const tp=C.T(q.x0+1+e[0],q.y0+1+e[1]);out.top={x:tp[0],y:tp[1],h:top};out.reward='view';
    // register the climb for the validator
    B.stairs.push({cells:cells.map(c=>C.T(q.x0+1+c[0],q.y0+1+c[1])),h0:fl,rise,kind:'spiral'});
    const tx=out.top.x,ty=out.top.y;hgtlDecor(B,HGTZ.K.lamp,tx,ty,{walk:true,deco:true});hgtlLight(B,tx,ty);out.centre={x:tx,y:ty};
    const [sx,sy]=C.T(q.x0,q.y0);hgtlLight(B,sx,sy);
    return}
  // plain inner box: the reward in the middle of it
  const cwld=C.T(cx,cy);
  for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++){/* inner cells stay open */}
  const [wx,wy]=cwld;out.centre={x:wx,y:wy};out.reward=reward;
  hgtzPlaceReward(C,wx,wy,reward);
  // lamps on two corners of the ring
  for(const [dx,dy] of [[0,0],[S-1,S-1]]){const [lx,ly]=C.T(q.x0+dx,q.y0+dy);hgtlDecor(B,HGTZ.K.lamp,lx,ly,{walk:true,deco:true});hgtlLight(B,lx,ly)}}

/* nodes around the chamber that can carry a door: [{node, dx,dy (local door cell)}] */
function hgtzChamberDoors(Z){const L=Z.L,q=Z.chamber,out=[];if(!q)return out;
  for(let t=0;t<q.c;t++)for(const [i,j,bi,bj] of [[q.i0-1,q.j0+t,0,t],[q.i0+q.c,q.j0+t,q.c-1,t],[q.i0+t,q.j0-1,t,0],[q.i0+t,q.j0+q.c,t,q.c-1]]){
    if(i<0||j<0||i>=Z.cw||j>=Z.ch)continue;const a=j*Z.cw+i;if(!L.act[a])continue;
    const nxl=hgtzNX(Z,i),nyl=hgtzNY(Z,j),bx=hgtzNX(Z,q.i0)+2*bi,by=hgtzNY(Z,q.j0)+2*bj;
    out.push({node:a,dx:(bx+nxl)>>1,dy:(by+nyl)>>1})}
  return out}
function hgtzViewSin(need){for(const S of [3,5,7,9])if(hgtzSpiralCells(S).length*.3>=need)return S;return 9}

/* main entry */
function hgtzMaze0(B,x,y,w,h,opts){
  const o=Object.assign({},opts||{});const kd=HGTZ_KIND[o.kind||'tall']||HGTZ_KIND.tall;o.kind=o.kind||'tall';
  for(const k in kd)if(o[k]===undefined)o[k]=kd[k];
  if(o.kind==='tri')return hgtzTri(B,x,y,w,h,o);
  o.algo=o.algo||'backtracker';o.seed=o.seed!==undefined?o.seed:((B.seed*31+x*977+y*131)|0);o.R=hgtzRng(o.seed);const R=o.R;
  if(o.secret===undefined)o.secret=R()<.45;if(!o.reward)o.reward=['chest','creature','lamp','shrine','view'][(R()*5)|0];
  if(!o._pal){const all=hgtzShuffle(R,['p','a','c','l']);o._pal=o.palette||all.slice(0,3)}
  const base=o.base!==undefined?o.base:hgtlH(B,x,y),C=hgtzCtx(B,x,y,w,h,o);
  let depth=0,raise=0;if(o.kind==='sunken')depth=o.depth;if(o.kind==='raised')raise=o.raise;
  const cw=Math.floor((C.lw0-1)/2),ch=Math.floor((C.lh0-1)/2),lw=2*cw+1,lh=2*ch+1;
  if(depth||raise){const dz=depth||raise,mm=Math.ceil((Math.ceil(dz/.27)+1)/2);if(cw<mm+5||ch<7||o.algo==='labyrinth'||o.algo==='chartres'||o.algo==='dungeon'&&cw<mm+9){depth=0;raise=0}} // no room for the steps: the floor stays at street level
  const fl=base-depth+raise;
  let view=o.reward==='view';
  const wh=depth?depth+.5:o.wallH,bwh=depth?depth+.7:raise?raise+.7:o.wallH;
  const Z={ox:0,oy:C.lh0-lh,lw,lh,cw,ch,fl,wh,bwh,bfoot:depth?fl:raise?base:fl,algo:o.algo,round:o.round||o.kind==='shell',cs:0,entryCol:o.entryCol};
  if(o.kind==='shell'&&o.algo==='backtracker')Z.algo='circular';
  if(Z.algo==='labyrinth'||Z.algo==='chartres')Z.round=false;
  // chamber size (nodes per side; the box is 2c-1 cells): a lookout needs a spiral box with a ring corridor
  let cs=2;if(view){const Sin=hgtzViewSin(wh-.1);cs=(Sin+3)>>1}
  if(cw<cs+4||ch<cs+4){cs=2;if(view)o.reward='lamp',view=false}
  if(cw<6||ch<6)cs=0;
  Z.cs=cs;if(Z.algo==='labyrinth'||Z.algo==='chartres')Z.cs=3;
  // stairs strip
  if(depth||raise){const dz=depth||raise,n=Math.ceil(dz/.27),m=Math.ceil((n+1)/2);Z.strip={m,n:2*m-1,dz,dir:depth?-1:1};
    if(cw<m+4||ch<5){Z.strip=null}}
  // fill
  for(let j=0;j<C.lh0;j++)for(let i=0;i<C.lw0;i++){const lx=i,ly=j;if(ly<Z.oy||lx>=Z.lw)C.wall(lx,ly,'border',Z.bwh,Z.bfoot)}
  hgtzFillZone(C,Z);
  hgtzLattice(C,Z);
  hgtzCarve(C,Z);
  const out={rect:{x,y,w,h},algo:o.algo,kind:o.kind,floorH:fl,wallH:wh,secret:null,reward:o.reward,lamps:[],deadEnds:[]};
  // shell: lit seams where a ring wall is passed
  if(o.kind==='shell'&&Z.L){const L0=Z.L,ci=(Z.cw-1)/2,cj=(Z.ch-1)/2,rg=a=>Math.max(Math.abs(a%Z.cw-ci),Math.abs(((a/Z.cw)|0)-cj));
    for(let a=0;a<L0.n;a++)for(const b of L0.adj[a])if(b>a&&Math.abs(rg(a)-rg(b))>0){const px=(hgtzNX(Z,a%Z.cw)+hgtzNX(Z,b%Z.cw))>>1,py=(hgtzNY(Z,(a/Z.cw)|0)+hgtzNY(Z,(b/Z.cw)|0))>>1,horiz=(a%Z.cw)!==(b%Z.cw);
      for(const s2 of [-1,1]){const fx=horiz?px:px+s2,fy=horiz?py+s2:py;const [wx,wy]=C.T(fx,fy);if(!hgtlIsOpen(B,wx,wy))C.wall(fx,fy,'lit',Z.wh,Z.fl)}
      const [pw,ph]=C.T(px,py);hgtlLight(B,pw,ph)}}
  // entry
  let ex,ey;const L=Z.L;
  if(Z.strip){const s=Z.strip;ex=Z.ox+1;ey=Z.oy+Z.lh-2;
    for(let t=1;t<=s.n;t++){const hh=base+s.dir*s.dz*t/s.n;C.open(ex-1+t,ey,hh,HGTL.K.STAIR,o.floorStair)}
    C.open(ex+s.n,ey,fl,HGTL.K.ALLEY,o.floor);// passage cell between stair end and node
    // the passage cell (ex+n) lies between node (m-1) strip end and node m: its x is 2m
    B.stairs.push({cells:Array.from({length:s.n},(_,t)=>C.T(ex+t,ey)),h0:base,rise:s.dir*s.dz/s.n,kind:'stairs'});
    C.open(ex,ey+1,base,HGTL.K.GROUND,o.floor);out.entryLocal=[ex,ey+1];
    // walls beside the stairs follow their height
    for(let t=1;t<=s.n;t++){const hh=base+s.dir*s.dz*t/s.n;if(depth){}else{}}
  }else{
    const en=Z.entryNode,ei=en%Z.cw,ej=(en/Z.cw)|0;ex=hgtzNX(Z,ei);ey=hgtzNY(Z,ej);
    for(let yy=ey+1;yy<=Z.oy+Z.lh-1;yy++)C.open(ex,yy,fl,yy===Z.oy+Z.lh-1?HGTL.K.GROUND:HGTL.K.ALLEY,o.floor);
    out.entryLocal=[ex,Z.oy+Z.lh-1]}
  const [exw,eyw]=C.T(out.entryLocal[0],out.entryLocal[1]),[apx,apy]=C.T(out.entryLocal[0],out.entryLocal[1]+1);
  out.entry={x:exw,y:eyw};out.approach={x:apx,y:apy};
  // entry cell height: street height when it is a border step, else floor
  // chamber doors
  if(Z.chamber){
    const doors=hgtzChamberDoors(Z);let main=null;
    if(Z.algo==='labyrinth'||Z.algo==='chartres'){main=doors.find(d=>d.node===Z.endNode)}
    else main=doors[(R()*doors.length)|0];
    if(!main)main=doors[0];
    if(main)C.open(main.dx,main.dy,fl,HGTL.K.ALLEY,o.floor);
    const dist=hgtzDistNodes(L,Z.entryNode);
    if(o.secret&&main){const alt=doors.filter(d=>d.node!==main.node&&dist[d.node]>=0).sort((a,b)=>dist[b.node]-dist[a.node]);
      if(alt.length&&(dist[alt[0].node]>dist[main.node]*.7||alt.length)){const s=alt[0];C.open(s.dx,s.dy,fl,HGTL.K.ALLEY,o.floor);const [sx,sy]=C.T(s.dx,s.dy);
        hgtlDecor(B,HGTZ.K.vine,sx,sy,{walk:true,deco:true,sc:1.05});B.secrets.push([sx,sy]);out.secret={x:sx,y:sy}}}
    hgtzChamber(C,Z,out);
    if(Z.chamber&&(o.reward==='view')&&out.top){}
    out.chamber={x:C.T(Z.cbox.x0,Z.cbox.y0)[0],y:C.T(Z.cbox.x0,Z.cbox.y0)[1],S:Z.cbox.S}
  }else{const [cx,cy]=C.T(hgtzNX(Z,(Z.cw-1)>>1),hgtzNY(Z,(Z.ch-1)>>1));out.centre={x:cx,y:cy};hgtzPlaceReward(C,cx,cy,o.reward==='view'?'lamp':o.reward)}
  // dungeon: doors and false rooms
  if(Z.algo==='dungeon')hgtzDungeonDress(C,Z,out);
  // second secret route in a plain maze (no chamber): not needed
  hgtzFinish(C,Z,out);
  return out}

function hgtzDistNodes(L,start){const d=new Int32Array(L.n).fill(-1);if(start<0)return d;const q=[start];d[start]=0;let qi=0;while(qi<q.length){const a=q[qi++];for(const b of L.adj[a])if(d[b]<0){d[b]=d[a]+1;q.push(b)}}return d}

function hgtzDungeonDress(C,Z,out){const L=Z.L,B=C.B,R=C.R;
  // doors: lamp-lit jambs (a light at the door cell); leaf rooms: false rooms with a lectern or jar; one false room behind a light-vine
  let falseN=0;
  for(const [a,b] of L.doors){const i=a%Z.cw,j=(a/Z.cw)|0,i2=b%Z.cw,j2=(b/Z.cw)|0;const dx=hgtzNX(Z,i)+(i2-i),dy=hgtzNY(Z,j)+(j2-j);const [wx,wy]=C.T(dx,dy);hgtlLight(B,wx,wy)}
  for(const r of L.rooms){let cnt=0;const set=new Set();for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++)set.add((r.j+y)*Z.cw+r.i+x);
    for(const [a,b] of L.doors){if(set.has(a)!==set.has(b))cnt++}
    const cx=hgtzNX(Z,r.i)+(r.w-1),cy=hgtzNY(Z,r.j)+(r.h-1);const [wx,wy]=C.T(cx,cy);
    const isChamber=out.chamber&&false;
    if(cnt<=1){falseN++;const k=HGTZ.K.falseRoom[(R()*HGTZ.K.falseRoom.length)|0];hgtlDecor(B,k,wx,wy,{block:true,sc:.9});B.occ.add(wx+','+wy);hgtlLight(B,wx,wy)}
    else{hgtlDecor(B,HGTZ.K.lamp,wx,wy,{walk:true,deco:true});hgtlLight(B,wx,wy)}}
  out.falseRooms=falseN}

/* lamps at intervals, dead ends, floor flags, return fields */
function hgtzFinish(C,Z,out){const B=C.B,o=C.o,R=C.R;
  const seen=new Set(),cells=[];for(const c of C.cells){const k=c[0]+','+c[1];if(!seen.has(k)){seen.add(k);cells.push(c)}}
  out.cells=cells;
  const d=hgtzDist(B,out.entry.x,out.entry.y),W=B.W;
  if(o.lamps!==false){const ev=o.lampEvery||7;
    for(const [x,y] of cells){const dd=d[y*W+x];if(dd<=1||dd%ev!==ev-1)continue;if(B.occ.has(x+','+y))continue;if(out.centre&&Math.abs(out.centre.x-x)+Math.abs(out.centre.y-y)<2)continue;
      if(B.kind[y*W+x]===HGTL.K.STAIR)continue;hgtlDecor(B,HGTZ.K.lamp,x,y,{walk:true,deco:true});hgtlLight(B,x,y);out.lamps.push([x,y])}}
  out.deadEnds=hgtzDeadEnds(B,cells);
  // plants and a soft light at some dead ends
  for(const [x,y] of out.deadEnds){if(B.occ.has(x+','+y)||(x===out.entry.x&&y===out.entry.y))continue;if(R()<.35){const k=HGTZ.K.plants[(R()*HGTZ.K.plants.length)|0];hgtlDecor(B,k,x,y,{walk:true,deco:true,sc:.8+R()*.4});if(R()<.5)hgtlLight(B,x,y)}}
  if(!out.centre)out.centre=out.approach;
  if(C.tubes.length){B.tube=(B.tube||[]).concat(C.tubes);B.tubeH=o.wallH}
  return out}

/* engine tubes: lv.terrace.lid[y*W+x] = ceiling height above the floor for covered cells (0 = open sky). */
function hgtzApplyLids(B,lv,h){if(!lv||!lv.terrace||(!B.tube&&!B.lid))return;const lid=new Float32Array(B.W*B.H);if(B.lid)lid.set(B.lid);for(const [x,y] of (B.tube||[]))lid[y*B.W+x]=h||B.tubeH||2.4;lv.terrace.lid=lid}

/* ---------- three levels ---------- */
function hgtzTri(B,x,y,w,h,o){
  o.seed=o.seed!==undefined?o.seed:((B.seed*31+x*977+y*131)|0);o.R=hgtzRng(o.seed);const R=o.R;
  if(!o._pal){const all=hgtzShuffle(R,['p','a','c','l']);o._pal=o.palette||all.slice(0,3)}
  if(o.secret===undefined)o.secret=true;if(!o.reward)o.reward='view';
  const base=o.base!==undefined?o.base:hgtlH(B,x,y),C=hgtzCtx(B,x,y,w,h,o),RZ=o.rise||2.6,n=Math.ceil(RZ/.27),wh=o.wallH||2.4;
  const lw0=C.lw0,lh0=C.lh0,avail=lw0-2*n,cwz=Math.floor((avail-3)/6),lhz=((lh0-3)%2?lh0-3:lh0-4),chz=(lhz-1)/2,lwz=2*cwz+1;
  if(cwz<4||chz<4)return hgtzMaze(B,x,y,w,h,Object.assign({},o,{kind:'tall'}));
  const oy=lh0-lhz,ry=oy-1;
  const zones=[0,1,2].map(k=>({ox:k*(lwz+n),oy,lw:lwz,lh:lhz,cw:cwz,ch:chz,fl:base+k*RZ,wh,bwh:wh,bfoot:base+k*RZ,algo:['backtracker','prim','backtracker'][k],cs:k===2?3:0,round:false}));
  // fill everything with border wall first
  for(let j=0;j<lh0;j++)for(let i=0;i<lw0;i++)C.wall(i,j,'border',wh,base);
  const out={rect:{x,y,w,h},algo:'tri',kind:'tri',secret:null,reward:o.reward,lamps:[],floorH:base,wallH:wh};
  if(o.reward==='view'){o.reward='view'}
  const ents=[];
  zones.forEach((Z,k)=>{o.floor=5;hgtzFillZone(C,Z);if(k===2&&o.reward==='view')Z.cs=(hgtzViewSin(wh-.1)+3)>>1;
    Z.entryCol=k===0?undefined:0;Z.noEntryTunnel=true;hgtzLattice(C,Z);hgtzCarve(C,Z)});
  // entry of zone 0 from the south border
  {const Z=zones[0],en=Z.entryNode,ei=en%Z.cw,ej=(en/Z.cw)|0,ex=hgtzNX(Z,ei);
    for(let yy=hgtzNY(Z,ej)+1;yy<=Z.oy+Z.lh-1;yy++)C.open(ex,yy,Z.fl,yy===Z.oy+Z.lh-1?HGTL.K.GROUND:HGTL.K.ALLEY,5);
    const [exw,eyw]=C.T(ex,Z.oy+Z.lh-1),[apx,apy]=C.T(ex,Z.oy+Z.lh);out.entry={x:exw,y:eyw};out.approach={x:apx,y:apy}}
  // stair blocks: stairs in the border-wall band between zone k and k+1
  const rows=[Math.max(0,Math.floor(chz/2)-1),Math.min(chz-1,Math.floor(chz/2)+2)];
  for(let k=0;k<2;k++){const Za=zones[k],Zb=zones[k+1],r=rows[k],ly=hgtzNY(Za,r),E0=Za.ox+Za.lw-1;
    // walls of the block: tall, foot at the lower floor
    for(let j=0;j<Za.lh;j++)for(let t=1;t<=n;t++)C.wall(E0+t,Za.oy+j,'pillar',RZ+wh,Za.fl);
    C.open(E0,ly,Za.fl,HGTL.K.ALLEY,5);
    const cells=[];for(let t=1;t<=n;t++){C.open(E0+t,ly,Za.fl+RZ*t/n,HGTL.K.STAIR,2);cells.push(C.T(E0+t,ly))}
    C.open(E0+n+1,ly,Zb.fl,HGTL.K.ALLEY,5);B.stairs.push({cells,h0:Za.fl,rise:RZ/n,kind:'stairs'});
    // the lattice node next to each end already exists (rows align)
    const mid=C.T(E0+((n+1)>>1),ly);hgtlDecor(B,HGTZ.K.lamp,mid[0],mid[1],{walk:true,deco:true});hgtlLight(B,mid[0],mid[1])}
  // the ramp bridge along the north edge from zone 0 (west) to zone 2 (east)
  {const Z0=zones[0],Z2=zones[2],xs=1,xe=hgtzNX(Z2,Z2.cw-1),tot=xe-xs;
    for(let xx=xs;xx<=xe;xx++){const hh=Z0.fl+(Z2.fl-Z0.fl)*(xx-xs)/tot;C.open(xx,ry,hh,HGTL.K.BRIDGE,2);
      C.wall(xx,oy,'rail',.9,hh);if(ry-1>=0)C.wall(xx,ry-1,'rail',.9,hh)}
    B.stairs.push({cells:Array.from({length:tot+1},(_,t)=>C.T(xs+t,ry)),h0:Z0.fl,rise:(Z2.fl-Z0.fl)/tot,kind:'bridge'});
    C.open(xs,oy,Z0.fl,HGTL.K.ALLEY,5);C.open(xe,oy,Z2.fl,HGTL.K.ALLEY,5);
    // a lamp every 6 cells on the ramp
    for(let xx=xs+5;xx<xe;xx+=6){const [wx,wy]=C.T(xx,ry),hh=Z0.fl+(Z2.fl-Z0.fl)*(xx-xs)/tot;hgtlDecor(B,HGTZ.K.lamp,wx,wy,{walk:true,deco:true});hgtlLight(B,wx,wy);C.lamps.push([wx,wy])}
    // hide the ramp end behind a light-vine so the shortcut reads as a secret route
    const [vx,vy]=C.T(xe,oy);hgtlDecor(B,HGTZ.K.vine,vx,vy,{walk:true,deco:true,sc:1.05});B.secrets.push([vx,vy]);out.secret={x:vx,y:vy};
    // the west end opens onto zone 0's first node
    }
  // chamber of zone 2
  {const Z=zones[2],doors=hgtzChamberDoors(Z);Z.fl=zones[2].fl;const main=doors[(R()*doors.length)|0];
    if(main)C.open(main.dx,main.dy,Z.fl,HGTL.K.ALLEY,5);
    o.floor=5;hgtzChamber(C,Z,out);out.chamber=true}
  // lamps by distance
  const cells=C.cells;
  hgtzFinish(C,zones[0],out);
  out.floorH=base;out.levels=[base,base+RZ,base+2*RZ];
  return out}

/* ---------- interior level (multi-room indoor maze with doors and false rooms) ---------- */
function hgtzIndoorLevel(id,opts){opts=opts||{};
  const W=opts.w||31,H=opts.h||31,B=hgtlNew(W,H,opts.seed||id),back=opts.back;
  const m=hgtzMaze(B,0,0,W,H,Object.assign({kind:'indoor',algo:'dungeon',side:'S',base:0,reward:'chest',secret:true,lampEvery:6},opts.maze||{}));
  const doorGid=(typeof hgtaDoorTile==='function'&&hgtzReal())?hgtaDoorTile('hgt_d2','hgt_wp',2.7,back):null;
  const chars={};for(const ch in (typeof hgtaChars!=='undefined'?hgtaChars:{}))chars[ch]=hgtaChars[ch];
  let dc='῿';if(doorGid){dc=hgtaChar(doorGid);chars[dc]=doorGid}
  B.rows[m.entry.y][m.entry.x]=dc;
  const L=hgtlAssemble(B,{name:opts.name||'The Lamp Rooms',label:opts.name||'The Lamp Rooms',start:{x:m.entry.x,y:m.entry.y-1,f:0},diff:66});
  delete L.terrace;L.outdoor=false;
  for(const ch in hgtaChars)L.chars[ch]=hgtaChars[ch];
  Object.assign(L,{floor:'wood',ceil:'beam',ceilH:3,day:0,amb:.5,noTele:true,noExtras:true});
  L._maze=m;return L}

/* ---------- the test level 486 ---------- */
const HGTZ_ID=486,HGTZ_IN=4940,HGTZ_PITCH=48;
LEVEL_NAMES[HGTZ_ID]='The Maze Gardens';LEVEL_NAMES[HGTZ_IN]='The Lamp Rooms';
function hgtzSlot(idx,sz){const gx=idx%4,gy=(idx/4)|0;return {x:4+gx*HGTZ_PITCH+((HGTZ_PITCH-sz)>>1),y:4+gy*HGTZ_PITCH+(HGTZ_PITCH-sz-6)}}
function hgtzTestBuild(){
  const P=HGTZ_PITCH,W=P*4+80,H=P*4+30,B=hgtlNew(W,H,486),real=hgtzReal();
  const wc=(name,wh)=>real?hgtaChar(hgtaWallTile(name,wh)):HGTL_CHARS.nacre_a_mid;
  hgtlBorder(B,wc('hgt_wa',4),0);
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)B.kind[y*W+x]=HGTL.K.PLAZA;
  const lamp=(x,y)=>{if(hgtlIsOpen(B,x,y)){hgtlDecor(B,HGTZ.K.lamp,x,y,{walk:true,deco:true});hgtlLight(B,x,y)}};
  const specs=[
    ['Hedge backtrack',{kind:'hedge',algo:'backtracker',reward:'view'},29],
    ['Hedge braid',{kind:'hedge',algo:'braid',reward:'creature',secret:true},29],
    ['Tall Prim',{kind:'tall',algo:'prim',wallH:4.5,reward:'chest'},29],
    ['Tall Kruskal',{kind:'tall',algo:'kruskal',wallH:6,reward:'view'},29],
    ['Tube Wilson',{kind:'tube',algo:'wilson',reward:'lamp'},29],
    ['Sunken',{kind:'sunken',algo:'backtracker',reward:'shrine'},29],
    ['Raised',{kind:'raised',algo:'prim',reward:'view'},29],
    ['Secret hedge',{kind:'hedge',algo:'backtracker',reward:'chest',secret:false},15],
    ['Shell rings',{kind:'shell',algo:'circular',reward:'lamp'},29],
    ['Spiral',{kind:'tall',algo:'spiral',wallH:3.4,reward:'chest',secret:true},29],
    ['Rings',{kind:'tall',algo:'circular',wallH:3.4,reward:'shrine'},29],
    ['Labyrinth',{kind:'tall',algo:'labyrinth',wallH:2.6,reward:'lamp'},29],
    ['Chartres',{kind:'tall',algo:'chartres',wallH:2.6,reward:'chest'},29],
    ['Dungeon',{kind:'tall',algo:'dungeon',wallH:3.4,reward:'chest',secret:true},29],
    ['Indoor maze',null,29],
    ['The Grand Maze',{kind:'tall',algo:'braid',wallH:5,braid:.5,reward:'view',secret:true},41]];
  const results=[];
  specs.forEach((sp,idx)=>{const sz=sp[2],s=hgtzSlot(idx,sz);
    if(sp[1]){const m=hgtzMaze(B,s.x,s.y,sz,sz,Object.assign({seed:idx*101+7},sp[1]));results.push(m);hgtlName(B,s.x+(sz>>1),s.y-2,sp[0],'place')}
    else{const hx=s.x+8,hy=s.y+10;hgtlBlock(B,hx,hy,13,9,wc('hgt_wc',3.4),0);
      const dch=real?hgtaChar(hgtaDoorTile('hgt_d2','hgt_wp',2.7,{lvl:HGTZ_IN,at:{x:15,y:29,f:0}})):HGTL_CHARS.door_round;
      hgtlDoor(B,hx+6,hy+8,2,{ch:dch});lamp(hx+4,hy+10);lamp(hx+8,hy+10);hgtlName(B,hx+6,hy-2,sp[0],'place');results.push({entry:{x:hx+6,y:hy+8},approach:{x:hx+6,y:hy+9},cells:[],reward:'door'})}});
  // the three level maze on its own ground at the east
  {const m=hgtzMaze(B,4+4*P+4,6,71,33,{kind:'tri',seed:777,reward:'view'});results.push(m);hgtlName(B,4+4*P+4+35,4,'Three levels','place')}
  hgtlSetStart(B,(W>>1)-30,H-6,0);
  for(let x=3;x<W-3;x+=10)lamp(x,H-12);
  for(let gy=0;gy<4;gy++)for(let x=3;x<P*4;x+=10)lamp(x,4+gy*P+P-3);
  const v=hgtlValidate(B,B.start.x,B.start.y);
  window.HGTZ_B=B;window.HGTZ_R=results;window.HGTZ_V=v;
  const L=hgtlAssemble(B,{name:'The Maze Gardens',label:'The Maze Gardens',start:B.start,diff:66});
  for(const ch in hgtaChars)L.chars[ch]=hgtaChars[ch];
  const fm=[];for(let yy=0;yy<H;yy++){let r='';for(let xx=0;xx<W;xx++)r+=B.fm&&B.fm[yy*W+xx]?String(B.fm[yy*W+xx]):'0';fm.push(r)}
  Object.assign(L,{fmap:fm,floorSet:['hgt_f0','hgt_f3','hgt_f4','hgt_f5','hgt_f7','hgt_f2'],floor:'hgt_f0',ceil:'tomb',ceilH:3,day:0,outdoor:true,amb:.72,noExtras:true,noTele:true,diff:66});
  hgtzApplyLids(B,L);
  return L}
if(typeof hgtRegister==='function'){
  hgtRegister(HGTZ_ID,hgtzTestBuild);
  hgtRegister(HGTZ_IN,id=>{const hs=hgtzSlot(14,29);return hgtzIndoorLevel(id,{w:31,h:31,seed:4940,back:{lvl:HGTZ_ID,at:{x:hs.x+8+6,y:hs.y+10+9,f:2}},maze:{entryCol:7}})});
}

if(typeof HGTE!=='undefined'){HGTE.look[486]={ambient:.82,haze:.14,hazeRate:.01,hazeCol:[150,130,190],lamp:[1,.78,.45],wallGain:1.25,wallSat:1.8,floorGain:1,floorContrast:1.5,motes:60,grade:[250,242,250,.1],roofGain:.8};HGTE.look[4940]={ambient:.5,haze:.1}}

/* ---------- the overview map (M key) of the test level: drawn from the real level, one pixel to the cell ---------- */
const HGTZ_NM={cv:null,s:.9,ox:122,oy:58};
function hgtzMapDraw(){
  const L=LEVELS[HGTZ_ID];if(!L||!L.hgtl)return null;const W=L.hgtl.W,H=L.hgtl.H,S=HGTZ_NM.s,OX=HGTZ_NM.ox,OY=HGTZ_NM.oy,ink='#241a12',halo='rgba(226,222,200,.92)';
  const c=document.createElement('canvas');c.width=DW*3;c.height=DH*3;const x=c.getContext('2d');x.scale(3,3);
  const gr=x.createLinearGradient(0,0,0,DH);gr.addColorStop(0,'#c9c6ad');gr.addColorStop(1,'#a9aa94');x.fillStyle=gr;x.fillRect(0,0,DW,DH);
  const lab=(t,a,b,sz,col)=>{x.save();x.font='bold '+sz+'px '+FUI;x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=3;x.strokeStyle=halo;x.strokeText(t,a,b);x.fillStyle=col||ink;x.fillText(t,a,b);x.restore()};
  const sc=document.createElement('canvas');sc.width=W;sc.height=H;const sx=sc.getContext('2d'),im=sx.createImageData(W,H),h=L.terrace.h,kind=L.hgtl.kind;
  for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++){const i=yy*W+xx,o=i*4,ch=L.rows[yy][xx];let r,g,b;
    if(ch==='.'){const t=Math.max(0,Math.min(1,(h[i]+2.6)/10));r=206+t*40;g=204+t*24;b=190-t*70;
      if(kind[i]===HGTL.K.STAIR||kind[i]===HGTL.K.BRIDGE){r+=24;g+=24;b+=24}
      if(L.fmap[yy][xx]==='4'){r-=40;g+=10;b-=40}else if(L.fmap[yy][xx]==='5'){r-=22;g-=10;b+=6}}
    else{const wh=(TEX[T_TILE[L.chars[ch]]]||{}).wh||3,v=Math.min(1,wh/7);r=118-v*40;g=92-v*36;b=122-v*34;if(wh<2){r=70;g=120;b=62}}
    im.data[o]=r;im.data[o+1]=g;im.data[o+2]=b;im.data[o+3]=255}
  sx.putImageData(im,0,0);x.save();x.imageSmoothingEnabled=false;x.drawImage(sc,OX,OY,W*S,H*S);x.restore();
  x.strokeStyle=ink;x.lineWidth=1.4;x.strokeRect(OX,OY,W*S,H*S);
  x.fillStyle='#b8321e';for(const d of L.hgtl.doors){x.beginPath();x.arc(OX+(d.x+.5)*S,OY+(d.y+.5)*S,1.3,0,Math.PI*2);x.fill()}
  for(const m of (window.HGTZ_R||[])){if(!m.centre||m.reward==='door')continue;x.fillStyle='#6a2a8a';x.beginPath();x.arc(OX+(m.centre.x+.5)*S,OY+(m.centre.y+.5)*S,1.4,0,Math.PI*2);x.fill()}
  for(const n of L.mapNames){if(!n.t)continue;lab(n.t.toUpperCase(),OX+(n.x+.5)*S,OY+(n.y+.5)*S,4.6,ink)}
  x.save();x.font='18px '+FTITLE;x.textAlign='left';x.textBaseline='middle';x.fillStyle=ink;x.fillText('The Maze Gardens',8,16);x.restore();
  x.save();x.font='bold 7px '+FUI;x.textAlign='left';x.textBaseline='middle';x.fillStyle='#5a3c1c';x.fillText('one of each kind of maze',9,32);x.restore();
  const lx=372,ly0=70,key=(i,t,fn)=>{const yy=ly0+i*16;fn(lx+8,yy);x.save();x.font='bold 6.4px '+FUI;x.textAlign='left';x.textBaseline='middle';x.fillStyle='#3a2a1c';x.fillText(t,lx+20,yy);x.restore()};
  key(0,'Door',(a,b)=>{x.fillStyle='#b8321e';x.beginPath();x.arc(a,b,2,0,Math.PI*2);x.fill()});
  key(1,'Reward',(a,b)=>{x.fillStyle='#6a2a8a';x.beginPath();x.arc(a,b,2,0,Math.PI*2);x.fill()});
  key(2,'Low ground',(a,b)=>{x.fillStyle='rgb(170,178,190)';x.fillRect(a-4,b-3,8,6)});
  key(3,'High ground',(a,b)=>{x.fillStyle='rgb(230,208,120)';x.fillRect(a-4,b-3,8,6)});
  key(4,'Hedge',(a,b)=>{x.fillStyle='rgb(70,120,62)';x.fillRect(a-4,b-3,8,6)});
  return c}
function hgtzMapOverview(){if(!HGTZ_NM.cv)HGTZ_NM.cv=hgtzMapDraw();MPL.reveal=false;if(HGTZ_NM.cv)mplPaint(HGTZ_NM.cv,3,{x:118,y:38,w:252,h:254},cx=>HGTZ_NM.ox+cx*HGTZ_NM.s,cy=>HGTZ_NM.oy+cy*HGTZ_NM.s,'You are the yellow arrow.')}
if(typeof drawOverview==='function'&&typeof mplFogOn==='function'){
  {const _do=drawOverview;drawOverview=function(){if(LEVEL===HGTZ_ID&&LEVELS[HGTZ_ID]&&!G.world&&!G.teleMode){hgtzMapOverview();return}return _do.apply(this,arguments)}}
  {const _f=mplFogOn;mplFogOn=function(L){if(LEVEL===HGTZ_ID)return false;return _f.apply(this,arguments)}}}

var HGTZ_LOG=(typeof HGTZ_LOG==='undefined')?[]:HGTZ_LOG;
function hgtzMaze(B,x,y,w,h,opts){const out=hgtzMaze0(B,x,y,w,h,opts);
    HGTZ_LOG.push({B,out,x,y,w,h});return out}

/* ==========================================================================
   MAZE DRESSING: every maze gets (1) a BEACON: four tall glowing spires round the centre chamber, visible over the walls from far away;
   (2) a lit GATE: an arch on the entry cell, two tall glowing pillars either side, lamps, and a floor runner leading in from the street;
   (3) one wall STYLE per maze (hgtzStyle, a tile callback for the cities), and a chest, creature or shrine at the centre.
   hgtzDress(B, m, {setFloor:(x,y,digit)=>..., floor:digit}) is called automatically by hgtzMaze (spires and gate) and may be called again by a city
   after its own street is built (it only adds what is missing and writes the runner through setFloor, which defaults to B.fm).
   ========================================================================== */
const HGTZ_STYLES={
  tall:[['mosaic','filigree'],['script','map'],['tessel','quilt'],['crayon','crosshatch']],
  sunken:[['portholes','ringbubbles'],['rings','bubbles'],['medallions','portholes']],
  raised:[['quilt','tessel'],['mosaic','script'],['wavylilac','crosshatch']],
  shell:[['scales','medallions'],['scales','rings'],['medallions','ringbubbles']],
  tri:[['constellation','confetti'],['pointillist','dotsyellow']],
  tube:[['loopsmint','doodleaqua']]};
const hgtzQ=v=>Math.max(.5,Math.round(v*5)/5);
/* a tile callback with ONE wall picture per maze (walls) and a second for posts and borders; n picks the style from the kind's list */
function hgtzStyle(n,over){over=over||{};
  return function(role,wh,info){const kind=info&&info.kind||'tall';if(kind==='hedge')return undefined;
    if(!(role==='wall'||role==='border'||role==='post'||role==='rail'||role==='lit'||role==='chamber'||role==='pillar'))return undefined;
    const list=over[kind]||HGTZ_STYLES[kind]||HGTZ_STYLES.tall,pair=list[(((n|0)%list.length)+list.length)%list.length];
    if(kind==='tube'&&typeof hgtaPic==='function'&&hgtaPic('hgtb_tube')&&(role==='wall'||role==='post'||role==='border'))return hgtaChar(hgtaWallTile('hgtb_tube',hgtzQ(wh)));
    const rn=q=>q.indexOf('hgt')===0?q:'hgt_w2_'+q,t1=rn(pair[0]),t2=rn(pair[1]);if(!hgtaPic(t1))return undefined;
    if(role==='lit')return hgtaChar(hgtaWallTile('hgt_wb3',hgtzQ(wh)));
    if(role==='chamber')return hgtaChar(hgtaWallTile('hgt_wb2',hgtzQ(wh),{top:'hgt_wb3'}));
    if(role==='post'||role==='border'||role==='pillar')return hgtaChar(hgtaWallTile(hgtaPic(t2)?t2:t1,hgtzQ(wh)));
    return hgtaChar(hgtaWallTile(t1,hgtzQ(wh)))}}
function hgtzInRect(m,x,y){const r=m.rect;return !r||(x>=r.x&&y>=r.y&&x<r.x+r.w&&y<r.y+r.h)}
function hgtzHasDecor(B,k,x,y){for(const d of B.decor)if(d.x===x&&d.y===y&&d.k===k)return true;return false}
function hgtzDecorAt(B,x,y){for(const d of B.decor)if(d.x===x&&d.y===y)return d;return null}
function hgtzDress(B,m,o){o=o||{};if(!m||!m.entry||!m.approach||m.kind==='indoor'||typeof hgtaWallTile!=='function'||!hgtzReal())return;
  const W=B.W,ex=m.entry.x,ey=m.entry.y,ax=m.approach.x,ay=m.approach.y,dx=ex-ax,dy=ey-ay,lx=dy?1:0,ly=dx?1:0,seed=(B.seed*31+ex*7+ey*13)|0,sd=Math.abs(seed)%4;
  const gp=n=>hgtaPic('hgt_w2_'+n)?'hgt_w2_'+n:'hgt_wb3';
  const glow=[[gp('bandjade'),gp('portlilac'),'hgt_wb3'],[gp('bandjade'),gp('dotsyellow'),'hgt_wb3'],[gp('bandjade'),gp('ringbubbles'),'hgt_wb3'],[gp('bandjade'),gp('medallions'),'hgt_wb3']][sd];
  const base=hgtlH(B,ax,ay);
  // beacon: four spires on the posts at the corners of the chamber wall ring (or round the centre cell when there is no chamber)
  if(!m._beacon){m._beacon=true;
    let cx,cy,r;if(m.boxC){cx=m.boxC[0];cy=m.boxC[1];r=((m.boxS-1)>>1)+1}else if(m.centre){cx=m.centre.x;cy=m.centre.y;r=1}
    if(cx!==undefined){m.spires=[];
      for(const [sx,sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const x=cx+sx*r,y=cy+sy*r;if(!hgtlIn(B,x,y)||B.rows[y][x]==='.'||!hgtzInRect(m,x,y))continue;
        const foot=B.h[y*W+x],top=base+(m.kind==='tall'?(m.wallH||4.5)+12:18),T=hgtzQ(Math.max(8,top-foot));
        hgtlWall(B,x,y,hgtaChar(hgtaWallTile(glow[1],T,{base:glow[0],mid:glow[1],top:glow[2]})),foot);m.spires.push([x,y,T])}
      if(m.spires.length)hgtlLight(B,cx,cy)}}
  // gate: pillars either side of the entry cell, an arch on it
  if(!m._gate){m._gate=true;
    for(const sg of [-1,1])for(const k of [1,2]){const x=ex+lx*sg*k,y=ey+ly*sg*k;if(!hgtlIn(B,x,y)||B.rows[y][x]==='.'||!hgtzInRect(m,x,y))continue;
      const foot=B.h[y*W+x],top=base+(m.kind==='tall'?(m.wallH||4.5)+(k===1?2.6:1.4):(k===1?5.6:4)),T=hgtzQ(Math.max(3,top-foot));
      hgtlWall(B,x,y,hgtaChar(hgtaWallTile(glow[1],T,{base:glow[0],top:glow[2]})),foot)}
    if(!hgtzHasDecor(B,'hgt_arch',ex,ey))hgtlDecor(B,'hgt_arch',ex,ey,{walk:true,deco:true,sc:1.6});
    hgtlLight(B,ex,ey);
    if(o.porch!==false){const lid=hgtlEnsureLid(B);lid[ey*W+ex]=o.porchH||3}} // the entry cell is a covered doorway under the lit pillars
  // lamps beside the approach and a runner of the maze floor leading out from the gate along the lane
  const set=o.setFloor||((x,y,d)=>{if(!B.fm)B.fm=new Uint8Array(B.W*B.H);B.fm[y*W+x]=d}),digit=o.floor!==undefined?o.floor:(m.floorDigit!==undefined?m.floorDigit:5);
  const okc=(x,y)=>hgtlIsOpen(B,x,y)&&Math.abs(hgtlH(B,x,y)-base)<.3&&B.kind[y*W+x]!==HGTL.K.STAIR;
  m.runner=m.runner||[];m.runnerDigit=digit;
  for(let k=0;k<=8;k++){const x=ax-dx*k,y=ay-dy*k;if(!okc(x,y)){if(k>0)break;else continue}
    try{set(x,y,digit)}catch(e){}m.runner.push([x,y]);
    if(k%3===1)hgtlLight(B,x,y);
    if(k===0||k===4||k===8)for(const sg of [-1,1]){const px=x+lx*sg,py=y+ly*sg;if(!okc(px,py)||B.occ.has(px+','+py))continue;const dd=hgtzDecorAt(B,px,py);if(dd&&!(dd.walk&&dd.deco))continue;
      if(!dd){hgtlDecor(B,'hgt_lamppost',px,py,{walk:true,deco:true,sc:1.15});hgtlLight(B,px,py)}}}
  return m}
/* the automatic hook: every maze made by hgtzMaze gets its spires and gate */
{const _h=hgtzMaze;hgtzMaze=function(B,x,y,w,h,opts){const m=_h.apply(this,arguments);if(m&&m.entry){m.floorDigit=(opts&&opts.floor!==undefined)?opts.floor:(HGTZ_KIND[(opts&&opts.kind)||'tall']||{}).floor;try{hgtzDress(B,m,{floor:m.floorDigit})}catch(e){console.error('hgtzDress',e)}}return m}}
