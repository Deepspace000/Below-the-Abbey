/* ==========================================================================
   Area map for Gandrick's Wood (levels 7 and 25) and Gandrick's Cave (level 8). See maps_common.js.
   Level 7 is the wood: oaks, dirt trails, the bandit camp with tents and fires, the cave mouth in the north, the hideout in the north east.
   Level 8 is the cave and level 25 is the small hideout room: both drawn as a cavern plan with stalactite hatching.
   All names start with mpGwood. Wobbly pen lines use hash2(a,b,seed) so the sheet is the same every time.
   ========================================================================== */
/* a pen line with a little wobble */
function mpGwoodLine(x,x0,y0,x1,y1,seed,amp){
  const d=Math.hypot(x1-x0,y1-y0),n=Math.max(2,Math.ceil(d/3)),nx=-(y1-y0)/(d||1),ny=(x1-x0)/(d||1);
  x.beginPath();x.moveTo(x0,y0);
  for(let i=1;i<=n;i++){const t=i/n,w=i===n?0:(hash2(i,seed,31)-.5)*2*amp;x.lineTo(x0+(x1-x0)*t+nx*w,y0+(y1-y0)*t+ny*w)}
  x.stroke()}
/* an oak seen from the front: trunk, three-lobed canopy, a lighter top and a few leaf marks */
const MPGWOOD_GREENS=['#4f7a45','#5d8a4c','#46703d','#6a9552','#3f6a3c'];
function mpGwoodOak(x,a,b,r,k,deep){
  const col=MPGWOOD_GREENS[k%5];
  if(r>2.1){x.fillStyle='#5a3a1c';x.fillRect(a-r*.12,b-r*.5,r*.24,r*.7)}
  x.fillStyle=deep?'#2f5a34':col;x.strokeStyle='rgba(30,26,12,.75)';x.lineWidth=.55;
  for(const [dx,dy,rr] of [[0,-r*.95,r*.72],[-r*.55,-r*.5,r*.55],[r*.55,-r*.5,r*.55]]){x.beginPath();x.arc(a+dx,b+dy,rr,0,6.3);x.fill();x.stroke()}
  if(!deep){x.fillStyle='rgba(205,225,140,.4)';x.beginPath();x.arc(a-r*.2,b-r*1.15,r*.36,0,6.3);x.fill()}
  if(r>2.6){x.strokeStyle='rgba(30,50,20,.55)';x.lineWidth=.4;for(let i=0;i<3;i++){const px=a+(hash2(k,i,5)-.5)*r*1.1,py=b-r*(.3+hash2(k,i,6)*.8);x.beginPath();x.arc(px,py,r*.16,0,3.1);x.stroke()}}}
function mpGwoodTent(x,a,b,s,col,flag){
  x.save();x.lineJoin='round';x.strokeStyle=MPL.INK;x.lineWidth=.8;
  x.fillStyle=col;x.beginPath();x.moveTo(a-5.5*s,b);x.lineTo(a,b-8*s);x.lineTo(a+5.5*s,b);x.closePath();x.fill();x.stroke();
  x.fillStyle='rgba(240,225,190,.55)';x.beginPath();x.moveTo(a-2.7*s,b-4*s);x.lineTo(a,b-8*s);x.lineTo(a+2.7*s,b-4*s);x.closePath();x.fill();
  x.lineWidth=.45;x.beginPath();x.moveTo(a,b-8*s);x.lineTo(a-3.2*s,b);x.moveTo(a,b-8*s);x.lineTo(a+3.2*s,b);x.stroke();
  x.fillStyle='#2a1a0c';x.beginPath();x.moveTo(a-1.4*s,b);x.lineTo(a,b-3.6*s);x.lineTo(a+1.4*s,b);x.closePath();x.fill();
  x.lineWidth=.8;x.beginPath();x.moveTo(a,b-8*s);x.lineTo(a,b-11.2*s);x.stroke();
  x.fillStyle=flag||MPL.VERM;x.beginPath();x.moveTo(a,b-11.2*s);x.lineTo(a+3.4*s,b-10.2*s);x.lineTo(a,b-9*s);x.closePath();x.fill();x.stroke();x.restore()}
function mpGwoodFire(x,a,b,s){
  x.save();const g=x.createRadialGradient(a,b,0,a,b,7*s);g.addColorStop(0,'rgba(255,200,80,.55)');g.addColorStop(1,'rgba(255,200,80,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,7*s,0,6.3);x.fill();
  x.strokeStyle='#4a2a10';x.lineWidth=1.3*s;x.beginPath();x.moveTo(a-3*s,b+1.2*s);x.lineTo(a+3*s,b-.6*s);x.moveTo(a-3*s,b-.6*s);x.lineTo(a+3*s,b+1.2*s);x.stroke();
  x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(a-2*s,b);x.quadraticCurveTo(a-2.4*s,b-3*s,a,b-6*s);x.quadraticCurveTo(a+.4*s,b-3*s,a+2*s,b);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD2;x.beginPath();x.moveTo(a-1*s,b);x.quadraticCurveTo(a-1.2*s,b-1.8*s,a,b-3.4*s);x.quadraticCurveTo(a+.3*s,b-1.8*s,a+1*s,b);x.closePath();x.fill();x.restore()}
function mpGwoodBarrel(x,a,b,s){x.save();x.fillStyle='#8a5a2c';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.ellipse(a,b,2.3*s,2.7*s,0,0,6.3);x.fill();x.stroke();x.strokeStyle='#3a2410';x.beginPath();x.moveTo(a-2.2*s,b-.9*s);x.lineTo(a+2.2*s,b-.9*s);x.moveTo(a-2.2*s,b+.9*s);x.lineTo(a+2.2*s,b+.9*s);x.stroke();x.restore()}
function mpGwoodCrate(x,a,b,s){x.save();x.fillStyle='#b88a4c';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-2.3*s,b-2.3*s,4.6*s,4.6*s);x.strokeRect(a-2.3*s,b-2.3*s,4.6*s,4.6*s);x.beginPath();x.moveTo(a-2.3*s,b-2.3*s);x.lineTo(a+2.3*s,b+2.3*s);x.moveTo(a+2.3*s,b-2.3*s);x.lineTo(a-2.3*s,b+2.3*s);x.stroke();x.restore()}
function mpGwoodChest(x,a,b,s){x.save();x.fillStyle='#8a5a2c';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillRect(a-3.2*s,b-1.8*s,6.4*s,3.8*s);x.strokeRect(a-3.2*s,b-1.8*s,6.4*s,3.8*s);x.fillStyle='#a8713a';x.beginPath();x.ellipse(a,b-1.8*s,3.2*s,1.7*s,0,Math.PI,0);x.fill();x.stroke();x.fillStyle=MPL.GOLD;x.fillRect(a-3.2*s,b-.2*s,6.4*s,.9*s);x.fillRect(a-.6*s,b-.8*s,1.2*s,1.8*s);x.restore()}
function mpGwoodBones(x,a,b,s){x.save();x.strokeStyle='#f1e9d4';x.lineWidth=1.2*s;x.lineCap='round';x.beginPath();x.moveTo(a-2*s,b-1*s);x.lineTo(a+2*s,b+1*s);x.moveTo(a-2*s,b+1*s);x.lineTo(a+2*s,b-1*s);x.stroke();x.strokeStyle='rgba(42,26,12,.6)';x.lineWidth=.35;x.stroke();x.restore()}
function mpGwoodCoffin(x,a,b,s){x.save();x.fillStyle='#bdb49c';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.moveTo(a-2*s,b-3.6*s);x.lineTo(a+2*s,b-3.6*s);x.lineTo(a+2.6*s,b-2*s);x.lineTo(a+2.6*s,b+3.6*s);x.lineTo(a-2.6*s,b+3.6*s);x.lineTo(a-2.6*s,b-2*s);x.closePath();x.fill();x.stroke();MPLI.cross(x,a,b,.45*s);x.restore()}
/* a cave mouth seen from the front: a rocky mound with a dark opening and teeth of stalactites */
function mpGwoodCaveMouth(x,a,b,s){
  x.save();x.lineJoin='round';x.strokeStyle=MPL.INK;x.lineWidth=.9;
  x.fillStyle='#9b8a72';x.beginPath();x.moveTo(a-9*s,b);x.quadraticCurveTo(a-9*s,b-6*s,a-5*s,b-9*s);x.quadraticCurveTo(a-1*s,b-13*s,a+4*s,b-10*s);x.quadraticCurveTo(a+9*s,b-7*s,a+9*s,b);x.closePath();x.fill();x.stroke();
  x.fillStyle='rgba(60,45,30,.35)';x.beginPath();x.moveTo(a+9*s,b);x.quadraticCurveTo(a+9*s,b-7*s,a+4*s,b-10*s);x.quadraticCurveTo(a+6*s,b-5*s,a+4*s,b);x.fill();
  x.fillStyle='#1c130a';x.beginPath();x.moveTo(a-4.4*s,b);x.quadraticCurveTo(a-4.4*s,b-6.6*s,a,b-6.6*s);x.quadraticCurveTo(a+4.4*s,b-6.6*s,a+4.4*s,b);x.closePath();x.fill();x.stroke();
  x.fillStyle='#c9bda4';for(let i=0;i<5;i++){const px=a-3.4*s+i*1.7*s,h=(1.2+hash2(i,7,9)*1.6)*s;x.beginPath();x.moveTo(px-.7*s,b-6.2*s+Math.abs(i-2)*.9*s);x.lineTo(px,b-6.2*s+h+Math.abs(i-2)*.9*s);x.lineTo(px+.7*s,b-6.2*s+Math.abs(i-2)*.9*s);x.closePath();x.fill();x.lineWidth=.4;x.stroke()}
  x.strokeStyle='rgba(42,26,12,.6)';x.lineWidth=.45;for(let i=0;i<14;i++){const px=a+(hash2(i,3,9)-.5)*15*s,py=b-2*s-hash2(i,4,9)*8*s;if(Math.abs(px-a)<4.6*s&&py>b-6.8*s)continue;x.beginPath();x.moveTo(px,py);x.lineTo(px+1.6*s,py+1.6*s);x.stroke()}
  x.restore()}
/* ---------------------------------------------------------------- the wood */
function mpGwoodDrawWood(x,L,api){
  const A=MPL.AREA,W=L.rows[0].length,H=L.rows.length,f=mplFit(W,H),s=f.s,X=f.X,Y=f.Y;
  const ch=(cx,cy)=>cx<0||cy<0||cx>=W||cy>=H?'T':L.rows[cy][cx],isT=(cx,cy)=>ch(cx,cy)==='T',trail=(cx,cy)=>L.fmap&&L.fmap[cy]&&L.fmap[cy][cx]==='1'&&!isT(cx,cy);
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  x.fillStyle='rgba(120,140,80,.42)';x.fillRect(A.x,A.y,A.w,A.h);
  const c0=Math.floor((A.x-f.ox)/s)-1,c1=Math.ceil((A.x+A.w-f.ox)/s)+1,r0=Math.floor((A.y-f.oy)/s)-1,r1=Math.ceil((A.y+A.h-f.oy)/s)+1;
  /* clearings: pale wash in soft blobs so the grid does not show */
  for(let cy=r0;cy<=r1;cy++)for(let cx=c0;cx<=c1;cx++){if(isT(cx,cy))continue;
    x.fillStyle='rgba(222,214,150,.55)';x.beginPath();x.ellipse(X(cx+.5)+(hash2(cx,cy,1)-.5)*s*.5,Y(cy+.5)+(hash2(cx,cy,2)-.5)*s*.5,s*.78,s*.72,hash2(cx,cy,3)*3,0,6.3);x.fill()}
  /* grass marks */
  x.strokeStyle='rgba(60,90,40,.55)';x.lineWidth=.5;
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(isT(cx,cy))continue;for(let k=0;k<3;k++){const a=X(cx+hash2(cx,cy,10+k)),b=Y(cy+hash2(cx,cy,20+k));x.beginPath();x.moveTo(a,b);x.lineTo(a-.8,b-2);x.moveTo(a,b);x.lineTo(a+.8,b-2.2);x.stroke()}}
  /* dirt trails: dark edge first, then pale earth, then pebbles */
  for(const pass of [0,1]){for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!trail(cx,cy))continue;
    const a=X(cx+.5)+(hash2(cx,cy,4)-.5)*s*.3,b=Y(cy+.5)+(hash2(cx,cy,5)-.5)*s*.3;
    x.fillStyle=pass?'#cfae72':'#8a6a3c';x.beginPath();x.ellipse(a,b,s*(pass?.62:.78),s*(pass?.6:.76),hash2(cx,cy,6)*3,0,6.3);x.fill()}}
  x.fillStyle='rgba(90,64,34,.6)';for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!trail(cx,cy))continue;for(let k=0;k<2;k++){x.beginPath();x.arc(X(cx+hash2(cx,cy,30+k)),Y(cy+hash2(cx,cy,40+k)),.5,0,6.3);x.fill()}}
  /* everything standing is gathered and drawn from the back to the front */
  const items=[],push=(y,fn)=>items.push({y,fn});
  for(let cy=r0;cy<=r1;cy++)for(let cx=c0;cx<=c1;cx++){if(!isT(cx,cy))continue;
    let near=false;for(let dy=-2;dy<=2&&!near;dy++)for(let dx=-2;dx<=2;dx++)if(!isT(cx+dx,cy+dy)){near=true;break}
    for(let k=0;k<2;k++){const a=X(cx+.15+hash2(cx,cy,50+k)*.7),b=Y(cy+.3+hash2(cx,cy,60+k)*.6),r=s*(.7+hash2(cx,cy,70+k)*.35),kk=cx*7+cy*3+k;push(b,()=>mpGwoodOak(x,a,b,r,kk,!near&&hash2(cx,cy,80+k)<.5))}}
  for(const d of L.decor||[]){if(isT(d.x,d.y))continue;const a=X(d.x+.5+(d.ox||0)),b=Y(d.y+.5+(d.oy||0)),k=d.k,kk=d.x*5+d.y;
    if(/^g?tree/.test(k)&&d.block)push(b,()=>mpGwoodOak(x,a,b+s*.3,s*.62,kk,false));
    else if(k==='gstump')push(b,()=>{x.fillStyle='#a07a4c';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.ellipse(a,b,s*.28,s*.2,0,0,6.3);x.fill();x.stroke();x.beginPath();x.ellipse(a,b,s*.12,s*.08,0,0,6.3);x.stroke()});
    else if(k==='gboulder'||k==='grocks')push(b,()=>{x.fillStyle='#a69e8c';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.moveTo(a-s*.3,b+s*.15);x.lineTo(a-s*.18,b-s*.18);x.lineTo(a+s*.1,b-s*.25);x.lineTo(a+s*.32,b+s*.15);x.closePath();x.fill();x.stroke()});
    else if(k==='glogm')push(b,()=>{x.strokeStyle='#6a4a28';x.lineWidth=1.6;x.lineCap='round';x.beginPath();x.moveTo(a-s*.35,b);x.lineTo(a+s*.35,b+s*.08);x.stroke();x.strokeStyle=MPL.INK;x.lineWidth=.4;x.stroke()});
    else if(k==='gbramble')push(b,()=>{x.strokeStyle='#6a3a2a';x.lineWidth=.5;x.beginPath();x.moveTo(a-s*.3,b);x.lineTo(a-s*.1,b-s*.25);x.lineTo(a+s*.1,b);x.lineTo(a+s*.3,b-s*.2);x.stroke()});
    else if(/^bush/.test(k))push(b,()=>{x.fillStyle='#6f9a4c';x.strokeStyle=MPL.INK;x.lineWidth=.4;x.beginPath();x.arc(a,b,s*.22,0,6.3);x.fill();x.stroke()});
    else if(/^flora/.test(k)){const cols=['#c9402e','#e8c84a','#8a5ab8','#e8e4d0'];push(b,()=>{x.fillStyle=cols[kk%4];x.beginPath();x.arc(a,b,.8,0,6.3);x.fill()})}
    else if(k==='gfungus')push(b,()=>{x.fillStyle='#b8321e';x.beginPath();x.arc(a,b,.8,0,6.3);x.fill()});
    else if(k==='bones')push(b,()=>mpGwoodBones(x,a,b,.7));
    else if(k==='barrel')push(b,()=>mpGwoodBarrel(x,a,b,s*.14));
    else if(k==='crate')push(b,()=>mpGwoodCrate(x,a,b,s*.14))}
  items.sort((p,q)=>p.y-q.y);for(const it of items)it.fn();
  /* the bandit camp: a ring of sharpened stakes, tents, a big fire */
  const ccx=24.6,ccy=15.6;
  x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillStyle='#b99a64';
  const stakes=[];for(let i=0;i<30;i++){const an=i/30*6.283;if(Math.abs(Math.sin(an))>.8)continue;stakes.push([X(ccx+Math.cos(an)*5.9),Y(ccy+Math.sin(an)*5.1)])}
  x.strokeStyle='rgba(74,44,20,.7)';x.lineWidth=.6;x.beginPath();x.ellipse(X(ccx),Y(ccy),s*5.9,s*5.1,0,.5,2.64);x.stroke();x.beginPath();x.ellipse(X(ccx),Y(ccy),s*5.9,s*5.1,0,3.64,5.78);x.stroke();
  x.strokeStyle=MPL.INK;for(const [a,b] of stakes){x.beginPath();x.moveTo(a-.8,b);x.lineTo(a,b-3.6);x.lineTo(a+.8,b);x.closePath();x.fill();x.stroke()}
  const tents=[[21.4,13.6,'#b8321e'],[28.0,14.6,'#c9a227'],[21.6,18.2,'#274a9a'],[27.2,18.6,'#b8321e'],[24.4,11.8,'#3a7a5a']];
  for(const [tx,ty,col] of tents)mpGwoodTent(x,X(tx),Y(ty),.9,col);
  for(const [bx,by] of [[22.5,14.5],[25.5,16.5],[22.5,16.5],[23.5,16.5],[26.5,14.5]])mpGwoodBarrel(x,X(bx),Y(by),.62);
  mpGwoodCrate(x,X(24.5),Y(13.5),.62);mpGwoodCrate(x,X(26.5),Y(15.5),.55);
  mpGwoodFire(x,X(24.6),Y(15.3),1.1);
  for(const [lx,ly] of [[26.5,13.5],[27.5,18.5]]){x.fillStyle=MPL.GOLD2;x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.arc(X(lx),Y(ly),1.5,0,6.3);x.fill();x.stroke()}
  /* the huntress's little camp in the west */
  mpGwoodTent(x,X(13.4),Y(19.7),.7,'#3a7a5a','#c9a227');mpGwoodFire(x,X(15.5),Y(19.4),.7);mpGwoodBarrel(x,X(15.7),Y(20.1),.45);mpGwoodCrate(x,X(14.4),Y(20.9),.4);
  /* cave mouth in the north, hideout rock in the north east */
  mpGwoodCaveMouth(x,X(22.5),Y(2.3),.82);
  mpGwoodCaveMouth(x,X(37.5),Y(9.9),.45);
  /* signposts for the south and west trails */
  for(const [px,py,rot] of [[22.5,28.0,0],[9.4,19.5,1]]){const a=X(px),b=Y(py);x.strokeStyle='#4a2c14';x.lineWidth=1.3;x.beginPath();x.moveTo(a,b+4);x.lineTo(a,b-5);x.stroke();x.fillStyle='#c9a86a';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(a-5,b-5);x.lineTo(a+3,b-5);x.lineTo(a+6,b-3.4);x.lineTo(a+3,b-1.8);x.lineTo(a-5,b-1.8);x.closePath();x.fill();x.stroke()}
  x.restore();
  x.strokeStyle=MPL.INK;x.lineWidth=.8;x.strokeRect(A.x,A.y,A.w,A.h);x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.strokeRect(A.x+1.6,A.y+1.6,A.w-3.2,A.h-3.2);
  /* names */
  const T=(t,cx,cy,sz,col)=>mplText(x,t,X(cx),Y(cy),sz||6.6,col||MPL.INK);
  T('The Bandit Camp',24.6,9.4,7.2,MPL.VERM);T("Gandrick's Cave",22.5,5.3,7);T('Bandit Hideout',37.5,12.6,6.2);
  T('The Huntress',14.6,22.6,6);T('To Thornwick',22.5,25.6,6.4);T('To Ironhill',10.6,17.4,6.4);T('Gandrick’s Wood',34,27.4,9,'#2f5a34');
  T('Old Oaks',12,6,6,'#2f5a34');T('Dense Wood',36,22,6,'#2f5a34');
  x.save();x.strokeStyle='rgba(30,26,12,.5)';x.lineWidth=.5;x.restore()}
/* ---------------------------------------------------------------- caves */
function mpGwoodDrawCave(x,L,api){
  const A=MPL.AREA,W=L.rows[0].length,H=L.rows.length,f=mplFit(W,H),u=f.s,X=f.X,Y=f.Y,wall=(cx,cy)=>cx<0||cy<0||cx>=W||cy>=H||L.rows[cy][cx]==='#';
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  /* the rock: brown wash with pairs of hatch strokes */
  x.fillStyle='#8c7a62';x.fillRect(A.x,A.y,A.w,A.h);
  x.fillStyle='rgba(60,44,28,.12)';for(let i=0;i<90;i++){x.beginPath();x.ellipse(A.x+hash2(i,1,2)*A.w,A.y+hash2(i,2,2)*A.h,12+hash2(i,3,2)*30,8+hash2(i,4,2)*16,hash2(i,5,2)*3,0,6.3);x.fill()}
  const dist=(cx,cy)=>{for(let r=1;r<=3;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(Math.max(Math.abs(dx),Math.abs(dy))===r&&!wall(cx+dx,cy+dy))return r;return 4};
  for(let cy=Math.floor((A.y-f.oy)/u)-1;cy<=Math.ceil((A.y+A.h-f.oy)/u);cy++)for(let cx=Math.floor((A.x-f.ox)/u)-1;cx<=Math.ceil((A.x+A.w-f.ox)/u);cx++){if(!wall(cx,cy))continue;const d=dist(cx,cy);
    x.fillStyle=d===1?'rgba(30,20,10,.26)':d===2?'rgba(30,20,10,.15)':d===3?'rgba(30,20,10,.1)':'rgba(30,20,10,.04)';x.beginPath();x.ellipse(X(cx+.5),Y(cy+.5),u*.75,u*.75,0,0,6.3);x.fill();
    x.strokeStyle=d<4?'rgba(36,22,10,.6)':'rgba(36,22,10,.28)';x.lineWidth=.55;const n=d===1?7:d===2?5:d===3?3:1;
    for(let i=0;i<n;i++){const a=X(cx+hash2(cx,cy,100+i)),b=Y(cy+hash2(cx,cy,120+i)),l=u*(.25+hash2(cx,cy,140+i)*.35);x.beginPath();x.moveTo(a,b);x.lineTo(a+l*.7,b+l*.7);x.stroke();if(d===1&&i%2){x.beginPath();x.moveTo(a,b+l*.7);x.lineTo(a+l*.7,b);x.stroke()}}}
  /* floor: sandy blocks with a jittered edge, then a paler layer */
  for(const pass of [0,1])for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))continue;
    const e=pass?.05:-.12;x.fillStyle=pass?'#dccd9e':'#a89a74';const j=(k)=>(hash2(cx,cy,k+pass*9)-.5)*.16*u;
    x.beginPath();x.moveTo(X(cx-e)+j(1),Y(cy-e)+j(2));x.lineTo(X(cx+1+e)+j(3),Y(cy-e)+j(4));x.lineTo(X(cx+1+e)+j(5),Y(cy+1+e)+j(6));x.lineTo(X(cx-e)+j(7),Y(cy+1+e)+j(8));x.closePath();x.fill()}
  /* floor pebbles and stains */
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))continue;
    x.fillStyle='rgba(120,100,60,.13)';x.beginPath();x.ellipse(X(cx+hash2(cx,cy,60)),Y(cy+hash2(cx,cy,61)),u*.3,u*.2,hash2(cx,cy,62)*3,0,6.3);x.fill();
    x.fillStyle='rgba(90,70,40,.55)';for(let k=0;k<2;k++){x.beginPath();x.arc(X(cx+hash2(cx,cy,63+k)),Y(cy+hash2(cx,cy,65+k)),.55,0,6.3);x.fill()}
    if(hash2(cx,cy,70)<.07){x.fillStyle='#b8a888';x.strokeStyle=MPL.INK;x.lineWidth=.5;const a=X(cx+.5),b=Y(cy+.85);x.beginPath();x.moveTo(a-u*.1,b);x.lineTo(a,b-u*.28);x.lineTo(a+u*.1,b);x.closePath();x.fill();x.stroke()}}
  /* edges: inked line, hatching into the rock, stalactites hanging from the roof edge */
  const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))continue;
    for(let d=0;d<4;d++){const nx=cx+dirs[d][0],ny=cy+dirs[d][1];if(!wall(nx,ny))continue;const sd=cx*17+cy*5+d;
      let x0,y0,x1,y1,hx,hy;
      if(d===0){x0=X(cx);y0=Y(cy);x1=X(cx+1);y1=y0;hx=0;hy=-1}else if(d===2){x0=X(cx);y0=Y(cy+1);x1=X(cx+1);y1=y0;hx=0;hy=1}else if(d===1){x0=X(cx+1);y0=Y(cy);x1=x0;y1=Y(cy+1);hx=1;hy=0}else{x0=X(cx);y0=Y(cy);x1=x0;y1=Y(cy+1);hx=-1;hy=0}
      x.strokeStyle='rgba(30,18,8,.35)';x.lineWidth=2.6;mpGwoodLine(x,x0,y0,x1,y1,sd,.5);
      x.strokeStyle=MPL.INK;x.lineWidth=1.1;mpGwoodLine(x,x0,y0,x1,y1,sd+3,.7);
      x.strokeStyle='rgba(42,26,12,.7)';x.lineWidth=.55;const n=Math.max(3,Math.round(u/1.8));
      for(let i=0;i<n;i++){const t=(i+.3+hash2(sd,i,4)*.4)/n,px=x0+(x1-x0)*t,py=y0+(y1-y0)*t,l=u*(.25+hash2(sd,i,5)*.5);x.beginPath();x.moveTo(px,py);x.lineTo(px+hx*l+.4*(d%2?0:1),py+hy*l+.4*(d%2?1:0));x.stroke()}
      if(d===0){x.fillStyle='#d2c6aa';x.strokeStyle=MPL.INK;x.lineWidth=.5;const m=Math.max(2,Math.round(u/4.2));for(let i=0;i<m;i++){const t=(i+.5+(hash2(sd,i,6)-.5)*.5)/m,px=x0+(x1-x0)*t,h=u*(.22+hash2(sd,i,7)*.4),w=u*(.07+hash2(sd,i,8)*.06);x.beginPath();x.moveTo(px-w,y0+.5);x.lineTo(px,y0+h);x.lineTo(px+w,y0+.5);x.closePath();x.fill();x.stroke()}}}}
  x.restore();
  x.strokeStyle=MPL.INK;x.lineWidth=.8;x.strokeRect(A.x,A.y,A.w,A.h);x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.strokeRect(A.x+1.6,A.y+1.6,A.w-3.2,A.h-3.2);
  /* doors and the way out */
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){const c=L.rows[cy][cx];if(c==='D'||c==='L'){const a=X(cx),b=Y(cy);x.fillStyle=c==='L'?'#6a6a72':'#8a5a2c';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(a+u*.1,b+u*.1,u*.8,u*.8);x.strokeRect(a+u*.1,b+u*.1,u*.8,u*.8);x.lineWidth=.5;x.beginPath();for(let k=1;k<4;k++){x.moveTo(a+u*(.1+.2*k),b+u*.1);x.lineTo(a+u*(.1+.2*k),b+u*.9)}x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a+u*.5,b+u*.5,u*.07,0,6.3);x.fill()}
    else if(c==='0'){const a=X(cx),b=Y(cy);x.fillStyle='rgba(255,230,140,.7)';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.arc(a+u*.5,b+u*.5,u*.46,0,6.3);x.fill();x.stroke();MPLI.star(x,a+u*.5,b+u*.5,u*.09,MPL.GOLD)}}
  /* what lies in the rooms */
  for(const d of L.decor||[]){const a=X(d.x+.5),b=Y(d.y+.5),k=u/9;
    if(d.k==='coffin')mpGwoodCoffin(x,a,b,k*1.05);else if(d.k==='barrel')mpGwoodBarrel(x,a,b,k*1.1);else if(d.k==='crate')mpGwoodCrate(x,a,b,k*1.1);else if(d.k==='chest')mpGwoodChest(x,a,b,k*1.2);else if(d.k==='bones')mpGwoodBones(x,a,b,k*1.1)}
  x.restore();
  const T=(t,cx,cy,sz,col)=>mplText(x,t,X(cx),Y(cy),sz||6.8,col||MPL.INK);
  if(LEVEL===8){
    T('The Great Cavern',16,5,8,MPL.INK);T("Gandrick's Chamber",28.5,3.2,6.6,MPL.VERM);MPLI.skull(x,X(29),Y(5.4),u*.1);
    T('Coffin Hall',16.5,19.2,7.2);T('The Dead Passage',16.8,10.5,5.6);T('Entry Cave',4,16.4,6.8);T('Way out to the wood',4.6,19.7,5.2,MPL.VERD);
    T('Wooden door',9.5,17.3,5);T('Iron gate',24,6.6,5)}
  else{
    T('Bandit Room',3.5,2.5,u*.34);T('Treasure Room',10.5,2.5,u*.3,MPL.VERM);T('The Way In',3.5,6.5,u*.3,MPL.VERD);T('Way out to the wood',3.5,8.55,u*.26,MPL.VERD)}
}
/* margins: title, key, notes, compass */
function mpGwoodMargins(x,L,api,sub,notesL,notesR,keyRows){
  api.title(x,L===LEVELS[8]?"Gandrick's Cave":"Gandrick's Wood",sub);
  api.compass(x,434,60,13);
  api.panel(x,6,52,80,12+keyRows.length*12);
  mplText(x,'Key',46,59,7,MPL.VERM);
  keyRows.forEach(([fn,t],i)=>{const b=74+i*12;fn(x,16,b);mplText(x,t,27,b-1,6.2,MPL.INK,'left')});
  api.notes(x,notesL,11,62+keyRows.length*12+14,70,6.2,4);
  api.notes(x,notesR,396,90,72,6.2,4)}
function mpGwoodDrawAny(c,x,L,api){
  if(LEVEL===7){
    mpGwoodDrawWood(x,L,api);
    mpGwoodMargins(x,L,api,'A bandit forest',
      ['Gandrick’s bandits camp in the middle of the wood. Wolves and skeletons roam the trees as well.','Keep to the dirt trails when you can.'],
      ['The cave in the north is Gandrick’s hideout.','The south trail leads back to Thornwick. The west trail leads on to Ironhill.','A small rock hideout stands in the north east.'],
      [[(x,a,b)=>mpGwoodOak(x,a,b+3,2.6,1,false),'Oak trees'],[(x,a,b)=>{x.strokeStyle='#8a6a3c';x.lineWidth=3;x.beginPath();x.moveTo(a-6,b);x.lineTo(a+6,b);x.stroke();x.strokeStyle='#cfae72';x.lineWidth=1.6;x.beginPath();x.moveTo(a-6,b);x.lineTo(a+6,b);x.stroke()},'Dirt trail'],[(x,a,b)=>mpGwoodTent(x,a,b+3,.6,MPL.VERM),'Bandit tents'],[(x,a,b)=>mpGwoodFire(x,a,b+2,.6),'Campfire'],[(x,a,b)=>mpGwoodCaveMouth(x,a,b+3,.5),'Cave mouth']])}
  else if(LEVEL===8){
    mpGwoodDrawCave(x,L,api);
    mpGwoodMargins(x,L,api,'The bandit cave',
      ['Gandrick lives in the east chamber, behind an iron gate.','Skeletons wake in the coffin hall.'],
      ['The cave opens to the wood in the west, through a stone entry cave.','Hanging teeth on the roof are stalactites.'],
      [[(x,a,b)=>{x.fillStyle='#dccd9e';x.fillRect(a-6,b-3,12,6);x.strokeStyle=MPL.INK;x.lineWidth=.6;x.strokeRect(a-6,b-3,12,6)},'Cave floor'],[(x,a,b)=>{x.fillStyle='#d2c6aa';x.strokeStyle=MPL.INK;x.lineWidth=.5;for(let i=-1;i<2;i++){x.beginPath();x.moveTo(a+i*4-1.6,b-4);x.lineTo(a+i*4,b+3);x.lineTo(a+i*4+1.6,b-4);x.closePath();x.fill();x.stroke()}},'Stalactites'],[(x,a,b)=>mpGwoodCoffin(x,a,b,.7),'Coffins'],[(x,a,b)=>{x.fillStyle='#8a5a2c';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-4,b-3,8,6);x.strokeRect(a-4,b-3,8,6)},'Wooden door']])}
  else{
    mpGwoodDrawAny.hall(c,x,L,api)}}
mpGwoodDrawAny.hall=function(c,x,L,api){
  mpGwoodDrawCave(x,L,api);
  api.title(x,"Gandrick's Hideout",'A bandit den');api.compass(x,434,60,13);
  api.panel(x,6,52,80,36);mplText(x,'Key',46,59,7,MPL.VERM);mpGwoodChest(x,16,74,.8);mplText(x,'Chest',27,73,6.2,MPL.INK,'left');
  api.notes(x,['A small den hidden in the north east of the wood.','Bandits and an archer guard the hall.'],11,100,70,6.2,4);
  api.notes(x,['The only way out is the way you came in, to the south west.'],396,90,72,6.2,4)};
mplInstall({name:'gwood',levels:[7,25,8],draw:mpGwoodDrawAny,foot:'You are the yellow arrow. Dirt trails are pale brown.'});
