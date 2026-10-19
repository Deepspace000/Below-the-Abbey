/* ==========================================================================
   AREA MAPS: IRONHILL MOOR (19), GREYFANG PASS (22) and the three small rooms off them (26 hermit's cave, 28 ruined watchtower, 27 old vault).
   Everything is drawn once from the real level data: the moor's heather, bracken, reeds, rocks, trees, tracks, standing stones and wolf trails; the pass's crags
   (from the walls and the heights), its snow, its winding trail (the same route as the red dashed line the game lays down) and its cairns and banners.
   ========================================================================== */
const mpMoorH=(a,b,s)=>hash2(a,b,s);
/* a wobbly closed blob path */
function mpMoorBlob(x,cx,cy,rx,ry,seed,n){n=n||18;x.beginPath();for(let i=0;i<=n;i++){const an=i/n*Math.PI*2,w=1+(mpMoorH(i%n,3,seed)-.5)*.34;const px=cx+Math.cos(an)*rx*w,py=cy+Math.sin(an)*ry*w;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath()}
/* a wolf's paw print at (a,b) pointing along angle an */
function mpMoorPaw(x,a,b,an,sz){x.save();x.translate(a,b);x.rotate(an);x.fillStyle='rgba(54,34,22,.7)';x.beginPath();x.ellipse(0,0,sz*.9,sz*.7,0,0,6.3);x.fill();for(const k of [-1,0,1]){x.beginPath();x.ellipse(sz*1.15,k*sz*.7,sz*.38,sz*.3,0,0,6.3);x.fill()}x.restore()}
/* a trail of paw prints, alternating left and right */
function mpMoorTrail(x,a,b,an,n,step,sz,ok){for(let i=0;i<n;i++){const side=(i%2?1:-1)*sz*.9,px=a+Math.cos(an)*i*step-Math.sin(an)*side,py=b+Math.sin(an)*i*step+Math.cos(an)*side;if(!ok||ok(px,py))mpMoorPaw(x,px,py,an,sz)}}
/* heather tuft, bracken frond, reed tuft, juniper, rock */
function mpMoorHeather(x,a,b,k){x.strokeStyle=k%2?'rgba(118,70,128,.85)':'rgba(146,84,120,.85)';x.lineWidth=.7;x.beginPath();x.moveTo(a-1.4,b);x.lineTo(a-1.8,b-2.2);x.moveTo(a,b);x.lineTo(a,b-2.8);x.moveTo(a+1.4,b);x.lineTo(a+1.8,b-2.2);x.stroke();x.fillStyle='rgba(150,80,150,.9)';x.fillRect(a-2.1,b-2.8,.9,.9);x.fillRect(a-.5,b-3.4,.9,.9);x.fillRect(a+1.2,b-2.8,.9,.9)}
function mpMoorBracken(x,a,b){x.strokeStyle='rgba(88,112,52,.85)';x.lineWidth=.6;x.beginPath();x.moveTo(a,b);x.lineTo(a,b-3);for(const d of [1,2]){x.moveTo(a,b-d);x.lineTo(a-1.9,b-d-1.2);x.moveTo(a,b-d);x.lineTo(a+1.9,b-d-1.2)}x.stroke()}
function mpMoorReed(x,a,b){x.strokeStyle='rgba(78,100,60,.9)';x.lineWidth=.6;x.beginPath();x.moveTo(a-1,b);x.lineTo(a-1.6,b-3.6);x.moveTo(a,b);x.lineTo(a,b-4.4);x.moveTo(a+1,b);x.lineTo(a+1.6,b-3.4);x.stroke();x.fillStyle='#6a4a28';x.fillRect(a-.4,b-5,.9,1.7)}
function mpMoorJuniper(x,a,b,r){x.fillStyle='rgba(54,84,60,.85)';x.strokeStyle='rgba(30,40,28,.8)';x.lineWidth=.5;x.beginPath();x.arc(a,b-r*.4,r,Math.PI,0);x.lineTo(a+r,b);x.lineTo(a-r,b);x.closePath();x.fill();x.stroke()}
function mpMoorRock(x,a,b,r,col){x.fillStyle=col||'rgba(150,144,132,.95)';x.strokeStyle='rgba(42,26,12,.85)';x.lineWidth=.6;x.beginPath();x.moveTo(a-r,b);x.lineTo(a-r*.7,b-r*.8);x.lineTo(a+r*.2,b-r);x.lineTo(a+r,b-r*.2);x.lineTo(a+r*.8,b);x.closePath();x.fill();x.stroke();x.strokeStyle='rgba(42,26,12,.5)';x.beginPath();x.moveTo(a-r*.1,b-r*.9);x.lineTo(a+r*.1,b-r*.1);x.stroke()}
/* a standing stone: an upright slab with a lit side */
function mpMoorStone(x,a,b,s){x.fillStyle='#a8a498';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-2*s,b);x.lineTo(a-1.6*s,b-7*s);x.lineTo(a-.2*s,b-8.4*s);x.lineTo(a+1.6*s,b-6.6*s);x.lineTo(a+2*s,b);x.closePath();x.fill();x.stroke();x.fillStyle='rgba(60,50,40,.35)';x.beginPath();x.moveTo(a+.4*s,b);x.lineTo(a+.2*s,b-7.6*s);x.lineTo(a+1.6*s,b-6.6*s);x.lineTo(a+2*s,b);x.closePath();x.fill();x.strokeStyle='rgba(30,50,30,.7)';x.beginPath();x.moveTo(a-2.4*s,b+.3);x.lineTo(a+2.6*s,b+.3);x.stroke()}
/* an arched cave mouth in a little rock mound */
function mpMoorCave(x,a,b,s){mpMoorRock(x,a,b+1*s,5*s,'#a39c8c');x.fillStyle='#2a1a0c';x.beginPath();x.arc(a,b,2*s,Math.PI,0);x.lineTo(a+2*s,b+1*s);x.lineTo(a-2*s,b+1*s);x.closePath();x.fill()}
/* a pennant on a pole */
function mpMoorBanner(x,a,b,s){x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a,b+1.5*s);x.lineTo(a,b-7*s);x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(a,b-7*s);x.lineTo(a+4.6*s,b-5.6*s);x.lineTo(a,b-4*s);x.closePath();x.fill();x.stroke()}
/* a cairn: three stacked stones */
function mpMoorCairn(x,a,b,s){for(const [dx,dy,r] of [[-1.2,0,1.8],[1.2,0,1.6],[0,-1.8,1.4]])mpMoorRock(x,a+dx*s,b+dy*s,r*s,'#b4ac9a')}
/* a little lantern mark */
function mpMoorLamp(x,a,b){x.fillStyle=MPL.GOLD2;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.arc(a,b,1.7,0,6.3);x.fill();x.stroke()}
/* a wobbly hand-drawn edge round the whole map, used to clip the land */
function mpMoorEdge(x,f,W,H,seed){const pts=[],n=2.2;for(let i=0;i<=W;i+=n)pts.push([i,0]);for(let j=0;j<=H;j+=n)pts.push([W,j]);for(let i=W;i>=0;i-=n)pts.push([i,H]);for(let j=H;j>=0;j-=n)pts.push([0,j]);
  x.beginPath();pts.forEach(([a,b],i)=>{const jx=(mpMoorH(i,1,seed)-.5)*.9*(a>0&&a<W?0:1)+(mpMoorH(i,2,seed)-.5)*.1,jy=(mpMoorH(i,3,seed)-.5)*.9*(b>0&&b<H?0:1);const px=f.X(a+(a===0?.4:a===W?-.4:0)+(b===0||b===H?0:jx)),py=f.Y(b+(b===0?.4:b===H?-.4:0)+(a===0||a===W?0:jy));i?x.lineTo(px,py):x.moveTo(px,py)});x.closePath()}
/* the key panel: rows of (icon drawer, label) */
function mpMoorKey(x,a,b,w,rows){const h=rows.length*12+13;mplPanel(x,a,b,w,h);mplText(x,'KEY',a+w/2,b+8,6.4,MPL.VERM);rows.forEach(([fn,t],i)=>{const yy=b+20+i*12;fn(x,a+12,yy);mplText(x,t,a+24,yy,6.4,'#3a2a1c','left')});return b+h}
/* notes panel */
function mpMoorNotes(x,a,b,w,notes){let e=b+4;const lines=notes.map(n=>mplWrap(x,n,w-10,6.4));const h=lines.reduce((s,l)=>s+l.length*8.8+5,0)+6;mplPanel(x,a,b,w,h);let yy=b+10;for(const l of lines){for(const t of l){mplText(x,t,a+5,yy,6.4,'#3a2a1c','left');yy+=8.8}yy+=5}return b+h}
/* an illuminated flourish rule */
function mpMoorRule(x,a,b,w){x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.moveTo(a,b);x.lineTo(a+w,b);x.stroke();x.fillStyle=MPL.VERM;x.save();x.translate(a+w/2,b);x.rotate(Math.PI/4);x.fillRect(-2,-2,4,4);x.restore()}

/* ---------------------------------------------------- IRONHILL MOOR ---------------------------------------------------- */
function mpMoorDrawMoor(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=mplFit(W,H),X=f.X,Y=f.Y,s=f.s,rows=L.rows,open=(i,j)=>i>=0&&j>=0&&i<W&&j<H&&rows[j][i]!=='T';
  const isOpen=(i,j)=>i>=0&&j>=0&&i<W&&j<H&&rows[j][i]!=='T';
  // the land: a wash of cold moor-brown inside a wobbly edge
  x.save();mpMoorEdge(x,f,W,H,11);x.fillStyle='rgba(168,150,118,.55)';x.fill();x.restore();
  x.save();mpMoorEdge(x,f,W,H,11);x.clip();
  // heather (purple) and bog (olive) washes in big soft patches over the open ground
  const blobs=[];for(let i=0;i<70;i++){const bx=3+mpMoorH(i,1,21)*(W-6),by=3+mpMoorH(i,2,21)*(H-6);if(isOpen(bx|0,by|0))blobs.push([bx,by,2.5+mpMoorH(i,3,21)*5,1.6+mpMoorH(i,4,21)*3.4,i%3===0?'bog':'heath'])}
  for(const [bx,by,rx,ry,k] of blobs){for(let r=0;r<3;r++){x.fillStyle=k==='bog'?'rgba(92,104,58,.1)':'rgba(124,84,128,.1)';mpMoorBlob(x,X(bx),Y(by),rx*s*(1-r*.22),ry*s*(1-r*.22),r+bx|0,16);x.fill()}}
  // the forest edge: deep green wash on the tree walls
  x.fillStyle='rgba(60,92,64,.4)';for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(rows[j][i]==='T'){x.beginPath();x.arc(X(i+.5),Y(j+.5),s*.78,0,6.3);x.fill()}
  // the tarn: a lapis-grey pool with ripples and a ring of reeds
  const TX=19,TY=28.4,trx=4.6*s,try_=2.8*s;
  mpMoorBlob(x,X(TX),Y(TY),trx*1.12,try_*1.18,5,20);x.fillStyle='rgba(98,112,64,.5)';x.fill();
  mpMoorBlob(x,X(TX),Y(TY),trx,try_,6,20);x.fillStyle='#7fa0b2';x.fill();x.strokeStyle=MPL.INK;x.lineWidth=1;x.stroke();
  mpMoorBlob(x,X(TX)-1.5,Y(TY)-1,trx*.7,try_*.62,7,18);x.fillStyle='rgba(60,100,140,.55)';x.fill();
  x.strokeStyle='rgba(235,245,250,.8)';x.lineWidth=.6;for(let i=0;i<9;i++){const a=X(TX)+(mpMoorH(i,1,31)-.5)*trx*1.4,b=Y(TY)+(mpMoorH(i,2,31)-.5)*try_*1.2;x.beginPath();x.moveTo(a-3,b);x.quadraticCurveTo(a-1.5,b-1.4,a,b);x.quadraticCurveTo(a+1.5,b+1.4,a+3,b);x.stroke()}
  for(let i=0;i<14;i++){const an=i/14*6.28+.2;mpMoorReed(x,X(TX)+Math.cos(an)*trx*1.05,Y(TY)+Math.sin(an)*try_*1.1)}
  // bog pools: little muddy ponds with reeds where the reeds are thickest
  for(const [bx,by,r] of [[28,12,1.4],[8,33,1.6],[46,8,1.1],[26,33,1.3],[50,35,1.2]]){mpMoorBlob(x,X(bx),Y(by),r*s*1.4,r*s*.8,bx,12);x.fillStyle='rgba(110,130,130,.8)';x.fill();x.strokeStyle='rgba(40,50,40,.8)';x.lineWidth=.7;x.stroke();for(let k=0;k<4;k++)mpMoorReed(x,X(bx)+(k-1.5)*r*s*.7,Y(by)+r*s*.5)}
  // dirt tracks: an inked edge, then dirt, from the real floor map
  const fm=L.fmap,dirt=(i,j)=>i>=0&&j>=0&&i<W&&j<H&&fm[j][i]==='1';
  for(const pass of [0,1]){x.fillStyle=pass?'rgba(176,138,92,.95)':'rgba(70,46,24,.85)';const rr=s*(pass?.8:.98);for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(dirt(i,j)){const wx=(mpMoorH(i,j,13)-.5)*.5,wy=(mpMoorH(i,j,14)-.5)*.5;x.beginPath();x.arc(X(i+.5+wx*.3),Y(j+.5+wy*.3),rr,0,6.3);x.fill()}}
  x.strokeStyle='rgba(110,78,44,.7)';x.lineWidth=.5;for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(dirt(i,j)&&mpMoorH(i,j,15)<.4){const a=X(i+.2+mpMoorH(i,j,16)*.6),b=Y(j+.2+mpMoorH(i,j,17)*.6);x.beginPath();x.moveTo(a,b);x.lineTo(a+2.2,b+.6);x.stroke()}
  // ground marks from the real decor
  const dec=L.decor||[],kinds={};for(const d of dec)(kinds[d.k]=kinds[d.k]||[]).push(d);
  const inTarn=(a,b)=>((a-X(TX))/(trx*1.1))**2+((b-Y(TY))/(try_*1.15))**2<1;
  (kinds.pbracken||[]).forEach((d,i)=>{const a=X(d.x+.5+(d.ox||0)),b=Y(d.y+.5+(d.oy||0));if(!inTarn(a,b)&&i%2===0)mpMoorBracken(x,a,b)});
  (kinds.pheather||[]).forEach((d,i)=>{const a=X(d.x+.5+(d.ox||0)),b=Y(d.y+.5+(d.oy||0));if(!inTarn(a,b))mpMoorHeather(x,a,b,i)});
  (kinds.greeds||[]).forEach(d=>{const a=X(d.x+.5+(d.ox||0)),b=Y(d.y+.5+(d.oy||0));if(!inTarn(a,b))mpMoorReed(x,a,b)});
  (kinds.pjuniper||[]).concat(kinds.pjuniper_1||[]).forEach((d,i)=>{if(i%2)return;mpMoorJuniper(x,X(d.x+.5+(d.ox||0)),Y(d.y+.5+(d.oy||0)),1.4+mpMoorH(i,1,23)*1.2)});
  (kinds.grocks||[]).forEach((d,i)=>{if(i%2)return;mpMoorRock(x,X(d.x+.5+(d.ox||0)),Y(d.y+.5+(d.oy||0)),1.5+mpMoorH(i,2,24)*1.1)});
  (kinds.gboulder||[]).forEach((d,i)=>mpMoorRock(x,X(d.x+.5+(d.ox||0)),Y(d.y+.5+(d.oy||0)),2.6+mpMoorH(i,3,25)*1.6,'#9c978a'));
  // wolf tracks: from each wolf's spot, a trail of prints wandering off
  (L.enemies||[]).forEach((e,i)=>{if(e.t!=='wolf')return;const an=mpMoorH(i,1,51)*6.28;mpMoorTrail(x,X(e.x+.5),Y(e.y+.5),an,7,6,2.1,(a,b)=>{const ci=Math.floor((a-f.ox)/s),cj=Math.floor((b-f.oy)/s);return isOpen(ci,cj)&&!dirt(ci,cj)&&!inTarn(a,b)})});
  // trees: the walls of forest round the edge (pines) and the odd tree on the moor; drawn back to front
  const trees=[];for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(rows[j][i]==='T'&&mpMoorH(i,j,61)<.62)trees.push([X(i+.5+(mpMoorH(i,j,62)-.5)*.8),Y(j+.7+(mpMoorH(i,j,63)-.5)*.6),'p',.62+mpMoorH(i,j,64)*.3]);
  for(const d of dec)if(/^gtree/.test(d.k))trees.push([X(d.x+.5+(d.ox||0)),Y(d.y+.8+(d.oy||0)),'t',.6+(d.sc||1)*.18]);
  trees.sort((a,b)=>a[1]-b[1]);for(const [a,b,k,sc] of trees){if(k==='p')MPLI.pine(x,a,b,sc);else MPLI.tree(x,a,b,sc,'#4f7a48')}
  x.restore();
  // the wobbly outline of the moor
  x.save();mpMoorEdge(x,f,W,H,11);x.strokeStyle=MPL.INK;x.lineWidth=1.3;x.stroke();x.restore();
  // landmarks from the real level
  const stones=(kinds.gstone||[]);if(stones.length){const cx=stones.reduce((s,d)=>s+d.x,0)/stones.length+.5,cy=stones.reduce((s,d)=>s+d.y,0)/stones.length+.5;
    x.strokeStyle='rgba(70,50,30,.5)';x.lineWidth=.7;x.setLineDash([1.5,2]);x.beginPath();x.ellipse(X(cx),Y(cy),s*5.6,s*5.6,0,0,6.3);x.stroke();x.setLineDash([]);
    stones.slice().sort((a,b)=>a.y-b.y).forEach(d=>mpMoorStone(x,X(d.x+.5),Y(d.y+.9),.7));mplText(x,'Standing Stones',X(cx),Y(cy+6.4),6.4,MPL.INK)}
  const st=(kinds.statue||[]);if(st.length){st.forEach(d=>{x.fillStyle='#cfc8b4';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillRect(X(d.x+.5)-1.3,Y(d.y+.9)-5,2.6,5);x.strokeRect(X(d.x+.5)-1.3,Y(d.y+.9)-5,2.6,5);x.beginPath();x.arc(X(d.x+.5),Y(d.y+.9)-6,1.5,0,6.3);x.fill();x.stroke()});mplText(x,'Old Statues',X(46.5),Y(32),6.4,MPL.INK)}
  const cart=(kinds.cart||[])[0];if(cart){const a=X(cart.x+.5),b=Y(cart.y+.6);x.fillStyle='#8a6a3c';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillRect(a-3.4,b-3,6.8,3);x.strokeRect(a-3.4,b-3,6.8,3);x.beginPath();x.arc(a-1.8,b,1.5,0,6.3);x.stroke();x.beginPath();x.arc(a+2.4,b,1.5,0,6.3);x.stroke();MPLI.skull(x,a+5.5,b-.5,.55);mplText(x,'Wrecked Cart',a-8,b+7,6.4,MPL.INK)}
  for(const d of kinds.lamp||[])mpMoorLamp(x,X(d.x+.5),Y(d.y+.5));
  // the farmer's cottage near the second peasant
  const pe=(kinds.peasantM||[]).find(d=>d.x<20);if(pe){MPLI.house(x,X(pe.x+.5),Y(pe.y+.6),.62,MPL.VERM);mplText(x,'Eadric',X(pe.x+.5)-6,Y(pe.y+2.9),6.2,MPL.INK)}
  // the cave, the watchtower and the gates
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const ch=rows[j][i];if(ch==='3'){mpMoorCave(x,X(i+.5),Y(j+.9),1.05);mplText(x,"Hermit's Cave",X(i+.5),Y(j+3.4),6.4,MPL.INK)}
    if(ch==='4'){MPLI.tower(x,X(i+.5),Y(j+.6),.9);mplText(x,'Ruined Watchtower',X(i+.5),Y(j-2.6),6.4,MPL.INK)}}
  // the two gates: west to Ironhill, east to the pass
  const gate=(gx,gy,dir,t)=>{const a=X(gx+.5),b=Y(gy+.5);x.fillStyle='#b8aa8a';x.strokeStyle=MPL.INK;x.lineWidth=.9;for(const o of [-1,1]){x.fillRect(a-3,b+o*5-3,6,6);x.strokeRect(a-3,b+o*5-3,6,6)}x.strokeStyle=MPL.GOLD;x.lineWidth=1.5;x.beginPath();x.moveTo(a-3,b-5);x.lineTo(a+3,b-5);x.moveTo(a-3,b+5);x.lineTo(a+3,b+5);x.stroke();
    x.strokeStyle=MPL.VERM;x.fillStyle=MPL.VERM;x.lineWidth=1.4;const ax=a+dir*10;x.beginPath();x.moveTo(a+dir*5,b);x.lineTo(ax,b);x.stroke();x.beginPath();x.moveTo(ax+dir*3,b);x.lineTo(ax-dir*1,b-3);x.lineTo(ax-dir*1,b+3);x.closePath();x.fill()};
  gate(0,20,-1);gate(61,21,1);
  mplText(x,'To Ironhill',X(1.5),Y(17.2),6.6,MPL.VERM,'left');mplText(x,'To Greyfang Pass',X(60),Y(24.2),6.6,MPL.VERM,'right');
  mplText(x,'The Reedy Tarn',X(TX),Y(TY+4.4),6.4,'#274a6a');
  // flourishes: birds over the moor
  x.strokeStyle=MPL.INK;x.lineWidth=.8;for(const [bx,by] of [[40,13],[43,15],[38,15.5]]){const a=X(bx),b=Y(by);x.beginPath();x.moveTo(a-3,b);x.quadraticCurveTo(a-1.5,b-2.4,a,b);x.quadraticCurveTo(a+1.5,b-2.4,a+3,b);x.stroke()}
  // margins
  api.title(x,'Ironhill Moor','Wolf-haunted open moorland');
  let yy=mpMoorKey(x,6,52,80,[[(x,a,b)=>mpMoorHeather(x,a,b+2,0),'Heather'],[(x,a,b)=>mpMoorBracken(x,a,b+2),'Bracken'],[(x,a,b)=>mpMoorReed(x,a,b+3),'Reeds and bog'],[(x,a,b)=>{x.strokeStyle='rgba(176,138,92,1)';x.lineWidth=3.4;x.beginPath();x.moveTo(a-6,b);x.lineTo(a+6,b);x.stroke()},'Dirt track'],[(x,a,b)=>mpMoorStone(x,a,b+4,.6),'Standing stone'],[(x,a,b)=>mpMoorTrail(x,a-4,b,0,3,4,1.1),'Wolf tracks'],[(x,a,b)=>MPLI.pine(x,a,b+4,.6),'Pine forest']]);
  mpMoorNotes(x,6,yy+6,80,['Wolves roam the open ground. Their tracks lead off from where they hunt.','The track from Ironhill runs east across the moor to the pass.']);
  mpMoorRule(x,396,48,76);
  const nb=mpMoorNotes(x,394,56,84,['A ring of seven standing stones stands in the middle of the moor.','The Hermit lives in a cave at the north edge. A ruined watchtower stands at the south edge.','Farmer Eadric keeps a cottage in the west.']);
  api.compass(x,436,262,15);
}

/* ---------------------------------------------------- GREYFANG PASS ---------------------------------------------------- */
function mpMoorDrawPass(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=mplFit(W,H),X=f.X,Y=f.Y,s=f.s,rows=L.rows,alt=L.alt,fm=L.fmap;
  const rock=(i,j)=>i<0||j<0||i>=W||j>=H||rows[j][i]==='#',A=(i,j)=>alt?alt[j].charCodeAt(i)-48:0;
  let amax=1;for(let j=0;j<H;j+=2)for(let i=0;i<W;i+=2)amax=Math.max(amax,A(i,j));
  // the open ground: a cold grey-green wash
  x.save();mpMoorEdge(x,f,W,H,12);x.fillStyle='rgba(176,178,150,.9)';x.fill();x.clip();
  for(let i=0;i<60;i++){const bx=mpMoorH(i,1,71)*W,by=mpMoorH(i,2,71)*H;if(!rock(bx|0,by|0)){x.fillStyle=i%3?'rgba(120,140,100,.12)':'rgba(120,100,130,.1)';mpMoorBlob(x,X(bx),Y(by),(3+mpMoorH(i,3,71)*8)*s,(2+mpMoorH(i,4,71)*5)*s,i,14);x.fill()}}
  // loose dirt patches
  x.fillStyle='rgba(150,124,90,.22)';for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(fm[j][i]==='1'&&!rock(i,j)){x.beginPath();x.arc(X(i+.5),Y(j+.5),s*.7,0,6.3);x.fill()}
  // the crags: every wall square is stone, shaded by its height; the highest are snow
  const hi=[];
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(rows[j][i]==='#'){const t=A(i,j)/amax,r=s*(.78+mpMoorH(i,j,81)*.14);
    const g=Math.round(168-t*62);x.fillStyle=`rgb(${g+6},${g-2},${g-16})`;x.beginPath();x.arc(X(i+.5)+(mpMoorH(i,j,82)-.5)*s*.5,Y(j+.5)+(mpMoorH(i,j,83)-.5)*s*.5,r,0,6.3);x.fill();if(t>.6)hi.push([i,j,t])}
  for(const [i,j,t] of hi){x.fillStyle=`rgba(244,246,244,${Math.min(.85,(t-.5)*1.8)})`;x.beginPath();x.arc(X(i+.5)+(mpMoorH(i,j,84)-.5)*s*.6,Y(j+.5)+(mpMoorH(i,j,85)-.5)*s*.6,s*(.5+mpMoorH(i,j,86)*.5),0,6.3);x.fill()}
  // hatching on the crags: short strokes down the shadow side
  x.lineWidth=.6;for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(rows[j][i]==='#'&&mpMoorH(i,j,87)<.55){const a=X(i+.2+mpMoorH(i,j,88)*.6),b=Y(j+.1+mpMoorH(i,j,89)*.5),l=s*(.7+mpMoorH(i,j,90)*.9);x.strokeStyle=`rgba(50,38,28,${.18+A(i,j)/amax*.22})`;x.beginPath();x.moveTo(a,b);x.lineTo(a-l*.5,b+l);x.stroke()}
  // the cliff edge: an inked line wherever stone meets open ground
  x.strokeStyle='rgba(42,26,12,.9)';x.lineWidth=1;x.lineCap='round';
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(rows[j][i]==='#'){const ed=[[0,-1,0,0,1,0],[0,1,0,1,1,1],[-1,0,0,0,0,1],[1,0,1,0,1,1]];for(const [dx,dy,a1,b1,a2,b2] of ed)if(i+dx>=0&&j+dy>=0&&i+dx<W&&j+dy<H&&rows[j+dy][i+dx]!=='#'){const w1=(mpMoorH(i,j,91+a1)-.5)*.5,w2=(mpMoorH(i,j,95+b1)-.5)*.5;x.beginPath();x.moveTo(X(i+a1+w1*(dx?0:1)),Y(j+b1+w1*(dy?0:1)));x.lineTo(X(i+a2+w2*(dx?0:1)),Y(j+b2+w2*(dy?0:1)));x.stroke()}}
  x.lineCap='butt';
  // ground marks on the open ground: scree, heather, juniper, bracken
  const dec=L.decor||[],kinds={};for(const d of dec)(kinds[d.k]=kinds[d.k]||[]).push(d);const P=d=>[X(d.x+.5+(d.ox||0)),Y(d.y+.5+(d.oy||0))];
  x.fillStyle='rgba(90,84,74,.6)';for(const k of ['rocks','grocks','boulder','gboulder','mossstone']){(kinds[k]||[]).forEach((d,i)=>{if(rock(d.x,d.y)||i%3)return;const [a,b]=P(d);x.fillRect(a-.6,b-.4,1.4,1);if(i%9===0)mpMoorRock(x,a,b,1.4,'#a8a396')})}
  (kinds.pheather||[]).forEach((d,i)=>{if(i%2)return;const [a,b]=P(d);mpMoorHeather(x,a,b,i)});
  (kinds.pbracken||[]).forEach((d,i)=>{if(i%2)return;const [a,b]=P(d);mpMoorBracken(x,a,b)});
  (kinds.pjuniper||[]).concat(kinds.pjuniper_1||[]).forEach((d,i)=>{if(i%3)return;const [a,b]=P(d);mpMoorJuniper(x,a,b,1.2)});
  // peaks: mountain icons on the high walls, back to front
  const pk=[];for(let j=2;j<H-2;j+=1)for(let i=2;i<W-2;i+=1)if(rows[j][i]==='#'&&mpMoorH(i,j,101)<.075&&rock(i-1,j)&&rock(i+1,j)&&rock(i,j+1)&&rock(i,j-1)&&A(i,j)/amax>.15)pk.push([X(i+.5),Y(j+.9),.5+A(i,j)/amax*.6]);
  pk.sort((a,b)=>a[1]-b[1]);for(const [a,b,sc] of pk)MPLI.mountain(x,a,b,sc);
  // the winding trail: the real route, smoothed, dirt with an inked edge, and the dashed red line on top
  const R=typeof PASS_ROUTE!=='undefined'&&PASS_ROUTE?PASS_ROUTE.path:null;
  if(R){const pts=[];for(let i=0;i<R.length;i+=3)pts.push([X(R[i][0]+.5),Y(R[i][1]+.5)]);pts.push([X(R[R.length-1][0]+.5),Y(R[R.length-1][1]+.5)]);
    const trace=()=>{x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length-1;i++){const mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2;x.quadraticCurveTo(pts[i][0],pts[i][1],mx,my)}x.lineTo(pts[pts.length-1][0],pts[pts.length-1][1])};
    x.lineCap='round';x.lineJoin='round';x.strokeStyle='rgba(60,40,22,.9)';x.lineWidth=5.4;trace();x.stroke();x.strokeStyle='#c8a470';x.lineWidth=3.8;trace();x.stroke();
    x.strokeStyle='rgba(120,84,48,.55)';x.lineWidth=.6;x.setLineDash([1,3]);trace();x.stroke();
    x.strokeStyle=MPL.VERM;x.lineWidth=1.3;x.setLineDash([4,3]);trace();x.stroke();x.setLineDash([]);x.lineCap='butt'}
  // cairns, banners, graves, wrecks and chests from the real decor
  for(const d of kinds.cairn||[]){const [a,b]=P(d);mpMoorCairn(x,a,b+1,.6)}
  for(const d of kinds.banner||[]){const [a,b]=P(d);mpMoorBanner(x,a,b+1,.75)}
  for(const d of kinds.cross||[]){const [a,b]=P(d);x.fillStyle='rgba(225,220,205,.9)';x.beginPath();x.arc(a,b-1,4,0,6.3);x.fill();MPLI.cross(x,a,b,.8)}
  for(const d of kinds.bones||[]){const [a,b]=P(d);MPLI.skull(x,a,b,.5)}
  for(const d of kinds.chest||[]){const [a,b]=P(d);x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-1.8,b-1.6,3.6,2.6);x.strokeRect(a-1.8,b-1.6,3.6,2.6)}
  const cart=(kinds.cart||[])[0];if(cart){const [a,b]=P(cart);x.fillStyle='#8a6a3c';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-3,b-2.6,6,2.6);x.strokeRect(a-3,b-2.6,6,2.6);x.beginPath();x.arc(a-1.6,b,1.3,0,6.3);x.stroke();x.beginPath();x.arc(a+2,b,1.3,0,6.3);x.stroke();mplText(x,'Wrecked Cart',a,b+7,6,MPL.INK)}
  // wolf tracks beside the way
  (L.enemies||[]).forEach((e,i)=>{if(e.t!=='wolf')return;const an=mpMoorH(i,1,111)*6.28;mpMoorTrail(x,X(e.x+.5),Y(e.y+.5),an,6,5,1.8,(a,b)=>!rock(Math.floor((a-f.ox)/s),Math.floor((b-f.oy)/s)))});
  x.restore();
  x.save();mpMoorEdge(x,f,W,H,12);x.strokeStyle=MPL.INK;x.lineWidth=1.3;x.stroke();x.restore();
  // the gates and the vault
  const sp=L.start,wg=[X(sp.x+.5),Y(sp.y+.5)];
  x.fillStyle='#b8aa8a';x.strokeStyle=MPL.INK;x.lineWidth=.9;for(const o of [-1,1]){x.fillRect(wg[0]-3.4,wg[1]+o*6-3,6.8,6);x.strokeRect(wg[0]-3.4,wg[1]+o*6-3,6.8,6)}
  mplText(x,'Moor Gate',wg[0]+2,wg[1]+14,6.6,MPL.VERM,'left');
  const vg=PASS_ROUTE?PASS_ROUTE.goal:[93,41],vx=X(vg[0]+.5),vy=Y(vg[1]+.5);
  MPLI.castle(x,vx,vy-1,.75);mpMoorCave(x,vx,vy+4,.7);mplText(x,'The Old Vault',vx,vy-17,6.8,MPL.VERM);
  mplText(x,'Greyfang Pass',X(62),Y(6.5),8.4,MPL.INK);
  // the heights, named plainly
  mplText(x,'High crags and snow',X(88),Y(23),6.2,'#4a4a52');
  // flourishes: a bird above the peaks
  x.strokeStyle=MPL.INK;x.lineWidth=.8;for(const [bx,by] of [[30,3],[33,5],[27,5.5]]){const a=X(bx),b=Y(by);x.beginPath();x.moveTo(a-3,b);x.quadraticCurveTo(a-1.5,b-2.4,a,b);x.quadraticCurveTo(a+1.5,b-2.4,a+3,b);x.stroke()}
  api.title(x,'Greyfang Pass','A high mountain pass');
  let yy=mpMoorKey(x,6,52,80,[[(x,a,b)=>{x.strokeStyle='rgba(60,40,22,.9)';x.lineWidth=5;x.beginPath();x.moveTo(a-6,b);x.lineTo(a+6,b);x.stroke();x.strokeStyle='#c8a470';x.lineWidth=3.4;x.stroke();x.strokeStyle=MPL.VERM;x.lineWidth=1.2;x.setLineDash([3,2]);x.stroke();x.setLineDash([])},'The way through'],[(x,a,b)=>MPLI.mountain(x,a,b+4,.7),'Crags and snow'],[(x,a,b)=>mpMoorCairn(x,a,b+3,.6),'Cairn'],[(x,a,b)=>mpMoorBanner(x,a-2,b+3,.6),'Banner'],[(x,a,b)=>MPLI.skull(x,a,b+1,.6),'Bones'],[(x,a,b)=>mpMoorTrail(x,a-4,b,0,3,4,1.1),'Wolf tracks'],[(x,a,b)=>mpMoorHeather(x,a,b+2,0),'Heather']]);
  mpMoorNotes(x,6,yy+6,80,['Follow the red dashed line. It is the clear way through the crags.','Wolves hunt the west end.']);
  mpMoorRule(x,396,48,76);
  mpMoorNotes(x,394,56,84,['The trail is two squares wide, with a cairn every dozen squares.','Banners stand beside the road.','The Old Vault door is in the rock at the far east end.']);
  api.compass(x,436,262,15);
}

/* ---------------------------------------------------- THE SMALL ROOMS ---------------------------------------------------- */
function mpMoorDrawRoom(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=mplFit(W,H,10),s=Math.min(f.s,26),ox=f.ox+(f.s*W-s*W)/2,oy=f.oy+(f.s*H-s*H)/2,X=i=>ox+i*s,Y=j=>oy+j*s,rows=L.rows;
  const wall=(i,j)=>i<0||j<0||i>=W||j>=H||rows[j][i]==='#';
  // flagstones
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(rows[j][i]!=='#'){x.fillStyle=(i+j)%2?'#d6cbae':'#cfc3a4';x.fillRect(X(i),Y(j),s+.5,s+.5);x.strokeStyle='rgba(90,70,44,.5)';x.lineWidth=.6;x.strokeRect(X(i)+.5,Y(j)+.5,s-1,s-1);
    x.strokeStyle='rgba(90,70,44,.35)';x.beginPath();for(let k=0;k<3;k++){const a=X(i)+mpMoorH(i,j,120+k)*s*.8,b=Y(j)+mpMoorH(i,j,130+k)*s*.8;x.moveTo(a,b);x.lineTo(a+s*.15,b+s*.1)}x.stroke()}
  // walls: thick stone with brick courses
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(rows[j][i]==='#'){let near=false;for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++)if(!wall(i+di,j+dj))near=true;if(!near)continue;
    x.fillStyle='#8a7c66';x.fillRect(X(i),Y(j),s+.5,s+.5);x.strokeStyle='rgba(42,26,12,.7)';x.lineWidth=.7;for(let k=1;k<4;k++){const yy=Y(j)+k*s/4;x.beginPath();x.moveTo(X(i),yy);x.lineTo(X(i)+s,yy);x.stroke();const off=k%2?s*.3:s*.7;x.beginPath();x.moveTo(X(i)+off,yy-s/4);x.lineTo(X(i)+off,yy);x.stroke()}}
  x.strokeStyle=MPL.INK;x.lineWidth=1.6;for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(rows[j][i]==='#')for(const [dx,dy,a1,b1,a2,b2] of [[0,-1,0,0,1,0],[0,1,0,1,1,1],[-1,0,0,0,0,1],[1,0,1,0,1,1]])if(!wall(i+dx,j+dy)){x.beginPath();x.moveTo(X(i+a1),Y(j+b1));x.lineTo(X(i+a2),Y(j+b2));x.stroke()}
  // the door
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(rows[j][i]==='0'){x.fillStyle='#5a3a1c';x.fillRect(X(i)+s*.15,Y(j)+s*.2,s*.7,s*.6);x.strokeStyle=MPL.GOLD;x.lineWidth=1.4;x.strokeRect(X(i)+s*.15,Y(j)+s*.2,s*.7,s*.6);mplText(x,'Door out',X(i+.5),Y(j+1.35),7,MPL.VERM)}
  // the furnishings, from the real decor
  const u=s/10;
  for(const d of L.decor||[]){const a=X(d.x+.5),b=Y(d.y+.5);x.strokeStyle=MPL.INK;x.lineWidth=.9;
    if(d.k==='chest'){x.fillStyle='#8a5a2c';x.fillRect(a-4*u,b-2.6*u,8*u,5.2*u);x.strokeRect(a-4*u,b-2.6*u,8*u,5.2*u);x.fillStyle=MPL.GOLD;x.fillRect(a-.8*u,b-.8*u,1.6*u,1.8*u);mplText(x,'Chest',a,b+5.2*u,6.6,MPL.INK)}
    else if(d.k==='coffin'){x.fillStyle='#6a4a2c';x.beginPath();x.moveTo(a-2.4*u,b-4.2*u);x.lineTo(a+2.4*u,b-4.2*u);x.lineTo(a+3.2*u,b-1.2*u);x.lineTo(a+2.2*u,b+4.4*u);x.lineTo(a-2.2*u,b+4.4*u);x.lineTo(a-3.2*u,b-1.2*u);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.GOLD;x.beginPath();x.moveTo(a,b-2.6*u);x.lineTo(a,b+2.6*u);x.moveTo(a-1.4*u,b-1*u);x.lineTo(a+1.4*u,b-1*u);x.stroke()}
    else if(d.k==='barrel'){x.fillStyle='#8a6a3c';x.beginPath();x.arc(a,b,3.6*u,0,6.3);x.fill();x.stroke();x.beginPath();x.arc(a,b,2.2*u,0,6.3);x.stroke()}
    else if(d.k==='bench'){x.fillStyle='#8a6a3c';x.fillRect(a-5*u,b-1.6*u,10*u,3.2*u);x.strokeRect(a-5*u,b-1.6*u,10*u,3.2*u)}
    else if(d.k==='bones')MPLI.skull(x,a,b,u*.9);
    else if(d.k==='beggar'){x.fillStyle='#6a5a7a';x.beginPath();x.arc(a,b-2.4*u,1.6*u,0,6.3);x.fill();x.stroke();x.beginPath();x.moveTo(a,b-.8*u);x.lineTo(a+3*u,b+4*u);x.lineTo(a-3*u,b+4*u);x.closePath();x.fill();x.stroke();mplText(x,'The Hermit',a,b+6.4*u,6.8,MPL.INK)}}
  api.title(x,L.name.replace(/^The /,'The '),'A small place off the road');
  const back=L.portals&&L.portals[0]?LEVELS[L.portals[0].to]:null;
  mpMoorNotes(x,6,56,80,[L.name==="The Old Vault"?'Three coffins and a chest lie in the old vault. A narrow way leads in from the door.':L.name==='The Hermit\'s Cave'?'The Hermit lives here with a bench and a barrel.':'The watchtower has lost its roof. A chest and a barrel stand inside.',back?'The door leads back to '+back.name+'.':'The door leads back outside.']);
  api.compass(x,436,262,15);
}

mplInstall({name:'moorpass',levels:[19,26,28,22,27],
  draw(c,x,L,api){if(L.name==='Ironhill Moor')mpMoorDrawMoor(c,x,L,api);else if(L.name==='The Greyfang Pass')mpMoorDrawPass(c,x,L,api);else mpMoorDrawRoom(c,x,L,api)},
  fit(L){const W=L.rows[0].length,H=L.rows.length;if(W<20){const f=mplFit(W,H,10),s=Math.min(f.s,26),ox=f.ox+(f.s*W-s*W)/2,oy=f.oy+(f.s*H-s*H)/2;return {s,ox,oy,X:i=>ox+i*s,Y:j=>oy+j*s}}return mplFit(W,H)},
  foot:'You are the yellow arrow. The red dashed line on the pass is the way through.'});
