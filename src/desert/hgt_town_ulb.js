/* ==========================================================================
   ULB, THE REED-WEAVERS' CITY (level 482, interiors 4880 to 4899). Prefix hgtxulb. One of the four strange cities of the Hollow Grasslands (tools/HGT_BRIEF.md).
   A terraced hillside of reed-woven shell houses that steps down from the north gate, along a grand cascade of steps, to a sunken reed basin in the south.
   Signature: THE LOOM SPIRE, a double-helix stair (one pink arm and one aqua arm) winding up a stepped cone to a lookout under a column of looms and
   hanging threads of light; its counterpart below ground is the Warp Pit, the same double helix wound downward.
   Plan of the file: tiles and styles, the builder (terrain, cascade, court, spire, pit, gate, districts, houses, towers, plants), finishing walls
   (every wall cell is kept as a design: tint, kind, top height; the picture is chosen last, when its foot is known), the interiors, the folk.
   ========================================================================== */
var HGTCITIES=(typeof HGTCITIES==='undefined')?{}:HGTCITIES;
const HGTXULB={ID:482,INT0:4880,INTN:4899,W:150,H:150,GX:75,Q:.36,PAD:3.6,SP:{x:75,y:60,R0:13,P:6,rc:4.5,rise:.18},PIT:{x:75,y:86,R0:6.6,P:4,rc:2.4,rise:-.16},DEV:{}};
HGTXULB.INT={4880:[9,7],4881:[13,9],4882:[9,7],4883:[9,7],4884:[9,7],4885:[9,9],4886:[11,9],4887:[7,6],4888:[9,7],4889:[7,6],4890:[13,9],4891:[9,7],4892:[9,7],4893:[11,8],4894:[9,7],4895:[15,11],4896:[9,7],4897:[9,7],4898:[9,7],4899:[7,6]}; // interior id -> [width, height]; the party arrives in front of the door in the middle of the bottom wall
HGTXULB.TARGETS=[[4880,44,36],[4881,60,33,20],[4883,96,44],[4884,58,52],[4889,20,92],[4890,92,46],[4891,58,38],[4892,130,30],]; // [interior id, x, y, minimum cells]: the nearest street door becomes the door of that room
HGTCITIES.ulb={level:HGTXULB.ID,key:'ulb',name:'Ulb',entry:{x:75,y:3,f:2},exitDoor:{x:75,y:1,face:0,to:470,at:{x:26,y:89,f:0}},exitDoorSouth:{x:75,y:148,face:2,to:470,at:{x:26,y:111,f:2}}};
LEVEL_NAMES[HGTXULB.ID]='Ulb';

HGTE.look[482]={ambient:.72,lamp:[1,.7,.46],wallGain:1.02,wallSat:1.9,wallAO:.35,floorGain:.82,floorSat:1.35,riserGain:.95,hazeCol:[130,84,170],haze:.34,vignette:.32,motes:80,moteCol:[255,200,230],grade:[240,225,250,.22],roofGain:.7};
(function(){
const U=HGTXULB,W=U.W,H=U.H,Q=U.Q,PAD=U.PAD,cx0=U.SP.x,cy0=U.SP.y;
const qz=(v,q)=>Math.round(v/q)*q;
const rnd=(a,b,k)=>hash2(a,b,4820+(k|0));
const TINTS='pacl',KINDS=[]; // KINDS holds the picture specs: three letters (bottom unit, middle units, top unit) of p plain, w window, b band
const kindOf=spec=>{let i=KINDS.indexOf(spec);if(i<0){KINDS.push(spec);i=KINDS.length-1}return i+1};

/* ---------- wall styles: four pastel tints, each with a plain picture, a window picture and a band picture ---------- */
const TT={p:['hgt_wp','hgt_ww0','hgt_wb0','hgt_d0'],a:['hgt_wa','hgt_ww1','hgt_wb1','hgt_d1'],c:['hgt_wc','hgt_ww3','hgt_wb2','hgt_d3'],l:['hgt_wl','hgt_ww2','hgt_wb3','hgt_d2']};
const wq=wh=>Math.max(.25,Math.ceil(wh*4-1e-6)/4); // wall heights come in quarters of a cell
function wallCh(t,spec,wh){const [pl,wi,ba]=TT[t];wh=wq(wh);const pic=c=>c==='w'?wi:c==='b'?ba:pl;
  return hgtaChar(hgtaWallTile(pl,wh,{base:pic(spec[0]),mid:pic(spec[1]),top:pic(spec[2])}))}
function doorCh(t,wh,lvl,at){const [pl,,,dr]=TT[t];return hgtaChar(hgtaDoorTile(dr,pl,wq(wh),lvl===undefined||lvl===null?null:{lvl,at}))}
/* a stack of risers for the cliff faces: band over window, repeating every two cells of height */
function riserGid(t,kind){const [pl,wi,ba]=TT[t];return hgtaWallTile(pl,kind==='win'?2:1,kind==='win'?{base:wi,top:ba}:{})}

/* ---------- the builder ---------- */
function build(id){
  const B=hgtlNew(W,H,482),I=(x,y)=>y*W+x,ok=(x,y)=>x>=0&&y>=0&&x<W&&y<H,h=B.h,rows=B.rows;
  const wt=new Uint8Array(W*H),wk=new Uint8Array(W*H),wtop=new Float32Array(W*H),wdoor=new Map(),rg=new Int32Array(W*H),fm=new Array(W*H).fill('0'),occ=new Uint8Array(W*H);
  const getH=(x,y)=>ok(x,y)?h[I(x,y)]:0,isOpen=(x,y)=>ok(x,y)&&rows[y][x]==='.';
  const open=(x,y,hh,k)=>{if(!ok(x,y))return;rows[y][x]='.';if(hh!==undefined)h[I(x,y)]=hh;B.kind[I(x,y)]=k|0;wk[I(x,y)]=0};
  /* a wall cell: design only (tint t, kind, top = absolute top height); its picture is chosen at the end */
  const wall=(x,y,t,kind,top,foot)=>{if(!ok(x,y))return;const i=I(x,y);rows[y][x]='#';if(foot!==undefined)h[i]=foot;wt[i]=TINTS.indexOf(t);wk[i]=kindOf(kind);wtop[i]=top;B.kind[i]=0};
  const wallH=(x,y,t,kind,wh,foot)=>wall(x,y,t,kind,(foot!==undefined?foot:getH(x,y))+wh,foot);
  const door=(x,y,face,t,wh,to,tx,ty,tf)=>{const i=I(x,y),d=HGTL.DIRS[face&3];wall(x,y,t,'ppb',getH(x,y)+wh);wdoor.set(i,{face:face&3,lvl:to,at:to?{x:tx,y:ty,f:tf}:null,wh});B.doors.push({x,y,face:face&3,ax:x+d[0],ay:y+d[1],to:to||null})};
  const dec=(k,x,y,o)=>{B.decor.push(Object.assign({k,x,y,block:false},o||{}))};
  const lamp=(x,y,o)=>{if(!isOpen(x,y))return;dec('hgt_lamppost',x,y,Object.assign({walk:true,deco:true},o||{}));B.lights.push([x,y])};
  const light=(x,y)=>B.lights.push([x,y]);
  const GX=U.GX,SP=U.SP;
  const cx=SP.x,cy=SP.y,CR=26;
  const info=U.DEV.info={doors:[],towers:[],features:[]};
  const toInt=id=>({to:id,tx:U.INT[id][0]>>1,ty:U.INT[id][1]-2,tf:0});
  /* --- the natural hillside --- */
  const bowlAt=r=>PAD+Q*Math.floor(Math.max(0,r-14)/2); // the Loom Court is a bowl of broad treads rising outward from the foot of the spire
  const avenueY=y=>y<=10?9.6:y<=34?9.6-(y-10)*(9.6-bowlAt(26))/24:y<=60?bowlAt(60-y):y<=78?PAD:y<=108?PAD-(y-78)*(PAD+1.4)/30:y<=116?-1.4-(y-108)*1.1/8:-2.5;
  const natural=(x,y)=>{
    let g=9.6-.09*Math.max(0,y-12);
    g+=.055*Math.max(0,Math.abs(x-GX)-34);
    const rr=Math.hypot((x-GX)*.5,y-134),bowl=-2.5+.14*Math.max(0,rr-12); // the reed basin: a wide bowl in the south, ringed by terraces
    return Math.max(-2.5,Math.min(g,bowl))};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)h[I(x,y)]=qz(natural(x,y),Q);
  const terr=new Float32Array(h); // the plain hillside, kept for later reference
  /* --- the great cascade: a stair 17 wide down the middle of the city, in treads two rows deep --- */
  for(let y=2;y<H-2;y++){const a=avenueY(y<=10?y:y<=116?Math.floor(y/2)*2:y);for(let x=GX-8;x<=GX+8;x++){open(x,y,a,1);fm[I(x,y)]='1';occ[I(x,y)]=1}}
  /* --- the Loom Court: a round bowl, floor at the foot of the spire, treads rising outward until they meet the hillside --- */
  for(let y=cy-CR-1;y<=cy+CR+1;y++)for(let x=cx-CR-1;x<=cx+CR+1;x++){const r=Math.hypot(x-cx,y-cy);if(r>CR+.5)continue;
    const i=I(x,y),cur=h[i],hb=bowlAt(r);open(x,y,Math.min(cur,hb),r<14.2?5:5);fm[i]=r<14.5?'5':((Math.floor(Math.max(0,r-14)/2))&1?'1':'5');occ[i]=1}
  /* --- THE LOOM SPIRE: a double helix wound up a stepped cone, one pink arm and one aqua arm, with a column of looms rising from the platform at its top --- */
  const helix=o=>hgtxulbHelix(B,Object.assign({open,wall,wallH,door,dec,light,rg,fm,occ,I,ok,isOpen,getH,toInt,h:PAD},o));
  const spire=helix({cx:SP.x,cy:SP.y,R0:SP.R0,P:SP.P,rc:SP.rc,rise:SP.rise,lw:1.0,arms:2,tints:['p','a'],core:true,coreH:[5,10],coreDoor:{id:4885},threads:true});
  U.DEV.spire=spire;
  /* ================= the kit: set pieces that stand in the hillside before the houses fill the rest ================= */
  const clampv=(v,a,b)=>v<a?a:v>b?b:v,T_=(x,y)=>ok(x,y)?terr[I(x,y)]:0;
  const mark=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(ok(x,y))occ[I(x,y)]=1};
  /* a rectangle at height h0 (open), with a margin of m cells whose treads blend back into the hillside; the whole is kept clear of houses */
  const flatten=(x0,y0,x1,y1,h0,m,kind,floor)=>{for(let y=y0-m;y<=y1+m;y++)for(let x=x0-m;x<=x1+m;x++){if(!ok(x,y)||x<3||y<3||x>W-4||y>H-4)continue;const d=Math.max(x0-x,0,x-x1,y0-y,0,y-y1),i=I(x,y);
    if(d===0){open(x,y,h0,kind||0);if(floor)fm[i]=floor}else if(rows[y][x]==='.'&&!occ[i]){h[i]=h0+clampv(T_(x,y)-h0,-Q*d,Q*d)}occ[i]=1}};
  const bench=(x,y,o)=>{if(!isOpen(x,y))return;const k=khProp('bench');if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH('bench');dec(k,x,y,Object.assign({block:true,deco:true},o||{}))};
  const PLANTS=['hgt_fern','hgt_bulbflower','hgt_mushrooms','hgt_shrub','hgt_shellflower','hgt_pearlbush','hgt_crystalgrass','hgt_reeds','hgt_lightvine'];
  const plant=(x,y,kind,o)=>{if(!isOpen(x,y))return;const k=kind||PLANTS[(rnd(x,y,70)*PLANTS.length)|0];dec(k,x,y,Object.assign({walk:true,deco:true,sc:.85+rnd(x,y,71)*.6,ox:(rnd(x,y,72)-.5)*.5,oy:(rnd(x,y,73)-.5)*.5},o||{}));if(rnd(x,y,74)<.4)light(x,y)};
  const bed=(x0,y0,w,d,den,kinds)=>{for(let y=y0;y<y0+d;y++)for(let x=x0;x<x0+w;x++){if(!isOpen(x,y)||B.kind[I(x,y)]===1)continue;if(rnd(x,y,75)<den)plant(x,y,kinds?kinds[(rnd(x,y,76)*kinds.length)|0]:undefined)}};
  /* a wide plaza: flat, paved in pale marble, lamps at the corners, a fountain, benches and glitter beds */
  const plaza=(x0,y0,w,d,o)=>{o=o||{};const h0=qz(T_(x0+(w>>1),y0+(d>>1)),Q);flatten(x0,y0,x0+w-1,y0+d-1,h0,3,5,'5');
    for(const [px,py] of [[x0,y0],[x0+w-1,y0],[x0,y0+d-1],[x0+w-1,y0+d-1]])lamp(px,py);
    if(o.fountain!==false)dec('hgt_fountain',x0+(w>>1),y0+(d>>1),{block:true});
    for(let i=2;i<w-2;i+=4){bench(x0+i,y0+1);bench(x0+i,y0+d-2)}
    bed(x0+1,y0+2,2,d-4,.5);bed(x0+w-3,y0+2,2,d-4,.5);
    info.features.push({k:'plaza',x:x0,y:y0,w,d,name:o.name});return h0};
  /* a pit sunk into the hillside, entered by a broad flight of treads at v=0; origin (x,y) is the entry-side corner, dir the way into the pit */
  const sunken=(x,y,dir,w,d,depth,o)=>{o=o||{};const c=hgtlXf(x,y,dir);let minT=99;
    for(let v=0;v<d;v++)for(let u=0;u<w;u++){const [px,py]=c(u,v);minT=Math.min(minT,T_(px,py))}
    const floor=qz(minT-depth,Q),sw=Math.min(w,o.stairW||3),su=(w-sw)>>1;
    const [ex,ey]=c(su+(sw>>1),-1),te=T_(ex,ey),n=Math.max(1,Math.ceil((te-floor)/.3));
    for(let v=0;v<d;v++)for(let u=0;u<w;u++){const [px,py]=c(u,v);open(px,py,floor,4);fm[I(px,py)]='2';occ[I(px,py)]=1}
    for(let v=0;v<n&&v<d;v++)for(let l=0;l<sw;l++){const [px,py]=c(su+l,v);open(px,py,te-(te-floor)*(v+1)/(n+1),1);fm[I(px,py)]='1'}
    for(let v=-1;v<=d;v++)for(let u=-1;u<=w;u++){if(u>=0&&u<w&&v>=0&&v<d)continue;const [px,py]=c(u,v);if(ok(px,py))occ[I(px,py)]=1}
    let doorCell=null;
    if(o.house&&d>=n+6){const hd=3;for(let v=d-hd;v<d;v++)for(let u=1;u<w-1;u++){const [px,py]=c(u,v);wall(px,py,o.tint||'c',(v===d-hd&&u!==(w>>1)&&rnd(px,py,13)<.5)?'wpb':'ppb',floor+3.5+(d-1-v)*.5)}
      const [dx,dy]=c(w>>1,d-hd);doorCell={x:dx,y:dy,face:(dir+2)&3};}
    for(let v=n+1;v<d-(o.house?3:0);v++){for(const u of [0,w-1]){const [px,py]=c(u,v);if(isOpen(px,py)&&rnd(px,py,77)<.6)plant(px,py)}}
    if(o.fountain){const [fx,fy]=c(w>>1,Math.max(n+1,(d>>1)));if(isOpen(fx,fy))dec('hgt_fountain',fx,fy,{block:true})}
    for(const [u,v] of [[0,n+1],[w-1,n+1]]){const [px,py]=c(u,v);lamp(px,py)}
    if(doorCell){door(doorCell.x,doorCell.y,doorCell.face,o.tint||'c',3.5,null)}
    info.features.push({k:'sunken',x,y,w,d,floor,name:o.name});
    return {floor,n,door:doorCell,c}};
  /* a house on a pedestal: a 9 by 9 platform at ledge height with a tall five by five house on it and a flight of treads at the front. (x,y) is the centre, dir the front. */
  const pedestal=(x,y,dir,o)=>{o=o||{};const c=hgtlXf(x,y,dir),t=o.tint||'a';let g=0,cnt=0;
    for(let v=-4;v<=9;v++)for(let u=-4;u<=4;u++){const [px,py]=c(u,v);if(ok(px,py)){g+=T_(px,py);cnt++}}g=qz(g/cnt,Q);
    const ledge=o.ledge||1.44,hb=g+ledge,n=Math.ceil(ledge/.3);
    // blend the hillside round the pedestal first
    for(let v=-5;v<=5+n;v++)for(let u=-5;u<=5;u++){const [px,py]=c(u,v);if(!ok(px,py))continue;const cd=Math.max(Math.abs(u),Math.abs(v));if(cd>=5||v>=5){if(rows[py][px]==='.')h[I(px,py)]=g+clampv(T_(px,py)-g,-.36,.36)}occ[I(px,py)]=1}
    for(let v=-4;v<=4;v++)for(let u=-4;u<=4;u++){const [px,py]=c(u,v),cd=Math.max(Math.abs(u),Math.abs(v));
      if(cd<=2){const edge=cd===2;wall(px,py,t,edge?(rnd(px,py,14)<.5?'wpb':'ppb'):'ppp',hb+(cd<=0?7.5:cd<=1?5.5:3.8),hb)}
      else{open(px,py,hb,2);fm[I(px,py)]='5'}occ[I(px,py)]=1}
    for(let k=0;k<n;k++)for(let u=-1;u<=1;u++){const [px,py]=c(u,5+k);open(px,py,hb-(k+1)*ledge/n,1);fm[I(px,py)]='1';occ[I(px,py)]=1}
    const [dx,dy]=c(0,2);door(dx,dy,dir,t,3.8,null);
    for(const [u,v] of [[-4,4],[4,4],[-3,-4],[3,-4]]){const [px,py]=c(u,v);lamp(px,py)}
    for(const [u,v] of [[-4,0],[4,0],[0,-4]]){const [px,py]=c(u,v);plant(px,py)}
    info.features.push({k:'pedestal',x,y,dir,hb,name:o.name});
    return {dx,dy,hb}};
  /* a tapering tower: rings of walls rising towards the middle. lean shifts the upper rings. top is the height of the tallest ring above the ground. */
  const taper=(tx,ty,r,top,t,o)=>{o=o||{};const steps=o.steps||4,lean=o.lean||[0,0];let g=-9;
    for(let y=Math.floor(ty-r);y<=Math.ceil(ty+r);y++)for(let x=Math.floor(tx-r);x<=Math.ceil(tx+r);x++)if(ok(x,y)&&Math.hypot(x-tx,y-ty)<=r)g=Math.max(g,T_(x,y));
    for(let y=Math.floor(ty-r-2);y<=Math.ceil(ty+r+2);y++)for(let x=Math.floor(tx-r-2);x<=Math.ceil(tx+r+2);x++){if(!ok(x,y)||x<2||y<2||x>W-3||y>H-3)continue;
      let lv=-1;for(let k=0;k<steps;k++){const f=k/steps,rad=r*(1-.78*f),mx=tx+lean[0]*f*r,my=ty+lean[1]*f*r;if(Math.hypot(x-mx,y-my)<=rad+.01)lv=k}
      if(lv<0)continue;const sp=lv===0?(rnd(x,y,15)<.5?'wpb':'ppb'):lv<steps-1?'pwb':'wwb';
      wall(x,y,lv%2?(o.t2||t):t,sp,g+top*(.42+.58*lv/Math.max(1,steps-1)));occ[I(x,y)]=1}
    info.towers.push({x:tx,y:ty,r,top:g+top});return g};
  /* a square spiral tower (the library's inward spiral): the cells between the lanes become rails, the middle a small lookout. (x,y) is the corner where the stair starts. */
  const sqspiral=(x,y,size,rise,t,o)=>{o=o||{};const h0=qz(T_(x,y),Q);flatten(x,y,x+size-1,y+size-1,h0,2,0);
    const sp=hgtlSpiralStairs(B,x,y,size,h0,rise,{gap:1,wall:null,helix:!!o.helix});
    for(const k of sp.cellH.keys()){const [a,b]=k.split(',').map(Number);fm[I(a,b)]='1';occ[I(a,b)]=1;B.kind[I(a,b)]=1}
    for(let j=y;j<y+size;j++)for(let i=x;i<x+size;i++){const k=i+','+j;if(sp.cellH.has(k))continue;let lo=1e9,hi=-1e9;
      for(const d of HGTL.DIRS){const v=sp.cellH.get((i+d[0])+','+(j+d[1]));if(v!==undefined){lo=Math.min(lo,v);hi=Math.max(hi,v)}}
      if(hi<-1e8)for(const d of [[1,1],[1,-1],[-1,1],[-1,-1]]){const v=sp.cellH.get((i+d[0])+','+(j+d[1]));if(v!==undefined){lo=Math.min(lo,v);hi=Math.max(hi,v)}}
      if(hi<-1e8){lo=hi=sp.top}
      wallH(i,j,t,hi-lo>2.5?'pwb':'ppb',hi-lo+.35,lo);occ[I(i,j)]=1}
    const e=sp.ends[0];
    info.towers.push({x,y,size,top:sp.top,end:e,kind:'square'});
    return {top:sp.top,end:e,entry:sp.entries[0],cellH:sp.cellH}};
  /* a single-arm helix tower: a cone with one stair winding up its outside */
  const helixTower=(tx,ty,R0,P,rc,rise,t,o)=>{o=o||{};const h0=qz(T_(tx,ty),Q);flatten(tx-R0-2,ty-R0-2,tx+R0+2,ty+R0+2,h0,2,0);
    const r=hgtxulbHelix(B,Object.assign({open,wall,wallH,door,dec,light,rg,fm,occ,I,ok,isOpen,getH,h:h0,cx:tx,cy:ty,R0,P,rc,rise,lw:1.0,arms:1,tints:[t],core:true,coreH:o.coreH||[3,6],threads:!!o.threads,wallSpec:'wpb'},o.opts||{}));
    info.towers.push({x:tx,y:ty,R0,top:r.top,kind:'helix'});return r};
  /* a colonnade: a row of tall slim pillars along a line */
  const pillars=(x0,y0,dx,dy,n,gap,t,top)=>{for(let i=0;i<n;i++){const x=x0+dx*gap*i,y=y0+dy*gap*i;if(ok(x,y)&&isOpen(x,y)){const g=getH(x,y);wall(x,y,t,'bbb',g+top)}}};

  /* ================= placements ================= */
  const links={};   // interior id -> {x,y,f}: where the outside door sits (the street cell in front of it)
  const dlink=(d,id)=>{const q=toInt(id);const i=I(d.x,d.y);wdoor.set(i,{face:d.face,lvl:id,at:{x:q.tx,y:q.ty,f:q.tf},wh:wdoor.get(i)?wdoor.get(i).wh:4});links[id]={x:d.ax!==undefined?d.ax:d.x+HGTL.DIRS[d.face][0],y:d.ay!==undefined?d.ay:d.y+HGTL.DIRS[d.face][1],f:d.face};const bd=B.doors.find(b=>b.x===d.x&&b.y===d.y);if(bd)bd.to=id};
  // --- the gate: two round towers, two pillars, an arch, lamps and glitter beds on the plaza
  taper(62,5,3.6,8,'p',{t2:'l',steps:4});taper(88,5,3.6,8,'a',{t2:'c',steps:4});
  pillars(73,2,1,0,2,4,'c',6);
  for(const x of [67,70,80,83]){lamp(x,3);lamp(x,7)}
  bed(66,3,4,5,.35);bed(80,3,4,5,.35);
  // --- the cascade: a colonnade of slim lit pillars along both edges in its steep parts, and lamps
  for(let y=12;y<=32;y+=5){for(const x of [GX-8,GX+8])if(isOpen(x,y)){wall(x,y,(y/5|0)%2?'p':'a','bbb',getH(x,y)+5.5)}}
  for(let y=90;y<=112;y+=5){for(const x of [GX-8,GX+8])if(isOpen(x,y)){wall(x,y,(y/5|0)%2?'p':'a','bbb',getH(x,y)+5.5)}}
  for(let y=14;y<=110;y+=8){if(y>34&&y<86)continue;for(const x of [GX-6,GX+6])lamp(x,y)}
  // --- the Warp Pit: the double helix wound downward, west side of the court; its floor is the door to the Warp Cellar
  const pitH=qz(getH(54,60),Q);flatten(49,55,59,65,pitH,3,0);
  const pit=hgtxulbHelix(B,{open,wall,wallH,door,dec,light,rg,fm,occ,I,ok,isOpen,getH,toInt,h:pitH,cx:54,cy:60,R0:5.8,P:5,rc:2.2,rise:-.2,lw:.75,arms:2,tints:['a','p'],core:true,coreH:t=>[pitH-t+.4,pitH-t+2.4],coreR:.7,doorTo:{id:4886,tint:'l'},wallSpec:'ppb'});
  U.DEV.pit=pit;if(pit.door)links[4886]={x:pit.door.ax,y:pit.door.ay,f:pit.door.face};if(spire.door)links[4885]={x:spire.door.ax,y:spire.door.ay,f:spire.door.face};
  // --- towers and the rest of the kit, west side
  const nwTower=sqspiral(6,5,11,.17,'p');
  const mk1=plaza(28,17,17,11,{name:'The Reed Market'});
  const dyeCourt=sunken(28,46,3,11,18,2.2,{house:true,tint:'l',fountain:false,name:'The Dye Court'});
  const ped1=pedestal(14,66,1,{tint:'p',name:'The Pearl House'});
  const ped2=pedestal(38,100,0,{tint:'c',name:'The Cream House'});
  const shell1=helixTower(17,86,6,5,2.6,.2,'a',{threads:true});
  // --- east side
  const neTower=helixTower(136,14,7,5,2.6,.2,'l',{threads:true,coreH:[3,7]});
  const mk2=plaza(104,20,17,11,{name:'The Thread Market'});
  const spinCourt=sunken(121,48,1,11,18,2.4,{house:true,tint:'a',fountain:true,name:'The Spinners Court'});
  const ped3=pedestal(132,78,3,{tint:'l',name:'The Lilac House'});
  const ped4=pedestal(118,100,2,{tint:'a',name:'The Aqua House'});
  const seTower=sqspiral(130,96,9,.17,'c');
  /* ================= the reed basin: the lowest ground of Ulb ================= */
  const BF=-2.5;
  // the pools: aqua tile floor in two long ovals, thick with reeds
  const pools=[[52,133,14,5],[98,133,14,5],[75,143,22,3],[60,123,0,0]];
  for(const [px,py,rx,ry] of pools){if(!rx)continue;for(let y=py-ry-1;y<=py+ry+1;y++)for(let x=px-rx-1;x<=px+rx+1;x++){if(!ok(x,y)||occ[I(x,y)]||rows[y][x]!=='.')continue;
    const e=Math.hypot((x-px)/rx,(y-py)/ry);if(e<=1&&h[I(x,y)]<BF+.2){fm[I(x,y)]='2';B.kind[I(x,y)]=4}}}
  // the great round plaza at the foot of the cascade, with four obelisks and a fountain
  {const px=GX,py=125,r=8;for(let y=py-r;y<=py+r;y++)for(let x=px-r;x<=px+r;x++){if(Math.hypot(x-px,y-py)<=r+.3){open(x,y,BF,5);fm[I(x,y)]='5';occ[I(x,y)]=1}}
   dec('hgt_fountain',px,py,{block:true});
   for(const [ox,oy] of [[px-6,py],[px+6,py],[px,py-6],[px,py+6]])dec('hgt_obelisk',ox,oy,{block:true});
   for(let a=0;a<8;a++){const lx=Math.round(px+7*Math.cos(a*Math.PI/4+.4)),ly=Math.round(py+7*Math.sin(a*Math.PI/4+.4));lamp(lx,ly)}
   for(let a=0;a<8;a++){const lx=Math.round(px+4*Math.cos(a*Math.PI/4+.4)),ly=Math.round(py+4*Math.sin(a*Math.PI/4+.4));plant(lx,ly,'hgt_shellflower')}
   info.features.push({k:'plaza',x:px,y:py,r,name:'The Reed Plaza'})}
  // causeways of paving between the plaza, the hall and the gate, and across the pools
  const road=(x0,y0,x1,y1,wd)=>{for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)for(let k=0;k<wd;k++){const xx=x+(x0===x1?k:0),yy=y+(y0===y1?k:0);if(!ok(xx,yy)||rows[yy][xx]!=='.')continue;if(h[I(xx,yy)]<BF+.2){h[I(xx,yy)]=BF;fm[I(xx,yy)]='0';B.kind[I(xx,yy)]=0;occ[I(xx,yy)]=1}}};
  road(GX-1,133,GX+1,146,3);road(GX-18,125,GX+18,125,2);road(42,122,42,140,2);road(108,122,108,140,2);road(42,140,108,140,2);road(GX-1,147,GX+1,147,3);
  // the Reed Hall on the middle of the south shore: a long hall with a tower at each end
  {const hx=GX-8,hy=134,hw=17,hd=7;flatten(hx-1,hy-1,hx+hw,hy+hd,BF,2,0);
   for(let y=hy;y<hy+hd;y++)for(let x=hx;x<hx+hw;x++){const edge=y===hy||y===hy+hd-1||x===hx||x===hx+hw-1;wall(x,y,(x+y)%3?'p':'c',edge?(rnd(x,y,16)<.4?'wpb':'ppb'):'ppp',BF+5.5+((y===hy+hd-1)?0:.75));occ[I(x,y)]=1}
   door(GX,hy,0,'l',4,null);const rd=B.doors[B.doors.length-1];rd.hall=1;U.HALL=rd;
   taper(hx-1,hy+3,2.6,8,'a',{t2:'l',steps:3});taper(hx+hw,hy+3,2.6,8,'a',{t2:'l',steps:3});
   road(GX-1,hy-2,GX+1,hy-1,3);
   info.features.push({k:'hall',x:hx,y:hy,w:hw,d:hd,name:'The Reed Hall'})}
  // the cistern house, and two lantern towers that lean, at the edge of the plaza
  {const cx0=59,cy0=119;flatten(cx0-1,cy0-1,cx0+5,cy0+5,BF,2,0);for(let y=cy0;y<cy0+5;y++)for(let x=cx0;x<cx0+5;x++){wall(x,y,'a',(x===cx0||y===cy0||x===cx0+4||y===cy0+4)?(rnd(x,y,17)<.5?'wpb':'ppb'):'ppp',BF+4.25);occ[I(x,y)]=1}
   door(cx0+4,cy0+2,1,'a',3.5,null);U.CIST=B.doors[B.doors.length-1]}
  taper(63,116,2.6,9,'l',{t2:'c',steps:4,lean:[.2,-.4]});taper(87,116,2.6,9,'l',{t2:'c',steps:4,lean:[-.2,-.4]});
  // stilt houses on the terraces round the basin
  const ped5=pedestal(38,130,1,{tint:'l',name:'The Basin House'});const ped6=pedestal(112,130,3,{tint:'p',name:'The Shore House'});
  // reeds and glitter plants over the whole basin floor, thickest in the pools
  for(let y=110;y<H-3;y++)for(let x=3;x<W-3;x++){if(!isOpen(x,y)||occ[I(x,y)]&&fm[I(x,y)]!=='2')continue;if(h[I(x,y)]>BF+.9)continue;const pool=fm[I(x,y)]==='2';
    if(pool){if(rnd(x,y,81)<.42)plant(x,y,rnd(x,y,82)<.7?'hgt_reeds':'hgt_shellflower',{sc:.9+rnd(x,y,83)*.9})}
    else if(rnd(x,y,84)<.05)plant(x,y)}
  /* ================= the town fabric ================= */
  const tintAt=(x,y,k)=>{const pool=x<GX?'ppllcpa':'aaccpla';return pool[(rnd(x,y,k||3)*pool.length)|0]};
  const specFront=(x,y)=>{const r=rnd(x,y,11);return r<.5?'wpb':r<.75?'ppb':r<.9?'bpb':'wwb'};
  const specSide=(x,y)=>{const r=rnd(x,y,12);return r<.3?'wpb':r<.7?'ppb':r<.82?'bpb':'ppp'};
  const reserve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(ok(x,y))occ[I(x,y)]=1};
  const farFromCourt=(x,y)=>Math.hypot(x-cx,y-cy)>CR+1.2;
  const canPlace=(x0,y0,w,d)=>{for(let y=y0;y<y0+d;y++)for(let x=x0;x<x0+w;x++){if(!ok(x,y)||occ[I(x,y)]||rows[y][x]!=='.'||!farFromCourt(x,y))return false}return true};
  /* a house: w across, d deep, its door in the middle of the front, which faces north (0) or south (2). The roof steps up towards the back; sometimes a tower rises at a back corner. */
  let houseN=0;
  const house=(x0,y0,w,d,face,o)=>{
    o=o||{};const t=o.tint||tintAt(x0,y0),inc=[0,.75,1.25][(rnd(x0,y0,6)*3)|0],wh0=o.wh||3+((rnd(x0,y0,5)*3)|0);
    let ref=-9;for(let y=y0;y<y0+d;y++)for(let x=x0;x<x0+w;x++)ref=Math.max(ref,terr[I(x,y)]);
    const tw=(o.tower!==undefined?o.tower:(w>=4&&rnd(x0,y0,7)<.25)),twx=x0+(rnd(x0,y0,8)<.5?0:w-1),dx=x0+(w>>1),id=++houseN;
    for(let j=0;j<d;j++){const dep=face===0?j:d-1-j;
      for(let i=0;i<w;i++){const x=x0+i,y=y0+j,front=dep===0,edge=i===0||i===w-1||dep===d-1;
        let top=ref+wh0+Math.min(inc*dep,2.5),spec=front?specFront(x,y):edge?specSide(x,y):'ppp';
        if(tw&&dep===d-1&&x===twx){top+=3.5+rnd(x0,y0,9)*2;spec='pwb'}
        wall(x,y,t,spec,top);occ[I(x,y)]=1}}
    const fy=face===0?y0:y0+d-1,fx=dx;
    door(fx,fy,face,t,wh0,null);occ[I(fx,fy)]=1;
    const d0=B.doors[B.doors.length-1];d0.house=id;d0.w=w;d0.d=d;
    info.doors.push({x:fx,y:fy,ax:d0.ax,ay:d0.ay,face,house:id});
    return d0};
  /* The streets are rings round the Loom Court, two cells wide, every 13 cells outward (a little wavy), and the houses stand in two rows between each pair of rings with a
     lane of one cell between the rows. Along a ring the houses are 3 to 6 cells wide, some with a one-cell alley between. */
  const FLD=(x,y)=>{const dx=x-cx,dy=y-cy,r=Math.hypot(dx,dy),th=Math.atan2(dy,dx);return r+2.2*Math.sin(th*3+.7)+1.2*Math.sin(th*7+2.1)};
  const F0=28.5,PER=13,NB=7;
  const bound=[];for(let k=0;k<NB;k++)for(let sd=0;sd<2;sd++){const rm=F0+PER*k+(sd?10:4.5),arr=[];let t=rnd(k,sd,40)*6.283,t0=t,n=0;
    while(t<t0+6.2832&&n++<200){const w=3+((rnd(k*7+sd,n,41)*4)|0);arr.push({t:t,gap:rnd(k*7+sd,n,42)<.16,r:rm});t+=w/rm}
    bound.push(arr)}
  const grpOf=new Int32Array(W*H).fill(-1),groups=[];
  const gKey=new Map();
  reserve(60,2,90,8);
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){
    const i=I(x,y);if(occ[i]||rows[y][x]!=='.'||y>136||(y>108&&Math.abs(x-GX)<38))continue;
    const fv=FLD(x,y)-F0;if(fv<0)continue;
    const k=Math.floor(fv/PER),f=fv-PER*k;if(k>=NB)continue;
    let sd;if(f>=2&&f<7)sd=0;else if(f>=8&&f<13)sd=1;else continue;
    const th0=Math.atan2(y-cy,x-cx),arr=bound[k*2+sd];let th=th0-arr[0].t;th=((th%6.2832)+6.2832)%6.2832;
    // which house along the ring: the last boundary at or before this angle
    let j=0;for(let q=0;q<arr.length;q++){const tq=((arr[q].t-arr[0].t)%6.2832+6.2832)%6.2832;if(tq<=th)j=q}
    const tj=((arr[j].t-arr[0].t)%6.2832+6.2832)%6.2832;
    if(arr[j].gap&&(th-tj)*arr[j].r<1.0)continue;
    const key=k+'_'+sd+'_'+j;let g=gKey.get(key);if(g===undefined){g=groups.length;gKey.set(key,g);groups.push({k,sd,j,cells:[]})}
    groups[g].cells.push([x,y,f]);grpOf[i]=g}
  const isStreetCell=(x,y)=>{if(!ok(x,y)||rows[y][x]!=='.'||grpOf[I(x,y)]>=0)return false;const u=FLD(x,y)-F0;if(u<0)return true;const f=u-PER*Math.floor(u/PER);return f<2};
  const dirsC=HGTL.DIRS;
  let nHouses=0;
  for(let gi=0;gi<groups.length;gi++){const G0=groups[gi];if(G0.cells.length<6){for(const c of G0.cells)grpOf[I(c[0],c[1])]=-1;G0.dead=1;continue}
    const t=tintAt(G0.cells[0][0],G0.cells[0][1],3),inc=[0,.75,1.25][(rnd(gi,3,6)*3)|0],wh0=3+((rnd(gi,3,5)*3)|0);
    let ref=-9;for(const c of G0.cells)ref=Math.max(ref,terr[I(c[0],c[1])]);
    // door: a cell of the group that touches a street, nearest the middle of the group
    let mx=0,my=0;for(const c of G0.cells){mx+=c[0];my+=c[1]}mx/=G0.cells.length;my/=G0.cells.length;
    let best=null,bd=1e9;
    for(const c of G0.cells){for(let q=0;q<4;q++){const nx=c[0]+dirsC[q][0],ny=c[1]+dirsC[q][1];if(isStreetCell(nx,ny)){const d=Math.hypot(c[0]-mx,c[1]-my);if(d<bd){bd=d;best={x:c[0],y:c[1],face:q}}}}}
    G0.door=best;
    const tw=G0.cells.length>=16&&rnd(gi,3,7)<.3,twc=G0.cells[(rnd(gi,3,8)*G0.cells.length)|0];
    const front=sdv=>sdv; void front;
    for(const c of G0.cells){const x=c[0],y=c[1],f=c[2],dep=G0.sd===0?f-2:13-f; // how far back from the street this cell is
      let edge=false,frontc=false;for(let q=0;q<4;q++){const nx=x+dirsC[q][0],ny=y+dirsC[q][1];if(ok(nx,ny)&&rows[ny][nx]==='.'&&grpOf[I(nx,ny)]<0){edge=true;if(isStreetCell(nx,ny))frontc=true}}
      let top=ref+wh0+Math.min(inc*Math.max(0,dep),2.5),spec=frontc?specFront(x,y):edge?specSide(x,y):'ppp';
      if(tw&&Math.hypot(x-twc[0],y-twc[1])<1.3){top+=3.5+rnd(gi,3,9)*2.5;spec='pwb'}
      wall(x,y,t,spec,top);occ[I(x,y)]=1}
    if(best){door(best.x,best.y,best.face,t,wh0,null);const d0=B.doors[B.doors.length-1];d0.house=gi;info.doors.push({x:best.x,y:best.y,ax:d0.ax,ay:d0.ay,face:best.face,house:gi,n:G0.cells.length})}
    nHouses++}
  info.houses=nHouses;
  const streets=[];for(let k=0;k<NB+1;k++)streets.push(k);
  /* the ramparts: two cells thick all round, six high above the ground */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(x<2||y<2||x>=W-2||y>=H-2){const g=terr[I(x,y)];wall(x,y,'c',(x+y)%5?'ppp':'pbb',Math.max(g,terr[I(Math.min(W-3,Math.max(2,x)),Math.min(H-3,Math.max(2,y)))])+6.5,g);occ[I(x,y)]=1}}
  /* the north gate and the south gate: a glowing door, an arch in front of it */
  door(GX,1,0,'l',4,470,26,89,0);door(GX,H-2,2,'l',4,470,26,111,2);
  dec('hg_arch',GX,2,{walk:true,deco:true});dec('hg_arch',GX,H-3,{walk:true,deco:true});
  /* lamps along every ring street */
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(!isOpen(x,y)||occ[I(x,y)])continue;const u=FLD(x,y)-F0;if(u<0)continue;const f=u-PER*Math.floor(u/PER);if(f<2&&f>=.9&&((x*7+y*13)%11===0))lamp(x,y)}
  /* ================= connections, pockets, doors ================= */
  /* flights of treads pour from the hillside into the cascade: every eight rows, two cells wide, cut through whatever stands in the way */
  const carve=(x,y,hh)=>{open(x,y,hh,1);fm[I(x,y)]='1';occ[I(x,y)]=1};
  for(const side of [-1,1]){for(let y0=13;y0<=112;y0+=8){if(y0>32&&y0<88)continue;
    for(const dy of [0,1]){const y=y0+dy;let cur=getH(GX+side*8,y);
      for(let k=1;k<=18;k++){const x=GX+side*(8+k);if(!ok(x,y)||x<3||x>W-4)break;
        const here=isOpen(x,y)&&!occ[I(x,y)]?getH(x,y):null;
        if(here!==null&&Math.abs(here-cur)<=.45&&k>1)break;
        if(here!==null&&Math.abs(here-cur)<=.45&&k===1&&Math.abs(T_(x,y)-cur)<=.45)break;
        const want=cur+clampv(T_(x,y)-cur,-.3,.3);carve(x,y,want);cur=want}}}}
  /* pockets that nothing can reach are walled in */
  const sealPockets=()=>{if(U.NOSEAL)return 0;const r=hgtlReach(B,B.start?B.start.x:GX,B.start?B.start.y:3),seen=r.seen;let n=0;const done=new Uint8Array(W*H);info.sealedBig=[];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(rows[y][x]!=='.'||seen[I(x,y)]||done[I(x,y)])continue;
      const q=[[x,y]],comp=[];done[I(x,y)]=1;while(q.length){const [a,b]=q.pop();comp.push([a,b]);for(const d of HGTL.DIRS){const nx=a+d[0],ny=b+d[1];if(!isOpen(nx,ny)||done[I(nx,ny)]||seen[I(nx,ny)]||Math.abs(getH(nx,ny)-getH(a,b))>.55)continue;done[I(nx,ny)]=1;q.push([nx,ny])}}
      if(comp.length>12)info.sealedBig.push([comp.length,x,y]);
      for(const [a,b] of comp){wall(a,b,tintAt(a,b,3),'ppp',getH(a,b)+3.5+rnd(a,b,80)*2);occ[I(a,b)]=1;n++}}
    return n};
  const sealed=sealPockets();info.sealed=sealed;
  // decor and lights that ended up inside walls are dropped
  B.decor=B.decor.filter(d=>isOpen(d.x,d.y));B.lights=B.lights.filter(l=>isOpen(l[0],l[1]));
  /* interior doors: the nearest reachable street door to each target */
  const reach2=hgtlReach(B,B.start?B.start.x:GX,B.start?B.start.y:3).seen;
  const freeDoors=info.doors.filter(d=>d.house!==undefined&&rows[d.y][d.x]!=='.'&&isOpen(d.ax,d.ay)&&reach2[I(d.ax,d.ay)]&&!wdoor.get(I(d.x,d.y)).lvl);
  const assign=(id,tx,ty,nmin)=>{let best=null,bd=1e9;for(const d of freeDoors){if(d.used||(nmin&&(d.n||0)<nmin))continue;const dd=Math.hypot(d.x-tx,d.y-ty);if(dd<bd){bd=dd;best=d}}
    if(!best)return null;best.used=1;best.id=id;dlink(best,id);return best};
  U.TARGETS.forEach(t=>assign(t[0],t[1],t[2],t[3]));
  // the doors of the pedestals, the sunken houses and the tops of the towers
  const linkDoor=(rec,id)=>{if(!rec)return;const bd=B.doors.find(b=>b.x===rec.x&&b.y===rec.y);if(bd){bd.to=id;dlink(Object.assign({},rec,{ax:bd.ax,ay:bd.ay,face:bd.face}),id)}};
  linkDoor({x:ped1.dx,y:ped1.dy},4898);linkDoor(dyeCourt.door&&{x:dyeCourt.door.x,y:dyeCourt.door.y},4888);linkDoor(spinCourt.door&&{x:spinCourt.door.x,y:spinCourt.door.y},4897);dlink(U.HALL,4895);dlink(U.CIST,4894);
  U.LINKS=links;
  B.start={x:GX,y:3,f:2};
  /* every door that leads nowhere becomes a window: only the doors that open are doors */
  for(const d of info.doors){if(d.used||wdoor.get(I(d.x,d.y)).lvl)continue;const i=I(d.x,d.y);wdoor.delete(i);wk[i]=kindOf('wpb');const bd=B.doors.findIndex(b=>b.x===d.x&&b.y===d.y);if(bd>=0)B.doors.splice(bd,1)}
  info.doors=info.doors.filter(d=>d.used);
  /* a second door in the Loom Spire: at the foot of an inner wall, on the aqua stair, into the Pattern Archive */
  {let best=null;for(const g of spire.gapWalls){if(g.arm!==1)continue;for(const d of HGTL.DIRS){const lc=spire.lane.get((g.i+d[0])+','+(g.j+d[1]));if(lc&&Math.abs(lc.h-g.lo)<.01&&lc.u>.45&&lc.u<.6&&!best)best={g,d,lc}}}
    if(best){const q=toInt(4893),face=HGTL.DIRS.findIndex(z=>z[0]===best.d[0]&&z[1]===best.d[1]);door(best.g.i,best.g.j,face,'a',best.g.hi-best.g.lo+.6,4893,q.tx,q.ty,q.tf);const rec=B.doors[B.doors.length-1];links[4893]={x:rec.ax,y:rec.ay,f:rec.face}}}
  /* looms, tapestries and threads of light on the top platform, round the column */
  {const ring=spire.plat.filter(c=>{const r=Math.hypot(c[0]-cx,c[1]-cy);return r>2.5});let n=0;
   for(const c of ring){if(!isOpen(c[0],c[1])||(c[0]===(spire.door&&spire.door.ax)&&c[1]===(spire.door&&spire.door.ay)))continue;n++;
     if(n%2===0)dec('kh_int4_2',c[0],c[1],{block:true,deco:true,sc:1.5});else if(n%3===1)dec('kh_int4_3',c[0],c[1],{block:true,deco:true,sc:1.4});else dec('hgt_lightvine',c[0],c[1],{walk:true,deco:true,sc:1.4,bob:.1});light(c[0],c[1])}
   NPC_H.kh_int4_2=1.0;NPC_H.kh_int4_3=1.0}
  /* the basin is dressed: stalls on the shore, lamps down every causeway, trees, giant caps and glitter plants on the banks, benches by the plaza */
  for(const [sx,sy] of [[GX-12,121],[GX+12,121],[GX-14,128],[GX+14,128],[GX-12,131],[GX+12,131]]){const k=khProp(['stallA','stallC','stallB','stallD','stallE','stallF'][(sx+sy)%6]);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH('stallA');if(isOpen(sx,sy))dec(k,sx,sy,{block:true,deco:true,sc:1.3})}
  for(let y=112;y<H-3;y++)for(let x=3;x<W-3;x++){if(!isOpen(x,y)||B.kind[I(x,y)]===1)continue;const r=rnd(x,y,86),road=fm[I(x,y)]==='0'||fm[I(x,y)]==='5';
    if(road){if((x+y*3)%9===0)lamp(x,y);continue}
    if(fm[I(x,y)]==='2')continue;
    if(h[I(x,y)]<-2.3){if(r<.06)dec(['hgt_willow','hgt_fairytree','hgt_giantcap'][(r*100|0)%3],x,y,{block:true,sc:.9+rnd(x,y,87)*.6});else if(r<.2)plant(x,y,['hgt_reeds','hgt_mushrooms','hgt_bulbflower','hgt_crystalgrass'][(r*100|0)%4])}
    else if(r<.18)plant(x,y)}
  for(let x=GX-6;x<=GX+6;x+=4){bench(x,119);bench(x,131)}
  /* ================= the folk, and what waits at the tops of the towers ================= */
  const nearOpen=(tx,ty,seen)=>{let best=null,bd=1e9;for(let dy=-9;dy<=9;dy++)for(let dx=-9;dx<=9;dx++){const x=tx+dx,y=ty+dy;if(!isOpen(x,y)||(seen&&!seen[I(x,y)])||B.kind[I(x,y)]===1)continue;if(B.decor.some(d=>d.x===x&&d.y===y&&d.block))continue;const d=Math.hypot(dx,dy);if(d<bd){bd=d;best=[x,y]}}return best};
  const folk=(id,img,tx,ty,sc)=>{const c=nearOpen(tx,ty,reach2);if(!c)return;dec(img,c[0],c[1],{block:false,walk:true,npc:id,sc:sc||1})};
  folk('hgn_plonk','hg_npc4',72,4);folk('hgn_lorr','hg_npc4',36,23);folk('hgxulb_wuubb','hg_npc0',75,18);folk('hgxulb_orp','hg_npc4',57,63);folk('hgxulb_child','hg_npc3',70,78,.8);
  folk('hgxulb_sloob','hg_npc1',75,126);
  { // the top of the Loom Spire: a lookout on the platform and a lamp
    const pl=spire.plat.filter(c=>Math.hypot(c[0]-cx,c[1]-cy)>2.6).sort((a,b)=>b[0]-a[0]);if(pl.length){const c=pl[0];dec('hg_npc6',c[0],c[1],{block:false,walk:true,npc:'hgxulb_blem',sc:1});}
    for(let k=0;k<spire.plat.length;k+=3){const c=spire.plat[k];light(c[0],c[1])}}
  { // a door at the top of the north-west tower into the hermit's cell
    const e=nwTower.end;let done=false;
    for(const d of HGTL.DIRS){const wx=e[0]+d[0],wy=e[1]+d[1];if(done||!ok(wx,wy)||rows[wy][wx]==='.')continue;const face=HGTL.DIRS.findIndex(q=>q[0]===-d[0]&&q[1]===-d[1]);
      const q=toInt(4899);door(wx,wy,face,'l',1.8,4899,q.tx,q.ty,q.tf);const rec=B.doors[B.doors.length-1];links[4899]={x:rec.ax,y:rec.ay,f:rec.face};wdoor.get(I(wx,wy)).wh=1.8;done=true}}
  // a chest at the top of each of the other towers
  for(const t of [seTower,{end:[neTower.plat[0][0],neTower.plat[0][1]]},{end:[shell1.plat[0][0],shell1.plat[0][1]]}]){const e=t.end;if(e&&isOpen(e[0],e[1]))dec(['hg_chestjelly','hg_chestwax','hg_chestweed'][(e[0]+e[1])%3],e[0],e[1],{block:true})}
  /* ================= faces of the cliffs, names on the map, the far towers ================= */
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=I(x,y);if(rows[y][x]!=='.'||rg[i])continue;let drop=0;
    for(const d of HGTL.DIRS){const nx=x+d[0],ny=y+d[1];if(rows[ny][nx]==='.')drop=Math.max(drop,h[i]-h[I(nx,ny)])}
    if(drop>.55){const t=TINTS[(rnd(x>>2,y>>2,90)*4)|0];rg[i]=riserGid(t,drop>1.6&&rnd(x,y,91)<.8?'win':'plain')}}
  for(const c of spire.lane.values())rg[I(c.i,c.j)]=riserGid(c.arm?'a':'p',rnd(c.i,c.j,92)<.6?'win':'plain');
  for(const c of pit.lane.values())rg[I(c.i,c.j)]=riserGid(c.arm?'p':'a','plain');
  const nm=(t,x,y)=>hgtlName(B,x,y,t,'place');
  nm('North Gate',GX,6);nm('The Great Cascade',GX,24);nm('The Loom Court',GX,40);nm('THE LOOM SPIRE',cx,cy);nm('The Warp Pit',54,60);nm('The Reed Market',36,22);nm('The Thread Market',112,25);
  nm('Dyers’ Tower',11,10);nm('The Dye Court',22,52);nm('The Spinners Court',128,53);nm('The Shell Tower',136,14);nm('The Reed Shell Tower',17,86);nm('The Reed Plaza',GX,125);nm('The Reed Hall',GX,138);nm('South Gate',GX,145);nm('The Reed Basin',55,132);nm('The Cream House',38,98);nm('The Aqua House',118,98);
  // far towers stand outside the walls, a ring of them, fading into the haze
  const sky=[];for(let i=0;i<44;i++){const f=(i+rnd(i,1,95)*.7)/44*4,e=Math.floor(f),u=f-e,m=10+rnd(i,2,96)*26,x=e===0?-m+u*(W+2*m):e===2?W+m-u*(W+2*m):e===1?W+m:-m,y=e===0?-m:e===2?H+m:e===1?-m+u*(H+2*m):H+m-u*(H+2*m),k='hg_tower'+['4','5','7','7','5','6','4'][(rnd(i,3,97)*7)|0];sky.push({x,y,k,w:9+rnd(i,6,100)*10,z:0,big:1})}
  U.SKY=sky;
  B.start={x:GX,y:3,f:2};
  return {B,rg,fm,wt,wk,wtop,wdoor,occ,info,terr};
}

/* ---------- the helix: spiral stairs wound round a centre, up (rise>0) or down (rise<0). arms 2 is the double helix (two lanes interleaved, like the strands of a rope),
   arms 1 a single stair round a cone. A lane is lw cells either side of its centre line. The cells between lanes are walls: foot at the lower lane, a low rail above the higher. ---------- */
function hgtxulbHelix(B,o){
  const {cx,cy,R0,P,rc,rise,open,wall,wallH,rg,fm,I,tints}=o,h0=o.h,lw=o.lw||1.0,arms=o.arms||2,S=P/arms;
  const lane=new Map(),twoPi=Math.PI*2,arc=u=>twoPi*(R0*u-P*u*u/2),umax=(R0-rc)/P,rmax=R0+2.5;
  for(let j=Math.floor(cy-rmax);j<=Math.ceil(cy+rmax);j++)for(let i=Math.floor(cx-rmax);i<=Math.ceil(cx+rmax);i++){
    const dx=i-cx,dy=j-cy,r=Math.hypot(dx,dy);if(r>R0+lw+.05||r<rc-1)continue;
    let th=Math.atan2(dy,dx);if(th<0)th+=twoPi;
    const q=arms*th/twoPi,m=Math.round((R0-r)/S-q),rcm=R0-S*(m+q),u=(m+q)/arms;
    if(Math.abs(r-rcm)>lw||u<-.0001||u>umax)continue;
    lane.set(i+','+j,{i,j,m,u,arm:((m%arms)+arms)%arms,h:h0+rise*arc(Math.max(0,u)),side:r-rcm});
  }
  // thin lanes touch only at their corners: fill in a cell wherever two lane cells meet diagonally and share no neighbour
  for(const c of [...lane.values()]){for(const [dx,dy] of [[1,1],[1,-1],[-1,1],[-1,-1]]){const d=lane.get((c.i+dx)+','+(c.j+dy));if(!d||Math.abs(d.h-c.h)>.5)continue;
    if(lane.has((c.i+dx)+','+c.j)||lane.has(c.i+','+(c.j+dy)))continue;
    const a=[c.i+dx,c.j],b=[c.i,c.j+dy],pick=Math.hypot(a[0]-cx,a[1]-cy)>Math.hypot(b[0]-cx,b[1]-cy)?b:a;
    const r=Math.hypot(pick[0]-cx,pick[1]-cy);lane.set(pick[0]+','+pick[1],{i:pick[0],j:pick[1],m:c.m,u:c.u,arm:c.arm,h:(c.h+d.h)/2,side:c.side});void r}}
  for(const c of lane.values()){open(c.i,c.j,c.h,1);fm[I(c.i,c.j)]='1';o.occ[I(c.i,c.j)]=1;rg[I(c.i,c.j)]=0}
  const top=h0+rise*arc(umax);
  const plat=[];
  for(let j=Math.floor(cy-rc-2);j<=Math.ceil(cy+rc+2);j++)for(let i=Math.floor(cx-rc-2);i<=Math.ceil(cx+rc+2);i++){const r=Math.hypot(i-cx,j-cy);if(r<=rc-.2&&!lane.has(i+','+j)){open(i,j,top,2);fm[I(i,j)]='5';o.occ[I(i,j)]=1;plat.push([i,j])}}
  const nb4=[[1,0],[-1,0],[0,1],[0,-1]],nb8=nb4.concat([[1,1],[1,-1],[-1,1],[-1,-1]]);
  const gapWalls=[];
  for(let j=Math.floor(cy-rmax);j<=Math.ceil(cy+rmax);j++)for(let i=Math.floor(cx-rmax);i<=Math.ceil(cx+rmax);i++){
    const r=Math.hypot(i-cx,j-cy);if(r>R0+lw+.6||r<rc-.2||lane.has(i+','+j))continue;
    let lo=1e9,hi=-1e9,arm=0;
    for(const d of nb4){const c=lane.get((i+d[0])+','+(j+d[1]));if(c){if(c.h<lo)lo=c.h;if(c.h>hi){hi=c.h;arm=c.arm}}}
    if(hi<-1e8)for(const d of nb8){const c=lane.get((i+d[0])+','+(j+d[1]));if(c){if(c.h<lo)lo=c.h;if(c.h>hi){hi=c.h;arm=c.arm}}}
    if(hi<-1e8)continue;
    if(r>R0+lw+.05&&hi-lo<.3)continue;
    const wh=Math.abs(hi-lo)+.35,wl=Math.min(lo,hi),sp=o.wallSpec||((rnd(i,j,60)<.5)?'wwb':'pwb');
    wallH(i,j,tints[arm%tints.length],wh>2.5?sp:'ppb',wh,wl);
    o.occ[I(i,j)]=1;gapWalls.push({i,j,lo,hi,arm});
  }
  const ch=typeof o.coreH==='function'?o.coreH(top):o.coreH,coreCells=[],isPlat=(a,b)=>plat.some(p=>p[0]===a&&p[1]===b),faceTo=(dx,dy)=>HGTL.DIRS.findIndex(d=>d[0]===dx&&d[1]===dy);
  if(o.core){const cr=o.coreR||2.3;for(let j=Math.floor(cy-cr-1);j<=Math.ceil(cy+cr+1);j++)for(let i=Math.floor(cx-cr-1);i<=Math.ceil(cx+cr+1);i++){const r=Math.hypot(i-cx,j-cy);
    if(r<=cr){wallH(i,j,'l','bbb',r<=1.2?ch[1]:ch[0],top);o.occ[I(i,j)]=1;coreCells.push([i,j])}}}
  // a door in the foot of the column of looms (coreDoor) or in a wall at the bottom of the pit (doorTo)
  let doorRec=null;
  const tryDoor=(cells,spec,tint,wh)=>{for(const c of cells){for(const d of HGTL.DIRS){if(isPlat(c[0]+d[0],c[1]+d[1])){const q=o.toInt(spec.id);o.door(c[0],c[1],faceTo(d[0],d[1]),tint,wh,spec.id,q.tx,q.ty,q.tf);doorRec={x:c[0],y:c[1],ax:c[0]+d[0],ay:c[1]+d[1],face:faceTo(d[0],d[1])};return true}}}return false};
  if(o.coreDoor)tryDoor(coreCells.filter(c=>Math.hypot(c[0]-cx,c[1]-cy)>1.3).sort((a,b)=>b[0]-a[0]),o.coreDoor,'l',ch[0]);
  if(o.doorTo)tryDoor(gapWalls.map(g=>[g.i,g.j]).sort((a,b)=>Math.hypot(a[0]-cx,a[1]-cy)-Math.hypot(b[0]-cx,b[1]-cy)),o.doorTo,o.doorTo.tint||'l',Math.abs(top-h0)+.6);
  // threads of light: a hanging light on the inside edge of the lanes, every third cell
  if(o.threads){let n=0;for(const c of lane.values()){if(c.side>-.4)continue;if(((c.i*5+c.j*3)%3)!==0)continue;o.dec('hgt_lightvine',c.i,c.j,{walk:true,deco:true,sc:1.1,bob:.15});if((n++)%2===0)o.light(c.i,c.j)}}
  return {lane,umax,top,plat,gapWalls,arc,door:doorRec};
}

/* ---------- the rooms: small shell-walled interiors (levels 4880 to 4899). Each is a flat level with the door back out in the middle of the bottom wall. ---------- */
const ROOMS={};
const R_=(id,name,tint,floor,fn,o)=>{ROOMS[id]=Object.assign({id,name,tint,floor,fn},o||{})};
/* the folk of Ulb who are not quest givers: plain things to say about the city */
const hgtxulbFolk=[ // [id, name, picture, lines]
 ['hgxulb_teeb','Weaver Teeb','hg_npc1',['The Loom Spire has two stairs. The pink one starts on the east side of the court and the aqua one on the west side. Both end at the same top.','The two stairs never meet on the way up. Nobody has found a reason for that.']],
 ['hgxulb_slon','Weaver Slon','hg_npc3',['I weave the reed ropes that hold the lamps. One rope takes two days.','Every lamp in the lower city hangs from a rope I made.']],
 ['hgxulb_wuubb','Stair-keeper Wuubb','hg_npc0',['The great cascade runs from the north gate down to the reed basin. The Loom Court is about half way down.','I sweep the treads every morning. The dust comes from the houses, not from the stairs.']],
 ['hgxulb_orp','Pit-warden Orp','hg_npc4',['The Warp Pit is the Loom Spire turned upside down. Its stairs go down, not up.','There is a door at the bottom of the pit, into the Warp Cellar. It is not locked.']],
 ['hgxulb_blem','Lookout Blem','hg_npc6',['From the top of the spire you can see the whole city, the basin to the south and the north gate.','The door at the foot of the column of looms leads to a room. Few people go up to see it.']],
 ['hgxulb_sloob','Reed-warden Sloob','hg_npc1',['The reed basin is the lowest place in Ulb. The reeds grow thickest at the south end.','Do not cut the reeds by the island. They are the thick ones, and they are counted.']],
 ['hgxulb_pluub','Dyer Pluub','hg_npc5',['Pink dye comes from shell dust. Aqua dye comes from pond algae. Lilac needs both.','Walls are painted with the same dyes as cloth. That is why the houses are these colours.']],
 ['hgxulb_guild','Guildmaster Hobb','hg_npc0',['The Weavers’ Guild keeps a loom going in the hall at all hours. The work is never finished, and that is intended.','Upstairs is the loft, where the finest cloth is made. Go up if you want to see it.']],
 ['hgxulb_archivist','Archivist Nilp','hg_npc6',['This is the Pattern Archive. Every pattern woven in Ulb has a drawing here.','The oldest pattern is a spiral. It is also the newest, because people keep weaving it.']],
 ['hgxulb_innkeeper','Innkeeper Gwoll','hg_npc5',['The inn is called The Last Thread. Beds are free for travellers who can understand me.','Soup is reed-root and kelp. It is the same every day.']],
 ['hgxulb_lantern','Lamp-maker Tuub','hg_npc3',['I make the lamps for the whole city. A lamp is a glass bulb, a reed cage and a light that does not go out.','The glow in the bulbs comes from the pond. I do not know why it glows.']],
 ['hgxulb_hermit','The Hermit','hg_npc0',['I sit at the top of the Dyers’ Tower because nobody else wants the stairs.','From here you can see the Loom Spire. It looks smaller than it is.']],
 ['hgxulb_cistern','Cistern-keeper Brop','hg_npc4',['The cistern collects water from the cascade. It is cold and it glows a little.','Fill a flask if you like. It tastes of pennies.']],
 ['hgxulb_hall','Reed-Hall Steward Mimm','hg_npc1',['The Reed Hall stands on the island in the basin. Feasts are held here on festival days.','The gallery upstairs looks over the whole hall. It is the best place to sit.']],
 ['hgxulb_cellar','Warp-minder Glip','hg_npc3',['The threads in this cellar are the warp for the whole city. Do not pull any.','The pools are shallow. They are only for the dye.']],
 ['hgxulb_child','Small Ploob','hg_npc3',['I ran up the whole pink stair without stopping. It took a long time.','The top of the spire has a door. I did not open it.']]
];
for(const [id,nm,img,chat] of hgtxulbFolk)hgNative(id,nm,img,chat,null,{sc:/child|Small/.test(nm)?.8:undefined});
hgMerchant('hgxulb_trader','Skeet, the reed trader','hg_npc5','Reeds, ropes, kelp and honey. Look as long as you like.');
function hgtxulbRoom(id){
  const sp=ROOMS[id];if(!sp)return null;
  if(!LEVELS[HGTXULB.ID]&&KH_LAZY[HGTXULB.ID])KH_LAZY[HGTXULB.ID]();
  const [W_,H_]=HGTXULB.INT[id],mid=W_>>1,rows=[],decor=[],lights=[],items=[],chars={},TL=sp.tint;
  const wall=hgtaChar(hgtaWallTile(TT[TL][0],3,{base:TT[TL][0],mid:TT[TL][0],top:TT[TL][2]}));
  const wallW=hgtaChar(hgtaWallTile(TT[TL][0],3,{base:TT[TL][1],mid:TT[TL][0],top:TT[TL][2]}));
  for(let y=0;y<H_;y++){let r='';for(let x=0;x<W_;x++)r+=(y===0||y===H_-1||x===0||x===W_-1)?((x+y)%4===0?wallW:wall):'.';rows.push(r.split(''))}
  const lk=HGTXULB.LINKS&&HGTXULB.LINKS[id]||{x:75,y:3,f:2};
  const put=(role,x,y,o)=>{const k=khProp(role);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH(role);decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}))};
  const raw=(k,x,y,o)=>decor.push(Object.assign({k,x,y,block:true},o||{}));
  const npc=(nid,img,x,y,o)=>decor.push(Object.assign({k:img,x,y,block:true,npc:nid,sc:1},o||{}));
  const light=(x,y)=>lights.push([x,y]);
  const chest=(x,y,k)=>decor.push({k:k||'hg_chestjelly',x,y,block:true});
  const drs=[];
  const door=(x,y,to,t)=>{const q=HGTXULB.INT[to],tx=q?(q[0]>>1):0,ty=q?q[1]-2:0;rows[y][x]=hgtaChar(hgtaDoorTile(TT[t||TL][3],TT[t||TL][0],3,{lvl:to,at:{x:tx,y:ty,f:0}}));drs.push({x,y,to})};
  // the way out
  rows[H_-1][mid]=sp.parent?hgtaChar(hgtaDoorTile(TT[TL][3],TT[TL][0],3,{lvl:sp.parent.id,at:sp.parent.at})):hgtaChar(hgtaDoorTile(TT[TL][3],TT[TL][0],3,{lvl:HGTXULB.ID,at:{x:lk.x,y:lk.y,f:lk.f}}));
  const ctx={W:W_,H:H_,mid,put,raw,npc,light,chest,door,decor,rows,items,
    back:(x,y,to,face)=>{rows[y][x]=hgtaChar(hgtaDoorTile(TT[TL][3],TT[TL][0],3,{lvl:to,at:{x:HGTXULB.INT[to][0]>>1,y:HGTXULB.INT[to][1]-2,f:0}}))},
    backAt:(x,y,to,at)=>{rows[y][x]=hgtaChar(hgtaDoorTile(TT[TL][3],TT[TL][0],3,{lvl:to,at}))}};
  sp.fn(ctx);
  for(const r of rows)void r;
  Object.assign(chars,hgtaChars);
  const L={rows:rows.map(r=>r.join('')),chars,start:{x:mid,y:H_-2,f:0},enemies:[],items,decor,lights:sp.lights||lights,portals:[],day:0,amb:sp.amb||.62,floor:sp.floor||'wood',ceil:'beam',ceilH:3,name:sp.name,label:sp.name,
    diff:66,noTele:true,noExtras:true,mapNames:[{t:sp.name,x:mid,y:1,k:'place'}]};
  return L;
}
R_(4880,'Granny Murrp’s House','p','wood',({put,raw,npc,light})=>{put('hearth',4,1);put('potshelf',2,1);put('kitchenshelf',6,1);put('bed',1,3);put('cradle',1,5);put('table',6,4);put('chair',5,4);put('chair',7,4);put('loom',7,2);npc('hgn_murrp','hg_npc1',3,3);light(2,2);light(6,2);light(4,4)});
R_(4881,'The Weavers’ Guildhall','l','hgt_f5',({put,raw,npc,light,door})=>{for(const x of [2,4,8,10])put('loom',x,2);for(const x of [3,6,9])put('tapestry',x,1);put('table',2,5);put('chair',3,5);put('table',10,5);put('chair',9,5);put('rolledcarpets',11,3);put('rolledcarpets',1,3);npc('hgxulb_guild','hg_npc0',6,3);door(6,0,4882);for(const [x,y] of [[2,3],[6,2],[10,3],[4,6],[8,6]])light(x,y)});
R_(4882,'The Loom Loft','p','wood',({put,npc,light})=>{for(const x of [2,4,6])put('loom',x,2);put('rolledcarpets',1,4);put('cradle',7,4);put('tapestry',4,1);npc('hgxulb_slon','hg_npc3',3,4);light(2,3);light(6,3);light(4,5)},{parent:{id:4881,at:{x:6,y:1,f:2}}});
R_(4883,'Healer Neeb’s House','a','wood',({put,npc,light})=>{put('bed',1,2);put('bed',1,4);put('bed',7,2);put('bed',7,4);put('washstand',3,1);put('potshelf',5,1);put('cushions',6,5);npc('hgn_neeb','hg_npc6',4,3);light(2,3);light(6,3);light(4,5)});
R_(4884,'Elder Orrl’s Room','c','wood',({put,npc,light})=>{for(const x of [1,2,6,7])put('bookcase',x,1);put('tapestry',4,1);put('desk',4,2);put('chair',2,4);put('chair',6,4);put('brazier',1,5);put('brazier',7,5);npc('hgn_orrl','hg_npc0',3,3);light(2,3);light(6,3);light(4,5)});
R_(4885,'The Spindle Room','l','hgt_f5',({put,raw,npc,light,chest,items})=>{put('shrine',4,1);put('brazier',3,1);put('brazier',5,1);put('harp',1,3);put('birdcage',7,3);for(const [x,y] of [[2,5],[6,5],[2,3]])put('cushions',x,y);chest(1,1,'hg_chestjelly');chest(7,1,'hg_chestjelly');chest(1,6,'hg_chestwax');chest(7,6,'hg_chestweed');items.push({k:'hgjelly',x:4,y:3},{k:'hgcrystal',x:5,y:3});for(const [x,y] of [[2,2],[6,2],[4,4],[2,6],[6,6]])light(x,y)},{amb:.7});
R_(4886,'The Warp Cellar','a','hgt_f3',({put,raw,npc,light,door})=>{for(const [x,y] of [[2,2],[8,2],[2,5],[8,5]])put('basin',x,y);for(const [x,y] of [[1,1],[9,1],[1,7],[9,7]])put('amphora',x,y);put('rolledcarpets',5,1);put('rack',3,1);put('rack',7,1);npc('hgxulb_cellar','hg_npc3',5,3);door(9,0,4887);for(const [x,y] of [[2,3],[5,2],[8,3],[3,6],[7,6],[5,5]])light(x,y)});
R_(4887,'The Hidden Skein','l','hgt_f5',({put,chest,light,items})=>{chest(1,1,'hg_chestjelly');chest(5,1,'hg_chestwax');chest(1,3,'hg_chestweed');put('candle',3,1);put('cushions',4,3);items.push({k:'hgcrystal',x:3,y:3});light(2,2);light(4,2);light(3,4)},{parent:{id:4886,at:{x:9,y:1,f:2}},amb:.7});
R_(4888,'The Dyers’ House','p','hgt_f3',({put,npc,light})=>{for(const [x,y] of [[1,1],[3,1],[5,1],[7,1]])put('basin',x,y);put('rack',1,4);put('rack',7,4);put('amphora',1,5);put('amphora',7,5);put('tapestry',4,1);npc('hgxulb_pluub','hg_npc5',4,3);light(2,3);light(6,3);light(4,5)});
R_(4889,'The Reed-Cutter’s Hut','c','wood',({put,raw,npc,light})=>{put('bed',1,2);put('hearth',3,1);put('rack',5,1);raw('crate',5,3);raw('barrel',1,4);npc('hgn_bibb','hg_npc3',3,3,{sc:.8});light(2,2);light(4,3)});
R_(4890,'The Last Thread (inn)','p','wood',({put,raw,npc,light})=>{for(const x of [4,5,7,8])put('counter',x,3);for(const x of [3,4,8,9])put('shelf',x,1);put('hearth',6,1);for(const [x,y] of [[3,5],[9,5],[3,7],[9,7]]){put('table',x,y);put('chair',x-1,y);put('chair',x+1,y)}raw('barrel',1,2);raw('barrel',11,2);npc('hgxulb_innkeeper','hg_npc5',6,2);for(const [x,y] of [[3,2],[9,2],[6,5],[2,6],[10,6]])light(x,y)});
R_(4891,'The Reed Trader','a','wood',({put,raw,npc,light})=>{for(const x of [3,5])put('counter',x,3);for(const x of [1,2,3,5,6,7])put('shelf',x,1);put('amphora',1,5);put('amphora',7,5);put('chest',1,4);put('chest',7,4);raw('crate',7,3);raw('barrel',1,3);npc('hgxulb_trader','hg_npc5',4,2);light(2,2);light(6,2);light(4,4)});
R_(4892,'The Lamp-Maker’s Workshop','c','wood',({put,npc,light})=>{for(const x of [1,2,6,7])put('shelf',x,1);put('brazier',3,1);put('brazier',5,1);for(const [x,y] of [[1,4],[7,4],[1,5],[7,5]])put('floorlamp',x,y);put('hlamp',4,1);npc('hgxulb_lantern','hg_npc3',4,3);for(const [x,y] of [[2,3],[6,3],[2,5],[6,5],[4,4]])light(x,y)});
R_(4893,'The Pattern Archive','l','hgt_f5',({put,npc,light})=>{for(const x of [1,2,3,7,8,9])put('bookcase',x,1);for(const y of [3,4,5])put('bookcase',1,y),put('bookcase',9,y);put('desk',4,3);put('desk',6,3);put('chair',4,4);put('chair',6,4);npc('hgxulb_archivist','hg_npc6',5,2);for(const [x,y] of [[3,2],[7,2],[3,5],[7,5],[5,4]])light(x,y)});
R_(4894,'The Cistern House','a','hgt_f3',({put,npc,light})=>{for(const [x,y] of [[1,1],[3,1],[5,1],[7,1],[1,4],[7,4]])put('basin',x,y);put('amphora',1,5);put('amphora',7,5);npc('hgxulb_cistern','hg_npc4',4,3);light(2,3);light(6,3);light(4,5)});
R_(4895,'The Reed Hall','p','hgt_f5',({put,raw,npc,light,door})=>{put('throne',7,1);for(const x of [3,11])put('banner',x,1);for(const x of [5,9])put('banner',x,1);for(const [x,y] of [[4,4],[10,4],[4,7],[10,7]]){put('feast',x,y);put('bench',x-1,y);put('bench',x+1,y)}for(const [x,y] of [[2,2],[12,2],[2,8],[12,8]])put('brazier',x,y);npc('hgxulb_hall','hg_npc1',7,3);door(13,0,4896);for(const [x,y] of [[3,3],[11,3],[7,5],[3,7],[11,7],[7,8]])light(x,y)},{amb:.66});
R_(4896,'The Reed Hall Gallery','p','wood',({put,chest,light})=>{for(const x of [2,4,6])put('chair',x,2);put('harp',1,4);put('banner',7,1);chest(7,4,'hg_chestweed');light(2,3);light(6,3);light(4,5)},{parent:{id:4895,at:{x:13,y:1,f:2}}});
R_(4897,'The Spinners’ Sunken House','a','wood',({put,npc,light})=>{put('loom',2,2);put('loom',6,2);put('bed',1,4);put('hearth',4,1);put('cushions',7,4);npc('hgxulb_teeb','hg_npc1',4,3);light(2,3);light(6,3);light(4,5)});
R_(4898,'The Pedestal House','p','wood',({put,chest,light})=>{put('bed',1,2);put('harp',7,2);for(const [x,y] of [[2,4],[4,4],[6,4]])put('cushions',x,y);put('birdcage',4,1);chest(7,5,'hg_chestjelly');light(2,3);light(6,3);light(4,5)});
R_(4899,'The Hermit’s Cell','l','hgt_f5',({put,npc,light})=>{put('shrine',3,1);put('candle',2,1);put('candle',4,1);put('cushions',1,3);put('cushions',5,3);npc('hgxulb_hermit','hg_npc0',3,3);light(2,2);light(4,3)},{amb:.66});
/* chunk_post */
/* ---------- finishing: pictures for every designed wall ---------- */
function finish(S){
  const {B,wt,wk,wtop,wdoor}=S,W=B.W,H=B.H,h=B.h,rows=B.rows;
  const dirs=HGTL.DIRS;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const ch=rows[y][x];if(ch==='.')continue;const i=y*W+x;
    let foot=h[i];
    for(const d of dirs){const nx=x+d[0],ny=y+d[1];if(nx<0||ny<0||nx>=W||ny>=H||rows[ny][nx]!=='.')continue;const nh=h[ny*W+nx];if(nh<foot)foot=nh}
    if(wk[i]){const top=wtop[i],dd=wdoor.get(i);let wh=top-foot;if(wh<.5)wh=.5;
      h[i]=foot;
      rows[y][x]=dd?doorCh(TINTS[wt[i]],wh,dd.lvl,dd.at):wallCh(TINTS[wt[i]],KINDS[wk[i]-1],wh)}
    else{h[i]=foot}
  }
}

/* ---------- registration ---------- */
{const _lf=lootFor;lootFor=function(d){const inHgt=typeof LEVEL==='number'&&LEVEL>=4880&&LEVEL<=4899&&d&&/^hg_(chest|waxbarrel|jar)/.test(d.k);if(inHgt){const s0=LEVEL;LEVEL=470;try{return _lf.apply(this,arguments)}finally{LEVEL=s0}}return _lf.apply(this,arguments)}} // hgtxulbLoot: chests in the rooms of Ulb hold the same things as the chests of the grassland
hgtRegister(HGTXULB.ID,function(id){
  const S=build(id),B=S.B;
  finish(S);
  U.DEV.B=B;
  const L=hgtlAssemble(B,{name:'Ulb',label:'Ulb',start:B.start});
  L.terrace={h:B.h,rg:S.rg,riser:hgtaWallTile('hgt_wc',1)};
  L.fmap=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=S.fm[y*W+x];L.fmap.push(r)}
  L.floorSet=['hgt_f0','hgt_f4','hgt_f3','hgt_f2','hgt_f7','hgt_f5'];L.floor='hgt_f0';L.ceil='tomb';L.ceilH=3;L.amb=.9;L.noExtras=true;L.diff=66;
  L.chars=Object.assign({},hgtaChars);
  L.sky=U.SKY.slice();
  {const ORN=['hgt_finial','hgt_cupola','hgt_chimney','hgt_banner','hgt_chime','hgt_finial'],WW={hgt_finial:1.2,hgt_cupola:1.6,hgt_chimney:1.2,hgt_banner:1.3,hgt_chime:1.1};
   for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const i=y*W+x;if(S.wk[i]===0||B.rows[y][x]==='.')continue;const top=S.wtop[i],z=top-B.h[i];if(z<3.2||rnd(x,y,93)>(z>6?.35:.07))continue;
     const k=ORN[(rnd(x,y,94)*ORN.length)|0];L.sky.push({x:x+.5,y:y+.5,k,w:WW[k]*(z>7?1.5:1),z:z+.35,big:0})}
   // a crown of banners and chimes on the column of looms
   for(const [dx,dy,k,z] of [[0,0,'hgt_cupola',10.2],[.4,.4,'hgt_chime',8.3],[-.5,-.2,'hgt_banner',9],[.6,-.4,'hgt_finial',11.4]])L.sky.push({x:cx0+.5+dx,y:cy0+.5+dy,k,w:k==='hgt_banner'?1.6:2,z,big:1})}
  return L;
});
for(const id in ROOMS){LEVEL_NAMES[id]=ROOMS[id].name;hgtRegister(+id,hgtxulbRoom)}
})();
