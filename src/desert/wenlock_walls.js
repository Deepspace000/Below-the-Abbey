/* ==========================================================================
   WENLOCK: THE BLANK WALLS (prefix wlw). Walls that were flat slabs now have something on them:
   - the hidden blocks under the painted barn, dovecote, mill and windmill get proper backs and sides (boarding, pigeon holes, stone with windows, whitewash), and real doors that lead
     into small rooms (wenlock_mill.js: mill 7092, barn 7093, dovecote 7094, windmill 7096; the chapel is 7095);
   - the sides and backs of houses get ground-floor windows, ivy and plainer wall in a mix, so no long wall is blank;
   - the village hall gets windows on its north and south faces and a notice board each;
   - notice boards on a few blank walls (decor with wd and txt, the same plaques as the shop signs).
   Wall tiles are shown mirrored by the engine, so anything with writing is painted in a mirror (see wenlock_names.js).
   ========================================================================== */
const WLX={MILL:7092,BARN:7093,DOVE:7094,CHAPEL:7095,WIND:7096};
/* a tile made from nothing: key, wall height in cells, draw(ctx,w,h) */
function wlwNew(key,wh,draw){
  const k='new|'+key+'|'+wh;if(WLGS.tiles[k]!==undefined)return WLGS.tiles[k];
  const w=128,h=Math.round(128*wh),c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);
  const id=addTex(x.getImageData(0,0,w,h).data,null);TEX[id].h=h;TEX[id].wh=wh;const gid=KH_NEXT_GID++;T_TILE[gid]=id;return WLGS.tiles[k]=gid;
}
/* a door tile that leads into a room built later (KH_LAZY); its start square is looked up when the door is opened */
function wlwDoorGid(tex,lvl){
  const gid=KH_NEXT_GID++;T_TILE[gid]=tex;
  KH_DOOR[gid]={lvl,get at(){if(!LEVELS[lvl]&&KH_LAZY[lvl])KH_LAZY[lvl]();const L=LEVELS[lvl],st=L&&L.start;return st?{x:st.x,y:st.y,f:0}:{x:4,y:4,f:0}}};return gid;
}
/* ivy: a mat of leaves climbing from the ground, ragged at the top. cover 0..1 is how high it reaches, side -1/0/1 leans it to one edge */
function wlwIvy(x,w,h,seed,cover,side){
  const cols=['#2c5424','#386a2c','#46803a','#24461e','#5a9446'];const top=h-h*cover;
  x.save();
  x.strokeStyle='#3a2a18';x.lineWidth=2;for(let i=0;i<3;i++){const sx=w*(.2+hash2(seed,i,1)*.6+side*.15);x.beginPath();x.moveTo(sx,h);let px=sx;for(let y=h;y>top;y-=14){px+=(hash2(seed,i*50+y,2)-.5)*10;x.lineTo(px,y)}x.stroke()}
  const n=Math.round(150*cover+40);
  for(let i=0;i<n;i++){const u=hash2(seed,i,3),v=hash2(seed,i,4),px=w*(.04+.92*(side>0?Math.pow(u,1.5):side<0?1-Math.pow(u,1.5):u)),py=top+(h-top)*Math.pow(v,.7);
    const ragged=top+(h-top)*(.1*hash2(seed,(px/9)|0,5));if(py<ragged)continue;
    const a=hash2(seed,i,6)*6.28,r=4+hash2(seed,i,7)*5;x.fillStyle=cols[(hash2(seed,i,8)*cols.length)|0];
    x.save();x.translate(px,py);x.rotate(a);x.beginPath();x.moveTo(0,-r);x.quadraticCurveTo(r*.9,-r*.2,0,r*.9);x.quadraticCurveTo(-r*.9,-r*.2,0,-r);x.fill();
    x.strokeStyle='rgba(20,40,14,.55)';x.lineWidth=.8;x.beginPath();x.moveTo(0,-r*.8);x.lineTo(0,r*.7);x.stroke();x.restore()}
  x.restore();
}
/* boarding, as on a barn: weathered upright boards on a stone plinth, two rails and a brace; kind 0 plain, 1 with a hay loft hatch, 2 with a small barred window */
function wlwBoards(key,wh,kind){
  return wlwNew('boards'+key+kind,wh,(x,w,h)=>{
    const plinth=44;x.fillStyle='#4a3420';x.fillRect(0,0,w,h);
    for(let b=0;b<8;b++){const bx=b*16,tone=hash2(key.length+kind,b,11),g=x.createLinearGradient(bx,0,bx+16,0);const c0=[96+tone*30,66+tone*20,38+tone*12];
      g.addColorStop(0,'rgb('+(c0[0]-14)+','+(c0[1]-10)+','+(c0[2]-6)+')');g.addColorStop(.5,'rgb('+c0.map(Math.round)+')');g.addColorStop(1,'rgb('+(c0[0]-20)+','+(c0[1]-14)+','+(c0[2]-8)+')');x.fillStyle=g;x.fillRect(bx,0,15,h-plinth);
      x.fillStyle='#1c120a';x.fillRect(bx+15,0,1.4,h-plinth);
      for(let s=0;s<5;s++){x.strokeStyle='rgba(30,18,8,'+(.18+hash2(b,s,12)*.2)+')';x.lineWidth=.8;const gy=hash2(b,s,13)*(h-plinth);x.beginPath();x.moveTo(bx+2+hash2(b,s,14)*10,gy);x.lineTo(bx+2+hash2(b,s,15)*10,gy+20+hash2(b,s,16)*40);x.stroke()}}
    for(const ry of [h*.34,h*.7]){x.fillStyle='#3a2616';x.fillRect(0,ry,w,11);x.fillStyle='rgba(255,230,180,.15)';x.fillRect(0,ry,w,2);x.fillStyle='#16110d';for(let n=0;n<4;n++){x.beginPath();x.arc(10+n*36,ry+5.5,1.8,0,6.3);x.fill()}}
    x.strokeStyle='#3a2616';x.lineWidth=9;x.beginPath();x.moveTo(6,h*.34+8);x.lineTo(122,h*.7);x.stroke();x.strokeStyle='rgba(255,230,180,.13)';x.lineWidth=1.5;x.beginPath();x.moveTo(6,h*.34+3);x.lineTo(122,h*.7-5);x.stroke();
    if(kind===1){const hx=34,hy=h*.12,hw=60,hh=h*.2;x.fillStyle='#22160c';x.fillRect(hx-4,hy-4,hw+8,hh+8);x.fillStyle='#5a3e22';x.fillRect(hx,hy,hw,hh);x.fillStyle='#16110d';x.fillRect(hx+hw/2-1,hy,2,hh);
      x.strokeStyle='#16110d';x.lineWidth=2.4;x.beginPath();x.moveTo(hx,hy);x.lineTo(hx+hw,hy+hh);x.moveTo(hx+hw,hy);x.lineTo(hx,hy+hh);x.stroke();x.fillStyle='#1c1c22';x.fillRect(hx,hy+hh*.3,hw,5);x.fillRect(hx,hy+hh*.72,hw,5)}
    if(kind===2){const hx=46,hy=h*.46,hw=36,hh=30;x.fillStyle='#22160c';x.fillRect(hx-4,hy-4,hw+8,hh+8);x.fillStyle='#0a0806';x.fillRect(hx,hy,hw,hh);x.fillStyle='#2a2a32';for(let n=0;n<4;n++)x.fillRect(hx+4+n*9,hy,3,hh);x.fillRect(hx,hy+hh/2-1.5,hw,3)}
    // the stone plinth: rubble courses
    x.fillStyle='#3a362e';x.fillRect(0,h-plinth,w,plinth);
    for(let r=0;r<3;r++){for(let n=0;n<5;n++){const sx=n*27+(r%2)*13+hash2(r,n,17)*6,sy=h-plinth+r*15,tone=100+hash2(r,n,18)*60;x.fillStyle='rgb('+tone+','+(tone-6)+','+(tone-18)+')';x.beginPath();x.roundRect?x.roundRect(sx,sy,25,13,4):x.rect(sx,sy,25,13);x.fill();x.strokeStyle='rgba(20,16,10,.5)';x.lineWidth=1;x.stroke()}}
    x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,h-6,w,6);
  });
}
/* the dovecote: pale stone with rows of small arched pigeon holes, each with a ledge */
function wlwHoles(base,key,wh,rowsN){
  return wlgTile(base,'holes'+key+rowsN,(x,w,h)=>{
    for(let r=0;r<rowsN;r++){const y=h-70-r*34;for(let n=0;n<4;n++){const px=16+n*32+(r%2)*16;if(px>w-8)continue;
      x.fillStyle='#2a2216';x.beginPath();x.moveTo(px-5,y+12);x.lineTo(px-5,y+4);x.arc(px,y+4,5,Math.PI,0);x.lineTo(px+5,y+12);x.closePath();x.fill();
      x.fillStyle='#e6dcc0';x.fillRect(px-8,y+12,16,3);x.fillStyle='rgba(60,44,20,.5)';x.fillRect(px-8,y+15,16,2)}}
  });
}
/* ---- the doors painted onto the pictures: the mill had none. A plank door in the dark opening at its lower right (picture coordinates 459 by 436) ---- */
function wlwPaintMill(){
  if(WLGS.mill||!IMG.wl_bldg1_3)return;WLGS.mill=true;
  const im=IMG.wl_bldg1_3,c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
  const cx=387,bt=436,w=34,h=52,top=bt-h;
  x.fillStyle='#2a1c10';x.beginPath();x.moveTo(cx-w/2-4,bt);x.lineTo(cx-w/2-4,top+14);x.arc(cx,top+14,w/2+4,Math.PI,0);x.lineTo(cx+w/2+4,bt);x.closePath();x.fill();
  x.save();x.beginPath();x.moveTo(cx-w/2,bt);x.lineTo(cx-w/2,top+16);x.arc(cx,top+16,w/2,Math.PI,0);x.lineTo(cx+w/2,bt);x.closePath();x.clip();
  const g=x.createLinearGradient(cx-w/2,0,cx+w/2,0);g.addColorStop(0,'#4a2e18');g.addColorStop(.5,'#6e4a26');g.addColorStop(1,'#46301a');x.fillStyle=g;x.fillRect(cx-w/2,top,w,h);
  x.fillStyle='rgba(20,10,4,.6)';for(let i=1;i<5;i++)x.fillRect(cx-w/2+i*w/5,top,1.4,h);
  x.fillStyle='#1c1c22';x.fillRect(cx-w/2,top+24,w,4);x.fillRect(cx-w/2,bt-14,w,4);x.restore();
  x.fillStyle='#d0a840';x.beginPath();x.arc(cx+8,bt-22,2.2,0,6.3);x.fill();
  // a stone step
  x.fillStyle='#8a7a5a';x.fillRect(cx-w/2-8,bt-3,w+16,5);
  IMG.wl_bldg1_3=c;
}
/* ---- the pass ---- */
function wlwPass(C){
  const {rows,ch,TM,houses,hs,chars}=C,OSTY=WL.sty;
  wlwPaintMill();
  // 1. the hidden blocks under the big pictures: boarding, pigeon holes, honey stone, whitewash. Door squares lead into rooms.
  const defs={
    'The Barn':{wh:2.4,tiles:()=>[wlwBoards('b',2.4,0),wlwBoards('b',2.4,1),wlwBoards('b',2.4,2),wlwBoards('b',2.4,0)],doors:[[63,18],[64,18]],lvl:WLX.BARN},
    'The Dovecote':{wh:2.4,tiles:()=>{const b=TM.make('plain','golden',2.4).gid,im=IMG.wl_bldg1_4;if(!im)return [wlwHoles(b,'a',2.4,3),wlwHoles(b,'a',2.4,2),b,wlwHoles(b,'a',2.4,3)];
      // the sides of the tower are cut from its own painted stonework, so the slab behind the picture matches it
      const cut=(n,sx)=>wlwNew('dove'+n,2.4,(x,w,h)=>{x.drawImage(im,sx,214,90,216,0,0,w,h)});return [cut(0,22),cut(1,195),cut(2,22),cut(3,195)]},doors:[[54,38],[55,38]],lvl:WLX.DOVE},
    'Wenlock Mill':{wh:2.4,tiles:()=>{const s='golden';return [TM.make('plain',s,2.4).gid,TM.make('gwin',s,2.4).gid,TM.make('window',s,2.4).gid,TM.make('plain2',s,2.4).gid,TM.make('window2',s,2.4).gid]},doors:[[79,88],[80,88]],lvl:WLX.MILL},
    'The Windmill':{wh:2.4,tiles:()=>{const s=OSTY.white||'cottage';return [TM.make('plain',s,2.4).gid,TM.make('gwin',s,2.4).gid,TM.make('window',s,2.4).gid,TM.make('plain2',s,2.4).gid]},doors:[[86,89],[87,89]],lvl:WLX.WIND}
  };
  for(const p of (WL.pics||[])){const d=defs[p.nm];if(!d)continue;const T=d.tiles();
    for(let y=p.y0;y<=p.y1;y++)for(let x=p.x0;x<=p.x1;x++){
      if(d.doors.some(q=>q[0]===x&&q[1]===y)){
        let tx;if(p.nm==='The Barn')tx=T_TILE[wlwBoards('door',2.4,0)];else tx=T_TILE[T[0]];
        const dg=wlwDoorGid(tx,d.lvl);rows[y][x]=ch(dg);continue}
      const r=hs(x,y,71),g=T[(r*T.length)|0];
      let gg=g;if(p.nm==='Wenlock Mill'&&hs(x,y,72)<.4)gg=wlgTile(g,'ivy'+x+y,(c,w,h)=>wlwIvy(c,w,h,x*31+y,.5+hs(x,y,73)*.4,0));
      rows[y][x]=ch(gg)}}
  // 2. house sides and backs: ground-floor windows, ivy, and plain wall in a mix
  for(const h of houses){
    const sty=OSTY[h.sty]||h.sty,wh=h.wh,front=(x,y)=>h.face==='N'?y===h.y0:h.face==='S'?y===h.y1:h.face==='E'?x===h.x1:x===h.x0;
    const horiz=h.face==='N'||h.face==='S';
    for(let y=h.y0;y<=h.y1;y++)for(let x=h.x0;x<=h.x1;x++){
      if(front(x,y)||(x===h.door[0]&&y===h.door[1]))continue;
      if(h.spk==='hall')continue;
      const r=hs(x,y,61),mk=k=>TM.make(k,sty,wh).gid;let g=null;
      if(r<.28)g=mk('gwin');else if(r<.42)g=mk('window2');else if(r<.62){const b=mk(hs(x,y,62)<.5?'plain':'window');g=wlgTile(b,'ivyh'+h.sty+wh+(x*7+y*3)%5,(c,w,hh)=>wlwIvy(c,w,hh,x*13+y*7,.45+hs(x,y,63)*.35,((x+y)%3)-1))}
      else if(r<.72)g=mk('plain2');
      if(g!==null)rows[y][x]=ch(g)}
  }
  // 3. the village hall: windows on its north and south faces
  {const H=WL_HALL,sty=OSTY.honey||'golden',wh=3.0,mk=k=>TM.make(k,sty,wh).gid;
    for(let x=H.x0+1;x<=H.x1;x++)for(const y of [H.y0,H.y1]){rows[y][x]=ch((x+y)%2?mk('window'):mk('gwin'))}}
  // 4. notices on blank walls
  const note=(x,y,wd,a,b,sc)=>{if(!(rows[y]&&rows[y][x]==='.'))return;C.decor.push({k:'sign_wlnote',x,y,block:false,wd,txt:[a,b||''],sc:sc||.75})};
  note(26,32,[0,1],'NOTICE','Council meets Mondays');note(27,37,[0,-1],'LOST AND FOUND','Ask for Clerk Fiddlesticks');note(29,35,[-1,0],'BY ORDER OF THE MAYOR','Mind the ducks');
  note(64,16,[0,1],'FOR SALE','One barn, some owl');note(64,21,[0,-1],'HAY','Please do not smoke');note(55,36,[0,1],'DOVECOTE','Do not disturb the doves');
  note(77,86,[0,1],'WENLOCK MILL','Flour sold by the sack');note(86,87,[0,1],'THE WINDMILL','Mind the sails');
}
