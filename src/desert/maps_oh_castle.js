/* Oldhaven map section castle (order 10): the Castle of King Osric, its ward, gardens, keep, halls, towers, gatehouse and the Land Gate.
   Real cells: curtain wall x49..99 y6..41 (two thick), gate passage x73..75, keep x63..85 y8..19, halls x53..61 / x87..95 y9..15, rose garden 54..69 x 23..36,
   cloister garden 79..94 x 23..36, two small orchards, gravel walk x73..75 y20..40, Land Gate x100..101 y4..5 between towers x96..105. */
MPOH.push({order:15,name:'castle',paint(x,L,api,fit){
  const X=fit.X,Y=fit.Y,s=fit.s,I=api.I,INK='#2a1a0c',HH=(a,b,k)=>hash2(a,b,k+310);
  x.beginPath();x.rect(X(43),Y(-2),X(107.5)-X(43),Y(47.5)-Y(-2));x.clip();
  const STONE='#d3c8ac',STONE2='#c2b695',SLATE='#6f7f9c',TERRA='#b5593a',LAWN='#b6c184',GRAV='#dccb9c',ROAD='#d6c8a4';
  const fr=(a,b,c,d,fill)=>{x.fillStyle=fill;x.fillRect(X(a),Y(b),(c-a)*s,(d-b)*s)};
  const wl=(a,b,c,d,lw,col)=>{ // wobbly pen line between two cell points
    x.strokeStyle=col||INK;x.lineWidth=lw||.5;x.lineCap='round';x.beginPath();x.moveTo(X(a),Y(b));
    const n=Math.max(1,Math.round(Math.hypot(c-a,d-b)/2.5));
    for(let i=1;i<=n;i++){const t=i/n,j=i<n?.1:0;x.lineTo(X(a+(c-a)*t+(HH(a+i,b,1)-.5)*j*2),Y(b+(d-b)*t+(HH(c,b+i,2)-.5)*j*2))}x.stroke()};
  const box=(a,b,c,d,lw,col)=>{wl(a,b,c,b,lw,col);wl(c,b,c,d,lw,col);wl(c,d,a,d,lw,col);wl(a,d,a,b,lw,col)};
  const dot=(a,b,r,fill,ink)=>{x.fillStyle=fill;x.beginPath();x.arc(X(a),Y(b),r*s,0,6.3);x.fill();if(ink){x.strokeStyle=INK;x.lineWidth=.4;x.stroke()}};
  const flag=(a,b,h,w,col)=>{x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.moveTo(X(a),Y(b));x.lineTo(X(a),Y(b)-h);x.stroke();x.fillStyle=col||MPL.VERM;x.beginPath();x.moveTo(X(a),Y(b)-h);x.lineTo(X(a)+w,Y(b)-h+w*.4);x.lineTo(X(a),Y(b)-h+w*.8);x.closePath();x.fill();x.lineWidth=.3;x.stroke()};
  // pitched roof seen on the plan: colour wash, tile rows, a ridge and a dark rim
  const roof=(a,b,c,d,col,horiz)=>{fr(a,b,c,d,col);x.strokeStyle='rgba(42,26,12,.35)';x.lineWidth=.3;
    if(horiz){for(let v=b+.9;v<d;v+=.9)wl(a+.2,v,c-.2,v,.3,'rgba(42,26,12,.32)');wl(a,(b+d)/2,c,(b+d)/2,.7,'rgba(255,240,200,.85)')}
    else{for(let u=a+.9;u<c;u+=.9)wl(u,b+.2,u,d-.2,.3,'rgba(42,26,12,.32)');wl((a+c)/2,b,(a+c)/2,d,.7,'rgba(255,240,200,.85)')}
    box(a,b,c,d,.55)};
  // round tower: stone drum, inner ring, conical roof with spokes, a pennant
  const tower=(cx,cy,r,roofc,fl)=>{dot(cx,cy,r,STONE2,1);x.strokeStyle=INK;x.lineWidth=.3;x.beginPath();x.arc(X(cx),Y(cy),r*s*.82,0,6.3);x.stroke();
    for(let k=0;k<8;k++){const an=k*Math.PI/4+.2;dot(cx+Math.cos(an)*r*.93,cy+Math.sin(an)*r*.93,.22,STONE,0)}
    dot(cx,cy,r*.66,roofc,1);x.strokeStyle='rgba(255,240,200,.6)';x.lineWidth=.3;for(let k=0;k<8;k++){const an=k*Math.PI/4;x.beginPath();x.moveTo(X(cx),Y(cy));x.lineTo(X(cx+Math.cos(an)*r*.66),Y(cy+Math.sin(an)*r*.66));x.stroke()}
    if(fl)flag(cx,cy,r*s*1.6,r*s*1.1,fl===1?MPL.VERM:fl===2?MPL.LAPIS:MPL.GOLD)};

  /* ---- the ward: lawn, grass tufts, the gravel walk ---- */
  x.globalAlpha=.75;fr(51,8,98,40,LAWN);x.globalAlpha=1;
  for(let cy=8;cy<40;cy++)for(let cx=51;cx<98;cx++){const h=HH(cx,cy,3);if(h<.3){const a=cx+HH(cx,cy,4),b=cy+HH(cx,cy,5);x.strokeStyle=h<.12?'#5e7a40':'#7f9556';x.lineWidth=.3;x.beginPath();x.moveTo(X(a)-.8,Y(b));x.lineTo(X(a)-.2,Y(b)-1.3);x.moveTo(X(a)+.8,Y(b));x.lineTo(X(a)+.2,Y(b)-1.3);x.moveTo(X(a),Y(b));x.lineTo(X(a),Y(b)-1.6);x.stroke()}}
  fr(73,19.5,76,40.5,GRAV);wl(73,20,73,40,.5,'#8a7448');wl(76,20,76,40,.5,'#8a7448');
  for(let i=0;i<150;i++){dot(73.1+HH(i,1,6)*2.8,20+HH(i,2,6)*20,.1,i%3?'#b09a68':'#f4ead0',0)}
  // flower beds beside the walk, topiary and lamps
  for(let yy=21;yy<=37;yy+=2)for(const xx of [72,76]){for(let k=0;k<3;k++)dot(xx+.2+HH(xx+k,yy,7)*.7,yy+.2+HH(xx,yy+k,8)*.7,.28,['#c8423a','#e8a0a8','#e6c84a'][(xx+yy+k)%3],0)}
  for(let yy=22;yy<=38;yy+=4)for(const xx of [71,77]){dot(xx+.5,yy+.5,.8,'#4c7a42',1);dot(xx+.35,yy+.35,.3,'#7aa468',0)}
  for(let yy=23;yy<=39;yy+=4)for(const xx of [73,75.9])dot(xx+.05,yy,.22,MPL.GOLD2,1);

  /* ---- walled gardens ---- */
  const garden=(x0,y0,x1,y1,gap,fill)=>{
    fr(x0,y0,x1+1,y1+1,STONE);fr(x0+1,y0+1,x1,y1,fill);
    if(gap)for(const g of gap)fr(g[0],g[1],g[0]+1,g[1]+1,GRAV);
    box(x0,y0,x1+1,y1+1,.5);box(x0+1,y0+1,x1,y1,.3);
    for(let u=x0;u<=x1;u++){wl(u+.5,y0+.1,u+.5,y0+.8,.25,'rgba(42,26,12,.35)');wl(u+.5,y1+.2,u+.5,y1+.9,.25,'rgba(42,26,12,.35)')}
    const cx=(x0+x1)>>1,cy=(y0+y1)>>1;fr(x0+1,cy,x1,cy+1,GRAV);fr(cx,y0+1,cx+1,y1,GRAV);
    if(gap)for(const g of gap)fr(g[0],g[1],g[0]+1,g[1]+1,GRAV);
    return [cx,cy]};
  // rose garden
  {const [cx,cy]=garden(54,23,69,36,[[69,29],[69,30]],'#a9bc7a');
    for(let yy=25;yy<35;yy+=2)for(const xx of [56,67])dot(xx+.5,yy+.5,.62,'#3f7048',1);
    for(let yy=25;yy<35;yy+=2)for(const xx of [cx-2,cx+2]){if(yy===cy||yy===cy+1)continue;for(let k=0;k<4;k++)dot(xx+HH(xx,yy+k,9)*1.1,yy+HH(xx+k,yy,10)*1.1,.3,['#c63a3a','#e58a9a','#f2d4d8','#b8321e'][k],0)}
    dot(cx+.5,cy+.5,1.7,'#e8dfc6',1);dot(cx+.5,cy+.5,1.2,MPL.LAPIS,1);dot(cx+.5,cy+.5,.35,'#f4f0e0',0);x.strokeStyle='rgba(240,248,255,.9)';x.lineWidth=.3;x.beginPath();x.arc(X(cx+.5),Y(cy+.5),.8*s,0,6.3);x.stroke();
    for(const [bx,by] of [[cx-1,cy-2],[cx+1,cy+2]]){fr(bx,by,bx+1,by+.5,'#7a5530');box(bx,by,bx+1,by+.5,.25)}}
  // cloister garden
  {const [cx,cy]=garden(79,23,94,36,[[79,29],[79,30]],'#b1c283');
    dot(cx+.5,cy+.5,1.1,'#cfc4a8',1);dot(cx+.5,cy+.5,.65,'#2b4a6a',1);
    for(const [bx,by] of [[cx-2,cy],[cx+2,cy]]){fr(bx,by,bx+.6,by+1,'#7a5530');box(bx,by,bx+.6,by+1,.25)}
    for(const xx of [81,92])for(const yy of [25,34])for(let k=0;k<5;k++)dot(xx+HH(xx,yy+k,11)*1.5,yy+HH(xx+k,yy,12)*1.5,.28,['#d6b43c','#c8423a','#e8a0a8','#8a6ac8','#f4ead0'][k],0)}
  // two little orchards
  for(const [x0,x1] of [[53,60],[88,95]]){const g=[[x1===60?60:88,19],[x1===60?60:88,20]];garden(x0,18,x1,21,g,'#adbd7c');
    for(let k=0;k<3;k++){const tx=x0+2+k*2.2;I.tree(x,X(tx+.5),Y(20),.42,'#5d8a4c')}}

  /* ---- oaks of the ward ---- */
  for(const [ox,oy] of [[52,30],[96,30],[60,38],[88,38],[66,38],[82,38],[71,21],[77,21],[52,22],[96,22],[52,37],[96,37]])I.tree(x,X(ox+.5),Y(oy+1),.5);

  /* ---- the long halls beside the keep ---- */
  for(const [hx0,hx1] of [[53,62],[87,96]]){fr(hx0-.4,8.7,hx1+.4,16.3,STONE);box(hx0-.4,8.7,hx1+.4,16.3,.5);roof(hx0+.3,9.3,hx1-.3,15.7,TERRA,false);
    for(let k=0;k<4;k++){const wx=hx0+1.2+k*2.1;fr(wx,15.9,wx+.55,16.3,'#3a2a1c')}}

  /* ---- the keep: a stone block with a battlemented walk, a slate roof, turrets at the corners, the palace doors on the south face ---- */
  fr(63,7.8,86,20.2,STONE);box(63,7.8,86,20.2,.7);box(64.2,9,84.8,19,.4);
  for(let u=63.3;u<85.7;u+=1.15){fr(u,7.8,u+.55,8.5,STONE2);x.strokeStyle=INK;x.lineWidth=.25;x.strokeRect(X(u),Y(7.8),.55*s,.7*s);fr(u,19.5,u+.55,20.2,STONE2);x.strokeRect(X(u),Y(19.5),.55*s,.7*s)}
  for(let v=8.5;v<19.5;v+=1.15){x.strokeStyle=INK;x.lineWidth=.25;for(const ux of [63,85.3]){fr(ux,v,ux+.7,v+.55,STONE2);x.strokeRect(X(ux),Y(v),.7*s,.55*s)}}
  roof(66,10.2,83,17.6,SLATE,false);
  fr(70.5,10.2,77.5,17.6,'#59688a');for(let v=10.9;v<17.6;v+=.9)wl(70.6,v,77.4,v,.3,'rgba(240,230,200,.25)');box(70.5,10.2,77.5,17.6,.55);wl(74,10.2,74,17.6,.7,'rgba(255,240,200,.85)');
  dot(74,13.9,1.3,MPL.GOLD,1);dot(74,13.9,.55,MPL.VERM,1);
  for(const [tx,ty,c] of [[64.2,9,1],[84.8,9,1],[64.2,19,1],[84.8,19,1]])tower(tx,ty,1.9,MPL.LAPIS,c?1:0);
  fr(73,18.6,76,20.9,'#3a2a1c');x.fillStyle=MPL.GOLD;x.beginPath();x.arc(X(74.5),Y(18.6),1.5*s,0,Math.PI);x.fill();box(73,18.6,76,20.9,.5);
  for(let k=0;k<3;k++)wl(72.6-k*.3,20.9+k*.35,76.4+k*.3,20.9+k*.35,.35,'#8a7448');
  flag(74.5,7.8,6,5,MPL.VERM);

  /* ---- the curtain wall (two cells thick) with merlons on the outer face ---- */
  const wallR=(a,b,c,d)=>{fr(a,b,c,d,'#b7aa88');for(let k=0;k<(c-a)*(d-b)*1.3;k++){const px=a+HH(k,a,13)*(c-a),py=b+HH(k,b,14)*(d-b);x.strokeStyle='rgba(42,26,12,.28)';x.lineWidth=.25;x.beginPath();x.moveTo(X(px),Y(py));x.lineTo(X(px)+.9,Y(py));x.stroke()}};
  wallR(49,6,100,8);wallR(49,40,73,42);wallR(76,40,100,42);wallR(49,8,51,40);wallR(98,8,100,40);
  x.strokeStyle=INK;x.lineWidth=.9;x.strokeRect(X(49),Y(6),51*s,36*s);x.lineWidth=.6;x.strokeRect(X(51),Y(8),47*s,32*s);
  fr(73,39.9,76,42.1,GRAV);
  for(let u=49;u<100;u+=1){const m=u<73||u>=76;x.fillStyle=STONE2;x.strokeStyle=INK;x.lineWidth=.25;x.fillRect(X(u)+.2,Y(5.55),.6*s,.55*s);x.strokeRect(X(u)+.2,Y(5.55),.6*s,.55*s);if(m){x.fillRect(X(u)+.2,Y(41.95),.6*s,.55*s);x.strokeRect(X(u)+.2,Y(41.95),.6*s,.55*s)}}
  for(let v=6;v<42;v+=1){for(const ux of [48.45,100]){x.fillStyle=STONE2;x.fillRect(X(ux),Y(v)+.2,.55*s,.6*s);x.strokeRect(X(ux),Y(v)+.2,.55*s,.6*s)}}
  // towers along the wall: corners big, round towers, thin spires
  for(const [tx,ty,r,c,f] of [[49.6,6.6,3.2,MPL.LAPIS,1],[99.6,6.6,3.2,MPL.LAPIS,2],[49.6,41.6,3.2,MPL.LAPIS,2],[99.6,41.6,3.2,MPL.LAPIS,1],
    [61,7,1.9,TERRA,0],[87,7,1.9,TERRA,0],[49.6,26,2,TERRA,3],[99.6,26,2,TERRA,3],[49.6,14,1.7,SLATE,0],[99.6,14,1.7,SLATE,0],[49.6,35,1.7,SLATE,0],[99.6,35,1.7,SLATE,0],[57,7,1.2,MPL.VERM,0],[91,7,1.2,MPL.VERM,0],[50,32,1.2,MPL.VERM,0],[99.5,32,1.2,MPL.VERM,0]])tower(tx,ty,r,c,f);

  /* ---- the gatehouse over the gate passage, with banners ---- */
  fr(66,38.4,83,42.2,STONE);for(let k=0;k<30;k++)wl(66.5+HH(k,1,15)*16,38.8+HH(k,2,15)*3,67.3+HH(k,1,15)*16,38.8+HH(k,2,15)*3,.25,'rgba(42,26,12,.3)');
  box(66,38.4,83,42.2,.6);fr(73,38.4,76,42.2,'#cbbd98');
  fr(73.1,39,75.9,42.2,'#2d2014');x.fillStyle='#2d2014';x.beginPath();x.arc(X(74.5),Y(40),1.4*s,Math.PI,0);x.fill();for(let k=0;k<5;k++)wl(73.4+k*.55,39,73.4+k*.55,42,.3,MPL.GOLD);for(let k=0;k<3;k++)wl(73.1,39.6+k*.8,75.9,39.6+k*.8,.3,MPL.GOLD);
  box(73,38.4,76,42.2,.5);
  tower(71.5,40.6,2.4,MPL.LAPIS,1);tower(77.5,40.6,2.4,MPL.LAPIS,1);
  for(const bx of [72.6,76.1]){fr(bx,36.6,bx+.8,38.2,MPL.VERM);x.fillStyle=MPL.GOLD;x.fillRect(X(bx)+.4,Y(36.6)+.5,.5,1.2);box(bx,36.6,bx+.8,38.2,.25)}
  for(const [lx,ly] of [[68,39.5],[80,39.5]])flag(lx,ly,5,4,MPL.GOLD);
  // steps and a drawbridge-width apron outside the gate
  for(let k=0;k<3;k++)wl(72.4-k*.2,42.4+k*.4,76.6+k*.2,42.4+k*.4,.35,'#8a7448');

  /* ---- the Land Gate: a gatehouse in the north wall of the city with its long road ---- */
  fr(100,0,102,7,ROAD);fr(100,6,102,45,ROAD);
  wl(100,0,100,3.5,.5,'#8a7448');wl(102,0,102,3.5,.5,'#8a7448');wl(100,6.5,100,47,.5,'#8a7448');wl(102,6.5,102,47,.5,'#8a7448');
  for(let i=0;i<140;i++){const py=HH(i,1,16)*47;dot(100.1+HH(i,2,16)*1.8,py,.1,i%2?'#b09a68':'#f4ead0',0)}
  fr(96,2.4,106,6.6,STONE);box(96,2.4,106,6.6,.6);
  for(let k=0;k<26;k++)wl(96.3+HH(k,3,17)*9,2.8+HH(k,4,17)*3.4,97+HH(k,3,17)*9,2.8+HH(k,4,17)*3.4,.25,'rgba(42,26,12,.3)');
  fr(100,2.3,102,6.8,'#2d2014');for(let k=0;k<4;k++)wl(100.3+k*.5,2.5,100.3+k*.5,6.6,.3,MPL.GOLD);box(100,2.3,102,6.8,.4);
  tower(98.2,4.4,2.2,MPL.LAPIS,1);tower(103.8,4.4,2.2,MPL.LAPIS,1);
  for(let u=96;u<106;u+=1){if(u<100||u>=102){x.fillStyle=STONE2;x.fillRect(X(u)+.2,Y(1.9),.6*s,.55*s);x.strokeRect(X(u)+.2,Y(1.9),.6*s,.55*s)}}
  // a milestone and a signpost on the road below the gate
  fr(102.4,10,103.4,11.2,'#c4b894');box(102.4,10,103.4,11.2,.35);

  /* ---- names: thin pale halo so the drawing still shows ---- */
  const lab=(t,cx,cy,sz,col)=>{x.save();x.font=`bold ${sz}px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=sz*.38;x.strokeStyle='rgba(240,230,196,.88)';x.strokeText(t,X(cx),Y(cy));x.fillStyle=col||INK;x.fillText(t,X(cx),Y(cy));x.restore()};
  lab('Castle of King Osric',74.5,13.2,4.2,INK);
  lab('The King’s Hall',74.5,16.2,2.9,'#3a2a1c');
  lab('The Castle Ward',74.5,21.9,3.6,INK);
  lab('Rose Garden',61.5,30.6,2.7,'#6a2a2a');
  lab('Cloister Garden',86.5,31.6,2.7,'#274a4a');
  lab('Orchard',57,17.0,2.4,'#3a5a2a');lab('Orchard',92,17.0,2.4,'#3a5a2a');
  lab('West Hall',57.5,12.6,2.7,'#5a2410');lab('East Hall',91.5,12.6,2.7,'#5a2410');
  lab('The Land Gate',98.5,0.4,3.8,INK);
}});
