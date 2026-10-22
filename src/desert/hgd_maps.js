/* ==========================================================================
   THE DEEPER HOLLOW, STAGE 4: THE MAPS (prefix hgdmp / HGDMP). The whole maze on one illuminated parchment, and a local map of each of its four quadrants, all drawn from the real
   level, so every corridor is on them. The precincts have names (three in each biome), the towns and the signed danger zones are marked, trees, ponds and fountains show in the open
   places. Nothing secret is drawn (secret doors stay plain wall, chests and the creatures are left out). A small copy of the maze sits on the world map.
   Buttons on the map screen switch between Whole, NW, NE, SW and SE.
   ========================================================================== */
const HGDMP={cache:{},mini:null,names:[['The Briar Rows','Lowhedge Ward','The Thorn Reach'],['Cairn Precinct','The Mason\'s Ward','Gravel Court'],['The Waxen Ward','Droneside Precinct','The Brood Rows'],['The Whelk Rows','The Whelk Court','Pearl Ward'],['Scarab Row','The Dry Ward','Scarab Court'],['Lamp Ward','The Blue Precinct','Inkwell Court'],['The Tile Rows','The Pattern Rows','Grout Court'],['The Gilt Rows','The Gilded Ward','Leaf Court']],
  tints:['#a9bd8a','#b3b0a2','#d8a23c','#e0bcc4','#d9bf8a','#8fa8d0','#c4b0d6','#f1e6a8'],
  views:[['All','The Whole Maze',0,0,201,201],['NW','The North-West Quarter',0,0,101,101],['NE','The North-East Quarter',100,0,101,101],['SW','The South-West Quarter',0,100,101,101],['SE','The South-East Quarter',100,100,101,101]]};
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
function hgdmpSheet(vi){
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
  if(big)for(const d of L.decor){if(d.npc!=='hgd_sign'||d.x<vx||d.x>=vx+vw||d.y<vy||d.y>=vy+vh)continue;x.fillStyle='#c02a1a';x.strokeStyle=INK;x.lineWidth=.4;const a=X(d.x+.5),b=Y(d.y+.5);x.beginPath();x.moveTo(a,b-2.8);x.lineTo(a+2.4,b+1.8);x.lineTo(a-2.4,b+1.8);x.closePath();x.fill();x.stroke()}
  // locked doors that can be seen: a bold square in the colour of the lock
  if(L._hgds)for(const k in L._hgds.doors){const dd=L._hgds.doors[k];if(dd.type==='secret')continue;const p=k.split(',').map(Number);if(p[0]<vx||p[0]>=vx+vw||p[1]<vy||p[1]>=vy+vh)continue;const col=dd.type==='key'?HGDS_KEYS[dd.idx][2]:HGDS_GEMS[dd.idx][2];x.fillStyle=col;x.strokeStyle=INK;x.lineWidth=.7;const a=X(p[0]+.5),b=Y(p[1]+.5),h=big?3.4:2.4;x.fillRect(a-h,b-h,h*2,h*2);x.strokeRect(a-h,b-h,h*2,h*2)}
  // towns and enclaves: houses
  for(const z of L._hgdp.zones){if(z.type!=='safe')continue;if(z.x<vx-2||z.x>vx+vw+2||z.y<vy-2||z.y>vy+vh+2)continue;const a=X(z.x+.5),b=Y(z.y+.5),town=z.town!==undefined,st=(town?1:.7)*(big?1.4:1);
    x.save();x.translate(a,b);x.scale(st,st);x.strokeStyle=INK;x.lineWidth=.7;x.fillStyle=town?'#f4ecd6':'#e8e0c0';x.fillRect(-4,-3,8,6);x.strokeRect(-4,-3,8,6);x.fillStyle=town?'#b8321e':'#6a8a4a';x.beginPath();x.moveTo(-5,-3);x.lineTo(0,-8);x.lineTo(5,-3);x.closePath();x.fill();x.stroke();x.fillStyle=INK;x.fillRect(-1,0,2,3);x.restore()}
  x.restore();
  // frame, title, compass and key
  mplTitle(x,'The Deeper Hollow',vname,10,12);
  const lx=8,ly=64;x.save();x.font='bold 7px '+FUI;x.fillStyle=INK;x.textAlign='left';x.fillText('BIOMES',lx,ly);
  ['Hedge maze','Stone warrens','Honeycomb reach','Shell galleries','Sandstone deeps','Blue quarter','Mosaic halls','Gilded quarter'].forEach((n,i)=>{const yy=ly+10+i*11;x.fillStyle=HGDMP.tints[i];x.strokeStyle=INK;x.lineWidth=.4;x.fillRect(lx,yy-4,9,7);x.strokeRect(lx,yy-4,9,7);x.fillStyle=INK;x.font='6.2px '+FUI;x.fillText(n,lx+12,yy)});
  const ky=ly+104;x.font='bold 7px '+FUI;x.fillStyle=INK;x.fillText('KEY',lx,ky);
  const ent=[['Town',()=>{x.fillStyle='#f4ecd6';x.strokeStyle=INK;x.lineWidth=.5;x.fillRect(lx+1,ky+7,7,5);x.strokeRect(lx+1,ky+7,7,5);x.fillStyle='#b8321e';x.beginPath();x.moveTo(lx,ky+7);x.lineTo(lx+4.5,ky+2);x.lineTo(lx+9,ky+7);x.fill();x.stroke()}],['Danger zone',()=>{x.strokeStyle='#9a2418';x.lineWidth=.8;x.setLineDash([2,1.6]);x.beginPath();x.arc(lx+4.5,ky+22,4,0,6.3);x.stroke();x.setLineDash([])}],['Warning sign',()=>{x.fillStyle='#c02a1a';x.strokeStyle=INK;x.lineWidth=.4;x.beginPath();x.moveTo(lx+4.5,ky+31);x.lineTo(lx+7.5,ky+37);x.lineTo(lx+1.5,ky+37);x.fill();x.stroke()}],['Locked door',()=>{x.fillStyle='#e0b030';x.strokeStyle=INK;x.lineWidth=.7;x.fillRect(lx+1,ky+43,7,7);x.strokeRect(lx+1,ky+43,7,7)}]];
  ent.forEach(([n,dr],i)=>{dr();x.fillStyle=INK;x.font='6.2px '+FUI;x.textAlign='left';x.fillText(n,lx+12,ky+(i===0?10:i===1?22:i===2?34:48))});
  x.restore();mplCompass(x,448,48,17);mplBorder(x);
  return HGDMP.cache[vi]={c,X,Y}}
/* the names are a separate layer drawn on the screen over the map: no halo and no box, a fixed small size that looks smaller as the map is zoomed in, and the precinct names fade out as you zoom */
function hgdmpNames(vi){
  const L=LEVELS[HGD.ID];if(!L||!L._hgdp)return[];const V=HGDMP.views[vi],[,,vx,vy,vw,vh]=V,M=L._hgdm,out=[];
  const inV=(x,y)=>x>=vx-2&&x<=vx+vw+2&&y>=vy-2&&y<=vy+vh+2;
  for(const z of L._hgdp.zones){if(!inV(z.x,z.y))continue;if(z.type==='safe')out.push({t:z.name,x:z.x+.5,y:z.y+.5,dy:z.town!==undefined?7:5,k:z.town!==undefined?'town':'encl'});else out.push({t:z.name,x:z.x+.5,y:z.y+.5,dy:0,k:'danger'})}
  out.push({t:'THE DOOR IN',x:M.sx+.5,y:M.H-1.5,dy:-5,k:'door'});
  for(const p of hgdmpPrec(L))if(inV(p.x,p.y))out.push({t:p.name.toUpperCase(),x:p.x+.5,y:p.y+.5,dy:0,k:'prec'});
  return out}
function hgdmpDrawNames(vi){
  const V=MPL.view;if(!V||!V.z)return;const z=V.z,A=V.area,names=hgdmpNames(vi),box=[];
  const col={town:'#6a1a10',encl:'#2a4a22',danger:'#8a1a10',door:'#2a1a0c',prec:'#46281a'},base={town:7,encl:5.6,danger:6,door:5.6,prec:5.8};
  ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();ctx.textAlign='center';ctx.textBaseline='middle';
  const order=['town','encl','danger','door','prec'];
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
  if(LEVEL!==HGD.ID||G.world||G.teleMode||!LEVELS[HGD.ID]||!LEVELS[HGD.ID]._hgdp)return _do.apply(this,arguments);
  const vi=G.hgdView|0,sh=hgdmpSheet(vi);if(!sh)return _do.apply(this,arguments);
  MPL.reveal=false;mplPaint(sh.c,MPL.S,MPL.AREA,sh.X,sh.Y,'You are the yellow arrow.');hgdmpDrawNames(vi);
  HGDMP.views.forEach((v,i)=>btnText('hgdv'+i,v[0],124+i*29,303,27,17))}}
{const _h=handleBtn;handleBtn=function(id){if(G.overview&&!G.world&&LEVEL===HGD.ID&&/^hgdv\d$/.test(id)){G.hgdView=+id[4];G.mplKey=null;return}return _h.apply(this,arguments)}}
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
