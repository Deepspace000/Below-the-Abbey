/* hgt_lib.js  (prefix hgtl)  Library of builders for the four terraced towns of the Hollow Grasslands (levels 480 to 483).
   Pure functions on a builder object. Nothing here touches the renderer, the DOM (except hgtlDebugImage) or LEVELS.

   DATA CONTRACT (as in tools/HGT_BRIEF.md)
     B = hgtlNew(W,H,seed)   B.rows[y][x]  char, '.' = open (walkable) cell, anything else = wall cell
                             B.h[y*W+x]    Float32Array, ground height of the cell (open cell floor, wall cell foot)
                             B.decor []    decor entries {k,x,y,block,walk,deco,sc,...} (kinds come from HGTL_DECOR)
                             B.portals []  {x,y,to,tx,ty,f,tex} one per door that leads to an interior level
                             B.lights  []  [x,y] glitter and lamp light spots
                             B.names   []  {t,x,y,k} map names
                             B.doors   []  {x,y,face,ax,ay,to}  door cell, direction it faces, the open cell in front of it
                             B.stairs  []  {cells:[[x,y],..],h0,rise,kind} ordered runs, used by the validator
                             B.kind    Uint8Array  0 ground, 1 stair, 2 platform or balcony, 3 bridge, 4 sunken court, 5 plaza, 6 alley, 7 terrace
                             B.secrets []  [x,y] cells of hidden nooks (designers may add a marker)
                             B.lintels []  {x,y,axis,h} gateways: open cell under an arch (a walk-through arch decor stands on it)
                             B.ignore  Set of 'x,y' open cells the validator should not report
                             B.start   {x,y,f} set it before validating (hgtlSetStart)
   Rules the library keeps: a step between two neighbouring open cells is at most HGTL.CLIMB (0.55, the engine climb rule);
   comfortable stairs rise HGTL.STEP (0.26) per cell and never more than HGTL.STEP_MAX (0.3). A wall cell stands on B.h of its cell.
   Walls cannot overhang: a wall is a solid column. Bulbs and lean are made with raised pedestals and stepped taper (see below).
   Directions: dir 0 = north (y-1), 1 = east, 2 = south, 3 = west. Local frames: hgtlXf(x,y,dir)(u,v): v goes forward in dir,
   u goes to the right of forward (north: u is east).

   WALL CHARS   HGTL_CHARS maps a role name to a placeholder char; HGTL_WH gives that role's nominal wall height. The art agent
   replaces the textures by binding chars once: hgtlBindChars(level, {oldChar:newChar,...}) or hgtlRoleMap.
   Roles: nacre_a..nacre_d (pearl pink, aqua, cream, lilac) each with _cap (11), (6), _mid (3.4), _low (1.7), _rail (0.7);
   window, window_mid; band, band_low; door_round, door_arch, door_small; pillar, pillar_low; secret; roof_pink, roof_aqua; hedge.
   hgtlTaper('a') returns [rail,low,mid,full,cap] chars of one tint, for stepped tapers.

   API additions (ENGINE2): hgtlTube, hgtlPool, hgtlStairsToNowhere (see the end of this file; data contract in hgt_engine.js, sections 7 to 9)
   API (all builders take B first; x,y are cell coords; h are heights in game units)
     hgtlNew(W,H,seed)                       new builder, all open at height 0
     hgtlR(B,a,b,k)                          seeded random 0..1 (hash2 with B.seed)
     hgtlXf(x,y,dir)                         local frame function (u,v)->[x,y]
     hgtlOpen(B,x,y,h,kind) / hgtlWall(B,x,y,ch,h) / hgtlH(B,x,y) / hgtlIsOpen(B,x,y)   primitive cell setters and getters
     hgtlFill(B,x,y,w,d,h,kind)              open rect at height h (ground, plaza, platform)
     hgtlBlock(B,x,y,w,d,ch,h)               wall rect
     hgtlBorder(B,ch,h)                      wall ring round the whole map
     hgtlStairsStraight(B,x,y,dir,len,h0,rise,opts)   straight flight, opts {width,landingEvery,landingLen,rail}; returns {x,y,h} of the next cell
     hgtlStairsPath(B,cells,h0,rise,opts)    stairs along any 4-connected cell list
     hgtlStairsCurved(B,cx,cy,r,a0,a1,h0,rise,opts)   arc of stairs (angles in radians, 0 = east, pi/2 = south), opts {width}
     hgtlSpiralStairs(B,x,y,size,h0,rise,opts)  stairs spiralling inward up a stepped conical tower, opts {gap,helix,wall,core}; returns {paths,entries,ends,top}
     hgtlTower(B,cx,cy,w,d,opts)             round or square tower with stepped taper and optional lean: opts {shape,chars,h,lean,window,windowP}
     hgtlHouse(B,x,y,w,d,face,opts)          wall block with a round door facing face; opts {tint,ch,h,to,tx,ty,f,windowP}
     hgtlBulbHouse(B,x,y,dir,opts)           9 by 9 bulb house on a balcony pedestal with front stairs and a door (centre x,y)
     hgtlGateway(B,x,y,axis,opts)            open passage cell flanked by pillars with an arch on it; axis 0 = walks north-south, 1 = east-west
     hgtlPlatform(B,x,y,w,d,h,opts)          balcony or lookout, opts {rail:ch,sides:'NESW'}
     hgtlTerrace(B,x,y,w,d,dir,h0,rise)      broad flight of terrace steps (a row of cells per step)
     hgtlAmphitheatre(B,cx,cy,r0,r1,h0,rise,opts)  rings of seats rising outward, opts {a0,a1}
     hgtlBridge(B,x0,y0,x1,y1,opts)          bridge of steps from (x0,y0) to (x1,y1) (straight or one bend), rising and falling; opts {rail,hump,h0,h1,width}
     hgtlSunkenCourt(B,x,y,dir,w,d,depth,opts)  court reached by steps down; opts {h0,stairW,house,parapet,tint,to,fountain,plants}
     hgtlSunkenHouse(B,x,y,dir,depth,opts)   small sunken yard with a house door at the bottom
     hgtlNiche(B,x,y,dir,len,h,opts)         alcove off a path, opts {secret,chest,rise}
     hgtlAlley(B,x0,y0,x1,y1,h,opts)         narrow lane cut through walls (one bend), opts {width,rise,lamps}
     hgtlPlaza(B,x,y,w,d,h,opts)             paved open space, opts {fountain,lamps,plants}
     hgtlPlantBed(B,x,y,w,d,opts)            glitter plants on open cells, opts {density,lightP}
     hgtlLampRow(B,x,y,dir,len,gap)          lamps along a line, each is a light
     hgtlDoor(B,x,y,face,opts)               turn an existing wall cell into a round door; registers the portal when opts.to is set
     hgtlName(B,x,y,t,k)                     add a map name
     hgtlSetStart(B,x,y,f)
     hgtlAssemble(B,opts)                    returns the LEVELS entry {rows,chars,start,decor,portals,lights,mapNames,terrace:{h},outdoor:true,...}
     hgtlBindChars(lv,map)                   rewrite placeholder chars in rows and chars to the art agent's chars
     hgtlReach(B,sx,sy)                      flood fill with the climb rule; returns {seen,count}
     hgtlValidate(B,sx,sy)                   {ok,unreachable:[[x,y]],doorsBad:[],steep:[],warnings:[]}
     hgtlDebugImage(B,opts)                  canvas, 6 px per cell, false colours (height bands, walls dark, stairs hatched, doors red)
     hgtlPost(canvas,port,name)              POST the canvas as jpeg to the screenshot receiver
     hgtlExampleSpire(B,x,y,seed) / hgtlExampleBulbHouse(B,x,y,seed) / hgtlExampleSunkenCourt(B,x,y,seed)   three sample structures
     hgtlSampleTown(seed)                    a 120 by 120 test town built from the library
   Owner rule: no SVG or code-drawn art ships. This file is pure data; hgtlDebugImage is a designer tool only and is never drawn in the game.
   Pushed decor kinds are named in HGTL_DECOR so the art agent can rename them in one place. */

const HGTL={STEP:.26,STEP_MAX:.3,CLIMB:.55,DIRS:[[0,-1],[1,0],[0,1],[-1,0]],
  K:{GROUND:0,STAIR:1,PLAT:2,BRIDGE:3,COURT:4,PLAZA:5,ALLEY:6,TERRACE:7}};
const HGTL_DECOR={lamp:'hgt_lamp',glitter:'hgt_glitter',fountain:'hgt_fountain',arch:'hgt_arch',chest:'hgt_chest',bench:'hgt_bench',urn:'hgt_urn',spire:'hgt_spire'};
const HGTL_CHARS={},HGTL_WH={},HGTL_ROLE={};
(function(){
  const pool='ABCEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';let n=0;
  const add=(role,wh)=>{const c=pool[n++];HGTL_CHARS[role]=c;HGTL_WH[c]=wh;HGTL_ROLE[c]=role};
  for(const t of ['a','b','c','d']){add('nacre_'+t+'_cap',11);add('nacre_'+t,6);add('nacre_'+t+'_mid',3.4);add('nacre_'+t+'_low',1.7);add('nacre_'+t+'_rail',.7)}
  add('window',6);add('window_mid',3.4);add('band',6);add('band_low',1.7);add('door_round',3.4);add('door_arch',3.4);add('door_small',2.4);
  add('pillar',7);add('pillar_low',2);add('secret',3.4);add('roof_pink',2.4);add('roof_aqua',2.4);add('hedge',1.2);
})();
function hgtlTaper(t){return ['_rail','_low','_mid','',"_cap"].map(s=>HGTL_CHARS['nacre_'+t+s])}

/* ---------- builder and primitives ---------- */
function hgtlNew(W,H,seed){const rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  return {W,H,seed:seed|0,rows,h:new Float32Array(W*H),kind:new Uint8Array(W*H),decor:[],portals:[],lights:[],names:[],doors:[],stairs:[],lintels:[],secrets:[],ignore:new Set(),start:null,occ:new Set(),lid:null,water:null,wl:null,dive:{},tubes:[],pools:[],nowhere:[]}}
function hgtlR(B,a,b,k){return hash2(a,b,B.seed+(k|0))}
function hgtlXf(x,y,dir){const f=HGTL.DIRS[dir&3],r=HGTL.DIRS[(dir+1)&3];return (u,v)=>[x+r[0]*u+f[0]*v,y+r[1]*u+f[1]*v]}
function hgtlIn(B,x,y){return x>=0&&y>=0&&x<B.W&&y<B.H}
function hgtlIsOpen(B,x,y){return hgtlIn(B,x,y)&&B.rows[y][x]==='.'}
function hgtlH(B,x,y){return hgtlIn(B,x,y)?B.h[y*B.W+x]:0}
function hgtlOpen(B,x,y,h,kind){if(!hgtlIn(B,x,y))return false;B.rows[y][x]='.';if(h!==undefined&&h!==null)B.h[y*B.W+x]=h;B.kind[y*B.W+x]=kind|0;return true}
function hgtlWall(B,x,y,ch,h){if(!hgtlIn(B,x,y))return false;B.rows[y][x]=ch;if(h!==undefined&&h!==null)B.h[y*B.W+x]=h;B.kind[y*B.W+x]=0;return true}
function hgtlFill(B,x,y,w,d,h,kind){for(let j=0;j<d;j++)for(let i=0;i<w;i++)hgtlOpen(B,x+i,y+j,h,kind)}
function hgtlBlock(B,x,y,w,d,ch,h){for(let j=0;j<d;j++)for(let i=0;i<w;i++)hgtlWall(B,x+i,y+j,ch,h)}
function hgtlBorder(B,ch,h){for(let x=0;x<B.W;x++){hgtlWall(B,x,0,ch,h);hgtlWall(B,x,B.H-1,ch,h)}for(let y=0;y<B.H;y++){hgtlWall(B,0,y,ch,h);hgtlWall(B,B.W-1,y,ch,h)}}
function hgtlName(B,x,y,t,k){B.names.push({t,x,y,k:k||'place'})}
function hgtlSetStart(B,x,y,f){B.start={x,y,f:f|0}}
function hgtlDecor(B,k,x,y,o){B.decor.push(Object.assign({k,x,y,block:false},o||{}))}
function hgtlLight(B,x,y){B.lights.push([x,y])}
function hgtlRegRun(B,cells,h0,rise,kind){B.stairs.push({cells,h0,rise,kind:kind||'stairs'})}

/* ---------- stairs ---------- */
/* heights along an ordered 4-connected cell list: cell i is at h0+(i+1)*rise; flat cells (landings) repeat the last height */
function hgtlStairsPath(B,cells,h0,rise,opts){opts=opts||{};let h=h0;const out=[];
  cells.forEach((c,i)=>{const flat=c[2]===1;if(!flat)h+=rise;hgtlOpen(B,c[0],c[1],h,HGTL.K.STAIR);out.push([c[0],c[1]])});
  hgtlRegRun(B,out,h0,rise,'path');return {x:cells.length?cells[cells.length-1][0]:0,y:cells.length?cells[cells.length-1][1]:0,h}}
function hgtlStairsStraight(B,x,y,dir,len,h0,rise,opts){opts=opts||{};const f=HGTL.DIRS[dir&3],r=HGTL.DIRS[(dir+1)&3],w=opts.width||1,le=opts.landingEvery||0,ll=opts.landingLen||2;
  let h=h0,px=x,py=y,rising=0,flatLeft=0;const lanes=[];for(let l=0;l<w;l++)lanes.push([]);
  for(let i=0;i<len;i++){let flat=false;if(flatLeft>0){flat=true;flatLeft--}else if(le&&rising>=le){flat=true;flatLeft=ll-1;rising=0}else rising++;
    if(!flat)h+=rise;
    for(let l=0;l<w;l++){const cx=px+r[0]*l,cy=py+r[1]*l;hgtlOpen(B,cx,cy,h,flat?HGTL.K.PLAT:HGTL.K.STAIR);lanes[l].push([cx,cy])}
    if(opts.rail){const rc=HGTL_CHARS[opts.rail]||opts.rail;for(const s of [-1,w]){const cx=px+r[0]*s,cy=py+r[1]*s;if(hgtlIsOpen(B,cx,cy)&&B.kind[cy*B.W+cx]===0)hgtlWall(B,cx,cy,rc,h)}}
    px+=f[0];py+=f[1]}
  lanes.forEach(l=>hgtlRegRun(B,l,h0,rise,'straight'));return {x:px,y:py,h}}
function hgtlStairsCurved(B,cx,cy,r,a0,a1,h0,rise,opts){opts=opts||{};const w=opts.width||1,cells=new Map();const arc=Math.abs(a1-a0)*r,N=Math.max(1,Math.ceil(arc));
  const lanes=[];
  for(let l=0;l<w;l++){const rr=r+l,lane=[];let px=null,py=null;const da=(a1-a0)>0?1:-1;
    for(let a=a0;da>0?a<=a1+1e-9:a>=a1-1e-9;a+=da*(.4/rr)){const x=Math.round(cx+rr*Math.cos(a)),y=Math.round(cy+rr*Math.sin(a));if(x===px&&y===py)continue;
      if(px!==null&&x!==px&&y!==py){const m1=[x,py],m2=[px,y],d1=Math.abs(Math.hypot(m1[0]-cx,m1[1]-cy)-rr),d2=Math.abs(Math.hypot(m2[0]-cx,m2[1]-cy)-rr),m=d1<=d2?m1:m2;lane.push(m)}
      lane.push([x,y]);px=x;py=y}
    lanes.push(lane)}
  const hOf=(x,y)=>{let a=Math.atan2(y-cy,x-cx);let t=(a-a0)/(a1-a0);t=((t%1)+1)%1;if(Math.abs(a-a0)<1e-9)t=0;const da=a1-a0;let tt=(a-a0);if(da>0){while(tt<-1e-6)tt+=Math.PI*2}else{while(tt>1e-6)tt-=Math.PI*2}t=tt/da;t=Math.max(0,Math.min(1,t));return h0+rise*(1+Math.floor(t*(N-1)+1e-6))};
  let endH=h0,end=null;
  lanes.forEach(lane=>{const ord=[];lane.forEach(c=>{const hh=hOf(c[0],c[1]);hgtlOpen(B,c[0],c[1],hh,HGTL.K.STAIR);ord.push([c[0],c[1]]);if(hh>=endH){endH=hh;end=c}});hgtlRegRun(B,ord,h0,rise,'curved')});
  return {x:end?end[0]:cx,y:end?end[1]:cy,h:endH}}

/* square spiral of stairs climbing inward through a size x size box; the cells between lanes become low walls (gap 1)
   opts {gap:1|0, helix:false, wall:char (default nacre_a_low), core:char or null (tall spire cells at the middle)} */
function hgtlSpiralStairs(B,x,y,size,h0,rise,opts){opts=opts||{};const gap=opts.gap===undefined?1:opts.gap,x1=x+size-1,y1=y+size-1,vis=new Set(),K=(a,b)=>a+','+b,inBox=(a,b)=>a>=x&&b>=y&&a<=x1&&b<=y1;
  const mk=(sx,sy,d)=>({x:sx,y:sy,d,p:[[sx,sy]],alive:true});
  const ws=[mk(x,y,1)];if(opts.helix)ws.push(mk(x1,y1,3));
  ws.forEach(w=>vis.add(K(w.x,w.y)));
  const can=(w,nx,ny)=>{if(!inBox(nx,ny)||vis.has(K(nx,ny)))return false;if(!gap)return true;for(const dd of HGTL.DIRS){const ax=nx+dd[0],ay=ny+dd[1];if(ax===w.x&&ay===w.y)continue;if(vis.has(K(ax,ay)))return false}return true};
  let any=true,guard=0;
  while(any&&guard++<20000){any=false;for(const w of ws){if(!w.alive)continue;let moved=false;
    for(let t=0;t<2&&!moved;t++){const d=(w.d+t)&3,dd=HGTL.DIRS[d],nx=w.x+dd[0],ny=w.y+dd[1];if(can(w,nx,ny)){w.d=d;w.x=nx;w.y=ny;vis.add(K(nx,ny));w.p.push([nx,ny]);moved=true}}
    if(moved)any=true;else w.alive=false}}
  const cellH=new Map();
  const paths=ws.map(w=>{let h=h0;w.p.forEach(c=>{h+=rise;hgtlOpen(B,c[0],c[1],h,HGTL.K.STAIR);cellH.set(K(c[0],c[1]),h)});hgtlRegRun(B,w.p.map(c=>[c[0],c[1]]),h0,rise,'spiral');return w.p});
  const top=Math.max(...[...cellH.values()]);
  const wallCh=opts.wall||HGTL_CHARS.nacre_a_low;
  if(wallCh!==null){for(let j=y;j<=y1;j++)for(let i=x;i<=x1;i++){if(vis.has(K(i,j)))continue;let m=1e9;for(const dd of HGTL.DIRS){const v=cellH.get(K(i+dd[0],j+dd[1]));if(v!==undefined&&v<m)m=v}
    if(m===1e9){for(const dd of [[1,1],[1,-1],[-1,1],[-1,-1]]){const v=cellH.get(K(i+dd[0],j+dd[1]));if(v!==undefined&&v<m)m=v}}
    hgtlWall(B,i,j,wallCh,m===1e9?top:m)}}
  return {paths,entries:ws.map(w=>w.p[0]),ends:ws.map(w=>w.p[w.p.length-1]),top,cellH}}

/* ---------- towers and houses ---------- */
/* chars run from the outer ring (short) to the middle (tall): a stepped taper. opts {shape:'round'|'square', chars, h, lean:[lx,ly] 0..1, window:ch, windowP} */
function hgtlTower(B,cx,cy,w,d,opts){opts=opts||{};const round=(opts.shape||'round')==='round',chars=opts.chars||hgtlTaper('a').slice(1),n=chars.length,lean=opts.lean||[0,0];
  const h=opts.h!==undefined?opts.h:hgtlH(B,cx,cy),x0=cx-(w>>1),y0=cy-(d>>1),inside=(i,j)=>{if(!round)return i>=0&&j>=0&&i<w&&j<d;const u=(i+.5-w/2)/(w/2),v=(j+.5-d/2)/(d/2);return u*u+v*v<=1.02};
  const cells=[];
  for(let j=0;j<d;j++)for(let i=0;i<w;i++){if(!inside(i,j))continue;let u=(i+.5-w/2)/(w/2),v=(j+.5-d/2)/(d/2),band;
    if(round)band=1-Math.hypot(u,v);else band=Math.min(i,j,w-1-i,d-1-j)/(Math.min(w,d)/2);
    band+=(lean[0]*u+lean[1]*v)*.5;let k=Math.floor(band*n);k=Math.max(0,Math.min(n-1,k));
    let ch=chars[k];const edge=!inside(i-1,j)||!inside(i+1,j)||!inside(i,j-1)||!inside(i,j+1);
    if(opts.window&&edge&&k>=1&&hgtlR(B,x0+i,y0+j,31)<(opts.windowP||.25))ch=opts.window;
    hgtlWall(B,x0+i,y0+j,ch,h);cells.push([x0+i,y0+j])}
  return cells}
function hgtlDoor(B,x,y,face,opts){opts=opts||{};const dd=HGTL.DIRS[face&3];hgtlWall(B,x,y,opts.ch||HGTL_CHARS.door_round);
  const door={x,y,face:face&3,ax:x+dd[0],ay:y+dd[1],to:opts.to===undefined?null:opts.to};B.doors.push(door);
  if(opts.to!==undefined&&opts.to!==null)B.portals.push({x,y,to:opts.to,tx:opts.tx||0,ty:opts.ty||0,f:opts.f||0,tex:opts.tex||'hgt_door'});return door}
function hgtlHouse(B,x,y,w,d,face,opts){opts=opts||{};const t=opts.tint||'abcd'[(hgtlR(B,x,y,5)*4)|0],ch=opts.ch||HGTL_CHARS['nacre_'+t+'_mid'],h=opts.h!==undefined?opts.h:hgtlH(B,x,y);
  for(let j=0;j<d;j++)for(let i=0;i<w;i++){const edge=i===0||j===0||i===w-1||j===d-1;let c=ch;if(edge&&hgtlR(B,x+i,y+j,41)<(opts.windowP===undefined?.22:opts.windowP))c=HGTL_CHARS.window_mid;hgtlWall(B,x+i,y+j,c,h)}
  if(opts.roof)for(let j=0;j<d;j++)for(let i=0;i<w;i++)if(!(i===0||j===0||i===w-1||j===d-1))hgtlWall(B,x+i,y+j,HGTL_CHARS[opts.roof],h);
  const f=face&3,dx=f===1?w-1:f===3?0:(w>>1),dy=f===2?d-1:f===0?0:(d>>1);
  return hgtlDoor(B,x+dx,y+dy,f,{to:opts.to,tx:opts.tx,ty:opts.ty,f:opts.f})}

/* a bulb house: tall middle core and spire, a wide ring of mid wall standing on a balcony pedestal at ledge height, stairs up to the balcony at the front.
   Centre (x,y), front faces dir, footprint 9 by 9 plus the stairs. opts {tint,ledge,to,tx,ty,f}. Returns {door,balcony:h,stairs end} */
function hgtlBulbHouse(B,x,y,dir,opts){opts=opts||{};const t=opts.tint||'abcd'[(hgtlR(B,x,y,7)*4)|0],tp=hgtlTaper(t),c=hgtlXf(x,y,dir),h0=opts.h0!==undefined?opts.h0:hgtlH(B,x,y);
  const ledge=opts.ledge||(1.2+hgtlR(B,x,y,8)*1.4),n=Math.max(1,Math.ceil(ledge/HGTL.STEP)-1),hb=h0+ledge;
  for(let v=-4;v<=4;v++)for(let u=-4;u<=4;u++){const cd=Math.max(Math.abs(u),Math.abs(v)),[px,py]=c(u,v);
    if(cd<=1){hgtlWall(B,px,py,u===0&&v===0?tp[4]:tp[3],hb)}
    else if(cd===2){hgtlWall(B,px,py,hgtlR(B,px,py,9)<.3?HGTL_CHARS.window_mid:tp[2],hb)}
    else if(cd===3){hgtlOpen(B,px,py,hb,HGTL.K.PLAT)}
    else{hgtlWall(B,px,py,tp[0],hb)}}
  const run=[];for(let j=0;j<n;j++){const [px,py]=c(0,4+j);hgtlOpen(B,px,py,hb-(j+1)*ledge/(n+1),HGTL.K.STAIR);run.push([px,py]);
    for(const s of [-1,1]){const [rx,ry]=c(s,4+j);if(hgtlIsOpen(B,rx,ry)&&B.kind[ry*B.W+rx]===0)hgtlWall(B,rx,ry,tp[0],hb-(j+1)*ledge/(n+1))}}
  run.reverse();hgtlRegRun(B,run,h0,ledge/(n+1),'bulb');
  const [dx,dy]=c(0,2),face=dir&3;const door=hgtlDoor(B,dx,dy,face,{to:opts.to,tx:opts.tx,ty:opts.ty,f:opts.f});
  return {door,hb,ground:h0,stairLen:n}}

/* ---------- arches, platforms, terraces ---------- */
/* open passage cell with pillars either side and an arch decor over it. axis 0 = the passage runs north-south, 1 = east-west; opts {width,pillar,h} */
function hgtlGateway(B,x,y,axis,opts){opts=opts||{};const w=opts.width||1,pc=opts.pillar||HGTL_CHARS.pillar,h=opts.h!==undefined?opts.h:hgtlH(B,x,y),lat=axis===0?[1,0]:[0,1];
  for(let i=0;i<w;i++){const px=x+lat[0]*i,py=y+lat[1]*i;hgtlOpen(B,px,py,h,0);hgtlDecor(B,HGTL_DECOR.arch,px,py,{walk:true,deco:true});B.lintels.push({x:px,y:py,axis,h})}
  hgtlWall(B,x-lat[0],y-lat[1],pc,h);hgtlWall(B,x+lat[0]*w,y+lat[1]*w,pc,h)}
/* opts {rail:char role or char, sides:'NESW' string of sides that get a low wall (default none)} */
function hgtlPlatform(B,x,y,w,d,h,opts){opts=opts||{};hgtlFill(B,x,y,w,d,h,HGTL.K.PLAT);const rc=opts.rail?(HGTL_CHARS[opts.rail]||opts.rail):null,s=opts.sides||'';
  if(rc){for(let i=0;i<w;i++){if(s.includes('N'))hgtlWall(B,x+i,y,rc,h);if(s.includes('S'))hgtlWall(B,x+i,y+d-1,rc,h)}for(let j=0;j<d;j++){if(s.includes('W'))hgtlWall(B,x,y+j,rc,h);if(s.includes('E'))hgtlWall(B,x+w-1,y+j,rc,h)}}}
/* broad steps: a row of cells (width w across) per step, starting at (x,y), running d rows in dir; each row rise higher */
function hgtlTerrace(B,x,y,w,d,dir,h0,rise){const f=HGTL.DIRS[dir&3],r=HGTL.DIRS[(dir+1)&3],lanes=[];for(let i=0;i<w;i++)lanes.push([]);
  for(let j=0;j<d;j++)for(let i=0;i<w;i++){const px=x+f[0]*j+r[0]*i,py=y+f[1]*j+r[1]*i;hgtlOpen(B,px,py,h0+rise*(j+1),HGTL.K.TERRACE);lanes[i].push([px,py])}
  lanes.forEach(l=>hgtlRegRun(B,l,h0,rise,'terrace'));return h0+rise*d}
/* seats rise outward from the stage (dist<r0 at h0). opts {a0,a1} restrict to an angle range (0 = east, pi/2 = south) */
function hgtlAmphitheatre(B,cx,cy,r0,r1,h0,rise,opts){opts=opts||{};const a0=opts.a0,a1=opts.a1;
  for(let j=Math.floor(cy-r1);j<=Math.ceil(cy+r1);j++)for(let i=Math.floor(cx-r1);i<=Math.ceil(cx+r1);i++){const dd=Math.hypot(i-cx,j-cy);if(dd>=r1)continue;
    if(a0!==undefined){let a=Math.atan2(j-cy,i-cx)-a0;a=((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2);if(a>(a1-a0))continue}
    hgtlOpen(B,i,j,dd<r0?h0:h0+rise*(1+Math.floor(dd-r0)),dd<r0?HGTL.K.PLAZA:HGTL.K.TERRACE)}}

/* ---------- bridges ---------- */
/* steps from (x0,y0) to (x1,y1) with at most one bend (horizontal first). Heights go from h0 up to a hump and down to h1.
   opts {h0,h1,hump,rail,width}. The end cells should already be open at about h0 and h1. */
function hgtlBridge(B,x0,y0,x1,y1,opts){opts=opts||{};const cells=[];let x=x0,y=y0;const sx=Math.sign(x1-x0),sy=Math.sign(y1-y0);
  while(x!==x1){x+=sx;cells.push([x,y])}while(y!==y1){y+=sy;cells.push([x,y])}
  const h0=opts.h0!==undefined?opts.h0:hgtlH(B,x0,y0),h1=opts.h1!==undefined?opts.h1:hgtlH(B,x1,y1),n=cells.length;if(!n)return;
  const need=Math.max(0,(Math.abs(h1-h0)+2*(opts.hump||0.6))/HGTL.STEP_MAX),hump=n>=need?(opts.hump===undefined?.6:opts.hump):Math.max(0,(n*HGTL.STEP_MAX-Math.abs(h1-h0))/2);
  const rc=opts.rail?(HGTL_CHARS[opts.rail]||opts.rail):null,w=opts.width||1,run=[];
  cells.forEach((c,i)=>{const t=(i+1)/(n+1),hh=h0+(h1-h0)*t+hump*Math.sin(Math.PI*t);
    const horiz=i<Math.abs(x1-x0),lat=horiz?[0,1]:[1,0];
    for(let l=0;l<w;l++){hgtlOpen(B,c[0]+lat[0]*l,c[1]+lat[1]*l,hh,HGTL.K.BRIDGE)}
    if(rc)for(const s of [-1,w]){const rx=c[0]+lat[0]*s,ry=c[1]+lat[1]*s;if(hgtlIsOpen(B,rx,ry)&&B.kind[ry*B.W+rx]===0&&Math.abs(hgtlH(B,rx,ry)-hh)>HGTL.CLIMB)hgtlWall(B,rx,ry,rc,hh)}
    run.push([c[0],c[1]])});
  hgtlRegRun(B,run,h0,(h1-h0)/(n+1),'bridge')}

/* ---------- sunken courts and houses ---------- */
/* origin (x,y) is the court corner on the rim, frame faces dir (stairs go forward into the court). w across, d deep. opts {h0,stairW,stairAt,house,parapet,tint,to,tx,ty,f,fountain,plants} */
function hgtlSunkenCourt(B,x,y,dir,w,d,depth,opts){opts=opts||{};const c=hgtlXf(x,y,dir),h0=opts.h0!==undefined?opts.h0:hgtlH(B,x,y),floor=h0-depth,n=Math.max(1,Math.ceil(depth/HGTL.STEP)),sw=Math.min(w,opts.stairW||2),su=opts.stairAt!==undefined?opts.stairAt:((w-sw)>>1),t=opts.tint||'a';
  for(let v=0;v<d;v++)for(let u=0;u<w;u++){const [px,py]=c(u,v);hgtlOpen(B,px,py,floor,HGTL.K.COURT)}
  const lanes=[];for(let l=0;l<sw;l++)lanes.push([]);
  for(let v=0;v<n&&v<d;v++)for(let l=0;l<sw;l++){const [px,py]=c(su+l,v);hgtlOpen(B,px,py,h0-depth*(v+1)/n,HGTL.K.STAIR);lanes[l].push([px,py])}
  lanes.forEach(l=>hgtlRegRun(B,l,h0,-depth/n,'down'));
  if(opts.parapet){const pc=HGTL_CHARS[opts.parapet]||opts.parapet;for(let v=-1;v<=d;v++)for(let u=-1;u<=w;u++){if(u>=0&&u<w&&v>=0&&v<d)continue;if(v===-1&&u>=su&&u<su+sw)continue;const [px,py]=c(u,v);if(hgtlIsOpen(B,px,py)&&B.kind[py*B.W+px]===0)hgtlWall(B,px,py,pc,hgtlH(B,px,py))}}
  let door=null;
  if(opts.house&&d>=n+5&&w>=5){const hd=3,tp=hgtlTaper(t);for(let v=d-hd;v<d;v++)for(let u=1;u<w-1;u++){const [px,py]=c(u,v);hgtlWall(B,px,py,(v===d-hd&&u!==(w>>1)&&hgtlR(B,px,py,13)<.4)?HGTL_CHARS.window_mid:tp[2],floor)}
    const [dx,dy]=c(w>>1,d-hd);door=hgtlDoor(B,dx,dy,(dir+2)&3,{to:opts.to,tx:opts.tx,ty:opts.ty,f:opts.f})}
  if(opts.fountain){const [fx,fy]=c(w>>1,Math.max(n+1,(d>>1)));if(hgtlIsOpen(B,fx,fy)&&B.kind[fy*B.W+fx]===HGTL.K.COURT){hgtlDecor(B,HGTL_DECOR.fountain,fx,fy,{block:true});}}
  if(opts.plants){for(let v=n;v<d-(opts.house?3:0);v++)for(let u=0;u<w;u++){const [px,py]=c(u,v);if(B.kind[py*B.W+px]===HGTL.K.COURT&&(u===0||u===w-1)&&hgtlR(B,px,py,17)<.7){hgtlDecor(B,HGTL_DECOR.glitter,px,py,{walk:true,deco:true,sc:.9+hgtlR(B,px,py,18)*.5});if(hgtlR(B,px,py,19)<.5)hgtlLight(B,px,py)}}}
  return {floor,h0,steps:n,door}}
function hgtlSunkenHouse(B,x,y,dir,depth,opts){opts=opts||{};const n=Math.max(1,Math.ceil(depth/HGTL.STEP));return hgtlSunkenCourt(B,x,y,dir,opts.w||5,n+5,depth,Object.assign({house:true,stairW:2},opts))}

/* ---------- nooks, alleys, plazas, plants, lamps ---------- */
/* alcove of len cells going in dir from (x,y); the cell behind (x,y) should be walkable. h = height of the first cell, rise per cell. opts {secret,chest,rise} */
function hgtlNiche(B,x,y,dir,len,h,opts){opts=opts||{};const f=HGTL.DIRS[dir&3],rise=opts.rise||0;let px=x,py=y;
  for(let i=0;i<len;i++){hgtlOpen(B,px,py,h+rise*i,HGTL.K.ALLEY);if(opts.secret)B.secrets.push([px,py]);px+=f[0];py+=f[1]}
  px-=f[0];py-=f[1];if(opts.chest)hgtlDecor(B,HGTL_DECOR.chest,px,py,{block:true,sc:.8});return [px,py]}
/* narrow lane (one bend: horizontal then vertical), cut through whatever is there. opts {width,rise,lamps} */
function hgtlAlley(B,x0,y0,x1,y1,h,opts){opts=opts||{};let x=x0,y=y0,i=0;const w=opts.width||1,rise=opts.rise||0,sx=Math.sign(x1-x0),sy=Math.sign(y1-y0),cells=[],put=(px,py)=>{const hh=h+rise*i;for(let l=0;l<w;l++){const horiz=px!==x1||py===y0&&sx!==0,lx=horiz?0:l,ly=horiz?l:0;hgtlOpen(B,px+lx,py+ly,hh,HGTL.K.ALLEY)}cells.push([px,py]);i++};
  put(x,y);while(x!==x1){x+=sx;put(x,y)}while(y!==y1){y+=sy;put(x,y)}
  if(rise)hgtlRegRun(B,cells,h,rise,'alley');
  if(opts.lamps){for(let k=2;k<cells.length-1;k+=opts.lamps){const c=cells[k];hgtlDecor(B,HGTL_DECOR.lamp,c[0],c[1],{walk:true,deco:true});hgtlLight(B,c[0],c[1])}}return cells}
function hgtlPlaza(B,x,y,w,d,h,opts){opts=opts||{};hgtlFill(B,x,y,w,d,h,HGTL.K.PLAZA);
  if(opts.fountain)hgtlDecor(B,HGTL_DECOR.fountain,x+(w>>1),y+(d>>1),{block:true});
  if(opts.lamps)for(const [px,py] of [[x,y],[x+w-1,y],[x,y+d-1],[x+w-1,y+d-1]]){hgtlDecor(B,HGTL_DECOR.lamp,px,py,{walk:true,deco:true});hgtlLight(B,px,py)}
  if(opts.plants)hgtlPlantBed(B,x+1,y+1,w-2,d-2,{density:.18,h:h});}
function hgtlPlantBed(B,x,y,w,d,opts){opts=opts||{};const den=opts.density===undefined?.5:opts.density,lp=opts.lightP===undefined?.4:opts.lightP;
  for(let j=0;j<d;j++)for(let i=0;i<w;i++){const px=x+i,py=y+j;if(!hgtlIsOpen(B,px,py)||B.kind[py*B.W+px]===HGTL.K.STAIR||B.occ.has(px+','+py))continue;if(opts.h!==undefined&&Math.abs(hgtlH(B,px,py)-opts.h)>.01)continue;
    if(hgtlR(B,px,py,21)>=den)continue;hgtlDecor(B,HGTL_DECOR.glitter,px,py,{walk:true,deco:true,sc:.8+hgtlR(B,px,py,22)*1.2,ox:(hgtlR(B,px,py,23)-.5)*.6,oy:(hgtlR(B,px,py,24)-.5)*.6});if(hgtlR(B,px,py,25)<lp)hgtlLight(B,px,py)}}
function hgtlLampRow(B,x,y,dir,len,gap){const f=HGTL.DIRS[dir&3];gap=gap||3;for(let i=0;i<len;i+=gap){const px=x+f[0]*i,py=y+f[1]*i;if(hgtlIsOpen(B,px,py)){hgtlDecor(B,HGTL_DECOR.lamp,px,py,{walk:true,deco:true});hgtlLight(B,px,py)}}}

/* ---------- assembling ---------- */
/* returns a LEVELS entry. opts {name,label,start,diff,ceilH,chars,extra}. rows hold the placeholder chars until hgtlBindChars is called */
function hgtlAssemble(B,opts){opts=opts||{};const st=opts.start||B.start||{x:1,y:1,f:0};
  const lv=Object.assign({rows:B.rows.map(r=>r.join('')),chars:Object.assign({},opts.chars||{}),start:{x:st.x,y:st.y,f:st.f|0},enemies:[],items:[],decor:B.decor,scenery:[],portals:B.portals,lights:B.lights,
    mapNames:B.names.map(n=>Object.assign({},n)),terrace:Object.assign({h:B.h},B.lid?{lid:B.lid}:{},B.water?{water:B.water,wl:B.wl}:{},Object.keys(B.dive).length?{dive:B.dive}:{}),outdoor:true,day:0,name:opts.name||'Town',label:opts.label||opts.name||'Town',diff:opts.diff||1,noTele:true,hgtl:{kind:B.kind,doors:B.doors,secrets:B.secrets,lintels:B.lintels,W:B.W,H:B.H}},opts.extra||{});
  if(opts.ceilH)lv.ceilH=opts.ceilH;return lv}
/* map: {placeholderChar:newChar}; applies to lv.rows and keeps lv.chars keyed by the new chars */
function hgtlBindChars(lv,map){lv.rows=lv.rows.map(r=>{let o='';for(const ch of r)o+=(map[ch]!==undefined?map[ch]:ch);return o});return lv}

/* ---------- reachability and validation ---------- */
function hgtlBlocked(B){if(B._blk&&B._blkN===B.decor.length)return B._blk;const s=new Set();for(const d of B.decor)if(d.block&&!d.walk&&!d.deco&&(d.sc===undefined||d.sc>.01))s.add(d.x+','+d.y);B._blk=s;B._blkN=B.decor.length;return s}
function hgtlReach(B,sx,sy){const W=B.W,H=B.H,seen=new Uint8Array(W*H);if(!hgtlIsOpen(B,sx,sy))return {seen,count:0};const q=[[sx,sy]];seen[sy*W+sx]=1;let count=1,qi=0;
  while(qi<q.length){const [x,y]=q[qi++],h=B.h[y*W+x];for(const dd of HGTL.DIRS){const nx=x+dd[0],ny=y+dd[1];if(!hgtlIn(B,nx,ny)||seen[ny*W+nx]||B.rows[ny][nx]!=='.')continue;if(Math.abs(B.h[ny*W+nx]-h)>HGTL.CLIMB+1e-6)continue;seen[ny*W+nx]=1;count++;q.push([nx,ny])}}
  return {seen,count}}
function hgtlValidate(B,sx,sy){const st=B.start||{x:sx,y:sy};sx=sx===undefined?st.x:sx;sy=sy===undefined?st.y:sy;const r=hgtlReach(B,sx,sy),out={ok:true,unreachable:[],doorsBad:[],steep:[],warnings:[],reached:r.count,open:0};
  for(let y=0;y<B.H;y++)for(let x=0;x<B.W;x++)if(B.rows[y][x]==='.'){out.open++;if(!r.seen[y*B.W+x]&&!B.ignore.has(x+','+y))out.unreachable.push([x,y])}
  for(const d of B.doors){if(!hgtlIsOpen(B,d.ax,d.ay)||!r.seen[d.ay*B.W+d.ax])out.doorsBad.push({x:d.x,y:d.y,ax:d.ax,ay:d.ay})}
  for(const run of B.stairs){for(let i=1;i<run.cells.length;i++){const a=run.cells[i-1],b=run.cells[i],dh=Math.abs(hgtlH(B,b[0],b[1])-hgtlH(B,a[0],a[1]));
    if(dh>HGTL.CLIMB+1e-6)out.steep.push({x:b[0],y:b[1],dh,run:run.kind});else if(dh>HGTL.STEP_MAX+.02)out.warnings.push('step '+dh.toFixed(2)+' at '+b[0]+','+b[1]+' ('+run.kind+')')}}
  hgtlValidateExtra(B,r,out);
  out.ok=!out.unreachable.length&&!out.doorsBad.length&&!out.steep.length&&!out.tubesBad.length&&!out.poolsBad.length;return out}

/* ---------- debug image ---------- */
function hgtlDebugImage(B,opts){opts=opts||{};const S=opts.scale||6,cv=document.createElement('canvas');cv.width=B.W*S;cv.height=B.H*S;const x=cv.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,cv.width,cv.height);
  const col=h=>{const t=Math.max(0,Math.min(1,(h+3)/19)),hue=Math.round(250-250*t*.95);return 'hsl('+hue+','+(60+30*t|0)+'%,'+(28+34*t|0)+'%)'};
  for(let j=0;j<B.H;j++)for(let i=0;i<B.W;i++){const ch=B.rows[j][i],h=B.h[j*B.W+i];
    if(ch==='.'){x.fillStyle=col(h);x.fillRect(i*S,j*S,S,S);const k=B.kind[j*B.W+i];
      if(k===HGTL.K.STAIR){x.strokeStyle='rgba(0,0,0,.65)';x.lineWidth=1;x.beginPath();x.moveTo(i*S,j*S+S);x.lineTo(i*S+S,j*S);x.moveTo(i*S,j*S+S/2);x.lineTo(i*S+S/2,j*S);x.moveTo(i*S+S/2,j*S+S);x.lineTo(i*S+S,j*S+S/2);x.stroke()}
      else if(k===HGTL.K.BRIDGE){x.fillStyle='rgba(255,255,255,.35)';x.fillRect(i*S+1,j*S+1,S-2,S-2)}
      else if(k===HGTL.K.COURT){x.fillStyle='rgba(0,0,40,.25)';x.fillRect(i*S,j*S,S,S)}}
    else{const wh=HGTL_WH[ch]||4,l=10+Math.min(26,wh*3.2);x.fillStyle='hsl(280,25%,'+l+'%)';x.fillRect(i*S,j*S,S,S);if(HGTL_ROLE[ch]&&/window/.test(HGTL_ROLE[ch])){x.fillStyle='#ffe9a8';x.fillRect(i*S+2,j*S+2,S-4,S-4)}}}
  for(const d of B.doors){x.fillStyle='#ff2020';x.fillRect(d.x*S,d.y*S,S,S);x.fillStyle='#fff';x.fillRect(d.ax*S+S/2-1,d.ay*S+S/2-1,2,2)}
  for(const l of B.lights){x.fillStyle='#ffee66';x.fillRect(l[0]*S+S/2-1,l[1]*S+S/2-1,2,2)}
  for(const d of B.decor){if(d.k===HGTL_DECOR.glitter){x.fillStyle='#ff9cf0';x.fillRect(d.x*S+2,d.y*S+2,2,2)}else if(d.k===HGTL_DECOR.fountain||d.k===HGTL_DECOR.chest){x.fillStyle='#fff';x.fillRect(d.x*S+1,d.y*S+1,S-2,S-2)}else if(d.k===HGTL_DECOR.arch){x.strokeStyle='#fff';x.strokeRect(d.x*S+.5,d.y*S+.5,S-1,S-1)}}
  for(const s of B.secrets){x.fillStyle='#0f0';x.fillRect(s[0]*S+2,s[1]*S+2,2,2)}
  if(B.start){x.strokeStyle='#0ff';x.strokeRect(B.start.x*S-1,B.start.y*S-1,S+2,S+2)}
  return cv}
async function hgtlPost(cv,port,name){return fetch('http://localhost:'+port+'/'+name+'.jpg',{method:'POST',body:cv.toDataURL('image/jpeg',.9)})}

/* ---------- three example builders ---------- */
/* a tall climbable spiral tower with side rooms. (x,y) is the top-left of a 17 by 17 footprint plus a margin of 3 for balconies. Returns info */
function hgtlExampleSpire(B,x,y,seed){const s0=B.seed;if(seed!==undefined)B.seed=seed|0;const size=15,h0=hgtlH(B,x,y),tp=hgtlTaper(['a','b','c','d'][(hgtlR(B,x,y,1)*4)|0]);
  const sp=hgtlSpiralStairs(B,x,y,size,h0,.17,{gap:1,wall:tp[1]});
  // the tall spire core in the middle, a taper of three heights
  const mid=x+(size>>1),mid2=y+(size>>1),topH=sp.top;
  for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++){const px=mid+i,py=mid2+j;if(!hgtlIsOpen(B,px,py)&&B.rows[py][px]!==undefined&&!sp.cellH.has(px+','+py)){const cd=Math.max(Math.abs(i),Math.abs(j));hgtlWall(B,px,py,cd<=1?tp[4]:cd===2?tp[3]:tp[2],Math.max(hgtlH(B,px,py),topH-.6))}}
  // a door at the end of the stair, into the tower room
  const e=sp.ends[0];let door=null;for(const dd of HGTL.DIRS){const nx=e[0]+dd[0],ny=e[1]+dd[1];if(hgtlIn(B,nx,ny)&&B.rows[ny][nx]!=='.'&&sp.cellH.has(e[0]+','+e[1])&&!HGTL_ROLE[B.rows[ny][nx]].endsWith('_cap')){door=hgtlDoor(B,nx,ny,(HGTL.DIRS.findIndex(q=>q[0]===-dd[0]&&q[1]===-dd[1])),{});break}}
  // the entrance: a gateway at the foot and a lamp
  const en=sp.entries[0],ent=en[0]===x?[x-1,en[1]]:en[1]===y?[en[0],y-1]:en[0]===x+size-1?[x+size,en[1]]:[en[0],y+size];
  // side rooms: balconies and a hidden nook off the outer lane
  const side=[];let k=0;
  for(const c of sp.paths[0]){const onEdge=c[0]===x||c[1]===y||c[0]===x+size-1||c[1]===y+size-1;if(!onEdge)continue;k++;if(k%9!==4)continue;
    const dir=c[1]===y?0:c[0]===x+size-1?1:c[1]===y+size-1?2:3,f=HGTL.DIRS[dir],hh=hgtlH(B,c[0],c[1]),bx=c[0]+f[0],by=c[1]+f[1];
    if(!hgtlIn(B,bx+f[0]*2,by+f[1]*2))continue;
    if(k%2===0){hgtlNiche(B,bx,by,dir,3,hh,{secret:true,chest:true});side.push({kind:'nook',x:bx,y:by})}
    else{hgtlOpen(B,bx,by,hh,HGTL.K.PLAT);hgtlOpen(B,bx+f[0],by+f[1],hh,HGTL.K.PLAT);const r=HGTL.DIRS[(dir+1)&3];for(const t of [-1,1]){hgtlOpen(B,bx+r[0]*t,by+r[1]*t,hh,HGTL.K.PLAT);hgtlOpen(B,bx+f[0]+r[0]*t,by+f[1]+r[1]*t,hh,HGTL.K.PLAT)}
      hgtlDecor(B,HGTL_DECOR.lamp,bx+f[0],by+f[1],{walk:true,deco:true});hgtlLight(B,bx+f[0],by+f[1]);side.push({kind:'balcony',x:bx,y:by})}}
  B.seed=s0;return {top:topH,entry:{x:en[0],y:en[1]},outside:ent,door,side,height:topH-h0}}
function hgtlExampleBulbHouse(B,x,y,seed){const s0=B.seed;if(seed!==undefined)B.seed=seed|0;const dir=(hgtlR(B,x,y,3)*4)|0,r=hgtlBulbHouse(B,x,y,dir,{});
  const c=hgtlXf(x,y,dir);for(const [u,v] of [[-4,6],[4,6]]){const [px,py]=c(u,v);if(hgtlIsOpen(B,px,py)){hgtlDecor(B,HGTL_DECOR.lamp,px,py,{walk:true,deco:true});hgtlLight(B,px,py)}}
  hgtlPlantBed(B,x-6,y-6,13,13,{density:.12,h:r.ground});B.seed=s0;return Object.assign({dir},r)}
function hgtlExampleSunkenCourt(B,x,y,seed){const s0=B.seed;if(seed!==undefined)B.seed=seed|0;const dir=(hgtlR(B,x,y,4)*4)|0,r=hgtlSunkenCourt(B,x,y,dir,9,13,2.1,{house:true,stairW:2,parapet:'nacre_c_rail',fountain:true,plants:true,tint:'b'});B.seed=s0;return Object.assign({dir},r)}

/* ---------- sample town (120 by 120) ---------- */
function hgtlSampleTown(seed){const B=hgtlNew(120,120,seed===undefined?7:seed),W=120,H=120;
  hgtlBorder(B,HGTL_CHARS.nacre_c,0);
  // rolling ground: gentle terraces so heights vary
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)B.h[y*W+x]=0;
  hgtlPlaza(B,52,52,16,16,0,{fountain:true,lamps:true,plants:true});
  hgtlAmphitheatre(B,26,92,3,8,0,.22,{a0:-Math.PI,a1:0});
  const info={};
  info.spire=hgtlExampleSpire(B,84,12,11);
  info.spire2=hgtlExampleSpire(B,14,10,23);
  info.bulb=[hgtlExampleBulbHouse(B,34,50,3),hgtlExampleBulbHouse(B,90,60,5),hgtlExampleBulbHouse(B,100,96,9)];
  info.court=[hgtlExampleSunkenCourt(B,52,88,0,0,0),hgtlExampleSunkenCourt(B,70,16,5)];
  // leaning round tower and a square one
  hgtlTower(B,60,30,9,9,{shape:'round',chars:hgtlTaper('b').slice(1),h:0,lean:[.5,-.3],window:HGTL_CHARS.window_mid,windowP:.2});
  hgtlTower(B,40,28,7,7,{shape:'square',chars:hgtlTaper('d').slice(1),h:0,window:HGTL_CHARS.window,windowP:.3});
  // houses on small lanes
  const hs=[[8,36,5,4,1],[8,46,4,4,1],[18,40,4,5,2],[104,40,5,4,3],[104,50,4,4,3],[96,44,4,4,3],[40,70,5,4,0],[46,70,4,4,0],[80,70,5,5,0],[86,74,4,4,1]];
  for(const [x,y,w,d,f] of hs)hgtlHouse(B,x,y,w,d,f,{windowP:.2});
  // an arch gateway and lamp rows on the main avenue
  hgtlGateway(B,60,50,0,{width:1});hgtlLampRow(B,59,40,2,10,3);hgtlLampRow(B,61,40,2,10,3);
  // a lookout platform reached by a flight of stairs, and a bridge of steps from it to a spire balcony
  hgtlPlatform(B,66,36,3,3,3.12,{rail:'nacre_c_rail',sides:'NEW'});
  hgtlStairsStraight(B,67,50,0,12,0,.26,{width:1,rail:'nacre_c_rail'});
  hgtlTerrace(B,70,60,6,6,1,0,.2);
  hgtlAlley(B,20,60,50,60,0,{lamps:4});
  hgtlNiche(B,19,60,3,3,0,{secret:true,chest:true});
  hgtlPlantBed(B,56,56,8,8,{density:.1,h:0});
  hgtlSetStart(B,60,66,0);
  return B}


/* ==========================================================================
   COVERED TUBES, POOLS AND STAIRS THAT GO NOWHERE (ENGINE2). The engine side is described in hgt_engine.js (sections 7 to 9).
   B.lid    Float32Array(W*H)  clearance of the ceiling above the floor of a cell, 0 = open sky. Made by hgtlTube.
   B.water  Uint8Array(W*H)    0 dry, 1 shallow (wade), 2 deep (swim);   B.wl  Float32Array(W*H)  absolute height of the water surface.   Made by hgtlPool.
   B.dive   {'x,y':{to,x,y,f}}  deep cells that lead down to another level.
   ========================================================================== */
function hgtlEnsureLid(B){if(!B.lid)B.lid=new Float32Array(B.W*B.H);return B.lid}
function hgtlEnsureWater(B){if(!B.water){B.water=new Uint8Array(B.W*B.H);B.wl=new Float32Array(B.W*B.H)}return B.water}
/* hgtlTube(B,x0,y0,x1,y1,opts): a walk-through covered passage from (x0,y0) to (x1,y1) (straight, or one bend: along x first, then along y). Both ends are open mouths.
   opts {width:1 (the cells across), lid:2.4 (clearance at the edges), peak: lid+.8 (clearance in the middle of a wide tube: a stepped vault; width>=3 only, or profile:'flat'),
         profile:'vault'|'flat', h: floor height at the start (default the ground there), rise: floor rise per cell (a covered stair), wall: char or role for the side walls (default nacre_c_mid, 3.4 high),
         lampEvery:3 (a light in the tube every n cells, 0 = none)}
   Side walls stand on the floor height beside them; keep opts.lid (and peak) <= the wall height (3.4 for the default wall, 6 for a nacre_x char).
   Returns {cells:[[x,y]..], lid, peak, mouths:[[x,y],[x,y]], mouthSet:Set, wall, w}. */
function hgtlTube(B,x0,y0,x1,y1,opts){opts=opts||{};
  const lid0=opts.lid!==undefined?opts.lid:2.4,w=Math.max(1,opts.width||1),vault=(opts.profile||(w>=3?'vault':'flat'))==='vault'&&w>=3,peak=opts.peak!==undefined?opts.peak:lid0+.8,
    wallCh=opts.wall?(HGTL_CHARS[opts.wall]||opts.wall):HGTL_CHARS.nacre_c_mid,h0=opts.h!==undefined?opts.h:hgtlH(B,x0,y0),rise=opts.rise||0,le=opts.lampEvery===undefined?3:opts.lampEvery,L=hgtlEnsureLid(B);
  const path=[],sx=Math.sign(x1-x0),sy=Math.sign(y1-y0);let x=x0,y=y0;
  path.push([x,y,x1!==x0?0:1]);
  while(x!==x1){x+=sx;path.push([x,y,0])}
  while(y!==y1){y+=sy;path.push([x,y,1])}
  const lo=-((w-1)>>1),hi=w>>1,cells=new Map(),K=(a,b)=>a+','+b,lat=ax=>ax===0?[0,1]:[1,0];
  const clr=u=>{if(!vault)return lid0;const c=(w-1)/2,t=Math.max(0,Math.min(1,1-Math.abs(u-lo-c)/(c+.001)));return lid0+(peak-lid0)*Math.min(1,t*1.4)};
  const put=(cx,cy,hh,lv,i)=>{if(!hgtlIn(B,cx,cy))return;const k=K(cx,cy);if(!cells.has(k))cells.set(k,{x:cx,y:cy,h:hh,lid:lv,i})};
  path.forEach((c,i)=>{const l=lat(c[2]);for(let u=lo;u<=hi;u++)put(c[0]+l[0]*u,c[1]+l[1]*u,h0+rise*i,clr(u),i)});
  for(let k=1;k<path.length;k++)if(path[k][2]!==path[k-1][2]){const bx=path[k-1][0],by=path[k-1][1];for(let v=lo;v<=hi;v++)for(let u=lo;u<=hi;u++)put(bx+u,by+v,h0+rise*(k-1),lid0,k-1)} // the square at a bend
  const n=path.length,first=path[0],last=path[n-1],back=n>1?[Math.sign(first[0]-path[1][0]),Math.sign(first[1]-path[1][1])]:[-1,0],fwd=n>1?[Math.sign(last[0]-path[n-2][0]),Math.sign(last[1]-path[n-2][1])]:[1,0],mouth=new Set();
  for(const [c,dv] of [[first,back],[last,fwd]]){const l=dv[0]!==0?[0,1]:[1,0];for(let u=lo;u<=hi;u++)mouth.add(K(c[0]+dv[0]+l[0]*u,c[1]+dv[1]+l[1]*u))} // the cells just beyond each end stay as they are
  for(const c of cells.values()){hgtlOpen(B,c.x,c.y,c.h,HGTL.K.ALLEY);L[c.y*B.W+c.x]=c.lid}
  for(const c of cells.values())for(const d of HGTL.DIRS){const nx=c.x+d[0],ny=c.y+d[1];if(!hgtlIn(B,nx,ny)||cells.has(K(nx,ny))||mouth.has(K(nx,ny)))continue;
    const cur=B.rows[ny][nx];if(cur!=='.'&&(HGTL_WH[cur]===undefined||HGTL_WH[cur]>=c.lid+.01))continue; // a wall that is tall enough is already there
    hgtlWall(B,nx,ny,wallCh,c.h)}
  if(le>0)path.forEach((c,i)=>{if(i%le===1||(n<3&&i===0))hgtlLight(B,c[0],c[1])});
  const info={cells:[...cells.values()].map(c=>[c.x,c.y]),lid:lid0,peak:vault?peak:lid0,mouths:[[first[0],first[1]],[last[0],last[1]]],mouthSet:mouth,wall:wallCh,w};
  B.tubes.push(info);return info}

/* hgtlPool(B,x,y,w,d,opts): a pool of open cells. The rim stays at the height around it; the bed is sunk below it. Shallow cells (water 1) are waded, deep cells (water 2) are swum.
   opts {rim: height of the surrounding ground (default the ground at x,y), shallow:1 (the width of the shallow ring), deep:false (all shallow), deepRect:[x,y,w,d] (default the inside of the ring),
         shallowDepth:.3 (bed below the rim), deepDepth:.8, lead:{to,x,y,f,ret:{x,y,f}} (the deep centre leads down to that level, needs diving helms; x,y,f = where the party arrives; ret = the shallow cell the rescue brings them back to, default the west edge of the pool), leadAll:true (every deep cell leads),
         bath:true (a deep dead end with nothing below, so the validator accepts it), lamps:true (four lamps at the corners)}
   Returns {x,y,w,d,rim,cells,deep:[[x,y]..],centre:[x,y],lead,bath,surface}. The surface is rim - .06 for every cell. */
function hgtlPool(B,x,y,w,d,opts){opts=opts||{};
  const rim=opts.rim!==undefined?opts.rim:hgtlH(B,x,y),sh=opts.shallow===undefined?1:opts.shallow,sd=opts.shallowDepth===undefined?.3:opts.shallowDepth,dd=opts.deepDepth===undefined?.8:opts.deepDepth;hgtlEnsureWater(B);
  const dr=opts.deep===false?null:(opts.deepRect||[x+sh,y+sh,w-2*sh,d-2*sh]),cells=[],deep=[];
  for(let j=0;j<d;j++)for(let i=0;i<w;i++){const cx=x+i,cy=y+j;if(!hgtlIn(B,cx,cy))continue;
    const isDeep=!!dr&&dr[2]>0&&dr[3]>0&&cx>=dr[0]&&cy>=dr[1]&&cx<dr[0]+dr[2]&&cy<dr[1]+dr[3];
    hgtlOpen(B,cx,cy,rim-(isDeep?dd:sd),HGTL.K.COURT);B.water[cy*B.W+cx]=isDeep?2:1;B.wl[cy*B.W+cx]=rim-.06;cells.push([cx,cy]);if(isDeep)deep.push([cx,cy])}
  const centre=[x+(w>>1),y+(d>>1)];let lead=false;
  if(opts.lead&&deep.length){lead=true;const mid=deep.find(c=>c[0]===centre[0]&&c[1]===centre[1])||deep[(deep.length-1)>>1],list=opts.leadAll?deep:[mid];
    const ret=opts.lead.ret||{x:x,y:y+(d>>1),f:1};for(const c of list)B.dive[c[0]+','+c[1]]={to:opts.lead.to,x:opts.lead.x,y:opts.lead.y,f:opts.lead.f|0,ret:{x:ret.x,y:ret.y,f:ret.f|0}}}
  if(opts.lamps)for(const c of [[x-1,y-1],[x+w,y-1],[x-1,y+d],[x+w,y+d]])if(hgtlIsOpen(B,c[0],c[1])){hgtlDecor(B,'hg_lamp',c[0],c[1],{walk:true,deco:true});hgtlLight(B,c[0],c[1])}
  const info={x,y,w,d,rim,cells,deep,centre,lead,bath:!!opts.bath,surface:rim-.06};B.pools.push(info);return info}

/* hgtlStairsToNowhere(B,x,y,dir,variant,opts): stairs that lead to nothing. x,y is the first step, dir the way it climbs (0 north, 1 east, 2 south, 3 west).
   variant 'wall'   a flight that ends at a blank wall;
           'chair'  a flight to a small railed platform with one chair and one lamp;
           'arch'   a flight to a closed ornate arch between two pillars (the arch is a wall: it does not open);
           'window' a flight to a wall with one window, and a light at the top;
           'loop'   a ring of steps that rises and falls back to its own start (x,y is the north-west corner of the ring, opts.size 6, entered at the middle of its south side).
   opts {len:12, width:2, rise:.26, h0: start height (default the ground at x,y), tint:'a'..'d' (the wall tint)}. Returns {variant, cells, top:{x,y,h}}. Registered in B.nowhere. */
function hgtlStairsToNowhere(B,x,y,dir,variant,opts){opts=opts||{};variant=variant||'wall';
  const h0=opts.h0!==undefined?opts.h0:hgtlH(B,x,y),rise=opts.rise||HGTL.STEP,tint=opts.tint||'c',f=HGTL.DIRS[dir&3],r=HGTL.DIRS[(dir+1)&3];
  const nac=HGTL_CHARS['nacre_'+tint],rail=HGTL_CHARS['nacre_'+tint+'_rail'],at=(v,u)=>[x+f[0]*v+r[0]*u,y+f[1]*v+r[1]*u];
  let info;
  if(variant==='loop'){
    const s=opts.size||6,P=4*(s-1),ring=[];
    for(let i=0;i<s;i++)ring.push([x+i,y+s-1]);                         // the south side, west to east
    for(let j=s-2;j>=0;j--)ring.push([x+s-1,y+j]);                      // up the east side
    for(let i=s-2;i>=0;i--)ring.push([x+i,y]);                          // along the north side to the west
    for(let j=1;j<=s-2;j++)ring.push([x,y+j]);                          // down the west side
    const k0=ring.findIndex(c=>c[0]===x+(s>>1)&&c[1]===y+s-1),rot=ring.slice(k0).concat(ring.slice(0,k0)),cells=[];
    for(let a=1;a<s-1;a++)for(let b=1;b<s-1;b++)hgtlWall(B,x+a,y+b,nac,h0);
    rot.forEach((c,i)=>{hgtlOpen(B,c[0],c[1],h0+rise*Math.min(i,P-i),HGTL.K.STAIR);cells.push([c[0],c[1]])});
    hgtlRegRun(B,cells.concat([cells[0]]),h0,rise,'loop');
    const pk=rot[P>>1];info={variant,cells,top:{x:pk[0],y:pk[1],h:h0+rise*(P>>1)}};
  }else{
    const n=opts.len||12,w=opts.width||2,fl=hgtlStairsStraight(B,x,y,dir,n,h0,rise,{width:w,rail:'nacre_'+tint+'_rail'}),top=fl.h,cells=[];
    for(let v=0;v<n;v++)for(let u=0;u<w;u++)cells.push(at(v,u));
    const land=depth=>{for(let v=n;v<n+depth;v++){for(let u=0;u<w;u++)hgtlOpen(B,...at(v,u),top,HGTL.K.PLAT);for(const u of [-1,w])hgtlWall(B,...at(v,u),rail,top)}};
    const block=(v0,depth,ch)=>{for(let v=v0;v<v0+depth;v++)for(let u=-1;u<=w;u++)hgtlWall(B,...at(v,u),ch,top)};
    if(variant==='wall'){land(1);block(n+1,2,nac)}
    else if(variant==='window'){land(1);block(n+1,2,nac);for(let u=0;u<w;u++)hgtlWall(B,...at(n+1,u),HGTL_CHARS.window,top);hgtlLight(B,...at(n,0))}
    else if(variant==='arch'){land(2);block(n+3,2,nac);for(let u=0;u<w;u++)hgtlWall(B,...at(n+2,u),HGTL_CHARS.door_arch,top);for(const u of [-1,w])hgtlWall(B,...at(n+2,u),HGTL_CHARS.pillar,top);hgtlLight(B,...at(n+1,0))}
    else if(variant==='chair'){const pd=4;land(pd);for(let u=-1;u<=w;u++)hgtlWall(B,...at(n+pd,u),rail,top);
      const cu=w>>1,lu=cu===0?w-1:0,cp=at(n+pd-1,cu),lp=at(n+pd-1,lu),chair=(typeof IMG!=='undefined'&&IMG.hgt_chair)?'hgt_chair':'bench';
      hgtlDecor(B,chair,cp[0],cp[1],{block:true});
      if(lp[0]!==cp[0]||lp[1]!==cp[1]){hgtlDecor(B,'hg_lamp',lp[0],lp[1],{walk:true,deco:true});hgtlLight(B,lp[0],lp[1])}else hgtlLight(B,cp[0],cp[1])}
    else throw new Error('hgtlStairsToNowhere: unknown variant '+variant);
    info={variant,cells,top:{x:at(n,0)[0],y:at(n,0)[1],h:top}};
  }
  B.nowhere.push(Object.assign({x,y,dir},info));return info}

/* validation of tubes and pools, called by hgtlValidate. out.tubesBad: tube cells with a lid lower than 1.3 or not reachable. out.poolsBad: a pool that cannot be reached, or a lead with no cell.
   Warnings: a tube cell open to the side, a side wall lower than the lid (the sky shows above it), a deep pool that leads nowhere and is not marked bath:true. */
function hgtlValidateExtra(B,r,out){out.tubesBad=[];out.poolsBad=[];const W=B.W,K=(a,b)=>a+','+b,inTube=new Set();
  for(const t of B.tubes)for(const c of t.cells)inTube.add(K(c[0],c[1]));
  for(const t of B.tubes){let open=0,low=0,o1=null,l1=null;
    for(const [cx,cy] of t.cells){const i=cy*W+cx,lidv=B.lid?B.lid[i]:0;
      if(!r.seen[i]||lidv<1.3)out.tubesBad.push({x:cx,y:cy,lid:lidv,reached:!!r.seen[i]});
      for(const d of HGTL.DIRS){const nx=cx+d[0],ny=cy+d[1];if(!hgtlIn(B,nx,ny)||inTube.has(K(nx,ny))||t.mouthSet.has(K(nx,ny)))continue;
        const ch=B.rows[ny][nx];
        if(ch==='.'){open++;o1=o1||[nx,ny]}else if(HGTL_WH[ch]!==undefined&&HGTL_WH[ch]+1e-6<lidv){low++;l1=l1||[nx,ny]}}}
    const c0=t.cells[0];
    if(open)out.warnings.push('tube from '+c0[0]+','+c0[1]+': '+open+' side cells are open (first at '+o1+')');
    if(low)out.warnings.push('tube from '+c0[0]+','+c0[1]+': '+low+' side walls are lower than the lid (first at '+l1+'), the sky shows over them')}
  for(const p of B.pools){let seen=0;for(const [cx,cy] of p.cells)if(r.seen[cy*W+cx])seen++;
    if(!seen)out.poolsBad.push({x:p.x,y:p.y,why:'unreachable'});
    if(p.deep.length){if(p.lead){if(!p.deep.some(c=>B.dive[K(c[0],c[1])]))out.poolsBad.push({x:p.x,y:p.y,why:'lead has no cell'})}else if(!p.bath)out.warnings.push('deep pool at '+p.x+','+p.y+' leads nowhere (give it lead or bath:true)')}}
  for(const k in B.dive){const d=B.dive[k];if(d.to===undefined||d.x===undefined)out.poolsBad.push({x:k,why:'dive target incomplete'})}}
