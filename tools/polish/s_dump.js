(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,Z=(x,y)=>M.bio[y*W+x]>=4;const out={};
out.prec=M.prec.map((p,i)=>[i,p.b,p.name,p.x,p.y]).filter(p=>p[1]>=4);
out.gates=L.decor.filter(d=>d.k==='gate'&&Z(d.x,d.y)).map(d=>[d.x,d.y,d.npc,d.zone,d.sc]).slice(0,60);
out.givers=L.decor.filter(d=>Z(d.x,d.y)&&d.npc&&!d.pic&&!/^hgdb_|hgd_note|hgd_sign|hgd_plaque/.test(d.npc)).map(d=>[d.k,d.x,d.y,d.npc,d.sc||1]);
out.notes=HGDF_NOTES.map((t,i)=>i+': '+t.slice(0,90));
out.noteUse=L.decor.filter(d=>d.npc==='hgd_note'&&Z(d.x,d.y)).map(d=>[d.note,d.x,d.y,M.bio[d.y*W+d.x]]);
out.spots=M.spots.filter(s=>s.x>=0&&Z(s.x,s.y)).map(s=>[s.type,s.x,s.y,!!s.boss]).slice(0,80);
out.bioCount=[4,5,6,7].map(b=>{let n=0;for(let i=0;i<W*H;i++)if(M.bio[i]===b&&L.rows[(i/W)|0][i%W]==='.')n++;return [b,n]});
out.enemiesNearGiver=[];for(const g of out.givers)for(const e of L.enemies)if(Math.hypot(e.x-g[1],e.y-g[2])<3.5)out.enemiesNearGiver.push([g[3],g[1],g[2],e.t,e.x,e.y]);
out.lampsNearGiver=[];for(const g of out.givers)for(const d of L.decor)if(!d.npc&&!d.pic&&Math.hypot(d.x-g[1],d.y-g[2])<1.5&&NPC_H[d.k]>.7)out.lampsNearGiver.push([g[3],g[1],g[2],d.k,d.x,d.y]);
out.startXY=[L.start.x,L.start.y,L.start.f];
return out})()
