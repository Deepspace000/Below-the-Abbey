/* ==========================================================================
   THE WORLD MAP, redrawn as an illuminated manuscript chart. It replaces drawWorldMap() (index.html) and keeps all its behaviour: the drag, wheel and pinch zoom
   (G.wv), the buttons (wmap, wtp_*, worldback, ovexit, wzin, wzout, wreset), the teleport stones, quest dots and quest focus, the "you are here" mark and every label.
   Everything on the land is drawn live as vectors at the current zoom (so it stays sharp and gains detail as you zoom in); only the paper, the border and the title
   are cached. World coordinates: x about -90..1900, y about -350..600. Every name starts with mpWorld.
   ========================================================================== */
const mpWorldM={ready:false,zz:1,fontOK:false};
const mpWorldInk='#2a1a0c';
const mpWorldTints={sand:'#dcc088',red:'#cf8a60',blue:'#a4b8cc',white:'#efe9da',gold:'#e0b850',violet:'#a98cbb'};
const mpWorldSm=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
const mpWorldCxo=y=>714+10*Math.sin(y*.045)+6*Math.sin(y*.13+1)-8*mpWorldSm((y-190)/20);   // the west shore of the Narrow Sea
const mpWorldCxe=y=>1140+8*Math.sin(y*.04+2)+5*Math.sin(y*.11);                              // the east shore
const mpWorldNs=x=>-150-7*Math.sin(x*.05)-4*Math.sin(x*.17);                                  // the north shore, where the two lands join
const mpWorldLw=b=>Math.max(b,.8/mpWorldM.zz);                                                // ink never thins out when zoomed far out

/* a smooth line through points: midpoint quadratics (p is a Path2D or the context) */
function mpWorldSmoothPath(p,pts,closed){
  const n=pts.length;
  if(closed){const a=pts[n-1],b=pts[0];p.moveTo((a[0]+b[0])/2,(a[1]+b[1])/2);for(let i=0;i<n;i++){const q=pts[i],r=pts[(i+1)%n];p.quadraticCurveTo(q[0],q[1],(q[0]+r[0])/2,(q[1]+r[1])/2)}p.closePath()}
  else{p.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<n-1;i++){const q=pts[i],r=pts[i+1];p.quadraticCurveTo(q[0],q[1],(q[0]+r[0])/2,(q[1]+r[1])/2)}const l=pts[n-1];p.lineTo(l[0],l[1])}}
/* a Catmull-Rom curve that passes through every point, sampled */
function mpWorldCat(pts,st){
  const o=[];for(let i=0;i<pts.length-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
    for(let s=0;s<st;s++){const t=s/st,t2=t*t,t3=t2*t,f=(a,b,c,d)=>.5*(2*b+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3);o.push([f(p0[0],p1[0],p2[0],p3[0]),f(p0[1],p1[1],p2[1],p3[1])])}}
  o.push(pts[pts.length-1]);return o}
/* a wobbly route between waypoints: extra points sway a little sideways, then a smooth curve */
function mpWorldRoute(pts,seed,amp){
  const v=[pts[0]];for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),n=Math.max(1,Math.round(L/22));
    for(let k=1;k<=n;k++){const t=k/n,w=k<n?(hash2(i*31+k,seed,77)-.5)*2*(amp||3.5):0;v.push([a[0]+dx*t-dy/L*w,a[1]+dy*t+dx/L*w])}}
  return mpWorldCat(v,7)}

/* ---------- build everything that does not change: coasts, land mask, roads, rivers, scenery ---------- */
function mpWorldInit(){
  const M=mpWorldM,H=hash2,by={};WORLD_LOCS.forEach(l=>by[l.k]=l);M.by=by;
  // the land: one big polygon (the western land, the northern land that joins it to the Eastern Lands). The sea is everything else.
  const west=y=>-1060+9*Math.sin(y*.03)+6*Math.sin(y*.09+2)+4*Math.sin(y*.21),south=x=>352+9*Math.sin(x*.04)+5*Math.sin(x*.13)+3*Math.sin(x*.29);
  const P=[[-1500,-900]],C=[];let n=0;const jt=()=>(H(n++,3,41)-.5)*1.7,add=(x,y)=>{const q=[x+jt(),y+jt()];P.push(q);C.push(q)};
  for(let y=-700;y<=352;y+=7)add(west(y),y);
  for(let x=-1060;x<=700;x+=9)add(x,south(x));
  for(let y=352;y>=-150;y-=6)add(mpWorldCxo(y),y);
  for(let x=mpWorldCxo(-150)+8;x<mpWorldCxe(-150);x+=8)add(x,mpWorldNs(x));
  for(let y=-150;y<=640;y+=6)add(mpWorldCxe(y),y);
  P.push([1900,640],[1900,-900]);
  M.landP=new Path2D();mpWorldSmoothPath(M.landP,P,true);
  M.waterP=new Path2D();M.waterP.rect(-1700,-1000,3900,1800);M.waterP.addPath(M.landP);
  // a coarse picture of the land (5 world units a pixel), to ask "is this land?" without any geometry
  {const mk=document.createElement('canvas');mk.width=640;mk.height=260;const mc=mk.getContext('2d',{willReadFrequently:true});mc.fillStyle='#000';mc.fillRect(0,0,480,260);mc.scale(.2,.2);mc.translate(1100,500);mc.fillStyle='#fff';mc.fill(M.landP);
    M.mask=mc.getImageData(0,0,640,260).data;}
  M.isLand=(x,y)=>{const a=((x+1100)/5)|0,b=((y+500)/5)|0;if(a<0||b<0||a>=640||b>=260)return false;return M.mask[(b*640+a)*4]>128};
  // coast hatching: short strokes standing out into the water
  M.hatch=[];
  for(let i=1;i<C.length-1;i++){const a=C[i-1],b=C[i+1],tx=b[0]-a[0],ty=b[1]-a[1],L=Math.hypot(tx,ty)||1;let nx=-ty/L,ny=tx/L;if(M.isLand(C[i][0]+nx*5,C[i][1]+ny*5)){nx=-nx;ny=-ny}
    if(C[i][1]<-420||C[i][0]<-480)continue;M.hatch.push([C[i][0],C[i][1],nx,ny,H(i,1,43),H(i,2,43)])}
  // islands in the sea (the old map's list), the four named ones enlarged to carry their pictures
  const ISL=[[772,70,24],[834,112,21],[774,154,20],[850,196,26],[744,14,6],[802,22,7],[902,60,9],[892,152,8],[744,230,10],[822,254,12],[914,232,9],[782,298,8],[872,302,11],[742,112,5],[928,120,7],[958,40,6],[942,182,6],[762,342,9],[842,362,8],[902,362,10],[732,192,4],[966,270,8],[958,110,5],[690,180,3],[200,420,9],[330,450,7],[460,410,10],[560,440,6]];
  M.isl=ISL.map(([ix,iy,ir],q)=>{const pts=[],m=22;for(let k=0;k<m;k++){const a=k/m*TAU,rr=ir*(.74+.46*H(ix+k,iy,19)),pr=1.18+.06*Math.sin(a*3+q);pts.push([ix+Math.cos(a)*rr*pr,iy+Math.sin(a)*rr*.86])}
    const p=new Path2D();mpWorldSmoothPath(p,pts,true);return {x:ix,y:iy,r:ir,pts,p,named:ir>=20}});
  // rivers and lakes
  const RV=[[[-540,-130],[-585,-60],[-545,20],[-600,100],[-560,170],[-610,250],[-570,330]],[[-270,-120],[-300,-30],[-350,30],[-330,100],[-380,170],[-340,260],[-360,330]],[[352,12],[320,26],[270,34],[220,50],[180,64],[150,88],[120,108],[96,130],[60,150],[20,158],[-30,166],[-96,170]],
    [[372,150],[366,190],[354,230],[336,265],[338,300],[346,330],[350,372]],
    [[500,62],[525,84],[548,100],[575,102],[610,100],[650,104],[690,106],[716,112]],
    [[1420,30],[1370,70],[1320,110],[1270,120],[1215,125],[1170,112],[1138,104]]];
  M.rv=RV.map((r,i)=>mpWorldCat(r,6));
  M.lakes=[[-480,60,26,14],[-700,210,30,16],[-310,200,18,10],[140,128,15,8],[610,10,12,7],[1292,262,14,8],[26,60,12,7]];
  // roads: the old road list, as inked ribbons; a ferry across the sea; the pilgrim's way round the north; the road east
  const rd=[];let sd=1;
  const road=(keys,style)=>{const pts=keys.map(k=>[by[k].x,by[k].y]);rd.push({pts:mpWorldRoute(pts,sd++,style==='track'?2.5:3.5),style})};
  for(const r of WORLD_ROADS){if(r[0]==='oldhaven'&&r[1]==='yarrim')continue;road(r,(r[0]==='abbey'&&r[1]==='below')||(r[0]==='below')?'track':'road')}
  rd.push({pts:mpWorldRoute([[402,238],[450,232],[486,220],[484,158],[486,96],[480,58]],91,3),style:'road'});
  const O=by.oldhaven,Y=by.yarrim,MO=by.monastery;
  rd.push({pts:mpWorldRoute([[O.x,O.y-14],[1160,110],[mpWorldCxe(40)+14,40],[mpWorldCxe(-40)+14,-40],[1132,-110],[1090,-160],[1030,-190],[982,-194],[MO.x+8,MO.y+2],[870,-182],[800,-176],[mpWorldCxo(-150)-14,-158],[mpWorldCxo(-90)-16,-90],[mpWorldCxo(-30)-16,-30],[mpWorldCxo(20)-16,20],[Y.x+10,Y.y-10]],95,3),style:'pilgrim'});
  M.rd=rd;
  M.ferry=mpWorldRoute([[O.x-10,O.y],[1030,150],[900,128],[790,96],[Y.x+14,Y.y+6]],97,2);
  // things that scenery keeps clear of
  const av=new Map(),ap=(x,y)=>{const k=Math.floor(x/10)*10007+Math.floor(y/10);let l=av.get(k);if(!l)av.set(k,l=[]);l.push([x,y])};
  const dense=(pts)=>{for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),m=Math.max(1,Math.ceil(L/3));for(let k=0;k<m;k++)ap(a[0]+(b[0]-a[0])*k/m,a[1]+(b[1]-a[1])*k/m)}};
  rd.forEach(r=>dense(r.pts));M.rv.forEach(dense);
  const nearLine=(x,y,d)=>{const gx=Math.floor(x/10),gy=Math.floor(y/10),m=Math.ceil(d/10);for(let a=-m;a<=m;a++)for(let b=-m;b<=m;b++){const l=av.get((gx+a)*10007+gy+b);if(l)for(const q of l){if(Math.hypot(q[0]-x,q[1]-y)<d)return true}}return false};
  const regionLab=[[-330,120,80,14],[-760,100,80,14],[-560,250,70,14],[210,16,64,12],[652,16,70,12],[476,-10,80,14],[-6,208,56,13],[1230,18,70,12],[930,-138,130,7],[530,264,50,5]];
  const blocked=(x,y,d)=>{
    for(const l of WORLD_LOCS){const big=l.ic==='town'||l.ic==='castle'||l.ic==='abbey'||l.ic==='orangecastle',area=l.ic==='trees'||l.ic==='rain'||l.ic==='moor'||l.ic==='dunes';
      const lw2=l.n.length*2.7+6,dn=l.sub?44:34;
      if(Math.abs(x-l.x)<lw2&&y>l.y+10&&y<l.y+dn)return true;
      if(!area){const hx=big?24:20,up=l.ic==='castle'||l.ic==='orangecastle'?36:big?26:20;if(Math.abs(x-l.x)<hx&&y>l.y-up&&y<l.y+12)return true}
      else if(Math.abs(x-l.x)<8&&Math.abs(y-l.y)<8)return true}
    for(const r of regionLab)if(Math.abs(x-r[0])<r[2]&&Math.abs(y-r[1])<r[3])return true;
    for(const k of M.lakes)if(((x-k[0])/(k[2]+3))**2+((y-k[1])/(k[3]+3))**2<1)return true;
    return nearLine(x,y,d)};
  // a minimum-spacing grid so scenery never piles up
  const occ=new Map(),put=(x,y,sp)=>{const gx=Math.floor(x/5),gy=Math.floor(y/5),m=Math.ceil(sp/5);for(let a=-m;a<=m;a++)for(let b=-m;b<=m;b++){const l=occ.get((gx+a)*10007+gy+b);if(l)for(const q of l)if(Math.hypot(q[0]-x,q[1]-y)<(sp+q[2])/2)return false}
    const k=gx*10007+gy;let l=occ.get(k);if(!l)occ.set(k,l=[]);l.push([x,y,sp]);return true};
  const IT=[],TUF=[],PEB=[],HEA=[];let seed=100;
  const inIsl=(x,y)=>M.isl.some(q=>((x-q.x)/(q.r*1.1))**2+((y-q.y)/(q.r*.8))**2<1);
  // mountain chains
  const chains=[[[[412,-170],[410,-100],[404,-40],[400,10],[398,60],[394,100],[388,118]],8,9,1.25],[[[386,154],[372,186],[358,226],[352,270],[358,312]],8,8,1.15],
    [[[236,50],[270,46],[310,50],[348,62]],8,8,1.1],[[[-80,-250],[40,-280],[170,-255],[300,-285],[430,-255],[560,-275],[700,-240]],9,16,1.1],
    [[[760,-236],[860,-256],[960,-246],[1060,-258],[1130,-236]],9,12,1.1],[[[872,-214],[930,-218],[990,-212]],7,7,1.35],[[[1400,-120],[1392,-20],[1408,90],[1385,200],[1400,320],[1420,440]],9,10,1.2],
    [[[430,-24],[470,-62],[520,-72],[580,-52]],9,9,1],[[[180,-120],[260,-150],[340,-130]],9,9,1],[[[-30,-90],[40,-120],[100,-100]],9,8,1],[[[-170,-120],[-270,-150],[-390,-120],[-510,-160],[-640,-130]],9,10,1.15],[[[-640,30],[-720,0],[-800,40],[-900,0],[-980,30]],9,10,1.2],[[[-340,330],[-460,320],[-580,336]],9,8,1.05]];
  for(const [pts,sp,wd,sz] of chains){const L=mpWorldCat(pts,10);let acc=0,j=0;for(let i=1;i<L.length;i++){acc+=Math.hypot(L[i][0]-L[i-1][0],L[i][1]-L[i-1][1]);if(acc<sp)continue;acc=0;
      for(const back of [0,1]){const x=L[i][0]+(H(j,1,seed)-.5)*wd*(back?1.8:1),y=L[i][1]+(H(j,2,seed)-.5)*wd*.9+(back?-5:0);j++;
        if(!M.isLand(x,y)||blocked(x,y,10)||!put(x,y,sp*.9))continue;IT.push([2,x,y,sz*(back?.78:1)*(.85+H(j,3,seed)*.4),(H(j,4,seed)*100)|0])}}seed++}
  // forests: [cx,cy,rx,ry,count,pine share,size]
  const FOR=[[116,222,50,34,170,.5,1],[212,230,46,30,140,.4,1],[60,150,42,30,90,.6,1],[150,300,56,24,100,.5,1],[300,300,46,24,80,.5,1],[350,48,40,26,60,.8,1],[120,70,50,28,80,.6,1],[410,300,50,22,60,.5,1],[420,186,32,28,80,.3,1.1],
    [176,166,34,20,70,.7,1],[-6,288,64,34,100,.9,1],[1244,190,56,40,150,0,1.3],[1380,90,70,50,130,.2,1.2],[1420,300,70,50,130,.1,1.2],[1260,380,60,40,100,.2,1.2],[1180,300,50,40,80,.3,1.1],[1320,520,90,50,140,.3,1.1],[1500,200,60,50,90,.3,1.1],[1480,420,70,50,100,.2,1.2],
    [1040,-240,80,30,110,1,1],[820,-245,80,30,110,1,1],[930,-262,60,24,70,1,1],[600,-290,120,30,150,1,1],[200,-285,150,30,150,1,1],[-30,-262,100,40,120,1,1],[1165,50,22,44,70,.5,1.1],[1165,-92,22,38,60,.7,1],[100,-60,70,40,90,.6,1],[420,-82,60,50,100,.6,1],[560,-170,70,36,90,.7,1],[270,-60,70,30,70,.6,1],[1100,-300,60,30,70,1,1]];
  for(const [cx,cy,rx,ry,cnt,pine,sz] of FOR.concat([[-250,60,110,60,75,.5,1],[-420,120,120,70,85,.6,1],[-620,40,130,70,80,.4,1],[-780,170,130,80,85,.7,1],[-330,270,110,30,45,.5,1],[-900,60,110,70,70,.6,1],[-560,-120,150,50,65,.8,1],[-840,-100,120,50,55,.9,1],[-180,150,50,40,35,.5,1]])){seed++;for(let i=0;i<cnt*2;i++){const a=H(i,1,seed)*TAU,r=Math.sqrt(H(i,2,seed)),x=cx+Math.cos(a)*r*rx,y=cy+Math.sin(a)*r*ry;
      if(!M.isLand(x,y)||blocked(x,y,5.5)||!put(x,y,5.4*sz))continue;const isP=H(i,3,seed)<pine;IT.push([isP?1:0,x,y,(.85+H(i,4,seed)*.35)*sz,(H(i,5,seed)*100)|0])}}
  // palms by the golden city, lone palms on isles
  for(const [cx,cy,rx,ry,cnt] of [[480,34,56,28,14],[640,100,30,10,4]]){seed++;for(let i=0;i<cnt*3;i++){const x=cx+(H(i,1,seed)-.5)*2*rx,y=cy+(H(i,2,seed)-.5)*2*ry;if(!M.isLand(x,y)||blocked(x,y,6)||!put(x,y,9))continue;IT.push([5,x,y,.95+H(i,3,seed)*.3,(H(i,4,seed)*100)|0])}}
  for(const q of M.isl){if(q.r<6)continue;seed++;const cnt=q.named?26:Math.round(q.r*.6);for(let i=0;i<cnt*3;i++){const a=H(i,1,seed)*TAU,r=Math.sqrt(H(i,2,seed))*.62,x=q.x+Math.cos(a)*r*q.r*1.15,y=q.y+Math.sin(a)*r*q.r*.8;if(blocked(x,y,0)||!put(x,y,6))continue;
        IT.push([q.r>=12&&H(i,3,seed)<.25?2:(H(i,4,seed)<.5?5:0),x,y,q.named?.8:.7,(H(i,5,seed)*100)|0])}}
  // deserts: [cx,cy,rx,ry,count,tint]
  const DR=[[486,215,34,34,22,'sand'],[486,96,30,40,28,'red'],[566,190,42,34,34,'blue'],[572,128,42,28,30,'white'],[652,160,52,48,50,'gold'],[652,230,52,44,46,'violet'],[590,262,110,34,40,'sand'],[520,-8,80,40,30,'sand'],[660,40,40,40,20,'sand']];
  for(const [cx,cy,rx,ry,cnt,tn] of DR){seed++;for(let i=0;i<cnt*3;i++){const a=H(i,1,seed)*TAU,r=Math.sqrt(H(i,2,seed)),x=cx+Math.cos(a)*r*rx,y=cy+Math.sin(a)*r*ry;
      if(!M.isLand(x,y)||blocked(x,y,6)||!put(x,y,11))continue;IT.push([4,x,y,.8+H(i,3,seed)*.7,(H(i,4,seed)*100)|0,mpWorldTints[tn]])}}
  // little hills among the grass
  for(const [cx,cy,rx,ry,cnt] of [[-400,150,300,100,70],[-760,150,260,110,60],[130,120,140,80,40],[330,230,70,60,20],[40,250,40,40,10],[250,300,120,30,16],[1350,200,200,260,60],[500,-130,260,50,30],[900,-300,200,40,20]]){seed++;for(let i=0;i<cnt*3;i++){const x=cx+(H(i,1,seed)-.5)*2*rx,y=cy+(H(i,2,seed)-.5)*2*ry;if(!M.isLand(x,y)||blocked(x,y,6)||!put(x,y,12))continue;IT.push([3,x,y,.8+H(i,3,seed)*.6,(H(i,4,seed)*100)|0])}}
  IT.sort((a,b)=>a[2]-b[2]);M.items=IT;
  // grass tufts, heather and pebbles are tiny and batched
  for(const [cx,cy,rx,ry,cnt] of [[-500,150,520,200,900],[150,180,260,170,900],[1350,200,260,300,800],[500,-250,500,80,400],[1000,-290,300,50,200],[-6,288,60,36,120]]){seed++;for(let i=0;i<cnt;i++){const x=cx+(H(i,1,seed)-.5)*2*rx,y=cy+(H(i,2,seed)-.5)*2*ry;if(!M.isLand(x,y)||(x>400&&x<720&&y>-90&&y<340)||nearLine(x,y,3)||blocked(x,y,0)||!put(x,y,4.4))continue;TUF.push([x,y,(H(i,3,seed)*100)|0])}}
  for(let i=0;i<60;i++){const a=H(i,1,501)*TAU,r=Math.sqrt(H(i,2,501)),x=324+Math.cos(a)*r*38,y=136+Math.sin(a)*r*24;if(M.isLand(x,y)&&!nearLine(x,y,3)&&!blocked(x,y,0))HEA.push([x,y,(H(i,3,501)*100)|0])}
  for(let i=0;i<340;i++){const a=H(i,1,502)*TAU,r=Math.sqrt(H(i,2,502)),x=566+Math.cos(a)*r*46,y=66+Math.sin(a)*r*32;if(M.isLand(x,y)&&!blocked(x,y,0))PEB.push([x,y,H(i,3,502)])}
  M.tuf=TUF;M.hea=HEA;M.peb=PEB;
  M.paper=mpWorldPaper();M.ready=true}

/* the paper: aged vellum with a little fibre, cached at 2x (one pixel to a screen pixel) */
function mpWorldPaper(){
  const c=document.createElement('canvas');c.width=DW*2;c.height=DH*2;const x=c.getContext('2d');x.scale(2,2);mplParchment(x,[2,2,-6]);
  x.save();x.globalAlpha=.1;x.strokeStyle='#6a4a28';x.lineWidth=.4;for(let i=0;i<420;i++){const a=hash2(i,1,77)*DW,b=hash2(i,2,77)*DH,l=3+hash2(i,3,77)*9,an=hash2(i,4,77)*TAU;x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.cos(an)*l,b+Math.sin(an)*l);x.stroke()}x.restore();return c}

/* the frame, vignette, title cartouche and compass: static, cached at 2x (one pixel to a screen pixel). Rebuilt once if the blackletter font finishes loading late. */
function mpWorldOverlay(){
  const c=document.createElement('canvas');c.width=DW*2;c.height=DH*2;const x=c.getContext('2d');x.scale(2,2);
  const X0=14,Y0=14,W=452,Hh=292,G1=MPL.GOLD,G2=MPL.GOLD2,Lp=MPL.LAPIS,Vm=MPL.VERM,I=mpWorldInk,ins=d=>[X0+d,Y0+d,W-2*d,Hh-2*d];
  x.save();rrect(x,X0,Y0,W,Hh,6);x.clip();const vg=x.createRadialGradient(240,160,100,240,160,310);vg.addColorStop(0,'rgba(80,50,20,0)');vg.addColorStop(1,'rgba(80,50,20,.36)');x.fillStyle=vg;x.fillRect(0,0,DW,DH);
  x.beginPath();x.rect(X0,Y0,W,Hh);const q=ins(9.4);x.rect(q[0],q[1],q[2],q[3]);x.fillStyle='#d6c08a';x.fill('evenodd');x.restore();
  x.save();x.lineJoin='miter';
  x.strokeStyle=I;x.lineWidth=1.1;x.strokeRect(...ins(-.5));x.strokeStyle=G1;x.lineWidth=2.4;x.strokeRect(...ins(1.6));x.strokeStyle=Lp;x.lineWidth=4.4;x.strokeRect(...ins(5.4));x.strokeStyle=G1;x.lineWidth=1;x.strokeRect(...ins(8.4));x.strokeStyle=I;x.lineWidth=.6;x.strokeRect(...ins(9.5));
  // studs and little lozenges along the lapis band
  const stud=(a,b,k)=>{x.fillStyle=k%2?G2:'#f4ead0';x.beginPath();x.arc(a,b,k%2?1:.7,0,TAU);x.fill()};
  for(let a=X0+24,k=0;a<X0+W-20;a+=6.5,k++){stud(a,Y0+5.4,k);stud(a,Y0+Hh-5.4,k)}for(let b=Y0+24,k=0;b<Y0+Hh-20;b+=6.5,k++){stud(X0+5.4,b,k);stud(X0+W-5.4,b,k)}
  for(const [a,b] of [[X0+W/2,Y0+5.4],[X0+W/2,Y0+Hh-5.4],[X0+5.4,Y0+Hh/2],[X0+W-5.4,Y0+Hh/2]]){x.fillStyle=Vm;x.strokeStyle=G1;x.lineWidth=.9;x.beginPath();x.moveTo(a-6,b);x.lineTo(a,b-3.6);x.lineTo(a+6,b);x.lineTo(a,b+3.6);x.closePath();x.fill();x.stroke();x.fillStyle=G2;x.beginPath();x.arc(a,b,1.2,0,TAU);x.fill()}
  // corner medallions
  for(const [cx,cy] of [[X0+5.4,Y0+5.4],[X0+W-5.4,Y0+5.4],[X0+5.4,Y0+Hh-5.4],[X0+W-5.4,Y0+Hh-5.4]]){
    x.fillStyle=G1;x.strokeStyle=I;x.lineWidth=.9;x.beginPath();x.arc(cx,cy,11.5,0,TAU);x.fill();x.stroke();
    for(let k=0;k<12;k++){const an=k/12*TAU;x.fillStyle=k%2?G2:Vm;x.beginPath();x.arc(cx+Math.cos(an)*9,cy+Math.sin(an)*9,1.2,0,TAU);x.fill()}
    x.fillStyle=Vm;x.beginPath();x.arc(cx,cy,7,0,TAU);x.fill();x.stroke();x.fillStyle=Lp;x.beginPath();x.arc(cx,cy,4.6,0,TAU);x.fill();x.strokeStyle=G2;x.lineWidth=.6;x.stroke();
    x.fillStyle=G2;for(let k=0;k<4;k++){const an=k*Math.PI/2+Math.PI/4;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(an-.3)*4,cy+Math.sin(an-.3)*4);x.lineTo(cx+Math.cos(an+.3)*4,cy+Math.sin(an+.3)*4);x.closePath();x.fill()}x.beginPath();x.arc(cx,cy,1,0,TAU);x.fillStyle='#f4ead0';x.fill()}
  x.restore();
  // the title cartouche: a ribbon with folded tails, an illuminated T and the name in blackletter
  x.save();const rx0=142,rx1=338,ry0=21,ry1=51;
  x.fillStyle='#b89a5a';x.strokeStyle=I;x.lineWidth=.8;for(const s of [-1,1]){const e=s<0?rx0:rx1;x.beginPath();x.moveTo(e,ry0+5);x.lineTo(e+s*13,ry0+5);x.lineTo(e+s*8,(ry0+ry1)/2+2.5);x.lineTo(e+s*13,ry1+1);x.lineTo(e,ry1+1);x.closePath();x.fill();x.stroke()}
  x.fillStyle='rgba(240,230,196,.97)';x.fillRect(rx0,ry0,rx1-rx0,ry1-ry0);x.strokeStyle=G1;x.lineWidth=1.6;x.strokeRect(rx0,ry0,rx1-rx0,ry1-ry0);x.strokeStyle=I;x.lineWidth=.5;x.strokeRect(rx0+2,ry0+2,rx1-rx0-4,ry1-ry0-4);
  const ax=rx0+6,ay=ry0+4;x.fillStyle=Lp;x.fillRect(ax,ay,22,22);x.strokeStyle=G1;x.lineWidth=1.4;x.strokeRect(ax,ay,22,22);x.strokeStyle=Vm;x.lineWidth=.7;x.strokeRect(ax+2.5,ay+2.5,17,17);
  x.fillStyle=G2;x.font=`21px ${FTITLE}`;x.textAlign='center';x.textBaseline='middle';x.fillText('T',ax+11,ay+12);x.fillStyle=G1;for(const [a,b] of [[3,3],[19,3],[3,19],[19,19]]){x.beginPath();x.arc(ax+a,ay+b,1,0,TAU);x.fill()}
  x.fillStyle=I;x.font=`18px ${FTITLE}`;x.textAlign='left';x.fillText('he Far Lands',ax+27,ay+10.5);x.font=`italic 7px ${FUI}`;x.fillStyle='#5a3a1c';x.fillText('a chart of the known and the unknown lands',ax+27,ay+22);
  x.fillStyle=Vm;x.strokeStyle=G1;x.lineWidth=.7;x.beginPath();x.moveTo(rx1-14,(ry0+ry1)/2);x.lineTo(rx1-9,(ry0+ry1)/2-4);x.lineTo(rx1-4,(ry0+ry1)/2);x.lineTo(rx1-9,(ry0+ry1)/2+4);x.closePath();x.fill();x.stroke();x.restore();
  // the compass rose, top left
  {const cx=56,cy=66,r=17;x.save();x.translate(cx,cy);x.fillStyle='rgba(240,230,196,.88)';x.strokeStyle=I;x.lineWidth=.9;x.beginPath();x.arc(0,0,r+3,0,TAU);x.fill();x.stroke();x.strokeStyle=G1;x.lineWidth=1.4;x.beginPath();x.arc(0,0,r+1.5,0,TAU);x.stroke();x.lineWidth=.5;x.strokeStyle=I;x.beginPath();x.arc(0,0,r*.7,0,TAU);x.stroke();
    for(let k=0;k<32;k++){const an=k/32*TAU,l=k%4?1.6:3;x.beginPath();x.moveTo(Math.cos(an)*(r+1),Math.sin(an)*(r+1));x.lineTo(Math.cos(an)*(r+1-l),Math.sin(an)*(r+1-l));x.stroke()}
    x.save();x.rotate(Math.PI/4);x.fillStyle=G1;for(let k=0;k<4;k++){x.rotate(Math.PI/2);x.beginPath();x.moveTo(0,-r*.82);x.lineTo(r*.12,0);x.lineTo(-r*.12,0);x.closePath();x.fill();x.stroke()}x.restore();
    for(let k=0;k<4;k++){x.save();x.rotate(k*Math.PI/2);x.fillStyle=k===0?Vm:Lp;x.beginPath();x.moveTo(0,-r*1.2);x.lineTo(r*.2,0);x.lineTo(-r*.2,0);x.closePath();x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.3)';x.beginPath();x.moveTo(0,-r*1.2);x.lineTo(-r*.2,0);x.lineTo(0,0);x.closePath();x.fill();x.restore()}
    x.fillStyle=G2;x.beginPath();x.arc(0,0,2.2,0,TAU);x.fill();x.stroke();x.restore();
    for(const [t,a,b] of [['N',0,-r-10],['E',r+9,0],['S',0,r+9],['W',-r-9,0]]){x.save();x.font=`bold 8px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.lineWidth=2.6;x.lineJoin='round';x.strokeStyle='rgba(238,226,190,.9)';x.strokeText(t,cx+a,cy+b);x.fillStyle=t==='N'?Vm:I;x.fillText(t,cx+a,cy+b);x.restore()}}
  return c}

/* ---------- small pen-and-ink pieces ---------- */
function mpWorldHouse(x,by,s,roof,o){
  const c=ctx;o=o||{};c.fillStyle=o.wall||'#eadfc2';c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.8);
  c.fillRect(x-4.5*s,by-6*s,9*s,6*s);c.strokeRect(x-4.5*s,by-6*s,9*s,6*s);
  c.fillStyle=roof;c.beginPath();c.moveTo(x-6*s,by-6*s);c.lineTo(x,by-12*s);c.lineTo(x+6*s,by-6*s);c.closePath();c.fill();c.stroke();
  c.fillStyle='rgba(30,16,10,.28)';c.beginPath();c.moveTo(x,by-12*s);c.lineTo(x+6*s,by-6*s);c.lineTo(x,by-6*s);c.closePath();c.fill();
  c.fillStyle='#5a3a1c';c.fillRect(x-1*s,by-3*s,2*s,3*s);
  if(o.d1){c.fillStyle='#f0d878';c.fillRect(x+2*s,by-4.8*s,1.7*s,1.7*s);c.strokeRect(x+2*s,by-4.8*s,1.7*s,1.7*s);c.fillRect(x-3.8*s,by-4.8*s,1.7*s,1.7*s);c.strokeRect(x-3.8*s,by-4.8*s,1.7*s,1.7*s)}
  if(o.d2){c.strokeStyle='rgba(30,16,10,.4)';c.lineWidth=.35;for(let k=1;k<4;k++){const hw=(6-1.5*k)*s,yy=by-6*s-k*1.5*s;c.beginPath();c.moveTo(x-hw,yy);c.lineTo(x+hw,yy);c.stroke()}
    c.fillStyle='#b8a888';c.strokeStyle=mpWorldInk;c.lineWidth=.5;c.fillRect(x-3.6*s,by-11*s,1.6*s,3*s);c.strokeRect(x-3.6*s,by-11*s,1.6*s,3*s)}
  if(o.d3){c.strokeStyle='rgba(90,58,28,.7)';c.lineWidth=.35;c.beginPath();c.moveTo(x-4.5*s,by-3*s);c.lineTo(x+4.5*s,by-3*s);c.moveTo(x,by-6*s);c.lineTo(x,by-3*s);c.stroke()}}
function mpWorldTower(x,by,w,h,o){
  const c=ctx;o=o||{};c.fillStyle=o.col||'#cfc6ae';c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.8);c.fillRect(x-w/2,by-h,w,h);c.strokeRect(x-w/2,by-h,w,h);
  c.fillStyle='rgba(30,16,10,.22)';c.fillRect(x,by-h,w/2,h);
  if(o.roof){c.fillStyle=o.roof;c.beginPath();c.moveTo(x-w/2-.8,by-h);c.lineTo(x,by-h-w*.95);c.lineTo(x+w/2+.8,by-h);c.closePath();c.fill();c.stroke()}
  else{c.fillStyle=o.col||'#cfc6ae';const m=Math.max(2,Math.round(w/2.4)),mw=w/(m*2-1);for(let k=0;k<m;k++){c.fillRect(x-w/2+k*2*mw,by-h-mw*1.1,mw,mw*1.1);c.strokeRect(x-w/2+k*2*mw,by-h-mw*1.1,mw,mw*1.1)}}
  c.fillStyle='#3a2a1c';c.fillRect(x-.5,by-h*.62,1,h*.28);
  if(o.d2){c.strokeStyle='rgba(30,16,10,.35)';c.lineWidth=.3;for(let k=1;k<4;k++){c.beginPath();c.moveTo(x-w/2,by-h*k/4);c.lineTo(x+w/2,by-h*k/4);c.stroke()}}}
function mpWorldFlag(x,y,col,t){const c=ctx;c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.7);c.beginPath();c.moveTo(x,y);c.lineTo(x,y-10);c.stroke();const w=Math.sin(t*3+x)*1.2;c.fillStyle=col;c.beginPath();c.moveTo(x,y-10);c.quadraticCurveTo(x+4,y-11.5+w,x+8,y-9.5+w);c.quadraticCurveTo(x+4,y-8.5+w,x,y-7);c.closePath();c.fill();c.stroke()}
function mpWorldCastle(x,y,z,o){
  const c=ctx,d1=z>1.5,d2=z>2.8,d3=z>4.2;o=o||{};const wall=o.wall||'#d8cfb8',roof=o.roof||MPL.VERM,t=G.time;
  c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.9);
  c.fillStyle='rgba(60,40,20,.2)';c.beginPath();c.ellipse(x,y+9,22,3.4,0,0,TAU);c.fill();
  mpWorldTower(x-5,y-4,12,15,{col:wall,roof,d2});mpWorldTower(x+5,y-4,12,15,{col:wall,roof,d2});
  c.fillStyle=wall;c.fillRect(x-14,y-4,28,13);c.strokeRect(x-14,y-4,28,13);
  for(let k=0;k<7;k++){c.fillRect(x-14+k*4.2,y-6,2.2,2.4);c.strokeRect(x-14+k*4.2,y-6,2.2,2.4)}
  c.fillStyle='rgba(30,16,10,.2)';c.fillRect(x,y-4,14,13);
  for(const dx of [-17,17]){mpWorldTower(x+dx,y+9,8,21,{col:wall,roof:o.roof2||MPL.LAPIS,d2});}
  c.fillStyle='#2a1a0c';c.beginPath();c.moveTo(x-3.2,y+9);c.lineTo(x-3.2,y+3);c.quadraticCurveTo(x,y-1,x+3.2,y+3);c.lineTo(x+3.2,y+9);c.closePath();c.fill();
  if(d1){c.fillStyle='#f0d878';for(const dx of [-9,9]){c.fillRect(x+dx-.8,y-1,1.6,3.2)}c.fillStyle='#2a1a0c';for(const dx of [-17,17])c.fillRect(x+dx-.5,y-3,1,4)}
  if(d2){c.strokeStyle='rgba(30,16,10,.35)';c.lineWidth=.3;for(let k=1;k<3;k++){c.beginPath();c.moveTo(x-14,y-4+k*4.3);c.lineTo(x+14,y-4+k*4.3);c.stroke()}}
  if(d3){c.strokeStyle='rgba(30,16,10,.6)';c.lineWidth=.35;for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(x+k*1.3,y+3.6);c.lineTo(x+k*1.3,y+9);c.stroke()}}
  mpWorldFlag(x,y-17,o.flag||MPL.VERM,t);for(const dx of [-17,17])if(d1)mpWorldFlag(x+dx,y-12-8,o.flag||MPL.VERM,t+1)}
function mpWorldTree(c,x,y,s,sd,z){
  c.fillStyle='#5a3a1c';c.fillRect(x-.6*s,y-2.2*s,1.2*s,3*s);c.fillStyle=['#5f8a4a','#4f7a44','#6f9552','#58803e'][sd&3];c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.55);
  c.beginPath();c.arc(x,y-5.4*s,3.4*s,0,TAU);c.moveTo(x-.4*s,y-3.6*s);c.arc(x-2.1*s,y-3.6*s,2.3*s,0,TAU);c.moveTo(x+4.4*s,y-3.6*s);c.arc(x+2.1*s,y-3.6*s,2.3*s,0,TAU);c.fill();c.stroke();
  if(z>1.7){c.fillStyle='rgba(255,255,200,.28)';c.beginPath();c.arc(x-1*s,y-6.4*s,1.7*s,0,TAU);c.fill();c.strokeStyle='rgba(30,50,20,.5)';c.lineWidth=.3;c.beginPath();c.arc(x+1*s,y-4.2*s,1.3*s,.2,2.4);c.moveTo(x-2*s,y-3*s);c.arc(x-1.7*s,y-3*s,.7*s,.3,2.8);c.stroke()}
  if(z>3.2){c.fillStyle='rgba(40,70,30,.45)';for(let k=0;k<7;k++){c.fillRect(x+(((sd*7+k*13)%9)-4.5)*.6*s,y-6.5*s+((sd*3+k*5)%7)*.7*s,.5*s,.5*s)}}}
function mpWorldPine(c,x,y,s,sd,z){
  c.fillStyle='#5a3a1c';c.fillRect(x-.5*s,y,1*s,1.8*s);c.fillStyle=['#3d6a46','#35603e','#46744c'][sd%3];c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.55);
  c.beginPath();for(let k=0;k<3;k++){c.moveTo(x-(4.2-k*.9)*s,y-k*3.2*s);c.lineTo(x,y-(k*3.2+5)*s);c.lineTo(x+(4.2-k*.9)*s,y-k*3.2*s);c.closePath()}c.fill();c.stroke();
  if(z>1.7){c.fillStyle='rgba(20,40,24,.3)';c.beginPath();for(let k=0;k<3;k++){c.moveTo(x,y-(k*3.2+5)*s);c.lineTo(x+(4.2-k*.9)*s,y-k*3.2*s);c.lineTo(x,y-k*3.2*s)}c.fill()}}
function mpWorldMountain(c,x,y,s,sd,z){
  const w=9*s,hg=(12+(sd%5))*s,px=x+((sd%7)-3)*.4*s;
  c.fillStyle='#b9ae96';c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.75);
  c.beginPath();c.moveTo(x-w,y);c.lineTo(x-w*.45,y-hg*.55);c.lineTo(px-1.2*s,y-hg*.82);c.lineTo(px,y-hg);c.lineTo(px+w*.3,y-hg*.62);c.lineTo(x+w*.55,y-hg*.42);c.lineTo(x+w,y);c.closePath();c.fill();c.stroke();
  c.fillStyle='rgba(60,44,28,.34)';c.beginPath();c.moveTo(px,y-hg);c.lineTo(px+w*.3,y-hg*.62);c.lineTo(x+w*.55,y-hg*.42);c.lineTo(x+w,y);c.lineTo(px+w*.1,y);c.lineTo(px+w*.04,y-hg*.5);c.closePath();c.fill();
  if(hg>=13*s){c.fillStyle='#f6f1e4';c.beginPath();c.moveTo(px,y-hg);c.lineTo(px-w*.28,y-hg*.68);c.lineTo(px-w*.1,y-hg*.73);c.lineTo(px+w*.02,y-hg*.62);c.lineTo(px+w*.14,y-hg*.7);c.lineTo(px+w*.3,y-hg*.62);c.closePath();c.fill();c.stroke()}
  c.strokeStyle='rgba(42,26,12,.55)';c.lineWidth=.45;c.beginPath();const nh=z<.8?3:z<2?5:9;for(let k=0;k<nh;k++){const f=(k+1)/(nh+1)*.92,ax=px+(x+w-px)*f,ay=y-hg+hg*f,bx=ax-w*.26*(1-f*.3),by2=Math.min(y,ay+hg*.22);c.moveTo(ax,ay);c.lineTo(bx,by2)}
  if(z>2.4){for(let k=0;k<4;k++){const f=(k+1)/5;c.moveTo(px-(w*.9)*f*.8,y-hg*(1-f*.55));c.lineTo(px-(w*.9)*f*.8-w*.1,y-hg*(1-f*.55)+hg*.16)}}c.stroke()}
function mpWorldDune(c,x,y,s,sd,z,col){
  c.fillStyle=col||'#dcc088';c.strokeStyle='rgba(60,36,14,.65)';c.lineWidth=mpWorldLw(.6);
  c.beginPath();c.moveTo(x-10*s,y);c.bezierCurveTo(x-6*s,y-6*s,x-3*s,y-9*s,x,y-8*s);c.bezierCurveTo(x+4*s,y-7*s,x+8*s,y-3*s,x+11*s,y);c.quadraticCurveTo(x,y+2.2*s,x-10*s,y);c.fill();c.stroke();
  c.fillStyle='rgba(80,46,16,.24)';c.beginPath();c.moveTo(x,y-8*s);c.bezierCurveTo(x+4*s,y-7*s,x+8*s,y-3*s,x+11*s,y);c.quadraticCurveTo(x+4*s,y+1.4*s,x+1*s,y+.4*s);c.bezierCurveTo(x+2*s,y-3*s,x+1.4*s,y-6*s,x,y-8*s);c.fill();
  if(z>1.6){c.strokeStyle='rgba(60,36,14,.4)';c.lineWidth=.35;c.beginPath();for(let k=0;k<3;k++){c.moveTo(x-6*s+k*2*s,y-1.6*s-k*.6*s);c.quadraticCurveTo(x-4*s+k*2*s,y-3*s-k*.6*s,x-2*s+k*2*s,y-1.8*s-k*.6*s)}c.stroke()}}
function mpWorldHill(c,x,y,s,sd,z){
  c.fillStyle='rgba(166,182,110,.5)';c.strokeStyle='rgba(42,26,12,.75)';c.lineWidth=mpWorldLw(.55);c.beginPath();c.moveTo(x-8*s,y);c.quadraticCurveTo(x-2*s,y-10*s,x+8*s,y);c.fill();c.stroke();
  c.strokeStyle='rgba(42,26,12,.45)';c.lineWidth=.4;c.beginPath();for(let k=0;k<(z>1.5?5:3);k++){c.moveTo(x+(1+k*1.4)*s,y-(5.2-k*.9)*s);c.lineTo(x+(.2+k*1.4)*s,y-(2.2-k*.2)*s)}c.stroke()}
function mpWorldPalm(c,x,y,s,sd,z){
  c.strokeStyle='#6a4a22';c.lineWidth=1.1*s;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+1.6*s,y-4*s,x+1*s,y-8*s);c.stroke();
  c.strokeStyle='#4a8a4a';c.lineWidth=.9*s;c.lineCap='round';c.beginPath();for(let k=0;k<5;k++){const an=-Math.PI/2+(k-2)*.75;c.moveTo(x+1*s,y-8*s);c.quadraticCurveTo(x+1*s+Math.cos(an)*4*s,y-8*s+Math.sin(an)*4*s-1*s,x+1*s+Math.cos(an)*6.5*s,y-8*s+Math.sin(an)*5*s+2.4*s)}c.stroke();c.lineCap='butt';
  c.fillStyle='#5a3a1c';c.beginPath();c.arc(x+.2*s,y-7.4*s,.7*s,0,TAU);c.arc(x+1.9*s,y-7.4*s,.7*s,0,TAU);c.fill()}
function mpWorldItem(c,it,z){const t=it[0],x=it[1],y=it[2],s=it[3],sd=it[4];
  if(t===0)mpWorldTree(c,x,y,s,sd,z);else if(t===1)mpWorldPine(c,x,y,s,sd,z);else if(t===2)mpWorldMountain(c,x,y,s,sd,z);else if(t===3)mpWorldHill(c,x,y,s,sd,z);else if(t===4)mpWorldDune(c,x,y,s,sd,z,it[5]);else mpWorldPalm(c,x,y,s,sd,z)}

/* ---------- ships and sea monsters ---------- */
function mpWorldShip(x,y,s,dir,z){
  const c=ctx,t=G.time,bob=Math.sin(t*1.4+x*.1)*.7;c.save();c.translate(x,y+bob);c.scale(dir*s,s);c.rotate(Math.sin(t*1.1+x)*.025);
  c.strokeStyle='rgba(235,242,236,.8)';c.lineWidth=.8;c.beginPath();c.moveTo(-12,5.8);c.quadraticCurveTo(-18,7,-24,5.5);c.moveTo(-11,7.6);c.quadraticCurveTo(-17,9,-22,8.2);c.stroke();
  c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.8);c.fillStyle='#8a5a30';c.beginPath();c.moveTo(-12,-2.5);c.quadraticCurveTo(-9,6.5,0,6.5);c.quadraticCurveTo(9,6.5,13,-3);c.lineTo(10,-1);c.lineTo(-9,-1);c.closePath();c.fill();c.stroke();
  c.fillStyle='#c8a050';c.fillRect(-9,-1,19,1.1);c.strokeStyle='rgba(30,16,10,.5)';c.lineWidth=.3;c.beginPath();c.moveTo(-8,2);c.lineTo(9,2);c.moveTo(-6,4);c.lineTo(6,4);c.stroke();
  c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.9);c.beginPath();c.moveTo(-1,-1);c.lineTo(-1,-21);c.moveTo(7,-1);c.lineTo(7,-14);c.moveTo(-8,-1.5);c.lineTo(-12,-5);c.stroke();
  const sail=(a,b,w,h)=>{c.fillStyle='#f2e8cc';c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.7);c.beginPath();c.moveTo(a-w,b);c.quadraticCurveTo(a,b+1.2,a+w,b);c.quadraticCurveTo(a+w+1.8,b+h*.5,a+w,b+h);c.quadraticCurveTo(a,b+h-1.6,a-w,b+h);c.quadraticCurveTo(a-w-1.8,b+h*.5,a-w,b);c.closePath();c.fill();c.stroke()};
  sail(-1,-20,6.6,11);sail(7,-13.5,4.2,8);
  c.fillStyle=MPL.VERM;c.fillRect(-1.6,-17.6,1.2,6);c.fillRect(-4,-15,6,1.2);
  c.fillStyle=MPL.VERM;c.beginPath();c.moveTo(-1,-21);c.lineTo(5,-22.5);c.lineTo(-1,-24);c.closePath();c.fill();c.stroke();
  if(z>2){c.strokeStyle='rgba(30,16,10,.55)';c.lineWidth=.3;c.beginPath();c.moveTo(-1,-20);c.lineTo(-12,-1.5);c.moveTo(-1,-20);c.lineTo(10,-1.2);c.moveTo(7,-14);c.lineTo(12.5,-2.5);c.stroke()}
  if(z>3.5){c.fillStyle=mpWorldInk;for(const px of [-6,-3,2,5])c.fillRect(px,-2.6,.9,1.5)}
  c.restore()}
function mpWorldSerpent(x,y,s,dir,z){
  const c=ctx,t=G.time;c.save();c.translate(x,y);c.scale(dir*s,s);c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.8);
  const humps=[[-30,0,7],[-16,0,9],[0,0,8]];
  for(const [hx,hy,hr] of humps){const b=Math.sin(t*1.2+hx*.2)*.8;c.fillStyle='#4a7a5a';c.beginPath();c.moveTo(hx-hr,hy+3);c.quadraticCurveTo(hx,hy-hr*1.5+b,hx+hr,hy+3);c.closePath();c.fill();c.stroke();
    c.strokeStyle='rgba(235,230,200,.7)';c.lineWidth=.5;c.beginPath();for(let k=-1;k<=1;k++){c.moveTo(hx+k*hr*.4,hy-hr*.7+Math.abs(k)*2+b);c.lineTo(hx+k*hr*.5,hy+1)}c.stroke();c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.8);
    c.strokeStyle='rgba(235,242,236,.8)';c.lineWidth=.8;c.beginPath();c.moveTo(hx-hr-3,hy+4);c.quadraticCurveTo(hx,hy+6,hx+hr+3,hy+4);c.stroke();c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.8)}
  c.fillStyle='#4a7a5a';c.beginPath();c.moveTo(11,3);c.quadraticCurveTo(10,-14,16,-22);c.quadraticCurveTo(19,-25,23,-23);c.quadraticCurveTo(26,-22,25,-19);c.quadraticCurveTo(21,-18,19,-15);c.quadraticCurveTo(18,-6,17,3);c.closePath();c.fill();c.stroke();
  c.fillStyle=MPL.VERM;c.beginPath();c.moveTo(11,-8);c.lineTo(8,-14);c.lineTo(11,-12);c.lineTo(9,-19);c.lineTo(13,-15);c.closePath();c.fill();
  c.fillStyle='#f6e8a0';c.beginPath();c.arc(21,-21.4,1,0,TAU);c.fill();c.strokeStyle=MPL.VERM;c.lineWidth=.6;c.beginPath();c.moveTo(25,-20);c.lineTo(28,-19.4);c.lineTo(27,-18.2);c.moveTo(28,-19.4);c.lineTo(29,-20.4);c.stroke();
  c.fillStyle='#4a7a5a';c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.8);c.beginPath();c.moveTo(-36,3);c.quadraticCurveTo(-42,-4,-38,-9);c.quadraticCurveTo(-35,-4,-33,3);c.closePath();c.fill();c.stroke();c.restore()}
function mpWorldKraken(x,y,s,z){
  const c=ctx,t=G.time;c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle=mpWorldInk;
  c.strokeStyle='rgba(235,242,236,.8)';c.lineWidth=.9;c.beginPath();c.ellipse(0,2,22,5,0,0,TAU);c.stroke();
  c.lineCap='round';
  const tent=[[-18,-0,-30,-14,-24,-26,-12,-22],[-9,2,-16,-12,-4,-24,2,-17],[9,2,16,-12,4,-24,-2,-17],[18,0,30,-14,24,-26,12,-22],[-22,3,-38,2,-36,-12,-28,-10],[22,3,38,2,36,-12,28,-10]];
  for(const tt of tent){const w=Math.sin(t*1.5+tt[2])*1.4;c.strokeStyle=mpWorldInk;c.lineWidth=3.4;c.beginPath();c.moveTo(tt[0],tt[1]);c.bezierCurveTo(tt[2],tt[3]+w,tt[4],tt[5]+w,tt[6],tt[7]+w);c.stroke();c.strokeStyle='#9a4a3a';c.lineWidth=2.3;c.stroke();
    if(z>1.8){c.fillStyle='#f2dcc0';for(let k=1;k<=4;k++){const u=k/5,q=1-u,px=q*q*q*tt[0]+3*q*q*u*tt[2]+3*q*u*u*tt[4]+u*u*u*tt[6],py=q*q*q*tt[1]+3*q*q*u*(tt[3]+w)+3*q*u*u*(tt[5]+w)+u*u*u*(tt[7]+w);c.beginPath();c.arc(px,py,.55,0,TAU);c.fill()}}}
  c.lineCap='butt';c.fillStyle='#8a3a30';c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.9);c.beginPath();c.moveTo(-13,1);c.quadraticCurveTo(-15,-18,0,-22);c.quadraticCurveTo(15,-18,13,1);c.quadraticCurveTo(0,5,-13,1);c.fill();c.stroke();
  c.fillStyle='rgba(30,10,8,.25)';c.beginPath();c.moveTo(0,-22);c.quadraticCurveTo(15,-18,13,1);c.quadraticCurveTo(6,3,2,3.4);c.quadraticCurveTo(7,-8,0,-22);c.fill();
  c.fillStyle='#f6e8a0';for(const ex of [-5,5]){c.beginPath();c.ellipse(ex,-8,2.6,2,0,0,TAU);c.fill();c.stroke();c.fillStyle=mpWorldInk;c.beginPath();c.arc(ex,-8,.9,0,TAU);c.fill();c.fillStyle='#f6e8a0'}
  c.restore()}
function mpWorldWhale(x,y,s,dir){
  const c=ctx,t=G.time;c.save();c.translate(x,y);c.scale(dir*s,s);c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.8);c.fillStyle='#5a6a80';
  c.beginPath();c.moveTo(-18,2);c.quadraticCurveTo(-14,-9,0,-9);c.quadraticCurveTo(14,-9,20,-1);c.quadraticCurveTo(22,1,18,2);c.quadraticCurveTo(0,5,-18,2);c.fill();c.stroke();
  c.beginPath();c.moveTo(-18,2);c.quadraticCurveTo(-26,-2,-28,-8);c.quadraticCurveTo(-23,-6,-21,-3);c.quadraticCurveTo(-24,-8,-22,-12);c.quadraticCurveTo(-17,-8,-15,-2);c.closePath();c.fill();c.stroke();
  c.fillStyle='#eef0e8';c.beginPath();c.moveTo(-10,2.6);c.quadraticCurveTo(2,4.6,16,1.6);c.quadraticCurveTo(2,3,-10,2.6);c.fill();
  c.fillStyle=mpWorldInk;c.beginPath();c.arc(12,-3,.9,0,TAU);c.fill();
  c.strokeStyle='rgba(240,248,250,.9)';c.lineWidth=.9;const w=Math.sin(t*2)*.8;c.beginPath();c.moveTo(6,-9);c.lineTo(6,-17+w);c.moveTo(6,-14);c.quadraticCurveTo(3,-17,1,-15);c.moveTo(6,-14);c.quadraticCurveTo(9,-17,11,-15);c.stroke();c.restore()}

/* ---------- places: pen-and-ink pictures that gain detail with zoom ---------- */
function mpWorldTrees(x,y,z,l,kind){
  const c=ctx,k=l.k,pine=kind==='pine'||k==='gwood'||k==='road';
  const ts=[[-14,5,1],[-4,-3,1.2],[8,3,1],[16,-4,.9],[2,9,.9],[-9,10,.8]];ts.sort((a,b)=>a[1]-b[1]);
  for(const [dx,dy,s] of ts){if(pine)mpWorldPine(c,x+dx,y+dy+4,s*1.05,Math.abs(dx),z);else mpWorldTree(c,x+dx,y+dy+4,s*1.05,Math.abs(dx),z)}}
function mpWorldIco(l,x,y,z){
  const c=ctx,k=l.k,d1=z>1.5,d2=z>2.8,d3=z>4.2,ink=mpWorldInk,t=G.time;c.lineJoin='round';c.strokeStyle=ink;c.lineWidth=mpWorldLw(.9);
  const house=(hx,hy,s,roof,o)=>mpWorldHouse(hx,hy,s,roof,Object.assign({d1,d2,d3},o||{}));
  switch(l.ic){
  case 'town':{
    const wall=k==='anaea'?'#f6f1e4':'#eadfc2';
    if(k==='thornwick'){c.save();c.strokeStyle='#8a5a30';c.lineWidth=2;c.setLineDash([1.2,1.1]);c.beginPath();c.ellipse(x,y+3,24,13,0,0,TAU);c.stroke();c.setLineDash([]);c.strokeStyle=ink;c.lineWidth=.4;c.beginPath();c.ellipse(x,y+3,24.8,13.6,0,0,TAU);c.stroke();c.restore()}
    if(k==='yarrim'){c.fillStyle='#8a5a30';c.fillRect(x+14,y+7,18,2.2);c.strokeRect(x+14,y+7,18,2.2);for(let q=0;q<4;q++)c.fillRect(x+16+q*5,y+9,1,4);c.save();c.translate(x+28,y+14);c.scale(.5,.5);mpWorldShip(0,0,1,1,1);c.restore()}
    const H=[[-11,3,.95,'#b8321e'],[10,4,.9,'#c98a2a'],[0,-3,1.1,'#274a9a'],[-5,9,.8,'#3a7a5a'],[6,10,.8,'#b8321e']].sort((a,b)=>a[1]-b[1]);
    for(const [dx,dy,s,rf] of H)house(x+dx,y+dy+4,s,rf,{wall});
    if(k==='anaea'){c.fillStyle=wall;c.fillRect(x+14,y-6,6,12);c.strokeRect(x+14,y-6,6,12);c.fillStyle='#d8b050';c.beginPath();c.arc(x+17,y-6,3.6,Math.PI,0);c.fill();c.stroke()}
    else{mpWorldTower(x+17,y+6,5.4,15,{roof:MPL.LAPIS,d2})}
    break}
  case 'castle':{
    if(k==='scoria'){ // the golden city: domes and a minaret
      c.fillStyle='#e6c870';c.fillRect(x-15,y-2,30,12);c.strokeRect(x-15,y-2,30,12);
      for(const [dx,r,hh] of [[-9,6,4],[9,6,4],[0,8,9]]){c.fillStyle='#e6c870';c.fillRect(x+dx-r,y-2-hh,r*2,hh);c.strokeRect(x+dx-r,y-2-hh,r*2,hh);c.fillStyle='#d8a030';c.beginPath();c.arc(x+dx,y-2-hh,r,Math.PI,0);c.fill();c.stroke();c.strokeStyle=ink;c.beginPath();c.moveTo(x+dx,y-2-hh-r);c.lineTo(x+dx,y-2-hh-r-4);c.stroke();c.fillStyle='#f6e8a0';c.beginPath();c.arc(x+dx,y-2-hh-r-4.4,1,0,TAU);c.fill()}
      mpWorldTower(x+20,y+10,5,26,{col:'#e6c870',roof:'#b8321e'});mpWorldTower(x-20,y+10,5,22,{col:'#e6c870',roof:'#b8321e'});
      c.fillStyle='#2a1a0c';c.beginPath();c.moveTo(x-3,y+10);c.lineTo(x-3,y+5);c.quadraticCurveTo(x,y+1,x+3,y+5);c.lineTo(x+3,y+10);c.fill();
      if(d1){c.fillStyle='#274a9a';for(const dx of [-12,-6,6,12])c.fillRect(x+dx-.8,y+1,1.6,3.4)}break}
    if(k==='lastlight'){ // a ruined beacon on a rock
      c.fillStyle='#a89c84';c.beginPath();c.moveTo(x-16,y+10);c.lineTo(x-9,y+2);c.lineTo(x+9,y+2);c.lineTo(x+17,y+10);c.closePath();c.fill();c.stroke();
      c.fillStyle='#cfc6ae';c.beginPath();c.moveTo(x-5,y+3);c.lineTo(x-4,y-16);c.lineTo(x-1,y-20);c.lineTo(x+1,y-14);c.lineTo(x+4,y-17);c.lineTo(x+5,y+3);c.closePath();c.fill();c.stroke();
      c.fillStyle='rgba(30,16,10,.22)';c.fillRect(x,y-15,5,18);c.fillStyle='#3a2a1c';c.fillRect(x-.8,y-8,1.6,4);
      const fl=Math.sin(t*9)*.8;c.fillStyle='#e8601e';c.beginPath();c.moveTo(x-3,y-21);c.quadraticCurveTo(x-4,y-27,x,y-31+fl);c.quadraticCurveTo(x+4,y-27,x+3,y-21);c.closePath();c.fill();c.fillStyle='#f8d048';c.beginPath();c.moveTo(x-1.5,y-21);c.quadraticCurveTo(x-1.5,y-25,x,y-27);c.quadraticCurveTo(x+1.5,y-25,x+1.5,y-21);c.fill();break}
    if(k==='oldhaven'){mpWorldCastle(x,y,z,{wall:'#e6dcc0',roof:'#b8321e',roof2:'#274a9a',flag:'#274a9a'});for(const dx of [-26,26])house(x+dx,y+9,.7,'#c98a2a',{wall:'#eadfc2'});break}
    mpWorldCastle(x,y,z,{});for(const [dx,dy] of [[-24,6],[22,7]])house(x+dx,y+dy+3,.62,'#6a4a30',{});break}
  case 'orangecastle':{
    c.fillStyle='#c8782e';c.fillRect(x-17,y-2,34,12);c.strokeRect(x-17,y-2,34,12);c.fillRect(x-6,y-16,12,16);c.strokeRect(x-6,y-16,12,16);
    for(const [dx,h2] of [[-21,17],[-12,12],[8,12],[17,17]]){mpWorldTower(x+dx+2,y+8,6,h2+8,{col:'#d8883a',roof:'#5a3a30',d2})}
    c.fillStyle='#5a3a30';c.beginPath();c.moveTo(x-7,y-16);c.lineTo(x,y-26);c.lineTo(x+7,y-16);c.closePath();c.fill();c.stroke();
    mpWorldFlag(x,y-26,'#b03030',t);c.fillStyle=ink;c.fillRect(x-3,y+2,6,8);c.fillStyle='#f0a040';for(const dx of [-12,0,12])c.fillRect(x+dx-1,y-12,2,3);
    if(d2){c.strokeStyle='rgba(30,16,10,.3)';c.lineWidth=.3;for(let q=1;q<3;q++){c.beginPath();c.moveTo(x-17,y-2+q*4);c.lineTo(x+17,y-2+q*4);c.stroke()}}break}
  case 'abbey':{
    if(k==='monastery'){c.fillStyle='#9a8e78';c.beginPath();c.moveTo(x-20,y+10);c.lineTo(x-13,y+1);c.lineTo(x-4,y+3);c.lineTo(x+6,y-1);c.lineTo(x+14,y+3);c.lineTo(x+21,y+10);c.closePath();c.fill();c.stroke();c.strokeStyle='rgba(30,16,10,.5)';c.lineWidth=.4;c.beginPath();for(let q=0;q<7;q++){c.moveTo(x-14+q*4.5,y+3+q%2);c.lineTo(x-16+q*4.5,y+9)}c.stroke()}
    const by0=k==='monastery'?y+1:y+8,w0=k==='bells'?0:1;
    c.strokeStyle=ink;c.lineWidth=mpWorldLw(.9);c.fillStyle='#e2d8bc';c.fillRect(x-13,by0-10,26,10);c.strokeRect(x-13,by0-10,26,10);
    c.fillStyle='#b8321e';c.beginPath();c.moveTo(x-14.4,by0-10);c.lineTo(x-4,by0-16);c.lineTo(x+14.4,by0-10);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(30,16,10,.25)';c.beginPath();c.moveTo(x-4,by0-16);c.lineTo(x+14.4,by0-10);c.lineTo(x-4,by0-10);c.fill();
    mpWorldTower(x+9,by0,7,26,{col:'#e2d8bc',roof:MPL.LAPIS,d2});c.strokeStyle=MPL.GOLD;c.lineWidth=1;c.beginPath();c.moveTo(x+9,by0-26-7*.95);c.lineTo(x+9,by0-26-7*.95-4);c.moveTo(x+7.6,by0-26-7*.95-2.6);c.lineTo(x+10.4,by0-26-7*.95-2.6);c.stroke();
    c.fillStyle='#2a1a0c';c.beginPath();c.moveTo(x-6,by0);c.lineTo(x-6,by0-4);c.quadraticCurveTo(x-4,by0-7,x-2,by0-4);c.lineTo(x-2,by0);c.fill();
    if(d1){c.fillStyle='#274a9a';for(const dx of [-10,2])c.fillRect(x+dx-.8,by0-8,1.6,3);c.fillStyle='#f0d878';c.beginPath();c.arc(x+9,by0-20,1.3,0,TAU);c.fill()}
    if(d2){c.strokeStyle='rgba(30,16,10,.4)';c.lineWidth=.3;c.beginPath();for(let q=-12;q<8;q+=4){c.moveTo(x+q,by0-10);c.lineTo(x+q,by0)}c.stroke()}
    if(k==='bells'){ // a drowned abbey: the waves wash over its feet
      c.fillStyle='rgba(78,120,140,.62)';c.beginPath();c.moveTo(x-22,by0-4);c.quadraticCurveTo(x-10,by0-7,x,by0-4);c.quadraticCurveTo(x+10,by0-1,x+22,by0-4);c.lineTo(x+22,by0+3);c.lineTo(x-22,by0+3);c.fill();c.strokeStyle='rgba(235,242,236,.8)';c.lineWidth=.8;c.beginPath();c.moveTo(x-21,by0-4);c.quadraticCurveTo(x-10,by0-7,x,by0-4);c.quadraticCurveTo(x+10,by0-1,x+21,by0-4);c.stroke()}
    break}
  case 'cave':{
    if(k==='tomb'){c.fillStyle='#e0c690';c.beginPath();c.moveTo(x-17,y+9);c.lineTo(x,y-14);c.lineTo(x+17,y+9);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(80,46,16,.28)';c.beginPath();c.moveTo(x,y-14);c.lineTo(x+17,y+9);c.lineTo(x+2,y+9);c.closePath();c.fill();
      c.strokeStyle='rgba(60,36,14,.5)';c.lineWidth=.4;c.beginPath();for(let q=1;q<5;q++){c.moveTo(x-17*(1-q/5)-0,y-14+23*q/5);c.lineTo(x+17*(1-q/5),y-14+23*q/5)}c.stroke();c.fillStyle='#17110a';c.fillRect(x-2.4,y+3,4.8,6);
      c.fillStyle='#e8c860';c.beginPath();c.arc(x,y-17,1.6,0,TAU);c.fill();c.strokeStyle=ink;c.lineWidth=.5;c.stroke();break}
    c.fillStyle='#8a8478';c.beginPath();c.moveTo(x-14,y+8);c.lineTo(x-9,y-6);c.lineTo(x-2,y-10);c.lineTo(x+4,y-11);c.lineTo(x+11,y-4);c.lineTo(x+15,y+8);c.closePath();c.fill();c.stroke();
    c.fillStyle='rgba(30,22,12,.3)';c.beginPath();c.moveTo(x+4,y-11);c.lineTo(x+11,y-4);c.lineTo(x+15,y+8);c.lineTo(x+5,y+8);c.closePath();c.fill();
    c.fillStyle='#17110a';c.beginPath();c.moveTo(x-5,y+8);c.quadraticCurveTo(x-6,y-3,x,y-4);c.quadraticCurveTo(x+6,y-3,x+5,y+8);c.closePath();c.fill();
    c.strokeStyle='rgba(42,26,12,.5)';c.lineWidth=.4;c.beginPath();for(let q=0;q<6;q++){c.moveTo(x-12+q*2.6,y-4+q*.5);c.lineTo(x-13+q*2.6,y+4)}c.stroke();
    if(d1){c.fillStyle='#cfc6ae';c.strokeStyle=ink;c.lineWidth=.4;for(const dx of [-3.4,-.8,1.8,4]){c.beginPath();c.moveTo(x+dx-1,y-3.2);c.lineTo(x+dx,y+dx*0+.4);c.lineTo(x+dx+1,y-3.2);c.fill()}}
    if(d2){const gl=.5+.5*Math.sin(t*3);c.fillStyle=`rgba(240,170,60,${.25+.25*gl})`;c.beginPath();c.arc(x,y+5,2.4,0,TAU);c.fill()}break}
  case 'mine':{
    c.fillStyle='#8a8478';c.beginPath();c.moveTo(x-14,y+8);c.lineTo(x-9,y-6);c.lineTo(x-2,y-10);c.lineTo(x+4,y-11);c.lineTo(x+11,y-4);c.lineTo(x+15,y+8);c.closePath();c.fill();c.stroke();
    c.fillStyle='rgba(30,22,12,.3)';c.beginPath();c.moveTo(x+4,y-11);c.lineTo(x+11,y-4);c.lineTo(x+15,y+8);c.lineTo(x+5,y+8);c.closePath();c.fill();
    c.fillStyle='#17110a';c.fillRect(x-4.4,y-2,8.8,10);c.strokeStyle='#7a4a24';c.lineWidth=1.6;c.beginPath();c.moveTo(x-5,y+8);c.lineTo(x-5,y-3);c.lineTo(x+5,y-3);c.lineTo(x+5,y+8);c.stroke();
    c.strokeStyle=ink;c.lineWidth=mpWorldLw(.9);c.beginPath();c.moveTo(x+8,y-14);c.lineTo(x+17,y-5);c.moveTo(x+4,y-10);c.quadraticCurveTo(x+11,y-19,x+20,y-10);c.moveTo(x+17,y-14);c.lineTo(x+8,y-5);c.moveTo(x+21,y-10);c.quadraticCurveTo(x+14,y-19,x+5,y-10);c.stroke();
    if(d1){c.fillStyle='#6a5a48';c.fillRect(x-14,y+6,6,3);c.strokeRect(x-14,y+6,6,3);c.fillStyle=ink;c.beginPath();c.arc(x-12.6,y+10,1,0,TAU);c.arc(x-9.6,y+10,1,0,TAU);c.fill();c.strokeStyle='#5a3a1c';c.lineWidth=.6;c.beginPath();c.moveTo(x-16,y+11);c.lineTo(x-4,y+11);c.stroke()}
    if(d2){c.fillStyle='#c8a860';for(const [dx,dy] of [[10,4],[12.5,5.4],[8,6],[14,7]]){c.beginPath();c.arc(x+dx,y+dy,1,0,TAU);c.fill()}}break}
  case 'graves':{
    c.fillStyle='rgba(235,240,235,.28)';c.beginPath();c.ellipse(x,y+7,24,6,0,0,TAU);c.fill();
    const gs=[[-12,3],[-1,-3],[11,4],[-4,9],[6,11],[-16,9]];gs.sort((a,b)=>a[1]-b[1]);
    for(const [dx,dy] of gs){const px=x+dx,py=y+dy;c.fillStyle='#a8a498';c.strokeStyle=ink;c.lineWidth=mpWorldLw(.7);
      if(dx%2===0){c.fillRect(px-1.3,py-9,2.6,11);c.strokeRect(px-1.3,py-9,2.6,11);c.fillRect(px-4.5,py-6,9,2.4);c.strokeRect(px-4.5,py-6,9,2.4)}
      else{c.beginPath();c.moveTo(px-3,py+2);c.lineTo(px-3,py-5);c.quadraticCurveTo(px,py-10,px+3,py-5);c.lineTo(px+3,py+2);c.closePath();c.fill();c.stroke();if(d1){c.beginPath();c.moveTo(px-1.2,py-3);c.lineTo(px+1.2,py-3);c.moveTo(px,py-5);c.lineTo(px,py);c.stroke()}}}
    c.strokeStyle='#3a2a1c';c.lineWidth=1.1;c.beginPath();c.moveTo(x+18,y+10);c.lineTo(x+18,y-8);c.moveTo(x+18,y-3);c.lineTo(x+13,y-8);c.moveTo(x+18,y-5);c.lineTo(x+22,y-10);c.stroke();
    if(d2){c.fillStyle=ink;c.beginPath();c.moveTo(x+14,y-9);c.lineTo(x+17,y-11);c.lineTo(x+16,y-8.6);c.fill()}break}
  case 'moor':{
    c.strokeStyle='#4a5a36';c.lineWidth=1.1;for(let i=0;i<16;i++){const px=x-22+hash2(i,1,9)*44,py=y-6+hash2(i,2,9)*16;c.beginPath();c.moveTo(px,py);c.lineTo(px-2,py-5);c.moveTo(px,py);c.lineTo(px+2,py-5);c.moveTo(px,py);c.lineTo(px,py-6);c.stroke();if(i%3===0){c.fillStyle='#8a5a8a';c.beginPath();c.arc(px,py-6,1,0,TAU);c.fill()}}
    c.fillStyle='#a8a498';c.strokeStyle=ink;c.lineWidth=mpWorldLw(.8);c.beginPath();c.moveTo(x-2.4,y+4);c.lineTo(x-2,y-12);c.quadraticCurveTo(x,y-14,x+2,y-12);c.lineTo(x+2.6,y+4);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(30,16,10,.25)';c.fillRect(x,y-12,2.6,16);break}
  case 'dunes':{
    const tint=({sandroad:'sand',reddunes:'red',bluedunes:'blue',whitedunes:'white',flatlands:'sand',goldenerg:'gold',violeterg:'violet'})[k]||'sand';
    for(const [dx,dy,s] of [[-13,6,1.1],[14,7,.95],[2,2,1.5]])mpWorldDune(c,x+dx,y+dy,s,0,z,mpWorldTints[tint]);
    c.fillStyle='#f0e6c8';c.strokeStyle=ink;c.lineWidth=mpWorldLw(.7);c.beginPath();c.moveTo(x-1.4,y-6);c.lineTo(x+2,y-12);c.lineTo(x+5.4,y-6);c.closePath();c.fill();c.stroke();c.fillStyle=MPL.VERM;c.fillRect(x-1.4,y-6.8,7,1.2);
    c.strokeStyle=ink;c.beginPath();c.moveTo(x+2,y-12);c.lineTo(x+2,y-16);c.stroke();c.fillStyle=MPL.VERM;c.beginPath();c.moveTo(x+2,y-16);c.lineTo(x+6,y-15);c.lineTo(x+2,y-14);c.fill();break}
  case 'mountains':{
    if(k==='cinder'){mpWorldMountain(c,x-14,y+8,1.1,3,z);mpWorldMountain(c,x+14,y+9,.9,5,z);
      c.fillStyle='#6a4a40';c.beginPath();c.moveTo(x-17,y+10);c.lineTo(x-5,y-8);c.lineTo(x+5,y-8);c.lineTo(x+17,y+10);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(20,10,8,.3)';c.beginPath();c.moveTo(x+5,y-8);c.lineTo(x+17,y+10);c.lineTo(x+4,y+10);c.fill();
      c.fillStyle='#e8601e';c.beginPath();c.moveTo(x-5,y-8);c.quadraticCurveTo(x,y-11,x+5,y-8);c.lineTo(x+3,y-5);c.lineTo(x+1,y-1);c.lineTo(x-1,y-5);c.closePath();c.fill();
      c.strokeStyle='rgba(70,60,56,.65)';c.lineWidth=3;c.lineCap='round';for(let q=0;q<4;q++){const sw=Math.sin(t*1.2+q)*2;c.beginPath();c.arc(x+q*2+sw,y-14-q*5,2.6+q*.8,0,TAU);c.stroke()}c.lineCap='butt';break}
    for(const [dx,dy,s,q] of [[-12,4,1,1],[0,0,1.4,2],[13,5,.95,3],[24,2,.8,4]])mpWorldMountain(c,x+dx,y+dy+8,s,q*3,z);break}
  case 'rain':{
    if(k==='openSea'){mpWorldShip(x-14,y+8,1.4,1,z);c.strokeStyle='rgba(22,56,86,.55)';c.lineWidth=.9;for(let q=0;q<3;q++){c.beginPath();c.moveTo(x-22+q*3,y+16+q*3);c.quadraticCurveTo(x-18+q*3,y+13+q*3,x-14+q*3,y+16+q*3);c.quadraticCurveTo(x-10+q*3,y+19+q*3,x-6+q*3,y+16+q*3);c.stroke()}}
    else mpWorldTrees(x,y+2,z,l,'pine');
    c.fillStyle='#b8b4a8';c.strokeStyle=ink;c.lineWidth=mpWorldLw(.8);c.beginPath();c.arc(x-8,y-14,5,Math.PI*.5,Math.PI*1.5);c.arc(x,y-17,6,Math.PI,0);c.arc(x+9,y-14,5,Math.PI*1.5,Math.PI*.5);c.closePath();c.fill();c.stroke();
    c.strokeStyle='rgba(40,60,90,.75)';c.lineWidth=.9;for(let q=0;q<9;q++){const px=x-18+q*4.5,py=y-10+(q%3)*4+((t*14+q*3)%4);c.beginPath();c.moveTo(px,py);c.lineTo(px-1.6,py+5);c.stroke()}break}
  case 'trees':{
    if(k==='saltbarrow'){mpWorldTrees(x-2,y+2,z,l,'broad');c.strokeStyle=ink;c.lineWidth=mpWorldLw(.9);c.beginPath();c.moveTo(x+14,y+8);c.lineTo(x+14,y-14);c.stroke();c.fillStyle='#1a1410';c.beginPath();c.moveTo(x+14,y-14);c.lineTo(x+24,y-12);c.lineTo(x+14,y-7);c.closePath();c.fill();c.fillStyle='#efe8d8';c.beginPath();c.arc(x+17.4,y-11.2,1.4,0,TAU);c.fill();break}
    if(k==='thornwood'||k==='hollowgrass'){mpWorldTrees(x,y,z,l,'broad');break}
    mpWorldTrees(x,y,z,l,k==='oakwood'||k==='greendale'?'broad':'pine');break}
  default:mpWorldTrees(x,y,z,l,'broad')}}

/* the key (live, in screen space) */
function mpWorldKey(){
  const c=ctx,x0=338,y0=212,w=124,h=62;c.save();c.fillStyle='rgba(238,226,190,.9)';c.fillRect(x0,y0,w,h);c.restore();mplPanel(c,x0,y0,w,h);
  const rows=[['Town',(a,b)=>mpWorldHouse(a,b+3,.8,MPL.VERM,{})],['Castle',(a,b)=>{c.save();c.translate(a,b+1);c.scale(.36,.36);mpWorldCastle(0,0,1,{});c.restore()}],['Abbey',(a,b)=>{c.save();c.translate(a,b+2);c.scale(.4,.4);mpWorldIco({ic:'abbey',k:'x'},0,0,1);c.restore()}],
    ['Cave or mine',(a,b)=>{c.save();c.translate(a,b+1);c.scale(.5,.5);mpWorldIco({ic:'cave',k:'x'},0,0,1);c.restore()}],['Graves',(a,b)=>{c.fillStyle='#a8a498';c.strokeStyle=mpWorldInk;c.lineWidth=.6;c.fillRect(a-.9,b-5,1.8,8);c.strokeRect(a-.9,b-5,1.8,8);c.fillRect(a-3,b-3,6,1.8);c.strokeRect(a-3,b-3,6,1.8)}],
    ['Road',(a,b)=>{c.strokeStyle='rgba(42,26,12,.85)';c.lineWidth=3.6;c.beginPath();c.moveTo(a-6,b);c.lineTo(a+6,b);c.stroke();c.strokeStyle='#e8d8a6';c.lineWidth=2.2;c.stroke()}],
    ['Teleport stone',(a,b)=>{c.fillStyle='#46506a';c.strokeStyle=mpWorldInk;c.lineWidth=.6;c.beginPath();c.ellipse(a,b+1,4.4,2.4,0,0,TAU);c.fill();c.stroke();c.strokeStyle='#cfeaff';c.beginPath();c.arc(a,b,2.4,0,TAU);c.stroke()}],
    ['Quest open',(a,b)=>{c.fillStyle='#b02818';c.beginPath();c.arc(a,b,1.8,0,TAU);c.fill()}],['A day on foot',(a,b)=>{c.fillStyle=mpWorldInk;c.fillRect(a-6,b,12,1.2);c.fillRect(a-6,b-2,1,4.4);c.fillRect(a+5,b-2,1,4.4)}]];
  rows.forEach((r,i)=>{const col=i%2,row=(i/2)|0,xx=x0+9+col*60,yy=y0+8+row*10.4;r[1](xx,yy);mplText(c,r[0],xx+9,yy,6,'#3a2a1c','left')})}

/* ---------- the world, drawn live ---------- */
function mpWorldTerrain(V,z){
  const c=ctx,M=mpWorldM,H=hash2;
  // washes of colour on the land
  c.save();c.clip(M.landP);
  const WS=[[-420,100,260,150,'120,150,84',.3],[-760,120,260,160,'104,140,76',.28],[-560,-110,260,70,'130,140,130',.24],[-600,280,240,50,'150,150,100',.22],[60,160,150,110,'120,150,84',.34],[210,230,100,70,'96,134,70',.3],[330,200,110,100,'140,160,90',.26],[116,222,60,44,'70,110,64',.34],[324,136,44,28,'140,100,130',.3],[-6,284,76,56,'50,70,60',.5],[-6,254,40,30,'200,120,50',.3],[250,70,150,60,'150,150,140',.24],
    [480,215,46,46,'216,184,110',.4],[486,96,44,50,'200,110,70',.42],[566,190,50,44,'110,150,196',.42],[572,128,50,40,'226,226,226',.5],[566,66,52,38,'160,150,130',.4],[652,160,60,60,'226,176,60',.46],[652,230,60,52,'150,100,180',.4],[480,34,54,36,'226,176,60',.34],[590,262,120,40,'216,184,110',.3],
    [1244,190,70,56,'90,130,70',.34],[1350,200,160,170,'110,150,80',.22],[1380,420,160,100,'100,140,76',.2],[930,-210,150,70,'120,130,140',.3],[1040,-240,100,40,'60,100,70',.26],[420,186,40,36,'80,130,70',.3],[560,-170,160,50,'130,140,130',.2],[1165,50,30,50,'90,130,70',.2]];
  for(const [cx,cy,rx,ry,col,a] of WS){if(cx+rx<V.x0||cx-rx>V.x1||cy+ry<V.y0||cy-ry>V.y1)continue;c.save();c.translate(cx,cy);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(.6,`rgba(${col},${a*.55})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(-rx,-rx,rx*2,rx*2);c.restore()}
  // the unknown lands: a hatched wash east of Greyfang Pass
  const UL=[[424,-400],[424,100],[416,140],[398,200],[380,262],[380,700],[1900,700],[1900,-400]];
  c.beginPath();UL.forEach((q,k)=>k?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.fillStyle='rgba(70,52,30,.10)';c.fill();c.save();c.clip();
  c.strokeStyle='rgba(70,52,30,.13)';c.lineWidth=mpWorldLw(.7);c.beginPath();const q0=Math.floor((V.x0-300-V.y1*0+ -(V.y0))/11)*11;for(let q=Math.max(0,Math.floor((V.x0-300+V.y0*1)/11)*11);q<1900;q+=11){const xa=300+q,ya=-300,xb=300+q-900,yb=600;if(xa<V.x0||xb>V.x1)continue;c.moveTo(xa,ya);c.lineTo(xb,yb)}c.stroke();c.restore();
  c.setLineDash([3,4]);c.strokeStyle='rgba(70,52,30,.38)';c.lineWidth=mpWorldLw(.8);c.beginPath();c.moveTo(UL[0][0],UL[0][1]);for(let i=1;i<=5;i++)c.lineTo(UL[i][0],UL[i][1]);c.stroke();c.setLineDash([]);
  // the worn edge of the vellum along the coast
  c.strokeStyle='rgba(120,84,40,.16)';c.lineWidth=7;c.stroke(M.landP);
  c.restore();
  // the sea
  c.fillStyle='rgba(68,112,138,.6)';c.fill(M.waterP,'evenodd');
  c.save();c.clip(M.waterP,'evenodd');
  for(const [cx,cy,rx,ry] of [[850,230,170,200],[300,470,300,90],[-240,160,120,260],[1000,420,150,120]]){if(cx+rx<V.x0||cx-rx>V.x1||cy+ry<V.y0||cy-ry>V.y1)continue;c.save();c.translate(cx,cy);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,'rgba(20,50,96,.2)');g.addColorStop(1,'rgba(20,50,96,0)');c.fillStyle=g;c.fillRect(-rx,-rx,rx*2,rx*2);c.restore()}
  // rhumb lines, faint, radiating across the sea
  c.strokeStyle='rgba(30,40,80,.10)';c.lineWidth=mpWorldLw(.5);c.beginPath();for(const [rx0,ry0] of [[850,210],[300,470],[-240,150]])for(let k=0;k<16;k++){const an=k/16*TAU;c.moveTo(rx0,ry0);c.lineTo(rx0+Math.cos(an)*900,ry0+Math.sin(an)*900)}c.stroke();
  // soft shallows along the coast
  c.strokeStyle='rgba(236,240,226,.2)';c.lineWidth=11;c.stroke(M.landP);c.strokeStyle='rgba(236,240,226,.26)';c.lineWidth=4;c.stroke(M.landP);
  // wave strokes
  {const cs=z<.8?22:z<2?16:10,gx0=Math.floor(V.x0/cs),gx1=Math.ceil(V.x1/cs),gy0=Math.floor(V.y0/cs),gy1=Math.ceil(V.y1/cs);c.beginPath();
    for(let gy=gy0;gy<=gy1;gy++)for(let gx=gx0;gx<=gx1;gx++){const r=H(gx,gy,61);if(r>.5)continue;const wx=(gx+H(gx,gy,62))*cs,wy=(gy+H(gy,gx,63))*cs;if(M.isLand(wx,wy))continue;const L=(9+H(gx,gy,64)*7)*(cs<12?.7:1),a=2.2+H(gx,gy,65)*1.6;
      c.moveTo(wx,wy);c.quadraticCurveTo(wx+L*.25,wy-a,wx+L*.5,wy);c.quadraticCurveTo(wx+L*.75,wy+a,wx+L,wy);if(r<.12){c.moveTo(wx+L*.2,wy+4);c.lineTo(wx+L*.8,wy+4)}}
    c.strokeStyle='rgba(22,56,86,.44)';c.lineWidth=mpWorldLw(.8);c.stroke()}
  // coast hatching
  c.beginPath();for(const h of M.hatch){if(h[0]<V.x0||h[0]>V.x1||h[1]<V.y0||h[1]>V.y1)continue;const l1=3+h[4]*5,l2=2+h[5]*3;c.moveTo(h[0]+h[2]*2.4,h[1]+h[3]*2.4);c.lineTo(h[0]+h[2]*(2.4+l1),h[1]+h[3]*(2.4+l1));if(h[5]>.35){c.moveTo(h[0]+h[2]*2.4+h[3]*3,h[1]+h[3]*2.4-h[2]*3);c.lineTo(h[0]+h[2]*(2.4+l2)+h[3]*3,h[1]+h[3]*(2.4+l2)-h[2]*3)}}
  c.strokeStyle='rgba(28,52,70,.5)';c.lineWidth=mpWorldLw(.6);c.stroke();
  c.restore();
  c.strokeStyle='rgba(30,50,60,.25)';c.lineWidth=mpWorldLw(2.6);c.stroke(M.landP);c.strokeStyle='rgba(42,26,12,.9)';c.lineWidth=mpWorldLw(1.15);c.stroke(M.landP);
  // islands
  for(const q of M.isl){if(q.x+q.r*2<V.x0||q.x-q.r*2>V.x1||q.y+q.r*2<V.y0||q.y-q.r*2>V.y1)continue;
    c.save();c.strokeStyle='rgba(236,242,236,.55)';c.lineWidth=mpWorldLw(1.3);c.beginPath();c.ellipse(q.x,q.y,q.r*1.55,q.r*1.2,0,0,TAU);c.stroke();c.strokeStyle='rgba(236,242,236,.3)';c.beginPath();c.ellipse(q.x,q.y,q.r*1.85,q.r*1.4,0,0,TAU);c.stroke();
    c.fillStyle='#dccd9c';c.fill(q.p);c.save();c.clip(q.p);if(q.r>=9){c.fillStyle='rgba(110,140,80,.55)';c.beginPath();c.ellipse(q.x-q.r*.1,q.y-q.r*.05,q.r*.7,q.r*.5,0,0,TAU);c.fill()}c.strokeStyle='rgba(120,84,40,.3)';c.lineWidth=q.r*.3;c.stroke(q.p);c.restore();
    c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(1.1);c.stroke(q.p);
    c.strokeStyle='rgba(28,52,70,.5)';c.lineWidth=mpWorldLw(.55);c.beginPath();for(let k=0;k<q.pts.length;k+=(q.r<8?2:1)){const p=q.pts[k],dx=p[0]-q.x,dy=(p[1]-q.y)/.86,L=Math.hypot(dx,dy)||1;c.moveTo(p[0]+dx/L*1.6,p[1]+dy/L*1.6);c.lineTo(p[0]+dx/L*(1.6+2.6+(k%3)),p[1]+dy/L*(1.6+2.6+(k%3)))}c.stroke();c.restore()}
}
function mpWorldFeatures(V,z){
  const c=ctx,M=mpWorldM;
  // rivers: two inked banks with a blue wash between them, narrowing as they start
  for(const pts of M.rv){let ok=false;for(const p of pts){if(p[0]>V.x0&&p[0]<V.x1&&p[1]>V.y0&&p[1]<V.y1){ok=true;break}}if(!ok)continue;
    c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);
    c.strokeStyle='rgba(42,26,12,.75)';c.lineWidth=mpWorldLw(3.2);c.stroke();c.strokeStyle='#8fb0b4';c.lineWidth=mpWorldLw(2.1);c.stroke();c.strokeStyle='rgba(240,248,250,.5)';c.lineWidth=mpWorldLw(.6);c.setLineDash([3,5]);c.stroke();c.setLineDash([]);c.lineCap='butt'}
  for(const [lx,ly,rx,ry] of M.lakes){if(lx+rx<V.x0||lx-rx>V.x1||ly+ry<V.y0||ly-ry>V.y1)continue;c.beginPath();for(let k=0;k<=18;k++){const a=k/18*TAU,j=1+.12*Math.sin(a*3+lx);k?c.lineTo(lx+Math.cos(a)*rx*j,ly+Math.sin(a)*ry*j):c.moveTo(lx+Math.cos(a)*rx*j,ly+Math.sin(a)*ry*j)}c.closePath();c.fillStyle='#8fb0b4';c.fill();c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(1);c.stroke();
    c.strokeStyle='rgba(22,56,86,.5)';c.lineWidth=mpWorldLw(.6);c.beginPath();for(let k=0;k<3;k++){c.moveTo(lx-rx*.5+k*rx*.3,ly-ry*.3+k*ry*.3);c.quadraticCurveTo(lx-rx*.4+k*rx*.3,ly-ry*.5+k*ry*.3,lx-rx*.3+k*rx*.3,ly-ry*.3+k*ry*.3)}c.stroke()}
  // grass tufts, heather and pebbles
  if(z>.85){c.beginPath();for(const t of M.tuf){if(t[0]<V.x0||t[0]>V.x1||t[1]<V.y0||t[1]>V.y1)continue;const a=t[0],b=t[1];c.moveTo(a-1.3,b);c.lineTo(a-.4,b-2.4);c.moveTo(a,b);c.lineTo(a,b-2.8);c.moveTo(a+1.3,b);c.lineTo(a+.5,b-2.2)}c.strokeStyle='rgba(60,90,50,.7)';c.lineWidth=mpWorldLw(.5);c.stroke()}
  c.beginPath();for(const t of M.hea){if(t[0]<V.x0||t[0]>V.x1||t[1]<V.y0||t[1]>V.y1)continue;const a=t[0],b=t[1];c.moveTo(a,b);c.lineTo(a-1.6,b-3.6);c.moveTo(a,b);c.lineTo(a+1.6,b-3.6);c.moveTo(a,b);c.lineTo(a,b-4.4)}c.strokeStyle='#5a5a40';c.lineWidth=mpWorldLw(.55);c.stroke();
  c.fillStyle='rgba(138,90,138,.8)';for(const t of M.hea){if(t[0]<V.x0||t[0]>V.x1||t[1]<V.y0||t[1]>V.y1||t[2]%3)continue;c.fillRect(t[0]-.6,t[1]-5,1.2,1.2)}
  c.fillStyle='rgba(90,70,50,.6)';for(const p of M.peb){if(p[0]<V.x0||p[0]>V.x1||p[1]<V.y0||p[1]>V.y1)continue;c.fillRect(p[0],p[1],.8+p[2]*.9,.6+p[2]*.6)}
  // roads: inked ribbons with a dashed middle, milestones by the verge
  for(const r of M.rd){const pts=r.pts;let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of pts){if(p[0]<x0)x0=p[0];if(p[0]>x1)x1=p[0];if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1]}if(x1<V.x0||x0>V.x1||y1<V.y0||y0>V.y1)continue;
    const w=r.style==='road'?3.4:r.style==='pilgrim'?2:2.4;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);
    if(r.style==='pilgrim'){c.strokeStyle='rgba(42,26,12,.4)';c.lineWidth=mpWorldLw(w+1);c.setLineDash([5,3]);c.stroke();c.strokeStyle='#d8bc86';c.lineWidth=mpWorldLw(w);c.stroke();c.setLineDash([])}
    else{c.strokeStyle='rgba(42,26,12,.85)';c.lineWidth=mpWorldLw(w+1.5);c.stroke();c.strokeStyle=r.style==='road'?'#e8d8a6':'#d4bd8a';c.lineWidth=mpWorldLw(w);c.stroke();c.strokeStyle='rgba(120,80,40,.7)';c.lineWidth=mpWorldLw(.5);c.setLineDash([2.2,3]);c.stroke();c.setLineDash([])}
    c.lineCap='butt';
    // milestones (and wayside crosses on the pilgrim's way)
    let acc=0,nm=0;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);acc+=L;if(acc<(r.style==='pilgrim'?46:38))continue;acc=0;nm++;
      if(b[0]<V.x0||b[0]>V.x1||b[1]<V.y0||b[1]>V.y1)continue;const dx=b[0]-a[0],dy=b[1]-a[1],LL=Math.hypot(dx,dy)||1,sd=nm%2?1:-1,mx=b[0]-dy/LL*4.6*sd,my=b[1]+dx/LL*4.6*sd;
      if(r.style==='pilgrim'){c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.8);c.beginPath();c.moveTo(mx,my+2);c.lineTo(mx,my-4);c.moveTo(mx-1.6,my-2.4);c.lineTo(mx+1.6,my-2.4);c.stroke()}
      else if(r.style==='road'){c.fillStyle='#d8cfb8';c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.5);c.beginPath();c.moveTo(mx-1,my+1.6);c.lineTo(mx-1,my-1.2);c.quadraticCurveTo(mx,my-2.8,mx+1,my-1.2);c.lineTo(mx+1,my+1.6);c.closePath();c.fill();c.stroke()}}}
}
function mpWorldNames(V,z){
  const c=ctx,fx=(s,x,y,sz,col,sp)=>{c.save();c.font=`${sz}px ${FTITLE}`;if('letterSpacing' in c)c.letterSpacing=(sp||1)+'px';c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=3.4;c.strokeStyle='rgba(236,222,176,.7)';c.strokeText(s,x,y);c.fillStyle=col;c.fillText(s,x,y);c.restore()},
    sm=(s,x,y,sz,col)=>{c.save();c.font=`italic ${sz}px ${FUI}`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=2.6;c.strokeStyle='rgba(236,222,176,.6)';c.strokeText(s,x,y);c.fillStyle=col;c.fillText(s,x,y);c.restore()},
    sea=(s,x,y,sz,col)=>{c.save();c.font=`italic ${sz}px ${FUI}`;if('letterSpacing' in c)c.letterSpacing='3px';c.textAlign='center';c.textBaseline='middle';c.fillStyle=col;c.fillText(s,x,y);c.restore()};
  const ink='rgba(50,36,18,.78)',ink2='rgba(50,36,18,.62)';
  fx('The Unknown Lands',476,-16,19,ink,1.5);sm('east of Greyfang Pass, uncharted',476,-1,8,ink2);
  fx('The Known Lands',210,16,19,ink,1.5);sm('where the road began',210,30,8,ink2);
  fx('The Sea Lands',652,16,19,ink,1.5);sm('the country along the coast',652,30,8,ink2);
  fx('The Hollow Lands',-6,206,16,ink,1);sm('under the Abbey',-6,219,8,ink2);
  fx('The Western Reaches',-330,120,19,ink,1.5);sm('the land goes on, beyond the Hollow Lands',-330,134,8,ink2);
  fx('The Far West',-760,100,19,ink,1.5);sm('where no road has been drawn',-760,114,8,ink2);
  fx('The Grey Downs',-560,250,15,ink,1);sm('open hills and long grass',-560,262,8,ink2);
  fx('The Eastern Lands',1230,16,19,ink,1.5);sm('the far shore of the Narrow Sea',1230,30,8,ink2);
  sea('The Narrow Sea',836,24,21,'rgba(26,48,84,.78)');sm('a great ocean, and no charts',836,39,8,'rgba(26,40,70,.78)');sm('the Eastern Lands lie on the far side',836,330,8,'rgba(26,40,70,.78)');
  sm('the lands meet here, far to the north: the long way round',930,-138,9,'rgba(26,40,70,.78)');
  sea('The Western Deep',-250,110,16,'rgba(26,48,84,.7)');sea('The Southern Sea',380,450,17,'rgba(26,48,84,.7)');
  sm('the road east, then north',530,264,8,'#3a2a16');
}
function mpWorldCreatures(V,z){
  const c=ctx,vis=(x,y,r)=>x+r>V.x0&&x-r<V.x1&&y+r>V.y0&&y-r<V.y1;
  for(const [x,y,d,s] of [[790,-62,1,1],[1010,34,-1,1.1],[1040,330,1,1],[880,432,-1,1],[300,408,1,1],[560,396,-1,1.1],[-222,196,1,1],[-176,-60,-1,1],[690,-30,1,.9]])if(vis(x,y,30))mpWorldShip(x,y,s,d,z);
  if(vis(-230,84,50))mpWorldSerpent(-230,84,.9,1,z);if(vis(450,430,50))mpWorldSerpent(450,432,.9,-1,z);
  if(vis(690,440,40))mpWorldKraken(690,440,1.1,z);if(vis(1040,228,30))mpWorldWhale(1040,228,1,-1);
  const G1=G.flags||{};
  if(G1.voyage){const by=mpWorldM.by,ks=['yarrim','saltbarrow','bells','cinder','lastlight'];c.strokeStyle='rgba(30,70,110,.85)';c.lineWidth=mpWorldLw(1.5);c.setLineDash([3,3.5]);c.beginPath();ks.forEach((k,i)=>{const l=by[k];i?c.lineTo(l.x,l.y):c.moveTo(l.x,l.y)});c.stroke();c.setLineDash([])}
}

function mpWorldDraw(){
  const M=mpWorldM;if(!M.ready)mpWorldInit();
  { // rebuild the title sheet once if the blackletter font arrives after the first draw
    let fo=false;try{fo=!document.fonts||document.fonts.check('20px UnifrakturCook')}catch(e){fo=true}
    if(!M.over||(fo&&!M.fontOK)){M.over=mpWorldOverlay();M.fontOK=fo}}
  BTNS=[];veil(1);
  const x0=14,y0=14,w=452,h=292,ink=mpWorldInk;
  btn('wmap',x0,y0,w,h); // the whole map: drag it to move, wheel or pinch to zoom
  ctx.save();rrect(ctx,x0,y0,w,h,6);ctx.clip();
  ctx.drawImage(M.paper,0,0,DW,DH);
  if(G._wvT===undefined||G.time-G._wvT>.5)G.wv=wvDefault();G._wvT=G.time;   // newly opened: centre on the party
  const WV=G.wv||(G.wv=wvDefault()),z=WV.z;M.zz=z;
  ctx.save();ctx.translate(240+WV.x,160+WV.y);ctx.scale(z,z);ctx.translate(-240,-160); // the lands themselves can be dragged and zoomed
  const V={x0:240+(x0-240-WV.x)/z-30,y0:160+(y0-160-WV.y)/z-30,x1:240+(x0+w-240-WV.x)/z+30,y1:160+(y0+h-160-WV.y)/z+30};
  mpWorldTerrain(V,z);
  mpWorldFeatures(V,z);
  // the painter's list: mountains, trees, dunes, hills, palms, back to front
  {const it=M.items;let lo=0,hi=it.length;while(lo<hi){const m=(lo+hi)>>1;if(it[m][2]<V.y0-8)lo=m+1;else hi=m}
    for(let i=lo;i<it.length;i++){const q=it[i];if(q[2]>V.y1+24)break;if(q[1]<V.x0||q[1]>V.x1)continue;mpWorldItem(ctx,q,z)}}
  // ferry across the Narrow Sea
  {const f=M.ferry;ctx.strokeStyle='rgba(30,56,96,.8)';ctx.lineWidth=mpWorldLw(1.3);ctx.setLineDash([2.5,3.5]);ctx.beginPath();ctx.moveTo(f[0][0],f[0][1]);for(let i=1;i<f.length;i++)ctx.lineTo(f[i][0],f[i][1]);ctx.stroke();ctx.setLineDash([])}
  mpWorldCreatures(V,z);
  mpWorldNames(V,z);
  const by=M.by,QLEFT=questsLeft();
  const visited=l=>l.lv.some(v=>v===LEVEL||G.lst[v]),here=WORLD_LOCS.find(l=>l.lv.includes(LEVEL));
  const txtH=(s,x,y,sz,col)=>{ctx.save();ctx.font=`bold ${sz}px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=3.2;ctx.strokeStyle='rgba(238,226,190,.93)';ctx.strokeText(s,x,y);ctx.fillStyle=col;ctx.fillText(s,x,y);ctx.restore()};
  const LBL_PLACED=[]; // where the place labels already stand
  for(const l of WORLD_LOCS){
    const v=visited(l);
    ctx.globalAlpha=v?1:.8;mpWorldIco(l,l.x,l.y,z);ctx.globalAlpha=1;
    const big=l.ic==='castle'||l.ic==='town'||l.ic==='abbey'||l.ic==='orangecastle';
    {const lr=(!G.flags.autoScaleOn&&typeof locRating==='function')?locRating(l):null,ny0=l.above?l.y-22:l.y+(l.ic==='castle'||l.ic==='orangecastle'?24:l.ic==='mountains'?20:18),nsz=big?10.5:9,ncol=v?'#1c1208':'#5a4a30';
      ctx.save();ctx.font=`bold ${nsz}px ${FUI}`;const w1=ctx.measureText(l.n).width;ctx.font=`bold 8px ${FUI}`;const t2=lr?'Lv '+lr:'',w2=lr?ctx.measureText(t2).width:0;ctx.font=`bold 7.4px ${FUI}`;const sw=l.sub?ctx.measureText(l.sub).width:0;ctx.restore();
      const gap=lr?5:0,wt=w1+gap+w2,subY=l.above?l.y-13:l.y+(l.ic==='orangecastle'||l.ic==='castle'?35:29);
      // a label that would land on another place's label slides up or down until it is clear
      const rects=dy=>{const r=[[l.x-wt/2-2,ny0+dy-7,wt+4,14]];if(l.sub)r.push([l.x-sw/2-2,subY+dy-5,sw+4,10]);return r};
      const hit=(a,b)=>a[0]<b[0]+b[2]&&a[0]+a[2]>b[0]&&a[1]<b[1]+b[3]&&a[1]+a[3]>b[1];
      let ldy=0;for(const dy of [0,11,-11,22,-22,33,-33]){const rs=rects(dy);if(!rs.some(r=>LBL_PLACED.some(q=>hit(r,q)))){ldy=dy;break}}
      for(const r of rects(ldy))LBL_PLACED.push(r);
      const ny=ny0+ldy,xs=l.x-wt/2;
      if(lr){txtH(l.n,xs+w1/2,ny,nsz,ncol);txtH(t2,xs+w1+gap+w2/2,ny,8,'#7a1a10')}else txtH(l.n,l.x,ny,nsz,ncol);
      if(l.sub)txtH(l.sub,l.x,subY+ldy,7.4,'#4a3a22')}
    const nq=QLEFT[l.k]||0;
    if(nq){ctx.fillStyle='#b02818';ctx.strokeStyle='rgba(42,26,12,.7)';ctx.lineWidth=.35;const left=l.k==='scoria'; // Khemetra's dots stand to the left of the city: below it is the Red Dunes
      for(let i=0;i<nq;i++){const row=(i/14)|0,inRow=Math.min(14,nq-row*14),col=i%14;ctx.beginPath();if(left)ctx.arc(l.x-34-(inRow-1-col)*3.4,l.y-10+row*3.4,1.15,0,TAU);else ctx.arc(l.x+(col-(inRow-1)/2)*3.4,l.y+(l.sub?38:29)+row*3.4,1.15,0,TAU);ctx.fill();ctx.stroke()}}
  }
  // you are here: a pulsing ring and a red pin with a gold rim
  if(here){const pulse=.5+.5*Math.sin(G.time*4);ctx.strokeStyle=`rgba(150,30,20,${.55+.4*pulse})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(here.x,here.y,17+pulse*3,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(224,176,32,.8)';ctx.lineWidth=.9;ctx.beginPath();ctx.arc(here.x,here.y,20+pulse*3,0,TAU);ctx.stroke();
    ctx.fillStyle='rgba(150,30,20,.95)';ctx.strokeStyle=MPL.GOLD;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(here.x,here.y-14);ctx.bezierCurveTo(here.x-7,here.y-20,here.x-6,here.y-30,here.x,here.y-30);ctx.bezierCurveTo(here.x+6,here.y-30,here.x+7,here.y-20,here.x,here.y-14);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#f6e8a0';ctx.beginPath();ctx.arc(here.x,here.y-24,2.2,0,TAU);ctx.fill()}
  if(G.qFocus&&G.qFocus.loc){const fl=WORLD_LOCS.find(zz=>zz.k===G.qFocus.loc); // the place of the quest picked in the log
    if(fl){const pu=.5+.5*Math.sin(G.time*5),pr=22+pu*4;ctx.save();ctx.lineWidth=3.2;ctx.strokeStyle='#e0b020';ctx.beginPath();ctx.arc(fl.x,fl.y,pr,0,TAU);ctx.stroke();ctx.lineWidth=1.8;ctx.strokeStyle='#b02818';ctx.beginPath();ctx.arc(fl.x,fl.y,pr*.72,0,TAU);ctx.stroke();
      ctx.font=`italic bold 9px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=3;ctx.strokeStyle='rgba(236,222,176,.95)';const ttl=(QUESTS[G.qFocus.id]||{}).title||'';ctx.strokeText(ttl,fl.x,fl.y+pr+9);ctx.fillStyle='#b02818';ctx.fillText(ttl,fl.x,fl.y+pr+9);ctx.restore()}}
  // woken teleporters: a small glowing stone by each place that has one
  const awake=WORLD_LOCS.filter(l=>teleLevelsAt(l).length);
  for(const l of awake){const mx=l.x+17,my=l.y-13,pl=.5+.5*Math.sin(G.time*4+l.x);ctx.fillStyle='rgba(150,210,255,'+(.25+.25*pl)+')';ctx.beginPath();ctx.arc(mx,my,9+pl*2,0,TAU);ctx.fill();ctx.fillStyle='#46506a';ctx.strokeStyle=ink;ctx.lineWidth=1.1;ctx.beginPath();ctx.ellipse(mx,my+1,6.5,3.2,0,0,TAU);ctx.fill();ctx.stroke();ctx.strokeStyle='#cfeaff';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(mx,my,3.4,0,TAU);ctx.stroke()}
  ctx.restore();
  try{mpWorldClouds(WV)}catch(e){}
  for(const l of awake){const sx=240+WV.x+(l.x+17-240)*WV.z,sy=160+WV.y+(l.y-13-160)*WV.z,r=Math.max(10,12*WV.z);btn('wtp_'+l.k,sx-r,sy-r,r*2,r*2)}
  // the frame, vignette, title and compass; then the key
  ctx.drawImage(M.over,0,0,DW,DH);
  mpWorldKey();
  ctx.restore();
  if(G.teleMode||awake.length){const hm=teleOn()?'Tap a glowing stone to travel there.':'Woken teleporters glow on the map. Stand on one to travel.';ctx.save();ctx.font=`bold 9px ${FUI}`;const hw=ctx.measureText(hm).width+16;ctx.fillStyle='rgba(238,226,190,.82)';rrect(ctx,240-hw/2,55,hw,14,6);ctx.fill();ctx.strokeStyle=MPL.GOLD;ctx.lineWidth=.8;ctx.stroke();ctx.restore();txt(hm,240,62,9,'#2a1c0e','center',true)}
  if(G.wnote&&G.time-G.wnote.t<4)txt(G.wnote.text,240,74,9,'#7a1a10','center',true);
  btnText('worldback','Level map',34,278,100,22);btnText('ovexit','Exit',346,278,100,22);
  btnText('wzin','+',196,278,26,22);btnText('wzout','-',226,278,26,22);btnText('wreset','Fit',256,278,44,22);
  txt(Math.round(WV.z*100)+'%',322,290,8,'#d8c88e','center');
}
const mpWorldOld=drawWorldMap;
drawWorldMap=function(){if(mpWorldM.dead)return mpWorldOld.apply(this,arguments);try{mpWorldDraw()}catch(e){console.error('world map failed',e);mpWorldM.dead=true;try{ctx.restore();ctx.restore();ctx.restore()}catch(e2){}return mpWorldOld.apply(this,arguments)}};

/* ---------- clouds: hand-drawn map clouds that drift slowly across the map. Dragging the map sends them away faster than the land, and new ones drift in from the opposite edge. ---------- */
const mpWorldCl={list:[],spr:null,t:0,px:null,py:null,pz:null};
function mpWorldCloudSprites(){
  const out=[];
  for(let v=0;v<6;v++){
    const W=300,Hh=150,c=document.createElement('canvas');c.width=W;c.height=Hh;const x=c.getContext('2d'),H=hash2;
    const n=5+(v%3),puffs=[];for(let i=0;i<n;i++){const u=(i+.5)/n,px=W*(.14+.72*u)+(H(i,v,81)-.5)*14,rr=(Hh*.2+Hh*.16*Math.sin(u*Math.PI)+H(i,v,82)*9),py=Hh*.66-Math.sin(u*Math.PI)*Hh*.2-H(i,v,83)*8;puffs.push([px,py,rr])}
    x.lineJoin='round';x.lineCap='round';
    // the outline: every puff in thick ink, then every puff filled a little smaller, so only the outer edge of the cloud is inked
    x.strokeStyle='#5a4228';x.lineWidth=3.2;for(const [px,py,rr] of puffs){x.beginPath();x.arc(px,py,rr,0,Math.PI*2);x.stroke()}
    x.fillStyle='#f4eed8';for(const [px,py,rr] of puffs){x.beginPath();x.arc(px,py,rr-1.4,0,Math.PI*2);x.fill()}
    // a soft shade along the underside, curls inside the puffs, and a few hatch strokes below
    x.fillStyle='rgba(120,100,70,.16)';for(const [px,py,rr] of puffs){x.beginPath();x.ellipse(px,py+rr*.38,rr*.8,rr*.5,0,0,Math.PI);x.fill()}
    x.strokeStyle='rgba(90,66,40,.55)';x.lineWidth=1.6;for(let i=0;i<puffs.length;i+=1){const [px,py,rr]=puffs[i];if(H(i,v,84)<.7){x.beginPath();x.arc(px+rr*.1,py-rr*.12,rr*.5,Math.PI*1.05,Math.PI*1.75);x.stroke();x.beginPath();x.arc(px+rr*.1,py-rr*.12,rr*.28,Math.PI*1.1,Math.PI*1.7);x.stroke()}}
    x.strokeStyle='rgba(90,66,40,.5)';x.lineWidth=1.5;for(let k=0;k<4;k++){const yy=Hh*.9+k*5-2,xx=W*(.28+.1*k+(H(k,v,85)-.5)*.1),ln=W*(.14+.1*H(k,v,86));x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+ln,yy);x.stroke()}
    out.push(c)}
  return out}
function mpWorldClouds(WV){
  const S=mpWorldCl,now=performance.now()/1000,dt=Math.min(.1,S.t?now-S.t:0);S.t=now;
  if(!S.spr)S.spr=mpWorldCloudSprites();
  const H=hash2,X0=-130,X1=610,Y0=-90,Y1=410,spawn=(side,k)=>{ // a new cloud, entering from one edge
    const v=(Math.random()*6)|0,sc=.5+Math.random()*.7,w=300*sc*.62,h=150*sc*.62,c={v,sc,w,h,vx:3+Math.random()*3.5,vy:(Math.random()-.5)*1.6,a:.55+Math.random()*.2,ph:Math.random()*6};
    if(side==='l'){c.x=X0+Math.random()*30;c.y=Y0+Math.random()*(Y1-Y0)}else if(side==='r'){c.x=X1-Math.random()*30;c.y=Y0+Math.random()*(Y1-Y0)}else if(side==='t'){c.x=X0+Math.random()*(X1-X0);c.y=Y0+Math.random()*30}else{c.x=X0+Math.random()*(X1-X0);c.y=Y1-Math.random()*30}
    if(k){c.x=X0+Math.random()*(X1-X0);c.y=Y0+Math.random()*(Y1-Y0)}return c};
  if(!S.list.length)for(let i=0;i<15;i++)S.list.push(spawn('l',true));
  // how far the map was dragged (or zoomed) since the last frame: the clouds, being higher up, move with it and then some
  let dx=0,dy=0;if(S.px!==null&&S.pz===WV.z&&dt>0){dx=WV.x-S.px;dy=WV.y-S.py;if(Math.abs(dx)>300||Math.abs(dy)>300){dx=0;dy=0}}else if(S.pz!==null&&S.pz!==WV.z){dx=(WV.x-S.px)*.5;dy=(WV.y-S.py)*.5}
  S.px=WV.x;S.py=WV.y;S.pz=WV.z;
  const wind=.12+.14*Math.sin(now*.02);
  const arrive=Math.hypot(dx,dy)>.4?(Math.abs(dx)>Math.abs(dy)?(dx>0?'l':'r'):(dy>0?'t':'b')):'l';
  for(let i=0;i<S.list.length;i++){const c=S.list[i];
    c.x+=Math.cos(wind)*c.vx*dt+dx*1.8;c.y+=(Math.sin(wind)*c.vx+c.vy)*dt+dy*1.8;
    if(c.x<X0-80||c.x>X1+80||c.y<Y0-60||c.y>Y1+60){S.list[i]=spawn(c.x>X1?'l':c.x<X0?'r':c.y>Y1?'t':'b',false);if(arrive!=='l'&&Math.random()<.7)S.list[i]=spawn(arrive,false)}}
  // the soft shadows on the land, then the clouds
  ctx.save();
  for(const c of S.list){const zz=.75+.35*WV.z,w=c.w*zz,h=c.h*zz,e=Math.min(1,Math.max(0,Math.min(c.x+60-14,466+60-c.x,c.y+40-14,306+40-c.y)/70));if(e<=0)continue;
    ctx.globalAlpha=e*.16;ctx.fillStyle='#3a2a14';ctx.beginPath();ctx.ellipse(c.x+w*.12+10,c.y+h*.5+16,w*.42,h*.2,0,0,Math.PI*2);ctx.fill()}
  for(const c of S.list){const zz=.75+.35*WV.z,w=c.w*zz,h=c.h*zz,e=Math.min(1,Math.max(0,Math.min(c.x+60-14,466+60-c.x,c.y+40-14,306+40-c.y)/70));if(e<=0)continue;
    ctx.globalAlpha=e*c.a;ctx.drawImage(S.spr[c.v],c.x-w/2,c.y-h*.6,w,h)}
  ctx.restore()}
