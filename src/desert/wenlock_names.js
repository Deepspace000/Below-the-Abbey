/* ==========================================================================
   WENLOCK: NUMBERS, NAMES AND STREET SIGNS (prefix wln). Every door of the town was the same door. Now:
   - each house has its number on a brass-and-enamel plate set in its door tile (odd numbers on the west or north side of a street, even on the east or south side, counted from
     the west or the north), a door painted one of ten colours, and a knocker; some doors have a coloured fan-light;
   - about forty cottages have a name, on a hanging board beside the door ("Pear Tree Cottage, 11 High Street");
   - the corners of the streets have a signpost with white enamel street plates, readable from both ways; the bridge has plates on its parapet;
   - the west gate is a proper gate: wooden leaves bound in iron, a lamp each side, and a board over it.
   The plates are the same kind of thing as the shop signs: decor with wd and txt, drawn by shopSign() (wrapped below for the white street plates).
   ========================================================================== */
const WLN_STREET={N:'High Street',S:'High Street',MW:'Mill Lane',ME:'Mill Lane',CW:'Church Lane',CE:'Church Lane',GW:'Green Lane',GE:'Green Lane',TN:'Back Track',TS:'Back Track'};
const WLN_HINT={N:'high',S:'high',MW:'mill',ME:'mill',CW:'church',CE:'church',GW:'green',GE:'green',TN:'track',TS:'track'};
const WLN_ODD={N:1,MW:1,CW:1,GW:1,TN:1};   // the sides that carry the odd numbers
/* eight muted door colours: [name, r, g, b] */
const WLN_DOORS=[['racing green',44,96,66],['navy blue',44,66,128],['oxblood',128,42,44],['charcoal',54,54,60],['plum',100,56,108],['teal',40,118,122],['slate grey',104,112,122],['terracotta',190,100,56]];
/* the house names: [name, where it likes to stand] */
const WLN_NAMES=[['Pear Tree Cottage','any'],['Wren\'s Rest','any'],['Honeysuckle Cottage','any'],['Mill View','mill'],['The Nook','any'],['Rose Cottage','any'],['Bramble Cottage','any'],['Hollyhock House','any'],
  ['Church View','church'],['Tansy Cottage','any'],['Dove Cottage','church'],['Fiddler\'s Rest','any'],['Lavender Cottage','any'],['The Old Dairy','track'],['Sparrow Hall','any'],['Elm Tree House','any'],['Primrose Cottage','any'],
  ['Brook Cottage','mill'],['Thimble Cottage','any'],['The Sheepfold','track'],['Foxglove Cottage','any'],['Marigold House','any'],['Ivy Cottage','any'],['The Hollies','any'],['Cobbler\'s Rest','high'],['The Willows','mill'],
  ['Jasmine Cottage','any'],['Damson Cottage','green'],['Quince House','any'],['Robin\'s Nest','any'],['Bluebell Cottage','green'],['Meadow View','track'],['Orchard End','green'],['Little Thatch','any'],['Brewer\'s Cottage','high'],
  ['Lamplighter\'s Cottage','high'],['Thrush Cottage','any'],['Hazel Cottage','any'],['Apple Loft','green'],['Barley Mow','track'],['Gable End','any'],['Green View','green'],['Weaver\'s Cottage','high'],['Swallow\'s Rest','any'],['Sexton\'s Cottage','church']];
/* ---- the colour of the door, a small brass numeral, a knocker and a letter slot, all measured from the door in the tile and painted into a copy of it ---- */
/* where is the door in this tile? scan the bottom rows for the edges of the opening (the wall changes at the jambs) and a column up the middle for the top of the arch */
function wlnDoorBox(x,w,hh){
  const d=x.getImageData(0,0,w,hh).data,L=(px,py)=>{const i=(py*w+px)*4;return .3*d[i]+.59*d[i+1]+.11*d[i+2]};
  const colM=(px,y0,y1)=>{let s=0,n=0;for(let y=y0;y<=y1;y++){s+=L(px,y);n++}return s/n};
  const row=px=>colM(px,hh-16,hh-6);
  let le=64-29,re=64+29;
  for(let px=64-16;px>16;px--){if(Math.abs((row(px-1)+row(px-2)+row(px-3))/3-(row(px+1)+row(px)+row(px+2))/3)>26){le=px;break}}
  for(let px=64+16;px<112;px++){if(Math.abs((row(px+1)+row(px+2)+row(px+3))/3-(row(px-1)+row(px)+row(px-2))/3)>26){re=px;break}}
  let cx=(le+re)/2,hw=(re-le)/2;if(hw<20||hw>38||Math.abs(cx-64)>12){cx=64;hw=29}
  let top=hh-100;const rowM=py=>{let s=0;for(let px=(cx-6)|0;px<=cx+6;px++)s+=L(px,py);return s/13};
  for(let py=hh-72;py>hh-132;py--){if(Math.abs((rowM(py-1)+rowM(py-2)+rowM(py-3))/3-(rowM(py+1)+rowM(py+2)+rowM(py+3))/3)>30){top=py;break}}
  top=Math.max(hh-118,Math.min(hh-78,top));
  return {cx,hw,top,bot:hh-3};
}
function wlnDoorTile(gid,h,pal,num,fan){
  return wlgTile(gid,'door2|'+pal+'|'+num+'|'+(fan===undefined?'-':fan),(x,w,hh)=>{
    const B=wlnDoorBox(x,w,hh),c=WLN_DOORS[pal],cx=B.cx,hw=B.hw-2,top=B.top,bot=B.bot,dh=bot-top;
    // the door itself: every pixel inside the opening (a rectangle with a round top) is dyed, keeping its light and shade, so pale doors get a colour too
    if(c){const X0=Math.max(0,Math.floor(cx-hw)),X1=Math.min(w,Math.ceil(cx+hw)),Y0=top,Y1=bot,id=x.getImageData(X0,Y0,X1-X0,Y1-Y0),d=id.data,iw=X1-X0;
      for(let yy=0;yy<Y1-Y0;yy++)for(let xx=0;xx<iw;xx++){const wx=X0+xx+.5,wy=Y0+yy,ay=wy-(top+hw);
        if(ay<0){const dx=wx-cx;if(dx*dx+ay*ay>hw*hw)continue}
        const i=(yy*iw+xx)*4,l=(.3*d[i]+.59*d[i+1]+.11*d[i+2])/255,k=.55+.9*l;
        d[i]=d[i]*.12+Math.min(255,c[1]*k)*.88;d[i+1]=d[i+1]*.12+Math.min(255,c[2]*k)*.88;d[i+2]=d[i+2]*.12+Math.min(255,c[3]*k)*.88}
      x.putImageData(id,X0,Y0)}
    // the engine shows a wall tile mirrored left to right, so the things painted on it are painted in a mirror (and read the right way round in the game); M turns a tile x into a painting x
    x.save();x.translate(w,0);x.scale(-1,1);const M=t=>w-t;
    if(fan!==undefined&&fan!==null){const fx=M(cx),fy=top+hw,r=Math.min(21,hw-3);x.save();x.beginPath();x.arc(fx,fy,r,Math.PI,0);x.lineTo(fx+r,fy+3);x.lineTo(fx-r,fy+3);x.closePath();x.clip();
      const pal2=WLGS_SETS[fan%WLGS_SETS.length];for(let i=0;i<7;i++){const a0=Math.PI+i*Math.PI/7,a1=Math.PI+(i+1)*Math.PI/7,cc=WLGS_COL[pal2[i%pal2.length]];x.beginPath();x.moveTo(fx,fy+3);x.arc(fx,fy+3,r+4,a0,a1);x.closePath();
        const g=x.createRadialGradient(fx,fy,2,fx,fy,r);g.addColorStop(0,cc[1]);g.addColorStop(1,cc[0]);x.fillStyle=g;x.fill();x.strokeStyle='#17140f';x.lineWidth=1.8;x.stroke()}
      x.restore();x.strokeStyle='#17140f';x.lineWidth=2.4;x.beginPath();x.arc(fx,fy,r+1,Math.PI,0);x.lineTo(fx+r+1,fy+4);x.lineTo(fx-r-1,fy+4);x.stroke()}
    // the knocker: a small brass ring hung on the middle of the door, and a letter slot below it, both measured from the door
    {const kx=M(cx),ky=top+dh*.46,sy=top+dh*.64,sw=Math.min(20,hw*.7);
      x.fillStyle='#8a6420';x.beginPath();x.arc(kx,ky,2.6,0,6.3);x.fill();x.strokeStyle='#d8a838';x.lineWidth=1.7;x.beginPath();x.arc(kx,ky+4.2,3.6,0,6.3);x.stroke();
      x.fillStyle='#6a4a14';x.fillRect(kx-sw/2,sy,sw,3.4);x.fillStyle='#e0b850';x.fillRect(kx-sw/2+.8,sy,sw-1.6,1.2)}
    // the number: a small brass-rimmed oval on the wall beside the door, kept inside the tile and clear of the frame
    if(num){const s=String(num),fs=s.length>2?9:s.length>1?11:12,rx=s.length>2?10.5:9,ry=7.4;
      let pxT=cx+hw+rx+9;if(pxT+rx>w-6)pxT=cx-hw-rx-9;if(pxT-rx<6)pxT=w-rx-6;
      const px=M(pxT),py=top+dh*.5;
      x.save();x.fillStyle='#6a4a14';x.beginPath();x.ellipse(px,py,rx+1.2,ry+1.2,0,0,6.3);x.fill();x.fillStyle='#d8a838';x.beginPath();x.ellipse(px,py,rx,ry,0,0,6.3);x.fill();x.fillStyle='#f6eed4';x.beginPath();x.ellipse(px,py,rx-1.8,ry-1.8,0,0,6.3);x.fill();
      x.font='bold '+fs+'px Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#1c1208';x.fillText(s,px,py+.6);x.restore()}
    x.restore();
  });
}
/* ---- white enamel street plates, in the way of the shop signs: decor with wd, txt and plate:'street'. One line only, large, shrunk to fit with a margin ---- */
const WLN_PLATES={};
function wlnStreetPlate(d){
  const id=d.txt[0];if(WLN_PLATES[id])return WLN_PLATES[id];
  return WLN_PLATES[id]=mkCanvas(480,190,(x,w,h)=>{
    x.fillStyle='rgba(0,0,0,.35)';x.fillRect(8,10,w-10,h-10);
    x.fillStyle='#161a28';x.fillRect(0,0,w-8,h-10);x.fillStyle='#f4f0e2';x.fillRect(8,8,w-24,h-26);
    x.strokeStyle='#161a28';x.lineWidth=4;x.strokeRect(20,20,w-48,h-50);
    x.fillStyle='#8a8678';for(const [px,py] of [[13,13],[w-21,13],[13,h-23],[w-21,h-23]]){x.beginPath();x.arc(px,py,3,0,6.3);x.fill()}
    x.textAlign='center';x.textBaseline='middle';
    const t=d.txt[0],mw=w-96;let fs=84,sx=1;x.font='bold '+fs+'px Georgia,serif';
    let tw=x.measureText(t).width;if(tw>mw){sx=Math.max(.78,mw/tw);tw*=sx}
    while(tw>mw&&fs>16){fs-=2;x.font='bold '+fs+'px Georgia,serif';tw=x.measureText(t).width*sx}
    x.save();x.translate((w-8)/2,(h-10)/2+3);x.scale(sx,1);x.fillStyle='#161a28';x.fillText(t,0,0);x.restore();
  });
}
{const _s=shopSign;shopSign=function(d){if(d&&d.k==='sign_wlst'&&d.txt)return wlnStreetPlate(d);return _s.apply(this,arguments)}}
/* a freestanding street sign: a signpost whose two boards are painted at three times the size, one board to a street, each post with its own shapes and colours; the boards are in the picture of the post itself, so the letters read from every side (never mirrored) */
let WLN_POSTS=0;
const WLN_BOARD=[[[104,70,44],[236,222,184]],[[60,96,70],[240,232,196]],[[110,50,46],[240,226,190]],[[44,70,108],[238,232,206]],[[84,64,104],[236,226,196]],[[52,92,98],[240,232,200]]];
/* names: a string per board (the Wenlock street signs: the shape follows the post), or {n:name,d:way} (the signposts to towns and places, see signposts_towns.js): d -1 or 1 is an arrow with its point to the left
   or the right of whoever looks at it, d 0 a board for a place straight ahead and d 2 one for a place behind, both with a small triangle in front of the name */
function wlnPostPic(i,names){
  const S=3,W=825,H=849,src=IMG.greensign,c=document.createElement('canvas');c.width=550;c.height=566;const x=c.getContext('2d');x.scale(2/3,2/3);
  x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
  if(src)x.drawImage(src,70,0,135,283,414-68*S,0,135*S,H);
  const board=(bx,by,bw,bh,dir,shape,name,pal,nobj)=>{
    const mk=nobj&&(dir===0||dir===2)?dir||1:0;   // 1 = ahead (triangle up), 2 = behind (triangle down)
    if(nobj){if(mk){shape=2;dir=1}else shape=0}
    x.save();x.shadowColor='rgba(0,0,0,.45)';x.shadowBlur=10;x.shadowOffsetY=6;
    x.beginPath();const t=shape===0?bh*(nobj?.34+.07*((i+bx)%3):.42):0,L=bx,R=bx+bw,T=by,B=by+bh;
    if(shape===2){const r=bh*.3;x.moveTo(L+r,T);x.lineTo(R-r,T);x.quadraticCurveTo(R,T,R,T+r);x.lineTo(R,B-r);x.quadraticCurveTo(R,B,R-r,B);x.lineTo(L+r,B);x.quadraticCurveTo(L,B,L,B-r);x.lineTo(L,T+r);x.quadraticCurveTo(L,T,L+r,T)}
    else if(dir<0){x.moveTo(L+t,T);x.lineTo(R,T);x.lineTo(R,B);x.lineTo(L+t,B);if(t){x.lineTo(L,(T+B)/2)}else{x.lineTo(L,B);x.lineTo(L,T)}}
    else{x.moveTo(L,T);x.lineTo(R-t,T);if(t){x.lineTo(R,(T+B)/2)}else{x.lineTo(R,T);x.lineTo(R,B)}x.lineTo(R-t,B);x.lineTo(L,B)}
    x.closePath();x.fillStyle='rgb('+pal[0][0]+','+pal[0][1]+','+pal[0][2]+')';x.fill();x.restore();
    x.save();x.clip();for(let g=0;g<14;g++){x.fillStyle='rgba(255,240,210,'+(.05+.04*((g*7+i)%3))+')';x.fillRect(L,T+g*bh/14+2,bw,2.2)}x.restore();
    x.strokeStyle='rgb('+pal[1][0]+','+pal[1][1]+','+pal[1][2]+')';x.lineWidth=6;x.stroke();
    // the name: one line, shrunk (and a little narrowed) to fit with a margin
    const ix=L+(dir<0?t:0)+22+(mk?64:0),iw=bw-t-44-(mk?64:0),fonts=['Georgia','"Palatino Linotype",Palatino,"Book Antiqua",Georgia','"Times New Roman",Times,Georgia'];
    let fs=Math.round(bh*.5),sx=1;const fam=fonts[(i+name.length)%3];x.font='bold '+fs+'px '+fam;let tw=x.measureText(name).width;
    if(tw>iw){sx=Math.max(.76,iw/tw);tw*=sx}while(tw>iw&&fs>16){fs-=2;x.font='bold '+fs+'px '+fam;tw=x.measureText(name).width*sx}
    x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.save();x.translate(ix+iw/2,(T+B)/2+3);x.scale(sx,1);
    x.lineWidth=Math.max(5,fs*.16);x.strokeStyle='rgba(20,14,8,.85)';x.strokeText(name,0,0);x.fillStyle='rgb('+pal[1][0]+','+pal[1][1]+','+pal[1][2]+')';x.fillText(name,0,0);x.restore();
    if(mk){const mx=L+22+30,my=(T+B)/2+2,u=24;x.beginPath();if(mk===1){x.moveTo(mx,my-u);x.lineTo(mx+u,my+u*.8);x.lineTo(mx-u,my+u*.8)}else{x.moveTo(mx,my+u);x.lineTo(mx+u,my-u*.8);x.lineTo(mx-u,my-u*.8)}x.closePath();
      x.fillStyle='rgb('+pal[1][0]+','+pal[1][1]+','+pal[1][2]+')';x.strokeStyle='rgba(20,14,8,.85)';x.lineWidth=7;x.lineJoin='round';x.stroke();x.fill()}
  };
  const pal=WLN_BOARD[i%WLN_BOARD.length],pal2=WLN_BOARD[(i+2)%WLN_BOARD.length],sh=i%3;
  const nm=n=>typeof n==='string'?n:n.n,dw=(n,def)=>typeof n==='string'||n.d===undefined?def:n.d,ob=n=>typeof n!=='string';
  board(40,104,640,198,dw(names[0],-1),sh,nm(names[0]),pal,ob(names[0]));
  if(names[1])board(150,330,640,198,dw(names[1],1),(sh+1)%3,nm(names[1]),pal2,ob(names[1]));
  return c;
}
function wlnPost(C,x,y,plates,talk,rad){
  const q=C.free(x,y)?[x,y]:C.near(x,y,rad||2);if(!q)return null;
  const n=WLN_POSTS++,id='wlo_post'+n,key='wlpost'+n;khNpc(id,'A signpost',key,()=>say(talk,[BYE]));
  IMG[key]=wlnPostPic(n,plates.map(p=>p[1]));NPC_H[key]=1.35;
  C.dc(key,q[0],q[1],{npc:id,deco:false});
  return q;
}
/* ---- the pass ---- */
function wlnPass(C){
  const {houses,rows,chars,ch,hs}=C;
  // 1. numbers: counted from the west (or the north) along each side of each street
  const sideOf=h=>{const lot=WL_LOTS[h.k];return lot?lot[0]:null};
  const seq={};
  houses.forEach(h=>{const s=sideOf(h);if(!s)return;(seq[s]=seq[s]||[]).push(h)});
  for(const s in seq){const odd=WLN_ODD[s]?1:0;seq[s].sort((a,b)=>(a.x0-b.x0)||(a.y0-b.y0));seq[s].forEach((h,i)=>{h.num=2*i+(odd?1:2);h.street=WLN_STREET[s];h.sideKey=s})}
  // 2. names: the preferred ones where they fit, about forty of the cottages
  const homes=houses.filter(h=>h.num&&!h.sp);
  const pool=WLN_NAMES.slice(),take=hint=>{let i=pool.findIndex(n=>n[1]===hint);if(i<0)i=pool.findIndex(n=>n[1]==='any');if(i<0)i=0;return pool.splice(i,1)[0][0]};
  const forge=homes.find(h=>h.sideKey==='N'&&h.x0===14);if(forge)forge.hname='The Old Forge House';
  homes.forEach((h,i)=>{if(h.hname)return;if(hs(h.x0,h.y0,44)<.1)return;h.hname=take(WLN_HINT[h.sideKey]);});
  // 3. doors: colour, knocker, number, fan-light; and the name board beside the door
  const FAN={chandler:3,school:1,almshouse:4},cand=[];
  houses.forEach((h,k)=>{
    if(!h.num)return;
    const dc=rows[h.door[1]][h.door[0]],gid=chars[dc];if(!gid)return;
    const pal=h.sp?-1:((hs(h.x0,h.y0,51)*WLN_DOORS.length)|0),fan=h.sp&&FAN[h.sp.kind]!==undefined?FAN[h.sp.kind]:(!h.sp&&hs(h.x0,h.y0,52)<.12?((hs(h.x0,h.y0,53)*6)|0):undefined);
    const g2=wlnDoorTile(gid,h,pal,h.num,fan);if(g2!==gid&&KH_DOOR[gid])KH_DOOR[g2]=KH_DOOR[gid];   // the new tile opens the same door
    rows[h.door[1]][h.door[0]]=ch(g2);
    h.doorCol=pal>=0?WLN_DOORS[pal][0]:null;
    if(h.hname){
      const horizontal=h.face==='N'||h.face==='S';
      for(const sgn of [1,-1]){
        const sx=horizontal?h.front[0]+sgn:h.front[0],sy=horizontal?h.front[1]:h.front[1]+sgn;
        const wallCell=horizontal?[sx,h.face==='S'?h.y1:h.y0]:[h.face==='E'?h.x1:h.x0,sy];
        if(!rows[wallCell[1]]||rows[wallCell[1]][wallCell[0]]==='.')continue;
        cand.push({k:'sign_wlh'+h.id,x:sx,y:sy,block:false,wd:h.wall,txt:[h.hname],sc:.56,bob:(k%2)?.4:.22});break}
    }
  });
  // a hanging board hides the ones behind it when you look along a street, so two boards never share a stretch of street: a house name is left off when another board (a shop, a notice, a name already kept)
  // hangs on the same street within five squares, on either wall
  {const kept=C.decor.filter(d=>d.wd&&d.txt&&/^sign_wl/.test(d.k)&&d.k!=='sign_wlst');
    for(const c of cand){const ax=c.wd[0]?0:1;
      const clash=kept.some(s=>{if((s.wd[0]?0:1)!==ax)return false;const across=ax===0?Math.abs(s.x-c.x):Math.abs(s.y-c.y),along=ax===0?Math.abs(s.y-c.y):Math.abs(s.x-c.x);return across<=1&&along<5});
      if(!clash){kept.push(c);C.decor.push(c)}}}
  // 4. the street signs at the corners
  wlnPost(C,23,49,[[[1,0],'CHURCH LANE','North to the church'],[[0,1],'HIGH STREET','Nos 1 to 35']],'A signpost at the corner. One board reads CHURCH LANE, north to the church. The other reads HIGH STREET.');
  wlnPost(C,71,51,[[[1,0],'MILL LANE','South to the mill'],[[0,-1],'HIGH STREET','Nos 2 to 24']],'A signpost at the corner. One board reads MILL LANE, south to the brook and the mill. The other reads HIGH STREET.');
  wlnPost(C,83,49,[[[1,0],'GREEN LANE','North to the back track'],[[0,1],'HIGH STREET','The east end']],'A signpost at the corner. One board reads GREEN LANE, north to the back track. The other reads HIGH STREET.');
  wlnPost(C,25,31,[[[-1,0],'CHURCHYARD LANE','To the old graveyard'],[[0,1],'CHURCH LANE','South to High Street']],'A signpost. CHURCHYARD LANE goes west to the old graveyard. CHURCH LANE goes south to High Street.');
  wlnPost(C,39,13,[[[-1,0],'BLACKBRIAR LANE','To the witch\'s wood'],[[0,1],'BACK TRACK','East to the farms']],'A signpost. BLACKBRIAR LANE goes north to the witch\'s wood, and the board says to think twice. BACK TRACK goes east to the farms.');
  wlnPost(C,85,15,[[[-1,0],'GREEN LANE','South to High Street'],[[0,-1],'BACK TRACK','West to Blackbriar Lane']],'A signpost at the end of the back track. GREEN LANE goes south to High Street.');
  wlnPost(C,40,49,[[[1,0],'MARKET SQUARE','Market day on Saturday'],[[0,1],'HIGH STREET','Nos 1 to 35']],'A signpost at the edge of the market square. MARKET SQUARE, market day on Saturday, and HIGH STREET.');
  wlnPost(C,29,52,[[[1,0],'THE VILLAGE GREEN','Duck pond. Please do not feed the ducks.'],[[0,-1],'HIGH STREET','Back to the square']],'A signpost at the head of the path. THE VILLAGE GREEN, with a duck pond. Underneath: please do not feed the ducks. Somebody has added: they feed themselves.');
  wlnPost(C,73,83,[[[-1,0],'MILL LANE','The brook and the mill'],[[0,-1],'HIGH STREET','Back up the lane']],'A signpost by the bridge. MILL LANE, over the old bridge to the mill. HIGH STREET is back up the lane.');
  // the bridge: plates on the low parapets
  C.decor.push({k:'sign_wlst',x:71,y:83,block:false,wd:[0,1],txt:['THE OLD BRIDGE'],plate:'street',sc:1.1});
  wlnGate(C);
}
/* the west gate, a proper one: oak leaves bound in iron under the arch, a lamp each side, a board overhead */
function wlnGate(C){
  const tex=T_DOORS.wlgate2;if(tex===undefined||!TEX[tex]||!TEX[tex].d)return;
  const T=TEX[tex],w=128,h=(T.d.length/512)|0,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.putImageData(new ImageData(new Uint8ClampedArray(T.d),w,h),0,0);
  const top=h-128*2.05,bot=h-4;
  // the arch of the opening and two oak leaves
  x.save();x.beginPath();x.moveTo(10,bot);x.lineTo(10,top+60);x.arc(64,top+60,54,Math.PI,0);x.lineTo(118,bot);x.closePath();x.clip();
  for(let i=0;i<2;i++){const lx=10+i*54,g=x.createLinearGradient(lx,0,lx+54,0);g.addColorStop(0,'#4a3018');g.addColorStop(.5,'#6a4824');g.addColorStop(1,'#42281a');x.fillStyle=g;x.fillRect(lx,top,54,bot-top);
    for(let p=0;p<4;p++){x.fillStyle='rgba(20,10,4,.55)';x.fillRect(lx+p*13.5,top,1.6,bot-top);x.fillStyle='rgba(255,220,160,.12)';x.fillRect(lx+p*13.5+2,top,1.2,bot-top)}
    x.fillStyle='#1c1c22';for(const fy of [top+70,top+(bot-top)*.5+20,bot-34]){x.fillRect(lx,fy,54,7);x.fillStyle='#3a3a44';x.fillRect(lx,fy,54,1.8);x.fillStyle='#1c1c22';for(let r=0;r<4;r++){x.beginPath();x.arc(lx+6+r*14,fy+3.5,1.9,0,6.3);x.fill()}}}
  x.fillStyle='#0c0a08';x.fillRect(63,top,2,bot-top);
  x.strokeStyle='#d0a840';x.lineWidth=3;for(const rx of [56,72]){x.beginPath();x.arc(rx,bot-(bot-top)*.38,5,0,6.3);x.stroke()}
  x.restore();
  x.strokeStyle='#14110e';x.lineWidth=5;x.beginPath();x.moveTo(10,bot);x.lineTo(10,top+60);x.arc(64,top+60,54,Math.PI,0);x.lineTo(118,bot);x.stroke();
  const id=addTex(x.getImageData(0,0,w,h).data,null);TEX[id].h=h;TEX[id].wh=T.wh;T_DOORS.wlgate2=id;
  // a lamp each side of the gate and a board over it
  for(const [lx,ly] of [[3,49],[3,51]])C.lamp(lx,ly);
  C.decor.push({k:'sign_wlst',x:3,y:50,block:false,wd:[-1,0],txt:['WEST GATE'],plate:'street',sc:.9});
}
