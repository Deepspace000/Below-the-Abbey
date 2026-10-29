/* ==========================================================================
   THE NEVER-ENDING TOWER: THE LAYOUTS (prefix ntg). ntGen(n, look) makes the plan of floor n from the floor number alone: a grid of open (1) and closed (0) squares,
   the arrival square with the stairs down beside it, the stairs up far away, the teleport stone, the rooms, the dead ends, and (every 7th floor) a shop room.
   Kinds: dense (a perfect maze with a few loops), semi (a maze with 4 to 9 rooms carved in), sparse (many rooms of different shapes, short corridors, pillared halls),
   spiral (rings with one opening each), cross (a maze or halls in four wings), ring (a wide circuit round a maze), caves (cellular caves).
   Nothing here uses the game: the plan is pure data, so it can be built and tested anywhere. Notes: tools/NT_NOTES.md
   ========================================================================== */
const NTG_D=[[0,-1],[1,0],[0,1],[-1,0]];
function ntgGrid(W,H){return {W,H,a:new Uint8Array(W*H)}}
const ntgAt=(G,x,y)=>x>=0&&y>=0&&x<G.W&&y<G.H&&G.a[y*G.W+x]===1;
const ntgSet=(G,x,y,v)=>{if(x>=1&&y>=1&&x<G.W-1&&y<G.H-1)G.a[y*G.W+x]=v};
function ntgRect(G,x0,y0,x1,y1,v){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)ntgSet(G,x,y,v===undefined?1:v)}
/* a maze on the lattice of odd squares, inside a mask (a function x,y -> bool, or null for the whole plan). The growing tree: newest-first with probability pNew, else a random cell,
   so that pNew near 1 makes long winding corridors and pNew near 0 makes many short branches. */
function ntgMaze(G,R,mask,pNew,box){
  const W=G.W,H=G.H,bx0=box?box[0]:1,by0=box?box[1]:1,bx1=box?box[2]:W-2,by1=box?box[3]:H-2;
  const ok=(x,y)=>x>=bx0&&y>=by0&&x<=bx1&&y<=by1&&x%2===1&&y%2===1&&(!mask||mask(x,y));
  const seen=new Set(),key=(x,y)=>y*W+x,cells=[];
  let sx=-1,sy=-1;
  for(let t=0;t<200&&sx<0;t++){const x=(R.int(bx0,bx1)|1),y=(R.int(by0,by1)|1);if(ok(x,y)){sx=x;sy=y}}
  if(sx<0)for(let y=by0|1;y<=by1&&sx<0;y+=2)for(let x=bx0|1;x<=bx1;x+=2)if(ok(x,y)){sx=x;sy=y;break}
  if(sx<0)return [];
  // a mask may be in several pieces: grow from each piece in turn
  const grow=(x0,y0)=>{
    const list=[[x0,y0]];seen.add(key(x0,y0));ntgSet(G,x0,y0,1);cells.push([x0,y0]);
    while(list.length){
      const i=R()<pNew?list.length-1:Math.floor(R()*list.length),[x,y]=list[i];
      const nb=[];for(const [dx,dy] of NTG_D){const nx=x+dx*2,ny=y+dy*2;if(ok(nx,ny)&&!seen.has(key(nx,ny)))nb.push([nx,ny,dx,dy])}
      if(!nb.length){list.splice(i,1);continue}
      const [nx,ny,dx,dy]=nb[Math.floor(R()*nb.length)];
      ntgSet(G,x+dx,y+dy,1);ntgSet(G,nx,ny,1);seen.add(key(nx,ny));list.push([nx,ny]);cells.push([nx,ny])}};
  grow(sx,sy);
  for(let y=by0|1;y<=by1;y+=2)for(let x=bx0|1;x<=bx1;x+=2)if(ok(x,y)&&!seen.has(key(x,y)))grow(x,y);
  return cells}
/* braid: dead ends are opened into a neighbouring corridor with probability p (a maze with loops) */
function ntgBraid(G,R,p){
  const W=G.W,H=G.H;
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){
    if(!ntgAt(G,x,y))continue;
    let n=0;for(const [dx,dy] of NTG_D)if(ntgAt(G,x+dx,y+dy))n++;
    if(n!==1||!R.chance(p))continue;
    const c=[];for(const [dx,dy] of NTG_D){if(ntgAt(G,x+dx,y+dy))continue;const ax=x+dx*2,ay=y+dy*2;if(ntgAt(G,ax,ay)&&ax>0&&ay>0&&ax<W-1&&ay<H-1)c.push([dx,dy])}
    if(c.length){const [dx,dy]=c[Math.floor(R()*c.length)];ntgSet(G,x+dx,y+dy,1)}}}
/* shapes of rooms: they return the list of squares [x,y] */
function ntgShape(R,kind,w,h){
  const o=[],cx=(w-1)/2,cy=(h-1)/2;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    let ok=true;
    if(kind==='ellipse')ok=((x-cx)/(w/2))**2+((y-cy)/(h/2))**2<=1.02;
    else if(kind==='plus')ok=(Math.abs(x-cx)<=w/6+.6)||(Math.abs(y-cy)<=h/6+.6);
    else if(kind==='ell')ok=!(x>=w/2&&y<h/2);
    else if(kind==='oct'){const m=Math.min(w,h)/3;ok=!(x+y<m||(w-1-x)+y<m||x+(h-1-y)<m||(w-1-x)+(h-1-y)<m)}
    else if(kind==='tee')ok=y<h/3||Math.abs(x-cx)<=w/6+.6;
    if(ok)o.push([x,y])}
  return o}
const NTG_SHAPES=['rect','rect','rect','ellipse','plus','ell','oct','tee'];
/* pillars in a room: columns on a lattice with the given stride, so that no stretch of open floor is wide */
function ntgPillars(G,R,sq,x0,y0,w,h,stride){
  const inSet=new Set(sq.map(([x,y])=>(y+y0)*G.W+(x+x0))),ox=R.int(0,stride-1),oy=R.int(0,stride-1);
  for(const [x,y] of sq){
    if((x+ox)%stride!==Math.floor(stride/2)||(y+oy)%stride!==Math.floor(stride/2))continue;
    const gx=x+x0,gy=y+y0;let edge=false;
    for(const [dx,dy] of NTG_D)if(!inSet.has((gy+dy)*G.W+(gx+dx)))edge=true;   // never against a wall
    if(!edge)G.a[gy*G.W+gx]=0}}
/* a window of 8 by 8 open squares is broken up by a pillar (or two): no open floor is wider than about 7 */
function ntgBreakOpen(G,R,S){
  S=S||8;const W=G.W,H=G.H;let guard=0,placed=0;
  while(guard++<40){
    const P=new Int32Array((W+1)*(H+1));
    for(let y=0;y<H;y++)for(let x=0;x<W;x++)P[(y+1)*(W+1)+x+1]=P[y*(W+1)+x+1]+P[(y+1)*(W+1)+x]-P[y*(W+1)+x]+G.a[y*W+x];
    const full=(x,y)=>P[(y+S)*(W+1)+x+S]-P[y*(W+1)+x+S]-P[(y+S)*(W+1)+x]+P[y*(W+1)+x]===S*S;
    let any=false;
    for(let y=1;y+S<=H-1;y++)for(let x=1;x+S<=W-1;x++){
      if(!full(x,y))continue;any=true;
      const px=x+Math.floor(S/2)-1+R.int(0,1),py=y+Math.floor(S/2)-1+R.int(0,1);G.a[py*W+px]=0;placed++;
      // a second pillar in a wider hall so that the next window along does not need its own at once
      y+=2;break}
    if(!any)break}
  return placed}
/* the largest connected part is kept; the rest is filled in */
function ntgKeepLargest(G){
  const W=G.W,H=G.H,lab=new Int32Array(W*H).fill(-1),sizes=[];
  for(let i=0;i<W*H;i++){
    if(G.a[i]!==1||lab[i]>=0)continue;
    const id=sizes.length;let n=0;const st=[i];lab[i]=id;
    while(st.length){const c=st.pop();n++;const x=c%W,y=(c/W)|0;
      for(const [dx,dy] of NTG_D){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=ny*W+nx;if(G.a[j]===1&&lab[j]<0){lab[j]=id;st.push(j)}}}
    sizes.push(n)}
  if(sizes.length<=1)return;
  let best=0;for(let i=1;i<sizes.length;i++)if(sizes[i]>sizes[best])best=i;
  for(let i=0;i<W*H;i++)if(G.a[i]===1&&lab[i]!==best)G.a[i]=0}
/* join separate parts with a straight cut (used where a plan can leave parts apart) */
function ntgJoin(G,R){
  for(let guard=0;guard<30;guard++){
    const W=G.W,H=G.H,lab=new Int32Array(W*H).fill(-1);let comps=0;const reps=[];
    for(let i=0;i<W*H;i++){if(G.a[i]!==1||lab[i]>=0)continue;const st=[i];lab[i]=comps;reps.push(i);
      while(st.length){const c=st.pop(),x=c%W,y=(c/W)|0;for(const [dx,dy] of NTG_D){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=ny*W+nx;if(G.a[j]===1&&lab[j]<0){lab[j]=comps;st.push(j)}}}comps++}
    if(comps<=1)return;
    // join component 0 to the nearest other: dig between the two nearest squares
    let bd=1e9,ba=null,bb=null;
    const A=[],B=[];for(let i=0;i<W*H;i++)if(G.a[i]===1){(lab[i]===0?A:B).push(i)}
    for(let t=0;t<2500;t++){const a=A[Math.floor(R()*A.length)],b=B[Math.floor(R()*B.length)],d=Math.abs(a%W-b%W)+Math.abs(((a/W)|0)-((b/W)|0));if(d<bd){bd=d;ba=a;bb=b}}
    let x=ba%W,y=(ba/W)|0;const tx=bb%W,ty=(bb/W)|0;
    while(x!==tx){x+=x<tx?1:-1;ntgSet(G,x,y,1)}while(y!==ty){y+=y<ty?1:-1;ntgSet(G,x,y,1)}}}
/* a corridor between two squares: along x then y (or y then x), one wide, now and then two */
function ntgCorridor(G,R,ax,ay,bx,by,wide){
  let x=ax,y=ay;const xf=R()<.5,seg=(x0,y0,x1,y1)=>{const sx=Math.sign(x1-x0),sy=Math.sign(y1-y0);let cx=x0,cy=y0;
    for(;;){ntgSet(G,cx,cy,1);if(wide){ntgSet(G,cx+(sy?1:0),cy+(sx?1:0),1)}if(cx===x1&&cy===y1)break;if(cx!==x1)cx+=sx;else cy+=sy}};
  if(xf){seg(ax,ay,bx,ay);seg(bx,ay,bx,by)}else{seg(ax,ay,ax,by);seg(ax,by,bx,by)}}
/* ---------- the kinds ---------- */
function ntgDense(G,R,P){ntgMaze(G,R,null,P.pNew);ntgBraid(G,R,P.braid);
  const k=R.int(0,2);for(let i=0;i<k;i++){const w=R.pick([3,3,5]),h=R.pick([3,3,5]),x=R.int(2,G.W-w-3)|1,y=R.int(2,G.H-h-3)|1;ntgRect(G,x,y,x+w-1,y+h-1,1);P.rooms.push({x0:x,y0:y,x1:x+w-1,y1:y+h-1,kind:'cell'})}}
function ntgSemi(G,R,P){
  ntgMaze(G,R,null,P.pNew);ntgBraid(G,R,P.braid);
  const k=R.int(4,9);let tries=0;
  while(P.rooms.length<k&&tries++<300){
    const w=R.pick([3,5,5,7,7,9]),h=R.pick([3,5,5,7,9]),x=R.int(2,G.W-w-3)|1,y=R.int(2,G.H-h-3)|1;
    if(P.rooms.some(r=>x<r.x1+3&&x+w-1>r.x0-3&&y<r.y1+3&&y+h-1>r.y0-3))continue;
    const kind=R.pick(['rect','rect','ellipse','oct']);const sq=ntgShape(R,kind,w,h);
    for(const [dx,dy] of sq)ntgSet(G,x+dx,y+dy,1);
    if(w>=7&&h>=7)ntgPillars(G,R,sq,x,y,w,h,3);
    P.rooms.push({x0:x,y0:y,x1:x+w-1,y1:y+h-1,kind})}}
function ntgSparse(G,R,P){
  const W=G.W,H=G.H,target=R.int(11,22),rooms=P.rooms;let tries=0;
  while(rooms.length<target&&tries++<900){
    const big=R()<.2,w=big?R.int(11,20):R.int(4,12),h=big?R.int(8,13):R.int(4,10),x=R.int(2,W-w-3),y=R.int(2,H-h-3);
    if(x<2||y<2)continue;
    if(rooms.some(r=>x<r.x1+3&&x+w-1>r.x0-3&&y<r.y1+3&&y+h-1>r.y0-3))continue;
    const kind=big?'rect':R.pick(NTG_SHAPES);const sq=ntgShape(R,kind,w,h);
    for(const [dx,dy] of sq)ntgSet(G,x+dx,y+dy,1);
    if(Math.min(w,h)>=6)ntgPillars(G,R,sq,x,y,w,h,big?4:3);
    rooms.push({x0:x,y0:y,x1:x+w-1,y1:y+h-1,kind,big})}
  // connect them: each room to its nearest already joined room (a spanning tree of short corridors), then a few more for loops
  const mid=r=>[Math.floor((r.x0+r.x1)/2),Math.floor((r.y0+r.y1)/2)],joined=[0];
  const exit=(r,tx,ty)=>{   // a square just inside the room on the side facing the target
    const [mx,my]=mid(r);let x=mx,y=my;const dx=tx-mx,dy=ty-my;if(Math.abs(dx)>Math.abs(dy)){x=dx>0?r.x1:r.x0}else{y=dy>0?r.y1:r.y0}
    // the nearest open square of the room to that edge point
    return [x,y]};
  const link=(a,b,wide)=>{const [bx,by]=mid(rooms[b]);const [ax,ay]=exit(rooms[a],bx,by);const [cx,cy]=mid(rooms[a]);const [ex,ey]=exit(rooms[b],cx,cy);ntgCorridor(G,R,ax,ay,ex,ey,wide)};
  const rest=[];for(let i=1;i<rooms.length;i++)rest.push(i);
  while(rest.length){
    let bd=1e9,bi=-1,bj=-1;
    for(const i of rest)for(const j of joined){const [ax,ay]=mid(rooms[i]),[bx,by]=mid(rooms[j]),d=Math.abs(ax-bx)+Math.abs(ay-by);if(d<bd){bd=d;bi=i;bj=j}}
    link(bi,bj,R()<.15);joined.push(bi);rest.splice(rest.indexOf(bi),1)}
  for(let k=0;k<R.int(3,6);k++){const a=R.int(0,rooms.length-1),b=R.int(0,rooms.length-1);if(a!==b)link(a,b,false)}
  P.pad=true}
function ntgSpiral(G,R,P){
  const W=G.W,H=G.H,cw=R.pick([1,2,2,3]);let k=0,x0=1,y0=1,x1=W-2,y1=H-2;const rings=[];
  while(x1-x0>=cw*2+4&&y1-y0>=cw*2+4){
    rings.push([x0,y0,x1,y1]);
    for(let t=0;t<cw;t++){for(let x=x0;x<=x1;x++){ntgSet(G,x,y0+t,1);ntgSet(G,x,y1-t,1)}for(let y=y0;y<=y1;y++){ntgSet(G,x0+t,y,1);ntgSet(G,x1-t,y,1)}}
    x0+=cw+1;y0+=cw+1;x1-=cw+1;y1-=cw+1;k++}
  // an opening from each ring to the next: on a different side each time, so that the way winds round
  for(let i=0;i<rings.length-1;i++){const [a0,b0,a1,b1]=rings[i],side=i%4,gap=cw;
    for(let t=0;t<=cw;t++){
      if(side===0){const x=Math.floor((a0+a1)/2)+(i%3)-1;ntgSet(G,x,b0+cw+t-(t===cw?0:0),1);ntgSet(G,x,b0+cw,1)}
      else if(side===1){const y=Math.floor((b0+b1)/2)+(i%3)-1;ntgSet(G,a1-cw-0,y,1);ntgSet(G,a1-cw,y,1)}
      else if(side===2){const x=Math.floor((a0+a1)/2)-(i%3)+1;ntgSet(G,x,b1-cw,1)}
      else{const y=Math.floor((b0+b1)/2)-(i%3)+1;ntgSet(G,a0+cw,y,1)}}}
  const last=rings[rings.length-1];if(last){const rx0=last[0]+cw+1,ry0=last[1]+cw+1,rx1=last[2]-cw-1,ry1=last[3]-cw-1;if(rx1>rx0&&ry1>ry0){ntgRect(G,rx0,ry0,rx1,ry1,1);P.rooms.push({x0:rx0,y0:ry0,x1:rx1,y1:ry1,kind:'rect',centre:true})}}
  // a few cuts through the walls between rings, so that there is more than one way round
  for(let c=0;c<R.int(3,7);c++){const r=R.int(0,Math.max(0,rings.length-2)),q=rings[r];if(!q)continue;const side=R.int(0,3),t=R.int(0,1000)/1000;
    if(side===0)ntgSet(G,Math.floor(q[0]+2+t*(q[2]-q[0]-4)),q[1]+cw,1);else if(side===1)ntgSet(G,q[2]-cw,Math.floor(q[1]+2+t*(q[3]-q[1]-4)),1);
    else if(side===2)ntgSet(G,Math.floor(q[0]+2+t*(q[2]-q[0]-4)),q[3]-cw,1);else ntgSet(G,q[0]+cw,Math.floor(q[1]+2+t*(q[3]-q[1]-4)),1)}
  P.spiral=true}
function ntgCross(G,R,P){
  const W=G.W,H=G.H,bw=R.pick([11,13,15]),cx=Math.floor(W/2),cy=Math.floor(H/2);
  const inMask=(x,y)=>Math.abs(x-cx)<=bw/2||Math.abs(y-cy)<=bw/2;
  if(R()<.55){ntgMaze(G,R,inMask,P.pNew);ntgBraid(G,R,P.braid)}
  else{   // four wings of halls
    const mk=(x,y,w,h,kind)=>{const sq=ntgShape(R,kind,w,h);for(const [dx,dy] of sq)ntgSet(G,x+dx,y+dy,1);if(Math.min(w,h)>=6)ntgPillars(G,R,sq,x,y,w,h,3);P.rooms.push({x0:x,y0:y,x1:x+w-1,y1:y+h-1,kind})};
    mk(cx-6,cy-6,13,13,'oct');
    for(const [dx,dy] of NTG_D){let d=8+R.int(0,2);while(d<Math.min(W,H)/2-8){const w=dx?R.int(7,10):R.int(5,9),h=dx?R.int(5,9):R.int(7,10);
        const x=dx>0?cx+d:dx<0?cx-d-w+1:cx-Math.floor(w/2),y=dy>0?cy+d:dy<0?cy-d-h+1:cy-Math.floor(h/2);mk(x,y,w,h,R.pick(['rect','ellipse','plus']));
        for(let t=0;t<2;t++){ntgSet(G,dx?cx+(dx>0?d-1:-d+1):cx,dx?cy:cy+(dy>0?d-1:-d+1),1)}d+=Math.max(w,h)+2}}
    // straight halls along the axes
    for(let x=2;x<W-2;x++)ntgSet(G,x,cy,1);for(let y=2;y<H-2;y++)ntgSet(G,cx,y,1);P.pad=true}}
function ntgRing(G,R,P){
  const W=G.W,H=G.H,rw=R.pick([3,3,5]),m=2;
  ntgRect(G,m,m,W-1-m,m+rw-1,1);ntgRect(G,m,H-m-rw,W-1-m,H-1-m,1);ntgRect(G,m,m,m+rw-1,H-1-m,1);ntgRect(G,W-m-rw,m,W-1-m,H-1-m,1);
  const inner=[m+rw+1,m+rw+1,W-m-rw-2,H-m-rw-2];
  ntgMaze(G,R,null,P.pNew,inner);ntgBraid(G,R,P.braid);
  for(let k=0;k<4;k++){const side=k,t=R.int(8,Math.max(9,Math.min(W,H)-9));
    if(side===0)ntgRect(G,t,m+rw,t,m+rw+1,1);else if(side===1)ntgRect(G,W-m-rw-2,t,W-m-rw-1,t,1);else if(side===2)ntgRect(G,t,H-m-rw-2,t,H-m-rw-1,1);else ntgRect(G,m+rw,t,m+rw+1,t,1)}
  // the pillars of the circuit: a column every few squares, so that it is a colonnade
  for(let x=m+2;x<W-m-2;x+=4){if(rw>=5){ntgSet(G,x,m+2,0);ntgSet(G,x,H-m-3,0)}}
  for(let y=m+2;y<H-m-2;y+=4){if(rw>=5){ntgSet(G,m+2,y,0);ntgSet(G,W-m-3,y,0)}}
  P.rooms.push({x0:m,y0:m,x1:m+rw-1,y1:m+rw-1,kind:'rect'})}
function ntgCaves(G,R,P){
  const W=G.W,H=G.H,fill=.5+R()*.06;let a=new Uint8Array(W*H);
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)a[y*W+x]=R()<fill?1:0;
  for(let it=0;it<4;it++){const b=new Uint8Array(W*H);
    for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){let n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)n+=a[(y+dy)*W+x+dx];b[y*W+x]=(n>=5)?1:0}
    a=b}
  G.a=a;for(let x=0;x<W;x++){G.a[x]=0;G.a[(H-1)*W+x]=0}for(let y=0;y<H;y++){G.a[y*W]=0;G.a[y*W+W-1]=0}
  // thin walls between the caverns are the pillars; the open parts are joined at the end (ntgKeepLargest, ntgJoin)
  P.caves=true}
/* ---------- a plan ---------- */
const NTG_SIZE={dense:[41,75],semi:[45,85],sparse:[44,80],spiral:[51,71],cross:[53,79],ring:[55,79],caves:[48,80]};
function ntgDims(R,kind){const s=NTG_SIZE[kind];let W=R.int(s[0],s[1]),H=R.int(s[0],s[1]);if(kind==='spiral'||kind==='ring'){H=Math.min(H,W+6);W=Math.min(W,H+6)}
  if(kind==='dense'||kind==='semi'||kind==='cross'){W|=1;H|=1}return [W,H]}
function ntGen(n,look){
  const R=ntRng(ntSeed(n,41)),kind=look.kind;
  let [W,H]=ntgDims(R,kind);
  const shop=n>0&&n%NT.SHOP_EVERY===0,SH=shop?10:0;     // a shop floor has a strip at the foot of the plan for the shop room
  if(shop){H+=SH;if(kind==='dense'||kind==='semi'||kind==='cross')H|=1}
  const G=ntgGrid(W,H),P={rooms:[],pNew:.45+R()*.5,braid:kind==='dense'?.25+R()*.3:.05+R()*.2,kind};
  const sub=ntgGrid(W,H-SH);G.a=new Uint8Array(W*H);
  // the plan is made on the upper part; the shop strip is carved afterwards
  const Gp={W,H:H-SH,a:new Uint8Array(W*(H-SH))};
  ({dense:ntgDense,semi:ntgSemi,sparse:ntgSparse,spiral:ntgSpiral,cross:ntgCross,ring:ntgRing,caves:ntgCaves})[kind](Gp,R,P);
  ntgKeepLargest(Gp);if(P.pad||P.caves||kind==='sparse')ntgJoin(Gp,R);
  ntgBreakOpen(Gp,R,8);ntgKeepLargest(Gp);
  G.a.set(Gp.a);
  // the border is solid
  for(let x=0;x<W;x++){G.a[x]=0;G.a[(H-1)*W+x]=0}for(let y=0;y<H;y++){G.a[y*W]=0;G.a[y*W+W-1]=0}
  const out={n,kind,W,H,G,rooms:P.rooms,shop:null,P};
  if(shop)ntgShopRoom(G,R,out,H-SH);
  ntgStairs(G,R,out);
  return out}
/* the shop room: in the foot strip, with a door cut up to the nearest open square of the plan */
function ntgShopRoom(G,R,out,y0){
  const W=G.W,w=R.pick([9,11]),h=6,x=R.int(3,W-w-4),y=y0+2;
  // clear the strip
  for(let yy=y0;yy<G.H-1;yy++)for(let xx=1;xx<W-1;xx++)G.a[yy*W+xx]=0;
  ntgRect(G,x,y,x+w-1,y+h-1,1);
  // dig up from the middle of the top edge until an open square is met
  const mx=x+Math.floor(w/2);let cy=y-1,guard=0;while(cy>1&&!ntgAt(G,mx,cy)&&guard++<40){ntgSet(G,mx,cy,1);cy--}
  if(!ntgAt(G,mx,cy)||cy<=1){}
  out.shop={x0:x,y0:y,x1:x+w-1,y1:y+h-1,door:{x:mx,y:y-1}}}
/* the stairs: down beside the arrival square, up at the far end; a teleport stone near the arrival */
function ntgBfs(G,sx,sy){
  const W=G.W,H=G.H,d=new Int32Array(W*H).fill(-1),q=[sy*W+sx];d[sy*W+sx]=0;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [dx,dy] of NTG_D){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=ny*W+nx;if(G.a[j]===1&&d[j]<0){d[j]=d[c]+1;q.push(j)}}}
  return d}
function ntgDoorSpots(G,minY,maxY){   // wall squares with exactly one open neighbour and a way on behind that neighbour
  const W=G.W,out=[];
  for(let y=Math.max(0,minY);y<Math.min(G.H,maxY);y++)for(let x=0;x<W;x++){
    if(G.a[y*W+x]===1)continue;let n=0,dir=-1;
    for(let f=0;f<4;f++)if(ntgAt(G,x+NTG_D[f][0],y+NTG_D[f][1])){n++;dir=f}
    if(n!==1)continue;
    const ix=x+NTG_D[dir][0],iy=y+NTG_D[dir][1];let m=0;for(const [dx,dy] of NTG_D)if(ntgAt(G,ix+dx,iy+dy))m++;
    if(m<2)continue;
    out.push({x,y,ix,iy,f:dir})}      // f: the way to face standing at the inner square with the door behind you
  return out}
function ntgStairs(G,R,out){
  const W=G.W,H=G.H,limY=out.shop?out.shop.y0-3:H;
  const spots=ntgDoorSpots(G,0,limY);
  if(!spots.length)throw new Error('nt: no place for stairs on floor '+out.n);
  const a=spots[Math.floor(R()*spots.length)];
  const d=ntgBfs(G,a.ix,a.iy);let mx=0;for(let i=0;i<d.length;i++)if(d[i]>mx)mx=d[i];
  const far=spots.filter(s=>d[s.iy*W+s.ix]>=mx*.82&&Math.abs(s.x-a.x)+Math.abs(s.y-a.y)>12);
  const pool=far.length?far:spots.filter(s=>d[s.iy*W+s.ix]>=mx*.6&&s!==a);
  const b=(pool.length?pool:spots.filter(s=>s!==a))[Math.floor(R()*(pool.length?pool.length:Math.max(1,spots.length-1)))]||spots[spots.length-1];
  out.down={x:a.x,y:a.y,ix:a.ix,iy:a.iy,f:a.f};out.up={x:b.x,y:b.y,ix:b.ix,iy:b.iy,f:b.f};
  // the stone: three or four steps from the arrival, not in the line of the stair
  const cand=[];for(let i=0;i<d.length;i++)if(d[i]>=3&&d[i]<=5){const x=i%W,y=(i/W)|0;if(!(x===out.up.ix&&y===out.up.iy))cand.push([x,y,d[i]])}
  const c=cand.length?cand[Math.floor(R()*cand.length)]:[a.ix,a.iy,0];
  out.stone={x:c[0],y:c[1]};out.dist=d;out.maxDist=mx}
/* a text picture of a plan for the tests and the notes */
function ntgAscii(o){const W=o.W,H=o.H,rows=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){let c=o.G.a[y*W+x]?'.':'#';if(o.down&&x===o.down.x&&y===o.down.y)c='v';if(o.up&&x===o.up.x&&y===o.up.y)c='^';if(o.stone&&x===o.stone.x&&y===o.stone.y)c='T';s+=c}rows.push(s)}return rows.join('\n')}
