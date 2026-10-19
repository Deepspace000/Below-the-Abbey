/* ==========================================================================
   AREA MAP for the White Dunes (level 63): glaring pale dunes of salt and chalk, rock needles, bleached bones, three pools, rings of old pillars, five little
   dungeon doors and two caves. Drawn from the real level data. See maps_common.js.
   ========================================================================== */
const MPWD_INK='#2a1a0c',MPWD_LINE='rgba(84,92,120,.6)';
function mpWhiteDunesNoise(x,y,s){const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),h=(i,j)=>hash2(i,j,s);
  return (h(x0,y0)*(1-u)+h(x0+1,y0)*u)*(1-v)+(h(x0,y0+1)*(1-u)+h(x0+1,y0+1)*u)*v}
/* a wobbling closed blob */
function mpWhiteDunesBlob(x,a,b,rx,ry,seed,n){n=n||16;x.beginPath();for(let k=0;k<=n;k++){const t=k/n*Math.PI*2,w=.82+.36*hash2(k%n,seed,77);const px=a+Math.cos(t)*rx*w,py=b+Math.sin(t)*ry*w;k?x.lineTo(px,py):x.moveTo(px,py)}x.closePath()}
/* a needle of rock: tall, thin, one side lit and one in shade, with a long thin shadow on the sand */
function mpWhiteDunesNeedle(x,a,b,h,w,flip){x.save();const d=flip?-1:1;
  x.fillStyle='rgba(110,118,150,.28)';x.beginPath();x.moveTo(a,b);x.lineTo(a+d*h*.55,b+h*.12);x.lineTo(a+d*h*.45,b+h*.26);x.lineTo(a+w,b+.5);x.closePath();x.fill();
  x.strokeStyle='rgba(58,52,66,.8)';x.lineWidth=.38;
  x.fillStyle='#f8f5ea';x.beginPath();x.moveTo(a-w,b);x.lineTo(a-w*.7,b-h*.55);x.lineTo(a+d*.1,b-h);x.lineTo(a,b);x.closePath();x.fill();x.stroke();
  x.fillStyle='#c8c6c4';x.beginPath();x.moveTo(a,b);x.lineTo(a+d*.1,b-h);x.lineTo(a+w*.8,b-h*.5);x.lineTo(a+w,b);x.closePath();x.fill();x.stroke();
  x.strokeStyle='rgba(60,56,60,.5)';x.lineWidth=.3;x.beginPath();x.moveTo(a-w*.3,b-h*.2);x.lineTo(a-w*.2,b-h*.6);x.moveTo(a+w*.4,b-h*.15);x.lineTo(a+w*.4,b-h*.45);x.stroke();x.restore()}
/* a bleached bone: a short shaft with a knob at each end */
function mpWhiteDunesBone(x,a,b,s,an){x.save();x.translate(a,b);x.rotate(an);x.strokeStyle='#8c8a82';x.lineWidth=.5;x.fillStyle='#fbf8ee';x.beginPath();x.moveTo(-2*s,0);x.lineTo(2*s,0);x.stroke();
  for(const e of [-1,1])for(const o of [-.55,.55]){x.beginPath();x.arc(e*2.1*s,o*s,.7*s,0,6.3);x.fill();x.stroke()}x.restore()}
function mpWhiteDunesRibs(x,a,b,s){x.save();x.strokeStyle='#7e7c74';x.lineWidth=.4;x.beginPath();x.moveTo(a-3*s,b);x.lineTo(a+3*s,b);x.stroke();x.strokeStyle='#e9e5d6';x.lineWidth=.9*s;for(let k=-2;k<=2;k++){x.beginPath();x.moveTo(a+k*1.1*s,b);x.quadraticCurveTo(a+k*1.1*s+.8*s,b-2.6*s,a+k*1.1*s+.2*s,b-3*s);x.stroke()}
  x.strokeStyle='#7e7c74';x.lineWidth=.3;for(let k=-2;k<=2;k++){x.beginPath();x.moveTo(a+k*1.1*s,b);x.quadraticCurveTo(a+k*1.1*s+.8*s,b-2.6*s,a+k*1.1*s+.2*s,b-3*s);x.stroke()}x.restore()}
function mpWhiteDunesDead(x,a,b,s){x.save();x.strokeStyle='#6a5a46';x.lineWidth=.6;x.lineCap='round';x.beginPath();x.moveTo(a,b+1);x.lineTo(a+.2*s,b-3*s);x.moveTo(a+.1*s,b-1.2*s);x.lineTo(a-2*s,b-2.6*s);x.moveTo(a+.15*s,b-2*s);x.lineTo(a+1.8*s,b-3.6*s);x.stroke();x.restore()}
function mpWhiteDunesTuft(x,a,b){x.save();x.strokeStyle='rgba(120,130,96,.85)';x.lineWidth=.4;x.beginPath();x.moveTo(a-1,b);x.lineTo(a-.5,b-1.6);x.moveTo(a,b);x.lineTo(a,b-2);x.moveTo(a+1,b);x.lineTo(a+.6,b-1.5);x.stroke();x.restore()}
function mpWhiteDunesPalm(x,a,b,s){s=s||1;x.save();x.strokeStyle='#6a5a46';x.lineWidth=.9*s;x.beginPath();x.moveTo(a,b+1.5*s);x.quadraticCurveTo(a+1*s,b-2*s,a+.4*s,b-4.6*s);x.stroke();
  x.strokeStyle=MPWD_INK;x.fillStyle='#4a9a58';x.lineWidth=.4;const tx=a+.4*s,ty=b-4.6*s;
  for(let k=0;k<6;k++){const an=-Math.PI/2+(k-2.5)*.62,dx=Math.cos(an),dy=Math.sin(an);x.beginPath();x.moveTo(tx,ty);x.quadraticCurveTo(tx+dx*2.6*s,ty+dy*2.6*s-.6*s,tx+dx*4*s,ty+dy*3*s+1.6*s);x.quadraticCurveTo(tx+dx*2.4*s,ty+dy*2*s+.4*s,tx,ty);x.fill();x.stroke()}x.restore()}
/* a big soft white dune with a blue shadow side, for the key and the odd flourish */
function mpWhiteDunesDune(x,a,b,w){x.save();x.fillStyle='#fbf9f0';x.strokeStyle=MPWD_LINE;x.lineWidth=.5;x.beginPath();x.moveTo(a-w,b+w*.3);x.quadraticCurveTo(a-w*.4,b-w*.55,a+w*.1,b-w*.5);x.quadraticCurveTo(a+w*.6,b-w*.2,a+w,b+w*.3);x.quadraticCurveTo(a,b+w*.5,a-w,b+w*.3);x.closePath();x.fill();x.stroke();
  x.fillStyle='rgba(140,156,196,.5)';x.beginPath();x.moveTo(a+w*.1,b-w*.5);x.quadraticCurveTo(a+w*.6,b-w*.2,a+w,b+w*.3);x.quadraticCurveTo(a+w*.4,b+w*.4,a+w*.15,b+w*.28);x.quadraticCurveTo(a+w*.25,b-w*.1,a+w*.1,b-w*.5);x.fill();x.restore()}
function mpWhiteDunesVulture(x,a,b,s,an){x.save();x.translate(a,b);x.rotate(an||0);x.strokeStyle=MPWD_INK;x.lineWidth=.8;x.lineCap='round';x.beginPath();x.moveTo(-5*s,-1*s);x.quadraticCurveTo(-2.5*s,-3.4*s,0,0);x.quadraticCurveTo(2.5*s,-3.4*s,5*s,-1*s);x.stroke();x.fillStyle=MPWD_INK;x.beginPath();x.arc(0,.2*s,.9*s,0,6.3);x.fill();x.restore()}
function mpWhiteDunesCave(x,a,b,dir,s){ // a dark low arch set in the rim. dir: 0 = in the bottom edge, 3 = in the left edge
  x.save();x.translate(a,b);x.rotate(dir===3?Math.PI/2:0);x.fillStyle='#10131c';x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.moveTo(-3.6*s,2.6*s);x.lineTo(-3.6*s,-.6*s);x.quadraticCurveTo(0,-5.4*s,3.6*s,-.6*s);x.lineTo(3.6*s,2.6*s);x.closePath();x.fill();x.stroke();x.restore()}
function mpWhiteDunesMarkRuin(x,a,b){x.save();x.strokeStyle='rgba(84,80,70,.55)';x.lineWidth=.4;x.setLineDash([1,1.4]);x.beginPath();x.ellipse(a,b,5.4,4.6,0,0,6.3);x.stroke();x.restore()}
/* the five little dungeon doors, each a tiny picture of its own way in */
function mpWhiteDunesDoor(x,a,b,k){x.save();x.strokeStyle=MPWD_INK;x.lineWidth=.6;
  if(k==='dtreehole'){x.fillStyle='#6a5a46';x.fillRect(a-.8,b-1,1.6,3.4);x.fillStyle='#6f8a58';for(const [dx,dy,r] of [[0,-3.4,2.6],[-1.8,-2,1.8],[1.8,-2,1.8]]){x.beginPath();x.arc(a+dx,b+dy,r,0,6.3);x.fill();x.stroke()}x.fillStyle=MPWD_INK;x.beginPath();x.ellipse(a,b+.8,.7,1,0,0,6.3);x.fill()}
  else if(k==='dspire'){x.fillStyle='#f0ecdc';x.beginPath();x.moveTo(a-2,b+2);x.lineTo(a-1.2,b-5);x.lineTo(a,b-8);x.lineTo(a+1.2,b-5);x.lineTo(a+2,b+2);x.closePath();x.fill();x.stroke();x.fillStyle=MPWD_INK;x.fillRect(a-.5,b-.6,1,2.6)}
  else if(k==='dhatch'){x.fillStyle='#8a8478';x.fillRect(a-2.6,b-1.6,5.2,3.2);x.strokeRect(a-2.6,b-1.6,5.2,3.2);x.beginPath();x.moveTo(a-2.6,b);x.lineTo(a+2.6,b);x.stroke();x.fillStyle=MPL.GOLD;x.fillRect(a-.5,b-.4,1,.8)}
  else if(k==='dcryptS'){x.fillStyle='#e6e0cc';x.fillRect(a-3.4,b-2,6.8,4);x.strokeRect(a-3.4,b-2,6.8,4);x.fillStyle='#a8a290';x.beginPath();x.moveTo(a-4.2,b-2);x.lineTo(a,b-5.4);x.lineTo(a+4.2,b-2);x.closePath();x.fill();x.stroke();x.fillStyle=MPWD_INK;x.beginPath();x.moveTo(a-1,b+2);x.lineTo(a-1,b-.4);x.quadraticCurveTo(a,b-1.8,a+1,b-.4);x.lineTo(a+1,b+2);x.fill()}
  else{x.fillStyle='#d8d2bc';for(let i=0;i<3;i++){x.fillRect(a-3.2+i*.6,b-2.4+i*1.6,6.4-i*1.2,1.5);x.strokeRect(a-3.2+i*.6,b-2.4+i*1.6,6.4-i*1.2,1.5)}x.fillStyle='#e8e2cc';x.fillRect(a-4.2,b-5,1.4,3);x.strokeRect(a-4.2,b-5,1.4,3);x.fillRect(a+2.8,b-4,1.4,2);x.strokeRect(a+2.8,b-4,1.4,2)}
  x.restore()}

function mpWhiteDunesMap(x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=api.fit(W,H,4),S=f.s,X=f.X,Y=f.Y,R=hash2,A=MPL.AREA;
  const oases=WER.OASES,poolNames=['Pale Pool','Mirror Pool','Reed Pool'];
  const nearO=(cx,cy,r)=>oases.some(([ox,oy])=>Math.hypot(cx-ox,(cy-oy)*1.1)<r);
  const nearEdge=(cx,cy,m)=>cx<m||cy<m||cx>W-m||cy>H-m;
  const nearRuin=[];for(const d of L.decor)if(d.k==='chest'||d.k==='treasure')nearRuin.push([d.x,d.y]);
  const nearR=(cx,cy,r)=>nearRuin.some(([a,b])=>Math.hypot(cx-a,cy-b)<r);
  // ---------- far, untrodden sand on the parchment outside the land: a few faint ripples ----------
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();x.strokeStyle='rgba(120,130,160,.28)';x.lineWidth=.5;
  for(let i=0;i<260;i++){const a=A.x+R(i,1,1001)*A.w,b=A.y+R(i,2,1001)*A.h;if(a>X(-1)&&a<X(W+1)&&b>Y(-1)&&b<Y(H+1))continue;const w=2+R(i,3,1001)*4;x.beginPath();x.moveTo(a-w,b);x.quadraticCurveTo(a-w/2,b-1.4,a,b);x.quadraticCurveTo(a+w/2,b+1.4,a+w,b);x.stroke()}x.restore();
  // ---------- the glaring ground: a pale wash with soft cool and warm patches ----------
  x.save();const g=x.createLinearGradient(0,Y(0),0,Y(H));g.addColorStop(0,'#f1f2f0');g.addColorStop(.55,'#f6f4ea');g.addColorStop(1,'#ece9dc');x.fillStyle=g;mpWhiteDunesRim(x,f,W,H,R,true);x.fill();
  x.save();mpWhiteDunesRim(x,f,W,H,R,true);x.clip();
  for(let gy=0;gy<14;gy++)for(let gx=0;gx<14;gx++){const n=mpWhiteDunesNoise(gx*.55,gy*.55,1002),a=X((gx+.5)*W/14),b=Y((gy+.5)*H/14),r=S*W/14*1.1;
    const gr=x.createRadialGradient(a,b,0,a,b,r);const cool=n>.5;gr.addColorStop(0,cool?`rgba(150,170,214,${(.1+(n-.5)*.34).toFixed(3)})`:`rgba(236,216,168,${(.1+(.5-n)*.4).toFixed(3)})`);gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(a-r,b-r,r*2,r*2)}
  // ---------- salt pans: brighter flats with cracked crusts ----------
  const pans=[];for(let i=0;i<60&&pans.length<9;i++){const cx=24+R(i,1,1003)*(W-48),cy=24+R(i,2,1003)*(H-48);if(nearO(cx,cy,26)||nearR(cx,cy,14)||Math.hypot(cx-L.start.x,cy-L.start.y)<26||pans.some(p=>Math.hypot(p[0]-cx,p[1]-cy)<38))continue;pans.push([cx,cy,10+R(i,3,1003)*9,6+R(i,4,1003)*5])}
  pans.forEach(([cx,cy,rx,ry],i)=>{const a=X(cx),b=Y(cy);x.save();
    x.fillStyle='rgba(120,134,178,.16)';mpWhiteDunesBlob(x,a+.8,b+.9,rx*S,ry*S,i*3+1);x.fill();
    x.fillStyle='#fefefb';mpWhiteDunesBlob(x,a,b,rx*S,ry*S,i*3+1);x.fill();x.strokeStyle='rgba(88,100,140,.5)';x.lineWidth=.5;x.stroke();
    x.save();mpWhiteDunesBlob(x,a,b,rx*S,ry*S,i*3+1);x.clip();x.strokeStyle='rgba(98,110,150,.38)';x.lineWidth=.35;
    for(let k=0;k<26;k++){const px=a+(R(k,i,1004)-.5)*rx*S*2,py=b+(R(k,i,1005)-.5)*ry*S*2,an=R(k,i,1006)*6.28,l=1.4+R(k,i,1007)*3;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(an)*l,py+Math.sin(an)*l);x.lineTo(px+Math.cos(an+1.9)*l*.8,py+Math.sin(an+1.9)*l*.8);x.stroke()}x.restore();
    x.fillStyle='rgba(120,150,210,.55)';for(let k=0;k<5;k++){const px=a+(R(k,i,1008)-.5)*rx*S*1.4,py=b+(R(k,i,1009)-.5)*ry*S*1.4;x.strokeStyle='rgba(120,150,214,.8)';x.lineWidth=.3;x.beginPath();x.moveTo(px-1,py);x.lineTo(px+1,py);x.moveTo(px,py-1);x.lineTo(px,py+1);x.stroke()}
    x.restore()});
  // ---------- the dune crests: long wandering ridges, a pale windward back and a blue-shaded lee side with hatching ----------
  x.lineCap='round';x.lineJoin='round';
  const nC=34,gap=H/nC;
  for(let k=0;k<nC;k++){const by=k*gap+gap*.5,amp=3+R(k,1,1010)*6,ph=R(k,2,1010)*6.3,fr=.018+R(k,3,1010)*.02;let seg=[];
    const flush=()=>{if(seg.length>2){
      // the lee shadow band below the crest
      x.beginPath();seg.forEach(([cx,cy],i)=>i?x.lineTo(X(cx),Y(cy)):x.moveTo(X(cx),Y(cy)));for(let i=seg.length-1;i>=0;i--){const [cx,cy]=seg[i],w=1.2+2.2*mpWhiteDunesNoise(cx*.05,k,1011);x.lineTo(X(cx+w*.7),Y(cy+w))}x.closePath();x.fillStyle='rgba(126,144,192,.27)';x.fill();
      // the crest line itself
      x.beginPath();seg.forEach(([cx,cy],i)=>i?x.lineTo(X(cx),Y(cy)):x.moveTo(X(cx),Y(cy)));x.strokeStyle='rgba(76,88,128,.62)';x.lineWidth=.5;x.stroke();
      // short hatching down the lee face
      x.strokeStyle='rgba(86,98,140,.34)';x.lineWidth=.3;x.beginPath();for(let i=0;i<seg.length;i+=1){const [cx,cy]=seg[i];if(R(i,k,1012)<.7){const l=1+2.4*R(i,k,1013);x.moveTo(X(cx),Y(cy)+.5);x.lineTo(X(cx+.5),Y(cy)+.5+l*S)}}x.stroke();
      x.fillStyle='rgba(96,112,170,.4)';for(let i=0;i<seg.length;i++){const [cx,cy]=seg[i];for(let m=0;m<2;m++){if(R(i*2+m,k,1019)<.6)x.fillRect(X(cx+R(i,m,1021)*2),Y(cy)+1+R(i,m,1022)*3.4,.45,.45)}}
      // bright rim light just above the crest
      x.beginPath();seg.forEach(([cx,cy],i)=>i?x.lineTo(X(cx),Y(cy)-.9):x.moveTo(X(cx),Y(cy)-.9));x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=.9;x.stroke()}seg=[]};
    for(let cx=6;cx<W-5;cx+=3){const cy=by+amp*Math.sin(cx*fr+ph)+4*(mpWhiteDunesNoise(cx*.03,k*.7,1014)-.5)*2+ (cx-W/2)*(.1+.1*R(k,4,1010)*(k%2?1:-1));
      const gone=cy<5||cy>H-5||nearO(cx,cy,11)||mpWhiteDunesNoise(cx*.035,k*.9,1015)>.64||(cx<14&&Math.abs(cy-L.start.y+(L.start.y-125))<9&&false);
      if(gone){flush();continue}seg.push([cx,cy])}flush()}
  // a few great crescent dunes
  for(let i=0;i<18;i++){const cx=14+R(i,1,1016)*(W-28),cy=14+R(i,2,1016)*(H-28);if(nearO(cx,cy,16)||nearR(cx,cy,9))continue;mpWhiteDunesDune(x,X(cx),Y(cy),3.4+R(i,3,1016)*3.2)}
  x.restore();x.restore();
  // ---------- the rim: a rampart of dunes all round ----------
  mpWhiteDunesRim(x,f,W,H,R,false);x.strokeStyle=MPWD_INK;x.lineWidth=1.1;x.stroke();
  x.save();x.strokeStyle='rgba(88,98,138,.6)';x.lineWidth=.5;for(let i=0;i<4;i++){const side=i;for(let k=2;k<W-2;k+=3){const a=side<2?X(k):(side===2?X(-.6):X(W+.6)),b=side<2?(side===0?Y(-.6):Y(H+.6)):Y(k),dx=side<2?0:(side===2?-1:1),dy=side<2?(side===0?-1:1):0;if(R(k,side,1017)<.7){x.beginPath();x.moveTo(a,b);x.lineTo(a+dx*(1.2+R(k,side,1018)*1.8),b+dy*(1.2+R(k,side,1018)*1.8));x.stroke()}}}x.restore();
  // ---------- mirages: shimmering pale lakes that are not there ----------
  for(const [cx,cy,rx] of [[170,40,16],[34,196,14],[212,214,13],[98,128,12]]){const a=X(cx),b=Y(cy);x.save();
    x.fillStyle='rgba(176,210,232,.34)';mpWhiteDunesBlob(x,a,b,rx*S,rx*S*.34,cx+cy,14);x.fill();x.setLineDash([1.6,1.8]);x.strokeStyle='rgba(70,120,170,.55)';x.lineWidth=.45;x.stroke();x.setLineDash([]);
    x.strokeStyle='rgba(90,150,200,.55)';x.lineWidth=.35;for(let k=-2;k<=2;k++){x.beginPath();x.moveTo(a-rx*S*.7,b+k*1.3);x.bezierCurveTo(a-rx*S*.3,b+k*1.3-1,a+rx*S*.2,b+k*1.3+1,a+rx*S*.7,b+k*1.3);x.stroke()}
    x.strokeStyle='rgba(60,90,70,.45)';x.lineWidth=.45;x.beginPath();x.moveTo(a+rx*S*.3,b-.4);x.lineTo(a+rx*S*.3,b+2.4);x.moveTo(a+rx*S*.3,b+2.4);x.lineTo(a+rx*S*.3-1.6,b+3.6);x.moveTo(a+rx*S*.3,b+2.4);x.lineTo(a+rx*S*.3+1.6,b+3.6);x.stroke();x.restore();
    api.text(x,'mirage',a,b+rx*S*.34+4.6,4.6,'#3a6a92')}
  // ---------- rock needles ----------
  const rocks=L.decor.filter(d=>/^drock/.test(d.k)).sort((p,q)=>p.y-q.y);
  for(const d of rocks){const a=X(d.x+.5+(d.ox||0)),b=Y(d.y+.5+(d.oy||0)),sc=d.sc||1;mpWhiteDunesNeedle(x,a,b+1,2.8+sc*2.4,.9+sc*.4,R(d.x,d.y,1020)<.5)}
  // ---------- ground scatter: tufts, cactus, dead trees, bones ----------
  for(const s of L.scenery||[]){const a=X(s.wx),b=Y(s.wy),r=R(Math.floor(s.wx),Math.floor(s.wy),1030),k=s.k;
    if(/^dshrub/.test(k)){if(r<.35)mpWhiteDunesTuft(x,a,b)}
    else if(/^dplant/.test(k)){if(r<.4){x.save();x.strokeStyle='#4a7a4c';x.lineWidth=.6;x.lineCap='round';x.beginPath();x.moveTo(a,b+1);x.lineTo(a,b-2.6);x.moveTo(a,b-.4);x.lineTo(a-1.3,b-.9);x.lineTo(a-1.3,b-2);x.moveTo(a,b-1.2);x.lineTo(a+1.3,b-1.5);x.lineTo(a+1.3,b-2.4);x.stroke();x.restore()}}
    else if(k==='ddead'){if(r<.7)mpWhiteDunesDead(x,a,b,.9)}
    else if(k==='dbones'){if(r<.5)mpWhiteDunesBone(x,a,b,.9,R(Math.floor(s.wx),Math.floor(s.wy),1031)*3.1);else if(r<.65)mpWhiteDunesRibs(x,a,b,.8);else if(r<.7)MPLI.skull(x,a,b,.42)}}
  // ---------- rings of old pillars ----------
  const rings=[];for(const d of L.decor)if(d.k==='chest'||d.k==='treasure')rings.push([d.x,d.y]);
  for(const [cx,cy] of rings)mpWhiteDunesMarkRuin(x,X(cx+.5),Y(cy+.5));
  for(const d of L.decor){if(!/^dpillar/.test(d.k))continue;const a=X(d.x+.5),b=Y(d.y+.5),h=(R(d.x,d.y,1040)<.4)?1.6:3;x.save();x.fillStyle='#fbf8ec';x.strokeStyle=MPWD_INK;x.lineWidth=.45;x.fillRect(a-.9,b-h,1.8,h+.8);x.strokeRect(a-.9,b-h,1.8,h+.8);x.fillStyle='rgba(120,130,170,.5)';x.fillRect(a,b-h,.9,h+.8);x.restore()}
  // ---------- the three pools ----------
  oases.forEach(([cx,cy],n)=>{const a=X(cx+.5),b=Y(cy+.5);x.save();
    x.fillStyle='rgba(118,150,100,.45)';mpWhiteDunesBlob(x,a,b,7.4,5.6,n+40,14);x.fill();
    x.fillStyle='#6a9cc8';mpWhiteDunesBlob(x,a,b,4.6,3.2,n+50,14);x.fill();x.strokeStyle=MPWD_INK;x.lineWidth=.7;x.stroke();
    x.strokeStyle='rgba(244,250,255,.85)';x.lineWidth=.4;for(const [dx,dy,w] of [[-.6,-.8,2],[.8,.9,1.5]]){x.beginPath();x.moveTo(a+dx-w,b+dy);x.quadraticCurveTo(a+dx-w/2,b+dy-1.2,a+dx,b+dy);x.quadraticCurveTo(a+dx+w/2,b+dy+1.2,a+dx+w,b+dy);x.stroke()}
    x.strokeStyle='#4a8a4a';x.lineWidth=.5;x.lineCap='round';for(let k=0;k<16;k++){const t=k/16*6.28,px=a+Math.cos(t)*5.5,py=b+Math.sin(t)*4;x.beginPath();x.moveTo(px,py);x.lineTo(px+(R(k,n,1050)-.5)*.8,py-1.8-R(k,n,1051));x.stroke()}
    x.restore()});
  for(const d of L.decor.slice().sort((p,q)=>p.y-q.y))if(/^dpalm/.test(d.k))mpWhiteDunesPalm(x,X(d.x+.5),Y(d.y+.5),.95);
  // ---------- the cave doors ----------
  mpWhiteDunesCave(x,X(W/2+.5),Y(H)+.4,0,1);
  mpWhiteDunesCave(x,X(0)-.3,Y(H/2+.5),3,1);
  // ---------- the five dungeon doors ----------
  const doors=L.decor.filter(d=>d.enter);
  for(const d of doors){const a=X(d.x+.5),b=Y(d.y+.5);x.save();x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.ellipse(a,b+1,6,4.4,0,0,6.3);x.fill();x.restore();mpWhiteDunesDoor(x,a,b,d.k)}
  // ---------- flourishes: the sun, vultures wheeling ----------
  mpDesertSun(x,A.x+A.w-11,A.y+12,3.6,'#fff3b0');
  for(const [dx,dy,an] of [[0,0,-.2],[9,5,.3],[-8,8,.1]])mpWhiteDunesVulture(x,A.x+11+dx*.6,A.y+A.h*.62+dy*1.5,.7,an);
  // ---------- labels ----------
  const taken=[];const box=(a,b,w,h)=>({x0:a-w/2,x1:a+w/2,y0:b-h/2,y1:b+h/2});const hit=q=>taken.some(r=>q.x0<r.x1&&q.x1>r.x0&&q.y0<r.y1&&q.y1>r.y0);
  const aA=A.x+2,aB=A.x+A.w-2;
  const T=(t,cx,cy,sz,col,must)=>{sz=sz||6.4;x.save();x.font=`bold ${sz}px ${FUI}`;const w=x.measureText(t).width+2,h=sz+1.6;x.restore();const a0=X(cx),b0=Y(cy);
    for(const [dx,dy] of [[0,0],[0,-h],[0,h],[0,-2*h],[0,2*h],[w*.6,0],[-w*.6,0],[w*.6,-h],[-w*.6,h]]){const a=Math.max(aA+w/2,Math.min(aB-w/2,a0+dx)),b=b0+dy,q=box(a,b,w,h);if(!hit(q)){taken.push(q);api.text(x,t,a,b,sz,col||'#3a3a56');return true}}
    if(must){api.text(x,t,a0,b0,sz,col||'#3a3a56')}return false};
  // icons already on the sheet keep their ground clear of labels
  for(const d of doors)taken.push(box(X(d.x+.5),Y(d.y+.5)-1,12,12));
  oases.forEach(([cx,cy])=>taken.push(box(X(cx+.5),Y(cy+.5)-2,16,13)));
  taken.push(box(X(W/2+.5),Y(H)-3,12,8),box(X(0)+3,Y(H/2+.5),8,12));
  T('THE WHITE DUNES',W*.5,H*.5-34,9,'#274a9a',true);
  poolNames.forEach((nm,i)=>T(nm,oases[i][0],oases[i][1]+9,5.8,'#1e4a6a',true));
  T('Cave to the Blue Dunes',W/2-10,H-9,5.8,'#5a1a10',true);T('Cave to the Flatlands',31,H/2+9,5.8,'#5a1a10',true);
  for(const d of doors){const nm=LEVEL_NAMES[d.enter.to];if(nm)T(nm,d.x+.5,d.y+7.5,5,'#4a2a10',true)}
  T('Needle Rocks',W*.5+20,H*.5+60,6,'#5a4a3a');T('Bleached Bones',208,H*.5+10,5.6,'#6a5a46');
  pans.forEach((p,i)=>{if(i<4)T('Salt Pan',p[0],p[1],5.2,'#5a6a92')});
  rings.forEach(([cx,cy],i)=>{if(i%3===0)T('Old Ruin',cx+.5,cy+8,4.8,'#5a4a3a')});
  // ---------- margins: title, notes, key ----------
  api.title(x,'White Dunes','level 63');api.compass(x,432,54,10);
  api.notes(x,['The sand here is white with salt and chalk, and it glares in the sun.','Tall thin rocks stand alone on the dunes. Bones lie bleached beside them.','Three pools are the only water. Rings of broken pillars mark old ruins.','Pale blue patches on the sand are mirages, not water.','A cave in the south wall leads back to the Blue Dunes. A cave in the west wall leads to the Flatlands.'],8,64,78,6.1,4);
  const key=[['Dune crest',(g,a,b)=>mpWhiteDunesDune(g,a,b+1,4.2)],['Rock needle',(g,a,b)=>mpWhiteDunesNeedle(g,a,b+3,6,1.4,false)],['Bones',(g,a,b)=>mpWhiteDunesRibs(g,a,b+2,1)],['Dead tree',(g,a,b)=>mpWhiteDunesDead(g,a,b+1,1)],
    ['Pool',(g,a,b)=>{g.fillStyle='#6a9cc8';g.strokeStyle=MPWD_INK;g.lineWidth=.6;g.beginPath();g.ellipse(a,b,4,2.8,0,0,6.3);g.fill();g.stroke()}],
    ['Salt pan',(g,a,b)=>{g.fillStyle='#fefefb';g.strokeStyle='rgba(88,100,140,.7)';g.lineWidth=.5;g.beginPath();g.ellipse(a,b,4.4,2.6,0,0,6.3);g.fill();g.stroke()}],
    ['Old pillars',(g,a,b)=>{g.fillStyle='#fbf8ec';g.strokeStyle=MPWD_INK;g.lineWidth=.45;for(const dx of [-3,0,3]){g.fillRect(a+dx-.9,b-2.4,1.8,3.8);g.strokeRect(a+dx-.9,b-2.4,1.8,3.8)}}],
    ['Dungeon door',(g,a,b)=>mpWhiteDunesDoor(g,a,b+1,'dcryptS')],
    ['Cave',(g,a,b)=>mpWhiteDunesCave(g,a,b,0,.8)],
    ['Mirage',(g,a,b)=>{g.fillStyle='rgba(176,210,232,.5)';g.strokeStyle='rgba(70,120,170,.8)';g.lineWidth=.45;g.setLineDash([1.4,1.4]);g.beginPath();g.ellipse(a,b,4.4,2,0,0,6.3);g.fill();g.stroke();g.setLineDash([])}]];
  const h=key.length*13+16;api.panel(x,392,78,84,h);api.text(x,'KEY',398,88,7.5,'#5a3a1c','left');
  key.forEach((k,i)=>{const yy=101+i*13;k[1](x,402,yy);api.text(x,k[0],412,yy,5.8,'#3a2a1c','left')})}
/* the outline of the land: a gently wobbling square */
function mpWhiteDunesRim(x,f,W,H,R,fillOnly){const X=f.X,Y=f.Y,j=(k,s)=>(R(k,s,1060)-.5)*1.4;x.beginPath();
  for(let k=0;k<=W;k+=5)k?x.lineTo(X(k),Y(0)+j(k,1)):x.moveTo(X(k),Y(0)+j(k,1));
  for(let k=0;k<=H;k+=5)x.lineTo(X(W)+j(k,2),Y(k));
  for(let k=W;k>=0;k-=5)x.lineTo(X(k),Y(H)+j(k,3));
  for(let k=H;k>=0;k-=5)x.lineTo(X(0)+j(k,4),Y(k));x.closePath()}
mplInstall({name:'whitedunes',levels:[63],foot:'You are the yellow arrow.',tint:[4,6,14],draw(c,x,L,api){mpWhiteDunesMap(x,L,api)}});
