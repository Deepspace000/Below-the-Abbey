/* ==========================================================================
   GREYFANG PASS: A CLEAR WAY THROUGH. The route from the west end of the pass to the way out in the east is found once,
   laid down as a trail two squares wide (boulders and rocks cleared off it), marked with a cairn every dozen squares, and drawn on
   the area map as a dashed red line.
   ========================================================================== */
const PASS_ROUTE=(function(){
  const L=LEVELS[22];if(!L||!L.rows||L._route)return L&&L._route||null;
  const rows=L.rows,H=rows.length,W=rows[0].length,st=L.start;let goal=null;
  for(let y=0;y<H&&!goal;y++){const x=rows[y].indexOf('3');if(x>=0)goal=[x,y]}
  if(!goal)return null;
  const prev=new Int32Array(W*H).fill(-1),q=[st.y*W+st.x];prev[q[0]]=-2;
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&(rows[y][x]==='.'||(x===goal[0]&&y===goal[1]));
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;if(x===goal[0]&&y===goal[1])break;
    for(const [dx,dy] of [[1,0],[0,1],[0,-1],[-1,0]]){const nx=x+dx,ny=y+dy,n=ny*W+nx;if(!open(nx,ny)||prev[n]!==-1)continue;prev[n]=c;q.push(n)}}
  const path=[];let c=goal[1]*W+goal[0];if(prev[c]===-1)return null;
  while(c>=0){path.push([c%W,(c/W)|0]);c=prev[c]===-2?-1:prev[c]}path.reverse();
  // the trail, two squares wide: the route and the open squares beside it
  const fm=L.fmap.map(r=>r.split('')),near=new Set();
  for(const [x,y] of path)for(const [dx,dy] of [[0,0],[1,0],[0,1],[-1,0],[0,-1]]){const nx=x+dx,ny=y+dy;if(open(nx,ny)){fm[ny][nx]='1';near.add(nx+','+ny)}}
  L.fmap=fm.map(r=>r.join(''));
  // clear the route and the squares beside it of rocks and boulders
  for(const d of L.decor||[])if(near.has(d.x+','+d.y)&&/boulder|rocks|mossstone|gboulder|grocks|pbracken|pheather|pjuniper/.test(d.k)){d.found=true;d.block=false;d.hidden=true}
  // a cairn beside the route every twelve squares
  const taken=new Set((L.decor||[]).filter(d=>!d.found).map(d=>d.x+','+d.y));
  for(let i=10;i<path.length-4;i+=12){
    const [x,y]=path[i];let put=false;
    for(const [dx,dy] of [[0,-2],[0,2],[2,0],[-2,0],[0,-3],[0,3]]){const nx=x+dx,ny=y+dy;if(open(nx,ny)&&!near.has(nx+','+ny)&&!taken.has(nx+','+ny)){L.decor.push({k:'cairn',x:nx,y:ny,block:true,deco:true});taken.add(nx+','+ny);put=true;break}}
  }
  return L._route={path,goal};
})();
