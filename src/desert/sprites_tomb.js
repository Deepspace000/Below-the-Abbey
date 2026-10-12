/* ==========================================================================
   THE TOMB OF SUT: sarcophagi, ceremonial vases, braziers, pillars, statues, treasure and the sun discs
   ========================================================================== */
const DS_LOOTNAME={sarcoph:'Sarcophagus',sarcophU:'Standing sarcophagus',vase0:'Canopic jar',vase1:'Tall amphora',vase2:'Golden urn',vase3:'Painted jar',treasure:'Heap of treasure',offering:'Offering table'};
function dsGoldGrad(x,x0,y0,x1,y1){const g=x.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,'#fff0a0');g.addColorStop(.35,'#e8c040');g.addColorStop(.7,'#b8860b');g.addColorStop(1,'#7a5a10');return g}
function dsShadow(x,cx,cy,rx){x.fillStyle='rgba(0,0,0,.32)';x.beginPath();x.ellipse(cx,cy,rx,rx*.14,0,0,TAU);x.fill()}
function dsSarcoph(){ // a golden coffin lying on a stone bier, the lid a portrait with folded arms
  return mkCanvas(190,120,(x)=>{
    dsShadow(x,95,112,86);x.lineJoin='round';
    x.fillStyle='#8a7048';x.strokeStyle=DS_OL;x.lineWidth=2.6;x.fillRect(12,84,166,26);x.strokeRect(12,84,166,26);
    x.fillStyle='#a8895a';x.fillRect(8,78,174,10);x.strokeRect(8,78,174,10);
    x.fillStyle=dsGoldGrad(x,10,20,180,90);x.beginPath();x.moveTo(14,80);x.quadraticCurveTo(8,40,34,34);x.lineTo(156,34);x.quadraticCurveTo(182,40,176,80);x.closePath();x.fill();x.stroke();
    // the face: a calm mask in gold with lapis eyes and a striped headcloth
    x.fillStyle='#e8c040';x.beginPath();x.ellipse(40,52,22,20,0,0,TAU);x.fill();x.stroke();
    x.fillStyle='#1e3a8a';for(let i=0;i<5;i++)x.fillRect(22,38+i*7,36,3.4);x.fillStyle='#f3d868';x.beginPath();x.ellipse(40,54,14,15,0,0,TAU);x.fill();x.stroke();
    x.fillStyle='#17120e';x.fillRect(31,50,6,3);x.fillRect(43,50,6,3);x.fillRect(38,58,4,2.4);x.fillRect(34,62,12,2);
    x.fillStyle='#1e3a8a';x.fillRect(32,51,4,1.8);x.fillRect(44,51,4,1.8);
    // the body in painted bands, crook and flail crossed on the chest
    dsBand(x,62,10,0);x.save();x.beginPath();x.rect(66,34,108,46);x.clip();
    for(let i=0;i<4;i++){const yy=36+i*11;x.fillStyle=i%2?'#1e3a8a':'#b02a2a';x.fillRect(66,yy,108,5);x.fillStyle='#e0b038';x.fillRect(66,yy+5,108,2)}
    x.restore();x.strokeStyle='#17120e';x.lineWidth=1.4;x.strokeRect(66,34,108,46);
    x.strokeStyle='#e8c040';x.lineWidth=4;x.beginPath();x.moveTo(98,44);x.lineTo(138,68);x.moveTo(138,44);x.lineTo(98,68);x.stroke();
    x.fillStyle='#b02a2a';x.beginPath();x.arc(98,44,4,0,TAU);x.arc(138,44,4,0,TAU);x.fill();
    for(let i=0;i<5;i++)dsGlyph(x,76+i*20,74,.4,(i*2)%7);
  });
}
function dsSarcophU(){ // an upright mummy-shaped case
  return mkCanvas(100,230,(x)=>{
    dsShadow(x,50,220,36);x.lineJoin='round';
    x.fillStyle='#6a5030';x.strokeStyle=DS_OL;x.lineWidth=2.6;x.fillRect(16,204,68,16);x.strokeRect(16,204,68,16);
    x.fillStyle=dsGoldGrad(x,14,10,86,210);x.beginPath();x.moveTo(30,204);x.quadraticCurveTo(14,140,22,80);x.quadraticCurveTo(18,30,50,12);x.quadraticCurveTo(82,30,78,80);x.quadraticCurveTo(86,140,70,204);x.closePath();x.fill();x.stroke();
    x.fillStyle='#1e3a8a';x.beginPath();x.moveTo(28,56);x.quadraticCurveTo(50,34,72,56);x.lineTo(70,92);x.lineTo(30,92);x.closePath();x.fill();x.stroke();
    x.fillStyle='#f3d868';x.beginPath();x.ellipse(50,62,15,19,0,0,TAU);x.fill();x.stroke();x.fillStyle='#17120e';x.fillRect(41,58,6,3);x.fillRect(53,58,6,3);x.fillRect(48,66,4,3);x.fillRect(44,72,12,2);
    for(let i=0;i<6;i++){x.fillStyle=i%2?'#b02a2a':'#1e3a8a';x.fillRect(28,100+i*14,44,6);x.fillStyle='#e0b038';x.fillRect(28,106+i*14,44,2)}
    x.strokeStyle='#e8c040';x.lineWidth=4;x.beginPath();x.moveTo(34,102);x.lineTo(64,122);x.moveTo(66,102);x.lineTo(36,122);x.stroke();
  });
}
function dsVase(kind){
  const W=[64,78,70,96][kind],Hh=[104,128,116,116][kind];
  return mkCanvas(W,Hh,(x,w,h)=>{
    dsShadow(x,w/2,h-6,w*.36);x.lineJoin='round';x.strokeStyle=DS_OL;x.lineWidth=2.4;
    if(kind===0){ // canopic jar with a jackal lid
      const g=x.createLinearGradient(14,0,50,0);g.addColorStop(0,'#e8dcc0');g.addColorStop(1,'#a89878');x.fillStyle=g;x.beginPath();x.moveTo(14,34);x.quadraticCurveTo(8,70,18,96);x.lineTo(46,96);x.quadraticCurveTo(56,70,50,34);x.closePath();x.fill();x.stroke();
      x.fillStyle='#1e3a8a';x.fillRect(12,52,40,6);x.fillStyle='#e0b038';x.fillRect(12,58,40,3);x.fillRect(12,40,40,3);
      x.fillStyle='#3a2a1a';x.beginPath();x.moveTo(16,36);x.lineTo(14,12);x.lineTo(26,22);x.lineTo(44,18);x.lineTo(54,4);x.lineTo(50,36);x.closePath();x.fill();x.stroke();x.fillStyle='#e0b038';x.fillRect(22,26,16,3);
    }else if(kind===1){ // amphora
      const g=x.createLinearGradient(16,0,62,0);g.addColorStop(0,'#c86a3a');g.addColorStop(1,'#7a3418');x.fillStyle=g;x.beginPath();x.moveTo(30,12);x.lineTo(48,12);x.quadraticCurveTo(54,30,66,52);x.quadraticCurveTo(70,88,50,112);x.lineTo(28,112);x.quadraticCurveTo(8,88,12,52);x.quadraticCurveTo(24,30,30,12);x.closePath();x.fill();x.stroke();
      x.strokeStyle=DS_OL;x.lineWidth=5;x.beginPath();x.moveTo(30,18);x.quadraticCurveTo(6,24,12,50);x.moveTo(48,18);x.quadraticCurveTo(72,24,66,50);x.stroke();
      x.fillStyle='#17120e';x.fillRect(14,60,50,5);x.fillRect(16,82,46,4);for(let i=0;i<5;i++){x.fillRect(18+i*9,68,5,12)}
    }else if(kind===2){ // golden urn
      x.fillStyle=dsGoldGrad(x,8,10,62,110);x.beginPath();x.moveTo(24,10);x.lineTo(46,10);x.lineTo(50,28);x.quadraticCurveTo(66,50,58,80);x.quadraticCurveTo(54,100,46,112);x.lineTo(24,112);x.quadraticCurveTo(16,100,12,80);x.quadraticCurveTo(4,50,20,28);x.closePath();x.fill();x.stroke();
      x.fillStyle='#b02a2a';for(let i=0;i<4;i++){x.beginPath();x.arc(20+i*10,62,3.6,0,TAU);x.fill()}x.fillStyle='#1e3a8a';x.fillRect(16,76,38,6);x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.ellipse(24,52,4,16,.2,0,TAU);x.fill();
    }else{ // a big painted jar
      const g=x.createLinearGradient(8,0,88,0);g.addColorStop(0,'#d8b078');g.addColorStop(1,'#8a6a40');x.fillStyle=g;x.beginPath();x.moveTo(30,14);x.lineTo(66,14);x.quadraticCurveTo(92,38,88,76);x.quadraticCurveTo(86,106,68,112);x.lineTo(28,112);x.quadraticCurveTo(10,106,8,76);x.quadraticCurveTo(4,38,30,14);x.closePath();x.fill();x.stroke();
      x.fillStyle='#1e3a8a';x.fillRect(10,48,76,8);x.fillStyle='#b02a2a';x.fillRect(10,60,76,5);for(let i=0;i<6;i++)dsGlyph(x,22+i*11,86,.5,i%7);
    }
  });
}
function dsBrazier(frame){
  return mkCanvas(80,170,(x)=>{
    dsShadow(x,40,162,30);x.lineJoin='round';x.strokeStyle=DS_OL;x.lineWidth=2.4;
    x.strokeStyle=DS_OL;x.lineWidth=7;x.beginPath();x.moveTo(24,160);x.lineTo(36,96);x.moveTo(56,160);x.lineTo(44,96);x.moveTo(40,160);x.lineTo(40,98);x.stroke();x.strokeStyle='#b88c3a';x.lineWidth=3.6;x.beginPath();x.moveTo(24,160);x.lineTo(36,96);x.moveTo(56,160);x.lineTo(44,96);x.moveTo(40,160);x.lineTo(40,98);x.stroke();
    x.fillStyle=dsGoldGrad(x,10,84,70,110);x.beginPath();x.moveTo(8,82);x.lineTo(72,82);x.quadraticCurveTo(66,108,40,112);x.quadraticCurveTo(14,108,8,82);x.closePath();x.fill();x.strokeStyle=DS_OL;x.lineWidth=2.4;x.stroke();
    x.fillStyle='#b02a2a';x.fillRect(12,86,56,5);
    // flames: a few tongues that change from frame to frame
    const r=abRng(40+frame*7);
    for(let k=0;k<4;k++){const fx=40+(k-1.5)*9+(r()-.5)*6,fh=34+r()*30,fw=11+r()*5;const g=x.createLinearGradient(0,82,0,82-fh);g.addColorStop(0,'#ff7a1a');g.addColorStop(.5,'#ffc040');g.addColorStop(1,'rgba(255,240,160,.1)');x.fillStyle=g;x.beginPath();x.moveTo(fx-fw/2,82);x.quadraticCurveTo(fx-fw*.7,82-fh*.5,fx+(r()-.5)*10,82-fh);x.quadraticCurveTo(fx+fw*.7,82-fh*.5,fx+fw/2,82);x.closePath();x.fill()}
    const gl=x.createRadialGradient(40,66,2,40,66,40);gl.addColorStop(0,'rgba(255,200,90,.45)');gl.addColorStop(1,'rgba(255,160,40,0)');x.fillStyle=gl;x.fillRect(0,26,80,80);
  });
}
function dsPillar(kind){
  return mkCanvas(96,280,(x)=>{
    dsShadow(x,48,272,34);x.lineJoin='round';x.strokeStyle=DS_OL;x.lineWidth=2.6;
    const g=x.createLinearGradient(20,0,76,0);g.addColorStop(0,'#d8bc88');g.addColorStop(.45,'#f0dcae');g.addColorStop(1,'#8e7448');x.fillStyle=g;x.fillRect(24,54,48,206);x.strokeRect(24,54,48,206);
    for(let i=0;i<5;i++){x.strokeStyle='rgba(60,40,18,.4)';x.lineWidth=1.4;x.beginPath();x.moveTo(30+i*9,56);x.lineTo(30+i*9,258);x.stroke()}
    for(const yy of [64,116,168,220]){x.fillStyle='#e0b038';x.fillRect(24,yy,48,4);x.fillStyle=kind?'#2f6ab8':'#2a9a8a';x.fillRect(24,yy+4,48,4)}
    x.strokeStyle=DS_OL;x.lineWidth=2.4;x.fillStyle='#a8895a';x.fillRect(14,256,68,14);x.strokeRect(14,256,68,14);
    if(kind){ // lotus capital
      x.fillStyle='#2f6ab8';x.beginPath();x.moveTo(14,52);x.quadraticCurveTo(48,0,82,52);x.lineTo(68,56);x.quadraticCurveTo(48,28,28,56);x.closePath();x.fill();x.stroke();
      x.fillStyle='#e0b038';x.beginPath();x.moveTo(30,50);x.quadraticCurveTo(48,6,66,50);x.quadraticCurveTo(48,32,30,50);x.closePath();x.fill();x.stroke();
    }else{ // papyrus bundle capital
      for(let i=0;i<5;i++){x.fillStyle=i%2?'#4a9a38':'#2f7a2c';x.beginPath();x.moveTo(24+i*10,56);x.quadraticCurveTo(14+i*16,22,48+(i-2)*10,8);x.quadraticCurveTo(34+i*10,26,34+i*10,56);x.closePath();x.fill();x.stroke()}
    }
    x.fillStyle='#8a7048';x.fillRect(18,50,60,8);x.strokeRect(18,50,60,8);
  });
}
function dsAnubis(){
  return mkCanvas(110,250,(x)=>{
    dsShadow(x,55,242,38);x.lineJoin='round';x.strokeStyle=DS_OL;x.lineWidth=2.6;
    x.fillStyle='#3a342c';x.fillRect(20,214,70,24);x.strokeRect(20,214,70,24);
    const g=x.createLinearGradient(30,0,80,0);g.addColorStop(0,'#2a2620');g.addColorStop(.5,'#4a443a');g.addColorStop(1,'#1c1812');x.fillStyle=g;
    x.beginPath();x.moveTo(34,214);x.lineTo(38,110);x.quadraticCurveTo(55,98,72,110);x.lineTo(76,214);x.closePath();x.fill();x.stroke(); // body
    x.fillStyle=dsGoldGrad(x,34,100,76,130);x.beginPath();x.moveTo(28,104);x.quadraticCurveTo(55,84,82,104);x.lineTo(76,126);x.lineTo(34,126);x.closePath();x.fill();x.stroke(); // gold collar
    x.fillStyle=dsGoldGrad(x,34,160,76,210);x.fillRect(36,160,38,52);x.strokeRect(36,160,38,52);for(let i=0;i<5;i++){x.strokeStyle='rgba(60,36,8,.6)';x.lineWidth=1.2;x.beginPath();x.moveTo(39+i*8,161);x.lineTo(39+i*8,211);x.stroke()}
    x.strokeStyle=DS_OL;x.lineWidth=2.6;
    x.fillStyle='#2a2620';x.beginPath();x.moveTo(40,100);x.lineTo(36,40);x.lineTo(44,20);x.lineTo(50,44);x.lineTo(64,44);x.lineTo(70,20);x.lineTo(78,40);x.lineTo(72,100);x.quadraticCurveTo(70,70,92,66);x.lineTo(96,76);x.quadraticCurveTo(78,84,76,104);x.closePath();x.fill();x.stroke(); // head and long snout
    x.fillStyle='#e0b038';x.beginPath();x.arc(60,58,3.4,0,TAU);x.fill();x.fillStyle='#b02a2a';x.beginPath();x.arc(52,50,2.2,0,TAU);x.arc(66,50,2.2,0,TAU);x.fill();
    x.fillStyle='#e0b038';x.fillRect(40,34,32,5);
  });
}
function dsBastet(){
  return mkCanvas(90,170,(x)=>{
    dsShadow(x,45,162,30);x.lineJoin='round';x.strokeStyle=DS_OL;x.lineWidth=2.4;
    x.fillStyle='#3a342c';x.fillRect(14,140,62,20);x.strokeRect(14,140,62,20);
    const g=x.createLinearGradient(24,0,66,0);g.addColorStop(0,'#c8a868');g.addColorStop(.5,'#e8d098');g.addColorStop(1,'#8a6e40');x.fillStyle=g;
    x.beginPath();x.moveTo(24,140);x.quadraticCurveTo(18,96,34,74);x.lineTo(56,74);x.quadraticCurveTo(72,96,66,140);x.closePath();x.fill();x.stroke();
    x.beginPath();x.moveTo(30,76);x.lineTo(26,38);x.lineTo(38,50);x.lineTo(52,50);x.lineTo(64,38);x.lineTo(60,76);x.quadraticCurveTo(45,86,30,76);x.closePath();x.fill();x.stroke();
    x.fillStyle='#17120e';x.beginPath();x.ellipse(37,60,3,4.6,0,0,TAU);x.ellipse(53,60,3,4.6,0,0,TAU);x.fill();x.fillStyle='#e0b038';x.fillRect(30,78,30,5);x.beginPath();x.moveTo(44,66);x.lineTo(46,66);x.lineTo(45,70);x.fill();
    x.strokeStyle='#8a6e40';x.lineWidth=3;x.beginPath();x.moveTo(66,138);x.quadraticCurveTo(86,120,80,100);x.stroke();
  });
}
function dsPharaoh(){ // a colossal seated statue in the throne room
  return mkCanvas(260,330,(x)=>{
    dsShadow(x,130,320,100);x.lineJoin='round';x.strokeStyle=DS_OL;x.lineWidth=3;
    const g=x.createLinearGradient(40,0,220,0);g.addColorStop(0,'#c8a868');g.addColorStop(.5,'#ecd49a');g.addColorStop(1,'#8a6e40');
    x.fillStyle='#8a7048';x.fillRect(30,276,200,40);x.strokeRect(30,276,200,40);
    x.fillStyle=g;x.beginPath();x.moveTo(52,276);x.lineTo(60,140);x.quadraticCurveTo(130,120,200,140);x.lineTo(208,276);x.closePath();x.fill();x.stroke();
    x.fillRect(40,230,180,46);x.strokeRect(40,230,180,46);
    x.fillStyle='#1e3a8a';x.beginPath();x.moveTo(78,130);x.quadraticCurveTo(130,104,182,130);x.lineTo(176,170);x.lineTo(84,170);x.closePath();x.fill();x.stroke();
    for(const [rr,col] of [[44,'#e0b038'],[34,'#b02a2a']]){x.fillStyle=col;x.beginPath();x.ellipse(130,134,rr,rr*.4,0,0,Math.PI);x.fill();x.stroke()}
    x.fillStyle=g;x.beginPath();x.ellipse(130,78,34,44,0,0,TAU);x.fill();x.stroke();
    x.fillStyle='#1e3a8a';x.beginPath();x.moveTo(92,60);x.quadraticCurveTo(130,18,168,60);x.lineTo(176,104);x.lineTo(166,98);x.lineTo(166,64);x.quadraticCurveTo(130,36,94,64);x.lineTo(94,98);x.lineTo(84,104);x.closePath();x.fill();x.stroke();
    x.fillStyle='#e0b038';for(let i=0;i<6;i++)x.fillRect(90+i*0,52+i*8,0,0);x.fillRect(100,44,60,8);
    x.fillStyle='#17120e';x.fillRect(112,70,10,5);x.fillRect(138,70,10,5);x.fillRect(126,84,8,4);x.fillRect(118,98,24,3);
    x.fillStyle='#e0b038';x.beginPath();x.moveTo(120,44);x.lineTo(130,6);x.lineTo(140,44);x.closePath();x.fill();x.stroke();
    x.strokeStyle='#e8c040';x.lineWidth=7;x.beginPath();x.moveTo(78,170);x.lineTo(104,214);x.moveTo(182,170);x.lineTo(156,214);x.stroke();
  });
}
function dsTreasure(){
  return mkCanvas(150,96,(x)=>{
    dsShadow(x,75,90,60);const r=abRng(77);
    x.fillStyle=dsGoldGrad(x,10,20,140,90);x.beginPath();x.moveTo(8,88);x.quadraticCurveTo(20,30,75,20);x.quadraticCurveTo(130,30,142,88);x.closePath();x.fill();x.strokeStyle=DS_OL;x.lineWidth=2;x.stroke();
    for(let i=0;i<70;i++){const px=20+r()*110,py=30+r()*56;x.fillStyle=r()<.6?'#f6d860':'#c8962a';x.beginPath();x.ellipse(px,py,5,2.6,r()*3,0,TAU);x.fill();x.strokeStyle='rgba(90,60,10,.6)';x.lineWidth=.8;x.stroke()}
    for(const [col,px,py] of [['#b02a2a',50,38],['#2a9a8a',92,34],['#1e3a8a',70,26],['#e8e8f0',112,50],['#b02a2a',34,56]]){x.fillStyle=col;x.beginPath();x.arc(px,py,5.6,0,TAU);x.fill();x.strokeStyle=DS_OL;x.lineWidth=1.2;x.stroke();x.fillStyle='rgba(255,255,255,.6)';x.fillRect(px-2,py-3,2,2)}
    x.fillStyle=dsGoldGrad(x,100,20,130,50);x.beginPath();x.moveTo(108,32);x.lineTo(126,32);x.lineTo(122,52);x.lineTo(112,52);x.closePath();x.fill();x.stroke(); // a goblet
  });
}
function dsOffering(){
  return mkCanvas(120,100,(x)=>{
    dsShadow(x,60,94,46);x.lineJoin='round';x.strokeStyle=DS_OL;x.lineWidth=2.4;
    x.fillStyle='#8a7048';x.fillRect(18,50,84,10);x.strokeRect(18,50,84,10);x.fillRect(26,60,10,32);x.strokeRect(26,60,10,32);x.fillRect(84,60,10,32);x.strokeRect(84,60,10,32);
    x.fillStyle=dsGoldGrad(x,30,30,60,50);x.beginPath();x.moveTo(30,50);x.quadraticCurveTo(44,24,60,50);x.closePath();x.fill();x.stroke();
    x.fillStyle='#c8864a';x.beginPath();x.ellipse(78,44,12,6,0,0,TAU);x.fill();x.stroke();
    x.fillStyle='#e8d8b0';x.beginPath();x.arc(96,42,6,0,TAU);x.fill();x.stroke();
    x.fillStyle='#d8607a';for(let i=0;i<3;i++){x.beginPath();x.arc(58+i*5,38-i*2,3.4,0,TAU);x.fill()}
    x.strokeStyle='#3a7a2a';x.lineWidth=2;x.beginPath();x.moveTo(60,46);x.lineTo(60,36);x.stroke();
  });
}
function dsVent(){ // a scorched slab with a carved scarab and soot round it: the sign of a fire trap
  return mkCanvas(90,50,(x)=>{
    x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(45,34,40,12,0,0,TAU);x.fill();
    const g=x.createRadialGradient(45,28,4,45,28,36);g.addColorStop(0,'#5a4a3a');g.addColorStop(1,'#2a2018');x.fillStyle=g;x.beginPath();x.ellipse(45,28,34,13,0,0,TAU);x.fill();x.strokeStyle='#17120e';x.lineWidth=2;x.stroke();
    x.fillStyle='#c8962a';x.beginPath();x.ellipse(45,28,9,6,0,0,TAU);x.fill();x.strokeStyle='#17120e';x.lineWidth=1.2;x.stroke();x.beginPath();x.moveTo(45,22);x.lineTo(45,34);x.stroke();
    x.strokeStyle='rgba(20,14,8,.7)';x.lineWidth=1.6;for(let i=0;i<9;i++){const a=i/9*TAU;x.beginPath();x.moveTo(45+Math.cos(a)*15,28+Math.sin(a)*8);x.lineTo(45+Math.cos(a)*30,28+Math.sin(a)*12);x.stroke()}
  });
}
function dsSunDisc(n){ // the golden sun disc, held up on a little stand
  return mkCanvas(80,96,(x)=>{
    x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(40,88,22,5,0,0,TAU);x.fill();
    x.fillStyle='#6a4a18';x.beginPath();x.moveTo(30,88);x.lineTo(34,66);x.lineTo(46,66);x.lineTo(50,88);x.closePath();x.fill();x.strokeStyle=DS_OL;x.lineWidth=2;x.stroke();
    const gl=x.createRadialGradient(40,38,4,40,38,40);gl.addColorStop(0,'rgba(255,230,120,.7)');gl.addColorStop(1,'rgba(255,200,60,0)');x.fillStyle=gl;x.fillRect(0,0,80,80);
    x.strokeStyle='#f0c030';x.lineWidth=3.4;x.lineCap='round';for(let i=0;i<16;i++){const a=i/16*TAU;x.beginPath();x.moveTo(40+Math.cos(a)*22,38+Math.sin(a)*22);x.lineTo(40+Math.cos(a)*32,38+Math.sin(a)*32);x.stroke()}
    const g=x.createRadialGradient(34,32,2,40,38,24);g.addColorStop(0,'#fff6b0');g.addColorStop(.6,'#f0c030');g.addColorStop(1,'#b8860b');x.fillStyle=g;x.beginPath();x.arc(40,38,22,0,TAU);x.fill();x.strokeStyle=DS_OL;x.lineWidth=2.4;x.stroke();
    x.strokeStyle='#b02a2a';x.lineWidth=2;x.beginPath();x.arc(40,38,15,0,TAU);x.stroke();x.fillStyle='#b02a2a';for(let i=0;i<n;i++){x.beginPath();x.arc(40+(i-(n-1)/2)*8,38,2.6,0,TAU);x.fill()}
  });
}
function dsSutStatue(){
  const im=dsSut(false);return mkCanvas(im.width,im.height,(x,w,h)=>{x.drawImage(im,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(120,100,70,.78)';x.fillRect(0,0,w,h);x.globalCompositeOperation='source-over';x.fillStyle='rgba(255,230,160,.12)';x.fillRect(0,0,w,h*.3)});
}
function makeTombSprites(){
  IMG.sarcoph=dsSarcoph();NPC_H.sarcoph=.6;IMG.sarcophU=dsSarcophU();NPC_H.sarcophU=1.35;
  for(let i=0;i<4;i++){IMG['vase'+i]=dsVase(i);NPC_H['vase'+i]=[.52,.64,.58,.58][i]}
  for(let f=0;f<4;f++)IMG['brazier'+f]=dsBrazier(f);NPC_H.brazier0=NPC_H.brazier1=NPC_H.brazier2=NPC_H.brazier3=.9;
  IMG.dpillar0=dsPillar(0);IMG.dpillar1=dsPillar(1);NPC_H.dpillar0=NPC_H.dpillar1=1.6;
  IMG.danubis=dsAnubis();NPC_H.danubis=1.3;IMG.dbastet=dsBastet();NPC_H.dbastet=.85;IMG.dpharaoh=dsPharaoh();NPC_H.dpharaoh=1.8;IMG.dsutstatue=dsSutStatue();NPC_H.dsutstatue=1.7;
  IMG.treasure=dsTreasure();NPC_H.treasure=.42;IMG.offering=dsOffering();NPC_H.offering=.5;IMG.ventplate=dsVent();NPC_H.ventplate=.17;
  for(let n=1;n<=4;n++){IMG['it_sundisc'+n]=dsSunDisc(n)}
}
