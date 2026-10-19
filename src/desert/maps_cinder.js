/* ==========================================================================
   AREA MAPS: CINDER ISLE (302) and the Vent Gardens seabed under it (322).
   The island is drawn from the same height formula the level builder uses (seas.js), so the black cone, the beaches and the shallows match the ground: hatched black rock,
   vermilion and gold lava running down to the sea, steam where it meets the water, a plume of smoke, lava tubes, fumaroles, basalt columns, ash fields and a landing beach.
   The seabed is drawn from the real floor map (rock and sand), the vents, the tube sponges, the chests and the boss's hollow.
   ========================================================================== */
const mpCinderH=(a,b,s)=>hash2(a,b,s);
const MPCI={x0:14,y0:12,W:72,H:64};
/* the island is cropped to the sea round it, so the mountain fills the sheet */
function mpCinderFitIsle(){const f=mplFit(MPCI.W,MPCI.H,2);return {s:f.s,ox:f.ox,oy:f.oy,X:c=>f.X(c-MPCI.x0),Y:c=>f.Y(c-MPCI.y0)}}
/* the same heights as seaBuild() in seas.js (pier planks included) */
function mpCinderField(W,H,fm){
  const sp=SEA[302],cx=sp.cx,cy=sp.cy,h=new Float32Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const d=Math.hypot((x-cx)/sp.rx,(y-cy)/sp.ry)*(1+.28*(tsmooth(x/5,y/5,sp.seed)-.5)),t=1-d;let hh=-.2+.03*(tsmooth(x/4,y/4,sp.seed+1)-.5);
    if(t>-.12)hh=t>0?Math.min(.5,.5*Math.min(1,t/.22))-.05+sp.peak*Math.pow(Math.max(0,t-.22),sp.pow)+.12*(tsmooth(x/6,y/6,sp.seed+2)-.4)*Math.min(1,t*4):-.2+(t+.12)/.12*.15;
    if(fm[y][x]==='2')hh=.08;h[y*W+x]=hh}
  return h}
/* a closed wobbly blob */
function mpCinderBlob(x,a,b,rx,ry,seed,n){n=n||14;x.beginPath();for(let i=0;i<=n;i++){const an=i/n*6.2832,w=1+(mpCinderH(i%n,3,seed)-.5)*.4,px=a+Math.cos(an)*rx*w,py=b+Math.sin(an)*ry*w;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath()}
/* a drifting puff: a cluster of overlapping circles */
function mpCinderPuff(x,a,b,r,fill,edge,seed){const pts=[[0,0,1],[-.8,.3,.7],[.8,.25,.75],[-.3,-.6,.7],[.45,-.55,.65]];
  x.strokeStyle=edge;x.lineWidth=.6;for(const [dx,dy,k] of pts){x.beginPath();x.arc(a+dx*r+(mpCinderH(seed,1,5)-.5),b+dy*r,r*k,0,6.3);x.stroke()}
  x.fillStyle=fill;for(const [dx,dy,k] of pts){x.beginPath();x.arc(a+dx*r+(mpCinderH(seed,1,5)-.5),b+dy*r,r*k-.4,0,6.3);x.fill()}}
/* a curl of steam rising from (a,b) */
function mpCinderSteam(x,a,b,h,seed,col){x.strokeStyle=col||'rgba(255,255,255,.85)';x.lineWidth=1.1;x.lineCap='round';for(let k=0;k<3;k++){const ox=(k-1)*2.4,ph=mpCinderH(seed,k,9)*6;x.beginPath();x.moveTo(a+ox,b);for(let t=1;t<=8;t++)x.lineTo(a+ox+Math.sin(t*.9+ph)*(1+t*.25),b-t*h/8);x.stroke()}x.lineCap='butt'}
/* a standing rune stone */
function mpCinderStone(x,a,b,s){x.fillStyle='#8a8478';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-2*s,b);x.lineTo(a-1.6*s,b-7*s);x.lineTo(a-.2*s,b-8.4*s);x.lineTo(a+1.6*s,b-6.6*s);x.lineTo(a+2*s,b);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.VERM;x.lineWidth=.6;x.beginPath();x.moveTo(a-.6*s,b-5.4*s);x.lineTo(a+.6*s,b-5.4*s);x.moveTo(a,b-5.8*s);x.lineTo(a,b-2.6*s);x.stroke()}
/* a cinder crystal: black with a red crack and a gold glint */
function mpCinderCrystal(x,a,b,s){x.fillStyle='#1c1614';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.moveTo(a,b-6*s);x.lineTo(a+2.6*s,b-1*s);x.lineTo(a+1.2*s,b+1.6*s);x.lineTo(a-1.4*s,b+1.6*s);x.lineTo(a-2.6*s,b-1*s);x.closePath();x.fill();x.stroke();
  x.strokeStyle='#e8502a';x.lineWidth=.8;x.beginPath();x.moveTo(a-.4*s,b-4.6*s);x.lineTo(a+.5*s,b-2*s);x.lineTo(a-.4*s,b+.4*s);x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.arc(a+1.2*s,b-2.6*s,.6*s,0,6.3);x.fill()}
/* a small tent */
function mpCinderTent(x,a,b,s){x.fillStyle='#d8c89c';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-4*s,b+1*s);x.lineTo(a,b-5*s);x.lineTo(a+4*s,b+1*s);x.closePath();x.fill();x.stroke();x.fillStyle='#3a2a1c';x.beginPath();x.moveTo(a-1*s,b+1*s);x.lineTo(a,b-1.8*s);x.lineTo(a+1*s,b+1*s);x.closePath();x.fill();x.strokeStyle=MPL.VERM;x.beginPath();x.moveTo(a,b-5*s);x.lineTo(a,b-7.4*s);x.stroke();x.fillStyle=MPL.VERM;x.fillRect(a,b-7.4*s,2.4*s,1.4*s)}
/* a ship seen from the side: hull, mast, a square sail, a pennant */
function mpCinderShip(x,a,b,s,sail){x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillStyle='#6a4a2a';x.beginPath();x.moveTo(a-8*s,b-2*s);x.lineTo(a+8*s,b-2*s);x.lineTo(a+5.4*s,b+2.2*s);x.lineTo(a-5.4*s,b+2.2*s);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(a,b-2*s);x.lineTo(a,b-12*s);x.stroke();x.fillStyle=sail||'#f0e6c8';x.beginPath();x.moveTo(a-5*s,b-3.4*s);x.quadraticCurveTo(a-6*s,b-8*s,a-4.4*s,b-10.6*s);x.lineTo(a+4.4*s,b-10.6*s);x.quadraticCurveTo(a+6*s,b-8*s,a+5*s,b-3.4*s);x.closePath();x.fill();x.stroke();
  x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(a,b-12*s);x.lineTo(a+4*s,b-11*s);x.lineTo(a,b-9.8*s);x.fill();x.strokeStyle='rgba(30,70,110,.7)';x.lineWidth=.7;x.beginPath();x.moveTo(a-9*s,b+3*s);x.quadraticCurveTo(a-6*s,b+1.2*s,a-3*s,b+3*s);x.quadraticCurveTo(a,b+4.8*s,a+3*s,b+3*s);x.quadraticCurveTo(a+6*s,b+1.2*s,a+9*s,b+3*s);x.stroke()}
/* a basalt column cluster: upright prisms of different heights, with a pale lit face */
function mpCinderColumns(x,a,b,s,n){for(let i=0;i<n;i++){const dx=(i-(n-1)/2)*2.7*s+(mpCinderH(i,1,41)-.5)*.8*s,hh=(5+mpCinderH(i,2,41)*5)*s,top=b+Math.abs(i-(n-1)/2)*.7*s-hh,w=2.3*s;
    x.fillStyle='#3a3432';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.fillRect(a+dx-w/2,top,w,b-top+Math.abs(i-(n-1)/2)*.7*s);x.strokeRect(a+dx-w/2,top,w,b-top+Math.abs(i-(n-1)/2)*.7*s);
    x.fillStyle='#8a847c';x.fillRect(a+dx-w/2,top,w*.42,b-top+Math.abs(i-(n-1)/2)*.7*s);x.fillStyle='#b8b0a4';x.beginPath();x.moveTo(a+dx-w/2,top);x.lineTo(a+dx,top-1.2*s);x.lineTo(a+dx+w/2,top);x.closePath();x.fill();x.stroke()}}
/* a fumarole: a ring of yellow sulphur and a thread of steam */
function mpCinderFumarole(x,a,b,seed){x.fillStyle='#e0c040';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.ellipse(a,b,2,1.1,0,0,6.3);x.fill();x.stroke();x.fillStyle='#1c1614';x.beginPath();x.ellipse(a,b,.9,.5,0,0,6.3);x.fill();mpCinderSteam(x,a,b-.6,7,seed,'rgba(250,250,240,.9)')}
/* a buoy */
function mpCinderBuoy(x,a,b,s){x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(a-2.4*s,b);x.lineTo(a-1.6*s,b-4*s);x.lineTo(a+1.6*s,b-4*s);x.lineTo(a+2.4*s,b);x.closePath();x.fill();x.stroke();x.fillStyle='#f0e6c8';x.fillRect(a-2*s,b-2.4*s,4*s,1.2*s);x.beginPath();x.moveTo(a,b-4*s);x.lineTo(a,b-7*s);x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.arc(a,b-7.4*s,1*s,0,6.3);x.fill();x.stroke()}
function mpCinderKey(x,a,b,w,rows){const h=rows.length*12+13;mplPanel(x,a,b,w,h);mplText(x,'KEY',a+w/2,b+8,6.4,MPL.VERM);rows.forEach(([fn,t],i)=>{const yy=b+20+i*12;fn(x,a+12,yy);mplText(x,t,a+24,yy,6.4,'#3a2a1c','left')});return b+h}
function mpCinderNotes(x,a,b,w,notes){const lines=notes.map(n=>mplWrap(x,n,w-20,6.4)),h=lines.reduce((s,l)=>s+l.length*8.8+5,0)+6;mplPanel(x,a,b,w,h);let yy=b+10;for(const l of lines){for(const t of l){mplText(x,t,a+5,yy,6.4,'#3a2a1c','left');yy+=8.8}yy+=5}return b+h}
function mpCinderRule(x,a,b,w){x.strokeStyle=MPL.GOLD;x.lineWidth=1;x.beginPath();x.moveTo(a,b);x.lineTo(a+w,b);x.stroke();x.fillStyle=MPL.VERM;x.save();x.translate(a+w/2,b);x.rotate(Math.PI/4);x.fillRect(-2,-2,4,4);x.restore()}
/* a lava river from the crater down to the sea: cell coordinates, stops where the ground meets the water */
function mpCinderRiver(h,W,H,ang,seed){const sp=SEA[302],cx=sp.cx,cy=sp.cy,pts=[],a0=ang*Math.PI/180;let px=cx+Math.cos(a0)*3,py=cy+Math.sin(a0)*3*.9,dir=a0;
  for(let k=0;k<90;k++){pts.push([px,py]);const hh=h[(py|0)*W+(px|0)];if(k>8&&hh<-.02)break;const rad=Math.atan2((py-cy)/.9,px-cx);dir=rad+Math.sin(k*.33+seed)*.38+Math.sin(k*.11+seed*2)*.2;px+=Math.cos(dir)*.75;py+=Math.sin(dir)*.75}
  return pts}

/* ---------------------------------------------------- CINDER ISLE ---------------------------------------------------- */
function mpCinderDrawIsle(c,x,L,api){
  const sp=SEA[302],W=L.rows[0].length,H=L.rows.length,f=mpCinderFitIsle(),X=f.X,Y=f.Y,s=f.s,fm=L.fmap,h=mpCinderField(W,H,fm),A=MPL.AREA,cx=sp.cx,cy=sp.cy;
  const hv=(i,j)=>i<0||j<0||i>=W||j>=H?-.2:h[j*W+i],land=(i,j)=>hv(i,j)>=-.06,R=(a,b,k)=>mpCinderH(a,b,k);
  const i0=MPCI.x0-3,i1=MPCI.x0+MPCI.W+3,j0=MPCI.y0-3,j1=MPCI.y0+MPCI.H+3;
  const dec=L.decor||[],byNpc=n=>dec.find(d=>d.npc===n),byK=k=>dec.filter(d=>d.k===k),P=d=>[X(d.x+.5),Y(d.y+.5)];
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  /* ---- the sea: pale grey-blue wash, shallows in verdigris, a lapis vignette, wave marks ---- */
  x.fillStyle='#8fb0bc';x.fillRect(A.x,A.y,A.w,A.h);
  for(let j=j0;j<j1;j++)for(let i=i0;i<i1;i++){if(land(i,j))continue;const t=fm[j]&&fm[j][i];if(t==='3'){x.fillStyle=hv(i,j)>-.13?'#cfe4d2':'#aed0c6';x.beginPath();x.arc(X(i+.5+(R(i,j,3)-.5)*.5),Y(j+.5+(R(i,j,4)-.5)*.5),s*.95,0,6.3);x.fill()}}
  const vg=x.createRadialGradient(X(cx),Y(cy),A.h*.35,X(cx),Y(cy),A.w*.62);vg.addColorStop(0,'rgba(39,74,154,0)');vg.addColorStop(1,'rgba(39,74,154,.3)');x.fillStyle=vg;x.fillRect(A.x,A.y,A.w,A.h);
  x.lineCap='round';for(let j=j0;j<j1;j+=2)for(let i=i0;i<i1;i+=2){const ii=i+R(i,j,5)*2,jj=j+R(i,j,6)*2;if(R(i,j,7)>.55)continue;const t=fm[jj|0]&&fm[jj|0][ii|0];if(t!=='4'&&t!==undefined)continue;const a=X(ii),b=Y(jj),l=2.2+R(i,j,8)*2.4;x.strokeStyle='rgba(28,60,102,.5)';x.lineWidth=.6;x.beginPath();x.moveTo(a-l,b);x.quadraticCurveTo(a-l/2,b-1.8,a,b);x.quadraticCurveTo(a+l/2,b+1.8,a+l,b);x.stroke()}
  x.lineCap='butt';
  /* ---- the land: scorched sand at the shore, black ash and rock above, darker with height ---- */
  for(let j=j0;j<j1;j++)for(let i=i0;i<i1;i++){if(!land(i,j))continue;const hh=hv(i,j),k=Math.max(0,Math.min(1,(hh-.3)/1.5)),t=fm[j][i];
    let r=t==='5'?102:t==='3'?186:206,g=t==='5'?88:t==='3'?164:182,b=t==='5'?80:t==='3'?118:132;r*=1-k*.8;g*=1-k*.82;b*=1-k*.8;
    x.fillStyle=`rgb(${r|0},${g|0},${b|0})`;x.beginPath();x.arc(X(i+.5+(R(i,j,9)-.5)*.3),Y(j+.5+(R(i,j,10)-.5)*.3),s*.82,0,6.3);x.fill()}
  /* stipple: scorched grit on the sand, ash dots on the ash fields */
  for(let j=j0;j<j1;j++)for(let i=i0;i<i1;i++){if(!land(i,j))continue;const t=fm[j][i],hh=hv(i,j);if(hh>1.3)continue;const n=t==='5'?4:1;for(let q=0;q<n;q++){if(R(i,j,20+q)>(t==='5'?.9:.35))continue;x.fillStyle=t==='5'?'rgba(24,18,16,.55)':'rgba(90,60,40,.5)';x.fillRect(X(i+R(i,j,30+q)),Y(j+R(i,j,40+q)),.9,.9)}}
  /* ---- the cone: hatched black rock, dense on the shadow side, sparse on the lit side ---- */
  const gx=(i,j)=>hv(i+1,j)-hv(i-1,j),gy=(i,j)=>hv(i,j+1)-hv(i,j-1);
  for(let j=j0;j<j1;j++)for(let i=i0;i<i1;i++){const hh=hv(i,j);if(hh<.55||!land(i,j))continue;
    const lit=(gx(i,j)+gy(i,j))>0,dens=Math.min(4,Math.round((hh-.4)*2.2+(lit?0:1.6)));
    for(let q=0;q<dens;q++){const a=X(i+R(i,j,50+q)),b=Y(j+R(i,j,60+q)),l=s*(.7+R(i,j,70+q)*.9);x.strokeStyle=lit?`rgba(60,44,36,${.3+hh*.12})`:`rgba(12,8,8,${.5+hh*.12})`;x.lineWidth=.6;x.beginPath();x.moveTo(a,b);x.lineTo(a-l*.45,b+l);x.stroke()}
    if(!lit&&hh>1.1)for(let q=0;q<2;q++){const a=X(i+R(i,j,80+q)),b=Y(j+R(i,j,90+q)),l=s*.9;x.strokeStyle='rgba(12,8,8,.5)';x.lineWidth=.5;x.beginPath();x.moveTo(a-l*.5,b);x.lineTo(a+l*.5,b+l*.35);x.stroke()}
    if(lit&&hh>1&&R(i,j,95)<.25){x.fillStyle='rgba(176,150,128,.45)';x.fillRect(X(i+R(i,j,96)),Y(j+R(i,j,97)),1.3,.8)}}
  /* ribs and gullies on the cone: inked lines running down from the rim */
  x.lineCap='round';for(let k=0;k<22;k++){const a0=k/22*6.2832+R(k,1,111)*.2;let r=4+R(k,2,111)*3,ll=3+R(k,3,111)*5;x.strokeStyle=k%3?'rgba(14,9,8,.8)':'rgba(40,30,28,.8)';x.lineWidth=k%3?.8:1.1;x.beginPath();
    for(let q=0;q<=8;q++){const rr=r+ll*q/8,an=a0+Math.sin(q*.7+k)*.04;const px=X(cx+Math.cos(an)*rr),py=Y(cy+Math.sin(an)*rr*.9);q?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}
  x.lineCap='butt';
  /* ---- the coast: an inked line with a second line out in the water, as an engraver would ---- */
  x.lineCap='round';x.strokeStyle='rgba(42,26,12,.95)';x.lineWidth=1.1;
  for(let j=j0;j<j1;j++)for(let i=i0;i<i1;i++)if(land(i,j))for(const [dx,dy,a1,b1,a2,b2] of [[0,-1,0,0,1,0],[0,1,0,1,1,1],[-1,0,0,0,0,1],[1,0,1,0,1,1]])if(!land(i+dx,j+dy)){const w1=(R(i,j,120+a1)-.5)*.5,w2=(R(i,j,124+b1)-.5)*.5;x.beginPath();x.moveTo(X(i+a1+w1*(dx?0:1)),Y(j+b1+w1*(dy?0:1)));x.lineTo(X(i+a2+w2*(dx?0:1)),Y(j+b2+w2*(dy?0:1)));x.stroke()}
  x.strokeStyle='rgba(30,70,110,.38)';x.lineWidth=.7;
  for(let j=j0;j<j1;j++)for(let i=i0;i<i1;i++)if(land(i,j))for(const [dx,dy,a1,b1,a2,b2] of [[0,-1,0,0,1,0],[0,1,0,1,1,1],[-1,0,0,0,0,1],[1,0,1,0,1,1]])if(!land(i+dx,j+dy)&&R(i,j,130)<.7){const o=1.3+R(i,j,131)*.5;x.beginPath();x.moveTo(X(i+a1+dx*o),Y(j+b1+dy*o));x.lineTo(X(i+a2+dx*o),Y(j+b2+dy*o));x.stroke()}
  x.lineCap='butt';
  /* ---- the pier from the real planks ---- */
  for(let j=j0;j<j1;j++)for(let i=i0;i<i1;i++)if(fm[j]&&fm[j][i]==='2'){x.fillStyle='#8a6a3c';x.fillRect(X(i),Y(j),s+.4,s+.4);x.strokeStyle='rgba(42,26,12,.85)';x.lineWidth=.7;x.strokeRect(X(i),Y(j),s+.4,s+.4);x.beginPath();x.moveTo(X(i),Y(j+.5));x.lineTo(X(i+1),Y(j+.5));x.stroke()}
  /* ---- lava tubes: dotted dark lines under the slopes with a few glowing skylights ---- */
  const tubes=[];
  for(const [ang,len,ph] of [[78,15,1],[210,16,2],[318,15,3]]){const a0=ang*Math.PI/180,pts=[];for(let q=0;q<=len;q++){const r=5+q*.9,an=a0+Math.sin(q*.5+ph)*.14;pts.push([cx+Math.cos(an)*r,cy+Math.sin(an)*r*.9])}tubes.push(pts)}
  x.strokeStyle='rgba(30,10,6,.85)';x.lineWidth=1.1;x.setLineDash([1.6,2.2]);for(const t of tubes){x.beginPath();t.forEach(([a,b],i)=>i?x.lineTo(X(a),Y(b)):x.moveTo(X(a),Y(b)));x.stroke()}x.setLineDash([]);
  tubes.forEach((t,k)=>{for(const q of [4,9,13]){const [a,b]=t[Math.min(q,t.length-1)];x.fillStyle='#120a08';x.strokeStyle='#e0602a';x.lineWidth=.8;x.beginPath();x.ellipse(X(a),Y(b),2.3,1.5,0,0,6.3);x.fill();x.stroke();x.fillStyle='rgba(255,190,70,.8)';x.beginPath();x.arc(X(a)+.3,Y(b)+.2,.7,0,6.3);x.fill()}});
  /* ---- the lava rivers, with a dark edge, a vermilion body, a gold core and a white-hot thread ---- */
  const rivers=[[18,1],[38,2],[150,3],[196,4],[250,5],[320,6]].map(([a,sd])=>mpCinderRiver(h,W,H,a,sd)),ends=[];
  const strokeRiver=(pts,wmul,col,off)=>{x.lineCap='round';x.lineJoin='round';pts.forEach((p,i)=>{if(!i)return;const q=pts[i-1],w=(2.2+Math.min(1,i/30)*2.6)*wmul;x.strokeStyle=col;x.lineWidth=Math.max(.5,w);x.beginPath();x.moveTo(X(q[0]),Y(q[1]));x.lineTo(X(p[0]),Y(p[1]));x.stroke()});x.lineCap='butt'};
  for(const pts of rivers){x.globalAlpha=.16;strokeRiver(pts,4.2,'#ff7a28');x.globalAlpha=.22;strokeRiver(pts,2.6,'#ff9a30');x.globalAlpha=1;strokeRiver(pts,1.6,'#3a1008');strokeRiver(pts,1.2,'#c8341a');strokeRiver(pts,.7,'#f08a22');strokeRiver(pts,.25,'#fff0a0');const e=pts[pts.length-1];ends.push(e);
    /* a side channel braiding off the middle */
    const m=pts[Math.floor(pts.length*.55)];if(m&&pts.length>20){x.strokeStyle='#c8341a';x.lineWidth=1.6;x.lineCap='round';x.beginPath();x.moveTo(X(m[0]),Y(m[1]));let bx=m[0],by=m[1];const dd=Math.atan2(m[1]-cy,m[0]-cx)+.6;for(let q=0;q<9;q++){bx+=Math.cos(dd+Math.sin(q)*.2)*.7;by+=Math.sin(dd+Math.sin(q)*.2)*.7;x.lineTo(X(bx),Y(by))}x.stroke();x.strokeStyle='#f6a030';x.lineWidth=.6;x.stroke();x.lineCap='butt'}}
  /* the lava runs into the sea: a glowing fan at each end and a skin of cooled black rock */
  for(const [ex,ey] of ends){const a=X(ex),b=Y(ey);const g=x.createRadialGradient(a,b,0,a,b,9);g.addColorStop(0,'rgba(255,200,80,.95)');g.addColorStop(.4,'rgba(230,80,30,.75)');g.addColorStop(1,'rgba(200,50,20,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,9,0,6.3);x.fill();x.fillStyle='#1c1614';for(let q=0;q<5;q++){x.beginPath();x.ellipse(a+(R(q,1,141)-.5)*10,b+(R(q,2,141)-.5)*8,1.6,1,R(q,3,141)*3,0,6.3);x.fill()}}
  /* ---- the crater: a black rim, a lake of lava, a gold glare and a few embers ---- */
  {const a=X(cx),b=Y(cy);x.fillStyle='#120c0a';x.strokeStyle=MPL.INK;x.lineWidth=1.2;mpCinderBlob(x,a,b,17,13,3,16);x.fill();x.stroke();
    const g=x.createRadialGradient(a,b,1,a,b,12);g.addColorStop(0,'#fff0a0');g.addColorStop(.35,'#f6a030');g.addColorStop(.75,'#c8341a');g.addColorStop(1,'#5a1408');x.fillStyle=g;mpCinderBlob(x,a,b,11.5,8.4,4,14);x.fill();x.strokeStyle='#2a0c06';x.lineWidth=.9;x.stroke();
    x.strokeStyle='rgba(60,16,6,.8)';x.lineWidth=.7;for(let q=0;q<7;q++){const an=q/7*6.28+.3;x.beginPath();x.moveTo(a+Math.cos(an)*3,b+Math.sin(an)*2.2);x.lineTo(a+Math.cos(an+.2)*9,b+Math.sin(an+.2)*6.4);x.stroke()}
    x.fillStyle='#ffd868';for(let q=0;q<14;q++){const ex=a+(R(q,1,151)-.3)*34,ey=b-8-R(q,2,151)*26;x.fillRect(ex,ey,1.1,1.1)}}
  /* ---- fumaroles on the middle slopes ---- */
  {let n=0;for(let q=0;q<220&&n<11;q++){const i=(cx-22+R(q,1,161)*44)|0,j=(cy-20+R(q,2,161)*40)|0,hh=hv(i,j);if(hh<.5||hh>1.55||fm[j][i]==='2')continue;
      const a=X(i+.5),b=Y(j+.5);if(rivers.some(r=>r.some(p=>Math.hypot(X(p[0])-a,Y(p[1])-b)<7)))continue;if(Math.hypot(a-X(cx),b-Y(cy))<24)continue;mpCinderFumarole(x,a,b,q);n++}}
  /* ---- basalt columns on the western shore ---- */
  const bc=(()=>{for(let r=sp.rx*1.0;r>6;r-=.5)for(const an of [3.4,3.2,3.6]){const i=(cx+Math.cos(an)*r)|0,j=(cy+Math.sin(an)*r*.9)|0;if(land(i,j)&&hv(i,j)>.05&&hv(i,j)<.7&&!rivers.some(rv=>rv.some(p=>Math.hypot(p[0]-i,p[1]-j)<3)))return [i,j]}return [cx-18,cy+2]})();
  mpCinderColumns(x,X(bc[0]+.5),Y(bc[1]+1),.8,7);
  mpCinderColumns(x,X(bc[0]+3.6),Y(bc[1]+3),.6,5);
  /* ---- places from the level: Ketra's camp, runestones, crystals, bones ---- */
  const ket=byNpc('ci_ketra');
  for(const d of byK('yar_tent')){const [a,b]=P(d);mpCinderTent(x,a,b+2,.8)}
  for(const d of byK('yar_runestone')){const [a,b]=P(d);mpCinderStone(x,a,b+2,.6)}
  for(const d of dec.filter(d=>d.npc==='ci_crystal')){const [a,b]=P(d);const g=x.createRadialGradient(a,b-2,0,a,b-2,7);g.addColorStop(0,'rgba(255,170,60,.65)');g.addColorStop(1,'rgba(255,120,40,0)');x.fillStyle=g;x.beginPath();x.arc(a,b-2,7,0,6.3);x.fill();mpCinderCrystal(x,a,b+1,.9)}
  for(const d of byK('yar_bones')){const [a,b]=P(d);MPLI.skull(x,a,b+1,.55)}
  if(ket){const [a,b]=P(ket);x.fillStyle='#6a3a8a';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.arc(a,b-3.6,1.5,0,6.3);x.fill();x.stroke();x.beginPath();x.moveTo(a,b-2);x.lineTo(a+2.6,b+2.6);x.lineTo(a-2.6,b+2.6);x.closePath();x.fill();x.stroke();MPLI.star(x,a+5,b-7,.6)}
  /* the dive buoy and the Dawn Walker at the pier */
  const bu=byNpc('uw_dive_302');if(bu){const [a,b]=P(bu);mpCinderBuoy(x,a,b+2,1)}
  const sh=byNpc('yr_ship');if(sh){const [a,b]=P(sh);mpCinderShip(x,a,b+3,1.05,'#f0e6c8')}
  /* two far ships, small, on the open sea */
  mpCinderShip(x,A.x+30,A.y+A.h-26,.62,'#e8d8b0');mpCinderShip(x,A.x+A.w-36,A.y+34,.55,'#d8c8a0');
  /* ---- steam on the sea where the lava lands, and more of it hanging over the water ---- */
  const steamAt=[...ends.map(e=>[X(e[0]),Y(e[1])]),...[[-20,4],[22,-14],[24,12],[-12,-22]].map(([dx,dy])=>[X(cx+dx),Y(cy+dy)])];
  steamAt.forEach(([a,b],k)=>{for(let q=0;q<7;q++){const px=a+(R(k,q,171)-.5)*22+q*1.2,py=b-3-R(k,q+10,171)*12-q*1.4,r=2.8+R(k,q+20,171)*3.6;x.fillStyle=`rgba(250,250,246,${.32+R(k,q,172)*.25})`;x.beginPath();x.arc(px,py,r,0,6.3);x.fill()}
    mpCinderSteam(x,a-3,b-2,16,k,'rgba(255,255,255,.9)');mpCinderSteam(x,a+6,b-1,11,k+9,'rgba(255,255,255,.8)')});
  /* ---- the smoke plume: dark at the crater, grey and wide as it drifts east on the wind, and ash falling out of it ---- */
  {const bx=X(cx),by=Y(cy)-6,puffs=[];for(let k=0;k<11;k++)puffs.push([bx+k*8.6+Math.sin(k*1.3)*3,by-k*5.8-Math.cos(k)*2,4.6+k*1.55,k]);
    for(let q=0;q<70;q++){const k=2+R(q,1,181)*9,a=bx+k*8.6+(R(q,2,181)-.3)*40+k*1.5,b=by-k*5.8+8+R(q,3,181)*10,l=16+R(q,4,181)*26;x.strokeStyle='rgba(50,40,38,.28)';x.lineWidth=.6;x.beginPath();x.moveTo(a,b);x.lineTo(a+3,b+l);x.stroke()}
    for(let k=puffs.length-1;k>=0;k--){const [a,b,r]=puffs[k],t=k/10,g=Math.round(54+t*100);mpCinderPuff(x,a,b,r,`rgba(${g},${g-4},${g-8},${.78-t*.26})`,`rgba(24,16,14,${.55-t*.25})`,k)}
    x.fillStyle='rgba(255,200,90,.55)';for(let q=0;q<10;q++)x.fillRect(bx+(R(q,1,191)-.2)*20+q,by+8-R(q,2,191)*8,1,1)}
  x.restore();
  /* the frame round the sea, a drawn rule */
  x.strokeStyle=MPL.INK;x.lineWidth=1.4;x.strokeRect(A.x,A.y,A.w,A.h);x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.strokeRect(A.x+2,A.y+2,A.w-4,A.h-4);
  /* ---- names ---- */
  const lab=(t,a,b,sz,col)=>mplText(x,t,a,b,sz||6.4,col||MPL.INK);
  lab('Cinder Mountain',X(cx)+6,Y(cy)+26,8.2);lab('The Crater',X(cx)+2,Y(cy)+17,6.2,MPL.VERM);
  const st=L.start;lab('Landing Beach',X(st.x+.5)-34,Y(st.y+.5)+2,6.8);lab('The Pier',X(st.x+1.5)+14,Y(st.y+4.2),6.2);
  if(sh){const [a,b]=P(sh);lab('Dawn Walker',a-30,b+14,6.2,'#3a2a1c')}
  if(ket){const [a,b]=P(ket);lab("Ketra's Camp",a-6,b+11,6.4,'#4a2a6a')}
  const rs=byK('yar_runestone');if(rs.length){const mx=rs.reduce((q,d)=>q+d.x,0)/rs.length+.5,my=rs.reduce((q,d)=>q+d.y,0)/rs.length+.5;lab('Runestones',X(mx)-8,Y(my)-12,6.2)}
  if(bu){const [a,b]=P(bu);lab('Dive Buoy',a+16,b+3,6.2,'#274a6a');lab('to the Vent Gardens',a+26,b+10,5.6,'#274a6a')}
  lab('Basalt Columns',X(bc[0]+2)-4,Y(bc[1]+5.4),6.2);
  const t0=tubes[1][8];lab('Lava Tubes',X(t0[0]),Y(t0[1])+9,6.2,MPL.VERM);
  /* the ash fields: name them where the real ash cells are thickest */
  {let best=null,bs=-1;for(let j=j0+4;j<j1-4;j+=2)for(let i=i0+4;i<i1-4;i+=2){let n=0;for(let dj=-3;dj<=3;dj++)for(let di=-3;di<=3;di++)if(fm[j+dj][i+di]==='5')n++;if(n>bs&&Math.hypot(i-cx,j-cy)>14){bs=n;best=[i,j]}}if(best&&bs>12)lab('Black Ash Fields',X(best[0]),Y(best[1]),6.2)}
  lab('Steaming Sea',X(cx+21),Y(cy+16),6.2,'#274a6a');
  lab('The Vaast Sea',A.x+54,A.y+A.h-12,7.4,'#274a6a');
  lab('Fumaroles',X(cx-17),Y(cy-11),5.8,'#5a4a30');
  /* ---- margins ---- */
  api.title(x,'Cinder Isle','A smoking volcano island');
  const yy=mpCinderKey(x,6,52,80,[
    [(x,a,b)=>{x.lineCap='round';x.strokeStyle='#3a1008';x.lineWidth=5;x.beginPath();x.moveTo(a-6,b);x.lineTo(a+6,b);x.stroke();x.strokeStyle='#c8341a';x.lineWidth=3.4;x.stroke();x.strokeStyle='#f6a030';x.lineWidth=1.2;x.stroke();x.lineCap='butt'},'Lava flow'],
    [(x,a,b)=>{x.fillStyle='#2a2220';x.fillRect(a-6,b-4,12,8);x.strokeStyle='rgba(120,100,90,.7)';x.lineWidth=.6;for(let k=0;k<5;k++){x.beginPath();x.moveTo(a-5+k*2.4,b-3);x.lineTo(a-6.4+k*2.4,b+3.5);x.stroke()}},'Black rock'],
    [(x,a,b)=>{x.fillStyle='#665850';x.fillRect(a-6,b-4,12,8);x.fillStyle='rgba(24,18,16,.7)';for(let k=0;k<12;k++)x.fillRect(a-5+R(k,1,5)*10,b-3+R(k,2,5)*6,1,1)},'Ash field'],
    [(x,a,b)=>mpCinderFumarole(x,a,b+1,3),'Fumarole'],
    [(x,a,b)=>{x.strokeStyle='rgba(30,10,6,.85)';x.lineWidth=1.1;x.setLineDash([1.6,2.2]);x.beginPath();x.moveTo(a-6,b);x.lineTo(a+6,b);x.stroke();x.setLineDash([]);x.fillStyle='#120a08';x.strokeStyle='#e0602a';x.beginPath();x.ellipse(a,b,2.2,1.4,0,0,6.3);x.fill();x.stroke()},'Lava tube'],
    [(x,a,b)=>mpCinderColumns(x,a,b+4,.4,4),'Basalt columns'],
    [(x,a,b)=>mpCinderCrystal(x,a,b+3,.65),'Cinder crystal'],
    [(x,a,b)=>mpCinderStone(x,a,b+4,.5),'Runestone'],
    [(x,a,b)=>{mpCinderSteam(x,a,b+4,9,2,'rgba(255,255,255,.95)');x.strokeStyle='rgba(40,70,100,.5)';x.lineWidth=.6;x.beginPath();x.moveTo(a-5,b+5);x.lineTo(a+5,b+5);x.stroke()},'Steam']]);
  mpCinderNotes(x,6,yy+5,80,['Black rock slopes rise to a smoking crater. Lava runs down to the sea in red and gold rivers.','Steam hangs over the water where the lava lands.']);
  mpCinderRule(x,396,48,76);
  mpCinderNotes(x,394,56,84,['Ketra the ash-priestess keeps a camp on the south shore, near the landing beach.','Six cinder crystals lie round the mountain, black with red cracks.','A guardian walks the high path near the crater.','The dive buoy off the south shore leads down to the Vent Gardens.']);
  api.compass(x,436,262,15);
}

/* ---------------------------------------------------- THE VENT GARDENS (seabed) ---------------------------------------------------- */
function mpCinderDrawSea(c,x,L,api){
  const W=L.rows[0].length,H=L.rows.length,f=mplFit(W,H),X=f.X,Y=f.Y,s=f.s,fm=L.fmap,A=MPL.AREA,R=(a,b,k)=>mpCinderH(a,b,k),dec=L.decor||[],P=d=>[X(d.x+.5),Y(d.y+.5)];
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  x.fillStyle='#5c8890';x.fillRect(A.x,A.y,A.w,A.h);
  /* the sand of the seabed in three tones, from the real floor map */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const t=fm[j][i];if(t==='5')continue;x.fillStyle=t==='0'?'#86acaa':t==='1'?'#7aa4a2':t==='2'?'#92b4a8':'#70989a';x.beginPath();x.arc(X(i+.5+(R(i,j,3)-.5)*.4),Y(j+.5+(R(i,j,4)-.5)*.4),s*.85,0,6.3);x.fill()}
  x.fillStyle='rgba(20,50,70,.5)';for(let j=0;j<H;j+=1)for(let i=0;i<W;i+=1)if(fm[j][i]!=='5'&&R(i,j,5)<.14)x.fillRect(X(i+R(i,j,6)),Y(j+R(i,j,7)),.9,.9);
  x.lineCap='round';x.strokeStyle='rgba(20,60,90,.4)';x.lineWidth=.6;for(let j=2;j<H;j+=3)for(let i=2;i<W;i+=3)if(fm[j][i]!=='5'&&R(i,j,8)<.4){const a=X(i+R(i,j,9)),b=Y(j+R(i,j,10));x.beginPath();x.moveTo(a-2.6,b);x.quadraticCurveTo(a-1.3,b-1.6,a,b);x.quadraticCurveTo(a+1.3,b+1.6,a+2.6,b);x.stroke()}
  x.lineCap='butt';
  /* the rock: black, hatched, with an inked edge and a faint warm glow along it */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(fm[j][i]==='5'){x.fillStyle='#241c1a';x.beginPath();x.arc(X(i+.5+(R(i,j,13)-.5)*.3),Y(j+.5+(R(i,j,14)-.5)*.3),s*.84,0,6.3);x.fill()}
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(fm[j][i]==='5'){for(let q=0;q<2;q++){const a=X(i+R(i,j,20+q)),b=Y(j+R(i,j,30+q)),l=s*(.8+R(i,j,40+q)*.8);x.strokeStyle=q?'rgba(150,120,100,.35)':'rgba(8,6,6,.7)';x.lineWidth=.6;x.beginPath();x.moveTo(a,b);x.lineTo(a-l*.45,b+l);x.stroke()}}
  const rk=(i,j)=>i>=0&&j>=0&&i<W&&j<H&&fm[j][i]==='5';
  x.lineCap='round';x.strokeStyle='rgba(224,96,42,.5)';x.lineWidth=2;for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(rk(i,j))for(const [dx,dy,a1,b1,a2,b2] of [[0,-1,0,0,1,0],[0,1,0,1,1,1],[-1,0,0,0,0,1],[1,0,1,0,1,1]])if(!rk(i+dx,j+dy)&&R(i,j,50)<.5){x.beginPath();x.moveTo(X(i+a1),Y(j+b1));x.lineTo(X(i+a2),Y(j+b2));x.stroke()}
  x.strokeStyle='rgba(20,12,8,.95)';x.lineWidth=1.1;for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(rk(i,j))for(const [dx,dy,a1,b1,a2,b2] of [[0,-1,0,0,1,0],[0,1,0,1,1,1],[-1,0,0,0,0,1],[1,0,1,0,1,1]])if(!rk(i+dx,j+dy)){const w1=(R(i,j,60+a1)-.5)*.5,w2=(R(i,j,64+b1)-.5)*.5;x.beginPath();x.moveTo(X(i+a1+w1*(dx?0:1)),Y(j+b1+w1*(dy?0:1)));x.lineTo(X(i+a2+w2*(dx?0:1)),Y(j+b2+w2*(dy?0:1)));x.stroke()}
  x.lineCap='butt';
  /* decor: sponges and crystals as little marks, then the chests, clams and vents */
  const iconTubes=(a,b,sc)=>{for(let k=0;k<4;k++){const dx=(k-1.5)*1.6*sc,hh=(4+R(k,1,71)*3)*sc;x.fillStyle=k%2?'#3a78c8':'#5a98d8';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillRect(a+dx-.7*sc,b-hh,1.4*sc,hh);x.strokeRect(a+dx-.7*sc,b-hh,1.4*sc,hh);x.fillStyle='#10223a';x.fillRect(a+dx-.5*sc,b-hh,1*sc,.7*sc)}};
  const iconCoral=(a,b,sc)=>{x.strokeStyle='#c8502a';x.lineWidth=.9;x.lineCap='round';x.beginPath();x.moveTo(a,b);x.lineTo(a,b-3.4*sc);x.moveTo(a,b-1.4*sc);x.lineTo(a-1.8*sc,b-3.6*sc);x.moveTo(a,b-2*sc);x.lineTo(a+1.8*sc,b-4*sc);x.stroke();x.lineCap='butt'};
  for(const d of dec){const [a,b]=P(d);
    if(d.k==='uw_tubes')iconTubes(a,b+1,.75);
    else if(d.k==='uw_staghorn'||d.k==='uw_brain')iconCoral(a,b+1,.8);
    else if(d.k==='yar_crystals')mpCinderCrystal(x,a,b+1,.6);
    else if(d.k==='uw_rocks'){x.fillStyle='#4a4240';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.arc(a,b,1.8,Math.PI,0);x.closePath();x.fill();x.stroke()}
    else if(d.k==='uw_clam'){x.fillStyle='#e8d8c8';x.strokeStyle=MPL.INK;x.lineWidth=.5;x.beginPath();x.arc(a,b,1.7,Math.PI,0);x.closePath();x.fill();x.stroke()}
    else if(d.k==='uw_shellchest'&&d.npc==='uw_chest'){x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.5;x.fillRect(a-1.9,b-1.4,3.8,2.6);x.strokeRect(a-1.9,b-1.4,3.8,2.6)}}
  /* the vents: warm glow, a column of bubbles */
  const S=typeof UWS!=='undefined'&&UWS[LEVEL],vents=S?S.vents:[];
  for(const [vx,vy] of vents){const a=X(vx+.5),b=Y(vy+.5),g=x.createRadialGradient(a,b,0,a,b,11);g.addColorStop(0,'rgba(255,170,70,.75)');g.addColorStop(1,'rgba(255,120,40,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,11,0,6.3);x.fill();x.fillStyle='#120a08';x.strokeStyle='#e0602a';x.lineWidth=.8;x.beginPath();x.ellipse(a,b,3,1.8,0,0,6.3);x.fill();x.stroke();
    x.strokeStyle='rgba(240,250,255,.9)';x.fillStyle='rgba(230,245,255,.5)';x.lineWidth=.6;for(let q=0;q<9;q++){const bx=a+Math.sin(q*1.7)*3+(R(q,vx,81)-.5)*2,by=b-3-q*2.2,r=.8+q*.18;x.beginPath();x.arc(bx,by,r,0,6.3);x.fill();x.stroke()}}
  x.restore();
  x.strokeStyle=MPL.INK;x.lineWidth=1.4;x.strokeRect(A.x,A.y,A.w,A.h);x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.strokeRect(A.x+2,A.y+2,A.w-4,A.h-4);
  /* the start, the boss's hollow and the prize */
  const lab=(t,a,b,sz,col)=>mplText(x,t,a,b,sz||6.4,col||MPL.INK);
  const up=dec.find(d=>d.npc==='uw_up');if(up){const [a,b]=P(up);mpCinderBuoy(x,a,b+2,1);lab('Dive line up',a,b+10,6.4,MPL.INK)}
  const pr=dec.find(d=>d.npc==='uw_prize');if(pr){const [a,b]=P(pr);x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(a-3,b-2.4,6,4.4);x.strokeRect(a-3,b-2.4,6,4.4);MPLI.star(x,a,b-6,.7);lab('Heart of the Vent',a,b+8,6.4,MPL.INK)}
  const bo=(L.enemies||[]).find(e=>e.t==='uwmega');if(bo){const a=X(bo.x+.5),b=Y(bo.y+.5);x.strokeStyle='rgba(200,40,20,.8)';x.lineWidth=1;x.setLineDash([2,2]);x.beginPath();x.ellipse(a,b,17,12,0,0,6.3);x.stroke();x.setLineDash([]);MPLI.skull(x,a,b+2,.8);lab('The Vent Tyrant',a,b+17,6.4,'#5a1408')}
  lab('The Vent Gardens',X(W*.5),Y(H*.5)+2,8,'#10223a');
  if(vents[1])lab('Bubble vents',X(vents[1][0]+.5)+2,Y(vents[1][1]+.5)+9,6,MPL.INK);
  const tu=dec.filter(d=>d.k==='uw_tubes');if(tu.length){const d=tu[(tu.length/2)|0],[a,b]=P(d);lab('Tube sponges',a,b+9,6,MPL.INK)}
  api.title(x,'The Vent Gardens','The seabed under Cinder Isle');
  const yy=mpCinderKey(x,6,52,80,[
    [(x,a,b)=>{x.fillStyle='#241c1a';x.fillRect(a-6,b-4,12,8);x.strokeStyle='#e0602a';x.lineWidth=1.2;x.strokeRect(a-6,b-4,12,8)},'Black rock'],
    [(x,a,b)=>{x.fillStyle='#86acaa';x.fillRect(a-6,b-4,12,8)},'Sand'],
    [(x,a,b)=>{x.fillStyle='#120a08';x.strokeStyle='#e0602a';x.beginPath();x.ellipse(a,b+3,3,1.8,0,0,6.3);x.fill();x.stroke();x.fillStyle='rgba(230,245,255,.6)';for(let q=0;q<4;q++){x.beginPath();x.arc(a+Math.sin(q*1.7)*1.4,b-q*2,.8+q*.2,0,6.3);x.fill()}},'Bubble vent'],
    [(x,a,b)=>iconTubes(a,b+4,.8),'Tube sponges'],
    [(x,a,b)=>iconCoral(a,b+4,.9),'Coral'],
    [(x,a,b)=>{x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-3,b-2,6,4.4);x.strokeRect(a-3,b-2,6,4.4)},'Chest'],
    [(x,a,b)=>{x.fillStyle='#e8d8c8';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.arc(a,b+2,3,Math.PI,0);x.closePath();x.fill();x.stroke()},'Giant clam']]);
  mpCinderNotes(x,6,yy+5,80,['Black rock walls ring the seabed. Warm water rises from cracks in the floor.','The dive line is at the south edge. The hollow lies far to the north.']);
  mpCinderRule(x,396,48,76);
  mpCinderNotes(x,394,56,84,['Columns of bubbles mark the vents. Blue tube sponges grow round them.','The Vent Tyrant waits in the hollow at the north, guarding a great chest.','Giant clams and shell chests are scattered over the sand.','Rise at the dive line to return to Cinder Isle.']);
  api.compass(x,436,262,15);
}

mplInstall({name:'cinder',levels:[302,322],
  draw(c,x,L,api){if(L.name==='Cinder Isle')mpCinderDrawIsle(c,x,L,api);else mpCinderDrawSea(c,x,L,api)},
  fit(L){return L.name==='Cinder Isle'?mpCinderFitIsle():mplFit(L.rows[0].length,L.rows.length)},
  tint:[-6,-8,-6],
  foot:'You are the yellow arrow.'});
