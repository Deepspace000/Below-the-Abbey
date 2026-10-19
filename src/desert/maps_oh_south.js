/* ==========================================================================
   Oldhaven map section SOUTH (order 14): cells x 0..150, y 95..150 of level 305. The Garrison Quarter (west), the Smiths Quarter (east), the King's Road running
   south down the middle to the Portcullis Gate in the south wall, and the houses between. Everything is read from the real level: floors (fmap), walls (rows),
   roofs and towers (sky), doors (KH_DOOR), trees, lamps, wells and flowers (decor and scenery). The barracks, parade ground, drill yard, forges and carts are
   drawn on the real courts and terraces that stand in those places. Names start with mpOhSouth.
   ========================================================================== */
const MPOHS_INK='#2a1a0c';
const MPOHS_GROUND={0:'#dccfa9',1:'#e9e0c6',2:'#b6c385',3:'#d3cba2',4:'#dac998',5:'#bcc68a'};
const MPOHS_ROOF={oh_rf_moss:'#7f9c6a',oh_rf_terra2:'#bd6b45',oh_rf_plum:'#87596f',oh_rf_thatch:'#cdb066',oh_rf_sage:'#8ea884',oh_rf_brown:'#86593a',
  kh_ohroof1_1:'#6d7a8d',kh_ohroof1_4:'#a97a4c',kh_ohroof1_2:'#b8523a',kh_ohroof1_0:'#7d5a70',kh_ohroof1_3:'#7f9c6a'};
/* a wobbly line from (a,b) to (c,d): n short pieces, each nudged a little */
function mpOhSouthWob(x,a,b,c,d,seed,amp,n){
  n=n||3;x.beginPath();x.moveTo(a,b);
  for(let i=1;i<=n;i++){const t=i/n,j=i===n?0:1;x.lineTo(a+(c-a)*t+(hash2(i,seed,11)-.5)*amp*j,b+(d-b)*t+(hash2(i,seed,12)-.5)*amp*j)}
  x.stroke()}
/* a canopy seen from above: a shadow, a ring of leaf blobs in several greens, light flecks */
function mpOhSouthTree(x,a,b,r,seed,kind){
  x.save();x.fillStyle='rgba(50,40,20,.26)';x.beginPath();x.ellipse(a+r*.35,b+r*.4,r*1.05,r*.9,0,0,6.3);x.fill();
  const g=kind==='dark'?['#3f6a45','#4c7a4e','#5a8a56']:kind==='orchard'?['#5b8a4c','#6c9c58','#7aab62']:['#3f7048','#4e8050','#5f9059'];
  const n=kind==='round'?7:8;
  for(let i=0;i<n;i++){const an=i/n*6.283+hash2(seed,i,1)*.8,d=r*(.5+hash2(seed,i,2)*.25),rr=r*(.5+hash2(seed,i,3)*.2);
    x.fillStyle=g[i%3];x.strokeStyle='rgba(30,50,25,.8)';x.lineWidth=.35;x.beginPath();x.arc(a+Math.cos(an)*d,b+Math.sin(an)*d,rr,0,6.3);x.fill();x.stroke()}
  x.fillStyle=g[1];x.beginPath();x.arc(a,b,r*.62,0,6.3);x.fill();
  x.fillStyle='rgba(235,240,170,.42)';for(let i=0;i<5;i++){x.beginPath();x.arc(a-r*.3+hash2(seed,i,4)*r*.5,b-r*.35+hash2(seed,i,5)*r*.4,r*.14,0,6.3);x.fill()}
  x.strokeStyle='rgba(30,50,25,.7)';x.lineWidth=.3;x.beginPath();x.arc(a,b,r*.95,.4,2.6);x.stroke();x.restore()}
/* a house roof from above: ridge along the long side, the far slope shaded, tile courses hatched along the slope; some are hipped (corner lines to the ridge ends) */
function mpOhSouthRoof(x,px0,py0,px1,py1,col,seed,s){
  const w=px1-px0,h=py1-py0,hor=w>=h,hip=hash2(seed,7,9)<.5&&Math.min(w,h)>s*2.6;x.save();
  x.fillStyle=col;x.fillRect(px0,py0,w,h);
  const mx=(px0+px1)/2,my=(py0+py1)/2,sh=Math.min(w,h)/2;
  x.fillStyle='rgba(30,15,5,.26)';if(hor)x.fillRect(px0,my,w,h/2);else x.fillRect(mx,py0,w/2,h);
  x.fillStyle='rgba(255,240,200,.18)';if(hor)x.fillRect(px0,py0,w,h/2);else x.fillRect(px0,py0,w/2,h);
  // ridge ends: a hipped roof draws its ridge short and runs lines to the corners
  let r0x,r0y,r1x,r1y;
  if(hor){r0x=px0+(hip?sh:0);r1x=px1-(hip?sh:0);r0y=r1y=my}else{r0y=py0+(hip?sh:0);r1y=py1-(hip?sh:0);r0x=r1x=mx}
  x.strokeStyle='rgba(40,20,8,.32)';x.lineWidth=.3;x.beginPath();const st=s*.46;
  if(hor){for(let k=st;k<h/2;k+=st){x.moveTo(px0+.3,my-k);x.lineTo(px1-.3,my-k);x.moveTo(px0+.3,my+k);x.lineTo(px1-.3,my+k)}}
  else{for(let k=st;k<w/2;k+=st){x.moveTo(mx-k,py0+.3);x.lineTo(mx-k,py1-.3);x.moveTo(mx+k,py0+.3);x.lineTo(mx+k,py1-.3)}}
  x.stroke();
  x.strokeStyle='rgba(30,12,4,.85)';x.lineWidth=.55;x.beginPath();x.moveTo(r0x,r0y);x.lineTo(r1x,r1y);
  if(hip){x.moveTo(r0x,r0y);x.lineTo(px0,py0);x.moveTo(r0x,r0y);x.lineTo(hor?px0:px1,hor?py1:py0);x.moveTo(r1x,r1y);x.lineTo(px1,py1);x.moveTo(r1x,r1y);x.lineTo(hor?px1:px0,hor?py0:py1)}
  x.stroke();
  x.fillStyle='rgba(255,245,215,.55)';x.beginPath();x.arc(r0x,r0y,.4,0,6.3);x.arc(r1x,r1y,.4,0,6.3);x.fill();
  x.strokeStyle=MPOHS_INK;x.lineWidth=.75;x.lineJoin='round';
  mpOhSouthWob(x,px0,py0,px1,py0,seed,.35,2);mpOhSouthWob(x,px1,py0,px1,py1,seed+1,.35,2);mpOhSouthWob(x,px1,py1,px0,py1,seed+2,.35,2);mpOhSouthWob(x,px0,py1,px0,py0,seed+3,.35,2);
  x.restore()}
/* smoke rising from a chimney */
function mpOhSouthSmoke(x,a,b,seed,s){
  x.save();for(let i=0;i<6;i++){const t=i/5,r=s*(.55+t*1.1);x.fillStyle=`rgba(${70+i*14},${68+i*14},${72+i*14},${.62-t*.45})`;x.beginPath();x.arc(a+t*s*3.2+Math.sin(t*5+seed)*s*.5,b-t*s*5.2,r,0,6.3);x.fill()}x.restore()}
function mpOhSouthAnvil(x,a,b,k){
  x.save();x.translate(a,b);x.scale(k,k);x.fillStyle='#4a4a52';x.strokeStyle=MPOHS_INK;x.lineWidth=.45;
  x.beginPath();x.moveTo(-3,-1.3);x.lineTo(2,-1.3);x.lineTo(3.4,-.5);x.lineTo(2,.2);x.lineTo(1,.2);x.lineTo(1.2,1.2);x.lineTo(1.8,1.8);x.lineTo(-2,1.8);x.lineTo(-1.4,1.2);x.lineTo(-1.2,.2);x.lineTo(-3,.2);x.closePath();x.fill();x.stroke();
  x.fillStyle='#8a8a94';x.fillRect(-2.6,-1.1,4.4,.5);x.restore()}
function mpOhSouthCart(x,a,b,k,seed){
  x.save();x.translate(a,b);x.scale(k,k);x.fillStyle='#7a5434';x.strokeStyle=MPOHS_INK;x.lineWidth=.45;x.fillRect(-3.4,-2,6.8,3);x.strokeRect(-3.4,-2,6.8,3);
  x.fillStyle=hash2(seed,1,1)<.5?'#8a5a3a':'#5a5a62';for(let i=0;i<6;i++){x.beginPath();x.arc(-2.4+i*.95,-2.1-hash2(seed,i,2)*.9,.85,0,6.3);x.fill();x.stroke()}
  x.fillStyle='#2a1a0c';for(const wx of [-2,2]){x.beginPath();x.arc(wx,1.4,1.1,0,6.3);x.fill()}x.fillStyle='#caa860';for(const wx of [-2,2]){x.beginPath();x.arc(wx,1.4,.4,0,6.3);x.fill()}
  x.strokeStyle=MPOHS_INK;x.beginPath();x.moveTo(3.4,-.5);x.lineTo(6.4,-1.6);x.stroke();x.restore()}
/* a pennant on a pole */
function mpOhSouthFlag(x,a,b,k,col){
  x.save();x.strokeStyle=MPOHS_INK;x.lineWidth=.5;x.beginPath();x.moveTo(a,b+3*k);x.lineTo(a,b-3*k);x.stroke();
  x.fillStyle=col||MPL.VERM;x.beginPath();x.moveTo(a,b-3*k);x.lineTo(a+4*k,b-2*k);x.lineTo(a,b-.8*k);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a,b-3.2*k,.5*k,0,6.3);x.fill();x.restore()}
/* a practice post: an upright with a cross arm and a round shield or straw target */
function mpOhSouthPost(x,a,b,k,seed){
  x.save();x.strokeStyle=MPOHS_INK;x.lineWidth=.5;x.fillStyle='#caa860';
  x.beginPath();x.moveTo(a,b+2.4*k);x.lineTo(a,b-2.6*k);x.moveTo(a-1.6*k,b-1.2*k);x.lineTo(a+1.6*k,b-1.2*k);x.stroke();
  x.beginPath();x.arc(a,b-.4*k,1.4*k,0,6.3);x.fill();x.stroke();x.fillStyle=hash2(seed,1,3)<.5?MPL.VERM:MPL.LAPIS;x.beginPath();x.arc(a,b-.4*k,.7*k,0,6.3);x.fill();x.restore()}
function mpOhSouthTarget(x,a,b,k){
  x.save();x.strokeStyle=MPOHS_INK;x.lineWidth=.4;for(const [r,c] of [[2.4,'#efe6cc'],[1.7,MPL.VERM],[1.1,'#efe6cc'],[.55,MPL.GOLD]]){x.fillStyle=c;x.beginPath();x.arc(a,b,r*k,0,6.3);x.fill();x.stroke()}x.restore()}
function mpOhSouthFountain(x,a,b,r){
  x.save();x.fillStyle='#bcb49c';x.strokeStyle=MPOHS_INK;x.lineWidth=.5;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();x.stroke();
  x.fillStyle='#7aa6c6';x.beginPath();x.arc(a,b,r*.74,0,6.3);x.fill();x.strokeStyle='rgba(255,255,255,.65)';x.lineWidth=.3;x.beginPath();x.arc(a,b,r*.46,.5,4.2);x.stroke();x.beginPath();x.arc(a,b,r*.22,0,6.3);x.stroke();
  x.fillStyle='#cfc8b0';x.beginPath();x.arc(a,b,r*.14,0,6.3);x.fill();x.restore()}
function mpOhSouthPaint(x,L,api,fit){
  const s=fit.s,X=fit.X,Y=fit.Y,R=hash2,INK=MPOHS_INK;
  const X0=6,X1=143,Y0=93,Y1=143;
  x.beginPath();x.rect(X(0),Y(93),X(150)-X(0),Y(150)+3-Y(93));x.clip();
  const rows=L.rows,fmap=L.fmap;
  const open=(cx,cy)=>!!(rows[cy]&&rows[cy][cx]==='.');
  const fm=(cx,cy)=>{const r=fmap[cy];return r?+r[cx]:0};
  const inCity=(cx,cy)=>cx>=X0&&cx<=X1&&cy>=Y0&&cy<=Y1;
  const lawnC=(cx,cy)=>{const f=fm(cx,cy);return open(cx,cy)&&(f===2||f===5)};
  /* ---------- the ground, row by row, one fill for each run of the same floor ---------- */
  for(let cy=Y0;cy<=Y1;cy++){
    let cx=X0;
    while(cx<=X1){
      const f=open(cx,cy)?fm(cx,cy):0;let e=cx;while(e+1<=X1&&(open(e+1,cy)?fm(e+1,cy):0)===f)e++;
      x.fillStyle=MPOHS_GROUND[f];x.fillRect(X(cx),Y(cy),(e-cx+1)*s+.35,s+.35);cx=e+1}}
  /* washes: soft blotches so the ground is not flat */
  x.save();for(let i=0;i<260;i++){const cx=X0+R(i,1,801)*(X1-X0),cy=Y0+R(i,2,801)*(Y1-Y0);const a=open(cx|0,cy|0),f=a?fm(cx|0,cy|0):0;
    x.fillStyle=(f===2||f===5)?(R(i,3,801)<.5?'rgba(90,130,60,.12)':'rgba(240,240,170,.16)'):(R(i,3,801)<.5?'rgba(120,90,50,.07)':'rgba(255,245,215,.18)');
    x.beginPath();x.ellipse(X(cx),Y(cy),s*(1.5+R(i,4,801)*3),s*(1+R(i,5,801)*2),R(i,6,801)*3,0,6.3);x.fill()}x.restore();
  /* marks on the ground: cobbles on the streets, joints on the plazas, grass tufts, meadow flowers, gravel specks */
  x.save();x.lineCap='round';
  for(let cy=Y0;cy<=Y1;cy++)for(let cx=X0;cx<=X1;cx++){
    if(!open(cx,cy))continue;const f=fm(cx,cy),a=X(cx),b=Y(cy);
    if(f===0||f===3){x.strokeStyle=f===3?'rgba(90,110,60,.4)':'rgba(120,98,66,.4)';x.lineWidth=.35;
      for(let k=0;k<3;k++){const u=a+R(cx,cy*3+k,810)*s,v=b+R(cx,cy*3+k,811)*s;x.beginPath();x.ellipse(u,v,s*.2,s*.13,R(cx,cy,812)*3,0,6.3);x.stroke()}}
    else if(f===1){x.strokeStyle='rgba(130,112,80,.35)';x.lineWidth=.3;x.beginPath();x.moveTo(a,b);x.lineTo(a+s,b);x.moveTo(a+(R(cx,cy,813)*.6+.2)*s,b);x.lineTo(a+(R(cx,cy,813)*.6+.2)*s,b+s);x.stroke()}
    else if(f===4){x.fillStyle='rgba(110,86,52,.45)';for(let k=0;k<3;k++){x.fillRect(a+R(cx,cy*3+k,814)*s,b+R(cx,cy*3+k,815)*s,.5,.5)}}
    else{ // lawn
      if(R(cx,cy,816)<.55){x.strokeStyle='rgba(50,90,40,.55)';x.lineWidth=.3;const u=a+R(cx,cy,817)*s,v=b+(.4+R(cx,cy,818)*.5)*s;x.beginPath();x.moveTo(u,v);x.lineTo(u-.7,v-1.5);x.moveTo(u,v);x.lineTo(u,v-1.8);x.moveTo(u,v);x.lineTo(u+.7,v-1.5);x.stroke()}
      if(f===5&&R(cx,cy,819)<.5){x.fillStyle=['#c6463a','#f0d878','#f4f0e4','#6a7ac8'][(R(cx,cy,820)*4)|0];x.beginPath();x.arc(a+R(cx,cy,821)*s,b+R(cx,cy,822)*s,.45,0,6.3);x.fill()}}}
  x.restore();
  /* the edges between lawn and paving, hand inked */
  x.save();x.strokeStyle='rgba(70,95,45,.7)';x.lineWidth=.5;x.lineCap='round';
  for(let cy=Y0;cy<=Y1;cy++)for(let cx=X0;cx<=X1;cx++){
    if(!open(cx,cy))continue;const g=lawnC(cx,cy);
    if(open(cx+1,cy)&&lawnC(cx+1,cy)!==g)mpOhSouthWob(x,X(cx+1),Y(cy),X(cx+1),Y(cy+1),cx*7+cy,.5,2);
    if(open(cx,cy+1)&&lawnC(cx,cy+1)!==g)mpOhSouthWob(x,X(cx),Y(cy+1),X(cx+1),Y(cy+1),cx*5+cy,.5,2)}
  x.restore();
  /* ---------- the houses: rectangles worked out from the real roofs and doors ---------- */
  const doors=[];
  for(let cy=Y0-3;cy<=Y1;cy++)for(let cx=X0;cx<=X1;cx++){const c=rows[cy]&&rows[cy][cx];if(c&&c!=='.'&&L.chars&&L.chars[c]!==undefined&&typeof KH_DOOR!=='undefined'&&KH_DOOR[L.chars[c]])doors.push([cx,cy])}
  const covered=new Uint8Array(150*150),houses=[];
  for(const r of (L.sky||[])){
    if(!(r.k in MPOHS_ROOF)||r.y<Y0-4||r.y>Y1||r.x<X0||r.x>X1+1)continue;
    const wd=Math.round(r.w-.5);let best=null,bd=1e9;
    for(const d of doors){const dxc=d[0]+.5-r.x,dyc=d[1]+.5-r.y,dd=Math.abs(dxc)+Math.abs(dyc);if(dd<bd&&Math.abs(dxc)<=wd/2+3&&Math.abs(dyc)<=wd/2+3){bd=dd;best=[dxc,dyc,d]}}
    if(!best||bd>8)continue;const [dxc,dyc,d]=best;let x0,x1,y0,y1;
    if(Math.abs(dyc)>=Math.abs(dxc)){const hd=Math.abs(dyc)+.5;x0=r.x-wd/2;x1=r.x+wd/2;y0=r.y-hd;y1=r.y+hd}
    else{const hd=Math.abs(dxc)+.5;y0=r.y-wd/2;y1=r.y+wd/2;x0=r.x-hd;x1=r.x+hd}
    x0=Math.round(x0);x1=Math.round(x1);y0=Math.round(y0);y1=Math.round(y1);
    let solid=0,tot=0;for(let cy=y0;cy<y1;cy++)for(let cx=x0;cx<x1;cx++){tot++;if(rows[cy]&&rows[cy][cx]!=='.')solid++}
    if(tot<4||solid/tot<.7)continue;
    houses.push({x0,y0,x1,y1,col:MPOHS_ROOF[r.k],d,seed:(x0*31+y0*17)|0,k:r.k});
    for(let cy=y0;cy<y1;cy++)for(let cx=x0;cx<x1;cx++)covered[cy*150+cx]=1}
  /* solid cells that no roof covers (towers, walls, odd corners): plain stone */
  const stone=[];
  for(let cy=Y0;cy<=Y1;cy++)for(let cx=X0;cx<=X1;cx++)if(rows[cy]&&rows[cy][cx]!=='.'&&!covered[cy*150+cx])stone.push([cx,cy]);
  // shadows first, so neighbours do not paint over each other's outlines
  x.save();x.fillStyle='rgba(60,40,20,.3)';
  for(const h of houses)x.fillRect(X(h.x0)+s*.35,Y(h.y0)+s*.4,(h.x1-h.x0)*s,(h.y1-h.y0)*s);
  for(const [cx,cy] of stone)x.fillRect(X(cx)+s*.3,Y(cy)+s*.35,s,s);x.restore();
  for(const [cx,cy] of stone){x.fillStyle=(cx+cy)%2?'#cdc2a6':'#c4b898';x.fillRect(X(cx),Y(cy),s+.3,s+.3)}
  // the garrison's barracks are slate grey, the forges of the Smiths Quarter dark red-brown
  const isBarrack=h=>h.x0>=8&&h.x1<=17&&h.y0>=104&&h.y1<=118;
  const isForge=h=>h.x0>=117&&h.x1<=144&&h.y0>=104&&h.y1<=133;
  for(const h of houses){
    let col=h.col;if(isBarrack(h))col=R(h.x0,h.y0,830)<.5?'#6d7a8d':'#7a8698';
    mpOhSouthRoof(x,X(h.x0)+.35,Y(h.y0)+.35,X(h.x1)-.35,Y(h.y1)-.35,col,h.seed,s)}
  // doors: a dark tab and a step on the front
  for(const h of houses){const [dx,dy]=h.d,cxm=(h.x0+h.x1)/2,cym=(h.y0+h.y1)/2;let ox=0,oy=0;
    if(dy===h.y0)oy=-1;else if(dy===h.y1-1)oy=1;else if(dx===h.x0)ox=-1;else ox=1;
    const a=X(dx+.5)+ox*s*.5,b=Y(dy+.5)+oy*s*.5;x.fillStyle='#3a2414';x.strokeStyle=INK;x.lineWidth=.3;
    if(oy)x.fillRect(a-s*.45,b-(oy>0?0:s*.25),s*.9,s*.25);else x.fillRect(a-(ox>0?0:s*.25),b-s*.45,s*.25,s*.9);
  }
  // dormers, chimneys, turrets
  for(const h of houses){
    const w=h.x1-h.x0,d=h.y1-h.y0,rich=R(h.seed,1,840);
    if(rich<.3&&w*d>=14){const u=X(h.x0)+(R(h.seed,2,840)*.5+.25)*w*s,v=Y(h.y0)+(R(h.seed,3,840)*.4+.3)*d*s;x.fillStyle='#d9cdb0';x.strokeStyle=INK;x.lineWidth=.4;x.fillRect(u-s*.5,v-s*.35,s,s*.7);x.strokeRect(u-s*.5,v-s*.35,s,s*.7);x.fillStyle=h.col;x.fillRect(u-s*.4,v-s*.28,s*.8,s*.25)}
    if(R(h.seed,4,840)<.55){const u=X(h.x0)+(R(h.seed,5,840)*.6+.2)*w*s,v=Y(h.y0)+(R(h.seed,6,840)*.5+.2)*d*s;x.fillStyle='#a89a84';x.strokeStyle=INK;x.lineWidth=.35;x.fillRect(u-.6,v-.6,1.2,1.2);x.strokeRect(u-.6,v-.6,1.2,1.2)}}
  for(const t of (L.sky||[])){if(!/ohtower1_[0145]$/.test(t.k)||t.y<Y0||t.y>Y1-1||t.x<X0+2||t.x>X1-2)continue;
    const a=X(t.x),b=Y(t.y),r=s*1.1;x.fillStyle='rgba(60,40,20,.3)';x.beginPath();x.arc(a+s*.3,b+s*.35,r,0,6.3);x.fill();
    x.fillStyle='#8a97a8';x.strokeStyle=INK;x.lineWidth=.55;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();x.stroke();
    x.strokeStyle='rgba(30,40,60,.5)';x.lineWidth=.3;for(let i=0;i<8;i++){const an=i*.785;x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.cos(an)*r,b+Math.sin(an)*r);x.stroke()}
    x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a,b,.5,0,6.3);x.fill()}
  /* ---------- the Smiths Quarter: smoking chimneys on the forges, glow, anvils, ore carts, charcoal ---------- */
  const forges=houses.filter(isForge);
  forges.forEach((h,i)=>{
    if(R(h.seed,7,850)<.62){const w=h.x1-h.x0,d=h.y1-h.y0,u=X(h.x0)+(.25+R(h.seed,8,850)*.5)*w*s,v=Y(h.y0)+(.3+R(h.seed,9,850)*.4)*d*s;
      x.fillStyle='#5a4a3c';x.strokeStyle=INK;x.lineWidth=.4;x.fillRect(u-1.1,v-1.1,2.2,2.2);x.strokeRect(u-1.1,v-1.1,2.2,2.2);x.fillStyle='#e0582a';x.fillRect(u-.5,v-.5,1,1);
      h.smoke=[u,v]}});
  /* ---------- trees, hedges, wells, lamps, flowers, banners from the real decor ---------- */
  const dec=L.decor||[];
  for(const d of dec){
    if(d.y<Y0||d.y>Y1+1)continue;const k=d.k,a=X(d.x+.5),b=Y(d.y+.5);
    if(/^ltree/.test(k)){const big=/^ltree(0|4|8|12)$/.test(k);mpOhSouthTree(x,a,b,s*(big?1.75:1.25),d.x*13+d.y,big?'':'orchard')}
  }
  /* fountains and wells in the courts, then the small garden furniture */
  for(const d of dec){
    if(d.y<Y0||d.y>Y1+1)continue;const k=d.k,a=X(d.x+.5),b=Y(d.y+.5);
    if(k==='kh_ohgard1_0'&&d.y>96)mpOhSouthFountain(x,a,b,s*.95);
    else if(k==='oh_well'){x.fillStyle='#a9a18a';x.strokeStyle=INK;x.lineWidth=.45;x.beginPath();x.arc(a,b,s*.75,0,6.3);x.fill();x.stroke();x.fillStyle='#3e6a90';x.beginPath();x.arc(a,b,s*.42,0,6.3);x.fill();x.strokeStyle='#5a3a1c';x.lineWidth=.5;x.beginPath();x.moveTo(a-s*.9,b);x.lineTo(a+s*.9,b);x.stroke()}
    else if(k==='kh_city2_1'||k==='oh_topiary'){x.fillStyle='#4f8a4f';x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.arc(a,b,s*.55,0,6.3);x.fill();x.stroke();x.fillStyle='rgba(235,245,170,.5)';x.beginPath();x.arc(a-s*.15,b-s*.15,s*.18,0,6.3);x.fill()}
    else if(k==='kh_ohgard1_3'){x.fillStyle='#5a8c4c';x.strokeStyle='rgba(30,50,25,.8)';x.lineWidth=.35;for(let i=0;i<3;i++){x.beginPath();x.arc(a+(i-1)*s*.28,b+(i%2)*s*.12,s*.32,0,6.3);x.fill();x.stroke()}}
    else if(k==='kh_ohgard1_1'){x.fillStyle='#4a7a42';x.strokeStyle='rgba(30,50,25,.9)';x.lineWidth=.4;x.fillRect(a-s*.7,b-s*.3,s*1.4,s*.6);x.strokeRect(a-s*.7,b-s*.3,s*1.4,s*.6)}
    else if(k==='kh_ohgard1_2'||k==='oh_pergola'){x.strokeStyle='#6a4524';x.lineWidth=.5;x.fillStyle='rgba(110,150,80,.7)';x.fillRect(a-s*.9,b-s*.5,s*1.8,s);x.strokeRect(a-s*.9,b-s*.5,s*1.8,s);x.beginPath();for(let i=-1;i<=1;i++){x.moveTo(a+i*s*.5,b-s*.5);x.lineTo(a+i*s*.5,b+s*.5)}x.stroke()}
    else if(/^kh_ohgard2_[14]$/.test(k)){x.fillStyle='#8a5e38';x.strokeStyle=INK;x.lineWidth=.35;x.fillRect(a-s*.6,b-s*.22,s*1.2,s*.44);x.strokeRect(a-s*.6,b-s*.22,s*1.2,s*.44)}
    else if(/^kh_ohgard2_[23]$/.test(k)){x.fillStyle='#9a6e40';x.strokeStyle=INK;x.lineWidth=.35;x.beginPath();x.arc(a,b,s*.38,0,6.3);x.fill();x.stroke();x.strokeStyle='rgba(30,15,5,.6)';x.beginPath();x.arc(a,b,s*.2,0,6.3);x.stroke()}
    else if(k==='yar_tub'){x.fillStyle='#8a6a42';x.strokeStyle=INK;x.lineWidth=.35;x.beginPath();x.arc(a,b,s*.3,0,6.3);x.fill();x.stroke();x.fillStyle='#6aa05a';x.beginPath();x.arc(a,b,s*.2,0,6.3);x.fill()}
  }
  for(const sc of (L.scenery||[])){
    if(sc.wy<Y0||sc.wy>Y1)continue;const a=X(sc.wx),b=Y(sc.wy);
    if(/^lflora|^kh_city2_5/.test(sc.k)){const cs=[['#c6463a','#f0d878'],['#f4f0e4','#c9a227'],['#6a7ac8','#f4f0e4'],['#d8789a','#f0d878']][((sc.wx*7+sc.wy*3)|0)&3];
      x.fillStyle='rgba(60,100,40,.7)';x.beginPath();x.arc(a,b,s*.3,0,6.3);x.fill();for(let i=0;i<3;i++){x.fillStyle=i?cs[0]:cs[1];x.beginPath();x.arc(a+(i-1)*s*.2,b+((i+1)%2)*s*.1-s*.05,.55,0,6.3);x.fill()}}}
  /* lamps (small gold lanterns) and banners (small vermilion pennants) */
  for(const d of dec){
    if(d.y<Y0||d.y>Y1)continue;const a=X(d.x+.5),b=Y(d.y+.5);
    if(d.k==='lamp'){x.fillStyle='rgba(240,200,80,.35)';x.beginPath();x.arc(a,b,s*.6,0,6.3);x.fill();x.fillStyle=MPL.GOLD;x.strokeStyle=INK;x.lineWidth=.3;x.beginPath();x.arc(a,b,.75,0,6.3);x.fill();x.stroke()}
    else if(d.k==='oh_banner'){mpOhSouthFlag(x,a,b,.5,(d.x+d.y)%2?MPL.VERM:MPL.LAPIS)}}
  /* ---------- Garrison Quarter ---------- */
  const rectPx=(a0,b0,a1,b1)=>[X(a0),Y(b0),X(a1+1)-X(a0),Y(b1+1)-Y(b0)];
  { // the parade ground: swept sand, a gold ring, a flagpole in the middle, flags at the corners
    const [rx,ry,rw,rh]=rectPx(22,109,28,113);x.save();x.fillStyle='rgba(214,192,140,.9)';x.fillRect(rx,ry,rw,rh);
    x.strokeStyle='rgba(140,110,60,.5)';x.lineWidth=.3;for(let i=0;i<14;i++){const yy=ry+i*rh/14;x.beginPath();x.moveTo(rx,yy);x.lineTo(rx+rw,yy);x.stroke()}
    x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.beginPath();x.ellipse(rx+rw/2,ry+rh/2,rw*.36,rh*.36,0,0,6.3);x.stroke();x.strokeStyle=INK;x.lineWidth=.3;x.beginPath();x.ellipse(rx+rw/2,ry+rh/2,rw*.4,rh*.4,0,0,6.3);x.stroke();
    x.restore();mpOhSouthFlag(x,rx+rw/2,ry+rh/2+1,1.5,MPL.VERM);
    for(const [a,b,c] of [[22.8,109.8,MPL.LAPIS],[27.2,109.8,MPL.LAPIS],[22.8,112.2,MPL.VERM],[27.2,112.2,MPL.VERM]])mpOhSouthFlag(x,X(a),Y(b),.8,c);
    // the drill yard: a second court of sand with practice posts, a weapon rack and straw targets
    const [dx,dy,dw,dh]=rectPx(22,123,28,128);x.save();x.fillStyle='rgba(206,178,122,.92)';x.fillRect(dx,dy,dw,dh);
    for(let i=0;i<46;i++){x.fillStyle='rgba(120,90,50,.35)';x.fillRect(dx+R(i,1,860)*dw,dy+R(i,2,860)*dh,.6,.5)}
    x.strokeStyle='rgba(120,90,50,.45)';x.lineWidth=.35;for(let i=0;i<3;i++){x.beginPath();x.ellipse(dx+dw*.5,dy+dh*.55,dw*(.16+i*.12),dh*(.12+i*.1),0,0,6.3);x.stroke()}x.restore();
    for(const [a,b] of [[23.3,124],[25.5,124],[27.7,124]])mpOhSouthPost(x,X(a),Y(b),.75,a);
    x.strokeStyle=INK;x.lineWidth=.45;x.fillStyle='#7a5434';x.fillRect(X(23),Y(127.5),s*2.6,s*.5);x.strokeRect(X(23),Y(127.5),s*2.6,s*.5);
    x.beginPath();for(let i=0;i<7;i++){x.moveTo(X(23.1+i*.38),Y(127.45));x.lineTo(X(23.1+i*.38),Y(126.6))}x.stroke();
    // archery butts in the court beside it
    const [ax,ay,aw,ah]=rectPx(37,123,43,128);x.save();x.fillStyle='rgba(176,190,120,.5)';x.fillRect(ax,ay,aw,ah);x.restore();
    for(const [a,b] of [[38,124.2],[40,124.2],[42,124.2]]){x.fillStyle='#caa860';x.strokeStyle=INK;x.lineWidth=.4;x.fillRect(X(a)-s*.5,Y(b)+s*.3,s,s*.5);x.strokeRect(X(a)-s*.5,Y(b)+s*.3,s,s*.5);mpOhSouthTarget(x,X(a),Y(b)+.2,.7)}
    x.strokeStyle='rgba(120,90,50,.5)';x.lineWidth=.35;x.setLineDash([1.2,1.2]);x.beginPath();x.moveTo(X(40),Y(125));x.lineTo(X(40),Y(128.3));x.stroke();x.setLineDash([]);
    // barracks: a banner over the terraces, a flag on each end
    mpOhSouthFlag(x,X(12.5),Y(106.2),.9,MPL.VERM);mpOhSouthFlag(x,X(12.5),Y(119.2),.9,MPL.LAPIS);
    // the Garrison Hall (door at 31,111): a vermilion banner on its roof
    mpOhSouthFlag(x,X(30.4),Y(111.2),.95,MPL.VERM)}
  /* ---------- Smiths Quarter ---------- */
  { // the Great Forge court: sooty ground, a forge fire, anvils, a water trough, charcoal heaps
    for(const [c0,r0,c1,r1] of [[120,109,126,114],[105,108,111,114],[120,123,126,129],[105,124,111,128]]){
      const [rx,ry,rw,rh]=rectPx(c0,r0,c1,r1);x.save();x.fillStyle='rgba(120,104,86,.5)';x.fillRect(rx,ry,rw,rh);
      for(let i=0;i<60;i++){x.fillStyle=i%3?'rgba(50,40,34,.35)':'rgba(190,170,140,.4)';x.fillRect(rx+R(i,c0,870)*rw,ry+R(i,r0,870)*rh,.7,.5)}x.restore()}
    for(const [a,b,k] of [[121.2,110.7,1],[124.8,110.7,1],[121.5,112.8,.9],[106.4,110.2,1],[109.8,110.2,.9],[106.6,112.5,1],[121.4,125,1],[124.4,127.4,.9],[107,126,.9],[110,125.2,1]])mpOhSouthAnvil(x,X(a),Y(b),k*.85);
    for(const [a,b] of [[122.9,111.7],[108.1,111.4],[123,123.9]]){x.fillStyle='#3a2a22';x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.arc(X(a),Y(b),s*.8,0,6.3);x.fill();x.stroke();x.fillStyle='#e0582a';x.beginPath();x.arc(X(a),Y(b),s*.45,0,6.3);x.fill();x.fillStyle='#f6c04a';x.beginPath();x.arc(X(a),Y(b),s*.2,0,6.3);x.fill()}
    for(const [a,b] of [[125.4,113.2],[110.4,113],[125.2,128.3]]){x.fillStyle='#7a5a3a';x.strokeStyle=INK;x.lineWidth=.35;x.fillRect(X(a)-s*.8,Y(b)-s*.25,s*1.6,s*.5);x.strokeRect(X(a)-s*.8,Y(b)-s*.25,s*1.6,s*.5);x.fillStyle='#6a9ac0';x.fillRect(X(a)-s*.65,Y(b)-s*.15,s*1.3,s*.3)}
    for(const [a,b] of [[120.6,113.6],[106,113.2],[110.6,127.4],[120.6,128.4]]){x.fillStyle='#2e2622';x.strokeStyle=INK;x.lineWidth=.3;x.beginPath();x.moveTo(X(a)-s*.6,Y(b)+s*.3);x.quadraticCurveTo(X(a),Y(b)-s*.8,X(a)+s*.6,Y(b)+s*.3);x.closePath();x.fill();x.stroke()}
    // ore carts in the lanes and at the court mouths
    for(const [a,b] of [[130.5,103.5],[116,104],[138,118.6],[113.5,119.2],[102.5,118.9],[128.5,133.6],[98,104],[122,133.6],[110,133.6]])if(inCity(a|0,b|0))mpOhSouthCart(x,X(a),Y(b),.8,a*b)}
  for(const h of forges)if(h.smoke)mpOhSouthSmoke(x,h.smoke[0],h.smoke[1]-1.5,h.seed,1);
  /* ---------- the King's Road and the Portcullis Gate ---------- */
  { // the paving of the road gets a gold inked centre line and edge rules
    x.save();x.fillStyle='rgba(236,226,196,.55)';x.fillRect(X(73),Y(94),3*s,41*s);x.strokeStyle='rgba(95,72,40,.85)';x.lineWidth=.7;mpOhSouthWob(x,X(73),Y(94),X(73),Y(135),3,.5,30);mpOhSouthWob(x,X(76),Y(94),X(76),Y(135),4,.5,30);x.strokeStyle='rgba(95,72,40,.4)';x.lineWidth=.3;for(let cy=94;cy<135;cy+=.7){x.beginPath();x.moveTo(X(73),Y(cy));x.lineTo(X(76),Y(cy));x.stroke()}
    x.strokeStyle='rgba(201,162,39,.6)';x.lineWidth=.35;x.setLineDash([2,2.2]);x.beginPath();x.moveTo(X(74.5),Y(94));x.lineTo(X(74.5),Y(135));x.stroke();x.setLineDash([]);x.restore();
    // the gate square: an inlaid pale plaza, a ring and a cross of darker stone
    x.save();x.strokeStyle='rgba(120,100,70,.7)';x.lineWidth=.5;x.strokeRect(X(66),Y(135),17*s,9*s);
    x.strokeStyle='rgba(160,130,70,.8)';x.lineWidth=.7;x.beginPath();x.arc(X(74.5),Y(138.5),s*3.2,0,6.3);x.stroke();x.lineWidth=.35;x.beginPath();x.arc(X(74.5),Y(138.5),s*2.5,0,6.3);x.stroke();
    x.strokeStyle='rgba(130,105,70,.6)';x.lineWidth=.4;x.beginPath();x.moveTo(X(74.5),Y(135.6));x.lineTo(X(74.5),Y(142.4));x.moveTo(X(71),Y(139));x.lineTo(X(78),Y(139));x.stroke();x.restore();
    // gatehouse: the wall block, two round towers with battlements, the arch and the portcullis
    const gl=X(66.5),gr=X(82.5),gt=Y(143.2),gb=Y(150);
    x.fillStyle='rgba(60,40,20,.3)';x.fillRect(gl+s*.4,gt+s*.4,gr-gl,gb-gt);
    x.fillStyle='#cdc2a6';x.strokeStyle=INK;x.lineWidth=.8;x.fillRect(gl,gt,gr-gl,gb-gt);x.strokeRect(gl,gt,gr-gl,gb-gt);
    x.strokeStyle='rgba(90,70,45,.45)';x.lineWidth=.3;for(let j=0;j<7;j++){const yy=gt+(j+.5)*(gb-gt)/7;x.beginPath();x.moveTo(gl,yy);x.lineTo(gr,yy);x.stroke();for(let i=0;i<14;i++){const xx=gl+(i+((j&1)?.5:0))*(gr-gl)/14;x.beginPath();x.moveTo(xx,yy);x.lineTo(xx,yy+(gb-gt)/7);x.stroke()}}
    for(const tx of [70.6,78.4]){const a=X(tx),b=Y(145.4),r=s*3.1;
      x.fillStyle='rgba(60,40,20,.3)';x.beginPath();x.arc(a+s*.35,b+s*.4,r,0,6.3);x.fill();
      x.fillStyle='#bfb496';x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();x.stroke();
      x.fillStyle='#d6ccb0';x.beginPath();x.arc(a,b,r*.76,0,6.3);x.fill();x.lineWidth=.45;x.stroke();
      for(let i=0;i<14;i++){const an=i/14*6.283;x.fillStyle='#bfb496';x.beginPath();x.arc(a+Math.cos(an)*r*.88,b+Math.sin(an)*r*.88,s*.3,0,6.3);x.fill();x.lineWidth=.3;x.stroke()}
      x.strokeStyle='rgba(60,50,40,.5)';x.lineWidth=.3;for(let i=0;i<8;i++){const an=i*.785;x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.cos(an)*r*.76,b+Math.sin(an)*r*.76);x.stroke()}
      for(let i=0;i<10;i++){x.fillStyle=i%2?'#6d7a8d':'#8794a6';x.beginPath();x.moveTo(a,b);x.arc(a,b,r*.66,i*.6283,(i+1)*.6283);x.closePath();x.fill()}x.strokeStyle=INK;x.lineWidth=.35;x.beginPath();x.arc(a,b,r*.66,0,6.3);x.stroke();
      x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a,b,.8,0,6.3);x.fill();x.stroke();mpOhSouthFlag(x,a+r*.55,b-r*.55,.7,MPL.VERM)}
    const pl=X(72.9),pr=X(76.1);
    x.fillStyle='#2a1c12';x.fillRect(pl,Y(143.2),pr-pl,gb-Y(143.2));
    x.fillStyle='#5a4a38';x.fillRect(pl,Y(143.2),pr-pl,s*.5);
    x.strokeStyle='#8a8478';x.lineWidth=.55;x.beginPath();for(let i=0;i<=6;i++){const xx=pl+(i/6)*(pr-pl);x.moveTo(xx,Y(143.5));x.lineTo(xx,Y(147.6))}for(let j=0;j<5;j++){const yy=Y(143.8+j*.8);x.moveTo(pl,yy);x.lineTo(pr,yy)}x.stroke();
    x.fillStyle='#6a6a72';for(let i=0;i<=6;i++){const xx=pl+(i/6)*(pr-pl);x.beginPath();x.moveTo(xx-.6,Y(147.6));x.lineTo(xx,Y(148.2));x.lineTo(xx+.6,Y(147.6));x.closePath();x.fill()}
    x.strokeStyle=MPL.GOLD;x.lineWidth=.7;x.beginPath();x.moveTo(pl-.5,Y(143.2));x.lineTo(pl-.5,gb);x.moveTo(pr+.5,Y(143.2));x.lineTo(pr+.5,gb);x.stroke();
    // the road runs on out through the gate
    x.fillStyle=MPOHS_GROUND[0];x.fillRect(pl,Y(143),pr-pl,.01)}
  /* ---------- names ---------- */
  const lab=(t,cx,cy,sz,col,font)=>api.text(x,t,X(cx),Y(cy),sz,col||INK,'center',font);
  const names=(L.mapNames||[]).filter(m=>m.y>=95);
  for(const m of names){
    if(m.t==='Garrison Quarter')lab('GARRISON QUARTER',m.x,103.6,6.2,'#274a9a');
    else if(m.t==='Smiths Quarter')lab('SMITHS QUARTER',m.x+1,103.6,6.2,'#8a2a14');
    else if(m.t==="King's Road")lab("King's Road",m.x,m.y,6.6,'#5a3a1c');
    else if(m.t==='Portcullis Gate')lab('Portcullis Gate',m.x,m.y+.2,6.8,'#2a1a0c');
    else if(m.k==='place'||m.k==='lane')lab(m.t,m.x,m.y,6.2)}
  lab('Parade Ground',25.5,112.9,4.2,'#5a3a1c');lab('Drill Yard',25.5,125.9,4.4,'#5a3a1c');lab('Archery Butts',40,127.2,4.2,'#5a3a1c');lab('Barracks',12.5,111.1,4.6,'#2a3a66');
  lab('Great Forge',123,109.5,4.4,'#8a2a14');lab('Foundry',108,108.7,4.4,'#8a2a14');lab('Ore Yard',123,126.6,4.4,'#8a2a14');
  for(const d of dec){if(/^sign_/.test(d.k)&&d.txt&&d.y>=95){const nm=d.txt[0].replace(/(\w)(\w*)/g,(m,a,b)=>a+b.toLowerCase()).replace(/'S/,"'s");
    if(d.k==='sign_oh_sergeant')lab('Garrison Hall',d.x-1,118.9,4.4,'#274a9a');else lab(nm,d.x+(d.k==='sign_oh_cookshop'?1.5:0),d.y+(d.k==='sign_oh_cookshop'?3.7:d.y<100?-1.9:1.9),4.2,'#5a3a1c')}}
}
MPOH.push({order:14,name:'south',paint(x,L,api,fit){mpOhSouthPaint(x,L,api,fit)}});
