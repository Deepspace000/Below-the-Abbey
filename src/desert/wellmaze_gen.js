/* ==========================================================================
   THE PURPLE MAZE UNDER THE WELL OF WENLOCK, the maze maker (prefix wmg / WMG). Pure code, no pictures and no page: it runs in node too (tools/wm_test.js).
   A lattice of 21 by 21 nodes (43 by 43 cells, a node is the cell 2i+1,2j+1). Rooms are blocks of nodes cut out of the lattice; the rest is a maze of one-square corridors made
   by a depth-first walk that likes to go straight on. A room is one unit of the walk and is given only a few doors, so a room is a place and not a crossroads.
   A SEALED room is left out of the walk altogether: it is joined to the maze by one door cell (a wall that opens later: a switch, a puzzle, a secret door, a riddle, a key).
   wmgBuild(seed,specs) returns {g,rooms,sdoors,dist,start,...}. A spec is {id,kind,nw,nh,sealed,fixed:[i0,j0],zone:[x0,x1,y0,y1] (fractions of the lattice),maxDoors}.
   ========================================================================== */
const WMG={N:21,W:43,H:43};
function wmgRng(seed){let a=(seed*2654435761)>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function wmgBuild(seed,specs,opt){
  opt=opt||{};const N=WMG.N,W=WMG.W,H=WMG.H,R=wmgRng(seed),NN=N*N,D=[[0,-1],[1,0],[0,1],[-1,0]],straight=opt.straight===undefined?.62:opt.straight;
  const unit=new Int32Array(NN);for(let n=0;n<NN;n++)unit[n]=n;
  const rooms=[],occ=new Uint8Array(NN);
  const fits=(i0,j0,nw,nh,gap)=>{if(i0<0||j0<0||i0+nw>N||j0+nh>N)return false;for(let j=j0-gap;j<j0+nh+gap;j++)for(let i=i0-gap;i<i0+nw+gap;i++)if(i>=0&&j>=0&&i<N&&j<N&&occ[j*N+i])return false;return true};
  specs.forEach(sp=>{let ok=false,i0=0,j0=0;
    if(sp.fixed){i0=sp.fixed[0];j0=sp.fixed[1];ok=fits(i0,j0,sp.nw,sp.nh,0)}
    else for(let t=0;t<600&&!ok;t++){const z=sp.zone||[0,1,0,1],gap=t<300?1:0;
      i0=Math.floor((z[0]*(N-sp.nw)+R()*(z[1]-z[0])*(N-sp.nw)));j0=Math.floor((z[2]*(N-sp.nh)+R()*(z[3]-z[2])*(N-sp.nh)));ok=fits(i0,j0,sp.nw,sp.nh,gap)}
    if(!ok)throw new Error('wmg: no place for room '+sp.id);
    const ri=rooms.length;rooms.push(Object.assign({},sp,{ri,i0,j0,i1:i0+sp.nw-1,j1:j0+sp.nh-1,x0:2*i0+1,y0:2*j0+1,x1:2*(i0+sp.nw-1)+1,y1:2*(j0+sp.nh-1)+1,doors:0}));
    for(let j=j0;j<j0+sp.nh;j++)for(let i=i0;i<i0+sp.nw;i++){occ[j*N+i]=1;unit[j*N+i]=sp.sealed?-1:NN+ri}});
  const nr=rooms.length,visited=new Uint8Array(NN+nr),dirIn=new Int8Array(NN+nr).fill(-1),edges=[],has=new Set();
  const key=(a,b)=>a<b?a*NN+b:b*NN+a,link=(a,b)=>{const k=key(a,b);if(has.has(k))return false;has.add(k);edges.push([a,b]);return true};
  const bE=rooms.map(()=>[]);
  rooms.forEach((r,ri)=>{if(r.sealed)return;for(let j=r.j0;j<=r.j1;j++)for(let i=r.i0;i<=r.i1;i++){const a=j*N+i;
    for(let d=0;d<4;d++){const ni=i+D[d][0],nj=j+D[d][1];if(ni<0||nj<0||ni>=N||nj>=N)continue;const b=nj*N+ni;if(unit[b]===NN+ri||unit[b]<0)continue;bE[ri].push([a,b,d])}}});
  const maxD=ri=>rooms[ri].maxDoors||(opt.doors||3);
  const startRi=rooms.findIndex(r=>r.kind==='start');if(startRi<0)throw new Error('wmg: no start room');
  const stack=[NN+startRi];visited[NN+startRi]=1;
  while(stack.length){
    const u=stack[stack.length-1];let cand=[];
    if(u<NN){const i=u%N,j=(u/N)|0;for(let d=0;d<4;d++){const ni=i+D[d][0],nj=j+D[d][1];if(ni<0||nj<0||ni>=N||nj>=N)continue;const b=nj*N+ni;if(unit[b]<0||visited[unit[b]])continue;cand.push([u,b,d])}}
    else{const ri=u-NN;if(rooms[ri].doors<maxD(ri))cand=bE[ri].filter(e=>!visited[unit[e[1]]])}
    if(!cand.length){stack.pop();continue}
    let e=cand[(R()*cand.length)|0];
    if(u<NN&&dirIn[u]>=0){const st=cand.filter(c=>c[2]===dirIn[u]);if(st.length&&R()<straight)e=st[0]}
    const [a,b,d]=e,ub=unit[b];link(a,b);visited[ub]=1;dirIn[ub]=d;
    if(u>=NN)rooms[u-NN].doors++;if(ub>=NN)rooms[ub-NN].doors++;stack.push(ub)}
  // anything the limited doors left out is joined by any neighbour that has been reached
  for(let guard=0;guard<NN*2;guard++){let fixed=false;
    for(let a=0;a<NN&&!fixed;a++){const ua=unit[a];if(ua<0||ua>=NN||visited[ua])continue;const i=a%N,j=(a/N)|0;
      for(let d=0;d<4;d++){const ni=i+D[d][0],nj=j+D[d][1];if(ni<0||nj<0||ni>=N||nj>=N)continue;const b=nj*N+ni,ub=unit[b];if(ub<0||!visited[ub])continue;
        link(a,b);visited[ua]=1;if(ub>=NN)rooms[ub-NN].doors++;fixed=true;break}}
    if(!fixed)break}
  // rooms never reached (boxed in by other rooms): join them to any neighbour
  rooms.forEach((r,ri)=>{if(r.sealed||visited[NN+ri])return;const c=bE[ri].filter(e=>visited[unit[e[1]]]);if(c.length){const e=c[0];link(e[0],e[1]);visited[NN+ri]=1;r.doors++}});
  // a few loops between corridor nodes, and one more door for the rooms that have fewer than two
  const loopP=opt.loops===undefined?.035:opt.loops;
  for(let a=0;a<NN;a++){if(unit[a]!==a||!visited[a])continue;const i=a%N,j=(a/N)|0;for(const d of [1,2]){const ni=i+D[d][0],nj=j+D[d][1];if(ni>=N||nj>=N)continue;const b=nj*N+ni;if(unit[b]!==b||!visited[b])continue;if(R()<loopP)link(a,b)}}
  rooms.forEach((r,ri)=>{if(r.sealed||r.doors>=2||r.kind==='start'||r.kind==='stairOut'||R()>.6)return;const c=bE[ri].filter(e=>visited[unit[e[1]]]&&!has.has(key(e[0],e[1])));if(!c.length)return;const e=c[(R()*c.length)|0];link(e[0],e[1]);r.doors++});
  // carve
  const g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const node=(n)=>{g[2*((n/N)|0)+1][2*(n%N)+1]='.'};
  for(const r of rooms){if(r.sealed)continue;for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)g[y][x]='.'}
  for(let a=0;a<NN;a++)if(unit[a]===a&&visited[a])node(a);
  for(const [a,b] of edges){const ax=2*(a%N)+1,ay=2*((a/N)|0)+1,bx=2*(b%N)+1,by=2*((b/N)|0)+1;g[(ay+by)>>1][(ax+bx)>>1]='.'}
  // sealed rooms: carved too, joined by one door cell (still wall; the builder gives it a door tile)
  const sdoors=[];
  rooms.forEach((r,ri)=>{if(!r.sealed)return;for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)g[y][x]='.';
    if(r.noDoor)return;
    const c=[];for(let j=r.j0;j<=r.j1;j++)for(let i=r.i0;i<=r.i1;i++){for(let d=0;d<4;d++){const ni=i+D[d][0],nj=j+D[d][1];if(ni<0||nj<0||ni>=N||nj>=N)continue;const b=nj*N+ni;if(unit[b]<0||!visited[unit[b]])continue;
      const ax=2*i+1,ay=2*j+1,bx=2*ni+1,by=2*nj+1;c.push({x:(ax+bx)>>1,y:(ay+by)>>1,room:ri,inside:{x:ax,y:ay},outside:{x:bx,y:by},d})}}
    if(!c.length)throw new Error('wmg: sealed room '+r.id+' has no neighbour');
    const pick=r.doorAt?c.filter(q=>Math.hypot(q.outside.x-r.doorAt[0],q.outside.y-r.doorAt[1])<(r.doorAt[2]||6)):c;
    const q=(pick.length?pick:c)[(R()*(pick.length?pick:c).length)|0];sdoors.push(q);r.door=q})
  // distances from the start (sealed doors count as open)
  const sr=rooms[startRi],start={x:(sr.x0+sr.x1)>>1,y:(sr.y0+sr.y1)>>1};
  const dist=new Int32Array(W*H).fill(-1),Q=[start.y*W+start.x],open=(x,y)=>g[y][x]==='.'||sdoors.some(q=>q.x===x&&q.y===y);dist[Q[0]]=0;
  const sdSet=new Set(sdoors.map(q=>q.x+','+q.y));
  for(let qi=0;qi<Q.length;qi++){const c=Q[qi],x=c%W,y=(c/W)|0;for(const [dx,dy] of D){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||dist[ny*W+nx]>=0)continue;if(g[ny][nx]!=='.'&&!sdSet.has(nx+','+ny))continue;dist[ny*W+nx]=dist[c]+1;Q.push(ny*W+nx)}}
  let floors=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y][x]==='.')floors++;
  return {seed,g,rooms,sdoors,edges,dist,start,floors,reached:Q.length-sdoors.length,visitedAll:Q.length}}
