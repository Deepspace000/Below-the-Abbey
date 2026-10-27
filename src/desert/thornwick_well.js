/* ==========================================================================
   UNDER THE WELL (level 501, prefix tw / TWL). A small windy maze of grey-blue brick under Thornwick, where the rats of the Rat Catcher quest nest.
   1. The level: a perfect maze (one way only, no loops) of one-wide passages cut from a fixed seed, so it is the same every time. Eight rats stand in it
      (the quest counts rats), spread along the passages, and a chest waits in the dead end that is the longest walk from the stair.
   2. The way in: a new well in Thornwick (level 3), a few squares west of Goodwife Edda (36,16), at 29,17 (kept well clear of every door). Talk to it (or step on it) to climb down.
      The way out is the door at the foot of the stair, which puts the party back beside the well.
   3. The walls are the plain stone wall recoloured grey-blue (made when the level is first entered); the floor is the wet cobble, darkened and leaned to blue.
   4. The map is a little hand-inked sheet (the same pen work as the Queen's Hive map): names and a key only.
   ========================================================================== */
const TWL={ID:501,W:25,H:19,EX:3,WX:29,WY:17,M:null};

function twBuild(){
  const W=TWL.W,H=TWL.H,R=rmRng(70417),g=[];
  for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const sx=TWL.EX,sy=H-2,seen=new Set([sx+','+sy]),stack=[[sx,sy]];g[sy][sx]='.';
  while(stack.length){
    const [cx,cy]=stack[stack.length-1],nb=[];
    for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2]]){const nx=cx+dx,ny=cy+dy;if(nx<1||ny<1||nx>W-2||ny>H-2||seen.has(nx+','+ny))continue;nb.push([nx,ny,dx,dy])}
    if(!nb.length){stack.pop();continue}
    const [nx,ny,dx,dy]=nb[Math.floor(R()*nb.length)];g[cy+dy/2][cx+dx/2]='.';g[ny][nx]='.';seen.add(nx+','+ny);stack.push([nx,ny]);
  }
  const D4=[[1,0],[-1,0],[0,1],[0,-1]];
  g[H-1][sx]='0'; // the door out, in the outer wall under the start
  const d=new Int16Array(W*H).fill(-1),q=[sy*W+sx];d[q[0]]=0;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of D4){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d[ny*W+nx]>=0)continue;d[ny*W+nx]=d[c]+1;q.push(ny*W+nx)}}
  const floor=[],deg=new Map();
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(g[y][x]==='.'){floor.push([x,y]);deg.set(x+','+y,D4.filter(([a,b])=>g[y+b][x+a]==='.').length)}
  // the chest: the dead end that is the longest walk from the stair
  const ends=floor.filter(([x,y])=>deg.get(x+','+y)===1&&!(x===sx&&y===sy)).sort((a,b)=>d[b[1]*W+b[0]]-d[a[1]*W+a[0]]);
  const chest=ends[0],taken=new Set([chest[0]+','+chest[1]]);
  // eight rats, spread along the passages and away from the stair
  const cand=floor.filter(([x,y])=>d[y*W+x]>=8&&!taken.has(x+','+y));
  for(let i=cand.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[cand[i],cand[j]]=[cand[j],cand[i]]}
  const enemies=[];
  for(const need of [7,5,4,3,2]){
    for(const p of cand){if(enemies.length>=8)break;if(taken.has(p[0]+','+p[1]))continue;if(!enemies.every(e=>Math.abs(e.x-p[0])+Math.abs(e.y-p[1])>=need))continue;
      if(Math.abs(chest[0]-p[0])+Math.abs(chest[1]-p[1])<2)continue;taken.add(p[0]+','+p[1]);enemies.push({t:'rat',x:p[0],y:p[1],lvl:8+(enemies.length%3)})}
    if(enemies.length>=8)break}
  // a potion in the second longest dead end
  const items=[];{const e2=ends.find(p=>!taken.has(p[0]+','+p[1])&&d[p[1]*W+p[0]]>=14);if(e2)items.push({k:'potion',x:e2[0],y:e2[1]})}
  const decor=[{k:'chest',x:chest[0],y:chest[1],block:true,goldAmt:35}];
  // a hungry cat in one dead end, and a salt herring lying in another (The Rat Catcher's Cat)
  {const used=new Set(items.map(q=>q.x+','+q.y));used.add(chest[0]+','+chest[1]);
   const cat=ends.find(p=>!used.has(p[0]+','+p[1])&&!taken.has(p[0]+','+p[1])&&d[p[1]*W+p[0]]>=10);
   if(cat){used.add(cat[0]+','+cat[1]);decor.push({k:'pet_cat_0',x:cat[0],y:cat[1],block:true,npc:'twcat',sc:.9})}
   const fish=ends.find(p=>!used.has(p[0]+','+p[1])&&!taken.has(p[0]+','+p[1])&&d[p[1]*W+p[0]]>=6);
   if(fish)items.push({k:'herring',x:fish[0],y:fish[1]})}
  // a torch light every so often along the passages
  const lights=[];for(const [x,y] of floor)if(d[y*W+x]%9===4&&lights.every(l=>Math.hypot(l[0]-x,l[1]-y)>=5))lights.push([x,y]);
  const fm=[];for(let y=0;y<H;y++)fm.push('0'.repeat(W));
  let floors=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y][x]==='.')floors++;
  let reach=0;for(let i=0;i<d.length;i++)if(d[i]>=0)reach++;
  let edges=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(g[y][x]!=='.')continue;for(const [a,b] of [[1,0],[0,1]])if(g[y+b]&&g[y+b][x+a]==='.')edges++}
  const info={ok:reach===floors&&edges===floors-1&&enemies.length===8&&g[H-1][sx]==='0',floors,reach,edges,rats:enemies.length,chest,chestWalk:d[chest[1]*W+chest[0]]};
  if(!info.ok)console.error('Under the Well failed its own checks',info);
  // the chest's dead end is dressed (the maze is cut so tight that no room fits round it): bones, a barrel and a light on the way in
  // the chest's dead end is widened into a small chamber: the nine squares round the chest are cleared (the chest stands in the middle, the way in is where the passage met it), with a light in the room and a few bones
  {const nb=D4.find(([a,b])=>g[chest[1]+b][chest[0]+a]==='.');
   for(let y=chest[1]-1;y<=chest[1]+1;y++)for(let x=chest[0]-1;x<=chest[0]+1;x++)if(x>=1&&y>=1&&x<=W-2&&y<=H-2&&g[y][x]==='#')g[y][x]='.';
   // the room is walkable all round the chest, and still joined to the stair
   const d2=new Int16Array(W*H).fill(-1),q2=[sy*W+sx];d2[q2[0]]=0;for(let i=0;i<q2.length;i++){const c=q2[i],x=c%W,y=(c/W)|0;for(const [a,b] of D4){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d2[ny*W+nx]>=0)continue;d2[ny*W+nx]=d2[c]+1;q2.push(ny*W+nx)}}
   let ring=0;for(let y=chest[1]-1;y<=chest[1]+1;y++)for(let x=chest[0]-1;x<=chest[0]+1;x++)if(g[y][x]==='.'&&d2[y*W+x]>=0)ring++;
   info.chamber={cells:ring,solvable:d2[chest[1]*W+chest[0]]>=0};
   if(ring!==9)console.error('Under the Well: the chest chamber is not whole',info.chamber);
   const lx=chest[0]+(nb&&nb[0]===1?-1:1),ly=chest[1]+(nb&&nb[1]===1?-1:1);lights.push([lx,ly]);
   decor.push({k:'bones',x:chest[0]+(nb?nb[0]:1),y:chest[1]+(nb?nb[1]:0),block:false});decor.push({k:'barrel',x:lx,y:ly,block:false,walk:true,deco:true,sc:.8})}
  const near=(x,y)=>decor.some(q=>q.x===x&&q.y===y)||(x===chest[0]&&y===chest[1])||items.some(q=>q.x===x&&q.y===y);
  floor.forEach(([x,y],i)=>{if(near(x,y)||d[y*W+x]<5)return;const h=hash2(x,y,9917);
    if(h<.045)decor.push({k:'bones',x,y,block:false});
    else if(h<.06&&deg.get(x+','+y)===1&&g[y][x]==='.')decor.push({k:'barrel',x,y,block:true})});
  return {rows:g.map(r=>r.join('')),fmap:fm,start:{x:sx,y:sy,f:0},enemies,items,decor,lights,info,chest};
}
{const M=twBuild();TWL.M=M;
  LEVELS[TWL.ID]={rows:M.rows,fmap:M.fmap,start:M.start,enemies:M.enemies,items:M.items,decor:M.decor,lights:M.lights,day:0,torchGap:4.2,
    floor:'twfloor',floorSet:['twfloor','twfloor','twfloor','twfloor','twfloor','twfloor'],ceil:'twceil',
    name:'Under the Well',label:'Under the Well',diff:9,
    portals:[{to:3,x:TWL.WX,y:TWL.WY+1,f:2,tex:'farm'}],
    mapNames:[{t:'Well Stair',x:TWL.EX,y:TWL.H-3,k:'place'}],_twl:M.info};
  LEVEL_NAMES[TWL.ID]='Under the Well';LEVEL_RATING[TWL.ID]=9}

/* ---- the grey-blue brick, the wet floor and the ceiling: recoloured when the level is first entered ---- */
const TWA={on:false,made:false,save:null};
function twMakeArt(){
  if(TWA.made)return;
  const src=TEX[T_STONE]&&TEX[T_STONE].d,N=TS*TS,L=new Float32Array(N);
  for(let i=0;i<N;i++)L[i]=src?(src[i*4]*.3+src[i*4+1]*.59+src[i*4+2]*.11)/255:.5;
  const sorted=Float32Array.from(L).sort(),lo=sorted[(N*.03)|0],hi=sorted[Math.min(N-1,(N*.97)|0)],span=Math.max(.05,hi-lo);
  const RAMP=[[0,8,16,36],[.35,40,68,118],[.7,84,126,196],[1,160,204,255]];
  const ramp=v=>{for(let k=1;k<RAMP.length;k++)if(v<=RAMP[k][0]){const a=RAMP[k-1],b=RAMP[k],t=(v-a[0])/(b[0]-a[0]);return [a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,a[3]+(b[3]-a[3])*t]}const l=RAMP[RAMP.length-1];return [l[1],l[2],l[3]]};
  const Ls=new Float32Array(N);   // a gentle blur (wrapping at the edges, so the tile still repeats), so the stone is smooth and not noisy
  for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){let a=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)a+=L[((y+j+TS)%TS)*TS+((x+i+TS)%TS)];Ls[y*TS+x]=a/9}
  const mkWall=(tint)=>{const w=new Uint8ClampedArray(N*4);for(let i=0;i<N;i++){const v=Math.min(1,Math.max(0,(Ls[i]-lo)/span*1.1)),[r,g,b]=ramp(v);w[i*4]=Math.min(255,r*tint[0]);w[i*4+1]=Math.min(255,g*tint[1]);w[i*4+2]=Math.min(255,b*tint[2]);w[i*4+3]=255}return w};
  const wall=mkWall([1,1,1]);
  TWA.variants=[[1.18,1.08,.82],[.85,1.12,1.0]].map(t=>addTex(mkWall(t)));   // a warmer stone and a greener one, mixed in
  TWA.stone=addTex(wall);TWA.torch=TEX.length;for(const f of torchFrames(wall))addTex(f.d,f.e);
  {const A=FLOORS.wetcobble||FLOORS.cobble,d=new Uint8ClampedArray(TS*TS*4);
    for(let i=0;i<TS*TS;i++){const m=(A[i*4]+A[i*4+1]+A[i*4+2])/3;d[i*4]=m*.62;d[i*4+1]=m*.78;d[i*4+2]=m*1.02+6;d[i*4+3]=255}
    FLOORS.twfloor=d}
  {const C0=CEILS.gloom||CEILS.tomb;if(C0){const d=new Uint8ClampedArray(C0.length);for(let i=0;i<C0.length;i+=4){const m=(C0[i]+C0[i+1]+C0[i+2])/3;d[i]=m*.5;d[i+1]=m*.62;d[i+2]=m*.86+8;d[i+3]=255}CEILS.twceil=d}}
  TWA.made=true;
  // three kinds of wall in the rows: the blue stone, a warmer stone and a green one, in patches
  {const Lv=LEVELS[TWL.ID];if(Lv&&!Lv._twVar){Lv._twVar=1;Lv.chars=Lv.chars||{};const cs=['Ѡ','ѡ'];TWA.variants.forEach((id,i)=>{const gid=KH_NEXT_GID++;T_TILE[gid]=id;Lv.chars[cs[i]]=gid});
    Lv.rows=Lv.rows.map((row,y)=>row.split('').map((c,x)=>{if(c!=='#')return c;const n=hash2((x/3)|0,(y/3)|0,4471);return n<.18?cs[0]:n<.34?cs[1]:c}).join(''))}}
}
function twSwapWalls(on){
  if(on&&!TWA.on&&TWA.made){TWA.save=[T_STONE,T_TORCH_STONE];T_STONE=TWA.stone;T_TORCH_STONE=TWA.torch;TWA.on=true}
  else if(!on&&TWA.on){T_STONE=TWA.save[0];T_TORCH_STONE=TWA.save[1];TWA.on=false}
}
{const _ll=loadLevel;loadLevel=function(n){
  try{if(n===TWL.ID)twMakeArt();twSwapWalls(n===TWL.ID)}catch(e){console.error(e)}
  return _ll.apply(this,arguments)}}

/* ---- the chest at the dead end ---- */
{const _lf=lootFor;lootFor=function(d){
  if(LEVEL===TWL.ID&&d&&d.k==='chest'){
    const r=k=>hash2(d.x,d.y,310+k),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
    for(let q=0;q<2;q++)add(potionFor(r(40+q)),1);
    add('manadraught',1);
    const a=typeof armourDrop==='function'?armourDrop(r(60)):null;if(a)add(a);
    d.gold=d.goldAmt||35;return items}
  return _lf.apply(this,arguments)}}

/* ---- the well in Thornwick: a few squares west of Goodwife Edda ---- */
function twDescend(){if(LEVEL!==3||G.state!=='play')return;msg('The party climbs down the well, into the tunnels below Thornwick.','#9ec4e8');sfx('level');const st=LEVELS[TWL.ID].start;goToLevel(TWL.ID,{x:st.x,y:st.y,f:st.f});G.state='play'}
NPCS.thornwell={name:'The well',img:'well',root:d=>say('You look into the well and hear scratching sounds far below. Do you descend?',[['Descend.',()=>{twDescend();return null}],['Not.',()=>null]])};
function twTownSetup(){
  const L=LEVELS[3];if(!L||!L.decor||L._twWell)return;L._twWell=1;
  L.decor.push({k:'well',x:TWL.WX,y:TWL.WY,block:false,walk:true,npc:'thornwell'});
}
twTownSetup();
{const _dm=doMove;doMove=function(){const r=_dm.apply(this,arguments);
  try{if(LEVEL===3&&G.state==='play'&&!G.cut&&!G.talk&&G.P.x===TWL.WX&&G.P.y===TWL.WY)later(450,()=>{if(LEVEL===3&&G.P.x===TWL.WX&&G.P.y===TWL.WY&&!G.cut&&!G.talk){const w=LEVELS[3].decor.find(d=>d.npc==='thornwell');if(w)startTalk(w)}})}catch(e){console.error(e)}
  return r}}

/* ---- the lists: the Go to area list and ?town=thornwickwell ---- */
{const _g=gotoListRaw;gotoListRaw=function(){
  const out=_g.apply(this,arguments);
  try{if(!out.some(r=>r.n===TWL.ID)){const i=out.findIndex(r=>r.n===3);if(i>=0)out.splice(i+1,0,{n:TWL.ID,name:'Under the Well'})}}catch(e){console.error(e)}
  return out}}
{const _j=jumpFromUrl;jumpFromUrl=function(){
  const q=new URLSearchParams(location.search),town=(q.get('town')||'').toLowerCase().replace(/[^a-z]/g,'');
  if(town!=='thornwickwell')return _j.apply(this,arguments);
  const orig=location.pathname+location.search+location.hash;
  q.set('town','thornwick');if(!q.get('lvl'))q.set('lvl','34');
  try{history.replaceState(null,'',location.pathname+'?'+q.toString()+location.hash)}catch(e){}
  try{_j.apply(this,arguments)}finally{try{history.replaceState(null,'',orig)}catch(e){}}
  const st=LEVELS[TWL.ID].start;goToLevel(TWL.ID,{x:st.x,y:st.y,f:st.f});G.state='play';G.menu=false;
  msg('Your party stands at the foot of the well stair.','#ffe36a');
}}

/* ---- the little hand-inked map (the pen work of the Queen's Hive map, in grey-blue stone) ---- */
mplInstall({name:'thornwickwell',levels:[TWL.ID],tint:[-6,0,10],foot:'You are the yellow arrow. The tunnels under the Thornwick well.',
fit:L=>mplFit(L.rows[0].length,L.rows.length,6),
draw(c,x,L,api){
  const A=MPL.AREA,F=mplFit(L.rows[0].length,L.rows.length,6),S=F.s,X=F.X,Y=F.Y,W0=L.rows[0].length,H0=L.rows.length,H=(a,b,s)=>hash2(a,b,7001+(s||0));
  const isF=(cx,cy)=>cx>=0&&cy>=0&&cx<W0&&cy<H0&&L.rows[cy][cx]!=='#';
  // the solid stone: grey-blue, with rough courses of brick inked over it
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  {const g=x.createLinearGradient(A.x,A.y,A.x+A.w,A.y+A.h);g.addColorStop(0,'#8a9bb2');g.addColorStop(.5,'#7a8ca6');g.addColorStop(1,'#6b7d98');x.fillStyle=g;x.fillRect(A.x,A.y,A.w,A.h)}
  {const bh=S*.55,bw=S*1.1;x.strokeStyle='rgba(30,40,62,.32)';x.lineWidth=.45;
    for(let row=0,yy=A.y;yy<A.y+A.h;yy+=bh,row++){x.beginPath();x.moveTo(A.x,yy);x.lineTo(A.x+A.w,yy);x.stroke();
      for(let xx=A.x+(row&1?bw/2:0);xx<A.x+A.w;xx+=bw){x.beginPath();x.moveTo(xx,yy);x.lineTo(xx,yy+bh);x.stroke();
        const v=H(row,Math.round(xx),3);if(v<.22){x.fillStyle='rgba(20,30,52,.12)';x.fillRect(xx,yy,bw,bh)}else if(v>.86){x.fillStyle='rgba(220,232,250,.12)';x.fillRect(xx,yy,bw,bh)}}}}
  x.restore();
  // the passages: one path of every floor square, edged by hand
  const loops=mpQhLoops(isF,W0,H0,(gx,gy,k)=>H(gx,gy,20+k)),fp=new Path2D();
  for(const lp of loops){lp.forEach(([gx,gy],i)=>i?fp.lineTo(X(gx),Y(gy)):fp.moveTo(X(gx),Y(gy)));fp.closePath()}
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  x.save();x.shadowColor='rgba(10,18,36,.65)';x.shadowBlur=4.5;x.fillStyle='#d8dfe8';x.fill(fp,'evenodd');x.restore();
  x.save();x.clip(fp,'evenodd');
  for(let cy=0;cy<H0;cy++)for(let cx=0;cx<W0;cx++){if(!isF(cx,cy))continue;const v=H(cx,cy,2);x.fillStyle=v<.5?`rgba(90,110,150,${.04+v*.14})`:`rgba(255,255,255,${.05+(v-.5)*.2})`;x.fillRect(X(cx),Y(cy),S,S)}
  for(const [lx,ly] of (L.lights||[])){const g=x.createRadialGradient(X(lx+.5),Y(ly+.5),0,X(lx+.5),Y(ly+.5),S*3.2);g.addColorStop(0,'rgba(255,230,160,.7)');g.addColorStop(1,'rgba(255,230,160,0)');x.fillStyle=g;x.fillRect(X(lx-3),Y(ly-3),S*7,S*7)}
  x.restore();
  for(const [col,lw] of [['rgba(20,30,52,.42)',1.9],['rgba(26,26,36,.92)',.85]]){x.strokeStyle=col;x.lineWidth=lw;x.lineJoin='round';x.stroke(fp)}
  x.restore();
  // the chest at the dead end, and the way out
  const k=S/4.1,ch=(L.decor||[]).find(d=>d.k==='chest');
  if(ch){mpQhChest(x,X(ch.x+.5),Y(ch.y+.5),'#a8742e',k*1.2)}
  {let dx=-1,dy=-1;for(let cy=0;cy<H0;cy++)for(let cx=0;cx<W0;cx++)if(/[^#.]/.test(L.rows[cy][cx])){dx=cx;dy=cy}
    if(dx>=0){mpQhDoor(x,X(dx+.5),Y(dy+.4),k*1.25);api.text(x,'Stair to the well',X(dx+.5)+9,Y(dy+.5)+7,5.6,'#1a1208','left')}}
  api.title(x,'Under the Well','Tunnels below Thornwick');
  api.panel(x,392,38,84,56);api.text(x,'KEY',434,47,7,MPL.VERM);
  const kx=402;
  x.save();x.fillStyle='#d8dfe8';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillRect(kx-5,55,10,6);x.strokeRect(kx-5,55,10,6);x.restore();api.text(x,'Passage',kx+9,58,5.6,'#2a1a0c','left');
  mpQhChest(x,kx,70,'#a8742e',1);api.text(x,'Chest',kx+9,70,5.6,'#2a1a0c','left');
  mpQhDoor(x,kx,82,.8);api.text(x,'Way out',kx+9,82,5.6,'#2a1a0c','left');
  api.compass(x,436,130,13);
}});

/* ---- The Rat Catcher's Cat: a hungry cat sits in a dead end under the well, and a salt herring lies in another ---- */
QUESTS.twq_cat={title:"The Rat Catcher's Cat",who:'A hungry cat',desc:"A thin tabby cat sits in a dead end in the tunnels under the Thornwick well. She is hungry. Find a salt herring, which is lying in another dead end in the tunnels (or buy one), and bring it to her.",need:1,goal:()=>(bagCount('herring')>0||G.flags.twCatFed)?1:0,reward:{gold:1200,xp:4500,items:['potion5']}};
QAREA.twq_cat='Thornwick';
const TWCAT=khQD("Mrrow. (A thin tabby cat sits in the dead end with her paws together. She has the look of a cat who used to catch the rats down here and has now run out of rats she is brave enough to catch. She looks at your bag, and then at you.)",
  "Mrr. (She settles down to wait.)",
  (n,m)=>'She wants a salt herring. One lies in another dead end somewhere in the tunnels, and the shops in Thornwick may sell them too.',
  "Mrrow! (She smells the herring through your bag and stands up at once.)",
  "(She eats the herring in four bites, washes her face, and leaves something for you on the floor.)",
  "(The cat is asleep in the corner with a full stomach and a very small smile.)","Give her the herring.");
NPCS.twcat={name:'A hungry cat',img:'pet_cat_0',root:d=>qNode('twq_cat',TWCAT)};
Object.defineProperty(QGIVER,'twcat',{enumerable:true,configurable:true,get(){return qSt('twq_cat')==='done'?null:['twq_cat']}});
{const _t=qTurnIn;qTurnIn=function(id){const r=_t.apply(this,arguments);try{if(r&&id==='twq_cat'){G.flags.twCatFed=1;if(bagCount('herring')>0)bagRemove('herring',1)}}catch(e){console.error(e)}return r}}
