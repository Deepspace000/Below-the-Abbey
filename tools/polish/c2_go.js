([tx,ty,want])=>{const L=LEVELS[475],op=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';const bl=new Set(G.decor.filter(d=>d.block&&!d.found).map(d=>d.x+','+d.y));
 const dirs=[[0,-1,0],[1,0,1],[0,1,2],[-1,0,3]];let best=null;
 for(const dist of [3,2,4,1])for(const [dx,dy,f] of dirs){let ok=true;for(let i=1;i<=dist;i++){const x=tx-dx*i,y=ty-dy*i;if(!op(x,y)||bl.has(x+','+y))ok=false}
   if(ok&&!best)best=[tx-dx*dist,ty-dy*dist,f]}
 if(!best)best=[tx,ty,0];if(want!==null&&want!==undefined){const [dx,dy]=dirs[want];let ok=true;for(let i=1;i<=3;i++){const x=tx-dx*i,y=ty-dy*i;if(!op(x,y)||bl.has(x+','+y))ok=false}if(ok)best=[tx-dx*3,ty-dy*3,want]}
 G.P.x=best[0];G.P.y=best[1];G.P.f=best[2];G.P.angT=(best[2]-1)*Math.PI/2;G.C={x:best[0],y:best[1],a:G.P.angT};G.lvlBanners.length=0;G.msgs=[];G.talk=null;return best}