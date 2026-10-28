/* ==========================================================================
   THE PAINTED WORLD MAP (prefix wmn / WMN). Hand-painted pictures in coloured pencil and watercolour: every place, the trees, pines, mountains, hills, dunes and palms,
   the ships and sea creatures, the dirt paths and the rivers. maps_world.js keeps the map's shape, coast, clouds, titles and behaviour and calls the functions here.
   Pictures: assets/wm_a.png (big: places, landmarks, sea creatures) and assets/wm_s.png (small: scenery), cut and packed by tools/build_wm_atlas.py;
   where each one sits is in maps_world_atlas.js (WMN_RECTS).
   Nothing on this map may overlap: wmnLayout() places every picture and every name (and its level and quest dots) once, so that no name stands on a picture,
   another name or a region title, and the scenery keeps clear of all of them.
   ========================================================================== */
const WMN={a:null,s:null,ok:false,loading:false,lay:null,layKey:'',pat:null,water:null,waterPat:null,hol:null,
  K:{oak:.115,pine:.125,mtn:.133,hill:.125,dune:.173,palm:.112},   // map units per picture pixel, per kind of scenery (times the item's own scale)
  TINT:{'#dcc088':'sand','#cf8a60':'red','#a4b8cc':'blue','#efe9da':'white','#e0b850':'gold','#a98cbb':'violet'}};
function wmnLoad(){
  if(WMN.loading||typeof WMN_RECTS==='undefined')return;WMN.loading=true;let n=0;
  for(const p of ['a','s']){const im=new Image();im.onload=()=>{WMN[p]=im;if(++n===2)WMN.ok=true};im.onerror=()=>{WMN.failed=true};im.decoding='async';
    im.src='assets/wm_'+p+'.png'+(typeof VERSION!=='undefined'?'?v='+VERSION:'')}
  {const im=new Image();im.decoding='async';im.onload=()=>{WMN.water=im};im.src='assets/wm_water.jpg'+(typeof VERSION!=='undefined'?'?v='+VERSION:'')}}
wmnLoad();   // the pictures are fetched at start-up, so the map has them the first time it is opened

/* one picture, bottom centre at (cx,by), size = height, or width when isW */
function wmnDims(name,size,isW){const r=WMN_RECTS[name];if(!r)return [0,0];return isW?[size,size*r[4]/r[3]]:[size*r[3]/r[4],size]}
const WMN_ICO_SCALE=2;   // places are drawn this much bigger than the sizes in WMN_SPEC
function wmnDraw(c,name,cx,by,size,isW,flip){
  const r=WMN_RECTS[name];if(!r||!WMN.ok)return;const im=r[0]==='a'?WMN.a:WMN.s,d=wmnDims(name,size,isW),w=d[0],h=d[1];
  if(flip){c.save();c.translate(cx,0);c.scale(-1,1);c.drawImage(im,r[1],r[2],r[3],r[4],-w/2,by-h,w,h);c.restore()}
  else c.drawImage(im,r[1],r[2],r[3],r[4],cx-w/2,by-h,w,h)}

/* ---------- the places: what picture each one has, [picture, across, down (to its bottom), size, size is the width] ---------- */
const WMN_SPEC={
  abbey:[['i_abbey',0,0,30]],thornwood:[['i_oaks',0,0,22]],thornwick:[['i_town',0,0,28]],gwood:[['i_pines',0,0,28]],gcave:[['i_cave',0,0,22]],
  road:[['l_grove',0,0,26,1],['l_storm',0,-8,26,1]],tunnel:[['i_cave',0,0,22]],ironhill:[['i_castle',0,0,40]],graves:[['i_graves',0,0,26]],mines:[['i_mine',0,0,28]],
  moor:[['l_moor',0,0,38,1]],pass:[['i_mountains',0,0,32]],greendale:[['i_oaks',0,0,28]],anaea:[['i_town',0,0,28]],
  sandroad:[],reddunes:[],bluedunes:[],whitedunes:[],flatlands:[],goldenerg:[],violeterg:[],   // the desert areas have no picture of their own: the dunes of their colour all round them, and the name
  tomb:[['i_pyramid',0,0,38,1]],scoria:[['i_desertcity',0,0,38]],yarrim:[['i_seaside',0,0,30]],saltbarrow:[['i_oaks',0,0,24]],bells:[['l_drowned',0,0,32,1]],cinder:[['l_volcano',0,0,32]],
  lastlight:[['l_lighthouse',0,0,36]],openSea:[['l_waves',0,0,36,1],['l_storm',0,-6,28,1]],oldhaven:[['i_castle',0,0,40]],oakwood:[['i_oaks',0,0,28]],monastery:[['l_monastery',0,0,34]],
  landpath:[['i_pines',0,0,26]],below:[['i_cave',0,0,20]],orangecastle:[['i_spire',0,0,42]],hollowgrass:[['i_oaks',0,0,36]],deephollow:[['i_stonemaze',0,0,34,1]],goldencrypt:[['i_crypt',0,0,28]],rubymaze:[['i_rubymaze',0,0,30,1]]};
const WMN_ICSPEC={town:'i_town',castle:'i_castle',abbey:'i_abbey',cave:'i_cave',mine:'i_mine',graves:'i_graves',crypt:'i_crypt',trees:'i_oaks',mountains:'i_mountains',orangecastle:'i_spire',rubymaze:'i_rubymaze'};
function wmnSpec(l){return WMN_SPEC[l.k]||[[WMN_ICSPEC[l.ic]||'i_oaks',0,0,l.ic==='castle'||l.ic==='orangecastle'?40:28]]}
/* the picture's footprint: its parts, how far down they are drawn, and its box (the bottom stands a little below the place's own point) */
const WMN_FOOT={i_town:.88,i_seaside:.87,i_castle:.87,i_desertcity:.87,i_cave:.87,i_mine:.85,i_graves:.9,i_crypt:.92,i_oaks:.87,i_pines:.88,i_mountains:.77};   // how far down each picture its solid part goes (the rest is the faded ground): a name may stand over that
const WMN_BOX={deephollow:[-21,-27,21,15]};   // places whose picture is drawn by another file: their box
function wmnShape(l){
  if(WMN_BOX[l.k]){const b=WMN_BOX[l.k];return {parts:[],off:0,ib:[l.x+b[0],l.y+b[1],l.x+b[2],l.y+b[3]]}}
  const s=wmnSpec(l);if(!s.length)return {parts:[],off:0,ib:[l.x,l.y-12,l.x,l.y-4]};let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const p of s){const d=wmnDims(p[0],p[3]*WMN_ICO_SCALE,p[4]);x0=Math.min(x0,p[1]*WMN_ICO_SCALE-d[0]/2);x1=Math.max(x1,p[1]*WMN_ICO_SCALE+d[0]/2);y0=Math.min(y0,p[2]*WMN_ICO_SCALE-d[1]);y1=Math.max(y1,p[2]*WMN_ICO_SCALE)}
  const off=l.y+10-y1;let fi=0;for(const p of s)if(p[2]*WMN_ICO_SCALE===y1&&WMN_FOOT[p[0]]){const d=wmnDims(p[0],p[3]*WMN_ICO_SCALE,p[4]);fi=Math.max(fi,(1-WMN_FOOT[p[0]])*d[1]*.8)}
  return {parts:s.slice().sort((a,b)=>a[2]-b[2]),off,fi,ib:[l.x+x0,y0+off,l.x+x1,y1+off]}}

/* ---------- the layout: pictures, then names ---------- */
const WMN_REG=[['The Unknown Lands',476,-16,19],['The Known Lands',196,12,19],['The Sea Lands',652,16,19],['The Hollow Lands',-60,150,16],['The Western Reaches',-300,64,19],['The Far West',-760,100,19],['The Grey Downs',-575,176,15],['The Eastern Lands',1230,16,19]];
const wmnHit=(a,b)=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];
/* spreading the places: each place, with its name under it, is a box; boxes that touch are pushed apart (a little at a time, never far from the place's own spot) until none overlap */
function wmnSpread(){
  const c=ctx,B=[],M=3,MAXD=80;
  for(const l of WORLD_LOCS){if(l._x0===undefined){l._x0=l.x;l._y0=l.y}l.x=l._x0;l.y=l._y0}
  for(const l of WORLD_LOCS){const sh=wmnShape(l),big=l.ic==='castle'||l.ic==='town'||l.ic==='abbey'||l.ic==='orangecastle',nsz=big?7.6:6.6;
    c.save();c.font=`bold ${nsz}px ${FUI}`;const w=c.measureText(l.n).width+(typeof locRating==='function'&&!G.flags.autoScaleOn?24:0);c.restore();
    const a=sh.ib[0]-l.x,b=sh.ib[1]-l.y,e=sh.ib[2]-l.x,f=sh.ib[3]-l.y,sub=l.sub?9:0;
    B.push({l,x0:Math.min(a,-w/2-2),y0:b,x1:Math.max(e,w/2+2),y1:f+12+sub+4})}
  for(let it=0;it<400;it++){let moved=false;
    for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++){const p=B[i],q=B[j];
      const ox=Math.min(p.l.x+p.x1,q.l.x+q.x1)-Math.max(p.l.x+p.x0,q.l.x+q.x0)+M,oy=Math.min(p.l.y+p.y1,q.l.y+q.y1)-Math.max(p.l.y+p.y0,q.l.y+q.y0)+M;
      if(ox<=0||oy<=0)continue;moved=true;
      if(ox<oy){const d=ox/2+.1,s=(p.l.x+(p.x0+p.x1)/2)<=(q.l.x+(q.x0+q.x1)/2)?-1:1;p.l.x+=s*d;q.l.x-=s*d}
      else{const d=oy/2+.1,s=(p.l.y+(p.y0+p.y1)/2)<=(q.l.y+(q.y0+q.y1)/2)?-1:1;p.l.y+=s*d;q.l.y-=s*d}
      for(const r of [p,q]){r.l.x=Math.max(r.l._x0-MAXD,Math.min(r.l._x0+MAXD,r.l.x));r.l.y=Math.max(r.l._y0-MAXD,Math.min(r.l._y0+MAXD,r.l.y))}}
    if(!moved)break}
  for(const l of WORLD_LOCS){l.x=Math.round(l.x*2)/2;l.y=Math.round(l.y*2)/2}}
function wmnLayout(){
  let fo=true;try{fo=!document.fonts||document.fonts.check("bold 10px 'IM Fell English SC'")}catch(e){}
  const key=(G.flags.autoScaleOn?1:0)+'|'+(fo?1:0)+'|'+WORLD_LOCS.length;if(WMN.lay&&WMN.layKey===key)return WMN.lay;
  try{wmnSpread()}catch(e){console.error('spread',e)}
  const c=ctx,out={},placed=[],info=[];
  for(const [t,x,y,sz] of WMN_REG){c.save();c.font=`${sz}px ${FTITLE}`;const w=c.measureText(t).width+t.length*1.5+6;c.restore();placed.push([x-w/2,y-sz*.7,x+w/2,y+sz*.7])}
  for(const [t,x,y,sz] of WMN_SMALL){c.save();c.font=`italic ${sz}px ${FUI}`;const w=c.measureText(t).width;c.restore();placed.push([x-w/2-2,y-sz*.7,x+w/2+2,y+sz*.7])}
  for(const l of WORLD_LOCS){const sh=wmnShape(l);const lb=[sh.ib[0],sh.ib[1],sh.ib[2],sh.ib[3]-(sh.fi||0)];out[l.k]={sh,ib:sh.ib,lb,parts:sh.parts,off:sh.off};placed.push(lb)}
  const order=WORLD_LOCS.slice().sort((a,b)=>(b.ic==='castle'||b.ic==='town'||b.ic==='abbey'||b.ic==='orangecastle'?1:0)-(a.ic==='castle'||a.ic==='town'||a.ic==='abbey'||a.ic==='orangecastle'?1:0));
  for(const l of order){
    const L=out[l.k],ib=L.lb,big=l.ic==='castle'||l.ic==='town'||l.ic==='abbey'||l.ic==='orangecastle',nsz=big?7.6:6.6;
    const lr=(!G.flags.autoScaleOn&&typeof locRating==='function')?locRating(l):null,t2=lr?'Lv '+lr:'';
    c.save();c.font=`bold ${nsz}px ${FUI}`;const w1=c.measureText(l.n).width;c.font=`bold 6px ${FUI}`;const w2=lr?c.measureText(t2).width:0;c.font=`bold 6px ${FUI}`;const sw=l.sub?c.measureText(l.sub).width:0;c.restore();
    const gap=lr?4:0,wt=w1+gap+w2,bw=Math.max(wt,sw),sub=l.sub?9:0,ym=(ib[1]+ib[3])/2;
    // the name always stands straight under its own picture, a little smaller, its top just over the bottom edge of the picture so that it is plainly attached to it
    const ny=ib[3]+nsz/2-1.5,H=12+sub+6,best={cx:l.x,ny,r:[l.x-bw/2-2,ny-6,l.x+bw/2+2,ny-6+H]};let bestA=0;
    for(const p of placed)if(p!==L.lb&&wmnHit(best.r,p))bestA++;
    placed.push(best.r);Object.assign(L,{cx:best.cx,ny:best.ny,rect:[best.r[0],best.r[1],best.r[2],best.r[1]+12+sub+6],w1,w2,gap,wt,t2,nsz,over:bestA>0});
  }
  WMN.lay=out;WMN.layKey=key;return out}
function wmnLay(l){return wmnLayout()[l.k]}
/* scenery keeps clear of every picture, name and title */
function wmnBlocked(x,y,d){const lay=wmnLayout(),m=d*.5+1.5;
  for(const k in lay){const L=lay[k],a=L.ib,r=L.rect;
    if(x>a[0]-m&&x<a[2]+m&&y>a[1]-m&&y<a[3]+m)return true;
    if(r&&x>r[0]-m&&x<r[2]+m&&y>r[1]-m&&y<r[3]-5+m)return true}
  for(const [t,rx,ry,sz] of WMN_REG)if(Math.abs(x-rx)<t.length*sz*.3+m&&Math.abs(y-ry)<sz*.7+m)return true;
  return false}

/* ---------- drawing ---------- */
function wmnIco(l){const L=wmnLay(l);if(!L)return;const K=WMN_ICO_SCALE;for(const p of L.parts)wmnDraw(ctx,p[0],l.x+p[1]*K,p[2]*K+L.off,p[3]*K,!!p[4])}
function wmnLabel(l,v,txtH){
  const L=wmnLay(l);if(!L||L.cx===undefined)return;const col=v?'#1c1208':'#5a4a30',xs=L.cx-L.wt/2;
  if(L.t2){txtH(l.n,xs+L.w1/2,L.ny,L.nsz,col);txtH(L.t2,xs+L.w1+L.gap+L.w2/2,L.ny,6,'#7a1a10')}else txtH(l.n,L.cx,L.ny,L.nsz,col);
  if(l.sub)txtH(l.sub,L.cx,L.ny+8,6,'#4a3a22')}
/* the quest dots stand in the strip left under each name */
function wmnDots(l,nq,c){const L=wmnLay(l);if(!L||!L.rect)return;
  for(let i=0;i<nq;i++){const row=(i/14)|0,inRow=Math.min(14,nq-row*14),col=i%14;c.beginPath();c.arc(L.cx+(col-(inRow-1)/2)*3.4,L.rect[3]-4+row*3.4,1.15,0,TAU);c.fill();c.stroke()}}

/* the scenery: kind 0 broad tree, 1 pine, 2 mountain, 3 hill, 4 dune, 5 palm */
function wmnItem(c,it,z){
  const t=it[0],x=it[1],y=it[2],s=it[3],sd=it[4],K=WMN.K;let n;
  if(t===0){n='oak'+(sd%11);const r=WMN_RECTS[n];wmnDraw(c,n,x,y+1,r[4]*K.oak*s,false)}
  else if(t===1){n='pine'+(sd%12);const r=WMN_RECTS[n];wmnDraw(c,n,x,y+1,r[4]*K.pine*s,false)}
  else if(t===2){n='mtn'+(sd%12);const r=WMN_RECTS[n];wmnDraw(c,n,x,y+1,r[3]*K.mtn*s,true)}
  else if(t===3){const q=sd%16;n='hill'+(q<11?q:(q-11)%8);const r=WMN_RECTS[n];wmnDraw(c,n,x,y+1,r[3]*K.hill*s,true)}
  else if(t===4){n='dune_'+(WMN.TINT[it[5]]||'sand')+(sd%8);const r=WMN_RECTS[n];wmnDraw(c,n,x,y+1,r[3]*K.dune*s,true)}
  else{n='palm'+(sd%4);const r=WMN_RECTS[n];wmnDraw(c,n,x,y+1,r[4]*K.palm*s,false)}}

/* the land: colour washes laid on thicker, and fine coloured-pencil hatching over all of it (kept one pixel thin at every zoom) */
function wmnPencil(){
  if(WMN.pat)return WMN.pat;const k=document.createElement('canvas');k.width=k.height=96;const x=k.getContext('2d');x.lineCap='round';
  const cols=['rgba(70,100,50,.2)','rgba(124,100,52,.17)','rgba(60,84,44,.15)','rgba(150,120,60,.14)'];
  for(let i=0;i<120;i++){const px=hash2(i,1,901)*96,py=hash2(i,2,901)*96,L=3+hash2(i,3,901)*6,a=-1.0+(hash2(i,4,901)-.5)*.35;x.strokeStyle=cols[i%4];x.lineWidth=.55+hash2(i,5,901)*.45;
    for(const [ox,oy] of [[0,0],[96,0],[-96,0],[0,96],[0,-96],[96,96],[-96,-96],[96,-96],[-96,96]]){x.beginPath();x.moveTo(px+ox,py+oy);x.lineTo(px+ox+Math.cos(a)*L,py+oy+Math.sin(a)*L);x.stroke()}}
  WMN.pat=ctx.createPattern(k,'repeat');return WMN.pat}
function wmnWash(V,z){
  const c=ctx,p=wmnPencil();if(p&&p.setTransform){try{p.setTransform(new DOMMatrix([1/z,0,0,1/z,0,0]))}catch(e){}}
  c.fillStyle=p;c.fillRect(V.x0,V.y0,V.x1-V.x0,V.y1-V.y0)}

/* ships and the creatures of the sea, painted */
function wmnCreatures(V,z){
  const c=ctx,t=G.time,vis=(x,y,r)=>x+r>V.x0&&x-r<V.x1&&y+r>V.y0&&y-r<V.y1,bob=(x,a)=>Math.sin(t*1.4+x*.1)*a;
  const ships=[[790,-62,1,'caravel'],[1010,34,-1,'galleon'],[1040,330,1,'caravel'],[880,432,-1,'boat'],[300,408,1,'galleon'],[560,396,-1,'caravel'],[-1150,196,1,'boat'],[-1140,-60,-1,'caravel'],[780,-20,1,'galleon']];
  for(const [x,y,d,k] of ships)if(vis(x,y,30))wmnDraw(c,'c_'+k,x,y+bob(x,.7),k==='galleon'?28:k==='boat'?20:25,true,d>0);
  if(vis(-1160,84,50))wmnDraw(c,'c_serpent',-1160,84+bob(-1160,.5),36,true,false);
  if(vis(450,432,50))wmnDraw(c,'c_serpent',450,432+bob(450,.5),36,true,true);
  if(vis(690,440,40))wmnDraw(c,'c_kraken',690,440+bob(690,.6),32,true,false);
  if(vis(1040,228,40))wmnDraw(c,'c_whale',1040,228+bob(1040,.5),36,true,true);
  for(const [x,y,k,w,f] of WMN_SEAX)if(vis(x,y,30))wmnDraw(c,'c_'+k,x,y+bob(x,.5),w,true,f);
  const G1=G.flags||{};
  if(G1.voyage){const by=mpWorldM.by,ks=['yarrim','saltbarrow','bells','cinder','lastlight'];c.strokeStyle='rgba(30,70,110,.85)';c.lineWidth=mpWorldLw(1.5);c.setLineDash([3,3.5]);c.beginPath();ks.forEach((k,i)=>{const l=by[k];i?c.lineTo(l.x,l.y):c.moveTo(l.x,l.y)});c.stroke();c.setLineDash([])}}
const WMN_SEAX=[];   // more creatures in the open sea: [x, y, picture, width, face right]

/* the key: the same eight entries, the first five painted */
function wmnKeyRows(c){
  const sp=(n,h)=>(a,b)=>wmnDraw(c,n,a,b+5,h,false);
  return [['Town',sp('i_town',11)],['Castle',sp('i_castle',12)],['Abbey',sp('i_abbey',12)],['Cave or mine',sp('i_cave',10)],['Graves',sp('i_graves',11)],
    ['Road',(a,b)=>{c.strokeStyle='rgba(42,26,12,.85)';c.lineWidth=3.6;c.beginPath();c.moveTo(a-6,b);c.lineTo(a+6,b);c.stroke();c.strokeStyle='#e8d8a6';c.lineWidth=2.2;c.stroke()}],
    ['Teleport stone',(a,b)=>{c.fillStyle='#46506a';c.strokeStyle=mpWorldInk;c.lineWidth=.6;c.beginPath();c.ellipse(a,b+1,4.4,2.4,0,0,TAU);c.fill();c.stroke();c.strokeStyle='#cfeaff';c.beginPath();c.arc(a,b,2.4,0,TAU);c.stroke()}],
    ['Quest open',(a,b)=>{c.fillStyle='#b02818';c.beginPath();c.arc(a,b,1.8,0,TAU);c.fill()}],['A day on foot',(a,b)=>{c.fillStyle=mpWorldInk;c.fillRect(a-6,b,12,1.2);c.fillRect(a-6,b-2,1,4.4);c.fillRect(a+5,b-2,1,4.4)}]]}

/* the roads: dirt paths made of painted patches of trodden earth (path0-15), laid one after another along the route, each turned to follow it, a different one each time, faint.
   Tracks are narrower; the Pilgrim's way is the faintest. Pebbles and grass tufts along the verge, and the Pilgrim's little crosses. */
function wmnRoads(V,z){
  const c=ctx,H=hash2,M=mpWorldM;if(!WMN.ok)return;
  M.rd.forEach((r,ri)=>{const pts=r.pts,n=pts.length;let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of pts){if(p[0]<x0)x0=p[0];if(p[0]>x1)x1=p[0];if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1]}if(x1<V.x0-12||x0>V.x1+12||y1<V.y0-12||y0>V.y1+12)return;
    const kind=r.style,wid=Math.max(kind==='road'?5.4:kind==='pilgrim'?3.4:4.4,2.2/z),len=wid*2.3,step=len*.42,al=kind==='road'?.62:kind==='pilgrim'?.4:.5;
    c.save();c.globalAlpha=al;let carry=step*(.3+H(ri,0,640)*.5),k=0;
    for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);if(L<1e-6)continue;let pos=0;
      while(carry+(L-pos)>=step){const adv=step-carry;pos+=adv;carry=0;k++;const t=pos/L,px=a[0]+dx*t,py=a[1]+dy*t;
        if(px<V.x0-10||px>V.x1+10||py<V.y0-10||py>V.y1+10)continue;
        const h1=H(k,ri,641),h2=H(k,ri,642),h3=H(k,ri,643),nm='path'+((h1*16)|0),R=WMN_RECTS[nm];if(!R)continue;
        const sc=.9+h2*.28,w=len*sc,h=w*R[4]/R[3],ang=Math.atan2(dy,dx)+(h3-.5)*.18,off=(h2-.5)*wid*.16;
        c.save();c.translate(px-dy/L*off,py+dx/L*off);c.rotate(ang);if(h3>.5)c.scale(1,-1);c.drawImage(WMN.s,R[1],R[2],R[3],R[4],-w/2,-h/2,w,h);c.restore()}
      carry+=L-pos}
    c.restore();
    // pebbles and grass along the verge
    if(z>.5){let acc=0,q=0;for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);acc+=L;if(acc<(z>1.4?5:8))continue;acc=0;q++;
      if(b[0]<V.x0||b[0]>V.x1||b[1]<V.y0||b[1]>V.y1)continue;const tx=b[0]-a[0],ty=b[1]-a[1],LL=Math.hypot(tx,ty)||1,nx=-ty/LL,ny=tx/LL,h1=H(i,q,611),h2=H(i,q,612),sd=h1<.5?1:-1,off=wid*.5+.8+h2*1.8;
      const px=b[0]+nx*off*sd,py=b[1]+ny*off*sd;
      if(h2<.5){c.fillStyle='rgba(138,126,108,.7)';c.beginPath();c.ellipse(px,py,.45+h2*.5,.3+h2*.3,0,0,TAU);c.fill();c.strokeStyle='rgba(42,26,12,.4)';c.lineWidth=.2;c.stroke()}
      else if(z>.85){c.strokeStyle='rgba(66,100,46,.7)';c.lineWidth=.38;c.beginPath();c.moveTo(px-.8,py);c.lineTo(px-1.2,py-2);c.moveTo(px,py);c.lineTo(px,py-2.5);c.moveTo(px+.8,py);c.lineTo(px+1.3,py-1.9);c.stroke()}}}
    if(kind==='pilgrim'){let acc=0,nm=0;for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);acc+=L;if(acc<46)continue;acc=0;nm++;if(b[0]<V.x0||b[0]>V.x1||b[1]<V.y0||b[1]>V.y1)continue;
      const dx=b[0]-a[0],dy=b[1]-a[1],LL=Math.hypot(dx,dy)||1,sd=nm%2?1:-1,mx=b[0]-dy/LL*4.6*sd,my=b[1]+dx/LL*4.6*sd;c.strokeStyle=mpWorldInk;c.lineWidth=mpWorldLw(.8);c.beginPath();c.moveTo(mx,my+2);c.lineTo(mx,my-4);c.moveTo(mx-1.6,my-2.4);c.lineTo(mx+1.6,my-2.4);c.stroke()}}
  })}

/* ---------- the rivers: long, winding, with side streams, and kept clear of every place, name and title ---------- */
const WMN_SMALL=[['Below the Abbey',-60,163,8]];   // the small writing under The Hollow Lands
function wmnObstacles(){
  const lay=wmnLayout(),o=[];for(const k in lay){const L=lay[k];o.push(L.ib);if(L.rect)o.push([L.rect[0],L.rect[1],L.rect[2],L.rect[3]-6])}
  const c=ctx;for(const [t,x,y,sz] of WMN_REG){c.save();c.font=`${sz}px ${FTITLE}`;const w=c.measureText(t).width+t.length*1.5+6;c.restore();o.push([x-w/2,y-sz*.7,x+w/2,y+sz*.7])}
  for(const [t,x,y,sz] of WMN_SMALL){c.save();c.font=`italic ${sz}px ${FUI}`;const w=c.measureText(t).width;c.restore();o.push([x-w/2-2,y-sz*.7,x+w/2+2,y+sz*.7])}
  return o}
/* the Hollow Lands lie under the ground: a shadowed pit round the pictures and names of the Hollow places. The outline is made once from where the layout put them (the rectangles are
   blurred together and cut at a level, which gives one soft, hand-wobbled shape), then the ground is darkened a little inside and a good deal along its edge, with a thin ink line on the rim. */
function wmnHollow(V,z){
  const lay=wmnLayout(),c=ctx;let h=WMN.hol;
  if(!h||h.key!==WMN.layKey){
    const R=[],add=(a,p)=>R.push([a[0]-p,a[1]-p,a[2]+p,a[3]+p]);
    for(const k of ['deephollow','hollowgrass','orangecastle']){const L=lay[k];if(!L)continue;add(L.ib,8);if(L.rect)add([L.rect[0],L.rect[1],L.rect[2],L.rect[3]-5],7)}
    {const t=WMN_REG.find(q=>q[0]==='The Hollow Lands');if(t){c.save();c.font=`${t[3]}px ${FTITLE}`;const w=c.measureText(t[0]).width+t[0].length*1.5+6;c.restore();add([t[1]-w/2,t[2]-t[3]*.7,t[1]+w/2,t[2]+t[3]*.7],8)}}
    for(const [t,x,y,sz] of WMN_SMALL){c.save();c.font=`italic ${sz}px ${FUI}`;const w=c.measureText(t).width;c.restore();add([x-w/2,y-sz*.7,x+w/2,y+sz*.7],8)}
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const r of R){x0=Math.min(x0,r[0]);y0=Math.min(y0,r[1]);x1=Math.max(x1,r[2]);y1=Math.max(y1,r[3])}
    R.push([x0+24,y0+22,x1-24,y1-22]);                                      // the body, so that the gaps between the pictures are filled
    const S=3,mg=36,X0=x0-mg,Y0=y0-mg,W=Math.ceil((x1-x0+mg*2)),Hh=Math.ceil((y1-y0+mg*2)),pw=W*S,ph=Hh*S;
    const mk=document.createElement('canvas');mk.width=pw;mk.height=ph;const m=mk.getContext('2d',{willReadFrequently:true});
    m.filter='blur('+(3.4*S)+'px)';m.fillStyle='#fff';
    for(const r of R){const x=(r[0]-X0)*S,y=(r[1]-Y0)*S,w=(r[2]-r[0])*S,hh=(r[3]-r[1])*S,rd=Math.min(w,hh)*.5;m.beginPath();m.roundRect?m.roundRect(x,y,w,hh,rd):m.rect(x,y,w,hh);m.fill()}
    const id=m.getImageData(0,0,pw,ph),d=id.data,o=document.createElement('canvas');o.width=pw;o.height=ph;const oc=o.getContext('2d'),od=oc.createImageData(pw,ph),q=od.data;
    for(let j=0;j<ph;j++)for(let i=0;i<pw;i++){const k=(j*pw+i)*4,wx=X0+i/S,wy=Y0+j/S;
      let a=d[k+3]/255;a+=(Math.sin(wx*.043+1.3)*Math.sin(wy*.051+.7)+.6*Math.sin(wx*.11+wy*.07+2)+.35*Math.sin(wx*.21-wy*.17))*.1;
      if(a<.46){q[k+3]=0;continue}
      const e=Math.min(1,(a-.5)/.5),dk=e<0?0:Math.pow(1-e,1.5);
      let al=.15+.5*dk;const rim=Math.abs(a-.5);if(rim<.022)al=Math.max(al,.7*(1-rim/.022));
      q[k]=26;q[k+1]=22;q[k+2]=14;q[k+3]=Math.min(255,al*255)}
    oc.putImageData(od,0,0);h=WMN.hol={key:WMN.layKey,cv:o,x:X0,y:Y0,w:W,h:Hh}}
  if(h.x+h.w<V.x0||h.x>V.x1||h.y+h.h<V.y0||h.y>V.y1)return;
  c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(h.cv,h.x,h.y,h.w,h.h);c.restore()}
/* the small writing under The Hollow Lands */
function wmnSmallWords(){const c=ctx;for(const [t,x,y,sz] of WMN_SMALL){c.save();c.font=`italic ${sz}px ${FUI}`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=2.6;c.strokeStyle='rgba(236,222,176,.6)';c.strokeText(t,x,y);c.fillStyle='rgba(50,36,18,.7)';c.fillText(t,x,y);c.restore()}}

/* the paper under the map: plain aged vellum, with a light vignette and no blotches (the oval stains of the common parchment showed through the washes as ovals) */
function wmnParchment(x){
  const tint=[2,2,-6],f=(a,b,c)=>`rgb(${Math.max(0,Math.min(255,a+tint[0]))},${Math.max(0,Math.min(255,b+tint[1]))},${Math.max(0,Math.min(255,c+tint[2]))})`,g=x.createLinearGradient(0,0,0,DH);
  g.addColorStop(0,f(226,208,160));g.addColorStop(1,f(206,184,134));x.fillStyle=g;x.fillRect(0,0,DW,DH);
  const v=x.createRadialGradient(DW/2,DH/2,DH*.3,DW/2,DH/2,DW*.62);v.addColorStop(0,'rgba(80,50,20,0)');v.addColorStop(1,'rgba(80,50,20,.38)');x.fillStyle=v;x.fillRect(0,0,DW,DH)}
