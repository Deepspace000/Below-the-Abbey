/* ==========================================================================
   THE SAND ROAD: dune walls, the cliff, the doorway into the tomb, and the one function that makes it all
   ========================================================================== */
function dsDuneWallTile(red,seed){
  const [c,x]=tcv(),r=abRng(seed),pal=red?DS_RED:DS_YEL;
  const g=x.createLinearGradient(0,0,0,TS);g.addColorStop(0,pal[0]);g.addColorStop(.35,pal[1]);g.addColorStop(1,pal[2]);x.fillStyle=g;x.fillRect(0,0,TS,TS);
  // wind ripples running along the face
  for(let i=0;i<16;i++){const yy=6+i*7.6+r()*3;x.strokeStyle=i%2?'rgba(255,244,210,.25)':'rgba(80,44,20,.22)';x.lineWidth=1.6;x.beginPath();x.moveTo(0,yy);for(let k=1;k<=8;k++)x.lineTo(TS*k/8,yy+Math.sin(k*1.4+i*1.9)*3.4+r()*1.6);x.stroke()}
  x.fillStyle='rgba(255,246,214,.35)';x.fillRect(0,0,TS,5); // the lit crest
  x.fillStyle='rgba(60,30,12,.22)';x.fillRect(0,TS-22,TS,22);
  for(let i=0;i<60;i++){x.fillStyle=r()<.5?'rgba(255,240,200,.3)':'rgba(70,40,20,.25)';x.fillRect(r()*TS,r()*TS,1+r()*2,1)}
  return {d:pix(c)};
}
function dsCliffTile(red,seed){
  const [c,x]=tcv(),r=abRng(seed),pal=red?['#c8704a','#a8502e','#7a3a22','#5a281a']:['#d8b078','#b88c54','#8a6638','#5a4226'];
  x.fillStyle=pal[1];x.fillRect(0,0,TS,TS);
  let y=0;while(y<TS){const h=10+r()*18;x.fillStyle=pal[(r()*3)|0];x.fillRect(0,y,TS,h);x.fillStyle='rgba(255,240,200,.2)';x.fillRect(0,y,TS,2);x.fillStyle='rgba(0,0,0,.2)';x.fillRect(0,y+h-3,TS,3);y+=h}
  for(let i=0;i<7;i++){x.strokeStyle='rgba(30,16,6,.55)';x.lineWidth=2;x.beginPath();let px=r()*TS,py=0;x.moveTo(px,py);while(py<TS){px+=(r()-.5)*14;py+=10+r()*14;x.lineTo(px,py)}x.stroke()}
  for(let i=0;i<14;i++){x.fillStyle='rgba(236,208,150,.35)';x.beginPath();x.moveTo(r()*TS,TS);x.lineTo(r()*TS,TS-12-r()*30);x.lineTo(r()*TS,TS);x.fill()}
  return {d:pix(c)};
}
function dsTombDoor(){ // the gate of the tomb: a pylon of carved stone, a golden winged sun above a black doorway, sand drifting in
  const [c,x]=tcv();
  const g=x.createLinearGradient(0,0,TS,0);g.addColorStop(0,'#8e6e3e');g.addColorStop(.5,'#cba26a');g.addColorStop(1,'#7a5a30');x.fillStyle=g;x.fillRect(0,0,TS,TS);
  x.strokeStyle='rgba(40,24,10,.5)';x.lineWidth=1.4;for(let i=1;i<6;i++){x.beginPath();x.moveTo(0,i*22);x.lineTo(TS,i*22);x.stroke()}
  x.fillStyle='#17110a';x.beginPath();x.moveTo(34,TS);x.lineTo(34,56);x.lineTo(64,38);x.lineTo(94,56);x.lineTo(94,TS);x.closePath();x.fill();
  x.strokeStyle='#e0b038';x.lineWidth=4;x.stroke();x.strokeStyle='#1e3a8a';x.lineWidth=3;x.beginPath();x.moveTo(28,TS);x.lineTo(28,52);x.lineTo(64,32);x.lineTo(100,52);x.lineTo(100,TS);x.stroke();
  const sg=x.createLinearGradient(0,TS-34,0,TS);sg.addColorStop(0,'rgba(222,190,130,0)');sg.addColorStop(1,'rgba(222,190,130,.95)');x.fillStyle=sg;x.beginPath();x.moveTo(34,TS);x.lineTo(40,TS-30);x.lineTo(88,TS-24);x.lineTo(94,TS);x.fill();
  x.fillStyle='#e0b038';x.beginPath();x.arc(64,14,9,0,TAU);x.fill();x.strokeStyle='#b02a2a';x.lineWidth=2;x.stroke();x.strokeStyle='#e0b038';x.lineWidth=3;x.beginPath();x.moveTo(52,14);x.lineTo(22,8);x.moveTo(52,17);x.lineTo(24,20);x.moveTo(76,14);x.lineTo(106,8);x.moveTo(76,17);x.lineTo(104,20);x.stroke();
  for(let i=0;i<6;i++){dsGlyph(x,12,40+i*14,.45,(i*2)%7);dsGlyph(x,116,40+i*14,.45,(i*3)%7)}
  return addTex(pix(c));
}
function makeDesertArt(){
  makeDesertFloors();makeDesertSprites();makeDesertCreatures();makeTeleSprites();
  const mkWall=(t,wh,sky)=>{const id=addTex(t.d,t.e||null);if(wh)TEX[id].wh=wh;if(sky)TEX[id].sky=true;const gid=TNF++;T_TILE[gid]=id;return gid}; // a 'sky' wall is a piece of the moving sky itself, so the edge of the desert is open sky
  const ydune=mkWall(dsDuneWallTile(false,401),0,true),rdune=mkWall(dsDuneWallTile(true,402),0,true),ycl=mkWall(dsCliffTile(false,403),0),rcl=mkWall(dsCliffTile(true,404),0);
  LEVEL41_DATA.chars={D:ydune,C:ycl};DS_TEXREG.cliffY=T_TILE[ycl];DS_TEXREG.cliffR=T_TILE[rcl];
  const ycity=mkWall(dsCityWallTile(),1.9);LEVEL43_DATA.chars={D:rdune,C:rcl,Y:ycity};T_DOORS.citygate=dsCityGate();DS_TEXREG.citywall=T_TILE[ycity];DS_TEXREG.citygate=T_DOORS.citygate;
  T_DOORS.tomb=dsTombDoor();DS_TEXREG.tombdoor=T_DOORS.tomb;
  if(typeof makeTombArt==='function')makeTombArt(rdune,rcl);
  if(typeof makeBlueArt==='function')makeBlueArt(ydune,ycl);
  if(typeof makeGoldenArt==='function')makeGoldenArt(ydune,ycl);
}
