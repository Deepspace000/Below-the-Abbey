/* ==========================================================================
   THE DEEPER HOLLOW, STAGE 4: THE MAPS (prefix hgdmp / HGDMP). The whole maze on one illuminated parchment, and a local map of each of its four quadrants, all drawn from the real
   level, so every corridor is on them. The precincts have names (three in each biome), the towns and the signed danger zones are marked, trees, ponds and fountains show in the open
   places. Nothing secret is drawn (secret doors stay plain wall, chests and the creatures are left out). A small copy of the maze sits on the world map.
   Buttons on the map screen switch between Whole, NW, NE, SW and SE.
   ========================================================================== */
const HGDMP={cache:{},mini:null,names:[['The Briar Rows','Lowhedge Ward','The Thorn Reach'],['Cairn Precinct','The Mason\'s Ward','Gravel Court'],['The Waxen Ward','Droneside Precinct','The Brood Rows'],['The Whelk Rows','The Whelk Court','Pearl Ward'],['Scarab Row','The Dry Ward','Scarab Court'],['Lamp Ward','The Blue Precinct','Inkwell Court'],['The Tile Rows','The Pattern Rows','Grout Court'],['The Gilt Rows','The Gilded Ward','Leaf Court']],
  tints:['#a9bd8a','#b3b0a2','#d8a23c','#e0bcc4','#d9bf8a','#8fa8d0','#c4b0d6','#f1e6a8'],
  views:[['All','The Whole Maze',0,0,201,201],['NW','The North-West Quarter',0,0,101,101],['NE','The North-East Quarter',100,0,101,101],['SW','The South-West Quarter',0,100,101,101],['SE','The South-East Quarter',100,100,101,101],['Under','The Underlevel',0,0,201,201]]};
// three precincts in every biome: far-apart seeds, every place belongs to the nearest
function hgdmpPrec(L){
  const M=L._hgdm;if(M.prec)return M.prec;const W=M.W,H=M.H,bio=M.bio,out=[];
  for(let b=0;b<8;b++){const cells=[];for(let y=2;y<H-2;y+=3)for(let x=2;x<W-2;x+=3)if(bio[y*W+x]===b)cells.push([x,y]);if(!cells.length)continue;
    let mx=0,my=0;for(const c of cells){mx+=c[0];my+=c[1]}mx/=cells.length;my/=cells.length;
    const seeds=[cells.slice().sort((p,q)=>Math.hypot(p[0]-mx,p[1]-my)-Math.hypot(q[0]-mx,q[1]-my))[0]];
    while(seeds.length<3){let best=null,bd=-1;for(const c of cells){const d=Math.min(...seeds.map(s=>Math.hypot(s[0]-c[0],s[1]-c[1])));if(d>bd){bd=d;best=c}}seeds.push(best)}
    const grp=seeds.map(()=>[]);for(const c of cells){let bi=0,bd=1e9;seeds.forEach((s,i)=>{const d=Math.hypot(s[0]-c[0],s[1]-c[1]);if(d<bd){bd=d;bi=i}});grp[bi].push(c)}
    grp.forEach((g,i)=>{if(!g.length)return;const tw=(L._hgdp?L._hgdp.zones:[]).find(z=>z.town===b&&((q)=>{let bi2=0,bd2=1e9;seeds.forEach((s2,j)=>{const d=Math.hypot(s2[0]-q.x,s2[1]-q.y);if(d<bd2){bd2=d;bi2=j}});return bi2})(z)===i);let gx=0,gy=0;for(const c of g){gx+=c[0];gy+=c[1]}gx/=g.length;gy/=g.length;
      // the label sits on the place of the group nearest its middle, so it never floats over rock
      const n=g.slice().sort((p,q)=>Math.hypot(p[0]-gx,p[1]-gy)-Math.hypot(q[0]-gx,q[1]-gy))[0];out.push({name:tw?tw.name+' Precinct':HGDMP.names[b][i],x:n[0],y:n[1],b})})}
  return M.prec=out}
/* the painted map icons (assets/icn_hgdi_*.png, made with Gemini, painted in ink and watercolour); the shapes drawn in code below are only a fallback */
for(const n of ['hut0','hut1','hut2','hut3','hut4','hut5','hut6','hut7','tent','ladder','steps','dock','doorkey','doorgem','sign','stone'])loadImg('icn_hgdi_'+n,'assets/icn_hgdi_'+n+'.png');
const HGDI_TINT={};
function hgdiImg(n,col){const im=IMG['icn_hgdi_'+n];if(!im||!im.width)return null;if(!col)return im;const k=n+col;if(HGDI_TINT[k])return HGDI_TINT[k];
  const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);x.globalCompositeOperation='source-atop';x.globalAlpha=.5;x.fillStyle=col;x.fillRect(0,0,c.width,c.height);return HGDI_TINT[k]=c}
function hgdiDraw(x,n,a,b,w,col){const im=hgdiImg(n,col);if(!im)return false;const h=w*im.height/im.width;x.drawImage(im,a-w/2,b-h+w*.12,w,h);return true}
/* little huts, one style for each biome, small enough to leave the maze showing: hedge thatch, stone cottage, honeycomb skep, shell roof, sandstone dome, blue tent, mosaic pavilion, gilded onion dome */
function hgdmpHut(x,a,b,bi,town,u){
  if(hgdiDraw(x,town?'hut'+bi:'tent',a,b+2.2,(town?13:9.5)*u))return;
  x.save();x.translate(a,b);x.scale(u,u);x.lineJoin='round';x.lineWidth=.55;const INK=MPL.INK;x.strokeStyle=INK;
  const door=()=>{x.fillStyle='#3a2410';x.fillRect(-.8,0,1.6,2.4)};
  if(!town){x.fillStyle='#8aa862';x.beginPath();x.moveTo(-3.2,2.6);x.lineTo(0,-3);x.lineTo(3.2,2.6);x.closePath();x.fill();x.stroke();x.fillStyle='#3a2410';x.beginPath();x.moveTo(-.9,2.6);x.lineTo(0,-.4);x.lineTo(.9,2.6);x.fill();x.restore();return}
  if(bi===0){x.fillStyle='#efe2b8';x.fillRect(-3,-.5,6,3.2);x.strokeRect(-3,-.5,6,3.2);x.fillStyle='#8a7a2c';x.beginPath();x.moveTo(-4.2,-.5);x.lineTo(0,-5.4);x.lineTo(4.2,-.5);x.closePath();x.fill();x.stroke();x.strokeStyle='rgba(60,40,10,.7)';x.beginPath();x.moveTo(-2.4,-1.4);x.lineTo(2.4,-1.4);x.moveTo(-1.4,-3);x.lineTo(1.4,-3);x.stroke();x.strokeStyle=INK;door()}
  else if(bi===1){x.fillStyle='#b0aca0';x.fillRect(-3,-.8,6,3.5);x.strokeRect(-3,-.8,6,3.5);x.fillStyle='#4a4a58';x.beginPath();x.moveTo(-3.8,-.8);x.lineTo(0,-4.6);x.lineTo(3.8,-.8);x.closePath();x.fill();x.stroke();x.fillStyle='#8a8478';x.fillRect(1.6,-4.2,1.3,2.6);x.strokeRect(1.6,-4.2,1.3,2.6);x.strokeStyle='rgba(180,180,190,.8)';x.beginPath();x.moveTo(2.2,-4.8);x.quadraticCurveTo(3.4,-6,2.2,-7.2);x.stroke();x.strokeStyle=INK;door()}
  else if(bi===2){x.fillStyle='#e0a028';for(let k=0;k<3;k++){x.beginPath();x.ellipse(0,2-k*2.2,3.2-k*.8,1.5,0,0,6.3);x.fill();x.stroke()}x.fillStyle='#3a2410';x.beginPath();x.ellipse(0,1.2,.9,.7,0,0,6.3);x.fill()}
  else if(bi===3){x.fillStyle='#f4e4e0';x.fillRect(-3,-.2,6,2.9);x.strokeRect(-3,-.2,6,2.9);x.fillStyle='#e8a0b4';x.beginPath();x.moveTo(-4,-.2);x.quadraticCurveTo(-4,-5,0,-5.4);x.quadraticCurveTo(4,-5,4,-.2);x.closePath();x.fill();x.stroke();x.strokeStyle='rgba(120,40,70,.7)';x.beginPath();for(const d of [-2.4,-.8,.8,2.4]){x.moveTo(0,-.2);x.lineTo(d,-4.4)}x.stroke();x.strokeStyle=INK;door()}
  else if(bi===4){x.fillStyle='#e6cd92';x.fillRect(-3,0,6,2.7);x.strokeRect(-3,0,6,2.7);x.beginPath();x.arc(0,0,3,Math.PI,0);x.closePath();x.fill();x.stroke();x.fillStyle='#3a2410';x.fillRect(-.7,.6,1.4,2.1);x.beginPath();x.arc(0,-1.4,.6,0,6.3);x.fill()}
  else if(bi===5){x.fillStyle='#4a78c8';x.beginPath();x.moveTo(-3.6,2.7);x.lineTo(0,-4);x.lineTo(3.6,2.7);x.closePath();x.fill();x.stroke();x.fillStyle='#dce8ff';x.beginPath();x.moveTo(-.9,2.7);x.lineTo(0,-.2);x.lineTo(.9,2.7);x.fill();x.strokeStyle=INK;x.beginPath();x.moveTo(0,-4);x.lineTo(0,-6);x.stroke();x.fillStyle='#d03a2a';x.beginPath();x.moveTo(0,-6);x.lineTo(2.2,-5.3);x.lineTo(0,-4.6);x.fill()}
  else if(bi===6){x.fillStyle='#efe6f4';x.fillRect(-3,-.2,6,2.9);x.strokeRect(-3,-.2,6,2.9);x.fillStyle='#8a5ab0';for(let i=0;i<3;i++)for(let j=0;j<2;j++)if((i+j)%2===0)x.fillRect(-3+i*2,-.2+j*1.45,2,1.45);x.fillStyle='#b080d8';x.beginPath();x.moveTo(-3.8,-.2);x.lineTo(0,-4.8);x.lineTo(3.8,-.2);x.closePath();x.fill();x.stroke()}
  else{x.fillStyle='#f4e8b0';x.fillRect(-2.6,0,5.2,2.7);x.strokeRect(-2.6,0,5.2,2.7);x.fillStyle='#e6b422';x.beginPath();x.moveTo(-3,0);x.quadraticCurveTo(-3.6,-3.4,0,-4.2);x.quadraticCurveTo(3.6,-3.4,3,0);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(0,-4.2);x.lineTo(0,-6);x.stroke();x.fillStyle='#3a2410';x.fillRect(-.7,.6,1.4,2.1)}
  x.restore()}
function hgdmpDoorIcon(x,a,b,col,gem,u){if(hgdiDraw(x,gem?'doorgem':'doorkey',a,b+2.4,9*u,col))return;x.save();x.translate(a,b);x.scale(u,u);x.lineJoin='round';x.strokeStyle='#2a1a0c';x.lineWidth=.45;x.fillStyle=col;x.beginPath();x.moveTo(-1.5,2.2);x.lineTo(-1.5,-.5);x.arc(0,-.5,1.5,Math.PI,0);x.lineTo(1.5,2.2);x.closePath();x.fill();x.stroke();
  if(gem){x.fillStyle='#fff';x.beginPath();x.moveTo(0,-.9);x.lineTo(.7,.1);x.lineTo(0,1.1);x.lineTo(-.7,.1);x.closePath();x.fill()}else{x.fillStyle='#14100a';x.beginPath();x.arc(0,.2,.45,0,6.3);x.fill();x.fillRect(-.15,.2,.3,.9)}x.restore()}
function hgdmpStepsIcon(c,a,b,u){if(hgdiDraw(c,'steps',a,b+2.4,10*u))return;c.save();c.translate(a,b);c.scale(u,u);c.lineJoin='round';c.fillStyle='#3a8ab8';c.strokeStyle='#14303c';c.lineWidth=.55;c.beginPath();c.moveTo(-2.8,2.4);c.lineTo(-2.8,-1.2);c.lineTo(-1,-1.2);c.lineTo(-1,0);c.lineTo(1,0);c.lineTo(1,1.2);c.lineTo(2.8,1.2);c.lineTo(2.8,2.4);c.closePath();c.fill();c.stroke();c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=.4;c.beginPath();c.moveTo(-2.4,-2);c.quadraticCurveTo(0,-3,2.4,-2);c.stroke();c.restore()}
function hgdmpBoatIcon(c,a,b,u){if(hgdiDraw(c,'dock',a,b+2.4,11*u))return;c.save();c.translate(a,b);c.scale(u,u);c.lineJoin='round';c.strokeStyle='#2a1808';c.lineWidth=.5;c.fillStyle='#9a6a34';c.beginPath();c.moveTo(-3,.6);c.quadraticCurveTo(0,3.4,3,.6);c.lineTo(2.2,-.6);c.lineTo(-2.2,-.6);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(0,-.6);c.lineTo(0,-4);c.stroke();c.fillStyle='#f0e8d0';c.beginPath();c.moveTo(0,-3.8);c.lineTo(2.2,-1);c.lineTo(0,-1);c.closePath();c.fill();c.stroke();c.restore()}
function hgdmpLadderIcon(x,a,b,u){if(hgdiDraw(x,'ladder',a,b+3,8.5*u))return;x.save();x.translate(a,b);x.scale(u,u);x.strokeStyle='#4a2c14';x.lineWidth=.6;x.fillStyle='#14100a';x.fillRect(-2,-3,4,6);x.strokeRect(-2,-3,4,6);x.strokeStyle='#c08850';x.lineWidth=.5;x.beginPath();x.moveTo(-1,-3);x.lineTo(-1,3);x.moveTo(1,-3);x.lineTo(1,3);for(let y=-2;y<3;y+=1.4){x.moveTo(-1,y);x.lineTo(1,y)}x.stroke();x.restore()}
function hgdmpSheetUnder(){
  const U=LEVELS[HGDU.ID];if(!U)return null;if(HGDMP.cache[5])return HGDMP.cache[5];
  const W=201,H=201,rows=U.rows,A=MPL.AREA,pad=4,s=Math.min((A.w-2*pad)/W,(A.h-2*pad)/H),ox=A.x+(A.w-W*s)/2,oy=A.y+(A.h-H*s)/2,X=c=>ox+c*s,Y=c=>oy+c*s;
  const c=document.createElement('canvas');c.width=DW*MPL.S;c.height=DH*MPL.S;const x=c.getContext('2d');x.scale(MPL.S,MPL.S);
  mplParchment(x);const INK=MPL.INK,open=(a,b)=>rows[b]&&rows[b][a]==='.';
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  x.fillStyle='#4a4258';x.fillRect(A.x,A.y,A.w,A.h);
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!open(cx,cy))continue;x.fillStyle='#e6dbbd';x.fillRect(X(cx),Y(cy),s+.35,s+.35)}
  x.strokeStyle=INK;x.lineWidth=.35;x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!open(cx,cy))continue;const a=X(cx),b=Y(cy);if(!open(cx,cy-1)){x.moveTo(a,b);x.lineTo(a+s,b)}if(!open(cx,cy+1)){x.moveTo(a,b+s);x.lineTo(a+s,b+s)}if(!open(cx-1,cy)){x.moveTo(a,b);x.lineTo(a,b+s)}if(!open(cx+1,cy)){x.moveTo(a+s,b);x.lineTo(a+s,b+s)}}
  x.stroke();
  for(const l of U._hgdu.ladders)hgdmpLadderIcon(x,X(l.x+.5),Y(l.y+.5),.9);
  x.restore();
  mplTitle(x,'The Underlevel','very dark and dangerous',10,12);
  const lx=8,ly=70;x.save();x.font='bold 7px '+FUI;x.fillStyle=INK;x.textAlign='left';x.fillText('KEY',lx,ly);
  hgdmpLadderIcon(x,lx+4.5,ly+12,1.1);x.font='6.2px '+FUI;x.fillText('Ladder up',lx+12,ly+13);
  x.save();x.strokeStyle='#38b8d0';x.lineWidth=1;x.setLineDash([2,2]);x.beginPath();x.moveTo(lx,ly+27);x.lineTo(lx+9,ly+27);x.stroke();x.restore();x.fillText('Your footsteps',lx+12,ly+28);
  x.fillStyle=INK;x.font='6.2px '+FUI;const notes=['No food, no torches.','Dark insects, many.','Something wanders here.'];notes.forEach((n,i)=>x.fillText(n,lx,ly+48+i*10));
  x.restore();mplCompass(x,448,48,17);mplBorder(x);
  return HGDMP.cache[5]={c,X,Y}}
function hgdmpSheet(vi){
  if(vi===5)return hgdmpSheetUnder();
  const L=LEVELS[HGD.ID];if(!L||!L._hgdp)return null;if(HGDMP.cache[vi])return HGDMP.cache[vi];
  const M=L._hgdm,W=M.W,H=M.H,bio=M.bio,kind=M.kind,rows=L.rows,V=HGDMP.views[vi],[,vname,vx,vy,vw,vh]=V,A=MPL.AREA,pad=4,s=Math.min((A.w-2*pad)/vw,(A.h-2*pad)/vh),ox=A.x+(A.w-vw*s)/2,oy=A.y+(A.h-vh*s)/2;
  const X=c=>ox+(c-vx)*s,Y=c=>oy+(c-vy)*s;
  const c=document.createElement('canvas');c.width=DW*MPL.S;c.height=DH*MPL.S;const x=c.getContext('2d');x.scale(MPL.S,MPL.S);
  mplParchment(x);const INK=MPL.INK,big=vi>0,open=(a,b)=>rows[b]&&rows[b][a]==='.';
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  // the rock of each biome, tinted
  for(let cy=vy;cy<vy+vh&&cy<H;cy++)for(let cx=vx;cx<vx+vw&&cx<W;cx++){if(open(cx,cy))continue;x.fillStyle=HGDMP.tints[bio[cy*W+cx]];x.globalAlpha=.9;x.fillRect(X(cx),Y(cy),s+.35,s+.35)}
  x.globalAlpha=1;
  // every corridor, clearing, room and atrium: pale floor (clearings greener, atriums greener still, rooms warmer)
  for(let cy=vy;cy<vy+vh&&cy<H;cy++)for(let cx=vx;cx<vx+vw&&cx<W;cx++){if(!open(cx,cy))continue;const k=kind[cy*W+cx];
    x.fillStyle=k===3?'#cfe0b0':k===1?'#dde8c0':k===2?'#efd9a8':'#f7f0d6';x.fillRect(X(cx),Y(cy),s+.35,s+.35)}
  if(L.fmap)for(let cy=vy;cy<vy+vh&&cy<H;cy++)for(let cx=vx;cx<vx+vw&&cx<W;cx++)if(L.fmap[cy][cx]==='5'&&open(cx,cy)){x.fillStyle='#6a9cc6';x.fillRect(X(cx),Y(cy),s+.35,s+.35)}
  // the ink of the walls
  x.strokeStyle=INK;x.lineWidth=big?.55:.38;x.lineCap='butt';x.beginPath();
  for(let cy=vy;cy<vy+vh&&cy<H;cy++)for(let cx=vx;cx<vx+vw&&cx<W;cx++){if(!open(cx,cy))continue;const a=X(cx),b=Y(cy);
    if(!open(cx,cy-1)){x.moveTo(a,b);x.lineTo(a+s,b)}if(!open(cx,cy+1)){x.moveTo(a,b+s);x.lineTo(a+s,b+s)}if(!open(cx-1,cy)){x.moveTo(a,b);x.lineTo(a,b+s)}if(!open(cx+1,cy)){x.moveTo(a+s,b);x.lineTo(a+s,b+s)}}
  x.stroke();
  // clearings, rooms and atriums get a thin darker outline where they meet a passage
  x.strokeStyle='rgba(58,90,48,.8)';x.lineWidth=big?.7:.5;x.beginPath();
  for(let cy=vy;cy<vy+vh&&cy<H;cy++)for(let cx=vx;cx<vx+vw&&cx<W;cx++){const k=open(cx,cy)?kind[cy*W+cx]:0;if(!k)continue;const a=X(cx),b=Y(cy);
    if(open(cx,cy-1)&&!kind[(cy-1)*W+cx]){x.moveTo(a,b);x.lineTo(a+s,b)}if(open(cx,cy+1)&&!kind[(cy+1)*W+cx]){x.moveTo(a,b+s);x.lineTo(a+s,b+s)}if(open(cx-1,cy)&&!kind[cy*W+cx-1]){x.moveTo(a,b);x.lineTo(a,b+s)}if(open(cx+1,cy)&&!kind[cy*W+cx+1]){x.moveTo(a+s,b);x.lineTo(a+s,b+s)}}
  x.stroke();
  // trees and fountains
  for(const d of L.decor){if(d.x<vx||d.x>=vx+vw||d.y<vy||d.y>=vy+vh)continue;
    if(d.k==='hgt_fairytree'||d.k==='hgtb_plant_belltree'){x.fillStyle='#2f5a2c';x.strokeStyle=INK;x.lineWidth=.3;x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),Math.max(1.1,s*.7),0,6.3);x.fill();if(big)x.stroke()}
    else if(d.k==='hgtb_deco_fountain'){x.fillStyle='#4a86b8';x.strokeStyle=INK;x.lineWidth=.3;x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),Math.max(1.2,s*.7),0,6.3);x.fill();x.stroke()}}
  // danger rings (thin, dashed) and warning signs
  for(const z of L._hgdp.zones){if(z.type!=='danger')continue;if(z.x+z.r<vx||z.x-z.r>vx+vw||z.y+z.r<vy||z.y-z.r>vy+vh)continue;
    x.save();x.strokeStyle='#9a2418';x.lineWidth=big?.9:.7;x.setLineDash([2.4,3]);x.beginPath();x.arc(X(z.x+.5),Y(z.y+.5),z.r*s,0,6.3);x.stroke();x.restore()}
  if(big)for(const d of L.decor){if(d.npc!=='hgd_sign'||d.x<vx||d.x>=vx+vw||d.y<vy||d.y>=vy+vh)continue;const a=X(d.x+.5),b=Y(d.y+.5);if(!hgdiDraw(x,'sign',a,b+2.6,big?8.5:6)){x.fillStyle='#c02a1a';x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.moveTo(a,b-2.8);x.lineTo(a+2.4,b+1.8);x.lineTo(a-2.4,b+1.8);x.closePath();x.fill();x.stroke()}}
  // locked doors that can be seen: a bold square in the colour of the lock
  if(L._hgds)for(const k in L._hgds.doors){const dd=L._hgds.doors[k];if(dd.type==='secret')continue;const p=k.split(',').map(Number);if(p[0]<vx||p[0]>=vx+vw||p[1]<vy||p[1]>=vy+vh)continue;const col=dd.type==='key'?HGDS_KEYS[dd.idx][2]:HGDS_GEMS[dd.idx][2];hgdmpDoorIcon(x,X(p[0]+.5),Y(p[1]+.5),col,dd.type==='gem',big?.85:.6)}
  // towns and enclaves: small huts (a different style in each biome), and the ladders down
  for(const z of L._hgdp.zones){if(z.type!=='safe')continue;if(z.x<vx-2||z.x>vx+vw+2||z.y<vy-2||z.y>vy+vh+2)continue;const town=z.town!==undefined;
    hgdmpHut(x,X(z.x+.5),Y(z.y+.5)-1,bio[z.y*W+z.x],town,(town?.95:.8)*(big?1.05:.7))}
  if(L._hgdu)for(const l of L._hgdu.ladders){if(l.x<vx||l.x>=vx+vw||l.y<vy||l.y>=vy+vh)continue;hgdmpLadderIcon(x,X(l.x+.5),Y(l.y+.5),big?.9:.62)}
  x.restore();
  // frame, title, compass and key
  mplTitle(x,'The Deeper Hollow',vname,10,12);
  const lx=8,ly=64;x.save();x.font='bold 7px '+FUI;x.fillStyle=INK;x.textAlign='left';x.fillText('BIOMES',lx,ly);
  ['Hedge maze','Stone warrens','Honeycomb reach','Shell galleries','Sandstone deeps','Blue quarter','Mosaic halls','Gilded quarter'].forEach((n,i)=>{const yy=ly+10+i*11;x.fillStyle=HGDMP.tints[i];x.strokeStyle=INK;x.lineWidth=.4;x.fillRect(lx,yy-4,9,7);x.strokeRect(lx,yy-4,9,7);x.fillStyle=INK;x.font='6.2px '+FUI;x.fillText(n,lx+12,yy)});
  const ky=ly+104;x.font='bold 7px '+FUI;x.fillStyle=INK;x.fillText('KEY',lx,ky);
  const ent=[['Town',()=>hgdmpHut(x,lx+4.5,ky+9,2,true,1)],['Safe place',()=>hgdmpHut(x,lx+4.5,ky+21,0,false,1)],['Danger zone',()=>{x.strokeStyle='#9a2418';x.lineWidth=.8;x.setLineDash([2,1.6]);x.beginPath();x.arc(lx+4.5,ky+34,4,0,6.3);x.stroke();x.setLineDash([])}],['Warning sign',()=>{if(hgdiDraw(x,'sign',lx+4.5,ky+49,10))return;x.fillStyle='#c02a1a';x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.moveTo(lx+4.5,ky+43);x.lineTo(lx+7.5,ky+49);x.lineTo(lx+1.5,ky+49);x.fill();x.stroke()}],['Locked door',()=>hgdmpDoorIcon(x,lx+4.5,ky+57,'#e0b030',false,1.6)],['Ladder down',()=>hgdmpLadderIcon(x,lx+4.5,ky+71,1.1)],['Your footsteps',()=>{x.save();x.strokeStyle='#38b8d0';x.lineWidth=1;x.setLineDash([2,2]);x.beginPath();x.moveTo(lx,ky+82);x.lineTo(lx+9,ky+82);x.stroke();x.restore()}],['Steps into water',()=>hgdmpStepsIcon(x,lx+4.5,ky+95,1.2)],['Boat dock',()=>hgdmpBoatIcon(x,lx+4.5,ky+107,1.1)]];
  ent.forEach(([n,dr],i)=>{dr();x.fillStyle=INK;x.font='6.2px '+FUI;x.textAlign='left';x.fillText(n,lx+12,ky+[10,22,34,46,59,71,82,96,108][i])});
  x.restore();mplCompass(x,448,48,17);mplBorder(x);
  return HGDMP.cache[vi]={c,X,Y}}
/* the names are a separate layer drawn on the screen over the map: no halo and no box, a fixed small size that looks smaller as the map is zoomed in, and the precinct names fade out as you zoom */
function hgdmpNames(vi){
  const L=LEVELS[HGD.ID];if(vi>=5||!L||!L._hgdp)return[];const V=HGDMP.views[vi],[,,vx,vy,vw,vh]=V,M=L._hgdm,out=[];
  const inV=(x,y)=>x>=vx-2&&x<=vx+vw+2&&y>=vy-2&&y<=vy+vh+2;
  for(const z of L._hgdp.zones){if(!inV(z.x,z.y))continue;if(z.type==='safe')out.push({t:z.name,x:z.x+.5,y:z.y+.5,dy:z.town!==undefined?7:5,k:z.town!==undefined?'town':'encl'});else out.push({t:z.name,x:z.x+.5,y:z.y+.5,dy:0,k:'danger'})}
  out.push({t:'THE DOOR IN',x:M.sx+.5,y:M.H-1.5,dy:-5,k:'door'});
  for(const p of hgdmpPrec(L))if(inV(p.x,p.y))out.push({t:p.name.toUpperCase(),x:p.x+.5,y:p.y+.5,dy:0,k:'prec'});
  return out}
function hgdmpDrawNames(vi){
  const V=MPL.view;if(!V||!V.z)return;const z=V.z,A=V.area,names=hgdmpNames(vi),box=[];
  const col={town:'#6a1a10',encl:'#2a4a22',danger:'#8a1a10',door:'#2a1a0c',prec:'#46281a',thief:'#4a1a1a',marsh:'#1f5a52'},base={town:7,encl:5.6,danger:6,door:5.6,prec:5.8,thief:5.2,marsh:6};
  ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();ctx.textAlign='center';ctx.textBaseline='middle';
  const order=['town','encl','danger','marsh','thief','door','prec'];
  for(const kd of order)for(const n of names){if(n.k!==kd)continue;
    const sz=Math.max(4.6,base[kd]/Math.pow(z,.4)),al=kd==='prec'?Math.max(.3,Math.min(.9,1.25-(z-1)*.3)):Math.max(.7,Math.min(1,1.1-(z-1)*.05));
    if(kd==='prec'&&al<=.32)continue;
    ctx.font=(kd==='prec'?'italic ':'')+'bold '+sz+'px '+FUI;const w=ctx.measureText(n.t).width,px0=A.x+(V.X(n.x)-V.sx0)*z,py0=A.y+(V.Y(n.y+n.dy)-V.sy0)*z;
    if(px0<A.x-w||px0>A.x+A.w+w||py0<A.y-8||py0>A.y+A.h+8)continue;
    const px=Math.max(A.x+w/2+1,Math.min(A.x+A.w-w/2-1,px0));let py=py0,placed=false;
    for(const o of [0,-sz*.9,sz*.9,-sz*1.8,sz*1.8]){const yy=Math.max(A.y+sz/2+1,Math.min(A.y+A.h-sz/2-1,py0+o));if(box.some(q=>Math.abs(q.x-px)<(q.w+w)/2+1&&Math.abs(q.y-yy)<(q.h+sz)/2)){if(kd==='prec')continue;continue}py=yy;placed=true;break}
    if(!placed)continue;box.push({x:px,y:py,w,h:sz+1});ctx.globalAlpha=al;ctx.fillStyle=col[kd];ctx.fillText(n.t,px,py)}
  ctx.restore()}
// the screen
{const _do=drawOverview;drawOverview=function(){
  const WV=LEVEL===477?6:0; // the water levels have their own views
  if((LEVEL!==HGD.ID&&LEVEL!==HGDU.ID&&!WV)||G.world||G.teleMode||!LEVELS[HGD.ID]||!LEVELS[HGD.ID]._hgdp)return _do.apply(this,arguments);
  if(G.hgdLv!==LEVEL){G.hgdLv=LEVEL;G.hgdView=LEVEL===HGDU.ID?5:WV||0}
  const vi=G.hgdView|0,sh=hgdmpSheet(vi);if(!sh)return _do.apply(this,arguments);
  MPL.reveal=false;const own=[HGD.ID,HGD.ID,HGD.ID,HGD.ID,HGD.ID,HGDU.ID,477][vi],gc=G.C;if(own!==LEVEL)G.C={x:-9999,y:-9999,a:0}; // the arrow only shows on the sheet of the level you are in
  try{mplPaint(sh.c,sh.S||MPL.S,MPL.AREA,sh.X,sh.Y,'You are the yellow arrow.')}finally{G.C=gc}if(vi<6)hgdmpDrawTrail(vi);hgdmpDrawNames(vi);
  {let bx=194;HGDMP.views.forEach((v,i)=>{const w=i===5?36:i===6?42:v[0].length>3?33:27;btnText('hgdv'+i,v[0],bx,303,w,17);bx+=w+2})}}}
{const _h=handleBtn;handleBtn=function(id){if(G.overview&&!G.world&&(LEVEL===HGD.ID||LEVEL===HGDU.ID||LEVEL===477)&&/^hgdv\d$/.test(id)){G.hgdView=+id[4];G.mplKey=null;return}return _h.apply(this,arguments)}}
/* ---------- the magic map: it records the party's footsteps in the maze ---------- */
const HGDT_MAX=40000;
function hgdmpDrawTrail(vi){
  const F=G.flags,T=F&&(vi===5?F.hgdTrailU:F.hgdTrail),V=MPL.view;if(!T||!T.length||!V||!V.z)return;const z=V.z,A=V.area;
  ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();ctx.lineJoin='round';ctx.lineCap='round';
  const path=()=>{ctx.beginPath();let pen=false;for(let i=0;i<T.length;i++){const v=T[i];if(v<0){pen=false;continue}const cx=v&255,cy=v>>8,px=A.x+(V.X(cx+.5)-V.sx0)*z,py=A.y+(V.Y(cy+.5)-V.sy0)*z;if(!pen){ctx.moveTo(px,py);pen=true}else ctx.lineTo(px,py)}};
  path();ctx.strokeStyle='rgba(90,230,255,.45)';ctx.lineWidth=3;ctx.setLineDash([]);ctx.stroke();
  path();ctx.strokeStyle='#0a98c8';ctx.lineWidth=.85;ctx.setLineDash([2.4,2.6]);ctx.shadowColor='#5ff';ctx.shadowBlur=5;ctx.stroke();
  ctx.restore()}
{const _u=update;update=function(dt){try{const F=G.flags;if(LEVEL===HGDU.ID&&G.state==='play'&&F&&G.P&&F.hgdMagicMap){const T=F.hgdTrailU||(F.hgdTrailU=[]),cell=G.P.x+(G.P.y<<8),last=F.hgdTrailLastU;if(cell!==last){if(last!==undefined&&(Math.abs((last&255)-G.P.x)+Math.abs((last>>8)-G.P.y)>2)&&T.length&&T[T.length-1]>=0)T.push(-1);T.push(cell);F.hgdTrailLastU=cell;if(T.length>HGDT_MAX)T.splice(0,2000)}}
    if(LEVEL===HGD.ID&&G.state==='play'&&F&&G.P){
    if(!F.hgdMapTold&&!G.talk&&!G.cut&&!G.menu){F.hgdMapTold=1;F.hgdMagicMap=1;msg("Bulb's gift, the silver thread map, wakes in your pack and glows faintly. From now on it records your footsteps in this labyrinth.",'#9ff0ff');later(2600,()=>msg('Open the map to see the line of where you have been. It is a thin, glowing, dashed trail.','#9ff0ff'))}
    if(F.hgdMagicMap){const T=F.hgdTrail||(F.hgdTrail=[]),cell=G.P.x+(G.P.y<<8),last=F.hgdTrailLast;
      if(cell!==last){if(last!==undefined&&(Math.abs((last&255)-G.P.x)+Math.abs((last>>8)-G.P.y)>2)&&T.length&&T[T.length-1]>=0)T.push(-1);T.push(cell);F.hgdTrailLast=cell;if(T.length>HGDT_MAX)T.splice(0,2000)}}}}catch(e){}return _u.apply(this,arguments)}}
/* ---------- a small copy of the maze on the world map ---------- */
WORLD_LOCS.push({k:'deephollow',n:'The Deeper Hollow',sub:'a giant maze',lv:[475],x:-84,y:302,ic:'trees'});
LEVEL_RATING[HGD.ID]=HGD.DIFF;
function hgdmpMini(){
  if(HGDMP.mini)return HGDMP.mini;const S=48,c=document.createElement('canvas');c.width=c.height=S*2;const x=c.getContext('2d');x.scale(2,2);
  x.fillStyle='#e9dcb4';x.fillRect(0,0,S,S);
  // the maze as a hedge of lines: a lattice, drawn the same every time (the real level may not be built yet)
  const rnd=hgdmRng(475009),N=24,cell=S/N,cols=HGDMP.tints;
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const b=Math.max(0,Math.min(7,Math.floor((1-j/N)*7.4)));x.fillStyle=cols[b];x.globalAlpha=.55;x.fillRect(i*cell,j*cell,cell,cell)}x.globalAlpha=1;
  x.strokeStyle='#2a1a0c';x.lineWidth=.6;x.beginPath();for(let j=0;j<N;j+=2)for(let i=0;i<N;i+=2){if(rnd()<.5){x.moveTo(i*cell,j*cell);x.lineTo((i+2)*cell,j*cell)}else{x.moveTo(i*cell,j*cell);x.lineTo(i*cell,(j+2)*cell)}}x.stroke();
  x.strokeStyle='#2a1a0c';x.lineWidth=1.4;x.strokeRect(.7,.7,S-1.4,S-1.4);x.fillStyle='#f4ecd6';x.fillRect(S/2-3,S-5,6,5);x.strokeStyle='#2a1a0c';x.lineWidth=.8;x.strokeRect(S/2-3,S-5,6,5);
  return HGDMP.mini=c}
{const _wi=mpWorldIco;mpWorldIco=function(l,x,y,z){if(l&&l.k==='deephollow'){const m=hgdmpMini(),c=ctx;c.save();c.imageSmoothingQuality='high';c.shadowColor='rgba(40,24,10,.45)';c.shadowBlur=3;c.drawImage(m,x-20,y-26,40,40);c.restore();return}return _wi.apply(this,arguments)}}
