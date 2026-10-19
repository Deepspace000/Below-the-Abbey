/* ==========================================================================
   OLDHAVEN QUAY: the hand-drawn parchment map of the harbour approach (level 304, 80 x 70). Drawn from the real level and its data: the great wall and gate
   with the castle behind, the paved quay, six buildings (taken from OQ_HOUSES), the fish market stalls, five timber piers (OQ_PIERS), moored ships, boats, cranes,
   barrels, bales, lamps, flags, the sea with waves and gulls, and the named places from the level's mapNames.
   ========================================================================== */
/* a roof seen from above: shadow, wall rim, two slopes, shingle rows, ridge, chimney */
function mpOhQuayRoof(x,a,b,c,d,col,o){
  o=o||{};const w=c-a,h=d-b,horiz=w>=h,H=hash2;x.save();
  x.fillStyle='rgba(40,26,12,.32)';x.fillRect(a+1.8,b+1.8,w,h);
  x.fillStyle='#eadfc2';x.strokeStyle=MPL.INK;x.lineWidth=.9;x.fillRect(a-.7,b-.7,w+1.4,h+1.4);x.strokeRect(a-.7,b-.7,w+1.4,h+1.4);
  const ra=a+.9,rb=b+.9,rc=c-.9,rd=d-.9,rw=rc-ra,rh=rd-rb;
  x.fillStyle=col;x.fillRect(ra,rb,rw,rh);
  x.fillStyle='rgba(255,240,200,.28)';if(horiz)x.fillRect(ra,rb,rw,rh/2);else x.fillRect(ra,rb,rw/2,rh);
  x.fillStyle='rgba(30,16,10,.26)';if(horiz)x.fillRect(ra,rb+rh/2,rw,rh/2);else x.fillRect(ra+rw/2,rb,rw/2,rh);
  x.strokeStyle='rgba(30,16,10,.42)';x.lineWidth=.5;x.beginPath();
  if(horiz){for(let yy=rb+1.8,r=0;yy<rd;yy+=1.9,r++){x.moveTo(ra,yy);x.lineTo(rc,yy);for(let xx=ra+(r%2)*1.4;xx<rc;xx+=2.8){x.moveTo(xx,yy);x.lineTo(xx,yy+1.9)}}}
  else{for(let xx=ra+1.8,r=0;xx<rc;xx+=1.9,r++){x.moveTo(xx,rb);x.lineTo(xx,rd);for(let yy=rb+(r%2)*1.4;yy<rd;yy+=2.8){x.moveTo(xx,yy);x.lineTo(xx+1.9,yy)}}}
  x.stroke();
  for(let i=0;i<Math.round(rw*rh/40);i++){x.fillStyle=H(i,a*7+b,91)<.5?'rgba(255,235,190,.3)':'rgba(20,10,6,.2)';x.fillRect(ra+H(i,1,92+a)*rw,rb+H(i,2,93+b)*rh,2.4,1.5)}
  x.strokeStyle=o.ridge||MPL.INK;x.lineWidth=1.4;x.beginPath();if(horiz){x.moveTo(ra-.4,rb+rh/2);x.lineTo(rc+.4,rb+rh/2)}else{x.moveTo(ra+rw/2,rb-.4);x.lineTo(ra+rw/2,rd+.4)}x.stroke();
  x.strokeStyle=MPL.INK;x.lineWidth=.9;x.strokeRect(ra,rb,rw,rh);
  for(const f of (o.chims||[.3,.72])){const cx=horiz?ra+rw*f:ra+rw*.3,cy=horiz?rb+rh*.24:rb+rh*f;x.fillStyle='#b8a888';x.fillRect(cx-1.5,cy-1.5,3,3);x.strokeRect(cx-1.5,cy-1.5,3,3);x.fillStyle=MPL.INK;x.fillRect(cx-.6,cy-.6,1.2,1.2);
    x.strokeStyle='rgba(90,80,70,.5)';x.lineWidth=.7;x.beginPath();x.moveTo(cx,cy-2);x.bezierCurveTo(cx-2.5,cy-4,cx+2.5,cy-5,cx,cy-8);x.stroke()}
  x.restore()}
/* a round tower from above: shadow, stone ring with battlements, a roof of eight sections, a gold finial */
function mpOhQuayTower(x,a,b,r,col){
  x.save();x.fillStyle='rgba(40,26,12,.3)';x.beginPath();x.arc(a+1.5,b+1.5,r,0,6.3);x.fill();
  x.fillStyle='#cfc6ae';x.strokeStyle=MPL.INK;x.lineWidth=.9;x.beginPath();x.arc(a,b,r,0,6.3);x.fill();x.stroke();
  x.setLineDash([1.4,1.2]);x.lineWidth=1.1;x.beginPath();x.arc(a,b,r-.9,0,6.3);x.stroke();x.setLineDash([]);
  const q=r*.7;x.fillStyle=col;x.lineWidth=.8;x.beginPath();x.arc(a,b,q,0,6.3);x.fill();x.stroke();
  for(let k=0;k<8;k++){const an=k*Math.PI/4;x.fillStyle=k%2?'rgba(30,16,10,.22)':'rgba(255,240,200,.25)';x.beginPath();x.moveTo(a,b);x.arc(a,b,q,an,an+Math.PI/4);x.closePath();x.fill();x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.cos(an)*q,b+Math.sin(an)*q);x.stroke()}
  x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(a,b,1,0,6.3);x.fill();x.stroke();x.restore()}
/* a ship from above, bow up (dir 1) or down (-1), rotated by rot: hull, planked deck, rails with shields, stern cabin, masts with square sails, pennants, bowsprit */
function mpOhQuayShip(x,a,b,len,wid,o){
  o=o||{};const L=len/2,w=wid/2,H=hash2,sd=o.seed||1;x.save();x.translate(a,b);if(o.rot)x.rotate(o.rot);if(o.dir<0)x.scale(1,-1);
  const hp=(k,ax,ay)=>{ax=ax||0;ay=ay||0;x.beginPath();x.moveTo(ax,ay-L*k);x.bezierCurveTo(ax+w*1.15*k,ay-L*.5*k,ax+w*k,ay+L*.5*k,ax+w*.7*k,ay+L*k);x.lineTo(ax-w*.7*k,ay+L*k);x.bezierCurveTo(ax-w*k,ay+L*.5*k,ax-w*1.15*k,ay-L*.5*k,ax,ay-L*k);x.closePath()};
  // the shadow and a ring of white water round the hull
  x.fillStyle='rgba(10,40,70,.3)';hp(1.04,1.6,1.6);x.fill();
  x.strokeStyle='rgba(250,250,240,.75)';x.lineWidth=1.1;hp(1.1);x.stroke();
  x.fillStyle=o.hull||'#6a4426';x.strokeStyle=MPL.INK;x.lineWidth=.9;hp(1);x.fill();x.stroke();
  x.fillStyle=o.deck||'#c9a06a';hp(.8);x.fill();x.lineWidth=.6;x.stroke();
  x.save();hp(.8);x.clip();x.strokeStyle='rgba(80,50,20,.55)';x.lineWidth=.4;x.beginPath();for(let y=-L;y<L;y+=1.5){x.moveTo(-w*1.3,y);x.lineTo(w*1.3,y)}x.stroke();
  x.beginPath();x.moveTo(0,-L);x.lineTo(0,L);x.strokeStyle='rgba(80,50,20,.35)';x.stroke();x.restore();
  // shields along the rails
  const sh=[MPL.VERM,MPL.LAPIS,'#efe6cf',MPL.GOLD];for(let i=0;i<7;i++){const t=-.55+i*.17,wy=t*L,wx=w*(.86-Math.abs(t)*.25);for(const sg of [-1,1]){x.fillStyle=sh[(i+(sg>0?1:0)+sd)%4];x.strokeStyle=MPL.INK;x.lineWidth=.4;x.beginPath();x.arc(sg*wx*1.02,wy,.95,0,6.3);x.fill();x.stroke()}}
  // the stern cabin and a bowsprit
  x.fillStyle=o.cabin||'#8a5a30';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(-w*.55,L*.52,w*1.1,L*.36);x.strokeRect(-w*.55,L*.52,w*1.1,L*.36);x.beginPath();x.moveTo(-w*.55,L*.7);x.lineTo(w*.55,L*.7);x.stroke();
  x.strokeStyle='#3a2210';x.lineWidth=1.2;x.beginPath();x.moveTo(0,-L);x.lineTo(0,-L*1.2);x.stroke();
  // masts and square sails
  const ms=o.masts||2,ys=ms===3?[-.45,-.05,.32]:ms===1?[-.1]:[-.38,.08];
  ys.forEach((t,i)=>{const my=t*L,sw=w*(1.55-i*.08),th=1.7+L*.05;
    x.fillStyle='#efe6cf';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(-sw,my-th*.3);x.quadraticCurveTo(0,my-th*1.35,sw,my-th*.3);x.lineTo(sw,my+th*.5);x.quadraticCurveTo(0,my+th*1.45,-sw,my+th*.5);x.closePath();x.fill();x.stroke();
    x.fillStyle=o.stripe||MPL.VERM;x.beginPath();x.moveTo(-sw*.9,my-.2);x.quadraticCurveTo(0,my-th*.55,sw*.9,my-.2);x.lineTo(sw*.9,my+th*.35);x.quadraticCurveTo(0,my+th*.9,-sw*.9,my+th*.35);x.closePath();x.fill();
    x.strokeStyle='rgba(40,28,16,.45)';x.lineWidth=.4;x.beginPath();x.moveTo(-sw*.4,my-th*.8);x.lineTo(-sw*.4,my+th*.9);x.moveTo(sw*.4,my-th*.8);x.lineTo(sw*.4,my+th*.9);x.stroke();
    x.fillStyle='#4a2c14';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.arc(0,my,1,0,6.3);x.fill();x.stroke()});
  // pennants flying from the masthead and the stern
  const fl=o.flag||MPL.LAPIS;for(const [py,pl] of [[ys[0]*L-.3,5.4],[L*.9,4.2]]){x.fillStyle=fl;x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.moveTo(0,py);x.lineTo(pl,py+.8);x.lineTo(0,py+2);x.closePath();x.fill();x.stroke();x.fillStyle='#efe6cf';x.beginPath();x.moveTo(0,py+.2);x.lineTo(pl*.5,py+.6);x.lineTo(0,py+1);x.fill()}
  x.restore()}
/* a small boat, rowing boat or fishing boat from above, with oars or a net heap */
function mpOhQuayBoat(x,a,b,rot,kind,seed){
  const H=hash2;x.save();x.translate(a,b);x.rotate(rot);const col=['#8a5a30','#a8442e','#3a5a8a','#6a7a4a'][(H(seed,1,3)*4)|0];
  x.fillStyle='rgba(10,40,70,.3)';x.beginPath();x.ellipse(1.1,1.1,4,1.9,0,0,6.3);x.fill();
  x.strokeStyle='rgba(250,250,240,.7)';x.lineWidth=.8;x.beginPath();x.ellipse(0,0,4.7,2.4,0,0,6.3);x.stroke();
  x.fillStyle=col;x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.moveTo(-4.2,0);x.quadraticCurveTo(0,-3.4,4.2,0);x.quadraticCurveTo(0,3.4,-4.2,0);x.fill();x.stroke();
  x.fillStyle='#c9a06a';x.beginPath();x.moveTo(-3,0);x.quadraticCurveTo(0,-2,3,0);x.quadraticCurveTo(0,2,-3,0);x.fill();
  x.strokeStyle='#5a3a1c';x.lineWidth=.4;x.beginPath();x.moveTo(-1,-1.5);x.lineTo(-1,1.5);x.moveTo(1,-1.5);x.lineTo(1,1.5);x.stroke();
  if(kind==='row'){x.strokeStyle='#5a3a1c';x.lineWidth=.7;x.beginPath();x.moveTo(-.4,-1.4);x.lineTo(-2,-4.2);x.moveTo(-.4,1.4);x.lineTo(-2,4.2);x.stroke()}
  else{x.fillStyle='rgba(70,60,40,.8)';x.beginPath();x.ellipse(1.2,0,1.3,.9,0,0,6.3);x.fill();x.fillStyle=MPL.VERM;x.beginPath();x.arc(-2.2,0,.5,0,6.3);x.fill()}
  x.restore()}
/* a quayside crane: timber base with a treadwheel, a long jib over the water and a crate on a rope */
function mpOhQuayCrane(x,a,b,ang){
  x.save();x.translate(a,b);x.fillStyle='rgba(40,26,12,.3)';x.fillRect(-3,-3,7,7);
  x.fillStyle='#a8794a';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(-3.4,-3.4,6.8,6.8);x.strokeRect(-3.4,-3.4,6.8,6.8);
  x.fillStyle='#8a5a30';x.beginPath();x.arc(0,0,2.6,0,6.3);x.fill();x.stroke();x.lineWidth=.5;x.beginPath();for(let k=0;k<6;k++){x.moveTo(0,0);x.lineTo(Math.cos(k*1.047)*2.6,Math.sin(k*1.047)*2.6)}x.stroke();
  x.rotate(ang);x.strokeStyle='#4a2c14';x.lineWidth=2;x.beginPath();x.moveTo(0,0);x.lineTo(15,0);x.stroke();x.strokeStyle='#c8a060';x.lineWidth=.7;x.beginPath();x.moveTo(0,-.3);x.lineTo(15,-.3);x.stroke();
  x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.moveTo(3,0);x.lineTo(9,-2.2);x.lineTo(15,0);x.moveTo(3,0);x.lineTo(9,2.2);x.lineTo(15,0);x.stroke();
  x.strokeStyle='#5a3a1c';x.lineWidth=.5;x.beginPath();x.moveTo(15,0);x.lineTo(15,2.6);x.stroke();x.fillStyle='#b8884a';x.strokeStyle=MPL.INK;x.fillRect(13.4,2.4,3.2,3.2);x.strokeRect(13.4,2.4,3.2,3.2);
  x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(15,0,.9,0,6.3);x.fill();x.stroke();x.restore()}
/* a fish stall from above: striped awning, a counter with fish on a tray */
function mpOhQuayStall(x,a,b,c1,c2){
  x.save();x.fillStyle='rgba(40,26,12,.3)';x.fillRect(a-5.4,b-3.2,12,8);
  x.fillStyle='#8a5a30';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillRect(a-6,b-4,12,8);x.strokeRect(a-6,b-4,12,8);
  for(let i=0;i<6;i++){x.fillStyle=i%2?'#efe6cf':c1;x.fillRect(a-6+i*2,b-4,2,5.2)}x.strokeRect(a-6,b-4,12,5.2);
  x.fillStyle=c2||MPL.GOLD;x.beginPath();for(let i=0;i<6;i++){x.moveTo(a-6+i*2,b+1.2);x.lineTo(a-5+i*2,b+2.6);x.lineTo(a-4+i*2,b+1.2)}x.fill();
  x.fillStyle='#bcc8d0';x.strokeStyle=MPL.INK;x.lineWidth=.4;for(let i=0;i<3;i++){x.beginPath();x.ellipse(a-3+i*3,b+3,1.1,.45,0,0,6.3);x.fill();x.stroke()}x.restore()}
/* small goods: a barrel, a crate, a sack, a bale, a basket, a net heap, a rope coil */
function mpOhQuayGood(x,k,a,b){
  x.save();x.strokeStyle=MPL.INK;x.lineWidth=.5;
  if(k===0){x.fillStyle='#8a5a30';x.beginPath();x.arc(a,b,1.8,0,6.3);x.fill();x.stroke();x.strokeStyle='rgba(30,16,10,.6)';x.beginPath();x.arc(a,b,.9,0,6.3);x.stroke()}
  else if(k===1){x.fillStyle='#b8884a';x.fillRect(a-1.7,b-1.7,3.4,3.4);x.strokeRect(a-1.7,b-1.7,3.4,3.4);x.beginPath();x.moveTo(a-1.7,b-1.7);x.lineTo(a+1.7,b+1.7);x.stroke()}
  else if(k===2){x.fillStyle='#e0d4b0';x.beginPath();x.ellipse(a,b,1.9,1.3,.3,0,6.3);x.fill();x.stroke()}
  else if(k===3){x.fillStyle='#e8dcc0';x.fillRect(a-2.2,b-1.5,4.4,3);x.strokeRect(a-2.2,b-1.5,4.4,3);x.strokeStyle=MPL.VERM;x.beginPath();x.moveTo(a-.7,b-1.5);x.lineTo(a-.7,b+1.5);x.moveTo(a+.7,b-1.5);x.lineTo(a+.7,b+1.5);x.stroke()}
  else if(k===4){x.fillStyle='#c8a060';x.beginPath();x.arc(a,b,1.6,0,6.3);x.fill();x.stroke();x.fillStyle='#a8b8c0';x.beginPath();x.ellipse(a,b,.9,.5,0,0,6.3);x.fill()}
  else if(k===5){x.fillStyle='rgba(150,130,90,.7)';x.beginPath();x.ellipse(a,b,2.4,1.5,.2,0,6.3);x.fill();x.strokeStyle='rgba(60,44,24,.8)';x.lineWidth=.4;x.beginPath();for(let i=-2;i<=2;i++){x.moveTo(a+i*.8,b-1.4);x.lineTo(a+i*.8,b+1.4)}x.stroke()}
  else{x.strokeStyle='#8a6a3a';x.lineWidth=.7;x.beginPath();x.arc(a,b,1.5,0,6.3);x.stroke();x.beginPath();x.arc(a,b,.7,0,6.3);x.stroke()}
  x.restore()}
/* a crowd person from above: a coloured cloak and a head; a soldier of Oldhaven has a blue and white tabard */
function mpOhQuayPerson(x,a,b,col,sold){
  x.fillStyle=sold?MPL.LAPIS:col;x.strokeStyle=MPL.INK;x.lineWidth=.45;x.beginPath();x.ellipse(a,b,1.5,1.1,0,0,6.3);x.fill();x.stroke();
  if(sold){x.fillStyle='#efe6cf';x.fillRect(a-.3,b-1,.6,2)}
  x.fillStyle='#e0b890';x.beginPath();x.arc(a,b-.1,.75,0,6.3);x.fill();x.stroke()}
/* a pennant on a pole, blue and white for Oldhaven */
function mpOhQuayPennant(x,a,b,len,lap){
  x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(a,b);x.lineTo(a,b-len*.9);x.stroke();
  x.fillStyle=lap?MPL.LAPIS:MPL.VERM;x.lineWidth=.4;x.beginPath();x.moveTo(a,b-len*.9);x.lineTo(a+len*.8,b-len*.72);x.lineTo(a,b-len*.5);x.closePath();x.fill();x.stroke();
  x.fillStyle='#efe6cf';x.beginPath();x.moveTo(a,b-len*.78);x.lineTo(a+len*.4,b-len*.7);x.lineTo(a,b-len*.62);x.closePath();x.fill();
  x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(a,b,.6,0,6.3);x.fill()}

mplInstall({name:'ohquay',levels:[304],foot:'You are the yellow arrow. The quay of Oldhaven, below the great wall.',tint:[-2,2,5],
draw(c,x,L,api){
  const W=L.rows[0].length,HT=L.rows.length,S=api.fit(W,HT),s=S.s,X=S.X,Y=S.Y,H=hash2,INK=MPL.INK;
  const SHORE=34,GX=40,PIERS=(typeof OQ_PIERS!=='undefined')?OQ_PIERS:[[10,12,54],[22,24,58],[39,41,62],[55,57,56],[68,70,50]];
  const HOUSES=(typeof OQ_HOUSES!=='undefined')?OQ_HOUSES:[];
  const T=(t,cx,cy,sz,col)=>api.text(x,t,X(cx),Y(cy),sz||6.4,col||INK,'center');
  const pierAt=(cx,cy)=>PIERS.find(p=>cx>=p[0]&&cx<=p[1]+1&&cy<=p[2]+1);
  // ---- the sea: a wash from pale turquoise at the shore to deep blue, contour lines, and waves ----
  {const g=x.createLinearGradient(0,Y(35),0,Y(70));g.addColorStop(0,'rgba(120,184,186,.85)');g.addColorStop(.35,'rgba(70,134,170,.85)');g.addColorStop(1,'rgba(34,70,128,.9)');
    x.fillStyle=g;x.fillRect(X(0),Y(35),W*s,(HT-35)*s);
    x.save();x.beginPath();x.rect(X(0),Y(35),W*s,(HT-35)*s);x.clip();
    for(let i=0;i<46;i++){x.fillStyle=i%2?'rgba(20,50,100,.13)':'rgba(220,240,240,.12)';x.beginPath();x.ellipse(X(H(i,1,5)*W),Y(35+H(i,2,5)*35),s*(3+H(i,3,5)*8),s*(1+H(i,4,5)*2.4),H(i,5,5)*.4,0,6.3);x.fill()}
    // long swell lines
    x.strokeStyle='rgba(230,248,248,.4)';x.lineWidth=.55;x.beginPath();
    for(let r=0;r<17;r++){const yy=36.5+r*2,ph=r*1.7;x.moveTo(X(0),Y(yy));for(let i=1;i<=60;i++){x.lineTo(X(i*W/60),Y(yy+Math.sin(i*.8+ph)*.28))}}x.stroke();
    // little wave marks, all over
    x.strokeStyle='rgba(235,250,250,.8)';x.lineWidth=.65;x.beginPath();
    for(let i=0;i<620;i++){const cx=H(i,1,6)*W,cy=36+H(i,2,6)*(HT-36.5);if(pierAt(cx,cy))continue;const a=X(cx),b=Y(cy),w=1.8+H(i,3,6)*1.6;x.moveTo(a-w,b);x.quadraticCurveTo(a-w/2,b-1.6,a,b);x.quadraticCurveTo(a+w/2,b+1.6,a+w,b)}x.stroke();
    x.strokeStyle='rgba(16,40,84,.35)';x.lineWidth=.5;x.beginPath();for(let i=0;i<300;i++){const cx=H(i,1,7)*W,cy=37+H(i,2,7)*(HT-38);if(pierAt(cx,cy))continue;const a=X(cx),b=Y(cy);x.moveTo(a-1.4,b+1.2);x.lineTo(a+1.4,b+1.2)}x.stroke();
    x.restore()}
  // ---- the paved quay: pale stone with courses of slabs, a darker ceremonial way from the gate to the long pier ----
  x.fillStyle='#cfc4a6';x.fillRect(X(6),Y(10),68*s,25*s);
  x.save();x.beginPath();x.rect(X(6),Y(10),68*s,25*s);x.clip();
  for(let i=0;i<90;i++){x.fillStyle=i%2?'rgba(150,126,90,.14)':'rgba(255,250,232,.2)';x.beginPath();x.ellipse(X(6+H(i,1,8)*68),Y(10+H(i,2,8)*25),s*(2+H(i,3,8)*5),s*(1+H(i,4,8)*2),H(i,5,8)*3,0,6.3);x.fill()}
  x.strokeStyle='rgba(100,82,54,.55)';x.lineWidth=.45;x.beginPath();
  for(let r=0,yy=10;yy<35;yy+=.55,r++){x.moveTo(X(6),Y(yy));x.lineTo(X(74),Y(yy));for(let xx=6+(r%2)*.7+H(r,1,9)*.5;xx<74;xx+=1.4+H(r,xx|0,9)*.6){x.moveTo(X(xx),Y(yy));x.lineTo(X(xx),Y(yy+.55))}}x.stroke();
  // the way: from the gate straight down to the long pier
  x.fillStyle='rgba(190,172,136,.7)';x.fillRect(X(GX-1.6),Y(10),5.2*s,25*s);
  x.strokeStyle=MPL.GOLD;x.lineWidth=1.1;x.beginPath();x.moveTo(X(GX-1.6),Y(10));x.lineTo(X(GX-1.6),Y(35));x.moveTo(X(GX+3.6),Y(10));x.lineTo(X(GX+3.6),Y(35));x.stroke();
  x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.moveTo(X(GX-1.35),Y(10));x.lineTo(X(GX-1.35),Y(35));x.moveTo(X(GX+3.35),Y(10));x.lineTo(X(GX+3.35),Y(35));x.stroke();
  // a gold and lapis inlay in the middle of the plaza
  {const cx=X(GX+1),cy=Y(21);x.fillStyle='rgba(240,230,196,.8)';x.strokeStyle=INK;x.lineWidth=.7;x.beginPath();x.arc(cx,cy,s*2.6,0,6.3);x.fill();x.stroke();x.strokeStyle=MPL.GOLD;x.lineWidth=1.2;x.beginPath();x.arc(cx,cy,s*2.1,0,6.3);x.stroke();
    x.fillStyle=MPL.LAPIS;for(let k=0;k<8;k++){const an=k*Math.PI/4;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(an-.2)*s*2,cy+Math.sin(an-.2)*s*2);x.lineTo(cx+Math.cos(an+.2)*s*2,cy+Math.sin(an+.2)*s*2);x.closePath();x.fill()}
    x.fillStyle=MPL.VERM;x.beginPath();x.arc(cx,cy,s*.7,0,6.3);x.fill();x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(cx,cy,s*.3,0,6.3);x.fill()}
  x.restore();
  // the quay edge: a heavy coping of dressed stone, a strip of wet sand beneath, white surf
  x.fillStyle='#e4d6a8';x.fillRect(X(6),Y(35),68*s,1.1*s);
  x.fillStyle='#bfb496';x.fillRect(X(6),Y(33.9),68*s,1.1*s);x.strokeStyle=INK;x.lineWidth=.9;x.strokeRect(X(6),Y(33.9),68*s,1.1*s);
  x.strokeStyle='rgba(60,50,36,.6)';x.lineWidth=.4;x.beginPath();for(let xx=6;xx<74;xx+=1.3+H(xx|0,1,10)*.4){x.moveTo(X(xx),Y(33.9));x.lineTo(X(xx),Y(35))}x.stroke();
  x.strokeStyle='rgba(255,255,250,.9)';x.lineWidth=1;x.beginPath();x.moveTo(X(6),Y(36.1));for(let i=1;i<=90;i++)x.lineTo(X(6+i*68/90),Y(36.1+Math.sin(i*1.3)*.18));x.stroke();
  // ---- the great wall (rows 0 to 9) and the castle standing on it: grey stonework, courses, battlements ----
  const wallBand=(a,b,c2,d)=>{x.fillStyle='#bdb298';x.fillRect(a,b,c2-a,d-b);x.strokeStyle='rgba(70,58,42,.5)';x.lineWidth=.4;x.beginPath();
    for(let yy=b,r=0;yy<d;yy+=2.5,r++){x.moveTo(a,yy);x.lineTo(c2,yy);for(let xx=a+(r%2)*3+H(r,1,11)*2;xx<c2;xx+=5+H(r,xx|0,11)*2.4){x.moveTo(xx,yy);x.lineTo(xx,Math.min(d,yy+2.5))}}x.stroke();
    for(let i=0;i<((c2-a)*(d-b)/60|0);i++){x.fillStyle=H(i,a|0,12)<.5?'rgba(255,248,226,.22)':'rgba(40,28,16,.16)';x.fillRect(a+H(i,1,13)*(c2-a),b+H(i,2,13)*(d-b),3,1.6)}};
  wallBand(X(0),Y(0),X(80),Y(10));
  // side walls down both edges of the quay
  wallBand(X(0),Y(10),X(6),Y(36));wallBand(X(74),Y(10),X(80),Y(36));
  x.strokeStyle=INK;x.lineWidth=1;x.strokeRect(X(0),Y(0),W*s,10*s);x.strokeRect(X(0),Y(10),6*s,26*s);x.strokeRect(X(74),Y(10),6*s,26*s);
  // battlements along the front of the wall and the inner faces of the side walls
  x.fillStyle='#d4cab0';x.strokeStyle=INK;x.lineWidth=.5;for(let xx=0;xx<80;xx+=.85){if(xx>GX-2&&xx<GX+2)continue;x.fillRect(X(xx),Y(9.25),s*.5,s*.75);x.strokeRect(X(xx),Y(9.25),s*.5,s*.75)}
  for(let yy=10;yy<35.6;yy+=.85){for(const [ax2,w2] of [[5.25,.75],[74,.75]]){x.fillRect(X(ax2),Y(yy),s*w2,s*.5);x.strokeRect(X(ax2),Y(yy),s*w2,s*.5)}}
  // the castle: curtain towers, the great keep and spires
  for(const [tx,ty,r,col] of [[7,6.6,1.5,MPL.VERM],[73,6.6,1.5,MPL.LAPIS],[14,5.8,2.1,MPL.LAPIS],[66,5.8,2.1,MPL.VERM],[22,4.2,1.6,'#7a8f86'],[58,4.2,1.6,'#7a8f86'],[27,6.4,1.4,MPL.GOLD],[53,6.4,1.4,MPL.GOLD],[18,2.2,1.3,MPL.VERM],[62,2.2,1.3,MPL.LAPIS]])mpOhQuayTower(x,X(tx),Y(ty),r*s,col);
  // the keep: a long hall with a battled rim, a lapis roof, gold ridge, corner turrets and a tall banner
  {const a=X(31),b=Y(.9),c2=X(49),d=Y(6.4);x.fillStyle='rgba(40,26,12,.3)';x.fillRect(a+2,b+2,c2-a,d-b);x.fillStyle='#d4cab0';x.strokeStyle=INK;x.lineWidth=1;x.fillRect(a,b,c2-a,d-b);x.strokeRect(a,b,c2-a,d-b);
    x.setLineDash([1.8,1.3]);x.lineWidth=1.3;x.strokeRect(a+1.3,b+1.3,c2-a-2.6,d-b-2.6);x.setLineDash([]);
    mpOhQuayRoof(x,a+5,b+5,c2-5,d-5,MPL.LAPIS,{ridge:MPL.GOLD,chims:[.2,.8]});
    for(const [tx,ty] of [[a,b],[c2,b],[a,d],[c2,d]])mpOhQuayTower(x,tx,ty,3.4,MPL.VERM);
    x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.moveTo(X(GX),Y(.9));x.lineTo(X(GX),Y(-.1));x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(X(GX),Y(.1));x.lineTo(X(GX)+9,Y(.1)+2.2);x.lineTo(X(GX),Y(.1)+4.4);x.closePath();x.fill();x.stroke();x.fillStyle='#efe6cf';x.beginPath();x.moveTo(X(GX),Y(.1)+1.3);x.lineTo(X(GX)+4.5,Y(.1)+2.2);x.lineTo(X(GX),Y(.1)+3.1);x.fill()}
  // the gatehouse: three squares of portcullis between two wings, round gate towers at either end
  {const a=X(GX-1.5),b=Y(8),c2=X(GX+2.5),d=Y(10);x.fillStyle='#d9cfb4';x.strokeStyle=INK;x.lineWidth=1;x.fillRect(X(GX-6),Y(8),12*s,2*s);x.strokeRect(X(GX-6),Y(8),12*s,2*s);
    x.fillStyle='#2a1a0c';x.fillRect(a,b,c2-a,d-b);x.strokeStyle=MPL.GOLD;x.lineWidth=.6;x.beginPath();for(let q=1;q<5;q++){x.moveTo(a+q*(c2-a)/5,b);x.lineTo(a+q*(c2-a)/5,d)}for(let q=1;q<3;q++){x.moveTo(a,b+q*(d-b)/3);x.lineTo(c2,b+q*(d-b)/3)}x.stroke();
    x.strokeStyle=MPL.GOLD;x.lineWidth=1.4;x.strokeRect(a,b,c2-a,d-b);
    for(const tx of [GX-6,GX+6])mpOhQuayTower(x,X(tx+(tx<GX?0:1)),Y(9.2),2.3*s,MPL.LAPIS);
    for(const tx of [GX-6,GX+7]){mpOhQuayPennant(x,X(tx),Y(8.6),9,1)}}
  // the corner towers where the side walls meet the sea
  mpOhQuayTower(x,X(3),Y(34.6),2.2*s,MPL.VERM);mpOhQuayTower(x,X(77),Y(34.6),2.2*s,MPL.LAPIS);mpOhQuayTower(x,X(3),Y(11),1.6*s,MPL.GOLD);mpOhQuayTower(x,X(77),Y(11),1.6*s,MPL.GOLD);
  // ---- the five timber piers: planks, edge beams, pilings, mooring posts ----
  PIERS.forEach(([x0,x1,y1],pi)=>{
    const a=X(x0),b=Y(35),c2=X(x1+1),d=Y(y1+1);
    x.fillStyle='rgba(10,40,70,.3)';x.fillRect(a+1.8,b+1.8,c2-a,d-b);
    x.fillStyle='#a8794a';x.fillRect(a,b,c2-a,d-b);
    for(let yy=b,r=0;yy<d;yy+=1.7,r++){x.fillStyle=H(r,pi,20)<.5?'rgba(255,230,170,.2)':'rgba(60,30,10,.18)';x.fillRect(a,yy,c2-a,1.7)}
    x.strokeStyle='rgba(50,28,10,.65)';x.lineWidth=.4;x.beginPath();for(let yy=b;yy<d;yy+=1.7){x.moveTo(a,yy);x.lineTo(c2,yy)}for(let yy=b,r=0;yy<d;yy+=1.7,r++){x.moveTo(a+(c2-a)*(.3+H(r,pi,21)*.4),yy);x.lineTo(a+(c2-a)*(.3+H(r,pi,21)*.4),yy+1.7)}x.stroke();
    x.fillStyle='#5a3a1c';x.fillRect(a-1,b,1.6,d-b);x.fillRect(c2-.6,b,1.6,d-b);x.strokeStyle=INK;x.lineWidth=.8;x.strokeRect(a,b,c2-a,d-b);
    x.fillStyle='#4a2c14';x.beginPath();for(let yy=b+3;yy<d;yy+=6.5){x.moveTo(a-1,yy);x.arc(a-1,yy,1.5,0,6.3);x.moveTo(c2+1,yy);x.arc(c2+1,yy,1.5,0,6.3)}x.fill();
    x.fillStyle='#4a2c14';x.fillRect(a-1.5,d-1.2,c2-a+3,2.4);x.strokeRect(a-1.5,d-1.2,c2-a+3,2.4);
    x.strokeStyle='rgba(255,255,250,.65)';x.lineWidth=.7;x.beginPath();x.moveTo(a-2.4,b+1);x.lineTo(a-2.4,d+1);x.moveTo(c2+2.4,b+1);x.lineTo(c2+2.4,d+1);x.stroke()});
  // goods on the piers
  PIERS.forEach(([x0,x1,y1],pi)=>{for(let yy=38.5,q=0;yy<y1-1;yy+=3.4,q++){const side=H(pi,q,22)<.5,cx=side?x0+.45:x1+.55,k=(H(pi,q,23)*7)|0;if(H(pi,q,24)<.28)continue;mpOhQuayGood(x,k,X(cx),Y(yy));if(H(pi,q,25)<.4)mpOhQuayGood(x,(k+3)%7,X(cx+(side?.5:-.5)),Y(yy+.9))}});
  // ---- ships moored between the piers, the boats, and mooring lines ----
  const SH=[[17,51,1,0],[31,55,1,1],[47,52,1,0],[63,46,.9,1],[76,57,.8,0],[6,60,.85,1],[16,66,.8,0],[55,67,.8,1],[70,63,.85,0],[26,66,.7,1]];
  const hulls=['#6a4426','#4a3220','#7a5030','#5a3a24'],stripes=[MPL.VERM,MPL.LAPIS,MPL.GOLD,'#3a7a5a'],flags=[MPL.LAPIS,MPL.VERM,MPL.GOLD,'#3a7a5a'];
  // boats first, so the ships overlap them
  for(const [bx,by,k] of [[8,45,'f'],[14,42,'r'],[19,44,'f'],[27,44,'r'],[33,46,'r'],[45,41,'f'],[51,45,'r'],[60,41,'r'],[65,52,'f'],[73,45,'r'],[36,50,'f'],[43,58,'r'],[13,37,'r'],[29,38,'f'],[53,38,'r'],[66,39,'f']])mpOhQuayBoat(x,X(bx),Y(by),(H(bx,by,30)-.5)*1.4+(k==='r'?1.2:0),k==='r'?'row':'fish',bx*3+by);
  // mooring lines
  x.strokeStyle='rgba(90,64,34,.9)';x.lineWidth=.55;x.beginPath();
  for(const [cx,cy,sc,pr] of SH){if(cy>60)continue;const half=1.3*sc;for(const off of [-1.4,1.6]){const py=cy+off*sc*1.2,l=PIERS.filter(p=>p[1]+1<=cx&&p[2]+1>=py).sort((a,b)=>b[1]-a[1])[0],r=PIERS.filter(p=>p[0]>=cx&&p[2]+1>=py).sort((a,b)=>a[0]-b[0])[0];
    if(l&&cx-(l[1]+1)<10){x.moveTo(X(l[1]+1),Y(py));x.quadraticCurveTo(X(cx-half-.5),Y(py+.8),X(cx-half),Y(py))}if(r&&r[0]-cx<10){x.moveTo(X(r[0]),Y(py));x.quadraticCurveTo(X(cx+half+.5),Y(py+.8),X(cx+half),Y(py))}}}x.stroke();
  SH.forEach(([cx,cy,sc,v],i)=>{mpOhQuayShip(x,X(cx),Y(cy),7.6*sc*s,2.6*sc*s,{rot:cy>=60?(i%2?Math.PI/2:-Math.PI/2):0,dir:i%3===0?-1:1,hull:hulls[i%4],stripe:stripes[i%4],flag:flags[(i+1)%4],masts:i%4===3?3:2,seed:i,cabin:i%2?'#6a3a24':'#8a5a30'})});
  // the Dawn Walker: the largest ship, gold and vermilion, tied at the end of the long pier
  mpOhQuayShip(x,X(GX+.5),Y(65),7.4*s,3.3*s,{dir:-1,hull:'#3a2a1c',deck:'#d8b878',stripe:MPL.GOLD,flag:MPL.VERM,masts:3,cabin:'#a8342a',seed:2});
  // ---- the buildings (from the level data): roofs, doors, signs ----
  const ROOFS=[['#c2652e',{ridge:MPL.GOLD}],['#6a7a8a',{ridge:'#3a4a5a'}],[MPL.VERM,{ridge:MPL.GOLD2}],['#3f5fa8',{ridge:MPL.GOLD}],['#8a8a7a',{ridge:'#4a4a3a'}],['#3a7a5a',{ridge:MPL.GOLD2}]];
  HOUSES.forEach((b,k)=>{const [col,o]=ROOFS[k%6];mpOhQuayRoof(x,X(b.x0)+.6,Y(b.y0)+.6,X(b.x1+1)-.6,Y(b.y1+1)-.6,col,o);
    const dx=b.face==='E'?X(b.x1+1)-1.4:X(b.x0)-1.4,dy=Y(b.door[1]);x.fillStyle='#3a2210';x.fillRect(dx,dy,2.8,s);x.strokeStyle=INK;x.lineWidth=.5;x.strokeRect(dx,dy,2.8,s);
    // a hanging sign by the door
    const sx=b.face==='E'?X(b.x1+1)+1.8:X(b.x0)-1.8,sy=Y(b.door[1])-s*.3;x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.moveTo(sx-1.8,sy);x.lineTo(sx+1.8,sy);x.stroke();x.fillStyle=b.room==='inn'?MPL.GOLD:b.room==='hall'?MPL.LAPIS:MPL.VERM;x.fillRect(sx-1.2,sy+.4,2.4,2.8);x.strokeRect(sx-1.2,sy+.4,2.4,2.8);
    if(b.tower){const tx=X((b.x0+b.x1+1)/2+2),ty=Y(b.y0+2);mpOhQuayTower(x,tx,ty,s*1.5,MPL.LAPIS);mpOhQuayPennant(x,tx,ty-s*1.2,8,1)}});
  // ---- the fish market: four stalls with crates, baskets, barrels, nets, and a drying rack ----
  const STALLS=[[26,13,MPL.VERM],[26,19,MPL.LAPIS],[26,25,'#3a7a5a'],[54,18,MPL.GOLD]];
  for(const [sx,sy,col] of STALLS){mpOhQuayStall(x,X(sx+.5),Y(sy+.5),col,MPL.GOLD);for(const [dx,dy,k] of [[-2,0,1],[-2,1,4],[2,1,0],[0,2,5]])mpOhQuayGood(x,k,X(sx+.5+dx),Y(sy+.5+dy))}
  // drying racks of fish
  for(const [rx,ry] of [[29,15.2],[29,21.6],[29,27.6]]){x.strokeStyle='#5a3a1c';x.lineWidth=.9;x.beginPath();x.moveTo(X(rx),Y(ry));x.lineTo(X(rx+2.6),Y(ry));x.stroke();x.fillStyle='#b8c4cc';x.strokeStyle=INK;x.lineWidth=.35;for(let q=0;q<5;q++){x.beginPath();x.ellipse(X(rx+.3+q*.5),Y(ry+.4),.55,1.2,0,0,6.3);x.fill();x.stroke()}}
  // barrels, crates and sacks along the foot of the wall and the sides of the buildings
  for(let xx=21;xx<=58;xx++){if(Math.abs(xx-GX)<=10||H(xx,1,90)<.25)continue;mpOhQuayGood(x,[1,3,0,2,1,3,0][(H(xx,2,90)*7)|0],X(xx+.5),Y(10.6))}
  for(const b of HOUSES){const fx=b.face==='E'?b.x1+1.5:b.x0-.5,ym=(b.y0+b.y1)>>1;for(let yy=b.y0;yy<=b.y1;yy++){if(Math.abs(yy-ym)<=2||H(b.x0,yy,91)<.3)continue;mpOhQuayGood(x,(H(fx,yy,92)*7)|0,X(fx),Y(yy+.5))}}
  // a great pile of cargo at the quay edge and a few bollards
  for(const bx of [GX-4,GX+4,12,20,28,52,62,70]){x.fillStyle='#4a3a2a';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(X(bx+.5),Y(33.5),1.3,0,6.3);x.fill();x.stroke()}
  for(const [gx,gy] of [[46,32.5],[47,33.4],[48,32.6],[22,33],[23,33.6],[55,33],[56,33.6],[57,32.8],[34,32.6],[35,33.4]])mpOhQuayGood(x,((gx*3+gy)|0)%7,X(gx),Y(gy));
  // ---- cranes at the quay edge ----
  for(const [cx,ang] of [[16,1.75],[30,1.45],[50,1.7],[63,1.4]])mpOhQuayCrane(x,X(cx),Y(32.9),ang);
  // ---- lamps: gold lanterns on iron posts ----
  const lamps=[];for(let xx=23;xx<=57;xx+=5)lamps.push([xx,SHORE]);lamps.push([GX-3,11],[GX+3,11]);for(let xx=24;xx<=56;xx+=8){lamps.push([xx,12],[xx,31])}for(let yy=14;yy<=30;yy+=8)lamps.push([22,yy],[58,yy]);
  for(const [x0,x1,y1] of PIERS)for(let yy=SHORE+4;yy<=y1-1;yy+=7)lamps.push([x0,yy],[x1,yy]);
  for(const [lx,ly] of lamps){const a=X(lx+.5),b=Y(ly+.5);x.fillStyle='rgba(255,230,140,.35)';x.beginPath();x.arc(a,b,3,0,6.3);x.fill();x.fillStyle=MPL.GOLD2;x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.arc(a,b,1,0,6.3);x.fill();x.stroke()}
  // ---- people: the crowd round the stalls, soldiers in squads, workers on the piers ----
  const cloaks=['#8a4a2e','#4a6a8a','#6a7a4a','#a89040','#7a4a6a','#9a7a5a','#c8402e'];
  for(const [sx,sy] of STALLS)for(let q=0;q<9;q++){const an=H(sx,sy+q,81)*6.3,r=1.6+H(sx,sy+q,82)*3.8;mpOhQuayPerson(x,X(sx+.5+Math.cos(an)*r),Y(sy+3+Math.sin(an)*r*.8),cloaks[(H(sx,q,83)*7)|0])}
  for(let q=0;q<28;q++){const px=23+H(q,1,84)*36,py=11+H(q,2,84)*22;mpOhQuayPerson(x,X(px),Y(py),cloaks[(H(q,3,84)*7)|0],H(q,4,84)<.3)}
  for(const [sx,sy,n] of [[35,12,3],[44,12,3],[28,SHORE-1,2],[52,SHORE-1,2],[33,22,3],[47,22,3],[GX+1,SHORE+4,2],[37,11,2],[43,11,2]])for(let k=0;k<n;k++)mpOhQuayPerson(x,X(sx+(k%2)+.5),Y(sy+(k>>1)+.5),'',true);
  for(const [x0,x1,y1] of PIERS.slice(1,4))for(let q=0;q<4;q++)mpOhQuayPerson(x,X(x0+.5+(q&1)),Y(SHORE+4+q*Math.max(3,((y1-SHORE-6)/3)|0)),cloaks[(H(x0,q,85)*7)|0]);
  // a few dogs trotting on the quay
  for(const [dx,dy] of [[24,28],[56,22],[33,30],[49,15]]){x.fillStyle='#6a4a30';x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.ellipse(X(dx),Y(dy),1.5,.8,.3,0,6.3);x.fill();x.stroke();x.beginPath();x.arc(X(dx)+1.5,Y(dy)-.5,.7,0,6.3);x.fill();x.stroke()}
  // ---- pennants in the blue and white of Oldhaven: along the edge and the plaza ----
  for(let xx=22;xx<=58;xx+=6)mpOhQuayPennant(x,X(xx+.5),Y(SHORE-.5),7,(xx/6|0)%2);
  for(const [fx,fy] of [[22,11],[58,11],[22,31],[58,31],[30,10],[50,10],[GX-7,11],[GX-3,11],[GX+3,11],[GX+7,11]])mpOhQuayPennant(x,X(fx+.5),Y(fy+.5),8,(fx+fy)%2);
  for(const [x0,x1,y1] of PIERS){mpOhQuayPennant(x,X(x0+.5),Y(y1-.6),7,1);mpOhQuayPennant(x,X(x1+.5),Y(y1),7,0)}
  // ---- gulls over the harbour ----
  x.strokeStyle=INK;x.lineWidth=.8;for(let i=0;i<22;i++){const a=X(2+H(i,1,40)*76),b=Y(14+H(i,2,40)*54);if(i<5&&b<Y(36))continue;x.beginPath();x.moveTo(a-3,b-1);x.quadraticCurveTo(a-1.4,b-3,a,b);x.quadraticCurveTo(a+1.4,b-3,a+3,b-1);x.stroke()}
  // ---- names: the five named places from the data, then buildings and the sea ----
  const NM=L.mapNames||[];
  for(const m of NM){if(m.t==='The Piers'){T(m.t,m.x+4,m.y,7.4,'#3a1a0c');continue}if(m.t==='Customs House'){T(m.t,m.x,m.y+.4,6.6,MPL.LAPIS);continue}T(m.t,m.x,m.y,m.k==='lane'?6.4:7.2,m.t==='The Gate of Oldhaven'?MPL.LAPIS:'#3a2a1c')}
  T("The Fishmonger's Hall",14,13.5,5.8,'#3a1a0c');T('The Anchor and Rope',12.5,21.5,5.8,'#1a2a3a');T("The Mariners' Rest",14,28,5.8,'#3a1a0c');
  T("The Ship's Armoury",66.5,20.5,5.6,'#1a1a1a');T("The Captain's Table",65,27.5,5.8,'#1a3a2a');
  T("King's Castle",GX,7.3,5.8,'#2a1a4c');T('The City Wall',22,9.05,5.6,INK);T('The City Wall',58,9.05,5.6,INK);
  T('The Dawn Walker',48,63.6,6.4,'#3a2a1c');
  x.save();x.font=`italic bold 9px ${FTITLE||FUI}`;x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=2.6;x.strokeStyle='rgba(20,50,100,.8)';x.strokeText('The Narrow Sea',X(62),Y(66));x.fillStyle='#e6f0f0';x.fillText('The Narrow Sea',X(62),Y(66));x.restore();
  T('Fish Stalls',54,21.8,5.8,'#3a2a1c');
  // ---- margins: title, key, compass, notes ----
  api.title(x,'Oldhaven Quay','The harbour below the wall');
  api.panel(x,8,56,78,148);api.text(x,'Key',47,64,7.2,MPL.VERM,'center');
  const ky=[['Roofed hall',()=>{mpOhQuayRoof(x,12,69,25,77,MPL.VERM,{chims:[]})}],
    ['Fish stall',()=>mpOhQuayStall(x,18.5,87,MPL.VERM,MPL.GOLD)],
    ['Timber pier',()=>{x.fillStyle='#a8794a';x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(12,97,13,7);x.strokeRect(12,97,13,7);x.beginPath();for(let q=99;q<104;q+=1.7){x.moveTo(12,q);x.lineTo(25,q)}x.stroke()}],
    ['Moored ship',()=>mpOhQuayShip(x,18.5,115,15,5.2,{rot:Math.PI/2,stripe:MPL.VERM})],
    ['Rowing boat',()=>mpOhQuayBoat(x,18.5,128,0,'row',3)],
    ['Crane',()=>{x.save();x.translate(0,0);mpOhQuayCrane(x,13,141,.3);x.restore()}],
    ['Lamp, flag',()=>{x.fillStyle=MPL.GOLD2;x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.arc(14,154,1.3,0,6.3);x.fill();x.stroke();mpOhQuayPennant(x,22,157,7,1)}],
    ['Barrels, bales',()=>{mpOhQuayGood(x,0,14,168);mpOhQuayGood(x,3,21,168)}],
    ['City wall, tower',()=>{x.fillStyle='#bdb298';x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(11,178,8,6);x.strokeRect(11,178,8,6);mpOhQuayTower(x,23,181,3,MPL.LAPIS)}]];
  ky.forEach(([t,f],i)=>{x.save();f();x.restore();api.text(x,t,31,73+i*13.4,6.2,'#3a2a1c','left')});
  api.compass(x,46,236,15);
  api.panel(x,392,40,84,236);
  api.notes(x,['Oldhaven Quay is the harbour below the great wall of the city. Five timber piers run out into the sea.','Ships are moored between the piers. The Dawn Walker is tied at the end of the long middle pier.','Fishwives sell the catch from stalls on the plaza. Barrels, crates and bales are stacked at the wall.','The Customs House and the Captain\'s Table stand on the east side. The Mariners\' Rest is on the west.','The great gate is barred until noon. Speak to the herald.'],398,50,72,6.2,4);
}});
