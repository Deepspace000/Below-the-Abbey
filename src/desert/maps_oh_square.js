/* Oldhaven map section square (order 11): the Great Square, Market Square, the gardens and lanes round them, the town hall and guild halls on the north side,
   the inns and baths on the south side, stalls, crowds, paving. Cells roughly x 55..135, y 40..65 of level 305. Names start with mpOhSquare. */
MPOH.push({order:11,name:'square',paint(x,L,api,fit){
  const S=fit.s,X=fit.X,Y=fit.Y,INK='#2a1a0c',B={x0:53,x1:137,y0:38,y1:67};
  const hz=(a,b,k)=>hash2(a,b,400+k);
  const solid=(cx,cy)=>{const r=L.rows[cy];return !r||cx<0||cx>=r.length||r[cx]!=='.'};
  const fm=(cx,cy)=>{const r=L.fmap&&L.fmap[cy];return r?r[cx]:'0'};
  const cls=(cx,cy)=>{if(solid(cx,cy))return 'W';const f=fm(cx,cy);return f==='1'?'P':(f==='2'||f==='5'||f==='3')?'G':'S'};
  x.beginPath();x.rect(X(B.x0),Y(B.y0),(B.x1-B.x0)*S,(B.y1-B.y0)*S);x.clip();
  const wob=(a,b,c,d,w,col,j)=>{j=j||.18*S;x.strokeStyle=col||INK;x.lineWidth=w||.3;x.beginPath();x.moveTo(a,b);const n=Math.max(1,Math.round(Math.hypot(c-a,d-b)/(S*2.5)));for(let i=1;i<=n;i++){const t=i/n;x.lineTo(a+(c-a)*t+(hz(a+i,b,1)-.5)*j,b+(d-b)*t+(hz(c,d+i,2)-.5)*j)}x.stroke()};
  const lab=(t,cx,cy,sz,col,mw)=>{x.save();x.font=`bold ${sz}px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=Math.max(.8,sz*.34);x.strokeStyle='rgba(238,226,190,.93)';x.strokeText(t,X(cx),Y(cy),mw);x.fillStyle=col||INK;x.fillText(t,X(cx),Y(cy),mw);x.restore()};
  const dot=(a,b,r,col,ol)=>{x.fillStyle=col;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();if(ol){x.strokeStyle=INK;x.lineWidth=ol;x.stroke()}};

  /* ---- 1. ground: street cobbles, dirt lanes, lawns in soft overlapping washes, paving ---- */
  for(let cy=B.y0;cy<=B.y1;cy++)for(let cx=B.x0;cx<=B.x1;cx++){
    if(solid(cx,cy))continue;const f=fm(cx,cy),a=X(cx),b=Y(cy),r=hz(cx,cy,3);let col;
    if(f==='1')col=r<.5?'#d3c7a8':'#d8ccae';
    else if(f==='2')col=r<.5?'#a8b680':'#9fb078';
    else if(f==='5')col=r<.5?'#a9b97f':'#b0ba7e';
    else if(f==='3')col='#8fa570';
    else if(f==='4')col=r<.5?'#cdb585':'#c4aa7a';
    else col=r<.5?'#dcd0b0':'#d6c9a6';
    x.fillStyle=col;x.fillRect(a-.25,b-.25,S+.5,S+.5)}
  /* lawn softening: blobs along the lawn edges and tufts of grass */
  for(let cy=B.y0;cy<=B.y1;cy++)for(let cx=B.x0;cx<=B.x1;cx++){
    if(cls(cx,cy)!=='G')continue;const r=hz(cx,cy,4);
    if(r<.42){x.strokeStyle='rgba(60,95,50,.55)';x.lineWidth=.22;const a=X(cx+hz(cx,cy,5)),b=Y(cy+.8*hz(cx,cy,6)+.2);x.beginPath();x.moveTo(a-.35,b);x.lineTo(a-.5,b-.9);x.moveTo(a,b);x.lineTo(a,b-1.1);x.moveTo(a+.35,b);x.lineTo(a+.55,b-.9);x.stroke()}
    if(fm(cx,cy)==='5'&&r>.5)dot(X(cx+hz(cx,cy,7)),Y(cy+hz(cx,cy,8)),.38,['#e8b0b8','#f0dc7a','#fff','#c9a2d8'][(r*8|0)%4])}
  /* street cobble flecks and dirt specks */
  for(let cy=B.y0;cy<=B.y1;cy++)for(let cx=B.x0;cx<=B.x1;cx++){
    const c=cls(cx,cy);if(c!=='S')continue;const r=hz(cx,cy,9);
    if(r<.5){x.fillStyle=fm(cx,cy)==='4'?'rgba(110,80,40,.35)':'rgba(120,100,70,.28)';x.beginPath();x.ellipse(X(cx+hz(cx,cy,10)),Y(cy+hz(cx,cy,11)),.55,.38,hz(cx,cy,12)*3,0,6.3);x.fill()}}

  /* ---- 2. paving of the two squares: brick bond joints, an inlay border, rings and a star ---- */
  const paved=[[60,43,90,59],[103,44,116,58]];
  for(const [a0,b0,a1,b1] of paved){
    x.save();x.beginPath();x.rect(X(a0),Y(b0),(a1-a0)*S,(b1-b0)*S);x.clip();
    for(let cy=b0;cy<b1;cy++){const off=(cy&1)?.5:0;
      for(let cx=a0;cx<a1;cx++){if(fm(cx,cy)!=='1')continue;
        wob(X(cx),Y(cy),X(cx+1),Y(cy),.16,'rgba(110,90,60,.32)',.1);
        x.strokeStyle='rgba(110,90,60,.24)';x.lineWidth=.14;x.beginPath();x.moveTo(X(cx+off),Y(cy));x.lineTo(X(cx+off),Y(cy+1));x.stroke()}}
    x.restore()}
  /* Great Square: a border band of terracotta and cream, then concentric rings round the fountain */
  {const a0=60,a1=90,b0=43,b1=59,cx=74.5,cy=51.5;
    x.save();x.beginPath();x.rect(X(a0),Y(b0),(a1-a0)*S,(b1-b0)*S);x.clip();
    x.lineWidth=.9*S;x.strokeStyle='rgba(196,140,98,.55)';x.strokeRect(X(a0+1.2),Y(b0+1.2),(a1-a0-2.4)*S,(b1-b0-2.4)*S);
    x.lineWidth=.3*S;x.strokeStyle='rgba(240,232,208,.9)';x.strokeRect(X(a0+.55),Y(b0+.55),(a1-a0-1.1)*S,(b1-b0-1.1)*S);
    x.setLineDash([.5*S,.5*S]);x.lineWidth=.22*S;x.strokeStyle='rgba(110,70,40,.6)';x.strokeRect(X(a0+1.2),Y(b0+1.2),(a1-a0-2.4)*S,(b1-b0-2.4)*S);x.setLineDash([]);
    for(const [r,w,c] of [[9.4,.5,'rgba(196,140,98,.5)'],[7.6,.25,'rgba(110,70,40,.45)'],[6.2,.9,'rgba(240,232,208,.85)'],[4.6,.35,'rgba(196,140,98,.55)']]){x.lineWidth=w*S;x.strokeStyle=c;x.beginPath();x.arc(X(cx),Y(cy),r*S,0,6.3);x.stroke()}
    x.strokeStyle='rgba(110,70,40,.5)';x.lineWidth=.2*S;for(let k=0;k<16;k++){const an=k*Math.PI/8+.2,r0=4.6,r1=k%2?6.2:7.6;x.beginPath();x.moveTo(X(cx+Math.cos(an)*r0),Y(cy+Math.sin(an)*r0));x.lineTo(X(cx+Math.cos(an)*r1),Y(cy+Math.sin(an)*r1));x.stroke()}
    /* eight-point star inlay in gold wash */
    x.fillStyle='rgba(201,162,39,.4)';x.strokeStyle='rgba(110,80,20,.6)';x.lineWidth=.18*S;x.beginPath();for(let k=0;k<16;k++){const r=(k%2?3.1:5.4)*S,an=-Math.PI/2+k*Math.PI/8;k?x.lineTo(X(cx)+Math.cos(an)*r,Y(cy)+Math.sin(an)*r):x.moveTo(X(cx)+Math.cos(an)*r,Y(cy)+Math.sin(an)*r)}x.closePath();x.fill();x.stroke();
    x.restore()}
  /* Market Square: a chequer of paler stones round the edge and a ring about the well */
  {x.save();x.beginPath();x.rect(X(103),Y(44),13*S,14*S);x.clip();
    for(let cy=44;cy<58;cy++)for(let cx=103;cx<116;cx++){if(((cx+cy)&1)||(cx>104&&cx<114&&cy>45&&cy<56))continue;x.fillStyle='rgba(196,150,110,.28)';x.fillRect(X(cx),Y(cy),S,S)}
    x.lineWidth=.35*S;x.strokeStyle='rgba(240,232,208,.8)';x.beginPath();x.arc(X(108.5),Y(48.5),2.4*S,0,6.3);x.stroke();x.lineWidth=.2*S;x.strokeStyle='rgba(110,70,40,.5)';x.beginPath();x.arc(X(108.5),Y(48.5),3*S,0,6.3);x.stroke();x.restore()}

  /* ---- 3. edges where one kind of ground meets another: kerb stones and lawn fringes ---- */
  for(let cy=B.y0;cy<=B.y1;cy++)for(let cx=B.x0;cx<=B.x1;cx++){
    const c=cls(cx,cy);if(c==='W')continue;
    for(const [dx,dy] of [[1,0],[0,1]]){const d=cls(cx+dx,cy+dy);if(d===c||d==='W')continue;
      const a=dx?X(cx+1):X(cx),b=dx?Y(cy):Y(cy+1),a2=dx?X(cx+1):X(cx+1),b2=dx?Y(cy+1):Y(cy+1);
      const isP=c==='P'||d==='P';
      wob(a,b,a2,b2,isP?.4:.28,isP?'rgba(70,50,30,.7)':'rgba(70,100,50,.6)',.2);
      if(isP&&hz(cx,cy,13)<.8)wob(a+(dx?.3:0),b+(dx?0:.3),a2+(dx?.3:0),b2+(dx?0:.3),.15,'rgba(250,244,224,.55)',.1)}}

  /* ---- 4. gardens: hedges, flower beds, the pergola and wells; shrubs and flowers from the real decor ---- */
  const D=L.decor.filter(e=>e.x>=B.x0-1&&e.x<=B.x1+1&&e.y>=B.y0-1&&e.y<=B.y1+1);
  for(const e of D){const k=e.k;if(!/ohgard/.test(k))continue;const a=X(e.x+.5),b=Y(e.y+.5),r=hz(e.x,e.y,14);
    if(/_(1|3)$/.test(k)){dot(a,b,.62,'#587a42',.22);dot(a-.2,b-.2,.3,'#7a9a5a');if(r>.5)dot(a+.3,b+.1,.2,['#e8b0b8','#f0dc7a','#e8e0d0'][(r*9|0)%3])}
    else if(/_(0|2)$/.test(k)){dot(a,b,.5,'#6a8a4a',.2);dot(a,b,.25,['#d86a6a','#e8c85a','#a88ad0'][(r*9|0)%3])}
    else{x.fillStyle='#5a7a44';x.fillRect(a-.9,b-.45,1.8,.9);x.strokeStyle=INK;x.lineWidth=.2;x.strokeRect(a-.9,b-.45,1.8,.9);dot(a-.4,b,.22,'#e8a0a8');dot(a+.3,b,.22,'#f0dc7a')}}
  for(const e of D){if(e.k!=='oh_topiary')continue;const a=X(e.x+.5),b=Y(e.y+.5);dot(a,b,.8,'#3f6a3c',.25);dot(a-.25,b-.25,.3,'#5f8a52')}
  for(const e of D){if(e.k!=='oh_pergola')continue;const a=X(e.x+.5),b=Y(e.y+.5);
    x.fillStyle='rgba(120,84,48,.35)';x.fillRect(a-2.4,b-1.6,4.8,3.2);x.strokeStyle='#6a4a28';x.lineWidth=.3;x.strokeRect(a-2.4,b-1.6,4.8,3.2);
    for(let i=-2;i<=2;i++)wob(a+i*.9,b-1.6,a+i*.9,b+1.6,.22,'#6a4a28',.05);for(let i=0;i<10;i++)dot(a-2.2+hz(i,e.x,15)*4.4,b-1.4+hz(i,e.y,16)*2.8,.32,i%3?'#4d7a46':'#c46a86')}
  const well=(a,b,r)=>{dot(a,b,r*1.15,'#a69a82',.3);dot(a,b,r*.8,'#5a86b0',.2);x.strokeStyle='rgba(235,245,255,.8)';x.lineWidth=.14;x.beginPath();x.arc(a,b,r*.45,0,3.6);x.stroke();for(let k=0;k<8;k++){const an=k*.785;dot(a+Math.cos(an)*r*1.0,b+Math.sin(an)*r*1.0,.18,'#8f836a')}};
  for(const e of D)if(e.k==='oh_well'&&!solid(e.x,e.y))well(X(e.x+.5),Y(e.y+.5),e.x===108?1.2:1.0);

  /* ---- 5. the fountain in the Great Square: an eight-sided basin, water, a tier, a gilded spout ---- */
  {const a=X(74.5),b=Y(51.5),oct=(r,col,w)=>{x.beginPath();for(let k=0;k<8;k++){const an=Math.PI/8+k*Math.PI/4;k?x.lineTo(a+Math.cos(an)*r,b+Math.sin(an)*r):x.moveTo(a+Math.cos(an)*r,b+Math.sin(an)*r)}x.closePath();x.fillStyle=col;x.fill();x.strokeStyle=INK;x.lineWidth=w;x.stroke()};
    x.fillStyle='rgba(60,40,20,.25)';x.beginPath();x.ellipse(a+.5,b+.7,4.9,4.6,0,0,6.3);x.fill();
    oct(4.7,'#cfc6ae',.5);oct(3.9,'#7aa6cc',.35);
    x.strokeStyle='rgba(240,250,255,.7)';x.lineWidth=.16;for(const r of [2.6,3.2,3.6]){x.beginPath();x.arc(a,b,r,hz(r,1,17)*6,hz(r,1,17)*6+2.2);x.stroke()}
    oct(1.9,'#d8d0b8',.4);oct(1.3,'#8db4d8',.25);dot(a,b,.55,MPL.GOLD,.25);dot(a-.15,b-.15,.2,'#fff0a0');
    for(let k=0;k<4;k++){const an=k*Math.PI/2+.4;dot(a+Math.cos(an)*3.1,b+Math.sin(an)*3.1,.4,'#d8d0b8',.2);dot(a+Math.cos(an)*3.1,b+Math.sin(an)*3.1,.15,'#cfe8ff')}}

  /* ---- 6. the market: stalls with striped awnings, goods, crates, a cart ---- */
  const AW=[['#b8321e','#f0e4c4'],['#274a9a','#f0e4c4'],['#c9a227','#f0e4c4'],['#3a7a5a','#f0e4c4']];
  for(const e of D){if(!/stall/.test(e.k))continue;const cx=e.x+.5,cy=e.y+.5,a=X(cx),b=Y(cy),w=2.5,h=1.7,c=AW[(hz(e.x,e.y,18)*4)|0];
    x.fillStyle='rgba(50,34,20,.3)';x.fillRect(a-w+.3,b-h+.45,w*2,h*2);
    x.fillStyle='#8a6a42';x.fillRect(a-w,b-h,w*2,h*2);
    for(let i=0;i<5;i++){x.fillStyle=i&1?c[1]:c[0];x.fillRect(a-w+i*w*2/5,b-h+.2,w*2/5,h*2-.2)}
    x.strokeStyle=INK;x.lineWidth=.28;x.strokeRect(a-w,b-h,w*2,h*2);x.beginPath();x.moveTo(a-w,b-h+.55);x.lineTo(a+w,b-h+.55);x.stroke();
    for(let i=0;i<5;i++){x.fillStyle=i&1?c[1]:c[0];x.beginPath();x.arc(a-w+(i+.5)*w*2/5,b+h,w/5,0,Math.PI);x.fill();x.stroke()}
    const g=hz(e.x,e.y,19);for(let i=0;i<3;i++)dot(a-1.4+i*1.4,b+h+1.1,.34,['#c0502a','#e0b840','#7a9a3a','#a06a3a'][((g*7)|0+i)%4],.15)}
  for(const [cx,cy] of [[102.3,55.2],[115.2,45.3],[103.2,56.5],[114.4,56.2]]){x.fillStyle='#8a6a42';x.fillRect(X(cx),Y(cy),1.3,1.3);x.strokeStyle=INK;x.lineWidth=.18;x.strokeRect(X(cx),Y(cy),1.3,1.3);wob(X(cx),Y(cy)+.65,X(cx)+1.3,Y(cy)+.65,.14,INK,.02)}
  const cart=(cx,cy,fl)=>{const a=X(cx),b=Y(cy);x.fillStyle='#8a5e34';x.fillRect(a-1.5,b-.9,3,1.8);x.strokeStyle=INK;x.lineWidth=.22;x.strokeRect(a-1.5,b-.9,3,1.8);x.fillStyle='#d8c070';x.fillRect(a-1.1,b-.5,2.2,.9);wob(a+(fl?1.5:-1.5),b,a+(fl?3:-3),b,.22,INK,.05);dot(a-.9,b+1.05,.5,'#4a3220',.15);dot(a+.9,b+1.05,.5,'#4a3220',.15)};

  /* ---- 7. buildings: every wall block is cut into houses, each with a tiled roof, ridge, shadow and chimney ---- */
  const ROOFS=[['#c76d45','#a9532f'],['#b9573a','#9a4326'],['#d08258','#b4653c'],['#6f7a86','#58626e'],['#8a8f98','#6e737c'],['#b89a54','#9a7e3c']];
  const seen=new Set(),comps=[];
  for(let cy=B.y0;cy<=B.y1;cy++)for(let cx=B.x0;cx<=B.x1;cx++){if(!solid(cx,cy)||seen.has(cx+','+cy))continue;const st=[[cx,cy]];seen.add(cx+','+cy);let x0=cx,y0=cy,x1=cx,y1=cy;
    while(st.length){const [p,q]=st.pop();x0=Math.min(x0,p);y0=Math.min(y0,q);x1=Math.max(x1,p);y1=Math.max(y1,q);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const u=p+dx,v=q+dy;if(u<B.x0||u>B.x1||v<B.y0||v>B.y1||!solid(u,v)||seen.has(u+','+v))continue;seen.add(u+','+v);st.push([u,v])}}
    comps.push({x0,y0,x1:x1+1,y1:y1+1})}
  const roof=(x0,y0,x1,y1,pal,ridgeV,n)=>{const a=X(x0)+.25,b=Y(y0)+.25,w=(x1-x0)*S-.5,h=(y1-y0)*S-.5;
    x.fillStyle='rgba(50,34,20,.3)';x.fillRect(a+.6,b+.7,w,h);
    x.fillStyle='#e6dcc0';x.fillRect(a,b,w,h);
    const ins=.3;x.fillStyle=pal[0];x.fillRect(a+ins,b+ins,w-ins*2,h-ins*2);
    x.fillStyle=pal[1];if(ridgeV){x.fillRect(a+w/2,b+ins,w/2-ins,h-ins*2)}else{x.fillRect(a+ins,b+h/2,w-ins*2,h/2-ins)}
    x.strokeStyle='rgba(60,30,15,.35)';x.lineWidth=.14;const step=1.05;
    if(ridgeV){for(let t=b+step;t<b+h-.3;t+=step){x.beginPath();x.moveTo(a+ins,t);x.lineTo(a+w-ins,t);x.stroke()}}else{for(let t=a+step;t<a+w-.3;t+=step){x.beginPath();x.moveTo(t,b+ins);x.lineTo(t,b+h-ins);x.stroke()}}
    x.strokeStyle=INK;x.lineWidth=.38;x.strokeRect(a,b,w,h);
    if(ridgeV)wob(a+w/2,b+ins,a+w/2,b+h-ins,.4,INK,.1);else wob(a+ins,b+h/2,a+w-ins,b+h/2,.4,INK,.1);
    if(n>.5){const cxp=a+w*(.2+.6*hz(x0,y0,20)),cyp=b+h*(.2+.6*hz(x1,y1,21));x.fillStyle='#8a8070';x.fillRect(cxp-.5,cyp-.5,1,1);x.strokeStyle=INK;x.lineWidth=.18;x.strokeRect(cxp-.5,cyp-.5,1,1)}};
  const townhall=c=>{/* large block north east of the castle road: copper-green hall with a clock tower and banners */
    const a=X(c.x0),b=Y(c.y0),w=(c.x1-c.x0)*S,h=(c.y1-c.y0)*S;x.fillStyle='rgba(50,34,20,.3)';x.fillRect(a+.7,b+.8,w,h);
    x.fillStyle='#e6dcc0';x.fillRect(a,b,w,h);x.fillStyle='#6a9a86';x.fillRect(a+.4,b+.4,w-.8,h-.8);x.fillStyle='#548270';x.fillRect(a+.4,b+h/2,w-.8,h/2-.4);
    x.strokeStyle='rgba(20,50,40,.4)';x.lineWidth=.14;for(let t=a+1.2;t<a+w-.5;t+=1.1){x.beginPath();x.moveTo(t,b+.4);x.lineTo(t,b+h-.4);x.stroke()}
    x.strokeStyle=INK;x.lineWidth=.45;x.strokeRect(a,b,w,h);wob(a+.4,b+h/2,a+w-.4,b+h/2,.4,INK,.1);
    /* wings step out, gold finials along the ridge */
    for(let i=0;i<6;i++){const fx=a+w*(.12+.15*i);dot(fx,b+h/2,.35,MPL.GOLD,.14)}
    const tx=a+w*.5,ty=b+h-.4;x.fillStyle='rgba(50,34,20,.3)';x.fillRect(tx-3.2,ty-3.9,6.4,6.4);x.fillStyle='#d8cfb8';x.fillRect(tx-3,ty-4.4,6,6);x.strokeStyle=INK;x.lineWidth=.4;x.strokeRect(tx-3,ty-4.4,6,6);
    x.fillStyle='#6a9a86';x.beginPath();x.moveTo(tx-2.2,ty-3.6);x.lineTo(tx,ty-5.5);x.lineTo(tx+2.2,ty-3.6);x.closePath();x.fill();x.stroke();
    dot(tx,ty-1.4,1.3,'#f0e8cc',.3);x.strokeStyle=INK;x.lineWidth=.2;x.beginPath();x.moveTo(tx,ty-1.4);x.lineTo(tx,ty-2.3);x.moveTo(tx,ty-1.4);x.lineTo(tx+.8,ty-1.2);x.stroke();
    x.fillStyle='#b8321e';x.beginPath();x.moveTo(tx,ty-5.5);x.lineTo(tx,ty-7.3);x.lineTo(tx+1.8,ty-6.7);x.lineTo(tx,ty-6.1);x.fill();x.stroke();
    for(const dx of [-1,1]){const px=a+w*.5+dx*w*.3;x.fillStyle='#d8cfb8';x.fillRect(px-1.3,b+h-1.2,2.6,2.4);x.strokeRect(px-1.3,b+h-1.2,2.6,2.4)}};
  const wallrun=c=>{/* the long low wall on the west of the castle road: stone with battlement notches and buttresses */
    const a=X(c.x0),b=Y(c.y0),w=(c.x1-c.x0)*S,h=(c.y1-c.y0)*S;x.fillStyle='rgba(50,34,20,.3)';x.fillRect(a+.4,b+.6,w,h);x.fillStyle='#cfc6ae';x.fillRect(a,b,w,h);
    x.fillStyle='#b8ae94';x.fillRect(a,b+h*.45,w,h*.55);x.strokeStyle=INK;x.lineWidth=.35;x.strokeRect(a,b,w,h);
    for(let t=a+.3;t<a+w-.6;t+=1.3){x.fillStyle='#e0d8c0';x.fillRect(t,b+h-.7,.8,.7);x.strokeStyle='rgba(42,26,12,.6)';x.lineWidth=.12;x.strokeRect(t,b+h-.7,.8,.7)}
    for(let t=a+3;t<a+w-1;t+=6){x.fillStyle='#a89e84';x.fillRect(t,b+h*.25,.9,h*.9);x.strokeStyle=INK;x.lineWidth=.2;x.strokeRect(t,b+h*.25,.9,h*.9)}};
  for(const c of comps){const w=c.x1-c.x0,h=c.y1-c.y0;
    if(c.x0>=52&&c.x1<=73&&h<=2&&w>=18){wallrun(c);continue}
    if(c.x0===76&&w>=20){townhall(c);continue}
    /* cut into houses by width, 5 to 8 cells each */
    const parts=[];if(w<=9||h>w*1.4)parts.push([c.x0,c.x1]);else{let p=c.x0;while(p<c.x1){let q=Math.min(c.x1,p+5+((hz(p,c.y0,22)*4)|0));if(c.x1-q<4)q=c.x1;parts.push([p,q]);p=q}}
    for(const [p,q] of parts){const pal=ROOFS[(hz(p,c.y0,23)*ROOFS.length)|0];roof(p,c.y0,q,c.y1,pal,(q-p)>=(c.y1-c.y0)?false:true,hz(q,c.y1,24));
      /* a little door mark on the street side */
      const north=c.y0<45;const dx=X(p+(q-p)/2),dy=north?Y(c.y1)-.2:Y(c.y0)+.2;x.fillStyle='#4a3220';x.fillRect(dx-.5,dy-(north?.8:0),1,.8)}}

  /* ---- 8. trees, lamps, banners, pillars ---- */
  for(const e of D){if(!/^ltree/.test(e.k)||solid(e.x,e.y))continue;const a=X(e.x+.5),b=Y(e.y+.5),r=hz(e.x,e.y,25),R=1.5+r*.8;
    x.fillStyle='rgba(40,60,30,.3)';x.beginPath();x.arc(a+.5,b+.6,R,0,6.3);x.fill();
    dot(a,b,R,['#4f7f3f','#5a8a46','#6a8f4a','#456f3a'][(r*4)|0],.28);dot(a-R*.3,b-R*.3,R*.5,'rgba(190,220,140,.5)');
    for(let i=0;i<4;i++)dot(a+(hz(i,e.x,26)-.5)*R,b+(hz(i,e.y,27)-.5)*R,.22,'rgba(30,60,30,.5)')}
  for(const e of D){if(e.k!=='lamp'||solid(e.x,e.y))continue;const a=X(e.x+.5),b=Y(e.y+.5);dot(a,b,1.2,'rgba(255,224,120,.28)');dot(a,b,.42,MPL.GOLD2,.18)}
  for(const e of D){if(e.k!=='oh_banner')continue;const a=X(e.x+.5),b=Y(e.y+.5);x.strokeStyle=INK;x.lineWidth=.25;x.beginPath();x.moveTo(a,b+1);x.lineTo(a,b-1.8);x.stroke();x.fillStyle='#b8321e';x.beginPath();x.moveTo(a,b-1.8);x.lineTo(a+1.8,b-1.3);x.lineTo(a+1.2,b-.7);x.lineTo(a+1.8,b-.1);x.lineTo(a,b-.3);x.closePath();x.fill();x.stroke();dot(a,b-1.9,.25,MPL.GOLD)}
  for(const e of D){if(!/city2_1/.test(e.k))continue;const a=X(e.x+.5),b=Y(e.y+.5);x.fillStyle='rgba(50,34,20,.3)';x.fillRect(a-.7,b-.5,1.8,1.8);x.fillStyle='#d8cfb8';x.fillRect(a-.9,b-.9,1.8,1.8);x.strokeStyle=INK;x.lineWidth=.25;x.strokeRect(a-.9,b-.9,1.8,1.8);dot(a,b,.45,MPL.GOLD,.14)}

  /* ---- 9. carts, ruts along the cart lanes, barrels ---- */
  for(const ly of [42.5,58.5]){let on=true;for(let cx=B.x0+1;cx<B.x1;cx+=1){if(solid(cx,Math.floor(ly))){continue}
      if(hz(cx,ly,28)<.25)on=!on;if(!on)continue;
      for(const o of [-.35,.35]){const a=X(cx),b=Y(ly+o);x.strokeStyle='rgba(110,80,50,.5)';x.lineWidth=.18;x.beginPath();x.moveTo(a,b);x.lineTo(a+S,b+(hz(cx,o,29)-.5)*.3);x.stroke()}}}
  cart(66,42.6,true);cart(96.5,58.5,false);cart(122,43,true);cart(80,58.6,false);cart(110.5,43,false);
  for(const [cx,cy] of [[100.8,43.8],[116.2,43.6],[102.3,58.1],[116.4,58.3],[89.6,58.3],[61.2,58.4]]){const a=X(cx),b=Y(cy);dot(a,b,.7,'#8a5e34',.22);x.strokeStyle='rgba(42,26,12,.7)';x.lineWidth=.15;x.beginPath();x.arc(a,b,.4,0,6.3);x.stroke()}

  /* ---- 10. crowds as tiny dots: townsfolk in all colours, guards in vermilion with a spear ---- */
  const CL=['#274a9a','#b8321e','#3a7a5a','#c9a227','#7a4a2a','#6a5a8a','#d8cfb8','#a05a8a','#2f5a6a'];
  for(const e of D){if(!/ohfolk|ohsold/.test(e.k)||e.x<B.x0||e.x>B.x1||e.y<B.y0||e.y>B.y1||solid(e.x,e.y))continue;
    const a=X(e.x+.3+hz(e.x,e.y,30)*.4),b=Y(e.y+.3+hz(e.x,e.y,31)*.4);
    if(/ohsold/.test(e.k)){x.strokeStyle='#5a4a3a';x.lineWidth=.18;x.beginPath();x.moveTo(a+.55,b+.4);x.lineTo(a+.55,b-1.1);x.stroke();dot(a,b,.58,'#b8321e',.14);dot(a,b-.08,.26,'#d8d0c0')}
    else{dot(a,b,.5,CL[(hz(e.x,e.y,32)*CL.length)|0],.12);dot(a,b-.05,.24,'#e8cfa8')}}
  /* extra loose crowd in the squares so they read as busy */
  for(let i=0;i<100;i++){const inGreat=i<60,cx=inGreat?61+hz(i,1,33)*28:104+hz(i,2,33)*11,cy=inGreat?44+hz(i,3,33)*14:45+hz(i,4,33)*12;
    if(solid(Math.floor(cx),Math.floor(cy)))continue;if(inGreat&&Math.hypot(cx-74.5,cy-51.5)<4.4)continue;
    if(!inGreat&&(Math.abs(cx-108.5)<2.4&&Math.abs(cy-48.5)<2.4))continue;
    if(!inGreat&&cx>104&&cx<115&&(Math.abs(cy-46.5)<1.8||Math.abs(cy-52.5)<1.8))continue;
    const a=X(cx),b=Y(cy);dot(a,b,.42,CL[(hz(i,5,34)*CL.length)|0],.1);dot(a,b-.05,.2,'#e8cfa8')}

  /* ---- 11. names ---- */
  lab('The Great Square',74.5,45.9,5.2,MPL.VERM);
  lab('Market Square',109,43.2,4.6,MPL.VERM);
  lab('Town Hall',87.5,39.4,3.3,'#173a2c');
  lab('Merchants’ Hall',105.5,39.6,2.7,'#4a2a10',8*S);
  lab('Guild Hall',114,39.6,2.4,'#4a2a10',5*S);
  lab('Glover and Tailor',123,39.8,2.7,'#4a2a10',11*S);
  lab('The King’s Rest',60.5,63.7,2.8,'#1f3a7a',7*S);
  lab('Oldhaven Baths',97,63.7,2.4,'#1f3a7a',4.6*S);
  lab('The Gilded Lance',119.2,63.7,2.2,'#1f3a7a',4.6*S);
  lab('Garden',95,47.2,2.9,'#2c4a2a');
  lab('Court Garden',123.5,45.4,2.7,'#2c4a2a',8*S);
  lab('King’s Road',74.5,62.6,2.6,'#4a2a10');
  lab('Castle Road',74.5,41.1,2.3,'#4a2a10')
}});
