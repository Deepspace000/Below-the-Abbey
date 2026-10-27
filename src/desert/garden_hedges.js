/* ==========================================================================
   THE HEDGES OF THE MAZE OF GARDENS (prefix gmh). Sixteen kinds of hedge, each painted in code leaf by leaf with its own leaf shape, colours and blossom, and four variants of each so that no two neighbouring
   walls repeat: clipped box, yew, holly with red berries, privet, glossy laurel, copper beech, hawthorn in white blossom, ivy over old brick, climbing roses (red, white and pink), wisteria with hanging lilac,
   honeysuckle, lavender, hydrangea, clematis, nasturtium and jasmine, and a clipped hedge with an arched niche in it holding a stone bench and a little lantern. gmHedge(type, variant, wh) makes the wall tile
   (cached), gmhPick(types, x, y) picks a type and variant for a wall cell. Painted at load of the garden; each tile is 128 pixels wide and wh squares high, like the painted ones of garden_art.js.
   ========================================================================== */
const GMH={
  box:{base:'#142e17',cols:['#255a27','#2f6d30','#3d8238','#4a9644','#1c4a20'],len:[4,7],ratio:.72,n:2.4,shape:'oval'},
  yew:{base:'#0c2016',cols:['#173d2a','#1f4c34','#285c3e','#133524','#2f6a48'],len:[10,15],ratio:.14,n:1.6,shape:'needle'},
  holly:{base:'#122c17',cols:['#1b5026','#256333','#327a3f','#154520','#3a8a48'],len:[8,12],ratio:.55,n:1.15,shape:'spike',acc:[{k:'berry',cs:['#d22a2a','#e03838','#b81e24'],n:34,s:2.7}]},
  privet:{base:'#1a3c16',cols:['#47a02e','#58b638','#3a8a2a','#6fc84a','#2f7a24'],len:[5,8],ratio:.5,n:2,shape:'oval'},
  laurel:{base:'#102c18',cols:['#255f33','#307540','#40904f','#1b4c2a','#58a864'],len:[13,19],ratio:.42,n:.85,shape:'oval',gloss:1},
  beech:{base:'#26121e',cols:['#68283a','#7a3a46','#8c4a50','#521c36','#a05a58'],len:[8,12],ratio:.55,n:1.3,shape:'oval'},
  hawthorn:{base:'#183818',cols:['#386f2e','#488a3e','#2c6428','#58a04c'],len:[6,9],ratio:.65,n:1.6,shape:'lobed',acc:[{k:'bloom',cs:['#fff8f8','#ffe8ee','#fff0f4'],n:46,s:4.2,p:5},{k:'berry',cs:['#c01f2a'],n:10,s:2}]},
  ivy:{base:'#5e564e',cols:['#2d6a2c','#3a7e36','#245a26','#4a9242','#1c4a20'],len:[8,12],ratio:.9,n:1.5,shape:'heart',brick:1},
  rose:{base:'#173717',cols:['#2d6a30','#3a7f38','#265a2a','#4a9444'],len:[7,10],ratio:.5,n:1.25,shape:'oval',acc:[{k:'bloom',cs:['#d82a3a','#e84a5a','#c01830','#f06a78'],n:36,s:6.4,p:7}]},
  roseW:{base:'#173717',cols:['#2d6a30','#3a7f38','#265a2a','#4a9444'],len:[7,10],ratio:.5,n:1.25,shape:'oval',acc:[{k:'bloom',cs:['#fffaf0','#f6f0e0','#fff4f4','#ffe8e0'],n:36,s:6.4,p:7}]},
  roseP:{base:'#173717',cols:['#2d6a30','#3a7f38','#265a2a','#4a9444'],len:[7,10],ratio:.5,n:1.25,shape:'oval',acc:[{k:'bloom',cs:['#f49ab8','#f8b4c8','#e87aa0','#fcc8d8'],n:36,s:6.4,p:7}]},
  wisteria:{base:'#173a1a',cols:['#2f6e30','#3d8238','#285e2a','#4c9644'],len:[8,12],ratio:.45,n:1.2,shape:'oval',acc:[{k:'rac',cs:['#9a7ad8','#b090e8','#7a5ac0','#c4a8f0'],n:18}]},
  honey:{base:'#17381a',cols:['#2f6e30','#3d8238','#4c9644','#276028'],len:[6,9],ratio:.55,n:1.5,shape:'oval',acc:[{k:'tube',cs:['#f6e4a8','#f4b860','#fff0c0','#f0a04a'],n:48}]},
  lavender:{base:'#3d5a48',cols:['#6a8a72','#7a9a82','#587a62','#8aaa90'],len:[10,15],ratio:.1,n:1.8,shape:'needle',acc:[{k:'spike',cs:['#8a5ad0','#a070e0','#7a48c0','#b48af0'],n:90}]},
  hydrangea:{base:'#12301a',cols:['#2a6a38','#378048','#1f5530','#48985a'],len:[12,17],ratio:.55,n:.9,shape:'oval',acc:[{k:'ball',cs:['#6a8ae8','#8aa0f0','#e88ab8','#f0a0c8','#a8b8f8','#d070a8'],n:26,s:11}]},
  clematis:{base:'#17381a',cols:['#2f6e30','#3d8238','#285e2a','#4c9644'],len:[7,11],ratio:.5,n:1.25,shape:'lobed',acc:[{k:'star',cs:['#8a3ad0','#b068e8','#9a50e0','#cf90f4'],n:40,s:6.4,p:6}]},
  nasturt:{base:'#1c4018',cols:['#58b038','#6cc844','#4a9a30','#80dc58'],len:[8,12],ratio:1,n:1,shape:'round',acc:[{k:'bloom',cs:['#f08a1a','#f6b01a','#e85a1a','#fcc84a'],n:34,s:5.6,p:5}]},
  jasmine:{base:'#0f2a16',cols:['#1f5028','#296434','#184420','#337a40'],len:[6,9],ratio:.5,n:1.7,shape:'oval',acc:[{k:'star',cs:['#ffffff','#fff8f0','#f8fff8'],n:64,s:4.2,p:5}]},
  niche:{base:'#142e17',cols:['#255a27','#2f6d30','#3d8238','#4a9644','#1c4a20'],len:[4,7],ratio:.72,n:2.4,shape:'oval',niche:1}
};
const GMH_NAMES=Object.keys(GMH);
function gmhRng(sd){return()=>{sd=(sd+0x6D2B79F5)|0;let t=Math.imul(sd^(sd>>>15),1|sd);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
function gmHedge(type,variant,wh){
  const S=GMH[type]||GMH.box,key='H|'+type+'|'+variant+'|'+wh;if(GM.tiles[key]!==undefined)return GM.tiles[key];
  const Hp=Math.round(128*wh),W=128,c=document.createElement('canvas');c.width=W;c.height=Hp;const x=c.getContext('2d');
  let sd=variant*7919+type.length*131;for(let i=0;i<type.length;i++)sd=(sd*31+type.charCodeAt(i))|0;const R=gmhRng(sd);
  x.fillStyle=S.base;x.fillRect(0,0,W,Hp);
  if(S.brick){ // old brick under the ivy
    x.fillStyle='#7a4a3a';for(let yy=0,r=0;yy<Hp;yy+=14,r++){for(let xx=-((r%2)*16);xx<W;xx+=32){x.fillStyle=['#7a4a3a','#6a4234','#855244','#704638'][(R()*4)|0];x.fillRect(xx+1,yy+1,30,12)}}}
  const wrap=fn=>{fn(0);};
  const leaf=(px,py,len,wid,ang,col,sh)=>{x.fillStyle=col;x.beginPath();
    if(sh==='needle'){x.moveTo(px,py);x.lineTo(px+Math.cos(ang)*len+Math.cos(ang+1.57)*wid,py+Math.sin(ang)*len+Math.sin(ang+1.57)*wid);x.lineTo(px+Math.cos(ang)*len*1.1,py+Math.sin(ang)*len*1.1);x.lineTo(px+Math.cos(ang)*len-Math.cos(ang+1.57)*wid,py+Math.sin(ang)*len-Math.sin(ang+1.57)*wid);x.closePath()}
    else if(sh==='spike'){const ex=Math.cos(ang),ey=Math.sin(ang),nx=-ey,ny=ex;x.moveTo(px,py);for(let k=0;k<=4;k++){const t=k/4,wx=px+ex*len*t,wy=py+ey*len*t,w=wid*Math.sin(t*Math.PI)*(k%2?1:.7);x.lineTo(wx+nx*w,wy+ny*w)}x.lineTo(px+ex*len*1.08,py+ey*len*1.08);for(let k=4;k>=0;k--){const t=k/4,wx=px+ex*len*t,wy=py+ey*len*t,w=wid*Math.sin(t*Math.PI)*(k%2?1:.7);x.lineTo(wx-nx*w,wy-ny*w)}x.closePath()}
    else if(sh==='heart'){x.save();x.translate(px,py);x.rotate(ang);x.moveTo(0,0);x.bezierCurveTo(-len*.55,-len*.1,-len*.5,len*.6,0,len);x.bezierCurveTo(len*.5,len*.6,len*.55,-len*.1,0,0);x.restore()}
    else if(sh==='lobed'){x.save();x.translate(px,py);x.rotate(ang);x.moveTo(0,0);x.quadraticCurveTo(-len*.5,len*.25,-len*.3,len*.55);x.quadraticCurveTo(-len*.2,len*.8,0,len);x.quadraticCurveTo(len*.2,len*.8,len*.3,len*.55);x.quadraticCurveTo(len*.5,len*.25,0,0);x.restore()}
    else if(sh==='round'){x.arc(px,py,len*.5,0,6.3)}
    else{x.save();x.translate(px,py);x.rotate(ang);x.ellipse(len*.5,0,len*.5,wid*.5,0,0,6.3);x.restore()}
    x.fill()};
  const light=py=>1-.34*(py/Hp)+.1;   // brighter high up, shaded low down
  const N=Math.round(S.n*W*Hp/((S.len[0]+S.len[1])/2*((S.len[0]+S.len[1])/2*S.ratio+2)*.9));
  // three passes: deep shade, the body of the hedge, then sunlit leaves on top
  for(let pass=0;pass<3;pass++){const cnt=pass===0?N*.5:pass===1?N:N*.55;
    for(let i=0;i<cnt;i++){const px=R()*W,py=R()*Hp,len=S.len[0]+R()*(S.len[1]-S.len[0]),wid=len*S.ratio,ang=(S.shape==='needle'?1.2+R()*.7:R()*6.28),ci=pass===0?S.cols.length-1:Math.min(S.cols.length-1,(R()*S.cols.length)|0);
      let col=S.cols[ci];if(pass===2)col=S.cols[(R()*Math.min(3,S.cols.length))|0];
      x.globalAlpha=pass===0?.9:pass===1?.95:.8;
      for(const ox of (px<len?[0,W]:px>W-len?[0,-W]:[0])){x.save();x.translate(ox,0);leaf(px,py,len,wid,ang,col,S.shape);x.restore()}
      if(S.gloss&&R()<.5){x.globalAlpha=.35;x.fillStyle='#e8ffe8';x.beginPath();x.ellipse(px+len*.3,py,len*.18,wid*.12,ang,0,6.3);x.fill()}}}
  x.globalAlpha=1;
  // blossom, berries and hangings
  for(const A of (S.acc||[])){
    for(let i=0;i<A.n*wh;i++){const px=R()*W,py=R()*Hp,col=A.cs[(R()*A.cs.length)|0],ox=px<12?[0,W]:px>W-12?[0,-W]:[0];
      for(const o of ox){x.save();x.translate(px+o,py);
        if(A.k==='berry'){x.fillStyle=col;x.beginPath();x.arc(0,0,A.s,0,6.3);x.fill();x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.arc(-A.s*.3,-A.s*.3,A.s*.3,0,6.3);x.fill()}
        else if(A.k==='bloom'||A.k==='star'){const p=A.p,r=A.s*(.75+R()*.5);x.fillStyle=col;for(let k=0;k<p;k++){const a=k*6.283/p+R()*.3;x.beginPath();if(A.k==='star'){x.moveTo(0,0);x.lineTo(Math.cos(a-.25)*r*.55,Math.sin(a-.25)*r*.55);x.lineTo(Math.cos(a)*r,Math.sin(a)*r);x.lineTo(Math.cos(a+.25)*r*.55,Math.sin(a+.25)*r*.55);x.closePath()}else x.ellipse(Math.cos(a)*r*.5,Math.sin(a)*r*.5,r*.5,r*.36,a,0,6.3);x.fill()}
          x.fillStyle=A.k==='star'?'#f0d060':'rgba(255,230,120,.95)';x.beginPath();x.arc(0,0,r*.2,0,6.3);x.fill();x.strokeStyle='rgba(30,10,10,.25)';x.lineWidth=.6;x.beginPath();x.arc(0,0,r*.55,0,6.3);x.stroke()}
        else if(A.k==='rac'){const L=14+R()*18;for(let k=0;k<12;k++){const t=k/12;x.fillStyle=A.cs[(R()*A.cs.length)|0];x.beginPath();x.arc((R()-.5)*(5.5-t*4),t*L,3.2-t*2,0,6.3);x.fill()}}
        else if(A.k==='tube'){x.strokeStyle=col;x.lineWidth=2.2;x.lineCap='round';x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(3,-2,5,-6);x.stroke();x.fillStyle=col;x.beginPath();x.arc(5,-6,1.6,0,6.3);x.fill()}
        else if(A.k==='spike'){x.strokeStyle='#4a6a50';x.lineWidth=.9;x.beginPath();x.moveTo(0,0);x.lineTo(0,-16);x.stroke();for(let k=0;k<7;k++){x.fillStyle=col;x.beginPath();x.ellipse((k%2?1.4:-1.4),-6-k*1.7,1.9,1.4,0,0,6.3);x.fill()}}
        else if(A.k==='ball'){const r=A.s*(.8+R()*.4);for(let k=0;k<16;k++){const a=R()*6.283,d=R()*r;x.fillStyle=A.cs[(R()*A.cs.length)|0];x.beginPath();x.arc(Math.cos(a)*d,Math.sin(a)*d,2.7,0,6.3);x.fill()}}
        x.restore()}}}
  if(S.niche){ // an arched niche cut into the clipped hedge: a stone bench, an urn and a lantern, in a pool of warm light
    const nw=64,nx=(W-nw)/2+(variant%2?-6:6),base=Hp-18,top=Hp-18-82;
    x.save();x.beginPath();x.moveTo(nx,base);x.lineTo(nx,top+nw/2);x.arc(nx+nw/2,top+nw/2,nw/2,Math.PI,0);x.lineTo(nx+nw,base);x.closePath();x.clip();
    let g=x.createLinearGradient(0,top,0,base);g.addColorStop(0,'#0a1a0d');g.addColorStop(1,'#1c3a1e');x.fillStyle=g;x.fillRect(nx,top,nw,base-top);
    g=x.createRadialGradient(nx+nw/2,base-24,2,nx+nw/2,base-24,46);g.addColorStop(0,'rgba(255,214,130,.8)');g.addColorStop(1,'rgba(255,200,100,0)');x.fillStyle=g;x.fillRect(nx,top,nw,base-top);
    x.fillStyle='#a8a090';x.fillRect(nx+8,base-16,nw-16,7);x.fillStyle='#8a8272';x.fillRect(nx+12,base-9,6,9);x.fillRect(nx+nw-18,base-9,6,9);
    if(variant%2){x.fillStyle='#b8b0a0';x.beginPath();x.ellipse(nx+nw/2,base-30,7,9,0,0,6.3);x.fill();x.fillStyle='#d83a3a';x.beginPath();x.arc(nx+nw/2-2,base-40,3,0,6.3);x.arc(nx+nw/2+3,base-38,2.6,0,6.3);x.fill()}
    else{x.fillStyle='#2a2a2a';x.fillRect(nx+nw/2-1,base-52,2,18);x.fillStyle='#ffe090';x.fillRect(nx+nw/2-5,base-44,10,14);x.fillStyle='rgba(255,240,180,.9)';x.fillRect(nx+nw/2-3,base-42,6,10)}
    x.restore();x.strokeStyle='#d8d0b8';x.lineWidth=3;x.beginPath();x.moveTo(nx,base);x.lineTo(nx,top+nw/2);x.arc(nx+nw/2,top+nw/2,nw/2,Math.PI,0);x.lineTo(nx+nw,base);x.stroke();
  }
  // light: warm and bright high up, deep green shade at the foot where the hedge meets the ground, a soft shade at both edges so that a run of cells reads as clipped sections
  x.globalCompositeOperation='multiply';let gr=x.createLinearGradient(0,0,0,Hp);gr.addColorStop(0,'rgb(255,250,232)');gr.addColorStop(.7,'rgb(236,234,212)');gr.addColorStop(1,'rgb(170,176,150)');x.fillStyle=gr;x.fillRect(0,0,W,Hp);
  gr=x.createLinearGradient(0,0,W,0);gr.addColorStop(0,'rgba(190,196,176,1)');gr.addColorStop(.12,'rgba(255,255,255,1)');gr.addColorStop(.88,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba(200,204,184,1)');x.fillStyle=gr;x.fillRect(0,0,W,Hp);x.globalCompositeOperation='source-over';
  const d=x.getImageData(0,0,W,Hp).data;
  for(let i=0;i<d.length;i+=4){const l=d[i]*.3+d[i+1]*.59+d[i+2]*.11,k=1.2;d[i]=Math.min(255,(l+(d[i]-l)*k)*1.12);d[i+1]=Math.min(255,(l+(d[i+1]-l)*k)*1.12);d[i+2]=Math.min(255,(l+(d[i+2]-l)*k)*1.1)}
  const id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;const gid=KH_NEXT_GID++;T_TILE[gid]=id;
  {let r=0,g=0,b=0,n=0;for(let i=0;i<d.length;i+=4*37){r+=d[i];g+=d[i+1];b+=d[i+2];n++}(GM.col=GM.col||{})[gid]=[r/n|0,g/n|0,b/n|0]}
  return GM.tiles[key]=gid}
/* a type and a variant for a wall cell: a type holds for about three cells together, the variant changes cell by cell so no two neighbours look alike */
function gmhPick(types,x,y,sd){const t=types[Math.min(types.length-1,Math.floor(hash2((x/3)|0,(y/3)|0,sd)*types.length))];return [t,(hash2(x,y,sd+5)*4)|0]}

/* little glowing motes of light, in four colours (gold, rose, lilac and mint): the floating sparkle of the garden */
function gmMotes(){if(IMG.gm_mote0)return;
  [[255,236,150],[255,190,220],[200,180,255],[190,255,230]].forEach((c,i)=>{const cv=document.createElement('canvas');cv.width=cv.height=48;const x=cv.getContext('2d'),g=x.createRadialGradient(24,24,0,24,24,24);
    g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.18,'rgba('+c[0]+','+c[1]+','+c[2]+',.95)');g.addColorStop(.5,'rgba('+c[0]+','+c[1]+','+c[2]+',.25)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,48,48);IMG['gm_mote'+i]=cv;NPC_H['gm_mote'+i]=.24})}
/* a golden, hazy air over the garden */
{const _w=weatherNow;weatherNow=function(){
  if(LEVEL===GM.ID)return {id:'mist',n:'Golden haze',fog:.028,haze:.42,dark:0,mix:.4,col:[255,232,190],text:'The air is warm and golden, and full of drifting light. Bees hum in the hedges.'};
  return _w.apply(this,arguments)}}
