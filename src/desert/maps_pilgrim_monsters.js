/* The sea monsters of the Narrow Sea on the Pilgrim's Path map: a sea serpent and a kraken. They are tapered tubes along curves, with spines, scales,
   suckers, fangs and hard yellow eyes. Names start with mpPilg. */
function mpPilgBez(a,b,c,d,n){const o=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;o.push([u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]])}return o}
function mpPilgNrm(P,i){const a=P[Math.max(0,i-1)],b=P[Math.min(P.length-1,i+1)],tx=b[0]-a[0],ty=b[1]-a[1],l=Math.hypot(tx,ty)||1;return [ty/l,-tx/l]}
function mpPilgTube(x,P,w0,w1,fill,lw){const n=P.length,L=[],R=[];for(let i=0;i<n;i++){const w=(w0+(w1-w0)*i/(n-1))/2,q=mpPilgNrm(P,i);L.push([P[i][0]+q[0]*w,P[i][1]+q[1]*w]);R.push([P[i][0]-q[0]*w,P[i][1]-q[1]*w])}
  x.beginPath();x.moveTo(L[0][0],L[0][1]);for(const p of L)x.lineTo(p[0],p[1]);for(let i=n-1;i>=0;i--)x.lineTo(R[i][0],R[i][1]);x.closePath();x.fillStyle=fill;x.fill();x.strokeStyle=MPL.INK;x.lineWidth=lw||.8;x.stroke()}
function mpPilgFoam(x,list){x.strokeStyle='rgba(240,248,250,.85)';x.lineWidth=.9;for(const [dx,w] of list){x.beginPath();x.moveTo(dx-w/2,1.5);x.quadraticCurveTo(dx-w/4,-.6,dx,1.5);x.quadraticCurveTo(dx+w/4,3.6,dx+w/2,1.5);x.stroke()}}
function mpPilgSerpent(x,a,b,s){const ink=MPL.INK,G1='#3c7a62',G2='#2a5a48',BL='#b8d8a0',TAU=Math.PI*2;x.save();x.translate(a,b);x.scale(s,s);x.lineJoin='round';x.lineCap='round';
  mpPilgFoam(x,[[8,12],[26,12],[52,12],[66,10],[-2,10]]);
  const parts=[[mpPilgBez([10,3],[2,-4],[-12,-8],[-12,-26],16),7.4,5.2],[mpPilgBez([17,3],[18,-16],[34,-16],[36,3],16),6.6,6.6],[mpPilgBez([44,3],[45,-13],[58,-13],[60,3],16),5.8,5.8],[mpPilgBez([66,3],[70,-3],[78,-4],[84,-15],14),4.6,.8]];
  for(const [P,w0,w1] of parts.slice(1).concat([parts[0]])){mpPilgTube(x,P,w0,w1,G1,.9);
    /* pale belly stripe on the water side, scales, and a ridge of spines on the back */
    x.strokeStyle=BL;x.lineWidth=1.1;x.beginPath();for(let i=1;i<P.length-1;i++){const q=mpPilgNrm(P,i),w=(w0+(w1-w0)*i/(P.length-1))/2*.55,sg=q[1]>0?1:-1,px=P[i][0]+q[0]*w*sg,py=P[i][1]+q[1]*w*sg;i===1?x.moveTo(px,py):x.lineTo(px,py)}x.stroke();
    x.strokeStyle=G2;x.lineWidth=.45;for(let i=1;i<P.length-1;i++){const w=(w0+(w1-w0)*i/(P.length-1))/2;x.beginPath();x.arc(P[i][0],P[i][1],Math.max(.5,w*.42),.2,Math.PI-.2);x.stroke()}
    for(let i=1;i<P.length-1;i+=2){const q=mpPilgNrm(P,i),w=(w0+(w1-w0)*i/(P.length-1))/2,sg=q[1]<0?1:-1,px=P[i][0]+q[0]*w*sg,py=P[i][1]+q[1]*w*sg,h=2.4+1.6*(1-i/P.length),tx=-q[1]*sg,ty=q[0]*sg;
      x.fillStyle=i%4===1?MPL.VERM:'#c9a227';x.strokeStyle=ink;x.lineWidth=.45;x.beginPath();x.moveTo(px-tx*1.1,py-ty*1.1);x.lineTo(px+q[0]*sg*h,py+q[1]*sg*h);x.lineTo(px+tx*1.1,py+ty*1.1);x.closePath();x.fill();x.stroke()}}
  /* the tail fin */
  x.fillStyle=MPL.VERM;x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.moveTo(83,-14);x.quadraticCurveTo(90,-22,95,-18);x.quadraticCurveTo(90,-14,92,-8);x.quadraticCurveTo(86,-10,83,-14);x.closePath();x.fill();x.stroke();
  /* the head: horns, frill, open jaws, fangs, forked tongue and a hard yellow eye */
  x.save();x.translate(-12,-27);x.rotate(-.16);
  x.fillStyle=MPL.VERM;for(const [dx,dy,ex,ey] of [[5,-1,13,-9],[6,1,16,-2],[5,3,14,5],[4,-3,10,-12]]){x.beginPath();x.moveTo(dx,dy-1.6);x.lineTo(ex,ey);x.lineTo(dx,dy+1.6);x.closePath();x.fill();x.strokeStyle=ink;x.lineWidth=.5;x.stroke()}
  x.fillStyle='#e8dcb0';x.strokeStyle=ink;x.lineWidth=.55;for(const [d,e] of [[[2,-5],[9,-12]],[[4,-4],[13,-8]]]){x.beginPath();x.moveTo(d[0],d[1]);x.quadraticCurveTo(e[0]-2,e[1]+5,e[0]+1,e[1]);x.quadraticCurveTo(e[0]-1,e[1]+6,d[0]+2.4,d[1]+1.2);x.closePath();x.fill();x.stroke()}
  x.fillStyle='#8a1c18';x.beginPath();x.moveTo(5,-1);x.lineTo(-13,-2.4);x.lineTo(-12,6.6);x.lineTo(5,5);x.closePath();x.fill();
  x.fillStyle=G1;x.strokeStyle=ink;x.lineWidth=.8;
  x.beginPath();x.moveTo(6,-6);x.quadraticCurveTo(-4,-9,-14,-4.6);x.quadraticCurveTo(-18,-3.4,-16,-1.8);x.lineTo(-7,-1.2);x.lineTo(5,.6);x.closePath();x.fill();x.stroke();
  x.fillStyle=G2;x.beginPath();x.moveTo(5,4);x.lineTo(-6,4);x.quadraticCurveTo(-13,5,-16,9.6);x.quadraticCurveTo(-8,9.4,5,8);x.closePath();x.fill();x.stroke();
  x.fillStyle='#fff6e0';x.strokeStyle=ink;x.lineWidth=.35;for(const fx of [-13,-9.6,-6]){x.beginPath();x.moveTo(fx-1,-1.8+(fx+13)*.07);x.lineTo(fx,2.8);x.lineTo(fx+1,-1.4+(fx+13)*.07);x.closePath();x.fill();x.stroke()}
  for(const fx of [-12.4,-8.4]){x.beginPath();x.moveTo(fx-.9,5.2);x.lineTo(fx,1);x.lineTo(fx+.9,5);x.closePath();x.fill();x.stroke()}
  x.strokeStyle=MPL.VERM;x.lineWidth=.9;x.beginPath();x.moveTo(-2,5);x.quadraticCurveTo(-12,3.6,-20,5);x.moveTo(-20,5);x.lineTo(-24,2.4);x.moveTo(-20,5);x.lineTo(-24,6.6);x.stroke();
  x.fillStyle='#f2d030';x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.ellipse(-1.6,-4.4,3,1.9,-.4,0,TAU);x.fill();x.stroke();
  x.fillStyle=ink;x.beginPath();x.ellipse(-1.8,-4.4,.5,1.6,-.4,0,TAU);x.fill();
  x.strokeStyle=ink;x.lineWidth=1.3;x.beginPath();x.moveTo(-6.6,-9);x.lineTo(2,-5.6);x.stroke();
  x.restore();x.restore()}
function mpPilgKraken(x,a,b,s){const ink=MPL.INK,P1='#7a3a5e',P2='#4e2442',PK='#d8a8b0',TAU=Math.PI*2;x.save();x.translate(a,b);x.scale(s,s);x.lineJoin='round';x.lineCap='round';
  mpPilgFoam(x,[[0,26],[-28,10],[30,10],[-14,8],[16,8]]);
  /* arms: two reach high over the water with curled tips, the rest break the surface in coils */
  const arms=[
    [mpPilgBez([-6,0],[-24,-6],[-40,-18],[-36,-36],18),7,.9,1],
    [mpPilgBez([-3,0],[-12,-12],[-30,-10],[-34,-2],16),6,.8,0],
    [mpPilgBez([6,0],[26,-8],[44,-14],[40,-34],18),7,.9,1],
    [mpPilgBez([3,0],[14,-12],[32,-8],[38,0],16),6,.8,0],
    [mpPilgBez([-10,0],[-22,2],[-30,-4],[-24,-9],10),4.4,.8,0],
    [mpPilgBez([10,0],[22,2],[30,-4],[26,-9],10),4.4,.8,0]];
  for(const [P,w0,w1,up] of arms){mpPilgTube(x,P,w0,w1,P1,.9);
    x.fillStyle=PK;x.strokeStyle=ink;x.lineWidth=.3;for(let i=2;i<P.length-1;i+=2){const q=mpPilgNrm(P,i),w=(w0+(w1-w0)*i/(P.length-1))/2,r=Math.max(.35,w*.28);x.beginPath();x.arc(P[i][0]-q[0]*w*.3,P[i][1]-q[1]*w*.3,r,0,TAU);x.fill();x.stroke()}
    if(up){const e=P[P.length-1],f=P[P.length-3],sg=e[0]<f[0]?-1:1;x.strokeStyle=ink;x.lineWidth=1.1;x.beginPath();x.moveTo(e[0],e[1]);x.quadraticCurveTo(e[0]+sg*3.4,e[1]-3,e[0]+sg*.4,e[1]-5.4);x.stroke()}}
  /* the mantle: a tall dark head with fins, mottled skin and a ridge of spines */
  x.fillStyle=P2;x.strokeStyle=ink;x.lineWidth=.9;
  x.beginPath();x.moveTo(-10,-14);x.quadraticCurveTo(-26,-24,-13,-33);x.quadraticCurveTo(-8,-31,-9,-27);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(10,-14);x.quadraticCurveTo(26,-24,13,-33);x.quadraticCurveTo(8,-31,9,-27);x.closePath();x.fill();x.stroke();
  x.fillStyle=P1;x.beginPath();x.moveTo(-13,2);x.bezierCurveTo(-19,-14,-12,-34,0,-47);x.bezierCurveTo(12,-34,19,-14,13,2);x.bezierCurveTo(6,5,-6,5,-13,2);x.closePath();x.fill();x.stroke();
  x.save();x.clip();x.fillStyle='rgba(30,10,30,.3)';x.fillRect(2,-50,16,60);x.fillStyle='rgba(30,10,30,.45)';for(let i=0;i<40;i++){x.beginPath();x.arc(-12+hash2(i,1,71)*24,-44+hash2(i,2,71)*44,.5+hash2(i,3,71)*1.3,0,TAU);x.fill()}
  x.strokeStyle='rgba(216,168,176,.5)';x.lineWidth=.4;for(let k=0;k<9;k++){x.beginPath();x.moveTo(-12+k*3,-40+Math.abs(k-4)*3.2);x.quadraticCurveTo(-11+k*3,-20,-10+k*3,-2);x.stroke()}x.restore();
  x.fillStyle=MPL.VERM;x.strokeStyle=ink;x.lineWidth=.45;for(let i=0;i<5;i++){const yy=-44+i*6;x.beginPath();x.moveTo(-2,yy);x.lineTo(0,yy-4.4);x.lineTo(2,yy);x.closePath();x.fill();x.stroke()}
  /* the eyes: big yellow, slit pupils, heavy angry brows, and a hooked beak below */
  for(const sg of [-1,1]){x.fillStyle='#f2d030';x.strokeStyle=ink;x.lineWidth=.7;x.beginPath();x.ellipse(sg*6.6,-17,4.2,3,sg*.25,0,TAU);x.fill();x.stroke();
    x.fillStyle=ink;x.beginPath();x.ellipse(sg*6.4,-17,.8,2.5,sg*.25,0,TAU);x.fill();
    x.fillStyle='#fff6d0';x.beginPath();x.arc(sg*7.6,-18.2,.6,0,TAU);x.fill();
    x.strokeStyle=ink;x.lineWidth=1.5;x.beginPath();x.moveTo(sg*1.6,-17.4);x.lineTo(sg*11.4,-22.4);x.stroke()}
  x.fillStyle='#e8dcb0';x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.moveTo(-3,-9);x.quadraticCurveTo(0,-4,3,-9);x.quadraticCurveTo(0,-11.4,-3,-9);x.closePath();x.fill();x.stroke();
  x.restore()}
