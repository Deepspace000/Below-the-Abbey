/* ==========================================================================
   AREA MAP for the Golden Erg (level 61): a gold-leaf sand sea, drawn from the real level (300 x 300 cells, three oases, rings of ruins, two cave doors).
   ========================================================================== */
const MPGE_INK='#2a1a0c';
const mpGoldenErgFit=L=>mplFit(L.rows[0].length,L.rows.length,12);
/* smooth value noise */
function mpGoldenErgNoise(x,y,seed){const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),h=(i,j)=>hash2(i,j,seed);
  return (h(x0,y0)*(1-sx)+h(x0+1,y0)*sx)*(1-sy)+(h(x0,y0+1)*(1-sx)+h(x0+1,y0+1)*sx)*sy}
/* the swell of the sand: long dunes running north-east to south-west, bent by slow noise. Value 0..1, crests near 1 */
function mpGoldenErgField(x,y){
  const wx=x+mpGoldenErgNoise(x/38,y/38,11)*34,wy=y+mpGoldenErgNoise(x/44,y/44,12)*34,u=(wx*.94+wy*.34)/21,v=(wy*.94-wx*.34)/70;
  return .5+.34*Math.sin(u+Math.sin(v*5+mpGoldenErgNoise(x/60,y/60,13)*5)*1.3)+.16*Math.sin(u*2.3+v*3+1.7)}
function mpGoldenErgLerp(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}
function mpGoldenErgPalm(x,a,b,s){s=s||1;x.save();x.strokeStyle='#5a3a1c';x.lineWidth=.8*s;x.beginPath();x.moveTo(a,b+1.2*s);x.quadraticCurveTo(a+.9*s,b-1.6*s,a+.3*s,b-3.8*s);x.stroke();
  x.strokeStyle=MPGE_INK;x.fillStyle='#3f8a4c';x.lineWidth=.35;const tx=a+.3*s,ty=b-3.8*s;
  for(let k=0;k<6;k++){const an=-Math.PI/2+(k-2.5)*.62,dx=Math.cos(an),dy=Math.sin(an);x.beginPath();x.moveTo(tx,ty);x.quadraticCurveTo(tx+dx*2.2*s,ty+dy*2.2*s-.5*s,tx+dx*3.4*s,ty+dy*2.6*s+1.4*s);x.quadraticCurveTo(tx+dx*2*s,ty+dy*1.7*s+.3*s,tx,ty);x.fill();x.stroke()}
  x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(tx,ty+.5*s,.5*s,0,6.3);x.fill();x.restore()}
function mpGoldenErgCamel(x,a,b,s,flip){s=s||1;x.save();x.translate(a,b);x.scale(flip?-s:s,s);x.fillStyle='#c09658';x.strokeStyle=MPGE_INK;x.lineWidth=.55;
  x.beginPath();x.moveTo(-2.4,-3);x.quadraticCurveTo(-2,-5.2,-1,-3.8);x.quadraticCurveTo(0,-5.6,1,-3.6);x.quadraticCurveTo(2.2,-3.4,2.6,-4);x.quadraticCurveTo(3.6,-6.6,4.6,-6.8);x.lineTo(5.6,-6.4);x.lineTo(5.2,-5.6);x.lineTo(4.2,-5.6);x.quadraticCurveTo(3.4,-3.8,2.8,-2.2);x.lineTo(2.4,0);x.lineTo(1.7,0);x.lineTo(1.6,-1.8);x.lineTo(-1.4,-1.8);x.lineTo(-1.5,0);x.lineTo(-2.2,0);x.lineTo(-2.4,-2);x.lineTo(-3.3,-.6);x.lineTo(-3.5,-2.6);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.VERM;x.fillRect(-1.2,-4.2,2.4,1.1);x.restore()}
function mpGoldenErgObelisk(x,a,b,s){s=s||1;x.save();x.fillStyle='#e0d0a4';x.strokeStyle=MPGE_INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-1*s,b+1);x.lineTo(a-.8*s,b-5*s);x.lineTo(a,b-6.6*s);x.lineTo(a+.8*s,b-5*s);x.lineTo(a+1*s,b+1);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.moveTo(a-.8*s,b-5*s);x.lineTo(a,b-6.6*s);x.lineTo(a+.8*s,b-5*s);x.fill();x.restore()}
function mpGoldenErgMount(x,a,b,s,gold){s=s||1;x.save();x.fillStyle='#a8957a';x.strokeStyle=MPGE_INK;x.lineWidth=.55;x.beginPath();x.moveTo(a-7*s,b);x.lineTo(a-1.5*s,b-8*s);x.lineTo(a+1.5*s,b-5*s);x.lineTo(a+3.5*s,b-7*s);x.lineTo(a+8*s,b);x.closePath();x.fill();x.stroke();
  x.fillStyle='rgba(90,60,34,.45)';x.beginPath();x.moveTo(a-1.5*s,b-8*s);x.lineTo(a+1.5*s,b-5*s);x.lineTo(a+3.5*s,b-7*s);x.lineTo(a+8*s,b);x.lineTo(a+2*s,b);x.closePath();x.fill();
  x.fillStyle=gold?MPL.GOLD2:'#f4efe4';x.beginPath();x.moveTo(a-3.1*s,b-5.2*s);x.lineTo(a-1.5*s,b-8*s);x.lineTo(a-.1*s,b-5.8*s);x.lineTo(a-1.2*s,b-5*s);x.lineTo(a-2*s,b-5.6*s);x.closePath();x.fill();
  x.strokeStyle='rgba(42,26,12,.5)';x.lineWidth=.35;x.beginPath();x.moveTo(a-3*s,b-1*s);x.lineTo(a-2*s,b-3.4*s);x.moveTo(a+4*s,b-1*s);x.lineTo(a+3.4*s,b-3.4*s);x.stroke();x.restore()}
function mpGoldenErgRock(x,a,b,w){x.save();x.fillStyle='#b09a78';x.strokeStyle=MPGE_INK;x.lineWidth=.45;x.beginPath();x.moveTo(a-w,b+w*.5);x.lineTo(a-w*.7,b-w*.2);x.lineTo(a-w*.2,b-w*.8);x.lineTo(a+w*.4,b-w*.6);x.lineTo(a+w*.9,b+w*.1);x.lineTo(a+w,b+w*.5);x.closePath();x.fill();x.stroke();x.restore()}
function mpGoldenErgRipple(x,a,b,w){x.beginPath();x.moveTo(a-w,b);x.quadraticCurveTo(a-w/2,b-1.1,a,b);x.quadraticCurveTo(a+w/2,b+1.1,a+w,b);x.stroke()}
/* a flower of gold leaf: a small starburst of flakes */
function mpGoldenErgFlake(x,a,b,s){x.save();x.fillStyle=MPL.GOLD2;x.strokeStyle='rgba(150,100,10,.7)';x.lineWidth=.25;x.beginPath();x.moveTo(a,b-s);x.lineTo(a+s*.35,b-s*.35);x.lineTo(a+s,b);x.lineTo(a+s*.35,b+s*.35);x.lineTo(a,b+s);x.lineTo(a-s*.35,b+s*.35);x.lineTo(a-s,b);x.lineTo(a-s*.35,b-s*.35);x.closePath();x.fill();x.stroke();x.restore()}

function mpGoldenErgDraw(x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=mpGoldenErgFit(L),S=f.s,X=f.X,Y=f.Y,R=hash2,Cn=(a,b,t)=>mpGoldenErgLerp(a,b,t);
  const AR=MPL.AREA,gx0=X(0),gy0=Y(0),gx1=X(W),gy1=Y(H);
  // the frame area gets a pale wash first, so the distant ring of mountains stands on warm vellum
  x.save();x.fillStyle='rgba(236,208,140,.35)';x.fillRect(AR.x,AR.y,AR.w,AR.h);x.restore();
  // the sand sea: one block per 3 cells, shaded by the swell with light from the west, warmer toward the low sun
  const B=3,sh=[[255,232,128],[248,206,86],[226,168,52]],lit=[255,244,176];
  x.save();
  for(let by=0;by<H;by+=B)for(let bx=0;bx<W;bx+=B){
    const cx=bx+B/2,cy=by+B/2,v=mpGoldenErgField(cx,cy),sl=mpGoldenErgField(cx-2.4,cy)-mpGoldenErgField(cx+2.4,cy);
    let c=Cn(sh[2],sh[0],Math.max(0,Math.min(1,v*1.3-.1)));
    const t=Math.max(-1,Math.min(1,sl*2.6));c=t>0?Cn(c,lit,t*.6):Cn(c,[196,132,40],-t*.5);
    const sun=Math.max(0,1-Math.hypot(cx-0,cy-(H*.78))/(W*.9));c=Cn(c,[255,214,120],sun*.28);
    const n=(R(bx,by,801)-.5)*6;x.fillStyle=`rgb(${(c[0]+n)|0},${(c[1]+n)|0},${(c[2]+n*.6)|0})`;x.fillRect(X(bx),Y(by),B*S+.5,B*S+.5)}
  x.restore();
  // the pools and their green fringes (washes under everything else)
  for(const [ox,oy] of GER.OASES){const a=X(ox+.5),b=Y(oy+.5);x.save();
    const g=x.createRadialGradient(a,b,2,a,b,S*10);g.addColorStop(0,'rgba(120,170,90,.8)');g.addColorStop(.6,'rgba(150,176,84,.5)');g.addColorStop(1,'rgba(150,176,84,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,S*10,0,6.3);x.fill();x.restore()}
  // crest lines: follow the level lines of the swell, a dark shadow stroke under a gold-leaf highlight
  x.save();x.lineCap='round';x.lineJoin='round';
  for(let i=0;i<520;i++){
    const sx=8+R(i,1,810)*(W-16),sy=8+R(i,2,810)*(H-16),lv=mpGoldenErgField(sx,sy);if(lv<.5)continue;
    const pts=[];for(const dir of [1,-1]){let px=sx,py=sy;const seg=[];for(let k=0;k<50;k++){const e=.6,gxv=mpGoldenErgField(px+e,py)-mpGoldenErgField(px-e,py),gyv=mpGoldenErgField(px,py+e)-mpGoldenErgField(px,py-e),m=Math.hypot(gxv,gyv)||1;
        px+=-gyv/m*1.6*dir;py+=gxv/m*1.6*dir;if(px<6||py<6||px>W-6||py>H-6)break;if(Math.abs(mpGoldenErgField(px,py)-lv)>.08)break;seg.push([px,py])}
      if(dir>0)pts.push(...seg.reverse());else pts.push(...seg)}
    if(pts.length<10)continue;
    const path=(dx,dy)=>{x.beginPath();pts.forEach(([a,b],k)=>k?x.lineTo(X(a)+dx,Y(b)+dy):x.moveTo(X(a)+dx,Y(b)+dy))};
    path(.45,.55);x.strokeStyle=lv>.75?'rgba(120,70,22,.6)':'rgba(140,84,26,.35)';x.lineWidth=lv>.75?.75:.5;x.stroke();
    if(lv>.68){path(-.25,-.3);x.strokeStyle=R(i,3,810)<.5?'rgba(255,244,170,.97)':'rgba(255,232,130,.95)';x.lineWidth=.8;x.stroke()}
    if(R(i,4,810)<.4){path(-.5,-.6);x.strokeStyle='rgba(255,250,214,.7)';x.lineWidth=.35;x.stroke()}
  }
  x.restore();
  // ripples on the pale flanks, and gold-leaf flakes in the highlights
  x.save();x.lineCap='round';
  for(let i=0;i<2600;i++){const cx=4+R(i,1,820)*(W-8),cy=4+R(i,2,820)*(H-8),v=mpGoldenErgField(cx,cy);
    if(v>.5&&R(i,3,820)<.6){x.strokeStyle=R(i,4,820)<.5?'rgba(150,92,30,.5)':'rgba(176,118,40,.45)';x.lineWidth=.4;mpGoldenErgRipple(x,X(cx),Y(cy),1.1+R(i,5,820)*1.6)}}
  for(let i=0;i<1100;i++){const cx=4+R(i,1,830)*(W-8),cy=4+R(i,2,830)*(H-8);if(mpGoldenErgField(cx,cy)<.72)continue;const a=X(cx),b=Y(cy),r=R(i,3,830);
    if(r<.7){x.fillStyle=r<.35?MPL.GOLD2:'#fff0a8';x.beginPath();x.arc(a,b,.35+R(i,4,830)*.45,0,6.3);x.fill()}else mpGoldenErgFlake(x,a,b,.9+R(i,4,830)*.9)}
  x.restore();
  // the ring of mountains round the whole sea, in two uneven rows, with gold on the snow caps
  x.save();x.beginPath();x.rect(AR.x+1,AR.y+1,AR.w-2,AR.h-2);x.clip();
  const gate=(px,py)=>(px<30&&Math.abs(py-150)<12)||(py>H-30&&Math.abs(px-150)<12);
  const mt=[];const per=(gx1-gx0)*2+(gy1-gy0)*2;
  for(let i=0;i<130;i++){const p=(i+R(i,1,840)*.6)/130*4;let cx,cy;
    if(p<1){cx=p*W;cy=-2}else if(p<2){cx=W+2;cy=(p-1)*H}else if(p<3){cx=W-(p-2)*W;cy=H+2}else{cx=-2;cy=H-(p-3)*H}
    const out=3+R(i,2,840)*5;const dx=cx<0?-out:cx>W?out:0,dy=cy<0?-out:cy>H?out:0;if(gate(cx+dx*.3,cy+dy*.3)&&((cx<0&&Math.abs(cy-150)<12)||(cy>H&&Math.abs(cx-150)<12)))continue;
    mt.push([X(cx)+dx*S*.9+(R(i,3,840)-.5)*3,Y(cy)+dy*S*.9+(R(i,4,840)-.5)*3,.6+R(i,5,840)*.5,R(i,6,840)<.45])}
  mt.sort((p,q)=>p[1]-q[1]).forEach(([a,b,s,g])=>mpGoldenErgMount(x,a,b,s,g));
  x.restore();
  // an inked, wobbling shoreline of sand against the mountain wall
  x.save();x.strokeStyle='rgba(60,36,16,.75)';x.lineWidth=.9;x.beginPath();
  for(let k=0;k<=W;k+=3){const j=(R(k,1,850)-.5)*.8;k?x.lineTo(X(k),Y(0)+j):x.moveTo(X(k),Y(0)+j)}for(let k=0;k<=H;k+=3){x.lineTo(X(W)+(R(k,2,850)-.5)*.8,Y(k))}for(let k=W;k>=0;k-=3){x.lineTo(X(k),Y(H)+(R(k,3,850)-.5)*.8)}for(let k=H;k>=0;k-=3){x.lineTo(X(0)+(R(k,4,850)-.5)*.8,Y(k))}x.closePath();x.stroke();x.restore();
  // dead trees, shrubs, bones: a sample of the real scenery
  x.save();for(const s of L.scenery||[]){const r=R(s.wx,s.wy,860);if(r>.28)continue;const a=X(s.wx),b=Y(s.wy);
    if(/^dshrub/.test(s.k)){x.strokeStyle='rgba(96,96,44,.9)';x.lineWidth=.45;x.beginPath();x.moveTo(a-1.1,b);x.lineTo(a-.5,b-1.5);x.lineTo(a,b-.4);x.lineTo(a+.6,b-1.7);x.lineTo(a+1.1,b);x.stroke()}
    else if(s.k==='ddead'){x.strokeStyle='#4a3420';x.lineWidth=.5;x.beginPath();x.moveTo(a,b+.8);x.lineTo(a,b-1.8);x.moveTo(a,b-.6);x.lineTo(a-1.2,b-1.8);x.moveTo(a,b-1);x.lineTo(a+1.1,b-2.2);x.stroke()}
    else if(s.k==='dbones'){x.strokeStyle='#f4ecd8';x.lineWidth=.55;x.beginPath();x.moveTo(a-1.2,b);x.lineTo(a+1.2,b+.4);x.moveTo(a-.8,b-.7);x.lineTo(a+.8,b+1);x.stroke();x.strokeStyle='rgba(60,36,16,.5)';x.lineWidth=.2;x.stroke()}
    else if(/^dplant/.test(s.k)){x.fillStyle='#5a9a58';x.strokeStyle=MPGE_INK;x.lineWidth=.3;x.fillRect(a-.45,b-2.6,.9,3);x.strokeRect(a-.45,b-2.6,.9,3)}}
  x.restore();
  // loose rocks
  for(const d of L.decor)if(/^drock/.test(d.k))mpGoldenErgRock(x,X(d.x+.5),Y(d.y+.5),1+(d.sc||1)*.7);
  // the ruins: a ring of broken pillars round a chest or a heap of gold
  const rc=L.decor.filter(d=>d.k==='chest'||d.k==='treasure'),ruinsN=[];
  const pil=L.decor.filter(d=>/^dpillar/.test(d.k));
  for(const d of pil){const a=X(d.x+.5),b=Y(d.y+.5),h=R(d.x,d.y,870);x.save();x.fillStyle='#e6d6aa';x.strokeStyle=MPGE_INK;x.lineWidth=.45;
    if(h<.35){x.beginPath();x.moveTo(a-1.1,b+1);x.lineTo(a-1,b-2.6);x.lineTo(a-.3,b-1.9);x.lineTo(a+.3,b-3.1);x.lineTo(a+1,b-2.2);x.lineTo(a+1.1,b+1);x.closePath();x.fill();x.stroke()}
    else{x.fillRect(a-1,b-3.4,2,4.4);x.strokeRect(a-1,b-3.4,2,4.4);x.fillStyle=MPL.GOLD;x.fillRect(a-1.3,b-3.9,2.6,.9);x.strokeRect(a-1.3,b-3.9,2.6,.9)}x.restore()}
  rc.forEach((d,i)=>{const a=X(d.x+.5),b=Y(d.y+.5);x.save();x.fillStyle='rgba(120,70,22,.18)';x.beginPath();x.arc(a,b,S*3.6,0,6.3);x.fill();
    x.strokeStyle=MPL.VERM;x.lineWidth=1;x.beginPath();x.moveTo(a-1.7,b-1.7);x.lineTo(a+1.7,b+1.7);x.moveTo(a+1.7,b-1.7);x.lineTo(a-1.7,b+1.7);x.stroke();x.restore();ruinsN.push([d.x,d.y,d.k])});
  // obelisks beside two of the routes' bends
  for(const [cx,cy] of [[116,112],[184,150],[150,262],[30,150]]){mpGoldenErgObelisk(x,X(cx),Y(cy),.85)}
  // caravan routes: dotted ribbons from the west door through the three oases to the south door
  const O=GER.OASES,route=[[3,150],[30,128],[O[0][0]-6,O[0][1]+8],[110,58],[170,70],[O[1][0]-8,O[1][1]+6],[246,140],[206,196],[O[2][0]+8,O[2][1]-4],[146,262],[150,296]];
  const rpath=()=>{x.beginPath();x.moveTo(X(route[0][0]),Y(route[0][1]));for(let k=1;k<route.length-1;k++){const mx=(route[k][0]+route[k+1][0])/2,my=(route[k][1]+route[k+1][1])/2;x.quadraticCurveTo(X(route[k][0]),Y(route[k][1]),X(mx),Y(my))}x.lineTo(X(route[route.length-1][0]),Y(route[route.length-1][1]))};
  x.save();x.lineCap='round';x.lineJoin='round';rpath();x.strokeStyle='rgba(110,60,20,.4)';x.lineWidth=3.4;x.stroke();rpath();x.strokeStyle='rgba(255,236,170,.85)';x.lineWidth=2.5;x.stroke();rpath();x.strokeStyle=MPL.VERM;x.lineWidth=.8;x.setLineDash([1,2.2]);x.stroke();x.setLineDash([]);
  // a second, fainter track: across the north between the ruins and the east oasis, and one back down the east side
  const r2=[[O[0][0]+6,O[0][1]-6],[100,34],[190,40],[O[1][0]+2,O[1][1]-8]];x.beginPath();x.moveTo(X(r2[0][0]),Y(r2[0][1]));for(let k=1;k<r2.length-1;k++){const mx=(r2[k][0]+r2[k+1][0])/2,my=(r2[k][1]+r2[k+1][1])/2;x.quadraticCurveTo(X(r2[k][0]),Y(r2[k][1]),X(mx),Y(my))}x.lineTo(X(r2[3][0]),Y(r2[3][1]));x.strokeStyle='rgba(120,60,20,.7)';x.lineWidth=.8;x.setLineDash([.9,2.2]);x.stroke();x.setLineDash([]);x.restore();
  // oases: pool, reeds, palm grove (the real palms, then a few extra drawn small)
  for(const [ox,oy] of O){const a=X(ox+.5),b=Y(oy+.5);x.save();
    x.fillStyle='#78aed0';x.strokeStyle=MPGE_INK;x.lineWidth=.8;x.beginPath();x.ellipse(a,b,S*4.2,S*3.5,0,0,6.3);x.fill();x.stroke();
    x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.ellipse(a-S*.7,b-S*.6,S*1.5,S*.9,-.2,0,6.3);x.fill();
    x.strokeStyle='rgba(240,248,255,.8)';x.lineWidth=.4;mpGoldenErgRipple(x,a-1.2,b-.4,1.6);mpGoldenErgRipple(x,a+1,b+1,1.3);mpGoldenErgRipple(x,a+.4,b-1.2,1.1);
    x.strokeStyle='rgba(54,100,52,.95)';x.lineWidth=.5;for(let k=0;k<16;k++){const an=k/16*6.283,rr=S*(4.2+R(k,ox,880)*.6),ra=a+Math.cos(an)*rr,rb=b+Math.sin(an)*rr*.88;x.beginPath();x.moveTo(ra,rb+.6);x.lineTo(ra-.5,rb-1.3);x.moveTo(ra,rb+.6);x.lineTo(ra+.6,rb-1.5);x.stroke()}x.restore()}
  const palms=L.decor.filter(d=>/^dpalm/.test(d.k)).sort((p,q)=>p.y-q.y);for(const d of palms)mpGoldenErgPalm(x,X(d.x+.5),Y(d.y+.5)+1,.72*(d.sc||1));
  // camels on the road, and a little herd resting at the south oasis
  const cam=(cx,cy,fl)=>mpGoldenErgCamel(x,X(cx),Y(cy)+2,.8,fl);cam(30,129,false);cam(35,125,false);cam(40,122,false);cam(150,266,true);cam(154,271,true);cam(158,264,true);cam(O[2][0]-9,O[2][1]+9,false);cam(O[2][0]-5,O[2][1]+11,true);cam(204,98,false);cam(209,102,true);
  // the two doors: a low cave arch with a pair of small towers
  const door=(px,py,rot)=>{x.save();x.translate(X(px),Y(py));x.rotate(rot);MPLI.tower(x,0,-4,.5);MPLI.tower(x,0,5,.5);x.fillStyle='#1a1008';x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.beginPath();x.moveTo(-1.8,2.2);x.lineTo(-1.8,-1);x.quadraticCurveTo(0,-3.6,1.8,-1);x.lineTo(1.8,2.2);x.closePath();x.fill();x.stroke();x.restore()};
  door(3,150,0);door(150,297,Math.PI/2*0);
  // labels
  const T=(t,cx,cy,sz,col)=>api.text(x,t,X(cx),Y(cy),sz,col||'#3a2210');
  T('THE GOLDEN ERG',150,22,9,'#6a3a06');T('a sea of sand',150,32,5.8,'#7a4a12');
  T('Cave to the Blue Dunes',40,166,5.8,'#274a9a');T('Cave to the Violet Erg',150,282,5.8,'#5a2a8a');
  T('North West Oasis',O[0][0],O[0][1]-12,6.2,'#1e4a6a');T('East Oasis',O[1][0],O[1][1]-12,6.2,'#1e4a6a');T('South Oasis',O[2][0],O[2][1]-12,6.2,'#1e4a6a');
  T('The Caravan Road',92,100,6.4,'#8a1e10');T('The Great Dunes',190,170,7.4,'#7a4208');T('The Silent Sands',230,235,6.6,'#7a4208');T('The Western Reach',60,215,6.2,'#7a4208');
  rc.forEach((d,i)=>{if(i%2===0)T(i%4===0?'Old Ruin':'Ruined Ring',d.x,d.y+7.5,5.2,'#5a3a1c')});
  T('Obelisk',116,121,5,'#5a3a1c');
  // the low sun with gold-leaf rays, over the west mountains
  x.save();const sa=44,sb=244;const gg=x.createRadialGradient(sa,sb,2,sa,sb,30);gg.addColorStop(0,'rgba(255,236,150,.7)');gg.addColorStop(1,'rgba(255,236,150,0)');x.fillStyle=gg;x.beginPath();x.arc(sa,sb,30,0,6.3);x.fill();x.restore();
  x.save();x.strokeStyle=MPGE_INK;x.lineWidth=.5;for(let k=0;k<16;k++){const an=k*Math.PI/8,r=7;x.beginPath();x.moveTo(sa+Math.cos(an-.12)*r*1.15,sb+Math.sin(an-.12)*r*1.15);x.lineTo(sa+Math.cos(an)*r*(k%2?1.7:2.2),sb+Math.sin(an)*r*(k%2?1.7:2.2));x.lineTo(sa+Math.cos(an+.12)*r*1.15,sb+Math.sin(an+.12)*r*1.15);x.fillStyle=MPL.GOLD;x.fill();x.stroke()}
  x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(sa,sb,r7(),0,6.3);x.fill();x.stroke();x.restore();
  function r7(){return 7}
  // margin: title, compass, notes, key
  api.title(x,'Golden Erg','level 61');api.compass(x,432,54,10);
  api.notes(x,['A huge sea of gold sand, ringed by mountains. You come in through a low cave in the west wall.','Three oases have a pool, palms, dates and water. Plan the walk from one to the next.','Rings of old pillars are ruins. Each hides a chest or a heap of gold.','A cave in the south wall leads on to the Violet Erg.'],8,64,78,6.1,4);
  const key=[['Caravan road',(g,a,b)=>{g.fillStyle='#f4e4ae';g.fillRect(a-6,b-1.5,12,3);g.strokeStyle=MPL.VERM;g.lineWidth=.7;g.setLineDash([1,2]);g.beginPath();g.moveTo(a-6,b);g.lineTo(a+6,b);g.stroke();g.setLineDash([])}],
    ['Oasis',(g,a,b)=>{g.fillStyle='#78aed0';g.strokeStyle=MPGE_INK;g.lineWidth=.6;g.beginPath();g.ellipse(a,b,4,2.8,0,0,6.3);g.fill();g.stroke()}],['Palm',(g,a,b)=>mpGoldenErgPalm(g,a,b+2,.9)],['Ruin chest',(g,a,b)=>{g.strokeStyle=MPL.VERM;g.lineWidth=1.1;g.beginPath();g.moveTo(a-2,b-2);g.lineTo(a+2,b+2);g.moveTo(a+2,b-2);g.lineTo(a-2,b+2);g.stroke()}],
    ['Obelisk',(g,a,b)=>mpGoldenErgObelisk(g,a,b+1,.9)],['Mountains',(g,a,b)=>mpGoldenErgMount(g,a,b+3,.55,true)],['Bones',(g,a,b)=>{g.strokeStyle='#f4ecd8';g.lineWidth=1;g.beginPath();g.moveTo(a-3,b);g.lineTo(a+3,b+1);g.moveTo(a-2,b-2);g.lineTo(a+2,b+2);g.stroke()}]];
  api.panel(x,392,78,84,key.length*13+16);api.text(x,'KEY',398,88,7.5,'#5a3a1c','left');key.forEach((k,i)=>{const yy=101+i*13;k[1](x,402,yy);api.text(x,k[0],412,yy,5.8,'#3a2a1c','left')})}

mplInstall({name:'goldenerg',levels:[61],fit:mpGoldenErgFit,foot:'You are the yellow arrow.',draw(c,x,L,api){mpGoldenErgDraw(x,L,api)}});
