/* ==========================================================================
   THE SAND ROAD: pictures for the open desert: palms, dunes, rocks, cacti, bones, the sphinx, the far city
   ========================================================================== */
const DS_PALMG=['#1f5a24','#2f7a2c','#4a9a38','#6cb848'];
function dsPalm(w,h,seed,lean,fronds,trunkW){
  return mkCanvas(w,h,(x)=>{
    const r=abRng(seed),cx0=w/2+lean*.1,topX=w/2+lean,topY=h*.3;
    x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.ellipse(w/2,h-6,w*.2,7,0,0,TAU);x.fill();
    // trunk: a tapering curve, ringed like the scars of old fronds
    const pts=[];for(let i=0;i<=24;i++){const t=i/24,px=cx0+(topX-cx0)*t*t+Math.sin(t*3)*lean*.05,py=h-8-(h-8-topY)*t;pts.push([px,py,trunkW*(1-.4*t)])}
    const g=x.createLinearGradient(w/2-trunkW,0,w/2+trunkW,0);g.addColorStop(0,'#8a6a40');g.addColorStop(.5,'#b08a54');g.addColorStop(1,'#5e4426');
    x.fillStyle=g;x.beginPath();pts.forEach((p,i)=>x[i?'lineTo':'moveTo'](p[0]-p[2]/2,p[1]));for(let i=pts.length-1;i>=0;i--)x.lineTo(pts[i][0]+pts[i][2]/2,pts[i][1]);x.closePath();x.fill();
    x.strokeStyle='#2c1c0c';x.lineWidth=1.6;x.stroke();
    x.strokeStyle='rgba(40,26,10,.55)';x.lineWidth=1.3;for(let i=1;i<pts.length;i++){const p=pts[i];x.beginPath();x.moveTo(p[0]-p[2]/2,p[1]);x.quadraticCurveTo(p[0],p[1]+3,p[0]+p[2]/2,p[1]);x.stroke()}
    // fronds: long curved ribs with leaflets
    for(let k=0;k<fronds;k++){
      const a=-Math.PI*(.06+.88*k/(fronds-1))+(r()-.5)*.25,len=w*(.42+r()*.16),droop=.5+r()*.6;
      const ex=topX+Math.cos(a)*len,ey=topY+Math.sin(a)*len*.55+len*droop*.45,mx=topX+Math.cos(a)*len*.5,my=topY+Math.sin(a)*len*.7;
      x.strokeStyle='#245a22';x.lineWidth=2.6;x.beginPath();x.moveTo(topX,topY);x.quadraticCurveTo(mx,my,ex,ey);x.stroke();
      for(let i=1;i<=12;i++){const t=i/12,px=(1-t)*(1-t)*topX+2*(1-t)*t*mx+t*t*ex,py=(1-t)*(1-t)*topY+2*(1-t)*t*my+t*t*ey,ll=(1-t*.55)*w*.13;
        for(const sd of [-1,1]){const aa=Math.atan2(ey-topY,ex-topX)+sd*(1.0-t*.35);x.strokeStyle=DS_PALMG[(r()*4)|0];x.lineWidth=2.2-t*.9;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(aa)*ll,py+Math.sin(aa)*ll+ll*.3);x.stroke()}}
    }
    x.fillStyle='#6a3a1a';for(let i=0;i<6;i++){x.beginPath();x.arc(topX+(r()-.5)*14,topY+4+r()*9,3+r()*1.6,0,TAU);x.fill()} // a cluster of dates
    x.fillStyle='#8a5a2a';x.beginPath();x.arc(topX,topY+1,5.5,0,TAU);x.fill();
  });
}
function dsDune(w,h,seed,pal){ // a long, soft mound of sand: gentle on the windward side, steeper in its lee, ripples following the slope
  return mkCanvas(w,h,(x)=>{
    const r=abRng(seed),pk=.3+r()*.4,amp=h*(.74+r()*.12),base=h-3,N=48;
    const f=t=>{const u=t<pk?.5*t/pk:.5+.5*(t-pk)/(1-pk);return Math.pow(Math.sin(Math.PI*u),1.25)};
    const ytop=i=>base-amp*f(i/N)+Math.sin(i*.7+seed)*1.2;
    const outline=()=>{x.beginPath();x.moveTo(0,h);for(let i=0;i<=N;i++)x.lineTo(i/N*w,ytop(i));x.lineTo(w,h);x.closePath()};
    outline();const g=x.createLinearGradient(0,h-amp,w,h);g.addColorStop(0,pal[0]);g.addColorStop(.5,pal[1]);g.addColorStop(1,pal[2]);x.fillStyle=g;x.fill();
    x.save();outline();x.clip();
    // the lee side, in shadow, with a soft edge at the crest
    const lx=pk*w,sh=x.createLinearGradient(lx-8,0,lx+w*.18,0);sh.addColorStop(0,'rgba(80,48,22,0)');sh.addColorStop(1,'rgba(80,48,22,.5)');x.fillStyle=sh;x.fillRect(lx-8,0,w,h);
    // ripples that follow the shape of the dune
    for(let k=1;k<=9;k++){const off=k*h*.075;x.strokeStyle=k%2?'rgba(255,248,222,.26)':'rgba(96,60,28,.2)';x.lineWidth=1.5;x.beginPath();for(let i=0;i<=N;i++){const px=i/N*w,py=ytop(i)+off+Math.sin(i*.5+k*2.1)*2.2;if(i)x.lineTo(px,py);else x.moveTo(px,py)}x.stroke()}
    for(let i=0;i<110;i++){x.fillStyle=r()<.5?'rgba(255,244,214,.3)':'rgba(90,56,26,.22)';x.fillRect(r()*w,h*.2+r()*h*.8,1+r()*2,1)}
    const hl=x.createLinearGradient(0,h-amp,0,h);hl.addColorStop(0,'rgba(255,250,226,.38)');hl.addColorStop(.35,'rgba(255,250,226,0)');x.fillStyle=hl;x.fillRect(0,0,w,h);
    x.restore();
    x.strokeStyle='rgba(255,250,226,.55)';x.lineWidth=2;x.beginPath();for(let i=Math.floor(N*pk*.35);i<=Math.floor(N*(pk+.04));i++){const px=i/N*w,py=ytop(i)+1;if(i===Math.floor(N*pk*.35))x.moveTo(px,py);else x.lineTo(px,py)}x.stroke(); // the lit crest
  });
}
const DS_YEL=['#f4dea0','#e2bc78','#b98c54','#9a7040','#6a4a28'],DS_RED=['#e0906a','#c4623e','#8e3c26','#6e2a1a','#4a1a10'];
function dsRock(w,h,seed,pal){
  return mkCanvas(w,h,(x)=>{
    const r=abRng(seed);
    x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(w/2,h-6,w*.42,6,0,0,TAU);x.fill();
    const pts=[[w*.08,h-8],[w*.04,h*.6],[w*.2,h*.28],[w*.46,h*.1],[w*.74,h*.2],[w*.94,h*.52],[w*.92,h-8]];
    const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,pal[0]);g.addColorStop(.5,pal[1]);g.addColorStop(1,pal[2]);
    x.fillStyle=g;x.beginPath();pts.forEach((p,i)=>x[i?'lineTo':'moveTo'](p[0]+(r()-.5)*5,p[1]));x.closePath();x.fill();
    x.save();x.clip();
    for(let i=0;i<6;i++){const yy=h*.2+i*h*.13;x.strokeStyle=i%2?'rgba(60,36,16,.3)':'rgba(255,240,200,.22)';x.lineWidth=2;x.beginPath();x.moveTo(0,yy);x.lineTo(w,yy+r()*8-4);x.stroke()}
    x.fillStyle=pal[3];x.globalAlpha=.4;x.beginPath();x.moveTo(w*.55,h*.1);x.lineTo(w*.94,h*.52);x.lineTo(w*.92,h-8);x.lineTo(w*.6,h-8);x.closePath();x.fill();x.globalAlpha=1;
    x.restore();x.strokeStyle=pal[4];x.lineWidth=2;x.beginPath();pts.forEach((p,i)=>x[i?'lineTo':'moveTo'](p[0],p[1]));x.closePath();x.stroke();
  });
}
function dsCactus(){
  return mkCanvas(80,160,(x)=>{
    x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.ellipse(40,152,22,5,0,0,TAU);x.fill();
    const arm=(ax,ay,bx,by,w)=>{x.lineCap='round';x.strokeStyle='#2a5a2a';x.lineWidth=w+4;x.beginPath();x.moveTo(ax,ay);x.quadraticCurveTo(bx,ay,bx,by);x.stroke();x.strokeStyle='#4a8a3a';x.lineWidth=w;x.beginPath();x.moveTo(ax,ay);x.quadraticCurveTo(bx,ay,bx,by);x.stroke()};
    x.fillStyle='#2a5a2a';x.beginPath();x.roundRect(28,20,24,130,12);x.fill();const g=x.createLinearGradient(28,0,52,0);g.addColorStop(0,'#5aa04a');g.addColorStop(.5,'#3f7a34');g.addColorStop(1,'#2c5a28');x.fillStyle=g;x.beginPath();x.roundRect(30,22,20,126,10);x.fill();
    arm(30,90,12,56,13);arm(50,76,68,40,13);
    x.strokeStyle='rgba(20,50,20,.5)';x.lineWidth=1.2;for(const px of [35,40,45]){x.beginPath();x.moveTo(px,26);x.lineTo(px,146);x.stroke()}
    x.fillStyle='#f0e8c0';for(let i=0;i<28;i++){x.fillRect(31+((i*13)%18),28+((i*29)%116),1.5,1.5)}
    x.fillStyle='#e8607a';x.beginPath();x.arc(40,20,4,0,TAU);x.fill();x.beginPath();x.arc(12,54,3,0,TAU);x.fill();
  });
}
function dsDeadTree(){
  return mkCanvas(120,180,(x)=>{
    const r=abRng(55);x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(60,172,30,6,0,0,TAU);x.fill();
    const br=(x0,y0,a,len,wd)=>{if(wd<1.2||len<8)return;const x1=x0+Math.cos(a)*len,y1=y0+Math.sin(a)*len;x.strokeStyle='#4a3a2a';x.lineWidth=wd+2;x.lineCap='round';x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke();x.strokeStyle='#c8b894';x.lineWidth=wd;x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke();br(x1,y1,a-.5-r()*.4,len*.7,wd*.68);br(x1,y1,a+.45+r()*.4,len*.68,wd*.62)};
    br(60,170,-Math.PI/2+.06,60,10);
  });
}
function dsBones(){
  return mkCanvas(110,56,(x)=>{
    x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(55,48,40,5,0,0,TAU);x.fill();
    x.strokeStyle='#f0e6c8';x.lineCap='round';x.lineWidth=4;for(let i=0;i<5;i++){x.beginPath();x.moveTo(24+i*14,30);x.quadraticCurveTo(28+i*14,10,44+i*10,16);x.stroke()}
    x.lineWidth=5;x.beginPath();x.moveTo(20,32);x.lineTo(92,32);x.stroke();
    x.fillStyle='#f0e6c8';x.beginPath();x.arc(90,24,11,0,TAU);x.fill();x.fillStyle='#2a1c10';x.beginPath();x.arc(86,22,2.8,0,TAU);x.arc(94,22,2.8,0,TAU);x.fill();x.fillRect(88,28,4,5);
    x.strokeStyle='#cbbf9c';x.lineWidth=1;x.beginPath();x.arc(90,24,11,0,TAU);x.stroke();
  });
}
function dsShrub(seed){
  return mkCanvas(70,50,(x)=>{
    const r=abRng(seed);x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(35,44,22,4,0,0,TAU);x.fill();
    for(let i=0;i<22;i++){const bx=35+(r()-.5)*40,a=-Math.PI/2+(r()-.5)*1.6,len=14+r()*22;x.strokeStyle=['#8a7a3a','#a8984a','#6a5a28'][(r()*3)|0];x.lineWidth=1.6;x.beginPath();x.moveTo(bx*.5+17,44);x.quadraticCurveTo(bx,44-len*.6,bx+Math.cos(a)*len*.4,44-len);x.stroke()}
  });
}
function dsObelisk(){
  return mkCanvas(72,240,(x)=>{
    x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(36,232,26,6,0,0,TAU);x.fill();
    const g=x.createLinearGradient(14,0,58,0);g.addColorStop(0,'#c8a870');g.addColorStop(.55,'#a88850');g.addColorStop(1,'#6a5030');
    x.fillStyle=g;x.beginPath();x.moveTo(14,226);x.lineTo(20,40);x.lineTo(36,8);x.lineTo(52,40);x.lineTo(58,226);x.closePath();x.fill();x.strokeStyle='#2a1c0c';x.lineWidth=2;x.stroke();
    x.fillStyle='#e0b038';x.beginPath();x.moveTo(30,40);x.lineTo(36,8);x.lineTo(42,40);x.closePath();x.fill();
    for(let i=0;i<7;i++)dsGlyph(x,36,64+i*24,.6,(i*3)%7);
    x.fillStyle='#8a7048';x.fillRect(8,222,56,12);x.strokeRect(8,222,56,12);
  });
}
function dsSphinx(){
  return mkCanvas(340,210,(x)=>{
    x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(170,198,150,9,0,0,TAU);x.fill();
    const ol='#2a1c0c',g=x.createLinearGradient(0,40,0,200);g.addColorStop(0,'#d8b878');g.addColorStop(1,'#a07c44');x.fillStyle=g;x.strokeStyle=ol;x.lineWidth=2.5;
    // the long lion body lying down, haunches to the left, paws out to the right
    x.beginPath();x.moveTo(14,198);x.quadraticCurveTo(10,120,60,96);x.quadraticCurveTo(130,84,190,100);x.lineTo(220,120);x.lineTo(222,198);x.closePath();x.fill();x.stroke();
    x.beginPath();x.moveTo(200,150);x.lineTo(332,152);x.quadraticCurveTo(338,182,326,198);x.lineTo(200,198);x.closePath();x.fill();x.stroke();
    x.strokeStyle='rgba(60,36,16,.5)';x.lineWidth=1.6;for(const px of [286,306]){x.beginPath();x.moveTo(px,160);x.lineTo(px,196);x.stroke()}
    // the head: the royal headcloth, striped, with a calm face
    x.fillStyle='#caa464';x.strokeStyle=ol;x.lineWidth=2.5;x.beginPath();x.moveTo(176,102);x.lineTo(184,36);x.quadraticCurveTo(222,10,262,36);x.lineTo(272,110);x.lineTo(250,134);x.lineTo(196,134);x.closePath();x.fill();x.stroke();
    x.fillStyle='#3a62b8';for(let i=0;i<6;i++){x.fillRect(186,42+i*12,12,6);x.fillRect(250,42+i*12,12,6)}
    x.fillStyle='#e0b038';for(let i=0;i<6;i++){x.fillRect(186,48+i*12,12,6);x.fillRect(250,48+i*12,12,6)}
    x.fillStyle='#d8b878';x.beginPath();x.ellipse(224,78,26,34,0,0,TAU);x.fill();x.stroke();
    x.fillStyle='#17120e';x.fillRect(208,68,12,4);x.fillRect(228,68,12,4);x.beginPath();x.moveTo(224,74);x.lineTo(220,92);x.lineTo(228,92);x.closePath();x.fill();x.fillRect(214,102,20,3);
    x.fillStyle='#e0b038';x.beginPath();x.moveTo(214,28);x.lineTo(224,4);x.lineTo(234,28);x.closePath();x.fill();x.stroke(); // the cobra on the brow
    x.strokeStyle='rgba(255,246,210,.3)';x.lineWidth=2;x.beginPath();x.moveTo(40,120);x.quadraticCurveTo(110,100,180,112);x.stroke();
  });
}
function dsCity(){ // a great city far off in the haze: walls, domes, minarets and a stepped temple
  return mkCanvas(900,300,(x,W,H)=>{
    const r=abRng(909);
    const col=(a)=>'rgba('+(200+a)+','+(176+a)+','+(138+a)+',1)';
    const hz=x.createLinearGradient(0,0,0,H);hz.addColorStop(0,'rgba(255,236,190,0)');hz.addColorStop(1,'rgba(255,226,170,.45)');
    // long wall with towers
    x.fillStyle='#c8a870';x.fillRect(0,H-70,W,70);x.strokeStyle='#5a4226';x.lineWidth=2;x.strokeRect(0,H-70,W,70);
    for(let i=0;i<W;i+=28){x.fillStyle='#c8a870';x.fillRect(i+4,H-82,16,14);x.strokeRect(i+4,H-82,16,14)}
    // buildings of many heights, domes and minarets
    for(let i=0;i<34;i++){
      const bw=34+r()*40,bx=i*(W/34)+r()*10,bh=60+r()*90,y0=H-70-bh*.5;
      const g=x.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,'#e8cc98');g.addColorStop(1,'#a88454');x.fillStyle=g;x.fillRect(bx,y0,bw,bh*.5+10);x.strokeStyle='#5a4226';x.lineWidth=1.6;x.strokeRect(bx,y0,bw,bh*.5+10);
      if(r()<.5){x.fillStyle=['#2f6ab8','#d8a838','#e8d8b0'][(r()*3)|0];x.beginPath();x.ellipse(bx+bw/2,y0,bw*.45,bw*.5,0,Math.PI,0);x.fill();x.stroke();x.fillStyle='#e0b038';x.fillRect(bx+bw/2-1,y0-bw*.5-12,2,12)}
      else if(r()<.4){x.fillStyle='#d8bc88';x.fillRect(bx+bw/2-5,y0-bh*.45,10,bh*.45);x.strokeRect(bx+bw/2-5,y0-bh*.45,10,bh*.45);x.beginPath();x.moveTo(bx+bw/2-7,y0-bh*.45);x.lineTo(bx+bw/2,y0-bh*.45-18);x.lineTo(bx+bw/2+7,y0-bh*.45);x.closePath();x.fillStyle='#2f6ab8';x.fill();x.stroke()}
      for(let k=0;k<3;k++){x.fillStyle='rgba(40,28,16,.55)';x.fillRect(bx+6+k*(bw/3.2),y0+12,5,9)}
    }
    // a stepped temple and a golden pyramid-roofed hall in the middle
    let tw=240,ty=H-70;for(let s=0;s<5;s++){const w2=tw-s*40;x.fillStyle=s%2?'#d8b878':'#e8cc98';x.fillRect(W/2-w2/2,ty-s*26-26,w2,26);x.strokeStyle='#5a4226';x.strokeRect(W/2-w2/2,ty-s*26-26,w2,26)}
    x.fillStyle='#e8b838';x.beginPath();x.moveTo(W/2-40,ty-130);x.lineTo(W/2,ty-190);x.lineTo(W/2+40,ty-130);x.closePath();x.fill();x.stroke();
    x.fillStyle='#17120e';x.fillRect(W/2-14,ty-30,28,30); // the great gate
    for(const k of [-1,1]){x.fillStyle='#c8a064';x.fillRect(W/2+k*150-18,ty-190,36,190);x.strokeRect(W/2+k*150-18,ty-190,36,190);x.fillStyle='#e8b838';x.beginPath();x.moveTo(W/2+k*150-22,ty-190);x.lineTo(W/2+k*150,ty-230);x.lineTo(W/2+k*150+22,ty-190);x.closePath();x.fill();x.stroke()}
    x.fillStyle=hz;x.fillRect(0,0,W,H);
  });
}
function makeDesertSprites(){
  IMG.dpalm0=dsPalm(130,290,11,0,11,17);IMG.dpalm1=dsPalm(150,270,22,34,10,16);IMG.dpalm2=dsPalm(120,200,33,-20,9,13);IMG.dpalm3=dsPalm(110,150,44,10,8,10);
  NPC_H.dpalm0=2.5;NPC_H.dpalm1=2.3;NPC_H.dpalm2=1.7;NPC_H.dpalm3=1.2;
  for(let i=0;i<3;i++){
    IMG['dune'+i]=dsDune(280+i*30,110+i*18,70+i*9,DS_YEL);IMG['rdune'+i]=dsDune(280+i*30,110+i*18,170+i*9,DS_RED);
    NPC_H['dune'+i]=1.2+i*.2;NPC_H['rdune'+i]=1.2+i*.2;
    IMG['dpeb'+i]=dsDune(110,36,270+i*7,DS_YEL);IMG['rpeb'+i]=dsDune(110,36,370+i*7,DS_RED);NPC_H['dpeb'+i]=.22;NPC_H['rpeb'+i]=.22; // low ripples to scatter between the big dunes
    IMG['drock'+i]=dsRock(120+i*14,96+i*8,470+i*5,DS_YEL);IMG['rrock'+i]=dsRock(120+i*14,96+i*8,570+i*5,DS_RED);NPC_H['drock'+i]=.8+i*.1;NPC_H['rrock'+i]=.8+i*.1;
    IMG['dshrub'+i]=dsShrub(700+i);NPC_H['dshrub'+i]=.34;
  }
  IMG.dcactus=dsCactus();NPC_H.dcactus=1.1;IMG.ddead=dsDeadTree();NPC_H.ddead=1.2;IMG.dbones=dsBones();NPC_H.dbones=.3;
  IMG.dburrow=dsBurrow();NPC_H.dburrow=.62;
  IMG.dobelisk=dsObelisk();NPC_H.dobelisk=2.4;IMG.dsphinx=dsSphinx();NPC_H.dsphinx=1.9;IMG.dcity=dsCity();NPC_H.dcity=9;
}

function dsBurrow(){ // a low mound of sand, a door of old wood set into it under a stone lintel: easy to miss from far off
  const W=240,H=130,cx=120;
  return mkCanvas(W,H,(x)=>{
    {const S=pc(W,H),s=S.getContext('2d');s.fillStyle='rgba(60,36,12,.5)';s.beginPath();s.ellipse(cx,118,100,9,0,0,TAU);s.fill();x.drawImage(pBlur(S,4),0,0)}
    const sandG=t=>{const g=t.createLinearGradient(0,30,W,H);g.addColorStop(0,'#f1dca4');g.addColorStop(.5,'#dcb87a');g.addColorStop(1,'#a98450');return g};
    const mound=t=>{t.beginPath();t.moveTo(8,120);t.bezierCurveTo(14,82,52,30,cx,24);t.bezierCurveTo(188,30,226,82,232,120);t.closePath()};
    pForm(x,W,H,mound,sandG,s=>{s.fillStyle='rgba(255,248,222,.5)';s.beginPath();s.ellipse(80,52,52,16,-.4,0,TAU);s.fill();s.fillStyle='rgba(80,48,22,.45)';s.beginPath();s.ellipse(190,96,60,28,.2,0,TAU);s.fill()},
      {blur:5,rim:.35,rimW:6,grain:.12,seed:11,fine:f=>{for(let i=0;i<14;i++){f.strokeStyle=i%2?'rgba(255,248,222,.3)':'rgba(96,60,28,.22)';f.lineWidth=1.6;f.beginPath();for(let k=0;k<=10;k++){const px=10+k*22,py=40+i*6+Math.sin(k*1.1+i)*3;if(k)f.lineTo(px,py);else f.moveTo(px,py)}f.stroke()}}});
    // the stone doorway set into the mound
    const frame=t=>{t.beginPath();t.moveTo(78,122);t.lineTo(78,64);t.quadraticCurveTo(78,38,cx,36);t.quadraticCurveTo(162,38,162,64);t.lineTo(162,122);t.closePath()};
    pForm(x,W,H,frame,t=>{const g=t.createLinearGradient(78,0,162,0);g.addColorStop(0,'#cdb88e');g.addColorStop(.5,'#e4d2a8');g.addColorStop(1,'#8c7650');return g},
      s=>{s.strokeStyle='rgba(60,40,18,.6)';s.lineWidth=3;for(let i=0;i<5;i++){s.beginPath();s.moveTo(78,50+i*15);s.lineTo(162,50+i*15);s.stroke()}for(let i=0;i<4;i++){s.beginPath();s.moveTo(88+i*22,40);s.lineTo(88+i*22,122);s.stroke()}},
      {blur:2,rim:.5,rimW:6,grain:.16,seed:12,shadow:.3,sx:2,sy:3});
    const door=t=>{t.beginPath();t.moveTo(90,122);t.lineTo(90,68);t.quadraticCurveTo(90,50,cx,48);t.quadraticCurveTo(150,50,150,68);t.lineTo(150,122);t.closePath()};
    pForm(x,W,H,door,t=>{const g=t.createLinearGradient(90,0,150,0);g.addColorStop(0,'#4a3220');g.addColorStop(.5,'#6e4c2e');g.addColorStop(1,'#33220f');return g},
      s=>{for(let i=0;i<5;i++){s.strokeStyle='rgba(10,6,2,.7)';s.lineWidth=2.4;s.beginPath();s.moveTo(100+i*12,52);s.lineTo(100+i*12,122);s.stroke()}s.fillStyle='rgba(0,0,0,.45)';s.fillRect(90,48,60,14);s.fillStyle='rgba(255,220,160,.18)';s.fillRect(96,60,6,60)},
      {blur:1.6,rim:.7,rimW:8,grain:.2,seed:13,fine:f=>{f.fillStyle='#2a2218';for(const yy of [78,102]){f.fillRect(90,yy,60,6)}f.fillStyle='#8a7858';for(const yy of [78,102])for(let i=0;i<5;i++){f.beginPath();f.arc(98+i*11,yy+3,1.8,0,TAU);f.fill()}f.strokeStyle='#2a2218';f.lineWidth=3;f.beginPath();f.arc(132,98,5,0,TAU);f.stroke()}});
    // a carved sun over the door and sand drifted against the step
    x.fillStyle='#d8b848';x.beginPath();x.arc(cx,30,7,0,TAU);x.fill();x.strokeStyle='rgba(60,36,8,.7)';x.lineWidth=1.4;x.stroke();
    {const S=pc(W,H),s=S.getContext('2d');const g=s.createLinearGradient(0,104,0,128);g.addColorStop(0,'rgba(236,208,150,0)');g.addColorStop(1,'rgba(236,208,150,.95)');s.fillStyle=g;s.beginPath();s.moveTo(60,128);s.quadraticCurveTo(100,100,cx,110);s.quadraticCurveTo(150,100,184,128);s.closePath();s.fill();x.drawImage(pBlur(S,2),0,0)}
  });
}
