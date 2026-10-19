/* Area map for the abbey crypts (level 1): an illuminated cutaway floor plan. See maps_common.js. Names start with mpAbbey. */
const MPABBEY_NAMES=[
  {t:'Arrival Cell',x:3.5,y:16.5,k:'room'},{t:'Cart Store',x:8.4,y:17.3,k:'room'},{t:'The Rat Run',x:4.6,y:7.3,k:'room'},
  {t:'Alcove',x:12,y:4.5,k:'room'},{t:'Great Ossuary',x:19.5,y:5.4,k:'room'},{t:'Crypt of Coffins',x:16,y:16,k:'room'},
  {t:"Rat King's Throne",x:23.5,y:12.6,k:'room'},{t:'Stair down',x:25.4,y:14.9,k:'stair'}];
function mpAbbeyW(a,b,s){return (hash2(a*7+3,b*13+5,s||11)-.5)}
/* a hand-wobbled line from p to q */
function mpAbbeyLine(x,p,q,w,sd){const n=Math.max(2,Math.ceil(Math.hypot(q[0]-p[0],q[1]-p[1])/3));x.beginPath();for(let i=0;i<=n;i++){const t=i/n,a=p[0]+(q[0]-p[0])*t+mpAbbeyW(i,sd,3)*w,b=p[1]+(q[1]-p[1])*t+mpAbbeyW(i,sd,4)*w;i?x.lineTo(a,b):x.moveTo(a,b)}x.stroke()}
function mpAbbeyCoffin(x,a,b,s){x.save();x.translate(a,b);x.fillStyle='#8a6038';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(-.3*s,-.9*s);x.lineTo(.3*s,-.9*s);x.lineTo(.42*s,-.3*s);x.lineTo(.28*s,.9*s);x.lineTo(-.28*s,.9*s);x.lineTo(-.42*s,-.3*s);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.beginPath();x.moveTo(0,-.6*s);x.lineTo(0,.5*s);x.moveTo(-.18*s,-.25*s);x.lineTo(.18*s,-.25*s);x.stroke();x.restore()}
function mpAbbeyBones(x,a,b,s){x.save();x.translate(a,b);x.strokeStyle=MPL.INK;x.lineCap='round';for(const [r,w] of [[.6,2.4],[-.6,2.4]]){x.save();x.rotate(r);x.lineWidth=w;x.strokeStyle=MPL.INK;x.beginPath();x.moveTo(-3.6*s,0);x.lineTo(3.6*s,0);x.stroke();x.lineWidth=w-1;x.strokeStyle='#f0e8d4';x.beginPath();x.moveTo(-3.6*s,0);x.lineTo(3.6*s,0);x.stroke();for(const e of [-3.6,3.6])for(const d of [-.8,.8]){x.fillStyle='#f0e8d4';x.beginPath();x.arc(e*s,d*s,1*s,0,6.3);x.fill();x.lineWidth=.5;x.strokeStyle=MPL.INK;x.stroke()}x.restore()}
  x.restore()}
function mpAbbeyBarrel(x,a,b,s){x.save();x.fillStyle='#9a6a3a';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.arc(a,b,3.6*s,0,6.3);x.fill();x.stroke();x.beginPath();x.arc(a,b,2.2*s,0,6.3);x.stroke();x.beginPath();x.arc(a,b,.7*s,0,6.3);x.stroke();x.restore()}
function mpAbbeyCart(x,a,b,s){x.save();x.translate(a,b);x.fillStyle='#8a6a42';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(-4*s,-3*s,8*s,6*s);x.strokeRect(-4*s,-3*s,8*s,6*s);x.beginPath();x.moveTo(-4*s,0);x.lineTo(4*s,0);x.stroke();for(const e of [-1,1]){x.fillStyle='#4a3420';x.fillRect(-1*s,e*3.2*s-.8*s,2*s,1.6*s)}x.restore()}
function mpAbbeyPaw(x,a,b,r,s){x.save();x.translate(a,b);x.rotate(r);x.fillStyle='#4a2a1a';x.globalAlpha=.75;x.beginPath();x.ellipse(0,0,1.1*s,.9*s,0,0,6.3);x.fill();for(const d of [-1.4,-.5,.5,1.4]){x.beginPath();x.arc(d*s,-1.6*s+Math.abs(d)*.3*s,.5*s,0,6.3);x.fill()}x.restore()}
function mpAbbeyTorch(x,a,b,s,dx,dy){x.save();const g=x.createRadialGradient(a,b,0,a,b,8*s);g.addColorStop(0,'rgba(255,200,80,.5)');g.addColorStop(1,'rgba(255,200,80,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,8*s,0,6.3);x.fill();x.strokeStyle=MPL.INK;x.lineWidth=.9;x.fillStyle='#6a4a22';x.fillRect(a-.9*s,b,1.8*s,2.2*s);x.strokeRect(a-.9*s,b,1.8*s,2.2*s);x.fillStyle='#e8742a';x.beginPath();x.moveTo(a-1.5*s,b);x.quadraticCurveTo(a-1.6*s,b-2.8*s,a,b-4.4*s);x.quadraticCurveTo(a+1.6*s,b-2.8*s,a+1.5*s,b);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.GOLD2;x.beginPath();x.moveTo(a-.7*s,b);x.quadraticCurveTo(a-.6*s,b-1.6*s,a,b-2.4*s);x.quadraticCurveTo(a+.6*s,b-1.6*s,a+.7*s,b);x.fill();x.restore()}
function mpAbbeyCrown(x,a,b,s){x.save();x.fillStyle=MPL.GOLD;x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-4*s,b+2*s);x.lineTo(a-4.4*s,b-3*s);x.lineTo(a-2*s,b-.6*s);x.lineTo(a,b-4*s);x.lineTo(a+2*s,b-.6*s);x.lineTo(a+4.4*s,b-3*s);x.lineTo(a+4*s,b+2*s);x.closePath();x.fill();x.stroke();x.fillStyle=MPL.VERM;x.beginPath();x.arc(a,b,.9*s,0,6.3);x.fill();x.restore()}
/* small rat silhouette used as a drawn mark in the frieze (a plain ink icon) */
function mpAbbeyArch(x,a,b,w,h){x.save();x.strokeStyle=MPL.INK;x.lineWidth=.9;x.fillStyle='rgba(39,74,154,.28)';x.beginPath();x.moveTo(a-w/2,b);x.lineTo(a-w/2,b-h*.55);x.quadraticCurveTo(a-w/2,b-h*.9,a,b-h);x.quadraticCurveTo(a+w/2,b-h*.9,a+w/2,b-h*.55);x.lineTo(a+w/2,b);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.beginPath();x.moveTo(a-w*.28,b);x.lineTo(a-w*.28,b-h*.5);x.quadraticCurveTo(a-w*.28,b-h*.75,a,b-h*.82);x.quadraticCurveTo(a+w*.28,b-h*.75,a+w*.28,b-h*.5);x.lineTo(a+w*.28,b);x.stroke();x.restore()}
mplInstall({name:'abbey',levels:[1],foot:'You are the yellow arrow. The stair is on the far east wall.',tint:[-4,-6,-10],
draw(c,x,L,api){
  const rows=L.rows,W=rows[0].length,H=rows.length,f=api.fit(W,H),s=f.s,X=f.X,Y=f.Y,I=api.I,INK=MPL.INK;
  const open=(a,b)=>a>=0&&b>=0&&a<W&&b<H&&rows[b][a]!=='#'&&rows[b][a]!=='%';
  const wall=(a,b)=>!open(a,b);
  const near=(a,b)=>{for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(open(a+i,b+j))return true;return false};
  const ch=(a,b)=>a>=0&&b>=0&&a<W&&b<H?rows[b][a]:'#';
  /* frieze bands above and below the plan: gothic arches, crosses and skulls */
  const A=MPL.AREA;
  x.save();x.fillStyle='rgba(60,40,20,.07)';x.fillRect(A.x,A.y,A.w,A.h);x.restore();
  for(const [by,dir] of [[f.oy-4,1],[f.oy+H*s+22,-1]]){for(let i=0;i<8;i++){const ax=A.x+18+i*(A.w-36)/7;
    x.save();if(dir<0){x.translate(0,by);x.scale(1,-1);x.translate(0,-by)}mpAbbeyArch(x,ax,by,24,15);x.restore();
    const iy=dir>0?by-5:by+5;if(i%3===0)I.skull(x,ax,iy,.8);else if(i%3===1)I.cross(x,ax,iy,.9);else I.star(x,ax,iy,.5,MPL.VERM)}}
  /* the stone mass: dark rock far from the halls, hatched wall near them */
  x.save();x.beginPath();x.rect(X(0),Y(0),W*s,H*s);x.clip();
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(open(i,j))continue;const n=near(i,j);x.fillStyle=n?'#a89068':'#6e5838';x.globalAlpha=n?.85:.62;x.fillRect(X(i)-.3,Y(j)-.3,s+.6,s+.6)}
  x.globalAlpha=1;
  /* hatching on every wall cell, two directions on the deep rock */
  x.lineWidth=.55;for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(open(i,j))continue;const n=near(i,j);x.strokeStyle=n?'rgba(42,26,12,.55)':'rgba(230,210,160,.28)';const st=n?2.1:2.6;x.save();x.beginPath();x.rect(X(i),Y(j),s,s);x.clip();x.beginPath();for(let k=-s;k<s*2;k+=st){x.moveTo(X(i)+k+hash2(i,j,5)*.6,Y(j));x.lineTo(X(i)+k-s,Y(j)+s)}x.stroke();
    if(!n){x.beginPath();for(let k=-s;k<s*2;k+=st*1.6){x.moveTo(X(i)+k,Y(j)+s);x.lineTo(X(i)+k+s,Y(j))}x.stroke()}x.restore()}
  x.restore();
  /* flagged floors */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!open(i,j))continue;const h=hash2(i,j,9);
    x.fillStyle=`rgb(${226+h*10|0},${214+h*10|0},${176+h*12|0})`;x.fillRect(X(i)-.2,Y(j)-.2,s+.4,s+.4);
    x.strokeStyle='rgba(90,64,34,.42)';x.lineWidth=.5;const off=hash2(i,j,2)>.5?.5:0;
    x.beginPath();x.moveTo(X(i),Y(j)+s*(.5+off*.0));x.lineTo(X(i)+s,Y(j)+s*.5);x.moveTo(X(i)+s*(.3+off*.4),Y(j));x.lineTo(X(i)+s*(.3+off*.4),Y(j)+s*.5);x.moveTo(X(i)+s*(.7-off*.4),Y(j)+s*.5);x.lineTo(X(i)+s*(.7-off*.4),Y(j)+s);x.stroke();
    if(h>.82){x.fillStyle='rgba(90,64,34,.18)';x.beginPath();x.ellipse(X(i)+s*(.2+hash2(i,j,3)*.6),Y(j)+s*(.2+hash2(i,j,4)*.6),s*.25,s*.15,h*3,0,6.3);x.fill()}}
  /* a faint floor shadow along every wall */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!open(i,j))continue;x.fillStyle='rgba(60,40,20,.2)';if(wall(i,j-1))x.fillRect(X(i),Y(j),s,s*.16);if(wall(i-1,j))x.fillRect(X(i),Y(j),s*.16,s)}
  /* inked wall edges, doubled, wobbly; gold dots on the carved chamber */
  x.lineCap='round';
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!open(i,j))continue;
    for(const [di,dj,p,q] of [[0,-1,[X(i),Y(j)],[X(i+1),Y(j)]],[0,1,[X(i),Y(j+1)],[X(i+1),Y(j+1)]],[-1,0,[X(i),Y(j)],[X(i),Y(j+1)]],[1,0,[X(i+1),Y(j)],[X(i+1),Y(j+1)]]]){
      if(open(i+di,j+dj))continue;const sd=i*31+j*17+di*3+dj;x.strokeStyle=INK;x.lineWidth=1.5;mpAbbeyLine(x,p,q,.7,sd);x.lineWidth=.5;x.strokeStyle='rgba(42,26,12,.6)';mpAbbeyLine(x,[p[0]+di*1.6,p[1]+dj*1.6],[q[0]+di*1.6,q[1]+dj*1.6],.6,sd+7)}}
  /* the carved chamber wall: a gold dotted rule and vermilion ticks */
  x.fillStyle=MPL.GOLD;for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(rows[j][i]!=='%')continue;if(near(i,j)&&hash2(i,j,6)>.35){x.beginPath();x.arc(X(i)+s*.5,Y(j)+s*.5,.9,0,6.3);x.fill()}}
  /* pillars: round stone drums */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(rows[j][i]!=='#'&&rows[j][i]!=='%')continue;if(!(open(i-1,j)&&open(i+1,j)&&open(i,j-1)&&open(i,j+1)))continue;
    x.fillStyle='#ded2b0';x.fillRect(X(i)-.2,Y(j)-.2,s+.4,s+.4);x.fillStyle='#b8a882';x.strokeStyle=INK;x.lineWidth=1.1;x.beginPath();x.arc(X(i)+s/2,Y(j)+s/2,s*.42,0,6.3);x.fill();x.stroke();x.lineWidth=.5;x.beginPath();x.arc(X(i)+s/2,Y(j)+s/2,s*.24,0,6.3);x.stroke()}
  /* doors and the iron gate */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const r=rows[j][i];if(r!=='D'&&r!=='L')continue;
    const vert=wall(i,j-1)&&wall(i,j+1)===true?false:true;/* door in a vertical wall has walls above and below */
    const inwall=wall(i,j-1)&&wall(i,j+1);const px=X(i)+s/2,py=Y(j)+s/2;x.save();x.translate(px,py);if(!inwall)x.rotate(Math.PI/2);
    if(r==='D'){x.fillStyle='#7a4a24';x.strokeStyle=INK;x.lineWidth=1;x.fillRect(-s*.2,-s*.5,s*.4,s);x.strokeRect(-s*.2,-s*.5,s*.4,s);x.strokeStyle=MPL.GOLD;x.lineWidth=.7;x.beginPath();x.moveTo(0,-s*.45);x.lineTo(0,s*.45);x.stroke();x.strokeStyle='rgba(42,26,12,.6)';x.lineWidth=.6;x.beginPath();x.arc(-s*.2,-s*.5,s*.9,0,Math.PI/2);x.stroke()}
    else{x.fillStyle='rgba(30,30,40,.25)';x.fillRect(-s*.45,-s*.45,s*.9,s*.9);x.strokeStyle='#3a3a48';x.lineWidth=1.3;for(let k=-3;k<=3;k++){x.beginPath();x.moveTo(k*s*.13,-s*.45);x.lineTo(k*s*.13,s*.45);x.stroke()}x.beginPath();x.moveTo(-s*.45,0);x.lineTo(s*.45,0);x.stroke();x.fillStyle=MPL.GOLD;x.beginPath();x.arc(0,0,1.6,0,6.3);x.fill();x.strokeStyle=INK;x.lineWidth=.6;x.stroke()}
    x.restore()}
  /* the stair: stone steps running east with an arrow */
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(rows[j][i]!=='X')continue;x.save();x.fillStyle='#c4b48c';x.fillRect(X(i),Y(j)-.5,s,s+1);x.strokeStyle=INK;x.lineWidth=.8;x.strokeRect(X(i),Y(j),s,s);for(let k=1;k<5;k++){x.beginPath();x.moveTo(X(i)+k*s/5,Y(j)+k*.4);x.lineTo(X(i)+k*s/5,Y(j)+s-k*.4);x.stroke()}x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(X(i)+s*.15,Y(j)+s*.32);x.lineTo(X(i)+s*.62,Y(j)+s*.5);x.lineTo(X(i)+s*.15,Y(j)+s*.68);x.closePath();x.fill();x.stroke();x.restore()}
  /* rat marks: paw prints trailing from the rat spawns, gnawed corners */
  for(const e of (L.enemies||[])){if(e.k==='rat'||e.t==='rat'||e.type==='rat'){for(let k=0;k<5;k++){const ang=hash2(e.x,e.y+k,8)*6.28;mpAbbeyPaw(x,X(e.x+.5)+Math.cos(ang)*(1+k*2.6),Y(e.y+.5)+Math.sin(ang)*(1+k*2.6),ang+Math.PI/2,1.15)}}}
  for(const p of [[2.5,5.6],[8.4,9.4],[3.4,12.5],[12.5,7.5],[16.5,10.7],[11.5,18.5]]){for(let k=0;k<3;k++)mpAbbeyPaw(x,X(p[0])+k*3.5,Y(p[1])-k*4,-.4+k*.1,1)}
  /* props from the real decor */
  for(const d of L.decor){const px=X(d.x+.5),py=Y(d.y+.5);if(d.k==='coffin')mpAbbeyCoffin(x,px,py,s*.95);else if(d.k==='bones')mpAbbeyBones(x,px,py,.9);else if(d.k==='barrel')mpAbbeyBarrel(x,px,py,.95);else if(d.k==='cart')mpAbbeyCart(x,px,py,1.05)}
  /* the Rat King's mark on the floor of his chamber: a vermilion ring, a crown and bones */
  {const bx=X(24.5),by=Y(16.5);x.save();x.strokeStyle=MPL.VERM;x.lineWidth=1.1;x.setLineDash([2.5,2]);x.beginPath();x.arc(bx,by,s*1.05,0,6.3);x.stroke();x.setLineDash([]);x.restore();mpAbbeyCrown(x,bx,by-1,1.2);I.skull(x,bx-s*1.9,by+s*1.9,.9);I.skull(x,bx+s*1.9,by+s*1.9,.9)}
  /* torch sconces: on wall edges, spread over the plan */
  const tor=[];for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!open(i,j)||!wall(i,j-1))continue;if(ch(i,j)==='D')continue;if(hash2(i,j,12)<.2&&!tor.some(t=>Math.hypot(t[0]-i,t[1]-j)<4))tor.push([i,j])}
  for(const t of tor)mpAbbeyTorch(x,X(t[0]+.5),Y(t[1])+s*.55,.9);
  /* names */
  const names=(L.mapNames&&L.mapNames.length)?L.mapNames:MPABBEY_NAMES;
  for(const n of names){const px=X(n.x),py=Y(n.y);if(n.k==='stair')api.text(x,n.t,px,py,6.2,MPL.VERM);else api.text(x,n.t,px,py,n.t.length>12?6.6:6.8,'#2a1a0c')}
  /* title, key, notes, compass */
  api.title(x,'Abbey Crypts','Level 1');
  const kx=7,ky=50,kw=80;api.panel(x,kx,ky,kw,108);api.text(x,'KEY',kx+kw/2,ky+8,7,MPL.LAPIS);
  const rowsK=[['Stone wall',()=>{x.fillStyle='#a89068';x.fillRect(kx+6,ky+16,12,7);x.strokeStyle='rgba(42,26,12,.7)';x.lineWidth=.6;for(let k=0;k<14;k+=2.5){x.beginPath();x.moveTo(kx+6+k,ky+16);x.lineTo(kx+k-1,ky+23);x.stroke()}x.strokeStyle=INK;x.strokeRect(kx+6,ky+16,12,7)}],
    ['Door',()=>{x.fillStyle='#7a4a24';x.fillRect(kx+10,ky+28,4,10);x.strokeStyle=INK;x.lineWidth=.8;x.strokeRect(kx+10,ky+28,4,10)}],
    ['Iron gate',()=>{x.strokeStyle='#3a3a48';x.lineWidth=1.2;for(let k=0;k<4;k++){x.beginPath();x.moveTo(kx+8+k*3,ky+43);x.lineTo(kx+8+k*3,ky+51);x.stroke()}}],
    ['Coffin',()=>mpAbbeyCoffin(x,kx+12,ky+62,5)],
    ['Bones',()=>mpAbbeyBones(x,kx+12,ky+73,.8)],
    ['Rat marks',()=>{mpAbbeyPaw(x,kx+9,ky+85,-.4,.9);mpAbbeyPaw(x,kx+15,ky+82,-.3,.9)}],
    ['Torch',()=>mpAbbeyTorch(x,kx+12,ky+96,.8)]];
  const gaps=[19.5,33,47,62,73,85,98];
  rowsK.forEach((r,i)=>{r[1]();api.text(x,r[0],kx+25,ky+gaps[i]+(i===3?0:0),6.4,'#3a2a1c','left')});
  const nx=391,nw=84;api.panel(x,nx-2,50,nw,176);
  mplNotes(x,['The party starts in the south west cell.','Rats nest in the Rat Run and the passages.','Four coffins stand in the Crypt of Coffins.','The Rat King waits behind the iron gate. The stair down is on his east wall.'],nx+3,69,nw-9,6.2,4);
  api.compass(x,46,246,15);
  I.cross(x,46,276,.9);
}});
