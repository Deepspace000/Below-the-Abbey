(()=>{const L=LEVELS[475],rows=L.rows,op=(x,y)=>rows[y]&&rows[y][x]==='.';const out=[];
const kits=L.decor.filter(d=>d._pbv&&!d.pic&&(d.ox||d.oy)&&/^(art_hgtb_bench|hpb_brazier|hpb_minecart|hpb_bell|hpb_barrel|art_hgxstat)/.test(d.k)&&Math.abs(d.ox||d.oy)>.25);
const seen=new Set();let n=0;for(const d of kits){const key=d.x+','+d.y;if(seen.has(key))continue;seen.add(key);if(n>=9)break;if((n++%1)!==0)continue}
const pick=[];const seen2=new Set();for(const d of kits){const key=d.x+','+d.y;if(seen2.has(key))continue;seen2.add(key);pick.push(d)}
[0,2,4,6,8,10,12,14,16].forEach((i,j)=>{const d=pick[i];if(!d)return;const vert=Math.abs(d.ox||0)>Math.abs(d.oy||0);let s=4;const dirs=vert?[[0,-1,2],[0,1,0]]:[[-1,0,1],[1,0,3]];for(const [a,b,f] of dirs){let k=4;while(k>0&&!op(d.x+a*k,d.y+b*k))k--;if(k>=2){out.push(['way'+j+'_'+d.k.replace(/[^a-z]/g,''),d.x+a*k,d.y+b*k,f]);break}}});
return out})()
