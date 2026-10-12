/* ==========================================================================
   THE SAND ROAD: the creatures of the desert and the tomb (their pictures and their stats)
   ========================================================================== */
Object.assign(ENEMY_DEF,{
  scorpion:{name:'Giant Scorpion',hp:40,dmg:[6,11],hit:.74,w:.95,img:'scorpion',xp:120,gold:[2,8],speed:1,verb:'stings'},
  dwolf:{name:'Desert Wolf',hp:36,dmg:[4,8],hit:.74,w:.95,img:'dwolf',xp:70,gold:[0,0],speed:2,verb:'bites'},
  nomad:{name:'Desperate Nomad',hp:44,dmg:[5,9],hit:.72,w:.5,img:'nomad',xp:90,gold:[6,22],speed:1,verb:'slashes'},
  mummy:{name:'Mummy',hp:60,dmg:[8,13],hit:.76,w:.6,img:'mummy',xp:150,gold:[10,30],speed:1,verb:'claws'},
  sut:{name:'Sut, Lord of the Red Desert',hp:170,dmg:[12,19],hit:.82,w:1.6,img:'sut',xp:5000,gold:[800,1200],speed:1,verb:'smites',ranged:3,shot:'a bolt of red fire',boss:true}});

const DS_OL='#2a1808';
function dsScorpion(atk){
  return mkCanvas(180,140,(x)=>{
    const r=abRng(atk?91:19);
    x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(90,128,62,8,0,0,TAU);x.fill();
    const body=x.createRadialGradient(80,82,4,90,92,52);body.addColorStop(0,'#e0b468');body.addColorStop(.6,'#b8843c');body.addColorStop(1,'#6e4a1e');
    x.lineJoin='round';x.lineCap='round';
    // legs: four a side, each with a knee
    for(const sd of [-1,1])for(let i=0;i<4;i++){
      const bx=90+sd*(16+i*5),by=96+i*5,kx=bx+sd*(26+i*3),ky=by-8-i*2+(atk?-4:0),fx=kx+sd*(14+i*2),fy=122+(i%2)*2;
      x.strokeStyle=DS_OL;x.lineWidth=7.5;x.beginPath();x.moveTo(bx,by);x.lineTo(kx,ky);x.lineTo(fx,fy);x.stroke();
      x.strokeStyle='#a87838';x.lineWidth=4.4;x.beginPath();x.moveTo(bx,by);x.lineTo(kx,ky);x.lineTo(fx,fy);x.stroke();
    }
    // the tail: segments rising behind and curling over the back to the stinger
    const tp=[];for(let i=0;i<=9;i++){const t=i/9,ang=-.5+t*3.3,rad=46-8*Math.sin(t*3.1);tp.push([90+Math.sin(ang)*rad*(atk?.62:.85)+(atk?0:t*10),(atk?76:70)-Math.cos(ang)*(atk?60:48)*(.4+.6*(1-t*.2))])}
    tp.forEach((p,i)=>{const rr=11-i*.55;x.fillStyle=DS_OL;x.beginPath();x.arc(p[0],p[1],rr+2.2,0,TAU);x.fill();const g=x.createRadialGradient(p[0]-3,p[1]-3,1,p[0],p[1],rr);g.addColorStop(0,'#e8c078');g.addColorStop(1,'#a06c2c');x.fillStyle=g;x.beginPath();x.arc(p[0],p[1],rr,0,TAU);x.fill()});
    const tl=tp[tp.length-1];x.fillStyle=DS_OL;x.beginPath();x.moveTo(tl[0]-6,tl[1]);x.quadraticCurveTo(tl[0]+2,tl[1]+18,tl[0]+14,tl[1]+26);x.quadraticCurveTo(tl[0]+8,tl[1]+8,tl[0]+7,tl[1]);x.closePath();x.fill();
    x.fillStyle='#c0301c';x.beginPath();x.moveTo(tl[0]-3,tl[1]+1);x.quadraticCurveTo(tl[0]+3,tl[1]+14,tl[0]+11,tl[1]+22);x.quadraticCurveTo(tl[0]+6,tl[1]+8,tl[0]+5,tl[1]+1);x.closePath();x.fill();
    // the body: a plated oval
    x.fillStyle=body;x.strokeStyle=DS_OL;x.lineWidth=3;x.beginPath();x.ellipse(90,92,40,30,0,0,TAU);x.fill();x.stroke();
    x.strokeStyle='rgba(60,36,12,.6)';x.lineWidth=2;for(let i=0;i<4;i++){x.beginPath();x.ellipse(90,92+i*3,36-i*6,24-i*4,0,Math.PI*.1,Math.PI*.9);x.stroke()}
    x.fillStyle='rgba(255,236,170,.4)';x.beginPath();x.ellipse(78,80,16,8,-.4,0,TAU);x.fill();
    // eyes
    x.fillStyle='#120c06';for(const sd of [-1,1]){x.beginPath();x.arc(90+sd*9,76,3.6,0,TAU);x.fill();x.fillStyle='#fff6c0';x.fillRect(90+sd*9-1,74,1.6,1.6);x.fillStyle='#120c06'}
    // the claws: an arm, then two curved prongs that open when it strikes
    for(const sd of [-1,1]){
      const sx=90+sd*30,sy=80,ex=90+sd*(atk?60:54),ey=atk?46:56;
      x.strokeStyle=DS_OL;x.lineWidth=11;x.beginPath();x.moveTo(sx,sy);x.quadraticCurveTo(sx+sd*14,sy-18,ex,ey);x.stroke();x.strokeStyle='#b8843c';x.lineWidth=7;x.beginPath();x.moveTo(sx,sy);x.quadraticCurveTo(sx+sd*14,sy-18,ex,ey);x.stroke();
      const open=atk?.6:.22;
      for(const k of [-1,1]){const a=-Math.PI/2+k*open*sd,len=30;x.fillStyle=DS_OL;x.beginPath();x.moveTo(ex-4,ey+4);x.quadraticCurveTo(ex+Math.cos(a)*len*.6-sd*k*12,ey+Math.sin(a)*len*.6,ex+Math.cos(a+sd*k*.5)*len,ey+Math.sin(a+sd*k*.5)*len);x.quadraticCurveTo(ex+Math.cos(a)*len*.5+sd*k*8,ey+Math.sin(a)*len*.5+4,ex+4,ey+6);x.closePath();x.fill();
        x.fillStyle='#d8a458';x.beginPath();x.moveTo(ex-3,ey+3);x.quadraticCurveTo(ex+Math.cos(a)*len*.6-sd*k*10,ey+Math.sin(a)*len*.6+2,ex+Math.cos(a+sd*k*.5)*len*.92,ey+Math.sin(a+sd*k*.5)*len*.92);x.quadraticCurveTo(ex+Math.cos(a)*len*.5+sd*k*6,ey+Math.sin(a)*len*.5+5,ex+3,ey+5);x.closePath();x.fill()}
      x.fillStyle='#a87838';x.beginPath();x.arc(ex,ey+4,8,0,TAU);x.fill();x.strokeStyle=DS_OL;x.lineWidth=2.2;x.stroke();
    }
  });
}
function dsMummy(atk){
  return mkCanvas(120,200,(x)=>{
    const r=abRng(atk?31:13);
    x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(60,190,36,6,0,0,TAU);x.fill();
    const wraps=['#d8c8a0','#c8b88c','#e4d8b4','#b8a47a'];
    const wrap=(path,tilt)=>{ // a limb or body wound with strips of cloth
      x.save();path();x.clip();x.fillStyle='#b8a47a';x.fillRect(0,0,120,200);
      for(let i=-4;i<60;i++){const yy=i*5+(r()*3);x.fillStyle=wraps[(r()*4)|0];x.beginPath();x.moveTo(-10,yy+tilt*20);x.lineTo(130,yy-tilt*20);x.lineTo(130,yy-tilt*20+4+r()*3);x.lineTo(-10,yy+tilt*20+4+r()*3);x.closePath();x.fill();x.strokeStyle='rgba(60,44,20,.45)';x.lineWidth=.8;x.stroke()}
      x.restore();path();x.strokeStyle=DS_OL;x.lineWidth=2.4;x.stroke();
    };
    // legs
    for(const sd of [-1,1])wrap(()=>{x.beginPath();x.moveTo(60+sd*4,118);x.lineTo(60+sd*24,118);x.lineTo(60+sd*21,184);x.lineTo(60+sd*5,184);x.closePath()},sd*.15);
    // torso
    wrap(()=>{x.beginPath();x.moveTo(34,62);x.quadraticCurveTo(30,92,40,124);x.lineTo(80,124);x.quadraticCurveTo(90,92,86,62);x.quadraticCurveTo(60,52,34,62);x.closePath()},.2);
    // arms: hanging, or thrust out to seize
    for(const sd of [-1,1]){
      wrap(()=>{x.beginPath();if(atk){x.moveTo(60+sd*24,68);x.lineTo(60+sd*30,60);x.lineTo(60+sd*46,40);x.lineTo(60+sd*38,30);x.lineTo(60+sd*20,54)}else{x.moveTo(60+sd*24,66);x.lineTo(60+sd*34,70);x.lineTo(60+sd*40,128);x.lineTo(60+sd*30,130);x.lineTo(60+sd*22,84)}x.closePath()},sd*.3);
      x.strokeStyle='#e4d8b4';x.lineWidth=2.4;for(let k=0;k<3;k++){x.beginPath();const bx=60+sd*(atk?44:38),by=atk?30:128;x.moveTo(bx,by);x.quadraticCurveTo(bx+sd*6,by+(atk?-12:10),bx+sd*(10+k*3),by+(atk?-18:22+k*4));x.stroke()}
    }
    // the head: wound too, with two points of cold light
    wrap(()=>{x.beginPath();x.ellipse(60,38,20,25,0,0,TAU)},-.25);
    x.fillStyle='#0a0806';x.beginPath();x.ellipse(51,36,5.5,3.8,.2,0,TAU);x.ellipse(69,36,5.5,3.8,-.2,0,TAU);x.fill();
    x.fillStyle='#d8ff70';x.beginPath();x.arc(51,36,2.2,0,TAU);x.arc(69,36,2.2,0,TAU);x.fill();
    if(atk){x.fillStyle='#0a0806';x.beginPath();x.ellipse(60,50,6,7,0,0,TAU);x.fill()}
    // loose strips trailing
    x.strokeStyle='#d8c8a0';x.lineWidth=3;for(const [bx,by,dx] of [[40,100,-10],[78,108,12],[50,150,-8],[70,160,10]]){x.beginPath();x.moveTo(bx,by);x.quadraticCurveTo(bx+dx,by+14,bx+dx*1.4,by+30);x.stroke()}
  });
}
function dsNomad(atk){
  return mkCanvas(110,190,(x)=>{
    x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(55,182,32,6,0,0,TAU);x.fill();
    x.lineJoin='round';x.lineCap='round';
    // the robe, torn at the hem and stained with dust
    const g=x.createLinearGradient(20,0,90,0);g.addColorStop(0,'#c8a870');g.addColorStop(.5,'#a88450');g.addColorStop(1,'#6a5030');
    x.fillStyle=g;x.strokeStyle=DS_OL;x.lineWidth=2.6;x.beginPath();x.moveTo(40,58);x.lineTo(70,58);x.lineTo(86,176);x.lineTo(78,170);x.lineTo(72,178);x.lineTo(62,170);x.lineTo(54,178);x.lineTo(46,170);x.lineTo(38,178);x.lineTo(30,172);x.lineTo(24,176);x.closePath();x.fill();x.stroke();
    x.fillStyle='rgba(60,40,18,.35)';for(let i=0;i<9;i++)x.fillRect(32+((i*17)%44),100+((i*29)%70),5+(i%3)*4,2);
    x.fillStyle='#4a3420';x.fillRect(38,98,34,6);x.strokeRect(38,98,34,6); // a rope belt
    // a ragged cloak over one shoulder
    x.fillStyle='#7a5a34';x.beginPath();x.moveTo(36,60);x.lineTo(20,70);x.lineTo(14,140);x.lineTo(26,150);x.lineTo(34,100);x.closePath();x.fill();x.stroke();
    // arms
    x.strokeStyle=DS_OL;x.lineWidth=11;x.beginPath();x.moveTo(40,64);x.lineTo(atk?22:30,atk?30:100);x.stroke();x.strokeStyle='#a88450';x.lineWidth=7;x.beginPath();x.moveTo(40,64);x.lineTo(atk?22:30,atk?30:100);x.stroke();
    x.strokeStyle=DS_OL;x.lineWidth=11;x.beginPath();x.moveTo(70,64);x.lineTo(84,100);x.stroke();x.strokeStyle='#a88450';x.lineWidth=7;x.beginPath();x.moveTo(70,64);x.lineTo(84,100);x.stroke();
    // a curved knife, raised when he strikes
    const kx=atk?22:30,ky=atk?30:100;x.save();x.translate(kx,ky);x.rotate(atk?-.35:.5);x.fillStyle='#d8dce4';x.strokeStyle=DS_OL;x.lineWidth=1.8;x.beginPath();x.moveTo(-2,0);x.quadraticCurveTo(14,-8,10,-34);x.quadraticCurveTo(2,-20,-5,-6);x.closePath();x.fill();x.stroke();x.fillStyle='#4a3420';x.fillRect(-4,-1,8,10);x.restore();
    x.fillStyle='#c89868';x.beginPath();x.arc(kx,ky+2,5,0,TAU);x.fill();x.beginPath();x.arc(84,102,5,0,TAU);x.fill();
    // the head, wrapped in a dusty scarf with wild eyes and sunburnt skin between
    x.fillStyle='#d8c8a0';x.strokeStyle=DS_OL;x.lineWidth=2.4;x.beginPath();x.ellipse(55,40,19,22,0,0,TAU);x.fill();x.stroke();
    x.fillStyle='#b8845a';x.fillRect(40,34,30,10);x.fillStyle='#17110a';x.beginPath();x.ellipse(48,38,3.4,2.6,0,0,TAU);x.ellipse(62,38,3.4,2.6,0,0,TAU);x.fill();x.fillStyle='#fff';x.fillRect(47,37,1.6,1.6);x.fillRect(61,37,1.6,1.6);
    x.strokeStyle='#8a6a40';x.lineWidth=1.4;for(let i=0;i<5;i++){x.beginPath();x.moveTo(38,22+i*5);x.quadraticCurveTo(55,26+i*5,72,22+i*5);x.stroke()}
    x.fillStyle='#a88450';x.beginPath();x.moveTo(40,52);x.quadraticCurveTo(55,66,70,52);x.lineTo(66,60);x.lineTo(44,60);x.closePath();x.fill();
  });
}
function dsSut(atk){
  return mkCanvas(260,320,(x)=>{
    x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(130,308,86,10,0,0,TAU);x.fill();
    x.lineJoin='round';x.lineCap='round';
    const red=x.createLinearGradient(0,60,0,300);red.addColorStop(0,'#b8442a');red.addColorStop(1,'#6e1e12');
    // legs and the gold kilt
    for(const sd of [-1,1]){x.fillStyle=red;x.strokeStyle=DS_OL;x.lineWidth=3;x.beginPath();x.moveTo(130+sd*8,206);x.lineTo(130+sd*46,206);x.lineTo(130+sd*42,298);x.lineTo(130+sd*10,298);x.closePath();x.fill();x.stroke();
      x.fillStyle='#e0b038';x.fillRect(130+sd*(sd<0?10:10)-(sd<0?0:0)-(sd<0?0:0),282,0,0)}
    const kg=x.createLinearGradient(80,0,180,0);kg.addColorStop(0,'#a87818');kg.addColorStop(.5,'#f0cc58');kg.addColorStop(1,'#a87818');
    x.fillStyle=kg;x.beginPath();x.moveTo(84,176);x.lineTo(176,176);x.lineTo(188,244);x.lineTo(72,244);x.closePath();x.fill();x.stroke();
    x.strokeStyle='rgba(60,36,8,.6)';x.lineWidth=1.6;for(let i=0;i<7;i++){x.beginPath();x.moveTo(90+i*13,178);x.lineTo(80+i*16,242);x.stroke()}
    x.fillStyle='#1e3a8a';x.fillRect(84,176,92,10);x.fillStyle='#b02a2a';for(let i=0;i<8;i++)x.fillRect(88+i*11,178,6,6);
    // torso and arms
    x.fillStyle=red;x.strokeStyle=DS_OL;x.lineWidth=3;x.beginPath();x.moveTo(78,86);x.quadraticCurveTo(130,72,182,86);x.lineTo(176,180);x.lineTo(84,180);x.closePath();x.fill();x.stroke();
    x.strokeStyle='rgba(30,6,4,.5)';x.lineWidth=2;x.beginPath();x.moveTo(130,96);x.lineTo(130,176);x.moveTo(98,120);x.quadraticCurveTo(114,134,130,128);x.moveTo(162,120);x.quadraticCurveTo(146,134,130,128);x.stroke();
    for(const sd of [-1,1]){
      const up=atk&&sd>0;x.strokeStyle=DS_OL;x.lineWidth=26;x.beginPath();x.moveTo(130+sd*50,98);x.lineTo(130+sd*(up?78:84),up?44:142);x.lineTo(130+sd*(up?60:80),up?8:196);x.stroke();
      x.strokeStyle='#a03a22';x.lineWidth=20;x.beginPath();x.moveTo(130+sd*50,98);x.lineTo(130+sd*(up?78:84),up?44:142);x.lineTo(130+sd*(up?60:80),up?8:196);x.stroke();
      x.fillStyle='#e0b038';x.beginPath();x.arc(130+sd*(up?78:84),up?44:142,12,0,TAU);x.fill();x.strokeStyle=DS_OL;x.lineWidth=2;x.stroke();
    }
    // the broad collar: gold, blue and red
    for(const [rr,col] of [[58,'#e0b038'],[48,'#1e3a8a'],[38,'#b02a2a'],[28,'#e0b038']]){x.fillStyle=col;x.strokeStyle=DS_OL;x.lineWidth=1.6;x.beginPath();x.ellipse(130,96,rr,rr*.42,0,0,Math.PI);x.lineTo(130+rr,92);x.lineTo(130-rr,92);x.closePath();x.fill();x.stroke()}
    // the was sceptre in the left hand (the forked foot, the long staff, the jackal head)
    const sx=130-80,top=atk?0:44;x.strokeStyle=DS_OL;x.lineWidth=9;x.beginPath();x.moveTo(sx,300);x.lineTo(sx,top+20);x.stroke();x.strokeStyle='#e0b038';x.lineWidth=5.4;x.beginPath();x.moveTo(sx,300);x.lineTo(sx,top+20);x.stroke();
    x.strokeStyle=DS_OL;x.lineWidth=6;x.beginPath();x.moveTo(sx,296);x.lineTo(sx-12,310);x.moveTo(sx,296);x.lineTo(sx+12,310);x.stroke();
    x.fillStyle='#e0b038';x.beginPath();x.moveTo(sx-9,top+26);x.lineTo(sx-14,top+4);x.lineTo(sx-2,top+12);x.lineTo(sx+14,top-2);x.lineTo(sx+12,top+24);x.closePath();x.fill();x.strokeStyle=DS_OL;x.lineWidth=2;x.stroke();
    // flames in the raised hand
    if(atk){const fx=130+60,fy=-2;const fg=x.createRadialGradient(fx,fy+16,2,fx,fy+10,34);fg.addColorStop(0,'#fff2a0');fg.addColorStop(.4,'#ff9a30');fg.addColorStop(1,'rgba(200,40,10,0)');x.fillStyle=fg;x.beginPath();x.arc(fx,fy+10,34,0,TAU);x.fill()}
    // the head of Set: a long down-curved snout, tall square ears, slanted red eyes
    x.fillStyle='#8a2a1a';x.strokeStyle=DS_OL;x.lineWidth=3;
    x.beginPath();x.moveTo(98,64);x.lineTo(92,14);x.lineTo(112,8);x.lineTo(118,40);x.lineTo(142,40);x.lineTo(148,8);x.lineTo(168,14);x.lineTo(162,64);x.quadraticCurveTo(160,86,140,92);x.quadraticCurveTo(130,112,128,120);x.quadraticCurveTo(122,92,112,92);x.quadraticCurveTo(100,86,98,64);x.closePath();x.fill();x.stroke();
    x.fillStyle='#6a1a10';x.beginPath();x.moveTo(112,70);x.quadraticCurveTo(130,64,148,70);x.quadraticCurveTo(140,92,132,120);x.quadraticCurveTo(126,92,112,70);x.closePath();x.fill();
    x.fillStyle='#17090a';x.beginPath();x.moveTo(104,52);x.lineTo(122,58);x.lineTo(118,66);x.lineTo(104,60);x.closePath();x.fill();x.beginPath();x.moveTo(156,52);x.lineTo(138,58);x.lineTo(142,66);x.lineTo(156,60);x.closePath();x.fill();
    x.fillStyle='#ff4a2a';x.beginPath();x.arc(114,60,3,0,TAU);x.arc(146,60,3,0,TAU);x.fill();
    x.fillStyle='#e0b038';x.fillRect(96,30,68,7);x.strokeRect(96,30,68,7);x.fillStyle='#b02a2a';x.beginPath();x.arc(130,33,5,0,TAU);x.fill(); // a gold band round the brow
    if(atk){x.fillStyle='#17090a';x.beginPath();x.ellipse(128,106,6,9,0,0,TAU);x.fill()}
  });
}
function makeDesertCreatures(){
  IMG.scorpion=dsScorpion(false);IMG.scorpionA=dsScorpion(true);
  IMG.mummy=dsMummy(false);IMG.mummyA=dsMummy(true);
  IMG.nomad=dsNomad(false);IMG.nomadA=dsNomad(true);
  IMG.sut=dsSut(false);IMG.sutA=dsSut(true);
}
function makeDesertWolf(){ // the grey wolf, bleached by the sun (needs the wolf pictures to have loaded)
  const sand=im=>im?mkCanvas(im.width,im.height,(x,w,h)=>{x.drawImage(im,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(222,184,112,.62)';x.fillRect(0,0,w,h);x.globalCompositeOperation='lighter';x.fillStyle='rgba(40,28,10,.35)';x.fillRect(0,0,w,h)}):null;
  if(IMG.wolf){IMG.dwolf=sand(IMG.wolf);if(IMG.wolfA)IMG.dwolfA=sand(IMG.wolfA)}
}
