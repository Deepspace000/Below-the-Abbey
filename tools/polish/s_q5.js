(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,rows=L.rows,op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.';const D=[[0,-1],[1,0],[0,1],[-1,0]];
const lw=new Int16Array(W*H).fill(9999),lq=[];for(const l of L.lights)if(op(l[0],l[1])){lw[l[1]*W+l[0]]=0;lq.push([l[0],l[1]])}
for(let i=0;i<lq.length;i++){const [x,y]=lq[i],dd=lw[y*W+x];if(dd>=20)continue;for(const [a,b] of D){const nx=x+a,ny=y+b;if(op(nx,ny)&&lw[ny*W+nx]>dd+1){lw[ny*W+nx]=dd+1;lq.push([nx,ny])}}}
const far=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(M.bio[y*W+x]===4&&op(x,y)&&lw[y*W+x]>9)far.push([x,y,lw[y*W+x]]);
const o={n:far.length,s:far.filter((v,i)=>i%60===0).slice(0,10)};o.nonopLights=L.lights.filter(l=>!op(l[0],l[1])).length;o.total=L.lights.length;o.zonelights=L.lights.filter(l=>M.bio[l[1]*W+l[0]]===4).length;
const reach=far.length&&far[0];return o})()
