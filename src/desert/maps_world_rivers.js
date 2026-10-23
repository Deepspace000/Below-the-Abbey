/* ==========================================================================
   THE RIVERS OF THE WORLD MAP (prefix wmr / WMR). Each river is drawn to fit: a source in the hills (a thin stream), a long winding course that keeps clear of every place, name and title, side streams that join it,
   and a mouth that runs out to the coast (a flared estuary, clipped at the shore). They are painted with the watercolour water of assets/wm_water.jpg inside hand-inked, wobbling banks, with painted details laid on
   them upright: wooden dams across the narrower stretches, little rowing boats and a sailing boat on the wide ones, groves on the banks, and a plank bridge wherever a road crosses.
   The pieces (wm_s.png: rb = rowing boats, sb = sailing boats, dam, grv = groves) were painted with Gemini and cut by tools/cut_components.py; tools/build_wm_atlas.py packs them.
   wmnMakeRivers() runs when the world map is first built (maps_world.js, after the roads exist); wmnRivers() and wmnBridges() draw.
   ========================================================================== */
const WMR_BASE=[ // [width at the widest, where it runs from the source in the hills to the sea: control points in map units]
  {w:6.2,p:[[-930,-390],[-985,-250],[-1000,-100],[-1058,30]]},
  {w:5.6,p:[[-760,-140],[-700,0],[-720,150],[-650,300],[-630,345]]},
  {w:6.0,p:[[-430,-130],[-400,0],[-430,120],[-370,260],[-355,345]]},
  {w:5.2,p:[[120,-420],[330,-350],[520,-250],[660,-180],[705,-150]]},
  {w:5.6,p:[[1060,-390],[1075,-280],[1040,-200],[1030,-150]]},
  {w:6.0,p:[[1500,-90],[1380,-20],[1270,-30],[1150,-50]]},
  {w:6.4,p:[[1640,170],[1480,110],[1340,100],[1150,112]]},
  {w:6.0,p:[[1640,340],[1480,400],[1330,440],[1146,430]]},
  {w:5.4,p:[[-180,-330],[-140,-200],[-250,-100],[-235,100],[-205,335]]},
  {w:4.4,join:8,p:[[60,-220],[-30,-180],[-120,-140],[-205,-112]]}   // joins the river before it: join is that river's place in this list
];
function wmnMakeRivers(){
  const M=mpWorldM,H=hash2,obst=wmnObstacles(),land=(x,y)=>M.isLand(x,y),MG=6,R=18;
  const pushOut=(p,m)=>{for(let it=0;it<3;it++){let moved=false;for(const r of obst){if(p[0]>r[0]-m&&p[0]<r[2]+m&&p[1]>r[1]-m&&p[1]<r[3]+m){const dl=p[0]-(r[0]-m),dr=(r[2]+m)-p[0],dt=p[1]-(r[1]-m),db=(r[3]+m)-p[1],mn=Math.min(dl,dr,dt,db);
        if(mn===dl)p[0]=r[0]-m-.6;else if(mn===dr)p[0]=r[2]+m+.6;else if(mn===dt)p[1]=r[1]-m-.6;else p[1]=r[3]+m+.6;moved=true}}if(!moved)break}};
  const inObst=(x,y,m)=>{for(const r of obst)if(x>r[0]-m&&x<r[2]+m&&y>r[1]-m&&y<r[3]+m)return true;return false};
  const resample=(pts,st)=>{const o=[pts[0].slice()];let acc=0;for(let i=1;i<pts.length;i++){let a=pts[i-1],b=pts[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);while(acc+L>=st){const t=(st-acc)/L;a=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];o.push(a);L=Math.hypot(b[0]-a[0],b[1]-a[1]);acc=0}acc+=L}const e=pts[pts.length-1];if(Math.hypot(e[0]-o[o.length-1][0],e[1]-o[o.length-1][1])>st*.4)o.push(e.slice());return o};
  // long sideways swings of two sizes that grow in from the ends, smoothed so the bends are round
  const meander=(base,amp,wl,seed)=>{const n=base.length,ph=[H(seed,1,651)*TAU,H(seed,2,651)*TAU];let s=0;const out=[];
    for(let i=0;i<n;i++){const a=base[Math.max(0,i-1)],b=base[Math.min(n-1,i+1)],tx=b[0]-a[0],ty=b[1]-a[1],L=Math.hypot(tx,ty)||1;if(i)s+=Math.hypot(base[i][0]-base[i-1][0],base[i][1]-base[i-1][1]);
      const env=Math.min(1,s/30)*Math.min(1,(n-1-i)*3/30+.001),sw=Math.sin(s/wl*TAU+ph[0])+.25*Math.sin(s/(wl*.53)*TAU+ph[1]),k=amp*(.85+.3*Math.sin(s/(wl*2.7)+ph[1]))*env*sw;
      out.push([base[i][0]-ty/L*k,base[i][1]+tx/L*k])}
    for(let pass=0;pass<3;pass++){const q=out.map(p=>p.slice());for(let i=1;i<n-1;i++){out[i][0]=(q[i-1][0]+q[i][0]*2+q[i+1][0])/4;out[i][1]=(q[i-1][1]+q[i][1]*2+q[i+1][1])/4}}
    return out};
  // keep a river off the places: the push away from any picture, name or title within R units is worked out as a sideways shift of the winding line, the shift is smoothed
  // (so the river bends round a place in a curve), and anything still on a place is moved out; points that end up in the sea are drawn back to the line the river was laid on
  const fix=(pts,base)=>{const n=pts.length,B=pts.map(p=>p.slice()),off=pts.map(()=>[0,0]);
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
  // the widths along a river: a thin stream at the source, widening to w1 (to the power .8, so it fills out early)
  const widths=(n,w0,w1)=>Array.from({length:n},(_,i)=>w0+(w1-w0)*Math.pow(i/(n-1),.8));
  const rivers=[],mainBy={};
  WMR_BASE.forEach((bs,ri)=>{
    const base=resample(mpWorldCat(bs.p,6),3),main=fix(meander(base,19+H(ri,4,652)*9,92+H(ri,5,652)*40,ri*7+1),base);
    if(bs.join!==undefined&&mainBy[bs.join]){ // it runs into another river: its last point is put on that river
      const T=mainBy[bs.join],e=main[main.length-1];let bi=0,bd=1e9;T.pts.forEach((p,i)=>{const d=Math.hypot(p[0]-e[0],p[1]-e[1]);if(d<bd){bd=d;bi=i}});main[main.length-1]=T.pts[bi].slice();
      const rj={pts:main,w:widths(main.length,.6,Math.max(2.6,T.w[bi]*.85)),main:false,id:ri*10+9};rivers.push(rj);return}
    // out to the sea: carry the last direction on until the water, and a little way beyond (the shore clips it)
    let ic=main.length;const e=main[main.length-1],f=main[Math.max(0,main.length-4)],dx=e[0]-f[0],dy=e[1]-f[1],dl=Math.hypot(dx,dy)||1;
    for(let k=1;k<=18;k++){const x=e[0]+dx/dl*3*k,y=e[1]+dy/dl*3*k;main.push([x,y])}
    for(let i=0;i<main.length;i++)if(!land(main[i][0],main[i][1])&&i>main.length*.5){ic=i;break}
    const n=main.length,w=widths(n,.6,bs.w*1.3);
    for(let i=Math.max(0,ic-6);i<n;i++){const t=Math.min(1,(i-(ic-6))/6);w[i]*=1+.9*Math.pow(t,1.5)}   // the estuary opens out as it reaches the shore
    main.mouth={i:Math.min(ic,n-1)};
    const rm={pts:main,w,main:true,id:ri,mouth:main.mouth};rivers.push(rm);mainBy[ri]=rm;
    // side streams: two to four, branching off at points along it, each winding in turn
    const nb=2+((H(ri,6,653)*3)|0);
    for(let b=0;b<nb;b++){
      const u=.15+.6*((b+H(ri,b,654)*.7)/nb),bi=Math.max(4,Math.min(ic-8,(main.length*u)|0)),P=main[bi],Q=main[bi+3];
      let ang=Math.atan2(Q[1]-P[1],Q[0]-P[0])+(b%2?1:-1)*(.9+H(ri,b,655)*.5),x=P[0],y=P[1];const tr=[[x,y]],maxL=80+H(ri,b,656)*110;let len=0;
      for(let st=0;st<70&&len<maxL;st++){ang+=(H(st,ri*9+b,657)-.5)*.3;x+=Math.cos(ang)*3;y+=Math.sin(ang)*3;len+=3;if(!land(x,y)||inObst(x,y,4))break;tr.push([x,y])}
      if(tr.length<16)continue;tr.reverse();                                                  // from the source down to the main river
      let t2=fix(meander(tr,8+H(ri,b,658)*5,52+H(ri,b,659)*30,ri*13+b+3),tr);t2[t2.length-1]=P.slice();
      // a side stream joins the river it springs from and never crosses any river on the way: where it would, its upper part is cut off (or it is dropped)
      {let cl=-1;for(const r2 of rivers){const own=r2===rm;for(let a=0;a<t2.length-1;a++){if(own&&a>=t2.length-9)continue;const p=t2[a];for(let c2=0;c2<r2.pts.length;c2++){if(own&&Math.abs(c2-bi)<=10)continue;const q=r2.pts[c2];if(Math.abs(q[0]-p[0])<6&&Math.abs(q[1]-p[1])<6&&Math.hypot(q[0]-p[0],q[1]-p[1])<5){if(a>cl)cl=a;break}}}}
        if(cl>=0){if(cl>t2.length*.7)continue;t2=t2.slice(cl+3);if(t2.length<14)continue}}
      rivers.push({pts:t2,w:widths(t2.length,.6,Math.max(2.4,w[bi]*.8)),main:false,id:ri*10+b+1})}});
  // each river's box, for drawing only what shows
  for(const r of rivers){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of r.pts){x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1])}r.bb=[x0-16,y0-16,x1+16,y1+16]}
  M.rv=rivers.map(r=>r.pts);M.rivers=rivers;M.lakes=[];
  // where two rivers meet, the ink of a bank must not run across the other's water: for every bank point, is it inside another river's water? (hL, hR: 1 = hidden)
  {const gk=(x,y)=>Math.floor(x/8)*10007+Math.floor(y/8),grid=new Map(),put=(x,y,sg)=>{const k=gk(x,y);let l=grid.get(k);if(!l)grid.set(k,l=[]);if(l[l.length-1]!==sg)l.push(sg)};
    rivers.forEach((r,ri)=>{for(let i=0;i<r.pts.length-1;i++){const a=r.pts[i],b=r.pts[i+1],sg=[a[0],a[1],b[0],b[1],Math.max(r.w[i],.3)/2,Math.max(r.w[i+1],.3)/2,ri];put(a[0],a[1],sg);put((a[0]+b[0])/2,(a[1]+b[1])/2,sg);put(b[0],b[1],sg)}});
    const inOther=(x,y,self)=>{const gx=Math.floor(x/8),gy=Math.floor(y/8);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=grid.get((gx+a)*10007+gy+b);if(l)for(const q of l){if(q[6]===self)continue;
        const dx=q[2]-q[0],dy=q[3]-q[1],ll=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((x-q[0])*dx+(y-q[1])*dy)/ll));
        if(Math.hypot(q[0]+dx*t-x,q[1]+dy*t-y)<q[4]+(q[5]-q[4])*t-.05)return true}}return false};
    rivers.forEach((r,ri)=>{const n=r.pts.length;r.hL=new Uint8Array(n);r.hR=new Uint8Array(n);
      for(let i=0;i<n;i++){const a=r.pts[Math.max(0,i-1)],b=r.pts[Math.min(n-1,i+1)],tx=b[0]-a[0],ty=b[1]-a[1],ln=Math.hypot(tx,ty)||1,nx=-ty/ln,ny=tx/ln,hw=Math.max(r.w[i],.3)/2,p=r.pts[i];
        r.hL[i]=inOther(p[0]+nx*hw,p[1]+ny*hw,ri)?1:0;r.hR[i]=inOther(p[0]-nx*hw,p[1]-ny*hw,ri)?1:0}})}
  // the roads, on a grid, to keep dams, boats and groves off them
  const rg=new Map(),rgk=(x,y)=>Math.floor(x/8)*10007+Math.floor(y/8);
  for(const r of M.rd){const p=r.pts;for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),m=Math.max(1,Math.ceil(L/4));for(let k=0;k<m;k++){const x=a[0]+(b[0]-a[0])*k/m,y=a[1]+(b[1]-a[1])*k/m,key=rgk(x,y);let l=rg.get(key);if(!l)rg.set(key,l=[]);l.push([x,y])}}}
  const roadNear=(x,y,d)=>{const gx=Math.floor(x/8),gy=Math.floor(y/8),m=Math.ceil(d/8);for(let a=-m;a<=m;a++)for(let b=-m;b<=m;b++){const l=rg.get((gx+a)*10007+gy+b);if(l)for(const q of l)if(Math.hypot(q[0]-x,q[1]-y)<d)return true}return false};
  // the details: dams, boats, groves, bridges
  const dams=[],boats=[],groves=[],bridges=[],taken=[],free=(x,y,d)=>land(x,y)&&!inObst(x,y,d*.5+2)&&!roadNear(x,y,d)&&!taken.some(q=>Math.hypot(q[0]-x,q[1]-y)<q[2]+d);
  const tang=(pts,i)=>{const a=pts[Math.max(0,i-2)],b=pts[Math.min(pts.length-1,i+2)];return Math.atan2(b[1]-a[1],b[0]-a[0])};
  const otherRiverNear=(x,y,d,self)=>rivers.some(r=>r!==self&&r.pts.some((p,i)=>i%2===0&&Math.hypot(p[0]-x,p[1]-y)<d));
  for(const r of rivers){
    const n=r.pts.length,lim=r.main?r.mouth?r.pts.length:n:n;let nd=0,nbt=0,ng=0;
    // dams across the narrower, straighter stretches
    for(let tries=0;tries<30&&nd<(r.main?2:1);tries++){
      const i=((.25+.5*H(tries,r.id,661))*n)|0,w=r.w[i];if(i<6||i>n-8||w<2.6||w>7.2)continue;
      const a1=tang(r.pts,i-4),a2=tang(r.pts,i+4),d=Math.abs(Math.atan2(Math.sin(a1-a2),Math.cos(a1-a2)));if(d>.4)continue;
      const [x,y]=r.pts[i];if(!land(x,y)||inObst(x,y,3)||taken.some(q=>Math.hypot(q[0]-x,q[1]-y)<46))continue;
      dams.push([x,y,tang(r.pts,i)+Math.PI/2,w*1.35+3.2,'dam'+((H(tries,r.id,662)*6)|0)]);taken.push([x,y,10]);nd++}
    // little boats on the wide stretches, and a sailing boat on the widest
    if(r.main){for(let tries=0;tries<40&&nbt<3;tries++){
      const i=((.5+.45*H(tries,r.id,663))*n)|0,w=r.w[i];if(i>=n-3||w<4.2)continue;const [x,y]=r.pts[i];if(!land(x,y)||inObst(x,y,3)||taken.some(q=>Math.hypot(q[0]-x,q[1]-y)<22))continue;
      const sail=w>6&&nbt===0;boats.push([x,y,tang(r.pts,i)+(H(tries,r.id,664)-.5)*.5,sail?11:7,(sail?'sb':'rb')+((H(tries,r.id,665)*(sail?4:8))|0),H(tries,r.id,666)<.5]);taken.push([x,y,8]);nbt++}}
    // groves on the banks, here and there
    for(let tries=0;tries<60&&ng<(r.main?9:4);tries++){
      const i=(H(tries,r.id,667)*n)|0,w=r.w[i];if(i<3||i>n-6||w<1.2||H(tries,r.id,668)<.38)continue;
      const a=tang(r.pts,i),side=H(tries,r.id,669)<.5?1:-1,off=w/2+5+H(tries,r.id,670)*4,x=r.pts[i][0]-Math.sin(a)*off*side,y=r.pts[i][1]+Math.cos(a)*off*side;
      if(!free(x,y,9)||otherRiverNear(x,y,w/2+7,r))continue;
      groves.push([x,y,12+H(tries,r.id,671)*5,'grv'+((H(tries,r.id,672)*20)|0)]);taken.push([x,y,9]);ng++}}
  // a bridge where a road crosses a river
  for(const rd of M.rd){const p=rd.pts;for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1];
    for(const r of rivers){if(a[0]<r.bb[0]&&b[0]<r.bb[0]||a[0]>r.bb[2]&&b[0]>r.bb[2]||a[1]<r.bb[1]&&b[1]<r.bb[1]||a[1]>r.bb[3]&&b[1]>r.bb[3])continue;
      for(let j=0;j<r.pts.length-1;j++){const c=r.pts[j],d=r.pts[j+1],s1x=b[0]-a[0],s1y=b[1]-a[1],s2x=d[0]-c[0],s2y=d[1]-c[1],den=-s2x*s1y+s1x*s2y;if(Math.abs(den)<1e-9)continue;
        const s=(-s1y*(a[0]-c[0])+s1x*(a[1]-c[1]))/den,t=(s2x*(a[1]-c[1])-s2y*(a[0]-c[0]))/den;
        if(s>=0&&s<=1&&t>=0&&t<=1){const x=a[0]+t*s1x,y=a[1]+t*s1y;if(!bridges.some(q=>Math.hypot(q[0]-x,q[1]-y)<12))bridges.push([x,y,Math.atan2(s1y,s1x),r.w[j]+5])}}}}}
  M.rvx={dams,boats,groves,bridges};
  // what the scenery keeps clear of: the water and its banks, and the details
  const av=[];for(const r of rivers)for(let i=0;i<r.pts.length;i+=1){const p=r.pts[i],a=tang(r.pts,i),hw=r.w[i]/2+1;av.push([p[0],p[1]],[p[0]-Math.sin(a)*hw,p[1]+Math.cos(a)*hw],[p[0]+Math.sin(a)*hw,p[1]-Math.cos(a)*hw])}
  for(const g of groves)av.push([g[0],g[1]],[g[0]-4,g[1]],[g[0]+4,g[1]]);
  M.rvAvoid=av}

/* a picture laid on the river, centre at (x,y), turned by ang, len units long (the long way) */
function wmrSpr(c,name,x,y,ang,len,flip){
  const r=WMN_RECTS[name];if(!r||!WMN.ok)return;const im=r[0]==='a'?WMN.a:WMN.s,w=len,h=len*r[4]/r[3];
  c.save();c.translate(x,y);c.rotate(ang);if(flip)c.scale(1,-1);c.drawImage(im,r[1],r[2],r[3],r[4],-w/2,-h/2,w,h);c.restore()}
function wmnRivers(V,z){
  const c=ctx,H=hash2,M=mpWorldM;if(!M.rivers)return;
  let pat=WMN.waterPat;if(!pat&&WMN.water){pat=WMN.waterPat=c.createPattern(WMN.water,'repeat');if(pat&&pat.setTransform)try{pat.setTransform(new DOMMatrix([.15,0,0,.15,0,0]))}catch(e){}}
  const minW=.4/z*.7,vis=[];
  // the two banks of every river showing, as lines of points
  for(const r of M.rivers){const bb=r.bb;if(bb[2]<V.x0||bb[0]>V.x1||bb[3]<V.y0||bb[1]>V.y1)continue;
    const pts=r.pts,n=pts.length,L=[],Rr=[];
    for(let i=0;i<n;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)],tx=b[0]-a[0],ty=b[1]-a[1],ln=Math.hypot(tx,ty)||1,nx=-ty/ln,ny=tx/ln,wob=(Math.sin(i*.7+r.id)+Math.sin(i*1.9+r.id*2)*.5)*.14;
      let hw=Math.max(r.w[i],.3)/2;{const a2=pts[Math.max(0,i-3)],b2=pts[Math.min(n-1,i+3)],c2=pts[i],d1=Math.atan2(c2[1]-a2[1],c2[0]-a2[0]),d2=Math.atan2(b2[1]-c2[1],b2[0]-c2[0]),dth=Math.abs(Math.atan2(Math.sin(d2-d1),Math.cos(d2-d1))),sl=(Math.hypot(c2[0]-a2[0],c2[1]-a2[1])+Math.hypot(b2[0]-c2[0],b2[1]-c2[1]))/2;
        if(dth>.05)hw=Math.min(hw,.75*sl/dth)}   // on a tight bend the banks must not cross over each other
      L.push([pts[i][0]+nx*(hw+wob),pts[i][1]+ny*(hw+wob)]);Rr.push([pts[i][0]-nx*(hw-wob*.6),pts[i][1]-ny*(hw-wob*.6)])}
    vis.push({r,pts,n,L,Rr})}
  // a bank line: only the stretches that are not lying in another river's water (where two rivers meet, the line must not cross the water of the one it joins)
  const bankLine=(g,side,hide,lw,gap)=>{const n=g.n;for(let i=1;i<n;i++){const ha=hide[i-1],hb=hide[i];if(ha&&hb)continue;if(g.r.w[i]<.45)continue;if(gap&&H(i,g.r.id,675)<.04)continue;
      let x0=side[i-1][0],y0=side[i-1][1],x1=side[i][0],y1=side[i][1];if(ha){x0=(x0+x1)/2;y0=(y0+y1)/2}else if(hb){x1=(x0+x1)/2;y1=(y0+y1)/2}
      c.lineWidth=typeof lw==='function'?lw(i):lw;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke()}};
  c.save();c.clip(M.landP);c.lineJoin='round';c.lineCap='round';
  // 1. the soft earthy shadow of the banks, all rivers first, so that every river's water covers every other's shadow
  c.strokeStyle='rgba(116,88,48,.3)';for(const g of vis){bankLine(g,g.L,g.r.hL,2.8,false);bankLine(g,g.Rr,g.r.hR,2.8,false)}
  // 2. the water, the painted wash
  for(const g of vis){const {n,L,Rr}=g;c.beginPath();c.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)c.lineTo(L[i][0],L[i][1]);for(let i=n-1;i>=0;i--)c.lineTo(Rr[i][0],Rr[i][1]);c.closePath();
    c.fillStyle=pat||'#86b0b6';c.fill();c.fillStyle='rgba(84,106,82,.25)';c.fill()}
  // 3. the darker water along each bank (pooling), and the ink banks, drawn with a quill: the line thickens and thins, and now and then lifts
  for(const g of vis){c.strokeStyle='rgba(46,76,66,.30)';bankLine(g,g.L,g.r.hL,2.0,false);bankLine(g,g.Rr,g.r.hR,2.0,false)}
  c.strokeStyle='rgba(66,44,26,.62)';
  for(const g of vis){const lw=i=>Math.max(minW,Math.min(.7,.24*g.r.w[i]+.22+.22*H(i>>1,g.r.id,676)));bankLine(g,g.L,g.r.hL,lw,true);bankLine(g,g.Rr,g.r.hR,lw,true)}
  // 4. short hatching on the banks and wavy ripples on the water
  for(const g of vis){const {r,pts,n,L,Rr}=g;
    c.strokeStyle='rgba(50,32,20,.5)';c.lineWidth=Math.max(.25,.3/z);c.beginPath();let acc=0;
    for(let i=1;i<n;i++){acc+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(acc<(z>1.2?4:7))continue;acc=0;if(r.w[i]<1)continue;const left=!!(i&1);if((left?r.hL:r.hR)[i])continue;const side=left?L:Rr,s=left?1:-1,a=tang2(pts,i);
      const hx=side[i][0],hy=side[i][1];c.moveTo(hx,hy);c.lineTo(hx-Math.sin(a)*s*1.6,hy+Math.cos(a)*s*1.6)}c.stroke();
    if(z>.5){c.strokeStyle='rgba(250,255,255,.5)';c.lineWidth=.3;c.beginPath();acc=0;for(let i=1;i<n;i++){acc+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(acc<13)continue;acc=0;if(r.w[i]<2.6)continue;const ox=(H(i,r.id,677)-.5)*r.w[i]*.5;
        const ta=tang2(pts,i),ux=Math.cos(ta),uy=Math.sin(ta),px=pts[i][0]-uy*ox,py=pts[i][1]+ux*ox;c.moveTo(px-ux*1.5,py-uy*1.5);c.quadraticCurveTo(px-uy*.7,py+ux*.7,px+ux*1.5,py+uy*1.5)}c.stroke()}}
  c.restore();
  // where a river runs out into the sea: the coast line is rubbed out across its mouth, and the river's water carries on a little way into the sea, fading out
  for(const g of vis){const {r,pts,L,Rr,n}=g;if(!(r.main&&r.mouth))continue;const ic=r.mouth.i,i0=Math.max(0,ic-4);let i1=ic,d=0;while(i1<n-1&&d<18){d+=Math.hypot(pts[i1+1][0]-pts[i1][0],pts[i1+1][1]-pts[i1][1]);i1++}
    let pa=pts[Math.max(0,ic-1)],pb=pts[ic];if(M.isLand(pa[0],pa[1])&&!M.isLand(pb[0],pb[1])){for(let k=0;k<8;k++){const mx=(pa[0]+pb[0])/2,my=(pa[1]+pb[1])/2;if(M.isLand(mx,my))pa=[mx,my];else pb=[mx,my]}}
    const X=pb,ux=pb[0]-pts[Math.max(0,ic-1)][0],uy=pb[1]-pts[Math.max(0,ic-1)][1],ul=Math.hypot(ux,uy)||1,vx=ux/ul,vy=uy/ul,gr=c.createLinearGradient(X[0]-vx*8,X[1]-vy*8,X[0]+vx*16,X[1]+vy*16);
    gr.addColorStop(0,'rgba(92,118,114,0)');gr.addColorStop(.29,'rgba(92,118,114,1)');gr.addColorStop(.45,'rgba(92,118,114,.9)');gr.addColorStop(1,'rgba(92,118,114,0)');
    c.save();c.beginPath();c.moveTo(L[i0][0],L[i0][1]);for(let i=i0+1;i<=i1;i++)c.lineTo(L[i][0],L[i][1]);for(let i=i1;i>=i0;i--)c.lineTo(Rr[i][0],Rr[i][1]);c.closePath();c.fillStyle=gr;c.fill();c.restore()}
  // where a river runs out into the sea: a pale wash of river water in the sea water
  for(const g of vis){const {r,pts}=g;if(r.main&&r.mouth){const m=pts[r.mouth.i],a=tang2(pts,r.mouth.i);c.save();c.clip(M.waterP,'evenodd');c.translate(m[0]+Math.cos(a)*4,m[1]+Math.sin(a)*4);c.rotate(a);c.scale(1.5,1);
      const g2=c.createRadialGradient(0,0,0,0,0,r.w[r.mouth.i]*1.1+3);g2.addColorStop(0,'rgba(96,120,114,.45)');g2.addColorStop(1,'rgba(96,120,114,0)');c.fillStyle=g2;c.beginPath();c.arc(0,0,r.w[r.mouth.i]*1.1+3,0,TAU);c.fill();c.restore()}}
  // the details: dams, then boats, then groves
  const X=M.rvx;if(!X)return;
  for(const [x,y,a,len,nm] of X.dams)if(x>V.x0-10&&x<V.x1+10&&y>V.y0-10&&y<V.y1+10)wmrSpr(c,nm,x,y,a,len,false);
  for(const [x,y,a,len,nm,fl] of X.boats)if(x>V.x0-10&&x<V.x1+10&&y>V.y0-10&&y<V.y1+10){if(nm[0]==='s'){const r=WMN_RECTS[nm];if(r)wmnDraw(c,nm,x,y+len*r[4]/r[3]*.35,len,true,fl)}else wmrSpr(c,nm,x,y,a,len,fl)}
  const gs=X.groves.filter(g=>g[0]>V.x0-12&&g[0]<V.x1+12&&g[1]>V.y0-12&&g[1]<V.y1+24).sort((p,q)=>p[1]-q[1]);
  for(const [x,y,h,nm] of gs)wmnDraw(c,nm,x,y+h*.45,h,false)}
function tang2(pts,i){const a=pts[Math.max(0,i-2)],b=pts[Math.min(pts.length-1,i+2)];return Math.atan2(b[1]-a[1],b[0]-a[0])}
/* the plank bridges where roads cross rivers */
function wmnBridges(V,z){
  const c=ctx,M=mpWorldM;if(!M.rvx)return;
  for(const [x,y,a,len] of M.rvx.bridges){if(x<V.x0-10||x>V.x1+10||y<V.y0-10||y>V.y1+10)continue;
    c.save();c.translate(x,y);c.rotate(a);c.fillStyle='#a98652';c.strokeStyle='rgba(50,32,20,.9)';c.lineWidth=.5;c.beginPath();c.rect(-len/2,-1.5,len,3);c.fill();c.stroke();
    c.strokeStyle='rgba(50,32,20,.55)';c.lineWidth=.28;c.beginPath();for(let q=-len/2+1.1;q<len/2-.5;q+=1.4){c.moveTo(q,-1.5);c.lineTo(q,1.5)}c.stroke();
    c.strokeStyle='rgba(50,32,20,.92)';c.lineWidth=.5;c.beginPath();c.moveTo(-len/2,-1.9);c.lineTo(len/2,-1.9);c.moveTo(-len/2,1.9);c.lineTo(len/2,1.9);c.stroke();
    c.fillStyle='rgba(50,32,20,.9)';for(const s of [-1,1]){c.fillRect(s*len/2-.4,-2.1,.8,.8);c.fillRect(s*len/2-.4,1.3,.8,.8)}c.restore()}}
