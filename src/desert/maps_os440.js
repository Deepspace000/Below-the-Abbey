/* Orange Spire map, floor 1, level 440: see maps_common.js and tools/MAP_BRIEF_SPIRE.md.
   Drawn from the real rows and decor. Hidden doors are drawn as plain wall and the secret chambers behind them as solid stone. Names start with mpOs440. */
const MPOS440_SEED=4400;
const mpOs440H=(a,b,s)=>hash2(a,b,MPOS440_SEED+(s||0));
const MPOS440_WARM='#c47a3a',MPOS440_DARK='#8a4c20',MPOS440_PLUM='#4a2848',MPOS440_FLOOR='#ecd8a8';
/* a wobbly ink line between two points */
function mpOs440Line(x,a,b,c,d,w,col,seed){x.save();x.strokeStyle=col||MPL.INK;x.lineWidth=w||.8;x.lineCap='round';x.beginPath();const n=Math.max(2,Math.round(Math.hypot(c-a,d-b)/2.6));
  for(let i=0;i<=n;i++){const t=i/n,px=a+(c-a)*t+(mpOs440H(i,seed||1,3)-.5)*.8,py=b+(d-b)*t+(mpOs440H(i,seed||1,4)-.5)*.8;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();x.restore()}
/* small icons, all at (a,b) with size s */
function mpOs440Lantern(x,a,b,s,violet){x.save();const g=x.createRadialGradient(a,b,0,a,b,6*s);g.addColorStop(0,violet?'rgba(200,150,255,.55)':'rgba(255,170,70,.6)');g.addColorStop(1,'rgba(255,170,70,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,6*s,0,6.3);x.fill();
  x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillStyle=MPL.GOLD;x.fillRect(a-1.1*s,b-1.5*s,2.2*s,3*s);x.strokeRect(a-1.1*s,b-1.5*s,2.2*s,3*s);x.fillStyle=violet?'#d8a8ff':'#ffd060';x.beginPath();x.arc(a,b-.1*s,.8*s,0,6.3);x.fill();
  x.fillStyle=MPL.GOLD;x.beginPath();x.moveTo(a-1.5*s,b-1.5*s);x.lineTo(a,b-2.9*s);x.lineTo(a+1.5*s,b-1.5*s);x.closePath();x.fill();x.stroke();x.restore()}
function mpOs440Candle(x,a,b,s){x.save();x.fillStyle='#efe4c4';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillRect(a-.5*s,b-.4*s,1*s,1.8*s);x.strokeRect(a-.5*s,b-.4*s,1*s,1.8*s);x.fillStyle='#ffb030';x.beginPath();x.ellipse(a,b-1.2*s,.5*s,.9*s,0,0,6.3);x.fill();x.restore()}
function mpOs440Fire(x,a,b,s){x.save();x.fillStyle='#3a2a2a';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(a-2*s,b+1.6*s);x.lineTo(a-2*s,b-.6*s);x.quadraticCurveTo(a,b-3*s,a+2*s,b-.6*s);x.lineTo(a+2*s,b+1.6*s);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(a-1.1*s,b+1.5*s);x.quadraticCurveTo(a-1.4*s,b-.2*s,a,b-1.2*s);x.quadraticCurveTo(a+1.4*s,b-.2*s,a+1.1*s,b+1.5*s);x.fill();x.fillStyle='#ffc040';x.beginPath();x.ellipse(a,b+.9*s,.5*s,.8*s,0,0,6.3);x.fill();x.restore()}
function mpOs440Window(x,a,b,s){x.save();x.fillStyle='#a8c8dc';x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.beginPath();x.moveTo(a-1.3*s,b+1.8*s);x.lineTo(a-1.3*s,b-.8*s);x.quadraticCurveTo(a,b-3.2*s,a+1.3*s,b-.8*s);x.lineTo(a+1.3*s,b+1.8*s);x.closePath();x.fill();x.stroke();
  x.strokeStyle=MPL.INK;x.lineWidth=.4;x.beginPath();x.moveTo(a,b-1.8*s);x.lineTo(a,b+1.8*s);x.moveTo(a-1.3*s,b);x.lineTo(a+1.3*s,b);x.stroke();x.restore()}
function mpOs440Mirror(x,a,b,s){x.save();x.fillStyle='#bcd8ea';x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.ellipse(a,b,1.3*s,2*s,0,0,6.3);x.fill();x.stroke();x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=.5;x.beginPath();x.moveTo(a-.5*s,b-1*s);x.lineTo(a-.1*s,b+.2*s);x.stroke();x.restore()}
function mpOs440Shelf(x,a,b,s){x.save();x.fillStyle='#7a4a2a';x.strokeStyle=MPL.INK;x.lineWidth=.55;x.fillRect(a-2*s,b-1.4*s,4*s,2.8*s);x.strokeRect(a-2*s,b-1.4*s,4*s,2.8*s);x.strokeStyle='#e0c890';x.lineWidth=.4;x.beginPath();x.moveTo(a-2*s,b);x.lineTo(a+2*s,b);for(let k=-1;k<=1;k+=.5){x.moveTo(a+k*s,b-1.4*s);x.lineTo(a+k*s,b-.1*s);x.moveTo(a+k*s+.4*s,b+.1*s);x.lineTo(a+k*s+.4*s,b+1.4*s)}x.stroke();x.restore()}
function mpOs440Desk(x,a,b,s,col){x.save();x.fillStyle=col||'#9a6a3a';x.strokeStyle=MPL.INK;x.lineWidth=.55;x.fillRect(a-1.8*s,b-1*s,3.6*s,2*s);x.strokeRect(a-1.8*s,b-1*s,3.6*s,2*s);x.restore()}
function mpOs440Feast(x,a,b,s){x.save();x.fillStyle=MPL.VERM;x.strokeStyle=MPL.INK;x.lineWidth=.55;x.fillRect(a-2.6*s,b-1.1*s,5.2*s,2.2*s);x.strokeRect(a-2.6*s,b-1.1*s,5.2*s,2.2*s);x.fillStyle=MPL.GOLD2;for(const k of [-1.6,-.5,.6,1.7]){x.beginPath();x.arc(a+k*s,b,.5*s,0,6.3);x.fill()}x.restore()}
function mpOs440Plate(x,a,b,s){x.save();x.fillStyle='#f0e4c4';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.arc(a,b,1*s,0,6.3);x.fill();x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a,b,.4*s,0,6.3);x.fill();x.restore()}
function mpOs440Coffin(x,a,b,s){x.save();x.fillStyle='#8a6a4a';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(a-.9*s,b-2.2*s);x.lineTo(a+.9*s,b-2.2*s);x.lineTo(a+1.4*s,b-.8*s);x.lineTo(a+.9*s,b+2.2*s);x.lineTo(a-.9*s,b+2.2*s);x.lineTo(a-1.4*s,b-.8*s);x.closePath();x.fill();x.stroke();
  x.strokeStyle=MPL.GOLD;x.lineWidth=.5;x.beginPath();x.moveTo(a,b-1.4*s);x.lineTo(a,b+1.2*s);x.moveTo(a-.6*s,b-.6*s);x.lineTo(a+.6*s,b-.6*s);x.stroke();x.restore()}
function mpOs440Tomb(x,a,b,s){x.save();x.fillStyle='#b4b0ba';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-2*s,b-1.3*s,4*s,2.6*s);x.strokeRect(a-2*s,b-1.3*s,4*s,2.6*s);x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(a,b-.9*s);x.lineTo(a,b+.9*s);x.moveTo(a-.7*s,b-.3*s);x.lineTo(a+.7*s,b-.3*s);x.stroke();x.restore()}
function mpOs440Chains(x,a,b,s){x.save();x.strokeStyle='#3a3a44';x.lineWidth=.7;for(let k=0;k<4;k++){x.beginPath();x.ellipse(a+(k%2?.5:-.5)*s,b-1.6*s+k*1.1*s,.6*s,.45*s,0,0,6.3);x.stroke()}x.restore()}
function mpOs440Throne(x,a,b,s){x.save();x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.moveTo(a-2*s,b+1.8*s);x.lineTo(a-2*s,b-1*s);x.lineTo(a-1*s,b-.2*s);x.lineTo(a,b-2.4*s);x.lineTo(a+1*s,b-.2*s);x.lineTo(a+2*s,b-1*s);x.lineTo(a+2*s,b+1.8*s);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.VERM;x.fillRect(a-1*s,b+.2*s,2*s,1.2*s);x.restore()}
function mpOs440Armour(x,a,b,s){x.save();x.fillStyle='#a8aab4';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.arc(a,b-1*s,1.2*s,Math.PI,0);x.lineTo(a+1.2*s,b+.2*s);x.lineTo(a-1.2*s,b+.2*s);x.closePath();x.fill();x.stroke();x.fillRect(a-1.5*s,b+.4*s,3*s,1.8*s);x.strokeRect(a-1.5*s,b+.4*s,3*s,1.8*s);x.fillStyle=MPL.INK;x.fillRect(a-.8*s,b-1.1*s,1.6*s,.4*s);x.restore()}
function mpOs440Banner(x,a,b,s){x.save();x.fillStyle=MPL.VERM;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(a-1.3*s,b-2*s);x.lineTo(a+1.3*s,b-2*s);x.lineTo(a+1.3*s,b+1.6*s);x.lineTo(a,b+.8*s);x.lineTo(a-1.3*s,b+1.6*s);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(a,b-.5*s,.6*s,0,6.3);x.fill();x.restore()}
function mpOs440Plaque(x,a,b,s,txt){x.save();x.fillStyle='#d8b050';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-1.4*s,b-1.7*s,2.8*s,3.4*s);x.strokeRect(a-1.4*s,b-1.7*s,2.8*s,3.4*s);
  if(txt){x.fillStyle=MPL.INK;x.font='bold '+(2.6*s)+'px '+FUI;x.textAlign='center';x.textBaseline='middle';x.fillText(txt,a,b+.1*s)}else{x.fillStyle=MPL.INK;x.beginPath();x.arc(a,b,.5*s,0,6.3);x.fill()}x.restore()}
function mpOs440Claw(x,a,b,s){x.save();x.strokeStyle='#5a1a1a';x.lineWidth=.7;x.lineCap='round';for(const k of [-1,0,1]){x.beginPath();x.moveTo(a+k*1*s-.5*s,b-2*s);x.quadraticCurveTo(a+k*1*s+.3*s,b,a+k*1*s-.3*s,b+2*s);x.stroke()}x.restore()}
/* a flight of stairs in a cell: a little stone block with steps and an arrow, down (dir 1) or up (dir -1) */
function mpOs440Stair(x,a,b,s,up){x.save();const w=s*1.35;x.fillStyle=up?'#f0d890':'#d0a468';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(a-w/2,b-w/2,w,w);x.strokeRect(a-w/2,b-w/2,w,w);
  x.lineWidth=.5;x.beginPath();for(let i=1;i<4;i++){x.moveTo(a-w/2,b-w/2+w*i/4);x.lineTo(a+w/2,b-w/2+w*i/4)}x.stroke();
  x.fillStyle=MPL.VERM;x.beginPath();if(up){x.moveTo(a,b-w*.4);x.lineTo(a+w*.3,b+w*.2);x.lineTo(a-w*.3,b+w*.2)}else{x.moveTo(a,b+w*.4);x.lineTo(a+w*.3,b-w*.2);x.lineTo(a-w*.3,b-w*.2)}x.closePath();x.fill();x.restore()}

function mpOs440Draw(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,F=api.fit(W,H),s=F.s;
  const ch=(cx,cy)=>L.rows[cy]&&L.rows[cy][cx];
  const stair=(cx,cy)=>{const q=ch(cx,cy);return q==='0'||q==='1'};
  const isOpen=(cx,cy)=>ch(cx,cy)==='.'||stair(cx,cy);
  /* the party can reach: from the start, over open cells. Hidden doors count as wall, so secret chambers stay solid stone. */
  const reach=new Uint8Array(W*H),st=[[L._start.x,L._start.y]];reach[L._start.y*W+L._start.x]=1;
  while(st.length){const [px,py]=st.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=px+dx,ny=py+dy;if(nx<0||ny<0||nx>=W||ny>=H||reach[ny*W+nx]||!isOpen(nx,ny))continue;reach[ny*W+nx]=1;st.push([nx,ny])}}
  for(const q of [[30,41],[13,17]])if(isOpen(q[0],q[1]))reach[q[1]*W+q[0]]=1;
  const floor=(cx,cy)=>cx>=0&&cy>=0&&cx<W&&cy<H&&!!reach[cy*W+cx];
  const X=F.X,Y=F.Y;
  x.save();
  /* the stone mass: warm orange-brown wash over the whole plan, with violet and plum shade */
  x.beginPath();x.rect(X(0),Y(0),W*s,H*s);x.clip();
  x.fillStyle=MPOS440_WARM;x.fillRect(X(0),Y(0),W*s,H*s);
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(floor(cx,cy))continue;const h=mpOs440H(cx,cy,1);
    x.fillStyle=h<.3?'rgba(138,76,32,.5)':h<.55?'rgba(90,50,90,.2)':h<.8?'rgba(230,160,90,.22)':'rgba(70,35,60,.28)';x.fillRect(X(cx),Y(cy),s+.4,s+.4)}
  /* coursed stone on the mass, and hatching beside every floor */
  x.strokeStyle='rgba(74,40,24,.22)';x.lineWidth=.4;x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(floor(cx,cy))continue;const X0=X(cx),Y0=Y(cy),off=(cy&1)?s*.5:0;x.moveTo(X0,Y0+s);x.lineTo(X0+s,Y0+s);x.moveTo(X0+off+s*.3,Y0);x.lineTo(X0+off+s*.3,Y0+s)}
  x.stroke();
  x.strokeStyle='rgba(60,30,50,.55)';x.lineWidth=.45;x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(floor(cx,cy))continue;let near=false;for(let a=-1;a<=1&&!near;a++)for(let b=-1;b<=1;b++)if(floor(cx+a,cy+b)){near=true;break}if(!near)continue;
    const X0=X(cx),Y0=Y(cy);for(let k=0;k<3;k++){const o=(k+.5)*s/3;x.moveTo(X0+o-s*.35,Y0+s);x.lineTo(X0+o+s*.35,Y0)}}
  x.stroke();
  /* flagged floors */
  const fm=L.fmap;
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!floor(cx,cy))continue;const X0=X(cx),Y0=Y(cy),t=fm&&fm[cy]?fm[cy][cx]:'0',h=mpOs440H(cx,cy,2);
    x.fillStyle=t==='1'?'#e8cc90':t==='3'?'#d8c4a4':MPOS440_FLOOR;x.fillRect(X0,Y0,s+.4,s+.4);
    x.fillStyle=h<.3?'rgba(180,120,70,.16)':h<.6?'rgba(255,255,240,.22)':'rgba(150,100,150,.1)';x.fillRect(X0,Y0,s+.4,s+.4);
    x.strokeStyle='rgba(138,76,32,.3)';x.lineWidth=.35;x.strokeRect(X0+.2,Y0+.2,s-.4,s-.4)}
  /* soft shadow on the floor beside the walls */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!floor(cx,cy))continue;const X0=X(cx),Y0=Y(cy);x.fillStyle='rgba(74,40,72,.22)';
    if(!floor(cx,cy-1))x.fillRect(X0,Y0,s,s*.22);if(!floor(cx-1,cy))x.fillRect(X0,Y0,s*.2,s)}
  /* inked edges, doubled and wobbly */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!floor(cx,cy))continue;const X0=X(cx),Y0=Y(cy),sd=cx*97+cy*13;
    if(!floor(cx,cy-1)){mpOs440Line(x,X0,Y0,X0+s,Y0,.9,MPL.INK,sd+1);mpOs440Line(x,X0,Y0-.8,X0+s,Y0-.8,.4,'#3a1a1a',sd+5)}
    if(!floor(cx,cy+1)){mpOs440Line(x,X0,Y0+s,X0+s,Y0+s,.9,MPL.INK,sd+2);mpOs440Line(x,X0,Y0+s+.8,X0+s,Y0+s+.8,.4,'#3a1a1a',sd+6)}
    if(!floor(cx-1,cy)){mpOs440Line(x,X0,Y0,X0,Y0+s,.9,MPL.INK,sd+3);mpOs440Line(x,X0-.8,Y0,X0-.8,Y0+s,.4,'#3a1a1a',sd+7)}
    if(!floor(cx+1,cy)){mpOs440Line(x,X0+s,Y0,X0+s,Y0+s,.9,MPL.INK,sd+4);mpOs440Line(x,X0+s+.8,Y0,X0+s+.8,Y0+s,.4,'#3a1a1a',sd+8)}}
  x.restore();
  /* the outer wall of the spire floor: a gold-lined ink frame with small battlements */
  x.save();x.strokeStyle=MPL.INK;x.lineWidth=1.6;x.strokeRect(X(0),Y(0),W*s,H*s);x.strokeStyle=MPL.GOLD;x.lineWidth=.7;x.strokeRect(X(0)+1.2,Y(0)+1.2,W*s-2.4,H*s-2.4);
  x.fillStyle=MPOS440_DARK;x.strokeStyle=MPL.INK;x.lineWidth=.6;for(let i=0;i<W;i+=2){for(const yy of [Y(0)-2.2,Y(H)]){x.fillRect(X(i)+.4,yy,s*.9,2.2);x.strokeRect(X(i)+.4,yy,s*.9,2.2)}}
  for(let j=0;j<H;j+=2){for(const xx of [X(0)-2.2,X(W)]){x.fillRect(xx,Y(j)+.4,2.2,s*.9);x.strokeRect(xx,Y(j)+.4,2.2,s*.9)}}x.restore();
  /* stairs */
  mpOs440Stair(x,X(30.5),Y(41.5),s,false);mpOs440Stair(x,X(13.5),Y(17.5),s,true);
  /* furniture and decoration, only what is in plain sight */
  const sz=s*.78;
  const at=d=>[X(d.x+.5),Y(d.y+.5)];
  for(const d of L.decor){if(!floor(d.x,d.y))continue;const [a,b]=at(d),k=d.k;
    if(k==='hl_plq1')mpOs440Plaque(x,a,b,sz,'1');
    else if(/^hl_pt/.test(k))mpOs440Plaque(x,a,b,sz);
    else if(/^hl_claw/.test(k))mpOs440Claw(x,a,b,sz);
    else if(k==='hl_p_mirror')mpOs440Mirror(x,a,b,sz);
    else if(k==='hl_p_window')mpOs440Window(x,a,b,sz);
    else if(k==='hl_fire')mpOs440Fire(x,a,b,sz);
    else if(k==='hl_p_shelf')mpOs440Shelf(x,a,b,sz);
    else if(k==='hl_p_lectern')mpOs440Desk(x,a,b,sz*.8,'#7a4a2a');
    else if(k==='hl_p_desk')mpOs440Desk(x,a,b,sz);
    else if(k==='hl_p_feast')mpOs440Feast(x,a,b,sz);
    else if(k==='hl_p_poison'||k==='hl_p_apple')mpOs440Plate(x,a,b,sz);
    else if(k==='hl_p_coffin')mpOs440Coffin(x,a,b,sz);
    else if(k==='hl_p_tomb')mpOs440Tomb(x,a,b,sz);
    else if(k==='hl_p_chains')mpOs440Chains(x,a,b,sz);
    else if(k==='hl_p_throne')mpOs440Throne(x,a,b,sz);
    else if(k==='hl_p_armour')mpOs440Armour(x,a,b,sz);
    else if(k==='hl_p_banner')mpOs440Banner(x,a,b,sz);
    else if(k==='hl_p_candle')mpOs440Candle(x,a,b,sz)}
  /* the lanterns, where they really stand; red or violet light */
  for(const q of (L.lights||[])){if(!floor(q[0],q[1]))continue;mpOs440Lantern(x,X(q[0]+.5),Y(q[1]+.5),sz,q[2]===1)}
  /* room names, above each room */
  for(const m of L.mapNames){const t=m.t;api.text(x,t,X(m.x+.5),Y(m.y+.5)-.5,5.4,'#3a1a28','center')}
  /* margins */
  api.title(x,'The Orange Spire, Floor 1','Banquet halls, a throne hall and a crypt');
  api.compass(x,436,262,12);
  api.panel(x,8,52,78,128);
  api.notes(x,['The first floor of a haunted castle in the Hollow Land.','You arrive by the stair at the south end. The stair up is in the west, in the study.','Halls are lit by lanterns and candles.','Each floor above is smaller than this one.'],13,62,68,6.2,4);
  const key=[['Stair down',(a,b)=>mpOs440Stair(x,a,b,6,false)],['Stair up',(a,b)=>mpOs440Stair(x,a,b,6,true)],['Lantern',(a,b)=>mpOs440Lantern(x,a,b,1.4,false)],['Candle',(a,b)=>mpOs440Candle(x,a,b,1.6)],['Fireplace',(a,b)=>mpOs440Fire(x,a,b,1.5)],['Window',(a,b)=>mpOs440Window(x,a,b,1.5)],['Mirror',(a,b)=>mpOs440Mirror(x,a,b,1.5)],['Plaque',(a,b)=>mpOs440Plaque(x,a,b,1.5)],['Claw marks',(a,b)=>mpOs440Claw(x,a,b,1.5)],['Shelf',(a,b)=>mpOs440Shelf(x,a,b,1.5)],['Table',(a,b)=>mpOs440Feast(x,a,b,1.3)],['Coffin',(a,b)=>mpOs440Coffin(x,a,b,1.3)],['Throne',(a,b)=>mpOs440Throne(x,a,b,1.3)]];
  api.panel(x,392,34,84,20+key.length*11.5);api.text(x,'Key',434,45,7.4,MPL.VERM,'center');let yy=56;
  for(const [t,f] of key){f(404,yy);api.text(x,t,414,yy,6,'#3a2a1c','left');yy+=11.5}
}
mplInstall({name:'os440',levels:[440],reveal:true,draw:mpOs440Draw});
