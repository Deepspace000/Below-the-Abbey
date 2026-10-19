/* Orange Spire map, level 444 (floor 5). Hand-drawn castle plan from the real rows: spire stone, flagged floors, gold door frames, sconces, rugs, furniture,
   stairs. No spoilers: hidden doors, secret chambers, levers, the Strange Room's contents and every enemy are left out (secret chambers are filled in as rock). */
function mpOs444Draw(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,INK='#2a1a0c',PLUM='#4a2448',STONE='#8a4c20',ORANGE='#c47a3a',GOLD=MPL.GOLD,GOLD2=MPL.GOLD2,VERM=MPL.VERM;
  const isOpen0=(a,b)=>{const ch=L.rows[b]&&L.rows[b][a];return ch==='.'||ch==='0'||ch==='1'};
  // only what the party can walk to from the stair: secret chambers stay solid
  const open=[];for(let y=0;y<H;y++)open.push(new Uint8Array(W));
  {const st=[[L._start.x,L._start.y]];open[L._start.y][L._start.x]=1;while(st.length){const [a,b]=st.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const p=a+dx,q=b+dy;if(p>=0&&q>=0&&p<W&&q<H&&!open[q][p]&&isOpen0(p,q)){open[q][p]=1;st.push([p,q])}}}}
  const op=(a,b)=>a>=0&&b>=0&&a<W&&b<H&&open[b][a]===1;
  // distance to the nearest open cell (Chebyshev, up to 3)
  const dist=[];for(let y=0;y<H;y++){dist.push(new Uint8Array(W).fill(9))}
  for(let y=0;y<H;y++)for(let a=0;a<W;a++)if(open[y][a])for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const p=a+dx,q=y+dy;if(p>=0&&q>=0&&p<W&&q<H){const d=Math.max(Math.abs(dx),Math.abs(dy));if(d<dist[q][p])dist[q][p]=d}}
  // rock = within 1 of floor, plus any pocket that is walled in (a secret chamber)
  const rock=[];for(let y=0;y<H;y++){rock.push(new Uint8Array(W));for(let a=0;a<W;a++)rock[y][a]=!open[y][a]&&dist[y][a]<=1?1:0}
  {const outside=[];for(let y=0;y<H;y++)outside.push(new Uint8Array(W));const st=[];
    for(let y=0;y<H;y++)for(let a=0;a<W;a++)if((y===0||a===0||y===H-1||a===W-1)&&!open[y][a]&&!rock[y][a]){outside[y][a]=1;st.push([a,y])}
    while(st.length){const [a,b]=st.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const p=a+dx,q=b+dy;if(p>=0&&q>=0&&p<W&&q<H&&!outside[q][p]&&!open[q][p]&&!rock[q][p]){outside[q][p]=1;st.push([p,q])}}}
    for(let y=0;y<H;y++)for(let a=0;a<W;a++)if(!open[y][a]&&!outside[y][a])rock[y][a]=1}
  const solid=(a,b)=>a>=0&&b>=0&&a<W&&b<H&&!open[b][a];
  const J=(a,b,sd)=>hash2(a,b,sd)-.5;
  c=x;
  // ---- soft outer stone, then the rock itself ----
  x.save();
  for(let y=0;y<H;y++)for(let a=0;a<W;a++){if(open[y][a]||rock[y][a])continue;if(dist[y][a]<=3){x.globalAlpha=dist[y][a]===2?.3:.14;x.fillStyle='#a8683a';x.fillRect(X(a)-.2,Y(y)-.2,s+.4,s+.4)}}
  x.globalAlpha=1;
  for(let y=0;y<H;y++)for(let a=0;a<W;a++)if(rock[y][a]){const v=hash2(a,y,5);x.fillStyle=v<.33?STONE:v<.66?'#82461e':'#925224';x.fillRect(X(a)-.15,Y(y)-.15,s+.3,s+.3)}
  // violet and plum shade deep in the rock, ink hatching on top
  for(let y=0;y<H;y++)for(let a=0;a<W;a++)if(rock[y][a]){
    if(hash2(a,y,6)<.35){x.fillStyle='rgba(74,36,72,.28)';x.fillRect(X(a),Y(y),s,s)}
    x.strokeStyle='rgba(30,14,10,.55)';x.lineWidth=.45;x.beginPath();
    const n=2+((a+y)&1);for(let k=0;k<n;k++){const o=(k+.5)/n*s,j=J(a*3+k,y,8)*.7;x.moveTo(X(a)+o+j,Y(y));x.lineTo(X(a)+o-s*.7+j,Y(y)+s*.7)}
    x.stroke()}
  x.restore();
  // ---- floors: flagged stone, tinted by the floor type ----
  const fm=L.fmap;
  for(let y=0;y<H;y++)for(let a=0;a<W;a++)if(open[y][a]){
    const t=fm&&fm[y]?fm[y][a]:'0',v=hash2(a,y,11);
    let col=v<.33?'#d89c5e':v<.66?'#cf9050':'#e0a868';if(t==='3')col=v<.5?'#b8a0a8':'#c0aab2';else if(t==='1')col=v<.5?'#e6c27c':'#dcb46c';
    x.fillStyle=col;x.fillRect(X(a)-.1,Y(y)-.1,s+.2,s+.2);
    x.strokeStyle='rgba(110,56,24,.34)';x.lineWidth=.35;x.beginPath();
    const hy=Y(y)+s*(.45+J(a,y,12)*.3);x.moveTo(X(a),hy);x.lineTo(X(a)+s,hy);
    const vx=X(a)+s*(((a+y)&1)?.3:.7);x.moveTo(vx,Y(y));x.lineTo(vx,hy);const vx2=X(a)+s*(((a+y)&1)?.75:.25);x.moveTo(vx2,hy);x.lineTo(vx2,Y(y)+s);x.stroke()}
  // plum shadow cast by walls onto the floor (north and west walls)
  x.fillStyle='rgba(62,24,64,.40)';
  for(let y=0;y<H;y++)for(let a=0;a<W;a++)if(open[y][a]){
    if(solid(a,y-1))x.fillRect(X(a),Y(y),s,s*.32);
    if(solid(a-1,y))x.fillRect(X(a),Y(y),s*.24,s)}
  x.fillStyle='rgba(62,24,64,.16)';
  for(let y=0;y<H;y++)for(let a=0;a<W;a++)if(open[y][a]){if(solid(a+1,y))x.fillRect(X(a)+s*.82,Y(y),s*.18,s);if(solid(a,y+1))x.fillRect(X(a),Y(y)+s*.84,s,s*.16)}

  // ---- rugs (vermilion with a gold border), inside named rooms ----
  const rug=(a,b,w,h,vert)=>{x.save();x.fillStyle='#a82a1a';x.fillRect(a,b,w,h);x.strokeStyle=GOLD;x.lineWidth=.9;x.strokeRect(a+.5,b+.5,w-1,h-1);x.strokeStyle=INK;x.lineWidth=.5;x.strokeRect(a,b,w,h);
    x.strokeStyle='rgba(240,216,120,.7)';x.lineWidth=.45;x.beginPath();if(vert){for(let t=b+3;t<b+h-2;t+=3.4){x.moveTo(a+w/2-1.2,t);x.lineTo(a+w/2,t-1);x.lineTo(a+w/2+1.2,t)}}else{for(let t=a+3;t<a+w-2;t+=3.4){x.moveTo(t,b+h/2-1.2);x.lineTo(t-1,b+h/2);x.lineTo(t,b+h/2+1.2)}}x.stroke();
    x.strokeStyle=GOLD2;x.lineWidth=.5;x.beginPath();if(vert){for(let t=a+1;t<a+w;t+=1.3){x.moveTo(t,b);x.lineTo(t,b-1.2);x.moveTo(t,b+h);x.lineTo(t,b+h+1.2)}}else{for(let t=b+1;t<b+h;t+=1.3){x.moveTo(a,t);x.lineTo(a-1.2,t);x.moveTo(a+w,t);x.lineTo(a+w+1.2,t)}}x.stroke();x.restore()};
  const RI=L._roomsInfo||[],MN=L.mapNames||[];
  const dec=L.decor.filter(d=>d.k!=='lp_gap'&&!d.secret&&!d.opens&&d.npc!=='hl_shelfdoor'&&!/^(chest|lever|hl_p_note)$/.test(d.k)&&op(d.x,d.y)||(!op(d.x,d.y)&&/^hl_(p_banner|p_window|pt|plq|claw)/.test(d.k)));
  RI.forEach((r,i)=>{const n=r.n||'';
    if(n==='Throne Hall'){const th=dec.find(d=>d.k==='hl_p_throne'&&d.x>=r.x0&&d.x<=r.x1&&d.y>=r.y0&&d.y<=r.y1);if(th)rug(X(th.x)+s*.05,Y(th.y+1)-s*.1,s*.9,s*(r.y1-th.y)+s*.2,true)}
    else if(n==='Banquet Hall'){const w=r.x1-r.x0+1,h=r.y1-r.y0+1;if(w>=h)rug(X(r.x0+1)+s*.2,Y(r.y0+h/2-.5)+s*.1,s*(w-2)-s*.4,s*.8,false);else rug(X(r.x0+w/2-.5)+s*.1,Y(r.y0)+s*.2,s*.8,s*h-s*.4,true)}
    else if(n==='The Study'){rug(X(r.x0+2)+s*.3,Y(r.y0+1)+s*.35,s*2.4,s*2.2,false)}});

  // ---- doors: a gold frame where a corridor meets a room by a gap of one or two cells ----
  const stairCell=(a,b)=>L.rows[b]&&(L.rows[b][a]==='0'||L.rows[b][a]==='1');
  const doorV=(a,b)=>{ // passage runs north-south through a horizontal wall at cell (a,b)
    x.save();x.fillStyle=GOLD;x.strokeStyle=INK;x.lineWidth=.5;for(const px of [X(a)-.3,X(a)+s-1.3]){x.fillRect(px,Y(b)+s*.12,1.6,s*.76);x.strokeRect(px,Y(b)+s*.12,1.6,s*.76)}
    x.fillStyle='#5a2e12';x.beginPath();x.moveTo(X(a)+1.2,Y(b)+s*.5);x.lineTo(X(a)+s*.5,Y(b)+s*.28);x.lineTo(X(a)+s*.5,Y(b)+s*.4);x.lineTo(X(a)+1.2,Y(b)+s*.62);x.closePath();x.fill();x.stroke();
    x.strokeStyle=GOLD2;x.lineWidth=.6;x.beginPath();x.moveTo(X(a),Y(b)+s*.12);x.lineTo(X(a)+s,Y(b)+s*.12);x.stroke();x.restore()};
  const doorH=(a,b)=>{ // passage runs east-west through a vertical wall
    x.save();x.fillStyle=GOLD;x.strokeStyle=INK;x.lineWidth=.5;for(const py of [Y(b)-.3,Y(b)+s-1.3]){x.fillRect(X(a)+s*.12,py,s*.76,1.6);x.strokeRect(X(a)+s*.12,py,s*.76,1.6)}
    x.fillStyle='#5a2e12';x.beginPath();x.moveTo(X(a)+s*.5,Y(b)+1.2);x.lineTo(X(a)+s*.28,Y(b)+s*.5);x.lineTo(X(a)+s*.4,Y(b)+s*.5);x.lineTo(X(a)+s*.62,Y(b)+1.2);x.closePath();x.fill();x.stroke();
    x.strokeStyle=GOLD2;x.lineWidth=.6;x.beginPath();x.moveTo(X(a)+s*.12,Y(b));x.lineTo(X(a)+s*.12,Y(b)+s);x.stroke();x.restore()};
  RI.forEach(r=>{
    for(const [by,dirv] of [[r.y0-1,true],[r.y1+1,true]]){let a=r.x0;while(a<=r.x1){if(op(a,by)&&!stairCell(a,by)){let e=a;while(e+1<=r.x1&&op(e+1,by))e++;if(e-a<=1)for(let q=a;q<=e;q++)doorV(q,by);a=e+1}else a++}}
    for(const bx of [r.x0-1,r.x1+1]){let b=r.y0;while(b<=r.y1){if(op(bx,b)){let e=b;while(e+1<=r.y1&&op(bx,e+1))e++;if(e-b<=1)for(let q=b;q<=e;q++)doorH(bx,q);b=e+1}else b++}}});

  // ---- doubled, wobbly ink along every wall ----
  const edges=(pred,lw,col,seed,off)=>{ // pred(a,b): is this cell on the "inside"; draw where it differs from a neighbour
    x.save();x.strokeStyle=col;x.lineCap='round';x.lineJoin='round';x.lineWidth=lw;x.beginPath();
    const pt=(gx,gy,sd)=>[X(0)+gx*s*.5+J(gx,gy,sd)*s*.12,Y(0)+gy*s*.5+J(gx+50,gy,sd)*s*.12];
    for(let y=0;y<=H;y++){let a=0;while(a<W){const up=pred(a,y-1),dn=pred(a,y);if(up!==dn){let e=a;while(e+1<W&&pred(e+1,y-1)===up&&pred(e+1,y)===dn)e++;
      const sh=(up?1:-1)*off*s*.1;for(let g=a*2;g<=(e+1)*2;g++){const [px,py]=pt(g,y*2,seed);g===a*2?x.moveTo(px,py+sh):x.lineTo(px,py+sh)}a=e+1}else a++}}
    for(let a=0;a<=W;a++){let y=0;while(y<H){const lf=pred(a-1,y),rt=pred(a,y);if(lf!==rt){let e=y;while(e+1<H&&pred(a-1,e+1)===lf&&pred(a,e+1)===rt)e++;
      const sh=(lf?1:-1)*off*s*.1;for(let g=y*2;g<=(e+1)*2;g++){const [px,py]=pt(a*2,g,seed);g===y*2?x.moveTo(px+sh,py):x.lineTo(px+sh,py)}y=e+1}else y++}}
    x.stroke();x.restore()};
  const inside=(a,b)=>op(a,b);
  edges(inside,1.5,INK,21,0);edges(inside,.7,'rgba(42,26,12,.7)',27,1.6);
  const inRock=(a,b)=>a>=0&&b>=0&&a<W&&b<H&&(open[b][a]||rock[b][a])?true:false;
  edges(inRock,1.2,PLUM,31,0);edges(inRock,.6,'rgba(60,30,50,.6)',37,-2);

  // ---- sconces and torches at their real places ----
  for(const l of L.lights){const px=X(l.x!==undefined?l.x:l[0])+s*.5,py=Y(l.y!==undefined?l.y:l[1])+s*.5,red=(l.red!==undefined?l.red:l[2]);
    const g=x.createRadialGradient(px,py,0,px,py,s*2.2);g.addColorStop(0,'rgba(255,200,90,.38)');g.addColorStop(1,'rgba(255,200,90,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,s*2.2,0,6.3);x.fill();
    x.fillStyle=GOLD;x.strokeStyle=INK;x.lineWidth=.5;x.fillRect(px-1.2,py+.2,2.4,1.6);x.strokeRect(px-1.2,py+.2,2.4,1.6);
    x.fillStyle=red?'#e0501e':'#ffd25a';x.beginPath();x.moveTo(px,py-3);x.quadraticCurveTo(px+1.9,py-1,px,py+.4);x.quadraticCurveTo(px-1.9,py-1,px,py-3);x.fill();x.stroke();
    x.fillStyle='#fff3b0';x.beginPath();x.arc(px,py-.8,.55,0,6.3);x.fill()}

  // ---- stairs: little flights, down at the start and up at the far end ----
  const stair=(a,b,up)=>{const px=X(a),py=Y(b);x.save();x.fillStyle='#e6d2a4';x.fillRect(px,py,s,s);x.strokeStyle=INK;x.lineWidth=.6;x.strokeRect(px,py,s,s);
    for(let k=0;k<5;k++){const ty=py+k*s/5;x.fillStyle=`rgba(90,50,30,${.12+k*.07})`;x.fillRect(px,up?ty:py+s-(k+1)*s/5,s,s/5);x.beginPath();x.moveTo(px,ty);x.lineTo(px+s,ty);x.stroke()}
    x.fillStyle=VERM;x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();if(up){x.moveTo(px+s/2,py+s*.12);x.lineTo(px+s*.82,py+s*.55);x.lineTo(px+s*.18,py+s*.55)}else{x.moveTo(px+s/2,py+s*.88);x.lineTo(px+s*.82,py+s*.45);x.lineTo(px+s*.18,py+s*.45)}x.closePath();x.fill();x.stroke();x.restore()};
  for(let y=0;y<H;y++)for(let a=0;a<W;a++){const ch=L.rows[y][a];if(ch==='0')stair(a,y,false);else if(ch==='1')stair(a,y,true)}

  // ---- furniture and wall pieces, drawn small ----
  const drawDec=d=>{const k=d.k;let a=X(d.x)+s*.5,b=Y(d.y)+s*.5;const wd=d.wd||[0,0];
    if(/^hl_(pt|plq|claw|p_window)/.test(k)&&op(d.x,d.y)){a+=wd[0]*s*.55;b+=wd[1]*s*.55}
    x.save();x.strokeStyle=INK;x.lineWidth=.5;
    if(/^hl_(pt|plq)/.test(k)){x.fillStyle=GOLD;x.fillRect(a-1.5,b-2,3,4);x.strokeRect(a-1.5,b-2,3,4);x.fillStyle='#4a2a10';x.beginPath();x.arc(a,b,.8,0,6.3);x.fill();
      if(/plq/.test(k)){x.fillStyle=INK;x.font='bold 3px '+FUI;x.textAlign='center';x.textBaseline='middle';x.fillText('5',a,b+.1)}}
    else if(/^hl_claw/.test(k)){x.strokeStyle='#5a1020';x.lineWidth=.7;x.beginPath();for(const o of [-1.3,0,1.3]){x.moveTo(a+o-.8,b-2.2);x.lineTo(a+o+.8,b+2.2)}x.stroke()}
    else if(k==='hl_p_window'){x.fillStyle='#a8c8e4';x.beginPath();x.moveTo(a-1.4,b+2);x.lineTo(a-1.4,b-.6);x.quadraticCurveTo(a,b-3.2,a+1.4,b-.6);x.lineTo(a+1.4,b+2);x.closePath();x.fill();x.strokeStyle=GOLD;x.lineWidth=.8;x.stroke();x.strokeStyle=INK;x.lineWidth=.3;x.stroke();x.beginPath();x.moveTo(a,b-2);x.lineTo(a,b+2);x.stroke()}
    else if(k==='hl_p_banner'){x.fillStyle=VERM;x.beginPath();x.moveTo(a-1.6,b-2.6);x.lineTo(a+1.6,b-2.6);x.lineTo(a+1.6,b+2.4);x.lineTo(a,b+1.2);x.lineTo(a-1.6,b+2.4);x.closePath();x.fill();x.stroke();x.fillStyle=GOLD2;x.fillRect(a-1.6,b-2.6,3.2,.8);x.beginPath();x.arc(a,b-.2,.7,0,6.3);x.fill()}
    else if(k==='hl_p_candle'){x.fillStyle='#f4ead0';x.fillRect(a-.7,b-.2,1.4,2);x.strokeRect(a-.7,b-.2,1.4,2);x.fillStyle='#ffc040';x.beginPath();x.ellipse(a,b-1.1,.55,.9,0,0,6.3);x.fill()}
    else if(k==='hl_p_cage'){x.fillStyle='rgba(60,50,50,.25)';x.fillRect(a-2.4,b-2.4,4.8,4.8);x.strokeStyle='#3a2e2a';x.lineWidth=.9;x.strokeRect(a-2.4,b-2.4,4.8,4.8);x.lineWidth=.45;x.beginPath();for(const o of [-1.2,0,1.2]){x.moveTo(a+o,b-2.4);x.lineTo(a+o,b+2.4)}x.stroke()}
    else if(k==='hl_p_rack'){x.fillStyle='#7a4a2a';x.fillRect(a-2.4,b-1.6,4.8,3.2);x.strokeRect(a-2.4,b-1.6,4.8,3.2);x.beginPath();x.moveTo(a-2.4,b-1.6);x.lineTo(a+2.4,b+1.6);x.moveTo(a+2.4,b-1.6);x.lineTo(a-2.4,b+1.6);x.stroke()}
    else if(k==='hl_p_throne'){x.fillStyle=GOLD;x.beginPath();x.moveTo(a-2.4,b+2.2);x.lineTo(a-2.4,b-2.6);x.lineTo(a-1.2,b-1.4);x.lineTo(a,b-3);x.lineTo(a+1.2,b-1.4);x.lineTo(a+2.4,b-2.6);x.lineTo(a+2.4,b+2.2);x.closePath();x.fill();x.stroke();x.fillStyle=VERM;x.fillRect(a-1.6,b-.2,3.2,2.2);x.strokeRect(a-1.6,b-.2,3.2,2.2)}
    else if(k==='hl_p_armour'){x.fillStyle='#a8b0bc';x.beginPath();x.arc(a,b-2,1.2,0,6.3);x.fill();x.stroke();x.beginPath();x.moveTo(a-1.8,b-.6);x.lineTo(a+1.8,b-.6);x.lineTo(a+1.2,b+2.4);x.lineTo(a-1.2,b+2.4);x.closePath();x.fill();x.stroke()}
    else if(k==='hl_p_poison'||k==='hl_p_apple'){x.fillStyle='#e8dcc0';x.beginPath();x.arc(a,b,2,0,6.3);x.fill();x.stroke();if(k==='hl_p_apple'){x.fillStyle=VERM;x.beginPath();x.arc(a,b,1,0,6.3);x.fill();x.stroke()}else{x.fillStyle=GOLD;x.fillRect(a-.6,b-1,1.2,1.8);x.beginPath();x.moveTo(a-1.4,b-1.4);x.lineTo(a+1.4,b-1.4);x.lineTo(a+.5,b-.4);x.lineTo(a-.5,b-.4);x.closePath();x.fill();x.stroke()}}
    else if(k==='hl_p_desk'){x.fillStyle='#8a5a30';x.fillRect(a-2.6,b-1.6,5.2,3.2);x.strokeRect(a-2.6,b-1.6,5.2,3.2);x.fillStyle='#f0e6c8';x.fillRect(a-1,b-1,1.8,1.2)}
    else if(k==='hl_p_lectern'){x.fillStyle='#7a4a2a';x.fillRect(a-1.6,b-1.8,3.2,3.6);x.strokeRect(a-1.6,b-1.8,3.2,3.6);x.fillStyle='#f0e6c8';x.fillRect(a-1.2,b-1.4,2.4,1.4)}
    else if(k==='hl_p_shelf'){x.fillStyle='#6a3a1a';x.fillRect(a-2.6,b-1.8,5.2,3.6);x.strokeRect(a-2.6,b-1.8,5.2,3.6);const cols=['#b8321e','#274a9a','#3a7a5a','#c9a227','#b8321e'];cols.forEach((cc,i)=>{x.fillStyle=cc;x.fillRect(a-2.2+i*.9,b-1.4,.7,2.8)})}
    else if(k==='hl_p_coffin'){x.fillStyle='#a8a0b4';x.beginPath();x.moveTo(a-1.2,b-3);x.lineTo(a+1.2,b-3);x.lineTo(a+1.9,b-1);x.lineTo(a+1.2,b+3);x.lineTo(a-1.2,b+3);x.lineTo(a-1.9,b-1);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(a,b-1.8);x.lineTo(a,b+1.8);x.moveTo(a-.9,b-.6);x.lineTo(a+.9,b-.6);x.stroke()}
    else if(k==='hl_p_tomb'){x.fillStyle='#b4acc0';x.fillRect(a-2.4,b-1.8,4.8,3.6);x.strokeRect(a-2.4,b-1.8,4.8,3.6);x.beginPath();x.moveTo(a,b-1);x.lineTo(a,b+1.2);x.moveTo(a-.9,b-.2);x.lineTo(a+.9,b-.2);x.stroke()}
    x.restore()};
  for(const d of dec)drawDec(d);

  // ---- room names, placed where they cover the least ----
  const placed=[];
  const labelRect=(txt,cx,cy,sz)=>{x.save();x.font=`bold ${sz}px ${FUI}`;const w=x.measureText(txt).width;x.restore();return {x0:cx-w/2-1.5,x1:cx+w/2+1.5,y0:cy-sz*.62,y1:cy+sz*.62}};
  MN.forEach((m,i)=>{const r=RI[i];if(!r)return;const txt=m.t,sz=6.2;
    const rcx=X((r.x0+r.x1+1)/2),rcy=Y((r.y0+r.y1+1)/2);let best=null;
    const words=txt.split(' '),twoLine=words.length>=3?[words.slice(0,Math.ceil(words.length/2)).join(' '),words.slice(Math.ceil(words.length/2)).join(' ')]:null;
    for(const variant of (twoLine?[[txt],twoLine]:[[txt]])){
      for(let dy=-7;dy<=7;dy+=.5)for(let dx=-9;dx<=9;dx+=.5){
        const cx=rcx+dx*s,cy=rcy+dy*s,rects=variant.map((t,j)=>labelRect(t,cx,cy+(j-(variant.length-1)/2)*(sz+1.2),sz));
        let sc=Math.hypot(dx,dy)*.3+(variant.length>1?2:0);let bad=false;
        for(const q of rects){if(q.x0<X(0)+1||q.x1>X(W)-1||q.y0<Y(0)+1||q.y1>Y(H)-1){bad=true;break}
          for(const p of placed)if(q.x1>p.x0&&q.x0<p.x1&&q.y1>p.y0&&q.y0<p.y1)sc+=60;
          const a0=Math.floor((q.x0-X(0))/s),a1=Math.floor((q.x1-X(0))/s),b0=Math.floor((q.y0-Y(0))/s),b1=Math.floor((q.y1-Y(0))/s);
          for(let b=b0;b<=b1;b++)for(let a=a0;a<=a1;a++){const inOwn=a>=r.x0&&a<=r.x1&&b>=r.y0&&b<=r.y1;if(op(a,b))sc+=inOwn?0:3;else if(rock[b]&&rock[b][a])sc+=.6}
          {const sx=X(L._start.x)+s*.5,sy=Y(L._start.y)+s*.5;if(sx>q.x0-3&&sx<q.x1+3&&sy>q.y0-4&&sy<q.y1+4)sc+=6}
          for(const d of dec){const dx2=X(d.x)+s*.5,dy2=Y(d.y)+s*.5;if(dx2>q.x0-1&&dx2<q.x1+1&&dy2>q.y0-1&&dy2<q.y1+1)sc+=1.2}}
        if(bad)continue;if(!best||sc<best.sc)best={sc,cx,cy,variant,rects}}}
    if(best){best.variant.forEach((t,j)=>api.text(x,t,best.cx,best.cy+(j-(best.variant.length-1)/2)*(sz+1.2),sz,'#3a1408'));placed.push(...best.rects)}});

  // ---- a little spire in the empty corner: twenty floors, this one marked ----
  {const bx=32,by0=296,fh=3.1;x.save();
    for(let f=0;f<20;f++){const w=36-f*1.05,y=by0-f*fh;x.fillStyle=f===4?GOLD:(f%2?'#b4662c':'#c47a3a');x.strokeStyle=INK;x.lineWidth=.5;x.fillRect(bx-w/2,y-fh,w,fh);x.strokeRect(bx-w/2,y-fh,w,fh);
      if(f!==4){x.fillStyle='#3a2010';const nn=Math.max(2,Math.floor(w/9));for(let q=0;q<nn;q++)x.fillRect(bx-w/2+(q+.5)*w/nn-.5,y-fh*.78,1,fh*.5)}}
    const topw=36-19*1.05,ty=by0-20*fh;x.fillStyle=VERM;x.beginPath();x.moveTo(bx-topw/2-1,ty);x.lineTo(bx,ty-10);x.lineTo(bx+topw/2+1,ty);x.closePath();x.fill();x.stroke();
    x.strokeStyle=INK;x.lineWidth=.7;x.beginPath();x.moveTo(bx,ty-10);x.lineTo(bx,ty-15);x.stroke();x.fillStyle=GOLD;x.beginPath();x.moveTo(bx,ty-15);x.lineTo(bx+6,ty-13.5);x.lineTo(bx,ty-12);x.closePath();x.fill();x.stroke();
    const fy=by0-4*fh-fh/2;x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.moveTo(bx+17,fy);x.lineTo(bx+22,fy);x.stroke();api.text(x,'Floor 5',bx+24,fy-3.4,6.4,'#3a1408','left');api.text(x,'of 20',bx+24,fy+3.4,6.4,'#3a1408','left');
    x.fillStyle=INK;for(const [ax,ay] of [[bx+30,by0-70],[bx+40,by0-78],[bx-20,by0-60]]){x.beginPath();x.moveTo(ax-3,ay);x.quadraticCurveTo(ax-1.5,ay-2.4,ax,ay);x.quadraticCurveTo(ax+1.5,ay-2.4,ax+3,ay);x.quadraticCurveTo(ax+1.5,ay-.8,ax,ay+.8);x.quadraticCurveTo(ax-1.5,ay-.8,ax-3,ay);x.fill()}
    x.restore()}

  // ---- title, key, notes, compass ----
  api.title(x,'The Orange Spire, Floor 5','Gallery, halls, cells and crypts');
  api.compass(x,436,262,12);
  {const rows=[['door','Door'],['sconce','Torch or candle sconce'],['rug','Rug'],['plaque','Plaque or portrait'],['coffin','Coffin or tomb'],['down','Stair down'],['up','Stair up']];
    const ph=14+rows.length*12;api.panel(x,8,66,80,ph);api.text(x,'Key',48,75,7,'#3a1408');
    rows.forEach(([k,t],i)=>{const ry=88+i*12,ix=18;x.save();x.strokeStyle=INK;x.lineWidth=.5;
      if(k==='door'){x.fillStyle=GOLD;x.fillRect(ix-4,ry-3,1.6,6);x.strokeRect(ix-4,ry-3,1.6,6);x.fillRect(ix+2.4,ry-3,1.6,6);x.strokeRect(ix+2.4,ry-3,1.6,6);x.fillStyle='#5a2e12';x.fillRect(ix-2,ry-1,3,1.4)}
      else if(k==='sconce'){x.fillStyle=GOLD;x.fillRect(ix-1.2,ry+.4,2.4,1.6);x.strokeRect(ix-1.2,ry+.4,2.4,1.6);x.fillStyle='#ffd25a';x.beginPath();x.moveTo(ix,ry-3);x.quadraticCurveTo(ix+1.9,ry-1,ix,ry+.6);x.quadraticCurveTo(ix-1.9,ry-1,ix,ry-3);x.fill();x.stroke()}
      else if(k==='rug'){x.fillStyle='#a82a1a';x.fillRect(ix-5,ry-2.5,10,5);x.strokeStyle=GOLD;x.lineWidth=.8;x.strokeRect(ix-4.5,ry-2,9,4)}
      else if(k==='plaque'){x.fillStyle=GOLD;x.fillRect(ix-1.5,ry-2,3,4);x.strokeRect(ix-1.5,ry-2,3,4);x.fillStyle='#4a2a10';x.beginPath();x.arc(ix,ry,.8,0,6.3);x.fill()}
      else if(k==='coffin'){drawDec({k:'hl_p_coffin',x:(ix-X(0)-s*.5)/s,y:(ry-Y(0)-s*.5)/s})}
      else{stairKey(ix,ry,k==='up')}
      x.restore();api.text(x,t,ix+11,ry,5.8,'#3a1408','left')});
    function stairKey(ix,ry,up){x.fillStyle='#e6d2a4';x.fillRect(ix-4,ry-4,8,8);x.strokeRect(ix-4,ry-4,8,8);x.beginPath();for(let q=1;q<4;q++){x.moveTo(ix-4,ry-4+q*2);x.lineTo(ix+4,ry-4+q*2)}x.stroke();x.fillStyle=VERM;x.beginPath();if(up){x.moveTo(ix,ry-3);x.lineTo(ix+2.6,ry+1);x.lineTo(ix-2.6,ry+1)}else{x.moveTo(ix,ry+3);x.lineTo(ix+2.6,ry-1);x.lineTo(ix-2.6,ry-1)}x.closePath();x.fill();x.stroke()}}
  {const notes=['You arrive by the stair at the bottom of the plan.','A long hall runs east and west across the middle of the floor.','Halls, a study, cells and two crypts open off it.','The stair up is at the far north end, down a narrow corridor.','Torches and candles light the halls.'];
    api.panel(x,392,34,84,150);api.notes(x,notes,397,46,74,6,3.5)}
}
mplInstall({name:'os444',levels:[444],reveal:true,draw:mpOs444Draw});
