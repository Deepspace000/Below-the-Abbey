(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,rows=L.rows;const D=[[0,-1,'North'],[1,0,'East'],[0,1,'South'],[-1,0,'West']];
const op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.';
const T=L._hgpbTargets;const bfs=(sx,sy)=>{const dist=new Int16Array(W*H).fill(-1);const q=[[sx,sy]];dist[sy*W+sx]=0;for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const d of D){const nx=x+d[0],ny=y+d[1];if(op(nx,ny)&&dist[ny*W+nx]<0){dist[ny*W+nx]=dist[y*W+x]+1;q.push([nx,ny])}}}return dist};
const res=[];let bad=0,tot=0;
for(const p of L.decor.filter(d=>d.npc==='hgdb_post')){const m=[...p.pbt.matchAll(/(North|East|South|West): ([A-Za-z ]+?), about (\d+) paces/g)];
 for(const mm of m){const t=T.find(t=>t.n===mm[2]);if(!t)continue;const dist=bfs(t.x,t.y);const di=D.findIndex(d=>d[2]===mm[1]);const nx=p.x+D[di][0],ny=p.y+D[di][1];tot++;
  const here=dist[p.y*W+p.x],via=op(nx,ny)?dist[ny*W+nx]:-9;
  // best way
  let bw=null;for(const d of D){const x=p.x+d[0],y=p.y+d[1];if(op(x,y)&&dist[y*W+x]>=0&&(!bw||dist[y*W+x]<bw[0]))bw=[dist[y*W+x],d[2]]}
  const ok=via>=0&&via<here;const shortest=bw&&bw[1]===mm[1];if(!ok||!shortest){bad++;res.push([p.x,p.y,mm[1],mm[2],+mm[3],here,via,bw])}}}
return {tot,bad,res:res.slice(0,12)}})()
