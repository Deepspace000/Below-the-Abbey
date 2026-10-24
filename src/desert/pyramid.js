/* ==========================================================================
   THE GOLDEN PYRAMID (level 65). A real three-dimensional pyramid stands in the Golden Erg (terrain.js raises it out of
   the sand). A doorway in its south face leads to a labyrinth of golden walls. At its heart, behind every turning, lies a
   chest with a thousand gold. The Undying Pharaoh walks the maze, ten levels above the party: it warns you when it is
   near, hunts you, and can warp from one part of the labyrinth to another. His servants patrol too, and their grip slows you.
   ========================================================================== */
const PYR={cx:205,cy:160,half:12,peak:11,gx:205,gy:160+12+1};
const PYL={W:41,H:41,CX:20,CY:20};
function buildPyramid(){
  const W=PYL.W,H=PYL.H,g=[],R=(i,m)=>(hash2(i,77,65)*m)|0;
  for(let y=0;y<H;y++)g.push(new Array(W).fill('G'));
  // a maze on the odd cells (recursive backtracker), seeded so it is the same every time
  const seen=new Set(['1,1']),stack=[[1,1]];g[1][1]='.';let k=0;
  while(stack.length){
    const [cx,cy]=stack[stack.length-1],nb=[[2,0],[-2,0],[0,2],[0,-2]].map(([a,b])=>[cx+a,cy+b,a,b]).filter(([x,y])=>x>0&&y>0&&x<W-1&&y<H-1&&!seen.has(x+','+y));
    if(!nb.length){stack.pop();continue}
    const [nx,ny,a,b]=nb[R(1000+k++,nb.length)];g[cy+b/2][cx+a/2]='.';g[ny][nx]='.';seen.add(nx+','+ny);stack.push([nx,ny]);
  }
  // a few loops, so the labyrinth is not only dead ends
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(g[y][x]==='G'&&((x%2===0&&y%2===1)||(x%2===1&&y%2===0))&&hash2(x,y,66)<.12){
    const n=(g[y][x-1]==='.'&&g[y][x+1]==='.')||(g[y-1][x]==='.'&&g[y+1][x]==='.');if(n)g[y][x]='.';
  }
  // the heart: a square chamber, with the chest at its centre
  for(let y=PYL.CY-3;y<=PYL.CY+3;y++)for(let x=PYL.CX-3;x<=PYL.CX+3;x++)g[y][x]='.';
  const start={x:21,y:H-2,f:0};g[H-1][start.x]='0';
  const rows=g.map(r=>r.join('')),fm=g.map(r=>r.map(c=>(c==='0'?'0':'1')).join(''));
  const decor=[],lights=[],items=[];
  decor.push({k:'chest',x:PYL.CX,y:PYL.CY,block:true,goldAmt:1000});
  for(const [x,y] of [[PYL.CX-3,PYL.CY-3],[PYL.CX+3,PYL.CY-3],[PYL.CX-3,PYL.CY+3],[PYL.CX+3,PYL.CY+3]]){decor.push({k:'brazier',x,y,block:true});lights.push([x,y])}
  for(let y=3;y<H-1;y+=6)for(let x=3;x<W-1;x+=6)if(g[y][x]==='.')lights.push([x,y]);
  lights.push([start.x,start.y-1]);
  items.push({k:'potion',x:start.x,y:start.y-2});
  // distance from the door, to keep creatures away from it
  const d0=new Int16Array(W*H).fill(-1),q=[start.x+start.y*W];d0[q[0]]=0;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d0[ny*W+nx]>=0)continue;d0[ny*W+nx]=d0[c]+1;q.push(ny*W+nx)}}
  const far=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(g[y][x]==='.'&&d0[y*W+x]>=14&&!(Math.abs(x-PYL.CX)<=3&&Math.abs(y-PYL.CY)<=3))far.push([x,y]);
  const enemies=[],used=new Set();
  const place=(t,lvl,i)=>{for(let t2=0;t2<60;t2++){const [x,y]=far[R(2000+i*61+t2,far.length)];if(used.has(x+','+y))continue;used.add(x+','+y);enemies.push({t,x,y,lvl});return}};
  place('pharaohboss',44,0);
  for(let i=0;i<8;i++)place('pservant',34,1+i);
  return {rows,fmap:fm,start,decor,lights,items,enemies};
}
const PYRAMID=buildPyramid();
LEVELS[65]={rows:PYRAMID.rows,fmap:PYRAMID.fmap,start:PYRAMID.start,enemies:PYRAMID.enemies,items:PYRAMID.items,decor:PYRAMID.decor,lights:PYRAMID.lights,secrets:[],
  amb:.55,ceilH:1.3,floor:'tombgold',floorSet:['tombslab','tombgold','tombsand','tombdark','tomblapis','tombred'],ceil:'tomb',name:'The Golden Pyramid',label:'Golden Pyramid',diff:30,
  portals:[{to:61,x:PYR.gx,y:PYR.gy+2,f:2,tex:'tomb'}]};
LEVEL_NAMES[65]='The Golden Pyramid';
STREAM_LISTS[65]=['music_sands_tomb'];
// the doorway in the pyramid's south face, in the Golden Erg
LEVELS[61].decor.push({k:'dpyrgate',x:PYR.gx,y:PYR.gy,block:true,enter:{to:65,x:PYRAMID.start.x,y:PYRAMID.start.y,f:0}});
function makePyramidArt(){LEVELS[65].chars=LEVEL42_DATA.chars;NPC_H.dpyrgate=2.1}

/* ---- the creatures ---- */
Object.assign(ENEMY_DEF,{
  pharaohboss:{name:'The Undying Pharaoh',hp:160,dmg:[7,11],hit:.82,w:1.1,img:'pharaohboss',xp:400,gold:[0,0],speed:1,verb:'smites',boss:true,aboveParty:10,patrol:true,act:e=>pharaohAct(e)},
  pservant:{name:"Pharaoh's Servant",hp:50,dmg:[3,5],hit:.72,w:.7,img:'pservant',xp:60,gold:[2,8],speed:1,verb:'strikes',patrol:true,slows:true,act:e=>{if(Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)>20){e.alert=false;return 130}return 0}}});
// first step of the shortest walk through the labyrinth from one cell to another (or null)
function mazeBfs(sx,sy,tx,ty,self){
  const dist=new Int16Array(MW*MH).fill(-1),first=new Int16Array(MW*MH).fill(-1),q=[sy*MW+sx];dist[q[0]]=0;
  for(let i=0;i<q.length;i++){
    const c=q[i],x=c%MW,y=(c/MW)|0;if(x===tx&&y===ty)return {dist:dist[c],step:first[c]};
    for(let d=0;d<4;d++){const nx=x+DIRS[d][0],ny=y+DIRS[d][1],ni=ny*MW+nx;
      if(nx<0||ny<0||nx>=MW||ny>=MH||dist[ni]>=0)continue;
      const isT=nx===tx&&ny===ty;if(!isT&&(cellBlocked(nx,ny)||enemyAt(nx,ny)))continue;
      dist[ni]=dist[c]+1;first[ni]=first[c]<0?ni:first[c];q.push(ni)}
  }
  return null;
}
function mazeDistMap(sx,sy){const dist=new Int16Array(MW*MH).fill(-1),q=[sy*MW+sx];dist[q[0]]=0;for(let i=0;i<q.length;i++){const c=q[i],x=c%MW,y=(c/MW)|0;for(let d=0;d<4;d++){const nx=x+DIRS[d][0],ny=y+DIRS[d][1],ni=ny*MW+nx;if(nx<0||ny<0||nx>=MW||ny>=MH||dist[ni]>=0||cellBlocked(nx,ny))continue;dist[ni]=dist[c]+1;q.push(ni)}}return dist}
function pharaohWarn(def){
  msg('A deathly cold fills the labyrinth. The Undying Pharaoh is near, and he is coming for you!','#ff9a7a');
  sfx('growl');G.shake=.6;G.pharFlash=2.2;
}
// patrolling in the labyrinth: walk to a random chamber by the real passages; the Pharaoh also warps now and then
function mazePatrol(e,def){
  const near=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);
  if(def.boss){
    if(near<=10){e.alert=true;e.cd=0;pharaohWarn(def);return 250}
    e.wt=(e.wt||0)+1;
    if(e.wt>=20+(e.id%7)){e.wt=0;const dm=mazeDistMap(G.P.x,G.P.y),cand=[];for(let i=0;i<dm.length;i++)if(dm[i]>=14){const x=i%MW,y=(i/MW)|0;if(!enemyAt(x,y))cand.push(i)}
      if(cand.length){const i=cand[(Math.random()*cand.length)|0];e.x=i%MW;e.y=(i/MW)|0;e.tgt=null;return 200}}
  }else if(near<=6&&(near<=3||hasLOS(e.x,e.y,G.P.x,G.P.y))){e.alert=true;sfx('growl');msg(`${def.name} spots you and lurches forward.`,'#e8c870');return 200}
  if(!e.tgt||(e.x===e.tgt.x&&e.y===e.tgt.y)||(e.pt=(e.pt||0)+1)>90){
    e.pt=0;e.tgt=null;
    for(let t=0;t<40;t++){const x=1+((Math.random()*(MW-2))|0),y=1+((Math.random()*(MH-2))|0);if(!cellBlocked(x,y)){e.tgt={x,y};break}}
  }
  if(e.tgt){const p=mazeBfs(e.x,e.y,e.tgt.x,e.tgt.y);if(p&&p.step>=0){e.x=p.step%MW;e.y=(p.step/MW)|0;return 130}e.tgt=null}
  return 0;
}
// the Pharaoh once he has found you: straight down the passages, and a warp when you are far ahead
function pharaohAct(e){
  const man=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);
  if(man===1){enemyAttack(e);return 290}
  if(man>26){e.alert=false;msg('The cold lifts. The Pharaoh has lost you.','#c8d8e8');return 130}
  e.cd=(e.cd||0)+1;
  const p=mazeBfs(e.x,e.y,G.P.x,G.P.y);
  if(p&&p.dist>11&&e.cd>=12&&Math.random()<.4){
    const dm=mazeDistMap(G.P.x,G.P.y),cand=[];
    for(let i=0;i<dm.length;i++)if(dm[i]>=6&&dm[i]<=9){const x=i%MW,y=(i/MW)|0;if(!enemyAt(x,y))cand.push(i)}
    if(cand.length){const i=cand[(Math.random()*cand.length)|0];e.x=i%MW;e.y=(i/MW)|0;e.cd=0;msg('The Pharaoh vanishes in a flash of green light, and steps out of the dark ahead of you.','#b8f0c0');sfx('spell');return 400}
  }
  if(p&&p.step>=0){e.x=p.step%MW;e.y=(p.step/MW)|0;return 130}
  return 0;
}
function drawPharFlash(){
  const f=Math.min(1,G.pharFlash);ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();
  const g=ctx.createRadialGradient(210,105,40,210,105,260);g.addColorStop(0,'rgba(120,20,10,0)');g.addColorStop(1,`rgba(150,20,10,${.55*f})`);ctx.fillStyle=g;ctx.fillRect(0,0,420,210);
  ctx.globalAlpha=f;txt('THE PHARAOH IS NEAR',210,40,15,'#ffb8a0','center',true);ctx.restore();
}
