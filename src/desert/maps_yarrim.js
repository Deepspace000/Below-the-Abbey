/* Area map for Yarrim (level 290): a fishing town on the Narrow Sea. Drawn from the real level data (the coast line, the sea floor, the rock, the islands, the fmap
   of roads and sand, the houses from the village plan, the pier, the boats and the decor). Level 289 is the Sea Gate tunnel and keeps the standard map.
   Sea blue, warm sand, painted house walls with coloured roofs, gold leaf. See maps_common.js. */
const MPYARRIM_X0=12,MPYARRIM_S=2.88;
function mpYarrimFit(L){const A=MPL.AREA,s=MPYARRIM_S,ox=A.x+4,oy=A.y+(A.h-80*s)/2;return {s,ox,oy,X:c=>ox+(c-MPYARRIM_X0)*s,Y:r=>oy+r*s}}
function mpYarrimWob(x,pts,seed,amt){x.beginPath();pts.forEach((p,i)=>{const a=p[0]+(hash2(i,1,seed)-.5)*amt,b=p[1]+(hash2(i,2,seed)-.5)*amt;i?x.lineTo(a,b):x.moveTo(a,b)});x.closePath()}
function mpYarrimRect(x,a,b,w,h,seed,amt){mpYarrimWob(x,[[a,b],[a+w/2,b],[a+w,b],[a+w,b+h/2],[a+w,b+h],[a+w/2,b+h],[a,b+h],[a,b+h/2]],seed,amt==null?.5:amt)}
/* the rock height under the village (the same arithmetic the level uses): the cliff to the west, the headlands north and south, and the islands */
function mpYarrimRock(x,y){
  const H=80,G0=YP.GORGE,gorge=(x>G0.x0&&x<=G0.x1+1&&Math.abs(y-G0.y)<=1)||(x===G0.x0&&y===G0.y);
  const bn=Math.pow(Math.max(0,Math.min(1,(7-y)/6)),1.2)*4.4*(.75+.5*tsmooth(x/6,y/6,3)),bs=Math.pow(Math.max(0,Math.min(1,(y-(H-8))/6)),1.2)*4.4*(.75+.5*tsmooth(x/6,y/6,5));
  const bw=Math.pow(Math.max(0,Math.min(1,(G0.x1+1-x)/12)),1.2)*4.4*(.75+.5*tsmooth(x/6,y/6,7));
  return Math.max(bn,bs,gorge?0:bw)}
function mpYarrimIsl(x,y){let hh=-9;for(const [cx,cy,r,pk] of YR_ISLANDS){const d=Math.hypot(x-cx,y-cy)/(r*(1+.35*(tsmooth(x/3,y/3,9)-.5)));if(d<1.5){const v=pk*Math.pow(Math.max(0,1-d),1.15)-.2+.35*Math.max(0,1-d/1.5)*(tsmooth(x/2,y/2,11)-.3);if(v>hh)hh=v}}return hh}
function mpYarrimBoat(x,a,b,len,ang,kind,seed){
  x.save();x.translate(a,b);x.rotate(ang);const w=len*.3;
  x.fillStyle='rgba(30,70,100,.28)';x.beginPath();x.ellipse(.6,.9,len*.52,w*.8,0,0,6.3);x.fill();
  x.fillStyle=kind==='row'?'#a8743c':kind==='fish'?'#3a6a8a':'#c8a060';x.strokeStyle=MPL.INK;x.lineWidth=.55;
  x.beginPath();x.moveTo(-len/2,0);x.quadraticCurveTo(-len*.2,-w,len*.15,-w*.9);x.quadraticCurveTo(len*.4,-w*.5,len/2,0);x.quadraticCurveTo(len*.4,w*.5,len*.15,w*.9);x.quadraticCurveTo(-len*.2,w,-len/2,0);x.closePath();x.fill();x.stroke();
  x.strokeStyle='rgba(40,20,5,.55)';x.lineWidth=.35;x.beginPath();x.moveTo(-len*.4,0);x.lineTo(len*.42,0);x.stroke();
  if(kind==='fish'){x.fillStyle='#f0e4c8';x.strokeStyle=MPL.INK;x.lineWidth=.4;x.fillRect(-len*.12,-w*.45,len*.2,w*.9);x.strokeRect(-len*.12,-w*.45,len*.2,w*.9);x.fillStyle=MPL.VERM;x.fillRect(-len*.12,-w*.2,len*.2,w*.4)}
  else if(kind==='dhow'){x.fillStyle='#f6ecd0';x.strokeStyle=MPL.INK;x.lineWidth=.45;x.beginPath();x.moveTo(-len*.05,0);x.lineTo(len*.38,-w*.2);x.lineTo(-len*.3,-w*1.9);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(-len*.05,0);x.lineTo(-len*.3,w*1.7);x.lineTo(len*.3,w*.2);x.closePath();x.fillStyle='#eadcb4';x.fill();x.stroke()}
  else{x.strokeStyle='#5a3a1c';x.lineWidth=.4;for(const k of [-.15,.1]){x.beginPath();x.moveTo(len*k,-w*.9);x.lineTo(len*k,w*.9);x.stroke()}}
  x.restore()}
function mpYarrimShip(x,a,b){ /* the big ship moored at the end of the pier, seen from above, bow to the north */
  x.save();x.translate(a,b);const L2=24,W2=7;
  x.fillStyle='rgba(30,70,100,.3)';x.beginPath();x.ellipse(1.5,1.5,W2*1.1,L2*.55,0,0,6.3);x.fill();
  x.fillStyle='#8a5a2c';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(0,-L2/2);x.quadraticCurveTo(W2,-L2*.2,W2*.9,L2*.25);x.quadraticCurveTo(W2*.7,L2/2,0,L2/2);x.quadraticCurveTo(-W2*.7,L2/2,-W2*.9,L2*.25);x.quadraticCurveTo(-W2,-L2*.2,0,-L2/2);x.fill();x.stroke();
  x.fillStyle='#c9a06a';x.beginPath();x.moveTo(0,-L2/2+2);x.quadraticCurveTo(W2*.75,-L2*.2,W2*.65,L2*.25);x.quadraticCurveTo(W2*.5,L2/2-2,0,L2/2-2);x.quadraticCurveTo(-W2*.5,L2/2-2,-W2*.65,L2*.25);x.quadraticCurveTo(-W2*.75,-L2*.2,0,-L2/2+2);x.fill();
  x.strokeStyle='rgba(60,30,10,.45)';x.lineWidth=.35;for(let yy=-L2/2+4;yy<L2/2-3;yy+=1.6){const hw=W2*.62*Math.sqrt(Math.max(0,1-Math.pow(yy/(L2/2),2)))+.5;x.beginPath();x.moveTo(-hw,yy);x.lineTo(hw,yy);x.stroke()}
  for(const [my,sw,col] of [[-6,6,'#f6ecd0'],[0,7,'#f0e2bc'],[6,5.5,'#f6ecd0']]){x.fillStyle=col;x.strokeStyle=MPL.INK;x.lineWidth=.55;x.beginPath();x.ellipse(0,my,sw,1.9,0,0,6.3);x.fill();x.stroke();x.fillStyle='#4a2c14';x.beginPath();x.arc(0,my,.9,0,6.3);x.fill()}
  x.fillStyle=MPL.VERM;x.fillRect(-.8,L2/2-3,1.6,2.2);x.strokeStyle=MPL.INK;x.lineWidth=.4;x.strokeRect(-.8,L2/2-3,1.6,2.2);
  x.restore()}
function mpYarrimBird(x,a,b,s,col){x.save();x.strokeStyle=col||MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(a-3*s,b-.8*s);x.quadraticCurveTo(a-1.5*s,b-2.6*s,a,b);x.quadraticCurveTo(a+1.5*s,b-2.6*s,a+3*s,b-.8*s);x.stroke();x.restore()}
function mpYarrimHouse(x,h,F,sp,num){
  const s=F.s,X0=F.X(h.x0),Y0=F.Y(h.y0),W=(h.x1-h.x0+1)*s,H=(h.y1-h.y0+1)*s,seed=h.x0*13+h.y0*7;
  const WALL=['#ebbab0','#eed68c','#bcd2aa','#aac4e2','#f0a484','#f2ecd8'],ROOF=[['#c8402a','#9a2c1a'],['#3a5eb0','#254486'],['#d27a3e','#a85a26'],['#3f8a64','#2c6a4a'],['#8a5a92','#684472'],['#dcb44a','#b48c26']];
  x.save();x.fillStyle='rgba(60,40,20,.3)';mpYarrimRect(x,X0+1.5,Y0+1.7,W,H,seed,.4);x.fill();
  x.fillStyle=WALL[h.hue%6];x.strokeStyle=MPL.INK;x.lineWidth=.7;mpYarrimRect(x,X0,Y0,W,H,seed+1,.35);x.fill();x.stroke();
  const m=Math.max(.8,s*.18),rx=X0+m,ry=Y0+m,rw=W-2*m,rh=H-2*m,horiz=rw>=rh,[hi,lo]=ROOF[h.roof%6];
  x.fillStyle=hi;x.lineWidth=.6;
  if(horiz){mpYarrimRect(x,rx,ry,rw,rh/2,seed+2,.25);x.fill();x.stroke();x.fillStyle=lo;mpYarrimRect(x,rx,ry+rh/2,rw,rh/2,seed+3,.25);x.fill();x.stroke()}
  else{mpYarrimRect(x,rx,ry,rw/2,rh,seed+2,.25);x.fill();x.stroke();x.fillStyle=lo;mpYarrimRect(x,rx+rw/2,ry,rw/2,rh,seed+3,.25);x.fill();x.stroke()}
  x.strokeStyle='rgba(30,15,5,.3)';x.lineWidth=.3;
  if(horiz){for(let yy=ry+1.2;yy<ry+rh;yy+=1.2){if(Math.abs(yy-(ry+rh/2))<.5)continue;x.beginPath();x.moveTo(rx+.4,yy);x.lineTo(rx+rw-.4,yy);x.stroke()}x.strokeStyle='#fff4d0';x.lineWidth=.6;x.beginPath();x.moveTo(rx,ry+rh/2);x.lineTo(rx+rw,ry+rh/2);x.stroke()}
  else{for(let xx=rx+1.2;xx<rx+rw;xx+=1.2){if(Math.abs(xx-(rx+rw/2))<.5)continue;x.beginPath();x.moveTo(xx,ry+.4);x.lineTo(xx,ry+rh-.4);x.stroke()}x.strokeStyle='#fff4d0';x.lineWidth=.6;x.beginPath();x.moveTo(rx+rw/2,ry);x.lineTo(rx+rw/2,ry+rh);x.stroke()}
  if(sp){x.strokeStyle=MPL.GOLD;x.lineWidth=.9;mpYarrimRect(x,X0-.6,Y0-.6,W+1.2,H+1.2,seed+9,.2);x.stroke()}
  const dx=F.X(h.door[0]+.5),dy=F.Y(h.door[1]+.5);x.fillStyle='#3e2410';x.strokeStyle=MPL.INK;x.lineWidth=.4;
  const f=h.face,ex=f==='E'?F.X(h.x1+1):f==='W'?F.X(h.x0):dx,ey=f==='S'?F.Y(h.y1+1):f==='N'?F.Y(h.y0):dy;x.beginPath();x.arc(ex,ey,1.2,0,6.3);x.fill();x.stroke();
  x.restore()}
mplInstall({name:'yarrim',levels:[290],tint:[4,6,10],fit:mpYarrimFit,
  foot:'You are the yellow arrow. The numbers on the map are listed on the right.',
  draw(c,x,L,api){
    const W=L.rows[0].length,H=L.rows.length,F=mpYarrimFit(L),A=MPL.AREA,s=F.s,X=F.X,Y=F.Y,I=api.I,ink=MPL.INK,P=YR.plan,G0=YP.GORGE;
    const cell=(cx,cy)=>{const yy=Math.max(0,Math.min(H-1,cy));return cx>=0&&cx<W?L.fmap[yy][cx]:'0'};
    const coast=y=>yarCoast(y);
    x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
    /* the sea: deep blue far out, paler and greener towards the shore */
    const bands=[[60,'#3a6a9a'],[34,'#4a7ea8'],[24,'#5a8fb2'],[16,'#6ba2b8'],[10,'#80b6bc'],[6,'#98c8be'],[3.5,'#b4d8c0'],[1.6,'#d0e6c4']];
    const ys=[];for(let y=-7;y<=87;y+=.5)ys.push(y);const ysF=ys.filter(y=>y>=4.2&&y<=75.8);
    const band=d=>{x.beginPath();ys.forEach((y,i)=>{const px=X(coast(y)+(d>40?0:0));i?x.lineTo(px,Y(y)):x.moveTo(px,Y(y))});if(d>40){x.lineTo(A.x+A.w+4,Y(87));x.lineTo(A.x+A.w+4,Y(-7))}else{for(let k=ys.length-1;k>=0;k--){const y=ys[k];x.lineTo(X(coast(y)+d+1.3*Math.sin(y*1.7+d)),Y(y))}}x.closePath()};
    for(const [d,col] of bands){band(d);x.fillStyle=col;x.fill()}
    /* sea texture: long soft strokes and ink wave marks, thicker in the deep water */
    x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=.5;
    for(let i=0;i<260;i++){const px=60+hash2(i,1,201)*54,py=-4+hash2(i,2,201)*88;if(px<coast(py)+1.5)continue;const a=X(px),b=Y(py),l=3+hash2(i,3,201)*6;x.beginPath();x.moveTo(a,b);x.bezierCurveTo(a+l*.3,b-1.1,a+l*.7,b+1.1,a+l,b);x.stroke()}
    x.strokeStyle='rgba(20,50,100,.4)';x.lineWidth=.45;
    for(let i=0;i<340;i++){const px=58+hash2(i,1,202)*56,py=-4+hash2(i,2,202)*88;if(px<coast(py)+2)continue;const a=X(px),b=Y(py),l=1.6+hash2(i,3,202)*1.8;x.beginPath();x.moveTo(a-l,b);x.quadraticCurveTo(a-l/2,b-1.4,a,b);x.quadraticCurveTo(a+l/2,b+1.4,a+l,b);x.stroke()}
    /* the land: sand, scrub and meadow from the real ground map; paths and the pier drawn as cells */
    const rock=(cx,cy)=>{const f=cell(cx,cy);return (f!=='1'&&f!=='6'&&f!=='2')&&Math.max(mpYarrimRock(cx,cy),mpYarrimIsl(cx,cy))>1.7&&!(cx>=G0.x0&&cx<=G0.x1+1&&Math.abs(cy-G0.y)<=1)};
    const R=[];for(let cy=-7;cy<=87;cy++){R.push([]);for(let cx=9;cx<=113;cx++)R[cy+7][cx-9]=rock(cx,cy)}
    const isR=(cx,cy)=>cy>=-7&&cy<=87&&cx>=9&&cx<=113&&R[cy+7][cx-9];
    const layer=(pred,col,bl,al)=>{const K=4,cw=105,ch=95,o=document.createElement('canvas');o.width=cw*K;o.height=ch*K;const ox=o.getContext('2d');ox.fillStyle=col;
      for(let cy=-7;cy<=87;cy++)for(let cx=9;cx<=113;cx++)if(pred(cx,cy))ox.fillRect((cx-9)*K-.5,(cy+7)*K-.5,K+1,K+1);
      const o2=document.createElement('canvas');o2.width=o.width;o2.height=o.height;const x2=o2.getContext('2d');x2.filter=`blur(${bl}px)`;x2.drawImage(o,0,0);
      x.save();x.globalAlpha=al||1;x.drawImage(o2,X(9),Y(-7),cw*s,ch*s);x.restore()};
    const landc=(cx,cy)=>cy>=0&&cy<H&&cx<W&&L.fmap[cy][cx]!=='4'&&!isR(cx,cy);
    layer(landc,'#dcc98c',2.2);
    layer((cx,cy)=>landc(cx,cy)&&L.fmap[cy][cx]==='3','#f0e2b2',2.6,.9);
    layer((cx,cy)=>landc(cx,cy)&&L.fmap[cy][cx]==='5','#a9c07a',2.2,.95);
    layer((cx,cy)=>landc(cx,cy)&&L.fmap[cy][cx]==='5'&&hash2(cx,cy,3)<.5,'#9ab56e',3,.5);
    /* grass tufts, pebbles and sand speckle */
    for(let cy=0;cy<H;cy++)for(let cx=10;cx<W;cx++){const f=L.fmap[cy][cx],a=X(cx),b=Y(cy);
      if(f==='5'){x.strokeStyle='rgba(60,100,40,.55)';x.lineWidth=.4;for(let k=0;k<2;k++){const px=a+hash2(cx,cy,k+5)*s,py=b+.8+hash2(cx,cy,k+9)*s;x.beginPath();x.moveTo(px,py);x.lineTo(px-.5,py-1.2);x.moveTo(px,py);x.lineTo(px+.6,py-1.1);x.stroke()}}
      else if(f==='0'||f==='3'){if(hash2(cx,cy,12)<.5){x.fillStyle=f==='3'?'rgba(190,160,100,.5)':'rgba(150,120,70,.45)';x.fillRect(a+hash2(cx,cy,13)*s,b+hash2(cx,cy,14)*s,.7,.7)}}}
    /* the cliff and headlands: rock cells with shading and hatching, then an inked edge */
    layer(isR,'#aa9e88',2.2);
    for(let cy=-7;cy<=87;cy++)for(let cx=9;cx<=113;cx++)if(isR(cx,cy)){const hh=Math.max(mpYarrimRock(cx,cy),mpYarrimIsl(cx,cy)),a=X(cx),b=Y(cy),t=Math.min(1,(hh-1.7)/2.6);
      x.fillStyle=`rgb(${Math.round(176-t*52)},${Math.round(162-t*50)},${Math.round(140-t*46)})`;x.beginPath();x.ellipse(a+s/2,b+s/2,s*.8,s*.8,hash2(cx,cy,6)*3,0,6.3);x.globalAlpha=.55;x.fill();x.globalAlpha=1}
    for(let cy=-7;cy<=87;cy++)for(let cx=9;cx<=113;cx++)if(isR(cx,cy)){const a=X(cx),b=Y(cy),hh=Math.max(mpYarrimRock(cx,cy),mpYarrimIsl(cx,cy));
      x.strokeStyle='rgba(50,36,22,.42)';x.lineWidth=.4;for(let k=0;k<2;k++){const px=a+hash2(cx,cy,k+20)*s,py=b+hash2(cx,cy,k+24)*s;x.beginPath();x.moveTo(px,py);x.lineTo(px+1.9,py+1.6);x.stroke()}
      if(hh>2.6&&hash2(cx,cy,30)<.5){x.strokeStyle='rgba(250,240,220,.5)';x.beginPath();x.moveTo(a+1,b+s-.5);x.lineTo(a+s*.7,b+.6);x.stroke()}}
    x.strokeStyle=ink;x.lineWidth=.8;x.lineCap='round';x.lineJoin='round';
    const edge=(ax,ay,bx,by,sd,hx,hy)=>{x.strokeStyle=ink;x.lineWidth=.8;x.beginPath();x.moveTo(ax,ay);for(let k=1;k<=3;k++){const u=k/3;x.lineTo(ax+(bx-ax)*u+(hash2(sd,k,41)-.5)*1.1,ay+(by-ay)*u+(hash2(sd,k,42)-.5)*1.1)}x.stroke();
      x.strokeStyle='rgba(40,28,16,.5)';x.lineWidth=.4;x.beginPath();for(let k=0;k<3;k++){const u=(k+.5)/3,px=ax+(bx-ax)*u,py=ay+(by-ay)*u,l=1.2+hash2(sd,k,43)*1.6;x.moveTo(px,py);x.lineTo(px+hx*l,py+hy*l)}x.stroke()};
    for(let cy=-7;cy<=87;cy++)for(let cx=9;cx<=113;cx++)if(isR(cx,cy)){const a=X(cx),b=Y(cy),sd=cx*31+cy*17;
      if(!isR(cx-1,cy))edge(a,b,a,b+s,sd,1,.3);
      if(!isR(cx+1,cy))edge(a+s,b,a+s,b+s,sd+1,-1,.3);
      if(!isR(cx,cy-1))edge(a,b,a+s,b,sd+2,.3,1);
      if(!isR(cx,cy+1))edge(a,b+s,a+s,b+s,sd+3,.3,-1)}
    x.lineCap='butt';
    /* little ink mountains along the cliff and headlands */
    for(let i=0;i<60;i++){const cx=9+hash2(i,1,210)*13,cy=-4+hash2(i,2,210)*86;if(isR(Math.floor(cx),Math.floor(cy))&&isR(Math.floor(cx+1),Math.floor(cy))&&hash2(i,3,210)<.6&&(Math.abs(cy-G0.y)>4))I.mountain(x,X(cx),Y(cy)+3,.55+hash2(i,4,210)*.35)}
    for(let i=0;i<22;i++){const cx=26+hash2(i,1,211)*86,cy=hash2(i,2,211)<.5?-2+hash2(i,3,211)*4:78+hash2(i,3,211)*4;if(isR(Math.floor(cx),Math.floor(cy)))I.mountain(x,X(cx),Y(cy)+3,.5+hash2(i,4,211)*.4)}
    /* foam along the beach and round the islands and rocks */
    x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=.9;x.setLineDash([2.2,1.6]);x.beginPath();ysF.forEach((y,i)=>{const px=X(coast(y)+.9+.35*Math.sin(y*2.1));i?x.lineTo(px,Y(y)):x.moveTo(px,Y(y))});x.stroke();x.setLineDash([]);
    x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=.5;x.beginPath();ysF.forEach((y,i)=>{const px=X(coast(y)+2.8+.5*Math.sin(y*1.3));i?x.lineTo(px,Y(y)):x.moveTo(px,Y(y))});x.stroke();
    x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=.7;
    for(let cy=0;cy<H;cy++)for(let cx=Math.ceil(coast(cy))+2;cx<W;cx++){const f=L.fmap[cy][cx];if(f==='4'||f==='2')continue;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){if(L.fmap[cy+dy]&&L.fmap[cy+dy][cx+dx]==='4'){const a=X(cx),b=Y(cy);x.beginPath();if(dx)x.moveTo(a+(dx>0?s+.6:-.6),b+.5),x.lineTo(a+(dx>0?s+.6:-.6),b+s-.5);else x.moveTo(a+.5,b+(dy>0?s+.6:-.6)),x.lineTo(a+s-.5,b+(dy>0?s+.6:-.6));x.stroke()}}}
    /* roads: the cobbled lanes and square with stones, the dirt track at the back */
    for(let cy=0;cy<H;cy++)for(let cx=10;cx<W;cx++){const f=L.fmap[cy][cx];if(f!=='1'&&f!=='6')continue;const a=X(cx),b=Y(cy);
      x.fillStyle=f==='1'?'#d8d0bc':'#d8ab70';mpYarrimRect(x,a-.25,b-.25,s+.5,s+.5,cx*7+cy,.5);x.fill()}
    for(let cy=0;cy<H;cy++)for(let cx=10;cx<W;cx++){const f=L.fmap[cy][cx];if(f!=='1'&&f!=='6')continue;const a=X(cx),b=Y(cy);
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const n=(L.fmap[cy+dy]||'')[cx+dx];if(n!=='1'&&n!=='6'&&n!=='2'&&n!==undefined){x.strokeStyle=f==='1'?'rgba(90,70,50,.55)':'rgba(120,70,30,.5)';x.lineWidth=.45;x.beginPath();if(dx){const xx=a+(dx>0?s:0);x.moveTo(xx,b);x.lineTo(xx,b+s)}else{const yy=b+(dy>0?s:0);x.moveTo(a,yy);x.lineTo(a+s,yy)}x.stroke()}}
      if(f==='1'){x.strokeStyle='rgba(120,105,85,.55)';x.lineWidth=.3;x.strokeRect(a+.3,b+.3,s-.6,s-.6);x.beginPath();x.moveTo(a+s/2,b+.3);x.lineTo(a+s/2,b+s-.3);x.stroke()}
      else if(hash2(cx,cy,15)<.7){x.fillStyle='rgba(110,70,30,.5)';x.fillRect(a+hash2(cx,cy,16)*s,b+hash2(cx,cy,17)*s,.8,.8);x.fillRect(a+hash2(cx,cy,18)*s,b+hash2(cx,cy,19)*s,.7,.7)}}
    /* the little park behind the inn */
    {const pk=P.park,a=X(pk.x0),b=Y(pk.y0),w=(pk.x1-pk.x0+1)*s,h=(pk.y1-pk.y0+1)*s;x.fillStyle='#9cbc70';mpYarrimRect(x,a,b,w,h,77,.8);x.fill();x.strokeStyle='rgba(40,80,30,.7)';x.lineWidth=.6;x.stroke();x.strokeStyle='rgba(50,100,40,.6)';x.lineWidth=.35;for(let i=0;i<140;i++){const px=a+hash2(i,1,220)*w,py=b+hash2(i,2,220)*h;x.beginPath();x.moveTo(px,py);x.lineTo(px-.5,py-1.1);x.moveTo(px,py);x.lineTo(px+.5,py-1)}x.stroke()}
    /* the pier and quay: planks with grain, posts along the edge, a lamp at the end */
    for(let cy=0;cy<H;cy++)for(let cx=10;cx<W;cx++){if(L.fmap[cy][cx]!=='2')continue;const a=X(cx),b=Y(cy);x.fillStyle=hash2(cx,cy,23)<.5?'#a8763e':'#98683a';x.fillRect(a-.2,b-.2,s+.4,s+.4);x.strokeStyle='rgba(50,25,8,.55)';x.lineWidth=.35;x.beginPath();x.moveTo(a,b+s/2);x.lineTo(a+s,b+s/2);x.moveTo(a+s*.5,b);x.lineTo(a+s*.5,b+s);x.stroke()}
    x.strokeStyle=ink;x.lineWidth=.7;for(const [x0,y0,x1,y1] of [[57,40,87,42],[84,36,87,46]]){x.strokeRect(X(x0),Y(y0),(x1-x0)*s,(y1-y0)*s)}
    x.fillStyle='#5a3a1c';x.strokeStyle=ink;x.lineWidth=.4;for(let px=58;px<=86;px+=2){for(const py of [40,42]){x.beginPath();x.arc(X(px),Y(py),.9,0,6.3);x.fill();x.stroke()}}for(let py=37;py<=45;py+=2){for(const px of [84,87]){x.beginPath();x.arc(X(px),Y(py),.9,0,6.3);x.fill();x.stroke()}}
    /* ripples where the pier meets the water */
    x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=.5;for(let k=0;k<6;k++){const px=62+k*4.6;x.beginPath();x.moveTo(X(px),Y(42.3));x.quadraticCurveTo(X(px+1),Y(42.9),X(px+2),Y(42.4));x.moveTo(X(px+1),Y(39.6));x.quadraticCurveTo(X(px+2),Y(39),X(px+3),Y(39.6));x.stroke()}
    /* the lighthouse on the north point: round stone tower, gold lamp, a fan of light across the sea */
    {const lh=P.light,cx=X(lh.x0+1.5),cy=Y(lh.y0+1.5);
      const g=x.createRadialGradient(cx,cy,3,cx+36,cy-4,50);g.addColorStop(0,'rgba(255,236,150,.55)');g.addColorStop(1,'rgba(255,236,150,0)');x.fillStyle=g;x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,56,-.55,.35);x.closePath();x.fill();
      x.fillStyle='#d6c9ac';x.strokeStyle=ink;x.lineWidth=.8;x.beginPath();x.arc(cx,cy,6.2,0,6.3);x.fill();x.stroke();x.fillStyle='#b8aa8c';x.beginPath();x.arc(cx,cy,4.4,0,6.3);x.fill();x.stroke();
      x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(cx,cy,2.2,0,6.3);x.fill();x.stroke();x.strokeStyle=MPL.GOLD;x.lineWidth=.6;for(let k=0;k<8;k++){x.beginPath();x.moveTo(cx+Math.cos(k*.785)*7,cy+Math.sin(k*.785)*7);x.lineTo(cx+Math.cos(k*.785)*10,cy+Math.sin(k*.785)*10);x.stroke()}}
    /* houses */
    const hs=P.houses.slice().sort((p,q)=>p.y0-q.y0);
    for(const h of hs)mpYarrimHouse(x,h,F,!!h.sp);
    /* tubs, lavender and flowers at the foot of walls */
    for(const d of (L.scenery||[])){const k=d.k,a=X(d.wx),b=Y(d.wy);
      if(k==='yar_tub'){x.fillStyle='#a86a3a';x.beginPath();x.arc(a,b,1.1,0,6.3);x.fill();x.fillStyle=['#f06a8a','#f4c940','#e8607a'][Math.floor(hash2(Math.floor(a),Math.floor(b),3)*3)];x.beginPath();x.arc(a,b-.2,.8,0,6.3);x.fill()}
      else if(k==='yar_lavender'){x.strokeStyle='#8a5ab0';x.lineWidth=.8;for(let j=0;j<3;j++){x.beginPath();x.moveTo(a-1+j,b+.8);x.lineTo(a-1+j,b-.9);x.stroke()}}
      else if(/bucket/.test(k)){x.fillStyle='#7a5a3a';x.beginPath();x.arc(a,b,.9,0,6.3);x.fill();x.strokeStyle=ink;x.lineWidth=.3;x.stroke()}}
    /* decor: trees, boats on the beach, nets, crates, pots, lamps, benches, arches, the well, the washing */
    const trees=[],lamps=[];
    for(const d of L.decor){const k=d.k,a=X(d.x+.5),b=Y(d.y+.5);
      if(k==='yar_olive'||/^yar_wtree/.test(k)){trees.push(d);continue}
      if(k==='lamp'){lamps.push([a,b]);continue}
      if(k==='yar_crates'){x.fillStyle='#a8763e';x.strokeStyle=ink;x.lineWidth=.4;x.fillRect(a-1.5,b-1.3,3,2.6);x.strokeRect(a-1.5,b-1.3,3,2.6);x.beginPath();x.moveTo(a-1.5,b);x.lineTo(a+1.5,b);x.stroke()}
      else if(k==='yar_nets'){x.fillStyle='rgba(210,190,140,.85)';x.strokeStyle='rgba(70,50,20,.8)';x.lineWidth=.3;x.beginPath();x.ellipse(a,b,2.2,1.6,.3,0,6.3);x.fill();x.stroke();x.beginPath();for(let j=-1;j<=1;j++){x.moveTo(a-2+j*.1,b+j*.9);x.lineTo(a+2,b+j*.9)}x.moveTo(a-.8,b-1.5);x.lineTo(a-.8,b+1.5);x.moveTo(a+.8,b-1.5);x.lineTo(a+.8,b+1.5);x.stroke()}
      else if(k==='yar_pots'){x.fillStyle='#8a4a2a';x.strokeStyle=ink;x.lineWidth=.35;for(const [dx,dy] of [[-1,0],[1,.3],[0,-1]]){x.beginPath();x.arc(a+dx,b+dy,.9,0,6.3);x.fill();x.stroke()}}
      else if(k==='yar_boat_row'){mpYarrimBoat(x,a,b,7,hash2(d.x,d.y,5)*3.14,'row',1)}
      else if(k==='yar_boat_fish'){mpYarrimBoat(x,a,b,10,hash2(d.x,d.y,5)*3.14,'fish',2)}
      else if(k==='yar_boat_dhow'){mpYarrimBoat(x,a,b,10,hash2(d.x,d.y,5)*3.14,'dhow',3)}
      else if(k==='yar_bench'){x.fillStyle='#7a5230';x.fillRect(a-1.7,b-.7,3.4,1.4)}
      else if(k==='well'){x.fillStyle='#bfb59c';x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.arc(a,b,2.3,0,6.3);x.fill();x.stroke();x.fillStyle='#4a7aa8';x.beginPath();x.arc(a,b,1.3,0,6.3);x.fill()}
      else if(k==='yar_arch2'){x.strokeStyle='#d0506a';x.lineWidth=1.2;x.beginPath();x.arc(a,b,2,0,6.3);x.stroke();x.strokeStyle='#5a8a40';x.lineWidth=.6;x.beginPath();x.arc(a,b,2,.4,2.4);x.stroke()}
      else if(k==='yar_washing'){x.strokeStyle='#5a3a1c';x.lineWidth=.4;x.beginPath();x.moveTo(a-3,b);x.lineTo(a+3,b);x.stroke();['#f4f0e0',MPL.VERM,'#f4f0e0',MPL.LAPIS].forEach((col,j)=>{x.fillStyle=col;x.fillRect(a-3+j*1.6,b,1.2,1.7)})}
      else if(k==='yar_ship_dawn'){}}
    /* boats moored on the water (from the level's own boat list), then the big ship at the pier */
    const seen=new Set(L.decor.filter(d=>/^yar_boat/.test(d.k)).map(d=>d.x+','+d.y));
    for(const [k,bx,by] of (YR.boats||[])){if(seen.has(bx+','+by))continue;const a=X(bx+.5),b=Y(by+.5),r=hash2(bx,by,5)*.8-.4;
      if(k==='yar_boat_dhow')mpYarrimBoat(x,a,b,11,r+1.5,'dhow',1);else if(k==='yar_boat_fish')mpYarrimBoat(x,a,b,10,r+1.5,'fish',2);else mpYarrimBoat(x,a,b,7,r+1.5,'row',3)}
    mpYarrimShip(x,X(87.6),Y(41.2)-1);
    /* trees: olives and the wind-bent pines, drawn last so lower ones overlap */
    trees.sort((p,q)=>p.y-q.y);
    for(const d of trees){const a=X(d.x+.5),b=Y(d.y+.5),h=hash2(d.x,d.y,9);
      if(d.k==='yar_olive'){I.tree(x,a,b+1.2,.5+h*.15,['#8aa860','#7a9a58','#9ab26a'][Math.floor(h*3)])}
      else{x.save();x.translate(a,b+1.5);x.rotate(.22);I.pine(x,0,0,.5+(d.sc||1)*.18);x.restore()}}
    /* lamps: warm gold with a soft glow */
    for(const [a,b] of lamps){x.fillStyle='rgba(255,220,110,.4)';x.beginPath();x.arc(a,b,3.2,0,6.3);x.fill();x.fillStyle=MPL.GOLD2;x.strokeStyle=ink;x.lineWidth=.4;x.beginPath();x.arc(a,b,1,0,6.3);x.fill();x.stroke()}
    /* gulls on the beach and over the water */
    for(let i=0;i<46;i++){const y=6+hash2(i,1,230)*68,px=coast(y)-1-hash2(i,2,230)*6;if(px<G0.x1+2)continue;x.fillStyle='#fffaf0';x.strokeStyle='rgba(40,30,20,.7)';x.lineWidth=.3;const a=X(px),b=Y(y);x.beginPath();x.ellipse(a,b,.9,.55,0,0,6.3);x.fill();x.stroke()}
    for(const [px,py,k] of [[62,14,1],[70,31,.9],[77,48,1],[95,34,.8],[66,56,.9],[100,66,1],[88,10,.9],[58,62,.8],[93,46,.8]])mpYarrimBird(x,X(px),Y(py),k);
    /* two far-off sails and a sea serpent's coils are not drawn; small sailing ships and rocks only */
    mpYarrimBoat(x,X(104),Y(14),11,.4,'dhow',5);mpYarrimBoat(x,X(95),Y(72),12,-.3,'dhow',6);mpYarrimBoat(x,X(108),Y(48),9,1.2,'fish',7);
    /* sea shading near the frame for depth */
    const vg=x.createLinearGradient(A.x+A.w-60,0,A.x+A.w,0);vg.addColorStop(0,'rgba(20,50,100,0)');vg.addColorStop(1,'rgba(20,50,100,.22)');x.fillStyle=vg;x.fillRect(A.x+A.w-60,A.y,60,A.h);
    /* names */
    const nm=(t,cx,cy,sz,col)=>api.text(x,t,X(cx),Y(cy),sz,col);
    for(const n of L.mapNames){const col=n.k==='place'?'#8a2a14':'#5a3a1c';
      if(n.t==='The Pier'){nm('The Pier',72,39,6,'#5a3a1c');continue}
      if(n.t==='The Gorge'){nm('The Gorge',21.5,37.6,4.4,'#4a3a2a');continue}
      if(n.t==='The Harbour'){nm('The Harbour',52,47,5.6,'#8a2a14');continue}
      if(n.t==='The Little Green'){nm('The Little Green',51,29.4,4.8,'#2f6a3a');continue}
      if(n.t==='Yarrim Point'){nm('Yarrim Point',63,21.2,5.4,'#8a2a14');continue}
      if(n.t==='The Beach'){nm('The Beach',57.5,56,5.4,'#8a5a1c');continue}
      if(n.v){nm(n.t,n.x-2.4,n.y-1.8,3.8,col);continue}
      if(n.t==='Quay Road'){nm('Quay Road',39.5,39.5,3.6,col);continue}
      if(n.t==='The Back Track'){nm(n.t,26,41.9,3.6,col);continue}if(n.t==='Gull Lane'){nm(n.t,44.8,49.6,3.6,col);continue}nm(n.t,n.x,n.y,3.6,col)}
    
    x.save();x.font=`italic bold 7.5px ${FUI}`;x.fillStyle='rgba(18,44,100,.85)';x.textAlign='center';x.textBaseline='middle';x.translate(X(80),Y(15));x.rotate(-.04);x.fillText('T H E   N A R R O W   S E A',0,0);x.restore();
    nm('The Cliff',15.6,30,5,'#3a2a1c');
    api.text(x,'To the Sea Gate tunnel',X(14.5),Y(43.6),4.4,MPL.LAPIS);
    /* an arrow at the tunnel door in the rock */
    x.strokeStyle=MPL.LAPIS;x.lineWidth=1.1;x.beginPath();x.moveTo(X(18.3),Y(40.5));x.lineTo(X(15.2),Y(40.5));x.moveTo(X(16),Y(39.6));x.lineTo(X(15.1),Y(40.5));x.lineTo(X(16),Y(41.4));x.stroke();
    x.fillStyle=MPL.VERM;x.strokeStyle=ink;x.lineWidth=.5;x.beginPath();x.arc(X(17.5),Y(40.5),1.2,0,6.3);x.fill();x.stroke();
    /* numbered discs over the buildings that open */
    const NUM=[['inn',1],['harbour',2],['chandler',3],['trader',4],['dealer',5],['maren',6],['chapel',7],['loft',8]];
    const disc=(a,b,n)=>{x.fillStyle=MPL.GOLD2;x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.arc(a,b,2.5,0,6.3);x.fill();x.stroke();x.fillStyle=ink;x.font=`bold 3.6px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),a,b+.2)};
    for(const [id,n] of NUM){const h=P.special[id];if(h)disc(X((h.x0+h.x1+1)/2),Y(h.y0)-1.6,n)}
    disc(X(P.light.x0+1.5),Y(P.light.y0)-2.6,9);
    x.restore();
    /* the inked frame around the drawing */
    x.strokeStyle=ink;x.lineWidth=1;x.strokeRect(A.x,A.y,A.w,A.h);x.strokeStyle=MPL.GOLD;x.lineWidth=1.6;x.strokeRect(A.x+1.5,A.y+1.5,A.w-3,A.h-3);
    /* margins */
    api.title(x,'Yarrim','A harbour town on the Narrow Sea');
    api.compass(x,438,58,14);
    api.panel(x,6,52,82,82);api.text(x,'About Yarrim',47,61,7.4,MPL.LAPIS);
    api.notes(x,['Yarrim is a small fishing town on the east shore of the Narrow Sea.','One cobbled road runs from the back track down to the harbour square and the pier.'],11,72,70,6,3);
    api.panel(x,6,140,82,148);api.text(x,'Key',47,149,7.4,MPL.LAPIS);
    const ky=[['Cottage',()=>{const h={x0:0,x1:1,y0:0,y1:1,hue:1,roof:0,face:'S',door:[0,1]};mpYarrimHouse(x,Object.assign(h,{}),{s:5,X:v=>12+v*5,Y:v=>156+v*5-4},false)}],['Cobbled road',()=>{x.fillStyle='#d8d0bc';x.fillRect(12,167,12,5);x.strokeStyle=ink;x.lineWidth=.5;x.strokeRect(12,167,12,5)}],['Dirt track',()=>{x.fillStyle='#d8ab70';x.fillRect(12,179,12,5);x.strokeStyle=ink;x.lineWidth=.5;x.strokeRect(12,179,12,5)}],['Pier',()=>{x.fillStyle='#a8763e';x.fillRect(12,191,12,5);x.strokeStyle=ink;x.lineWidth=.5;x.strokeRect(12,191,12,5)}],['Beach',()=>{x.fillStyle='#efe0ae';x.fillRect(12,203,12,5);x.strokeStyle=ink;x.lineWidth=.5;x.strokeRect(12,203,12,5)}],['Cliff rock',()=>I.mountain(x,18,219,.6)],['Fishing boat',()=>mpYarrimBoat(x,18,230,11,0,'fish',1)],['Sailing dhow',()=>mpYarrimBoat(x,18,241,11,0,'dhow',1)],['Lamp',()=>{x.fillStyle=MPL.GOLD2;x.strokeStyle=ink;x.lineWidth=.5;x.beginPath();x.arc(18,252,1.8,0,6.3);x.fill();x.stroke()}],['Lighthouse',()=>{x.fillStyle='#d6c9ac';x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.arc(18,264,4,0,6.3);x.fill();x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(18,264,1.6,0,6.3);x.fill()}],['Numbered place',()=>{x.fillStyle=MPL.GOLD2;x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.arc(18,276,3,0,6.3);x.fill();x.stroke();x.fillStyle=ink;x.font=`bold 4px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.fillText('1',18,276.3)}]];
    ky.forEach((k,i)=>{k[1]();api.text(x,k[0],34,[160,169.5,181.5,193.5,205.5,219,230,241,252,264,276][i],6.1,'#3a2a1c','left')});
    api.panel(x,394,76,82,104);api.text(x,'Places',435,85,7.4,MPL.LAPIS);
    ['1 The Drowned Lantern','2 Harbourmaster','3 Brine and Rope','4 Wen\'s Trading Post','5 Selk\'s Ship Dealing','6 Old Maren\'s House','7 Chapel of the Tides','8 The Net Loft','9 The Yarrim Light'].forEach((t,i)=>api.text(x,t,400,96+i*9.4,5.9,'#3a2a1c','left'));
    api.panel(x,394,186,82,102);api.text(x,'Good to know',435,195,7.4,MPL.LAPIS);
    api.notes(x,['Bessa keeps the inn and Tamsin Kell the harbour office.','Selk sells ships at the south side of the square.','Orsa tends the light on the north point.','The donkey cart waits on the square for the road to Khemetra.'],399,206,70,5.9,2);
  }});
