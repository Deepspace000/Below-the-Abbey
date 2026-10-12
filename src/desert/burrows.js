/* ==========================================================================
   THE BURIED CHAMBERS (levels 50 to 59): ten little dungeons under mounds in the dunes. Each has a few chambers with
   creatures in them, vases and treasure, and a chest at the far end with a piece of magic gear.
   ========================================================================== */
const BUR_THEMES=[
  {name:'The Scorpion Nest',foes:[['scorpion',6]]},
  {name:'The Mummy Vault',foes:[['mummy',5]],ambush:true},
  {name:'The Nomads\' Hideout',foes:[['nomad',3],['nomad2',2],['dwolf',2]]},
  {name:'The Wolf Den',foes:[['dwolf',6]]},
  {name:'The Sunken Shrine',foes:[['scorpion',2],['mummy',2],['nomad',2]]}];
function buildBurrow(k){
  // every chamber has its own plan: rooms are scattered by a seed, joined by corridors, and the chest sits in the room farthest from the door
  const W=25,H=19,g=[],fl=[],th=[],Rn=(i,m)=>(hash2(k*13+i,k*7+3,77)*m)|0;
  for(let y=0;y<H;y++){g.push(new Array(W).fill('W'));fl.push(new Array(W).fill('0'));th.push(new Array(W).fill(''))}
  const rooms=[],cut=(x0,y0,x1,y1,ft,t)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){g[y][x]='.';fl[y][x]=ft;th[y][x]=t}};
  const ew=3+Rn(1,3),sx=2+Rn(2,W-ew-4);
  rooms.push({x0:sx,y0:H-5,x1:sx+ew-1,y1:H-2});
  const want=5+(k%4);
  for(let t=0;t<400&&rooms.length<want;t++){
    const w=3+Rn(100+t,5),h=3+Rn(200+t,3),x0=1+Rn(300+t,W-w-2),y0=1+Rn(400+t,H-h-2);
    if(rooms.some(r=>x0<=r.x1+2&&x0+w-1>=r.x0-2&&y0<=r.y1+2&&y0+h-1>=r.y0-2))continue;
    rooms.push({x0,y0,x1:x0+w-1,y1:y0+h-1});
  }
  const mid=r=>[(r.x0+r.x1)>>1,(r.y0+r.y1)>>1];
  rooms.forEach(r=>cut(r.x0,r.y0,r.x1,r.y1,'0','crypt'));
  for(let i=1;i<rooms.length;i++){ // join each room to a near one before it
    let bj=0,bd=1e9;const [ax,ay]=mid(rooms[i]);for(let j=0;j<i;j++){const [bx,by]=mid(rooms[j]),d=Math.abs(ax-bx)+Math.abs(ay-by)+Rn(500+i*9+j,6);if(d<bd){bd=d;bj=j}}
    const [bx,by]=mid(rooms[bj]);
    const hFirst=Rn(600+i,2)===0;
    const hl=(y,x0,x1)=>{for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)if(g[y][x]==='W'){g[y][x]='.';th[y][x]='crypt'}};
    const vl=(x,y0,y1)=>{for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)if(g[y][x]==='W'){g[y][x]='.';th[y][x]='crypt'}};
    if(hFirst){hl(ay,ax,bx);vl(bx,ay,by)}else{vl(ax,ay,by);hl(by,ax,bx)}
  }
  const start={x:mid(rooms[0])[0],y:H-2};
  const bfs=(blocked)=>{const d=new Int16Array(W*H).fill(-1),q=[start.x+start.y*W];d[q[0]]=0;for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d[ny*W+nx]>=0||blocked.has(nx+','+ny))continue;d[ny*W+nx]=d[c]+1;q.push(ny*W+nx)}}return d};
  const d0=bfs(new Set());let tr=1,td=-1;rooms.forEach((r,i)=>{if(!i)return;const [mx,my]=mid(r),dd=d0[my*W+mx];if(dd>td){td=dd;tr=i}});
  const TR=rooms[tr];cut(TR.x0,TR.y0,TR.x1,TR.y1,'1','vault');
  const e0=rooms[0];cut(e0.x0,e0.y0,e0.x1,e0.y1,'2','crypt');
  g[H-1][start.x]='0';
  const wall=(x,y,t)=>{const r=hash2(x,y,60+k);return t==='vault'?'G':(r<.4?'W':'H')};
  const rows=[];
  for(let y=0;y<H;y++){let row='';for(let x=0;x<W;x++){let c=g[y][x];if(c==='W'){let t='';for(let dy=-1;dy<=1&&!t;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<W&&ny<H&&g[ny][nx]==='.'){t=th[ny][nx];break}}c=t?wall(x,y,t):'W'}row+=c}rows.push(row)}
  const decor=[],enemies=[],items=[],lights=[],blocked=new Set(),used=new Set([start.x+','+start.y]);
  const T=BUR_THEMES[k%BUR_THEMES.length];
  const okBlock=(x,y)=>{const key=x+','+y;if(g[y][x]!=='.'||used.has(key)||blocked.has(key))return false;blocked.add(key);const d=bfs(blocked);let ok=true;for(let yy=0;yy<H&&ok;yy++)for(let xx=0;xx<W;xx++)if(g[yy][xx]==='.'&&!blocked.has(xx+','+yy)&&d[yy*W+xx]<0){ok=false;break}if(!ok)blocked.delete(key);return ok};
  const put=(kk,x,y,o)=>{if(o&&o.block&&!okBlock(x,y))return false;used.add(x+','+y);decor.push(Object.assign({k:kk,x,y,block:false},o||{}));return true};
  const free=(r)=>{const c=[];for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)if(!used.has(x+','+y)&&!blocked.has(x+','+y))c.push([x,y]);return c};
  const spot=(r,i)=>{const c=free(r);return c.length?c[Rn(i,c.length)]:null};
  // the treasure room: one chest holds the magic, a little plain gold lies about, nothing else magical
  {const cands=[];for(let y=TR.y0;y<=TR.y1;y++)for(let x=TR.x0;x<=TR.x1;x++)cands.push([x,y]);cands.sort((p,q)=>(p[1]-q[1])||(Math.abs(p[0]-((TR.x0+TR.x1)>>1))-Math.abs(q[0]-((TR.x0+TR.x1)>>1))));for(const [x,y] of cands)if(put('chest',x,y,{block:true,magic:DS_MAGIC_TOMB[k%DS_MAGIC_TOMB.length],goldAmt:260+k*30}))break}
  put('treasure',TR.x0,TR.y1,{block:true,plain:true});
  if(TR.x1>TR.x0+1)put('vase'+(k%4),TR.x1,TR.y1,{block:true,plain:true});
  rooms.forEach((r,i)=>{for(const [x,y] of [[r.x0,r.y0],[r.x1,r.y0]]){if(i===0&&y>H-6)continue;if(put('brazier',x,y,{block:true}))lights.push([x,y])}});
  rooms.forEach((r,i)=>{if(i===0||i===tr)return;const p=spot(r,700+i);if(p)put('vase'+((k+i)%4),p[0],p[1],{block:true,plain:true});if(i%2===0){const q=spot(r,800+i);if(q)put(T.ambush?'sarcoph':'offering',q[0],q[1],T.ambush?{block:true,ambush:['mummy']}:{block:true})}});
  if(T.ambush&&!decor.some(d=>d.k==='sarcoph')){const r=rooms[(tr+1)%rooms.length],p=spot(r,900);if(p)put('sarcoph',p[0],p[1],{block:true,ambush:['mummy','mummy']})}
  // creatures: one to three per mound (varies by mound), in the rooms between the door and the treasure
  const side=rooms.map((r,i)=>i).filter(i=>i!==0&&i!==tr);
  const BUR_COUNT=[2,1,3,2,3,1,2,3,1,2],pool=[];for(const [t,n] of T.foes)for(let i=0;i<n;i++)pool.push(t);
  for(let ci=0;ci<BUR_COUNT[k%10];ci++){const t=pool[(ci*2+k)%pool.length],r=rooms[side[ci%side.length]],p=spot(r,1000+ci);if(p){used.add(p[0]+','+p[1]);enemies.push({t,x:p[0],y:p[1],lvl:15+(k%3)})}}
  items.push({k:'potion',x:start.x,y:start.y-1});
  return {rows,fm:fl.map(r=>r.join('')),decor,enemies,items,lights,start:{x:start.x,y:start.y,f:0}};
}
for(let k=0;k<BURROW_N;k++){
  const B=buildBurrow(k),spot=SANDROAD.burrows[k]||{x:RD.W>>1,y:RD.CY-20};
  LEVELS[BURROW_BASE+k]={rows:B.rows,fmap:B.fm,start:B.start,enemies:B.enemies,items:B.items,decor:B.decor,lights:B.lights,secrets:[],
    amb:.34,ceilH:1.3,floor:'tombslab',floorSet:['tombslab','tombgold','tombsand','tombdark','tomblapis','tombred'],ceil:'tomb',name:BUR_THEMES[k%BUR_THEMES.length].name,label:'Buried Chamber',diff:15+(k%3),
    portals:[{to:41,x:spot.x,y:spot.y+1,f:2,tex:'tomb'}]};
}
// the tiny dungeons share the tomb's walls and the same music as the other small dungeons
function makeBurrowArt(){for(let k=0;k<BURROW_N;k++)LEVELS[BURROW_BASE+k].chars=LEVEL42_DATA.chars;if(typeof makeDngArt==='function')makeDngArt()}
for(let k=0;k<BURROW_N;k++)EMBERS_LEVELS.push(BURROW_BASE+k);
