/* Area map for Sale (level 600): a grim gothic town of the dead. Drawn from the real level data on cold, dusky parchment: Candle Street, Gibbet Square with its dead fountain and gibbet, the Sanctuary, the Belfry,
   Bell Lane, Charnel Row, Tanners' Lane, the Back Track, every house and shop with its own roof, the dead quarter and Hollin Farm shaded as dangerous ground, lamps and dead trees. It is shown whole (no fog of war).
   Also puts Sale on the world map (west of the road that is not yet open), and the Go to area list. The quest marks (gold ! and green ?) over the shopkeepers are laid on by maps_questmarks.js. */
function mpSaleFit(L){const A=MPL.AREA,s=3.5,ox=A.x+(A.w-SA.W*s)/2,oy=A.y+(A.h-SA.H*s)/2;return {s,ox,oy,X:c=>ox+c*s,Y:r=>oy+r*s}}
const MPSA_WALL={sa_slate:'#b4b8c4',sa_moss:'#a8b49c',sa_black:'#7a7a88',sa_bone:'#e0d8c4',sa_brick:'#b88878',sa_ash:'#bab6b0'};
const MPSA_ROOF={sa_rf_1:['#5a6678','#434d5c'],sa_rf_2:['#8a8a90','#686870'],sa_rf_3:['#5e7a56','#465e40'],sa_rf_4:['#4a4a56','#34343e'],sa_rf_5:['#6e4e6c','#523a52'],sa_rf_6:['#9a4a38','#74362a'],sa_rf_7:['#7a5a4a','#5c4236'],sa_rf_8:['#8a7e5a','#6a603e'],sa_rf_9:['#6a5e5e','#4e4444']};
function mpSaleHouse(x,h,F){
  const s=F.s,X0=F.X(h.x0),Y0=F.Y(h.y0),W=(h.x1-h.x0+1)*s,Hh=(h.y1-h.y0+1)*s,wall=MPSA_WALL[h.sty]||'#b8b4ac',[hi,lo]=MPSA_ROOF[h.rk]||MPSA_ROOF.sa_rf_1,m=Math.max(.5,s*.14);
  x.save();x.fillStyle='rgba(30,24,30,.35)';x.fillRect(X0+1.2,Y0+1.4,W,Hh);
  x.fillStyle=wall;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(X0,Y0,W,Hh);x.strokeRect(X0,Y0,W,Hh);
  const horiz=W>=Hh,rx=X0+m,ry=Y0+m,rw=W-2*m,rh=Hh-2*m;
  x.fillStyle=hi;if(horiz){x.fillRect(rx,ry,rw,rh/2);x.fillStyle=lo;x.fillRect(rx,ry+rh/2,rw,rh/2)}else{x.fillRect(rx,ry,rw/2,rh);x.fillStyle=lo;x.fillRect(rx+rw/2,ry,rw/2,rh)}
  x.strokeStyle='rgba(20,15,25,.4)';x.lineWidth=.3;if(horiz){for(let yy=ry+1.1;yy<ry+rh;yy+=1.1){x.beginPath();x.moveTo(rx,yy);x.lineTo(rx+rw,yy);x.stroke()}}else{for(let xx=rx+1.1;xx<rx+rw;xx+=1.1){x.beginPath();x.moveTo(xx,ry);x.lineTo(xx,ry+rh);x.stroke()}}
  if(h.spk){x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.strokeRect(X0-.7,Y0-.7,W+1.4,Hh+1.4)}
  x.fillStyle='#2a1a10';x.beginPath();x.arc(h.face==='E'?F.X(h.x1+1):h.face==='W'?F.X(h.x0):F.X(h.door[0]+.5),h.face==='S'?F.Y(h.y1+1):h.face==='N'?F.Y(h.y0):F.Y(h.door[1]+.5),1,0,6.3);x.fill();
  x.restore()}
mplInstall({name:'sale',levels:[600],tint:[-26,-22,-6],fit:mpSaleFit,
  foot:'You are the yellow arrow. The numbers on the map are the shops, listed on the right.',
  draw(c,x,L,api){
    const F=mpSaleFit(L),A=MPL.AREA,s=F.s,X=F.X,Y=F.Y,I=api.I,ink=MPL.INK,W=SA.W,H=SA.H;
    x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
    const gr=x.createLinearGradient(0,A.y,0,A.y+A.h);gr.addColorStop(0,'#b4b8a0');gr.addColorStop(1,'#9fa690');x.fillStyle=gr;x.fillRect(A.x,A.y,A.w,A.h);
    for(let i=0;i<150;i++){x.fillStyle=i%3?'rgba(80,90,70,.2)':'rgba(220,220,200,.18)';x.beginPath();x.ellipse(X(hash2(i,1,300)*W),Y(hash2(i,2,300)*H),3+hash2(i,3,300)*14,2+hash2(i,4,300)*6,hash2(i,5,300)*3,0,6.3);x.fill()}
    // the dangerous ground: the dead quarter and Hollin Farm, shaded dull red and hatched
    for(const z of SA_ZONES){x.fillStyle='rgba(150,60,50,.2)';x.fillRect(X(z.x0),Y(z.y0),(z.x1-z.x0+1)*s,(z.y1-z.y0+1)*s);x.strokeStyle='rgba(120,40,34,.5)';x.lineWidth=.7;x.setLineDash([3,2]);x.strokeRect(X(z.x0),Y(z.y0),(z.x1-z.x0+1)*s,(z.y1-z.y0+1)*s);x.setLineDash([]);
      x.save();x.beginPath();x.rect(X(z.x0),Y(z.y0),(z.x1-z.x0+1)*s,(z.y1-z.y0+1)*s);x.clip();x.strokeStyle='rgba(120,40,34,.22)';x.lineWidth=.5;for(let k=-80;k<(z.x1-z.x0+1)*s+80;k+=5){x.beginPath();x.moveTo(X(z.x0)+k,Y(z.y0));x.lineTo(X(z.x0)+k-(z.y1-z.y0+1)*s*.6,Y(z.y1+1));x.stroke()}x.restore()}
    // the square
    {const S=SA_SQ;x.fillStyle='#cfcbc0';x.strokeStyle='rgba(30,24,30,.6)';x.lineWidth=.7;x.fillRect(X(S.x0),Y(S.y0),(S.x1-S.x0+1)*s,(S.y1-S.y0+1)*s);x.strokeRect(X(S.x0),Y(S.y0),(S.x1-S.x0+1)*s,(S.y1-S.y0+1)*s);
      x.strokeStyle='rgba(60,60,70,.3)';x.lineWidth=.3;for(let xx=S.x0;xx<=S.x1+1;xx+=1.5){x.beginPath();x.moveTo(X(xx),Y(S.y0));x.lineTo(X(xx),Y(S.y1+1));x.stroke()}}
    // roads
    const road=(x0,y0,x1,y1,col,w)=>{x.strokeStyle='rgba(30,24,30,.55)';x.lineWidth=w*s+1.1;x.lineCap='butt';x.beginPath();x.moveTo(X(x0+.5),Y(y0+.5));x.lineTo(X(x1+.5),Y(y1+.5));x.stroke();x.strokeStyle=col;x.lineWidth=w*s;x.beginPath();x.moveTo(X(x0+.5),Y(y0+.5));x.lineTo(X(x1+.5),Y(y1+.5));x.stroke()};
    for(const r of SA_ROADS)road(r[0],r[1],r[2],r[3],r[4]==='0'?'#d6d2c6':'#b8a888',r[4]==='0'?1:.9);
    // the boundary wall
    x.strokeStyle='#5a5a66';x.lineWidth=2;x.strokeRect(X(3),Y(3),66*s,66*s);x.strokeStyle=ink;x.lineWidth=.5;x.strokeRect(X(3)-1,Y(3)-1,66*s+2,66*s+2);x.strokeRect(X(3)+1,Y(3)+1,66*s-2,66*s-2);
    // the east gate, iron, between two posts
    x.fillStyle='#4a4a56';x.strokeStyle=ink;x.lineWidth=.6;x.fillRect(X(68.6),Y(35.2),3.2,2.2*s);x.strokeRect(X(68.6),Y(35.2),3.2,2.2*s);
    // decor: dead trees, stones, bones
    const trees=[];for(const d of L.decor){const k=d.k;
      if(k==='gy_dead'||k==='gy_yew')trees.push(d);
      else if(/^gy_(stone1|stone2|lean|wcross)$/.test(k)){x.fillStyle='#aaa6a0';x.strokeStyle=ink;x.lineWidth=.3;x.beginPath();x.arc(X(d.x+.5),Y(d.y+.7),.9,Math.PI,0);x.lineTo(X(d.x+.5)+.9,Y(d.y+.7)+.8);x.lineTo(X(d.x+.5)-.9,Y(d.y+.7)+.8);x.closePath();x.fill();x.stroke()}
      else if(k==='hay'){x.fillStyle='#c8b060';x.strokeStyle=ink;x.lineWidth=.35;x.beginPath();x.arc(X(d.x+.5),Y(d.y+.6),1.1,Math.PI,0);x.closePath();x.fill();x.stroke()}
      else if(k==='gy_bones'){x.fillStyle='#efe8d8';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),.5,0,6.3);x.fill()}}
    // the houses and shops
    for(const h of SA_HOUSES)mpSaleHouse(x,h,F);
    // the Sanctuary: a gothic chapel with a spire, and the Belfry, a black tower
    {const C=SA_CHAPEL,a=X(C.x0),b=Y(C.y0),w=(C.x1-C.x0+1)*s,hh=(C.y1-C.y0+1)*s;x.fillStyle='rgba(30,24,30,.35)';x.fillRect(a+1.4,b+1.6,w,hh);x.fillStyle='#bab6b0';x.strokeStyle=ink;x.lineWidth=.7;x.fillRect(a,b,w,hh);x.strokeRect(a,b,w,hh);
      x.fillStyle='#8a8a90';x.fillRect(a+1.2,b+1.2,w-2.4,hh/2-1.2);x.fillStyle='#686870';x.fillRect(a+1.2,b+hh/2,w-2.4,hh/2-1.2);
      x.fillStyle='#bab6b0';x.fillRect(a-2.4,b+hh-5.4,6.4,6.4);x.strokeRect(a-2.4,b+hh-5.4,6.4,6.4);x.fillStyle='#4a4a56';x.beginPath();x.moveTo(a-3,b+hh-5.4);x.lineTo(a+.8,b+hh-11);x.lineTo(a+4.6,b+hh-5.4);x.closePath();x.fill();x.stroke();
      x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.strokeRect(a-.6,b-.6,w+1.2,hh+1.2);
      x.fillStyle='#2a1a10';x.fillRect(X(34),Y(29.2),s,.5*s);}
    {const B=SA_BELFRY,a=X(B.x0),b=Y(B.y0),w=(B.x1-B.x0+1)*s,hh=(B.y1-B.y0+1)*s;x.fillStyle='rgba(30,24,30,.4)';x.fillRect(a+1.4,b+1.6,w,hh);x.fillStyle='#5a5a66';x.strokeStyle=ink;x.lineWidth=.7;x.fillRect(a,b,w,hh);x.strokeRect(a,b,w,hh);x.fillStyle='#34343e';x.fillRect(a+2,b+2,w-4,hh-4);I.tower(x,a+w/2,b+hh*.7,.8)}
    // the crypt gate and the gibbet, the fountain, the lamps
    {const G0=SA_CRYPTGATE;x.fillStyle='#34343e';x.strokeStyle=ink;x.lineWidth=.5;x.fillRect(X(G0.x-.6),Y(G0.y),2.2*s,s);x.strokeRect(X(G0.x-.6),Y(G0.y),2.2*s,s);I.skull(x,X(G0.x+.5),Y(G0.y+2.2),.55)}
    x.strokeStyle=ink;x.lineWidth=.9;x.beginPath();x.moveTo(X(38.5),Y(34));x.lineTo(X(38.5),Y(31.8));x.lineTo(X(40),Y(31.8));x.moveTo(X(40),Y(31.8));x.lineTo(X(40),Y(32.6));x.stroke();
    x.fillStyle='#d0ccc0';x.strokeStyle=ink;x.lineWidth=.5;x.beginPath();x.arc(X(35.5),Y(38.5),1.9,0,6.3);x.fill();x.stroke();x.fillStyle='#8a8a94';x.beginPath();x.arc(X(35.5),Y(38.5),1.1,0,6.3);x.fill();
    trees.sort((p,q)=>p.y-q.y);for(const d of trees){const a=X(d.x+.5),b=Y(d.y+.6);I.tree(x,a,b+1,.5+hash2(d.x,d.y,9)*.12,'#59604a')}
    for(const [lx,ly] of L.lights){x.fillStyle='rgba(255,220,130,.35)';x.beginPath();x.arc(X(lx+.5),Y(ly+.5),2.4,0,6.3);x.fill();x.fillStyle=MPL.GOLD2;x.strokeStyle=ink;x.lineWidth=.4;x.beginPath();x.arc(X(lx+.5),Y(ly+.5),.8,0,6.3);x.fill();x.stroke()}
    // names
    const nm=(t,cx,cy,sz,col)=>api.text(x,t,X(cx),Y(cy),sz,col);
    nm('Candle Street',14,34.4,4.4,'#3a2a3c');nm('Gibbet Square',35,43.6,4.6,'#7a1c1c');nm('Bell Lane',63,27,3.8,'#3a2a3c');nm('Charnel Row',14,56,3.8,'#3a2a3c');nm("Tanners' Lane",46,52,3.8,'#3a2a3c');nm('Back Track',42,59.8,3.8,'#3a2a3c');
    nm('The Sanctuary',34.5,23.6,4.6,'#7a1c1c');nm('The Belfry',57,13.4,4.4,'#7a1c1c');nm('The Dead Quarter',17,66.2,4.6,'#8a2a1c');nm('Hollin Farm',62.5,54.4,4.2,'#8a2a1c');nm('The Crypt',20.5,66.6,3.8,'#3a2a3c');
    api.text(x,'East gate',X(65),Y(33.5),3.6,MPL.LAPIS);api.text(x,'(the road is not built yet)',X(64),Y(39.2),3.4,'#7a2a1a');
    // numbered discs over the shops
    const disc=(a,b,n)=>{x.fillStyle=MPL.GOLD2;x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.arc(a,b,2.5,0,6.3);x.fill();x.stroke();x.fillStyle=ink;x.font=`bold 3.6px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),a,b+.2)};
    const PL=[];let n=0;for(const h of SA_HOUSES){if(!h.spk)continue;n++;PL.push([n,h.name]);disc(X((h.x0+h.x1+1)/2),h.face==='S'?Y(h.y0)-1.6:Y(h.y1+1)+1.6,n)}
    n++;PL.push([n,'The Sanctuary (barred)']);disc(X(34.5),Y(24.2),n);
    x.restore();
    x.strokeStyle=ink;x.lineWidth=1;x.strokeRect(A.x,A.y,A.w,A.h);x.strokeStyle=MPL.GOLD;x.lineWidth=1.6;x.strokeRect(A.x+1.5,A.y+1.5,A.w-3,A.h-3);
    api.title(x,'Sale','A town of the dead');
    x.save();x.fillStyle='#5a2a2a';x.strokeStyle=ink;x.lineWidth=.7;x.beginPath();x.moveTo(6,214);x.lineTo(88,214);x.lineTo(83,222);x.lineTo(88,230);x.lineTo(6,230);x.lineTo(11,222);x.closePath();x.fill();x.stroke();x.restore();x.save();x.fillStyle='#ecdcc0';x.font=`bold 7px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.fillText('Keep to the Streets',47,222.4);x.restore();
    api.compass(x,438,58,14);
    api.panel(x,6,52,82,80);api.text(x,'About Sale',47,61,7.2,MPL.LAPIS);
    api.notes(x,['A small town of black stone, dusk and fog. Ghosts keep the streets and mean no harm.','Every shop is barricaded. The dead quarter (red) and Hollin Farm are not safe.'],11,71,70,5.9,3);
    api.panel(x,6,138,82,72);api.text(x,'Key',47,147,7.2,MPL.LAPIS);
    [['House, shop',()=>mpSaleHouse(x,{x0:0,x1:1,y0:0,y1:1,sty:'sa_slate',rk:'sa_rf_1',face:'S',door:[0,1],front:[0,2],spk:'k'},{s:5,X:v=>12+v*5,Y:v=>153+v*5-4})],['Dangerous ground',()=>{x.fillStyle='rgba(150,60,50,.3)';x.fillRect(12,166,12,5);x.strokeStyle='rgba(120,40,34,.7)';x.lineWidth=.6;x.setLineDash([3,2]);x.strokeRect(12,166,12,5);x.setLineDash([])}],['Lamp',()=>{x.fillStyle=MPL.GOLD2;x.strokeStyle=ink;x.lineWidth=.4;x.beginPath();x.arc(16,181,1.6,0,6.3);x.fill();x.stroke()}],['Crypt gate',()=>I.skull(x,16,194,.7)]].forEach(([t,f],i)=>{try{f()}catch(e){}api.text(x,t,28,[158,168,181,194][i]+(i===0?2:0),5.2,'#3a2a1c','left')});
    api.panel(x,392,74,86,PL.length*7.5+16);api.text(x,'Places',435,82,7.2,MPL.LAPIS);
    PL.forEach(([k,t],i)=>api.text(x,k+' '+t.replace(/^The /,'').replace(', Weaponsmiths','').replace('Stroud and Daughter','Stroud and Daughter').replace(', Mourning Tailor','').replace(', Jewellers',''),396,91+i*7.5,4.4,'#3a2a1c','left'));
  }});
/* the whole town is shown, not fogged */
{const _f=mplFogOn;mplFogOn=function(L){if(LEVEL===SA.ID)return false;return _f.apply(this,arguments)}}
/* Sale on the world map, in the far west beyond the road that is not yet open, and in the Go to area list */
if(typeof WORLD_LOCS!=='undefined'&&!WORLD_LOCS.some(l=>l.k==='sale'))WORLD_LOCS.push({k:'sale',n:'Sale',sub:'a town of the dead',lv:[600,601,602,603].concat(SA.STUBS,Array.from({length:100},(_,i)=>SA.H0+i)),x:-462,y:292,ic:'town'});
if(typeof QWORLD!=='undefined')QWORLD.Sale='sale';
if(typeof WORLD_ROADS!=='undefined'&&!WORLD_ROADS.some(r=>r.join()==='westgate,sale'))WORLD_ROADS.push(['westgate','sale']);
if(typeof WMN_SPEC!=='undefined')WMN_SPEC.sale=[['i_town',-5,0,26],['i_graves',13,1,16]];   // a town with its burial ground
{const _gl=gotoListRaw;gotoListRaw=function(){const out=_gl.apply(this,arguments);try{const rows=[{h:'Sale, a town of the dead (level 90)'}];for(const n of [600,601,602,603]){if(LEVELS[n]||KH_LAZY[n])rows.push({n,name:LEVEL_NAMES[n]||('Level '+n)})}
  for(const d of SA_DOORS.filter(d=>d.shop).slice(0,3))if(KH_LAZY[d.id])rows.push({n:d.id,name:LEVEL_NAMES[d.id]||d.name});
  const i=out.findIndex(r=>r.h&&/^Oldhaven/.test(r.h));out.splice(i<0?out.length:i,0,...rows)}catch(e){console.error('sagoto',e)}return out}}
