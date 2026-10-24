/* ==========================================================================
   THE QUEEN'S HIVE, its local map (prefix mpQh). The hive (level 474, the fourth of the beehive dungeons of the Hollow Grasslands) is a honeycomb of round wax chambers joined by short
   tunnels. The map is an illuminated plan drawn from the real rows, decor and torch lights: solid wax in honey brown with a lattice of cells, chambers floored in pale wax with a small
   hexagon tiling and a warm pool of light in each, a hand-inked edge with a soft shadow, the eggs, chests, jars and barrels where they stand, the lectern and its book in the Queen's
   Cell, and the way out. Names and a key only (no notes or hints). The creatures are not shown.
   ========================================================================== */
const MPQH_SEED=4747;
const mpQhH=(a,b,s)=>hash2(a,b,MPQH_SEED+(s||0));
/* a pointy-topped hexagon centred on (a,b), radius r, as a path on x */
function mpQhHexPath(x,a,b,r){x.beginPath();for(let k=0;k<6;k++){const an=Math.PI/6+k*Math.PI/3,px=a+Math.cos(an)*r,py=b+Math.sin(an)*r;k?x.lineTo(px,py):x.moveTo(px,py)}x.closePath()}
/* a lattice of hexagons over the rectangle A, each drawn by fn(a,b,col,row), anchored at the world origin so the pattern lines up from one layer to the next */
function mpQhLattice(A,r,fn){const w=Math.sqrt(3)*r,h=1.5*r;for(let row=Math.floor((A.y-r)/h);row<=Math.ceil((A.y+A.h+r)/h);row++){const off=(row&1)?w/2:0;for(let col=Math.floor((A.x-w)/w);col<=Math.ceil((A.x+A.w+w)/w);col++)fn(col*w+off,row*h,col,row)}}
/* a small egg: a pale oval with a faint highlight */
function mpQhEgg(x,a,b,k){k=k||1;x.save();x.fillStyle='#f6efdc';x.strokeStyle=MPL.INK;x.lineWidth=.38;x.beginPath();x.ellipse(a,b,1.15*k,1.5*k,0,0,6.283);x.fill();x.stroke();
  x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.ellipse(a-.35*k,b-.5*k,.3*k,.5*k,-.4,0,6.283);x.fill();x.restore()}
/* a chest seen from above: a coloured lid with a gold clasp (wax: amber, weed: green, jelly: rose) */
function mpQhChest(x,a,b,col,k){k=k||1;x.save();x.lineJoin='round';x.fillStyle=col;x.strokeStyle=MPL.INK;x.lineWidth=.55;x.fillRect(a-2.3*k,b-1.7*k,4.6*k,3.4*k);x.strokeRect(a-2.3*k,b-1.7*k,4.6*k,3.4*k);
  x.strokeStyle='rgba(42,26,12,.7)';x.lineWidth=.4;x.beginPath();x.moveTo(a-2.3*k,b-.3*k);x.lineTo(a+2.3*k,b-.3*k);x.stroke();
  x.fillStyle=MPL.GOLD2;x.fillRect(a-.5*k,b-.7*k,1*k,1.1*k);x.strokeStyle=MPL.INK;x.lineWidth=.3;x.strokeRect(a-.5*k,b-.7*k,1*k,1.1*k);x.restore()}
/* a clay jar and a wooden barrel, from above */
function mpQhJar(x,a,b,k){k=k||1;x.save();x.fillStyle='#b8743a';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.arc(a,b,1.9*k,0,6.283);x.fill();x.stroke();x.fillStyle='#3a2410';x.beginPath();x.arc(a,b,1.05*k,0,6.283);x.fill();x.restore()}
function mpQhBarrel(x,a,b,k){k=k||1;x.save();x.fillStyle='#9a6a34';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.arc(a,b,2.1*k,0,6.283);x.fill();x.stroke();
  x.strokeStyle='rgba(42,26,12,.8)';x.lineWidth=.4;x.beginPath();x.arc(a,b,1.3*k,0,6.283);x.stroke();x.fillStyle='rgba(255,230,170,.5)';x.beginPath();x.arc(a-.5*k,b-.5*k,.5*k,0,6.283);x.fill();x.restore()}
/* a lectern with an open book */
function mpQhLectern(x,a,b,k){k=k||1;x.save();x.lineJoin='round';x.fillStyle='#7a4a22';x.strokeStyle=MPL.INK;x.lineWidth=.55;x.beginPath();x.moveTo(a-2.4*k,b+2*k);x.lineTo(a-1.7*k,b-2*k);x.lineTo(a+1.7*k,b-2*k);x.lineTo(a+2.4*k,b+2*k);x.closePath();x.fill();x.stroke();
  x.fillStyle='#f4ead0';x.beginPath();x.moveTo(a-3*k,b-1.2*k);x.lineTo(a,b-2.4*k);x.lineTo(a+3*k,b-1.2*k);x.lineTo(a+3*k,b+.6*k);x.lineTo(a,b-.4*k);x.lineTo(a-3*k,b+.6*k);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(a,b-2.4*k);x.lineTo(a,b-.4*k);x.stroke();x.restore()}
/* a small gold crown */
function mpQhCrown(x,a,b,k){k=k||1;x.save();x.lineJoin='round';x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(a-4*k,b+2.2*k);x.lineTo(a-4.4*k,b-2.4*k);x.lineTo(a-2*k,b-.4*k);x.lineTo(a,b-3.2*k);x.lineTo(a+2*k,b-.4*k);x.lineTo(a+4.4*k,b-2.4*k);x.lineTo(a+4*k,b+2.2*k);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.VERM;x.beginPath();x.arc(a,b+.6*k,.9*k,0,6.283);x.fill();x.restore()}
/* a gold arch for the way out */
function mpQhDoor(x,a,b,k){k=k||1;x.save();x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.moveTo(a-2.4*k,b+2.4*k);x.lineTo(a-2.4*k,b-.6*k);x.quadraticCurveTo(a-2.4*k,b-3*k,a,b-3*k);x.quadraticCurveTo(a+2.4*k,b-3*k,a+2.4*k,b-.6*k);x.lineTo(a+2.4*k,b+2.4*k);x.closePath();x.fill();x.stroke();
  x.fillStyle='#3a2410';x.beginPath();x.moveTo(a-1.2*k,b+2.4*k);x.lineTo(a-1.2*k,b-.4*k);x.quadraticCurveTo(a-1.2*k,b-1.8*k,a,b-1.8*k);x.quadraticCurveTo(a+1.2*k,b-1.8*k,a+1.2*k,b-.4*k);x.lineTo(a+1.2*k,b+2.4*k);x.closePath();x.fill();x.restore()}

/* The edge of the chambers as smooth closed curves: the squares of the floor are walked round (their outer edges linked into loops), the corners are rounded off twice and every point is nudged a little,
   so the walls look drawn by a hand and not laid on a grid. Returns a list of loops of [x,y] grid corners (holes are loops too: fill them with the even-odd rule). */
function mpQhLoops(isF,W,H,wob){
  const key=(x,y)=>y*(W+1)+x,out=new Map(),edges=[];
  const add=(x0,y0,x1,y1)=>{const e={x0,y0,x1,y1,used:false};edges.push(e);const k=key(x0,y0);if(!out.has(k))out.set(k,[]);out.get(k).push(e)};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!isF(x,y))continue;
    if(!isF(x,y-1))add(x,y,x+1,y);if(!isF(x+1,y))add(x+1,y,x+1,y+1);if(!isF(x,y+1))add(x+1,y+1,x,y+1);if(!isF(x-1,y))add(x,y+1,x,y)}
  const loops=[];
  for(const e0 of edges){if(e0.used)continue;const pts=[];let e=e0;
    while(e&&!e.used){e.used=true;pts.push([e.x0,e.y0]);const nx=out.get(key(e.x1,e.y1))||[];let nxt=null;
      for(const c of nx){if(c.used)continue;const dx=e.x1-e.x0,dy=e.y1-e.y0,ex=c.x1-c.x0,ey=c.y1-c.y0;const turn=dx*ey-dy*ex;if(!nxt||turn>nxt.t)nxt={c,t:turn}} // at a pinch, keep to the same wall
      e=nxt?nxt.c:null}
    if(pts.length>=4)loops.push(pts)}
  return loops.map(p=>{
    let q=p.map(([x,y])=>[x+(wob(x,y,1)-.5)*.34,y+(wob(x,y,2)-.5)*.34]);
    for(let it=0;it<2;it++){const r=[];for(let i=0;i<q.length;i++){const a=q[i],b=q[(i+1)%q.length];r.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75])}q=r}
    return q})}

mplInstall({name:'queenshive',levels:[474],tint:[16,4,-22],foot:'You are the yellow arrow. The wax chambers of the Queen’s Hive.',
fit:L=>mplFit(L.rows[0].length,L.rows.length,6),
draw(c,x,L,api){
  const A=MPL.AREA,F=mplFit(L.rows[0].length,L.rows.length,6),S=F.s,X=F.X,Y=F.Y,W0=L.rows[0].length,H0=L.rows.length,H=mpQhH;
  const isF=(cx,cy)=>cx>=0&&cy>=0&&cx<W0&&cy<H0&&L.rows[cy][cx]!=='#';
  /* ---- the solid wax: honey brown with a lattice of cells over it ---- */
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  {const g=x.createLinearGradient(A.x,A.y,A.x+A.w,A.y+A.h);g.addColorStop(0,'#c6963e');g.addColorStop(.5,'#b4852f');g.addColorStop(1,'#9c7226');x.fillStyle=g;x.fillRect(A.x,A.y,A.w,A.h)}
  mpQhLattice(A,S*2.2,(a,b,col,row)=>{const v=H(col,row,1);if(v<.4){x.fillStyle=v<.2?'rgba(255,226,150,.13)':'rgba(70,38,6,.14)';mpQhHexPath(x,a,b,S*2.2*.94);x.fill()}});
  x.strokeStyle='rgba(70,40,8,.34)';x.lineWidth=.55;mpQhLattice(A,S*2.2,(a,b)=>{mpQhHexPath(x,a,b,S*2.2);x.stroke()});
  x.restore();
  /* ---- the chambers and tunnels: one path of every floor square ---- */
  const loops=mpQhLoops(isF,W0,H0,(gx,gy,k)=>H(gx,gy,20+k)),fp=new Path2D();
  for(const lp of loops){lp.forEach(([gx,gy],i)=>i?fp.lineTo(X(gx),Y(gy)):fp.moveTo(X(gx),Y(gy)));fp.closePath()}
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  x.save();x.shadowColor='rgba(40,20,0,.6)';x.shadowBlur=4.5;x.fillStyle='#ecd9a0';x.fill(fp,'evenodd');x.restore();       // soft shadow where the wax walls rise
  x.save();x.clip(fp,'evenodd');
  for(let cy=0;cy<H0;cy++)for(let cx=0;cx<W0;cx++){if(!isF(cx,cy))continue;const v=H(cx,cy,2);x.fillStyle=v<.5?`rgba(190,140,50,${.04+v*.12})`:`rgba(255,246,200,${.05+(v-.5)*.2})`;x.fillRect(X(cx),Y(cy),S,S)}
  for(const [lx,ly] of (L.lights||[])){const g=x.createRadialGradient(X(lx+.5),Y(ly+.5),0,X(lx+.5),Y(ly+.5),S*4.6);g.addColorStop(0,'rgba(255,238,160,.8)');g.addColorStop(.55,'rgba(255,224,130,.3)');g.addColorStop(1,'rgba(255,214,110,0)');x.fillStyle=g;x.fillRect(X(lx+.5)-S*5,Y(ly+.5)-S*5,S*10,S*10)}
  x.strokeStyle='rgba(150,100,28,.42)';x.lineWidth=.38;mpQhLattice(A,S*1.05,(a,b)=>{mpQhHexPath(x,a,b,S*1.05);x.stroke()});   // the little hexagons of the wax floor
  x.restore();
  /* ---- the edge of the wax, drawn by hand: a thick soft line and a thin ink line, a little wobbly ---- */
  for(const [col,lw] of [['rgba(60,32,6,.42)',1.9],['rgba(42,26,12,.92)',.85]]){x.strokeStyle=col;x.lineWidth=lw;x.lineJoin='round';x.stroke(fp)}
  x.restore();
  /* ---- what stands in the hive, from the level's own objects ---- */
  const dec=L.decor||[],cx0=d=>X(d.x+.5),cy0=d=>Y(d.y+.5);
  for(const d of dec)if(d.k==='hg_eggs')mpQhEgg(x,cx0(d)+(H(d.x,d.y,9)-.5)*S*.5,cy0(d)+(H(d.x,d.y,10)-.5)*S*.5,(d.sc||1)*(S/4.1)*1.2);
  for(const d of dec){const a=cx0(d),b=cy0(d),k=S/4.1;
    if(d.k==='hg_chestwax')mpQhChest(x,a,b,'#d89a2a',k);else if(d.k==='hg_chestweed')mpQhChest(x,a,b,'#5f9a4a',k);else if(d.k==='hg_chestjelly')mpQhChest(x,a,b,'#c8607a',k);
    else if(d.k==='hg_jar')mpQhJar(x,a,b,k);else if(d.k==='hg_waxbarrel')mpQhBarrel(x,a,b,k);else if(d.k==='hg_lectern')mpQhLectern(x,a,b,k*1.15)}
  /* the Queen's Cell: a crown over the chamber where the queen waits, and its name */
  const qe=(L.enemies||[]).find(e=>e.t==='hgboss4');
  if(qe){const a=X(qe.x+.5),b=Y(qe.y+.5);mpQhCrown(x,a,b-S*.2,S/4.1*1.15)}
  const nm=(L.mapNames||[])[1];if(nm)api.text(x,nm.t,Math.min(X(nm.x+.5),A.x+A.w-34),Math.max(A.y+8,Y(nm.y+.5)-6),6.4,'#1a1208'); // above the chamber, clear of the lectern
  /* the way out */
  {let dx=-1,dy=-1;for(let cy=0;cy<H0;cy++)for(let cx=0;cx<W0;cx++)if(/[^#.]/.test(L.rows[cy][cx])){dx=cx;dy=cy}
    if(dx>=0){mpQhDoor(x,X(dx+.5),Y(dy+.4),S/4.1*1.25);api.text(x,'Way out',X(dx+.5),Y(dy+1)+4.2,5.6,'#1a1208')}}
  /* ---- margins: title, key, compass ---- */
  api.title(x,'The Queen’s Hive','A hive of the Hollow Grasslands');
  api.panel(x,392,38,84,112);api.text(x,'KEY',434,47,7,MPL.VERM);
  const kx=402,ky=[58,70,82,94,106,118,130,142];
  x.save();x.fillStyle='#ecd9a0';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillRect(kx-5,ky[0]-3,10,6);x.strokeRect(kx-5,ky[0]-3,10,6);x.restore();api.text(x,'Chamber',kx+9,ky[0],5.6,'#2a1a0c','left');
  x.save();x.fillStyle='#b4852f';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillRect(kx-5,ky[1]-3,10,6);x.strokeRect(kx-5,ky[1]-3,10,6);x.restore();api.text(x,'Wax wall',kx+9,ky[1],5.6,'#2a1a0c','left');
  mpQhEgg(x,kx,ky[2],1);api.text(x,'Eggs',kx+9,ky[2],5.6,'#2a1a0c','left');
  mpQhChest(x,kx,ky[3],'#d89a2a',1);api.text(x,'Chest',kx+9,ky[3],5.6,'#2a1a0c','left');
  mpQhJar(x,kx-2.2,ky[4],.8);mpQhBarrel(x,kx+2.6,ky[4],.8);api.text(x,'Jar, barrel',kx+9,ky[4],5.6,'#2a1a0c','left');
  mpQhLectern(x,kx,ky[5],.9);api.text(x,'Lectern, book',kx+9,ky[5],5.6,'#2a1a0c','left');
  mpQhCrown(x,kx,ky[6],.8);api.text(x,'Queen’s Cell',kx+9,ky[6],5.6,'#2a1a0c','left');
  mpQhDoor(x,kx,ky[7]-.4,.8);api.text(x,'Way out',kx+9,ky[7],5.6,'#2a1a0c','left');
  api.compass(x,436,184,13);
}});
