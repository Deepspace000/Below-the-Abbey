(()=>{const L=LEVELS[475],rows=L.rows;const out={};out.rows=[0,1,2,3,4,5,6,7].map(y=>rows[y].slice(94,107));
out.codes=[...new Set(rows[1].slice(94,107).split('').map(c=>c.charCodeAt(0).toString(16)))];
out.decorAt=L.decor.filter(d=>d.y<=3&&Math.abs(d.x-100)<=3).map(d=>[d.k,d.x,d.y,d.sc,d.wd||null]);
out.exit=[L.exit,L.start,L.stairs];
return out})()
