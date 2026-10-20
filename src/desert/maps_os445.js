/* Orange Spire map, floor 6 (level 445): a warm spire-stone floor plan on vellum. See maps_common.js and tools/MAP_BRIEF_SPIRE.md. Names start with mpOs445.
   No spoilers: hidden doors and the chambers behind them are drawn as plain wall, the Strange Room is drawn empty, and no traps, levers or enemies are marked. */
const MPOS445={stone:'#c47a3a',stone2:'#8a4c20',plum:'#5a2e44',gold:'#c9a227',gold2:'#f0d878',verm:'#b8321e',lapis:'#274a9a'};
function mpOs445J(a,b,sd){return hash2(a*17+5,b*23+9,sd)-.5}
/* a wobbly line from p to q (screen px), jitter w, seed sd */
function mpOs445Line(x,p,q,w,sd){const n=Math.max(1,Math.ceil(Math.hypot(q[0]-p[0],q[1]-p[1])/3));x.beginPath();x.moveTo(p[0]+mpOs445J(p[0]|0,p[1]|0,sd)*w,p[1]+mpOs445J(p[1]|0,p[0]|0,sd+1)*w);
  for(let i=1;i<=n;i++){const t=i/n,a=p[0]+(q[0]-p[0])*t,b=p[1]+(q[1]-p[1])*t;x.lineTo(a+mpOs445J(Math.round(a*3),Math.round(b*3),sd)*w,b+mpOs445J(Math.round(b*3),Math.round(a*3),sd+1)*w)}x.stroke()}
function mpOs445Flame(x,a,b,s){x.save();const g=x.createRadialGradient(a,b,0,a,b,6*s);g.addColorStop(0,'rgba(255,196,80,.5)');g.addColorStop(1,'rgba(255,196,80,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,6*s,0,6.3);x.fill();
  x.fillStyle='#e8742a';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-1.1*s,b);x.quadraticCurveTo(a-1.2*s,b-2*s,a,b-3.4*s);x.quadraticCurveTo(a+1.2*s,b-2*s,a+1.1*s,b);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.moveTo(a-.5*s,b);x.quadraticCurveTo(a-.4*s,b-1.2*s,a,b-1.9*s);x.quadraticCurveTo(a+.4*s,b-1.2*s,a+.5*s,b);x.fill();x.restore()}
/* wall sconce: gold bracket on the wall edge with a candle flame; (a,b) is the point on the edge, (dx,dy) points into the wall */
function mpOs445Sconce(x,a,b,dx,dy,s){x.save();x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillStyle=MPL.GOLD;const ax=a+dx*s*.5,ay=b+dy*s*.5;x.beginPath();x.arc(ax,ay,s*.4,0,6.3);x.fill();x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(ax,ay,s*.16,0,6.3);x.fill();x.restore();mpOs445Flame(x,a-dx*s*.3,b-dy*s*.3+s*.2,s*.2)}
function mpOs445Frame(x,a,b,w,h,tint){x.save();x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillRect(a-w/2,b-h/2,w,h);x.strokeRect(a-w/2,b-h/2,w,h);x.fillStyle=tint;x.fillRect(a-w/2+.8,b-h/2+.8,w-1.6,h-1.6);x.fillStyle='rgba(42,26,12,.55)';x.beginPath();x.arc(a,b-h*.08,Math.min(w,h)*.2,0,6.3);x.fill();x.fillRect(a-w*.22,b+h*.08,w*.44,h*.22);x.restore()}
function mpOs445Window(x,a,b,s,vert){x.save();x.translate(a,b);if(!vert)x.rotate(Math.PI/2);x.fillStyle='rgba(110,150,200,.9)';x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.fillRect(-.45*s,-1.3*s,.9*s,2.6*s);x.strokeRect(-.45*s,-1.3*s,.9*s,2.6*s);x.strokeStyle=MPL.INK;x.lineWidth=.35;x.beginPath();x.moveTo(0,-1.3*s);x.lineTo(0,1.3*s);x.stroke();x.restore()}
function mpOs445Mirror(x,a,b,s){x.save();x.fillStyle='#b8d4e8';x.strokeStyle=MPL.GOLD;x.lineWidth=1.2;x.beginPath();x.ellipse(a,b,s*.7,s*1.05,0,0,6.3);x.fill();x.stroke();x.strokeStyle=MPL.INK;x.lineWidth=.4;x.stroke();x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=.6;x.beginPath();x.moveTo(a-s*.3,b-s*.2);x.lineTo(a-s*.05,b-s*.65);x.stroke();x.restore()}
function mpOs445Claws(x,a,b,s){x.save();x.strokeStyle=MPL.plum||'#5a2e44';x.strokeStyle='#4a1a2a';x.lineWidth=.8;x.lineCap='round';for(let k=-1;k<=1;k++){x.beginPath();x.moveTo(a+k*s*.55-s*.35,b-s*.9);x.quadraticCurveTo(a+k*s*.55,b,a+k*s*.55+s*.3,b+s*.9);x.stroke()}x.restore()}
function mpOs445Cage(x,a,b,s){x.save();x.strokeStyle='#4a4a58';x.lineWidth=.7;x.fillStyle='rgba(60,60,72,.18)';x.fillRect(a-s*.75,b-s*.75,s*1.5,s*1.5);x.strokeRect(a-s*.75,b-s*.75,s*1.5,s*1.5);for(let k=-1;k<=1;k++){x.beginPath();x.moveTo(a+k*s*.4,b-s*.75);x.lineTo(a+k*s*.4,b+s*.75);x.stroke()}x.beginPath();x.moveTo(a-s*.75,b-s*.75);x.lineTo(a,b-s*1.1);x.lineTo(a+s*.75,b-s*.75);x.stroke();x.restore()}
function mpOs445Rack(x,a,b,s){x.save();x.strokeStyle=MPL.INK;x.fillStyle='#8a6038';x.lineWidth=.5;x.fillRect(a-s*.8,b-s*.35,s*1.6,s*.7);x.strokeRect(a-s*.8,b-s*.35,s*1.6,s*.7);x.fillStyle='#4a3420';x.fillRect(a-s*.8,b-s*.55,s*.22,s*1.1);x.fillRect(a+s*.58,b-s*.55,s*.22,s*1.1);x.beginPath();x.arc(a-s*.5,b,s*.3,0,6.3);x.arc(a+s*.5,b,s*.3,0,6.3);x.stroke();x.restore()}
function mpOs445Chains(x,a,b,s){x.save();x.strokeStyle='#3a3a44';x.lineWidth=.9;x.setLineDash([1.2,.9]);x.beginPath();x.moveTo(a-s*.4,b-s*.8);x.quadraticCurveTo(a-s*.7,b,a-s*.2,b+s*.8);x.moveTo(a+s*.4,b-s*.8);x.quadraticCurveTo(a+s*.7,b,a+s*.2,b+s*.8);x.stroke();x.restore()}
function mpOs445Throne(x,a,b,s){x.save();x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillStyle=MPL.GOLD;x.beginPath();x.moveTo(a-s*.75,b+s*.7);x.lineTo(a-s*.75,b-s*.7);x.lineTo(a-s*.4,b-s*.35);x.lineTo(a,b-s*.9);x.lineTo(a+s*.4,b-s*.35);x.lineTo(a+s*.75,b-s*.7);x.lineTo(a+s*.75,b+s*.7);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.verm||MPL.VERM;x.fillRect(a-s*.45,b-s*.05,s*.9,s*.55);x.strokeRect(a-s*.45,b-s*.05,s*.9,s*.55);x.restore()}
function mpOs445Banner(x,a,b,s){x.save();x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(a-s*.5,b-s*.9);x.lineTo(a+s*.5,b-s*.9);x.lineTo(a+s*.5,b+s*.6);x.lineTo(a,b+s*.25);x.lineTo(a-s*.5,b+s*.6);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.GOLD2;x.lineWidth=.6;x.beginPath();x.moveTo(a,b-s*.7);x.lineTo(a,b);x.moveTo(a-s*.25,b-s*.4);x.lineTo(a+s*.25,b-s*.4);x.stroke();x.restore()}
function mpOs445Armour(x,a,b,s){x.save();x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillStyle='#a8a8b4';x.beginPath();x.arc(a,b-s*.55,s*.38,Math.PI,0);x.lineTo(a+s*.38,b-s*.35);x.lineTo(a-s*.38,b-s*.35);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(a-s*.55,b-s*.2);x.lineTo(a+s*.55,b-s*.2);x.lineTo(a+s*.4,b+s*.75);x.lineTo(a,b+s*.95);x.lineTo(a-s*.4,b+s*.75);x.closePath();x.fill();x.stroke();x.restore()}
function mpOs445Candle(x,a,b,s){x.save();x.fillStyle='#efe6cc';x.strokeStyle=MPL.INK;x.lineWidth=.4;x.fillRect(a-s*.22,b-s*.05,s*.44,s*.55);x.strokeRect(a-s*.22,b-s*.05,s*.44,s*.55);x.restore();mpOs445Flame(x,a,b-s*.05,s*.16)}
function mpOs445Feast(x,a,b,s,n){x.save();const w=s*(n||1)*.95;x.fillStyle='#8a5a30';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-w/2,b-s*.38,w,s*.76);x.strokeRect(a-w/2,b-s*.38,w,s*.76);x.fillStyle='#f0e8d4';for(let i=0;i<(n||1)*2;i++){x.beginPath();x.arc(a-w/2+(i+.5)*w/((n||1)*2),b-s*.1+(i%2)*s*.2,s*.14,0,6.3);x.fill()}x.fillStyle=MPL.VERM;x.beginPath();x.arc(a,b,s*.12,0,6.3);x.fill();x.restore()}
function mpOs445Bottle(x,a,b,s){x.save();x.fillStyle='#3a7a5a';x.strokeStyle=MPL.INK;x.lineWidth=.45;x.fillRect(a-s*.2,b-s*.55,s*.4,s*.35);x.strokeRect(a-s*.2,b-s*.55,s*.4,s*.35);x.beginPath();x.ellipse(a,b+s*.05,s*.42,s*.4,0,0,6.3);x.fill();x.stroke();x.restore()}
function mpOs445Apple(x,a,b,s){x.save();x.fillStyle=MPL.VERM;x.strokeStyle=MPL.INK;x.lineWidth=.45;x.beginPath();x.arc(a,b,s*.38,0,6.3);x.fill();x.stroke();x.strokeStyle='#3a2a1c';x.beginPath();x.moveTo(a,b-s*.35);x.lineTo(a+s*.12,b-s*.7);x.stroke();x.restore()}
function mpOs445Shelf(x,a,b,s){x.save();x.fillStyle='#7a4a2a';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillRect(a-s*.8,b-s*.4,s*1.6,s*.8);x.strokeRect(a-s*.8,b-s*.4,s*1.6,s*.8);const c=['#b8321e','#274a9a','#c9a227','#3a7a5a'];for(let i=0;i<6;i++){x.fillStyle=c[i%4];x.fillRect(a-s*.7+i*s*.25,b-s*.3,s*.18,s*.28)}x.strokeStyle='#d8c890';x.beginPath();x.moveTo(a-s*.8,b);x.lineTo(a+s*.8,b);x.stroke();x.restore()}
function mpOs445Alcove(x,a,b,s){x.save();x.fillStyle='rgba(40,22,30,.7)';x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.beginPath();x.moveTo(a-s*.55,b+s*.6);x.lineTo(a-s*.55,b-s*.1);x.quadraticCurveTo(a-s*.55,b-s*.8,a,b-s*.85);x.quadraticCurveTo(a+s*.55,b-s*.8,a+s*.55,b-s*.1);x.lineTo(a+s*.55,b+s*.6);x.closePath();x.fill();x.stroke();x.restore()}
function mpOs445Hearth(x,a,b,s){x.save();x.fillStyle='#8a7a6a';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-s*.85,b-s*.6,s*1.7,s*1.2);x.strokeRect(a-s*.85,b-s*.6,s*1.7,s*1.2);x.fillStyle='#2a1a1a';x.fillRect(a-s*.5,b-s*.2,s,s*.8);x.restore();mpOs445Flame(x,a,b+s*.55,s*.25)}
function mpOs445Plaque(x,a,b,s){x.save();x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillRect(a-s*.55,b-s*.4,s*1.1,s*.8);x.strokeRect(a-s*.55,b-s*.4,s*1.1,s*.8);x.strokeStyle='#4a3020';x.lineWidth=.5;x.beginPath();x.moveTo(a-s*.35,b-s*.12);x.lineTo(a+s*.35,b-s*.12);x.moveTo(a-s*.35,b+s*.14);x.lineTo(a+s*.35,b+s*.14);x.stroke();x.restore()}
/* a flight of steps drawn in the stair cell; up = true points the arrow north */
function mpOs445Stair(x,X,Y,cx,cy,s,up){const a=X(cx),b=Y(cy);x.save();x.fillStyle=up?'#f0d878':'#cdb488';x.strokeStyle=MPL.INK;x.lineWidth=.9;x.fillRect(a,b,s,s);x.strokeRect(a,b,s,s);x.lineWidth=.55;for(let i=1;i<5;i++){x.beginPath();x.moveTo(a+s*.06,b+s*i/5);x.lineTo(a+s*.94,b+s*i/5);x.stroke()}
  x.fillStyle=up?MPL.verm||MPL.VERM:MPL.LAPIS;x.beginPath();if(up){x.moveTo(a+s/2,b+s*.1);x.lineTo(a+s*.82,b+s*.55);x.lineTo(a+s*.18,b+s*.55)}else{x.moveTo(a+s/2,b+s*.9);x.lineTo(a+s*.82,b+s*.45);x.lineTo(a+s*.18,b+s*.45)}x.closePath();x.fill();x.stroke();x.restore()}

function mpOs445LabY(r){if(r.n==='Throne Hall')return 5.5;if(r.n==='Banquet Hall'&&r.x0<30)return 11.5;if(r.n==='The Cells'&&r.x0<30)return r.y0-.35;if(r.n==='Gallery of Rulers')return r.y0+(r.x0<10?2:1.5);return (r.y0+r.y1+1)/2}
mplInstall({name:'os445',levels:[445],reveal:true,foot:'You are the yellow arrow. You arrived by the stair in the south.',tint:[8,-2,-12],
draw(c,x,L,api){
  const rows=L.rows,W=rows[0].length,H=rows.length,f=api.fit(W,H),s=f.s,X=f.X,Y=f.Y,INK=MPL.INK,P=MPOS445;
  const isO=(a,b)=>a>=0&&b>=0&&a<W&&b<H&&(rows[b][a]==='.'||rows[b][a]==='0'||rows[b][a]==='1');
  /* only the ground a careful walker can reach counts as floor: chambers behind hidden doors stay solid wall */
  const fl=[];for(let j=0;j<H;j++)fl.push(new Uint8Array(W));
  {const st=L._start||L.start,q=[[st.x,st.y]];fl[st.y][st.x]=1;while(q.length){const [a,b]=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const u=a+dx,v=b+dy;if(isO(u,v)&&!fl[v][u]){fl[v][u]=1;q.push([u,v])}}}}
  const F=(a,b)=>a>=0&&b>=0&&a<W&&b<H&&fl[b][a]===1;
  const R=L._roomsInfo||[];
  const strange=R.find(r=>r.n==='The Strange Room');
  const inStrange=(a,b)=>strange&&a>=strange.x0&&a<=strange.x1&&b>=strange.y0&&b<=strange.y1;
  /* distance of wall cells from the nearest floor (Chebyshev) */
  const D=[];for(let j=0;j<H;j++){D.push(new Int8Array(W).fill(9))}
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(F(i,j))D[j][i]=0;
  for(let pass=1;pass<=3;pass++)for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(D[j][i]===9){let m=false;for(let b=-1;b<=1&&!m;b++)for(let a=-1;a<=1;a++){const u=i+a,v=j+b;if(u>=0&&v>=0&&u<W&&v<H&&D[v][u]===pass-1){m=true;break}}if(m)D[j][i]=pass}
  const A=MPL.AREA;
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  /* spire stone: three washes fading outwards, then pen hatching over the whole mass */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const d=D[j][i];if(d<1||d>3)continue;
    x.fillStyle=d===1?'#9a5a2c':d===2?'#c47a3a':'rgba(217,164,104,.7)';x.fillRect(X(i)-.3,Y(j)-.3,s+.6,s+.6)}
  x.save();x.beginPath();for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(D[j][i]>=1&&D[j][i]<=3)x.rect(X(i),Y(j),s,s);x.clip();
  x.strokeStyle='rgba(90,46,68,.42)';x.lineWidth=.4;
  for(let t=-H*s;t<W*s+H*s;t+=2.1){const ax=X(0)+t,ay=Y(0),bx=ax-H*s,by=Y(H);const n=5;let on=true;for(let k=0;k<n;k++){const u0=k/n,u1=(k+1)/n;if(hash2(Math.round(t*5),k,31)>.18){x.beginPath();x.moveTo(ax+(bx-ax)*u0+mpOs445J(k,Math.round(t),2)*.5,ay+(by-ay)*u0);x.lineTo(ax+(bx-ax)*u1,ay+(by-ay)*u1);x.stroke()}}}
  /* violet shadow on the near wall band and masonry joints */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(D[j][i]===1){x.fillStyle='rgba(90,46,68,.28)';x.fillRect(X(i),Y(j),s,s);
    x.strokeStyle='rgba(42,26,12,.5)';x.lineWidth=.35;const o=(i+j)%2?.5:0;x.beginPath();x.moveTo(X(i),Y(j)+s*.5);x.lineTo(X(i)+s,Y(j)+s*.5+mpOs445J(i,j,3)*.6);x.moveTo(X(i)+s*(.3+o*.4),Y(j));x.lineTo(X(i)+s*(.3+o*.4),Y(j)+s*.5);x.moveTo(X(i)+s*(.7-o*.4),Y(j)+s*.5);x.lineTo(X(i)+s*(.7-o*.4),Y(j)+s);x.stroke()}
  x.restore();
  /* the floor: flagstones in warm cream, a little different from cell to cell */
  const tones=['#ecd7a4','#f0dfb2','#e8d09a','#f3e4bc'];
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(F(i,j)){x.fillStyle=tones[Math.floor(hash2(i,j,5)*4)];x.fillRect(X(i)-.2,Y(j)-.2,s+.4,s+.4)}
  x.strokeStyle='rgba(110,70,30,.3)';x.lineWidth=.35;
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(F(i,j)){const a=X(i),b=Y(j);
    x.beginPath();x.moveTo(a,b+s);x.lineTo(a+s,b+s+mpOs445J(i,j,6)*.4);x.moveTo(a+s,b);x.lineTo(a+s+mpOs445J(i,j,7)*.4,b+s);x.stroke();
    if(hash2(i,j,8)>.8){x.beginPath();x.moveTo(a+s*.3,b+s*.2);x.lineTo(a+s*.55,b+s*.45);x.lineTo(a+s*.5,b+s*.8);x.stroke()}}
  /* rooms: a faint warm tint under each named room, then the throne carpet */
  for(const r of R){if(!r.n)continue;x.fillStyle=/Throne/.test(r.n)?'rgba(184,50,30,.08)':'rgba(201,162,39,.09)';for(let j=r.y0;j<=r.y1;j++)for(let i=r.x0;i<=r.x1;i++)if(F(i,j))x.fillRect(X(i),Y(j),s,s)}
  {const th=R.find(r=>r.n==='Throne Hall');if(th){const cx=18;x.fillStyle=MPL.VERM;x.fillRect(X(cx)+s*.12,Y(th.y0+1),s*.76,Y(th.y1)-Y(th.y0+1)+s*.5);x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.strokeRect(X(cx)+s*.12,Y(th.y0+1),s*.76,Y(th.y1)-Y(th.y0+1)+s*.5);x.strokeStyle=MPL.GOLD2;x.lineWidth=.4;for(let j=th.y0+1;j<=th.y1;j++){x.beginPath();x.arc(X(cx)+s*.5,Y(j)+s*.5,s*.18,0,6.3);x.stroke()}}}
  /* soft shadow on the floor beside the walls */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(F(i,j)){const a=X(i),b=Y(j);
    if(!F(i,j-1)){const g=x.createLinearGradient(0,b,0,b+s*.55);g.addColorStop(0,'rgba(90,46,68,.32)');g.addColorStop(1,'rgba(90,46,68,0)');x.fillStyle=g;x.fillRect(a,b,s,s*.55)}
    if(!F(i-1,j)){const g=x.createLinearGradient(a,0,a+s*.5,0);g.addColorStop(0,'rgba(90,46,68,.26)');g.addColorStop(1,'rgba(90,46,68,0)');x.fillStyle=g;x.fillRect(a,b,s*.5,s)}}
  /* doubled wobbly ink along every wall edge */
  x.lineCap='round';
  for(const [lw,col,sd,off] of [[1.15,INK,11,0],[.5,'rgba(42,26,12,.75)',23,.55]])for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(F(i,j)){const a=X(i),b=Y(j);x.strokeStyle=col;x.lineWidth=lw;
    if(!F(i,j-1)){mpOs445Line(x,[a,b-off],[a+s,b-off],.55,sd)}if(!F(i,j+1)){mpOs445Line(x,[a,b+s+off],[a+s,b+s+off],.55,sd+2)}
    if(!F(i-1,j)){mpOs445Line(x,[a-off,b],[a-off,b+s],.55,sd+4)}if(!F(i+1,j)){mpOs445Line(x,[a+s+off,b],[a+s+off,b+s],.55,sd+6)}}
  /* thresholds: a gold door frame where a named room opens onto the way outside */
  for(const r of R){if(!r.n)continue;for(let j=r.y0;j<=r.y1;j++)for(let i=r.x0;i<=r.x1;i++){if(!F(i,j))continue;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const u=i+dx,v=j+dy;if(F(u,v)&&!(u>=r.x0&&u<=r.x1&&v>=r.y0&&v<=r.y1)){
      const ex=dx===1?X(i)+s:dx===-1?X(i):X(i)+s/2,ey=dy===1?Y(j)+s:dy===-1?Y(j):Y(j)+s/2;x.strokeStyle=MPL.GOLD;x.lineWidth=1.3;x.beginPath();
      if(dx)x.moveTo(ex,ey-s*.46),x.lineTo(ex,ey+s*.46);else x.moveTo(ex-s*.46,ey),x.lineTo(ex+s*.46,ey);x.stroke();x.strokeStyle=INK;x.lineWidth=.35;x.stroke()}}}}
  /* furniture and decoration, at the real positions */
  const wallDir=(a,b)=>{for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]])if(!F(a+dx,b+dy))return [dx,dy];return null};
  const cxy=(a,b)=>[X(a)+s/2,Y(b)+s/2];
  const edge=(a,b,k)=>{const d=wallDir(a,b);const [px,py]=cxy(a,b);return d?[px+d[0]*s*k,py+d[1]*s*k,d]:[px,py,[0,0]]};
  const ptTints=['#8a4c6a','#4a6a8a','#6a8a4a','#9a6a3a','#6a4a8a','#8a3a3a'];
  const sconces=[];
  for(const d of L.decor){const k=d.k;if(!F(d.x,d.y)||inStrange(d.x,d.y)&&k!=='lamp')continue;if(k==='statue'||k==='chest'||k==='lever'||k==='hl_p_note')continue;
    const [px,py]=cxy(d.x,d.y);
    if(k==='lamp'){const e=edge(d.x,d.y,.5);sconces.push([e[0],e[1],e[2][0],e[2][1]])}
    else if(/^hl_pt\d$/.test(k)){const e=edge(d.x,d.y,.32),v=e[2][0]!==0;mpOs445Frame(x,e[0],e[1],v?s*.42:s*.8,v?s*.8:s*.42,ptTints[(d.x*3+d.y)%6])}
    else if(/^hl_plq/.test(k)){const e=edge(d.x,d.y,.32);mpOs445Plaque(x,e[0],e[1],s*.9)}
    else if(k==='hl_p_window'){const e=edge(d.x,d.y,.5);mpOs445Window(x,e[0],e[1],s*.6,e[2][0]!==0)}
    else if(k==='hl_p_mirror'){const e=edge(d.x,d.y,.2);mpOs445Mirror(x,e[0],e[1],s*.55)}
    else if(k==='hl_p_candle')mpOs445Candle(x,px,py+s*.05,s*.9);
    else if(k==='hl_fire'){const e=edge(d.x,d.y,.15);mpOs445Hearth(x,e[0],e[1],s*.7)}
    else if(k==='hl_p_cage')mpOs445Cage(x,px,py,s*.62);
    else if(k==='hl_p_rack')mpOs445Rack(x,px,py,s*.7);
    else if(k==='hl_p_chains')mpOs445Chains(x,px,py,s*.7);
    else if(k==='hl_p_throne')mpOs445Throne(x,px,py,s*.72);
    else if(k==='hl_p_banner')mpOs445Banner(x,px,py,s*.7);
    else if(k==='hl_p_armour')mpOs445Armour(x,px,py,s*.7);
    else if(k==='hl_p_feast')mpOs445Feast(x,px,py,s*.9,3);
    else if(k==='hl_p_poison')mpOs445Bottle(x,px,py,s*.75);
    else if(k==='hl_p_apple')mpOs445Apple(x,px,py,s*.75);
    else if(k==='hl_p_shelf')mpOs445Shelf(x,px,py,s*.75);
    else if(k==='hl_p_alcove'){const e=edge(d.x,d.y,.22);mpOs445Alcove(x,e[0],e[1],s*.8)}
    else if(/^hl_claw/.test(k))mpOs445Claws(x,px,py,s*.55)}
  for(const q of sconces)mpOs445Sconce(x,q[0],q[1],q[2],q[3],s*.9);
  /* stairs and the numbered stone where the party arrives */
  const up=L._up,st=L._start||L.start;
  mpOs445Stair(x,X,Y,up.x,up.y,s,true);
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(rows[j][i]==='0')mpOs445Stair(x,X,Y,i,j,s,false);
  {const a=X(st.x)+s/2,b=Y(st.y)+s/2;x.fillStyle='#a8a0b8';x.strokeStyle=MPL.GOLD;x.lineWidth=1.2;x.beginPath();x.arc(a,b,s*.42,0,6.3);x.fill();x.stroke();x.strokeStyle=INK;x.lineWidth=.4;x.stroke();x.fillStyle=INK;x.font=`bold ${s*.62}px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.fillText('6',a,b+.3)}
  /* room names; the strange room has no other name */
  for(const r of R){if(!r.n)continue;const a=X((r.x0+r.x1+1)/2),b=Y(mpOs445LabY(r));api.text(x,r.n,a,b,5.4,'#3a1c0c','center')}
  api.text(x,'Stair down',X(st.x+1.1),Y(st.y+1.5),5.4,'#274a9a','left');
  api.text(x,'Stair up',X(up.x+1.2),Y(up.y+.5),5.4,'#8a2a1a','left');
  x.restore();
  /* margins */
  api.title(x,'The Orange Spire, Floor 6','',12,12);
  {let ty=44;for(const l of api.wrap(x,hlMapSub(L),76,6.4)){mplText(x,l,12,ty,6.4,'#5a3a1c','left');ty+=8}}
  const kx=5,ky=62;api.panel(x,kx,ky,84,196);api.text(x,'KEY',kx+42,ky+9,7,MPL.LAPIS);
  const ks=7,ki=[
    ['Stair up',()=>mpOs445Stair(x,a=>kx+8+a,b=>ky+b,0,17,ks+1,true)],
    ['Stair down',()=>mpOs445Stair(x,a=>kx+8+a,b=>ky+b,0,30,ks+1,false)],
    ['Start stone',()=>{x.fillStyle='#a8a0b8';x.strokeStyle=MPL.GOLD;x.lineWidth=1.1;x.beginPath();x.arc(kx+12,ky+53,4,0,6.3);x.fill();x.stroke();x.fillStyle=INK;x.font=`bold 5px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.fillText('6',kx+12,ky+53.3)}],
    ['Doorway',()=>{x.strokeStyle=MPL.GOLD;x.lineWidth=1.4;x.beginPath();x.moveTo(kx+12,ky+64);x.lineTo(kx+12,ky+75);x.stroke();x.strokeStyle=INK;x.lineWidth=.4;x.stroke()}],
    ['Wall torch',()=>mpOs445Sconce(x,kx+12,ky+93,0,-1,6)],
    ['Candle',()=>mpOs445Candle(x,kx+12,ky+107,7)],
    ['Portrait',()=>mpOs445Frame(x,kx+12,ky+120,6,8,'#8a4c6a')],
    ['Window',()=>mpOs445Window(x,kx+12,ky+134,3.4,true)],
    ['Mirror',()=>mpOs445Mirror(x,kx+12,ky+148,4.5)],
    ['Throne',()=>mpOs445Throne(x,kx+12,ky+162,5)],
    ['Cage',()=>mpOs445Cage(x,kx+12,ky+176,4.5)],
    ['Carpet',()=>{x.fillStyle=MPL.VERM;x.fillRect(kx+9,ky+186,6,8);x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.strokeRect(kx+9,ky+186,6,8)}]];
  const gaps=[21,34,53,70,93,106,120,133,148,162,176,190];
  ki.forEach((r,i)=>{r[1]();api.text(x,r[0],kx+24,ky+gaps[i],6.2,'#3a2a1c','left')});
  const nx=391,nw=84;api.panel(x,nx-2,50,nw,150);
  mplNotes(x,hlMapNotes(L,['Only some rooms have names.','Torches and candles light the rooms.']),nx+3,69,nw-9,6.2,4);
  api.compass(x,436,242,15);
}});
