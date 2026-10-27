/* ==========================================================================
   THE BLACK SEA (prefix hgo / HGO), cut out of the Underlevel (level 476). A huge sea of black water (about a third of the level) with a ragged coast of bays and headlands, reefs, pillars, small rocky islets and one
   big island in the middle that holds the great chest; and four rivers of black water, 5 to 7 squares wide, that wind out of the sea through the labyrinth to the far corners, two of them branching.
   Each ladder or letter that would lie inside the sea keeps a headland of land running out to the shore; no walkway or bridge crosses any water. The rivers run alongside the corridors with a wall bank between and end before they
   could meet other water; landings (a short beach where a corridor ends at the water) each hold a boat. The boats work like the ship of the Narrow Sea (embark.js): aboard, with land within eight squares, a Disembark button puts the party ashore and the boat rides at anchor
   off that shore (drawn in the 3D view, kept in G.flags.hgdOcean); ashore, within eight squares of a boat, an Embark button takes the party back aboard. On foot the party cannot wade into the water; in a boat it cannot go on land.
   The horrors (hgd_oceanfoes.js) swim only in the water. Wind and water are loud near the water (hgoWind, hgoSound).
   Map: L._hgdo = {wm (Uint8Array W*H, 1 = water), riv (1 = river water), docks, landings, island, boats, W, H}; hgoWater(x,y) tells if a cell is water.
   ========================================================================== */
const HGO={ID:476,W:201,H:201};
/* ---------- the floors: black water with faint pale ripples, black sand, dark rock, dark planks (128 x 128, seamless) ---------- */
function hgoMakeFloors(){
  if(typeof FLOORS==='undefined'||FLOORS.hgo_water)return;
  const mk=fn=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),id=x.createImageData(128,128),d=id.data,T=Math.PI*2;
    for(let y=0;y<128;y++)for(let X=0;X<128;X++){const o=(y*128+X)*4,v=fn(X,y,T);d[o]=v[0];d[o+1]=v[1];d[o+2]=v[2];d[o+3]=255}return d};
  const hs=(x,y,s)=>{let h=(x*374761393+y*668265263+s*2147483647)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296};
  FLOORS.hgo_water=new Uint8ClampedArray(mk((x,y,T)=>{
    const a=Math.sin(T*(x*2/128)+1.7*Math.sin(T*(y*3/128)+.6)),b=Math.sin(T*(y*3/128+x/128)+1.3*Math.sin(T*(x*2/128)+2.1)),c=Math.sin(T*(x*4/128-y*2/128)+Math.sin(T*(y*5/128)));
    const r=0*(a+b+c),n=hs(x>>1,y>>1,3)*3;
    return [3+n*.3+r*34,6+n*.4+r*46,11+n*.6+r*60]}));
  // rock: cells of broken stone with dark cracks between them (a cellular pattern that tiles), grey-black with a cold tint; the shore is the same stone in smaller pieces
  const cells=(pts,seed)=>{const P=[];for(let i=0;i<pts;i++)P.push([hs(i,1,seed)*128,hs(i,2,seed)*128]);return (X,Y)=>{let d1=1e9,d2=1e9,id=0;for(let i=0;i<P.length;i++){let dx=Math.abs(X-P[i][0]),dy=Math.abs(Y-P[i][1]);if(dx>64)dx=128-dx;if(dy>64)dy=128-dy;const d=Math.hypot(dx,dy);if(d<d1){d2=d1;d1=d;id=i}else if(d<d2)d2=d}return [d2-d1,id]}};
  const rk1=cells(26,41),rk2=cells(70,42);
  FLOORS.hgo_sand=new Uint8ClampedArray(mk((x,y)=>{const [e,id]=rk2(x,y),n=hs(x,y,5);const v=(11+hs(id,3,9)*13+n*5)*(e<1.4?.45:1);return [v,v*.98,v*1.06+1]}));
  FLOORS.hgo_rock=new Uint8ClampedArray(mk((x,y)=>{const [e,id]=rk1(x,y),n=hs(x,y,7);const v=(10+hs(id,4,8)*15+n*6+(e<2.2?0:e*.5))*(e<1.8?.35:1);return [v,v*.98,v*1.07+1]}));}
hgoMakeFloors();
/* ---------- helpers on the finished level ---------- */
const hgoL=()=>{const L=LEVELS[HGO.ID];return L&&L._hgdo?L:null};
function hgoWater(x,y){const L=LEVELS[HGO.ID];if(!L||!L._hgdo||x<0||y<0||x>=HGO.W||y>=HGO.H)return false;return L._hgdo.wm[y*HGO.W+x]===1}
const hgoSec=(x,y)=>{const L=LEVELS[HGO.ID];return L&&L._hgdo&&x>=0&&y>=0&&x<HGO.W&&y<HGO.H?L._hgdo.sec[y*HGO.W+x]:0};
const hgoOn=()=>LEVEL===HGO.ID&&G.flags&&G.flags.hgdOcean&&G.flags.hgdOcean.on;
function hgoFlag(){const F=G.flags,L=hgoL();if(!F.hgdOcean&&L)F.hgdOcean={on:false,cur:-1,boats:L._hgdo.boats.map(b=>[b[0],b[1]])};return F.hgdOcean}
/* ---------- building the sea and the rivers ---------- */
function hgoBuild(L){
  if(L._hgdo)return;let r=null;for(let att=0;att<6&&!r;att++){r=hgoMake(L,att,att===5)}
  if(!r){console.warn('hgo: no sea could be built');return}
}
function hgoMake(L,att,last){
  const W=HGO.W,H=HGO.H,U=L._hgdu,rnd=hgdmRng(476777+att*7919),AMAX=[58,58,54,54,50,46][att],rows=L.rows.map(r=>r.split('')),fm=[];for(let y=0;y<H;y++)fm.push(new Array(W).fill('0'));
  const wm=new Uint8Array(W*H),riv=new Uint8Array(W*H),reg=new Uint8Array(W*H),own=new Int8Array(W*H),ost=new Int16Array(W*H),isle=new Uint8Array(W*H),DV=[[1,0],[-1,0],[0,1],[0,-1]],ix=(x,y)=>y*W+x;
  const keep=U.ladders.map(l=>({x:l.ax,y:l.ay,lad:l})).concat((U.letters||[]).map(l=>({x:l.x,y:l.y,wd:l.wd})));if(L._msgr)keep.push({x:L._msgr.x,y:L._msgr.y});
  const nearKeep=(x,y,m)=>keep.some(k=>Math.hypot(k.x-x,k.y-y)<m);
  const setLand=(x,y,f)=>{if(x<1||y<1||x>=W-1||y>=H-1)return;const ch=rows[y][x];if(ch!=='.'&&ch!=='#')return;rows[y][x]='.';fm[y][x]=f;wm[ix(x,y)]=0;riv[ix(x,y)]=0};
  const setWall=(x,y)=>{if(rows[y][x]!=='.'&&rows[y][x]!=='#')return;rows[y][x]='#';fm[y][x]='0';wm[ix(x,y)]=0;riv[ix(x,y)]=0};
  const setWater=(x,y,isRiv,id)=>{const ch=rows[y][x];if(ch!=='.'&&ch!=='#')return;rows[y][x]='.';fm[y][x]='1';wm[ix(x,y)]=1;if(isRiv)riv[ix(x,y)]=1;own[ix(x,y)]=id};
  const ph=[rnd()*6,rnd()*6,rnd()*6,rnd()*6,rnd()*6],noise=(x,y)=>.12*Math.sin(x*.17+ph[0])+.1*Math.sin(y*.15+ph[1])+.08*Math.sin((x+y)*.11+ph[2])+.07*Math.sin((x-y)*.2+ph[3])+.05*Math.sin(x*.33+y*.29+ph[4]);
  // where the sea goes: the place and size that give the most water with the fewest ladders and letters under it
  let best=null;for(let A=AMAX;A>=44;A-=4){const B=Math.round(A*.875);for(let cx=Math.ceil(1.1*A)+14;cx<=W-Math.ceil(1.1*A)-14;cx+=8)for(let cy=Math.ceil(1.1*B)+14;cy<=H-Math.ceil(1.1*B)-14;cy+=8){let n=0;
      for(let y=cy-B-6;y<=cy+B+6;y+=3)for(let x=cx-A-6;x<=cx+A+6;x+=3){const dx=(x-cx)/A,dy=(y-cy)/B;if(dx*dx+dy*dy<.9+1.3*noise(x,y)&&!nearKeep(x,y,13))n++}
      if(!best||n>best.n)best={cx,cy,A,B,n}}}
  const CX=best.cx,CY=best.cy,A=best.A,B=best.B;
  // each ladder or letter inside the sea keeps a headland of land running out to the shore: no walkway crosses the water
  const regE=(x,y)=>{const dx=(x-CX)/A,dy=(y-CY)/B;return dx*dx+dy*dy<1.1+1.3*noise(x,y)};
  const segs=[];for(const k of keep){if(!regE(k.x,k.y)&&!regE(k.x+8,k.y)&&!regE(k.x-8,k.y)&&!regE(k.x,k.y+8)&&!regE(k.x,k.y-8))continue;let bestA=null,bl=1e9;
    for(let a=0;a<16;a++){const ca=Math.cos(a/16*Math.PI*2),sa=Math.sin(a/16*Math.PI*2);let r=0;while(r<150&&regE(k.x+ca*r,k.y+sa*r))r++;if(r<bl){bl=r;bestA=[k.x+ca*(r+4),k.y+sa*(r+4)]}}
    segs.push([k.x,k.y,bestA[0],bestA[1]])}
  const dSeg=(x,y)=>{let m=1e9;for(const s of segs){const vx=s[2]-s[0],vy=s[3]-s[1],t=Math.max(0,Math.min(1,((x-s[0])*vx+(y-s[1])*vy)/(vx*vx+vy*vy||1)));const d=Math.hypot(x-(s[0]+vx*t),y-(s[1]+vy*t));if(d<m)m=d}return m};
  const dK=(x,y)=>{let m=1e9;for(const k of keep){const d=Math.hypot(x-k.x,y-k.y);if(d<m)m=d}return m};
  for(let y=6;y<=H-7;y++)for(let x=6;x<=W-7;x++){if(regE(x,y)&&dSeg(x,y)>=5&&dK(x,y)>=6){reg[ix(x,y)]=1;if(rows[y][x]==='.'||rows[y][x]==='#')rows[y][x]='#'}}
  for(let y=10;y<=H-11;y++)for(let x=10;x<=W-11;x++){if(!reg[ix(x,y)])continue;const dx=(x-CX)/A,dy=(y-CY)/B;if(dx*dx+dy*dy<.9+1.3*noise(x,y)&&dSeg(x,y)>=9&&dK(x,y)>=11)setWater(x,y,false,1)}
  // distance from the corridors that are left (used to steer the rivers alongside them)
  const dc=new Uint8Array(W*H).fill(15);{const q2=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(rows[y][x]==='.'&&!wm[ix(x,y)]){dc[ix(x,y)]=0;q2.push(ix(x,y))}
    for(let h=0;h<q2.length;h++){const k=q2[h],x=k%W,y=(k/W)|0,v=dc[k];if(v>=14)continue;for(const d of DV){const nx=x+d[0],ny=y+d[1];if(nx<0||ny<0||nx>=W||ny>=H)continue;const nk=ny*W+nx;if(dc[nk]>v+1){dc[nk]=v+1;q2.push(nk)}}}}
  // the biggest open water is where the big island goes
  const dt=new Int16Array(W*H).fill(-1),q=[];for(let i=0;i<W*H;i++)if(!wm[i]){dt[i]=0;q.push(i)}
  for(let h=0;h<q.length;h++){const k=q[h],x=k%W,y=(k/W)|0;for(const d of DV){const nx=x+d[0],ny=y+d[1];if(nx<0||ny<0||nx>=W||ny>=H)continue;const nk=ny*W+nx;if(dt[nk]<0){dt[nk]=dt[k]+1;q.push(nk)}}}
  let ic=[CX,CY],bd=-1;for(let y=30;y<H-30;y++)for(let x=30;x<W-30;x++){const v=dt[ix(x,y)]-Math.hypot(x-CX,y-CY)*.3;if(v>bd){bd=v;ic=[x,y]}}
  const ir=5.2,icx=ic[0],icy=ic[1],isl=[];
  for(let y=icy-8;y<=icy+8;y++)for(let x=icx-8;x<=icx+8;x++){const d=Math.hypot(x-icx,y-icy),a=Math.atan2(y-icy,x-icx),rr=ir+.9*Math.sin(a*3+ph[0])+.7*Math.sin(a*5+ph[1])+.4*Math.sin(a*8+ph[2]);
    if(d<rr&&wm[ix(x,y)]===1){setLand(x,y,'3');isl.push([x,y]);isle[ix(x,y)]=1}}
  const chest=[icx,icy];for(const [dx,dy] of [[3,-2],[-3,2],[2,3],[-2,-3]]){if(rows[icy+dy][icx+dx]==='.'&&wm[ix(icx+dx,icy+dy)]===0)setWall(icx+dx,icy+dy)}
  const nearIsl=(x,y,m)=>Math.hypot(x-icx,y-icy)<ir+m,inSea=(x,y)=>wm[ix(x,y)]===1&&reg[ix(x,y)]===1;
  // pillars, reefs and little rocky islets in the sea
  for(let k=0,n=0;k<1500&&n<70;k++){const x=12+((rnd()*(W-24))|0),y=12+((rnd()*(H-24))|0);if(inSea(x,y)&&!nearIsl(x,y,4)&&DV.every(d=>wm[ix(x+d[0],y+d[1])]===1)){setWall(x,y);n++}}
  for(let k=0,n=0;k<900&&n<20;k++){const hz=rnd()<.5,len=4+((rnd()*8)|0),x=14+((rnd()*(W-30))|0),y=14+((rnd()*(H-30))|0);let ok=true;const cs=[];for(let i=0;i<len;i++){const px=hz?x+i:x,py=hz?y:y+i;if(!inSea(px,py)||nearIsl(px,py,5)){ok=false;break}cs.push([px,py])}if(ok){cs.forEach(c=>setWall(c[0],c[1]));n++}}
  const islets=[];for(let k=0,n=0;k<1500&&n<16;k++){const x=14+((rnd()*(W-28))|0),y=14+((rnd()*(H-28))|0);if(!inSea(x,y)||nearIsl(x,y,10)||islets.some(q=>Math.hypot(q[0]-x,q[1]-y)<16))continue;
    let ok=true;for(let dy=-3;dy<=3&&ok;dy++)for(let dx=-3;dx<=3;dx++)if(!inSea(x+dx,y+dy)){ok=false;break}if(!ok)continue;
    for(const [dx,dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1]]){setLand(x+dx,y+dy,'3');isle[ix(x+dx,y+dy)]=1}if(rnd()<.6)setWall(x-1,y-1);islets.push([x,y]);n++}
  // the rivers: long winding fjords that leave the sea and run alongside the corridors (a wall of rock between), and each ends before it could meet any other water, the edge of the level, or itself.
  // Where a river crosses a corridor the corridor is cut and ends at the bank.
  const ds=new Uint8Array(W*H).fill(14);{const q3=[];for(let i=0;i<W*H;i++)if(wm[i]){ds[i]=0;q3.push(i)}for(let h=0;h<q3.length;h++){const k=q3[h],x=k%W,y=(k/W)|0,v=ds[k];if(v>=13)continue;for(const d of DV){const nx=x+d[0],ny=y+d[1];if(nx<0||ny<0||nx>=W||ny>=H)continue;const nk=ny*W+nx;if(ds[nk]>v+1){ds[nk]=v+1;q3.push(nk)}}}}
  const paths=[];let rid=1;
  const river=(x,y,tx,ty,w,ph0,len,tag,parent)=>{const id=++rid,path=[];let px=x,py=y;
    for(let st=0;st<len;st++){const want=Math.atan2(ty-py,tx-px)+.7*Math.sin(st*.055+ph0)+.3*Math.sin(st*.13+ph0*2);let vx=Math.cos(want),vy=Math.sin(want);
      for(const k of keep){const d=Math.hypot(px-k.x,py-k.y);if(d<22){const f=(22-d)/22*1.5;vx+=(px-k.x)/(d+.1)*f;vy+=(py-k.y)/(d+.1)*f}}
      // keep away from the sea itself (and from other rivers)
      {const ex=Math.round(px),ey=Math.round(py);if(ex>6&&ey>6&&ex<W-7&&ey<H-7&&st>8){const gx=ds[ix(ex+4,ey)]-ds[ix(ex-4,ey)],gy=ds[ix(ex,ey+4)]-ds[ix(ex,ey-4)],gl=Math.hypot(gx,gy);if(gl>0&&ds[ix(ex,ey)]<9){vx+=gx/gl*1.6;vy+=gy/gl*1.6}}}
      // lean toward the corridors, to about three squares from them
      {const ex=Math.round(px),ey=Math.round(py);if(ex>6&&ey>6&&ex<W-7&&ey<H-7){const gx=dc[ix(ex-4,ey)]-dc[ix(ex+4,ey)],gy=dc[ix(ex,ey-4)]-dc[ix(ex,ey+4)],gl=Math.hypot(gx,gy);if(gl>0&&dc[ix(ex,ey)]>=4){vx+=gx/gl*.9;vy+=gy/gl*.9}}}
      const ang0=Math.atan2(vy,vx),r=w/2+.7*Math.sin(st*.11+ph0),R=Math.ceil(r+3);let nx=0,ny=0,ok=false,lastWhy='';
      for(const da of [0,.45,-.45,.9,-.9,1.4,-1.4]){const an=ang0+da;nx=px+Math.cos(an);ny=py+Math.sin(an);if(nx<13||ny<13||nx>W-14||ny>H-14)continue;let stop=false,why='';
        for(let dy=-R;dy<=R&&!stop;dy++)for(let dx=-R;dx<=R;dx++){const cx=Math.round(nx)+dx,cy=Math.round(ny)+dy;if(cx<1||cy<1||cx>=W-1||cy>=H-1)continue;const k=ix(cx,cy),dd=Math.hypot(cx-nx,cy-ny);
          if(dd<=r+1&&(nearKeep(cx,cy,10)||(Math.hypot(cx-icx,cy-icy)<ir+3))){stop=true;why='k'+cx+','+cy;break}
          if(dd<=r+1.3&&wm[k]&&st>22&&own[k]!==id){stop=true;why='f'+cx+','+cy+':'+own[k];break}
          if(dd<=r+1.3&&wm[k]&&own[k]===id&&st-ost[k]>26){stop=true;why='s'+cx+','+cy;break}}
        if(da===0)lastWhy=why;
        if(!stop){ok=true;break}}
      if(!ok)break;px=nx;py=ny;
      for(let dy=-R;dy<=R;dy++)for(let dx=-R;dx<=R;dx++){const cx=Math.round(px)+dx,cy=Math.round(py)+dy;if(cx<7||cy<7||cx>=W-7||cy>=H-7||Math.hypot(cx-px,cy-py)>r)continue;if(!wm[ix(cx,cy)]||st<=22){setWater(cx,cy,true,id);ost[ix(cx,cy)]=st}}
      path.push([px,py,r]);if(Math.hypot(tx-px,ty-py)<7)break}
    paths.push({path,tag,id});return path};
  const coast=[];for(let y=12;y<H-12;y++)for(let x=12;x<W-12;x++){if(wm[ix(x,y)]!==1||riv[ix(x,y)]||!reg[ix(x,y)])continue;if(DV.some(d=>!wm[ix(x+d[0],y+d[1])]&&rows[y+d[1]][x+d[0]]==='#')&&!nearKeep(x,y,17))coast.push([x,y])}
  const used=[],startFor=(tx,ty)=>{const a0=Math.atan2(ty-icy,tx-icx);let bs=null,bv=1e9;for(const c of coast){if(used.some(u=>Math.hypot(u[0]-c[0],u[1]-c[1])<45))continue;let da=Math.abs(Math.atan2(Math.sin(Math.atan2(c[1]-icy,c[0]-icx)-a0),Math.cos(Math.atan2(c[1]-icy,c[0]-icx)-a0)));const hd=Math.atan2(ty-c[1],tx-c[0]);let bad=0;for(let k=3;k<=18;k++){const px=Math.round(c[0]+Math.cos(hd)*k),py=Math.round(c[1]+Math.sin(hd)*k);if(px<0||py<0||px>=W||py>=H||wm[ix(px,py)])bad++}if(bad)continue;const v=da*70-Math.hypot(c[0]-icx,c[1]-icy);if(v<bv){bv=v;bs=c}}if(bs)used.push(bs);return bs};
  const T=[[20,22,182,22],[182,18,184,182],[184,182,20,184],[18,182,20,26]];
  T.forEach((t,i)=>{const tx=t[2]+((rnd()*10-5)|0),ty=t[3]+((rnd()*10-5)|0),s=startFor(t[0],t[1]);if(!s)return;const rv0=rid+1,p=river(s[0],s[1],tx,ty,5+(i%3),rnd()*6,420,'r'+i,1);
    if((i===0||i===2)&&p.length>60){const b=p[(p.length*.45)|0];river(b[0],b[1],i===0?60:150,i===0?188:12,5,rnd()*6,260,'b'+i,rv0)}});
  // only one body of water is kept: the biggest piece (the rest is filled in)
  const sec=new Uint8Array(W*H);let bestQ=null;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!wm[ix(x,y)]||sec[ix(x,y)])continue;const qq=[[x,y]];sec[ix(x,y)]=2;for(let i=0;i<qq.length;i++){const [a,b]=qq[i];for(const d of DV){const nx=a+d[0],ny=b+d[1];if(nx>=0&&ny>=0&&nx<W&&ny<H&&wm[ix(nx,ny)]&&!sec[ix(nx,ny)]){sec[ix(nx,ny)]=2;qq.push([nx,ny])}}}if(!bestQ||qq.length>bestQ.length)bestQ=qq}
  const keepW=new Set(bestQ.map(c=>ix(c[0],c[1])));for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(wm[ix(x,y)]&&!keepW.has(ix(x,y)))setWall(x,y);
  // a bank: no corridor square touches the water (one wall square, at least, between them); a cut corridor simply ends there
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(rows[y][x]!=='.'||wm[ix(x,y)]||isle[ix(x,y)])continue;if(DV.some(d=>wm[ix(x+d[0],y+d[1])]))setWall(x,y)}
  const adjW=new Uint8Array(W*H);for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(DV.some(d=>wm[ix(x+d[0],y+d[1])]))adjW[ix(x,y)]=1;
  // docks: ways in from the labyrinth to the shore of the sea (a straight cut through the rim); the nearest one to the first ladder holds the first boat
  const lad0=U.ladders[0],cand=[];
  for(let y=10;y<H-10;y++)for(let x=10;x<W-10;x++){if(!inSea(x,y)||riv[ix(x,y)])continue;for(const d of DV){const wx=x+d[0],wy=y+d[1];if(rows[wy][wx]!=='#')continue;
      let hit=-1;for(let m=1;m<=30;m++){const px=x+d[0]*m,py=y+d[1]*m;if(px<4||py<4||px>=W-4||py>=H-4)break;if(rows[py][px]==='.'&&!reg[ix(px,py)]&&!wm[ix(px,py)]){hit=m;break}if(rows[py][px]!=='#'&&rows[py][px]!=='.')break;if(wm[ix(px,py)])break}
      if(hit>2)cand.push({wx:x,wy:y,d,hit,dist:Math.hypot(x-lad0.ax,y-lad0.ay)})}}
  cand.sort((a,b)=>a.dist-b.dist);const docks=[];
  const pickDock=c=>{for(let m=1;m<=c.hit;m++){const px=c.wx+c.d[0]*m,py=c.wy+c.d[1]*m;if(rows[py][px]==='#'){rows[py][px]='.';fm[py][px]=m<=2?'2':(reg[ix(px,py)]?'3':'0')}}docks.push({bx:c.wx+c.d[0],by:c.wy+c.d[1],wx:c.wx,wy:c.wy})};
  if(cand.length){pickDock(cand[0]);const rest=cand.slice(1).sort(()=>rnd()-.5);for(const c of rest){if(docks.length>=4)break;if(docks.every(d=>Math.hypot(d.wx-c.wx,d.wy-c.wy)>=40))pickDock(c)}}
  // the labyrinth stays one piece, without crossing any water: every cut-off piece is joined to the main one by the cheapest way through wall, never beside water (the island and the islets stay apart)
  const comp=new Int32Array(W*H).fill(-1),compCells=[];let nc=0;
  const landAt=(x,y)=>rows[y][x]==='.'&&!wm[ix(x,y)];
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!landAt(x,y)||comp[ix(x,y)]>=0)continue;const qq=[ix(x,y)];comp[ix(x,y)]=nc;for(let i=0;i<qq.length;i++){const k=qq[i],cx=k%W,cy=(k/W)|0;for(const d of DV){const nx=cx+d[0],ny=cy+d[1];if(nx>0&&ny>0&&nx<W-1&&ny<H-1&&landAt(nx,ny)&&comp[ix(nx,ny)]<0){comp[ix(nx,ny)]=nc;qq.push(ix(nx,ny))}}}compCells.push(qq);nc++}
  const mainC=comp[ix(lad0.ax,lad0.ay)];let remaining=0,joined=0;const merged=new Uint8Array(nc);merged[mainC]=1;
  for(let c=0;c<nc;c++)if(c!==mainC){if(isle[compCells[c][0]]){merged[c]=1}else remaining++}
  {const INF=1e9,dist=new Int32Array(W*H).fill(INF),par=new Int32Array(W*H).fill(-1),Bk=[[]];
    const push=(lv,k)=>{while(Bk.length<=lv)Bk.push([]);Bk[lv].push(k)};
    for(const k of compCells[mainC]){dist[k]=0;push(0,k)}
    for(let lv=0;lv<Bk.length&&remaining>0;lv++){for(let i=0;i<Bk[lv].length&&remaining>0;i++){const k=Bk[lv][i];if(dist[k]!==lv)continue;const x=k%W,y=(k/W)|0;
        if(comp[k]>=0&&!merged[comp[k]]){
          let j=k;while(j>=0&&par[j]>=0){const jx=j%W,jy=(j/W)|0;if(!landAt(jx,jy)){rows[jy][jx]='.';fm[jy][jx]=reg[j]?'3':'0'}j=par[j]}
          const c=comp[k];merged[c]=1;remaining--;joined++;for(const m of compCells[c]){dist[m]=lv;par[m]=-1;push(lv,m)}}
        for(const d of DV){const nx=x+d[0],ny=y+d[1];if(nx<2||ny<2||nx>=W-2||ny>=H-2)continue;const nk=ny*W+nx,ch=rows[ny][nx];if(ch!=='#'&&ch!=='.')continue;if(wm[nk]||isle[nk])continue;
          const cst=ch==='.'?0:(adjW[nk]?8:1),nd=lv+cst;if(nd<dist[nk]){dist[nk]=nd;par[nk]=k;push(nd,nk)}}}}
    if(remaining>0){console.warn('hgo: '+remaining+' pieces could not be joined');for(let c=0;c<nc;c++)if(!merged[c])for(const k of compCells[c]){rows[(k/W)|0][k%W]='#'}}}
  // landings: where a corridor ends close to a river, the wall between is opened into a short beach square, and a boat lies in the water there; every river gets at least one
  const boats=[];if(docks.length)boats.push([docks[0].wx,docks[0].wy]);const landings=[];
  for(const P of paths){const cs=[];
    for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(rows[y][x]!=='.'||wm[ix(x,y)]||isle[ix(x,y)]||reg[ix(x,y)])continue;
      for(const d of DV){for(const k of [2,3]){const wx=x+d[0]*k,wy=y+d[1]*k;if(wx<2||wy<2||wx>=W-2||wy>=H-2)break;if(wm[ix(wx,wy)]){if(own[ix(wx,wy)]===P.id&&(k===2||DV.every(d2=>true)))cs.push({x,y,d,k,wx,wy});break}if(rows[y+d[1]*k][x+d[0]*k]!=='#')break}}}
    cs.sort(()=>rnd()-.5);const got=[];for(const gap of [30,20,10,0]){for(const c of cs){if(got.length>=2)break;if(got.every(g=>Math.hypot(g.x-c.x,g.y-c.y)>=gap)&&boats.every(b=>Math.hypot(b[0]-c.wx,b[1]-c.wy)>=Math.max(6,gap/2)))got.push(c)}if(got.length>=1&&gap<=20)break}
    for(const c of got){for(let m=1;m<c.k;m++){const px=c.x+c.d[0]*m,py=c.y+c.d[1]*m;rows[py][px]='.';fm[py][px]='2'}boats.push([c.wx,c.wy]);landings.push({x:c.x+c.d[0]*(c.k-1),y:c.y+c.d[1]*(c.k-1),wx:c.wx,wy:c.wy,river:P.tag})}}
  const riverSteps=paths.reduce((a2,p)=>a2+p.path.length,0);if(!last&&(remaining>0||riverSteps<300||paths.filter(p=>p.path.length>=60).length<3))return null;
  // the enemies that stood where water or rock is now go to the corridors
  const keepE=[],moved=[];for(const e of L.enemies){if(landAt(e.x,e.y)&&!isle[ix(e.x,e.y)])keepE.push(e);else moved.push(e)}L.enemies=keepE;
  L.rows=rows.map(r=>r.join(''));L.fmap=fm.map(r=>r.join(''));
  L.floorSet=[L.floor,'hgo_water','hgo_sand','hgo_rock',L.floor2||L.floor,L.floor];
  L.mapNames=(L.mapNames||[]).concat([{t:'The Black Sea',x:CX,y:CY,k:'place'}]);
  let wcount=0;for(let i=0;i<W*H;i++){if(wm[i]){wcount++;sec[i]=1}else sec[i]=0}
  L._hgdo={reg,riv,wm,sec,nsec:1,boats,landings,W,H,docks,island:{cx:icx,cy:icy,r:ir,cells:isl,chest},islets,rivers:paths.map(p=>({tag:p.tag,n:p.path.length,from:p.path[0]&&[p.path[0][0]|0,p.path[0][1]|0],to:p.path.length&&[p.path[p.path.length-1][0]|0,p.path[p.path.length-1][1]|0]})),keep,moved,joined,water:wcount,isle};
  for(const b of boats)L.decor.push({k:'yar_boat_row',x:b[0],y:b[1],block:false,walk:true,deco:true,sc:1.7,bob:-.22});
  L.decor.push({k:'chest',x:chest[0],y:chest[1],block:true,goldAmt:5000});
  try{hgoPopulate(L)}catch(e){console.error('hgo populate',e)}
  return true}
{const _b=hgduBuild;hgduBuild=function(){const had=!!LEVELS[HGDU.ID];_b.apply(this,arguments);const L=LEVELS[HGDU.ID];if(!had&&L)try{hgoBuild(L)}catch(e){console.error('hgo',e)}}}
if(typeof NPC_H!=='undefined'&&!NPC_H.yar_boat_row)NPC_H.yar_boat_row=.5;
/* ---------- the boats: embark and disembark (every section of water has its own boat) ---------- */
const HGOS={prox:0,proxT:0,src:null,hush:null,next:0};
function hgoLandNear(){ // the nearest shore cell within eight squares: land with water of the party's section beside it
  const P=G.P,s=hgoSec(P.x,P.y);let best=null,bd=1e9;
  for(let dy=-8;dy<=8;dy++)for(let dx=-8;dx<=8;dx++){const d=Math.hypot(dx,dy);if(d>8||d>=bd)continue;const x=P.x+dx,y=P.y+dy;
    if(x<1||y<1||x>=HGO.W-1||y>=HGO.H-1||hgoWater(x,y)||MAPROWS[y][x]!=='.'||cellBlocked(x,y)||enemyAt(x,y))continue;
    let w=null,wd=1e9;for(const q of DIRS){const wx=x+q[0],wy=y+q[1];if(hgoWater(wx,wy)&&!enemyAt(wx,wy)){const dd=Math.hypot(wx-P.x,wy-P.y);if(dd<wd){wd=dd;w=[wx,wy,q]}}}
    if(!w)continue;bd=d;best={x,y,bx:w[0],by:w[1],f:DIRS.findIndex(q=>q[0]===-w[2][0]&&q[1]===-w[2][1])}}
  return best}
function hgoFace(f){G.P.f=f<0?0:f;G.P.angT=(G.P.f-1)*Math.PI/2;G.C={x:G.P.x,y:G.P.y,a:G.P.angT}}
function hgoDisembark(){
  const F=hgoFlag(),t=hgoLandNear();if(!t){msg('There is no shore close enough to land on.','#d09a80');return}
  const k=F.cur>=0?F.cur:hgoSec(G.P.x,G.P.y)-1;F.on=false;F.boats[k]=[t.bx,t.by];F.cur=-1;G.P.x=t.x;G.P.y=t.y;hgoFace(t.f);reveal();hgoSyncBoat();
  msg('You row ashore and tie up. The boat rides at anchor just off the shore.','#a8d8ff');sfx('door')}
function hgoBoatNear(){const F=hgoFlag();let best=-1,bd=1e9;if(!F)return -1;F.boats.forEach((b,i)=>{if(!b)return;const d=Math.hypot(G.P.x-b[0],G.P.y-b[1]);if(d<=8&&d<bd){bd=d;best=i}});return best}
function hgoEmbark(){
  const F=hgoFlag(),k=hgoBoatNear();if(k<0)return;const b=F.boats[k];if(enemyAt(b[0],b[1])){msg('Something is in the water by the boat. You cannot get aboard.','#d09a80');return}
  const f=DIRS.findIndex(q=>q[0]===Math.sign(b[0]-G.P.x)&&q[1]===Math.sign(b[1]-G.P.y));
  F.on=true;F.cur=k;G.P.x=b[0];G.P.y=b[1];hgoFace(f>=0?f:G.P.f);reveal();hgoSyncBoat();
  msg('You climb into the boat. The water is black and deep. Something moves in it.','#9fb8d0');sfx('door')}
function hgoSyncBoat(){ // each anchored boat is drawn where the flags say; the one the party is in is hidden
  if(LEVEL!==HGO.ID||!G.decor)return;const F=hgoL()&&hgoFlag();if(!F)return;let i=0;
  for(const d of G.decor){if(d.k==='yar_boat_row'){const b=F.boats[i];if(b){d.x=b[0];d.y=b[1]}d.hidden=!!(F.on&&F.cur===i);d.block=false;d.walk=true;i++}}}
{const _u=update;update=function(dt){if(LEVEL===HGO.ID)try{hgoSyncBoat()}catch(e){}return _u.apply(this,arguments)}}
{const _db=desertBump;desertBump=function(nx,ny,g){
  try{if(LEVEL===HGO.ID&&hgoL()&&g===0){const on=hgoOn(),w=hgoWater(nx,ny);
      if(on&&!w){sfx('bump');G.shake=.08;msg('The boat cannot go on land. Use Disembark when the shore is near.','#9fc0d0');return true}
      if(!on&&w){sfx('bump');G.shake=.08;msg('The water is black and deep. You cannot wade into it. The boat is the only way.','#9fc0d0');return true}}}catch(e){console.warn('hgo',e)}
  return _db.apply(this,arguments)}}
// a boat does not leave the level
{const _g=goToLevel;goToLevel=function(n,e){const r=_g.apply(this,arguments);try{if(G.flags&&G.flags.hgdOcean&&(LEVEL!==HGO.ID||!hgoWater(G.P.x,G.P.y))){G.flags.hgdOcean.on=false;G.flags.hgdOcean.cur=-1}if(LEVEL===HGO.ID){hgoFlag();hgoSyncBoat()}}catch(x){}return r}}
{const _r=restore;restore=function(sv){const r=_r.apply(this,arguments);try{if(G.flags&&G.flags.hgdOcean&&!(LEVEL===HGO.ID&&hgoWater(G.P.x,G.P.y))){G.flags.hgdOcean.on=false;G.flags.hgdOcean.cur=-1}if(LEVEL===HGO.ID)hgoSyncBoat()}catch(e){}return r}}
/* the buttons (the same place and look as the Narrow Sea's) */
function hgoHud(){
  if(LEVEL!==HGO.ID||!hgoL()||G.state!=='play'||G.cut||G.talk||G.menu||(G.inv&&G.inv.open)||G.loot||G.overview||(typeof TP!=='undefined'&&TP))return;
  const F=hgoFlag();if(!F)return;
  if(F.on){if(!G.enemies.some(e=>e.hp>0&&Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<=2)&&hgoLandNear())btnText('hgodis','Disembark',6,180,100,22)}
  else if(hgoBoatNear()>=0)btnText('hgoemb','Embark',6,180,100,22)}
{const _h=handleBtn;handleBtn=function(id){
  if((id==='hgodis'||id==='hgoemb')&&G.state==='play'&&!G.cut&&!G.talk&&!G.menu&&LEVEL===HGO.ID){if(id==='hgodis')hgoDisembark();else hgoEmbark();return}
  return _h.apply(this,arguments)}}
/* the view: the bow of the boat, bobbing on black water */
function hgoBow(){
  if(!hgoOn()||G.state!=='play'||G.cut||G.talk||G.menu||(G.inv&&G.inv.open)||G.loot||G.overview)return;
  const im=IMG.art_hgdl_bow,t=G.time;if(!im||!im.width)return;
  const w=400,hh=w*im.height/im.width,bob=Math.sin(t*1.3)*1.8+Math.sin(t*.41)*1.3,sway=Math.sin(t*.7)*1.2,x=(420-w)/2+sway;
  ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();
  ctx.strokeStyle='rgba(150,170,190,.35)';ctx.lineWidth=1.2;
  for(let i=0;i<5;i++){const y=150+i*11+Math.sin(t*1.1+i)*1.5,ph=t*.9+i*1.7;for(const s of [0,1]){const bx=s?330:90,dir=s?1:-1;ctx.beginPath();ctx.moveTo(bx+dir*(10+i*14),y);ctx.quadraticCurveTo(bx+dir*(26+i*14),y-2.5+Math.sin(ph)*1.2,bx+dir*(44+i*14),y);ctx.stroke()}}
  ctx.drawImage(im,x,210-hh*.76+bob,w,hh);
  ctx.fillStyle='rgba(2,5,10,.5)';ctx.fillRect(x,210-hh*.76+bob,w,hh);
  ctx.fillStyle='rgba(4,8,14,.7)';const ly=203+Math.sin(t*1.6)*1.2;ctx.fillRect(0,ly,420,210-ly);
  ctx.restore()}
{const _h=uwHud;uwHud=function(){_h.apply(this,arguments);try{hgoBow();hgoHud()}catch(e){}}}
/* steps in a boat are the soft lap of water */
{const _s=sfx;sfx=function(n){if((n==='step'||n==='turn')&&hgoOn()&&AC&&!G.mute&&SNDOPT.steps){
    const v=.8+Math.random()*.4;nz(.34,(n==='step'?.1:.06)*v*SNDOPT.steps,'lowpass',3800*v,1400,0);nz(.3,.06*v*SNDOPT.steps,'highpass',2000*v,3800,.02);nz(.55,.05*v*SNDOPT.steps,'lowpass',900,300,.06);
    return}
  return _s.apply(this,arguments)}}
/* ---------- sound: loud wind and water near the water, quiet in the far corridors ---------- */
function hgoProx(){ // 0 far away, 1 on the water; falls to nothing twelve squares from it
  if(LEVEL!==HGO.ID||!hgoL())return 0;if(hgoOn())return 1;
  const now=(typeof performance!=='undefined'?performance.now():0)/1000;if(now<HGOS.proxT)return HGOS.prox;HGOS.proxT=now+.4;
  let best=99;const P=G.P;for(let dy=-12;dy<=12;dy++)for(let dx=-12;dx<=12;dx++){const d=Math.hypot(dx,dy);if(d<best&&d<=12&&hgoWater(P.x+dx,P.y+dy))best=d}
  HGOS.prox=best>=12?0:Math.pow(1-best/12,1.3);return HGOS.prox}
function hgoWind(){return LEVEL===HGO.ID?.1+1.5*hgoProx():0}
if(typeof WIND_AMT!=='undefined'){try{Object.defineProperty(WIND_AMT,HGO.ID,{get:()=>{const p=hgoProx();return p>0?.1+1.5*p:0},configurable:true,enumerable:true})}catch(e){console.warn('hgo wind',e)}}
function hgoSound(){
  if(!AC||typeof NB==='undefined'||!NB)return;const now=AC.currentTime,p=(G.state==='play'&&!G.mute&&SNDOPT.amb)?hgoProx():0;
  if(!HGOS.src){const mk=(type,f,q)=>{const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;s.loop=true;s.loopStart=Math.random()*.5;fl.type=type;fl.frequency.value=f;fl.Q.value=q;g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(MASTER);s.start();return {s,f:fl,g}};
    HGOS.src=mk('lowpass',300,.7);HGOS.hush=mk('bandpass',1500,.6)}
  const sw=.5+.5*Math.sin(now*.37)*Math.sin(now*.13+1);
  HGOS.src.g.gain.setTargetAtTime(p*(.2+.16*sw),now,.5);HGOS.src.f.frequency.setTargetAtTime(220+300*sw,now,.4);HGOS.hush.g.gain.setTargetAtTime(p*(.025+.05*sw),now,.6);
  if(p>.05&&now>HGOS.next){HGOS.next=now+1.6+Math.random()*3;nz(.7,.12*p,'bandpass',1000,420,0);if(Math.random()<.35)tone(120+Math.random()*80,70,.5,'sine',.05*p,.1)}}
{const _s=seaSoundTick;seaSoundTick=function(){_s.apply(this,arguments);try{hgoSound()}catch(e){}}}
/* ---------- what the people on the surface whisper ---------- */
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.splice(1,0,
 'I buy and sell, so I listen. Word is there is a black sea under the maze, with an island in the middle, and a chest on it worth more gold than a king owns.',
 'Treasure? Below. Down the ladders, along the dark corridors, there is a sea. Nobody who rowed out for the chest came back. Take a boat and a strong stomach, or stay up here.',
 'My cousin went down the ladders for the chest on the black sea. Five thousand gold, she said. That was two years ago, and I still set a place for her.',
 'I am going down for it one day: the big chest on the island in the black sea. Things with red eyes live in the water, they say, but five thousand gold is five thousand gold.',
 'There are smaller chests too, a thousand gold each, along the black rivers under the maze. Whatever guards them is hungry. The big one is on the island.');
if(typeof HGDK_SAY!=='undefined')HGDK_SAY.splice(2,0,'They say there is a chest of gold on an island in a black sea under the maze. A maze that hides gold behind a sea is at least an honest one.');
