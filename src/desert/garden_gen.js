/* ==========================================================================
   THE MAZE OF GARDENS, the maze itself (level 490; prefix gmg / GMG). Pure code with no pictures and no page: it can be run in node (tools/gm_test.js).
   A lattice of 45 by 45 nodes (91 by 91 cells, a node is at cell 2i+1,2j+1). Nineteen rooms (garden rooms) are cut out of the lattice as blocks; the rest is a maze of one-square
   corridors made by a depth-first walk that likes to go straight on. A room is one unit of the walk and is given only a few doors, so a room is a place and not a crossroads.
   One secret room (the bower) is cut out of the walk and joined by one hidden door. gmgBuild(seed) returns {g,edges,doors,...}; gmgPick() finds the seed whose walk from the
   gate to the far end is about right.  Rooms are written in node units (i0..i1, j0..j1 inclusive).
   ========================================================================== */
const GMG={N:45,W:91,H:91,TARGET:[700,1000],SEED:0,
  BARRIERS:[{j:33,gap:[0,1]},{j:24,gap:[43,44]},{j:16,gap:[0,1]}], // three hedge banks across the garden, each with one gap, at alternate ends: the way winds back and forth from the gate to the far end

  ROOMS:[
   {id:'exit',n:'The Wardens Court',i0:17,j0:0,i1:27,j1:4,doors:3},
   {id:'wist',n:'The Wisteria Walk',i0:2,j0:1,i1:7,j1:5},
   {id:'zoo',n:'The Topiary Zoo',i0:35,j0:1,i1:41,j1:5},
   {id:'bee',n:'The Bee Garden',i0:3,j0:9,i1:8,j1:13},
   {id:'sun',n:'The Sundial Lawn',i0:11,j0:8,i1:14,j1:12},
   {id:'theatre',n:'The Hedge Theatre',i0:18,j0:8,i1:24,j1:12},
   {id:'folly',n:'The Ruined Folly',i0:34,j0:9,i1:39,j1:14},
   {id:'bower',n:'The Hidden Bower',i0:43,j0:11,i1:44,j1:12,secret:true},
   {id:'gallery',n:'The Statue Gallery',i0:2,j0:18,i1:10,j1:21},
   {id:'pond',n:'The Lily Pond Court',i0:19,j0:18,i1:25,j1:22},
   {id:'gazebo',n:'The Gazebo Lawn',i0:34,j0:18,i1:39,j1:22},
   {id:'rose',n:'The Rose Garden',i0:3,j0:26,i1:9,j1:31},
   {id:'turf',n:'The Little Labyrinth',i0:19,j0:26,i1:25,j1:32},
   {id:'kitchen',n:'The Kitchen Garden',i0:29,j0:26,i1:32,j1:30},
   {id:'herb',n:'The Herb Garden',i0:34,j0:26,i1:39,j1:30},
   {id:'fount',n:'The Fountain Court',i0:18,j0:35,i1:26,j1:37},
   {id:'orch',n:'The Orchard Close',i0:34,j0:35,i1:41,j1:42},
   {id:'knot',n:'The Knot Garden',i0:3,j0:36,i1:9,j1:42},
   {id:'start',n:'The Welcome Court',i0:17,j0:39,i1:27,j1:44,doors:4}
  ]};
function gmgRng(seed){let a=(seed*2654435761)>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
/* the cell rectangle of a room (inclusive) */
function gmgRect(r){return {x0:2*r.i0+1,y0:2*r.j0+1,x1:2*r.i1+1,y1:2*r.j1+1}}
function gmgBuild(seed){
  const N=GMG.N,W=GMG.W,H=GMG.H,R=gmgRng(seed),rooms=GMG.ROOMS,nr=rooms.length,NN=N*N,D=[[0,-1],[1,0],[0,1],[-1,0]];
  const unit=new Int32Array(NN);for(let n=0;n<NN;n++)unit[n]=n;
  for(const b of (GMG.BARRIERS||[]))for(let i=0;i<N;i++)if(i<b.gap[0]||i>b.gap[1])unit[b.j*N+i]=-1;
  rooms.forEach((r,ri)=>{for(let j=r.j0;j<=r.j1;j++)for(let i=r.i0;i<=r.i1;i++)unit[j*N+i]=r.secret?-1:NN+ri});
  const visited=new Uint8Array(NN+nr),doors=new Int16Array(nr),dirIn=new Int8Array(NN+nr).fill(-1);
  const bE=rooms.map(()=>[]);
  rooms.forEach((r,ri)=>{if(r.secret)return;for(let j=r.j0;j<=r.j1;j++)for(let i=r.i0;i<=r.i1;i++){const a=j*N+i;
    for(let d=0;d<4;d++){const ni=i+D[d][0],nj=j+D[d][1];if(ni<0||nj<0||ni>=N||nj>=N)continue;const b=nj*N+ni;if(unit[b]===NN+ri||unit[b]<0)continue;bE[ri].push([a,b,d])}}});
  const edges=[],has=new Set(),key=(a,b)=>a<b?a*NN+b:b*NN+a;
  const link=(a,b)=>{const k=key(a,b);if(has.has(k))return false;has.add(k);edges.push([a,b]);return true};
  const startRi=rooms.findIndex(r=>r.id==="start"),maxD=ri=>rooms[ri].doors||(GMG.DOORS||3);
  const exitRi=rooms.findIndex(r=>r.id==='exit');visited[NN+exitRi]=1; // the far end is joined last, at the end of the longest walk
  const stack=[NN+startRi];visited[NN+startRi]=1;
  while(stack.length){
    const u=stack[stack.length-1];let cand=[];
    if(u<NN){const i=u%N,j=(u/N)|0;for(let d=0;d<4;d++){const ni=i+D[d][0],nj=j+D[d][1];if(ni<0||nj<0||ni>=N||nj>=N)continue;const b=nj*N+ni;if(unit[b]<0||visited[unit[b]])continue;cand.push([u,b,d])}}
    else{const ri=u-NN;if(doors[ri]<maxD(ri))cand=bE[ri].filter(e=>!visited[unit[e[1]]])}
    if(!cand.length){stack.pop();continue}
    let e=cand[(R()*cand.length)|0];
    if(u<NN&&dirIn[u]>=0){const st=cand.filter(c=>c[2]===dirIn[u]);if(st.length&&R()<(GMG.STRAIGHT||.6))e=st[0]}
    const [a,b,d]=e,ub=unit[b];link(a,b);visited[ub]=1;dirIn[ub]=d;
    if(u>=NN)doors[u-NN]++;if(ub>=NN)doors[ub-NN]++;stack.push(ub)}
  {const adj=new Map();const ad=(a,b)=>{(adj.get(a)||adj.set(a,[]).get(a)).push(b)};for(const [a,b] of edges){ad(a,b);ad(b,a)}
    const sU=NN+startRi,sNode=(rooms[startRi].j1*N+rooms[startRi].i1),dd=new Map([[sNode,0]]),qq=[sNode];
    // distance over nodes (a room counts as its nodes joined: walk inside a room from any node to any other)
    const inRoom=a=>unit[a]>=NN?unit[a]-NN:-1;
    for(let qi=0;qi<qq.length;qi++){const a=qq[qi],da=dd.get(a);for(const b of (adj.get(a)||[])){if(!dd.has(b)){dd.set(b,da+1);qq.push(b)}}
      const ra=inRoom(a);if(ra>=0){const r=rooms[ra];for(let j=r.j0;j<=r.j1;j++)for(let i=r.i0;i<=r.i1;i++){const b=j*N+i;if(!dd.has(b)){dd.set(b,da+Math.abs(i-a%N)+Math.abs(j-((a/N)|0)));qq.push(b)}}}}
    let best=null;for(const e of bE[exitRi]){const d=dd.get(e[1]);if(d===undefined)continue;if(!best||d>best.d)best={d,e}}
    if(best){link(best.e[0],best.e[1]);doors[exitRi]++}
    // exit gets one more door only when it is close to the first (never a short cut)
  }
  // anything the limited doors left out is joined by any neighbour that has been reached
  for(let guard=0;guard<NN;guard++){let fixed=false;
    for(let a=0;a<NN&&!fixed;a++){const ua=unit[a];if(ua<0||ua>=NN||visited[ua])continue;const i=a%N,j=(a/N)|0;
      for(let d=0;d<4;d++){const ni=i+D[d][0],nj=j+D[d][1];if(ni<0||nj<0||ni>=N||nj>=N)continue;const b=nj*N+ni,ub=unit[b];if(ub<0||!visited[ub])continue;
        link(a,b);visited[ua]=1;if(ub>=NN)doors[ub-NN]++;fixed=true;break}}
    if(!fixed)break}
  // a few loops between corridor nodes, and one more door for the rooms that have fewer than four
  for(let a=0;a<NN;a++){if(unit[a]!==a||!visited[a])continue;const i=a%N,j=(a/N)|0;for(const d of [1,2]){const ni=i+D[d][0],nj=j+D[d][1];if(ni>=N||nj>=N)continue;const b=nj*N+ni;if(unit[b]!==b||!visited[b])continue;if(R()<.03)link(a,b)}}
  rooms.forEach((r,ri)=>{if(r.secret||r.id==='exit'||doors[ri]>=4||R()>.75)return;const c=bE[ri].filter(e=>visited[unit[e[1]]]&&!has.has(key(e[0],e[1])));if(!c.length)return;const e=c[(R()*c.length)|0];link(e[0],e[1]);doors[ri]++});
  // the secret room: one hidden door to the nearest corridor node on the west side
  const secret=[];
  rooms.forEach((r,ri)=>{if(!r.secret)return;const c=[];for(let j=r.j0;j<=r.j1;j++)for(let i=r.i0;i<=r.i1;i++){const a=j*N+i;for(let d=0;d<4;d++){const ni=i+D[d][0],nj=j+D[d][1];if(ni<0||nj<0||ni>=N||nj>=N)continue;const b=nj*N+ni;if(unit[b]<0||!visited[unit[b]])continue;c.push([a,b,d])}}
    if(c.length){const e=c[(R()*c.length)|0];secret.push({room:ri,a:e[0],b:e[1]})}});
  // carve
  const g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const node=(n,ch)=>{g[2*((n/N)|0)+1][2*(n%N)+1]=ch||'.'};
  const doorCells=[];
  rooms.forEach(r=>{const q=gmgRect(r);for(let y=q.y0;y<=q.y1;y++)for(let x=q.x0;x<=q.x1;x++)g[y][x]='.'});
  for(let a=0;a<NN;a++)if(unit[a]===a&&visited[a])node(a);
  for(const [a,b] of edges){const ax=2*(a%N)+1,ay=2*((a/N)|0)+1,bx=2*(b%N)+1,by=2*((b/N)|0)+1;g[(ay+by)>>1][(ax+bx)>>1]='.';
    const ua=unit[a],ub=unit[b];if((ua>=NN)!==(ub>=NN))doorCells.push({x:(ax+bx)>>1,y:(ay+by)>>1,room:(ua>=NN?ua:ub)-NN,dx:ua>=NN?bx-ax:ax-bx,dy:ua>=NN?by-ay:ay-by});else if(ua>=NN&&ub>=NN&&ua!==ub)doorCells.push({x:(ax+bx)>>1,y:(ay+by)>>1,room:ua-NN,room2:ub-NN})}
  const sdoors=[];for(const s of secret){const a=s.a,b=s.b,ax=2*(a%N)+1,ay=2*((a/N)|0)+1,bx=2*(b%N)+1,by=2*((b/N)|0)+1;const x=(ax+bx)>>1,y=(ay+by)>>1;g[y][x]='.';node(b);sdoors.push({x,y,room:s.room,outside:{x:bx,y:by}})}
  // the walk from the start to the far end, in steps
  const st=rooms[startRi],q0=gmgRect(st),sx=(q0.x0+q0.x1)>>1,sy=q0.y1,ex=45,ey=1;
  const dist=new Int32Array(W*H).fill(-1),Q=[sy*W+sx];dist[Q[0]]=0;
  for(let qi=0;qi<Q.length;qi++){const c=Q[qi],x=c%W,y=(c/W)|0;for(const [dx,dy] of D){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||dist[ny*W+nx]>=0)continue;dist[ny*W+nx]=dist[c]+1;Q.push(ny*W+nx)}}
  return {seed,g,edges,doors:doorCells,sdoors,rooms,dist,start:{x:sx,y:sy},exit:{x:ex,y:ey},pathLen:dist[ey*W+ex],open:Q.length,visitedAll:Q.length}}
/* the seed whose walk is nearest to the wanted length (the first one inside the wanted range) */
function gmgPick(){let best=null;for(let s=1;s<=300;s++){const m=gmgBuild(s),L=m.pathLen;if(L<0)continue;
    if(L>=GMG.TARGET[0]&&L<=GMG.TARGET[1])return m;
    const sc=Math.abs(L-(GMG.TARGET[0]+GMG.TARGET[1])/2);if(!best||sc<best.sc)best={sc,m}}
  return best&&best.m}
