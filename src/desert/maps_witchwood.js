/* ==========================================================================
   BLACKBRIAR WOOD (the Witch's Wood), area map (level 520). One illuminated sheet in a dark, spooky hand, drawn from the real level rows, fmap and decor: the walls of bark, bramble and old stone as inked
   masses in the colour of the real wall pictures, the dirt track picked out in pale ink from the gate to the cottage, the dried brook, the clearings numbered and listed in the margin, the small painted
   trees and stones of the game itself, the cottage and the gate, a compass. Names start with mpWw. No hints beyond the names of the places.
   ========================================================================== */
const MPWW={floor:['#56664a','#7a5e40','#d8c490','#a89a82','#8a8c84','#7a5a3a'],ink:'#0e1a12'};
function mpWwDraw(c,x,L,api){
  const R=L.rows,W=R[0].length,H=R.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,PX=F.ox,PY=F.oy,PW=W*s,PH=H*s,INK=MPL.INK,ww=L._ww||{};
  const wall=(cx,cy)=>!(R[cy]&&R[cy][cx]==='.'),col=(cx,cy)=>{const g=L.chars[R[cy][cx]],q=WW.col&&WW.col[g];return q||[40,56,44]};
  x.save();x.shadowColor='rgba(10,20,10,.6)';x.shadowBlur=14;x.shadowOffsetX=3;x.shadowOffsetY=5;x.fillStyle='#0e1a12';x.fillRect(PX-1.6,PY-1.6,PW+3.2,PH+3.2);x.restore();
  x.save();x.beginPath();x.rect(PX,PY,PW,PH);x.clip();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!wall(cx,cy))continue;const k=col(cx,cy),v=hash2(cx,cy,5)*12-6,f=.62;x.fillStyle=`rgb(${Math.max(0,k[0]*f*.7+v+10)|0},${Math.max(0,k[1]*f*.8+v+14)|0},${Math.max(0,k[2]*f*.7+v+8)|0})`;x.fillRect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2)}
  const fm=L.fmap;for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))continue;x.fillStyle=MPWW.floor[+fm[cy][cx]]||'#8a7a5a';x.fillRect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2)}
  // the track from the gate to the cottage, a pale thread
  if(ww.pathList&&ww.pathList.length){x.strokeStyle='rgba(250,236,170,.75)';x.lineWidth=Math.max(.6,s*.34);x.lineCap='round';x.lineJoin='round';x.setLineDash([s*.9,s*.7]);x.beginPath();ww.pathList.forEach(([px,py],i)=>{const a=X(px+.5),b=Y(py+.5);i?x.lineTo(a,b):x.moveTo(a,b)});x.stroke();x.setLineDash([])}
  x.strokeStyle=MPWW.ink;x.lineWidth=.55;x.lineCap='round';x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    if(wall(cx,cy-1)){x.moveTo(X0,Y0);x.lineTo(X0+s,Y0)}if(wall(cx,cy+1)){x.moveTo(X0,Y0+s);x.lineTo(X0+s,Y0+s)}if(wall(cx-1,cy)){x.moveTo(X0,Y0);x.lineTo(X0,Y0+s)}if(wall(cx+1,cy)){x.moveTo(X0+s,Y0);x.lineTo(X0+s,Y0+s)}}
  x.stroke();
  // the painted pieces, small: the trees, stones, graves, the well, the totems and the cauldron
  const keep=/^ww_(oakface|oakmoss|pine|pine2|willow|thorn|stone|grave|well|totem|cauldron|crowtree|oven|ring)$/;
  const D=(typeof G!=='undefined'&&LEVEL===520&&G.decor&&G.decor.length?G.decor:L.decor).filter(d=>keep.test(d.k)&&IMG[d.k]&&!d.found).sort((a,b)=>a.y-b.y);
  for(const d of D){const im=IMG[d.k],hh=Math.max(3,Math.min(9,(NPC_H[d.k]||1)*s*(d.sc||1)*1.5)),w=hh*im.width/im.height;x.globalAlpha=.9;x.drawImage(im,X(d.x+.5)-w/2,Y(d.y+1)-hh+s*.2,w,hh);x.globalAlpha=1}
  x.restore();
  // the cottage at the top of the track, and the gate at the foot
  {const cx=X(27.5),cy=PY-2,im=IMG.front_1;if(im){const hh=18,w=hh*im.width/im.height;x.drawImage(im,cx-w/2,cy-hh+2,w,hh)}api.text(x,"Grisselda's Cottage",cx,PY-23,6.4,'#5a1a1a');
    const gx=X(27.5);x.save();x.fillStyle=MPL.GOLD;x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.moveTo(gx-6,PY+PH);x.lineTo(gx-6,PY+PH+4);x.lineTo(gx,PY+PH+8);x.lineTo(gx+6,PY+PH+4);x.lineTo(gx+6,PY+PH);x.closePath();x.fill();x.stroke();x.restore();x.save();x.lineJoin='round';x.lineWidth=2.4;x.strokeStyle='rgba(14,26,18,.9)';x.font=`bold 6px ${FUI}`;x.textAlign='left';x.textBaseline='middle';x.strokeText('Gate to Wenlock',gx+10,PY+PH-5);x.fillStyle='#f4e6b0';x.fillText('Gate to Wenlock',gx+10,PY+PH-5);x.restore()}
  // the dried brook
  if(ww.brookY){x.save();x.beginPath();x.rect(PX,PY,PW,PH);x.clip();x.strokeStyle='rgba(228,220,196,.55)';x.lineWidth=Math.max(1,s*1.2);x.setLineDash([s*1.6,s*.9]);x.beginPath();for(let bx=1;bx<W-1;bx++){const a=X(bx+.5),b=Y(ww.brookY(bx)+1);bx===1?x.moveTo(a,b):x.lineTo(a,b)}x.stroke();x.setLineDash([]);x.restore();api.text(x,'The Dried Brook',X(40),Y(ww.brookY(40))-5,5.4,'#f4e6b0')}
  const names=L.mapNames||[];
  names.forEach((n,i)=>{const px=X(n.x+.5),py=Y(n.y+.5);x.save();x.fillStyle='rgba(250,240,200,.94)';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(px,py,3.6,0,6.3);x.fill();x.stroke();x.restore();api.text(x,String(i+1),px,py+.2,5.4,INK)});
  api.title(x,'Blackbriar Wood','Keep to the dirt. Do not follow the lights.',12,5);
  api.compass(x,50,262,15);
  {const a=388,b=40,w=90,lh=10.4,h=14+names.length*lh;api.panel(x,a,b,w,h);api.text(x,'The Wood',a+w/2,b+8,6.6,'#5a1a1a');
    names.forEach((n,i)=>{api.text(x,(i+1)+'  '+n.t.replace(/^The /,''),a+5,b+17+i*lh,5.4,INK,'left')})}
  {const a=6,b=46,w=84,h=100;api.panel(x,a,b,w,h);api.text(x,'Key',a+w/2,b+8,6.6,'#5a1a1a');
    const rows=[['Moss',MPWW.floor[0]],['Leaves',MPWW.floor[1]],['The dirt track',MPWW.floor[2]],['Dry brook',MPWW.floor[3]],['Old stone',MPWW.floor[4]]];
    rows.forEach(([t,c],i)=>{x.fillStyle=c;x.fillRect(a+6,b+14+i*14,10,6);x.strokeStyle=INK;x.lineWidth=.5;x.strokeRect(a+6,b+14+i*14,10,6);api.text(x,t,a+22,b+17.5+i*14,5.8,INK,'left')});
    x.fillStyle='#223328';x.fillRect(a+6,b+84,10,6);x.strokeRect(a+6,b+84,10,6);api.text(x,'Trees, thorn',a+22,b+87.5,5.8,INK,'left')}
}
mplInstall({name:'witchwood',levels:[520],draw:mpWwDraw,foot:'You are the yellow arrow. Press M to close the map.'});
if(typeof QAREA_ORDER!=='undefined'&&!QAREA_ORDER.includes('Blackbriar Wood'))QAREA_ORDER.splice(QAREA_ORDER.indexOf('Wenlock')+1,0,'Blackbriar Wood');
