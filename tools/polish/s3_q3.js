(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,o={};o.col=[];for(let y=10;y<=27;y++){o.col.push([y,L.rows[y][102].charCodeAt(0).toString(16),L.rows[y][103].charCodeAt(0).toString(16),L.rows[y][104].charCodeAt(0).toString(16),M.bio[y*W+103]])}
o.lights=L.lights.filter(l=>Math.abs(l[0]-103)<4&&l[1]<30&&l[1]>8);o.chars=Object.keys(L.chars).map(c=>c.charCodeAt(0).toString(16)).join(',');return o})()
