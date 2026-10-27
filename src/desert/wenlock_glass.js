/* ==========================================================================
   WENLOCK: STAINED GLASS AND PAINTED WALL TILES (prefix WLGS). Procedural canvas pieces for the walls and glass of Wenlock: leaded pointed-arch windows in jewel colours,
   a rose window, buttresses, and a helper that copies an existing wall tile (its pixels are in TEX) and paints over it, so every new tile keeps the stone or timber of
   its street. The church of Saint Wenna gets glass in its sides and back (wlgChurch) and in the painted front (wlgPaintFront); the fan-lights over some doors are in wenlock_names.js.
   Everything here is flat front elevation: windows are seen straight on, as in the painted pieces.
   ========================================================================== */
const WLGS={tiles:{},front:false};
/* the jewel colours: [deep, bright] */
const WLGS_COL={red:['#a81424','#ef4a52'],blue:['#1c3a96','#5c8cf0'],gold:['#d29a18','#ffe070'],green:['#1c7438','#5cc878'],violet:['#62289a','#b070e8'],amber:['#d4601a','#ffb060'],teal:['#187484','#60d4d8'],rose:['#bc4478','#f898c0']};
const WLGS_SETS=[['blue','red','gold','blue','green'],['green','gold','red','violet','blue'],['violet','amber','blue','gold','red'],['red','blue','gold','green','teal'],['teal','rose','gold','violet','blue'],['amber','green','blue','red','gold']];
/* a copy of an existing tile with painting over it. src: the tile gid; draw(ctx,w,h) paints on the copy. Cached by key. */
function wlgTile(srcGid,key,draw){
  const k=srcGid+'|'+key;if(WLGS.tiles[k]!==undefined)return WLGS.tiles[k];
  const tx=T_TILE[srcGid],T=TEX[tx];if(!T||!T.d)return WLGS.tiles[k]=srcGid;
  const w=128,h=(T.d.length/512)|0,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  x.putImageData(new ImageData(new Uint8ClampedArray(T.d),w,h),0,0);
  draw(x,w,h);
  const d=x.getImageData(0,0,w,h).data,id=addTex(d,null);TEX[id].h=h;TEX[id].wh=T.wh||h/128;if(T.cren)TEX[id].cren=T.cren;
  const gid=KH_NEXT_GID++;T_TILE[gid]=id;return WLGS.tiles[k]=gid;
}
/* the outline of a pointed (lancet) arch: cx centre, yb bottom, w width, h total height */
function wlgArch(x,cx,yb,w,h,grow){
  grow=grow||0;const hw=w/2+grow,ys=yb-h+.866*w+0;   // ys: where the sides stop being straight
  x.beginPath();x.moveTo(cx-hw,yb+grow);x.lineTo(cx-hw,ys);
  x.arc(cx+w/2,ys,w+grow,Math.PI,Math.PI*4/3,false);x.arc(cx-w/2,ys,w+grow,Math.PI*5/3,Math.PI*2,false);
  x.lineTo(cx+hw,yb+grow);x.closePath();
}
/* a leaded window: diamond panes in jewel colours, lead lines, a little rose at the top, stone all round it. set: one of WLGS_SETS; kind: 0 banded, 1 medallion, 2 saint-and-border */
function wlgWindow(x,cx,yb,w,h,set,kind,seed){
  const pal=WLGS_SETS[set%WLGS_SETS.length],col=i=>WLGS_COL[pal[((i%pal.length)+pal.length)%pal.length]];
  // the stone surround and a deep reveal
  x.save();x.fillStyle='#6e5c3c';wlgArch(x,cx,yb+5,w,h+10,9);x.fill();x.fillStyle='#d8c690';wlgArch(x,cx,yb+4,w,h+6,5);x.fill();x.fillStyle='#4a3c28';wlgArch(x,cx,yb,w,h,1.5);x.fill();x.restore();
  x.save();wlgArch(x,cx,yb,w,h);x.clip();
  x.fillStyle=WLGS_COL[pal[0]][0];x.fillRect(cx-w,yb-h-4,w*2,h+8);
  const dw=Math.max(9,w/4),dh=dw*1.55,y0=yb-h-dh,rows=Math.ceil((h+dh*2)/dh*2);
  const top=yb-h+.866*w;   // the rose sits in the point of the arch, the diamonds below it
  for(let j=0;j<rows;j++){const cy=yb-j*dh/2;if(cy<top-dh*.2)continue;const off=(j%2)*dw/2;
    for(let i=-1;i<Math.ceil(w/dw)+1;i++){const px=cx-w/2+off+i*dw;if(px<cx-w/2-dw||px>cx+w/2+dw)continue;
      const u=(px-(cx-w/2))/w,v=(yb-cy)/h;let ci;
      if(kind===0)ci=v<.28?2:v<.5?1:v<.72?3:0;
      else if(kind===1){const m=Math.hypot((u-.5)*w*1.1,(v-.45)*h*.5);ci=m<w*.22?2:m<w*.42?1:(i+j)%2?4:3}
      else{const edge=u<.2||u>.8;ci=edge?(j%4<2?3:1):(Math.abs(u-.5)<.14?(j%3===0?2:1):(j%2?0:4))}
      const jit=hash2(seed+i,j,77)*.35,cc=col(ci);
      const g=x.createLinearGradient(px-dw/2,cy-dh/2,px+dw/2,cy+dh/2);g.addColorStop(0,cc[1]);g.addColorStop(1,cc[0]);
      x.fillStyle=cc[0];x.beginPath();x.moveTo(px,cy-dh/2);x.lineTo(px+dw/2,cy);x.lineTo(px,cy+dh/2);x.lineTo(px-dw/2,cy);x.closePath();x.fill();
      x.globalAlpha=.55+jit;x.fillStyle=g;x.fill();x.globalAlpha=1;
      x.strokeStyle='#17140f';x.lineWidth=2.1;x.stroke()}}
  // a rose in the point: four small lobes round a gold boss
  {const rc=top-w*.02,rr=Math.min(w*.3,18);if(rc-rr>yb-h){x.fillStyle='#17140f';x.beginPath();x.arc(cx,rc,rr+1.5,0,6.3);x.fill();
    for(let q=0;q<4;q++){const a=q*Math.PI/2+Math.PI/4,cc=col(q+1);x.fillStyle=cc[1];x.beginPath();x.arc(cx+Math.cos(a)*rr*.5,rc+Math.sin(a)*rr*.5,rr*.42,0,6.3);x.fill();x.strokeStyle='#17140f';x.lineWidth=1.6;x.stroke()}
    x.fillStyle=WLGS_COL.gold[1];x.beginPath();x.arc(cx,rc,rr*.22,0,6.3);x.fill()}}
  // the centre mullion and a transom
  x.fillStyle='#17140f';x.fillRect(cx-1.6,yb-h,3.2,h);x.fillRect(cx-w/2,yb-h*.42,w,2.6);
  // glow: the glass is lit from behind
  const gl=x.createRadialGradient(cx,yb-h*.5,2,cx,yb-h*.5,h*.62);gl.addColorStop(0,'rgba(255,245,210,.34)');gl.addColorStop(1,'rgba(255,245,210,0)');x.fillStyle=gl;x.fillRect(cx-w,yb-h-4,w*2,h+8);
  x.restore();
  // the sill
  x.fillStyle='#bfae80';x.fillRect(cx-w/2-8,yb+4,w+16,6);x.fillStyle='#5a4a30';x.fillRect(cx-w/2-8,yb+10,w+16,2);
}
/* a round rose window of n petals; (cx,cy) centre, r radius */
function wlgRose(x,cx,cy,r,set,seed){
  const pal=WLGS_SETS[set%WLGS_SETS.length],col=i=>WLGS_COL[pal[((i%pal.length)+pal.length)%pal.length]],k=Math.min(1,Math.max(.22,r/60));   // k thins the lead and the stone on a small rose
  x.save();x.fillStyle='#6e5c3c';x.beginPath();x.arc(cx,cy,r+9*k,0,6.3);x.fill();x.fillStyle='#d8c690';x.beginPath();x.arc(cx,cy,r+5*k,0,6.3);x.fill();x.fillStyle='#17140f';x.beginPath();x.arc(cx,cy,r+1.5*k,0,6.3);x.fill();
  x.beginPath();x.arc(cx,cy,r,0,6.3);x.clip();x.fillStyle=col(0)[0];x.fillRect(cx-r,cy-r,r*2,r*2);
  const n=8;
  for(let i=0;i<n;i++){const a0=i*Math.PI*2/n,a1=(i+1)*Math.PI*2/n,cc=col(i%2?2:1);   // wedge petals
    x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,r,a0,a1);x.closePath();const g=x.createRadialGradient(cx,cy,r*.15,cx,cy,r);g.addColorStop(0,cc[1]);g.addColorStop(1,cc[0]);x.fillStyle=g;x.fill();x.strokeStyle='#17140f';x.lineWidth=2.4*k;x.stroke();
    const am=(a0+a1)/2;x.fillStyle=col(i+3)[1];x.globalAlpha=.9;x.beginPath();x.arc(cx+Math.cos(am)*r*.66,cy+Math.sin(am)*r*.66,r*.17,0,6.3);x.fill();x.globalAlpha=1;x.lineWidth=1.8*k;x.stroke()}
  x.strokeStyle='#17140f';x.lineWidth=2.6*k;x.beginPath();x.arc(cx,cy,r*.4,0,6.3);x.stroke();x.beginPath();x.arc(cx,cy,r*.78,0,6.3);x.stroke();
  x.fillStyle=WLGS_COL.gold[1];x.beginPath();x.arc(cx,cy,r*.17,0,6.3);x.fill();x.strokeStyle='#17140f';x.lineWidth=2*k;x.stroke();
  const gl=x.createRadialGradient(cx,cy,1,cx,cy,r);gl.addColorStop(0,'rgba(255,245,210,.4)');gl.addColorStop(1,'rgba(255,245,210,0)');x.fillStyle=gl;x.fillRect(cx-r,cy-r,r*2,r*2);
  x.restore();
}
/* a buttress: a lighter, slightly proud column of dressed stone, with a weathered cap and a string course */
function wlgButtress(x,w,h,top){
  x.save();const l=34,r=w-34;
  const g=x.createLinearGradient(l,0,r,0);g.addColorStop(0,'rgba(60,44,24,.5)');g.addColorStop(.14,'rgba(255,240,200,.28)');g.addColorStop(.86,'rgba(255,240,200,.22)');g.addColorStop(1,'rgba(40,28,14,.55)');
  x.fillStyle=g;x.fillRect(l,top,r-l,h-top);
  x.fillStyle='rgba(40,28,14,.5)';for(let y=h-30;y>top;y-=34)x.fillRect(l,y,r-l,2);
  x.fillStyle='rgba(255,240,200,.35)';x.beginPath();x.moveTo(l-3,top+26);x.lineTo(l+(r-l)/2,top);x.lineTo(r+3,top+26);x.closePath();x.fill();
  x.restore();
}
/* a string course and a plinth along a stone wall, so a long blank wall has a base and a band */
function wlgBand(x,w,h){x.fillStyle='rgba(40,28,14,.35)';x.fillRect(0,h-22,w,3);x.fillStyle='rgba(255,240,200,.25)';x.fillRect(0,h-19,w,3);}
/* ---- the church of Saint Wenna: tiles for the sides and the back ---- */
function wlgChurch(C){
  const {TM,rows,ch}=C,WH=3.1,base=TM.make('plain','golden',WH),bgid=base.gid,H=Math.round(128*WH);
  const win=(set,kind,wd,hh,key)=>wlgTile(bgid,key,(x,w,h)=>{wlgBand(x,w,h);wlgWindow(x,64,h-92,wd,hh,set,kind,set*7+kind)});
  const twin=set=>wlgTile(bgid,'twin'+set,(x,w,h)=>{wlgBand(x,w,h);wlgWindow(x,33,h-96,34,150,set,0,set);wlgWindow(x,95,h-96,34,150,set+2,2,set+5);});
  const butt=wlgTile(bgid,'butt',(x,w,h)=>{wlgBand(x,w,h);wlgButtress(x,w,h,30)});
  const slit=wlgTile(bgid,'slit',(x,w,h)=>{wlgBand(x,w,h);wlgWindow(x,64,h-150,22,110,2,1,9)});
  const roseA=i=>wlgTile(bgid,'rose'+i,(x,w,h)=>{wlgBand(x,w,h);x.save();x.translate(-128*i,0);wlgRose(x,128,h-205,68,1,3);x.restore()});
  const set=(x,y,g)=>{rows[y][x]=ch(g)};
  const C0=WL_CHURCH,x0=C0.x0,x1=C0.x1,y0=C0.y0,y1=C0.y1;
  // the east side
  [[y0,'b'],[y0+1,'w',0],[y0+2,'w',1],[y0+3,'b'],[y0+4,'t',3],[y0+5,'b']].forEach(([y,k,s])=>set(x1,y,k==='b'?butt:k==='t'?twin(s):win(s,1,56,190,'w'+s)));
  // the west side (the tower is at the south end of it)
  [[y0,'b'],[y0+1,'w',2],[y0+2,'w',4],[y0+3,'b'],[y0+4,'s'],[y0+5,'s']].forEach(([y,k,s])=>set(x0,y,k==='b'?butt:k==='s'?slit:win(s,0,56,190,'w'+s)));
  // the back: windows either side, a rose over the middle
  const mid=Math.floor((x0+x1)/2);   // the rose spans mid and mid+1
  for(let x=x0;x<=x1;x++){const k=x-x0;let g;
    if(x===x0||x===x1)g=butt;else if(x===mid)g=roseA(0);else if(x===mid+1)g=roseA(1);else g=win((k+2)%6,k%3,50,170,'b'+k);set(x,y0,g)}
  // the stone of the front row: the corners are buttresses too
  set(x0,y1,butt);set(x1,y1,butt);
}
/* the painted front of the church: stained glass painted into its five windows, and a small rose in the gable of the porch (image coordinates of bldg1_0, 471 by 431) */
function wlgPaintFront(){
  if(WLGS.front||!IMG.wl_bldg1_0)return;WLGS.front=true;
  const im=IMG.wl_bldg1_0,c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
  const gl=(cx,yb,w,h,set,kind)=>{x.save();wlgArch(x,cx,yb,w,h);x.clip();x.globalAlpha=.8;
    // a paler, thinner version of the window, laid over the painted one so its own tracery still shows through
    const t=document.createElement('canvas');t.width=Math.ceil(w+24);t.height=Math.ceil(h+24);const tx=t.getContext('2d');wlgWindow(tx,t.width/2,t.height-6,w,h,set,kind,set+kind);
    x.drawImage(t,cx-t.width/2,yb-t.height+6);x.restore()};
  gl(77,386,26,62,0,2);gl(273,386,25,60,1,0);gl(344,386,25,60,3,1);gl(414,386,25,60,2,2);
  // the little rose in the porch gable
  x.save();x.translate(0,0);wlgRose(x,181,322,12,0,1);x.restore();
  IMG.wl_bldg1_0=c;
}
