/* Orange Spire map, level 446 (floor 7): see maps_common.js and tools/MAP_BRIEF_SPIRE.md.
   Drawn from the real rows and decor. No spoilers: hidden doors, gates, levers, chambers behind them, mystery contents, traps and creatures are not shown;
   open cells that cannot be reached without a secret are drawn as solid wall. Names start with mpOs446. */
const MPOS446_SEED=4460;
const mpOs446H=(a,b,s)=>hash2(a,b,MPOS446_SEED+(s||0));
const MPOS446={STONE:'#c47a3a',STONE2:'#8a4c20',PLUM:'#5a3560',VIOLET:'#6a4a8a',FLOOR:'#efdfb8',INK:'#2a1a0c'};
/* a wobbly ink line */
function mpOs446Line(x,a,b,c,d,w,col,seed,amp){x.save();x.strokeStyle=col||MPL.INK;x.lineWidth=w||.8;x.lineCap='round';x.beginPath();const n=Math.max(2,Math.round(Math.hypot(c-a,d-b)/2.5)),am=amp==null?.7:amp;
  for(let i=0;i<=n;i++){const t=i/n,px=a+(c-a)*t+(mpOs446H(i,seed||1,3)-.5)*am,py=b+(d-b)*t+(mpOs446H(i,seed||1,4)-.5)*am;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();x.restore()}
/* icons: all drawn small, in pen and ink, centred on (a,b) */
function mpOs446Lamp(x,a,b,s,red,glow){s=s||1;x.save();if(glow){const g=x.createRadialGradient(a,b-1.5*s,0,a,b-1.5*s,7*s);g.addColorStop(0,red?'rgba(255,120,70,.55)':'rgba(255,214,110,.6)');g.addColorStop(1,'rgba(255,214,110,0)');x.fillStyle=g;x.beginPath();x.arc(a,b-1.5*s,7*s,0,6.3);x.fill()}
  x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillStyle=MPL.GOLD;x.fillRect(a-1.6*s,b+1.2*s,3.2*s,1.1*s);x.strokeRect(a-1.6*s,b+1.2*s,3.2*s,1.1*s);x.fillRect(a-.35*s,b-1.4*s,.7*s,2.8*s);
  x.fillStyle=red?'#e0402e':'#f4c860';x.beginPath();x.moveTo(a,b-4.4*s);x.quadraticCurveTo(a+1.9*s,b-2.4*s,a,b-.8*s);x.quadraticCurveTo(a-1.9*s,b-2.4*s,a,b-4.4*s);x.fill();x.stroke();x.restore()}
function mpOs446Candle(x,a,b,s){s=s||1;x.save();x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillStyle=MPL.GOLD;x.fillRect(a-1.3*s,b+1.4*s,2.6*s,.9*s);x.strokeRect(a-1.3*s,b+1.4*s,2.6*s,.9*s);x.fillStyle='#f0e6cc';x.fillRect(a-.55*s,b-1.2*s,1.1*s,2.7*s);x.strokeRect(a-.55*s,b-1.2*s,1.1*s,2.7*s);
  x.fillStyle='#ffb030';x.beginPath();x.moveTo(a,b-3.4*s);x.quadraticCurveTo(a+1*s,b-2.2*s,a,b-1.2*s);x.quadraticCurveTo(a-1*s,b-2.2*s,a,b-3.4*s);x.fill();x.restore()}
function mpOs446Hearth(x,a,b,s){s=s||1;x.save();x.fillStyle='#8a7a68';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-3.2*s,b-2.4*s,6.4*s,5*s);x.strokeRect(a-3.2*s,b-2.4*s,6.4*s,5*s);x.fillStyle='#24140c';x.fillRect(a-2*s,b-1.4*s,4*s,3.4*s);
  x.fillStyle='#ff8a30';x.beginPath();x.moveTo(a,b-2.2*s);x.quadraticCurveTo(a+1.9*s,b-.2*s,a,b+1.8*s);x.quadraticCurveTo(a-1.9*s,b-.2*s,a,b-2.2*s);x.fill();x.fillStyle='#ffd870';x.beginPath();x.arc(a,b+.8*s,.8*s,0,6.3);x.fill();x.restore()}
function mpOs446Mirror(x,a,b,s){s=s||1;x.save();x.fillStyle='#bcd8ea';x.strokeStyle=MPL.GOLD;x.lineWidth=1.1;x.beginPath();x.ellipse(a,b,1.9*s,2.9*s,0,0,6.3);x.fill();x.stroke();x.strokeStyle=MPL.INK;x.lineWidth=.4;x.stroke();x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=.6;x.beginPath();x.moveTo(a-.6*s,b-1.6*s);x.lineTo(a+.4*s,b-.6*s);x.stroke();x.restore()}
function mpOs446Portrait(x,a,b,s){s=s||1;x.save();x.fillStyle='#6a4a30';x.strokeStyle=MPL.GOLD;x.lineWidth=1.1;x.fillRect(a-1.9*s,b-2.6*s,3.8*s,5.2*s);x.strokeRect(a-1.9*s,b-2.6*s,3.8*s,5.2*s);x.fillStyle='#e0c090';x.beginPath();x.arc(a,b-.7*s,.9*s,0,6.3);x.fill();x.fillStyle='#8a2a22';x.fillRect(a-1.2*s,b+.4*s,2.4*s,1.6*s);x.strokeStyle=MPL.INK;x.lineWidth=.35;x.strokeRect(a-1.9*s,b-2.6*s,3.8*s,5.2*s);x.restore()}
function mpOs446Plaque(x,a,b,s){s=s||1;x.save();x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillRect(a-2*s,b-1.2*s,4*s,2.4*s);x.strokeRect(a-2*s,b-1.2*s,4*s,2.4*s);x.strokeStyle='#6a4a10';x.lineWidth=.35;x.beginPath();x.moveTo(a-1.2*s,b-.3*s);x.lineTo(a+1.2*s,b-.3*s);x.moveTo(a-1.2*s,b+.4*s);x.lineTo(a+.8*s,b+.4*s);x.stroke();x.restore()}
function mpOs446Window(x,a,b,s){s=s||1;x.save();x.fillStyle='#7aa0d0';x.strokeStyle=MPL.GOLD;x.lineWidth=1.1;x.beginPath();x.moveTo(a-1.9*s,b+2.6*s);x.lineTo(a-1.9*s,b-.6*s);x.quadraticCurveTo(a,b-4.2*s,a+1.9*s,b-.6*s);x.lineTo(a+1.9*s,b+2.6*s);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.INK;x.lineWidth=.4;x.stroke();x.beginPath();x.moveTo(a,b-2.4*s);x.lineTo(a,b+2.6*s);x.moveTo(a-1.9*s,b+.6*s);x.lineTo(a+1.9*s,b+.6*s);x.stroke();x.restore()}
function mpOs446Shelf(x,a,b,s){s=s||1;x.save();x.fillStyle='#6a4022';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-3.4*s,b-2.2*s,6.8*s,4.4*s);x.strokeRect(a-3.4*s,b-2.2*s,6.8*s,4.4*s);const cols=['#b8321e','#274a9a','#3a7a5a','#c9a227','#6a3a60'];
  for(let r=0;r<2;r++)for(let k=0;k<6;k++){x.fillStyle=cols[(k+r*2)%5];x.fillRect(a-3*s+k*1.05*s,b-1.9*s+r*2.1*s,.8*s,1.7*s)}x.restore()}
function mpOs446Lectern(x,a,b,s){s=s||1;x.save();x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillStyle='#7a4a22';x.fillRect(a-.6*s,b-.2*s,1.2*s,2.8*s);x.strokeRect(a-.6*s,b-.2*s,1.2*s,2.8*s);x.beginPath();x.moveTo(a-2.6*s,b+.2*s);x.lineTo(a+2.6*s,b+.2*s);x.lineTo(a+2*s,b-2.2*s);x.lineTo(a-2*s,b-2.2*s);x.closePath();x.fillStyle='#8a5a30';x.fill();x.stroke();x.fillStyle='#f0e6cc';x.fillRect(a-1.5*s,b-1.8*s,3*s,1.5*s);x.restore()}
function mpOs446Alcove(x,a,b,s){s=s||1;x.save();x.fillStyle='#3a2018';x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.moveTo(a-2*s,b+2.4*s);x.lineTo(a-2*s,b-.4*s);x.quadraticCurveTo(a,b-3.6*s,a+2*s,b-.4*s);x.lineTo(a+2*s,b+2.4*s);x.closePath();x.fill();x.stroke();x.restore()}
function mpOs446Cage(x,a,b,s){s=s||1;x.save();x.strokeStyle='#3a3a40';x.lineWidth=.8;x.strokeRect(a-2.6*s,b-2.6*s,5.2*s,5.2*s);x.beginPath();for(let k=-1.6;k<=1.7;k+=1.07){x.moveTo(a+k*s,b-2.6*s);x.lineTo(a+k*s,b+2.6*s)}x.stroke();x.strokeStyle=MPL.INK;x.lineWidth=.4;x.strokeRect(a-2.9*s,b-2.9*s,5.8*s,5.8*s);x.restore()}
function mpOs446Rack(x,a,b,s){s=s||1;x.save();x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillStyle='#7a4a22';x.fillRect(a-3*s,b-1.6*s,6*s,3.2*s);x.strokeRect(a-3*s,b-1.6*s,6*s,3.2*s);x.fillStyle='#4a2a14';x.fillRect(a-3.6*s,b-2*s,1*s,4*s);x.fillRect(a+2.6*s,b-2*s,1*s,4*s);x.strokeStyle='#8a8a90';x.lineWidth=.5;x.beginPath();x.moveTo(a-2*s,b);x.lineTo(a+2*s,b);x.stroke();x.restore()}
function mpOs446Table(x,a,b,s){s=s||1;x.save();x.fillStyle='#7a4a22';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-3.2*s,b-1.8*s,6.4*s,3.6*s);x.strokeRect(a-3.2*s,b-1.8*s,6.4*s,3.6*s);x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a-1.2*s,b,.8*s,0,6.3);x.fill();x.fillStyle='#e8dcc0';x.beginPath();x.arc(a+1.2*s,b,.9*s,0,6.3);x.fill();x.stroke();x.restore()}
function mpOs446Claws(x,a,b,s){s=s||1;x.save();x.strokeStyle='rgba(42,20,12,.85)';x.lineWidth=.7;x.lineCap='round';for(let k=-1;k<=1;k++){x.beginPath();x.moveTo(a+k*1.5*s-1*s,b-2.6*s);x.quadraticCurveTo(a+k*1.5*s,b,a+k*1.5*s+.6*s,b+2.6*s);x.stroke()}x.restore()}
function mpOs446Stair(x,a,b,s,up){s=s||1;x.save();x.fillStyle=up?'#e8c870':'#b89868';x.strokeStyle=MPL.INK;x.lineWidth=.9;x.fillRect(a-3.4*s,b-3.4*s,6.8*s,6.8*s);x.strokeRect(a-3.4*s,b-3.4*s,6.8*s,6.8*s);x.lineWidth=.6;x.beginPath();for(let i=1;i<5;i++){x.moveTo(a-3.4*s,b-3.4*s+i*1.36*s);x.lineTo(a+3.4*s,b-3.4*s+i*1.36*s)}x.stroke();
  x.fillStyle=MPL.INK;x.beginPath();if(up){x.moveTo(a,b-2.4*s);x.lineTo(a+1.9*s,b+.6*s);x.lineTo(a-1.9*s,b+.6*s)}else{x.moveTo(a,b+2.4*s);x.lineTo(a+1.9*s,b-.6*s);x.lineTo(a-1.9*s,b-.6*s)}x.closePath();x.fill();x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.strokeRect(a-3.9*s,b-3.9*s,7.8*s,7.8*s);x.restore()}
function mpOs446Stone(x,a,b,s,n){s=s||1;x.save();x.fillStyle='#d8c8a0';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.arc(a,b,3.3*s,0,6.3);x.fill();x.stroke();x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.beginPath();x.arc(a,b,2.6*s,0,6.3);x.stroke();x.fillStyle=MPL.VERM;x.font=`bold ${4.6*s}px ${FTITLE}`;x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),a,b+.3*s);x.restore()}
function mpOs446Door(x,a,b,s,horiz){ /* a doorway across a passage: gold frame posts, lintel and an open wooden leaf. horiz = the passage runs east-west */
  x.save();x.translate(a,b);if(!horiz)x.rotate(Math.PI/2);const h=s*.5;
  x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillStyle='#7a4a22';x.beginPath();x.moveTo(0,-h);x.lineTo(-s*.5,-h+s*.2);x.lineTo(-s*.5,-h+s*.4);x.lineTo(0,-h+s*.2);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD;for(const yy of [-h-.2,h-1.6]){x.fillRect(-1.3,yy,2.6,1.9);x.strokeRect(-1.3,yy,2.6,1.9)}
  x.strokeStyle=MPL.GOLD;x.lineWidth=1.1;x.beginPath();x.moveTo(0,-h);x.lineTo(0,h);x.stroke();x.strokeStyle=MPL.INK;x.lineWidth=.35;x.stroke();x.restore()}

function mpOs446Draw(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,F=api.fit(W,H),s=F.s;
  const code=(cx,cy)=>(L.rows[cy]&&cx>=0&&cx<W)?L.rows[cy].charCodeAt(cx):0x300;
  const fl0=(cx,cy)=>{const k=code(cx,cy);return k===0x2e||k===0x30||k===0x31};
  /* which open cells can be reached on foot from the arrival stone: the rest (chambers behind gates and secret doors) is drawn as plain wall */
  const st=L._start||{x:20,y:25},reach=new Uint8Array(W*H),q=[[st.x,st.y]];reach[st.y*W+st.x]=1;
  while(q.length){const [cx,cy]=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=W||ny>=H||reach[ny*W+nx]||!fl0(nx,ny))continue;reach[ny*W+nx]=1;q.push([nx,ny])}}
  const fl=(cx,cy)=>cx>=0&&cy>=0&&cx<W&&cy<H&&reach[cy*W+cx]===1;
  const near=(cx,cy,r)=>{for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(fl(cx+dx,cy+dy))return true;return false};
  const X=F.X,Y=F.Y;
  /* ---- the spire stone: warm orange brown, deeper away from the rooms, with block joints and plum shadow ---- */
  x.save();x.beginPath();x.rect(F.ox,F.oy,W*s,H*s);x.clip();
  const gr=x.createLinearGradient(0,F.oy,0,F.oy+H*s);gr.addColorStop(0,'#a8602c');gr.addColorStop(1,'#8f5226');x.fillStyle=gr;x.fillRect(F.ox,F.oy,W*s,H*s);
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(fl(cx,cy))continue;const h=mpOs446H(cx,cy,1),n1=near(cx,cy,1),n2=near(cx,cy,2);
    x.fillStyle=n1?(h<.5?'#c47a3a':'#bc7234'):n2?(h<.5?'#ad6730':'#a8622c'):(h<.5?'#8f5024':'#965528');x.fillRect(X(cx)-.2,Y(cy)-.2,s+.4,s+.4);
    if(!n1&&h>.8){x.fillStyle='rgba(90,53,96,.22)';x.beginPath();x.ellipse(X(cx+.5),Y(cy+.5),s*.4,s*.28,h*6,0,6.3);x.fill()}}
  /* block joints in the thick walls */
  x.strokeStyle='rgba(60,30,14,.4)';x.lineWidth=.4;for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(fl(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    x.beginPath();x.moveTo(X0,Y0+s*.5);x.lineTo(X0+s,Y0+s*.5);const o=((cx+cy)&1)?.25:.75;x.moveTo(X0+s*o,Y0);x.lineTo(X0+s*o,Y0+s*.5);x.moveTo(X0+s*(1-o),Y0+s*.5);x.lineTo(X0+s*(1-o),Y0+s);x.stroke()}
  /* hatching along the room walls: short plum diagonals */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(fl(cx,cy)||!near(cx,cy,1))continue;x.strokeStyle='rgba(58,28,64,.5)';x.lineWidth=.5;
    for(let k=0;k<3;k++){const px=X(cx)+k*s/3+(mpOs446H(cx,cy,10+k)-.5)*s*.2,py=Y(cy)+mpOs446H(cx,cy,13+k)*s*.25;x.beginPath();x.moveTo(px,py);x.lineTo(px+s*.3,py+s*.75);x.stroke()}}
  x.restore();
  /* ---- the floors: pale flagstones, a plum shadow under the north and west walls, jointed ---- */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!fl(cx,cy))continue;const h=mpOs446H(cx,cy,2);x.fillStyle=h<.3?'#ead8ac':h<.65?'#efdfb8':'#f2e4c0';x.fillRect(X(cx)-.15,Y(cy)-.15,s+.3,s+.3)}
  x.save();x.strokeStyle='rgba(120,80,40,.28)';x.lineWidth=.35;for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!fl(cx,cy))continue;const X0=X(cx),Y0=Y(cy);x.strokeRect(X0+.2,Y0+.2,s-.4,s-.4);if(mpOs446H(cx,cy,5)<.3){x.beginPath();x.moveTo(X0+s*.5,Y0);x.lineTo(X0+s*.5,Y0+s);x.stroke()}}x.restore();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!fl(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    if(!fl(cx,cy-1)){const g=x.createLinearGradient(0,Y0,0,Y0+s*.45);g.addColorStop(0,'rgba(90,53,96,.42)');g.addColorStop(1,'rgba(90,53,96,0)');x.fillStyle=g;x.fillRect(X0,Y0,s,s*.45)}
    if(!fl(cx-1,cy)){const g=x.createLinearGradient(X0,0,X0+s*.4,0);g.addColorStop(0,'rgba(90,53,96,.34)');g.addColorStop(1,'rgba(90,53,96,0)');x.fillStyle=g;x.fillRect(X0,Y0,s*.4,s)}}
  const rooms=(L._roomsInfo||[]);
  /* ---- rugs: vermilion with gold borders and fringe ---- */
  const rug=(cx0,cy0,w,h)=>{const a=X(cx0),b=Y(cy0),ww=w*s,hh=h*s;x.save();x.fillStyle='rgba(40,20,10,.25)';x.fillRect(a+1,b+1,ww,hh);x.fillStyle='#b8321e';x.fillRect(a,b,ww,hh);x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.strokeRect(a+1.2,b+1.2,ww-2.4,hh-2.4);x.strokeStyle='#6a1a10';x.lineWidth=.5;x.strokeRect(a+2.8,b+2.8,ww-5.6,hh-5.6);
    x.fillStyle=MPL.GOLD2;const lw=ww>hh;for(let k=1;k<(lw?w*2:h*2);k++){const t=k*s/2,mx=lw?a+t:a+ww/2,my=lw?b+hh/2:b+t;x.beginPath();x.moveTo(mx,my-1.7);x.lineTo(mx+1.4,my);x.lineTo(mx,my+1.7);x.lineTo(mx-1.4,my);x.closePath();x.fill()}
    x.strokeStyle=MPL.GOLD;x.lineWidth=.5;x.beginPath();if(lw){for(let yy=b+1;yy<b+hh;yy+=1.6){x.moveTo(a-1.4,yy);x.lineTo(a,yy);x.moveTo(a+ww,yy);x.lineTo(a+ww+1.4,yy)}}else{for(let xx=a+1;xx<a+ww;xx+=1.6){x.moveTo(xx,b-1.4);x.lineTo(xx,b);x.moveTo(xx,b+hh);x.lineTo(xx,b+hh+1.4)}}x.stroke();
    x.strokeStyle=MPL.INK;x.lineWidth=.4;x.strokeRect(a,b,ww,hh);x.restore()};
  rug(19.2,15.1,3.6,1.8);rug(20.25,3.1,1.5,1.8);rug(19.9,23.5,1.2,1.7);rug(8.6,18.6,2.8,1.4);
  /* ---- inked edges: every floor boundary twice, a heavy line and a lighter offset line, both wobbly ---- */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!fl(cx,cy))continue;const X0=X(cx),Y0=Y(cy),sd=cx*97+cy*13;
    for(const [dx,dy,a,b,c2,d] of [[0,-1,X0,Y0,X0+s,Y0],[0,1,X0,Y0+s,X0+s,Y0+s],[-1,0,X0,Y0,X0,Y0+s],[1,0,X0+s,Y0,X0+s,Y0+s]]){if(fl(cx+dx,cy+dy))continue;
      mpOs446Line(x,a,b,c2,d,1.3,MPL.INK,sd+dx*3+dy*5,.8);mpOs446Line(x,a-dx*.9*-1,b-dy*.9*-1,c2-dx*.9*-1,d-dy*.9*-1,.5,'rgba(42,26,12,.6)',sd+dx*7+dy*11+50,1.1)}}
  /* pillars: a wall cell with floor on three or four sides becomes a round stone column */
  for(let cy=1;cy<H-1;cy++)for(let cx=1;cx<W-1;cx++){if(fl(cx,cy)||code(cx,cy)===0x2e)continue;const n=fl(cx-1,cy)+fl(cx+1,cy)+fl(cx,cy-1)+fl(cx,cy+1);if(n<3)continue;const a=X(cx+.5),b=Y(cy+.5);
    x.fillStyle='rgba(40,20,10,.3)';x.beginPath();x.ellipse(a+.8,b+.9,s*.42,s*.4,0,0,6.3);x.fill();x.fillStyle='#d09050';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.arc(a,b,s*.4,0,6.3);x.fill();x.stroke();x.fillStyle='rgba(255,235,190,.45)';x.beginPath();x.arc(a-s*.12,b-s*.12,s*.16,0,6.3);x.fill();x.strokeStyle=MPL.GOLD;x.lineWidth=.5;x.beginPath();x.arc(a,b,s*.28,0,6.3);x.stroke()}
  /* ---- doorways: where a corridor one cell wide meets a room ---- */
  const doors=[];
  for(const r of rooms){const add=(bx,by,horiz)=>{if(!fl(bx,by))return;if(!doors.some(d=>d[0]===bx&&d[1]===by))doors.push([bx,by,horiz])};
    for(let y=r.y0;y<=r.y1;y++){if(fl(r.x0-1,y)&&!fl(r.x0-1,y-1)&&!fl(r.x0-1,y+1))add(r.x0-1,y,true);if(fl(r.x1+1,y)&&!fl(r.x1+1,y-1)&&!fl(r.x1+1,y+1))add(r.x1+1,y,true)}
    for(let xx=r.x0;xx<=r.x1;xx++){if(fl(xx,r.y0-1)&&!fl(xx-1,r.y0-1)&&!fl(xx+1,r.y0-1))add(xx,r.y0-1,false);if(fl(xx,r.y1+1)&&!fl(xx-1,r.y1+1)&&!fl(xx+1,r.y1+1))add(xx,r.y1+1,false)}}
  for(const d of doors)mpOs446Door(x,X(d[0]+.5),Y(d[1]+.5),s,d[2]);
  /* ---- banners: vermilion, on the north wall of the larger rooms ---- */
  for(const r of rooms){if(r.x1-r.x0<3||r.y0<1)continue;for(const cx of [r.x0+1,r.x1-1]){if(!fl(cx,r.y0)||fl(cx,r.y0-1))continue;const a=X(cx+.5),b=Y(r.y0)-.6;x.fillStyle='#b8321e';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-1.6,b-2.6);x.lineTo(a+1.6,b-2.6);x.lineTo(a+1.6,b+2.2);x.lineTo(a,b+1);x.lineTo(a-1.6,b+2.2);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.GOLD;x.lineWidth=.6;x.beginPath();x.moveTo(a-1.9,b-2.8);x.lineTo(a+1.9,b-2.8);x.stroke()}}
  /* ---- the arrival stone and the stairs ---- */
  const ST=L._start||{x:20,y:25},UP=L._up||{x:35,y:3};
  mpOs446Stone(x,X(ST.x+.5),Y(ST.y+.5),s*.1,7);
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){const k=code(cx,cy);if(k===0x30)mpOs446Stair(x,X(cx+.5),Y(cy+.5),s*.12,false);else if(k===0x31)mpOs446Stair(x,X(cx+.5),Y(cy+.5),s*.12,true)}
  /* ---- furniture and decoration at the real positions (only on ground that can be walked to) ---- */
  const wallDir=(cx,cy)=>{for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]])if(!fl(cx+dx,cy+dy))return [dx,dy];return [0,-1]};
  const onWall=(cx,cy,fn)=>{const [dx,dy]=wallDir(cx,cy);x.save();x.translate(X(cx+.5+dx*.5),Y(cy+.5+dy*.5));x.rotate(Math.atan2(-dx,dy));fn();x.restore()};
  const dec=(L.decor||[]).filter(d=>fl(d.x,d.y)).sort((p,q)=>p.y-q.y);
  for(const d of dec){const k=d.k,cx=d.x,cy=d.y,a=X(cx+.5),b=Y(cy+.5);
    if(k==='lamp'){const lt=(L.lights||[]).find(l=>Math.floor(l[0])===cx&&Math.floor(l[1])===cy);mpOs446Lamp(x,a,b+1,s*.14,lt?!!lt[2]:false,true)}
    else if(k==='hl_p_candle')mpOs446Candle(x,a,b,s*.14);
    else if(k==='hl_fire')mpOs446Hearth(x,a,b,s*.14);
    else if(k==='hl_p_mirror')onWall(cx,cy,()=>mpOs446Mirror(x,0,-.5,s*.13));
    else if(/^hl_pt\d/.test(k))onWall(cx,cy,()=>mpOs446Portrait(x,0,-.5,s*.12));
    else if(/^hl_plq/.test(k))onWall(cx,cy,()=>mpOs446Plaque(x,0,-.5,s*.13));
    else if(k==='hl_p_window')onWall(cx,cy,()=>mpOs446Window(x,0,-.5,s*.14));
    else if(k==='hl_p_shelf')onWall(cx,cy,()=>mpOs446Shelf(x,0,-.8,s*.13));
    else if(k==='hl_p_alcove')onWall(cx,cy,()=>mpOs446Alcove(x,0,-.6,s*.14));
    else if(k==='hl_p_lectern')mpOs446Lectern(x,a,b,s*.15);
    else if(k==='hl_p_cage')mpOs446Cage(x,a,b,s*.15);
    else if(k==='hl_p_rack')mpOs446Rack(x,a,b,s*.15);
    else if(k==='hl_p_poison'||k==='hl_p_apple')mpOs446Table(x,a,b,s*.14);
    else if(/^hl_claw/.test(k))onWall(cx,cy,()=>mpOs446Claws(x,0,-.8,s*.13))}
  /* ---- names: from mapNames, set where the rooms are ---- */
  const nm=(L.mapNames||[]).filter(n=>fl(n.x,n.y)||n.t==='The Stair Up'||n.t==='The Strange Room'||/^Stair/.test(n.t));
  const put={'Stair (7)':[20.5,22.1,5.4],'The Strange Room':[6.5,5.1,6.2],'The Stair Up':[34.8,1.4,5.6],'The Study':[21,1.4,5.8],'Gallery of Rulers':[20.9,13.3,6],'Banquet Hall':[9.5,17.1,6],'The Cells':[30.5,9.6,6],'The Haunted Room':[13.5,1.3,5.6]};
  let hr=0;for(const n of nm){let p=put[n.t]||[n.x+.5,n.y+.5,6];if(n.t==='The Haunted Room'){p=hr++?[10.5,22.5,5.6]:[13.5,1.3,5.6]}api.text(x,n.t,X(p[0]),Y(p[1]),p[2],MPL.VERM,'center')}
  /* ---- crenellated outer edge of the spire ---- */
  x.save();x.fillStyle='#8a4c20';x.strokeStyle=MPL.INK;x.lineWidth=.6;for(let i=0;i<W;i+=1){for(const yy of [F.oy-1.6,F.oy+H*s]){x.fillRect(X(i)+s*.15,yy,s*.7,1.6);x.strokeRect(X(i)+s*.15,yy,s*.7,1.6)}}
  for(let j=0;j<H;j++){for(const xx of [F.ox-1.6,F.ox+W*s]){x.fillRect(xx,Y(j)+s*.15,1.6,s*.7);x.strokeRect(xx,Y(j)+s*.15,1.6,s*.7)}}x.restore();
  mpOs446Line(x,F.ox,F.oy,F.ox+W*s,F.oy,1.6,MPL.INK,901,.5);mpOs446Line(x,F.ox,F.oy+H*s,F.ox+W*s,F.oy+H*s,1.6,MPL.INK,902,.5);mpOs446Line(x,F.ox,F.oy,F.ox,F.oy+H*s,1.6,MPL.INK,903,.5);mpOs446Line(x,F.ox+W*s,F.oy,F.ox+W*s,F.oy+H*s,1.6,MPL.INK,904,.5);
  /* ---- margins: title, key (left); notes and compass (right) ---- */
  api.title(x,'The Orange Spire, Floor 7','');
  {const lines=api.wrap(x,'The Study, the Gallery of Rulers, the Banquet Hall and the Cells',76,6.4);let y=45;for(const l of lines){api.text(x,l,10,y,6.2,'#5a3a1c','left');y+=8}}
  const key=[['Stair down',(a,b)=>mpOs446Stair(x,a,b,.7,false)],['Stair up',(a,b)=>mpOs446Stair(x,a,b,.7,true)],['Arrival stone',(a,b)=>mpOs446Stone(x,a,b,.8,7)],['Doorway',(a,b)=>mpOs446Door(x,a,b,8,false)],['Standing lamp',(a,b)=>mpOs446Lamp(x,a,b+1,.9,false,false)],['Candle',(a,b)=>mpOs446Candle(x,a,b,.9)],['Hearth',(a,b)=>mpOs446Hearth(x,a,b,.8)],['Mirror',(a,b)=>mpOs446Mirror(x,a,b,.9)],['Portrait',(a,b)=>mpOs446Portrait(x,a,b,.9)],['Window',(a,b)=>mpOs446Window(x,a,b,.8)],['Bookcase',(a,b)=>mpOs446Shelf(x,a,b,.8)],['Rug',(a,b)=>{x.fillStyle='#b8321e';x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.fillRect(a-4,b-2.4,8,4.8);x.strokeRect(a-3.2,b-1.8,6.4,3.6)}]];
  api.panel(x,6,78,82,18+key.length*13.2);api.text(x,'Key',47,88,7.4,MPL.VERM,'center');let ky=100;for(const [t,f] of key){f(18,ky);api.text(x,t,29,ky,6.2,'#3a2a1c','left');ky+=13.2}
  api.panel(x,392,34,84,150);api.notes(x,['Floor 7 of the Orange Spire, a haunted castle.','You arrive on the stair in the south. The stair up is at the far end, in the north east.','Long halls link the rooms. Doorways are marked in gold.','Only the parts you have walked through show on the map.'],397,45,74,6.1,4);
  api.compass(x,436,262,12);
  /* small flourishes: bats over the margins */
  for(const [bx,by] of [[400,206],[452,224],[104,276]]){x.strokeStyle=MPL.INK;x.lineWidth=1;x.beginPath();x.moveTo(bx-5,by);x.quadraticCurveTo(bx-2,by-4,bx,by);x.quadraticCurveTo(bx+2,by-4,bx+5,by);x.stroke()}
}
mplInstall({name:'os446',levels:[446],reveal:true,draw:mpOs446Draw,foot:'You are the yellow arrow. Press M to close the map.'});
