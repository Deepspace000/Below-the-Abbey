()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,o={};const m=hgdlMask(L);let a=0,b=0,c=0;const ex=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(M.bio[y*W+x]<4&&L.fmap[y][x]==='6'&&L.rows[y][x]==='.'){if(m[y*W+x])a++;else{b++;if(ex.length<400&&(x*7+y)%9===0)ex.push([x,y])}}}
o.inMask=a;o.outMask=b;o.ex=ex.slice(0,40);o.lakes=L._hgdl.lakes.map(k=>[k.x0,k.y0,k.x1,k.y1,k.wm?1:0]);o.sample=L.fmap[179].slice(170,190);
return o}
