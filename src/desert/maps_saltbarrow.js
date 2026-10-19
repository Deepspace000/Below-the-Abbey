/* ==========================================================================
   SALTBARROW: the hand-drawn treasure map of the pirate island (level 300) and of the reef under it (level 320).
   Everything is read from the real levels: the coast and the shallows from the floor map, the hills from the height map, the tents, the wreck, the palms, the pier, the
   beach litter and the marines' camp from the decor, scenery and enemy lists. The reef map marks the nine shell chests that really lie on the seabed.
   ========================================================================== */
/* a smooth wobble that depends only on the position, so neighbouring ink segments join up */
function mpSaltbarrowWob(a,b){return Math.sin(a*1.9+b*2.7)*.17+Math.sin(a*4.3-b*3.1+1)*.08}
/* a 3x3 box blur, n times, edges clamped */
function mpSaltbarrowBlur(f,W,H,n){let a=Float32Array.from(f),b=new Float32Array(f.length);
  for(let k=0;k<n;k++){for(let y=0;y<H;y++)for(let x=0;x<W;x++){let t=0;for(let dy=-1;dy<=1;dy++){const yy=Math.min(H-1,Math.max(0,y+dy));for(let dx=-1;dx<=1;dx++)t+=a[yy*W+Math.min(W-1,Math.max(0,x+dx))]}b[y*W+x]=t/9}const c=a;a=b;b=c}
  return a}
/* distance in cells to the nearest cell where f is 1 (two chamfer passes) */
function mpSaltbarrowDist(f,W,H){const d=new Float32Array(W*H),B=1e3;for(let i=0;i<W*H;i++)d[i]=f[i]>.5?0:B;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;let v=d[i];if(x>0)v=Math.min(v,d[i-1]+1);if(y>0){v=Math.min(v,d[i-W]+1);if(x>0)v=Math.min(v,d[i-W-1]+1.414);if(x<W-1)v=Math.min(v,d[i-W+1]+1.414)}d[i]=v}
  for(let y=H-1;y>=0;y--)for(let x=W-1;x>=0;x--){const i=y*W+x;let v=d[i];if(x<W-1)v=Math.min(v,d[i+1]+1);if(y<H-1){v=Math.min(v,d[i+W]+1);if(x<W-1)v=Math.min(v,d[i+W+1]+1.414);if(x>0)v=Math.min(v,d[i+W-1]+1.414)}d[i]=v}
  return d}
/* marching squares: calls cb(ax,ay,bx,by,cellx,celly) in level cells for every piece of the contour f=thr */
function mpSaltbarrowSegs(f,W,H,thr,cb){
  for(let y=0;y<H-1;y++)for(let x=0;x<W-1;x++){
    const a=f[y*W+x],b=f[y*W+x+1],c=f[(y+1)*W+x+1],d=f[(y+1)*W+x],k=(a>thr?8:0)|(b>thr?4:0)|(c>thr?2:0)|(d>thr?1:0);if(k===0||k===15)continue;
    const L=(p,q)=>(thr-p)/(q-p),
      top=[x+.5+L(a,b),y+.5],right=[x+1.5,y+.5+L(b,c)],bot=[x+.5+L(d,c),y+1.5],left=[x+.5,y+.5+L(a,d)];
    const P={1:[[left,bot]],2:[[bot,right]],3:[[left,right]],4:[[top,right]],5:[[top,left],[bot,right]],6:[[top,bot]],7:[[top,left]],8:[[top,left]],9:[[top,bot]],10:[[top,right],[left,bot]],11:[[top,right]],12:[[left,right]],13:[[bot,right]],14:[[left,bot]]}[k];
    for(const [p,q] of P)cb(p[0],p[1],q[0],q[1],x,y)}}
function mpSaltbarrowSamp(f,W,H,u,v){u=Math.max(0,Math.min(W-1.001,u));v=Math.max(0,Math.min(H-1.001,v));const x=u|0,y=v|0,fx=u-x,fy=v-y,i=y*W+x;
  return (f[i]*(1-fx)+f[i+1]*fx)*(1-fy)+(f[i+W]*(1-fx)+f[i+W+1]*fx)*fy}
/* a palm: curved trunk, a crown of drooping fronds and a few coconuts */
function mpSaltbarrowPalm(x,a,b,s,lean){s=s||1;lean=lean||0;x.save();x.translate(a,b);x.scale(s,s);
  x.strokeStyle='#5a3a1c';x.lineWidth=1.5;x.lineCap='round';x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(lean*1.5,-4,lean*3,-8);x.stroke();
  x.strokeStyle='#caa06a';x.lineWidth=.5;x.beginPath();x.moveTo(.4,0);x.quadraticCurveTo(lean*1.5+.4,-4,lean*3+.4,-8);x.stroke();
  const tx=lean*3,ty=-8;x.strokeStyle=MPL.INK;x.lineWidth=.5;
  for(let k=0;k<7;k++){const an=-Math.PI/2+(k-3)*.62,ex=tx+Math.cos(an)*6.2,ey=ty+Math.sin(an)*4.4+1.6;x.fillStyle=k%2?'#3f7a46':'#5a9a4c';x.beginPath();x.moveTo(tx,ty);x.quadraticCurveTo(tx+Math.cos(an)*4,ty+Math.sin(an)*4.6-1.4,ex,ey);x.quadraticCurveTo(tx+Math.cos(an)*3.4,ty+Math.sin(an)*3.2+.6,tx,ty);x.fill();x.stroke()}
  x.fillStyle='#6a4a22';for(const [dx,dy] of [[-.8,.6],[.9,.7]]){x.beginPath();x.arc(tx+dx,ty+dy,.7,0,6.3);x.fill()}x.restore()}
/* a canvas tent with a dark doorway */
function mpSaltbarrowTent(x,a,b,s,col,col2){s=s||1;x.save();x.translate(a,b);x.scale(s,s);x.fillStyle='rgba(40,26,12,.28)';x.beginPath();x.ellipse(1.2,2.4,6,1.5,0,0,6.3);x.fill();
  x.fillStyle=col||'#eadfc2';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(-6,2);x.lineTo(0,-7);x.lineTo(6,2);x.closePath();x.fill();x.stroke();
  x.fillStyle=col2||MPL.VERM;x.beginPath();x.moveTo(-3,2);x.lineTo(0,-7);x.lineTo(3,2);x.closePath();x.fill();x.stroke();x.fillStyle='#2a1a0c';x.beginPath();x.moveTo(-1.3,2);x.lineTo(0,-2.4);x.lineTo(1.3,2);x.closePath();x.fill();
  x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(0,-7);x.lineTo(0,-9.4);x.stroke();x.restore()}
/* a ship seen from the side: hull, two masts, sails, a flag. o = {hull, flag, flip, wreck} */
function mpSaltbarrowShip(x,a,b,s,o){o=o||{};x.save();x.translate(a,b);x.scale(s*(o.flip?-1:1),s);x.lineJoin='round';
  x.strokeStyle='rgba(40,100,130,.7)';x.lineWidth=.6;for(const [dx,w] of [[-9,4],[-2,5],[7,4]]){x.beginPath();x.moveTo(dx-w,3.6);x.quadraticCurveTo(dx-w/2,2.2,dx,3.6);x.quadraticCurveTo(dx+w/2,5,dx+w,3.6);x.stroke()}
  x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillStyle=o.hull||'#7a4a26';x.beginPath();x.moveTo(-9,-2.6);x.lineTo(-7,-4.8);x.lineTo(-5.6,-2.6);x.lineTo(8,-2.6);x.lineTo(10.6,-4.2);x.lineTo(7,2.4);x.lineTo(-6,2.4);x.closePath();x.fill();x.stroke();
  x.strokeStyle='rgba(240,210,150,.7)';x.lineWidth=.5;x.beginPath();x.moveTo(-6,-.3);x.lineTo(8.4,-.3);x.stroke();
  x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(-2.4,-2.6);x.lineTo(-2.4,-14);x.moveTo(3.6,-2.6);x.lineTo(3.6,-11.6);x.stroke();
  x.fillStyle='#eee4c8';x.lineWidth=.7;
  x.beginPath();x.moveTo(-6.6,-13);x.quadraticCurveTo(-2.4,-11.2,1.8,-13);x.lineTo(1.4,-6.4);x.quadraticCurveTo(-2.4,-5,-6.2,-6.4);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(.4,-10.8);x.quadraticCurveTo(3.6,-9.4,6.8,-10.8);x.lineTo(6.4,-5.6);x.quadraticCurveTo(3.6,-4.6,.6,-5.6);x.closePath();x.fill();x.stroke();
  x.fillStyle=o.flag||'#2a1a0c';x.beginPath();x.moveTo(-2.4,-14);x.lineTo(-2.4,-16.8);x.lineTo(2.2,-15.6);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.VERM;x.fillRect(-1.8,-9.6,1.2,1.2);x.restore()}
/* a wrecked hull on the sand: bare ribs, a broken mast */
function mpSaltbarrowWreck(x,a,b,s){x.save();x.translate(a,b);x.scale(s,s);x.rotate(-.12);x.lineJoin='round';
  x.fillStyle='rgba(40,26,12,.26)';x.beginPath();x.ellipse(1,3.2,10,2,0,0,6.3);x.fill();
  x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillStyle='#6a4a2a';x.beginPath();x.moveTo(-10,-2);x.lineTo(-8,-5);x.lineTo(-6.5,-2);x.lineTo(-2,-2);x.lineTo(1.6,-3.4);x.lineTo(4,-2);x.lineTo(10,-3.4);x.lineTo(7,2.6);x.lineTo(-7,2.6);x.closePath();x.fill();x.stroke();
  x.strokeStyle='#2a1a0c';x.lineWidth=.7;for(let k=-6;k<=7;k+=2.6){x.beginPath();x.moveTo(k,-1.6);x.lineTo(k+.4,2.4);x.stroke()}
  x.lineWidth=1;x.beginPath();x.moveTo(-1,-2.6);x.lineTo(.4,-9);x.lineTo(1.6,-8.2);x.stroke();x.strokeStyle='#e8dcc0';x.lineWidth=.8;x.beginPath();x.moveTo(.6,-8.4);x.lineTo(3.4,-7);x.lineTo(2.4,-5);x.stroke();x.restore()}
/* a gibbet: post, arm, chain and a small iron cage */
function mpSaltbarrowGibbet(x,a,b,s){x.save();x.translate(a,b);x.scale(s,s);x.strokeStyle='#3a2210';x.lineWidth=1.3;x.lineCap='round';x.beginPath();x.moveTo(0,2);x.lineTo(0,-11);x.lineTo(5,-11);x.moveTo(0,-8);x.lineTo(2.4,-11);x.stroke();
  x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.moveTo(4.6,-11);x.lineTo(4.6,-9);x.stroke();x.fillStyle='#8a8a86';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.rect(3,-9,3.2,5);x.fill();x.stroke();
  x.beginPath();x.moveTo(4.6,-9);x.lineTo(4.6,-4);x.moveTo(3,-6.5);x.lineTo(6.2,-6.5);x.stroke();x.restore()}
/* a ship's buoy */
function mpSaltbarrowBuoy(x,a,b,s){x.save();x.translate(a,b);x.scale(s,s);x.strokeStyle='rgba(40,100,130,.7)';x.lineWidth=.6;x.beginPath();x.ellipse(0,2,6,2,0,0,6.3);x.stroke();x.beginPath();x.ellipse(0,2,9,3,0,0,6.3);x.stroke();
  x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillStyle='#f0e8d4';x.beginPath();x.moveTo(-3,2);x.lineTo(-2,-4);x.lineTo(2,-4);x.lineTo(3,2);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(-2.5,-1);x.lineTo(-2,-4);x.lineTo(2,-4);x.lineTo(2.5,-1);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(0,-4);x.lineTo(0,-8);x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(0,-8.6,1.1,0,6.3);x.fill();x.stroke();x.restore()}
/* a hill: a hump with hatching on the shaded side */
function mpSaltbarrowMound(x,a,b,w,h,col){x.save();x.fillStyle=col||'#cdb98e';x.strokeStyle=MPL.INK;x.lineWidth=.75;x.lineJoin='round';
  x.beginPath();x.moveTo(a-w,b);x.quadraticCurveTo(a-w*.45,b-h*1.15,a-w*.05,b-h);x.quadraticCurveTo(a+w*.5,b-h*.95,a+w,b);x.closePath();x.fill();x.stroke();
  x.save();x.clip();x.strokeStyle='rgba(60,40,20,.55)';x.lineWidth=.5;for(let k=0;k<7;k++){const t=a+w*(.05+k*.14);x.beginPath();x.moveTo(t,b-h*(.95-k*.12));x.lineTo(t+w*.12,b);x.stroke()}x.restore();
  x.strokeStyle='rgba(255,248,228,.7)';x.lineWidth=.6;x.beginPath();x.moveTo(a-w*.8,b-h*.2);x.quadraticCurveTo(a-w*.45,b-h*.95,a-w*.1,b-h*.9);x.stroke();x.restore()}
/* a sea serpent: humps out of the water, a crested head, a curled tail. dir=1 faces left */
function mpSaltbarrowSerpent(x,a,b,s,dir){x.save();x.translate(a,b);x.scale(s*(dir?1:-1),s);x.lineJoin='round';x.lineCap='round';
  x.strokeStyle='rgba(40,100,130,.75)';x.lineWidth=.7;for(const [dx,w] of [[-4,5],[10,5],[26,5],[40,4]]){x.beginPath();x.moveTo(dx-w,2);x.quadraticCurveTo(dx,5,dx+w,2);x.stroke()}
  x.fillStyle='#4f8a6a';x.strokeStyle=MPL.INK;x.lineWidth=.9;
  const hump=(c,r)=>{x.beginPath();x.moveTo(c-r,2);x.bezierCurveTo(c-r,-r*1.7,c+r,-r*1.7,c+r,2);x.closePath();x.fill();x.stroke();x.strokeStyle='rgba(20,50,40,.55)';x.lineWidth=.5;for(let k=-2;k<=2;k++){x.beginPath();x.arc(c+k*r*.36,-r*.5+Math.abs(k)*.9,r*.2,0,3.14);x.stroke()}x.strokeStyle=MPL.INK;x.lineWidth=.9};
  hump(10,5.4);hump(26,5);hump(38,3.6);
  x.beginPath();x.moveTo(-8,2);x.bezierCurveTo(-8,-6,-3,-12,-7,-16);x.bezierCurveTo(-3,-17,2,-14,1,-8);x.bezierCurveTo(4,-8,4,-1,3,2);x.closePath();x.fill();x.stroke();
  x.fillStyle='#fff6d0';x.beginPath();x.arc(-4,-13,1.1,0,6.3);x.fill();x.stroke();x.fillStyle=MPL.INK;x.beginPath();x.arc(-4.2,-13,.45,0,6.3);x.fill();
  x.strokeStyle=MPL.VERM;x.lineWidth=.8;x.beginPath();x.moveTo(-8,-15.4);x.lineTo(-11,-15);x.moveTo(-8,-15.4);x.lineTo(-10.4,-16.6);x.stroke();
  x.strokeStyle='#b83a2a';x.lineWidth=.9;for(let k=0;k<4;k++){x.beginPath();x.moveTo(-1+k*1.2,-12+k*2.6);x.lineTo(1.6+k*1.2,-14+k*2.6);x.stroke()}
  x.strokeStyle=MPL.INK;x.lineWidth=.9;x.fillStyle='#4f8a6a';x.beginPath();x.moveTo(43,2);x.bezierCurveTo(46,-4,50,-8,53,-3);x.bezierCurveTo(54,-1,52,1,50,-1);x.bezierCurveTo(50,-4,47,-2,46,2);x.closePath();x.fill();x.stroke();x.restore()}
/* a tentacle rising from the sea in a curl; the width tapers and suckers dot the inside */
function mpSaltbarrowTentacle(x,a,b,len,lean,s,flip){const N=22;
  const P=[];let px=a,py=b,ang=-Math.PI/2;for(let i=0;i<=N;i++){const t=i/N;ang=-Math.PI/2+(flip?-1:1)*lean*t*t*2.6+Math.sin(t*7)*.09;P.push([px,py,ang]);px+=Math.cos(ang)*len/N;py+=Math.sin(ang)*len/N}
  const Lp=[],Rp=[];P.forEach(([qx,qy,an],i)=>{const w=(3.1*(1-i/N)+.45)*s,nx=-Math.sin(an),ny=Math.cos(an);Lp.push([qx+nx*w,qy+ny*w]);Rp.push([qx-nx*w,qy-ny*w])});
  x.save();x.fillStyle='#a8503a';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.lineJoin='round';x.beginPath();x.moveTo(Lp[0][0],Lp[0][1]);for(const p of Lp)x.lineTo(p[0],p[1]);for(let i=N;i>=0;i--)x.lineTo(Rp[i][0],Rp[i][1]);x.closePath();x.fill();x.stroke();
  x.fillStyle='#f0d8b0';for(let i=2;i<N-1;i+=2){const [qx,qy,an]=P[i],w=(3.1*(1-i/N)+.45)*s*.35;x.beginPath();x.arc(qx,qy,Math.max(.35,w),0,6.3);x.fill()}
  x.strokeStyle='rgba(40,100,130,.8)';x.lineWidth=.7;x.beginPath();x.ellipse(a,b+1,4.4*s,1.5*s,0,0,6.3);x.stroke();x.restore()}
/* a small clump of lapping waves, drawn like a pen stroke */
function mpSaltbarrowWaves(x,a,b,s,al){x.save();x.strokeStyle=`rgba(30,80,120,${al||.6})`;x.lineWidth=.7;x.lineCap='round';x.beginPath();x.moveTo(a-4*s,b);x.quadraticCurveTo(a-2.5*s,b-2*s,a-1*s,b);x.quadraticCurveTo(a+.5*s,b+2*s,a+2*s,b);x.quadraticCurveTo(a+3.5*s,b-1.6*s,a+5*s,b-.2*s);x.stroke();
  x.beginPath();x.moveTo(a-2*s,b+2.6*s);x.quadraticCurveTo(a-.5*s,b+1*s,a+1*s,b+2.6*s);x.stroke();x.restore()}
/* a gull as two arcs */
function mpSaltbarrowGull(x,a,b,s){x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.moveTo(a-3*s,b-1*s);x.quadraticCurveTo(a-1.4*s,b-3*s,a,b);x.quadraticCurveTo(a+1.4*s,b-3*s,a+3*s,b-1*s);x.stroke()}
/* a pirate flag: a small pole with a black flag and a skull */
function mpSaltbarrowFlag(x,a,b,s){x.save();x.translate(a,b);x.scale(s,s);x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(0,2);x.lineTo(0,-11);x.stroke();x.fillStyle='#231a14';x.beginPath();x.moveTo(0,-11);x.quadraticCurveTo(3.2,-12.4,6.4,-10.8);x.lineTo(6.4,-5.6);x.quadraticCurveTo(3.2,-7.2,0,-5.6);x.closePath();x.fill();x.stroke();
  x.fillStyle='#f4ead0';x.beginPath();x.arc(3.2,-8.9,1.4,0,6.3);x.fill();x.fillRect(2.4,-7.7,1.6,.9);x.fillStyle='#231a14';x.fillRect(2.3,-9.2,.6,.6);x.fillRect(3.5,-9.2,.6,.6);x.restore()}
/* a crate and a barrel, from the side */
function mpSaltbarrowCrate(x,a,b){x.fillStyle='#b8884a';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-2.2,b-2.2,4.4,4.4);x.strokeRect(a-2.2,b-2.2,4.4,4.4);x.beginPath();x.moveTo(a-2.2,b-2.2);x.lineTo(a+2.2,b+2.2);x.moveTo(a+2.2,b-2.2);x.lineTo(a-2.2,b+2.2);x.stroke()}
/* a skull with crossed bones */
function mpSaltbarrowBones(x,a,b,s){x.save();x.translate(a,b);x.scale(s,s);x.strokeStyle='#e8dcc0';x.lineWidth=1.5;x.lineCap='round';x.beginPath();x.moveTo(-4,3);x.lineTo(4,-.5);x.moveTo(4,3);x.lineTo(-4,-.5);x.stroke();x.strokeStyle=MPL.INK;x.lineWidth=.4;x.beginPath();x.moveTo(-4,3);x.lineTo(4,-.5);x.moveTo(4,3);x.lineTo(-4,-.5);x.stroke();x.restore();MPLI.skull(x,a,b-1.4*s,s*.62)}

/* the island map is zoomed in on cells x 10..90, y 4..76 (the rest is open sea), so the island fills the frame */
function mpSaltbarrowFit(L){const A=MPL.AREA,cw=80,ch=72,s=Math.min((A.w-8)/cw,(A.h-8)/ch),ox=A.x+(A.w-cw*s)/2-10*s,oy=A.y+(A.h-ch*s)/2-4*s;return {s,ox,oy,X:q=>ox+q*s,Y:q=>oy+q*s}}
/* ---- level 300: the island ---- */
mplInstall({name:'saltbarrow',levels:[300],fit:mpSaltbarrowFit,foot:'You are the yellow arrow. Saltbarrow, the pirate island.',tint:[-4,2,4],
draw(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,S=mpSaltbarrowFit(L),s=S.s,X=S.X,Y=S.Y,Hh=hash2,INK=MPL.INK,fm=L.fmap,T=TERRS[300],Z=s/2.9;
  x.save();x.beginPath();x.rect(MPL.AREA.x,MPL.AREA.y,MPL.AREA.w,MPL.AREA.h);x.clip();
  const land=new Float32Array(W*H),shal=new Float32Array(W*H),grass=new Float32Array(W*H);
  for(let y=0;y<H;y++)for(let q=0;q<W;q++){const ch=fm[y][q],i=y*W+q;if(ch!=='4'&&ch!=='3')land[i]=1;if(ch!=='4')shal[i]=1;if(ch==='1'||ch==='5')grass[i]=1}
  const fL=mpSaltbarrowBlur(land,W,H,2),fS=mpSaltbarrowBlur(shal,W,H,2),fG=mpSaltbarrowBlur(grass,W,H,2),D=mpSaltbarrowBlur(mpSaltbarrowDist(shal,W,H),W,H,1);
  // the painted ground, one soft raster: deep sea, shallows, wet sand, dry sand, grass and the shaded hills
  {const R=5,iw=W*R,ih=H*R,cv=document.createElement('canvas');cv.width=iw;cv.height=ih;const cx=cv.getContext('2d'),id=cx.createImageData(iw,ih),d=id.data;
    for(let py=0;py<ih;py++)for(let px=0;px<iw;px++){
      const u=(px+.5)/R-.5,v=(py+.5)/R-.5,l=mpSaltbarrowSamp(fL,W,H,u,v),sh=mpSaltbarrowSamp(fS,W,H,u,v),k=(py*iw+px)*4;let r,g,b,a;
      if(l>.5){const g0=mpSaltbarrowSamp(fG,W,H,u,v),hh=mpSaltbarrowSamp(T.h,W,H,u,v),shd=mpSaltbarrowSamp(T.s,W,H,u,v),n=Hh(px>>2,py>>2,5)*8-4;
        r=240;g=219;b=156;if(l<.6){r=214;g=186;b=124}
        if(g0>.42){const m=Math.min(1,(g0-.42)*2.6);r+=(142-r)*m;g+=(170-g)*m;b+=(96-b)*m}
        if(hh>1.5){const m=Math.min(1,(hh-1.5)*.9);r+=(186-r)*m;g+=(166-g)*m;b+=(132-b)*m}
        const kk=.62+.5*shd;r=r*kk+n;g=g*kk+n;b=b*kk+n;a=245}
      else if(sh>.5){const t=Math.min(1,(l-.1)*2.2);r=150+t*34;g=212+t*14;b=200+t*4;a=205;if(l<.1){r=146;g=206;b=200}}
      else{const dd=mpSaltbarrowSamp(D,W,H,u,v),t=Math.min(1,dd/16),n=Hh(px>>3,py>>3,6)*10-5;r=130-t*52+n;g=180-t*52+n;b=196-t*38+n;a=150+t*50}
      d[k]=Math.max(0,Math.min(255,r));d[k+1]=Math.max(0,Math.min(255,g));d[k+2]=Math.max(0,Math.min(255,b));d[k+3]=a}
    cx.putImageData(id,0,0);x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(cv,X(0),Y(0),W*s,H*s)}
  const seg=(col,lw,skip,seed,off)=>(ax,ay,bx,by,cx,cy)=>{if(skip&&Hh(cx,cy,seed)<skip)return;x.strokeStyle=col;x.lineWidth=lw;x.beginPath();x.moveTo(X(ax)+mpSaltbarrowWob(ax,ay)*1.2,Y(ay)+mpSaltbarrowWob(ay,ax)*1.2);x.lineTo(X(bx)+mpSaltbarrowWob(bx,by)*1.2,Y(by)+mpSaltbarrowWob(by,bx)*1.2);x.stroke()};
  x.save();x.lineCap='round';
  // ripples in the open sea, far to near, broken lines
  for(const [t,al,lw,sk] of [[15,.16,.5,.5],[11,.22,.55,.45],[7.5,.3,.6,.4],[4.6,.4,.65,.32],[2.3,.5,.7,.25]])mpSaltbarrowSegs(D,W,H,t,seg(`rgba(30,86,124,${al})`,lw,sk,70+t|0));
  // the surf: a foam line along the edge of the shallows, then a ruled blue line over it
  mpSaltbarrowSegs(fS,W,H,.5,seg('rgba(255,255,255,.7)',2.2,.18,81));
  mpSaltbarrowSegs(fS,W,H,.5,seg('rgba(40,100,140,.8)',.7,.12,82));
  // breakers on the sea side: short curved strokes
  mpSaltbarrowSegs(fL,W,H,.18,(ax,ay,bx,by,cx,cy)=>{if(Hh(cx,cy,83)<.55)return;const a=X(ax),b=Y(ay),a2=X(bx),b2=Y(by);x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=1;x.beginPath();x.moveTo(a,b);x.lineTo(a2,b2);x.stroke()});
  // the coast itself, in ink, with a lighter second pass beside it
  mpSaltbarrowSegs(fL,W,H,.5,seg('rgba(120,86,44,.55)',2,0,84));
  mpSaltbarrowSegs(fL,W,H,.5,seg(INK,.95,0,85));
  x.restore();
  // dry-sand stipple, tufts of grass, rubble: hundreds of small marks
  for(let i=0;i<1700;i++){const u=1+Hh(i,1,10)*(W-2),v=1+Hh(i,2,10)*(H-2),l=mpSaltbarrowSamp(fL,W,H,u-.5,v-.5);if(l<.62)continue;const g=mpSaltbarrowSamp(fG,W,H,u-.5,v-.5),a=X(u),b=Y(v);
    if(g<.4){x.fillStyle=i%3?'rgba(120,84,44,.5)':'rgba(255,246,214,.7)';x.fillRect(a,b,.9,.8)}
    else if(i%2){x.strokeStyle='rgba(54,92,52,.75)';x.lineWidth=.55;x.beginPath();x.moveTo(a-1.2,b);x.lineTo(a-.4,b-2.2);x.moveTo(a,b);x.lineTo(a,b-2.6);x.moveTo(a+1.2,b);x.lineTo(a+.4,b-2);x.stroke()}}
  // lines on the shallow water: the old map-maker's way of showing a shoal
  x.strokeStyle='rgba(40,110,140,.42)';x.lineWidth=.45;for(let i=0;i<900;i++){const u=1+Hh(i,1,11)*(W-2),v=1+Hh(i,2,11)*(H-2);if(mpSaltbarrowSamp(fS,W,H,u-.5,v-.5)<.55||mpSaltbarrowSamp(fL,W,H,u-.5,v-.5)>.3)continue;const a=X(u),b=Y(v);x.beginPath();x.moveTo(a-1.6,b);x.lineTo(a+1.6,b);x.stroke()}
  // the hills, from the real height map: back to front
  const mounds=[];for(let gy=5;gy<H-3;gy+=3)for(let gx=5;gx<W-3;gx+=3){const u=gx+(Hh(gx,gy,20)-.5)*2.4,v=gy+(Hh(gx,gy,21)-.5)*2.4,h=T.h[(v|0)*W+(u|0)];if(h>1.3&&fm[v|0][u|0]!=='4'&&fm[v|0][u|0]!=='3')mounds.push([u,v,h])}
  mounds.sort((p,q)=>p[1]-q[1]);
  for(const [u,v,h] of mounds){const w=(2.6+Math.min(1.6,(h-1.3)*1.1))*(s/2.9)*1.15,hh=w*(.62+Math.min(.9,(h-1.3)*.5));mpSaltbarrowMound(x,X(u),Y(v)+hh*.35,w*1.7,hh*1.7,h>2.3?'#b9a67c':h>1.8?'#cdb78a':'#dccb9c')}
  // the highest ground
  let pk=[0,0,-9];for(let y=0;y<H;y++)for(let q=0;q<W;q++)if(T.h[y*W+q]>pk[2])pk=[q,y,T.h[y*W+q]];
  // the grass is thicker in the lee of the hills: bushes from the real scenery list, then flowers and gull posts
  const sc=L.scenery||[];
  for(const q of sc){const a=X(q.wx),b=Y(q.wy),k=q.k;
    if(k==='lbush0'){x.fillStyle='#4a7a46';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.arc(a,b-.8,1.7,0,6.3);x.arc(a+1.5,b,1.3,0,6.3);x.fill();x.stroke();x.fillStyle='#7ab05a';x.beginPath();x.arc(a-.4,b-1.4,.6,0,6.3);x.fill()}
    else if(k.startsWith('pgrass')){if(Hh(q.wx,q.wy,30)<.45)continue;x.strokeStyle='rgba(44,88,48,.85)';x.lineWidth=.55;x.beginPath();x.moveTo(a,b);x.lineTo(a-1.5,b-2.6);x.moveTo(a,b);x.lineTo(a+1.5,b-2.4);x.moveTo(a,b);x.lineTo(a,b-3);x.stroke()}
    else if(k.startsWith('pflw')){x.fillStyle=['#c8402e','#e8d050','#f0e8f0','#6a7ac8','#d88aa8','#e8a040'][(q.wx*7+q.wy|0)%6];x.beginPath();x.arc(a,b,.9,0,6.3);x.fill()}
    else if(k==='yar_driftwood'){x.strokeStyle='#6a4a2a';x.lineWidth=1.2;x.lineCap='round';x.beginPath();x.moveTo(a-2.6,b+.6);x.quadraticCurveTo(a,b-1.4,a+2.8,b+.2);x.stroke();x.strokeStyle='#d8b880';x.lineWidth=.4;x.beginPath();x.moveTo(a-2.4,b+.2);x.quadraticCurveTo(a,b-1.8,a+2.6,b-.2);x.stroke();x.lineCap='butt'}
    else if(k==='yar_shells'){x.fillStyle='#f4e4d4';x.strokeStyle='rgba(120,80,60,.8)';x.lineWidth=.4;x.beginPath();x.arc(a,b,1.1,Math.PI,0);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(a,b);x.lineTo(a,b-1.1);x.stroke()}
    else if(k==='yar_crab'){x.fillStyle='#c8502e';x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.ellipse(a,b,1.5,1,0,0,6.3);x.fill();x.stroke();x.beginPath();x.moveTo(a-1.4,b-.6);x.lineTo(a-2.4,b-1.8);x.moveTo(a+1.4,b-.6);x.lineTo(a+2.4,b-1.8);x.stroke()}
    else if(k==='yar_gull_stand'){x.fillStyle='#f2ede0';x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.ellipse(a,b,1.5,.9,0,0,6.3);x.fill();x.stroke();x.fillStyle='#d8a030';x.fillRect(a+1.4,b-.5,.9,.5)}
    else if(k==='uw_rocks'||k==='yar_rocks'){x.fillStyle='#a69a84';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.ellipse(a,b,2,1.4,0,0,6.3);x.fill();x.stroke()}}
  // palms, by depth
  const dec=L.decor||[],palms=[];for(const d of dec){if(/^dpalm/.test(d.k)||d.k==='yar_palms'||/^ltree/.test(d.k))palms.push(d)}
  palms.sort((p,q)=>p.y-q.y);
  for(const d of palms){const a=X(d.x+.5),b=Y(d.y+.9),sc=(d.sc||1)*.52*(d.k==='yar_palms'?1.15:1);mpSaltbarrowPalm(x,a,b,sc*(s/2.9)*1.2,(Hh(d.x,d.y,31)-.5)*1.8);if(d.k==='yar_palms')mpSaltbarrowPalm(x,a+3.2,b+1,sc*.8,(Hh(d.x,d.y,32)-.5)*1.8)}
  // the pier: planks, posts, mooring ropes
  const pl=[];for(let y=0;y<H;y++)for(let q=0;q<W;q++)if(fm[y][q]==='2')pl.push([q,y]);
  if(pl.length){const x0=Math.min(...pl.map(p=>p[0])),x1=Math.max(...pl.map(p=>p[0]))+1,y0=Math.min(...pl.map(p=>p[1])),y1=Math.max(...pl.map(p=>p[1]))+1;
    x.fillStyle='rgba(40,26,12,.3)';x.fillRect(X(x0)+1.4,Y(y0)+1.4,(x1-x0)*s,(y1-y0)*s);x.fillStyle='#a87a44';x.strokeStyle=INK;x.lineWidth=.8;x.fillRect(X(x0),Y(y0),(x1-x0)*s,(y1-y0)*s);x.strokeRect(X(x0),Y(y0),(x1-x0)*s,(y1-y0)*s);
    x.strokeStyle='rgba(50,28,10,.7)';x.lineWidth=.45;for(let yy=y0;yy<y1;yy+=.42){x.beginPath();x.moveTo(X(x0),Y(yy));x.lineTo(X(x1),Y(yy));x.stroke()}
    x.fillStyle='#3a2210';for(const [px,py] of [[x0,y0],[x1,y0],[x0,y1],[x1,y1],[x0,(y0+y1)/2],[x1,(y0+y1)/2]]){x.beginPath();x.arc(X(px),Y(py),1,0,6.3);x.fill()}}
  // Sable Maeve's camp: tents, crates and the black flag
  const tents=dec.filter(d=>d.k==='yar_tent').sort((p,q)=>p.y-q.y),tc=[['#eadfc2',MPL.VERM],['#e8dcc0','#2f5a8a'],['#eadfc2','#2a2a2a'],['#e8dcc0','#c9a227']];
  tents.forEach((d,i)=>mpSaltbarrowTent(x,X(d.x+.5),Y(d.y+.9),1.05*Z,tc[i%4][0],tc[i%4][1]));
  for(const d of dec)if(d.k==='yar_crates')mpSaltbarrowCrate(x,X(d.x+.5),Y(d.y+.6));
  const mae=dec.find(d=>d.npc==='sb_maeve');if(mae){mpSaltbarrowFlag(x,X(mae.x+.5),Y(mae.y+.5),1.1*Z);api.I.star(x,X(mae.x+2.1),Y(mae.y+.3),.5,MPL.GOLD)}
  for(const d of dec){if(d.npc==='sb_cook'||d.npc==='sb_hand'){x.fillStyle=MPL.INK;x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),.9,0,6.3);x.fill()}}
  // the cook's fire, between the tents
  {const ck=dec.find(d=>d.npc==='sb_cook');if(ck){const a=X(ck.x-.8),b=Y(ck.y+.8);x.fillStyle='#e8742a';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-1.4,b+1);x.quadraticCurveTo(a-1.6,b-1,a,b-3);x.quadraticCurveTo(a+1.6,b-1,a+1.4,b+1);x.closePath();x.fill();x.stroke();x.strokeStyle='rgba(90,80,70,.5)';x.beginPath();x.moveTo(a,b-3.4);x.bezierCurveTo(a-2,b-5,a+2,b-6,a,b-8);x.stroke()}}
  // the wreck and the bones
  const wr=dec.find(d=>d.k==='yar_wreck'&&!d.npc);if(wr)mpSaltbarrowWreck(x,X(wr.x+.5),Y(wr.y+.6),1.15*Z);
  const bn=dec.find(d=>d.k==='yar_bones');if(bn){mpSaltbarrowBones(x,X(bn.x+.5),Y(bn.y+.8),1.05*Z);mpSaltbarrowGibbet(x,X(bn.x+2.3),Y(bn.y+.9),Z)}
  // the marines' camp: the bandits and archers stand in the north east, so the camp is drawn there, blue and white
  const en=(L.enemies||[]).filter(e=>e.t==='bandit'),mc=en.length?[en.reduce((t,e)=>t+e.x,0)/en.length,en.reduce((t,e)=>t+e.y,0)/en.length]:null;
  if(mc){const cs=[[-3.2,-1.6],[0,1.6],[3.4,-.8]];cs.forEach(([dx,dy],i)=>mpSaltbarrowTent(x,X(mc[0]+dx),Y(mc[1]+dy),.95*Z,'#e4e0d0','#3a5a9a'));mpSaltbarrowFlag(x,X(mc[0]+.2),Y(mc[1]-2.4),.9*Z);
    x.fillStyle='#3a5a9a';x.fillRect(X(mc[0]+.2)+.4,Y(mc[1]-2.4)-9.8,5,1.2);
    x.strokeStyle='rgba(90,80,70,.5)';x.lineWidth=.7;x.beginPath();x.moveTo(X(mc[0]+1.6),Y(mc[1]+3.2));x.bezierCurveTo(X(mc[0]+.4),Y(mc[1]+2),X(mc[0]+2.6),Y(mc[1]+1),X(mc[0]+1.6),Y(mc[1]-.4));x.stroke()}
  // the buoy where the divers go down, the Dawn Walker at the pier and the Heron out at sea
  const by=dec.find(d=>d.npc==='uw_dive_300');if(by)mpSaltbarrowBuoy(x,X(by.x+.5),Y(by.y+.6),1.1*Z);
  const dw=dec.find(d=>d.k==='yar_ship_dawn');if(dw)mpSaltbarrowShip(x,X(dw.x+.5),Y(dw.y+.5),1.25*Z,{hull:'#6a3a1e',flag:MPL.VERM});
  const hr=dec.find(d=>d.k==='yar_ship_heron');if(hr)mpSaltbarrowShip(x,X(hr.x+.5),Y(hr.y+.5),1.1*Z,{hull:'#4a3a5a',flag:'#2a1a0c',flip:1});
  // ships far out, a sea serpent and tentacles in the empty sea
  mpSaltbarrowShip(x,X(12),Y(18),.85*Z,{hull:'#5a3a22',flag:MPL.LAPIS});
  mpSaltbarrowShip(x,X(90),Y(66),.8*Z,{hull:'#7a4a26',flag:MPL.VERM,flip:1});
  mpSaltbarrowSerpent(x,X(12),Y(72),.62*Z,1);
  mpSaltbarrowTentacle(x,X(86),Y(12),22*Z,1.1,Z,false);mpSaltbarrowTentacle(x,X(89.4),Y(13.2),16*Z,.9,.9*Z,true);mpSaltbarrowTentacle(x,X(82.4),Y(13.4),14*Z,1.2,.8*Z,false);
  for(const [gx,gy] of [[30,14],[33,13],[31.4,16],[70,70],[73,72],[22,60],[78,24],[82,26]])mpSaltbarrowGull(x,X(gx),Y(gy),1);
  // waves scattered over the deep water
  for(let i=0;i<340;i++){const u=1+Hh(i,1,40)*(W-2),v=1+Hh(i,2,40)*(H-2);if(mpSaltbarrowSamp(D,W,H,u-.5,v-.5)<5.5)continue;if(Math.hypot(u-12,v-72)<8||Math.hypot(u-88,v-12)<9||Math.hypot(u-12,v-18)<7||Math.hypot(u-90,v-66)<7||Math.hypot(u-50,v-64)<9||Math.hypot(u-86,v-32)<7)continue;mpSaltbarrowWaves(x,X(u),Y(v),.55+Hh(i,3,40)*.5,.55)}
  // names: the places, the sea, the camps
  const T2=(t,u,v,sz,col)=>api.text(x,t,X(u),Y(v),sz||6.6,col||INK,'center');
  T2("Sable Maeve's Camp",48,52,6.8,'#4a1a10');T2('The Wreck',34.5,40.2,6.2);T2('Bone Point',63,36.6,6.2);T2("Corvane's Marines",69.2,45.4,6.4,'#2a3a7a');
  T2('The Pier',40.2,57.6,6.2,'#5a3410');T2('The Dawn Walker',50,70.2,6.4,'#4a1a10');T2('Dive Buoy: down to the reef',66,59.6,5.8,MPL.LAPIS);T2('The Heron',86,38.4,6);
  T2('The Barrow',pk[0],pk[1]-6.4,7,'#3a2a1c');T2('The Central Hills',50,33.6,6.2,'#3a2a1c');T2('The Palm Shore',58.5,25.4,6,'#2a4a2c');
  x.save();try{x.letterSpacing='3px'}catch(e){}api.text(x,'SALTBARROW',X(50),Y(74.6),9.5,'#1a3a6a','center');api.text(x,'THE VAAST SEA',X(25),Y(7),7.2,'#2a5a8a','center');x.restore();
  T2('Sea serpents',17,67.4,5.8,'#2a5a4a');T2('Here be krakens',85,20.2,5.8,'#7a2a1a');
  x.restore();
  // margins: title, key, compass, notes
  api.title(x,'Saltbarrow','A pirate haven');
  api.panel(x,8,56,78,132);api.text(x,'Key',47,64,7.2,MPL.VERM,'center');
  const ky=[['Pirate tent',()=>mpSaltbarrowTent(x,18,79,.8)],['Palm',()=>mpSaltbarrowPalm(x,18,92,.65)],['Hill',()=>mpSaltbarrowMound(x,18,107,6,5.5)],['Wreck',()=>mpSaltbarrowWreck(x,18,121,.8)],['Ship',()=>mpSaltbarrowShip(x,18,134,.7)],['Pier',()=>{x.fillStyle='#a87a44';x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(12,144,13,6);x.strokeRect(12,144,13,6)}],
    ['Shallows',()=>{x.fillStyle='rgba(150,212,200,1)';x.strokeStyle='rgba(40,100,140,.8)';x.lineWidth=.7;x.fillRect(12,158,13,6);x.strokeRect(12,158,13,6)}],['Dive buoy',()=>mpSaltbarrowBuoy(x,18,178,.7)]];
  ky.forEach(([t,f],i)=>{x.save();f();x.restore();api.text(x,t,30,76+i*13.7,6.2,'#3a2a1c','left')});
  api.compass(x,46,236,15);
  api.panel(x,392,40,84,236);
  api.notes(x,['Saltbarrow is a sandy island with a ridge of hills in the middle. Pirates hold it.','Sable Maeve, the pirate queen, has her camp on the south side, close to the pier.','The Dawn Walker is tied up at the end of the pier.','Corvane\'s marines are camped along the north and east shore.','A buoy off the south shore marks the way down to the reef.'],398,50,72,6.2,4);
}});

/* ---- level 320: the reef under the island ---- */
mplInstall({name:'saltbarrowreef',levels:[320],foot:'You are the yellow arrow. The Saltbarrow Reef, under the sea. Red crosses mark shell chests.',tint:[-6,4,8],
draw(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,S=api.fit(W,H),s=S.s,X=S.X,Y=S.Y,Hh=hash2,INK=MPL.INK,fm=L.fmap;
  const rock=new Float32Array(W*H),cls=new Float32Array(W*H);
  for(let y=0;y<H;y++)for(let q=0;q<W;q++){const ch=fm[y][q],i=y*W+q;if(ch==='5'||L.rows[y][q]==='D')rock[i]=1;cls[i]=ch==='5'?1.5:+ch}
  const fR=mpSaltbarrowBlur(rock,W,H,2),fC=mpSaltbarrowBlur(cls,W,H,3),dR=mpSaltbarrowBlur(mpSaltbarrowDist(rock,W,H),W,H,1);
  {const R=4,iw=W*R,ih=H*R,cv=document.createElement('canvas');cv.width=iw;cv.height=ih;const cx=cv.getContext('2d'),id=cx.createImageData(iw,ih),d=id.data;
    const tint=[[168,206,184],[150,200,190],[188,206,168],[206,208,166]];
    for(let py=0;py<ih;py++)for(let px=0;px<iw;px++){const u=(px+.5)/R-.5,v=(py+.5)/R-.5,r0=mpSaltbarrowSamp(fR,W,H,u,v),k=(py*iw+px)*4;let r,g,b;
      if(r0>.5){const n=Hh(px>>2,py>>2,7)*14-7,t=Math.min(1,(r0-.5)*2);r=112+n+t*10;g=124+n+t*8;b=140+n;if(Hh(px>>3,py>>3,9)<.2){r-=10;g-=8}}
      else{const cv2=mpSaltbarrowSamp(fC,W,H,u,v),i0=Math.max(0,Math.min(2,Math.floor(cv2))),f=Math.max(0,Math.min(1,cv2-i0)),A=tint[i0],B=tint[Math.min(3,i0+1)],n=Hh(px>>2,py>>2,8)*8-4,dd=mpSaltbarrowSamp(dR,W,H,u,v),dk=Math.max(0,1-dd/10)*26;r=A[0]+(B[0]-A[0])*f+n-dk;g=A[1]+(B[1]-A[1])*f+n-dk*.6;b=A[2]+(B[2]-A[2])*f+n-dk*.2}
      d[k]=r;d[k+1]=g;d[k+2]=b;d[k+3]=235}
    cx.putImageData(id,0,0);x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(cv,X(0),Y(0),W*s,H*s)}
  const seg=(col,lw,skip,seed)=>(ax,ay,bx,by,cx,cy)=>{if(skip&&Hh(cx,cy,seed)<skip)return;x.strokeStyle=col;x.lineWidth=lw;x.beginPath();x.moveTo(X(ax)+mpSaltbarrowWob(ax,ay)*1.1,Y(ay)+mpSaltbarrowWob(ay,ax)*1.1);x.lineTo(X(bx)+mpSaltbarrowWob(bx,by)*1.1,Y(by)+mpSaltbarrowWob(by,bx)*1.1);x.stroke()};
  x.save();x.lineCap='round';mpSaltbarrowSegs(dR,W,H,2.2,seg('rgba(40,70,90,.3)',.5,.35,50));mpSaltbarrowSegs(dR,W,H,4.4,seg('rgba(40,70,90,.2)',.5,.45,51));
  mpSaltbarrowSegs(fR,W,H,.5,seg('rgba(60,70,84,.55)',2.2,0,52));mpSaltbarrowSegs(fR,W,H,.5,seg(INK,1,0,53));x.restore();
  // cliff hatching on the rock edges
  x.strokeStyle='rgba(30,36,48,.5)';x.lineWidth=.45;for(let i=0;i<1100;i++){const u=1+Hh(i,1,60)*(W-2),v=1+Hh(i,2,60)*(H-2),r0=mpSaltbarrowSamp(fR,W,H,u-.5,v-.5);if(r0<.5)continue;if(r0>.92&&i%3)continue;const a=X(u),b=Y(v);x.beginPath();x.moveTo(a,b);x.lineTo(a+1.2,b+2.6);x.stroke()}
  for(let i=0;i<260;i++){const u=Hh(i,1,67)*W,v=Hh(i,2,67)*H;if(mpSaltbarrowSamp(fR,W,H,u-.5,v-.5)<.95)continue;const a=X(u),b=Y(v);x.fillStyle=i%2?'rgba(86,96,112,.8)':'rgba(150,160,172,.7)';x.strokeStyle='rgba(30,36,48,.7)';x.lineWidth=.45;x.beginPath();x.ellipse(a,b,1.3+Hh(i,3,67)*1.6,.9+Hh(i,4,67),0,0,6.3);x.fill();x.stroke()}
  // sand ripples
  x.strokeStyle='rgba(70,100,100,.4)';x.lineWidth=.45;for(let i=0;i<1400;i++){const u=1+Hh(i,1,61)*(W-2),v=1+Hh(i,2,61)*(H-2);if(mpSaltbarrowSamp(fR,W,H,u-.5,v-.5)>.45)continue;const a=X(u),b=Y(v);x.beginPath();x.moveTo(a-1.6,b);x.quadraticCurveTo(a,b-1,a+1.6,b);x.stroke()}
  // the weed: kelp, sea grass, fans, soft coral, anemones, sampled from the real scenery (one mark in several)
  const sc=L.scenery||[];
  for(const q of sc){const a=X(q.wx),b=Y(q.wy),k=q.k,r=Hh(q.wx,q.wy,62);
    if(k==='uw_kelp'){if(r<.5)continue;x.strokeStyle='#3a7a3a';x.lineWidth=.8;x.beginPath();x.moveTo(a,b);x.bezierCurveTo(a-1.6,b-2,a+1.6,b-4,a,b-6.4);x.stroke();x.strokeStyle='#5aa44a';x.lineWidth=.4;x.beginPath();x.moveTo(a+.5,b);x.bezierCurveTo(a-1,b-2,a+2,b-4,a+.6,b-5.6);x.stroke()}
    else if(k==='uw_seagrass'){if(r<.7)continue;x.strokeStyle='#4a8a4a';x.lineWidth=.5;x.beginPath();x.moveTo(a-1,b);x.lineTo(a-1.6,b-2.4);x.moveTo(a,b);x.lineTo(a,b-3);x.moveTo(a+1,b);x.lineTo(a+1.6,b-2.4);x.stroke()}
    else if(k==='uw_seafan'){if(r<.55)continue;x.fillStyle=r<.78?'#d8688a':'#c850a0';x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.moveTo(a,b);x.lineTo(a-2.2,b-3.6);x.quadraticCurveTo(a,b-5,a+2.2,b-3.6);x.closePath();x.fill();x.stroke()}
    else if(k==='uw_softcoral'){if(r<.6)continue;x.fillStyle=r<.8?'#e8946a':'#e8b84a';x.beginPath();x.arc(a,b-1,1.3,0,6.3);x.arc(a+1.2,b,1,0,6.3);x.fill()}
    else if(k==='uw_anemone'){if(r<.82)continue;x.strokeStyle='#d83a7a';x.lineWidth=.5;x.beginPath();for(let t=-2;t<=2;t++){x.moveTo(a,b);x.lineTo(a+t*.7,b-2)}x.stroke()}}
  // coral, tube sponges and rocks from the real decor
  const dec=L.decor||[];
  for(const d of dec){const a=X(d.x+.5),b=Y(d.y+.6),k=d.k;
    if(k==='uw_staghorn'){x.strokeStyle='#e0703a';x.lineWidth=.9;x.lineCap='round';for(let t=-2;t<=2;t++){x.beginPath();x.moveTo(a,b);x.lineTo(a+t*1.5,b-3.6-Math.abs(t)*-.4);x.lineTo(a+t*1.9,b-5.4);x.stroke()}x.strokeStyle='#f0a468';x.lineWidth=.4;x.beginPath();x.moveTo(a,b);x.lineTo(a,b-5);x.stroke();x.lineCap='butt'}
    else if(k==='uw_brain'){x.fillStyle='#d8a85a';x.strokeStyle=INK;x.lineWidth=.55;x.beginPath();x.arc(a,b-1.2,2.5,Math.PI,0);x.closePath();x.fill();x.stroke();x.strokeStyle='rgba(120,70,30,.8)';x.lineWidth=.4;x.beginPath();x.moveTo(a-1.6,b-1.6);x.quadraticCurveTo(a-.6,b-3,a+.2,b-1.8);x.quadraticCurveTo(a+1,b-.8,a+1.8,b-2);x.stroke()}
    else if(k==='uw_tubes'){x.fillStyle='#5a7ad0';x.strokeStyle=INK;x.lineWidth=.45;for(const [dx,h] of [[-1.4,3],[0,4.6],[1.4,3.4]]){x.fillRect(a+dx-.55,b-h,1.1,h);x.strokeRect(a+dx-.55,b-h,1.1,h)}}
    else if(k==='uw_rocks'){x.fillStyle='#8a929c';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.ellipse(a,b-.6,2.3,1.5,0,0,6.3);x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.4)';x.beginPath();x.ellipse(a-.6,b-1,.9,.5,0,0,6.3);x.fill()}
    else if(k==='uw_amphora'){x.fillStyle='#b8622e';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-.9,b-4);x.quadraticCurveTo(a-3,b-1,a-1,b+1);x.lineTo(a+1,b+1);x.quadraticCurveTo(a+3,b-1,a+.9,b-4);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(a-2.2,b-2.6);x.quadraticCurveTo(a-3.6,b-4,a-1.2,b-3.8);x.stroke()}
    else if(k==='uw_clam'){x.fillStyle='#f0e0d0';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.ellipse(a,b-.6,2.2,1.5,0,0,6.3);x.fill();x.stroke();x.strokeStyle='rgba(120,80,60,.7)';x.beginPath();x.moveTo(a-1.6,b-.6);x.lineTo(a+1.6,b-.6);x.stroke()}
    else if(k==='uw_timber'){x.save();x.translate(a,b);x.rotate((Hh(d.x,d.y,64)-.5)*1.2);x.fillStyle='#7a5a32';x.strokeStyle=INK;x.lineWidth=.6;x.fillRect(-5,-1,10,2.2);x.strokeRect(-5,-1,10,2.2);x.fillRect(-1.2,-4,2.2,7);x.strokeRect(-1.2,-4,2.2,7);x.restore()}}
  // the nine shell chests: gold crosses over a little chest, the prize larger
  for(const d of dec){if(d.k!=='uw_shellchest')continue;const a=X(d.x+.5),b=Y(d.y+.5),big=d.npc==='uw_prize'||(d.npc&&d.npc.indexOf('prize')>=0);
    const w=big?4.4:3.2;x.fillStyle=big?MPL.GOLD:'#b8844a';x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(a-w,b-w*.55,w*2,w*1.1);x.strokeRect(a-w,b-w*.55,w*2,w*1.1);x.beginPath();x.moveTo(a-w,b-w*.1);x.lineTo(a+w,b-w*.1);x.stroke();x.fillStyle=MPL.GOLD2;x.fillRect(a-.7,b-w*.3,1.4,1.4);
    x.strokeStyle=MPL.VERM;x.lineWidth=1.3;x.beginPath();x.moveTo(a-w*1.1,b-w*1.3);x.lineTo(a+w*1.1,b+w*1.3);x.moveTo(a+w*1.1,b-w*1.3);x.lineTo(a-w*1.1,b+w*1.3);x.stroke();if(big)api.I.star(x,a,b-w*2.4,.8,MPL.GOLD2)}
  // the boss's den, the way up and the shoals of fish
  const bs=(L.enemies||[]).find(e=>e.t==='uwgiant');if(bs){const a=X(bs.x+.5),b=Y(bs.y+.5);api.I.skull(x,a,b,1.5);x.strokeStyle=MPL.VERM;x.lineWidth=1;x.setLineDash([2,2]);x.beginPath();x.arc(a,b,s*3.6,0,6.3);x.stroke();x.setLineDash([])}
  const bu=dec.find(d=>d.npc==='uw_up');if(bu)mpSaltbarrowBuoy(x,X(bu.x+.5),Y(bu.y+.5),1.2);
  // bubbles
  x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=.45;for(let i=0;i<90;i++){const u=3+Hh(i,1,66)*(W-6),v=3+Hh(i,2,66)*(H-6);if(mpSaltbarrowSamp(fR,W,H,u-.5,v-.5)>.4)continue;x.beginPath();x.arc(X(u),Y(v),.7+Hh(i,3,66)*.7,0,6.3);x.stroke()}
  // names
  const T2=(t,u,v,sz,col)=>api.text(x,t,X(u),Y(v),sz||6.4,col||INK,'center');
  const dense=(re)=>{let best=[0,0,0];for(let gy=10;gy<H-10;gy+=5)for(let gx=10;gx<W-10;gx+=5){let n=0;for(const d of dec)if(re.test(d.k)&&Math.abs(d.x-gx)<10&&Math.abs(d.y-gy)<10)n++;if(n>best[2])best=[gx,gy,n]}return best};
  const sg=dense(/staghorn/),br=dense(/brain/),tu=dense(/tubes/);
  T2('Staghorn Reef',sg[0],sg[1]-9,6.4,'#7a3010');T2('Brain Coral Beds',br[0],br[1]+9,6.4,'#6a4a10');T2('Tube Sponges',tu[0],tu[1]+8,6,MPL.LAPIS);
  if(bs){T2('The Giant',bs.x,bs.y+5.4,6.4,'#7a1a10');}T2('Sunk Fortune',54,7.6,6.6,'#6a4a00');
  if(bu)T2('Way up to the island',bu.x,bu.y-5.4,6.2,MPL.LAPIS);
  T2('Wreck Timbers',50,66.6,5.6,'#4a2a10');
  api.title(x,'The Reef','Under Saltbarrow');
  api.panel(x,8,56,78,132);api.text(x,'Key',47,64,7.2,MPL.VERM,'center');
  const ky=[['Shell chest',()=>{x.fillStyle='#b8844a';x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(14,70,9,6);x.strokeRect(14,70,9,6);x.strokeStyle=MPL.VERM;x.lineWidth=1.2;x.beginPath();x.moveTo(12,67);x.lineTo(25,79);x.moveTo(25,67);x.lineTo(12,79);x.stroke()}],
    ['Staghorn coral',()=>{x.strokeStyle='#e0703a';x.lineWidth=.9;for(let t=-2;t<=2;t++){x.beginPath();x.moveTo(18,95);x.lineTo(18+t*2,89);x.stroke()}}],['Brain coral',()=>{x.fillStyle='#d8a85a';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(18,106,3.6,Math.PI,0);x.closePath();x.fill();x.stroke()}],
    ['Tube sponge',()=>{x.fillStyle='#5a7ad0';x.strokeStyle=INK;x.lineWidth=.5;for(const [dx,h] of [[-2,5],[0,7],[2,5.4]]){x.fillRect(18+dx-.8,127-h,1.6,h);x.strokeRect(18+dx-.8,127-h,1.6,h)}}],['Clam',()=>{x.fillStyle='#f0e0d0';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.ellipse(18,139,4,2.8,0,0,6.3);x.fill();x.stroke()}],
    ['Old jar',()=>{x.fillStyle='#b8622e';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.moveTo(17,151);x.quadraticCurveTo(13,156,16.6,160);x.lineTo(19.4,160);x.quadraticCurveTo(23,156,19,151);x.closePath();x.fill();x.stroke()}],['Rock wall',()=>{x.fillStyle='#707c8a';x.strokeStyle=INK;x.lineWidth=.6;x.fillRect(12,167,13,6);x.strokeRect(12,167,13,6)}],['Way up',()=>mpSaltbarrowBuoy(x,18,188,.6)]];
  ky.forEach(([t,f],i)=>{x.save();f();x.restore();api.text(x,t,30,73+i*14.8,6.2,'#3a2a1c','left')});
  api.compass(x,46,236,15);
  api.panel(x,392,40,84,236);
  api.notes(x,['The reef lies on the seabed under Saltbarrow, inside a wall of rock.','Nine shell chests are hidden among the coral. The largest holds Sable Maeve\'s sunk fortune.','The giant waits at the north end, near the fortune.','Sharks, barracuda, crabs, octopus, jellyfish and eels swim here.','Surface at the buoy in the south to go back up. Watch your air.'],398,50,72,6.2,4);
}});
