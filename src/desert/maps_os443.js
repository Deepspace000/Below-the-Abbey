/* Orange Spire map, level 443 (floor 4): see maps_common.js and tools/MAP_BRIEF_SPIRE.md.
   Warm orange-brown spire stone, plum shadows, gold leaf, vermilion rugs. Only what a careful explorer sees: walls, floors, openings, stairs, furniture.
   Secret chambers are not reachable from the stair, so a flood fill from the stair leaves them as plain wall. */
const mpOs443Ink='#2a1a0c',mpOs443Plum='#4a2a44',mpOs443Stone='#c47a3a',mpOs443Dark='#8a4c20';
/* a wall picture or piece hung on the wall of the cell: local x runs along the wall, local y points into the wall */
function mpOs443Wall(x,u,cx,cy,wd,kind,num){
  x.save();x.translate(cx+wd[0]*u*.5,cy+wd[1]*u*.5);x.rotate(Math.atan2(-wd[0],wd[1]));x.lineWidth=.55;x.strokeStyle=mpOs443Ink;
  if(kind==='window'){x.fillStyle='#2e2a5a';x.beginPath();x.moveTo(-.26*u,.42*u);x.lineTo(-.26*u,-.05*u);x.quadraticCurveTo(0,-.42*u,.26*u,-.05*u);x.lineTo(.26*u,.42*u);x.closePath();x.fill();x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.stroke();x.strokeStyle=MPL.GOLD2;x.lineWidth=.4;x.beginPath();x.moveTo(0,-.2*u);x.lineTo(0,.42*u);x.stroke()}
  else if(kind==='banner'){x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(-.2*u,.42*u);x.lineTo(-.2*u,-.3*u);x.lineTo(0,-.18*u);x.lineTo(.2*u,-.3*u);x.lineTo(.2*u,.42*u);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.GOLD;x.fillRect(-.26*u,.36*u,.52*u,.1*u);x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(0,.1*u,.06*u,0,6.3);x.fill()}
  else if(kind==='mirror'){x.fillStyle='#a8cce4';x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.ellipse(0,.1*u,.2*u,.34*u,0,0,6.3);x.fill();x.stroke();x.strokeStyle=mpOs443Ink;x.lineWidth=.4;x.stroke();x.strokeStyle='#fff';x.lineWidth=.5;x.beginPath();x.moveTo(-.08*u,-.02*u);x.lineTo(.02*u,-.14*u);x.stroke()}
  else if(kind==='portrait'){x.fillStyle='#5a3048';x.fillRect(-.22*u,-.22*u,.44*u,.58*u);x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.strokeRect(-.22*u,-.22*u,.44*u,.58*u);x.fillStyle='#e0b890';x.beginPath();x.arc(0,.02*u,.1*u,0,6.3);x.fill();x.fillStyle='#2a1a2a';x.fillRect(-.14*u,.14*u,.28*u,.16*u)}
  else if(kind==='plaque'){x.fillStyle='#b8aa90';x.fillRect(-.34*u,-.34*u,.68*u,.68*u);x.strokeStyle=mpOs443Ink;x.lineWidth=.7;x.strokeRect(-.34*u,-.34*u,.68*u,.68*u);x.strokeStyle=MPL.GOLD;x.lineWidth=.5;x.strokeRect(-.27*u,-.27*u,.54*u,.54*u);x.save();x.rotate(-Math.atan2(-wd[0],wd[1]));x.fillStyle=mpOs443Ink;x.font='bold '+(u*.7)+'px '+FTITLE;x.textAlign='center';x.textBaseline='middle';x.fillText(num,0,.02*u);x.restore()}
  else if(kind==='claw'){x.strokeStyle='#7a1a10';x.lineWidth=.8;x.beginPath();for(const dx of [-.2,0,.2]){x.moveTo((dx-.08)*u,-.3*u);x.lineTo((dx+.08)*u,.34*u)}x.stroke()}
  else if(kind==='alcove'){x.fillStyle='#3a2438';x.beginPath();x.moveTo(-.2*u,.4*u);x.lineTo(-.2*u,-.02*u);x.quadraticCurveTo(0,-.36*u,.2*u,-.02*u);x.lineTo(.2*u,.4*u);x.closePath();x.fill();x.stroke()}
  else if(kind==='chains'){x.strokeStyle='#3a3030';x.lineWidth=.8;x.setLineDash([.5,.7]);x.beginPath();x.moveTo(-.15*u,.4*u);x.lineTo(-.15*u,-.25*u);x.moveTo(.15*u,.4*u);x.lineTo(.15*u,-.25*u);x.stroke()}
  else if(kind==='fire'){x.fillStyle='#6a4a3a';x.fillRect(-.36*u,-.1*u,.72*u,.55*u);x.strokeRect(-.36*u,-.1*u,.72*u,.55*u);x.fillStyle='#1a0e0a';x.fillRect(-.24*u,0,.48*u,.45*u);x.fillStyle='#ff8a30';x.beginPath();x.moveTo(0,-.02*u);x.quadraticCurveTo(.2*u,.22*u,0,.42*u);x.quadraticCurveTo(-.2*u,.22*u,0,-.02*u);x.fill();x.fillStyle='#ffe070';x.beginPath();x.arc(0,.32*u,.07*u,0,6.3);x.fill()}
  x.restore()}
/* furniture standing in a cell, drawn from above as a small plan icon */
function mpOs443Floor(x,u,cx,cy,kind){
  x.save();x.translate(cx,cy);x.lineWidth=.55;x.strokeStyle=mpOs443Ink;
  if(kind==='coffin'){x.fillStyle='#8a8290';x.beginPath();x.moveTo(-.2*u,-.4*u);x.lineTo(.2*u,-.4*u);x.lineTo(.28*u,-.12*u);x.lineTo(.18*u,.4*u);x.lineTo(-.18*u,.4*u);x.lineTo(-.28*u,-.12*u);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.GOLD;x.beginPath();x.moveTo(0,-.3*u);x.lineTo(0,.28*u);x.moveTo(-.1*u,-.12*u);x.lineTo(.1*u,-.12*u);x.stroke()}
  else if(kind==='tomb'){x.fillStyle='#a8a4a8';x.fillRect(-.36*u,-.3*u,.72*u,.6*u);x.strokeRect(-.36*u,-.3*u,.72*u,.6*u);x.strokeStyle='#4a4650';x.beginPath();x.moveTo(0,-.2*u);x.lineTo(0,.2*u);x.moveTo(-.12*u,-.08*u);x.lineTo(.12*u,-.08*u);x.stroke()}
  else if(kind==='throne'){x.fillStyle=MPL.GOLD;x.beginPath();x.moveTo(-.4*u,.4*u);x.lineTo(-.4*u,-.3*u);x.lineTo(-.2*u,-.12*u);x.lineTo(0,-.42*u);x.lineTo(.2*u,-.12*u);x.lineTo(.4*u,-.3*u);x.lineTo(.4*u,.4*u);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.VERM;x.fillRect(-.2*u,0,.4*u,.3*u);x.strokeRect(-.2*u,0,.4*u,.3*u)}
  else if(kind==='cage'){x.fillStyle='rgba(60,50,48,.25)';x.fillRect(-.34*u,-.34*u,.68*u,.68*u);x.strokeStyle='#2a2422';x.lineWidth=.8;x.strokeRect(-.34*u,-.34*u,.68*u,.68*u);x.beginPath();for(const d of [-.17,0,.17]){x.moveTo(d*u,-.34*u);x.lineTo(d*u,.34*u)}x.stroke()}
  else if(kind==='rack'){x.strokeStyle='#4a3020';x.lineWidth=1;x.strokeRect(-.36*u,-.24*u,.72*u,.48*u);x.beginPath();x.moveTo(-.36*u,-.24*u);x.lineTo(.36*u,.24*u);x.moveTo(.36*u,-.24*u);x.lineTo(-.36*u,.24*u);x.stroke()}
  else if(kind==='shelf'){x.fillStyle='#7a4a2a';x.fillRect(-.42*u,-.26*u,.84*u,.52*u);x.strokeRect(-.42*u,-.26*u,.84*u,.52*u);x.strokeStyle='#e0c890';x.lineWidth=.45;x.beginPath();for(let k=-3;k<=3;k++){x.moveTo(k*.11*u,-.2*u);x.lineTo(k*.11*u,.2*u)}x.stroke()}
  else if(kind==='lectern'){x.fillStyle='#6a4024';x.fillRect(-.22*u,-.22*u,.44*u,.44*u);x.strokeRect(-.22*u,-.22*u,.44*u,.44*u);x.fillStyle='#efe4c0';x.fillRect(-.14*u,-.14*u,.28*u,.2*u)}
  else if(kind==='desk'){x.fillStyle='#8a5a30';x.fillRect(-.4*u,-.26*u,.8*u,.52*u);x.strokeRect(-.4*u,-.26*u,.8*u,.52*u);x.fillStyle='#efe4c0';x.fillRect(-.2*u,-.14*u,.22*u,.16*u)}
  else if(kind==='feast'){x.fillStyle='#8a5a30';x.fillRect(-.46*u,-.3*u,.92*u,.6*u);x.strokeRect(-.46*u,-.3*u,.92*u,.6*u);x.fillStyle=MPL.VERM;x.fillRect(-.36*u,-.16*u,.72*u,.32*u);x.fillStyle=MPL.GOLD2;for(const d of [-.24,0,.24]){x.beginPath();x.arc(d*u,0,.06*u,0,6.3);x.fill()}}
  else if(kind==='armour'){x.fillStyle='#9aa0aa';x.beginPath();x.arc(0,-.05*u,.24*u,Math.PI,0);x.lineTo(.24*u,.3*u);x.lineTo(-.24*u,.3*u);x.closePath();x.fill();x.stroke();x.fillStyle='#2a2430';x.fillRect(-.14*u,-.08*u,.28*u,.07*u)}
  x.restore()}
/* a candle or torch sconce: a gold stand with a flame, red or violet glow */
function mpOs443Lamp(x,u,cx,cy,violet){
  x.save();const g=x.createRadialGradient(cx,cy,0,cx,cy,u*1.5);g.addColorStop(0,violet?'rgba(170,110,230,.45)':'rgba(255,150,60,.5)');g.addColorStop(1,'rgba(255,150,60,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,u*1.5,0,6.3);x.fill();
  x.fillStyle=MPL.GOLD;x.strokeStyle=mpOs443Ink;x.lineWidth=.5;x.fillRect(cx-.14*u,cy,.28*u,.2*u);x.strokeRect(cx-.14*u,cy,.28*u,.2*u);x.fillRect(cx-.04*u,cy-.18*u,.08*u,.2*u);
  x.fillStyle=violet?'#c89cff':'#ffb040';x.beginPath();x.moveTo(cx,cy-.45*u);x.quadraticCurveTo(cx+.2*u,cy-.2*u,cx,cy-.12*u);x.quadraticCurveTo(cx-.2*u,cy-.2*u,cx,cy-.45*u);x.fill();x.stroke();x.restore()}
/* a small stair: steps, a gold frame, an arrow for the direction */
function mpOs443Stair(x,u,cx,cy,up){
  x.save();x.translate(cx,cy);const w=u*1.5,h=u*1.5;x.fillStyle=up?'#f0d878':'#d8b070';x.strokeStyle=mpOs443Ink;x.lineWidth=.7;x.fillRect(-w/2,-h/2,w,h);x.strokeRect(-w/2,-h/2,w,h);
  x.beginPath();for(let i=1;i<5;i++){x.moveTo(-w/2,-h/2+h*i/5);x.lineTo(w/2,-h/2+h*i/5)}x.stroke();
  x.fillStyle=MPL.VERM;x.beginPath();if(up){x.moveTo(0,-h*.42);x.lineTo(w*.3,0);x.lineTo(-w*.3,0)}else{x.moveTo(0,h*.42);x.lineTo(w*.3,0);x.lineTo(-w*.3,0)}x.closePath();x.fill();x.stroke();
  x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.strokeRect(-w/2-.8,-h/2-.8,w+1.6,h+1.6);x.restore()}
/* the key icons, same for all floors */
function mpOs443KeyIcon(x,u,cx,cy,k){
  if(k==='sd')mpOs443Stair(x,u*.6,cx,cy,false);else if(k==='su')mpOs443Stair(x,u*.6,cx,cy,true);
  else if(k==='door'){x.save();x.fillStyle='#e2c48c';x.fillRect(cx-5,cy-3,10,6);x.strokeStyle=MPL.GOLD;x.lineWidth=1.6;x.beginPath();x.moveTo(cx-5,cy-3.4);x.lineTo(cx+5,cy-3.4);x.stroke();x.restore()}
  else if(k==='lamp')mpOs443Lamp(x,9,cx,cy+1,false);
  else if(k==='banner')mpOs443Wall(x,9,cx,cy-4,[0,1],'banner');else if(k==='mirror')mpOs443Wall(x,9,cx,cy-4,[0,1],'mirror');else if(k==='portrait')mpOs443Wall(x,9,cx,cy-4,[0,1],'portrait');
  else if(k==='window')mpOs443Wall(x,9,cx,cy-4,[0,1],'window');else if(k==='fire')mpOs443Wall(x,9,cx,cy-4,[0,1],'fire');else if(k==='claw')mpOs443Wall(x,9,cx,cy-4,[0,1],'claw');
  else if(k==='coffin')mpOs443Floor(x,9,cx,cy,'coffin');else if(k==='rug'){x.save();x.fillStyle=MPL.VERM;x.fillRect(cx-5,cy-2.5,10,5);x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.strokeRect(cx-4.2,cy-1.8,8.4,3.6);x.restore()}}
mplInstall({name:'os443',levels:[443],reveal:true,draw(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=api.fit(W,H),s=f.s,X=f.X,Y=f.Y,A=MPL.AREA,h2=hash2;
  const fl=(i,j)=>i>=0&&j>=0&&i<W&&j<H&&reach[j][i];
  // flood fill from the stair: only what can be walked to counts as floor (secret chambers stay plain wall)
  const reach=[];for(let j=0;j<H;j++)reach.push(new Uint8Array(W));
  {const st=[[L._start.x,L._start.y]];reach[L._start.y][L._start.x]=1;
   while(st.length){const [i,j]=st.pop();for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const ni=i+a,nj=j+b;if(ni<0||nj<0||ni>=W||nj>=H||reach[nj][ni])continue;const ch=L.rows[nj][ni];if(ch==='.'||ch==='0'||ch==='1'){reach[nj][ni]=1;st.push([ni,nj])}}}}
  const nearF=(i,j)=>{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(fl(i+a,j+b))return true;return false};
  const rooms=(L._roomsInfo||[]).map((r,i)=>Object.assign({},r,{i,nm:(L.mapNames[i]||{}).t||r.n}));
  const strange=rooms.find(r=>r.n==='The Strange Room');
  const inStrange=(i,j)=>strange&&i>=strange.x0&&i<=strange.x1&&j>=strange.y0&&j<=strange.y1;
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  // the wall mass: orange-brown spire stone, darker away from the passages
  {const g=x.createLinearGradient(0,Y(0),0,Y(H));g.addColorStop(0,'#c47a3a');g.addColorStop(1,'#b06a32');x.fillStyle=g;x.fillRect(X(0),Y(0),W*s,H*s)}
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(fl(i,j))continue;const near=nearF(i,j),px=X(i),py=Y(j);
    if(!near){x.fillStyle='rgba(74,42,68,.2)';x.fillRect(px,py,s+.4,s+.4)}
    // hatching, close together beside the passages and open further in
    x.strokeStyle=near?'rgba(90,44,20,.62)':'rgba(60,30,50,.36)';x.lineWidth=.4;x.beginPath();const d=near?1.5:2.8,jit=h2(i,j,4)*d;
    for(let t=jit;t<2*s;t+=d){x.moveTo(px+Math.max(0,t-s),py+Math.min(t,s));x.lineTo(px+Math.min(t,s),py+Math.max(0,t-s))}x.stroke();
    if(near){x.strokeStyle='rgba(74,36,60,.4)';x.lineWidth=.45;x.beginPath();const off=((i+j)&1)?s*.5:0;x.moveTo(px,py+s*.5);x.lineTo(px+s,py+s*.5);x.moveTo(px+off+s*.25,py);x.lineTo(px+off+s*.25,py+s*.5);x.moveTo(px+((off+s*.5)%s)+s*.1,py+s*.5);x.lineTo(px+((off+s*.5)%s)+s*.1,py+s);x.stroke()}}
  // flagged floors
  const fcol=['#e6cf9c','#dcbd84','#ead5a4','#e0c48e'];
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!fl(i,j))continue;const px=X(i),py=Y(j);x.fillStyle=fcol[(h2(i,j,9)*4)|0];x.fillRect(px,py,s+.3,s+.3);
    x.strokeStyle='rgba(110,64,56,.3)';x.lineWidth=.35;x.beginPath();x.moveTo(px,py+s*.5);x.lineTo(px+s,py+s*.5);const off=((i+j)&1)?.3:.7;x.moveTo(px+s*off,py);x.lineTo(px+s*off,py+s*.5);x.moveTo(px+s*(1-off),py+s*.5);x.lineTo(px+s*(1-off),py+s);x.stroke()}
  // rugs: vermilion with a gold border, in the grand halls
  for(const r of rooms){if(!/Throne|Gallery|Banquet/.test(r.n))continue;const w=r.x1-r.x0+1,hh=r.y1-r.y0+1;let rx,ry,rw,rh;
    if(w>=hh){rx=r.x0+.5;rw=w-1;ry=r.y0+Math.floor((hh-1)/2)+.12;rh=hh>=4?2-.24:1-.24}else{ry=r.y0+.5;rh=hh-1;rx=r.x0+Math.floor((w-1)/2)+.12;rw=w>=4?2-.24:1-.24}
    x.fillStyle=MPL.VERM;x.fillRect(X(rx),Y(ry),rw*s,rh*s);x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.strokeRect(X(rx)+.8,Y(ry)+.8,rw*s-1.6,rh*s-1.6);x.strokeStyle='rgba(240,216,120,.7)';x.lineWidth=.4;x.strokeRect(X(rx)+1.8,Y(ry)+1.8,rw*s-3.6,rh*s-3.6);
    x.fillStyle='rgba(240,216,120,.8)';const n=Math.max(w>=hh?rw:rh,1);for(let k=0;k<n*2;k++){const t=(k+.5)/(n*2);x.beginPath();if(w>=hh)x.arc(X(rx)+rw*s*t,Y(ry)+rh*s/2,.7,0,6.3);else x.arc(X(rx)+rw*s/2,Y(ry)+rh*s*t,.7,0,6.3);x.fill()}}
  // plum shadow under the walls to the north and west
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!fl(i,j))continue;const px=X(i),py=Y(j);
    if(!fl(i,j-1)){const g=x.createLinearGradient(0,py,0,py+s*.5);g.addColorStop(0,'rgba(74,42,68,.5)');g.addColorStop(1,'rgba(74,42,68,0)');x.fillStyle=g;x.fillRect(px,py,s,s*.5)}
    if(!fl(i-1,j)){const g=x.createLinearGradient(px,0,px+s*.4,0);g.addColorStop(0,'rgba(74,42,68,.4)');g.addColorStop(1,'rgba(74,42,68,0)');x.fillStyle=g;x.fillRect(px,py,s*.4,s)}}
  // doubled wobbly ink edges along every wall
  const J=(vi,vj,sd)=>[X(vi)+(h2(vi,vj,sd)-.5)*s*.3,Y(vj)+(h2(vi+53,vj,sd)-.5)*s*.3];
  const edge=(a,b,c2,d2,sd,lw)=>{const p=J(a,b,sd),q=J(c2,d2,sd),mx=(p[0]+q[0])/2+(h2(a+c2,b+d2,sd+1)-.5)*s*.18,my=(p[1]+q[1])/2+(h2(a+c2+9,b+d2,sd+1)-.5)*s*.18;x.lineWidth=lw;x.moveTo(p[0],p[1]);x.quadraticCurveTo(mx,my,q[0],q[1])};
  x.lineCap='round';x.strokeStyle=mpOs443Ink;x.beginPath();
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!fl(i,j))continue;
    if(!fl(i,j-1))edge(i,j,i+1,j,11,1.1);if(!fl(i,j+1))edge(i,j+1,i+1,j+1,11,1.1);if(!fl(i-1,j))edge(i,j,i,j+1,11,1.1);if(!fl(i+1,j))edge(i+1,j,i+1,j+1,11,1.1)}
  x.lineWidth=1.1;x.stroke();
  x.strokeStyle='rgba(42,26,12,.7)';x.beginPath();
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!fl(i,j))continue;
    if(!fl(i,j-1))edge(i,j,i+1,j,23,.5);if(!fl(i,j+1))edge(i,j+1,i+1,j+1,23,.5);if(!fl(i-1,j))edge(i,j,i,j+1,23,.5);if(!fl(i+1,j))edge(i+1,j,i+1,j+1,23,.5)}
  x.lineWidth=.5;x.stroke();
  // doors: a gold frame across every opening into a room
  const inRoom=(i,j)=>rooms.some(r=>i>=r.x0&&i<=r.x1&&j>=r.y0&&j<=r.y1);
  const door=(i1,j1,i2,j2)=>{ // the edge between cell (i1,j1) in the room and (i2,j2) outside
    const hz=j1!==j2,ex=hz?X(i1):X(Math.max(i1,i2)),ey=hz?Y(Math.max(j1,j2)):Y(j1),dx=hz?s:0,dy=hz?0:s;
    x.save();x.strokeStyle=mpOs443Ink;x.lineWidth=2.6;x.beginPath();x.moveTo(ex,ey);x.lineTo(ex+dx,ey+dy);x.stroke();x.strokeStyle=MPL.GOLD;x.lineWidth=1.6;x.stroke();
    x.fillStyle=MPL.GOLD2;for(const [a,b] of [[ex,ey],[ex+dx,ey+dy]]){x.beginPath();x.arc(a,b,1,0,6.3);x.fill();x.lineWidth=.4;x.strokeStyle=mpOs443Ink;x.stroke()}x.restore()};
  for(const r of rooms){if(r===strange&&false)continue;
    for(let i=r.x0;i<=r.x1;i++){if(fl(i,r.y0)&&fl(i,r.y0-1)&&!inRoom(i,r.y0-1))door(i,r.y0,i,r.y0-1);if(fl(i,r.y1)&&fl(i,r.y1+1)&&!inRoom(i,r.y1+1))door(i,r.y1,i,r.y1+1)}
    for(let j=r.y0;j<=r.y1;j++){if(fl(r.x0,j)&&fl(r.x0-1,j)&&!inRoom(r.x0-1,j))door(r.x0,j,r.x0-1,j);if(fl(r.x1,j)&&fl(r.x1+1,j)&&!inRoom(r.x1+1,j))door(r.x1,j,r.x1+1,j)}}
  // furniture and wall hangings at their real places (nothing from the strange room, nothing secret)
  const wallKind={hl_p_window:'window',hl_p_banner:'banner',hl_p_mirror:'mirror',hl_p_alcove:'alcove',hl_p_chains:'chains',hl_fire:'fire'},floorKind={hl_p_coffin:'coffin',hl_p_tomb:'tomb',hl_p_throne:'throne',hl_p_cage:'cage',hl_p_rack:'rack',hl_p_shelf:'shelf',hl_p_lectern:'lectern',hl_p_desk:'desk',hl_p_feast:'feast',hl_p_armour:'armour'};
  const fcells=[];
  for(const d of L.decor){if(d.secret||!fl(d.x,d.y)||inStrange(d.x,d.y))continue;const cx=X(d.x+.5),cy=Y(d.y+.5),k=d.k;
    if(/^hl_plq/.test(k)&&d.wd){mpOs443Wall(x,s,cx,cy,d.wd,'plaque',k.slice(6));continue}
    if(/^hl_pt\d/.test(k)&&d.wd){mpOs443Wall(x,s,cx,cy,d.wd,'portrait');continue}
    if(/^hl_claw/.test(k)&&d.wd){mpOs443Wall(x,s,cx,cy,d.wd,'claw');continue}
    if(wallKind[k]&&d.wd){mpOs443Wall(x,s,cx,cy,d.wd,wallKind[k]);continue}
    if(floorKind[k])fcells.push([cx,cy,floorKind[k]])}
  for(const [cx,cy,k] of fcells)mpOs443Floor(x,s,cx,cy,k);
  // candles and sconces
  for(const d of L.decor)if((d.k==='hl_p_candle'||d.k==='lamp')&&!d.secret&&fl(d.x,d.y)&&!inStrange(d.x,d.y)){const li=(L.lights||[]).find(q=>q[0]===d.x&&q[1]===d.y);mpOs443Lamp(x,s,X(d.x+.5),Y(d.y+.5),li?li[2]===1:false)}
  // the stairs
  mpOs443Stair(x,s,X(L._start.x+.5),Y(L._start.y+1.5),false);
  if(L._up)mpOs443Stair(x,s,X(L._up.x+.5),Y(L._up.y-.5),true);
  x.restore();
  // room names, in two short lines in the wall above each room
  for(const r of rooms){const m=L.mapNames[r.i];if(!m)continue;const lines=api.wrap(x,m.t,Math.max((r.x1-r.x0+1)*s+14,62),6);let y0=Y(r.y0)-lines.length*3.6-1.2;if(y0<Y(0)+1)y0=Y(0)+1;
    lines.forEach((t,q)=>api.text(x,t,X((r.x0+r.x1+1)/2),y0+q*7.2+3,6.2,'#2a1a0c'))}
  // title and the key on the left, the notes and the compass on the right
  api.title(x,'The Orange Spire, Floor 4');
  const sub=[...new Set(L.mapNames.map(m=>m.t.replace(/ and Stair Up$/,'')).filter(t=>t!=='The Strange Room'&&!/^Stair/.test(t)&&t!=='The Stair Up'))].join(', ');
  api.text(x,'Floor 4 of 20',12,46,6.6,'#5a3a1c','left');let yy=55;for(const l of api.wrap(x,sub,76,6)){api.text(x,l,12,yy,6,'#5a3a1c','left');yy+=7.4}
  const ky=Math.max(yy+6,94),keys=[['sd','Stair down'],['su','Stair up'],['door','Door frame'],['rug','Rug'],['lamp','Candle or torch'],['banner','Banner'],['window','Window'],['mirror','Mirror'],['portrait','Painting'],['fire','Fireplace'],['claw','Claw marks'],['coffin','Coffin']];
  api.panel(x,5,ky,82,13+keys.length*12.6);api.text(x,'KEY',46,ky+8,6.6,MPL.VERM);
  keys.forEach(([k,t],q)=>{const cy=ky+22+q*12.6;mpOs443KeyIcon(x,9,15,cy,k);api.text(x,t,25,cy,6.2,'#3a2a1c','left')});
  api.panel(x,392,34,84,120);
  api.notes(x,['The Orange Spire has 20 floors, and each one is smaller than the floor below it.','You come in by the stair down, at the bottom of this plan.','The stair up is in the room at the top right.','Stone plaques by each stair give the floor number.'],396,44,72,6.2,4);
  api.compass(x,434,236,17)}});
