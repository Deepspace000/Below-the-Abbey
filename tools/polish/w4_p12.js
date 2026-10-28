()=>{const L=LEVELS[477],open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.',E=L._hgdwe,P=E.vignettes.map(v=>[v.x,v.y]);
const lineSeen=(x,y,px,py)=>{if(x!==px&&y!==py)return false;const dx=Math.sign(px-x),dy=Math.sign(py-y);let cx=x,cy=y;while(cx!==px||cy!==py){cx+=dx;cy+=dy;if(!open(cx,cy))return false}return true};
let c6=0,cl=0,solidN=0;const solid=new Set(L.decor.filter(d=>d.block&&!d.pic).map(d=>d.x+','+d.y));
for(let y=1;y<41;y++)for(let x=1;x<41;x++){if(!open(x,y))continue;let m=1e9,m2=1e9;for(const q of P){const d=Math.hypot(q[0]-x,q[1]-y);m=Math.min(m,d);let d2=d;if(d<8&&lineSeen(x,y,q[0],q[1]))d2-=2;m2=Math.min(m2,d2)}if(m>=6)c6++;if(m2>=6)cl++;if(solid.has(x+','+y))solidN++}
return {c6,cl,solidN}}
