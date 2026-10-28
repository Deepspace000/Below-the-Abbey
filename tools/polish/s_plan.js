(()=>{const L=LEVELS[475],rows=L.rows,op=(x,y)=>rows[y]&&rows[y][x]==='.',D=[[0,-1],[1,0],[0,1],[-1,0]];const fi=(a,b)=>D.findIndex(d=>d[0]===a&&d[1]===b);const out=[];
const back=(d,n)=>{for(let s=n;s>=0;s--){const x=d.x-d.wd[0]*s,y=d.y-d.wd[1]*s;if(op(x,y)){let ok=true;for(let t=1;t<=s;t++)if(!op(d.x-d.wd[0]*t,d.y-d.wd[1]*t))ok=false;if(ok)return [x,y]}}return [d.x,d.y]};
const posts=L.decor.filter(d=>d.npc==='hgdb_post');[0,5,10,15,20].forEach((i,j)=>{const d=posts[i];if(d){const p=back(d,2);out.push(['pp'+j,p[0],p[1],fi(d.wd[0],d.wd[1])])}});
const notes=L.decor.filter(d=>d.npc==='hgdb_note'&&d.k==='hpb_rune');[0,6,12].forEach((i,j)=>{const d=notes[i];if(d){const p=back(d,3);out.push(['pace'+j,p[0],p[1],fi(d.wd[0],d.wd[1])===0?0:fi(d.wd[0],d.wd[1])])}});
const pics=L.decor.filter(d=>d.pic&&/^hpb_(lan|cage)/.test(d.k));[3,40,90,150].forEach((i,j)=>{const d=pics[i];if(d){const p=back(d,3);out.push(['lan'+j,p[0],p[1],fi(d.wd[0],d.wd[1])])}});
return out})()
