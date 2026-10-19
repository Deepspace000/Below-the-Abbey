/* Marginalia for the area maps (see mpmgAdd in maps_common.js). Names in this file start with mpmgb.
   Artist B: Ironhill road, tunnel, town, mines, moor, burial ground, Greyfang pass, witch's hut, hermit's cave, old vault, watchtower, Hollow Land.
   Every creature is drawn facing right with its feet at (0,0), about 10 to 28 units tall; mpmgbV places it (centre x, ground y, scale, flip, seed). */
let mpmgbN=1;
const MPMGBW={earth:'#b99a66',brown:'#8a5a30',grey:'#9a948a',pale:'#f6eed8',pink:'#dca08a',yel:'#e8c238',dark:'#4a3a2a',lilac:'#cfc4e4',green:'#6f9a52',red:'#b8321e',bone:'#efe6cc',stone:'#a8a296',ink:'#2a2a38',ginger:'#c98a3a',water:'#9ab8d0',violet:'#7a5a9a'};
function mpmgbJ(a,b){return(hash2(Math.round(a*8)+mpmgbN*31,Math.round(b*8),77)-.5)*.5}
function mpmgbPath(x,p,closed,sharp){
  const q=p.map(a=>[a[0]+mpmgbJ(a[0],a[1]),a[1]+mpmgbJ(a[1],a[0])]),n=q.length;
  x.beginPath();
  if(sharp||n<3){x.moveTo(q[0][0],q[0][1]);for(let i=1;i<n;i++)x.lineTo(q[i][0],q[i][1]);if(closed)x.closePath();return}
  if(closed){x.moveTo((q[n-1][0]+q[0][0])/2,(q[n-1][1]+q[0][1])/2);for(let i=0;i<n;i++){const a=q[i],b=q[(i+1)%n];x.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2)}x.closePath()}
  else{x.moveTo(q[0][0],q[0][1]);for(let i=1;i<n-1;i++){const a=q[i],b=q[i+1];x.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2)}x.lineTo(q[n-1][0],q[n-1][1])}
}
function mpmgbF(x,p,f,sharp){mpmgbPath(x,p,true,sharp);if(f){x.save();x.globalAlpha=.7;x.fillStyle=f;x.fill();x.restore()}x.stroke()}
function mpmgbS(x,p,sharp){mpmgbPath(x,p,false,sharp);x.stroke()}
function mpmgbE(x,cx,cy,rx,ry,f){const p=[];for(let i=0;i<10;i++){const a=i/10*6.2832;p.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry])}mpmgbF(x,p,f)}
function mpmgbD(x,cx,cy,r,c){x.save();x.fillStyle=c||MPL.INK;x.beginPath();x.arc(cx,cy,r,0,6.2832);x.fill();x.restore()}
function mpmgbEye(x,cx,cy,r){x.save();x.fillStyle=MPMGBW.pale;x.beginPath();x.arc(cx,cy,r,0,6.2832);x.fill();x.lineWidth*=.7;x.stroke();x.restore();mpmgbD(x,cx+r*.25,cy,r*.5)}
function mpmgbH(x,x0,y0,x1,y1,n,dx,dy){x.save();x.lineWidth*=.6;for(let i=0;i<n;i++){const t=(i+.5)/n,a=x0+(x1-x0)*t,b=y0+(y1-y0)*t;x.beginPath();x.moveTo(a,b);x.lineTo(a+dx,b+dy);x.stroke()}x.restore()}
function mpmgbV(x,cx,cy,s,fl,fn,seed){s*=1.3;x.save();x.translate(cx,cy);x.scale(fl?-s:s,s);x.lineWidth=.55/s;x.lineJoin='round';x.lineCap='round';x.strokeStyle=MPL.INK;mpmgbN=seed||1;try{fn(x)}finally{x.restore()}}
function mpmgbGround(x,w,y){y=y||0;mpmgbS(x,[[-w,y],[-w*.4,y+.3],[w*.3,y-.2],[w,y+.2]]);x.save();x.lineWidth*=.6;for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(i*w*.4,y);x.lineTo(i*w*.4-1.2,y-1.6);x.moveTo(i*w*.4,y);x.lineTo(i*w*.4+.4,y-1.9);x.stroke()}x.restore()}
function mpmgbPick(x,x0,y0,x1,y1,L){const dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,nx=-uy,ny=ux;x.save();x.lineWidth*=1.5;x.strokeStyle=MPMGBW.brown;mpmgbS(x,[[x0,y0],[x1,y1]],1);x.restore();
  mpmgbS(x,[[x1+nx*L-ux*1.6,y1+ny*L-uy*1.6],[x1+nx*L*.55,y1+ny*L*.55],[x1+ux*.6,y1+uy*.6],[x1-nx*L*.55,y1-ny*L*.55],[x1-nx*L-ux*1.6,y1-ny*L-uy*1.6]])}

/* ---- creatures ---- */
function mpmgbMole(x,pk){
  mpmgbS(x,[[-8,-2],[-11,-3.5],[-13,-1.5]]);
  mpmgbF(x,[[-8,0],[-9,-5],[-5,-10],[1,-11.5],[6,-9],[9,-6.5],[13,-5.8],[9.5,-4],[8,-1],[5,0],[-1,.3]],MPMGBW.brown);
  mpmgbH(x,-6,-8,2,-10,5,-1,2);mpmgbD(x,13,-5.8,.8,MPMGBW.pink);mpmgbD(x,8.2,-7.6,.55);
  mpmgbE(x,-2,.2,2.2,1,MPMGBW.pink);mpmgbE(x,4,.2,2.2,1,MPMGBW.pink);
  mpmgbF(x,[[4,-4],[7,-5],[9,-3.5],[7,-2.3],[4.5,-2.6]],MPMGBW.pink);
  if(pk)mpmgbPick(x,6,-4,11,-15,4.2);
}
function mpmgbCage(x){mpmgbS(x,[[0,0],[0,-3]]);mpmgbS(x,[[-2.6,-3],[2.6,-3]]);mpmgbF(x,[[-3,-3],[-4,-9],[4,-9],[3,-3]],null,1);for(let i=-2;i<=2;i++)mpmgbS(x,[[i*1.2,-3],[i*1.5,-9]]);mpmgbF(x,[[-3.5,-9],[0,-11.5],[3.5,-9]],MPMGBW.gold||'#c9a227',1);
  mpmgbE(x,0,-5.5,1.7,1.4,MPMGBW.yel);mpmgbF(x,[[1.6,-5.8],[3.2,-5.4],[1.7,-5.1]],MPMGBW.ginger,1);mpmgbD(x,.8,-6,.35);mpmgbS(x,[[-1.5,-5.5],[-3,-4.6]])}
function mpmgbDwarf(x,prop){
  mpmgbF(x,[[-4,0],[-4,-2.6],[-.5,-2.6],[-.5,0]],MPMGBW.brown);mpmgbF(x,[[1,0],[1,-2.6],[4.4,-2.6],[5,0]],MPMGBW.brown);
  mpmgbF(x,[[-5,-3],[-4.5,-11],[4.5,-11],[5,-3]],MPL.LAPIS);mpmgbS(x,[[-4.8,-6.5],[4.8,-6.5]]);mpmgbD(x,0,-6.5,.7,MPL.GOLD);
  mpmgbE(x,0,-14,3.3,3.2,MPMGBW.pink);mpmgbD(x,1.6,-14.4,.5);mpmgbD(x,-.9,-14.4,.5);mpmgbD(x,2.7,-13.3,.8,'#c98a70');
  mpmgbF(x,[[-3.2,-13.2],[-3,-8.6],[0,-6.2],[3,-8.6],[3.2,-13.2],[0,-11.6]],MPMGBW.ginger);mpmgbH(x,-2,-11.5,2,-11.5,4,0,3);
  mpmgbF(x,[[-3.9,-16],[-1,-22.5],[1.4,-23],[3.9,-16]],MPL.VERM);mpmgbS(x,[[-4,-16],[4,-16]]);
  mpmgbS(x,[[3.5,-10],[6.5,-12],[7.5,-14]]);
  if(prop==='pick')mpmgbPick(x,6,-9,10,-21,4.5);
  else if(prop==='hammer'){x.save();x.lineWidth*=1.5;x.strokeStyle=MPMGBW.brown;mpmgbS(x,[[7.5,-14],[9,-23]],1);x.restore();mpmgbF(x,[[6,-24.5],[11.5,-23.5],[11.5,-20.5],[6,-21.5]],MPMGBW.stone,1)}
  else if(prop==='cage'){x.save();x.translate(7.5,-14);x.scale(1,1);mpmgbCage(x);x.restore()}
}
function mpmgbHare(x,o){o=o||{};
  mpmgbF(x,[[-8,0],[-9,-5],[-5,-9],[0,-9.5],[4,-8],[5,0]],MPMGBW.earth);mpmgbS(x,[[-9,-3],[-11,-4]]);mpmgbE(x,-9.4,-3.4,1.5,1.5,MPMGBW.pale);
  mpmgbE(x,-5,-2,3,2.2,MPMGBW.earth);mpmgbF(x,[[-3,0],[-3,-1.5],[1,-1.5],[3,0]],MPMGBW.earth);
  mpmgbE(x,4.5,-11.2,3,2.6,MPMGBW.earth);mpmgbD(x,5.5,-11.8,.55);mpmgbD(x,7.4,-11,.6);mpmgbS(x,[[6,-10.4],[8,-10.2]]);
  mpmgbF(x,[[2.8,-12.5],[2,-19],[3.4,-19.5],[4.8,-13]],MPMGBW.earth);mpmgbF(x,[[4.8,-12.8],[6.8,-18.5],[7.8,-18],[6.4,-12.3]],MPMGBW.earth);
  mpmgbH(x,-6,-8,2,-8.5,5,-1,2.2);
  if(o.horn){mpmgbF(x,[[7.4,-10.2],[11,-8],[14,-4],[13,-3],[11,-5.5],[8,-8.5]],MPMGBW.pale,1);mpmgbS(x,[[10.5,-7.5],[8.5,-9.2]]);mpmgbS(x,[[14,-3.3],[15.4,-3]])}
  if(o.apron){mpmgbF(x,[[-3,-6],[3,-6],[4,-1],[-3,-1]],MPMGBW.ginger);mpmgbS(x,[[-3,-6],[0,-9.6],[3,-6]])}
}
function mpmgbAnvil(x){mpmgbF(x,[[-6,-8],[6,-8],[8,-6.5],[4.5,-5.5],[2.5,-4],[3,-1.5],[5,0],[-5,0],[-3,-1.5],[-2.5,-4],[-4.5,-5.5],[-8.5,-6]],MPMGBW.stone,1);mpmgbS(x,[[-5,-7],[5,-7]]);mpmgbH(x,-2,-3,2,-3,3,0,2)}
function mpmgbSparks(x,cx,cy){x.save();x.strokeStyle=MPL.GOLD;for(let i=0;i<6;i++){const a=-.3-i*.5,l=2+hash2(i,3,5)*2;x.beginPath();x.moveTo(cx+Math.cos(a)*1.2,cy+Math.sin(a)*1.2);x.lineTo(cx+Math.cos(a)*(1.2+l),cy+Math.sin(a)*(1.2+l));x.stroke()}x.restore()}
function mpmgbRaven(x){
  mpmgbF(x,[[-6,-5],[-11,-3],[-10,-1.5],[-5,-3]],MPMGBW.ink,1);
  mpmgbF(x,[[-6,-5],[-2,-9],[3,-8.5],[6,-6.5],[9,-7.2],[6.5,-5],[3,-2.4],[-3,-2.8]],MPMGBW.ink);
  mpmgbF(x,[[8.4,-7.4],[12,-6.2],[8,-5.6]],MPMGBW.grey,1);mpmgbD(x,7,-6.6,.7,MPMGBW.pale);mpmgbD(x,7.1,-6.6,.3);
  mpmgbS(x,[[-4,-5.5],[0,-6.2],[3,-4.2]]);mpmgbS(x,[[-1,-3],[-1,0]]);mpmgbS(x,[[2,-3],[2.5,0]]);mpmgbS(x,[[-2.2,0],[-1,0],[.2,0]]);mpmgbS(x,[[1.3,0],[2.5,0],[3.7,0]])
}
function mpmgbStone(x,w,h,cross){w=w||4;h=h||12;mpmgbF(x,[[-w,0],[-w,-h+w*.8],[-w*.6,-h+.4],[0,-h],[w*.6,-h+.4],[w,-h+w*.8],[w,0]],MPMGBW.stone);
  if(cross){mpmgbS(x,[[0,-h+2],[0,-h*.45]],1);mpmgbS(x,[[-w*.5,-h*.72],[w*.5,-h*.72]],1)}else mpmgbH(x,-w*.5,-h*.5,w*.5,-h*.5,3,0,2)}
function mpmgbSkull(x,r){r=r||3.5;mpmgbE(x,0,-r*1.05,r,r*1.05,MPMGBW.bone);mpmgbF(x,[[-r*.6,-r*.3],[-r*.55,0],[r*.55,0],[r*.6,-r*.3]],MPMGBW.bone,1);mpmgbD(x,-r*.4,-r*1.1,r*.28);mpmgbD(x,r*.4,-r*1.1,r*.28);mpmgbS(x,[[0,-r*.8],[-r*.1,-r*.55],[r*.1,-r*.55]]);for(let i=-1;i<=1;i++)mpmgbS(x,[[i*r*.3,-r*.3],[i*r*.3,0]],1)}
function mpmgbSkel(x,bell){
  mpmgbS(x,[[0,-9.8],[0,-4]]);for(let i=0;i<3;i++)mpmgbS(x,[[-3.8+i*.3,-8.8+i*1.6],[0,-7.6+i*1.6],[3.8-i*.3,-8.8+i*1.6]]);
  mpmgbS(x,[[3.4,-8.6],[7,-11],[8,-14.5]]);mpmgbS(x,[[8,-14.5],[7,-17],[8.2,-17.6],[9.4,-16.6]],1);mpmgbS(x,[[8,-14.5],[9.6,-16.8]],1);
  mpmgbS(x,[[-3.4,-8.6],[-7,-6.5],[-7.6,-3]]);
  if(bell){mpmgbF(x,[[-9.3,-3],[-9,-6],[-6,-6],[-5.7,-3]],MPL.GOLD,1);mpmgbD(x,-7.5,-2.5,.6)}
  x.save();x.translate(0,-9.6);mpmgbSkull(x,3.4);x.restore();mpmgbS(x,[[-2.6,-9.6],[2.6,-9.6]],1);
}
function mpmgbMound(x,w){mpmgbF(x,[[-w,0],[-w*.7,-2.6],[0,-4.2],[w*.7,-2.6],[w,0]],MPMGBW.earth);mpmgbH(x,-w*.5,-1,w*.5,-1,6,-.8,-1.5)}
function mpmgbGhost(x,candle){
  mpmgbF(x,[[-5,0],[-5.5,-8],[-3,-14],[0,-15.8],[3,-14],[5.5,-8],[5.2,-.5],[3.6,-2.6],[2,.3],[.4,-2.4],[-1.2,.3],[-2.8,-2.4],[-4,.2]],'#e6eef8');
  mpmgbE(x,-1.7,-10.5,1.2,1.7,MPL.INK);mpmgbE(x,1.8,-10.5,1.2,1.7,MPL.INK);mpmgbE(x,0,-6.5,1,1.6,MPL.INK);
  mpmgbS(x,[[5.3,-8],[8,-9.5],[8.6,-12]]);mpmgbS(x,[[-5.3,-8],[-7.4,-6],[-8,-4]]);
  if(candle){mpmgbF(x,[[7.4,-12],[9.6,-12],[9.4,-17],[7.6,-17]],MPMGBW.pale,1);mpmgbF(x,[[8,-17],[8.5,-20.2],[9,-17]],MPMGBW.yel,1)}
}
function mpmgbWolfHead(x,mitre){
  mpmgbF(x,[[0,-1.5],[2.6,-4],[3.8,-3],[8,-2],[8.6,-.6],[5,.5],[1.6,2.5]],MPMGBW.grey);mpmgbF(x,[[2,-3.6],[2.8,-7],[4.2,-3.4]],MPMGBW.grey);
  mpmgbD(x,4.2,-1.8,.55);mpmgbD(x,8.4,-.9,.8);mpmgbS(x,[[8,.6],[5,1.4]]);mpmgbF(x,[[7.4,.9],[7.6,3],[6.2,1.6]],MPMGBW.pink,1);mpmgbS(x,[[8,-.2],[7.4,.9]],1);
  if(mitre){mpmgbF(x,[[1.2,-4.2],[2,-10],[3.4,-4.8]],MPMGBW.pale);mpmgbS(x,[[1.7,-6.5],[2.7,-6.5]],1);mpmgbD(x,2.4,-8,.4,MPL.VERM)}
}
function mpmgbWolf(x,o){o=o||{};
  mpmgbF(x,[[-8,-6],[-12,-8.5],[-13.5,-11],[-10.5,-8.4],[-7.5,-4.5]],MPMGBW.grey);
  mpmgbF(x,[[-8,-6],[-5,-9],[2,-9.2],[6,-8],[7,-5],[5,-3],[-4,-3],[-7,-4]],MPMGBW.grey);mpmgbH(x,-6,-8,4,-8.5,7,-1.5,2.4);
  for(const lx of [-6,-3,3,5.5]){mpmgbS(x,[[lx,-3.4],[lx+.3,-1.5],[lx,0]]);mpmgbS(x,[[lx-1,0],[lx+.8,0]])}
  x.save();x.translate(5.5,-7.5);if(o.howl)x.rotate(-.95);mpmgbWolfHead(x,o.mitre);x.restore();
}
function mpmgbSheep(x){
  for(const [a,b] of [[-3,-6],[0,-7.4],[3,-6],[-2,-4.5],[2,-4.5]])mpmgbE(x,a,b,2.4,2.2,MPMGBW.pale);
  mpmgbE(x,6,-6.5,1.8,2,MPMGBW.dark);mpmgbD(x,6.5,-6.9,.4,MPMGBW.pale);
  mpmgbS(x,[[-2,-2.6],[-2,0]]);mpmgbS(x,[[2,-2.6],[2,0]]);mpmgbS(x,[[-3,0],[-1,0]]);mpmgbS(x,[[1,0],[3,0]]);
}
function mpmgbWitch(x){
  mpmgbF(x,[[-6,0],[-4.5,-10],[4.5,-10],[6,0]],'#4a3a68');mpmgbH(x,-4,-8,4,-8,5,-.5,5);
  mpmgbE(x,0,-14,3.2,3.5,'#cfe0b0');mpmgbF(x,[[2.8,-14.6],[6.2,-13],[3,-12.6]],'#cfe0b0');mpmgbD(x,1.8,-15,.5);mpmgbD(x,3.6,-13.5,.45,MPL.VERM);mpmgbS(x,[[-3,-12],[-4.5,-9],[-3.5,-7]]);mpmgbS(x,[[-1,-12.5],[-1.5,-10]]);
  mpmgbF(x,[[-4.6,-17.2],[0,-30],[3,-28],[4.6,-17.2]],'#4a3a68');mpmgbE(x,0,-17.4,7.5,1.5,'#4a3a68');mpmgbS(x,[[-3.6,-19.5],[3.8,-19.8]]);mpmgbF(x,[[-1,-19.6],[1,-19.6],[1,-18.4],[-1,-18.4]],MPL.GOLD,1);
  mpmgbS(x,[[4,-9],[7.5,-8],[9,-10]]);
}
function mpmgbBroom(x){x.save();x.lineWidth*=1.4;x.strokeStyle=MPMGBW.brown;mpmgbS(x,[[-10,-3],[11,-5]],1);x.restore();mpmgbF(x,[[-9,-3],[-16,-6.5],[-15,-.5],[-16.5,-1.5],[-9,-3.8]],MPMGBW.earth,1);mpmgbH(x,-15,-3.5,-10,-3.3,4,0,1.4)}
function mpmgbCauldron(x,flame){
  if(flame){mpmgbF(x,[[-4,0],[-3,-4.5],[-1.5,-1.5],[0,-6],[1.5,-1.5],[3,-4],[4,0]],MPL.VERM,1);mpmgbF(x,[[-1.6,0],[0,-3.2],[1.6,0]],MPMGBW.yel,1)}
  mpmgbS(x,[[-4,-4],[-6,-1.5]]);mpmgbS(x,[[4,-4],[6,-1.5]]);
  mpmgbF(x,[[-6,-14],[-7.5,-9],[-4.5,-4.6],[4.5,-4.6],[7.5,-9],[6,-14]],MPMGBW.ink);mpmgbE(x,0,-14,6.3,1.6,'#6a6a70');mpmgbS(x,[[-5,-8],[-2,-6.6]],1);
  for(const [a,b,r] of [[-2,-18,1.1],[1.5,-20.5,1.6],[-.5,-23.5,.9]]){x.save();x.beginPath();x.arc(a,b,r,0,6.3);x.stroke();x.restore()}
}
function mpmgbCat(x,arch){
  mpmgbS(x,[[-4,-1],[-8,-1.5],[-9.5,-5],[-8,-8]]);
  mpmgbF(x,[[-4,0],[-5,-5],[-3,-9],[0,-10],[2,-8],[3,0]],MPMGBW.ginger);mpmgbH(x,-3.5,-7,2,-8,4,-.6,2);
  mpmgbE(x,1.8,-11.4,3,2.6,MPMGBW.ginger);mpmgbF(x,[[-.4,-13],[-.2,-15.8],[1.8,-13.5]],MPMGBW.ginger);mpmgbF(x,[[2.2,-13.4],[4,-15.6],[4.2,-12.4]],MPMGBW.ginger);
  mpmgbD(x,.9,-11.7,.5,MPMGBW.green);mpmgbD(x,3.2,-11.7,.5,MPMGBW.green);mpmgbD(x,2.1,-10.6,.35,MPMGBW.pink);mpmgbS(x,[[3,-10.6],[6,-10.2]],1);mpmgbS(x,[[3,-10.2],[5.6,-9.4]],1);
  mpmgbS(x,[[-1,0],[3,0]]);
}
function mpmgbHermit(x){
  mpmgbF(x,[[-6.5,0],[-5.5,-6],[-2.5,-11.5],[2.5,-11.5],[5.5,-6],[6.5,0]],MPMGBW.dark);mpmgbH(x,-4,-3,4,-3,5,-.4,-4);
  mpmgbF(x,[[-3.4,-11],[-3.8,-16],[0,-18.2],[3.8,-16],[3.4,-11],[0,-9.6]],MPMGBW.dark);
  mpmgbE(x,.3,-14,2.2,2.4,MPMGBW.pink);mpmgbD(x,1.1,-14.4,.4);mpmgbD(x,-.6,-14.4,.4);mpmgbF(x,[[-2,-13.2],[-2.2,-9.5],[.3,-7.6],[2.5,-9.5],[2.4,-13],[.3,-11.8]],MPMGBW.pale);
  mpmgbF(x,[[2.5,-8],[5.5,-7.4],[5,-5.6],[2,-6.3]],MPMGBW.pink,1);
  x.save();x.lineWidth*=1.4;x.strokeStyle=MPMGBW.brown;mpmgbS(x,[[8,0],[8.4,-18]],1);x.restore();
}
function mpmgbBook(x){mpmgbF(x,[[-4,0],[-4,-4.5],[0,-5.5],[4,-4.5],[4,0],[0,-1]],MPL.VERM);mpmgbS(x,[[0,-1],[0,-5.5]]);mpmgbH(x,-3.4,-2,-.8,-2.5,3,0,-1.2);mpmgbH(x,.8,-2.5,3.4,-2,3,0,-1.2)}
function mpmgbSnail(x){
  mpmgbF(x,[[-11,0],[-10,-2],[0,-2.4],[6,-2.6],[8,-5],[8.3,-9],[9.4,-9.2],[9.6,-5.5],[11.5,-3.4],[13,-1.5],[12.5,0]],MPMGBW.earth);mpmgbH(x,-9,-1,5,-1.2,7,0,-.8);
  mpmgbS(x,[[8.3,-9],[7.7,-12.4]]);mpmgbS(x,[[9.4,-9.2],[10.6,-12.2]]);mpmgbD(x,7.7,-12.7,.8);mpmgbD(x,10.7,-12.5,.8);mpmgbS(x,[[11.4,-3.6],[12.6,-4]]);
  mpmgbE(x,-3,-7,6.5,6,MPMGBW.yel);const p=[];for(let i=0;i<=22;i++){const a=i*.62,r=.4+i*.24;p.push([-3+Math.cos(a)*r,-7+Math.sin(a)*r*.95])}mpmgbS(x,p)
}
function mpmgbKnight(x,o){o=o||{};
  mpmgbS(x,[[-1.5,0],[-1.2,-4]]);mpmgbS(x,[[1.5,0],[2,-4]]);mpmgbS(x,[[-2.6,0],[-1,0]]);mpmgbS(x,[[1,0],[3,0]]);
  mpmgbF(x,[[-2.6,-4],[-2.4,-9],[2.4,-9],[2.8,-4]],o.col||MPMGBW.stone);mpmgbH(x,-2,-8,2,-8,4,0,3);
  mpmgbE(x,0,-11.2,2.1,2.2,MPMGBW.stone);mpmgbS(x,[[-.2,-11.6],[2,-11.6]],1);mpmgbS(x,[[1,-12],[1,-10.4]],1);
  if(o.plume)mpmgbF(x,[[-1,-13.4],[-3.5,-16],[-.8,-15],[1.2,-16.5],[1,-13.4]],MPL.VERM,1);
  if(o.hood)mpmgbF(x,[[-2.6,-10.4],[0,-15.5],[2.6,-10.4]],MPMGBW.dark,1);
  mpmgbF(x,[[-3.8,-8],[-3.8,-4.8],[-2.2,-3.4],[-.6,-4.8],[-.6,-8]],MPL.VERM);
  if(o.lance){x.save();x.lineWidth*=1.2;x.strokeStyle=MPMGBW.brown;mpmgbS(x,[[-1,-6],[15,-8.5]],1);x.restore();mpmgbF(x,[[15,-8.1],[18.5,-8.7],[15,-9.1]],MPMGBW.stone,1)}
  if(o.sword){mpmgbS(x,[[2,-8],[5,-9],[6.5,-15]],1)}
}
function mpmgbPig(x){
  mpmgbS(x,[[-8,-6],[-10.5,-7],[-9.8,-9.2],[-11,-9]]);
  mpmgbF(x,[[-8,-3],[-7,-8],[0,-9.8],[6,-8.6],[8.4,-5.6],[7.6,-2.4],[-6,-2.4]],MPMGBW.pink);
  mpmgbE(x,9.4,-6.3,2.4,2.5,MPMGBW.pink);mpmgbE(x,11.5,-5.2,1.5,1.3,MPMGBW.pink);mpmgbD(x,11.2,-5.2,.3);mpmgbD(x,12,-5.2,.3);mpmgbF(x,[[8,-8.5],[7.6,-11.6],[10,-9]],MPMGBW.pink);mpmgbD(x,9.9,-7,.45);
  for(const lx of [-6,-3,3,6]){mpmgbS(x,[[lx,-2.6],[lx,0]]);mpmgbS(x,[[lx-.8,0],[lx+.8,0]])}
}
function mpmgbMonk(x,sit){
  mpmgbF(x,[[-3,0],[-2.6,-8],[2.6,-8],[3,0]],MPMGBW.brown);mpmgbS(x,[[-2.8,-4.5],[2.8,-4.5]]);
  mpmgbE(x,0,-10.5,2.2,2.3,MPMGBW.pink);mpmgbS(x,[[-2,-11.8],[-1,-12.6],[1,-12.6],[2,-11.8]],1);mpmgbD(x,1,-10.8,.4);mpmgbD(x,-.6,-10.8,.4);mpmgbS(x,[[.2,-9.5],[1.6,-9.6]],1);
  mpmgbS(x,[[2.4,-6.5],[5.5,-9],[6,-12]]);
}
function mpmgbCrozier(x,len){x.save();x.lineWidth*=1.3;x.strokeStyle=MPL.GOLD;mpmgbS(x,[[0,0],[0,-len],[1.8,-len-2.6],[4,-len-1.6],[3.4,-len+.4]],1);x.restore()}
function mpmgbChest(x){mpmgbF(x,[[-6,0],[-6,-6],[6,-6],[6,0]],MPMGBW.brown);mpmgbF(x,[[-6,-6],[-5,-9.4],[5,-9.4],[6,-6]],MPMGBW.brown);mpmgbS(x,[[-6,-6],[6,-6]]);mpmgbS(x,[[-2.5,-9.4],[-2.5,0]],1);mpmgbS(x,[[2.5,-9.4],[2.5,0]],1);mpmgbF(x,[[-1,-7.4],[1,-7.4],[1,-4.8],[-1,-4.8]],MPL.GOLD,1)}
function mpmgbOwl(x){
  mpmgbF(x,[[-5,0],[-6.5,-6],[-5.5,-11],[-4.4,-14.6],[-2,-12.8],[0,-13.4],[2,-12.8],[4.4,-14.6],[5.5,-11],[6.5,-6],[5,0]],MPMGBW.brown);
  for(let r=0;r<3;r++)for(let c=-1;c<=1;c++)mpmgbS(x,[[c*2.4-1,-5.6+r*2.2],[c*2.4,-4.4+r*2.2],[c*2.4+1,-5.6+r*2.2]]);
  mpmgbEye(x,-2.5,-9.4,2.1);mpmgbEye(x,2.5,-9.4,2.1);mpmgbS(x,[[-4.6,-11.6],[-1.2,-10.6]],1);mpmgbS(x,[[4.6,-11.6],[1.2,-10.6]],1);
  mpmgbF(x,[[-.9,-8.4],[0,-6.2],[.9,-8.4]],MPMGBW.yel,1);mpmgbS(x,[[-2.5,0],[-2.5,.8]],1);mpmgbS(x,[[2.5,0],[2.5,.8]],1);
}
function mpmgbGoat(x){
  mpmgbF(x,[[-7,-5.5],[-5,-9],[3,-9.2],[6,-8],[6,-5],[3,-3.5],[-5,-3.8]],MPMGBW.pale);mpmgbH(x,-5,-8,3,-8,6,-1,2);
  mpmgbF(x,[[5,-8.5],[7,-12],[9,-12.8],[11,-11.3],[10.3,-10],[8.5,-10],[7,-7]],MPMGBW.pale);mpmgbF(x,[[9.6,-10.4],[10,-7.4],[8.8,-9.6]],MPMGBW.pale,1);
  mpmgbS(x,[[7.6,-12.6],[6,-15.2],[3.8,-16],[2.4,-15]]);mpmgbF(x,[[7,-11.5],[5.6,-12.4],[6.8,-12.9]],MPMGBW.pale,1);mpmgbD(x,9,-11.4,.45);mpmgbD(x,11,-11.3,.5);
  for(const lx of [-5.5,-3,3,5.5]){mpmgbS(x,[[lx,-4],[lx+.2,-2],[lx,0]]);mpmgbF(x,[[lx-.8,0],[lx-.6,-.9],[lx+.8,-.9],[lx+1,0]],MPMGBW.dark,1)}
  mpmgbS(x,[[-7,-6],[-8.6,-8]]);
}
function mpmgbCrag(x,w,h){mpmgbF(x,[[-w,0],[-w*.55,-h*.7],[-w*.2,-h*.55],[w*.05,-h],[w*.45,-h*.5],[w*.7,-h*.6],[w,0]],MPMGBW.stone,1);mpmgbH(x,-w*.5,-h*.3,w*.5,-h*.3,7,-1,2.4);mpmgbH(x,-w*.3,-h*.7,w*.1,-h*.8,3,-.8,1.8);mpmgbS(x,[[w*.05,-h],[w*.05+.4,-h*.8],[w*.2,-h*.62]],1)}
function mpmgbBat(x){
  const wing=[[1,-1],[3,-3.6],[6,-4.4],[9,-2.6],[8,-.4],[6,-1.6],[4.2,.2],[2,-.4]];
  mpmgbF(x,wing,MPMGBW.ink);mpmgbF(x,wing.map(a=>[-a[0],a[1]]),MPMGBW.ink);mpmgbE(x,0,-.6,1.6,2.1,MPMGBW.ink);
  mpmgbF(x,[[-1.4,-2.2],[-1.2,-4],[-.2,-2.8]],MPMGBW.ink,1);mpmgbF(x,[[1.4,-2.2],[1.2,-4],[.2,-2.8]],MPMGBW.ink,1);mpmgbD(x,-.6,-1.1,.35,MPMGBW.pale);mpmgbD(x,.6,-1.1,.35,MPMGBW.pale);
}
function mpmgbSpider(x){
  mpmgbS(x,[[0,-2],[0,-34]],1);
  for(const sg of [-1,1])for(let i=0;i<4;i++){const y=-.8+i*.8;mpmgbS(x,[[sg*1.4,y],[sg*(3.6+i*.3),y-3.4+i*.4],[sg*(6+i*.4),y+1+i*.6]],1)}
  mpmgbE(x,0,0,2.2,2.6,MPMGBW.ink);mpmgbE(x,0,-3,1.4,1.4,MPMGBW.ink);mpmgbD(x,-.5,-3.2,.35,MPMGBW.pale);mpmgbD(x,.5,-3.2,.35,MPMGBW.pale);mpmgbD(x,0,.6,.7,MPL.VERM);
}
function mpmgbRat(x){
  mpmgbS(x,[[-7,-2],[-10,-3],[-11.5,-1],[-13,-1.6]]);
  mpmgbF(x,[[-7,0],[-6.5,-4.5],[-2,-6.2],[3,-5.6],[6,-3.6],[9.4,-2.8],[6.6,-1.4],[4,0]],MPMGBW.grey);
  mpmgbF(x,[[3.5,-5.6],[3.8,-8.2],[5.6,-5]],MPMGBW.pink);mpmgbD(x,6.6,-3.6,.5);mpmgbD(x,9.4,-2.8,.6,MPMGBW.pink);mpmgbS(x,[[8,-2.6],[11.6,-3.6]],1);mpmgbS(x,[[8,-2.2],[11.4,-1.4]],1);
  mpmgbS(x,[[-4,0],[-4,-2]]);mpmgbS(x,[[2,0],[2,-2]]);mpmgbS(x,[[-5,0],[-3,0]]);mpmgbS(x,[[1,0],[3,0]]);
}
function mpmgbCoffin(x,w){const h=w*.32;mpmgbF(x,[[-w,-h*.6],[-w*.7,-h*1.25],[w*.7,-h*1.25],[w,-h*.6],[w*.7,0],[-w*.7,0]],MPMGBW.brown,1);mpmgbS(x,[[0,-h*1.1],[0,-h*.1]],1);mpmgbS(x,[[-w*.2,-h*.8],[w*.2,-h*.8]],1)}
function mpmgbRatBearer(x){
  mpmgbF(x,[[-2.5,0],[-3,-5],[-1,-8],[2,-8],[3,-5],[2.5,0]],MPMGBW.grey);mpmgbE(x,1.4,-10,2.2,1.8,MPMGBW.grey);mpmgbD(x,3.8,-10,.5,MPMGBW.pink);mpmgbD(x,2,-10.4,.35);mpmgbF(x,[[.2,-11.5],[.4,-13.6],[2,-11.6]],MPMGBW.pink);
  mpmgbS(x,[[2.6,-7],[4.4,-9.4],[4.6,-12]]);mpmgbS(x,[[-2.6,0],[-1,0]]);mpmgbS(x,[[1,0],[2.6,0]]);mpmgbS(x,[[-2.8,-1],[-6.5,-2.5],[-8,-1.5]]);
}
function mpmgbHeron(x){
  mpmgbS(x,[[-1,0],[-1.2,-9]]);mpmgbS(x,[[1,0],[1.4,-9]]);mpmgbS(x,[[-2.4,0],[-.4,0]]);mpmgbS(x,[[.4,0],[2.4,0]]);
  mpmgbF(x,[[-6,-13],[-3,-10],[3,-10],[5,-12],[2,-14],[-3,-15]],MPMGBW.pale);mpmgbF(x,[[-6,-13],[-10,-12.5],[-6.5,-11.8]],MPMGBW.grey,1);
  mpmgbS(x,[[3,-12.6],[5.4,-16],[3.6,-20],[5.4,-23]]);mpmgbE(x,5.6,-24,1.6,1.3,MPMGBW.pale);mpmgbF(x,[[7,-24.3],[13,-23.4],[7,-23.1]],MPMGBW.yel,1);mpmgbD(x,6,-24.4,.4);mpmgbS(x,[[4,-25],[2,-27]],1);
  mpmgbS(x,[[-3,-12],[1,-12.4],[3,-11]],1);
}
function mpmgbTower(x){ // broken watchtower, front elevation
  mpmgbF(x,[[-9,0],[-9,-26],[-7,-27],[-7,-30],[-4.4,-30],[-4.4,-27],[-2,-26.4],[-1,-23.4],[1.4,-24],[2.6,-28],[5.2,-27.4],[5.4,-30],[7.4,-30],[7.4,-26],[9,-25],[9,0]],MPMGBW.stone,1);
  for(let r=0;r<7;r++){const y=-3.5*(r+1);mpmgbS(x,[[-9,y],[9,y]],1)}
  for(let r=0;r<7;r++)for(let c=0;c<3;c++){const xx=-6+c*6+(r%2)*3,y=-3.5*r;mpmgbS(x,[[xx,y],[xx,y-3.5]],1)}
  mpmgbF(x,[[-1.2,-13],[-1.2,-19],[1.2,-19],[1.2,-13]],MPMGBW.ink,1);mpmgbF(x,[[-2.6,0],[-2.6,-6],[0,-8],[2.6,-6],[2.6,0]],MPMGBW.dark);
  mpmgbS(x,[[9,-3],[10,-8],[8,-12],[9.4,-17]],1);for(const [a,b] of [[10,-8],[8,-12],[9.4,-17]])mpmgbF(x,[[a,b],[a+2.2,b-1.2],[a+1.6,b+1.2]],MPMGBW.green,1);
}
function mpmgbBird(x){mpmgbF(x,[[-4,-2],[0,-3.6],[3,-2.6],[5.4,-3.6],[4,-1.6],[1,0],[-3,-.8]],MPMGBW.brown);mpmgbS(x,[[-1,-3.2],[-2,-6.4],[1,-4]]);mpmgbS(x,[[-4,-2],[-6,-1]]);mpmgbD(x,3.6,-2.6,.4,MPMGBW.pale)}
function mpmgbArcher(x){
  mpmgbS(x,[[-1,0],[-1,-5]]);mpmgbS(x,[[1.4,0],[1.6,-5]]);mpmgbF(x,[[-2.6,-4.6],[-2.2,-10],[2.4,-10],[2.8,-4.6]],MPMGBW.green);
  mpmgbE(x,0,-12,2.1,2.2,MPMGBW.pink);mpmgbF(x,[[-2.4,-12],[-1.6,-15.2],[1.4,-15.4],[2.6,-12.6]],MPMGBW.green);mpmgbD(x,1,-12.2,.4);
  mpmgbS(x,[[2,-9.4],[7,-10]]);x.save();x.lineWidth*=1.2;x.strokeStyle=MPMGBW.brown;mpmgbS(x,[[8,-4],[10,-10],[8,-16]]);x.restore();mpmgbS(x,[[8,-4],[6.2,-10],[8,-16]],1);
  mpmgbS(x,[[6,-10],[24,-14]],1);mpmgbS(x,[[24,-14],[22,-14.8]],1);mpmgbS(x,[[24,-14],[22.6,-13]],1);
}
/* the Hollow Land: pale strange things, washed in lilac and violet */
function mpmgbHeadLegs(x){
  mpmgbS(x,[[-2,-7],[-4,-3],[-3.6,0],[-5.4,0]]);mpmgbS(x,[[2,-7],[4,-3],[3.6,0],[5.4,0]]);
  mpmgbE(x,0,-11,5,5.6,MPMGBW.lilac);mpmgbE(x,-1.9,-11.4,1.5,1.9,MPL.INK);mpmgbE(x,1.9,-11.4,1.5,1.9,MPL.INK);mpmgbD(x,-1.6,-11.9,.45,MPMGBW.pale);mpmgbD(x,2.2,-11.9,.45,MPMGBW.pale);
  mpmgbS(x,[[-1.6,-8],[0,-7.3],[1.6,-8]],1);mpmgbS(x,[[-1,-16],[-1.4,-18.4]],1);mpmgbS(x,[[1,-16],[1.8,-18.6]],1);mpmgbS(x,[[.2,-9.6],[.6,-8.8]],1);
}
function mpmgbMitreFish(x){
  mpmgbS(x,[[-1,-4],[-1.4,-.6],[-3,0]]);mpmgbS(x,[[2,-4],[2.4,-.6],[4,0]]);
  mpmgbF(x,[[-11,-6],[-8,-10],[-9,-12],[-5,-10.6],[1,-12],[7,-9],[10.4,-6.4],[7,-3.6],[1,-3.2],[-5,-3.6]],MPMGBW.lilac);
  mpmgbS(x,[[-8,-6],[-6,-8.6],[-4,-6.4],[-2,-8.6]],1);mpmgbH(x,-4,-6,5,-5.6,6,0,1.5);
  mpmgbF(x,[[5,-10],[6,-15.6],[9,-9.4]],MPMGBW.pale);mpmgbS(x,[[6,-13],[7.4,-12.4]],1);mpmgbD(x,6.8,-14,.5,MPL.VERM);
  mpmgbEye(x,7,-7.5,1.2);mpmgbS(x,[[8,-5.2],[10.4,-6]],1);x.save();x.translate(-7,0);mpmgbCrozier(x,10);x.restore();
}
function mpmgbLongNeck(x){
  mpmgbS(x,[[-1,0],[-1.3,-4]]);mpmgbS(x,[[1.4,0],[1.7,-4]]);mpmgbF(x,[[-5,-8],[-3,-4.2],[3,-4],[5,-7],[3,-9.4],[-3,-10]],MPMGBW.lilac);mpmgbH(x,-3,-5,3,-5,5,0,1.5);
  mpmgbS(x,[[2.4,-9],[5,-13],[1,-18],[5,-23],[3,-26]]);mpmgbS(x,[[3.4,-9],[6.2,-13],[2.2,-18],[6.2,-23],[4.2,-26]],1);
  mpmgbE(x,3.4,-29,3.2,3.6,MPMGBW.lilac);mpmgbF(x,[[6.2,-29.4],[9.4,-28],[6.4,-27.4]],MPMGBW.lilac);mpmgbEye(x,4.2,-30,1);mpmgbEye(x,1.6,-30,.8);mpmgbS(x,[[2,-27],[4.6,-27]],1);mpmgbS(x,[[1,-32],[2,-34.6]],1);
}
function mpmgbEyeblob(x){
  mpmgbF(x,[[-6,0],[-7.4,-5],[-5,-10],[0,-12],[5,-10],[7.4,-5],[6,0],[3,-1.4],[0,.2],[-3,-1.4]],MPMGBW.lilac);
  for(const [a,b,r] of [[0,-7,2.2],[-3.6,-4.4,1.3],[3.6,-4.2,1.5],[-2.4,-9.4,1],[2.6,-9.6,1]])mpmgbEye(x,a,b,r);mpmgbS(x,[[-1.8,-2.8],[0,-2],[1.8,-2.8]],1);
  mpmgbS(x,[[-1,-12],[-2,-15.2]],1);mpmgbD(x,-2,-15.6,.8,MPMGBW.pale);mpmgbS(x,[[2,-11.6],[3.4,-14.6]],1);mpmgbD(x,3.4,-15,.8,MPMGBW.pale);
}
function mpmgbHandWalker(x){
  mpmgbF(x,[[-4,-3],[-4.5,-8],[-3,-9],[4,-8],[4.4,-3.6],[0,-3]],MPMGBW.lilac);mpmgbS(x,[[-3,-3],[-4.6,0]],1);mpmgbS(x,[[-1,-3],[-1.6,0]],1);mpmgbS(x,[[1.2,-3],[1.8,0]],1);mpmgbS(x,[[3.4,-3.4],[5,0]],1);
  mpmgbS(x,[[-4,-6],[-7,-4.5],[-8,-2]],1);mpmgbEye(x,0,-6,1.3);mpmgbS(x,[[4,-8],[6,-12]],1)
}
function mpmgbBirdman(x){
  mpmgbS(x,[[-1,-3],[-1.4,0],[-3,0]]);mpmgbS(x,[[1.6,-3],[2,0],[3.6,0]]);
  mpmgbF(x,[[-8,-6],[-12,-11],[-10,-5],[-12.6,-5.6],[-7,-2.6]],MPMGBW.lilac,1);
  mpmgbF(x,[[-8,-3],[-6,-8],[0,-9.4],[4,-8],[4.4,-3.6],[0,-2.6]],MPMGBW.lilac);mpmgbH(x,-5,-6,2,-7,5,0,2);
  mpmgbS(x,[[2.4,-9],[3.4,-12]]);mpmgbE(x,3.6,-14.6,2.6,2.8,MPMGBW.pink);mpmgbEye(x,4.4,-15.2,.9);mpmgbS(x,[[1,-12.6],[4.8,-12.4],[6,-13.5]],1);mpmgbF(x,[[2.8,-12.4],[3.2,-10.6],[4.6,-12]],MPMGBW.ginger,1);
  mpmgbF(x,[[1.6,-16.4],[3,-20],[5,-16.6]],MPL.VERM,1);
}

function mpmgbToad(x){mpmgbF(x,[[-6,0],[-6.6,-4],[-3,-7],[2,-7.2],[6,-4.6],[6.6,0]],MPMGBW.green);mpmgbE(x,-1.6,-7.6,1.7,1.5,MPMGBW.green);mpmgbE(x,2.4,-7.6,1.7,1.5,MPMGBW.green);mpmgbEye(x,-1.6,-7.8,.9);mpmgbEye(x,2.4,-7.8,.9);mpmgbS(x,[[-4.4,-3.8],[3.6,-3.6],[6,-4.4]],1);for(const [a,b] of [[-3,-4.6],[0,-5.6],[3,-4.4]])mpmgbD(x,a,b,.5,MPMGBW.dark);mpmgbF(x,[[-6,0],[-7.4,-2],[-4.4,-.6]],MPMGBW.green,1)}
function mpmgbCart(x){mpmgbF(x,[[-8,-4],[-7,-10],[7,-10],[8,-4]],MPMGBW.brown);mpmgbS(x,[[-7.6,-6.5],[7.6,-6.5]],1);mpmgbH(x,-6,-9.5,6,-9.5,5,0,2);
  for(const [a,b,r] of [[-4,-11,2.2],[0,-12,2.6],[4,-11,2.2]])mpmgbE(x,a,b,r,r*.8,MPMGBW.stone);for(const a of [-5,5]){mpmgbE(x,a,-2,2.4,2.4,MPMGBW.stone);mpmgbD(x,a,-2,.5)}mpmgbS(x,[[-9,0],[9,0]],1)}
function mpmgbWisp(x){mpmgbE(x,0,-5,2.4,3,MPMGBW.yel);mpmgbF(x,[[-1.6,-6],[0,-12],[1.6,-6]],MPMGBW.yel,1);mpmgbS(x,[[0,-2],[1.4,-.2],[-1,1.6]],1)}
/* two rats carry a coffin */
function mpmgbCoffinRats(x){x.save();x.translate(-15,0);mpmgbRatBearer(x);x.restore();x.save();x.translate(17,0);x.scale(-1,1);mpmgbRatBearer(x);x.restore();x.save();x.translate(1,-11);mpmgbCoffin(x,14);x.restore()}
/* a creature (or pair) on a little crag */
function mpmgbOnCrag(x,w,h,fn,dy){mpmgbCrag(x,w,h);x.save();x.translate(0,-(dy||h*.75));fn(x);x.restore()}
const mpmgbSub=(x,dx,dy,sc,fl,fn)=>{x.save();x.translate(dx,dy);x.scale(fl?-sc:sc,sc);fn(x);x.restore()};

/* ---- registrations ---- */
/* 10 The Ironhill Road: mud, rain, wolves */
mpmgAdd([10],function(x){
  mpmgbV(x,56,208,.85,0,xx=>{mpmgbGround(xx,28);mpmgbSub(xx,-18,0,1,0,x2=>mpmgbKnight(x2,{lance:1,plume:1}));mpmgbSub(xx,10,0,1,0,mpmgbSnail)},1);
  mpmgbV(x,50,252,.9,0,xx=>{mpmgbGround(xx,16);mpmgbPig(xx);mpmgbSub(xx,-1,-8.5,1,0,x2=>{mpmgbMonk(x2);mpmgbSub(x2,5,-8,1,0,x3=>mpmgbCrozier(x3,7))})},2);
  mpmgbV(x,200,25,.55,0,xx=>mpmgbHare(xx,{horn:1}),3);
  mpmgbV(x,425,225,.85,1,xx=>{mpmgbGround(xx,18);mpmgbWolf(xx,{mitre:1})},4);
  mpmgbV(x,386,225,.75,0,mpmgbSheep,5);mpmgbV(x,450,225,.7,1,mpmgbSheep,6);
  mpmgbV(x,430,292,1,0,xx=>{mpmgbStone(xx,4,10,1);mpmgbSub(xx,.5,-10,1,0,mpmgbRaven)},9);
  mpmgbV(x,290,22,.5,0,mpmgbBird,10);
});
/* 11 The Ironhill Tunnel: coffins, skeletons, ghosts, bats */
mpmgAdd([11],function(x){
  mpmgbV(x,48,204,.78,0,mpmgbCoffinRats,1);
  mpmgbV(x,46,252,.95,0,xx=>{mpmgbSkel(xx,1);mpmgbMound(xx,10)},2);
  mpmgbV(x,40,292,.8,0,xx=>mpmgbGhost(xx,1),3);
  mpmgbV(x,430,226,.75,0,mpmgbSpider,4);
  mpmgbV(x,412,252,.8,0,mpmgbBat,5);mpmgbV(x,450,262,.7,1,mpmgbBat,6);
  mpmgbV(x,425,292,.9,1,xx=>{mpmgbGround(xx,10);mpmgbDwarf(xx,'cage')},7);
  mpmgbV(x,205,20,.55,0,mpmgbBat,8);mpmgbV(x,236,13,.45,0,mpmgbBat,9);mpmgbV(x,268,22,.5,1,mpmgbBat,11);
});
/* 13 Ironhill: smiths, miners, goats */
mpmgAdd([13],function(x){
  mpmgbV(x,28,198,1,0,xx=>{mpmgbGround(xx,14);mpmgbMole(xx,1)},2);
  mpmgbV(x,66,198,.9,1,xx=>{mpmgbMole(xx,0);mpmgbSub(xx,12,0,1,0,x2=>mpmgbF(x2,[[-3,0],[-2,-3],[2,-3.6],[3,0]],MPL.GOLD))},3);
  mpmgbV(x,48,248,.85,0,xx=>{mpmgbGround(xx,20);mpmgbSub(xx,-6,0,1,0,x2=>mpmgbDwarf(x2,'hammer'));mpmgbSub(xx,14,0,1,0,mpmgbAnvil)},4);
  mpmgbV(x,40,294,.7,0,xx=>mpmgbOnCrag(xx,18,12,x2=>mpmgbSub(x2,-3,0,1,0,mpmgbGoat),9),5);
  mpmgbV(x,432,252,.75,0,xx=>{mpmgbGround(xx,22);mpmgbSub(xx,-12,0,1,0,x2=>mpmgbHare(x2,{apron:1}));mpmgbSub(xx,14,0,1,0,mpmgbAnvil);xx.save();xx.lineWidth*=1.4;xx.strokeStyle=MPMGBW.brown;mpmgbS(xx,[[-8,-10],[-5,-19]],1);xx.restore();mpmgbF(xx,[[-8,-21],[-2,-19.5],[-3,-17],[-9,-18.6]],MPMGBW.stone,1);mpmgbSparks(xx,12,-9)},1);
  mpmgbV(x,430,294,.8,0,xx=>{mpmgbGround(xx,16);mpmgbCat(xx);mpmgbSub(xx,14,0,.6,1,mpmgbRat)},7);
  mpmgbV(x,200,22,.55,0,mpmgbRaven,8);mpmgbV(x,256,22,.5,1,mpmgbRaven,9);
});
/* 18 Ironhill Mines: moles, miners, a canary, a cart */
mpmgAdd([18],function(x){
  mpmgbV(x,118,64,.8,0,xx=>{mpmgbGround(xx,14);mpmgbDwarf(xx,'cage')},1);
  mpmgbV(x,215,64,.9,0,xx=>{mpmgbGround(xx,14);mpmgbMole(xx,1)},2);
  mpmgbV(x,345,64,.8,1,xx=>{mpmgbGround(xx,14);mpmgbDwarf(xx,'pick')},3);
  mpmgbV(x,150,40,.7,0,mpmgbBat,4);mpmgbV(x,305,50,.55,1,mpmgbBat,5);
  mpmgbV(x,160,292,.95,0,xx=>{mpmgbGround(xx,18);mpmgbSub(xx,-14,0,.9,0,mpmgbRatBearer);mpmgbCart(xx)},6);
  mpmgbV(x,262,292,1,0,xx=>{mpmgbSkel(xx,0);mpmgbMound(xx,10);mpmgbPick(xx,-8,-4,-12,-16,4)},7);
  mpmgbV(x,340,292,.9,1,xx=>{mpmgbGround(xx,12);mpmgbMole(xx,1)},8);
  mpmgbV(x,40,200,.9,0,xx=>{mpmgbGround(xx,16);mpmgbDwarf(xx,'pick')},9);
  mpmgbV(x,56,260,1,0,xx=>{mpmgbGround(xx,16);mpmgbMole(xx,1)},10);
  mpmgbV(x,432,170,.9,0,mpmgbOwl,11);
});
/* 19 Ironhill Moor: wolves, stones, hares, a heron */
mpmgAdd([19],function(x){
  mpmgbV(x,150,58,.8,0,xx=>{mpmgbGround(xx,16);mpmgbWolf(xx,{howl:1})},1);
  mpmgbV(x,330,58,.7,0,xx=>{mpmgbGround(xx,24);mpmgbSub(xx,-14,0,1,0,mpmgbHare);mpmgbStone(xx,3,10,0);mpmgbSub(xx,14,0,1,1,mpmgbHare)},2);
  mpmgbV(x,372,58,.8,0,xx=>{mpmgbGround(xx,14);mpmgbHermit(xx)},3);
  mpmgbV(x,150,296,.8,0,mpmgbHeron,4);
  mpmgbV(x,300,296,.9,0,mpmgbWisp,5);
  mpmgbV(x,48,285,.9,0,xx=>{mpmgbGround(xx,20);mpmgbWolf(xx,{})},6);
  mpmgbV(x,432,205,.9,1,xx=>{mpmgbGround(xx,14);mpmgbSheep(xx)},7);
  mpmgbV(x,438,226,.85,1,xx=>mpmgbWolf(xx,{}),8);
});
/* 20 Burial Ground: ravens, skeleton, ghosts */
mpmgAdd([20],function(x){
  mpmgbV(x,42,212,1.3,0,xx=>{mpmgbGround(xx,10);mpmgbStone(xx,4,10,1);mpmgbSub(xx,.5,-10,1,0,mpmgbRaven)},1);
  mpmgbV(x,50,256,.95,0,xx=>{mpmgbSkel(xx,1);mpmgbMound(xx,10)},2);
  mpmgbV(x,30,292,.8,0,xx=>mpmgbGhost(xx,0),3);mpmgbV(x,70,292,.65,1,xx=>mpmgbGhost(xx,1),4);
  mpmgbV(x,432,190,.9,0,xx=>{mpmgbGround(xx,12);mpmgbMound(xx,9);mpmgbSub(xx,0,-3,1,0,mpmgbCat)},5);
  mpmgbV(x,436,236,.9,1,mpmgbOwl,6);
  mpmgbV(x,160,293,.9,0,xx=>{mpmgbGround(xx,10);mpmgbStone(xx,3.5,9,0);mpmgbSub(xx,14,0,1,0,x2=>{mpmgbStone(x2,3.5,10,1);mpmgbSub(x2,.5,-10,1,0,mpmgbRaven)})},7);
  mpmgbV(x,290,294,.9,1,xx=>{mpmgbGround(xx,10);mpmgbToad(xx)},8);
  mpmgbV(x,330,40,.8,0,mpmgbBat,9);
});
/* 22 Greyfang Pass: goats, a wolf, a snail */
mpmgAdd([22],function(x){
  mpmgbV(x,44,262,.75,0,xx=>mpmgbOnCrag(xx,20,16,x2=>mpmgbSub(x2,2,0,1,0,mpmgbGoat),12),1);
  mpmgbV(x,440,214,.9,1,xx=>{mpmgbGround(xx,18);mpmgbSub(xx,-2,0,1,0,mpmgbMonk);mpmgbSub(xx,14,0,1,0,mpmgbGoat)},2);
  mpmgbV(x,345,50,.7,0,xx=>mpmgbOnCrag(xx,14,10,mpmgbGoat,9),3);
  mpmgbV(x,150,28,.9,1,mpmgbBat,4);
  mpmgbV(x,260,294,.9,0,xx=>{mpmgbGround(xx,20);mpmgbWolf(xx,{howl:1})},5);
  mpmgbV(x,60,292,.8,0,mpmgbSnail,6);
  mpmgbV(x,430,292,.85,0,xx=>{mpmgbGround(xx,12);mpmgbRaven(xx)},7);
});
/* 24 The Witch's Hut */
mpmgAdd([24],function(x){
  mpmgbV(x,48,172,1,0,xx=>{mpmgbGround(xx,22);mpmgbSub(xx,2,0,1,0,mpmgbWitch);mpmgbSub(xx,-6,-3,1,0,mpmgbBroom)},1);
  mpmgbV(x,48,240,1,0,xx=>{mpmgbGround(xx,20);mpmgbSub(xx,8,0,1,0,x2=>mpmgbCauldron(x2,1));mpmgbSub(xx,-12,0,1,0,mpmgbCat)},2);
  mpmgbV(x,40,292,1,0,xx=>{mpmgbGround(xx,10);mpmgbToad(xx)},3);
  mpmgbV(x,430,200,.9,0,mpmgbOwl,4);
  mpmgbV(x,425,246,1,0,xx=>{mpmgbGround(xx,12);mpmgbRaven(xx)},5);
  mpmgbV(x,430,292,.8,1,xx=>{mpmgbGround(xx,12);mpmgbHare(xx,{})},6);
  mpmgbV(x,425,92,.7,0,mpmgbBat,7);
});
/* 26 The Hermit's Cave */
mpmgAdd([26],function(x){
  mpmgbV(x,54,170,1.2,0,xx=>{mpmgbGround(xx,16);mpmgbHermit(xx);mpmgbSub(xx,12,0,1,0,x2=>mpmgbSkull(x2,2.6));mpmgbSub(xx,-11,0,1,0,mpmgbBook)},1);
  mpmgbV(x,64,222,1,0,xx=>{mpmgbGround(xx,18);mpmgbRaven(xx);mpmgbSub(xx,14,0,1,0,x2=>mpmgbF(x2,[[-2.5,-1],[0,-3],[2.5,-1],[0,0]],MPMGBW.ginger))},2);
  mpmgbV(x,40,268,.9,0,xx=>{mpmgbGround(xx,16);mpmgbRat(xx);mpmgbSub(xx,10,0,1,0,mpmgbBook)},3);
  mpmgbV(x,420,110,1,1,xx=>{mpmgbGround(xx,12);mpmgbHare(xx)},4);
  mpmgbV(x,425,180,1,0,xx=>mpmgbOnCrag(xx,14,9,mpmgbOwl,8),5);
  mpmgbV(x,180,50,.8,0,mpmgbBat,6);mpmgbV(x,330,40,.8,1,mpmgbBat,7);
  mpmgbV(x,250,40,.9,0,mpmgbSpider,8);
});
/* 27 The Old Vault: coffins, a chest, a snail guard */
mpmgAdd([27],function(x){
  mpmgbV(x,60,205,.9,0,xx=>{mpmgbGround(xx,28);mpmgbSub(xx,14,0,1,0,mpmgbChest);mpmgbSub(xx,-6,0,.9,0,mpmgbSnail);mpmgbSub(xx,-26,0,1,0,x2=>mpmgbKnight(x2,{hood:1,sword:1,col:MPMGBW.dark}))},1);
  mpmgbV(x,62,252,.8,0,mpmgbCoffinRats,2);
  mpmgbV(x,50,293,.9,0,xx=>mpmgbSkel(xx,0),3);
  mpmgbV(x,420,100,.9,0,mpmgbBat,4);
  mpmgbV(x,425,165,.9,0,xx=>mpmgbGhost(xx,1),5);
  mpmgbV(x,430,222,.95,0,xx=>{mpmgbSkel(xx,1);mpmgbMound(xx,10)},6);
  mpmgbV(x,380,40,.8,0,mpmgbSpider,7);
});
/* 28 The Ruined Watchtower: owls, an archer, jackdaws */
mpmgAdd([28],function(x){
  mpmgbV(x,56,222,1.5,0,xx=>{mpmgbGround(xx,12);mpmgbTower(xx);mpmgbSub(xx,-5.5,-30,.55,0,mpmgbOwl)},1);
  mpmgbV(x,380,128,1,0,xx=>{mpmgbGround(xx,10);mpmgbArcher(xx)},2);
  mpmgbV(x,448,100,1,0,mpmgbBird,3);
  mpmgbV(x,425,200,.95,0,xx=>{mpmgbGround(xx,14);mpmgbOwl(xx);mpmgbSub(xx,10,0,1,0,mpmgbOwl)},4);
  mpmgbV(x,425,240,.9,0,mpmgbRaven,5);
  mpmgbV(x,40,285,.9,0,xx=>{mpmgbGround(xx,16);mpmgbHare(xx,{horn:1})},6);
  mpmgbV(x,200,26,.9,0,mpmgbBat,7);mpmgbV(x,270,24,.6,1,mpmgbBat,8);
});
/* 364 The Hollow Land: strange pale hybrids */
mpmgAdd([364],function(x){
  mpmgbV(x,28,212,1.1,0,mpmgbHeadLegs,1);
  mpmgbV(x,62,212,1,1,mpmgbEyeblob,2);
  mpmgbV(x,50,258,1,0,mpmgbMitreFish,3);
  mpmgbV(x,45,296,1,0,mpmgbBirdman,4);
  mpmgbV(x,200,26,.6,0,mpmgbLongNeck,5);
  mpmgbV(x,290,22,1,0,mpmgbHandWalker,6);
  mpmgbV(x,440,240,.8,0,mpmgbHeadLegs,7);
});
