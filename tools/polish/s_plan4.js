(()=>{const L=LEVELS[475],rows=L.rows,D=[[0,-1],[1,0],[0,1],[-1,0]];const isW=c=>!c||c==='#'||(c!=='.'&&c.charCodeAt(0)>=0x2e0&&c.charCodeAt(0)<0x2e8);const ps=(x,y)=>rows[y]&&!isW(rows[y][x]);const out=[];
const fi=(a,b)=>D.findIndex(d=>d[0]===a&&d[1]===b);
const ds=L.decor.filter(d=>d._pbv&&!d.pic&&!d.ox&&!d.oy&&/^hpb_(cage|bucket|lid|barrel|cask|keg|candle|bell|skel|orecart|crate|gold|tools|minecart)$/.test(d.k));
const take=[0,4,8,12,16,20,24,28];take.forEach((i,j)=>{const d=ds[i];if(!d)return;const op=D.filter(([a,b])=>ps(d.x+a,d.y+b));if(op.length!==1)return;const [a,b]=op[0];let s=0;while(s<4&&ps(d.x+a*(s+1),d.y+b*(s+1)))s++;out.push(['de_'+d.k.slice(4)+j,d.x+a*s,d.y+b*s,fi(-a,-b)])});
return out})()
