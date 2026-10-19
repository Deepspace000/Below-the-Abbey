/* Marginalia for the area maps (see mpmgAdd in maps_common.js). Names in this file start with mpmgd.
   Artist D: sea, pirates, bells, vents, lighthouse, Oldhaven. */
const MPMGD={sd:0};
function mpmgdJ(a,b,k){return(hash2(Math.round(a*10),Math.round(b*10),k||3)-.5)*.5}
/* pen: set up ink style */
function mpmgdPen(x,w){x.strokeStyle=MPL.INK;x.lineWidth=w||.55;x.lineCap='round';x.lineJoin='round'}
/* wobbly closed/open path from points, filled with col (or null) */
function mpmgdPoly(x,pts,col,close,k){x.beginPath();pts.forEach((p,i)=>{const a=p[0]+mpmgdJ(p[0],p[1],k),b=p[1]+mpmgdJ(p[1],p[0],k);i?x.lineTo(a,b):x.moveTo(a,b)});if(close!==false)x.closePath();if(col){x.fillStyle=col;x.fill()}x.stroke()}
function mpmgdBlob(x,cx,cy,rx,ry,col,rot){x.beginPath();for(let i=0;i<=16;i++){const t=i/16*6.2832,a=cx+Math.cos(t)*rx+mpmgdJ(i,rx,5)*.6,b=cy+Math.sin(t)*ry+mpmgdJ(i,ry,6)*.6;const px=rot?(cx+(a-cx)*Math.cos(rot)-(b-cy)*Math.sin(rot)):a,py=rot?(cy+(a-cx)*Math.sin(rot)+(b-cy)*Math.cos(rot)):b;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();if(col){x.fillStyle=col;x.fill()}x.stroke()}
function mpmgdDot(x,a,b,r,col){x.beginPath();x.arc(a,b,r,0,6.3);x.fillStyle=col||MPL.INK;x.fill()}
function mpmgdLine(x,a,b,c,d){x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()}
function mpmgdWave(x,a,b,w,n){x.beginPath();x.moveTo(a,b);const s=w/n;for(let i=0;i<n;i++)x.quadraticCurveTo(a+s*(i+.5),b-1.4,a+s*(i+1),b);x.stroke()}
function mpmgdGround(x,a,b,w){x.beginPath();x.moveTo(a,b);x.quadraticCurveTo(a+w/2,b-.8,a+w,b);x.stroke();for(let i=0;i<w;i+=2.4){mpmgdLine(x,a+i,b,a+i-1,b+1)}}
const MPMGD_WASH={sea:'#9fc6d0',sand:'#e6d49a',hull:'#8a5a30',sail:'#f3ead0',fish:'#c8d6c0',skin:'#f0cfa8'};
/* fish facing right; s scale */
function mpmgdFish(x,cx,cy,s,col,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.55/s);
 mpmgdPoly(x,[[-6,0],[-3,-3],[3,-2.6],[6,0],[3,2.6],[-3,3]],col||MPMGD_WASH.fish);
 mpmgdPoly(x,[[-6,0],[-10,-3.6],[-9,0],[-10,3.6]],MPL.VERM);
 mpmgdPoly(x,[[-1,-3],[1,-5],[3,-2.6]],MPL.LAPIS);
 for(let i=0;i<3;i++)for(let j=-1;j<=1;j++){x.beginPath();x.arc(-1.6+i*2,j*1.5+(i%2)*.6,1,.4,2.7);x.stroke()}
 mpmgdDot(x,4,-.6,.8,'#fff');mpmgdDot(x,4.2,-.6,.4);mpmgdLine(x,2.2,-2,2.2,2);x.restore()}
/* ship, facing right */
function mpmgdShip(x,cx,cy,s,fl,flag){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.55/s);
 mpmgdPoly(x,[[-9,-2],[9,-2.6],[7,3],[-6,3]],MPMGD_WASH.hull);
 for(let i=-5;i<=5;i+=3)mpmgdLine(x,i,-1.6,i-.4,2.6);
 mpmgdLine(x,0,-2.4,0,-17);
 mpmgdPoly(x,[[.6,-16],[8,-11],[.6,-5]],MPMGD_WASH.sail);
 mpmgdLine(x,1.6,-12,6.2,-11.6);mpmgdLine(x,3.6,-14.6,3.6,-7.4);
 mpmgdPoly(x,[[-.6,-14.6],[-6,-11],[-.6,-7.6]],MPMGD_WASH.sail);
 if(flag==='skull'){mpmgdPoly(x,[[0,-17],[-5,-18.4],[0,-20.2]],'#2a1a0c');mpmgdDot(x,-2.4,-18.7,.55,'#f3ead0')}
 else mpmgdPoly(x,[[0,-17],[-5,-18.2],[0,-19.6]],MPL.VERM);
 mpmgdPoly(x,[[-9,-2],[-11,-4.6],[-8,-2.6]],MPMGD_WASH.hull);
 x.strokeStyle=MPL.LAPIS;x.lineWidth=.6/s;mpmgdWave(x,-12,4.4,24,6);x.restore()}
/* bearded sailor head + body standing, simple */
function mpmgdSailor(x,cx,cy,s,fl,tail){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.5/s);
 if(tail){mpmgdPoly(x,[[-2,0],[2,0],[3,5],[1,9],[4,12],[0,11],[-3,13],[-2,9],[-4,5]],MPL.VERD);for(let i=0;i<4;i++){x.beginPath();x.arc(0,2+i*2,1.2,.3,2.8);x.stroke()}}
 else{mpmgdPoly(x,[[-2,0],[2,0],[2,8],[-2,8]],MPL.LAPIS);mpmgdLine(x,-1,8,-1,11);mpmgdLine(x,1,8,1,11)}
 mpmgdPoly(x,[[-2.4,-7],[2.4,-7],[3,0],[-3,0]],MPL.VERM);
 mpmgdBlob(x,0,-9.6,2.4,2.6,MPMGD_WASH.skin);
 mpmgdPoly(x,[[-2.8,-10.6],[0,-14.2],[2.8,-10.6]],MPL.LAPIS);
 mpmgdDot(x,-.9,-9.8,.3);mpmgdDot(x,.9,-9.8,.3);mpmgdLine(x,-1,-8.2,1,-8.2);
 x.restore()}
/* sea serpent with a boat in its jaws, facing right */
function mpmgdSerpent(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.55/s);
 for(let i=0;i<3;i++){x.beginPath();x.arc(-18+i*8,0,4,Math.PI,0);x.fillStyle=MPL.VERD;x.fill();x.stroke();for(let k=-2;k<=2;k++)mpmgdLine(x,-18+i*8+k*1.4,-1,-18+i*8+k*1.1,-2.6)}
 x.beginPath();x.moveTo(-6,0);x.bezierCurveTo(-3,-14,10,-14,10,-8);x.lineTo(8,-8);x.bezierCurveTo(8,-11,-1,-11,0,0);x.fillStyle=MPL.VERD;x.fill();x.stroke();
 mpmgdPoly(x,[[7,-10],[16,-12],[15,-8],[9,-6.4]],MPL.VERD);
 mpmgdPoly(x,[[9,-6.4],[15,-8],[16,-4],[10,-5]],'#8a2a20');
 mpmgdDot(x,10,-10.4,.8,'#f0d878');mpmgdDot(x,10.2,-10.4,.35);
 mpmgdPoly(x,[[8,-12],[9,-15],[10,-12]],MPL.VERM);
 mpmgdPoly(x,[[10,-7.4],[17,-6.4],[16,-4.4],[12,-4.6]],MPMGD_WASH.hull);mpmgdLine(x,14,-6.4,14,-11);mpmgdPoly(x,[[14,-11],[17,-9.4],[14,-8]],MPMGD_WASH.sail);
 mpmgdLine(x,16,-4,16.6,-2);mpmgdLine(x,15.4,-3.8,15.6,-1.6);
 x.strokeStyle=MPL.LAPIS;mpmgdWave(x,-24,1,48,12);x.restore()}
/* whale with an island on its back, facing right */
function mpmgdWhale(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.55/s);
 x.beginPath();x.moveTo(-12,0);x.bezierCurveTo(-8,-12,10,-12,13,-2);x.bezierCurveTo(14,3,6,5,-4,4);x.bezierCurveTo(-8,4,-10,2,-12,0);x.fillStyle='#8ea4b4';x.fill();x.stroke();
 mpmgdPoly(x,[[-12,0],[-17,-6],[-15,-1],[-18,2],[-12,2]],'#8ea4b4');
 x.beginPath();x.moveTo(13,0);x.quadraticCurveTo(8,2,5,2.4);x.stroke();
 mpmgdDot(x,9,-3,.8,'#fff');mpmgdDot(x,9.2,-3,.4);
 for(let i=0;i<5;i++)mpmgdLine(x,-3+i*1.6,3.6,-3.4+i*1.6,1.4);
 x.fillStyle=MPMGD_WASH.sand;x.beginPath();x.moveTo(-6,-8);x.quadraticCurveTo(-2,-12.4,2,-8);x.closePath();x.fill();x.stroke();
 mpmgdLine(x,-2,-10.6,-2,-15);mpmgdBlob(x,-2,-16.4,2.2,1.8,MPL.VERD);
 mpmgdLine(x,1,-9.6,1,-12.6);mpmgdBlob(x,1,-13.4,1.3,1.1,MPL.VERD);
 mpmgdLine(x,10,-11,10,-15);mpmgdLine(x,10,-15,8,-17);mpmgdLine(x,10,-15,12,-17);mpmgdLine(x,10,-15,10,-18);
 x.strokeStyle=MPL.LAPIS;mpmgdWave(x,-16,5,32,8);x.restore()}
function mpmgdCrab(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.5/s);
 for(const d of[-1,1]){for(let i=0;i<3;i++){mpmgdPoly(x,[[d*3,1+i*.8],[d*6,2+i*1.6],[d*7,4+i]],null,false)}
  mpmgdPoly(x,[[d*3.4,-2],[d*6,-5],[d*8,-6]],null,false);mpmgdPoly(x,[[d*7,-6.4],[d*9.6,-9],[d*8.6,-5.4],[d*10,-3.6],[d*8,-4.2]],MPL.VERM);
  mpmgdLine(x,d*1.4,-3,d*1.6,-5);mpmgdDot(x,d*1.6,-5.6,.7,'#fff');mpmgdDot(x,d*1.6,-5.6,.35)}
 mpmgdBlob(x,0,0,4.4,3,MPL.VERM);for(let i=-1;i<=1;i++)mpmgdDot(x,i*1.6,.2,.35,'#f0d878');x.restore()}
/* gull with stolen fish, flying right */
function mpmgdGull(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.5/s);
 mpmgdPoly(x,[[-4,0],[0,-1.6],[5,-.8],[7,.4],[3,1.8],[-3,1.4]],'#f6f0e0');
 mpmgdPoly(x,[[-2,-.6],[-6,-5],[-9,-5.4],[-5,-1.4]],'#f6f0e0');mpmgdPoly(x,[[0,-1],[3,-5.6],[6,-6.4],[3,-.6]],'#f6f0e0');
 mpmgdPoly(x,[[-4,0],[-9,.6],[-4,1.4]],'#d8d0bc');
 mpmgdDot(x,6,-.4,.5);mpmgdPoly(x,[[7,.2],[10,.7],[7,1.2]],MPL.GOLD);
 x.save();x.translate(10,5);x.rotate(.5);mpmgdFish(x,0,0,.55,'#c8d6c0',true);x.restore();mpmgdLine(x,9,1,9.6,3.4);x.restore()}
function mpmgdSkullFlag(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);mpmgdPen(x,.5/s);
 mpmgdLine(x,0,0,0,-16);mpmgdPoly(x,[[0,-16],[11,-14.6],[9,-12.6],[11,-10.6],[0,-9.4]],'#2a1a0c');
 mpmgdBlob(x,4.8,-13,1.7,1.5,'#f3ead0');mpmgdDot(x,4.1,-13.2,.35);mpmgdDot(x,5.5,-13.2,.35);
 x.strokeStyle='#f3ead0';x.lineWidth=.4;mpmgdLine(x,2.6,-10.8,7,-11.2);mpmgdLine(x,2.6,-11.2,7,-10.8);
 mpmgdPen(x,.5/s);mpmgdBlob(x,0,-16.4,.9,.9,MPL.GOLD);mpmgdPoly(x,[[-3,0],[3,0],[2,-2],[-2,-2]],MPMGD_WASH.hull);x.restore()}
function mpmgdBell(x,cx,cy,s,rot){x.save();x.translate(cx,cy);x.rotate(rot||0);x.scale(s,s);mpmgdPen(x,.5/s);
 x.beginPath();x.moveTo(-5,5);x.bezierCurveTo(-5,0,-3,-5,0,-5);x.bezierCurveTo(3,-5,5,0,5,5);x.closePath();x.fillStyle=MPL.GOLD;x.fill();x.stroke();
 x.strokeStyle='#8a6a10';x.lineWidth=.4;mpmgdLine(x,-4.4,2,4.4,2);mpmgdLine(x,-4,-1,4,-1);mpmgdPen(x,.5/s);
 mpmgdBlob(x,0,6.2,1,1,MPL.INK);mpmgdLine(x,0,-5,0,-7);mpmgdBlob(x,0,-7.6,1,.7,MPL.GOLD);x.restore()}
/* fish with a bell on its head, ringing */
function mpmgdBellFish(x,cx,cy,s,fl){mpmgdFish(x,cx,cy,s,'#a8c4d8',fl);const d=fl?-1:1;mpmgdBell(x,cx+d*1.5*s,cy-7*s,.5*s,.4*d);x.save();mpmgdPen(x,.4);for(const k of[1,2]){x.beginPath();x.arc(cx+d*1.5*s+d*5*s,cy-8*s,k*1.4,-.9,.9);x.stroke()}x.restore()}
function mpmgdImp(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.5/s);
 x.beginPath();x.moveTo(-3,3);x.bezierCurveTo(-8,3,-9,-3,-7,-6);x.stroke();mpmgdPoly(x,[[-7,-6],[-9.4,-8],[-5.6,-7.6]],MPL.VERM);mpmgdPoly(x,[[-7,-6],[-8,-9.6],[-5,-8]],'#f0a030');
 mpmgdBlob(x,0,0,3.4,3.8,MPL.VERM);mpmgdLine(x,-1.6,3.4,-2.2,7);mpmgdLine(x,1.6,3.4,2.2,7);mpmgdLine(x,-2.2,7,-3.6,7);mpmgdLine(x,2.2,7,3.6,7);
 mpmgdBlob(x,0,-5,2.6,2.4,MPL.VERM);mpmgdPoly(x,[[-2.4,-6.6],[-3.6,-9.6],[-1,-7.6]],'#2a1a0c');mpmgdPoly(x,[[2.4,-6.6],[3.6,-9.6],[1,-7.6]],'#2a1a0c');
 mpmgdDot(x,-.9,-5.2,.5,'#f0d878');mpmgdDot(x,.9,-5.2,.5,'#f0d878');mpmgdLine(x,-1,-3.8,1,-3.8);
 mpmgdLine(x,3,.4,8,-6);mpmgdLine(x,8,-6,8,-9);mpmgdLine(x,6.6,-9,9.4,-9);mpmgdLine(x,6.6,-9,6.6,-7.4);mpmgdLine(x,9.4,-9,9.4,-7.4);mpmgdLine(x,8,-9,8,-7.4);x.restore()}
function mpmgdLighthouse(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);mpmgdPen(x,.5/s);
 mpmgdPoly(x,[[-4,0],[4,0],[2.6,-14],[-2.6,-14]],'#f3ead0');x.fillStyle=MPL.VERM;for(const y0 of[-11,-5]){x.beginPath();x.moveTo(-3.2,y0);x.lineTo(3.2,y0);x.lineTo(3.1,y0-2.4);x.lineTo(-3.1,y0-2.4);x.fill()}
 mpmgdPoly(x,[[-3.4,-14],[3.4,-14],[3.4,-15.2],[-3.4,-15.2]],MPL.INK);mpmgdPoly(x,[[-2,-15.2],[2,-15.2],[2,-18.6],[-2,-18.6]],'#f0d878');mpmgdLine(x,0,-15.2,0,-18.6);
 mpmgdPoly(x,[[-3,-18.6],[0,-22],[3,-18.6]],MPL.LAPIS);mpmgdPoly(x,[[-1,0],[1,0],[1,-3],[-1,-3]],'#5a3a1c');
 x.strokeStyle='#e0a010';x.lineWidth=.4;for(const a of[-.3,0,.3])mpmgdLine(x,3,-17+a*4,9,-17+a*14);mpmgdLine(x,-3,-17,-9,-17);x.restore()}
function mpmgdMoth(x,cx,cy,s,rot){x.save();x.translate(cx,cy);x.rotate(rot||0);x.scale(s,s);mpmgdPen(x,.4/s);
 for(const d of[-1,1]){mpmgdPoly(x,[[0,-.6],[d*5,-3.6],[d*5.6,.6],[d*1.4,.8]],'#d8c8a0');mpmgdPoly(x,[[0,.6],[d*3.4,2],[d*2.4,4],[0,2]],'#c8b890');mpmgdDot(x,d*3.6,-1,.9,MPL.LAPIS);mpmgdDot(x,d*3.6,-1,.35,'#f0d878')
  mpmgdLine(x,d*.4,-2.6,d*1.8,-5.2);}
 mpmgdBlob(x,0,.4,.7,2.2,'#6a4a2c');x.restore()}
function mpmgdCat(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.5/s);
 x.beginPath();x.moveTo(-3.4,0);x.bezierCurveTo(-9,0,-9,-8,-6,-8);x.stroke();
 mpmgdPoly(x,[[-3.6,0],[3.6,0],[3,-7],[-3,-7]],'#d8a060');for(let i=0;i<3;i++)mpmgdLine(x,-2+i*2,-6,-2+i*2,-3);
 mpmgdBlob(x,0,-10,3.4,3,'#d8a060');mpmgdPoly(x,[[-3,-11],[-3.6,-14.4],[-1,-12.4]],'#d8a060');mpmgdPoly(x,[[3,-11],[3.6,-14.4],[1,-12.4]],'#d8a060');
 mpmgdPoly(x,[[-2.6,-12.6],[-3,-16],[-1.2,-14.2],[0,-17],[1.2,-14.2],[3,-16],[2.6,-12.6]],MPL.GOLD);mpmgdDot(x,0,-17.2,.6,MPL.VERM);mpmgdDot(x,-3,-16.2,.5,MPL.LAPIS);mpmgdDot(x,3,-16.2,.5,MPL.LAPIS);
 mpmgdDot(x,-1.2,-10.4,.5,MPL.VERD);mpmgdDot(x,1.2,-10.4,.5,MPL.VERD);mpmgdPoly(x,[[-.4,-9.2],[.4,-9.2],[0,-8.6]],'#c07080');
 mpmgdLine(x,-1,-9,-5,-9.4);mpmgdLine(x,1,-9,5,-9.4);mpmgdLine(x,-1,-8.6,-5,-8);mpmgdLine(x,1,-8.6,5,-8);
 mpmgdPoly(x,[[-3,0],[-3.4,1.4],[-1,1.4],[-.8,0]],'#d8a060');mpmgdPoly(x,[[.8,0],[1,1.4],[3.4,1.4],[3,0]],'#d8a060');x.restore()}
function mpmgdHerald(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.5/s);
 mpmgdPoly(x,[[-2.6,-7],[2.6,-7],[3.6,4],[-3.6,4]],MPL.LAPIS);mpmgdPoly(x,[[-1.6,-7],[1.6,-7],[1.6,0],[0,2],[-1.6,0]],MPL.GOLD);mpmgdLine(x,-1.4,4,-1.4,10);mpmgdLine(x,1.4,4,1.4,10);mpmgdLine(x,-1.4,10,-3,10);mpmgdLine(x,1.4,10,3,10);
 mpmgdBlob(x,0,-9.6,2.3,2.5,MPMGD_WASH.skin);mpmgdPoly(x,[[-2.8,-10.4],[-1.8,-13.6],[0,-11.6],[1.8,-13.6],[2.8,-10.4]],MPL.VERM);mpmgdDot(x,.9,-9.8,.3);mpmgdBlob(x,3,-8.6,1.2,1,'#d8a060');
 mpmgdPoly(x,[[3.6,-8.6],[16,-12],[17.4,-9.4],[16,-10.4],[4,-7.6]],MPL.GOLD);mpmgdPoly(x,[[14.6,-12],[18.6,-14],[18.4,-8],[15.6,-9.6]],MPL.GOLD);
 mpmgdPoly(x,[[10,-11.4],[10,-6],[12.4,-4.4],[14.6,-6],[14.6,-10.6]],MPL.VERM);mpmgdLine(x,11,-9,13.6,-9);x.restore()}
function mpmgdGuard(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.5/s);
 mpmgdLine(x,5,-16,5,10);mpmgdPoly(x,[[4,-16],[5,-20],[6,-16]],'#c8c8c8');
 mpmgdPoly(x,[[-2.6,-7],[2.6,-7],[3.4,3],[-3.4,3]],'#a8b0b8');for(let i=0;i<3;i++)mpmgdLine(x,-2.4,-5+i*2.4,2.4,-5+i*2.4);mpmgdLine(x,-1.4,3,-1.4,9);mpmgdLine(x,1.4,3,1.4,9);
 mpmgdPoly(x,[[-2.4,-9],[0,-14],[2.4,-9],[2.4,-8],[-2.4,-8]],'#a8b0b8');mpmgdLine(x,0,-13,0,-9);mpmgdBlob(x,0,-8.2,1.4,.9,MPMGD_WASH.skin);
 mpmgdPoly(x,[[-5,-6],[-1,-6],[-1,-1],[-3,1],[-5,-1]],MPL.VERM);mpmgdLine(x,-3,-5,-3,0);mpmgdLine(x,-4.6,-3,-1.4,-3);x.restore()}
function mpmgdStall(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);mpmgdPen(x,.5/s);
 mpmgdLine(x,-8,-7,-8,6);mpmgdLine(x,8,-7,8,6);
 for(let i=0;i<6;i++){mpmgdPoly(x,[[-9+i*3,-9],[-6+i*3,-9],[-6+i*3,-5.6],[-7.5+i*3,-4.6],[-9+i*3,-5.6]],i%2?'#f3ead0':MPL.VERM)}
 mpmgdPoly(x,[[-8,1],[8,1],[8,3.4],[-8,3.4]],MPMGD_WASH.hull);mpmgdLine(x,-6,3.4,-6,6);mpmgdLine(x,6,3.4,6,6);
 mpmgdFish(x,-4,-.4,.42,'#c8d6c0');mpmgdFish(x,.6,-.4,.42,'#d8c090',true);mpmgdBlob(x,5,-.2,1.6,1.3,'#d8a060');mpmgdBlob(x,3,.2,1.2,1,'#d8a060');x.restore()}
function mpmgdSnail(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.5/s);
 mpmgdPoly(x,[[-12,0],[10,0],[11,-3],[13,-6],[12,-1.4],[13.6,-.4],[13,1]],'#e0c090');
 mpmgdLine(x,11.2,-3.4,10.6,-8);mpmgdLine(x,12.6,-3.4,13.4,-8);mpmgdDot(x,10.6,-8.4,.7,'#f3ead0');mpmgdDot(x,13.4,-8.4,.7,'#f3ead0');
 mpmgdBlob(x,-2,-6,7,7,'#d8b070');x.beginPath();x.arc(-2,-6,4.4,0,5);x.stroke();x.beginPath();x.arc(-2,-6,2,.5,5.4);x.stroke();
 mpmgdPoly(x,[[-5,-12.4],[-5,-18],[-1,-18],[-1,-12.6]],'#b8b0a0');for(let i=0;i<3;i++)mpmgdPoly(x,[[-5.4+i*2.2,-18],[-5.4+i*2.2,-19.4],[-4.4+i*2.2,-19.4],[-4.4+i*2.2,-18]],'#b8b0a0');mpmgdLine(x,-3,-19.4,-3,-23);mpmgdPoly(x,[[-3,-23],[1.4,-22],[-3,-20.8]],MPL.VERM);
 mpmgdLine(x,1,-12,5,-5);mpmgdLine(x,-1,-12.4,3,-5.4);x.restore()}
function mpmgdMermaid(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.5/s);
 mpmgdPoly(x,[[-2,-1],[2,-1],[3,4],[1,8],[5,10],[8,8],[7,12],[1,12],[-2,8],[-3,4]],MPL.VERD);for(let i=0;i<4;i++){x.beginPath();x.arc(0,1.4+i*2,1.2,.3,2.8);x.stroke()}
 mpmgdPoly(x,[[-2.6,-8],[2.6,-8],[2,-1],[-2,-1]],MPMGD_WASH.skin);mpmgdBlob(x,0,-11,2.5,2.7,MPMGD_WASH.skin);
 mpmgdPoly(x,[[-3,-12],[-2,-14.4],[2.4,-14.4],[3,-12],[3.8,-4],[3,-2],[2.4,-8.6],[-2.4,-8.6],[-3.8,-3],[-3.2,-5]],'#d8a030');
 mpmgdDot(x,-.9,-11,.35);mpmgdDot(x,.9,-11,.35);mpmgdLine(x,-.8,-9.4,.8,-9.4);
 mpmgdLine(x,2.4,-6,6,-8);mpmgdPoly(x,[[5,-10],[9,-10],[9,-9],[5,-9]],MPL.GOLD);for(let i=0;i<5;i++)mpmgdLine(x,5.4+i*.8,-9,5.4+i*.8,-8);
 x.strokeStyle=MPL.LAPIS;mpmgdWave(x,-6,9,10,3);x.restore()}
function mpmgdVent(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);mpmgdPen(x,.5/s);
 mpmgdPoly(x,[[-7,0],[-3,-6],[3,-6],[7,0]],'#4a4a50');mpmgdLine(x,-3,-5,-2,-1);mpmgdLine(x,1,-5,2,-1);
 for(let i=0;i<5;i++){x.beginPath();x.arc(.6*Math.sin(i*2)+i*.2,-8-i*3.4,.9+i*.35,0,6.3);x.fillStyle='rgba(255,255,255,.55)';x.fill();x.stroke()}
 mpmgdFish(x,8,-12,.5,'#e8a860',false);x.restore()}
/* a small wash-free wave band */
function mpmgdBand(x,a,b,w){x.save();mpmgdPen(x,.4);x.strokeStyle=MPL.LAPIS;mpmgdWave(x,a,b,w,Math.round(w/4));x.restore()}
function mpmgdCaption(x,t,a,b){x.save();x.font='italic 5px '+(typeof FUI!=='undefined'?FUI:'serif');x.fillStyle=MPL.INK;x.textAlign='center';x.fillText(t,a,b);x.restore()}

function mpmgdFishChain(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);
 mpmgdFish(x,34,.6,.5,'#c8d6c0',false);mpmgdFish(x,24,.4,1.1,'#d8c090',false);mpmgdFish(x,0,0,2.2,'#a8c4d8',false);x.restore()}
function mpmgdMouse(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.45/s);
 x.beginPath();x.moveTo(-3,0);x.bezierCurveTo(-7,1,-6,-4,-9,-3);x.stroke();mpmgdBlob(x,0,0,3.2,2,'#b8a898');mpmgdPoly(x,[[2,-1],[5.2,.2],[2.4,1.4]],'#b8a898');
 mpmgdBlob(x,1.4,-2,1.1,1.1,'#d8a8a8');mpmgdDot(x,3.6,-.3,.4);mpmgdLine(x,-1,1.8,-1.4,3);mpmgdLine(x,1,1.8,1.4,3);x.restore()}
function mpmgdBellFrame(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);mpmgdPen(x,.5/s);
 mpmgdLine(x,-8,0,-8,-18);mpmgdLine(x,8,0,8,-18);mpmgdLine(x,-9.4,-18,9.4,-18);mpmgdLine(x,-8,-14,-4,-18);mpmgdLine(x,8,-14,4,-18);
 mpmgdLine(x,0,-18,0,-16);mpmgdBell(x,0,-11.4,.95);mpmgdLine(x,5,-9,5,-1);mpmgdLine(x,3.4,-2,5,-1);
 mpmgdMouse(x,6,.6,.9,false);x.strokeStyle=MPL.INK;mpmgdGround(x,-12,3,24);x.restore()}
function mpmgdLamp(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);mpmgdPen(x,.5/s);
 mpmgdLine(x,0,-8,0,-4);mpmgdPoly(x,[[-3,-4],[3,-4],[2,2],[-2,2]],'#f0d878');mpmgdLine(x,0,-4,0,2);mpmgdLine(x,-3,-4,3,-4);mpmgdPoly(x,[[-3.4,-4],[0,-6.4],[3.4,-4]],MPL.INK);
 x.strokeStyle='rgba(224,160,16,.7)';x.lineWidth=.35/s;for(let a=0;a<8;a++){const t=a*.785;mpmgdLine(x,Math.cos(t)*4.4,-1+Math.sin(t)*4.4,Math.cos(t)*7,-1+Math.sin(t)*7)}x.restore()}
function mpmgdImpFire(x,cx,cy,s,fl){x.save();x.translate(cx,cy);x.scale((fl?-1:1)*s,s);
 mpmgdImp(x,-5,0,1,false);mpmgdPen(x,.5);mpmgdPoly(x,[[7,3],[9,-4],[11,-1],[12,-6],[14,-1],[16,-3],[17,3]],MPL.VERM);mpmgdPoly(x,[[10,3],[12,-1],[14,3]],'#f0b030');
 mpmgdPoly(x,[[1.6,-7],[10.4,-4]],null,false);mpmgdFish(x,8.6,-5.4,.5,'#c8d6c0',false);mpmgdGround(x,-9,8,28);x.restore()}

/* ---- placements. Coordinates are sheet units (480x320); top strip is y 8-32 (x 140-320 is clear), bottom-left column is clear under the compass ---- */
mpmgAdd([290],function(x){
 mpmgdShip(x,152,28,1,false);mpmgdSailor(x,182,26,.8,false,true);
 mpmgdGull(x,226,20,1.1,true);mpmgdSerpent(x,268,28,.5,false);mpmgdWhale(x,312,28,.65,false);
 mpmgdCrab(x,16,296,.8,false);mpmgdFish(x,455,298,.9,'#c8d6c0',true)});
mpmgAdd([300],function(x){
 mpmgdSkullFlag(x,124,32,1.2);mpmgdMermaid(x,176,27,.72,false);mpmgdSerpent(x,252,28,.55,false);mpmgdGull(x,306,20,1.1,false);
 mpmgdShip(x,50,284,1.4,false,'skull');mpmgdCrab(x,456,296,.8,true)});
mpmgAdd([320],function(x){
 mpmgdMermaid(x,158,27,.72,false);mpmgdBellFish(x,222,26,1.2,true);mpmgdCrab(x,284,26,.9,false);mpmgdFish(x,316,22,1.1,'#c8d6c0',false);
 mpmgdFishChain(x,40,282,1.2,false);mpmgdCrab(x,456,296,.8,true)});
mpmgAdd([301],function(x){
 mpmgdBell(x,154,24,1.4,.3);mpmgdBellFish(x,214,26,1.4,false);mpmgdBell(x,284,24,1.2,-.3);mpmgdSailor(x,310,30,.65,false,false);
 mpmgdBellFrame(x,50,290,1.5,false);mpmgdCrab(x,454,296,.8,true)});
mpmgAdd([302],function(x){
 mpmgdImp(x,160,24,1.4,false);mpmgdImp(x,226,25,1.1,true);mpmgdSerpent(x,296,28,.55,true);
 mpmgdImpFire(x,34,288,1.4,false);mpmgdVent(x,456,296,.7)});
mpmgAdd([322],function(x){
 mpmgdVent(x,168,30,1);mpmgdFish(x,226,22,1.2,'#e8a860',false);mpmgdCrab(x,274,28,.9,false);mpmgdMermaid(x,312,27,.7,true);
 mpmgdVent(x,34,292,1.5);mpmgdFish(x,72,262,1.2,'#e8a860',true);mpmgdCrab(x,74,292,.9,true)});
mpmgAdd([303],function(x){
 mpmgdLamp(x,158,22,1.5);mpmgdMoth(x,142,16,1.3,.3);mpmgdMoth(x,174,14,1.1,-.4);mpmgdMoth(x,166,30,1,.6);
 mpmgdGull(x,236,20,1.1,false);mpmgdWhale(x,292,28,.65,true);
 mpmgdLighthouse(x,44,288,1.7);mpmgdMoth(x,22,232,1.3,.3);mpmgdMoth(x,70,226,1.1,-.5);mpmgdMoth(x,74,252,1,.6);mpmgdGull(x,80,196,1,true);mpmgdGround(x,12,290,80);mpmgdCrab(x,456,296,.8,true)});
mpmgAdd([304],function(x){
 mpmgdSerpent(x,200,28,.55,false);mpmgdGull(x,262,22,1.2,true);mpmgdWhale(x,310,28,.6,false);
 mpmgdStall(x,40,282,1.5);mpmgdGull(x,80,258,1.1,true);mpmgdFish(x,456,298,.9,'#c8d6c0',true)});
mpmgAdd([305],function(x){
 mpmgdSnail(x,450,172,.5,true);mpmgdCat(x,22,296,.55,false);mpmgdHerald(x,60,300,.5,false);mpmgdGuard(x,450,296,.5,true)});
