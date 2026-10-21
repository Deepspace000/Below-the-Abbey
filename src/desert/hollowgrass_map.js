/* ==========================================================================
   THE HOLLOW GRASSLANDS: the hand-drawn parchment map. The land, the tracks, the five villages, the four hives, the pinnacles round the edge and the creatures
   on the hills are drawn once (from the real level) onto a sheet of parchment, and the party is marked on it each time the map is opened.
   ========================================================================== */
const HGM={cv:null,s:1.6,ox:120,oy:46};
function hgmDraw(){
  const L=LEVELS[HG.ID];if(!L)return null;
  const c=document.createElement('canvas');c.width=DW*3;c.height=DH*3;const x=c.getContext('2d');x.scale(3,3);const H=hash2,ink='#241a12',halo='rgba(226,222,200,.9)',S=HGM.s,OX=HGM.ox,OY=HGM.oy,PX=a=>OX+a*S,PY=a=>OY+a*S;
  // the parchment, cold and old
  const gr=x.createLinearGradient(0,0,0,DH);gr.addColorStop(0,'#c9c6ad');gr.addColorStop(1,'#a9aa94');x.fillStyle=gr;x.fillRect(0,0,DW,DH);
  x.save();x.globalAlpha=.13;for(let i=0;i<150;i++){x.fillStyle=i%3?'#4a5a60':'#ecf0dc';x.beginPath();x.ellipse(H(i,1,7)*DW,H(i,2,7)*DH,6+H(i,3,7)*30,3+H(i,4,7)*14,H(i,5,7)*3,0,Math.PI*2);x.fill()}x.restore();
  const lab=(t,a,b,sz,col,al)=>{x.save();x.font=`bold ${sz}px ${FUI}`;x.textAlign=al||'center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=3;x.strokeStyle=halo;x.strokeText(t,a,b);x.fillStyle=col||ink;x.fillText(t,a,b);x.restore()};
  // the edge of the cavern: a wobbling outline, with the solid rock outside it drawn in short strokes
  const N=150,edge=[];for(let i=0;i<64;i++){const a=i/64*Math.PI*2,r=Math.max(Math.abs(Math.cos(a)),Math.abs(Math.sin(a)));const ex=Math.cos(a)/r,ey=Math.sin(a)/r,w=1+(H(i,3,41)-.5)*.07+Math.sin(a*5)*.012;edge.push([PX(75+ex*73*w),PY(75+ey*73*w)])}
  x.save();x.fillStyle='#bdc2aa';x.beginPath();edge.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.fill();x.restore();
  x.save();x.beginPath();x.rect(0,0,DW,DH);edge.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.clip('evenodd');
  x.strokeStyle='rgba(36,28,22,.5)';x.lineWidth=.8;for(let i=0;i<1700;i++){const a=H(i,1,43)*DW,b=H(i,2,43)*DH,l=3+H(i,3,43)*5;x.beginPath();x.moveTo(a,b);x.lineTo(a+l,b+l*.6*(H(i,4,43)-.2));x.stroke()}x.restore();
  x.strokeStyle=ink;x.lineWidth=2;x.beginPath();edge.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.stroke();
  // the grass: little tufts everywhere, lawns and moss in patches
  x.save();x.beginPath();edge.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.clip();
  for(let gy=3;gy<N-3;gy+=3)for(let gx=3;gx<N-3;gx+=3){const f=L.fmap[gy][gx];if(f==='5'||f==='2'){x.fillStyle=f==='5'?'rgba(120,134,110,.22)':'rgba(96,140,110,.2)';x.fillRect(PX(gx)-2,PY(gy)-2,4.5,4.5)}}
  x.strokeStyle='rgba(58,90,66,.8)';x.lineWidth=.7;for(let i=0;i<520;i++){const a=PX(4+H(i,1,47)*142),b=PY(4+H(i,2,47)*142);x.beginPath();x.moveTo(a-1.4,b);x.lineTo(a,b-2.4);x.lineTo(a+1.4,b);x.moveTo(a,b);x.lineTo(a,b-1.6);x.stroke()}
  // low hills: soft arcs
  x.strokeStyle='rgba(60,70,56,.55)';x.lineWidth=.9;for(let i=0;i<46;i++){const a=PX(8+H(i,1,48)*134),b=PY(8+H(i,2,48)*134),w=10+H(i,3,48)*14;x.beginPath();x.moveTo(a-w,b);x.quadraticCurveTo(a,b-w*.55,a+w,b);x.stroke();x.beginPath();x.moveTo(a-w*.5,b+2.5);x.quadraticCurveTo(a,b-w*.15,a+w*.5,b+2.5);x.stroke()}
  // the tracks, read from the real map: the dirt between the villages and the hives
  x.fillStyle='rgba(120,88,54,.92)';for(let gy=3;gy<N-3;gy++)for(let gx=3;gx<N-3;gx++)if(L.fmap[gy][gx]==='1'){let inT=false;for(const t of HG_TOWNS)if(Math.abs(gx-t.x)<=11&&Math.abs(gy-t.y)<=11){inT=true;break}if(!inT)x.fillRect(PX(gx),PY(gy),S+.3,S+.3)}
  x.restore();
  // the wind, in a few long curls
  x.strokeStyle='rgba(70,96,120,.55)';x.lineWidth=.8;x.lineCap='round';for(let i=0;i<9;i++){const a=PX(10+H(i,1,49)*130),b=PY(10+H(i,2,49)*130);x.beginPath();x.moveTo(a,b);x.bezierCurveTo(a+14,b-5,a+26,b+5,a+40,b-2);x.bezierCurveTo(a+46,b-4,a+48,b+3,a+44,b+4);x.stroke()}
  // the pinnacles and the far spires round the edge
  for(const e of L.sky){const px=PX(e.x),py=PY(e.y),amber=/tower[0-3]$/.test(e.k),hh=13+e.w*.9,ww=3+e.w*.28,out=[e.x<8?-1:e.x>142?1:0,e.y<8?-1:e.y>142?1:0];void out;
    x.save();x.translate(px,py+2);x.fillStyle=amber?'#c8803a':'#a8c8d8';x.strokeStyle=ink;x.lineWidth=.9;x.beginPath();x.moveTo(-ww,0);x.lineTo(-ww*.55,-hh*.55);x.lineTo(-ww*.2,-hh*.8);x.lineTo(0,-hh);x.lineTo(ww*.2,-hh*.8);x.lineTo(ww*.55,-hh*.55);x.lineTo(ww,0);x.closePath();x.fill();x.stroke();
    x.strokeStyle=amber?'rgba(70,36,10,.7)':'rgba(40,70,100,.6)';x.lineWidth=.6;for(let k=1;k<4;k++){x.beginPath();x.moveTo(-ww*(1-k*.2),-hh*k*.22);x.lineTo(ww*(1-k*.2),-hh*k*.22-1);x.stroke()}x.restore()}
  // a painted creature picture on the parchment: a soft shadow under it, then the picture; false while the picture has not loaded (the old drawing is the fallback)
  const hgmFrog=(a,b,w)=>{const im=IMG['hg_frog'+(((a*7+b*3)|0)&1)]||IMG.hg_frog0;if(!im||!im.width)return false;const h=w*im.height/im.width;
    x.save();x.fillStyle='rgba(40,30,16,.28)';x.beginPath();x.ellipse(a,b+h*.36,w*.42,h*.13,0,0,Math.PI*2);x.fill();x.drawImage(im,a-w/2,b-h*.62,w,h);x.restore();return true};
  // the strange rocks on the hills, and the amber pinnacles among them
  for(const d of L.decor){if(!/^hg_(rock|tower)/.test(d.k))continue;const a=PX(d.x),b=PY(d.y);
    if(/tower/.test(d.k)){x.fillStyle='#c8803a';x.strokeStyle=ink;x.lineWidth=.8;x.beginPath();x.moveTo(a-2,b+1);x.lineTo(a-1,b-6);x.lineTo(a,b-9);x.lineTo(a+1,b-6);x.lineTo(a+2.2,b+1);x.closePath();x.fill();x.stroke()}
    else{x.fillStyle='#9a9a98';x.strokeStyle=ink;x.lineWidth=.8;x.beginPath();x.moveTo(a-3,b+1.5);x.quadraticCurveTo(a-3,b-4,a-.5,b-5);x.quadraticCurveTo(a+2,b-6,a+3,b+1.5);x.closePath();x.fill();x.stroke();x.fillStyle=ink;x.beginPath();x.ellipse(a,b-1.5,.9,1.3,0,0,Math.PI*2);x.fill()}}
  // the frog-whales, grazing
  for(const d of L.decor){if(!/^hg_frog/.test(d.k)||(d.sc!==undefined&&d.sc<.01))continue;const a=PX(d.x),b=PY(d.y);
    if(hgmFrog(a,b,12*(d.sc||1)))continue; // the painted frog-whale picture; the old drawing is only the fallback while the picture has not loaded
    x.fillStyle='#8a9a78';x.strokeStyle=ink;x.lineWidth=.7;x.beginPath();x.ellipse(a,b,5.4,3.8,0,0,Math.PI*2);x.fill();x.stroke();x.fillStyle='#e8ecd8';x.beginPath();x.arc(a-1.8,b-2.4,1.3,0,Math.PI*2);x.arc(a+1.8,b-2.4,1.3,0,Math.PI*2);x.fill();x.strokeStyle=ink;x.beginPath();x.moveTo(a-2.4,b+.9);x.quadraticCurveTo(a,b+2.4,a+2.4,b+.9);x.stroke()}
  // the insectivores: a spider mark, bigger the bigger the beast
  for(const e of L.enemies){const m=/^hgins(\d)$/.exec(e.t);if(!m)continue;const t=+m[1],a=PX(e.x),b=PY(e.y),r=1.1+t*.32;x.strokeStyle='#4a1810';x.lineWidth=.6+t*.05;x.beginPath();for(const k of [-1,1])for(let j=0;j<4;j++){const ang=(-.9+j*.6)*k+(k<0?Math.PI:0);x.moveTo(a,b);x.lineTo(a+Math.cos(ang)*r*2,b+Math.sin(ang)*r*1.3-r*.4)}x.stroke();
    x.fillStyle='#6a2418';x.beginPath();x.ellipse(a,b,r*.8,r*.65,0,0,Math.PI*2);x.fill();x.fillStyle='#e8ecd8';x.beginPath();x.arc(a-r*.3,b-r*.2,Math.max(.4,r*.2),0,Math.PI*2);x.arc(a+r*.3,b-r*.2,Math.max(.4,r*.2),0,Math.PI*2);x.fill()}
  // the villages: a spiked fence round white towers
  const pastel=['#d8c8e8','#e8c8d0','#c8dcdc','#e8dcb0'];
  HG_TOWNS.forEach((t,ti)=>{const cx=PX(t.x),cy=PY(t.y),r=10*S;
    x.save();x.fillStyle='rgba(232,228,214,.7)';x.fillRect(cx-r,cy-r,2*r,2*r);x.strokeStyle='rgba(120,88,54,.95)';x.lineWidth=1.6;x.beginPath();x.moveTo(cx,cy-r);x.lineTo(cx,cy+r);x.moveTo(cx-r,cy);x.lineTo(cx+r,cy);x.stroke();
    x.strokeStyle=ink;x.lineWidth=1.1;x.strokeRect(cx-r,cy-r,2*r,2*r);x.lineWidth=.9;x.beginPath();for(let k=-r+2;k<r;k+=2.4){for(const [px,py,dx,dy] of [[cx+k,cy-r,0,-2.3],[cx+k,cy+r,0,2.3],[cx-r,cy+k,-2.3,0],[cx+r,cy+k,2.3,0]]){if((dx===0&&Math.abs(k)<2)){continue}x.moveTo(px,py);x.lineTo(px+dx,py+dy)}}x.stroke();
    for(const bx of [-8,-3,2,7])for(const by of [-8,-3,2,7]){if((bx===-3||bx===2)&&(by===-3||by===2))continue;if(H(t.x+bx,t.y+by,50)<.18)continue;const hx=cx+(bx+.5)*S,hy=cy+(by+.5)*S;x.fillStyle='#f2eee4';x.strokeStyle=ink;x.lineWidth=.7;x.fillRect(hx-1.5,hy-1,3,3.2);x.strokeRect(hx-1.5,hy-1,3,3.2);x.fillStyle=pastel[(bx*3+by*5+ti+40)%4];x.beginPath();x.moveTo(hx-1.9,hy-1);x.quadraticCurveTo(hx-1,hy-4,hx,hy-5.4);x.quadraticCurveTo(hx+1,hy-4,hx+1.9,hy-1);x.closePath();x.fill();x.stroke()}
    x.fillStyle='#88b4cc';x.beginPath();x.arc(cx+2.5*S,cy+2.5*S,1.5,0,Math.PI*2);x.fill();x.strokeStyle=ink;x.stroke();x.restore();
    lab(t.n.toUpperCase(),cx,cy-r-6,ti===0?9.5:8,ti===0?'#2a1a50':ink);
    });
  // the four hives
  HG_HIVE_AT.forEach((p,i)=>{const a=PX(p[0]),b=PY(p[1]);x.save();x.translate(a,b);for(let k=0;k<4;k++){x.fillStyle=k%2?'#d89c30':'#e8b848';x.strokeStyle=ink;x.lineWidth=.9;x.beginPath();x.ellipse(0,3-k*3.1,8-k*1.5,3.4,0,0,Math.PI*2);x.fill();x.stroke()}
    x.fillStyle='#2a1c0e';x.beginPath();x.ellipse(0,5.5,2.2,1.7,0,0,Math.PI*2);x.fill();x.strokeStyle='rgba(120,70,10,.7)';x.lineWidth=.5;for(let k=-1;k<=1;k++){x.beginPath();x.arc(k*2.8,-.4,1.1,0,Math.PI*2);x.stroke()}
    x.fillStyle='#d03a2a';x.strokeStyle=ink;x.lineWidth=.8;x.beginPath();x.arc(10,-8,3.6,0,Math.PI*2);x.fill();x.stroke();x.restore();x.save();x.font=`bold 7px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff6e0';x.fillText(String(i+1),a+10,b-7.6);x.restore();
    lab(HG_HIVE_NAMES[i].toUpperCase(),a,b+14,7.2,'#6a1a10')});
  // the gate in the south, the start, and the way back
  {const a=PX(HG.START.x),b=PY(HG.H-4);x.save();x.translate(a,b);x.strokeStyle=ink;x.fillStyle='#d8d0bc';x.lineWidth=1;x.fillRect(-7,-5,14,6);x.strokeRect(-7,-5,14,6);for(let k=-6;k<=6;k+=2){x.beginPath();x.moveTo(k,-5);x.lineTo(k,-8);x.stroke()}x.restore();
    lab('THE SPIKED GATE',a,b+8,7.2,ink)}
  // the compass
  {const a=OX+S*140,b=OY+S*12;x.save();x.translate(a,b);x.strokeStyle=ink;x.fillStyle='#e8e4d2';x.lineWidth=1;x.beginPath();x.arc(0,0,9,0,Math.PI*2);x.fill();x.stroke();x.fillStyle=ink;x.beginPath();x.moveTo(0,-13);x.lineTo(3,0);x.lineTo(0,-2.5);x.lineTo(-3,0);x.closePath();x.fill();x.beginPath();x.moveTo(0,13);x.lineTo(2,0);x.lineTo(-2,0);x.closePath();x.strokeStyle=ink;x.stroke();x.restore();lab('N',a,b-17,8,ink)}
  // title, notes and legend
  x.save();x.font=`18px ${FTITLE}`;x.textAlign='left';x.textBaseline='middle';x.fillStyle=ink;x.fillText('The Hollow',8,14);x.fillText('Grasslands',8,32);x.restore();
  lab('a cavern inside the earth',9,48,7,'#5a3c1c','left');lab('levels 66 to 70',9,59,7,'#5a3c1c','left');
  const notes=['No sky here: the roof of rock is lost in the dark, and the wind never stops.','The folk speak a tongue no stranger knows. Four books in the four hives teach it, one step at a time.','Insectivores sit on the hills. The further from the gate, the bigger they grow.','Keep to the tracks, and the frog-whales will do you no harm.'];
  // legend, right
  const lx=366,ly0=70;x.fillStyle=ink;x.font=`bold 8px ${FUI}`;x.textAlign='left';x.fillText('KEY',lx,ly0-10);
  const key=(i,t,draw)=>{const yy=ly0+i*17;draw(lx+8,yy);lab(t,lx+20,yy,6.6,'#3a2a1c','left')};
  key(0,'Village',(a,b)=>{x.fillStyle='#f2eee4';x.strokeStyle=ink;x.lineWidth=.7;x.fillRect(a-2,b-1,4,4);x.strokeRect(a-2,b-1,4,4);x.fillStyle='#d8c8e8';x.beginPath();x.moveTo(a-2.4,b-1);x.lineTo(a,b-6);x.lineTo(a+2.4,b-1);x.closePath();x.fill();x.stroke()});
  key(1,'Beehive dungeon',(a,b)=>{x.fillStyle='#e8b848';x.strokeStyle=ink;x.lineWidth=.8;for(let k=0;k<3;k++){x.beginPath();x.ellipse(a,b+2-k*2.4,4-k*.8,2,0,0,Math.PI*2);x.fill();x.stroke()}});
  key(2,'Dirt track',(a,b)=>{x.fillStyle='rgba(120,88,54,.95)';x.fillRect(a-6,b-1,12,2.6)});
  key(3,'Strange rock',(a,b)=>{x.fillStyle='#9a9a98';x.strokeStyle=ink;x.lineWidth=.7;x.beginPath();x.moveTo(a-3,b+2);x.quadraticCurveTo(a-3,b-3,a,b-4);x.quadraticCurveTo(a+3,b-4,a+3,b+2);x.closePath();x.fill();x.stroke()});
  key(4,'Amber pinnacle',(a,b)=>{x.fillStyle='#c8803a';x.strokeStyle=ink;x.lineWidth=.7;x.beginPath();x.moveTo(a-2.4,b+3);x.lineTo(a,b-6);x.lineTo(a+2.4,b+3);x.closePath();x.fill();x.stroke()});
  key(5,'Far spire',(a,b)=>{x.fillStyle='#a8c8d8';x.strokeStyle=ink;x.lineWidth=.7;x.beginPath();x.moveTo(a-2.4,b+3);x.lineTo(a,b-6);x.lineTo(a+2.4,b+3);x.closePath();x.fill();x.stroke()});
  key(6,'Frog-whale (harmless)',(a,b)=>{if(hgmFrog(a,b,9))return;x.fillStyle='#8a9a78';x.strokeStyle=ink;x.lineWidth=.7;x.beginPath();x.ellipse(a,b,3.4,2.4,0,0,Math.PI*2);x.fill();x.stroke();x.fillStyle='#e8ecd8';x.beginPath();x.arc(a-1.2,b-1.4,.9,0,Math.PI*2);x.arc(a+1.2,b-1.4,.9,0,Math.PI*2);x.fill()});
  key(7,'Insectivore (small to huge)',(a,b)=>{for(const [dx,t] of [[-4,0],[0,4],[4.6,9]]){const r=1.1+t*.32;x.fillStyle='#6a2418';x.beginPath();x.ellipse(a+dx,b,r*.8,r*.65,0,0,Math.PI*2);x.fill()}});
  key(8,'Red number: book in that hive',(a,b)=>{x.fillStyle='#d03a2a';x.strokeStyle=ink;x.lineWidth=.8;x.beginPath();x.arc(a,b,3.2,0,Math.PI*2);x.fill();x.stroke()});
  mpmgDraw(x,470);
  return c;
}
function hgmOverview(){
  if(!HGM.cv)HGM.cv=hgmDraw();
  MPL.reveal=false;if(HGM.cv)mplPaint(HGM.cv,3,{x:112,y:38,w:252,h:254},cx=>HGM.ox+cx*HGM.s,cy=>HGM.oy+cy*HGM.s,'You are the yellow arrow.');
}
{const _do=drawOverview;drawOverview=function(){if(LEVEL===HG.ID&&LEVELS[HG.ID]&&!G.world&&!G.teleMode){hgmOverview();return}return _do.apply(this,arguments)}}
