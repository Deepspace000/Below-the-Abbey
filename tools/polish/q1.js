()=>{const L=LEVELS[475],M=L._hgdm,W=M.W;const c={};for(const d of L.decor){if(d.pic){c[d.k]=(c[d.k]||0)+1}}
const w=[];for(const k in IMG){if(/wall|sconce|banner|hang|tapestry|mural|decal/i.test(k))w.push(k)}
return {pic:c,w:w.slice(0,120),en:L.enemies.filter(e=>Math.hypot(e.x-101,e.y-95)<6).map(e=>[e.t,e.x,e.y]),start:L.start,chars:Object.keys(L.chars||{}).map(c=>c.charCodeAt(0).toString(16))}}
