/* Area map for Last Light (island level 303): a lonely rock with a broken lighthouse, drawn from the real island data (fmap shows the shallows, beach, grass and hill).
   Names start with mpLastLight. Uses the shared tools in maps_common.js. The seabed (323) keeps the standard map. */
const mpLastLightH=(a,b,s)=>hash2(a,b,s||11);
/* the crop of the island level that fills the sheet: cells 15..85 across, 8..72 down */
const MPLL={x0:19,y0:9,w:62,h:58};
function mpLastLightFit(){const f=mplFit(MPLL.w,MPLL.h);return {s:f.s,X:c=>f.X(c-MPLL.x0),Y:c=>f.Y(c-MPLL.y0)}}
function mpLastLightBlob(x,cx,cy,r,seed,ry){ry=ry||r;x.beginPath();const n=8;for(let k=0;k<n;k++){const an=k/n*6.2832,rr=.86+.3*mpLastLightH(k,seed,3);const px=cx+Math.cos(an)*r*rr,py=cy+Math.sin(an)*ry*rr;k?x.lineTo(px,py):x.moveTo(px,py)}x.closePath()}
/* a short wave stroke: a little ink curl */
function mpLastLightWave(x,a,b,w,col){x.strokeStyle=col||'rgba(34,70,104,.62)';x.lineWidth=.6;x.beginPath();x.moveTo(a-w,b);x.quadraticCurveTo(a-w/2,b-w*.7,a,b);x.quadraticCurveTo(a+w/2,b+w*.7,a+w,b);x.stroke()}
function mpLastLightGull(x,a,b,s){x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-3*s,b+.8*s);x.quadraticCurveTo(a-1.4*s,b-2.2*s,a,b);x.quadraticCurveTo(a+1.4*s,b-2.2*s,a+3*s,b+.8*s);x.stroke()}
/* a rock in the water with a foam ring */
function mpLastLightRock(x,a,b,s,seed){x.save();x.strokeStyle='rgba(240,248,250,.9)';x.lineWidth=.8;x.beginPath();x.ellipse(a,b+.6*s,3.6*s,2.1*s,0,0,6.3);x.stroke();
  x.fillStyle='#7c7a76';x.strokeStyle=MPL.INK;x.lineWidth=.7;mpLastLightBlob(x,a,b,2.4*s,seed,1.8*s);x.fill();x.stroke();
  x.fillStyle='#a8a69e';mpLastLightBlob(x,a-.5*s,b-.6*s,1.1*s,seed+3,.8*s);x.fill();x.restore()}
/* a ship on her side, hull ribs showing, masts snapped */
function mpLastLightWreck(x,a,b,s,flip){x.save();x.translate(a,b);x.scale(flip?-s:s,s);x.rotate(-.12);
  x.fillStyle='#6a4a2c';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(-9,0);x.quadraticCurveTo(-5,5,4,4.4);x.lineTo(10,-2);x.lineTo(7,-1.6);x.quadraticCurveTo(0,1,-9,0);x.closePath();x.fill();x.stroke();
  x.strokeStyle='#2a1a0c';x.lineWidth=.6;for(let k=-6;k<8;k+=2.2){x.beginPath();x.moveTo(k,.4);x.lineTo(k+.8,-3.4-(k>0?k*.15:0));x.stroke()}
  x.lineWidth=.9;x.beginPath();x.moveTo(-2,0);x.lineTo(-3.6,-5.6);x.moveTo(4,-.4);x.lineTo(7.4,-3.6);x.stroke();
  x.fillStyle='#d8d0b8';x.beginPath();x.moveTo(-3.6,-5.6);x.lineTo(-6.6,-3.4);x.lineTo(-3.4,-2.4);x.closePath();x.fill();x.lineWidth=.5;x.stroke();x.restore();
  x.strokeStyle='rgba(240,248,250,.85)';x.lineWidth=.7;x.beginPath();x.ellipse(a,b+2.2*s,10*s,2.4*s,0,0,6.3);x.stroke()}
/* a small ship at anchor, seen from the side with a sail */
function mpLastLightShip(x,a,b,s){x.save();x.translate(a,b);x.scale(s,s);x.fillStyle='#8a5a30';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(-8,-1);x.lineTo(8,-1);x.lineTo(5.4,3.2);x.lineTo(-5.4,3.2);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(0,-1);x.lineTo(0,-12);x.stroke();x.fillStyle='#efe6cc';x.beginPath();x.moveTo(.6,-11);x.quadraticCurveTo(6,-7,.6,-2.4);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(-.6,-10);x.quadraticCurveTo(-4.6,-7,-.6,-3.6);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(0,-12);x.lineTo(3.4,-11);x.lineTo(0,-9.8);x.fill();x.restore()}
/* a flame, drawn as a teardrop in vermilion and gold */
function mpLastLightFlame(x,a,b,s){x.save();x.fillStyle=MPL.VERM;x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.moveTo(a,b-5.6*s);x.quadraticCurveTo(a+3*s,b-2*s,a+1.6*s,b);x.lineTo(a-1.6*s,b);x.quadraticCurveTo(a-3*s,b-2.2*s,a,b-5.6*s);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD2;x.beginPath();x.moveTo(a,b-3.4*s);x.quadraticCurveTo(a+1.6*s,b-1.2*s,a+.8*s,b);x.lineTo(a-.8*s,b);x.quadraticCurveTo(a-1.6*s,b-1.4*s,a,b-3.4*s);x.fill();x.restore()}
/* the broken lighthouse: a tapering banded tower, the top torn off in jagged stones, a dark door, a cracked lantern room lying beside it */
function mpLastLightTower(x,a,b,s){x.save();x.translate(a,b);x.scale(s,s);
  x.fillStyle='rgba(40,34,30,.3)';x.beginPath();x.ellipse(2,1,9,2.2,0,0,6.3);x.fill();
  const band=(y0,y1,w0,w1,col)=>{x.fillStyle=col;x.beginPath();x.moveTo(-w0,y0);x.lineTo(w0,y0);x.lineTo(w1,y1);x.lineTo(-w1,y1);x.closePath();x.fill();x.stroke()};
  x.strokeStyle=MPL.INK;x.lineWidth=.8;band(0,-5,6,5.4,'#e8e0cc');band(-5,-10,5.4,4.8,MPL.VERM);band(-10,-15,4.8,4.2,'#e8e0cc');band(-15,-19,4.2,3.8,MPL.VERM);
  x.fillStyle='#e8e0cc';x.beginPath();x.moveTo(-3.8,-19);x.lineTo(-2.6,-22.4);x.lineTo(-1.2,-20);x.lineTo(.4,-23.6);x.lineTo(1.6,-20.4);x.lineTo(3.8,-22);x.lineTo(3.8,-19);x.closePath();x.fill();x.stroke();
  x.strokeStyle='rgba(42,26,12,.75)';x.lineWidth=.5;x.beginPath();x.moveTo(-1.6,-6);x.lineTo(-.2,-9);x.lineTo(-1.6,-12);x.lineTo(.2,-15);x.stroke();
  x.fillStyle='#2a1a0c';x.beginPath();x.moveTo(-1.4,0);x.lineTo(-1.4,-3);x.quadraticCurveTo(0,-4.6,1.4,-3);x.lineTo(1.4,0);x.fill();
  x.fillStyle='#1c2a3a';x.fillRect(-.7,-8.6,1.4,2.2);x.fillRect(-.7,-13.6,1.4,2.2);
  /* the fallen lantern room, lying on its side among stones */
  x.save();x.translate(9,-1);x.rotate(.5);x.fillStyle='rgba(168,216,224,.7)';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(-2.6,-2,5.2,4);x.strokeRect(-2.6,-2,5.2,4);x.beginPath();x.moveTo(0,-2);x.lineTo(0,2);x.moveTo(-2.6,0);x.lineTo(2.6,0);x.stroke();x.fillStyle=MPL.INK;x.beginPath();x.moveTo(-3.2,-2);x.lineTo(0,-4.4);x.lineTo(3.2,-2);x.fill();x.restore();
  x.fillStyle='#8c8a84';for(const [dx,dy,r] of [[-8,0,1.2],[6.6,1,1],[-6,1.4,.8],[12,1,.9]]){x.beginPath();x.arc(dx,dy,r,0,6.3);x.fill();x.stroke()}
  x.restore()}
/* the beacon fire-basket: an iron cage on a post with a fire in it and gold rays */
function mpLastLightBasket(x,a,b,s){x.save();x.strokeStyle='rgba(240,200,80,.8)';x.lineWidth=.6;for(let k=0;k<9;k++){const an=-Math.PI/2+(k-4)*.34;x.beginPath();x.moveTo(a+Math.cos(an)*4.2*s,b-6*s+Math.sin(an)*4.2*s);x.lineTo(a+Math.cos(an)*8.2*s,b-6*s+Math.sin(an)*8.2*s);x.stroke()}
  mpLastLightFlame(x,a,b-4.6*s,s*1.2);x.strokeStyle=MPL.INK;x.fillStyle='#3a2e28';x.lineWidth=.8;x.beginPath();x.moveTo(a-2.4*s,b-5*s);x.lineTo(a-1.6*s,b-1.4*s);x.lineTo(a+1.6*s,b-1.4*s);x.lineTo(a+2.4*s,b-5*s);x.stroke();x.beginPath();x.moveTo(a,b-1.4*s);x.lineTo(a,b+1.6*s);x.stroke();x.beginPath();x.moveTo(a-1.6*s,b+1.6*s);x.lineTo(a+1.6*s,b+1.6*s);x.stroke();x.restore()}
/* a cottage seen from above: stone walls, a turf roof, a chimney, a lamp in the window */
function mpLastLightCottage(x,a,b,s){x.save();x.translate(a,b);x.scale(s,s);x.fillStyle='rgba(40,34,30,.3)';x.fillRect(-4.6,-2.6,10,7);
  x.fillStyle='#bdb7a6';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(-5,-3.6,10,7);x.strokeRect(-5,-3.6,10,7);x.fillStyle='#6a7a5a';x.fillRect(-4,-2.6,8,5);x.strokeRect(-4,-2.6,8,5);
  x.strokeStyle='rgba(42,26,12,.55)';x.lineWidth=.4;for(let k=-3;k<4;k+=1.4){x.beginPath();x.moveTo(k,-2.6);x.lineTo(k,2.4);x.stroke()}x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.moveTo(-4,-.1);x.lineTo(4,-.1);x.stroke();
  x.fillStyle='#4a3a30';x.fillRect(2,-3.4,1.8,1.8);x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(-6.4,0,1.2,0,6.3);x.fill();x.strokeStyle=MPL.INK;x.lineWidth=.4;x.stroke();x.restore()}
/* a stair cut in the rock: short steps going up, with rails of dark stone */
function mpLastLightStair(x,a,b,len,s){x.save();x.strokeStyle=MPL.INK;x.lineWidth=.7;for(const dx of [-2.4,2.4]){x.beginPath();x.moveTo(a+dx*s,b);x.lineTo(a+dx*s,b-len);x.stroke()}x.lineWidth=.6;x.fillStyle='#d8d0b8';x.fillRect(a-2.4*s,b-len,4.8*s,len);
  for(let k=0;k<=len;k+=1.6){x.beginPath();x.moveTo(a-2.4*s,b-k);x.lineTo(a+2.4*s,b-k);x.stroke()}x.restore()}
function mpLastLightReed(x,a,b,seed){x.strokeStyle='#4a5a3a';x.lineWidth=.5;for(let k=0;k<4;k++){const dx=(k-1.5)*.9;x.beginPath();x.moveTo(a+dx,b);x.lineTo(a+dx+(mpLastLightH(k,seed,1)-.5)*1.4,b-3-mpLastLightH(k,seed,2)*2);x.stroke()}}
function mpLastLightKrakenArm(x,a,b,s){x.save();x.translate(a,b);x.scale(s,s);x.strokeStyle=MPL.INK;x.fillStyle='#4f6f6a';x.lineWidth=.8;
  for(const [dx,fl] of [[-5,1],[0,-1],[5,1]]){x.beginPath();x.moveTo(dx-1.4,4);x.bezierCurveTo(dx-2*fl,-2,dx+4*fl,-5,dx+1.5*fl,-9);x.bezierCurveTo(dx+4*fl,-5,dx+1,-1,dx+1.6,4);x.closePath();x.fill();x.stroke();x.fillStyle='#d8d0b8';for(let k=0;k<3;k++){x.beginPath();x.arc(dx+fl*(1.2+k*.2),1-k*2.4,.45,0,6.3);x.fill()}x.fillStyle='#4f6f6a'}
  x.restore()}

mplInstall({name:'lastlight',levels:[303],tint:[-12,-4,8],fit:mpLastLightFit,foot:'You are the yellow arrow. Last Light, a lonely rock at the end of the chart.',
draw(c,x,L,api){
  const I=api.I,A=MPL.AREA,F=mpLastLightFit(),S=F.s,X=F.X,Y=F.Y,H=mpLastLightH,W0=L.rows[0].length,H0=L.rows.length;
  const cell=(cx,cy)=>[X(cx+.5),Y(cy+.5)];
  const fm=L.fmap,fc=(cx,cy)=>(cx<0||cy<0||cx>=W0||cy>=H0)?'4':fm[cy][cx];
  const isLand=(cx,cy)=>{const f=fc(cx,cy);return f==='0'||f==='1'||f==='5'||f==='2'};
  /* distance from the shore, in cells, by a simple sweep, so the sea can be shaded in bands */
  const dist=new Int16Array(W0*H0).fill(99),q=[];for(let cy=0;cy<H0;cy++)for(let cx=0;cx<W0;cx++)if(isLand(cx,cy)){dist[cy*W0+cx]=0;q.push(cx,cy)}
  for(let i=0;i<q.length;i+=2){const cx=q[i],cy=q[i+1],d=dist[cy*W0+cx];if(d>=14)continue;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=W0||ny>=H0||dist[ny*W0+nx]<=d+1)continue;dist[ny*W0+nx]=d+1;q.push(nx,ny)}}
  const dd=(cx,cy)=>(cx<0||cy<0||cx>=W0||cy>=H0)?99:dist[cy*W0+cx];
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  /* ---- the cold sea: a grey-blue wash, darker with distance, with washes and swirls ---- */
  x.fillStyle='#8fa9b4';x.fillRect(A.x,A.y,A.w,A.h);
  for(let i=0;i<120;i++){const px=A.x+H(i,1,21)*A.w,py=A.y+H(i,2,21)*A.h;x.globalAlpha=.13;x.fillStyle=['#6f8c9c','#a9c0c8','#7f9ca8','#b8ccd0'][i%4];mpLastLightBlob(x,px,py,8+H(i,3,21)*20,i,4+H(i,4,21)*9);x.fill()}
  x.globalAlpha=1;
  /* shelf bands: lighter water near the land */
  for(const [lim,col,al] of [[9,'#a6c0c6',.55],[6,'#b6ced0',.6],[3,'#c6dcda',.7]]){x.fillStyle=col;x.globalAlpha=al;for(let cy=MPLL.y0;cy<MPLL.y0+MPLL.h;cy++)for(let cx=MPLL.x0;cx<MPLL.x0+MPLL.w;cx++){if(dd(cx,cy)>0&&dd(cx,cy)<=lim){const [px,py]=cell(cx,cy);mpLastLightBlob(x,px,py,S*.95,cx*7+cy*3+lim,S*.8);x.fill()}}}
  x.globalAlpha=1;
  /* shallows from the real data: pale turquoise sand wash, with ink dots */
  for(let cy=MPLL.y0;cy<MPLL.y0+MPLL.h;cy++)for(let cx=MPLL.x0;cx<MPLL.x0+MPLL.w;cx++){if(fc(cx,cy)!=='3')continue;const [px,py]=cell(cx,cy);x.fillStyle=H(cx,cy,5)<.5?'#d6e4d0':'#cfe0d6';mpLastLightBlob(x,px,py,S*.95,cx*5+cy,S*.8);x.fill()}
  /* ripple lines following the coast: inked contour dashes at 3, 6 and 9 cells out */
  x.lineCap='round';for(const [lim,al] of [[3,.55],[6,.4],[9,.3]]){x.strokeStyle='rgba(40,76,110,'+al+')';x.lineWidth=.6;
    for(let cy=MPLL.y0;cy<MPLL.y0+MPLL.h;cy++)for(let cx=MPLL.x0;cx<MPLL.x0+MPLL.w;cx++){if(dd(cx,cy)===lim&&H(cx,cy,33+lim)<.55){const [px,py]=cell(cx,cy);x.beginPath();x.moveTo(px-S*.5,py);x.lineTo(px+S*.55,py+(H(cx,cy,34)-.5)*1.2);x.stroke()}}}
  /* wave strokes out on the open water */
  for(let k=0;k<210;k++){const cx=MPLL.x0+H(k,1,41)*MPLL.w,cy=MPLL.y0+H(k,2,41)*MPLL.h;if(dd(cx|0,cy|0)<4)continue;const [px,py]=cell(cx,cy);mpLastLightWave(x,px,py,2+H(k,3,41)*2.2,H(k,4,41)<.3?'rgba(240,248,250,.8)':null)}
  /* foam on the shore: white flecks where land meets water */
  for(let cy=MPLL.y0;cy<MPLL.y0+MPLL.h;cy++)for(let cx=MPLL.x0;cx<MPLL.x0+MPLL.w;cx++){if(fc(cx,cy)==='3'&&dd(cx,cy)===1&&H(cx,cy,35)<.5){const [px,py]=cell(cx,cy);x.fillStyle='rgba(255,255,255,.9)';x.beginPath();x.ellipse(px+(H(cx,cy,36)-.5)*S,py+(H(cx,cy,37)-.5)*S,.8,.45,0,0,6.3);x.fill()}}
  /* ---- the land: dark edge, then sand rim, scrub and grass from the real floor codes ---- */
  for(let cy=MPLL.y0;cy<MPLL.y0+MPLL.h;cy++)for(let cx=MPLL.x0;cx<MPLL.x0+MPLL.w;cx++){if(!isLand(cx,cy))continue;const [px,py]=cell(cx,cy);x.fillStyle='rgba(52,40,28,.7)';mpLastLightBlob(x,px,py,S*.98,cx*7+cy,S*.9);x.fill()}
  for(let cy=MPLL.y0;cy<MPLL.y0+MPLL.h;cy++)for(let cx=MPLL.x0;cx<MPLL.x0+MPLL.w;cx++){if(!isLand(cx,cy))continue;const [px,py]=cell(cx,cy),f=fc(cx,cy);
    const rim=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1]].some(([a,b])=>fc(cx+a,cy+b)==='3'||fc(cx+a,cy+b)==='4');
    x.fillStyle=f==='1'?(H(cx,cy,5)<.5?'#8c9a62':'#7f8e5a'):f==='5'?'#98a470':f==='2'?'#8a6a40':rim?'#dcceA0':(H(cx,cy,6)<.5?'#b4a874':'#a89c6c');mpLastLightBlob(x,px,py,S*.76,cx*5+cy*11,S*.7);x.fill()}
  /* grass tufts and heather strokes, hatching on the scrub */
  for(let cy=MPLL.y0;cy<MPLL.y0+MPLL.h;cy++)for(let cx=MPLL.x0;cx<MPLL.x0+MPLL.w;cx++){if(!isLand(cx,cy)||H(cx,cy,50)>.34)continue;const [px,py]=cell(cx,cy),f=fc(cx,cy);
    x.strokeStyle=f==='1'||f==='5'?'rgba(52,80,40,.8)':'rgba(96,74,40,.7)';x.lineWidth=.45;x.beginPath();x.moveTo(px-.8,py+1);x.lineTo(px-.6,py-.8);x.moveTo(px,py+1);x.lineTo(px+.1,py-1.4);x.moveTo(px+.8,py+1);x.lineTo(px+1.1,py-.7);x.stroke()}
  /* ---- the rock hill under the beacon: contour rings and hachures (north of the altar) ---- */
  {const hx=X(48.5),hy=Y(24.5);for(let r=0;r<4;r++){const rx=(8.4-r*2)*S,ry=(5.4-r*1.3)*S;x.strokeStyle='rgba(70,58,44,'+(.7-r*.1)+')';x.lineWidth=.8;x.beginPath();for(let k=0;k<=40;k++){const an=k/40*6.2832,w=1+.07*Math.sin(an*3+r*1.4)+.05*Math.sin(an*6+r);const px=hx+Math.cos(an)*rx*w,py=hy+Math.sin(an)*ry*w;k?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();x.stroke();
      if(r<3){x.lineWidth=.5;for(let k=0;k<30;k++){const an=k/30*6.2832+H(k,r,31)*.1;if(Math.sin(an)>-.2){const px=hx+Math.cos(an)*rx,py=hy+Math.sin(an)*ry;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(an)*2.6,py+Math.sin(an)*2.2);x.stroke()}}}}
    x.fillStyle='rgba(150,146,136,.5)';x.beginPath();x.ellipse(hx,hy-1,4.4*S,2.4*S,0,0,6.3);x.fill()}
  /* stones and boulders on the shore, sampled from the real land edge */
  for(let cy=MPLL.y0;cy<MPLL.y0+MPLL.h;cy++)for(let cx=MPLL.x0;cx<MPLL.x0+MPLL.w;cx++){if(isLand(cx,cy)&&H(cx,cy,60)<.045){const [px,py]=cell(cx,cy);x.fillStyle='#8d8a80';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.ellipse(px,py,1.9,1.3,0,0,6.3);x.fill();x.stroke()}}
  /* ---- the stair cut in the rock, from the altar up to the beacon ---- */
  mpLastLightStair(x,X(48.5),Y(28.2),Y(28.2)-Y(23.6),1);
  /* ---- the sea round the island: rocks, reefs, wrecks, a sea monster's arm ---- */
  const reefs=[[22,62],[26,66],[24,23],[19,34],[78,24],[82,38],[80,60],[72,68],[40,69],[57,69],[32,12],[66,12],[18,50],[84,50],[52,10],[76,15]];
  for(const [a,b] of reefs){const [px,py]=cell(a,b);if(dd(a,b)<3)continue;mpLastLightRock(x,px,py,.8+H(a,b,71)*.5,a*3+b)}
  /* reef strokes: dotted lines of hidden rock under the water */
  x.strokeStyle='rgba(30,60,90,.7)';x.lineWidth=.7;x.setLineDash([1.2,1.6]);for(const [a,b,c2,d] of [[20,56,27,63],[72,64,79,58],[20,28,23,36],[78,30,83,36],[34,67,44,70]]){const [p1,q1]=cell(a,b),[p2,q2]=cell(c2,d);x.beginPath();x.moveTo(p1,q1);x.quadraticCurveTo((p1+p2)/2+3,(q1+q2)/2-3,p2,q2);x.stroke()}x.setLineDash([]);
  for(const [a,b,fl] of [[25,60,0],[77,19,1]]){const [px,py]=cell(a,b);mpLastLightWreck(x,px,py,1.05,fl)}
  {const [px,py]=cell(74,60);mpLastLightKrakenArm(x,px,py,.9);const [qx,qy]=cell(70,63);mpLastLightKrakenArm(x,qx,qy,.62)}
  /* ---- the real wreck on the beach, the pier, the ship ---- */
  {const [px,py]=cell(60,46);mpLastLightWreck(x,px,py,.95,1)}
  x.save();x.fillStyle='#8a6a3c';x.strokeStyle=MPL.INK;x.lineWidth=.7;{const [a,b]=cell(48,56),[a2,b2]=cell(49,60);x.fillRect(a-1,b,S*2,b2-b+S);x.strokeRect(a-1,b,S*2,b2-b+S);for(let k=0;k<5;k++){x.beginPath();x.moveTo(a-1,b+k*S*1.1);x.lineTo(a+S*2-1,b+k*S*1.1);x.stroke()}}x.restore();
  {const [px,py]=cell(48,65);mpLastLightShip(x,px+S*.5,py,1.15)}
  /* ---- the diving buoy: a vermilion and white float with a ring ---- */
  {const [px,py]=cell(58,54);x.strokeStyle='rgba(240,248,250,.9)';x.lineWidth=.8;x.beginPath();x.ellipse(px,py+1,4.2,2.2,0,0,6.3);x.stroke();x.fillStyle=MPL.VERM;x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.moveTo(px-2.4,py+1);x.lineTo(px-1.6,py-3);x.lineTo(px+1.6,py-3);x.lineTo(px+2.4,py+1);x.closePath();x.fill();x.stroke();x.fillStyle='#efe8d8';x.fillRect(px-2,py-1.6,4,1.2);x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(px,py-3.6,.9,0,6.3);x.fill();x.stroke()}
  /* ---- the camp: Isolde's cottage and tent, a lamp, a heap of crates ---- */
  {const [px,py]=cell(41,46);mpLastLightCottage(x,px+S*1.6,py-S*.5,1.15);x.fillStyle=MPL.GOLD2;x.globalAlpha=.4;x.beginPath();x.arc(px-S*.9,py-S*.4,5,0,6.3);x.fill();x.globalAlpha=1;
    const [tx,ty]=cell(38,48);x.fillStyle='#d8c8a0';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(tx-4,ty+2.4);x.lineTo(tx,ty-4);x.lineTo(tx+4,ty+2.4);x.closePath();x.fill();x.stroke();x.fillStyle='#3a2a1c';x.beginPath();x.moveTo(tx-1,ty+2.4);x.lineTo(tx,ty-.8);x.lineTo(tx+1,ty+2.4);x.fill()}
  /* ---- the runestones and the altar with the beacon fire-basket ---- */
  for(const sx of [44,52]){const [px,py]=cell(sx,29);x.fillStyle='#9a968a';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.moveTo(px-1.6,py+2.4);x.lineTo(px-1.2,py-3.2);x.lineTo(px,py-4.4);x.lineTo(px+1.3,py-3);x.lineTo(px+1.7,py+2.4);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.LAPIS;x.lineWidth=.5;x.beginPath();x.moveTo(px-.5,py-2);x.lineTo(px+.5,py-1);x.moveTo(px+.5,py-2.6);x.lineTo(px-.5,py+.2);x.stroke()}
  {const [px,py]=cell(48,28);x.fillStyle='#b6b0a0';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(px-3.4,py-1,6.8,3.6);x.strokeRect(px-3.4,py-1,6.8,3.6);mpLastLightBasket(x,px,py-1,1.1)}
  /* the broken lighthouse on the crag */
  {const [px,py]=cell(48,23);mpLastLightTower(x,px,py,1.1)}
  /* driftwood, bones, palms, reeds */
  {const [px,py]=cell(36,38);I.skull(x,px,py,.7);const [qx,qy]=cell(34,42);I.tree(x,qx,qy,.55,'#6a8a5a');I.tree(x,qx+4,qy+1.6,.45,'#6a8a5a')}
  for(let k=0;k<26;k++){const cx=MPLL.x0+H(k,1,80)*MPLL.w,cy=MPLL.y0+H(k,2,80)*MPLL.h;if(fc(cx|0,cy|0)==='3'&&dd(cx|0,cy|0)===1){const [px,py]=cell(cx,cy);x.strokeStyle='#6a4a2c';x.lineWidth=.9;x.beginPath();x.moveTo(px-1.8,py);x.lineTo(px+1.8,py-.6);x.stroke()}}
  for(let k=0;k<30;k++){const cx=MPLL.x0+H(k,1,82)*MPLL.w,cy=MPLL.y0+H(k,2,82)*MPLL.h;if(isLand(cx|0,cy|0)&&fc(cx|0,cy|0)==='1'){const [px,py]=cell(cx,cy);mpLastLightReed(x,px,py,k)}}
  /* gulls over the water and the roof of the tower */
  for(const [a,b,s] of [[40,19,1],[56,17,.9],[36,26,.8],[66,34,1],[30,52,.9],[62,60,1],[52,14,.8],[72,50,.9],[45,10,1],[20,45,.8]]){const [px,py]=cell(a,b);mpLastLightGull(x,px,py,s)}
  /* the water darkens in the corners: a soft cold vignette */
  x.restore();x.save();x.strokeStyle=MPL.INK;x.lineWidth=1.3;x.strokeRect(A.x,A.y,A.w,A.h);x.lineWidth=.5;x.strokeRect(A.x+2,A.y+2,A.w-4,A.h-4);x.restore();
  /* ---- names ---- */
  const T=(t,cx,cy,sz,col)=>api.text(x,t,X(cx),Y(cy),sz||5.6,col||'#2a1a0c');
  T('THE BROKEN BEACON',48.5,18.6,6.4,'#1a1208');T('Altar and Runestones',48.5,31.4,5);T('The Rock Stair',55.4,26.4,4.8,'#4a2a10');
  T('Isolde\'s Camp',40,52,5.4);T('Lamp Hut',45.6,43.4,4.8,'#4a2a10');T('The Beached Wreck',62.4,42.6,5);T('Diving Buoy',58.4,57.4,5);T('The Pier',43.4,60.2,5);
  T('Old Bones',35.5,35.2,4.8,'#4a2a10');T('Palm Strand',33,45.6,4.8,'#4a2a10');T('Gull Strand',64,30,4.8,'#4a2a10');
  T('Sunken Ship',25,64.2,5,'#1c3a5a');T('Black Reef',79,24,5,'#1c3a5a');T('The Deep Thing',73,65.4,5.2,'#7a1e14');T('The Cold Sea',22,16,6,'#274a6a');T('The Long Swell',78,45,5,'#274a6a');
  /* ---- margins: title, notes, key, compass ---- */
  api.title(x,'Last Light','A ruined beacon island');
  api.notes(x,['A bare rock at the end of the chart. The lighthouse here is broken at the top.','Isolde keeps a small hut and a tent on the south side.','The beacon fire-basket stands on an altar at the foot of the stair, between two runestones.','A buoy off the east shore marks the dive to the wreck.'],8,58,78,6.4,5);
  api.panel(x,392,38,84,112);api.text(x,'KEY',434,47,7,MPL.VERM);
  const kx=403,ky=[58,70,82,94,106,118,130,142];
  mpLastLightTower(x,kx,ky[0]+4,.38);api.text(x,'Lighthouse',kx+9,ky[0],5.6,'#2a1a0c','left');
  mpLastLightFlame(x,kx,ky[1]+3,.9);api.text(x,'Beacon fire',kx+9,ky[1],5.6,'#2a1a0c','left');
  mpLastLightWreck(x,kx,ky[2]+1,.55);api.text(x,'Wreck',kx+9,ky[2],5.6,'#2a1a0c','left');
  mpLastLightRock(x,kx,ky[3],.6,5);api.text(x,'Rock, reef',kx+9,ky[3],5.6,'#2a1a0c','left');
  x.save();x.fillStyle='#cfe0d6';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(kx-5,ky[4]-2.5,10,5);x.strokeRect(kx-5,ky[4]-2.5,10,5);x.restore();api.text(x,'Shallows',kx+9,ky[4],5.6,'#2a1a0c','left');
  x.save();x.fillStyle='#8c9a62';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(kx-5,ky[5]-2.5,10,5);x.strokeRect(kx-5,ky[5]-2.5,10,5);x.restore();api.text(x,'Grass',kx+9,ky[5],5.6,'#2a1a0c','left');
  mpLastLightStair(x,kx,ky[6]+3,6,.8);api.text(x,'Stair',kx+9,ky[6],5.6,'#2a1a0c','left');
  mpLastLightCottage(x,kx,ky[7],.7);api.text(x,'Hut',kx+9,ky[7],5.6,'#2a1a0c','left');
  api.compass(x,436,178,13);
  api.panel(x,392,206,84,56);api.notes(x,['Dotted lines are reefs under the water. Take care near the south east corner.'],398,217,74,6,4);
  mpLastLightGull(x,30,270,1.3);mpLastLightGull(x,46,276,1);mpLastLightGull(x,62,268,1.1);
}});
