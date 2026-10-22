/* ==========================================================================
   BUTTERFLY MEADOWS. Butterflies no longer drift about anywhere: every area where they fly has one patch, about a tenth of the walkable ground, joined to the rest of the map so the
   party can walk to it, and they live only there. The Deeper Hollow maze has a patch in each of its four quarters (a tenth of each quarter). Needs the butterfly cage as before.
   (prefix bfp; wraps bfFree and bfTick of the butterfly code)
   ========================================================================== */
const BFP={};
function bfpBuild(n){
  if(BFP[n])return BFP[n];const L=LEVELS[n];if(!L||!L.rows)return null;
  const rows=L.rows,H=rows.length,W=rows[0].length,out={W,H,mask:new Uint8Array(W*H),list:[],patches:0};BFP[n]=out;
  const st=L.start||L._start||{x:G.P.x,y:G.P.y},reach=new Uint8Array(W*H),q=[];let sx=st.x|0,sy=st.y|0;
  if(!rows[sy]||rows[sy][sx]!=='.'){let best=1e9;for(let y=0;y<H;y+=2)for(let x=0;x<W;x+=2)if(rows[y][x]==='.'){const d=Math.hypot(x-G.P.x,y-G.P.y);if(d<best){best=d;sx=x;sy=y}}}
  reach[sy*W+sx]=1;q.push(sy*W+sx);
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||reach[ny*W+nx]||rows[ny][nx]!=='.')continue;reach[ny*W+nx]=1;q.push(ny*W+nx)}}
  if(q.length<60)return out;
  const maze=n===475&&L._hgdp,danger=maze?L._hgdp.zones.filter(z=>z.type==='danger'):[];
  const inDanger=(x,y)=>danger.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r+2);
  const regions=maze?[[0,0,101,101],[100,0,101,101],[0,100,101,101],[100,100,101,101]]:[[0,0,W,H]];
  regions.forEach((R,ri)=>{
    const inR=(x,y)=>x>=R[0]&&x<R[0]+R[2]&&y>=R[1]&&y<R[1]+R[3];
    const cells=[];for(const c of q){const x=c%W,y=(c/W)|0;if(inR(x,y)&&!(maze&&inDanger(x,y)))cells.push(c)}
    if(cells.length<40)return;
    let regionAll=0;for(const c of q){const x=c%W,y=(c/W)|0;if(inR(x,y))regionAll++}const target=Math.max(30,Math.round(Math.max(regionAll,cells.length)*.10));
    const open9=c=>{const x=c%W,y=(c/W)|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(!rows[y+dy]||rows[y+dy][x+dx]!=='.')return false;return true};
    let cand=cells.filter(open9);if(!cand.length)cand=cells;
    const seed=cand[Math.floor(hash2(n,ri+3,55)*cand.length)%cand.length];
    // grow outward from the seed over walkable ground until a tenth of the region is covered
    const inCells=new Set(cells),got=new Set([seed]),qq=[seed];
    for(let i=0;i<qq.length&&got.size<target;i++){const c=qq[i],x=c%W,y=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nc=(y+dy)*W+(x+dx);if(got.has(nc)||!inCells.has(nc))continue;got.add(nc);qq.push(nc);if(got.size>=target)break}}
    for(const c of got){out.mask[c]=1;out.list.push([c%W,(c/W)|0])}out.patches++});
  return out}
function bfpIn(n,x,y){const P=bfpBuild(n);return !!P&&P.W>0&&x>=0&&y>=0&&x<P.W&&y<P.H&&P.mask[y*P.W+x]===1}
{const _bf=bfFree;bfFree=function(L,x,y){return _bf.apply(this,arguments)&&bfpIn(LEVEL,Math.round(x),Math.round(y))}}
{const _bt=bfTick;bfTick=function(dt){
  const L=LEVELS[LEVEL];if(!L||!L.rows)return _bt.call(this,dt);
  const maze=LEVEL===475&&G.state==='play';let o;if(maze){o=L.day;L.day=1} // (the maze is indoors, yet butterflies live there)
  try{
    G._bfT=-1e6; // the old spawner (a ring round the party, anywhere) is off; the meadow spawner follows
    _bt.call(this,dt);
    const ok=!L.khRoom&&G.state==='play'&&bagCount('butterflycage')>=1&&!hostileNear()&&(L.outdoor||L.day>0);
    if(!ok)return;
    const P=bfpBuild(LEVEL);if(!P||!P.list.length)return;
    G._bfpT=(G._bfpT||0)+dt;if(G._bfpT<1.2||BFS.length>=(maze?5:4))return;G._bfpT=0;
    const px=G.P.x+.5,py=G.P.y+.5,rating=(typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[LEVEL])||L.diff||1;
    for(let t=0;t<80;t++){const c=P.list[(Math.random()*P.list.length)|0],x=c[0]+.5,y=c[1]+.5,d=Math.hypot(x-px,y-py);if(d<3.5||d>16)continue;
      if(BFS.some(b=>Math.hypot(b.x-x,b.y-y)<1.5))continue;
      const k=bfPick(rating);BFS.push({lvl:LEVEL,k:k[0],name:k[1],v:k[2],rare:k[2]>=60?1:k[2]>=28?.5:0,x,y,tx:x,ty:y,ph:Math.random()*6.28,t:Math.random()*4,e:{t:'bfly',x:0,y:0,hp:1}});break}
  }finally{if(maze)L.day=o}}}
