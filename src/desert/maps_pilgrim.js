/* ==========================================================================
   THE PILGRIM'S PATH: the illuminated map of the whole 96 km road, Oldhaven to Yarrim (levels 400 to 423). One big sheet is drawn once (3x), from the same numbers
   that build the road (lpPos, LP_BUILD, LP_FALLS, LPM, LP_KM). Each frame the walked part of the road, the road ahead and the party's marker are laid on top in screen
   space, following the zoom and pan of mplPaint. No fog of war on this map.
   ========================================================================== */
const MPPILG={cv:null};
const mpPilgT=p=>[118+(p[0]-105)*.85,76+(p[1]-76)*.95];
const mpPilgP=f=>mpPilgT(lpPos(Math.max(0,Math.min(1,f))));
function mpPilgIn(f){const a=mpPilgP(Math.max(0,f-.01)),b=mpPilgP(Math.min(1,f+.01));const tx=b[0]-a[0],ty=b[1]-a[1],l=Math.hypot(tx,ty)||1;return [ty/l,-tx/l]}
function mpPilgOff(f,d){const p=mpPilgP(f),n=mpPilgIn(f);return [p[0]+n[0]*d,p[1]+n[1]*d]}
function mpPilgCur(){const s=LEVEL-LP.BASE;return Math.max(0,Math.min(1,lpGY(s,(LEVEL===LP.BASE+LP.N-1?G.C.y-60:G.C.y))/LP_TOT))}
const MPPILG_SHORT={'The Shepherd’s House':'Shepherd’s House','The Last Lamp':'The Last Lamp','The Church of the Long Road':'Long Road Church','The Fisherman’s House':'Fisherman’s House','The Hermit’s House':'Hermit’s House','The Cold Spring Inn':'Cold Spring Inn','The Charcoal-Burner’s House':'Charcoal House','The Gardener’s House':'Gardener’s House','Saint Aldric’s by the Sea':'St Aldric’s','The Wayfarer’s Rest':'Wayfarer’s Rest','The Beekeeper’s House':'Beekeeper’s House','The Last House':'The Last House'};

function mpPilgSmooth(x,pts){const n=pts.length;x.moveTo((pts[0][0]+pts[n-1][0])/2,(pts[0][1]+pts[n-1][1])/2);for(let i=0;i<n;i++){const p=pts[i],q=pts[(i+1)%n];x.quadraticCurveTo(p[0],p[1],(p[0]+q[0])/2,(p[1]+q[1])/2)}x.closePath()}
function mpPilgHouse(x,a,b,s,kind,roof){
  const ink=MPL.INK;x.save();x.translate(a,b);x.scale(s,s);x.lineJoin='round';x.strokeStyle=ink;x.lineWidth=.7;
  if(kind==='church'){
    x.fillStyle='#e6dcc2';x.fillRect(-6,-3,10,7);x.strokeRect(-6,-3,10,7);
    x.fillStyle=roof||MPL.LAPIS;x.beginPath();x.moveTo(-7.4,-3);x.lineTo(-1,-9);x.lineTo(5.4,-3);x.closePath();x.fill();x.stroke();
    x.fillStyle='#e6dcc2';x.fillRect(4,-10,4.4,14);x.strokeRect(4,-10,4.4,14);
    x.fillStyle=roof||MPL.LAPIS;x.beginPath();x.moveTo(3.4,-10);x.lineTo(6.2,-16);x.lineTo(9,-10);x.closePath();x.fill();x.stroke();
    x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.beginPath();x.moveTo(6.2,-16);x.lineTo(6.2,-19);x.moveTo(5,-17.6);x.lineTo(7.4,-17.6);x.stroke();
    x.fillStyle='#3a2a1c';x.beginPath();x.moveTo(-3.2,4);x.lineTo(-3.2,1);x.arc(-2,1,1.2,Math.PI,0);x.lineTo(-.8,4);x.fill();
    x.fillStyle='#3a5aa0';x.fillRect(-5.2,-1.4,1.2,2.2);x.fillRect(1,-1.4,1.2,2.2);x.fillRect(5.6,-6,1.2,2.4);
  }else{
    const w=kind==='inn'?13:8,hw=w/2;
    x.fillStyle='#e8dcc0';x.fillRect(-hw,-3,w,7);x.strokeRect(-hw,-3,w,7);
    x.strokeStyle='#6a4a2a';x.lineWidth=.45;x.beginPath();for(let k=-hw+2.6;k<hw-1;k+=2.6){x.moveTo(k,-3);x.lineTo(k,4)}x.moveTo(-hw,.3);x.lineTo(hw,.3);x.stroke();
    x.strokeStyle=ink;x.lineWidth=.7;
    x.fillStyle=roof||MPL.VERM;x.beginPath();x.moveTo(-hw-1.6,-3);x.lineTo(-hw*.15,-3-(kind==='inn'?6.4:5.6));x.lineTo(hw*.15,-3-(kind==='inn'?6.4:5.6));x.lineTo(hw+1.6,-3);x.closePath();x.fill();x.stroke();
    x.strokeStyle='rgba(42,26,12,.55)';x.lineWidth=.4;const rh=kind==='inn'?6.4:5.6;for(let r=1;r<3;r++){const yy=-3-rh*r/3,e=(hw+1.6)*(1-r/3)+hw*.15*(r/3);x.beginPath();x.moveTo(-e,yy);x.lineTo(e,yy);x.stroke()}
    x.strokeStyle=ink;x.lineWidth=.7;x.fillStyle='#8a6a4a';x.fillRect(hw*.45,-8.4,1.8,3.6);x.strokeRect(hw*.45,-8.4,1.8,3.6);
    x.strokeStyle='rgba(90,80,70,.55)';x.lineWidth=.6;x.beginPath();x.moveTo(hw*.45+.9,-9);x.bezierCurveTo(hw*.45-1,-11,hw*.45+3,-12,hw*.45+1,-14.5);x.stroke();
    x.fillStyle='#4a2a14';x.beginPath();x.moveTo(-1.2,4);x.lineTo(-1.2,1.4);x.arc(0,1.4,1.2,Math.PI,0);x.lineTo(1.2,4);x.fill();
    x.fillStyle=kind==='inn'?'#f6d870':'#3a5aa0';x.fillRect(-hw+1.2,-1.4,1.8,1.8);x.fillRect(hw-3,-1.4,1.8,1.8);
    if(kind==='inn'){x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.moveTo(-hw-1,-1);x.lineTo(-hw-1,-6);x.lineTo(-hw-4,-6);x.stroke();x.fillStyle=MPL.GOLD;x.fillRect(-hw-5,-5.6,3.6,2.6);x.strokeRect(-hw-5,-5.6,3.6,2.6)}
  }
  x.restore()}
function mpPilgFolk(x,a,b,col){const ink=MPL.INK;x.save();x.translate(a,b);x.lineJoin='round';x.strokeStyle=ink;x.lineWidth=.5;
  x.beginPath();x.moveTo(2.4,1);x.lineTo(2.4,-7);x.stroke();
  x.fillStyle='rgba(60,40,20,.25)';x.beginPath();x.ellipse(0,1.2,2.6,.8,0,0,6.3);x.fill();
  x.fillStyle=col;x.beginPath();x.moveTo(-2.2,1);x.lineTo(-.4,-5);x.lineTo(1.4,-5);x.lineTo(2,1);x.closePath();x.fill();x.stroke();
  x.fillStyle='#e8d0a8';x.beginPath();x.arc(.5,-6,1.2,0,6.3);x.fill();x.stroke();
  x.fillStyle=col;x.beginPath();x.arc(.5,-6.4,1.3,Math.PI,0);x.fill();
  x.fillStyle='#8a5a30';x.beginPath();x.arc(-1.9,-3.4,1,0,6.3);x.fill();x.restore()}
function mpPilgCairn(x,a,b,s,col){const ink=MPL.INK;x.save();x.translate(a,b);x.scale(s,s);x.lineWidth=.45;x.strokeStyle=ink;
  const st=[[0,0,2.5,1.3,'#9a9488'],[-.2,-1.9,1.8,1,'#aaa498'],[.1,-3.4,1.1,.7,'#8a8478']];
  for(const [dx,dy,rx,ry,c] of st){x.fillStyle=c;x.beginPath();x.ellipse(dx,dy,rx,ry,0,0,6.3);x.fill();x.stroke()}
  x.fillStyle=col;x.beginPath();x.arc(.2,-4.6,.75,0,6.3);x.fill();x.stroke();x.restore()}
function mpPilgPost(x,a,b,s){const ink=MPL.INK;x.save();x.translate(a,b);x.scale(s,s);x.strokeStyle=ink;x.lineWidth=.5;x.fillStyle='#8a5a30';x.fillRect(-.35,-4,.7,4);x.fillStyle='#f0e4c0';x.fillRect(-1.5,-5,3,1.7);x.strokeRect(-1.5,-5,3,1.7);x.restore()}
function mpPilgStone(x,a,b,s){const ink=MPL.INK;x.save();x.translate(a,b);x.scale(s,s);x.lineJoin='round';x.strokeStyle=ink;x.lineWidth=.55;
  x.fillStyle=MPL.LAPIS;x.beginPath();x.moveTo(-1.8,0);x.lineTo(-1.2,-4.6);x.lineTo(0,-6);x.lineTo(1.2,-4.6);x.lineTo(1.8,0);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(0,-3,.7,0,6.3);x.fill();x.restore()}
function mpPilgShip(x,a,b,s,fl,col){const ink=MPL.INK;x.save();x.translate(a,b);x.scale(s*(fl?-1:1),s);x.lineJoin='round';x.strokeStyle=ink;x.lineWidth=.6;
  x.strokeStyle='rgba(235,245,250,.8)';x.lineWidth=.8;x.beginPath();x.moveTo(-12,4.4);x.quadraticCurveTo(-8,2.4,-4,4.4);x.moveTo(5,5);x.quadraticCurveTo(9,3,13,5);x.stroke();x.strokeStyle=ink;x.lineWidth=.6;
  x.fillStyle='#7a4a24';x.beginPath();x.moveTo(-9,-1.2);x.quadraticCurveTo(-6,5,0,5);x.quadraticCurveTo(7,5,10,-3);x.lineTo(7,-1.2);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(0,-1);x.lineTo(0,-17);x.stroke();
  x.fillStyle='#f2e8d0';x.beginPath();x.moveTo(-.6,-16);x.quadraticCurveTo(-9,-10,-8,-3);x.lineTo(-.6,-2.6);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(.6,-15);x.quadraticCurveTo(7,-10,6,-3);x.lineTo(.6,-2.6);x.closePath();x.fill();x.stroke();
  x.strokeStyle=col;x.lineWidth=1;x.beginPath();x.moveTo(-4.4,-12);x.lineTo(-4.4,-4.4);x.moveTo(-7.4,-8);x.lineTo(-1.8,-8);x.stroke();
  x.fillStyle=col;x.beginPath();x.moveTo(0,-17);x.lineTo(5,-16);x.lineTo(0,-14.6);x.closePath();x.fill();x.restore()}
function mpPilgBanner(x,a,b,col,fl){const ink=MPL.INK;x.save();x.translate(a,b);x.strokeStyle=ink;x.lineWidth=.7;x.beginPath();x.moveTo(0,0);x.lineTo(0,-11);x.stroke();
  x.fillStyle=col;x.beginPath();x.moveTo(0,-11);x.quadraticCurveTo(3.4*(fl?-1:1),-12.4,6.4*(fl?-1:1),-10.8);x.lineTo(4.4*(fl?-1:1),-8.6);x.lineTo(6.4*(fl?-1:1),-6.6);x.quadraticCurveTo(3.4*(fl?-1:1),-8,0,-6.4);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(0,-11.4,.9,0,6.3);x.fill();x.restore()}
function mpPilgFalcon(x,a,b,s,fl){const ink=MPL.INK;x.save();x.translate(a,b);x.scale(s*(fl?-1:1),s);x.strokeStyle=ink;x.fillStyle='#6a4a2a';x.lineWidth=.8;x.lineJoin='round';
  x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(-5,-5,-11,-3);x.quadraticCurveTo(-6,-2.4,-3,1.2);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(5,-5,11,-3);x.quadraticCurveTo(6,-2.4,3,1.2);x.closePath();x.fill();x.stroke();
  x.beginPath();x.ellipse(0,1,1.8,3.4,0,0,6.3);x.fill();x.stroke();x.beginPath();x.moveTo(0,4);x.lineTo(-1.2,7.4);x.lineTo(1.2,7.4);x.closePath();x.fill();x.stroke();
  x.fillStyle='#e8d0a8';x.beginPath();x.arc(0,-2.2,1.3,0,6.3);x.fill();x.stroke();x.restore()}
/* a vine of leaves and gold berries along a straight strip */
function mpPilgVine(x,x0,y0,x1,y1,amp,seed){const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;x.save();x.lineCap='round';
  x.strokeStyle='#3a6a4a';x.lineWidth=.7;x.beginPath();for(let t=0;t<=L;t+=1.5){const w=Math.sin(t*.55+seed)*amp,px=x0+ux*t+nx*w,py=y0+uy*t+ny*w;t?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();
  for(let t=3;t<L-2;t+=4.2){const w=Math.sin(t*.55+seed)*amp,px=x0+ux*t+nx*w,py=y0+uy*t+ny*w,sd=Math.floor(t/4.2)%2?1:-1;
    x.fillStyle=Math.floor(t/4.2)%3?'#4a8a5a':'#2f6a46';x.strokeStyle='rgba(42,26,12,.6)';x.lineWidth=.35;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+nx*sd*3+ux*1.6,py+ny*sd*3+uy*1.6,px+nx*sd*4.2+ux*3.4,py+ny*sd*4.2+uy*3.4);x.quadraticCurveTo(px+nx*sd*1.4+ux*3.6,py+ny*sd*1.4+uy*3.6,px,py);x.fill();x.stroke();
    if(Math.floor(t/4.2)%3===1){x.fillStyle=MPL.VERM;x.beginPath();x.arc(px-nx*sd*1.8,py-ny*sd*1.8,.8,0,6.3);x.fill()}if(Math.floor(t/4.2)%4===2){x.fillStyle=MPL.GOLD;x.beginPath();x.arc(px-nx*sd*1.6,py-ny*sd*1.6,.7,0,6.3);x.fill()}}
  x.restore()}
function mpPilgSpaced(x,t,cx,cy,sz,col,sp,font){x.save();x.font=`${sz}px ${font||FTITLE}`;x.textBaseline='middle';x.textAlign='left';x.lineJoin='round';let w=0;for(const ch of t)w+=x.measureText(ch).width+sp;w-=sp;let a=cx-w/2;
  for(const ch of t){x.lineWidth=3;x.strokeStyle='rgba(238,226,190,.85)';x.strokeText(ch,a,cy);x.fillStyle=col;x.fillText(ch,a,cy);a+=x.measureText(ch).width+sp}x.restore()}

function mpPilgDraw(c,x,L,api){
  const H=hash2,ink=MPL.INK,T=api.text,A=MPL.AREA,TAU=Math.PI*2;
  const R=[],RI=[];for(let i=0;i<=500;i++){R.push(mpPilgP(i/500));RI.push(mpPilgIn(i/500))}
  const near=(a,b)=>{let m=1e9,k=0;for(let i=0;i<R.length;i+=2){const d=(R[i][0]-a)*(R[i][0]-a)+(R[i][1]-b)*(R[i][1]-b);if(d<m){m=d;k=i}}const n=RI[k];return {d:Math.sqrt(m),out:((a-R[k][0])*n[0]+(b-R[k][1])*n[1])<0,k}};
  const S=[];for(let i=0;i<=100;i++){const f=i/100;S.push(mpPilgOff(f,23+3*Math.sin(f*55)))}
  S.push([196,300],[228,318],[268,320],[306,318],[330,300]);/* no south shore: the Narrow Sea runs on past the edge of the map */
  const pip=(a,b)=>{let ins=false;for(let i=0,j=S.length-1;i<S.length;j=i++){const pi=S[i],pj=S[j];if((pi[1]>b)!==(pj[1]>b)&&a<(pj[0]-pi[0])*(b-pi[1])/(pj[1]-pi[1])+pi[0])ins=!ins}return ins};
  const labs=[],lab=(t,a,b,sz,col,al)=>labs.push(()=>T(x,t,a,b,sz,col,al));
  const fMon=lpGY(LPM.SEG,LPM.Y)/LP_TOT,M=mpPilgP(fMon);
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  /* ---- the land: washes, grass tufts, low hills ---- */
  x.save();x.globalAlpha=.16;for(let i=0;i<70;i++){x.fillStyle=i%3?'#7a9a58':i%3===1?'#b49a5a':'#6a8a60';x.beginPath();x.ellipse(A.x+H(i,1,61)*A.w,A.y+H(i,2,61)*A.h,8+H(i,3,61)*26,4+H(i,4,61)*12,H(i,5,61)*3,0,TAU);x.fill()}x.restore();
  x.lineCap='round';x.strokeStyle='rgba(70,100,52,.7)';x.lineWidth=.5;
  for(let i=0;i<1100;i++){const a=A.x+H(i,1,62)*A.w,b=A.y+H(i,2,62)*A.h;if(pip(a,b))continue;x.beginPath();x.moveTo(a-1.2,b);x.lineTo(a,b-2);x.lineTo(a+1.2,b);x.moveTo(a,b);x.lineTo(a,b-1.4);x.stroke()}
  x.strokeStyle='rgba(90,70,40,.45)';x.lineWidth=.6;for(let i=0;i<40;i++){const a=A.x+H(i,1,63)*A.w,b=A.y+70+H(i,2,63)*(A.h-80);if(pip(a,b)||pip(a+10,b))continue;const w=6+H(i,3,63)*8;x.beginPath();x.moveTo(a-w,b);x.quadraticCurveTo(a,b-w*.5,a+w,b);x.stroke()}
  /* ---- the Narrow Sea ---- */
  x.save();x.beginPath();mpPilgSmooth(x,S);const g=x.createRadialGradient(237,170,10,237,170,150);g.addColorStop(0,'rgba(60,112,150,.78)');g.addColorStop(1,'rgba(96,150,164,.66)');x.fillStyle=g;x.fill();x.clip();
  x.beginPath();mpPilgSmooth(x,S);for(const [w,al] of [[18,.16],[11,.2],[5,.26]]){x.lineWidth=w;x.strokeStyle=`rgba(206,236,230,${al})`;x.stroke()}
  x.strokeStyle='rgba(30,60,110,.13)';x.lineWidth=.5;for(let k=0;k<16;k++){const an=k*TAU/16;x.beginPath();x.moveTo(237,175);x.lineTo(237+Math.cos(an)*170,175+Math.sin(an)*170);x.stroke()}
  x.beginPath();x.arc(237,175,34,0,TAU);x.stroke();
  x.lineCap='round';for(let i=0;i<300;i++){const a=130+H(i,1,64)*215,b=96+H(i,2,64)*170;if(!pip(a,b))continue;const w=2.2+H(i,3,64)*3.4;x.strokeStyle=H(i,4,64)<.3?'rgba(240,248,250,.75)':'rgba(24,56,100,.55)';x.lineWidth=.55;x.beginPath();x.moveTo(a-w,b);x.quadraticCurveTo(a-w/2,b-w*.55,a,b);x.quadraticCurveTo(a+w/2,b+w*.55,a+w,b);x.stroke()}
  x.restore();
  x.strokeStyle='rgba(30,50,80,.85)';x.lineWidth=.9;x.beginPath();mpPilgSmooth(x,S);x.stroke();
  x.strokeStyle='rgba(60,50,30,.6)';x.lineWidth=.45;for(let i=0;i<260;i++){const f=i/260,p=mpPilgOff(f,23+3*Math.sin(f*55)),q=mpPilgOff(f,26.4+3*Math.sin(f*55));x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(q[0],q[1]);x.stroke()}
  /* sandy south coast, reeds and dunes */
  x.strokeStyle='rgba(120,92,50,.6)';x.lineWidth=.5;for(let i=0;i<70;i++){const a=190+H(i,1,65)*140,b=262+H(i,2,65)*28;if(pip(a,b))continue;const w=4+H(i,3,65)*6;x.beginPath();x.moveTo(a-w,b);x.quadraticCurveTo(a,b-w*.4,a+w,b);x.stroke()}
  x.strokeStyle='#5a7a3a';x.lineWidth=.55;for(let i=0;i<40;i++){const f=.88+H(i,1,66)*.1,p=mpPilgOff(f,19+H(i,2,66)*3);for(let k=0;k<3;k++){x.beginPath();x.moveTo(p[0]+k-1,p[1]+1);x.lineTo(p[0]+k*1.4-1.4,p[1]-3-H(i,k,67)*2);x.stroke()}}
  /* ships, the sea monster, the name of the sea */
  mpPilgShip(x,226,146,1.15,false,MPL.VERM);mpPilgShip(x,238,196,.8,true,MPL.LAPIS);mpPilgShip(x,300,120,.8,true,MPL.VERM);mpPilgShip(x,200,240,.65,false,MPL.VERM);
  mpPilgSerpent(x,194,222,.9);mpPilgKraken(x,290,284,.72);
  for(const [px,py] of [[270,155],[190,128],[255,238]]){x.strokeStyle='rgba(30,60,100,.7)';x.lineWidth=.6;x.beginPath();x.arc(px,py,5,0,TAU*.75);x.stroke();x.beginPath();x.arc(px,py,2.6,0,TAU*.75);x.stroke()}
  labs.push(()=>mpPilgSpaced(x,'THE NARROW SEA',237,172,13,'#1c3a5a',2.4));
  T&&0;
  /* ---- the headland and Saint Elen's Monastery, halfway ---- */
  {const hx=M[0],hy=M[1];const HL=[[hx-52,hy-2],[hx-54,hy+16],[hx-46,hy+38],[hx-26,hy+58],[hx,hy+64],[hx+26,hy+58],[hx+46,hy+38],[hx+54,hy+16],[hx+52,hy-2]];
    x.save();x.beginPath();x.moveTo(HL[0][0],HL[0][1]-6);for(const p of HL)x.lineTo(p[0],p[1]);x.lineTo(HL[8][0],HL[8][1]-6);x.closePath();
    x.save();x.beginPath();mpPilgSmooth(x,[[hx-60,hy-8],...HL,[hx+60,hy-8]]);x.fillStyle='#cdbf8e';x.fill();x.strokeStyle='rgba(30,50,80,.85)';x.lineWidth=.9;x.stroke();x.restore();
    x.restore();
    x.save();x.beginPath();mpPilgSmooth(x,[[hx-60,hy-8],...HL,[hx+60,hy-8]]);x.clip();
    x.strokeStyle='rgba(70,100,52,.7)';x.lineWidth=.5;for(let i=0;i<140;i++){const a=hx-56+H(i,1,68)*112,b=hy+H(i,2,68)*66;x.beginPath();x.moveTo(a-1.2,b);x.lineTo(a,b-2);x.lineTo(a+1.2,b);x.stroke()}
    x.restore();
    x.strokeStyle='rgba(60,50,30,.6)';x.lineWidth=.5;for(let i=0;i<46;i++){const t=i/46*Math.PI,a=hx+Math.cos(t)*51,b=hy+14+Math.sin(t)*50*(Math.sin(t)>.2?1:1);x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.cos(t)*3,b+Math.sin(t)*3);x.stroke()}
    for(let i=0;i<6;i++){const t=.3+i*.48,a=hx+Math.cos(t)*57,b=hy+14+Math.sin(t)*56;x.fillStyle='#9a9488';x.strokeStyle=ink;x.lineWidth=.5;x.beginPath();x.ellipse(a,b,2.2,1.4,0,0,TAU);x.fill();x.stroke()}
    /* dirt lane from the road to the gate */
    x.strokeStyle='rgba(226,206,150,.95)';x.lineWidth=3;x.beginPath();x.moveTo(hx,hy);x.lineTo(hx,hy+13);x.stroke();x.strokeStyle='rgba(90,60,30,.6)';x.lineWidth=.5;x.setLineDash([1.5,1.5]);x.beginPath();x.moveTo(hx-1.6,hy);x.lineTo(hx-1.6,hy+13);x.moveTo(hx+1.6,hy);x.lineTo(hx+1.6,hy+13);x.stroke();x.setLineDash([]);
    /* garden plots */
    for(let r=0;r<4;r++){x.fillStyle=r%2?'#8aaa58':'#6a9a50';x.fillRect(hx+22,hy+26+r*4.4,16,3);x.strokeStyle='rgba(42,26,12,.5)';x.lineWidth=.35;x.strokeRect(hx+22,hy+26+r*4.4,16,3)}
    for(let r=0;r<3;r++){x.fillStyle='#a8b868';x.fillRect(hx-40,hy+34+r*4.4,14,3);x.strokeStyle='rgba(42,26,12,.5)';x.lineWidth=.35;x.strokeRect(hx-40,hy+34+r*4.4,14,3)}
    /* the walls with their teeth, towers at the corners and the gate */
    const wx0=hx-27,wx1=hx+27,wy0=hy+14,wy1=hy+54;
    x.fillStyle='#cfc6ae';x.strokeStyle=ink;x.lineWidth=.9;x.fillStyle='rgba(230,222,196,.8)';x.fillRect(wx0,wy0,wx1-wx0,wy1-wy0);x.strokeRect(wx0,wy0,wx1-wx0,wy1-wy0);
    x.fillStyle='#bdb396';for(let a=wx0+1;a<wx1-1;a+=3.6){x.fillRect(a,wy0-1.6,2,1.8);x.fillRect(a,wy1-.2,2,1.8)}for(let b=wy0+1;b<wy1-1;b+=3.6){x.fillRect(wx0-1.6,b,1.8,2);x.fillRect(wx1-.2,b,1.8,2)}
    /* the courtyard: cloister, dormitory, well */
    x.fillStyle='#8aaa62';x.fillRect(wx0+4,wy0+22,13,11);x.strokeStyle=ink;x.lineWidth=.6;x.strokeRect(wx0+4,wy0+22,13,11);x.strokeStyle='#d8d0b8';x.lineWidth=1.2;x.strokeRect(wx0+2.6,wy0+20.6,15.8,13.8);
    x.fillStyle='#4a6a3a';for(let k=0;k<4;k++){x.beginPath();x.arc(wx0+7+k*3,wy0+27,1,0,TAU);x.fill()}
    x.fillStyle='#8aa6b8';x.beginPath();x.arc(wx0+34,wy0+28,2.2,0,TAU);x.fill();x.strokeStyle=ink;x.lineWidth=.6;x.stroke();
    mpPilgHouse(x,wx0+9,wy0+11,1.1,'house',MPL.VERM);mpPilgHouse(x,wx0+22,wy0+37,.9,'house','#a85a2a');mpPilgHouse(x,wx0+40,wy0+36,.9,'house',MPL.VERM);
    mpPilgHouse(x,hx+3,wy0+23,2.0,'church',MPL.LAPIS);
    for(const [tx,ty] of [[wx0,wy0],[wx1,wy0],[wx0,wy1],[wx1,wy1]]){MPLI.tower(x,tx,ty+3,.62)}
    x.fillStyle='#2a1a0c';x.beginPath();x.moveTo(hx-2.6,wy0+1);x.lineTo(hx-2.6,wy0-3);x.arc(hx,wy0-3,2.6,Math.PI,0);x.lineTo(hx+2.6,wy0+1);x.fill();
    mpPilgBanner(x,wx0+1,wy0-4,MPL.VERM,false);mpPilgBanner(x,wx1-1,wy0-4,MPL.LAPIS,true);
    x.fillStyle=MPL.VERM;x.strokeStyle=ink;x.lineWidth=.9;x.beginPath();x.arc(hx,hy,3.3,0,TAU);x.fill();x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(hx,hy,1.1,0,TAU);x.fill();
    mpPilgShip(x,hx-72,hy+40,.7,false,MPL.VERM);
    labs.push(()=>mpPilgSpaced(x,'SAINT ELEN’S MONASTERY',hx,hy+71,6.8,'#6a1a10',.9,FUI));
    labs.push(()=>T(x,'halfway: rest, quests and a quiet reward',hx,hy+78,5.4,'#6a1a10'))}
  /* ---- mountains across the north, with a falcon ---- */
  for(let r=0;r<2;r++){const base=r?72:63,sc0=r?1.15:1.7,step=r?15:21;for(let i=0;i<24;i++){const a=A.x-4+i*step+(H(i,r,70)-.5)*8,b=base+(H(i,r,71)-.5)*4,sc=sc0*(.82+H(i,r,72)*.4);if(a>A.x+A.w+8)continue;
      MPLI.mountain(x,a,b,sc);x.strokeStyle='rgba(42,26,12,.55)';x.lineWidth=.4;for(let k=0;k<7;k++){const u=a+1+k*1.1*sc,v=b-5.8*sc+k*.7*sc;x.beginPath();x.moveTo(u,v);x.lineTo(u+(2.6+k*.3)*sc,v+(1.7+k*.3)*sc);x.stroke()}}}
  x.strokeStyle='rgba(250,250,244,.8)';x.lineWidth=1;for(const [cx0,cy0] of [[150,44],[318,48],[250,40]]){x.beginPath();x.moveTo(cx0-9,cy0);x.quadraticCurveTo(cx0,cy0-2.4,cx0+9,cy0);x.stroke()}
  mpPilgFalcon(x,308,40,.8,false);mpPilgFalcon(x,140,47,.6,true);
  labs.push(()=>mpPilgSpaced(x,'THE MOUNTAINS',226,36,9,'#4a3a28',2,FUI));
  /* ---- the oak forests on the outer sides ---- */
  const trees=[];for(let i=0;i<2600&&trees.length<420;i++){const a=A.x+H(i,1,73)*A.w,b=A.y+H(i,2,73)*A.h;if(b<68)continue;if(b>238&&a>120&&a<215)continue;if(b>232&&a>312)continue;if(pip(a,b)||b>262&&a>195&&a<335)continue;const n=near(a,b);if(!n.out||n.d<8.5||n.d>60)continue;if(Math.hypot(a-M[0],b-M[1])<60&&b>M[1]-4)continue;trees.push([a,b,.55+H(i,3,73)*.4,i])}
  trees.sort((p,q)=>p[1]-q[1]);const gr=['#4a7a3a','#3f6e34','#587f3c','#6a8a3c','#356a44'];
  for(const [a,b,s,i] of trees){if(H(i,5,74)<.14)MPLI.pine(x,a,b,s*.8);else MPLI.tree(x,a,b,s,gr[i%5])}
  labs.push(()=>{x.save();x.translate(377,176);x.rotate(Math.PI/2);T(x,'The Oak Forest',0,0,6.4,'#1c3a14');x.restore();x.save();x.translate(100,150);x.rotate(-Math.PI/2);T(x,'The Oak Forest',0,0,6.4,'#1c3a14');x.restore()});
  /* shrubs on the shore strip */
  const place=[];for(const [seg,kind,row,name] of LP_BUILD){const f=lpGY(seg,row)/LP_TOT;place.push([f,seg,kind,name])}
  for(let i=0;i<300;i++){const f=H(i,1,75),d=9+H(i,2,75)*12,p=mpPilgOff(f,d);if(pip(p[0],p[1])||p[1]<80)continue;if(Math.hypot(p[0]-M[0],p[1]-M[1])<62&&p[1]>M[1])continue;if(p[1]>232&&(p[0]<215||p[0]>312))continue;let ok=true;for(const [pf] of place){const q=mpPilgOff(pf,15);if(Math.hypot(p[0]-q[0],p[1]-q[1])<12)ok=false}if(ok&&i%2)MPLI.tree(x,p[0],p[1],.42+H(i,3,75)*.2,gr[i%5])}
  /* ---- waterfalls: a spring from the mountains, a fall, a stream to the sea ---- */
  const falls=[];for(const s of LP_FALLS){const f=lpGY(s,400)/LP_TOT,p=mpPilgP(f),n=mpPilgIn(f);falls.push({f,p,n});
    const a=[p[0]-n[0]*18,p[1]-n[1]*18],b=[p[0]+n[0]*25,p[1]+n[1]*25];
    x.strokeStyle='rgba(30,70,110,.9)';x.lineWidth=2.6;x.lineCap='round';x.beginPath();x.moveTo(p[0],p[1]);for(let t=.1;t<=1.001;t+=.1){const q=[p[0]+(b[0]-p[0])*t+Math.sin(t*9)*1.4,p[1]+(b[1]-p[1])*t+Math.cos(t*9)*0.6];x.lineTo(q[0],q[1])}x.stroke();
    x.strokeStyle='rgba(130,190,220,.95)';x.lineWidth=1.5;x.stroke();
    x.fillStyle='#8a8a84';x.strokeStyle=ink;x.lineWidth=.7;x.beginPath();x.moveTo(a[0]-8,a[1]+8);x.lineTo(a[0]-6,a[1]-4);x.lineTo(a[0]+6,a[1]-4);x.lineTo(a[0]+8,a[1]+8);x.closePath();x.fill();x.stroke();
    x.fillStyle='rgba(120,180,214,.95)';x.fillRect(a[0]-1.8,a[1]-3,3.6,p[1]-a[1]+2);x.strokeRect(a[0]-1.8,a[1]-3,3.6,p[1]-a[1]+2);
    x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=.5;for(let k=0;k<5;k++){x.beginPath();x.moveTo(a[0]-1+k*.5,a[1]-2);x.lineTo(a[0]-1+k*.5,p[1])}x.stroke();
    x.fillStyle='rgba(255,255,255,.7)';for(let k=0;k<5;k++){x.beginPath();x.arc(p[0]-3+k*1.5,p[1]-1.5+(k%2),1.1,0,TAU);x.fill()}
    lab('Falls',p[0]+3,p[1]+10,5.2,'#1c3a5a','left')}
  /* ---- the road: a dirt ribbon with edge stones ---- */
  const trace=(w,col,dash)=>{x.save();x.strokeStyle=col;x.lineWidth=w;x.lineCap='round';x.lineJoin='round';if(dash)x.setLineDash(dash);x.beginPath();for(let i=0;i<=400;i++){const p=mpPilgP(i/400);i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])}x.stroke();x.restore()};
  trace(5.6,'rgba(42,26,12,.85)');trace(4.2,'#dcc590');trace(3.2,'#e6d4a2');trace(.6,'rgba(150,110,60,.5)',[1.4,2.4]);
  for(let i=0;i<260;i++){const f=H(i,1,76),p=mpPilgP(f),n=mpPilgIn(f),sd=(i%2?1:-1)*(2.9+H(i,2,76)*.5);x.fillStyle='rgba(110,90,60,.8)';x.beginPath();x.arc(p[0]+n[0]*sd,p[1]+n[1]*sd,.45,0,TAU);x.fill()}
  /* ---- one signpost for every kilometre, and the stone and number every five ---- */
  for(let m=1;m<LP_KM;m++){const f=m*LP_ROWS_KM/LP_TOT,toY=LP_KM-m,p=mpPilgOff(f,3.9);
    if(toY%5===0){const q=mpPilgOff(f,8.4);mpPilgStone(x,q[0],q[1]+3,.85);const o=mpPilgOff(f,-9.5);labs.push(()=>{x.save();x.fillStyle='rgba(240,230,196,.92)';x.strokeStyle=MPL.GOLD;x.lineWidth=.6;x.beginPath();x.arc(o[0],o[1],4.1,0,TAU);x.fill();x.stroke();x.restore();T(x,String(toY),o[0],o[1]+.2,4.9,'#6a1a10')})}
    mpPilgPost(x,p[0],p[1]+1.4,.62)}
  /* ---- shrines: a cairn of grey stones every two kilometres, each with a gift left on it ---- */
  const gifts=['#c43a22','#e0a838','#5a8a46','#f0e4c0'];
  for(let m=1;m<LP_KM/2;m++){const g=Math.round(m*2*LP_ROWS_KM)+14,f=g/LP_TOT,p=mpPilgOff(f,6.4);mpPilgCairn(x,p[0],p[1]+1.6,.74,gifts[m%4])}
  /* ---- bridges over the streams ---- */
  for(const fl of falls){const {p,n}=fl,tx=-n[1],ty=n[0],ang=Math.atan2(ty,tx);x.save();x.translate(p[0],p[1]);x.rotate(ang);
    x.fillStyle='#8a5a30';x.strokeStyle=ink;x.lineWidth=.6;x.fillRect(-7,-2.6,14,5.2);x.strokeRect(-7,-2.6,14,5.2);
    x.strokeStyle='rgba(42,26,12,.8)';x.lineWidth=.4;for(let k=-6;k<=6;k+=1.6){x.beginPath();x.moveTo(k,-2.6);x.lineTo(k,2.6);x.stroke()}
    x.strokeStyle=ink;x.lineWidth=.6;for(const sx of [-1,1]){x.beginPath();x.moveTo(sx*7,-3.6);x.lineTo(sx*7,3.6);x.stroke()}
    x.strokeStyle='#d8c090';x.lineWidth=.7;for(const sy of [-3.4,3.4]){x.beginPath();x.moveTo(-7,sy);x.quadraticCurveTo(0,sy+Math.sign(sy)*1.4,7,sy);x.stroke()}x.restore()}
  /* ---- houses, inns and churches, each with its painted roof and its name ---- */
  const roofs={house:['#a85a2a','#8a4a2a','#b8321e','#6a6a78'],inn:[MPL.VERM],church:[MPL.LAPIS]};
  place.forEach(([f,seg,kind,name],i)=>{
    if(seg===LPM.SEG)return; // the chapel of the Quiet is inside the monastery
    const p=mpPilgP(f),n=mpPilgIn(f),b=[p[0]+n[0]*15,p[1]+n[1]*15];
    x.strokeStyle='rgba(120,90,50,.9)';x.lineWidth=1.2;x.setLineDash([1.6,1.4]);x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(b[0],b[1]);x.stroke();x.setLineDash([]);
    const rf=roofs[kind][i%roofs[kind].length];
    mpPilgHouse(x,b[0],b[1]+2,kind==='church'?1.15:1.05,kind,rf);
    const nm=MPPILG_SHORT[name]||name,col=kind==='inn'?'#7a2418':kind==='church'?'#1c2e6a':ink;
    if(Math.abs(n[0])>Math.abs(n[1]))lab(nm,b[0]+Math.sign(n[0])*9,b[1]+1+(name==='The Fisherman’s House'?-6:0),6,col,n[0]>0?'left':'right');
    else lab(nm,b[0],b[1]+Math.sign(n[1])*10+(name==='The Hermit’s House'?8:0),6,col)});
  /* little boats at the inns */
  for(const [f,seg,kind] of place){if(kind!=='inn')continue;const q=mpPilgOff(f,33);x.save();x.translate(q[0],q[1]);x.fillStyle='#7a4a24';x.strokeStyle=ink;x.lineWidth=.5;x.beginPath();x.moveTo(-3.5,-.5);x.quadraticCurveTo(0,2.8,3.5,-.5);x.closePath();x.fill();x.stroke();x.restore()}
  /* ---- the Land Gate and Oldhaven ---- */
  {const o=mpPilgP(0),gy=o[1]+8;x.fillStyle='#d4caa8';x.strokeStyle=ink;x.lineWidth=.9;
    for(let i=0;i<9;i++){const hx2=o[0]-30+i*7.4+(H(i,1,77)-.5)*2,hy2=gy+19+(i%3)*5.4;if(hy2>A.y+A.h-10)continue;MPLI.house(x,hx2,hy2,.72,['#a85a2a','#b8321e','#8a4a2a','#6a6a78','#7a4a2a'][i%5])}
    MPLI.church(x,o[0]-34,gy+24,.7);MPLI.castle(x,o[0]+22,gy+16,.62);
    x.fillStyle='rgba(222,212,184,.95)';x.fillRect(o[0]-37,gy-3,74,6);x.strokeRect(o[0]-37,gy-3,74,6);
    x.fillStyle='#bdb396';for(let a=o[0]-36;a<o[0]+36;a+=4){x.fillRect(a,gy-5,2.2,2.2)}
    for(const tx of [-37,-8,8,37]){MPLI.tower(x,o[0]+tx,gy+4,.62)}
    x.fillStyle='#2a1a0c';x.beginPath();x.moveTo(o[0]-3.4,gy+3.4);x.lineTo(o[0]-3.4,gy-1);x.arc(o[0],gy-1,3.4,Math.PI,0);x.lineTo(o[0]+3.4,gy+3.4);x.fill();x.strokeStyle='#8a6a3a';x.lineWidth=.45;for(let k=-2;k<=2;k++){x.beginPath();x.moveTo(o[0]+k,gy-3.6);x.lineTo(o[0]+k,gy+3.4);x.stroke()}
    mpPilgBanner(x,o[0]-8,gy-5,MPL.VERM,false);mpPilgBanner(x,o[0]+8,gy-5,MPL.LAPIS,true);
    lab('OLDHAVEN',o[0]+4,gy+34,8,ink);lab('The Land Gate, 96 km',o[0]-9,gy-10,5.6,'#6a1a10','right')}
  /* ---- the cliff above Yarrim, the goat track, and the town at its foot ---- */
  {const y=mpPilgP(1),cx0=y[0],cy0=y[1];
    x.fillStyle='#9a8a74';x.strokeStyle=ink;x.lineWidth=.9;x.beginPath();x.moveTo(cx0-30,cy0+2);for(let k=0;k<=8;k++){x.lineTo(cx0-30+k*1.2+(k%2?-2:1),cy0+2+k*2.6+(H(k,1,79)-.5)*3)}x.lineTo(cx0-27,cy0+23);x.lineTo(cx0+31,cy0+23);for(let k=8;k>=0;k--){x.lineTo(cx0+30-k*.9+(k%2?2:-1),cy0+2+k*2.6+(H(k,2,79)-.5)*3)}x.closePath();x.fill();x.stroke();x.strokeStyle='rgba(42,26,12,.5)';x.lineWidth=.5;for(let k=1;k<6;k++){x.beginPath();x.moveTo(cx0-26+k,cy0+3+k*3.4);x.lineTo(cx0+26-k,cy0+3+k*3.4+(k%2?1:-1));x.stroke()}x.fillStyle='rgba(60,40,20,.18)';x.fillRect(cx0+6,cy0+3,24,20);
    x.strokeStyle='rgba(42,26,12,.55)';x.lineWidth=.4;for(let k=0;k<30;k++){const u=cx0-26+k*1.9,v=cy0+4+(k%3)*2;x.beginPath();x.moveTo(u,v);x.lineTo(u+(H(k,1,78)-.5)*1.4,v+6+H(k,2,78)*10);x.stroke()}
    x.fillStyle='rgba(100,140,80,.8)';x.fillRect(cx0-29,cy0+1,58,3);
    x.strokeStyle='#f0e4c0';x.lineWidth=1;x.setLineDash([1.6,1.2]);x.beginPath();x.moveTo(cx0,cy0+2);x.lineTo(cx0+9,cy0+7);x.lineTo(cx0-5,cy0+12);x.lineTo(cx0+8,cy0+17);x.lineTo(cx0-2,cy0+23);x.stroke();x.setLineDash([]);
    x.fillStyle='rgba(96,150,164,.7)';x.fillRect(cx0-40,cy0+24,86,12);x.strokeStyle='rgba(30,50,80,.8)';x.lineWidth=.6;x.strokeRect(cx0-40,cy0+24,86,12);
    x.strokeStyle='rgba(240,248,250,.8)';x.lineWidth=.5;for(let k=0;k<9;k++){const u=cx0-36+k*10,v=cy0+30+(k%2)*3;x.beginPath();x.moveTo(u-2.4,v);x.quadraticCurveTo(u,v-1.6,u+2.4,v);x.stroke()}
    for(let i=0;i<7;i++){MPLI.house(x,cx0-26+i*8.6,cy0+24+(i%2)*1.4,.6,['#a85a2a','#b8321e','#8a4a2a','#6a6a78'][i%4])}
    MPLI.church(x,cx0+34,cy0+24,.55);mpPilgShip(x,cx0-18,cy0+34,.5,false,MPL.LAPIS);
    mpPilgBanner(x,cx0,cy0,MPL.VERM,false);
    lab('YARRIM',cx0,cy0+38,8,ink);lab('the cliff: a way down, none back',cx0+34,cy0+7,5.6,'#6a1a10','left');lab('0 km',cx0-12,cy0-8,5.6,'#6a1a10','right')}
  /* ---- pilgrims walking the road ---- */
  [[.035,'#6a3a2a'],[.12,'#2f5a8a'],[.24,'#7a2a2a'],[.305,'#5a5a30'],[.43,'#6a3a2a'],[.5,'#3a3a6a'],[.62,'#7a2a2a'],[.7,'#2f5a8a'],[.83,'#5a5a30'],[.93,'#6a3a2a']].forEach(([f,col],i)=>{const p=mpPilgP(f),n=mpPilgIn(f);mpPilgFolk(x,p[0]+n[0]*(i%2?-.8:.8),p[1]+n[1]*(i%2?-.8:.8)+1.4,col)});
  labs.forEach(fn=>fn());
  x.restore();
  /* ---- the frame of the drawing, with a vine along every side ---- */
  x.save();x.lineWidth=2.2;x.strokeStyle=MPL.LAPIS;x.strokeRect(A.x-1,A.y-1,A.w+2,A.h+2);x.lineWidth=1;x.strokeStyle=MPL.GOLD;x.strokeRect(A.x-3.2,A.y-3.2,A.w+6.4,A.h+6.4);x.strokeStyle=ink;x.lineWidth=.6;x.strokeRect(A.x-4.2,A.y-4.2,A.w+8.4,A.h+8.4);x.restore();
  mpPilgVine(x,A.x+2,A.y-7.4,A.x+A.w-2,A.y-7.4,1.6,0);mpPilgVine(x,A.x+2,A.y+A.h+7.4,A.x+A.w-2,A.y+A.h+7.4,1.6,2);
  mpPilgVine(x,A.x-7.4,A.y+2,A.x-7.4,A.y+A.h-2,1.6,4);mpPilgVine(x,A.x+A.w+7.4,A.y+2,A.x+A.w+7.4,A.y+A.h-2,1.6,1);
  for(const [a,b] of [[A.x,A.y],[A.x+A.w,A.y],[A.x,A.y+A.h],[A.x+A.w,A.y+A.h]]){x.fillStyle=MPL.GOLD;x.strokeStyle=ink;x.lineWidth=.7;x.beginPath();x.arc(a,b,4.4,0,TAU);x.fill();x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.arc(a,b,2.5,0,TAU);x.fill();x.fillStyle=MPL.LAPIS;x.beginPath();x.arc(a,b,1,0,TAU);x.fill()}
  /* ---- title, notes, compass ---- */
  api.title(x,'The Pilgrim’s Path','96 kilometres, Oldhaven to Yarrim');
  api.panel(x,8,56,78,192);
  api.notes(x,['The road is 96 km long and goes one way: from the Land Gate of Oldhaven to the cliff above Yarrim. There is no road back.','A signpost stands at every kilometre and counts down to Yarrim. A teleport stone stands beside every fifth one.','A heap of stones stands every 2 km. Pilgrims leave food on it for the hungry.','Saint Elen’s Monastery stands halfway, on a headland in the sea. The inns give a bed, the churches a blessing.'],13,64,68,5.7,4);
  api.compass(x,46,276,11);
  /* ---- the key ---- */
  api.panel(x,392,36,84,226);
  T(x,'KEY',434,46,7.5,ink);
  const KX=400,KT=410;let ky=58;
  const row=(t,fn)=>{fn(KX+3,ky);T(x,t,KT,ky-.5,5.7,'#3a2a1c','left');ky+=14.4};
  row('House',(a,b)=>mpPilgHouse(x,a,b+2,.9,'house','#a85a2a'));
  row('Inn',(a,b)=>mpPilgHouse(x,a+1,b+2,.8,'inn',MPL.VERM));
  row('Church',(a,b)=>mpPilgHouse(x,a-1,b+3,.85,'church',MPL.LAPIS));
  row('Monastery',(a,b)=>MPLI.castle(x,a,b+4,.55));
  row('Shrine, every 2 km',(a,b)=>mpPilgCairn(x,a,b+4,1,gifts[1]));
  row('Signpost, every km',(a,b)=>mpPilgPost(x,a,b+3,1));
  row('Teleport stone',(a,b)=>mpPilgStone(x,a,b+4,1));
  row('Waterfall',(a,b)=>{x.fillStyle='#8a8a84';x.strokeStyle=ink;x.lineWidth=.5;x.fillRect(a-3,b-5,6,3);x.strokeRect(a-3,b-5,6,3);x.fillStyle='rgba(120,180,214,.95)';x.fillRect(a-1.2,b-3,2.4,8)});
  row('Rope bridge',(a,b)=>{x.fillStyle='#8a5a30';x.strokeStyle=ink;x.lineWidth=.5;x.fillRect(a-5,b-1.4,10,2.8);x.strokeRect(a-5,b-1.4,10,2.8)});
  row('Km to Yarrim',(a,b)=>{x.fillStyle='rgba(240,230,196,.92)';x.strokeStyle=MPL.GOLD;x.lineWidth=.6;x.beginPath();x.arc(a,b,4,0,TAU);x.fill();x.stroke();T(x,'25',a,b+.2,4.6,'#6a1a10')});
  row('Road already walked',(a,b)=>{x.strokeStyle='rgba(42,26,12,.95)';x.lineWidth=1.7;x.beginPath();x.moveTo(a-5,b);x.lineTo(a+5,b);x.stroke()});
  row('Road ahead',(a,b)=>{x.strokeStyle='rgba(42,26,12,.95)';x.lineWidth=1.2;x.setLineDash([2,1.6]);x.beginPath();x.moveTo(a-5,b);x.lineTo(a+5,b);x.stroke();x.setLineDash([])});
  row('You (the arrow)',(a,b)=>{x.save();x.translate(a,b);x.fillStyle='#ffe36a';x.strokeStyle=ink;x.lineWidth=.8;x.beginPath();x.moveTo(0,-5);x.lineTo(3.6,4.4);x.lineTo(0,2.2);x.lineTo(-3.6,4.4);x.closePath();x.fill();x.stroke();x.restore()});
  mpPilgFolk(x,420,ky+14,'#7a2a2a');mpPilgFolk(x,436,ky+15,'#2f5a8a');mpPilgFolk(x,452,ky+14,'#5a5a30');
  T(x,'pilgrims on the road',434,ky+24,5.4,'#5a3a1c')}
function mpPilgOverview(){
  if(!MPPILG.cv){const c=document.createElement('canvas');c.width=DW*MPL.S;c.height=DH*MPL.S;const x=c.getContext('2d');x.scale(MPL.S,MPL.S);
    try{mplParchment(x);mpPilgDraw(c,x,LEVELS[LEVEL],{parchment:mplParchment,border:mplBorder,title:mplTitle,compass:mplCompass,text:mplText,notes:mplNotes,panel:mplPanel,fit:mplFit,I:MPLI,wrap:mplWrap});mplBorder(x)}catch(e){console.error(e)}
    MPPILG.cv=c}
  const A=MPL.AREA,cur=mpPilgCur(),me=mpPilgP(cur),km=Math.round(cur*LP_KM);
  mplPaint(MPPILG.cv,MPL.S,A,()=>-9999,()=>-9999,'You are '+km+' km from Oldhaven and '+(LP_KM-km)+' km from Yarrim.');
  MPL.reveal=false;
  const z=mplZoom(),sx0=A.x-G.panX/z,sy0=A.y-G.panY/z,S=p=>[A.x+(p[0]-sx0)*z,A.y+(p[1]-sy0)*z];
  MPL.me=()=>{G.panX=(A.w/2)-(me[0]-A.x)*z;G.panY=(A.h/2)-(me[1]-A.y)*z;G.panX=Math.max(G.panMinX,Math.min(0,G.panX));G.panY=Math.max(G.panMinY,Math.min(0,G.panY))};
  const line=(f0,f1,col,w,dash)=>{const n=Math.max(2,Math.ceil((f1-f0)*400));ctx.strokeStyle=col;ctx.lineWidth=w;ctx.setLineDash(dash||[]);ctx.beginPath();for(let i=0;i<=n;i++){const q=S(mpPilgP(f0+(f1-f0)*i/n));i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])}ctx.stroke()};
  ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();ctx.lineCap='round';ctx.lineJoin='round';
  if(cur<1)line(cur,1,'rgba(42,26,12,.9)',Math.max(.9,1.1*z),[2.4*z,2.6*z]);
  if(cur>0){line(0,cur,'rgba(240,226,180,.7)',Math.max(2.2,3.2*z));line(0,cur,'rgba(30,18,8,.97)',Math.max(1.3,1.9*z))}
  ctx.setLineDash([]);
  const q=S(me),a0=S(mpPilgP(Math.max(0,cur-.004))),a1=S(mpPilgP(Math.min(1,cur+.004))),ang=Math.atan2(a1[1]-a0[1],a1[0]-a0[0])+Math.PI/2;
  if(q[0]>A.x-8&&q[0]<A.x+A.w+8&&q[1]>A.y-8&&q[1]<A.y+A.h+8){const pu=(Math.sin((G.time||0)*4)+1)/2;ctx.strokeStyle=`rgba(255,227,106,${.75-.4*pu})`;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(q[0],q[1],8+4*pu,0,6.3);ctx.stroke();
    ctx.translate(q[0],q[1]);ctx.rotate(ang);ctx.fillStyle='#ffe36a';ctx.strokeStyle='#2a1a0c';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(5,6);ctx.lineTo(0,3);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();ctx.stroke()}
  ctx.restore()}
{const _do=drawOverview;drawOverview=function(){
  if(!(LEVEL>=LP.BASE&&LEVEL<LP.BASE+LP.N)||G.world||G.teleMode||!LEVELS[LEVEL])return _do.apply(this,arguments);
  mpPilgOverview()}}
