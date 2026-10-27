/* ==========================================================================
   THE WELL MAZE: building a level (prefix wm / WM). WM.build(k) makes LEVELS[id] the first time the level is entered (KH_LAZY): walls of painted purple brick (crystal and violet stone
   for the grottos and the Deep), floors, lights, creatures, finds, and calls WM.furnish[kind] (wellmaze_rooms.js) for every room and WM.mech (wellmaze_mech.js) for the doors,
   keys, switches and puzzles. Decor fields the game does not copy (it keeps only a short list) are looked up by square in L._wm instead.
   ========================================================================== */
const WM_STY={bo:'brick_old',bm:'brick_moss',bc:'brick_crack',bw:'brick_wet',bb:'brick_big',bv:'brick_vein',cr:'crystal',vi:'violet',li:'lilac',ve:'vein',ge:'vein',de:'violet'};
const WM_RING={grotto:['cr','ge','cr','vi'],mine:['vi','de','vi','bc'],cistern:['bw','bw','bm'],cellar:['bb','bo'],library:['bo','bo','bv'],fungus:['li','bm','li'],shrine:['bv','bo'],mirror:['bb','bv'],
  spiders:['bm','de'],lanterns:['bb','bv'],boss:['cr','ve','ge','de'],lake:['de','ve','bw'],camp:['bo','bm'],start:['bw','bo','bm'],bells:['bb','bo'],vault:['bb','bv'],stairOut:['bo'],island:['bw'],riddle:['bb']};
const WM_BAND=[ // [limit, style] by noise value, per level
  [[.22,'bm'],[.36,'bw'],[.5,'bc'],[.82,'bo'],[.94,'bb'],[1,'bv']],
  [[.15,'bm'],[.3,'bw'],[.45,'bc'],[.7,'bo'],[.85,'bb'],[1,'bv']],
  [[.12,'bm'],[.25,'bw'],[.4,'bo'],[.55,'vi'],[.7,'bc'],[.82,'bb'],[.9,'li'],[1,'bv']],
  [[.2,'cr'],[.35,'vi'],[.5,'ve'],[.6,'ge'],[.75,'de'],[.82,'bb'],[.9,'bv'],[1,'cr']]];
function wmNoise(x,y,sd){const f=.2,gx=x*f,gy=y*f,x0=Math.floor(gx),y0=Math.floor(gy),fx=gx-x0,fy=gy-y0,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),h=(i,j)=>hash2(i,j,sd);
  return (h(x0,y0)*(1-sx)+h(x0+1,y0)*sx)*(1-sy)+(h(x0,y0+1)*(1-sx)+h(x0+1,y0+1)*sx)*sy}
function wmPicTex(key){return 'art_tex_wm_'+WM_STY[key]}
function wmSecretTex(){const key='wm_secret';if(IMG[key])return key;const b=IMG.art_tex_wm_brick_old,P=IMG.art_tex_hgdp_secret;
  IMG[key]=mkCanvas(128,128,(x,w,h)=>{if(b)x.drawImage(b,0,0,w,h);else{x.fillStyle='#4a3860';x.fillRect(0,0,w,h)}if(P){x.globalCompositeOperation='multiply';x.globalAlpha=.8;x.drawImage(P,0,0,w,h)}});return key}
/* a style for ohTiles: plain wall, door picture, window picture */
function wmSty(name,plain,door,win){OH_STY[name]=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain,door:door||plain,win:win||plain,alt:plain,zoom:1,contrast:1.0,tint:[255,255,255,0]});return name}
/* ---------- the doors, painted over the arch picture: steps and a lock plate down, a bricked arch for a sealed vault, a plaque on the riddle door ---------- */
function wmDoorArt(kind,col){
  const key='wm_dr_'+kind+(col||'');if(IMG[key])return key;
  const src=IMG[kind==='riddle'?'art_tex_wm_door':'art_tex_wm_arch'];if(!src||!src.width)return kind==='riddle'?'art_tex_wm_door':'art_tex_wm_arch';
  const brick=IMG.art_tex_wm_brick_old;
  IMG[key]=mkCanvas(128,128,(x,w,h)=>{
    x.drawImage(src,0,0,w,h);if(kind==='riddle'){wmPlate(x,64,70,30,22,'#b89a58',col||'#ffe9a0',true);return}
    const im=x.getImageData(0,0,w,h),d=im.data,m=new Uint8Array(w*h);
    for(let i=0;i<w*h;i++)if(d[i*4]+d[i*4+1]+d[i*4+2]<95)m[i]=1;   // the black of the arch
    const [c,y]=tcv();y.canvas.width=w;y.canvas.height=h;
    if(kind==='sealed'){y.fillStyle='#2a2036';y.fillRect(0,0,w,h);if(brick){y.globalAlpha=.9;y.drawImage(brick,0,0,w,h);y.globalAlpha=1}y.fillStyle='rgba(10,6,20,.38)';y.fillRect(0,0,w,h)}
    else{for(let yy=0;yy<h;yy+=1){const t=yy/h,band=((yy-36)/10)|0,edge=((yy-36)%10)<2;const v=edge?150:Math.max(40,70+t*85-(band%2)*14);y.fillStyle='rgb('+(v*.78|0)+','+(v*.62|0)+','+(v*1.0|0)+')';y.fillRect(0,yy,w,1)}
      const g=y.createLinearGradient(0,30,0,h);g.addColorStop(0,'rgba(0,0,0,.7)');g.addColorStop(.6,'rgba(0,0,0,0)');y.fillStyle=g;y.fillRect(0,30,w,h-30)}   // steps going down into the dark
    const fill=y.getImageData(0,0,w,h).data;
    for(let i=0;i<w*h;i++)if(m[i]){d[i*4]=fill[i*4];d[i*4+1]=fill[i*4+1];d[i*4+2]=fill[i*4+2]}
    x.putImageData(im,0,0);
    if(kind==='down')wmPlate(x,64,92,20,26,'#b89a58',col||'#a064e8',false);
    else wmPlate(x,64,86,22,22,'#5a5a66','#8a8aa0',false,true)});
  return key}
function wmPlate(x,cx,cy,w,h,metal,gem,words,iron){
  x.save();x.fillStyle='rgba(0,0,0,.55)';x.fillRect(cx-w/2+2,cy-h/2+2,w,h);x.fillStyle=metal;x.fillRect(cx-w/2,cy-h/2,w,h);x.strokeStyle='rgba(255,240,200,.6)';x.lineWidth=1;x.strokeRect(cx-w/2+.5,cy-h/2+.5,w-1,h-1);
  if(words){x.fillStyle='rgba(40,28,10,.85)';for(let i=0;i<4;i++)x.fillRect(cx-w/2+4,cy-h/2+4+i*4.5,w-8-(i===3?10:0),1.6)}
  else if(iron){x.fillStyle='#22202c';for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]]){x.beginPath();x.arc(cx+a*(w/2-3),cy+b*(h/2-3),1.5,0,6.3);x.fill()}x.fillRect(cx-1.5,cy-6,3,12);x.fillRect(cx-6,cy-1.5,12,3)}
  else{x.fillStyle=gem;x.beginPath();x.arc(cx,cy-h/2+6,4,0,6.3);x.fill();x.fillStyle='#120c04';x.beginPath();x.arc(cx,cy+1,3.2,0,6.3);x.fill();x.fillRect(cx-1.2,cy+1,2.4,7)}   // a gem for the key, and a keyhole
  x.restore()}
WM.WH=2.2;
/* the grid and the tiles of level k: returns {rows,chars,ring} */
function wmWalls(k,M){
  const W=WMG.W,H=WMG.H,TM=ohTiles(),chars={},idx={},WH=WM.WH;let next=0x500;
  const ch=(key,mkfn)=>{if(idx[key])return idx[key];const c=String.fromCharCode(next++);idx[key]=c;chars[c]=mkfn();return c};
  const plain=key=>ch('p_'+key,()=>TM.make('plain',wmSty('wm_'+key,wmPicTex(key)),WH).gid);
  const special=(name,kind,p,d,w)=>ch(name,()=>TM.make(kind,wmSty(name,p,d,w),WH).gid);
  const niche=()=>special('niche','window',wmPicTex('bo'),wmPicTex('bo'),'art_tex_wm_niche');
  const grate=()=>special('grate','door',wmPicTex('bo'),'art_tex_wm_grate',wmPicTex('bo'));
  const secret=()=>ch('secret',()=>TM.make('plain',wmSty('wm_secret',wmSecretTex()),WH).gid);
  const doorDown=(k2)=>special('down'+(k2||0),'door',wmPicTex('bo'),wmDoorArt('down',['#a064e8','#c488ff','#e0b84a'][k2||0]),'art_tex_wm_plaque');
  const sealed=()=>special('sealed','door',wmPicTex('bo'),wmDoorArt('sealed'),'art_tex_wm_plaque');
  const doorUp=()=>special('up','door',wmPicTex('bo'),'art_tex_wm_door','art_tex_wm_niche');
  const doorRiddle=()=>special('riddle','door',wmPicTex('bb'),wmDoorArt('riddle'),'art_tex_wm_plaque');
  const g=M.g,rows=[],ringOf=new Map();
  // the rim of every room (the wall cells touching it, corners too) takes the room's own walls
  for(const r of M.rooms){const set=WM_RING[r.kind];if(!set)continue;for(let y=r.y0-1;y<=r.y1+1;y++)for(let x=r.x0-1;x<=r.x1+1;x++)if(g[y]&&g[y][x]==='#'){const key=y*W+x;if(!ringOf.has(key))ringOf.set(key,set[(hash2(x,y,k*13+5)*set.length)|0])}}
  const band=WM_BAND[k],open=(x,y)=>g[y]&&g[y][x]==='.',sd=M.sdoors;
  const near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const nOpen4=(x,y)=>[[0,1],[1,0],[0,-1],[-1,0]].filter(([a,b])=>open(x+a,y+b)).length;
  const stairAt=new Set();for(const s of [M.up,M.down])if(s)for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)stairAt.add((s.y+dy)*W+(s.x+dx));
  for(let y=0;y<H;y++){let row='';for(let x=0;x<W;x++){
    if(g[y][x]==='.'){row+='.';continue}
    if(!near(x,y)){row+=plain('bo');continue}
    let key=ringOf.get(y*W+x);
    if(!key){const n=wmNoise(x,y,771+k*31)+(hash2(x,y,k+3)-.5)*.16;key=(band.find(b=>n<b[0])||band[band.length-1])[1]}
    const h=hash2(x,y,k*7+1);
    if(!stairAt.has(y*W+x)&&nOpen4(x,y)===1&&!ringOf.has(y*W+x)){
      if(h<.03){row+=niche();continue}
      if(h>.985){row+=grate();continue}}
    row+=plain(key)}rows.push(row)}
  const put=(x,y,c)=>{rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
  const tiles={put,secret,sealed,doorDown,doorUp,doorRiddle,plain};
  return {rows,chars,tiles,idx}}
/* ---------- creatures: what lives where ---------- */
const WM_FOES=[ // by level: [type, weight]
  [['wmslime',5],['wmbat',4],['wmspider',2],['wmcrab',1],['wmcultist',1]],
  [['wmslime',3],['wmbat',3],['wmspider',4],['wmcultist',3],['wmcrab',2],['wmbeetle',2],['wmfungus',2],['wmwraith',1],['wmgolem',1]],
  [['wmbat',2],['wmspider',2],['wmcultist',3],['wmbeetle',3],['wmfungus',3],['wmwraith',4],['wmgolem',3],['wmslime',1]],
  [['wmgolem',4],['wmbeetle',4],['wmwraith',3],['wmcultist',3],['wmfungus',2],['wmcrab',2],['wmbat',2],['wmspider',1]]];
WM.COUNT=[30,38,36,32];
/* ---------- the context handed to every room's furnisher ---------- */
function wmContext(k,M){
  const W=WMG.W,H=WMG.H,g=M.g,rnd=wmgRng(M.seedUsed*3+k),occ=new Set(),dec=[],enemies=[],items=[],lights=[],meta={tier:{},loot:{},notes:{},npcs:{}};
  const c={k,M,g,W,H,rnd,dec,enemies,items,lights,meta,occ,fm:null};
  c.open=(x,y)=>g[y]&&g[y][x]==='.';
  c.free=(x,y)=>c.open(x,y)&&!occ.has(x+','+y);
  c.mark=(x,y)=>occ.add(x+','+y);
  c.isMouth=(x,y)=>{if(!c.mouthAll){c.mouthAll=new Set();for(const r of M.rooms)for(const m of c.mouths(r))c.mouthAll.add(m)}return c.mouthAll.has(x+','+y)};
  // a blocking piece never stands on a doorway of a room: it is moved to the nearest free square of the same room (or dropped when there is none)
  c.D=(k2,x,y,o)=>{o=o||{};
    if((o.block||o.npc)&&!o.force&&c.isMouth(x,y)){const r=M.rooms.find(q=>x>=q.x0&&x<=q.x1&&y>=q.y0&&y<=q.y1);
      const alt=r?c.rim(r).concat(c.inner(r)).sort((a,b)=>Math.hypot(a[0]-x,a[1]-y)-Math.hypot(b[0]-x,b[1]-y))[0]:null;if(!alt)return null;x=alt[0];y=alt[1]}
    const d=Object.assign({k:k2,x,y,block:false},o);dec.push(d);occ.add(x+','+y);return d};
  c.prop=(name,x,y,o)=>c.D('wm_'+name,x,y,Object.assign({block:true},o||{}));
  c.deco=(name,x,y,o)=>c.D('wm_'+name,x,y,Object.assign({block:false,walk:true,deco:true},o||{}));
  c.light=(x,y,col)=>{lights.push([x,y]);if(col)meta.lcol=(meta.lcol||{}),meta.lcol[x+','+y]=col};
  c.enemy=(t,x,y,o)=>{enemies.push(Object.assign({t,x,y},o||{}));occ.add(x+','+y)};
  c.chest=(name,x,y,tier,loot,o)=>{const d=c.D('wm_'+name,x,y,Object.assign({block:true},o||{}));if(!d)return null;meta.tier[d.x+','+d.y]=tier;if(loot)meta.loot[d.x+','+d.y]=loot;return d};
  c.note=(id,x,y,pic)=>{const d=c.D('wm_'+(pic||'signpost'),x,y,{block:true,npc:'wmnote_'+id});if(d)meta.notes[id]={x:d.x,y:d.y};return d};
  c.rect=r=>({x0:r.x0,x1:r.x1,y0:r.y0,y1:r.y1,cx:(r.x0+r.x1)>>1,cy:(r.y0+r.y1)>>1,w:r.x1-r.x0+1,h:r.y1-r.y0+1});
  // squares of a room: all, the rim (touching a wall), the inner ones; and the squares a door of the room opens onto (kept clear)
  c.cells=r=>{const o=[];for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)o.push([x,y]);return o};
  c.mouths=r=>{const o=new Set();for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<r.x0||nx>r.x1||ny<r.y0||ny>r.y1){if(g[ny]&&g[ny][nx]==='.')o.add(x+','+y)}}
    for(const q of M.sdoors)if(q.room===r.ri)o.add(q.inside.x+','+q.inside.y);
    for(const s of [M.up,M.down])if(s)o.add(s.ax+','+s.ay);
    // a doorway keeps its neighbours clear too, so a chest or a prop can never close the way into a room
    for(const m of Array.from(o)){const [mx,my]=m.split(',').map(Number);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=mx+dx,ny=my+dy;if(nx>=r.x0&&nx<=r.x1&&ny>=r.y0&&ny<=r.y1)o.add(nx+','+ny)}}
    return o};
  c.rim=r=>{const m=c.mouths(r),o=[];for(const [x,y] of c.cells(r)){if(x>r.x0&&x<r.x1&&y>r.y0&&y<r.y1)continue;if(!m.has(x+','+y)&&c.free(x,y))o.push([x,y])}return o};
  c.inner=r=>{const m=c.mouths(r),o=[];for(const [x,y] of c.cells(r)){if(x<=r.x0||x>=r.x1||y<=r.y0||y>=r.y1)continue;if(!m.has(x+','+y)&&c.free(x,y))o.push([x,y])}return o};
  c.pick=(list,n)=>{const a=list.slice(),o=[];while(a.length&&o.length<n)o.push(a.splice((rnd()*a.length)|0,1)[0]);return o};
  c.wallDir=(x,y)=>{for(const [a,b] of [[0,-1],[1,0],[0,1],[-1,0]])if(g[y+b]&&g[y+b][x+a]==='#')return [a,b];return null};
  return c}
