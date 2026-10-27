/* ==========================================================================
   THE FOUR GREAT ENTRANCES OF THE WENLOCK GRAVEYARD (prefix gyen). Each maze is entered through a built front, a row of wall tiles in the yard, painted here once from the game's own pictures into one
   wide canvas that is cut into the tiles: the Red Ossuary is a skull-keyed stone arch with a wrought iron gate in a high wall under a cornice with its name cut over the door, between ivy-grown pillars, with a red
   glow behind the bars; the Grey Charnel is a damp stair arch between two lengths of iron fence and lamps; the Black Barrow is a dark arch set in a grassy barrow between obelisks; the Pale Catacombs are
   the double wooden doors of a grassy mound between urns. gyEntryPic(kind) returns the canvas (kinds: red, grey, black, pale); GY_ENTRY says how many tiles wide and how tall each is.
   ========================================================================== */
const GY_ENTRY={red:[5,3.4,'THE RED OSSUARY'],grey:[5,3.0,'THE GREY CHARNEL'],black:[5,3.0,'THE BLACK BARROW'],pale:[3,1.9,'THE PALE CATACOMBS'],gate:[5,3.0,'SAINT WENNA']};   // gate: the lych-gate of the yard (built by gy_yard.js)
function gyEntryPic(kind){
  const K=GY._entry=GY._entry||{};if(K[kind])return K[kind];
  const [n,wh,title]=GY_ENTRY[kind],W=n*128,H=Math.round(wh*128),c=document.createElement('canvas');c.width=W*2;c.height=H*2;const x=c.getContext('2d');x.scale(2,2);x.imageSmoothingQuality='high';const I=k=>IMG['gyp_'+k],hs=(a,b,s)=>hash2(a,b,s+n*7);
  const putW=(k,cx,bottom,w)=>{const im=I(k);if(!im)return null;const h=w*im.height/im.width;x.drawImage(im,cx-w/2,bottom-h,w,h);return h};
  const putH=(k,cx,bottom,h)=>{const im=I(k);if(!im)return null;const w=h*im.width/im.height;x.drawImage(im,cx-w/2,bottom-h,w,h);return w};
  // the stone wall: the painted grey stone, tinted, with the joints of the blocks and damp at the foot
  const wall=tint=>{const t=I('texGrey_0');x.fillStyle='#55534f';x.fillRect(0,0,W,H);if(t)for(let yy=0;yy<H;yy+=128)for(let xx=0;xx<W;xx+=128)x.drawImage(t,xx,yy,129,129);
    x.globalCompositeOperation='multiply';x.fillStyle=tint;x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';
    x.strokeStyle='rgba(18,16,14,.4)';x.lineWidth=1.4;for(let yy=22,r=0;yy<H;yy+=34,r++){x.beginPath();x.moveTo(0,yy);x.lineTo(W,yy);x.stroke();for(let xx=(r%2)*28;xx<W;xx+=56){x.beginPath();x.moveTo(xx+hs(xx,yy,1)*6,yy);x.lineTo(xx+hs(xx,yy,2)*6,yy+34);x.stroke()}}
    const g=x.createLinearGradient(0,H*.6,0,H);g.addColorStop(0,'rgba(20,40,20,0)');g.addColorStop(1,'rgba(20,50,24,.55)');x.fillStyle=g;x.fillRect(0,H*.6,W,H*.4)};
  const cornice=col=>{x.fillStyle='#1d1b19';x.fillRect(0,0,W,34);x.fillStyle=col;x.fillRect(0,34,W,6);x.fillStyle='#121110';x.fillRect(0,40,W,4);
    for(let xx=8;xx<W;xx+=26){x.fillStyle='#34312d';x.fillRect(xx,44,14,10);x.fillStyle='#161412';x.fillRect(xx,54,14,3)}};
  const plaque=(cy,txt)=>{const w=Math.min(W*.5,300),h=34,px=W/2-w/2;x.fillStyle='#2a2825';x.fillRect(px,cy,w,h);x.strokeStyle='#8a7a52';x.lineWidth=2;x.strokeRect(px+2,cy+2,w-4,h-4);
    x.fillStyle='#d8c88a';x.font='bold 19px '+(typeof FTITLE!=='undefined'?FTITLE:'serif');x.textAlign='center';x.textBaseline='middle';x.fillText(txt,W/2,cy+h/2+1)};
  const ivy=(count,zone)=>{const G=['#2a5a26','#3b7f31','#58a03e','#244c24','#6fb04a'];
    for(let k=0;k<count;k++){const px=zone==='sides'?(hs(k,1,3)<.5?hs(k,2,3)*W*.22:W-hs(k,2,3)*W*.22):hs(k,1,3)*W,py=Math.pow(hs(k,3,3),1.7)*H*.7;x.strokeStyle='#27481f';x.lineWidth=1.4+hs(k,4,3)*1.6;x.beginPath();x.moveTo(px,0);let qx=px,qy=0;for(let t=0;t<7;t++){qx+=(hs(k,t+5,4)-.5)*9;qy+=py/7*(.6+hs(k,t+9,5));x.lineTo(qx,qy)}x.stroke();
      for(let t=0;t<9;t++){x.fillStyle=G[(hs(k,t+20,6)*5)|0];x.beginPath();x.ellipse(px+(hs(k,t+30,7)-.5)*14,py*t/9+hs(k,t+40,8)*8,3+hs(k,t+50,9)*4,2.2+hs(k,t+60,9)*2.5,hs(k,t+70,9)*3,0,6.3);x.fill()}}};
  const archGate=(cx,bottom,aw,glow)=>{ // the skull arch with its opening filled by a lit glow and a wrought iron gate
    const ah=putW('gatesC_1',cx,bottom,aw);if(!ah)return;const ow=aw*.56,ox=cx-ow/2,top=bottom-ah*.72,bot=bottom-ah*.03;
    x.save();x.beginPath();x.moveTo(ox,bot);x.lineTo(ox,top+ow/2);x.arc(cx,top+ow/2,ow/2,Math.PI,0);x.lineTo(ox+ow,bot);x.closePath();x.clip();
    const g=x.createRadialGradient(cx,bot,4,cx,bot-ow*.3,ow*1.1);g.addColorStop(0,glow[0]);g.addColorStop(1,glow[1]);x.fillStyle=g;x.fillRect(ox,top,ow,bot-top);
    const gt=I('stairFix_2');if(gt){x.globalAlpha=.96;x.drawImage(gt,gt.width*.15,gt.height*.06,gt.width*.7,gt.height*.92,ox,top,ow,bot-top);x.globalAlpha=1}x.restore()};
  if(kind==='red'){
    wall('#9a8e8a');cornice('#7a1c14');
    putH('stonesB_4',46,H,330);putH('stonesB_4',W-46,H,330);
    x.fillStyle='rgba(120,20,12,.18)';x.fillRect(W*.2,60,W*.6,H);
    archGate(W/2,H,330,['rgba(255,70,40,.75)','rgba(60,6,4,.95)']);
    ivy(26,'sides');ivy(10,'top');plaque(52,title);
  }else if(kind==='grey'){
    wall('#8a948f');cornice('#4a6a60');
    for(const px of [W*.17,W*.83]){putW('fenceG_0',px,H-4,190)}
    for(const px of [W*.31,W*.69]){putH('fenceG_2',px,H,230)}
    putW('gatesC_2',W/2,H,300);x.fillStyle='rgba(30,70,60,.22)';x.fillRect(0,H*.4,W,H*.6);
    ivy(14,'sides');plaque(52,title);
  }else if(kind==='black'){
    wall('#5e5e6c');cornice('#3a3a4c');
    const mw=putW('stairFix_1',W/2,H+10,W*1.02);
    x.globalCompositeOperation='source-atop';x.fillStyle='rgba(20,20,40,.35)';x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';
    putH('stonesB_3',60,H,300);putH('stonesB_3',W-60,H,300);
    archGate(W/2,H-4,270,['rgba(140,110,255,.55)','rgba(8,6,20,.95)']);
    ivy(10,'sides');plaque(52,title);
  }else if(kind==='gate'){ // the gate of the churchyard: a round arch of cut stones in a wall under a cornice, iron gates in the opening, lamps and ivy
    wall('#8f938d');cornice('#3f5a4a');
    const cx=W/2,r=112,ys=H-118,base=H-6,vc=['#6e6a62','#85817a','#77736b','#8d897f'],N=13;
    x.lineWidth=1.3;x.strokeStyle='#1a1816';
    for(let t=0;t<N;t++){const a0=Math.PI+t*Math.PI/N,a1=Math.PI+(t+1)*Math.PI/N,o=t===(N>>1)?34:26;x.fillStyle=vc[(t+(t===(N>>1)?1:0))%4];x.beginPath();x.arc(cx,ys,r,a0,a1);x.arc(cx,ys,r+o,a1,a0,true);x.closePath();x.fill();x.stroke()}
    for(const sd of [-1,1])for(let yy=ys,j=0;yy<base;yy+=24,j++){x.fillStyle=vc[(j+(sd>0?1:0))%4];const bx=sd<0?cx-r-26:cx+r,w2=26+(j%2)*5;x.fillRect(sd<0?bx-(j%2)*5:bx,yy,w2,Math.min(24,base-yy));x.strokeRect(sd<0?bx-(j%2)*5:bx,yy,w2,Math.min(24,base-yy))}
    x.save();x.beginPath();x.moveTo(cx-r,base);x.lineTo(cx-r,ys);x.arc(cx,ys,r,Math.PI,0);x.lineTo(cx+r,base);x.closePath();x.clip();
    const g=x.createLinearGradient(0,ys-r,0,base);g.addColorStop(0,'#0a0c0b');g.addColorStop(1,'#1c2420');x.fillStyle=g;x.fillRect(cx-r,ys-r,2*r,base-ys+r);
    const gi=I('gatesC_0');if(gi){const sx=gi.width*.2,sw=gi.width*.6,sc=2*r/sw,gh=gi.height*sc;x.drawImage(gi,sx,0,sw,gi.height,cx-r,base-gh,2*r,gh)}
    x.restore();
    x.fillStyle='#4a4741';x.fillRect(cx-r-34,H-8,2*r+68,8);x.fillStyle='#2c2a27';x.fillRect(cx-r-34,H-8,2*r+68,2);
    putH('fenceG_2',cx-r-86,H-2,230);putH('fenceG_2',cx+r+86,H-2,230);putW('fenceG_0',W*.1,H-2,150);putW('fenceG_0',W*.9,H-2,150);
    ivy(18,'sides');ivy(6,'top');plaque(58,title);
  }else{ // pale
    x.fillStyle='rgba(0,0,0,0)';x.fillRect(0,0,W,H);
    putW('gatesC_3',W/2,H,W*.98);putH('stonesB_5',26,H,110);putH('stonesB_5',W-26,H,110);ivy(8,'top');
  }
  // the finishing, at the full 256 pixels to a tile: chips and grain in the stone, then a sharpening pass (the painted pieces are only about 200 to 300 pixels wide, so they are scaled up and sharpened)
  x.setTransform(1,0,0,1,0,0);
  if(kind!=='pale'){for(let k=0;k<W*H/22;k++){const px=hs(k,1,11)*c.width,py=hs(k,2,11)*c.height,dk=hs(k,3,11)<.6;x.fillStyle=dk?'rgba(10,8,6,'+(.12+hs(k,4,11)*.2)+')':'rgba(230,220,200,'+(.05+hs(k,4,11)*.1)+')';x.fillRect(px,py,1+((hs(k,5,11)*2)|0),1)}}
  try{const t=document.createElement('canvas');t.width=c.width;t.height=c.height;const tx=t.getContext('2d');tx.filter='blur(1.3px)';tx.drawImage(c,0,0);tx.filter='none';
    const a=x.getImageData(0,0,c.width,c.height),b=tx.getImageData(0,0,c.width,c.height),A=a.data,B=b.data;
    for(let i=0;i<A.length;i+=4){if(A[i+3]<8)continue;for(let q=0;q<3;q++){const v=A[i+q]+(A[i+q]-B[i+q])*1.25;A[i+q]=v<0?0:v>255?255:v}}
    x.putImageData(a,0,0)}catch(e){console.error('gyEntryPic sharpen',e)}
  return K[kind]=c}
