/* Orange Spire map, floor 2 = level 441. Hand-inked plan from the real rows, decor, lights and room data. Nothing secret is drawn:
   hidden doors stay plain wall, the strange room is only named, and levers, trap spots, notes and enemies are left out. */
const mpOs441Rm=(L,k)=>{const r=(L._roomsInfo||[]).find(r=>r.n==='The Strange Room');return r&&k.x>=r.x0&&k.x<=r.x1&&k.y>=r.y0&&k.y<=r.y1};
function mpOs441Icon(c,k,a,b,s,L){
  const INK=MPL.INK,GOLD=MPL.GOLD,line=(w,col)=>{c.lineWidth=w;c.strokeStyle=col||INK};
  c.save();c.lineJoin='round';c.lineCap='round';
  if(k==='hl_p_candle'){c.fillStyle='#7a4a24';c.fillRect(a-s*.4,b-s*.1,s*.8,s*.5);line(.3);c.strokeRect(a-s*.4,b-s*.1,s*.8,s*.5);c.fillStyle='#fff0b0';c.fillRect(a-s*.06,b-s*.55,s*.12,s*.45);c.fillStyle='#ffb83a';c.beginPath();c.ellipse(a,b-s*.7,s*.12,s*.2,0,0,6.3);c.fill()}
  else if(k==='hl_p_feast'){c.fillStyle='#7a4a24';c.fillRect(a-s*.7,b-s*.25,s*1.4,s*.5);line(.3);c.strokeRect(a-s*.7,b-s*.25,s*1.4,s*.5);c.fillStyle='#f0e6cc';c.beginPath();c.arc(a-s*.3,b,s*.16,0,6.3);c.arc(a+s*.3,b,s*.16,0,6.3);c.fill();c.fillStyle=MPL.VERM;c.beginPath();c.arc(a,b,s*.12,0,6.3);c.fill()}
  else if(k==='hl_p_poison'){c.fillStyle=MPL.LAPIS;line(.3);c.beginPath();c.moveTo(a-s*.25,b-s*.35);c.lineTo(a+s*.25,b-s*.35);c.lineTo(a+s*.12,b+s*.1);c.lineTo(a-s*.12,b+s*.1);c.closePath();c.fill();c.stroke();c.fillRect(a-s*.05,b+s*.1,s*.1,s*.25);c.fillRect(a-s*.2,b+s*.33,s*.4,s*.1)}
  else if(k==='hl_p_apple'){c.fillStyle=MPL.VERM;line(.3);c.beginPath();c.arc(a,b,s*.28,0,6.3);c.fill();c.stroke();c.fillStyle=MPL.VERD;c.beginPath();c.ellipse(a+s*.14,b-s*.3,s*.14,s*.07,-.5,0,6.3);c.fill()}
  else if(k==='hl_p_cage'){line(.35);c.fillStyle='rgba(90,70,60,.25)';c.fillRect(a-s*.4,b-s*.5,s*.8,s);c.strokeRect(a-s*.4,b-s*.5,s*.8,s);c.beginPath();for(const d of [-.2,0,.2]){c.moveTo(a+d*s,b-s*.5);c.lineTo(a+d*s,b+s*.5)}c.stroke()}
  else if(k==='hl_p_rack'){line(.7,'#5a3a1c');c.beginPath();c.moveTo(a-s*.45,b-s*.45);c.lineTo(a+s*.45,b+s*.45);c.moveTo(a+s*.45,b-s*.45);c.lineTo(a-s*.45,b+s*.45);c.stroke();line(.3);c.strokeRect(a-s*.5,b-s*.5,s,s)}
  else if(k==='hl_p_throne'){c.fillStyle=GOLD;line(.4);c.beginPath();c.moveTo(a-s*.5,b+s*.45);c.lineTo(a-s*.5,b-s*.2);c.lineTo(a-s*.25,b);c.lineTo(a,b-s*.55);c.lineTo(a+s*.25,b);c.lineTo(a+s*.5,b-s*.2);c.lineTo(a+s*.5,b+s*.45);c.closePath();c.fill();c.stroke();c.fillStyle=MPL.VERM;c.fillRect(a-s*.25,b+s*.05,s*.5,s*.3)}
  else if(k==='hl_p_banner'){c.fillStyle=MPL.VERM;line(.35);c.beginPath();c.moveTo(a-s*.3,b-s*.5);c.lineTo(a+s*.3,b-s*.5);c.lineTo(a+s*.3,b+s*.4);c.lineTo(a,b+s*.2);c.lineTo(a-s*.3,b+s*.4);c.closePath();c.fill();c.stroke();c.fillStyle=GOLD;c.fillRect(a-s*.3,b-s*.5,s*.6,s*.1);c.beginPath();c.arc(a,b-s*.1,s*.1,0,6.3);c.fill()}
  else if(k==='hl_p_armour'){c.fillStyle='#9a9aa4';line(.35);c.beginPath();c.moveTo(a-s*.28,b+s*.45);c.lineTo(a-s*.28,b-s*.1);c.quadraticCurveTo(a,b-s*.7,a+s*.28,b-s*.1);c.lineTo(a+s*.28,b+s*.45);c.closePath();c.fill();c.stroke();c.fillStyle=INK;c.fillRect(a-s*.16,b-s*.12,s*.32,s*.08)}
  else if(k==='hl_fire'){c.fillStyle='#4a2c1c';line(.35);c.fillRect(a-s*.45,b-s*.35,s*.9,s*.7);c.strokeRect(a-s*.45,b-s*.35,s*.9,s*.7);c.fillStyle='#ff8a30';c.beginPath();c.moveTo(a,b-s*.3);c.quadraticCurveTo(a+s*.35,b+s*.05,a,b+s*.3);c.quadraticCurveTo(a-s*.35,b+s*.05,a,b-s*.3);c.fill();c.fillStyle='#ffe070';c.beginPath();c.arc(a,b+s*.12,s*.1,0,6.3);c.fill()}
  else if(k==='hl_p_window'){c.fillStyle='#7aa0d8';line(.4,GOLD);c.beginPath();c.moveTo(a-s*.3,b+s*.45);c.lineTo(a-s*.3,b-s*.1);c.quadraticCurveTo(a,b-s*.7,a+s*.3,b-s*.1);c.lineTo(a+s*.3,b+s*.45);c.closePath();c.fill();c.stroke();line(.25);c.beginPath();c.moveTo(a,b-s*.4);c.lineTo(a,b+s*.45);c.moveTo(a-s*.3,b+s*.1);c.lineTo(a+s*.3,b+s*.1);c.stroke()}
  else if(k==='hl_p_mirror'){c.fillStyle='#b8d8ec';line(.6,GOLD);c.beginPath();c.ellipse(a,b,s*.32,s*.5,0,0,6.3);c.fill();c.stroke();c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=.35;c.beginPath();c.moveTo(a-s*.1,b-s*.25);c.lineTo(a+s*.05,b-s*.1);c.stroke()}
  else if(k==='hl_p_shelf'){c.fillStyle='#7a4a24';line(.3);c.fillRect(a-s*.5,b-s*.35,s,s*.7);c.strokeRect(a-s*.5,b-s*.35,s,s*.7);const cols=['#b8321e','#274a9a','#3a7a5a','#e8c870'];for(let i=0;i<4;i++){c.fillStyle=cols[i];c.fillRect(a-s*.4+i*s*.2,b-s*.28,s*.14,s*.25)}}
  else if(k==='hl_p_lectern'){c.fillStyle='#6a4020';line(.3);c.beginPath();c.moveTo(a-s*.3,b-s*.3);c.lineTo(a+s*.3,b-s*.3);c.lineTo(a+s*.2,b+s*.45);c.lineTo(a-s*.2,b+s*.45);c.closePath();c.fill();c.stroke();c.fillStyle='#f0e6cc';c.fillRect(a-s*.2,b-s*.25,s*.4,s*.2)}
  else if(k==='hl_p_desk'){c.fillStyle='#7a4a24';line(.3);c.fillRect(a-s*.5,b-s*.3,s,s*.6);c.strokeRect(a-s*.5,b-s*.3,s,s*.6);c.fillStyle='#f0e6cc';c.fillRect(a-s*.25,b-s*.2,s*.4,s*.3)}
  else if(k==='hl_p_chains'){line(.45,'#4a4038');for(const d of [-.25,.25]){for(let i=0;i<3;i++){c.beginPath();c.ellipse(a+d*s,b-s*.35+i*s*.3,s*.07,s*.13,0,0,6.3);c.stroke()}}c.beginPath();c.moveTo(a-s*.5,b-s*.5);c.lineTo(a+s*.5,b-s*.5);c.stroke()}
  else if(k==='hl_p_alcove'){c.fillStyle='#3a2a2c';line(.4);c.beginPath();c.moveTo(a-s*.3,b+s*.45);c.lineTo(a-s*.3,b-s*.1);c.quadraticCurveTo(a,b-s*.7,a+s*.3,b-s*.1);c.lineTo(a+s*.3,b+s*.45);c.closePath();c.fill();c.stroke()}
  else if(k==='chest'){c.fillStyle='#a8742c';line(.4);c.fillRect(a-s*.45,b-s*.25,s*.9,s*.5);c.strokeRect(a-s*.45,b-s*.25,s*.9,s*.5);c.fillStyle=GOLD;c.fillRect(a-s*.45,b-s*.25,s*.9,s*.12);c.fillRect(a-s*.06,b-s*.1,s*.12,s*.2)}
  else if(/^hl_claw/.test(k)){line(.5,'#4a2438');c.beginPath();for(const d of [-.25,0,.25]){c.moveTo(a+d*s-s*.1,b-s*.4);c.quadraticCurveTo(a+d*s+s*.12,b,a+d*s-s*.05,b+s*.4)}c.stroke()}
  else if(/^hl_pt/.test(k)){c.fillStyle='#e8d8a8';line(.6,GOLD);c.fillRect(a-s*.32,b-s*.45,s*.64,s*.9);c.strokeRect(a-s*.32,b-s*.45,s*.64,s*.9);c.fillStyle='#6a3a58';c.beginPath();c.arc(a,b-s*.1,s*.14,0,6.3);c.fill();c.fillRect(a-s*.2,b+s*.08,s*.4,s*.22)}
  c.restore()}
function mpOs441Stair(c,a,b,s,up){
  c.save();c.lineJoin='round';const w=s*1.5,h=s*1.2;c.fillStyle=up?'#f0d878':'#b89060';c.strokeStyle=MPL.INK;c.lineWidth=.7;c.fillRect(a-w/2,b-h/2,w,h);c.strokeRect(a-w/2,b-h/2,w,h);
  c.lineWidth=.45;c.beginPath();for(let i=1;i<4;i++){c.moveTo(a-w/2,b-h/2+h*i/4);c.lineTo(a+w/2,b-h/2+h*i/4)}c.stroke();
  c.fillStyle=MPL.INK;c.beginPath();if(up){c.moveTo(a,b-h*.38);c.lineTo(a+w*.22,b+h*.05);c.lineTo(a-w*.22,b+h*.05)}else{c.moveTo(a,b+h*.38);c.lineTo(a+w*.22,b-h*.05);c.lineTo(a-w*.22,b-h*.05)}c.closePath();c.fill();c.restore()}
mplInstall({name:'os441',levels:[441],reveal:true,draw(cv,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,INK=MPL.INK,hs=hash2;
  const flo=(i,j)=>i>=0&&j>=0&&i<W&&j<H&&(L.rows[j][i]==='.'||L.rows[j][i]==='0'||L.rows[j][i]==='1');
  // distance of every wall cell to the nearest floor (up to 4)
  const dist=new Uint8Array(W*H).fill(9);for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(flo(i,j)){dist[j*W+i]=0;continue}let d=9;for(let r=1;r<=4&&d===9;r++){for(let b=-r;b<=r&&d===9;b++)for(let a=-r;a<=r;a++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;if(flo(i+a,j+b)){d=r;break}}}dist[j*W+i]=d}
  const ang=(j,i,sd,r)=>hs(i,j,sd)*r;
  // ---- stone: orange-brown wash, shadowed by distance, then ink hatching ----
  x.save();x.beginPath();x.rect(X(0),Y(0),W*s,H*s);x.clip();
  const g=x.createLinearGradient(X(0),Y(0),X(W),Y(H));g.addColorStop(0,'rgba(204,128,60,.5)');g.addColorStop(1,'rgba(186,112,56,.5)');x.fillStyle=g;x.fillRect(X(0),Y(0),W*s,H*s);
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const d=dist[j*W+i];if(!d)continue;const px=X(i),py=Y(j);
    if(d<=2){x.fillStyle=d===1?'rgba(150,84,36,.4)':'rgba(150,84,36,.16)';x.fillRect(px,py,s+.3,s+.3)}
    // plum shadow on the sunless side (walls east of or south of a floor)
    if(d===1){if(flo(i-1,j)){x.fillStyle='rgba(80,34,80,.3)';x.fillRect(px,py,s*.55,s)}if(flo(i,j-1)){x.fillStyle='rgba(80,34,80,.24)';x.fillRect(px,py,s,s*.5)}}
    // hatching
    const n=d===1?3:d===2?2:d===3?(hs(i,j,3)<.6?1:0):(hs(i,j,4)<.3?1:0);x.strokeStyle=d===1?'rgba(70,34,16,.5)':'rgba(80,40,18,.26)';x.lineWidth=d===1?.45:.35;x.beginPath();
    for(let k=0;k<n;k++){const t=(k+.5)/n,j1=(hs(i*3+k,j,5)-.5)*s*.25;x.moveTo(px+s*Math.max(0,t-.5)*0+0,py+s*t+j1);x.lineTo(px+s*t+j1,py+(d===1?0:s*.12))}x.stroke()}
  // blocks of stone laid in the wall mass far from rooms
  x.strokeStyle='rgba(90,48,22,.14)';x.lineWidth=.35;x.beginPath();for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(dist[j*W+i]<3)continue;const px=X(i),py=Y(j);x.moveTo(px,py+s);x.lineTo(px+s,py+s);if((i+j)%2===0){x.moveTo(px+s,py);x.lineTo(px+s,py+s)}}x.stroke();
  x.restore();
  // ---- flagged floors ----
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!flo(i,j))continue;const h=hs(i,j,11),px=X(i),py=Y(j);x.fillStyle=h<.33?'#edc896':h<.66?'#e6bd86':'#f0d0a0';x.fillRect(px,py,s+.25,s+.25)}
  x.strokeStyle='rgba(138,76,32,.34)';x.lineWidth=.3;x.beginPath();
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!flo(i,j))continue;const px=X(i),py=Y(j);x.moveTo(px,py+s);x.lineTo(px+s,py+s);const o=(j&1)?.5:.0;x.moveTo(px+s*(o||1),py);x.lineTo(px+s*(o||1),py+s)}x.stroke();
  // ---- rugs (vermilion with gold border) ----
  const rooms=L._roomsInfo||[],rug=(r)=>{const ax=r.x0,ay=r.y0,bw=r.x1-r.x0+1,bh=r.y1-r.y0+1;let rx,ry,rw,rh;if(r.n==='Throne Hall'){rx=ax+1;ry=ay+1;rw=bw-2;rh=bh-2}else if(r.n==='The Study'){rx=ax+1;ry=ay+1;rw=bw-2;rh=bh-2}else{rx=ax+1;ry=ay+Math.floor(bh/2);rw=bw-2;rh=1}
    if(rw<1||rh<1)return;const px=X(rx)+s*.12,py=Y(ry)+s*.12,pw=rw*s-s*.24,ph=rh*s-s*.24;x.fillStyle=MPL.VERM;x.fillRect(px,py,pw,ph);x.strokeStyle=MPL.GOLD;x.lineWidth=.7;x.strokeRect(px+.5,py+.5,pw-1,ph-1);x.strokeStyle='rgba(255,230,160,.6)';x.lineWidth=.3;x.strokeRect(px+1.7,py+1.7,pw-3.4,ph-3.4);
    x.fillStyle=MPL.GOLD2;for(let k=0;k<rw*rh;k++){const cx=px+pw*(.15+.7*((k*.37)%1)),cy=py+ph*(.3+.4*((k*.61)%1));x.beginPath();x.arc(cx,cy,.45,0,6.3);x.fill()}};
  for(const r of rooms)if(r.n==='Throne Hall'||r.n==='The Study'||r.n==='Gallery of Rulers')rug(r);
  // ---- wobbly doubled ink along every wall edge ----
  const wob=(pts,sd,wd,col)=>{x.strokeStyle=col;x.lineWidth=wd;x.lineJoin='round';x.lineCap='round';x.beginPath();pts.forEach((p,n)=>{const jx=(hs(n,sd,21)-.5)*s*.16,jy=(hs(n,sd,22)-.5)*s*.16;n?x.lineTo(p[0]+jx,p[1]+jy):x.moveTo(p[0]+jx,p[1]+jy)});x.stroke()};
  const run=(horiz,line,a0,a1,sd)=>{const pts=[],len=a1-a0;const n=Math.max(1,Math.round(len*2));for(let k=0;k<=n;k++){const t=a0+len*k/n;pts.push(horiz?[X(t),Y(line)]:[X(line),Y(t)])}
    wob(pts,sd,1.15,INK);const q=pts.map(p=>[p[0]+(horiz?0:s*.07),p[1]+(horiz?s*.07:0)]);wob(q,sd+7,.5,'rgba(42,26,12,.6)')};
  for(let j=0;j<=H;j++){let st=-1;for(let i=0;i<=W;i++){const e=i<W&&(flo(i,j)!==flo(i,j-1));if(e&&st<0)st=i;if(!e&&st>=0){run(true,j,st,i,j*97+st);st=-1}}}
  for(let i=0;i<=W;i++){let st=-1;for(let j=0;j<=H;j++){const e=j<H&&(flo(i,j)!==flo(i-1,j));if(e&&st<0)st=j;if(!e&&st>=0){run(false,i,st,j,i*89+st+500);st=-1}}}
  // ---- gold door frames where a passage meets a room ----
  x.save();x.strokeStyle=MPL.GOLD;x.fillStyle=MPL.GOLD;x.lineWidth=.9;x.lineCap='round';
  const frame=(ax,ay,bx,by)=>{x.beginPath();x.moveTo(ax,ay);x.lineTo(bx,by);x.stroke();x.beginPath();x.arc(ax,ay,.9,0,6.3);x.arc(bx,by,.9,0,6.3);x.fill()};
  for(const r of rooms){for(let i=r.x0;i<=r.x1;i++){if(flo(i,r.y0-1))frame(X(i)+s*.08,Y(r.y0),X(i+1)-s*.08,Y(r.y0));if(flo(i,r.y1+1))frame(X(i)+s*.08,Y(r.y1+1),X(i+1)-s*.08,Y(r.y1+1))}
    for(let j=r.y0;j<=r.y1;j++){if(flo(r.x0-1,j))frame(X(r.x0),Y(j)+s*.08,X(r.x0),Y(j+1)-s*.08);if(flo(r.x1+1,j))frame(X(r.x1+1),Y(j)+s*.08,X(r.x1+1),Y(j+1)-s*.08)}}
  x.restore();
  // ---- candle and torch sconces at their real places ----
  for(const l of L.lights||[]){const px=X(l[0]+.5),py=Y(l[1]+.5);const gl=x.createRadialGradient(px,py,0,px,py,s*1.5);gl.addColorStop(0,'rgba(255,200,80,.5)');gl.addColorStop(1,'rgba(255,200,80,0)');x.fillStyle=gl;x.fillRect(px-s*1.5,py-s*1.5,s*3,s*3);
    x.fillStyle=MPL.GOLD;x.strokeStyle=INK;x.lineWidth=.3;x.fillRect(px-s*.2,py,s*.4,s*.3);x.strokeRect(px-s*.2,py,s*.4,s*.3);x.fillStyle=l[2]?'#e8502a':'#ffb83a';x.beginPath();x.moveTo(px,py-s*.55);x.quadraticCurveTo(px+s*.3,py-s*.15,px,py);x.quadraticCurveTo(px-s*.3,py-s*.15,px,py-s*.55);x.fill();x.stroke()}
  // ---- furniture and decoration ----
  const skip=/^(lamp|lp_gap|lever|hl_p_note|hl_plq2)$/;
  for(const d of L.decor){if(skip.test(d.k)||d.hidden)continue;if((d.k==='chest'||/^hl_claw/.test(d.k))&&mpOs441Rm(L,d))continue;mpOs441Icon(x,d.k,X(d.x+.5),Y(d.y+.5),s*1.15,L)}
  // ---- stairs and the numbered stone at the start ----
  let sd=null,su=null;for(let j=0;j<H;j++)for(let i=0;i<W;i++){const c=L.rows[j][i];if(c==='0')sd={x:i,y:j};if(c==='1')su={x:i,y:j}}
  const taken=[],place=(t,cx,cy,sz)=>{x.font=`bold ${sz}px ${FUI}`;const w=x.measureText(t).width+2,r={a:cx-w/2,b:cy-sz*.6,c:cx+w/2,d:cy+sz*.6};if(taken.some(q=>r.a<q.c&&r.c>q.a&&r.b<q.d&&r.d>q.b))return false;taken.push(r);api.text(x,t,cx,cy,sz,'#3a1c0c');return true};
  if(sd){mpOs441Stair(x,X(sd.x+.5),Y(sd.y+.5),s,false);place('Stair down',X(sd.x+.5),Y(sd.y+1)+5,5.2)}
  if(su){mpOs441Stair(x,X(su.x+.5),Y(su.y+.5),s,true);place('Stair up',X(su.x+.5)+1,Y(su.y)-s*1.1,5.2)}
  const pq=L.decor.find(d=>d.k==='hl_plq2');if(pq){const px=X(pq.x+.5),py=Y(pq.y+.5),r=s*.78;x.fillStyle='#8a8478';x.strokeStyle=INK;x.lineWidth=.7;x.beginPath();x.arc(px,py,r,0,6.3);x.fill();x.stroke();x.strokeStyle=MPL.GOLD;x.lineWidth=.5;x.beginPath();x.arc(px,py,r*.78,0,6.3);x.stroke();x.fillStyle='#f4ecd0';x.font=`bold ${s*1.05}px ${FTITLE}`;x.textAlign='center';x.textBaseline='middle';x.fillText('2',px,py+.2)}
  // ---- room names ----
  const A=MPL.AREA;for(let i=0;i<rooms.length;i++){const r=rooms[i];if(!r.n)continue;const nm=r.n;x.font=`bold 5.4px ${FUI}`;const w=x.measureText(nm).width;let cx=X((r.x0+r.x1+1)/2);cx=Math.max(A.x+w/2+3,Math.min(A.x+A.w-w/2-3,cx));
    if(!place(nm,cx,Y(r.y0)-s*.62,5.4))if(!place(nm,cx,Y(r.y1+1)+s*.7,5.4))place(nm,cx,Y(r.y0)-s*1.5,5.4)}
  // ---- title, key, notes, compass ----
  api.title(x,'The Orange Spire, Floor 2',null,10,8);
  api.text(x,'Gallery, cells, study, banquet and throne halls',14,36,5.6,'#5a3a1c','left');
  api.panel(x,6,48,82,112);api.text(x,'KEY',47,56,6.4,MPL.LAPIS);
  const ky=[['stair','Stairs'],['stone','Level stone'],['rug','Rug'],['door','Door frame'],['torch','Torch or candle'],['hl_pt0','Portrait'],['hl_p_mirror','Mirror'],['hl_p_window','Window'],['hl_p_banner','Banner'],['chest','Chest']];
  ky.forEach(([k,t],n)=>{const yy=66+n*9.2,ix=17;if(k==='stair')mpOs441Stair(x,ix,yy,5,false);else if(k==='stone'){x.fillStyle='#8a8478';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(ix,yy,2.8,0,6.3);x.fill();x.stroke()}
    else if(k==='rug'){x.fillStyle=MPL.VERM;x.fillRect(ix-4,yy-2.4,8,4.8);x.strokeStyle=MPL.GOLD;x.lineWidth=.6;x.strokeRect(ix-4,yy-2.4,8,4.8)}
    else if(k==='door'){x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.moveTo(ix-4,yy);x.lineTo(ix+4,yy);x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.arc(ix-4,yy,1,0,6.3);x.arc(ix+4,yy,1,0,6.3);x.fill()}
    else if(k==='torch'){x.fillStyle='#ffb83a';x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.moveTo(ix,yy-3.5);x.quadraticCurveTo(ix+2,yy,ix,yy+2);x.quadraticCurveTo(ix-2,yy,ix,yy-3.5);x.fill();x.stroke()}
    else mpOs441Icon(x,k,ix,yy,7.5,L);api.text(x,t,28,yy,5.6,'#3a2a1c','left')});
  api.notes(x,['Floor 2 of 20. Each floor of the spire is smaller than the one below it.','You arrive by the stair at the bottom of this plan. The stair up is at the far top left.','Rooms you have not yet walked past stay covered.'],394,50,76,5.8,3);
  api.compass(x,436,250,13);
}});
