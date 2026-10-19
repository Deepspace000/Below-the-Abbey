/* ==========================================================================
   AREA MAPS for the Sand Road (41), the Tomb of Sut (42) and the Red Dunes (43). Hand-drawn parchment maps built from the real level data. See maps_common.js.
   ========================================================================== */
const MPD_INK='#2a1a0c';
function mpDesertLerpCol(stops,t){let i=0;while(i<stops.length-2&&t>stops[i+1][0])i++;const [t0,a]=stops[i],[t1,b]=stops[i+1],u=Math.max(0,Math.min(1,(t-t0)/(t1-t0)));return [a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u]}
function mpDesertPalm(x,a,b,s){s=s||1;x.save();x.strokeStyle='#5a3a1c';x.lineWidth=.9*s;x.beginPath();x.moveTo(a,b+1.5*s);x.quadraticCurveTo(a+1*s,b-2*s,a+.4*s,b-4.6*s);x.stroke();
  x.strokeStyle=MPD_INK;x.fillStyle='#3f8a4c';x.lineWidth=.4;const tx=a+.4*s,ty=b-4.6*s;
  for(let k=0;k<6;k++){const an=-Math.PI/2+(k-2.5)*.62,dx=Math.cos(an),dy=Math.sin(an);x.beginPath();x.moveTo(tx,ty);x.quadraticCurveTo(tx+dx*2.6*s,ty+dy*2.6*s-.6*s,tx+dx*4*s,ty+dy*3*s+1.6*s);x.quadraticCurveTo(tx+dx*2.4*s,ty+dy*2*s+.4*s,tx,ty);x.fill();x.stroke()}x.restore()}
function mpDesertCamel(x,a,b,s,flip){s=s||1;x.save();x.translate(a,b);x.scale(flip?-s:s,s);x.fillStyle='#b88c50';x.strokeStyle=MPD_INK;x.lineWidth=.55;
  x.beginPath();x.moveTo(-2.4,-3);x.quadraticCurveTo(-2,-5.2,-1,-3.8);x.quadraticCurveTo(0,-5.6,1,-3.6);x.quadraticCurveTo(2.2,-3.4,2.6,-4);x.quadraticCurveTo(3.6,-6.6,4.6,-6.8);x.lineTo(5.6,-6.4);x.lineTo(5.2,-5.6);x.lineTo(4.2,-5.6);x.quadraticCurveTo(3.4,-3.8,2.8,-2.2);x.lineTo(2.4,0);x.lineTo(1.7,0);x.lineTo(1.6,-1.8);x.lineTo(-1.4,-1.8);x.lineTo(-1.5,0);x.lineTo(-2.2,0);x.lineTo(-2.4,-2);x.lineTo(-3.3,-.6);x.lineTo(-3.5,-2.6);x.closePath();x.fill();x.stroke();x.restore()}
function mpDesertDune(x,a,b,w,light,shade){x.save();x.fillStyle=light;x.strokeStyle='rgba(80,44,18,.75)';x.lineWidth=.55;x.beginPath();x.moveTo(a-w,b+w*.32);x.quadraticCurveTo(a-w*.5,b-w*.55,a-w*.05,b-w*.5);x.quadraticCurveTo(a+w*.5,b-w*.3,a+w,b+w*.32);x.quadraticCurveTo(a,b+w*.5,a-w,b+w*.32);x.closePath();x.fill();x.stroke();
  x.fillStyle=shade;x.beginPath();x.moveTo(a-w*.05,b-w*.5);x.quadraticCurveTo(a+w*.5,b-w*.3,a+w,b+w*.32);x.quadraticCurveTo(a+w*.4,b+w*.42,a+w*.1,b+w*.3);x.quadraticCurveTo(a+w*.15,b-w*.1,a-w*.05,b-w*.5);x.fill();
  x.strokeStyle='rgba(90,48,20,.5)';x.lineWidth=.4;for(let k=1;k<=3;k++){x.beginPath();x.moveTo(a+w*(.1+k*.2),b+w*.32-k*.4);x.lineTo(a+w*(.25+k*.2),b-w*.05+k*.3);x.stroke()}x.restore()}
function mpDesertRock(x,a,b,w,fill){x.save();x.fillStyle=fill;x.strokeStyle=MPD_INK;x.lineWidth=.55;x.beginPath();x.moveTo(a-w,b+w*.5);x.lineTo(a-w*.7,b-w*.2);x.lineTo(a-w*.2,b-w*.8);x.lineTo(a+w*.4,b-w*.6);x.lineTo(a+w*.9,b+w*.1);x.lineTo(a+w,b+w*.5);x.closePath();x.fill();x.stroke();
  x.strokeStyle='rgba(42,26,12,.6)';x.lineWidth=.4;x.beginPath();x.moveTo(a+w*.1,b-w*.5);x.lineTo(a+w*.2,b+w*.45);x.moveTo(a+w*.4,b-w*.3);x.lineTo(a+w*.55,b+w*.4);x.stroke();x.restore()}
function mpDesertObelisk(x,a,b,s){s=s||1;x.save();x.fillStyle='#d8c9a2';x.strokeStyle=MPD_INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-1*s,b+1);x.lineTo(a-.8*s,b-5*s);x.lineTo(a,b-6.6*s);x.lineTo(a+.8*s,b-5*s);x.lineTo(a+1*s,b+1);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.moveTo(a-.8*s,b-5*s);x.lineTo(a,b-6.6*s);x.lineTo(a+.8*s,b-5*s);x.fill();x.restore()}
function mpDesertSphinx(x,a,b,s,flip){s=s||1;x.save();x.translate(a,b);x.scale(flip?-s:s,s);x.fillStyle='#d8bd82';x.strokeStyle=MPD_INK;x.lineWidth=.5;x.beginPath();x.moveTo(-4,0);x.lineTo(-4,-2.4);x.quadraticCurveTo(-1,-3.2,1,-2.6);x.lineTo(1.2,-4.4);x.quadraticCurveTo(2.6,-5.6,3.6,-4.4);x.lineTo(3.8,-2);x.lineTo(4.6,0);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.LAPIS;x.beginPath();x.moveTo(1.1,-4.4);x.lineTo(2.4,-5.8);x.lineTo(3.7,-4.4);x.closePath();x.fill();x.restore()}
function mpDesertCactus(x,a,b,s){s=s||1;x.save();x.strokeStyle=MPD_INK;x.fillStyle='#5a9a58';x.lineWidth=.45;x.beginPath();x.rect(a-.7*s,b-4*s,1.4*s,5*s);x.moveTo(a-.7*s,b-1.4*s);x.lineTo(a-2.2*s,b-1.4*s);x.lineTo(a-2.2*s,b-3.2*s);x.moveTo(a+.7*s,b-2.2*s);x.lineTo(a+2.2*s,b-2.2*s);x.lineTo(a+2.2*s,b-3.8*s);x.fill();x.stroke();x.restore()}
function mpDesertDead(x,a,b,s){s=s||1;x.save();x.strokeStyle='#4a3420';x.lineWidth=.7;x.beginPath();x.moveTo(a,b+1.5);x.lineTo(a,b-3*s);x.moveTo(a,b-1.2*s);x.lineTo(a-2.2*s,b-3*s);x.moveTo(a,b-2*s);x.lineTo(a+2*s,b-3.8*s);x.stroke();x.restore()}
function mpDesertBurrow(x,a,b,s){s=s||1;x.save();x.fillStyle='#d8b878';x.strokeStyle=MPD_INK;x.lineWidth=.6;x.beginPath();x.moveTo(a-4*s,b+1.5);x.quadraticCurveTo(a-3*s,b-5*s,a,b-5*s);x.quadraticCurveTo(a+3*s,b-5*s,a+4*s,b+1.5);x.closePath();x.fill();x.stroke();x.fillStyle='#2a1a0c';x.beginPath();x.moveTo(a-1.2*s,b+1.5);x.quadraticCurveTo(a-1.2*s,b-1.8*s,a,b-1.8*s);x.quadraticCurveTo(a+1.2*s,b-1.8*s,a+1.2*s,b+1.5);x.fill();x.restore()}
function mpDesertSun(x,a,b,r,col){x.save();x.strokeStyle=MPD_INK;x.lineWidth=.5;for(let k=0;k<12;k++){const an=k*Math.PI/6;x.beginPath();x.moveTo(a+Math.cos(an-.14)*r*1.15,b+Math.sin(an-.14)*r*1.15);x.lineTo(a+Math.cos(an)*r*1.9,b+Math.sin(an)*r*1.9);x.lineTo(a+Math.cos(an+.14)*r*1.15,b+Math.sin(an+.14)*r*1.15);x.fillStyle=MPL.GOLD;x.fill();x.stroke()}
  x.fillStyle=col||MPL.GOLD2;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();x.stroke();x.restore()}
function mpDesertXmark(x,a,b,s){x.save();x.strokeStyle=MPL.VERM;x.lineWidth=1.1;x.beginPath();x.moveTo(a-1.8*s,b-1.8*s);x.lineTo(a+1.8*s,b+1.8*s);x.moveTo(a+1.8*s,b-1.8*s);x.lineTo(a-1.8*s,b+1.8*s);x.stroke();x.restore()}
function mpDesertRipple(x,a,b,w){x.beginPath();x.moveTo(a-w,b);x.quadraticCurveTo(a-w/2,b-1.3,a,b);x.quadraticCurveTo(a+w/2,b+1.3,a+w,b);x.stroke()}
/* the land: a wash per cell, cliff hatching round the edge, an inked outline. colFn(cx,cy) returns [r,g,b] */
function mpDesertLand(x,f,L,colFn,cliff){
  const W=L.rows[0].length,H=L.rows.length,S=f.s,op=(a,b)=>a>=0&&b>=0&&a<W&&b<H&&L.rows[b][a]==='.',R=hash2;
  const ar=MPL.AREA;
  // distant, untrodden dunes and rock on the parchment outside the land (very faint)
  x.save();x.beginPath();x.rect(ar.x,ar.y,ar.w,ar.h);x.clip();x.strokeStyle=cliff.far;x.lineWidth=.6;
  for(let i=0;i<650;i++){const a=ar.x+R(i,1,901)*ar.w,b=ar.y+R(i,2,901)*ar.h,cx=((a-f.ox)/S)|0,cy=((b-f.oy)/S)|0;let near=false;for(let dy=-3;dy<=3&&!near;dy+=3)for(let dx=-3;dx<=3;dx+=3)if(op(cx+dx,cy+dy)){near=true;break}if(near)continue;mpDesertRipple(x,a,b,2+R(i,3,901)*3)}
  x.restore();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
    if(op(cx,cy)){const c=colFn(cx,cy),n=(R(cx,cy,902)-.5)*12;x.fillStyle=`rgba(${(c[0]+n)|0},${(c[1]+n)|0},${(c[2]+n*.7)|0},.93)`;x.fillRect(f.X(cx),f.Y(cy),S+.5,S+.5);continue}
    let d=9;for(let dy=-3;dy<=3&&d>1;dy++)for(let dx=-3;dx<=3;dx++)if(op(cx+dx,cy+dy)){d=Math.min(d,Math.max(Math.abs(dx),Math.abs(dy)))}
    if(d<=3){const a=f.X(cx),b=f.Y(cy);if(d===1){x.fillStyle=cliff.fill;x.fillRect(a,b,S+.4,S+.4)}
      if(R(cx,cy,903)<(d===1?.85:d===2?.6:.3)){x.strokeStyle=cliff.hatch;x.lineWidth=.55;x.beginPath();x.moveTo(a,b+S*.2);x.lineTo(a+S*.8,b+S*.9);if(d<3){x.moveTo(a+S*.2,b);x.lineTo(a+S,b+S*.7)}x.stroke()}}
  }
  // the outline: short inked strokes along every edge, wobbling
  x.strokeStyle=MPD_INK;x.lineWidth=.9;x.lineCap='round';x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!op(cx,cy))continue;const a=f.X(cx),b=f.Y(cy),j=()=>(R(cx,cy,904)-.5)*.5;
    if(!op(cx-1,cy)){x.moveTo(a+j(),b);x.lineTo(a-j(),b+S)}if(!op(cx+1,cy)){x.moveTo(a+S+j(),b);x.lineTo(a+S-j(),b+S)}
    if(!op(cx,cy-1)){x.moveTo(a,b+j());x.lineTo(a+S,b-j())}if(!op(cx,cy+1)){x.moveTo(a,b+S+j());x.lineTo(a+S,b+S-j())}}
  x.stroke()}
function mpDesertLabel(x,api,t,a,b,sz,col){api.text(x,t,a,b,sz||6.4,col||'#3a2210')}
function mpDesertMargin(x,api,o){
  api.title(x,o.title,o.sub);api.compass(x,432,54,10);
  api.notes(x,o.notes,8,64,78,6.1,4);
  const h=o.key.length*13+16;api.panel(x,392,78,84,h);api.text(x,'KEY',398,88,7.5,'#5a3a1c','left');
  o.key.forEach((k,i)=>{const yy=101+i*13;k[1](x,402,yy);api.text(x,k[0],412,yy,5.8,'#3a2a1c','left')})}
function mpDesertKeyStd(){return {
  road:(x,a,b)=>{x.fillStyle='#ecd9a6';x.fillRect(a-6,b-1.5,12,3);x.strokeStyle=MPD_INK;x.lineWidth=.6;x.setLineDash([1,2]);x.beginPath();x.moveTo(a-6,b);x.lineTo(a+6,b);x.stroke();x.setLineDash([])},
  palm:(x,a,b)=>mpDesertPalm(x,a,b+2,.9),dune:(x,a,b)=>mpDesertDune(x,a,b+1,4.5,'#ead08c','rgba(170,100,40,.5)'),
  rock:(x,a,b)=>mpDesertRock(x,a,b,3.6,'#a89478'),obel:(x,a,b)=>mpDesertObelisk(x,a,b+1,.9),treasure:(x,a,b)=>mpDesertXmark(x,a,b,1.4),
  burrow:(x,a,b)=>mpDesertBurrow(x,a,b+1,.9),tree:(x,a,b)=>MPLI.tree(x,a,b+2,.7),skull:(x,a,b)=>MPLI.skull(x,a,b+1,.8)}}

/* ------------------------------ level 41: the Sand Road ------------------------------ */
function mpDesertRoadMap(x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=api.fit(W,H),S=f.s,X=f.X,Y=f.Y,R=hash2;
  const stops=[[0,[116,150,84]],[.38,[166,166,92]],[.68,[236,192,110]],[1,[228,158,80]]];
  mpDesertLand(x,f,L,(cx,cy)=>{let b=rdBiome(cx,cy);const c=mpDesertLerpCol(stops,b);const fm=L.fmap[cy][cx];if(fm==='2'||fm==='3'){c[0]-=6}return c},{fill:'rgba(120,80,44,.28)',hatch:'rgba(70,44,24,.55)',far:'rgba(150,104,56,.22)'});
  // the cliff of Sut across the top, with crags
  x.save();x.fillStyle='rgba(122,80,46,.88)';x.fillRect(X(0),Y(0),W*S,RD.NORTH*S);x.strokeStyle='rgba(42,26,12,.8)';x.lineWidth=.6;
  for(let i=0;i<150;i++){const a=X(R(i,1,911)*W),b=Y(R(i,2,911)*RD.NORTH),l=2+R(i,3,911)*3;x.beginPath();x.moveTo(a,b);x.lineTo(a+(R(i,4,911)-.5)*2,b+l);x.stroke()}
  x.strokeStyle=MPD_INK;x.lineWidth=1;x.beginPath();x.moveTo(X(0),Y(RD.NORTH));for(let k=0;k<=W;k+=2)x.lineTo(X(k),Y(RD.NORTH)+(R(k,5,911)-.5)*1.2);x.stroke();x.restore();
  // ripples across the dunes, grass tufts in the forest
  x.save();x.lineCap='round';
  for(let cy=RD.NORTH+1;cy<H-1;cy++)for(let cx=1;cx<W-1;cx++){if(L.rows[cy][cx]!=='.')continue;const b=rdBiome(cx,cy),r=R(cx,cy,920);
    if(b>.55&&r<.075){x.strokeStyle='rgba(138,84,34,.6)';x.lineWidth=.5;const a=X(cx)+R(cx,cy,921)*S,bb=Y(cy)+R(cx,cy,922)*S;mpDesertRipple(x,a,bb,2.2+R(cx,cy,923)*2.4);if(r<.03)mpDesertRipple(x,a+1.4,bb+1.6,1.8+R(cx,cy,924)*2)}
    else if(b<.4&&r<.05){x.strokeStyle='rgba(50,90,56,.7)';x.lineWidth=.5;const a=X(cx)+R(cx,cy,921)*S,bb=Y(cy)+S;x.beginPath();x.moveTo(a-1,bb);x.lineTo(a,bb-1.8);x.lineTo(a+1,bb);x.moveTo(a,bb);x.lineTo(a,bb-1.3);x.stroke()}}
  x.restore();
  // the road: a pale ribbon with a dotted track down the middle
  const pts=[[0.5,RD.CY+.5],[RD.CX0*.5,RD.CY+.5],[Math.round(rdCentre(RD.CY))+.5,RD.CY+.5]];for(let y=RD.CY-1;y>=RD.NORTH+2;y-=2)pts.push([Math.round(rdCentre(y))+.5,y+.5]);
  x.save();x.lineCap='round';x.lineJoin='round';const path=()=>{x.beginPath();pts.forEach(([a,b],i)=>i?x.lineTo(X(a),Y(b)):x.moveTo(X(a),Y(b)))};
  path();x.strokeStyle='rgba(80,52,24,.55)';x.lineWidth=4.6;x.stroke();path();x.strokeStyle='#eedcae';x.lineWidth=3.6;x.stroke();path();x.strokeStyle='rgba(90,56,24,.9)';x.lineWidth=.9;x.setLineDash([1.2,2.4]);x.stroke();x.setLineDash([]);x.restore();
  // scenery: trees, palms, dunes, rocks, cacti, dead trees, burrows, oasis, obelisks, treasure
  const dec=L.decor.slice().sort((p,q)=>p.y-q.y);
  for(const d of dec){const a=X(d.x+.5+(d.ox||0)),b=Y(d.y+.5+(d.oy||0)),sc=d.sc||1,k=d.k;
    if(/^ltree/.test(k)){x.fillStyle='#3f7a46';x.strokeStyle='rgba(42,26,12,.7)';x.lineWidth=.35;x.beginPath();x.arc(a,b-1.3,1.5+R(d.x,d.y,930)*.6,0,6.3);x.fill();x.stroke();x.fillStyle='#5a3a1c';x.fillRect(a-.25,b-.2,.5,1.2)}
    else if(/^dpalm/.test(k))mpDesertPalm(x,a,b,1.05*sc);
    else if(/^dune/.test(k))mpDesertDune(x,a,b,3.6+2.4*sc,'#f0d48c','rgba(170,100,40,.5)');
    else if(/^drock/.test(k))mpDesertRock(x,a,b,1.9*sc,'#a89478');
    else if(/^dplant/.test(k))mpDesertCactus(x,a,b,.9);
    else if(k==='ddead')mpDesertDead(x,a,b,.9);
    else if(k==='dburrow')mpDesertBurrow(x,a,b,.9);
    else if(k==='dobelisk')mpDesertObelisk(x,a,b,.75);
    else if(k==='dsphinx')mpDesertSphinx(x,a,b+1,.8,d.flip);
    else if(k==='chest')mpDesertXmark(x,a,b,1)}
  for(const s of L.scenery||[]){if(!/^(dshrub|lbush)/.test(s.k)||R(s.wx,s.wy,931)>.5)continue;const a=X(s.wx),b=Y(s.wy);x.strokeStyle=/^dshrub/.test(s.k)?'rgba(96,100,52,.9)':'rgba(50,100,58,.9)';x.lineWidth=.5;x.beginPath();x.moveTo(a-1.2,b);x.lineTo(a-.6,b-1.6);x.lineTo(a,b-.4);x.lineTo(a+.6,b-1.8);x.lineTo(a+1.2,b);x.stroke()}
  // the oasis: a pool among the palms
  {const well=L.decor.find(d=>d.k==='well');if(well){const a=X(well.x+.5),b=Y(well.y+.5);x.save();x.fillStyle='#6a9cc0';x.strokeStyle=MPD_INK;x.lineWidth=.7;x.beginPath();x.ellipse(a,b,4.2,3,0,0,6.3);x.fill();x.stroke();x.strokeStyle='rgba(240,248,255,.75)';x.lineWidth=.45;mpDesertRipple(x,a-.4,b-.6,1.8);mpDesertRipple(x,a+.7,b+.8,1.4);x.restore()}}
  // the wrecked caravan: broken crates and bones
  {const cy=168,c=Math.round(rdCentre(cy)),a=X(c+3.5),b=Y(cy);x.save();x.strokeStyle=MPD_INK;x.fillStyle='#b08a56';x.lineWidth=.6;x.fillRect(a-3,b-1,3,2.4);x.strokeRect(a-3,b-1,3,2.4);x.save();x.translate(a+2.4,b+1.4);x.rotate(.5);x.fillRect(-2,-1.2,4,2.4);x.strokeRect(-2,-1.2,4,2.4);x.restore();x.beginPath();x.arc(a-1,b+4,1.6,0,6.3);x.moveTo(a-3,b+4.6);x.lineTo(a+1,b+3.4);x.stroke();x.restore();MPLI.skull(x,a-5,b+3,.6)}
  // a caravan on the road, heading north
  for(const cy of [200,196.6,193.2]){const c=rdCentre(cy);mpDesertCamel(x,X(c+.5)+(cy%2?.4:-.4),Y(cy)+3,.8,false)}
  // the gate to Anaea and the gate of the tomb
  {const a=X(1.5),b=Y(RD.CY+.5);MPLI.tower(x,a-1,b-2,.55);MPLI.tower(x,a-1,b+5,.55)}
  {const a=X(SANDROAD.cxN+.5);
    x.save();x.fillStyle='#d2bf90';x.strokeStyle=MPD_INK;x.lineWidth=.7;x.beginPath();x.moveTo(a-12,Y(RD.NORTH)+.5);x.lineTo(a-3.5,Y(0)+2.2);x.lineTo(a+3.5,Y(0)+2.2);x.lineTo(a+12,Y(RD.NORTH)+.5);x.closePath();x.fill();x.stroke();
    x.strokeStyle='rgba(42,26,12,.6)';x.lineWidth=.4;for(let k=1;k<5;k++){const yy=Y(0)+2.2+k*(Y(RD.NORTH)-Y(0)-1.7)/5,w=3.5+k*1.7;x.beginPath();x.moveTo(a-w,yy);x.lineTo(a+w,yy);x.stroke()}
    x.fillStyle='#1a1008';x.beginPath();x.moveTo(a-1.8,Y(RD.NORTH)+.5);x.lineTo(a-1.8,Y(RD.NORTH)-2.2);x.quadraticCurveTo(a,Y(RD.NORTH)-4,a+1.8,Y(RD.NORTH)-2.2);x.lineTo(a+1.8,Y(RD.NORTH)+.5);x.fill();x.restore()}
  // the labels
  const T=(t,cx,cy,sz,col)=>mpDesertLabel(x,api,t,X(cx),Y(cy),sz,col);
  T('THE TOMB OF SUT',SANDROAD.cxN,RD.NORTH+11,7.2,'#5a1a10');
  T('Gate to Anaea',17,RD.CY+11,6.6);
  T('The Forest Road',44,RD.CY-12,7.2,'#274a1e');
  T('Palm Country',rdCentre(186)-26,186,6.8,'#274a1e');
  T('The Oasis',rdCentre(122)+12,115.5,6.6,'#1e4a6a');
  T('Wrecked Caravan',rdCentre(168)+16,172.5,6,'#5a3a1c');
  T('The Open Dunes',rdCentre(70)-22,70,7.2,'#7a3a12');
  T('Burrows',rdCentre(110)-24,108,6,'#5a3a1c');
  T('The Obelisk Road',rdCentre(146)-30,146,6,'#5a3a1c');
  mpDesertSun(x,350,232,8);for(const [cx,cy,fl] of [[330,262,0],[341,264,0],[352,262,0]])mpDesertCamel(x,cx,cy,1.5,fl);
  x.save();x.strokeStyle='rgba(120,70,30,.6)';x.lineWidth=.6;for(let k=0;k<9;k++)mpDesertRipple(x,300+k*9,272+(k%3)*2,3+k%3);x.restore();
  const kk=mpDesertKeyStd();
  mpDesertMargin(x,api,{title:'Sand Road',sub:'levels 41 to 43 lead north',notes:[
    'The road leaves Anaea going east through a narrow forest, then turns north.',
    'The forest thins into palms, and the palms give out into open dunes.',
    'Pairs of obelisks stand beside the road. The oasis has a well and a chest.',
    'Small mounds in the dunes are burrows with a door in the side.',
    'At the far north a cliff hides the tomb of Sut.'],
    key:[['Road',kk.road],['Forest tree',kk.tree],['Palm',kk.palm],['Dune',kk.dune],['Rock',kk.rock],['Obelisk',kk.obel],['Burrow',kk.burrow],['Buried chest',kk.treasure]]})}

/* ------------------------------ level 42: the Tomb of Sut ------------------------------ */
function mpDesertTombMap(x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=api.fit(W,H),S=f.s,X=f.X,Y=f.Y,R=hash2;
  const hid=(a,b)=>(a>=91&&a<=95&&b>=33&&b<=37)||(a>=18&&a<=22&&b>=21&&b<=25); // the two secret rooms are not shown
  const fl=(a,b)=>a>=0&&b>=0&&a<W&&b<H&&L.rows[b][a]==='.'&&!hid(a,b);
  const fc={'0':[216,200,164],'1':[232,208,134],'2':[226,196,128],'3':[196,170,128],'4':[142,164,206],'5':[214,148,116]};
  // the rock: heavy hatching round the rooms
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
    if(fl(cx,cy))continue;let d=9;for(let dy=-3;dy<=3&&d>1;dy++)for(let dx=-3;dx<=3;dx++)if(fl(cx+dx,cy+dy))d=Math.min(d,Math.max(Math.abs(dx),Math.abs(dy)));
    if(d>3)continue;const a=X(cx),b=Y(cy);
    if(d===1){x.fillStyle='rgba(84,56,32,.9)';x.fillRect(a,b,S+.3,S+.3);x.strokeStyle='rgba(212,170,96,.45)';x.lineWidth=.4;x.strokeRect(a+.4,b+.4,S-.8,S-.8)}
    else if(R(cx,cy,940)<(d===2?.9:.45)){x.strokeStyle='rgba(70,44,24,.6)';x.lineWidth=.6;x.beginPath();x.moveTo(a,b+S);x.lineTo(a+S,b);if(d===2){x.moveTo(a,b+S*.5);x.lineTo(a+S*.5,b);x.moveTo(a+S*.5,b+S);x.lineTo(a+S,b+S*.5)}x.stroke()}}
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!fl(cx,cy))continue;const c=fc[L.fmap[cy][cx]]||fc['0'],n=(R(cx,cy,941)-.5)*10;x.fillStyle=`rgb(${(c[0]+n)|0},${(c[1]+n)|0},${(c[2]+n*.7)|0})`;x.fillRect(X(cx),Y(cy),S+.3,S+.3)}
  // flagstones in the long hall and the sand ripples of the cave and the pit
  x.save();x.strokeStyle='rgba(90,60,30,.3)';x.lineWidth=.4;for(let cy=26;cy<=45;cy+=2)for(let cx=40;cx<=56;cx+=2){if(L.fmap[cy][cx]==='4')continue;x.strokeRect(X(cx),Y(cy),S*2,S*2)}x.restore();
  x.save();x.strokeStyle='rgba(138,84,34,.55)';x.lineWidth=.5;for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(fl(cx,cy)&&L.fmap[cy][cx]==='2'&&R(cx,cy,942)<.45)mpDesertRipple(x,X(cx)+S/2,Y(cy)+S/2,S*.9)}x.restore();
  // inked wall line
  x.strokeStyle=MPD_INK;x.lineWidth=1.1;x.lineCap='round';x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!fl(cx,cy))continue;const a=X(cx),b=Y(cy);if(!fl(cx-1,cy)){x.moveTo(a,b);x.lineTo(a,b+S)}if(!fl(cx+1,cy)){x.moveTo(a+S,b);x.lineTo(a+S,b+S)}if(!fl(cx,cy-1)){x.moveTo(a,b);x.lineTo(a+S,b)}if(!fl(cx,cy+1)){x.moveTo(a,b+S);x.lineTo(a+S,b+S)}}
  x.stroke();
  // the things on the floor
  for(const d of L.decor){const k=d.k,a=X(d.x+.5),b=Y(d.y+.5);
    if(/^dpillar/.test(k)){x.fillStyle='#cdbf9c';x.strokeStyle=MPD_INK;x.lineWidth=.6;x.beginPath();x.arc(a,b,S*.42,0,6.3);x.fill();x.stroke()}
    else if(k==='brazier'){x.fillStyle=MPL.VERM;x.strokeStyle=MPL.GOLD;x.lineWidth=.7;x.beginPath();x.arc(a,b,S*.32,0,6.3);x.fill();x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(a,b,S*.12,0,6.3);x.fill()}
    else if(/^sarcoph/.test(k)){x.fillStyle=MPL.GOLD;x.strokeStyle=MPD_INK;x.lineWidth=.6;x.beginPath();x.moveTo(a-S*.35,b-S*.8);x.lineTo(a+S*.35,b-S*.8);x.lineTo(a+S*.45,b-S*.3);x.lineTo(a+S*.3,b+S*.8);x.lineTo(a-S*.3,b+S*.8);x.lineTo(a-S*.45,b-S*.3);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.LAPIS;x.fillRect(a-S*.15,b-S*.6,S*.3,S*.35)}
    else if(k==='danubis'||k==='dbastet'){x.fillStyle=k==='danubis'?'#2c2c34':'#b58a3a';x.strokeStyle=MPL.GOLD;x.lineWidth=.5;x.beginPath();x.moveTo(a-S*.4,b+S*.4);x.lineTo(a-S*.3,b-S*.2);x.lineTo(a-S*.3,b-S*.7);x.lineTo(a-S*.1,b-S*.3);x.lineTo(a+S*.1,b-S*.3);x.lineTo(a+S*.3,b-S*.7);x.lineTo(a+S*.3,b-S*.2);x.lineTo(a+S*.4,b+S*.4);x.closePath();x.fill();x.stroke()}
    else if(k==='dpharaoh'){x.fillStyle=MPL.GOLD2;x.strokeStyle=MPD_INK;x.lineWidth=.6;x.beginPath();x.arc(a,b,S*.5,0,6.3);x.fill();x.stroke();x.fillStyle=MPL.LAPIS;x.fillRect(a-S*.35,b-S*.12,S*.7,S*.22)}
    else if(k==='lever'){x.strokeStyle=MPD_INK;x.fillStyle=MPL.LAPIS;x.lineWidth=.6;x.beginPath();x.arc(a,b,S*.35,0,6.3);x.fill();x.stroke();x.beginPath();x.moveTo(a,b);x.lineTo(a+S*.5,b-S*.5);x.stroke()}
    else if(k==='treasure'){x.fillStyle=MPL.GOLD;x.strokeStyle=MPD_INK;x.lineWidth=.45;x.fillRect(a-S*.3,b-S*.2,S*.6,S*.4);x.strokeRect(a-S*.3,b-S*.2,S*.6,S*.4)}
    else if(k==='offering'){x.fillStyle=MPL.GOLD2;x.strokeStyle=MPD_INK;x.lineWidth=.5;x.fillRect(a-S*.35,b-S*.35,S*.7,S*.7);x.strokeRect(a-S*.35,b-S*.35,S*.7,S*.7)}
    else if(k==='ventplate'&&!d.hidden){x.fillStyle='rgba(176,50,30,.38)';x.fillRect(a-S*.45,b-S*.45,S*.9,S*.9)}
    else if(/^vase/.test(k)){x.fillStyle='#a8683a';x.beginPath();x.arc(a,b,S*.2,0,6.3);x.fill()}
    else if(/^dune/.test(k))mpDesertDune(x,a,b,S*.9,'#ecd292','rgba(170,100,40,.5)')}
  // the four sun discs
  for(const it of L.items||[]){if(/^sundisc/.test(it.k))mpDesertSun(x,X(it.x+.5),Y(it.y+.5),S*.5)}
  // the great door, Sut, the gate in, and the way out
  {const a=X(48),b=Y(25);x.save();x.fillStyle=MPL.GOLD;x.strokeStyle=MPD_INK;x.lineWidth=.8;x.fillRect(X(47)-.5,b+.3,S*3+1,S*.5+.6);x.strokeRect(X(47)-.5,b+.3,S*3+1,S*.5+.6);x.fillStyle=MPL.VERM;x.beginPath();x.arc(a+S/2,b+S*.55,S*.4,0,6.3);x.fill();x.stroke();x.restore()}
  MPLI.skull(x,X(48.5),Y(5.5),1);
  {const a=X(48.5),b=Y(72);x.save();x.fillStyle='#1a1008';x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.moveTo(a-S*1.2,b+S);x.lineTo(a-S*1.2,b-.5);x.quadraticCurveTo(a,b-S*1.8,a+S*1.2,b-.5);x.lineTo(a+S*1.2,b+S);x.closePath();x.fill();x.stroke();x.restore()}
  {const a=X(48.5),b=Y(1.2);x.save();x.setLineDash([1.2,1.6]);x.strokeStyle=MPL.GOLD;x.lineWidth=1.2;x.beginPath();x.moveTo(a-S*1.1,b+S);x.lineTo(a-S*1.1,b-.4);x.quadraticCurveTo(a,b-S*1.7,a+S*1.1,b-.4);x.lineTo(a+S*1.1,b+S);x.stroke();x.restore()}
  // the labels
  const T=(t,cx,cy,sz,col)=>mpDesertLabel(x,api,t,X(cx),Y(cy),sz,col);
  T('THE HALL OF ETERNITY',48,33,7,'#1a2c6a');T('The Cave of Sand',45,50.5,6.4);T('The Great Door',48,23.2,5.8,'#5a1a10');T('Throne of Sut',48,8.2,7,'#5a1a10');
  T('Hall of Embers',13.5,35,6.4,'#6a1a10');T('Crypt of Sarcophagi',83,35,6,'#1a2c6a');T('Chamber of Switches',19,15,6,'#1a2c6a');T('The Sand Pit',82.5,11,6.4,'#7a3a12');
  T('Gate to the Sand Road',48.5,75,6.2);T('Way to the Red Dunes',48.5,.5,5.6,'#5a3a1c');
  T('sun disc 1',7.5,32.3,4.8,'#6a4a08');T('sun disc 2',93,32,4.8,'#6a4a08');T('sun disc 3',3,11.3,4.8,'#6a4a08');T('sun disc 4',86,3.4,4.8,'#6a4a08');
  mpDesertMargin(x,api,{title:'Sut’s Tomb',sub:'level 42',notes:[
    'A winding cave of sand leads up to the Hall of Eternity.',
    'Four wings each guard a golden sun disc. The great door opens only when all four sit in its sockets.',
    'Red slabs in the Hall of Embers are fire traps. Levers in the Chamber of Switches open the far vault.',
    'Beyond the great door lies the throne room of Sut.'],
    key:[['Sun disc',(g,a,b)=>mpDesertSun(g,a,b,2)],['Sarcophagus',(g,a,b)=>{g.fillStyle=MPL.GOLD;g.strokeStyle=MPD_INK;g.lineWidth=.6;g.fillRect(a-1.6,b-3,3.2,6);g.strokeRect(a-1.6,b-3,3.2,6)}],['Brazier',(g,a,b)=>{g.fillStyle=MPL.VERM;g.strokeStyle=MPL.GOLD;g.beginPath();g.arc(a,b,2,0,6.3);g.fill();g.stroke()}],['Pillar',(g,a,b)=>{g.fillStyle='#cdbf9c';g.strokeStyle=MPD_INK;g.lineWidth=.6;g.beginPath();g.arc(a,b,2.3,0,6.3);g.fill();g.stroke()}],['Fire trap',(g,a,b)=>{g.fillStyle='rgba(176,50,30,.5)';g.fillRect(a-3,b-3,6,6)}],['Lever',(g,a,b)=>{g.fillStyle=MPL.LAPIS;g.strokeStyle=MPD_INK;g.lineWidth=.6;g.beginPath();g.arc(a,b,2,0,6.3);g.fill();g.stroke()}],['Treasure',(g,a,b)=>{g.fillStyle=MPL.GOLD;g.strokeStyle=MPD_INK;g.lineWidth=.5;g.fillRect(a-2.4,b-1.6,4.8,3.2);g.strokeRect(a-2.4,b-1.6,4.8,3.2)}]]})}

/* ------------------------------ level 43: the Red Dunes ------------------------------ */
function mpDesertCity(x,cx,by,s){x.save();x.strokeStyle=MPD_INK;x.lineWidth=.6;
  x.fillStyle='#e6d2a2';x.fillRect(cx-22*s,by-6*s,44*s,6*s);x.strokeRect(cx-22*s,by-6*s,44*s,6*s);for(let k=-21;k<21;k+=3){x.fillRect(cx+k*s,by-7.4*s,1.8*s,1.6*s)}
  for(const [dx,h,col] of [[-14,12,MPL.LAPIS],[-6,9,MPL.VERM],[3,14,MPL.GOLD],[12,10,MPL.LAPIS]]){const a=cx+dx*s;x.fillStyle='#ecdcb4';x.fillRect(a-2.4*s,by-h*s,4.8*s,(h-1)*s);x.strokeRect(a-2.4*s,by-h*s,4.8*s,(h-1)*s);x.fillStyle=col;x.beginPath();x.moveTo(a-3*s,by-h*s);x.quadraticCurveTo(a-3*s,by-(h+4.4)*s,a,by-(h+5)*s);x.quadraticCurveTo(a+3*s,by-(h+4.4)*s,a+3*s,by-h*s);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(a,by-(h+5)*s);x.lineTo(a,by-(h+6.4)*s);x.stroke()}
  x.fillStyle='#1a1008';x.beginPath();x.moveTo(cx-2*s,by);x.lineTo(cx-2*s,by-3*s);x.quadraticCurveTo(cx,by-5*s,cx+2*s,by-3*s);x.lineTo(cx+2*s,by);x.fill();x.restore()}
function mpDesertRedMap(x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=api.fit(W,H),S=f.s,X=f.X,Y=f.Y,R=hash2;
  mpDesertLand(x,f,L,(cx,cy)=>{const fm=L.fmap[cy][cx],n=hash2(cx>>2,cy>>2,950);if(fm==='2')return [222,190,140];const m=(Math.sin(cx*.09+Math.sin(cy*.07)*2)+Math.sin(cy*.11+cx*.035)+Math.sin((cx+cy)*.05)*.6+2.6)/5.2,ml=Math.max(0,Math.min(1,m));const base=mpDesertLerpCol([[0,[208,104,62]],[.5,[226,146,82]],[1,[234,176,100]]],ml);if(fm==='1'){base[0]-=5;base[1]-=9;base[2]-=5}return [base[0]-n*14,base[1]-n*22,base[2]-n*16]},{fill:'rgba(150,64,34,.3)',hatch:'rgba(90,34,18,.55)',far:'rgba(170,80,40,.22)'});
  // sand ripples
  x.save();x.lineCap='round';
  for(let cy=RS.NORTH+1;cy<H-1;cy++)for(let cx=1;cx<W-1;cx++){if(L.rows[cy][cx]!=='.')continue;const r=R(cx,cy,951);if(r<.06){x.strokeStyle=R(cx,cy,953)<.5?'rgba(150,56,28,.6)':'rgba(120,60,20,.55)';x.lineWidth=.55;const a=X(cx)+R(cx,cy,952)*S,b=Y(cy)+R(cx,cy,954)*S;mpDesertRipple(x,a,b,2.6+R(cx,cy,955)*2.8);if(r<.025)mpDesertRipple(x,a+1.6,b+1.8,2+R(cx,cy,956)*2)}}
  x.restore();
  // the old paved road
  const pts=[];for(let y=70;y>=RS.NORTH+1;y-=2)pts.push([Math.round(rsCentre(y))+.5,y+.5]);
  x.save();x.lineCap='round';x.lineJoin='round';const path=()=>{x.beginPath();pts.forEach(([a,b],i)=>i?x.lineTo(X(a),Y(b)):x.moveTo(X(a),Y(b)))};
  path();x.strokeStyle='rgba(60,36,20,.6)';x.lineWidth=5.6;x.stroke();path();x.strokeStyle='#e4d2ac';x.lineWidth=4.6;x.stroke();
  x.strokeStyle='rgba(80,56,36,.55)';x.lineWidth=.45;for(let y=RS.NORTH+2;y<70;y+=1.5){const c=rsCentre(y);x.beginPath();x.moveTo(X(c-1),Y(y));x.lineTo(X(c+2),Y(y));x.stroke()}x.restore();
  // dots of a worn track in the south, leading to the old road
  x.save();x.fillStyle='rgba(90,50,24,.7)';for(let y=H-4;y>=70;y-=1.6){const c=rsCentre(y);x.beginPath();x.arc(X(c+.5),Y(y),.5,0,6.3);x.fill()}x.restore();
  for(const d of L.decor){if(d.k==='chest'&&L.rows[d.y][d.x]==='.'){x.save();x.fillStyle='rgba(236,214,170,.55)';x.strokeStyle='rgba(60,36,20,.55)';x.lineWidth=.5;x.setLineDash([1.5,1.5]);x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),3.2*S,0,6.3);x.fill();x.stroke();x.restore()}}
  const dec=L.decor.slice().sort((p,q)=>p.y-q.y);
  for(const d of dec){const a=X(d.x+.5+(d.ox||0)),b=Y(d.y+.5+(d.oy||0)),sc=d.sc||1,k=d.k;
    if(/^rdune/.test(k))mpDesertDune(x,a,b,3+2.1*sc,'#e8b878','rgba(150,52,26,.55)');
    else if(/^rrock/.test(k))mpDesertRock(x,a,b,2.2*sc,'#a86a52');
    else if(/^dplant/.test(k))mpDesertCactus(x,a,b,1);
    else if(k==='ddead')mpDesertDead(x,a,b,1);
    else if(/^dpillar/.test(k)){x.fillStyle='#d8c4a0';x.strokeStyle=MPD_INK;x.lineWidth=.5;x.beginPath();x.arc(a,b,1.5*Math.max(.7,sc),0,6.3);x.fill();x.stroke()}
    else if(k==='dobelisk')mpDesertObelisk(x,a,b,.9);
    else if(k==='dsphinx')mpDesertSphinx(x,a,b+1,1,d.flip||d.x>RS.W/2);
    else if(k==='chest'&&L.rows[d.y][d.x]==='.')mpDesertXmark(x,a,b,1.2)}
  // mummy camps: one skull per cluster
  {const seen=new Set();for(const e of L.enemies||[]){if(e.t!=='mummy')continue;const key=((e.x/10)|0)+','+((e.y/10)|0);if(seen.has(key))continue;seen.add(key);MPLI.skull(x,X(e.x+.5),Y(e.y+.5),.85)}}
  // the old ruins get a name
  const chests=L.decor.filter(d=>d.k==='chest'&&L.rows[d.y][d.x]==='.');chests.forEach((d,i)=>{if(i%2===0)mpDesertLabel(x,api,'Ruin',X(d.x+.5),Y(d.y+.5)+6.5,5.4,'#5a3a1c')});
  // the city on the horizon
  mpDesertCity(x,X(REDDUNES.cxN+.5),Y(RS.NORTH)+.5,.78);
  // Sut's door in the south
  {const a=X(REDDUNES.cxS+.5),b=Y(H-2.2);x.save();x.fillStyle='#1a1008';x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.moveTo(a-3.4,b+2);x.lineTo(a-3.4,b-1);x.quadraticCurveTo(a,b-5.4,a+3.4,b-1);x.lineTo(a+3.4,b+2);x.closePath();x.fill();x.stroke();x.restore()}
  // a camel caravan on the old road
  for(const [cy,o] of [[52,-.4],[49.2,.4],[46.4,-.2]])mpDesertCamel(x,X(rsCentre(cy)+.5)+o,Y(cy)+3,.9,false);
  const T=(t,cx,cy,sz,col)=>mpDesertLabel(x,api,t,X(cx),Y(cy),sz,col);
  T('KHEMETRA',REDDUNES.cxN+22,RS.NORTH+8,8,'#274a9a');T('The Old Road',rsCentre(36)+17,36,6.8,'#5a3a1c');
  T('Sut’s Door',REDDUNES.cxS,H-8,6.6,'#5a1a10');T('The Red Dunes',rsCentre(120)-36,118,7.4,'#7a2412');T('The Burning Sands',rsCentre(88)+34,96,6.4,'#7a2412');T('Obelisk Road',rsCentre(60)-24,60,5.6,'#5a3a1c');
  const kk=mpDesertKeyStd();
  mpDesertMargin(x,api,{title:'Red Dunes',sub:'level 43',notes:[
    'Sut’s door in the south opens onto red sand and red rock.',
    'Rings of broken pillars are old ruins. Each hides a chest at its heart.',
    'The last stretch of the way is an old paved road with obelisks on both sides.',
    'Mummies and scorpions live out here. The city of Khemetra lies through the gate in the north.'],
    key:[['Paved road',kk.road],['Red dune',(g,a,b)=>mpDesertDune(g,a,b+1,4.5,'#e8b878','rgba(150,52,26,.55)')],['Red rock',(g,a,b)=>mpDesertRock(g,a,b,3.6,'#a86a52')],['Obelisk',kk.obel],['Ruin chest',kk.treasure],['Mummy camp',kk.skull],['Cactus',(g,a,b)=>mpDesertCactus(g,a,b+2,.9)]]})}

mplInstall({name:'desert',levels:[41,42,43],foot:'You are the yellow arrow.',draw(c,x,L,api){
  if(LEVEL===41)mpDesertRoadMap(x,L,api);else if(LEVEL===42)mpDesertTombMap(x,L,api);else mpDesertRedMap(x,L,api)}});
