/* ==========================================================================
   THE MAZE OF GARDENS, area map (level 490). One illuminated sheet drawn from the real level rows, fmap and decor: the hedges as inked masses in the colour of the real hedge pictures,
   the paths and courts in the colour of their ground, the garden pieces as the small painted pictures of the game itself (fountains, trees, statues, roses, the gazebo and the folly),
   numbered rooms listed in the right margin, a key on the left, the two gates, a compass. Names start with mpGm. No notes, no hints.
   ========================================================================== */
const MPGM={floor:['#b8644c','#e8dcb0','#bdb9ac','#a4c870','#aa9c7c','#ecc0c8'],ink:'#1c2a14'};
function mpGmDraw(c,x,L,api){
  const R=L.rows,W=R[0].length,H=R.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,PX=F.ox,PY=F.oy,PW=W*s,PH=H*s,INK=MPL.INK;
  const wall=(cx,cy)=>!(R[cy]&&R[cy][cx]==='.'),col=(cx,cy)=>{const g=L.chars[R[cy][cx]],q=GM.col&&GM.col[g];return q||[70,110,60]};
  // the page shows the plan on a soft shadow
  x.save();x.shadowColor='rgba(40,30,10,.5)';x.shadowBlur=14;x.shadowOffsetX=3;x.shadowOffsetY=5;x.fillStyle='#2a3a1c';x.fillRect(PX-1.6,PY-1.6,PW+3.2,PH+3.2);x.restore();
  x.save();x.beginPath();x.rect(PX,PY,PW,PH);x.clip();
  // the hedges: every wall square in the mean colour of its hedge, with a few leaf flecks
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!wall(cx,cy))continue;const k=col(cx,cy),v=hash2(cx,cy,5)*14-7;x.fillStyle=`rgb(${Math.max(0,k[0]*.78+v)|0},${Math.max(0,k[1]*.78+v)|0},${Math.max(0,k[2]*.76+v)|0})`;x.fillRect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2);
    if(hash2(cx,cy,6)<.35){x.fillStyle=`rgba(${Math.min(255,k[0]*1.25)|0},${Math.min(255,k[1]*1.25)|0},${Math.min(255,k[2]*1.15)|0},.7)`;x.beginPath();x.arc(X(cx)+hash2(cx,cy,7)*s,Y(cy)+hash2(cx,cy,8)*s,s*.28,0,6.3);x.fill()}}
  // the ground
  const fm=L.fmap;for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))continue;x.fillStyle=MPGM.floor[+fm[cy][cx]]||'#e8dcb0';x.fillRect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2)}
  // the edge of every hedge in ink
  x.strokeStyle=MPGM.ink;x.lineWidth=.55;x.lineCap='round';x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    if(wall(cx,cy-1)){x.moveTo(X0,Y0);x.lineTo(X0+s,Y0)}if(wall(cx,cy+1)){x.moveTo(X0,Y0+s);x.lineTo(X0+s,Y0+s)}if(wall(cx-1,cy)){x.moveTo(X0,Y0);x.lineTo(X0,Y0+s)}if(wall(cx+1,cy)){x.moveTo(X0+s,Y0);x.lineTo(X0+s,Y0+s)}}
  x.stroke();
  // the pieces: the painted pictures of the game, small, the tall behind the short
  const keep=/^gm_(fountain|apple|crab|cherry|lime|oak|willow|willow2|cypress|yew|laburnum|magnolia|knight|lady|saint|angel|obelisk|column|ruinarch|cross|pondrim|sundial|gazebo|folly|theatre|bowerseat|wisteriaw|well|rose_red|rose_white|rosetree|hydrangea|skep|herbbed|cabbages|pumpkins|sunflowers|tulips|arbour|birdbath|top_.*|lilytub|moongate)$/;
  const D=(typeof G!=='undefined'&&LEVEL===490&&G.decor&&G.decor.length?G.decor:L.decor).filter(d=>keep.test(d.k)&&IMG[d.k]).sort((a,b)=>a.y-b.y);
  for(const d of D){const im=IMG[d.k],hh=Math.max(3,Math.min(10,(NPC_H[d.k]||1)*s*(d.sc||1)*1.7)),ww=hh*im.width/im.height;x.drawImage(im,X(d.x+.5)-ww/2,Y(d.y+1)-hh+s*.2,ww,hh)}
  // the creatures' places are not marked: only the gates
  x.restore();
  // the far gate and the near gate
  const gx=X(45.5);x.save();x.fillStyle=MPL.GOLD;x.strokeStyle=INK;x.lineWidth=.8;
  for(const [yy,dir] of [[PY,-1],[PY+PH,1]]){x.beginPath();x.moveTo(gx-6,yy);x.lineTo(gx-6,yy+dir*4);x.lineTo(gx,yy+dir*8);x.lineTo(gx+6,yy+dir*4);x.lineTo(gx+6,yy);x.closePath();x.fill();x.stroke()}
  x.restore();
  api.text(x,'To Wenlock',gx,PY-9,7,'#6a1a0e');api.text(x,'Gate',gx,PY+PH+9,6.4,'#3a2a1c');
  // numbered rooms and the list of them
  const names=L.mapNames||[];const lst=names.slice().sort((a,b)=>a.y-b.y);
  names.forEach((n,i)=>{const px=X(n.x+.5),py=Y(n.y+.5);x.save();x.fillStyle='rgba(250,240,200,.92)';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(px,py,3.6,0,6.3);x.fill();x.stroke();x.restore();api.text(x,String(i+1),px,py+.2,5.4,INK)});
  api.title(x,'The Maze of Gardens','Hedges, courts and bowers',12,5);
  api.compass(x,50,262,15);
  // the list, right margin
  {const a=392,b=40,w=82,lh=10.4,h=14+names.length*lh;api.panel(x,a,b,w,h);api.text(x,'The Gardens',a+w/2,b+8,6.6,'#6a1a0e');
    names.forEach((n,i)=>{api.text(x,(i+1)+'  '+n.t.replace(/^The /,''),a+5,b+17+i*lh,5.6,INK,'left')})}
  // the key, left margin
  {const a=6,b=46,w=84,h=100;api.panel(x,a,b,w,h);api.text(x,'Key',a+w/2,b+8,6.6,'#6a1a0e');
    const rows=[['Hedge',()=>{x.fillStyle='#4c7a40';x.fillRect(a+6,b+16,10,6);x.strokeStyle=INK;x.lineWidth=.5;x.strokeRect(a+6,b+16,10,6)}],['Path',()=>{x.fillStyle=MPGM.floor[1];x.fillRect(a+6,b+30,10,6);x.strokeRect(a+6,b+30,10,6)}],['Lawn',()=>{x.fillStyle=MPGM.floor[3];x.fillRect(a+6,b+44,10,6);x.strokeRect(a+6,b+44,10,6)}],
      ['Flagstones',()=>{x.fillStyle=MPGM.floor[2];x.fillRect(a+6,b+58,10,6);x.strokeRect(a+6,b+58,10,6)}],['Brick',()=>{x.fillStyle=MPGM.floor[0];x.fillRect(a+6,b+72,10,6);x.strokeRect(a+6,b+72,10,6)}],['Petals',()=>{x.fillStyle=MPGM.floor[5];x.fillRect(a+6,b+86,10,6);x.strokeRect(a+6,b+86,10,6)}]];
    rows.forEach(([t,f],i)=>{f();api.text(x,t,a+22,b+19+i*14,6,INK,'left')})}
}
mplInstall({name:'gardens',levels:[490],draw:mpGmDraw,foot:'You are the yellow arrow. Press M to close the map.'});
