/* ==========================================================================
   MAPS THAT HELP YOU PLAY. Drawn live over the painted area maps (see mplPaint in maps_common.js, which calls mpplDraw and mpplButtons):
   - a banner with the level range of the creatures in the area ("Creatures: level 66 to 70")
   - danger zones: soft red patches with a level range, only where the party has already explored (a skull where a boss lives)
   - quest rings (the same ones the plain map shows) and, for the quest picked in the quest log, a dotted trail from the party to its place
   - hand-placed pins: tap Pin, then tap the map to drop a pin (tap a pin to take it away); the kind button changes what the next pin is
   Pins are kept in G.flags.mapPins, one list per level. Names start mppl.
   ========================================================================== */
const MPPL={pin:false,kind:0,down:null,trail:null,names:['Flag','Skull','Chest','Camp','Star','Mark']};
const mpplOff=()=>!!(G.flags&&G.flags.mpZoneOff);
function mpplPins(){const F=G.flags;if(!F)return [];F.mapPins=F.mapPins||{};return F.mapPins[LEVEL]=F.mapPins[LEVEL]||[]}
/* where the map shows a cell on the screen */
function mpplGeo(){const V=MPL.view;if(!V||!V.X||V.lv!==LEVEL)return null;const A=V.area,s0=V.X(0),s1=V.X(1);if(s0<-5000)return null;const cs=(s1-s0)*V.z;return {A,V,cs,ox:A.x+(s0-V.sx0)*V.z,oy:A.y+(V.Y(0)-V.sy0)*V.z}}
function mpplHalo(t,x,y,sz,col){ctx.font=`italic bold ${sz}px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=3;ctx.lineJoin='round';ctx.strokeStyle='rgba(236,222,176,.94)';ctx.strokeText(t,x,y);ctx.fillStyle=col;ctx.fillText(t,x,y)}
/* ---- the level banner ---- */
function mpplLevels(){const L=G.enemies||[];let lo=1e9,hi=0;for(const e of L){if(e.lvl>0){lo=Math.min(lo,e.lvl);hi=Math.max(hi,e.lvl)}}return hi?[lo,hi]:null}
function mpplBanner(A){
  const r=mpplLevels();if(!r)return;const t=r[0]===r[1]?'Creatures: level '+r[0]:'Creatures: level '+r[0]+' to '+r[1];
  ctx.save();ctx.font=`bold 8px ${FUI}`;const w=ctx.measureText(t).width+22,h=12,x=(LEVEL>=400&&LEVEL<=423)?A.x+10:A.x+A.w/2-w/2,y=A.y+3; // on the Pilgrim's Path the middle of the top edge is taken by the name of the mountains;
  ctx.fillStyle='#8a2a1c';ctx.strokeStyle='#2a1a0c';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-6,y+1);ctx.lineTo(x+4,y+1);ctx.lineTo(x+4,y);ctx.lineTo(x+w-4,y);ctx.lineTo(x+w-4,y+1);ctx.lineTo(x+w+6,y+1);ctx.lineTo(x+w+1,y+h/2+.5);ctx.lineTo(x+w+6,y+h);ctx.lineTo(x+w-4,y+h);ctx.lineTo(x+4,y+h);ctx.lineTo(x-6,y+h);ctx.lineTo(x-1,y+h/2+.5);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='#c9a227';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(x+3,y+2);ctx.lineTo(x+w-3,y+2);ctx.moveTo(x+3,y+h-2);ctx.lineTo(x+w-3,y+h-2);ctx.stroke();
  ctx.fillStyle='#f4e8c0';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,x+w/2,y+h/2+.6);ctx.restore()}
/* ---- danger zones ---- */
function mpplKnown(x,y,W,fog){if(fog&&fog[y*W+x])return true;const s=G.seen&&G.seen[y];return !!(s&&s[x])}
function mpplZones(g){
  if(mpplOff())return;const en=(G.enemies||[]).filter(e=>e.hp>0&&!e.dying);if(!en.length)return;
  const L=LEVELS[LEVEL],W=L.rows[0].length,H=L.rows.length,B=Math.max(9,Math.round(Math.max(W,H)/14)),fog=(typeof mplFogArr==='function'&&typeof mplFogOn==='function'&&mplFogOn(L))?mplFogArr():null,bl={};
  for(const e of en){const k=((e.x/B)|0)+','+((e.y/B)|0);const z=bl[k]||(bl[k]={n:0,sx:0,sy:0,lo:1e9,hi:0,boss:false});z.n++;z.sx+=e.x;z.sy+=e.y;z.lo=Math.min(z.lo,e.lvl||1);z.hi=Math.max(z.hi,e.lvl||1);if(typeof NO_VARY!=='undefined'&&NO_VARY.includes(e.t))z.boss=true}
  const {A,cs,ox,oy,V}=g,pul=.8+.2*Math.sin(G.time*2);
  ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();
  for(const k in bl){const z=bl[k],cx=z.sx/z.n,cy=z.sy/z.n;
    // shown only once the party has explored near it
    let seen=false;for(let dy=-3;dy<=3&&!seen;dy+=3)for(let dx=-3;dx<=3;dx+=3){const xx=Math.round(cx)+dx,yy=Math.round(cy)+dy;if(xx>=0&&yy>=0&&xx<W&&yy<H&&mpplKnown(xx,yy,W,fog)){seen=true;break}}
    if(!seen)continue;
    const sx=ox+(cx+.5)*cs,sy=oy+(cy+.5)*cs,r=Math.max(10,Math.min(B*cs*.55,60));if(sx<A.x-r||sx>A.x+A.w+r||sy<A.y-r||sy>A.y+A.h+r)continue;
    const gr=ctx.createRadialGradient(sx,sy,r*.15,sx,sy,r);gr.addColorStop(0,`rgba(176,40,24,${.3*pul})`);gr.addColorStop(.7,`rgba(176,40,24,${.16*pul})`);gr.addColorStop(1,'rgba(176,40,24,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(sx,sy,r,0,TAU);ctx.fill();
    ctx.strokeStyle='rgba(120,24,14,.5)';ctx.lineWidth=.8;ctx.setLineDash([3,2.4]);ctx.beginPath();for(let i=0;i<=28;i++){const an=i/28*TAU,rr=r*(.8+.07*Math.sin(i*2.1+cx));i?ctx.lineTo(sx+Math.cos(an)*rr,sy+Math.sin(an)*rr):ctx.moveTo(sx+Math.cos(an)*rr,sy+Math.sin(an)*rr)}ctx.stroke();ctx.setLineDash([]);
    if(z.boss){ctx.fillStyle='#f4e8c0';ctx.strokeStyle='#2a1a0c';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(sx,sy-3,4.6,0,TAU);ctx.fill();ctx.stroke();ctx.fillRect(sx-2.4,sy+.6,4.8,2.6);ctx.strokeRect(sx-2.4,sy+.6,4.8,2.6);ctx.fillStyle='#2a1a0c';ctx.beginPath();ctx.arc(sx-1.8,sy-3.2,1.1,0,TAU);ctx.arc(sx+1.8,sy-3.2,1.1,0,TAU);ctx.fill()}
    if(V.z>=1.5||z.n>=3||z.boss){const t=z.lo===z.hi?'Lv '+z.hi:'Lv '+z.lo+'-'+z.hi;mpplHalo(t,sx,sy+(z.boss?9:0),Math.max(6.5,Math.min(9,cs*.8)),'#8a1c10')}}
  ctx.restore()}
/* ---- the trail to the quest picked in the quest log ---- */
function mpplTrail(g){
  const F=G.qFocus;if(!F||F.lvl!==LEVEL||typeof questSpots!=='function')return;
  let sp=null;try{sp=questSpots().find(s=>s.q===F.id)}catch(e){}if(!sp)return;
  const L=LEVELS[LEVEL],W=L.rows[0].length,H=L.rows.length,sx=G.C.x|0,sy=G.C.y|0,key=LEVEL+'|'+sx+','+sy+'|'+sp.x+','+sp.y;
  if(!MPPL.trail||MPPL.trail.key!==key){
    const dist=new Int32Array(W*H).fill(-1),from=new Int32Array(W*H),q=new Int32Array(W*H);let qh=0,qt=0,end=-1;
    const ok=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&(L.rows[y][x]==='.'||(x===sp.x&&y===sp.y)||(x===sx&&y===sy));
    q[qt++]=sy*W+sx;dist[sy*W+sx]=0;
    while(qh<qt){const c=q[qh++],x=c%W,y=(c/W)|0;if(Math.abs(x-sp.x)<=1&&Math.abs(y-sp.y)<=1){end=c;break}
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(!ok(nx,ny)||dist[ny*W+nx]>=0)continue;dist[ny*W+nx]=dist[c]+1;from[ny*W+nx]=c;q[qt++]=ny*W+nx}}
    let pts=null;if(end>=0){pts=[];for(let c=end;;c=from[c]){pts.push([c%W,(c/W)|0]);if(c===sy*W+sx)break}pts.reverse()}
    MPPL.trail={key,pts}}
  const pts=MPPL.trail.pts,{A,cs,ox,oy}=g;
  ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();ctx.lineJoin='round';ctx.lineCap='round';
  const P=pts||[[sx,sy],[sp.x,sp.y]];
  for(const [w,col,dash] of [[3.6,'rgba(244,232,190,.85)',[]],[1.7,'#7a1a10',[3.2,3]]]){ctx.lineWidth=w;ctx.strokeStyle=col;ctx.setLineDash(dash);ctx.lineDashOffset=-(G.time||0)*7;ctx.beginPath();P.forEach((p,i)=>{const x=ox+(p[0]+.5)*cs,y=oy+(p[1]+.5)*cs;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()}
  ctx.setLineDash([]);ctx.restore()}
/* ---- pins ---- */
function mpplPinIcon(k,x,y,s){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.lineJoin='round';ctx.strokeStyle='#2a1a0c';ctx.lineWidth=.9;
  ctx.fillStyle='#f4e8c0';ctx.beginPath();ctx.arc(0,-9,6.2,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-3,-4.4);ctx.lineTo(0,0);ctx.lineTo(3,-4.4);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(0,-9,5.2,0,TAU);ctx.fillStyle='#f4e8c0';ctx.fill();
  ctx.lineWidth=.8;
  if(k==='Flag'){ctx.beginPath();ctx.moveTo(-1.6,-13);ctx.lineTo(-1.6,-5.4);ctx.stroke();ctx.fillStyle='#b8321e';ctx.beginPath();ctx.moveTo(-1.6,-13);ctx.lineTo(3.6,-11);ctx.lineTo(-1.6,-9);ctx.closePath();ctx.fill();ctx.stroke()}
  else if(k==='Skull'){ctx.fillStyle='#e8dcc0';ctx.beginPath();ctx.arc(0,-9.6,3.2,0,TAU);ctx.fill();ctx.stroke();ctx.fillRect(-1.6,-7,3.2,1.8);ctx.strokeRect(-1.6,-7,3.2,1.8);ctx.fillStyle='#2a1a0c';ctx.beginPath();ctx.arc(-1.2,-9.8,.8,0,TAU);ctx.arc(1.2,-9.8,.8,0,TAU);ctx.fill()}
  else if(k==='Chest'){ctx.fillStyle='#9a6a2e';ctx.fillRect(-3.4,-11,6.8,5);ctx.strokeRect(-3.4,-11,6.8,5);ctx.fillStyle='#c9a227';ctx.fillRect(-3.4,-9,6.8,.9);ctx.fillRect(-.7,-9.6,1.4,2.2)}
  else if(k==='Camp'){ctx.fillStyle='#b8321e';ctx.beginPath();ctx.moveTo(-4,-6);ctx.lineTo(0,-12.4);ctx.lineTo(4,-6);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#2a1a0c';ctx.beginPath();ctx.moveTo(-1,-6);ctx.lineTo(0,-9);ctx.lineTo(1,-6);ctx.closePath();ctx.fill()}
  else if(k==='Star'){ctx.fillStyle='#c9a227';ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?1.9:4.4;ctx.lineTo(Math.cos(a)*r,-9+Math.sin(a)*r)}ctx.closePath();ctx.fill();ctx.stroke()}
  else{ctx.fillStyle='#274a9a';ctx.font=`bold 9px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('?',0,-8.6)}
  ctx.restore()}
function mpplPinsDraw(g){const {A,cs,ox,oy}=g,pins=(G.flags&&G.flags.mapPins&&G.flags.mapPins[LEVEL])||[];if(!pins.length)return;
  ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();for(const p of pins){const x=ox+(p.x+.5)*cs,y=oy+(p.y+.5)*cs;if(x<A.x-10||x>A.x+A.w+10||y<A.y||y>A.y+A.h+14)continue;mpplPinIcon(p.k,x,y,.95)}ctx.restore()}
/* ---- the live layer, called by mplPaint before the party's arrow ---- */
function mpplDraw(){
  const V=MPL.view;if(!V||!G.overview||G.world)return;
  mpplBanner(V.area);
  const g=mpplGeo();if(!g)return;
  mpplZones(g);
  if(LEVEL!==44&&typeof drawQuestRings==='function'){ctx.save();ctx.beginPath();ctx.rect(g.A.x,g.A.y,g.A.w,g.A.h);ctx.clip();try{drawQuestRings(g.ox,g.oy,Math.max(g.cs,.9))}catch(e){console.error(e)}ctx.restore()}
  if(typeof wdDrawMarks==='function'){ctx.save();ctx.beginPath();ctx.rect(g.A.x,g.A.y,g.A.w,g.A.h);ctx.clip();wdDrawMarks(g.ox,g.oy,Math.max(g.cs,1.4),true);ctx.restore()} // the ? of hidden caves and ruins the party has spotted
  mpplTrail(g);mpplPinsDraw(g);
  if(MPPL.pin){mpplHalo('Tap the map to drop a pin. Tap a pin to take it away.',g.A.x+g.A.w/2,g.A.y+g.A.h-8,7,'#5a1a10')}}
function mpplButtons(){
  if(!mpplGeo())return;
  btnText('mppin',MPPL.pin?'Pin*':'Pin',122,303,30,17);btnText('mpzone',mpplOff()?'Zones off':'Zones',154,303,mpplOff()?46:36,17);
  if(MPPL.pin)btnText('mppinkind',MPPL.names[MPPL.kind],(mpplOff()?202:192),303,40,17)}
{const _h=handleBtn;handleBtn=function(id){
  if(id==='mppin'){MPPL.pin=!MPPL.pin;return}
  if(id==='mppinkind'){MPPL.kind=(MPPL.kind+1)%MPPL.names.length;return}
  if(id==='mpzone'){G.flags.mpZoneOff=mpplOff()?0:1;return}
  return _h.apply(this,arguments)}}
/* a tap on the map in pin mode drops or removes a pin */
cv.addEventListener('pointerdown',e=>{if(MPPL.pin&&G.overview&&!G.world){const [x,y]=toDesign(e);MPPL.down=[x,y]}else MPPL.down=null});
addEventListener('pointerup',e=>{
  const d=MPPL.down;MPPL.down=null;if(!d||!MPPL.pin||!G.overview||G.world)return;
  const [x,y]=toDesign(e);if(Math.hypot(x-d[0],y-d[1])>6)return;
  const g=mpplGeo();if(!g)return;const A=g.A;if(x<A.x||x>A.x+A.w||y<A.y||y>A.y+A.h)return;
  const cx=Math.floor((x-g.ox)/g.cs),cy=Math.floor((y-g.oy)/g.cs),pins=mpplPins();
  let hit=-1;for(let i=0;i<pins.length;i++){const px=g.ox+(pins[i].x+.5)*g.cs,py=g.oy+(pins[i].y+.5)*g.cs;if(Math.abs(x-px)<8&&y>py-16&&y<py+4){hit=i;break}}
  if(hit>=0){pins.splice(hit,1);return}
  const L=LEVELS[LEVEL];if(!L||cx<0||cy<0||cx>=L.rows[0].length||cy>=L.rows.length)return;
  if(pins.length>=40){msg('That map has 40 pins already.','#d09a80');return}
  pins.push({x:cx,y:cy,k:MPPL.names[MPPL.kind]})});
