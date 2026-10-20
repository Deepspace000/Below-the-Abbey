/* ==========================================================================
   Orange Spire, floor 3 (level 442): hand-drawn plan map, see maps_common.js and tools/MAP_BRIEF_SPIRE.md.
   Drawn from the real level data: walls and floors from rows, doorways from the room list, furniture and wall pictures from decor, torches from the lamps.
   No spoilers: no hidden doors, levers, trap rooms, pits, horrors or enemies; the mystery room is only 'The Strange Room'.
   Layout shared by all spire floors: left margin = title, subtitle, key; right margin = tower gauge, notes, compass.
   ========================================================================== */
const MPOS442={FLOOR:3};
function mpOs442Draw(c,x,L,api){
  const rows=L.rows,W=rows[0].length,H=rows.length,F=mplFit(W,H),X=F.X,Y=F.Y,s=F.s,u=s/5.3,FL=MPOS442.FLOOR;
  const INK='#2a1a0c',STONE='#c47a3a',STONE2='#8a4c20',PLUM='#4a2a44',GOLD=MPL.GOLD,GOLD2=MPL.GOLD2,VERM=MPL.VERM;
  const fl=(cx,cy)=>cx>=0&&cy>=0&&cx<W&&cy<H&&'.01'.indexOf(rows[cy][cx])>=0;
  const stairAt=(cx,cy)=>cx>=0&&cy>=0&&cx<W&&cy<H&&(rows[cy][cx]==='0'||rows[cy][cx]==='1');
  // distance (chebyshev, up to 2) from every wall cell to the nearest floor: the thickness of drawn stone
  const md=[];for(let y=0;y<H;y++){md.push([]);for(let xx=0;xx<W;xx++){let d=fl(xx,y)?0:9;if(d){for(let r=1;r<=2&&d>2;r++){for(let a=-r;a<=r&&d>2;a++)for(let b=-r;b<=r;b++)if(Math.max(Math.abs(a),Math.abs(b))===r&&fl(xx+a,y+b)){d=r;break}}}md[y].push(d)}}
  // wall cells that cannot be reached from outside the plan without crossing the near stone are enclosed pockets: they are stone too (distance 3, sparse hatching)
  {const out=new Uint8Array(W*H),q=[];const push=(a,b)=>{if(a>=0&&b>=0&&a<W&&b<H&&!out[b*W+a]&&md[b][a]>2){out[b*W+a]=1;q.push([a,b])}};
   for(let a=0;a<W;a++){push(a,0);push(a,H-1)}for(let b=0;b<H;b++){push(0,b);push(W-1,b)}
   while(q.length){const [a,b]=q.pop();push(a+1,b);push(a-1,b);push(a,b+1);push(a,b-1)}
   for(let b=0;b<H;b++)for(let a=0;a<W;a++)if(md[b][a]>2&&!out[b*W+a])md[b][a]=3}
  const mass=(cx,cy)=>cx>=0&&cy>=0&&cx<W&&cy<H&&md[cy][cx]<=3;
  const jv=(cx,cy,k)=>[X(cx)+(hash2(cx*3+k,cy*5+1,11)-.5)*s*.24,Y(cy)+(hash2(cx*5+2,cy*3+k,12)-.5)*s*.24];
  const seg=(x1,y1,x2,y2,k)=>{const a=jv(x1,y1,k),b=jv(x2,y2,k),mx=(a[0]+b[0])/2+(hash2(x1+x2,y1+y2,k+20)-.5)*s*.16,my=(a[1]+b[1])/2+(hash2(x1+y2,y1+x2,k+30)-.5)*s*.16;x.moveTo(a[0],a[1]);x.quadraticCurveTo(mx,my,b[0],b[1])};
  const edges=(pred,k)=>{x.beginPath();for(let y=0;y<=H;y++)for(let xx=0;xx<=W;xx++){if(xx<W&&pred(xx,y)!==pred(xx,y-1))seg(xx,y,xx+1,y,k);if(y<H&&pred(xx,y)!==pred(xx-1,y))seg(xx,y,xx,y+1,k+3)}};
  const R=(a,b,k)=>hash2(a,b,k);

  /* ---- the stone around the rooms: warm spire stone washed with plum, hatched in ink ---- */
  x.save();
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const d=md[y][xx];if(d<1||d>3)continue;
    x.fillStyle=d===1?'rgba(120,64,44,.50)':d===2?'rgba(176,112,62,.30)':'rgba(176,112,62,.22)';x.fillRect(X(xx)-.2,Y(y)-.2,s+.4,s+.4);
    if(d===1){x.fillStyle='rgba(74,42,84,.18)';x.fillRect(X(xx),Y(y),s,s)}}
  x.lineCap='round';x.strokeStyle='rgba(42,24,40,.55)';x.lineWidth=.42;x.beginPath();
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const d=md[y][xx];if(d<1||d>3)continue;const n=d===1?3:d===2?2:(R(xx,y,46)<.6?1:0);
    for(let i=0;i<n;i++){const a=X(xx)+R(xx*7+i,y,41)*s*.8,b=Y(y)+R(xx,y*5+i,42)*s*.8+s*.15,L2=s*(.28+R(xx+i,y,43)*.22);x.moveTo(a,b);x.lineTo(a+L2,b-L2*.9)}}
  x.stroke();
  // stone block joints close to the floor
  x.strokeStyle='rgba(60,32,36,.45)';x.lineWidth=.35;x.beginPath();
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){if(md[y][xx]!==1)continue;const a=X(xx),b=Y(y);x.moveTo(a+s*.1,b+s*.5);x.lineTo(a+s*.9,b+s*.5);if(R(xx,y,44)<.6){x.moveTo(a+s*(.3+R(xx,y,45)*.4),b+s*.1);x.lineTo(a+s*(.3+R(xx,y,45)*.4),b+s*.5)}}
  x.stroke();
  // outer edge of the stone
  x.strokeStyle=INK;x.lineWidth=.9;edges(mass,1);x.stroke();x.strokeStyle='rgba(74,42,68,.6)';x.lineWidth=.45;edges(mass,5);x.stroke();
  x.restore();

  /* ---- flagged floors ---- */
  x.save();
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){if(!fl(xx,y)||stairAt(xx,y))continue;const h=R(xx,y,51),chk=(xx+y)&1;
    x.fillStyle=chk?(h<.5?'#e4b073':'#dfa968'):(h<.5?'#d99f5e':'#e8b97c');x.fillRect(X(xx),Y(y),s+.3,s+.3)}
  x.strokeStyle='rgba(138,76,32,.34)';x.lineWidth=.3;x.beginPath();
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){if(!fl(xx,y)||stairAt(xx,y))continue;x.moveTo(X(xx),Y(y)+s);x.lineTo(X(xx)+s,Y(y)+s);x.lineTo(X(xx)+s,Y(y))}
  x.stroke();
  // cracks and chips
  x.strokeStyle='rgba(100,56,36,.5)';x.lineWidth=.35;x.beginPath();
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){if(!fl(xx,y)||stairAt(xx,y)||R(xx,y,52)>.07)continue;const a=X(xx)+s*.3,b=Y(y)+s*.3;x.moveTo(a,b);x.lineTo(a+s*.25,b+s*.2);x.lineTo(a+s*.2,b+s*.5)}
  x.stroke();
  // violet shadow just inside every wall (light comes from the south east)
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){if(!fl(xx,y)||stairAt(xx,y))continue;x.fillStyle='rgba(78,40,96,.26)';
    if(!fl(xx,y-1))x.fillRect(X(xx),Y(y),s,s*.34);if(!fl(xx-1,y))x.fillRect(X(xx),Y(y),s*.26,s);
    x.fillStyle='rgba(78,40,96,.12)';if(!fl(xx+1,y))x.fillRect(X(xx)+s*.8,Y(y),s*.2,s);if(!fl(xx,y+1))x.fillRect(X(xx),Y(y)+s*.8,s,s*.2)}
  x.restore();

  /* ---- vermilion rugs in the larger rooms (not where cages or racks stand) ---- */
  const info=L._roomsInfo||[],decor=(L.decor||[]).filter(d=>!d.hidden);
  info.forEach((r,i)=>{if(i===1)return;const w=r.x1-r.x0+1,h=r.y1-r.y0+1;if(w<5||h<3)return;
    if(decor.some(d=>d.x>=r.x0&&d.x<=r.x1&&d.y>=r.y0&&d.y<=r.y1&&/^(hl_p_cage|hl_p_rack|hl_p_throne|dhatch|hl_p_coffin|hl_p_tomb)$/.test(d.k)))return;
    const a=X(r.x0+1),b=Y(r.y0+1),rw=(w-2)*s,rh=(h-2)*s;x.save();x.fillStyle='rgba(176,40,28,.80)';x.fillRect(a,b,rw,rh);
    x.strokeStyle=GOLD;x.lineWidth=.9;x.strokeRect(a+.9,b+.9,rw-1.8,rh-1.8);x.strokeStyle='rgba(42,26,12,.8)';x.lineWidth=.5;x.strokeRect(a,b,rw,rh);
    x.strokeStyle='rgba(240,216,120,.55)';x.lineWidth=.4;x.beginPath();for(let k=1;k<Math.floor(rw/(s*1.1));k++){x.moveTo(a+k*s*1.1,b+2.2);x.lineTo(a+k*s*1.1,b+3.2);x.moveTo(a+k*s*1.1,b+rh-2.2);x.lineTo(a+k*s*1.1,b+rh-3.2)}x.stroke();
    x.fillStyle='rgba(240,216,120,.6)';x.beginPath();x.arc(a+rw/2,b+rh/2,Math.min(rw,rh)*.16,0,6.3);x.fill();x.strokeStyle='rgba(42,26,12,.7)';x.lineWidth=.4;x.stroke();x.restore()});

  /* ---- ink along every wall edge: doubled and wobbly ---- */
  x.save();x.lineCap='round';x.strokeStyle=INK;x.lineWidth=1.15;edges((a,b)=>fl(a,b),2);x.stroke();x.strokeStyle='rgba(74,42,68,.75)';x.lineWidth=.5;edges((a,b)=>fl(a,b),7);x.stroke();x.restore();

  /* ---- doorways: where a one-cell passage meets a room, a gold frame ---- */
  const doors=[];
  info.forEach(r=>{
    for(let xx=r.x0;xx<=r.x1;xx++){
      let yy=r.y0-1;if(fl(xx,yy)&&!stairAt(xx,yy)&&!fl(xx-1,yy)&&!fl(xx+1,yy))doors.push([xx,yy+1,xx+1,yy+1]);
      yy=r.y1+1;if(fl(xx,yy)&&!stairAt(xx,yy)&&!fl(xx-1,yy)&&!fl(xx+1,yy))doors.push([xx,yy,xx+1,yy])}
    for(let yy=r.y0;yy<=r.y1;yy++){
      let xx=r.x0-1;if(fl(xx,yy)&&!fl(xx,yy-1)&&!fl(xx,yy+1))doors.push([xx+1,yy,xx+1,yy+1]);
      xx=r.x1+1;if(fl(xx,yy)&&!fl(xx,yy-1)&&!fl(xx,yy+1))doors.push([xx,yy,xx,yy+1])}});
  x.save();x.lineCap='butt';for(const d of doors){const a=[X(d[0]),Y(d[1])],b=[X(d[2]),Y(d[3])];
    x.strokeStyle=INK;x.lineWidth=3.2;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();
    x.strokeStyle=GOLD;x.lineWidth=2;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();
    x.strokeStyle='#7a2a18';x.lineWidth=.8;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();
    x.fillStyle=GOLD2;x.strokeStyle=INK;x.lineWidth=.5;for(const p of [a,b]){x.beginPath();x.arc(p[0],p[1],1.35*u,0,6.3);x.fill();x.stroke()}}x.restore();

  /* ---- little icons (also used in the key) ---- */
  const wallDir=d=>{if(d.wd&&(d.wd[0]||d.wd[1]))return [d.wd[0],d.wd[1]];for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]])if(!fl(d.x+dx,d.y+dy))return [dx,dy];return [0,-1]};
  const gl=(a,b,r,col)=>{const g=x.createRadialGradient(a,b,0,a,b,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(255,200,100,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,r,0,6.3);x.fill()};
  const flame=(a,b,col,sz)=>{x.fillStyle=col;x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.moveTo(a,b-sz*1.7);x.quadraticCurveTo(a+sz*.9,b-sz*.4,a,b+sz*.2);x.quadraticCurveTo(a-sz*.9,b-sz*.4,a,b-sz*1.7);x.fill();x.stroke();x.fillStyle='#fff0a0';x.beginPath();x.arc(a,b-sz*.4,sz*.28,0,6.3);x.fill()};
  const ic={
    lamp(a,b,o){gl(a,b-u,5*u,o&&o.violet?'rgba(170,110,240,.42)':'rgba(255,150,70,.42)');x.fillStyle=GOLD;x.strokeStyle=INK;x.lineWidth=.55;x.beginPath();x.arc(a,b+.5*u,1.35*u,0,6.3);x.fill();x.stroke();x.fillStyle=STONE2;x.fillRect(a-.35*u,b+1.4*u,.7*u,1.3*u);flame(a,b-.2*u,o&&o.violet?'#a060e0':'#e8402a',1.15*u)},
    candle(a,b){gl(a,b-1.2*u,3.4*u,'rgba(255,220,120,.4)');x.fillStyle='#f4ecd2';x.strokeStyle=INK;x.lineWidth=.45;x.fillRect(a-.55*u,b-1*u,1.1*u,2.6*u);x.strokeRect(a-.55*u,b-1*u,1.1*u,2.6*u);x.fillStyle=GOLD;x.fillRect(a-1.3*u,b+1.6*u,2.6*u,.7*u);flame(a,b-1*u,'#ffb030',.9*u)},
    cage(a,b){x.fillStyle='rgba(60,40,40,.35)';x.fillRect(a-1.8*u,b-1.8*u,3.6*u,3.6*u);x.strokeStyle=INK;x.lineWidth=.55;x.strokeRect(a-1.8*u,b-1.8*u,3.6*u,3.6*u);x.lineWidth=.4;x.beginPath();for(let k=-1;k<=1;k++){x.moveTo(a+k*.9*u,b-1.8*u);x.lineTo(a+k*.9*u,b+1.8*u)}x.moveTo(a-1.8*u,b-.4*u);x.lineTo(a+1.8*u,b-.4*u);x.stroke()},
    rack(a,b){x.strokeStyle='#5a3418';x.lineWidth=.9*u;x.beginPath();x.moveTo(a-2*u,b-1.4*u);x.lineTo(a+2*u,b-1.4*u);x.moveTo(a-2*u,b+1.4*u);x.lineTo(a+2*u,b+1.4*u);x.stroke();x.strokeStyle=INK;x.lineWidth=.5;x.strokeRect(a-2*u,b-1.4*u,4*u,2.8*u);x.beginPath();x.moveTo(a-2*u,b-1.4*u);x.lineTo(a+2*u,b+1.4*u);x.moveTo(a+2*u,b-1.4*u);x.lineTo(a-2*u,b+1.4*u);x.stroke()},
    shelf(a,b){x.fillStyle='#7a4a2a';x.strokeStyle=INK;x.lineWidth=.5;x.fillRect(a-2*u,b-1.2*u,4*u,2.4*u);x.strokeRect(a-2*u,b-1.2*u,4*u,2.4*u);x.beginPath();x.moveTo(a-2*u,b);x.lineTo(a+2*u,b);x.stroke();const cols=[VERM,MPL.LAPIS,MPL.VERD,GOLD];for(let k=0;k<4;k++){x.fillStyle=cols[k];x.fillRect(a-1.7*u+k*.9*u,b-1*u,.7*u,.9*u);x.fillRect(a-1.5*u+k*.9*u,b+.15*u,.7*u,.9*u)}},
    lectern(a,b){x.fillStyle='#6a4020';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-1.6*u,b+1.6*u);x.lineTo(a-1.2*u,b-1.2*u);x.lineTo(a+1.2*u,b-1.2*u);x.lineTo(a+1.6*u,b+1.6*u);x.closePath();x.fill();x.stroke();x.fillStyle='#f4ecd2';x.fillRect(a-1*u,b-.9*u,2*u,1.3*u)},
    goblet(a,b){x.fillStyle=GOLD;x.strokeStyle=INK;x.lineWidth=.45;x.beginPath();x.moveTo(a-1.3*u,b-1.5*u);x.lineTo(a+1.3*u,b-1.5*u);x.lineTo(a+.5*u,b+.3*u);x.lineTo(a-.5*u,b+.3*u);x.closePath();x.fill();x.stroke();x.fillRect(a-.25*u,b+.3*u,.5*u,1.1*u);x.fillRect(a-1*u,b+1.4*u,2*u,.5*u)},
    apple(a,b){x.fillStyle='#b8321e';x.strokeStyle=INK;x.lineWidth=.45;x.beginPath();x.arc(a,b,1.3*u,0,6.3);x.fill();x.stroke();x.strokeStyle='#3a5a2a';x.beginPath();x.moveTo(a,b-1.2*u);x.lineTo(a+.4*u,b-2*u);x.stroke()},
    throne(a,b){x.fillStyle=GOLD;x.strokeStyle=INK;x.lineWidth=.55;x.beginPath();x.moveTo(a-2*u,b+2*u);x.lineTo(a-2*u,b-1*u);x.lineTo(a-1*u,b+.2*u);x.lineTo(a,b-2.4*u);x.lineTo(a+1*u,b+.2*u);x.lineTo(a+2*u,b-1*u);x.lineTo(a+2*u,b+2*u);x.closePath();x.fill();x.stroke();x.fillStyle=VERM;x.fillRect(a-1.1*u,b+.2*u,2.2*u,1.4*u)},
    armour(a,b){x.fillStyle='#9a9eaa';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-1.6*u,b-1.8*u);x.lineTo(a+1.6*u,b-1.8*u);x.lineTo(a+1.6*u,b+.4*u);x.quadraticCurveTo(a,b+2.6*u,a-1.6*u,b+.4*u);x.closePath();x.fill();x.stroke();x.strokeStyle=VERM;x.lineWidth=.7;x.beginPath();x.moveTo(a,b-1.6*u);x.lineTo(a,b+1.2*u);x.stroke()},
    chest(a,b){x.fillStyle='#8a5a2a';x.strokeStyle=INK;x.lineWidth=.55;x.fillRect(a-2*u,b-1.2*u,4*u,2.6*u);x.strokeRect(a-2*u,b-1.2*u,4*u,2.6*u);x.fillStyle=GOLD;x.fillRect(a-2*u,b-.4*u,4*u,.7*u);x.fillRect(a-.4*u,b-.5*u,.8*u,1.1*u)},
    note(a,b){x.fillStyle='#f4ecd2';x.strokeStyle=INK;x.lineWidth=.4;x.fillRect(a-1*u,b-1.2*u,2*u,2.4*u);x.strokeRect(a-1*u,b-1.2*u,2*u,2.4*u);x.beginPath();x.moveTo(a-.6*u,b-.5*u);x.lineTo(a+.6*u,b-.5*u);x.moveTo(a-.6*u,b+.2*u);x.lineTo(a+.6*u,b+.2*u);x.stroke()},
    desk(a,b){x.fillStyle='#7a4a2a';x.strokeStyle=INK;x.lineWidth=.5;x.fillRect(a-2*u,b-1*u,4*u,2*u);x.strokeRect(a-2*u,b-1*u,4*u,2*u)},
    coffin(a,b){x.fillStyle='#8a8690';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-1.2*u,b-2.6*u);x.lineTo(a+1.2*u,b-2.6*u);x.lineTo(a+1.8*u,b-.8*u);x.lineTo(a+1*u,b+2.6*u);x.lineTo(a-1*u,b+2.6*u);x.lineTo(a-1.8*u,b-.8*u);x.closePath();x.fill();x.stroke()},
    // wall pictures: drawn on the wall just beside the floor
    pt(a,b){x.fillStyle=GOLD;x.strokeStyle=INK;x.lineWidth=.5;x.fillRect(a-1.5*u,b-2*u,3*u,4*u);x.strokeRect(a-1.5*u,b-2*u,3*u,4*u);x.fillStyle='#4a3a5a';x.fillRect(a-1*u,b-1.5*u,2*u,3*u);x.fillStyle='#e8c8a0';x.beginPath();x.arc(a,b-.5*u,.7*u,0,6.3);x.fill();x.fillStyle=VERM;x.fillRect(a-.8*u,b+.3*u,1.6*u,.9*u)},
    window(a,b){x.fillStyle=MPL.LAPIS;x.strokeStyle=GOLD;x.lineWidth=.9;x.beginPath();x.moveTo(a-1.4*u,b+2*u);x.lineTo(a-1.4*u,b-.8*u);x.quadraticCurveTo(a,b-3.2*u,a+1.4*u,b-.8*u);x.lineTo(a+1.4*u,b+2*u);x.closePath();x.fill();x.stroke();x.strokeStyle='rgba(240,216,120,.8)';x.lineWidth=.4;x.beginPath();x.moveTo(a,b-1.6*u);x.lineTo(a,b+2*u);x.moveTo(a-1.4*u,b+.2*u);x.lineTo(a+1.4*u,b+.2*u);x.stroke()},
    alcove(a,b){x.fillStyle='#2a1a28';x.strokeStyle=INK;x.lineWidth=.55;x.beginPath();x.moveTo(a-1.3*u,b+1.8*u);x.lineTo(a-1.3*u,b-.4*u);x.quadraticCurveTo(a,b-2.6*u,a+1.3*u,b-.4*u);x.lineTo(a+1.3*u,b+1.8*u);x.closePath();x.fill();x.stroke();x.fillStyle=GOLD;x.fillRect(a-.45*u,b+.2*u,.9*u,1.1*u)},
    banner(a,b){x.fillStyle=VERM;x.strokeStyle=INK;x.lineWidth=.55;x.beginPath();x.moveTo(a-1.4*u,b-2.2*u);x.lineTo(a+1.4*u,b-2.2*u);x.lineTo(a+1.4*u,b+2*u);x.lineTo(a,b+1.1*u);x.lineTo(a-1.4*u,b+2*u);x.closePath();x.fill();x.stroke();x.fillStyle=GOLD;x.fillRect(a-1.4*u,b-2.2*u,2.8*u,.6*u);x.beginPath();x.arc(a,b-.2*u,.7*u,0,6.3);x.fill()},
    chains(a,b){x.strokeStyle='#3a3238';x.lineWidth=.55;for(const dx of [-.9,.9]){for(let k=0;k<4;k++){x.beginPath();x.ellipse(a+dx*u,b-1.6*u+k*1.05*u,.45*u,.62*u,0,0,6.3);x.stroke()}}x.fillStyle='#3a3238';x.fillRect(a-1.8*u,b-2*u,3.6*u,.5*u)},
    claw(a,b){x.strokeStyle='#3a1a2a';x.lineWidth=.55;x.lineCap='round';x.beginPath();for(let k=-1;k<=1;k++){x.moveTo(a+k*.9*u-.6*u,b-2*u);x.quadraticCurveTo(a+k*.9*u,b,a+k*.9*u+.5*u,b+2*u)}x.stroke()},
    mirror(a,b){x.fillStyle='#bcd8ea';x.strokeStyle=GOLD;x.lineWidth=.9;x.beginPath();x.ellipse(a,b,1.3*u,2*u,0,0,6.3);x.fill();x.stroke();x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=.4;x.beginPath();x.moveTo(a-.5*u,b-1*u);x.lineTo(a-.2*u,b+.3*u);x.stroke()},
    plaque(a,b,n){x.fillStyle='#9a98a0';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(a,b,2.2*u,0,6.3);x.fill();x.stroke();x.strokeStyle=GOLD;x.lineWidth=.5;x.beginPath();x.arc(a,b,1.7*u,0,6.3);x.stroke();x.fillStyle=PLUM;x.font='bold '+(3.2*u)+'px '+FTITLE;x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),a,b+.15*u)},
    stair(a,b,up){const w=s*1.05;x.fillStyle=up?'#e8c870':'#b88850';x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(a-w/2,b-w/2,w,w);x.strokeRect(a-w/2,b-w/2,w,w);x.beginPath();for(let k=1;k<5;k++){const yy=b-w/2+w*k/5;x.moveTo(a-w/2+(up?0:w*.06*k),yy);x.lineTo(a+w/2-(up?0:w*.06*k),yy)}x.stroke();x.fillStyle=up?'#7a2a18':INK;x.beginPath();if(up){x.moveTo(a,b-w*.34);x.lineTo(a+w*.26,b+w*.16);x.lineTo(a-w*.26,b+w*.16)}else{x.moveTo(a,b+w*.34);x.lineTo(a+w*.26,b-w*.16);x.lineTo(a-w*.26,b-w*.16)}x.closePath();x.fill()}};
  const wallK={hl_p_window:'window',hl_p_alcove:'alcove',hl_p_banner:'banner',hl_p_chains:'chains',hl_p_mirror:'mirror'};
  const floorK={hl_p_candle:'candle',hl_p_cage:'cage',hl_p_rack:'rack',hl_p_shelf:'shelf',hl_p_lectern:'lectern',hl_p_poison:'goblet',hl_p_apple:'apple',hl_p_throne:'throne',hl_p_armour:'armour',chest:'chest',hl_p_note:'note',hl_p_desk:'desk',hl_p_coffin:'coffin',hl_p_tomb:'coffin',hl_p_feast:'desk'};

  // wall pictures first (they sit on the wall edge), then furniture, then torches on top
  for(const d of decor){const k=d.k,wk=wallK[k]||(/^hl_pt\d/.test(k)?'pt':/^hl_claw\d/.test(k)?'claw':null);if(!wk)continue;
    let a=X(d.x+.5),b=Y(d.y+.5);if(fl(d.x,d.y)){const w=wallDir(d);a+=w[0]*s*.56;b+=w[1]*s*.56}ic[wk](a,b)}
  for(const d of decor){const fk=floorK[d.k];if(fk)ic[fk](X(d.x+.5),Y(d.y+.5))}
  const violet={};for(const l of (L.lights||[]))violet[l[0]+','+l[1]]=!l[2];
  for(const d of decor){if(d.k==='lamp')ic.lamp(X(d.x+.5),Y(d.y+.5)-.3*u,{violet:violet[d.x+','+d.y]})}
  // the numbered stone at the start, the stair down and the stair up
  {const pq=decor.find(d=>/^hl_plq\d/.test(d.k)),st=L._start;const p=pq?[pq.x,pq.y]:[st.x,st.y];ic.plaque(X(p[0]+.5),Y(p[1]+.5),FL)}
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const ch=rows[y][xx];if(ch==='0'||ch==='1')ic.stair(X(xx+.5),Y(y+.5),ch==='1')}

  /* ---- room names, lettered on the wall above each room (below it when a stair is in the way) ---- */
  const place=[];
  for(const n of (L.mapNames||[])){const t=n.t,sz=5.6;x.save();x.font='bold '+sz+'px '+FUI;const w=x.measureText(t).width;x.restore();
    let cx=X(n.x+.5),cy=Y(n.y+.5),clash=false;const c0=Math.floor((cx-w/2-F.ox)/s),c1=Math.floor((cx+w/2-F.ox)/s);for(let k=c0;k<=c1;k++)if(stairAt(k,n.y))clash=true;
    if(clash){const r=info.find(q=>n.x>=q.x0&&n.x<=q.x1&&Math.abs(q.y0-1-n.y)<2);if(r)cy=Y(r.y1+1.5)}
    api.text(x,t,cx,cy,sz,t==='The Strange Room'?'#4a2a6a':'#3a1830','center')}

  /* ---- title, subtitle, key (left margin) ---- */
  api.title(x,'The','',10,9);
  x.save();x.fillStyle=INK;x.font='11px '+FTITLE;x.textAlign='left';x.textBaseline='middle';x.fillText('Orange Spire,',12,45);x.fillText('Floor '+FL,12,58);x.restore();
  const names=[];for(const r of info){const n=r.n.replace(/^The /,'');if(n!=='Strange Room'&&!names.includes(n))names.push(n)}
  let yy=70;for(const l of api.wrap(x,names.join(', '),76,7)){api.text(x,l,12,yy,7,'#5a3a1c','left');yy+=8.4}
  const kt=yy+6,keys=[['stair',0,'Stair down'],['stair',1,'Stair up'],['door',0,'Doorway'],['lamp',0,'Torch'],['candle',0,'Candle'],['pt',0,'Portrait'],['window',0,'Window'],['banner',0,'Banner'],['chest',0,'Chest'],['rug',0,'Rug'],['plaque',0,'Floor stone']];
  const kh=14+keys.length*11.2;api.panel(x,6,kt,82,kh);api.text(x,'Key',47,kt+8,7,PLUM,'center');
  keys.forEach(([k,v,t],i)=>{const a=19,b=kt+19+i*11.2;
    if(k==='stair')ic.stair(a,b,v);else if(k==='door'){x.save();x.strokeStyle=INK;x.lineWidth=3.2;x.beginPath();x.moveTo(a-5,b);x.lineTo(a+5,b);x.stroke();x.strokeStyle=GOLD;x.lineWidth=2;x.beginPath();x.moveTo(a-5,b);x.lineTo(a+5,b);x.stroke();x.restore()}
    else if(k==='rug'){x.fillStyle=VERM;x.fillRect(a-5,b-3,10,6);x.strokeStyle=GOLD;x.lineWidth=.8;x.strokeRect(a-4,b-2,8,4)}
    else if(k==='plaque')ic.plaque(a,b,FL);else if(k==='lamp')ic.lamp(a,b,{violet:false});else ic[k](a,b);
    api.text(x,t,32,b,6.2,'#3a2a1c','left')});

  /* ---- right margin: the tower gauge, notes, compass ---- */
  {const cx=434,base=112,bh=3;x.save();
    for(let n=1;n<=20;n++){const w=40-(n-1)*1.55,y0=base-n*bh,cur=n===FL;x.fillStyle=cur?GOLD2:(n%2?'#c47a3a':'#b2682e');x.strokeStyle=INK;x.lineWidth=cur?.9:.45;x.fillRect(cx-w/2,y0,w,bh);x.strokeRect(cx-w/2,y0,w,bh);
      if(cur){x.fillStyle='rgba(176,50,30,.6)';x.fillRect(cx-w/2+1,y0+.8,w-2,bh-1.6)}}
    const tw=40-19*1.55,top=base-20*bh;x.fillStyle='#6a3a6a';x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.moveTo(cx-tw/2-1,top);x.lineTo(cx,top-13);x.lineTo(cx+tw/2+1,top);x.closePath();x.fill();x.stroke();
    x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.moveTo(cx,top-13);x.lineTo(cx,top-19);x.stroke();x.fillStyle=VERM;x.beginPath();x.moveTo(cx,top-19);x.lineTo(cx+7,top-17);x.lineTo(cx,top-15);x.fill();
    x.restore();api.text(x,'Floor '+FL+' of 20',cx,base+8,6.2,'#3a1830','center')}
  api.notes(x,hlMapNotes(L,['Torches burn red and violet. Gold bars mark doorways.','Rooms fill in on this map as you walk through them.']),396,130,72,6.2,3);
  api.compass(x,434,272,10);
}
mplInstall({name:'os442',levels:[442],reveal:true,draw:mpOs442Draw});
