/* ==========================================================================
   THE GOLDEN CRYPT on the world map and its local map (prefix mpGc). The crypt (level 31) lies under the Ironhill Burial Ground (level 20), so on the
   world map it stands right beside the burial ground, on a short track from it. The local map is an illuminated plan drawn from the real rows, decor and
   wall torches: ashlar walls with real thickness, flagged floors with a different paving in every hall, lapis and gold inlay, sarcophagi, statues, torch
   light, cobwebs and bones. It carries names and a key only (no notes or hints). It reuses a few small helpers of maps_gravesmines.js (mpGravesLine,
   mpGravesMargin), which are declared before any map is drawn.
   ========================================================================== */
if(typeof WORLD_LOCS!=='undefined'&&!WORLD_LOCS.some(l=>l.k==='goldencrypt')){
  WORLD_LOCS.push({k:'goldencrypt',n:'Golden Crypt',lv:[31],x:160,y:64,ic:'crypt'});
  if(typeof WORLD_ROADS!=='undefined')WORLD_ROADS.push(['graves','goldencrypt']);
}
const MPGC_SEED=3131;
const mpGcH=(a,b,s)=>hash2(a,b,MPGC_SEED+(s||0));
const MPGC_FLOOR=['#e9dfba','#e3d7ae','#dccea4','#e6dab4','#d6c898'];
const MPGC_STONE='#f3ecda';
/* ---------------------------------------------------------------- small drawing helpers */
function mpGcPoly(x,p,fill,stk,lw){x.beginPath();for(let i=0;i<p.length;i++)i?x.lineTo(p[i][0],p[i][1]):x.moveTo(p[i][0],p[i][1]);x.closePath();if(fill){x.fillStyle=fill;x.fill()}if(stk){x.strokeStyle=stk;x.lineWidth=lw||.5;x.lineJoin='round';x.stroke()}}
/* a rough stone around (a,b) */
function mpGcBlob(x,a,b,r,n,sd,fill,stk,lw){const p=[];for(let i=0;i<n;i++){const an=i/n*6.283+mpGcH(sd,i,60)*.6,rr=r*(.7+.5*mpGcH(sd,i,61));p.push([a+Math.cos(an)*rr,b+Math.sin(an)*rr*.82])}mpGcPoly(x,p,fill,stk,lw)}
function mpGcSkull(x,a,b,k){k=k||1;x.save();x.lineJoin='round';x.fillStyle=MPGC_STONE;x.strokeStyle=MPL.INK;x.lineWidth=.42*k+.08;
  x.beginPath();x.arc(a,b-.5*k,2.3*k,0,6.283);x.fill();x.stroke();x.beginPath();x.rect(a-1.3*k,b+1.2*k,2.6*k,1.5*k);x.fill();x.stroke();
  x.fillStyle=MPL.INK;x.beginPath();x.arc(a-.95*k,b-.55*k,.62*k,0,6.283);x.arc(a+.95*k,b-.55*k,.62*k,0,6.283);x.fill();
  x.beginPath();x.moveTo(a,b+.2*k);x.lineTo(a-.32*k,b+.9*k);x.lineTo(a+.32*k,b+.9*k);x.fill();
  x.lineWidth=.22*k+.04;x.beginPath();x.moveTo(a-.45*k,b+1.25*k);x.lineTo(a-.45*k,b+2.65*k);x.moveTo(a+.45*k,b+1.25*k);x.lineTo(a+.45*k,b+2.65*k);x.stroke();x.restore()}
function mpGcBone(x,a,b,len,ang,w){x.save();x.translate(a,b);x.rotate(ang);x.lineCap='round';const e=len/2,kn=w*.62;
  x.strokeStyle=MPL.INK;x.lineWidth=w+.55;x.beginPath();x.moveTo(-e,0);x.lineTo(e,0);x.stroke();
  x.fillStyle=MPL.INK;for(const sx of [-e,e])for(const sy of [-kn,kn]){x.beginPath();x.arc(sx,sy,w*.6+.28,0,6.283);x.fill()}
  x.strokeStyle=MPGC_STONE;x.lineWidth=w;x.beginPath();x.moveTo(-e,0);x.lineTo(e,0);x.stroke();
  x.fillStyle=MPGC_STONE;for(const sx of [-e,e])for(const sy of [-kn,kn]){x.beginPath();x.arc(sx,sy,w*.6,0,6.283);x.fill()}x.restore()}
/* a heap of bones: a skull on crossed bones with a few ribs */
function mpGcBonePile(x,a,b,k){k=k||1;mpGcBone(x,a-.3*k,b+.9*k,5.8*k,.5,.85*k);mpGcBone(x,a+.5*k,b+.7*k,5.2*k,-.6,.85*k);
  x.save();x.strokeStyle=MPL.INK;x.lineWidth=.9*k;x.lineCap='round';for(const dx of [-2.9,2.5]){x.beginPath();x.arc(a+dx*k,b-.2*k,1.5*k,.4,2.7);x.stroke()}
  x.strokeStyle=MPGC_STONE;x.lineWidth=.45*k;for(const dx of [-2.9,2.5]){x.beginPath();x.arc(a+dx*k,b-.2*k,1.5*k,.4,2.7);x.stroke()}x.restore();mpGcSkull(x,a-.2*k,b-1.3*k,.75*k)}
/* a stone sarcophagus seen from above: a carved lid with a gold cross and a little skull at the head; open=true leaves the lid slid aside over a dark hollow with bones in it */
function mpGcCoffin(x,a,b,w,h,open){
  const P=(ox,oy,k)=>[[a+ox-w*.34*k,b+oy-h*.5*k],[a+ox+w*.34*k,b+oy-h*.5*k],[a+ox+w*.5*k,b+oy-h*.2*k],[a+ox+w*.36*k,b+oy+h*.5*k],[a+ox-w*.36*k,b+oy+h*.5*k],[a+ox-w*.5*k,b+oy-h*.2*k]];
  const lid=(ox,oy)=>{const cx=a+ox,cy=b+oy;mpGcPoly(x,P(ox,oy,1),'#cbc4b0',MPL.INK,.7);mpGcPoly(x,P(ox,oy,.78),'#ddd6c3','rgba(60,44,24,.55)',.35);mpGcPoly(x,P(ox,oy,.9),null,'rgba(201,162,39,.8)',.4);
    x.save();x.lineCap='round';x.strokeStyle='rgba(42,26,12,.8)';x.lineWidth=1.45;x.beginPath();x.moveTo(cx,cy-h*.1);x.lineTo(cx,cy+h*.36);x.moveTo(cx-w*.2,cy+h*.04);x.lineTo(cx+w*.2,cy+h*.04);x.stroke();
    x.strokeStyle=MPL.GOLD;x.lineWidth=.85;x.stroke();x.restore();mpGcSkull(x,cx,cy-h*.3,.48*w/6);
    x.strokeStyle='rgba(255,255,245,.55)';x.lineWidth=.35;x.beginPath();x.moveTo(cx-w*.3,cy-h*.43);x.lineTo(cx-w*.43,cy-h*.2);x.stroke()};
  x.save();x.lineJoin='round';mpGcPoly(x,P(1.1,1.3,1),'rgba(40,24,10,.34)');
  if(open){mpGcPoly(x,P(0,0,1),'#2b1d14',MPL.INK,.7);mpGcPoly(x,P(0,0,.8),'#150d07');mpGcSkull(x,a-.2,b-h*.27,.62);mpGcBone(x,a,b+h*.02,w*.55,0,.5);mpGcBone(x,a,b+h*.18,w*.5,0,.5);lid(w*.62,h*.3)}
  else lid(0,0);
  x.restore()}
function mpGcChest(x,a,b,k){k=k||1;const w=7.4*k,h=5.2*k;x.save();x.lineJoin='round';x.fillStyle='rgba(40,24,10,.32)';x.fillRect(a-w/2+.9,b-h/2+1.1,w,h);
  x.fillStyle='#8a5a2a';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillRect(a-w/2,b-h/2,w,h);x.strokeRect(a-w/2,b-h/2,w,h);
  x.strokeStyle='rgba(40,20,5,.55)';x.lineWidth=.3;for(const f of [-.15,.2]){x.beginPath();x.moveTo(a-w/2,b+h*f);x.lineTo(a+w/2,b+h*f);x.stroke()}
  x.fillStyle='#4a4a54';for(const f of [-.3,.3]){x.fillRect(a+w*f-.6*k,b-h/2,1.2*k,h);x.strokeRect(a+w*f-.6*k,b-h/2,1.2*k,h)}
  x.fillStyle='rgba(255,230,170,.45)';x.fillRect(a-w/2+.4,b-h/2+.4,w-.8,.5);
  x.fillStyle=MPL.GOLD;x.fillRect(a-.9*k,b-.2*k,1.8*k,1.9*k);x.strokeRect(a-.9*k,b-.2*k,1.8*k,1.9*k);x.fillStyle=MPL.INK;x.beginPath();x.arc(a,b+.6*k,.3*k,0,6.283);x.fill();
  x.fillStyle=MPL.GOLD2;for(const [sx,sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){x.beginPath();x.arc(a+sx*(w/2-.7),b+sy*(h/2-.7),.32,0,6.283);x.fill()}x.restore()}
function mpGcBarrel(x,a,b,k){k=k||1;x.save();x.fillStyle='rgba(40,24,10,.3)';x.beginPath();x.arc(a+.8,b+1,3.1*k,0,6.283);x.fill();
  x.fillStyle='#8a5a2a';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.arc(a,b,3.1*k,0,6.283);x.fill();x.stroke();
  x.strokeStyle='rgba(40,20,5,.6)';x.lineWidth=.3;for(let i=0;i<6;i++){const an=i*1.0472;x.beginPath();x.moveTo(a+Math.cos(an)*.4,b+Math.sin(an)*.4);x.lineTo(a+Math.cos(an)*2.8*k,b+Math.sin(an)*2.8*k);x.stroke()}
  x.strokeStyle='#4a4a54';x.lineWidth=.6;x.beginPath();x.arc(a,b,2.2*k,0,6.283);x.stroke();x.fillStyle='rgba(255,230,170,.4)';x.beginPath();x.arc(a-.8,b-.8,.9*k,0,6.283);x.fill();x.restore()}
/* a statue of a robed saint on a stepped plinth, with a gold halo; (a,b) is the middle of the plinth's foot */
function mpGcStatue(x,a,b,k){k=k||1;x.save();x.lineJoin='round';x.fillStyle='rgba(40,24,10,.3)';x.beginPath();x.ellipse(a+1,b+1.2*k,3.8*k,1*k,0,0,6.283);x.fill();
  x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillStyle='#b4ad9a';x.fillRect(a-3.5*k,b-1.2*k,7*k,2.2*k);x.strokeRect(a-3.5*k,b-1.2*k,7*k,2.2*k);
  x.fillStyle='#c4bdaa';x.fillRect(a-2.6*k,b-3.6*k,5.2*k,2.4*k);x.strokeRect(a-2.6*k,b-3.6*k,5.2*k,2.4*k);
  mpGcPoly(x,[[a-1.5*k,b-8*k],[a+1.5*k,b-8*k],[a+2.2*k,b-3.6*k],[a-2.2*k,b-3.6*k]],'#d6cfbc',MPL.INK,.6);
  x.fillStyle='#c4bdaa';x.fillRect(a-1.1*k,b-6.2*k,2.2*k,1.1*k);x.strokeRect(a-1.1*k,b-6.2*k,2.2*k,1.1*k);
  x.fillStyle='#dcd5c2';x.beginPath();x.arc(a,b-9.3*k,1.5*k,0,6.283);x.fill();x.stroke();
  x.strokeStyle=MPL.GOLD;x.lineWidth=.7*k;x.beginPath();x.arc(a,b-9.3*k,2.4*k,3.5,5.9);x.stroke();
  x.strokeStyle='rgba(255,255,245,.6)';x.lineWidth=.3;x.beginPath();x.moveTo(a-.9*k,b-7.6*k);x.lineTo(a-1.5*k,b-4.2*k);x.stroke();x.restore()}
/* a wall lever: an iron plate with a red-handled arm */
function mpGcLever(x,a,b){x.save();x.fillStyle='#4a4a54';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-2,b-2,4,4);x.strokeRect(a-2,b-2,4,4);
  x.fillStyle=MPL.GOLD2;for(const [sx,sy] of [[-1.2,-1.2],[1.2,-1.2],[-1.2,1.2],[1.2,1.2]]){x.beginPath();x.arc(a+sx,b+sy,.28,0,6.283);x.fill()}
  x.lineCap='round';x.strokeStyle=MPL.INK;x.lineWidth=2;x.beginPath();x.moveTo(a,b);x.lineTo(a+2.9,b-2.9);x.stroke();x.strokeStyle=MPL.VERM;x.lineWidth=1.2;x.stroke();
  x.fillStyle=MPL.VERM;x.strokeStyle=MPL.INK;x.lineWidth=.4;x.beginPath();x.arc(a+2.9,b-2.9,1.2,0,6.283);x.fill();x.stroke();x.restore()}
/* a wall torch: iron bracket, cup and flame (with a glow when glow is true) */
function mpGcTorch(x,a,b,k,glow){k=k||1;x.save();
  if(glow){const g=x.createRadialGradient(a,b-2*k,0,a,b-2*k,7*k);g.addColorStop(0,'rgba(255,190,80,.6)');g.addColorStop(1,'rgba(255,190,80,0)');x.fillStyle=g;x.beginPath();x.arc(a,b-2*k,7*k,0,6.283);x.fill()}
  x.strokeStyle=MPL.INK;x.lineWidth=.4*k;x.fillStyle='#3a3a42';x.fillRect(a-.45*k,b-.2*k,.9*k,2.4*k);x.strokeRect(a-.45*k,b-.2*k,.9*k,2.4*k);
  mpGcPoly(x,[[a-1.3*k,b-.2*k],[a+1.3*k,b-.2*k],[a+.8*k,b+.8*k],[a-.8*k,b+.8*k]],'#5a5a66',MPL.INK,.35*k);
  x.fillStyle='#ff9a24';x.beginPath();x.moveTo(a-.95*k,b-.3*k);x.quadraticCurveTo(a-1.4*k,b-2.5*k,a,b-4*k);x.quadraticCurveTo(a+1.4*k,b-2.5*k,a+.95*k,b-.3*k);x.closePath();x.fill();x.stroke();
  x.fillStyle='#ffe27a';x.beginPath();x.moveTo(a-.45*k,b-.4*k);x.quadraticCurveTo(a-.7*k,b-1.6*k,a,b-2.5*k);x.quadraticCurveTo(a+.7*k,b-1.6*k,a+.45*k,b-.4*k);x.closePath();x.fill();x.restore()}
/* the stone that wakes the teleporter: a rune ring round a blue star */
function mpGcTele(x,a,b,r){x.save();const g=x.createRadialGradient(a,b,0,a,b,r*2);g.addColorStop(0,'rgba(120,160,255,.5)');g.addColorStop(1,'rgba(120,160,255,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,r*2,0,6.283);x.fill();
  x.fillStyle='#8f92a6';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.arc(a,b,r,0,6.283);x.fill();x.stroke();x.strokeStyle=MPL.LAPIS;x.lineWidth=.7;x.beginPath();x.arc(a,b,r*.8,0,6.283);x.stroke();
  x.strokeStyle=MPL.GOLD2;x.lineWidth=.45;for(let i=0;i<12;i++){const an=i/12*6.283,r0=r*.5,r1=r*(i%2?.66:.7);x.beginPath();x.moveTo(a+Math.cos(an)*r0,b+Math.sin(an)*r0);x.lineTo(a+Math.cos(an)*r1,b+Math.sin(an)*r1);x.stroke()}
  x.fillStyle=MPL.LAPIS;x.strokeStyle=MPL.INK;x.lineWidth=.3;x.beginPath();for(let i=0;i<8;i++){const rr=i%2?r*.12:r*.4,an=-1.5708+i*.7854;i?x.lineTo(a+Math.cos(an)*rr,b+Math.sin(an)*rr):x.moveTo(a+Math.cos(an)*rr,b+Math.sin(an)*rr)}x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(a,b,r*.1,0,6.283);x.fill();x.restore()}
/* a flight of stairs climbing south out of the cell (X0,Y0) of size s: worn treads, dark side walls and a red arrow */
function mpGcStair(x,X0,Y0,w,h){x.save();x.fillStyle='#2e2016';x.fillRect(X0,Y0,w,h);
  for(let i=0;i<6;i++){const t=i/5,r=Math.round(150+t*84),g=Math.round(118+t*86),bl=Math.round(70+t*70);x.fillStyle=`rgb(${r},${g},${bl})`;x.fillRect(X0+.8,Y0+i*h/6,w-1.6,h/6-.25);x.fillStyle='rgba(30,18,8,.45)';x.fillRect(X0+.8,Y0+(i+1)*h/6-.45,w-1.6,.45)}
  x.strokeStyle=MPL.INK;x.lineWidth=1;x.strokeRect(X0,Y0,w,h);x.fillStyle=MPL.VERM;x.strokeStyle=MPL.INK;x.lineWidth=.35;x.beginPath();x.moveTo(X0+w*.5,Y0+h*.9);x.lineTo(X0+w*.78,Y0+h*.5);x.lineTo(X0+w*.22,Y0+h*.5);x.closePath();x.fill();x.stroke();x.restore()}
/* the gold double door: stone jambs, two gold leaves with studs and a red lock */
function mpGcDoor(x,a,b,w,h){x.save();const g=x.createRadialGradient(a,b,0,a,b,h*.95);g.addColorStop(0,'rgba(255,222,120,.55)');g.addColorStop(1,'rgba(255,222,120,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,h*.95,0,6.283);x.fill();
  x.fillStyle='#a8a090';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillRect(a-w/2,b-h/2,w,h);x.strokeRect(a-w/2,b-h/2,w,h);
  x.fillStyle=MPL.GOLD;x.fillRect(a-w/2+1.1,b-h/2+.7,w/2-1.1,h-1.4);x.fillRect(a+.15,b-h/2+.7,w/2-1.25,h-1.4);x.strokeRect(a-w/2+1.1,b-h/2+.7,w/2-1.1,h-1.4);x.strokeRect(a+.15,b-h/2+.7,w/2-1.25,h-1.4);
  x.fillStyle=MPL.GOLD2;x.fillRect(a-w/2+1.6,b-h/2+1.2,.5,h-2.4);x.fillRect(a+w/2-2.1,b-h/2+1.2,.5,h-2.4);
  x.fillStyle=MPL.VERM;x.beginPath();x.arc(a,b,.75,0,6.283);x.fill();x.stroke();x.restore()}
/* a cobweb spun into the corner (a,b), opening towards (dx,dy) */
function mpGcWeb(x,a,b,dx,dy,r){x.save();x.lineCap='round';const sp=[];for(let i=0;i<4;i++){const an=i/3*1.5708;sp.push([dx*Math.cos(an),dy*Math.sin(an)])}
  for(const col of ['rgba(255,255,255,.55)','rgba(74,70,88,.6)']){x.strokeStyle=col;x.lineWidth=col[5]==='2'?.8:.28;x.beginPath();
    for(const q of sp){x.moveTo(a,b);x.lineTo(a+q[0]*r,b+q[1]*r)}
    for(const f of [.36,.66,1]){for(let i=0;i<3;i++){const p0=sp[i],p1=sp[i+1],mx=(p0[0]+p1[0])/2*f*.82,my=(p0[1]+p1[1])/2*f*.82;x.moveTo(a+p0[0]*r*f,b+p0[1]*r*f);x.quadraticCurveTo(a+mx*r,b+my*r,a+p1[0]*r*f,b+p1[1]*r*f)}}
    x.stroke()}x.restore()}
/* a gold Greek key along a straight run of length len from (a,b), turned by rot; the strip is 2.8 px deep */
function mpGcKey(x,a,b,len,rot){const hh=2.8,n=Math.max(1,Math.round(len/6)),P=len/n;x.save();x.translate(a,b);x.rotate(rot);x.lineCap='butt';x.lineJoin='miter';
  for(const col of ['rgba(42,26,12,.35)',MPL.GOLD]){x.strokeStyle=col;x.lineWidth=col===MPL.GOLD?.5:.9;x.beginPath();x.moveTo(0,hh);x.lineTo(len,hh);
    for(let i=0;i<n;i++){const x0=i*P;x.moveTo(x0,hh);x.lineTo(x0,0);x.lineTo(x0+P*.72,0);x.lineTo(x0+P*.72,hh*.72);x.lineTo(x0+P*.3,hh*.72);x.lineTo(x0+P*.3,hh*.38);x.lineTo(x0+P*.5,hh*.38)}x.stroke()}x.restore()}
/* a lapis ring inlaid with a gold key, set just inside the walls of a hall, with a gold rosette at each corner */
function mpGcBand(x,X0,Y0,w,h){const o=2,bw=4.2,ia=X0+o+bw,ib=Y0+o+bw,iw=w-2*o-2*bw,ih=h-2*o-2*bw;x.save();
  x.beginPath();x.rect(X0+o,Y0+o,w-2*o,h-2*o);x.rect(ia,ib,iw,ih);x.fillStyle='rgba(39,74,154,.3)';x.fill('evenodd');
  x.strokeStyle=MPL.GOLD;x.lineWidth=.7;x.strokeRect(X0+o,Y0+o,w-2*o,h-2*o);x.strokeRect(ia,ib,iw,ih);
  x.strokeStyle='rgba(42,26,12,.5)';x.lineWidth=.3;x.strokeRect(X0+o-.6,Y0+o-.6,w-2*o+1.2,h-2*o+1.2);x.strokeRect(ia+.6,ib+.6,iw-1.2,ih-1.2);
  mpGcKey(x,ia,Y0+o+.7,iw,0);mpGcKey(x,X0+w-o-.7,ib,ih,1.5708);mpGcKey(x,X0+w-o-bw,Y0+h-o-.7,iw,3.1416);mpGcKey(x,X0+o+.7,Y0+h-o-bw,ih,-1.5708);
  for(const [a,b] of [[X0+o+bw/2,Y0+o+bw/2],[X0+w-o-bw/2,Y0+o+bw/2],[X0+o+bw/2,Y0+h-o-bw/2],[X0+w-o-bw/2,Y0+h-o-bw/2]]){x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.35;x.beginPath();x.arc(a,b,2.2,0,6.283);x.fill();x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.arc(a,b,1.15,0,6.283);x.fill();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(a,b,.4,0,6.283);x.fill()}x.restore()}
/* a four-pointed glint of gold leaf */
function mpGcGlint(x,a,b,r){x.save();mpGcPoly(x,[[a,b-r],[a+r*.22,b-r*.22],[a+r,b],[a+r*.22,b+r*.22],[a,b+r],[a-r*.22,b+r*.22],[a-r,b],[a-r*.22,b-r*.22]],'#fff8d0','rgba(150,110,20,.7)',.25);x.restore()}
/* a round medallion of gold and lapis let into the floor; kind picks the emblem at its heart */
function mpGcMedal(x,a,b,r,kind){x.save();x.fillStyle='rgba(244,234,200,.92)';x.beginPath();x.arc(a,b,r,0,6.283);x.fill();
  x.strokeStyle='rgba(39,74,154,.75)';x.lineWidth=r*.2;x.beginPath();x.arc(a,b,r*.86,0,6.283);x.stroke();
  x.strokeStyle=MPL.GOLD;x.lineWidth=.7;x.beginPath();x.arc(a,b,r,0,6.283);x.stroke();x.beginPath();x.arc(a,b,r*.74,0,6.283);x.stroke();
  x.strokeStyle='rgba(42,26,12,.6)';x.lineWidth=.35;x.beginPath();x.arc(a,b,r+.7,0,6.283);x.stroke();x.beginPath();x.arc(a,b,r*.74-.6,0,6.283);x.stroke();
  x.fillStyle=MPL.GOLD2;for(let i=0;i<16;i++){const an=i/16*6.283;x.beginPath();x.arc(a+Math.cos(an)*r*.87,b+Math.sin(an)*r*.87,.5,0,6.283);x.fill()}
  const e=r*.64;x.strokeStyle=MPL.INK;x.lineWidth=.35;
  if(kind==='star'||kind==='sun'){const pts=kind==='star'?16:16;x.fillStyle=kind==='star'?MPL.VERM:MPL.LAPIS;x.beginPath();for(let i=0;i<pts;i++){const rr=kind==='star'?(i%2?e*.42:e):(i%4===0?e:i%2?e*.3:e*.6),an=-1.5708+i/pts*6.283;i?x.lineTo(a+Math.cos(an)*rr,b+Math.sin(an)*rr):x.moveTo(a+Math.cos(an)*rr,b+Math.sin(an)*rr)}x.closePath();x.fill();x.stroke();
    x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a,b,e*.24,0,6.283);x.fill();x.stroke()}
  else if(kind==='ring'){x.fillStyle=MPL.GOLD;x.globalAlpha=.5;x.beginPath();x.arc(a,b,e*.9,0,6.283);x.fill();x.globalAlpha=1;x.strokeStyle=MPL.INK;x.lineWidth=.35;x.beginPath();x.arc(a,b,e*.9,0,6.283);x.stroke()}
  else if(kind==='rose'){for(let i=0;i<8;i++){x.save();x.translate(a,b);x.rotate(i*.7854);x.fillStyle=i%2?MPL.GOLD:MPL.LAPIS;x.beginPath();x.ellipse(0,-e*.55,e*.2,e*.5,0,0,6.283);x.fill();x.stroke();x.restore()}x.fillStyle=MPL.VERM;x.beginPath();x.arc(a,b,e*.26,0,6.283);x.fill();x.stroke()}
  else if(kind==='skull'){mpGcBone(x,a,b+e*.1,e*2,.55,.8);mpGcBone(x,a,b+e*.1,e*2,-.55,.8);mpGcSkull(x,a,b-e*.12,e*.36)}
  else if(kind==='cross'){x.fillStyle=MPL.GOLD;const t=e*.34,q=e*1.05;for(let i=0;i<4;i++){x.save();x.translate(a,b);x.rotate(i*1.5708);x.beginPath();x.moveTo(-t*.55,-t*.4);x.lineTo(-t*.9,-q);x.lineTo(t*.9,-q);x.lineTo(t*.55,-t*.4);x.closePath();x.fill();x.stroke();x.restore()}x.fillStyle=MPL.LAPIS;x.beginPath();x.arc(a,b,t*.5,0,6.283);x.fill();x.stroke()}
  else if(kind==='key'){x.save();x.translate(a,b);x.rotate(-.7854);x.lineCap='round';for(const [col,lw] of [[MPL.INK,2.1],[MPL.GOLD,1.2]]){x.strokeStyle=col;x.lineWidth=lw;x.beginPath();x.arc(-e*.62,0,e*.3,0,6.283);x.moveTo(-e*.32,0);x.lineTo(e*.8,0);x.moveTo(e*.5,0);x.lineTo(e*.5,e*.34);x.moveTo(e*.8,0);x.lineTo(e*.8,e*.3);x.stroke()}x.restore()}
  x.restore()}
/* a lit candle in a gold stand, for the margins */
function mpGcCandle(x,a,b,k){k=k||1;x.save();x.lineJoin='round';const g=x.createRadialGradient(a,b-27*k,0,a,b-27*k,17*k);g.addColorStop(0,'rgba(255,214,110,.5)');g.addColorStop(1,'rgba(255,214,110,0)');x.fillStyle=g;x.beginPath();x.arc(a,b-27*k,17*k,0,6.283);x.fill();
  x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.ellipse(a,b-1.2*k,7*k,2.2*k,0,0,6.283);x.fill();x.stroke();
  mpGcPoly(x,[[a-1.2*k,b-3*k],[a-2.3*k,b-8*k],[a-1*k,b-10*k],[a-2.5*k,b-13*k],[a-1.1*k,b-15*k],[a+1.1*k,b-15*k],[a+2.5*k,b-13*k],[a+1*k,b-10*k],[a+2.3*k,b-8*k],[a+1.2*k,b-3*k]],MPL.GOLD,MPL.INK,.6);
  x.fillStyle=MPL.GOLD2;x.beginPath();x.ellipse(a,b-8.6*k,2.2*k,.9*k,0,0,6.283);x.fill();x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.ellipse(a,b-15.4*k,4.2*k,1.3*k,0,0,6.283);x.fill();x.stroke();
  x.fillStyle='#f4ecd2';x.fillRect(a-1.8*k,b-24*k,3.6*k,9*k);x.strokeRect(a-1.8*k,b-24*k,3.6*k,9*k);
  x.fillStyle='#f4ecd2';x.beginPath();x.moveTo(a+1.8*k,b-23.8*k);x.quadraticCurveTo(a+2.9*k,b-22*k,a+2.5*k,b-20*k);x.quadraticCurveTo(a+1.9*k,b-19*k,a+1.8*k,b-20*k);x.fill();x.stroke();
  x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.moveTo(a,b-24*k);x.lineTo(a,b-25.4*k);x.stroke();
  x.fillStyle='#ff9a24';x.beginPath();x.moveTo(a-1.3*k,b-25*k);x.quadraticCurveTo(a-2*k,b-28.5*k,a,b-32*k);x.quadraticCurveTo(a+2*k,b-28.5*k,a+1.3*k,b-25*k);x.closePath();x.fill();x.lineWidth=.5;x.stroke();
  x.fillStyle='#ffe27a';x.beginPath();x.moveTo(a-.6*k,b-25.2*k);x.quadraticCurveTo(a-1*k,b-27.4*k,a,b-29.2*k);x.quadraticCurveTo(a+1*k,b-27.4*k,a+.6*k,b-25.2*k);x.fill();x.restore()}
/* a larger skull over crossed thigh bones, for the margins: sepia ink, a bone-coloured wash and pen hatching on the shadowed side */
function mpGcMemento(x,a,b,k){k=k||1;x.save();x.lineJoin='round';x.lineCap='round';x.fillStyle='rgba(40,24,10,.22)';x.beginPath();x.ellipse(a,b+8*k,13*k,2.6*k,0,0,6.283);x.fill();
  for(const sg of [1,-1]){x.save();x.translate(a,b+4*k);x.rotate(sg*.5);for(const [col,lw] of [[MPL.INK,3.4*k],['#eadfc0',2.6*k]]){x.strokeStyle=col;x.lineWidth=lw;x.beginPath();x.moveTo(-12*k,0);x.lineTo(12*k,0);x.stroke()}
    for(const ex of [-12,12])for(const ey of [-1.5,1.5]){x.fillStyle='#eadfc0';x.strokeStyle=MPL.INK;x.lineWidth=.55*k;x.beginPath();x.arc(ex*k,ey*k,1.7*k,0,6.283);x.fill();x.stroke()}
    x.strokeStyle='rgba(42,26,12,.5)';x.lineWidth=.3*k;x.beginPath();for(let h=-9;h<=9;h+=2.2){x.moveTo(h*k,.2*k);x.lineTo((h+1)*k,1.2*k)}x.stroke();x.restore()}
  const tr=()=>{x.beginPath();x.moveTo(a-6*k,b-1*k);x.bezierCurveTo(a-6*k,b-8*k,a-3*k,b-11*k,a,b-11*k);x.bezierCurveTo(a+3*k,b-11*k,a+6*k,b-8*k,a+6*k,b-1*k);x.bezierCurveTo(a+6*k,b+2*k,a+4.5*k,b+3.4*k,a+3.6*k,b+4*k);
    x.lineTo(a+3.6*k,b+6.4*k);x.lineTo(a+2.6*k,b+8.4*k);x.lineTo(a-2.6*k,b+8.4*k);x.lineTo(a-3.6*k,b+6.4*k);x.lineTo(a-3.6*k,b+4*k);x.bezierCurveTo(a-4.5*k,b+3.4*k,a-6*k,b+2*k,a-6*k,b-1*k);x.closePath()};
  tr();x.fillStyle='#efe6cc';x.fill();x.save();tr();x.clip();x.fillStyle='rgba(120,84,40,.3)';x.fillRect(a+1.8*k,b-12*k,6*k,24*k);x.strokeStyle='rgba(42,26,12,.55)';x.lineWidth=.3*k;x.beginPath();for(let h=0;h<16;h++){x.moveTo(a+(1.2+h*.3)*k,b-10.5*k+h*1.2*k);x.lineTo(a+(5.8+h*.02)*k,b-11.5*k+h*1.25*k)}x.stroke();x.restore();
  tr();x.strokeStyle=MPL.INK;x.lineWidth=.8*k;x.stroke();
  x.fillStyle=MPL.INK;for(const ex of [-2.7,2.7]){x.beginPath();x.ellipse(a+ex*k,b-.4*k,1.9*k,2.3*k,0,0,6.283);x.fill()}x.fillStyle='rgba(255,246,220,.7)';for(const ex of [-3.2,2.2]){x.beginPath();x.arc(a+ex*k,b-1.2*k,.4*k,0,6.283);x.fill()}
  x.fillStyle=MPL.INK;x.beginPath();x.moveTo(a,b+2.2*k);x.lineTo(a-1*k,b+4.4*k);x.lineTo(a+1*k,b+4.4*k);x.closePath();x.fill();
  x.strokeStyle=MPL.INK;x.lineWidth=.45*k;x.beginPath();for(let h=-2;h<=2;h++){x.moveTo(a+h*k,b+5.6*k);x.lineTo(a+h*k,b+8.2*k)}x.moveTo(a-3.4*k,b+6.1*k);x.lineTo(a+3.4*k,b+6.1*k);x.moveTo(a-5.2*k,b+1.6*k);x.lineTo(a-4.4*k,b+3.6*k);x.moveTo(a+5.2*k,b+1.6*k);x.lineTo(a+4.4*k,b+3.6*k);x.stroke();x.restore()}
/* a little hourglass on a gold frame, for the margins */
function mpGcGlass(x,a,b,k){k=k||1;x.save();x.lineJoin='round';x.lineCap='round';x.fillStyle='rgba(40,24,10,.2)';x.beginPath();x.ellipse(a+1,b+15*k,8*k,1.8*k,0,0,6.283);x.fill();
  x.strokeStyle=MPL.VERM;x.lineWidth=1.5*k;for(const dx of [-5.6,5.6]){x.beginPath();x.moveTo(a+dx*k,b-12*k);x.lineTo(a+dx*k,b+12*k);x.stroke()}x.strokeStyle=MPL.INK;x.lineWidth=.35;for(const dx of [-5.6,5.6]){x.beginPath();x.moveTo(a+dx*k-.8*k,b-12*k);x.lineTo(a+dx*k-.8*k,b+12*k);x.moveTo(a+dx*k+.8*k,b-12*k);x.lineTo(a+dx*k+.8*k,b+12*k);x.stroke()}
  mpGcPoly(x,[[a-4.3*k,b-11*k],[a+4.3*k,b-11*k],[a+4.3*k,b-9*k],[a+.8*k,b-.6*k],[a+.8*k,b+.6*k],[a+4.3*k,b+9*k],[a+4.3*k,b+11*k],[a-4.3*k,b+11*k],[a-4.3*k,b+9*k],[a-.8*k,b+.6*k],[a-.8*k,b-.6*k],[a-4.3*k,b-9*k]],'rgba(214,232,240,.55)',MPL.INK,.5);
  mpGcPoly(x,[[a-3.2*k,b-9.2*k],[a+3.2*k,b-9.2*k],[a+.5*k,b-3.2*k],[a-.5*k,b-3.2*k]],'#cf9a3c');mpGcPoly(x,[[a-3.8*k,b+10.4*k],[a-1*k,b+5.6*k],[a+1*k,b+5.6*k],[a+3.8*k,b+10.4*k]],'#cf9a3c',MPL.INK,.35);x.strokeStyle='#cf9a3c';x.lineWidth=.45*k;x.beginPath();x.moveTo(a,b-3*k);x.lineTo(a,b+5.6*k);x.stroke();
  for(const yy of [b-12.4*k,b+12.4*k]){x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-7.2*k,yy-1.2*k,14.4*k,2.4*k);x.strokeRect(a-7.2*k,yy-1.2*k,14.4*k,2.4*k);x.fillStyle=MPL.GOLD2;x.fillRect(a-6.6*k,yy-.9*k,13.2*k,.5)}x.restore()}

/* ---------------------------------------------------------------- the map */
function mpGcDraw(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,R=L.rows;
  const ch=(cx,cy)=>(R[cy]&&R[cy][cx])||'#';
  const open=(cx,cy)=>{const q=ch(cx,cy);return q==='.'||q==='0'};
  const D=((typeof LEVEL!=='undefined'&&LEVEL===31&&typeof G!=='undefined'&&G.decor&&G.decor.length)?G.decor:L.decor)||[];
  /* the halls (room boxes in cells): how each is paved and inlaid, its tints, where the medallion sits (mc) and where its name may go (tc, best first) */
  const ROOMS=[
    {n:'Statue Hall',x:3,y:2,w:8,h:7,pat:'sq',med:'star',mr:11,mc:[7,5.5],pal:['#eee8cb','#e1dcbb','#d3cdaa','#e9e2c2','#dad3b0'],tc:[[7.6,3.0],[6.4,7.9]]},
    {n:'Hall of Coffins',x:12,y:3,w:11,h:5,pat:'slab',med:'rose',mr:9,mc:[16.3,5.5],pal:['#f0dfc4','#e8d3b5','#dcc4a2','#edd9bb','#e2cbab'],tc:[[17.5,3.55],[17.5,6.95]]},
    {n:'Skeleton Room',x:25,y:2,w:9,h:4,pat:'irr',med:'ring',mr:6,mc:[29.5,3.55],pal:['#eeeadf','#e2ded2','#d6d2c6','#eae5d6','#dcd7c8'],tc:[[29.5,5.2],[29.5,2.6]]},
    {n:'West Crypt',x:3,y:14,w:7,h:6,pat:'dia',med:'cross',mr:10,mc:[6.5,17],pal:['#f1edd8','#c6cbc8'],tc:[[7.6,15.0],[6.4,19.15]]},
    {n:'Key Room',x:22,y:15,w:11,h:5,pat:'chk',med:'key',mr:10,mc:[26.6,17.5],pal:['#f4ebca','#cfb77a'],tc:[[27.5,15.85],[27.5,19.15]]},
    {n:'Entrance Hall',x:14,y:20,w:7,h:4,pat:'big',med:'sun',mr:7,mc:[18.5,21.85],pal:['#efe3be','#e2d2a2','#d3c08c','#ebdcb0','#dac796'],tc:[[17.2,20.55]]}];
  const roomAt=(cx,cy)=>{for(const r of ROOMS)if(cx>=r.x&&cx<r.x+r.w&&cy>=r.y&&cy<r.y+r.h)return r;return null};
  /* how far (in cells, up to 4) each wall cell is from the nearest floor */
  const dist=new Uint8Array(W*H);
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(open(cx,cy))continue;let d=4;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)if(open(cx+dx,cy+dy)){const m=Math.max(Math.abs(dx),Math.abs(dy));if(m<d)d=m}dist[cy*W+cx]=d}
  const dd=(cx,cy)=>cx<0||cy<0||cx>=W||cy>=H?9:dist[cy*W+cx];
  const PX=F.ox,PY=F.oy,PW=W*s,PH=H*s;
  /* the plan stands on the page: a soft shadow under it */
  x.save();x.shadowColor='rgba(40,24,10,.5)';x.shadowBlur=24;x.shadowOffsetX=6;x.shadowOffsetY=9;x.fillStyle='#645b50';x.fillRect(PX,PY,PW,PH);x.restore();
  x.save();x.beginPath();x.rect(PX,PY,PW,PH);x.clip();

  /* ---- the rock all round: warm dark earth with strata, packed stones, pen stipple and hatching, and a few old bones in it ---- */
  x.fillStyle='#645b50';x.fillRect(PX,PY,PW,PH);
  for(let i=0;i<120;i++){const px=PX+mpGcH(i,1,7)*PW,py=PY+mpGcH(i,2,7)*PH,rx=8+mpGcH(i,3,7)*26,ry=5+mpGcH(i,4,7)*14;x.fillStyle=i%3===0?'rgba(130,88,46,.15)':i%3===1?'rgba(30,28,48,.15)':'rgba(196,176,140,.08)';x.beginPath();x.ellipse(px,py,rx,ry,mpGcH(i,5,7)*3,0,6.283);x.fill()}
  x.strokeStyle='rgba(210,186,146,.11)';x.lineWidth=.4;for(let j=0;j<24;j++){const y0=PY+(j+.5)*PH/24;x.beginPath();for(let a=0;a<=PW;a+=5){const yy=y0+Math.sin(a*.045+j*1.7)*1.5+(mpGcH(j,a|0,8)-.5)*.9;a?x.lineTo(PX+a,yy):x.moveTo(PX,yy)}x.stroke()}
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){const d=dd(cx,cy);if(d<2)continue;const X0=X(cx),Y0=Y(cy);
    for(let k=0;k<3;k++)if(mpGcH(cx,cy,10+k)<.4){const a=X0+mpGcH(cx,cy,13+k)*s,b=Y0+mpGcH(cx,cy,16+k)*s,big=mpGcH(cx,cy,25+k)<.18,r=s*(big?.3:.12+.13*mpGcH(cx,cy,19+k)),t=mpGcH(cx,cy,22+k);
      mpGcBlob(x,a,b,r,big?8:6,cx*131+cy*17+k,t<.34?'#7a7062':t<.67?'#8a7e6c':'#675e52','rgba(22,16,10,.7)',.35);x.strokeStyle='rgba(226,212,184,.3)';x.lineWidth=.3;x.beginPath();x.arc(a-r*.1,b-r*.1,r*.55,3.4,4.7);x.stroke();
      if(big){x.strokeStyle='rgba(22,16,10,.5)';x.lineWidth=.3;x.beginPath();x.moveTo(a-r*.5,b+r*.1);x.lineTo(a+r*.2,b-r*.2);x.stroke()}}
    x.fillStyle='rgba(16,10,6,.42)';for(let k=0;k<5;k++)x.fillRect(X0+mpGcH(cx,cy,30+k)*s,Y0+mpGcH(cx,cy,35+k)*s,.5,.5);
    if(d<=3){const dir=(mpGcH(cx>>1,cy>>1,45)<.5?1:-1)*(mpGcH(cx,cy,46)<.16?-1:1),nn=d===2?4:2;x.strokeStyle=d===2?'rgba(14,8,4,.5)':'rgba(14,8,4,.3)';x.lineWidth=.32;x.beginPath();
      for(let k=0;k<nn;k++){const px=X0+(k+.25+mpGcH(cx,cy,40+k)*.5)*s/nn,py=Y0+mpGcH(cx,cy,44+k)*s*.3,ln=.26+.3*mpGcH(cx,cy,48+k);x.moveTo(px,py);x.lineTo(px+dir*s*.2,py+s*ln)}
      if(d===2&&mpGcH(cx,cy,52)<.55)for(let k=0;k<3;k++){const px=X0+(k+.3)*s/3,py=Y0+s*.15+mpGcH(cx,cy,53+k)*s*.4;x.moveTo(px,py);x.lineTo(px-dir*s*.22,py+s*(.25+.2*mpGcH(cx,cy,57+k)))}x.stroke()}}
  for(let i=0,n=0;i<600&&n<18;i++){const cx=Math.floor(mpGcH(i,50)*W),cy=Math.floor(mpGcH(i,51)*H);if(dd(cx,cy)<2)continue;const a=X(cx+.2+.6*mpGcH(i,52)),b=Y(cy+.2+.6*mpGcH(i,53));n++;
    if(n%4===0)mpGcSkull(x,a,b,.55);else mpGcBone(x,a,b,3.2,mpGcH(i,54)*3.14,.5)}

  /* ---- the walls: ashlar in running courses, only where a wall cell touches a floor; stained, mossy and hatched ---- */
  const wp=new Path2D();for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)if(dd(cx,cy)===1)wp.rect(X(cx)-.15,Y(cy)-.15,s+.3,s+.3);
  x.save();x.clip(wp);x.fillStyle='#a69e8a';x.fillRect(PX,PY,PW,PH);
  const ch3=s/3;
  for(let j=0;j<H*3;j++){const y0=PY+j*ch3,cyy=Math.floor(j/3),off=(j%2)*2.7+mpGcH(j,1,70)*1.4;let any=false;for(let cx=0;cx<W;cx++)if(dd(cx,cyy)===1){any=true;break}if(!any)continue;
    let a=PX-off;while(a<PX+PW){const bw=4.2+mpGcH(j,Math.floor(a),71)*3.4,cxx=Math.floor((a+bw/2-PX)/s);
      if(dd(cxx,cyy)===1){const t=mpGcH(j,Math.floor(a),72);x.fillStyle=t<.3?'rgba(255,248,230,.2)':t<.62?'rgba(70,52,34,.13)':t<.85?'rgba(130,100,70,.15)':'rgba(40,36,56,.15)';x.fillRect(a,y0,bw,ch3);
        x.fillStyle='rgba(255,252,238,.3)';x.fillRect(a+.2,y0+.1,bw-.4,.4);
        x.strokeStyle='rgba(46,34,24,.6)';x.lineWidth=.3;x.beginPath();x.moveTo(a,y0+ch3);x.lineTo(a+bw,y0+ch3);x.moveTo(a+bw,y0);x.lineTo(a+bw,y0+ch3);x.stroke()}
      a+=bw}}
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(dd(cx,cy)!==1)continue;const X0=X(cx),Y0=Y(cy),h=mpGcH(cx,cy,75);
    if(h<.16){x.fillStyle='rgba(70,46,24,.16)';x.beginPath();x.ellipse(X0+s*mpGcH(cx,cy,76),Y0+s*mpGcH(cx,cy,77),s*.5,s*.28,mpGcH(cx,cy,78)*3,0,6.283);x.fill()}
    else if(h<.3){const g=x.createRadialGradient(X0+s*mpGcH(cx,cy,76),Y0+s*.8,0,X0+s*mpGcH(cx,cy,76),Y0+s*.8,s*.6);g.addColorStop(0,'rgba(58,122,90,.4)');g.addColorStop(1,'rgba(58,122,90,0)');x.fillStyle=g;x.fillRect(X0-2,Y0,s+4,s)}}
  x.strokeStyle='rgba(30,22,14,.42)';x.lineWidth=.3;x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(dd(cx,cy)!==1)continue;const X0=X(cx),Y0=Y(cy);for(let k=0;k<4;k++){const px=X0+(k+.5)*s/4+(mpGcH(cx,cy,80+k)-.5)*.8;x.moveTo(px,Y0+s*.96);x.lineTo(px+s*.3,Y0+s*.04)}}
  x.stroke();x.restore();

  /* ---- the floors ---- */
  const flp=new Path2D();for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)if(open(cx,cy))flp.rect(X(cx)-.2,Y(cy)-.2,s+.4,s+.4);
  x.fillStyle='#e3d7ad';x.fill(flp);
  const tone=h=>MPGC_FLOOR[Math.min(4,Math.floor(h*5))],rt=(r,h)=>r.pal[Math.min(r.pal.length-1,Math.floor(h*r.pal.length))];
  const GR='rgba(98,74,40,.55)';
  const jj=(a,b,sd)=>(mpGcH(Math.round(a*4),Math.round(b*4),sd)-.5)*.8,JP=(a,b)=>[a+jj(a,b,120),b+jj(a,b,121)];
  const flag=(a,b,w,h,fill)=>{const q=[JP(a,b),JP(a+w,b),JP(a+w,b+h),JP(a,b+h)];mpGcPoly(x,q,fill,GR,.42);x.strokeStyle='rgba(255,252,236,.45)';x.lineWidth=.35;x.beginPath();x.moveTo(q[3][0]+.4,q[3][1]-.6);x.lineTo(q[0][0]+.4,q[0][1]+.5);x.lineTo(q[1][0]-.4,q[1][1]+.5);x.stroke();x.strokeStyle='rgba(120,90,50,.16)';x.lineWidth=.35;x.beginPath();x.moveTo(q[1][0]-.3,q[1][1]+.6);x.lineTo(q[2][0]-.3,q[2][1]-.4);x.lineTo(q[3][0]+.5,q[3][1]-.4);x.stroke()};
  /* corridors and the gallery: bricks laid in half-cell courses */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!open(cx,cy)||roomAt(cx,cy))continue;const X0=X(cx),Y0=Y(cy),h=mpGcH(cx,cy,2),sw=(cx+cy)&1;
    flag(X0,Y0,s,s/2,tone(h));if(sw){flag(X0,Y0+s/2,s/2,s/2,tone(mpGcH(cx,cy,3)));flag(X0+s/2,Y0+s/2,s/2,s/2,tone(mpGcH(cx,cy,4)))}else flag(X0,Y0+s/2,s,s/2,tone(mpGcH(cx,cy,3)))}
  for(const r of ROOMS){const X0=X(r.x),Y0=Y(r.y),RW=r.w*s,RH=r.h*s;x.save();x.beginPath();x.rect(X0,Y0,RW,RH);x.clip();
    if(r.pat==='sq'){for(let j=0;j<r.h;j++)for(let i=0;i<r.w;i++)flag(X0+i*s,Y0+j*s,s,s,rt(r,mpGcH(r.x+i,r.y+j,2)))}
    else if(r.pat==='slab'){for(let j=0;j<r.h;j++){const off=(j%2)*s;for(let a=-off,i=0;a<RW;a+=2*s,i++)flag(X0+Math.max(a,0),Y0+j*s,Math.min(a+2*s,RW)-Math.max(a,0),s,rt(r,mpGcH(i,r.y+j,2)))}}
    else if(r.pat==='irr'){const Pp=[];for(let j=0;j<=r.h;j++){Pp[j]=[];for(let i=0;i<=r.w;i++){const inn=i>0&&i<r.w&&j>0&&j<r.h;Pp[j][i]=[X0+i*s+(inn?(mpGcH(i,j,90)-.5)*s*.55:0),Y0+j*s+(inn?(mpGcH(i,j,91)-.5)*s*.55:0)]}}
      for(let j=0;j<r.h;j++)for(let i=0;i<r.w;i++){const p=[Pp[j][i],Pp[j][i+1],Pp[j+1][i+1],Pp[j+1][i]];
        if(mpGcH(i,j,92)<.4){mpGcPoly(x,[p[0],p[1],p[2]],rt(r,mpGcH(i,j,93)),GR,.42);mpGcPoly(x,[p[0],p[2],p[3]],rt(r,mpGcH(i,j,94)),GR,.42)}else mpGcPoly(x,p,rt(r,mpGcH(i,j,95)),GR,.42);
        x.strokeStyle='rgba(255,252,236,.4)';x.lineWidth=.35;x.beginPath();x.moveTo(p[3][0]+.5,p[3][1]-.5);x.lineTo(p[0][0]+.5,p[0][1]+.5);x.lineTo(p[1][0]-.5,p[1][1]+.5);x.stroke()}}
    else if(r.pat==='dia'){for(let j=-1;j<=r.h*2+1;j++)for(let i=-1;i<=r.w+1;i++){const cx=X0+i*s+(j&1?s/2:0),cy=Y0+j*s/2;mpGcPoly(x,[[cx,cy-s/2],[cx+s/2,cy],[cx,cy+s/2],[cx-s/2,cy]],(j&1)?r.pal[1]:r.pal[0],GR,.42)}}
    else if(r.pat==='chk'){for(let j=0;j<r.h;j++)for(let i=0;i<r.w;i++){flag(X0+i*s,Y0+j*s,s,s,((i+j)&1)?r.pal[1]:r.pal[0]);x.strokeStyle='rgba(201,162,39,.45)';x.lineWidth=.3;x.strokeRect(X0+i*s+1.4,Y0+j*s+1.4,s-2.8,s-2.8)}}
    else if(r.pat==='big'){for(let j=0;j<r.h;j+=2)for(let i=0;i<r.w;i+=2){const w2=Math.min(2,r.w-i)*s,h2=Math.min(2,r.h-j)*s;flag(X0+i*s,Y0+j*s,w2,h2,rt(r,mpGcH(i,j,2)));x.strokeStyle='rgba(98,74,40,.35)';x.lineWidth=.3;x.strokeRect(X0+i*s+2,Y0+j*s+2,w2-4,h2-4);
      x.fillStyle=MPL.GOLD;for(const [px,py] of [[X0+i*s+1,Y0+j*s+1],[X0+i*s+w2-1,Y0+j*s+1],[X0+i*s+1,Y0+j*s+h2-1],[X0+i*s+w2-1,Y0+j*s+h2-1]]){x.beginPath();x.arc(px,py,.5,0,6.283);x.fill()}}}
    x.restore()}
  /* stone grain: fine pen speckle over every floor */
  x.fillStyle='rgba(110,84,48,.38)';for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!open(cx,cy))continue;for(let k=0;k<6;k++)x.fillRect(X(cx)+mpGcH(cx,cy,130+k)*s,Y(cy)+mpGcH(cx,cy,140+k)*s,.45,.45)}
  /* gallery: a gold chain of small lozenges down the middle of the long gallery */
  {const gy=Y(11)+s/2;x.save();x.strokeStyle='rgba(42,26,12,.35)';x.lineWidth=.8;x.beginPath();x.moveTo(X(10)+3,gy);x.lineTo(X(31)-3,gy);x.stroke();x.strokeStyle=MPL.GOLD;x.lineWidth=.5;x.stroke();
    for(let a=X(10)+5;a<X(31)-3;a+=8)mpGcPoly(x,[[a,gy-1.5],[a+1.5,gy],[a,gy+1.5],[a-1.5,gy]],MPL.GOLD,'rgba(42,26,12,.6)',.25);x.restore()}
  /* lapis and gold inlay in every hall */
  for(const r of ROOMS){mpGcBand(x,X(r.x),Y(r.y),r.w*s,r.h*s);mpGcMedal(x,X(r.mc[0]),Y(r.mc[1]),r.mr,r.med);mpGcGlint(x,X(r.mc[0])-r.mr*.66,Y(r.mc[1])-r.mr*.7,Math.max(1.6,r.mr*.2));mpGcGlint(x,X(r.x)+3.1,Y(r.y)+3.1,1.5)}

  /* a lapis mat with gold fringe at the foot of the stair, where the party arrives (it keeps the yellow arrow easy to see) */
  {const a=X(17.5),b0=Y(22.85),b1=Y(24),w=5.2;x.save();x.fillStyle='rgba(39,74,154,.5)';x.fillRect(a-w,b0,w*2,b1-b0);x.strokeStyle=MPL.GOLD;x.lineWidth=.7;x.strokeRect(a-w,b0,w*2,b1-b0);x.strokeStyle='rgba(42,26,12,.5)';x.lineWidth=.25;x.strokeRect(a-w-.6,b0-.6,w*2+1.2,b1-b0+1.2);
    x.strokeStyle='rgba(240,216,120,.7)';x.lineWidth=.3;for(let k=0;k<3;k++){x.beginPath();x.moveTo(a-w+1,b0+1.2+k*2.6);x.lineTo(a+w-1,b0+1.2+k*2.6);x.stroke()}x.restore()}
  /* ---- age: worn patches, moss, cracks, broken slabs ---- */
  x.save();x.clip(flp);
  for(let i=0;i<60;i++){const cx=Math.floor(mpGcH(i,100)*W),cy=Math.floor(mpGcH(i,101)*H);if(!open(cx,cy))continue;const a=X(cx+mpGcH(i,102)),b=Y(cy+mpGcH(i,103)),r=4+mpGcH(i,104)*9;x.fillStyle=i%3?'rgba(120,88,46,.11)':'rgba(255,250,226,.16)';x.beginPath();x.ellipse(a,b,r*1.3,r*.8,mpGcH(i,105)*3,0,6.283);x.fill()}
  for(let i=0;i<34;i++){const cx=Math.floor(mpGcH(i,110)*W),cy=Math.floor(mpGcH(i,111)*H);if(!open(cx,cy))continue;const a=X(cx+mpGcH(i,112)),b=Y(cy+mpGcH(i,113)),g=x.createRadialGradient(a,b,0,a,b,5+mpGcH(i,114)*5);g.addColorStop(0,'rgba(58,122,90,.34)');g.addColorStop(1,'rgba(58,122,90,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,10,0,6.283);x.fill()}
  for(let i=0;i<44;i++){let cx=Math.floor(mpGcH(i,120)*W),cy=Math.floor(mpGcH(i,121)*H);if(!open(cx,cy))continue;let a=X(cx+mpGcH(i,122)),b=Y(cy+mpGcH(i,123)),an=mpGcH(i,124)*6.283;x.strokeStyle='rgba(70,50,28,.6)';x.lineWidth=.38;x.beginPath();x.moveTo(a,b);
    const n=4+Math.floor(mpGcH(i,125)*5);for(let k=0;k<n;k++){an+=(mpGcH(i,126+k)-.5)*1.3;a+=Math.cos(an)*(1.6+mpGcH(i,140+k)*2.2);b+=Math.sin(an)*(1.6+mpGcH(i,150+k)*2.2);if(!open(Math.floor((a-PX)/s),Math.floor((b-PY)/s)))break;x.lineTo(a,b);
      if(k===2&&mpGcH(i,160)<.5){const ba=a,bb=b;x.moveTo(a,b);x.lineTo(a+Math.cos(an+1)*3,b+Math.sin(an+1)*3);x.moveTo(ba,bb)}}x.stroke()}
  for(let i=0;i<16;i++){const cx=Math.floor(mpGcH(i,170)*W),cy=Math.floor(mpGcH(i,171)*H);if(!open(cx,cy)||(cx===17&&cy>=23))continue;const a=X(cx+.2+.6*mpGcH(i,172)),b=Y(cy+.2+.6*mpGcH(i,173));mpGcBlob(x,a,b,1.8+mpGcH(i,174)*1.4,6,i*7+1,'rgba(34,24,16,.6)','rgba(20,12,6,.8)',.4)}
  x.restore();
  /* shadow cast on the floor by every wall, from a light in the north west */
  x.save();x.clip(flp);
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!open(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    if(!open(cx,cy-1)){x.fillStyle='rgba(46,34,70,.3)';x.fillRect(X0,Y0,s,2);x.fillStyle='rgba(46,34,70,.15)';x.fillRect(X0,Y0+2,s,1.6)}
    if(!open(cx-1,cy)){x.fillStyle='rgba(46,34,70,.24)';x.fillRect(X0,Y0,1.8,s);x.fillStyle='rgba(46,34,70,.12)';x.fillRect(X0+1.8,Y0,1.4,s)}
    if(!open(cx+1,cy)){x.fillStyle='rgba(46,34,70,.1)';x.fillRect(X0+s-1.2,Y0,1.2,s)}if(!open(cx,cy+1)){x.fillStyle='rgba(46,34,70,.1)';x.fillRect(X0,Y0+s-1.2,s,1.2)}}
  x.restore();
  /* wall torches where the game really puts them, and the pools of warm light they throw on the floor */
  const torches=[];
    const real=[];
  if(typeof LIGHTS!=='undefined'&&typeof LEVEL!=='undefined'&&LEVEL===31&&LIGHTS.length){for(const l of LIGHTS){let a=l.x,b=l.y;const fx=a-Math.floor(a),fy=b-Math.floor(b);let nx=0,ny=0,ic,jc;if(Math.abs(fx-.5)>Math.abs(fy-.5)){a=Math.round(a);nx=fx<.5?1:-1;ic=nx>0?a:a-1;jc=Math.floor(l.y)}else{b=Math.round(b);ny=fy<.5?1:-1;jc=ny>0?b:b-1;ic=Math.floor(l.x)}
    if(open(ic,jc)&&!open(ic-nx,jc-ny))real.push({a:X(a),b:Y(b),nx,ny})}}
  if(real.length>=20)for(const t of real)torches.push(t);
  else{for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)if(open(cx,cy)&&!open(cx,cy-1)&&(cx*3+cy*5)%9===0&&open(cx+1,cy)&&open(cx-1,cy))torches.push({a:X(cx+.5),b:Y(cy),nx:0,ny:1})}
  x.save();x.clip(flp);for(const t of torches){const a=t.a+t.nx*s*.5,b=t.b+t.ny*s*.5,r=s*2.8,g=x.createRadialGradient(a,b,0,a,b,r);g.addColorStop(0,'rgba(255,176,60,.34)');g.addColorStop(.5,'rgba(255,190,90,.12)');g.addColorStop(1,'rgba(255,196,96,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,r,0,6.283);x.fill()}x.restore();

  /* ---- ink: a heavy wobbling line round every floor with a pale cap on the wall side ---- */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!open(cx,cy))continue;const X0=X(cx),Y0=Y(cy),sd=cx*97+cy;
    if(!open(cx,cy-1)){mpGravesLine(x,X0,Y0,X0+s,Y0,1.4,MPL.INK,sd+1);mpGravesLine(x,X0,Y0-1.1,X0+s,Y0-1.1,.45,'rgba(255,250,232,.55)',sd+5)}
    if(!open(cx,cy+1)){mpGravesLine(x,X0,Y0+s,X0+s,Y0+s,1.4,MPL.INK,sd+2);mpGravesLine(x,X0,Y0+s+1.1,X0+s,Y0+s+1.1,.45,'rgba(255,250,232,.4)',sd+6)}
    if(!open(cx-1,cy)){mpGravesLine(x,X0,Y0,X0,Y0+s,1.4,MPL.INK,sd+3);mpGravesLine(x,X0-1.1,Y0,X0-1.1,Y0+s,.45,'rgba(255,250,232,.55)',sd+7)}
    if(!open(cx+1,cy)){mpGravesLine(x,X0+s,Y0,X0+s,Y0+s,1.4,MPL.INK,sd+4);mpGravesLine(x,X0+s+1.1,Y0,X0+s+1.1,Y0+s,.45,'rgba(255,250,232,.4)',sd+8)}}
  /* doorways: a stone sill and two jamb blocks wherever a passage meets a hall */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!open(cx,cy))continue;const r0=roomAt(cx,cy);
    for(const [dx,dy] of [[1,0],[0,1]]){const nx=cx+dx,ny=cy+dy;if(!open(nx,ny))continue;const r1=roomAt(nx,ny);if(r0===r1)continue;
      const a=X(cx+dx),b=Y(cy+dy);x.save();x.strokeStyle='rgba(42,26,12,.8)';x.fillStyle='#c4bca8';x.lineWidth=.5;
      if(dx){x.fillRect(a-1,b,2,s);x.strokeRect(a-1,b,2,s);x.fillStyle='#8c8472';x.fillRect(a-1.4,b-.8,2.8,1.8);x.strokeRect(a-1.4,b-.8,2.8,1.8);x.fillRect(a-1.4,b+s-1,2.8,1.8);x.strokeRect(a-1.4,b+s-1,2.8,1.8)}
      else{x.fillRect(a,b-1,s,2);x.strokeRect(a,b-1,s,2);x.fillStyle='#8c8472';x.fillRect(a-.8,b-1.4,1.8,2.8);x.strokeRect(a-.8,b-1.4,1.8,2.8);x.fillRect(a+s-1,b-1.4,1.8,2.8);x.strokeRect(a+s-1,b-1.4,1.8,2.8)}x.restore()}}

  /* ---- where the names go: the first spot that keeps clear of the furniture and the medallion ---- */
  const obst=[];
  for(const d of D){const a=X(d.x+.5),b=Y(d.y+.55);
    if(d.k==='coffin')obst.push([a-4.5,b-6,a+8,b+9]);else if(d.k==='chest')obst.push([a-4.5,b-3.5,a+4.5,b+3.5]);else if(d.k==='statue')obst.push([a-4.5,Y(d.y+.92)-12,a+4.5,Y(d.y+.92)+2]);
    else if(d.k==='barrel'||d.k==='teleporter'||d.k==='lever')obst.push([a-4.5,b-4.5,a+4.5,b+4.5]);else if(d.k==='bones')obst.push([a-5,b-5,a+5,b+4])}
  for(const r of ROOMS)obst.push([X(r.mc[0])-r.mr,Y(r.mc[1])-r.mr,X(r.mc[0])+r.mr,Y(r.mc[1])+r.mr]);
  x.save();x.font=`bold 6.6px ${FUI}`;const wid={};for(const r of ROOMS)wid[r.n]=x.measureText(r.n).width;x.restore();
  const NAMES=[];
  for(const r of ROOMS){const w=wid[r.n];let pick=r.tc[0];for(const t of r.tc){const a=X(t[0]),b=Y(t[1]),q=[a-w/2-5,b-4.8,a+w/2+5,b+4.8];if(!obst.some(o=>q[0]<o[2]&&q[2]>o[0]&&q[1]<o[3]&&q[3]>o[1])){pick=t;break}}
    NAMES.push({t:r.n,a:X(pick[0]),b:Y(pick[1]),w,cart:true,col:MPL.VERM})}
  NAMES.push({t:'Long Gallery',a:X(20.5),b:Y(11.5),w:44,cart:false,col:MPL.VERM},{t:'Stair up to the Burial Ground',a:X(17.5),b:Y(26.95),w:100,cart:false,col:MPL.LAPIS});
  const nameHit=(a,b)=>{for(const n of NAMES)if(Math.abs(a-n.a)<n.w/2+5&&Math.abs(b-n.b)<6)return true;return false};

  /* ---- scattered bones and rubble on the floors, kept off the names and furniture ---- */
  const occ=new Set();for(const d of D)occ.add(d.x+','+d.y);
  let nsc=0;for(let i=0;i<500&&nsc<46;i++){const cx=Math.floor(mpGcH(i,70)*W),cy=Math.floor(mpGcH(i,71)*H);if(!open(cx,cy)||occ.has(cx+','+cy)||(cx===17&&cy>=22))continue;const a=X(cx+.15+.7*mpGcH(i,72)),b=Y(cy+.15+.7*mpGcH(i,73));if(nameHit(a,b)||obst.some(o=>a>o[0]-1&&a<o[2]+1&&b>o[1]-1&&b<o[3]+1))continue;nsc++;const t=mpGcH(i,74);
    if(t<.34)mpGcBone(x,a,b,2.6+mpGcH(i,75)*1.4,mpGcH(i,76)*3.14,.5);else if(t<.52)mpGcSkull(x,a,b,.5);else if(t<.78)mpGcBlob(x,a,b,.9+mpGcH(i,77)*.9,5,i,'#aaa38f','rgba(30,22,14,.7)',.3);else{mpGcBone(x,a,b,2.8,.6,.45);mpGcBone(x,a+.4,b+.5,2.4,-.5,.45)}}
  /* cobwebs in the corners of the halls (under the furniture, so nothing is hidden) */
  for(const r of ROOMS){const X0=X(r.x),Y0=Y(r.y),X1=X0+r.w*s,Y1=Y0+r.h*s;let i=0;for(const [a,b,dx,dy] of [[X0,Y0,1,1],[X1,Y0,-1,1],[X0,Y1,1,-1],[X1,Y1,-1,-1]]){i++;if(mpGcH(r.x,r.y+i,180)<.72)mpGcWeb(x,a,b,dx,dy,8+mpGcH(r.x,r.y+i,181)*6)}}

  /* ---- furniture and fittings, from the real decor ---- */
  for(const d of D){const a=X(d.x+.5),b=Y(d.y+.55);if(d.k==='bones')mpGcBonePile(x,a,b,.9);else if(d.k==='barrel')mpGcBarrel(x,a,b+.3,1)}
  const things=D.filter(d=>d.k==='coffin'||d.k==='chest'||d.k==='statue').sort((p,q)=>p.y-q.y);
  for(const d of things){const a=X(d.x+.5),b=Y(d.y+.55);
    if(d.k==='coffin')mpGcCoffin(x,a,b,6.4,10,(roomAt(d.x,d.y)||{}).n==='Skeleton Room'||(d.x===4&&d.y===15));
    else if(d.k==='chest')mpGcChest(x,a,b,1);else mpGcStatue(x,a,Y(d.y+.92),1)}
  for(const d of D){if(d.k==='teleporter')mpGcTele(x,X(d.x+.5),Y(d.y+.5),s*.55)}
  for(const d of D){if(d.k!=='lever')continue;const wd=d.wd||[0,1];mpGcLever(x,X(d.x+.5+wd[0]*.43),Y(d.y+.5+wd[1]*.43))}
  /* the gold door between the Statue Hall and the Hall of Coffins, and the stair up at the south end */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)if(ch(cx,cy)==='L')mpGcDoor(x,X(cx+.5),Y(cy+.5),s*.95,s*1.05);
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)if(ch(cx,cy)==='0'){const a=X(cx+.5),b=Y(cy+1);
    x.save();const g=x.createRadialGradient(a,b+1,0,a,b+1,s*.9);g.addColorStop(0,'rgba(255,246,200,.95)');g.addColorStop(1,'rgba(255,230,150,0)');x.fillStyle=g;x.fillRect(a-s,b,s*2,s);
    x.fillStyle='#fff3c8';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.moveTo(a-s*.42,b+.2);x.lineTo(a-s*.42,b+s*.25);x.quadraticCurveTo(a,b+s*.95,a+s*.42,b+s*.25);x.lineTo(a+s*.42,b+.2);x.closePath();x.fill();x.stroke();
    x.strokeStyle=MPL.GOLD;x.lineWidth=.6;x.beginPath();x.moveTo(a-s*.5,b+.3);x.lineTo(a-s*.5,b+s*.3);x.quadraticCurveTo(a,b+s*1.1,a+s*.5,b+s*.3);x.lineTo(a+s*.5,b+.3);x.stroke();x.restore();
    mpGcStair(x,X(cx)+.5,Y(cy)+.3,s-1,s-.6)}
  /* the wall torches */
  for(const t of torches)mpGcTorch(x,t.a-t.nx*2.1,t.b-t.ny*2.1+(t.ny?0:.3),.95,true);
  /* the tint of the whole plan: darker towards the edges, as an old plate */
  {const g=x.createRadialGradient(PX+PW/2,PY+PH/2,PH*.35,PX+PW/2,PY+PH/2,PW*.62);g.addColorStop(0,'rgba(30,16,40,0)');g.addColorStop(1,'rgba(30,16,40,.2)');x.fillStyle=g;x.fillRect(PX,PY,PW,PH)}
  x.restore();

  /* ---- the frame round the plan: ink and gold rules with rosettes at the corners ---- */
  x.save();x.strokeStyle=MPL.INK;x.lineWidth=1;x.strokeRect(PX,PY,PW,PH);x.strokeStyle=MPL.GOLD;x.lineWidth=1.5;x.strokeRect(PX-2.2,PY-2.2,PW+4.4,PH+4.4);x.strokeStyle=MPL.INK;x.lineWidth=.5;x.strokeRect(PX-3.4,PY-3.4,PW+6.8,PH+6.8);x.strokeRect(PX-1,PY-1,PW+2,PH+2);
  for(const [a,b] of [[PX-2.2,PY-2.2],[PX+PW+2.2,PY-2.2],[PX-2.2,PY+PH+2.2],[PX+PW+2.2,PY+PH+2.2]]){x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.arc(a,b,3.6,0,6.283);x.fill();x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.arc(a,b,2.1,0,6.283);x.fill();x.fillStyle=MPL.LAPIS;x.beginPath();x.arc(a,b,.9,0,6.283);x.fill()}
  for(const [a,b] of [[PX+PW/2,PY-2.2],[PX+PW/2,PY+PH+2.2],[PX-2.2,PY+PH/2],[PX+PW+2.2,PY+PH/2]]){mpGcPoly(x,[[a,b-3],[a+3,b],[a,b+3],[a-3,b]],MPL.GOLD,MPL.INK,.5);x.fillStyle=MPL.LAPIS;x.beginPath();x.arc(a,b,1,0,6.283);x.fill()}x.restore();

  /* ---- the names ---- */
  for(const n of NAMES){const a=n.a,b=n.b,sz=n.cart?6.6:5.8;
    if(!n.cart){api.text(x,n.t,a,b,sz,n.col,'center');continue}
    x.save();x.fillStyle='rgba(240,230,198,.86)';x.strokeStyle=MPL.GOLD;x.lineWidth=.8;const hw=n.w/2+3.4,hh=4.2;x.beginPath();x.moveTo(a-hw,b);x.quadraticCurveTo(a-hw+1.6,b-hh,a-hw+4,b-hh);x.lineTo(a+hw-4,b-hh);x.quadraticCurveTo(a+hw-1.6,b-hh,a+hw,b);x.quadraticCurveTo(a+hw-1.6,b+hh,a+hw-4,b+hh);x.lineTo(a-hw+4,b+hh);x.quadraticCurveTo(a-hw+1.6,b+hh,a-hw,b);x.closePath();x.fill();x.stroke();
    x.strokeStyle='rgba(42,26,12,.45)';x.lineWidth=.3;x.stroke();for(const sx of [-1,1]){x.fillStyle=MPL.VERM;x.beginPath();x.arc(a+sx*(hw+1.2),b,1,0,6.283);x.fill();x.strokeStyle=MPL.INK;x.lineWidth=.3;x.stroke()}x.restore();
    api.text(x,n.t,a,b+.2,sz,n.col,'center')}

  /* ---- margins: title, compass, key, and a few memento flourishes on the border of the plate ---- */
  mpGravesMargin(x,api,'Golden Crypt','Under the Burial Ground, level 30',[],
    [{t:'Sarcophagus',icon:(a,b)=>mpGcCoffin(x,a,b,4.6,7.4,false)},
     {t:'Chest',icon:(a,b)=>mpGcChest(x,a,b,.85)},
     {t:'Barrel',icon:(a,b)=>mpGcBarrel(x,a,b,.85)},
     {t:'Statue',icon:(a,b)=>mpGcStatue(x,a,b+3.4,.58)},
     {t:'Lever',icon:(a,b)=>mpGcLever(x,a,b)},
     {t:'Gold door',icon:(a,b)=>mpGcDoor(x,a,b,5.4,7)},
     {t:'Torch',icon:(a,b)=>mpGcTorch(x,a,b+1,.95,false)},
     {t:'Stair up',icon:(a,b)=>mpGcStair(x,a-3,b-3.6,6,7.2)},
     {t:'Teleport stone',icon:(a,b)=>mpGcTele(x,a,b,3.6)},
     {t:'Bones',icon:(a,b)=>mpGcBonePile(x,a,b+.6,.7)}]);
  mpGcCandle(x,PX+48,PY-4.4,.56);mpGcCandle(x,PX+PW-48,PY-4.4,.56);
  mpGcMemento(x,PX+34,PY+PH+16,.82);mpGcMemento(x,PX+PW-34,PY+PH+16,.82);mpGcGlass(x,432,196,.85);
}
if(typeof mplInstall==='function')mplInstall({name:'goldencrypt',levels:[31],draw:mpGcDraw,foot:'You are the yellow arrow. Press M to close the map.'});
