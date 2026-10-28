()=>{const L=LEVELS[475],rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.';const zs=L._hgdp.zones.filter(z=>z.type==='safe'&&z.name!=='The Foot of the Maze');
const n8=(x,y)=>{let c=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if((a||b)&&open(x+a,y+b))c++;return c};
const n4=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>open(x+a,y+b)).length;
const bl=new Set(L.decor.filter(d=>d.block).map(d=>d.x+','+d.y));
const H=(a,b)=>{const v=Math.sin(a*127.1+b*311.7)*43758.5453;return v-Math.floor(v)};
const out=[];for(const z of zs){const hubs=[],cors=[];
 for(let dy=-z.r-8;dy<=z.r+8;dy++)for(let dx=-z.r-8;dx<=z.r+8;dx++){const x=z.x+dx,y=z.y+dy,d=Math.hypot(dx,dy);if(!open(x,y)||bl.has(x+','+y))continue;
  if(d<=z.r*.8&&n8(x,y)>=7)hubs.push([x,y,H(x,y)]);
  else if(d<=z.r+8&&n4(x,y)===2&&((open(x+1,y)&&open(x-1,y)&&open(x+2,y)&&open(x+3,y)&&open(x-1,y)&&open(x-2,y)&&open(x-3,y))||(open(x,y+1)&&open(x,y-1)&&open(x,y+2)&&open(x,y+3)&&open(x,y-2)&&open(x,y-3))))cors.push([x,y,H(x,y)])}
 hubs.sort((a,b)=>a[2]-b[2]);cors.sort((a,b)=>a[2]-b[2]);
 out.push({z:z.name,hubs:hubs.slice(0,2).map(a=>[a[0],a[1]]),cors:cors.slice(0,3).map(a=>[a[0],a[1]])})}
return out}
