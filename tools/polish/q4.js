()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,o={};let n=0,nz=0;const by=[0,0,0,0,0,0,0,0];const ex=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(L.fmap[y][x]==='6'&&L.rows[y][x]==='.'){n++;const b=M.bio[y*W+x];by[b]++;if(b<4&&ex.length<30)ex.push([x,y])}}
o.n=n;o.by=by;o.ex=ex;o.floors=L.floors||L.floorList||null;o.keys=Object.keys(L).join(',');
const e=L.enemies[0];o.enemy=JSON.stringify(e);
return o}
