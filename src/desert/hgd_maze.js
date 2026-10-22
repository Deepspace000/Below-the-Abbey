/* ==========================================================================
   THE DEEPER HOLLOW, STAGE 1: THE GREAT MAZE. A 201 x 201 level that is one giant maze of winding one-square corridors. It starts as a hedge maze at the foot and climbs through
   biomes: stone, honeycomb, shell, sandstone, then three coloured bands. Open spaces are cut into it: rooms (stone, rectangular), clearings (round, grass) and atriums
   (large, with trees, plants and ponds). Trees and plants stand only in openings, never in a one-square passage. Replaces hgdBuild of hgt_deeper.js (name prefix hgdm / HGDM).
   Later stages add the people, shops, quests, danger zones, secret doors, keys and the maps.
   ========================================================================== */
const HGDM={W:201,H:201,CELLS:100,biomes:[
  {k:'hedge',n:'The Hedge Maze',wall:'lushwall',fl:0},
  {k:'stone',n:'The Stone Warrens',wall:'tex_abbeywall',fl:1},
  {k:'wax',n:'The Honeycomb Reach',wall:'hg_wax',fl:2},
  {k:'shell',n:'The Shell Galleries',wall:'art_tex_hgt_w3_relief_aqua',fl:3},
  {k:'sand',n:'The Sandstone Deeps',wall:'art_tex_wall_rubble',fl:4},
  {k:'lapis',n:'The Blue Quarter',wall:'art_tex_wall_lapis',fl:1},
  {k:'glyph',n:'The Mosaic Halls',wall:'art_tex_hgt_w2_mosaic',fl:4},
  {k:'gold',n:'The Gilded Quarter',wall:'art_tex_wall_gold',fl:2}]};
const HGDM_FLOORS=['dgrass','cobble','wood','hgtb_f_shellflags','tombsand','hgtb_pool'];
function hgdmRng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
hgdBuild=function hgdBuildMaze(){
  if(LEVELS[HGD.ID])return;hgWaxTex();
  const W=HGDM.W,H=HGDM.H,N=HGDM.CELLS,rnd=hgdmRng(475001),g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  // ---- the maze: a depth-first walk that likes to go straight on, so the passages wind in long runs ----
  const seen=new Uint8Array(N*N),st=[],D=[[0,-1],[1,0],[0,1],[-1,0]],cx0=N>>1,cy0=N-1;
  const carve=(i,j)=>{g[2*j+1][2*i+1]='.'};
  // ---- the lakes: three rectangles of the cell grid the walk never enters (carved afterwards as closed rooms of deep water, see below) ----
  const LAKES=[];{const lr=hgdmRng(475777),SPEC=[[8,32,56,78],[58,86,34,58],[28,64,17,30]];
    for(const [xa,xb,ya,yb] of SPEC){const wc=7+((lr()*4)|0),hc=5+((lr()*3)|0);for(let t=0;t<60;t++){const a=xa+((lr()*(xb-xa))|0),c=ya+((lr()*(yb-ya))|0),b=a+wc,d=c+hc;
      if(LAKES.some(k=>Math.abs(k.a-a)<24&&Math.abs(k.c-c)<16))continue;LAKES.push({a,b,c,d,x0:2*a+1,x1:2*b+1,y0:2*c+1,y1:2*d+1});break}}
    for(const k of LAKES)for(let j=k.c;j<=k.d;j++)for(let i=k.a;i<=k.b;i++)seen[j*N+i]=1}
  const nearLake=(x,y,r)=>LAKES.some(k=>x+r+4>=k.x0-1&&x-r-4<=k.x1+1&&y+r+4>=k.y0-1&&y-r-4<=k.y1+1);
  st.push([cx0,cy0,-1]);seen[cy0*N+cx0]=1;carve(cx0,cy0);
  while(st.length){const [i,j,pd]=st[st.length-1],opts=[];
    for(let d=0;d<4;d++){const ni=i+D[d][0],nj=j+D[d][1];if(ni>=0&&nj>=0&&ni<N&&nj<N&&!seen[nj*N+ni])opts.push(d)}
    if(!opts.length){st.pop();continue}
    let d=opts[(rnd()*opts.length)|0];if(pd>=0&&opts.includes(pd)&&rnd()<.62)d=pd;
    const ni=i+D[d][0],nj=j+D[d][1];seen[nj*N+ni]=1;g[2*j+1+D[d][1]][2*i+1+D[d][0]]='.';carve(ni,nj);st.push([ni,nj,d])}
  // a few loops, so the maze is not one single tree
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(g[y][x]!=='#')continue;
    if((y%2===1&&x%2===0&&g[y][x-1]==='.'&&g[y][x+1]==='.'||y%2===0&&x%2===1&&g[y-1][x]==='.'&&g[y+1][x]==='.')&&rnd()<.05)g[y][x]='.'}
  // the lakes are carved as a placeholder (so no other builder treats them as open ground); hgd_lakes.js turns it into water at the very end
  const PH=String.fromCharCode(0x361);
  for(const k of LAKES)for(let y=k.y0;y<=k.y1;y++)for(let x=k.x0;x<=k.x1;x++)g[y][x]=PH;
  // ---- the biome of every place: bands climbing away from the start, with a ragged edge; the top is three coloured quarters ----
  const sx=cx0*2+1,sy=cy0*2+1,maxd=Math.hypot(W/2,H);
  const nz=(x,y)=>{let v=0;for(let o=0;o<3;o++){const f=1/(11*(1+o)),a=Math.sin(x*f*1.7+o*3.1)+Math.sin(y*f*2.3+o*1.7)+Math.sin((x+y)*f*1.1+o*5.3);v+=a/(3*(1+o))}return v}
  const biomeAt=(x,y)=>{const t=(sy-y)/H+Math.abs(x-sx)/W*.45+nz(x,y)*.035;
    if(t<.17)return 0;if(t<.34)return 1;if(t<.5)return 2;if(t<.66)return 3;if(t<.8)return 4;
    return 5+(x<W/3?0:x<2*W/3?1:2)}; // the Blue Quarter, the Mosaic Halls, the Gilded Quarter
  const bio=new Uint8Array(W*H);for(let y=0;y<H;y++)for(let x=0;x<W;x++)bio[y*W+x]=biomeAt(x,y);
  // ---- the open places: atriums, rooms and clearings ----
  const kind=new Uint8Array(W*H); // 0 passage or wall, 1 clearing, 2 room, 3 atrium
  const spots=[],far=(x,y,d)=>spots.every(s=>Math.hypot(s.x-x,s.y-y)>=d+s.r*.6);
  const place=(type,r,tries,gap)=>{for(let t=0;t<tries;t++){const x=3+r+((rnd()*(W-6-2*r))|0),y=3+r+((rnd()*(H-6-2*r))|0);
    if(Math.hypot(x-sx,y-sy)<r+9||nearLake(x,y,r))continue;if(!far(x,y,gap+r))continue;spots.push({type,x,y,r});return true}return false};
  const top={type:3,x:W>>1,y:12,r:12,boss:true};spots.push(top);
  let na=0;while(na<13&&place(3,7+((rnd()*4)|0),400,5))na++;
  let nr=0;while(nr<26&&place(2,4+((rnd()*3)|0),400,4))nr++;
  let nc=0;while(nc<58&&place(1,3+((rnd()*3)|0),400,3))nc++;
  const cuts=[];
  for(const s of spots){const R=s.r;let cells=0;
    for(let y=s.y-R;y<=s.y+R;y++)for(let x=s.x-R;x<=s.x+R;x++){if(x<2||y<2||x>=W-2||y>=H-2)continue;
      let inn;if(s.type===2){inn=Math.abs(x-s.x)<=R&&Math.abs(y-s.y)<=Math.max(2,Math.round(R*.7))}else{inn=Math.hypot(x-s.x,y-s.y)<=R+(s.type===3?.4:.2)}
      if(inn){g[y][x]='.';kind[y*W+x]=s.type;cells++}}
    s.cells=cells}
  // the start: a small hedge clearing round the foot
  for(let y=sy-2;y<=sy;y++)for(let x=sx-2;x<=sx+2;x++)if(x>1&&x<W-2&&y>1&&y<H-2){g[y][x]='.';if(!kind[y*W+x])kind[y*W+x]=1}
  const doorCh=String.fromCharCode(0x2f1);g[H-1][sx]=doorCh;
  // ---- the docks: two to a lake (a departure dock and a far dock), each a wooden tile in the ring of wall, with a corridor ending at it; the departure dock has a wide landing ----
  const chD=String.fromCharCode(0x360),DV=[[0,-1],[1,0],[0,1],[-1,0]],plazas=[],docksFlat=[];
  const bfs=(x0,y0)=>{const d=new Int32Array(W*H).fill(-1),q=[y0*W+x0];d[q[0]]=0;for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of DV){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.')continue;const n=ny*W+nx;if(d[n]>=0)continue;d[n]=d[c]+1;q.push(n)}}return d};
  const degAt=(x,y)=>DV.filter(([a,b])=>g[y+b]&&g[y+b][x+a]==='.').length;
  const dS=bfs(sx,sy-1),lrn=hgdmRng(475778);
  LAKES.forEach((k,li)=>{
    const cands=[];const add=(x,y,dx,dy)=>cands.push({x,y,dx,dy,ax:x-dx,ay:y-dy,wx:x+dx,wy:y+dy});
    for(let y=k.y0;y<=k.y1;y+=2){add(k.x0-1,y,1,0);add(k.x1+1,y,-1,0)}for(let x=k.x0;x<=k.x1;x+=2){add(x,k.y0-1,0,1);add(x,k.y1+1,0,-1)}
    const plazaOf=c=>{const cells=[],px=Math.abs(c.dy),py=Math.abs(c.dx);for(let u=1;u<=7;u++)for(let v=-1;v<=1;v++){const x=c.x-c.dx*u+px*v,y=c.y-c.dy*u+py*v;if(x<2||y<2||x>=W-2||y>=H-2||g[y][x]===PH||LAKES.some(q=>x>=q.x0-1&&x<=q.x1+1&&y>=q.y0-1&&y<=q.y1+1))return null;cells.push([x,y,u,v])}return cells};
    const ok=cands.filter(c=>g[c.ay]&&g[c.ay][c.ax]==='.'&&dS[c.ay*W+c.ax]>=30);
    const dep=ok.filter(c=>plazaOf(c)).sort((p,q)=>dS[p.ay*W+p.ax]-dS[q.ay*W+q.ax]);
    const A=dep[(lrn()*Math.max(1,Math.ceil(dep.length*.25)))|0];if(!A)return;
    const pz=plazaOf(A);for(const [x,y] of pz)g[y][x]='.';
    const dA=bfs(A.ax,A.ay);
    const sc=c=>dA[c.ay*W+c.ax]+(degAt(c.ax,c.ay)===1?80:0);
    const far=ok.filter(c=>dA[c.ay*W+c.ax]>=0&&Math.hypot(c.x-A.x,c.y-A.y)>6).sort((p,q)=>sc(q)-sc(p));
    const B=far[(lrn()*Math.min(3,far.length))|0];if(!B)return;
    for(const c of [A,B])g[c.y][c.x]=chD;
    for(const sg of [1,-1]){const nx=B.ax+sg*Math.abs(B.dy),ny=B.ay+sg*Math.abs(B.dx);if(nx>2&&ny>2&&nx<W-3&&ny<H-3&&g[ny][nx]==='#'&&!LAKES.some(q=>nx>=q.x0-1&&nx<=q.x1+1&&ny>=q.y0-1&&ny<=q.y1+1)){g[ny][nx]='.';B.nook=[nx,ny];break}}
    k.docks={dep:A,far:B};k.dist=dA[B.ay*W+B.ax];k.plaza=pz;plazas.push(pz);k.i=li;
    docksFlat.push(Object.assign({level:li+1,end:'in'},A),Object.assign({level:li+1,end:'out'},B));
    // a ragged shore: wall bumps along the edge, never beside a dock
    const near=(x,y)=>[[A.wx,A.wy],[B.wx,B.wy]].some(p=>Math.abs(p[0]-x)<=2&&Math.abs(p[1]-y)<=2);
    for(let y=k.y0;y<=k.y1;y++)for(let x=k.x0;x<=k.x1;x++){const e=Math.min(x-k.x0,k.x1-x,y-k.y0,k.y1-y);if(e>1||near(x,y))continue;if(lrn()<(e===0?.3:.09))g[y][x]='#'}
    // water cells that the shore bumps cut off become wall too
    const seenW=new Set([A.wx+','+A.wy]),qq=[[A.wx,A.wy]];for(let i=0;i<qq.length;i++){const [x,y]=qq[i];for(const [a,b] of DV){const nx=x+a,ny=y+b,kk=nx+','+ny;if(g[ny]&&g[ny][nx]===PH&&!seenW.has(kk)){seenW.add(kk);qq.push([nx,ny])}}}
    for(let y=k.y0;y<=k.y1;y++)for(let x=k.x0;x<=k.x1;x++)if(g[y][x]===PH&&!seenW.has(x+','+y))g[y][x]='#'});

  // ---- tiles ----
  const TM=ohTiles(),chars={};
  HGDM.biomes.forEach((b,i)=>{const sty='hgdm_'+b.k;OH_STY[sty]=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:b.wall,door:b.wall,win:b.wall,alt:b.wall,zoom:1,contrast:1.05,tint:[255,255,255,0]});
    chars[String.fromCharCode(0x2e0+i)]=TM.make('plain',sty,2.7).gid});
  const wch=i=>String.fromCharCode(0x2e0+i);
  if(LAKES.length)chars[chD]=hgdbDockGid(TM);
  const dgid=KH_NEXT_GID++;T_TILE[dgid]=wdExitTile(2.7,'cave',[200,160,255]);KH_DOOR[dgid]={lvl:HG.ID,at:{x:HG.START.x,y:HG.START.y,f:0}};chars[doorCh]=dgid;
  const rows=g.map((r,y)=>r.map((c,x)=>c==='#'?wch(bio[y*W+x]):c).join(''));
  // ---- floors: the floor of each place follows its biome; clearings and atriums are grass, rooms are stone; ponds in the atriums ----
  const fm=new Array(W*H).fill('0');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=kind[y*W+x];let f=HGDM.biomes[bio[y*W+x]].fl;if(k===1||k===3)f=0;else if(k===2)f=1;fm[y*W+x]=String(f)}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y][x]===PH)fm[y*W+x]='6';
  for(const pz of plazas)for(const [x,y] of pz)fm[y*W+x]='2';
  const decor=[],items=[],enemies=[],lights=[],used=new Set();
  for(const k of LAKES){lights.push([(k.x0+k.x1)>>1,(k.y0+k.y1)>>1]);if(k.docks)for(const c of [k.docks.dep,k.docks.far]){decor.push({k:'hgt_reeds',x:c.ax,y:c.ay,block:false,walk:true,deco:true,hgdl:1,sc:.9});used.add(c.ax+','+c.ay)}}
  const isF=(x,y)=>g[y]&&g[y][x]==='.'&&!used.has(x+','+y);
  const interior=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(!(g[y+dy]&&g[y+dy][x+dx]==='.'))return false;return true};
  const treeAt=new Set(),near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(treeAt.has((x+dx)+','+(y+dy)))return true;return false};
  const TREES=['hgt_fairytree','hgtb_plant_belltree'],PLANTS=['hgt_fern','hgtb_plant_spiralfern','hgt_bulbflower','hgt_reeds','hgt_pearlbush','hgt_shellflower','hgt_mushrooms','hgtb_plantbed'];
  for(const s of spots){
    lights.push([s.x,s.y]);
    if(s.type===2){ // a room: a pillar or two, a lamp
      if(s.r>=5)for(const [dx,dy] of [[-2,0],[2,0]])if(isF(s.x+dx,s.y+dy)&&interior(s.x+dx,s.y+dy)){decor.push({k:'hg_lamp',x:s.x+dx,y:s.y+dy,block:true});used.add((s.x+dx)+','+(s.y+dy))}
      continue}
    // ponds in the atriums (a floor of water, still walkable, with reeds at the edge)
    if(s.type===3&&!s.boss){const px=s.x+((rnd()*5-2)|0),py=s.y+((rnd()*5-2)|0),pr=2+((rnd()*2)|0);
      for(let y=py-pr;y<=py+pr;y++)for(let x=px-pr;x<=px+pr;x++)if(g[y]&&g[y][x]==='.'&&Math.hypot(x-px,y-py)<=pr+.3&&interior(x,y)){fm[y*W+x]='5'}}
    // trees and plants, only on squares with open ground on every side, never two trees touching
    const dens=s.type===3?.15:.1;
    for(let y=s.y-s.r;y<=s.y+s.r;y++)for(let x=s.x-s.r;x<=s.x+s.r;x++){
      if(!isF(x,y)||kind[y*W+x]!==s.type||!interior(x,y)||fm[y*W+x]==='5'||near(x,y)||Math.hypot(x-s.x,y-s.y)<1.5)continue;
      const r=rnd();if(r<dens){treeAt.add(x+','+y);used.add(x+','+y);decor.push({k:TREES[(rnd()*TREES.length)|0],x,y,block:true})}
      else if(r<dens+.12){used.add(x+','+y);decor.push({k:PLANTS[(rnd()*PLANTS.length)|0],x,y,block:false,walk:true,deco:true})}}
    if(s.type===3&&!s.boss&&isF(s.x,s.y)&&fm[s.y*W+s.x]!=='5'){used.add(s.x+','+s.y);decor.push({k:'hgtb_deco_fountain',x:s.x,y:s.y,block:true})}
  }
  // ---- creatures and finds, thinly, for this first stage ----
  const corr=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(g[y][x]==='.'&&Math.hypot(x-sx,y-sy)>24&&!used.has(x+','+y))corr.push([x,y]);
  const KB=[['hgdswarm','hgdgrub'],['hgdgrub','hgdguard'],['hgdguard','hgdgrub','hgdswarm'],['hgdguard','hgdgolem'],['hgdgolem','hgdguard'],['hgdgolem','hgdguard'],['hgdgolem','hgdguard'],['hgdgolem','hgdguard']];
  for(let k=0;k<160;k++){const c=corr[(rnd()*corr.length)|0];if(!c||used.has(c[0]+','+c[1]))continue;used.add(c[0]+','+c[1]);const b=bio[c[1]*W+c[0]],ks=KB[b];enemies.push({t:ks[(rnd()*ks.length)|0],x:c[0],y:c[1]})}
  for(let k=0;k<70;k++){const c=corr[(rnd()*corr.length)|0];if(!c||used.has(c[0]+','+c[1]))continue;used.add(c[0]+','+c[1]);items.push({k:['hgjelly','hgcomb','potion3','hggrubs'][k%4],x:c[0],y:c[1]})}
  // the far end: the warden in the great atrium at the top, with the plaque
  enemies.push({t:'hgdwarden',x:top.x,y:top.y+2});
  const kp=KH_KEEPERS.hgd_plaque;if(kp)decor.push({k:khFaceKey(kp.face),x:top.x,y:top.y-5,block:false,walk:true,npc:'hgd_plaque',sc:1});
  LEVELS[HGD.ID]={rows,start:{x:sx,y:sy-1,f:0},enemies,items,decor,chars,fmap:(()=>{const f=[];for(let y=0;y<H;y++)f.push(fm.slice(y*W,(y+1)*W).join(''));return f})(),
    day:0,amb:.35,floor:'dgrass',floor2:'cobble',floorSet:HGDM_FLOORS,name:'The Deeper Hollow',label:'The Deeper Hollow',diff:HGD.DIFF,ceilH:2.7,torchGap:1e9,noTele:true,portals:[],lights,
    _hgdm:{bio,kind,spots,W,H,sx,sy,lakes:LAKES},_hgdl:{lakes:LAKES,PH},_hgdb:{docks:docksFlat,lakes:LAKES.length},mapNames:[{t:'The Deeper Hollow',x:sx,y:H-2,k:'place'}]};
};
KH_LAZY[HGD.ID]=()=>{hgBuild();hgdBuild()};
