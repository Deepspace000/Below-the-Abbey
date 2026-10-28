(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,rows=L.rows;const D=[[0,-1],[1,0],[0,1],[-1,0]];
const op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.';const fi=(a,b)=>D.findIndex(d=>d[0]===a&&d[1]===b);const out=[];
for(const d of L.decor.filter(d=>d.npc==='hgdb_post').filter((_,i)=>i%5===0).slice(0,5)){const o=d.wd;let s=3;while(s>0&&!op(d.x-o[0]*s,d.y-o[1]*s))s--;out.push(['pv_'+d.x+'_'+d.y,d.x-o[0]*s,d.y-o[1]*s,fi(o[0],o[1])])}
const wy=L.decor.filter(d=>d._pbv&&!d.pic&&d.k&&/bench|brazier|cart|bell|crate|cask|pack/.test(d.k));out.push(['wayinfo',wy.length,wy.slice(0,12).map(d=>[d.k,d.x,d.y,d._pbv])]);
return out})()
