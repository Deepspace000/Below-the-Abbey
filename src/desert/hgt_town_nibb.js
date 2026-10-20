/* ==========================================================================
   NIBB, the festival city (level 484, interiors 4920 to 4939). Prefix hgtxnibb. See tools/HGT_BRIEF.md.
   150 by 150 cells, real heights. An amphitheatre city: a round festival floor (centre 75,76, radius 16) with five rings of seats and lantern terraces
   climbing round it to the rim plateau (height 6.3), where the outer districts lie. Twelve radial stairs join the terraces; the grand stairs run
   south (to the south gate) and north (to the north gate), east and west.
   THE BELL TOWER OF LANTERNS (signature) stands on the north-east of the rim: a leaning stepped tower with one long spiral stair, lantern balconies and
   hanging bells, and a belfry at the top. Its sunken counterpart, the Well of Bells, lies across the Bell Court.
   ========================================================================== */
var HGTCITIES=(typeof HGTCITIES==='undefined')?{}:HGTCITIES;
var hgtxnibb=(function(){
const ID=484,W=150,H=150,CX=75,CY=76,SEED=4840,INT0=4920,INTN=4939,K=HGTL.K,R0=16,E0=21,PB=7,TOP=6.3;
const hs=(x,y,k)=>hash2(x,y,SEED+(k|0));
const bandH=k=>1.5+1.2*k;
const I=(x,y)=>y*W+x,inB=(x,y)=>x>=0&&y>=0&&x<W&&y<H,DIRS=HGTL.DIRS;
const polar=(deg,r)=>{const a=deg*Math.PI/180;return [Math.round(CX+r*Math.cos(a)),Math.round(CY+r*Math.sin(a))]};
HGTE.look[484]={ambient:.62,haze:.22,hazeRate:.013,hazeCol:[130,86,150],tint:[1,.98,1.08],lamp:[1,.72,.46],wallGain:.98,wallSat:1.75,riserGain:.95,floorGain:.8,floorSat:1.25,grade:[240,226,240,.22],roofGain:.8,motes:70};
LEVEL_NAMES[ID]='Nibb';
HGTCITIES.nibb={level:ID,key:'nibb',name:'Nibb',entry:{x:75,y:146,f:0},entryNorth:{x:75,y:2,f:2},
  exitDoor:{x:75,y:148,to:470,at:{x:112,y:46,f:2}},exitDoorNorth:{x:75,y:1,to:470,at:{x:112,y:22,f:0}}};

/* ---------- tiles (painted pictures stacked one unit at a time) ---------- */
const TN={p:{p:'hgt_wp',w:'hgt_ww0',b:'hgt_wb0',d:'hgt_d0'},a:{p:'hgt_wa',w:'hgt_ww1',b:'hgt_wb1',d:'hgt_d1'},c:{p:'hgt_wc',w:'hgt_ww3',b:'hgt_wb2',d:'hgt_d3'},l:{p:'hgt_wl',w:'hgt_ww2',b:'hgt_wb3',d:'hgt_d2'}};
const TINTS=['p','a','c','l'];
const tcache=new Map();
function mkTile(list,wh){
  const key=list.join(',')+'|'+wh;if(tcache.has(key))return tcache.get(key);
  const units=Math.max(1,Math.ceil(wh-1e-6)),Hp=Math.max(8,Math.round(128*wh)),c=document.createElement('canvas');c.width=128;c.height=Hp;const x=c.getContext('2d');x.fillStyle='#cfc4d6';x.fillRect(0,0,128,Hp);
  for(let u=0;u<units;u++){const im=hgtaPic(list[Math.min(u,list.length-1)]);if(!im)continue;const part=Math.min(1,wh-u);
    x.drawImage(im,0,im.height*(1-part),im.width,im.height*part,0,Hp-Math.round(u*128)-Math.round(128*part),128,Math.round(128*part))}
  const d=x.getImageData(0,0,128,Hp).data,id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;const gid=KH_NEXT_GID++;T_TILE[gid]=id;tcache.set(key,gid);return gid}
/* kinds: win (windows on every other unit, band on top), tow (a window unit every third), plain (band on top only), blank (no band) */
function pat(kind,t,wh,v){const T=TN[t],n=Math.ceil(wh-1e-6),l=[];
  for(let u=0;u<n;u++){const top=u===n-1&&wh>=2.5&&kind!=='blank';
    l.push(top?T.b:u===0?T.p:kind==='win'?((u+v)%2===1?T.w:T.p):kind==='tow'?((u+v)%3===1?T.w:((u+v)%5===0?T.b:T.p)):T.p)}
  return l}
const wc=(kind,t,wh,v)=>hgtaChar(mkTile(pat(kind,t,wh,v||0),wh));
function doorGid(t,wh,link,pic,kind){const l=[pic||TN[t].d].concat(pat(kind||'win',t,wh,1).slice(1)),base=mkTile(l,wh),gid=KH_NEXT_GID++;T_TILE[gid]=T_TILE[base];if(link)KH_DOOR[gid]=link;return gid}
const dch=(t,wh,link,pic,kind)=>hgtaChar(doorGid(t,wh,link,pic,kind));
const qwh=v=>Math.max(1,Math.ceil(v*2-1e-6)/2); // a wall height rounded up to half a unit

function bellKind(){return IMG.hgt_bell?'hgt_bell':'hgt_chime'}

/* ---------- ground: the bowl, the rings, the stairs ---------- */
const STAIRS=[];
for(const a of [0,90,180,270])STAIRS.push({a:a*Math.PI/180,w:5});
for(const a of [30,60,120,150,210,240,300,330])STAIRS.push({a:a*Math.PI/180,w:3});
function ground(x,y){
  const dx=x-CX,dy=y-CY,r=Math.hypot(dx,dy);
  if(r<R0)return {h:0,k:K.PLAZA,band:-2,r};
  if(r<E0)return {h:.3*(Math.floor(r-R0)+1),k:K.TERRACE,band:-1,r};
  const k=Math.min(4,Math.floor((r-E0)/PB));
  if(k>=1&&k<=4&&r<E0+PB*k+4){ // the first four rows of a band are a ramp where a stair crosses it
    for(const s of STAIRS){const c=Math.cos(s.a),sn=Math.sin(s.a),al=dx*c+dy*sn,t=Math.abs(-dx*sn+dy*c);
      if(al>0&&t<s.w/2)return {h:bandH(k-1)+.3*(Math.floor(r-(E0+PB*k))+1),k:K.STAIR,band:k,r,stair:1}}}
  return {h:bandH(k),k:K.GROUND,band:k,r};
}

function build(){
  const B=hgtlNew(W,H,SEED);
  const FM=new Array(W*H).fill(0);
  B.fm=FM;B.band=new Int8Array(W*H);B.res=new Uint8Array(W*H);B.rg=new Int32Array(W*H);B.houses=[];B.towers=[];B.sunken=[];B.zones={};
  const isO=(x,y)=>inB(x,y)&&B.rows[y][x]==='.';
  const hAt=(x,y)=>B.h[I(x,y)];
  const dec=(k,x,y,o)=>{if(!inB(x,y))return false;B.decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true},o||{}));return true};
  const put=(k,x,y,o)=>{if(!isO(x,y)||B.occ.has(x+','+y))return false;B.occ.add(x+','+y);return dec(k,x,y,o)};
  const lamp=(x,y,o)=>{if(!put('hgt_lamppost',x,y,o))return false;B.lights.push([x,y]);return true};
  const rsv=(x0,y0,x1,y1,v)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(inB(x,y))B.res[I(x,y)]=v};
  const fmr=(x0,y0,x1,y1,v)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(inB(x,y)&&B.rows[y][x]==='.')B.fm[I(x,y)]=v};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const g=ground(x,y);hgtlOpen(B,x,y,g.h,g.k);B.band[I(x,y)]=g.band;
    FM[I(x,y)]=g.band===-2?1:g.stair||g.band===-1?2:0;if(g.band===-2&&g.r<5)FM[I(x,y)]=3}
  // ---- streets: the ring road, the four avenues, the gate courts
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const r=Math.hypot(x-CX,y-CY);if(r>=56.5&&r<59.5)B.res[I(x,y)]=1}
  rsv(73,126,77,147,1);rsv(73,2,77,24,1);rsv(2,74,20,78,1);rsv(130,74,147,78,1);
  rsv(62,131,88,147,1);rsv(62,2,88,19,1);
  // ---- the border: two cells of tall wall all round, a different tint on each side
  const bw={N:wc('tow','p',9),E:wc('tow','a',9),S:wc('tow','c',9),W:wc('tow','l',9)};
  for(let i=0;i<W;i++)for(const j of [0,1]){hgtlWall(B,i,j,bw.N,TOP);hgtlWall(B,i,H-1-j,bw.S,TOP)}
  for(let j=0;j<H;j++)for(const i of [0,1]){hgtlWall(B,i,j,bw.W,TOP);hgtlWall(B,W-1-i,j,bw.E,TOP)}
  // ---- the two gates
  const gs=dch('l',9,{lvl:470,at:{x:112,y:46,f:2}},'hgt_d2','tow'),gn=dch('l',9,{lvl:470,at:{x:112,y:22,f:0}},'hgt_d2','tow');
  hgtlWall(B,75,148,gs,TOP);hgtlWall(B,75,1,gn,TOP);
  B.doors.push({x:75,y:148,face:2,ax:75,ay:147,to:470},{x:75,y:1,face:0,ax:75,ay:2,to:470});
  hgtlSetStart(B,75,146,0);

  /* ================= GENERIC SPIRAL BOX (the bell tower, the stair towers) =================
     Rings of lane run clockwise from the south-west corner; ring r is the rectangle inset by ins=[west,east,north,south] times r. A gap of one cell of wall
     lies between rings wherever the inset is 2 or more; where it is 1 the lanes touch and the step between them is a cliff. Heights rise along the path. */
  function spiral(o){
    const {x0,y0,n,rings,ins,h0,total}=o,x1=x0+n-1,y1=y0+n-1,path=[],ringOf=[];
    const [iw,ie,inn,is]=ins;
    for(let r=0;r<rings;r++){
      const xa=x0+iw*r,xb=x1-ie*r,ya=y0+inn*r,yb=y1-is*r,last=r===rings-1,add=(x,y)=>{path.push([x,y]);ringOf.push(r)};
      for(let x=xa;x<=xb;x++)add(x,yb);
      for(let y=yb-1;y>=ya;y--)add(xb,y);
      for(let x=xb-1;x>=xa;x--)add(x,ya);
      for(let y=ya+1;y<=(last?yb-1:yb-is);y++)add(xa,y);
      if(!last)for(let i=1;i<iw;i++)add(xa+i,yb-is);
    }
    const rise=total/path.length,hh=new Map();
    path.forEach((c,i)=>{const h=h0+(i+1)*rise;hh.set(c[0]+','+c[1],h);hgtlOpen(B,c[0],c[1],h,K.STAIR);B.occ.add(c[0]+','+c[1]);B.res[I(c[0],c[1])]=3});
    hgtlRegRun(B,path.map(c=>[c[0],c[1]]),h0,rise,'spiral');
    const L=rings-1,xa=x0+iw*L,xb=x1-ie*L,ya=y0+inn*L,yb=y1-is*L,core={x0:xa+1,x1:xb-1,y0:ya+1,y1:yb-1};
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
      if(hh.has(x+','+y))continue;
      B.fm[I(x,y)]=3;
      if(x>=core.x0&&x<=core.x1&&y>=core.y0&&y<=core.y1)continue;
      let lo=1e9,hi=-1e9;
      for(const [i,j] of [[1,0],[-1,0],[0,1],[0,-1]]){const v=hh.get((x+i)+','+(y+j));if(v!==undefined){lo=Math.min(lo,v);hi=Math.max(hi,v)}}
      if(lo===1e9)for(const [i,j] of [[1,1],[-1,1],[1,-1],[-1,-1]]){const v=hh.get((x+i)+','+(y+j));if(v!==undefined){lo=Math.min(lo,v);hi=Math.max(hi,v)}}
      if(lo===1e9){lo=h0;hi=h0+1}
      const corner=(x===xa-1||x===xb+1)&&(y===ya-1||y===yb+1);
      if(corner&&o.post){hgtlWall(B,x,y,wc('tow',o.post,qwh(h0+total+o.postH-lo),0),lo);continue}
      hgtlWall(B,x,y,wc('plain',(x+y)%5===0?o.tint2:o.tint,qwh(hi-lo+.45),0),lo)}
    const summit=Math.min(...path.filter((c,i)=>ringOf[i]===L).map(c=>hh.get(c[0]+','+c[1])));
    return {path,ringOf,hh,rise,core,summit,top:h0+total,xa,xb,ya,yb,x0,y0,x1,y1}}

  /* ================= THE BELL TOWER OF LANTERNS ================= */
  const BT={};
  (function bellTower(){
    const sp=spiral({x0:116,y0:12,n:17,rings:4,ins:[3,1,2,2],h0:TOP,total:15,tint:'p',tint2:'a',post:'l',postH:4});
    Object.assign(BT,sp);
    const {core,summit,top}=sp,nx=(core.x0+core.x1)>>1,ny=(core.y0+core.y1)>>1;
    // the needle: a stepped spire on the summit, 3 by 3, with the belfry door on its south face
    for(let y=core.y0;y<=core.y1;y++)for(let x=core.x0;x<=core.x1;x++){
      const cen=x===nx&&y===ny,edge=(x===nx||y===ny),tp=top+(cen?9:edge?7:5);
      hgtlWall(B,x,y,wc('tow','a',qwh(tp-summit),0),summit)}
    BT.nx=nx;BT.ny=ny;BT.door={x:nx,y:core.y1,ax:nx,ay:core.y1+1};BT.needleTop=top+9;
  })();

  /* ================= THE WELL OF BELLS (the sunken counterpart) ================= */
  const WL={cx:110,cy:37,r:7.2,depth:8};
  (function well(){
    const {cx,cy,r,depth}=WL,floor=TOP-depth,N=34,step=depth/N,a0=-Math.PI*.5;
    for(let y=Math.floor(cy-r-1);y<=Math.ceil(cy+r+1);y++)for(let x=Math.floor(cx-r-1);x<=Math.ceil(cx+r+1);x++){
      const dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy);
      if(d>=r)continue;
      B.res[I(x,y)]=3;
      if(d<4.4){hgtlOpen(B,x,y,floor,K.COURT);B.fm[I(x,y)]=1;continue}
      let a=Math.atan2(dy,dx)-a0;a=((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
      const sidx=Math.floor(a/(Math.PI*2)*N);
      hgtlOpen(B,x,y,Math.max(floor,TOP-step*(sidx+1)),K.STAIR);B.fm[I(x,y)]=2}
    WL.floor=floor;
    for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)hgtlWall(B,cx+i,cy+j,wc('tow','l',5,0),floor);
    WL.door={x:cx,y:cy+1,ax:cx,ay:cy+2};
  })();

  /* ================= ZONES ================= */
  const plaza=(x0,y0,x1,y1,v)=>{fmr(x0,y0,x1,y1,v===undefined?3:v)};
  rsv(102,5,143,44,1);plaza(102,5,143,44,3);       // the Bell Court
  rsv(5,5,46,46,2);plaza(5,5,46,46,4);             // the Lantern Gardens
  plaza(62,131,88,147,3);plaza(62,2,88,19,3);       // the gate courts
  // sunken courts with a house at the bottom (the library builds the court and the house; doors are given interior links below)
  function court(x,y,dir,w,d,depth,t,k){
    const c=hgtlXf(x,y,dir);let bx0=1e9,by0=1e9,bx1=-1e9,by1=-1e9;
    for(const [u,v] of [[0,0],[w-1,0],[0,d-1],[w-1,d-1]]){const [px,py]=c(u,v);bx0=Math.min(bx0,px);by0=Math.min(by0,py);bx1=Math.max(bx1,px);by1=Math.max(by1,py)}
    for(let yy=by0-1;yy<=by1+1;yy++)for(let xx=bx0-1;xx<=bx1+1;xx++)if(!inB(xx,yy)||!isO(xx,yy)||B.res[I(xx,yy)]===3){return null}
    const r=hgtlSunkenHouse(B,x,y,dir,depth,{w,tint:({p:'a',a:'b',c:'c',l:'d'})[t||'a'],h0:hAt(x,y)});
    for(let yy=by0-1;yy<=by1+1;yy++)for(let xx=bx0-1;xx<=bx1+1;xx++)if(inB(xx,yy))B.res[I(xx,yy)]=3;
    for(let yy=by0;yy<=by1;yy++)for(let xx=bx0;xx<=bx1;xx++)if(B.kind[I(xx,yy)]===K.COURT||B.kind[I(xx,yy)]===K.STAIR)B.fm[I(xx,yy)]=1;
    const d_=B.doors[B.doors.length-1];const rec={x:d_.x,y:d_.y,face:d_.face,ax:d_.ax,ay:d_.ay,floor:r.floor,bbox:[bx0,by0,bx1,by1],dir,k};B.sunken.push(rec);return rec}
  for(const [x,y,dir,w,d,dp,t] of [[10,143,0,9,13,2.1,'a'],[24,143,0,9,13,2.6,'p'],[38,143,0,9,13,2.1,'c'],
      [102,143,0,9,13,2.1,'l'],[116,143,0,9,13,2.6,'a'],[130,143,0,9,13,2.1,'p'],
      [8,42,2,9,13,2.1,'l'],[36,10,2,9,13,2.1,'a'],[132,108,0,9,13,2.1,'c'],[8,108,0,9,13,2.1,'p']])court(x,y,dir,w,d,dp,t);

  /* ================= STAIR TOWERS (small spiral towers: a lookout and a door on a balcony) ================= */
  const stairTowers=[];
  function stairTower(x0,y0,t,t2){
    for(let y=y0-1;y<=y0+9;y++)for(let x=x0-1;x<=x0+9;x++)if(!inB(x,y)||!isO(x,y)||B.res[I(x,y)]===3||hAt(x,y)!==hAt(x0,y0))return null;
    const h0=hAt(x0,y0),sp=spiral({x0,y0,n:9,rings:2,ins:[2,2,2,2],h0,total:5.8,tint:t,tint2:t2||'c',post:t2||'c',postH:3});
    const {core,summit,top}=sp,nx=(core.x0+core.x1)>>1,ny=(core.y0+core.y1)>>1;
    for(let y=core.y0;y<=core.y1;y++)for(let x=core.x0;x<=core.x1;x++){const cen=x===nx&&y===ny;hgtlWall(B,x,y,wc('tow',t2||'c',qwh(top+(cen?5:3.5)-summit),0),summit)}
    for(let yy=y0-1;yy<=y0+9;yy++)for(let xx=x0-1;xx<=x0+9;xx++)B.res[I(xx,yy)]=3;
    const rec=Object.assign(sp,{nx,ny,door:{x:nx,y:core.y1,ax:nx,ay:core.y1+1},t,t2});stairTowers.push(rec);return rec}
  {const spots=[[14,90,'a','p'],[130,90,'p','a'],[14,60,'l','c'],[128,60,'c','l'],[30,126,'p','l'],[118,126,'a','c'],[88,128,'l','p'],[58,128,'c','a']];
   for(const [sx,sy,t,t2] of spots){let done=false;for(let r=0;r<16&&!done;r++)for(let dy=-r;dy<=r&&!done;dy+=2)for(let dx=-r;dx<=r&&!done;dx+=2){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(stairTower(sx+dx,sy+dy,t,t2))done=true}}}

  /* ================= HOUSES ================= */
  const used=new Uint8Array(W*H); // 1 = house wall
  function placeHouse(x,y,w,d,face,t,wh,o){
    o=o||{};const h0=hAt(x,y);
    for(let j=0;j<d;j++)for(let i=0;i<w;i++){used[I(x+i,y+j)]=1;hgtlWall(B,x+i,y+j,wc(o.kind||'win',t,wh,(x+i+y+j)&1),h0)}
    const f=face&3,dx=f===1?w-1:f===3?0:(w>>1),dy=f===2?d-1:f===0?0:(d>>1);
    const hs_={x,y,w,d,face:f,h:h0,t,wh,door:[x+dx,y+dy],front:[x+dx+DIRS[f][0],y+dy+DIRS[f][1]],kind:o.kind||'win',band:B.band[I(x,y)],tower:!!o.tower};
    B.houses.push(hs_);return hs_}
  function faceOf(x,y,w,d,toward){
    const mx=x+w/2-toward[0],my=y+d/2-toward[1];
    return Math.abs(mx)>Math.abs(my)?(mx>0?3:1):(my>0?0:2)}
  function pack(o){
    const list=[];for(let y=o.y0;y<=o.y1;y++)for(let x=o.x0;x<=o.x1;x++)if(o.test(x,y))list.push([x,y]);
    list.sort((a,b)=>(a[1]+hs(a[0],a[1],o.k)*3)-(b[1]+hs(b[0],b[1],o.k)*3)||a[0]-b[0]);
    let n=0;
    for(const [x,y] of list){
      if(!isO(x,y)||used[I(x,y)]||B.occ.has(x+','+y))continue;
      if(hs(x,y,o.k+3)<(o.skip||0))continue;
      const sz=o.sizes[(hs(x,y,o.k+1)*o.sizes.length)|0],sw=hs(x,y,o.k+2)<.5,w=sw?sz[1]:sz[0],d=sw?sz[0]:sz[1],h0=hAt(x,y);
      let ok=true;
      for(let j=-1;j<=d&&ok;j++)for(let i=-1;i<=w&&ok;i++){const cx=x+i,cy=y+j;if(!inB(cx,cy)||cx<2||cy<2||cx>W-3||cy>H-3){ok=false;break}
        const inside=i>=0&&j>=0&&i<w&&j<d;
        if(!isO(cx,cy)||used[I(cx,cy)]){ok=false;break}
        const dh=hAt(cx,cy)-h0;
        if(inside?Math.abs(dh)>.01:dh<-.01){ok=false;break}
        if(B.kind[I(cx,cy)]===K.STAIR||B.band[I(cx,cy)]<0){ok=false;break}
        if(B.res[I(cx,cy)]===1||B.res[I(cx,cy)]===2||B.res[I(cx,cy)]===3){ok=false;break}
        if(inside&&(!o.test(cx,cy)||B.occ.has(cx+','+cy))){ok=false;break}
        if(!inside&&B.occ.has(cx+','+cy)){ok=false;break}}
      if(!ok)continue;
      const t=o.tint(x,y),wh=o.wh(x,y),face=faceOf(x,y,w,d,o.toward?o.toward(x,y):[CX,CY]);
      placeHouse(x,y,w,d,face,t,wh,o.opts);n++}
    return n}
  // the lantern terraces round the bowl: houses on the back of each band, the front two and a half rows left as a promenade
  const BT_TINT=['p','a','c','l','p'],BT_WH=[[3,3,4,5,7],[4,4,5,6,8],[5,5,6,7,9],[6,6,7,9,11]];
  for(let k=0;k<=3;k++)
    pack({x0:20,y0:20,x1:130,y1:132,k:100+k,test:(x,y)=>{if(B.band[I(x,y)]!==k)return false;const r=Math.hypot(x-CX,y-CY);return r>=E0+PB*k+2.5&&r<E0+PB*(k+1)},
      sizes:[[4,3],[5,3],[4,4],[3,3],[5,4]],tint:(x,y)=>BT_TINT[k],wh:(x,y)=>BT_WH[k][(hs(x,y,7)*BT_WH[k].length)|0]});
  // the outer band and the rim plateau
  {const tintAt=(x,y)=>{const a=Math.atan2(y-CY,x-CX);return a>-2.35&&a<-.78?'p':a>=-.78&&a<.78?'a':a>=.78&&a<2.35?'c':'l'};
   pack({x0:3,y0:3,x1:146,y1:146,k:140,test:(x,y)=>{if(B.band[I(x,y)]!==4)return false;const r=Math.hypot(x-CX,y-CY);return (r>=51.5&&r<56)||r>=60.5},
     sizes:[[4,3],[5,3],[4,4],[3,3],[5,4],[6,3]],tint:tintAt,wh:(x,y)=>{const v=hs(x,y,9);return v<.3?4:v<.5?5:v<.68?6:v<.8?8:v<.9?10:13}})}
  /* ================= PLACEHOLDER WALLS FROM THE LIBRARY (sunken houses) BECOME PAINTED TILES ================= */
  (function bindRoles(){
    const tt={a:'p',b:'a',c:'c',d:'l'},cache={};
    const conv=ch=>{if(cache[ch]!==undefined)return cache[ch];const role=HGTL_ROLE[ch];let out=null;
      if(role){const wh=HGTL_WH[ch],m=/^nacre_(\w)(_cap|_mid|_low|_rail)?$/.exec(role);
        if(m){const t=tt[m[1]],s=m[2]||'';out=wc(s==='_cap'?'tow':s===''||s==='_mid'?'win':s==='_low'?'plain':'blank',t,qwh(wh),0)}
        else if(/window/.test(role))out=wc('win','c',qwh(wh),0);
        else if(/band/.test(role))out=wc('plain','a',qwh(wh),0);
        else if(/^door/.test(role))out=wc('win','p',qwh(wh),0);
        else if(/pillar/.test(role))out=wc('tow','c',qwh(wh),0);
        else if(/roof_aqua|hedge/.test(role))out=wc('blank','a',qwh(wh),0);
        else out=wc('win','p',qwh(wh),0)}
      return cache[ch]=out};
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=B.rows[y][x];if(ch!=='.'&&HGTL_ROLE[ch]){const n=conv(ch);if(n)B.rows[y][x]=n}}
  })();

  /* ================= KEEP EVERYTHING REACHABLE ================= */
  (function fixReach(){
    for(let pass=0;pass<4;pass++){
      const r=hgtlReach(B,75,146);let n=0;
      for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){
        if(B.rows[y][x]!=='.'||r.seen[I(x,y)])continue;
        // a sealed pocket between walls: make it part of the wall
        const h=hAt(x,y);let lower=false;
        for(const [dx,dy] of DIRS){const nx=x+dx,ny=y+dy;if(isO(nx,ny)&&hAt(nx,ny)<h-.01){lower=true}}
        if(lower)continue;
        hgtlWall(B,x,y,wc('blank','p',3,0),h);n++}
      if(!n)break}
  })();

  /* ================= RISER PICTURES (the faces of steps and cliffs) ================= */
  const rise={};
  // pictures are stacked from the bottom, but a cliff face starts at the top: so a face tile is built top-down (the band first)
  function faceTile(t,wh,kind){const T=TN[t],n=Math.ceil(wh),l=[];for(let u=0;u<n;u++){const fromTop=n-1-u;l.push(fromTop===0?T.b:kind==='win'&&fromTop%2===1?T.w:kind==='tow'&&fromTop%3===1?T.w:T.p)}return mkTile(l,wh)}
  {const stairFace=mkTile(['hgt_wc'],1);
   const bandFace=[0,1,2,3].map(i=>mkTile(['hgt_wb'+i],1));
   const tall={p:faceTile('p',12,'tow'),a:faceTile('a',12,'tow'),c:faceTile('c',12,'tow'),l:faceTile('l',12,'tow')};
   for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=I(x,y);if(B.rows[y][x]!=='.')continue;
     const kd=B.kind[i],bd=B.band[i];
     if(kd===K.STAIR||bd===-1)B.rg[i]=stairFace;
     else if(bd>=0)B.rg[i]=bandFace[bd%4]}
   // the cliff of the bell tower and the stair towers: tall faces with windows
   const faceRing=(sp,tints)=>{sp.path.forEach((c,idx)=>{B.rg[I(c[0],c[1])]=tall[tints[sp.ringOf[idx]%tints.length]]})};
   faceRing(BT,['p','a','l','c']);for(const st of stairTowers)faceRing(st,[st.t,st.t2||'c']);
   // the sunken courts: the cliff of the rim, the stairs
   for(const c of B.sunken){const [x0,y0,x1,y1]=c.bbox;for(let y=y0-1;y<=y1+1;y++)for(let x=x0-1;x<=x1+1;x++){if(!inB(x,y)||B.rows[y][x]!=='.')continue;const i=I(x,y);if(B.kind[i]===K.GROUND||B.kind[i]===K.PLAZA)B.rg[i]=tall[(['p','a','c','l'])[(x+y)%4]]}}
   // the well
   for(let y=Math.floor(WL.cy-WL.r-1);y<=Math.ceil(WL.cy+WL.r+1);y++)for(let x=Math.floor(WL.cx-WL.r-1);x<=Math.ceil(WL.cx+WL.r+1);x++){if(!inB(x,y)||B.rows[y][x]!=='.')continue;const i=I(x,y);if(Math.hypot(x-WL.cx,y-WL.cy)>=WL.r&&Math.hypot(x-WL.cx,y-WL.cy)<WL.r+1.6)B.rg[i]=tall.l}
   B.riserStair=stairFace}

  /* ================= LANES NEXT TO HOUSES ================= */
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const i=I(x,y);if(B.rows[y][x]!=='.'||B.fm[i]!==0||B.res[i]===1)continue;
    for(const [dx,dy] of DIRS)if(used[I(x+dx,y+dy)]){B.fm[i]=5;break}}

  /* ================= LAMPS, LANTERNS AND PLANTS ================= */
  const PLANTS=['hgt_shellflower','hgt_bulbflower','hgt_fern','hgt_mushrooms','hgt_pearlbush','hgt_crystalgrass','hgt_shrub','hgt_reeds'];
  const BIG=['hgt_fairytree','hgt_willow','hgt_giantcap'];
  const plant=(x,y,v)=>{const k=PLANTS[(hs(x,y,v||31)*PLANTS.length)|0];return put(k,x,y,{sc:.8+hs(x,y,32)*.6,ox:(hs(x,y,33)-.5)*.5,oy:(hs(x,y,34)-.5)*.5})&&(hs(x,y,35)<.35?(B.lights.push([x,y]),true):true)};
  const hang=(x,y,bob,k)=>dec(k||'hgt_hanglamp',x,y,{bob:bob||1.6,sc:1});
  // the ring road: lamp posts on both sides, hanging lanterns across
  for(let a=0;a<360;a+=1.3){const [x1,y1]=polar(a,57),[x2,y2]=polar(a,59);if(hs(Math.round(a*10),1,41)<.5)lamp(x1,y1);else lamp(x2,y2)}
  // the promenades: a lamp post every few cells at the front edge of each band, and a hanging lantern between
  for(let k=0;k<=4;k++){const r=E0+PB*k+1.1;for(let a=0;a<360;a+=360/(2*Math.PI*r/4.2)){const [x,y]=polar(a,r);if(B.band[I(x,y)]===k&&B.kind[I(x,y)]===K.GROUND&&B.res[I(x,y)]!==3)lamp(x,y)}
    const r2=E0+PB*k+1.9;for(let a=2;a<360;a+=360/(2*Math.PI*r2/3.1)){const [x,y]=polar(a,r2);if(B.band[I(x,y)]===k&&B.kind[I(x,y)]===K.GROUND&&B.res[I(x,y)]!==3&&!B.occ.has(x+','+y)&&hs(x,y,42)<.8){B.occ.add(x+','+y);hang(x,y,1.5+hs(x,y,43)*.8)}}}
  // the seats and the floor of the bowl
  for(let a=0;a<360;a+=45){const [x,y]=polar(a+22,11);lamp(x,y)}
  for(let a=0;a<360;a+=90){const [x,y]=polar(a+45,8);put('hgt_fountain',x,y,{block:true,walk:false,deco:false});B.lights.push([x,y])}
  put('hgt_obelisk',CX,CY,{block:true,walk:false,deco:false,sc:2.4});B.lights.push([CX,CY]);
  for(let a=0;a<360;a+=30){const [x,y]=polar(a+15,18.5);if(B.band[I(x,y)]===-1&&hs(x,y,44)<.5)put('hgt_gardenlantern',x,y,{});}
  // the gate courts, the avenues
  for(const [x,y] of [[63,133],[87,133],[63,145],[87,145],[69,134],[81,134],[69,144],[81,144],[63,4],[87,4],[63,17],[87,17],[69,5],[81,5]])lamp(x,y);
  for(let y=130;y<=147;y+=3){lamp(72,y);lamp(78,y)}
  for(let y=4;y<=22;y+=3){lamp(72,y);lamp(78,y)}
  put('hgt_fountain',75,138,{block:true,walk:false,deco:false});put('hgt_fountain',75,10,{block:true,walk:false,deco:false});
  for(let x=2;x<=20;x+=3){lamp(x,73);lamp(x,79)}for(let x=132;x<=147;x+=3){lamp(x,73);lamp(x,79)}
  // the Lantern Gardens: lawn, glitter plants, big trees, a pond of crystal gravel
  {const gx0=5,gy0=5,gx1=46,gy1=46;
   for(let y=gy0;y<=gy1;y++)for(let x=gx0;x<=gx1;x++){const i=I(x,y);if(B.rows[y][x]!=='.'||B.occ.has(x+','+y)||B.res[i]===3)continue;
     if(Math.hypot(x-26,y-26)<6.2){const d=Math.hypot(x-26,y-26);B.h[i]=TOP-(d<3.4?.9:d<4.7?.6:.3);B.fm[i]=5;continue}
     const path=(x>=24&&x<=26)||(y>=24&&y<=26);if(path){B.fm[i]=5;continue}
     const v=hs(x,y,50);if(v<.11)plant(x,y,51);else if(v<.135)put(BIG[(hs(x,y,52)*3)|0],x,y,{sc:.9+hs(x,y,53)*.5})}
   for(const [x,y] of [[26,12],[26,40],[12,26],[40,26]])put('hgt_cupola',x,y,{block:true,walk:false,deco:false,sc:1.9});
   for(let t=0;t<14;t++){const a=t/14*Math.PI*2,x=Math.round(26+7.5*Math.cos(a)),y=Math.round(26+7.5*Math.sin(a));put('hgt_reeds',x,y,{sc:1.1});if(t%2)lamp(Math.round(26+9*Math.cos(a)),Math.round(26+9*Math.sin(a)))}}
  // the Bell Court: rows of lamps, banners and a few beds of plants
  {for(let x=104;x<=142;x+=4){lamp(x,31);lamp(x,41)}for(let y=7;y<=43;y+=4){lamp(103,y);lamp(142,y)}
   for(const [x,y] of [[121,31],[127,31]])put('hgt_obelisk',x,y,{block:true,walk:false,deco:false,sc:1.5});
   for(let y=31;y<=42;y++)for(let x=121;x<=141;x++)if(hs(x,y,60)<.05)plant(x,y,61)}
  // the plateau: plants and lamps in the lanes
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){const i=I(x,y);if(B.rows[y][x]!=='.'||B.band[i]!==4||B.occ.has(x+','+y)||B.res[i]===3)continue;
    if(B.res[i]===1){continue}
    if(B.fm[i]===5&&hs(x,y,70)<.075)plant(x,y,71);else if(B.fm[i]===5&&hs(x,y,72)<.012)lamp(x,y)}
  // the promenades: plants and big pearl bushes at the edges
  for(let y=20;y<H-20;y++)for(let x=20;x<W-20;x++){const i=I(x,y);if(B.rows[y][x]!=='.'||B.band[i]<0||B.band[i]>3||B.kind[i]!==K.GROUND||B.occ.has(x+','+y))continue;
    if(hs(x,y,80)<.05)plant(x,y,81)}

  /* ================= THE BELL TOWER: LANTERNS AND BELLS ALL THE WAY UP ================= */
  BT.path.forEach((c,i)=>{const [x,y]=c;
    if(i%2===1)dec('hgt_hanglamp',x,y,{bob:1.55+(i%4===1?.3:0),sc:1.1});
    if(i%5===2)B.lights.push([x,y]);
    if(i%9===4)dec(bellKind(),x,y,{bob:2.1,sc:1.2});
    if(i%23===11)dec('hgt_banner',x,y,{bob:0,sc:1.1})});
  // a lit pavilion on every turn of the stair
  BT.path.forEach((c,i)=>{if(i>0&&i<BT.path.length-1){const p=BT.path[i-1],n=BT.path[i+1];if(p[0]!==n[0]&&p[1]!==n[1]){dec('hgt_gardenlantern',c[0],c[1],{bob:0,sc:1.15});B.lights.push([c[0],c[1]])}}});
  // the lantern crown on the needle
  dec('hgt_cupola',BT.nx,BT.ny,{bob:BT.needleTop-BT.summit,sc:2.3});dec('hgt_finial',BT.nx,BT.ny,{bob:BT.needleTop-BT.summit+2.4,sc:1.8});
  B.lights.push([BT.nx,BT.door.ay]);
  // the foot of the tower: lamps and bells in the court below
  for(let x=116;x<=132;x+=4){lamp(x,30)}
  // the Well of Bells: lamps at the rim, bells hanging over the stair
  for(let a=0;a<360;a+=40){const [x,y]=[Math.round(WL.cx+8.6*Math.cos(a*Math.PI/180)),Math.round(WL.cy+8.6*Math.sin(a*Math.PI/180))];lamp(x,y)}
  for(let a=0;a<360;a+=30){const x=Math.round(WL.cx+5.8*Math.cos(a*Math.PI/180)),y=Math.round(WL.cy+5.8*Math.sin(a*Math.PI/180));if(isO(x,y)&&!B.occ.has(x+','+y)){B.occ.add(x+','+y);dec(bellKind(),x,y,{bob:2.4,sc:1.2});}}
  dec(bellKind(),WL.cx,WL.cy+3,{bob:0,sc:1});B.lights.push([WL.cx,WL.cy+3],[WL.cx-3,WL.cy+3],[WL.cx+3,WL.cy+3]);

  /* ================= ORNAMENTS ON THE ROOFS ================= */
  for(const hsr of B.houses){
    const v=hs(hsr.x,hsr.y,90);
    const k=v<.2?'hgt_finial':v<.4?'hgt_cupola':v<.55?'hgt_chimney':v<.7?'hgt_banner':v<.8?'hgt_obelisk':v<.9?'hgt_fairytree':'hgt_willow';
    const sc=k==='hgt_cupola'?1.2+hsr.w*.12:k==='hgt_obelisk'?.8:(k==='hgt_fairytree'||k==='hgt_willow')?.9:1;
    dec(k,hsr.x+(hsr.w>>1),hsr.y+(hsr.d>>1),{bob:hsr.wh,sc});
    // lit lanterns on the corners of the roof
    for(const [cx,cy] of [[hsr.x,hsr.y],[hsr.x+hsr.w-1,hsr.y+hsr.d-1]])dec('hgt_gardenlantern',cx,cy,{bob:hsr.wh,sc:.9});
    // plants on the ledges
    if(hs(hsr.x,hsr.y,91)<.5)dec(PLANTS[(hs(hsr.x,hsr.y,92)*PLANTS.length)|0],hsr.x+hsr.w-1,hsr.y,{bob:hsr.wh,sc:1.1});
    // a lit doorway lamp in front of every door that opens
    if(hsr.room)B.lights.push([hsr.front[0],hsr.front[1]])}
  for(const st of stairTowers){dec('hgt_cupola',st.nx,st.ny,{bob:5.1-0,sc:1.6});for(const c of st.path.filter((c,i)=>i%5===2))dec('hgt_hanglamp',c[0],c[1],{bob:1.7});}

  B.houseCount=B.houses.length;
  B.BT=BT;B.WL=WL;
  // names on the overview map
  for(const [t,x,y,o] of [['The Festival Floor',75,70],['Bell Court',123,41],['The Bell Tower of Lanterns',124,8,{sz:5,col:'#8a2a20'}],['The Well of Bells',110,50],['Lantern Gardens',26,42],['Sunken Ward',28,129],['Sunken Row',116,129],['South Gate',75,143],['North Gate',75,12],['East Road',138,72],['West Road',12,72]]){hgtlName(B,x,y,t,'place');if(o)Object.assign(B.names[B.names.length-1],o)}
  /* ================= DOORS: houses, towers and sunken houses that can be entered ================= */
  B.links={};
  const FACE_NAME=['north','east','south','west'];
  function setDoor(cx,cy,face,t,wh,roomId,pic,kind){
    // turns the wall cell (cx,cy) into a door to a room; the room is told where the street cell in front of the door is
    const ax=cx+DIRS[face][0],ay=cy+DIRS[face][1],R=ROOMS[roomId],at=R.arrive||{x:R.ex||((R.w+1)>>1),y:R.d,f:0};
    const ch=dch(t,wh,{lvl:roomId,at:{x:at.x,y:at.y,f:at.f}},pic||TN[t].d,kind||'win');
    B.rows[cy][cx]=ch;B.lights.push([ax,ay]);B.doors.push({x:cx,y:cy,face,ax,ay,to:roomId});B.links[roomId]={x:ax,y:ay,f:face};return ch}
  const taken=new Set();
  function pickHouse(deg,r,o){
    o=o||{};const [tx,ty]=polar(deg,r);let best=null,bd=1e9;
    for(const hh of B.houses){if(taken.has(hh)||hh.tower)continue;if(o.band!==undefined&&hh.band!==o.band)continue;if(hh.w<3||hh.d<3)continue;
      const [fx,fy]=hh.front;if(!isO(fx,fy)||B.occ.has(fx+','+fy))continue;
      const dd=Math.hypot(hh.x-tx,hh.y-ty);if(dd<bd){bd=dd;best=hh}}
    if(best)taken.add(best);return best}
  // the houses on the terraces
  const HDOORS=[[4920,270,24,0,'hgt_d2'],[4921,150,32,1],[4923,18,32,1],[4928,325,39,2],[4929,45,39,2],[4930,200,46,3,'hgt_d2'],[4936,300,46,3],[4937,120,46,3]];
  for(const [id,deg,r,band,pic] of HDOORS){const hh=pickHouse(deg,r,{band});if(!hh)continue;
    setDoor(hh.door[0],hh.door[1],hh.face,hh.t,hh.wh,id,pic);hh.room=id;hh.special=true;B.occ.add(hh.front[0]+','+hh.front[1])}
  // the guard house at the north gate: a small house in the gate court
  {const gx=64,gy=6,gw=5,gd=4;let ok=true;for(let y=gy-1;y<=gy+gd;y++)for(let x=gx-1;x<=gx+gw;x++)if(!isO(x,y))ok=false;
   if(ok){const hh=placeHouse(gx,gy,gw,gd,1,'c',4,{kind:'win'});setDoor(hh.door[0],hh.door[1],1,'c',4,4927,'hgt_d3');hh.room=4927;hh.special=true;B.occ.add(hh.front[0]+','+hh.front[1]);
     for(let y=gy-1;y<=gy+gd;y++)for(let x=gx-1;x<=gx+gw;x++)B.res[I(x,y)]=3}}
  // the foundry under the Well of Bells, the belfry on the tower, the balcony doors of two stair towers
  B.rows[WL.door.y][WL.door.x]=dch('l',5,{lvl:4924,at:{x:6,y:9,f:0}},'hgt_d2','tow');B.doors.push({x:WL.door.x,y:WL.door.y,face:2,ax:WL.door.ax,ay:WL.door.ay,to:4924});B.links[4924]={x:WL.door.ax,y:WL.door.ay,f:2};
  {const nh=qwh(BT.top+7-BT.summit);B.rows[BT.door.y][BT.door.x]=dch('a',nh,{lvl:4926,at:{x:5,y:9,f:0}},'hgt_d2','tow');B.doors.push({x:BT.door.x,y:BT.door.y,face:2,ax:BT.door.ax,ay:BT.door.ay,to:4926});B.links[4926]={x:BT.door.ax,y:BT.door.ay,f:2}}
  const sts=B.stairTowers=stairTowers;
  [[0,4934],[1,4935]].forEach(([i,id])=>{const st=sts[i];if(!st)return;const wh=qwh(st.top+3.5-st.summit);
    B.rows[st.door.y][st.door.x]=dch(st.t2||'c',wh,{lvl:id,at:{x:4,y:6,f:0}},'hgt_d2','tow');B.doors.push({x:st.door.x,y:st.door.y,face:2,ax:st.door.ax,ay:st.door.ay,to:id});B.links[id]={x:st.door.ax,y:st.door.ay,f:2};st.room=id});
  // sunken houses: the door at the foot of the court
  [[1,4932],[4,4933],[2,4939]].forEach(([i,id])=>{const c=B.sunken[i];if(!c)return;
    const col=B.rows[c.y][c.x],t=['p','a','c','l'][i%4];
    B.rows[c.y][c.x]=dch(t,3.5,{lvl:id,at:{x:ROOMS[id].ex||((ROOMS[id].w+1)>>1),y:ROOMS[id].d,f:0}},'hgt_d0','win');B.links[id]={x:c.ax,y:c.ay,f:c.face};c.room=id;B.occ.add(c.ax+','+c.ay);const de=B.doors.find(q=>q.x===c.x&&q.y===c.y);if(de)de.to=id});
  // the sunken houses without a room: shuttered, a plain wall with windows
  for(const c of B.sunken)if(!c.room){B.rows[c.y][c.x]=wc('win','c',3.5,1)}
  // a secret nook behind a house on the rim: a dead-end alcove cut into a house block with a chest, and a door at the end
  (function secret(){
    for(const hh of B.houses.slice().sort((a,b)=>hs(a.x,a.y,95)-hs(b.x,b.y,95))){
      if(taken.has(hh)||hh.band!==4||hh.w<4||hh.d<4||hh.wh<5)continue;
      // cut into the north side from the lane above: the cell above the middle of the north wall must be open
      const mx=hh.x+(hh.w>>1),ay=hh.y-1;if(!isO(mx,ay)||B.occ.has(mx+','+ay))continue;
      if(!isO(mx-1,ay)&&!isO(mx+1,ay)&&!isO(mx,ay-1))continue;
      const h0=hh.h,len=2;let ok=true;for(let i=0;i<=len;i++){const cx=mx,cy=hh.y+i;if(B.rows[cy][cx]==='.')ok=false}
      if(!ok)continue;
      for(let i=0;i<len;i++){hgtlOpen(B,mx,hh.y+i,h0,K.ALLEY);B.secrets.push([mx,hh.y+i]);B.occ.add(mx+','+(hh.y+i))}
      const dx=mx,dy=hh.y+len;B.rows[dy][dx]=dch(hh.t,hh.wh,{lvl:4938,at:{x:3,y:5,f:0}},'hgt_d3','win');
      B.doors.push({x:dx,y:dy,face:0,ax:dx,ay:dy-1,to:4938});B.links[4938]={x:dx,y:dy-1,f:0};
      dec('hg_chestweed',mx,hh.y,{block:true,walk:false,deco:false,sc:.9});B.lights.push([mx,hh.y]);
      // the alcove walls: the side cells stay as house walls (they already are); mark the nook for the map
      taken.add(hh);hh.secret=true;B.secretNook={x:mx,y:ay};hgtlName(B,mx,hh.y-3,'','nook');return}
  })();

  /* ================= PEOPLE ================= */
  const npc=(k,id,x,y,sc)=>{B.decor.push({k,x,y,block:false,walk:true,npc:id,sc:sc||1});B.occ.add(x+','+y)};
  npc('hg_npc1','hgn_bleb',79,84);                  // Aunt Bleb, on the festival floor
  npc('hg_npc4','hgn_grull',73,5);                  // Guard Grull, at the north gate
  npc('hg_npc4','hgxn_gate',77,144);                // the south gate guard
  npc('hg_npc0','hgxn_keeper',124,33);              // the lantern keeper, at the foot of the bell tower
  npc('hg_npc3','hgxn_seat',70,63);                 // someone sitting on the seats
  npc('hg_npc5','hgxn_cart',66,98);                 // a trader on the promenade
  B.npcCount=B.decor.filter(d=>d.npc).length;
  return B;
}

/* ================= THE INTERIOR ROOMS (levels 4920 to 4939) ================= */
const ROOMS={};
const SOFT=/^hgt_|^hl_p_candle|^brazier|^lamp$|^flowerpot|^vase/;
function room(id,name,w,d,t,floor,items,o){ROOMS[id]=Object.assign({id,name,w,d,t,floor,items:items||[],doors:[],npcs:[],loot:[],lights:[]},o||{});LEVEL_NAMES[id]=name}
const D3=(k,x,y,o)=>[k,x,y,o||{}];
room(4920,'The Stage House',9,7,'l','hgt_f5',[D3('hgt_banner',2,1,{bob:0}),D3('hgt_banner',4,1),D3('hgt_banner',6,1),D3('hgt_banner',8,1),D3('statue',2,3),D3('statue',8,3),D3('kh_int3_1',5,2),D3('hl_p_candle',6,2),D3('hl_p_mirror',1,5),D3('hl_p_mirror',9,5),D3('bench',3,5),D3('bench',7,5),D3('hgt_fern',1,1),D3('hgt_fern',9,1)],
  {npcs:[['hg_npc0','hgn_oom',4,3]],lights:[[5,4],[2,2],[8,2],[5,6]]});
room(4921,'The Feast Kitchen',9,7,'p','hgt_f0',[D3('counter',2,1),D3('counter',3,1),D3('counter',4,1),D3('kh_int6_4',6,1),D3('kh_int6_3',8,1),D3('barrel',9,2),D3('barrel',9,6),D3('barrel',1,6),D3('sacks',1,4),D3('kh_int6_0',4,4),D3('breadbasket',2,3),D3('hg_waxbarrel',9,1)],
  {npcs:[['hg_npc3','hgn_bibbn',6,5]],lights:[[3,2],[6,2],[5,5],[8,4]],doors:[{wall:'E',pos:4,to:4922,at:{x:1,y:3,f:1},pic:'hgt_d0'}]});
room(4922,'The Feast Pantry',5,5,'p','hgt_f6',[D3('barrel',2,1),D3('barrel',3,1),D3('barrel',4,1),D3('barrel',5,1),D3('hg_jar',1,2),D3('hg_jar',5,2),D3('crate',2,5),D3('crate',3,5),D3('hg_chestwax',3,3)],
  {arrive:{x:1,y:3,f:1},noSouth:true,doors:[{wall:'W',pos:3,to:4921,at:{x:9,y:4,f:3},pic:'hgt_d0'}],lights:[[3,2],[3,4]]});
room(4923,"The Healer's House",7,6,'c','hgt_f6',[D3('hl_p_shelf',2,1),D3('hl_p_shelf',6,1),D3('vase0',1,1),D3('vase1',7,1),D3('kh_int3_3',2,4),D3('kh_int3_3',6,4),D3('hl_p_candle',4,1),D3('kh_int3_1',4,4),D3('hgt_fern',1,6),D3('hgt_pearlbush',7,6)],
  {npcs:[['hg_npc6','hgn_slup',4,3]],lights:[[4,2],[2,3],[6,3],[4,5]]});
room(4924,'The Bell Foundry',11,9,'l','hgt_f3',[D3('hgt_chime',4,3,{bob:1.1,sc:2.6,block:false}),D3('hgt_chime',8,3,{bob:1.1,sc:2.6,block:false}),D3('hgt_chime',6,5,{bob:1.1,sc:2.8,block:false}),D3('brazier0',2,2),D3('brazier0',10,2),D3('brazier0',2,8),D3('brazier0',10,8),D3('hg_waxbarrel',1,5),D3('hg_waxbarrel',11,5),D3('crate',3,7),D3('crate',9,7)],
  {ex:6,npcs:[['hg_npc4','hgxn_founder',6,2]],lights:[[2,2],[10,2],[2,8],[10,8],[6,4]],doors:[{wall:'N',pos:6,to:4925,at:{x:4,y:7,f:0},pic:'hgt_d2'}]});
room(4925,'The Bell Pit',7,7,'l','hgt_f3',[D3('hg_chestjelly',2,2),D3('hg_chestjelly',6,2),D3('hg_chestwax',4,1),D3('hgt_chime',4,3,{bob:.9,sc:2.2,block:false}),D3('hgt_chime',4,5,{bob:.9,sc:1.8,block:false}),D3('statue',1,4),D3('statue',7,4)],
  {arrive:{x:4,y:7,f:0},ex:4,noSouth:true,doors:[{wall:'S',pos:4,to:4924,at:{x:6,y:1,f:2},pic:'hgt_d2'}],lights:[[2,2],[6,2],[4,4],[4,6]]});
room(4926,'The Belfry',9,9,'a','hgt_f5',[D3('hgt_chime',2,2,{bob:1.5,sc:2.2,block:false}),D3('hgt_chime',5,2,{bob:1.5,sc:2.6,block:false}),D3('hgt_chime',8,2,{bob:1.5,sc:2.2,block:false}),D3('hgt_chime',2,5,{bob:1.5,sc:2,block:false}),D3('hgt_chime',8,5,{bob:1.5,sc:2,block:false}),D3('hgt_chime',2,8,{bob:1.5,sc:2.2,block:false}),D3('hgt_chime',8,8,{bob:1.5,sc:2.2,block:false}),D3('hg_chestjelly',5,4),D3('hg_chestwax',5,3),D3('hgt_pearlbush',1,1),D3('hgt_pearlbush',9,1)],
  {npcs:[['hg_npc0','hgxn_ringer',3,5]],lights:[[5,5],[2,2],[8,2],[2,8],[8,8]]});
room(4927,'The Guard House',7,6,'c','hgt_f0',[D3('kh_int4_5',3,2),D3('bench',6,2),D3('sacks',1,5),D3('hl_p_banner',2,1),D3('hl_p_banner',6,1),D3('kh_int5_3',7,2),D3('crate',7,5)],
  {npcs:[['hg_npc4','hgxn_guard',5,3]],lights:[[4,2],[4,5]]});
room(4928,"Trundle's Hall",9,7,'p','hgt_f0',[D3('counter2',3,3),D3('counter2',4,3),D3('counter2',5,3),D3('counter2',6,3),D3('counter2',7,3),D3('crate',1,1),D3('crate',2,1),D3('crate',8,1),D3('crate',9,1),D3('barrel',1,6),D3('barrel',9,6),D3('sacks',9,4),D3('sacks',1,3)],
  {npcs:[['hg_npc5','hgn_trundle',5,2]],lights:[[3,2],[7,2],[5,5]]});
room(4929,'The Lantern Makers',9,7,'a','hgt_f0',[D3('hgt_hanglamp',2,2,{bob:1.3}),D3('hgt_hanglamp',4,2,{bob:1.5}),D3('hgt_hanglamp',6,2,{bob:1.3}),D3('hgt_hanglamp',8,2,{bob:1.5}),D3('hgt_hanglamp',3,4,{bob:1.4}),D3('hgt_hanglamp',5,4,{bob:1.3}),D3('hgt_hanglamp',7,4,{bob:1.4}),D3('kh_int4_5',2,6),D3('kh_int4_5',8,6),D3('hgt_gardenlantern',1,1),D3('hgt_gardenlantern',9,1),D3('hgt_gardenlantern',1,4),D3('hgt_gardenlantern',9,4)],
  {npcs:[['hg_npc1','hgxn_lamp',5,3]],lights:[[3,3],[7,3],[5,5],[2,2],[8,2]]});
room(4930,'The Library of Lanterns',9,8,'l','hgt_f5',[D3('hl_p_shelf',2,1),D3('hl_p_shelf',4,1),D3('hl_p_shelf',6,1),D3('hl_p_shelf',8,1),D3('kh_int1_3',1,3),D3('kh_int1_3',1,5),D3('kh_int1_3',9,3),D3('kh_int1_3',9,5),D3('hl_p_desk',4,4),D3('hl_p_desk',7,4),D3('hg_lectern',7,6),D3('hl_p_candle',3,6)],
  {ex:5,npcs:[['hg_npc6','hgxn_librarian',3,4]],lights:[[5,3],[3,5],[7,5],[5,6]],doors:[{wall:'N',pos:5,to:4931,at:{x:4,y:6,f:0},pic:'hgt_d3'}]});
room(4931,'The Library Loft',7,6,'l','hgt_f5',[D3('kh_int1_3',2,1),D3('kh_int1_3',4,1),D3('kh_int1_3',6,1),D3('hl_p_desk',4,4),D3('hg_chestwax',6,5),D3('hgt_fern',1,6),D3('hl_p_candle',2,4)],
  {arrive:{x:4,y:6,f:0},ex:4,noSouth:true,doors:[{wall:'S',pos:4,to:4930,at:{x:5,y:1,f:2},pic:'hgt_d3'}],lights:[[4,3],[4,5]]});
room(4932,'The Pickling Cellar',9,6,'a','hgt_f6',[D3('barrel',1,1),D3('barrel',2,1),D3('barrel',3,1),D3('barrel',7,1),D3('barrel',8,1),D3('barrel',9,1),D3('hg_jar',1,3),D3('hg_jar',9,3),D3('hg_jar',1,5),D3('hg_jar',9,5),D3('hg_waxbarrel',3,3),D3('hg_waxbarrel',7,3),D3('crate',2,5)],
  {npcs:[['hg_npc1','hgxn_pickler',5,4]],loot:[['hgkelp',4,2],['hgkelp',5,2],['hgkelp',6,2]],lights:[[5,3],[2,2],[8,2]]});
room(4933,"The Pond Keeper's Cellar",9,6,'a','hgt_f6',[D3('hg_jar',1,1),D3('hg_jar',2,1),D3('hg_jar',3,1),D3('hg_jar',7,1),D3('hg_jar',8,1),D3('hg_jar',9,1),D3('hg_waxbarrel',1,4),D3('hg_waxbarrel',9,4),D3('bench',5,5)],
  {npcs:[['hg_npc3','hgxn_pond',5,2]],loot:[['hgpond',3,3],['hgpond',4,3],['hgpond',6,3],['hgpond',7,3]],lights:[[5,3],[2,3],[8,3]]});
room(4934,"The Ringers' Room",7,6,'p','hgt_f0',[D3('hgt_chime',2,2,{bob:1.6,sc:1.7,block:false}),D3('hgt_chime',4,2,{bob:1.6,sc:2,block:false}),D3('hgt_chime',6,2,{bob:1.6,sc:1.7,block:false}),D3('bench',2,5),D3('bench',6,5),D3('hgt_gardenlantern',1,1),D3('hgt_gardenlantern',7,1)],
  {lights:[[4,3],[2,5],[6,5]]});
room(4935,'The Lookout Room',7,6,'c','hgt_f6',[D3('kh_int4_5',4,2),D3('hgt_fern',1,1),D3('hgt_pearlbush',7,1),D3('hg_chestweed',7,5),D3('bench',2,4),D3('hl_p_candle',1,5)],
  {npcs:[['hg_npc6','hgxn_watcher',4,3]],lights:[[4,3],[2,4]]});
room(4936,"The Pearl Cutter's House",7,6,'p','hgt_f6',[D3('counter',3,2),D3('counter',4,2),D3('counter',5,2),D3('hgt_pearlbush',1,1),D3('hgt_pearlbush',7,1),D3('hgt_pearlbush',1,6),D3('hl_p_mirror',7,5),D3('hl_p_candle',2,5)],
  {npcs:[['hg_npc1','hgxn_cutter',4,1]],lights:[[4,3],[2,5]]});
room(4937,'The Costume Room',9,7,'l','hgt_f5',[D3('statue',2,2),D3('statue',4,2),D3('statue',6,2),D3('statue',8,2),D3('hl_p_mirror',1,5),D3('hl_p_mirror',9,5),D3('kh_int4_0',1,1),D3('kh_int4_0',9,1),D3('hl_p_banner',5,1),D3('kh_int3_1',7,5)],
  {npcs:[['hg_npc3','hgxn_costume',5,4]],lights:[[5,3],[2,4],[8,4]]});
room(4938,'The Hidden Room',5,5,'p','hgt_f5',[D3('hg_chestjelly',2,2),D3('hg_chestjelly',4,2),D3('hg_chestweed',3,1),D3('hl_p_candle',1,1),D3('hl_p_candle',5,1),D3('statue',3,3)],
  {lights:[[3,2],[1,4],[5,4]]});
room(4939,'The Reed Store',7,6,'a','hgt_f0',[D3('hgt_reeds',1,1,{bob:0,sc:1.2}),D3('hgt_reeds',2,1),D3('hgt_reeds',6,1),D3('hgt_reeds',7,1),D3('barrel',1,5),D3('barrel',7,5),D3('crate',7,3)],
  {npcs:[['hg_npc3','hgxn_reeder',4,2]],loot:[['hgreed',3,3],['hgreed',4,3],['hgreed',5,3],['hgreed',3,4],['hgreed',5,4],['hgreed',4,4]],lights:[[4,3],[2,4],[6,4]]});

/* the extra townsfolk of Nibb: plain statements of fact (hgNative garbles them until the party knows the grassland tongue) */
const XN=[['hgxn_gate','Gate guard','hg_npc4',['Welcome to Nibb. The festival floor is at the bottom of the stairs.','The south gate and the north gate are both open all day.']],
 ['hgxn_keeper','Lantern keeper','hg_npc0',['The lanterns on the Bell Tower are lit every evening. There are about eighty of them.','The tower leans a little more each year. A step is added to the stair each time it does.']],
 ['hgxn_seat','Townsperson','hg_npc3',['The seats go all the way round the floor. Everyone in Nibb can sit at the same time.','The festival is held when the top terrace is lit. Nobody sits on the floor itself.']],
 ['hgxn_founder','Bellfounder','hg_npc4',['The bells are cast in the pit below this room. The metal comes from old lanterns.','Each bell is tuned by hand. One bell can take a month.']],
 ['hgxn_ringer','Bell ringer','hg_npc0',['There are twenty-two bells in this tower. I ring them at the start and at the end of the festival.','The chests in this room belong to the tower. They were here before I was.']],
 ['hgxn_guard','Guard','hg_npc4',['This house is for the guards of the north gate. We take turns at the door.']],
 ['hgxn_lamp','Lantern maker','hg_npc1',['Each lantern burns for about a day. I make around forty a week.','Glass, wick and oil. That is all a lantern is.']],
 ['hgxn_librarian','Librarian','hg_npc6',['The books here are about the festival, the bells and the lanterns. The older ones are in the loft.']],
 ['hgxn_pickler','Kelp pickler','hg_npc1',['I pickle kelp in these barrels. It keeps for a year. Take what you need from the floor.']],
 ['hgxn_pond','Pond keeper','hg_npc3',['The pond water is kept in this cellar until the festival. Four flasks are on the floor by the barrels.']],
 ['hgxn_watcher','Watcher','hg_npc6',['From this room you can see the whole bowl. The floor is empty except during the festival.']],
 ['hgxn_cutter','Pearl cutter','hg_npc1',['I cut pearls from the shells at the ponds. Most are too small to sell.']],
 ['hgxn_costume','Costume maker','hg_npc3',['The costumes are worn on the floor during the festival. The masks are the oldest part.']],
 ['hgxn_reeder','Reed cutter','hg_npc3',['The reeds are cut at the ponds and dried here. The bundles on the floor are the best of this year.']]];
for(const [id,nm,img,chat] of XN)hgNative(id,nm,img,chat,null);
hgMerchant('hgxn_cart','Lantern trader','hg_npc5','Oil, wicks and glass for the lanterns. Look as long as you like.');

let CITY=null;
function cityB(){return CITY||(CITY=build())}
function roomLevel(id){
  const R=ROOMS[id],w=R.w,d=R.d,ex=R.ex||((w+1)>>1),rows=[];
  for(let y=0;y<d+2;y++){const r=[];for(let x=0;x<w+2;x++)r.push(x===0||y===0||x===w+1||y===d+1?'#':'.');rows.push(r)}
  const chars={'#':mkTile(pat('win',R.t,3,0),3)};let nd=0;const doorCh=()=>'DEFG'[nd++];
  if(!R.noSouth){const lk=cityB().links[id];const ch='D';nd=Math.max(nd,1);
    chars[ch]=doorGid(R.t,3,lk?{lvl:ID,at:{x:lk.x,y:lk.y,f:lk.f}}:null,TN[R.t].d,'win');rows[d+1][ex]=ch}
  for(const dr of R.doors){const ch=doorCh();let x,y;if(dr.wall==='N'){x=dr.pos;y=0}else if(dr.wall==='S'){x=dr.pos;y=d+1}else if(dr.wall==='E'){x=w+1;y=dr.pos}else{x=0;y=dr.pos}
    chars[ch]=doorGid(R.t,3,{lvl:dr.to,at:dr.at},dr.pic||TN[R.t].d,'win');rows[y][x]=ch}
  const decor=[],items=[],lights=R.lights.map(l=>[l[0],l[1]]);
  for(const [k,x,y,o] of R.items){const soft=SOFT.test(k)&&o.block!==true;decor.push(Object.assign({k,x,y,block:!soft&&o.block!==false,walk:soft,deco:soft},o))}
  for(const [k,id2,x,y] of R.npcs)decor.push({k,x,y,block:false,walk:true,npc:id2,sc:1});
  for(const [k,x,y] of R.loot)items.push({k,x,y});
  const st=R.arrive||{x:ex,y:d,f:0};
  return {rows:rows.map(r=>r.join('')),chars,start:{x:st.x,y:st.y,f:st.f},enemies:[],items,decor,lights,portals:[],floor:R.floor,ceil:'beam',ceilH:3,day:0,amb:.5,noTele:true,noExtras:true,diff:66,name:R.name,label:R.name,mapNames:[]};
}
for(let id=INT0;id<=INTN;id++)if(ROOMS[id])hgtRegister(id,roomLevel);


function level(id){
  const B=cityB();
  const L=hgtlAssemble(B,{name:'Nibb',label:'Nibb',start:B.start,diff:66});
  L.chars={};
  for(const ch in hgtaChars)L.chars[ch]=hgtaChars[ch];
  const fm=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=B.fm[y*W+x];fm.push(r)}
  Object.assign(L,{fmap:fm,floorSet:['hgt_f0','hgt_f3','hgt_f4','hgt_f5','hgt_f7','hgt_f2'],floor:'hgt_f0',ceil:'tomb',ceilH:3,day:0,outdoor:true,amb:.72,noExtras:true,noTele:true,diff:66});
  L.terrace.riser=mkTile(['hgt_wc'],1);L.terrace.rg=B.rg;
  L.sky=skyList(B);
  window.HGTXN_B=B;
  return L;
}

/* ================= THE ROOF OF THE CAVERN: festival lanterns, chimes and banners hung high over the city (painted sprites, drawn at their height above the ground) ================= */
function skyList(B){
  const sky=[],gh=(x,y)=>B.h[Math.max(0,Math.min(H-1,Math.round(y)))*W+Math.max(0,Math.min(W-1,Math.round(x)))];
  const add=(x,y,k,w,abs)=>{const z=abs-gh(x,y);if(z>1.2&&x>3&&y>3&&x<W-3&&y<H-3)sky.push({x,y,k,w,z,big:1})};
  for(let i=0;i<230;i++){const a=hash2(i,1,SEED)*Math.PI*2,r=Math.sqrt(hash2(i,2,SEED))*92,v=hash2(i,6,SEED);
    add(CX+Math.cos(a)*r,CY+Math.sin(a)*r,v<.68?'hgt_hanglamp':v<.88?'hgt_chime':'hgt_banner',v<.88?1.3+hash2(i,4,SEED)*1.5:1.1,6+hash2(i,5,SEED)*14)}
  // strings of lanterns on rings round the bowl
  for(const [r,abs,n] of [[22,6.4,34],[33,8.2,46],[44,10,58],[55,11.6,70]])for(let j=0;j<n;j++){const a=j/n*Math.PI*2;add(CX+Math.cos(a)*r,CY+Math.sin(a)*r,'hgt_hanglamp',1.5,abs+(j%2?.6:0))}
  // over the Bell Court and the Lantern Gardens
  for(let i=0;i<46;i++)add(104+hash2(i,7,SEED)*38,6+hash2(i,8,SEED)*38,i%3?'hgt_hanglamp':'hgt_chime',1.4+hash2(i,9,SEED),9+hash2(i,10,SEED)*12);
  for(let i=0;i<36;i++)add(6+hash2(i,11,SEED)*40,6+hash2(i,12,SEED)*40,'hgt_hanglamp',1.5,7+hash2(i,13,SEED)*10);
  return sky}

/* ================= THE OVERVIEW MAP (M key): drawn once from the real level, in the cold parchment of the Hollow Grasslands ================= */
const NM={cv:null,s:1.6,ox:122,oy:44};
function mapDraw(){
  const L=LEVELS[ID];if(!L)return null;
  const c=document.createElement('canvas');c.width=DW*3;c.height=DH*3;const x=c.getContext('2d');x.scale(3,3);
  const ink='#241a12',halo='rgba(226,222,200,.92)',S=NM.s,OX=NM.ox,OY=NM.oy,PX=a=>OX+a*S,PY=a=>OY+a*S;
  const gr=x.createLinearGradient(0,0,0,DH);gr.addColorStop(0,'#c9c6ad');gr.addColorStop(1,'#a9aa94');x.fillStyle=gr;x.fillRect(0,0,DW,DH);
  x.save();x.globalAlpha=.13;for(let i=0;i<150;i++){x.fillStyle=i%3?'#4a5a60':'#ecf0dc';x.beginPath();x.ellipse(hash2(i,1,7)*DW,hash2(i,2,7)*DH,6+hash2(i,3,7)*30,3+hash2(i,4,7)*14,hash2(i,5,7)*3,0,Math.PI*2);x.fill()}x.restore();
  const lab=(t,a,b,sz,col,al)=>{x.save();x.font=`bold ${sz}px ${FUI}`;x.textAlign=al||'center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=3;x.strokeStyle=halo;x.strokeText(t,a,b);x.fillStyle=col||ink;x.fillText(t,a,b);x.restore()};
  // the city, one pixel to the cell: ground in bands of height (low and cool to high and warm), walls pale, stairs lighter
  const sc=document.createElement('canvas');sc.width=W;sc.height=H;const sx=sc.getContext('2d'),im=sx.createImageData(W,H),h=L.terrace.h,kind=L.hgtl.kind;
  for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++){const i=yy*W+xx,o=i*4,ch=L.rows[yy][xx];let r,g,b;
    const ht=h[i];
    if(ch==='.'){const t=Math.max(0,Math.min(1,(ht+2)/10));
      r=150+t*70;g=170+t*40;b=190-t*50;
      if(kind[i]===K.STAIR){r+=26;g+=26;b+=26}
      if(kind[i]===K.COURT){r-=40;g-=20;b+=10}
      if(L.fmap[yy][xx]==='4'){r-=30;g+=14;b-=30}}
    else{const t=Math.max(0,Math.min(1,(ht+2)/10)),wh=(TEX[T_TILE[L.chars[ch]]]||{}).wh||3;const v=Math.min(1,wh/9);
      r=222-v*40;g=204-v*46;b=224-v*30;if(t>.9){}}
    im.data[o]=r;im.data[o+1]=g;im.data[o+2]=b;im.data[o+3]=255}
  sx.putImageData(im,0,0);
  x.save();x.imageSmoothingEnabled=false;x.drawImage(sc,OX,OY,W*S,H*S);x.restore();
  x.strokeStyle=ink;x.lineWidth=1.4;x.strokeRect(OX,OY,W*S,H*S);
  // the terraces: a thin ring on each cliff
  x.strokeStyle='rgba(36,26,18,.55)';x.lineWidth=.7;
  for(const r of [R0,E0,E0+PB,E0+PB*2,E0+PB*3,E0+PB*4]){x.beginPath();x.arc(PX(CX+.5),PY(CY+.5),r*S,0,Math.PI*2);x.stroke()}
  // the bell tower: the spiral of its stair
  {const P=cityB().BT.path;x.strokeStyle='#8a3a2a';x.lineWidth=.9;x.beginPath();P.forEach((q,i)=>i?x.lineTo(PX(q[0]+.5),PY(q[1]+.5)):x.moveTo(PX(q[0]+.5),PY(q[1]+.5)));x.stroke()}
  // doors: small red dots
  x.fillStyle='#b8321e';for(const d of L.hgtl.doors){x.beginPath();x.arc(PX(d.x+.5),PY(d.y+.5),1.1,0,Math.PI*2);x.fill()}
  // names
  for(const n of L.mapNames){if(!n.t)continue;lab(n.t.toUpperCase(),PX(n.x+.5),PY(n.y+.5),n.sz||5.6,n.col)}
  // compass
  {const a=OX+S*140,b=OY+S*-1+12;x.save();x.translate(a,b);x.strokeStyle=ink;x.fillStyle='#e8e4d2';x.lineWidth=1;x.beginPath();x.arc(0,0,8,0,Math.PI*2);x.fill();x.stroke();x.fillStyle=ink;x.beginPath();x.moveTo(0,-12);x.lineTo(2.6,0);x.lineTo(0,-2.2);x.lineTo(-2.6,0);x.closePath();x.fill();x.restore();lab('N',a,b-16,7,ink)}
  // title and key
  x.save();x.font=`18px ${FTITLE}`;x.textAlign='left';x.textBaseline='middle';x.fillStyle=ink;x.fillText('Nibb',8,16);x.restore();
  lab('the festival city',9,32,7,'#5a3c1c','left');
  const lx=372,ly0=70;x.fillStyle=ink;x.font=`bold 8px ${FUI}`;x.textAlign='left';x.fillText('KEY',lx,ly0-10);
  const key=(i,t,draw)=>{const yy=ly0+i*16;draw(lx+8,yy);lab(t,lx+20,yy,6.4,'#3a2a1c','left')};
  key(0,'Door',(a,b)=>{x.fillStyle='#b8321e';x.beginPath();x.arc(a,b,2,0,Math.PI*2);x.fill()});
  key(1,'House',(a,b)=>{x.fillStyle='#d6c8d2';x.strokeStyle=ink;x.lineWidth=.6;x.fillRect(a-3,b-3,6,6);x.strokeRect(a-3,b-3,6,6)});
  key(2,'Stair',(a,b)=>{x.fillStyle='#b6c6d0';x.fillRect(a-4,b-2,8,4);x.strokeStyle='rgba(36,26,18,.7)';x.lineWidth=.6;for(let k=-3;k<=3;k+=2){x.beginPath();x.moveTo(a+k,b-2);x.lineTo(a+k,b+2);x.stroke()}});
  key(3,'Low ground',(a,b)=>{x.fillStyle='rgb(150,170,190)';x.fillRect(a-4,b-3,8,6)});
  key(4,'High ground',(a,b)=>{x.fillStyle='rgb(220,210,140)';x.fillRect(a-4,b-3,8,6)});
  key(5,'Bell tower stair',(a,b)=>{x.strokeStyle='#8a3a2a';x.lineWidth=1;x.beginPath();x.moveTo(a-4,b);x.lineTo(a+4,b);x.stroke()});
  key(6,'Lantern garden',(a,b)=>{x.fillStyle='rgb(120,184,110)';x.fillRect(a-4,b-3,8,6)});
  return c;
}
function mapOverview(){
  if(!NM.cv)NM.cv=mapDraw();
  MPL.reveal=false;if(NM.cv)mplPaint(NM.cv,3,{x:118,y:38,w:252,h:254},cx=>NM.ox+cx*NM.s,cy=>NM.oy+cy*NM.s,'You are the yellow arrow.');
}
{const _do=drawOverview;drawOverview=function(){if(LEVEL===ID&&LEVELS[ID]&&!G.world&&!G.teleMode){mapOverview();return}return _do.apply(this,arguments)}}
{const _f=mplFogOn;mplFogOn=function(L){if(LEVEL===ID)return false;return _f.apply(this,arguments)}}
hgtRegister(ID,level);
return {build,level,ground,mkTile,wc,dch,hs};
})();
