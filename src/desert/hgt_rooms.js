/* ==========================================================================
   HOLLOW GRASSLANDS ROOMS: SPHERE ROOMS AND STAR ROOMS (prefix hgtr / HGTR). Interior levels 4960 to 4999 for the cities (and a test lobby).
   - 4960 is a lobby with a door to every room. Test link: ?town=hgtrooms&lvl=34 (AREAS in index.html jumpFromUrl). Rooms: 4961 ball pit, 4962 giant spheres, 4963 floating spheres, 4964 pearl pool (terraced basin),
     4965 rainbow corridor, 4966 orb nursery, 4967 sphere court, 4968 marble gallery; 4970 planetarium, 4971 star stair (terraced, climbs 7.2), 4972 gathering stars, 4973 lantern stars, 4974 fireflies,
     4975 vast star hall, 4976 moon observatory.
   - SPHERE ROOMS (4961 to 4968): glossy coloured spheres of many sizes (purple, green, blue, orange, yellow, white, pink, pearl, glowing, painted marbles) drawn as
     lit raster spheres (shaded pictures made once at load from solid colours, highlights computed by the shader loop, or from the hgt_planet_* paintings) and depth tested
     against the walls column by column. Cheap physics: spring pushed by the party, damping, soft sphere-sphere collisions, gentle sounds. Spheres never block a cell.
   - STAR ROOMS (4970 to 4976): near black rooms lit by glowing stars: twinkling, drifting, coloured, each giving a faint coloured pool on the floor (additive pool) and the
     seven nearest stars give REAL coloured light to walls and floor (the engine light slots). Constellations, shooting stars, a moon or great star as a centrepiece, a star on
     every door and stair edge. Stars never block a cell.
   API
     HGTROOMS                         list of {id,kind,name,entry:{x,y,f},doorBack:{x,y}} (kind 'lobby'|'sphere'|'star'); the city files read it to place doors.
     hgtrRoom(id,{name,kind,entry,exits,...})   registers a room (all the rooms below are registered with it).
     hgtrSetReturn(id,cityLevel,{x,y,f})        where the door back out of room id leads (the cell in the city in front of the outside door). Kept in code and in
                                              G.flags.hgtrRet[id] so it survives saves. Without it the room remembers the cell the party came in from (G.flags.hgtrAuto).
     A city door tile is made like any other: KH_DOOR[gid]={lvl:id,at:HGTROOMS entry} (hgtaDoorTile(...,{lvl:id,at:entry})).
     HGTR.ms / HGTR.n                 cost in ms of the last frame of the room (physics + draws) and the number of drawn items.
   Nothing here is saved except the return flags: everything is rebuilt from the room seed on entry.
   ========================================================================== */
var HGTR=(typeof HGTR==='undefined')?{}:HGTR;
var HGTROOMS=(typeof HGTROOMS==='undefined')?[]:HGTROOMS;
HGTR.ID0=4960;HGTR.IDN=4999;HGTR.LOBBY=4960;HGTR.rooms={};HGTR.ret={};HGTR.S=null;HGTR.ms=0;HGTR.n=0;HGTR.img={};HGTR.halo={};HGTR.starImgs={};HGTR.poolImgs={};HGTR.texd={};HGTR.lobbyFront={};HGTR.off=false;HGTR._dm=0;
const hgtrIs=n=>n>=4960&&n<=4999&&!!(HGTR.rooms[n]||HGTE.builders[n]);
const hgtrCl=(v,a,b)=>v<a?a:v>b?b:v;
function hgtrRng(seed){let s=(seed|0)||1;return()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}

/* ---------- colours ---------- */
const HGTR_PAL=[
 {n:'purple',c:[146,74,218]},{n:'green',c:[66,198,110]},{n:'blue',c:[64,124,238]},{n:'orange',c:[250,144,46]},{n:'yellow',c:[250,224,76]},{n:'white',c:[240,240,250]},{n:'pink',c:[250,128,192]},
 {n:'teal',c:[58,208,208]},{n:'red',c:[226,66,78]},{n:'pearl',c:[238,230,236],pearl:1},
 {n:'glowpurple',c:[176,100,255],glow:1},{n:'glowgreen',c:[104,255,152],glow:1},{n:'glowblue',c:[92,162,255],glow:1},{n:'gloworange',c:[255,172,72],glow:1},{n:'glowyellow',c:[255,240,112],glow:1},
 {n:'glowwhite',c:[255,252,255],glow:1},{n:'glowpink',c:[255,142,216],glow:1},
 {n:'coral',c:[230,150,130],tex:'hgt_planet_coral'},{n:'jade',c:[120,200,160],tex:'hgt_planet_jade'},{n:'ocean',c:[80,140,210],tex:'hgt_planet_ocean'},{n:'ice',c:[190,225,245],tex:'hgt_planet_ice'},
 {n:'lava',c:[230,110,60],tex:'hgt_planet_lava'},{n:'violet',c:[160,110,220],tex:'hgt_planet_violet'},{n:'desert',c:[225,190,130],tex:'hgt_planet_desert'},{n:'pearlplanet',c:[235,225,235],tex:'hgt_planet_pearl'},
 {n:'moon',c:[226,230,246],tex:'hgt_planet_cratered',glow:.55},
 {n:'pearlrose',c:[246,222,232],pearl:1,hue:.5},{n:'pearlaqua',c:[220,240,242],pearl:1,hue:2.3},{n:'pearlgold',c:[248,236,214],pearl:1,hue:4.2}];
const HGTR_RAINBOW=[8,3,4,1,7,2,0,6];
const HGTR_BRIGHT=[0,1,2,3,4,5,6,7,8,9];
const HGTR_GLOW=[10,11,12,13,14,15,16];
const HGTR_MARBLE=[17,18,19,20,21,22,23,24];
const HGTR_SC=[[255,244,222],[190,216,255],[255,214,142],[255,172,192],[204,172,255],[152,236,255],[255,172,102],[172,255,192]]; // star colours
function hgtrTexData(name){
  let t=HGTR.texd[name];if(t!==undefined)return t;
  const im=IMG[name]||IMG['art_'+name]||IMG['ds_'+name];
  if(!im||!(im.width||im.videoWidth)){return null}
  const w=256,h=128,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,w,h);
  return HGTR.texd[name]={w,h,d:x.getImageData(0,0,w,h).data};
}
function hgtrMk(n){const c=document.createElement('canvas');c.width=c.height=n;return c}
/* a shaded sphere picture pair (lit, dark) for palette index ci: solid colour or painted planet texture, highlights computed here */
function hgtrSphereImgs(ci){
  let m=HGTR.img[ci];if(m)return m;
  const C=HGTR_PAL[ci],N=128,h=N/2,tex=C.tex?hgtrTexData(C.tex):null;
  if(C.tex&&!tex&&!HGTR._texWait){HGTR._texWait=G.time}
  const lit=hgtrMk(N),dark=hgtrMk(N),lx=lit.getContext('2d'),dx=dark.getContext('2d'),I1=lx.createImageData(N,N),I2=dx.createImageData(N,N),D1=I1.data,D2=I2.data;
  const L=[-.45,-.62,.64],ll=Math.hypot(L[0],L[1],L[2]),Lx=L[0]/ll,Ly=L[1]/ll,Lz=L[2]/ll,Hx=Lx,Hy=Ly,Hz=Lz+1,hl=Math.hypot(Hx,Hy,Hz),hx=Hx/hl,hy=Hy/hl,hz=Hz/hl;
  const rot=(ci*1.7)%6.28,glow=C.glow||0;
  for(let py=0;py<N;py++)for(let px=0;px<N;px++){
    const nx=(px+.5-h)/h,ny=(py+.5-h)/h,rr=nx*nx+ny*ny;if(rr>=1.03)continue;
    const nz=Math.sqrt(Math.max(0,1-rr)),al=hgtrCl((1-Math.sqrt(Math.min(rr,1)))*h/1.1+.35,0,1);
    let br,bg,bb;
    if(tex){const lon=Math.atan2(nx,nz)+rot,lat=Math.asin(hgtrCl(-ny,-1,1)),u=((lon/6.2831853+.5)%1+1)%1,v=.5-lat/3.1415927,ti=(((v*tex.h)|0)*tex.w+((u*tex.w)|0))*4;br=tex.d[ti];bg=tex.d[ti+1];bb=tex.d[ti+2]}
    else if(C.pearl){const t=nx*.55+ny*.45+nz*.25,ph=C.hue||0;br=C.c[0]+22*Math.sin(6.28*t+ph);bg=C.c[1]+22*Math.sin(6.28*t+ph+2.1);bb=C.c[2]+24*Math.sin(6.28*t+ph+4.2)}
    else{br=C.c[0];bg=C.c[1];bb=C.c[2]}
    const df=Math.max(0,nx*Lx+ny*Ly+nz*Lz),k=.3+.74*df+Math.max(0,ny)*.1,rim=Math.pow(1-nz,3)*.42;
    const nh=Math.max(0,nx*hx+ny*hy+nz*hz),sp=Math.pow(nh,70)*1.15+Math.pow(nh,9)*.15,win=Math.max(0,1-Math.hypot(nx-.34,ny-.4)*4.2)*.1;
    let r,g,b;
    if(glow){const gl=glow>=1?1:glow,e=(.74+.28*nz)*(1-gl)+(.84+.2*nz)*gl;r=br*e+(255-br)*(.32*nz*nz*gl+.1);g=bg*e+(255-bg)*(.32*nz*nz*gl+.1);b=bb*e+(255-bb)*(.32*nz*nz*gl+.1);r*=k*.5+.62;g*=k*.5+.62;b*=k*.5+.62}
    else{r=br*k+(br*.4+110)*rim;g=bg*k+(bg*.4+110)*rim;b=bb*k+(bb*.4+110)*rim}
    r+=255*(sp+win);g+=255*(sp+win);b+=255*(sp+win);
    const o=(py*N+px)*4;D1[o]=r>255?255:r;D1[o+1]=g>255?255:g;D1[o+2]=b>255?255:b;D1[o+3]=al*255;
    const dk=glow?.55:.15+.1*df;D2[o]=br*dk*.8;D2[o+1]=bg*dk*.85;D2[o+2]=bb*dk*1.05+6;D2[o+3]=al*255;
  }
  lx.putImageData(I1,0,0);dx.putImageData(I2,0,0);
  m={lit,dark};if(!(C.tex&&!tex))HGTR.img[ci]=m;return m;
}
function hgtrHalo(ci){
  let c=HGTR.halo[ci];if(c)return c;const C=HGTR_PAL[ci].c;c=hgtrMk(96);const x=c.getContext('2d'),g=x.createRadialGradient(48,48,0,48,48,48);
  g.addColorStop(0,'rgba('+C[0]+','+C[1]+','+C[2]+',.85)');g.addColorStop(.35,'rgba('+C[0]+','+C[1]+','+C[2]+',.32)');g.addColorStop(1,'rgba('+C[0]+','+C[1]+','+C[2]+',0)');x.fillStyle=g;x.fillRect(0,0,96,96);return HGTR.halo[ci]=c;
}
/* star picture: bright core, soft glow and a four point flare (a light effect, drawn additively) */
function hgtrStarImg(ci){
  let c=HGTR.starImgs[ci];if(c)return c;const C=HGTR_SC[ci%HGTR_SC.length],S=96;c=hgtrMk(S);const x=c.getContext('2d'),h=S/2,rgb=C[0]+','+C[1]+','+C[2];
  let g=x.createRadialGradient(h,h,0,h,h,h);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.08,'rgba('+rgb+',.95)');g.addColorStop(.25,'rgba('+rgb+',.38)');g.addColorStop(.6,'rgba('+rgb+',.08)');g.addColorStop(1,'rgba('+rgb+',0)');
  x.fillStyle=g;x.fillRect(0,0,S,S);x.globalCompositeOperation='lighter';
  for(const [w,hh] of [[S,2.4],[2.4,S]]){const gg=x.createLinearGradient(h-(w>hh?h:0),h-(w>hh?0:h),h+(w>hh?h:0),h+(w>hh?0:h));gg.addColorStop(0,'rgba('+rgb+',0)');gg.addColorStop(.5,'rgba(255,255,255,.7)');gg.addColorStop(1,'rgba('+rgb+',0)');x.fillStyle=gg;x.fillRect(h-w/2,h-hh/2,w,hh)}
  return HGTR.starImgs[ci]=c;
}
function hgtrPoolImg(ci){
  let c=HGTR.poolImgs[ci];if(c)return c;const C=HGTR_SC[ci%HGTR_SC.length];c=hgtrMk(64);const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32),rgb=C[0]+','+C[1]+','+C[2];
  g.addColorStop(0,'rgba('+rgb+',.62)');g.addColorStop(.45,'rgba('+rgb+',.22)');g.addColorStop(1,'rgba('+rgb+',0)');x.fillStyle=g;x.fillRect(0,0,64,64);return HGTR.poolImgs[ci]=c;
}
/* draw an image into the visible column runs only (walls in front hide the rest). ty = depth of the thing, mg = margin */
function hgtrBlit(img,dx,dy,dw,dh,ty,mg){
  const xa=Math.max(0,Math.floor(dx)),xb=Math.min(VW-1,Math.ceil(dx+dw)-1);if(xb<xa||dw<=0.2)return false;
  const lim=ty-mg;let hid=false;for(let x=xa;x<=xb;x++)if(zbuf[x]<=lim){hid=true;break}
  if(!hid){SC.drawImage(img,dx,dy,dw,dh);return true}
  const k=img.width/dw;let x=xa,any=false;
  while(x<=xb){while(x<=xb&&zbuf[x]<=lim)x++;if(x>xb)break;const s=x;while(x<=xb&&zbuf[x]>lim)x++;
    const a=Math.max(s,dx),b=Math.min(x,dx+dw);if(b-a<.3)continue;SC.drawImage(img,(a-dx)*k,0,(b-a)*k,img.height,a,dy,b-a,dh);any=true}
  return any;
}

/* ---------- the rooms: table ---------- */
/* spec: id,kind,name,w,d,wh (wall and ceiling height),door:{x,y,face:'N'|'S'|'W'|'E'},wall:[tile names],floor,floor2,fmap(fn x,y->0|1),look,decor,sim|stars (builder functions, below) */
const HGTR_LOBBY_N=[4961,4962,4963,4964,4965,4966,4967,4968],HGTR_LOBBY_S=[4970,4971,4972,4973,4974,4975,4976];
const HGTR_LD={};HGTR_LOBBY_N.forEach((id,i)=>HGTR_LD[id]={x:3+3*i,y:0});HGTR_LOBBY_S.forEach((id,i)=>HGTR_LD[id]={x:3+4*i,y:8});
for(const id in HGTR_LD){const q=HGTR_LD[id];HGTR.lobbyFront[id]=q.y===0?{x:q.x,y:1,f:2}:{x:q.x,y:7,f:0}}
const HGTR_SPHERE_LOOK={ambient:.76,haze:.08,hazeRate:.01,hazeCol:[196,176,236],roofHaze:[120,100,170],tint:[1,1,1.04],lamp:[1,.82,.58],wallGain:.98,wallSat:1.35,wallAO:.35,floorGain:.8,floorContrast:1.4,floorSat:1.2,motes:10,vignette:.32,grade:[255,246,255,.1],pano:0};
const HGTR_STAR_LOOK={ambient:.07,haze:.32,hazeRate:.006,hazeCol:[5,6,18],roofHaze:[3,3,10],tint:[.88,.94,1.2],lamp:[1,.8,.6],wallGain:1.5,wallSat:1.5,wallAO:.5,floorGain:1.15,floorContrast:1.5,floorSat:1.3,roofGain:.12,roofTint:[.6,.7,1.3],motes:0,vignette:.6,grade:[230,235,255,.08],pano:0,starMask:65535,starGain:.3};
const HGTR_DEF=[
 {id:4960,kind:'lobby',name:'Hall of Spheres and Stars',w:29,d:9,wh:3,door:{x:28,y:4,face:'E'},wall:['hgt_wp','hgt_wl'],floor:'hgt_f5',look:'sphere',start:{x:14,y:4,f:2}},
 {id:4961,kind:'sphere',name:'The Ball Pit',w:8,d:8,wh:2.7,door:{x:4,y:7,face:'S'},wall:['hgt_wa','hgt_wc'],floor:'hgt_f1',look:'sphere',sim:'pit'},
 {id:4962,kind:'sphere',name:'The Hall of Giant Spheres',w:17,d:15,wh:4.8,door:{x:8,y:14,face:'S'},wall:['hgt_wl','hgt_wp'],floor:'hgt_f6',look:'sphere',sim:'giants'},
 {id:4963,kind:'sphere',name:'The Floating Sphere Hall',w:19,d:13,wh:4.2,door:{x:9,y:12,face:'S'},wall:['hgt_wc','hgt_wa'],floor:'hgt_f3',look:'sphere',sim:'float'},
 {id:4964,kind:'sphere',name:'The Pearl Pool',w:15,d:15,wh:3,door:{x:7,y:14,face:'S'},wall:['hgt_wc','hgt_wp'],floor:'hgt_f5',floor2:'hgt_f2',look:'sphere',sim:'pearl',pool:{x0:5,y0:5,x1:9,y1:9},terr:true,hmax:0,heights:(h,w,d)=>{for(let y=0;y<d;y++)for(let x=0;x<w;x++)h[y*w+x]=(x>=5&&x<=9&&y>=5&&y<=9)?-.4:(x>=4&&x<=10&&y>=4&&y<=10)?-.2:0}},
 {id:4965,kind:'sphere',name:'The Rainbow Corridor',w:33,d:5,wh:2.7,door:{x:0,y:2,face:'W'},wall:['hgt_wb1','hgt_wb0'],floor:'hgt_f5',look:'sphere',sim:'rainbow'},
 {id:4966,kind:'sphere',name:'The Orb Nursery',w:15,d:13,wh:3,door:{x:7,y:12,face:'S'},wall:['hgt_wl','hgt_wa'],floor:'hgt_f7',look:'nursery',sim:'nursery',lookx:{floorGain:.5,floorContrast:1.2,floorSat:.8}},
 {id:4967,kind:'sphere',name:'The Sphere Court',w:23,d:17,wh:6,door:{x:11,y:16,face:'S'},wall:['hgt_wp','hgt_wc'],floor:'hgt_f6',look:'sphere',sim:'court'},
 {id:4968,kind:'sphere',name:'The Marble Gallery',w:27,d:9,wh:3.4,door:{x:13,y:8,face:'S'},wall:['hgt_wc','hgt_wl'],floor:'hgt_f5',look:'sphere',sim:'marble'},
 {id:4970,kind:'star',name:'The Planetarium',w:19,d:19,wh:6.6,door:{x:9,y:18,face:'S'},wall:['hgt_wl','hgt_wl'],floor:'hgt_f1',look:'star',stars:'planetarium'},
 {id:4971,kind:'star',name:'The Star Stair',w:9,d:31,wh:6,door:{x:4,y:30,face:'S'},wall:['hgt_wl','hgt_wl'],floor:'hgt_f4',look:'star',stars:'stair',terr:true,lookx:{ambient:.16,lipGain:1.1,floorGain:.95,riserGain:.85,lipW:.07,footAO:.5,floorContrast:1.35},hmax:7.2,heights:(h,w,d)=>{for(let y=0;y<d;y++)for(let x=0;x<w;x++)h[y*w+x]=HGTR_STAIR_H(y)}},
 {id:4972,kind:'star',name:'The Gathering Room',w:17,d:17,wh:4,door:{x:8,y:16,face:'S'},wall:['hgt_wl','hgt_wl'],floor:'hgt_f1',look:'star',stars:'gather'},
 {id:4973,kind:'star',name:'The Lantern Stars',w:15,d:15,wh:5.6,door:{x:7,y:14,face:'S'},wall:['hgt_wl','hgt_wl'],floor:'hgt_f1',look:'star',stars:'lanterns'},
 {id:4974,kind:'star',name:'The Firefly Room',w:15,d:13,wh:3.2,door:{x:7,y:12,face:'S'},wall:['hgt_wl','hgt_wl'],floor:'hgt_f1',look:'star',stars:'fireflies'},
 {id:4975,kind:'star',name:'The Vast Star Hall',w:33,d:25,wh:7.4,door:{x:16,y:24,face:'S'},wall:['hgt_wl','hgt_wl'],floor:'hgt_f1',look:'star',stars:'vast'},
 {id:4976,kind:'star',name:'The Moon Observatory',w:11,d:11,wh:4.6,door:{x:5,y:10,face:'S'},wall:['hgt_wl','hgt_wl'],floor:'hgt_f1',look:'star',stars:'moon'}];
function hgtrEntryOf(R){const d=R.door,f=d.face;return f==='S'?{x:d.x,y:d.y-1,f:0}:f==='N'?{x:d.x,y:d.y+1,f:2}:f==='W'?{x:d.x+1,y:d.y,f:1}:{x:d.x-1,y:d.y,f:3}}
function hgtrRoom(id,o){
  o=o||{};const R=HGTR.rooms[id]=Object.assign(HGTR.rooms[id]||{},o,{id});
  if(o.name)LEVEL_NAMES[id]=o.name;
  const e=o.entry||(R.door?hgtrEntryOf(R):{x:1,y:1,f:0}),db=R.door||o.doorBack||{x:e.x,y:e.y},item={id,kind:R.kind||'room',name:R.name||('Room '+id),entry:{x:e.x,y:e.y,f:e.f|0},doorBack:{x:db.x,y:db.y}};
  R.entry=item.entry;const ix=HGTROOMS.findIndex(q=>q.id===id);if(ix>=0)HGTROOMS[ix]=item;else HGTROOMS.push(item);
  if(!R._reg){R._reg=1;hgtRegister(id,hgtrBuildLevel)}
  return R;
}
for(const R of HGTR_DEF)hgtrRoom(R.id,R);

/* ---------- where the door back leads ---------- */
function hgtrSetReturn(id,city,cell){
  const r={to:city,x:cell.x,y:cell.y,f:cell.f|0};HGTR.ret[id]=r;
  if(typeof G!=='undefined'&&G&&G.flags)(G.flags.hgtrRet=G.flags.hgtrRet||{})[id]=r;
  return r;
}
function hgtrReturnFor(id){
  const F=(typeof G!=='undefined'&&G&&G.flags)||{},prev=F.hgtrPrev&&F.hgtrPrev[id];
  if(id!==HGTR.LOBBY&&prev===HGTR.LOBBY&&HGTR.lobbyFront[id]){const q=HGTR.lobbyFront[id];return{to:HGTR.LOBBY,x:q.x,y:q.y,f:q.f}}
  const r=(F.hgtrRet&&F.hgtrRet[id])||HGTR.ret[id];if(r)return r;
  const a=F.hgtrAuto&&F.hgtrAuto[id];if(a)return a;
  if(id===HGTR.LOBBY)return{to:480,x:10,y:20,f:0};
  const q=HGTR.lobbyFront[id];return q?{to:HGTR.LOBBY,x:q.x,y:q.y,f:q.f}:{to:HGTR.LOBBY,x:14,y:4,f:2};
}
{const _g=goToLevel;goToLevel=function(n,entry){
  try{if(hgtrIs(n)&&G&&G.flags&&entry){const from=LEVEL;
    if(!hgtrIs(from)){(G.flags.hgtrPrev=G.flags.hgtrPrev||{})[n]=from;
      if(G.P&&(hgtAny(from)||from===470)&&from!==n){(G.flags.hgtrAuto=G.flags.hgtrAuto||{})[n]={to:from,x:G.P.x,y:G.P.y,f:(G.P.f+2)&3}}}
    else if(from===HGTR.LOBBY)(G.flags.hgtrPrev=G.flags.hgtrPrev||{})[n]=HGTR.LOBBY;}}catch(e){console.error('hgtr goto',e)}
  return _g.apply(this,arguments)}}

/* ---------- building a room level ---------- */
function hgtrBuildLevel(id){
  const R=HGTR.rooms[id],w=R.w,d=R.d,wh=R.wh||2.7,chars={},ch=g=>{const c=hgtaChar(g);chars[c]=g;return c};
  const wa=ch(hgtaWallTile(R.wall[0],wh)),wb=ch(hgtaWallTile(R.wall[1]||R.wall[0],wh)),rows=[];
  for(let y=0;y<d;y++){const r=[];for(let x=0;x<w;x++)r.push(x===0||y===0||x===w-1||y===d-1?((x+y)%3===0?wb:wa):'.');rows.push(r)}
  const set=(x,y,c)=>{rows[y][x]=c};
  // the door back out
  const db=hgtaDoorTile(R.doorPic||'hgt_d2',R.wall[0],wh,null),dd={};
  Object.defineProperty(dd,'lvl',{get:()=>hgtrReturnFor(id).to,enumerable:true});
  Object.defineProperty(dd,'at',{get:()=>{const r=hgtrReturnFor(id);return{x:r.x,y:r.y,f:r.f|0}},enumerable:true});
  KH_DOOR[db]=dd;set(R.door.x,R.door.y,ch(db));
  const decor=[],lights=[],mapNames=[],T=R.terr;
  if(R.kind==='lobby'){ // a door to every room
    for(const rid of HGTR_LOBBY_N.concat(HGTR_LOBBY_S)){const q=HGTR_LD[rid],rr=HGTR.rooms[rid],north=q.y===0;
      const g=hgtaDoorTile(north?(rid%2?'hgt_d0':'hgt_d3'):'hgt_d2',north?'hgt_wp':'hgt_wl',wh,{lvl:rid,at:rr.entry});set(q.x,q.y,ch(g));
      mapNames.push({t:rr.name,x:q.x,y:north?2:6,k:'place'})}
    for(const [x,y] of [[2,2],[26,2],[2,6],[26,6],[14,2],[14,6],[10,4],[18,4]]){decor.push({k:'hgt_lamppost',x,y,block:false,walk:true,deco:true})}
    for(const [x,y,k] of [[1,4,'hgt_fern'],[27,2,'hgt_fern'],[27,6,'hgt_fern'],[6,4,'hgt_pearlbush'],[22,4,'hgt_pearlbush']])decor.push({k,x,y,block:false,walk:true,deco:true});
  }
  for(const q of R.decor||[])decor.push(q);
  const L={rows:rows.map(r=>r.join('')),chars,start:R.start||{x:R.entry.x,y:R.entry.y,f:R.entry.f},enemies:[],items:[],decor,lights,portals:[],floor:R.floor||'hgt_f5',ceil:'tomb',ceilH:wh,day:0,amb:R.kind==='star'?.1:.6,torchGap:1e9,noTele:true,noExtras:true,diff:(typeof HG!=='undefined'?HG.DIFF:66),name:R.name,label:R.name,mapNames};
  if(R.floor2){L.floor2=R.floor2;const f=R.fmap||(R.pool?((x,y)=>x>=R.pool.x0&&x<=R.pool.x1&&y>=R.pool.y0&&y<=R.pool.y1?1:0):null);if(f){L.fmap=[];for(let y=0;y<d;y++){let s='';for(let x=0;x<w;x++)s+=f(x,y)?'1':'0';L.fmap.push(s)}}}
  if(T){ // a terraced room (the star stair): heights per cell
    const h=new Float32Array(w*d);R.heights(h,w,d);
    for(let y=0;y<d;y++)for(let x=0;x<w;x++)if(rows[y][x]!=='.'){ // wall feet stand on the ground beside them
      let b=null;for(const [ox,oy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+ox,ny=y+oy;if(nx>=0&&ny>=0&&nx<w&&ny<d&&rows[ny][nx]==='.'){b=h[ny*w+nx];break}}if(b!==null)h[y*w+x]=b}
    L.terrace={h,roof:R.roof||wh+R.hmax};L.outdoor=false;
  }
  L.hgtr=R;
  const lk=R.look==='star'?HGTR_STAR_LOOK:R.look==='nursery'?Object.assign({},HGTR_SPHERE_LOOK,{ambient:.34,hazeCol:[60,50,110],wallGain:.8,floorGain:.9,vignette:.5,grade:[240,230,255,.14]}):HGTR_SPHERE_LOOK;
  HGTE.look[id]=Object.assign({},lk,R.lookx||{});
  return L;
}

/* ==========================================================================
   SPHERES
   ========================================================================== */
function hgtrSphereBuilder(L,R,rnd){
  const rows=L.rows,W=rows[0].length,D=rows.length,open=new Uint8Array(W*D);
  for(let y=0;y<D;y++)for(let x=0;x<W;x++)open[y*W+x]=rows[y][x]==='.'?1:0;
  const th=L.terrace?L.terrace.h:null;
  const B={W,D,open,rnd,list:[],gz:(x,y)=>th?th[(y|0)*W+(x|0)]:0};
  const o1=(x,y)=>x>=0&&y>=0&&x<W&&y<D&&open[(y|0)*W+(x|0)]===1;
  B.fits=(x,y,r)=>{const q=r*.92;return o1(x,y)&&o1(x-q,y)&&o1(x+q,y)&&o1(x,y-q)&&o1(x,y+q)};
  B.pick=pal=>{const p=Array.isArray(pal)?pal:HGTR_BRIGHT;return p[(rnd()*p.length)|0]};
  B.restZ=(x,y,r,ov)=>{let z=B.gz(x,y)+r;for(const s of B.list){const dx=x-s.x,dy=y-s.y,dd=(r+s.r)*ov,d2=dx*dx+dy*dy;if(d2<dd*dd){const zc=s.z+Math.sqrt(dd*dd-d2);if(zc>z)z=zc}}return z};
  B.add=s=>{s.hx=s.x;s.hy=s.y;s.hz=s.z;s.fl=s.fl||0;s.ph=s.ph===undefined?rnd()*6.28:s.ph;s.amp=s.amp||0;s.wf=s.wf||0;B.list.push(s);return s};
  // a lattice of spheres lying on the floor (hides the floor); then drop() piles more on top
  B.carpet=o=>{const sp=o.spacing,cnt=o.max||9999;let n=0;
    for(let y=o.y0,row=0;y<=o.y1;y+=sp*.87,row++)for(let x=o.x0+(row&1)*sp*.5;x<=o.x1;x+=sp){
      if(n>=cnt)return n;const r=o.rmin+(o.rmax-o.rmin)*rnd(),px=x+(rnd()-.5)*sp*.4,py=y+(rnd()-.5)*sp*.4;
      if(!B.fits(px,py,r))continue;if(o.keep&&!o.keep(px,py))continue;
      B.add({x:px,y:py,z:B.restZ(px,py,r,o.ov||.9),r,ci:o.colfn?o.colfn(px,py,rnd):B.pick(o.pal),fl:o.fl||0});n++}
    return n};
  B.drop=o=>{let placed=0;
    for(let k=0;k<o.n;k++){
      for(let tr=0;tr<16;tr++){
        const r=o.rmin+(o.rmax-o.rmin)*Math.pow(rnd(),o.pw||1);let x,y;
        if(o.sampler){const p=o.sampler(rnd);x=p[0];y=p[1]}else{x=o.x0+rnd()*(o.x1-o.x0);y=o.y0+rnd()*(o.y1-o.y0)}
        if(!B.fits(x,y,r))continue;if(o.keep&&!o.keep(x,y))continue;
        const z=B.restZ(x,y,r,o.ov||.9);if(z+r>(o.zmax||1))continue;
        B.add({x,y,z,r,ci:o.colfn?o.colfn(x,y,rnd):B.pick(o.pal),fl:o.fl||0,amp:o.amp,wf:o.wf});placed++;break}}
    return placed};
  // spheres hung in the air (3D separation)
  B.scatter=o=>{let placed=0;
    for(let k=0;k<o.n;k++)for(let tr=0;tr<30;tr++){
      const r=o.rmin+(o.rmax-o.rmin)*Math.pow(rnd(),o.pw||1),x=o.x0+rnd()*(o.x1-o.x0),y=o.y0+rnd()*(o.y1-o.y0),z=o.z0+rnd()*(o.z1-o.z0);
      if(!B.fits(x,y,r*1.1))continue;let ok=true;
      for(const s of B.list){const dx=x-s.x,dy=y-s.y,dz=z-s.z,dd=(r+s.r)*(o.ov||1.1);if(dx*dx+dy*dy+dz*dz<dd*dd){ok=false;break}}
      if(!ok)continue;
      const ci=o.colfn?o.colfn(x,y,rnd):B.pick(o.pal);B.add({x,y,z,r,ci,fl:2|(HGTR_PAL[ci].glow?1:0),amp:o.amp0+(o.amp1-o.amp0)*rnd(),wf:o.wf0+(o.wf1-o.wf0)*rnd()});placed++;break}
    return placed};
  return B;
}
/* the contents of each sphere room */
const HGTR_SIM={
 pit(B,rnd){ // 7x7 pit, spheres knee deep
  const pal=[0,1,2,3,4,5,6,7,0,1,2,3,4,6,9,15];
  B.carpet({x0:1.1,y0:1.1,x1:6.9,y1:6.9,spacing:.44,rmin:.15,rmax:.21,pal,ov:.95});
  B.drop({n:70,x0:1.15,y0:1.15,x1:6.85,y1:6.85,rmin:.12,rmax:.17,pal,zmax:.5,ov:.92});
  return{par:{kh:5,kz:10,damp:6,dampz:4.5,push:55,carry:2.2,reach:.62,lift:34,clear:.12,ov:.9,e:.35,relax:.5},top:2.2,far:16,snd:1};
 },
 giants(B,rnd){
  const pal=[0,2,3,5,6,7,1,9,17,18,19,20,22,23];
  let n=0;for(let k=0;k<16;k++){const r=.62+rnd()*.78,x=2.2+rnd()*12.6,y=2.2+rnd()*10.6;if(Math.abs(x-8.5)<1.4&&y>10.3)continue;if(!B.fits(x,y,r))continue;let ok=true;for(const s of B.list)if(Math.hypot(s.x-x,s.y-y)<(r+s.r)*1.03)ok=false;if(!ok)continue;
    B.add({x,y,z:r,r,ci:pal[(rnd()*pal.length)|0],fl:8,amp:.5+rnd()*.7,wf:.08+rnd()*.1});n++}
  B.carpet({x0:1.3,y0:1.3,x1:15.7,y1:13.7,spacing:1.5,rmin:.16,rmax:.24,max:40,pal:[9,15,5,6,10,16],ov:.9,keep:(x,y)=>B.list.every(s=>Math.hypot(s.x-x,s.y-y)>s.r+.3)});
  return{par:{kh:.9,kz:6,damp:3.5,dampz:3.5,push:40,carry:1.2,reach:.7,lift:6,clear:.25,ov:1,e:.2,relax:.35},top:4.4,far:24,heavy:1.6,snd:.7};
 },
 float(B,rnd){
  B.scatter({n:150,x0:1.3,y0:1.3,x1:17.7,y1:11.7,z0:.3,z1:3.5,rmin:.1,rmax:.36,pw:1.6,pal:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,9,5,6],amp0:.05,amp1:.28,wf0:.35,wf1:1.1,ov:1.18});
  return{par:{kh:1.4,kz:2.2,damp:3,dampz:2.4,push:34,carry:3.2,reach:.74,lift:1.5,clear:.2,ov:1,e:.45,relax:.4,fz:1},top:4.0,far:22,snd:1};
 },
 pearl(B,rnd){ // pearls fill a sunken basin (terraced: bed -.4, a rim step at -.2); a few lie on the walkway
  const P=HGTR.rooms[4964].pool,pal=[9,9,9,26,27,28,5,6],inB=(x,y)=>x>P.x0&&y>P.y0&&x<P.x1+1&&y<P.y1+1,inR=(x,y)=>x>P.x0-1&&y>P.y0-1&&x<P.x1+2&&y<P.y1+2;
  B.carpet({x0:P.x0+.05,y0:P.y0+.05,x1:P.x1+.95,y1:P.y1+.95,spacing:.5,rmin:.19,rmax:.26,pal,ov:.95,keep:inB});
  B.drop({n:150,x0:P.x0-.7,y0:P.y0-.7,x1:P.x1+1.7,y1:P.y1+1.7,rmin:.17,rmax:.25,pal,zmax:.22,ov:.92,keep:inR});
  B.drop({n:12,x0:1.3,y0:1.3,x1:13.7,y1:13.7,rmin:.12,rmax:.2,pal,zmax:.4,keep:(x,y)=>!(x>P.x0-1.3&&y>P.y0-1.3&&x<P.x1+2.3&&y<P.y1+2.3)});
  return{par:{kh:5,kz:10,damp:6,dampz:4.5,push:50,carry:2,reach:.58,lift:30,clear:.1,ov:.9,e:.4,relax:.5},top:2.2,far:16,snd:.8};
 },
 rainbow(B,rnd){
  const col=(x,y,r)=>{const t=hgtrCl((x-1)/31,0,.999)*HGTR_RAINBOW.length,i=t|0;return HGTR_RAINBOW[Math.min(HGTR_RAINBOW.length-1,Math.max(0,i+(r()<.18?(r()<.5?-1:1):0)))]};
  B.carpet({x0:3.3,y0:1.1,x1:31.9,y1:1.95,spacing:.52,rmin:.18,rmax:.25,colfn:col});
  B.carpet({x0:3.3,y0:3.05,x1:31.9,y1:3.9,spacing:.52,rmin:.18,rmax:.25,colfn:col});
  B.drop({n:14,x0:3.3,y0:1.1,x1:31.9,y1:1.95,rmin:.15,rmax:.22,colfn:col,zmax:.8,ov:.92});
  B.drop({n:14,x0:3.3,y0:3.05,x1:31.9,y1:3.9,rmin:.15,rmax:.22,colfn:col,zmax:.8,ov:.92});
  B.scatter({n:26,x0:3.5,y0:1.8,x1:31.5,y1:3.2,z0:.4,z1:1.7,rmin:.08,rmax:.15,colfn:col,amp0:.04,amp1:.14,wf0:.5,wf1:1,ov:1.2});
  return{par:{kh:5,kz:10,damp:6,dampz:4.5,push:55,carry:2.4,reach:.6,lift:30,clear:.12,ov:.9,e:.4,relax:.5,fz:1},top:2.3,far:20,snd:1};
 },
 nursery(B,rnd){
  const nests=[[3,3],[7.5,2.4],[12,3],[3.5,8],[11.5,8.4],[7.5,9]];
  nests.forEach(([nx,ny],ni)=>{const pal=[HGTR_GLOW[ni%7],HGTR_GLOW[(ni+2)%7],HGTR_GLOW[(ni+4)%7]],k0=B.list.length;
    B.drop({n:16,rmin:.1,rmax:.22,pal,zmax:.75,ov:.92,sampler:r=>{const a=r()*6.28,rr=Math.sqrt(r())*.85;return[nx+Math.cos(a)*rr,ny+Math.sin(a)*rr]}});
    const big=B.add({x:nx,y:ny,z:B.restZ(nx,ny,.36,.9),r:.36,ci:HGTR_GLOW[(ni*3+1)%7],fl:1});big.em=1;
    B.add({x:nx+.5,y:ny-.3,z:B.restZ(nx+.5,ny-.3,.2,.9),r:.2,ci:9,fl:0});});
  B.scatter({n:16,x0:1.5,y0:1.5,x1:13.5,y1:10.5,z0:.5,z1:2.2,rmin:.07,rmax:.15,pal:HGTR_GLOW,amp0:.06,amp1:.2,wf0:.4,wf1:.9,ov:1.3});
  return{par:{kh:4.2,kz:9,damp:5.5,dampz:4,push:42,carry:2,reach:.6,lift:20,clear:.12,ov:.9,e:.35,relax:.5},top:3,far:18,snd:.9,glowLights:1};
 },
 court(B,rnd){
  const W=23,D=17,sam=r=>{ // a point near a wall, pile thicker at the wall
    const e=r(),t=.28+(-Math.log(1-r()*.97))*1.15;let x,y;
    if(e<.34){x=1+t;y=1+r()*(D-2)}else if(e<.68){x=W-1-t;y=1+r()*(D-2)}else if(e<.84){x=1+r()*(W-2);y=1+t}else{x=1+r()*(W-2);y=D-1-t}
    return[x,y]};
  B.drop({n:270,rmin:.18,rmax:.4,pw:1.3,pal:[0,1,2,3,4,5,6,7,9,10,11,12,13,14,15,16],zmax:2.6,ov:.88,sampler:sam,keep:(x,y)=>!(Math.abs(x-11)<2.1&&y>13.4)});
  return{par:{kh:4.6,kz:9,damp:6,dampz:4.5,push:50,carry:2,reach:.64,lift:28,clear:.14,ov:.88,e:.35,relax:.5},top:5.5,far:26,snd:1};
 },
 marble(B,rnd){
  B.drop({n:20,x0:1.8,y0:1.8,x1:25.2,y1:7.2,rmin:.34,rmax:.72,pal:HGTR_MARBLE,zmax:1.6,ov:1.02,fl:8,amp:.35,wf:.12});
  B.drop({n:50,x0:1.3,y0:1.3,x1:25.7,y1:7.7,rmin:.12,rmax:.24,pal:[9,5,26,27,28,15],zmax:1,ov:1});
  B.list.forEach(s=>{if(s.fl&8){s.amp=.4+rnd()*.5;s.wf=.06+rnd()*.08}});
  return{par:{kh:1.3,kz:7,damp:4,dampz:4,push:40,carry:1.6,reach:.66,lift:10,clear:.2,ov:1,e:.3,relax:.4},top:3,far:26,heavy:.9,snd:.8};
 }};
/* ---------- the sphere world of one room ---------- */
function hgtrSphereWorld(L,R){
  const rnd=hgtrRng(R.id*7919+13),B=hgtrSphereBuilder(L,R,rnd),P=HGTR_SIM[R.sim](B,rnd),list=B.list,N=list.length;
  const S={kind:'sphere',N,x:new Float32Array(N),y:new Float32Array(N),z:new Float32Array(N),vx:new Float32Array(N),vy:new Float32Array(N),vz:new Float32Array(N),r:new Float32Array(N),hx:new Float32Array(N),hy:new Float32Array(N),hz:new Float32Array(N),
    m:new Float32Array(N),fl:new Uint8Array(N),ci:new Uint8Array(N),ph:new Float32Array(N),amp:new Float32Array(N),wf:new Float32Array(N),act:new Uint8Array(N),
    W:B.W,open:B.open,par:P.par,top:P.top,far:P.far,heavy:P.heavy||1,snd:P.snd,gz:L.terrace?L.terrace.h:null,tLast:-1,sndT:0,rollT:0,bump:0,mov:0,pvx:0,pvy:0,ppx:null,ppy:null};
  for(let i=0;i<N;i++){const s=list[i];S.x[i]=s.x;S.y[i]=s.y;S.z[i]=s.z;S.r[i]=s.r;S.hx[i]=s.hx;S.hy[i]=s.hy;S.hz[i]=s.hz;S.fl[i]=s.fl;S.ci[i]=s.ci;S.ph[i]=s.ph;S.amp[i]=s.amp;S.wf[i]=s.wf;
    S.m[i]=Math.pow(s.r/.22,2.2*S.heavy)*(s.fl&2?.5:1)+.2;if(HGTR_PAL[s.ci].glow)S.fl[i]|=1}
  S.em=[];const stepE=P.glowLights;
  for(let i=0;i<N;i++){const C=HGTR_PAL[S.ci[i]];if((C.glow&&(stepE||list[i].em))){S.em.push({i,x:S.x[i],y:S.y[i],col:C.c.map(v=>v/255*1.5),I:list[i].em?1:.6})}}
  for(const ci of new Set(S.ci)){hgtrSphereImgs(ci);if(HGTR_PAL[ci].glow)hgtrHalo(ci)}
  S.sp=new Array(N);S.sx=new Float32Array(N);S.sy=new Float32Array(N);S.sr=new Float32Array(N);S.sty=new Float32Array(N);
  for(let i=0;i<N;i++){const k=i;S.sp[i]={x:S.x[i],y:S.y[i],custom:{prep:(cx,cy,dX,dY)=>hgtrSpherePrep(S,k,cx,cy,dX,dY),draw:(cx,cy,dX,dY)=>hgtrSphereDraw(S,k,cx,cy,dX,dY)}}}
  return S;
}
function hgtrSpherePrep(S,i,cx,cy,dX,dY){
  const rx=S.x[i]-cx,ry=S.y[i]-cy,ty=dX*rx+dY*ry,r=S.r[i];
  if(ty<.28||ty>S.far)return 0;
  const f=F/ty,rad=r*f;if(rad<.6)return 0;
  const sx=VW/2*(1+(dX*ry-dY*rx)/PL/ty);if(sx+rad<0||sx-rad>VW)return 0;
  const sy=HH+((TERR_NOW?CAMZ:EYE)-S.z[i])*f;if(sy+rad<0||sy-rad>VH)return 0;
  const xa=Math.max(0,Math.floor(sx-rad)),xb=Math.min(VW-1,Math.ceil(sx+rad)),lim=ty-r*.5;let vis=false;
  for(let x=xa;x<=xb;x+=2)if(zbuf[x]>lim){vis=true;break}
  if(!vis)return 0;
  S.sx[i]=sx;S.sy[i]=sy;S.sr[i]=rad;S.sty[i]=ty;HGTR.n++;return ty;
}
function hgtrSphereDraw(S,i,cx,cy,dX,dY){const _t0=performance.now();hgtrSphereDraw0(S,i,cx,cy,dX,dY);HGTR._dm+=performance.now()-_t0}
function hgtrSphereDraw0(S,i,cx,cy,dX,dY){
  const rad=S.sr[i],sx=S.sx[i],sy=S.sy[i],ty=S.sty[i],ci=S.ci[i],C=HGTR_PAL[ci],r=S.r[i];
  let lt=0;const nl=nearL;for(let k=0;k<nl.length;k+=3){const ax=S.x[i]-nl[k],ay=S.y[i]-nl[k+1];lt+=nl[k+2]/(1+1.15*(ax*ax+ay*ay))}
  let lum=hgtrCl(.1+(S.amb+lt*.85)*1.05,0,1)/(1+ty*(S.fogK||0));
  if(C.glow)lum=Math.max(lum,.92);
  let al=1;if(r>.45){const dxp=S.x[i]-cx,dyp=S.y[i]-cy;al=hgtrCl((Math.sqrt(dxp*dxp+dyp*dyp)-r*.35)/(r*.5),0,1);if(al<.03)return}
  const im=hgtrSphereImgs(ci),x0=sx-rad,y0=sy-rad,w=rad*2,mg=r*.45;
  if(lum<.9){SC.globalAlpha=al*(lum<.18?lum/.18:1);hgtrBlit(im.dark,x0,y0,w,w,ty,mg)}
  if(lum>.18){SC.globalAlpha=al*(lum>=.9?Math.min(1,.55+lum*.5):hgtrCl((lum-.18)/.72,0,1));hgtrBlit(im.lit,x0,y0,w,w,ty,mg)}
  if(C.glow){ // a halo that pulses
    const pu=.7+.3*Math.sin(G.time*(1.2+(i%5)*.3)+S.ph[i]),hs=w*(C.glow>=1?2.7:1.9);SC.globalCompositeOperation='lighter';SC.globalAlpha=al*pu*(C.glow>=1?.6:.35);
    hgtrBlit(hgtrHalo(ci),sx-hs/2,sy-hs/2,hs,hs,ty,mg*.5);SC.globalCompositeOperation='source-over'}
  SC.globalAlpha=1;
}
/* physics */
function hgtrSphereStep(S,dt,px,py,pvx,pvy,t){
  const N=S.N,X=S.x,Y=S.y,Z=S.z,VX=S.vx,VY=S.vy,VZ=S.vz,R=S.r,HX=S.hx,HY=S.hy,HZ=S.hz,M=S.m,FL=S.fl,P=S.par,W=S.W,OP=S.open,act=S.act,gz=S.gz;
  const damp=Math.exp(-P.damp*dt),dampZ=Math.exp(-P.dampz*dt),spd=Math.hypot(pvx,pvy),camz=TERR_NOW?CAMZ:EYE,bodyTop=camz-.08;let mov=0,bumps=0,bv=0;
  for(let i=0;i<N;i++){
    const fl=FL[i];if(fl&4)continue;const r=R[i],m=M[i];let hx=HX[i],hy=HY[i],hz=HZ[i];
    if(fl&2){const a=S.amp[i],w=S.wf[i],p=S.ph[i];hz+=Math.sin(t*w+p)*a;hx+=Math.sin(t*w*.7+p*1.7)*a*.6;hy+=Math.cos(t*w*.6+p*2.3)*a*.6}
    else if(fl&8){const a=S.amp[i],w=S.wf[i],p=S.ph[i];hx+=Math.sin(t*w+p)*a;hy+=Math.cos(t*w*.83+p*1.3)*a}
    let ax=(hx-X[i])*P.kh,ay=(hy-Y[i])*P.kh,az=(hz-Z[i])*P.kz;
    const dx=X[i]-px,dy=Y[i]-py,d2=dx*dx+dy*dy,Ri=r+P.reach;let near=0;
    if(d2<Ri*Ri){const d=Math.sqrt(d2)+1e-4,pen=Ri-d,nx=dx/d,ny=dy/d,f=P.push*pen/m;
      ax+=nx*f+pvx*P.carry*pen/m;ay+=ny*f+pvy*P.carry*pen/m;
      az+=P.lift*pen*(spd+.25)*(.5+.5*Math.sin(S.ph[i]*3.1+t*3))/Math.sqrt(m);near=1;mov+=pen}
    VX[i]=(VX[i]+ax*dt)*damp;VY[i]=(VY[i]+ay*dt)*damp;VZ[i]=(VZ[i]+az*dt)*dampZ;
    const v2=VX[i]*VX[i]+VY[i]*VY[i]+VZ[i]*VZ[i];if(v2>40){const k=6.3/Math.sqrt(v2);VX[i]*=k;VY[i]*=k;VZ[i]*=k}
    act[i]=(near||v2>.0016)?1:0;
    X[i]+=VX[i]*dt;Y[i]+=VY[i]*dt;Z[i]+=VZ[i]*dt;
    // the sphere must clear the camera when it would be level with the eye
    if(Z[i]+r>bodyTop&&Z[i]-r<camz+.15){const ddx=X[i]-px,ddy=Y[i]-py,dd=Math.sqrt(ddx*ddx+ddy*ddy),Rc=r+P.clear;if(dd<Rc){const k=dd>1e-3?1/dd:0,nx=k?ddx*k:1,ny=k?ddy*k:0;X[i]=px+nx*Rc;Y[i]=py+ny*Rc;VX[i]+=nx*1.2;VY[i]+=ny*1.2;act[i]=1}}
    const gl=gz?gz[(Y[i]|0)*W+(X[i]|0)]:0;if(Z[i]<gl+r){Z[i]=gl+r;if(VZ[i]<0)VZ[i]*=-.2}
    if(Z[i]+r>S.top){Z[i]=S.top-r;if(VZ[i]>0)VZ[i]*=-.3}
  }
  // soft collisions
  const e=P.e,ov=P.ov,rl=P.relax;
  for(let i=0;i<N;i++){
    const ai=act[i],fi=FL[i]&4,ri=R[i],xi=X[i],yi=Y[i],zi=Z[i];
    for(let j=i+1;j<N;j++){
      if(!(ai|act[j]))continue;if(fi&&(FL[j]&4))continue;
      const dd=(ri+R[j])*ov,dx=X[j]-xi;if(dx>dd||dx<-dd)continue;const dy=Y[j]-yi;if(dy>dd||dy<-dd)continue;const dz=Z[j]-zi;if(dz>dd||dz<-dd)continue;
      const d2=dx*dx+dy*dy+dz*dz;if(d2>=dd*dd)continue;
      const d=Math.sqrt(d2)||1e-4,pen=dd-d,nx=dx/d,ny=dy/d,nz=dz/d,mi=fi?1e9:M[i],mj=(FL[j]&4)?1e9:M[j],wi=mj/(mi+mj),wj=1-wi,c=pen*rl;
      if(!fi){X[i]-=nx*c*wi;Y[i]-=ny*c*wi;Z[i]-=nz*c*wi}
      if(!(FL[j]&4)){X[j]+=nx*c*wj;Y[j]+=ny*c*wj;Z[j]+=nz*c*wj}
      const rv=(VX[j]-VX[i])*nx+(VY[j]-VY[i])*ny+(VZ[j]-VZ[i])*nz;
      if(rv<0){const imp=-(1+e)*rv/(1/mi+1/mj);if(!fi){VX[i]-=imp*nx/mi;VY[i]-=imp*ny/mi;VZ[i]-=imp*nz/mi}if(!(FL[j]&4)){VX[j]+=imp*nx/mj;VY[j]+=imp*ny/mj;VZ[j]+=imp*nz/mj}
        if(-rv>.45&&(ai||act[j])){bumps++;bv=Math.max(bv,-rv)}}
    }
  }
  // walls
  for(let i=0;i<N;i++){
    if(!act[i]||(FL[i]&4))continue;const rr=R[i]*.9;let x=X[i],y=Y[i];const cx=x|0,cy=y|0;
    if(cx<1||cy<1)continue;
    if(!OP[cy*W+cx-1]&&x-cx<rr){X[i]=cx+rr;if(VX[i]<0)VX[i]*=-.3}else if(!OP[cy*W+cx+1]&&cx+1-x<rr){X[i]=cx+1-rr;if(VX[i]>0)VX[i]*=-.3}
    if(!OP[(cy-1)*W+cx]&&y-cy<rr){Y[i]=cy+rr;if(VY[i]<0)VY[i]*=-.3}else if(!OP[(cy+1)*W+cx]&&cy+1-y<rr){Y[i]=cy+1-rr;if(VY[i]>0)VY[i]*=-.3}
  }
  S.mov=mov;S.bumpN=bumps;S.bumpV=bv;
}
const HGTR_NOTES=[392,440,523,587,659,784,880];
function hgtrSphereSound(S,t){
  if(typeof tone!=='function'||typeof AC==='undefined'||!AC||G.mute)return;
  if(S.mov>.02&&t-S.rollT>.34){S.rollT=t;try{nz(.2,.016*S.snd*Math.min(2,S.mov*3),'lowpass',420+Math.random()*260,200)}catch(e){}}
  if(S.bumpN>0&&t-S.sndT>.12){S.sndT=t;const f=HGTR_NOTES[(Math.random()*HGTR_NOTES.length)|0]*(S.heavy>1?.5:1)*(Math.random()<.2?2:1),v=Math.min(1,S.bumpV*.5)*S.snd;try{tone(f,f*.82,.2+.2*Math.random(),'sine',.022+.03*v)}catch(e){}}
}

/* ==========================================================================
   STARS
   ========================================================================== */
function hgtrStarBuilder(L,R,rnd){
  const W=L.rows[0].length,D=L.rows.length,B={W,D,rnd,list:[],cons:[],wh:R.wh,roomX0:1,roomX1:W-2,roomY0:1,roomY1:D-2};
  B.star=o=>{const s=Object.assign({kind:0,ci:0,size:.1,tw:1.2,a:1,pool:0,pa:.5,lt:0,ax:0,ay:0,az:1,rx:0,ry:0,rz:0,w:.1,ph:rnd()*6.28,x:0,y:0,z:0},o);if(!('ax' in o)&&'x' in o){s.ax=o.x;s.ay=o.y;s.az=o.z}B.list.push(s);return B.list.length-1};
  B.cons=B.cons;
  B.pickCi=()=>{const u=rnd();return u<.38?0:u<.58?1:u<.7?2:u<.78?3:u<.85?4:u<.92?5:u<.96?6:7};
  B.size=()=>{const u=rnd();return u<.7?.05+rnd()*.07:u<.93?.12+rnd()*.1:.24+rnd()*.2};
  // a constellation on the dome around (cx,cy,z0): points are [u,v] in units of s radians from the az/el centre
  B.domePoint=(cx,cy,z0,Rd,az,el)=>[cx+Rd*Math.cos(el)*Math.cos(az),cy+Rd*Math.cos(el)*Math.sin(az),z0+Rd*Math.sin(el)];
  return B;
}
const HGTR_CON=[ // name, points [u,v], edges
 {n:'plough',p:[[0,1.1],[.9,.9],[1.8,.7],[2.6,.4],[2.7,-.5],[3.9,-.6],[3.9,.35]],e:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]]},
 {n:'w',p:[[0,0],[1,1.1],[2,.3],[3,1.2],[4,.1]],e:[[0,1],[1,2],[2,3],[3,4]]},
 {n:'cross',p:[[0,1.6],[0,-1.6],[-1.1,.1],[1.1,.3],[.15,.1]],e:[[0,1],[2,3]]},
 {n:'hunter',p:[[-1,0],[0,.05],[1,0],[-1.4,1.7],[1.4,1.6],[-1.2,-1.7],[1.2,-1.6],[0,2.1]],e:[[0,1],[1,2],[0,3],[2,4],[0,5],[2,6],[3,7],[4,7]]},
 {n:'kite',p:[[0,2],[1.1,.6],[0,-.8],[-1.1,.6],[0,-2.3]],e:[[0,1],[1,2],[2,3],[3,0],[2,4]]},
 {n:'fish',p:[[-2,0],[-1,.8],[0,.9],[1.2,.3],[2,-.3],[1.2,-.7],[0,-.7],[-1,-.6],[2.8,.4],[2.8,-.9]],e:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[4,8],[4,9]]}];
function hgtrAddConstellations(B,mode,o){ // mode 'dome' (az/el) or 'plane' (a vertical or ceiling plane)
  const rnd=B.rnd,out=[];
  o.list.forEach((cn,k)=>{const def=HGTR_CON.find(c=>c.n===cn.n)||HGTR_CON[k%HGTR_CON.length],idx=[];
    for(const [u,v] of def.p){let pos;
      if(mode==='dome'){const az=cn.az+u*o.s/Math.cos(cn.el),el=cn.el+v*o.s;pos=B.domePoint(o.cx,o.cy,o.z0,o.Rd,az,el)}
      else if(mode==='wall'){const wl=cn.wall||'N';pos=wl==='N'?[cn.x+u*o.s,1.45,cn.z+v*o.s]:wl==='W'?[1.45,cn.y+u*o.s,cn.z+v*o.s]:[B.W-1.45,cn.y+u*o.s,cn.z+v*o.s]}
      else pos=[cn.x+u*o.s,cn.y+v*o.s*(cn.flip?-1:1),o.z];
      idx.push(B.star({ax:pos[0],ay:pos[1],az:pos[2],size:.16+rnd()*.12,ci:cn.ci!==undefined?cn.ci:B.pickCi(),tw:1+rnd(),a:.95,lt:0,kind:mode==='dome'?5:0,az0:cn.az,el0:cn.el,dome:mode==='dome'?{cx:o.cx,cy:o.cy,z0:o.z0,Rd:o.Rd,u:u,v:v,s:o.s,az:cn.az,el:cn.el}:null,cons:1}))}
    B.cons.push({idx,edges:def.e,ci:cn.ci})});
}
const HGTR_STARS={
 planetarium(B,R){
  const rnd=B.rnd,cx=9.5,cy=9.5,z0=.6,Rd=8.2,wh=R.wh;
  for(let i=0;i<150;i++){const az=rnd()*6.283,el=.04+Math.pow(rnd(),.9)*.4,p=B.domePoint(cx,cy,z0,Rd,az,el);
    B.star({ax:p[0],ay:p[1],az:p[2],size:B.size(),ci:B.pickCi(),tw:.8+rnd()*2.2,a:.55+rnd()*.45,kind:5,dome:{cx,cy,z0,Rd,az,el,u:0,v:0,s:0}})}
  hgtrAddConstellations(B,'dome',{cx,cy,z0,Rd,s:.07,list:[{n:'plough',az:.2,el:.24},{n:'w',az:1.35,el:.27},{n:'cross',az:2.5,el:.22},{n:'hunter',az:3.7,el:.24},{n:'kite',az:4.65,el:.25},{n:'fish',az:5.65,el:.22}]});
  for(let i=0;i<14;i++){const a=rnd()*6.283,r=1+rnd()*6.5;B.star({ax:cx+Math.cos(a)*r,ay:cy+Math.sin(a)*r,az:.5+rnd()*1.2,rx:.6,ry:.6,rz:.25,w:.12+rnd()*.12,size:.07+rnd()*.05,ci:B.pickCi(),pool:.9,pa:.5,lt:.55,tw:1+rnd()})}
  return{moon:{x:cx,y:cy,z:2.3,r:.85,ci:25},shoot:{every:[5,11],zlo:2.2,zhi:3.4,x0:2,x1:17,y0:2,y1:17}};
 },
 stair(B,R){
  const rnd=B.rnd,h=(y)=>HGTR_STAIR_H(y);
  const COL=[2,3,4,1,5,0]; // gold at the foot, then rose, violet, blue, aqua, white at the top
  for(let y=4;y<=28;y++){const ci=COL[Math.min(5,((28-y)/4.2)|0)];
    for(const x of [2.3,6.7])B.star({ax:x,ay:y+.5,az:h(y)+.2,size:.075,ci,tw:1.1+(y%3)*.3,a:.9,pool:.6,pa:.45,lt:y%3===0?.4:0});
    if(y%2===0)B.star({ax:4.5,ay:y+.5,az:h(y)+.1,size:.055,ci:0,tw:1.6,a:.7,pool:.35,pa:.25,lt:0})}
  for(let i=0;i<70;i++){const y=2+rnd()*27;B.star({ax:1.6+rnd()*5.8,ay:y,az:h(y)+.6+rnd()*(R.wh-1.2),rx:.3,ry:.3,rz:.3,w:.1+rnd()*.12,size:B.size(),ci:B.pickCi(),tw:1+rnd()*2,a:.5+rnd()*.5,pool:rnd()<.3?.8:0,pa:.3,lt:.3})}
  B.star({ax:4.5,ay:2.2,az:h(2)+2.2,size:.9,ci:2,tw:.5,a:1,pool:2.6,pa:.55,lt:1}); // the great star at the top
  hgtrAddConstellations(B,'wall',{s:.55,list:[{n:'w',x:2.6,z:9.4,wall:'N',ci:1},{n:'kite',x:6.3,z:9.8,wall:'N',ci:4},{n:'cross',x:4.5,z:11.5,wall:'N',ci:5}]});
  return{shoot:{every:[7,14],zlo:6,zhi:12,x0:1.5,x1:7.5,y0:3,y1:26}};
 },
 gather(B,R){
  const rnd=B.rnd;
  for(let i=0;i<64;i++){B.star({kind:1,ax:8.5,ay:8.5,az:.5+rnd()*1.5,ph:rnd()*6.28,orb:.8+rnd()*2.6,w:.25+rnd()*.5,lag:.5+rnd()*1.2,size:.07+rnd()*.07+(i<8?.08:0),ci:B.pickCi(),tw:1+rnd()*2.4,a:.9,pool:.75,pa:.42,lt:.45+(i<10?.3:0)});}
  for(let i=0;i<34;i++){B.star({ax:2+rnd()*13,ay:2+rnd()*13,az:.4+rnd()*3.2,rx:.8,ry:.8,rz:.4,w:.07+rnd()*.1,size:B.size(),ci:B.pickCi(),tw:.8+rnd()*2,a:.45+rnd()*.5,pool:rnd()<.4?.7:0,pa:.3,lt:.25})}
  return{shoot:{every:[8,16],zlo:2.5,zhi:3.6,x0:2,x1:15,y0:2,y1:15}};
 },
 lanterns(B,R){
  const rnd=B.rnd,cols=['purple','green','blue','orange','yellow','white','pink','aqua'],cm=[4,7,1,6,2,0,3,5];
  for(let i=0;i<42;i++){const a=rnd()*6.283,r=Math.sqrt(rnd())*6.2,k=(rnd()*cols.length)|0;
    B.star({kind:3,lamp:cols[k],ax:7.5+Math.cos(a)*r,ay:7.5+Math.sin(a)*r,az:.9+rnd()*(R.wh-1.8),rx:.12,ry:.12,rz:.08,w:.25+rnd()*.3,size:.22+rnd()*.14,ci:cm[k],tw:.8+rnd(),a:.8,pool:1.2,pa:.5,lt:.8,hang:R.wh})}
  for(let i=0;i<7;i++){const a=i/7*6.283;B.star({kind:3,lamp:cols[i],ax:7.5+Math.cos(a)*.8,ay:7.5+Math.sin(a)*.8,az:3.2,rx:.05,ry:.05,rz:.05,w:.3,size:.3,ci:cm[i],a:.9,pool:1.4,pa:.55,lt:.9,hang:R.wh})}
  return{shoot:null};
 },
 fireflies(B,R){
  const rnd=B.rnd;
  for(let i=0;i<120;i++){const near=i<50;B.star({kind:2,ax:near?3.5+rnd()*8:1.5+rnd()*12,ay:near?5+rnd()*6:1.5+rnd()*10,az:.25+rnd()*1.3,rx:.9+rnd()*1.2,ry:.9+rnd()*1.2,rz:.25,w:.3+rnd()*.5,f2:.5+rnd()*.7,size:.05+rnd()*.045,ci:rnd()<.6?7:rnd()<.5?2:5,tw:1.6+rnd()*2,a:1,pool:.55,pa:.45,lt:.34,blink:.3+rnd()*.5})}
  for(let i=0;i<8;i++){B.star({kind:2,ax:2+rnd()*11,ay:2+rnd()*9,az:.5+rnd()*1.2,rx:1.4,ry:1.4,rz:.3,w:.18+rnd()*.2,f2:.5,size:.12,ci:rnd()<.5?3:4,tw:1.1,a:1,pool:.9,pa:.5,lt:.6,blink:.15})}
  return{shoot:null};
 },
 vast(B,R){
  const rnd=B.rnd,wh=R.wh;
  for(let i=0;i<230;i++){const near=rnd()<.3;B.star({ax:1.5+rnd()*30,ay:1.5+rnd()*22,az:near?.4+rnd()*2.4:1.8+rnd()*(wh-2.6),rx:.3,ry:.3,rz:.3,w:.05+rnd()*.1,size:B.size()*(near?.9:1.3),ci:B.pickCi(),tw:.8+rnd()*2.4,a:.5+rnd()*.5,pool:near&&rnd()<.35?.8:0,pa:.3,lt:near?.3:.1})}
  hgtrAddConstellations(B,'wall',{s:.95,list:[{n:'plough',x:7,z:3.2,wall:'N',ci:5},{n:'hunter',x:25,z:3.5,wall:'N',ci:1},{n:'kite',x:16,z:5.4,wall:'N',ci:3},{n:'fish',y:7,z:3.6,wall:'W',ci:4},{n:'w',y:7,z:3.6,wall:'E',ci:2},{n:'cross',y:17,z:3.8,wall:'W',ci:0}]});
  B.star({ax:16.5,ay:9,az:3.1,size:1.9,ci:2,tw:.35,a:1,pool:5.2,pa:.6,lt:1.1,great:1});
  for(const [x,y] of [[3,3],[30,3],[3,21],[30,21]])B.star({ax:x,ay:y,az:4.2,size:.5,ci:5,tw:.6,a:1,pool:2.4,pa:.45,lt:.7});
  return{shoot:{every:[3.5,8],zlo:3.6,zhi:6.4,x0:2,x1:31,y0:2,y1:23}};
 },
 moon(B,R){
  const rnd=B.rnd;
  for(let i=0;i<46;i++){B.star({ax:1.5+rnd()*8,ay:1.5+rnd()*8,az:.8+rnd()*(R.wh-1.4),rx:.25,ry:.25,rz:.2,w:.08+rnd()*.1,size:B.size(),ci:B.pickCi(),tw:.8+rnd()*2.2,a:.5+rnd()*.5,pool:rnd()<.3?.7:0,pa:.3,lt:.25})}
  hgtrAddConstellations(B,'wall',{s:.42,list:[{n:'w',x:3,z:2.4,wall:'N',ci:5},{n:'kite',x:8,z:2.6,wall:'N',ci:4}]});
  return{moon:{x:5.5,y:3.2,z:1.7,r:1,ci:25},shoot:{every:[4,9],zlo:R.wh-1.8,zhi:R.wh-.5,x0:2,x1:9,y0:2,y1:9}};
 }};
function HGTR_STAIR_H(y){return y>=28?0:y<=4?7.2:(28-y)*0.3}
function hgtrStarWorld(L,R){
  const rnd=hgtrRng(R.id*6151+7),B=hgtrStarBuilder(L,R,rnd),P=HGTR_STARS[R.stars](B,R);
  // a faint star on the door back and on the corners that mark the way out
  const dr=R.door,en=R.entry;B.star({ax:dr.x+.5+(en.x-dr.x)*.38,ay:dr.y+.5+(en.y-dr.y)*.38,az:1.35,size:.12,ci:2,tw:.9,a:.8,pool:.8,pa:.4,lt:.5,mark:1});
  const S={kind:'star',gz:L.terrace?L.terrace.h:null,W:B.W,D:B.D,stars:B.list,cons:B.cons,N:B.list.length,moon:null,tLast:-1,pvx:0,pvy:0,ppx:null,ppy:null,shoot:null,shootCfg:P.shoot,nextShoot:3+rnd()*4,rnd,far:44,R,fogK:0};
  for(let k=0;k<8;k++){hgtrStarImg(k);hgtrPoolImg(k)}for(const k of [11,12,13,14,15,16,10])hgtrHalo(k);
  S.sp=[];
  S.stars.forEach((st,i)=>{st.i=i;st.tw0=.8;st.vx=0;st.vy=0;st.vz=0;st.x=st.ax;st.y=st.ay;st.z=st.az;st.sp={x:st.ax,y:st.ay,custom:{prep:(cx,cy,dX,dY)=>hgtrStarPrep(S,st,cx,cy,dX,dY),draw:(cx,cy,dX,dY)=>hgtrStarDraw(S,st,cx,cy,dX,dY)}};S.sp.push(st.sp)});
  S.consSp={x:0,y:0,custom:{prep:(cx,cy,dX,dY)=>S.cons.length?98:0,draw:(cx,cy,dX,dY)=>hgtrConsDraw(S,cx,cy,dX,dY)}};S.sp.push(S.consSp);
  S.shootSp={x:0,y:0,custom:{prep:(cx,cy,dX,dY)=>S.shoot?hgtrShootPrep(S,cx,cy,dX,dY):0,draw:(cx,cy,dX,dY)=>hgtrShootDraw(S,cx,cy,dX,dY)}};S.sp.push(S.shootSp);
  if(P.moon){ // the centrepiece: a glowing moon drawn as a sphere
    const mn=P.moon,sp=hgtrMoonSphere(S,mn);S.moon=sp;S.sp.push(sp.sp)}
  S.em=S.stars.filter(s=>s.lt>0).map(s=>({st:s,x:s.x,y:s.y,col:[0,0,0],I:s.lt}));
  if(S.moon)S.em.push({st:null,x:S.moon.x,y:S.moon.y,col:[.75,.9,1.3],I:.6,moon:true});
  for(const e of S.em)if(e.st){const c=HGTR_SC[e.st.ci%HGTR_SC.length];e.col=[c[0]/255*1.15,c[1]/255*1.15,c[2]/255*1.15]}
  return S;
}
function hgtrMoonSphere(S,mn){
  const m={x:mn.x,y:mn.y,z:mn.z,r:mn.r,ci:mn.ci,S};const T=m;
  m.sp={x:mn.x,y:mn.y,custom:{prep:(cx,cy,dX,dY)=>{
    const rx=m.x-cx,ry=m.y-cy,ty=dX*rx+dY*ry;if(ty<.3||ty>60)return 0;const f=F/ty,rad=m.r*f,sx=VW/2*(1+(dX*ry-dY*rx)/PL/ty);if(sx+rad<0||sx-rad>VW)return 0;
    const sy=HH+((TERR_NOW?CAMZ:EYE)-m.z)*f;if(sy+rad<0||sy-rad>VH)return 0;m.sx=sx;m.sy=sy;m.sr=rad;m.ty=ty;HGTR.n++;return ty},
    draw:(cx,cy,dX,dY)=>{const rad=m.sr,im=hgtrSphereImgs(m.ci),w=rad*2,ty=m.ty;SC.save();SC.globalAlpha=1;hgtrBlit(im.lit,m.sx-rad,m.sy-rad,w,w,ty,m.r*.4);
      const pu=.85+.15*Math.sin(G.time*.7),hs=w*2.8;SC.globalCompositeOperation='lighter';SC.globalAlpha=.5*pu;hgtrBlit(hgtrHalo(12),m.sx-hs/2,m.sy-hs/2,hs,hs,ty,m.r*.3);SC.restore()}}};
  return m;
}
/* star positions */
function hgtrStarUpdate(S,dt,t,px,py,pvx,pvy){
  const L=LEVELS[LEVEL],W=L.rows[0].length;
  for(const st of S.stars){
    const k=st.kind;
    if(k===0||k===3||k===4){st.x=st.ax+Math.cos(t*st.w+st.ph)*st.rx;st.y=st.ay+Math.sin(t*st.w*.83+st.ph*1.3)*st.ry;st.z=st.az+Math.sin(t*st.w*1.1+st.ph*.7)*st.rz}
    else if(k===5){ // dome: the whole sky turns slowly
      const D=st.dome,rot=t*.012,az=(D.az+(D.u?D.u*D.s/Math.cos(D.el):0)),el=D.el+(D.v?D.v*D.s:0),p=[D.cx+D.Rd*Math.cos(el)*Math.cos(az+rot),D.cy+D.Rd*Math.cos(el)*Math.sin(az+rot),D.z0+D.Rd*Math.sin(el)];st.x=p[0];st.y=p[1];st.z=p[2]}
    else if(k===2){ // firefly: a wandering loop that blinks
      st.x=st.ax+Math.sin(t*st.w+st.ph)*st.rx+Math.sin(t*st.w*2.3+st.ph*2)*st.rx*.35;st.y=st.ay+Math.cos(t*st.w*(st.f2+.3)+st.ph*1.4)*st.ry+Math.sin(t*st.w*1.9+st.ph)*st.ry*.35;st.z=st.az+Math.sin(t*st.w*1.3+st.ph*.6)*st.rz;
      if(L.rows[st.y|0]&&L.rows[st.y|0][st.x|0]!=='.'){st.x=st.ax;st.y=st.ay}}
    else if(k===1){ // follower: orbits the party, trailing behind it
      const a=t*st.w+st.ph,tx=px+Math.cos(a)*st.orb,ty=py+Math.sin(a)*st.orb*.9,tz=st.az+Math.sin(t*.7+st.ph*2)*.25;
      let gx=tx,gy=ty;const cxi=gx|0,cyi=gy|0;if(!L.rows[cyi]||L.rows[cyi][cxi]!=='.'){gx=px;gy=py}
      const kf=1-Math.exp(-dt*st.lag*1.1);st.x+=(gx-st.x)*kf;st.y+=(gy-st.y)*kf;st.z+=(tz-st.z)*kf*1.5;
      if(!(L.rows[st.y|0]&&L.rows[st.y|0][st.x|0]==='.')){st.x=px;st.y=py}}
  }
  for(const e of S.em){if(e.st){e.x=e.st.x;e.y=e.st.y;e.I=e.st.lt*e.st.tw0}}
}
function hgtrStarPrep(S,st,cx,cy,dX,dY){
  const rx=st.x-cx,ry=st.y-cy,ty=dX*rx+dY*ry;if(ty<.3||ty>S.far)return 0;
  const f=F/ty,sx=VW/2*(1+(dX*ry-dY*rx)/PL/ty),sy=HH+((TERR_NOW?CAMZ:EYE)-st.z)*f,rad=Math.max(2,st.size*f*1.15);
  if(sx+rad<0||sx-rad>VW||sy+rad<-40||sy-rad>VH+40)return 0;
  const c=hgtrCl(sx|0,0,VW-1);if(zbuf[c]<=ty-.05&&!(st.pool>0))return 0;
  // twinkle
  const t=G.time;let tw;
  if(st.kind===2){const b=Math.sin(t*st.tw+st.ph)*1.5+Math.sin(t*st.tw*.37+st.ph*3)*.6;tw=hgtrCl(b*st.blink*2+.35,0,1)*.95+.05}
  else tw=.72+.28*Math.sin(t*st.tw+st.ph)*Math.sin(t*st.tw*1.73+st.ph*2.1)+(st.great?.0:0);
  st.tw0=tw;st.sx=sx;st.sy=sy;st.ty=ty;st.rad=rad;HGTR.n++;return ty;
}
function hgtrStarDraw(S,st,cx,cy,dX,dY){const _t0=performance.now();hgtrStarDraw0(S,st,cx,cy,dX,dY);HGTR._dm+=performance.now()-_t0}
function hgtrStarDraw0(S,st,cx,cy,dX,dY){
  const ty=st.ty,sx=st.sx,sy=st.sy,tw=st.tw0,f=F/ty,camz=TERR_NOW?CAMZ:EYE;
  SC.save();SC.globalCompositeOperation='lighter';
  // the pool of light on the floor under the star
  if(st.pool>0&&ty<16){
    const fz=S.gz?S.gz[hgtrCl(st.y|0,0,S.D-1)*S.W+hgtrCl(st.x|0,0,S.W-1)]:0,hh=Math.max(.1,st.z-fz),R0=st.pool*(1+.15*hh)*(.8+.2*tw),rx=R0*f,ry=Math.min(rx*.9,Math.max(1,(camz-fz)*F*R0/(ty*ty))),fy=HH+(camz-fz)*f,al=st.pa*.55*tw/(1+.4*hh*hh)*(ty<3?ty/3:1);
    if(al>.02&&fy+ry>0&&fy-ry<VH){SC.globalAlpha=al;hgtrBlit(hgtrPoolImg(st.ci),sx-rx,fy-ry,rx*2,ry*2,ty,R0*.7)}}
  if(S.R.stars==='lanterns'&&st.kind===3){hgtrLanternDraw(S,st,tw);SC.restore();return}
  const sz=Math.max(3.4,st.size*f*2.2*(.8+.4*tw));
  SC.globalAlpha=hgtrCl(st.a*(.45+.7*tw),0,1);
  if(zbuf[hgtrCl(sx|0,0,VW-1)]>ty-.05||sz>16)hgtrBlit(hgtrStarImg(st.ci),sx-sz/2,sy-sz/2,sz,sz,ty,.05);
  SC.restore();
}
function hgtrLanternDraw(S,st,tw){
  const ty=st.ty,sx=st.sx,sy=st.sy,f=F/ty;
  // thread up to the ceiling
  const top=HH+((TERR_NOW?CAMZ:EYE)-st.hang)*f;
  if(top<sy&&zbuf[hgtrCl(sx|0,0,VW-1)]>ty-.05){SC.globalAlpha=.22;SC.strokeStyle='rgb(200,190,230)';SC.lineWidth=.6;SC.beginPath();SC.moveTo(sx,Math.max(-5,top));SC.lineTo(sx,sy-st.size*f*.5);SC.stroke()}
  const hs=st.size*f*5.2*(.85+.25*tw);SC.globalAlpha=.55*(.7+.3*tw);hgtrBlit(hgtrHalo(HGTR_LAMPHALO[st.ci%8]||10),sx-hs/2,sy-hs/2,hs,hs,ty,.1);
  SC.globalCompositeOperation='source-over';
  let im=IMG['hgt_hanglamp'];try{if(typeof hgtlmVariant==='function'&&typeof hgtlmColOf==='function'){const nm=hgtlmVariant('hgt_gardenlantern',hgtlmColOf(st.lamp));if(nm&&IMG[nm])im=IMG[nm]}}catch(e){}
  if(!im)return;const hh=st.size*f*2.4,ww=hh*im.width/im.height;SC.globalAlpha=1;hgtrBlit(im,sx-ww/2,sy-hh*.55,ww,hh,ty,.1);
  SC.globalCompositeOperation='lighter';SC.globalAlpha=.35*tw;hgtrBlit(hgtrHalo(HGTR_LAMPHALO[st.ci%8]||10),sx-hs*.25,sy-hs*.25,hs*.5,hs*.5,ty,.1);
}
const HGTR_LAMPHALO=[14,11,12,13,14,15,16,15]; // glow palette index by star colour index
/* constellation lines: faint threads between the stars, drawn in short pieces so walls hide them */
function hgtrConsDraw(S,cx,cy,dX,dY){
  const camz=TERR_NOW?CAMZ:EYE,t=G.time;SC.save();SC.globalCompositeOperation='lighter';SC.lineWidth=.7;
  for(const cn of S.cons){
    const c=HGTR_SC[(cn.ci!==undefined?cn.ci:5)%HGTR_SC.length];SC.strokeStyle='rgb('+c[0]+','+c[1]+','+c[2]+')';SC.globalAlpha=.2+.05*Math.sin(t*.6+cn.idx[0]);SC.beginPath();
    for(const [a,b] of cn.edges){const A=S.stars[cn.idx[a]],Bq=S.stars[cn.idx[b]],len=Math.hypot(Bq.x-A.x,Bq.y-A.y,Bq.z-A.z),n=Math.max(2,Math.ceil(len/.5));let pen=false,px=0,py=0;
      for(let k=0;k<=n;k++){const u=k/n,x=A.x+(Bq.x-A.x)*u,y=A.y+(Bq.y-A.y)*u,z=A.z+(Bq.z-A.z)*u,rx=x-cx,ry=y-cy,ty=dX*rx+dY*ry;
        if(ty<.3){pen=false;continue}const f=F/ty,sx=VW/2*(1+(dX*ry-dY*rx)/PL/ty),sy=HH+(camz-z)*f,vis=zbuf[hgtrCl(sx|0,0,VW-1)]>ty-.08;
        if(vis&&pen){SC.moveTo(px,py);SC.lineTo(sx,sy)}pen=vis;px=sx;py=sy}}
    SC.stroke()}
  SC.restore();
}
/* shooting stars */
function hgtrShootPrep(S,cx,cy,dX,dY){
  const s=S.shoot,rx=s.hx-cx,ry=s.hy-cy,ty=dX*rx+dY*ry;if(ty<.3)return 0;s.ty=ty;return ty;
}
function hgtrShootDraw(S,cx,cy,dX,dY){
  const s=S.shoot;if(!s)return;const camz=TERR_NOW?CAMZ:EYE;
  const pj=(x,y,z)=>{const rx=x-cx,ry=y-cy,ty=dX*rx+dY*ry;if(ty<.3)return null;const f=F/ty;return[VW/2*(1+(dX*ry-dY*rx)/PL/ty),HH+(camz-z)*f,ty]};
  const a=pj(s.hx,s.hy,s.hz),b=pj(s.hx-s.vx*.3,s.hy-s.vy*.3,s.hz-s.vz*.3);if(!a||!b)return;
  if(zbuf[hgtrCl(a[0]|0,0,VW-1)]<=a[2]-.05)return;
  const k=1-Math.abs(s.age/s.life*2-1);SC.save();SC.globalCompositeOperation='lighter';
  const g=SC.createLinearGradient(b[0],b[1],a[0],a[1]);g.addColorStop(0,'rgba(180,210,255,0)');g.addColorStop(1,'rgba(255,255,255,'+(.9*hgtrCl(k*1.6,0,1))+')');
  SC.strokeStyle=g;SC.lineWidth=1.5;SC.beginPath();SC.moveTo(b[0],b[1]);SC.lineTo(a[0],a[1]);SC.stroke();
  SC.globalAlpha=hgtrCl(k*1.6,0,1);const hs=7;SC.drawImage(hgtrStarImg(1),a[0]-hs/2,a[1]-hs/2,hs,hs);SC.restore();
}
function hgtrShootStep(S,dt,t){
  const c=S.shootCfg;if(!c)return;
  if(S.shoot){const s=S.shoot;s.age+=dt;s.hx+=s.vx*dt;s.hy+=s.vy*dt;s.hz+=s.vz*dt;if(s.age>=s.life)S.shoot=null}
  else if(t>S.nextShoot){const r=S.rnd,a=r()*6.283,sp=7+r()*5;
    S.shoot={age:0,life:.9+r()*.5,hx:c.x0+r()*(c.x1-c.x0),hy:c.y0+r()*(c.y1-c.y0),hz:c.zlo+r()*(c.zhi-c.zlo),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,vz:-1-r()*1.5};
    S.nextShoot=t+c.every[0]+r()*(c.every[1]-c.every[0]);
    try{if(typeof tone==='function'&&AC&&!G.mute){tone(2400,700,.8,'sine',.012);tone(3100,1100,.6,'sine',.006,.04)}}catch(e){}}
}
/* twinkle chimes now and then near the party */
function hgtrStarSound(S,t,px,py){
  if(typeof tone!=='function'||typeof AC==='undefined'||!AC||G.mute)return;
  if(t-(S.chT||0)<2.4+Math.random()*3)return;
  let best=null,bd=9;for(const st of S.stars){if(st.kind===2)continue;const d=(st.x-px)*(st.x-px)+(st.y-py)*(st.y-py);if(d<bd&&st.tw0>.9){bd=d;best=st}}
  if(best){S.chT=t;const f=[1568,1760,2093,2349,2637][(Math.random()*5)|0];try{tone(f,f*.99,1.1,'sine',.006+.004*(1-bd/9))}catch(e){}}
}

/* ==========================================================================
   LIGHT SLOTS: the engine only lights the walls and floor from LIGHTS; seven slots follow the nearest glowing things with a soft fade
   ========================================================================== */
function hgtrSlotsInit(S){
  S.slots=[];for(let k=0;k<7;k++){const l={x:0,y:0,ph:k*1.3,key:-7600-k,taken:false,red:false,free:true,calm:true,col:[1,1,1],kI:0,range2:170,hgtr:1,out:false};S.slots.push({L:l,em:-1,k:0,want:0})}
}
function hgtrSlotsUpdate(S,dt,px,py){
  const em=S.em;if(!em||!S.slots)return;const top=[],nT=9;
  for(let i=0;i<em.length;i++){const e=em[i],d=(e.x-px)*(e.x-px)+(e.y-py)*(e.y-py)-e.I*1.5;let p=top.length;if(p<nT)top.push(null);else if(d>=top[nT-1].d)continue;else p=nT-1;
    while(p>0&&top[p-1].d>d){top[p]=top[p-1];p--}top[p]={i,d}}
  for(const s of S.slots)if(s.em>=0&&!top.some(q=>q&&q.i===s.em))s.want=0;
  for(const q of top){if(!q)continue;if(S.slots.some(s=>s.em===q.i&&s.want>0))continue;const s=S.slots.find(s=>s.em<0)||S.slots.find(s=>s.want===0&&s.k<.03);if(s){s.em=q.i;s.want=1;s.k=0}}
  const kf=1-Math.exp(-dt*5);
  for(const s of S.slots){if(s.em<0){s.L.kI=0;s.L.out=true;continue}
    const e=em[s.em];s.L.x=e.x;s.L.y=e.y;s.L.col=e.col;s.L.out=false;s.k+=(s.want*e.I-s.k)*kf;s.L.kI=s.k*(S.lightK||1);if(s.want===0&&s.k<.03){s.em=-1;s.L.kI=0;s.L.out=true}}
}

/* ==========================================================================
   ATTACH TO THE LEVEL AND THE FRAME
   ========================================================================== */
function hgtrAttach(){
  const L=LEVELS[LEVEL];if(!L||!L.hgtr||HGTR.off){HGTR.S=null;return null}
  if(HGTR.S&&HGTR.S.L===L)return HGTR.S;
  const R=L.hgtr;let S=null;
  try{if(R.sim)S=hgtrSphereWorld(L,R);else if(R.stars)S=hgtrStarWorld(L,R);}catch(e){console.error('hgtr world',e);S=null}
  if(!S){HGTR.S=null;return null}
  S.L=L;S.id=R.id;S.fogK=S.kind==='star'?.012:.0;hgtrSlotsInit(S);HGTR.S=S;HGTR.stat={n:S.N||S.stars.length};return S;
}
function hgtrPartyPos(){const C=G.C;if(!C)return null;const a=C.a||0;return[C.x+.5-Math.cos(a)*.28,C.y+.5-Math.sin(a)*.28]}
function hgtrFrame(S){
  const t0=performance.now(),pp=hgtrPartyPos();if(!pp)return;
  const T=G.time||0;let dt=S.tLast<0?0:T-S.tLast;S.tLast=T;if(dt<0||dt>.25)dt=Math.min(.05,Math.abs(dt));
  const px=pp[0],py=pp[1];
  if(S.ppx!==null&&dt>0){const k=1-Math.exp(-dt*8);S.pvx+=((px-S.ppx)/dt-S.pvx)*k;S.pvy+=((py-S.ppy)/dt-S.pvy)*k}
  S.ppx=px;S.ppy=py;S.amb=hgtLookFor(LEVEL).ambient;
  const spd=Math.hypot(S.pvx,S.pvy);if(spd>8){S.pvx*=8/spd;S.pvy*=8/spd}
  if(dt>0){
    if(S.kind==='sphere'){const n=dt>.03?2:1,h=dt/n;for(let i=0;i<n;i++)hgtrSphereStep(S,h,px+S.pvx*.1,py+S.pvy*.1,S.pvx,S.pvy,T);hgtrSphereSound(S,T);
      for(const e of S.em){e.x=S.x[e.i];e.y=S.y[e.i]}}
    else{hgtrStarUpdate(S,dt,T,px,py,S.pvx,S.pvy);hgtrShootStep(S,dt,T);hgtrStarSound(S,T,px,py)}
    hgtrSlotsUpdate(S,dt,px,py)}
  S.work=performance.now()-t0;
}
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);
  try{const lv=LEVELS[LEVEL];if(lv&&lv.hgtr&&!HGTR.off){const S=hgtrAttach();if(S){
    HGTR.ms=HGTR._dm+(S.work||0);HGTR._dm=0;HGTR.n=0;hgtrFrame(S);
    for(const sl of S.slots)if(LIGHTS.indexOf(sl.L)<0)LIGHTS.push(sl.L);
    if(S.kind==='sphere'){for(let i=0;i<S.N;i++){const sp=S.sp[i];sp.x=S.x[i];sp.y=S.y[i];L.push(sp)}}
    else for(const sp of S.sp)L.push(sp)}}}catch(e){if(!HGTR._e1){HGTR._e1=1;console.error('hgtr sprites',e)}}
  return L}}
{const _su=setupLights;setupLights=function(){_su.apply(this,arguments);try{HGTR.S=null;if(hgtrIs(LEVEL)&&typeof HGTG!=='undefined')HGTG.done[LEVEL]=true;if(hgtrIs(LEVEL)&&LEVELS[LEVEL]&&LEVELS[LEVEL].hgtr){const S=hgtrAttach();if(S)for(const sl of S.slots)LIGHTS.push(sl.L)}}catch(e){console.error('hgtr lights',e)}}}
/* a faint wash of the nearest light's colour over the party's view */
{const _w=drawWeatherFx;drawWeatherFx=function(){_w.apply(this,arguments);
  try{const S=HGTR.S;if(!S||S.L!==LEVELS[LEVEL]||!S.slots)return;let r=0,g=0,b=0;
    for(const sl of S.slots){if(sl.em<0||sl.k<.02)continue;const L=sl.L,dx=L.x-S.ppx,dy=L.y-S.ppy,w=sl.k/(1+1.4*(dx*dx+dy*dy));r+=L.col[0]*w;g+=L.col[1]*w;b+=L.col[2]*w}
    const m=Math.max(r,g,b);if(m<.01)return;const k=Math.min(.16,m*.2)/m*1;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1;ctx.fillStyle='rgb('+((r*k*255*.5)|0)+','+((g*k*255*.5)|0)+','+((b*k*255*.5)|0)+')';ctx.fillRect(0,0,420,210);ctx.restore()}catch(e){}}}
