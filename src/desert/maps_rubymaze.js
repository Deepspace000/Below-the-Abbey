/* ==========================================================================
   THE RUBY MAZE, area map (level 500, the maze behind Dorn's store in Ironhill). One illuminated sheet drawn from the real level rows, fmap and decor:
   ruby walls with a gold inlaid cap, dark polished chequer floors, warm torch light, the walled garden in the heart with its flowerbeds, fountain and chest,
   the gold door and steps at the south west. No notes, no hints: only the title, a subtitle, place names and a key. Names start with mpRm.
   ========================================================================== */
const MPRM_SEED=5005;
const mpRmH=(a,b,s)=>hash2(a,b,MPRM_SEED+(s||0));
const MPRM={
  ruby:['#9c1429','#a8192d','#b31f34','#93102a'],
  inkR:'#1c0309',hiR:'#f27882',dkR:'#3a0610',
  gold:'#d6ab2e',gold2:'#f6e08a',goldD:'#7c5a0c',
  floor:['#301c26','#412a35'],
  grass:['#97b66b','#8cab61','#a1c076','#92b266'],
  leaf:'#356f45',leaf2:'#5d9d62'};
/* ---- small drawing tools ---- */
function mpRmGlow(x,a,b,r,rgb,al,add){x.save();if(add)x.globalCompositeOperation='lighter';const g=x.createRadialGradient(a,b,0,a,b,r);g.addColorStop(0,`rgba(${rgb},${al})`);g.addColorStop(.55,`rgba(${rgb},${al*.4})`);g.addColorStop(1,`rgba(${rgb},0)`);x.fillStyle=g;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();x.restore()}
function mpRmBlob(x,a,b,r,n,sd,fill,stk,lw){x.beginPath();for(let i=0;i<=n;i++){const an=i/n*6.283,rr=r*(.86+.28*mpRmH(sd,i%n,60));const px=a+Math.cos(an)*rr,py=b+Math.sin(an)*rr;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();if(fill){x.fillStyle=fill;x.fill()}if(stk){x.strokeStyle=stk;x.lineWidth=lw||.4;x.stroke()}}
function mpRmFlame(x,a,b,k){k=k||1;x.save();x.lineJoin='round';
  x.fillStyle='#f08a1c';x.strokeStyle='#5a1a08';x.lineWidth=.35;x.beginPath();x.moveTo(a,b-3*k);x.bezierCurveTo(a+1.9*k,b-1.2*k,a+1.5*k,b+1.5*k,a,b+1.6*k);x.bezierCurveTo(a-1.5*k,b+1.5*k,a-1.9*k,b-1.2*k,a,b-3*k);x.fill();x.stroke();
  x.fillStyle='#ffe58a';x.beginPath();x.moveTo(a,b-1.2*k);x.bezierCurveTo(a+.9*k,b-.2*k,a+.8*k,b+1*k,a,b+1.1*k);x.bezierCurveTo(a-.8*k,b+1*k,a-.9*k,b-.2*k,a,b-1.2*k);x.fill();x.restore()}
function mpRmLeaf(x,a,b,len,ang,col){x.save();x.translate(a,b);x.rotate(ang);x.fillStyle=col||'#4f8a52';x.strokeStyle=MPL.INK;x.lineWidth=.3;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(len*.5,-len*.38,len,0);x.quadraticCurveTo(len*.5,len*.38,0,0);x.fill();x.stroke();x.strokeStyle='rgba(20,50,24,.7)';x.lineWidth=.22;x.beginPath();x.moveTo(len*.08,0);x.lineTo(len*.86,0);x.stroke();x.restore()}
/* a heraldic rose: five ruby petals, five lighter ones, a gold seed */
function mpRmRose(x,a,b,r,rot){x.save();x.translate(a,b);x.rotate(rot||0);x.lineJoin='round';
  x.strokeStyle=MPL.INK;x.lineWidth=Math.max(.25,r*.07);
  for(let i=0;i<5;i++){const an=i*1.2566;x.fillStyle=i%2?'#b81f30':'#c42a3c';x.beginPath();x.arc(Math.cos(an)*r*.56,Math.sin(an)*r*.56,r*.5,0,6.3);x.fill();x.stroke()}
  for(let i=0;i<5;i++){const an=i*1.2566+.6283;x.fillStyle='#e0525e';x.beginPath();x.arc(Math.cos(an)*r*.3,Math.sin(an)*r*.3,r*.3,0,6.3);x.fill();x.stroke()}
  x.fillStyle=MPL.GOLD;x.beginPath();x.arc(0,0,r*.2,0,6.3);x.fill();x.stroke();x.fillStyle='#fff3b8';x.beginPath();x.arc(-r*.05,-r*.05,r*.07,0,6.3);x.fill();x.restore()}
/* a vine of leaves, buds and roses along a wavy line from (x0,y0) to (x1,y1) */
function mpRmVine(x,x0,y0,x1,y1,amp,roses,sd,rs){const n=Math.max(8,Math.round(Math.hypot(x1-x0,y1-y0)/2)),P=[];
  const nx=-(y1-y0)/Math.hypot(x1-x0,y1-y0),ny=(x1-x0)/Math.hypot(x1-x0,y1-y0);
  for(let i=0;i<=n;i++){const t=i/n,w=Math.sin(t*6.283*roses/2+sd)*amp;P.push([x0+(x1-x0)*t+nx*w,y0+(y1-y0)*t+ny*w])}
  x.save();x.lineCap='round';x.lineJoin='round';
  x.strokeStyle=MPL.INK;x.lineWidth=1.5;x.beginPath();P.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();
  x.strokeStyle='#4a8a4e';x.lineWidth=.9;x.beginPath();P.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();
  for(let i=2;i<n-1;i+=2){const p=P[i],q=P[i+1],an=Math.atan2(q[1]-p[1],q[0]-p[0]),side=(i/2)%2?1:-1;mpRmLeaf(x,p[0],p[1],3.6+1.4*mpRmH(i,sd,3),an+side*(.9+.5*mpRmH(i,sd,4)),i%4?'#4f8a52':'#6aa468')}
  for(let k=0;k<roses;k++){const i=Math.round((k+.5)/roses*n),p=P[Math.min(n,i)];mpRmRose(x,p[0],p[1],(rs||3.1)*(.85+.3*mpRmH(k,sd,5)),mpRmH(k,sd,6)*6)}
  for(let i=4;i<n-2;i+=6){const p=P[i],s2=(i%12?1:-1);x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.25;x.beginPath();x.arc(p[0]+s2*2.6,p[1]+(mpRmH(i,sd,7)-.5)*3,.8,0,6.3);x.fill();x.stroke()}
  x.restore()}
function mpRmSeal(x,a,b,r){x.save();x.lineJoin='round';
  x.fillStyle='rgba(40,18,10,.3)';mpRmBlob(x,a+1,b+1.4,r,13,3,x.fillStyle);
  // two ribbon tails
  for(const [dx,col,sk] of [[-r*.38,'#7a1022',-.5],[r*.34,'#c99a22',.45]]){x.fillStyle=col;x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.moveTo(a+dx-r*.17,b+r*.5);x.lineTo(a+dx+r*.17,b+r*.5);x.lineTo(a+dx+r*.17+sk*r*.9,b+r*1.7);x.lineTo(a+dx+sk*r*.9,b+r*1.42);x.lineTo(a+dx-r*.17+sk*r*.9,b+r*1.7);x.closePath();x.fill();x.stroke()}
  mpRmBlob(x,a,b,r,13,3,'#b11f2c',MPL.INK,.6);
  x.fillStyle='rgba(255,170,170,.35)';x.beginPath();x.ellipse(a-r*.35,b-r*.4,r*.4,r*.2,-.6,0,6.3);x.fill();
  x.strokeStyle='rgba(60,4,10,.55)';x.lineWidth=.55;x.beginPath();x.arc(a,b,r*.72,0,6.3);x.stroke();
  x.strokeStyle='rgba(255,150,150,.4)';x.lineWidth=.35;x.beginPath();x.arc(a-.3,b-.3,r*.78,3.4,5.1);x.stroke();
  mpRmRose(x,a,b,r*.5,.3);x.restore()}
function mpRmKey(x,a,b,len,rot){x.save();x.translate(a,b);x.rotate(rot||0);x.lineJoin='round';x.lineCap='round';
  const gr=x.createLinearGradient(0,-3,0,3);gr.addColorStop(0,'#fbe9a0');gr.addColorStop(.5,MPL.GOLD);gr.addColorStop(1,'#8a6a14');
  x.fillStyle='rgba(40,18,10,.25)';x.fillRect(-len/2+1,-.6,len,2.4);
  x.fillStyle=gr;x.strokeStyle=MPL.INK;x.lineWidth=.6;
  x.beginPath();x.rect(-len/2+4.6,-1,len-5.6,2);x.fill();x.stroke();
  for(const [o,h] of [[len/2-2.2,3.4],[len/2-5,2.6],[len/2-7.4,3.4]]){x.beginPath();x.rect(o-.9,0,1.8,h);x.fill();x.stroke()}
  x.beginPath();x.arc(-len/2+3,0,3.4,0,6.3);x.fill();x.stroke();x.fillStyle='#b11f2c';x.beginPath();x.arc(-len/2+3,0,1.5,0,6.3);x.fill();x.stroke();
  x.strokeStyle='rgba(255,246,200,.8)';x.lineWidth=.35;x.beginPath();x.arc(-len/2+3,0,2.5,3.6,5);x.stroke();x.restore()}
/* a cut ruby seen from the side: crown, girdle and pavilion with its facets */
function mpRmGem(x,a,b,r){x.save();x.lineJoin='round';
  mpRmGlow(x,a,b,r*2.2,'255,70,90',.28,false);
  const T=[[-.55,-.78],[.55,-.78],[1,-.2],[0,1],[-1,-.2]];
  const P=(i)=>[a+T[i][0]*r,b+T[i][1]*r];
  const fac=(pts,col)=>{x.fillStyle=col;x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fill()};
  const tl=P(0),tr=P(1),gr=P(2),ap=P(3),gl=P(4),m1=[a-.22*r,b-.2*r],m2=[a+.22*r,b-.2*r];
  fac([tl,tr,m2,m1],'#f0707a');fac([tl,m1,gl],'#c9283c');fac([tr,gr,m2],'#a4162b');fac([gl,m1,ap],'#8a1024');fac([m1,m2,ap],'#d8404f');fac([m2,gr,ap],'#5e0a1a');
  x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();T.forEach((t,i)=>{const p=P(i);i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])});x.closePath();x.stroke();
  x.lineWidth=.35;x.beginPath();x.moveTo(gl[0],gl[1]);x.lineTo(gr[0],gr[1]);x.moveTo(m1[0],m1[1]);x.lineTo(m2[0],m2[1]);x.moveTo(tl[0],tl[1]);x.lineTo(m1[0],m1[1]);x.moveTo(tr[0],tr[1]);x.lineTo(m2[0],m2[1]);x.moveTo(m1[0],m1[1]);x.lineTo(ap[0],ap[1]);x.moveTo(m2[0],m2[1]);x.lineTo(ap[0],ap[1]);x.stroke();
  // a sparkle
  x.strokeStyle='#fff6d8';x.lineWidth=.5;const sx=a-r*.5,sy=b-r*.55;x.beginPath();x.moveTo(sx-r*.32,sy);x.lineTo(sx+r*.32,sy);x.moveTo(sx,sy-r*.32);x.lineTo(sx,sy+r*.32);x.stroke();x.restore()}
/* a gold lantern with a warm glow */
function mpRmLantern(x,a,b,k,glow){k=k||1;x.save();if(glow)mpRmGlow(x,a,b,7*k,'255,200,90',.55,false);
  x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillStyle='#f7cf62';x.fillRect(a-1.3*k,b-1.6*k,2.6*k,3.2*k);x.strokeRect(a-1.3*k,b-1.6*k,2.6*k,3.2*k);
  x.fillStyle=MPL.GOLD;x.beginPath();x.moveTo(a-1.8*k,b-1.6*k);x.lineTo(a,b-3.3*k);x.lineTo(a+1.8*k,b-1.6*k);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(a-1.6*k,b+1.6*k);x.lineTo(a+1.6*k,b+1.6*k);x.stroke();x.restore()}
/* a heap of gold and ruby for the chest */
function mpRmChest(x,a,b,k){k=k||1;x.save();x.lineJoin='round';
  mpRmGlow(x,a,b,8*k,'255,210,90',.5,false);
  const w=7*k,h=4.8*k;x.fillStyle='rgba(40,20,10,.35)';x.fillRect(a-w/2+.7,b-h/2+1,w,h);
  x.fillStyle='#6e3418';x.strokeStyle=MPL.INK;x.lineWidth=.55;x.fillRect(a-w/2,b-.2*k,w,h/2+.2*k);x.strokeRect(a-w/2,b-.2*k,w,h/2+.2*k);
  x.fillStyle='#8c4a26';x.beginPath();x.moveTo(a-w/2,b-.2*k);x.lineTo(a-w/2,b-h/2+.9*k);x.quadraticCurveTo(a,b-h/2-1.8*k,a+w/2,b-h/2+.9*k);x.lineTo(a+w/2,b-.2*k);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD;for(const dx of [-w*.3,w*.3]){x.fillRect(a+dx-.55*k,b-h/2-.3*k,1.1*k,h+.3*k);x.strokeRect(a+dx-.55*k,b-h/2-.3*k,1.1*k,h+.3*k)}
  x.fillRect(a-w/2,b-.5*k,w,.7*k);x.fillStyle='#fbe9a0';x.fillRect(a-.8*k,b-1*k,1.6*k,1.9*k);x.strokeRect(a-.8*k,b-1*k,1.6*k,1.9*k);x.fillStyle=MPL.INK;x.fillRect(a-.22*k,b-.2*k,.44*k,.8*k);
  x.strokeStyle='rgba(255,236,170,.8)';x.lineWidth=.3;x.beginPath();x.moveTo(a-w/2+.8,b-h/2+1.2*k);x.quadraticCurveTo(a-w*.2,b-h/2-.2*k,a-w*.05,b-h/2-.4*k);x.stroke();x.restore()}
function mpRmBush(x,a,b,r,sd){x.save();x.lineJoin='round';x.fillStyle='rgba(30,50,20,.3)';x.beginPath();x.ellipse(a+.6,b+.9,r,r*.8,0,0,6.3);x.fill();
  x.beginPath();const n=8;for(let i=0;i<=n;i++){const an=i/n*6.283,rr=r*(1+.13*Math.sin(i*2.1+sd));const px=a+Math.cos(an)*rr,py=b+Math.sin(an)*rr;
    i?x.quadraticCurveTo(a+Math.cos(an-.39)*rr*1.12,b+Math.sin(an-.39)*rr*1.12,px,py):x.moveTo(px,py)}x.closePath();x.fillStyle=MPRM.leaf;x.fill();x.strokeStyle=MPL.INK;x.lineWidth=.45;x.stroke();
  x.fillStyle=MPRM.leaf2;for(let i=0;i<4;i++){x.beginPath();x.ellipse(a-r*.3+i*r*.22,b-r*.35+(i%2)*r*.35,r*.2,r*.14,.5,0,6.3);x.fill()}
  x.strokeStyle='rgba(15,40,20,.6)';x.lineWidth=.3;for(let i=0;i<5;i++){const an=i*1.3+sd;x.beginPath();x.moveTo(a+Math.cos(an)*r*.2,b+Math.sin(an)*r*.2+.4);x.lineTo(a+Math.cos(an)*r*.62,b+Math.sin(an)*r*.62+.4);x.stroke()}x.restore()}
/* a clump of blooms with their leaves (no earth disc: the flowers grow straight from the lawn) */
function mpRmBloom(x,fx,fy,r,col){x.fillStyle=col;x.strokeStyle=MPL.INK;x.lineWidth=.2;for(let q=0;q<5;q++){const an=q*1.2566+fx;x.beginPath();x.arc(fx+Math.cos(an)*r,fy+Math.sin(an)*r,r*.82,0,6.3);x.fill();x.stroke()}x.fillStyle=MPL.GOLD;x.beginPath();x.arc(fx,fy,r*.55,0,6.3);x.fill()}
function mpRmFlowers(x,a,b,sd,red){x.save();x.lineJoin='round';
  for(let i=0;i<6;i++)mpRmLeaf(x,a+(mpRmH(sd,i,1)-.5)*4.4,b+(mpRmH(sd,i,2)-.4)*3.6,1.9+mpRmH(sd,i,6),mpRmH(sd,i,3)*6.3,i%2?'#4f8a52':'#3f7a46');
  for(let i=0;i<8;i++){const fx=a+(mpRmH(sd,i,4)-.5)*5.6,fy=b+(mpRmH(sd,i,5)-.5)*4.6,k=(i+red)%3;mpRmBloom(x,fx,fy,.56+.14*mpRmH(sd,i,7),k===0?'#fbf6ea':k===1?'#cd2a3a':'#e4515c')}
  x.restore()}
function mpRmFountain(x,a,b,r){x.save();x.lineJoin='round';
  x.fillStyle='rgba(40,50,60,.3)';x.beginPath();x.arc(a+.7,b+.9,r,0,6.3);x.fill();
  x.fillStyle='#e6dfc8';x.strokeStyle=MPL.INK;x.lineWidth=.55;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();x.stroke();
  const g=x.createRadialGradient(a-r*.2,b-r*.2,0,a,b,r*.8);g.addColorStop(0,'#8fc0e8');g.addColorStop(1,'#2f62ad');x.fillStyle=g;x.beginPath();x.arc(a,b,r*.78,0,6.3);x.fill();x.lineWidth=.35;x.stroke();
  x.strokeStyle='rgba(235,248,255,.8)';x.lineWidth=.3;for(const q of [.6,.38]){x.beginPath();x.arc(a,b,r*q,.4,5.8);x.stroke()}
  x.fillStyle='#d8d0b8';x.strokeStyle=MPL.INK;x.lineWidth=.4;x.beginPath();x.arc(a,b,r*.2,0,6.3);x.fill();x.stroke();
  x.strokeStyle='#ffffff';x.lineWidth=.35;for(let i=0;i<6;i++){const an=i*1.047;x.beginPath();x.moveTo(a+Math.cos(an)*r*.2,b+Math.sin(an)*r*.2);x.lineTo(a+Math.cos(an)*r*.5,b+Math.sin(an)*r*.5);x.stroke()}
  x.fillStyle=MPL.GOLD;for(let i=0;i<8;i++){const an=i*.785;x.beginPath();x.arc(a+Math.cos(an)*r*.92,b+Math.sin(an)*r*.92,.4,0,6.3);x.fill()}x.restore()}
function mpRmBrazier(x,a,b){x.save();mpRmGlow(x,a,b,9,'255,170,70',.42,true);x.fillStyle='#3a3a42';x.strokeStyle=MPL.INK;x.lineWidth=.45;x.beginPath();x.arc(a,b+.4,2.3,0,6.3);x.fill();x.stroke();x.fillStyle='#e6702a';x.beginPath();x.arc(a,b+.4,1.5,0,6.3);x.fill();
  mpRmFlame(x,a,b-.6,.8);x.restore()}
function mpRmUrn(x,a,b,k){k=k||1;x.save();x.lineJoin='round';x.fillStyle='rgba(30,20,10,.3)';x.beginPath();x.ellipse(a+.5,b+2.4*k,2.2*k,.7*k,0,0,6.3);x.fill();
  x.fillStyle='#b8202f';x.strokeStyle=MPL.INK;x.lineWidth=.45;x.beginPath();x.moveTo(a-.9*k,b-2.4*k);x.lineTo(a+.9*k,b-2.4*k);x.quadraticCurveTo(a+.9*k,b-1.5*k,a+2*k,b-.2*k);x.quadraticCurveTo(a+2.1*k,b+1.8*k,a+.9*k,b+2.4*k);x.lineTo(a-.9*k,b+2.4*k);x.quadraticCurveTo(a-2.1*k,b+1.8*k,a-2*k,b-.2*k);x.quadraticCurveTo(a-.9*k,b-1.5*k,a-.9*k,b-2.4*k);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD;x.fillRect(a-1.5*k,b-.1*k,3*k,.7*k);x.fillRect(a-1.1*k,b-2.8*k,2.2*k,.6*k);x.strokeRect(a-1.1*k,b-2.8*k,2.2*k,.6*k);
  x.strokeStyle='rgba(255,200,200,.6)';x.lineWidth=.3;x.beginPath();x.moveTo(a-1.3*k,b+.5*k);x.lineTo(a-1.2*k,b+1.7*k);x.stroke();x.restore()}
function mpRmBench(x,a,b){x.save();x.fillStyle='rgba(30,20,10,.3)';x.fillRect(a-2.8,b-.9,5.8,2.4);x.fillStyle='#8a5a2e';x.strokeStyle=MPL.INK;x.lineWidth=.45;x.fillRect(a-2.9,b-1.2,5.8,2.4);x.strokeRect(a-2.9,b-1.2,5.8,2.4);
  x.strokeStyle='rgba(40,20,8,.6)';x.lineWidth=.25;x.beginPath();x.moveTo(a-2.9,b);x.lineTo(a+2.9,b);x.moveTo(a-1,b-1.2);x.lineTo(a-1,b+1.2);x.moveTo(a+1.2,b-1.2);x.lineTo(a+1.2,b+1.2);x.stroke();x.restore()}
function mpRmPot(x,a,b,sd){x.save();x.lineJoin='round';x.fillStyle='#b8603a';x.strokeStyle=MPL.INK;x.lineWidth=.4;x.beginPath();x.moveTo(a-1.6,b-.4);x.lineTo(a+1.6,b-.4);x.lineTo(a+1.1,b+2);x.lineTo(a-1.1,b+2);x.closePath();x.fill();x.stroke();
  mpRmLeaf(x,a-.2,b-.4,2.3,-2.4,'#4f8a52');mpRmLeaf(x,a+.2,b-.4,2.3,-.7,'#4f8a52');
  for(const [dx,dy,cl] of [[-1,-2.1,'#cd2a3a'],[.9,-2.4,'#fbf6ea'],[0,-3.2,'#e4515c']]){x.fillStyle=cl;x.beginPath();x.arc(a+dx,b+dy,.75,0,6.3);x.fill();x.stroke()}x.restore()}
function mpRmPlant(x,a,b,kind){x.save();x.lineJoin='round';x.fillStyle='rgba(30,50,20,.28)';x.beginPath();x.ellipse(a+.5,b+1.4,2.8,1.1,0,0,6.3);x.fill();
  x.fillStyle='#b8603a';x.strokeStyle=MPL.INK;x.lineWidth=.4;x.beginPath();x.moveTo(a-1.4,b+.2);x.lineTo(a+1.4,b+.2);x.lineTo(a+.9,b+2.2);x.lineTo(a-.9,b+2.2);x.closePath();x.fill();x.stroke();
  if(kind===1){x.fillStyle='#5a3a1c';x.fillRect(a-.35,b-2.6,.7,2.8);x.fillStyle=MPRM.leaf;for(const [dx,dy,rr] of [[0,-4.2,2.5],[-1.6,-3,1.7],[1.6,-3,1.7]]){x.beginPath();x.arc(a+dx,b+dy,rr,0,6.3);x.fill();x.stroke()}x.fillStyle=MPRM.leaf2;x.beginPath();x.arc(a-.7,b-4.9,.8,0,6.3);x.fill();x.fillStyle='#cd2a3a';for(const [dx,dy] of [[.9,-3.6],[-1.2,-2.7]]){x.beginPath();x.arc(a+dx,b+dy,.45,0,6.3);x.fill()}}
  else{for(let i=0;i<6;i++){const an=-Math.PI/2+(i-2.5)*.42;mpRmLeaf(x,a,b+.1,4.6,an,i%2?'#4f8a52':'#5f9c60')}}x.restore()}
function mpRmTele(x,a,b){x.save();mpRmGlow(x,a,b,8,'120,160,255',.5,false);x.fillStyle='#2a4aa8';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.arc(a,b,3.2,0,6.3);x.fill();x.stroke();x.strokeStyle='#a8c4ff';x.lineWidth=.55;x.beginPath();x.arc(a,b,2.2,0,6.3);x.stroke();x.fillStyle='#dbe8ff';x.beginPath();x.arc(a,b,.8,0,6.3);x.fill();x.restore()}
function mpRmCandle(x,a,b,k){k=k||1;x.save();mpRmGlow(x,a,b-2.4*k,7.5*k,'255,200,90',.5,true);x.lineJoin='round';
  x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.35;x.beginPath();x.ellipse(a,b+1.3*k,2*k,.8*k,0,0,6.3);x.fill();x.stroke();
  x.fillStyle='#f6ecd0';x.fillRect(a-.75*k,b-2.2*k,1.5*k,3.4*k);x.strokeRect(a-.75*k,b-2.2*k,1.5*k,3.4*k);
  mpRmFlame(x,a,b-3.5*k,.6*k);x.restore()}
function mpRmWeb(x,a,b,dx,dy,r){x.save();x.strokeStyle='rgba(236,226,206,.6)';x.lineWidth=.28;x.lineCap='round';
  const sp=[];for(let i=0;i<4;i++){const an=i/3*1.5708;sp.push([dx*Math.cos(an)*r,dy*Math.sin(an)*r])}
  x.beginPath();for(const p of sp){x.moveTo(a,b);x.lineTo(a+p[0],b+p[1])}x.stroke();
  for(const q of [.4,.7,1]){x.beginPath();for(let i=0;i<4;i++){const px=a+sp[i][0]*q,py=b+sp[i][1]*q;i?x.quadraticCurveTo(a+(sp[i-1][0]+sp[i][0])*q*.46,b+(sp[i-1][1]+sp[i][1])*q*.46,px,py):x.moveTo(px,py)}x.stroke()}x.restore()}
/* the shared margin: title, compass, key (the same furniture as the other maps; no notes) */
function mpRmMargin(x,api,title,sub,key){
  if(typeof mpGravesMargin==='function')return mpGravesMargin(x,api,title,sub,[],key);
  api.title(x,title,sub);api.compass(x,436,262,12);api.panel(x,392,34,84,18+key.length*12);let y=45;api.text(x,'Key',434,y,7.4,MPL.VERM,'center');y+=11;
  for(const k of key){k.icon(402,y);api.text(x,k.t,412,y,6,'#3a2a1c','left');y+=k.dy||12}}

/* ------------------------------------------------------------------ THE MAP */
function mpRmDraw(c,x,L,api){
  const R=L.rows,W=R[0].length,H=R.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,PX=F.ox,PY=F.oy,PW=W*s,PH=H*s;
  const ch=(cx,cy)=>(R[cy]&&R[cy][cx])||'#';
  const wall=(cx,cy)=>ch(cx,cy)==='#',open=(cx,cy)=>!wall(cx,cy);
  const D=((typeof LEVEL!=='undefined'&&LEVEL===500&&typeof G!=='undefined'&&G.decor&&G.decor.length)?G.decor:L.decor)||[];
  const INK=MPL.INK,RB=MPRM;
  /* the garden: the grass cells of the floor map give its box; the door in its ring is the open cell beside it */
  let gx0=99,gx1=-1,gy0=99,gy1=-1;
  if(L.fmap)for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)if(L.fmap[cy][cx]==='1'){gx0=Math.min(gx0,cx);gx1=Math.max(gx1,cx);gy0=Math.min(gy0,cy);gy1=Math.max(gy1,cy)}
  if(gx1<0){gx0=15;gx1=21;gy0=11;gy1=15}
  const gar=(cx,cy)=>cx>=gx0&&cx<=gx1&&cy>=gy0&&cy<=gy1;
  let gate=null;for(let cy=gy0;cy<=gy1;cy++){if(open(gx0-1,cy))gate={x:gx0-1,y:cy,side:-1};if(open(gx1+1,cy))gate={x:gx1+1,y:cy,side:1}}
  const door={x:-1,y:-1};for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)if(ch(cx,cy)==='0'){door.x=cx;door.y=cy}
  const cell=(cx,cy)=>[X(cx+.5),Y(cy+.5)];
  const floorP=new Path2D(),wallP=new Path2D();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))wallP.rect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2);else if(!gar(cx,cy))floorP.rect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2)}

  /* ---- the plan stands on the page: a soft shadow under it ---- */
  x.save();x.shadowColor='rgba(40,18,10,.55)';x.shadowBlur=22;x.shadowOffsetX=5;x.shadowOffsetY=8;x.fillStyle='#2a1a20';x.fillRect(PX-2.6,PY-2.6,PW+5.2,PH+5.2);x.restore();
  x.save();x.beginPath();x.rect(PX,PY,PW,PH);x.clip();x.fillStyle='#301c26';x.fillRect(PX,PY,PW,PH);

  /* ---- the floors: dark polished chequer tiles, four to a square, each a little different, with a joint between ---- */
  x.save();x.clip(floorP);
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy)||gar(cx,cy))continue;
    for(let i=0;i<2;i++)for(let j=0;j<2;j++){const par=((cx*2+i)+(cy*2+j))&1,h=mpRmH(cx*2+i,cy*2+j,1);x.fillStyle=RB.floor[par];x.fillRect(X(cx)+i*s/2,Y(cy)+j*s/2,s/2+.1,s/2+.1);
      if(h<.5){x.fillStyle=par?`rgba(170,70,80,${.06+.1*h})`:`rgba(110,36,56,${.06+.08*h})`;x.fillRect(X(cx)+i*s/2,Y(cy)+j*s/2,s/2,s/2)}}}
  x.strokeStyle='rgba(0,0,0,.45)';x.lineWidth=.22;x.beginPath();for(let a=0;a<=W*2;a++){x.moveTo(PX+a*s/2,PY);x.lineTo(PX+a*s/2,PY+PH)}for(let b=0;b<=H*2;b++){x.moveTo(PX,PY+b*s/2);x.lineTo(PX+PW,PY+b*s/2)}x.stroke();
  /* a polish: long soft diagonal sheens across the tiles, and the red of the walls throwing a faint blush on the floor beside them */
  for(let i=0;i<7;i++){const a0=PX+(i*.16+.03)*PW,g=x.createLinearGradient(a0,PY,a0+PH*.5,PY+PH);g.addColorStop(0,'rgba(255,190,170,0)');g.addColorStop(.5,'rgba(255,190,170,.1)');g.addColorStop(1,'rgba(255,190,170,0)');x.fillStyle=g;x.beginPath();x.moveTo(a0,PY);x.lineTo(a0+30,PY);x.lineTo(a0+PH*.5+30,PY+PH);x.lineTo(a0+PH*.5,PY+PH);x.closePath();x.fill()}
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy)||gar(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    x.fillStyle='rgba(190,40,60,.2)';if(wall(cx,cy-1))x.fillRect(X0,Y0,s,1.4);if(wall(cx-1,cy))x.fillRect(X0,Y0,1.4,s);if(wall(cx,cy+1))x.fillRect(X0,Y0+s-1.4,s,1.4);if(wall(cx+1,cy))x.fillRect(X0+s-1.4,Y0,1.4,s)}
  x.restore();

  /* ---- torches: placed along straight passages, never closer than about five squares to one another ---- */
  const torches=[];{const cand=[];
    for(let cy=1;cy<H-1;cy++)for(let cx=1;cx<W-1;cx++){if(wall(cx,cy)||gar(cx,cy))continue;
      const hz=wall(cx,cy-1)&&wall(cx,cy+1)&&open(cx-1,cy)&&open(cx+1,cy),vt=wall(cx-1,cy)&&wall(cx+1,cy)&&open(cx,cy-1)&&open(cx,cy+1);
      if(hz||vt)cand.push({cx,cy,hz,r:mpRmH(cx,cy,90)})}
    cand.sort((p,q)=>p.r-q.r);
    for(const q of cand){if(Math.hypot(q.cx-door.x,q.cy-door.y)<3)continue;if(torches.every(t=>Math.hypot(t.cx-q.cx,t.cy-q.cy)>=5.6)){const side=mpRmH(q.cx,q.cy,91)<.5?-1:1;torches.push({cx:q.cx,cy:q.cy,hz:q.hz,side})}}}
  const tpos=t=>t.hz?[X(t.cx+.5),t.side<0?Y(t.cy)+1.6:Y(t.cy+1)-1.6]:[t.side<0?X(t.cx)+1.6:X(t.cx+1)-1.6,Y(t.cy+.5)];
  /* the warm pools of light on the floor */
  x.save();x.clip(floorP);for(const t of torches){const [a,b]=tpos(t);mpRmGlow(x,a,b,17,'255,150,60',.5,true);mpRmGlow(x,a,b,7,'255,200,110',.34,true)}
  /* a few fallen rose petals on the tiles */
  for(let cy=1;cy<H-1;cy++)for(let cx=1;cx<W-1;cx++){if(wall(cx,cy)||gar(cx,cy))continue;
    for(let k=0;k<2;k++)if(mpRmH(cx*3+k,cy,40)<.16){const a=X(cx)+s*(.15+.7*mpRmH(cx,cy*3+k,41)),b=Y(cy)+s*(.15+.7*mpRmH(cx+k,cy,42));x.save();x.translate(a,b);x.rotate(mpRmH(cx,cy+k,43)*6.3);x.fillStyle=mpRmH(cx,cy,44)<.7?'rgba(205,40,62,.8)':'rgba(240,120,130,.7)';x.strokeStyle='rgba(20,2,8,.6)';x.lineWidth=.2;x.beginPath();x.ellipse(0,0,.95,.55,0,0,6.3);x.fill();x.stroke();x.strokeStyle='rgba(255,170,170,.35)';x.lineWidth=.15;x.beginPath();x.moveTo(-.6,0);x.lineTo(.5,0);x.stroke();x.restore()}}
  /* the garden's own light, spilling out through its gate and over the walks round it */
  {const gcx=X((gx0+gx1+1)/2),gcy=Y((gy0+gy1+1)/2);mpRmGlow(x,gcx,gcy,46,'190,230,120',.2,true)}
  /* inlaid gold stars in the floor where passages cross */
  for(let cy=1;cy<H-1;cy+=2)for(let cx=1;cx<W-1;cx+=2){if(wall(cx,cy)||gar(cx,cy))continue;let n=0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(open(cx+dx,cy+dy))n++;if(n<3)continue;
    const a=X(cx+.5),b=Y(cy+.5),r=n===4?2.5:2;x.fillStyle='rgba(226,184,60,.62)';x.strokeStyle='rgba(20,4,10,.65)';x.lineWidth=.25;x.beginPath();for(let k=0;k<8;k++){const rr=k%2?r*.42:r,an=-1.5708+k*.7854;k?x.lineTo(a+Math.cos(an)*rr,b+Math.sin(an)*rr):x.moveTo(a+Math.cos(an)*rr,b+Math.sin(an)*rr)}x.closePath();x.fill();x.stroke();
    x.fillStyle='rgba(210,50,70,.8)';x.beginPath();x.arc(a,b,.55,0,6.3);x.fill()}
  x.restore();

  /* ---- the garden floor: lawn in two tones, gravel crossing paths, then the beds ---- */
  const GA=X(gx0),GB=Y(gy0),GW=(gx1-gx0+1)*s,GH=(gy1-gy0+1)*s;
  x.save();x.beginPath();x.rect(GA,GB,GW,GH);x.clip();
  for(let cy=gy0;cy<=gy1;cy++)for(let cx=gx0;cx<=gx1;cx++){x.fillStyle=RB.grass[(cx+cy*2+((mpRmH(cx,cy,5)*4)|0))%4];x.fillRect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2)}
  for(let i=0;i<110;i++){const px=GA+mpRmH(i,6)*GW,py=GB+mpRmH(i,7)*GH;x.strokeStyle=i%3?'rgba(50,90,40,.55)':'rgba(190,220,130,.55)';x.lineWidth=.3;x.beginPath();x.moveTo(px,py);x.lineTo(px-.5,py-1.4);x.moveTo(px,py);x.lineTo(px+.6,py-1.3);x.stroke()}
  /* gravel: the cross of paths, from the floor map */
  const gravel=(cx,cy)=>gar(cx,cy)&&L.fmap&&L.fmap[cy]&&L.fmap[cy][cx]==='2';
  for(let cy=gy0;cy<=gy1;cy++)for(let cx=gx0;cx<=gx1;cx++){if(!gravel(cx,cy))continue;const X0=X(cx),Y0=Y(cy);x.fillStyle='#dccb98';x.fillRect(X0-.1,Y0-.1,s+.2,s+.2);
    for(let k=0;k<9;k++){const t=mpRmH(cx*9+k,cy,8);x.fillStyle=t<.33?'#b8a572':t<.66?'#f0e4bc':'#a89460';x.beginPath();x.ellipse(X0+mpRmH(cx,cy*9+k,9)*s,Y0+mpRmH(cx+k,cy,10)*s,.55,.38,t*6,0,6.3);x.fill()}
    x.strokeStyle='rgba(90,70,30,.45)';x.lineWidth=.3;if(!gravel(cx,cy-1)){x.beginPath();x.moveTo(X0,Y0);x.lineTo(X0+s,Y0);x.stroke()}if(!gravel(cx,cy+1)){x.beginPath();x.moveTo(X0,Y0+s);x.lineTo(X0+s,Y0+s);x.stroke()}if(!gravel(cx-1,cy)){x.beginPath();x.moveTo(X0,Y0);x.lineTo(X0,Y0+s);x.stroke()}if(!gravel(cx+1,cy)){x.beginPath();x.moveTo(X0+s,Y0);x.lineTo(X0+s,Y0+s);x.stroke()}}
  /* the round plaza where the paths cross, with a ruby and gold star inlaid */
  {const mx=Math.round((gx0+gx1)/2),my=Math.round((gy0+gy1)/2),[a,b]=cell(mx,my);x.fillStyle='#e8d9a6';x.strokeStyle='rgba(90,70,30,.7)';x.lineWidth=.4;x.beginPath();x.arc(a,b,s*.5,0,6.3);x.fill();x.stroke();
    x.fillStyle='#b11f2c';x.strokeStyle=INK;x.lineWidth=.3;x.beginPath();for(let k=0;k<16;k++){const rr=k%2?1.3:3,an=-1.5708+k*.3927;k?x.lineTo(a+Math.cos(an)*rr,b+Math.sin(an)*rr):x.moveTo(a+Math.cos(an)*rr,b+Math.sin(an)*rr)}x.closePath();x.fill();x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a,b,.9,0,6.3);x.fill();x.stroke()}
  /* clipped box edging along the gravel, then small flowers and clover all over the lawn */
  for(let cy=gy0;cy<=gy1;cy++)for(let cx=gx0;cx<=gx1;cx++){if(gravel(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    const edge=(dx,dy,n,ex,ey)=>{if(!gravel(cx+dx,cy+dy))return;for(let k=0;k<n;k++){const t=(k+.5)/n,px=ex?X0+(dx>0?s-.7:.7):X0+t*s,py=ey?Y0+(dy>0?s-.7:.7):Y0+t*s;x.fillStyle=MPRM.leaf;x.strokeStyle='rgba(20,50,25,.8)';x.lineWidth=.22;x.beginPath();x.arc(px,py,.62,0,6.3);x.fill();x.stroke()}};
    edge(0,-1,8,false,true);edge(0,1,8,false,true);edge(-1,0,8,true,false);edge(1,0,8,true,false);
    for(let k=0;k<4;k++){const fx=X0+(.12+.76*mpRmH(cx*7+k,cy,31))*s,fy=Y0+(.12+.76*mpRmH(cx,cy*7+k,32))*s,t=mpRmH(cx+k,cy,33);
      if(t<.55)mpRmBloom(x,fx,fy,.4,t<.2?'#fbf6ea':'#d8323f');else{x.strokeStyle='rgba(40,90,45,.7)';x.lineWidth=.25;x.beginPath();x.moveTo(fx,fy);x.lineTo(fx-.7,fy-.8);x.moveTo(fx,fy);x.lineTo(fx+.7,fy-.8);x.stroke()}}}
  x.restore();

  /* ---- the walls: polished ruby masonry. Every wall run is a low ridge: the half that faces north or west catches the light, the other half is in shade, and the gold
         cap runs along the ridge. Posts and junctions are little pyramids with four facets. Then ashlar joints, edge lights, glints, ink, the gold cap and its studs. ---- */
  /* how a wall square is cut: 1 = part of an east-west run, 2 = north-south, 0 = a post or junction (a four-faced pyramid). The outer wall and the garden ring keep their own direction. */
  const gring=(cx,cy)=>cx>=gx0-1&&cx<=gx1+1&&cy>=gy0-1&&cy<=gy1+1&&(cx===gx0-1||cx===gx1+1||cy===gy0-1||cy===gy1+1);
  const orient=(cx,cy)=>{const ox=cx===0||cx===W-1,oy=cy===0||cy===H-1;
    if(ox&&oy)return 0;if(oy)return 1;if(ox)return 2;
    if(gring(cx,cy)){const gx=cx===gx0-1||cx===gx1+1,gy=cy===gy0-1||cy===gy1+1;if(gx&&gy)return 0;return gy?1:2}
    const hz=wall(cx-1,cy)||wall(cx+1,cy),vt=wall(cx,cy-1)||wall(cx,cy+1);return hz&&!vt?1:vt&&!hz?2:0};
  const mixc=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
  const bw=.8,rgb=(c,m)=>`rgb(${Math.min(255,c[0]*m|0)},${Math.min(255,c[1]*m|0)},${Math.min(255,c[2]*m|0)})`;
  const RL=[[214,38,64],[224,44,70],[206,34,60],[218,40,66]],RD=[[118,12,34],[126,14,38],[112,10,32],[122,13,36]];
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!wall(cx,cy))continue;const X0=X(cx),Y0=Y(cy),h1=(mpRmH(cx,cy,11)*4)|0,m=.93+.14*mpRmH(cx,cy,24),Lc=RL[h1],Dc=RD[h1],e=.15;
    const o=orient(cx,cy),hzr=o===1,vtr=o===2;
    if(hzr&&!vtr){x.fillStyle=rgb(Lc,m);x.fillRect(X0-e,Y0-e,s+2*e,s/2+e);x.fillStyle=rgb(Dc,m);x.fillRect(X0-e,Y0+s/2,s+2*e,s/2+e)}
    else if(vtr&&!hzr){x.fillStyle=rgb(Lc,m);x.fillRect(X0-e,Y0-e,s/2+e,s+2*e);x.fillStyle=rgb(Dc,m);x.fillRect(X0+s/2,Y0-e,s/2+e,s+2*e)}
    else{const a=X0+s/2,b=Y0+s/2,tri=(p,q,col)=>{x.fillStyle=col;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(q[0],q[1]);x.lineTo(a,b);x.closePath();x.fill()};
      x.fillStyle=rgb(Dc,m);x.fillRect(X0-e,Y0-e,s+2*e,s+2*e);
      tri([X0-e,Y0-e],[X0+s+e,Y0-e],rgb(mixc(Lc,mixc(Lc,Dc,.5),.25),m));tri([X0-e,Y0-e],[X0-e,Y0+s+e],rgb(mixc(Lc,mixc(Lc,Dc,.5),.55),m));tri([X0+s+e,Y0-e],[X0+s+e,Y0+s+e],rgb(mixc(Dc,mixc(Lc,Dc,.5),.55),m));tri([X0-e,Y0+s+e],[X0+s+e,Y0+s+e],rgb(mixc(Dc,mixc(Lc,Dc,.5),.25),m))}}
  /* ashlar joints: running bond across each half of a wall run, with a faint light edge beside each */
  for(const [col,dx,dy,lw] of [['rgba(34,1,8,.62)',0,0,.3],['rgba(255,120,134,.22)',.28,.22,.25]]){
    x.strokeStyle=col;x.lineWidth=lw;x.beginPath();
    for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!wall(cx,cy))continue;const o=orient(cx,cy),hzr=o===1,vtr=o===2,X0=X(cx),Y0=Y(cy);
      if(hzr&&!vtr){for(let half=0;half<2;half++){const y0=half?Y0+s*.5+.55:Y0+bw+.1,y1=half?Y0+s-bw-.1:Y0+s*.5-.55;for(let k=0;k<2;k++){const xx=X0+s*(.18+.5*k+.25*half+(mpRmH(cx,cy,12+k+half*2)-.5)*.14);x.moveTo(xx+dx,y0+dy);x.lineTo(xx+dx,y1+dy)}}}
      else if(vtr&&!hzr){for(let half=0;half<2;half++){const x0=half?X0+s*.5+.55:X0+bw+.1,x1=half?X0+s-bw-.1:X0+s*.5-.55;for(let k=0;k<2;k++){const yy=Y0+s*(.18+.5*k+.25*half+(mpRmH(cx,cy,12+k+half*2)-.5)*.14);x.moveTo(x0+dx,yy+dy);x.lineTo(x1+dx,yy+dy)}}}}
    x.stroke()}
  /* edge lights: a bright rim on the north and west faces, a dark one on the south and east faces */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!wall(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    if(open(cx,cy-1)&&cy>0){x.fillStyle='rgba(255,138,150,.8)';x.fillRect(X0,Y0,s,bw*.8);x.fillStyle='rgba(255,226,226,.55)';x.fillRect(X0,Y0,s,.28)}
    if(open(cx-1,cy)&&cx>0){x.fillStyle='rgba(255,138,150,.8)';x.fillRect(X0,Y0,bw*.8,s);x.fillStyle='rgba(255,226,226,.55)';x.fillRect(X0,Y0,.28,s)}
    if(open(cx,cy+1)&&cy<H-1){x.fillStyle='rgba(30,0,8,.75)';x.fillRect(X0,Y0+s-bw,s,bw)}
    if(open(cx+1,cy)&&cx<W-1){x.fillStyle='rgba(30,0,8,.75)';x.fillRect(X0+s-bw,Y0,bw,s)}}
  /* big soft reflections lying across all the walls, as on polished stone */
  x.save();x.clip(wallP);for(let i=0;i<6;i++){const a0=PX+(i*.19-.05)*PW,g=x.createLinearGradient(a0,PY,a0+PH*.62,PY+PH);g.addColorStop(0,'rgba(255,170,180,0)');g.addColorStop(.5,'rgba(255,170,180,.15)');g.addColorStop(1,'rgba(255,170,180,0)');x.fillStyle=g;x.beginPath();x.moveTo(a0,PY);x.lineTo(a0+34,PY);x.lineTo(a0+PH*.62+34,PY+PH);x.lineTo(a0+PH*.62,PY+PH);x.closePath();x.fill()}x.restore();
  /* glints: a short bright streak on some faces, and a few four-point sparkles */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!wall(cx,cy))continue;const X0=X(cx),Y0=Y(cy),h=mpRmH(cx,cy,20),o=orient(cx,cy),hzr=o===1,vtr=o===2;
    if(h<.34){x.strokeStyle='rgba(255,206,206,.5)';x.lineWidth=.4;x.lineCap='round';x.beginPath();if(hzr&&!vtr){const yy=Y0+bw+.75;x.moveTo(X0+s*.14,yy);x.lineTo(X0+s*(.4+.35*h),yy)}else if(vtr&&!hzr){const xx=X0+bw+.75;x.moveTo(xx,Y0+s*.14);x.lineTo(xx,Y0+s*(.4+.35*h))}x.stroke()}
    if(mpRmH(cx,cy,21)<.045){const a=X0+s*(.28+.44*mpRmH(cx,cy,22)),b=Y0+s*(.28+.44*mpRmH(cx,cy,23)),r=1.5;x.fillStyle='rgba(255,246,236,.92)';x.beginPath();x.moveTo(a,b-r);x.quadraticCurveTo(a+.14*r,b-.14*r,a+r,b);x.quadraticCurveTo(a+.14*r,b+.14*r,a,b+r);x.quadraticCurveTo(a-.14*r,b+.14*r,a-r,b);x.quadraticCurveTo(a-.14*r,b-.14*r,a,b-r);x.fill()}}
  /* the ink line where the wall meets the floor */
  x.strokeStyle=RB.inkR;x.lineWidth=.62;x.lineCap='round';x.beginPath();
  const seg=(a,b,c2,d,sd)=>{const n=Math.max(1,Math.round(Math.hypot(c2-a,d-b)/2.6));x.moveTo(a,b);for(let i=1;i<=n;i++){const t=i/n,j=i<n?.2:0;x.lineTo(a+(c2-a)*t+(mpRmH(i,sd,1)-.5)*j*2,b+(d-b)*t+(mpRmH(i,sd,2)-.5)*j*2)}};
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!wall(cx,cy))continue;const X0=X(cx),Y0=Y(cy),sd=cx*97+cy;
    if(open(cx,cy-1)&&cy>0)seg(X0,Y0,X0+s,Y0,sd+1);if(open(cx,cy+1)&&cy<H-1)seg(X0,Y0+s,X0+s,Y0+s,sd+2);if(open(cx-1,cy)&&cx>0)seg(X0,Y0,X0,Y0+s,sd+3);if(open(cx+1,cy)&&cx<W-1)seg(X0+s,Y0,X0+s,Y0+s,sd+4)}
  x.stroke();
  /* the gold cap: an inlaid line along the ridge of every wall run, with studs at the wall ends and junctions */
  const seg2=[];for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!wall(cx,cy))continue;if(cx+1<W&&wall(cx+1,cy))seg2.push([cx,cy,cx+1,cy]);if(cy+1<H&&wall(cx,cy+1))seg2.push([cx,cy,cx,cy+1])}
  x.lineCap='round';
  for(const [w2,col,off] of [[1.5,'rgba(30,2,8,.8)',.28],[.92,'#cfa024',0],[.38,'#f9e79a',-.18]]){x.strokeStyle=col;x.lineWidth=w2;x.beginPath();for(const [a,b,c2,d] of seg2){x.moveTo(X(a+.5)+off,Y(b+.5)+off);x.lineTo(X(c2+.5)+off,Y(d+.5)+off)}x.stroke()}
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!wall(cx,cy)||cx%2||cy%2)continue;
    let deg=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(cx+a>=0&&cx+a<W&&cy+b>=0&&cy+b<H&&wall(cx+a,cy+b))deg++;
    const a=X(cx+.5),b=Y(cy+.5),ring=(cx===gx0-1||cx===gx1+1)&&(cy===gy0-1||cy===gy1+1),
      r=ring?2.1:deg>=3?1.5:deg===1?1.3:.8;
    x.fillStyle='#c99a22';x.strokeStyle=RB.dkR;x.lineWidth=.3;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();x.stroke();
    if(ring||deg>=3){x.fillStyle='#e02c44';x.beginPath();x.arc(a,b,r*.58,0,6.3);x.fill();x.fillStyle='rgba(255,255,255,.9)';x.beginPath();x.arc(a-r*.2,b-r*.24,r*.17,0,6.3);x.fill()}
    else if(deg===1){x.fillStyle='#f6e08a';x.beginPath();x.arc(a-r*.1,b-r*.1,r*.55,0,6.3);x.fill()}
    else{x.fillStyle='#f6e08a';x.beginPath();x.arc(a-r*.22,b-r*.22,r*.36,0,6.3);x.fill()}}
  x.restore();

  /* ---- torches on the wall faces: an iron bracket and a flame, with a glow on the stone ---- */
  for(const t of torches){const [a,b]=tpos(t),ea=t.hz?a:(t.side<0?X(t.cx):X(t.cx+1)),eb=t.hz?(t.side<0?Y(t.cy):Y(t.cy+1)):b;x.save();mpRmGlow(x,a,b,6,'255,170,80',.36,true);
    x.strokeStyle='#150608';x.lineWidth=.8;x.lineCap='round';x.beginPath();x.moveTo(ea,eb);x.lineTo(a,b);x.stroke();
    mpRmFlame(x,a,b-.5,.72);x.restore()}

  /* ---- decorations at some dead ends: a candle, a rose, a cobweb ---- */
  const dead=[];for(let cy=1;cy<H-1;cy++)for(let cx=1;cx<W-1;cx++){if(!open(cx,cy)||gar(cx,cy)||ch(cx,cy)==='0')continue;let n=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(open(cx+a,cy+b))n++;if(n===1)dead.push({cx,cy,r:mpRmH(cx,cy,70)})}
  dead.sort((p,q)=>p.r-q.r);const marks=[];
  for(const d of dead){if(Math.hypot(d.cx-L.start.x,d.cy-L.start.y)<4)continue;if(D.some(q=>q.k==='teleporter'&&Math.hypot(q.x-d.cx,q.y-d.cy)<2))continue;if(marks.length>=16)break;if(marks.every(m=>Math.hypot(m.cx-d.cx,m.cy-d.cy)>=4.5))marks.push(d)}
  marks.forEach((d,i)=>{const [a,b]=cell(d.cx,d.cy),kind=i%3;
    if(kind===0)mpRmCandle(x,a,b+.9,1.3);
    else if(kind===1){mpRmLeaf(x,a-.6,b+1.9,3.8,2.7,'#3f7a46');mpRmLeaf(x,a+.6,b+1.9,3.8,.4,'#4f8a52');mpRmRose(x,a,b-.3,3,mpRmH(d.cx,d.cy,71)*6)}
    else{let dx=1,dy=1;if(wall(d.cx,d.cy-1))dy=1;else dy=-1;if(wall(d.cx-1,d.cy))dx=1;else dx=-1;if(wall(d.cx,d.cy-1)&&wall(d.cx,d.cy+1)){dy=1}if(wall(d.cx-1,d.cy)&&wall(d.cx+1,d.cy)){dx=1}
      mpRmWeb(x,X(d.cx+(dx>0?0:1))+dx*.3,Y(d.cy+(dy>0?0:1))+dy*.3,dx,dy,s*1.0)}});

  /* ---- the garden gate, the beds and everything in the garden ---- */
  if(gate){const [a,b]=cell(gate.x,gate.y);x.save();x.lineCap='round';
    const y0=Y(gate.y-.5+.5)-0,y1=Y(gate.y+1.5);
    for(const [w2,col] of [[2.4,'#2a1a0c'],[1.5,'#e6bd3a']]){x.strokeStyle=col;x.lineWidth=w2;x.beginPath();x.moveTo(a,Y(gate.y-.5));x.lineTo(a,Y(gate.y+1.5));x.stroke()}
    x.strokeStyle='rgba(255,246,190,.85)';x.lineWidth=.35;x.beginPath();x.moveTo(a-.35,Y(gate.y-.3));x.lineTo(a-.35,Y(gate.y+1.3));x.stroke();
    for(const ty of [gate.y+.15,gate.y+.85]){x.fillStyle='#e6bd3a';x.strokeStyle='#2a1a0c';x.lineWidth=.3;x.beginPath();x.arc(a,Y(ty),.8,0,6.3);x.fill();x.stroke()}
    x.fillStyle='#d4243a';x.strokeStyle='#2a1a0c';x.lineWidth=.35;x.beginPath();x.moveTo(a,b-1.5);x.lineTo(a+1.2,b);x.lineTo(a,b+1.5);x.lineTo(a-1.2,b);x.closePath();x.fill();x.stroke();
    for(const dy of [-1,1]){const pa=X(gate.x+.5),pb=Y(gate.y+.5+dy*1);x.fillStyle='#d6ab2e';x.strokeStyle=RB.inkR;x.lineWidth=.4;x.beginPath();x.arc(pa,pb,2.1,0,6.3);x.fill();x.stroke();x.fillStyle='#e02c44';x.beginPath();x.arc(pa,pb,1.15,0,6.3);x.fill();x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.arc(pa-.35,pb-.35,.3,0,6.3);x.fill()}
    x.restore()}
  x.save();x.beginPath();x.rect(GA-.2,GB-.2,GW+.4,GH+.4);x.clip();
  const gd=D.filter(d=>gar(d.x,d.y)).sort((p,q)=>p.y-q.y||p.x-q.x);
  /* low things first: beds, then pots, then bushes and the rest */
  gd.forEach((d,i)=>{if(/^flora/.test(d.k)){const [a,b]=cell(d.x,d.y);mpRmFlowers(x,a,b,i*7+d.x,/(1|2|4)$/.test(d.k)?0:1)}});
  for(const d of gd){const [a,b]=cell(d.x,d.y),k=d.k;
    if(k==='fountain')mpRmFountain(x,a,b,s*.46);
    else if(k==='bench')mpRmBench(x,a,b);
    else if(k==='bush')mpRmBush(x,a,b+.2,s*.47,d.x*3+d.y);
    else if(k==='dplant1')mpRmPlant(x,a,b+.6,1);
    else if(k==='dplant0')mpRmPlant(x,a,b+.6,0);
    else if(k==='urn')mpRmUrn(x,a,b,1);
    else if(k==='brazier')mpRmBrazier(x,a,b);
    else if(k==='flowerpot')mpRmPot(x,a,b,d.y);
    else if(k==='chest')mpRmChest(x,a,b,1.1)}
  x.restore();
  /* stone teleporter, if the level has one */
  for(const d of D)if(d.k==='teleporter'&&open(d.x,d.y)){const [a,b]=cell(d.x,d.y);mpRmTele(x,a,b)}

  /* ---- the gold door in the south west wall, with steps going down and a lantern on each side ---- */
  if(door.x>=0){const X0=X(door.x),Y0=Y(door.y),mx=X0+s/2,by=Y0+s;
    x.save();mpRmGlow(x,mx,by+2,15,'255,200,90',.4,false);
    // steps
    const sw=[s*1.2,s*1.45,s*1.7],sc=['#efe6cc','#e2d6b4','#d4c6a0'];
    sw.forEach((w2,i)=>{const yy=by+.2+i*2.3;x.fillStyle=sc[i];x.strokeStyle=INK;x.lineWidth=.5;x.fillRect(mx-w2/2,yy,w2,2.3);x.strokeRect(mx-w2/2,yy,w2,2.3);x.strokeStyle='rgba(120,100,60,.5)';x.lineWidth=.25;x.beginPath();x.moveTo(mx-w2/2+.5,yy+1.7);x.lineTo(mx+w2/2-.5,yy+1.7);x.stroke()});
    // the door: an arched frame in ruby and gold, the leaf in gold with planks, studs and a ring
    x.fillStyle='#4a0a16';x.strokeStyle=INK;x.lineWidth=.55;x.beginPath();x.moveTo(X0+.4,by);x.lineTo(X0+.4,Y0+2.6);x.quadraticCurveTo(X0+.4,Y0-.2,mx,Y0-.2);x.quadraticCurveTo(X0+s-.4,Y0-.2,X0+s-.4,Y0+2.6);x.lineTo(X0+s-.4,by);x.closePath();x.fill();x.stroke();
    const gg=x.createLinearGradient(X0,Y0,X0+s,by);gg.addColorStop(0,'#fbe9a0');gg.addColorStop(.5,'#d6ab2e');gg.addColorStop(1,'#8a6a14');
    x.fillStyle=gg;x.beginPath();x.moveTo(X0+1.3,by-.2);x.lineTo(X0+1.3,Y0+2.8);x.quadraticCurveTo(X0+1.3,Y0+.8,mx,Y0+.8);x.quadraticCurveTo(X0+s-1.3,Y0+.8,X0+s-1.3,Y0+2.8);x.lineTo(X0+s-1.3,by-.2);x.closePath();x.fill();x.lineWidth=.35;x.stroke();
    x.strokeStyle='rgba(70,40,0,.7)';x.lineWidth=.3;x.beginPath();x.moveTo(mx,Y0+.9);x.lineTo(mx,by-.2);x.moveTo(X0+2.8,Y0+1.6);x.lineTo(X0+2.8,by-.2);x.moveTo(X0+s-2.8,Y0+1.6);x.lineTo(X0+s-2.8,by-.2);x.stroke();
    x.fillStyle='#e02c44';for(const [a,b] of [[X0+2.1,Y0+4],[X0+s-2.1,Y0+4],[X0+2.1,Y0+6],[X0+s-2.1,Y0+6]]){x.beginPath();x.arc(a,b,.4,0,6.3);x.fill()}
    x.fillStyle=RB.inkR;x.beginPath();x.arc(mx-.8,Y0+4.6,.5,0,6.3);x.arc(mx+.8,Y0+4.6,.5,0,6.3);x.fill();
    for(const dx of [-s*.95,s*.95])mpRmLantern(x,mx+dx,by+3.4,.9,true);
    x.restore()}

  /* ---- the moulded ruby edge all round the plan, with gold rules and corner studs (broken at the door) ---- */
  {x.save();const p=2.6,gx=door.x>=0?X(door.x)-1.4:-1,gx2=door.x>=0?X(door.x+1)+1.4:-1;
    const band=(a,b,c2,d,col,w2)=>{x.strokeStyle=col;x.lineWidth=w2;x.beginPath();x.moveTo(a,b);x.lineTo(c2,d);x.stroke()};
    for(const [off,w2,col] of [[1.8,1.8,'#5a0b19'],[1.8,1.2,'#7a1022'],[.9,.8,'#c99a22'],[.9,.3,'#f6e08a']]){
      const o=off+(w2===1.8?0:0);
      band(PX-o,PY-o,PX+PW+o,PY-o,col,w2);band(PX-o,PY-o,PX-o,PY+PH+o,col,w2);band(PX+PW+o,PY-o,PX+PW+o,PY+PH+o,col,w2);
      if(gx>0){band(PX-o,PY+PH+o,gx,PY+PH+o,col,w2);band(gx2,PY+PH+o,PX+PW+o,PY+PH+o,col,w2)}else band(PX-o,PY+PH+o,PX+PW+o,PY+PH+o,col,w2)}
    x.strokeStyle=INK;x.lineWidth=.5;{const o=p+.4;x.beginPath();x.moveTo(PX-o,PY+PH+o);x.lineTo(PX-o,PY-o);x.lineTo(PX+PW+o,PY-o);x.lineTo(PX+PW+o,PY+PH+o);if(gx>0){x.lineTo(gx2,PY+PH+o);x.moveTo(gx,PY+PH+o);x.lineTo(PX-o,PY+PH+o)}else x.closePath();x.stroke()}
    for(const [a,b] of [[PX-1.2,PY-1.2],[PX+PW+1.2,PY-1.2],[PX-1.2,PY+PH+1.2],[PX+PW+1.2,PY+PH+1.2]]){x.fillStyle='#c99a22';x.strokeStyle=INK;x.lineWidth=.45;x.beginPath();x.arc(a,b,3.2,0,6.3);x.fill();x.stroke();x.fillStyle='#d4243a';x.beginPath();x.arc(a,b,1.8,0,6.3);x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.arc(a-.5,b-.5,.45,0,6.3);x.fill()}
    x.fillStyle='#f6e08a';for(let a=PX+9;a<PX+PW-6;a+=9){for(const b of [PY-2.7,PY+PH+2.7]){if(b>PY+PH&&gx>0&&a>gx-3&&a<gx2+3)continue;x.beginPath();x.arc(a,b,.5,0,6.3);x.fill()}}for(let b=PY+9;b<PY+PH-6;b+=9){for(const a of [PX-2.7,PX+PW+2.7]){x.beginPath();x.arc(a,b,.5,0,6.3);x.fill()}}
    x.restore()}

  /* ---- vines of roses along the top and bottom of the page, and little flourishes in the margins ---- */
  mpRmVine(x,PX+6,PY-8.2,176,PY-8.2,2.2,3,.4,2.8);mpRmVine(x,PX+PW-6,PY-8.2,304,PY-8.2,2.2,3,2.2,2.8);
  mpRmVine(x,PX+PW-6,PY+PH+13.5,168,PY+PH+13.5,2.2,6,1.3,2.8);

  /* ---- place names, in vermilion with a pale halo ---- */
  const nm=(t,cx,cy,sz,rot)=>{const [a,b]=[X(cx),Y(cy)];if(rot){x.save();x.translate(a,b);x.rotate(rot);api.text(x,t,0,0,sz||6.4,MPL.VERM,'center');x.restore()}else api.text(x,t,a,b,sz||6.4,MPL.VERM,'center')};
  nm('The Garden',16.5,9.5,6.4);
  nm('The Long Walk',16.5,17.5,6.4);
  nm('North Quarter',22,1.5,6.2);
  nm('South Quarter',28.5,25.5,6.2);
  nm('West Quarter',1.5,14.5,6.2,-Math.PI/2);
  nm('East Quarter',35.5,15.5,6.2,Math.PI/2);
  if(door.x>=0)api.text(x,'The Gate',X(door.x+.5),Y(door.y+1)+15,6.6,MPL.VERM,'center');

  /* ---- margins: title, compass, key, and the flourishes ---- */
  const key=[
    {t:'Ruby wall',icon:(a,b)=>{x.fillStyle='#a8192d';x.strokeStyle=INK;x.lineWidth=.5;x.fillRect(a-4.5,b-2.4,9,4.8);x.strokeRect(a-4.5,b-2.4,9,4.8);x.strokeStyle='#f6e08a';x.lineWidth=.8;x.beginPath();x.moveTo(a-4.5,b);x.lineTo(a+4.5,b);x.stroke();x.fillStyle='#c99a22';x.beginPath();x.arc(a-3.4,b,1,0,6.3);x.arc(a+3.4,b,1,0,6.3);x.fill()}},
    {t:'Gold door',icon:(a,b)=>{x.fillStyle='#4a0a16';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-3,b+3.4);x.lineTo(a-3,b-1);x.quadraticCurveTo(a-3,b-3.8,a,b-3.8);x.quadraticCurveTo(a+3,b-3.8,a+3,b-1);x.lineTo(a+3,b+3.4);x.closePath();x.fill();x.stroke();x.fillStyle='#d6ab2e';x.fillRect(a-1.9,b-1,3.8,4.2);x.strokeRect(a-1.9,b-1,3.8,4.2)}},
    {t:'Torch',icon:(a,b)=>{mpRmGlow(x,a,b,5.5,'255,170,80',.5,false);x.strokeStyle='#150608';x.lineWidth=1;x.lineCap='round';x.beginPath();x.moveTo(a,b+3.4);x.lineTo(a,b+.6);x.stroke();mpRmFlame(x,a,b-.6,1.05)}},
    {t:'Brazier',icon:(a,b)=>mpRmBrazier(x,a,b+.6)},
    {t:'Fountain',icon:(a,b)=>mpRmFountain(x,a,b,3.6)},
    {t:'Flower bed',icon:(a,b)=>mpRmFlowers(x,a,b,5,0)},
    {t:'Clipped bush',icon:(a,b)=>mpRmBush(x,a,b,3.2,2)},
    {t:'Chest',icon:(a,b)=>mpRmChest(x,a,b+.6,.95)}];
  if(D.some(d=>d.k==='teleporter'))key.push({t:'Teleport stone',icon:(a,b)=>mpRmTele(x,a,b)});
  mpRmMargin(x,api,'Ruby Maze','Ironhill, level 30',key);
  mpRmSeal(x,46,112,13);
  mpRmKey(x,46,172,36,-.6);
  mpRmGem(x,436,208,12);mpRmGem(x,418,230,5.5);mpRmGem(x,454,226,4.5);
  mpRmVine(x,24,286,22,206,3,2,2.6,2.8);
}

if(typeof mplInstall==='function')mplInstall({name:'rubymaze',levels:[500],draw:mpRmDraw,foot:'You are the yellow arrow. Press M to close the map.'});
