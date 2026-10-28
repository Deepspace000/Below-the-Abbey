(()=>{const L=LEVELS[475];const near=(x,y,r)=>({dec:L.decor.filter(d=>Math.hypot(d.x-x,d.y-y)<=r).map(d=>[d.k,d.x,d.y,d.sc,d.npc||'',d.pic?1:0]),en:L.enemies.filter(e=>Math.hypot(e.x-x,e.y-y)<=r).map(e=>[e.t,e.x,e.y]),ge:(G.enemies||[]).filter(e=>Math.hypot(e.x-x,e.y-y)<=6).map(e=>[e.t,e.x,e.y])});
return {h:near(150,71,4)}})()
