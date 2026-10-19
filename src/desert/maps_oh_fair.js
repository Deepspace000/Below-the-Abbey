/* Oldhaven map section fair (order 13): the east road with its gate, the houses along it and the Fair Green with its tents, stalls, jousting field,
   bandstand and rides. Cells x 100..150, y 60..100 of level 305. All names start with mpOhFair. Everything is read from the real level data
   (rows, fmap, decor); the tents, lists, bandstand and rides are the map's own dressing of the open green. */
const mpOhFairRoofs=[['#b5532f','#8f3f24'],['#6f7a8a','#505a68'],['#c9a85a','#a1843c'],['#3a5aa8','#274a86'],['#c4806a','#9c5e4a'],['#5a8a78','#3e6a58'],['#a8452a','#7e301c'],['#8a7a62','#6a5a46']];
function mpOhFairRect(x,a,b,w,h,seed){ /* a slightly wobbly filled rectangle path */
  const j=k=>(hash2(a*7+k,b*5+seed,31)-.5)*.5;
  x.beginPath();x.moveTo(a+j(1),b+j(2));x.lineTo(a+w+j(3),b+j(4));x.lineTo(a+w+j(5),b+h+j(6));x.lineTo(a+j(7),b+h+j(8));x.closePath()}
MPOH.push({order:13,name:'fair',paint(x,L,api,fit){
  const X=fit.X,Y=fit.Y,s=fit.s,INK=MPL.INK,rows=L.rows,fm=L.fmap,W=rows[0].length,H=rows.length;
  const open=(cx,cy)=>cx>=0&&cy>=0&&cx<W&&cy<H&&rows[cy][cx]==='.';
  const BX0=100,BX1=151,BY0=60,BY1=102;
  x.beginPath();x.rect(X(BX0),Y(BY0),X(BX1)-X(BX0),Y(BY1)-Y(BY0));x.clip();
  /* ---- the ground: street cobble, dirt of the east road, lawn of the green, wash by wash ---- */
  const GR={'0':['#d9cfb4',.55],'1':['#d8c8a0',.6],'2':['#a9b878',.55],'3':['#c2bd98',.5],'4':['#c9a468',.8],'5':['#b4c27c',.6]};
  for(let cy=BY0-1;cy<=BY1;cy++)for(let cx=BX0-1;cx<=143;cx++){
    if(!open(cx,cy))continue;const t=fm[cy][cx],g=GR[t]||GR['0'];
    x.globalAlpha=g[1]*(.8+.3*hash2(cx,cy,5));x.fillStyle=g[0];x.fillRect(X(cx)-.12,Y(cy)-.12,s+.24,s+.24)}
  x.globalAlpha=1;
  /* the fair green gets a deeper wash with a soft ink edge, so it reads as one field */
  const G0=102,G1=130,GY0=75,GY1=103;
  x.save();x.globalAlpha=.32;x.fillStyle='#8aa05a';mpOhFairRect(x,X(G0),Y(GY0),X(G1)-X(G0),Y(GY1)-Y(GY0),1);x.fill();x.restore();
  x.strokeStyle='rgba(60,70,30,.55)';x.lineWidth=.6;mpOhFairRect(x,X(G0),Y(GY0),X(G1)-X(G0),Y(GY1)-Y(GY0),2);x.stroke();
  /* grass tufts, meadow flowers, cobble flecks and ruts on the road */
  for(let cy=BY0;cy<=BY1;cy++)for(let cx=BX0;cx<=143;cx++){
    if(!open(cx,cy))continue;const t=fm[cy][cx],r=hash2(cx,cy,9),px=X(cx)+hash2(cx,cy,10)*s,py=Y(cy)+hash2(cx,cy,11)*s;
    if(t==='2'||t==='5'||t==='3'){if(r<.5){x.strokeStyle='rgba(50,80,30,.6)';x.lineWidth=.35;x.beginPath();x.moveTo(px,py);x.lineTo(px-.5,py-1.1);x.moveTo(px,py);x.lineTo(px+.5,py-1.2);x.moveTo(px,py);x.lineTo(px,py-1.4);x.stroke()}
      if(t==='5'&&r>.62){x.fillStyle=['#f0e080','#e8a0b0','#f4f0e0','#c88ad0'][(r*40|0)%4];x.beginPath();x.arc(px,py,.45,0,6.3);x.fill()}}
    else if(t==='0'&&r<.22){x.fillStyle='rgba(110,95,70,.45)';x.beginPath();x.arc(px,py,.4,0,6.3);x.fill()}
    else if(t==='4'){if(r<.3){x.fillStyle='rgba(120,80,30,.5)';x.fillRect(px,py,1.1,.4)}if(r>.9){x.fillStyle='rgba(90,60,30,.5)';x.beginPath();x.arc(px,py,.4,0,6.3);x.fill()}}}
  /* ruts down the middle of the east road */
  x.strokeStyle='rgba(110,70,30,.5)';x.lineWidth=.45;for(const yy of [73.35,74.65]){x.beginPath();for(let cx=130;cx<=143.5;cx+=.5){const yv=Y(yy)+Math.sin(cx*2.1)*.35;cx===130?x.moveTo(X(cx),yv):x.lineTo(X(cx),yv)}x.stroke()}

  /* ---- the houses: found in the wall cells of the level, grouped by the style of their walls ---- */
  const code=(cx,cy)=>rows[cy].charCodeAt(cx);
  const cnt={};for(let cy=BY0;cy<=BY1;cy++)for(let cx=BX0;cx<=143;cx++)if(!open(cx,cy))cnt[code(cx,cy)]=(cnt[code(cx,cy)]||0)+1;
  const codes=Object.keys(cnt).map(Number).sort((a,b)=>a-b),clus={};let cid=0,prev=-9;
  for(const c of codes){if(c-prev>1)cid++;clus[c]=cid;prev=c}
  const csz={};for(const c of codes)csz[clus[c]]=(csz[clus[c]]||0)+cnt[c];
  const grp=new Map(),cells=[]; // key "x,y" -> group id
  const isMain=(cx,cy)=>cx>=BX0&&cx<=143&&cy>=BY0&&cy<=BY1&&!open(cx,cy)&&csz[clus[code(cx,cy)]]>=12;
  const groups=[];
  for(let cy=BY0;cy<=BY1;cy++)for(let cx=BX0;cx<=143;cx++){
    if(!isMain(cx,cy)||grp.has(cx+','+cy))continue;const id=groups.length,cl=clus[code(cx,cy)],gl={cl,cells:[]};groups.push(gl);const st=[[cx,cy]];grp.set(cx+','+cy,id);
    while(st.length){const [a,b]=st.pop();gl.cells.push([a,b]);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=a+dx,ny=b+dy,k=nx+','+ny;if(isMain(nx,ny)&&!grp.has(k)&&clus[code(nx,ny)]===cl){grp.set(k,id);st.push([nx,ny])}}}}
  const doors=[];
  for(let cy=BY0;cy<=BY1;cy++)for(let cx=BX0;cx<=143;cx++){ // door and window cells join the house beside them
    if(open(cx,cy)||isMain(cx,cy))continue;let best=-1;
    for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]]){const k=(cx+dx)+','+(cy+dy);if(grp.has(k)){best=grp.get(k);break}}
    if(best>=0){groups[best].cells.push([cx,cy]);grp.set(cx+','+cy,best);doors.push([cx,cy,best])}}
  const pieces=[];
  for(const g of groups){
    const byRow={};for(const [a,b] of g.cells)(byRow[b]||(byRow[b]=[])).push(a);
    const ys=Object.keys(byRow).map(Number).sort((a,b)=>a-b);let cur=null;
    for(const yy of ys){const xs=byRow[yy],lo=Math.min(...xs),hi=Math.max(...xs);
      if(cur&&cur.lo===lo&&cur.hi===hi&&cur.y1===yy-1)cur.y1=yy;else{if(cur)pieces.push(cur);cur={lo,hi,y0:yy,y1:yy,cl:g.cl}}}
    if(cur)pieces.push(cur)}
  const houses=[];
  for(const p of pieces){const w=p.hi-p.lo+1,h=p.y1-p.y0+1,nx=w>9?Math.round(w/4.5):1,ny=h>5?Math.round(h/3.6):1;
    for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const x0=p.lo+Math.round(i*w/nx),x1=p.lo+Math.round((i+1)*w/nx),y0=p.y0+Math.round(j*h/ny),y1=p.y0+Math.round((j+1)*h/ny);
      if(x1>x0&&y1>y0)houses.push({x0,x1,y0,y1,cl:p.cl})}}
  /* shadows first, then roofs */
  x.save();x.fillStyle='rgba(70,45,20,.28)';for(const hs of houses){mpOhFairRect(x,X(hs.x0)+.9,Y(hs.y0)+.9,(hs.x1-hs.x0)*s,(hs.y1-hs.y0)*s,3);x.fill()}x.restore();
  for(const hs of houses){
    const pal=mpOhFairRoofs[(hs.cl*5+(hs.x0*3+hs.y0)%3)%mpOhFairRoofs.length],a=X(hs.x0)+.15,b=Y(hs.y0)+.15,w=(hs.x1-hs.x0)*s-.3,h=(hs.y1-hs.y0)*s-.3,horiz=w>=h;
    x.lineJoin='round';
    // two roof slopes, one lit and one in shade, with the ridge between and tile hatching
    x.fillStyle=pal[0];mpOhFairRect(x,a,b,w,h,4);x.fill();
    x.fillStyle=pal[1];if(horiz)mpOhFairRect(x,a,b+h/2,w,h/2,5);else mpOhFairRect(x,a+w/2,b,w/2,h,5);x.fill();
    x.strokeStyle='rgba(30,16,6,.35)';x.lineWidth=.3;
    if(horiz){for(let yy=b+.9;yy<b+h-.3;yy+=.95){x.beginPath();x.moveTo(a+.2,yy);x.lineTo(a+w-.2,yy);x.stroke()}}
    else{for(let xx=a+.9;xx<a+w-.3;xx+=.95){x.beginPath();x.moveTo(xx,b+.2);x.lineTo(xx,b+h-.2);x.stroke()}}
    x.strokeStyle=INK;x.lineWidth=.55;mpOhFairRect(x,a,b,w,h,4);x.stroke();
    x.lineWidth=.6;x.strokeStyle='#f4e8c8';x.beginPath();if(horiz){x.moveTo(a+.4,b+h/2);x.lineTo(a+w-.4,b+h/2)}else{x.moveTo(a+w/2,b+.4);x.lineTo(a+w/2,b+h-.4)}x.stroke();
    if(w*h>14&&hash2(hs.x0,hs.y0,12)<.7){x.fillStyle='#6a5a4a';x.strokeStyle=INK;x.lineWidth=.35;const cx2=a+w*(.25+.5*hash2(hs.x0,hs.y0,13)),cy2=b+h*.3;x.fillRect(cx2-.7,cy2-.7,1.4,1.4);x.strokeRect(cx2-.7,cy2-.7,1.4,1.4)}}
  /* doors: a small brown door mark on the street side of each house, found from the door cells */
  x.save();for(const [cx,cy] of doors){if(hash2(cx,cy,14)<.35)continue;x.fillStyle='#4a2a14';x.fillRect(X(cx)+s*.15,Y(cy)+s*.1,s*.7,s*.8);x.fillStyle=MPL.GOLD;x.fillRect(X(cx)+s*.6,Y(cy)+s*.5,.5,.5)}x.restore();

  /* ---- gardens, planters and the little orchard yards between the houses ---- */
  for(const d of L.decor){if(d.x<BX0||d.x>BX1||d.y<BY0||d.y>BY1)continue;const k=d.k,a=X(d.x+.5),b=Y(d.y+.5);
    if(/ohgard/.test(k)){x.fillStyle='rgba(120,150,70,.7)';x.strokeStyle='rgba(50,70,25,.7)';x.lineWidth=.4;x.beginPath();x.ellipse(a,b,s*.8,s*.55,0,0,6.3);x.fill();x.stroke();
      for(let i=0;i<5;i++){x.fillStyle=['#e8a0b0','#f0d860','#e86a50','#c88ad0','#f4f0e0'][(i+d.x)%5];x.beginPath();x.arc(a+(hash2(d.x,d.y,20+i)-.5)*s*1.2,b+(hash2(d.x,d.y,30+i)-.5)*s*.8,.5,0,6.3);x.fill()}}}

  /* ---- the jousting field (the lists): a sand strip between two timber rails, a tilt barrier down the middle, a stand and a pavilion at each end ---- */
  {const lx0=107,lx1=124,ly0=96.9,ly1=100.6,a=X(lx0),b=Y(ly0),w=(lx1-lx0)*s,h=(ly1-ly0)*s;
   x.fillStyle='#dcc08a';mpOhFairRect(x,a,b,w,h,6);x.fill();
   x.save();x.beginPath();x.rect(a,b,w,h);x.clip();x.strokeStyle='rgba(120,90,40,.4)';x.lineWidth=.3;for(let i=0;i<46;i++){const px=a+hash2(i,1,33)*w,py=b+hash2(i,2,33)*h;x.beginPath();x.moveTo(px,py);x.lineTo(px+1.4,py+.1);x.stroke()}x.restore();
   x.strokeStyle='#5a3a1c';x.lineWidth=.9;x.beginPath();x.moveTo(a,b);x.lineTo(a+w,b);x.moveTo(a,b+h);x.lineTo(a+w,b+h);x.stroke();
   x.fillStyle='#3a2210';for(let i=0;i<=18;i++){const px=a+i*w/18;x.fillRect(px-.3,b-.5,.6,1);x.fillRect(px-.3,b+h-.5,.6,1)}
   // the tilt barrier, painted in bands of vermilion and cream
   const ty=b+h/2;for(let i=0;i<34;i++){x.fillStyle=i%2?'#f0e6c8':MPL.VERM;x.fillRect(a+2+i*(w-4)/34,ty-.6,(w-4)/34+.05,1.2)}
   x.strokeStyle=INK;x.lineWidth=.4;x.strokeRect(a+2,ty-.6,w-4,1.2);
   // a lance pennant and a shield at each end
   for(const [px,dir,col] of [[a+1.2,1,MPL.LAPIS],[a+w-1.2,-1,MPL.VERM]]){x.strokeStyle='#5a3a1c';x.lineWidth=.5;x.beginPath();x.moveTo(px,b+h*.2);x.lineTo(px,b-1.5);x.stroke();x.fillStyle=col;x.beginPath();x.moveTo(px,b-1.5);x.lineTo(px+dir*2.4,b-.9);x.lineTo(px,b-.3);x.closePath();x.fill();x.strokeStyle=INK;x.lineWidth=.3;x.stroke()}
   // timber stand with tiers on the south side, striped bunting along it
   const sa=X(111),sb=Y(100.9),sw=(122-111)*s;x.fillStyle='#8a6a44';x.fillRect(sa,sb,sw,2.6);x.strokeStyle=INK;x.lineWidth=.4;x.strokeRect(sa,sb,sw,2.6);
   for(let i=0;i<3;i++){x.strokeStyle='rgba(30,16,6,.5)';x.beginPath();x.moveTo(sa,sb+.87*(i+1));x.lineTo(sa+sw,sb+.87*(i+1));x.stroke()}
   for(let i=0;i<22;i++){x.fillStyle=['#274a9a','#b8321e','#e8d890','#3a7a5a'][(i*7+3)%4];x.beginPath();x.arc(sa+.6+i*(sw-1.2)/21,sb+1.1+(i%3)*.8,.55,0,6.3);x.fill()}
   // a striped pavilion for each knight
   for(const [pcx,c1] of [[106.2,MPL.LAPIS],[125.6,MPL.VERM]]){mpOhFairTent(x,X(pcx),Y(98.8),s*2.3,s*2.2,c1,'#f0e6c8',true)}}

  /* ---- big striped tents ---- */
  mpOhFairTent(x,X(104.5),Y(81.6),s*4,s*2.4,MPL.VERM,'#f0e6c8');
  mpOhFairTent(x,X(119),Y(81.7),s*4.6,s*2.2,MPL.LAPIS,'#f4e8b8');
  mpOhFairTent(x,X(118.5),Y(92.7),s*3.6,s*2.6,MPL.GOLD,'#b8321e');
  mpOhFairTent(x,X(127.4),Y(96),s*2.2,s*2,MPL.VERD,'#f0e6c8');

  /* ---- the maypole: ribbons running out to a ring ---- */
  {const mx=X(111),my=Y(82.4);x.strokeStyle='rgba(100,60,30,.5)';x.lineWidth=.4;x.beginPath();x.arc(mx,my,s*1.2,0,6.3);x.stroke();
   for(let i=0;i<8;i++){const an=i*Math.PI/4;x.strokeStyle=['#b8321e','#274a9a','#c9a227','#3a7a5a'][i%4];x.lineWidth=.45;x.beginPath();x.moveTo(mx,my);x.quadraticCurveTo(mx+Math.cos(an+.5)*s*.8,my+Math.sin(an+.5)*s*.8,mx+Math.cos(an+.9)*s*1.2,my+Math.sin(an+.9)*s*1.2);x.stroke()}
   x.fillStyle='#5a3a1c';x.beginPath();x.arc(mx,my,.8,0,6.3);x.fill();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(mx,my,.4,0,6.3);x.fill()}

  /* ---- the bandstand: eight-sided, a striped conical roof, steps and a gold finial ---- */
  {const bx=X(115.2),by=Y(85.9),r=s*1.6;x.fillStyle='rgba(70,45,20,.3)';x.beginPath();x.arc(bx+.8,by+.8,r,0,6.3);x.fill();
   x.fillStyle='#cfc2a2';x.beginPath();x.arc(bx,by,r*1.18,0,6.3);x.fill();x.strokeStyle=INK;x.lineWidth=.4;x.stroke();
   for(let i=0;i<8;i++){const a0=i*Math.PI/4-Math.PI/8,a1=a0+Math.PI/4;x.fillStyle=i%2?'#f0e6c8':MPL.LAPIS;x.beginPath();x.moveTo(bx,by);x.arc(bx,by,r,a0,a1);x.closePath();x.fill();x.strokeStyle='rgba(30,16,6,.6)';x.lineWidth=.3;x.stroke()}
   x.strokeStyle=INK;x.lineWidth=.55;x.beginPath();for(let i=0;i<8;i++){const an=i*Math.PI/4-Math.PI/8;i?x.lineTo(bx+Math.cos(an)*r,by+Math.sin(an)*r):x.moveTo(bx+Math.cos(an)*r,by+Math.sin(an)*r)}x.closePath();x.stroke();
   x.fillStyle=MPL.GOLD;x.beginPath();x.arc(bx,by,.9,0,6.3);x.fill();x.strokeStyle=INK;x.lineWidth=.3;x.stroke();
   x.strokeStyle='#5a3a1c';x.lineWidth=.5;x.beginPath();x.moveTo(bx,by);x.lineTo(bx,by-r*1.5);x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(bx,by-r*1.5);x.lineTo(bx+2.4,by-r*1.5+.7);x.lineTo(bx,by-r*1.5+1.4);x.fill()}

  /* ---- the rides: a carousel with a striped canopy, and a big wheel with its gondolas ---- */
  {const cx=X(126.4),cy=Y(82.6),r=s*2;x.fillStyle='rgba(70,45,20,.3)';x.beginPath();x.arc(cx+.8,cy+.8,r,0,6.3);x.fill();
   for(let i=0;i<12;i++){const a0=i*Math.PI/6,a1=a0+Math.PI/6;x.fillStyle=i%2?'#f4e8b8':MPL.VERM;x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,r,a0,a1);x.closePath();x.fill()}
   x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.arc(cx,cy,r,0,6.3);x.stroke();x.lineWidth=.3;x.beginPath();x.arc(cx,cy,r*.45,0,6.3);x.stroke();
   x.fillStyle=MPL.GOLD;x.beginPath();x.arc(cx,cy,r*.22,0,6.3);x.fill();x.stroke();
   for(let i=0;i<12;i++){const an=i*Math.PI/6+.26;x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(cx+Math.cos(an)*r,cy+Math.sin(an)*r,.45,0,6.3);x.fill()}}
  {const wx=X(105.5),wy=Y(92.2),r=s*2.3;x.save();x.strokeStyle='rgba(70,45,20,.35)';x.lineWidth=1.6;x.beginPath();x.arc(wx+.7,wy+.7,r,0,6.3);x.stroke();x.restore();
   x.strokeStyle='#5a3a1c';x.lineWidth=.9;x.beginPath();x.arc(wx,wy,r,0,6.3);x.stroke();x.strokeStyle=MPL.GOLD;x.lineWidth=.45;x.beginPath();x.arc(wx,wy,r,0,6.3);x.stroke();x.beginPath();x.arc(wx,wy,r*.55,0,6.3);x.stroke();
   x.strokeStyle='#5a3a1c';x.lineWidth=.4;for(let i=0;i<8;i++){const an=i*Math.PI/4;x.beginPath();x.moveTo(wx,wy);x.lineTo(wx+Math.cos(an)*r,wy+Math.sin(an)*r);x.stroke();
     x.fillStyle=[MPL.VERM,MPL.LAPIS,'#f0e6c8',MPL.VERD][i%4];x.beginPath();x.arc(wx+Math.cos(an)*r,wy+Math.sin(an)*r,.8,0,6.3);x.fill();x.lineWidth=.3;x.stroke()}
   x.fillStyle=MPL.GOLD;x.beginPath();x.arc(wx,wy,.9,0,6.3);x.fill();x.stroke()}

  /* ---- bunting between the flag poles, then the pennants ---- */
  for(const yy of [77.4,100.4]){const fl=L.decor.filter(d=>/flag/.test(d.k)&&Math.abs(d.y-(yy<80?77:100))<1).map(d=>d.x).sort((a,b)=>a-b);
    for(let i=0;i<fl.length-1;i++){const a=X(fl[i]+.5),b=X(fl[i+1]+.5),yv=Y(yy);x.strokeStyle='rgba(60,35,15,.7)';x.lineWidth=.35;x.beginPath();x.moveTo(a,yv);x.quadraticCurveTo((a+b)/2,yv+3,b,yv);x.stroke();
      for(let k=1;k<6;k++){const t=k/6,px=a+(b-a)*t,py=yv+3*2*t*(1-t)*.5*1.0+0;x.fillStyle=['#b8321e','#274a9a','#f0d878','#3a7a5a','#f4f0e0'][(i+k)%5];x.beginPath();x.moveTo(px-.7,py);x.lineTo(px+.7,py);x.lineTo(px,py+1.6);x.closePath();x.fill()}}}
  for(const d of L.decor){if(!/flag/.test(d.k)||d.x<BX0||d.x>BX1)continue;const a=X(d.x+.5),b=Y(d.y+.5),dir=(d.x/4|0)%2?1:-1;
    x.strokeStyle='#5a3a1c';x.lineWidth=.5;x.beginPath();x.moveTo(a,b+1);x.lineTo(a,b-3.4);x.stroke();x.fillStyle=d.k==='oq_flag0'?MPL.VERM:MPL.LAPIS;x.beginPath();x.moveTo(a,b-3.4);x.lineTo(a+dir*3.2,b-2.5);x.lineTo(a,b-1.6);x.closePath();x.fill();x.strokeStyle=INK;x.lineWidth=.3;x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(a,b-3.5,.4,0,6.3);x.fill()}

  /* ---- the stalls: a striped canopy over a counter; the six stalls of the master ledger carry a gold edge ---- */
  const six=new Set(['kh_stall2_0','kh_stall2_1','kh_stall2_2','kh_stall2_3','kh_stall2_4','kh_stall2_5']);
  for(const d of L.decor){if(!/^kh_stall/.test(d.k)||d.x<BX0||d.x>BX1||d.y<75||d.y>103)continue;
    const a=X(d.x+.5),b=Y(d.y+.5),w=s*2.1,h=s*1.3,seed=d.x*3+d.y,c1=[MPL.VERM,MPL.LAPIS,MPL.VERD,'#c98a2a','#7a3a8a','#2a8a9a'][((seed*7)|0)%6];
    x.fillStyle='rgba(70,45,20,.3)';x.fillRect(a-w/2+.7,b-h/2+.7,w,h);
    x.fillStyle='#7a5a34';x.fillRect(a-w/2+.3,b-h/2+.3,w-.6,h-.6);
    const n=6;for(let i=0;i<n;i++){x.fillStyle=i%2?'#f2e8cc':c1;x.fillRect(a-w/2+i*w/n,b-h/2,w/n+.05,h*.8)}
    x.fillStyle=c1;for(let i=0;i<n;i+=2){x.beginPath();x.arc(a-w/2+(i+.5)*w/n,b-h/2+h*.8,w/n/2,0,Math.PI);x.fill()}
    x.strokeStyle=INK;x.lineWidth=.4;x.strokeRect(a-w/2,b-h/2,w,h*.8);
    if(six.has(d.k)){x.strokeStyle=MPL.GOLD;x.lineWidth=.7;x.strokeRect(a-w/2-.5,b-h/2-.5,w+1,h*.8+1);x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a,b-h/2-1.7,.9,0,6.3);x.fill();x.strokeStyle=INK;x.lineWidth=.25;x.stroke()}
    else{x.fillStyle='#f4ead0';x.beginPath();x.arc(a-.5,b+h*.5,.35,0,6.3);x.arc(a+.5,b+h*.5,.35,0,6.3);x.fill()}}

  /* ---- trees, bushes and lamps ---- */
  for(const d of L.decor){if(d.x<BX0||d.x>BX1+1||d.y<BY0-1||d.y>BY1+1)continue;const k=d.k,a=X(d.x+.5),b=Y(d.y+.5);
    if(/^ltree|^lbush|topiary/.test(k)){const big=/ltree(0|4|12|19)$/.test(k)&&d.y>=75&&d.y<=102;
      if(/topiary/.test(k)){x.fillStyle='#4a7a42';x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.arc(a,b-1,1.1,0,6.3);x.fill();x.stroke()}
      else if(/lbush/.test(k)){x.fillStyle='#6a8a4a';x.strokeStyle=INK;x.lineWidth=.35;x.beginPath();x.arc(a,b,1.1,0,6.3);x.fill();x.stroke()}
      else{x.fillStyle='rgba(60,40,20,.25)';x.beginPath();x.ellipse(a+.7,b+.9,1.7,.8,0,0,6.3);x.fill();mpOhFairTree(x,a,b+1.3,big?.55:.42,hash2(d.x,d.y,40)<.5?'#4f8a4a':'#5f9a50')}}
    else if(k==='lamp'){x.fillStyle=MPL.GOLD2;x.strokeStyle=INK;x.lineWidth=.25;x.beginPath();x.arc(a,b,.5,0,6.3);x.fill();x.stroke()}}
  /* a hanging sign over each shop door, with its name in small letters */
  for(const d of L.decor){if(!/^sign_/.test(d.k)||d.x<BX0||d.x>BX1||d.y<BY0||d.y>BY1)continue;const a=X(d.x+.5),b=Y(d.y+.5),t=d.txt&&d.txt[0]?d.txt[0].toLowerCase().replace(/(^|\s)\S/g,c=>c.toUpperCase()):'';
    x.fillStyle=MPL.GOLD;x.strokeStyle=INK;x.lineWidth=.3;x.fillRect(a-1,b-.8,2,1.6);x.strokeRect(a-1,b-.8,2,1.6);
    if(t)mplText(x,t,Math.min(a+1,X(146)),b+3.2,4.6,'#4a2a14','center')}
  /* a few of the crowd: small coloured heads with a body, so the green looks busy */
  for(const d of L.decor){if(!/^kh_oh(folk|sold)/.test(d.k)||d.x<102||d.x>129||d.y<75||d.y>102)continue;const a=X(d.x+.5),b=Y(d.y+.5),r=hash2(d.x,d.y,50);
    x.fillStyle=['#8a3a2a','#2a4a8a','#5a7a3a','#7a5a2a','#6a4a7a','#caa24a','#3a6a6a'][(r*7|0)%7];x.beginPath();x.arc(a,b+.35,.55,0,6.3);x.fill();x.fillStyle='#e8c8a0';x.beginPath();x.arc(a,b-.4,.38,0,6.3);x.fill()}

  /* ---- the east gate: two round towers and an arch in the wall at the end of the road, with banners ---- */
  {const gx=X(144),gy0=Y(72.2),gy1=Y(75.8),tw=s*2.2;
   x.fillStyle='#c8bca0';x.strokeStyle=INK;x.lineWidth=.6;x.fillRect(gx,gy0,s*5.4,gy1-gy0);x.strokeRect(gx,gy0,s*5.4,gy1-gy0);
   x.fillStyle='#2a1a0c';x.beginPath();x.moveTo(gx+s*.2,Y(75));x.lineTo(gx+s*.2,Y(73.7));x.arc(gx+s*.2+(s*1.2),Y(73.7),s*1.2,Math.PI,0);x.lineTo(gx+s*2.6,Y(75));x.closePath();x.fill();
   x.strokeStyle=MPL.GOLD;x.lineWidth=.35;for(let i=1;i<4;i++){x.beginPath();x.moveTo(gx+s*.2+i*s*.55,Y(73.5));x.lineTo(gx+s*.2+i*s*.55,Y(75));x.stroke()}
   for(const ty of [72.6,75.4]){const tx=gx+s*3.6,tyy=Y(ty);x.fillStyle='rgba(70,45,20,.3)';x.beginPath();x.arc(tx+.7,tyy+.7,tw,0,6.3);x.fill();x.fillStyle='#d8cfb8';x.beginPath();x.arc(tx,tyy,tw,0,6.3);x.fill();x.strokeStyle=INK;x.lineWidth=.6;x.stroke();
     x.lineWidth=.4;for(let i=0;i<10;i++){const an=i*Math.PI/5;x.beginPath();x.moveTo(tx+Math.cos(an)*tw*.78,tyy+Math.sin(an)*tw*.78);x.lineTo(tx+Math.cos(an)*tw,tyy+Math.sin(an)*tw);x.stroke()}
     x.fillStyle='#8a4a2a';x.beginPath();x.arc(tx,tyy,tw*.62,0,6.3);x.fill();x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(tx,tyy);x.lineTo(tx,tyy-tw*1.2);x.lineTo(tx+3.2,tyy-tw*.95);x.lineTo(tx,tyy-tw*.7);x.fill();x.strokeStyle=INK;x.lineWidth=.3;x.stroke()}
   x.fillStyle=MPL.GOLD;x.beginPath();x.arc(gx+s*1.4,Y(72.9),.7,0,6.3);x.fill()}

  /* ---- hand-lettered names, taken from the level's named places ---- */
  for(const n of L.mapNames||[]){if(n.x<BX0||n.x>BX1||n.y<BY0||n.y>BY1)continue;const a=X(n.x+.5),b=Y(n.y+.5);
    if(n.t==='Fair Green'){mplText(x,'The Fair Green',a,b+.5,5.2,'#3a2a1c','center');0}
    else if(n.t==='East Road'){x.save();mplText(x,'East Road',a-2,b-5.6,4.6,'#5a3a1c','center');x.restore()}
    else mplText(x,n.t,a,b,5,'#3a2a1c','center')}
  mplText(x,'East Gate',X(146.6),Y(70.6),4,MPL.VERM,'center');
  mplText(x,'The Lists',X(115.5),Y(96.2),3.8,'#5a3a1c','center');
  mplText(x,'Bandstand',X(115.2),Y(83.3),3.4,'#274a9a','center');
  mplText(x,'Carousel',X(126.4),Y(79.8),3.4,'#7a2a1a','center');
  mplText(x,'Big Wheel',X(105.5),Y(89.2),3.4,'#7a2a1a','center');
}});
/* a plain stand-in for the tree icon, scaled small for the map */
function mpOhFairTree(x,a,b,s,col){MPLI.tree(x,a,b,s,col)}
/* a striped marquee seen from above: stripes across its length, a ridge pole, guy ropes and a pennant */
function mpOhFairTent(x,cx,cy,w,h,c1,c2,small){
  x.save();x.fillStyle='rgba(70,45,20,.3)';x.fillRect(cx-w/2+.8,cy-h/2+.8,w,h);
  const n=Math.max(6,Math.round(w/.9)),sw=w/n;x.strokeStyle='rgba(60,35,15,.55)';x.lineWidth=.3;
  for(const [dx,dy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){x.beginPath();x.moveTo(cx+dx*w/2,cy+dy*h/2);x.lineTo(cx+dx*(w/2+1.6),cy+dy*(h/2+1.6));x.stroke()}
  for(let i=0;i<n;i++){x.fillStyle=i%2?c2:c1;x.fillRect(cx-w/2+i*sw,cy-h/2,sw+.05,h)}
  x.fillStyle='rgba(30,16,6,.22)';x.fillRect(cx-w/2,cy,w,h/2);
  x.strokeStyle=MPL.INK;x.lineWidth=.5;x.strokeRect(cx-w/2,cy-h/2,w,h);
  x.strokeStyle='#f4e8c8';x.lineWidth=.55;x.beginPath();x.moveTo(cx-w/2+.3,cy);x.lineTo(cx+w/2-.3,cy);x.stroke();
  x.fillStyle=MPL.GOLD;for(const dx of [-w/2+.9,w/2-.9]){x.beginPath();x.arc(cx+dx,cy,.55,0,6.3);x.fill()}
  if(!small){x.strokeStyle='#5a3a1c';x.lineWidth=.45;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,cy-h/2-1.8);x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(cx,cy-h/2-1.8);x.lineTo(cx+2.4,cy-h/2-1.1);x.lineTo(cx,cy-h/2-.4);x.fill()}
  x.restore()}
