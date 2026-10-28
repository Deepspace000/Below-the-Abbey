(()=>{const L=LEVELS[475],rows=L.rows,op=(x,y)=>rows[y]&&rows[y][x]==='.',D=[[0,-1],[1,0],[0,1],[-1,0]];const out=[];
const fi=(a,b)=>D.findIndex(d=>d[0]===a&&d[1]===b);
const viewDE=(name,x,y)=>{const ob=D.find(([a,b])=>op(x+a,y+b));if(!ob)return;let s=4;while(s>0&&!op(x+ob[0]*s,y+ob[1]*s))s--;out.push([name,x+ob[0]*s,y+ob[1]*s,fi(-ob[0],-ob[1])])};
viewDE('de1',5,4);viewDE('de5',21,62);viewDE('de3',6,37);
const M=L._hgdm,W=M.W;let n=0;for(let y=2;y<M.H-2&&n<5;y+=17)for(let x=2;x<W-2&&n<5;x+=23){if(M.bio[y*W+x]<4||!op(x,y))continue;let c=0;for(const [a,b] of D)if(op(x+a,y+b))c++;if(c===1){viewDE('dex'+n,x,y);n++}}
// long runs: look along them from one end
for(const [nm,x,y,f] of [['long4',71,49,3],['long5',25,27,0],['long6',103,27,1],['long7',137,17,2]]){for(const f2 of [0,1,2,3]){const [a,b]=D[f2];let k=0;while(op(x+a*k,y+b*k))k++;if(k>20){out.push([nm,x,y,f2]);break}}}
return out})()
