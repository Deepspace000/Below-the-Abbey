/* The Hollow Land, level 364 (71 x 64): a vast dark cavern. High ledge in the south, a very long stair of broad flights down to a floor far below, the castle gate
   in the north under the great orange spire. Drawn as an illuminated cutaway in the style of MAP_BRIEF_SPIRE.md, but not a spire floor and not in reveal mode.
   Names start with mpOs364. */
const mpOs364={
  R:(i,j)=>hash2(i,j,364),
  glow(x,cx,cy,r,col,a){x.save();x.globalCompositeOperation='lighter';const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,col.replace('A',a));g.addColorStop(1,col.replace('A',0));x.fillStyle=g;x.fillRect(cx-r,cy-r,r*2,r*2);x.restore()},
  /* a doubled, wobbly ink line through points [[px,py]...] in screen px */
  ink(x,pts,w,col,seed,amp){amp=amp||.5;x.save();x.strokeStyle=col||MPL.INK;x.lineCap='round';x.lineJoin='round';
    for(let pass=0;pass<2;pass++){x.lineWidth=pass?w*.5:w;x.globalAlpha=pass?.6:1;x.beginPath();pts.forEach((p,i)=>{const jx=(mpOs364.R(i+pass*77,seed)-.5)*amp*(pass+1),jy=(mpOs364.R(i+pass*77,seed+1)-.5)*amp*(pass+1);i?x.lineTo(p[0]+jx,p[1]+jy):x.moveTo(p[0]+jx,p[1]+jy)});x.stroke()}x.restore()},
  flame(x,cx,cy,viol,s){const R=mpOs364;s=s||1;R.glow(x,cx,cy-2*s,9*s,viol?'rgba(170,90,255,A)':'rgba(255,80,40,A)',viol?.55:.6);
    x.fillStyle='#3a2a1c';x.fillRect(cx-.5*s,cy-.5*s,1*s,2.4*s);x.fillStyle=viol?'#9a5ae0':'#e0402e';x.strokeStyle=MPL.INK;x.lineWidth=.4;x.beginPath();x.moveTo(cx,cy-4*s);x.quadraticCurveTo(cx+2*s,cy-1.8*s,cx,cy);x.quadraticCurveTo(cx-2*s,cy-1.8*s,cx,cy-4*s);x.fill();x.stroke();
    x.fillStyle=viol?'#f0d0ff':'#ffd070';x.beginPath();x.ellipse(cx,cy-1.4*s,.6*s,1*s,0,0,6.3);x.fill()},
  bat(x,cx,cy,s,rot,sd){x.save();x.translate(cx,cy);x.rotate(rot);x.scale(s,s);x.fillStyle='#14081a';x.strokeStyle='rgba(190,140,200,.7)';x.lineWidth=.35;
    x.beginPath();x.moveTo(0,-1);x.quadraticCurveTo(-3,-3.6,-6,-1.2);x.quadraticCurveTo(-4.6,-.4,-4.2,1);x.quadraticCurveTo(-2.8,0,-1.6,1.4);x.quadraticCurveTo(-.6,.6,0,2);x.quadraticCurveTo(.6,.6,1.6,1.4);x.quadraticCurveTo(2.8,0,4.2,1);x.quadraticCurveTo(4.6,-.4,6,-1.2);x.quadraticCurveTo(3,-3.6,0,-1);x.closePath();x.fill();x.stroke();
    x.beginPath();x.moveTo(-.9,-1);x.lineTo(-.7,-2.4);x.lineTo(0,-1.2);x.lineTo(.7,-2.4);x.lineTo(.9,-1);x.fill();x.restore()},
  /* a tower of the spire: body from base up to top, a cone over it, windows, courses; lit side left, violet shade right */
  tower(x,X,Y,cx,w,top,base,cone,sd,fin){const R=mpOs364,l=X(cx-w/2),r=X(cx+w/2),t=Y(top),b=Y(base),ct=Y(top-cone);
    let g=x.createLinearGradient(l,0,r,0);g.addColorStop(0,'#d88a42');g.addColorStop(.55,'#c47a3a');g.addColorStop(1,'#6a3a50');x.fillStyle=g;x.fillRect(l,t,r-l,b-t);
    x.strokeStyle='rgba(90,40,20,.45)';x.lineWidth=.35;for(let yy=t+2;yy<b;yy+=2.6){x.beginPath();x.moveTo(l,yy);x.lineTo(r,yy);x.stroke();for(let xx=l+((yy/2.6|0)%2?1.4:3.2);xx<r;xx+=3.6){x.beginPath();x.moveTo(xx,yy);x.lineTo(xx,yy+2.6);x.stroke()}}
    x.fillStyle='rgba(60,20,70,.28)';x.fillRect(l+(r-l)*.62,t,(r-l)*.38,b-t);
    x.strokeStyle=MPL.INK;x.lineWidth=.8;x.strokeRect(l,t,r-l,b-t);
    // cone roof
    g=x.createLinearGradient(l,0,r,0);g.addColorStop(0,'#e89a4a');g.addColorStop(.5,'#b85a24');g.addColorStop(1,'#552a4a');x.fillStyle=g;
    x.beginPath();x.moveTo(l-1.2,t);x.lineTo((l+r)/2,ct);x.lineTo(r+1.2,t);x.closePath();x.fill();x.stroke();
    x.strokeStyle='rgba(60,20,20,.5)';x.lineWidth=.4;for(let k=1;k<5;k++){x.beginPath();x.moveTo((l+r)/2,ct);x.lineTo(l-1.2+(r-l+2.4)*k/5,t);x.stroke()}
    if(fin){x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.beginPath();x.moveTo((l+r)/2,ct);x.lineTo((l+r)/2,ct-4);x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc((l+r)/2,ct-4.4,1.1,0,6.3);x.fill();x.strokeStyle=MPL.VERM;x.lineWidth=.7;x.beginPath();x.moveTo((l+r)/2,ct-4);x.lineTo((l+r)/2+4,ct-3);x.lineTo((l+r)/2,ct-2);x.stroke()}
    // lit windows
    const n=Math.max(1,Math.round((b-t)/11));for(let k=0;k<n;k++){const wy=t+4+k*((b-t-10)/Math.max(1,n)),wx=(l+r)/2+((k+sd)%2?-1.2:1.2)*(w>4?1.2:0);x.fillStyle='#2a1420';x.beginPath();x.moveTo(wx-1.3,wy+4);x.lineTo(wx-1.3,wy+1.2);x.quadraticCurveTo(wx,wy-1,wx+1.3,wy+1.2);x.lineTo(wx+1.3,wy+4);x.fill();x.fillStyle='#f0d878';x.fillRect(wx-.5,wy+1.2,1,2.6);x.strokeStyle=MPL.INK;x.lineWidth=.3;x.stroke()}
    // battlement ring under the cone
    x.fillStyle='#9a5a2c';x.strokeStyle=MPL.INK;x.lineWidth=.4;x.fillRect(l-1,t-.4,r-l+2,1.6);x.strokeRect(l-1,t-.4,r-l+2,1.6)}
};
mplInstall({name:'os364',levels:[364],draw(c,x,L,api){
  const R=mpOs364.R,f=api.fit(71,64),X=f.X,Y=f.Y,A=MPL.AREA,INK=MPL.INK;
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  // ---- the rock: plum and umber, hatched ----
  let g=x.createLinearGradient(0,A.y,0,A.y+A.h);g.addColorStop(0,'#2a1426');g.addColorStop(.5,'#3a2030');g.addColorStop(1,'#34201c');x.fillStyle=g;x.fillRect(A.x,A.y,A.w,A.h);
  const hc=['rgba(110,60,84,.55)','rgba(130,86,54,.5)','rgba(18,6,20,.6)','rgba(150,110,86,.28)'];
  for(let i=0;i<4200;i++){const px=A.x+R(i,1)*A.w,py=A.y+R(i,2)*A.h,ln=2.5+R(i,3)*6,an=-.95+R(i,4)*.3;x.strokeStyle=hc[i%4];x.lineWidth=.4+R(i,5)*.5;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(an)*ln,py+Math.sin(an)*ln);x.stroke()}
  for(let i=0;i<900;i++){const px=A.x+R(i,11)*A.w,py=A.y+R(i,12)*A.h,ln=2+R(i,13)*4;x.strokeStyle='rgba(16,6,20,.5)';x.lineWidth=.4;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(.7)*ln,py+Math.sin(.7)*ln);x.stroke()}
  // ---- the cavern outline (cells), clockwise, with the notch of the stair down in the south ----
  const raw=[[3,2],[68,2],[68,14],[56,14],[56,48],[66,48],[66,62],[36,62],[36,63],[35,63],[35,62],[5,62],[5,48],[15,48],[15,14],[3,14]],pts=[];
  for(let i=0;i<raw.length;i++){const a=raw[i],b=raw[(i+1)%raw.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),n=Math.max(1,Math.round(len/1.6));
    for(let k=0;k<n;k++){const t=k/n,j=(k&&len>3)?.7:0;pts.push({x:a[0]+dx*t+(R(i*60+k,21)-.5)*j,y:a[1]+dy*t+(R(i*60+k,22)-.5)*j,nx:dy/len,ny:-dx/len})}}
  const path=()=>{x.beginPath();pts.forEach((p,i)=>i?x.lineTo(X(p.x),Y(p.y)):x.moveTo(X(p.x),Y(p.y)));x.closePath()};
  // crags: dark teeth on the rock side of the edge
  for(const [i,p] of pts.entries()){if(i%2)continue;const bx=X(p.x),by=Y(p.y),h=3+R(i,31)*7,w=1.6+R(i,32)*2.4,tx=bx+p.nx*h+(R(i,33)-.5)*3,ty=by+p.ny*h+(R(i,34)-.5)*3,qx=-p.ny*w,qy=p.nx*w;
    x.fillStyle=i%4?'#241020':'#33182a';x.strokeStyle='rgba(176,120,130,.55)';x.lineWidth=.4;x.beginPath();x.moveTo(bx-qx,by-qy);x.lineTo(tx,ty);x.lineTo(bx+qx,by+qy);x.closePath();x.fill();x.stroke()}
  // ---- the floor, in zones ----
  path();x.save();x.clip();
  g=x.createLinearGradient(0,Y(2),0,Y(63));g.addColorStop(0,'#8a5a48');g.addColorStop(.17,'#7a5048');g.addColorStop(.3,'#6a4a52');g.addColorStop(.7,'#664650');g.addColorStop(.8,'#8a6650');g.addColorStop(1,'#907458');x.fillStyle=g;x.fillRect(A.x,A.y,A.w,A.h);
  // flagstones on the low floor, the forecourt and the ledge, scree and contour hatching on the slopes
  const flags=(y0,y1,x0,x1,st,col,sd)=>{x.strokeStyle=col;x.lineWidth=.45;for(let gy=y0;gy<=y1;gy+=st){x.beginPath();for(let gx=x0;gx<=x1;gx+=1.5){const px=X(gx)+(R(gx*3|0,gy*5|0+sd)-.5)*.8,py=Y(gy)+(R(gx*7|0,gy+sd)-.5)*.8;gx===x0?x.moveTo(px,py):x.lineTo(px,py)}x.stroke()}
    for(let gy=y0;gy<y1;gy+=st)for(let gx=x0+((gy/st|0)%2?st*.5:0);gx<=x1;gx+=st){x.beginPath();x.moveTo(X(gx),Y(gy));x.lineTo(X(gx)+(R(gx|0,gy|0)-.5)*.6,Y(gy+st));x.stroke()}};
  flags(10,20,3,68,2.4,'rgba(20,8,24,.4)',1);flags(50,62,5,66,2.8,'rgba(24,10,20,.4)',2);flags(2,10,3,68,2.6,'rgba(20,8,24,.3)',3);
  for(let i=0;i<700;i++){const gx=3+R(i,41)*65,gy=19+R(i,42)*31;if(Math.abs(gx-35.5)<5.6)continue;const px=X(gx),py=Y(gy),kind=i%3;
    if(kind===0){x.strokeStyle='rgba(20,8,24,.5)';x.lineWidth=.4;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+2.5,py-1.2,px+5,py);x.stroke()}
    else{x.fillStyle=kind===1?'rgba(150,110,96,.5)':'rgba(24,10,22,.6)';x.beginPath();x.ellipse(px,py,.5+R(i,43),.4+R(i,44)*.7,R(i,45)*3,0,6.3);x.fill()}}
  for(let i=0;i<240;i++){const gx=3+R(i,51)*65,gy=3+R(i,52)*59,px=X(gx),py=Y(gy);x.fillStyle=i%3?'rgba(20,8,24,.5)':'rgba(176,140,120,.4)';x.beginPath();x.ellipse(px,py,.5+R(i,53)*1.1,.35+R(i,54)*.5,R(i,55)*3,0,6.3);x.fill()}
  // soft shade at the rim
  path();x.lineJoin='round';x.strokeStyle='rgba(12,4,18,.22)';x.lineWidth=22;x.stroke();x.lineWidth=12;x.stroke();x.lineWidth=5;x.stroke();
  x.restore();
  mpOs364.ink(x,pts.concat([pts[0]]).map(p=>[X(p.x),Y(p.y)]),1.5,INK,61,.9);
  // ---- the cliff lip of the high ledge (y 50) and the drop beneath it ----
  for(const [a,b] of [[5,30.6],[40.4,66]]){x.save();x.beginPath();x.rect(X(a),Y(47.6),X(b)-X(a),Y(50)-Y(47.6));x.clip();
    x.fillStyle='rgba(20,8,24,.45)';x.fillRect(X(a),Y(47.6),X(b)-X(a),Y(50)-Y(47.6));
    for(let i=0;i<300;i++){const px=X(a)+R(i,61)*(X(b)-X(a)),py=Y(47.6)+R(i,62)*(Y(50)-Y(47.6));x.strokeStyle=i%2?'rgba(160,110,90,.5)':'rgba(10,2,14,.7)';x.lineWidth=.4;x.beginPath();x.moveTo(px,py);x.lineTo(px+(R(i,63)-.5)*1.5,py+2.4+R(i,64)*3);x.stroke()}x.restore();
    mpOs364.ink(x,[[X(a),Y(50)],[X((a+b)/2),Y(50)],[X(b),Y(50)]],1.4,INK,71,.7)}
  // ---- the lower floor, far below: a pale wash and a few cracks ----
  x.save();x.globalAlpha=.55;x.fillStyle='rgba(30,10,40,.5)';x.fillRect(X(3),Y(11),X(68)-X(3),Y(19.5)-Y(11));x.restore();
  // ---- the long stair: ten broad flights between parapets, torches on the walls ----
  const sx0=31,sx1=40,wl=1;
  x.save();
  for(let fl=0;fl<11;fl++){const y0=19+fl*3,y1=Math.min(50,y0+3),ls=y1-.55;
    // steps
    g=x.createLinearGradient(0,Y(y0),0,Y(y1));g.addColorStop(0,'#8a6a58');g.addColorStop(1,'#b0907a');x.fillStyle=g;x.fillRect(X(sx0+wl),Y(y0),X(sx1-wl)-X(sx0+wl),Y(y1)-Y(y0));
    for(let k=0;k<6;k++){const yy=Y(y0+(ls-y0)*k/6);x.strokeStyle='rgba(50,20,36,.75)';x.lineWidth=.7;x.beginPath();x.moveTo(X(sx0+wl),yy);x.lineTo(X(sx1-wl),yy);x.stroke();x.strokeStyle='rgba(240,210,170,.35)';x.lineWidth=.4;x.beginPath();x.moveTo(X(sx0+wl),yy+.9);x.lineTo(X(sx1-wl),yy+.9);x.stroke()}
    // landing slab
    x.fillStyle='#7a5a52';x.fillRect(X(sx0+wl),Y(ls),X(sx1-wl)-X(sx0+wl),Y(y1)-Y(ls));x.strokeStyle=INK;x.lineWidth=.8;x.strokeRect(X(sx0+wl),Y(ls),X(sx1-wl)-X(sx0+wl),Y(y1)-Y(ls))}
  // parapets
  for(const [a,b] of [[sx0,sx0+wl],[sx1-wl,sx1]]){g=x.createLinearGradient(X(a),0,X(b),0);g.addColorStop(0,'#5a3a48');g.addColorStop(1,'#8a5a50');x.fillStyle=g;x.fillRect(X(a),Y(19),X(b)-X(a),Y(50)-Y(19));x.strokeStyle=INK;x.lineWidth=1;x.strokeRect(X(a),Y(19),X(b)-X(a),Y(50)-Y(19));
    x.strokeStyle='rgba(20,8,24,.6)';x.lineWidth=.4;for(let yy=19;yy<50;yy+=1.3){x.beginPath();x.moveTo(X(a),Y(yy));x.lineTo(X(b),Y(yy));x.stroke()}}
  mpOs364.ink(x,[[X(sx0+wl),Y(19)],[X(sx0+wl),Y(50)]],.9,INK,81,.5);mpOs364.ink(x,[[X(sx1-wl),Y(19)],[X(sx1-wl),Y(50)]],.9,INK,82,.5);
  x.restore();
  // down arrows (the stair falls to the north)
  for(const yy of [28,38,46]){const px=X(35.5),py=Y(yy);x.fillStyle='rgba(240,214,150,.85)';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.moveTo(px,py-3.6);x.lineTo(px+3.4,py+1.4);x.lineTo(px+1.2,py+1.4);x.lineTo(px+1.2,py+3.6);x.lineTo(px-1.2,py+3.6);x.lineTo(px-1.2,py+1.4);x.lineTo(px-3.4,py+1.4);x.closePath();x.fill();x.stroke()}
  // ---- the stair down to the Hollow Abbey, in the south wall of the ledge ----
  {const px=X(35.5),py=Y(62.6);x.fillStyle='#12060e';x.beginPath();x.moveTo(px-6,Y(64));x.lineTo(px-6,py-1);x.quadraticCurveTo(px,py-9,px+6,py-1);x.lineTo(px+6,Y(64));x.closePath();x.fill();x.strokeStyle=MPL.GOLD;x.lineWidth=1.3;x.stroke();x.strokeStyle=INK;x.lineWidth=.6;x.stroke();
    x.strokeStyle='#b89868';x.lineWidth=.8;for(let k=0;k<4;k++){const yy=py+k*1.5-1;x.beginPath();x.moveTo(px-4.4+k*.5,yy);x.lineTo(px+4.4-k*.5,yy);x.stroke()}
    x.fillStyle='rgba(240,214,150,.9)';x.beginPath();x.moveTo(px,Y(63.9));x.lineTo(px+2,py+1.2);x.lineTo(px-2,py+1.2);x.closePath();x.fill()}
  // ---- the great orange spire over the north end ----
  g=x.createRadialGradient(X(35.5),Y(7),2,X(35.5),Y(7),X(34)-X(0));g.addColorStop(0,'rgba(255,150,60,.55)');g.addColorStop(.5,'rgba(190,70,60,.28)');g.addColorStop(1,'rgba(90,20,80,0)');x.fillStyle=g;x.fillRect(A.x,A.y,A.w,Y(14)-A.y);
  const T=mpOs364.tower;
  // curtain wall behind
  g=x.createLinearGradient(0,Y(7.4),0,Y(10.6));g.addColorStop(0,'#b86c34');g.addColorStop(1,'#7a4030');x.fillStyle=g;x.fillRect(X(3.5),Y(7.6),X(67.5)-X(3.5),Y(10.4)-Y(7.6));x.strokeStyle=INK;x.lineWidth=.8;x.strokeRect(X(3.5),Y(7.6),X(67.5)-X(3.5),Y(10.4)-Y(7.6));
  for(let cx=3.5;cx<67.4;cx+=1.7){x.fillStyle='#a45e2c';x.fillRect(X(cx),Y(7.6)-2,X(.9)-X(0),2.2);x.strokeRect(X(cx),Y(7.6)-2,X(.9)-X(0),2.2)}
  x.strokeStyle='rgba(70,24,20,.4)';x.lineWidth=.35;for(let yy=8.2;yy<10.4;yy+=.7){x.beginPath();x.moveTo(X(3.5),Y(yy));x.lineTo(X(67.5),Y(yy));x.stroke()}
  // towers, far to near
  T(x,X,Y,8,5,4.6,10.4,2.8,1);T(x,X,Y,63,5,4.6,10.4,2.8,2);T(x,X,Y,17,4,5.4,10.4,2.2,3);T(x,X,Y,54,4,5.4,10.4,2.2,4);
  T(x,X,Y,24.5,5,3.4,10.4,3.0,5);T(x,X,Y,46.5,5,3.4,10.4,3.0,6);
  T(x,X,Y,29.5,3,5.2,10.4,2.0,7);T(x,X,Y,41.5,3,5.2,10.4,2.0,8);
  T(x,X,Y,35.5,8.4,3.1,10.4,2.8,9);
  T(x,X,Y,35.5,4.4,1.6,3.2,2.4,10,1);
  // the gate in the foot of the middle tower
  {const px=X(35.5),b=Y(10.4);x.fillStyle='#12060e';x.beginPath();x.moveTo(px-5,b);x.lineTo(px-5,b-8);x.quadraticCurveTo(px,b-17,px+5,b-8);x.lineTo(px+5,b);x.closePath();x.fill();
    mpOs364.glow(x,px,b-4,9,'rgba(255,170,70,A)',.5);x.strokeStyle='#d8a040';x.lineWidth=.6;for(let k=-3;k<=3;k++){x.beginPath();x.moveTo(px+k*1.4,b);x.lineTo(px+k*1.4,b-9+Math.abs(k)*.9);x.stroke()}x.beginPath();for(let k=0;k<4;k++){x.moveTo(px-4.6,b-k*2.2-.5);x.lineTo(px+4.6,b-k*2.2-.5)}x.stroke();
    x.strokeStyle=MPL.GOLD;x.lineWidth=1.6;x.beginPath();x.moveTo(px-5,b);x.lineTo(px-5,b-8);x.quadraticCurveTo(px,b-17,px+5,b-8);x.lineTo(px+5,b);x.stroke();x.strokeStyle=INK;x.lineWidth=.6;x.stroke();
    x.fillStyle=MPL.VERM;for(const sg of [-1,1]){x.beginPath();x.moveTo(px+sg*7.4,b-12);x.lineTo(px+sg*7.4,b-4);x.lineTo(px+sg*6,b-5.4);x.lineTo(px+sg*4.8,b-4);x.lineTo(px+sg*4.8,b-12);x.closePath();x.fill();x.stroke()}}
  // ---- torches: the real lights of the level (red and violet) ----
  const lights=(L.lights||[]).slice().sort((a,b)=>a[1]-b[1]);
  for(const l of lights){mpOs364.glow(x,X(l[0]+.5),Y(l[1]+.5),11,l[2]?'rgba(170,90,255,A)':'rgba(255,80,40,A)',.16)}
  for(const l of lights)mpOs364.flame(x,X(l[0]+.5),Y(l[1]+.8),l[2],1);
  // ---- bats ----
  for(const [bx,by,s,r] of [[12,28,1.1,-.3],[18,40,.8,.4],[9,40,.9,.1],[48,24,1,.2],[58,36,.8,-.4],[24,16,.9,.3],[52,18,.8,-.2],[62,12.5,1,.1],[10,13,.8,-.1],[30,56,.8,.2],[18,57,1,-.2],[56,58,.9,.3],[44,31,.8,-.3],[26,30,.9,.5],[64,52,.8,.1],[8,54,.8,-.1]])mpOs364.bat(x,X(bx),Y(by),s,r);
  // vignette
  g=x.createRadialGradient(X(35.5),Y(32),Y(22)-Y(0),X(35.5),Y(32),Y(52)-Y(0));g.addColorStop(0,'rgba(8,0,14,0)');g.addColorStop(1,'rgba(8,0,14,.5)');x.fillStyle=g;x.fillRect(A.x,A.y,A.w,A.h);
  x.restore();
  // frame of the picture
  x.strokeStyle=INK;x.lineWidth=1.4;x.strokeRect(A.x,A.y,A.w,A.h);x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.strokeRect(A.x+1.6,A.y+1.6,A.w-3.2,A.h-3.2);
  // ---- named places, on little gold-edged ribbons ----
  const rib=(t,cx,cy,sz)=>{x.save();x.font=`bold ${sz}px ${FUI}`;const w=x.measureText(t).width+12,h=sz+5;x.fillStyle='rgba(236,222,184,.94)';x.fillRect(cx-w/2,cy-h/2,w,h);x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.strokeRect(cx-w/2,cy-h/2,w,h);x.strokeStyle=INK;x.lineWidth=.4;x.strokeRect(cx-w/2+1.5,cy-h/2+1.5,w-3,h-3);
    x.fillStyle=MPL.VERM;for(const sg of [-1,1]){x.beginPath();x.moveTo(cx+sg*w/2,cy-h/2+1);x.lineTo(cx+sg*(w/2+5),cy-h/2+1);x.lineTo(cx+sg*(w/2+2.6),cy);x.lineTo(cx+sg*(w/2+5),cy+h/2-1);x.lineTo(cx+sg*w/2,cy+h/2-1);x.closePath();x.fill();x.strokeStyle=INK;x.lineWidth=.4;x.stroke()}
    x.fillStyle=INK;x.textAlign='center';x.textBaseline='middle';x.fillText(t,cx,cy+.4);x.restore()};
  const nm={};for(const n of (L.mapNames||[]))nm[n.t]=n;
  rib('The Orange Spire',X(35.5),Y(11.6),8.5);
  rib('The Castle Gate',X(35.5),Y(14.8),7.5);
  rib('The Long Stair',X(35.5),Y(33.5),7.5);
  rib('The High Ledge',X(35.5),Y(57.5),8);
  rib('Stair down to the Hollow Abbey',X(53),Y(60.4),5.8);
  // ---- margins: title, key, notes, compass ----
  api.title(x,'The Hollow Land','Level 364, a vast dark cavern');
  api.panel(x,8,60,80,116);api.text(x,'Key',48,70,8,'#5a3a1c');
  let ky=84;const ki=(draw,t)=>{draw(18,ky);api.text(x,t,30,ky,6.6,INK,'left');ky+=15};
  ki((a,b)=>mpOs364.flame(x,a,b+2,0,1.1),'Red torch');
  ki((a,b)=>mpOs364.flame(x,a,b+2,1,1.1),'Violet torch');
  ki((a,b)=>{x.fillStyle='#a08470';x.fillRect(a-6,b-5,12,10);x.strokeStyle=INK;x.lineWidth=.6;x.strokeRect(a-6,b-5,12,10);for(let k=1;k<4;k++){x.beginPath();x.moveTo(a-6,b-5+k*2.5);x.lineTo(a+6,b-5+k*2.5);x.stroke()}},'Stair flight');
  ki((a,b)=>{x.fillStyle='#12060e';x.beginPath();x.moveTo(a-5,b+5);x.lineTo(a-5,b-1);x.quadraticCurveTo(a,b-9,a+5,b-1);x.lineTo(a+5,b+5);x.fill();x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.stroke()},'Gate or stair');
  ki((a,b)=>mpOs364.bat(x,a,b,.9,0),'Bats');
  ki((a,b)=>{x.fillStyle='#6a4e44';x.fillRect(a-6,b-4,12,8);x.strokeStyle='rgba(20,8,24,.6)';x.lineWidth=.5;x.strokeRect(a-6,b-4,12,8);x.beginPath();x.moveTo(a,b-4);x.lineTo(a,b+4);x.moveTo(a-6,b);x.lineTo(a+6,b);x.stroke()},'Flagged floor');
  api.notes(x,['The floor falls away to the north in ten broad flights, each ending in a landing.'],396,44,76,6.4,4);
  api.notes(x,['Red and violet torches light the stair and the ledge.'],396,112,76,6.4,4);
  api.notes(x,['The stair in the south wall of the ledge goes back down to the Hollow Abbey.'],396,152,76,6.4,4);
  api.notes(x,['The Castle Gate stands in the far north, under the great orange spire.'],396,200,76,6.4,4);
  api.compass(x,438,268,13);
}});
