(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,o={};o.col=[];for(let y=70;y<=84;y++)o.col.push(y+':'+L.rows[y].slice(166,173).split('').map(c=>c==='.'?'.':c.charCodeAt(0).toString(16)).join(' '));
o.dec=L.decor.filter(d=>Math.abs(d.x-169)<=2&&d.y>=72&&d.y<=82).map(d=>[d.k,d.x,d.y,d.npc||'',d.block?1:0]);o.doors=Object.keys(L.chars).length;return o})()
