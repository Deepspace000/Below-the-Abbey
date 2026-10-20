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

  /* ================= THE BELL TOWER OF LANTERNS ================= */
  const BT={x0:116,y0:12,n:17,rings:4,rise:0};
  (function bellTower(){
    const {x0,y0,n,rings}=BT,x1=x0+n-1,y1=y0+n-1,path=[],ringOf=[];
    for(let r=0;r<rings;r++){
      const xa=x0+3*r,xb=x1-r,ya=y0+2*r,yb=y1-2*r,last=r===rings-1,add=(x,y)=>{path.push([x,y]);ringOf.push(r)};
      for(let x=xa;x<=xb;x++)add(x,yb);
      for(let y=yb-1;y>=ya;y--)add(xb,y);
      for(let x=xb-1;x>=xa;x--)add(x,ya);
      for(let y=ya+1;y<=(last?yb-1:yb-2);y++)add(xa,y);
      if(!last){add(xa+1,yb-2);add(xa+2,yb-2)}
    }
    const total=26,rise=total/path.length;BT.rise=rise;BT.path=path;BT.ringOf=ringOf;
    const hh=new Map();path.forEach((c,i)=>{const h=TOP+(i+1)*rise;hh.set(c[0]+','+c[1],h);hgtlOpen(B,c[0],c[1],h,K.STAIR);B.occ.add(c[0]+','+c[1]);B.res[I(c[0],c[1])]=3});
    hgtlRegRun(B,path.map(c=>[c[0],c[1]]),TOP,rise,'spiral');

    const xa3=x0+9,xb3=x1-3,ya3=y0+6,yb3=y1-6,topH=TOP+total;
    const inNeedle=(x,y)=>x>xa3&&x<xb3&&y>ya3&&y<yb3;
    // everything else in the box: separators between the lanes (foot at the lower lane, top a little above the higher lane), and the needle
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
      if(hh.has(x+','+y))continue;
      B.fm[I(x,y)]=3;
      if(inNeedle(x,y))continue;
      let lo=1e9,hi=-1e9;
      for(const [i,j] of [[1,0],[-1,0],[0,1],[0,-1]]){const v=hh.get((x+i)+','+(y+j));if(v!==undefined){lo=Math.min(lo,v);hi=Math.max(hi,v)}}
      if(lo===1e9)for(const [i,j] of [[1,1],[-1,1],[1,-1],[-1,-1]]){const v=hh.get((x+i)+','+(y+j));if(v!==undefined){lo=Math.min(lo,v);hi=Math.max(hi,v)}}
      if(lo===1e9){lo=TOP;hi=TOP+1}
      // separators on the rim of the box are low parapets of the ring beside them; inner ones rise to the lane above
      const wh=qwh(hi-lo+.45),corner=(x===xa3-1||x===xb3+1)&&(y===ya3-1||y===yb3+1);
      if(corner){hgtlWall(B,x,y,wc('tow','l',qwh(topH+4-lo),0),lo);continue}
      hgtlWall(B,x,y,wc('plain',(x+y)%5===0?'a':'p',wh,0),lo);
    }
    // the needle: a stepped spire on the summit, 3 by 3, with the belfry door on its south face
    const nx=(xa3+xb3)>>1,ny=(ya3+yb3)>>1,summit=Math.min(...path.filter((c,i)=>ringOf[i]===rings-1).map(c=>hh.get(c[0]+','+c[1])));
    for(let y=ya3+1;y<=yb3-1;y++)for(let x=xa3+1;x<=xb3-1;x++){
      const cen=x===nx&&y===ny,edge=(x===nx||y===ny),top=topH+(cen?9:edge?7:5),foot=summit;
      hgtlWall(B,x,y,wc('tow','a',qwh(top-foot),0),foot)}
    BT.nx=nx;BT.ny=ny;BT.summit=summit;BT.topH=topH;BT.door={x:nx,y:yb3-1,ax:nx,ay:yb3};
    BT.start={x:x0,y:y1+1};
    // the foot of the stair: a short flight of broad steps from the court, so the way in is plain
  })();

  /* ================= THE WELL OF BELLS (the sunken counterpart) ================= */
  const WL={cx:110,cy:37,r:7.2,depth:8};
  (function well(){
    const {cx,cy,r,depth}=WL,floor=TOP-depth,N=34,step=depth/N,a0=-Math.PI*.5; // the stair starts on the north side and winds round
    for(let y=Math.floor(cy-r-1);y<=Math.ceil(cy+r+1);y++)for(let x=Math.floor(cx-r-1);x<=Math.ceil(cx+r+1);x++){
      const dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy);
      if(d>=r)continue;
      if(d<4.4){hgtlOpen(B,x,y,floor,K.COURT);continue}
      let a=Math.atan2(dy,dx)-a0;a=((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
      const t=a/(Math.PI*2),sidx=Math.floor(t*N*1.0);
      // one turn: the step index runs from 0 at the entrance down to N-1 at the far side of the turn; the ring is two cells wide
      hgtlOpen(B,x,y,Math.max(floor,TOP-step*(sidx+1)),K.STAIR);
    }
    B.wellFloor=floor;
    // the bell house in the middle of the pit: a round mass of wall with the foundry door on its side facing the end of the stair
    for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)hgtlWall(B,cx+i,cy+j,wc('tow','l',5,0),floor);
    WL.door={x:cx,y:cy+1,ax:cx,ay:cy+2};
  })();

  /* ================= HOUSES ================= */
  const used=new Uint8Array(W*H); // 1 = house wall
  function placeHouse(x,y,w,d,face,t,wh,o){
    o=o||{};const h0=hAt(x,y);
    for(let j=0;j<d;j++)for(let i=0;i<w;i++){used[I(x+i,y+j)]=1;const edge=i===0||j===0||i===w-1||j===d-1;hgtlWall(B,x+i,y+j,wc(o.kind||'win',t,wh,(x+i+y+j)&1),h0)}
    const f=face&3,dx=f===1?w-1:f===3?0:(w>>1),dy=f===2?d-1:f===0?0:(d>>1);
    const hs_={x,y,w,d,face:f,h:h0,t,wh,door:[x+dx,y+dy],front:[x+dx+DIRS[f][0],y+dy+DIRS[f][1]],kind:o.kind||'win',band:B.band[I(x,y)],tower:!!o.tower};
    B.houses.push(hs_);return hs_}
  function faceOf(x,y,w,d,toward){ // door face: toward a point (cx,cy), along the axis that is longer
    const mx=x+w/2-toward[0],my=y+d/2-toward[1];
    return Math.abs(mx)>Math.abs(my)?(mx>0?3:1):(my>0?0:2)}
  function pack(o){
    const list=[];for(let y=o.y0;y<=o.y1;y++)for(let x=o.x0;x<=o.x1;x++)if(o.test(x,y))list.push([x,y]);
    list.sort((a,b)=>hs(a[0],a[1],o.k)-hs(b[0],b[1],o.k));
    for(const [x,y] of list){
      if(!isO(x,y)||used[I(x,y)]||B.occ.has(x+','+y))continue;
      const sz=o.sizes[(hs(x,y,o.k+1)*o.sizes.length)|0],sw=hs(x,y,o.k+2)<.5,w=sw?sz[1]:sz[0],d=sw?sz[0]:sz[1],h0=hAt(x,y);
      let ok=true;
      for(let j=-1;j<=d&&ok;j++)for(let i=-1;i<=w&&ok;i++){const cx=x+i,cy=y+j;if(!inB(cx,cy)){ok=false;break}
        const inside=i>=0&&j>=0&&i<w&&j<d;
        if(!isO(cx,cy)||used[I(cx,cy)]||Math.abs(hAt(cx,cy)-h0)>.01||B.band[I(cx,cy)]<0){ok=false;break}
        const kd=B.kind[I(cx,cy)];if(kd===K.STAIR){ok=false;break}
        if(inside&&(!o.test(cx,cy)||B.res[I(cx,cy)]||B.occ.has(cx+','+cy))){ok=false;break}
        if(!inside&&B.res[I(cx,cy)]===3){ok=false;break}}
      if(!ok)continue;
      const t=o.tint(x,y),wh=o.wh(x,y),face=faceOf(x,y,w,d,o.toward?o.toward(x,y):[CX,CY]);
      placeHouse(x,y,w,d,face,t,wh,o.opts)}
  }
  // the lantern terraces round the bowl: houses on the back of each band, the front two and a half rows left as a promenade
  const BT_TINT=['p','a','c','l','p'],BT_WH=[[3,3,4],[4,4,5],[5,5,6],[6,6,7]];
  for(let k=0;k<=3;k++){
    pack({x0:20,y0:20,x1:130,y1:132,k:100+k,test:(x,y)=>{const g=B.band[I(x,y)];if(g!==k)return false;const r=Math.hypot(x-CX,y-CY);return r>=E0+PB*k+2.5&&r<E0+PB*(k+1)-.2},
      sizes:[[4,3],[5,3],[4,4],[3,3],[5,4]],tint:(x,y)=>BT_TINT[k],wh:(x,y)=>BT_WH[k][(hs(x,y,7)*BT_WH[k].length)|0]})}
  // the outer band and the rim plateau
  return B;
}

function level(id){
  const B=build();
  const L=hgtlAssemble(B,{name:'Nibb',label:'Nibb',start:B.start,diff:66});
  L.chars={};
  for(const ch in hgtaChars)L.chars[ch]=hgtaChars[ch];
  const fm=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=B.fm[y*W+x];fm.push(r)}
  Object.assign(L,{fmap:fm,floorSet:['hgt_f0','hgt_f3','hgt_f4','hgt_f5','hgt_f7','hgt_f2'],floor:'hgt_f0',ceil:'tomb',ceilH:3,day:0,outdoor:true,amb:.8,noExtras:true,noTele:true,diff:66});
  L.terrace.riser=mkTile(['hgt_wc'],1);
  window.HGTXN_B=B;
  return L;
}
hgtRegister(ID,level);
return {build,level,ground,mkTile,wc,dch,hs};
})();
