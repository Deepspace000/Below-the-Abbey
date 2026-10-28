()=>{const L=LEVELS[477];const E=L._hgdwe,P=E.vignettes.map(v=>[v.x,v.y]);const m=e=>Math.min(...P.map(q=>Math.hypot(q[0]-e.x,q[1]-e.y)));
const a=L.enemies.filter(e=>m(e)<6).length;const g=(G.enemies||[]).filter(e=>m(e)<6).length;
return {a,g,n:L.enemies.length,gn:(G.enemies||[]).length,same:L.enemies===ENEMY_SPAWNS,e0:L.enemies[0],g0:G.enemies&&G.enemies[0]&&[G.enemies[0].x,G.enemies[0].y,G.enemies[0].t]}}
