/* ==========================================================================
   THE BLACK SEA (prefix hgo / HGO), cut out of the Underlevel (level 476). A huge sea of black water (about a third of the level) with a ragged coast of bays and headlands, reefs, pillars, small rocky islets and one
   big island in the middle that holds the great chest; and four rivers of black water, 5 to 7 squares wide, that wind out of the sea through the labyrinth to the far corners, two of them branching.
   Wherever a ladder or a Messenger letter would be under water it stands on a little rock islet joined to the shore by a one-square causeway of planks. Six more plank causeways cross the rivers: they cut the water into
   sections, and every section has its own boat. The boats work like the ship of the Narrow Sea (embark.js): aboard, with land within eight squares, a Disembark button puts the party ashore and the boat rides at anchor
   off that shore (drawn in the 3D view, kept in G.flags.hgdOcean); ashore, within eight squares of a boat, an Embark button takes the party back aboard. On foot the party cannot wade into the water; in a boat it cannot go on land.
   The horrors (hgd_oceanfoes.js) swim only in the water. Wind and water are loud near the water (hgoWind, hgoSound).
   Map: L._hgdo = {wm (Uint8Array W*H, 1 = water), riv (1 = river water), causeways:[[x,y]...], docks, island, sec, secBoat, W, H}; hgoWater(x,y) tells if a cell is water.
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
    const r=Math.pow(Math.max(0,(a*.5+b*.35+c*.25)),9)*1.9,n=hs(x>>1,y>>1,3)*5;
    return [3+n*.3+r*34,6+n*.4+r*46,11+n*.6+r*60]}));
  FLOORS.hgo_sand=new Uint8ClampedArray(mk((x,y)=>{const n=hs(x,y,5),m=hs(x>>2,y>>2,6);const v=12+n*14+m*8;return [v,v*.97,v*1.05+2]}));
  FLOORS.hgo_rock=new Uint8ClampedArray(mk((x,y,T)=>{const n=hs(x>>1,y>>1,7),cr=Math.abs(Math.sin(T*(x*3/128+y*2/128)+2*Math.sin(T*y*2/128)));const v=17+n*12-(cr<.06?9:0);return [v,v*.98,v*1.04]}));
  FLOORS.hgo_plank=new Uint8ClampedArray(mk((x,y)=>{const bd=Math.floor(y/16),n=hs(x>>1,y>>1,9),g=hs(bd,0,10),edge=(y%16<1)?-12:0,v=34+g*14+n*8+edge;return [v*1.2,v*.82,v*.52]}))}
hgoMakeFloors();
/* ---------- helpers on the finished level ---------- */
const hgoL=()=>{const L=LEVELS[HGO.ID];return L&&L._hgdo?L:null};
function hgoWater(x,y){const L=LEVELS[HGO.ID];if(!L||!L._hgdo||x<0||y<0||x>=HGO.W||y>=HGO.H)return false;return L._hgdo.wm[y*HGO.W+x]===1}
const hgoSec=(x,y)=>{const L=LEVELS[HGO.ID];return L&&L._hgdo&&x>=0&&y>=0&&x<HGO.W&&y<HGO.H?L._hgdo.sec[y*HGO.W+x]:0};
const hgoOn=()=>LEVEL===HGO.ID&&G.flags&&G.flags.hgdOcean&&G.flags.hgdOcean.on;
function hgoFlag(){const F=G.flags,L=hgoL();if(!F.hgdOcean&&L)F.hgdOcean={on:false,cur:-1,boats:L._hgdo.secBoat.slice(1).map(b=>[b[0],b[1]])};return F.hgdOcean}
/* ---------- building the sea and the rivers ---------- */
function hgoBuild(L){
  if(L._hgdo)return;const W=HGO.W,H=HGO.H,U=L._hgdu,rnd=hgdmRng(476777),rows=L.rows.map(r=>r.split('')),fm=[];for(let y=0;y<H;y++)fm.push(new Array(W).fill('0'));
  const wm=new Uint8Array(W*H),riv=new Uint8Array(W*H),reg=new Uint8Array(W*H),DV=[[1,0],[-1,0],[0,1],[0,-1]],ix=(x,y)=>y*W+x;
  const keep=U.ladders.map(l=>({x:l.ax,y:l.ay,lad:l})).concat((U.letters||[]).map(l=>({x:l.x,y:l.y,wd:l.wd})));if(L._msgr)keep.push({x:L._msgr.x,y:L._msgr.y});
  const nearKeep=(x,y,m)=>keep.some(k=>Math.hypot(k.x-x,k.y-y)<m);
  const setLand=(x,y,f)=>{if(x<1||y<1||x>=W-1||y>=H-1)return;const ch=rows[y][x];if(ch!=='.'&&ch!=='#')return;rows[y][x]='.';fm[y][x]=f;wm[ix(x,y)]=0;riv[ix(x,y)]=0};
  const setWall=(x,y)=>{if(rows[y][x]!=='.'&&rows[y][x]!=='#')return;rows[y][x]='#';fm[y][x]='0';wm[ix(x,y)]=0;riv[ix(x,y)]=0};
  const setWater=(x,y,isRiv)=>{const ch=rows[y][x];if(ch!=='.'&&ch!=='#')return;rows[y][x]='.';fm[y][x]='1';wm[ix(x,y)]=1;if(isRiv)riv[ix(x,y)]=1};
  // the sea: a big ragged ellipse (bays and headlands from the noise) and its rim of wall
  const CX=100,CY=100,A=64,B=56,ph=[rnd()*6,rnd()*6,rnd()*6,rnd()*6,rnd()*6],noise=(x,y)=>.12*Math.sin(x*.17+ph[0])+.1*Math.sin(y*.15+ph[1])+.08*Math.sin((x+y)*.11+ph[2])+.07*Math.sin((x-y)*.2+ph[3])+.05*Math.sin(x*.33+y*.29+ph[4]);
  for(let y=6;y<=H-7;y++)for(let x=6;x<=W-7;x++){const dx=(x-CX)/A,dy=(y-CY)/B,e=dx*dx+dy*dy,n=noise(x,y);if(e<1.1+1.3*n){reg[ix(x,y)]=1;if(rows[y][x]==='.'||rows[y][x]==='#')rows[y][x]='#'}}
  for(let y=9;y<=H-10;y++)for(let x=9;x<=W-10;x++){if(!reg[ix(x,y)])continue;const dx=(x-CX)/A,dy=(y-CY)/B,e=dx*dx+dy*dy;if(e<.9+1.3*noise(x,y))setWater(x,y,false)}
  // a ladder or a letter under the sea stands on a little rock islet (a letter keeps the wall behind it)
  const wallKeep=new Set();for(const k of keep)if(k.wd)wallKeep.add((k.x+k.wd[0])+','+(k.y+k.wd[1]));
  for(const k of keep){const r=k.lad?3.6:2.3;if(!reg[ix(k.x,k.y)]&&!DV.some(d=>wm[ix(k.x+d[0]*4,k.y+d[1]*4)]))continue;
    for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const x=k.x+dx,y=k.y+dy;if(Math.hypot(dx,dy)>r||wallKeep.has(x+','+y))continue;if(reg[ix(x,y)]||wm[ix(x,y)])setLand(x,y,'3')}}
  // the biggest open water is where the big island goes
  const dt=new Int16Array(W*H).fill(-1),q=[];for(let i=0;i<W*H;i++)if(!wm[i]){dt[i]=0;q.push(i)}
  for(let h=0;h<q.length;h++){const k=q[h],x=k%W,y=(k/W)|0;for(const d of DV){const nx=x+d[0],ny=y+d[1];if(nx<0||ny<0||nx>=W||ny>=H)continue;const nk=ny*W+nx;if(dt[nk]<0){dt[nk]=dt[k]+1;q.push(nk)}}}
  let ic=[CX,CY],bd=-1;for(let y=30;y<H-30;y++)for(let x=30;x<W-30;x++){const v=dt[ix(x,y)]-Math.hypot(x-CX,y-CY)*.3;if(v>bd){bd=v;ic=[x,y]}}
  const ir=5.2,icx=ic[0],icy=ic[1],isl=[];
  for(let y=icy-8;y<=icy+8;y++)for(let x=icx-8;x<=icx+8;x++){const d=Math.hypot(x-icx,y-icy),a=Math.atan2(y-icy,x-icx),rr=ir+.9*Math.sin(a*3+ph[0])+.7*Math.sin(a*5+ph[1])+.4*Math.sin(a*8+ph[2]);
    if(d<rr&&wm[ix(x,y)]===1){setLand(x,y,d>rr-1.6?'3':'2');isl.push([x,y])}}
  const chest=[icx,icy];for(const [dx,dy] of [[3,-2],[-3,2],[2,3],[-2,-3]]){if(rows[icy+dy][icx+dx]==='.'&&wm[ix(icx+dx,icy+dy)]===0)setWall(icx+dx,icy+dy)}
  const nearIsl=(x,y,m)=>Math.hypot(x-icx,y-icy)<ir+m,inSea=(x,y)=>wm[ix(x,y)]===1&&reg[ix(x,y)]===1;
  // pillars, reefs and little rocky islets in the sea
  for(let k=0,n=0;k<1500&&n<70;k++){const x=12+((rnd()*(W-24))|0),y=12+((rnd()*(H-24))|0);if(inSea(x,y)&&!nearIsl(x,y,4)&&!nearKeep(x,y,6)&&DV.every(d=>wm[ix(x+d[0],y+d[1])]===1)){setWall(x,y);n++}}
  for(let k=0,n=0;k<900&&n<20;k++){const hz=rnd()<.5,len=4+((rnd()*8)|0),x=14+((rnd()*(W-30))|0),y=14+((rnd()*(H-30))|0);let ok=true;const cs=[];for(let i=0;i<len;i++){const px=hz?x+i:x,py=hz?y:y+i;if(!inSea(px,py)||nearIsl(px,py,5)||nearKeep(px,py,7)){ok=false;break}cs.push([px,py])}if(ok){cs.forEach(c=>setWall(c[0],c[1]));n++}}
  const islets=[];for(let k=0,n=0;k<1500&&n<16;k++){const x=14+((rnd()*(W-28))|0),y=14+((rnd()*(H-28))|0);if(!inSea(x,y)||nearIsl(x,y,10)||nearKeep(x,y,8)||islets.some(q=>Math.hypot(q[0]-x,q[1]-y)<16))continue;
    let ok=true;for(let dy=-3;dy<=3&&ok;dy++)for(let dx=-3;dx<=3;dx++)if(!inSea(x+dx,y+dy)){ok=false;break}if(!ok)continue;
    for(const [dx,dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1]])setLand(x+dx,y+dy,'3');if(rnd()<.6)setWall(x-1,y-1);islets.push([x,y]);n++}
  // the rivers: four of them leave the sea for the far corners, winding; two of them branch
  const paths=[],carveDisk=(x,y,r)=>{for(let dy=-Math.ceil(r);dy<=Math.ceil(r);dy++)for(let dx=-Math.ceil(r);dx<=Math.ceil(r);dx++){const px=Math.round(x)+dx,py=Math.round(y)+dy;if(Math.hypot(px-x,py-y)>r||px<7||py<7||px>=W-7||py>=H-7)continue;if(nearKeep(px,py,7.5))continue;if(Math.hypot(px-icx,py-icy)<ir+3)continue;setWater(px,py,true)}};
  const river=(x,y,tx,ty,w,ph0,len,tag)=>{const path=[];let ang=Math.atan2(ty-y,tx-x),px=x,py=y;
    for(let st=0;st<len;st++){const want=Math.atan2(ty-py,tx-px)+1.05*Math.sin(st*.055+ph0)+.45*Math.sin(st*.13+ph0*2);let vx=Math.cos(want),vy=Math.sin(want);
      for(const k of keep){const d=Math.hypot(px-k.x,py-k.y);if(d<22){const f=(22-d)/22*1.6;vx+=(px-k.x)/(d+.1)*f;vy+=(py-k.y)/(d+.1)*f}}
      const nx=px+vx*.9,ny=py+vy*.9;if(nx<12||ny<12||nx>W-13||ny>H-13)break;
      ang=Math.atan2(vy,vx);px+=Math.cos(ang);py+=Math.sin(ang);const r=w/2+.7*Math.sin(st*.11+ph0);carveDisk(px,py,r);path.push([px,py,r]);
      if(Math.hypot(tx-px,ty-py)<7)break}
    paths.push({path,tag});return path};
  const startOf=(tx,ty)=>{const a=Math.atan2(ty-icy,tx-icx);let last=null,seen=false;for(let r=8;r<130;r+=.5){const x=Math.round(icx+Math.cos(a)*r),y=Math.round(icy+Math.sin(a)*r);if(x<8||y<8||x>=W-8||y>=H-8)break;if(wm[ix(x,y)]){last=[x,y];seen=true}else if(seen&&r>20&&!reg[ix(x,y)])break}return last};
  const T=[[20,22,182,22],[182,18,184,182],[184,182,20,184],[18,182,20,26]]; // each river leaves the sea toward one corner and runs on round the edge of the level to the next
  T.forEach((t,i)=>{const tx=t[2]+((rnd()*10-5)|0),ty=t[3]+((rnd()*10-5)|0),s=startOf(t[0],t[1]);if(!s)return;const p=river(s[0],s[1],tx,ty,5+(i%3),rnd()*6,420,'r'+i);
    if((i===0||i===2)&&p.length>70){const b=p[(p.length*.45)|0],bt=i===0?[100,100]:[100,100];river(b[0],b[1],i===0?60:150,i===0?188:12,5,rnd()*6,260,'b'+i)}});
  // six plank causeways across the rivers cut them into sections
  const causeways=[],cwCells=[];
  const bridge=(pi,fr)=>{const P=paths.find(q=>q.tag===pi);if(!P||P.path.length<40)return;const k=Math.max(4,Math.min(P.path.length-4,(P.path.length*fr)|0)),a=P.path[k-3],b=P.path[k+3],tx=b[0]-a[0],ty=b[1]-a[1],tl=Math.hypot(tx,ty)||1,nx=-ty/tl,ny=tx/tl,c=P.path[k],half=c[2]+3,cs=[];
    let lx=null,ly=null;for(let t=-half;t<=half;t+=.4){const x=Math.round(c[0]+nx*t),y=Math.round(c[1]+ny*t);if(lx!==null&&x!==lx&&y!==ly)cs.push([x,ly]);if(x!==lx||y!==ly)cs.push([x,y]);lx=x;ly=y}
    for(const [x,y] of cs){if(x<3||y<3||x>=W-3||y>=H-3)continue;const ch=rows[y][x];if(ch!=='.'&&ch!=='#')continue;if(wm[ix(x,y)]||rows[y][x]==='#'){rows[y][x]='.';fm[y][x]='4';wm[ix(x,y)]=0;riv[ix(x,y)]=0;cwCells.push([x,y])}}
    causeways.push({x:Math.round(c[0]),y:Math.round(c[1]),n:cs.length})};
  [['r0',.5],['r0',.82],['r1',.5],['r2',.55],['r3',.45],['b0',.5]].forEach(a=>bridge(a[0],a[1]));
  // water pieces: the small leftovers are filled in
  const sec=new Int16Array(W*H);let nsec=0;const secSize=[0];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!wm[ix(x,y)]||sec[ix(x,y)])continue;const qq=[[x,y]];sec[ix(x,y)]=-1;for(let i=0;i<qq.length;i++){const [a,b]=qq[i];for(const d of DV){const nx=a+d[0],ny=b+d[1];if(nx>=0&&ny>=0&&nx<W&&ny<H&&wm[ix(nx,ny)]&&!sec[ix(nx,ny)]){sec[ix(nx,ny)]=-1;qq.push([nx,ny])}}}
    if(qq.length<40){for(const c of qq){sec[ix(c[0],c[1])]=0;setWall(c[0],c[1])}}else{nsec++;secSize.push(qq.length);for(const c of qq)sec[ix(c[0],c[1])]=nsec}}
  // docks: ways in from the labyrinth to the shore of the sea (a straight cut through the rim); the nearest one to the first ladder holds the first boat
  const lad0=U.ladders[0],cand=[];
  for(let y=10;y<H-10;y++)for(let x=10;x<W-10;x++){if(!inSea(x,y)||riv[ix(x,y)])continue;for(const d of DV){const wx=x+d[0],wy=y+d[1];if(rows[wy][wx]!=='#')continue;
      let hit=-1;for(let m=1;m<=30;m++){const px=x+d[0]*m,py=y+d[1]*m;if(px<4||py<4||px>=W-4||py>=H-4)break;if(rows[py][px]==='.'&&!reg[ix(px,py)]&&!wm[ix(px,py)]){hit=m;break}if(rows[py][px]!=='#'&&rows[py][px]!=='.')break;if(wm[ix(px,py)])break}
      if(hit>2)cand.push({wx:x,wy:y,d,hit,dist:Math.hypot(x-lad0.ax,y-lad0.ay)})}}
  cand.sort((a,b)=>a.dist-b.dist);const docks=[];
  const pickDock=c=>{for(let m=1;m<=c.hit;m++){const px=c.wx+c.d[0]*m,py=c.wy+c.d[1]*m;if(rows[py][px]==='#'){rows[py][px]='.';fm[py][px]=m<=2?'2':(reg[ix(px,py)]?'3':'0')}}docks.push({bx:c.wx+c.d[0],by:c.wy+c.d[1],wx:c.wx,wy:c.wy,sec:sec[ix(c.wx,c.wy)]})};
  if(cand.length){pickDock(cand[0]);const rest=cand.slice(1).sort(()=>rnd()-.5);for(const c of rest){if(docks.length>=4)break;if(docks.every(d=>Math.hypot(d.wx-c.wx,d.wy-c.wy)>=40))pickDock(c)}}
  // the labyrinth stays one piece: every cut-off piece is joined to the main one by the cheapest way (a wall costs 1, the sea 3, a river 12)
  const comp=new Int32Array(W*H).fill(-1),compCells=[];let nc=0;
  const landAt=(x,y)=>rows[y][x]==='.'&&!wm[ix(x,y)];
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!landAt(x,y)||comp[ix(x,y)]>=0)continue;const qq=[ix(x,y)];comp[ix(x,y)]=nc;for(let i=0;i<qq.length;i++){const k=qq[i],cx=k%W,cy=(k/W)|0;for(const d of DV){const nx=cx+d[0],ny=cy+d[1];if(nx>0&&ny>0&&nx<W-1&&ny<H-1&&landAt(nx,ny)&&comp[ix(nx,ny)]<0){comp[ix(nx,ny)]=nc;qq.push(ix(nx,ny))}}}compCells.push(qq);nc++}
  const mainC=comp[ix(lad0.ax,lad0.ay)];let remaining=nc-1,joined=0;
  {const INF=1e9,dist=new Int32Array(W*H).fill(INF),par=new Int32Array(W*H).fill(-1),merged=new Uint8Array(nc);merged[mainC]=1;const B=[[]];
    const push=(lv,k)=>{while(B.length<=lv)B.push([]);B[lv].push(k)};
    for(const k of compCells[mainC]){dist[k]=0;push(0,k)}
    for(let lv=0;lv<B.length&&remaining>0;lv++){for(let i=0;i<B[lv].length&&remaining>0;i++){const k=B[lv][i];if(dist[k]!==lv)continue;const x=k%W,y=(k/W)|0;
        if(comp[k]>=0&&!merged[comp[k]]){ // a cut-off piece: carve the way back, then it joins the main one
          let j=k;while(j>=0&&par[j]>=0){const jx=j%W,jy=(j/W)|0;if(!landAt(jx,jy)){rows[jy][jx]='.';fm[jy][jx]=wm[j]?'4':(reg[j]?'3':'0');wm[j]=0;riv[j]=0}j=par[j]}
          const c=comp[k];merged[c]=1;remaining--;joined++;for(const m of compCells[c]){dist[m]=lv;par[m]=-1;push(lv,m)}}
        for(const d of DV){const nx=x+d[0],ny=y+d[1];if(nx<2||ny<2||nx>=W-2||ny>=H-2)continue;const nk=ny*W+nx,ch=rows[ny][nx];if(ch!=='#'&&ch!=='.')continue;
          const cst=wm[nk]?(riv[nk]?12:3):(ch==='.'?0:1),nd=lv+cst;if(nd<dist[nk]){dist[nk]=nd;par[nk]=k;push(nd,nk)}}}}
    if(remaining>0){console.warn('hgo: '+remaining+' pieces could not be joined');for(let c=0;c<nc;c++)if(!merged[c])for(const k of compCells[c]){rows[(k/W)|0][k%W]='#'}}}
  // the sections of water (the plank causeways, the new ones too, cut them); each gets a boat beside a shore
  const sec2=new Int16Array(W*H);let n2=0;const secBoat=[null],causeSet=new Set(cwCells.map(c=>c[0]+','+c[1]));
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!wm[ix(x,y)]||sec2[ix(x,y)])continue;const qq=[[x,y]];sec2[ix(x,y)]=-1;for(let i=0;i<qq.length;i++){const [a,b]=qq[i];for(const d of DV){const nx=a+d[0],ny=b+d[1];if(nx>=0&&ny>=0&&nx<W&&ny<H&&wm[ix(nx,ny)]&&!sec2[ix(nx,ny)]){sec2[ix(nx,ny)]=-1;qq.push([nx,ny])}}}
    if(qq.length<40){for(const c of qq){sec2[ix(c[0],c[1])]=0;wm[ix(c[0],c[1])]=0;riv[ix(c[0],c[1])]=0;rows[c[1]][c[0]]='#'}}else{n2++;for(const c of qq)sec2[ix(c[0],c[1])]=n2;
      // the boat: a water cell with a land cell beside it, close to a causeway if the section has one, else the dock for the sea
      let best=null,bs=1e9;const dk=docks.find(d=>sec2[ix(d.wx,d.wy)]===n2);
      for(const c of qq){if(!DV.some(d=>landAt(c[0]+d[0],c[1]+d[1])&&rows[c[1]+d[1]][c[0]+d[0]]==='.'))continue;let sc;if(dk&&n2===sec2[ix(docks[0].wx,docks[0].wy)])sc=Math.hypot(c[0]-docks[0].wx,c[1]-docks[0].wy);else{sc=1e8;for(const cw of causeways){const dd=Math.hypot(c[0]-cw.x,c[1]-cw.y);if(dd<sc)sc=dd}sc+=Math.random()*.01}
        if(sc<bs){bs=sc;best=c}}
      if(!best)best=qq[0];secBoat.push(best)}}
  // keep the fm marks for the sea-side land that is next to water: sand
  // the enemies that stood where water or rock is now go to the corridors
  const keepE=[],moved=[];for(const e of L.enemies){if(landAt(e.x,e.y))keepE.push(e);else moved.push(e)}L.enemies=keepE;
  L.rows=rows.map(r=>r.join(''));L.fmap=fm.map(r=>r.join(''));
  L.floorSet=[L.floor,'hgo_water','hgo_sand','hgo_rock','hgo_plank',L.floor];
  L.mapNames=(L.mapNames||[]).concat([{t:'The Black Sea',x:CX,y:CY,k:'place'}]);
  let wcount=0;for(let i=0;i<W*H;i++)wcount+=wm[i];
  L._hgdo={reg,riv,wm,sec:sec2,nsec:n2,secBoat,W,H,docks,island:{cx:icx,cy:icy,r:ir,cells:isl,chest},islets,causeways,cwCells,rivers:paths.map(p=>({tag:p.tag,n:p.path.length,from:p.path[0]&&[p.path[0][0]|0,p.path[0][1]|0],to:p.path.length&&[p.path[p.path.length-1][0]|0,p.path[p.path.length-1][1]|0]})),keep,moved,joined,water:wcount,boat:secBoat[sec2[ix(docks[0]?docks[0].wx:icx,docks[0]?docks[0].wy:icy)]]||secBoat[1]};
  for(let i=1;i<secBoat.length;i++){const b=secBoat[i];L.decor.push({k:'yar_boat_row',x:b[0],y:b[1],block:false,walk:true,deco:true,sc:1.7})}
  L.decor.push({k:'chest',x:chest[0],y:chest[1],block:true,goldAmt:5000});
  try{hgoPopulate(L)}catch(e){console.error('hgo populate',e)}
}
{const _b=hgduBuild;hgduBuild=function(){const had=!!LEVELS[HGDU.ID];_b.apply(this,arguments);const L=LEVELS[HGDU.ID];if(!had&&L)try{hgoBuild(L)}catch(e){console.error('hgo',e)}}}
if(typeof NPC_H!=='undefined'&&!NPC_H.yar_boat_row)NPC_H.yar_boat_row=.5;
/* ---------- the boats: embark and disembark (every section of water has its own boat) ---------- */
const HGOS={prox:0,proxT:0,src:null,hush:null,next:0};
function hgoLandNear(){ // the nearest shore cell within eight squares: land with water of the party's section beside it
  const P=G.P,s=hgoSec(P.x,P.y);let best=null,bd=1e9;
  for(let dy=-8;dy<=8;dy++)for(let dx=-8;dx<=8;dx++){const d=Math.hypot(dx,dy);if(d>8||d>=bd)continue;const x=P.x+dx,y=P.y+dy;
    if(x<1||y<1||x>=HGO.W-1||y>=HGO.H-1||hgoWater(x,y)||MAPROWS[y][x]!=='.'||cellBlocked(x,y)||enemyAt(x,y))continue;
    let w=null,wd=1e9;for(const q of DIRS){const wx=x+q[0],wy=y+q[1];if(hgoWater(wx,wy)&&hgoSec(wx,wy)===s&&!enemyAt(wx,wy)){const dd=Math.hypot(wx-P.x,wy-P.y);if(dd<wd){wd=dd;w=[wx,wy,q]}}}
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
