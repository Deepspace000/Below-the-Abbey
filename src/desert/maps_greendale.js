/* Area map for Greendale Forest (level 32): see maps_common.js. A lush valley of meadows and layered woods, drawn from the real level rows, trail and decor. */
const mpGreendaleGreens=['#2f6a44','#3d7c4f','#4f9055','#6aa04c','#2a5e4a','#7aa84a'];
function mpGreendaleTree(x,px,py,r,seed){
  const g=mpGreendaleGreens[Math.floor(hash2(seed,3,31)*mpGreendaleGreens.length)];
  x.fillStyle='#5a3a1c';x.fillRect(px-.5,py-r*.2,1,r*.9);
  x.strokeStyle='rgba(30,40,20,.85)';x.lineWidth=.45;x.fillStyle=g;
  for(const [dx,dy,rr] of [[-.55,-.2,.62],[.55,-.2,.62],[0,-.75,.78]]){x.beginPath();x.arc(px+dx*r,py+dy*r,rr*r,0,6.3);x.fill();x.stroke()}
  x.fillStyle='rgba(235,225,120,.5)';x.beginPath();x.arc(px-.2*r,py-1.0*r,.32*r,0,6.3);x.fill()}
function mpGreendalePine(x,px,py,r,seed){
  x.fillStyle=hash2(seed,5,31)<.5?'#24523a':'#2d6444';x.strokeStyle='rgba(20,34,20,.85)';x.lineWidth=.4;
  for(let k=0;k<3;k++){x.beginPath();x.moveTo(px-(1-k*.2)*r,py-k*.7*r);x.lineTo(px,py-(k*.7+1.2)*r);x.lineTo(px+(1-k*.2)*r,py-k*.7*r);x.closePath();x.fill();x.stroke()}}
function mpGreendaleDeer(x,a,b,s,flip){
  x.save();x.translate(a,b);x.scale(flip?-s:s,s);x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillStyle='#b9824a';
  x.beginPath();x.ellipse(0,0,3,1.7,0,0,6.3);x.fill();x.stroke();
  x.beginPath();x.moveTo(2.2,-.8);x.lineTo(3.6,-3);x.lineTo(4.8,-2.8);x.lineTo(4.2,-1.6);x.lineTo(3,-.2);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(-1.8,1.2);x.lineTo(-2,3.6);x.moveTo(-.8,1.4);x.lineTo(-.8,3.6);x.moveTo(1.2,1.4);x.lineTo(1.2,3.6);x.moveTo(2.2,1.2);x.lineTo(2.4,3.6);x.stroke();
  x.beginPath();x.moveTo(4,-3);x.lineTo(3.6,-5);x.moveTo(4.6,-2.9);x.lineTo(5.4,-4.8);x.moveTo(3.8,-4.2);x.lineTo(2.9,-4.6);x.stroke();
  x.fillStyle='#f4ead0';x.beginPath();x.arc(-3,-.4,.7,0,6.3);x.fill();x.restore()}
function mpGreendaleRabbit(x,a,b,s){
  x.save();x.translate(a,b);x.scale(s,s);x.strokeStyle=MPL.INK;x.lineWidth=.45;x.fillStyle='#d8cdb8';
  x.beginPath();x.ellipse(0,0,2,1.4,0,0,6.3);x.fill();x.stroke();x.beginPath();x.arc(1.8,-1,1,0,6.3);x.fill();x.stroke();
  x.beginPath();x.ellipse(1.5,-3,.35,1.2,.2,0,6.3);x.ellipse(2.2,-3,.35,1.2,.2,0,6.3);x.fill();x.stroke();x.restore()}
function mpGreendaleBird(x,a,b,s,col){x.strokeStyle=col||MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-3*s,b-1.2*s);x.quadraticCurveTo(a-1.4*s,b-3*s,a,b);x.quadraticCurveTo(a+1.4*s,b-3*s,a+3*s,b-1.2*s);x.stroke()}
function mpGreendaleHidden(x,a,b,s){ /* a mossy stone door set in the bank, with a gold mark */
  x.save();x.translate(a,b);x.scale(s,s);x.fillStyle='#8a9a86';x.strokeStyle=MPL.INK;x.lineWidth=.8;
  x.beginPath();x.moveTo(-5,5);x.lineTo(-5,-1);x.quadraticCurveTo(0,-8,5,-1);x.lineTo(5,5);x.closePath();x.fill();x.stroke();
  x.fillStyle='#2a1a0c';x.beginPath();x.moveTo(-2.6,5);x.lineTo(-2.6,-.4);x.quadraticCurveTo(0,-4,2.6,-.4);x.lineTo(2.6,5);x.closePath();x.fill();
  x.strokeStyle=MPL.GOLD2;x.lineWidth=1;x.beginPath();x.arc(0,.8,1.2,0,6.3);x.stroke();
  x.fillStyle='#5a9a52';for(const [dx,dy] of [[-4.6,0],[4.4,1],[-1,-5.2],[2,-4.6]]){x.beginPath();x.arc(dx,dy,1.1,0,6.3);x.fill()}x.restore();
  MPLI.star(x,a,b-9*s,.9*s,MPL.VERM)}
function mpGreendaleSign(x,a,b,s){x.strokeStyle='#5a3a1c';x.lineWidth=1.1*s;x.beginPath();x.moveTo(a,b+3*s);x.lineTo(a,b-4*s);x.stroke();x.fillStyle='#d8b878';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-3*s,b-5*s,6*s,3*s);x.strokeRect(a-3*s,b-5*s,6*s,3*s)}
function mpGreendaleGate(x,a,b,s,dir){ /* a little arch where a road leaves the valley */
  x.save();x.translate(a,b);x.scale(s,s);x.fillStyle='#cfc6ae';x.strokeStyle=MPL.INK;x.lineWidth=.8;
  x.fillRect(-5,-4,2.4,8);x.strokeRect(-5,-4,2.4,8);x.fillRect(2.6,-4,2.4,8);x.strokeRect(2.6,-4,2.4,8);
  x.beginPath();x.moveTo(-5,-4);x.quadraticCurveTo(0,-10,5,-4);x.lineTo(2.6,-4);x.quadraticCurveTo(0,-6.6,-2.6,-4);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD;x.beginPath();x.arc(0,-7,1,0,6.3);x.fill();x.restore()}

function mpGreendaleDraw(c,x,L,api){
  const A=MPL.AREA,W=L.rows[0].length,H=L.rows.length,F=api.fit(W,H),s=F.s,cx=i=>F.X(i+.5),cy=j=>F.Y(j+.5);
  const isT=(i,j)=>i<0||j<0||i>=W||j>=H||L.rows[j][i]==='T';
  const isTrail=(i,j)=>i>=0&&j>=0&&i<W&&j<H&&!isT(i,j)&&L.fmap[j]&&L.fmap[j][i]==='1';
  const R=(i,j,k)=>hash2(i+101,j+57,k);
  const named=L.mapNames&&L.mapNames.length?L.mapNames:null;
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  /* forest floor: deep verdigris wash with mottling */
  let g=x.createLinearGradient(A.x,A.y,A.x+A.w,A.y+A.h);g.addColorStop(0,'#3f7a55');g.addColorStop(.5,'#336b4a');g.addColorStop(1,'#2c6048');x.fillStyle=g;x.fillRect(A.x,A.y,A.w,A.h);
  for(let k=0;k<260;k++){x.fillStyle=k%2?'rgba(20,60,40,.28)':'rgba(120,170,90,.16)';x.beginPath();x.ellipse(A.x+hash2(k,1,41)*A.w,A.y+hash2(k,2,41)*A.h,6+hash2(k,3,41)*16,4+hash2(k,4,41)*9,hash2(k,5,41)*3,0,6.3);x.fill()}
  /* meadows: soft overlapping blobs of light green and gold over every open cell, with a darker fringe first */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(isT(i,j))continue;x.fillStyle='rgba(98,148,80,.9)';x.beginPath();x.arc(cx(i)+(R(i,j,1)-.5)*s*.5,cy(j)+(R(i,j,2)-.5)*s*.5,s*1.15,0,6.3);x.fill()}
  const meadow=['#b5cf74','#a4c56a','#c8d986','#9fc070','#d4dc8a'];
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(isT(i,j))continue;x.fillStyle=meadow[Math.floor(R(i,j,3)*meadow.length)];x.globalAlpha=.85;x.beginPath();x.arc(cx(i)+(R(i,j,4)-.5)*s*.6,cy(j)+(R(i,j,5)-.5)*s*.6,s*.78,0,6.3);x.fill()}x.globalAlpha=1;
  /* sunlit gold glimmers on the grass */
  for(let k=0;k<150;k++){const i=Math.floor(hash2(k,8,43)*W),j=Math.floor(hash2(k,9,43)*H);if(isT(i,j))continue;x.fillStyle=k%3?'rgba(240,216,120,.6)':'rgba(255,248,200,.7)';x.beginPath();x.arc(cx(i)+(hash2(k,10,43)-.5)*s,cy(j)+(hash2(k,11,43)-.5)*s,.5+hash2(k,12,43)*.8,0,6.3);x.fill()}
  /* grass tufts in ink */
  x.strokeStyle='rgba(50,90,40,.7)';x.lineWidth=.5;
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(isT(i,j)||isTrail(i,j)||R(i,j,6)>.4)continue;const a=cx(i)+(R(i,j,7)-.5)*s,b=cy(j)+(R(i,j,8)-.5)*s;x.beginPath();x.moveTo(a-1.2,b);x.lineTo(a-1.6,b-2.2);x.moveTo(a,b);x.lineTo(a,b-2.8);x.moveTo(a+1.2,b);x.lineTo(a+1.7,b-2);x.stroke()}
  /* ponds and brooks where the reeds grow */
  const reeds=(L.decor||[]).filter(d=>d.k==='reeds');
  x.lineCap='round';
  for(let a=0;a<reeds.length;a++)for(let b=a+1;b<reeds.length;b++){const p=reeds[a],q=reeds[b],d=Math.hypot(p.x-q.x,p.y-q.y);if(d>7||d<1)continue;
    const x1=cx(p.x),y1=cy(p.y),x2=cx(q.x),y2=cy(q.y),mx=(x1+x2)/2+(y2-y1)*.18,my=(y1+y2)/2-(x2-x1)*.18;
    x.strokeStyle='#2e5a7a';x.lineWidth=3;x.beginPath();x.moveTo(x1,y1);x.quadraticCurveTo(mx,my,x2,y2);x.stroke();x.strokeStyle='#8cc4d4';x.lineWidth=1.8;x.stroke()}
  for(const d of reeds){const a=cx(d.x),b=cy(d.y);x.fillStyle='#2e5a7a';x.beginPath();x.ellipse(a,b,s*.95,s*.65,0,0,6.3);x.fill();x.fillStyle='#8cc4d4';x.beginPath();x.ellipse(a,b,s*.75,s*.48,0,0,6.3);x.fill();x.fillStyle='#d6eef0';x.beginPath();x.ellipse(a-s*.2,b-s*.12,s*.28,s*.12,0,0,6.3);x.fill()}
  /* clearing edge in ink, wobbly */
  x.strokeStyle='rgba(30,50,26,.7)';x.lineWidth=.7;
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(isT(i,j))continue;const X0=F.X(i),Y0=F.Y(j);
    const seg=(a,b,c2,d)=>{x.beginPath();x.moveTo(a+(R(i,j,20)-.5)*1.2,b+(R(i,j,21)-.5)*1.2);x.lineTo((a+c2)/2+(R(i,j,22)-.5)*1.6,(b+d)/2+(R(i,j,23)-.5)*1.6);x.lineTo(c2+(R(i,j,24)-.5)*1.2,d+(R(i,j,25)-.5)*1.2);x.stroke()};
    if(isT(i,j-1))seg(X0,Y0,X0+s,Y0);if(isT(i,j+1))seg(X0,Y0+s,X0+s,Y0+s);if(isT(i-1,j))seg(X0,Y0,X0,Y0+s);if(isT(i+1,j))seg(X0+s,Y0,X0+s,Y0+s)}
  /* the trail: a dirt ribbon, edged then filled, with a dotted centre */
  x.lineCap='round';
  for(const pass of [0,1]){x.strokeStyle=pass?'#dcc590':'#7a5a30';x.lineWidth=pass?s*.62:s*.86;
    for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!isTrail(i,j))continue;const jx=(R(i,j,30)-.5)*s*.25,jy=(R(i,j,31)-.5)*s*.25;
      x.beginPath();x.moveTo(cx(i)+jx,cy(j)+jy);x.lineTo(cx(i)+jx+.01,cy(j)+jy);x.stroke();
      if(isTrail(i+1,j)){x.beginPath();x.moveTo(cx(i)+jx,cy(j)+jy);x.lineTo(cx(i+1)+(R(i+1,j,30)-.5)*s*.25,cy(j)+(R(i+1,j,31)-.5)*s*.25);x.stroke()}
      if(isTrail(i,j+1)){x.beginPath();x.moveTo(cx(i)+jx,cy(j)+jy);x.lineTo(cx(i)+(R(i,j+1,30)-.5)*s*.25,cy(j+1)+(R(i,j+1,31)-.5)*s*.25);x.stroke()}}}
  x.fillStyle='rgba(122,90,48,.7)';for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(isTrail(i,j)&&R(i,j,32)<.5){x.beginPath();x.arc(cx(i)+(R(i,j,33)-.5)*s*.5,cy(j)+(R(i,j,34)-.5)*s*.5,.5,0,6.3);x.fill()}}
  /* flowers: scattered over the meadows, thicker where the level has flower beds */
  const fcol=['#b8321e','#f0d878','#e8e0f0','#8a5aa8','#e8883a','#d86a8a'];
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(isT(i,j)||isTrail(i,j))continue;const n=R(i,j,40)<.3?1:0;for(let k=0;k<n+1;k++){if(!n&&R(i,j,41)>.12)continue;const a=cx(i)+(R(i,j,42+k)-.5)*s,b=cy(j)+(R(i,j,45+k)-.5)*s;x.fillStyle=fcol[Math.floor(R(i,j,48+k)*fcol.length)];x.strokeStyle='rgba(42,26,12,.55)';x.lineWidth=.3;x.beginPath();x.arc(a,b,.85,0,6.3);x.fill();x.stroke()}}
  for(const d of L.decor||[]){if(!/^lflora|^lavender/.test(d.k))continue;const a=cx(d.x)+(d.ox||0)*s,b=cy(d.y)+(d.oy||0)*s,lv=d.k==='lavender';
    for(let k=0;k<4;k++){x.fillStyle=lv?(k%2?'#7a5aa8':'#a58ad0'):fcol[(d.x*3+d.y+k)%fcol.length];x.beginPath();x.arc(a+(hash2(d.x,d.y,60+k)-.5)*s*.9,b+(hash2(d.x,d.y,70+k)-.5)*s*.9,1,0,6.3);x.fill()}
    if(lv){x.strokeStyle='#5a7a3a';x.lineWidth=.5;x.beginPath();x.moveTo(a,b+1.5);x.lineTo(a,b-1);x.stroke()}}
  /* stones, logs, stumps, bushes */
  for(const d of L.decor||[]){const a=cx(d.x)+(d.ox||0)*s,b=cy(d.y)+(d.oy||0)*s;
    if(/boulder|rocks/.test(d.k)&&d.k!=='mossstone'){x.fillStyle='#a8a090';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.ellipse(a,b,1.9,1.3,0,0,6.3);x.fill();x.stroke();x.fillStyle='rgba(255,255,240,.5)';x.beginPath();x.ellipse(a-.5,b-.4,.7,.4,0,0,6.3);x.fill()}
    else if(/^logm|^stumpm/.test(d.k)){x.fillStyle='#7a5230';x.strokeStyle=MPL.INK;x.lineWidth=.45;if(d.k[0]==='l'){x.fillRect(a-2,b-.7,4,1.4);x.strokeRect(a-2,b-.7,4,1.4)}else{x.beginPath();x.ellipse(a,b,1.3,.9,0,0,6.3);x.fill();x.stroke()}}
    else if(/^lbush/.test(d.k)){x.fillStyle=hash2(d.x,d.y,80)<.5?'#4f9055':'#6aa04c';x.strokeStyle='rgba(30,50,26,.8)';x.lineWidth=.45;x.beginPath();x.arc(a,b,1.9,0,6.3);x.fill();x.stroke();x.fillStyle='#d86a8a';if(d.k!=='lbush0'){x.beginPath();x.arc(a+.6,b-.5,.55,0,6.3);x.fill()}}}
  /* the woods: every decor tree plus a thicker fringe of pines in the solid forest, all sorted back to front so they layer */
  const T=[];
  for(const d of L.decor||[])if(/^ltree/.test(d.k)&&hash2(d.x,d.y,95)<.5)T.push({a:cx(d.x)+(d.ox||0)*s,b:cy(d.y)+(d.oy||0)*s,r:s*.42*(d.sc||1),sd:d.x*77+d.y*13+T.length,pine:false});
  const i0=Math.floor((A.x-F.ox)/s)-1,i1=Math.ceil((A.x+A.w-F.ox)/s)+1,j0=Math.floor((A.y-F.oy)/s)-1,j1=Math.ceil((A.y+A.h-F.oy)/s)+1;
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){if(!isT(i,j))continue;const nr=R(i,j,90);if(nr>.5)continue;T.push({a:cx(i)+(R(i,j,91)-.5)*s,b:cy(j)+(R(i,j,92)-.5)*s,r:s*(.55+R(i,j,93)*.35),sd:i*31+j*7,pine:R(i,j,94)<.45})}
  T.sort((p,q)=>p.b-q.b);
  for(const t of T){if(t.pine)mpGreendalePine(x,t.a,t.b,t.r,t.sd);else mpGreendaleTree(x,t.a,t.b,t.r,t.sd)}
  /* apples in the grove, honey at the bee trees */
  for(const it of L.items||[]){const a=cx(it.x),b=cy(it.y);if(it.k==='apple'){x.fillStyle=MPL.VERM;x.strokeStyle=MPL.INK;x.lineWidth=.35;x.beginPath();x.arc(a,b,1.1,0,6.3);x.fill();x.stroke()}else if(it.k==='honeycomb'){x.fillStyle=MPL.GOLD2;x.strokeStyle=MPL.INK;x.lineWidth=.45;x.beginPath();for(let k=0;k<6;k++){const an=k*Math.PI/3;x.lineTo(a+Math.cos(an)*1.7,b+Math.sin(an)*1.7)}x.closePath();x.fill();x.stroke()}}
  /* creatures and landmarks */
  for(const d of L.decor||[]){const a=cx(d.x),b=cy(d.y);
    if(d.k==='deer')mpGreendaleDeer(x,a,b,(d.sc||1)*1.05,hash2(d.x,d.y,5)<.5);
    else if(d.k==='rabbits'){mpGreendaleRabbit(x,a-2,b,.9);mpGreendaleRabbit(x,a+2.5,b+1.5,.75)}
    else if(d.k==='greensign')mpGreendaleSign(x,a,b,1);
    else if(d.k==='mossstone'){x.fillStyle='#8a9a86';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-3,b+3);x.lineTo(a-3.4,b-3);x.quadraticCurveTo(a,b-8,a+3.4,b-3);x.lineTo(a+3,b+3);x.closePath();x.fill();x.stroke();x.fillStyle='#5a9a52';x.beginPath();x.arc(a-2,b-1,1.4,0,6.3);x.arc(a+2.2,b+1,1.1,0,6.3);x.fill();MPLI.star(x,a,b-3,.7,MPL.GOLD)}
    else if(d.k==='lamp'){x.fillStyle=MPL.GOLD2;x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.arc(a,b-1,1.5,0,6.3);x.fill();x.stroke();x.beginPath();x.moveTo(a,b);x.lineTo(a,b+3);x.stroke()}}
  /* the hidden door, the gates */
  for(const p of L.portals||[]){const a=cx(p.x),b=cy(p.y);if(p.tex==='cave')mpGreendaleHidden(x,a+3,b-1,1.25);else mpGreendaleGate(x,a+(p.x<5?2:0),b+(p.y<10?2:0),1.05)}
  /* birds over the meadows */
  for(const [i,j,k] of [[20,18,1],[34,8,1.1],[48,22,.9],[12,30,1],[44,6,.8],[27,26,.9]]){mpGreendaleBird(x,cx(i),cy(j)-6,k,'#2a1a0c');mpGreendaleBird(x,cx(i)+5,cy(j)-3,k*.8,'#2a1a0c')}
  /* names: from the level if it has any, otherwise the valley's own */
  const names=named||[{t:'Greyfang Pass Gate',x:54,y:2,k:'place'},{t:'The Road to Anaea',x:7,y:16,k:'lane'},{t:'The Overgrown Hollow',x:11,y:40,k:'place'},{t:'The Moss Stone',x:31,y:16,k:'place'},{t:'The Apple Grove',x:45,y:6,k:'place'},{t:'The High Meadow',x:40,y:9,k:'place'},{t:'Bee Tree Glade',x:19,y:11,k:'place'},{t:'Deer Meadow',x:8,y:25,k:'place'},{t:'Rabbit Dell',x:38,y:33,k:'place'},{t:'Greendale Forest',x:24,y:30,k:'place'},{t:'Lavender Bank',x:56,y:22,k:'place'}];
  for(const n of names)api.text(x,n.t,cx(n.x),cy(n.y),n.k==='place'?7.6:6.6,n.k==='place'?'#1c2a10':'#5a3a1c','center');
  x.restore();
  x.strokeStyle=MPL.GOLD;x.lineWidth=1.6;x.strokeRect(A.x,A.y,A.w,A.h);x.strokeStyle=MPL.INK;x.lineWidth=.6;x.strokeRect(A.x+2,A.y+2,A.w-4,A.h-4);
  /* margins: title, key, notes, compass */
  api.title(x,'Greendale','A green valley forest');
  api.panel(x,10,58,76,112);x.save();
  api.text(x,'Key',48,67,7.5,MPL.INK,'center');
  const row=(y,t,f)=>{f(21,y);api.text(x,t,32,y,6.4,'#3a2a1c','left')};
  row(80,'Wood',(a,b)=>mpGreendaleTree(x,a,b+3,3.4,3));row(93,'Pine',(a,b)=>mpGreendalePine(x,a,b+3,3.2,3));
  row(106,'Dirt trail',(a,b)=>{x.strokeStyle='#7a5a30';x.lineWidth=4;x.lineCap='round';x.beginPath();x.moveTo(a-6,b);x.lineTo(a+5,b);x.stroke();x.strokeStyle='#dcc590';x.lineWidth=2.6;x.stroke()});
  row(119,'Pond, brook',(a,b)=>{x.fillStyle='#2e5a7a';x.beginPath();x.ellipse(a,b,5,3.2,0,0,6.3);x.fill();x.fillStyle='#8cc4d4';x.beginPath();x.ellipse(a,b,3.8,2.2,0,0,6.3);x.fill()});
  row(132,'Hidden door',(a,b)=>mpGreendaleHidden(x,a,b,.75));row(145,'Signpost',(a,b)=>mpGreendaleSign(x,a,b,.9));row(158,'Gate or road out',(a,b)=>mpGreendaleGate(x,a,b,.6));
  x.restore();
  api.panel(x,392,34,82,148);
  api.notes(x,['Greendale is a wide green valley with no soldiers and no tax collector.','Dirt trails run between the meadows. Walk the trails and the woods stay thin.','Deer graze in the west, rabbits in the south, bees in the old trees.','A mossy stone door is hidden in the bank in the south west.'],398,44,70,6.1,3);
  api.compass(x,432,236,15);
}
mplInstall({name:'greendale',levels:[32],draw:mpGreendaleDraw,foot:'You are the yellow arrow. The red star marks a hidden door.',tint:[-6,6,-8]});
