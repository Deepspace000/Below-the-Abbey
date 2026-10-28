()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,o={};
o.portals=(L.portals||[]).map(p=>[p.to,p.x,p.y]);
o.decor49=L.decor.filter(d=>Math.hypot(d.x-49,d.y-182)<3).map(d=>[d.k,d.x,d.y,d.sc,d.block]);
o.dec101=L.decor.filter(d=>Math.hypot(d.x-101,d.y-95)<4).map(d=>[d.k,d.x,d.y,d.sc]);
o.fm=[];for(let y=173;y<=185;y++){o.fm.push(L.fmap[y].slice(168,186))}
o.rows95=[];for(let y=89;y<=100;y++)o.rows95.push(L.rows[y].slice(94,110).split('').map(c=>c==='.'?'.':'#').join(''));
o.bio2=L.decor.filter(d=>d.pic&&M.bio[d.y*W+d.x]===2).length;
o.bio2n=(()=>{let n=0;for(let y=0;y<M.H;y++)for(let x=0;x<W;x++)if(M.bio[y*W+x]===2&&L.rows[y][x]==='ˢ')n++;return n})();
o.floors=Object.keys(L.fmap?{}:{}); 
return o}
