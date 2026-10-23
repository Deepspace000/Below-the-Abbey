/* ==========================================================================
   THE NEW LOOK FOR THE WORLD MAP (prefix wmn / WMN). Hand-painted pictures in coloured pencil and watercolour instead of the pen drawings: every place, the trees,
   pines, mountains, hills, dunes and palms, and the ships and sea creatures. It is a second way to draw the same map (G.flags.mapNew, the "New look" button on the
   world map); the old drawings stay and the map's roads, rivers, coast, clouds, titles and behaviour are shared. maps_world.js calls the functions here
   when wmnOn() is true.
   Pictures: assets/wm_a.png (big: places, landmarks, sea creatures) and assets/wm_s.png (small: scenery), cut and packed by tools/build_wm_atlas.py;
   where each one sits is in maps_world_atlas.js (WMN_RECTS).
   Nothing on this map may overlap: wmnLayout() places every picture and every name (and its level and quest dots) once, so that no name stands on a picture,
   another name or a region title, and the scenery keeps clear of all of them.
   ========================================================================== */
const WMN={a:null,s:null,ok:false,loading:false,lay:null,layKey:'',pat:null,
  K:{oak:.115,pine:.125,mtn:.133,hill:.125,dune:.173,palm:.112},   // map units per picture pixel, per kind of scenery (times the item's own scale)
  TINT:{'#dcc088':'sand','#cf8a60':'red','#a4b8cc':'blue','#efe9da':'white','#e0b850':'gold','#a98cbb':'violet'}};
function wmnLoad(){
  if(WMN.loading||typeof WMN_RECTS==='undefined')return;WMN.loading=true;let n=0;
  for(const p of ['a','s']){const im=new Image();im.onload=()=>{WMN[p]=im;if(++n===2)WMN.ok=true};im.onerror=()=>{WMN.failed=true};im.decoding='async';
    im.src='assets/wm_'+p+'.png'+(typeof VERSION!=='undefined'?'?v='+VERSION:'')}}
/* the painted look is the map unless the player has switched it off (G.flags.mapNew===false) */
function wmnWanted(){return !(G.flags&&G.flags.mapNew===false)}
function wmnOn(){if(!wmnWanted())return false;if(!WMN.ok){wmnLoad();return false}return true}
function wmnToggle(){G.flags.mapNew=!wmnWanted();if(G.flags.mapNew)wmnLoad();WMN.lay=null}

/* one picture, bottom centre at (cx,by), size = height, or width when isW */
function wmnDims(name,size,isW){const r=WMN_RECTS[name];if(!r)return [0,0];return isW?[size,size*r[4]/r[3]]:[size*r[3]/r[4],size]}
const WMN_ICO_SCALE=1.2;   // places are drawn this much bigger than the sizes in WMN_SPEC
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
function wmnShape(l){
  const s=wmnSpec(l);if(!s.length)return {parts:[],off:0,ib:[l.x,l.y-12,l.x,l.y-4]};let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const p of s){const d=wmnDims(p[0],p[3]*WMN_ICO_SCALE,p[4]);x0=Math.min(x0,p[1]*WMN_ICO_SCALE-d[0]/2);x1=Math.max(x1,p[1]*WMN_ICO_SCALE+d[0]/2);y0=Math.min(y0,p[2]*WMN_ICO_SCALE-d[1]);y1=Math.max(y1,p[2]*WMN_ICO_SCALE)}
  const off=l.y+10-y1;return {parts:s.slice().sort((a,b)=>a[2]-b[2]),off,ib:[l.x+x0,y0+off,l.x+x1,y1+off]}}

/* ---------- the layout: pictures, then names ---------- */
const WMN_REG=[['The Unknown Lands',476,-16,19],['The Known Lands',196,12,19],['The Sea Lands',652,16,19],['The Hollow Lands',-60,150,16],['The Western Reaches',-330,120,19],['The Far West',-760,100,19],['The Grey Downs',-560,250,15],['The Eastern Lands',1230,16,19]];
const wmnHit=(a,b)=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];
function wmnLayout(){
  let fo=true;try{fo=!document.fonts||document.fonts.check("bold 10px 'IM Fell English SC'")}catch(e){}
  const key=(G.flags.autoScaleOn?1:0)+'|'+(fo?1:0)+'|'+WORLD_LOCS.length;if(WMN.lay&&WMN.layKey===key)return WMN.lay;
  const c=ctx,out={},placed=[],info=[];
  for(const [t,x,y,sz] of WMN_REG){c.save();c.font=`${sz}px ${FTITLE}`;const w=c.measureText(t).width+t.length*1.5+6;c.restore();placed.push([x-w/2,y-sz*.7,x+w/2,y+sz*.7])}
  for(const [t,x,y,sz] of WMN_SMALL){c.save();c.font=`italic ${sz}px ${FUI}`;const w=c.measureText(t).width;c.restore();placed.push([x-w/2-2,y-sz*.7,x+w/2+2,y+sz*.7])}
  for(const l of WORLD_LOCS){const sh=wmnShape(l);out[l.k]={sh,ib:sh.ib,parts:sh.parts,off:sh.off};placed.push(sh.ib)}
  const order=WORLD_LOCS.slice().sort((a,b)=>(b.ic==='castle'||b.ic==='town'||b.ic==='abbey'||b.ic==='orangecastle'?1:0)-(a.ic==='castle'||a.ic==='town'||a.ic==='abbey'||a.ic==='orangecastle'?1:0));
  for(const l of order){
    const L=out[l.k],ib=L.ib,big=l.ic==='castle'||l.ic==='town'||l.ic==='abbey'||l.ic==='orangecastle',nsz=big?10.5:9;
    const lr=(!G.flags.autoScaleOn&&typeof locRating==='function')?locRating(l):null,t2=lr?'Lv '+lr:'';
    c.save();c.font=`bold ${nsz}px ${FUI}`;const w1=c.measureText(l.n).width;c.font=`bold 8px ${FUI}`;const w2=lr?c.measureText(t2).width:0;c.font=`bold 7.4px ${FUI}`;const sw=l.sub?c.measureText(l.sub).width:0;c.restore();
    const gap=lr?5:0,wt=w1+gap+w2,bw=Math.max(wt,sw),sub=l.sub?11:0,ym=(ib[1]+ib[3])/2;
    // every spot round the picture where the name could stand: under it, over it, beside it, each a few steps further out; the nearest spot that is clear wins (under is preferred).
    // The block keeps 7 free under the name for the quest dots; where there is no room for that, the dots may sit on whatever is there.
    let best=null,bestA=1e9;
    for(const strip of [7,0]){
      const H=14+sub+strip,cands=[];
      for(const [side,bias] of [['b',0],['t',5],['r',3],['l',3]])for(let k=-4;k<=4;k++)for(let step=0;step<7;step++){
        let cx,ny;
        if(side==='b'){cx=l.x+k*bw*.25;ny=ib[3]+8+step*7}else if(side==='t'){cx=l.x+k*bw*.25;ny=ib[1]-8-sub-7-step*7}
        else if(side==='r'){cx=ib[2]+4+bw/2+step*6;ny=ym-sub/2+k*8}else{cx=ib[0]-4-bw/2-step*6;ny=ym-sub/2+k*8}
        cands.push({cx,ny,r:[cx-bw/2-2,ny-7,cx+bw/2+2,ny-7+H],d:Math.hypot(cx-l.x,ny-ib[3])+bias+Math.abs(k)*2.5})}
      cands.sort((p,q)=>p.d-q.d);
      for(const q of cands){let a=0;for(const p of placed){if(wmnHit(q.r,p)){const ox=Math.min(q.r[2],p[2])-Math.max(q.r[0],p[0]),oy=Math.min(q.r[3],p[3])-Math.max(q.r[1],p[1]);a+=ox*oy+1}}
        if(a<bestA){bestA=a;best=q;if(!a)break}}
      if(!bestA)break}
    placed.push(best.r);Object.assign(L,{cx:best.cx,ny:best.ny,rect:[best.r[0],best.r[1],best.r[2],best.r[1]+14+sub+7],w1,w2,gap,wt,t2,nsz,over:bestA>0});
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
  if(L.t2){txtH(l.n,xs+L.w1/2,L.ny,L.nsz,col);txtH(L.t2,xs+L.w1+L.gap+L.w2/2,L.ny,8,'#7a1a10')}else txtH(l.n,L.cx,L.ny,L.nsz,col);
  if(l.sub)txtH(l.sub,L.cx,L.ny+11,7.4,'#4a3a22')}
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
  const ships=[[790,-62,1,'caravel'],[1010,34,-1,'galleon'],[1040,330,1,'caravel'],[880,432,-1,'boat'],[300,408,1,'galleon'],[560,396,-1,'caravel'],[-222,196,1,'boat'],[-176,-60,-1,'caravel'],[690,-30,1,'galleon']];
  for(const [x,y,d,k] of ships)if(vis(x,y,30))wmnDraw(c,'c_'+k,x,y+bob(x,.7),k==='galleon'?28:k==='boat'?20:25,true,d>0);
  if(vis(-230,84,50))wmnDraw(c,'c_serpent',-230,84+bob(-230,.5),36,true,false);
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
function wmnMakeRivers(){
  const M=mpWorldM,H=hash2,obst=wmnObstacles(),MG=6,land=(x,y)=>M.isLand(x,y);
  const pushOut=(p,m)=>{for(let it=0;it<3;it++){let moved=false;for(const r of obst){if(p[0]>r[0]-m&&p[0]<r[2]+m&&p[1]>r[1]-m&&p[1]<r[3]+m){const dl=p[0]-(r[0]-m),dr=(r[2]+m)-p[0],dt=p[1]-(r[1]-m),db=(r[3]+m)-p[1],mn=Math.min(dl,dr,dt,db);
        if(mn===dl)p[0]=r[0]-m-.6;else if(mn===dr)p[0]=r[2]+m+.6;else if(mn===dt)p[1]=r[1]-m-.6;else p[1]=r[3]+m+.6;moved=true}}if(!moved)break}};
  const resample=(pts,st)=>{const o=[pts[0].slice()];let acc=0;for(let i=1;i<pts.length;i++){let a=pts[i-1],b=pts[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);while(acc+L>=st){const t=(st-acc)/L;a=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];o.push(a);L=Math.hypot(b[0]-a[0],b[1]-a[1]);acc=0}acc+=L}const e=pts[pts.length-1];if(Math.hypot(e[0]-o[o.length-1][0],e[1]-o[o.length-1][1])>st*.4)o.push(e.slice());return o};
  // lay a meander on a line: long sideways swings of two sizes that grow in from the ends, smoothed so the bends are round
  const meander=(base,amp,wl,seed)=>{const n=base.length,ph=[H(seed,1,651)*TAU,H(seed,2,651)*TAU];let s=0;const out=[];
    for(let i=0;i<n;i++){const a=base[Math.max(0,i-1)],b=base[Math.min(n-1,i+1)],tx=b[0]-a[0],ty=b[1]-a[1],L=Math.hypot(tx,ty)||1;if(i)s+=Math.hypot(base[i][0]-base[i-1][0],base[i][1]-base[i-1][1]);
      const env=Math.min(1,s/30)*Math.min(1,(n-1-i)*3/30+.001),sw=Math.sin(s/wl*TAU+ph[0])+.42*Math.sin(s/(wl*.53)*TAU+ph[1]),k=amp*(.85+.3*Math.sin(s/(wl*2.7)+ph[1]))*env*sw;
      out.push([base[i][0]-ty/L*k,base[i][1]+tx/L*k])}
    for(let pass=0;pass<5;pass++){const q=out.map(p=>p.slice());for(let i=1;i<n-1;i++){out[i][0]=(q[i-1][0]+q[i][0]*2+q[i+1][0])/4;out[i][1]=(q[i-1][1]+q[i][1]*2+q[i+1][1])/4}}
    return out};
  // keep a river off the places: the push away from any picture, name or title within 18 units is worked out as a sideways shift of the winding line, the shift is smoothed
  // (so the river bends round a place in a curve and keeps its windings elsewhere), and anything still on a place is moved out. Points that end up in the sea are drawn back to the line the river was laid on.
  const R=18,fix=(pts,base)=>{const n=pts.length,B=pts.map(p=>p.slice()),off=pts.map(()=>[0,0]);
    for(let it=0;it<44;it++){
      for(let i=1;i<n-1;i++){const px=B[i][0]+off[i][0],py=B[i][1]+off[i][1];let ax=0,ay=0;
        for(const r of obst){const qx=Math.max(r[0],Math.min(r[2],px)),qy=Math.max(r[1],Math.min(r[3],py));let dx=px-qx,dy=py-qy;const dist=Math.hypot(dx,dy);
          if(dist>=R)continue;
          if(dist<1e-6){const dl=px-r[0],dr=r[2]-px,dt=py-r[1],db=r[3]-py,mn=Math.min(dl,dr,dt,db);dx=mn===dl?-1:mn===dr?1:0;dy=mn===dt?-1:mn===db?1:0;const f=(R+mn)*.2;ax+=dx*f;ay+=dy*f}
          else{const f=(R-dist)/R*3;ax+=dx/dist*f;ay+=dy/dist*f}}
        off[i][0]+=ax;off[i][1]+=ay}
      for(let k=0;k<3;k++){const q=off.map(o=>o.slice());for(let i=1;i<n-1;i++){off[i][0]=(q[i-1][0]+q[i][0]*2+q[i+1][0])/4;off[i][1]=(q[i-1][1]+q[i][1]*2+q[i+1][1])/4}}}
    for(let i=0;i<n;i++){pts[i][0]=B[i][0]+off[i][0];pts[i][1]=B[i][1]+off[i][1]}
    for(let i=1;i<n-8;i++){let g=0;while(!land(pts[i][0],pts[i][1])&&g++<4){pts[i][0]=(pts[i][0]+base[i][0])/2;pts[i][1]=(pts[i][1]+base[i][1])/2}}
    for(let pass=0;pass<4;pass++)for(let i=1;i<n-1;i++)pushOut(pts[i],2.5);
    return pts};
  const rivers=[];
  M.rv.forEach((base0,ri)=>{
    const base=resample(base0,3),main=fix(meander(base,13+H(ri,4,652)*7,62+H(ri,5,652)*40,ri*7+1),base);
    main.w0=2.0;main.w1=4.4;rivers.push(main);
    // side streams: two or three, branching off at points along it, each winding in turn
    const nb=2+((H(ri,6,653)*2)|0);
    for(let b=0;b<nb;b++){
      const u=.18+.62*((b+H(ri,b,654)*.7)/nb),bi=Math.max(4,Math.min(main.length-8,(main.length*u)|0)),P=main[bi],Q=main[bi+3];
      let ang=Math.atan2(Q[1]-P[1],Q[0]-P[0])+(b%2?1:-1)*(.9+H(ri,b,655)*.5),x=P[0],y=P[1];const tr=[[x,y]],maxL=70+H(ri,b,656)*90;let len=0;
      for(let st=0;st<60&&len<maxL;st++){ang+=(H(st,ri*9+b,657)-.5)*.3;x+=Math.cos(ang)*3;y+=Math.sin(ang)*3;len+=3;if(!land(x,y))break;tr.push([x,y])}
      if(tr.length<14)continue;tr.reverse();                                                  // from the source down to the main river
      const t2=fix(meander(tr,5+H(ri,b,658)*4,40+H(ri,b,659)*30,ri*13+b+3),tr);t2[t2.length-1]=P.slice();t2.w0=1.0;t2.w1=Math.max(1.8,(main.w0+(main.w1-main.w0)*bi/main.length)*.78);rivers.push(t2)}});
  M.rv=rivers;
  // lakes: any that sits on a place, a name or a title is dropped
  M.lakes=M.lakes.filter(([lx,ly,rx,ry])=>!obst.some(r=>lx+rx*1.2>r[0]&&lx-rx*1.2<r[2]&&ly+ry*1.2>r[1]&&ly-ry*1.2<r[3]))}

/* the rivers and lakes: watercolour blue between hand-inked, wobbling banks with short hatching on the outside, ripples on the water and reeds at the edge. A river widens from its source to its mouth. */
function wmnRivers(V,z){
  const c=ctx,H=hash2,M=mpWorldM,minW=1.1/z;
  M.rv.forEach((pts,ri)=>{let ok=false;for(const p of pts){if(p[0]>V.x0-20&&p[0]<V.x1+20&&p[1]>V.y0-20&&p[1]<V.y1+20){ok=true;break}}if(!ok)return;
    const n=pts.length,w0=pts.w0||2.2,w1=pts.w1||4.6,wAt=i=>Math.max(w0+(w1-w0)*i/n,minW);
    const side=(sd,f)=>{c.beginPath();for(let i=0;i<n;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)],tx=b[0]-a[0],ty=b[1]-a[1],L=Math.hypot(tx,ty)||1,o=sd*wAt(i)*.5+Math.sin(i*.8+f)*.3+Math.sin(i*2.1+f*3)*.15;const px=pts[i][0]-ty/L*o,py=pts[i][1]+tx/L*o;i?c.lineTo(px,py):c.moveTo(px,py)}};
    c.lineCap='round';c.lineJoin='round';
    const pass=(wm,col)=>{for(let i=1;i<n;i++){c.beginPath();c.moveTo(pts[i-1][0],pts[i-1][1]);c.lineTo(pts[i][0],pts[i][1]);c.strokeStyle=col;c.lineWidth=wAt(i)*wm;c.stroke()}};
    pass(1.9,'rgba(110,150,150,.16)');pass(1.06,'rgba(130,174,182,.9)');pass(.45,'rgba(196,228,232,.5)');
    c.strokeStyle='rgba(54,40,24,.62)';c.lineWidth=Math.max(.45,.5/z);for(const sd of [-1,1]){side(sd,ri*5+sd);c.stroke()}
    c.beginPath();let acc=0,k=0;for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i];acc+=Math.hypot(b[0]-a[0],b[1]-a[1]);if(acc<(z>1.2?3.6:6.5))continue;acc=0;k++;
      if(b[0]<V.x0||b[0]>V.x1||b[1]<V.y0||b[1]>V.y1)continue;const tx=b[0]-a[0],ty=b[1]-a[1],L=Math.hypot(tx,ty)||1,nx=-ty/L,ny=tx/L,w=wAt(i),h1=H(i,ri,621),sd=k%2?1:-1,o1=w*.5+.5,o2=o1+1.1+h1*1.4;
      c.moveTo(b[0]+nx*o1*sd,b[1]+ny*o1*sd);c.lineTo(b[0]+nx*o2*sd+tx/L*.7,b[1]+ny*o2*sd+ty/L*.7)}
    c.strokeStyle='rgba(54,40,24,.42)';c.lineWidth=.3;c.stroke();
    if(z>.6){c.beginPath();acc=0;k=0;for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i];acc+=Math.hypot(b[0]-a[0],b[1]-a[1]);if(acc<10)continue;acc=0;k++;if(b[0]<V.x0||b[0]>V.x1||b[1]<V.y0||b[1]>V.y1)continue;
        const h=H(i,ri,622),ox=(h-.5)*wAt(i)*.5;c.moveTo(b[0]+ox-1.5,b[1]);c.quadraticCurveTo(b[0]+ox,b[1]-1.1,b[0]+ox+1.5,b[1])}
      c.strokeStyle='rgba(246,252,252,.75)';c.lineWidth=.36;c.stroke()}
    if(z>.9){c.strokeStyle='rgba(62,102,52,.8)';c.lineWidth=.38;c.beginPath();acc=0;for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i];acc+=Math.hypot(b[0]-a[0],b[1]-a[1]);if(acc<17)continue;acc=0;if(b[0]<V.x0||b[0]>V.x1||b[1]<V.y0||b[1]>V.y1)continue;
        const tx=b[0]-a[0],ty=b[1]-a[1],L=Math.hypot(tx,ty)||1,nx=-ty/L,ny=tx/L,sd=H(i,ri,623)<.5?1:-1,o=wAt(i)*.5+1.4,px=b[0]+nx*o*sd,py=b[1]+ny*o*sd;
        for(const q of [-.9,0,.9]){c.moveTo(px+q,py+.6);c.lineTo(px+q*1.5,py-2.4-Math.abs(q))}}c.stroke()}
    c.lineCap='butt'});
  for(const [lx,ly,rx,ry] of M.lakes){if(lx+rx<V.x0||lx-rx>V.x1||ly+ry<V.y0||ly-ry>V.y1)continue;
    const edge=(sc)=>{c.beginPath();for(let k=0;k<=24;k++){const a=k/24*TAU,j=1+.1*Math.sin(a*3+lx)+.05*Math.sin(a*7+ly);const px=lx+Math.cos(a)*rx*j*sc,py=ly+Math.sin(a)*ry*j*sc;k?c.lineTo(px,py):c.moveTo(px,py)}c.closePath()};
    edge(1.18);c.fillStyle='rgba(110,150,150,.18)';c.fill();edge(1);c.fillStyle='rgba(130,174,182,.92)';c.fill();
    c.save();edge(1);c.clip();c.fillStyle='rgba(196,228,232,.45)';c.beginPath();c.ellipse(lx-rx*.18,ly-ry*.2,rx*.5,ry*.34,0,0,TAU);c.fill();
    c.strokeStyle='rgba(246,252,252,.75)';c.lineWidth=.36;c.beginPath();for(let k=0;k<4;k++){const ox=lx+(k-1.5)*rx*.34,oy=ly+((k*37)%5-2)*ry*.18;c.moveTo(ox-2,oy);c.quadraticCurveTo(ox,oy-1.3,ox+2,oy)}c.stroke();c.restore();
    edge(1);c.strokeStyle='rgba(54,40,24,.62)';c.lineWidth=Math.max(.45,.5/z);c.stroke();
    c.strokeStyle='rgba(54,40,24,.42)';c.lineWidth=.3;c.beginPath();for(let k=0;k<30;k++){const a=k/30*TAU,j=1+.1*Math.sin(a*3+lx)+.05*Math.sin(a*7+ly),ex=Math.cos(a),ey=Math.sin(a);c.moveTo(lx+ex*rx*j+ex*.7,ly+ey*ry*j+ey*.7);c.lineTo(lx+ex*(rx*j+1.4+H(k,lx,624)*1.2),ly+ey*(ry*j+1.4+H(k,lx,624)*1.2))}c.stroke();
    if(z>.9){c.strokeStyle='rgba(62,102,52,.8)';c.lineWidth=.38;c.beginPath();for(let k=0;k<6;k++){const a=(k/6+H(k,ly,625)*.1)*TAU,j=1+.1*Math.sin(a*3+lx),px=lx+Math.cos(a)*(rx*j+2),py=ly+Math.sin(a)*(ry*j+2);for(const q of [-.9,0,.9]){c.moveTo(px+q,py+.6);c.lineTo(px+q*1.5,py-2.4-Math.abs(q))}}c.stroke()}}}
/* the small writing under The Hollow Lands */
function wmnSmallWords(){const c=ctx;for(const [t,x,y,sz] of WMN_SMALL){c.save();c.font=`italic ${sz}px ${FUI}`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=2.6;c.strokeStyle='rgba(236,222,176,.6)';c.strokeText(t,x,y);c.fillStyle='rgba(50,36,18,.7)';c.fillText(t,x,y);c.restore()}}
