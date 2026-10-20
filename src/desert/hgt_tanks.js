/* ==========================================================================
   HOLLOW GRASSLANDS FISH TANKS (prefix hgtk / HGTK). Big glass tanks with fish swimming in them, for the terraced cities (480..489) and their interiors (4850..4999).

   WHAT IT IS
   A tank is a volume (a box or a cylinder) drawn on the screen by this file after the raycaster has run: the water, the back and side panels, the gravel floor,
   plants and rocks, the fish (real 3D positions, projected with the camera so near fish are bigger and brighter and far fish smaller and hazed by the water),
   bubbles, light shafts and caustic shimmer. Everything is clipped to the glass: per screen column the glass is the stretch between the top and the bottom of the
   tank at the front surface, and a column counts only where nothing nearer hides that surface (zbuf, and the step/ground cut YB), so walls and steps in front hide the
   tank and the party never sees a fish outside the glass. A tank stands in the sprite order (freestanding tanks by their centre depth, wall tanks first) so people
   and decor in front of it are drawn over it.

   HOW TO MAKE ONE (library stamp, call it from a city or room builder, B is an hgtlNew builder; x,y,w,h is the footprint in cells)
     hgtkTank(B,x,y,w,h,opts)  returns the tank record. opts:
        type   'wall' (default): a tank set into a wall. The footprint becomes wall cells (pillar at both ends of the glass run, glass cells between them, solid
                      casing behind). face 'N','E','S','W' = the side the party stands on (the glass faces that way). Window = footprint length along the face minus 2
                      (one pillar each end), depth = the other dimension. A 7 by 3 footprint facing 'S' is a 5 cell window, 2 deep.
               'box'  a freestanding rectangular tank filling the footprint (glass on all four sides, blocking cells, walk round it).
               'round' a cylinder tank in a square footprint (use 3 by 3 or 2 by 2). 'tower' = a tall round tank (z1 default 8.4) with brass bands.
        face   wall tanks only. wh  wall height of the wall tiles (default 3.5; use the room's ceiling height for interiors).
        h      foot height of the footprint cells (default: the height already in B.h at the face).
        z0, z1 bottom and top of the water above the foot. Wall defaults .3 and wh-.5. Freestanding defaults .35 (a pedestal) and 3.2.
        fish   number of solo fish (default depends on size), schools are automatic. big:false drops the occasional big gentle creature.
        theme  'reef' (teal, default) 'deep' (blue) 'lagoon' (green) 'violet'.  seed  integer for the fish and plants.  bands [z,..] brass rings (tower).
        bodyCh a wall char to use for the casing cells instead of the built-in casing.  light:false = no cold light on the street.
     The stamp writes wall cells, chars (private-use characters, bound to tile pictures automatically when the level is registered with hgtRegister), blocking
     decor (k 'hgtk_blk', invisible) for freestanding footprints, and ONE meta decor {k:'hgtk_tank',tk:{...}} per tank. The meta carries all data; the live tank
     (fish positions, phases, light) is created from it when the level is entered (hgtkSync, called from spriteList each frame; hgtkRegister(L) can force it). Nothing
     of a tank is saved: it is rebuilt from the level every time, so saves cannot break. Builders stay deterministic (seeded).
     Footprint cells of a freestanding tank must be open cells at one height (the foot). Do not put low walls right in front of a wall tank (the tank is hidden in
     any column where a nearer wall stands).

   PICTURES (all placeholders are plain fills created at load; the ART agent replaces them by name, no code change)
     IMG['hgt_fish_<id>']   side view, facing RIGHT, tail at the LEFT, magenta cut out, any size; ids in HGTK.species: neon silver angel puffer tang koi eel ray jelly giant
                            (jelly is drawn upright and never mirrored; giant is the big gentle creature that drifts past now and then).
     IMG['hgt_tank_plant0'..'hgt_tank_plant2'] upright plants, foot at the bottom edge.   IMG['hgt_tank_rock0'..'hgt_tank_rock1'] rocks.
     IMG['hgt_tank_back_<theme>']  a seamless wide picture of the far water (top = surface, bottom = gravel), wraps round the inside of the tank.
     Glass wall tiles are made by hgtkTile('glass'|'pillar'|'body',wh); replace the pixels by painted ones in HGTK.paintTile if wanted.
   KNOBS  HGTK.on=false switches all tanks off. HGTK.ms = milliseconds spent on tanks in the last frame. HGTK.list = the live tanks.
   TEST   ?town=hgttank&lvl=34  (level 487: wall tank run, round plaza tank, box tank, three-storey tank tower with a stair round it, door to the tank room 4851).
   ========================================================================== */
var HGTK=(typeof HGTK==='undefined')?{}:HGTK;
HGTK.on=true;HGTK.list=[];HGTK.ms=0;HGTK.chars={};HGTK.tiles={};HGTK._n=0;
HGTK.themes={
  reef:{id:'reef',water:[16,104,128],deep:[4,42,72],top:[120,214,222],sand:[206,188,146]},
  deep:{id:'deep',water:[22,56,134],deep:[6,16,64],top:[104,156,232],sand:[150,150,176]},
  lagoon:{id:'lagoon',water:[26,124,94],deep:[6,54,46],top:[140,226,172],sand:[196,190,140]},
  violet:{id:'violet',water:[92,52,142],deep:[28,14,68],top:[194,154,242],sand:[190,170,190]}
};
/* species: len = body length in cells (before the tank's scale), asp = height / length of the picture, school = swims in schools, c1 c2 c3 = placeholder colours */
HGTK.species=[
  {id:'neon',len:.24,asp:.42,school:1,c1:'#34d6ff',c2:'#ffffff',c3:'#ff3a5c',shape:'fish'},
  {id:'silver',len:.3,asp:.5,school:1,c1:'#c8d4de',c2:'#f2f6fa',c3:'#7a8a9a',shape:'fish'},
  {id:'angel',len:.36,asp:.95,c1:'#f2d24a',c2:'#fff1a8',c3:'#2a2a30',shape:'angel'},
  {id:'puffer',len:.4,asp:.8,c1:'#d8b060',c2:'#f6e6b4',c3:'#6a4a24',shape:'puffer'},
  {id:'tang',len:.5,asp:.55,c1:'#2a6cff',c2:'#ffd23a',c3:'#102060',shape:'fish'},
  {id:'koi',len:.62,asp:.38,c1:'#f2f0e6',c2:'#ff7a28',c3:'#c82818',shape:'fish'},
  {id:'eel',len:1.0,asp:.14,c1:'#5a7a3a',c2:'#b8c86a',c3:'#2a3a1a',shape:'eel'},
  {id:'ray',len:1.1,asp:.55,c1:'#7a8aa8',c2:'#d4dcea',c3:'#3a4668',shape:'ray'},
  {id:'jelly',len:.42,asp:1.1,c1:'#f08ae8',c2:'#ffd0f8',c3:'#a83ca0',shape:'jelly',noflip:1},
  {id:'giant',len:2.4,asp:.4,big:1,c1:'#5a6e92',c2:'#b4c2dc',c3:'#26324c',shape:'giant'}
];
HGTK.spById={};for(const s of HGTK.species)HGTK.spById[s.id]=s;

function hgtkRng(a){a=a|0;return function(){a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
/* ---------- tiles and chars ---------- */
function hgtkPaintTile(kind,wh){
  const Hp=Math.round(128*wh),c=document.createElement('canvas');c.width=128;c.height=Hp;const x=c.getContext('2d');
  const e=document.createElement('canvas');e.width=128;e.height=Hp;const xe=e.getContext('2d');
  const zY=z=>Hp-z*128;
  const bronze=(y0,y1)=>{const g=x.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'#8a7248');g.addColorStop(.5,'#5e4c30');g.addColorStop(1,'#3e3220');x.fillStyle=g;x.fillRect(0,y0,128,y1-y0)};
  if(kind==='body'){
    x.fillStyle='#46606a';x.fillRect(0,0,128,Hp);
    for(let u=0;u<wh;u++){const y=Hp-(u+1)*128;x.fillStyle=(u%2)?'#506c76':'#3e565f';x.fillRect(4,y+4,120,120);x.strokeStyle='#2a3c44';x.lineWidth=3;x.strokeRect(4,y+4,120,120)}
  }else if(kind==='pillar'){
    const g=x.createLinearGradient(0,0,128,0);g.addColorStop(0,'#3a2e1c');g.addColorStop(.3,'#8a7248');g.addColorStop(.5,'#a89060');g.addColorStop(.7,'#6a5636');g.addColorStop(1,'#32281a');x.fillStyle=g;x.fillRect(0,0,128,Hp);
    x.fillStyle='#2e2416';for(let z=0;z<=wh;z+=1){x.fillRect(0,zY(z)-3,128,6)}
    for(let z=.5;z<wh-.6;z+=1){x.fillStyle='#d8c490';for(const px of [14,114]){x.beginPath();x.arc(px,zY(z),4,0,TAU);x.fill()}}
    xe.fillStyle='rgba(255,226,160,1)';xe.beginPath();xe.arc(64,zY(wh-.3),18,0,TAU);xe.fill();x.fillStyle='#fff0c8';x.beginPath();x.arc(64,zY(wh-.3),18,0,TAU);x.fill();
  }else{ // glass: plinth, window of water, lintel with a lamp strip
    bronze(zY(.3),Hp);x.fillStyle='#1c160c';x.fillRect(0,zY(.3),128,4);x.fillStyle='#d8c490';for(const px of [12,64,116]){x.beginPath();x.arc(px,zY(.15),4,0,TAU);x.fill()}
    bronze(0,zY(wh-.5));
    const g=x.createLinearGradient(0,zY(wh-.5),0,zY(.3));g.addColorStop(0,'#58b8c4');g.addColorStop(.5,'#1c7088');g.addColorStop(1,'#0c3c58');x.fillStyle=g;x.fillRect(0,zY(wh-.5),128,zY(.3)-zY(wh-.5));
    x.strokeStyle='rgba(200,255,255,.18)';x.lineWidth=5;for(let i=0;i<4;i++){x.beginPath();x.moveTo(20+i*34,zY(wh-.5));x.lineTo(60+i*34,zY(.3));x.stroke()}
    x.fillStyle='#1c160c';x.fillRect(0,zY(wh-.5)-3,128,4);
    x.fillStyle='#fff0c8';x.fillRect(16,zY(wh-.38),96,22);xe.fillStyle='rgba(255,230,170,1)';xe.fillRect(16,zY(wh-.38),96,22);
  }
  return {d:x.getImageData(0,0,128,Hp).data,e:xe.getImageData(0,0,128,Hp).data,Hp};
}
/* the tile (char and gid) of a kind at a wall height; created on first use */
function hgtkTile(kind,wh){
  const key=kind+'|'+wh;let t=HGTK.tiles[key];if(t)return t;
  const p=HGTK.paintTile(kind,wh),id=addTex(p.d,p.e);TEX[id].h=p.Hp;TEX[id].wh=wh;
  const gid=KH_NEXT_GID++;T_TILE[gid]=id;const ch=String.fromCharCode(0x2460+HGTK._n++);
  t=HGTK.tiles[key]={ch,gid,kind,wh};HGTK.chars[ch]=gid;return t;
}
HGTK.paintTile=hgtkPaintTile;
/* gives a level object the chars of every tank tile (called for every hgtRegister level) */
function hgtkBind(L){if(!L)return L;L.chars=L.chars||{};for(const ch in HGTK.chars)if(L.chars[ch]===undefined)L.chars[ch]=HGTK.chars[ch];return L}
{const _r=hgtRegister;hgtRegister=function(id,build){return _r.call(this,id,function(){const L=build.apply(this,arguments);try{hgtkBind(L)}catch(e){console.error('hgtk bind',e)}return L})}}

/* ---------- the stamp ---------- */
const hgtkFace={N:0,E:1,S:2,W:3};
function hgtkTank(B,x,y,w,h,opts){
  opts=opts||{};const type=opts.type||'wall',DIRS=HGTL.DIRS;
  const tk={type,seed:opts.seed!==undefined?opts.seed|0:((x*7349+y*911+(B.seed|0)*13)|0),theme:opts.theme||'reef',fish:opts.fish,big:opts.big!==false,bands:opts.bands||null,light:opts.light!==false};
  const decor=[];
  if(type==='wall'){
    const f=typeof opts.face==='number'?opts.face&3:(hgtkFace[opts.face||'S']|0),wh=opts.wh||3.5,n=DIRS[f],r=[n[1],-n[0]];
    const tg=hgtkTile('glass',wh),tp=hgtkTile('pillar',wh),tb=opts.bodyCh?{ch:opts.bodyCh}:hgtkTile('body',wh);
    const Lc=(f&1)?h:w,depth=(f&1)?w:h;
    // the first cell of the face line from the viewer's left
    const c0=f===2?[x,y+h-1]:f===0?[x+w-1,y]:f===1?[x+w-1,y+h-1]:[x,y];
    const hFoot=opts.h!==undefined?opts.h:hgtlH(B,c0[0]+r[0]*(Lc>>1),c0[1]+r[1]*(Lc>>1));
    for(let j=0;j<h;j++)for(let i=0;i<w;i++)hgtlWall(B,x+i,y+j,tb.ch,hFoot);
    const pil=Lc>=3;
    for(let i=0;i<Lc;i++){const cx=c0[0]+r[0]*i,cy=c0[1]+r[1]*i;hgtlWall(B,cx,cy,(pil&&(i===0||i===Lc-1))?tp.ch:tg.ch,hFoot)}
    const i0=pil?1:0,su=Lc-(pil?2:0),cA=[c0[0]+r[0]*i0+.5,c0[1]+r[1]*i0+.5];
    const o=[cA[0]-r[0]*.5+n[0]*.5,cA[1]-r[1]*.5+n[1]*.5],mid=(i0+(su-1)/2);
    const fcx=Math.round(c0[0]+r[0]*mid+n[0]),fcy=Math.round(c0[1]+r[1]*mid+n[1]);
    Object.assign(tk,{wall:true,face:f,o,eu:r.slice(),ev:[-n[0],-n[1]],su,sv:Math.max(.8,depth-.14),z0:opts.z0!==undefined?opts.z0:.3,z1:opts.z1!==undefined?opts.z1:wh-.5,wh,
      fx:Math.round(c0[0]+r[0]*i0),fy:Math.round(c0[1]+r[1]*i0),lx:fcx,ly:fcy,x:fcx,y:fcy});
  }else{
    const round=type==='round'||type==='tower';
    for(let j=0;j<h;j++)for(let i=0;i<w;i++){hgtlOpen(B,x+i,y+j,opts.h!==undefined?opts.h:hgtlH(B,x+i,y+j),B.kind[(y+j)*B.W+x+i]);decor.push({k:'hgtk_blk',x:x+i,y:y+j,block:true})}
    const z0=opts.z0!==undefined?opts.z0:.35,z1=opts.z1!==undefined?opts.z1:(type==='tower'?8.4:3.2);
    Object.assign(tk,{wall:false,cyl:round,z0,z1,x,y,lx:x+(w>>1),ly:y+(h>>1)});
    if(round){const R=Math.min(w,h)/2-.06;Object.assign(tk,{cx:x+w/2,cy:y+h/2,R,fx:x,fy:y})}
    else Object.assign(tk,{bx0:x+.06,by0:y+.06,bx1:x+w-.06,by1:y+h-.06,fx:x,fy:y});
    if(type==='tower'&&!tk.bands){tk.bands=[];for(let z=2.8;z<z1;z+=2.8)tk.bands.push(+z.toFixed(2))}
  }
  const meta={k:'hgtk_tank',x:tk.x,y:tk.y,block:false,deco:true,tk};
  B.decor.push(meta);for(const d of decor)B.decor.push(d);
  (B.tanks=B.tanks||[]).push(tk);
  return tk;
}

/* ---------- placeholder pictures (plain fills, replaced by IMG names when present) ---------- */
HGTK.art=null;
function hgtkCanvas(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c}
function hgtkPaintFish(sp){
  const W=128,H=Math.max(20,Math.round(128*sp.asp));
  return hgtkCanvas(W,H,(x)=>{
    const poly=(pts,col)=>{x.fillStyle=col;x.beginPath();x.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)x.lineTo(pts[i],pts[i+1]);x.closePath();x.fill()};
    const ell=(cx,cy,rx,ry,col)=>{x.fillStyle=col;x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,TAU);x.fill()};
    const eye=(ex,ey,r)=>{ell(ex,ey,r,r,'#ffffff');ell(ex+r*.2,ey,r*.5,r*.5,'#101018')};
    switch(sp.shape){
      case 'eel':
        x.lineCap='round';x.strokeStyle=sp.c3;x.lineWidth=H*.62;x.beginPath();x.moveTo(8,H*.5);x.bezierCurveTo(30,H*.1,50,H*.9,70,H*.5);x.bezierCurveTo(88,H*.14,104,H*.7,118,H*.46);x.stroke();
        x.strokeStyle=sp.c1;x.lineWidth=H*.42;x.stroke();eye(116,H*.36,2.8);break;
      case 'ray':
        poly([124,H*.5,70,H*.04,40,H*.2,50,H*.5,40,H*.8,70,H*.96],sp.c1);poly([124,H*.5,70,H*.2,60,H*.5,70,H*.8],sp.c2);x.strokeStyle=sp.c3;x.lineWidth=3;x.beginPath();x.moveTo(50,H*.5);x.lineTo(2,H*.5);x.stroke();eye(108,H*.4,3.2);break;
      case 'jelly':
        x.fillStyle=sp.c1;x.beginPath();x.ellipse(W/2,H*.3,W*.42,H*.26,0,Math.PI,0);x.lineTo(W*.92,H*.32);x.lineTo(W*.08,H*.32);x.fill();
        x.strokeStyle=sp.c2;x.lineWidth=3;for(let i=0;i<6;i++){const tx=W*(.2+i*.12);x.beginPath();x.moveTo(tx,H*.32);x.bezierCurveTo(tx-8,H*.55,tx+8,H*.75,tx-2,H*.98);x.stroke()}
        ell(W*.5,H*.22,W*.12,H*.08,sp.c2);break;
      case 'giant':
        ell(W*.56,H*.5,W*.4,H*.3,sp.c1);ell(W*.6,H*.62,W*.34,H*.15,sp.c2);poly([W*.2,H*.5,4,H*.08,4,H*.42,16,H*.5,4,H*.58,4,H*.92],sp.c1);poly([W*.5,H*.7,W*.38,H*.98,W*.62,H*.74],sp.c3);eye(W*.86,H*.44,3.4);break;
      case 'angel':
        poly([W*.5,H*.04,W*.7,H*.4,W*.5,H*.96,W*.28,H*.55],sp.c1);poly([W*.28,H*.5,4,H*.3,4,H*.7],sp.c1);poly([W*.5,H*.04,W*.34,H*.0,W*.52,H*.3],sp.c3);poly([W*.5,H*.96,W*.36,H*1,W*.54,H*.74],sp.c3);ell(W*.5,H*.5,W*.14,H*.28,sp.c2);eye(W*.66,H*.4,3.2);break;
      case 'puffer':
        ell(W*.55,H*.5,W*.38,H*.4,sp.c1);ell(W*.55,H*.66,W*.3,H*.2,sp.c2);poly([W*.2,H*.5,4,H*.36,4,H*.64],sp.c3);for(let i=0;i<7;i++){x.fillStyle=sp.c3;x.beginPath();x.arc(W*(.34+i*.07),H*(.32+(i%2)*.1),2.4,0,TAU);x.fill()}eye(W*.76,H*.4,3.6);break;
      default:
        ell(W*.58,H*.5,W*.38,H*.34,sp.c1);ell(W*.6,H*.62,W*.32,H*.14,sp.c2);poly([W*.24,H*.5,2,H*.08,2,H*.92],sp.c1);poly([W*.5,H*.2,W*.7,H*.2,W*.62,H*.02],sp.c3);
        x.fillStyle=sp.c3;for(let i=0;i<3;i++)x.fillRect(W*(.4+i*.1),H*.2,W*.04,H*.6);eye(W*.8,H*.42,3.4);
    }
  });
}
function hgtkPaintPlant(kind){
  const W=96,H=160;
  return hgtkCanvas(W,H,(x)=>{
    if(kind===0){x.strokeStyle='#2a8a4a';x.lineCap='round';for(let i=0;i<5;i++){x.lineWidth=5-i*.5;x.strokeStyle=['#2a8a4a','#38a05a','#1e7040','#44b068','#2e9050'][i];x.beginPath();x.moveTo(20+i*14,H);x.bezierCurveTo(10+i*16,H*.65,34+i*12,H*.4,24+i*12,H*(.08+i*.06));x.stroke()}}
    else if(kind===1){for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*.26;x.fillStyle=['#c84a78','#e0608e','#a83860'][i%3];x.beginPath();x.ellipse(W/2+Math.cos(a)*30,H-18+Math.sin(a)*70,7,40,a+Math.PI/2,0,TAU);x.fill()}}
    else{x.fillStyle='#4a9a3a';for(let i=0;i<14;i++){const bx=10+i*5.4;x.beginPath();x.moveTo(bx-2,H);x.lineTo(bx+4,H);x.lineTo(bx+1+((i%3)-1)*8,H-60-(i*37%60));x.closePath();x.fill()}}
  });
}
function hgtkPaintRock(kind){
  const W=128,H=72;
  return hgtkCanvas(W,H,(x)=>{x.fillStyle=kind?'#5a5a66':'#6e665a';x.beginPath();x.moveTo(4,H);x.lineTo(14,H*.4);x.lineTo(46,6);x.lineTo(84,H*.3);x.lineTo(122,H*.62);x.lineTo(124,H);x.closePath();x.fill();
    x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.moveTo(60,H);x.lineTo(84,H*.3);x.lineTo(122,H*.62);x.lineTo(124,H);x.closePath();x.fill();x.fillStyle='rgba(255,255,255,.14)';x.beginPath();x.moveTo(16,H*.42);x.lineTo(46,8);x.lineTo(60,14);x.lineTo(30,H*.5);x.closePath();x.fill()});
}
function hgtkPaintBack(th){
  return hgtkCanvas(1024,256,(x,W,H)=>{
    const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgb('+th.top.join(',')+')');g.addColorStop(.35,'rgb('+th.water.join(',')+')');g.addColorStop(1,'rgb('+th.deep.join(',')+')');x.fillStyle=g;x.fillRect(0,0,W,H);
    const r=hgtkRng(77);
    x.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<40;i++){const px=r()*W;x.beginPath();x.moveTo(px,0);x.lineTo(px+30+r()*50,0);x.lineTo(px+r()*160-40,H);x.lineTo(px-20+r()*40,H);x.fill()}
    for(let i=0;i<22;i++){const px=r()*W,hh=30+r()*90;x.fillStyle='rgba('+(th.deep[0]+10)+','+(th.deep[1]+30)+','+(th.deep[2]+20)+',.55)';x.beginPath();x.ellipse(px,H-34,26+r()*40,hh*.5,0,Math.PI,0);x.fill()}
    for(let i=0;i<30;i++){const px=r()*W;x.strokeStyle='rgba(20,110,70,.55)';x.lineWidth=3+r()*3;x.lineCap='round';x.beginPath();x.moveTo(px,H-30);x.bezierCurveTo(px-14,H-90,px+16,H-150,px+(r()-.5)*40,H-120-r()*70);x.stroke()}
    const gr=x.createLinearGradient(0,H-46,0,H);gr.addColorStop(0,'rgba('+th.sand.join(',')+',.0)');gr.addColorStop(.35,'rgba('+th.sand.join(',')+',.85)');gr.addColorStop(1,'rgba('+(th.sand[0]*.6|0)+','+(th.sand[1]*.6|0)+','+(th.sand[2]*.6|0)+',1)');x.fillStyle=gr;x.fillRect(0,H-46,W,46);
    for(let i=0;i<500;i++){x.fillStyle='rgba(0,0,0,'+(.06+r()*.12)+')';x.fillRect(r()*W,H-40+r()*40,2+r()*3,2)}
  });
}
function hgtkEnsureArt(){
  if(HGTK.art)return HGTK.art;
  const A={fish:{},plants:[0,1,2].map(hgtkPaintPlant),rocks:[0,1].map(hgtkPaintRock),back:{}};
  for(const sp of HGTK.species)A.fish[sp.id]=hgtkPaintFish(sp);
  for(const k in HGTK.themes)A.back[k]=hgtkPaintBack(HGTK.themes[k]);
  A.caustic=hgtkCanvas(128,128,(x)=>{const r=hgtkRng(5);x.fillStyle='rgba(0,0,0,0)';x.clearRect(0,0,128,128);x.lineCap='round';
    for(let i=0;i<70;i++){const px=r()*128,py=r()*128,len=6+r()*16,a=r()*TAU;for(const ox of [-128,0,128])for(const oy of [-128,0,128]){x.strokeStyle='rgba(210,255,255,'+(.25+r()*.4)+')';x.lineWidth=1+r()*1.6;x.beginPath();x.moveTo(px+ox,py+oy);x.quadraticCurveTo(px+ox+Math.cos(a)*len,py+oy+Math.sin(a+1)*len,px+ox+Math.cos(a+.6)*len*1.6,py+oy+Math.sin(a)*len*1.2);x.stroke()}}});
  A.gravel=hgtkCanvas(64,64,(x)=>{const r=hgtkRng(9);for(let i=0;i<260;i++){x.fillStyle='rgba('+(r()<.5?'0,0,0':'255,240,200')+','+(.08+r()*.16)+')';x.fillRect(r()*64,r()*64,2+r()*2,2)}});
  HGTK.art=A;A.capPat=null;return A;
}
function hgtkPic(name,fb){const im=typeof IMG!=='undefined'?IMG[name]:null;return (im&&im.width)?im:fb}
/* the picture of a thing, tinted towards the water colour by depth (lvl 0 clear .. 4 hazy); cached on the source picture, 160 px wide at most */
function hgtkVar(src,th,lvl,maxW){
  const m=src._hkv||(src._hkv={}),k=th.id+lvl;let c=m[k];if(c)return c;
  const w=Math.min(maxW||160,src.width),h=Math.max(2,Math.round(src.height*w/src.width));c=document.createElement('canvas');c.width=w;c.height=h;const X=c.getContext('2d');X.drawImage(src,0,0,w,h);
  if(lvl>0){X.globalCompositeOperation='source-atop';const a=[0,.12,.26,.4,.54][lvl],wc=th.water;X.fillStyle='rgba('+wc[0]+','+wc[1]+','+wc[2]+','+a+')';X.fillRect(0,0,w,h)}
  return m[k]=c;
}

/* ---------- the live tank ---------- */
function hgtkMake(tk){
  const L=LEVELS[LEVEL],T=Object.assign({},tk);
  T.th=HGTK.themes[tk.theme]||HGTK.themes.reef;
  let foot=0;if(L&&L.terrace&&L.terrace.h){const W=L.rows[0].length,fx=tk.fx,fy=tk.fy;foot=L.terrace.h[fy*W+fx]||0}
  T.foot=foot;T.zb=foot+tk.z0;T.zt=foot+tk.z1;T.hz=T.zt-T.zb;
  if(T.wall){
    const o=T.o,eu=T.eu,ev=T.ev,su=T.su,sv=T.sv,xs=[o[0],o[0]+eu[0]*su,o[0]+ev[0]*sv,o[0]+eu[0]*su+ev[0]*sv],ys=[o[1],o[1]+eu[1]*su,o[1]+ev[1]*sv,o[1]+eu[1]*su+ev[1]*sv];
    T.bx0=Math.min(...xs);T.bx1=Math.max(...xs);T.by0=Math.min(...ys);T.by1=Math.max(...ys);T.evAxis=ev[0]!==0?0:1;
    T.cor=[[T.bx0,T.by0],[T.bx1,T.by0],[T.bx1,T.by1],[T.bx0,T.by1]];
  }else if(T.cyl){
    T.su=T.sv=2*(T.R-.12);T.o=[T.cx-T.su/2,T.cy-T.su/2];T.eu=[1,0];T.ev=[0,1];
    T.bx0=T.cx-T.R;T.bx1=T.cx+T.R;T.by0=T.cy-T.R;T.by1=T.cy+T.R;T.cor=[[T.bx0,T.by0],[T.bx1,T.by0],[T.bx1,T.by1],[T.bx0,T.by1]];
  }else{
    T.su=T.bx1-T.bx0-.2;T.sv=T.by1-T.by0-.2;T.o=[T.bx0+.1,T.by0+.1];T.eu=[1,0];T.ev=[0,1];T.cor=[[T.bx0,T.by0],[T.bx1,T.by0],[T.bx1,T.by1],[T.bx0,T.by1]];
  }
  T.mx=(T.bx0+T.bx1)/2;T.my=(T.by0+T.by1)/2;T.rad=Math.hypot(T.bx1-T.bx0,T.by1-T.by0)/2;T.far2=26*26;
  T.perim=T.cyl?TAU*T.R:2*((T.bx1-T.bx0)+(T.by1-T.by0));
  T.K=clamp(Math.min(T.su,T.hz)/3,.7,1.5);
  hgtkPopulate(T);
  T.spr={custom:{prep:(cx,cy,dX,dY)=>hgtkPrep(T,cx,cy,dX,dY),draw:(cx,cy,dX,dY,pX,pY)=>hgtkDraw(T,cx,cy,dX,dY,pX,pY)}};
  T.lamp=null;
  return T;
}
function hgtkPopulate(T){
  const R=hgtkRng(T.seed),su=T.su,sv=T.sv,hz=T.hz,items=[],SP=HGTK.spById,sch=HGTK.species.filter(s=>s.school);
  const path=(sp,o)=>Object.assign({kind:'fish',sp,ca:.5,aa:.3,cb:.5,ab:.25,cc:.5,ac:.25,p1:R()*TAU,p2:R()*TAU,p3:R()*TAU,p4:R()*TAU,ou:0,ov:0,ow:0,wf:6+R()*4,wp:R()*TAU},o);
  const speed=(sp)=>sp,mk=(sp,spd,o)=>{const aa=o.aa!==undefined?o.aa:.28+R()*.14,ab=o.ab!==undefined?o.ab:.18+R()*.14,ac=o.ac!==undefined?o.ac:.2+R()*.12;
    return path(sp,Object.assign({aa,ab,ac,w1:spd/(su*aa),w2:spd*.5/(sv*ab),w3:spd*.35/(hz*ac)},o))};
  const vol=Math.max(1,hz/3),nSchool=Math.max(1,Math.round(su/2.2*vol));
  for(let s=0;s<nSchool;s++){
    const sp=sch[(R()*sch.length)|0],n=5+((R()*5)|0),spd=.32+R()*.2,lead=mk(sp,spd,{});
    for(let i=0;i<n;i++)items.push(Object.assign({},lead,{ou:(R()-.5)*.55,ov:(R()-.5)*.3,ow:(R()-.5)*.4,wp:R()*TAU,p4:lead.p4+(R()-.5)*.3,sch:1}));
  }
  const solo=T.fish!==undefined?T.fish:Math.round((3+su*1.2)*vol),pool=['angel','puffer','tang','koi','tang','angel'];
  for(let i=0;i<solo;i++)items.push(mk(SP[pool[(R()*pool.length)|0]],.2+R()*.25,{}));
  if(su>=2.4)items.push(mk(SP.eel,.18+R()*.1,{aa:.38,ab:.12,ac:.12}));
  if(su>=2.4&&T.sv>=1.3)items.push(mk(SP.ray,.14+R()*.08,{aa:.34,ab:.2,ac:.18}));
  const nJ=1+Math.round((hz-2.5)*.9)+(su>3?1:0);for(let i=0;i<nJ;i++)items.push(path(SP.jelly,{kind:'jelly',ca:.12+R()*.76,cb:.2+R()*.6,cc:.5,aa:.04,ab:.05,ac:.34,w1:.18,w2:.14,w3:.12+R()*.08}));
  if(T.big)items.push({kind:'giant',sp:SP.giant,per:70+R()*30,dur:26,ph:R()*70,dir:R()<.5?1:-1,b:.8,wf:3,wp:0});
  // plants and rocks stand on the floor
  const np=Math.max(3,Math.round(2+su*1.4)),nTall=Math.round(Math.max(0,hz-3.5)*1.2);
  for(let i=0;i<np;i++){const back=R()<.7;items.push({kind:'plant',img:(R()*3)|0,a:.06+R()*.88,b:back?.45+R()*.5:.08+R()*.25,h:.5+R()*.9,w:.2+R()*.2,ph:R()*TAU});}
  for(let i=0;i<nTall;i++)items.push({kind:'plant',img:0,a:R()<.5?.05+R()*.15:.8+R()*.15,b:.4+R()*.5,h:1.2+R()*Math.min(3,hz*.35),w:.2+R()*.15,ph:R()*TAU,tall:1});
  for(let i=0;i<Math.max(2,np>>1);i++)items.push({kind:'rock',img:(R()*2)|0,a:.08+R()*.84,b:.3+R()*.6,h:.28+R()*.3,w:.5+R()*.5});
  T.items=items;
  T.bub=[];const nb=Math.max(2,Math.round(su/1.2));for(let i=0;i<nb;i++)T.bub.push({a:.15+R()*.7,b:.3+R()*.5,ph:R(),sp:.12+R()*.1});
  T.shafts=[];for(let i=0;i<3+Math.round(su/2);i++)T.shafts.push({a:R(),b:.35+R()*.4,ph:R()*TAU,sl:(R()-.3)*.8});
}
/* local (u along, v deep) to world; the disc mapping for cylinders */
let _wx=0,_wy=0;
function hgtkMap(T,u,v){
  if(T.cyl){const a=u/T.su*2-1,b=v/T.sv*2-1,dx=a*Math.sqrt(1-b*b/2),dy=b*Math.sqrt(1-a*a/2);_wx=T.cx+dx*(T.R-.12);_wy=T.cy+dy*(T.R-.12)}
  else{_wx=T.o[0]+T.eu[0]*u+T.ev[0]*v;_wy=T.o[1]+T.eu[1]*u+T.ev[1]*v}
}
let _wz=0,_alive=true;
/* position of a moving thing at time t (sets _wx _wy _wz, _alive) */
function hgtkItemPos(T,it,t){
  const su=T.su,sv=T.sv,m=.1;let u,v,c;_alive=true;
  if(it.kind==='giant'){
    const s=((t+it.ph)%it.per)/it.dur;if(s>=1){_alive=false;return}
    const a=it.dir>0?-.4+1.8*s:1.4-1.8*s;u=a*su;v=it.b*sv;c=.55+.08*Math.sin(t*.4);
  }else{
    const a=it.ca+it.aa*Math.sin(it.w1*t+it.p1)+.05*Math.sin(it.w1*2.3*t+it.p4),b=it.cb+it.ab*Math.sin(it.w2*t+it.p2)+.04*Math.sin(it.w2*1.9*t+it.p3),cc=it.cc+it.ac*Math.sin(it.w3*t+it.p3);
    u=a*su+it.ou+(it.sch?.05*Math.sin(t*1.7+it.wp):0);v=b*sv+it.ov;c=cc+it.ow/Math.max(.5,T.hz);
  }
  u=clamp(u,m,su-m);if(it.kind!=='giant')v=clamp(v,m,sv-m);else v=clamp(v,m,sv-m);
  hgtkMap(T,u,v);_wz=T.zb+.22+clamp(c,.04,.96)*(T.hz-.22-.2);
}
/* ray span through the tank: sets _ti _to; false when the ray misses or the camera is inside */
let _ti=0,_to=0,_ea=0;
function hgtkSpan(T,cx,cy,rX,rY){
  if(T.cyl){const ox=cx-T.cx,oy=cy-T.cy,a=rX*rX+rY*rY,b=ox*rX+oy*rY,c=ox*ox+oy*oy-T.R*T.R,d=b*b-a*c;if(d<=0)return false;const s=Math.sqrt(d);_ti=(-b-s)/a;_to=(-b+s)/a;return _ti>.01}
  const ix=rX===0?1e9:1/rX,iy=rY===0?1e9:1/rY;let t0=(T.bx0-cx)*ix,t1=(T.bx1-cx)*ix,s0=(T.by0-cy)*iy,s1=(T.by1-cy)*iy,tmp;
  if(t0>t1){tmp=t0;t0=t1;t1=tmp}if(s0>s1){tmp=s0;s0=s1;s1=tmp}
  _ti=t0>s0?t0:s0;_to=t1<s1?t1:s1;_ea=t1<s1?0:1;return _to>_ti&&_ti>.01;
}

/* ---------- sync with the level ---------- */
function hgtkSync(){
  const L=LEVELS[LEVEL];
  if(HGTK._L===L&&HGTK._lv===LEVEL)return;
  HGTK._L=L;HGTK._lv=LEVEL;HGTK.list=[];
  if(!L||!L.decor)return;
  if(!(hgtAny(LEVEL)||L.hgtkOn))return;
  for(const d of L.decor)if(d.k==='hgtk_tank'&&d.tk){try{HGTK.list.push(hgtkMake(d.tk))}catch(e){console.error('hgtk make',e)}}
}
function hgtkRegister(L){HGTK._L=null;if(L)L.hgtkOn=true;hgtkSync()}
function hgtkLights(){
  for(const T of HGTK.list){
    if(T.light===false||!T.th)continue;
    if(T.lamp&&LIGHTS.indexOf(T.lamp)>=0)continue;
    const l={x:(T.wall?T.lx:T.mx)+.5-(T.wall?.0:.5),y:(T.wall?T.ly:T.my)+.5-(T.wall?.0:.5),ph:T.seed%7,key:-7500-LIGHTS.length,taken:false,red:false,free:true,calm:true,col:[T.th.water[0]/110+.1,T.th.top[1]/200+.2,T.th.top[2]/200+.3],kI:T.wall?.9:1.1,range2:80,hgtk:1};
    LIGHTS.push(l);T.lamp=l;
  }
}
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);
  if(HGTK.on){try{HGTK.ms=0;hgtkSync();if(HGTK.list.length){hgtkLights();for(const T of HGTK.list)L.push(T.spr)}}catch(e){if(!HGTK._e1){HGTK._e1=1;console.error('hgtk sprites',e)}}}
  return L}}

/* ---------- drawing ---------- */
const HGTK_VIS=new Uint8Array(VW+2),HGTK_SD=new Uint8Array(VW+2),HGTK_TI=new Float32Array(VW+2),HGTK_P=new Float32Array(VW+2),HGTK_YT=new Float32Array(VW+2),HGTK_YB=new Float32Array(VW+2),
  HGTK_Y2T=new Float32Array(VW+2),HGTK_Y2B=new Float32Array(VW+2),HGTK_CB=new Float32Array(VW+2),HGTK_FT=new Float32Array(VW+2),HGTK_CUT=new Float32Array(VW+2),HGTK_RT=new Float32Array(VW+2),HGTK_RB=new Float32Array(VW+2),HGTK_WV=new Uint8Array(VW+2);
function hgtkPrep(T,cx,cy,dX,dY){
  const rx=T.mx-cx,ry=T.my-cy;if(rx*rx+ry*ry>T.far2)return 0;
  const ty=dX*rx+dY*ry;if(ty<-T.rad-.5)return 0;
  return T.wall?1e5:Math.max(ty,.3);
}
/* path of every visible run between two edge arrays */
function hgtkRuns(top,bot,xa,xb,dt,db,vis){
  vis=vis||HGTK_VIS;SC.beginPath();let x=xa,n=0;
  while(x<=xb){if(!vis[x]){x++;continue}const s=x;while(x<=xb&&vis[x])x++;
    SC.moveTo(s,top[s]+dt);for(let k=s;k<x;k++)SC.lineTo(k+.5,top[k]+dt);SC.lineTo(x,top[x-1]+dt);SC.lineTo(x,bot[x-1]+db);for(let k=x-1;k>=s;k--)SC.lineTo(k+.5,bot[k]+db);SC.lineTo(s,bot[s]+db);SC.closePath();n++}
  return n;
}
function hgtkDrawSlices(img,cxs,cys,w,h,sx,rot,amp,ph){
  SC.save();SC.translate(cxs,cys);if(rot)SC.rotate(rot);SC.scale(sx,1);
  const sw=img.width,sh=img.height;
  if(!amp||w<10)SC.drawImage(img,-w/2,-h/2,w,h);
  else{const N=5;for(let i=0;i<N;i++){const f=i/N,dy=Math.sin(ph-f*3.4)*amp*h*(1-f)*(1-f);SC.drawImage(img,sw*i/N,0,sw/N+.6,sh,-w/2+w*i/N,-h/2+dy,w/N+.6,h)}}
  SC.restore();
}
function hgtkDrawSway(img,x,yb,w,h,amp,ph){
  const sw=img.width,sh=img.height,N=6;
  for(let i=0;i<N;i++){const f=i/N,dx=Math.sin(ph+f*1.6)*amp*w*(1-f)*(1-f);SC.drawImage(img,0,sh*i/N,sw,sh/N+.6,x-w/2+dx,yb-h+h*i/N,w,h/N+.6)}
}
function hgtkDraw(T,cx,cy,dX,dY,pX,pY){
  if(!HGTK.on||T.err)return;
  const t0=performance.now();
  try{hgtkDrawInner(T,cx,cy,dX,dY,pX,pY)}catch(e){T.err=1;console.error('hgtk draw',e)}
  HGTK.ms+=performance.now()-t0;
}
function hgtkDrawInner(T,cx,cy,dX,dY,pX,pY){
  const A=hgtkEnsureArt(),th=T.th,camz=TERR_NOW?CAMZ:EYE,tm=G.time||0,zb=T.zb,zt=T.zt,hz=T.hz,VIS=HGTK_VIS,TI=HGTK_TI,YT=HGTK_YT,YB=HGTK_YB,Y2T=HGTK_Y2T,Y2B=HGTK_Y2B;
  // screen span of the tank
  let xa=0,xb=VW-1,near=false,allBehind=true,mn=1e9,mx=-1e9;
  for(const c of T.cor){const rx=c[0]-cx,ry=c[1]-cy,ty=dX*rx+dY*ry;if(ty<.15)near=true;else{allBehind=false;const sx=VW/2*(1-(dY*rx-dX*ry)/PL/ty);if(sx<mn)mn=sx;if(sx>mx)mx=sx}}
  if(allBehind)return;
  if(!near){xa=Math.max(0,Math.floor(mn)-2);xb=Math.min(VW-1,Math.ceil(mx)+2);if(xb<xa)return}
  // columns: where the front surface of the glass is seen
  let nvis=0,ymin=1e9,ymax=-1e9,vx0=VW,vx1=-1,tNear=1e9,tFar=0;
  const fx=F;
  for(let x=xa;x<=xb;x++){
    VIS[x]=0;const cm=2*x/VW-1,rX=dX+pX*cm,rY=dY+pY*cm;
    if(!hgtkSpan(T,cx,cy,rX,rY))continue;
    const ti=_ti,to=_to;if(zbuf[x]<ti-.045)continue;
    const yt=HH+(camz-zt)*fx/ti;let yb=HH+(camz-zb)*fx/ti,cut=1e9;
    if(TERR_NOW){const kb=clamp(((ti*YBS)|0)-1,0,YBK-1);cut=YBinline(x,kb);if(yb>cut)yb=cut}
    HGTK_CUT[x]=cut;if(yb<=yt+.3)continue;
    VIS[x]=1;nvis++;TI[x]=ti;YT[x]=yt;YB[x]=yb;
    const y2t=HH+(camz-zt)*fx/_to,y2b=HH+(camz-zb)*fx/_to;Y2T[x]=y2t;Y2B[x]=Math.min(y2b,yb);HGTK_CB[x]=Math.min(Math.max(y2t,yt),yb);HGTK_FT[x]=Math.min(Math.max(y2b,yt),yb);
    // exit point on the inside: perimeter coordinate for the back picture, and whether it is a side panel
    const ex=cx+rX*to,ey=cy+rY*to;let P,side=0;
    if(T.cyl){P=(Math.atan2(ey-T.cy,ex-T.cx)+Math.PI)*T.R}
    else{const Wd=T.bx1-T.bx0,Dd=T.by1-T.by0,ea=_ea;
      if(ea===1){P=rY<0?ex-T.bx0:Wd+Dd+(T.bx1-ex);if(T.wall&&T.evAxis===0)side=1}
      else{P=rX>0?Wd+(ey-T.by0):2*Wd+Dd+(T.by1-ey);if(T.wall&&T.evAxis===1)side=1}}
    HGTK_P[x]=P;HGTK_SD[x]=side;
    if(yt<ymin)ymin=yt;if(yb>ymax)ymax=yb;if(x<vx0)vx0=x;if(x>vx1)vx1=x;if(ti<tNear)tNear=ti;if(to>tFar)tFar=to;
  }
  if(!nvis)return;
  const cenD=Math.hypot(T.mx-cx,T.my-cy),K=typeof hgtLookFor==='function'?hgtLookFor(LEVEL):null;
  // light on the wall round a wall tank (drawn first; the glass covers the window)
  if(T.wall&&cenD<16){
    const n=[-T.ev[0],-T.ev[1]],pl=n[0]!==0?T.o[0]:T.o[1],wh=T.wh,WV=HGTK_WV;let any=0;
    for(let x=xa;x<=xb;x++){WV[x]=0;const cm=2*x/VW-1,rX=dX+pX*cm,rY=dY+pY*cm,den=n[0]!==0?rX:rY;if(Math.abs(den)<1e-5)continue;
      const tp=(pl-(n[0]!==0?cx:cy))/den;if(tp<=.05||Math.abs(zbuf[x]-tp)>.05)continue;
      const lx=cx+rX*tp,ly=cy+rY*tp,u=(lx-T.o[0])*T.eu[0]+(ly-T.o[1])*T.eu[1];if(u<-1.3||u>T.su+1.3)continue;
      let yb=HH+(camz-T.foot)*fx/tp;if(TERR_NOW){const kb=clamp(((tp*YBS)|0)-1,0,YBK-1),c=YBinline(x,kb);if(yb>c)yb=c}
      const ytp=HH+(camz-(T.foot+wh))*fx/tp;if(yb<=ytp)continue;HGTK_RT[x]=ytp;HGTK_RB[x]=yb;WV[x]=1;any++}
    if(any){
      SC.save();hgtkRuns(HGTK_RT,HGTK_RB,xa,xb,0,0,WV);SC.clip();
      SC.globalCompositeOperation='lighter';
      const pat=SC.createPattern(A.caustic,'repeat');
      for(let k=0;k<2;k++){const s=(k?1.6:1.05)*Math.max(.5,F/Math.max(2,cenD)/60);pat.setTransform(new DOMMatrix().translate(tm*(k?-5:7),tm*(k?3:-4)).scale(s));SC.fillStyle=pat;SC.globalAlpha=(k?.16:.22)*(1-cenD/18);SC.fillRect(xa,0,xb-xa+1,VH)}
      SC.restore();
    }
  }
  // clip to the glass
  SC.save();hgtkRuns(YT,YB,xa,xb,0,0);SC.clip();
  const w0=vx0,w1=vx1+1,bw=w1-w0;
  // water: a deep gradient, then the far panel, floor and surface
  {const g=SC.createLinearGradient(0,ymin,0,ymax);g.addColorStop(0,'rgb('+th.top.join(',')+')');g.addColorStop(.3,'rgb('+th.water.join(',')+')');g.addColorStop(1,'rgb('+th.deep.join(',')+')');SC.fillStyle=g;SC.fillRect(w0,ymin,bw,ymax-ymin)}
  const back=hgtkPic('hgt_tank_back_'+th.id,A.back[th.id]||A.back.reef),bwid=back.width,bhei=back.height;
  for(let x=vx0;x<=vx1;x++){
    if(!VIS[x])continue;
    const y2t=Y2T[x],y2b=Math.min(Y2B[x],YB[x]);if(y2b<=y2t)continue;
    const sxp=((HGTK_P[x]/T.perim)%1+1)%1*bwid;
    SC.drawImage(back,sxp,0,Math.max(1,bwid/ (T.perim*45)),bhei,x,y2t,1.2,y2b-y2t);
    if(HGTK_SD[x]){SC.fillStyle='rgba(2,20,34,.3)';SC.fillRect(x,y2t,1.2,y2b-y2t)}
  }
  // surface underside (a silvery ripple) when the eye is under the water line
  if(camz<zt){hgtkRuns(YT,HGTK_CB,xa,xb,0,0);const g=SC.createLinearGradient(0,ymin,0,ymin+Math.max(20,(ymax-ymin)*.25));g.addColorStop(0,'rgba(220,255,255,.75)');g.addColorStop(1,'rgba(150,230,240,.15)');SC.fillStyle=g;SC.fill()}
  // gravel floor when the eye is above it
  if(camz>zb){hgtkRuns(HGTK_FT,YB,xa,xb,0,0);const g=SC.createLinearGradient(0,ymin,0,ymax);g.addColorStop(0,'rgb('+(th.sand[0]*.62|0)+','+(th.sand[1]*.62|0)+','+(th.sand[2]*.62|0)+')');g.addColorStop(1,'rgb('+(th.sand[0]*.9|0)+','+(th.sand[1]*.9|0)+','+(th.sand[2]*.9|0)+')');SC.fillStyle=g;SC.fill();
    SC.globalAlpha=.8;SC.fillStyle=SC.createPattern(A.gravel,'repeat');SC.fill();SC.globalAlpha=1}
  // things inside, far to near
  const items=T.items,its=[];const vf=VW/2;
  for(let i=0;i<items.length;i++){
    const it=items[i];let kind=it.kind,p=0;
    if(kind==='plant'||kind==='rock'){hgtkMap(T,it.a*T.su,it.b*T.sv);_wz=T.zb+.2}
    else{hgtkItemPos(T,it,tm);if(!_alive)continue}
    const rx=_wx-cx,ry=_wy-cy,tY=dX*rx+dY*ry;if(tY<.12)continue;
    const wx=_wx,wy=_wy,wz=_wz;let vx=0,vy=0,vz=0;
    if(kind==='fish'||kind==='giant'||kind==='jelly'){const zz=_wz;hgtkItemPos(T,it,tm+.12);vx=_wx-wx;vy=_wy-wy;vz=_wz-zz;_wz=zz}
    its.push({it,kind,wx,wy,wz,tY,tX:-(dY*rx-dX*ry)/PL,vx,vy,vz});
  }
  its.sort((a,b)=>b.tY-a.tY);
  const rgx=-dY,rgy=dX;
  for(const o of its){
    const it=o.it,ty=o.tY,sxc=vf*(1+o.tX/ty),syc=HH+(camz-o.wz)*F/ty,cmi=o.tX/ty;
    // haze by depth inside the tank along this line of sight
    let hzl=0;if(hgtkSpan(T,cx,cy,dX+pX*cmi,dY+pY*cmi)){hzl=clamp((ty-_ti)/Math.max(.3,_to-_ti),0,1)}
    const lvl=Math.min(4,(hzl*4.6)|0);
    if(o.kind==='plant'||o.kind==='rock'){
      const isP=o.kind==='plant',src=hgtkPic(isP?'hgt_tank_plant'+it.img:'hgt_tank_rock'+it.img,isP?A.plants[it.img]:A.rocks[it.img]),v=hgtkVar(src,th,lvl),
        hh=it.h*T.K*F/ty,ww=hh*src.width/src.height*(isP?1:1.4)*(it.w/(isP?.3:.7));
      if(syc-hh>VH+40||syc<-20||sxc+ww<-20||sxc-ww>VW+20)continue;
      if(isP)hgtkDrawSway(v,sxc,syc,ww,hh,.08,tm*1.3+it.ph);else SC.drawImage(v,sxc-ww/2,syc-hh,ww,hh);
      continue;
    }
    const sp=it.sp,src=hgtkPic('hgt_fish_'+sp.id,A.fish[sp.id]),v=hgtkVar(src,th,lvl,sp.big?256:160);
    const len=sp.len*T.K*(sp.big?Math.min(1.4,T.su/3):1),ww=F*len/ty,hh=ww*src.height/src.width;
    if(sxc+ww<-10||sxc-ww>VW+10||syc+hh<-10||syc-hh>VH+10)continue;
    let sgn=1,sx=1,rot=0,amp=.12;
    if(sp.noflip){amp=0;sx=1}
    else{
      const hr=o.vx*rgx+o.vy*rgy,hf=o.vx*dX+o.vy*dY,hl=Math.hypot(hr,hf)||1,c=hr/hl;
      sx=(c<0?-1:1)*(.3+.7*Math.abs(c));
      rot=clamp(-o.vz/Math.max(.02,Math.abs(hr)+.02),-.7,.7)*.5*(c<0?-1:1)*(-1);
      amp=sp.shape==='eel'?.5:sp.shape==='ray'||sp.big?.16:.2;
    }
    hgtkDrawSlices(v,sxc,syc,ww,hh,sx,rot,amp,tm*it.wf+it.wp);
  }
  // bubbles
  SC.lineWidth=1;
  for(const b of T.bub){
    for(let k=0;k<9;k++){
      const pr=((tm*b.sp+b.ph+k/9)%1),u=(b.a+Math.sin(tm*1.3+k*2.1+b.ph*6)*.02)*T.su,v=b.b*T.sv;hgtkMap(T,u,v);
      const wz=T.zb+.2+pr*(hz-.4),rx=_wx-cx,ry=_wy-cy,ty=dX*rx+dY*ry;if(ty<.15)continue;
      const sx=vf*(1-(dY*rx-dX*ry)/PL/ty),sy=HH+(camz-wz)*F/ty,r=Math.max(.6,F*(.018+.012*((k*7)%3))/ty);
      SC.globalAlpha=.55*(1-pr*.4);SC.strokeStyle='rgba(235,255,255,1)';SC.fillStyle='rgba(200,240,255,.25)';SC.beginPath();SC.arc(sx,sy,r,0,TAU);SC.fill();SC.stroke();
    }
  }
  SC.globalAlpha=1;
  // light shafts from the surface, caustics, surface glow
  SC.globalCompositeOperation='lighter';
  for(const s of T.shafts){
    const a=s.a*T.su,v=s.b*T.sv;hgtkMap(T,a,v);const bx=_wx,by=_wy;
    hgtkMap(T,clamp(a+s.sl*hz,0,T.su),v);const fx2=_wx,fy2=_wy;
    const pj=(wx,wy,wz)=>{const rx=wx-cx,ry=wy-cy,ty=dX*rx+dY*ry;if(ty<.15)return null;return [vf*(1-(dY*rx-dX*ry)/PL/ty),HH+(camz-wz)*F/ty]};
    const w=.1+.06*Math.sin(tm*.6+s.ph),tp=pj(bx,by,zt),tq=pj(bx,by,zt),bl=pj(fx2,fy2,zb),bq=pj(fx2,fy2,zb);if(!tp||!bl)continue;
    const kw=Math.min(34,F*w/Math.max(.6,TI[Math.min(VW-1,Math.max(0,tp[0]|0))]||1)),kb=kw*2.4;
    const g=SC.createLinearGradient(0,tp[1],0,bl[1]);g.addColorStop(0,'rgba(190,255,255,'+(.17+.06*Math.sin(tm*.8+s.ph))+')');g.addColorStop(1,'rgba(120,220,255,0)');SC.fillStyle=g;
    SC.beginPath();SC.moveTo(tp[0]-kw,tp[1]);SC.lineTo(tp[0]+kw,tp[1]);SC.lineTo(bl[0]+kb,bl[1]);SC.lineTo(bl[0]-kb,bl[1]);SC.closePath();SC.fill();
  }
  {const pat=SC.createPattern(A.caustic,'repeat'),sc=Math.max(.6,F/Math.max(1.5,tNear)/70);
   for(let k=0;k<2;k++){pat.setTransform(new DOMMatrix().translate(tm*(k?-6:9),tm*(k?4:-3)).scale(sc*(k?1.5:1)));SC.fillStyle=pat;SC.globalAlpha=(k?.12:.18);SC.fillRect(w0,ymin,bw,ymax-ymin)}
   SC.globalAlpha=1;
   const g=SC.createLinearGradient(0,ymin,0,ymin+Math.max(24,(ymax-ymin)*.3));g.addColorStop(0,'rgba(170,240,250,.28)');g.addColorStop(1,'rgba(170,240,250,0)');SC.fillStyle=g;SC.fillRect(w0,ymin,bw,ymax-ymin)}
  SC.globalCompositeOperation='source-over';
  // glass: dark edges and a bright streak on round tanks, a soft streak on flat ones
  {const g=SC.createLinearGradient(w0,0,w1,0);
   if(T.cyl){g.addColorStop(0,'rgba(0,10,22,.6)');g.addColorStop(.1,'rgba(0,10,22,.15)');g.addColorStop(.22,'rgba(255,255,255,0)');g.addColorStop(.27,'rgba(255,255,255,.2)');g.addColorStop(.33,'rgba(255,255,255,0)');g.addColorStop(.86,'rgba(0,10,22,0)');g.addColorStop(1,'rgba(0,10,22,.6)')}
   else{g.addColorStop(0,'rgba(255,255,255,.0)');g.addColorStop(.3,'rgba(255,255,255,.07)');g.addColorStop(.36,'rgba(255,255,255,.0)');g.addColorStop(.7,'rgba(255,255,255,.0)');g.addColorStop(.75,'rgba(255,255,255,.05)');g.addColorStop(.8,'rgba(255,255,255,0)')}
   SC.fillStyle=g;SC.fillRect(w0,ymin,bw,ymax-ymin)}
  // the air between the eye and the tank (the city haze)
  if(K){const a=Math.min(K.haze*.75,cenD*K.hazeRate*.8);if(a>.01){SC.globalAlpha=a;SC.fillStyle='rgb('+K.hazeCol.join(',')+')';SC.fillRect(w0,ymin,bw,ymax-ymin);SC.globalAlpha=1}}
  SC.restore();
  // freestanding tanks: a brass cap, the pedestal and the bands
  if(!T.wall){
    const ribbon=(zA,zB,c0,c1)=>{
      let any=0;for(let x=xa;x<=xb;x++){if(!VIS[x])continue;const ti=TI[x];let a=HH+(camz-zB)*fx/ti,b=HH+(camz-zA)*fx/ti;if(b>HGTK_CUT[x])b=HGTK_CUT[x];HGTK_RT[x]=a;HGTK_RB[x]=b;if(b>a)any++}
      if(!any)return;hgtkRuns(HGTK_RT,HGTK_RB,xa,xb,0,0);
      const g=SC.createLinearGradient(w0,0,w1,0);g.addColorStop(0,c0);g.addColorStop(.3,c1);g.addColorStop(.6,c0);g.addColorStop(1,'#241c10');SC.fillStyle=g;SC.fill();};
    ribbon(zt-.02,zt+.16,'#6a5632','#d4bc80');
    ribbon(T.foot,zb+.02,'#4a4036','#8c8070');
    if(T.bands)for(const bz of T.bands)ribbon(T.foot+bz-.07,T.foot+bz+.07,'#6a5632','#d4bc80');
  }
}
function YBinline(x,kb){return YB_ARR()[x*YBK+kb]}
function YB_ARR(){return YB}

/* ---------- TEST LEVEL 487 (the tank terraces) and the tank room 4851. Link: ?town=hgttank&lvl=34 ---------- */
LEVEL_NAMES[487]='The Tank Terraces';LEVEL_NAMES[4851]='The Tank Room';
function hgtkBuildTest(){
  const W=64,H=52,B=hgtlNew(W,H,487),body=hgtkTile('body',3.5).ch,I=(x,y)=>y*W+x;
  hgtlBorder(B,body,0);
  const door=HGTE.doorTile(3.5,[120,160,170],4851,{x:11,y:11,f:0}),DCH='\u24f0';
  // the tank room entrance (a plain block with a door facing south)
  hgtlBlock(B,27,40,7,3,body,0);hgtlWall(B,30,42,DCH,0);
  // wall tanks: a long run facing south, a short one, one facing east, one facing west
  hgtkTank(B,6,3,9,3,{type:'wall',face:'S',theme:'reef',seed:11});
  hgtkTank(B,19,3,5,3,{type:'wall',face:'S',theme:'lagoon',seed:12});
  hgtkTank(B,28,3,7,3,{type:'wall',face:'S',theme:'deep',seed:13});
  hgtkTank(B,1,10,3,9,{type:'wall',face:'E',theme:'violet',seed:14});
  hgtkTank(B,60,10,3,7,{type:'wall',face:'W',theme:'reef',seed:15});
  // plaza tanks: a round one, a rectangular one
  hgtkTank(B,28,22,3,3,{type:'round',theme:'reef',seed:21});
  hgtkTank(B,14,24,2,3,{type:'box',theme:'lagoon',z1:3.0,seed:22});
  // the three-storey tank tower, with a stair of steps round it (outer ring first, then the inner ring)
  const tcx=48,tcy=18;
  hgtkTank(B,tcx-1,tcy-1,3,3,{type:'tower',theme:'deep',z1:9.4,seed:31});
  // outer flight: up the west side, along the north side, down the east side (open on the south so the tank shows from the plaza); inner flight climbs back round the inside
  const r4=[],r3=[];
  for(let y=tcy+3;y>=tcy-4;y--)r4.push([tcx-4,y]);for(let x=tcx-3;x<=tcx+4;x++)r4.push([x,tcy-4]);for(let y=tcy-3;y<=tcy+3;y++)r4.push([tcx+4,y]);
  for(let y=tcy+3;y>=tcy-3;y--)r3.push([tcx+3,y]);for(let x=tcx+2;x>=tcx-3;x--)r3.push([x,tcy-3]);for(let y=tcy-2;y<=tcy+3;y++)r3.push([tcx-3,y]);
  let hh=0;for(const [x,y] of r4){hh+=.18;hgtlOpen(B,x,y,hh,HGTL.K.STAIR)}
  const h4=hh;for(const [x,y] of r3){hh+=.23;hgtlOpen(B,x,y,hh,HGTL.K.STAIR)}
  hgtlRegRun(B,r4,0,.18,'ring');hgtlRegRun(B,r3,h4,.23,'ring');
  hgtlDecor(B,'hg_lamp',tcx,tcy+5,{walk:true,deco:true});
  // lamps
  for(const [x,y] of [[10,8],[22,8],[31,8],[8,30],[40,30],[24,36],[36,36],[52,34]]){hgtlDecor(B,'hg_lamp',x,y,{walk:true,deco:true});hgtlLight(B,x,y)}
  hgtlSetStart(B,30,45,0);
  const lv=hgtlAssemble(B,{name:'The Tank Terraces',label:'The Tank Terraces',start:{x:30,y:45,f:0},ceilH:3.5,diff:66,
    extra:{chars:{[DCH]:door},terrace:{h:B.h,riser:HGTE.tile(1,[205,195,175]),roof:14},floorSet:['ohMeadow','ohGravel','ohLawn','bluesand','bluewater','ohMoss'],floor:'ohMeadow',ceil:'tomb',amb:.58,noExtras:true,scenery:[],
      fmap:Array.from({length:H},()=>'0'.repeat(W))}});
  lv.chars=Object.assign({},lv.chars,{[DCH]:door});lv.hgtkOn=true;
  const v=hgtlValidate(B,30,45);lv.hgtkValid={ok:v.ok,unreach:v.unreachable.length,doors:v.doorsBad.length,steep:v.steep.length};if(!v.ok&&typeof console!=='undefined')console.warn('hgtk 487 validate',v.unreachable.length,v.doorsBad.length,v.steep.length);
  return lv;
}
hgtRegister(487,hgtkBuildTest);
hgtRegister(4851,id=>{
  const W=23,H=13,B=hgtlNew(W,H,4851),body=hgtkTile('body',3.5).ch,back=HGTE.doorTile(3.5,[120,160,170],487,{x:30,y:43,f:2}),DCH='\u24f1';
  hgtlBlock(B,0,0,W,H,body,0);hgtlFill(B,3,3,17,9,0,0);
  hgtkTank(B,1,0,9,3,{type:'wall',face:'S',theme:'reef',seed:41});
  hgtkTank(B,13,0,9,3,{type:'wall',face:'S',theme:'deep',seed:42});
  hgtkTank(B,0,4,3,7,{type:'wall',face:'E',theme:'lagoon',seed:43});
  hgtkTank(B,20,4,3,7,{type:'wall',face:'W',theme:'violet',seed:44});
  hgtkTank(B,10,6,3,3,{type:'round',theme:'reef',seed:45,z1:3.0});
  hgtlWall(B,11,12,DCH,0);
  for(const [x,y] of [[4,11],[18,11],[4,3],[18,3]])hgtlDecor(B,'hg_lamp',x,y,{walk:true,deco:true});
  const lv=hgtlAssemble(B,{name:'The Tank Room',label:'The Tank Room',start:{x:11,y:11,f:0},ceilH:3.6,diff:66,extra:{floor:'wood',amb:.2,noExtras:true,scenery:[]}});
  delete lv.terrace;delete lv.outdoor;lv.chars=Object.assign({},lv.chars,{[DCH]:back});lv.hgtkOn=true;lv.lights=[[11,11]];
  return lv;
});
