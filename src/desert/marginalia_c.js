/* Marginalia for the area maps (see mpmgAdd in maps_common.js). Names in this file start with mpmgc.
   Artist C: Sand Road 41, Tomb of Sut 42, Red Dunes 43, Blue Dunes 60, Golden Erg 61, Violet Erg 62, White Dunes 63, Flatlands 64, Khemetra 44.
   Arabic / medieval-Islamic manuscript drolleries: camels, hoopoe, scorpion, astrolabe, scribe, falcon, gazelle, lute, djinn, charmer. */
const MPGC={sand:'#e6cb90',cam:'#c9985c',dk:'#6b4522',cr:'#f6eed6',sk:'#d9a574',blue:'#7a9ad0',bone:'#f2ead4',gold:'#e0b630',wrap:'#e9dcb6'};
function mpmgcInk(x,w){x.strokeStyle=MPL.INK;x.lineWidth=w;x.lineCap='round';x.lineJoin='round'}
function mpmgcP(x,pts,o){o=o||{};const n=pts.length,j=o.j==null?.16:o.j,sd=o.s||3;
  const q=pts.map((p,i)=>[p[0]+(hash2(i*13+7,Math.round(p[1]*5),sd)-.5)*2*j,p[1]+(hash2(i*5+1,Math.round(p[0]*5),sd+9)-.5)*2*j]);
  x.beginPath();
  if(o.k){x.moveTo(q[0][0],q[0][1]);for(let i=1;i<n;i++)x.lineTo(q[i][0],q[i][1]);if(!o.open)x.closePath()}
  else if(o.open){x.moveTo(q[0][0],q[0][1]);for(let i=1;i<n-1;i++){x.quadraticCurveTo(q[i][0],q[i][1],(q[i][0]+q[i+1][0])/2,(q[i][1]+q[i+1][1])/2)}x.lineTo(q[n-1][0],q[n-1][1])}
  else{x.moveTo((q[n-1][0]+q[0][0])/2,(q[n-1][1]+q[0][1])/2);for(let i=0;i<n;i++){const b=q[(i+1)%n];x.quadraticCurveTo(q[i][0],q[i][1],(q[i][0]+b[0])/2,(q[i][1]+b[1])/2)}x.closePath()}
  if(o.f){x.fillStyle=o.f;x.fill()}if(o.w!==0){mpmgcInk(x,o.w||.55);x.stroke()}}
function mpmgcLn(x,pts,w,col,o){mpmgcP(x,pts,Object.assign({open:1,w:0,j:.12},o||{}));x.strokeStyle=col||MPL.INK;x.lineWidth=w||.5;x.lineCap='round';x.lineJoin='round';x.stroke()}
function mpmgcDot(x,a,b,r,f,w){x.beginPath();x.arc(a,b,r,0,6.3);if(f){x.fillStyle=f;x.fill()}if(w!==0){mpmgcInk(x,w||.5);x.stroke()}}
function mpmgcEye(x,a,b,r){mpmgcDot(x,a,b,r||.55,MPL.INK,0)}
function mpmgcLimb(x,pts,w,col){mpmgcLn(x,pts,w+.95,MPL.INK);mpmgcLn(x,pts,w,col)}
function mpmgcHatch(x,a,b,w,h,n,ang,lw){mpmgcInk(x,lw||.3);x.beginPath();for(let i=0;i<n;i++){const t=(i+.5)/n,xx=a+w*t;x.moveTo(xx,b);x.lineTo(xx+(ang||0)*h,b+h)}x.stroke()}
function mpmgcPlace(x,fn,a,b,s,f,arg){x.save();x.translate(a,b);x.scale((f||1)*(s||1),s||1);try{fn(x,arg)}catch(e){console.error('mpmgc',fn.name,e)}x.restore()}
function mpmgcGround(x,a,b,w,col){mpmgcLn(x,[[a,b],[a+w*.3,b+.3],[a+w*.7,b-.2],[a+w,b+.2]],.5,col||MPL.INK);x.globalAlpha=.5;mpmgcInk(x,.3);x.beginPath();for(let i=0;i<w;i+=2.2){x.moveTo(a+i,b+.8);x.lineTo(a+i-1.2,b+2)}x.stroke();x.globalAlpha=1}
/* a head in profile facing right with a turban; r = face radius */
function mpmgcHead(x,a,b,r,tc,o){o=o||{};
  if(o.beard)mpmgcP(x,[[a-r*.2,b+r*.5],[a+r*.9,b+r*.4],[a+r*.6,b+r*1.7],[a,b+r*1.5]],{f:'#4a3018',w:.4});
  mpmgcDot(x,a,b,r,MPGC.sk);
  mpmgcP(x,[[a-r*1.2,b-r*.1],[a-r*1.2,b-r*1.1],[a-r*.3,b-r*1.9],[a+r*.8,b-r*1.7],[a+r*1.2,b-r*.8],[a+r*1.1,b-r*.3],[a,b-r*.65]],{f:tc,w:.5});
  mpmgcLn(x,[[a-r*1.1,b-r*.6],[a,b-r*1.15],[a+r*1.1,b-r*.5]],.3);mpmgcLn(x,[[a-r*.9,b-r*1.2],[a+r*.2,b-r*1.7]],.3);
  if(o.pointed)mpmgcLn(x,[[a,b-r*1.8],[a-r*.1,b-r*2.6]],.5);
  mpmgcEye(x,a+r*.45,b-r*.05,r*.13);mpmgcLn(x,[[a+r*.95,b+r*.05],[a+r*1.25,b+r*.3],[a+r*.9,b+r*.4]],.3)}
/* ---------- creatures ---------- */
function mpmgcCamel(x,o){o=o||{};const C=o.c||MPGC.cam;
  mpmgcLimb(x,[[-7,-7],[-7.5,-3.5],[-7,0]],1.3,C);mpmgcLimb(x,[[5,-7],[5.5,-3.5],[5,0]],1.3,C);
  mpmgcP(x,[[-10,-9],[-9,-12],[-7.5,-15.5],[-5.5,-15],[-4,-11.5],[-2,-11],[0,-15.5],[2,-15],[3.5,-11.5],[6,-10.5],[8,-12],[10,-17],[11.5,-20],[14,-20.8],[17,-19.4],[17.2,-17.8],[13.5,-17],[12.5,-14],[9.5,-8.5],[6,-6.2],[-2,-6.2],[-9,-6.5]],{f:C,s:o.sd||4});
  mpmgcHatch(x,-6,-9,10,2.5,6,.3,.25);
  mpmgcLimb(x,[[-5,-6.5],[-4.5,-3],[-5,0]],1.4,C);mpmgcLimb(x,[[7,-7],[7.5,-3.5],[8,0]],1.4,C);
  mpmgcLn(x,[[-10,-9],[-12,-7],[-11.6,-3.5]],.55);mpmgcDot(x,-11.6,-3,.9,MPL.INK,0);
  mpmgcEye(x,14.3,-18.8,.5);mpmgcLn(x,[[17.2,-18.2],[14.8,-17.7]],.3);
  if(o.rug){mpmgcP(x,[[-4.6,-11.4],[4.6,-11.4],[4.9,-7.3],[-4.9,-7.3]],{f:o.rug,k:1,w:.45});mpmgcLn(x,[[-4.5,-9.4],[4.5,-9.4]],.4,MPL.GOLD);
    for(let i=-4;i<=4;i+=1.3)mpmgcLn(x,[[i,-7.3],[i,-6.4]],.3,MPL.GOLD)}
  if(o.load){mpmgcP(x,[[-4,-12],[-5,-16],[-1,-18.5],[3,-17.5],[4,-12.5]],{f:o.load});mpmgcLn(x,[[-3.5,-15],[3,-15]],.3);mpmgcLn(x,[[-1,-18.4],[-1,-13]],.3)}}
function mpmgcDonkey(x){const C='#a89880';
  mpmgcLimb(x,[[-6,-6],[-6,0]],1.1,C);mpmgcLimb(x,[[4,-6],[4.3,0]],1.1,C);
  mpmgcP(x,[[-8,-10],[-6,-11.5],[3,-11.5],[6,-12],[9,-15],[10.5,-17.5],[13.5,-16.5],[13.5,-14],[10.5,-13],[8.5,-9],[5,-6],[-5,-6],[-8.5,-7.5]],{f:C});
  mpmgcP(x,[[9.8,-17],[10.5,-22],[12,-17.5]],{f:C,w:.4});mpmgcP(x,[[11,-17],[13,-21.5],[13.2,-16.5]],{f:C,w:.4});
  mpmgcLimb(x,[[-4,-6],[-4,0]],1.2,C);mpmgcLimb(x,[[6,-6],[6.3,0]],1.2,C);
  mpmgcLn(x,[[-8.5,-10],[-11,-8],[-10.5,-4]],.5);mpmgcEye(x,12.2,-15.7,.45);mpmgcDot(x,13.4,-14.7,.5,'#d8c8a8',.3);
  mpmgcP(x,[[-5,-11.5],[4,-11.5],[4.5,-7],[-5.5,-7]],{f:MPL.VERM,k:1,w:.45});mpmgcLn(x,[[-5,-9.5],[4.2,-9.5]],.35,MPL.GOLD);
  mpmgcDot(x,-3,-14,2.6,'#d9bd7a');mpmgcLn(x,[[-4.3,-14.4],[-1.7,-13.6]],.3)}
function mpmgcBird(x,t,o){o=o||{};// t: hoopoe falcon vulture owl
  const body={hoopoe:'#e0a070',falcon:'#8a7a66',vulture:'#4a3a2e',owl:'#b8a080'}[t];
  mpmgcLimb(x,[[-1,-4.5],[-1.5,0]],.5,'#7a6a5a');mpmgcLimb(x,[[1.2,-4.5],[1.3,0]],.5,'#7a6a5a');
  if(t==='hoopoe'){mpmgcP(x,[[-9,-6],[-5,-3.5],[-1,-4.5],[3,-6],[4.5,-9.5],[3,-11.5],[-1,-9],[-5,-8.5]],{f:body});
    mpmgcP(x,[[-9.5,-6.5],[-5,-5.5],[-5.5,-7.8],[-10,-8.2]],{f:'#f4ecd8'});mpmgcLn(x,[[-8.5,-7],[-8.2,-5.9]],.7);mpmgcLn(x,[[-6.5,-6.8],[-6.2,-5.6]],.7);
    mpmgcP(x,[[-4,-8],[-.5,-5.5],[1,-7.5],[-2,-9.5]],{f:'#f4ecd8'});mpmgcLn(x,[[-3,-8.3],[-1.2,-6.2]],.7);mpmgcLn(x,[[-1.8,-8.8],[-.2,-6.8]],.7);
    for(let i=0;i<5;i++){const an=-2.5+i*.45;mpmgcLn(x,[[3.5,-11],[3.5+Math.cos(an)*5,-11+Math.sin(an)*5]],.5,MPL.INK);mpmgcDot(x,3.5+Math.cos(an)*5,-11+Math.sin(an)*5,.7,i%2?MPL.VERM:MPL.INK,0)}
    mpmgcLn(x,[[5,-10],[8,-9.4],[10.5,-8.4]],.5);mpmgcLn(x,[[5,-9.6],[8,-8.9],[10.5,-8.2]],.4);mpmgcEye(x,4.3,-10.3,.45)}
  else if(t==='falcon'){mpmgcP(x,[[-7,-1],[-5,-5],[-2,-9],[2,-12],[5,-12],[5.5,-9],[3,-5],[1,-3]],{f:body});
    mpmgcP(x,[[-4,-3],[-1,-9],[3,-6],[1,-3]],{f:'#6a5a48'});mpmgcHatch(x,-1.4,-9,3,4,5,-.3,.3);
    mpmgcP(x,[[3.5,-14],[5.5,-14.5],[7,-12.5],[5,-11.5],[3,-12]],{f:'#e2d4b4'});mpmgcP(x,[[6.5,-13.4],[8.5,-12.2],[7,-11.5]],{f:'#e8c040',w:.35});mpmgcEye(x,5.4,-13.2,.5);mpmgcLn(x,[[4.2,-12.6],[3.9,-11.3]],.3);
    mpmgcP(x,[[-7,-1],[-10.5,3.2],[-9,3.4],[-5.5,-.6]],{f:'#8a7a66',w:.4});mpmgcHatch(x,-9.5,1,3,2,3,0,.3)}
  else if(t==='vulture'){mpmgcP(x,[[-8,-1],[-5,-6],[0,-9],[4,-8.5],[5,-5],[2,-2.5]],{f:body});
    mpmgcP(x,[[-6,-2.5],[-2,-8.5],[3,-7.5],[2,-3]],{f:'#3a2a20'});mpmgcHatch(x,-3.5,-8,5,4,6,-.2,.3);
    mpmgcP(x,[[2,-8],[3.5,-8.5],[4.2,-12],[3.6,-14],[5.8,-14.4],[6.6,-12.6],[5.6,-11.8],[6.2,-9],[5,-6]],{f:'#d09878',w:.45});
    mpmgcP(x,[[3,-8.2],[4.4,-9],[6.5,-8],[6.2,-6.5],[4,-6.2],[2,-6]],{f:'#f2e8d0',w:.4});mpmgcLn(x,[[3.4,-7.4],[5.8,-7.4]],.25);
    mpmgcP(x,[[6.4,-14.3],[9.3,-13.8],[8.4,-12.5],[7.2,-12.7]],{f:'#e4c868',w:.4});mpmgcEye(x,5.4,-14,.5);mpmgcLn(x,[[4.3,-15],[5.8,-15]],.3)}
  else {mpmgcDot(x,0,-8,5.4,body);mpmgcDot(x,0,-14,4.1,body);mpmgcP(x,[[-3.8,-16.6],[-4.8,-19.6],[-1.5,-17.6]],{f:body,w:.4});mpmgcP(x,[[3.8,-16.6],[4.8,-19.6],[1.5,-17.6]],{f:body,w:.4});
    mpmgcDot(x,-1.7,-14.2,1.5,'#f6e8a8');mpmgcDot(x,1.7,-14.2,1.5,'#f6e8a8');mpmgcEye(x,-1.7,-14.2,.7);mpmgcEye(x,1.7,-14.2,.7);mpmgcP(x,[[-.5,-13],[.5,-13],[0,-11.7]],{f:'#d8a040',k:1,w:.35});
    mpmgcHatch(x,-3,-9,6,4,5,0,.3);for(const dy of [-9,-6.5])mpmgcLn(x,[[-3,dy],[0,dy+1],[3,dy]],.3)}}
function mpmgcScorp(x,o){o=o||{};const C=o.c||'#7a4a22',D=o.d||'#4a2a12';
  for(let i=0;i<4;i++){mpmgcLn(x,[[-2+i*2,-2.5],[-3+i*2.2,-.6],[-3.6+i*2.4,0]],.4);mpmgcLn(x,[[-1+i*2,-2.5],[0+i*2.2,-.6],[.6+i*2.4,0]],.4)}
  mpmgcP(x,[[-4,-4.4],[-1,-5.6],[3,-5.4],[5,-3.6],[3,-2.6],[-1,-2.4],[-4,-3]],{f:C});
  mpmgcLn(x,[[0,-5.4],[0,-2.4]],.3);mpmgcLn(x,[[2,-5.3],[2,-2.5]],.3);
  mpmgcLn(x,[[-4,-3.8],[-7,-4.6],[-9,-8],[-8,-12],[-5,-14],[-2,-13.5]],1.1,D);mpmgcLn(x,[[-4,-3.8],[-7,-4.6],[-9,-8],[-8,-12],[-5,-14],[-2,-13.5]],.6,C);
  mpmgcP(x,[[-2,-13.5],[-.4,-14.3],[.6,-12.8],[-1,-12.6]],{f:'#c03020',w:.4});
  mpmgcLn(x,[[4.5,-4.5],[8,-6],[10.5,-6.5]],.8,C);mpmgcLn(x,[[4.5,-4.5],[8,-6],[10.5,-6.5]],.3,MPL.INK);
  mpmgcP(x,[[10,-9],[13,-9.2],[12.5,-6.2],[10,-6]],{f:C,w:.45});mpmgcLn(x,[[10,-9],[13.4,-7.6]],.3);
  mpmgcP(x,[[3.5,-2.8],[6,-1.4],[9,-2],[8,-4]],{f:C,w:.45});mpmgcEye(x,4.2,-4.3,.4)}
function mpmgcGazelle(x){const C='#d6a468';
  mpmgcLimb(x,[[5,-8],[8,-6],[11,-9]],.9,C);mpmgcLimb(x,[[-6,-8],[-8,-4],[-12,-2.5]],.9,C);
  mpmgcP(x,[[-8,-10],[-4,-11.5],[3,-11],[6,-12],[8,-15],[9.5,-18.5],[12,-19],[14,-17],[11.4,-15.5],[10.5,-13],[8,-8.5],[3,-7.5],[-5,-7.5]],{f:C});
  mpmgcP(x,[[-5,-8],[3,-8],[6,-9],[8.5,-9],[8,-8.3],[3,-7.4],[-5,-7.4]],{f:'#f6eed6',w:.3});mpmgcLn(x,[[-7,-9.8],[3,-9.8],[7.4,-10.6]],.35,'#6a4422');
  mpmgcLimb(x,[[-4,-8],[-7,-5],[-9.6,-.8]],1,C);mpmgcLimb(x,[[3,-8],[6,-5],[7.4,-.8]],1,C);
  mpmgcLn(x,[[-8,-10],[-10,-11],[-10.5,-9]],.5);
  mpmgcLn(x,[[10,-19],[9.4,-22],[10.2,-25],[12,-26.4]],.5);mpmgcLn(x,[[11,-19.4],[11,-22],[12.2,-24.6],[13.8,-25]],.5);
  for(let i=0;i<4;i++)mpmgcLn(x,[[9.3-.1*i,-20.5-i*1.4],[10.6,-20.2-i*1.4]],.3);
  mpmgcP(x,[[9.2,-18.6],[9.6,-21],[11,-19.4]],{f:C,w:.4});mpmgcEye(x,11.4,-17.9,.45);mpmgcDot(x,13.8,-17,.5,MPL.INK,0);mpmgcLn(x,[[10,-17],[12,-16.5]],.25,'#4a2a12')}
function mpmgcSnake(x,o){o=o||{};const C=o.c||'#7a8a3a';x.save();
  mpmgcLn(x,[[0,0],[-3,-3],[3,-6],[-2,-9],[0,-12]],2.2,MPL.INK);mpmgcLn(x,[[0,0],[-3,-3],[3,-6],[-2,-9],[0,-12]],1.3,C);
  mpmgcP(x,[[-.2,-11],[-3.2,-14],[-2.2,-17],[0,-17.6],[2.2,-17],[3.2,-14],[.2,-11]],{f:C});
  mpmgcDot(x,0,-14.5,.8,'#e8d888',.25);mpmgcEye(x,-1,-16.2,.35);mpmgcEye(x,1,-16.2,.35);mpmgcLn(x,[[0,-15.5],[0,-14.4],[.7,-13.3]],.25,MPL.VERM);x.restore()}
function mpmgcCrossLeg(x,rc){ // seated body, facing right, origin at the seat on the ground
  mpmgcP(x,[[-7,0],[-6,-3],[-3,-7],[-2,-12],[2,-12],[4,-8],[8,-3],[8.5,0]],{f:rc});
  mpmgcLn(x,[[-5,-1.5],[0,-3],[6,-1.6]],.3);mpmgcLn(x,[[-1,-11],[-.5,-5],[0,-3]],.3);mpmgcLn(x,[[2,-9],[3.4,-5],[4.4,-2.6]],.3)}
function mpmgcAstro(x,a,b,r){mpmgcDot(x,a,b,r,'#e8c050');mpmgcDot(x,a,b,r*.78,'#f4e6a8',.3);mpmgcInk(x,.25);x.beginPath();for(let i=0;i<24;i++){const an=i*Math.PI/12;x.moveTo(a+Math.cos(an)*r*.78,b+Math.sin(an)*r*.78);x.lineTo(a+Math.cos(an)*r*.95,b+Math.sin(an)*r*.95)}x.stroke();
  mpmgcLn(x,[[a-r*.7,b+r*.1],[a+r*.7,b-r*.1]],.3);mpmgcLn(x,[[a,b-r*.75],[a,b+r*.7]],.3);mpmgcLn(x,[[a-r*.55,b-r*.5],[a+r*.3,b+r*.6]],.35,MPL.LAPIS);mpmgcDot(x,a+r*.5,b-r*.35,r*.12,MPL.VERM,0);mpmgcDot(x,a,b-r*1.18,r*.22,'#e8c050',.35)}
/* ---------- scenes ---------- */
function mpmgcMapmaker(x){mpmgcGround(x,-14,0,30);mpmgcCrossLeg(x,'#3f6a8a');mpmgcHead(x,1,-17,3.6,'#f0e6c8',{beard:1});
  mpmgcLimb(x,[[3,-10],[7,-14],[9,-19]],1.2,'#3f6a8a');mpmgcDot(x,9.4,-19.6,1,MPGC.sk,.3);mpmgcAstro(x,10,-24,4.6);
  mpmgcP(x,[[-13,-1],[-8,-1.4],[-8,-3.8],[-13,-3.4]],{f:'#f4ecd2',k:1,w:.4});mpmgcLn(x,[[-12,-2.2],[-9,-2.6]],.25,MPL.VERM);mpmgcLn(x,[[-12,-3],[-10,-3.1]],.25,MPL.LAPIS);
  mpmgcLn(x,[[7,-1.2],[12,-3],[15,-1.2]],.4);mpmgcLn(x,[[12,-3],[12,-.8]],.3)}
function mpmgcScribe(x){mpmgcGround(x,-14,0,30);mpmgcP(x,[[3,0],[3.5,-6],[14,-6],[14.4,0]],{f:'#a8743c',k:1});mpmgcP(x,[[2,-6],[15.4,-6],[15,-7.4],[2.4,-7.4]],{f:'#c89a5a',k:1,w:.4});
  mpmgcP(x,[[4,-7.4],[10,-7.4],[10.4,-9.4],[4.6,-9.4]],{f:'#f6eed6',k:1,w:.35});mpmgcLn(x,[[5,-8.2],[9,-8.2]],.2);mpmgcDot(x,12.6,-8.5,.9,MPL.INK,0);
  mpmgcCrossLeg(x,MPL.VERD);mpmgcHead(x,.5,-17,3.5,'#a82a1e');mpmgcLimb(x,[[2,-9],[4,-8],[6,-9.5]],1.1,MPL.VERD);mpmgcLn(x,[[6,-9.4],[9,-12]],.4);
  mpmgcP(x,[[-14,-1],[-8,-1.5],[-7.6,-5],[-14,-5]],{f:'#f4ecd2',k:1,w:.4});for(let i=0;i<3;i++)mpmgcLn(x,[[-13,-2.1-i*1],[-9,-2.2-i*1]],.2)}
function mpmgcLute(x){mpmgcGround(x,-14,0,30);mpmgcCrossLeg(x,'#a8461e');mpmgcHead(x,.8,-17,3.5,'#2a5a8a',{pointed:0});
  mpmgcP(x,[[3,-3],[6,-6.5],[9.5,-6],[11,-3],[9,-.6],[5,-.4]],{f:'#b57a3c'});mpmgcDot(x,7.4,-3.4,1.2,'#3a2410',.3);for(let i=0;i<3;i++)mpmgcDot(x,6+i*1.2,-1.4,.15,MPL.INK,0);
  mpmgcLn(x,[[9,-5.4],[13,-9.5],[17,-13.5]],.9);mpmgcP(x,[[16,-12.5],[19.5,-16.6],[18,-17.8],[15,-14]],{f:'#6b4522',w:.4});
  mpmgcLn(x,[[3.5,-9],[6,-6.5]],1.2,'#a8461e');mpmgcLn(x,[[7,-5],[12,-9]],1.1,'#a8461e');
  for(const [a,b] of [[-6,-22],[-10,-17],[-9,-9]]){mpmgcDot(x,a,b,.9,MPL.INK,0);mpmgcLn(x,[[a+.8,b],[a+.8,b-3.4],[a+2.2,b-2.6]],.3)}}
function mpmgcCharmer(x){mpmgcGround(x,-16,0,34);mpmgcCrossLeg(x,'#d8b030');mpmgcHead(x,-6,-17,3.4,'#b0301e');
  mpmgcLimb(x,[[-4,-10],[-1,-12],[2,-13.5]],1.1,'#d8b030');mpmgcLn(x,[[-1,-14],[6,-14.6],[10,-13.8]],.7);mpmgcDot(x,-3,-14.5,.5,MPL.INK,0);
  mpmgcP(x,[[8,0],[8.4,-4],[10,-6.6],[16,-6.6],[17.6,-4],[18,0]],{f:'#c89a5a'});mpmgcHatch(x,9,-6,8,6,6,.5,.3);mpmgcHatch(x,9,-6,8,6,6,-.5,.3);mpmgcLn(x,[[8.4,-4],[17.6,-4]],.3);
  x.save();x.translate(13,-6);mpmgcSnake(x);x.restore();
  for(const [a,b] of [[1,-22],[4,-25]]){mpmgcDot(x,a+6,b,.7,MPL.INK,0);mpmgcLn(x,[[a+6.7,b],[a+6.7,b-3]],.3)}}
function mpmgcMerchant(x){mpmgcGround(x,-16,0,34);x.save();mpmgcDonkey(x);x.restore();
  mpmgcP(x,[[-4,-14],[-3,-21],[3,-21.5],[4,-14.4]],{f:'#3f7a5a'});mpmgcHead(x,.2,-24.4,3,'#f0e6c8',{beard:1});
  mpmgcLn(x,[[2,-20],[6,-20.5],[8.5,-18.6]],.9,'#3f7a5a');mpmgcLn(x,[[8,-19],[10.5,-9]],.4);
  mpmgcP(x,[[-16,-14],[-10,-14.4],[-9.4,-8],[-15.6,-7.5]],{f:'#b88a4c',k:1,w:.4});mpmgcLn(x,[[-15.5,-11],[-10,-11]],.25);mpmgcDot(x,-13,-14.6,1.1,'#d9bd7a')}
function mpmgcDjinn(x){mpmgcGround(x,-8,0,16);mpmgcP(x,[[-2,0],[-5.6,-2],[-6.4,-5.6],[-3.6,-8],[-1.2,-9.8],[-1.2,-12],[1.4,-12],[1.4,-9.8],[3.8,-8],[6.2,-5.6],[5.4,-2],[1.8,0]],{f:'#4aa8a0'});
  mpmgcP(x,[[-4.4,-5.5],[-3,-7.5],[-3.8,-3.5]],{f:'#cfeee8',w:0});mpmgcLn(x,[[-5.4,-3.6],[4,-4.3]],.3,'#f0d878');
  mpmgcP(x,[[-.5,-12],[-.8,-13.4],[1.2,-13.4],[.9,-12]],{f:'#a8461e',k:1,w:.4});
  const C='#8a6ac0';mpmgcP(x,[[0,-13.4],[-3,-16],[2,-19],[-2.4,-22],[0,-25],[-5,-27.5],[-7,-24.4],[-2,-23],[3,-23],[8,-24.4],[6,-27.5],[1.4,-25],[3.4,-22],[-1,-19],[3,-16]],{f:C,s:6,j:.4,w:.45});
  mpmgcDot(x,0,-29,2.6,MPGC.sk);mpmgcP(x,[[-3,-29.4],[-2.6,-31.2],[0,-32.4],[2.6,-31.2],[3,-29.4],[0,-30.4]],{f:MPL.VERM,w:.4});mpmgcDot(x,0,-32.8,.8,MPL.GOLD,.3);
  mpmgcEye(x,-.8,-28.8,.35);mpmgcEye(x,1,-28.8,.35);mpmgcP(x,[[-1.6,-27.4],[0,-25.4],[1.6,-27.4]],{f:'#4a3018',w:.3,k:1});
  mpmgcLn(x,[[-2.4,-23.4],[0,-22],[2.4,-23.4]],.7,MPL.GOLD2)}
function mpmgcArab(x,o){o=o||{};const cols=[MPL.LAPIS,MPL.VERM,MPL.VERD];
  const sp=(cx,cy,r0,dir)=>{const pts=[];for(let t=0;t<=1;t+=.05){const an=dir*(t*10.5)+1.2,r=r0*(1-t*.88);pts.push([cx+Math.cos(an)*r,cy+Math.sin(an)*r])}
    mpmgcLn(x,pts,1.5,MPL.INK);mpmgcLn(x,pts,.8,MPL.GOLD);
    for(const k of [4,8,12,16]){const p=pts[k],q=pts[k+1],nx=-(q[1]-p[1]),ny=q[0]-p[0],l=Math.hypot(nx,ny)||1;mpmgcP(x,[[p[0],p[1]],[p[0]+nx/l*3.6+(q[0]-p[0])*1.4,p[1]+ny/l*3.6+(q[1]-p[1])*1.4],[p[0]+nx/l*.8+(q[0]-p[0])*3.2,p[1]+ny/l*.8+(q[1]-p[1])*3.2]],{f:cols[k/4%3|0],w:.35})}
    const e=pts[pts.length-1];mpmgcDot(x,e[0],e[1],1.2,MPL.VERM,.3);mpmgcDot(x,e[0],e[1],.4,MPL.GOLD2,0)};
  sp(0,0,7,1);sp(15,-2,6,-1);mpmgcLn(x,[[7,0],[11,-2],[15,-2]],.9,MPL.INK);mpmgcLn(x,[[7,0],[11,-2],[15,-2]],.5,MPL.GOLD);
  mpmgcP(x,[[-2,6],[-1,2],[0,6.5]],{f:MPL.LAPIS,w:.3});mpmgcDot(x,-6,-6,.9,MPL.GOLD,.25)}
function mpmgcSphinx(x){ // a sphinx-cat lying on its hoard, facing right
  for(let i=0;i<14;i++){const a=-18+i*2.9+hash2(i,2,5)*1.6,b=-1.4-Math.min(i,13-i)*.9*hash2(i,1,6)-hash2(i,3,5);mpmgcDot(x,a,b,1.5,i%3?MPL.GOLD:'#f0d060',.3)}
  mpmgcP(x,[[-20,0],[-14,-3],[-8,-4],[-2,-3.6],[2,-3],[5,0]],{f:'#e6c040',w:.45});
  for(const [a,b] of [[-12,-3],[-6,-3.8],[0,-3.2],[-9,-1.5],[-3,-1.6]]){mpmgcDot(x,a,b,1.3,'#f6dc70',.3);mpmgcLn(x,[[a-.6,b],[a+.6,b]],.2)}
  mpmgcP(x,[[-14,-5],[-12,-11],[-6,-14],[0,-13.5],[3,-10],[10,-8.6],[11.5,-5.4],[3,-4.4],[-6,-4.6]],{f:'#d8a458'});mpmgcHatch(x,-11,-12,10,5,8,.3,.3);
  mpmgcLn(x,[[-14,-6],[-17.6,-9],[-18,-13]],.9);mpmgcDot(x,-18,-13.6,.9,'#d8a458',.35);
  mpmgcLimb(x,[[3,-6],[8,-5.2],[11.6,-5.4]],1.7,'#d8a458');mpmgcLn(x,[[10.4,-6.6],[10.5,-4.8]],.25);mpmgcLn(x,[[11.4,-6.4],[11.5,-4.8]],.25);
  mpmgcP(x,[[1.2,-10],[.4,-15],[2.4,-17.2],[6,-17],[8.2,-14.6],[7.6,-10.4]],{f:'#3f6aa8'});mpmgcLn(x,[[1.4,-13],[7.6,-13]],.25,MPL.GOLD);mpmgcLn(x,[[1,-15],[7.8,-15]],.25,MPL.GOLD);
  mpmgcDot(x,4.6,-13.4,3.6,'#e0b068');mpmgcP(x,[[1.6,-15.4],[1.4,-20],[3.8,-17.2]],{f:'#e0b068',w:.4});mpmgcP(x,[[7.4,-15.6],[8,-20.4],[5.2,-17.6]],{f:'#e0b068',w:.4});
  mpmgcEye(x,3.6,-13.8,.5);mpmgcEye(x,6.2,-13.8,.5);mpmgcP(x,[[4,-12.6],[5.2,-12.6],[4.6,-11.8]],{f:'#c06060',k:1,w:.25});
  mpmgcLn(x,[[2,-12.4],[-.4,-12.8]],.25);mpmgcLn(x,[[2,-11.8],[-.4,-11.6]],.25);mpmgcLn(x,[[7.2,-12.4],[9.6,-12.8]],.25);mpmgcLn(x,[[7.2,-11.8],[9.6,-11.6]],.25)}
function mpmgcMummy(x,o){o=o||{};const W=MPGC.wrap;
  mpmgcLimb(x,[[-2,-8],[-2.4,0]],2.2,W);mpmgcLimb(x,[[2,-8],[2.4,0]],2.2,W);
  mpmgcP(x,[[-4,-8.4],[-3.6,-16],[-2,-17.4],[2,-17.4],[3.6,-16],[4,-8.4]],{f:W});
  mpmgcLimb(x,[[3,-15],[7,-15.4],[10.4,-15]],1.8,W);mpmgcLimb(x,[[-3,-15],[0,-12.6],[3,-12]],1.4,W);
  mpmgcDot(x,0,-21.4,3.6,W);for(let i=-2;i<=2;i++)mpmgcLn(x,[[-3.2,-21.4+i*1.2],[3.2,-21.4+i*1.2+.5]],.3);
  mpmgcDot(x,-1.2,-21.4,.5,MPL.INK,0);mpmgcDot(x,1.4,-21.4,.5,MPL.INK,0);mpmgcLn(x,[[-.6,-19.4],[.8,-19.4]],.35);
  for(let i=0;i<5;i++)mpmgcLn(x,[[-4,-9-i*1.6],[4,-10.6-i*1.6+.5]],.3);
  mpmgcLn(x,[[-3.6,-13],[-7,-12],[-9,-8],[-7,-3],[-9,-1]],.6,W);mpmgcLn(x,[[-3.6,-13],[-7,-12],[-9,-8],[-7,-3],[-9,-1]],.25,MPL.INK)}
function mpmgcCatGod(x){ // Bastet seated, front view
  mpmgcP(x,[[-8,0],[-8,-3],[-6,-4],[6,-4],[8,-3],[8,0]],{f:'#4a3a28',k:1,w:.5});
  mpmgcP(x,[[-4.6,-4],[-5.4,-12],[-3,-17],[0,-17.6],[3,-17],[5.4,-12],[4.6,-4]],{f:'#3a3a52'});mpmgcLn(x,[[0,-9],[0,-4]],.25);
  mpmgcP(x,[[-4,-12.6],[0,-10],[4,-12.6],[2,-9],[-2,-9]],{f:MPL.GOLD,w:.4});for(let i=-3;i<=3;i+=1.5)mpmgcDot(x,i,-11.2+Math.abs(i)*.25,.5,'#f6dc70',.2);
  mpmgcLimb(x,[[-3.4,-10],[-3,-5]],1.2,'#3a3a52');mpmgcLimb(x,[[3.4,-10],[3,-5]],1.2,'#3a3a52');
  mpmgcP(x,[[-5,-18],[-6.4,-26],[-2.6,-22.4]],{f:'#3a3a52',w:.45});mpmgcP(x,[[5,-18],[6.4,-26],[2.6,-22.4]],{f:'#3a3a52',w:.45});mpmgcP(x,[[-4.7,-19],[-5.6,-24],[-3.2,-21.8]],{f:'#e0a0a0',w:0});mpmgcP(x,[[4.7,-19],[5.6,-24],[3.2,-21.8]],{f:'#e0a0a0',w:0});
  mpmgcDot(x,0,-19,4.8,'#3a3a52');mpmgcDot(x,-2,-19.4,1.3,'#f0d060');mpmgcDot(x,2,-19.4,1.3,'#f0d060');mpmgcLn(x,[[-2,-20.6],[-2,-18.2]],.4);mpmgcLn(x,[[2,-20.6],[2,-18.2]],.4);
  mpmgcP(x,[[-.8,-17.4],[.8,-17.4],[0,-16.5]],{f:'#e0a0a0',k:1,w:.25});mpmgcLn(x,[[-1.5,-16.4],[-4.2,-16],[-4.4,-17.2]],.25);mpmgcLn(x,[[1.5,-16.4],[4.2,-16],[4.4,-17.2]],.25);
  mpmgcP(x,[[-4.4,-22.4],[0,-25],[4.4,-22.4]],{f:MPL.GOLD,k:1,w:.35,open:1});mpmgcDot(x,0,-24.6,.8,MPL.VERM,.25);
  mpmgcLn(x,[[8,-1],[12,-3],[11,-7],[8.4,-6]],.8,'#3a3a52');mpmgcLn(x,[[8,-1],[12,-3],[11,-7],[8.4,-6]],.3)}
function mpmgcScarab(x){ // beetle rolling a sun disc, facing right
  mpmgcDot(x,9,-5.4,5.2,MPL.GOLD);mpmgcDot(x,9,-5.4,3.4,'#f6dc70',.3);mpmgcInk(x,.3);x.beginPath();for(let i=0;i<10;i++){const an=i*.628;x.moveTo(9+Math.cos(an)*3.4,-5.4+Math.sin(an)*3.4);x.lineTo(9+Math.cos(an)*5.2,-5.4+Math.sin(an)*5.2)}x.stroke();
  mpmgcLimb(x,[[1,-5.4],[3.6,-5.2],[6,-4.6]],.8,'#1a2a5a');mpmgcLimb(x,[[-4,-3],[-5,-1],[-6.4,0]],.6,'#1a2a5a');mpmgcLimb(x,[[0,-3],[.4,-1],[-.4,0]],.6,'#1a2a5a');mpmgcLimb(x,[[3,-3],[4,-1],[4.2,0]],.6,'#1a2a5a');
  mpmgcP(x,[[-6,-3.6],[-5,-6.6],[-1,-7.6],[3,-6.4],[3.6,-3.4],[-1,-2.6]],{f:'#27408a'});mpmgcLn(x,[[-1.4,-7.4],[-1.2,-2.8]],.3,MPL.GOLD2);mpmgcP(x,[[3,-6.2],[5,-6],[5.2,-4],[3.4,-3.6]],{f:'#27408a',w:.45});mpmgcEye(x,4.4,-5.2,.35);
  mpmgcLn(x,[[4.6,-6.4],[3.4,-8],[4.6,-8.6]],.3);mpmgcLn(x,[[-5.4,-4.6],[-3,-5.6]],.3,MPL.GOLD2)}
function mpmgcSkull(x){ // a bleached ox skull with a lizard on top
  mpmgcLn(x,[[-7,-10],[-12,-11],[-14,-15],[-12.6,-17]],1.2,MPL.INK);mpmgcLn(x,[[-7,-10],[-12,-11],[-14,-15],[-12.6,-17]],.6,MPGC.bone);
  mpmgcLn(x,[[7,-10],[12,-11],[14,-15],[12.6,-17]],1.2,MPL.INK);mpmgcLn(x,[[7,-10],[12,-11],[14,-15],[12.6,-17]],.6,MPGC.bone);
  mpmgcP(x,[[-6.4,-8],[-7,-12.6],[-3,-14.6],[3,-14.6],[7,-12.6],[6.4,-8],[4,-5],[3.4,-1],[-3.4,-1],[-4,-5]],{f:MPGC.bone});
  mpmgcDot(x,-3,-9,2.1,MPL.INK,.4);mpmgcDot(x,3,-9,2.1,MPL.INK,.4);mpmgcP(x,[[-.8,-5.6],[.8,-5.6],[0,-4]],{f:MPL.INK,k:1,w:0});
  for(let i=-2;i<=2;i++)mpmgcLn(x,[[i*1.2,-3],[i*1.2,-1.4]],.3);mpmgcLn(x,[[-3.4,-2.6],[3.4,-2.6]],.3);mpmgcLn(x,[[-1,-13.4],[0,-11],[1,-13.4]],.3);mpmgcLn(x,[[-5,-12],[-4,-11.4]],.25);
  mpmgcP(x,[[-5,-14.6],[-2,-15.8],[1,-16.6],[4,-16.2],[7,-17.6],[8.4,-17.2],[6.6,-15.6],[4,-15.4],[1,-14.6]],{f:'#7a9a4a',w:.4});mpmgcDot(x,2.6,-17.2,.5,MPL.INK,0);
  mpmgcLn(x,[[-4,-14.6],[-5.4,-13.6]],.4);mpmgcLn(x,[[2,-14.8],[1.4,-13.6]],.4);mpmgcLn(x,[[-5,-14.6],[-8,-16.6],[-10,-15.2]],.5,'#7a9a4a');mpmgcLn(x,[[-5,-14.6],[-8,-16.6],[-10,-15.2]],.2);
  mpmgcLn(x,[[8.4,-17.2],[9.6,-17.4],[10.4,-16.4]],.3)}
function mpmgcRibs(x){ // a camel ribcage and the scorpion inside
  mpmgcLn(x,[[-12,-2],[-6,-5],[0,-5.6],[6,-5],[12,-2.4]],1.2,MPL.INK);mpmgcLn(x,[[-12,-2],[-6,-5],[0,-5.6],[6,-5],[12,-2.4]],.7,MPGC.bone);
  for(let i=-5;i<=5;i++){const a=i*2.1,t=Math.abs(i)/5;mpmgcLn(x,[[a,-5.6+t*.8],[a+(i<0?-2.4:2.4),-9-(1-t)*3],[a+(i<0?-1:1),-14.4-(1-t)*5],[a+(i<0?1.4:-1.4),-18.6-(1-t)*3]],1,MPL.INK);mpmgcLn(x,[[a,-5.6+t*.8],[a+(i<0?-2.4:2.4),-9-(1-t)*3],[a+(i<0?-1:1),-14.4-(1-t)*5],[a+(i<0?1.4:-1.4),-18.6-(1-t)*3]],.5,MPGC.bone)}
  x.save();x.translate(-.5,0);x.scale(.46,.46);mpmgcScorp(x,{c:'#5a3a18'});x.restore();mpmgcGround(x,-14,0,28)}
function mpmgcDeadTree(x){mpmgcLn(x,[[0,0],[.4,-6],[-1,-12],[.4,-18],[-.6,-22]],1.8,MPL.INK);mpmgcLn(x,[[0,0],[.4,-6],[-1,-12],[.4,-18],[-.6,-22]],1,'#8a7a62');
  mpmgcLn(x,[[.4,-8],[4,-10],[8,-9.4]],.8,MPL.INK);mpmgcLn(x,[[.4,-8],[4,-10],[8,-9.4]],.4,'#8a7a62');mpmgcLn(x,[[-.8,-13],[-4,-15],[-7,-14.6]],.8,MPL.INK);mpmgcLn(x,[[-.8,-13],[-4,-15],[-7,-14.6]],.4,'#8a7a62');mpmgcLn(x,[[5,-9.8],[6,-12.6]],.4);mpmgcLn(x,[[-4,-15],[-4.6,-17.4]],.4);mpmgcGround(x,-6,0,12)}
function mpmgcTent(x){mpmgcGround(x,-14,0,28);mpmgcP(x,[[-11,0],[-8,-9],[0,-14],[8,-9],[11,0]],{f:'#4a3a2c',k:1});mpmgcP(x,[[-11,0],[-8,-9],[0,-14],[0,0]],{f:'#5e4a38',k:1,w:.4});
  mpmgcP(x,[[-3,0],[0,-8.6],[3,0]],{f:'#1a0f08',k:1,w:.4});mpmgcLn(x,[[-3,0],[-6,-1.6]],.4);mpmgcLn(x,[[3,0],[6,-1.6]],.4);
  mpmgcLn(x,[[0,-14],[0,-19]],.5);mpmgcP(x,[[0,-19],[5,-18],[2.4,-17],[5,-16],[0,-15.4]],{f:MPL.VERM,w:.4});
  for(const k of [-8,8])mpmgcLn(x,[[k*1.3,0],[k*.8,-6]],.3);mpmgcHatch(x,-7,-9,6,5,5,.3,.25);
  mpmgcLn(x,[[-12.4,0],[-11,-4.6]],.4);mpmgcDot(x,-11,-5,.5,MPL.INK,0)}
function mpmgcCometTail(x){const g=x.createLinearGradient(0,0,-70,0);g.addColorStop(0,'rgba(255,240,200,.95)');g.addColorStop(1,'rgba(200,160,255,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,-4);x.quadraticCurveTo(-30,-5,-70,-1);x.quadraticCurveTo(-30,2,0,4);x.fill();
  mpmgcInk(x,.3);for(let i=0;i<6;i++){const y=-3+i*1.2;x.beginPath();x.moveTo(-4-i*2,y);x.quadraticCurveTo(-30,y*1.4,-62+i*3,y*.6);x.stroke()}
  mpmgcDot(x,0,0,4,'#fff2c0');mpmgcDot(x,0,0,2.2,'#fffbe8',0);for(let i=0;i<8;i++){const an=i*.785;mpmgcLn(x,[[Math.cos(an)*4.6,Math.sin(an)*4.6],[Math.cos(an)*7,Math.sin(an)*7]],.4)}}
function mpmgcStar(x,a,b,r,col){x.beginPath();for(let i=0;i<8;i++){const an=i*.785,rr=i%2?r*.4:r;x.lineTo(a+Math.cos(an)*rr,b+Math.sin(an)*rr)}x.closePath();x.fillStyle=col||MPL.GOLD;x.fill();mpmgcInk(x,.3);x.stroke()}
function mpmgcFennec(x){ // fennec fox howling at the moon, sitting
  mpmgcP(x,[[-7,0],[-6,-5],[-3,-8],[2,-8],[4,-5],[5,0]],{f:'#e0b070'});mpmgcLn(x,[[-7,-1],[-11,-3],[-12,-6],[-10.4,-8]],1.5,MPL.INK);mpmgcLn(x,[[-7,-1],[-11,-3],[-12,-6],[-10.4,-8]],.9,'#e0b070');
  mpmgcLimb(x,[[1,-7],[3,-3],[3.4,0]],1.1,'#e0b070');mpmgcP(x,[[0,-7],[0,-9.6],[4.4,-9.6],[4.6,-7]],{f:'#e0b070',w:.4});
  mpmgcP(x,[[.4,-9.6],[-1.6,-16.4],[1.8,-13.4]],{f:'#e0b070',w:.45});mpmgcP(x,[[3.8,-9.8],[6.2,-16.6],[6.4,-11.8]],{f:'#e0b070',w:.45});mpmgcP(x,[[.2,-11],[-.6,-14.8],[1.6,-13]],{f:'#e8a0a0',w:0});
  mpmgcP(x,[[.4,-9.4],[1,-12.6],[3,-14.4],[5.2,-13.6],[7.2,-16.2],[8.4,-15.6],[6.4,-12],[4.6,-9.4]],{f:'#e0b070'});mpmgcDot(x,8.2,-16.2,.6,MPL.INK,0);mpmgcEye(x,3.9,-12.2,.4);mpmgcLn(x,[[1,-8.4],[3,-8.6]],.3)}
function mpmgcMoon(x,r){x.save();x.beginPath();x.rect(-r*2,-r*2,r*4,r*4);x.arc(r*.55,-r*.15,r*.85,0,6.3,true);x.clip('evenodd');x.beginPath();x.arc(0,0,r,0,6.3);x.fillStyle='#f4e6a0';x.fill();x.restore();
  mpmgcInk(x,.45);x.beginPath();x.arc(0,0,r,.9,5.4);x.stroke();x.beginPath();x.arc(r*.55,-r*.15,r*.85,2.1,4.4);x.stroke()}
function mpmgcBat(x){mpmgcP(x,[[0,-3],[-3,-6],[-6,-5],[-8,-6.6],[-9,-3.4],[-6.4,-3.2],[-5.6,-1.4],[-3,-2.6],[0,0],[3,-2.6],[5.6,-1.4],[6.4,-3.2],[9,-3.4],[8,-6.6],[6,-5],[3,-6]],{f:'#4a3a62',k:1,w:.45});
  mpmgcDot(x,0,-3.4,1.8,'#4a3a62');mpmgcP(x,[[-1.6,-4.6],[-1.8,-7],[-.4,-5.4]],{f:'#4a3a62',w:.35});mpmgcP(x,[[1.6,-4.6],[1.8,-7],[.4,-5.4]],{f:'#4a3a62',w:.35});mpmgcDot(x,-.7,-3.6,.35,'#f0e8a0',0);mpmgcDot(x,.7,-3.6,.35,'#f0e8a0',0)}
function mpmgcSandworm(x){ // a blue sand-worm arching out of the dunes, drawn as ringed beads
  const n=12;for(let i=0;i<n;i++){const t=i/(n-1),a=-28+t*56,b=-Math.sin(t*Math.PI)*17,r=2.1+Math.sin(t*Math.PI)*2.2;mpmgcDot(x,a,b,r,i%2?'#6a8ed0':'#86a8e6',.45);mpmgcLn(x,[[a-r*.6,b-r*.7],[a,b-r],[a+r*.6,b-r*.7]],.25)}
  mpmgcDot(x,-28,0,3.3,'#86a8e6',.5);for(let i=0;i<5;i++){const an=-1.2+i*.6;mpmgcLn(x,[[-28+Math.cos(an+3.14)*2.4,Math.sin(an+3.14)*2.4],[-28+Math.cos(an+3.14)*4.4,Math.sin(an+3.14)*4.4]],.4)}
  mpmgcP(x,[[28,0],[30,-3],[32.4,-1],[31,1.4]],{f:'#4a68b0',w:.4});mpmgcDot(x,25,-1.5,.7,MPL.INK,0);mpmgcDot(x,-27.4,-1.8,.35,MPL.INK,0);mpmgcDot(x,-28.8,-.4,.9,'#1a2040',0);
  mpmgcGround(x,-33,1,66,'#6a8ed0')}
function mpmgcBlob(x){ // a many eyed blue thing
  for(let i=0;i<5;i++){const a=-6+i*3;mpmgcLn(x,[[a,-2],[a+(i-2)*1.4,1],[a+(i-2)*2.2,2.6]],.9,MPL.INK);mpmgcLn(x,[[a,-2],[a+(i-2)*1.4,1],[a+(i-2)*2.2,2.6]],.4,'#8aa8e0')}
  mpmgcP(x,[[-9,-3],[-10,-10],[-6,-16],[0,-18],[6,-16],[10,-10],[9,-3],[0,-1]],{f:'#7a9ce0',j:.3,s:8});mpmgcP(x,[[-6,-5],[-7,-11],[-4,-15]],{open:1,w:0,f:null});mpmgcLn(x,[[-6,-5],[-7.4,-10],[-4.6,-14.6]],.6,'#b8d0f8');
  const eyes=[[-4,-11,2.4],[3,-13,2.8],[5,-8,1.7],[-1,-7,1.4],[-6,-7,1.2],[0,-16,1.2]];for(const [a,b,r] of eyes){mpmgcDot(x,a,b,r,'#f6f0e0');mpmgcDot(x,a+r*.18,b+r*.12,r*.5,MPL.INK,0)}
  mpmgcLn(x,[[-3,-3.6],[0,-2.6],[3,-3.6]],.4,'#2a3a70');mpmgcLn(x,[[8,-15],[10,-20]],.4);mpmgcDot(x,10,-20.4,1.2,'#f6f0e0');mpmgcDot(x,10.2,-20.2,.55,MPL.INK,0)}
function mpmgcLost(x){ // a lost traveller shading his eyes, camel skull at his feet
  mpmgcGround(x,-14,0,28);mpmgcLimb(x,[[-1.6,-8],[-2.2,0]],1.4,'#a07040');mpmgcLimb(x,[[2,-8],[3,0]],1.4,'#a07040');
  mpmgcP(x,[[-4,-8.4],[-3.8,-16],[-2,-18],[2,-18],[4,-16],[4.4,-8.4]],{f:'#b08850'});mpmgcLn(x,[[-3.6,-10.4],[4,-10]],.3);
  mpmgcLn(x,[[3,-16],[6,-17.4],[9,-19.6]],1.1,MPL.INK);mpmgcLn(x,[[3,-16],[6,-17.4],[9,-19.6]],.6,'#b08850');mpmgcLn(x,[[-3.4,-15.4],[-6.6,-12],[-6,-3]],.45);mpmgcLn(x,[[-6,-3],[-6.4,0]],.45);
  mpmgcHead(x,.6,-22,3.3,'#d8d0b4',{beard:1});mpmgcLn(x,[[-3,-21],[-6,-20],[-7,-17]],.5,'#d8d0b4');
  mpmgcLn(x,[[8,-3],[7,-18]],.4);mpmgcLn(x,[[7,-18],[8.4,-19.2]],.4);
  mpmgcDot(x,12,-12,.8,MPL.INK,0);mpmgcLn(x,[[12.7,-12],[12.7,-14.8]],.3);mpmgcLn(x,[[13,-10],[14,-11]],.3);mpmgcLn(x,[[11.4,-9],[12.6,-9.2]],.3)}
function mpmgcMirage(x){ // wavy palm and pool shimmer
  for(let i=0;i<4;i++){const y=-3-i*3;mpmgcLn(x,[[-14,y],[-10,y-.9],[-6,y+.9],[-2,y-.9],[2,y+.9],[6,y-.9],[10,y+.9],[14,y]],.35,'#7a6a58')}
  x.globalAlpha=.55;mpmgcLn(x,[[-8,-6],[-4,-6.6],[0,-5.6],[4,-6.6],[8,-6]],2,'#7aa8d8');x.globalAlpha=1;
  mpmgcLn(x,[[2,-8],[2.6,-13],[1.6,-18]],.7);for(const [dx,dy] of [[-6,-3],[-3,-5],[4,-4],[7,-1]])mpmgcLn(x,[[1.6,-18],[1.6+dx,-18+dy+3]],.5,'#4a7a40');
  mpmgcLn(x,[[2,-8],[1.4,-5],[2.4,-2]],.3);x.globalAlpha=.4;mpmgcLn(x,[[-12,-1],[-4,-1.6],[4,-.8],[12,-1.4]],.3);x.globalAlpha=1}
function mpmgcMilestone(x,t){mpmgcGround(x,-8,0,16);mpmgcP(x,[[-4,0],[-3.6,-9],[-2,-12],[2,-12],[3.6,-9],[4,0]],{f:'#d4c6a4'});mpmgcHatch(x,-3.4,-8,7,7,5,.3,.25);mpmgcLn(x,[[-3.6,-9],[3.6,-9]],.3);
  x.font='bold 3.4px serif';x.fillStyle=MPL.VERM;x.textAlign='center';x.textBaseline='middle';x.fillText(t||'XII',0,-5.2);mpmgcDot(x,0,-10.6,.5,MPL.INK,0)}
function mpmgcSaltMan(x){mpmgcGround(x,-14,0,28);mpmgcP(x,[[2,0],[3,-6],[9,-9],[15,-7],[16,0]],{f:'#f8f6ee'});mpmgcLn(x,[[4,-5],[9,-3]],.3,'#9ab8d8');mpmgcLn(x,[[9,-8.6],[11,-4]],.3,'#9ab8d8');mpmgcLn(x,[[12,-6],[14,-1]],.3,'#9ab8d8');
  mpmgcLimb(x,[[-2,-8],[-3,0]],1.4,'#e8d8b8');mpmgcLimb(x,[[1.6,-8],[2.4,0]],1.4,'#e8d8b8');mpmgcP(x,[[-4,-8.4],[-3.6,-16],[-2,-18],[2,-18],[4,-16],[4.4,-8.4]],{f:'#e8d8b8'});
  mpmgcHead(x,.4,-22,3.2,'#4a6aa8');mpmgcLimb(x,[[3,-15],[7,-14],[9,-9]],1,'#e8d8b8');mpmgcLn(x,[[8,-10],[12.4,-12],[13.4,-14.6]],.6);mpmgcP(x,[[11.6,-14.6],[15,-14.4],[13.4,-12.6]],{f:'#8a8a92',w:.4,k:1});
  mpmgcP(x,[[-14,0],[-12,-5],[-6,-6],[-5,0]],{f:'#e8d8b8',w:.45});mpmgcLn(x,[[-12,-3],[-6,-3.4]],.25);mpmgcDot(x,-10,-1.4,.5,'#f8f6ee',0)}
function mpmgcFight(x){mpmgcGround(x,-20,0,44);x.save();x.translate(8,0);x.scale(1.5,1.5);mpmgcScorp(x,{c:'#7a3a18'});x.restore();
  mpmgcLimb(x,[[-12,-8],[-13,0]],1.3,'#e8d8b8');mpmgcLimb(x,[[-8,-8],[-7,0]],1.3,'#e8d8b8');mpmgcP(x,[[-14,-8.4],[-13.6,-16],[-12,-18],[-9,-18],[-7.6,-16],[-7,-8.4]],{f:'#3f7a5a'});mpmgcHead(x,-10.8,-22,3.1,'#a82a1e');
  mpmgcLimb(x,[[-8,-15],[-4,-17],[-2,-21]],1,'#3f7a5a');mpmgcP(x,[[-4,-22],[1,-24],[1.6,-21],[-3,-19.6]],{f:'#b07a3c',w:.45});mpmgcLn(x,[[-3.4,-21.6],[.6,-22.6]],.25);mpmgcLn(x,[[-14,-14],[-17,-13],[-17,-9]],.5,'#3f7a5a');
  mpmgcLn(x,[[-5,-26],[-3,-28]],.3);mpmgcLn(x,[[-1,-27],[0,-29.4]],.3);mpmgcLn(x,[[-7.4,-27],[-8,-29.4]],.3)}
function mpmgcCaravan(x){mpmgcGround(x,-30,0,70);
  x.save();x.translate(-12,0);x.scale(.7,.7);mpmgcCamel(x,{rug:MPL.VERM,load:'#b88a4c',sd:5});x.restore();
  x.save();x.translate(14,0);x.scale(.7,.7);mpmgcCamel(x,{rug:MPL.LAPIS,load:'#d9bd7a',sd:6});x.restore();
  x.save();x.translate(38,0);x.scale(.7,.7);mpmgcCamel(x,{rug:MPL.VERD,sd:7});x.restore();
  mpmgcLn(x,[[-5,-12],[-1,-11],[3,-12],[7,-11]],.3);mpmgcLn(x,[[20,-12],[25,-11.4],[29,-12.4],[32,-11.6]],.3)}
function mpmgcCamelRider(x){mpmgcGround(x,-14,0,32);x.save();mpmgcCamel(x,{rug:MPL.VERM});x.restore();mpmgcP(x,[[-3,-11],[-2.6,-16.4],[1.6,-16.4],[2,-11]],{f:'#e8dcc0'});mpmgcHead(x,0,-20,2.6,MPL.LAPIS);mpmgcLn(x,[[1,-15],[6,-14],[10,-16]],.7,'#e8dcc0');mpmgcLn(x,[[10,-16],[11,-18]],.25)}
function mpmgcCamelLoaded(x){mpmgcGround(x,-14,0,32);mpmgcCamel(x,{rug:MPL.LAPIS,load:'#e0b630',sd:9});for(const [a,b] of [[-3,-15],[0,-16],[2,-14.4]])mpmgcDot(x,a,b,1.2,'#f6dc70',.3)}
function mpmgcCamelSkel(x){mpmgcGround(x,-18,0,40);for(const k of [-9,-4,5,10])mpmgcLimb(x,[[k,-9],[k+.4,-4.6],[k,0]],.7,MPGC.bone);
  mpmgcLimb(x,[[-12,-10],[-8,-11],[-2,-11.6],[4,-11.6],[9,-11]],.9,MPGC.bone);
  for(let i=-7;i<=7;i+=2.4){mpmgcLn(x,[[i,-11],[i+.4,-9],[i,-6.6]],.6,MPL.INK);mpmgcLn(x,[[i,-11],[i+.4,-9],[i,-6.6]],.3,MPGC.bone)}
  mpmgcLimb(x,[[10,-11],[13,-15],[15,-19.4]],.8,MPGC.bone);mpmgcP(x,[[14,-19.6],[17,-20.4],[19.4,-19],[18.6,-18],[15,-17.6]],{f:MPGC.bone,w:.4});mpmgcDot(x,16.4,-19,.7,MPL.INK,0);mpmgcLn(x,[[-12,-10],[-13.4,-7],[-13,-4]],.4)}
function mpmgcPalmette(x,s){mpmgcLn(x,[[0,0],[0,-8*s]],.7,MPL.GOLD);for(let i=-3;i<=3;i++){mpmgcP(x,[[0,-5*s],[i*2.4*s,-9*s],[i*1.5*s,-13*s+Math.abs(i)*s],[i*.3*s,-9*s]],{f:i%2?MPL.LAPIS:MPL.VERD,w:.35})}mpmgcDot(x,0,-8*s,1.2*s,MPL.VERM,.3)}
function mpmgcSun(x,r){mpmgcLn(x,[[0,0]],0);mpmgcDot(x,0,0,r,MPL.GOLD,.4);mpmgcDot(x,0,0,r*.6,'#f6dc70',.3)}
/* ---------- registration (all coordinates are on the 480x320 sheet) ---------- */
/* Sand Road 41 */
mpmgAdd([41],function(x){
  mpmgcPlace(x,mpmgcMerchant,56,288,1,1);mpmgcPlace(x,mpmgcMilestone,22,290,1,1,'XL');
  mpmgcPlace(x,function(x){mpmgcBird(x,'hoopoe')},128,28,.95,1);mpmgcPlace(x,mpmgcCharmer,420,286,1.05,1);
  mpmgcPlace(x,mpmgcScorp,372,246,.9,-1);mpmgcPlace(x,function(x){mpmgcBird(x,'falcon')},300,26,1,-1);
  mpmgcPlace(x,mpmgcCaravan,186,29,.55,1);mpmgcPlace(x,mpmgcMilestone,455,235,.9,1,'LX')});
/* Tomb of Sut 42 */
mpmgAdd([42],function(x){
  mpmgcPlace(x,mpmgcMummy,32,292,1.1,1);mpmgcPlace(x,mpmgcCatGod,425,292,1.05,1);mpmgcPlace(x,mpmgcScarab,350,245,1,1);
  mpmgcPlace(x,function(x){mpmgcBird(x,'hoopoe')},120,27,1,1);mpmgcPlace(x,mpmgcScorp,70,222,1,1);
  mpmgcPlace(x,mpmgcArab,285,24,.8,1);mpmgcPlace(x,mpmgcMummy,380,208,.7,-1)});
/* Red Dunes 43 */
mpmgAdd([43],function(x){
  mpmgcPlace(x,mpmgcFight,58,292,1,1);mpmgcPlace(x,mpmgcDjinn,432,292,1,1);mpmgcPlace(x,mpmgcGazelle,135,28,.9,1);
  mpmgcPlace(x,mpmgcLute,395,228,.95,1);mpmgcPlace(x,function(x){mpmgcBird(x,'falcon')},300,26,1,-1);mpmgcPlace(x,mpmgcCamelRider,82,222,.7,1)});
/* Blue Dunes 60 */
mpmgAdd([60],function(x){
  mpmgcPlace(x,mpmgcLost,58,230,1,1);mpmgcPlace(x,mpmgcBlob,418,262,1.1,1);mpmgcPlace(x,mpmgcSandworm,200,31,.6,1);
  mpmgcPlace(x,function(x){mpmgcBird(x,'hoopoe')},306,27,1,-1);mpmgcPlace(x,mpmgcArab,408,206,.9,1);mpmgcPlace(x,mpmgcScorp,92,288,.9,1)});
/* Golden Erg 61 */
mpmgAdd([61],function(x){
  mpmgcPlace(x,mpmgcSphinx,425,290,1,1);mpmgcPlace(x,mpmgcCamelLoaded,75,293,.9,1);mpmgcPlace(x,mpmgcScribe,425,218,.85,1);
  mpmgcPlace(x,mpmgcMapmaker,132,27,.8,1);mpmgcPlace(x,mpmgcGazelle,300,28,.85,-1);mpmgcPlace(x,mpmgcArab,24,200,.8,1)});
/* Violet Erg 62 */
mpmgAdd([62],function(x){
  x.save();x.translate(262,20);x.scale(1.05,1.05);mpmgcCometTail(x);x.restore();
  mpmgcStar(x,160,18,2,'#d8c0f0');mpmgcStar(x,185,27,1.4,'#f0e0a0');mpmgcStar(x,228,16,1.6,'#d8c0f0');
  mpmgcPlace(x,function(x){mpmgcBird(x,'owl')},62,252,.85,1);mpmgcPlace(x,mpmgcMapmaker,432,292,.9,-1);
  mpmgcPlace(x,mpmgcBat,430,215,1,1);mpmgcPlace(x,mpmgcFennec,92,292,1,1);x.save();x.translate(84,236);mpmgcMoon(x,5);x.restore();
  mpmgcPlace(x,mpmgcScorp,404,244,.8,1)});
/* White Dunes 63 */
mpmgAdd([63],function(x){
  mpmgcPlace(x,mpmgcSkull,50,292,1,1);mpmgcPlace(x,mpmgcRibs,430,293,.9,1);mpmgcPlace(x,mpmgcSaltMan,420,252,.8,1);
  mpmgcPlace(x,mpmgcDeadTree,150,30,.85,1);mpmgcPlace(x,function(x){mpmgcBird(x,'vulture')},157,22.4,.6,1);
  mpmgcPlace(x,mpmgcCamelSkel,200,29,.7,1);mpmgcPlace(x,mpmgcScorp,70,232,.8,-1)});
/* Flatlands 64 */
mpmgAdd([64],function(x){
  mpmgcPlace(x,mpmgcTent,48,293,1,1);mpmgcPlace(x,mpmgcMirage,430,296,.9,1);mpmgcPlace(x,mpmgcDeadTree,410,258,.7,1);
  mpmgcPlace(x,function(x){mpmgcBird(x,'vulture')},414,249,.8,-1);mpmgcPlace(x,mpmgcMapmaker,55,230,.85,1);
  mpmgcPlace(x,function(x){mpmgcBird(x,'vulture')},180,24,.9,1);mpmgcPlace(x,mpmgcFennec,100,293,.8,-1)});
/* Khemetra 44 (sand corners inside the map frame, outside the city wall) */
mpmgAdd([44],function(x){
  mpmgcPlace(x,mpmgcGazelle,112,146,.85,1);mpmgcPlace(x,mpmgcCharmer,110,214,.62,1);mpmgcPlace(x,mpmgcLute,112,252,.5,1);
  mpmgcPlace(x,mpmgcMerchant,372,262,.6,-1);mpmgcPlace(x,mpmgcMapmaker,368,52,.55,-1);mpmgcPlace(x,mpmgcScorp,370,186,.7,-1);
  mpmgcPlace(x,function(x){mpmgcBird(x,'hoopoe')},108,122,.8,1);mpmgcPlace(x,mpmgcDjinn,368,128,.55,1)});
