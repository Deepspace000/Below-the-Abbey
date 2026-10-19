/* Area map for Anaea (level 33, the white town in the green valley): drawn from the real level data (trees, roads, houses, wall, gardens).
   Bright Mediterranean illumination: whitewash, lapis and terracotta roofs, lavender, gold leaf. See maps_common.js. */
const MPANAEA_NAMES=[ // the town has no mapNames of its own, so the places are named here, in level cells
  {t:'Town Hall',x:24.5,y:11.8,k:'p'},{t:'Golden Crust',x:16.6,y:15.4,k:'s'},{t:'Temple',x:35.2,y:15.4,k:'p'},
  {t:'The Gilded Hen',x:14.8,y:24.5,k:'p'},{t:"Fenwick's Goods",x:21.5,y:25.7,k:'s'},{t:'The Springs',x:26.6,y:24.5,k:'s'}];
function mpAnaeaWob(x,pts,seed,amt){x.beginPath();pts.forEach((p,i)=>{const a=p[0]+(hash2(i,1,seed)-.5)*amt,b=p[1]+(hash2(i,2,seed)-.5)*amt;i?x.lineTo(a,b):x.moveTo(a,b)});x.closePath()}
function mpAnaeaRect(x,a,b,w,h,seed,amt){mpAnaeaWob(x,[[a,b],[a+w/2,b],[a+w,b],[a+w,b+h/2],[a+w,b+h],[a+w/2,b+h],[a,b+h],[a,b+h/2]],seed,amt==null?.5:amt)}
/* one house or hall seen from above: whitewashed walls, a tiled roof with a ridge, trim and a door */
function mpAnaeaHouse(x,r,F,roof,seed,opt){
  opt=opt||{};const X0=F.X(r.x0),Y0=F.Y(r.y0),W=(r.x1-r.x0+1)*F.s,H=(r.y1-r.y0+1)*F.s;
  x.save();x.fillStyle='rgba(90,60,30,.28)';mpAnaeaRect(x,X0+1.6,Y0+1.8,W,H,seed,.4);x.fill();
  x.fillStyle='#f6f0e0';x.strokeStyle=MPL.INK;x.lineWidth=.8;mpAnaeaRect(x,X0,Y0,W,H,seed+1);x.fill();x.stroke();
  x.fillStyle='rgba(120,100,70,.18)';x.fillRect(X0+W*.82,Y0+1,W*.16,H-2);
  const m=Math.max(1.1,F.s*.22),rx=X0+m,ry=Y0+m,rw=W-2*m,rh=H-2*m,horiz=rw>=rh,hi=roof[0],lo=roof[1];
  if(opt.dome){const cx=X0+W/2,cy=Y0+H/2,R=Math.min(W,H)*.4;const g=x.createRadialGradient(cx-R*.3,cy-R*.3,1,cx,cy,R);g.addColorStop(0,'#fff0a0');g.addColorStop(.6,MPL.GOLD);g.addColorStop(1,'#8a6a14');x.fillStyle=g;x.beginPath();x.arc(cx,cy,R,0,6.3);x.fill();x.stroke();
    x.strokeStyle='rgba(90,60,10,.6)';x.lineWidth=.5;for(let k=0;k<8;k++){x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(k*.785)*R,cy+Math.sin(k*.785)*R);x.stroke()}
    x.strokeStyle=MPL.INK;x.lineWidth=.8;x.strokeRect(X0+1.6,Y0+1.6,W-3.2,H-3.2);x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(cx,cy,1.4,0,6.3);x.fill();x.stroke()}
  else{
    x.fillStyle=hi;x.strokeStyle=MPL.INK;x.lineWidth=.7;
    if(horiz){mpAnaeaRect(x,rx,ry,rw,rh/2,seed+2,.3);x.fill();x.stroke();x.fillStyle=lo;mpAnaeaRect(x,rx,ry+rh/2,rw,rh/2,seed+3,.3);x.fill();x.stroke()}
    else{mpAnaeaRect(x,rx,ry,rw/2,rh,seed+2,.3);x.fill();x.stroke();x.fillStyle=lo;mpAnaeaRect(x,rx+rw/2,ry,rw/2,rh,seed+3,.3);x.fill();x.stroke()}
    x.strokeStyle='rgba(30,20,10,.32)';x.lineWidth=.4;
    if(horiz){for(let yy=ry+1.7;yy<ry+rh-.5;yy+=1.7){if(Math.abs(yy-(ry+rh/2))<.9)continue;x.beginPath();x.moveTo(rx+.5,yy);x.lineTo(rx+rw-.5,yy);x.stroke()}x.strokeStyle='#fbf2d0';x.lineWidth=1;x.beginPath();x.moveTo(rx,ry+rh/2);x.lineTo(rx+rw,ry+rh/2);x.stroke()}
    else{for(let xx=rx+1.7;xx<rx+rw-.5;xx+=1.7){if(Math.abs(xx-(rx+rw/2))<.9)continue;x.beginPath();x.moveTo(xx,ry+.5);x.lineTo(xx,ry+rh-.5);x.stroke()}x.strokeStyle='#fbf2d0';x.lineWidth=1;x.beginPath();x.moveTo(rx+rw/2,ry);x.lineTo(rx+rw/2,ry+rh);x.stroke()}
    x.strokeStyle=MPL.GOLD;x.lineWidth=.7;x.strokeRect(X0+.6,Y0+.6,W-1.2,H-1.2)}
  if(opt.door){const dx=F.X(opt.door.x+.5),dy=opt.door.south?Y0+H:Y0;x.fillStyle='#4a2c14';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.rect(dx-1.5,opt.door.south?dy-3:dy-1,3,4);x.fill();x.stroke()}
  x.restore()}
/* an awning stall: striped canopy with a little pile of goods */
function mpAnaeaStall(x,a,b,col){x.save();x.fillStyle='rgba(90,60,30,.25)';x.fillRect(a-5.4,b-2.4,11,7);for(let k=0;k<5;k++){x.fillStyle=k%2?'#f6f0e0':col;x.fillRect(a-5+k*2,b-3.4,2,6)}x.strokeStyle=MPL.INK;x.lineWidth=.6;x.strokeRect(a-5,b-3.4,10,6);x.fillStyle='#d9a23a';x.beginPath();x.arc(a-2,b+3.8,1,0,6.3);x.arc(a,b+3.9,1,0,6.3);x.arc(a+2,b+3.8,1,0,6.3);x.fill();x.restore()}
function mpAnaeaBird(x,a,b,s){x.save();x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.moveTo(a-3*s,b-1*s);x.quadraticCurveTo(a-1.5*s,b-3*s,a,b);x.quadraticCurveTo(a+1.5*s,b-3*s,a+3*s,b-1*s);x.stroke();x.restore()}
function mpAnaeaGate(x,F,cx,cy,dir){const a=F.X(cx),b=F.Y(cy);x.save();for(const k of [-1,1]){const tx=a,ty=b+k*F.s*1.5;x.fillStyle='#f6f0e0';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(tx-2.8,ty-2.8,5.6,5.6);x.strokeRect(tx-2.8,ty-2.8,5.6,5.6);x.fillStyle=MPL.LAPIS;x.beginPath();x.moveTo(tx-3.4,ty-2.6);x.lineTo(tx,ty-6.2);x.lineTo(tx+3.4,ty-2.6);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(tx,ty-6.4,.8,0,6.3);x.fill()}
  x.strokeStyle=MPL.GOLD;x.lineWidth=1.2;x.beginPath();x.arc(a,b,F.s*1.5,-1.9,1.9,false);x.stroke();x.restore()}
mplInstall({name:'anaea',levels:[33],tint:[6,8,-4],
  fit:L=>mplFit(L.rows[0].length,L.rows.length),
  foot:'You are the yellow arrow. Gold lamps stand along the streets of Anaea.',
  draw(c,x,L,api){
    const W=L.rows[0].length,H=L.rows.length,F=mplFit(W,H),A=MPL.AREA,s=F.s,X=F.X,Y=F.Y,I=api.I,ink=MPL.INK;
    /* ground: a bright meadow wash inside the frame */
    x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
    const gg=x.createLinearGradient(0,A.y,0,A.y+A.h);gg.addColorStop(0,'#cfdca0');gg.addColorStop(1,'#bcd08e');x.fillStyle=gg;x.fillRect(A.x,A.y,A.w,A.h);
    x.globalAlpha=.3;for(let i=0;i<260;i++){x.fillStyle=i%3?'#eef0b8':'#8fb070';x.beginPath();x.ellipse(A.x+hash2(i,1,31)*A.w,A.y+hash2(i,2,31)*A.h,3+hash2(i,3,31)*14,1.5+hash2(i,4,31)*6,hash2(i,5,31)*3,0,6.3);x.fill()}x.globalAlpha=1;
    x.strokeStyle='rgba(60,100,50,.35)';x.lineWidth=.4;for(let i=0;i<900;i++){const a=A.x+hash2(i,1,32)*A.w,b=A.y+hash2(i,2,32)*A.h;x.beginPath();x.moveTo(a,b);x.lineTo(a+1,b-1.8);x.stroke()}
    /* classify the cells from the real level */
    const g=[];for(let y=0;y<H;y++){g.push(new Array(W).fill(0))}
    for(const d of L.decor){const cx=Math.floor(d.x),cy=Math.floor(d.y);if(cx<0||cy<0||cx>=W||cy>=H)continue;const k=d.k;let v=0;if(/^ltree/.test(k))v=1;else if(k==='lavender')v=2;else if(/^lbush|^lflora/.test(k))v=3;else if(/boulder|rocks|mossstone/.test(k))v=4;if(v&&(g[cy][cx]===0||v===1||(v<g[cy][cx]&&g[cy][cx]!==1)))g[cy][cx]=v}
    /* forest floor in dark green, soft edge */
    x.fillStyle='rgba(70,120,70,.55)';for(let y=0;y<H;y++)for(let c2=0;c2<W;c2++)if(g[y][c2]===1){x.beginPath();x.ellipse(X(c2+.5),Y(y+.5),s*.95,s*.85,hash2(c2,y,5)*3,0,6.3);x.fill()}
    /* roads and paving from fmap: dirt for 2, pale stone for the squares */
    const road=(c2,y,col,edge)=>{const a=X(c2),b=Y(y);x.fillStyle=col;mpAnaeaRect(x,a-.3,b-.3,s+.6,s+.6,c2*7+y,.8);x.fill()};
    for(let y=0;y<H;y++)for(let c2=0;c2<W;c2++){const f=L.fmap[y][c2];if(f==='2')road(c2,y,'#e2c488');else if(f!=='1')road(c2,y,'#ede4cc')}
    x.strokeStyle='rgba(120,80,40,.5)';x.lineWidth=.5;for(let y=0;y<H;y++)for(let c2=0;c2<W;c2++){const f=L.fmap[y][c2];if(f!=='2')continue;for(const [dx,dy] of [[1,0],[0,1]]){const n=(L.fmap[y+dy]||'')[c2+dx];if(n!=='2'&&n!==undefined){x.beginPath();if(dx){x.moveTo(X(c2+1),Y(y));x.lineTo(X(c2+1),Y(y+1))}else{x.moveTo(X(c2),Y(y+1));x.lineTo(X(c2+1),Y(y+1))}x.stroke()}}
      for(const [dx,dy] of [[-1,0],[0,-1]]){const n=(L.fmap[y+dy]||'')[c2+dx];if(n!=='2'&&n!==undefined){x.beginPath();if(dx){x.moveTo(X(c2),Y(y));x.lineTo(X(c2),Y(y+1))}else{x.moveTo(X(c2),Y(y));x.lineTo(X(c2+1),Y(y))}x.stroke()}}}
    x.fillStyle='rgba(120,80,40,.4)';for(let i=0;i<500;i++){const c2=Math.floor(hash2(i,1,41)*W),y=Math.floor(hash2(i,2,41)*H);if(L.fmap[y][c2]==='2'){x.fillRect(X(c2+hash2(i,3,41)),Y(y+hash2(i,4,41)),.9,.9)}}
    /* paving joints in the squares */
    x.strokeStyle='rgba(140,120,90,.4)';x.lineWidth=.35;for(let y=0;y<H;y++)for(let c2=0;c2<W;c2++){const f=L.fmap[y][c2];if(f!=='2'&&f!=='1'){x.strokeRect(X(c2)+.3,Y(y)+.3,s-.6,s-.6)}}
    /* meadow flowers, lavender, rocks */
    for(let y=0;y<H;y++)for(let c2=0;c2<W;c2++){const v=g[y][c2],a=X(c2),b=Y(y);
      if(v===2){x.strokeStyle='#7a4aa8';x.lineWidth=.9;for(let k=0;k<4;k++){const px=a+1+k*1.3+hash2(c2,y,k)*.6;x.beginPath();x.moveTo(px,b+s-.8);x.lineTo(px,b+1.2+hash2(c2,y,k+9)*1.2);x.stroke()}x.strokeStyle='#4f7a3a';x.lineWidth=.5;x.beginPath();x.moveTo(a+.8,b+s-.5);x.lineTo(a+s-.8,b+s-.5);x.stroke()}
      else if(v===3){const cols=['#e8607a','#f4c940','#ffffff','#c070d8','#f08a3a'];for(let k=0;k<2;k++){x.fillStyle=cols[Math.floor(hash2(c2,y,k+3)*5)];x.beginPath();x.arc(a+1+hash2(c2,y,k+20)*(s-2),b+1.2+hash2(c2,y,k+30)*(s-2),.9,0,6.3);x.fill()}}
      else if(v===4){x.fillStyle='#b7ae9a';x.strokeStyle=ink;x.lineWidth=.5;x.beginPath();x.ellipse(a+s/2,b+s*.62,s*.34,s*.24,0,0,6.3);x.fill();x.stroke()}}
    /* the town compound: pale cobbles inside the white wall, then the buildings */
    const wx0=11,wx1=39,wy0=9,wy1=28;
    x.fillStyle='rgba(246,238,214,.55)';x.fillRect(X(wx0+.5),Y(wy0+.5),(wx1-wx0-1)*s,(wy1-wy0-1)*s);
    x.fillStyle='rgba(120,90,50,.18)';for(let i=0;i<260;i++){x.fillRect(X(wx0+1+hash2(i,1,51)*(wx1-wx0-2)),Y(wy0+1+hash2(i,2,51)*(wy1-wy0-2)),1,1)}
    /* gardens and vegetable plots */
    for(const d of L.decor){if(d.k==='veg'){const a=X(Math.floor(d.x)),b=Y(Math.floor(d.y));x.fillStyle='#8a6a3c';x.fillRect(a+.4,b+.6,s-.8,s-1.2);x.strokeStyle='#4f8a3c';x.lineWidth=1;for(let k=0;k<3;k++){x.beginPath();x.moveTo(a+1,b+1.6+k*1.5);x.lineTo(a+s-1,b+1.6+k*1.5);x.stroke()}}}
    /* buildings, found by flood fill over the wall characters in the town */
    const seen=new Set(),blds=[];
    for(let y=9;y<=24;y++)for(let c2=11;c2<=38;c2++){const ch=L.rows[y][c2];if(ch==='.'||seen.has(c2+','+y))continue;const q=[[c2,y]],cells=[];seen.add(c2+','+y);let x0=c2,x1=c2,y0=y,y1=y,doors=[];
      while(q.length){const [a,b]=q.pop();cells.push([a,b]);x0=Math.min(x0,a);x1=Math.max(x1,a);y0=Math.min(y0,b);y1=Math.max(y1,b);const cc=L.rows[b][a];if(/[2-7!?,]/.test(cc))doors.push({x:a,y:b,c:cc});
        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=a+dx,ny=b+dy;if(nx<11||nx>38||ny<9||ny>24)continue;if(L.rows[ny][nx]==='.'||seen.has(nx+','+ny))continue;seen.add(nx+','+ny);q.push([nx,ny])}}
      blds.push({x0,x1,y0,y1,doors})}
    const BL='#2f6fb5',BL2='#1f4f8a',TC='#d0683a',TC2='#a84a26',GR='#3a9a84',GR2='#2a7a66',GD='#e8c04a',GD2='#b8921e';
    for(const r of blds){const dc=r.doors.map(d=>d.c).join('');let roof=hash2(r.x0,r.y0,3)<.5?[BL,BL2]:[TC,TC2];const o={};
      if(/2/.test(dc)){roof=[BL,BL2]}else if(/3/.test(dc)){roof=[TC,TC2]}else if(/4/.test(dc)){roof=[GD,GD2]}else if(/5/.test(dc)){roof=[BL,BL2]}else if(/7/.test(dc)){roof=[GR,GR2]}else if(/6/.test(dc)){o.dome=1;roof=[GD,GD2]}
      const dr=r.doors[0];if(dr)o.door={x:dr.x,south:dr.y===r.y1};mpAnaeaHouse(x,r,F,roof,r.x0*13+r.y0*7,o)}
    /* the temple: a gold sun and an upright standard on the Town Hall */
    for(const r of blds){if(/6/.test(r.doors.map(d=>d.c).join(''))){const cx=X(r.x0+(r.x1-r.x0+1)/2),cy=Y(r.y0+(r.y1-r.y0+1)/2);x.strokeStyle='rgba(120,60,10,.85)';x.lineWidth=.6;for(let k=0;k<12;k++){x.beginPath();x.moveTo(cx+Math.cos(k*.5236)*3.6,cy+Math.sin(k*.5236)*3.6);x.lineTo(cx+Math.cos(k*.5236)*5.6,cy+Math.sin(k*.5236)*5.6);x.stroke()}}
      if(/2/.test(r.doors.map(d=>d.c).join(''))){const a=X(r.x0+(r.x1-r.x0+1)/2),b=Y(r.y0)+3;x.fillStyle=MPL.VERM;x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.moveTo(a,b+3);x.lineTo(a,b-5);x.lineTo(a+5,b-3.4);x.lineTo(a,b-1.8);x.fill();x.stroke()}}
    /* the white wall with a gold coping, merlons and gates */
    const wall=(a,b,c2,d)=>{x.save();x.lineCap='round';x.strokeStyle=ink;x.lineWidth=3.6;x.beginPath();x.moveTo(a,b);x.lineTo(c2,d);x.stroke();x.strokeStyle='#f8f2e2';x.lineWidth=2.4;x.stroke();x.strokeStyle=MPL.GOLD;x.lineWidth=.6;x.setLineDash([1.4,1.8]);x.stroke();x.restore()};
    const wl=X(wx0+.5),wr=X(wx1-.5+.0),wt=Y(wy0+.5),wb=Y(wy1-.5+.0),gy=Y(18.5),gap=s*1.25;
    wall(wl,wt,wr,wt);wall(wl,wb,wr,wb);wall(wl,wt,wl,gy-gap);wall(wl,gy+gap,wl,wb);wall(wr,wt,wr,gy-gap);wall(wr,gy+gap,wr,wb);
    mpAnaeaGate(x,F,wx0+.5,18.5,'w');mpAnaeaGate(x,F,wx1-.5,18.5,'e');
    /* market stalls on the square between the town hall and the south houses */
    mpAnaeaStall(x,X(19.5),Y(16.9),MPL.VERM);mpAnaeaStall(x,X(23),Y(17.3),BL);mpAnaeaStall(x,X(29),Y(17.4),GD);mpAnaeaStall(x,X(34.6),Y(16.9),TC);
    /* lamps, flowerpots and doorstep flowers */
    for(const d of L.decor){if(d.k==='lamp'){const a=X(d.x),b=Y(d.y);x.fillStyle='rgba(255,220,110,.35)';x.beginPath();x.arc(a,b,3.2,0,6.3);x.fill();x.fillStyle=MPL.GOLD2;x.strokeStyle=ink;x.lineWidth=.5;x.beginPath();x.arc(a,b,1.1,0,6.3);x.fill();x.stroke()}
      else if(d.k==='flowerpot'){const a=X(d.x),b=Y(d.y);x.fillStyle='#c8502a';x.beginPath();x.arc(a,b,1.2,0,6.3);x.fill();x.fillStyle='#f06a8a';x.beginPath();x.arc(a,b-.6,.8,0,6.3);x.fill()}}
    /* trees, drawn last and sorted so the ones lower on the sheet overlap the upper ones */
    const trees=[];for(const d of L.decor){if(/^ltree/.test(d.k)||d.k==='bush')trees.push(d)}
    trees.sort((p,q)=>p.y-q.y);
    for(const d of trees){const a=X(d.x),b=Y(d.y),h=hash2(Math.floor(d.x*3),Math.floor(d.y*3),9),sz=.5+h*.2;if(d.k==='bush'){x.fillStyle='#5a9a4a';x.strokeStyle=ink;x.lineWidth=.4;x.beginPath();x.arc(a,b,1.6,0,6.3);x.fill();x.stroke();continue}
      const palette=['#4f9a58','#3f8a50','#6aa856','#2f7a4a','#7fb45a'];const col=palette[Math.floor(hash2(Math.floor(d.x*2),Math.floor(d.y*2),4)*5)];
      if(h>.78)I.pine(x,a,b+1.5,sz*.8);else I.tree(x,a,b+1.2,sz,col)}
    /* a few olive and cypress marks on the open meadow beside the wall */
    for(const [tx,ty] of [[8.5,12],[8.5,24],[41.5,12],[41.5,24],[7.8,18.3],[42.2,18.3]]){I.tree(x,X(tx),Y(ty),.7,'#8aa860')}
    /* names, written over the drawing */
    for(const n of MPANAEA_NAMES)api.text(x,n.t,X(n.x),Y(n.y),n.k==='p'?7.6:6.4,n.k==='p'?'#1c3a7a':'#5a2a14');
    api.text(x,'Market Square',X(24.4),Y(15.6),6.6,'#8a2a14');api.text(x,'Main Street',X(18),Y(18.5),6.2,'#5a3a1c');
    api.text(x,'To Greendale',X(4.2),Y(15.4),6.2,'#274a9a');api.text(x,'To the Sand Road',X(44.5),Y(15.4),6.2,'#274a9a');api.text(x,'The Lavender Meadow',X(24),Y(30),6.8,'#6a3a98');api.text(x,'The Green Valley',X(24),Y(6),7.4,'#2f6a3a');
    /* corner finds: three little glades with bones and chests */
    for(const [a,b] of [[4.5,4],[4.5,32.5],[45.5,32.5]]){I.skull(x,X(a+.5),Y(b),.7);x.fillStyle=MPL.VERM;x.strokeStyle=ink;x.lineWidth=.5;x.fillRect(X(a)-2,Y(b)+1.6,4,2.6);x.strokeRect(X(a)-2,Y(b)+1.6,4,2.6)}
    /* birds over the valley */
    for(const [a,b,k] of [[X(10),Y(3),1],[X(14),Y(4.4),.8],[X(36),Y(3.2),1],[X(41),Y(5),.8],[X(32),Y(33),.9]])mpAnaeaBird(x,a,b,k);
    x.restore();
    /* the inked frame around the drawing */
    x.strokeStyle=ink;x.lineWidth=1;x.strokeRect(A.x,A.y,A.w,A.h);x.strokeStyle=MPL.GOLD;x.lineWidth=1.6;x.strokeRect(A.x+1.5,A.y+1.5,A.w-3,A.h-3);
    /* margins */
    api.title(x,'Anaea','A white town in a green valley');
    api.compass(x,438,68,15);
    api.panel(x,6,64,82,100);api.text(x,'About Anaea',47,73,7.4,MPL.LAPIS);
    api.notes(x,['Anaea is a small white town inside a low wall, with a west gate and an east gate.','Mayor Marigold keeps the Town Hall.','Odalys runs the Gilded Hen inn.','The Temple of the Sun stands in the north east.'],11,84,70,6.1,3);
    api.panel(x,394,98,82,104);api.text(x,'Good to know',435,107,7.4,MPL.LAPIS);
    api.notes(x,['Juno bakes bread at the Golden Crust.','Fenwick sells goods and supplies.','The west gate leads back to Greendale.','The east gate leads out to the Sand Road and Khemetra.'],399,118,70,6.1,3);
    /* key */
    api.panel(x,6,198,82,90);api.text(x,'Key',47,207,7.4,MPL.LAPIS);
    const ky=[['House (blue)',()=>I.house(x,17,222,.8,BL)],['House (clay)',()=>I.house(x,17,234,.8,TC)],['Temple',()=>{x.fillStyle=MPL.GOLD;x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.arc(17,245,4,0,6.3);x.fill();x.stroke()}],['Road',()=>{x.fillStyle='#e2c488';x.fillRect(12,254,10,5);x.strokeStyle=ink;x.lineWidth=.5;x.strokeRect(12,254,10,5)}],['Lamp',()=>{x.fillStyle=MPL.GOLD2;x.strokeStyle=ink;x.lineWidth=.5;x.beginPath();x.arc(17,266,1.8,0,6.3);x.fill();x.stroke()}],['Lavender',()=>{x.strokeStyle='#7a4aa8';x.lineWidth=1;for(let k=0;k<4;k++){x.beginPath();x.moveTo(13+k*2.4,280);x.lineTo(13+k*2.4,274);x.stroke()}}]];
    ky.forEach((k,i)=>{k[1]();api.text(x,k[0],30,i<2?222+i*12:i===2?245:i===3?257:i===4?266:277,6.3,'#3a2a1c','left')});
    /* the right margin lower: small tree and wall legend */
    api.panel(x,394,208,82,38);I.tree(x,408,232,.9);api.text(x,'Forest',420,228,6.3,'#3a2a1c','left');x.strokeStyle=ink;x.lineWidth=3;x.beginPath();x.moveTo(401,238);x.lineTo(415,238);x.stroke();x.strokeStyle='#f8f2e2';x.lineWidth=1.8;x.stroke();api.text(x,'Town wall',420,238,6.3,'#3a2a1c','left');
    /* a gold sun flourish in the right margin */
    x.save();x.translate(435,270);x.strokeStyle=MPL.GOLD;x.lineWidth=1;for(let k=0;k<16;k++){x.beginPath();x.moveTo(Math.cos(k*.3927)*9,Math.sin(k*.3927)*9);x.lineTo(Math.cos(k*.3927)*(k%2?13:16),Math.sin(k*.3927)*(k%2?13:16));x.stroke()}x.fillStyle=MPL.GOLD2;x.strokeStyle=ink;x.beginPath();x.arc(0,0,7,0,6.3);x.fill();x.stroke();x.restore();
  }});
