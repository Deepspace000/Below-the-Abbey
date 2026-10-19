/* ==========================================================================
   AREA MAP for the Flatlands (level 64): a vast level plain of pebbles. Hand-drawn parchment map built from the real level data. See maps_common.js.
   Washes, tracks, soft cloud shadows and hills are invented decoration; stones, plants, bones, oases, ruin rings, dungeon doors and the cave are the real objects.
   ========================================================================== */
const MPFL_INK='#2a1a0c';
function mpFlatFit(L){return mplFit(L.rows[0].length,L.rows.length,12)}
function mpFlatNoise(x,y,seed){const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
  return (hash2(x0,y0,seed)*(1-sx)+hash2(x0+1,y0,seed)*sx)*(1-sy)+(hash2(x0,y0+1,seed)*(1-sx)+hash2(x0+1,y0+1,seed)*sx)*sy}
function mpFlatStone(x,a,b,w,tone){x.save();const R=hash2(a*7|0,b*7|0,1401);
  x.fillStyle='rgba(60,44,28,.22)';x.beginPath();x.ellipse(a+w*.35,b+w*.45,w*1.05,w*.4,0,0,6.3);x.fill();
  x.fillStyle=tone;x.strokeStyle='rgba(42,26,12,.8)';x.lineWidth=.35;x.beginPath();
  for(let k=0;k<7;k++){const an=k/7*6.283+R,r=w*(.8+hash2(k,a*3|0,1402)*.35);const px=a+Math.cos(an)*r,py=b-w*.15+Math.sin(an)*r*.62;k?x.lineTo(px,py):x.moveTo(px,py)}
  x.closePath();x.fill();x.stroke();x.fillStyle='rgba(255,246,222,.45)';x.beginPath();x.ellipse(a-w*.3,b-w*.45,w*.32,w*.16,-.4,0,6.3);x.fill();x.restore()}
function mpFlatTuft(x,a,b,s,col){x.save();x.strokeStyle=col;x.lineWidth=.45;x.lineCap='round';x.beginPath();
  x.moveTo(a-1.1*s,b);x.lineTo(a-1.5*s,b-2*s);x.moveTo(a-.4*s,b);x.lineTo(a-.5*s,b-2.7*s);x.moveTo(a+.4*s,b);x.lineTo(a+.9*s,b-2.4*s);x.moveTo(a+1.1*s,b);x.lineTo(a+1.8*s,b-1.5*s);x.stroke();x.restore()}
function mpFlatBush(x,a,b,s){x.save();x.fillStyle='rgba(112,112,64,.8)';x.strokeStyle='rgba(42,30,12,.7)';x.lineWidth=.35;x.beginPath();x.arc(a-.9*s,b-.8*s,1*s,3.14,0);x.arc(a+.7*s,b-1*s,1.2*s,3.14,0);x.lineTo(a+1.9*s,b);x.lineTo(a-1.9*s,b);x.closePath();x.fill();x.stroke();x.restore()}
function mpFlatDead(x,a,b,s){x.save();x.strokeStyle='#4a3420';x.lineWidth=.55;x.lineCap='round';x.beginPath();x.moveTo(a,b+.6);x.lineTo(a,b-3*s);x.moveTo(a,b-1.2*s);x.lineTo(a-1.8*s,b-2.8*s);x.moveTo(a,b-2*s);x.lineTo(a+1.6*s,b-3.4*s);x.stroke();x.restore()}
function mpFlatBones(x,a,b){x.save();x.strokeStyle='rgba(250,244,228,.95)';x.lineWidth=.6;x.lineCap='round';x.beginPath();x.moveTo(a-1.3,b-.5);x.lineTo(a+1.3,b+.5);x.moveTo(a-1.2,b+.6);x.lineTo(a+1.2,b-.6);x.stroke();x.strokeStyle='rgba(60,40,20,.55)';x.lineWidth=.25;x.stroke();x.restore()}
function mpFlatPalm(x,a,b,s){x.save();x.strokeStyle='#5a3a1c';x.lineWidth=.8*s;x.beginPath();x.moveTo(a,b+1.2*s);x.quadraticCurveTo(a+.9*s,b-2*s,a+.3*s,b-4.2*s);x.stroke();
  x.strokeStyle=MPFL_INK;x.fillStyle='#3f8a4c';x.lineWidth=.35;const tx=a+.3*s,ty=b-4.2*s;
  for(let k=0;k<6;k++){const an=-Math.PI/2+(k-2.5)*.62,dx=Math.cos(an),dy=Math.sin(an);x.beginPath();x.moveTo(tx,ty);x.quadraticCurveTo(tx+dx*2.4*s,ty+dy*2.4*s-.5*s,tx+dx*3.6*s,ty+dy*2.8*s+1.4*s);x.quadraticCurveTo(tx+dx*2.2*s,ty+dy*1.8*s+.4*s,tx,ty);x.fill();x.stroke()}x.restore()}
function mpFlatHill(x,a,b,w,h,col){x.save();x.fillStyle=col;x.strokeStyle='rgba(42,26,12,.75)';x.lineWidth=.55;x.beginPath();x.moveTo(a-w,b);x.bezierCurveTo(a-w*.7,b-h*.9,a-w*.25,b-h*1.05,a+w*.05,b-h);x.bezierCurveTo(a+w*.4,b-h*.95,a+w*.75,b-h*.6,a+w,b);x.closePath();x.fill();x.stroke();
  x.strokeStyle='rgba(70,46,24,.5)';x.lineWidth=.4;x.beginPath();for(let k=0;k<5;k++){const u=a+w*(.05+k*.17),v=b-h*(.95-k*.17);x.moveTo(u,v);x.lineTo(u+w*.1,b-h*.05)}x.stroke();x.restore()}
function mpFlatPath(x,pts,X,Y){x.beginPath();pts.forEach(([a,b],i)=>i?x.lineTo(X(a),Y(b)):x.moveTo(X(a),Y(b)))}
/* a wandering line across the plain: start, heading, length in cells; returns points in cells */
function mpFlatWander(sx,sy,ang,len,amp,seed){const p=[[sx,sy]];let a=ang,x=sx,y=sy;for(let d=0;d<len;d+=3){a+=(mpFlatNoise(d*.09,seed,seed+3)-.5)*.5*amp;x+=Math.cos(a)*3;y+=Math.sin(a)*3;p.push([x,y])}return p}
function mpFlatKeyIcons(){return {
  stone:(x,a,b)=>mpFlatStone(x,a,b+1,2.4,'#a39482'),
  wash:(x,a,b)=>{x.save();x.strokeStyle='rgba(110,80,46,.5)';x.lineWidth=4.2;x.lineCap='round';x.beginPath();x.moveTo(a-6,b+1);x.quadraticCurveTo(a-2,b-2,a+1,b);x.quadraticCurveTo(a+4,b+2,a+6,b-1);x.stroke();x.strokeStyle='#e9dab4';x.lineWidth=3;x.stroke();x.strokeStyle='rgba(90,60,30,.7)';x.lineWidth=.4;x.beginPath();x.moveTo(a-2,b-2);x.lineTo(a-1,b+2);x.moveTo(a+2,b-1);x.lineTo(a+3,b+3);x.stroke();x.restore()},
  track:(x,a,b)=>{x.save();x.strokeStyle='rgba(90,52,24,.85)';x.lineWidth=.9;x.setLineDash([1,2]);x.beginPath();x.moveTo(a-6,b);x.lineTo(a+6,b);x.stroke();x.restore()},
  tuft:(x,a,b)=>{mpFlatTuft(x,a-2,b+2,1.1,'#5a6a30');mpFlatBush(x,a+3,b+2,1)},
  pool:(x,a,b)=>{x.fillStyle='#6a9cc0';x.strokeStyle=MPFL_INK;x.lineWidth=.6;x.beginPath();x.ellipse(a-2,b+1,3.4,2.4,0,0,6.3);x.fill();x.stroke();mpFlatPalm(x,a+4,b+2,.8)},
  ruin:(x,a,b)=>{x.strokeStyle=MPL.VERM;x.lineWidth=1.1;x.beginPath();x.moveTo(a-2,b-2);x.lineTo(a+2,b+2);x.moveTo(a+2,b-2);x.lineTo(a-2,b+2);x.stroke()},
  door:(x,a,b)=>{x.fillStyle='#1a1008';x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.beginPath();x.arc(a,b,3,0,6.3);x.fill();x.stroke()},
  bones:(x,a,b)=>{x.fillStyle='#c8b890';x.fillRect(a-4,b-2.5,8,5);mpFlatBones(x,a,b)},
  dead:(x,a,b)=>mpFlatDead(x,a,b+2,1.2)}}

function mpFlatMap(x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=mpFlatFit(L),S=f.s,X=f.X,Y=f.Y,R=hash2,A=MPL.AREA;
  const px0=X(0),py0=Y(0),pw=W*S,ph=H*S;
  const inPlain=()=>{x.beginPath();x.rect(px0,py0,pw,ph);x.clip()};
  // distant hills on the parchment round the plain
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.rect(px0,py0,pw,ph);x.clip('evenodd');
  const hills=[];
  for(let i=0;i<64;i++){const side=i%4,t=R(i,1,1410),r=R(i,2,1410);let a,b;
    if(side===0){a=px0-3-r*24;b=py0+t*ph+6}else if(side===1){a=px0+pw+3+r*24;b=py0+t*ph+6}else if(side===2){a=px0+t*pw;b=py0-1-r*5}else{a=px0+t*pw;b=py0+ph+8+r*5}
    hills.push([a,b,4.5+R(i,3,1410)*5,4+R(i,4,1410)*5.5,R(i,5,1410)])}
  hills.sort((p,q)=>p[1]-q[1]);
  for(const [a,b,w,h,t] of hills)mpFlatHill(x,a,b,w,h,t<.5?'#cdb98e':'#c4ad82');
  x.strokeStyle='rgba(120,90,56,.4)';x.lineWidth=.45;for(let i=0;i<260;i++){const a=A.x+R(i,6,1410)*A.w,b=A.y+R(i,7,1410)*A.h;x.beginPath();x.moveTo(a-1.6,b);x.lineTo(a+1.6,b+.3);x.stroke()}
  x.restore();
  // the plain: a wash of warm grey and ochre, two cells at a time
  for(let cy=0;cy<H;cy+=2)for(let cx=0;cx<W;cx+=2){
    const n=mpFlatNoise(cx*.035,cy*.035,1420),m=mpFlatNoise(cx*.09,cy*.09,1421),fm=L.fmap[cy][cx];
    let c=[216-n*20-m*6,196-n*20-m*6,152-n*18-m*6];
    if(fm==='1'){c[0]-=14;c[1]-=10;c[2]-=2}else if(fm==='2'){c[0]+=2;c[1]-=8;c[2]-=18}else if(fm==='3'){c=[170,176,112]}else if(fm==='4'){c=[120,156,176]}
    const k=(R(cx,cy,1422)-.5)*7;x.fillStyle=`rgb(${(c[0]+k)|0},${(c[1]+k)|0},${(c[2]+k*.7)|0})`;x.fillRect(X(cx),Y(cy),S*2+.4,S*2+.4)}
  x.save();inPlain();
  // the shadows of big clouds: soft dark washes, a few pale gaps of sun between them
  for(let i=0;i<9;i++){const a=px0+R(i,1,1430)*pw,b=py0+R(i,2,1430)*ph,r=26+R(i,3,1430)*34;x.save();x.translate(a,b);x.scale(1.7,.8);x.rotate(.4);
    const g=x.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'rgba(84,72,76,.20)');g.addColorStop(.7,'rgba(84,72,76,.11)');g.addColorStop(1,'rgba(84,72,76,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,r,0,6.3);x.fill();x.restore()}
  for(let i=0;i<5;i++){const a=px0+R(i,1,1431)*pw,b=py0+R(i,2,1431)*ph,r=20+R(i,3,1431)*22;x.save();x.translate(a,b);x.scale(1.6,.7);const g=x.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'rgba(255,240,196,.22)');g.addColorStop(1,'rgba(255,240,196,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,r,0,6.3);x.fill();x.restore()}
  // dry washes: pale cracked beds that wander across the plain, with tributaries
  const washes=[];
  [[0,52,.12,270],[0,168,-.08,270],[70,0,1.4,270],[190,0,1.7,270]].forEach(([sx,sy,an,len],i)=>{const p=mpFlatWander(sx,sy,an,len,1.1,1440+i*7);washes.push([p,1]);
    for(let k=0;k<2;k++){const j=Math.max(2,Math.min(p.length-6,(8+k*18+R(i,k,1441)*14)|0)),q=p[j],dir=(k?1:-1)*(1.0+R(i,k+3,1442)*.6);washes.push([mpFlatWander(q[0],q[1],an+dir,90,1.4,1450+i*5+k),.6])}});
  for(const [p,wd] of washes){x.save();x.lineCap='round';x.lineJoin='round';
    mpFlatPath(x,p,X,Y);x.strokeStyle='rgba(104,76,44,.36)';x.lineWidth=5.6*wd+1.2;x.stroke();
    mpFlatPath(x,p,X,Y);x.strokeStyle='rgba(236,222,184,.92)';x.lineWidth=5.6*wd;x.stroke();
    mpFlatPath(x,p,X,Y);x.strokeStyle='rgba(214,194,150,.8)';x.lineWidth=2.4*wd;x.stroke();
    // mud cracks: little forked strokes across the bed
    x.strokeStyle='rgba(98,66,36,.7)';x.lineWidth=.4;x.beginPath();
    for(let i=1;i<p.length-1;i++)for(let k=0;k<3;k++){const t=R(i,k,1460),ox=(R(i,k,1461)-.5)*4.2,oy=(R(i,k,1462)-.5)*4.2;const a=X(p[i][0])+ox,b=Y(p[i][1])+oy,an=R(i,k,1463)*6.28;
      x.moveTo(a,b);x.lineTo(a+Math.cos(an)*1.5,b+Math.sin(an)*1.5);x.moveTo(a,b);x.lineTo(a+Math.cos(an+2.1)*1.2,b+Math.sin(an+2.1)*1.2);x.moveTo(a,b);x.lineTo(a+Math.cos(an-2.1)*1.3,b+Math.sin(an-2.1)*1.3)}
    x.stroke();x.restore()}
  // the pebbles: thousands of small stones in greys, browns and ochre, with a pale highlight
  const tones=['#8c8274','#a09078','#6e6054','#b09c74','#948470'];
  for(let i=0;i<4200;i++){const a=px0+R(i,1,1470)*pw,b=py0+R(i,2,1470)*ph,r=.3+R(i,3,1470)*.45;x.fillStyle=tones[(R(i,4,1470)*5)|0];x.globalAlpha=.55+R(i,5,1470)*.35;x.beginPath();x.ellipse(a,b,r*1.2,r*.8,0,0,6.3);x.fill()}
  x.globalAlpha=1;
  for(let i=0;i<70;i++){const a=px0+R(i,1,1471)*pw,b=py0+R(i,2,1471)*ph;for(let k=0;k<7;k++){const q=a+(R(i,k,1472)-.5)*9,w=b+(R(i,k,1473)-.5)*5,r=.4+R(i,k,1474)*.7;x.fillStyle=tones[(R(i,k,1475)*5)|0];x.beginPath();x.ellipse(q,w,r*1.2,r*.8,0,0,6.3);x.fill();x.fillStyle='rgba(255,246,222,.5)';x.fillRect(q-r*.6,w-r*.5,r*.5,r*.3)}}
  // faint tracks: a worn way from the cave west to the oases and the doors
  const trk=[[247,125],[236,131],[222,146],[200,160],[184,167],[168,154],[150,146],[133,134]];
  const trk2=[[133,134],[112,118],[96,96],[80,78],[72,72]],trk3=[[133,134],[152,118],[168,102],[166,76],[162,50],[161,46]],trk4=[[133,134],[128,152],[124,155]];
  x.save();x.lineCap='round';x.lineJoin='round';x.strokeStyle='rgba(96,58,28,.78)';x.fillStyle='rgba(96,58,28,.8)';
  for(const t of [trk,trk2,trk3,trk4]){const pts=[];for(let i=0;i<t.length-1;i++){for(let k=0;k<6;k++){const u=k/6,a=t[i][0]+(t[i+1][0]-t[i][0])*u,b=t[i][1]+(t[i+1][1]-t[i][1])*u;pts.push([a+(mpFlatNoise(a*.2,b*.2,1480)-.5)*5,b+(mpFlatNoise(a*.2,b*.2,1481)-.5)*5])}}
    for(let i=0;i<pts.length;i+=1){if(i%2)continue;const a=X(pts[i][0]),b=Y(pts[i][1]);x.beginPath();x.arc(a,b,.75,0,6.3);x.fill();x.beginPath();x.arc(a+1.5,b+1,.6,0,6.3);x.fill()}}
  x.restore();
  x.restore();
  // the edge of the plain, inked
  x.save();x.strokeStyle=MPFL_INK;x.lineWidth=1.1;x.lineCap='round';x.beginPath();const gy=125;
  for(let k=0;k<W;k+=2){const j=(R(k,1,1490)-.5)*.7;x.moveTo(X(k),py0+j);x.lineTo(X(k+2),py0-j);x.moveTo(X(k),py0+ph+j);x.lineTo(X(k+2),py0+ph-j)}
  for(let k=0;k<H;k+=2){const j=(R(k,2,1490)-.5)*.7;x.moveTo(px0+j,Y(k));x.lineTo(px0-j,Y(k+2));if(Math.abs(k-gy)>3){x.moveTo(px0+pw+j,Y(k));x.lineTo(px0+pw-j,Y(k+2))}}
  x.stroke();x.restore();
  // stones, plants, dead trees, bones
  x.save();inPlain();
  const dec=L.decor.slice().sort((p,q)=>p.y-q.y);
  for(const d of dec){if(!/^drock/.test(d.k))continue;const a=X(d.x+.5),b=Y(d.y+.5),sc=d.sc||1,t=R(d.x,d.y,1500);mpFlatStone(x,a,b,.9+sc*.75,t<.34?'#a39482':t<.68?'#b3a07c':'#8f8271')}
  for(const s of L.scenery||[]){const a=X(s.wx),b=Y(s.wy),r=R(s.wx*3|0,s.wy*3|0,1510);
    if(/^dplant/.test(s.k))mpFlatTuft(x,a,b+1,1+r*.4,'#5a6a30');
    else if(/^dshrub/.test(s.k)){if(r<.5)mpFlatTuft(x,a,b+1,.9+r*.4,'#8a7a38');else if(r<.62)mpFlatBush(x,a,b+1,.8)}
    else if(s.k==='ddead')mpFlatDead(x,a,b,.9);
    else if(s.k==='dbones'&&r<.55)mpFlatBones(x,a,b)}
  x.restore();
  // the two oases: a pool in a ring of green, reeds, palms
  const OA=[[70,70],[180,170]];
  for(const [cx,cy] of OA){const a=X(cx+.5),b=Y(cy+.5);x.save();
    x.fillStyle='rgba(128,160,84,.55)';x.beginPath();x.ellipse(a,b,7.4,5.8,0,0,6.3);x.fill();
    for(let i=0;i<22;i++){const an=R(i,cx,1520)*6.28,r=3.6+R(i,cy,1521)*3.6;mpFlatTuft(x,a+Math.cos(an)*r,b+Math.sin(an)*r*.8+1,.9,'#3a6a34')}
    x.fillStyle='#6a9cc0';x.strokeStyle=MPFL_INK;x.lineWidth=.7;x.beginPath();x.ellipse(a,b,4.2,3,0,0,6.3);x.fill();x.stroke();
    x.strokeStyle='rgba(240,248,255,.8)';x.lineWidth=.4;for(const [dx,dy,w] of [[-1.3,-.8,1.6],[1,.9,1.4]]){x.beginPath();x.moveTo(a+dx-w,b+dy);x.quadraticCurveTo(a+dx-w/2,b+dy-1,a+dx,b+dy);x.quadraticCurveTo(a+dx+w/2,b+dy+1,a+dx+w,b+dy);x.stroke()}x.restore()}
  for(const d of dec){if(/^dpalm/.test(d.k))mpFlatPalm(x,X(d.x+.5),Y(d.y+.5)+1,.95*(d.sc||1))}
  // the ruin rings: pillars in a circle, a dotted ground ring and an X where the chest lies
  const ruins=L.decor.filter(d=>d.k==='chest'||d.k==='treasure');
  for(const d of ruins){const a=X(d.x+.5),b=Y(d.y+.5);x.save();x.setLineDash([1,1.6]);x.strokeStyle='rgba(90,64,36,.55)';x.lineWidth=.45;x.beginPath();x.arc(a,b,4*S,0,6.3);x.stroke();x.restore()}
  for(const d of dec){if(!/^dpillar/.test(d.k))continue;const a=X(d.x+.5),b=Y(d.y+.5);x.save();x.fillStyle='rgba(60,44,28,.25)';x.beginPath();x.ellipse(a+.5,b+.8,1.3,.6,0,0,6.3);x.fill();x.fillStyle='#d8c8a2';x.strokeStyle=MPFL_INK;x.lineWidth=.4;x.fillRect(a-.65,b-2.4,1.3,2.8);x.strokeRect(a-.65,b-2.4,1.3,2.8);x.fillRect(a-1,b-2.9,2,.7);x.strokeRect(a-1,b-2.9,2,.7);x.restore()}
  for(const d of ruins){const a=X(d.x+.5),b=Y(d.y+.5);x.save();if(d.k==='chest'){x.strokeStyle=MPL.VERM;x.lineWidth=1.2;x.lineCap='round';x.beginPath();x.moveTo(a-1.9,b-1.9);x.lineTo(a+1.9,b+1.9);x.moveTo(a+1.9,b-1.9);x.lineTo(a-1.9,b+1.9);x.stroke()}else{x.fillStyle=MPL.GOLD;x.strokeStyle=MPFL_INK;x.lineWidth=.45;x.beginPath();x.arc(a,b,1.3,0,6.3);x.fill();x.stroke()}x.restore()}
  // dungeon doors: one little drawing for each kind, a dark mouth ringed in gold
  const ent=L.decor.filter(d=>d.enter);
  for(const d of ent){const a=X(d.x+.5),b=Y(d.y+.5),k=d.k;x.save();x.lineJoin='round';x.strokeStyle=MPFL_INK;x.lineWidth=.6;
    x.fillStyle='rgba(60,44,28,.28)';x.beginPath();x.ellipse(a+1,b+1.2,4.6,1.6,0,0,6.3);x.fill();
    if(k==='dhatch'){x.fillStyle='#8a6a3a';x.fillRect(a-3,b-2,6,3.6);x.strokeRect(a-3,b-2,6,3.6);x.fillStyle='#1a1008';x.fillRect(a-1.6,b-1.2,3.2,2)}
    else if(k==='dtreehole'){MPLI.tree(x,a,b+1,.8);x.fillStyle='#1a1008';x.beginPath();x.ellipse(a,b-.3,.8,1.2,0,0,6.3);x.fill()}
    else if(k==='dspire'){MPLI.tower(x,a,b+1,.6)}
    else if(k==='dcryptS'||k==='dcryptL'){const s=k==='dcryptL'?1.2:.9;x.fillStyle='#d6cdb4';x.fillRect(a-3*s,b-3*s,6*s,4*s);x.strokeRect(a-3*s,b-3*s,6*s,4*s);x.beginPath();x.moveTo(a-3.6*s,b-3*s);x.lineTo(a,b-5.6*s);x.lineTo(a+3.6*s,b-3*s);x.closePath();x.fill();x.stroke();x.fillStyle='#1a1008';x.fillRect(a-.9*s,b-1.6*s,1.8*s,2.6*s)}
    else if(k==='druinstairs'){x.fillStyle='#cfc4a4';for(const [dx,h] of [[-3.4,3],[-1.8,5],[2.6,3.4]]){x.fillRect(a+dx,b-h,1.6,h+.6);x.strokeRect(a+dx,b-h,1.6,h+.6)}x.fillStyle='#1a1008';x.fillRect(a-1,b-.8,2.4,1.4)}
    else if(k==='dburrow'){x.fillStyle='#d8b878';x.beginPath();x.moveTo(a-4,b+1);x.quadraticCurveTo(a-3,b-4.4,a,b-4.4);x.quadraticCurveTo(a+3,b-4.4,a+4,b+1);x.closePath();x.fill();x.stroke();x.fillStyle='#1a1008';x.beginPath();x.moveTo(a-1,b+1);x.quadraticCurveTo(a-1,b-1.6,a,b-1.6);x.quadraticCurveTo(a+1,b-1.6,a+1,b+1);x.fill()}
    else if(k==='dstairs'){x.fillStyle='#c8bc9c';for(let s=0;s<3;s++){x.fillRect(a-3+s*.8,b-2.6+s*1.5,6-s*1.6,1.4);x.strokeRect(a-3+s*.8,b-2.6+s*1.5,6-s*1.6,1.4)}}
    else{x.fillStyle='#1a1008';x.beginPath();x.arc(a,b,2.4,0,6.3);x.fill();x.stroke()}
    x.restore()}
  // the cave in the east wall
  {const a=px0+pw,b=Y(125.5);x.save();x.fillStyle='#1a1008';x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.moveTo(a-1.4,b+4);x.lineTo(a-1.4,b-1.2);x.quadraticCurveTo(a+1.2,b-6,a+4.4,b-1.2);x.lineTo(a+4.4,b+4);x.closePath();x.fill();x.stroke();x.restore()}
  // the labels
  const T=(t,cx,cy,sz,col)=>api.text(x,t,X(cx),Y(cy),sz||6,col||'#3a2210');
  T('THE FLATLANDS',125,206,8.4,'#5a3a1c');
  T('Cave to the White Dunes',217,114,5.4,'#1a2c6a');
  T('Western Oasis',70,82,5.8,'#1e4a6a');T('Southern Oasis',180,182,5.8,'#1e4a6a');
  T('Dry washes',64,60+0,5.2,'#6a4a28');
  for(const d of ent){const nm=(typeof DNG_INFO!=='undefined'&&DNG_INFO[d.enter.to])?DNG_INFO[d.enter.to].name:'Dungeon',star=/Last Oasis/.test(nm);
    const shr=/Amber Heron/.test(nm),cry=/Midday/.test(nm),a=shr?X(d.x+.5)+4:cry?X(d.x+.5)+4:Math.max(px0+36,Math.min(px0+pw-36,X(d.x+.5))),b=Y(d.y+.5)+(star?8.8:cry?9.6:7.2);
    if(star){MPLI.star(x,X(d.x+.5)+7,Y(d.y+.5)-5,.9);api.text(x,nm,a,b,5.6,'#7a1a10')}else if(shr)x.save(),x.textAlign='right',api.text(x,nm,a+20,b,4.9,'#3a2a1c','right'),x.restore();else api.text(x,nm,a,b,4.9,'#3a2a1c')}
  api.text(x,'Ankh Key here',Math.max(px0+36,Math.min(px0+pw-36,X(161.5))),Y(44.5)+14.4,4.8,'#7a1a10');
  // vultures wheeling and a sun
  x.save();x.strokeStyle=MPFL_INK;x.lineWidth=.6;x.lineCap='round';for(const [a,b,s] of [[340,70,1],[352,78,.8],[330,84,.7],[160,262,.8],[172,266,.6]]){x.beginPath();x.moveTo(a-3*s,b+1.4*s);x.quadraticCurveTo(a-1.4*s,b-1.4*s,a,b);x.quadraticCurveTo(a+1.4*s,b-1.4*s,a+3*s,b+1.4*s);x.stroke()}x.restore();
  // margins
  const kk=mpFlatKeyIcons();
  api.title(x,'Flatlands','level 64');api.compass(x,432,54,10);
  api.notes(x,['A cave in the east wall leads in from the White Dunes. The ground is flat and covered in pebbles to the horizon.','Dry washes cross the plain. Their beds are cracked and easy to walk.','Two oases have a pool, palms, dates and water.','Rings of old pillars hide chests. The Barrow of the Last Oasis holds the Ankh Key.','Scorpions, nomads, mummies, wolves and vultures roam the open ground.'],8,64,78,5.9,3.2);
  const items=[['Stones',kk.stone],['Dry wash',kk.wash],['Track',kk.track],['Grass and shrubs',kk.tuft],['Oasis',kk.pool],['Ruin chest',kk.ruin],['Dungeon door',(g,a,b)=>MPLI.house(g,a,b+1,.6,'#8a6a3a')],['Bones',kk.bones],['Dead tree',kk.dead]];
  const h=items.length*12+16;api.panel(x,392,78,84,h);api.text(x,'KEY',398,88,7.5,'#5a3a1c','left');
  items.forEach((k,i)=>{const yy=100+i*12;k[1](x,402,yy);api.text(x,k[0],412,yy,5.6,'#3a2a1c','left')});
  // a small cloud and its shadow in the right margin
  x.save();x.fillStyle='rgba(250,246,232,.9)';x.strokeStyle=MPFL_INK;x.lineWidth=.6;x.beginPath();x.arc(420,236,6,3.1,0);x.arc(430,233,8,3.2,0);x.arc(441,236,5,3.1,0);x.closePath();x.fill();x.stroke();
  x.fillStyle='rgba(84,72,76,.3)';x.beginPath();x.ellipse(432,262,18,4,0,0,6.3);x.fill();x.strokeStyle='rgba(84,72,76,.45)';x.lineWidth=.4;x.setLineDash([1,2]);x.beginPath();x.moveTo(430,240);x.lineTo(432,258);x.stroke();x.restore();
  api.text(x,'cloud shadows drift over the plain',432,274,4.8,'#5a3a1c')}

mplInstall({name:'flatlands',levels:[64],fit:mpFlatFit,foot:'You are the yellow arrow.',draw(c,x,L,api){mpFlatMap(x,L,api)}});
