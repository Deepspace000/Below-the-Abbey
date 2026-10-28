()=>{const L=LEVELS[477],open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.',E=L._hgdwe;let tot=0,ok6=0,ok5=0;const P=E.vignettes.map(v=>[v.x,v.y]);
for(let y=1;y<41;y++)for(let x=1;x<41;x++){if(!open(x,y))continue;tot++;const m=Math.min(...P.map(q=>Math.hypot(q[0]-x,q[1]-y)));if(m>=6)ok6++;if(m>=5)ok5++}
const en=L.enemies.map(e=>[e.t.slice(3),e.x,e.y,+Math.min(...P.map(q=>Math.hypot(q[0]-e.x,q[1]-e.y))).toFixed(1)]).filter(e=>e[3]<6);
return {tot,ok6,ok5,bad:en.length,en}}
