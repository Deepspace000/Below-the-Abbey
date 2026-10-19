/* ==========================================================================
   AREA MAP: KHEMETRA, the golden desert city (level 44). An illuminated page in the manner of 13th to 15th century Arabic and Persian manuscripts:
   ivory and saffron vellum, indigo, lapis, turquoise, carmine, emerald and burnished gold, a girih (star and polygon) border, an ogee title cartouche
   with square-Kufic lettering, an eight-point-star compass, and the walled medina drawn from the real city data (khemetra_*.js): flat roofs, domes,
   minarets, souks with awnings, caravanserai, courtyards with fountains, gardens, pools, the palace, crenellated walls with round towers and horseshoe gates.
   The sheet is drawn once (at 6 times the screen size, so it stays sharp when zoomed) and cached. Fog of war does not apply here.
   The rooms inside the city (levels 199 to 280) keep the plain map. All names start with mpKhem / MPKH.
   ========================================================================== */
const MPKH={S:8,cache:null,F:null,
  ivory:'#f3e6bb',vel:'#ead9a4',saff:'#e8b64a',indigo:'#1c2a63',lapis:'#2a4ca0',turq:'#1c9a9a',turq2:'#58c4bc',carm:'#a8222c',emer:'#1f7a52',emer2:'#4aa06a',
  gold:'#c9a227',gold2:'#f3da7c',ink:'#2a1a0c',ochre:'#d9a24a',terra:'#c8744a',white:'#f6f0e0',sand:'#e8d094',sandD:'#d2b070'};
const mpKhemFont=()=>typeof FUI!=='undefined'?FUI:'Georgia,serif';
/* ------------------------------ small helpers ------------------------------ */
function mpKhemStar(x,cx,cy,ro,ri,n,rot){x.beginPath();for(let i=0;i<n*2;i++){const r=i%2?ri:ro,a=(rot===undefined?-Math.PI/2:rot)+i*Math.PI/n,px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath()}
function mpKhemQuad(x,a,b,w,h,s,j){j=j===undefined?.12:j;const q=i=>(hash2((a*7)|0,(b*7)|0,s+i)-.5)*2*j;x.beginPath();x.moveTo(a+q(1),b+q(2));x.lineTo(a+w+q(3),b+q(4));x.lineTo(a+w+q(5),b+h+q(6));x.lineTo(a+q(7),b+h+q(8));x.closePath()}
function mpKhemShade(hex,a){const c=hex.replace('#','');const r=Math.max(0,Math.min(255,parseInt(c.slice(0,2),16)+a)),g=Math.max(0,Math.min(255,parseInt(c.slice(2,4),16)+a)),b=Math.max(0,Math.min(255,parseInt(c.slice(4,6),16)+a));return 'rgb('+r+','+g+','+b+')'}
function mpKhemLS(x,v){try{x.letterSpacing=v}catch(e){}}
/* a dome seen from above: soft shadow, shaded sphere, gore lines, a ring and a gold finial */
function mpKhemDome(x,cx,cy,r,col,ribs,gold){
  x.fillStyle='rgba(60,40,20,.26)';x.beginPath();x.ellipse(cx+r*.3,cy+r*.42,r*1.02,r*.92,0,0,6.3);x.fill();
  const g=x.createRadialGradient(cx-r*.32,cy-r*.36,r*.08,cx,cy,r);g.addColorStop(0,mpKhemShade(col,70));g.addColorStop(.55,col);g.addColorStop(1,mpKhemShade(col,-45));
  x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,6.3);x.fill();x.strokeStyle=MPKH.ink;x.lineWidth=Math.max(.07,r*.07);x.stroke();
  if(ribs&&r>1.1){x.strokeStyle='rgba(30,20,10,.3)';x.lineWidth=Math.max(.04,r*.035);x.beginPath();const n=ribs;for(let i=0;i<n;i++){const a=i/n*6.283;x.moveTo(cx+Math.cos(a)*r*.14,cy+Math.sin(a)*r*.14);x.quadraticCurveTo(cx+Math.cos(a+.18)*r*.6,cy+Math.sin(a+.18)*r*.6,cx+Math.cos(a)*r*.97,cy+Math.sin(a)*r*.97)}x.stroke()}
  x.fillStyle='rgba(255,250,225,.4)';x.beginPath();x.ellipse(cx-r*.3,cy-r*.34,r*.3,r*.2,-.7,0,6.3);x.fill();
  x.fillStyle=gold?MPKH.gold2:MPKH.gold;x.beginPath();x.arc(cx,cy,Math.max(.12,r*.13),0,6.3);x.fill();x.lineWidth=Math.max(.03,r*.025);x.stroke()}
/* a slender minaret in elevation: banded shaft, balcony, upper turret, pointed cap and gold ball */
function mpKhemMinaret(x,cx,by,hg,cap){
  const w=hg*.15;x.save();x.translate(cx,by);x.lineJoin='round';
  x.fillStyle='rgba(50,30,10,.26)';x.beginPath();x.moveTo(-w*.5,0);x.lineTo(w*.5,0);x.lineTo(hg*.55,hg*.12);x.lineTo(hg*.3,hg*.13);x.fill();
  const g=x.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,'#fbf3d8');g.addColorStop(1,'#cdb98a');x.fillStyle=g;x.strokeStyle=MPKH.ink;x.lineWidth=Math.max(.06,hg*.012);
  x.beginPath();x.moveTo(-w*.55,0);x.lineTo(-w*.4,-hg*.7);x.lineTo(w*.4,-hg*.7);x.lineTo(w*.55,0);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPKH.turq;x.fillRect(-w*.5,-hg*.3,w,hg*.05);x.fillRect(-w*.46,-hg*.55,w*.92,hg*.05);
  x.fillStyle='#e4d4a4';x.fillRect(-w*1.0,-hg*.72,w*2,hg*.06);x.strokeRect(-w*1.0,-hg*.72,w*2,hg*.06);
  x.fillStyle='#f6ecd0';x.fillRect(-w*.34,-hg*.9,w*.68,hg*.18);x.strokeRect(-w*.34,-hg*.9,w*.68,hg*.18);
  x.fillStyle='#2a1a0c';x.fillRect(-w*.08,-hg*.86,w*.16,hg*.09);
  x.fillStyle=cap;x.beginPath();x.moveTo(-w*.46,-hg*.9);x.quadraticCurveTo(-w*.4,-hg*1.02,0,-hg*1.12);x.quadraticCurveTo(w*.4,-hg*1.02,w*.46,-hg*.9);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPKH.gold2;x.beginPath();x.arc(0,-hg*1.13,hg*.03,0,6.3);x.fill();x.stroke();x.beginPath();x.moveTo(0,-hg*1.15);x.lineTo(0,-hg*1.22);x.stroke();
  x.restore()}
/* a date palm seen from above */
function mpKhemPalm(x,px,py,sc){
  x.fillStyle='rgba(50,36,16,.22)';x.beginPath();x.ellipse(px+.5*sc,py+.5*sc,1.1*sc,.7*sc,0,0,6.3);x.fill();
  const n=9,ph=hash2(px*9|0,py*9|0,60)*6.28;
  for(let k=0;k<n;k++){const a=ph+k/n*6.283,r=1.35*sc,ex=px+Math.cos(a)*r,ey=py+Math.sin(a)*r;x.strokeStyle=k%2?'#2f7a4a':'#3d9a5a';x.lineWidth=.32*sc;x.lineCap='round';x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+Math.cos(a+.3)*r*.6,py+Math.sin(a+.3)*r*.6,ex,ey);x.stroke()}
  x.strokeStyle='rgba(20,60,30,.5)';x.lineWidth=.08*sc;for(let k=0;k<n;k++){const a=ph+k/n*6.283;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*1.3*sc,py+Math.sin(a)*1.3*sc);x.stroke()}
  x.fillStyle='#5a3a1c';x.beginPath();x.arc(px,py,.28*sc,0,6.3);x.fill();x.fillStyle='#c98a30';x.beginPath();x.arc(px+.12*sc,py-.1*sc,.14*sc,0,6.3);x.fill()}
function mpKhemTree(x,px,py,sc,col){
  x.fillStyle='rgba(50,36,16,.22)';x.beginPath();x.ellipse(px+.5*sc,py+.5*sc,1*sc,.8*sc,0,0,6.3);x.fill();
  const g=x.createRadialGradient(px-.3*sc,py-.3*sc,.1*sc,px,py,1*sc);g.addColorStop(0,mpKhemShade(col||'#5aa264',50));g.addColorStop(1,col||'#2f7a4a');x.fillStyle=g;x.beginPath();x.arc(px,py,.95*sc,0,6.3);x.fill();x.strokeStyle='rgba(20,50,25,.65)';x.lineWidth=.08*sc;x.stroke();
  x.fillStyle='rgba(240,220,140,.55)';for(let i=0;i<3;i++){x.beginPath();x.arc(px+(hash2(px*5|0,i,3)-.5)*1.1*sc,py+(hash2(py*5|0,i,4)-.5)*1.1*sc,.1*sc,0,6.3);x.fill()}}
/* a striped awning, from (a,b), w by h, stripes of the two colours */
function mpKhemAwning(x,a,b,w,h,c1,c2,vertical){
  const n=Math.max(2,Math.round((vertical?h:w)/.55));x.save();for(let i=0;i<n;i++){x.fillStyle=i&1?c2:c1;if(vertical)x.fillRect(a,b+i*h/n,w,h/n);else x.fillRect(a+i*w/n,b,w/n,h)}
  x.strokeStyle='rgba(40,24,10,.75)';x.lineWidth=.09;x.strokeRect(a,b,w,h);x.fillStyle='rgba(255,255,255,.18)';if(vertical)x.fillRect(a,b,w*.3,h);else x.fillRect(a,b,w,h*.3);x.restore()}
/* a camel, in side view, walking to the right when dir is 1: tan body, one hump, a blanket and a pack */
function mpKhemCamel(x,cx,cy,s,dir,col,blanket){
  x.save();x.translate(cx,cy);x.scale(s*(dir||1),s);x.lineCap='round';x.lineJoin='round';col=col||'#c99a58';
  const leg=(ax,ay,kx,ky,bx,by)=>{x.beginPath();x.moveTo(ax,ay);x.lineTo(kx,ky);x.lineTo(bx,by)};
  x.strokeStyle=MPKH.ink;x.lineWidth=2.1;for(const [ax,ph] of [[-4.6,0],[-3.1,1],[3,1],[4.5,0]]){leg(ax,1.2,ax+.3*(ph?1:-1),4.6,ax+.1,7.8);x.stroke()}
  x.strokeStyle=col;x.lineWidth=1.2;for(const [ax,ph] of [[-4.6,0],[-3.1,1],[3,1],[4.5,0]]){leg(ax,1.2,ax+.3*(ph?1:-1),4.6,ax+.1,7.8);x.stroke()}
  x.fillStyle=col;x.strokeStyle=MPKH.ink;x.lineWidth=.55;
  x.beginPath();x.moveTo(-6.2,-.8);x.quadraticCurveTo(-6.6,-3,-4.5,-3.1);x.quadraticCurveTo(-3.2,-5.6,-1.8,-3.2);x.quadraticCurveTo(1,-3.6,3.6,-3);x.quadraticCurveTo(5,-3.4,5.6,-4.8);x.quadraticCurveTo(6.4,-8.2,7.6,-9.4);x.quadraticCurveTo(9.4,-9.9,10.4,-8.8);x.quadraticCurveTo(10.9,-8,10.1,-7.4);x.lineTo(8.8,-7.2);x.quadraticCurveTo(8,-5.8,7.2,-3.8);x.quadraticCurveTo(6.8,-.6,5,1.4);x.lineTo(-4.4,1.9);x.quadraticCurveTo(-6,1.8,-6.2,-.8);x.closePath();x.fill();x.stroke();
  x.fillStyle=blanket||MPKH.carm;x.beginPath();x.moveTo(-4.6,-2.8);x.lineTo(-1.2,-2.9);x.lineTo(-1.6,.8);x.lineTo(-4.4,.9);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPKH.gold2;x.fillRect(-4.5,-1.3,3,.5);x.fillStyle='#8a6a3a';x.fillRect(-.7,-1.8,2,2.2);x.strokeRect(-.7,-1.8,2,2.2);
  x.fillStyle='#2a1a0c';x.beginPath();x.arc(9.1,-8.5,.32,0,6.3);x.fill();
  x.strokeStyle=MPKH.ink;x.lineWidth=.5;x.beginPath();x.moveTo(-6.2,-.6);x.quadraticCurveTo(-7.2,1,-6.6,3);x.stroke();
  x.restore()}
/* a palm in elevation, for the margins and the oasis */
function mpKhemPalmElev(x,bx,by,hg,lean){
  x.save();x.translate(bx,by);lean=lean||0;x.strokeStyle=MPKH.ink;x.lineWidth=hg*.1;x.lineCap='round';x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(lean*.3,-hg*.5,lean,-hg);x.stroke();
  x.strokeStyle='#7a5228';x.lineWidth=hg*.06;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(lean*.3,-hg*.5,lean,-hg);x.stroke();
  x.strokeStyle='rgba(40,20,5,.55)';x.lineWidth=hg*.02;for(let i=1;i<9;i++){const t=i/9,tx=lean*(2*t*(1-t)*.3+t*t),ty=-hg*(2*t*(1-t)*.5+t*t);x.beginPath();x.moveTo(tx-hg*.03,ty);x.lineTo(tx+hg*.03,ty-hg*.012);x.stroke()}
  const tx=lean,ty=-hg;for(let k=0;k<9;k++){const a=-Math.PI+k/8*Math.PI,r=hg*.62,ex=tx+Math.cos(a)*r,ey=ty+Math.sin(a)*r*.45+r*.45*Math.abs(Math.cos(a))*.9;x.strokeStyle=MPKH.ink;x.lineWidth=hg*.075;x.beginPath();x.moveTo(tx,ty);x.quadraticCurveTo(tx+Math.cos(a)*r*.55,ty+Math.sin(a)*r*.7-hg*.1,ex,ey);x.stroke();x.strokeStyle=k%2?'#2f8a4e':'#4aa862';x.lineWidth=hg*.045;x.beginPath();x.moveTo(tx,ty);x.quadraticCurveTo(tx+Math.cos(a)*r*.55,ty+Math.sin(a)*r*.7-hg*.1,ex,ey);x.stroke()}
  x.fillStyle='#c98a30';for(const [dx,dy] of [[-.05,.05],[.06,.07],[0,.1]]){x.beginPath();x.arc(tx+dx*hg,ty+dy*hg,hg*.035,0,6.3);x.fill()}
  x.restore()}
/* ------------------------------ the vellum page ------------------------------ */
function mpKhemPage(x){
  const g=x.createLinearGradient(0,0,DW,DH);g.addColorStop(0,'#f5e9c0');g.addColorStop(.5,'#eedaa6');g.addColorStop(1,'#e6cf94');x.fillStyle=g;x.fillRect(0,0,DW,DH);
  x.save();x.globalAlpha=.13;for(let i=0;i<190;i++){x.fillStyle=i%4===0?'#e0a83a':i%4===1?'#fff6d8':i%4===2?'#a8743a':'#d89a3a';x.beginPath();x.ellipse(hash2(i,1,17)*DW,hash2(i,2,17)*DH,4+hash2(i,3,17)*34,3+hash2(i,4,17)*16,hash2(i,5,17)*3,0,6.3);x.fill()}x.restore();
  x.save();x.strokeStyle='rgba(120,80,30,.07)';x.lineWidth=.3;for(let i=0;i<900;i++){const a=hash2(i,6,18)*DW,b=hash2(i,7,18)*DH,an=hash2(i,8,18)*6.28,l=2+hash2(i,9,18)*6;x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.cos(an)*l,b+Math.sin(an)*l);x.stroke()}x.restore();
  const v=x.createRadialGradient(DW/2,DH/2,DH*.3,DW/2,DH/2,DW*.64);v.addColorStop(0,'rgba(110,70,20,0)');v.addColorStop(1,'rgba(110,70,20,.34)');x.fillStyle=v;x.fillRect(0,0,DW,DH)}
/* ------------------------------ the girih border ------------------------------ */
/* one strip of strapwork along +x: two interlaced strands, eight-point stars where they cross, small diamonds between */
function mpKhemStrip(x,len,th){
  const n=Math.max(2,Math.round(len/(th*1.15))),p=len/n;x.save();x.lineCap='round';
  for(let k=0;k<2;k++){for(const [lw,col] of [[1.35,'#0c1238'],[.8,k?MPKH.gold2:MPKH.gold]]){x.strokeStyle=col;x.lineWidth=lw;x.beginPath();for(let t=0;t<=len;t+=.6){const y=Math.sin(t/p*Math.PI*2+k*Math.PI)*th*.24;t?x.lineTo(t,y):x.moveTo(t,y)}x.stroke()}}
  for(let i=0;i<n;i++){const sx=i*p+p/2;mpKhemStar(x,sx,0,th*.46,th*.28,8,-Math.PI/8);x.fillStyle=i%2?MPKH.turq:MPKH.lapis;x.fill();x.strokeStyle=MPKH.gold;x.lineWidth=.45;x.stroke();
    mpKhemStar(x,sx,0,th*.2,th*.1,8,-Math.PI/8);x.fillStyle=i%2?MPKH.ivory:MPKH.gold2;x.fill();x.fillStyle=MPKH.carm;x.beginPath();x.arc(sx,0,th*.07,0,6.3);x.fill();
    const jx=i*p;x.fillStyle=MPKH.carm;x.beginPath();x.moveTo(jx,-th*.26);x.lineTo(jx+th*.2,0);x.lineTo(jx,th*.26);x.lineTo(jx-th*.2,0);x.closePath();x.fill();x.strokeStyle=MPKH.gold2;x.lineWidth=.3;x.stroke()}
  x.restore()}
function mpKhemRosette(x,cx,cy,r){
  x.save();x.translate(cx,cy);x.fillStyle=MPKH.indigo;x.beginPath();x.arc(0,0,r*1.02,0,6.3);x.fill();
  mpKhemStar(x,0,0,r,r*.72,16);x.fillStyle=MPKH.gold;x.fill();x.strokeStyle=MPKH.ink;x.lineWidth=.5;x.stroke();
  mpKhemStar(x,0,0,r*.74,r*.5,8,-Math.PI/8);x.fillStyle=MPKH.carm;x.fill();x.strokeStyle=MPKH.gold2;x.lineWidth=.45;x.stroke();
  mpKhemStar(x,0,0,r*.5,r*.32,8);x.fillStyle=MPKH.turq;x.fill();x.strokeStyle=MPKH.gold2;x.stroke();
  x.fillStyle=MPKH.ivory;x.beginPath();x.arc(0,0,r*.2,0,6.3);x.fill();x.fillStyle=MPKH.indigo;x.beginPath();x.arc(0,0,r*.09,0,6.3);x.fill();
  x.fillStyle=MPKH.gold2;for(let i=0;i<16;i++){const a=i/16*6.283;x.beginPath();x.arc(Math.cos(a)*r*.87,Math.sin(a)*r*.87,r*.04,0,6.3);x.fill()}
  x.restore()}
function mpKhemBorder(x){
  const m=2.4,w=DW-2*m,h=DH-2*m,t=9.4;x.save();
  x.fillStyle=MPKH.indigo;x.beginPath();x.rect(m,m,w,h);x.rect(m+t,m+t,w-2*t,h-2*t);x.fill('evenodd');
  x.strokeStyle=MPKH.gold;x.lineWidth=1.3;x.strokeRect(m,m,w,h);x.strokeRect(m+t,m+t,w-2*t,h-2*t);
  x.strokeStyle=MPKH.ink;x.lineWidth=.5;x.strokeRect(m-1,m-1,w+2,h+2);x.strokeRect(m+t+1,m+t+1,w-2*t-2,h-2*t-2);
  x.strokeStyle=MPKH.gold2;x.lineWidth=.4;x.strokeRect(m+1.6,m+1.6,w-3.2,h-3.2);x.strokeRect(m+t-1.6,m+t-1.6,w-2*t+3.2,h-2*t+3.2);
  const st=(x0,y0,len,rot)=>{x.save();x.translate(x0,y0);x.rotate(rot);mpKhemStrip(x,len,t*.78);x.restore()};
  st(m+t+6,m+t/2,w-2*t-12,0);st(m+t+6,m+h-t/2,w-2*t-12,0);st(m+t/2,m+t+6,h-2*t-12,Math.PI/2);st(m+w-t/2,m+t+6,h-2*t-12,Math.PI/2);
  for(const [cx,cy] of [[m+t/2+.4,m+t/2+.4],[m+w-t/2-.4,m+t/2+.4],[m+t/2+.4,m+h-t/2-.4],[m+w-t/2-.4,m+h-t/2-.4]])mpKhemRosette(x,cx,cy,t*.78);
  x.restore()}
/* the frame of the drawing area: a bead rule in indigo and gold with a star in each corner */
function mpKhemAreaFrame(x){
  const A=MPL.AREA;x.save();x.strokeStyle=MPKH.indigo;x.lineWidth=3.2;x.strokeRect(A.x-1.6,A.y-1.6,A.w+3.2,A.h+3.2);
  x.strokeStyle=MPKH.gold;x.lineWidth=.9;x.strokeRect(A.x-3.4,A.y-3.4,A.w+6.8,A.h+6.8);x.strokeRect(A.x-.2,A.y-.2,A.w+.4,A.h+.4);x.strokeStyle=MPKH.ink;x.lineWidth=.4;x.strokeRect(A.x-4.3,A.y-4.3,A.w+8.6,A.h+8.6);
  x.fillStyle=MPKH.ivory;for(let i=A.x+3;i<A.x+A.w-1;i+=5){for(const y of [A.y-1.6,A.y+A.h+1.6]){x.beginPath();x.arc(i,y,.62,0,6.3);x.fill()}}for(let j=A.y+3;j<A.y+A.h-1;j+=5){for(const xx of [A.x-1.6,A.x+A.w+1.6]){x.beginPath();x.arc(xx,j,.62,0,6.3);x.fill()}}
  for(const [cx,cy] of [[A.x-1.6,A.y-1.6],[A.x+A.w+1.6,A.y-1.6],[A.x-1.6,A.y+A.h+1.6],[A.x+A.w+1.6,A.y+A.h+1.6]]){mpKhemStar(x,cx,cy,5,3,8,-Math.PI/8);x.fillStyle=MPKH.turq;x.fill();x.strokeStyle=MPKH.gold;x.lineWidth=.7;x.stroke();x.fillStyle=MPKH.carm;x.beginPath();x.arc(cx,cy,1.1,0,6.3);x.fill()}
  x.restore()}
/* a ruled panel for notes and the key: a gold rule outside, a fine indigo rule inside, a small diamond in each corner */
function mpKhemPanel(x,a,b,w,h){
  x.save();x.fillStyle='rgba(247,238,206,.62)';x.fillRect(a,b,w,h);x.strokeStyle=MPKH.gold;x.lineWidth=1.1;x.strokeRect(a,b,w,h);x.strokeStyle=MPKH.indigo;x.lineWidth=.5;x.strokeRect(a+1.8,b+1.8,w-3.6,h-3.6);
  for(const [cx,cy] of [[a,b],[a+w,b],[a,b+h],[a+w,b+h]]){x.fillStyle=MPKH.carm;x.beginPath();x.moveTo(cx,cy-2.2);x.lineTo(cx+2.2,cy);x.lineTo(cx,cy+2.2);x.lineTo(cx-2.2,cy);x.closePath();x.fill();x.strokeStyle=MPKH.gold;x.lineWidth=.5;x.stroke()}x.restore()}
/* ------------------------------ the title cartouche: an ogee arch with square-Kufic lettering ------------------------------ */
function mpKhemOgee(x,cx,w,ya,ys,yb){
  const hw=w/2;x.beginPath();x.moveTo(cx-hw,yb);x.lineTo(cx-hw,ys);x.bezierCurveTo(cx-hw,ys-9,cx-hw*.35,ys-9,cx-hw*.16,ys-(ys-ya)*.62);x.bezierCurveTo(cx-hw*.07,ys-(ys-ya)*.8,cx,ya+3,cx,ya);
  x.bezierCurveTo(cx,ya+3,cx+hw*.07,ys-(ys-ya)*.8,cx+hw*.16,ys-(ys-ya)*.62);x.bezierCurveTo(cx+hw*.35,ys-9,cx+hw,ys-9,cx+hw,ys);x.lineTo(cx+hw,yb);x.closePath()}
const MPKH_GLYPH={K:[[[0,0],[0,6]],[[3.6,0],[.4,3.1],[3.6,6]]],H:[[[0,0],[0,6]],[[3.4,0],[3.4,6]],[[0,3],[3.4,3]]],E:[[[3.4,0],[0,0],[0,6],[3.4,6]],[[0,3],[2.4,3]]],M:[[[0,6],[0,0],[2.2,3.2],[4.4,0],[4.4,6]]],T:[[[0,0],[4.2,0]],[[2.1,0],[2.1,6]]],R:[[[0,6],[0,0],[3.2,0],[3.2,3],[0,3]],[[1.6,3],[3.4,6]]],A:[[[0,6],[2.1,0],[4.2,6]],[[.9,3.8],[3.3,3.8]]]};
function mpKhemKufic(x,text,cx,cy,sc){
  const gap=1.7;let tw=0;const ws={K:3.8,H:3.4,E:3.4,M:4.4,T:4.2,R:3.4,A:4.2};for(const ch of text)tw+=ws[ch]+gap;tw-=gap;
  let px=cx-tw*sc/2;x.save();x.lineJoin='miter';x.lineCap='square';
  const pass=(lw,col)=>{x.strokeStyle=col;x.lineWidth=lw;let ox=px;for(const ch of text){for(const pl of MPKH_GLYPH[ch]){x.beginPath();pl.forEach(([a,b],i)=>{const X=ox+a*sc,Y=cy-3*sc+b*sc;i?x.lineTo(X,Y):x.moveTo(X,Y)});x.stroke()}ox+=(ws[ch]+gap)*sc}};
  pass(sc*1.5,'#07091f');pass(sc*1.1,MPKH.gold);pass(sc*.55,'#e8c24a');pass(sc*.2,MPKH.gold2);
  let ox=px;for(const ch of text){x.fillStyle=MPKH.turq2;for(const pl of MPKH_GLYPH[ch]){const [a,b]=pl[0];x.beginPath();x.arc(ox+a*sc,cy-3*sc+b*sc,sc*.2,0,6.3);x.fill()}ox+=(ws[ch]+gap)*sc}
  x.restore()}
function mpKhemTitle(x){
  const cx=51,ya=11.5,ys=33,yb=77,w=74;x.save();
  mpKhemOgee(x,cx,w+3,ya-1.5,ys,yb+1.5);x.fillStyle='rgba(50,30,10,.3)';x.save();x.translate(1.4,1.6);x.fill();x.restore();
  mpKhemOgee(x,cx,w,ya,ys,yb);const g=x.createLinearGradient(0,ya,0,yb);g.addColorStop(0,'#26357a');g.addColorStop(1,'#141c4a');x.fillStyle=g;x.fill();x.strokeStyle=MPKH.gold;x.lineWidth=1.6;x.stroke();x.strokeStyle=MPKH.ink;x.lineWidth=.4;mpKhemOgee(x,cx,w+3.4,ya-1.9,ys,yb+1.9);x.stroke();
  mpKhemOgee(x,cx,w-6,ya+5.2,ys+.6,yb-3);x.strokeStyle=MPKH.turq2;x.lineWidth=.8;x.stroke();mpKhemOgee(x,cx,w-9,ya+7.6,ys+1,yb-5.6);x.strokeStyle=MPKH.gold;x.lineWidth=.4;x.stroke();
  // tiny stars spangled on the indigo
  x.fillStyle=MPKH.gold2;for(let i=0;i<26;i++){const a=cx-w/2+4+hash2(i,1,31)*(w-8),b=ya+22+hash2(i,2,31)*(yb-ya-26);if(Math.abs(a-cx)>25||b<ya+26||b>yb-9)mpKhemStar(x,a,b,1.1,.45,4,0),x.fill()}
  // finial and a star medallion under the point
  x.fillStyle=MPKH.gold2;x.strokeStyle=MPKH.ink;x.lineWidth=.4;x.beginPath();x.arc(cx,ya-2.4,1.3,0,6.3);x.fill();x.stroke();
  mpKhemStar(x,cx,ya+14.5,5.4,3.3,8,-Math.PI/8);x.fillStyle=MPKH.carm;x.fill();x.strokeStyle=MPKH.gold2;x.lineWidth=.55;x.stroke();mpKhemStar(x,cx,ya+14.5,3,1.9,8);x.fillStyle=MPKH.turq;x.fill();x.fillStyle=MPKH.ivory;x.beginPath();x.arc(cx,ya+14.5,.9,0,6.3);x.fill();
  // the lettering: square Kufic, with a Greek-key frieze under it
  mpKhemKufic(x,'KHEMETRA',cx,ys+13.3,1.3);
  x.strokeStyle=MPKH.gold;x.lineWidth=.55;x.beginPath();x.moveTo(cx-27,ys+23.5);x.lineTo(cx+27,ys+23.5);x.stroke();
  x.strokeStyle=MPKH.turq2;x.lineWidth=.6;x.beginPath();let yy=ys+25.6;x.moveTo(cx-26,yy);for(let i=0;i<13;i++){const a=cx-26+i*4;x.lineTo(a,yy-1.6);x.lineTo(a+2,yy-1.6);x.lineTo(a+2,yy);x.lineTo(a+4,yy)}x.stroke();
  x.font=`bold 5.4px ${mpKhemFont()}`;x.textAlign='center';x.textBaseline='middle';mpKhemLS(x,'.4px');x.fillStyle='#07091f';x.fillText('THE GOLDEN CITY',cx+.3,yb-9.4);x.fillStyle=MPKH.gold2;x.fillText('THE GOLDEN CITY',cx,yb-9.8);mpKhemLS(x,'0px');
  x.restore()}
/* ------------------------------ the compass: an eight-point star ------------------------------ */
function mpKhemCompass(x,cx,cy,r){
  x.save();x.translate(cx,cy);
  x.fillStyle='rgba(247,238,206,.9)';x.beginPath();x.arc(0,0,r*1.2,0,6.3);x.fill();x.strokeStyle=MPKH.gold;x.lineWidth=1.3;x.stroke();x.strokeStyle=MPKH.indigo;x.lineWidth=.6;x.beginPath();x.arc(0,0,r*1.08,0,6.3);x.stroke();x.beginPath();x.arc(0,0,r*.9,0,6.3);x.stroke();
  x.strokeStyle=MPKH.ink;x.lineWidth=.35;for(let i=0;i<48;i++){const a=i/48*6.283,l=i%6===0?.18:i%2===0?.1:.06;x.beginPath();x.moveTo(Math.cos(a)*r*(1.08-l),Math.sin(a)*r*(1.08-l));x.lineTo(Math.cos(a)*r*1.08,Math.sin(a)*r*1.08);x.stroke()}
  const pt=(a,len,wid,c1,c2)=>{x.save();x.rotate(a);x.fillStyle=c1;x.beginPath();x.moveTo(0,-len);x.lineTo(wid,0);x.lineTo(0,0);x.closePath();x.fill();x.fillStyle=c2;x.beginPath();x.moveTo(0,-len);x.lineTo(-wid,0);x.lineTo(0,0);x.closePath();x.fill();x.strokeStyle=MPKH.ink;x.lineWidth=.45;x.beginPath();x.moveTo(0,-len);x.lineTo(wid,0);x.lineTo(0,0);x.lineTo(-wid,0);x.closePath();x.stroke();x.restore()};
  for(let k=0;k<4;k++)pt(Math.PI/4+k*Math.PI/2,r*.7,r*.17,MPKH.turq2,MPKH.lapis);
  for(let k=0;k<4;k++)pt(k*Math.PI/2,r*.98,r*.2,k===0?'#e0505a':MPKH.turq2,k===0?MPKH.carm:MPKH.indigo);
  mpKhemStar(x,0,0,r*.3,r*.16,8);x.fillStyle=MPKH.gold2;x.fill();x.strokeStyle=MPKH.ink;x.lineWidth=.4;x.stroke();x.fillStyle=MPKH.carm;x.beginPath();x.arc(0,0,r*.07,0,6.3);x.fill();
  x.restore();
  x.save();x.font=`bold 7.5px ${mpKhemFont()}`;x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
  for(const [t,dx,dy,col] of [['N',0,-1.38,MPKH.carm],['S',0,1.38,MPKH.indigo],['E',1.38,0,MPKH.indigo],['W',-1.38,0,MPKH.indigo]]){x.lineWidth=2.4;x.strokeStyle='rgba(247,238,206,.95)';x.strokeText(t,cx+dx*r,cy+dy*r);x.fillStyle=col;x.fillText(t,cx+dx*r,cy+dy*r)}
  x.restore()}
/* ------------------------------ the desert round the walls ------------------------------ */
function mpKhemDunes(x,F){
  const A=MPL.AREA;x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  const g=x.createLinearGradient(A.x,A.y,A.x+A.w,A.y+A.h);g.addColorStop(0,'#ecd596');g.addColorStop(.5,'#e8cd8c');g.addColorStop(1,'#e0c07a');x.fillStyle=g;x.fillRect(A.x,A.y,A.w,A.h);
  x.globalAlpha=.1;for(let i=0;i<90;i++){x.fillStyle=i%2?'#c98a3a':'#fff2c8';x.beginPath();x.ellipse(A.x+hash2(i,1,41)*A.w,A.y+hash2(i,2,41)*A.h,6+hash2(i,3,41)*28,2+hash2(i,4,41)*8,hash2(i,5,41)*.5-.25,0,6.3);x.fill()}x.globalAlpha=1;
  const cl=F.ox-3,cr=F.ox+400*F.s+3,ct=F.oy-3,cb=F.oy+400*F.s+3;
  for(let i=0;i<150;i++){
    const cx=A.x+hash2(i,1,42)*A.w,cy=A.y+hash2(i,2,42)*A.h,w=9+hash2(i,3,42)*20,hh=2.5+hash2(i,4,42)*4;
    if(cx+w>cl&&cx-w<cr&&cy>ct-2&&cy-hh<cb)continue;
    // a dune: a pale windward back and a darker slip face on the lee side, then rippled sand below
    x.beginPath();x.moveTo(cx-w,cy);x.quadraticCurveTo(cx-w*.35,cy-hh*2,cx+w*.2,cy-hh*1.5);x.quadraticCurveTo(cx+w*.6,cy-hh*1.1,cx+w,cy);x.quadraticCurveTo(cx,cy+hh*.35,cx-w,cy);x.closePath();
    const dg=x.createLinearGradient(cx-w,cy-hh,cx+w,cy);dg.addColorStop(0,'#f7e8b4');dg.addColorStop(.55,'#ecd194');dg.addColorStop(1,'#c99c58');x.fillStyle=dg;x.fill();
    x.strokeStyle='rgba(100,62,20,.55)';x.lineWidth=.35;x.beginPath();x.moveTo(cx-w,cy);x.quadraticCurveTo(cx-w*.35,cy-hh*2,cx+w*.2,cy-hh*1.5);x.quadraticCurveTo(cx+w*.6,cy-hh*1.1,cx+w,cy);x.stroke();
    x.strokeStyle='rgba(120,74,24,.32)';x.lineWidth=.28;for(let k=1;k<=4;k++){x.beginPath();const yy=cy+k*hh*.32;x.moveTo(cx-w*(1-k*.1),yy);for(let t=0;t<=8;t++){x.lineTo(cx-w*(1-k*.1)+t*w*(2-k*.2)/8,yy+Math.sin(t*1.6+i)*.5)}x.stroke()}
    x.strokeStyle='rgba(120,74,24,.38)';x.lineWidth=.26;x.beginPath();for(let k=0;k<5;k++){const sx=cx+w*.1+k*w*.16;x.moveTo(sx,cy-hh*1.2+k*.25);x.lineTo(sx+w*.05,cy-hh*.2)}x.stroke();
  }
  // wind ripples and scrub over the open sand
  x.lineCap='round';
  for(let i=0;i<420;i++){const a=A.x+hash2(i,1,43)*A.w,b=A.y+hash2(i,2,43)*A.h;if(a>cl&&a<cr&&b>ct&&b<cb)continue;const l=3+hash2(i,3,43)*5;x.strokeStyle='rgba(130,84,30,.3)';x.lineWidth=.25;x.beginPath();x.moveTo(a,b);x.quadraticCurveTo(a+l*.5,b-.9,a+l,b);x.stroke();
    if(i%3===0){x.beginPath();x.moveTo(a+1,b+1.3);x.quadraticCurveTo(a+l*.5+1,b+.4,a+l+1,b+1.3);x.stroke()}}
  for(let i=0;i<70;i++){const a=A.x+hash2(i,1,44)*A.w,b=A.y+hash2(i,2,44)*A.h;if(a>cl-2&&a<cr+2&&b>ct-2&&b<cb+2)continue;x.strokeStyle='#6a7a3a';x.lineWidth=.3;x.beginPath();for(let k=-1;k<=1;k++){x.moveTo(a,b);x.lineTo(a+k*.9,b-1.5-Math.abs(k)*-.3)}x.stroke();x.fillStyle='#a8a090';x.beginPath();x.arc(a+2,b+.6,.35,0,6.3);x.fill()}
  x.restore()}
/* a road across the sand: a pale track with wheel ruts, from (x0,y0) by a list of points */
function mpKhemTrack(x,pts,wd){
  x.save();x.lineCap='round';x.lineJoin='round';const path=()=>{x.beginPath();pts.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b))};
  x.strokeStyle='rgba(120,80,30,.35)';x.lineWidth=wd+1.4;path();x.stroke();x.strokeStyle='#f1dfae';x.lineWidth=wd;path();x.stroke();
  x.strokeStyle='rgba(140,96,40,.4)';x.lineWidth=.3;x.setLineDash([1.2,.8]);for(const o of [-wd*.25,wd*.25]){x.beginPath();pts.forEach(([a,b],i)=>{const q=i?pts[i]:pts[i];i?x.lineTo(a+o*.0,b+o):x.moveTo(a+o*.0,b+o)});x.stroke()}x.setLineDash([]);x.restore()}
/* a small oasis: pool, reeds, palms and a nomad tent */
function mpKhemOasis(x,cx,cy,s){
  x.save();x.translate(cx,cy);x.scale(s,s);
  x.fillStyle='#7fb67a';x.beginPath();x.ellipse(0,0,13,6.5,0,0,6.3);x.fill();x.strokeStyle='rgba(30,70,30,.6)';x.lineWidth=.3;x.stroke();
  const g=x.createRadialGradient(-2,-1,1,0,0,9);g.addColorStop(0,'#a6e4ea');g.addColorStop(1,'#3d8fb0');x.fillStyle=g;x.beginPath();x.ellipse(0,.4,8.5,4,0,0,6.3);x.fill();x.strokeStyle='#2a5a78';x.lineWidth=.4;x.stroke();
  x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=.3;for(let i=0;i<4;i++){x.beginPath();x.ellipse(-3+i*2.2,-.6+(i%2)*1.6,1.3,.45,0,0,3.3);x.stroke()}
  x.strokeStyle='#4a7a3a';x.lineWidth=.4;for(let i=0;i<22;i++){const a=i/22*6.283,ex=Math.cos(a)*9.2,ey=Math.sin(a)*4.4+.4;x.beginPath();x.moveTo(ex,ey);x.lineTo(ex+Math.cos(a)*.6,ey-2.1);x.stroke()}
  mpKhemPalmElev(x,-9,-1,12,2);mpKhemPalmElev(x,10,-2,10,-2);mpKhemPalmElev(x,-5,-5,8,1);
  // a nomad tent with a striped valance
  x.save();x.translate(14,6);x.fillStyle='#4a3a2a';x.strokeStyle=MPKH.ink;x.lineWidth=.45;x.beginPath();x.moveTo(-5,3);x.lineTo(-2.5,-3.2);x.lineTo(2.5,-3.2);x.lineTo(5,3);x.closePath();x.fill();x.stroke();
  for(let i=0;i<5;i++){x.fillStyle=i&1?MPKH.ivory:MPKH.carm;x.fillRect(-4.5+i*1.8,1.2,1.8,1.8)}x.fillStyle='#14100a';x.beginPath();x.moveTo(-1,3);x.lineTo(0,-1);x.lineTo(1,3);x.fill();x.restore();
  x.restore()}
/* a caravan walking along y: n camels roped together */
function mpKhemCaravan(x,cx,cy,n,s,dir){
  const cols=['#c99a58','#b98a4a','#d4a868','#bf9050'],bl=[MPKH.carm,MPKH.turq,MPKH.indigo,MPKH.saff];
  x.save();x.strokeStyle='#6a4a22';x.lineWidth=.3;for(let i=0;i<n-1;i++){x.beginPath();x.moveTo(cx+dir*(i*13*s+8*s),cy-7*s);x.quadraticCurveTo(cx+dir*(i*13*s+14*s),cy-4*s,cx+dir*((i+1)*13*s-5*s),cy-3*s);x.stroke()}x.restore();
  for(let i=0;i<n;i++)mpKhemCamel(x,cx+dir*i*13*s,cy+(i%2)*.4*s,s,dir,cols[i%4],bl[(i+1)%4])}
/* ------------------------------ the city ------------------------------ */
function mpKhemGroups(C){
  const W=C.W,H=C.H,idx=C.idx,own=new Int32Array(W*H).fill(-1),blds=[],lines=new Map();
  C.modules.forEach((m,mi)=>{if(m.kind==='castle'||m.kind==='palace')return;const horiz=m.face<2,line=horiz?m.cells[0][1]:m.cells[0][0],pos=Math.min(...m.cells.map(c=>horiz?c[0]:c[1])),end=Math.max(...m.cells.map(c=>horiz?c[0]:c[1])),key=m.face+':'+line,a=lines.get(key),o={m,mi,pos,end};if(a)a.push(o);else lines.set(key,[o])});
  const groups=[],cls=k=>k==='house'||k==='low'||k==='mansion'?'d':k;
  for(const a of lines.values()){a.sort((p,q)=>p.pos-q.pos);let g=null;for(const o of a){const tgt=2+((hash2(o.m.cells[0][0],o.m.cells[0][1],9)*3)|0);if(g&&o.pos===g.end+1&&cls(o.m.kind)===cls(g.mods[0].kind)&&g.mods.length<g.tgt&&!o.m.bld&&!g.mods[0].bld){g.mods.push(o.m);g.mis.push(o.mi);g.end=o.end}else{g={mods:[o.m],mis:[o.mi],end:o.end,tgt};groups.push(g)}}}
  groups.forEach(g=>{const m=g.mods[0],d=KH_DIRS[m.face],ix=-d[0],iy=-d[1],depth=4+((hash2(m.cells[0][0],m.cells[0][1],8)*3)|0),cells=[].concat(...g.mods.map(q=>q.cells)),got=[];
    for(let k=0;k<depth;k++){let ok=true;for(const [cx,cy] of cells){const px=cx+ix*k,py=cy+iy*k;if(px<0||py<0||px>=W||py>=H||!C.solid[idx(px,py)]||own[idx(px,py)]>=0){ok=false;break}}if(!ok)break;for(const [cx,cy] of cells)got.push([cx+ix*k,cy+iy*k])}
    if(!got.length)return;let x0=1e9,y0=1e9,x1=-1,y1=-1;for(const [px,py] of got){own[idx(px,py)]=g.mis[0];x0=Math.min(x0,px);y0=Math.min(y0,py);x1=Math.max(x1,px);y1=Math.max(y1,py)}
    blds.push({m,mods:g.mods,mi:g.mis[0],x0,y0,x1,y1})});
  return {blds,own}}
const MPKH_ROOFS=['#f4ecd6','#f4ecd6','#f0e2c0','#e6c486','#dcb06a','#e6c486','#cf8b5a','#d99a62','#f4ecd6','#e9d3a0','#c98f56','#9fc4c0','#e0a870','#b9d4c8','#d0794e','#f0d890'];
const MPKH_AWN=[[MPKH.carm,MPKH.ivory],[MPKH.turq,MPKH.ivory],[MPKH.saff,MPKH.indigo],[MPKH.emer2,MPKH.ivory],[MPKH.lapis,MPKH.ivory],[MPKH.terra,MPKH.ivory]];
function mpKhemBuilding(x,b,special){
  const m=b.m,k=m.kind,r0=hash2(m.cells[0][0],m.cells[0][1],4),d=KH_DIRS[m.face],px=b.x0,py=b.y0,w=b.x1-b.x0+1,h=b.y1-b.y0+1,sd=px*131+py;
  const wallc=k==='temple'?'#f8f0d8':k==='pray'?'#f2f2e8':k==='bath'?'#e4f0ea':k==='ruin'?'#b6a688':k==='mansion'?'#f4e6c0':'#efe0b8';
  mpKhemQuad(x,px,py,w,h,sd,.1);x.fillStyle=wallc;x.fill();x.strokeStyle=MPKH.ink;x.lineWidth=.17;x.stroke();
  const ins=.32,rx=px+ins,ry=py+ins,rw=w-2*ins,rh=h-2*ins;
  if(k==='ruin'){
    x.fillStyle='#b9a888';mpKhemQuad(x,rx,ry,rw,rh,sd+3,.3);x.fill();
    x.fillStyle='rgba(60,45,30,.5)';for(let q=0;q<3;q++){const a=hash2(sd,q,230);x.fillRect(rx+a*rw*.6,ry+hash2(sd,q,231)*rh*.5,rw*.35,rh*.4)}
    x.fillStyle='#6a5a46';for(let q=0;q<7;q++){x.beginPath();x.arc(rx+hash2(sd,q,232)*rw,ry+hash2(sd,q,233)*rh,.22,0,6.3);x.fill()}
    x.strokeStyle='rgba(40,28,16,.7)';x.lineWidth=.1;x.beginPath();x.moveTo(rx+rw*.2,ry);x.lineTo(rx+rw*.35,ry+rh*.45);x.lineTo(rx+rw*.28,ry+rh);x.moveTo(rx+rw*.7,ry);x.lineTo(rx+rw*.62,ry+rh*.6);x.stroke();
    x.fillStyle='#5a7a3a';for(let q=0;q<3;q++){x.beginPath();x.arc(rx+hash2(sd,q,234)*rw,ry+hash2(sd,q,235)*rh,.3,0,6.3);x.fill()}
    return}
  let roof=MPKH_ROOFS[(r0*MPKH_ROOFS.length)|0];if(k==='low')roof=['#e0c48a','#d4b27a','#e6d0a0','#caa56c'][(r0*4)|0];
  const dome=(cx,cy,r,col,ribs,gold)=>mpKhemDome(x,cx,cy,r,col,ribs,gold);
  if(k==='temple'||special==='mosque'||special==='church'){
    x.fillStyle='#e8d8a0';mpKhemQuad(x,rx,ry,rw,rh,sd+1,.08);x.fill();x.strokeStyle='rgba(90,60,20,.6)';x.lineWidth=.1;x.stroke();
    // an inner court with a pool and four small domes at the corners, one great dome
    const r=Math.min(rw,rh)*.34,cx=px+w/2,cy=py+h/2;
    for(const [dx,dy] of [[-1,-1],[1,-1],[-1,1],[1,1]])if(rw>5&&rh>5)dome(cx+dx*(rw/2-1.1),cy+dy*(rh/2-1.1),.95,special==='church'?'#d8d0b8':MPKH.turq,6,true);
    dome(cx,cy,r,special==='church'?'#3a5aa8':(r0<.5?'#d6a82c':MPKH.turq),12,true);
    if(special==='church'){x.strokeStyle=MPKH.gold2;x.lineWidth=.28;x.beginPath();x.moveTo(cx,cy-.9);x.lineTo(cx,cy+.9);x.moveTo(cx-.6,cy-.3);x.lineTo(cx+.6,cy-.3);x.stroke()}
  }else if(k==='pray'){
    x.fillStyle=roof==='#9fc4c0'?'#f4ecd6':roof;mpKhemQuad(x,rx,ry,rw,rh,sd+1,.08);x.fill();x.strokeStyle='rgba(90,60,20,.5)';x.lineWidth=.08;x.stroke();
    dome(px+w/2,py+h/2,Math.min(rw,rh)*.34,['#f2f0e6','#7fd0cc','#4aa8b0','#f2f0e6'][(r0*4)|0],8,false);
  }else if(k==='bath'){
    x.fillStyle='#d9ecea';mpKhemQuad(x,rx,ry,rw,rh,sd+1,.08);x.fill();x.strokeStyle='rgba(30,90,100,.5)';x.lineWidth=.1;x.stroke();
    const horiz=w>=h,n=Math.max(2,Math.round((horiz?w:h)/3)),rr=Math.min(horiz?h:w,(horiz?w:h)/n)*.36;
    for(let i=0;i<n;i++){const t=(i+.5)/n;dome(horiz?px+w*t:px+w/2,horiz?py+h/2:py+h*t,rr*(i===(n>>1)?1.25:.95),i%2?'#3fa8a8':'#58c4bc',8,false)}
    x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=.12;for(let i=0;i<2;i++){x.beginPath();const sx=px+w*(.3+i*.4),sy=py-.2;x.moveTo(sx,sy);x.bezierCurveTo(sx+.5,sy-.8,sx-.5,sy-1.2,sx+.2,sy-2);x.stroke()}
  }else if(k==='mansion'&&rw>=5&&rh>=5){
    x.fillStyle=roof;mpKhemQuad(x,rx,ry,rw,rh,sd+1,.08);x.fill();
    const ci=Math.min(1.5,rw*.28,rh*.28),cw=rw-2*ci,ch=rh-2*ci;x.fillStyle='#6fae6e';x.fillRect(rx+ci,ry+ci,cw,ch);x.strokeStyle='rgba(40,70,30,.8)';x.lineWidth=.1;x.strokeRect(rx+ci,ry+ci,cw,ch);
    x.fillStyle='#69c6d4';x.beginPath();x.ellipse(rx+rw/2,ry+rh/2,Math.min(.9,cw*.2),Math.min(.9,ch*.2),0,0,6.3);x.fill();x.strokeStyle='#2a5a78';x.lineWidth=.08;x.stroke();
    x.fillStyle='#e06a2a';for(const [dx,dy] of [[.2,.2],[.8,.2],[.2,.8],[.8,.8]]){x.beginPath();x.arc(rx+ci+cw*dx,ry+ci+ch*dy,.32,0,6.3);x.fill();x.fillStyle='#3a7a3a';x.beginPath();x.arc(rx+ci+cw*dx,ry+ci+ch*dy,.18,0,6.3);x.fill();x.fillStyle='#e06a2a'}
    x.strokeStyle='rgba(90,60,20,.45)';x.lineWidth=.07;x.beginPath();for(let q=1;q<3;q++){x.moveTo(rx+q*rw/3,ry);x.lineTo(rx+q*rw/3,ry+ci);x.moveTo(rx+q*rw/3,ry+rh-ci);x.lineTo(rx+q*rw/3,ry+rh)}x.stroke();
  }else if(k==='mansion'){
    x.fillStyle=roof;mpKhemQuad(x,rx,ry,rw,rh,sd+1,.08);x.fill();dome(px+w/2,py+h/2,Math.min(rw,rh)*.32,['#d8b040','#3fa8a8','#f2f0e6','#4a74a8'][(r0*4)|0],8,false);
  }else{
    x.fillStyle=roof;mpKhemQuad(x,rx,ry,rw,rh,sd+1,.08);x.fill();
    // earth-plaster mottling, a parapet line, and what stands on a roof: a stair hut, a water jar, washing, a small awning
    x.fillStyle='rgba(120,80,30,.1)';for(let q=0;q<3;q++){x.beginPath();x.ellipse(rx+hash2(sd,q,240)*rw,ry+hash2(sd,q,241)*rh,rw*.18,rh*.1,0,0,6.3);x.fill()}
    x.strokeStyle='rgba(90,60,20,.42)';x.lineWidth=.09;x.strokeRect(rx+.28,ry+.28,rw-.56,rh-.56);
    if(w>=3&&h>=3){const t=hash2(sd,1,242);
      if(t<.3){x.fillStyle='#d8c08c';x.fillRect(rx+rw*.6,ry+rh*.15,Math.min(1.6,rw*.3),Math.min(1.6,rh*.3));x.strokeStyle=MPKH.ink;x.lineWidth=.09;x.strokeRect(rx+rw*.6,ry+rh*.15,Math.min(1.6,rw*.3),Math.min(1.6,rh*.3))}
      else if(t<.5){x.fillStyle='#b8744a';x.beginPath();x.arc(rx+rw*.3,ry+rh*.3,.45,0,6.3);x.fill();x.strokeStyle=MPKH.ink;x.stroke()}
      else if(t<.65){x.strokeStyle='rgba(60,40,20,.7)';x.lineWidth=.06;x.beginPath();x.moveTo(rx+.5,ry+rh*.5);x.lineTo(rx+rw-.5,ry+rh*.5);x.stroke();x.fillStyle=t<.58?MPKH.carm:MPKH.turq;for(let q=0;q<4;q++)x.fillRect(rx+.7+q*(rw-1.6)/4,ry+rh*.5,.5,.7)}
      else if(t<.75&&k!=='low'){mpKhemAwning(x,rx+rw*.2,ry+rh*.55,rw*.5,rh*.3,...MPKH_AWN[(hash2(sd,2,243)*6)|0])}}
  }
  // the front: a horseshoe-arched door and tiny windows on the street side of every house, an awning on every shop
  for(const q of b.mods){
    const mid=q.cells.reduce((u,c)=>[u[0]+c[0],u[1]+c[1]],[0,0]).map(v=>v/q.cells.length+.5);
    const ex=mid[0]+d[0]*.5,ey=mid[1]+d[1]*.5; // the front edge midpoint of this module
    if(k!=='ruin'){
      x.save();x.translate(ex-d[0]*.04,ey-d[1]*.04);x.rotate(Math.atan2(d[1],d[0])+Math.PI/2);
      x.fillStyle='#4a2c14';x.beginPath();x.moveTo(-.3,.1);x.lineTo(-.3,-.3);x.arc(0,-.32,.3,Math.PI,0);x.lineTo(.3,.1);x.closePath();x.fill();
      x.fillStyle=MPKH.gold2;x.fillRect(-.04,-.3,.08,.26);x.restore();
      x.fillStyle='rgba(40,40,90,.6)';const along=d[0]?[0,1]:[1,0];
      for(const o of [-1.3,1.3]){const wx=mid[0]+along[0]*o+d[0]*.44,wy=mid[1]+along[1]*o+d[1]*.44;if(wx>px+.5&&wx<px+w-.5&&wy>py+.5&&wy<py+h-.5)x.fillRect(wx-.11,wy-.11,.22,.22)}}
    if(k==='shop'){
      const cols=MPKH_AWN[(hash2(q.cells[0][0],q.cells[0][1],77)*6)|0],vert=d[0]!==0,dp=.95;
      const x0=vert?(d[0]>0?px+w-.1:px-dp+.1):Math.min(...q.cells.map(c=>c[0])),y0=vert?Math.min(...q.cells.map(c=>c[1])):(d[1]>0?py+h-.1:py-dp+.1);
      const len=q.cells.length;mpKhemAwning(x,x0,y0,vert?dp:len,vert?len:dp,cols[0],cols[1],vert)}
  }
}
/* the palace: terrace and arcade, a great gold dome, turquoise domes, four small domes, corner towers, a court garden behind */
function mpKhemPalace(x,C){
  const P=C.PB,x0=P.x0,y0=P.y0,w=P.x1-P.x0+1,h=P.y1-P.y0+1,cx=x0+w/2,I=MPKH.ink;x.save();x.lineJoin='round';
  x.fillStyle='rgba(60,40,20,.3)';x.fillRect(x0+1.6,y0+2.4,w,h);
  x.fillStyle='#f2e6bf';x.fillRect(x0,y0,w,h);x.strokeStyle=I;x.lineWidth=.4;x.strokeRect(x0,y0,w,h);
  // the back court: a garden of four beds and a water cross, with a pool
  const gx=x0+3,gy=y0+2,gw=w-6,gh=h*.3;x.fillStyle='#e0cf98';x.fillRect(gx-.6,gy-.6,gw+1.2,gh+1.2);
  for(let i=0;i<2;i++)for(let j=0;j<2;j++){const bx=gx+i*gw/2+.4,by=gy+j*gh/2+.4,bw=gw/2-.8,bh=gh/2-.8;x.fillStyle=(i+j)&1?'#5fa468':'#4e9a60';x.fillRect(bx,by,bw,bh);x.strokeStyle='rgba(20,60,30,.7)';x.lineWidth=.12;x.strokeRect(bx,by,bw,bh);x.fillStyle='rgba(230,200,90,.7)';for(let q=0;q<6;q++){x.beginPath();x.arc(bx+1+(q%3)*(bw-2)/2,by+1+((q/3)|0)*(bh-2),.25,0,6.3);x.fill()}}
  x.fillStyle='#4fb4cc';x.fillRect(gx+gw/2-.3,gy,.6,gh);x.fillRect(gx,gy+gh/2-.3,gw,.6);x.beginPath();x.arc(gx+gw/2,gy+gh/2,1.5,0,6.3);x.fill();x.strokeStyle='#e8d8a0';x.lineWidth=.2;x.stroke();x.fillStyle='#fff';x.beginPath();x.arc(gx+gw/2,gy+gh/2,.4,0,6.3);x.fill();
  for(let q=0;q<10;q++){x.fillStyle='#1f5a34';x.beginPath();x.ellipse(gx+1+q*(gw-2)/9,gy-.1,.35,.8,0,0,6.3);x.fill()}
  // the main hall
  const hy=y0+h*.38,hh=h*.46;x.fillStyle='#f8efd0';x.fillRect(x0+1.2,hy,w-2.4,hh);x.strokeStyle=I;x.lineWidth=.3;x.strokeRect(x0+1.2,hy,w-2.4,hh);
  x.strokeStyle='rgba(180,130,30,.7)';x.lineWidth=.14;for(let q=0;q<w-4;q+=1.6){mpKhemStar(x,x0+2.4+q,hy+.9,.5,.28,8);x.fillStyle=MPKH.gold;x.fill()}
  for(let q=0;q<w-4;q+=1.6){mpKhemStar(x,x0+2.4+q,hy+hh-.9,.5,.28,8);x.fillStyle=MPKH.turq;x.fill()}
  // domes
  for(const dx of [-.34,.34])mpKhemDome(x,cx+dx*w,hy+hh*.5,w*.095,MPKH.turq,14,false);
  for(const dx of [-.43,-.2,.2,.43])mpKhemDome(x,cx+dx*w,hy+hh*.2,w*.05,'#d6a82c',10,true);
  mpKhemDome(x,cx,hy+hh*.5,w*.17,'#d9a826',20,true);
  x.strokeStyle=MPKH.gold2;x.lineWidth=.2;x.beginPath();x.arc(cx,hy+hh*.5,w*.19,0,6.3);x.stroke();x.fillStyle=MPKH.gold2;for(let q=0;q<24;q++){const a=q/24*6.283;x.beginPath();x.arc(cx+Math.cos(a)*w*.19,hy+hh*.5+Math.sin(a)*w*.19,.18,0,6.3);x.fill()}
  // the front arcade: a row of horseshoe arches in elevation
  const ay=y0+h*.84,ah=h*.16;x.fillStyle='#e6d29a';x.fillRect(x0,ay,w,ah);x.strokeStyle=I;x.lineWidth=.3;x.strokeRect(x0,ay,w,ah);
  const na=Math.round(w/1.9),aw=w/na;for(let q=0;q<na;q++){const ax=x0+q*aw+aw/2,mid=Math.abs(ax-cx)<aw*.6;x.fillStyle='#1c1208';x.beginPath();x.moveTo(ax-aw*.3,y0+h);x.lineTo(ax-aw*.3,ay+ah*.5);x.arc(ax,ay+ah*.5,aw*.34,Math.PI,0);x.lineTo(ax+aw*.3,y0+h);x.fill();if(mid){x.fillStyle=MPKH.gold;x.fillRect(ax-aw*.3,ay+ah*.7,aw*.6,ah*.3)}x.strokeStyle=MPKH.gold2;x.lineWidth=.1;x.stroke()}
  // corner towers with turquoise caps
  for(const [tx,ty] of [[x0,y0],[x0+w,y0],[x0,y0+h*.84],[x0+w,y0+h*.84]]){x.fillStyle='rgba(50,30,10,.28)';x.beginPath();x.arc(tx+.7,ty+.9,2.5,0,6.3);x.fill();const g=x.createLinearGradient(tx-2.4,ty,tx+2.4,ty);g.addColorStop(0,'#f6e8c0');g.addColorStop(1,'#bda274');x.fillStyle=g;x.beginPath();x.arc(tx,ty,2.5,0,6.3);x.fill();x.strokeStyle=I;x.lineWidth=.3;x.stroke();mpKhemDome(x,tx,ty,1.6,MPKH.turq,8,true)}
  x.restore()}
/* the Court of the Golden Sun: a long water channel with octagonal pools on the palace axis, and beds of flowers either side, edged in hedge */
function mpKhemCourt(x,C){
  const P=C.PB,cx=(P.x0+P.x1+1)/2,y0=P.y1+3,y1=Math.min(C.PAL.y1-2,y0+30),I=MPKH.ink;x.save();
  for(const side of [-1,1])for(let r=0;r<2;r++){
    const bw=27,bh=(y1-y0-3)/2,bx=side<0?cx-3-bw:cx+3,by=y0+r*(bh+3);
    x.fillStyle='#4e9a60';x.fillRect(bx,by,bw,bh);x.strokeStyle='#1f5a34';x.lineWidth=.5;x.strokeRect(bx,by,bw,bh);x.strokeStyle='#e8d8a0';x.lineWidth=.3;x.strokeRect(bx+1.2,by+1.2,bw-2.4,bh-2.4);
    for(let i=0;i<5;i++)for(let j=0;j<3;j++){x.fillStyle=(i+j)%3===0?MPKH.carm:(i+j)%3===1?'#f3e6bb':'#e8a02a';x.beginPath();x.arc(bx+3+i*(bw-6)/4,by+2.4+j*(bh-4.8)/2,.55,0,6.3);x.fill()}
    mpKhemStar(x,bx+bw/2,by+bh/2,Math.min(bh,bw)*.28,Math.min(bh,bw)*.15,8,-Math.PI/8);x.fillStyle=MPKH.turq;x.fill();x.strokeStyle=MPKH.gold2;x.lineWidth=.25;x.stroke();
    x.fillStyle='#1f5a34';for(let i=0;i<9;i++){x.beginPath();x.ellipse(bx+1.5+i*(bw-3)/8,by-.1,.45,.9,0,0,6.3);x.fill()}}
  x.fillStyle='#4fb4cc';x.fillRect(cx-.7,y0,1.4,y1-y0);x.strokeStyle='#e8d8a0';x.lineWidth=.2;x.strokeRect(cx-.9,y0,1.8,y1-y0);
  for(const yy of [y0+3,(y0+y1)/2,y1-3]){x.beginPath();for(let k=0;k<8;k++){const a=k/8*6.2832+.39;k?x.lineTo(cx+Math.cos(a)*3.3,yy+Math.sin(a)*3.3):x.moveTo(cx+Math.cos(a)*3.3,yy+Math.sin(a)*3.3)}x.closePath();x.fillStyle='#e8d8a0';x.fill();x.strokeStyle=I;x.lineWidth=.14;x.stroke();x.beginPath();for(let k=0;k<8;k++){const a=k/8*6.2832+.39;k?x.lineTo(cx+Math.cos(a)*2.5,yy+Math.sin(a)*2.5):x.moveTo(cx+Math.cos(a)*2.5,yy+Math.sin(a)*2.5)}x.closePath();x.fillStyle='#69c6d4';x.fill();x.fillStyle='#fff';x.beginPath();x.arc(cx,yy,.5,0,6.3);x.fill()}
  x.restore()}
function mpKhemGate(x,cx,by,sc){
  x.save();x.translate(cx,by);x.scale(sc,sc);x.lineJoin='round';const I=MPKH.ink;
  x.fillStyle='rgba(50,30,10,.32)';x.beginPath();x.ellipse(2.4,.6,14,2.4,0,0,6.3);x.fill();
  x.fillStyle='#dcc690';x.fillRect(-9,-9,18,9);x.strokeStyle=I;x.lineWidth=.22;x.strokeRect(-9,-9,18,9);
  x.strokeStyle='rgba(70,45,20,.4)';x.lineWidth=.08;x.beginPath();for(let j=1;j<5;j++){x.moveTo(-9,-j*1.8);x.lineTo(9,-j*1.8);for(let i=-9+((j&1)?1.2:2.4);i<9;i+=2.4){x.moveTo(i,-j*1.8);x.lineTo(i,-(j-1)*1.8)}}x.stroke();
  x.fillStyle='#dcc690';for(let i=0;i<9;i++){x.fillRect(-9+i*2,-10.3,1.2,1.4);x.strokeRect(-9+i*2,-10.3,1.2,1.4)}
  for(const s of [-1,1]){const tx=s*9.4,g=x.createLinearGradient(tx-2.7,0,tx+2.7,0);g.addColorStop(0,'#f0e0b0');g.addColorStop(1,'#b59a68');x.fillStyle=g;x.fillRect(tx-2.7,-14,5.4,14);x.strokeRect(tx-2.7,-14,5.4,14);
    x.fillStyle=MPKH.turq;x.fillRect(tx-2.7,-9.4,5.4,.9);x.fillStyle=MPKH.gold;x.fillRect(tx-2.7,-8.5,5.4,.4);
    x.fillStyle='#2a1a0c';x.fillRect(tx-.3,-12.2,.6,1.8);x.fillRect(tx-.3,-6.4,.6,1.8);
    x.fillStyle='#dcc690';for(let i=0;i<3;i++){x.fillRect(tx-2.7+i*2.1,-15.2,1.2,1.3);x.strokeRect(tx-2.7+i*2.1,-15.2,1.2,1.3)}
    x.fillStyle=s<0?MPKH.turq:'#d9a826';x.beginPath();x.moveTo(tx-2.9,-15.2);x.quadraticCurveTo(tx-2.4,-19.4,tx,-20.6);x.quadraticCurveTo(tx+2.4,-19.4,tx+2.9,-15.2);x.closePath();x.fill();x.stroke();
    x.fillStyle=MPKH.gold2;x.beginPath();x.arc(tx,-20.9,.5,0,6.3);x.fill();x.stroke();x.beginPath();x.moveTo(tx,-21.4);x.lineTo(tx,-23);x.stroke()}
  // the horseshoe arch, its voussoirs in ivory and carmine, and the gold-studded doors
  const cyA=-4.6,rA=2.7;x.fillStyle='#160c04';x.beginPath();x.moveTo(-1.8,0);x.lineTo(-1.8,-2.6);x.arc(0,cyA,rA,1.84,Math.PI*2+1.3,false);x.lineTo(1.8,0);x.closePath();x.fill();
  x.save();x.lineWidth=.8;x.setLineDash([.7,.7]);x.strokeStyle=MPKH.ivory;x.beginPath();x.arc(0,cyA,rA+.7,1.84,Math.PI*2+1.3);x.stroke();x.lineDashOffset=.7;x.strokeStyle=MPKH.carm;x.beginPath();x.arc(0,cyA,rA+.7,1.84,Math.PI*2+1.3);x.stroke();x.restore();
  x.fillStyle='#d9a636';x.fillRect(-1.7,-2.6,1.65,2.6);x.fillRect(.05,-2.6,1.65,2.6);x.strokeStyle='#5a3a10';x.lineWidth=.1;x.strokeRect(-1.7,-2.6,1.65,2.6);x.strokeRect(.05,-2.6,1.65,2.6);x.fillStyle='#f6e8a0';for(let i=0;i<3;i++)for(let j=0;j<2;j++){x.beginPath();x.arc(-.9+j*1.8,-.6-i*.75,.14,0,6.3);x.fill()}
  // banners on the towers
  for(const s of [-1,1]){x.strokeStyle=I;x.lineWidth=.14;x.beginPath();x.moveTo(s*9.4,-23);x.lineTo(s*9.4,-26.4);x.stroke();x.fillStyle=MPKH.carm;x.beginPath();x.moveTo(s*9.4,-26.4);x.lineTo(s*9.4+s*3.2,-25.6);x.lineTo(s*9.4,-24.4);x.closePath();x.fill();x.stroke()}
  x.restore()}
/* ------------------------------ the whole city ------------------------------ */
function mpKhemCity(x,C,F,info){
  const W=C.W,H=C.H,B=KH.WALL,idx=C.idx,I=MPKH.ink,L=LEVELS[44],T=6.2832;
  x.save();x.translate(F.ox,F.oy);x.scale(F.s,F.s);x.lineJoin='round';x.lineCap='round';
  const {blds,own}=mpKhemGroups(C);
  // ---- ground: yard earth under everything, then streets and floors on top ----
  x.fillStyle='#d3b57e';x.fillRect(B,B,W-2*B,H-2*B);
  const FL={0:'#efdfb0',1:'#e8d4a0',2:'#f4e4a4',3:'#e0c88e',4:'#63a56a',5:'#7cc6c0'};
  for(let y=B;y<H-B;y++){let s=B;while(s<W-B){const i=idx(s,y);if(C.solid[i]){s++;continue}const f=C.fl[i];let e=s+1;while(e<W-B&&!C.solid[idx(e,y)]&&C.fl[idx(e,y)]===f)e++;x.fillStyle=FL[f]||FL[0];x.fillRect(s,y,e-s,1.03);s=e}}
  // street width: wide avenues pale gold, lanes darker
  const run=new Uint8Array(W*H*2);
  for(let y=0;y<H;y++){let k=0;while(k<W){if(C.solid[idx(k,y)]){k++;continue}let e=k;while(e<W&&!C.solid[idx(e,y)])e++;for(let q=k;q<e;q++)run[idx(q,y)*2]=Math.min(255,e-k);k=e}}
  for(let xx=0;xx<W;xx++){let k=0;while(k<H){if(C.solid[idx(xx,k)]){k++;continue}let e=k;while(e<H&&!C.solid[idx(xx,e)])e++;for(let q=k;q<e;q++)run[idx(xx,q)*2+1]=Math.min(255,e-k);k=e}}
  for(let y=B;y<H-B;y++)for(let xx=B;xx<W-B;xx++){const i=idx(xx,y);if(C.solid[i]||C.zone[i]!==0)continue;const wd=Math.min(run[i*2],run[i*2+1]);
    if(wd>=7){x.fillStyle='rgba(243,213,122,.5)';x.fillRect(xx,y,1.03,1.03)}else if(wd<=2){x.fillStyle='rgba(120,86,44,.16)';x.fillRect(xx,y,1.03,1.03)}
    const r=hash2(xx,y,210);if(r<.05){x.fillStyle='rgba(110,78,40,.35)';x.fillRect(xx+hash2(xx,y,213),y+hash2(xx,y,214),.18,.18)}}
  // textures on lawns, tiled courts and markets
  for(let y=B;y<H-B;y++)for(let xx=B;xx<W-B;xx++){const i=idx(xx,y);if(C.solid[i])continue;const f=C.fl[i];if(!f)continue;const r=hash2(xx,y,211);
    if(f===4){if(r<.45){x.fillStyle='rgba(30,100,50,.2)';x.fillRect(xx,y,1.03,1.03)}if(r>.7){x.strokeStyle='rgba(25,80,35,.65)';x.lineWidth=.07;x.beginPath();const a=xx+hash2(xx,y,212),b=y+.9;x.moveTo(a-.2,b);x.lineTo(a-.3,b-.5);x.moveTo(a,b);x.lineTo(a,b-.6);x.moveTo(a+.2,b);x.lineTo(a+.3,b-.5);x.stroke()}
      if(r>.93){x.fillStyle=r>.97?MPKH.carm:MPKH.ivory;x.beginPath();x.arc(xx+.5,y+.5,.13,0,T);x.fill()}}
    else if(f===5){if(((xx+y)&1)===0){x.fillStyle='rgba(30,80,150,.25)';x.fillRect(xx,y,1.03,1.03)}if(((xx>>1)+(y>>1))%3===0){x.fillStyle='rgba(255,255,255,.22)';x.fillRect(xx,y,1.03,1.03)}}
    else if(f===2){if(((xx>>1)+(y>>1))&1){x.fillStyle='rgba(190,140,40,.14)';x.fillRect(xx,y,1.03,1.03)}}
    else if(f===3){x.fillStyle='rgba(120,80,30,.13)';x.fillRect(xx,y+.85,1.03,.15);if(((xx*7+y*3)&3)===0)x.fillRect(xx+.5,y,.12,1)}
    else if(f===1){if(((xx+y)&1)===0){x.fillStyle='rgba(120,80,30,.1)';x.fillRect(xx,y,1.03,1.03)}}}
  // plazas: inlaid stars on the paved courts, water channels and paths in the gardens
  for(const p of C.plazas){const pw=p.x1-p.x0+1,ph=p.y1-p.y0+1,cx=(p.x0+p.x1+1)/2,cy=(p.y0+p.y1+1)/2,mn=Math.min(pw,ph);
    if(p.z===3||p.z===4||p.z===5){x.strokeStyle='rgba(120,80,30,.5)';x.lineWidth=.14;x.strokeRect(p.x0+.8,p.y0+.8,pw-1.6,ph-1.6);
      for(let k=0;k<2;k++){mpKhemStar(x,cx,cy,mn*.4-k*mn*.14,mn*.2-k*mn*.07,8,-Math.PI/8);x.fillStyle=k?MPKH.turq:p.z===5?MPKH.lapis:MPKH.carm;x.globalAlpha=.55;x.fill();x.globalAlpha=1;x.strokeStyle=MPKH.gold;x.lineWidth=.18;x.stroke()}}
    if(p.z===2){x.fillStyle='rgba(243,226,170,.8)';x.fillRect(p.x0+.6,cy-.5,pw-1.2,1);x.fillRect(cx-.5,p.y0+.6,1,ph-1.2);x.strokeStyle='rgba(30,90,40,.7)';x.lineWidth=.16;x.strokeRect(p.x0+.6,p.y0+.6,pw-1.2,ph-1.2)}}
  // ---- courtyards inside the blocks: gardens with a pool and four beds ----
  const ym=new Uint8Array(W*H);for(let y=B;y<H-B;y++)for(let xx=B;xx<W-B;xx++){const i=idx(xx,y);if(C.solid[i]&&own[i]<0&&!(C.PB&&xx>=C.PB.x0&&xx<=C.PB.x1&&y>=C.PB.y0&&y<=C.PB.y1))ym[i]=1}
  const ii=new Int32Array((W+1)*(H+1));for(let y=0;y<H;y++){let s=0;for(let xx=0;xx<W;xx++){s+=ym[idx(xx,y)];ii[(y+1)*(W+1)+xx+1]=ii[y*(W+1)+xx+1]+s}}
  const box=(a,b,c,d)=>ii[(d+1)*(W+1)+c+1]-ii[b*(W+1)+c+1]-ii[(d+1)*(W+1)+a]+ii[b*(W+1)+a];
  const usedC=new Set();let courts=0;
  for(let y=B+1;y<H-B-5;y++)for(let xx=B+1;xx<W-B-5;xx++){if(box(xx,y,xx+4,y+4)!==25||hash2(xx,y,250)>.35)continue;const k=(xx>>3)+','+(y>>3);if(usedC.has(k))continue;usedC.add(k);courts++;
    x.fillStyle='#e8d8a8';x.fillRect(xx+.1,y+.1,4.8,4.8);for(let q=0;q<2;q++)for(let r=0;r<2;r++){x.fillStyle=(q+r)&1?'#5fa468':'#4e9a60';x.fillRect(xx+.5+q*2.1,y+.5+r*2.1,1.9,1.9)}
    x.fillStyle='#69c6d4';x.fillRect(xx+2.25,y+.3,.5,4.4);x.fillRect(xx+.3,y+2.25,4.4,.5);x.beginPath();x.arc(xx+2.5,y+2.5,.8,0,T);x.fill();x.strokeStyle='#e8d8a0';x.lineWidth=.16;x.stroke();x.fillStyle='#fff';x.beginPath();x.arc(xx+2.5,y+2.5,.2,0,T);x.fill();
    x.strokeStyle=I;x.lineWidth=.12;x.strokeRect(xx+.1,y+.1,4.8,4.8);x.fillStyle='#d8742a';for(const [dx,dy] of [[1.2,1.2],[3.8,1.2],[1.2,3.8],[3.8,3.8]]){x.beginPath();x.arc(xx+dx,y+dy,.24,0,T);x.fill()}}
  info.courts=courts;
  // bare yards: a few shrubs and old pots
  for(let y=B;y<H-B;y++)for(let xx=B;xx<W-B;xx++){const i=idx(xx,y);if(!ym[i])continue;const r=hash2(xx,y,221);if(r<.05){x.fillStyle='rgba(70,120,50,.7)';x.beginPath();x.arc(xx+.5,y+.5,.35,0,T);x.fill()}else if(r<.12){x.fillStyle='rgba(120,84,40,.3)';x.fillRect(xx+.2,y+.3,.5,.3)}}
  // ---- shadows of the buildings, falling south-east ----
  x.fillStyle='rgba(70,44,20,.24)';for(const b of blds){const t=b.m.kind==='temple'?.9:b.m.kind==='mansion'?.7:.5;x.fillRect(b.x0+t,b.y0+t*1.2,b.x1-b.x0+1,b.y1-b.y0+1)}
  blds.sort((a,b)=>(a.y1-b.y1)||(a.x0-b.x0));
  // special buildings
  const spec=new Map();for(const q of KH_BUILDINGS){if(!q.m)continue;if(q.id==='mosque')spec.set(q.m,'mosque');else if(q.id==='church')spec.set(q.m,'church');else if(q.room==='inn')spec.set(q.m,'inn')}
  const inns=[];
  for(const b of blds){let sp=null;for(const q of b.mods)if(spec.has(q))sp=spec.get(q);mpKhemBuilding(x,b,sp);if(sp==='inn')inns.push(b)}
  // the caravanserai: a courtyard of arcades with a fountain and a laden camel
  for(const b of inns){const px=b.x0,py=b.y0,w=b.x1-b.x0+1,h=b.y1-b.y0+1;x.fillStyle='#e8d6a0';x.fillRect(px+1,py+1,w-2,h-2);x.strokeStyle=I;x.lineWidth=.14;x.strokeRect(px+1,py+1,w-2,h-2);
    x.fillStyle='#1c1208';for(let q=0;q<w-2;q++){x.beginPath();x.arc(px+1.5+q,py+1.5,.34,Math.PI,0);x.fill();x.beginPath();x.arc(px+1.5+q,py+h-1.5,.34,Math.PI,0);x.fill()}
    const cx=px+w/2,cy=py+h/2;x.fillStyle='#69c6d4';x.beginPath();x.arc(cx,cy,Math.min(w,h)*.16,0,T);x.fill();x.strokeStyle='#f0e6c0';x.lineWidth=.2;x.stroke();
    x.save();x.translate(px+w*.28,py+h*.7);x.scale(.1,.1);mpKhemCamel(x,0,0,1,1,'#c99a58',MPKH.carm);x.restore();
    mpKhemAwning(x,px+w/2-1,py+h-.2,2,.9,MPKH.carm,MPKH.ivory,false)}
  // ---- the squares: ponds ----
  const sm=khShuffled(KH_POND_S,31),md=khShuffled(KH_POND_M,32),lg=khShuffled(KH_POND_L,33);let ns=0,nm=0,nl=0;const ponds=[];
  for(const p of C.plazas){if(p.z!==2)continue;
    const pw2=p.x1-p.x0+1,ph2=p.y1-p.y0+1,cx=(p.x0+p.x1)>>1,cy=(p.y0+p.y1)>>1,mn=Math.min(pw2,ph2),r=hash2(p.x0,p.y0,51);
    let cls=r<.4?0:r<.75?1:2;if(mn<14&&cls===2)cls=1;
    const rx=Math.max(2.4,mn*[.12,.2,.3][cls])+hash2(p.y0,p.x0,52)*(cls+1)*.9,ry=rx*(.62+hash2(p.x0,p.y1,53)*.3);
    const name=cls===0?sm[ns++%sm.length]:cls===1?md[nm++%md.length]:lg[nl++%lg.length];ponds.push({cx:cx+.5,cy:cy+.5,rx,ry,name,cls});
    const X=cx+.5,Y=cy+.5;
    x.fillStyle='rgba(60,40,20,.25)';x.beginPath();x.ellipse(X+.3,Y+.4,rx+.5,ry+.5,0,0,T);x.fill();
    x.fillStyle='#efe4b8';x.beginPath();x.ellipse(X,Y,rx+.45,ry+.45,0,0,T);x.fill();x.strokeStyle=I;x.lineWidth=.16;x.stroke();
    const g=x.createRadialGradient(X-rx*.3,Y-ry*.3,rx*.1,X,Y,rx);g.addColorStop(0,'#b0eaf0');g.addColorStop(.6,'#4fb4cc');g.addColorStop(1,'#2a78a0');x.fillStyle=g;x.beginPath();x.ellipse(X,Y,rx,ry,0,0,T);x.fill();x.strokeStyle='#235570';x.lineWidth=.12;x.stroke();
    x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=.12;for(let q=0;q<3+cls*3;q++){const a=hash2(q,p.x0,54)*T,rr=.3+hash2(q,p.y0,55)*.45;x.beginPath();x.ellipse(X+Math.cos(a)*rx*rr*.6,Y+Math.sin(a)*ry*rr*.6,rx*.2,ry*.12,0,0,3.5);x.stroke()}
    if(cls>=1){for(let q=0;q<4+cls*5;q++){const a=hash2(q,p.x1,56)*T,rr=.45+hash2(q,p.y1,57)*.45,lx=X+Math.cos(a)*rx*rr,ly=Y+Math.sin(a)*ry*rr;x.fillStyle='#3f8a4a';x.beginPath();x.ellipse(lx,ly,.55,.38,0,0,T);x.fill();if(q%3===0){x.fillStyle='#f4b8c8';x.beginPath();x.arc(lx,ly,.2,0,T);x.fill()}}}
    if(cls===2){x.fillStyle='#d6c488';x.beginPath();x.ellipse(X+rx*.35,Y-ry*.1,rx*.2,ry*.22,0,0,T);x.fill();x.strokeStyle=I;x.lineWidth=.1;x.stroke();mpKhemPalm(x,X+rx*.35,Y-ry*.15,1.1)}
    else{x.fillStyle='#f4f0e0';x.beginPath();x.arc(X,Y,Math.min(1,rx*.22),0,T);x.fill();x.strokeStyle=I;x.lineWidth=.1;x.stroke();x.strokeStyle='rgba(255,255,255,.95)';x.lineWidth=.14;x.beginPath();x.moveTo(X,Y);x.lineTo(X,Y-1.6);x.moveTo(X,Y-1);x.lineTo(X-.7,Y-2);x.moveTo(X,Y-1);x.lineTo(X+.7,Y-2);x.stroke()}
    if(cls>=1){for(let q=0;q<7+cls*4;q++){const a=q/(7+cls*4)*T+.3,ex=X+Math.cos(a)*(rx+1),ey=Y+Math.sin(a)*(ry+1);x.strokeStyle='#3f7a34';x.lineWidth=.14;x.beginPath();x.moveTo(ex,ey);x.lineTo(ex+Math.cos(a)*.4,ey-1);x.stroke()}}}
  C._ponds=C._ponds||ponds;info.ponds=ponds;
  // ---- the palace ----
  try{mpKhemCourt(x,C)}catch(e){console.error(e)}
  mpKhemPalace(x,C);
  // ---- trees, palms, stalls, wells (from the real city decor), cypress along the palace court ----
  const stallC=[['#c04a3a','#f0e0b8'],['#4a8a5a','#f0e0b8'],['#d09a30','#7a3a2a'],['#4a6aa0','#f0e0b8'],['#a04a8a','#f0e0b8'],['#c87a30','#f0e0b8']];
  const nd=L.decor.slice().sort((a,b)=>a.y-b.y);
  for(const d of nd){const px2=d.x+.5,py2=d.y+.5,k=d.k;
    if(/^dpalm|^kh_city2_0$/.test(k))mpKhemPalm(x,px2,py2,(d.sc||1)*.9);
    else if(/^kh_city2_1$|^ltree/.test(k))mpKhemTree(x,px2,py2,(d.sc||1)*.85);
    else if(/^kh_city2_[2345]$|^lbush/.test(k)){x.fillStyle='#4f8e4a';x.beginPath();x.arc(px2,py2,.5,0,T);x.fill();x.strokeStyle='rgba(20,60,25,.6)';x.lineWidth=.08;x.stroke();if(hash2(d.x,d.y,5)>.6){x.fillStyle='#e8c040';x.beginPath();x.arc(px2+.15,py2-.1,.13,0,T);x.fill()}}
    else if(k==='kh_city1_1'||k==='well'){x.fillStyle='#bfae88';x.beginPath();x.arc(px2,py2,.8,0,T);x.fill();x.strokeStyle=I;x.lineWidth=.12;x.stroke();x.fillStyle='#2f6a8c';x.beginPath();x.arc(px2,py2,.48,0,T);x.fill()}
    else if(k==='kh_city1_2'||k==='memorial'){x.fillStyle='rgba(50,36,16,.25)';x.beginPath();x.moveTo(px2,py2);x.lineTo(px2+2.5,py2+.6);x.lineTo(px2+.3,py2+.6);x.fill();x.fillStyle='#f4efe0';x.strokeStyle=I;x.lineWidth=.12;x.beginPath();x.moveTo(px2,py2-3.4);x.lineTo(px2+.7,py2+.5);x.lineTo(px2-.7,py2+.5);x.closePath();x.fill();x.stroke();x.fillStyle=MPKH.gold;x.beginPath();x.moveTo(px2,py2-3.4);x.lineTo(px2+.22,py2-2.8);x.lineTo(px2-.22,py2-2.8);x.fill()}
    else if(/^kh_stall[12]_/.test(k)){const c=stallC[(d.x+d.y)%6],aw=1.9,ah=1.2;x.fillStyle='rgba(50,36,16,.25)';x.fillRect(px2-aw/2+.3,py2-ah/2+.4,aw,ah);x.fillStyle='#b8946a';x.fillRect(px2-aw/2,py2-ah*.2,aw,ah*.7);mpKhemAwning(x,px2-aw/2,py2-ah*.7,aw,ah*.75,c[0],c[1],false)}
    else if(k==='kh_city1_3'||k==='statue'){x.fillStyle='rgba(50,36,16,.25)';x.beginPath();x.ellipse(px2+.3,py2+.4,.7,.4,0,0,T);x.fill();x.fillStyle='#ece4d0';x.strokeStyle=I;x.lineWidth=.1;x.fillRect(px2-.5,py2-.4,1,1);x.strokeRect(px2-.5,py2-.4,1,1);x.beginPath();x.arc(px2,py2-.9,.4,0,T);x.fill();x.stroke()}
    else if(k==='lamp'){x.fillStyle='rgba(246,200,70,.9)';x.beginPath();x.arc(px2,py2,.17,0,T);x.fill()}}
  // ---- minarets in elevation: the tall towers of the skyline, and one beside every fifth house of prayer ----
  const mins=[];for(const e of L.sky||[])if(/^kh_tow/.test(e.k))mins.push([e.x,e.y]);
  for(const b of blds)if(b.m.kind==='pray'&&hash2(b.x0,b.y0,260)<.22)mins.push([b.x1+.2,b.y1+.4]);
  const mq=KH_BUILDINGS.find(b=>b.id==='mosque');if(mq&&mq.m){const q=mq.m.cells[0];mins.push([q[0]-3,q[1]+3],[q[0]+7,q[1]+3])}
  mins.sort((a,b)=>a[1]-b[1]);const caps=[MPKH.turq,'#d6a82c',MPKH.carm,MPKH.lapis];
  mins.forEach(([mx,my],i)=>mpKhemMinaret(x,mx,my,7.2+hash2(i,2,261)*2.4,caps[i%4]));info.minarets=mins.length;
  // ---- the wall: stone band, courses, battlements, round towers, the two gates ----
  mpKhemWalls(x,C);
  x.restore()}
function mpKhemWalls(x,C){
  const W=C.W,H=C.H,B=KH.WALL,I=MPKH.ink,T=6.2832,gx=KH.CX+1;
  const side=(x0,y0,x1,y1)=>{ // a stone band with a darker outer face, a lit inner face and a walkway between
    const g=x.createLinearGradient(0,0,x1>x0+B*2?0:x1-x0,x1>x0+B*2?y1-y0:0);x.fillStyle='#c9b080';x.fillRect(x0,y0,x1-x0,y1-y0)};
  x.fillStyle='#c9b080';x.fillRect(0,0,W,B);x.fillRect(0,H-B,W,B);x.fillRect(0,B,B,H-2*B);x.fillRect(W-B,B,B,H-2*B);
  // outer face darker, inner face lighter, walkway pale
  x.fillStyle='#a88a58';x.fillRect(0,0,W,1.2);x.fillRect(0,H-1.2,W,1.2);x.fillRect(0,0,1.2,H);x.fillRect(W-1.2,0,1.2,H);
  x.fillStyle='#ddc898';x.fillRect(B-1.1,B-1.1,W-2*B+2.2,1.1);x.fillRect(B-1.1,H-B,W-2*B+2.2,1.1);x.fillRect(B-1.1,B,1.1,H-2*B);x.fillRect(W-B,B,1.1,H-2*B);
  x.fillStyle='#e6d4a8';x.fillRect(1.6,1.6,W-3.2,1.7);x.fillRect(1.6,H-3.3,W-3.2,1.7);x.fillRect(1.6,3.3,1.7,H-6.6);x.fillRect(W-3.3,3.3,1.7,H-6.6);
  // courses and joints
  x.strokeStyle='rgba(70,48,20,.45)';x.lineWidth=.1;x.beginPath();
  for(const t of [1.2,3.4,4.0]){x.moveTo(0,t);x.lineTo(W,t);x.moveTo(0,H-t);x.lineTo(W,H-t);x.moveTo(t,0);x.lineTo(t,H);x.moveTo(W-t,0);x.lineTo(W-t,H)}
  for(let q=0;q<W;q+=2.2){const o=((q/2.2)|0)&1?.6:0;x.moveTo(q+o,0);x.lineTo(q+o,1.2);x.moveTo(q+o,H-1.2);x.lineTo(q+o,H);x.moveTo(0,q+o);x.lineTo(1.2,q+o);x.moveTo(W-1.2,q+o);x.lineTo(W,q+o)}
  x.stroke();
  // battlements: merlons along the outer and the inner edge, pale with an inked outline
  x.fillStyle='#e0cc9c';x.strokeStyle=I;x.lineWidth=.1;
  const mer=(a,b,w,h)=>{x.fillRect(a,b,w,h);x.strokeRect(a,b,w,h)};
  for(let q=1;q<W-1;q+=1.7){mer(q,-.5,.95,1);mer(q,H-.5,.95,1);mer(-.5,q,1,.95);mer(W-.5,q,1,.95)}
  for(let q=B;q<W-B-1;q+=1.7){mer(q,B-.9,.9,.9);mer(q,H-B,.9,.9);mer(B-.9,q,.9,.9);mer(W-B,q,.9,.9)}
  x.strokeStyle=I;x.lineWidth=.3;x.strokeRect(0,0,W,H);x.lineWidth=.22;x.strokeRect(B,B,W-2*B,H-2*B);
  // round towers: shadow, stone drum, battlement ring, a cap in turquoise, terracotta or gold
  const tower=(cx,cy,r,cap)=>{x.fillStyle='rgba(50,34,16,.3)';x.beginPath();x.ellipse(cx+r*.35,cy+r*.45,r*1.05,r*.95,0,0,T);x.fill();
    const g=x.createRadialGradient(cx-r*.4,cy-r*.4,r*.1,cx,cy,r);g.addColorStop(0,'#f2e4b8');g.addColorStop(1,'#b09668');x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,T);x.fill();x.strokeStyle=I;x.lineWidth=.28;x.stroke();
    x.fillStyle='#e0cc9c';const n=Math.round(r*3.2);for(let i=0;i<n;i++){const a=i/n*T;x.beginPath();x.arc(cx+Math.cos(a)*r*.9,cy+Math.sin(a)*r*.9,r*.13,0,T);x.fill();x.lineWidth=.1;x.stroke()}
    mpKhemDome(x,cx,cy,r*.66,cap,10,true);};
  const gateN=Math.abs,caps=[MPKH.turq,'#b8603e','#d6a82c',MPKH.lapis];let ci=0;
  for(const [tx,ty] of [[B/2,B/2],[W-B/2,B/2],[B/2,H-B/2],[W-B/2,H-B/2]])tower(tx,ty,5.2,MPKH.turq);
  for(let t=20;t<W-14;t+=22){const c=caps[(ci++)%4];
    tower(t,B/2,3.6,c);if(Math.abs(t-gx)>20)tower(t,H-B/2,3.6,caps[(ci)%4]);
    tower(B/2,t,3.6,caps[(ci+1)%4]);if(Math.abs(t-200.5)>16)tower(W-B/2,t,3.6,caps[(ci+2)%4])}
  // the two gates in elevation
  mpKhemGate(x,gx-.5,H+1,1.15);mpKhemGate(x,W-.5,206,.78)}
/* ------------------------------ names laid over the city ------------------------------ */
function mpKhemLabels(x,C,F,labels){
  const SZ={dist:[4.2,'#7a1620',.8],major:[2.7,'#4a1a08',.5],plaza:[2.2,null,.25],pond:[1.7,'#1f5a7a',.15],road:[2.4,null,.4],street:[1.4,null,.08],lane:[1.25,null,.05],tower:[1.65,null,.12],shop:[1.5,null,.05],shopm:[1.8,null,.12],small:[1.3,null,.05]};
  const ff=mpKhemFont(),cell=7,grid=new Map(),placed=[];
  const hit=(x0,y0,w,h)=>{for(let gx=Math.floor(x0/cell);gx<=Math.floor((x0+w)/cell);gx++)for(let gy=Math.floor(y0/cell);gy<=Math.floor((y0+h)/cell);gy++){const l=grid.get(gx+','+gy);if(l)for(const r of l)if(x0<r[0]+r[2]&&x0+w>r[0]&&y0<r[1]+r[3]&&y0+h>r[1])return true}return false};
  const add=(x0,y0,w,h)=>{for(let gx=Math.floor(x0/cell);gx<=Math.floor((x0+w)/cell);gx++)for(let gy=Math.floor(y0/cell);gy<=Math.floor((y0+h)/cell);gy++){const k=gx+','+gy;(grid.get(k)||grid.set(k,[]).get(k)).push([x0,y0,w,h])}};
  const order=labels.slice().sort((a,b)=>a.pri-b.pri);let n=0;
  x.save();x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
  for(const l of order){
    const z=SZ[l.k]||SZ.shop,sz=z[0],sx=F.ox+l.x*F.s,sy=F.oy+l.y*F.s;
    x.font=`${l.ital?'italic ':''}bold ${sz}px ${ff}`;mpKhemLS(x,z[2]+'px');const w=x.measureText(l.t).width+.6;
    const rot=l.rot?true:false,bw=(rot?sz:w)+.5,bh=(rot?w:sz)+.5,x0=sx-bw/2,y0=sy-bh/2;
    if(hit(x0,y0,bw,bh))continue;add(x0,y0,bw,bh);n++;
    x.save();x.translate(sx,sy);if(rot)x.rotate(l.rot);
    x.lineWidth=Math.max(.7,sz*.34);x.strokeStyle='rgba(248,238,204,.9)';x.strokeText(l.t,0,0);x.fillStyle=z[1]||l.col||MPKH.ink;x.fillText(l.t,0,0);x.restore()}
  mpKhemLS(x,'0px');x.restore();return n}
/* ------------------------------ key, notes, margins ------------------------------ */
function mpKhemKey(x){
  const a=391,b=94,w=77;mpKhemPanel(x,a,b,w,126);const ff=mpKhemFont();
  x.save();x.font=`bold 6.6px ${ff}`;x.textAlign='center';x.textBaseline='middle';mpKhemLS(x,'1px');x.fillStyle=MPKH.carm;x.fillText('KEY',a+w/2,b+8);mpKhemLS(x,'0px');
  x.strokeStyle=MPKH.gold;x.lineWidth=.5;x.beginPath();x.moveTo(a+9,b+13);x.lineTo(a+w-9,b+13);x.stroke();
  const rows=[['Houses',(g)=>{g.fillStyle='#f4ecd6';g.fillRect(-1.6,-1.2,3.2,2.4);g.strokeStyle=MPKH.ink;g.lineWidth=.12;g.strokeRect(-1.6,-1.2,3.2,2.4);g.fillStyle='#1c1208';g.fillRect(-.2,.2,.4,.8)}],
    ['Shops, with awnings',(g)=>{g.fillStyle='#f4ecd6';g.fillRect(-1.6,-1.6,3.2,2.2);g.strokeStyle=MPKH.ink;g.lineWidth=.12;g.strokeRect(-1.6,-1.6,3.2,2.2);mpKhemAwning(g,-1.6,.6,3.2,.9,MPKH.carm,MPKH.ivory,false)}],
    ['Mosques and temples',(g)=>mpKhemDome(g,0,0,1.5,MPKH.turq,8,true)],
    ['Baths',(g)=>{mpKhemDome(g,-.9,0,.9,'#3fa8a8',6,false);mpKhemDome(g,1,0,.9,'#58c4bc',6,false)}],
    ['Caravanserai',(g)=>{g.fillStyle='#e8d6a0';g.fillRect(-1.6,-1.4,3.2,2.8);g.strokeStyle=MPKH.ink;g.lineWidth=.12;g.strokeRect(-1.6,-1.4,3.2,2.8);g.fillStyle='#69c6d4';g.beginPath();g.arc(0,0,.6,0,6.3);g.fill()}],
    ['Gardens and courts',(g)=>{g.fillStyle='#63a56a';g.fillRect(-1.6,-1.4,3.2,2.8);g.fillStyle='#69c6d4';g.fillRect(-.2,-1.4,.4,2.8);g.fillRect(-1.6,-.2,3.2,.4);g.strokeStyle=MPKH.ink;g.lineWidth=.12;g.strokeRect(-1.6,-1.4,3.2,2.8)}],
    ['Pools and fountains',(g)=>{g.fillStyle='#4fb4cc';g.beginPath();g.ellipse(0,0,1.7,1.1,0,0,6.3);g.fill();g.strokeStyle=MPKH.ink;g.lineWidth=.12;g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(0,0,.3,0,6.3);g.fill()}],
    ['Minarets',(g)=>mpKhemMinaret(g,0,2.2,4.4,MPKH.turq)],
    ['Palms and trees',(g)=>mpKhemPalm(g,0,0,1)],
    ['Ruins',(g)=>{g.fillStyle='#b9a888';g.fillRect(-1.6,-1.2,3.2,2.4);g.strokeStyle='rgba(40,28,16,.8)';g.lineWidth=.12;g.beginPath();g.moveTo(-.6,-1.2);g.lineTo(-.2,.1);g.lineTo(-.7,1.2);g.stroke()}],
    ['A shop door',(g)=>{g.fillStyle='#ffd23a';g.beginPath();g.arc(0,0,1.1,0,6.3);g.fill();g.strokeStyle=MPKH.ink;g.lineWidth=.2;g.stroke();g.strokeStyle='#a06a00';g.lineWidth=.22;g.beginPath();g.arc(0,0,.55,0,6.3);g.stroke()}]];
  rows.forEach(([t,fn],i)=>{const y=b+21+i*9.6;x.save();x.translate(a+10,y);x.scale(2.1,2.1);fn(x);x.restore();x.font=`bold 5.2px ${ff}`;x.textAlign='left';x.textBaseline='middle';x.fillStyle='#3a2208';x.fillText(t,a+20,y+.3)});
  x.restore()}
function mpKhemNotes(x){return 84; // no notes to the player on the maps
  const a=15,b=84,w=71;const notes=['Khemetra is a walled city, 400 squares across. Its wall has round towers and two gates.','The Great Gate in the south wall opens on the desert road. The Sea Gate in the east wall leads to the tunnel to Yarrim.','The Palace of Khemetra stands at the centre, with the Court of the Golden Sun before it.','The Beggars\' Quarter in the east is not safe. The Old Quarter in the north west is mostly ruins.','Zoom in to read the streets, lanes and shops.'];
  const ff=mpKhemFont();x.save();x.font=`5.5px ${ff}`;let lines=0;const wrapped=notes.map(n=>{const l=mplWrap(x,n,w-14,5.5);lines+=l.length;return l});
  const h=lines*6.5+notes.length*2.4+6;mpKhemPanel(x,a,b,w,h);let y=b+8;
  wrapped.forEach(l=>{x.fillStyle=MPKH.carm;x.beginPath();x.moveTo(a+5,y-2);x.lineTo(a+7,y);x.lineTo(a+5,y+2);x.lineTo(a+3,y);x.closePath();x.fill();x.fillStyle='#2f1c08';x.font=`5.5px ${ff}`;x.textAlign='left';x.textBaseline='middle';for(const s of l){x.fillText(s,a+9,y);y+=6.5}y+=2.4});
  x.restore();return b+h}
/* a small scene in an ogee-arched window: sky, sun, a dune, and whatever fn paints */
function mpKhemScene(x,cx,w,ya,ys,yb,fn){
  x.save();mpKhemOgee(x,cx,w,ya,ys,yb);x.clip();
  const g=x.createLinearGradient(0,ya,0,yb);g.addColorStop(0,'#8fd0cc');g.addColorStop(.55,'#d6ecd8');g.addColorStop(1,'#f6e4aa');x.fillStyle=g;x.fillRect(cx-w/2,ya,w,yb-ya);
  x.fillStyle='rgba(255,236,150,.95)';x.beginPath();x.arc(cx+w*.18,ya+(yb-ya)*.38,(yb-ya)*.09,0,6.3);x.fill();x.strokeStyle='rgba(200,140,20,.6)';x.lineWidth=.4;x.stroke();
  x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=.5;x.lineCap='round';for(const [a,b,l] of [[-.3,.5,9],[.2,.3,7]]){x.beginPath();x.moveTo(cx+a*w,ya+(yb-ya)*b);x.quadraticCurveTo(cx+a*w+l/2,ya+(yb-ya)*b-1,cx+a*w+l,ya+(yb-ya)*b);x.stroke()}
  x.fillStyle='#e6c47c';x.beginPath();x.moveTo(cx-w/2,yb);x.quadraticCurveTo(cx-w*.2,yb-9,cx+w*.1,yb-4.5);x.quadraticCurveTo(cx+w*.3,yb-2,cx+w/2,yb-7);x.lineTo(cx+w/2,yb);x.fill();
  x.fillStyle='#d4aa60';x.beginPath();x.moveTo(cx-w/2,yb);x.quadraticCurveTo(cx-w*.3,yb-4,cx,yb-1.5);x.quadraticCurveTo(cx+w*.3,yb-4,cx+w/2,yb);x.fill();
  fn();x.restore();
  mpKhemOgee(x,cx,w,ya,ys,yb);x.strokeStyle=MPKH.gold;x.lineWidth=1.3;x.stroke();mpKhemOgee(x,cx,w+3,ya-1.4,ys,yb+1.4);x.strokeStyle=MPKH.indigo;x.lineWidth=.9;x.stroke();x.strokeStyle=MPKH.ink;x.lineWidth=.3;mpKhemOgee(x,cx,w+4.6,ya-2,ys,yb+2);x.stroke()}
function mpKhemMargins(x,yTop){
  const yb=290,ya=Math.min(yTop+3,yb-36);
  mpKhemScene(x,50,64,ya,ya+10,yb,()=>{mpKhemPalmElev(x,30,yb-3,22,3);mpKhemPalmElev(x,38,yb-2,16,-3);mpKhemCamel(x,66,yb-9,.8,-1,'#c99a58',MPKH.turq)});
  mpKhemScene(x,430,66,226,240,yb,()=>{
    mpKhemMinaret(x,413,yb-3,36,MPKH.turq);mpKhemMinaret(x,449,yb-3,28,'#d6a82c');
    x.save();x.translate(431,yb-3);x.fillStyle='#f6ecd0';x.strokeStyle=MPKH.ink;x.lineWidth=.5;x.fillRect(-10,-11,20,11);x.strokeRect(-10,-11,20,11);const dg=x.createRadialGradient(-3,-19,1,0,-13,11);dg.addColorStop(0,'#8fe0d8');dg.addColorStop(1,MPKH.turq);x.fillStyle=dg;x.beginPath();x.moveTo(-8.5,-11);x.bezierCurveTo(-10,-24,10,-24,8.5,-11);x.closePath();x.fill();x.stroke();x.fillStyle=MPKH.gold;x.beginPath();x.arc(0,-20.8,.9,0,6.3);x.fill();x.stroke();x.beginPath();x.moveTo(0,-21.7);x.lineTo(0,-25);x.stroke();
    x.fillStyle='#1c1208';x.beginPath();x.moveTo(-2.6,0);x.lineTo(-2.6,-4.6);x.arc(0,-4.9,2.8,Math.PI*.9,Math.PI*.1+Math.PI*2);x.lineTo(2.6,0);x.fill();x.restore()})}
function mpKhemFrieze(x){
  // a vine scroll in the band above the drawing: gold stem, turquoise and carmine leaves, with a star medallion in the middle
  x.save();x.beginPath();x.rect(96,12,224,15);x.clip();const y0=19.5;
  x.strokeStyle=MPKH.gold;x.lineWidth=.7;x.beginPath();for(let t=96;t<=320;t+=.8){const y=y0+Math.sin(t*.28)*3.1;t>96?x.lineTo(t,y):x.moveTo(t,y)}x.stroke();
  for(let t=100;t<320;t+=11.2){const s=((t-100)/11.2|0)&1?-1:1,yy=y0+Math.sin(t*.28)*3.1;
    x.fillStyle=s>0?MPKH.turq:MPKH.carm;x.strokeStyle=MPKH.ink;x.lineWidth=.3;x.beginPath();x.moveTo(t,yy);x.quadraticCurveTo(t+3,yy+s*5.5,t+6.5,yy+s*2.2);x.quadraticCurveTo(t+3.5,yy+s*.2,t,yy);x.fill();x.stroke();
    x.fillStyle=MPKH.gold2;x.beginPath();x.arc(t+5.6,yy-s*3.4,.9,0,6.3);x.fill();x.stroke()}
  x.restore();
  x.strokeStyle=MPKH.gold;x.lineWidth=.6;x.strokeRect(96,12,224,15);x.strokeStyle=MPKH.indigo;x.lineWidth=.5;x.strokeRect(97.5,13.5,221,12);
  mpKhemStar(x,208,19.5,9,5.4,8,-Math.PI/8);x.fillStyle=MPKH.indigo;x.fill();x.strokeStyle=MPKH.gold;x.lineWidth=.8;x.stroke();mpKhemStar(x,208,19.5,5.2,3,8);x.fillStyle=MPKH.turq;x.fill();x.fillStyle=MPKH.carm;x.beginPath();x.arc(208,19.5,1.8,0,6.3);x.fill();x.fillStyle=MPKH.gold2;x.beginPath();x.arc(208,19.5,.7,0,6.3);x.fill()}
/* ------------------------------ the whole sheet ------------------------------ */
function mpKhemDraw(c,x,L){
  const C=KH_CITY,F=MPKH.F=mplFit(400,400,20),t0=performance.now(),info={};
  try{mpKhemPage(x)}catch(e){console.error(e)}
  try{mpKhemDunes(x,F);
    // the desert road from the Great Gate, bending east, and the track from the Sea Gate
    const gx=F.ox+(KH.CX+1)*F.s,gb=F.oy+400*F.s;
    x.save();x.beginPath();x.rect(MPL.AREA.x,MPL.AREA.y,MPL.AREA.w,MPL.AREA.h);x.clip();
    mpKhemTrack(x,[[gx,gb],[gx,gb+7],[gx-6,gb+13],[gx-40,gb+15],[gx-80,gb+10]],5);
    mpKhemTrack(x,[[F.ox+400*F.s,F.oy+200.5*F.s],[F.ox+400*F.s+14,F.oy+201*F.s],[MPL.AREA.x+MPL.AREA.w,F.oy+206*F.s]],3.6);
    mpKhemOasis(x,MPL.AREA.x+17,MPL.AREA.y+70,1.05);mpKhemOasis(x,MPL.AREA.x+MPL.AREA.w-16,MPL.AREA.y+MPL.AREA.h-60,.85);
    mpKhemCaravan(x,gx-92,gb+13.5,3,.78,1);
    x.restore();
  }catch(e){console.error(e)}
  let labels=[];
  try{mpKhemCity(x,C,F,info)}catch(e){console.error(e)}
  try{ // the names: gathered by the plain map's own lists, then placed once on the sheet, greater names first
    const sm=C._shopMarks,pn=C._ponds;C._shopMarks=[];if(info.ponds)C._ponds=info.ponds;
    labels=khMapLabels(C).filter(l=>l.t!=='THE GREAT GATE'&&l.t!=='THE SEA GATE');info.marks=C._shopMarks;C._shopMarks=sm;C._ponds=pn;
    x.save();x.beginPath();x.rect(MPL.AREA.x,MPL.AREA.y,MPL.AREA.w,MPL.AREA.h);x.clip();
    // shop doors: a gold coin
    for(const m of info.marks||[]){const sx=F.ox+m.x*F.s,sy=F.oy+m.y*F.s;x.fillStyle='#3a1c00';x.beginPath();x.arc(sx,sy,.9,0,6.3);x.fill();x.fillStyle='#ffd23a';x.beginPath();x.arc(sx,sy,.7,0,6.3);x.fill();x.strokeStyle='#a06a00';x.lineWidth=.2;x.beginPath();x.arc(sx,sy,.38,0,6.3);x.stroke()}
    info.labels=mpKhemLabels(x,C,F,labels);
    x.restore();
  }catch(e){console.error(e)}
  try{ // the signs outside the gates
    x.save();x.beginPath();x.rect(MPL.AREA.x,MPL.AREA.y,MPL.AREA.w,MPL.AREA.h);x.clip();x.font=`italic bold 2.2px ${mpKhemFont()}`;x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
    const put=(t,a,b,col)=>{x.lineWidth=1;x.strokeStyle='rgba(248,238,204,.9)';x.strokeText(t,a,b);x.fillStyle=col;x.fillText(t,a,b)};
    put('The Desert Road',F.ox+(KH.CX+1)*F.s+30,F.oy+400*F.s+9,'#5a3408');put('THE GREAT GATE',F.ox+(KH.CX+1)*F.s+2,F.oy+400*F.s+3.6,'#4a1a08');put('THE SEA GATE',F.ox+400*F.s+16,F.oy+200.5*F.s-7,'#1a3a6a');put('To the Sea Tunnel and Yarrim',F.ox+400*F.s+16,F.oy+200.5*F.s+8,'#1a3a6a');
    x.restore()}catch(e){console.error(e)}
  try{mpKhemAreaFrame(x);mpKhemFrieze(x);mpmgDraw(x,44);mpKhemBorder(x);mpKhemTitle(x);mpKhemCompass(x,431,60,18);mpKhemKey(x);const yb=mpKhemNotes(x);mpKhemMargins(x,yb+4)}catch(e){console.error(e)}
  info.ms=Math.round(performance.now()-t0);MPKH.info=info}
/* the sheet is built at 6 times the screen size (the shared installer builds at 3), so the install is done here in the same way */
(function(){
  const _do=drawOverview;
  drawOverview=function(){
    if(LEVEL!==44||G.world||G.teleMode||!LEVELS[LEVEL]||typeof KH_CITY==='undefined'||!KH_CITY)return _do.apply(this,arguments);
    BTNS=[];veil(.95);
    let c=MPKH.cache;
    if(!c){c=document.createElement('canvas');c.width=DW*MPKH.S;c.height=DH*MPKH.S;const x=c.getContext('2d');x.scale(MPKH.S,MPKH.S);try{mpKhemDraw(c,x,LEVELS[LEVEL])}catch(e){console.error(e)}MPKH.cache=c}
    const F=MPKH.F;MPL.reveal=false;
    mplPaint(c,MPKH.S,MPL.AREA,cx=>F.X(cx),cy=>F.Y(cy),'');
    // the live marks go over the painting: quest rings, donkey rides, rumours and the cistern hatch
    const A=MPL.AREA,z=mplZoom(),sx0=A.x-G.panX/z,sy0=A.y-G.panY/z,cs=F.s*z,ox=A.x+(F.X(0)-sx0)*z,oy=A.y+(F.Y(0)-sy0)*z;
    ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();
    try{if(typeof drawQuestRings==='function')drawQuestRings(ox,oy,Math.max(cs,.9));if(z>=1.8&&typeof drawDonkeyMarks==='function')drawDonkeyMarks(ox,oy,Math.max(cs,.9));if(typeof drawRumourMarks==='function')drawRumourMarks(ox,oy,Math.max(cs,.9));
      if(G.flags&&G.flags.khWizardKnown&&typeof KH_HATCH!=='undefined'){const hx=ox+(KH_HATCH.x+.5)*cs,hy=oy+(KH_HATCH.y+.5)*cs;ctx.fillStyle='#7a1a10';ctx.beginPath();ctx.arc(hx,hy,Math.max(2,cs*.5),0,Math.PI*2);ctx.fill();ctx.font=`bold ${clamp(cs*1.4,6,9)}px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=3;ctx.strokeStyle='rgba(244,234,196,.92)';ctx.strokeText('Hatch to the Cisterns',hx,hy-cs*2);ctx.fillStyle='#7a1a10';ctx.fillText('Hatch to the Cisterns',hx,hy-cs*2)}}catch(e){console.error(e)}
    ctx.restore()}})();
