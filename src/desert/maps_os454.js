/* Orange Spire map, floor 15, level 454: an illuminated cutaway plan in orange-brown spire stone. See maps_common.js and tools/MAP_BRIEF_SPIRE.md. Names start with mpOs454.
   No spoilers: hidden doors read as plain wall, the Strange Room is only named, and no trap, lever, mirror trick, ruler or enemy is marked. */
const MPOS454={STONE:'#c47a3a',DEEP:'#8a4c20',PLUM:'#4a2a3e',VIOLET:'rgba(88,48,118,',INK:'#2a1a0c',GOLD:'#c9a227',GOLD2:'#f0d878',VERM:'#b8321e'};
function mpOs454W(a,b,s){return hash2(a*7+3,b*13+5,s||11)-.5}
/* a hand-wobbled line from p to q */
function mpOs454Line(x,p,q,w,sd){const n=Math.max(2,Math.ceil(Math.hypot(q[0]-p[0],q[1]-p[1])/3));x.beginPath();for(let i=0;i<=n;i++){const t=i/n,a=p[0]+(q[0]-p[0])*t+mpOs454W(i,sd,3)*w,b=p[1]+(q[1]-p[1])*t+mpOs454W(i,sd,4)*w;i?x.lineTo(a,b):x.moveTo(a,b)}x.stroke()}
/* wall-hung icons: drawn in a frame whose x runs along the wall and +y points into the wall; (a,b) is the point on the wall line, s the cell size */
function mpOs454Wall(x,a,b,wx,wy,fn){x.save();x.translate(a,b);x.rotate(Math.atan2(-wx,wy));fn();x.restore()}
const MPOS454I={
  sconce(x,a,b,s,red){x.save();const g=x.createRadialGradient(a,b,0,a,b,s*1.5);g.addColorStop(0,red?'rgba(255,110,70,.5)':'rgba(255,205,90,.55)');g.addColorStop(1,'rgba(255,200,80,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,s*1.5,0,6.3);x.fill();
    x.strokeStyle=MPOS454.INK;x.lineWidth=.8;x.fillStyle=MPOS454.GOLD;x.beginPath();x.arc(a,b+s*.12,s*.2,0,6.3);x.fill();x.stroke();x.fillStyle=red?'#d8401e':'#f08a28';x.beginPath();x.moveTo(a-s*.13,b);x.quadraticCurveTo(a-s*.16,b-s*.3,a,b-s*.46);x.quadraticCurveTo(a+s*.16,b-s*.3,a+s*.13,b);x.closePath();x.fill();x.stroke();x.fillStyle=MPOS454.GOLD2;x.beginPath();x.moveTo(a-s*.06,b);x.quadraticCurveTo(a-s*.06,b-s*.15,a,b-s*.24);x.quadraticCurveTo(a+s*.06,b-s*.15,a+s*.06,b);x.fill();x.restore()},
  candle(x,a,b,s){x.save();x.strokeStyle=MPOS454.INK;x.lineWidth=.7;x.fillStyle='#efe4c4';x.fillRect(a-s*.07,b-s*.05,s*.14,s*.3);x.strokeRect(a-s*.07,b-s*.05,s*.14,s*.3);x.fillStyle='#f4a030';x.beginPath();x.arc(a,b-s*.14,s*.08,0,6.3);x.fill();x.restore()},
  window(x,s){x.fillStyle='#9ec6e8';x.strokeStyle=MPOS454.GOLD;x.lineWidth=1;x.beginPath();x.rect(-s*.32,-s*.04,s*.64,s*.3);x.fill();x.stroke();x.strokeStyle=MPOS454.INK;x.lineWidth=.5;x.beginPath();x.moveTo(0,-s*.04);x.lineTo(0,s*.26);x.moveTo(-s*.32,s*.11);x.lineTo(s*.32,s*.11);x.stroke()},
  mirror(x,s){x.fillStyle='#bcd8ec';x.strokeStyle=MPOS454.GOLD;x.lineWidth=1.3;x.beginPath();x.ellipse(0,s*.16,s*.3,s*.14,0,0,6.3);x.fill();x.stroke();x.strokeStyle=MPOS454.INK;x.lineWidth=.5;x.beginPath();x.ellipse(0,s*.16,s*.36,s*.19,0,0,6.3);x.stroke()},
  portrait(x,s){x.fillStyle='#6a3a2a';x.strokeStyle=MPOS454.GOLD;x.lineWidth=1.3;x.beginPath();x.rect(-s*.26,-s*.02,s*.52,s*.26);x.fill();x.stroke();x.fillStyle='#e6c88a';x.beginPath();x.arc(0,s*.1,s*.06,0,6.3);x.fill();x.strokeStyle=MPOS454.INK;x.lineWidth=.5;x.strokeRect(-s*.3,-s*.06,s*.6,s*.34)},
  plaque(x,s){x.fillStyle='#dccaa0';x.strokeStyle=MPOS454.INK;x.lineWidth=.9;x.beginPath();x.rect(-s*.38,-s*.04,s*.76,s*.34);x.fill();x.stroke();x.strokeStyle=MPOS454.GOLD;x.lineWidth=.6;x.strokeRect(-s*.34,0,s*.68,s*.26)},
  claws(x,s){x.strokeStyle='#4a1a14';x.lineWidth=.9;x.lineCap='round';for(let k=-1;k<=1;k++){x.beginPath();x.moveTo(k*s*.13-s*.05,-s*.02);x.lineTo(k*s*.13+s*.07,s*.3);x.stroke()}},
  hearth(x,s){x.fillStyle='#a8a0a0';x.strokeStyle=MPOS454.INK;x.lineWidth=1;x.beginPath();x.rect(-s*.42,-s*.06,s*.84,s*.4);x.fill();x.stroke();x.fillStyle='#2a1a14';x.beginPath();x.rect(-s*.26,s*.02,s*.52,s*.28);x.fill();x.fillStyle='#ff8a30';x.beginPath();x.moveTo(0,s*.04);x.quadraticCurveTo(s*.2,s*.18,0,s*.28);x.quadraticCurveTo(-s*.2,s*.18,0,s*.04);x.fill();x.strokeStyle=MPOS454.GOLD;x.lineWidth=.9;x.beginPath();x.moveTo(-s*.42,-s*.06);x.lineTo(s*.42,-s*.06);x.stroke()},
  cage(x,a,b,s){x.save();x.strokeStyle='#3a3440';x.lineWidth=.9;x.fillStyle='rgba(40,34,50,.18)';x.fillRect(a-s*.3,b-s*.3,s*.6,s*.6);x.strokeRect(a-s*.3,b-s*.3,s*.6,s*.6);for(let k=-2;k<=2;k++){x.beginPath();x.moveTo(a+k*s*.12,b-s*.3);x.lineTo(a+k*s*.12,b+s*.3);x.stroke()}x.fillStyle=MPOS454.GOLD;x.beginPath();x.arc(a,b,s*.06,0,6.3);x.fill();x.restore()},
  rack(x,a,b,s){x.save();x.strokeStyle=MPOS454.INK;x.lineWidth=.8;x.fillStyle='#7a5030';x.fillRect(a-s*.32,b-s*.22,s*.64,s*.44);x.strokeRect(a-s*.32,b-s*.22,s*.64,s*.44);x.beginPath();x.moveTo(a-s*.32,b-s*.22);x.lineTo(a+s*.32,b+s*.22);x.moveTo(a+s*.32,b-s*.22);x.lineTo(a-s*.32,b+s*.22);x.stroke();x.restore()},
  shelf(x,a,b,s){x.save();x.strokeStyle=MPOS454.INK;x.lineWidth=.8;x.fillStyle='#6a3a1e';x.fillRect(a-s*.4,b-s*.28,s*.8,s*.56);x.strokeRect(a-s*.4,b-s*.28,s*.8,s*.56);const cols=['#b8321e','#274a9a','#3a7a5a','#c9a227','#b8321e','#274a9a'];for(let k=0;k<6;k++){x.fillStyle=cols[k];x.fillRect(a-s*.34+k*s*.115,b-s*.2,s*.08,s*.18);x.fillRect(a-s*.34+k*s*.115,b+s*.04,s*.08,s*.17)}x.restore()},
  lectern(x,a,b,s){x.save();x.strokeStyle=MPOS454.INK;x.lineWidth=.8;x.fillStyle='#7a4a2a';x.beginPath();x.rect(a-s*.26,b-s*.2,s*.52,s*.4);x.fill();x.stroke();x.fillStyle='#f0e6c8';x.fillRect(a-s*.2,b-s*.12,s*.4,s*.22);x.strokeRect(a-s*.2,b-s*.12,s*.4,s*.22);x.beginPath();x.moveTo(a,b-s*.12);x.lineTo(a,b+s*.1);x.stroke();x.restore()},
  desk(x,a,b,s){x.save();x.strokeStyle=MPOS454.INK;x.lineWidth=.8;x.fillStyle='#8a5a30';x.fillRect(a-s*.34,b-s*.22,s*.68,s*.44);x.strokeRect(a-s*.34,b-s*.22,s*.68,s*.44);x.fillStyle='#f0e6c8';x.fillRect(a-s*.14,b-s*.12,s*.26,s*.18);x.strokeRect(a-s*.14,b-s*.12,s*.26,s*.18);x.restore()},
  stairs(x,a,b,s,up,dx,dy){/* a little stair in cell (a,b) top-left; (dx,dy) is the direction the treads climb or fall, away from the room */
    x.save();x.translate(a+s/2,b+s/2);x.rotate(Math.atan2(dx,-dy));x.fillStyle=up?'#e8c870':'#9a6030';x.strokeStyle=MPOS454.INK;x.lineWidth=.9;x.fillRect(-s*.5,-s*.5,s,s);x.strokeRect(-s*.5,-s*.5,s,s);
    for(let k=1;k<5;k++){const yy=-s*.5+k*s/5,w=up?s*.5-k*.4:s*.5-(4-k)*.4;x.beginPath();x.moveTo(-w,yy);x.lineTo(w,yy);x.stroke()}
    x.fillStyle=up?MPOS454.VERM:MPOS454.PLUM;x.beginPath();x.moveTo(0,-s*.34);x.lineTo(s*.2,s*.04);x.lineTo(s*.05,s*.04);x.lineTo(s*.05,s*.34);x.lineTo(-s*.05,s*.34);x.lineTo(-s*.05,s*.04);x.lineTo(-s*.2,s*.04);x.closePath();if(!up){x.rotate(Math.PI)}x.fill();x.stroke();x.restore()}};
mplInstall({name:'os454',levels:[454],reveal:true,foot:'You are the yellow arrow. The stair down is where you arrive.',tint:[10,-6,-18],
draw(c,x,L,api){
  const rows=L.rows,W=rows[0].length,H=rows.length,f=api.fit(W,H),s=f.s,X=f.X,Y=f.Y,I=api.I,P=MPOS454,INK=P.INK;
  const ch=(a,b)=>a>=0&&b>=0&&a<W&&b<H?rows[b][a]:'#';
  const open=(a,b)=>{const r=ch(a,b);return r==='.'||r==='0'||r==='1'};
  const floor=(a,b)=>ch(a,b)==='.';/* stairs are drawn as stairs, set into the wall line */
  const wall=(a,b)=>!open(a,b);
  const near=(a,b)=>{for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(open(a+i,b+j))return true;return false};
  const RI=L._roomsInfo||[],inRoom=(a,b)=>RI.some(r=>a>=r.x0&&a<=r.x1&&b>=r.y0&&b<=r.y1);
  const roomAt=(a,b)=>RI.findIndex(r=>a>=r.x0&&a<=r.x1&&b>=r.y0&&b<=r.y1);
  const D=(G&&G.decor&&G.decor.length&&LEVEL===454)?G.decor:L.decor;
  /* a faint wash over the whole drawing area, then the spire block */
  const A=MPL.AREA;x.save();x.fillStyle='rgba(90,40,70,.07)';x.fillRect(A.x,A.y,A.w,A.h);x.restore();
  /* spire stone: deep plum-brown far from the halls, warm orange near them, hatched */
  x.save();x.beginPath();x.rect(X(0),Y(0),W*s,H*s);x.clip();
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(open(i,j))continue;const n=near(i,j),h=hash2(i,j,21);
    x.fillStyle=n?`rgb(${190+h*18|0},${116+h*14|0},${54+h*10|0})`:`rgb(${134+h*14|0},${76+h*10|0},${34+h*8|0})`;x.fillRect(X(i)-.3,Y(j)-.3,s+.6,s+.6);
    x.fillStyle=n?P.VIOLET+'.16)':P.VIOLET+'.28)';x.fillRect(X(i)-.3,Y(j)-.3,s+.6,s+.6)}
  /* stone courses: short brick joints on the near walls */
  x.strokeStyle='rgba(60,30,40,.3)';x.lineWidth=.5;for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(open(i,j)||!near(i,j))continue;const o=hash2(i,j,3)>.5?.25:0;x.beginPath();x.moveTo(X(i),Y(j)+s*.5);x.lineTo(X(i)+s,Y(j)+s*.5);x.moveTo(X(i)+s*(.35+o),Y(j));x.lineTo(X(i)+s*(.35+o),Y(j)+s*.5);x.moveTo(X(i)+s*(.7-o),Y(j)+s*.5);x.lineTo(X(i)+s*(.7-o),Y(j)+s);x.stroke()}
  x.lineWidth=.55;for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(open(i,j))continue;const n=near(i,j);x.strokeStyle=n?'rgba(58,28,44,.42)':'rgba(236,196,150,.2)';const st=n?2.4:2.7;x.save();x.beginPath();x.rect(X(i),Y(j),s,s);x.clip();x.beginPath();for(let k=-s;k<s*2;k+=st){x.moveTo(X(i)+k+hash2(i,j,5)*.6,Y(j));x.lineTo(X(i)+k-s,Y(j)+s)}x.stroke();
    if(!n){x.beginPath();for(let k=-s;k<s*2;k+=st*1.7){x.moveTo(X(i)+k,Y(j)+s);x.lineTo(X(i)+k+s,Y(j))}x.stroke()}x.restore()}
  x.restore();
  /* flagged floors, warm stone with a plum shadow along the walls */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!open(i,j))continue;const h=hash2(i,j,9);
    x.fillStyle=`rgb(${236+h*10|0},${206+h*12|0},${160+h*12|0})`;x.fillRect(X(i)-.2,Y(j)-.2,s+.4,s+.4);
    x.strokeStyle='rgba(110,62,34,.4)';x.lineWidth=.5;const off=hash2(i,j,2)>.5?.5:0;
    x.beginPath();x.moveTo(X(i),Y(j)+s*.5);x.lineTo(X(i)+s,Y(j)+s*.5);x.moveTo(X(i)+s*(.3+off*.4),Y(j));x.lineTo(X(i)+s*(.3+off*.4),Y(j)+s*.5);x.moveTo(X(i)+s*(.7-off*.4),Y(j)+s*.5);x.lineTo(X(i)+s*(.7-off*.4),Y(j)+s);x.stroke();
    if(h>.84){x.fillStyle='rgba(110,62,34,.16)';x.beginPath();x.ellipse(X(i)+s*(.2+hash2(i,j,3)*.6),Y(j)+s*(.2+hash2(i,j,4)*.6),s*.25,s*.15,h*3,0,6.3);x.fill()}}
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!open(i,j))continue;x.fillStyle='rgba(74,42,62,.22)';
    if(wall(i,j-1))x.fillRect(X(i),Y(j),s,s*.2);if(wall(i-1,j))x.fillRect(X(i),Y(j),s*.17,s);if(wall(i,j+1))x.fillRect(X(i),Y(j)+s*.88,s,s*.12);if(wall(i+1,j))x.fillRect(X(i)+s*.9,Y(j),s*.1,s)}
  /* vermilion rugs with a gold border, in the halls that are broad enough (not under the furniture of the cells) */
  RI.forEach((r,i)=>{const w=r.x1-r.x0+1,h=r.y1-r.y0+1;if(w<4||h<3||/Cells|Strange/.test(r.n))return;
    const x0=r.x0+1,x1=r.x1-1,y0=r.y0+1,y1=r.y1-1;if(x1<x0||y1<y0)return;
    const a=X(x0)+1.2,b=Y(y0)+1.2,rw=(x1-x0+1)*s-2.4,rh=(y1-y0+1)*s-2.4;
    x.save();x.fillStyle=P.VERM;x.strokeStyle=INK;x.lineWidth=.9;x.fillRect(a,b,rw,rh);x.strokeRect(a,b,rw,rh);x.strokeStyle=P.GOLD;x.lineWidth=.9;x.strokeRect(a+1.8,b+1.8,rw-3.6,rh-3.6);
    x.fillStyle=P.GOLD2;for(let k=0;k<=Math.floor(rw/6);k++){const gx=a+rw*(k+.5)/(Math.floor(rw/6)+1);x.beginPath();x.moveTo(gx,b+rh/2-1.6);x.lineTo(gx+1.4,b+rh/2);x.lineTo(gx,b+rh/2+1.6);x.lineTo(gx-1.4,b+rh/2);x.closePath();x.fill()}
    x.strokeStyle='rgba(240,216,120,.75)';x.lineWidth=.6;for(let k=0;k<rh;k+=2.2){x.beginPath();x.moveTo(a-1.6,b+k);x.lineTo(a,b+k);x.moveTo(a+rw,b+k);x.lineTo(a+rw+1.6,b+k);x.stroke()}x.restore()});
  /* doorways: a gold frame where a one-cell passage meets a hall */
  const doors=[];
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!floor(i,j)||inRoom(i,j))continue;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const ri=roomAt(i+dx,j+dy);if(ri<0||!floor(i+dx,j+dy))continue;
      if(wall(i+dy,j+dx)&&wall(i-dy,j-dx))doors.push({i,j,dx,dy})}}
  for(const d of doors){x.save();const mx=X(d.i)+s*(.5+d.dx*.5),my=Y(d.j)+s*(.5+d.dy*.5);x.translate(mx,my);x.rotate(Math.atan2(d.dy,d.dx));
    x.strokeStyle=INK;x.lineWidth=2.6;x.beginPath();x.moveTo(0,-s*.5);x.lineTo(0,s*.5);x.stroke();x.strokeStyle=P.GOLD;x.lineWidth=1.5;x.beginPath();x.moveTo(0,-s*.5);x.lineTo(0,s*.5);x.stroke();
    x.fillStyle=P.GOLD2;x.strokeStyle=INK;x.lineWidth=.6;for(const e of [-1,1]){x.beginPath();x.rect(-s*.1,e*s*.5-s*.09,s*.2,s*.18);x.fill();x.stroke()}x.restore()}
  /* inked wall edges, doubled and wobbly */
  x.lineCap='round';
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!open(i,j))continue;
    for(const [di,dj,p,q] of [[0,-1,[X(i),Y(j)],[X(i+1),Y(j)]],[0,1,[X(i),Y(j+1)],[X(i+1),Y(j+1)]],[-1,0,[X(i),Y(j)],[X(i),Y(j+1)]],[1,0,[X(i+1),Y(j)],[X(i+1),Y(j+1)]]]){
      if(open(i+di,j+dj))continue;const sd=i*31+j*17+di*3+dj;x.strokeStyle=INK;x.lineWidth=1.5;mpOs454Line(x,p,q,.7,sd);x.lineWidth=.5;x.strokeStyle='rgba(42,26,40,.6)';mpOs454Line(x,[p[0]+di*1.7,p[1]+dj*1.7],[q[0]+di*1.7,q[1]+dj*1.7],.6,sd+7)}}
  /* the outer edge of the spire block, a heavier wobbly rule with gold studs at the corners */
  x.strokeStyle=INK;x.lineWidth=1.8;for(const [p,q] of [[[X(0),Y(0)],[X(W),Y(0)]],[[X(W),Y(0)],[X(W),Y(H)]],[[X(W),Y(H)],[X(0),Y(H)]],[[X(0),Y(H)],[X(0),Y(0)]]])mpOs454Line(x,p,q,.8,W*H+p[0]|0);
  x.fillStyle=P.GOLD;for(const [a,b] of [[0,0],[W,0],[0,H],[W,H]]){x.beginPath();x.arc(X(a),Y(b),2.2,0,6.3);x.fill();x.lineWidth=.7;x.stroke()}
  /* the stairs: down where you arrive, up at the far end, set into the wall line with the treads running away from the hall */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const r=ch(i,j);if(r!=='0'&&r!=='1')continue;let dx=0,dy=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(floor(i+a,j+b)){dx=-a;dy=-b}
    MPOS454I.stairs(x,X(i),Y(j),s,r==='1',dx,dy);x.strokeStyle=INK;x.lineWidth=1.2;x.strokeRect(X(i),Y(j),s,s);
    api.text(x,r==='1'?'Up':'Down',X(i)+s/2+(dx?dx*s*1.1:0),Y(j)+s/2+(dy?dy*s*.95:0)+(dy?0:s*.0),5.6,r==='1'?'#8a5a10':P.PLUM)}
  /* furniture and decoration from the real data (nothing hidden, trapped or alive) */
  const lamps=[];
  for(const d of D){const wd=d.wd,cx=X(d.x+.5),cy=Y(d.y+.5),k=d.k;
    if(wd&&/^hl_(pt\d|p_window|p_mirror|plq\d+|claw\d|fire)$/.test(k)){const wx=cx+wd[0]*s*.5,wy=cy+wd[1]*s*.5;
      mpOs454Wall(x,wx,wy,wd[0],wd[1],()=>{if(/^hl_pt/.test(k))MPOS454I.portrait(x,s);else if(k==='hl_p_window')MPOS454I.window(x,s);else if(k==='hl_p_mirror')MPOS454I.mirror(x,s);else if(/^hl_plq/.test(k))MPOS454I.plaque(x,s);else if(/^hl_claw/.test(k))MPOS454I.claws(x,s);else MPOS454I.hearth(x,s)});
      if(/^hl_plq/.test(k)){const px=wx+wd[0]*s*.14,py=wy+wd[1]*s*.14+(wd[1]?.3:0);x.save();x.font=`bold ${s*.3}px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.fillStyle=INK;x.fillText(k.slice(6),px,py);x.restore()}}
    else if(k==='hl_p_cage')MPOS454I.cage(x,cx,cy,s);else if(k==='hl_p_rack')MPOS454I.rack(x,cx,cy,s);else if(k==='hl_p_shelf')MPOS454I.shelf(x,cx,cy,s);else if(k==='hl_p_lectern')MPOS454I.lectern(x,cx,cy,s);
    else if(k==='hl_p_desk')MPOS454I.desk(x,cx,cy,s);else if(k==='hl_p_candle')MPOS454I.candle(x,cx,cy,s);else if(k==='lamp')lamps.push([d.x+.5,d.y+.5,null])}
  /* sconces: lanterns at their cells, plus any light the data holds that has no lantern beside it */
  const LG=(typeof LIGHTS!=='undefined'&&LIGHTS&&LIGHTS.length&&LEVEL===454)?LIGHTS:[];
  for(const l of LG)if(!lamps.some(m=>Math.hypot(m[0]-l.x,m[1]-l.y)<1.6))lamps.push([l.x,l.y,l.red?1:0]);
  for(const m of lamps){let red=m[2];if(red===null){const l=LG.find(q=>Math.hypot(q.x-m[0],q.y-m[1])<1.6);red=l&&l.red?1:0}MPOS454I.sconce(x,X(m[0]),Y(m[1])+s*.12,s,red)}
  /* room names, from mapNames, set in the middle of each hall */
  const names=L.mapNames||[];
  names.forEach((n,i)=>{const r=RI[i];if(!r)return;const cx=X((r.x0+r.x1+1)/2),w=(r.x1-r.x0+1)*s+8,lines=api.wrap(x,n.t,w,6.4);
    let cy=Y((r.y0+r.y1+1)/2)-(lines.length-1)*3.6;
    for(const l of lines){api.text(x,l,cx,cy,6.4,i===0?'#5a0e0a':'#2a1a0c');cy+=7.2}});
  /* title, key, notes, compass: the same layout on every floor of the spire */
  api.title(x,'The Orange Spire, Floor 15','The Cells, the Haunted Room, the Studies and a Strange Room');
  const kx=6,ky=60,kw=82;api.panel(x,kx,ky,kw,166);api.text(x,'KEY',kx+kw/2,ky+8,7,'#7a2a14');
  const kr=[['Spire wall',()=>{x.fillStyle='#c47a3a';x.fillRect(kx+5,ky+17,12,8);x.strokeStyle='rgba(58,28,44,.7)';x.lineWidth=.6;for(let k=0;k<14;k+=2.6){x.beginPath();x.moveTo(kx+5+k,ky+17);x.lineTo(kx+k-1,ky+25);x.stroke()}x.strokeStyle=INK;x.strokeRect(kx+5,ky+17,12,8)}],
    ['Doorway',()=>{x.strokeStyle=INK;x.lineWidth=2.6;x.beginPath();x.moveTo(kx+11,ky+30);x.lineTo(kx+11,ky+40);x.stroke();x.strokeStyle=P.GOLD;x.lineWidth=1.5;x.stroke();x.fillStyle=P.GOLD2;x.fillRect(kx+9.5,ky+29,3,2);x.fillRect(kx+9.5,ky+39,3,2)}],
    ['Stair down',()=>MPOS454I.stairs(x,kx+5,ky+44,11,false,0,1)],['Stair up',()=>MPOS454I.stairs(x,kx+5,ky+57,11,true,0,-1)],
    ['Rug',()=>{x.fillStyle=P.VERM;x.fillRect(kx+5,ky+72,12,7);x.strokeStyle=P.GOLD;x.lineWidth=.8;x.strokeRect(kx+6.8,ky+73.8,8.4,3.4);x.strokeStyle=INK;x.lineWidth=.7;x.strokeRect(kx+5,ky+72,12,7)}],
    ['Lantern',()=>MPOS454I.sconce(x,kx+11,ky+90,9,0)],
    ['Window',()=>mpOs454Wall(x,kx+11,ky+99,0,1,()=>MPOS454I.window(x,13))],['Mirror',()=>mpOs454Wall(x,kx+11,ky+111,0,1,()=>MPOS454I.mirror(x,13))],
    ['Portrait',()=>mpOs454Wall(x,kx+11,ky+123,0,1,()=>MPOS454I.portrait(x,13))],['Claw marks',()=>mpOs454Wall(x,kx+11,ky+135,0,1,()=>MPOS454I.claws(x,13))],
    ['Bookshelf',()=>MPOS454I.shelf(x,kx+11,ky+149,12)],['Fireplace',()=>mpOs454Wall(x,kx+11,ky+158,0,1,()=>MPOS454I.hearth(x,11))]];
  const gy=[21,34,49,62,76,90,101,113,125,137,150,159];
  kr.forEach((r,i)=>{r[1]();api.text(x,r[0],kx+25,ky+gy[i],6.4,'#3a2a1c','left')});
  const nx=392,nw=82;api.panel(x,nx-2,50,nw,176);api.text(x,'NOTES',nx+nw/2-2,58,7,'#7a2a14');
  mplNotes(x,['The stair down is in the south, where you arrive.','The stair up is in the north west corner, beside the cells.','Lanterns burn in the corners of the larger rooms.','Portraits and a numbered stone hang by the stair.'],nx+3,69,nw-9,6.2,4);
  api.compass(x,435,254,15);
  I.tower(x,435,283,.8)}});
