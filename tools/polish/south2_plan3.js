(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,rows=L.rows;const D=[[0,-1],[1,0],[0,1],[-1,0]];
const op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.';const fi=(a,b)=>D.findIndex(d=>d[0]===a&&d[1]===b);const out=[];
for(const [x,y] of [[55,5],[195,5],[23,11],[57,19],[99,33],[134,39]]){for(const o of D){if(!op(x+o[0],y+o[1]))continue;let s=4;while(s>0&&!op(x+o[0]*s,y+o[1]*s))s--;out.push(['wy_'+x+'_'+y,x+o[0]*s,y+o[1]*s,fi(-o[0],-o[1])]);break}}
return out})()
