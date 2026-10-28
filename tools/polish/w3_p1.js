()=>{const L=LEVELS[475];const o={look:HGTE.look[475]||null,isHg:typeof hgtIsLook==='function'?hgtIsLook(475):null,rows:L.rows.length,w:L.rows[0].length};
 o.lakes=L._hgdl.lakes.map(k=>({i:k.i,wm:k.wm,box:[k.x0,k.y0,k.x1,k.y1],docks:k.docks&&{dep:k.docks.dep,far:k.docks.far},plaza:k.plaza&&k.plaza.length}));
 o.boats=G.decor?G.decor.filter(d=>d.hgdBoatSpr||/boat/.test(d.k)).map(d=>({k:d.k,x:d.x,y:d.y,sc:d.sc,boat:d.hgdBoatSpr})):null;
 o.keys=Object.keys(L).join(',');
 o.dockk={};for(const d of L.decor){if(/arch|dock|pier|jetty|plank|gate/.test(d.k)){const t=d.k;o.dockk[t]=(o.dockk[t]||[]).concat([[d.x,d.y]])}}
 return o}
