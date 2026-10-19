/* Marginalia for the area maps (see mpmgAdd in maps_common.js). Names in this file start with mpmga.
   Artist A: Abbey crypts 1, Thornwood 2, Wolves' Den 23, Thornwick 3, Gandrick's Wood 7, Cave 8, Hideout 25, Greendale 32, Anaea 33.
   Figures are drawn in a local frame: facing right, feet on y=0, about 15 units tall (people). mpmgaAt places, scales and flips them. */
const MPMGA_C={brn:'#b08a5a',dbr:'#7a5230',gry:'#aaa69c',dgy:'#6c6862',cre:'#f4ecd2',ros:'#dca490',yel:'#e8c64a',wht:'#f8f2e0',grn:'#7aa458',dgr:'#3f6a45',blu:'#6a86c4',red:'#c4503a',skn:'#f0d2b0',blk:'#3a2e26',org:'#d8884a',sky:'#a9c4d8'};
let mpmgaN=0;
function mpmgaJ(){mpmgaN++;return hash2(mpmgaN,mpmgaN*3+1,77)-.5}
function mpmgaAt(x,px,py,s,fl,fn,rot){x.save();x.translate(px,py);if(rot)x.rotate(rot);x.scale(fl?-s:s,s);x.strokeStyle=MPL.INK;x.lineWidth=.6;x.lineJoin='round';x.lineCap='round';mpmgaN=(px*13+py*7)|0;try{fn(x)}finally{x.restore()}}
function mpmgaPath(x,p,close,sm){x.beginPath();const n=p.length/2,q=[];for(let i=0;i<n;i++)q.push([p[2*i]+mpmgaJ()*.3,p[2*i+1]+mpmgaJ()*.3]);
  if(sm&&n>2){const m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];const s=m(q[n-1],q[0]);x.moveTo(s[0],s[1]);for(let i=0;i<n;i++){const e=m(q[i],q[(i+1)%n]);x.quadraticCurveTo(q[i][0],q[i][1],e[0],e[1])}x.closePath()}
  else{x.moveTo(q[0][0],q[0][1]);for(let i=1;i<n;i++)x.lineTo(q[i][0],q[i][1]);if(close)x.closePath()}}
function mpmgaFS(x,fill,lw){if(fill){x.fillStyle=fill;x.fill()}x.lineWidth=lw||.6;x.stroke()}
function mpmgaP(x,p,fill,lw){mpmgaPath(x,p,1,0);mpmgaFS(x,fill,lw)}
function mpmgaSm(x,p,fill,lw){mpmgaPath(x,p,1,1);mpmgaFS(x,fill,lw)}
function mpmgaL(x,p,lw){mpmgaPath(x,p,0,0);x.lineWidth=lw||.6;x.stroke()}
function mpmgaB(x,cx,cy,rx,ry,fill,rot,lw){const p=[],r=rot||0,c=Math.cos(r),s=Math.sin(r);for(let i=0;i<12;i++){const a=i/12*6.2832,u=Math.cos(a)*rx*(1+mpmgaJ()*.07),v=Math.sin(a)*ry*(1+mpmgaJ()*.07);p.push(cx+u*c-v*s,cy+u*s+v*c)}mpmgaSm(x,p,fill,lw)}
function mpmgaD(x,a,b,r,col){x.fillStyle=col||MPL.INK;x.beginPath();x.arc(a,b,r,0,6.3);x.fill()}
function mpmgaEye(x,a,b,r){mpmgaD(x,a,b,r||.55)}
function mpmgaHatch(x,x0,y0,x1,y1,n,dx,dy){x.lineWidth=.35;x.beginPath();for(let i=0;i<n;i++){const u=(i+.5)/n;x.moveTo(x0+(x1-x0)*u,y0+(y1-y0)*u);x.lineTo(x0+(x1-x0)*u+(dx||1),y0+(y1-y0)*u+(dy||1.6))}x.stroke()}
function mpmgaGround(x,x0,x1,y,tufts){x.lineWidth=.5;x.beginPath();x.moveTo(x0,y);for(let a=x0;a<x1;a+=6)x.lineTo(a+6,y+mpmgaJ()*.8);x.stroke();if(tufts){x.lineWidth=.45;for(let a=x0+4;a<x1-2;a+=7+(a*7%5)){x.beginPath();x.moveTo(a,y);x.lineTo(a-1,y-2);x.moveTo(a,y);x.lineTo(a+.2,y-2.6);x.moveTo(a,y);x.lineTo(a+1.2,y-1.8);x.stroke()}}}
function mpmgaTuft(x,a,b,c){x.save();x.strokeStyle=c||MPL.VERD;x.lineWidth=.5;x.beginPath();x.moveTo(a,b);x.lineTo(a-1.2,b-2.6);x.moveTo(a,b);x.lineTo(a+.2,b-3.2);x.moveTo(a,b);x.lineTo(a+1.4,b-2.4);x.stroke();x.restore()}
const MPMGA=MPMGA_C;

/* ---- people ---- */
/* o: col (tunic or robe), robe(1), leg, hat (hood,tonsure,cap,helm,mitre,straw,jester,none), arm (angle down from horizontal), skin, hair. returns hand position. */
function mpmgaFig(x,o){const C=MPMGA,col=o.col||C.brn,sk=o.skin||C.skn,fa=o.arm==null?.5:o.arm;
  if(o.robe){mpmgaP(x,[-2.6,-11.5,2.6,-11.5,4.9,0,-4.9,0],col);mpmgaHatch(x,-3.6,-6,3.6,-6,4,-.4,3.6)}
  else{mpmgaP(x,[-2.4,-6,-.3,-6,-.6,0,-2.8,0],o.leg||C.dbr);mpmgaP(x,[.3,-6,2.4,-6,2.9,0,.6,0],o.leg||C.dbr);mpmgaB(x,-1.5,0,1.8,.7,C.blk);mpmgaB(x,1.9,0,1.8,.7,C.blk);mpmgaP(x,[-2.8,-11.5,2.8,-11.5,3.3,-5.2,-3.3,-5.2],col)}
  x.lineWidth=.5;mpmgaL(x,[-3,-6.6,3,-6.6],.6);
  const ax=1,ay=-10.6,hx=ax+Math.cos(fa)*5.2,hy=ay+Math.sin(fa)*5.2;
  mpmgaP(x,[ax-.9,ay-.9,hx-.5,hy-1,hx+.8,hy+.6,ax+.8,ay+1],col);mpmgaB(x,hx+.3,hy,1,1,sk);
  if(o.hat==='hood'){mpmgaSm(x,[-3.4,-12,-2.8,-16.2,0,-17.8,2.8,-16,3.2,-12.4,0,-11.4],col)}
  if(o.hat==='tonsure'){mpmgaB(x,.4,-14,2.6,2.6,C.dbr)}
  mpmgaB(x,.4,-13.6,o.hat==='hood'?2.1:2.5,o.hat==='hood'?2.3:2.6,sk);
  if(o.hat==='tonsure'){mpmgaB(x,.4,-14.6,1.5,1.2,sk,0,.01)}
  mpmgaEye(x,1.4,-13.7,.5);x.lineWidth=.4;mpmgaL(x,[1,-12.2,2,-12.3],.4);
  if(o.hat==='cap')mpmgaP(x,[-2.4,-15,0,-17.4,3,-15.6,2.4,-14.6,-2,-14.2],o.hatc||C.grn);
  if(o.hat==='helm'){mpmgaSm(x,[-2.9,-13.6,-2.4,-16.4,.4,-17.2,3,-16.2,3.2,-13.8],C.gry);mpmgaL(x,[2,-16,2.2,-12.6],.5)}
  if(o.hat==='mitre')mpmgaP(x,[-2.2,-15.6,-1.2,-20.6,.2,-18.8,1.6,-20.6,2.6,-15.6],C.yel);
  if(o.hat==='straw'){mpmgaB(x,.4,-15.4,4.6,1,'#d8be78');mpmgaB(x,.4,-16.4,2,1.3,'#d8be78')}
  if(o.hat==='witch'){mpmgaB(x,.4,-15.2,4.6,1,C.blk);mpmgaP(x,[-2,-15.4,2.6,-15.4,1.6,-21,.4,-22.4,-.4,-19],C.blk)}
  if(o.hat==='jester'){mpmgaSm(x,[-2.3,-15.6,-5,-17.6,-5.4,-20,-3.4,-18.2,-.6,-17.6],C.red);mpmgaSm(x,[1,-16.6,2,-19.6,4.6,-20.4,3.4,-17.6,2.6,-15.6],C.blu);mpmgaD(x,-5.4,-20,.7,C.yel);mpmgaD(x,4.6,-20.4,.7,C.yel)}
  return{hx:hx+.3,hy:hy}}
function mpmgaSkel(x,o){const C=MPMGA;o=o||{};
  mpmgaL(x,[0,-7,0,-12],.7);for(let i=0;i<3;i++){mpmgaL(x,[0,-11+i*1.6,2.8,-10.4+i*1.6],.5);mpmgaL(x,[0,-11+i*1.6,-2.8,-10.4+i*1.6],.5)}
  mpmgaP(x,[-2,-7,2,-7,1.4,-5.6,-1.4,-5.6],C.cre);mpmgaL(x,[-1.2,-5.6,-1.8,-2.8,-1.6,0],.8);mpmgaL(x,[1.2,-5.6,1.6,-2.8,2.4,0],.8);
  mpmgaB(x,-1.6,0,1.1,.5,C.cre);mpmgaB(x,2.5,0,1.1,.5,C.cre);
  const fa=o.arm==null?.7:o.arm,hx=2.6+Math.cos(fa)*5.6,hy=-11.2+Math.sin(fa)*5.6;mpmgaL(x,[2.2,-11.2,hx,hy],.8);mpmgaB(x,hx,hy,.8,.8,C.cre);mpmgaL(x,[-2.2,-11.2,-3.4,-8,-3,-6],.8);
  mpmgaB(x,.2,-14.2,2.6,2.7,C.cre);mpmgaP(x,[-1.6,-11.9,1.8,-11.9,1.4,-12.8,-1.2,-12.8],C.cre);mpmgaB(x,-.8,-14.4,.7,.8,MPL.INK);mpmgaB(x,1.2,-14.4,.7,.8,MPL.INK);mpmgaL(x,[-.2,-13.2,.6,-13.2],.4);
  return{hx:hx,hy:hy}}
function mpmgaGhost(x,o){const C=MPMGA;o=o||{};
  mpmgaSm(x,[-4.4,-1,-5.4,-8,-3.4,-14,.4,-16,4,-13.6,5.6,-8,4.6,-1,2.6,-3.2,.6,.2,-1.6,-3,-3,.2],'rgba(246,244,252,.92)');
  mpmgaSm(x,[4.6,-9,8,-12,9.6,-11,6.2,-7.4],'rgba(246,244,252,.92)');mpmgaSm(x,[-5,-9,-7.4,-6.6,-6.4,-5.4,-4.2,-7.4],'rgba(246,244,252,.92)');
  mpmgaB(x,-1.2,-11.6,.8,1.2,MPL.INK);mpmgaB(x,2.2,-11.6,.8,1.2,MPL.INK);mpmgaB(x,.5,-8.4,1,1.3,MPL.INK);
  mpmgaHatch(x,-4,-5,3.6,-5,4,-.3,2)}
/* ---- animals ---- */
function mpmgaQuad(x,o){const C=MPMGA,l=o.l||8,t=o.t||4,g=o.g||5,nk=o.nk==null?3:o.nk,hr=o.hr||2.6,sn=o.sn==null?2:o.sn,col=o.col||C.brn,dk=o.dk||C.dbr,cy=-(g+t),hx=l+hr*.4,hy=cy-t*.5-nk;
  const leg=(lx,f)=>{mpmgaP(x,[lx-1,cy+t*.6,lx+1,cy+t*.6,lx+.75,-.8,lx-.75,-.8],f);mpmgaP(x,[lx-.9,-.9,lx+.9,-.9,lx+1,0,lx-.9,0],o.hoof||C.blk)};
  if(o.tail==='bush')mpmgaSm(x,[-l+.5,cy-1,-l-3,cy-5,-l-5.6,cy-4,-l-3.4,cy+.4],col);else if(o.tail==='curl')mpmgaL(x,[-l+.4,cy-1,-l-2,cy-2.6,-l-3,cy-5.4,-l-1.4,cy-6.2],.9);else if(o.tail==='rope'){mpmgaL(x,[-l+.4,cy-1,-l-2,cy+1.5,-l-2.4,cy+4],.8)}else mpmgaP(x,[-l+.6,cy-2,-l-2,cy-3.4,-l-.5,cy+.2],col);
  leg(-l*.7,dk);leg(l*.28,dk);
  mpmgaP(x,[l*.3,cy-t*.9,hx-hr*.7,hy-hr*.4,hx+hr*.3,hy+hr*.9,l*.85,cy+t*.2],col);
  mpmgaB(x,0,cy,l,t,col);if(o.hatch)mpmgaHatch(x,-l*.6,cy+t*.2,l*.5,cy+t*.2,6,.6,t*.7);
  leg(-l*.4,col);leg(l*.62,col);
  if(o.horn==='goat'){mpmgaL(x,[hx-.4,hy-hr*.8,hx-1,hy-hr*2.4,hx-3,hy-hr*2.9,hx-4.2,hy-hr*2.2],1);}
  if(o.horn==='antler'){x.lineWidth=.7;mpmgaL(x,[hx-.4,hy-hr*.8,hx-1.6,hy-hr*2.8,hx-1,hy-hr*4],.7);mpmgaL(x,[hx-1.5,hy-hr*2.5,hx+.6,hy-hr*3],.6);mpmgaL(x,[hx-1.3,hy-hr*3.4,hx-3,hy-hr*3.8],.6);mpmgaL(x,[hx-.4,hy-hr*.9,hx+.8,hy-hr*2.6,hx+1.6,hy-hr*3.6],.7)}
  if(o.horn==='horns2'){mpmgaL(x,[hx+.4,hy-hr*.8,hx+1.2,hy-hr*1.8,hx+.2,hy-hr*2.6],1)}
  mpmgaB(x,hx,hy,hr*1.15,hr,col);mpmgaB(x,hx+hr*.9,hy+hr*.35,sn,hr*.62,o.snc||col);
  if(o.ear==='point')mpmgaP(x,[hx-hr*.7,hy-hr*.6,hx-hr*.5,hy-hr*2.1,hx+hr*.3,hy-hr*.8],col);
  else if(o.ear==='long'){mpmgaB(x,hx-hr*.5,hy-hr*2.1,hr*.38,hr*1.35,col,-.35);mpmgaB(x,hx-hr*.15,hy-hr*2.2,hr*.3,hr*1.25,C.ros,.3)}
  else if(o.ear==='flop')mpmgaB(x,hx-hr*.2,hy+hr*.5,hr*.45,hr*.9,dk,.2);
  else mpmgaP(x,[hx-hr*.7,hy-hr*.7,hx-hr*.9,hy-hr*1.8,hx,hy-hr*.9],col);
  if(o.beard)mpmgaP(x,[hx+hr*.8,hy+hr*.9,hx+hr*.5,hy+hr*2.2,hx+hr*.1,hy+hr*.9],C.wht);
  mpmgaEye(x,hx+hr*.25,hy-hr*.2,.5);mpmgaD(x,hx+hr*.9+sn*.75,hy+hr*.2,.5);
  return{hx:hx,hy:hy,cy:cy}}
function mpmgaWolf(x,o){o=o||{};mpmgaQuad(x,{l:7.5,t:3.6,g:5.5,nk:2.4,hr:2.4,sn:2.8,col:o.col||MPMGA.gry,dk:MPMGA.dgy,tail:'bush',ear:'point',hatch:1,snc:o.col||MPMGA.gry});}
function mpmgaGoat(x,o){o=o||{};return mpmgaQuad(x,{l:7,t:3.6,g:5,nk:3,hr:2.3,sn:1.7,col:o.col||MPMGA.wht,dk:MPMGA.gry,tail:'short',horn:'goat',beard:1,ear:'flop',hoof:MPMGA.dgy})}
function mpmgaSheep(x,o){const C=MPMGA;mpmgaP(x,[-1.2,-6,-.4,-6,-.5,0,-1.2,0],C.dgy);mpmgaP(x,[2.6,-6,3.4,-6,3.4,0,2.7,0],C.dgy);mpmgaB(x,0,-8,6.4,4.4,C.wht);for(const [a,b] of [[-4,-10],[-1,-12],[2,-11.4],[4.6,-9],[-4.4,-6],[-2,-5],[1.4,-4.8],[4,-6]]){mpmgaB(x,a,b,1.9,1.5,C.wht,0,.4)}mpmgaB(x,6.4,-9,2,1.9,C.dgy);mpmgaP(x,[5.2,-10.4,4,-11,4.6,-9.2],C.dgy);mpmgaEye(x,7,-9.4,.4,C.wht)}
function mpmgaCurve(x,p,lw){x.beginPath();const n=p.length/2,q=[];for(let i=0;i<n;i++)q.push([p[2*i],p[2*i+1]]);x.moveTo(q[0][0],q[0][1]);for(let i=1;i<n-1;i++){const e=[(q[i][0]+q[i+1][0])/2,(q[i][1]+q[i+1][1])/2];x.quadraticCurveTo(q[i][0],q[i][1],e[0],e[1])}x.lineTo(q[n-1][0],q[n-1][1]);x.lineWidth=lw||.6;x.stroke()}
function mpmgaRat(x,o){o=o||{};const C=MPMGA,col=o.col||C.gry;mpmgaCurve(x,[-4,-2,-6.4,-1.2,-8.6,-2.8,-9.6,-5.4,-11,-5.8],.5);mpmgaSm(x,[-4.8,-2.4,-3.6,-5.2,.4,-5.9,3.8,-4.8,4.2,-2,2,-.5,-3,-.6],col);mpmgaP(x,[2.6,-5.6,9.4,-2.9,3.4,-.5],col);mpmgaB(x,2.8,-6.2,1.5,1.7,C.ros);mpmgaEye(x,5.4,-3.9,.55);mpmgaD(x,9.4,-2.9,.65,C.ros);x.lineWidth=.3;mpmgaL(x,[7.4,-2.8,10.6,-4.2],.3);mpmgaL(x,[7.4,-2.4,10.8,-2.4],.3);mpmgaL(x,[-2,-.8,-2.8,.1],.7);mpmgaL(x,[2.6,-.8,3.4,.1],.7);mpmgaL(x,[-.2,-.8,-.2,.1],.6);mpmgaHatch(x,-3,-4,1,-4.6,3,.3,1.4)}
function mpmgaRabbit(x,o){o=o||{};const C=MPMGA,col=o.col||C.brn;mpmgaB(x,0,-4.2,4.2,4,col);mpmgaD(x,-4.2,-4.6,1.7,C.wht);x.lineWidth=.5;x.beginPath();x.arc(-4.2,-4.6,1.7,0,6.3);x.stroke();mpmgaB(x,3.8,-9.4,2.2,2,col);mpmgaB(x,2.4,-13.4,.75,2.8,col,.12);mpmgaB(x,4.4,-13.2,.75,2.7,col,-.12);mpmgaB(x,2.5,-13.4,.3,2,C.ros,.12);mpmgaEye(x,4.8,-9.7,.45);mpmgaD(x,5.9,-9,.4);mpmgaB(x,2,-.6,2.2,1,col);mpmgaB(x,-1.4,-.5,1.8,.9,col);mpmgaB(x,3.4,-3.4,.9,1.4,col,.4)}
function mpmgaCat(x,o){o=o||{};const C=MPMGA,col=o.col||C.org;mpmgaL(x,[-4.4,-2,-7,-4,-6.4,-8,-4.6,-9],1);mpmgaB(x,0,-3.4,4.6,3,col);mpmgaB(x,3.6,-7.6,2.3,2.1,col);mpmgaP(x,[2,-9,2.2,-11.6,3.6,-9.4],col);mpmgaP(x,[4.2,-9.4,5.6,-11.4,5.6,-8.8],col);mpmgaEye(x,4.4,-7.9,.45);mpmgaD(x,5.6,-7,.35,C.ros);mpmgaL(x,[5.6,-7,7.6,-7.4],.3);mpmgaL(x,[5.6,-6.7,7.6,-6.4],.3);mpmgaL(x,[1,-4.6,1.6,-3.2],.4);mpmgaL(x,[-1,-4.8,-.6,-3.4],.4);mpmgaB(x,3,-.6,1.4,.7,col);mpmgaB(x,-2,-.6,1.4,.7,col)}
function mpmgaFox(x,o){mpmgaQuad(x,{l:6.5,t:3.2,g:4.6,nk:2.6,hr:2.3,sn:3,col:MPMGA.org,dk:MPMGA.dbr,tail:'bush',ear:'point',snc:MPMGA.wht,hoof:MPMGA.blk})}
function mpmgaPig(x,o){const C=MPMGA;mpmgaQuad(x,{l:7.6,t:4.6,g:3.2,nk:-.6,hr:2.8,sn:1.8,col:C.ros,dk:'#c08a78',tail:'curl',ear:'flop',snc:'#e8b8a6',hoof:C.dbr})}
function mpmgaDeer(x,o){const C=MPMGA;return mpmgaQuad(x,{l:8,t:3.6,g:8.5,nk:5,hr:2.2,sn:2.2,col:C.brn,dk:C.dbr,tail:'short',ear:'point',horn:o&&o.noant?null:'antler',hoof:C.blk})}
function mpmgaDonkey(x,o){const C=MPMGA;return mpmgaQuad(x,{l:8,t:4,g:6,nk:3.4,hr:2.5,sn:2.4,col:C.gry,dk:C.dgy,tail:'rope',ear:'long',snc:C.wht,hoof:C.blk})}
function mpmgaBird(x,col,o){o=o||{};const C=MPMGA;col=col||C.blu;mpmgaP(x,[-3.2,-3.8,-7.4,-5.4,-6.6,-3,-3.4,-2],col);mpmgaB(x,0,-3.6,3.6,2.4,col);mpmgaB(x,3.1,-6.6,1.7,1.6,col);mpmgaP(x,[4.6,-6.8,6.8,-6.2,4.6,-5.7],C.yel);mpmgaEye(x,3.6,-6.9,.4);mpmgaSm(x,[-1.8,-4.4,1.2,-5.5,2.4,-3.6,-.4,-2.6],C.cre);mpmgaL(x,[-.6,-1.4,-.6,0,-1.6,.1],.4);mpmgaL(x,[.8,-1.4,.8,0,1.8,.1],.4)}
function mpmgaGoose(x,o){const C=MPMGA;mpmgaP(x,[-4,-5,-8,-7.4,-7.2,-4,-3.6,-2.6],C.wht);mpmgaB(x,0,-4.6,4.4,3,C.wht);mpmgaP(x,[2.6,-5.6,3.6,-12,5.4,-12.2,4.6,-5.4],C.wht);mpmgaB(x,4.7,-12.4,1.5,1.2,C.wht);mpmgaP(x,[5.6,-12.8,8.2,-12.2,5.8,-11.6],C.org);mpmgaEye(x,5,-12.6,.4);mpmgaSm(x,[-2.4,-5.4,1,-6.4,2.6,-4.4,-.4,-3.2],C.cre);mpmgaL(x,[-.4,-1.8,-.4,0,-1.8,.1],.5);mpmgaL(x,[1.2,-1.8,1.2,0,2.6,.1],.5)}
function mpmgaSnail(x,o){const C=MPMGA;o=o||{};mpmgaSm(x,[-9,0,-8,-2.4,-3,-2.2,3,-2.6,6.4,-2.4,7.4,-6.4,8.2,-8,9.2,-6.6,8.6,-2.6,9,0],'#c8b890');mpmgaL(x,[7.4,-6.4,7,-9.4],.5);mpmgaL(x,[8.6,-6.8,9.6,-9.2],.5);mpmgaD(x,7,-9.6,.5);mpmgaD(x,9.6,-9.4,.5);mpmgaB(x,-1.4,-6.6,5.6,5.2,o.col||C.ros);x.lineWidth=.45;x.beginPath();x.arc(-1.4,-6.6,3.2,.4,5.6);x.stroke();x.beginPath();x.arc(-1.2,-6.4,1.4,.8,5.6);x.stroke()}
function mpmgaBee(x,a,b,r){x.save();x.translate(a,b);x.scale(r||1,r||1);x.lineWidth=.4;x.fillStyle='rgba(240,248,255,.9)';x.strokeStyle=MPL.INK;x.beginPath();x.ellipse(-.6,-1.4,1,.6,-.6,0,6.3);x.fill();x.stroke();x.beginPath();x.ellipse(.8,-1.5,1,.6,.6,0,6.3);x.fill();x.stroke();mpmgaB(x,0,0,1.5,1,MPMGA.yel,0,.4);x.lineWidth=.4;x.beginPath();x.moveTo(-.4,-.9);x.lineTo(-.4,.9);x.moveTo(.5,-.9);x.lineTo(.5,.9);x.stroke();x.restore()}
function mpmgaBat(x,a,b,s,col){x.save();x.translate(a,b);x.scale(s||1,s||1);x.lineWidth=.5;x.strokeStyle=MPL.INK;mpmgaSm(x,[0,-1.4,2,-2.6,5.4,-2.6,6.4,-.6,4.6,-.8,3.2,.4,1.6,-.4,.8,1.2,0,.4,-.8,1.2,-1.6,-.4,-3.2,.4,-4.6,-.8,-6.4,-.6,-5.4,-2.6,-2,-2.6],col||MPMGA.dgy);mpmgaP(x,[-1,-1.6,-1.2,-3.4,0,-2.2,1.2,-3.4,1,-1.6],col||MPMGA.dgy);mpmgaD(x,-.5,-.6,.3,MPMGA.wht);mpmgaD(x,.5,-.6,.3,MPMGA.wht);x.restore()}
/* ---- things ---- */
function mpmgaBarrel(x,cx,cy,r){const C=MPMGA;mpmgaB(x,cx,cy,r*.82,r,C.brn);x.lineWidth=.45;for(const k of [-.45,0,.45]){x.beginPath();x.ellipse(cx,cy+k*r,r*.82*Math.sqrt(1-k*k*.8),r*.16,0,0,3.15);x.stroke()}mpmgaL(x,[cx-r*.4,cy-r*.9,cx-r*.45,cy+r*.9],.3);mpmgaL(x,[cx+r*.4,cy-r*.9,cx+r*.45,cy+r*.9],.3)}
function mpmgaBook(x,cx,cy,w,col,open){const C=MPMGA;if(open){mpmgaP(x,[cx-w,cy-w*.3,cx,cy,cx+w,cy-w*.3,cx+w,cy+w*.45,cx,cy+w*.75,cx-w,cy+w*.45],C.cre);mpmgaL(x,[cx,cy,cx,cy+w*.75],.4);mpmgaHatch(x,cx-w*.8,cy+w*.05,cx-w*.15,cy+w*.25,3,0,.01);mpmgaHatch(x,cx+w*.15,cy+w*.25,cx+w*.8,cy+w*.05,3,0,.01)}else{mpmgaP(x,[cx-w,cy-w*.7,cx+w,cy-w*.7,cx+w,cy+w*.7,cx-w,cy+w*.7],col||C.red);mpmgaL(x,[cx-w*.6,cy,cx+w*.6,cy],.4);mpmgaD(x,cx,cy,w*.18,C.yel)}}
function mpmgaCandle(x,cx,cy,h){const C=MPMGA;mpmgaP(x,[cx-.9,cy,cx+.9,cy,cx+.8,cy-h,cx-.8,cy-h],C.cre);mpmgaSm(x,[cx,cy-h-3,cx+1.1,cy-h-1,cx,cy-h-.2,cx-1.1,cy-h-1],C.yel,.35);mpmgaB(x,cx,cy,1.7,.5,C.yel)}
function mpmgaBell(x,cx,cy,s){const C=MPMGA;x.save();x.translate(cx,cy);x.scale(s,s);mpmgaSm(x,[-1.4,-5.6,1.4,-5.6,2.4,-2.6,4.4,0,-4.4,0,-2.4,-2.6],C.yel);mpmgaB(x,0,0,4.4,.7,C.dbr,0,.4);mpmgaD(x,0,1.6,.9,C.dbr);mpmgaL(x,[0,-5.6,0,-7],.5);x.restore()}
function mpmgaSkep(x,cx,cy,s){const C=MPMGA;x.save();x.translate(cx,cy);x.scale(s,s);mpmgaSm(x,[-5,0,-4.6,-4.4,-2,-7.6,0,-8.6,2,-7.6,4.6,-4.4,5,0],'#e0c070');x.lineWidth=.4;for(const r of [2.2,4.6,6.8]){x.beginPath();x.ellipse(0,-r*.2,5-r*.5,.5,0,0,3.15);x.stroke()}mpmgaB(x,0,-1.4,1,.9,MPMGA.blk);x.restore()}
function mpmgaSack(x,cx,cy,r){const C=MPMGA;mpmgaSm(x,[cx-r,cy,cx-r*1.1,cy-r*.9,cx-r*.4,cy-r*1.5,cx-r*.5,cy-r*1.8,cx+r*.5,cy-r*1.8,cx+r*.4,cy-r*1.5,cx+r*1.1,cy-r*.9,cx+r,cy],C.brn);mpmgaL(x,[cx-r*.5,cy-r*1.5,cx+r*.5,cy-r*1.5],.4);mpmgaD(x,cx,cy-r*.7,r*.22,C.yel)}
function mpmgaLoaf(x,cx,cy,r){mpmgaB(x,cx,cy,r,r*.6,'#d8a860');x.lineWidth=.35;for(const k of [-.45,0,.45])mpmgaL(x,[cx+k*r-.4,cy-r*.4,cx+k*r+.5,cy+r*.1],.35)}
function mpmgaMug(x,cx,cy,r){mpmgaP(x,[cx-r,cy-r*1.3,cx+r,cy-r*1.3,cx+r*.8,cy,cx-r*.8,cy],MPMGA.brn);mpmgaB(x,cx,cy-r*1.3,r,r*.3,MPMGA.yel);x.lineWidth=.5;x.beginPath();x.arc(cx+r,cy-r*.7,r*.5,-1.5,1.5);x.stroke()}
function mpmgaBow(x,cx,cy,h,drawn){x.lineWidth=.8;x.beginPath();x.moveTo(cx,cy-h);x.quadraticCurveTo(cx+h*.5,cy,cx,cy+h);x.stroke();x.lineWidth=.3;x.beginPath();x.moveTo(cx,cy-h);x.lineTo(cx-(drawn?h*.45:0),cy);x.lineTo(cx,cy+h);x.stroke()}
function mpmgaArrow(x,x0,y0,x1,y1){mpmgaL(x,[x0,y0,x1,y1],.5);const a=Math.atan2(y1-y0,x1-x0);mpmgaP(x,[x1+Math.cos(a)*2,y1+Math.sin(a)*2,x1+Math.cos(a+2.6)*1.6,y1+Math.sin(a+2.6)*1.6,x1+Math.cos(a-2.6)*1.6,y1+Math.sin(a-2.6)*1.6],MPL.INK,.2);mpmgaL(x,[x0,y0,x0-Math.cos(a)*1.6+Math.sin(a)*1.2,y0-Math.sin(a)*1.6-Math.cos(a)*1.2],.4);mpmgaL(x,[x0,y0,x0-Math.cos(a)*1.6-Math.sin(a)*1.2,y0-Math.sin(a)*1.6+Math.cos(a)*1.2],.4)}
function mpmgaTree(x,cx,cy,h,col,thorn){const C=MPMGA;mpmgaP(x,[cx-1,cy,cx-.6,cy-h*.6,cx+.6,cy-h*.6,cx+1,cy],C.dbr);if(thorn){mpmgaL(x,[cx,cy-h*.5,cx-3,cy-h*.8],.6);mpmgaL(x,[cx,cy-h*.6,cx+3.4,cy-h*.95],.6);mpmgaL(x,[cx-3,cy-h*.8,cx-3.8,cy-h*.7],.4);mpmgaL(x,[cx+3.4,cy-h*.95,cx+4.4,cy-h*.85],.4)}else{mpmgaB(x,cx,cy-h*.8,h*.4,h*.34,col||C.grn);mpmgaB(x,cx-h*.3,cy-h*.6,h*.28,h*.24,col||C.grn);mpmgaB(x,cx+h*.3,cy-h*.6,h*.28,h*.24,col||C.grn)}}
function mpmgaMoon(x,cx,cy,r){x.beginPath();x.arc(cx,cy,r,0,6.3);x.arc(cx+r*.55,cy-r*.15,r*.85,0,6.3);x.fillStyle='#f3e6a8';x.fill('evenodd');x.beginPath();x.arc(cx,cy,r,.9,5.4);x.arc(cx+r*.55,cy-r*.15,r*.85,5.2,1.1,true);x.closePath();x.lineWidth=.6;x.stroke()}
function mpmgaApple(x,cx,cy,r){mpmgaB(x,cx,cy,r,r*.9,MPMGA.red);mpmgaL(x,[cx,cy-r*.8,cx+.4,cy-r*1.5],.4)}
function mpmgaMush(x,cx,cy,r){mpmgaP(x,[cx-r*.3,cy,cx-r*.3,cy-r,cx+r*.3,cy-r,cx+r*.3,cy],MPMGA.cre);mpmgaSm(x,[cx-r,cy-r,cx-r*.6,cy-r*1.9,cx+r*.6,cy-r*1.9,cx+r,cy-r],MPMGA.red);mpmgaD(x,cx-r*.2,cy-r*1.5,r*.2,MPMGA.wht)}
function mpmgaCoin(x,cx,cy,r){mpmgaB(x,cx,cy,r,r*.6,MPMGA.yel,0,.35)}
function mpmgaTomb(x,cx,cy,w,h){mpmgaSm(x,[cx-w,cy,cx-w,cy-h*.7,cx-w*.5,cy-h,cx+w*.5,cy-h,cx+w,cy-h*.7,cx+w,cy],MPMGA.gry);mpmgaL(x,[cx,cy-h*.8,cx,cy-h*.3],.5);mpmgaL(x,[cx-w*.4,cy-h*.6,cx+w*.4,cy-h*.6],.5)}
function mpmgaSpear(x,x0,y0,x1,y1){mpmgaL(x,[x0,y0,x1,y1],.7);const a=Math.atan2(y1-y0,x1-x0);mpmgaP(x,[x1+Math.cos(a)*3,y1+Math.sin(a)*3,x1+Math.cos(a+1.9)*1.2,y1+Math.sin(a+1.9)*1.2,x1+Math.cos(a-1.9)*1.2,y1+Math.sin(a-1.9)*1.2],MPMGA.gry,.4)}
function mpmgaShield(x,cx,cy,r,col){mpmgaSm(x,[cx-r,cy-r,cx+r,cy-r,cx+r,cy+r*.2,cx,cy+r*1.3,cx-r,cy+r*.2],col||MPMGA.red);mpmgaL(x,[cx,cy-r,cx,cy+r*1.2],.35);mpmgaL(x,[cx-r,cy-r*.2,cx+r,cy-r*.2],.35)}
function mpmgaFlower(x,cx,cy,col){mpmgaL(x,[cx,cy,cx+.3,cy-3],.4);mpmgaD(x,cx+.3,cy-3.4,1,col||MPMGA.yel);mpmgaD(x,cx+.3,cy-3.4,.4,MPMGA.red)}
function mpmgaPeekRat(x,cx,cy){const C=MPMGA;mpmgaB(x,cx,cy,3.6,2.4,C.gry);mpmgaB(x,cx-2.4,cy-2.2,1.3,1.5,C.ros);mpmgaB(x,cx+1.2,cy-2.4,1.3,1.5,C.ros);mpmgaEye(x,cx+1.4,cy-.4,.5);mpmgaD(x,cx+3.5,cy+.5,.5);mpmgaB(x,cx-1.5,cy+2.2,.9,.55,C.ros);mpmgaB(x,cx+1.5,cy+2.2,.9,.55,C.ros)}
function mpmgaHorn(x,cx,cy,s,ang){x.save();x.translate(cx,cy);x.rotate(ang||0);x.scale(s,s);mpmgaSm(x,[0,0,3,-.6,6,-2.2,8.4,-5,6,-4.6,3,-2.4,0,1.2],MPMGA.cre);x.restore()}
function mpmgaScroll(x,cx,cy,w,h){mpmgaP(x,[cx-w,cy-h,cx+w,cy-h,cx+w,cy+h,cx-w,cy+h],MPMGA.cre);mpmgaB(x,cx-w,cy,.9,h,MPMGA.cre);mpmgaB(x,cx+w,cy,.9,h,MPMGA.cre);mpmgaHatch(x,cx-w*.7,cy-h*.5,cx+w*.7,cy-h*.5,3,0,.01);mpmgaL(x,[cx-w*.6,cy,cx+w*.6,cy],.3);mpmgaL(x,[cx-w*.6,cy+h*.5,cx+w*.3,cy+h*.5],.3)}

/* =================== 1  Abbey Crypts =================== */
mpmgAdd([1],function(x,L){const C=MPMGA;
  /* a rat knight on a toad jousts a giant snail (top strip) */
  mpmgaGround(x,118,236,27,1);
  mpmgaAt(x,162,27,1.2,0,function(x){mpmgaB(x,0,-3.4,5.2,3.4,C.dgr);mpmgaB(x,5.4,-6,2.2,1.5,C.dgr);mpmgaD(x,6.2,-7.2,.7,C.yel);mpmgaEye(x,6.2,-7.2,.3);mpmgaB(x,-3,-.6,2.6,1,C.dgr);mpmgaB(x,2.4,-.6,2.6,1,C.dgr);mpmgaL(x,[4,-4,7.4,-3.6],.5);
    mpmgaAt(x,0,-6,.85,0,function(x){mpmgaRat(x,{col:C.gry});mpmgaSm(x,[2.6,-5.8,5,-8,7.6,-5.6,6.8,-4.4,3.6,-4],C.gry);mpmgaP(x,[3.2,-6.2,3.6,-9.6,4.8,-6.4],C.red);mpmgaShield(x,-.8,-4.2,2.2,C.blu);mpmgaSpear(x,-3,-3,16,-6.6)})});
  mpmgaAt(x,222,27,1.3,1,mpmgaSnail,0);mpmgaTuft(x,200,27);
  /* skeleton scribe with a rat reading over his shoulder */
  mpmgaAt(x,284,27,.95,0,function(x){mpmgaP(x,[-6,-6,6,-6,6,0,-6,0],C.dbr);mpmgaL(x,[-6,-6,-7,-8,7,-8,6,-6],.5);mpmgaAt(x,-1,-4.4,.8,0,mpmgaSkel,0);mpmgaBook(x,5,-8.6,3.4,0,1);mpmgaL(x,[2.6,-11,6,-14],.5);mpmgaRat(x,{})});
  /* ghost with a candle, a skull and a mouse */
  mpmgaAt(x,34,205,1.5,0,function(x){mpmgaGhost(x);mpmgaCandle(x,9,-8,4)});
  mpmgaAt(x,64,205,.8,1,function(x){mpmgaB(x,0,-2.4,2.8,2.4,C.cre);mpmgaP(x,[-1.6,-1,1.6,-1,1.2,0,-1.2,0],C.cre);mpmgaB(x,-1,-2.8,.6,.7,MPL.INK);mpmgaB(x,1,-2.8,.6,.7,MPL.INK)});mpmgaGround(x,10,86,205.4,1);
  mpmgaAt(x,76,205,.85,1,mpmgaRat,0);
  /* pallbearer rats with a coffin, a monk rat ringing a handbell */
  mpmgaGround(x,396,470,289,1);
  mpmgaAt(x,412,289,1.4,0,mpmgaRat);
  mpmgaAt(x,436,289,1.4,0,function(x){mpmgaRat(x,{col:C.dgy})});
  mpmgaAt(x,428,281,1.3,0,function(x){mpmgaP(x,[-10,-2,-7,-4.6,7,-4.6,10,-2,7,.4,-7,.4],C.brn);mpmgaL(x,[-1,-4,-1,-.2],.5);mpmgaL(x,[-3.4,-2.6,1.4,-2.6],.5);mpmgaHatch(x,-6,-.4,6,-.4,6,-.4,1.2)});
  mpmgaAt(x,462,289,1.4,0,function(x){mpmgaRat(x,{});mpmgaP(x,[1.6,-6,2.6,-9.4,5.4,-6.4,4,-4.6],C.dbr);mpmgaBell(x,8,-10.6,.7)});
  /* nosy rats peeking round the panels */
  mpmgaPeekRat(x,425,49.5);mpmgaAt(x,70,51.2,1,0,function(x){mpmgaRat(x,{});mpmgaCandle(x,-8,0,4)});
});

function mpmgaHowl(x,o){const C=MPMGA,col=o&&o.col||C.gry;mpmgaSm(x,[-9,-2,-10.4,-6,-8,-9.6,-5,-6],col);mpmgaSm(x,[-5,0,-5,-7,-1,-10,3,-9,3.4,0],col);mpmgaP(x,[-2,-8,3.8,-9.4,6.4,-15,3,-16.6],col);mpmgaB(x,4.8,-16.8,2.3,1.8,col,-.8);mpmgaP(x,[5.6,-17.8,10,-20.8,7.4,-16],col);mpmgaP(x,[2.4,-17,1.6,-20,4.2,-18.6],col);mpmgaEye(x,5.2,-17.2,.45);mpmgaL(x,[3,0,3,-5],.8);mpmgaB(x,3.6,-.4,1.5,.7,col);mpmgaB(x,-4,-.4,1.8,.7,col);mpmgaHatch(x,-4,-4,2,-5,3,.3,2)}
function mpmgaApe(x,o){const C=MPMGA;o=o||{};mpmgaCurve(x,[-4,-2,-8,-1,-9,-5,-7,-7],.8);mpmgaB(x,0,-5,3.6,4.2,C.dbr);mpmgaB(x,-2,-.7,2.4,1.1,C.dbr);mpmgaB(x,2.4,-.7,2.4,1.1,C.dbr);mpmgaB(x,.8,-11.4,2.8,2.6,C.dbr);mpmgaB(x,1.6,-10.8,1.8,1.6,C.skn);mpmgaB(x,-1.6,-11.6,1,1.2,C.skn);mpmgaEye(x,2.4,-11.6,.4);
  if(o.pipes){mpmgaB(x,3.8,-5.6,3,2.2,C.red,.4);mpmgaL(x,[4.6,-7.4,6,-13],.6);mpmgaL(x,[3.4,-7.4,3.6,-14.2],.6);mpmgaL(x,[2.6,-5.6,1.6,-9.6],.7);mpmgaL(x,[4.4,-4,5,-.6],.7);mpmgaL(x,[1.4,-6.4,3,-5],1.2);mpmgaL(x,[-.4,-7,2.8,-4.4],1.4)}}
function mpmgaWitchCauldron(x,s){const C=MPMGA;mpmgaSm(x,[-5,-6,-6,-3,-4,-.6,4,-.6,6,-3,5,-6],C.blk);mpmgaB(x,0,-6,5,1.1,C.dgy);mpmgaB(x,0,-6.4,4,.7,C.grn,0,.3);mpmgaB(x,-1.4,-7.8,.9,.9,C.grn,0,.3);mpmgaB(x,1.6,-8.8,.7,.7,C.grn,0,.3);for(const k of [-3.4,0,3.4]){mpmgaSm(x,[k-1.4,0,k,-3,k+1.4,0],C.red,.4)}}

/* =================== 2  Thornwood =================== */
mpmgAdd([2],function(x,L){const C=MPMGA;
  /* goat butts a thorn tree */
  mpmgaGround(x,100,200,28,0);
  mpmgaAt(x,170,28,1,0,function(x){mpmgaTree(x,0,0,22,0,1);for(const [a,b] of [[-2,-6],[2,-9],[-3,-13]]){mpmgaL(x,[a,b,a-1.4,b-1.2],.5)}});
  mpmgaAt(x,128,28,1.05,0,function(x){mpmgaGoat(x)});mpmgaTuft(x,150,28);mpmgaTuft(x,112,28);
  /* a wolf in a cowl preaches to sheep */
  mpmgaGround(x,228,326,28,1);
  mpmgaAt(x,246,28,1.2,0,function(x){mpmgaP(x,[-5,-8,5,-8,6,0,-6,0],C.dbr);mpmgaHatch(x,-4,-6.5,4,-6.5,4,0,5);mpmgaP(x,[-5,-8,5,-8,5,-9,-5,-9],C.cre);
    mpmgaAt(x,0,-8,1.5,0,function(x){mpmgaSm(x,[-3,0,-3.4,-5,0,-7.6,3.4,-5,3,0],C.dbr);mpmgaB(x,.4,-3.2,2.5,2.4,C.gry);mpmgaP(x,[1.2,-3.2,5.4,-1.8,1.4,-.4],C.gry);mpmgaEye(x,1.6,-4,.5);mpmgaD(x,5.4,-1.8,.55);mpmgaP(x,[-1,-5,-1.4,-7.4,.6,-5.6],C.gry)});mpmgaL(x,[-3,-9,-5,-11],.5);mpmgaL(x,[3,-9,4,-12],.5)});
  mpmgaAt(x,274,28,.62,1,mpmgaSheep);mpmgaAt(x,293,28,.62,1,mpmgaSheep);mpmgaAt(x,312,28,.62,1,mpmgaSheep);
  /* a hare blows a hunting horn; a bandit shoots a bird */
  mpmgaGround(x,100,168,298,1);
  mpmgaAt(x,128,298,1.15,0,function(x){mpmgaRabbit(x);mpmgaHorn(x,5.6,-8.8,.9,-.5)});
  mpmgaAt(x,150,298,.8,0,function(x){mpmgaMush(x,0,0,3);mpmgaMush(x,5,0,2)});
  mpmgaGround(x,296,372,298,1);
  mpmgaAt(x,318,298,1,0,function(x){const h=mpmgaFig(x,{col:C.dgr,leg:C.dbr,hat:'cap',hatc:C.dbr,arm:-.1});mpmgaBow(x,h.hx+1.4,h.hy,5,1);mpmgaArrow(x,h.hx-2,h.hy,h.hx+8,h.hy-.4)});
  mpmgaAt(x,362,282,1.1,1,function(x){mpmgaBird(x,C.blu);mpmgaArrow(x,2,-8,-6,-9)});
  mpmgaAt(x,352,290,1.2,0,function(x){mpmgaTree(x,0,8,12,0,1)});
  /* the witch's cauldron */
  mpmgaGround(x,10,86,231,0);
  mpmgaAt(x,54,231,.95,0,function(x){mpmgaWitchCauldron(x)});
  mpmgaAt(x,20,231,1.1,0,function(x){const h=mpmgaFig(x,{robe:1,col:C.dgy,hat:'witch',arm:.5});mpmgaL(x,[h.hx,h.hy,h.hx+4,h.hy+2.4],.7)});
  mpmgaAt(x,76,231,.85,1,mpmgaCat);
  /* tombstone with a crow and a skeleton hand */
  mpmgaAt(x,80,293,1,0,function(x){mpmgaGround(x,-9,9,0,0);mpmgaTomb(x,0,0,4.4,9);mpmgaAt(x,0,-9,.8,1,function(x){mpmgaBird(x,C.blk)});mpmgaL(x,[-8,0,-8,-4],.7);for(const k of [-9.4,-8.4,-7.2,-6.2])mpmgaL(x,[-7.8,-4,k+.6,-6.4],.4)});
});

/* =================== 23  Wolves' Den =================== */
mpmgAdd([23],function(x,L){const C=MPMGA;
  /* a hare with a spear chases a wolf */
  mpmgaGround(x,108,200,28,1);
  mpmgaAt(x,126,28,1.2,0,function(x){mpmgaRabbit(x);mpmgaSpear(x,5,-5,17,-9)});
  mpmgaAt(x,172,28,1,0,function(x){mpmgaWolf(x);mpmgaL(x,[-8,-9,-9.6,-6,-8,-3],.5)});
  /* bats */
  mpmgaBat(x,240,15,1.6);mpmgaBat(x,272,22,1.2);mpmgaBat(x,304,13,1.5);
  mpmgaAt(x,284,28,1,0,function(x){mpmgaGround(x,-14,14,0,0);mpmgaP(x,[-3,-2,3,-2,2,0,-2,0],C.cre);mpmgaB(x,-6,-1,3,1,C.cre)});
  /* wolf in sheep's clothing, and a doubtful lamb */
  mpmgaGround(x,396,468,152,1);
  mpmgaAt(x,424,152,1.3,1,function(x){mpmgaWolf(x);for(const [a,b] of [[-5,-11],[-2,-12.4],[1.4,-12],[4,-10.6],[-5.6,-8],[-2.4,-6.2],[1.4,-6.6],[4.4,-7.6]])mpmgaB(x,a,b,1.9,1.6,C.wht,0,.4);mpmgaB(x,9.8,-12.4,2.3,2,C.wht,0,.4)});
  mpmgaAt(x,455,152,.8,1,mpmgaSheep);
  /* a she-wolf with her pups under the moon */
  mpmgaMoon(x,440,246,8);mpmgaBat(x,424,252,.8);
  mpmgaGround(x,396,470,290,1);
  mpmgaAt(x,418,290,1.25,0,function(x){mpmgaWolf(x)});
  mpmgaAt(x,444,290,.55,1,mpmgaWolf);mpmgaAt(x,455,290,.5,0,mpmgaWolf);mpmgaAt(x,464,290,.5,1,mpmgaWolf);
  /* a wolf howls at the moon */
  mpmgaMoon(x,62,184,8);mpmgaD(x,40,178,.6,C.yel);mpmgaD(x,76,196,.6,C.yel);mpmgaD(x,24,190,.5,C.yel);
  mpmgaGround(x,12,88,232,1);
  mpmgaAt(x,40,232,1.55,0,mpmgaHowl);
  /* a knight tiptoes off with a pup on his boot; a rat steals a bone */
  mpmgaGround(x,296,372,298,0);
  mpmgaAt(x,326,298,1,0,function(x){const h=mpmgaFig(x,{col:C.blu,leg:C.dgy,hat:'helm',arm:.2});mpmgaSpear(x,h.hx,h.hy+1,h.hx+3,h.hy-13);mpmgaAt(x,-6,0,.5,0,mpmgaWolf)});
  mpmgaAt(x,348,298,1,1,function(x){mpmgaL(x,[-6,-.8,6,-.8],1.4);mpmgaB(x,-6.4,-1.2,1.2,1.1,C.cre);mpmgaB(x,6.4,-1.2,1.2,1.1,C.cre);mpmgaB(x,-6.6,-.6,1.1,.9,C.cre);mpmgaB(x,6.6,-.6,1.1,.9,C.cre)});
  mpmgaAt(x,364,298,1.1,1,mpmgaRat);
  mpmgaAt(x,112,298,1.15,0,function(x){mpmgaWolf(x,{col:C.dgy});mpmgaB(x,10,-.8,2.6,1,C.cre)});
  mpmgaAt(x,150,298,.9,0,function(x){mpmgaSkel(x)});
});
function mpmgaWyvern(x){const C=MPMGA;mpmgaCurve(x,[-6,-3,-12,-2,-15,-6,-12,-9,-9,-7],1.2);mpmgaSm(x,[-3,-9,0,-14,5,-11,2,-6],C.dgr);mpmgaSm(x,[-1,-9,-6,-18,-10,-14,-5,-8],C.grn);mpmgaB(x,-1,-5,6.4,4,C.grn);mpmgaHatch(x,-5,-5,3,-5,6,.3,2);mpmgaP(x,[3,-7,6,-14,8,-13,5.6,-8],C.grn);mpmgaB(x,8,-14.6,2.4,1.7,C.grn,-.2);mpmgaP(x,[10,-14.6,13,-13.8,10,-13],C.grn);mpmgaEye(x,8.4,-15.2,.5);mpmgaL(x,[7,-16,6,-18.4],.6);mpmgaL(x,[9,-16,9.4,-18.4],.6);mpmgaL(x,[-2,-1.4,-3,0],.8);mpmgaL(x,[2,-1.4,3,0],.8);mpmgaP(x,[12.4,-13.6,14,-14.4,13.2,-12.6],C.red,.3)}
function mpmgaTortoise(x){const C=MPMGA;mpmgaSm(x,[-5,0,-4.4,-4.4,0,-6.4,4.4,-4.4,5,0],C.dgr);mpmgaL(x,[-2,-1,-1.6,-5.4],.35);mpmgaL(x,[2,-1,1.6,-5.4],.35);mpmgaL(x,[-4,-3,4,-3],.35);mpmgaB(x,6.8,-2.6,1.7,1.4,C.grn);mpmgaEye(x,7.4,-3,.35);mpmgaB(x,-3,0,1.3,.6,C.grn);mpmgaB(x,3,0,1.3,.6,C.grn)}

/* =================== 3  Thornwick =================== */
mpmgAdd([3],function(x,L){const C=MPMGA;
  mpmgaGround(x,104,170,27,1);
  mpmgaAt(x,126,27,.95,0,function(x){mpmgaGoat(x)});mpmgaAt(x,152,27,.95,1,function(x){mpmgaGoat(x,{col:C.gry})});
  /* woodsman splitting a log for the wall */
  mpmgaGround(x,208,322,27,1);
  mpmgaAt(x,226,27,1,0,function(x){const h=mpmgaFig(x,{col:C.red,hat:'cap',arm:-1.1});mpmgaL(x,[h.hx-1,h.hy+2,h.hx+3,h.hy-5],.9);mpmgaP(x,[h.hx+2,h.hy-6.4,h.hx+5.6,h.hy-5.4,h.hx+3.4,h.hy-3.4],C.gry)});
  mpmgaAt(x,244,27,1,0,function(x){mpmgaP(x,[-3,0,-3,-5,3,-5,3,0],C.brn);mpmgaB(x,0,-5,3,.9,'#d8be78');mpmgaL(x,[0,-5,0,-.6],.3)});
  mpmgaAt(x,270,27,1,0,function(x){for(let i=0;i<3;i++)mpmgaB(x,i*5,-2.4,2.4,2.4,C.brn);mpmgaB(x,2.5,-7,2.4,2.4,C.brn);for(let i=0;i<4;i++)mpmgaD(x,-1+i*2.6,-2.4,.3,C.dbr)});
  mpmgaAt(x,312,27,.8,1,function(x){mpmgaGoat(x,{col:C.brn})});mpmgaTuft(x,296,27);
  /* a monk rides a pig */
  mpmgaGround(x,112,170,51,0);
  mpmgaAt(x,140,51,.9,0,function(x){mpmgaPig(x);mpmgaAt(x,-.5,-12.5,.6,0,function(x){mpmgaFig(x,{robe:1,col:C.dbr,hat:'tonsure',arm:.3})})});
  /* an ape plays the bagpipes */
  mpmgaGround(x,228,276,51,0);mpmgaAt(x,252,51,1,0,function(x){mpmgaApe(x,{pipes:1})});
  mpmgaD(x,266,36,.7,C.blk);mpmgaD(x,272,40,.6,C.blk);
  /* baker chases a rat with a loaf */
  mpmgaGround(x,300,380,51,1);
  mpmgaAt(x,322,51,1,0,function(x){mpmgaFig(x,{col:C.wht,leg:C.dgy,hat:'cap',hatc:C.wht,arm:-.5})});
  mpmgaAt(x,350,51,.8,0,function(x){mpmgaRat(x,{});mpmgaLoaf(x,10.6,-3,2.8)});
  mpmgaLoaf(x,364,48,2);
  /* fox preaches to geese */
  mpmgaGround(x,10,92,296,1);
  mpmgaAt(x,20,296,1,0,function(x){mpmgaP(x,[-5,0,-5,-6,5,-6,5,0],C.brn);mpmgaB(x,0,-6,5,1.1,'#d8be78');mpmgaAt(x,0,-6,.95,0,mpmgaFox)});
  mpmgaAt(x,48,296,.8,1,mpmgaGoose);mpmgaAt(x,64,296,.8,1,mpmgaGoose);mpmgaAt(x,80,296,.7,1,mpmgaGoose);
  /* cat and mouse */
  mpmgaGround(x,104,170,298,1);
  mpmgaAt(x,126,298,1.2,0,mpmgaCat);mpmgaAt(x,150,298,.45,0,mpmgaRat);
  /* rabbits besiege a log gate */
  mpmgaGround(x,250,384,298,1);
  for(let i=0;i<3;i++)mpmgaAt(x,266+i*15,298,.75,0,function(x){mpmgaRabbit(x);mpmgaSpear(x,3,-3,10,-12)});
  MPLI.castle(x,356,294,1.1);mpmgaAt(x,372,298,.6,1,function(x){mpmgaRabbit(x)});
  /* hens in the corner */
  mpmgaGround(x,396,470,298,1);mpmgaAt(x,418,298,1.3,0,function(x){mpmgaBird(x,C.red)});mpmgaAt(x,440,298,1.1,1,function(x){mpmgaBird(x,C.org)});mpmgaB(x,454,297,1.4,1.7,C.cre);
});

/* =================== 7  Gandrick Wood =================== */
mpmgAdd([7],function(x,L){const C=MPMGA;
  mpmgaGround(x,126,196,27,1);mpmgaAt(x,150,27,1,0,function(x){mpmgaApe(x,{pipes:1})});
  mpmgaGround(x,226,322,27,1);mpmgaAt(x,248,27,1.2,0,function(x){mpmgaRabbit(x);mpmgaHorn(x,5.6,-8.8,.9,-.6)});mpmgaAt(x,290,27,1.1,0,function(x){mpmgaBird(x,C.blk)});
  /* bandit chased by a goose */
  mpmgaGround(x,10,88,246,1);
  mpmgaAt(x,24,246,1.4,0,mpmgaGoose);
  mpmgaAt(x,62,246,1.15,0,function(x){const h=mpmgaFig(x,{col:C.dgr,leg:C.dgy,hat:'cap',hatc:C.dbr,arm:-.3});mpmgaSack(x,h.hx+2,h.hy+3,3)});
  /* skeleton fiddler and a wolf that sings along */
  mpmgaGround(x,10,88,293,1);
  mpmgaAt(x,24,293,1.3,0,function(x){const h=mpmgaSkel(x,{arm:-.2});mpmgaB(x,h.hx+1,h.hy+1,2.6,1.6,C.brn,.4);mpmgaL(x,[h.hx-2,h.hy-2,h.hx+4,h.hy+3],.4);mpmgaL(x,[h.hx+4,h.hy-1,h.hx-2,h.hy+4],.5)});
  mpmgaAt(x,66,293,1.1,0,mpmgaHowl);mpmgaD(x,84,268,.5,C.yel);
  /* huntress and hound */
  mpmgaGround(x,396,470,206,1);
  mpmgaAt(x,414,206,1.1,0,function(x){const h=mpmgaFig(x,{robe:1,col:C.grn,hat:'hood',arm:-.1});mpmgaBow(x,h.hx+1.4,h.hy,5.4,1)});
  mpmgaAt(x,446,206,.8,0,function(x){mpmgaQuad(x,{l:7,t:3.4,g:5,nk:2.4,hr:2.3,sn:2.6,col:C.brn,dk:C.dbr,tail:'curl',ear:'flop'})});
  /* knight versus giant snail */
  mpmgaGround(x,396,470,290,1);
  mpmgaAt(x,462,290,1.25,1,mpmgaSnail);
  mpmgaAt(x,418,290,1.1,0,function(x){const h=mpmgaFig(x,{col:C.blu,leg:C.dgy,hat:'helm',arm:.05});mpmgaSpear(x,h.hx-4,h.hy+1,h.hx+8,h.hy-1);mpmgaShield(x,-4,-8,2.6,C.red)});
  mpmgaMush(x,440,290,2.5);mpmgaMush(x,444,290,1.6);
});

/* =================== 8  Gandrick Cave =================== */
mpmgAdd([8],function(x,L){const C=MPMGA;
  mpmgaBat(x,140,15,1.5);mpmgaBat(x,176,22,1.1);mpmgaBat(x,205,12,1.3);
  mpmgaGround(x,226,310,27,1);mpmgaBarrel(x,278,22,5);
  mpmgaAt(x,248,27,1,0,function(x){const h=mpmgaFig(x,{col:C.red,leg:C.dgy,hat:'cap',hatc:C.dbr,arm:-.3});mpmgaMug(x,h.hx+1,h.hy+1.6,1.8)});
  mpmgaAt(x,300,27,1,1,function(x){mpmgaRat(x,{})});
  /* skeleton climbs out of a coffin */
  mpmgaGround(x,10,88,226,1);
  mpmgaAt(x,46,226,1.2,0,function(x){mpmgaAt(x,0,0,1,0,function(x){mpmgaSkel(x,{arm:-1.1});mpmgaL(x,[-2.2,-11.2,-4,-17],.8)});mpmgaP(x,[-9,0,-7,-8,7,-8,9,0],C.brn);mpmgaL(x,[-1,-7,-1,-1],.5);mpmgaL(x,[-3.4,-5,1.4,-5],.5);mpmgaP(x,[-7,-8,9,-14,10.4,-12,-7,-6],C.dbr)});
  /* bandit with a cheese; a rat in the barrel */
  mpmgaGround(x,10,88,292,1);
  mpmgaBarrel(x,26,285,7);mpmgaPeekRat(x,26,277.4);
  mpmgaAt(x,62,292,1.15,0,function(x){const h=mpmgaFig(x,{col:C.dgr,leg:C.dgy,hat:'cap',hatc:C.red,arm:.1});mpmgaP(x,[h.hx-1,h.hy,h.hx+4,h.hy-1,h.hx+4,h.hy+2.4,h.hx-1,h.hy+2.4],C.yel)});
  /* the chief counts his coins */
  mpmgaGround(x,396,470,190,1);
  mpmgaAt(x,416,190,1.2,0,function(x){const h=mpmgaFig(x,{col:C.red,leg:C.dbr,hat:'cap',hatc:C.blk,arm:.9});mpmgaCoin(x,h.hx,h.hy+1,1.4)});
  mpmgaAt(x,446,190,1,0,function(x){mpmgaP(x,[-5,0,-5,-5,5,-5,5,0],C.dbr);mpmgaSm(x,[-5,-5,-4,-8.6,4,-8.6,5,-5],C.brn);mpmgaL(x,[-5,-5,5,-5],.5);mpmgaD(x,0,-5,.8,C.yel);for(let i=0;i<4;i++)mpmgaCoin(x,7+i*1.8,-.6-i*.3,1.5)});
  /* a rat steals a coin; a snail with a candle */
  mpmgaGround(x,396,470,250,1);mpmgaAt(x,425,250,1.3,0,function(x){mpmgaRat(x,{});mpmgaCoin(x,10.4,-2.4,2.4)});
  mpmgaGround(x,396,470,292,1);mpmgaAt(x,424,292,1.1,0,function(x){mpmgaSnail(x);mpmgaCandle(x,-1.4,-11,3)});mpmgaMush(x,452,292,3);mpmgaMush(x,458,292,2);
});

/* =================== 25  Gandrick Hideout =================== */
mpmgAdd([25],function(x,L){const C=MPMGA;
  /* shooting an apple off a head */
  mpmgaGround(x,10,88,190,1);
  mpmgaAt(x,18,190,1,0,function(x){const h=mpmgaFig(x,{col:C.dgr,leg:C.dbr,hat:'cap',arm:-.05});mpmgaBow(x,h.hx+1.2,h.hy,5.2,1)});
  mpmgaArrow(x,34,177,48,177);
  mpmgaAt(x,66,190,1,1,function(x){mpmgaFig(x,{col:C.red,leg:C.dbr,hat:'none',arm:.5});mpmgaApple(x,.4,-17,1.5)});
  /* sneaking off with the loot, a dog following */
  mpmgaGround(x,10,88,250,1);
  mpmgaAt(x,40,250,1.15,0,function(x){const h=mpmgaFig(x,{col:C.dbr,leg:C.dgy,hat:'hood',arm:.1});mpmgaSack(x,-5,-8,3.4)});
  mpmgaAt(x,16,250,.7,0,function(x){mpmgaQuad(x,{l:7,t:3.4,g:5,nk:2.4,hr:2.3,sn:2.6,col:C.brn,dk:C.dbr,tail:'curl',ear:'flop'})});
  mpmgaCoin(x,68,249,1.6);mpmgaCoin(x,76,249.4,1.6);
  /* a barrel hugger */
  mpmgaGround(x,10,88,293,1);
  mpmgaBarrel(x,60,286,7);
  mpmgaAt(x,30,293,1.1,0,function(x){const h=mpmgaFig(x,{col:C.blu,leg:C.dgy,hat:'cap',hatc:C.grn,arm:.2});mpmgaMug(x,h.hx+1,h.hy+1.6,1.8)});
  /* dice with a skeleton */
  mpmgaGround(x,396,470,215,1);
  mpmgaAt(x,414,215,1.1,0,function(x){mpmgaFig(x,{col:C.red,leg:C.dgy,hat:'cap',hatc:C.blk,arm:.7})});
  mpmgaAt(x,452,215,1.1,1,function(x){mpmgaSkel(x,{arm:.7})});
  mpmgaAt(x,433,215,1,0,function(x){mpmgaP(x,[-3,0,-3,-4,3,-4,3,0],C.brn);mpmgaP(x,[-1.4,-5.4,.2,-5.4,.2,-4,-1.4,-4],C.wht,.3);mpmgaP(x,[.8,-5.2,2.2,-5.2,2.2,-4,.8,-4],C.wht,.3)});
  /* a crow guards a coin */
  mpmgaGround(x,396,470,160,1);mpmgaAt(x,430,160,1.5,0,function(x){mpmgaBird(x,C.blk)});mpmgaCoin(x,445,159,1.8);
  /* a wyvern on the hoard */
  mpmgaGround(x,396,470,292,1);for(let i=0;i<5;i++)mpmgaCoin(x,410+i*6,291,2);
  mpmgaAt(x,440,288,1.5,1,mpmgaWyvern);
});

/* =================== 32  Greendale =================== */
mpmgAdd([32],function(x,L){const C=MPMGA;
  /* the hare and the tortoise */
  mpmgaGround(x,104,226,27,1);
  mpmgaAt(x,128,27,1.1,0,function(x){mpmgaRabbit(x)});
  mpmgaAt(x,196,27,1,0,mpmgaTortoise);mpmgaFlower(x,214,27,C.red);mpmgaFlower(x,160,27,C.blu);
  /* bees at their skep */
  mpmgaGround(x,250,322,27,1);mpmgaSkep(x,270,27,1.5);for(const [a,b] of [[286,10],[296,18],[282,22],[304,12],[311,22]])mpmgaBee(x,a,b,1.4);mpmgaFlower(x,300,27,C.red);mpmgaFlower(x,312,27,C.yel);
  /* a rabbit picnic */
  mpmgaGround(x,10,90,215,1);
  mpmgaP(x,[24,214,70,214,76,216.6,18,216.6],C.blu);
  mpmgaLoaf(x,38,212.4,3.4);mpmgaMug(x,50,213.6,2);mpmgaApple(x,58,212.6,2);
  mpmgaAt(x,22,215,1,0,mpmgaRabbit);mpmgaAt(x,76,215,1.1,1,function(x){mpmgaRabbit(x,{col:C.gry})});
  /* a deer asleep standing up, a bird on its back */
  mpmgaGround(x,10,90,262,1);
  mpmgaAt(x,40,262,1.05,0,function(x){mpmgaDeer(x);mpmgaAt(x,-1,-12.5,.9,0,function(x){mpmgaBird(x,C.blu)})});
  mpmgaFlower(x,70,262,C.red);mpmgaFlower(x,78,262,C.yel);
  /* snail and toadstools */
  mpmgaGround(x,10,90,293,1);mpmgaAt(x,34,293,.8,0,mpmgaSnail);mpmgaMush(x,60,293,3);mpmgaMush(x,68,293,2);
  /* a rabbit reading a book */
  mpmgaGround(x,396,470,293,1);
  mpmgaAt(x,428,293,1.2,0,function(x){mpmgaRabbit(x);mpmgaBook(x,9,-2.4,3.4,0,1)});
  mpmgaFlower(x,404,293,C.red);mpmgaFlower(x,452,293,C.yel);mpmgaFlower(x,458,293,C.blu);
});

/* =================== 33  Anaea =================== */
mpmgAdd([33],function(x,L){const C=MPMGA;
  /* ape stealing apples, farmer shaking a fist */
  mpmgaGround(x,108,206,27,1);
  mpmgaTree(x,128,27,20,C.dgr);for(const [a,b] of [[122,13],[131,11],[126,18],[135,17]])mpmgaApple(x,a,b,1.3);
  mpmgaAt(x,150,27,1,1,function(x){mpmgaApe(x);mpmgaApple(x,5.6,-5,1.5)});
  mpmgaAt(x,188,27,1,1,function(x){mpmgaFig(x,{col:C.dbr,leg:C.dgy,hat:'straw',arm:-1.2})});
  /* trader and laden donkey */
  mpmgaGround(x,226,324,27,1);
  mpmgaAt(x,258,27,.95,0,function(x){mpmgaDonkey(x);mpmgaSack(x,-2,-14,3.6);mpmgaSack(x,3.6,-14,2.8)});
  mpmgaAt(x,296,27,1,0,function(x){const h=mpmgaFig(x,{col:C.blu,leg:C.dgy,hat:'cap',hatc:C.red,arm:.2});mpmgaL(x,[h.hx,h.hy,h.hx-14,h.hy+2],.5)});
  /* the baker's tray, a watchful cat */
  mpmgaGround(x,10,90,195,1);
  mpmgaAt(x,22,195,1.05,0,function(x){const h=mpmgaFig(x,{col:C.cre,leg:C.dgy,hat:'cap',hatc:C.wht,arm:-.2});mpmgaP(x,[h.hx-1,h.hy+1,h.hx+8,h.hy+1,h.hx+7,h.hy+2,h.hx,h.hy+2],C.brn);mpmgaLoaf(x,h.hx+1.8,h.hy,1.8);mpmgaLoaf(x,h.hx+5.4,h.hy,1.8)});
  mpmgaAt(x,70,195,.9,1,mpmgaCat);mpmgaLoaf(x,50,194,1.8);
});
