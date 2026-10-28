(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,rows=L.rows;const D=[[0,-1,'North'],[1,0,'East'],[0,1,'South'],[-1,0,'West']];
const op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.';
const zs=(L._hgdp.zones||[]).filter(z=>z.town!==undefined&&z.town!==null);
const out={zones:zs.map(z=>[z.name,z.x,z.y])};
const res=[];
for(const d of L.decor.filter(d=>d.npc==='hgdb_post').slice(0,12)){
 // BFS from post
 const dist=new Int16Array(W*H).fill(-1),first=new Int8Array(W*H).fill(-1);const q=[[d.x,d.y]];dist[d.y*W+d.x]=0;
 for(let i=0;i<q.length;i++){const [x,y]=q[i];for(let k=0;k<4;k++){const nx=x+D[k][0],ny=y+D[k][1];if(op(nx,ny)&&dist[ny*W+nx]<0){dist[ny*W+nx]=dist[y*W+x]+1;first[ny*W+nx]=i===0?k:first[y*W+x];q.push([nx,ny])}}}
 const lines=[];const m=[...d.pbt.matchAll(/(North|East|South|West): ([A-Za-z ]+?), about (\d+) paces/g)];
 for(const mm of m){const z=zs.find(z=>z.name===mm[2])||(mm[2]==='The Great Atrium'?{x:100,y:20}:null);if(!z){lines.push([mm[2],'?']);continue}
  let best=null;for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const x=z.x+a,y=z.y+b;if(op(x,y)&&dist[y*W+x]>=0&&(!best||dist[y*W+x]<best[0]))best=[dist[y*W+x],D[first[y*W+x]]?D[first[y*W+x]][2]:'-']}
  lines.push([mm[1],mm[2],+mm[3],best])}
 res.push([d.x,d.y,lines])}
out.res=res;return out})()
