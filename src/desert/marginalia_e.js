/* Marginalia for the area maps (see mpmgAdd in maps_common.js). Names in this file start with mpmge.
   Artist E: the Pilgrim's Path (400-423), the Hollow Grasslands (470), the Orange Spire floors (440-459). Pen and ink drolleries, drawn straight on in the map's ink. */
const mpmgeC={skin:'#ecd0a8',robe:'#8a6a44',rob2:'#6a4a2c',grey:'#b9b09e',grey2:'#9a9488',cream:'#f2e8cc',pale:'#e6e2d2',frog:'#7c9a62',frog2:'#a8c088',honey:'#e8b030',lap:'#3a56a0',vio:'#5a4a8a',wood:'#a8804c',bone:'#efe6cc',ghost:'#dfe8ee'};
function mpmgeW(a,b,s,m){return(hash2(Math.round(a*7),Math.round(b*7),s)-.5)*m}
/* a wobbly smooth path through pts; o: c closed, f fill, l line width, k line colour, s sharp corners, w wobble, sd seed */
function mpmgeP(x,pts,o){o=o||{};const w=o.w==null?.3:o.w,sd=o.sd||3,n=pts.length;const q=pts.map((p,i)=>[p[0]+mpmgeW(p[0],p[1],sd+i,w),p[1]+mpmgeW(p[1],p[0],sd+i+9,w)]);
  x.beginPath();
  if(o.s){x.moveTo(q[0][0],q[0][1]);for(let i=1;i<n;i++)x.lineTo(q[i][0],q[i][1]);if(o.c)x.closePath()}
  else if(o.c){x.moveTo((q[n-1][0]+q[0][0])/2,(q[n-1][1]+q[0][1])/2);for(let i=0;i<n;i++){const m=q[(i+1)%n];x.quadraticCurveTo(q[i][0],q[i][1],(q[i][0]+m[0])/2,(q[i][1]+m[1])/2)}x.closePath()}
  else{x.moveTo(q[0][0],q[0][1]);for(let i=1;i<n-1;i++)x.quadraticCurveTo(q[i][0],q[i][1],(q[i][0]+q[i+1][0])/2,(q[i][1]+q[i+1][1])/2);x.lineTo(q[n-1][0],q[n-1][1])}
  if(o.f){x.fillStyle=o.f;x.fill()}if(o.l!==0){x.lineWidth=o.l||.5;x.strokeStyle=o.k||MPL.INK;x.stroke()}}
function mpmgeE(x,a,b,rx,ry,f,rot,l){x.beginPath();x.ellipse(a,b,rx,ry,rot||0,0,6.3);if(f){x.fillStyle=f;x.fill()}if(l!==0){x.lineWidth=l||.5;x.strokeStyle=MPL.INK;x.stroke()}}
function mpmgeD(x,a,b,r,f){x.beginPath();x.arc(a,b,r,0,6.3);x.fillStyle=f||MPL.INK;x.fill()}
function mpmgeL(x,pts,l,k){x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.lineWidth=l||.5;x.strokeStyle=k||MPL.INK;x.stroke()}
function mpmgeEye(x,a,b,r,look){mpmgeE(x,a,b,r,r,'#fffbe8',0,.35);mpmgeD(x,a+(look||0)*r*.3,b,r*.5)}
function mpmgeHatch(x,a,b,w,h,n,sd,k){x.beginPath();for(let i=0;i<n;i++){const u=a+(i+.5)/n*w;x.moveTo(u,b);x.lineTo(u-h*.4,b+h)}x.lineWidth=.3;x.strokeStyle=k||'rgba(42,26,12,.55)';x.stroke()}
/* set up a drawing at a,b (feet / ground point) with size s, facing right (d=1) or left (d=-1) */
function mpmgeT(x,a,b,s,d,fn,arg){x.save();x.translate(a,b);x.scale((d||1)*s,s);x.lineCap='round';x.lineJoin='round';x.strokeStyle=MPL.INK;x.lineWidth=.5;fn(x,arg||{});x.restore()}
function mpmgeGround(x,a,b,w,sd){mpmgeP(x,[[a,b],[a+w*.3,b+.5],[a+w*.6,b-.4],[a+w,b]],{l:.4,sd:sd||1,w:.5});for(let i=0;i<w/5;i++){const u=a+2+i*5+mpmgeW(i,1,sd||1,2);mpmgeL(x,[[u,b],[u-.8,b-1.6]],.3);mpmgeL(x,[[u,b],[u+.8,b-1.5]],.3)}}
function mpmgeBee(x,a,b,r,rot){x.save();x.translate(a,b);x.rotate(rot||0);mpmgeE(x,-.8,-1.6,1.5*r,.9*r,'rgba(240,248,255,.85)',-.5,.25);mpmgeE(x,.8,-1.6,1.5*r,.9*r,'rgba(240,248,255,.85)',.5,.25);mpmgeE(x,0,0,2*r,1.2*r,MPL.GOLD,0,.35);x.beginPath();x.moveTo(-.5*r,-1.1*r);x.lineTo(-.5*r,1.1*r);x.moveTo(.7*r,-1.1*r);x.lineTo(.7*r,1.1*r);x.lineWidth=.45;x.strokeStyle=MPL.INK;x.stroke();x.restore()}
function mpmgeTrail(x,a,b,pts){x.save();x.setLineDash([.6,1.2]);mpmgeL(x,[[a,b]].concat(pts),.3,'rgba(42,26,12,.6)');x.restore()}

/* ---- shared creatures: each is drawn with its feet at 0,0 in a box about 24 units high, facing right ---- */
function mpmgeSnail(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-14,.4],[-4,-.6],[6,-.4],[9,-.4]],{l:.3,k:'rgba(120,150,160,.8)',w:.4});
  mpmgeP(x,[[-11,0],[-9,-1.5],[2,-2],[6,-3],[8,-6],[9,-9.5],[10.6,-9.4],[10.2,-5.5],[11.4,-2],[12.5,0]],{c:1,f:'#a9b57a',sd:5});
  mpmgeE(x,-1,-7,6,6,'#d2a864',0);x.beginPath();for(let t=0;t<13;t+=.4){const r=.4+t*.42,ang=t*.9;x.lineTo(-1+Math.cos(ang)*r*.85,-7+Math.sin(ang)*r*.85)}x.lineWidth=.45;x.strokeStyle=MPL.INK;x.stroke();
  mpmgeL(x,[[9.2,-9.2],[8.5,-13]],.4);mpmgeL(x,[[10.5,-9.2],[11.8,-12.6]],.4);mpmgeEye(x,8.5,-13.3,.9);mpmgeEye(x,11.9,-12.9,.9);mpmgeL(x,[[9.6,-6.6],[10.8,-6.2]],.3)})}
function mpmgeShell(x,a,b,r){mpmgeE(x,a,b,r,r*.9,'#f4ecd8',0,.35);for(let i=-2;i<=2;i++)mpmgeL(x,[[a,b+r*.85],[a+i*r*.38,b-r*.8]],.25)}
/* a pilgrim: hat, hood, long robe, staff. o: run (leaning, panting), shell (scallop badge), tired */
function mpmgePilgrim(x,a,b,s,d,o){mpmgeT(x,a,b,s,d,(x,o)=>{
  const lean=o.run?3:0;x.save();x.transform(1,0,-lean*.06,1,0,0);
  mpmgeL(x,[[6.6,0],[6.2,-24]],.55,'#5a3a1c');mpmgeD(x,6.2,-24.6,.9,'#8a6a3a');
  mpmgeL(x,[[-2,-3],[-3,0.2]],.5);mpmgeL(x,[[2,-3],[o.run?5:3,0.2]],.5);
  mpmgeP(x,[[-3.2,-15],[3.2,-15],[5.4,-3],[-5.4,-3]],{c:1,f:o.col||'#8a6a44',s:1,sd:7,w:.2});
  mpmgeHatch(x,-4,-9,8,5,5);
  mpmgeL(x,[[-1.5,-6],[-1.6,-4]],.25);
  mpmgeP(x,[[2.5,-13.5],[5.5,-14],[6.6,-15.5]],{l:.5,w:.1});
  mpmgeE(x,0,-17.8,2.7,2.9,mpmgeC.skin);mpmgeD(x,.8,-18,.35);mpmgeD(x,-.8,-18,.35);mpmgeL(x,[[-.6,-16.5],[.6,-16.6]],.25);
  mpmgeE(x,0,-19.6,5.6,1.2,'#5a3a24');mpmgeP(x,[[-2.8,-19.8],[-2,-23],[2,-23],[2.8,-19.8]],{c:1,f:'#5a3a24',sd:9});
  if(o.shell)mpmgeShell(x,-4.3,-21,1.9);
  if(o.run){mpmgeL(x,[[-3.6,-22],[-5.5,-23.5]],.3);mpmgeL(x,[[-3.6,-20.5],[-5.5,-20.5]],.3);mpmgeE(x,-5,-16,.5,.8,'#9ac0e0',0,.25)}
  x.restore()},o||{})}
function mpmgeDonkey(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-7.4,-9],[-10,-6],[-9.6,-2],[-10.6,0]],{l:.45});mpmgeD(x,-10.6,.4,1.1,'#6a5a4a');
  for(const [u,l] of [[-5.5,.4],[-3.6,0],[3.8,.4],[5.6,0]]){mpmgeP(x,[[u,-6.5],[u+.2,-3],[u,0]],{l:1.5,k:MPL.INK,w:.1});mpmgeP(x,[[u,-6.5],[u+.2,-3],[u,-.3]],{l:.9,k:'#b0a696',w:.1});mpmgeE(x,u,0,1,.5,'#3a2a1c',0,.3)}
  mpmgeE(x,0,-8.8,8.2,4.4,'#b5ab98');mpmgeE(x,.8,-6.2,5.5,1.5,'#d8d0bc',0,0);
  mpmgeP(x,[[5.4,-11],[7.4,-15],[10,-17.4],[12.4,-15.4],[12,-13.4],[9,-12.2]],{c:1,f:'#b5ab98',sd:2});
  mpmgeP(x,[[10.6,-16.5],[13.8,-15],[14.6,-12.6],[12.5,-12.4]],{c:1,f:'#e2d8c0',sd:3});mpmgeD(x,13.6,-13.8,.4);
  mpmgeP(x,[[8.4,-17],[7.8,-22],[9.2,-21.2],[10.2,-17]],{c:1,f:'#b5ab98',sd:4,w:.15});mpmgeP(x,[[10,-17],[11.4,-22],[12.2,-20.6],[11.6,-16.6]],{c:1,f:'#b5ab98',sd:5,w:.15});
  mpmgeEye(x,10.5,-15.4,.8,1);mpmgeP(x,[[7.6,-17],[7.4,-14],[8,-12.4]],{l:.3,w:.1});
  mpmgeP(x,[[-4.5,-12.6],[-4,-15.6],[4,-15.6],[4.6,-12.6]],{c:1,f:'#c8573c',sd:8,w:.15});mpmgeP(x,[[-3,-15.6],[-3,-17.4],[1,-17.8],[2.6,-15.6]],{c:1,f:'#d8b868',sd:6,w:.15});mpmgeL(x,[[-4,-13.8],[4,-13.8]],.3);mpmgeShell(x,0,-9.8,1.4)})}
/* a monk at a slanting desk copying a map */
function mpmgeMonk(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeL(x,[[-9,0],[-8,-8.5]],.5);mpmgeL(x,[[9,0],[8,-8.5]],.5);mpmgeL(x,[[-10,-8.6],[10,-11.6]],.6);
  mpmgeP(x,[[-8,-9],[8,-11.8],[8.4,-13.6],[-7.6,-10.8]],{c:1,f:'#efe0b4',s:1,l:.4});
  mpmgeP(x,[[-6,-10.4],[-4.5,-11.6],[-3,-10.8],[-1.4,-12.2],[0,-11.6]],{l:.4,k:MPL.VERD,w:.2});mpmgeP(x,[[1,-11.6],[2.2,-12.8],[3.4,-12],[4.6,-12.6]],{l:.35,k:MPL.LAPIS,w:.2});mpmgeD(x,-2,-10.3,.5,MPL.VERM);mpmgeL(x,[[-2.4,-10.6],[-1.6,-10]],.25,MPL.VERM);mpmgeL(x,[[-1.6,-10.6],[-2.4,-10]],.25,MPL.VERM);
  mpmgeP(x,[[-16,-1],[-16,-12],[-12,-13.5],[-12,-1]],{c:1,f:mpmgeC.robe,sd:9,s:1});
  mpmgeP(x,[[-17.4,-1],[-16,-14],[-11,-15],[-9.4,-1]],{c:1,f:'#7a5a3a',sd:2,w:.2});mpmgeE(x,-13.6,-17.4,2.6,2.7,mpmgeC.skin);mpmgeP(x,[[-16,-18],[-15,-20.4],[-12,-20.6],[-11,-18.6]],{l:.4,w:.1});mpmgeD(x,-12.4,-17.6,.4);mpmgeL(x,[[-13,-15.9],[-12,-16]],.25);
  mpmgeP(x,[[-12,-13.4],[-9,-12.4],[-6.6,-11.2]],{l:.5,k:'#5a3a1c',w:.15});mpmgeL(x,[[-6.6,-11.2],[-4.4,-15.8]],.35,'#c8c0a8');mpmgeP(x,[[-4.4,-15.8],[-3,-18.6],[-5,-17.4]],{c:1,f:'#e8e0c8',l:.3,sd:1});
  mpmgeP(x,[[-1,-0.2],[0,-3],[3.4,-3],[3.8,-.2]],{c:1,f:'#3a2a1c',sd:5,w:.1});mpmgeL(x,[[3.5,-2.6],[5.4,-5.4]],.4,'#e8e0c8')})}
/* a bear that has taken a skep of honey; bees rage round it */
function mpmgeBear(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-7,-10],[-8.6,-6],[-8,-.4],[-4,0],[-3,-3],[0,-1.4],[2.6,0],[6.6,0],[7,-4],[6,-9]],{c:1,f:'#6a4a32',sd:4,w:.4});
  mpmgeE(x,-3,-4.5,2.6,3.2,'#7e5c42',0,.3);
  mpmgeE(x,3,-13,4.2,3.8,'#7a5a40');mpmgeE(x,-.5,-16,1.4,1.4,'#6a4a32');mpmgeE(x,5.6,-16,1.4,1.4,'#6a4a32');mpmgeE(x,6.8,-12,2.2,1.6,'#d4b48c');mpmgeD(x,8.4,-12.4,.7);mpmgeEye(x,4.2,-14,.7,1);mpmgeL(x,[[7.4,-10.8],[8.4,-10.2]],.3);
  mpmgeP(x,[[8,-9],[10,-6],[12,-5]],{l:1.8,k:MPL.INK,w:.1});mpmgeP(x,[[8,-9],[10,-6],[12,-5]],{l:1.1,k:'#7e5c42',w:.1});
  mpmgeP(x,[[9,-3],[8.6,-8],[12,-12],[15.6,-8],[15,-3]],{c:1,f:'#e4b860',sd:2,w:.2});for(let i=0;i<4;i++)mpmgeP(x,[[9.4+i*.3,-4.4-i*1.9],[12.2,-3.6-i*1.9],[14.8-i*.3,-4.4-i*1.9]],{l:.3,w:.15});mpmgeE(x,12.2,-3,1.2,1,'#3a2a1c',0,.3);mpmgeP(x,[[12,-12],[12,-13.4]],{l:.4});
  mpmgeD(x,12.5,-4.8,.4);mpmgeL(x,[[8,-5],[9.2,-3.4]],.3,'rgba(160,100,20,.8)')
  ;for(const [u,v,r] of [[14,-17,.8],[7.4,-19,.7],[17.6,-13,.7],[1,-21,.7],[12.4,-20.6,.6]])mpmgeBee(x,u,v,r,u%3-1);mpmgeTrail(x,10,-18,[[8.5,-15]])})}
/* a hare-like rabbit with a hat and a staff */
function mpmgeRabbit(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeL(x,[[6.8,0],[6.4,-19]],.55,'#5a3a1c');mpmgeP(x,[[6.4,-19],[8,-21],[9,-19.6]],{l:.5,k:'#5a3a1c',w:.1});
  mpmgeE(x,-4.3,-2.6,1.8,1.4,'#e8e0d0');mpmgeE(x,-4.3,-2.4,1.2,.8,'#d8c8b8',0,0);
  mpmgeP(x,[[-4.6,-4],[-5,-8],[-3.6,-12],[3.6,-12],[4.8,-8],[4,-3],[0,-1.4]],{c:1,f:'#a89a84',sd:6,w:.25});mpmgeE(x,0,-6.4,2.2,3.6,'#ece4d0',0,.3);
  mpmgeE(x,3,-1.2,2.8,1,'#b4a690');mpmgeE(x,-2.4,-1,2.8,1,'#b4a690');
  mpmgeP(x,[[2.6,-9.6],[5.8,-9],[6.8,-8.2]],{l:.7,k:MPL.INK});mpmgeP(x,[[2.6,-9.6],[5.8,-9],[6.8,-8.2]],{l:.4,k:'#a89a84'});
  mpmgeE(x,.8,-13.8,3.2,2.8,'#b4a690');mpmgeEye(x,2.2,-14.4,.8,1);mpmgeD(x,4.2,-13.4,.5,'#c8607a');mpmgeL(x,[[3.6,-12.6],[4.4,-12.2]],.25);
  mpmgeP(x,[[-1,-15],[-2.4,-20],[-1.6,-24.6],[-.2,-24.8],[.2,-18]],{c:1,f:'#b4a690',sd:2,w:.15});mpmgeP(x,[[1.4,-15.4],[2.6,-20],[3.4,-24.2],[4.6,-23.8],[3.8,-17]],{c:1,f:'#b4a690',sd:3,w:.15});
  mpmgeE(x,.6,-16.6,5.2,1,'#5a4a7a');mpmgeP(x,[[-1.6,-17],[-1,-19.4],[3.2,-19.4],[3.8,-17]],{c:1,f:'#5a4a7a',sd:4,w:.1});mpmgeL(x,[[-1,-17.8],[3.4,-17.8]],.25,'#e0c060');
  mpmgeP(x,[[-1.6,-12.6],[1,-11.6],[3.2,-12.4]],{l:.7,k:MPL.VERM,w:.1})})}
function mpmgeGoat(x,a,b,s,d,o){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-9,0],[-7,-2.4],[-3,-3],[0,-1.2],[4,-2.6],[8,0],[9,.6]],{c:1,f:'#8c8a86',sd:3,w:.3,s:1});
  for(const u of [-6.4,-4,3,5.4])mpmgeP(x,[[u,-6],[u-.2,-3],[u+.3,-.1]],{l:.9,k:MPL.INK,w:.15});
  mpmgeP(x,[[-7,-8.4],[-8.4,-7.4],[-8.2,-5.4]],{l:.5});
  mpmgeE(x,0,-7.6,7.4,3.2,'#e4dcc8');mpmgeHatch(x,-5,-9,9,4,8);
  mpmgeP(x,[[5,-9.8],[6.6,-13],[9.4,-13.8],[11.6,-12.2],[10.2,-10.6],[7,-9.4]],{c:1,f:'#e4dcc8',sd:5,w:.2});mpmgeD(x,11,-12,.4);mpmgeEye(x,8.6,-12.6,.7,1);
  mpmgeP(x,[[7.4,-13.2],[6.6,-17],[3.6,-18.4],[3,-16.6]],{l:.7,k:MPL.INK,w:.1});mpmgeP(x,[[7.4,-13.2],[6.6,-17],[3.6,-18.4],[3,-16.6]],{l:.4,k:'#d8c8a0',w:.1});
  mpmgeP(x,[[10.6,-10.8],[10,-8],[11,-6.6]],{l:.35,w:.1});mpmgeP(x,[[8,-13.2],[10,-15.4],[9.6,-13.4]],{c:1,f:'#d0c8b4',sd:8,l:.3,w:.1})},o||{})}
function mpmgeFalcon(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-1,-1],[-8,-7],[-15,-4],[-9,-1],[-3,1]],{c:1,f:'#a8826a',sd:4,w:.3});mpmgeP(x,[[2,-1],[10,-8],[16,-5],[9,-1],[3,1]],{c:1,f:'#a8826a',sd:5,w:.3});
  for(let i=0;i<4;i++){mpmgeL(x,[[-4-i*2.6,-3.4-i*.6],[-6-i*2.6,-1.2]],.25);mpmgeL(x,[[6+i*2.4,-3.8-i*.6],[7.6+i*2.4,-1.4]],.25)}
  mpmgeP(x,[[-2,1.4],[-6,6],[-4,8],[0,7],[4,8],[6,6],[2,1.4]],{c:1,f:'#8a6a52',sd:2,w:.2});
  mpmgeE(x,0,0,2.2,3,'#d8c4a4');mpmgeE(x,.4,-3.4,1.7,1.7,'#a8826a');mpmgeP(x,[[1.2,-3.6],[3,-3],[1.4,-2.4]],{c:1,f:'#e8c040',sd:3,w:.1});mpmgeD(x,.9,-3.9,.4);mpmgeL(x,[[-.4,-1.8],[-.4,1.6]],.25)})}
function mpmgeFisher(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-10,-5],[-8,0],[8,0],[11,-6],[8,-2],[-8,-2]],{c:1,f:'#8a5a34',sd:2,w:.2});mpmgeL(x,[[-5,-2],[-5,0]],.3);
  mpmgeP(x,[[-4,-3],[-3,-9],[1,-9],[2,-3]],{c:1,f:'#c8b078',sd:4,w:.2,s:1});mpmgeE(x,-1,-11,2,2.1,mpmgeC.skin);mpmgeD(x,0,-11.2,.35);mpmgeP(x,[[-4,-11.4],[-1,-14.6],[2,-11.4]],{c:1,f:'#a8603c',sd:6,w:.15});
  mpmgeP(x,[[1,-7],[4,-8.4],[6,-10]],{l:.5,w:.1});mpmgeL(x,[[6,-10],[14,-15]],.4,'#5a3a1c');mpmgeL(x,[[14,-15],[14.4,-2]],.25,'rgba(42,26,12,.7)');
  mpmgeP(x,[[11.6,-1.6],[13.6,-3.4],[15.4,-2.2],[14,-.6]],{c:1,f:'#8ab0c0',sd:3,w:.1});mpmgeL(x,[[15.4,-2.2],[16.8,-3]],.3);mpmgeD(x,12.6,-2.2,.3);
  mpmgeP(x,[[-14,1.6],[-11,.9],[-8,1.6]],{l:.3,k:MPL.LAPIS,w:.2});mpmgeP(x,[[8,1.8],[11,1],[14,1.8],[17,1]],{l:.3,k:MPL.LAPIS,w:.2})})}

/* ---- THE PILGRIM'S PATH (400-423): all 24 levels share one map ---- */
function mpmgePilgrimMap(x){
  // left panel: the road is 96 km, and a snail is winning
  mpmgeGround(x,14,243,66,1);
  mpmgePilgrim(x,30,243,.9,1,{run:1,shell:1});mpmgeSnail(x,64,243,.95,1);
  mpmgeBee(x,74,222,.7,.2);mpmgeTrail(x,72,226,[[72,230]]);
  // right panel, under the key: a bear has robbed a skep; a rabbit in a hat looks on
  mpmgeGround(x,400,294,64,3);
  mpmgeBear(x,418,294,.95,-1);
  mpmgeRabbit(x,452,294,.8,-1);
  // top strip: a donkey and a pilgrim, goats on the peaks, a falcon, a monk copying the map
  mpmgeDonkey(x,148,42,.62,1);mpmgePilgrim(x,166,42,.7,1,{shell:1});mpmgeGround(x,134,42.4,46,4);
  mpmgeGoat(x,298,43,.75,1);mpmgeGoat(x,320,43,.6,-1);
  mpmgeP(x,[[286,43],[292,41],[300,43],[316,43],[326,42],[332,43]],{l:.4,k:'#7a746c',w:.3});
  mpmgeFalcon(x,342,36,.45,-1);
  mpmgeMonk(x,376,43,.6,-1);mpmgeGround(x,352,43.4,36,5);
  // on the sea, an old fisherman who has hooked a very large fish
  mpmgeFisher(x,268,226,.8,1);
}
mpmgAdd(Array.from({length:24},(_,i)=>400+i),function(x,L){mpmgePilgrimMap(x)});

/* ---- THE HOLLOW GRASSLANDS (470) ---- */
function mpmgeFrogfolk(x,a,b,s,d,o){mpmgeT(x,a,b,s,d,(x,o)=>{
  mpmgeL(x,[[8,0],[8,-27]],.55,'#5a3a1c');mpmgeP(x,[[8,-27],[6.6,-30],[8,-33],[9.4,-30]],{c:1,f:'#c8d0d8',sd:2,w:.1});
  if(o.fly){mpmgeE(x,8,-35,1.3,.7,'#222',0,.3);mpmgeE(x,6.6,-36.4,1.3,.6,'rgba(220,235,250,.8)',-.5,.25);mpmgeE(x,9.4,-36.4,1.3,.6,'rgba(220,235,250,.8)',.5,.25)}
  mpmgeP(x,[[-4.6,-.2],[-6.4,.4],[-1.6,.6],[-1,-3]],{c:1,f:MPL.VERD,sd:3,w:.1});mpmgeP(x,[[4.6,-.2],[7.2,.4],[1.6,.6],[1,-3]],{c:1,f:MPL.VERD,sd:4,w:.1});
  mpmgeL(x,[[-2,-4],[-2.6,-.4]],.7,MPL.INK);mpmgeL(x,[[2,-4],[2.6,-.4]],.7,MPL.INK);
  mpmgeP(x,[[-3.6,-13],[3.6,-13],[5.4,-3.4],[-5.4,-3.4]],{c:1,f:'#4a7a82',s:1,sd:7,w:.2});mpmgeE(x,0,-9,2.6,3.4,'#cfe0c4',0,0);mpmgeL(x,[[-4.8,-6],[4.8,-6]],.35,MPL.GOLD);
  mpmgeP(x,[[3.4,-11.4],[6,-12],[8,-12.6]],{l:.7});mpmgeP(x,[[3.4,-11.4],[6,-12],[8,-12.6]],{l:.4,k:'#7c9a62'});mpmgeP(x,[[-3.4,-11],[-6,-8.4],[-6.8,-6]],{l:.7});mpmgeP(x,[[-3.4,-11],[-6,-8.4],[-6.8,-6]],{l:.4,k:'#7c9a62'});
  if(o.book){mpmgeP(x,[[-9,-6],[-3,-5.6],[-3,-11.2],[-9,-11.6]],{c:1,f:'#a8402c',s:1,sd:3,w:.1});mpmgeL(x,[[-8.2,-7.4],[-4,-7.2]],.25,MPL.GOLD2);mpmgeL(x,[[-8.2,-9],[-4,-8.8]],.25,MPL.GOLD2)}
  mpmgeE(x,0,-16.4,5.4,3.7,mpmgeC.frog);mpmgeE(x,0,-15,3.6,1.5,mpmgeC.frog2,0,0);
  for(let i=-2;i<=2;i++)mpmgeP(x,[[i*1.9-1,-19.5],[i*1.9,-22.6-(i%2?0:1)],[i*1.9+1,-19.5]],{c:1,f:'#d8704a',sd:i+9,w:.05,l:.3});
  for(const u of [-3,3]){mpmgeE(x,u,-19.4,1.9,1.9,'#f4e8a0');mpmgeE(x,u+.2,-19.3,.55,1.2,MPL.INK,0,0)}
  mpmgeP(x,[[-3.4,-14.8],[0,-13.4],[3.4,-14.8]],{l:.4,w:.1});mpmgeD(x,-4.2,-14.7,.3);mpmgeD(x,4.2,-14.7,.3);
  mpmgeD(x,-1,-17.4,.25);mpmgeD(x,1,-17.4,.25);mpmgeP(x,[[-5.2,-16],[-7,-14.6],[-5.4,-13.6]],{l:.3,k:'#d8704a'});mpmgeP(x,[[5.2,-16],[7,-14.6],[5.4,-13.6]],{l:.3,k:'#d8704a'})},o||{})}
function mpmgeGiantFrog(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-11,0],[-13,-5],[-10,-11],[-1,-13],[8,-11],[12,-5],[10,0]],{c:1,f:'#728c58',sd:5,w:.4});
  mpmgeE(x,-4,-5,5,4.4,'#6a8450',-.2);mpmgeP(x,[[-8,-2],[-2,-1],[4,0],[7,0]],{l:.5,w:.2});mpmgeE(x,6,-.8,3.2,.9,'#6a8450');
  for(const [u,v,r] of [[-6,-9,1.2],[0,-10,1],[-9,-5,.9],[3,-8,.8]])mpmgeD(x,u,v,r,'#4a6838');
  mpmgeP(x,[[5,-4],[7,-1],[9,0]],{l:1.6});mpmgeP(x,[[5,-4],[7,-1],[9,0]],{l:1,k:'#728c58'});
  mpmgeE(x,12,-10,5.6,4.2,'#78925e');mpmgeE(x,12.6,-4.6,3.6,2.6,'#d8e0b8');mpmgeL(x,[[7.4,-7.6],[16.6,-7.4]],.45);
  mpmgeE(x,10.6,-14.4,2.5,2.4,'#f0e498');mpmgeE(x,10.8,-14.4,.8,1.7,MPL.INK,0,0);mpmgeE(x,15.4,-12.4,1.9,1.9,'#f0e498');mpmgeE(x,15.4,-12.4,.6,1.2,MPL.INK,0,0);mpmgeD(x,17,-10.6,.4);
  mpmgeP(x,[[16.4,-7.6],[22,-9],[28,-14],[34,-18],[36,-20.4]],{l:1.3,k:'#c04c58',w:.2});mpmgeD(x,36.4,-20.8,1.1,'#c04c58');
  mpmgeP(x,[[3,-12],[6,-13.4]],{l:.3})})}
/* Aldous the wizard, with his book. o: col (robe colour) */
function mpmgeWizard(x,a,b,s,d,o){mpmgeT(x,a,b,s,d,(x,o)=>{
  const c=o.col||'#3c4c90';
  mpmgeP(x,[[-4,-1],[-5,-9],[-3.6,-19],[3.6,-19],[5,-9],[4,-1]],{c:1,f:c,s:1,sd:2,w:.25});mpmgeE(x,-4,-.4,2,.8,'#3a2a1c',0,.3);mpmgeE(x,4,-.4,2,.8,'#3a2a1c',0,.3);
  for(const [u,v] of [[-2,-6],[2.6,-10],[-2.6,-14],[1,-16]]){mpmgeP(x,[[u-1,v],[u,v-1.5],[u+1,v],[u,v+1]],{c:1,f:MPL.GOLD2,s:1,l:.2,sd:u+3,w:0})}
  mpmgeP(x,[[-3.6,-18],[0,-14],[3.6,-18],[3,-10],[0,-8],[-3,-10]],{c:1,f:'#f4f0e4',sd:6,w:.2});mpmgeL(x,[[-1,-12],[-1,-9]],.2);mpmgeL(x,[[1.2,-12],[1.2,-9]],.2);
  mpmgeE(x,0,-22,2.6,2.8,mpmgeC.skin);mpmgeD(x,.9,-22.4,.35);mpmgeD(x,-.8,-22.4,.35);mpmgeL(x,[[-1.6,-23.6],[-.2,-23.2]],.25);mpmgeL(x,[[.6,-23.3],[1.9,-23.7]],.25);mpmgeP(x,[[-.4,-21.4],[.8,-20.4]],{l:.3});
  mpmgeP(x,[[-3,-25],[3,-25],[2.4,-31],[1,-36],[-2,-31]],{c:1,f:c,sd:4,w:.1,l:0});
  mpmgeL(x,[[-3,-25],[-2,-31],[1,-36],[5,-39]],.5);mpmgeL(x,[[3,-25],[2.4,-31],[3,-36],[5.6,-38.8]],.5);mpmgeE(x,0,-24.6,6.2,1.3,c);
  mpmgeL(x,[[-3,-26.6],[3,-26.6]],.4,MPL.GOLD);mpmgeD(x,.4,-30,.6,MPL.GOLD2);
  mpmgeP(x,[[3.6,-15],[7,-12],[8.6,-10.4]],{l:.9,w:.1});mpmgeP(x,[[3.6,-15],[7,-12],[8.6,-10.4]],{l:.5,k:c,w:.1});
  mpmgeP(x,[[6,-8],[11,-9.6],[11.4,-15.2],[6.4,-13.8]],{c:1,f:'#a8402c',s:1,sd:5,w:.1});mpmgeP(x,[[11,-9.6],[15.6,-8],[15.8,-13.6],[11.4,-15.2]],{c:1,f:'#f2e8cc',s:1,sd:6,w:.1});
  for(let i=0;i<3;i++){mpmgeL(x,[[12,-10.8-i*1.5],[15,-10.2-i*1.5]],.25)}mpmgeL(x,[[8,-10.6],[10.4,-11.4]],.25,MPL.GOLD2);mpmgeL(x,[[8,-12.2],[10.4,-13]],.25,MPL.GOLD2);
  mpmgeL(x,[[11.2,-16],[11.2,-19]],.25,MPL.GOLD);mpmgeL(x,[[13,-15.8],[14.4,-18.6]],.25,MPL.GOLD);mpmgeL(x,[[9.4,-15.8],[8,-18.2]],.25,MPL.GOLD)},o||{})}
function mpmgeTower(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-4.6,0],[-3.6,-30],[3.6,-30],[4.6,0]],{c:1,f:'#ebe6d6',s:1,sd:3,w:.2});mpmgeHatch(x,-3.8,-28,3,26,4,1);
  for(const y of [-8,-17,-25]){mpmgeP(x,[[-.8,y],[-.8,y-2.2],[0,y-3.2],[.8,y-2.2],[.8,y]],{c:1,f:'#3a4a6a',sd:y,w:0,l:.35})}
  mpmgeP(x,[[-1.6,0],[-1.6,-4],[0,-5.4],[1.6,-4],[1.6,0]],{c:1,f:'#7a5a3a',sd:2,w:0,l:.4});
  mpmgeE(x,0,-30.4,6,1.5,'#d8d2c0');for(let i=-5;i<=5;i+=2)mpmgeL(x,[[i,-30],[i,-31.6]],.3);
  mpmgeP(x,[[-5,-31],[-1.6,-40],[0,-50],[1.6,-40],[5,-31]],{c:1,f:'#b4cfe0',s:1,sd:5,w:.1});mpmgeL(x,[[0,-50],[0,-55]],.4);mpmgeP(x,[[0,-55],[3.6,-54],[0,-52.6]],{c:1,f:MPL.VERM,s:1,l:.3,w:0});
  mpmgeL(x,[[-1,-34],[-.6,-46]],.25,'rgba(40,70,100,.6)')})}
function mpmgeSkep(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-6,0],[-6.4,-6],[-4,-11],[0,-13],[4,-11],[6.4,-6],[6,0]],{c:1,f:'#e4b860',sd:2,w:.2});
  for(let i=0;i<5;i++){const y=-2-i*2.2,w=6-i*1;mpmgeP(x,[[-w,y],[0,y+1],[w,y]],{l:.3,k:'rgba(120,70,10,.8)',w:.1})}
  mpmgeE(x,0,-1.4,1.6,1.3,'#3a2a1c',0,.3);mpmgeL(x,[[0,-13],[0,-15]],.4);mpmgeL(x,[[-1,-15],[1,-15]],.4);
  for(const [u,v,r] of [[9,-12,.8],[-8,-9,.7],[6,-17,.7],[-4,-17,.6],[10,-5,.6]])mpmgeBee(x,u,v,r,(u%3)-1);mpmgeTrail(x,7.6,-12,[[6.4,-9]])})}
function mpmgeSpiderHang(x,a,b,len,s){x.save();x.translate(a,b);x.scale(s,s);x.lineCap='round';mpmgeL(x,[[0,0],[0,len]],.3,'rgba(42,26,12,.7)');x.translate(0,len+2.6);
  for(const k of [-1,1])for(let j=0;j<4;j++){const y=-1.4+j*1;mpmgeP(x,[[0,y*.5],[k*3,y-1.6],[k*4.6,y+1.4+j*.3]],{l:.4,w:.1})}
  mpmgeE(x,0,0,1.9,2.2,'#6a2418');mpmgeE(x,0,-2.6,1.2,1.1,'#6a2418');mpmgeD(x,-.5,-2.8,.35,'#f2e8cc');mpmgeD(x,.5,-2.8,.35,'#f2e8cc');mpmgeP(x,[[-1,1],[0,2],[1,1]],{l:.25,k:'#e8c8a0',w:0});x.restore()}
function mpmgeDragonfly(x,a,b,s,rot){x.save();x.translate(a,b);x.rotate(rot||0);x.scale(s,s);x.lineCap='round';
  mpmgeE(x,-2.6,-2,5,1.5,'rgba(190,225,240,.8)',-.3,.3);mpmgeE(x,-2.6,2,5,1.5,'rgba(190,225,240,.8)',.3,.3);mpmgeE(x,2.4,-2.2,4.4,1.3,'rgba(190,225,240,.8)',-.2,.3);mpmgeE(x,2.4,2.2,4.4,1.3,'rgba(190,225,240,.8)',.2,.3);
  mpmgeP(x,[[-8,0],[-3,0],[3,0]],{l:1.5,k:MPL.INK,w:.05});mpmgeP(x,[[-8,0],[-3,0],[3,0]],{l:.9,k:MPL.LAPIS,w:.05});mpmgeE(x,4.4,0,1.6,1.4,MPL.VERM);mpmgeD(x,5,-.5,.35,'#fff');x.restore()}
function mpmgeHollowMap(x){
  // bottom left: the wizard Aldous reads his book to a frog scholar, a pale tower behind
  mpmgeGround(x,10,296,112,11);
  mpmgeTower(x,102,296,1.55,1);mpmgeTower(x,80,296,.7,1);
  mpmgeWizard(x,36,296,1.6,1);
  mpmgeFrogfolk(x,66,296,1.2,-1,{book:1});
  mpmgeBee(x,24,246,.8,.2);mpmgeTrail(x,22,250,[[23,254]]);mpmgeBee(x,52,238,.7,-.3);
  // bottom right: a giant frog snaps at a dragonfly beside a skep of bees
  mpmgeGround(x,372,296,98,12);
  mpmgeGiantFrog(x,384,296,1.4,1);
  mpmgeDragonfly(x,440,250,1.3,.5);
  mpmgeSkep(x,452,296,1.6,1);
  // top strip: a fishfolk soldier marches with a fly on his spear; a spider drops from the top
  mpmgeGround(x,124,36,66,13);
  mpmgeFrogfolk(x,150,36,.62,1,{fly:1});mpmgeFrogfolk(x,172,36,.5,1,{});
  mpmgeSpiderHang(x,258,5,13,.9);
  mpmgeDragonfly(x,296,20,.9,-.3);
}
mpmgAdd([470],function(x,L){mpmgeHollowMap(x)});

/* ---- THE ORANGE SPIRE (440-459): small marginalia, eerier and more royal as the floors climb ---- */
function mpmgeBat(x,a,b,s,d,o){mpmgeT(x,a,b,s,d,(x,o)=>{
  if(o.hang){mpmgeL(x,[[0,-6],[0,-3]],.4);mpmgeP(x,[[0,-3],[-3.4,0],[-2.6,5],[0,7.4],[2.6,5],[3.4,0]],{c:1,f:'#5a4a62',sd:3,w:.15});mpmgeP(x,[[-1.4,-3],[-1.8,-6],[-.6,-4.6]],{c:1,f:'#5a4a62',l:.3,w:0,sd:1});mpmgeP(x,[[1.4,-3],[1.8,-6],[.6,-4.6]],{c:1,f:'#5a4a62',l:.3,w:0,sd:2});mpmgeE(x,0,1.6,1.2,1.4,'#8a7a8a',0,.3);mpmgeD(x,-.5,.6,.35,'#e8d060');mpmgeD(x,.5,.6,.35,'#e8d060');mpmgeL(x,[[-.3,2.2],[.3,2.2]],.25);return}
  for(const k of [-1,1]){mpmgeP(x,[[k*1.2,-1],[k*5,-5.4],[k*9.4,-4.4],[k*11.6,-6],[k*11,-1.6],[k*8.6,-.6],[k*8,2],[k*5.4,.6],[k*3.6,2.6],[k*1.4,2]],{c:1,f:'#5a4a62',sd:k+6,w:.25,s:1});mpmgeL(x,[[k*1.4,-.6],[k*8,-3.6]],.25,'rgba(230,220,235,.6)');mpmgeL(x,[[k*3,.4],[k*8.6,-.8]],.25,'rgba(230,220,235,.6)')}
  mpmgeE(x,0,.4,1.8,2.8,'#6a5a72');mpmgeE(x,0,-3,1.8,1.7,'#6a5a72');mpmgeP(x,[[-1.6,-4],[-1.9,-6.6],[-.6,-4.8]],{c:1,f:'#6a5a72',l:.3,w:0,sd:1});mpmgeP(x,[[1.6,-4],[1.9,-6.6],[.6,-4.8]],{c:1,f:'#6a5a72',l:.3,w:0,sd:2});mpmgeD(x,-.7,-3.2,.4,'#e8d060');mpmgeD(x,.7,-3.2,.4,'#e8d060');mpmgeP(x,[[-.8,-1.8],[0,-1.2],[.8,-1.8]],{l:.25,w:0});mpmgeL(x,[[-.4,-1.8],[-.4,-1]],.2,'#fff');mpmgeL(x,[[.4,-1.8],[.4,-1]],.2,'#fff')},o||{})}
/* a sheet ghost. o: crown, chain, grin */
function mpmgeGhost(x,a,b,s,d,o){mpmgeT(x,a,b,s,d,(x,o)=>{
  mpmgeP(x,[[-6,-1],[-5.6,-9],[-4.6,-16],[0,-19],[4.6,-16],[5.6,-9],[6,-1],[4.2,-3],[2.6,0],[.8,-3],[-.8,0],[-2.6,-3],[-4.2,0]],{c:1,f:'rgba(225,236,244,.92)',sd:4,w:.25});
  mpmgeP(x,[[5.4,-11],[8.6,-14],[9.8,-12.4]],{l:.45,w:.1,k:'rgba(42,26,12,.8)'});mpmgeP(x,[[-5.4,-11],[-8.4,-8.4],[-9,-5.6]],{l:.45,w:.1,k:'rgba(42,26,12,.8)'});
  mpmgeE(x,-2,-13.2,1,1.5,'#2a2a3a',0,0);mpmgeE(x,2,-13.2,1,1.5,'#2a2a3a',0,0);mpmgeE(x,0,-9.4,1.2,1.7,'#2a2a3a',0,0);
  mpmgeL(x,[[-4,-6],[-3.4,-2.4]],.2,'rgba(80,110,140,.6)');mpmgeL(x,[[3.6,-7],[3.4,-3]],.2,'rgba(80,110,140,.6)');
  if(o.crown){mpmgeP(x,[[-3,-18.4],[-3.4,-22.2],[-1.6,-20.4],[0,-23.4],[1.6,-20.4],[3.4,-22.2],[3,-18.4]],{c:1,f:MPL.GOLD,sd:2,w:0,s:1,l:.4});mpmgeD(x,0,-23.6,.5,MPL.VERM)}
  if(o.chain){for(let i=0;i<5;i++)mpmgeE(x,9.6+i*2.4,-12+i*2.4,1.1,.7,null,.9,.35);mpmgeE(x,22,-1,2.4,2.4,'#7a7a82',0,.4)}
  if(o.teddy){mpmgeE(x,-9.4,-6,2.4,2.8,'#c8a070');mpmgeE(x,-9.4,-9.4,1.8,1.8,'#c8a070');mpmgeE(x,-10.8,-11,.8,.8,'#c8a070',0,.3);mpmgeE(x,-8,-11,.8,.8,'#c8a070',0,.3);mpmgeD(x,-10,-9.6,.3);mpmgeD(x,-8.8,-9.6,.3);mpmgeL(x,[[-6.4,-9],[-9,-5.8]],.4,'rgba(42,26,12,.7)')}},o||{})}
function mpmgeSkeleton(x,a,b,s,d,o){mpmgeT(x,a,b,s,d,(x,o)=>{
  const bn=mpmgeC.bone;mpmgeL(x,[[-1.6,-9],[-1.8,-1],[-3,0]],.9,MPL.INK);mpmgeL(x,[[1.6,-9],[1.8,-1],[3,0]],.9,MPL.INK);mpmgeL(x,[[-1.6,-9],[-1.8,-1],[-3,0]],.5,bn);mpmgeL(x,[[1.6,-9],[1.8,-1],[3,0]],.5,bn);mpmgeE(x,-3.4,0,1.6,.6,bn);mpmgeE(x,3.4,0,1.6,.6,bn);
  mpmgeP(x,[[-3,-9.4],[0,-8.4],[3,-9.4],[1.8,-11.4],[-1.8,-11.4]],{c:1,f:bn,sd:2,w:.1});
  mpmgeL(x,[[0,-9],[0,-18]],.8,MPL.INK);mpmgeL(x,[[0,-9],[0,-18]],.4,bn);for(let i=0;i<4;i++)mpmgeP(x,[[-4,-17+i*1.7],[0,-18.4+i*1.7],[4,-17+i*1.7]],{l:.5,w:.05});
  mpmgeP(x,[[-4,-17],[-5.4,-13],[-5,-10]],{l:.5,w:.1});mpmgeP(x,[[4,-17],[6.4,-14],[9.4,-14.4]],{l:.5,w:.1});
  mpmgeP(x,[[6.4,-12],[12,-12.8],[12.4,-19.4],[6.8,-18.4]],{c:1,f:o.book||'#7a3a44',s:1,sd:5,w:.1});mpmgeL(x,[[7.6,-14],[11.4,-14.4]],.25,MPL.GOLD2);mpmgeL(x,[[7.8,-16],[11.4,-16.4]],.25,MPL.GOLD2);
  mpmgeE(x,0,-22,3.6,3.7,bn);mpmgeP(x,[[-2.4,-19],[-2,-18],[2,-18],[2.4,-19]],{c:1,f:bn,l:.4,w:0,sd:1});mpmgeE(x,-1.6,-22.4,1.1,1.2,'#2a1a14',0,0);mpmgeE(x,1.6,-22.4,1.1,1.2,'#2a1a14',0,0);mpmgeP(x,[[0,-21.2],[-.5,-20],[.5,-20]],{c:1,f:'#2a1a14',l:0,w:0,sd:1});for(const u of [-1.2,0,1.2])mpmgeL(x,[[u,-19.6],[u,-18.4]],.25);
  mpmgeE(x,-1.6,-22.4,2,2,null,0,.3);mpmgeE(x,1.6,-22.4,2,2,null,0,.3);mpmgeL(x,[[-.4,-22.4],[.4,-22.4]],.3);
  if(o.crown){mpmgeP(x,[[-3,-25.6],[-3.4,-29.6],[-1.6,-27.6],[0,-30.6],[1.6,-27.6],[3.4,-29.6],[3,-25.6]],{c:1,f:MPL.GOLD,sd:2,w:0,s:1,l:.4});mpmgeD(x,0,-30.8,.5,MPL.VERM)}},o||{})}
function mpmgeGargoyle(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-10,0],[-10,-4],[10,-4],[10,0]],{c:1,f:'#b4aca0',s:1,sd:3,w:.2});mpmgeL(x,[[-10,-4],[-11,-5],[11,-5],[10,-4]],.4);mpmgeL(x,[[-4,-4],[-4,0]],.25);mpmgeL(x,[[3,-4],[3,0]],.25);
  mpmgeP(x,[[-7,-6],[-12,-14],[-8,-17],[-4,-10]],{c:1,f:'#8c867c',sd:5,w:.2});mpmgeP(x,[[-4,-6],[-8,-16],[-2,-13]],{c:1,f:'#9c968a',sd:6,w:.2});
  mpmgeP(x,[[-7,-5],[-8,-11],[-3,-14],[3,-12],[5,-7],[4,-5]],{c:1,f:'#a49e92',sd:4,w:.25});mpmgeHatch(x,-5,-12,6,6,5);
  mpmgeP(x,[[4,-8],[6,-5],[8,-5.4]],{l:.9});mpmgeP(x,[[4,-8],[6,-5],[8,-5.4]],{l:.5,k:'#a49e92'});for(const u of [7,8,9])mpmgeL(x,[[u,-5],[u+.2,-4.2]],.3);
  mpmgeE(x,3,-15,4,3.5,'#a49e92');mpmgeP(x,[[1,-17.6],[0,-21],[2.4,-18.6]],{c:1,f:'#8c867c',sd:2,w:0,l:.35});mpmgeP(x,[[5.4,-17.6],[6.4,-21],[4,-18.6]],{c:1,f:'#8c867c',sd:3,w:0,l:.35});
  mpmgeP(x,[[.6,-15.6],[1.6,-16.4],[2.8,-15.8]],{l:.5,w:0});mpmgeP(x,[[4,-15.8],[5,-16.4],[6,-15.6]],{l:.5,w:0});mpmgeD(x,1.7,-15.4,.5,'#e8c040');mpmgeD(x,5,-15.4,.5,'#e8c040');
  mpmgeP(x,[[1,-13.2],[3,-12.6],[5.4,-13.4],[5,-11.4],[3,-11.8],[1.4,-11.4]],{c:1,f:'#3a2a24',sd:7,w:0,l:.35,s:1});for(const u of [1.8,3.6]){mpmgeL(x,[[u,-13],[u+.1,-12.2]],.25,'#fff')}mpmgeP(x,[[3.4,-11.8],[3.6,-9.6],[4.4,-9.4],[4.8,-11.6]],{c:1,f:'#c86a78',sd:2,w:0,l:.3});
  mpmgeP(x,[[3.8,-9.4],[3.6,-6.6]],{l:.3,k:MPL.LAPIS,w:0});mpmgeD(x,3.6,-5.4,.5,'#8ab4d8')})}
function mpmgeWeb(x,a,b,r,d,spider){x.save();x.translate(a,b);x.scale(d||1,1);x.lineCap='round';
  const n=6;for(let i=0;i<=n;i++){const an=i/n*Math.PI/2;mpmgeL(x,[[0,0],[Math.cos(an)*r,Math.sin(an)*r]],.3,'rgba(42,26,12,.65)')}
  for(let k=1;k<=5;k++){const rr=r*k/5;x.beginPath();for(let i=0;i<=n;i++){const an=i/n*Math.PI/2,rv=rr*(i%2?.9:1)+mpmgeW(k,i,3,.8);const px=Math.cos(an)*rv,py=Math.sin(an)*rv;if(i)x.quadraticCurveTo((Math.cos(an-Math.PI/n)*rv*.88),(Math.sin(an-Math.PI/n)*rv*.88),px,py);else x.moveTo(px,py)}x.lineWidth=.25;x.strokeStyle='rgba(42,26,12,.6)';x.stroke()}
  if(spider)mpmgeSpiderHang(x,r*.55,r*.45,0,.8);x.restore()}
function mpmgeMouse(x,a,b,s,d,o){mpmgeT(x,a,b,s,d,(x,o)=>{
  mpmgeP(x,[[-4,-2],[-7,-3],[-8,-6],[-6.4,-8]],{l:.4,w:.1});mpmgeP(x,[[-4,-1],[-3,-6],[1,-8],[5,-5],[5.4,-1]],{c:1,f:'#b4ac9c',sd:3,w:.2});mpmgeE(x,0,-3,2.6,1.8,'#d8d0bc',0,0);
  mpmgeP(x,[[4,-5],[8,-4.4],[9.4,-2.8],[5,-1.8]],{c:1,f:'#b4ac9c',sd:4,w:.1});mpmgeD(x,9.4,-3.2,.5,'#c8607a');mpmgeEye(x,6.4,-4.2,.7,1);mpmgeE(x,3.4,-7,1.8,1.8,'#c8a0a0',0,.4);
  mpmgeL(x,[[-2,-1],[-2.4,0]],.5);mpmgeL(x,[[3,-1],[3.6,0]],.5);
  if(o.candle){mpmgeP(x,[[5,-5.6],[6.4,-6.4]],{l:.4,w:0});mpmgeP(x,[[6,-6.4],[8,-6.4],[8,-10.4],[6,-10.4]],{c:1,f:'#f4eed8',s:1,l:.35,w:0,sd:1});mpmgeP(x,[[7,-10.6],[6,-12.4],[7,-14.2],[8,-12.4]],{c:1,f:MPL.GOLD2,l:.3,w:0,sd:3});mpmgeL(x,[[7,-10.4],[7,-10.8]],.3)}
  if(o.cheese){mpmgeP(x,[[5,-6],[10,-7.6],[10,-3.6]],{c:1,f:'#e8c860',s:1,sd:2,w:0,l:.35});mpmgeD(x,8,-5.4,.5,'#c8a030');mpmgeD(x,9,-4.4,.35,'#c8a030')}},o||{})}
function mpmgeStairs(x,a,b,n,w,h){for(let i=0;i<n;i++){const u=a+i*w,v=b-i*h;mpmgeP(x,[[u,b],[u,v-h],[u+w,v-h],[u+w,b]],{c:1,f:i%2?'#c4bcac':'#b4ac9c',s:1,l:.4,w:.1,sd:i+2});mpmgeL(x,[[u,v-h],[u+w,v-h]],.5)}}
function mpmgeMouseStair(x,a,b,s,d){x.save();x.translate(a,b);x.scale((d||1)*s,s);mpmgeStairs(x,-14,0,4,6,3.2);x.restore();mpmgeMouse(x,a+(d||1)*(-10)*s,b-3.2*s,s*.8,d,{candle:1});mpmgeMouse(x,a+(d||1)*(4)*s,b-6.4*s,s*.7,d,{cheese:1})}
function mpmgeKnightAsleep(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeL(x,[[-14,0],[16,0]],.4,'rgba(42,26,12,.6)');
  mpmgeP(x,[[-9,-1],[-9,-6.4],[-1,-7.4],[7,-6.4],[7,-1]],{c:1,f:'#c4c8cc',sd:3,w:.2});mpmgeL(x,[[-4,-6.8],[-4,-1]],.3);mpmgeL(x,[[0,-7],[0,-1]],.3);mpmgeL(x,[[3.4,-6.8],[3.4,-1]],.3);mpmgeHatch(x,-8,-6,14,5,9,1,'rgba(60,70,90,.5)');
  mpmgeP(x,[[7,-2],[12,-3.4],[12.4,-.4],[7,-.4]],{c:1,f:'#b4b8c0',sd:4,w:.1});mpmgeP(x,[[12,-4],[15.4,-3.4],[15.4,-.4],[12,-.4]],{c:1,f:'#7a7c84',sd:5,w:.1});mpmgeP(x,[[-1,-6.4],[2,-9],[5,-7]],{l:.5,w:.1});mpmgeP(x,[[2,-9],[5,-8],[6,-7]],{c:1,f:'#c4c8cc',l:.4,w:.1,sd:2});
  mpmgeP(x,[[-14,-1],[-14,-8],[-12,-10.4],[-10,-8],[-10,-1]],{c:1,f:'#c4c8cc',sd:6,w:.15});mpmgeL(x,[[-14,-5],[-10,-5]],.4);mpmgeL(x,[[-13.4,-5],[-13.4,-7.4]],.2);mpmgeP(x,[[-12,-10.4],[-13.6,-14],[-10.4,-13.6],[-9.4,-10.6]],{c:1,f:MPL.VERM,sd:2,w:.1,l:.4});
  for(let i=0;i<3;i++){const u=-12+i*4,v=-17-i*3,z=1.2+i*.5;mpmgeL(x,[[u-z,v-z],[u+z,v-z],[u-z,v+z],[u+z,v+z]],.4)}})}
function mpmgeCandles(x,a,b,s,d,o){mpmgeT(x,a,b,s,d,(x,o)=>{
  const n=o.n||1;mpmgeE(x,0,-1,5,1.3,'#b8902c');mpmgeP(x,[[-1,-1],[-.6,-6],[.6,-6],[1,-1]],{c:1,f:'#c8a030',s:1,sd:2,w:.1});
  const cs=n===1?[0]:n===2?[-4,4]:[-6,0,6];
  if(n>1){mpmgeP(x,[[-7,-9],[-5,-6.4],[0,-6],[5,-6.4],[7,-9]],{l:.7,w:.1,k:MPL.INK});mpmgeP(x,[[-7,-9],[-5,-6.4],[0,-6],[5,-6.4],[7,-9]],{l:.4,k:'#c8a030',w:.1})}
  cs.forEach((u,i)=>{const y=n>1?(u===0?-6.4:-9):-6,h=7-(i%2);mpmgeP(x,[[u-1.2,y],[u-1.2,y-h],[u+1.2,y-h],[u+1.2,y]],{c:1,f:'#f4eed8',s:1,sd:i+3,w:.1,l:.4});mpmgeP(x,[[u+1.2,y-h],[u+1.8,y-h+2.4]],{l:.3,w:0,k:'#e8dcb0'});mpmgeP(x,[[u,y-h-.4],[u-1.4,y-h-2.4],[u,y-h-4.6],[u+1.4,y-h-2.4]],{c:1,f:'#f4c840',sd:i,w:0,l:.35});mpmgeP(x,[[u,y-h-1.2],[u-.5,y-h-2.4],[u,y-h-3.4]],{c:1,f:'#fff2b0',l:0,w:0});
    x.save();x.strokeStyle='rgba(240,200,60,.5)';x.lineWidth=.3;for(let k=0;k<6;k++){const an=k/6*6.28;x.beginPath();x.moveTo(u+Math.cos(an)*3.4,y-h-2.4+Math.sin(an)*3.4);x.lineTo(u+Math.cos(an)*4.4,y-h-2.4+Math.sin(an)*4.4);x.stroke()}x.restore()})},o||{})}
function mpmgeRaven(x,a,b,s,d,o){mpmgeT(x,a,b,s,d,(x,o)=>{
  if(!o.noperch){mpmgeP(x,[[-10,-1],[-3,-3],[6,-2.4],[13,-3.6]],{l:1.4,w:.3,k:'#5a3a24'});mpmgeP(x,[[-10,-1],[-3,-3],[6,-2.4],[13,-3.6]],{l:.7,w:.3,k:'#8a6a44'});mpmgeP(x,[[8,-2.6],[10,-6],[12,-6.6]],{l:.5,w:.1,k:'#5a3a24'})}
  mpmgeP(x,[[-1,-4],[-8,-3.6],[-12,-.6],[-6,-2],[-1,-2]],{c:1,f:'#2e2836',sd:5,w:.15});mpmgeP(x,[[-4,-4],[-9,-5.4],[-10,-3]],{c:1,f:'#2e2836',sd:6,w:.1});
  mpmgeL(x,[[-1,-3.6],[-1.4,-1],[-2,0]],.5);mpmgeL(x,[[2,-3.4],[2.2,-1],[1.6,0]],.5);
  mpmgeP(x,[[-4,-4],[-1,-10],[4,-12],[7,-10],[6,-5],[2,-2.6]],{c:1,f:'#38303e',sd:3,w:.2});mpmgeP(x,[[-1,-8],[-4,-5],[1,-4]],{l:.3,k:'#8a7a96',w:.1});
  mpmgeP(x,[[5.6,-11],[10,-10.6],[11.4,-9.6],[7,-8.6]],{c:1,f:'#241e2a',sd:2,w:.1});mpmgeEye(x,6,-11,.9,1);mpmgeD(x,6.4,-11,.4,'#e8d060');mpmgeL(x,[[4,-9],[5,-8.6]],.25,'#6a5a76')},o||{})}
function mpmgeSkullCandle(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeL(x,[[-6,0],[6,0]],.5);mpmgeP(x,[[-4,0],[-4.6,-5],[-3,-9],[0,-10],[3,-9],[4.6,-5],[4,0],[2,-1.4],[-2,-1.4]],{c:1,f:mpmgeC.bone,sd:4,w:.2});mpmgeE(x,-1.8,-5.4,1.2,1.4,'#2a1a14',0,0);mpmgeE(x,1.8,-5.4,1.2,1.4,'#2a1a14',0,0);mpmgeP(x,[[0,-3.8],[-.5,-2.6],[.5,-2.6]],{c:1,f:'#2a1a14',l:0,w:0});for(const u of [-1,0,1])mpmgeL(x,[[u,-2.2],[u,-.6]],.25);
  mpmgeP(x,[[-1,-9.6],[-1,-15],[1,-15],[1,-9.6]],{c:1,f:'#f4eed8',s:1,sd:4,w:.1,l:.4});mpmgeP(x,[[1,-12],[2,-10],[1.2,-8.6]],{l:.3,k:'#e8dcb0',w:0});mpmgeP(x,[[0,-15.4],[-1.4,-17.4],[0,-19.6],[1.4,-17.4]],{c:1,f:'#f4c840',sd:5,w:0,l:.35});mpmgeP(x,[[0,-16.4],[-.5,-17.6],[0,-18.6]],{c:1,f:'#fff2b0',l:0,w:0})})}
function mpmgeHourglass(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-5,-1],[-5,-2.6],[5,-2.6],[5,-1]],{c:1,f:'#8a5a34',s:1,sd:2,w:.1});mpmgeP(x,[[-5,-17.4],[-5,-19],[5,-19],[5,-17.4]],{c:1,f:'#8a5a34',s:1,sd:3,w:.1});mpmgeL(x,[[-4.4,-2.6],[-4.4,-17.4]],.9,'#6a4224');mpmgeL(x,[[4.4,-2.6],[4.4,-17.4]],.9,'#6a4224');
  mpmgeP(x,[[-3.4,-3],[3.4,-3],[.5,-9.2],[3.4,-17],[-3.4,-17],[-.5,-9.2]],{c:1,f:'rgba(200,225,240,.5)',s:1,sd:5,w:.1,l:.4});mpmgeP(x,[[-3,-3.2],[3,-3.2],[1.4,-6.4],[-1.4,-6.4]],{c:1,f:'#e0c070',l:0,w:0,s:1});mpmgeP(x,[[-.6,-9],[.6,-9],[.8,-14.4],[-.8,-14.4]],{c:1,f:'#e0c070',l:0,w:0,s:1});mpmgeL(x,[[0,-9],[0,-6.6]],.25,'#c8a030')})}
function mpmgeCoffin(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-5,0],[-7,-10],[-4,-24],[4,-24],[7,-10],[5,0]],{c:1,f:'#8a6a44',s:1,sd:3,w:.15});mpmgeP(x,[[-3,-2],[-4.4,-10],[-2.4,-21],[2.4,-21],[4.4,-10],[3,-2]],{c:1,f:'#3a2a24',s:1,sd:4,w:0,l:.3});
  mpmgeP(x,[[-3,-5],[-3,-23],[4,-26.6],[8.6,-22],[5.6,-6]],{c:1,f:'#a07a50',s:1,sd:7,w:.1,l:.5});mpmgeL(x,[[0,-14],[0,-20]],.3,MPL.GOLD);mpmgeL(x,[[-2,-17],[2,-17]],.3,MPL.GOLD);
  mpmgeE(x,-1.6,-12,.9,1.1,'#f4f0e4',0,.3);mpmgeE(x,1.6,-12,.9,1.1,'#f4f0e4',0,.3);mpmgeD(x,-1.4,-12,.4);mpmgeD(x,1.8,-12,.4);
  mpmgeP(x,[[3,-7],[7,-6],[9.4,-9],[10.6,-13]],{l:1.2,w:.1});mpmgeP(x,[[3,-7],[7,-6],[9.4,-9],[10.6,-13]],{l:.7,k:mpmgeC.bone,w:.1});for(const [u,v] of [[10.6,-14],[11.6,-13.6],[9.6,-13.8]])mpmgeL(x,[[u-.2,v+1],[u,v-1.2]],.5)})}
function mpmgeCrown(x,a,b,s,d,o){mpmgeT(x,a,b,s,d,(x,o)=>{
  const g=o.pale?'#e8d890':MPL.GOLD;mpmgeP(x,[[-8,0],[-9,-10],[-4.6,-6],[0,-13],[4.6,-6],[9,-10],[8,0]],{c:1,f:g,sd:3,w:o.pale?.5:.15,s:1,l:.5});mpmgeP(x,[[-8,0],[-8.2,-3],[8.2,-3],[8,0]],{c:1,f:o.pale?'#d8c880':'#a8801c',s:1,sd:4,w:.1,l:.4});
  for(const [u,v,c] of [[-5,-1.6,MPL.VERM],[0,-1.6,MPL.LAPIS],[5,-1.6,MPL.VERD]])mpmgeD(x,u,v,.9,c);for(const [u,v] of [[-9,-11],[0,-14],[9,-11]])mpmgeD(x,u,v,1.1,o.pale?'#f4eac0':MPL.GOLD2);
  x.save();x.strokeStyle='rgba(240,200,60,.7)';x.lineWidth=.35;for(const [u,v,r] of [[-12,-12,1.6],[12,-7,1.4],[3,-18,1.6]]){x.beginPath();x.moveTo(u-r,v);x.lineTo(u+r,v);x.moveTo(u,v-r);x.lineTo(u,v+r);x.stroke()}x.restore()},o||{})}
/* a toy horse on wheels, a little crooked, in pale paint */
function mpmgeToyHorse(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  const k='rgba(70,60,90,.85)';mpmgeP(x,[[-9,-6],[-9,-11],[2,-12],[2,-6]],{c:1,f:'#f0e4d0',s:1,sd:2,w:.6,l:.45,k});mpmgeP(x,[[-1,-11],[2,-18],[7,-20],[9,-16],[5,-15],[3,-11]],{c:1,f:'#f0e4d0',sd:3,w:.6,l:.45,k});
  mpmgeP(x,[[-1,-11.4],[1.6,-18.4],[4,-18.8]],{l:.5,k:'#d86a70',w:.5});mpmgeD(x,6.6,-17.4,.5,'#4a3a5a');mpmgeP(x,[[6.4,-20],[5.4,-24],[7.4,-21]],{c:1,f:'#f0e4d0',l:.4,k,w:.3,sd:2});mpmgeP(x,[[-9,-9],[-12,-7],[-12,-3]],{l:.5,k:'#d86a70',w:.5});
  mpmgeL(x,[[-7,-6],[-7,-2.4]],.5,k);mpmgeL(x,[[0,-6],[0,-2.4]],.5,k);mpmgeL(x,[[-8.6,-2.4],[1.4,-2.4]],.5,k);
  for(const u of [-7,0]){mpmgeE(x,u,-1.6,2,2,'#c8805a',0,.45);mpmgeD(x,u,-1.6,.5,'#4a3a5a')}mpmgeP(x,[[8,-16],[11,-12],[12,-3]],{l:.3,k:'rgba(70,60,90,.6)',w:.5});mpmgeD(x,12,-2.4,.8,'#d86a70');mpmgeE(x,-3,-9,2.4,.8,'#d8c070',0,.3)})}
/* the Child-King's own drawing: a house, a sun, and a king with a big crown, in wax crayon */
function mpmgeChildDraw(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-14,0],[-15,-22],[15,-23],[14,-1]],{c:1,f:'#f6f0e0',s:1,sd:2,w:.5,l:.4,k:'rgba(70,60,90,.7)'});mpmgeL(x,[[-8,-22.4],[-8.6,-24.4]],.3,'rgba(70,60,90,.5)');
  const cr=(pts,c,l)=>mpmgeP(x,pts,{l:l||.7,k:c,w:.7,sd:5});
  cr([[-12,-3],[-11.6,-9],[-5,-8.6],[-5.4,-3],[-12,-3.6]],'#c8604a');cr([[-12.6,-9],[-8.4,-14],[-4.4,-9]],'#c8604a');cr([[-9.6,-3],[-9.6,-6],[-7.6,-6],[-7.6,-3]],'#7a5a3a');
  x.save();x.strokeStyle='#e8c040';x.lineWidth=.7;x.beginPath();x.arc(9,-16.4,2.6,0,6.3);x.stroke();for(let i=0;i<8;i++){const an=i/8*6.28;x.moveTo(9+Math.cos(an)*3.6,-16.4+Math.sin(an)*3.6);x.lineTo(9+Math.cos(an)*5,-16.4+Math.sin(an)*5)}x.stroke();x.restore();
  cr([[2,-4],[2,-11]],'#5a4a8a');cr([[2,-8],[-.6,-6]],'#5a4a8a');cr([[2,-8],[4.6,-6]],'#5a4a8a');cr([[2,-4],[.4,-1.4]],'#5a4a8a');cr([[2,-4],[3.6,-1.4]],'#5a4a8a');
  x.save();x.strokeStyle='#5a4a8a';x.lineWidth=.7;x.beginPath();x.arc(2,-13.2,2.2,0,6.3);x.stroke();x.restore();mpmgeD(x,1.2,-13.6,.35,'#5a4a8a');mpmgeD(x,2.8,-13.6,.35,'#5a4a8a');
  cr([[-.4,-15.2],[-.6,-19],[.6,-16.8],[2,-19.6],[3.4,-16.8],[4.6,-19],[4.4,-15.2]],'#e8c040',.8)})}
function mpmgeSpinTop(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  const k='rgba(70,60,90,.85)';mpmgeP(x,[[-5,-8],[5,-8],[3,-3],[0,0],[-3,-3]],{c:1,f:'#d8806a',sd:4,w:.4,l:.45,k});mpmgeL(x,[[-4,-6],[4,-6]],.4,'#f0e4d0');mpmgeL(x,[[-3,-4],[3,-4]],.4,'#f0e4d0');mpmgeL(x,[[0,-8],[0,-13]],.6,k);mpmgeL(x,[[-3,-14],[3,-12]],.3,'rgba(70,60,90,.5)');mpmgeL(x,[[-5,-11],[-7,-12]],.3,'rgba(70,60,90,.5)')})}
function mpmgeBlocks(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  const k='rgba(70,60,90,.85)';mpmgeP(x,[[-8,0],[-8,-6],[-1,-6],[-1,0]],{c:1,f:'#e8c070',s:1,sd:2,w:.5,l:.45,k});mpmgeP(x,[[1,0],[1,-6],[8,-6],[8,0]],{c:1,f:'#8ab0d8',s:1,sd:3,w:.5,l:.45,k});mpmgeP(x,[[-4,-6],[-4,-12],[3,-12],[3,-6]],{c:1,f:'#d8806a',s:1,sd:4,w:.5,l:.45,k});mpmgeD(x,-4.6,-3,.9,k);mpmgeL(x,[[4,-4.4],[6,-1.6]],.5,k);mpmgeL(x,[[6,-4.4],[4,-1.6]],.5,k);mpmgeL(x,[[-1,-9.8],[1.8,-8],[-1,-6.8]],.45,k)})}
function mpmgeWiz2(x,a,b,s,d){mpmgeWizard(x,a,b,s,d,{col:'#5a3a7a'})}
function mpmgeOwl(x,a,b,s,d){mpmgeT(x,a,b,s,d,(x)=>{
  mpmgeP(x,[[-6,-1],[-7,-9],[-4,-15],[4,-15],[7,-9],[6,-1]],{c:1,f:'#a8906c',sd:4,w:.2});mpmgeE(x,0,-7,3.6,4.8,'#e4d4b0',0,0);for(let i=0;i<3;i++)mpmgeP(x,[[-2.4,-9+i*2.6],[0,-7.8+i*2.6],[2.4,-9+i*2.6]],{l:.3,w:0});
  mpmgeP(x,[[-4,-14.6],[-5,-18.4],[-1.6,-15.4]],{c:1,f:'#a8906c',sd:2,l:.4,w:0});mpmgeP(x,[[4,-14.6],[5,-18.4],[1.6,-15.4]],{c:1,f:'#a8906c',sd:3,l:.4,w:0});
  mpmgeE(x,-2.2,-12.2,2.2,2.2,'#f4ecd0');mpmgeE(x,2.2,-12.2,2.2,2.2,'#f4ecd0');mpmgeD(x,-2,-12.2,1,'#e8b020');mpmgeD(x,2,-12.2,1,'#e8b020');mpmgeD(x,-2,-12.2,.5);mpmgeD(x,2,-12.2,.5);mpmgeP(x,[[-.8,-11],[0,-9.2],[.8,-11]],{c:1,f:'#d89030',l:.3,w:0,sd:2});
  mpmgeL(x,[[-2,-1],[-2,0]],.5);mpmgeL(x,[[2,-1],[2,0]],.5);mpmgeL(x,[[-9,0],[9,0]],.5,'#5a3a1c')})}
/* what goes where. slots: T top gap (x about 200-320), L lower left (14-84), R right of the compass (392-466), B bottom strip */
const MPMGE_SPIRE={
 440:[['T',x=>mpmgeBat(x,258,22,.9,1,{})],['L',x=>mpmgeMouseStair(x,50,296,1.15,1)],['R',x=>mpmgeCandles(x,405,296,1.1,1,{n:1})]],
 441:[['T',x=>mpmgeSpiderHang(x,262,5,14,1)],['L',x=>mpmgeRaven(x,48,296,1.5,1,{})],['R',x=>mpmgeCandles(x,405,296,1.1,1,{n:2})]],
 442:[['T',x=>mpmgeBat(x,240,24,.8,-1,{})],['L',x=>mpmgeKnightAsleep(x,46,296,1.25,1)],['R',x=>mpmgeMouse(x,405,296,1.0,-1,{cheese:1})]],
 443:[['T',x=>mpmgeWeb(x,200,6,30,1,1)],['L',x=>mpmgeSkeleton(x,44,296,1.35,1,{})],['R',x=>mpmgeCandles(x,405,296,1.1,1,{n:3})]],
 444:[['T',x=>mpmgeRaven(x,262,34,.85,1,{})],['L',x=>mpmgeMouseStair(x,76,296,.7,-1)],['R',x=>mpmgeHourglass(x,405,296,1.2,1)]],
 445:[['T',x=>{mpmgeBat(x,240,22,.7,1,{});mpmgeBat(x,282,28,.55,-1,{})}],['L',x=>mpmgeWizard(x,38,296,1.05,1,{col:'#3c4c90'})],['R',x=>mpmgeCandles(x,405,296,1.1,1,{n:3})]],
 446:[['T',x=>mpmgeGargoyle(x,262,34,.9,1)],['L',x=>mpmgeKnightAsleep(x,46,296,1.25,-1)],['R',x=>mpmgeSkullCandle(x,405,296,1.3,1)]],
 447:[['T',x=>mpmgeSpiderHang(x,236,5,16,1)],['L',x=>mpmgeSkeleton(x,40,296,1.35,-1,{book:'#3a5a8a'})],['R',x=>mpmgeRaven(x,405,296,1.0,-1,{})]],
 448:[['T',x=>mpmgeBat(x,258,20,.9,1,{hang:1})],['L',x=>mpmgeGargoyle(x,48,296,1.5,1)],['R',x=>mpmgeWeb(x,466,205,26,-1,1)]],
 449:[['T',x=>mpmgeGhost(x,260,34,.9,1,{})],['L',x=>mpmgeOwl(x,40,296,1.7,1)],['R',x=>mpmgeCandles(x,405,296,1.1,1,{n:2})]],
 450:[['T',x=>mpmgeRaven(x,262,34,.85,-1,{})],['L',x=>mpmgeCoffin(x,40,296,1.5,1)],['R',x=>mpmgeSkullCandle(x,405,296,1.3,-1)]],
 451:[['T',x=>mpmgeGargoyle(x,262,34,.9,-1)],['L',x=>mpmgeGhost(x,40,296,1.7,1,{})],['R',x=>mpmgeHourglass(x,405,296,1.2,-1)]],
 452:[['T',x=>{mpmgeBat(x,236,22,.7,1,{});mpmgeBat(x,262,16,.7,-1,{hang:1});mpmgeBat(x,290,24,.6,1,{})}],['L',x=>mpmgeSkeleton(x,44,296,1.35,1,{crown:1})],['R',x=>mpmgeGhost(x,405,296,1.1,-1,{})]],
 453:[['T',x=>mpmgeGhost(x,262,34,.9,-1,{})],['L',x=>mpmgeKnightAsleep(x,46,296,1.25,1)],['R',x=>mpmgeRaven(x,405,296,1.0,1,{})]],
 454:[['T',x=>{mpmgeRaven(x,236,34,.7,1,{noperch:1});mpmgeRaven(x,290,34,.7,-1,{})}],['L',x=>mpmgeGhost(x,36,296,1.6,1,{chain:1})],['R',x=>mpmgeCandles(x,405,296,1.1,1,{n:3})]],
 455:[['T',x=>mpmgeGargoyle(x,262,34,.9,1)],['L',x=>mpmgeWizard(x,38,296,1.3,1,{col:'#5a3a7a'})],['R',x=>mpmgeSkullCandle(x,405,296,1.3,1)]],
 456:[['T',x=>mpmgeGhost(x,262,34,.9,1,{crown:1})],['L',x=>mpmgeCoffin(x,40,296,1.5,-1)],['R',x=>mpmgeCrown(x,405,296,1.2,1,{})]],
 457:[['T',x=>mpmgeGhost(x,236,34,.8,1,{})],['L',x=>mpmgeSkeleton(x,44,296,1.35,1,{crown:1})],['R',x=>mpmgeRaven(x,405,296,1.0,-1,{})],['T',x=>mpmgeGhost(x,290,34,.7,-1,{crown:1})]],
 458:[['T',x=>mpmgeCrown(x,262,34,1.1,1,{})],['L',x=>mpmgeGhost(x,40,296,1.7,1,{teddy:1,crown:1})],['R',x=>mpmgeHourglass(x,405,296,1.2,1)]],
 459:[['T',x=>mpmgeCrown(x,262,34,1.15,1,{pale:1})],['L',x=>mpmgeToyHorse(x,44,296,1.7,1)],['R',x=>mpmgeChildDraw(x,405,296,1.0,1)],['B',x=>{mpmgeSpinTop(x,170,297,.9,1);mpmgeBlocks(x,205,297,.8,1)}]]
};
for(const id in MPMGE_SPIRE)mpmgAdd([+id],function(x,L){for(const [slot,fn] of MPMGE_SPIRE[id]){x.save();try{fn(x)}catch(e){console.error('marginalia spire',id,slot,e)}x.restore()}});
