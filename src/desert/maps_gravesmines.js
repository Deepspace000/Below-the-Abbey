/* Area maps for the Ironhill Burial Ground (level 20) and the Ironhill Mines (level 18): see maps_common.js.
   Both are drawn from the real level rows and decor. Names start with mpGraves. */
const MPGR_SEED=2020;
const mpGravesH=(a,b,s)=>hash2(a,b,MPGR_SEED+(s||0));
/* a wobbly ink line between two points */
function mpGravesLine(x,a,b,c,d,w,col,seed){x.save();x.strokeStyle=col||MPL.INK;x.lineWidth=w||.8;x.lineCap='round';x.beginPath();const n=Math.max(2,Math.round(Math.hypot(c-a,d-b)/3));
  for(let i=0;i<=n;i++){const t=i/n,px=a+(c-a)*t+(mpGravesH(i,seed||1,3)-.5)*.9,py=b+(d-b)*t+(mpGravesH(i,seed||1,4)-.5)*.9;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();x.restore()}
/* inked edges around every cell where test(cx,cy) is true and the neighbour is not */
function mpGravesEdges(x,L,F,test,w,col){const W=L.rows[0].length,H=L.rows.length,s=F.s;
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!test(cx,cy))continue;const X0=F.X(cx),Y0=F.Y(cy),sd=cx*97+cy;
    if(!test(cx,cy-1))mpGravesLine(x,X0,Y0,X0+s,Y0,w,col,sd+1);if(!test(cx,cy+1))mpGravesLine(x,X0,Y0+s,X0+s,Y0+s,w,col,sd+2);
    if(!test(cx-1,cy))mpGravesLine(x,X0,Y0,X0,Y0+s,w,col,sd+3);if(!test(cx+1,cy))mpGravesLine(x,X0+s,Y0,X0+s,Y0+s,w,col,sd+4)}}
/* small icons */
function mpGravesYew(x,a,b,s){x.fillStyle='#24432e';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillStyle='#5a3a1c';x.fillRect(a-.6*s,b-1.5*s,1.2*s,2.5*s);
  x.fillStyle='#24432e';x.beginPath();x.moveTo(a-3*s,b-1.5*s);x.quadraticCurveTo(a-3.6*s,b-7*s,a,b-9*s);x.quadraticCurveTo(a+3.6*s,b-7*s,a+3*s,b-1.5*s);x.closePath();x.fill();x.stroke();
  x.strokeStyle='rgba(180,220,170,.5)';x.lineWidth=.5;for(let k=0;k<4;k++){x.beginPath();x.moveTo(a-1.6*s+k*s*.6,b-3*s-k*.6*s);x.lineTo(a-.6*s+k*s*.6,b-5.2*s-k*.5*s);x.stroke()}}
function mpGravesStone(x,a,b,s,kind){x.fillStyle=kind?'#b9b2a2':'#cfc8b6';x.strokeStyle=MPL.INK;x.lineWidth=.7;
  if(kind){x.beginPath();x.moveTo(a-2.2*s,b+1.6*s);x.lineTo(a-2.2*s,b-2.4*s);x.quadraticCurveTo(a,b-5.6*s,a+2.2*s,b-2.4*s);x.lineTo(a+2.2*s,b+1.6*s);x.closePath();x.fill();x.stroke();mpGravesLine(x,a-1*s,b-1.4*s,a+1*s,b-1.4*s,.5,MPL.INK,5);mpGravesLine(x,a-1*s,b-.2*s,a+1*s,b-.2*s,.5,MPL.INK,6)}
  else{x.beginPath();x.moveTo(a-1.6*s,b+1.6*s);x.lineTo(a-1.6*s,b-2*s);x.quadraticCurveTo(a,b-3.6*s,a+1.6*s,b-2*s);x.lineTo(a+1.6*s,b+1.6*s);x.closePath();x.fill();x.stroke();mpGravesLine(x,a-.8*s,b-.8*s,a+.8*s,b-.8*s,.5,MPL.INK,7)}
  x.fillStyle='rgba(60,40,20,.25)';x.beginPath();x.ellipse(a,b+1.9*s,2.6*s,.7*s,0,0,6.3);x.fill()}
function mpGravesCross(x,a,b,s){x.save();x.strokeStyle='rgba(60,40,20,.28)';x.lineWidth=2.2*s;x.beginPath();x.moveTo(a+.6*s,b-4*s);x.lineTo(a+.6*s,b+3.2*s);x.moveTo(a-1.6*s,b-1.6*s);x.lineTo(a+2.8*s,b-1.6*s);x.stroke();
  x.strokeStyle='#d8d0bc';x.lineWidth=1.9*s;x.beginPath();x.moveTo(a,b-4.4*s);x.lineTo(a,b+2.6*s);x.moveTo(a-2.1*s,b-2*s);x.lineTo(a+2.1*s,b-2*s);x.stroke();
  x.strokeStyle=MPL.INK;x.lineWidth=.6;x.strokeRect(a-.95*s,b-4.4*s,1.9*s,7);x.restore()}
function mpGravesLantern(x,a,b,s,glow){s=s||1;x.save();if(glow){const g=x.createRadialGradient(a,b,0,a,b,6*s);g.addColorStop(0,'rgba(255,214,110,.6)');g.addColorStop(1,'rgba(255,214,110,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,6*s,0,6.3);x.fill()}
  x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillStyle='#f4c860';x.fillRect(a-1.3*s,b-1.6*s,2.6*s,3.2*s);x.strokeRect(a-1.3*s,b-1.6*s,2.6*s,3.2*s);x.beginPath();x.moveTo(a-1.7*s,b-1.6*s);x.lineTo(a,b-3.2*s);x.lineTo(a+1.7*s,b-1.6*s);x.stroke();x.restore()}
/* the shared margin furniture */
function mpGravesMargin(x,api,title,sub,notes,key){
  api.title(x,title,sub);api.compass(x,436,262,12);
  api.notes(x,notes,13,62,68,6.2,4);
  api.panel(x,392,34,84,18+key.length*12);let y=45;
  api.text(x,'Key',434,y,7.4,MPL.VERM,'center');y+=11;
  for(const k of key){k.icon(402,y);api.text(x,k.t,412,y,6,'#3a2a1c','left');y+=k.dy||12}}

/* ------------------------------------------------------------------ THE BURIAL GROUND */
function mpGravesDrawYard(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,F=api.fit(W,H),s=F.s,ISW=(cx,cy)=>L.rows[cy]&&L.rows[cy][cx]==='T';
  const wall=(cx,cy)=>{const r=L.rows[cy];return !r||r[cx]==='#'||r[cx]==='1'};
  /* grass wash and mown flecks over the whole ground */
  x.save();x.beginPath();x.rect(F.ox,F.oy,W*s,H*s);x.clip();
  x.fillStyle='#a9b684';x.fillRect(F.ox,F.oy,W*s,H*s);
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){const h=mpGravesH(cx,cy,1);x.fillStyle=h<.33?'rgba(110,140,90,.22)':h<.66?'rgba(150,170,100,.2)':'rgba(90,110,70,.14)';x.fillRect(F.X(cx),F.Y(cy),s+.5,s+.5)}
  /* gravel paths from the floor map */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)if(L.fmap[cy][cx]==='1'&&L.rows[cy][cx]==='.'){x.fillStyle='rgba(200,176,128,.9)';x.beginPath();x.ellipse(F.X(cx+.5),F.Y(cy+.5),s*.62,s*.58,0,0,6.3);x.fill()}
  for(let i=0;i<260;i++){const px=F.ox+mpGravesH(i,2)*W*s,py=F.oy+mpGravesH(i,3)*H*s;x.strokeStyle='rgba(50,80,40,.5)';x.lineWidth=.6;x.beginPath();x.moveTo(px,py);x.lineTo(px-.8,py-2.4);x.moveTo(px,py);x.lineTo(px+.9,py-2.2);x.stroke()}
  x.restore();
  /* mist drifting low over the grass */
  x.save();for(let i=0;i<14;i++){const px=F.ox+mpGravesH(i,5)*W*s,py=F.oy+(2+mpGravesH(i,6)*(H-4))*s,r=18+mpGravesH(i,7)*26;const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'rgba(244,244,236,.34)');g.addColorStop(1,'rgba(244,244,236,0)');x.fillStyle=g;x.beginPath();x.ellipse(px,py,r*1.5,r*.5,0,0,6.3);x.fill()}x.restore();
  /* the iron fence, inside the tree wall: posts and a rail along every fence cell */
  const fence=new Set((L.decor||[]).filter(d=>d.k==='ironfence').map(d=>d.x+','+d.y));
  x.save();x.strokeStyle='#2a2a30';x.lineWidth=.8;
  for(const f of fence){const [cx,cy]=f.split(',').map(Number),X0=F.X(cx),Y0=F.Y(cy);
    if(fence.has((cx+1)+','+cy)||fence.has((cx-1)+','+cy)){mpGravesLine(x,X0,Y0+s*.5,X0+s,Y0+s*.5,.9,'#2a2a30',cx*7+cy);for(let k=0;k<3;k++){const px=X0+s*(.17+k*.33);x.beginPath();x.moveTo(px,Y0+s*.2);x.lineTo(px,Y0+s*.8);x.stroke();x.fillStyle='#2a2a30';x.beginPath();x.arc(px,Y0+s*.2,.7,0,6.3);x.fill()}}
    else{mpGravesLine(x,X0+s*.5,Y0,X0+s*.5,Y0+s,.9,'#2a2a30',cx*7+cy);for(let k=0;k<3;k++){const py=Y0+s*(.17+k*.33);x.beginPath();x.moveTo(X0+s*.2,py);x.lineTo(X0+s*.8,py);x.stroke();x.fillStyle='#2a2a30';x.beginPath();x.arc(X0+s*.2,py,.7,0,6.3);x.fill()}}}
  x.restore();
  /* the ring of yews that walls the yard in */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)if(ISW(cx,cy))mpGravesYew(x,F.X(cx+.5)+(mpGravesH(cx,cy,8)-.5)*2,F.Y(cy+.95),s*.11+.04*mpGravesH(cx,cy,9));
  /* the west gate: a gap in the ring with posts and a gold arch */
  const gy=13;x.fillStyle='rgba(200,176,128,.95)';x.fillRect(F.X(0),F.Y(gy)+1,s,s-2);mpGravesLine(x,F.X(0),F.Y(gy),F.X(0),F.Y(gy)+s,1.6,MPL.GOLD,3);
  for(const yy of [gy,gy+1]){x.fillStyle='#3a3a40';x.fillRect(F.X(0)+s*.1,F.Y(yy)-1.4,3,3)}
  /* gravestones and crosses from the real decor, and the lamps */
  const items=(L.decor||[]).filter(d=>d.k==='grave'||d.k==='grave2'||d.k==='cross'||d.k==='statue'||d.k==='lamp').sort((p,q)=>p.y-q.y);
  /* plots: low turf mounds behind each stone */
  for(const d of items)if(d.k==='grave'||d.k==='grave2'||d.k==='cross'){x.fillStyle='rgba(90,120,70,.55)';x.beginPath();x.ellipse(F.X(d.x+.5),F.Y(d.y+1.05),s*.5,s*.22,0,0,6.3);x.fill();mpGravesLine(x,F.X(d.x+.1),F.Y(d.y+1.05),F.X(d.x+.9),F.Y(d.y+1.05),.5,'rgba(42,26,12,.6)',d.x*5+d.y)}
  /* the mausoleum: the solid block, stone walls with a gabled front and a door */
  const mx0=9,my0=5,mw=6,mh=5,A=F.X(mx0),B=F.Y(my0),Wd=mw*s,Hd=mh*s;
  x.fillStyle='rgba(60,40,20,.28)';x.fillRect(A+3,B+3,Wd,Hd);
  x.fillStyle='#d6cfbc';x.fillRect(A,B,Wd,Hd);
  x.strokeStyle='rgba(90,76,56,.5)';x.lineWidth=.5;for(let r=0;r<mh*3;r++){const yy=B+r*s/3;x.beginPath();x.moveTo(A,yy);x.lineTo(A+Wd,yy);x.stroke();for(let k=0;k<mw*2;k++){const xx=A+(k+(r%2?.5:0))*s/2;x.beginPath();x.moveTo(xx,yy);x.lineTo(xx,yy+s/3);x.stroke()}}
  mpGravesEdges(x,L,F,(cx,cy)=>cx>=mx0&&cx<mx0+mw&&cy>=my0&&cy<my0+mh,1.3,MPL.INK);
  /* slate roof ridge across the middle and a gable cross */
  x.fillStyle='rgba(74,84,110,.55)';x.fillRect(A+s*.5,B+s*.5,Wd-s,Hd-s*1.2);x.strokeStyle=MPL.INK;x.lineWidth=.7;x.strokeRect(A+s*.5,B+s*.5,Wd-s,Hd-s*1.2);
  mpGravesLine(x,A+s*.5,B+Hd*.42,A+Wd-s*.5,B+Hd*.42,1.1,MPL.INK,41);
  for(let r=0;r<5;r++)for(let k=0;k<10;k++){const xx=A+s*.7+k*(Wd-s*1.4)/10,yy=B+s*.7+r*(Hd-s*2)/5;x.strokeStyle='rgba(30,40,70,.45)';x.lineWidth=.4;x.beginPath();x.arc(xx+2,yy+1,1.6,0,Math.PI);x.stroke()}
  mpGravesCross(x,A+Wd/2,B-1,.9);
  x.fillStyle='#2a1a0c';x.beginPath();x.moveTo(F.X(11)+s*.15,F.Y(9)+s);x.lineTo(F.X(11)+s*.15,F.Y(9)+s*.4);x.quadraticCurveTo(F.X(11)+s*.5,F.Y(9)+s*.05,F.X(11)+s*.85,F.Y(9)+s*.4);x.lineTo(F.X(11)+s*.85,F.Y(9)+s);x.closePath();x.fill();x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.stroke();
  /* chapel: the small stone chapel set in the north east of the ring is not walkable, so the lych-gate cross marks the statue instead */
  for(const d of items){const a=F.X(d.x+.5),b=F.Y(d.y+.8);
    if(d.k==='grave')mpGravesStone(x,a,b,s*.085,0);else if(d.k==='grave2')mpGravesStone(x,a,b,s*.1,1);else if(d.k==='cross')mpGravesCross(x,a,b,s*.085);
    else if(d.k==='statue'){x.fillStyle='#bfb8a6';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(a-3,b-1,6,3.4);x.strokeRect(a-3,b-1,6,3.4);x.fillStyle='#cfc8b6';x.beginPath();x.moveTo(a-1.4,b-1);x.lineTo(a-1.2,b-6.5);x.lineTo(a+1.2,b-6.5);x.lineTo(a+1.4,b-1);x.closePath();x.fill();x.stroke();x.beginPath();x.arc(a,b-8,1.7,0,6.3);x.fill();x.stroke();mpGravesLine(x,a-3,b-5,a+3,b-5,.8,MPL.INK,12)}
    else mpGravesLantern(x,a,b-1,.85,true)}
  /* small ghosts: pale wisps, drawn as ink-and-wash outlines */
  for(const [gx,gy2] of [[6.5,6.2],[19.6,12.4],[12.8,16],[3.4,3.6]]){const a=F.X(gx),b=F.Y(gy2);x.save();x.globalAlpha=.85;x.fillStyle='rgba(236,244,250,.8)';x.strokeStyle='#4a5a7a';x.lineWidth=.7;x.beginPath();x.moveTo(a-2.6,b+3);x.quadraticCurveTo(a-3.4,b-4,a,b-4.6);x.quadraticCurveTo(a+3.4,b-4,a+2.6,b+3);x.quadraticCurveTo(a+1.3,b+1.6,a,b+3);x.quadraticCurveTo(a-1.3,b+1.6,a-2.6,b+3);x.fill();x.stroke();x.fillStyle='#2a3a5a';x.beginPath();x.arc(a-1,b-2,.6,0,6.3);x.arc(a+1,b-2,.6,0,6.3);x.fill();x.restore()}
  /* place names */
  for(const n of [['The Mausoleum',12,4.1],['West Gate',2.6,12.4],['The Old Graves',6,2.4],['Mist Walk',17,15.5]])api.text(x,n[0],F.X(n[1]),F.Y(n[2]),6.6,MPL.VERM,'center');
  /* margins */
  mpGravesMargin(x,api,'Burial Ground','Ironhill, level 20',[
    'The graves lie in rows between gravel paths.','A tall iron fence runs inside a wall of yews.','The stone mausoleum stands in the middle. Its door faces south.','Pale ghosts drift over the graves in the mist.'],
    [{t:'Headstone',icon:(a,b)=>mpGravesStone(x,a,b+1,1.1,1)},{t:'Wooden cross',icon:(a,b)=>mpGravesCross(x,a,b+1,.9)},{t:'Yew tree',icon:(a,b)=>mpGravesYew(x,a,b+4,.8)},{t:'Lamp post',icon:(a,b)=>mpGravesLantern(x,a,b,.9,false)},{t:'Mausoleum door',icon:(a,b)=>{x.fillStyle='#2a1a0c';x.fillRect(a-2,b-3,4,6);x.strokeStyle=MPL.GOLD;x.strokeRect(a-2,b-3,4,6)}},{t:'Ghost',icon:(a,b)=>{x.fillStyle='rgba(236,244,250,.9)';x.strokeStyle='#4a5a7a';x.beginPath();x.moveTo(a-2.4,b+3);x.quadraticCurveTo(a-3,b-4,a,b-4);x.quadraticCurveTo(a+3,b-4,a+2.4,b+3);x.closePath();x.fill();x.stroke()}},{t:'Iron fence',icon:(a,b)=>{x.strokeStyle='#2a2a30';x.lineWidth=.8;x.beginPath();x.moveTo(a-4,b);x.lineTo(a+4,b);for(let k=-3;k<=3;k+=2){x.moveTo(a+k,b-3);x.lineTo(a+k,b+3)}x.stroke()}}]);
  /* a bat and a raven for flourishes */
  for(const [bx,by] of [[104,52],[372,278]]){x.strokeStyle=MPL.INK;x.lineWidth=1;x.beginPath();x.moveTo(bx-5,by);x.quadraticCurveTo(bx-2,by-4,bx,by);x.quadraticCurveTo(bx+2,by-4,bx+5,by);x.stroke()}
}

/* ------------------------------------------------------------------ THE IRONHILL MINES */
function mpGravesDrawMines(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,F=api.fit(W,H),s=F.s;
  const open=(cx,cy)=>{const r=L.rows[cy];return !!r&&cx>=0&&cx<W&&(r[cx]==='.'||r[cx]==='0')};
  /* the rock: a brown wash with grain, darker and hatched near the galleries */
  x.save();x.beginPath();x.rect(F.ox,F.oy,W*s,H*s);x.clip();
  x.fillStyle='#8a7658';x.fillRect(F.ox,F.oy,W*s,H*s);
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(open(cx,cy))continue;const h=mpGravesH(cx,cy,1);x.fillStyle=h<.4?'rgba(70,52,34,.28)':h<.7?'rgba(120,100,76,.22)':'rgba(50,38,26,.18)';x.fillRect(F.X(cx),F.Y(cy),s+.4,s+.4)}
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(open(cx,cy))continue;let near=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(cx+dx,cy+dy))near=1;
    if(near){x.strokeStyle='rgba(40,28,16,.55)';x.lineWidth=.5;for(let k=0;k<3;k++){const px=F.X(cx)+k*s/3+(mpGravesH(cx,cy,10+k)-.5)*s*.2,py=F.Y(cy)+(mpGravesH(cx,cy,13+k))*s*.3;x.beginPath();x.moveTo(px,py);x.lineTo(px+s*.32,py+s*.7);x.stroke()}}
    else if(mpGravesH(cx,cy,20)<.12){x.fillStyle='rgba(60,46,30,.5)';x.beginPath();x.ellipse(F.X(cx+.5),F.Y(cy+.5),s*.3,s*.2,mpGravesH(cx,cy,21)*3,0,6.3);x.fill()}}
  /* ore veins: little glints of copper and iron in the solid rock */
  for(let i=0;i<46;i++){const cx=Math.floor(mpGravesH(i,30)*W),cy=Math.floor(mpGravesH(i,31)*H);if(open(cx,cy))continue;const a=F.X(cx+.5),b=F.Y(cy+.5);x.fillStyle=i%3===0?'#c98a3a':i%3===1?'#5a7aa8':'#d8c8a0';x.strokeStyle=MPL.INK;x.lineWidth=.4;x.beginPath();x.moveTo(a-1.6,b);x.lineTo(a,b-1.8);x.lineTo(a+1.7,b-.2);x.lineTo(a+.4,b+1.7);x.closePath();x.fill();x.stroke()}
  /* the galleries: packed earth floors with a pale wobbling edge */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!open(cx,cy))continue;const h=mpGravesH(cx,cy,2);x.fillStyle=h<.4?'#d4bc90':h<.7?'#cdb384':'#d9c398';x.fillRect(F.X(cx)-.3,F.Y(cy)-.3,s+.6,s+.6)}
  for(let i=0;i<420;i++){const cx=Math.floor(mpGravesH(i,40)*W),cy=Math.floor(mpGravesH(i,41)*H);if(!open(cx,cy))continue;const a=F.X(cx+mpGravesH(i,42)),b=F.Y(cy+mpGravesH(i,43));x.fillStyle='rgba(90,66,40,.45)';x.fillRect(a,b,.9,.9)}
  x.restore();
  mpGravesEdges(x,L,F,open,1.3,MPL.INK);
  /* timbering: a pair of pit props every third cell along each gallery wall, and a cross beam over them */
  const prop=(a,b)=>{x.fillStyle='#6a4a2a';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillRect(a-.9,b-.9,1.8,1.8);x.strokeRect(a-.9,b-.9,1.8,1.8)};
  const horiz=(cx,cy)=>open(cx-1,cy)&&open(cx+1,cy)&&(!open(cx,cy-1)||!open(cx,cy+1)); /* part of an east-west run */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!open(cx,cy))continue;const a=F.X(cx),b=F.Y(cy);
    if(cx%3===0&&open(cx,cy-1)===false&&open(cx,cy+1)===false&&open(cx-1,cy)&&open(cx+1,cy)){ /* corridor: frame across */
      x.strokeStyle='#6a4a2a';x.lineWidth=1.5;x.beginPath();x.moveTo(a+s*.5,b);x.lineTo(a+s*.5,b+s);x.stroke();x.strokeStyle=MPL.INK;x.lineWidth=.5;x.strokeRect(a+s*.5-.8,b-.4,1.6,s+.8);prop(a+s*.5,b);prop(a+s*.5,b+s)}
    else if(cy%3===1&&!open(cx-1,cy)&&!open(cx+1,cy)&&open(cx,cy-1)&&open(cx,cy+1)){x.strokeStyle='#6a4a2a';x.lineWidth=1.5;x.beginPath();x.moveTo(a,b+s*.5);x.lineTo(a+s,b+s*.5);x.stroke();prop(a,b+s*.5);prop(a+s,b+s*.5)}
    else if(open(cx,cy)&&!open(cx-1,cy)&&open(cx+1,cy)&&(cx+cy)%3===0&&open(cx,cy-1)&&open(cx,cy+1)){prop(a+1,b+s*.5);}
    else if(!open(cx,cy-1)&&open(cx,cy+1)&&(cx+cy*2)%4===0&&open(cx+1,cy)){prop(a+s*.5,b+1.4)}}
  /* rails: along the long west-east gallery and the east-west sections that hold a cart */
  const rail=(c0,c1,cy)=>{const y0=F.Y(cy)+s*.5,a0=F.X(c0),a1=F.X(c1+1);x.strokeStyle='#4a3a2a';x.lineWidth=.6;
    for(let a=a0;a<a1;a+=s*.42){x.beginPath();x.moveTo(a,y0-1.9);x.lineTo(a,y0+1.9);x.stroke()}
    x.strokeStyle='#33333a';x.lineWidth=.8;for(const o of [-1.3,1.3]){x.beginPath();x.moveTo(a0,y0+o);x.lineTo(a1,y0+o);x.stroke()}};
  rail(1,19,14);rail(21,22,14);rail(12,29,18);rail(12,29,6);
  /* ore carts at the real cart positions, each loaded with ore */
  const cart=(a,b)=>{x.fillStyle='#7a5a38';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-4.4,b-3);x.lineTo(a+4.4,b-3);x.lineTo(a+3.4,b+1.4);x.lineTo(a-3.4,b+1.4);x.closePath();x.fill();x.stroke();
    for(let k=0;k<5;k++){x.fillStyle=k%2?'#c98a3a':'#4a4a54';x.beginPath();x.arc(a-3+k*1.5,b-3.4-(k%2),1.4,0,6.3);x.fill();x.stroke()}
    x.fillStyle='#33333a';for(const dx of [-2.4,2.4]){x.beginPath();x.arc(a+dx,b+2.3,1.1,0,6.3);x.fill()}};
  for(const d of L.decor||[]){const a=F.X(d.x+.5),b=F.Y(d.y+.6);
    if(d.k==='cart')cart(a,b);
    else if(d.k==='barrel'){x.fillStyle='#8a5a2a';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillRect(a-2.2,b-2.8,4.4,5);x.strokeRect(a-2.2,b-2.8,4.4,5);mpGravesLine(x,a-2.2,b-1,a+2.2,b-1,.5,MPL.INK,2);mpGravesLine(x,a-2.2,b+1,a+2.2,b+1,.5,MPL.INK,3)}
    else if(d.k==='chest'){x.fillStyle='#8a5a2a';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(a-3.2,b-2.4,6.4,4.6);x.strokeRect(a-3.2,b-2.4,6.4,4.6);x.fillStyle=MPL.GOLD;x.fillRect(a-.7,b-1,1.4,1.8);mpGravesLine(x,a-3.2,b-.6,a+3.2,b-.6,.6,MPL.INK,4)}
    else if(d.k==='bones'){x.strokeStyle='#efe8d8';x.lineWidth=1.3;x.beginPath();x.moveTo(a-3,b-1.4);x.lineTo(a+3,b+1.4);x.moveTo(a-3,b+1.4);x.lineTo(a+3,b-1.4);x.stroke();x.strokeStyle=MPL.INK;x.lineWidth=.4;x.stroke()}
    else if(d.k==='coffin'){x.fillStyle='#6a4a2a';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-2,b-4);x.lineTo(a+2,b-4);x.lineTo(a+3,b-1);x.lineTo(a+1.6,b+4);x.lineTo(a-1.6,b+4);x.lineTo(a-3,b-1);x.closePath();x.fill();x.stroke();mpGravesLine(x,a,b-3,a,b+2,.6,MPL.GOLD,9)}}
  /* shafts: round timbered holes at the dead-ends and an inked ladder at the way up */
  const shaft=(a,b,r)=>{const g=x.createRadialGradient(a,b,0,a,b,r);g.addColorStop(0,'#0c0804');g.addColorStop(1,'#3a2a1a');x.fillStyle=g;x.strokeStyle=MPL.INK;x.lineWidth=1;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();x.stroke();
    x.strokeStyle='#8a6a3a';x.lineWidth=1.4;x.beginPath();x.rect(a-r*.9,a>0?b-r*.9:b,r*1.8,r*1.8);x.stroke();x.lineWidth=.6;x.strokeStyle=MPL.INK;x.strokeRect(a-r*.9-.8,b-r*.9-.8,r*1.8+1.6,r*1.8+1.6)};
  const up=L.portals&&L.portals[0];
  if(up){const a=F.X(up.x+.5),b=F.Y(up.y+.5);x.fillStyle='rgba(20,12,6,.8)';x.fillRect(a-3,b-3,6,6);x.strokeStyle='#8a6a3a';x.lineWidth=1.2;x.strokeRect(a-3,b-3,6,6);x.strokeStyle='#d8c8a0';x.lineWidth=.8;x.beginPath();x.moveTo(a-1.4,b-3);x.lineTo(a-1.4,b+3);x.moveTo(a+1.4,b-3);x.lineTo(a+1.4,b+3);for(let k=-2;k<=2;k+=1.5){x.moveTo(a-1.4,b+k);x.lineTo(a+1.4,b+k)}x.stroke()}
  /* lantern lights on hooks at the ends of long galleries and at junctions */
  for(const [cx,cy] of [[1,13],[6,15],[14,13],[22,14],[19,17],[31,5],[32,13],[39,3],[39,21],[34,19],[22,3],[22,18],[14,7]]){if(!open(cx,cy))continue;mpGravesLantern(x,F.X(cx+.5),F.Y(cy+.5)-1,.9,true)}
  /* the mine mouth in the west: a timbered arch over the first gallery */
  {const a=F.X(0),b=F.Y(14);x.fillStyle='rgba(20,12,6,.7)';x.fillRect(a-1,b,s+1,s);x.strokeStyle='#8a6a3a';x.lineWidth=1.8;x.beginPath();x.moveTo(a+1,b+s);x.lineTo(a+1,b+.4);x.lineTo(a+s*.9,b+.4);x.lineTo(a+s*.9,b+s);x.stroke()}
  /* names */
  const nm=[['Mine Mouth',3.2,12.6],['West Gallery',12,13.5],['Timber Hall',16,6.6],['Ore Hall',27,6.6],['The Deep Rooms',38,8.2],['The Lower Hall',16,20.4],['Cart Hall',27,19.2],['Chest Room',38,19.6]];
  for(const n of nm)api.text(x,n[0],F.X(n[1]),F.Y(n[2]),6.2,MPL.VERM,'center');
  api.text(x,'Shaft up to Ironhill',F.X(35),F.Y(11.6),5.6,MPL.LAPIS,'center');
  /* margins */
  mpGravesMargin(x,api,'Ironhill Mines','Level 18, under the hill',[
    'A long gallery runs east from the mine mouth.','Pit props and beams hold up the roof.','Ore carts stand on iron rails. Lanterns hang at the junctions.','Old bones lie in the lower halls. The deepest rooms are in the east.'],
    [{t:'Pit prop',icon:(a,b)=>prop(a,b)},{t:'Ore cart',icon:(a,b)=>cart(a,b)},{t:'Rails',icon:(a,b)=>{x.strokeStyle='#33333a';x.lineWidth=.8;x.beginPath();x.moveTo(a-4,b-1.3);x.lineTo(a+4,b-1.3);x.moveTo(a-4,b+1.3);x.lineTo(a+4,b+1.3);x.stroke();x.strokeStyle='#4a3a2a';for(let k=-3;k<=3;k+=2){x.beginPath();x.moveTo(a+k,b-2);x.lineTo(a+k,b+2);x.stroke()}}},{t:'Lantern',icon:(a,b)=>mpGravesLantern(x,a,b,.9,false)},{t:'Ladder up',icon:(a,b)=>{x.fillStyle='rgba(20,12,6,.8)';x.fillRect(a-3,b-3,6,6);x.strokeStyle='#d8c8a0';x.lineWidth=.7;x.beginPath();x.moveTo(a-1.2,b-3);x.lineTo(a-1.2,b+3);x.moveTo(a+1.2,b-3);x.lineTo(a+1.2,b+3);x.stroke()}},{t:'Ore',icon:(a,b)=>{x.fillStyle='#c98a3a';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-2,b);x.lineTo(a,b-2.4);x.lineTo(a+2.2,b);x.lineTo(a+.4,b+2.2);x.closePath();x.fill();x.stroke()}}]);
}

mplInstall({name:'gravesmines',levels:[20,18],draw(c,x,L,api){if(L.rows.length===18&&L.rows[0].length===24)mpGravesDrawYard(c,x,L,api);else mpGravesDrawMines(c,x,L,api)},foot:'You are the yellow arrow. Press M to close the map.'});
