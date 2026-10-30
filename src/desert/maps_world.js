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
const mpWorldGb=(y,y0,s,h)=>h*Math.exp(-((y-y0)*(y-y0))/(2*s*s));                              // a headland (positive h) or a bay (negative h) on a coast
const mpWorldRc=(u,R)=>u>=R?0:u<=0?R:R-Math.sqrt(Math.max(0,R*R-(R-u)*(R-u)));                  // a rounded corner of radius R: how far the shore stands back at distance u from the corner
/* the three shores of the Narrow Sea: a ragged coast with headlands that jut out, bays and inlets, and rounded corners (no right angles). Every shore only ever moves OUT into the sea from the old straight line (never back into the land), so the towns on the shore and the islands in the sea keep their places. */
const mpWorldCxo=y=>714+10*Math.sin(y*.045)+6*Math.sin(y*.13+1)-8*mpWorldSm((y-190)/20)                // the west shore of the Narrow Sea
  +Math.max(0,16+9*Math.sin(y*.031+.7)+6*Math.sin(y*.083+2.2)+3*Math.sin(y*.19+.4)+mpWorldGb(y,-75,9,62)+mpWorldGb(y,-5,10,-14)+mpWorldGb(y,250,10,74)+mpWorldGb(y,315,8,52)+mpWorldGb(y,205,9,-14))
  +mpWorldRc(y+150,70);
const mpWorldCxe=y=>1140+8*Math.sin(y*.04+2)+5*Math.sin(y*.11)                                           // the east shore
  -Math.max(0,18+9*Math.sin(y*.027+1.4)+6*Math.sin(y*.071+.3)+3*Math.sin(y*.17+2.8)+mpWorldGb(y,-60,10,84)+mpWorldGb(y,0,9,-14)+mpWorldGb(y,60,9,50)+mpWorldGb(y,110,10,-20)+mpWorldGb(y,160,11,96)+mpWorldGb(y,215,9,-16)+mpWorldGb(y,265,10,70))
  -mpWorldRc(y+150,70);
const mpWorldNs=x=>-150-7*Math.sin(x*.05)-4*Math.sin(x*.17)                                             // the north shore, where the two lands join
  +Math.max(0,14+8*Math.sin(x*.029+.2)+5*Math.sin(x*.078+1.9)+3*Math.sin(x*.21+.9)+mpWorldGb(x,800,8,52)+mpWorldGb(x,855,9,-12)+mpWorldGb(x,905,10,76)+mpWorldGb(x,960,9,-12)+mpWorldGb(x,1015,9,56))
  +mpWorldRc(x-714,70)+mpWorldRc(1140-x,70);
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
  WMN.lay=null; // every place and name is laid out afresh (maps_world_new.js), and the scenery keeps clear of them
  // the land: one big polygon (the western land, the northern land that joins it to the Eastern Lands). The sea is everything else.
  const west=y=>-1060+9*Math.sin(y*.03)+6*Math.sin(y*.09+2)+4*Math.sin(y*.21),south=x=>352+9*Math.sin(x*.04)+5*Math.sin(x*.13)+3*Math.sin(x*.29);
  const P=[[-1500,-900]],C=[];let n=0;const jt=()=>(H(n++,3,41)-.5)*1.7,add=(x,y)=>{const q=[x+jt(),y+jt()];P.push(q);C.push(q)};
  for(let y=-700;y<=352;y+=7)add(west(y),y);
  for(let x=-1060;x<=700;x+=9)add(x,south(x));
  for(let y=352;y>=-150;y-=3)add(mpWorldCxo(y),y);
  for(let x=mpWorldCxo(-150)+4;x<mpWorldCxe(-150);x+=4)add(x,mpWorldNs(x));
  for(let y=-150;y<=640;y+=3)add(mpWorldCxe(y),y);
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
  M.rv=[];M.lakes=[]; // the rivers are made once the roads are known (wmnMakeRivers, maps_world_rivers.js); no lakes
  // roads: the old road list, as inked ribbons; a ferry across the sea; the pilgrim's way round the north; the road east
  const rd=[];let sd=1;
  const road=(keys,style)=>{const pts=keys.map(k=>[by[k].x,by[k].y]);rd.push({pts:mpWorldRoute(pts,sd++,style==='track'?2.5:3.5),style})};
  for(const r of WORLD_ROADS){if(r[0]==='oldhaven'&&r[1]==='yarrim')continue;road(r,(r[0]==='abbey'&&r[1]==='below')||(r[0]==='below')?'track':'road')}
  rd.push({pts:mpWorldRoute([[402,238],[450,232],[486,220],[484,158],[486,96],[480,58]],91,3),style:'road'});
  const O=by.oldhaven,Y=by.yarrim,MO=by.monastery;
  rd.push({pts:mpWorldRoute([[O.x,O.y-14],[1160,110],[mpWorldCxe(40)+14,40],[mpWorldCxe(-40)+14,-40],[1132,-110],[1090,-160],[1030,-190],[982,-194],[MO.x+8,MO.y+2],[870,-182],[800,-176],[mpWorldCxo(-150)-14,-158],[mpWorldCxo(-90)-16,-90],[mpWorldCxo(-30)-16,-30],[mpWorldCxo(20)-16,20],[Y.x+10,Y.y-10]],95,3),style:'pilgrim'});
  M.rd=rd;
  M.ferry=mpWorldRoute([[O.x-10,O.y],[1030,150],[900,128],[790,96],[Y.x+14,Y.y+6]],97,2);
  wmnMakeRivers();
  // things that scenery keeps clear of
  const av=new Map(),ap=(x,y)=>{const k=Math.floor(x/10)*10007+Math.floor(y/10);let l=av.get(k);if(!l)av.set(k,l=[]);l.push([x,y])};
  const dense=(pts)=>{for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),m=Math.max(1,Math.ceil(L/3));for(let k=0;k<m;k++)ap(a[0]+(b[0]-a[0])*k/m,a[1]+(b[1]-a[1])*k/m)}};
  rd.forEach(r=>dense(r.pts));for(const q of (M.rvAvoid||[]))ap(q[0],q[1]);
  const nearLine=(x,y,d)=>{const gx=Math.floor(x/10),gy=Math.floor(y/10),m=Math.ceil(d/10);for(let a=-m;a<=m;a++)for(let b=-m;b<=m;b++){const l=av.get((gx+a)*10007+gy+b);if(l)for(const q of l){if(Math.hypot(q[0]-x,q[1]-y)<d)return true}}return false};
  const regionLab=[[-300,64,80,14],[-760,100,80,14],[-560,250,70,14],[210,16,64,12],[652,16,70,12],[476,-10,80,14],[-6,208,56,13],[1230,18,70,12],[930,-138,130,7],[530,264,50,5]];
  const blocked=(x,y,d)=>{
    if(wmnBlocked(x,y,d))return true;
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
  const c=document.createElement('canvas');c.width=DW*2;c.height=DH*2;const x=c.getContext('2d');x.scale(2,2);wmnParchment(x);
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

/* ---------- places and scenery: the painted pictures are drawn by maps_world_new.js ---------- */
function mpWorldItem(c,it,z){wmnItem(c,it,z)}
function mpWorldIco(l,x,y,z){wmnIco(l)}

/* the key (live, in screen space) */
function mpWorldKey(){
  const c=ctx,x0=338,y0=204,w=124,h=70;c.save();c.fillStyle='rgba(238,226,190,.9)';c.fillRect(x0,y0,w,h);c.restore();mplPanel(c,x0,y0,w,h);
  const rows=wmnKeyRows(c);
  rows.forEach((r,i)=>{const col=i%2,row=(i/2)|0,xx=x0+9+col*60,yy=y0+8+row*10.4;r[1](xx,yy);mplText(c,r[0],xx+9,yy,6,'#3a2a1c','left')})}

/* ---------- the world, drawn live ---------- */
function mpWorldTerrain(V,z){
  const c=ctx,M=mpWorldM,H=hash2;
  // washes of colour on the land
  c.save();c.clip(M.landP);
  const WS=[[-420,100,260,150,'120,150,84',.3],[-760,120,260,160,'104,140,76',.28],[-560,-110,260,70,'130,140,130',.24],[-600,280,240,50,'150,150,100',.22],[60,160,150,110,'120,150,84',.34],[210,230,100,70,'96,134,70',.3],[330,200,110,100,'140,160,90',.26],[116,222,60,44,'70,110,64',.34],[324,136,44,28,'140,100,130',.3],[-6,284,76,56,'50,70,60',.5],[-6,254,40,30,'200,120,50',.3],[250,70,150,60,'150,150,140',.24],
    [480,215,46,46,'216,184,110',.4],[486,96,44,50,'200,110,70',.42],[566,190,50,44,'110,150,196',.42],[572,128,50,40,'226,226,226',.5],[566,66,52,38,'160,150,130',.4],[652,160,60,60,'226,176,60',.46],[652,230,60,52,'150,100,180',.4],[480,34,54,36,'226,176,60',.34],[590,262,120,40,'216,184,110',.3],
    [1244,190,70,56,'90,130,70',.34],[1350,200,160,170,'110,150,80',.22],[1380,420,160,100,'100,140,76',.2],[930,-210,150,70,'120,130,140',.3],[1040,-240,100,40,'60,100,70',.26],[420,186,40,36,'80,130,70',.3],[560,-170,160,50,'130,140,130',.2],[1165,50,30,50,'90,130,70',.2]];
  const KW=1.5;
  for(const [cx,cy,rx,ry,col,a0] of WS){const a=Math.min(.85,a0*KW);if(cx+rx<V.x0||cx-rx>V.x1||cy+ry<V.y0||cy-ry>V.y1)continue;c.save();c.translate(cx,cy);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(.6,`rgba(${col},${a*.55})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(-rx,-rx,rx*2,rx*2);c.restore()}
  wmnWash(V,z);wmnHollow(V,z);
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
  // rivers and lakes (painted)
  wmnRivers(V,z);
  // grass tufts, heather and pebbles
  if(z>.85){c.beginPath();for(const t of M.tuf){if(t[0]<V.x0||t[0]>V.x1||t[1]<V.y0||t[1]>V.y1)continue;const a=t[0],b=t[1];c.moveTo(a-1.3,b);c.lineTo(a-.4,b-2.4);c.moveTo(a,b);c.lineTo(a,b-2.8);c.moveTo(a+1.3,b);c.lineTo(a+.5,b-2.2)}c.strokeStyle='rgba(60,90,50,.7)';c.lineWidth=mpWorldLw(.5);c.stroke()}
  c.beginPath();for(const t of M.hea){if(t[0]<V.x0||t[0]>V.x1||t[1]<V.y0||t[1]>V.y1)continue;const a=t[0],b=t[1];c.moveTo(a,b);c.lineTo(a-1.6,b-3.6);c.moveTo(a,b);c.lineTo(a+1.6,b-3.6);c.moveTo(a,b);c.lineTo(a,b-4.4)}c.strokeStyle='#5a5a40';c.lineWidth=mpWorldLw(.55);c.stroke();
  c.fillStyle='rgba(138,90,138,.8)';for(const t of M.hea){if(t[0]<V.x0||t[0]>V.x1||t[1]<V.y0||t[1]>V.y1||t[2]%3)continue;c.fillRect(t[0]-.6,t[1]-5,1.2,1.2)}
  c.fillStyle='rgba(90,70,50,.6)';for(const p of M.peb){if(p[0]<V.x0||p[0]>V.x1||p[1]<V.y0||p[1]>V.y1)continue;c.fillRect(p[0],p[1],.8+p[2]*.9,.6+p[2]*.6)}
  // roads: dirt paths
  wmnRoads(V,z);wmnBridges(V,z);
}
function mpWorldNames(V,z){
  const c=ctx,fx=(s,x,y,sz,col,sp)=>{const rg=(typeof WMN_REG!=='undefined')&&WMN_REG.find(q=>q[0]===s);if(rg){x=rg[1];y=rg[2]}c.save();c.font=`${sz}px ${FTITLE}`;if('letterSpacing' in c)c.letterSpacing=(sp||1)+'px';c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=3.4;c.strokeStyle='rgba(236,222,176,.7)';c.strokeText(s,x,y);c.fillStyle=col;c.fillText(s,x,y);c.restore()},
    sea=(s,x,y,sz,col)=>{c.save();c.font=`italic ${sz}px ${FUI}`;if('letterSpacing' in c)c.letterSpacing='3px';c.textAlign='center';c.textBaseline='middle';c.fillStyle=col;c.fillText(s,x,y);c.restore()};
  const ink='rgba(50,36,18,.78)';   // names only: no notes under them (the one small line, Below the Abbey, is drawn by wmnSmallWords)
  fx('The Unknown Lands',476,-16,19,ink,1.5);
  fx('The Known Lands',196,12,19,ink,1.5);
  fx('The Sea Lands',652,16,19,ink,1.5);
  fx('The Hollow Lands',-60,150,16,ink,1);wmnSmallWords();
  fx('The Western Reaches',-300,64,19,ink,1.5);
  fx('The Far West',-760,100,19,ink,1.5);
  fx('The Grey Downs',-575,176,15,ink,1);
  fx('The Eastern Lands',1230,16,19,ink,1.5);
  sea('The Narrow Sea',836,-4,21,'rgba(26,48,84,.78)');
  sea('The Western Deep',-1215,110,16,'rgba(26,48,84,.7)');sea('The Southern Sea',380,450,17,'rgba(26,48,84,.7)');
}
function mpWorldCreatures(V,z){wmnCreatures(V,z)}

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
  const visited=l=>l.lv.some(v=>v===LEVEL||G.lst[v]),here=WORLD_LOCS.find(l=>l.lv.includes(LEVEL))||mpWorldHereUp(LEVEL);
  const txtH=(s,x,y,sz,col)=>{ctx.save();ctx.font=`bold ${sz}px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=3.2;ctx.strokeStyle='rgba(238,226,190,.93)';ctx.strokeText(s,x,y);ctx.fillStyle=col;ctx.fillText(s,x,y);ctx.restore()};
  const LBL_PLACED=[]; // where the place labels already stand
  for(const l of WORLD_LOCS){
    const v=visited(l);
    mpWorldIco(l,l.x,l.y,z);
    const big=l.ic==='castle'||l.ic==='town'||l.ic==='abbey'||l.ic==='orangecastle';
    wmnLabel(l,v,txtH);
    const nq=QLEFT[l.k]||0;
    if(nq){ctx.fillStyle='#b02818';ctx.strokeStyle='rgba(42,26,12,.7)';ctx.lineWidth=.35;wmnDots(l,nq,ctx)}
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
/* the kinds of cloud: [name, width, height, how it is built, size range, share of the sky] */
const MPW_CK=[['plain',420,210,'heap',[.42,.62],24],['small',200,200,'small',[.4,.62],20],['thin',540,110,'thin',[.5,.75],18],['tower',460,470,'tower',[.5,.7],10],['wisp',440,120,'wisp',[.5,.75],14],['twin',400,200,'twin',[.48,.7],8],['pair',290,150,'pair',[.38,.58],6]];
function mpWorldCloudSprites(){
  // puffy cumulus in the manner of old chart-makers: a heap of round puffs with a scalloped base, curling spirals in the billows, cross-hatched shade, stipple and a white highlight
  const out=[];
  MPW_CK.forEach(([nm,W,Hh,kind],v)=>{
    const c=document.createElement('canvas');c.width=W;c.height=Hh;const x=c.getContext('2d'),H=hash2,puffs=[],base=Hh*(kind==='tower'?.9:kind==='thin'?.7:kind==='small'?.82:.78);
    const row=(n,x0,x1,rBase,rVar,lift,k,seed,hump)=>{for(let q=0;q<n;q++){const u=(q+.5)/n,s=hump?Math.sin(u*Math.PI):1,rv=.45+1.15*Math.pow(H(q,v,seed+3),1.3),r=Hh*(rBase+rVar*s)*rv+H(q,v,seed)*3;puffs.push([W*(x0+(x1-x0)*u)+(H(q,v,seed+1)-.5)*16,base-r*.8-lift-s*Hh*(hump||0)-H(q,v,seed+2)*9,r,k])}};
    const scallops=(n,x0,x1,r)=>{for(let q=0;q<n;q++){const u=n>1?q/(n-1):.5;puffs.push([W*(x0+(x1-x0)*u)+(H(q,v,97)-.5)*9,base-Hh*.055,Hh*r*(.55+1.1*H(q,v,98)),2])}};
    if(kind==='heap'){row(8+(v%2),.1,.9,.13,.11,0,0,91,.07);row(6,.17,.83,.09,.08,Hh*.2,1,94,.1);scallops(11,.1,.9,.06)}
    else if(kind==='small'){row(3,.3,.7,.15,.1,0,0,91,.06);row(2,.4,.6,.1,.06,Hh*.13,1,94,.06);scallops(5,.32,.68,.06)}
    else if(kind==='thin'){row(24,.05,.95,.15,.06,0,0,91,.04);scallops(22,.08,.92,.06)}
    else if(kind==='tower'){row(7,.14,.86,.09,.09,0,0,91,.05);row(6,.2,.8,.09,.08,Hh*.15,1,94,.08);row(5,.26,.74,.08,.07,Hh*.3,1,191,.1);row(3,.36,.64,.07,.05,Hh*.44,1,294,.06);scallops(10,.14,.86,.045)}
    else if(kind==='twin'){row(4,.06,.46,.14,.13,0,0,91,.08);row(4,.54,.94,.12,.12,0,0,191,.1);row(5,.4,.62,.07,.06,0,1,94,.05);row(2,.12,.38,.09,.06,Hh*.22,1,294,.05);scallops(11,.06,.94,.055)}
    else if(kind==='pair'){row(3,.12,.42,.14,.1,0,0,91,.06);row(3,.58,.88,.16,.1,Hh*.05,0,191,.06);scallops(3,.16,.38,.05);scallops(3,.62,.84,.05)}
    const df=kind==='tower'?2.2:(kind==='plain'||kind==='twin')?1.1:kind==='thin'?.5:.7;
    {let sd=300;for(const [px,py,rr,k] of puffs.slice()){if(k>=2||rr<10)continue;sd++;const nb=Math.round(1.4*df*H(1,sd,3)+df*.8);
      for(let j=0;j<nb;j++){const a2=Math.PI*(1.0+1.0*H(j,sd,4)),br=rr*(.16+.16*H(j,sd,5)),bx=px+Math.cos(a2)*rr*.95,by=py+Math.sin(a2)*rr*.95;if(puffs.some(o=>o[0]!==px&&Math.hypot(o[0]-bx,o[1]-by)<o[2]-1))continue;puffs.push([bx,by,br,3])}}} // small billows on the outline, part of the same silhouette
    puffs.sort((a,b)=>a[3]-b[3]);
    x.lineJoin='round';x.lineCap='round';
    if(kind==='wisp'){ // thin streaks of high cloud, each ending in a curl, with a few short hatch ticks
      x.strokeStyle='#4e3a22';
      for(let k=0;k<4;k++){const y0=Hh*(.2+.18*k),xa=W*(.05+.12*H(k,v,30)),xb=W*(.62+.3*H(k,v,31)),amp=Hh*(.05+.05*H(k,v,32)),cr=Hh*(.06+.05*H(k,v,33));
        x.lineWidth=2.6-k*.25;x.beginPath();x.moveTo(xa,y0);x.bezierCurveTo(xa+(xb-xa)*.3,y0-amp,xa+(xb-xa)*.65,y0+amp,xb,y0);
        for(let a=0;a<Math.PI*3.2;a+=.18){const rad=cr*(1-a/(Math.PI*3.5));x.lineTo(xb+Math.sin(a)*rad*1.1,y0+cr-Math.cos(a)*rad)}x.stroke();
        x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=1;x.beginPath();x.moveTo(xa+8,y0+3);x.bezierCurveTo(xa+(xb-xa)*.3,y0-amp+3,xa+(xb-xa)*.65,y0+amp+3,xb-8,y0+3);x.stroke();x.strokeStyle='#4e3a22';
        x.lineWidth=1;for(let q=0;q<5;q++){const tx=xa+(xb-xa)*(.2+.14*q);x.beginPath();x.moveTo(tx,y0+5);x.lineTo(tx+4,y0+11);x.stroke()}}
      out.push(c);return}
    x.strokeStyle='#4e3a22';x.lineWidth=3.6;for(const [px,py,rr] of puffs){x.beginPath();x.arc(px,py,rr,0,Math.PI*2);x.stroke()}
    const g=x.createLinearGradient(0,Hh*.05,0,Hh*.9);g.addColorStop(0,'#fdfaf0');g.addColorStop(.55,'#f1ead3');g.addColorStop(1,'#cfc7ad');
    x.fillStyle=g;for(const [px,py,rr] of puffs){x.beginPath();x.arc(px,py,rr-1.6,0,Math.PI*2);x.fill()}
    // each billow: a crescent of cross-hatching on its lower right, a lighter patch on its sunny side, a white highlight on its upper left
    for(const [px,py,rr,k] of puffs){if(k>=2||rr<9)continue;
      x.save();x.beginPath();x.arc(px,py,rr-2,0,Math.PI*2);x.clip();
      x.strokeStyle='rgba(84,62,38,.42)';x.lineWidth=1.05;
      for(let h=-rr;h<rr*1.6;h+=4.2){x.beginPath();x.moveTo(px+rr*.15+h*.6,py+rr*.9);x.lineTo(px+rr*.15+h*.6+rr*.7,py+rr*.9-rr*.9);x.stroke()}
      const sg=x.createRadialGradient(px-rr*.3,py-rr*.35,rr*.05,px-rr*.3,py-rr*.35,rr*1.05);sg.addColorStop(0,'rgba(253,250,240,1)');sg.addColorStop(.7,'rgba(246,240,222,.96)');sg.addColorStop(1,'rgba(246,240,222,0)');x.fillStyle=sg;x.fillRect(px-rr,py-rr,rr*2,rr*2);x.restore();
      x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=2.2;x.beginPath();x.arc(px,py,rr*.78,Math.PI*1.08,Math.PI*1.42);x.stroke()}
    // more hand-work, most of all on the big clouds: brow lines inside each billow, small extra bumps on the outline, stipple in the shade and cross-hatching low down
    {let sd=300;
     for(const [px,py,rr,k] of puffs.slice()){if(k>=2||rr<10)continue;sd++;
      x.save();x.beginPath();x.arc(px,py,rr-2,0,Math.PI*2);x.clip();
      x.strokeStyle='rgba(78,58,34,.5)';x.lineWidth=1.1;
      for(let b=0;b<Math.ceil(df);b++){x.beginPath();x.arc(px+rr*.04*b,py+rr*.04*b,rr*(.86-.15*b),Math.PI*(1.04+.06*b),Math.PI*(1.52-.05*b));x.stroke()}
      x.fillStyle='rgba(78,58,34,.55)';const nd=Math.round(rr*.5*df);for(let d=0;d<nd;d++){const a2=H(d,sd,1)*Math.PI*.9-.1,rd=rr*(.35+.55*H(d,sd,2));x.beginPath();x.arc(px+Math.cos(a2)*rd,py+Math.sin(a2)*rd,.9,0,Math.PI*2);x.fill()}
      if(df>1.5&&py>base-Hh*.5){x.strokeStyle='rgba(84,62,38,.3)';x.lineWidth=.9;for(let h2=-rr;h2<rr*1.6;h2+=5){x.beginPath();x.moveTo(px-rr*.1+h2*.6,py+rr*.9);x.lineTo(px-rr*.1+h2*.6-rr*.7,py+rr*.9-rr*.9);x.stroke()}}
      x.restore();
      }}
    // spiral curls in a few of the big billows
    x.strokeStyle='rgba(78,58,34,.78)';x.lineWidth=1.5;
    const spirals=puffs.filter(q=>(q[3]===0&&q[2]>Hh*.12)),every=kind==='tower'?2:3;
    if(kind!=='thin')spirals.forEach((q,i)=>{if(i%every!==v%every)return;const [px,py,rr]=q,cx=px+rr*.12,cy=py+rr*.05,dir=i%2?1:-1;x.beginPath();for(let a=0;a<Math.PI*3.4;a+=.16){const rad=rr*.06+a*rr*.075,xx=cx+Math.cos(a*dir+i)*rad,yy=cy+Math.sin(a*dir+i)*rad;a?x.lineTo(xx,yy):x.moveTo(xx,yy)}x.stroke()});
    // stipple under the base, and wavy wind-lines drifting off it
    x.fillStyle='rgba(78,58,34,.6)';for(let i=0;i<Math.round(W/16);i++){x.beginPath();x.arc(W*(.14+.72*H(i,v,100)),base+Hh*(.02+.1*H(i,v,101)),1.1,0,Math.PI*2);x.fill()}
    x.strokeStyle='rgba(78,58,34,.55)';x.lineWidth=1.5;for(let k=0;k<3;k++){const yy=base+Hh*(.1+.05*k),xx=W*(.22+.12*k+(H(k,v,102)-.5)*.1);x.beginPath();x.moveTo(xx,yy);x.bezierCurveTo(xx+30,yy-5,xx+60,yy+5,xx+95+k*12,yy);x.stroke()}
    out.push(c)});
  return out}
function mpWorldClouds(WV){
  const S=mpWorldCl,now=performance.now()/1000,dt=Math.min(.1,S.t?now-S.t:0);S.t=now;S.on=now;
  if(!S.spr)S.spr=mpWorldCloudSprites();
  const H=hash2,X0=-130,X1=610,Y0=-90,Y1=410,spawn=(side,k)=>{ // a new cloud, entering from one edge
    let v=0;{let r=Math.random()*100;for(let q=0;q<MPW_CK.length;q++){r-=MPW_CK[q][5];if(r<=0){v=q;break}}}const ck=MPW_CK[v],sc=ck[4][0]+Math.random()*(ck[4][1]-ck[4][0]),w=ck[1]*sc*.5,h=ck[2]*sc*.5,c={v,sc,w,h,vx:3+Math.random()*3.5,vy:(Math.random()-.5)*1.6,a:.3+Math.random()*.12,ph:Math.random()*6}; // smaller and fainter than before: the land shows through them
    if(side==='l'){c.x=X0+Math.random()*30;c.y=Y0+Math.random()*(Y1-Y0)}else if(side==='r'){c.x=X1-Math.random()*30;c.y=Y0+Math.random()*(Y1-Y0)}else if(side==='t'){c.x=X0+Math.random()*(X1-X0);c.y=Y0+Math.random()*30}else{c.x=X0+Math.random()*(X1-X0);c.y=Y1-Math.random()*30}
    if(k){c.x=X0+Math.random()*(X1-X0);c.y=Y0+Math.random()*(Y1-Y0)}return c};
  if(!S.list.length)for(let i=0;i<15;i++)S.list.push(spawn('l',true));
  // how far the map was dragged (or zoomed) since the last frame: the clouds, being higher up, move with it and then some
  let dx=0,dy=0;if(S.px!==null&&S.pz===WV.z&&dt>0){dx=WV.x-S.px;dy=WV.y-S.py;if(Math.abs(dx)>300||Math.abs(dy)>300){dx=0;dy=0}}else if(S.pz!==null&&S.pz!==WV.z){dx=(WV.x-S.px)*.5;dy=(WV.y-S.py)*.5}
  S.px=WV.x;S.py=WV.y;S.pz=WV.z;
  const wind=.12+.14*Math.sin(now*.02);
  const arrive=Math.hypot(dx,dy)>.4?(Math.abs(dx)>Math.abs(dy)?(dx>0?'l':'r'):(dy>0?'t':'b')):'l';
  for(let i=0;i<S.list.length;i++){const c=S.list[i];
    if(S.drag&&S.drag.c===c){c.lift=Math.min(1,(c.lift||0)+dt*8);continue} // a cloud held in the hand does not drift
    c.lift=Math.max(0,(c.lift||0)-dt*5);const fk=Math.pow(.35,dt);c.fx=(c.fx||0)*fk;c.fy=(c.fy||0)*fk; // a cloud let go keeps its flick, slowing back to the wind
    c.x+=(Math.cos(wind)*c.vx+c.fx)*dt+dx*1.8;c.y+=(Math.sin(wind)*c.vx+c.vy+c.fy)*dt+dy*1.8;
    if(c.x<X0-80||c.x>X1+80||c.y<Y0-60||c.y>Y1+60){S.list[i]=spawn(c.x>X1?'l':c.x<X0?'r':c.y>Y1?'t':'b',false);if(arrive!=='l'&&Math.random()<.7)S.list[i]=spawn(arrive,false)}}
  // the soft shadows on the land, then the clouds
  ctx.save();
  for(const c of S.list){const zz=.7+.25*WV.z,w=c.w*zz,h=c.h*zz,e=Math.min(1,Math.max(0,Math.min(c.x+60-14,466+60-c.x,c.y+40-14,306+40-c.y)/70));if(e<=0)continue;
    const lf=c.lift||0;ctx.globalAlpha=e*(.09-.03*lf);ctx.fillStyle='#3a2a14';ctx.beginPath();ctx.ellipse(c.x+w*.12+10+10*lf,c.y+h*.5+16+14*lf,w*.42*(1+.1*lf),h*.2*(1+.1*lf),0,0,Math.PI*2);ctx.fill()}
  for(const c of S.list){const zz=.7+.25*WV.z,w=c.w*zz,h=c.h*zz,e=Math.min(1,Math.max(0,Math.min(c.x+60-14,466+60-c.x,c.y+40-14,306+40-c.y)/70));if(e<=0)continue;
    const lf=c.lift||0,k=1+.07*lf;ctx.globalAlpha=Math.min(1,e*(c.a+.25*lf));ctx.drawImage(S.spr[c.v],c.x-w*k/2,c.y-h*.6*k-6*lf,w*k,h*k)}
  ctx.restore()}

/* ---- the clouds can be picked up and moved: press on one and drag; let go and it keeps drifting the way it was thrown ---- */
mpWorldCl.drag=null;
function mpWorldCloudAt(px,py){
  const S=mpWorldCl;if(!S.list.length||!G.overview||!G.world||performance.now()/1000-(S.on||0)>.3)return null;
  for(let i=S.list.length-1;i>=0;i--){const c=S.list[i],zz=.7+.25*(G.wv?G.wv.z:1),w=c.w*zz,h=c.h*zz;
    if(((px-c.x)/(w*.5))**2+((py-(c.y-h*.12))/(h*.36))**2<1)return c}
  return null}
cv.addEventListener('pointerdown',e=>{
  const [x,y]=toDesign(e),c=mpWorldCloudAt(x,y);if(!c||mpWorldCl.drag)return;
  mpWorldCl.drag={c,id:e.pointerId,ox:c.x-x,oy:c.y-y,pts:[[performance.now(),x,y]]};c.vx=c.vx||4;
  e.stopImmediatePropagation();e.preventDefault()},true);
addEventListener('pointermove',e=>{
  const D=mpWorldCl.drag;if(!D||e.pointerId!==D.id)return;const [x,y]=toDesign(e);D.c.x=x+D.ox;D.c.y=y+D.oy;D.pts.push([performance.now(),x,y]);if(D.pts.length>6)D.pts.shift()});
function mpWorldCloudDrop(e){
  const D=mpWorldCl.drag;if(!D||(e&&e.pointerId!==D.id))return;mpWorldCl.drag=null;
  const a=D.pts[0],b=D.pts[D.pts.length-1],dt=(b[0]-a[0])/1000;
  if(dt>.01&&dt<.4){D.c.fx=Math.max(-320,Math.min(320,(b[1]-a[1])/dt*.5));D.c.fy=Math.max(-320,Math.min(320,(b[2]-a[2])/dt*.5))}}
addEventListener('pointerup',mpWorldCloudDrop);addEventListener('pointercancel',mpWorldCloudDrop);

/* a house, a cellar or a room that is no place on the map itself: the party is in the place its way out leads to (a Khemetra house to Khemetra, its cellar to the house and so on up) */
function mpWorldHereUp(n){for(let i=0;i<4;i++){const L=LEVELS[n],p=L&&L.portals&&L.portals[0];if(!p||p.to===n)return null;n=p.to;const l=WORLD_LOCS.find(q=>q.lv.includes(n));if(l)return l}return null}
