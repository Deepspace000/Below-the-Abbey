/* ==========================================================================
   Oldhaven map section BASE (order 0): the sea and coast, the moat and river, fields, orchards and woods outside the wall, the great curtain wall ring with towers
   and three gates, the quay and piers, the ground wash and roads inside the wall, title, notes, key and compass. Real cells (level 305, 150 x 150): wall ring cells 0..5 and
   144..149, Portcullis Gate x73..75 (south), Land Gate x100..101 (north), East Gate y73..74 (east), towers every 17 cells, ring road at cells 6..7 / 142..143.
   Everything is named mpOhBase... A second object (order 99) lays the road labels over the sections.
   ========================================================================== */
const mpOhBaseH=(a,b,k)=>hash2(a,b,(k||0)+810);
/* a smooth line through points (Catmull-Rom), n steps per span */
function mpOhBaseSmooth(p,n){const o=[],N=p.length,g=i=>p[Math.max(0,Math.min(N-1,i))];
  for(let i=0;i<N-1;i++){const a=g(i-1),b=g(i),c=g(i+1),d=g(i+2);for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;
    o.push([.5*(2*b[0]+(-a[0]+c[0])*t+(2*a[0]-5*b[0]+4*c[0]-d[0])*t2+(-a[0]+3*b[0]-3*c[0]+d[0])*t3),.5*(2*b[1]+(-a[1]+c[1])*t+(2*a[1]-5*b[1]+4*c[1]-d[1])*t2+(-a[1]+3*b[1]-3*c[1]+d[1])*t3)])}}
  o.push(p[N-1]);return o}
function mpOhBasePoly(x,pts,close){x.beginPath();pts.forEach((q,i)=>i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]));if(close)x.closePath()}
/* a pen line along points with a little wobble */
function mpOhBaseInk(x,pts,seed,j,lw,col,al){x.save();x.strokeStyle=col||MPL.INK;x.lineWidth=lw||.8;x.globalAlpha=al==null?1:al;x.lineJoin='round';x.lineCap='round';x.beginPath();
  pts.forEach((q,i)=>{const px=q[0]+(mpOhBaseH(i,seed,1)-.5)*j,py=q[1]+(mpOhBaseH(i,seed,2)-.5)*j;i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke();x.restore()}
/* a wobbly blob */
function mpOhBaseBlob(x,cx,cy,r,seed,ry){ry=ry||r;x.beginPath();const n=9;for(let k=0;k<n;k++){const an=k/n*6.2832,rr=.8+.4*mpOhBaseH(k,seed,3);const px=cx+Math.cos(an)*r*rr,py=cy+Math.sin(an)*ry*rr;k?x.lineTo(px,py):x.moveTo(px,py)}x.closePath()}
/* a sailing ship (carrack) seen from the side, size s, fl = flipped */
function mpOhBaseShip(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale(s*(fl?-1:1),s);x.lineJoin='round';x.lineCap='round';const INK=MPL.INK;
  x.strokeStyle='rgba(30,70,110,.7)';x.lineWidth=.7;for(let k=-2;k<=2;k++){x.beginPath();x.moveTo(k*8-5,5.8);x.quadraticCurveTo(k*8-2.5,3.8,k*8,5.8);x.quadraticCurveTo(k*8+2.5,7.8,k*8+5,5.8);x.stroke()}
  x.strokeStyle=INK;x.lineWidth=.55;x.beginPath();x.moveTo(-1,-3.6);x.lineTo(-1,-28);x.moveTo(-9,-2.6);x.lineTo(-9,-19);x.moveTo(8,-7.5);x.lineTo(8,-21);x.moveTo(-15,-2);x.lineTo(-22,-5.5);x.stroke();
  const sail=(p,col,band)=>{x.fillStyle=col;x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.moveTo(p[0],p[1]);x.quadraticCurveTo(p[0]+p[2]/2,p[1]+2.4,p[0]+p[2],p[1]);x.lineTo(p[0]+p[2]+.5,p[1]+p[3]);x.quadraticCurveTo(p[0]+p[2]/2,p[1]+p[3]+2.6,p[0]-.5,p[1]+p[3]);x.closePath();x.fill();x.stroke();
    if(band){x.strokeStyle=band;x.lineWidth=1.5;x.beginPath();x.moveTo(p[0]+p[2]/2,p[1]+1.6);x.lineTo(p[0]+p[2]/2,p[1]+p[3]+1.4);x.moveTo(p[0]+.8,p[1]+p[3]*.45);x.lineTo(p[0]+p[2]-.8,p[1]+p[3]*.45);x.stroke()}};
  sail([-5.5,-27.6,9,3.2],'#f3ead0',null);sail([-7,-23.8,12,13.4],'#f3ead0',MPL.VERM);sail([-12.4,-18.4,6.8,9],'#f3ead0',MPL.LAPIS);
  x.fillStyle='#f3ead0';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.moveTo(8,-20);x.lineTo(15.5,-8.6);x.lineTo(3,-9.4);x.closePath();x.fill();x.stroke();
  x.fillStyle='#7a4c28';x.strokeStyle=INK;x.lineWidth=.9;x.beginPath();x.moveTo(-15,-2);x.quadraticCurveTo(-12.5,6.2,-4,6.6);x.lineTo(9,6.6);x.quadraticCurveTo(14.2,5.4,14.8,-8);x.lineTo(9.6,-8);x.lineTo(9,-4);x.lineTo(-3,-3.6);x.lineTo(-8,-2.4);x.closePath();x.fill();x.stroke();
  x.strokeStyle='rgba(30,16,8,.55)';x.lineWidth=.4;x.beginPath();x.moveTo(-12.6,1.2);x.lineTo(13,.6);x.moveTo(-10,3.6);x.lineTo(12.4,3.2);x.stroke();
  x.strokeStyle=MPL.GOLD;x.lineWidth=.7;x.beginPath();x.moveTo(-14.4,-1);x.lineTo(-3,-2.2);x.lineTo(9,-2.6);x.lineTo(14.6,-3);x.stroke();
  x.fillStyle=MPL.GOLD2;for(const px of [11,13]){x.beginPath();x.arc(px,-5.2,.55,0,6.3);x.fill()}
  x.strokeStyle='rgba(42,26,12,.6)';x.lineWidth=.3;x.beginPath();x.moveTo(-1,-28);x.lineTo(-15,-2);x.moveTo(-1,-28);x.lineTo(14.8,-8);x.moveTo(-9,-19);x.lineTo(-15,-2);x.stroke();
  x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(-1,-28);x.lineTo(6.4,-26.8);x.lineTo(-1,-25.2);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD;for(const p of [[-9,-19],[8,-21]]){x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(p[0]+4.6,p[1]+.8);x.lineTo(p[0],p[1]+2);x.closePath();x.fill();x.stroke()}
  x.restore()}
/* a small ship seen from above, tied to a pier: bow down */
function mpOhBaseBoat(x,cx,cy,w,l,col,mast){x.save();x.translate(cx,cy);x.lineJoin='round';
  x.fillStyle='rgba(30,70,110,.25)';x.beginPath();x.ellipse(0,l*.5+.4,w*.85,l*.62,0,0,6.3);x.fill();
  x.fillStyle=col||'#8a5a30';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(-w/2,0);x.quadraticCurveTo(-w/2,l*.78,0,l);x.quadraticCurveTo(w/2,l*.78,w/2,0);x.closePath();x.fill();x.stroke();
  x.strokeStyle='rgba(30,16,8,.5)';x.lineWidth=.3;for(let k=1;k<l*.7;k+=1.6){x.beginPath();x.moveTo(-w/2+.5,k);x.lineTo(w/2-.5,k);x.stroke()}
  if(mast){x.fillStyle='#f0e6c8';x.strokeStyle=MPL.INK;x.lineWidth=.4;x.fillRect(-w*.95,l*.28,w*1.9,1.4);x.strokeRect(-w*.95,l*.28,w*1.9,1.4);x.fillStyle=MPL.VERM;x.fillRect(-w*.95,l*.28+.4,w*1.9*.5,.6);x.fillStyle=MPL.INK;x.beginPath();x.arc(0,l*.28+.7,.7,0,6.3);x.fill()}
  x.restore()}
/* a sea serpent: head and neck, then three humps, drawn in verdigris with ink */
function mpOhBaseSerpent(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);x.lineJoin='round';x.lineCap='round';const INK=MPL.INK;
  const arc=(x0,x1,h)=>{const o=[];for(let k=0;k<=14;k++){const t=k/14;o.push([x0+(x1-x0)*t,-h*Math.sin(t*Math.PI)])}return o};
  const humps=[arc(26,40,6.4),arc(8,24,9.4),arc(-10,6,8.6)];
  const neck=mpOhBaseSmooth([[-12,0],[-14,-8],[-19,-15],[-25,-17.6]],6);
  const tube=(pts)=>{for(const [lw,col,off] of [[5.6,INK,0],[4.1,'#4a8a64',0],[1.3,'#a9d2a4',-1.1]]){x.strokeStyle=col;x.lineWidth=lw;x.beginPath();pts.forEach((q,i)=>i?x.lineTo(q[0],q[1]+off):x.moveTo(q[0],q[1]+off));x.stroke()}};
  for(const hmp of humps)tube(hmp);tube(neck);
  // scales and spines
  x.strokeStyle='rgba(20,50,34,.7)';x.lineWidth=.35;for(const hmp of humps)for(let k=1;k<hmp.length-1;k+=2){const q=hmp[k];x.beginPath();x.arc(q[0],q[1]+.4,1.3,.2,2.9);x.stroke()}
  x.fillStyle='#2f6a4a';x.strokeStyle=INK;x.lineWidth=.45;for(const hmp of humps)for(let k=2;k<hmp.length-2;k+=3){const q=hmp[k];x.beginPath();x.moveTo(q[0]-1.1,q[1]-2);x.lineTo(q[0]+.2,q[1]-4.6);x.lineTo(q[0]+1.3,q[1]-1.8);x.closePath();x.fill();x.stroke()}
  // tail fin
  x.fillStyle='#4a8a64';x.beginPath();x.moveTo(40,0);x.lineTo(46,-6.5);x.lineTo(43,-.5);x.lineTo(47.5,-2.2);x.lineTo(40.6,1.2);x.closePath();x.fill();x.stroke();
  // head: skull, open jaw, tongue, eye, crest
  x.save();x.translate(-27.2,-18.6);x.rotate(-.18);
  x.fillStyle='#4a8a64';x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.ellipse(0,0,5.6,3.2,0,0,6.3);x.fill();x.stroke();
  x.beginPath();x.moveTo(-4.6,1.2);x.lineTo(-8.4,4);x.lineTo(-3,3.6);x.closePath();x.fillStyle='#3a7a54';x.fill();x.stroke();
  x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(-5,1.6);x.lineTo(-9.8,3.6);x.lineTo(-8.4,4.6);x.lineTo(-10.6,5.4);x.lineTo(-6,3.2);x.closePath();x.fill();x.stroke();
  x.fillStyle='#fff6d0';for(const px of [-4.4,-2.6]){x.beginPath();x.moveTo(px,1.3);x.lineTo(px+.5,2.8);x.lineTo(px+1,1.3);x.fill()}
  x.fillStyle='#fff3b0';x.beginPath();x.arc(-1,-.8,1.15,0,6.3);x.fill();x.stroke();x.fillStyle=INK;x.beginPath();x.arc(-1.2,-.8,.5,0,6.3);x.fill();
  x.fillStyle='#2f6a4a';for(const [px,py,pl] of [[1.6,-2.8,3],[3.6,-2.2,3.4],[5.2,-1,2.6]]){x.beginPath();x.moveTo(px-1,py+.4);x.lineTo(px+1.4,py-pl);x.lineTo(px+1.6,py+.8);x.closePath();x.fill();x.stroke()}
  x.restore();
  // foam where the body meets the water
  x.fillStyle='rgba(250,250,240,.85)';x.strokeStyle='rgba(30,70,110,.7)';x.lineWidth=.35;for(const px of [-12,-10,6,8,24,26,40]){x.beginPath();x.ellipse(px,.3,2.6,1,0,0,6.3);x.fill();x.stroke()}
  x.restore()}
/* a kraken: a mantle with two eyes and curling tentacles, and a small ship in its grip */
function mpOhBaseKraken(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);x.lineJoin='round';x.lineCap='round';const INK=MPL.INK;
  const tent=(pts,w0)=>{const sm=mpOhBaseSmooth(pts,5);for(const [k0,col] of [[1.5,INK],[0,'#a14a34']]){for(let i=1;i<sm.length;i++){const t=i/sm.length;x.strokeStyle=col;x.lineWidth=Math.max(.5,(w0*(1-t*.82))+k0);x.beginPath();x.moveTo(sm[i-1][0],sm[i-1][1]);x.lineTo(sm[i][0],sm[i][1]);x.stroke()}}
    x.fillStyle='#f1dfc2';for(let i=3;i<sm.length-2;i+=3){x.beginPath();x.arc(sm[i][0]+(i%2?-.6:.6),sm[i][1]-.5,.55*(1-i/sm.length*.6),0,6.3);x.fill()}};
  tent([[-4,2],[-12,-6],[-20,-8],[-26,-16],[-23,-22],[-19,-20]],4);
  tent([[-2,2],[-6,-10],[-4,-20],[-10,-26],[-16,-24]],3.6);
  tent([[5,2],[12,-5],[20,-4],[26,-11],[24,-17],[20,-16]],4);
  tent([[2,2],[8,-12],[6,-22],[12,-27],[18,-25]],3.4);
  tent([[0,3],[-1,-8],[3,-14]],3);
  x.fillStyle='#a14a34';x.strokeStyle=INK;x.lineWidth=.9;x.beginPath();x.ellipse(0,-6,7.2,9.2,0,0,6.3);x.fill();x.stroke();
  x.fillStyle='rgba(60,16,10,.3)';x.beginPath();x.ellipse(3,-5,3.8,7,0,0,6.3);x.fill();
  x.fillStyle='#d9704e';for(const [px,py] of [[-3,-11],[2,-13],[-1,-7],[3,-8]]){x.beginPath();x.arc(px,py,.8,0,6.3);x.fill()}
  for(const px of [-3,3]){x.fillStyle='#fff3b0';x.beginPath();x.ellipse(px,-1.6,2.1,1.7,0,0,6.3);x.fill();x.stroke();x.fillStyle=INK;x.beginPath();x.arc(px,-1.4,.9,0,6.3);x.fill()}
  x.restore();
  // foam round the base
  x.save();x.translate(cx,cy);x.scale(s,s);x.fillStyle='rgba(250,250,240,.85)';x.strokeStyle='rgba(30,70,110,.7)';x.lineWidth=.35;for(let k=-5;k<=5;k++){x.beginPath();x.ellipse(k*2.4,3.2+(k%2)*.4,2.2,.9,0,0,6.3);x.fill();x.stroke()}x.restore()}
/* a round tower seen from above: drum, ring, merlons, a conical roof with spokes, an optional pennant */
function mpOhBaseTower(x,a,b,r,roof,flag){x.save();x.fillStyle='rgba(40,26,12,.3)';x.beginPath();x.arc(a+.7,b+.9,r,0,6.3);x.fill();
  x.fillStyle='#d6ccb0';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();x.stroke();
  x.fillStyle='#bdb292';for(let k=0;k<8;k++){const an=k*Math.PI/4+.2;x.fillRect(a+Math.cos(an)*r*.88-.45,b+Math.sin(an)*r*.88-.45,.9,.9)}
  x.fillStyle=roof;x.beginPath();x.arc(a,b,r*.64,0,6.3);x.fill();x.lineWidth=.5;x.stroke();
  x.strokeStyle='rgba(255,240,200,.55)';x.lineWidth=.3;for(let k=0;k<8;k++){const an=k*Math.PI/4;x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.cos(an)*r*.64,b+Math.sin(an)*r*.64);x.stroke()}
  if(flag){x.strokeStyle=MPL.INK;x.lineWidth=.45;x.beginPath();x.moveTo(a,b);x.lineTo(a,b-r*1.7);x.stroke();x.fillStyle=flag;x.beginPath();x.moveTo(a,b-r*1.7);x.lineTo(a+r*1.1,b-r*1.45);x.lineTo(a,b-r*1.15);x.closePath();x.fill();x.lineWidth=.35;x.stroke()}
  x.restore()}
/* a field: a slightly skewed quadrilateral with a wash, furrows and a hedge */
function mpOhBaseField(x,a,b,w,h,kind,seed){
  const cols={wheat:'#dccb78',plough:'#bfa070',green:'#a8c070',meadow:'#c0cc8c',flax:'#bdbcd8',fallow:'#cdbf8a',orchard:'#b6c47e'};
  const j=(k)=>(mpOhBaseH(seed,k,4)-.5)*2.4,P=[[a+j(1),b+j(2)],[a+w+j(3),b+j(4)],[a+w+j(5),b+h+j(6)],[a+j(7),b+h+j(8)]];
  x.save();mpOhBasePoly(x,P,true);x.fillStyle=cols[kind]||cols.green;x.fill();x.clip();
  x.globalAlpha=.1;x.fillStyle='#fff';x.fillRect(a,b,w,h/2);x.globalAlpha=1;
  const vert=mpOhBaseH(seed,9,4)<.5,col=kind==='plough'?'#7a5a34':kind==='wheat'?'#a8903a':kind==='flax'?'#8a86b4':'#6c8a40';
  if(kind!=='orchard'&&kind!=='meadow'){x.strokeStyle=col;x.lineWidth=.35;x.globalAlpha=.7;x.beginPath();
    if(vert){for(let u=a+1;u<a+w;u+=1.5){x.moveTo(u,b);x.lineTo(u+(mpOhBaseH(seed,u|0,5)-.5),b+h)}}else{for(let v=b+1;v<b+h;v+=1.5){x.moveTo(a,v);x.lineTo(a+w,v+(mpOhBaseH(seed,v|0,5)-.5))}}x.stroke();x.globalAlpha=1}
  if(kind==='meadow'){x.strokeStyle='#5f7f38';x.lineWidth=.4;for(let i=0;i<w*h/9;i++){const px=a+mpOhBaseH(seed,i,6)*w,py=b+mpOhBaseH(seed,i,7)*h;x.beginPath();x.moveTo(px,py);x.lineTo(px-.5,py-1.1);x.moveTo(px,py);x.lineTo(px+.5,py-1.1);x.stroke()}}
  if(kind==='orchard'){const dx=3.4;for(let u=a+2;u<a+w-1;u+=dx)for(let v=b+2;v<b+h-1;v+=dx){x.fillStyle=(u+v|0)%3?'#6f9a50':'#5f8a46';x.strokeStyle=MPL.INK;x.lineWidth=.3;x.beginPath();x.arc(u,v,1.25,0,6.3);x.fill();x.stroke();
    if(mpOhBaseH(u|0,v|0,8)<.4){x.fillStyle=MPL.VERM;x.beginPath();x.arc(u+.4,v+.2,.35,0,6.3);x.fill()}}}
  x.restore();
  // hedge: little bushes along the edge and an ink outline
  mpOhBasePoly(x,P,true);x.strokeStyle='rgba(42,26,12,.75)';x.lineWidth=.5;x.stroke();
  x.fillStyle='#5f8a46';for(let i=0;i<4;i++){const p0=P[i],p1=P[(i+1)%4],n=Math.round(Math.hypot(p1[0]-p0[0],p1[1]-p0[1])/2.6);for(let k=0;k<n;k++)if(mpOhBaseH(seed,i*50+k,10)<.6){const t=(k+.5)/n;x.beginPath();x.arc(p0[0]+(p1[0]-p0[0])*t,p0[1]+(p1[1]-p0[1])*t,.7,0,6.3);x.fill()}}}
/* a wood: a soft wash and many small trees, drawn back to front */
function mpOhBaseWood(x,cx,cy,rx,ry,n,seed){const I=MPLI;x.save();x.globalAlpha=.4;x.fillStyle='#7f9a56';mpOhBaseBlob(x,cx,cy,rx*1.05,seed,ry*1.05);x.fill();x.restore();
  const t=[];for(let i=0;i<n;i++){const an=mpOhBaseH(seed,i,11)*6.28,rr=Math.sqrt(mpOhBaseH(seed,i,12));t.push([cx+Math.cos(an)*rx*rr,cy+Math.sin(an)*ry*rr,mpOhBaseH(seed,i,13)])}
  t.sort((p,q)=>p[1]-q[1]);for(const [a,b,h] of t){h<.3?I.pine(x,a,b,.5+h*.3):I.tree(x,a,b,.5+h*.35,['#5f8a4a','#4a7a46','#6c9450','#7a9a4c'][(h*40|0)%4])}}
/* a cartouche: a gold-edged scroll of parchment */
function mpOhBaseScroll(x,a,b,w,h){x.save();x.fillStyle='rgba(60,40,16,.25)';x.fillRect(a+1.6,b+1.8,w,h);x.fillStyle='#ecdfb6';x.fillRect(a,b,w,h);
  x.globalAlpha=.25;for(let i=0;i<14;i++){x.fillStyle=i%2?'#c9a86a':'#fff6dc';mpOhBaseBlob(x,a+mpOhBaseH(i,1,14)*w,b+mpOhBaseH(i,2,14)*h,5+mpOhBaseH(i,3,14)*8,i,3+mpOhBaseH(i,4,14)*5);x.fill()}x.globalAlpha=1;
  x.strokeStyle=MPL.GOLD;x.lineWidth=1.5;x.strokeRect(a,b,w,h);x.strokeStyle=MPL.INK;x.lineWidth=.5;x.strokeRect(a+2,b+2,w-4,h-4);x.strokeRect(a-1,b-1,w+2,h+2);
  for(const [px,py] of [[a,b],[a+w,b],[a,b+h],[a+w,b+h]]){x.fillStyle=MPL.GOLD;x.beginPath();x.arc(px,py,2.6,0,6.3);x.fill();x.strokeStyle=MPL.INK;x.lineWidth=.5;x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.arc(px,py,1.1,0,6.3);x.fill()}
  x.restore()}

MPOH.push({order:0,name:'base',paint(x,L,api,fit){
  const X=fit.X,Y=fit.Y,S=fit.s,I=api.I,INK=MPL.INK,H=mpOhBaseH,rows=L.rows,fm=L.fmap,SW=480,SH=320;
  const X0=X(0),Y0=Y(0),XR=X(150),YB=Y(150);
  const open=(cx,cy)=>cx>=0&&cy>=0&&cx<150&&cy<150&&rows[cy][cx]==='.';
  x.lineJoin='round';x.lineCap='round';
  /* ---------- the sea: its coast, drawn as a smooth line from the north-west to the harbour and round to the south-east ---------- */
  const cl=X0-14;
  const coastPts=mpOhBaseSmooth([[cl-6,-14],[cl+2,10],[cl-3,36],[cl+4,64],[cl-4,96],[cl+3,128],[cl-5,160],[cl+4,192],[cl-2,224],[cl+3,254],[cl-3,276],[X0-8,YB+2],[X0+2,YB+5],[X(18),YB+3],[X(40),YB+6],[X(60),YB+3],[X(90),YB+5],[X(120),YB+3],[XR-4,YB+4],[XR+6,YB+9],[XR+12,YB+22],[XR+10,350]],6);
  const seaPts=coastPts.concat([[-14,350],[-14,-14]]);
  const sea=new Path2D();seaPts.forEach((q,i)=>i?sea.lineTo(q[0],q[1]):sea.moveTo(q[0],q[1]));sea.closePath();
  const isSea=(px,py)=>x.isPointInPath(sea,px*MPL.S,py*MPL.S);
  /* ---------- the land outside the wall: a green and ochre wash, patches and grass tufts ---------- */
  x.save();x.fillStyle='rgba(176,184,108,.34)';x.fillRect(0,0,SW,SH);x.restore();
  for(let i=0;i<90;i++){x.save();x.globalAlpha=.13;x.fillStyle=['#8a9a54','#c9b878','#a8b266','#d8c88c','#7f9a5c'][i%5];mpOhBaseBlob(x,H(i,1,20)*SW,H(i,2,20)*SH,6+H(i,3,20)*18,i,3+H(i,4,20)*9);x.fill();x.restore()}
  x.save();x.strokeStyle='#6a8a40';x.lineWidth=.35;x.globalAlpha=.55;for(let i=0;i<520;i++){const px=H(i,1,21)*SW,py=H(i,2,21)*SH;if(isSea(px,py))continue;x.beginPath();x.moveTo(px,py);x.lineTo(px-.6,py-1.3);x.moveTo(px,py);x.lineTo(px+.6,py-1.3);x.stroke()}x.restore();
  // small hills with hachures in the north east
  for(const [hx,hy,hr] of [[452,118,11],[430,206,9],[466,236,10],[404,262,8]]){x.save();x.strokeStyle='rgba(88,66,40,.55)';x.lineWidth=.6;x.beginPath();x.moveTo(hx-hr,hy);x.quadraticCurveTo(hx,hy-hr*.9,hx+hr,hy);x.stroke();x.lineWidth=.4;for(let k=-3;k<=3;k++){x.beginPath();x.moveTo(hx+k*hr/3.6,hy-hr*.65*(1-Math.abs(k)/4.5));x.lineTo(hx+k*hr/3.2,hy+1.5);x.stroke()}x.restore()}
  /* ---------- fields, orchards, woods and farms in the land strips round the wall ---------- */
  const avoid=(a,b,w,h)=>{
    if(a+w>X0-6.5&&a<XR+6.5&&b+h>Y0-6.2&&b<YB+14)return true;
    if(a+w>270&&a<298&&b<32)return true;                       // the Land Gate road
    if(a+w>XR&&b+h>Y(74)-9&&b<Y(74)+9)return true;           // the east road
    if(a+w>368&&a<392&&b<36)return true;                       // the river
    for(const [px,py] of [[a,b],[a+w,b],[a,b+h],[a+w,b+h],[a+w/2,b+h/2]])if(isSea(px,py))return true;
    return false};
  const kinds=['wheat','plough','green','meadow','flax','fallow','orchard','wheat','green','meadow'];
  const woods=[],farms=[];let sc=0;
  const fillLand=(x0,x1,ya,yb,rowH,seed)=>{for(let y=ya,r=0;y<yb;y+=rowH[r%rowH.length]+1,r++){const h=rowH[r%rowH.length];for(let xx=x0,c=0;xx<x1;c++){const w=13+H(c,r,seed)*15;if(xx+w>x1+6)break;
      if(!avoid(xx,y,w,h)){const t=H(c,r,seed+1),i=++sc;
        if(t<.12)woods.push([xx+w/2,y+h/2,w*.58,h*.58,Math.round(w*h/9),i]);
        else if(t<.2)farms.push([xx,y,w,h,i]);
        else mpOhBaseField(x,xx,y,w,h,kinds[(H(c,r,seed+2)*kinds.length)|0],i)}
      xx+=w+1.2}}};
  fillLand(106,484,9,Y(-2.6)-1.4,[8.4,8],31);
  fillLand(377,484,Y0-5,300,[15,19,13,17,16],41);
  fillLand(384,484,288,322,[16],51);
  for(const w of woods)mpOhBaseWood(x,w[0],w[1],w[2],w[3],w[4],w[5]);
  for(const f of farms){const [a,b,w,h,i]=f;x.save();x.fillStyle='#bccb84';x.fillRect(a,b,w,h);x.strokeStyle='#7a5a34';x.lineWidth=.5;x.setLineDash([1.2,1]);x.strokeRect(a+.8,b+.8,w-1.6,h-1.6);x.setLineDash([]);x.restore();
    I.house(x,a+w*.35,b+h*.62,.55,i%2?MPL.VERM:'#b5593a');I.house(x,a+w*.7,b+h*.7,.42,'#8a6a4a');
    for(let k=0;k<4;k++){const px=a+2+H(i,k,60)*(w-4),py=b+h-2.4-H(i,k,61)*2;x.fillStyle='#f4efe4';x.strokeStyle=INK;x.lineWidth=.3;x.beginPath();x.ellipse(px,py,1.1,.75,0,0,6.3);x.fill();x.stroke();x.fillStyle=INK;x.beginPath();x.arc(px-1,py-.2,.4,0,6.3);x.fill()}}
  // a windmill on a green mound
  {const mx=212,my=18;x.save();x.fillStyle='#9ab05e';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.ellipse(mx,my+4,8,3,0,0,6.3);x.fill();x.stroke();x.fillStyle='#e8dcc0';x.beginPath();x.moveTo(mx-3,my+3.5);x.lineTo(mx-1.8,my-5);x.lineTo(mx+1.8,my-5);x.lineTo(mx+3,my+3.5);x.closePath();x.fill();x.stroke();
    x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(mx-2.2,my-5);x.lineTo(mx,my-8.6);x.lineTo(mx+2.2,my-5);x.closePath();x.fill();x.stroke();x.strokeStyle=INK;x.lineWidth=.6;for(let k=0;k<4;k++){const an=k*Math.PI/2+.6;x.beginPath();x.moveTo(mx,my-5.4);x.lineTo(mx+Math.cos(an)*8,my-5.4+Math.sin(an)*8);x.stroke();x.fillStyle='#f1e8cc';x.save();x.translate(mx,my-5.4);x.rotate(an);x.fillRect(2.4,-1.4,5.4,1.8);x.strokeRect(2.4,-1.4,5.4,1.8);x.restore()}x.restore()}
  /* ---------- roads outside the wall: the Land Gate road north and the east road ---------- */
  const rib=(pts,w,fill,edge,al)=>{x.save();x.lineCap='butt';x.lineJoin='round';x.strokeStyle=edge||'rgba(42,26,12,.8)';x.lineWidth=w+1.3;x.globalAlpha=al==null?1:al;mpOhBasePoly(x,pts);x.stroke();x.strokeStyle=fill;x.lineWidth=w;mpOhBasePoly(x,pts);x.stroke();x.restore()};
  const landRoad=mpOhBaseSmooth([[X(101),Y(-2.6)],[X(101)-1.4,22],[X(101)+2,13],[X(101)+10,6]],5);
  const eastRoad=mpOhBaseSmooth([[X(152.6),Y(74)],[388,Y(74)-1.4],[420,Y(74)+2],[452,Y(74)-2],[484,Y(74)+1]],5);
  rib(landRoad,3.6,'#d8c48c');rib(eastRoad,3.6,'#d8c48c');
  /* ---------- the river: from the north east into the moat ---------- */
  const river=mpOhBaseSmooth([[386,-4],[382,8],[378,18],[375,24],[372,28]],6);
  rib(river,4.4,'#8fb4b4','rgba(42,26,12,.8)');
  for(let i=0;i<10;i++){const q=river[(i*river.length/10)|0];if(q)I.wave(x,q[0],q[1]+.5)}
  /* ---------- the sea itself ---------- */
  x.save();x.clip(sea);
  x.fillStyle='#9fbfc0';x.fillRect(0,0,SW,SH);
  {const g=x.createRadialGradient(0,170,10,0,170,170);g.addColorStop(0,'rgba(46,86,140,.62)');g.addColorStop(.55,'rgba(52,100,150,.3)');g.addColorStop(1,'rgba(52,100,150,0)');x.fillStyle=g;x.fillRect(0,0,SW,SH);
   const g2=x.createLinearGradient(0,YB,0,SH);g2.addColorStop(0,'rgba(120,170,170,.0)');g2.addColorStop(1,'rgba(52,100,150,.35)');x.fillStyle=g2;x.fillRect(0,YB,SW,SH-YB)}
  // soft washes of shallow water along the coast
  for(const [lw,al] of [[40,.1],[28,.13],[18,.17],[10,.22],[4.4,.32]]){x.strokeStyle='rgba(226,238,214,'+al+')';x.lineWidth=lw;mpOhBasePoly(x,coastPts);x.stroke()}
  // swells and waves
  for(let i=0;i<16;i++){const px=H(i,1,70)*SW*.82,py=H(i,2,70)*SH;if(!isSea(px,py))continue;x.strokeStyle='rgba(40,86,130,.3)';x.lineWidth=.6;x.beginPath();x.moveTo(px,py);for(let k=1;k<=6;k++)x.lineTo(px+k*5,py+Math.sin(k*1.3+i)*1.6);x.stroke()}
  for(let i=0;i<460;i++){const px=H(i,1,71)*SW,py=H(i,2,71)*SH;if(!isSea(px,py))continue;const sz=.7+H(i,3,71)*.9;x.strokeStyle='rgba(30,74,118,'+(.3+H(i,4,71)*.3)+')';x.lineWidth=.6;x.beginPath();x.moveTo(px-3*sz,py);x.quadraticCurveTo(px-1.5*sz,py-2*sz,px,py);x.quadraticCurveTo(px+1.5*sz,py+2*sz,px+3*sz,py);x.stroke()}
  // lines of water parallel to the coast
  for(let i=2;i<coastPts.length-2;i++){}
  for(const d of [5,9.5,14.5,20]){x.setLineDash([5,3.4]);x.strokeStyle='rgba(40,86,130,'+(.5-d*.014)+')';x.lineWidth=.5;x.beginPath();let st=0;
    for(let i=3;i<coastPts.length-3;i+=2){const p=coastPts[i],a=coastPts[i-2],b=coastPts[i+2];let tx=b[0]-a[0],ty=b[1]-a[1];const tl=Math.hypot(tx,ty)||1;tx/=tl;ty/=tl;let nx=ty,ny=-tx;if(!isSea(p[0]+nx*3,p[1]+ny*3)){nx=-nx;ny=-ny}
      const px=p[0]+nx*d+(H(i,d,72)-.5)*1.4,py=p[1]+ny*d+(H(i,d,73)-.5)*1.4;st?x.lineTo(px,py):x.moveTo(px,py);st=1}x.stroke();x.setLineDash([])}
  // rhumb lines from the compass
  x.strokeStyle='rgba(39,74,154,.2)';x.lineWidth=.5;for(let k=0;k<16;k++){const an=k*Math.PI/8;x.beginPath();x.moveTo(54,214);x.lineTo(54+Math.cos(an)*320,214+Math.sin(an)*320);x.stroke()}
  x.restore();
  // breakers and the inked coast line, with hatching on the land side
  for(let i=3;i<coastPts.length-3;i++){const p=coastPts[i],a=coastPts[i-2],b=coastPts[i+2];let tx=b[0]-a[0],ty=b[1]-a[1];const tl=Math.hypot(tx,ty)||1;tx/=tl;ty/=tl;let nx=ty,ny=-tx;if(!isSea(p[0]+nx*3,p[1]+ny*3)){nx=-nx;ny=-ny}
    if(p[0]<2||p[0]>SW||p[1]<0||p[1]>SH)continue;
    if(i%2===0){x.strokeStyle='rgba(250,250,240,.9)';x.lineWidth=.9;x.beginPath();x.arc(p[0]+nx*1.4,p[1]+ny*1.4,1+H(i,1,74)*.9,Math.atan2(ny,nx)-1.2,Math.atan2(ny,nx)+1.2);x.stroke();x.strokeStyle='rgba(30,74,118,.55)';x.lineWidth=.3;x.stroke()}
    if(i%3===0){x.strokeStyle='rgba(60,40,18,.5)';x.lineWidth=.35;const l=1.4+H(i,2,74)*2.2;x.beginPath();x.moveTo(p[0]-nx*.8,p[1]-ny*.8);x.lineTo(p[0]-nx*(.8+l),p[1]-ny*(.8+l));x.stroke()}}
  mpOhBaseInk(x,coastPts.filter(q=>q[0]>=0&&q[1]<SH+2),31,.9,.9,'#2a1a0c',.9);
  // little huts and nets on the west shore
  for(const [py,k] of [[74,0],[112,1],[152,0],[206,1],[252,0]]){const px=cl+11;I.house(x,px,py,.42,k?'#8a6a4a':'#b5593a');x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.moveTo(px-3,py+4);x.lineTo(px+3,py+4.6);x.stroke();mpOhBaseBoat(x,px-6,py+1,2.2,5,'#8a5a30',false)}
  /* ---------- the moat: water on the north, east and west, joined to the sea at both south corners ---------- */
  {const mx0=X(-2.6),mx1=X(.6),rx0=X(149.4),rx1=X(152.6),my0=Y(-2.6),my1=Y(.6);
   const moat=(f)=>{f(mx0,my0,mx1-mx0,YB+4-my0);f(mx0,my0,rx1-mx0,my1-my0);f(rx0,my0,rx1-rx0,YB+10-my0)};
   x.fillStyle='#8fb4b4';moat((a,b,w,h)=>x.fillRect(a,b,w,h));
   x.save();x.globalAlpha=.4;x.fillStyle='#4f86a4';moat((a,b,w,h)=>x.fillRect(a+w*.25,b+h*0,w*.5,h));x.restore();
   // ink on the banks
   x.strokeStyle='rgba(42,26,12,.85)';x.lineWidth=.8;x.beginPath();x.moveTo(mx0,YB+4);x.lineTo(mx0,my0);x.lineTo(rx1,my0);x.lineTo(rx1,YB+10);x.moveTo(mx1,YB+4);x.lineTo(mx1,my1);x.lineTo(rx0,my1);x.lineTo(rx0,YB+10);x.stroke();
   x.strokeStyle='rgba(60,40,18,.55)';x.lineWidth=.35;for(let t=0;t<260;t++){const u=t/260,L=2*(YB-my0)+(rx1-mx0);const pos=u*L;let px,py,ox,oy;
     if(pos<YB-my0){px=mx0;py=YB-pos;ox=-1;oy=0}else if(pos<YB-my0+rx1-mx0){px=mx0+pos-(YB-my0);py=my0;ox=0;oy=-1}else{px=rx1;py=my0+pos-(YB-my0)-(rx1-mx0);ox=1;oy=0}
     x.beginPath();x.moveTo(px,py);x.lineTo(px+ox*(1.4+H(t,1,75)*1.6),py+oy*(1.4+H(t,1,75)*1.6));x.stroke()}
   x.strokeStyle='rgba(30,74,118,.6)';x.lineWidth=.5;for(let t=0;t<90;t++){const side=t%3,u=H(t,1,76);let px,py;if(side===0){px=mx0+1.2+H(t,2,76)*(mx1-mx0-2.4);py=my0+u*(YB-my0)}else if(side===1){px=mx0+u*(rx1-mx0);py=my0+1.2+H(t,2,76)*(my1-my0-2.4)}else{px=rx0+1.2+H(t,2,76)*(rx1-rx0-2.4);py=my0+u*(YB-my0)}I.wave(x,px,py)}
   // timber bridges at the Land Gate and the East Gate
   const bridge=(a,b,w,h,horiz)=>{x.fillStyle='#a07040';x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(a,b,w,h);x.strokeRect(a,b,w,h);x.strokeStyle='rgba(42,26,12,.55)';x.lineWidth=.35;x.beginPath();if(horiz){for(let u=a+1.2;u<a+w;u+=1.4){x.moveTo(u,b);x.lineTo(u,b+h)}}else{for(let v=b+1.2;v<b+h;v+=1.4){x.moveTo(a,v);x.lineTo(a+w,v)}}x.stroke();
     x.strokeStyle=INK;x.lineWidth=.9;x.beginPath();if(horiz){x.moveTo(a,b-.5);x.lineTo(a+w,b-.5);x.moveTo(a,b+h+.5);x.lineTo(a+w,b+h+.5)}else{x.moveTo(a-.5,b);x.lineTo(a-.5,b+h);x.moveTo(a+w+.5,b);x.lineTo(a+w+.5,b+h)}x.stroke()};
   bridge(X(101)-2.4,my0-.6,4.8,my1-my0+1.4,false);bridge(rx0-.6,Y(74)-2.4,rx1-rx0+1.4,4.8,true)}
  /* ---------- the quay and piers at the Portcullis Gate ---------- */
  {const qa=X(52),qb=X(97),qy0=YB-1.5,qy1=YB+8;
   x.fillStyle='rgba(40,26,12,.28)';x.fillRect(qa+1.4,qy0+1.8,qb-qa,qy1-qy0);
   x.fillStyle='#d8cfb4';x.fillRect(qa,qy0,qb-qa,qy1-qy0);x.strokeStyle='rgba(60,40,18,.45)';x.lineWidth=.3;x.beginPath();for(let u=qa+2.4,r=0;u<qb;u+=2.6,r++)for(let v=qy0+1+(r%2)*1.3;v<qy1;v+=2.6){x.moveTo(u,v);x.lineTo(u+1.8,v)}x.stroke();
   x.strokeStyle=INK;x.lineWidth=.9;x.strokeRect(qa,qy0,qb-qa,qy1-qy0);x.lineWidth=.5;x.strokeRect(qa+.9,qy0+.9,qb-qa-1.8,qy1-qy0-1.8);
   x.fillStyle=INK;for(let u=qa+3;u<qb-1;u+=7){x.beginPath();x.arc(u,qy1-1.6,.65,0,6.3);x.fill()}
   // crates, barrels and a crane on the quay
   for(const [u,v,k] of [[qa+8,qy0+4.6,0],[qa+11.4,qy0+5,1],[qb-9,qy0+4.4,0],[qb-13,qy0+5.2,1],[qa+20,qy0+4.8,1]]){x.fillStyle=k?'#8a5a30':'#b08c58';x.strokeStyle=INK;x.lineWidth=.45;if(k){x.beginPath();x.arc(u,v,1.2,0,6.3);x.fill();x.stroke()}else{x.fillRect(u-1.3,v-1.2,2.6,2.4);x.strokeRect(u-1.3,v-1.2,2.6,2.4)}}
   x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.moveTo(qb-26,qy1-1);x.lineTo(qb-26,qy0+2);x.lineTo(qb-20,qy1-.5);x.moveTo(qb-26,qy0+2);x.lineTo(qb-21,qy0+3.4);x.stroke();
   // the timber piers with posts, and boats between them
   const px=[56.5,63.5,70.5,78.5,85.5,92.5].map(c=>X(c));
   for(const u of px){x.fillStyle='#a07040';x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(u-1.5,qy1,3,12.5);x.strokeRect(u-1.5,qy1,3,12.5);x.strokeStyle='rgba(42,26,12,.5)';x.lineWidth=.3;x.beginPath();for(let v=qy1+1.4;v<qy1+12;v+=1.5){x.moveTo(u-1.5,v);x.lineTo(u+1.5,v)}x.stroke();x.fillStyle=INK;for(const v of [qy1+3,qy1+12]){x.beginPath();x.arc(u-2,v,.5,0,6.3);x.arc(u+2,v,.5,0,6.3);x.fill()}}
   const midx=(i)=>(px[i]+px[i+1])/2;
   mpOhBaseBoat(x,midx(0)+.2,qy1+.4,4.6,13,'#8a5a30',true);mpOhBaseBoat(x,midx(1),qy1+.8,3.4,9,'#b5593a',false);mpOhBaseBoat(x,midx(3),qy1+.4,4.8,13.5,'#6a4a2c',true);mpOhBaseBoat(x,midx(4)+.3,qy1+1,3.2,8,'#3a6a8a',false)}
  // ships out in the harbour and away on the sea
  mpOhBaseShip(x,150,YB+11,.46,false);mpOhBaseShip(x,318,YB+10,.4,true);mpOhBaseShip(x,350,YB+13,.34,false);
  /* ---------- inside the wall: ground wash, building outlines and roads, from the real rows ---------- */
  const GR=['#d9c9a0','#e4dcc2','#b9c487','#a8b87c','#cdbf98','#c3c985'],GR2=['#dccea6','#e8e1ca','#c1cb90','#b1c084','#d3c6a2','#cbd08e'];
  x.fillStyle='#cfc3a3';x.fillRect(X(6),Y(6),138*S,138*S);
  for(let cy=6;cy<144;cy++)for(let cx=6;cx<144;cx++){const o=rows[cy][cx]==='.',h=H(cx,cy,80);
    x.fillStyle=o?((h<.5?GR:GR2)[+fm[cy][cx]]||GR[0]):(h<.3?'#c7bb9a':h<.65?'#cdc1a1':'#d1c5a6');x.fillRect(X(cx)-.12,Y(cy)-.12,S+.24,S+.24)}
  x.beginPath();for(let cy=6;cy<144;cy++)for(let cx=6;cx<144;cx++){if(rows[cy][cx]==='.')continue;
    if(open(cx,cy-1)){x.moveTo(X(cx),Y(cy));x.lineTo(X(cx+1),Y(cy))}if(open(cx,cy+1)){x.moveTo(X(cx),Y(cy+1));x.lineTo(X(cx+1),Y(cy+1))}if(open(cx-1,cy)){x.moveTo(X(cx),Y(cy));x.lineTo(X(cx),Y(cy+1))}if(open(cx+1,cy)){x.moveTo(X(cx+1),Y(cy));x.lineTo(X(cx+1),Y(cy+1))}}
  x.strokeStyle='rgba(42,26,12,.55)';x.lineWidth=.35;x.stroke();
  // streets as ribbons: minor streets thin, the ring road and the Land Gate road wider, King's Road widest
  const RF='#e6d4a2',cx7=X(7),yy=(c)=>Y(c);
  for(const c of [18,33,48,116,131])rib([[X(c),Y(6)],[X(c),Y(144)]],2*S,RF,'rgba(42,26,12,.5)',.85);
  for(const c of [43,59,89,104,119,134])rib([[X(6),Y(c)],[X(144),Y(c)]],2*S,RF,'rgba(42,26,12,.5)',.85);
  rib([[X(7),Y(6)],[X(7),Y(144)]],2*S,'#e4cf96');rib([[X(143),Y(6)],[X(143),Y(144)]],2*S,'#e4cf96');rib([[X(6),Y(143)],[X(144),Y(143)]],2*S,'#e4cf96');
  rib([[X(6),Y(7)],[X(48),Y(7)]],2*S,'#e4cf96');rib([[X(101),Y(7)],[X(144),Y(7)]],2*S,'#e4cf96');
  rib([[X(101),Y(5)],[X(101),Y(143)]],2.2*S,'#e0c88a');
  rib([[X(6),Y(74)],[X(146.5),Y(74)]],2.4*S,'#e0c88a');
  rib([[X(74.5),Y(20)],[X(74.5),Y(150)]],3.2*S,'#e2c47c');
  x.save();for(let i=0;i<420;i++){const t=H(i,1,81),px=X(74.5)+(H(i,2,81)-.5)*3*S,py=Y(20)+t*130*S;x.fillStyle=H(i,3,81)<.5?'#b49a66':'#f4ead0';x.globalAlpha=.7;x.beginPath();x.arc(px,py,.3,0,6.3);x.fill()}x.restore();
  /* ---------- the great curtain wall ---------- */
  {const o0=1.2,o1=148.8,i0=6,i1=144;
   x.save();x.beginPath();x.rect(X(o0),Y(o0),(o1-o0)*S,(o1-o0)*S);x.rect(X(i0),Y(i0),(i1-i0)*S,(i1-i0)*S);
   const wg=x.createLinearGradient(X0,Y0,XR,YB);wg.addColorStop(0,'#d9cfb4');wg.addColorStop(.5,'#cdc2a4');wg.addColorStop(1,'#bfb394');x.fillStyle=wg;x.fill('evenodd');x.restore();
   // a pale top edge and a dark inner shadow
   x.save();x.beginPath();x.rect(X(o0),Y(o0),(o1-o0)*S,(o1-o0)*S);x.rect(X(i0),Y(i0),(i1-i0)*S,(i1-i0)*S);x.clip('evenodd');
   x.fillStyle='rgba(40,26,12,.22)';x.fillRect(X(i0)-3,Y(i0)-3,(i1-i0)*S+6,3);x.fillRect(X(i0)-3,Y(i0)-3,3,(i1-i0)*S+6);
   x.strokeStyle='rgba(60,40,18,.4)';x.lineWidth=.3;x.beginPath();for(let i=0;i<700;i++){const side=i%4,t=H(i,1,82),u=H(i,2,82)*4.8+1.2;let a,b;if(side===0){a=X(1.2+t*147.6);b=Y(u)}else if(side===1){a=X(1.2+t*147.6);b=Y(150-u)}else if(side===2){a=X(u);b=Y(1.2+t*147.6)}else{a=X(150-u);b=Y(1.2+t*147.6)}
     if(side<2){x.moveTo(a,b);x.lineTo(a+1.6,b)}else{x.moveTo(a,b);x.lineTo(a,b+1.6)}}x.stroke();x.restore();
   // merlons along the outer edge, left out at the gates
   x.fillStyle='#e9e0c6';x.strokeStyle=INK;x.lineWidth=.3;
   const gap=(side,c)=>(side===1&&Math.abs(c-74.5)<4)||(side===0&&Math.abs(c-101)<5)||(side===3&&Math.abs(c-74)<4);
   for(let c=o0+.4;c<o1-1;c+=1.35){for(const side of [0,1]){if(gap(side,c))continue;const px=X(c),py=side?Y(o1)-1.6:Y(o0)+.3;x.fillRect(px,py,1.3,1.3);x.strokeRect(px,py,1.3,1.3)}
     if(!gap(3,c)){x.fillRect(X(o1)-1.6,Y(c),1.3,1.3);x.strokeRect(X(o1)-1.6,Y(c),1.3,1.3)}x.fillRect(X(o0)+.3,Y(c),1.3,1.3);x.strokeRect(X(o0)+.3,Y(c),1.3,1.3)}
   // ink lines of the wall faces
   x.strokeStyle=INK;x.lineWidth=1;x.strokeRect(X(o0),Y(o0),(o1-o0)*S,(o1-o0)*S);x.lineWidth=.8;x.strokeRect(X(i0),Y(i0),(i1-i0)*S,(i1-i0)*S);
   // the gate passages cut the wall: dark way with a gold portcullis
   const gate=(a,b,w,h,horiz)=>{x.fillStyle='#e0c88a';x.fillRect(a,b,w,h);x.fillStyle='#3a2a1c';x.fillRect(a+(horiz?0:.6),b+(horiz?.6:0),w-(horiz?0:1.2),h-(horiz?1.2:0));x.strokeStyle=MPL.GOLD;x.lineWidth=.45;x.beginPath();
     if(horiz){for(let u=a+1;u<a+w;u+=1.4){x.moveTo(u,b+.8);x.lineTo(u,b+h-.8)}}else{for(let v=b+1;v<b+h;v+=1.4){x.moveTo(a+.8,v);x.lineTo(a+w-.8,v)}}x.stroke()};
   // south: Portcullis Gate, towers either side
   x.fillStyle='#d6ccb0';x.strokeStyle=INK;x.lineWidth=.8;x.fillRect(X(69.5),Y(143.4),11*S,6.2*S);x.strokeRect(X(69.5),Y(143.4),11*S,6.2*S);
   gate(X(73),Y(143.4),3*S,6.2*S,false);
   mpOhBaseTower(x,X(71),Y(146.4),2.8*S,'#8a5a3a',null);mpOhBaseTower(x,X(78),Y(146.4),2.8*S,'#8a5a3a',null);
   // east: the East Gate
   x.fillStyle='#d6ccb0';x.strokeStyle=INK;x.lineWidth=.8;x.fillRect(X(143.4),Y(69),6.2*S,11*S);x.strokeRect(X(143.4),Y(69),6.2*S,11*S);gate(X(143.4),Y(73),6.2*S,2*S,true);
   mpOhBaseTower(x,X(146.4),Y(71),2.8*S,'#6f7f9c',null);mpOhBaseTower(x,X(146.4),Y(77),2.8*S,'#6f7f9c',null);
   // north: the Land Gate
   x.fillStyle='#d6ccb0';x.strokeStyle=INK;x.lineWidth=.8;x.fillRect(X(96),Y(.8),10*S,6*S);x.strokeRect(X(96),Y(.8),10*S,6*S);gate(X(100),Y(.8),2*S,6*S,false);
   mpOhBaseTower(x,X(98),Y(3.6),2.7*S,'#6f7f9c',null);mpOhBaseTower(x,X(104),Y(3.6),2.7*S,'#6f7f9c',null);
   // towers along the wall, as in the real level
   const roofs=['#8a5a3a','#6f7f9c','#a0482e','#6f7f9c'];let ti=0;
   for(let c=14;c<=136;c+=17){if(Math.abs(c-74)<8||Math.abs(c-100.5)<6)continue;mpOhBaseTower(x,X(c),Y(3.6),2.3*S,roofs[ti++%4],ti%3===0?MPL.VERM:null);mpOhBaseTower(x,X(c),Y(146.4),2.3*S,roofs[ti++%4],ti%3===0?MPL.GOLD:null)}
   for(let c=16;c<=134;c+=17){if(Math.abs(c-73)<4)continue;mpOhBaseTower(x,X(3.6),Y(c),2.3*S,roofs[ti++%4],null);if(Math.abs(c-73)>=8||true){if(Math.abs(c-74)>5)mpOhBaseTower(x,X(146.4),Y(c),2.3*S,roofs[ti++%4],ti%3===0?MPL.VERM:null)}}
   for(const [a,b] of [[3.6,3.6],[146.4,3.6],[3.6,146.4],[146.4,146.4]])mpOhBaseTower(x,X(a),Y(b),3.6*S,'#a0482e',MPL.GOLD)}
  /* ---------- gulls over the sea ---------- */
  x.strokeStyle=INK;x.lineWidth=.6;for(const [gx,gy,k] of [[70,70,1],[84,64,.8],[26,128,1],[78,196,.9],[170,300,1],[200,296,.8],[280,302,.9]]){x.beginPath();x.moveTo(gx-3*k,gy);x.quadraticCurveTo(gx-1.4*k,gy-2.2*k,gx,gy);x.quadraticCurveTo(gx+1.4*k,gy-2.2*k,gx+3*k,gy);x.stroke()}
  /* ---------- sea creatures and ships in the west margin ---------- */
  mpOhBaseShip(x,50,96,.92,false);
  mpOhBaseSerpent(x,56,138,.9);
  mpOhBaseKraken(x,40,184,.9);
  mpOhBaseShip(x,82,176,.4,true);
  /* ---------- title, notes, key, compass ---------- */
  mpOhBaseScroll(x,8,9,92,48);
  api.title(x,'Oldhaven',"The King's City",14,13);
  api.text(x,'on the Narrow Sea',14,52,7,'#5a3a1c','left');
  api.compass(x,54,214,13);
  // text on the water
  api.text(x,'NARROW SEA',48,118,7,MPL.LAPIS,'center');
  // left note
  mpOhBaseScroll(x,8,238,90,60);x.save();api.panel(x,8,238,90,60);x.restore();
  api.notes(x,["King's Road runs from the Portcullis Gate north to the Great Square and the castle. The Land Gate road leads out to the Pilgrim's Path."],14,247,80,5.9,3);
  // right notes
  mpOhBaseScroll(x,387,12,88,126);x.save();api.panel(x,387,12,88,126);x.restore();
  api.notes(x,["Oldhaven is the king's walled city on the Narrow Sea. The castle stands at the north end.","Three gates pierce the wall: the Portcullis Gate to the quay, the Land Gate in the north and the East Gate.","The East Gate is held by the Ash Guard. Its captain can tell you more."],392,21,77,5.9,4);
  // key
  {const ka=387,kb=186,kw=88,kh=112;mpOhBaseScroll(x,ka,kb,kw,kh);api.panel(x,ka,kb,kw,kh);api.text(x,'KEY',ka+kw/2,kb+8,7,MPL.VERM,'center');
   let ky=kb+18;const ent=(t,f)=>{f(ka+9,ky);api.text(x,t,ka+20,ky,5.9,'#2a1a0c','left');ky+=9.4};
   ent('Wall and towers',(a,b)=>{x.fillStyle='#cdc2a4';x.strokeStyle=INK;x.lineWidth=.6;x.fillRect(a-6,b-2,12,4);x.strokeRect(a-6,b-2,12,4);mpOhBaseTower(x,a+4,b,2.2,'#a0482e',null)});
   ent('Gate',(a,b)=>{x.fillStyle='#3a2a1c';x.strokeStyle=INK;x.lineWidth=.6;x.fillRect(a-3,b-3,6,6);x.strokeStyle=MPL.GOLD;x.lineWidth=.5;x.beginPath();for(let v=b-2;v<b+3;v+=1.4){x.moveTo(a-3,v);x.lineTo(a+3,v)}x.stroke()});
   ent("King's Road",(a,b)=>{x.fillStyle='#e2c47c';x.strokeStyle=INK;x.lineWidth=.6;x.fillRect(a-6,b-2,12,4);x.strokeRect(a-6,b-2,12,4)});
   ent('Street',(a,b)=>{x.fillStyle='#e6d4a2';x.strokeStyle='rgba(42,26,12,.6)';x.lineWidth=.5;x.fillRect(a-6,b-1,12,2);x.strokeRect(a-6,b-1,12,2)});
   ent('Moat and river',(a,b)=>{x.fillStyle='#8fb4b4';x.strokeStyle=INK;x.lineWidth=.6;x.fillRect(a-6,b-2,12,4);x.strokeRect(a-6,b-2,12,4);I.wave(x,a,b)});
   ent('Quay and piers',(a,b)=>{x.fillStyle='#d8cfb4';x.strokeStyle=INK;x.lineWidth=.6;x.fillRect(a-6,b-2.5,12,3);x.strokeRect(a-6,b-2.5,12,3);x.fillStyle='#a07040';x.fillRect(a-1,b+.5,2,3.4);x.strokeRect(a-1,b+.5,2,3.4)});
   ent('Fields',(a,b)=>{mpOhBaseField(x,a-6,b-3,12,6,'wheat',3)});
   ent('Orchard',(a,b)=>{mpOhBaseField(x,a-6,b-3.4,12,6.8,'orchard',5)});
   ent('Wood',(a,b)=>{I.tree(x,a-3,b+3,.55);I.pine(x,a+3,b+3,.5)});
   ent('Sea and breakers',(a,b)=>{x.fillStyle='#9fbfc0';x.fillRect(a-6,b-2.5,12,5);I.wave(x,a-2,b);I.wave(x,a+3,b+1);x.strokeStyle='rgba(250,250,240,.95)';x.lineWidth=.9;x.beginPath();x.moveTo(a-6,b-2.5);x.lineTo(a+6,b-2.5);x.stroke()})}
  /* the sea names on the south water, the road ends and the moat */
  api.text(x,'Oldhaven Harbour',300,YB+10,6,MPL.LAPIS,'center');
  api.text(x,'The Quay',X(74.5),YB+5.2,5.2,'#2a1a0c','center');
  api.text(x,"To the Pilgrim's Path",X(101)+13,14,6,'#2a1a0c','left');
  api.text(x,'Road to the east',420,Y(74)-6.5,6,'#2a1a0c','center');
  api.text(x,'River',379,12,5.2,'#274a9a','center');
  x.save();x.translate(X(3.6),Y(112));x.rotate(-Math.PI/2);api.text(x,'The Curtain Wall',0,0,5.2,'#2a1a0c','center');x.restore();
  api.text(x,'Moat',X(40),Y(-1)+.3,4.6,'#274a9a','center');
}});
