/* ==========================================================================
   Area maps: THE IRONHILL ROAD (level 10), THE WITCH'S HUT (24) and THE IRONHILL TUNNEL (11). Drawn from the real level data on the shared parchment sheet.
   ========================================================================== */
const mpIronroadH=hash2;
/* a wobbly line through points, drawn as pen strokes */
function mpIronroadLine(x,pts,col,w,seed,jit){x.save();x.strokeStyle=col;x.lineWidth=w;x.lineCap='round';x.lineJoin='round';x.beginPath();pts.forEach((p,i)=>{const a=p[0]+(mpIronroadH(i,1,seed)-.5)*(jit||.6),b=p[1]+(mpIronroadH(i,2,seed)-.5)*(jit||.6);i?x.lineTo(a,b):x.moveTo(a,b)});x.stroke();x.restore()}
/* heather and bracken tuft */
function mpIronroadTuft(x,a,b,k,col){x.strokeStyle=col;x.lineWidth=.6;x.beginPath();if(k){for(let i=-1;i<=1;i++){x.moveTo(a,b);x.lineTo(a+i*1.8,b-2.6+Math.abs(i)*.6)}}else{x.moveTo(a-1.6,b);x.lineTo(a,b-2.4);x.lineTo(a+1.6,b);x.moveTo(a,b);x.lineTo(a,b-1.4)}x.stroke()}
/* a wet, dark pine or a round tree in muted rain colours */
function mpIronroadTree(x,a,b,s,k){x.save();x.strokeStyle=MPL.INK;x.lineWidth=.6;if(k%3===0){x.fillStyle='#5a4a30';x.fillRect(a-.5*s,b-1.5*s,s,2.5*s);x.fillStyle=k%2?'#58704a':'#4c6a46';for(const [dx,dy,r] of [[0,-4,2.8],[-1.7,-2.6,2],[1.7,-2.6,2]]){x.beginPath();x.arc(a+dx*s,b+dy*s,r*s,0,6.3);x.fill();x.stroke()}}
  else{x.fillStyle=k%2?'#35573d':'#2f4f3a';for(let j=0;j<3;j++){x.beginPath();x.moveTo(a-(3.2-j*.7)*s,b-j*2.4*s);x.lineTo(a,b-(j*2.4+3.6)*s);x.lineTo(a+(3.2-j*.7)*s,b-j*2.4*s);x.closePath();x.fill();x.stroke()}}x.restore()}
/* a lantern on a post, with a small gold glow */
function mpIronroadLamp(x,a,b,s){s=s||1;x.save();const g=x.createRadialGradient(a,b-5*s,0,a,b-5*s,9*s);g.addColorStop(0,'rgba(255,214,110,.75)');g.addColorStop(1,'rgba(255,214,110,0)');x.fillStyle=g;x.fillRect(a-10*s,b-15*s,20*s,20*s);
  x.strokeStyle=MPL.INK;x.lineWidth=.8;x.beginPath();x.moveTo(a,b+1);x.lineTo(a,b-5*s);x.stroke();x.fillStyle=MPL.GOLD2;x.fillRect(a-1.6*s,b-8*s,3.2*s,3.6*s);x.strokeRect(a-1.6*s,b-8*s,3.2*s,3.6*s);x.beginPath();x.moveTo(a-2.3*s,b-8*s);x.lineTo(a,b-10*s);x.lineTo(a+2.3*s,b-8*s);x.fillStyle=MPL.INK;x.fill();x.restore()}
/* rain: slanting pale strokes over a rectangle */
function mpIronroadRain(x,a,b,w,h,n,seed){x.save();x.beginPath();x.rect(a,b,w,h);x.clip();x.lineWidth=.6;x.lineCap='round';for(let i=0;i<n;i++){const px=a+mpIronroadH(i,1,seed)*w,py=b+mpIronroadH(i,2,seed)*h,l=4+mpIronroadH(i,3,seed)*5;x.strokeStyle=i%4?'rgba(70,100,140,.38)':'rgba(240,244,250,.5)';x.beginPath();x.moveTo(px,py);x.lineTo(px-l*.35,py+l);x.stroke()}x.restore()}
/* the key panel in the right margin */
function mpIronroadKey(x,api,items,y0){api.panel(x,394,y0,82,12+items.length*13);api.text(x,'KEY',435,y0+8,6.4,MPL.VERM);items.forEach((it,i)=>{const yy=y0+22+i*13;it[0](400+8,yy+3);api.text(x,it[1],422,yy,6,'#3a2a1c','left')})}

function mpIronroadFrame(x){const A=MPL.AREA;x.save();x.strokeStyle=MPL.INK;x.lineWidth=1.4;x.strokeRect(A.x,A.y,A.w,A.h);x.strokeStyle=MPL.GOLD;x.lineWidth=.8;x.strokeRect(A.x-1.6,A.y-1.6,A.w+3.2,A.h+3.2);x.restore()}
function mpIronroadRoad(c,x,L,api){
  const H=mpIronroadH,A=MPL.AREA,F=mplFit(48,30,0),s=F.s,X=F.X,Y=F.Y,W=48,Hh=30,rows=L.rows,I=api.I;
  const road=(i,j)=>i>=0&&j>=0&&i<W&&j<Hh&&rows[j][i]!=='T'&&(L.fmap[j][i]==='1'||/[013]/.test(rows[j][i]));
  const open=(i,j)=>i>=0&&j>=0&&i<W&&j<Hh&&rows[j][i]!=='T';
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  // the wet heath: a green-grey wash over the whole frame, patchier near the open ground
  x.fillStyle='rgba(120,134,92,.30)';x.fillRect(A.x,A.y,A.w,A.h);
  for(let i=0;i<90;i++){x.fillStyle=i%3?'rgba(96,116,82,.16)':'rgba(150,140,100,.14)';x.beginPath();x.ellipse(A.x+H(i,1,3)*A.w,A.y+H(i,2,3)*A.h,10+H(i,3,3)*26,5+H(i,4,3)*10,H(i,5,3)*3,0,6.3);x.fill()}
  // open ground: a pale wash on every open cell so the clearings read
  for(let j=0;j<Hh;j++)for(let i=0;i<W;i++)if(open(i,j)){x.fillStyle='rgba(176,168,112,.17)';x.fillRect(X(i)-.4,Y(j)-.4,s+.8,s+.8)}
  // heath: heather and bracken tufts on the open ground, rock outcrops
  for(let j=0;j<Hh;j++)for(let i=0;i<W;i++){if(!open(i,j)||road(i,j))continue;const n=1+((H(i,j,5)*3)|0);for(let k=0;k<n;k++){const a=X(i)+H(i,j,6+k)*s,b=Y(j)+H(i,j,9+k)*s+2,p=H(i+k,j,12);mpIronroadTuft(x,a,b,p<.5?1:0,p<.5?'rgba(110,70,110,.85)':'rgba(74,104,60,.85)')}
    if(H(i,j,15)<.05){const a=X(i)+s/2,b=Y(j)+s/2;x.fillStyle='#a49c8a';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.ellipse(a,b,2.2,1.5,0,0,6.3);x.fill();x.stroke()}}
  // the trees: every wall cell of forest, drawn back to front, with a ragged fringe outside the frame's real map
  const trees=[];for(let j=-3;j<Hh+4;j++)for(let i=-3;i<W+3;i++){const inside=i>=0&&j>=0&&i<W&&j<Hh;if(inside){if(rows[j][i]!=='T')continue}else{const d=Math.max(0,-i,i-W+1,-j,j-Hh+1);if(H(i,j,21)>.9-d*.04+.22)continue}
    const k=((H(i,j,22)*6)|0);trees.push([X(i)+s*(.3+H(i,j,23)*.4),Y(j)+s*(.7+H(i,j,24)*.3),.6+H(i,j,25)*.22,k])}
  trees.sort((p,q)=>p[1]-q[1]);for(const t of trees)mpIronroadTree(x,t[0],t[1],t[2],t[3]);
  // the road: a fat ribbon of mud along the trail cells, ruts, edge stones
  for(let j=0;j<Hh;j++)for(let i=0;i<W;i++)if(road(i,j)){const a=X(i)+s/2+(H(i,j,31)-.5)*1.2,b=Y(j)+s/2+(H(i,j,32)-.5)*1.2;x.fillStyle='rgba(98,70,40,.95)';x.beginPath();x.arc(a,b,s*.72,0,6.3);x.fill()}
  for(let j=0;j<Hh;j++)for(let i=0;i<W;i++)if(road(i,j)){const a=X(i)+s/2,b=Y(j)+s/2;x.fillStyle='rgba(148,112,70,.9)';x.beginPath();x.arc(a+(H(i,j,33)-.5),b+(H(i,j,34)-.5),s*.5,0,6.3);x.fill()}
  for(let j=0;j<Hh;j++)for(let i=0;i<W;i++)if(road(i,j)){const a=X(i)+s/2,b=Y(j)+s/2;
    if(road(i+1,j))for(const o of [-1.2,1.2])mpIronroadLine(x,[[a,b+o],[a+s*.5,b+o+(H(i,j,35)-.5)],[a+s,b+o]],'rgba(60,40,22,.7)',.6,36+i,.5);
    if(road(i,j+1))for(const o of [-1.2,1.2])mpIronroadLine(x,[[a+o,b],[a+o+(H(i,j,37)-.5),b+s*.5],[a+o,b+s]],'rgba(60,40,22,.7)',.6,38+j,.5);
    if(H(i,j,39)<.2){x.fillStyle='rgba(120,150,176,.85)';x.strokeStyle='rgba(40,60,90,.8)';x.lineWidth=.5;x.beginPath();x.ellipse(a+(H(i,j,40)-.5)*2,b+(H(i,j,41)-.5)*2,1.6+H(i,j,42)*1.6,1+H(i,j,43),0,0,6.3);x.fill();x.stroke();x.strokeStyle='rgba(250,252,255,.8)';x.beginPath();x.moveTo(a-1,b-.4);x.lineTo(a+.6,b-.5);x.stroke()}
    if(H(i,j,44)<.16){x.fillStyle='#9a9484';x.strokeStyle=MPL.INK;x.lineWidth=.4;x.beginPath();x.arc(a+(H(i,j,45)-.5)*s,b+(H(i,j,46)-.5)*s,.8+H(i,j,47)*.7,0,6.3);x.fill();x.stroke()}
    if(!road(i,j-1)&&open(i,j-1)&&H(i,j,48)<.5)for(let k=0;k<2;k++){x.fillStyle='#8c8678';x.beginPath();x.arc(X(i)+H(i,j,49+k)*s,Y(j)+.5,.7,0,6.3);x.fill()}}
  // wolf tracks beside the road, a few pairs of small paw marks
  x.fillStyle='rgba(60,40,22,.75)';L.enemies.filter(e=>e.t==='wolf').forEach((e,n)=>{for(let k=0;k<4;k++){const a=X(e.x)+k*3.2,b=Y(e.y)+s*.8+(k%2)*2;for(const [dx,dy] of [[-.9,-.9],[.9,-.9],[0,.4]]){x.beginPath();x.arc(a+dx,b+dy,.5,0,6.3);x.fill()}}});
  // the lanterns standing along the road
  for(const d of L.decor)if(d.k==='lamp')mpIronroadLamp(x,X(d.x)+s/2,Y(d.y)+s*.8,.9);
  // the west gate to Gandrick's Wood
  {const a=X(0)+4,b=Y(15)+s/2;x.save();x.fillStyle='#6a4a2a';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(a-4,b-9,2.6,16);x.fillRect(a+1.6,b-9,2.6,16);x.strokeRect(a-4,b-9,2.6,16);x.strokeRect(a+1.6,b-9,2.6,16);x.fillStyle='#8a6a3a';x.fillRect(a-5,b-11,10.6,2.6);x.strokeRect(a-5,b-11,10.6,2.6);x.restore()}
  // the tunnel mouth in the east: a rock arch with timber posts
  {const a=X(47)+1,b=Y(13)+s/2;x.save();x.fillStyle='#8a8478';x.strokeStyle=MPL.INK;x.lineWidth=.9;x.beginPath();x.moveTo(a-8,b+8);x.lineTo(a-7,b-5);x.quadraticCurveTo(a-1,b-13,a+5,b-5);x.lineTo(a+6,b+8);x.closePath();x.fill();x.stroke();x.fillStyle='#1e1610';x.beginPath();x.moveTo(a-4,b+8);x.lineTo(a-4,b-2);x.quadraticCurveTo(a-1,b-6,a+2,b-2);x.lineTo(a+2,b+8);x.closePath();x.fill();x.fillStyle='#6a4a2a';x.fillRect(a-5,b-3,1.8,11);x.fillRect(a+1.4,b-3,1.8,11);x.fillRect(a-5,b-4,8.2,1.6);x.restore()}
  // the witch's hut up in the north: a small house with a smoking chimney
  {const a=X(33)+s*.5,b=Y(3)-1;x.save();I.house(x,a,b,.9,'#6a5a3a');x.strokeStyle='rgba(90,90,100,.6)';x.lineWidth=.8;x.beginPath();x.moveTo(a+2,b-7);x.bezierCurveTo(a+5,b-10,a-1,b-12,a+3,b-15);x.stroke();x.restore()}
  // the lonely grave in the south-east
  {const a=X(40)+s/2,b=Y(25)+s*.7;x.save();x.fillStyle='#b4ac9a';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.moveTo(a-2.6,b);x.lineTo(a-2.6,b-4.4);x.quadraticCurveTo(a,b-8,a+2.6,b-4.4);x.lineTo(a+2.6,b);x.closePath();x.fill();x.stroke();I.cross(x,a,b-3.6,.5);x.restore()}
  // waymarks: leaning stone posts with a carved cross, one at each end of the long road
  for(const [i,j] of [[4,14],[22,12],[44,11],[16,18]]){const a=X(i)+s/2,b=Y(j)+s*.8;x.save();x.fillStyle='#b4ac9a';x.strokeStyle=MPL.INK;x.lineWidth=.7;x.beginPath();x.moveTo(a-1.6,b);x.lineTo(a-1.3,b-6);x.lineTo(a+1.4,b-6.4);x.lineTo(a+1.7,b);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.VERM;x.lineWidth=.6;x.beginPath();x.moveTo(a,b-5.2);x.lineTo(a,b-2);x.moveTo(a-.9,b-4);x.lineTo(a+.9,b-4);x.stroke();x.restore()}
  mpIronroadRain(x,A.x,A.y,A.w,A.h,520,61);
  x.restore();mpIronroadFrame(x);
  // labels
  const T=api.text;
  T(x,'ROAD TO IRONHILL',X(24),Y(14.3),7.6,'#5a2a18');T(x,'GANDRICK\'S WOOD',X(4.2),Y(15)+17,6.4,MPL.LAPIS);T(x,'<- back to the wood',X(4.2),Y(15)+24.5,5.6,'#5a3a1c');
  T(x,'THE TUNNEL',X(43.5),Y(13)-12,6.6,'#5a2a18');T(x,'to the east',X(43.5),Y(13)-5,5.6,'#5a3a1c');
  T(x,'THE WITCH\'S HUT',X(33)+s*.5,Y(3)-23,6.4,'#3a2a50');T(x,'LONELY GRAVE',X(40)+s/2,Y(25)+10,6,'#3a2a1c');T(x,'THE HEATH',X(14),Y(5),7,'#4a5a30');T(x,'THE MUD FLATS',X(11),Y(22),6.4,'#5a3a1c');
  T(x,'THE LONG WOOD',X(30),Y(26.5),6.4,'#2f4f3a');
  api.title(x,'The Ironhill Road','a wet, muddy road across the heath');api.compass(x,434,62,13);
  api.notes(x,['The road runs from Gandrick\'s Wood in the west to the tunnel in the east.','It rains here all day, so the ruts are full of puddles.','Wolves roam the heath. Their tracks cross the road.'],10,64,74,6.4,5);
  mpIronroadKey(x,api,[[(a,b)=>{x.fillStyle='#946c42';x.fillRect(a-5,b-2,10,4)},'Road'],[(a,b)=>I.pine(x,a,b+3,.6),'Forest'],[(a,b)=>mpIronroadLamp(x,a,b+4,.55),'Lantern'],[(a,b)=>{x.fillStyle='rgba(120,150,176,.9)';x.beginPath();x.ellipse(a,b,4,2,0,0,6.3);x.fill()},'Puddle'],[(a,b)=>I.cross(x,a,b,.7),'Grave']],104);
  }

function mpIronroadHut(c,x,L,api){
  const F=mplFit(9,7,6),s=F.s,X=F.X,Y=F.Y,I=api.I,H=mpIronroadH,A=MPL.AREA;
  // grass and a rain-soaked yard round the hut
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();x.fillStyle='rgba(120,134,92,.3)';x.fillRect(A.x,A.y,A.w,A.h);
  for(let i=0;i<260;i++){const a=A.x+H(i,1,70)*A.w,b=A.y+H(i,2,70)*A.h;if(a>X(0)-4&&a<X(9)+4&&b>Y(0)-4&&b<Y(7)+4)continue;mpIronroadTuft(x,a,b,i%3===0?1:0,i%3===0?'rgba(110,70,110,.85)':'rgba(74,104,60,.85)')}
  for(let i=0;i<14;i++)mpIronroadTree(x,A.x+8+H(i,1,71)*(A.w-16),A.y+(i%2?A.h-4:14)+H(i,2,71)*6,.9,i);
  // floor boards
  x.fillStyle='#b99468';x.fillRect(X(1),Y(1),s*7,s*5);x.strokeStyle='rgba(70,44,22,.5)';x.lineWidth=.7;for(let k=1;k<5;k++)mpIronroadLine(x,[[X(1),Y(1)+k*s],[X(8),Y(1)+k*s]],'rgba(70,44,22,.5)',.7,80+k,.8);
  for(let j=1;j<6;j++)for(let i=1;i<8;i++)if(H(i,j,81)<.5){x.beginPath();x.moveTo(X(i)+H(i,j,82)*s,Y(j));x.lineTo(X(i)+H(i,j,82)*s,Y(j)+s);x.stroke()}
  // walls: thick timber, door gap at the south
  x.strokeStyle='#4a3018';x.lineWidth=5;x.beginPath();x.moveTo(X(4),Y(6.15));x.lineTo(X(.85),Y(6.15));x.lineTo(X(.85),Y(.85));x.lineTo(X(8.15),Y(.85));x.lineTo(X(8.15),Y(6.15));x.lineTo(X(5),Y(6.15));x.stroke();
  x.strokeStyle='#8a6a3a';x.lineWidth=2;x.stroke();
  x.fillStyle='#5a3a1c';x.fillRect(X(4)+.05*s,Y(6.15)-3,s*.9,6);x.strokeStyle=MPL.INK;x.lineWidth=.8;x.strokeRect(X(4)+.05*s,Y(6.15)-3,s*.9,6);
  // furniture from the real data
  for(const d of L.decor){const a=X(d.x)+s/2,b=Y(d.y)+s/2;x.save();x.strokeStyle=MPL.INK;x.lineWidth=.9;
    if(d.k==='barrel'){x.fillStyle='#7a5430';x.beginPath();x.arc(a,b,s*.32,0,6.3);x.fill();x.stroke();x.beginPath();x.arc(a,b,s*.2,0,6.3);x.stroke()}
    else if(d.k==='crate'){x.fillStyle='#9a7040';x.fillRect(a-s*.32,b-s*.32,s*.64,s*.64);x.strokeRect(a-s*.32,b-s*.32,s*.64,s*.64);x.beginPath();x.moveTo(a-s*.32,b-s*.32);x.lineTo(a+s*.32,b+s*.32);x.moveTo(a+s*.32,b-s*.32);x.lineTo(a-s*.32,b+s*.32);x.stroke()}
    else if(d.k==='bench'){x.fillStyle='#8a6038';x.fillRect(a-s*.4,b-s*.34,s*.8,s*.68);x.strokeRect(a-s*.4,b-s*.34,s*.8,s*.68)}
    else if(d.k==='bones'){x.strokeStyle='#efe8d8';x.lineWidth=1.4;x.beginPath();x.moveTo(a-5,b-3);x.lineTo(a+5,b+3);x.moveTo(a-5,b+3);x.lineTo(a+5,b-3);x.stroke();x.fillStyle='#efe8d8';x.beginPath();x.arc(a,b,2.4,0,6.3);x.fill()}
    else if(d.npc==='witch'){x.fillStyle='#3a2a50';x.beginPath();x.moveTo(a,b-s*.34);x.lineTo(a+s*.26,b+s*.3);x.lineTo(a-s*.26,b+s*.3);x.closePath();x.fill();x.stroke();x.fillStyle='#e8c8a0';x.beginPath();x.arc(a,b-s*.3,s*.12,0,6.3);x.fill();x.stroke();x.fillStyle='#2a1a40';x.beginPath();x.moveTo(a-s*.22,b-s*.36);x.lineTo(a,b-s*.78);x.lineTo(a+s*.22,b-s*.36);x.closePath();x.fill();x.stroke()}
    x.restore()}
  // the two lamps (real light spots)
  for(const p of (L.lights||[]))mpIronroadLamp(x,X(p[0])+s/2,Y(p[1])+s*.5,1.6);
  x.restore();mpIronroadRain(x,A.x,A.y,A.w,A.h,360,62);mpIronroadFrame(x);
  api.text(x,'THE WITCH\'S HUT',X(4.5),Y(0)-10,8,'#3a2a50');api.text(x,'door',X(4.5)+s*.4,Y(7)+9,6,'#5a3a1c');api.text(x,'the witch',X(6)+s*.5,Y(1)-s*.1+s*1.3,5.6,'#3a2a50');
  api.title(x,'The Witch\'s Hut','one room beside the road');api.compass(x,434,62,13);
  api.notes(x,['A single room with a plank floor and two lamps.','The witch lives here. Barrels and crates line the back wall.','The only door leads out to the Ironhill Road.'],10,64,74,6.4,5);
  mpIronroadKey(x,api,[[(a,b)=>{x.fillStyle='#7a5430';x.beginPath();x.arc(a,b,3,0,6.3);x.fill()},'Barrel'],[(a,b)=>{x.fillStyle='#9a7040';x.fillRect(a-3,b-3,6,6)},'Crate'],[(a,b)=>{x.fillStyle='#8a6038';x.fillRect(a-4,b-2.4,8,4.8)},'Bench'],[(a,b)=>mpIronroadLamp(x,a,b+4,.55),'Lamp']],104)}

function mpIronroadTunnel(c,x,L,api){
  const F=mplFit(32,20,0),s=F.s,X=F.X,Y=F.Y,H=mpIronroadH,rows=L.rows,W=32,Hh=20,A=MPL.AREA,I=api.I;
  const fl=(i,j)=>i>=0&&j>=0&&i<W&&j<Hh&&rows[j][i]!=='#';
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  // solid rock: a dark wash all over the frame, hatched in short strokes
  x.fillStyle='#7a6a54';x.fillRect(A.x,A.y,A.w,A.h);
  for(let i=0;i<60;i++){x.fillStyle=i%2?'rgba(40,28,18,.2)':'rgba(190,170,130,.15)';x.beginPath();x.ellipse(A.x+H(i,1,90)*A.w,A.y+H(i,2,90)*A.h,8+H(i,3,90)*22,4+H(i,4,90)*8,H(i,5,90)*3,0,6.3);x.fill()}
  x.strokeStyle='rgba(30,20,12,.55)';x.lineWidth=.6;for(let i=0;i<2200;i++){const a=A.x+H(i,1,91)*A.w,b=A.y+H(i,2,91)*A.h,l=2.5+H(i,3,91)*4;x.beginPath();x.moveTo(a,b);x.lineTo(a+l,b+l*.8);x.stroke()}
  // the passage floor: a shadow edge, then plank-coloured floor
  for(let j=0;j<Hh;j++)for(let i=0;i<W;i++)if(fl(i,j)){x.fillStyle='#2a1c10';x.fillRect(X(i)-1.2,Y(j)-1.2,s+2.4,s+2.4)}
  for(let j=0;j<Hh;j++)for(let i=0;i<W;i++)if(fl(i,j)){x.fillStyle=(i+j)%2?'#c0a276':'#b89a6e';x.fillRect(X(i),Y(j),s+.4,s+.4);if(H(i,j,92)<.5){x.strokeStyle='rgba(70,44,22,.4)';x.lineWidth=.5;x.beginPath();x.moveTo(X(i)+H(i,j,93)*s,Y(j));x.lineTo(X(i)+H(i,j,93)*s,Y(j)+s);x.stroke()}
    if(H(i,j,94)<.1){x.fillStyle='rgba(100,130,160,.7)';x.beginPath();x.ellipse(X(i)+s/2,Y(j)+s/2,2.2,1.2,0,0,6.3);x.fill()}}
  // timber wall linings along the floor edges
  x.strokeStyle='#4a3018';x.lineWidth=1.8;for(let j=0;j<Hh;j++)for(let i=0;i<W;i++)if(fl(i,j)){if(!fl(i,j-1)){x.beginPath();x.moveTo(X(i),Y(j));x.lineTo(X(i+1),Y(j));x.stroke()}if(!fl(i,j+1)){x.beginPath();x.moveTo(X(i),Y(j+1));x.lineTo(X(i+1),Y(j+1));x.stroke()}if(!fl(i-1,j)){x.beginPath();x.moveTo(X(i),Y(j));x.lineTo(X(i),Y(j+1));x.stroke()}if(!fl(i+1,j)){x.beginPath();x.moveTo(X(i+1),Y(j));x.lineTo(X(i+1),Y(j+1));x.stroke()}}
  // timber props: a pair of posts and a cross beam every third square of each straight passage
  const post=(a,b)=>{x.fillStyle='#6a4a2a';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.fillRect(a-1.3,b-1.3,2.6,2.6);x.strokeRect(a-1.3,b-1.3,2.6,2.6)};
  for(let j=0;j<Hh;j++)for(let i=0;i<W;i++){if(!fl(i,j))continue;
    if(!fl(i,j-1)&&!fl(i,j+1)&&fl(i-1,j)&&fl(i+1,j)&&i%3===0){x.strokeStyle='#6a4a2a';x.lineWidth=1.4;x.beginPath();x.moveTo(X(i)+s/2,Y(j));x.lineTo(X(i)+s/2,Y(j+1));x.stroke();post(X(i)+s/2,Y(j)+.5);post(X(i)+s/2,Y(j+1)-.5)}
    else if(!fl(i-1,j)&&!fl(i+1,j)&&fl(i,j-1)&&fl(i,j+1)&&j%3===0){x.strokeStyle='#6a4a2a';x.lineWidth=1.4;x.beginPath();x.moveTo(X(i),Y(j)+s/2);x.lineTo(X(i+1),Y(j)+s/2);x.stroke();post(X(i)+.5,Y(j)+s/2);post(X(i+1)-.5,Y(j)+s/2)}}
  for(let j=0;j<Hh;j++)for(let i=0;i<W;i++){if(!fl(i,j))continue;if(!fl(i,j-1)&&i%3===1)post(X(i)+s/2,Y(j)+1.6);if(!fl(i,j+1)&&i%3===1)post(X(i)+s/2,Y(j+1)-1.6);if(!fl(i-1,j)&&j%3===1)post(X(i)+1.6,Y(j)+s/2);if(!fl(i+1,j)&&j%3===1)post(X(i+1)-1.6,Y(j)+s/2)}
  // the real props: coffins and bones
  for(const d of L.decor){const a=X(d.x)+s/2,b=Y(d.y)+s/2;x.save();x.strokeStyle=MPL.INK;x.lineWidth=.8;
    if(d.k==='coffin'){x.fillStyle='#5a3c22';x.beginPath();x.moveTo(a-s*.22,b-s*.4);x.lineTo(a+s*.22,b-s*.4);x.lineTo(a+s*.3,b-s*.1);x.lineTo(a+s*.2,b+s*.4);x.lineTo(a-s*.2,b+s*.4);x.lineTo(a-s*.3,b-s*.1);x.closePath();x.fill();x.stroke();x.strokeStyle=MPL.GOLD;x.beginPath();x.moveTo(a,b-s*.25);x.lineTo(a,b+s*.25);x.moveTo(a-s*.1,b-s*.1);x.lineTo(a+s*.1,b-s*.1);x.stroke()}
    else if(d.k==='bones'){x.strokeStyle='#efe8d8';x.lineWidth=1.2;x.beginPath();x.moveTo(a-3,b-2);x.lineTo(a+3,b+2);x.moveTo(a-3,b+2);x.lineTo(a+3,b-2);x.stroke();x.fillStyle='#efe8d8';x.beginPath();x.arc(a+1,b-1,1.5,0,6.3);x.fill()}x.restore()}
  // the items on the floor: a torch and potions, small marks
  for(const it of L.items){const a=X(it.x)+s/2,b=Y(it.y)+s/2;x.save();x.strokeStyle=MPL.INK;x.lineWidth=.6;if(it.k==='torch'){x.strokeStyle='#5a3a1c';x.lineWidth=1.6;x.beginPath();x.moveTo(a,b+3);x.lineTo(a,b-2);x.stroke();x.fillStyle='#f0a030';x.beginPath();x.ellipse(a,b-3.4,1.3,2,0,0,6.3);x.fill()}else{x.fillStyle=MPL.VERM;x.beginPath();x.arc(a,b+1,2,0,6.3);x.fill();x.stroke();x.fillStyle='#d8d0b8';x.fillRect(a-.6,b-3.2,1.2,2.2);x.strokeRect(a-.6,b-3.2,1.2,2.2)}x.restore()}
  // lanterns: hung in each chamber and along the long corridor
  for(const [i,j] of [[13,3],[18,3],[13,12],[18,12],[24,3],[29,3],[24,12],[29,12],[5,10],[9,10],[16,10],[22,5],[22,14],[15,14],[26,10]])if(fl(i,j))mpIronroadLamp(x,X(i)+s/2,Y(j)+s*.8,.9);
  // the entrance door in the west, and the dead end in the east
  {const a=X(0)+s/2,b=Y(10)+s/2;x.fillStyle='#6a4a2a';x.strokeStyle=MPL.INK;x.lineWidth=.8;x.fillRect(a-3,b-s*.45,6,s*.9);x.strokeRect(a-3,b-s*.45,6,s*.9)}
  {const a=X(31)+s/2,b=Y(14)+s/2;for(let k=0;k<6;k++){x.fillStyle='#8a8478';x.strokeStyle=MPL.INK;x.lineWidth=.6;x.beginPath();x.arc(a-2+H(k,1,95)*5,b-3+H(k,2,95)*7,2+H(k,3,95)*1.4,0,6.3);x.fill();x.stroke()}}
  x.restore();mpIronroadFrame(x);
  const T=api.text;
  T(x,'ENTRANCE HALL',X(7),Y(7.6),6.4);T(x,'WEST BURIAL HALL',X(15.5),Y(2.3),6.4);T(x,'EAST BURIAL HALL',X(26.5),Y(2.3),6.4);T(x,'SOUTH WEST HALL',X(15.5),Y(17.6),6.4);T(x,'SOUTH EAST HALL',X(26.5),Y(17.6),6.4);T(x,'rubble',X(29.6),Y(14.5)+10,5.6,'#5a3a1c');T(x,'to the Ironhill Road',X(2),Y(10)+14,5.6,'#5a3a1c');
  api.title(x,'The Ironhill Tunnel','a timbered mining passage');api.compass(x,434,62,13);
  api.notes(x,['The tunnel leaves the east end of the Ironhill Road.','Timber props hold up the roof. Lanterns hang in the halls.','Coffins and bones lie in the side chambers. Skeletons and ghosts walk here.'],10,64,74,6.4,5);
  mpIronroadKey(x,api,[[(a,b)=>{x.fillStyle='#6a4a2a';x.fillRect(a-4,b-1,8,2)},'Timber prop'],[(a,b)=>mpIronroadLamp(x,a,b+4,.55),'Lantern'],[(a,b)=>{x.fillStyle='#5a3c22';x.fillRect(a-2.4,b-3.4,4.8,7)},'Coffin'],[(a,b)=>{x.fillStyle=MPL.VERM;x.beginPath();x.arc(a,b,2.2,0,6.3);x.fill()},'Potion'],[(a,b)=>{x.fillStyle='#f0a030';x.beginPath();x.ellipse(a,b,1.3,2.4,0,0,6.3);x.fill()},'Torch']],104)}

mplInstall({name:'ironroad',levels:[10,24,11],
  fit(L){return LEVEL===24?mplFit(9,7,6):LEVEL===11?mplFit(32,20,0):mplFit(48,30,0)},
  foot:'',tint:[-6,-2,4],
  draw(c,x,L,api){if(LEVEL===24)mpIronroadHut(c,x,L,api);else if(LEVEL===11)mpIronroadTunnel(c,x,L,api);else mpIronroadRoad(c,x,L,api)}});
