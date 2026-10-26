/* Area map for Wenlock (level 496): an English market town. Drawn from the real level data: the meadows and the green, the brook with its two rows of water and the stone bridge, the duck pond,
   the cobbled High Street, the gravel lanes and the dirt back track, the square with its well, cross and stalls, every cottage and shop with its own walls and roof, the church of Saint Wenna with its tower and the graves, the trees,
   lamps and the lych-gate. Parchment, a ribbon with the town's name, a key, a compass and the places listed on the right. See maps_common.js. Also puts Wenlock on the world map and in the Go to area list. */
function mpWenlockFit(L){const A=MPL.AREA,s=2.6,ox=A.x+(A.w-100*s)/2,oy=A.y+(A.h-100*s)/2;return {s,ox,oy,X:c=>ox+c*s,Y:r=>oy+r*s}}
const MPWL_WALL={timber:'#efe2c0',honey:'#e2b872',brick:'#c0603c',white:'#f4efe2',flint:'#9a9a94',black:'#eadcc0'};
const MPWL_ROOF={thatch:['#d2ac4a','#b08a2e'],thatch2:['#c49a40','#9a7426'],tile:['#c8502e','#9a381e'],tile2:['#b4623a','#8a4426'],slate:['#5a6678','#434d5c'],stone:['#9a9484','#767060'],moss:['#6e8a50','#506a38'],red:['#c04030','#962e20'],shingle:['#8a6a46','#6a4e30'],plum:['#7a5a74','#5a405a'],dark:['#4a4c54','#34363c'],sage:['#7a9a80','#587a60'],blue:['#4a6a9a','#34507a'],brown:['#8a5e3a','#6a4426']};
function mpWenlockHouse(x,h,F){
  const s=F.s,X0=F.X(h.x0),Y0=F.Y(h.y0),W=(h.x1-h.x0+1)*s,Hh=(h.y1-h.y0+1)*s,wall=MPWL_WALL[h.sty]||'#eadcc0',[hi,lo]=MPWL_ROOF[h.rk]||MPWL_ROOF.tile,m=Math.max(.5,s*.14);
  x.save();x.fillStyle='rgba(60,40,20,.28)';x.fillRect(X0+1.2,Y0+1.4,W,Hh);
  x.fillStyle=wall;x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(X0,Y0,W,Hh);x.strokeRect(X0,Y0,W,Hh);
  const horiz=W>=Hh,rx=X0+m,ry=Y0+m,rw=W-2*m,rh=Hh-2*m;
  x.fillStyle=hi;if(horiz){x.fillRect(rx,ry,rw,rh/2);x.fillStyle=lo;x.fillRect(rx,ry+rh/2,rw,rh/2)}else{x.fillRect(rx,ry,rw/2,rh);x.fillStyle=lo;x.fillRect(rx+rw/2,ry,rw/2,rh)}
  x.strokeStyle='rgba(30,15,5,.35)';x.lineWidth=.3;if(horiz){for(let yy=ry+1.1;yy<ry+rh;yy+=1.1){x.beginPath();x.moveTo(rx,yy);x.lineTo(rx+rw,yy);x.stroke()}x.strokeStyle='#fff4d0';x.lineWidth=.5;x.beginPath();x.moveTo(rx,ry+rh/2);x.lineTo(rx+rw,ry+rh/2);x.stroke()}
  else{for(let xx=rx+1.1;xx<rx+rw;xx+=1.1){x.beginPath();x.moveTo(xx,ry);x.lineTo(xx,ry+rh);x.stroke()}x.strokeStyle='#fff4d0';x.lineWidth=.5;x.beginPath();x.moveTo(rx+rw/2,ry);x.lineTo(rx+rw/2,ry+rh);x.stroke()}
  if(h.sp&&h.sp.kind){x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.strokeRect(X0-.7,Y0-.7,W+1.4,Hh+1.4)}
  const dx=F.X(h.front[0]+.5),dy=F.Y(h.front[1]+.5);x.fillStyle='#3e2410';x.beginPath();x.arc(h.face==='E'?F.X(h.x1+1):h.face==='W'?F.X(h.x0):F.X(h.door[0]+.5),h.face==='S'?F.Y(h.y1+1):h.face==='N'?F.Y(h.y0):F.Y(h.door[1]+.5),1,0,6.3);x.fill();
  x.restore()}
mplInstall({name:'wenlock',levels:[496],tint:[2,6,0],fit:mpWenlockFit,
  foot:'You are the yellow arrow. The numbers on the map are listed on the right.',
  draw(c,x,L,api){
    const F=mpWenlockFit(L),A=MPL.AREA,s=F.s,X=F.X,Y=F.Y,I=api.I,ink=MPL.INK,W=100,H=100;
    x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
    // meadows: a pale green wash with drifts of darker and lighter grass
    const gr=x.createLinearGradient(0,A.y,0,A.y+A.h);gr.addColorStop(0,'#cfd89e');gr.addColorStop(1,'#bccf90');x.fillStyle=gr;x.fillRect(A.x,A.y,A.w,A.h);
    for(let i=0;i<150;i++){x.fillStyle=i%3?'rgba(120,150,80,.18)':'rgba(240,240,190,.22)';x.beginPath();x.ellipse(X(hash2(i,1,300)*W),Y(hash2(i,2,300)*H),4+hash2(i,3,300)*18,2+hash2(i,4,300)*7,hash2(i,5,300)*3,0,6.3);x.fill()}
    // the south meadow across the brook, a little greener and yellower
    x.fillStyle='rgba(200,214,120,.35)';x.fillRect(X(3),Y(87),96*s,10*s);
    // the village green and the churchyard, lawn
    x.fillStyle='rgba(150,190,100,.55)';x.beginPath();x.ellipse(X(28.5),Y(68),12.5*s,12.5*s,0,0,6.3);x.fill();x.strokeStyle='rgba(60,100,40,.45)';x.lineWidth=.6;x.stroke();
    x.fillStyle='rgba(120,160,90,.4)';x.fillRect(X(13),Y(12),23*s,15*s);x.strokeStyle='rgba(60,50,30,.5)';x.lineWidth=.7;x.strokeRect(X(13),Y(12),23*s,15*s);
    // the brook: two rows of water, with a pale bank, ripples, and the bridge
    const bk=WL_BROOK;
    x.strokeStyle='#e8dcb0';x.lineWidth=3.2*s;x.lineCap='round';x.beginPath();for(let xx=3;xx<=96;xx+=.5){const px=X(xx),py=Y(bk(xx)+1);xx===3?x.moveTo(px,py):x.lineTo(px,py)}x.stroke();
    x.strokeStyle='#6aa4c8';x.lineWidth=2.1*s;x.beginPath();for(let xx=3;xx<=96;xx+=.5){const px=X(xx),py=Y(bk(xx)+1);xx===3?x.moveTo(px,py):x.lineTo(px,py)}x.stroke();
    x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=.4;for(let i=0;i<60;i++){const xx=4+hash2(i,1,301)*91,a=X(xx),b=Y(bk(xx)+.6+hash2(i,2,301)*.9);x.beginPath();x.moveTo(a-2,b);x.quadraticCurveTo(a,b-1,a+2,b);x.stroke()}
    // the duck pond
    {const P=WL_GREEN.pond;x.fillStyle='#e8dcb0';x.beginPath();x.ellipse(X((P[0]+P[2]+1)/2),Y((P[1]+P[3]+1)/2),(P[2]-P[0]+2.2)*s/2,(P[3]-P[1]+2.2)*s/2,0,0,6.3);x.fill();x.fillStyle='#6aa4c8';x.strokeStyle=ink;x.lineWidth=.5;x.beginPath();x.ellipse(X((P[0]+P[2]+1)/2),Y((P[1]+P[3]+1)/2),(P[2]-P[0]+1.2)*s/2,(P[3]-P[1]+1.2)*s/2,0,0,6.3);x.fill();x.stroke();
      x.fillStyle='#f4f0e0';for(const [dx,dy] of [[-1,-.6],[.8,.4],[0,1.2]]){x.beginPath();x.ellipse(X((P[0]+P[2]+1)/2)+dx*s,Y((P[1]+P[3]+1)/2)+dy*s,.9,.6,0,0,6.3);x.fill()}}
    // roads: the cobbled High Street, the gravel lanes, the dirt back track, the square
    const road=(x0,y0,x1,y1,col,w)=>{x.strokeStyle='rgba(60,40,20,.55)';x.lineWidth=w*s+1.1;x.lineCap='butt';x.beginPath();x.moveTo(X(x0+.5),Y(y0+.5));x.lineTo(X(x1+.5),Y(y1+.5));x.stroke();x.strokeStyle=col;x.lineWidth=w*s;x.beginPath();x.moveTo(X(x0+.5),Y(y0+.5));x.lineTo(X(x1+.5),Y(y1+.5));x.stroke()};
    road(3,50,96,50,'#d9cba4',1);road(24,26,24,49,'#d8c496',.9);road(72,51,72,86,'#d8c496',.9);road(84,14,84,49,'#d8c496',.9);road(38,14,92,14,'#b8905a',.85);
    x.strokeStyle='rgba(120,90,50,.55)';x.lineWidth=.4;x.setLineDash([1.4,1.4]);x.beginPath();x.moveTo(X(38),Y(14.5));x.lineTo(X(93),Y(14.5));x.stroke();x.setLineDash([]);
    {const S=WL_SQUARE;x.fillStyle='#e6dcc0';x.strokeStyle='rgba(60,40,20,.55)';x.lineWidth=.7;x.fillRect(X(S.x0),Y(S.y0),(S.x1-S.x0+1)*s,(S.y1-S.y0+1)*s);x.strokeRect(X(S.x0),Y(S.y0),(S.x1-S.x0+1)*s,(S.y1-S.y0+1)*s);
      x.strokeStyle='rgba(120,100,70,.25)';x.lineWidth=.3;for(let xx=S.x0;xx<=S.x1+1;xx+=1.5){x.beginPath();x.moveTo(X(xx),Y(S.y0));x.lineTo(X(xx),Y(S.y1+1));x.stroke()}}
    road(30,51,30,64,'#d8c496',.7);road(19,60,38,60,'#d8c496',.7);
    // the bridge: stone, with parapets
    x.fillStyle='#b8b09c';x.strokeStyle=ink;x.lineWidth=.6;x.fillRect(X(70.6),Y(83.8),3.8*s,2.4*s);x.strokeRect(X(70.6),Y(83.8),3.8*s,2.4*s);x.fillStyle='#d8c496';x.fillRect(X(72),Y(83.8),s,2.4*s);x.strokeStyle='#807860';x.lineWidth=.5;x.beginPath();x.moveTo(X(70.6),Y(83.8));x.lineTo(X(74.4),Y(83.8));x.moveTo(X(70.6),Y(86.2));x.lineTo(X(74.4),Y(86.2));x.stroke();
    // the boundary wall: a low flint wall round the town
    x.strokeStyle='#8a8478';x.lineWidth=2;x.strokeRect(X(3),Y(3),94*s,94*s);x.strokeStyle=ink;x.lineWidth=.5;x.strokeRect(X(3)-1,Y(3)-1,94*s+2,94*s+2);x.strokeRect(X(3)+1,Y(3)+1,94*s-2,94*s-2);
    // the gates: the lych-gate east (to the gardens) and the western gate (shut)
    x.fillStyle='#8a5a2c';x.strokeStyle=ink;x.lineWidth=.6;x.fillRect(X(96.2),Y(48.9),3.2,2.2*s);x.strokeRect(X(96.2),Y(48.9),3.2,2.2*s);x.fillStyle=MPL.LAPIS;x.beginPath();x.moveTo(X(95.6),Y(48.5));x.lineTo(X(97.9),Y(47.2));x.lineTo(X(100.2),Y(48.5));x.closePath();x.fill();x.stroke();
    x.fillStyle='#8a5a2c';x.fillRect(X(1.2),Y(48.9),3.2,2.2*s);x.strokeRect(X(1.2),Y(48.9),3.2,2.2*s);x.fillStyle='#7a7a82';x.beginPath();x.moveTo(X(.6),Y(48.5));x.lineTo(X(2.9),Y(47.2));x.lineTo(X(5.2),Y(48.5));x.closePath();x.fill();x.stroke();
    // orchard and allotment bits from the decor, then trees
    const trees=[];for(const d of L.decor){const k=d.k;
      if(/^ltree/.test(k))trees.push(d);else if(k==='lbush0'){x.fillStyle='#6a8a4a';x.strokeStyle=ink;x.lineWidth=.3;x.beginPath();x.arc(X(d.x+.5),Y(d.y+.6),1.1,0,6.3);x.fill();x.stroke()}
      else if(k==='hay'){x.fillStyle='#d8b84a';x.strokeStyle=ink;x.lineWidth=.35;x.beginPath();x.arc(X(d.x+.5),Y(d.y+.6),1.2,Math.PI,0);x.closePath();x.fill();x.stroke()}
      else if(k==='grave'||k==='grave2'){x.fillStyle='#aaa498';x.strokeStyle=ink;x.lineWidth=.3;x.beginPath();x.arc(X(d.x+.5),Y(d.y+.7),.9,Math.PI,0);x.lineTo(X(d.x+.5)+.9,Y(d.y+.7)+.8);x.lineTo(X(d.x+.5)-.9,Y(d.y+.7)+.8);x.closePath();x.fill();x.stroke()}
      else if(k==='cross'||k==='memorial'){I.cross(x,X(d.x+.5),Y(d.y+.5),.5)}
      else if(/^kh_stall1_/.test(k)){x.fillStyle=['#3a7a5a','#b8321e','#274a9a','#d28a2a','#4a7a3a','#c8a040'][+k.slice(-1)];x.strokeStyle=ink;x.lineWidth=.35;x.fillRect(X(d.x),Y(d.y+.2),s,s*.8);x.strokeRect(X(d.x),Y(d.y+.2),s,s*.8);x.fillStyle='#fff4d0';for(let q=0;q<3;q++)x.fillRect(X(d.x)+q*s/3,Y(d.y+.2),s/6,s*.3)}
      else if(k==='kh_ohgard1_0'){x.fillStyle='#e8dcb0';x.strokeStyle=ink;x.lineWidth=.4;x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),1.9,0,6.3);x.fill();x.stroke();x.fillStyle='#8ab8d8';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),1.2,0,6.3);x.fill()}
      else if(d.npc==='wlo_well'){x.fillStyle='#a8a090';x.strokeStyle=ink;x.lineWidth=.5;x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),1.9,0,6.3);x.fill();x.stroke();x.fillStyle='#2a4a6a';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),1.1,0,6.3);x.fill();x.fillStyle=MPL.VERM;x.beginPath();x.moveTo(X(d.x+.5)-2.6,Y(d.y+.5)-1.8);x.lineTo(X(d.x+.5),Y(d.y+.5)-4);x.lineTo(X(d.x+.5)+2.6,Y(d.y+.5)-1.8);x.closePath();x.fill();x.stroke()}}
    // scenery flowers
    for(const d of L.scenery){if(/lflora/.test(d.k)){x.fillStyle=['#e0506a','#f0c040','#e8e8f0','#b070d0'][(d.wx*3+d.wy)%4|0];x.beginPath();x.arc(X(d.wx),Y(d.wy),.55,0,6.3);x.fill()}}
    // houses and shops
    for(const h of WL_HOUSES)mpWenlockHouse(x,h,F);
    // the church of Saint Wenna: a long nave, a tower, a cross
    {const C=WL_CHURCH,a=X(C.x0),b=Y(C.y0),w=(C.x1-C.x0+1)*s,hh=(C.y1-C.y0+1)*s;x.fillStyle='rgba(60,40,20,.3)';x.fillRect(a+1.4,b+1.6,w,hh);x.fillStyle='#e6d6a8';x.strokeStyle=ink;x.lineWidth=.7;x.fillRect(a,b,w,hh);x.strokeRect(a,b,w,hh);
      x.fillStyle='#6a7280';x.fillRect(a+1.2,b+1.2,w-2.4,hh/2-1.2);x.fillStyle='#525a68';x.fillRect(a+1.2,b+hh/2,w-2.4,hh/2-1.2);
      x.fillStyle='#d8c898';x.strokeStyle=ink;x.fillRect(a-2.4,b+hh-5.4,6.4,6.4);x.strokeRect(a-2.4,b+hh-5.4,6.4,6.4);x.fillStyle='#5a3a2c';x.beginPath();x.moveTo(a-3,b+hh-5.4);x.lineTo(a+.8,b+hh-10.5);x.lineTo(a+4.6,b+hh-5.4);x.closePath();x.fill();x.stroke();
      x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.beginPath();x.moveTo(a+.8,b+hh-10.5);x.lineTo(a+.8,b+hh-13);x.moveTo(a-.4,b+hh-11.8);x.lineTo(a+2,b+hh-11.8);x.stroke();
      x.strokeStyle=MPL.GOLD;x.lineWidth=.9;x.strokeRect(a-.6,b-.6,w+1.2,hh+1.2)}
    // trees on top, back to front
    trees.sort((p,q)=>p.y-q.y);for(const d of trees){const a=X(d.x+.5),b=Y(d.y+.6);I.tree(x,a,b+1,.5+hash2(d.x,d.y,9)*.12,d.k==='ltree17'?'#a8503a':['#6a9a4e','#5a8a46','#7aa656'][Math.floor(hash2(d.x,d.y,3)*3)])}
    // lamps
    for(const [lx,ly] of L.lights){x.fillStyle='rgba(255,220,110,.4)';x.beginPath();x.arc(X(lx+.5),Y(ly+.5),2.6,0,6.3);x.fill();x.fillStyle=MPL.GOLD2;x.strokeStyle=ink;x.lineWidth=.4;x.beginPath();x.arc(X(lx+.5),Y(ly+.5),.9,0,6.3);x.fill();x.stroke()}
    // the folk: a few dots of colour on the green and in the square would be crowded; instead a few geese on the pond
    // names
    const nm=(t,cx,cy,sz,col)=>api.text(x,t,X(cx),Y(cy),sz,col);
    nm('High Street',66,48.2,4.6,'#5a3a1c');nm('Market Square',48,44.2,4.8,'#8a2a14');nm('Church Lane',19,38,3.8,'#5a3a1c');nm('Mill Lane',77,64,3.8,'#5a3a1c');nm('Green Lane',89,32,3.8,'#5a3a1c');
    nm("Saint Wenna's",24,10.4,4.8,'#8a2a14');nm('The Village Green',28.5,81.8,4.8,'#2f6a3a');nm('The Brook',40,84.6,4.4,'#1c4a7a');nm('The Back Track',60,12,3.8,'#5a3a1c');nm('The Orchard',86,67,4.4,'#2f6a3a');nm('Wenlock Mill',77,90.6,4.6,'#8a2a14');
    api.text(x,'To the Maze of Gardens',X(86),Y(53),3.6,MPL.LAPIS);api.text(x,'To the western kingdoms',X(14),Y(53),3.6,'#5a3a1c');api.text(x,'(not yet open)',X(14),Y(55.2),3.4,'#7a2a1a');
    // numbered discs over the shops that open
    const disc=(a,b,n)=>{x.fillStyle=MPL.GOLD2;x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.arc(a,b,2.5,0,6.3);x.fill();x.stroke();x.fillStyle=ink;x.font=`bold 3.6px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),a,b+.2)};
    const PL=[];let n=0;for(const d of WL_DOORS){if(d.kind==='house')continue;n++;PL.push([n,d.name]);const h=WL_HOUSES.find(q=>q.id===d.id);if(d.kind==='church')disc(X(24.5),Y(19.2),n);else if(h)disc(X((h.x0+h.x1+1)/2),Y(h.y0)-1.6,n)}
    x.restore();
    x.strokeStyle=ink;x.lineWidth=1;x.strokeRect(A.x,A.y,A.w,A.h);x.strokeStyle=MPL.GOLD;x.lineWidth=1.6;x.strokeRect(A.x+1.5,A.y+1.5,A.w-3,A.h-3);
    // margins: the title with its ribbon, the compass, the key and the places
    api.title(x,'Wenlock','A market town of the western kingdoms');
    x.save();x.fillStyle=MPL.VERM;x.strokeStyle=ink;x.lineWidth=.7;x.beginPath();x.moveTo(6,214);x.lineTo(88,214);x.lineTo(83,222);x.lineTo(88,230);x.lineTo(6,230);x.lineTo(11,222);x.closePath();x.fill();x.stroke();x.restore();x.save();x.fillStyle='#f6e8c0';x.font=`bold 7px ${FUI}`;x.textAlign='center';x.textBaseline='middle';x.fillText('Peace and Plenty',47,222.4);x.restore();
    api.compass(x,438,58,14);
    api.panel(x,6,52,82,80);api.text(x,'About Wenlock',47,61,7.2,MPL.LAPIS);
    api.notes(x,['A little town of timber, flint and honey stone, with a brook, a green and a very good bell.','One High Street runs through the market square; the west gate is shut for now.'],11,71,70,5.9,3);
    api.panel(x,6,138,82,72);api.text(x,'Key',47,147,7.2,MPL.LAPIS);
    [['Cottage',()=>mpWenlockHouse(x,{x0:0,x1:1,y0:0,y1:1,sty:'timber',rk:'thatch',face:'S',door:[0,1],front:[0,2],sp:null},{s:5,X:v=>12+v*5,Y:v=>153+v*5-4})],['Shop, hall',()=>mpWenlockHouse(x,{x0:0,x1:1,y0:0,y1:1,sty:'honey',rk:'tile',face:'S',door:[0,1],front:[0,2],sp:{kind:'x'}},{s:5,X:v=>12+v*5,Y:v=>166+v*5-4})],['Brook, pond',()=>{x.fillStyle='#6aa4c8';x.fillRect(12,181,12,5);x.strokeStyle=ink;x.lineWidth=.5;x.strokeRect(12,181,12,5)}],['Road, lane',()=>{x.fillStyle='#d9cba4';x.fillRect(12,194,12,5);x.strokeStyle=ink;x.lineWidth=.5;x.strokeRect(12,194,12,5)}]].forEach((k,i)=>{k[1]();api.text(x,k[0],34,[158,171,184,197][i],6,'#3a2a1c','left')});
    api.panel(x,392,74,86,PL.length*7.5+16);api.text(x,'Places',435,82,7.2,MPL.LAPIS);
    PL.forEach(([k,t],i)=>api.text(x,k+' '+t.replace(/^The /,'').replace(', Weaponsmiths','').replace('Hale and Daughters','Hale and Daughters').replace("Saint Wenna's Church","St Wenna's Church"),396,91+i*7.5,4.6,'#3a2a1c','left'));
  }});
/* Wenlock on the world map, west of the known lands, and in the Go to area list */
if(typeof WORLD_LOCS!=='undefined'&&!WORLD_LOCS.some(l=>l.k==='wenlock'))WORLD_LOCS.push({k:'wenlock',n:'Wenlock',sub:'a market town',lv:[WL.ID].concat(Array.from({length:100},(_,i)=>WL.H0+i)),x:-206,y:222,ic:'town'});
if(typeof QWORLD!=='undefined')QWORLD.Wenlock='wenlock';
{const _gl=gotoListRaw;gotoListRaw=function(){const out=_gl.apply(this,arguments);try{const rows=[{h:'Wenlock, a market town of the western kingdoms'}];for(const n of [WL.ID,WL.H0,...WL_DOORS.slice(1,16).map(d=>d.id)]){if(LEVELS[n]||KH_LAZY[n])rows.push({n,name:LEVEL_NAMES[n]||('Level '+n)})}
  const i=out.findIndex(r=>r.h&&/^Oldhaven/.test(r.h));out.splice(i<0?out.length:i,0,...rows)}catch(e){console.error('wlgoto',e)}return out}}
