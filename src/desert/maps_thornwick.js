/* ==========================================================================
   THORNWICK: the hand-drawn parchment map of the walled market town (level 3). Drawn from the real level: the log wall, the fence round the town, the
   houses (found from the wall cells), the street, the lanes, the fountain square, the well, the dirt tracks and every tree in the forest outside.
   The other Thornwick levels (shops, inn, hall, cellar, chapel) are rooms and keep the standard map.
   ========================================================================== */
/* a painted roof seen from above, in pixels: shadow, pale wall rim, two roof slopes, shingle lines, a ridge, an optional chimney */
function mpThornwickRoof(x,a,b,c,d,col,o){
  o=o||{};const w=c-a,h=d-b,horiz=w>=h,H=hash2;
  x.save();x.fillStyle='rgba(40,26,12,.32)';x.fillRect(a+1.8,b+1.8,w,h);
  x.fillStyle='#eadfc2';x.strokeStyle=MPL.INK;x.lineWidth=.9;x.fillRect(a-.7,b-.7,w+1.4,h+1.4);x.strokeRect(a-.7,b-.7,w+1.4,h+1.4);
  const ra=a+.9,rb=b+.9,rc=c-.9,rd=d-.9,rw=rc-ra,rh=rd-rb;
  // two slopes, one lit, one in shade
  x.fillStyle=col;x.fillRect(ra,rb,rw,rh);
  x.fillStyle='rgba(255,240,200,.28)';if(horiz)x.fillRect(ra,rb,rw,rh/2);else x.fillRect(ra,rb,rw/2,rh);
  x.fillStyle='rgba(30,16,10,.26)';if(horiz)x.fillRect(ra,rb+rh/2,rw,rh/2);else x.fillRect(ra+rw/2,rb,rw/2,rh);
  // shingle rows, with the odd tile picked out
  x.strokeStyle='rgba(30,16,10,.42)';x.lineWidth=.5;
  if(horiz){for(let yy=rb+1.8;yy<rd;yy+=1.9){x.beginPath();x.moveTo(ra,yy);x.lineTo(rc,yy);x.stroke()}
    for(let yy=rb+1.8,r=0;yy<rd;yy+=1.9,r++){for(let xx=ra+(r%2)*1.4;xx<rc;xx+=2.8){x.beginPath();x.moveTo(xx,yy);x.lineTo(xx,yy+1.9);x.stroke()}}}
  else{for(let xx=ra+1.8;xx<rc;xx+=1.9){x.beginPath();x.moveTo(xx,rb);x.lineTo(xx,rd);x.stroke()}
    for(let xx=ra+1.8,r=0;xx<rc;xx+=1.9,r++){for(let yy=rb+(r%2)*1.4;yy<rd;yy+=2.8){x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+1.9,yy);x.stroke()}}}
  for(let i=0;i<Math.round(rw*rh/40);i++){x.fillStyle=H(i,a*7+b,91)<.5?'rgba(255,235,190,.3)':'rgba(20,10,6,.2)';x.fillRect(ra+H(i,1,92+a)*rw,rb+H(i,2,93+b)*rh,2.4,1.5)}
  // the ridge
  x.strokeStyle=o.ridge||'#2a1a0c';x.lineWidth=1.3;x.beginPath();if(horiz){x.moveTo(ra-.4,rb+rh/2);x.lineTo(rc+.4,rb+rh/2)}else{x.moveTo(ra+rw/2,rb-.4);x.lineTo(ra+rw/2,rd+.4)}x.stroke();
  if(o.ridge){x.strokeStyle='#2a1a0c';x.lineWidth=.4;x.beginPath();if(horiz){x.moveTo(ra,rb+rh/2+.9);x.lineTo(rc,rb+rh/2+.9)}else{x.moveTo(ra+rw/2+.9,rb);x.lineTo(ra+rw/2+.9,rd)}x.stroke()}
  x.strokeStyle=MPL.INK;x.lineWidth=.9;x.strokeRect(ra,rb,rw,rh);
  if(o.chim!==false){const cx=horiz?ra+rw*(o.cf||.72):ra+rw*.28,cy=horiz?rb+rh*.22:rb+rh*(o.cf||.72);x.fillStyle='#b8a888';x.fillRect(cx-1.5,cy-1.5,3,3);x.strokeRect(cx-1.5,cy-1.5,3,3);x.fillStyle='#2a1a0c';x.fillRect(cx-.6,cy-.6,1.2,1.2);
    if(!o.nosmoke){x.strokeStyle='rgba(90,80,70,.55)';x.lineWidth=.8;x.beginPath();x.moveTo(cx,cy-2);x.bezierCurveTo(cx-2.5,cy-4,cx+2.5,cy-5,cx,cy-8);x.stroke()}}
  x.restore()}
/* a log stake, seen from above: a small round end */
function mpThornwickStake(x,a,b,r){x.fillStyle='#8a5a30';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();x.stroke();x.fillStyle='rgba(240,210,150,.55)';x.beginPath();x.arc(a-r*.25,b-r*.25,r*.45,0,6.3);x.fill()}
/* a corner or gate tower seen from above: a square with a little pointed roof */
function mpThornwickTower(x,a,b,r,col){x.save();x.fillStyle='rgba(40,26,12,.3)';x.fillRect(a-r+1.4,b-r+1.4,2*r,2*r);x.fillStyle='#cfc6ae';x.strokeStyle=MPL.INK;x.lineWidth=.9;x.fillRect(a-r,b-r,2*r,2*r);x.strokeRect(a-r,b-r,2*r,2*r);
  const q=r*.78;x.fillStyle=col||MPL.VERM;x.beginPath();x.moveTo(a-q,b-q);x.lineTo(a+q,b-q);x.lineTo(a,b);x.closePath();x.fill();x.stroke();x.fillStyle='rgba(30,16,10,.3)';x.beginPath();x.moveTo(a-q,b+q);x.lineTo(a+q,b+q);x.lineTo(a,b);x.closePath();x.fill();x.stroke();
  x.fillStyle='rgba(255,240,200,.3)';x.beginPath();x.moveTo(a-q,b-q);x.lineTo(a-q,b+q);x.lineTo(a,b);x.closePath();x.fill();x.stroke();x.restore()}

mplInstall({name:'thornwick',levels:[3],foot:'You are the yellow arrow. Thornwick, inside its ring of log walls.',tint:[2,4,-2],
draw(c,x,L,api){
  const S=api.fit(L.rows[0].length,L.rows.length),s=S.s,X=S.X,Y=S.Y,H=hash2,W=L.rows[0].length,HT=L.rows.length,INK=MPL.INK;
  const inTown=(cx,cy)=>cx>=11&&cx<=38&&cy>=9&&cy<=27;
  const dec=L.decor||[];
  // the land inside the log wall: a green wash, uneven, with patches of lighter and darker grass
  x.save();x.fillStyle='rgba(120,150,84,.62)';x.fillRect(X(.5),Y(.5),(W-1)*s,(HT-1)*s);
  x.beginPath();x.rect(X(.5),Y(.5),(W-1)*s,(HT-1)*s);x.clip();
  for(let i=0;i<70;i++){x.fillStyle=i%2?'rgba(86,120,70,.2)':'rgba(190,200,120,.2)';x.beginPath();x.ellipse(X(H(i,1,3)*W),Y(H(i,2,3)*HT),s*(3+H(i,3,3)*7),s*(2+H(i,4,3)*4),H(i,5,3)*3,0,6.3);x.fill()}
  // grass tufts
  x.strokeStyle='rgba(50,86,50,.7)';x.lineWidth=.6;for(let i=0;i<900;i++){const a=X(1+H(i,1,4)*(W-2)),b=Y(1+H(i,2,4)*(HT-2));x.beginPath();x.moveTo(a-1.2,b);x.lineTo(a-.3,b-2.2);x.moveTo(a,b);x.lineTo(a,b-2.6);x.moveTo(a+1.2,b);x.lineTo(a+.4,b-2)  ;x.stroke()}
  // the dirt tracks (floor type 2), the outer ones, read from the real floor map
  const dirt='rgba(196,152,96,.96)';
  for(let cy=1;cy<HT-1;cy++)for(let cx=1;cx<W-1;cx++){if(L.fmap[cy][cx]==='2'&&L.rows[cy][cx]==='.'){x.fillStyle=dirt;const j=(H(cx,cy,5)-.5)*.5;x.beginPath();x.ellipse(X(cx+.5)+j,Y(cy+.5)+j,s*.62,s*.6,0,0,6.3);x.fill()}}
  // the main street: Market Street, west gate to east gate (the open rows 15 to 18), and the lanes between the houses
  x.fillStyle=dirt;x.fillRect(X(.6),Y(15.3),(W-1.2)*s,3.4*s);
  x.fillStyle='rgba(150,106,60,.35)';x.fillRect(X(.6),Y(15.3),(W-1.2)*s,.7*s);x.fillRect(X(.6),Y(18.1),(W-1.2)*s,.6*s);
  for(const [lx,y0,y1] of [[15,10,15.4],[22,10,15.4],[28,10,15.4],[32,10,15.4],[15,18.6,27],[23,18.6,27],[29,18.6,27]]){x.fillStyle=dirt;x.fillRect(X(lx),Y(y0),s,(y1-y0)*s)}
  x.fillStyle='rgba(150,106,60,.35)';for(const lx of [15,22,28,32,23,29])for(const sx of [0,.92]){x.fillRect(X(lx)+sx*s,Y(10),.8,5.4*s)}
  // the worn ground round the well and behind the shops
  x.fillStyle='rgba(196,152,96,.55)';x.beginPath();x.ellipse(X(35.5),Y(21.5),s*2.4,s*2.1,0,0,6.3);x.fill();
  // road pebbles
  for(let i=0;i<340;i++){const a=X(.8+H(i,1,6)*(W-1.6)),b=Y(15.4+H(i,2,6)*3.2);x.fillStyle=i%3?'rgba(120,84,48,.55)':'rgba(236,214,170,.7)';x.fillRect(a,b,1.1,.9)}
  // wheel ruts
  x.strokeStyle='rgba(120,84,48,.45)';x.lineWidth=.6;for(const yy of [16.6,17.4]){x.beginPath();x.moveTo(X(.8),Y(yy));for(let i=1;i<=40;i++)x.lineTo(X(.8+i*(W-1.6)/40),Y(yy+Math.sin(i*1.3)*.07));x.stroke()}
  // the square: pale paving round the fountain
  x.fillStyle='#d9cfae';x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.rect(X(23.6),Y(15.3),8.4*s,3.4*s);x.fill();x.stroke();
  for(let gy=0;gy<7;gy++)for(let gx=0;gx<18;gx++){const a=X(23.6)+gx*(8.4*s/18),b=Y(15.3)+gy*(3.4*s/7);x.strokeStyle='rgba(110,92,64,.5)';x.lineWidth=.45;x.strokeRect(a+(gy%2)*1.1,b,8.4*s/18,3.4*s/7)}
  x.restore();
  // the forest outside the town: every tree, in rows from the back to the front, in several greens
  const greens=['#3d6b45','#4a7a4a','#2f5a3c','#587f48','#35603f','#6a8a4a','#7a8a3a'],trees=[],bits=[];
  for(const d of dec){const k=d.k;
    if(/^(ptree|gtree|pjuniper)/.test(k)){if(inTown(d.x,d.y))continue;trees.push(d)}
    else if(/^(pheather|pbracken|greeds|grocks|gboulder)/.test(k)&&!inTown(d.x,d.y))bits.push(d)}
  for(const d of bits){if(H(d.x,d.y,11)<.5)continue;const a=X(d.x+.5+(H(d.x,d.y,12)-.5)*.5),b=Y(d.y+.6+(H(d.x,d.y,13)-.5)*.4);
    if(/rock|boulder/.test(d.k)){x.fillStyle='#a69a84';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.ellipse(a,b,1.9,1.3,0,0,6.3);x.fill();x.stroke();x.fillStyle='rgba(255,250,235,.45)';x.beginPath();x.ellipse(a-.5,b-.4,.8,.5,0,0,6.3);x.fill()}
    else if(d.k==='pheather'){x.fillStyle=H(d.x,d.y,14)<.5?'rgba(140,90,130,.8)':'rgba(100,70,110,.8)';for(let q=0;q<3;q++){x.fillRect(a+(q-1)*1.2,b-1+(q%2),.9,.9)}}
    else{x.strokeStyle=d.k==='pbracken'?'rgba(70,110,50,.9)':'rgba(70,120,80,.9)';x.lineWidth=.6;x.beginPath();x.moveTo(a,b);x.lineTo(a-1.6,b-2.6);x.moveTo(a,b);x.lineTo(a+1.6,b-2.4);x.moveTo(a,b);x.lineTo(a,b-3);x.stroke()}}
  trees.sort((p,q)=>p.y-q.y||p.x-q.x);
  for(const d of trees){const a=X(d.x+.5+(H(d.x,d.y,15)-.5)*.5),b=Y(d.y+.8+(H(d.x,d.y,16)-.5)*.3),sc=.5+H(d.x,d.y,17)*.14,col=greens[Math.floor(H(d.x,d.y,18)*greens.length)];
    if(d.k.startsWith('pjuniper')){x.fillStyle='#4c7a62';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.ellipse(a,b-1,2,2.3,0,0,6.3);x.fill();x.stroke()}
    else if(d.k.startsWith('gtree')||H(d.x,d.y,19)<.3){MPLI.tree(x,a,b,sc,col)}
    else{x.fillStyle='#2f5a3c';MPLI.pine(x,a,b,sc*.95)}}
  // a rough scatter of tiny flowers in the long grass of the town
  for(const d of dec){if(/^flora/.test(d.k)){const a=X(d.x+.5),b=Y(d.y+.6);x.fillStyle=['#c8402e','#e8d050','#f0e8f0','#6a7ac8','#d88aa8'][(d.x+d.y)%5];for(let q=0;q<3;q++){x.beginPath();x.arc(a+(q-1)*1.8,b+(q%2)*1.2,.9,0,6.3);x.fill()}}}
  // the log wall: stakes all round, with towers at the corners and at the two gates
  const stakes=(x0,y0,x1,y1,gap)=>{const n=Math.round(Math.hypot(x1-x0,y1-y0)*2.4);for(let i=0;i<=n;i++){const t=i/n,px=x0+(x1-x0)*t,py=y0+(y1-y0)*t;if(gap&&gap(px,py))continue;mpThornwickStake(x,X(px)+(H(i,1,21)-.5)*.5,Y(py)+(H(i,2,21)-.5)*.5,1.35+H(i,3,21)*.35)}};
  x.save();x.strokeStyle='rgba(60,36,16,.55)';x.lineWidth=2.6;x.strokeRect(X(.5),Y(.5),(W-1)*s,(HT-1)*s);x.restore();
  const gapG=(px,py)=>(px<3||px>W-3)&&py>15.6&&py<18.4;
  stakes(.5,.5,W-.5,.5);stakes(.5,HT-.5,W-.5,HT-.5);stakes(.5,.5,.5,HT-.5,gapG);stakes(W-.5,.5,W-.5,HT-.5,gapG);
  for(const [tx,ty,col] of [[.5,.5],[W-.5,.5],[.5,HT-.5],[W-.5,HT-.5],[.5,15.7,MPL.LAPIS],[.5,18.3,MPL.LAPIS],[W-.5,15.7,MPL.LAPIS],[W-.5,18.3,MPL.LAPIS]])mpThornwickTower(x,X(tx),Y(ty),3.1,col);
  // the gate beams across the two gateways, in dark timber
  x.strokeStyle='#4a2c14';x.lineWidth=1.4;for(const gx of [.5,W-.5]){x.beginPath();x.moveTo(X(gx),Y(16.1));x.lineTo(X(gx),Y(18));x.stroke()}
  // the fence round the town and the little yard fences, drawn post to post
  const fence=new Set(dec.filter(d=>d.k==='fence').map(d=>d.x+','+d.y));
  x.lineCap='round';for(const d of dec){if(d.k!=='fence')continue;const a=X(d.x+.5),b=Y(d.y+.5);
    for(const [dx,dy] of [[1,0],[2,0],[0,1]]){if(fence.has((d.x+dx)+','+(d.y+dy))&&!(dx===2&&fence.has((d.x+1)+','+d.y))){x.strokeStyle='#6a4220';x.lineWidth=1.5;x.beginPath();x.moveTo(a,b);x.lineTo(X(d.x+dx+.5),Y(d.y+dy+.5));x.stroke();x.strokeStyle='#c8a060';x.lineWidth=.6;x.beginPath();x.moveTo(a,b-.3);x.lineTo(X(d.x+dx+.5),Y(d.y+dy+.5)-.3);x.stroke()}}}
  for(const d of dec){if(d.k!=='fence')continue;x.fillStyle='#4a2c14';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),1.1,0,6.3);x.fill()}
  // vegetable rows and bushes in the front yards
  for(const d of dec){if(d.k!=='veg'&&d.k!=='bush')continue;const a=X(d.x+.5),b=Y(d.y+.5);
    if(d.k==='veg'){x.fillStyle='rgba(110,78,44,.8)';x.fillRect(a-s*.45,b-s*.4,s*.9,s*.8);for(let r=0;r<3;r++){x.strokeStyle=r%2?'#4a8a3a':'#6aa04a';x.lineWidth=1;x.beginPath();x.moveTo(a-s*.4,b-s*.25+r*s*.25);x.lineTo(a+s*.4,b-s*.25+r*s*.25);x.stroke()}}
    else{x.fillStyle='#4a7a46';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(a,b,s*.42,0,6.3);x.fill();x.stroke();x.fillStyle='#c8402e';x.beginPath();x.arc(a-1,b-.8,.7,0,6.3);x.arc(a+1.2,b+.5,.7,0,6.3);x.fill()}}
  // trees inside the town
  for(const d of dec){if(/^tree\d/.test(d.k)){MPLI.tree(x,X(d.x+.5),Y(d.y+.9),.85,d.k==='tree6'?'#6a8a3a':'#4a7a46')}}
  // the houses
  const B=[ // [x0,y0,x1,y1 (cells, inclusive), roof colour]
    [12,10,14,14,'#c08a3a'],[16,10,21,15,'#7a8f86',{ridge:'#4a5a52',nosmoke:1}],[23,10,27,15,MPL.VERM,{ridge:MPL.GOLD}],[29,10,31,14,'#4f6fb0'],
    [16,19,22,24,'#c9792e'],[24,19,28,22,'#3f8a68'],[30,19,34,22,'#a8342a',{ridge:MPL.GOLD2,cf:.3}],[12,21,14,24,'#8a4a6a']];
  for(const [x0,y0,x1,y1,col,o] of B)mpThornwickRoof(x,X(x0)+.6,Y(y0)+.6,X(x1+1)-.6,Y(y1+1)-.6,col,o);
  // the empty house: boarded, so two dark planks across the door side
  x.strokeStyle='#2a1a0c';x.lineWidth=1.2;x.beginPath();x.moveTo(X(17.2),Y(15.6));x.lineTo(X(18.2),Y(16.2));x.moveTo(X(17.2),Y(16.2));x.lineTo(X(18.2),Y(15.6));x.stroke();
  // the church: a long nave, a short transept, a square bell tower with a gold cross
  {const a=X(33)+.6,b=Y(10)+.6,c2=X(38)-.6,d2=Y(15)-.6;mpThornwickRoof(x,a,b+s*.9,c2,d2-s*.9,MPL.LAPIS,{ridge:MPL.GOLD,chim:false});mpThornwickRoof(x,X(35.2),Y(9.7),X(36.8),Y(15.3),'#3a5aa0',{ridge:MPL.GOLD,chim:false});
    mpThornwickTower(x,X(33.9),Y(10.9),4.2,MPL.LAPIS);x.strokeStyle=MPL.GOLD2;x.lineWidth=1.3;x.beginPath();x.moveTo(X(33.9),Y(10.9)-3);x.lineTo(X(33.9),Y(10.9)+3);x.moveTo(X(33.9)-2.2,Y(10.9)-.4);x.lineTo(X(33.9)+2.2,Y(10.9)-.4);x.stroke()}
  // the mayor's banner and the inn's gold board
  x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.moveTo(X(23.9),Y(10.8));x.lineTo(X(23.9),Y(9.3));x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.moveTo(X(23.9),Y(9.3));x.lineTo(X(25.2),Y(9.65));x.lineTo(X(23.9),Y(10.05));x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD2;x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(X(32.1),Y(18.7),s*1.3,s*.55);x.strokeRect(X(32.1),Y(18.7),s*1.3,s*.55);
  // doors: a small dark step at each door cell, on the street side
  x.fillStyle='#3a2210';for(const [dx,dy] of [[17.2,15.1],[25,15.1],[35.2,14.9],[20.9,18.6],[26,18.6],[32,18.6],[13,14.9],[30,14.9],[13,20.7]])x.fillRect(X(dx)-1.6,Y(dy),3.2,2.2);
  // the fountain and the well, from above
  const fx=X(27.5),fy=Y(16.5);x.fillStyle='#d8d0b8';x.strokeStyle=INK;x.lineWidth=.9;x.beginPath();x.arc(fx,fy,s*.95,0,6.3);x.fill();x.stroke();x.fillStyle='#6aa8d8';x.beginPath();x.arc(fx,fy,s*.68,0,6.3);x.fill();x.stroke();x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=.6;x.beginPath();x.arc(fx,fy,s*.4,.3,2.4);x.stroke();x.fillStyle='#e8dcc0';x.beginPath();x.arc(fx,fy,1.3,0,6.3);x.fill();x.stroke();
  const wx=X(35.5),wy=Y(21.5);x.fillStyle='#a8a090';x.strokeStyle=INK;x.lineWidth=.9;x.beginPath();x.arc(wx,wy,s*.8,0,6.3);x.fill();x.stroke();x.fillStyle='#1c2a3a';x.beginPath();x.arc(wx,wy,s*.5,0,6.3);x.fill();x.stroke();x.strokeStyle='#5a3a1c';x.lineWidth=1.3;x.beginPath();x.moveTo(wx-s*.9,wy);x.lineTo(wx+s*.9,wy);x.stroke();
  // the statue by the street
  x.fillStyle='#cfc6ae';x.strokeStyle=INK;x.lineWidth=.8;x.fillRect(X(32.3),Y(15.4),s*.6,s*.6);x.strokeRect(X(32.3),Y(15.4),s*.6,s*.6);MPLI.star(x,X(32.6),Y(15.7),.5);
  // barrels, crates, a cart
  for(const d of dec){if(d.k==='barrel'){x.fillStyle='#8a5a30';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),1.9,0,6.3);x.fill();x.stroke();x.strokeStyle='rgba(30,16,10,.6)';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),1,0,6.3);x.stroke()}
    else if(d.k==='crate'){x.fillStyle='#b8884a';x.strokeStyle=INK;x.lineWidth=.6;x.fillRect(X(d.x+.5)-1.8,Y(d.y+.5)-1.8,3.6,3.6);x.strokeRect(X(d.x+.5)-1.8,Y(d.y+.5)-1.8,3.6,3.6)}
    else if(d.k==='cart'){const a=X(d.x+.5),b=Y(d.y+.5);x.fillStyle='#a87a40';x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(a-4,b-2.6,8,5.2);x.strokeRect(a-4,b-2.6,8,5.2);x.fillStyle='#3a2210';x.fillRect(a-2.6,b-3.6,1.6,1);x.fillRect(a+1,b-3.6,1.6,1);x.fillRect(a-2.6,b+2.6,1.6,1);x.fillRect(a+1,b+2.6,1.6,1)}
    else if(d.k==='lamp'){x.fillStyle=MPL.GOLD2;x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),1,0,6.3);x.fill();x.stroke()}}
  // birds over the forest
  x.strokeStyle=INK;x.lineWidth=.8;for(const [bx,by] of [[6,6],[8,4.6],[7.4,8],[41,5],[43,6.8],[45,4.8],[5,30],[7,31.5],[44,31]]){const a=X(bx),b=Y(by);x.beginPath();x.moveTo(a-3,b-1);x.quadraticCurveTo(a-1.4,b-3,a,b);x.quadraticCurveTo(a+1.4,b-3,a+3,b-1);x.stroke()}
  // names: the places, the street, the gates
  const T=(t,cx,cy,sz,col)=>api.text(x,t,X(cx),Y(cy),sz||6.8,col||INK,'center');
  T('The Empty House',18.5,7.9);T("Mayor's House",25,6.5);T('Thornwick Chapel',35.5,7.9);
  T('The Bakery',19,25.9);T("Aldous's Store",25.8,23.9);T('The Bickering Goat',33.2,26.3);
  T('Market Street',6.2,17.7,6.6,'#5a3410');T('Fountain Square',27.5,19.6,6.4,'#3a2a1c');T('The Well',37.3,23.7,5.8,'#3a2a1c');
  T('West Gate',4.6,20.4,6.8,MPL.LAPIS);T('East Gate',45.2,20.4,6.8,MPL.LAPIS);T("To Gandrick's Wood",44,22.2,5.8,'#5a3410');T('The Forest',45,10,6.6,'#2a4a2c');T('The Forest',5.4,10,6.6,'#2a4a2c');
  // margins: title, key, compass, notes
  api.title(x,'Thornwick','A walled market town');
  api.panel(x,8,56,78,132);api.text(x,'Key',47,64,7.2,MPL.VERM,'center');
  const ky=[[ 'Painted roof',()=>{x.fillStyle=MPL.VERM;x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(12,70,13,8);x.strokeRect(12,70,13,8);x.beginPath();x.moveTo(12,74);x.lineTo(25,74);x.stroke()}],
    ['Church',()=>{x.fillStyle=MPL.LAPIS;x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(12,83,13,7);x.strokeRect(12,83,13,7);x.fillRect(15,80,5,5);x.strokeStyle=MPL.GOLD2;x.beginPath();x.moveTo(17.5,80);x.lineTo(17.5,86);x.stroke()}],
    ['Road and lane',()=>{x.fillStyle='rgba(196,152,96,1)';x.fillRect(12,97,13,5);x.strokeStyle='rgba(120,84,48,.6)';x.lineWidth=.6;x.strokeRect(12,97,13,5)}],
    ['Fence',()=>{x.strokeStyle='#6a4220';x.lineWidth=1.5;x.beginPath();x.moveTo(12,111);x.lineTo(25,111);x.stroke();x.fillStyle='#4a2c14';for(const q of [12.5,18.5,24.5]){x.beginPath();x.arc(q,111,1.1,0,6.3);x.fill()}}],
    ['Log wall',()=>{for(let q=0;q<5;q++)mpThornwickStake(x,13+q*2.7,124,1.35)}],
    ['Gate tower',()=>mpThornwickTower(x,18.5,137,3.4,MPL.LAPIS)],
    ['Forest',()=>{MPLI.pine(x,15,152,.7);MPLI.tree(x,22,152,.6)}],
    ['Fountain, well',()=>{x.fillStyle='#6aa8d8';x.strokeStyle=INK;x.lineWidth=.7;x.beginPath();x.arc(15,166,3.4,0,6.3);x.fill();x.stroke();x.fillStyle='#1c2a3a';x.beginPath();x.arc(23,166,3.2,0,6.3);x.fill();x.stroke()}]];
  ky.forEach(([t,f],i)=>{x.save();f();x.restore();api.text(x,t,29,73+i*13.2,6.2,'#3a2a1c','left')});
  api.compass(x,46,236,15);
  api.panel(x,392,40,84,236);
  api.notes(x,['Thornwick is a small timber town inside a ring of log walls, with a gate at each end of the main street.','Market Street runs from the west gate to the east gate, past the fountain square.','The mayor lives on the north side. The inn, the store and the bakery face the street from the south.','The east gate is barred. Only the mayor can order it opened.','Goats wander the lanes and the back yards.'],398,50,72,6.2,4);
}});
