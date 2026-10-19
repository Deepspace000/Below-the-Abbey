/* Oldhaven map section oldtown (order 12): the Old Town in the west of the city, cells x 6..55, y 13..97. Crooked lanes, tall narrow timber houses with a jettied upper floor
   and tiled roofs, little courts, wells, washing lines, lamps, Chapel Close with the chapel and its graveyard. Drawn from the real rows, fmap and decor of level 305.
   Everything here starts with mpOhOldTown. */
function mpOhOldTownPaint(x,L,api,fit){
  const s=fit.s,X=fit.X,Y=fit.Y,INK='#2a1a0c',R=L.rows,W=R[0].length,H=R.length,h2=(a,b,c)=>hash2(a,b,c);
  const BX0=5.6,BX1=57,BY0=13,BY1=97.4;
  x.beginPath();x.rect(X(BX0),Y(BY0),X(BX1)-X(BX0),Y(BY1)-Y(BY0));x.clip();
  const wall=(cx,cy)=>cx<0||cy<0||cx>=W||cy>=H||R[cy][cx]!=='.';
  const fm=(cx,cy)=>{const r=L.fmap&&L.fmap[cy];return r?(+r[cx]||0):0};
  const GR=['#d2c6a6','#e6dcc0','#b4be8e','#a5b28a','#d4bb84','#bdc18a'];
  const road=k=>k===0||k===1||k===4;
  const ln=(a,b,c,d,w,col,al)=>{x.globalAlpha=al==null?1:al;x.strokeStyle=col||INK;x.lineWidth=w;x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke();x.globalAlpha=1};
  /* ground */
  for(let cy=13;cy<=97;cy++)for(let cx=6;cx<=57;cx++){
    const px=X(cx),py=Y(cy);
    if(wall(cx,cy)){x.fillStyle='#c4b898';x.fillRect(px-.2,py-.2,s+.4,s+.4);continue}
    const k=fm(cx,cy);x.fillStyle=GR[k]||GR[0];x.fillRect(px-.2,py-.2,s+.4,s+.4);
    const r=h2(cx,cy,201);x.fillStyle=r<.5?'rgba(90,60,30,'+(r*.16)+')':'rgba(255,248,225,'+((r-.5)*.3)+')';x.fillRect(px-.2,py-.2,s+.4,s+.4);
  }
  /* ground texture: cobbles, gravel flecks, grass tufts, meadow flowers, moss */
  for(let cy=13;cy<=97;cy++)for(let cx=6;cx<=57;cx++){
    if(wall(cx,cy))continue;const k=fm(cx,cy),px=X(cx),py=Y(cy);
    if(k===0||k===1){x.fillStyle=k?'rgba(140,125,95,.5)':'rgba(110,98,72,.5)';for(let i=0;i<3;i++){const a=px+h2(cx,cy,i+1)*s,b=py+h2(cx,cy,i+9)*s;x.fillRect(a,b,.45,.3)}
      if(h2(cx,cy,31)<.35){x.strokeStyle='rgba(110,98,72,.35)';x.lineWidth=.18;x.strokeRect(px+.1,py+.1,s*.8,s*.8)}}
    else if(k===4){x.fillStyle='rgba(120,92,50,.55)';for(let i=0;i<3;i++)x.fillRect(px+h2(cx,cy,i+3)*s,py+h2(cx,cy,i+13)*s,.3,.3)}
    else if(k===2||k===3){if(h2(cx,cy,41)<.6){const a=px+h2(cx,cy,5)*s,b=py+h2(cx,cy,6)*s;x.strokeStyle=k===2?'#5a7a48':'#4a6a46';x.lineWidth=.22;x.beginPath();x.moveTo(a-.3,b);x.lineTo(a,b-.55);x.lineTo(a+.3,b);x.stroke()}}
    else if(k===5){const cols=['#c0402a','#e8c040','#f0ece0','#5a6ab0'];for(let i=0;i<2;i++){x.fillStyle=cols[(h2(cx,cy,i+7)*4)|0];x.beginPath();x.arc(px+h2(cx,cy,i+2)*s,py+h2(cx,cy,i+17)*s,.3,0,6.3);x.fill()}}
  }
  /* edges where a road meets grass: an inked, wobbly line */
  x.strokeStyle='rgba(90,70,40,.55)';x.lineWidth=.28;
  for(let cy=13;cy<=97;cy++)for(let cx=6;cx<=57;cx++){
    if(wall(cx,cy)||!road(fm(cx,cy)))continue;
    for(const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){const u=cx+dx,v=cy+dy;if(wall(u,v)||road(fm(u,v)))continue;
      let a,b,c,d;if(dx===1){a=c=X(cx+1);b=Y(cy);d=Y(cy+1)}else if(dx===-1){a=c=X(cx);b=Y(cy);d=Y(cy+1)}else if(dy===1){b=d=Y(cy+1);a=X(cx);c=X(cx+1)}else{b=d=Y(cy);a=X(cx);c=X(cx+1)}
      const j=(h2(cx,cy,60+dx*2+dy)-.5)*.35;x.beginPath();x.moveTo(a,b);x.quadraticCurveTo((a+c)/2+(dy?0:j),(b+d)/2+(dx?0:j),c,d);x.stroke()}}
  /* Old Well Court: a ring of paving round the well */
  {const cx=X(12.5),cy=Y(50.5);x.strokeStyle='rgba(110,98,72,.6)';x.lineWidth=.25;for(let r=1.6;r<=3.4;r+=.9){x.beginPath();x.arc(cx,cy,r*s,0,6.3);x.stroke()}
   for(let i=0;i<40;i++){const a=i*.157,r=(1.6+(i%3)*.9)*s+.4;x.fillStyle='rgba(110,98,72,.5)';x.fillRect(cx+Math.cos(a)*r,cy+Math.sin(a)*r,.4,.3)}}
  /* the churchyard: a low wall round the lawn, graves in rows */
  {const a=X(34),b=Y(60),c=X(47),d=Y(73);x.strokeStyle='#8a7e66';x.lineWidth=.9;x.strokeRect(a,b,c-a,d-b);x.strokeStyle='#d8ceb2';x.lineWidth=.55;x.strokeRect(a,b,c-a,d-b);x.strokeStyle=INK;x.lineWidth=.15;x.strokeRect(a-.45,b-.45,c-a+.9,d-b+.9);x.strokeRect(a+.45,b+.45,c-a-.9,d-b-.9);
   x.fillStyle='#c9bca0';x.fillRect(X(39.6),d-.7,s*1.8,1.4);x.strokeStyle=INK;x.lineWidth=.2;x.strokeRect(X(39.6),d-.7,s*1.8,1.4);
   x.fillStyle='#8a7e66';x.fillRect(X(39.6)-.3,d-1.2,.6,2.4);x.fillRect(X(41.4)-.3,d-1.2,.6,2.4)}
  for(let cy=60;cy<=72;cy+=2)for(let cx=34;cx<=46;cx+=2){
    if(wall(cx,cy)||wall(cx+1,cy)||fm(cx,cy)===4||fm(cx,cy)===0||(cy>=65&&cy<=69&&cx>=35&&cx<=45))continue;
    const px=X(cx)+.8,py=Y(cy)+1.5,r=h2(cx,cy,71);
    if(r<.55){x.strokeStyle=INK;x.lineWidth=.35;ln(px,py-.9,px,py+.5,.35);ln(px-.5,py-.4,px+.5,py-.4,.35)}
    else if(r<.9){x.fillStyle='#cfc8b8';x.strokeStyle=INK;x.lineWidth=.2;x.beginPath();x.moveTo(px-.5,py+.6);x.lineTo(px-.5,py-.3);x.quadraticCurveTo(px,py-1.1,px+.5,py-.3);x.lineTo(px+.5,py+.6);x.closePath();x.fill();x.stroke()}
    else{x.fillStyle='#8a8a74';x.fillRect(px-.5,py-.1,1,.5)}
    x.fillStyle='rgba(60,50,30,.25)';x.fillRect(px-.5,py+.6,1.1,.3)}
  /* houses: wall cells cut into rectangles, then into narrow units */
  const used=new Set(),rects=[];
  for(let cy=13;cy<=97;cy++)for(let cx=6;cx<=57;cx++){
    if(!wall(cx,cy)||used.has(cx+','+cy))continue;
    let x1=cx;while(x1+1<=57&&wall(x1+1,cy)&&!used.has((x1+1)+','+cy))x1++;
    let y1=cy;for(;;){let ok=y1+1<=97;for(let i=cx;ok&&i<=x1;i++)if(!wall(i,y1+1)||used.has(i+','+(y1+1)))ok=false;if(!ok)break;y1++}
    for(let j=cy;j<=y1;j++)for(let i=cx;i<=x1;i++)used.add(i+','+j);rects.push({x0:cx,y0:cy,x1,y1})}
  const ROOFS=[['#c4663f','#a44d30'],['#7d8593','#5f6773'],['#ab4430','#8b3424'],['#c8a85c','#aa8c46'],['#4f6cac','#3d5489']];
  const pickRoof=(a,b)=>{const r=h2(a,b,81);return r<.45?0:r<.75?1:r<.87?2:r<.95?3:4};
  function house(u0,v0,u1,v1){
    const px=X(u0),py=Y(v0),pw=(u1-u0+1)*s,ph=(v1-v0+1)*s,rc=ROOFS[pickRoof(u0,v0)],fh=Math.min(ph*.4,2.5);
    x.fillStyle='rgba(50,34,16,.3)';x.fillRect(px+.5,py+.6,pw,ph);
    /* the street face: cream plaster, dark timber, a jetty beam, a door and small windows */
    const fy=py+ph-fh;x.fillStyle='#eadfc2';x.fillRect(px,fy,pw,fh);
    x.strokeStyle='#5a3a1c';x.lineWidth=.22;const np=Math.max(2,Math.round(pw/1.1));
    for(let i=0;i<=np;i++){const a=px+pw*i/np;ln(a,fy,a,py+ph,.22,'#5a3a1c')}
    ln(px,fy+fh*.5,px+pw,fy+fh*.5,.3,'#5a3a1c');
    if(pw>3){ln(px+pw*.15,fy+fh*.5,px+pw*.5,fy,.15,'#5a3a1c');ln(px+pw*.85,fy+fh*.5,px+pw*.5,fy,.15,'#5a3a1c')}
    x.fillStyle='#3a2414';const dw=Math.min(.9,pw*.22),dxp=px+pw*(.3+h2(u0,v0,3)*.3);x.fillRect(dxp,py+ph-fh*.45,dw,fh*.45);
    x.fillStyle=h2(u0,v0,4)<.5?'#274a9a':'#b8321e';x.fillRect(px+pw*.12,fy+fh*.18,.6,.45);if(pw>3.6)x.fillRect(px+pw*.72,fy+fh*.18,.6,.45);
    ln(px-.3,fy,px+pw+.3,fy,.45,'#4a2e16');
    x.strokeStyle=INK;x.lineWidth=.22;x.strokeRect(px,fy,pw,fh);
    /* the roof, seen as two sloping halves with a ridge, tile courses and a chimney */
    const rh=ph-fh+.1,hor=pw>ph*1.5;
    if(!hor){x.fillStyle=rc[0];x.fillRect(px-.2,py,pw/2+.2,rh);x.fillStyle=rc[1];x.fillRect(px+pw/2,py,pw/2+.2,rh);
      x.strokeStyle='rgba(30,16,8,.35)';x.lineWidth=.14;for(let b=py+.7;b<py+rh-.3;b+=.8){ln(px,b,px+pw,b,.14,'#2a1a0c',.35)}
      ln(px+pw/2,py,px+pw/2,py+rh,.4,INK)}
    else{x.fillStyle=rc[0];x.fillRect(px-.2,py,pw+.4,rh/2);x.fillStyle=rc[1];x.fillRect(px-.2,py+rh/2,pw+.4,rh/2);
      for(let a=px+.7;a<px+pw-.3;a+=.8)ln(a,py,a,py+rh,.14,'#2a1a0c',.35);ln(px,py+rh/2,px+pw,py+rh/2,.4,INK)}
    x.strokeStyle=INK;x.lineWidth=.3;x.strokeRect(px-.2,py,pw+.4,rh);
    if(h2(u0,v0,5)<.55){const cxp=px+pw*(.22+h2(u0,v0,6)*.5),cyp=py+rh*.25;x.fillStyle='#6a4a3a';x.fillRect(cxp,cyp,.9,.9);x.strokeStyle=INK;x.lineWidth=.18;x.strokeRect(cxp,cyp,.9,.9);
      if(h2(u0,v0,7)<.4){x.strokeStyle='rgba(120,110,100,.7)';x.lineWidth=.22;x.beginPath();x.moveTo(cxp+.45,cyp-.1);x.bezierCurveTo(cxp-.6,cyp-1,cxp+1.4,cyp-1.6,cxp+.3,cyp-2.4);x.stroke()}}
  }
  const chapel={x0:36,y0:65,x1:44,y1:69};
  for(const r of rects){
    if(r.x0===chapel.x0&&r.y0===chapel.y0)continue;
    if(r.x0>=49&&r.x1<=50)continue;
    const w=r.x1-r.x0+1,h=r.y1-r.y0+1,nx=Math.max(1,Math.round(w/4)),ny=Math.max(1,Math.round(h/5.5));
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
      const u0=r.x0+Math.floor(w*i/nx),u1=r.x0+Math.floor(w*(i+1)/nx)-1,v0=r.y0+Math.floor(h*j/ny),v1=r.y0+Math.floor(h*(j+1)/ny)-1;
      if(u1>=u0&&v1>=v0)house(u0,v0,u1,v1)}}
  /* the precinct wall of the east edge, drawn as plain stone */
  for(const r of rects){if(r.x0>=49&&r.x1<=50){const a=X(r.x0),b=Y(r.y0),c=X(r.x1+1),d=Y(r.y1+1);x.fillStyle='#cfc6ae';x.fillRect(a,b,c-a,d-b);x.strokeStyle=INK;x.lineWidth=.25;x.strokeRect(a,b,c-a,d-b);for(let v=b+1.2;v<d;v+=1.2)ln(a,v,c,v,.12,INK,.4)}}
  /* the chapel: nave with a slate roof, a west tower, a porch, a cross on the east gable */
  {const a=X(36),b=Y(65),w=9*s,h=5*s;x.fillStyle='rgba(50,34,16,.3)';x.fillRect(a+.6,b+.7,w,h);
   x.fillStyle='#d8cfb8';x.fillRect(a,b,w,h);x.strokeStyle=INK;x.lineWidth=.3;x.strokeRect(a,b,w,h);
   const nx0=a+2.9*s,nw=w-2.9*s-.1*s;x.fillStyle='#7d8593';x.fillRect(nx0,b+.5,nw,h/2-.5);x.fillStyle='#5f6773';x.fillRect(nx0,b+h/2,nw,h/2-.5);
   for(let q=nx0+.7;q<nx0+nw-.3;q+=.8)ln(q,b+.5,q,b+h-.5,.14,INK,.35);ln(nx0,b+h/2,nx0+nw,b+h/2,.4,INK);x.strokeRect(nx0,b+.5,nw,h-1);
   x.fillStyle='#cfc6ae';x.fillRect(a+.2,b+.5,2.6*s,h-1);x.strokeRect(a+.2,b+.5,2.6*s,h-1);
   x.fillStyle='#274a9a';x.beginPath();x.moveTo(a+.9*s,b+.9*s);x.lineTo(a+2.1*s,b+.9*s);x.lineTo(a+1.5*s,b+.4*s);x.closePath();x.fill();
   x.fillStyle='#4f6cac';x.fillRect(a+.45*s,b+.8*s,2.1*s,h-1.6*s);x.strokeRect(a+.45*s,b+.8*s,2.1*s,h-1.6*s);ln(a+.45*s,b+.8*s,a+2.55*s,b+h-.8*s,.2);ln(a+2.55*s,b+.8*s,a+.45*s,b+h-.8*s,.2);
   x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a+1.5*s,b+h/2,.5,0,6.3);x.fill();
   x.fillStyle='#cfc6ae';x.fillRect(X(40)-.1,Y(70)-.2,s*1.3,s*.9);x.strokeRect(X(40)-.1,Y(70)-.2,s*1.3,s*.9);x.fillStyle='#3a2414';x.fillRect(X(40.45),Y(70)+.5,s*.5,s*.4);
   const cx=a+w-.5,cy=b+h/2;ln(cx,cy-1.2,cx,cy+1.2,.5,MPL.GOLD);ln(cx-.8,cy-.4,cx+.8,cy-.4,.5,MPL.GOLD)}
  /* garden decor from the real data: trees, bushes, flower beds, wells, tubs, topiary, pergolas, lamps */
  const D=L.decor.filter(d=>d.x>=6&&d.x<=57&&d.y>=13&&d.y<=97);
  const GREENS=['#4f7a48','#5a8450','#3f6a44','#6a8a4a','#7a9a50'];
  const bedCols=['#b8321e','#e8c040','#f0ece0','#7a5ab0','#e07a8a'];
  D.sort((p,q)=>p.y-q.y);
  for(const d of D){
    const k=d.k,a=X(d.x+.5),b=Y(d.y+.5);
    if(/^ltree/.test(k)){const n=+k.slice(5)||0,g=GREENS[n%5],r=1.15+(n%4)*.18;
      x.fillStyle='rgba(40,60,30,.28)';x.beginPath();x.ellipse(a+.5,b+.6,r*.9,r*.45,0,0,6.3);x.fill();
      ln(a,b+.5,a,b-.5,.45,'#5a3a1c');x.fillStyle=g;x.strokeStyle=INK;x.lineWidth=.22;
      for(const [dx,dy,rr] of [[-.55,-.9,.75],[.55,-.9,.75],[0,-1.5,.9]]){x.beginPath();x.arc(a+dx*r,b+dy*r,rr*r,0,6.3);x.fill();x.stroke()}
      x.fillStyle='rgba(255,250,200,.25)';x.beginPath();x.arc(a-.3*r,b-1.7*r,.4*r,0,6.3);x.fill()}
    else if(/^lbush/.test(k)){x.fillStyle='#4f7a48';x.strokeStyle=INK;x.lineWidth=.2;x.beginPath();x.arc(a,b,.8,0,6.3);x.fill();x.stroke();x.fillStyle='#e8c040';x.fillRect(a-.2,b-.2,.3,.3)}
    else if(/^kh_ohgard/.test(k)){const r=h2(d.x,d.y,91);x.fillStyle=r<.5?'#6a8a4a':'#8a6a3a';x.beginPath();x.ellipse(a,b+.2,.9,.5,0,0,6.3);x.fill();x.strokeStyle=INK;x.lineWidth=.14;x.stroke();
      for(let i=0;i<3;i++){x.fillStyle=bedCols[(h2(d.x,d.y,i+95)*5)|0];x.beginPath();x.arc(a-.5+i*.5,b+(i%2?.2:-.1),.22,0,6.3);x.fill()}}
    else if(k==='oh_well'){x.fillStyle='#b9b3a6';x.strokeStyle=INK;x.lineWidth=.25;x.beginPath();x.arc(a,b,1.35,0,6.3);x.fill();x.stroke();x.fillStyle='#3a6aa8';x.beginPath();x.arc(a,b,.8,0,6.3);x.fill();x.stroke();
      ln(a-1.5,b-1.5,a-1.5,b-.2,.25,'#5a3a1c');ln(a+1.5,b-1.5,a+1.5,b-.2,.25,'#5a3a1c');ln(a-1.6,b-1.5,a+1.6,b-1.5,.35,'#5a3a1c')}
    else if(k==='yar_tub'){x.fillStyle='#7a5a38';x.strokeStyle=INK;x.lineWidth=.2;x.beginPath();x.arc(a,b,.8,0,6.3);x.fill();x.stroke();x.fillStyle='#5a8450';x.beginPath();x.arc(a,b-.1,.55,0,6.3);x.fill()}
    else if(k==='oh_topiary'){x.fillStyle='#3f6a44';x.strokeStyle=INK;x.lineWidth=.2;x.beginPath();x.arc(a,b-.5,.8,0,6.3);x.fill();x.stroke();x.beginPath();x.arc(a,b+.4,.55,0,6.3);x.fill();x.stroke()}
    else if(k==='oh_pergola'){x.strokeStyle='#6a4a2a';x.lineWidth=.3;x.strokeRect(a-1.5,b-1,3,2);for(let i=-1;i<=1;i++)ln(a+i,b-1,a+i,b+1,.15,'#6a4a2a');x.fillStyle='rgba(90,140,80,.6)';x.fillRect(a-1.5,b-1,3,.6)}
    else if(k==='kh_city2_1'){x.fillStyle='#b5aa94';x.strokeStyle=INK;x.lineWidth=.2;x.fillRect(a-.9,b-.9,1.8,1.8);x.strokeRect(a-.9,b-.9,1.8,1.8);x.fillStyle='#5a8450';x.beginPath();x.arc(a,b,.5,0,6.3);x.fill()}
    else if(k==='lamp'){x.fillStyle='rgba(255,226,120,.4)';x.beginPath();x.arc(a,b,1.2,0,6.3);x.fill();x.fillStyle=MPL.GOLD;x.strokeStyle=INK;x.lineWidth=.15;x.beginPath();x.arc(a,b,.45,0,6.3);x.fill();x.stroke()}
  }
  /* washing lines across the lanes, with a few cloths */
  const cloth=['#f0ece0','#b8321e','#274a9a','#e8c040','#f0ece0','#3a7a5a'];
  for(let cy=14;cy<=96;cy++)for(let cx=7;cx<=56;cx++){
    if(wall(cx,cy)||wall(cx+1,cy)||!wall(cx-1,cy)||!wall(cx+2,cy)||fm(cx,cy)!==4)continue;
    if(h2(cx,cy,111)>.2)continue;
    const a=X(cx)-.2,c=X(cx+2)+.2,b=Y(cy)+s*.4;x.strokeStyle='#5a3a1c';x.lineWidth=.18;x.beginPath();x.moveTo(a,b);x.quadraticCurveTo((a+c)/2,b+.7,c,b);x.stroke();
    for(let i=0;i<3;i++){const t=.22+i*.28,px=a+(c-a)*t,py=b+Math.sin(t*3.14)*.35;x.fillStyle=cloth[(h2(cx,cy,i+120)*6)|0];x.fillRect(px-.3,py,.65,.8);x.strokeStyle=INK;x.lineWidth=.1;x.strokeRect(px-.3,py,.65,.8)}}
  /* labels */
  function lab(t,cx,cy,sz,col,it){x.save();x.font=(it?'italic ':'')+'bold '+sz+'px '+FUI;x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=Math.max(.8,sz*.38);x.strokeStyle='rgba(238,226,190,.9)';x.strokeText(t,X(cx),Y(cy));x.fillStyle=col||INK;x.fillText(t,X(cx),Y(cy));x.restore()}
  for(const n of (L.mapNames||[])){
    if(n.x<6||n.x>49||n.y<14||n.y>96)continue;
    if(n.t==='Old Town')lab(n.t,n.x,n.y,6,'#7a2414');
    else if(n.t==='Chapel Close')lab(n.t,n.x,58.8,4.2,'#1f3a80');
    else if(n.t==='Lantern Street')lab(n.t,n.x,n.y,3.8,'#7a2414',1)}
  lab("Saint Elen's Chapel",40,63.1,2.7,'#1f3a80',1);lab('Churchyard',40,71.8,2.5,'#3a5a3a',1);
  lab('Old Well Court',12.5,54.6,2.9,'#1f3a80',1);lab('Apothecary',46.5,53.7,2.2);lab('Herbalist',12,74.2,2.2);lab('Scrivener',32.5,28.3,2.2);lab('Priest',41,74.5,2.2);
  lab("Candle Lane",13,25.5,2.4,'#5a3a1c',1);lab("Weavers' Lane",13,37.5,2.4,'#5a3a1c',1);lab("Tanners' Lane",12,66.5,2.4,'#5a3a1c',1);lab("Coopers' Lane",12.5,81.5,2.4,'#5a3a1c',1);lab("Fullers' Lane",12.5,96.5,2.4,'#5a3a1c',1);lab("Mill Lane",27,37.5,2.4,'#5a3a1c',1);
}
MPOH.push({order:12,name:'oldtown',paint:mpOhOldTownPaint});
