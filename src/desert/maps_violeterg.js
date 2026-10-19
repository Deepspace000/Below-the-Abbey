/* ==========================================================================
   AREA MAP for the Violet Erg (level 62): a purple desert of great dunes, ringed by mountains, with three oases, rings of old ruins, crystal outcrops and a burnt ring in the south.
   The dunes are shaded from the real terrain heights (terrFor). See maps_common.js.
   ========================================================================== */
const MPVE_INK='#2a1a0c';
function mpVioletErgMix(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}
function mpVioletErgNoise(x,y,sc,k){const fx=x/sc,fy=y/sc,x0=Math.floor(fx),y0=Math.floor(fy),u=fx-x0,v=fy-y0,su=u*u*(3-2*u),sv=v*v*(3-2*v),R=hash2;
  return (R(x0,y0,k)*(1-su)+R(x0+1,y0,k)*su)*(1-sv)+(R(x0,y0+1,k)*(1-su)+R(x0+1,y0+1,k)*su)*sv}
/* the shaded ground as a 300 x 300 picture, one pixel per cell */
function mpVioletErgGround(L){
  const W=L.rows[0].length,H=L.rows.length,tb=terrFor(62),c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),id=g.createImageData(W,H),D=id.data;
  const hh=(x,y)=>tb.h[Math.max(0,Math.min(H-1,y))*W+Math.max(0,Math.min(W-1,x))];
  const SC={x:VER.CX,y:262};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x,h=tb.h[i],hi=Math.min(1,h/3.2);
    const sl=(hh(x-1,y-1)-hh(x+1,y+1))*1.5+(hh(x-1,y)-hh(x+1,y))*.5;          // light from the north west
    let col=mpVioletErgMix([176,130,226],[232,200,248],hi);                    // lilac valleys, pale crests
    const wash=mpVioletErgNoise(x,y,34,3),wash2=mpVioletErgNoise(x,y,16,4);
    col=mpVioletErgMix(col,[240,160,200],Math.max(0,wash-.45)*1.4);              // rose washes
    col=mpVioletErgMix(col,[150,112,206],Math.max(0,.45-wash2)*.9);             // amethyst washes
    const k=Math.max(-1,Math.min(1,sl*.8));
    col=k>0?mpVioletErgMix(col,[252,238,250],k*.6):mpVioletErgMix(col,[84,50,146],-k*.85);
    // the mountains round the rim
    if(tb.block[i]||h>4.2){const m=Math.min(1,(h-3)/5);col=mpVioletErgMix(col,[118,96,150],.35+m*.4);col=mpVioletErgMix(col,k>0?[214,200,232]:[66,48,102],Math.abs(k)*.5)}
    // scorched ground in the south, round the burnt ring
    const dd=Math.hypot(x-SC.x,(y-SC.y)*1.05)+(mpVioletErgNoise(x,y,9,5)-.5)*16;
    if(dd<66){const t=Math.max(0,Math.min(1,(66-dd)/26));col=mpVioletErgMix(col,[118,84,96],t*.78);if(dd<36)col=mpVioletErgMix(col,[62,44,54],Math.min(1,(36-dd)/20)*.8);if(dd<14)col=mpVioletErgMix(col,[150,52,32],Math.min(1,(14-dd)/14)*.45)}
    const n=(hash2(x,y,6)-.5)*9,o=i*4;D[o]=col[0]+n;D[o+1]=col[1]+n;D[o+2]=col[2]+n*.8;D[o+3]=255}
  g.putImageData(id,0,0);return c}
/* an amethyst crystal outcrop: a few pointed prisms with a pale face */
function mpVioletErgCrystal(x,a,b,s,seed){x.save();x.lineJoin='round';x.strokeStyle=MPVE_INK;x.lineWidth=.45;
  const n=2+(seed%3);for(let k=0;k<n;k++){const dx=(k-(n-1)/2)*1.5*s,h=(3+((seed*7+k*3)%4)*1.3)*s,w=.95*s,lean=((k%2)?.5:-.5)*s;
    x.fillStyle=['#8a5ac8','#a87adc','#7048b0','#b890e4'][(seed+k)%4];x.beginPath();x.moveTo(a+dx-w,b);x.lineTo(a+dx-w*.8+lean,b-h*.8);x.lineTo(a+dx+lean,b-h);x.lineTo(a+dx+w*.8+lean,b-h*.8);x.lineTo(a+dx+w,b);x.closePath();x.fill();x.stroke();
    x.fillStyle='rgba(248,236,255,.8)';x.beginPath();x.moveTo(a+dx-w*.4,b-.3*s);x.lineTo(a+dx-w*.5+lean*.9,b-h*.75);x.lineTo(a+dx+lean,b-h*.95);x.lineTo(a+dx-w*.05,b-.3*s);x.closePath();x.fill()}
  x.restore()}
function mpVioletErgStone(x,a,b,s){x.save();x.fillStyle='#d8cce6';x.strokeStyle=MPVE_INK;x.lineWidth=.45;x.beginPath();x.moveTo(a-.8*s,b+.8);x.lineTo(a-.7*s,b-2.6*s);x.lineTo(a-.1*s,b-3.4*s);x.lineTo(a+.7*s,b-2.4*s);x.lineTo(a+.8*s,b+.8);x.closePath();x.fill();x.stroke();x.restore()}
function mpVioletErgRipple(x,a,b,w){x.beginPath();x.moveTo(a-w,b);x.quadraticCurveTo(a-w/2,b-1.3,a,b);x.quadraticCurveTo(a+w/2,b+1.3,a+w,b);x.stroke()}
function mpVioletErgPalm(x,a,b,s){x.save();x.strokeStyle='#4a3a30';x.lineWidth=.9*s;x.beginPath();x.moveTo(a,b+1.5*s);x.quadraticCurveTo(a+1*s,b-2*s,a+.4*s,b-4.6*s);x.stroke();
  x.strokeStyle=MPVE_INK;x.fillStyle='#3a8a6a';x.lineWidth=.4;const tx=a+.4*s,ty=b-4.6*s;
  for(let k=0;k<6;k++){const an=-Math.PI/2+(k-2.5)*.62,dx=Math.cos(an),dy=Math.sin(an);x.beginPath();x.moveTo(tx,ty);x.quadraticCurveTo(tx+dx*2.6*s,ty+dy*2.6*s-.6*s,tx+dx*4*s,ty+dy*3*s+1.6*s);x.quadraticCurveTo(tx+dx*2.4*s,ty+dy*2*s+.4*s,tx,ty);x.fill();x.stroke()}x.restore()}
function mpVioletErgPeak(x,a,b,s,seed){x.save();x.lineJoin='round';x.strokeStyle=MPVE_INK;x.lineWidth=.6;const w=(6+(seed%3))*s,h=(8+(seed%4)*1.6)*s;
  x.fillStyle='#8c78ac';x.beginPath();x.moveTo(a-w,b);x.lineTo(a-w*.2,b-h);x.lineTo(a+w*.15,b-h*.7);x.lineTo(a+w*.45,b-h*.85);x.lineTo(a+w,b);x.closePath();x.fill();x.stroke();
  x.fillStyle='rgba(50,34,90,.55)';x.beginPath();x.moveTo(a-w*.2,b-h);x.lineTo(a+w*.15,b-h*.7);x.lineTo(a+w*.45,b-h*.85);x.lineTo(a+w,b);x.lineTo(a+w*.2,b);x.closePath();x.fill();
  x.fillStyle='#f6efff';x.beginPath();x.moveTo(a-w*.5,b-h*.62);x.lineTo(a-w*.2,b-h);x.lineTo(a+w*.1,b-h*.74);x.lineTo(a-w*.1,b-h*.66);x.lineTo(a-w*.25,b-h*.74);x.closePath();x.fill();
  x.strokeStyle='rgba(42,26,70,.55)';x.lineWidth=.4;x.beginPath();x.moveTo(a-w*.35,b-h*.3);x.lineTo(a-w*.2,b-h*.6);x.moveTo(a+w*.3,b-h*.2);x.lineTo(a+w*.3,b-h*.6);x.stroke();x.restore()}
function mpVioletErgEntry(x,kind,a,b,s){x.save();x.strokeStyle=MPVE_INK;x.lineWidth=.6;s=s||1;
  if(kind==='dcryptL'||kind==='dcryptS'){const z=kind==='dcryptL'?1.25:.85;x.fillStyle='#d0c6dc';x.fillRect(a-4*z*s,b-3*z*s,8*z*s,6*z*s);x.strokeRect(a-4*z*s,b-3*z*s,8*z*s,6*z*s);x.fillStyle='#8a7aa8';x.beginPath();x.moveTo(a-5*z*s,b-3*z*s);x.lineTo(a,b-7*z*s);x.lineTo(a+5*z*s,b-3*z*s);x.closePath();x.fill();x.stroke();x.fillStyle='#1a1008';x.fillRect(a-1*z*s,b-.4*z*s,2*z*s,3.4*z*s);MPLI.cross(x,a,b-9*z*s,.55*s)}
  else if(kind==='dspire'){x.fillStyle='#d8cce6';x.beginPath();x.moveTo(a-2.6*s,b+2);x.lineTo(a-1.6*s,b-9*s);x.lineTo(a,b-13*s);x.lineTo(a+1.6*s,b-9*s);x.lineTo(a+2.6*s,b+2);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.moveTo(a-1.6*s,b-9*s);x.lineTo(a,b-13*s);x.lineTo(a+1.6*s,b-9*s);x.fill();x.fillStyle='#1a1008';x.fillRect(a-.6*s,b-3*s,1.2*s,3*s)}
  else if(kind==='druinstairs'){x.fillStyle='#d0c6dc';for(let k=0;k<4;k++){x.fillRect(a-5*s+k*.4,b-k*1.6*s,10*s-k*.8,1.6*s);x.strokeRect(a-5*s+k*.4,b-k*1.6*s,10*s-k*.8,1.6*s)}x.fillStyle='#d8cce6';x.fillRect(a-5.4*s,b-9*s,1.6*s,9*s);x.strokeRect(a-5.4*s,b-9*s,1.6*s,9*s);x.fillRect(a+3.8*s,b-6*s,1.6*s,6*s);x.strokeRect(a+3.8*s,b-6*s,1.6*s,6*s)}
  else if(kind==='dstairs'){x.fillStyle='#1a1008';x.fillRect(a-4*s,b-2.6*s,8*s,5.2*s);x.strokeRect(a-4*s,b-2.6*s,8*s,5.2*s);x.strokeStyle='#d8cce6';x.lineWidth=.7;for(let k=0;k<3;k++){x.beginPath();x.moveTo(a-3*s+k*.8,b-1.6*s+k*1.2*s);x.lineTo(a+3*s-k*.8,b-1.6*s+k*1.2*s);x.stroke()}}
  else if(kind==='dhatch'){x.fillStyle='#8a6a4a';x.beginPath();x.ellipse(a,b,4.4*s,2.6*s,0,0,6.3);x.fill();x.stroke();x.strokeStyle='#d8b878';x.lineWidth=.5;x.beginPath();x.moveTo(a-3*s,b);x.lineTo(a+3*s,b);x.moveTo(a,b-1.8*s);x.lineTo(a,b+1.8*s);x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a+2*s,b,.6*s,0,6.3);x.fill()}
  else if(kind==='dtreehole'){x.strokeStyle=MPVE_INK;x.fillStyle='#6a5a7a';x.beginPath();x.moveTo(a-1.8*s,b+2);x.quadraticCurveTo(a-1.6*s,b-3*s,a-4*s,b-5*s);x.lineTo(a+4*s,b-5*s);x.quadraticCurveTo(a+1.6*s,b-3*s,a+1.8*s,b+2);x.closePath();x.fill();x.stroke();x.fillStyle='#8a5ac8';for(const [dx,dy,r] of [[-3.4,-8,3],[0,-10,3.4],[3.4,-8,3]]){x.beginPath();x.arc(a+dx*s,b+dy*s*.9,r*s,0,6.3);x.fill();x.stroke()}x.fillStyle='#1a1008';x.beginPath();x.ellipse(a,b-1.2*s,.9*s,1.6*s,0,0,6.3);x.fill()}
  else if(kind==='dburrow'){x.fillStyle='#d8c0e0';x.beginPath();x.moveTo(a-4.4*s,b+1.6);x.quadraticCurveTo(a-3.2*s,b-5.4*s,a,b-5.4*s);x.quadraticCurveTo(a+3.2*s,b-5.4*s,a+4.4*s,b+1.6);x.closePath();x.fill();x.stroke();x.fillStyle='#1a1008';x.beginPath();x.moveTo(a-1.3*s,b+1.6);x.quadraticCurveTo(a-1.3*s,b-2*s,a,b-2*s);x.quadraticCurveTo(a+1.3*s,b-2*s,a+1.3*s,b+1.6);x.fill()}
  x.restore()}
function mpVioletErgShrine(x,a,b,s){x.save();x.strokeStyle=MPVE_INK;x.lineWidth=.6;x.fillStyle='#e6dcf0';x.fillRect(a-4.4*s,b-1*s,1.8*s,4*s);x.strokeRect(a-4.4*s,b-1*s,1.8*s,4*s);x.fillRect(a+2.6*s,b-1*s,1.8*s,4*s);x.strokeRect(a+2.6*s,b-1*s,1.8*s,4*s);
  x.beginPath();x.moveTo(a-4.4*s,b-1*s);x.quadraticCurveTo(a-4.4*s,b-6*s,a,b-6*s);x.quadraticCurveTo(a+4.4*s,b-6*s,a+4.4*s,b-1*s);x.lineTo(a+2.6*s,b-1*s);x.quadraticCurveTo(a+2.6*s,b-3.6*s,a,b-3.6*s);x.quadraticCurveTo(a-2.6*s,b-3.6*s,a-2.6*s,b-1*s);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a,b-4.8*s,.7*s,0,6.3);x.fill();x.strokeStyle='#3a7a5a';x.lineWidth=.6;for(const dx of [-5.6,5.6]){x.beginPath();x.moveTo(a+dx*s,b+3*s);x.lineTo(a+(dx-.8)*s,b+.4*s);x.moveTo(a+dx*s,b+3*s);x.lineTo(a+(dx+.8)*s,b+.6*s);x.stroke()}x.restore()}
function mpVioletErgMap(x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=api.fit(W,H),S=f.s,X=f.X,Y=f.Y,R=hash2,tb=terrFor(62),ar=MPL.AREA;
  // the ground, shaded from the real dune heights
  x.save();x.beginPath();x.rect(ar.x,ar.y,ar.w,ar.h);x.clip();x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
  x.fillStyle='rgba(176,150,206,.35)';x.fillRect(ar.x,ar.y,ar.w,ar.h);
  x.globalAlpha=.97;x.drawImage(mpVioletErgGround(L),X(0),Y(0),W*S,H*S);x.globalAlpha=1;
  // silver ripple hatching along the dunes, thicker on the shaded faces, and scorch cracks in the south
  x.lineCap='round';
  for(let cy=4;cy<H-4;cy+=2)for(let cx=4;cx<W-4;cx+=2){const i=cy*W+cx,r=R(cx,cy,60);if(r>.24||tb.block[i])continue;
    const a=X(cx)+R(cx,cy,61)*S*2,b=Y(cy)+R(cx,cy,62)*S*2,sl=tb.h[i-W-1]-tb.h[i+W+1];
    if(Math.hypot(cx-150,cy-262)<48){x.strokeStyle='rgba(40,24,34,.5)';x.lineWidth=.45;x.beginPath();x.moveTo(a,b);x.lineTo(a+(R(cx,cy,63)-.5)*5,b+1+R(cx,cy,64)*2.4);x.lineTo(a+(R(cx,cy,65)-.5)*7,b+3+R(cx,cy,66)*2);x.stroke();continue}
    x.strokeStyle=sl>0?'rgba(255,255,255,.75)':'rgba(240,244,255,.62)';x.lineWidth=.5;mpVioletErgRipple(x,a,b,2+R(cx,cy,67)*2.6);
    if(sl<-.15){x.strokeStyle='rgba(86,56,142,.55)';mpVioletErgRipple(x,a+1.2,b+1.7,1.8+R(cx,cy,68)*2)}}
  // pale hatching on the shaded flank of each dune crest
  x.strokeStyle='rgba(72,44,120,.4)';x.lineWidth=.4;
  for(let cy=6;cy<H-6;cy+=3)for(let cx=6;cx<W-6;cx+=3){const i=cy*W+cx;if(tb.block[i]||R(cx,cy,69)>.5)continue;const sl=tb.h[i-1-W]-tb.h[i+1+W];if(sl<-.3){const a=X(cx),b=Y(cy);x.beginPath();x.moveTo(a,b);x.lineTo(a+S*1.6,b+S*1.2);x.moveTo(a+S*.5,b-S*.4);x.lineTo(a+S*2,b+S*.6);x.stroke()}}
  // mountains round the rim, as rows of peaks
  {const pk=[];for(let cy=2;cy<H;cy+=5)for(let cx=2;cx<W;cx+=5){const px=cx+((R(cx,cy,70)-.5)*5)|0,py=cy+((R(cx,cy,71)-.5)*5)|0;if(px<1||py<1||px>=W-1||py>=H-1)continue;
      const dw=Math.min(px,py,W-1-px,H-1-py);if(dw>12||(dw>7&&R(px,py,72)<.55))continue;if(Math.abs(px-150)<9&&py<20)continue;if(px>W-22&&Math.abs(py-150)<9)continue;if(py>H-22&&Math.abs(px-150)<9)continue;pk.push([px,py])}
    pk.sort((p,q)=>p[1]-q[1]);for(const [px,py] of pk)mpVioletErgPeak(x,X(px+.5),Y(py+.5)+3,.62+R(px,py,73)*.25,(px*3+py)|0)}
  // the dune crests, inked lightly
  x.restore();
  // oases: a pool among reeds and palms
  const oasis=[['Amethyst Spring',VER.OASES[0]],['Lilac Pool',VER.OASES[1]],['The North Spring',VER.OASES[2]]];
  for(const [,[ox,oy]] of oasis){const a=X(ox+.5),b=Y(oy+.5);x.save();x.fillStyle='#6aa8c8';x.strokeStyle=MPVE_INK;x.lineWidth=.7;
    x.fillStyle='rgba(120,176,140,.55)';x.beginPath();x.ellipse(a,b,10,7.4,0,0,6.3);x.fill();
    x.fillStyle='#78b4d4';x.beginPath();x.ellipse(a,b,5.4,3.8,0,0,6.3);x.fill();x.stroke();x.strokeStyle='rgba(244,250,255,.85)';x.lineWidth=.45;mpVioletErgRipple(x,a-.6,b-.9,2.2);mpVioletErgRipple(x,a+1,b+.9,1.7);
    x.strokeStyle='#3a8a5a';x.lineWidth=.5;for(let k=0;k<12;k++){const an=k/12*6.3,rx=Math.cos(an)*(7+R(k,ox,74)*1.6),ry=Math.sin(an)*(5+R(k,oy,75)*1.2);x.beginPath();x.moveTo(a+rx,b+ry);x.lineTo(a+rx-.4,b+ry-2.2);x.moveTo(a+rx,b+ry);x.lineTo(a+rx+.6,b+ry-1.8);x.stroke()}
    x.restore();for(const [dx,dy] of [[-9,-3],[8,-4],[-6,5],[9,4],[0,-8]])mpVioletErgPalm(x,a+dx,b+dy,.85)}
  // the objects the level really has
  const dec=L.decor.slice().sort((p,q)=>p.y-q.y),seenE=new Set(),ruins=[];
  for(const d of dec){const k=d.k,a=X(d.x+.5),b=Y(d.y+.5),sc=d.sc||1;
    if(/^drock/.test(k)){if(R(d.x,d.y,77)<.45)mpVioletErgCrystal(x,a,b+1,.6+sc*.3,(d.x*5+d.y)|0)}
    else if(/^dpillar/.test(k))mpVioletErgStone(x,a,b,.7+(k==='dpillar1'?.12:0));
    else if(k==='dbones')MPLI.skull(x,a,b+1,.45);
    else if(k==='chest'||k==='treasure')ruins.push(d)}
  // the burnt ring in the south: a charred circle and the broken pillars (drawn above), open to the north
  {const a=X(VER.CX+.5),b=Y(262.5);x.save();x.strokeStyle='rgba(40,20,20,.6)';x.lineWidth=.6;x.setLineDash([1.4,1.8]);x.beginPath();x.arc(a,b,S*13,0,6.3);x.stroke();x.setLineDash([]);
    x.fillStyle='rgba(30,16,20,.28)';for(let k=0;k<26;k++){const an=R(k,1,76)*6.3,r=R(k,2,76)*S*10;x.beginPath();x.ellipse(a+Math.cos(an)*r,b+Math.sin(an)*r,1+R(k,3,76)*2.4,.7+R(k,4,76)*1.3,R(k,5,76)*3,0,6.3);x.fill()}x.restore()}
  // old ruin rings: a dashed ring and a small gold mark where each stood
  ruins.forEach((d,n)=>{const a=X(d.x+.5),b=Y(d.y+.5);x.save();x.setLineDash([1.2,1.8]);x.strokeStyle='rgba(58,36,84,.55)';x.lineWidth=.5;x.beginPath();x.arc(a,b,S*4,0,6.3);x.stroke();x.setLineDash([]);x.restore()});
  // doors and entrances
  const NM={dcryptL:'Large Crypt',dcryptS:'Small Crypt',dspire:'Small Spire',druinstairs:'Ruin Stairs',dstairs:'Stairs Down',dhatch:'Hatch',dtreehole:'Hollow Tree',dburrow:'Tunnel to the Sea'};
  const ent=L.decor.filter(d=>d.enter&&NM[d.k]&&d.k!=='dburrow');ent.push({k:'dburrow',x:KH_SEA_MOUTH.x,y:KH_SEA_MOUTH.y});
  for(const d of ent){const a=X(d.x+.5),b=Y(d.y+.5);x.save();x.fillStyle='rgba(246,236,200,.55)';x.beginPath();x.ellipse(a,b+1,7,5,0,0,6.3);x.fill();x.restore();mpVioletErgEntry(x,d.k,a,b,.95)}
  // the shrine, where the level puts it
  const shr=L.decor.find(d=>d.npc==='shr_violet');if(shr){const a=X(shr.x+.5),b=Y(shr.y+.5);x.save();x.fillStyle='rgba(246,236,200,.55)';x.beginPath();x.ellipse(a,b,10,7,0,0,6.3);x.fill();x.restore();mpVioletErgShrine(x,a,b,1.5)}
  // the cave in from the Golden Erg, at the top, and the tracks of a pilgrim's way are not drawn: nothing is marked that the level does not hold
  {const a=X(VER.CX+.5),b=Y(1.6);x.save();x.fillStyle='#1a1008';x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.moveTo(a-4.6,b+3);x.lineTo(a-4.6,b-.6);x.quadraticCurveTo(a,b-6.6,a+4.6,b-.6);x.lineTo(a+4.6,b+3);x.closePath();x.fill();x.stroke();x.restore()}
  // labels
  const T=(t,cx,cy,sz,col)=>api.text(x,t,X(cx),Y(cy),sz||6.2,col||'#2e1c4a');
  T('Cave to the Golden Erg',VER.CX,14,6.2,'#4a2a10');
  oasis.forEach(([n,[ox,oy]])=>T(n,ox,oy+13,6,'#1a4a6a'));
  for(const d of ent)T(NM[d.k],d.x+.5,d.y+(d.k==='dspire'?7:8),5.6,d.k==='dburrow'?'#1a4a6a':'#3a2060');
  if(shr)T('Violet Shrine',shr.x+.5,shr.y+11,5.8,'#3a2060');
  T('The Burnt Ring',VER.CX,262-18,6.6,'#5a1a10');T('Scorched Ground',VER.CX+34,262+24,6,'#4a2a2a');
  T('THE VIOLET ERG',228,48,8,'#4a2a8a');T('Amethyst Dunes',90,112,6.6,'#4a2a8a');T('The Silver Ripples',215,120,6,'#4a2a8a');
  T('Crystal Fields',250,40,6.2,'#5a2a8a');T('The Violet Sea of Sand',160,185,6.4,'#4a2a8a');
  T('Northern Mountains',150,5,5.8,'#4a3a6a');T('Southern Mountains',70,293,5.8,'#4a3a6a');T('Eastern Mountains',270,70,5.4,'#4a3a6a');T('Western Mountains',16,200,5.4,'#4a3a6a');
  // ruin names: a few
  ruins.forEach((d,n)=>{if(n%2===0&&!ent.some(e=>Math.hypot(e.x-d.x,e.y-d.y)<26)&&!(shr&&Math.hypot(shr.x-d.x,shr.y-d.y)<26))T('Old Ruin',d.x+.5,d.y+7,5.2,'#4a3a5a')});
  // flourish: a sun disc on the margin corner of the picture
  x.save();x.strokeStyle=MPVE_INK;x.lineWidth=.5;x.fillStyle=MPL.GOLD2;for(let k=0;k<12;k++){const an=k*Math.PI/6;x.beginPath();x.moveTo(40+Math.cos(an-.14)*10,282+Math.sin(an-.14)*10);x.lineTo(40+Math.cos(an)*15,282+Math.sin(an)*15);x.lineTo(40+Math.cos(an+.14)*10,282+Math.sin(an+.14)*10);x.fillStyle=MPL.GOLD;x.fill();x.stroke()}x.fillStyle='#e8d0f4';x.beginPath();x.arc(40,282,8,0,6.3);x.fill();x.stroke();x.restore();
  // the frame line round the land
  x.save();x.strokeStyle=MPVE_INK;x.lineWidth=1.1;x.strokeRect(X(0),Y(0),W*S,H*S);x.restore();
  // margins
  api.title(x,'Violet Erg','level 62, a purple desert');api.compass(x,432,54,10);
  api.notes(x,['Great violet dunes roll on every side, and mountains close the whole desert in.','Three oases hold the only water. Rings of old standing stones hide chests.','Crystal outcrops stand in the sand like purple glass.','In the far south the sand is scorched black round a ring of broken pillars.','The way in is a low cave in the north. A tunnel in the east wall leads to the sea.'],8,64,78,6.1,4);
  const key=[['Dune crest',(g,a,b)=>{g.strokeStyle='rgba(120,92,170,.9)';g.lineWidth=.6;mpVioletErgRipple(g,a,b-1,4);g.strokeStyle='rgba(255,255,255,.9)';mpVioletErgRipple(g,a,b+1.6,4)}],['Crystals',(g,a,b)=>mpVioletErgCrystal(g,a,b+2,.6,2)],['Standing stone',(g,a,b)=>mpVioletErgStone(g,a,b+2,.8)],['Oasis',(g,a,b)=>{g.fillStyle='#78b4d4';g.strokeStyle=MPVE_INK;g.lineWidth=.6;g.beginPath();g.ellipse(a,b,4.4,2.8,0,0,6.3);g.fill();g.stroke()}],['Mountain',(g,a,b)=>mpVioletErgPeak(g,a,b+2,.5,2)],['Entrance',(g,a,b)=>mpVioletErgEntry(g,'dcryptS',a,b+2,.7)],['Shrine',(g,a,b)=>mpVioletErgShrine(g,a,b+1,.7)],['Scorched sand',(g,a,b)=>{g.fillStyle='#5a3e4c';g.fillRect(a-5,b-2.4,10,4.8);g.strokeStyle=MPVE_INK;g.lineWidth=.5;g.strokeRect(a-5,b-2.4,10,4.8)}]];
  const h=key.length*13+16;api.panel(x,392,78,84,h);api.text(x,'KEY',398,88,7.5,'#5a3a1c','left');key.forEach((k,i)=>{const yy=101+i*13;k[1](x,402,yy);api.text(x,k[0],412,yy,5.8,'#3a2a1c','left')})}
mplInstall({name:'violeterg',levels:[62],foot:'You are the yellow arrow.',draw(c,x,L,api){mpVioletErgMap(x,L,api)}});
