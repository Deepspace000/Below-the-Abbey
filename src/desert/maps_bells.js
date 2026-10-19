/* ==========================================================================
   THE ISLE OF BELLS: the hand-drawn parchment map of the drowned abbey island (level 301). Drawn from the real level: the floor map gives the deep water, the
   shallows, the sand, the grass and the little wooden jetty; the decor gives the three bell arches, the altar, Brother Aldous, the dive buoy, the runestones, the
   wreck and every tree. The abbey ruin (nave, tower, cloister, graves) is laid round those real positions. The underwater abbey (level 321) is a sea-floor reef and
   keeps the standard map.
   ========================================================================== */
/* a bronze bell, small, hanging or sunk: a gold dome with a clapper */
function mpBellsBell(x,a,b,s,col){s=s||1;x.save();x.fillStyle=col||MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(a-3*s,b+2.2*s);x.quadraticCurveTo(a-3*s,b-3.4*s,a,b-3.4*s);x.quadraticCurveTo(a+3*s,b-3.4*s,a+3*s,b+2.2*s);x.lineTo(a+3.8*s,b+3*s);x.lineTo(a-3.8*s,b+3*s);x.closePath();x.fill();x.stroke();
  x.fillStyle='rgba(255,245,190,.7)';x.beginPath();x.ellipse(a-1.1*s,b-.6*s,.6*s,1.4*s,.2,0,6.3);x.fill();x.fillStyle=MPL.INK;x.beginPath();x.arc(a,b+3.8*s,.8*s,0,6.3);x.fill();x.strokeStyle=MPL.INK;x.beginPath();x.moveTo(a,b-3.4*s);x.lineTo(a,b-4.6*s);x.stroke();x.restore()}
/* a broken pointed arch seen from above, a pair of stone stubs with a gap */
function mpBellsArch(x,a,b,s){x.save();x.fillStyle='#d2c8b0';x.strokeStyle=MPL.INK;x.lineWidth=.8;for(const d of [-1,1]){x.fillRect(a+d*3.2*s-1.3*s,b-1.4*s,2.6*s,2.8*s);x.strokeRect(a+d*3.2*s-1.3*s,b-1.4*s,2.6*s,2.8*s)}
  x.strokeStyle='rgba(60,50,40,.7)';x.lineWidth=.6;x.beginPath();x.arc(a,b,2.6*s,Math.PI,0);x.stroke();x.restore();mpBellsBell(x,a,b+.2*s,.8*s)}
/* a grave: a small cross or a slab with a mound */
function mpBellsGrave(x,a,b,k){x.save();x.fillStyle='rgba(90,110,70,.45)';x.beginPath();x.ellipse(a,b+1.4,2.4,1.1,0,0,6.3);x.fill();
  if(k===0){x.strokeStyle='#3a2a1c';x.lineWidth=1;x.beginPath();x.moveTo(a,b-3);x.lineTo(a,b+1.2);x.moveTo(a-1.6,b-1.6);x.lineTo(a+1.6,b-1.6);x.stroke()}
  else{x.fillStyle='#cfc6b0';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-1.4,b+1);x.lineTo(a-1.4,b-1.4);x.quadraticCurveTo(a,b-3.2,a+1.4,b-1.4);x.lineTo(a+1.4,b+1);x.closePath();x.fill();x.stroke()}x.restore()}
/* a wall run seen from above: a thick stone line, broken into stubs by the gaps given as [from,to] fractions */
function mpBellsWall(x,x0,y0,x1,y1,w,gaps,seed){x.save();const len=Math.hypot(x1-x0,y1-y0),n=Math.max(2,Math.round(len/1.6));x.lineCap='butt';
  for(const [col,lw,off] of [['rgba(40,26,12,.3)',w+1.6,1],['#9a9078',w+1,0],['#d6ccb4',w-.6,0]]){x.strokeStyle=col;x.lineWidth=lw;
    for(let i=0;i<n;i++){const t0=i/n,t1=(i+.82)/n;if((gaps||[]).some(g=>(t0+t1)/2>g[0]&&(t0+t1)/2<g[1]))continue;if(hash2(i,seed||1,61)<.1)continue;
      x.beginPath();x.moveTo(x0+(x1-x0)*t0+off,y0+(y1-y0)*t0+off);x.lineTo(x0+(x1-x0)*t1+off,y0+(y1-y0)*t1+off);x.stroke()}}
  x.restore()}

/* the framed area shows the island and its shallows, cropped from the whole 100 x 84 sea */
function mpBellsFit(){const A=MPL.AREA,w=76,h=62,x0=13,y0=11,s=Math.min((A.w-8)/w,(A.h-8)/h),ox=A.x+(A.w-w*s)/2-x0*s,oy=A.y+(A.h-h*s)/2-y0*s;return {s,ox,oy,X:c=>ox+c*s,Y:c=>oy+c*s}}
mplInstall({name:'bells',levels:[301],fit:mpBellsFit,foot:'You are the yellow arrow. The Isle of Bells, with the abbey half sunk in the sea.',tint:[-6,2,2],
draw(c,x,L,api){
  const S=mpBellsFit(),s=S.s,X=S.X,Y=S.Y,H=hash2,W=L.rows[0].length,HT=L.rows.length,INK=MPL.INK,dec=L.decor||[];
  const f=(cx,cy)=>(cx<0||cy<0||cx>=W||cy>=HT)?'4':L.fmap[cy][cx],land=(cx,cy)=>{const t=f(cx,cy);return t==='0'||t==='1'||t==='2'||t==='5'};
  const nearLand=(cx,cy,r)=>{for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(land(cx+dx,cy+dy))return true;return false};
  const R=H;
  x.save();x.beginPath();x.rect(MPL.AREA.x,MPL.AREA.y,MPL.AREA.w,MPL.AREA.h);x.clip();
  x.save();x.beginPath();x.rect(X(0),Y(0),W*s,HT*s);x.clip();
  // the sea: pale green, deeper and greyer towards the edges
  const g=x.createRadialGradient(X(48),Y(40),s*10,X(48),Y(40),s*60);g.addColorStop(0,'rgba(132,196,170,.92)');g.addColorStop(.5,'rgba(100,168,150,.92)');g.addColorStop(1,'rgba(66,120,120,.95)');x.fillStyle=g;x.fillRect(X(0),Y(0),W*s,HT*s);
  for(let i=0;i<90;i++){x.fillStyle=i%2?'rgba(60,110,120,.12)':'rgba(190,230,210,.12)';x.beginPath();x.ellipse(X(R(i,1,5)*W),Y(R(i,2,5)*HT),s*(4+R(i,3,5)*10),s*(2+R(i,4,5)*4),R(i,5,5)*3,0,6.3);x.fill()}
  // the shallows: a lighter, greener belt with a soft edge
  for(let cy=0;cy<HT;cy++)for(let cx=0;cx<W;cx++){const t=f(cx,cy);if(t==='3'||land(cx,cy)){x.fillStyle=t==='3'?'rgba(176,226,198,.78)':'rgba(176,226,198,.55)';x.beginPath();x.arc(X(cx+.5),Y(cy+.5),s*.95,0,6.3);x.fill()}}
  for(let cy=0;cy<HT;cy++)for(let cx=0;cx<W;cx++){if(f(cx,cy)==='3'&&nearLand(cx,cy,2)&&R(cx,cy,6)<.5){x.fillStyle='rgba(222,244,214,.5)';x.beginPath();x.arc(X(cx+.5),Y(cy+.5),s*.8,0,6.3);x.fill()}}
  // ripples and the inked coast, as round blobs round every edge cell so the shore is smooth, then the land on top
  x.save();x.lineCap='round';
  for(let cy=0;cy<HT;cy++)for(let cx=0;cx<W;cx++){if(!land(cx,cy))continue;const edge=!land(cx+1,cy)||!land(cx-1,cy)||!land(cx,cy+1)||!land(cx,cy-1);if(!edge)continue;const a=X(cx+.5),b=Y(cy+.5);
    for(let k=1;k<=3;k++){const q=R(cx,cy,10+k);if(q<.45)continue;x.strokeStyle=`rgba(40,96,100,${.55-k*.12})`;x.lineWidth=.5;const a0=q*6.3;x.beginPath();x.arc(a,b,s*(.95+k*.75),a0,a0+.9+q);x.stroke()}
    x.fillStyle='rgba(42,26,12,.8)';x.beginPath();x.arc(a,b,s*.8+1.5,0,6.3);x.fill()}
  x.restore();
  const colOf={'0':['#e4d49c','#d8c68a','#ecdfb0'],'1':['#9ab468','#86a456','#a8c070'],'5':['#b4b878','#a6ae6c','#c0c284'],'2':['#9a6a38','#8a5a2c','#a87a44']};
  for(let cy=0;cy<HT;cy++)for(let cx=0;cx<W;cx++){const t=f(cx,cy);if(!colOf[t])continue;const cl=colOf[t],a=X(cx+.5)+(R(cx,cy,7)-.5)*.5,b=Y(cy+.5)+(R(cx,cy,8)-.5)*.5;x.fillStyle=cl[Math.floor(R(cx,cy,9)*3)];if(t==='2')x.fillRect(a-s*.52,b-s*.52,s*1.04,s*1.04);else{x.beginPath();x.arc(a,b,s*.8,0,6.3);x.fill()}}
  x.restore();
  // the jetty: plank lines and posts on the wooden floor
  {let ys=[];for(let cy=0;cy<HT;cy++)for(let cx=0;cx<W;cx++)if(f(cx,cy)==='2')ys.push([cx,cy]);
    x.save();x.strokeStyle='rgba(40,22,10,.7)';x.lineWidth=.5;for(const [cx,cy] of ys){x.beginPath();x.moveTo(X(cx),Y(cy+.5));x.lineTo(X(cx+1),Y(cy+.5));x.stroke()}
    x.fillStyle='#3a2210';for(const [cx,cy] of ys){if((cx+cy)%3===0){for(const sx of [0,1]){x.beginPath();x.arc(X(cx+sx),Y(cy+.5),.9,0,6.3);x.fill()}}}x.restore()}
  // sand specks and grass tufts, hatching on the grass
  for(let i=0;i<1700;i++){const cx=Math.floor(R(i,1,12)*W),cy=Math.floor(R(i,2,12)*HT),t=f(cx,cy),a=X(cx+R(i,3,12)),b=Y(cy+R(i,4,12));
    if(t==='0'){x.fillStyle=i%2?'rgba(150,120,70,.55)':'rgba(255,248,214,.65)';x.fillRect(a,b,.9,.7)}
    else if(t==='1'||t==='5'){x.strokeStyle=t==='1'?'rgba(50,90,50,.65)':'rgba(90,110,50,.6)';x.lineWidth=.55;x.beginPath();x.moveTo(a-1,b);x.lineTo(a-.4,b-2);x.moveTo(a,b);x.lineTo(a,b-2.4);x.moveTo(a+1,b);x.lineTo(a+.5,b-1.8);x.stroke()}}
  // the hill: a low rise at the north east, shaded with a few strokes
  // trees and palms from the decor
  const trees=dec.filter(d=>/^(ltree|dpalm)/.test(d.k)).sort((p,q)=>p.y-q.y);
  for(const d of trees){const a=X(d.x+.5),b=Y(d.y+.8);
    if(d.k.startsWith('dpalm')){x.strokeStyle='#5a3a1c';x.lineWidth=.9;x.beginPath();x.moveTo(a,b+1);x.quadraticCurveTo(a+1,b-2,a+.5,b-4.5);x.stroke();x.strokeStyle='#3d7040';x.lineWidth=.9;for(let k=0;k<6;k++){const an=k*1.05+.3;x.beginPath();x.moveTo(a+.5,b-4.5);x.quadraticCurveTo(a+.5+Math.cos(an)*2.5,b-5.8+Math.sin(an)*.8,a+.5+Math.cos(an)*4,b-3.6+Math.sin(an)*1.8);x.stroke()}}
    else MPLI.tree(x,a,b,.62+R(d.x,d.y,15)*.16,['#58804a','#4a7448','#6a8a4a','#3f6c46'][(d.x+d.y)%4])}
  // the abbey: floor of the nave and chancel, walls broken into stubs, pillars, rubble
  const nv={x0:37.5,y0:30.6,x1:58.5,y1:38.4};
  x.save();x.fillStyle='rgba(224,214,188,.9)';x.fillRect(X(nv.x0),Y(nv.y0),(nv.x1-nv.x0)*s,(nv.y1-nv.y0)*s);x.strokeStyle='rgba(110,96,70,.45)';x.lineWidth=.4;
  for(let gx=nv.x0;gx<nv.x1;gx+=1.2)for(let gy=nv.y0;gy<nv.y1;gy+=1.1){x.strokeRect(X(gx)+((gy*2)%2)*.0,Y(gy),1.2*s,1.1*s)}
  x.fillStyle='rgba(96,130,96,.4)';for(let i=0;i<40;i++){x.beginPath();x.ellipse(X(nv.x0+R(i,1,20)*(nv.x1-nv.x0)),Y(nv.y0+R(i,2,20)*(nv.y1-nv.y0)),2+R(i,3,20)*3,1+R(i,4,20)*1.5,R(i,5,20)*3,0,6.3);x.fill()}x.restore();
  const wt=2.2;
  mpBellsWall(x,X(nv.x0),Y(nv.y0),X(nv.x1),Y(nv.y0),wt,[[.28,.36],[.7,.76]],1);
  mpBellsWall(x,X(nv.x0),Y(nv.y1),X(nv.x1),Y(nv.y1),wt,[[.2,.3],[.55,.62]],2);
  mpBellsWall(x,X(nv.x0),Y(nv.y0),X(nv.x0),Y(nv.y1),wt,[[.4,.6]],3);
  mpBellsWall(x,X(nv.x1),Y(nv.y0),X(nv.x1),Y(nv.y1),wt,[[.6,.75]],4);
  // pillars of the nave arcade
  x.fillStyle='#e8e0cc';x.strokeStyle=INK;x.lineWidth=.6;for(const py of [32.6,36.4])for(let px=40.4;px<57;px+=3.1){if(R(px*5,py,22)<.18)continue;x.beginPath();x.arc(X(px),Y(py),1.1,0,6.3);x.fill();x.stroke()}
  // the chancel step and the altar
  x.strokeStyle='rgba(60,50,40,.8)';x.lineWidth=.8;x.beginPath();x.moveTo(X(50),Y(nv.y0));x.lineTo(X(50),Y(nv.y1));x.stroke();
  x.fillStyle='#efe6d0';x.strokeStyle=INK;x.lineWidth=.8;x.fillRect(X(51)-s*.9,Y(36)-s*.55,s*1.8,s*1.1);x.strokeRect(X(51)-s*.9,Y(36)-s*.55,s*1.8,s*1.1);x.strokeStyle=MPL.VERM;x.beginPath();x.moveTo(X(51),Y(36)-s*.4);x.lineTo(X(51),Y(36)+s*.4);x.moveTo(X(51)-s*.4,Y(36)-s*.1);x.lineTo(X(51)+s*.4,Y(36)-s*.1);x.stroke();
  // the bell tower at the north east corner: a thick square ruin, half sunk
  {const tx=X(60.7),ty=Y(30.4),r=s*2.7;x.save();x.fillStyle='rgba(40,26,12,.3)';x.fillRect(tx-r+1.6,ty-r+1.6,2*r,2*r);x.fillStyle='#cfc6ae';x.strokeStyle=INK;x.lineWidth=1;x.fillRect(tx-r,ty-r,2*r,2*r);x.strokeRect(tx-r,ty-r,2*r,2*r);x.fillStyle='#8a8068';x.fillRect(tx-r*.62,ty-r*.62,r*1.24,r*1.24);x.strokeRect(tx-r*.62,ty-r*.62,r*1.24,r*1.24);
    x.strokeStyle='rgba(30,22,14,.6)';x.lineWidth=.5;for(let k=-2;k<=2;k++){x.beginPath();x.moveTo(tx-r,ty+k*r*.4);x.lineTo(tx-r*.62,ty+k*r*.4);x.moveTo(tx+r*.62,ty+k*r*.4);x.lineTo(tx+r,ty+k*r*.4);x.stroke()}
    x.fillStyle='#3a2a1c';x.fillRect(tx+r*.1,ty-r*.1,r*.5,r*.5);mpBellsBell(x,tx-r*.1,ty-r*.15,.9,'#d8b030');x.restore()}
  // the cloister: an outer wall, a walk lined with small pillars, a garth with a well
  const cl={x0:39.5,y0:41.2,x1:56.5,y1:50.2};
  x.save();x.fillStyle='rgba(222,212,184,.88)';x.fillRect(X(cl.x0),Y(cl.y0),(cl.x1-cl.x0)*s,(cl.y1-cl.y0)*s);
  x.fillStyle='rgba(120,160,96,.8)';x.fillRect(X(cl.x0+2.6),Y(cl.y0+2.5),(cl.x1-cl.x0-5.2)*s,(cl.y1-cl.y0-5)*s);x.strokeStyle='rgba(60,100,50,.6)';x.lineWidth=.5;
  for(let i=0;i<120;i++){const a=X(cl.x0+2.6+R(i,1,23)*(cl.x1-cl.x0-5.2)),b=Y(cl.y0+2.5+R(i,2,23)*(cl.y1-cl.y0-5));x.beginPath();x.moveTo(a,b);x.lineTo(a-.5,b-1.6);x.moveTo(a,b);x.lineTo(a+.6,b-1.4);x.stroke()}x.restore();
  mpBellsWall(x,X(cl.x0),Y(cl.y0),X(cl.x1),Y(cl.y0),1.6,[[.38,.5]],5);mpBellsWall(x,X(cl.x0),Y(cl.y1),X(cl.x1),Y(cl.y1),1.6,[[.42,.58],[.8,.88]],6);mpBellsWall(x,X(cl.x0),Y(cl.y0),X(cl.x0),Y(cl.y1),1.6,[[.5,.65]],7);mpBellsWall(x,X(cl.x1),Y(cl.y0),X(cl.x1),Y(cl.y1),1.6,[[.15,.3]],8);
  x.fillStyle='#ece4d0';x.strokeStyle=INK;x.lineWidth=.5;
  for(let px=cl.x0+2.6;px<=cl.x1-2.5;px+=1.9)for(const py of [cl.y0+2.5,cl.y1-2.5]){if(R(px*3,py,24)<.12)continue;x.beginPath();x.arc(X(px),Y(py),.85,0,6.3);x.fill();x.stroke()}
  for(let py=cl.y0+2.5;py<=cl.y1-2.4;py+=1.9)for(const px of [cl.x0+2.6,cl.x1-2.6]){if(R(px,py*3,25)<.12)continue;x.beginPath();x.arc(X(px),Y(py),.85,0,6.3);x.fill();x.stroke()}
  {const wx=X(48),wy=Y(45.6);x.fillStyle='#b8b0a0';x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.arc(wx,wy,s*.8,0,6.3);x.fill();x.stroke();x.fillStyle='#2a4a5a';x.beginPath();x.arc(wx,wy,s*.5,0,6.3);x.fill();x.stroke()}
  // the three bell arches (real positions) and a fourth stub of the old gate
  mpBellsArch(x,X(38),Y(34),1.05);mpBellsArch(x,X(57),Y(33),1.05);mpBellsArch(x,X(48),Y(48),1.05);
  // brother aldous: a small figure by the altar, drawn as a gold star mark for a person to talk to
  x.fillStyle=MPL.GOLD2;x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(X(46)+.5,Y(35)+.5,1.5,0,6.3);x.fill();x.stroke();
  x.strokeStyle=INK;x.lineWidth=.9;x.beginPath();x.moveTo(X(46)+.5,Y(35)-3.2);x.lineTo(X(46)+.5,Y(35)-6.6);x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.moveTo(X(46)+.5,Y(35)-6.6);x.lineTo(X(46)+3,Y(35)-5.6);x.lineTo(X(46)+.5,Y(35)-4.6);x.closePath();x.fill();
  // the runestones, bones, the wreck
  for(const d of dec){if(d.k==='yar_runestone'){const a=X(d.x+.5),b=Y(d.y+.6);x.fillStyle='#8a8478';x.strokeStyle=INK;x.lineWidth=.7;x.beginPath();x.moveTo(a-1.8,b+2.2);x.lineTo(a-1.4,b-2.6);x.quadraticCurveTo(a,b-4.4,a+1.4,b-2.6);x.lineTo(a+1.8,b+2.2);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.VERM;x.lineWidth=.6;x.beginPath();x.moveTo(a,b-2.4);x.lineTo(a,b+.8);x.moveTo(a-.8,b-1);x.lineTo(a+.8,b-.2);x.stroke()}
    else if(d.k==='yar_bones'){MPLI.skull(x,X(d.x+.5),Y(d.y+.5),.42)}}
  // the graves: two yards, the old one west of the cloister and a newer one east
  const yard=(x0,y0,x1,y1,seed,n)=>{for(let i=0;i<n;i++){const gx=x0+(i%5)*((x1-x0)/4)+(R(i,seed,31)-.5)*.6,gy=y0+Math.floor(i/5)*((y1-y0)/Math.max(1,Math.ceil(n/5)-1))+(R(i,seed,32)-.5)*.5;if(!land(Math.floor(gx),Math.floor(gy)))continue;mpBellsGrave(x,X(gx),Y(gy),R(i,seed,33)<.5?0:1)}};
  yard(29.5,41,36.5,49,1,15);yard(60,38,67,47,2,15);yard(38,52,44,56,3,6);yard(53,52,58,55,4,6);
  // a low wall round the old yard, in stubs
  mpBellsWall(x,X(28.4),Y(39.8),X(37.4),Y(39.8),1.1,[[.4,.55]],9);mpBellsWall(x,X(28.4),Y(39.8),X(28.4),Y(50),1.1,[[.3,.4],[.7,.8]],10);
  // drowned walls and a sunken colonnade out in the shallows, then a green wash over them to sink them
  {const sk=[];for(let cy=2;cy<HT-2;cy++)for(let cx=2;cx<W-2;cx++){if(f(cx,cy)==='3'&&nearLand(cx,cy,3)&&!nearLand(cx,cy,1)&&R(cx,cy,40)<.05)sk.push([cx,cy])}
    x.save();for(const [cx,cy] of sk){const a=X(cx+.5),b=Y(cy+.5),v=R(cx,cy,41)<.5;x.globalAlpha=.85;x.fillStyle='#8a8a78';x.strokeStyle='rgba(30,40,40,.7)';x.lineWidth=.5;if(R(cx,cy,42)<.45){x.beginPath();x.arc(a,b,1.2,0,6.3);x.fill();x.stroke();x.beginPath();x.arc(a+3,b+(v?.6:-.6),1.1,0,6.3);x.fill();x.stroke()}else{x.fillRect(a-2.6,b-.9,5.2,1.8);x.strokeRect(a-2.6,b-.9,5.2,1.8)}
      x.globalAlpha=.5;x.fillStyle='rgba(150,214,196,1)';x.beginPath();x.ellipse(a+1,b,6,3.4,0,0,6.3);x.fill()}x.restore()}
  // reef rocks and sunken bells in the shallows
  for(let cy=1;cy<HT-1;cy++)for(let cx=1;cx<W-1;cx++){if(f(cx,cy)!=='3'||nearLand(cx,cy,1))continue;const r=R(cx,cy,43);
    if(r<.035){const a=X(cx+.5),b=Y(cy+.5);x.fillStyle='rgba(78,96,84,.85)';x.strokeStyle='rgba(30,40,30,.8)';x.lineWidth=.55;x.beginPath();x.ellipse(a,b,1.8+R(cx,cy,44)*1.4,1.1+R(cx,cy,45)*.8,R(cx,cy,46)*2,0,6.3);x.fill();x.stroke();x.fillStyle='rgba(230,250,236,.7)';x.beginPath();x.ellipse(a-.5,b-.4,.8,.4,0,0,6.3);x.fill();
      x.strokeStyle='rgba(235,250,240,.8)';x.lineWidth=.5;x.beginPath();x.arc(a,b,3.6,.2,2.6);x.stroke()}}
  {const bl=[];for(let cy=2;cy<HT-2;cy++)for(let cx=2;cx<W-2;cx++){if(f(cx,cy)==='3'&&R(cx,cy,47)<.0075&&!nearLand(cx,cy,1))bl.push([cx,cy])}
    for(const [cx,cy] of bl){const a=X(cx+.5),b=Y(cy+.5);x.save();x.strokeStyle='rgba(240,252,244,.8)';x.lineWidth=.5;for(const rr of [4,6.2]){x.beginPath();x.ellipse(a,b+1,rr,rr*.45,0,0,6.3);x.stroke()}x.globalAlpha=.78;mpBellsBell(x,a,b,.9,'#b89a38');x.restore()}
    x.fillStyle=MPL.INK}
  // wave strokes over the sea, thicker in the deep
  for(let i=0;i<520;i++){const cx=R(i,1,50)*W,cy=R(i,2,50)*HT,t=f(Math.floor(cx),Math.floor(cy));if(land(Math.floor(cx),Math.floor(cy)))continue;const a=X(cx),b=Y(cy),w=t==='4'?3.2:2.4;
    x.strokeStyle=t==='4'?'rgba(26,70,86,.62)':'rgba(40,100,104,.5)';x.lineWidth=.6;x.beginPath();x.moveTo(a-w,b);x.quadraticCurveTo(a-w/2,b-1.8,a,b);x.quadraticCurveTo(a+w/2,b+1.8,a+w,b);x.stroke();
    if(i%4===0){x.strokeStyle='rgba(236,250,240,.6)';x.beginPath();x.moveTo(a-w*.6,b+1.6);x.quadraticCurveTo(a,b+.2,a+w*.6,b+1.6);x.stroke()}}
  // the dive buoy: a red and white float over the drowned abbey, with rings
  {const a=X(58.5),b=Y(57.5);x.save();x.strokeStyle='rgba(240,252,244,.85)';x.lineWidth=.6;for(const rr of [4.5,7]){x.beginPath();x.ellipse(a,b+1,rr,rr*.5,0,0,6.3);x.stroke()}
    x.fillStyle='#e8e0d0';x.strokeStyle=INK;x.lineWidth=.7;x.beginPath();x.arc(a,b,2.5,0,6.3);x.fill();x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.arc(a,b,2.5,Math.PI,0);x.fill();x.stroke();x.strokeStyle=INK;x.beginPath();x.moveTo(a,b-2.5);x.lineTo(a,b-5.4);x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(a,b-5.4);x.lineTo(a+3,b-4.6);x.lineTo(a,b-3.8);x.fill();x.restore()}
  // the ship that brought the party, at the end of the jetty: a small hull with a sail, from the side as on a chart
  {const a=X(48.5),b=Y(66.8);x.save();x.fillStyle='rgba(30,70,80,.35)';x.beginPath();x.ellipse(a,b+4,11,2.4,0,0,6.3);x.fill();
    x.fillStyle='#8a5a30';x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-10,b-1);x.lineTo(a+10,b-1);x.lineTo(a+7,b+3.6);x.lineTo(a-7,b+3.6);x.closePath();x.fill();x.stroke();x.strokeStyle='rgba(30,16,8,.5)';x.lineWidth=.4;x.beginPath();x.moveTo(a-8.4,b+1);x.lineTo(a+8.4,b+1);x.stroke();
    x.strokeStyle=INK;x.lineWidth=.9;x.beginPath();x.moveTo(a,b-1);x.lineTo(a,b-14);x.stroke();x.fillStyle='#efe6d0';x.lineWidth=.7;x.beginPath();x.moveTo(a+.8,b-13);x.quadraticCurveTo(a+8,b-8,a+.8,b-3);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(a-.8,b-12);x.quadraticCurveTo(a-6,b-8,a-.8,b-4);x.closePath();x.fill();x.stroke();
    x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(a,b-14);x.lineTo(a+4.4,b-13);x.lineTo(a,b-11.8);x.closePath();x.fill();x.stroke();x.restore()}
  // the old wreck on the north west shore
  {const a=X(30.5),b=Y(36.6);x.save();x.fillStyle='#6a4a2a';x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-8,b+1);x.lineTo(a-4,b-3);x.lineTo(a+6,b-2);x.lineTo(a+9,b+2);x.lineTo(a+3,b+4.4);x.lineTo(a-5,b+4);x.closePath();x.fill();x.stroke();
    x.strokeStyle='rgba(20,10,4,.7)';x.lineWidth=.5;for(let k=-6;k<8;k+=2.4){x.beginPath();x.moveTo(a+k,b-2.4);x.lineTo(a+k-.6,b+3.6);x.stroke()}x.strokeStyle='#3a2210';x.lineWidth=1.1;x.beginPath();x.moveTo(a+1,b-2);x.lineTo(a+2,b-8);x.moveTo(a+1.6,b-6.5);x.lineTo(a+5,b-7.4);x.stroke();x.restore()}
  // the dive buoy and the ship are inks on top of everything; now mist, in long soft bands, thicker towards the edges and thin over the abbey
  x.save();x.beginPath();x.rect(X(0),Y(0),W*s,HT*s);x.clip();
  for(let i=0;i<46;i++){const cx=R(i,1,60)*W,cy=R(i,2,60)*HT,d=Math.hypot((cx-48)/32,(cy-40)/28),a=Math.min(.26,.04+Math.max(0,d-.5)*.34);if(d<.62)continue;
    const mg=x.createRadialGradient(X(cx),Y(cy),0,X(cx),Y(cy),s*(7+R(i,3,60)*10));mg.addColorStop(0,`rgba(238,244,240,${a})`);mg.addColorStop(1,'rgba(238,244,240,0)');x.fillStyle=mg;x.beginPath();x.ellipse(X(cx),Y(cy),s*(9+R(i,3,60)*14),s*(3+R(i,4,60)*3),R(i,5,60)*.3-.15,0,6.3);x.fill()}
  for(let i=0;i<12;i++){const cx=34+R(i,1,62)*30,cy=26+R(i,2,62)*28;const mg=x.createRadialGradient(X(cx),Y(cy),0,X(cx),Y(cy),s*7);mg.addColorStop(0,'rgba(240,244,236,.14)');mg.addColorStop(1,'rgba(240,244,236,0)');x.fillStyle=mg;x.fillRect(X(cx)-s*8,Y(cy)-s*8,s*16,s*16)}
  x.restore();
  // birds: a flock over the tower and gulls over the sea
  x.save();x.strokeStyle=INK;x.lineWidth=.8;for(const [bx,by] of [[64,24],[67,25.6],[65.6,22.4],[69,23.4],[28,22],[31,23],[80,50],[83,52],[12,50],[10,53],[16,62],[72,66],[75,68]]){const a=X(bx),b=Y(by);x.beginPath();x.moveTo(a-3,b-1);x.quadraticCurveTo(a-1.4,b-3,a,b);x.quadraticCurveTo(a+1.4,b-3,a+3,b-1);x.stroke()}x.restore();
  // names
  const T=(t,cx,cy,sz,col)=>api.text(x,t,X(cx),Y(cy),sz||6.4,col||INK,'center');
  T('The Abbey Church',48,28.3,7.2);T('Brother Aldous at the altar',53,40,5.2,'#3a2a1c');T('The Bell Tower',64.2,26.6,5.8,'#5a3410');T('The Cloister',48,52.1,6.6);
  T('The Old Graves',31.6,52,5.8,'#3a3a2a');T('New Graves',66,50,5.6,'#3a3a2a');T('Runestone',35.5,47.2,4.8,'#4a4a3a');T('Runestone',61.2,46.2,4.8,'#4a4a3a');
  T('The Jetty',54.5,64.2,6.2,'#5a3410');T('Your Ship',48.5,71,6.4,MPL.LAPIS);T('Dive Buoy',65,59.6,5.8,MPL.VERM);T('(the Drowned Abbey)',66,62.4,4.8,MPL.VERM);T('Old Wreck',29,32.2,5.8,'#5a3410');
  T('Sunken Bells',20,30,5.8,'#2a5a5a');T('Bell Reef',76,30,6.2,'#2a5a5a');T('The Grey Sea',22,68,6.8,'#24485a');T('The Grey Sea',80,16,6.8,'#24485a');T('The Mist',82,66,6.2,'#3a5a62');
  x.restore();
  // margins: title, key, compass, notes
  api.title(x,'The Isle of Bells','A drowned abbey');
  api.panel(x,8,56,78,138);api.text(x,'Key',47,64,7.2,MPL.VERM,'center');
  const ky=[['Bell arch',()=>mpBellsArch(x,18,75,.9)],
    ['Abbey wall',()=>{x.fillStyle='#d6ccb4';x.strokeStyle='#9a9078';x.lineWidth=1;x.fillRect(12,88,13,3.4);x.strokeRect(12,88,13,3.4)}],
    ['Grave',()=>{mpBellsGrave(x,15,101,0);mpBellsGrave(x,22,101,1)}],
    ['Shallows',()=>{x.fillStyle='rgba(176,226,198,1)';x.fillRect(12,110,13,7);x.strokeStyle='rgba(40,100,104,.7)';x.lineWidth=.6;x.beginPath();x.moveTo(14,114);x.quadraticCurveTo(16,112,18,114);x.quadraticCurveTo(20,116,23,114);x.stroke()}],
    ['Sunken bell',()=>{x.fillStyle='rgba(176,226,198,1)';x.fillRect(12,122,13,10);mpBellsBell(x,18.5,126,.9,'#b89a38')}],
    ['Jetty',()=>{x.fillStyle='#9a6a38';x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(12,138,13,5);x.strokeRect(12,138,13,5);x.strokeStyle='rgba(40,22,10,.7)';x.lineWidth=.5;for(const q of [15,18,21]){x.beginPath();x.moveTo(q,138);x.lineTo(q,143);x.stroke()}}],
    ['Dive buoy',()=>{x.fillStyle='#e8e0d0';x.strokeStyle=INK;x.lineWidth=.7;x.beginPath();x.arc(18.5,154,3.2,0,6.3);x.fill();x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.arc(18.5,154,3.2,Math.PI,0);x.fill();x.stroke()}]];
  const ys=[75,88.5,101,114,127,141,154];
  ky.forEach(([t,fn],i)=>{x.save();fn();x.restore();api.text(x,t,29,ys[i]-(i===0?0:0),6.2,'#3a2a1c','left')});
  api.compass(x,46,236,15);
  api.panel(x,392,40,84,236);
  api.notes(x,['The Isle of Bells is a low island with a ruined abbey on it. Half of the abbey has sunk into the sea.','Three bronze bells hang in broken arches. Brother Aldous waits by the altar in the old church.','The old graves lie west of the cloister and the newer ones lie east of it.','Skeletons, ghosts and spectres walk the island.','The red and white buoy marks the way down to the Drowned Abbey under the water.'],398,50,72,6.2,4);
}});
