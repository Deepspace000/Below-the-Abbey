(()=>{const L=LEVELS[475],rows=L.rows;const out={};
const r=(x0,y0)=>{const o=[];for(let y=y0-2;y<=y0+2;y++)o.push(rows[y].slice(x0-6,x0+7).replace(/[^.]/g,'#'));return o};
out.map=r(54,11);
out.near=L.decor.filter(d=>Math.abs(d.x-53)<=2&&Math.abs(d.y-11)<=2).map(d=>[d.k,d.x,d.y,d.sc,d.wd||null]);
out.items=L.items.filter(d=>Math.abs(d.x-53)<=3&&Math.abs(d.y-11)<=3).map(d=>[d.x,d.y,d.t||d.k]);
out.q9=L.decor.filter(d=>d.npc==='hgd_q9'||d.npc==='hgd_hermit').map(d=>[d.npc,d.x,d.y]);
return out})()
