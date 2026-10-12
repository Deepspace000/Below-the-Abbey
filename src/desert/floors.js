/* ==========================================================================
   THE SAND ROAD: floors, ceilings and wall pictures for the desert, the red dunes and the tomb of Sut
   ========================================================================== */
function dsFloor(fn){const d=new Uint8ClampedArray(TS*TS*4);for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){const c=fn(x,y),i=(y*TS+x)*4;d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255}return d}
function dsNoise(x,y,per,seed){ // value noise that tiles across the texture
  const fx=x/TS*per,fy=y/TS*per,x0=Math.floor(fx),y0=Math.floor(fy),tx=fx-x0,ty=fy-y0,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);
  const h=(i,j)=>hash2(((i%per)+per)%per,((j%per)+per)%per,seed);
  return (h(x0,y0)*(1-sx)+h(x0+1,y0)*sx)*(1-sy)+(h(x0,y0+1)*(1-sx)+h(x0+1,y0+1)*sx)*sy;
}
function dsSand(base,dark,seed,ripple){
  return dsFloor((x,y)=>{
    const n=dsNoise(x,y,4,seed)*.55+dsNoise(x,y,8,seed+1)*.3+dsNoise(x,y,16,seed+2)*.15;
    const r=Math.sin(TAU*(3*x/TS+y/TS+n*.7))*.5+.5,r2=Math.sin(TAU*(2*x/TS-2*y/TS+n*1.1))*.5+.5;
    let k=.9+.07*r*ripple+.04*r2*ripple+.22*(n-.5);
    const sp=hash2(x,y,seed+9);if(sp>.985)k*=.78;else if(sp>.972)k*=1.1;
    const dk=n*.5+r*.25;
    return [base[0]*k+(dark[0]-base[0])*dk*.15,base[1]*k+(dark[1]-base[1])*dk*.15,base[2]*k+(dark[2]-base[2])*dk*.15];
  });
}
function dsSlabs(base,mort,seed,n,fnExtra){
  const sz=TS/n;
  return dsFloor((x,y)=>{
    const cx=Math.floor(x/sz),cy=Math.floor(y/sz),lx=x-cx*sz,ly=y-cy*sz;
    const v=hash2(cx,cy,seed)*.2-.1+dsNoise(x,y,8,seed+3)*.14-.07;
    let c=[base[0]*(1+v),base[1]*(1+v),base[2]*(1+v)];
    const e=Math.min(lx,ly,sz-1-lx,sz-1-ly);
    if(e<2)c=[mort[0],mort[1],mort[2]];else if(e<4)c=[c[0]*.88,c[1]*.88,c[2]*.88];
    const sp=hash2(x,y,seed+11);if(sp>.99)c=[c[0]*.7,c[1]*.7,c[2]*.7];
    if(fnExtra){const o=fnExtra(x,y,lx,ly,sz,cx,cy);if(o)c=o}
    return c;
  });
}
function makeDesertFloors(){
  FLOORS.sand=dsSand([228,203,148],[180,150,100],101,1);
  FLOORS.dune=dsSand([234,196,128],[176,134,84],111,1.5);
  FLOORS.redsand=dsSand([198,104,66],[140,60,38],121,1.3);
  FLOORS.redsand2=dsSand([176,86,54],[120,50,32],131,1);
  FLOORS.dgrass=dsFloor((x,y)=>{ // dry grass going to sand
    const n=dsNoise(x,y,4,141)*.6+dsNoise(x,y,8,142)*.4,m=dsNoise(x,y,6,143);
    const sand=[212,190,138],gr=[146,150,72],k=.88+.2*(n-.5)+(hash2(x,y,144)>.97?-.12:0);
    const t=clamp((m-.35)*3,0,1);return [(sand[0]*(1-t)+gr[0]*t)*k,(sand[1]*(1-t)+gr[1]*t)*k,(sand[2]*(1-t)+gr[2]*t)*k];
  });
  FLOORS.scrub=dsFloor((x,y)=>{ // sand with dry earth, pebbles and stubby tufts
    const n=dsNoise(x,y,4,151)*.55+dsNoise(x,y,8,152)*.45,m=dsNoise(x,y,5,153);
    let c=[218,194,142];const t=clamp((m-.5)*3,0,1);c=[c[0]*(1-t)+150*t,c[1]*(1-t)+118*t,c[2]*(1-t)+78*t];
    const k=.9+.2*(n-.5);c=[c[0]*k,c[1]*k,c[2]*k];
    const sp=hash2(x,y,154);if(sp>.99)c=[110,96,76];else if(sp>.982)c=[158,150,80];
    return c;
  });
  FLOORS.sandpath=dsFloor((x,y)=>{ // packed sand where many feet have passed
    const n=dsNoise(x,y,8,161)*.5+dsNoise(x,y,16,162)*.5,rut=Math.sin(TAU*(2*y/TS))*.5+.5;
    const k=.82+.16*n+.05*rut+(hash2(x,y,163)>.985?-.1:0);
    return [206*k,178*k,128*k];
  });
  FLOORS.redpath=dsFloor((x,y)=>{const n=dsNoise(x,y,8,171)*.5+dsNoise(x,y,16,172)*.5,k=.8+.18*n+(hash2(x,y,173)>.985?-.1:0);return [172*k,86*k,58*k]});
  // ---- the tomb ----
  FLOORS.tombslab=dsSlabs([196,170,120],[52,40,28],201,2);
  FLOORS.tombgold=dsSlabs([190,162,112],[52,40,28],211,1,(x,y,lx,ly,sz)=>{ // a gold diamond inlaid in every slab
    const dx=Math.abs(lx-sz/2),dy=Math.abs(ly-sz/2),d=dx+dy;
    if(d>44&&d<50)return [226,184,64];if(d>30&&d<34)return [170,40,40];if(dx<3&&dy<3)return [60,110,190];return null});
  FLOORS.tombsand=dsFloor((x,y)=>{ // slabs half buried under blown sand
    const n=dsNoise(x,y,4,221)*.6+dsNoise(x,y,8,222)*.4,sz=64,lx=x%sz,ly=y%sz,e=Math.min(lx,ly,sz-1-lx,sz-1-ly);
    const sandy=n>.46,r=Math.sin(TAU*(3*x/TS+y/TS+n*.7))*.5+.5;
    if(sandy){const k=.9+.08*r+.15*(n-.5);return [226*k,198*k,142*k]}
    const v=.9+.16*hash2(x>>6,y>>6,223);return e<2?[56,44,30]:[190*v,164*v,114*v];
  });
  FLOORS.tombdark=dsSlabs([62,60,70],[16,14,20],231,2,(x,y,lx,ly,sz)=>{ // dark basalt with a thin line of lapis
    const e=Math.min(lx,ly,sz-1-lx,sz-1-ly);if(e>=8&&e<10)return [52,92,168];return null});
  FLOORS.tomblapis=dsFloor((x,y)=>{ // a blue and gold mosaic
    const sz=32,cx=Math.floor(x/sz),cy=Math.floor(y/sz),lx=x%sz,ly=y%sz,e=Math.min(lx,ly,sz-1-lx,sz-1-ly),chk=(cx+cy)&1;
    const v=.9+.14*hash2(x>>2,y>>2,241);
    if(e<1.5)return [30,26,36];
    return chk?[40*v+10,88*v+16,172*v+10]:[214*v,172*v,58*v];
  });
  FLOORS.tombred=dsSlabs([178,104,70],[44,26,20],251,2,(x,y,lx,ly,sz)=>{ // terracotta with a Greek-key border
    const e=Math.min(lx,ly,sz-1-lx,sz-1-ly);if(e>=6&&e<9)return [226,196,90];
    if(e>=9&&e<12&&((lx>>2)+(ly>>2))%3===0)return [40,28,30];return null});
  // ---- the painted ceiling: night sky with gold stars and a band of gold ----
  {const [c,x]=tcv();const g=x.createLinearGradient(0,0,0,TS);g.addColorStop(0,'#0c1236');g.addColorStop(1,'#1c2a6a');x.fillStyle=g;x.fillRect(0,0,TS,TS);
    const r=abRng(777);for(let i=0;i<34;i++){const sx=r()*TS,sy=r()*TS,s=1.5+r()*2.4;x.fillStyle='#f0cc60';x.beginPath();for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,rr=k%2?s*.45:s;x.lineTo(sx+Math.cos(a)*rr,sy+Math.sin(a)*rr)}x.closePath();x.fill()}
    x.fillStyle='#d8a838';x.fillRect(0,0,TS,5);x.fillRect(0,TS-5,TS,5);x.fillStyle='#b22a2a';x.fillRect(0,5,TS,3);x.fillRect(0,TS-8,TS,3);
    CEILS.tomb=pix(c)}
}

/* ---------- wall pictures ---------- */
function dsStoneWall(x,r,base,mort,rows){
  x.fillStyle='rgb('+mort[0]+','+mort[1]+','+mort[2]+')';x.fillRect(0,0,TS,TS);
  const rh=TS/rows;
  for(let k=0;k<rows;k++){let xx=-((k%2)?30:0)-((r()*14)|0);
    while(xx<TS){const w=44+((r()*30)|0),sh=r()*24-12;
      x.fillStyle='rgb('+((base[0]+sh)|0)+','+((base[1]+sh)|0)+','+((base[2]+sh)|0)+')';x.fillRect(xx+1.5,k*rh+1.5,w-3,rh-3);
      x.fillStyle='rgba(255,246,220,.14)';x.fillRect(xx+1.5,k*rh+1.5,w-3,2.5);x.fillStyle='rgba(0,0,0,.14)';x.fillRect(xx+1.5,k*rh+rh-4.5,w-3,3);
      xx+=w}}
}
const DS_COL={gold:'#e0b038',goldD:'#9a7418',blue:'#2f5fb8',red:'#b02a2a',teal:'#2a9a8a',black:'#1a1612',ink:'#17120e'};
function dsGlyph(x,gx,gy,s,kind){ // little carved signs: eye, ankh, bird, wave, sun, scarab, reed
  x.save();x.translate(gx,gy);x.scale(s,s);x.lineWidth=1.6;x.lineJoin='round';
  const G1=DS_COL.gold,B1=DS_COL.blue,R1=DS_COL.red;
  if(kind===0){x.strokeStyle=B1;x.fillStyle=G1;x.beginPath();x.moveTo(-9,0);x.quadraticCurveTo(0,-8,9,0);x.quadraticCurveTo(0,7,-9,0);x.stroke();x.fillStyle=R1;x.beginPath();x.arc(0,-.5,3,0,TAU);x.fill();x.strokeStyle=G1;x.beginPath();x.moveTo(-2,7);x.lineTo(-6,13);x.moveTo(3,7);x.quadraticCurveTo(7,10,5,14);x.stroke()}
  else if(kind===1){x.strokeStyle=G1;x.lineWidth=2.2;x.beginPath();x.ellipse(0,-7,4.5,6,0,0,TAU);x.stroke();x.beginPath();x.moveTo(0,-1);x.lineTo(0,14);x.moveTo(-6,4);x.lineTo(6,4);x.stroke()}
  else if(kind===2){x.fillStyle=B1;x.beginPath();x.ellipse(0,2,7,5,-.2,0,TAU);x.fill();x.beginPath();x.arc(6,-4,3.2,0,TAU);x.fill();x.fillStyle=G1;x.beginPath();x.moveTo(8,-4);x.lineTo(13,-2);x.lineTo(8,-1);x.fill();x.strokeStyle=B1;x.beginPath();x.moveTo(-5,6);x.lineTo(-8,12);x.moveTo(1,7);x.lineTo(1,13);x.stroke()}
  else if(kind===3){x.strokeStyle=B1;x.lineWidth=2;for(let i=0;i<3;i++){x.beginPath();x.moveTo(-9,-5+i*5);x.quadraticCurveTo(-4.5,-9+i*5,0,-5+i*5);x.quadraticCurveTo(4.5,-1+i*5,9,-5+i*5);x.stroke()}}
  else if(kind===4){x.fillStyle=G1;x.beginPath();x.arc(0,0,5.5,0,TAU);x.fill();x.strokeStyle=R1;x.lineWidth=1.4;for(let i=0;i<8;i++){const a=i*Math.PI/4;x.beginPath();x.moveTo(Math.cos(a)*7.5,Math.sin(a)*7.5);x.lineTo(Math.cos(a)*11,Math.sin(a)*11);x.stroke()}}
  else if(kind===5){x.fillStyle=DS_COL.teal;x.beginPath();x.ellipse(0,1,6,7.5,0,0,TAU);x.fill();x.strokeStyle=G1;x.beginPath();x.moveTo(0,-6);x.lineTo(0,9);x.moveTo(-6,1);x.lineTo(6,1);x.stroke();x.beginPath();x.arc(0,-8,2.4,0,TAU);x.stroke();x.strokeStyle=G1;x.beginPath();x.moveTo(-5,8);x.lineTo(-9,12);x.moveTo(5,8);x.lineTo(9,12);x.stroke()}
  else{x.strokeStyle=DS_COL.teal;x.lineWidth=2;x.beginPath();x.moveTo(0,14);x.lineTo(0,-8);x.stroke();x.fillStyle=DS_COL.teal;x.beginPath();x.moveTo(0,-12);x.quadraticCurveTo(7,-8,0,-4);x.quadraticCurveTo(-7,-8,0,-12);x.fill()}
  x.restore();
}
function dsBand(x,y,h,w){ // a painted frieze band: gold lines with red and blue between
  x.fillStyle=DS_COL.goldD;x.fillRect(0,y,w,h);x.fillStyle=DS_COL.gold;x.fillRect(0,y+1,w,2);x.fillRect(0,y+h-3,w,2);
  x.fillStyle=DS_COL.blue;x.fillRect(0,y+4,w,Math.max(2,h-9));
  for(let i=0;i<w;i+=10){x.fillStyle=(i/10)%2?DS_COL.red:DS_COL.gold;x.fillRect(i+2,y+5,6,Math.max(1,h-11))}
}
function dsWallTile(kind,seed){
  const [c,x]=tcv(),r=abRng(seed*131+7),gc=document.createElement('canvas');gc.width=gc.height=TS;
  const sand=[196,166,112],mort=[56,42,28];
  if(kind==='plain'||kind==='cave'){
    dsStoneWall(x,r,kind==='cave'?[168,140,96]:sand,mort,kind==='cave'?3:4);
    if(kind==='cave'){for(let i=0;i<7;i++){x.fillStyle='rgba(236,208,150,'+(.25+r()*.3)+')';x.beginPath();x.moveTo(r()*TS,TS);x.lineTo(r()*TS,TS-10-r()*40);x.lineTo(r()*TS,TS);x.fill()}x.fillStyle='rgba(30,20,10,.18)';for(let i=0;i<6;i++)x.fillRect(r()*TS,r()*TS,3+r()*16,2+r()*8)}
    else{dsBand(x,10,14,TS);dsBand(x,TS-26,10,TS)}
  }else if(kind==='glyph'){
    dsStoneWall(x,r,sand,mort,4);dsBand(x,4,10,TS);dsBand(x,TS-14,10,TS);
    for(let row=0;row<3;row++)for(let col=0;col<4;col++)dsGlyph(x,16+col*32,38+row*26,1,(col*3+row*2+((r()*7)|0))%7);
  }else if(kind==='gold'){ // a procession in profile on a gold ground
    const g=x.createLinearGradient(0,0,TS,TS);g.addColorStop(0,'#e8c04a');g.addColorStop(.5,'#c8962a');g.addColorStop(1,'#a67818');x.fillStyle=g;x.fillRect(0,0,TS,TS);
    x.fillStyle='rgba(255,240,170,.18)';for(let i=0;i<8;i++)x.fillRect(r()*TS,r()*TS,2+r()*20,1+r()*2);
    dsBand(x,0,12,TS);dsBand(x,TS-12,12,TS);
    const fig=(fx,kind2)=>{x.save();x.translate(fx,0);x.fillStyle=kind2?'#1e3a8a':'#7a1f1f';x.strokeStyle='#17120e';x.lineWidth=1.3;
      x.beginPath();x.rect(-5,44,10,40);x.fill();x.stroke();x.beginPath();x.arc(0,38,6,0,TAU);x.fill();x.stroke();
      if(kind2){x.beginPath();x.moveTo(3,34);x.lineTo(14,27);x.lineTo(10,37);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(-6,34);x.lineTo(-9,22);x.lineTo(-2,30);x.fill()} // jackal ears and snout
      else{x.fillStyle='#e0b038';x.fillRect(-6,30,12,5);x.fillRect(-2,22,4,8)} // a crown
      x.fillStyle='#e0b038';x.fillRect(-5,56,10,3);x.fillStyle='#17120e';x.fillRect(-4,84,3,12);x.fillRect(1,84,3,12);x.restore()};
    fig(24,1);fig(54,0);fig(84,1);fig(112,0);
    x.strokeStyle='#17120e';x.lineWidth=1.2;x.beginPath();x.moveTo(0,98);x.lineTo(TS,98);x.stroke();for(let i=0;i<8;i++)dsGlyph(x,8+i*16,108,.55,i%7);
  }else if(kind==='lapis'){
    const g=x.createLinearGradient(0,0,0,TS);g.addColorStop(0,'#1c3a8a');g.addColorStop(1,'#10205a');x.fillStyle=g;x.fillRect(0,0,TS,TS);
    for(let i=0;i<46;i++){x.fillStyle='rgba(255,230,140,'+(.25+r()*.55)+')';x.fillRect(r()*TS,r()*TS,1+r()*2,1+r()*2)}
    for(let i=0;i<20;i++){x.fillStyle='rgba(150,190,255,.3)';x.fillRect(r()*TS,r()*TS,3+r()*10,1)}
    dsBand(x,0,12,TS);dsBand(x,TS-12,12,TS);
    x.fillStyle='#e0b038';x.beginPath();x.arc(64,60,16,0,TAU);x.fill();x.strokeStyle='#b02a2a';x.lineWidth=3;x.beginPath();x.arc(64,60,16,0,TAU);x.stroke();
    x.strokeStyle='#e0b038';x.lineWidth=3;x.beginPath();x.moveTo(36,60);x.lineTo(14,52);x.moveTo(36,64);x.lineTo(16,66);x.moveTo(92,60);x.lineTo(114,52);x.moveTo(92,64);x.lineTo(112,66);x.stroke(); // wings
  }else if(kind==='pillar'){
    dsStoneWall(x,r,sand,mort,4);
    for(let i=0;i<4;i++){const px=8+i*30;const g=x.createLinearGradient(px,0,px+22,0);g.addColorStop(0,'#c8a870');g.addColorStop(.5,'#e8d0a0');g.addColorStop(1,'#8e7448');x.fillStyle=g;x.fillRect(px,0,22,TS);x.strokeStyle='#3a2a18';x.lineWidth=1.2;x.strokeRect(px+.5,.5,21,TS-1)}
    for(const yy of [0,26,52,78,104]){x.fillStyle=DS_COL.gold;x.fillRect(0,yy,TS,3);x.fillStyle=DS_COL.blue;x.fillRect(0,yy+3,TS,3)}
    for(let i=0;i<4;i++){x.fillStyle=DS_COL.teal;x.beginPath();x.moveTo(19+i*30,2);x.quadraticCurveTo(26+i*30,10,19+i*30,20);x.quadraticCurveTo(12+i*30,10,19+i*30,2);x.fill()}
  }else if(kind==='eye'){ // a hidden door is marked by one eye of gold among the dull signs
    dsStoneWall(x,r,sand,mort,4);dsBand(x,4,10,TS);dsBand(x,TS-14,10,TS);
    for(let row=0;row<3;row++)for(let col=0;col<4;col++)if(!(row===1&&(col===1||col===2)))dsGlyph(x,16+col*32,38+row*26,1,(col*3+row*2+((r()*7)|0))%7);
    x.fillStyle='#e0b038';x.strokeStyle='#17120e';x.lineWidth=2.2;x.beginPath();x.moveTo(34,64);x.quadraticCurveTo(64,34,94,64);x.quadraticCurveTo(64,94,34,64);x.closePath();x.fill();x.stroke();
    x.fillStyle='#1e3a8a';x.beginPath();x.arc(64,64,14,0,TAU);x.fill();x.stroke();x.fillStyle='#17120e';x.beginPath();x.arc(64,64,6,0,TAU);x.fill();x.fillStyle='#fff6c0';x.fillRect(60,60,3,3);
    x.strokeStyle='#e0b038';x.lineWidth=3;x.beginPath();x.moveTo(60,80);x.lineTo(54,98);x.moveTo(70,80);x.quadraticCurveTo(80,92,74,100);x.stroke();
  }else if(kind==='rubble'){
    dsStoneWall(x,r,[180,150,100],mort,3);x.fillStyle='rgba(236,208,150,.45)';x.beginPath();x.moveTo(0,TS);x.lineTo(30,60);x.lineTo(60,90);x.lineTo(90,50);x.lineTo(TS,80);x.lineTo(TS,TS);x.fill();
  }
  const out={d:pix(c),c};return out;
}
function dsDoorSocketed(n){ // the great sealed door: a winged sun, four sockets, filled as the golden discs are found
  const [c,x]=tcv();
  x.fillStyle='#2a1c10';x.fillRect(0,0,TS,TS);
  const g=x.createLinearGradient(0,0,TS,0);g.addColorStop(0,'#8a6418');g.addColorStop(.5,'#e8c04a');g.addColorStop(1,'#8a6418');x.fillStyle=g;x.fillRect(6,0,TS-12,TS);
  x.strokeStyle='#17120e';x.lineWidth=2.5;x.strokeRect(6,1,TS-12,TS-2);x.beginPath();x.moveTo(64,0);x.lineTo(64,TS);x.stroke();
  dsBand(x,0,10,TS);dsBand(x,TS-10,10,TS);
  x.strokeStyle='#17120e';x.lineWidth=1.4;x.fillStyle='#b02a2a';x.beginPath();x.arc(64,24,12,0,TAU);x.fill();x.stroke();x.fillStyle='#e8c04a';x.beginPath();x.arc(64,24,6,0,TAU);x.fill();
  x.fillStyle='#1e3a8a';for(const k of [-1,1]){x.beginPath();x.moveTo(64+k*13,22);x.quadraticCurveTo(64+k*40,10,64+k*52,24);x.quadraticCurveTo(64+k*40,22,64+k*13,28);x.fill();x.stroke()}
  const pos=[[34,60],[94,60],[34,96],[94,96]];
  for(let i=0;i<4;i++){const [px,py]=pos[i];x.fillStyle='#17120e';x.beginPath();x.arc(px,py,13,0,TAU);x.fill();x.strokeStyle='#e8c04a';x.lineWidth=2.4;x.stroke();
    if(i<n){const gg=x.createRadialGradient(px-3,py-3,1,px,py,12);gg.addColorStop(0,'#fff2a0');gg.addColorStop(.6,'#f0c030');gg.addColorStop(1,'#b8860b');x.fillStyle=gg;x.beginPath();x.arc(px,py,11,0,TAU);x.fill();x.strokeStyle='#fff6c0';x.lineWidth=1.2;x.beginPath();x.arc(px,py,7,0,TAU);x.stroke()}
    else{x.fillStyle='rgba(232,192,74,.25)';x.beginPath();x.arc(px,py,8,0,TAU);x.fill()}}
  return {d:pix(c),c};
}

/* ---------- the wall and the gate of Khemetra ---------- */
function dsCityWallTile(){
  const [c,x]=tcv(),r=abRng(808);
  const g=x.createLinearGradient(0,0,0,TS);g.addColorStop(0,'#e8cc8c');g.addColorStop(.6,'#d4aa66');g.addColorStop(1,'#a07a40');x.fillStyle=g;x.fillRect(0,0,TS,TS);
  for(let k=0,y=0;y<TS;k++){const h=24+((r()*8)|0);let xx=-((k%2)?36:0);while(xx<TS){const w=60+((r()*24)|0),sh=r()*22-11;x.fillStyle='rgba('+(200+sh)+','+(160+sh)+','+(100+sh)+',.35)';x.fillRect(xx+2,y+2,w-4,h-4);xx+=w}y+=h}
  x.strokeStyle='rgba(70,44,16,.5)';x.lineWidth=1.6;for(let y=26;y<TS;y+=26){x.beginPath();x.moveTo(0,y);x.lineTo(TS,y);x.stroke()}
  dsBand(x,52,12,TS);
  x.fillStyle='#17110a';for(const px of [24,64,104]){x.fillRect(px-3,86,6,22)} // arrow slits
  x.fillStyle='rgba(255,246,210,.18)';x.fillRect(0,0,TS,4);x.fillStyle='rgba(40,24,8,.25)';x.fillRect(0,TS-14,TS,14);
  return {d:pix(c)};
}
function dsCityGate(){
  const [c,x]=tcv();
  x.fillStyle='#caa064';x.fillRect(0,0,TS,TS);dsBand(x,0,12,TS);
  x.fillStyle='#8a6a38';x.beginPath();x.moveTo(14,TS);x.lineTo(14,52);x.quadraticCurveTo(14,14,64,10);x.quadraticCurveTo(114,14,114,52);x.lineTo(114,TS);x.closePath();x.fill();x.strokeStyle='#17120e';x.lineWidth=2.5;x.stroke();
  for(const k of [-1,1]){const g=x.createLinearGradient(k<0?20:66,0,k<0?62:108,0);g.addColorStop(0,'#6a4a2a');g.addColorStop(.5,'#8a6238');g.addColorStop(1,'#4a321c');x.fillStyle=g;x.fillRect(k<0?20:66,34,42,TS-34);x.strokeRect(k<0?20:66,34,42,TS-34);
    for(let yy=44;yy<TS;yy+=16){x.fillStyle='#26201a';x.fillRect(k<0?20:66,yy,42,5)}
    for(let i=0;i<3;i++)for(let j=0;j<5;j++){x.fillStyle='#e0b038';x.beginPath();x.arc((k<0?28:74)+i*13,40+j*17,2.2,0,TAU);x.fill()}
    x.fillStyle='#e0b038';x.beginPath();x.arc(k<0?54:74,86,8,0,TAU);x.fill();x.stroke();x.fillStyle='#17120e';x.beginPath();x.arc(k<0?54:74,86,3,0,TAU);x.fill()}
  x.fillStyle='#17120e';x.fillRect(62,34,4,TS-34);
  x.fillStyle='#e0b038';x.beginPath();x.arc(64,24,9,0,TAU);x.fill();x.strokeStyle='#b02a2a';x.lineWidth=2;x.stroke();
  return addTex(pix(c));
}
